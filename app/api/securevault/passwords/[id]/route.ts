import { type NextRequest, NextResponse } from "next/server"

// Mock password storage (shared with main route)
let mockPasswords = [
  {
    id: "1",
    website: "github.com",
    username: "user@example.com",
    encrypted_password: "encrypted_password_1",
    category: "Development",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const initialLength = mockPasswords.length
    mockPasswords = mockPasswords.filter((p) => p.id !== id)

    if (mockPasswords.length === initialLength) {
      return NextResponse.json({ success: false, error: "Password not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Password deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete password" }, { status: 500 })
  }
}
