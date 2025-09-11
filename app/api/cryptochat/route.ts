import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, action } = await request.json()

    if (action === "encrypt") {
      // Mock encryption
      const encrypted = Buffer.from(message).toString("base64")
      return NextResponse.json({
        success: true,
        result: {
          encrypted_message: encrypted,
          algorithm: "AES-256-GCM",
          timestamp: new Date().toISOString(),
        },
      })
    } else if (action === "decrypt") {
      // Mock decryption
      try {
        const decrypted = Buffer.from(message, "base64").toString("utf-8")
        return NextResponse.json({
          success: true,
          result: {
            decrypted_message: decrypted,
            timestamp: new Date().toISOString(),
          },
        })
      } catch {
        return NextResponse.json({ success: false, error: "Invalid encrypted message" }, { status: 400 })
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Operation failed" }, { status: 500 })
  }
}
