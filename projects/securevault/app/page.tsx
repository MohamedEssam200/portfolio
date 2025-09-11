"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Lock,
  Eye,
  EyeOff,
  Plus,
  Search,
  Shield,
  Key,
  Fingerprint,
  Copy,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react"
import CryptoJS from "crypto-js"

interface PasswordEntry {
  id: string
  website: string
  username: string
  password: string
  category: string
  notes?: string
  lastModified: Date
  strength: number
}

interface SecureNote {
  id: string
  title: string
  content: string
  lastModified: Date
}

export default function SecureVault() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [masterPassword, setMasterPassword] = useState("")
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [secureNotes, setSecureNotes] = useState<SecureNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState<"passwords" | "notes" | "generator">("passwords")

  // Password form state
  const [newEntry, setNewEntry] = useState({
    website: "",
    username: "",
    password: "",
    category: "General",
    notes: "",
  })
  const [showAddForm, setShowAddForm] = useState(false)

  // Password generator state
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })
  const [generatedPassword, setGeneratedPassword] = useState("")

  // Note form state
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [showNoteForm, setShowNoteForm] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleAuthentication = () => {
    if (masterPassword.length >= 8) {
      setIsAuthenticated(true)
      setMasterPassword("")
    }
  }

  const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, masterPassword).toString()
  }

  const decryptData = (encryptedData: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password)) strength += 10
    if (/[A-Z]/.test(password)) strength += 10
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 15
    return Math.min(strength, 100)
  }

  const generatePassword = () => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = generatorOptions
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setGeneratedPassword(password)
  }

  const addNewPassword = () => {
    if (newEntry.website && newEntry.username && newEntry.password) {
      const entry: PasswordEntry = {
        id: Date.now().toString(),
        ...newEntry,
        lastModified: new Date(),
        strength: calculatePasswordStrength(newEntry.password),
      }
      setPasswords([...passwords, entry])
      setNewEntry({ website: "", username: "", password: "", category: "General", notes: "" })
      setShowAddForm(false)
      saveData([...passwords, entry], secureNotes)
    }
  }

  const addNewNote = () => {
    if (newNote.title && newNote.content) {
      const note: SecureNote = {
        id: Date.now().toString(),
        ...newNote,
        lastModified: new Date(),
      }
      setSecureNotes([...secureNotes, note])
      setNewNote({ title: "", content: "" })
      setShowNoteForm(false)
      saveData(passwords, [...secureNotes, note])
    }
  }

  const deletePassword = (id: string) => {
    const updatedPasswords = passwords.filter((p) => p.id !== id)
    setPasswords(updatedPasswords)
    saveData(updatedPasswords, secureNotes)
  }

  const deleteNote = (id: string) => {
    const updatedNotes = secureNotes.filter((n) => n.id !== id)
    setSecureNotes(updatedNotes)
    saveData(passwords, updatedNotes)
  }

  const saveData = (passwordData: PasswordEntry[], noteData: SecureNote[]) => {
    const data = { passwords: passwordData, notes: noteData }
    const encryptedData = encryptData(JSON.stringify(data))
    localStorage.setItem("securevault_data", encryptedData)
  }

  const loadData = () => {
    const encryptedData = localStorage.getItem("securevault_data")
    if (encryptedData) {
      try {
        const decryptedData = decryptData(encryptedData)
        const data = JSON.parse(decryptedData)
        setPasswords(data.passwords || [])
        setSecureNotes(data.notes || [])
      } catch (error) {
        console.error("Failed to decrypt data")
      }
    }
  }

  const exportData = () => {
    const data = { passwords, notes: secureNotes }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "securevault_backup.json"
    a.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredPasswords = passwords.filter(
    (p) =>
      p.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredNotes = secureNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()),
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
            <CardDescription>Enter your master password to access your vault</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Master Password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAuthentication()}
            />
            <Button onClick={handleAuthentication} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Fingerprint className="h-4 w-4 mr-2" />
              Unlock Vault
            </Button>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>AES-256 Encryption</span>
              </div>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SecureVault</h1>
            <p className="text-gray-600">Password Manager Dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Encrypted
            </Badge>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1">
          {[
            { id: "passwords", label: "Passwords", icon: Key },
            { id: "notes", label: "Secure Notes", icon: Lock },
            { id: "generator", label: "Generator", icon: RefreshCw },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Add */}
        {activeTab !== "generator" && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() =>
                activeTab === "passwords" ? setShowAddForm(!showAddForm) : setShowNoteForm(!showNoteForm)
              }
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === "passwords" ? "Password" : "Note"}
            </Button>
          </div>
        )}

        {/* Password Generator Tab */}
        {activeTab === "generator" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Password Generator</CardTitle>
              <CardDescription>Generate secure passwords with customizable options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Length: {generatorOptions.length}</label>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={generatorOptions.length}
                      onChange={(e) =>
                        setGeneratorOptions({ ...generatorOptions, length: Number.parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "includeUppercase", label: "Uppercase Letters (A-Z)" },
                      { key: "includeLowercase", label: "Lowercase Letters (a-z)" },
                      { key: "includeNumbers", label: "Numbers (0-9)" },
                      { key: "includeSymbols", label: "Symbols (!@#$%^&*)" },
                    ].map((option) => (
                      <label key={option.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={generatorOptions[option.key as keyof typeof generatorOptions] as boolean}
                          onChange={(e) => setGeneratorOptions({ ...generatorOptions, [option.key]: e.target.checked })}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Button onClick={generatePassword} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Password
                  </Button>
                  {generatedPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <code className="flex-1 font-mono text-sm">{generatedPassword}</code>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedPassword)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Strength: {calculatePasswordStrength(generatedPassword)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Password Form */}
        {showAddForm && activeTab === "passwords" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Password</CardTitle>
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
              <Textarea
                placeholder="Notes (optional)"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              />
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

        {/* Add Note Form */}
        {showNoteForm && activeTab === "notes" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Secure Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
              />
              <div className="flex gap-2">
                <Button onClick={addNewNote} className="bg-emerald-600 hover:bg-emerald-700">
                  Save Note
                </Button>
                <Button variant="outline" onClick={() => setShowNoteForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password List */}
        {activeTab === "passwords" && (
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
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <Badge variant="secondary">{password.category}</Badge>
                        <span>Strength: {password.strength}%</span>
                        <span>Modified: {password.lastModified.toLocaleDateString()}</span>
                      </div>
                      {password.notes && <p className="text-sm text-gray-600 mt-2">{password.notes}</p>}
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
        )}

        {/* Notes List */}
        {activeTab === "notes" && (
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-sm text-gray-500">Modified: {note.lastModified.toLocaleDateString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty States */}
        {((activeTab === "passwords" && filteredPasswords.length === 0) ||
          (activeTab === "notes" && filteredNotes.length === 0)) && (
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} found</h3>
              <p className="text-gray-600">
                Add your first {activeTab === "passwords" ? "password" : "note"} or adjust your search terms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
