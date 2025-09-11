import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { networkRange, scanType, maxThreads } = await request.json()

    if (!networkRange) {
      return NextResponse.json({ error: "Network range is required" }, { status: 400 })
    }

    const scannerPath = path.join(process.cwd(), "scripts", "iot_scanner.py")

    const args = [scannerPath, networkRange]

    if (scanType) {
      args.push("--scan-type", scanType)
    }

    if (maxThreads) {
      args.push("--threads", maxThreads.toString())
    }

    return new Promise((resolve) => {
      const pythonProcess = spawn("python3", args, {
        stdio: ["pipe", "pipe", "pipe"],
      })

      let output = ""
      let errorOutput = ""

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            // Try to extract JSON from output
            const jsonMatch = output.match(/\{[\s\S]*\}/)
            let result = null

            if (jsonMatch) {
              result = JSON.parse(jsonMatch[0])
            }

            resolve(
              NextResponse.json({
                success: true,
                result,
                output,
                scanType,
                networkRange,
              }),
            )
          } catch (parseError) {
            resolve(
              NextResponse.json({
                success: true,
                output,
                scanType,
                networkRange,
                note: "Raw output returned (no JSON found)",
              }),
            )
          }
        } else {
          resolve(
            NextResponse.json(
              {
                error: "Scan failed",
                stderr: errorOutput,
                stdout: output,
                exit_code: code,
              },
              { status: 500 },
            ),
          )
        }
      })

      // Timeout after 5 minutes for IoT scans
      setTimeout(() => {
        pythonProcess.kill()
        resolve(
          NextResponse.json(
            {
              error: "Scan timeout",
              partial_output: output,
            },
            { status: 408 },
          ),
        )
      }, 300000)
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
