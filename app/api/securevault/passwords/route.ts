import { type NextRequest, NextResponse } from "next/server"

// Mock password storage (in production, this would use a secure database)
const mockPasswords = [
  {
    id: "1",
    website: "github.com",
    username: "user@example.com",
    encrypted_password: "encrypted_password_1",
    category: "Development",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    website: "gmail.com",
    username: "user@gmail.com",
    encrypted_password: "encrypted_password_2",
    category: "Email",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      passwords: mockPasswords,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch passwords" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { website, username, password, category } = await request.json()

    // In production, encrypt the password before storing
    const newPassword = {
      id: (mockPasswords.length + 1).toString(),
      website,
      username,
      encrypted_password: `encrypted_${password}`, // Mock encryption
      category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockPasswords.push(newPassword)

    return NextResponse.json({
      success: true,
      password: newPassword,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add password" }, { status: 500 })
  }
}
