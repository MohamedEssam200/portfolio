import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    // Get network interface statistics
    const commands = {
      interfaces: "ip -s link show",
      connections: "ss -tuln",
      routing: "ip route show",
      arp: "arp -a",
    }

    const results: any = {}

    for (const [key, command] of Object.entries(commands)) {
      try {
        const { stdout } = await execAsync(command, { timeout: 5000 })
        results[key] = stdout
      } catch (error) {
        results[key] = `Error: ${error}`
      }
    }

    // Parse network interfaces
    const interfaces = await parseNetworkInterfaces(results.interfaces)

    // Parse active connections
    const connections = await parseConnections(results.connections)

    return NextResponse.json({
      success: true,
      data: {
        interfaces,
        connections,
        raw: results,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get network statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function parseNetworkInterfaces(output: string) {
  const interfaces = []
  const lines = output.split("\n")

  let currentInterface: any = null

  for (const line of lines) {
    const interfaceMatch = line.match(/^\d+:\s+(\w+):/)
    if (interfaceMatch) {
      if (currentInterface) {
        interfaces.push(currentInterface)
      }
      currentInterface = {
        name: interfaceMatch[1],
        status: line.includes("UP") ? "up" : "down",
        type: getInterfaceType(interfaceMatch[1]),
      }
    } else if (currentInterface && line.includes("RX:")) {
      const rxMatch = line.match(/RX:\s+bytes\s+(\d+)/)
      if (rxMatch) {
        currentInterface.rx_bytes = Number.parseInt(rxMatch[1])
      }
    } else if (currentInterface && line.includes("TX:")) {
      const txMatch = line.match(/TX:\s+bytes\s+(\d+)/)
      if (txMatch) {
        currentInterface.tx_bytes = Number.parseInt(txMatch[1])
      }
    }
  }

  if (currentInterface) {
    interfaces.push(currentInterface)
  }

  return interfaces
}

async function parseConnections(output: string) {
  const connections = []
  const lines = output.split("\n").slice(1) // Skip header

  for (const line of lines) {
    if (line.trim()) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 5) {
        connections.push({
          protocol: parts[0],
          state: parts[1],
          local_address: parts[4],
          remote_address: parts[5] || "*:*",
        })
      }
    }
  }

  return connections
}

function getInterfaceType(name: string): string {
  if (name.startsWith("eth")) return "ethernet"
  if (name.startsWith("wlan") || name.startsWith("wifi")) return "wireless"
  if (name.startsWith("lo")) return "loopback"
  if (name.startsWith("docker") || name.startsWith("br-")) return "bridge"
  if (name.startsWith("tun") || name.startsWith("tap")) return "tunnel"
  return "unknown"
}
