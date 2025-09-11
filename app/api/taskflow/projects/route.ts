import { type NextRequest, NextResponse } from "next/server"

// Mock project storage
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of company website",
    status: "active" as const,
    start_date: "2024-01-15",
    end_date: "2024-03-15",
    progress: 65,
    color: "#3B82F6",
    taskCount: 12,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile app for iOS and Android",
    status: "planning" as const,
    start_date: "2024-02-01",
    end_date: "2024-06-01",
    progress: 25,
    color: "#10B981",
    taskCount: 8,
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      projects: mockProjects,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, startDate, endDate, color } = await request.json()

    const newProject = {
      id: (mockProjects.length + 1).toString(),
      name,
      description,
      status: "planning" as const,
      start_date: startDate,
      end_date: endDate,
      progress: 0,
      color: color || "#6B7280",
      taskCount: 0,
    }

    mockProjects.push(newProject)

    return NextResponse.json({
      success: true,
      project: newProject,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}
