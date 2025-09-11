import { NextResponse } from "next/server"

export async function GET() {
  try {
    const stats = {
      total_packets: Math.floor(Math.random() * 10000) + 1000,
      total_bytes: Math.floor(Math.random() * 100000000) + 10000000,
      threats_detected: Math.floor(Math.random() * 50),
      active_connections: Math.floor(Math.random() * 100) + 10,
      bandwidth_bps: Math.floor(Math.random() * 1000000) + 100000,
      monitoring: false,
      interfaces: ["eth0", "wlan0", "lo"],
      uptime: Math.floor(Math.random() * 86400) + 3600,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to get stats" }, { status: 500 })
  }
}
