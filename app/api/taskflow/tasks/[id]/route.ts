import { type NextRequest, NextResponse } from "next/server"

// Mock task storage (shared with main route)
const mockTasks = [
  {
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage",
    status: "completed" as const,
    priority: "high" as const,
    project_id: "1",
    assignee_id: "user1",
    due_date: "2024-01-20",
    estimated_hours: 16,
    actual_hours: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await request.json()

    const taskIndex = mockTasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      task: mockTasks[taskIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}
