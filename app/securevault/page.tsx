"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lock, Eye, EyeOff, Plus, Search, Shield, Key, Fingerprint, ArrowLeft, Copy, Trash2 } from "lucide-react"
import Link from "next/link"

interface PasswordEntry {
  id: string
  website: string
  username: string
  password: string
  category: string
  lastModified: Date
}

export default function SecureVault() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: "1",
      website: "github.com",
      username: "mohamed.essam@email.com",
      password: "SecurePass123!",
      category: "Development",
      lastModified: new Date("2024-01-15"),
    },
    {
      id: "2",
      website: "linkedin.com",
      username: "mohamed.essam",
      password: "LinkedIn2024#",
      category: "Social",
      lastModified: new Date("2024-01-10"),
    },
    {
      id: "3",
      website: "aws.amazon.com",
      username: "admin@company.com",
      password: "AWS_Secure_2024$",
      category: "Cloud",
      lastModified: new Date("2024-01-08"),
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [newEntry, setNewEntry] = useState({
    website: "",
    username: "",
    password: "",
    category: "General",
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleBiometricAuth = () => {
    // Simulate biometric authentication
    setTimeout(() => {
      setIsAuthenticated(true)
    }, 1500)
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const addNewPassword = () => {
    if (newEntry.website && newEntry.username && newEntry.password) {
      const entry: PasswordEntry = {
        id: Date.now().toString(),
        ...newEntry,
        lastModified: new Date(),
      }
      setPasswords([...passwords, entry])
      setNewEntry({ website: "", username: "", password: "", category: "General" })
      setShowAddForm(false)
    }
  }

  const deletePassword = (id: string) => {
    setPasswords(passwords.filter((p) => p.id !== id))
  }

  const filteredPasswords = passwords.filter(
    (p) =>
      p.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">SecureVault</CardTitle>
            <CardDescription>Secure your passwords with biometric authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>AES-256 Encryption</span>
              </div>
              <Button onClick={handleBiometricAuth} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Fingerprint className="h-4 w-4 mr-2" />
                Authenticate with Biometrics
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SecureVault</h1>
              <p className="text-gray-600">Password Manager Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Encrypted
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">{passwords.length} Passwords</Badge>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Password
          </Button>
        </div>

        {/* Add New Password Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Add New Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Website (e.g., github.com)"
                  value={newEntry.website}
                  onChange={(e) => setNewEntry({ ...newEntry, website: e.target.value })}
                />
                <Input
                  placeholder="Username/Email"
                  value={newEntry.username}
                  onChange={(e) => setNewEntry({ ...newEntry, username: e.target.value })}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={newEntry.password}
                  onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
                />
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="General">General</option>
                  <option value="Development">Development</option>
                  <option value="Social">Social</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Banking">Banking</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={addNewPassword} className="bg-emerald-600 hover:bg-emerald-700">
                  Save Password
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password List */}
        <div className="grid gap-4">
          {filteredPasswords.map((password) => (
            <Card key={password.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{password.website}</h3>
                        <p className="text-sm text-gray-600">{password.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <Badge variant="secondary">{password.category}</Badge>
                      <span>Modified: {password.lastModified.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-mono text-sm">
                        {showPasswords[password.id] ? password.password : "••••••••"}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility(password.id)}>
                        {showPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(password.password)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePassword(password.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPasswords.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No passwords found</h3>
              <p className="text-gray-600">Add your first password or adjust your search terms.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
