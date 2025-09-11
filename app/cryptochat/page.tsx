"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Send,
  Lock,
  Shield,
  ArrowLeft,
  User,
  Clock,
  Key,
  Eye,
  EyeOff,
  Settings,
  UserPlus,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  encrypted: boolean
  selfDestruct?: number
}

interface Contact {
  id: string
  name: string
  status: "online" | "offline" | "away"
  publicKey: string
  lastSeen: Date
}

export default function CryptoChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showEncryption, setShowEncryption] = useState(false)
  const [selfDestructTimer, setSelfDestructTimer] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Alice Johnson",
      status: "online",
      publicKey: "RSA-2048:AAAAB3NzaC1yc2EAAAADAQABAAABAQ...",
      lastSeen: new Date(),
    },
    {
      id: "2",
      name: "Bob Smith",
      status: "away",
      publicKey: "RSA-2048:AAAAB3NzaC1yc2EAAAADAQABAAABAQ...",
      lastSeen: new Date(Date.now() - 300000),
    },
    {
      id: "3",
      name: "Charlie Brown",
      status: "offline",
      publicKey: "RSA-2048:AAAAB3NzaC1yc2EAAAADAQABAAABAQ...",
      lastSeen: new Date(Date.now() - 3600000),
    },
  ]

  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey! How's the security audit going?",
      timestamp: new Date(Date.now() - 600000),
      encrypted: true,
    },
    {
      id: "2",
      sender: "You",
      content: "Going well! Found some interesting vulnerabilities in the web app.",
      timestamp: new Date(Date.now() - 540000),
      encrypted: true,
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "That's great! Can you share the report when it's ready?",
      timestamp: new Date(Date.now() - 480000),
      encrypted: true,
    },
    {
      id: "4",
      sender: "You",
      content: "I'll encrypt it with your public key.",
      timestamp: new Date(Date.now() - 420000),
      encrypted: true,
    },
    {
      id: "5",
      sender: "Alice Johnson",
      content: "Perfect! This message will self-destruct in 30 seconds.",
      timestamp: new Date(Date.now() - 360000),
      encrypted: true,
      selfDestruct: 30,
    },
  ]

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages)
    }
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      encrypted: true,
      selfDestruct: selfDestructTimer > 0 ? selfDestructTimer : undefined,
    }

    setMessages([...messages, message])
    setNewMessage("")
    setSelfDestructTimer(0)

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedContact.name,
        content: "Message received and decrypted successfully! 🔒",
        timestamp: new Date(),
        encrypted: true,
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
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
              <h1 className="text-3xl font-bold text-gray-900">CryptoChat</h1>
              <p className="text-gray-600">End-to-End Encrypted Messaging</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-teal-100 text-teal-800">
              <Shield className="h-3 w-3 mr-1" />
              E2E Encrypted
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Contacts Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contacts</span>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-teal-50 border-r-2 border-teal-500" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(contact.status)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{contact.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{contact.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(selectedContact.status)}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          End-to-end encrypted
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowEncryption(!showEncryption)}>
                      {showEncryption ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showEncryption ? "Hide" : "Show"} Encryption
                    </Button>
                  </div>
                </CardHeader>

                {/* Encryption Info */}
                {showEncryption && (
                  <div className="p-4 bg-teal-50 border-b">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">Encryption Details:</span>
                      </div>
                      <div className="ml-6 space-y-1 text-gray-600">
                        <div>Protocol: Signal Protocol with Double Ratchet</div>
                        <div>Key Exchange: X3DH (Extended Triple Diffie-Hellman)</div>
                        <div>Cipher: AES-256-GCM</div>
                        <div>Forward Secrecy: Enabled</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "You" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.encrypted && <Lock className="h-3 w-3" />}
                          {message.selfDestruct && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {message.selfDestruct}s
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "You" ? "text-teal-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <select
                      value={selfDestructTimer}
                      onChange={(e) => setSelfDestructTimer(Number(e.target.value))}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value={0}>No self-destruct</option>
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={300}>5 minutes</option>
                    </select>
                    {selfDestructTimer > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Self-destruct: {selfDestructTimer}s
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type an encrypted message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} className="bg-teal-600 hover:bg-teal-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>Messages are end-to-end encrypted and cannot be read by anyone else</span>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a contact</h3>
                  <p className="text-gray-600">Choose a contact from the sidebar to start an encrypted conversation.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
