import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { action, interface: networkInterface, duration } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    const analyzerPath = path.join(process.cwd(), "scripts", "network_analyzer.py")

    const args = [analyzerPath, action]

    if (action === "capture") {
      args.push(networkInterface || "eth0")
      if (duration) {
        args.push(duration.toString())
      }
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
                action,
              }),
            )
          } catch (parseError) {
            resolve(
              NextResponse.json({
                success: true,
                output,
                action,
                note: "Raw output returned (no JSON found)",
              }),
            )
          }
        } else {
          resolve(
            NextResponse.json(
              {
                error: "Analysis failed",
                stderr: errorOutput,
                stdout: output,
                exit_code: code,
              },
              { status: 500 },
            ),
          )
        }
      })

      // Timeout after 2 minutes for capture operations
      setTimeout(() => {
        pythonProcess.kill()
        resolve(
          NextResponse.json(
            {
              error: "Operation timeout",
              partial_output: output,
            },
            { status: 408 },
          ),
        )
      }, 120000)
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
