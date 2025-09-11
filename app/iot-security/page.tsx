"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Smartphone,
  Wifi,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Search,
  Play,
  Pause,
  Download,
  Router,
  Camera,
  Lightbulb,
  Thermometer,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface IoTDevice {
  id: string
  name: string
  ip: string
  mac: string
  manufacturer: string
  deviceType: string
  model: string
  firmware: string
  lastSeen: Date
  status: "online" | "offline" | "unknown"
  vulnerabilities: Vulnerability[]
  securityScore: number
  openPorts: number[]
  services: Service[]
  encryption: "none" | "weak" | "strong"
  authentication: "none" | "default" | "weak" | "strong"
}

interface Vulnerability {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  type: string
  description: string
  cve?: string
  solution: string
  exploitable: boolean
}

interface Service {
  port: number
  protocol: string
  service: string
  version: string
  banner: string
}

interface ScanResult {
  totalDevices: number
  vulnerableDevices: number
  criticalVulns: number
  highVulns: number
  mediumVulns: number
  lowVulns: number
  averageSecurityScore: number
}

export default function IoTSecurityAudit() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [networkRange, setNetworkRange] = useState("192.168.1.0/24")
  const [scanType, setScanType] = useState<"quick" | "deep" | "stealth">("quick")
  const [filter, setFilter] = useState<"all" | "vulnerable" | "critical">("all")

  const mockDevices: IoTDevice[] = [
    {
      id: "1",
      name: "Smart TV - Living Room",
      ip: "192.168.1.105",
      mac: "AA:BB:CC:DD:EE:01",
      manufacturer: "Samsung",
      deviceType: "Smart TV",
      model: "UN55TU8000",
      firmware: "1.2.3",
      lastSeen: new Date(),
      status: "online",
      openPorts: [80, 443, 8080, 9197],
      services: [
        { port: 80, protocol: "tcp", service: "http", version: "1.1", banner: "Samsung Smart TV HTTP Server" },
        { port: 443, protocol: "tcp", service: "https", version: "1.1", banner: "Samsung Smart TV HTTPS Server" },
      ],
      encryption: "weak",
      authentication: "default",
      securityScore: 45,
      vulnerabilities: [
        {
          id: "v1",
          severity: "high",
          type: "Default Credentials",
          description: "Device uses default admin credentials (admin/admin)",
          solution: "Change default credentials immediately",
          exploitable: true,
        },
        {
          id: "v2",
          severity: "medium",
          type: "Outdated Firmware",
          description: "Firmware version 1.2.3 has known security vulnerabilities",
          cve: "CVE-2023-1234",
          solution: "Update to firmware version 2.1.0 or later",
          exploitable: false,
        },
      ],
    },
    {
      id: "2",
      name: "Security Camera - Front Door",
      ip: "192.168.1.110",
      mac: "AA:BB:CC:DD:EE:02",
      manufacturer: "Hikvision",
      deviceType: "IP Camera",
      model: "DS-2CD2043G0-I",
      firmware: "5.6.3",
      lastSeen: new Date(Date.now() - 300000),
      status: "online",
      openPorts: [80, 554, 8000],
      services: [
        { port: 80, protocol: "tcp", service: "http", version: "1.1", banner: "Hikvision Web Server" },
        { port: 554, protocol: "tcp", service: "rtsp", version: "1.0", banner: "RTSP/1.0 Server" },
      ],
      encryption: "strong",
      authentication: "strong",
      securityScore: 85,
      vulnerabilities: [
        {
          id: "v3",
          severity: "low",
          type: "Information Disclosure",
          description: "Device model and firmware version exposed in HTTP headers",
          solution: "Configure web server to hide version information",
          exploitable: false,
        },
      ],
    },
    {
      id: "3",
      name: "Smart Thermostat",
      ip: "192.168.1.115",
      mac: "AA:BB:CC:DD:EE:03",
      manufacturer: "Nest",
      deviceType: "Thermostat",
      model: "Learning Thermostat 3rd Gen",
      firmware: "6.0.1",
      lastSeen: new Date(Date.now() - 600000),
      status: "online",
      openPorts: [443, 8883],
      services: [
        { port: 443, protocol: "tcp", service: "https", version: "1.2", banner: "Nest API Server" },
        { port: 8883, protocol: "tcp", service: "mqtt-ssl", version: "3.1.1", banner: "MQTT over SSL" },
      ],
      encryption: "strong",
      authentication: "strong",
      securityScore: 92,
      vulnerabilities: [],
    },
    {
      id: "4",
      name: "Smart Light Bulb - Bedroom",
      ip: "192.168.1.120",
      mac: "AA:BB:CC:DD:EE:04",
      manufacturer: "Philips",
      deviceType: "Smart Bulb",
      model: "Hue White A19",
      firmware: "1.46.13",
      lastSeen: new Date(Date.now() - 1200000),
      status: "offline",
      openPorts: [80],
      services: [{ port: 80, protocol: "tcp", service: "http", version: "1.1", banner: "Philips Hue Bridge" }],
      encryption: "none",
      authentication: "none",
      securityScore: 25,
      vulnerabilities: [
        {
          id: "v4",
          severity: "critical",
          type: "No Authentication",
          description: "Device accepts commands without any authentication",
          solution: "Enable authentication or isolate device on separate network",
          exploitable: true,
        },
        {
          id: "v5",
          severity: "high",
          type: "Unencrypted Communication",
          description: "All communication is sent in plain text",
          solution: "Enable HTTPS/TLS encryption",
          exploitable: true,
        },
      ],
    },
    {
      id: "5",
      name: "WiFi Router",
      ip: "192.168.1.1",
      mac: "AA:BB:CC:DD:EE:05",
      manufacturer: "Netgear",
      deviceType: "Router",
      model: "R7000",
      firmware: "1.0.9.88",
      lastSeen: new Date(),
      status: "online",
      openPorts: [22, 53, 80, 443, 8080],
      services: [
        { port: 22, protocol: "tcp", service: "ssh", version: "2.0", banner: "OpenSSH 7.4" },
        { port: 80, protocol: "tcp", service: "http", version: "1.1", banner: "Netgear Router Admin" },
        { port: 443, protocol: "tcp", service: "https", version: "1.1", banner: "Netgear Router Admin SSL" },
      ],
      encryption: "strong",
      authentication: "weak",
      securityScore: 65,
      vulnerabilities: [
        {
          id: "v6",
          severity: "medium",
          type: "Weak Admin Password",
          description: "Router admin password does not meet complexity requirements",
          solution: "Set a strong admin password with mixed case, numbers, and symbols",
          exploitable: false,
        },
        {
          id: "v7",
          severity: "low",
          type: "SSH Enabled",
          description: "SSH service is enabled and accessible from LAN",
          solution: "Disable SSH if not needed or restrict access",
          exploitable: false,
        },
      ],
    },
  ]

  useEffect(() => {
    // Initialize with mock data
    setDevices(mockDevices)
    calculateScanResult(mockDevices)
  }, [])

  const calculateScanResult = (deviceList: IoTDevice[]) => {
    const result: ScanResult = {
      totalDevices: deviceList.length,
      vulnerableDevices: deviceList.filter((d) => d.vulnerabilities.length > 0).length,
      criticalVulns: deviceList.reduce(
        (sum, d) => sum + d.vulnerabilities.filter((v) => v.severity === "critical").length,
        0,
      ),
      highVulns: deviceList.reduce((sum, d) => sum + d.vulnerabilities.filter((v) => v.severity === "high").length, 0),
      mediumVulns: deviceList.reduce(
        (sum, d) => sum + d.vulnerabilities.filter((v) => v.severity === "medium").length,
        0,
      ),
      lowVulns: deviceList.reduce((sum, d) => sum + d.vulnerabilities.filter((v) => v.severity === "low").length, 0),
      averageSecurityScore: deviceList.reduce((sum, d) => sum + d.securityScore, 0) / deviceList.length,
    }
    setScanResult(result)
  }

  const startScan = async () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsScanning(false)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // Simulate discovering new devices
    setTimeout(() => {
      const newDevice: IoTDevice = {
        id: `${Date.now()}`,
        name: "Unknown Device",
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        mac: `BB:CC:DD:EE:FF:${Math.floor(Math.random() * 99)
          .toString()
          .padStart(2, "0")}`,
        manufacturer: "Unknown",
        deviceType: "Unknown",
        model: "Unknown",
        firmware: "Unknown",
        lastSeen: new Date(),
        status: "online",
        openPorts: [80, 443],
        services: [],
        encryption: "none",
        authentication: "none",
        securityScore: Math.floor(Math.random() * 100),
        vulnerabilities:
          Math.random() > 0.5
            ? [
                {
                  id: `v${Date.now()}`,
                  severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
                  type: "Unknown Vulnerability",
                  description: "Potential security issue detected during scan",
                  solution: "Further investigation required",
                  exploitable: Math.random() > 0.5,
                },
              ]
            : [],
      }

      setDevices((prev) => {
        const updated = [...prev, newDevice]
        calculateScanResult(updated)
        return updated
      })
    }, 2500)
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "smart tv":
        return <Smartphone className="h-5 w-5" />
      case "ip camera":
        return <Camera className="h-5 w-5" />
      case "thermostat":
        return <Thermometer className="h-5 w-5" />
      case "smart bulb":
        return <Lightbulb className="h-5 w-5" />
      case "router":
        return <Router className="h-5 w-5" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getVulnerabilityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "offline":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  const filteredDevices = devices.filter((device) => {
    switch (filter) {
      case "vulnerable":
        return device.vulnerabilities.length > 0
      case "critical":
        return device.vulnerabilities.some((v) => v.severity === "critical")
      default:
        return true
    }
  })

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
              <h1 className="text-3xl font-bold text-gray-900">IoT Security Audit</h1>
              <p className="text-gray-600">Comprehensive IoT Device Security Assessment</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={isScanning ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
              <Shield className="h-3 w-3 mr-1" />
              {isScanning ? "Scanning" : "Ready"}
            </Badge>
          </div>
        </div>

        {/* Scan Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Network Scan Configuration
            </CardTitle>
            <CardDescription>Configure and start IoT device discovery and security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Network Range</label>
                <Input
                  value={networkRange}
                  onChange={(e) => setNetworkRange(e.target.value)}
                  placeholder="192.168.1.0/24"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Scan Type</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="quick">Quick Scan</option>
                  <option value="deep">Deep Scan</option>
                  <option value="stealth">Stealth Scan</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Devices</option>
                  <option value="vulnerable">Vulnerable Only</option>
                  <option value="critical">Critical Issues</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={startScan} disabled={isScanning} className="bg-purple-600 hover:bg-purple-700">
                {isScanning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isScanning ? "Scanning..." : "Start Scan"}
              </Button>
              <Button variant="outline" disabled={devices.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {isScanning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Scanning network...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Overview */}
        {scanResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{scanResult.totalDevices}</div>
                <div className="text-sm text-gray-600">Total Devices</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{scanResult.vulnerableDevices}</div>
                <div className="text-sm text-gray-600">Vulnerable</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{scanResult.criticalVulns}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{scanResult.highVulns}</div>
                <div className="text-sm text-gray-600">High</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{scanResult.mediumVulns}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{scanResult.lowVulns}</div>
                <div className="text-sm text-gray-600">Low</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getSecurityScoreColor(scanResult.averageSecurityScore)}`}>
                  {Math.round(scanResult.averageSecurityScore)}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Critical Alerts */}
        {devices.some((d) => d.vulnerabilities.some((v) => v.severity === "critical")) && (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Critical Security Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices
                  .filter((d) => d.vulnerabilities.some((v) => v.severity === "critical"))
                  .map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(device.deviceType)}
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-600">{device.ip}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-800">
                          {device.vulnerabilities.filter((v) => v.severity === "critical").length} Critical
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setSelectedDevice(device)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-purple-600" />
              Discovered IoT Devices
            </CardTitle>
            <CardDescription>
              {filteredDevices.length} of {devices.length} devices shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDevices.length > 0 ? (
              <div className="space-y-3">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.deviceType)}
                        {getStatusIcon(device.status)}
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-gray-600">
                          {device.ip} • {device.manufacturer} {device.model}
                        </div>
                        <div className="text-xs text-gray-500">Last seen: {device.lastSeen.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`font-bold ${getSecurityScoreColor(device.securityScore)}`}>
                          {device.securityScore}/100
                        </div>
                        <div className="text-xs text-gray-500">Security Score</div>
                      </div>
                      {device.vulnerabilities.length > 0 && (
                        <div className="flex space-x-1">
                          {device.vulnerabilities.reduce(
                            (acc, vuln) => {
                              acc[vuln.severity] = (acc[vuln.severity] || 0) + 1
                              return acc
                            },
                            {} as Record<string, number>,
                          ) &&
                            Object.entries(
                              device.vulnerabilities.reduce(
                                (acc, vuln) => {
                                  acc[vuln.severity] = (acc[vuln.severity] || 0) + 1
                                  return acc
                                },
                                {} as Record<string, number>,
                              ),
                            ).map(([severity, count]) => (
                              <Badge key={severity} className={getVulnerabilityColor(severity)} variant="outline">
                                {count} {severity}
                              </Badge>
                            ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        {device.encryption === "strong" ? (
                          <Lock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Unlock className="h-4 w-4 text-red-600" />
                        )}
                        {device.authentication === "strong" ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-600">Start a network scan to discover IoT devices.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Detail Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getDeviceIcon(selectedDevice.deviceType)}
                    <span>{selectedDevice.name}</span>
                    {getStatusIcon(selectedDevice.status)}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDevice(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Device Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">IP Address</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedDevice.ip}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">MAC Address</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedDevice.mac}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Manufacturer</label>
                    <p className="text-sm text-gray-900">{selectedDevice.manufacturer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Model</label>
                    <p className="text-sm text-gray-900">{selectedDevice.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Firmware</label>
                    <p className="text-sm text-gray-900">{selectedDevice.firmware}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Security Score</label>
                    <p className={`text-sm font-bold ${getSecurityScoreColor(selectedDevice.securityScore)}`}>
                      {selectedDevice.securityScore}/100
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Encryption</label>
                    <Badge
                      className={
                        selectedDevice.encryption === "strong"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedDevice.encryption}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Authentication</label>
                    <Badge
                      className={
                        selectedDevice.authentication === "strong"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedDevice.authentication}
                    </Badge>
                  </div>
                </div>

                {/* Open Ports */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Open Ports</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDevice.openPorts.map((port) => (
                      <Badge key={port} variant="secondary">
                        {port}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services */}
                {selectedDevice.services.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Running Services</label>
                    <div className="mt-2 space-y-2">
                      {selectedDevice.services.map((service, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {service.service} ({service.protocol}/{service.port})
                            </span>
                            <Badge variant="outline">{service.version}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 font-mono">{service.banner}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vulnerabilities */}
                {selectedDevice.vulnerabilities.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Security Vulnerabilities</label>
                    <div className="mt-2 space-y-3">
                      {selectedDevice.vulnerabilities.map((vuln) => (
                        <div key={vuln.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getVulnerabilityColor(vuln.severity)} variant="outline">
                                {vuln.severity.toUpperCase()}
                              </Badge>
                              <span className="font-medium">{vuln.type}</span>
                              {vuln.exploitable && <Badge className="bg-red-100 text-red-800">Exploitable</Badge>}
                            </div>
                            {vuln.cve && <Badge variant="outline">{vuln.cve}</Badge>}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{vuln.description}</p>
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <strong>Solution:</strong> {vuln.solution}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
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
