"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Circle,
  AlertCircle,
  User,
  Flag,
  MessageSquare,
  BarChart3,
  Settings,
  Edit,
} from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assignee: string
  dueDate: Date
  createdAt: Date
  updatedAt: Date
  projectId: string
  tags: string[]
  comments: Comment[]
  attachments: string[]
  estimatedHours: number
  actualHours: number
}

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed"
  startDate: Date
  endDate: Date
  progress: number
  teamMembers: string[]
  color: string
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
}

export default function TaskFlow() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [view, setView] = useState<"board" | "list" | "calendar" | "analytics">("board")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)

  const mockProjects: Project[] = [
    {
      id: "1",
      name: "Security Audit Platform",
      description: "Comprehensive security assessment tool for enterprise clients",
      status: "active",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      progress: 65,
      teamMembers: ["Mohamed Essam", "Alice Johnson", "Bob Smith"],
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Penetration Testing Suite",
      description: "Advanced toolkit for automated vulnerability scanning",
      status: "active",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-30"),
      progress: 40,
      teamMembers: ["Mohamed Essam", "Charlie Brown"],
      color: "bg-red-500",
    },
    {
      id: "3",
      name: "Encrypted Chat Application",
      description: "End-to-end encrypted messaging platform",
      status: "completed",
      startDate: new Date("2023-11-01"),
      endDate: new Date("2024-01-15"),
      progress: 100,
      teamMembers: ["Mohamed Essam", "Alice Johnson"],
      color: "bg-green-500",
    },
  ]

  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Implement OAuth 2.0 Authentication",
      description: "Set up secure authentication system with OAuth 2.0 integration for multiple providers",
      status: "in-progress",
      priority: "high",
      assignee: "Mohamed Essam",
      dueDate: new Date("2024-02-15"),
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-25"),
      projectId: "1",
      tags: ["authentication", "security", "backend"],
      comments: [
        {
          id: "1",
          author: "Alice Johnson",
          content: "Make sure to implement proper token refresh mechanism",
          timestamp: new Date("2024-01-22"),
        },
      ],
      attachments: ["oauth-spec.pdf", "security-requirements.md"],
      estimatedHours: 16,
      actualHours: 12,
    },
    {
      id: "2",
      title: "Design Database Schema",
      description: "Create comprehensive database schema for user data, audit logs, and security findings",
      status: "completed",
      priority: "high",
      assignee: "Bob Smith",
      dueDate: new Date("2024-01-30"),
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-28"),
      projectId: "1",
      tags: ["database", "schema", "backend"],
      comments: [],
      attachments: ["schema-diagram.png"],
      estimatedHours: 8,
      actualHours: 10,
    },
    {
      id: "3",
      title: "Vulnerability Scanner Engine",
      description: "Develop core scanning engine for automated vulnerability detection",
      status: "todo",
      priority: "urgent",
      assignee: "Mohamed Essam",
      dueDate: new Date("2024-02-20"),
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      projectId: "2",
      tags: ["scanning", "security", "python"],
      comments: [],
      attachments: [],
      estimatedHours: 24,
      actualHours: 0,
    },
    {
      id: "4",
      title: "Report Generation System",
      description: "Create automated report generation with PDF export and customizable templates",
      status: "review",
      priority: "medium",
      assignee: "Charlie Brown",
      dueDate: new Date("2024-02-25"),
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-30"),
      projectId: "2",
      tags: ["reporting", "pdf", "frontend"],
      comments: [
        {
          id: "2",
          author: "Mohamed Essam",
          content: "Please include executive summary template",
          timestamp: new Date("2024-01-29"),
        },
      ],
      attachments: ["report-template.docx"],
      estimatedHours: 12,
      actualHours: 8,
    },
  ]

  useEffect(() => {
    setProjects(mockProjects)
    setTasks(mockTasks)
    setSelectedProject(mockProjects[0])
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = selectedProject ? task.projectId === selectedProject.id : true
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus

    return matchesProject && matchesSearch && matchesStatus
  })

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const renderKanbanBoard = () => {
    const columns = [
      { id: "todo", title: "To Do", tasks: getTasksByStatus("todo") },
      { id: "in-progress", title: "In Progress", tasks: getTasksByStatus("in-progress") },
      { id: "review", title: "Review", tasks: getTasksByStatus("review") },
      { id: "completed", title: "Completed", tasks: getTasksByStatus("completed") },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{task.dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {task.comments.length > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>{task.comments.length} comments</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderAnalytics = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const overdueTasks = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "completed").length
    const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0)
    const totalActualHours = tasks.reduce((sum, task) => sum + task.actualHours, 0)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hours Logged</p>
                  <p className="text-2xl font-bold text-gray-900">{totalActualHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{project.name}</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["todo", "in-progress", "review", "completed"].map((status) => {
                const count = tasks.filter((t) => t.status === status).length
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm capitalize">{status.replace("-", " ")}</span>
                      <span className="text-sm text-gray-600">{count} tasks</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-gray-600">Project Management & Task Tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Users className="h-3 w-3 mr-1" />
              Team Collaboration
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Project Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProject?.id === project.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProject(project)}
                className="flex items-center space-x-2"
              >
                <div className={`w-3 h-3 rounded-full ${project.color}`} />
                <span>{project.name}</span>
                <Badge variant="secondary">{project.progress}%</Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex border rounded-lg">
              {["board", "list", "calendar", "analytics"].map((viewType) => (
                <Button
                  key={viewType}
                  variant={view === viewType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(viewType as any)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {viewType === "board" && <BarChart3 className="h-4 w-4" />}
                  {viewType === "list" && <Filter className="h-4 w-4" />}
                  {viewType === "calendar" && <Calendar className="h-4 w-4" />}
                  {viewType === "analytics" && <BarChart3 className="h-4 w-4" />}
                </Button>
              ))}
            </div>

            <Button onClick={() => setShowNewTaskForm(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {view === "board" && renderKanbanBoard()}
          {view === "analytics" && renderAnalytics()}

          {view === "list" && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTask(task)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(task.status)}
                              <div>
                                <div className="font-medium text-gray-900">{task.title}</div>
                                <div className="text-sm text-gray-500">{task.description.substring(0, 60)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{task.assignee}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{task.dueDate.toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={(task.actualHours / task.estimatedHours) * 100} className="w-16 h-2" />
                              <span className="text-xs text-gray-600">
                                {task.actualHours}h / {task.estimatedHours}h
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(selectedTask.status)}
                    <span>{selectedTask.title}</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <Badge className={getPriorityColor(selectedTask.priority)} variant="outline">
                      <Flag className="h-3 w-3 mr-1" />
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assignee</label>
                    <p className="text-sm text-gray-900">{selectedTask.assignee}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-sm text-gray-900">{selectedTask.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedTask.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Time Tracking</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {selectedTask.actualHours}h / {selectedTask.estimatedHours}h
                      </span>
                    </div>
                    <Progress value={(selectedTask.actualHours / selectedTask.estimatedHours) * 100} />
                  </div>
                </div>

                {selectedTask.comments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Comments</label>
                    <div className="mt-2 space-y-3">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp.toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
