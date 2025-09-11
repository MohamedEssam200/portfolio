// WebSocket server for real-time messaging
import { Server as SocketIOServer } from "socket.io"
import next from "next"
import crypto from "crypto"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

interface User {
  id: string
  name: string
  socketId: string
  publicKey: string
  status: "online" | "away" | "offline"
}

interface EncryptedMessage {
  id: string
  senderId: string
  recipientId: string
  encryptedContent: string
  timestamp: number
  selfDestruct?: number
}

class CryptoChatServer {
  private io: SocketIOServer
  private users: Map<string, User> = new Map()
  private messages: Map<string, EncryptedMessage[]> = new Map()

  constructor(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id)

      socket.on("user:register", (userData: Omit<User, "socketId">) => {
        const user: User = {
          ...userData,
          socketId: socket.id,
          status: "online",
        }

        this.users.set(userData.id, user)

        // Broadcast updated user list
        this.broadcastUserList()

        // Send chat history to user
        socket.emit("messages:history", this.getUserMessages(userData.id))
      })

      socket.on(
        "message:send",
        (messageData: {
          recipientId: string
          encryptedContent: string
          selfDestruct?: number
        }) => {
          const sender = this.getUserBySocketId(socket.id)
          if (!sender) return

          const message: EncryptedMessage = {
            id: crypto.randomUUID(),
            senderId: sender.id,
            recipientId: messageData.recipientId,
            encryptedContent: messageData.encryptedContent,
            timestamp: Date.now(),
            selfDestruct: messageData.selfDestruct,
          }

          // Store message
          this.storeMessage(message)

          // Send to recipient if online
          const recipient = this.users.get(messageData.recipientId)
          if (recipient) {
            this.io.to(recipient.socketId).emit("message:receive", message)
          }

          // Confirm to sender
          socket.emit("message:sent", message)

          // Handle self-destruct
          if (message.selfDestruct) {
            setTimeout(() => {
              this.deleteMessage(message.id)
              this.io.to(sender.socketId).emit("message:destroyed", message.id)
              if (recipient) {
                this.io.to(recipient.socketId).emit("message:destroyed", message.id)
              }
            }, message.selfDestruct * 1000)
          }
        },
      )

      socket.on("user:status", (status: "online" | "away" | "offline") => {
        const user = this.getUserBySocketId(socket.id)
        if (user) {
          user.status = status
          this.users.set(user.id, user)
          this.broadcastUserList()
        }
      })

      socket.on("typing:start", (recipientId: string) => {
        const recipient = this.users.get(recipientId)
        if (recipient) {
          this.io.to(recipient.socketId).emit("typing:start", socket.id)
        }
      })

      socket.on("typing:stop", (recipientId: string) => {
        const recipient = this.users.get(recipientId)
        if (recipient) {
          this.io.to(recipient.socketId).emit("typing:stop", socket.id)
        }
      })

      socket.on("disconnect", () => {
        const user = this.getUserBySocketId(socket.id)
        if (user) {
          user.status = "offline"
          this.users.set(user.id, user)
          this.broadcastUserList()
        }
        console.log("User disconnected:", socket.id)
      })
    })
  }

  private getUserBySocketId(socketId: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.socketId === socketId) {
        return user
      }
    }
    return undefined
  }

  private storeMessage(message: EncryptedMessage) {
    const conversationId = this.getConversationId(message.senderId, message.recipientId)

    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, [])
    }

    this.messages.get(conversationId)!.push(message)
  }

  private deleteMessage(messageId: string) {
    for (const messages of this.messages.values()) {
      const index = messages.findIndex((m) => m.id === messageId)
      if (index !== -1) {
        messages.splice(index, 1)
        break
      }
    }
  }

  private getUserMessages(userId: string): EncryptedMessage[] {
    const userMessages: EncryptedMessage[] = []

    for (const messages of this.messages.values()) {
      userMessages.push(...messages.filter((m) => m.senderId === userId || m.recipientId === userId))
    }

    return userMessages.sort((a, b) => a.timestamp - b.timestamp)
  }

  private getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join(":")
  }

  private broadcastUserList() {
    const userList = Array.from(this.users.values()).map((user) => ({
      id: user.id,
      name: user.name,
      status: user.status,
      publicKey: user.publicKey,
    }))

    this.io.emit("users:list", userList)
  }
}

export default CryptoChatServer
