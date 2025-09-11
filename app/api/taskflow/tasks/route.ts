import { type NextRequest, NextResponse } from "next/server"

// Mock task storage
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
  {
    id: "2",
    title: "Implement User Authentication",
    description: "Set up login/logout functionality with JWT tokens",
    status: "in-progress" as const,
    priority: "urgent" as const,
    project_id: "1",
    assignee_id: "user2",
    due_date: "2024-01-25",
    estimated_hours: 24,
    actual_hours: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    let filteredTasks = mockTasks
    if (projectId) {
      filteredTasks = mockTasks.filter((task) => task.project_id === projectId)
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, projectId, assigneeId, priority, dueDate, estimatedHours } = await request.json()

    const newTask = {
      id: (mockTasks.length + 1).toString(),
      title,
      description,
      status: "todo" as const,
      priority,
      project_id: projectId,
      assignee_id: assigneeId,
      due_date: dueDate,
      estimated_hours: estimatedHours,
      actual_hours: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockTasks.push(newTask)

    return NextResponse.json({
      success: true,
      task: newTask,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
