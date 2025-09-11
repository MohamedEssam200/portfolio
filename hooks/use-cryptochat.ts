"use client"

import { useState, useEffect, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { E2EEncryption } from "@/lib/crypto-utils"

interface User {
  id: string
  name: string
  status: "online" | "away" | "offline"
  publicKey: string
}

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  timestamp: number
  encrypted: boolean
  selfDestruct?: number
}

export function useCryptoChat(userId: string, userName: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [privateKey, setPrivateKey] = useState<string>("")
  const [publicKey, setPublicKey] = useState<string>("")
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  // Initialize encryption keys
  useEffect(() => {
    const initializeKeys = async () => {
      const keys = await E2EEncryption.generateUserKeys()
      setPrivateKey(keys.privateKey)
      setPublicKey(keys.publicKey)
    }

    initializeKeys()
  }, [])

  // Initialize socket connection
  useEffect(() => {
    if (!publicKey) return

    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001")

    newSocket.on("connect", () => {
      setConnected(true)
      newSocket.emit("user:register", {
        id: userId,
        name: userName,
        publicKey: publicKey,
      })
    })

    newSocket.on("disconnect", () => {
      setConnected(false)
    })

    newSocket.on("users:list", (userList: User[]) => {
      setUsers(userList.filter((user) => user.id !== userId))
    })

    newSocket.on("message:receive", (encryptedMessage: any) => {
      const decryptedContent = E2EEncryption.decryptMessage(encryptedMessage.encryptedContent, privateKey)

      const message: Message = {
        id: encryptedMessage.id,
        senderId: encryptedMessage.senderId,
        recipientId: encryptedMessage.recipientId,
        content: decryptedContent,
        timestamp: encryptedMessage.timestamp,
        encrypted: true,
        selfDestruct: encryptedMessage.selfDestruct,
      }

      setMessages((prev) => [...prev, message])
    })

    newSocket.on("message:sent", (encryptedMessage: any) => {
      // Message confirmation from server
    })

    newSocket.on("message:destroyed", (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    })

    newSocket.on("typing:start", (userId: string) => {
      setTypingUsers((prev) => new Set([...prev, userId]))
    })

    newSocket.on("typing:stop", (userId: string) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [userId, userName, publicKey, privateKey])

  const sendMessage = useCallback(
    (recipientId: string, content: string, selfDestruct?: number) => {
      if (!socket || !connected) return

      const recipient = users.find((u) => u.id === recipientId)
      if (!recipient) return

      const encryptedContent = E2EEncryption.encryptMessage(content, recipient.publicKey)

      socket.emit("message:send", {
        recipientId,
        encryptedContent,
        selfDestruct,
      })

      // Add to local messages immediately
      const message: Message = {
        id: `temp-${Date.now()}`,
        senderId: userId,
        recipientId,
        content,
        timestamp: Date.now(),
        encrypted: true,
        selfDestruct,
      }

      setMessages((prev) => [...prev, message])
    },
    [socket, connected, users, userId],
  )

  const updateStatus = useCallback(
    (status: "online" | "away" | "offline") => {
      if (!socket || !connected) return
      socket.emit("user:status", status)
    },
    [socket, connected],
  )

  const startTyping = useCallback(
    (recipientId: string) => {
      if (!socket || !connected) return
      socket.emit("typing:start", recipientId)
    },
    [socket, connected],
  )

  const stopTyping = useCallback(
    (recipientId: string) => {
      if (!socket || !connected) return
      socket.emit("typing:stop", recipientId)
    },
    [socket, connected],
  )

  const getConversationMessages = useCallback(
    (contactId: string) => {
      return messages
        .filter(
          (m) =>
            (m.senderId === userId && m.recipientId === contactId) ||
            (m.senderId === contactId && m.recipientId === userId),
        )
        .sort((a, b) => a.timestamp - b.timestamp)
    },
    [messages, userId],
  )

  return {
    connected,
    users,
    messages,
    publicKey,
    typingUsers,
    sendMessage,
    updateStatus,
    startTyping,
    stopTyping,
    getConversationMessages,
    fingerprint: E2EEncryption.hashFingerprint(publicKey),
  }
}
