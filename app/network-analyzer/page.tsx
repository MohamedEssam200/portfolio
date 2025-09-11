"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Router,
  Activity,
  AlertTriangle,
  ArrowLeft,
  Play,
  Pause,
  Download,
  Wifi,
  Server,
  Globe,
  Database,
} from "lucide-react"
import Link from "next/link"

interface NetworkPacket {
  id: string
  timestamp: Date
  source: string
  destination: string
  protocol: string
  size: number
  threat: "None" | "Low" | "Medium" | "High"
  description: string
}

interface NetworkStats {
  totalPackets: number
  totalBytes: number
  threatsDetected: number
  activeConnections: number
  bandwidth: number
}

export default function NetworkAnalyzer() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [packets, setPackets] = useState<NetworkPacket[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    totalPackets: 0,
    totalBytes: 0,
    threatsDetected: 0,
    activeConnections: 0,
    bandwidth: 0,
  })

  const mockPackets: NetworkPacket[] = [
    {
      id: "1",
      timestamp: new Date(),
      source: "192.168.1.100",
      destination: "8.8.8.8",
      protocol: "DNS",
      size: 64,
      threat: "None",
      description: "DNS query for google.com",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000),
      source: "192.168.1.50",
      destination: "10.0.0.1",
      protocol: "HTTP",
      size: 1024,
      threat: "Medium",
      description: "Suspicious HTTP request to internal server",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 2000),
      source: "203.0.113.5",
      destination: "192.168.1.100",
      protocol: "TCP",
      size: 512,
      threat: "High",
      description: "Port scan attempt detected",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 3000),
      source: "192.168.1.25",
      destination: "172.16.0.1",
      protocol: "HTTPS",
      size: 2048,
      threat: "None",
      description: "Secure web traffic",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 4000),
      source: "192.168.1.75",
      destination: "198.51.100.10",
      protocol: "FTP",
      size: 256,
      threat: "Low",
      description: "Unencrypted FTP connection",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate new packet
        const newPacket: NetworkPacket = {
          id: Date.now().toString(),
          timestamp: new Date(),
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          destination: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          protocol: ["HTTP", "HTTPS", "DNS", "TCP", "UDP", "FTP"][Math.floor(Math.random() * 6)],
          size: Math.floor(Math.random() * 4096) + 64,
          threat: ["None", "Low", "Medium", "High"][Math.floor(Math.random() * 4)] as any,
          description: [
            "Normal web traffic",
            "DNS resolution",
            "File transfer",
            "Database query",
            "Suspicious activity detected",
            "Port scan attempt",
          ][Math.floor(Math.random() * 6)],
        }

        setPackets((prev) => [newPacket, ...prev.slice(0, 49)]) // Keep last 50 packets

        // Update stats
        setStats((prev) => ({
          totalPackets: prev.totalPackets + 1,
          totalBytes: prev.totalBytes + newPacket.size,
          threatsDetected: prev.threatsDetected + (newPacket.threat !== "None" ? 1 : 0),
          activeConnections: Math.floor(Math.random() * 50) + 10,
          bandwidth: Math.floor(Math.random() * 100) + 20,
        }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const startMonitoring = () => {
    setIsMonitoring(true)
    // Add initial mock data
    setPackets(mockPackets)
    setStats({
      totalPackets: mockPackets.length,
      totalBytes: mockPackets.reduce((sum, p) => sum + p.size, 0),
      threatsDetected: mockPackets.filter((p) => p.threat !== "None").length,
      activeConnections: 25,
      bandwidth: 45,
    })
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
  }

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "None":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case "HTTP":
      case "HTTPS":
        return <Globe className="h-4 w-4" />
      case "DNS":
        return <Server className="h-4 w-4" />
      case "TCP":
      case "UDP":
        return <Wifi className="h-4 w-4" />
      case "FTP":
        return <Database className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold text-gray-900">Network Analyzer</h1>
              <p className="text-gray-600">Real-time Network Traffic Monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={isMonitoring ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              <Activity className="h-3 w-3 mr-1" />
              {isMonitoring ? "Monitoring" : "Stopped"}
            </Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Router className="h-5 w-5 text-purple-600" />
              Monitoring Control
            </CardTitle>
            <CardDescription>Start or stop network traffic monitoring and threat detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {!isMonitoring ? (
                <Button onClick={startMonitoring} className="bg-purple-600 hover:bg-purple-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Monitoring
                </Button>
              ) : (
                <Button
                  onClick={stopMonitoring}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Monitoring
                </Button>
              )}
              <Button variant="outline" disabled={packets.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Dashboard */}
        {isMonitoring && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalPackets}</div>
                <div className="text-sm text-gray-600">Total Packets</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{(stats.totalBytes / 1024).toFixed(1)}KB</div>
                <div className="text-sm text-gray-600">Data Transferred</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.threatsDetected}</div>
                <div className="text-sm text-gray-600">Threats Detected</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
                <div className="text-sm text-gray-600">Active Connections</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.bandwidth}%</div>
                <div className="text-sm text-gray-600">Bandwidth Usage</div>
                <Progress value={stats.bandwidth} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Threat Alerts */}
        {isMonitoring && packets.filter((p) => p.threat !== "None").length > 0 && (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {packets
                  .filter((p) => p.threat !== "None")
                  .slice(0, 3)
                  .map((packet) => (
                    <div key={packet.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getThreatColor(packet.threat)}>{packet.threat}</Badge>
                        <span className="font-medium">
                          {packet.source} → {packet.destination}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{packet.description}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packet Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Live Packet Log
            </CardTitle>
            <CardDescription>Real-time network traffic with threat analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {packets.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {packets.map((packet) => (
                  <div
                    key={packet.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getProtocolIcon(packet.protocol)}
                        <Badge variant="secondary">{packet.protocol}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="font-mono">
                          {packet.source} → {packet.destination}
                        </div>
                        <div className="text-gray-600">{packet.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-600">{packet.size} bytes</span>
                      <Badge className={getThreatColor(packet.threat)}>{packet.threat}</Badge>
                      <span className="text-gray-500">{packet.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Router className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No network activity</h3>
                <p className="text-gray-600">Start monitoring to see live network traffic and threat detection.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
