"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Play,
  Search,
  Download,
  Router,
  Smartphone,
  Camera,
  Thermometer,
  Lightbulb,
  Lock,
} from "lucide-react"
import Link from "next/link"

interface IoTDevice {
  id: string
  name: string
  type: "camera" | "thermostat" | "router" | "smart_bulb" | "sensor" | "phone"
  ip: string
  mac: string
  manufacturer: string
  firmware: string
  status: "online" | "offline"
  vulnerabilities: Vulnerability[]
  riskScore: number
}

interface Vulnerability {
  id: string
  type: string
  severity: "Critical" | "High" | "Medium" | "Low"
  description: string
  cve?: string
  recommendation: string
}

interface ScanResult {
  deviceId: string
  status: "scanning" | "completed" | "failed"
  progress: number
  testsRun: number
  totalTests: number
}

export default function IoTSecurityAudit() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [scanResults, setScanResults] = useState<{ [key: string]: ScanResult }>({})
  const [isScanning, setIsScanning] = useState(false)
  const [networkRange, setNetworkRange] = useState("192.168.1.0/24")

  const mockDevices: IoTDevice[] = [
    {
      id: "1",
      name: "Living Room Camera",
      type: "camera",
      ip: "192.168.1.101",
      mac: "AA:BB:CC:DD:EE:01",
      manufacturer: "Hikvision",
      firmware: "V5.4.5 build 160530",
      status: "online",
      riskScore: 85,
      vulnerabilities: [
        {
          id: "v1",
          type: "Default Credentials",
          severity: "Critical",
          description: "Device uses default admin credentials",
          cve: "CVE-2017-7921",
          recommendation: "Change default username and password immediately",
        },
        {
          id: "v2",
          type: "Firmware Vulnerability",
          severity: "High",
          description: "Outdated firmware with known security flaws",
          recommendation: "Update to latest firmware version",
        },
      ],
    },
    {
      id: "2",
      name: "Smart Thermostat",
      type: "thermostat",
      ip: "192.168.1.102",
      mac: "AA:BB:CC:DD:EE:02",
      manufacturer: "Nest",
      firmware: "6.0-15",
      status: "online",
      riskScore: 25,
      vulnerabilities: [
        {
          id: "v3",
          type: "Weak Encryption",
          severity: "Medium",
          description: "Uses outdated encryption protocols",
          recommendation: "Enable WPA3 if supported, otherwise use WPA2",
        },
      ],
    },
    {
      id: "3",
      name: "WiFi Router",
      type: "router",
      ip: "192.168.1.1",
      mac: "AA:BB:CC:DD:EE:03",
      manufacturer: "Linksys",
      firmware: "1.0.04.14",
      status: "online",
      riskScore: 60,
      vulnerabilities: [
        {
          id: "v4",
          type: "WPS Enabled",
          severity: "High",
          description: "WPS is enabled and vulnerable to brute force attacks",
          recommendation: "Disable WPS in router settings",
        },
        {
          id: "v5",
          type: "Remote Management",
          severity: "Medium",
          description: "Remote management is enabled",
          recommendation: "Disable remote management unless required",
        },
      ],
    },
    {
      id: "4",
      name: "Smart Light Bulb",
      type: "smart_bulb",
      ip: "192.168.1.103",
      mac: "AA:BB:CC:DD:EE:04",
      manufacturer: "Philips Hue",
      firmware: "1.46.13",
      status: "online",
      riskScore: 15,
      vulnerabilities: [],
    },
  ]

  const startNetworkScan = () => {
    setIsScanning(true)
    setDevices([])
    setScanResults({})

    // Simulate device discovery
    setTimeout(() => {
      setDevices(mockDevices)
      setIsScanning(false)
    }, 3000)
  }

  const startDeviceAudit = (deviceId: string) => {
    setScanResults((prev) => ({
      ...prev,
      [deviceId]: {
        deviceId,
        status: "scanning",
        progress: 0,
        testsRun: 0,
        totalTests: 15,
      },
    }))

    const interval = setInterval(() => {
      setScanResults((prev) => {
        const current = prev[deviceId]
        if (!current) return prev

        const newProgress = current.progress + Math.random() * 10
        const newTestsRun = Math.min(current.testsRun + 1, current.totalTests)

        if (newProgress >= 100 || newTestsRun >= current.totalTests) {
          clearInterval(interval)
          return {
            ...prev,
            [deviceId]: {
              ...current,
              status: "completed",
              progress: 100,
              testsRun: current.totalTests,
            },
          }
        }

        return {
          ...prev,
          [deviceId]: {
            ...current,
            progress: newProgress,
            testsRun: newTestsRun,
          },
        }
      })
    }, 500)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "camera":
        return <Camera className="h-5 w-5" />
      case "thermostat":
        return <Thermometer className="h-5 w-5" />
      case "router":
        return <Router className="h-5 w-5" />
      case "smart_bulb":
        return <Lightbulb className="h-5 w-5" />
      case "phone":
        return <Smartphone className="h-5 w-5" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-red-100 text-red-800 border-red-200"
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200"
    if (score >= 20) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High Risk"
    if (score >= 40) return "Medium Risk"
    if (score >= 20) return "Low Risk"
    return "Secure"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
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
            <Badge className="bg-orange-100 text-orange-800">
              <Shield className="h-3 w-3 mr-1" />
              IoT Security Framework
            </Badge>
          </div>
        </div>

        {/* Network Discovery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-600" />
              Network Discovery
            </CardTitle>
            <CardDescription>Scan your network to discover IoT devices and assess their security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Network Range</label>
                <Input
                  placeholder="192.168.1.0/24"
                  value={networkRange}
                  onChange={(e) => setNetworkRange(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <Button onClick={startNetworkScan} disabled={isScanning} className="bg-orange-600 hover:bg-orange-700">
                <Play className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Start Discovery"}
              </Button>
            </div>
            {isScanning && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Discovering devices...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Devices Overview */}
        {devices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{devices.length}</div>
                <div className="text-sm text-gray-600">Devices Found</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{devices.filter((d) => d.riskScore >= 70).length}</div>
                <div className="text-sm text-gray-600">High Risk</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {devices.reduce((sum, d) => sum + d.vulnerabilities.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Vulnerabilities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {devices.filter((d) => d.vulnerabilities.length === 0).length}
                </div>
                <div className="text-sm text-gray-600">Secure Devices</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Device List */}
        <div className="space-y-4">
          {devices.map((device) => (
            <Card key={device.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription>
                        {device.manufacturer} • {device.ip} • {device.firmware}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(device.riskScore)}>{getRiskLevel(device.riskScore)}</Badge>
                    <Badge variant={device.status === "online" ? "default" : "secondary"}>
                      {device.status === "online" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {device.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Scan Progress */}
                {scanResults[device.id] && scanResults[device.id].status === "scanning" && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Security Audit in Progress</span>
                      <span>
                        {scanResults[device.id].testsRun}/{scanResults[device.id].totalTests} tests
                      </span>
                    </div>
                    <Progress value={scanResults[device.id].progress} className="h-2" />
                  </div>
                )}

                {/* Device Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">MAC Address:</span>
                    <div className="text-gray-600 font-mono">{device.mac}</div>
                  </div>
                  <div>
                    <span className="font-medium">Device Type:</span>
                    <div className="text-gray-600 capitalize">{device.type.replace("_", " ")}</div>
                  </div>
                  <div>
                    <span className="font-medium">Risk Score:</span>
                    <div className="text-gray-600">{device.riskScore}/100</div>
                  </div>
                  <div>
                    <span className="font-medium">Vulnerabilities:</span>
                    <div className="text-gray-600">{device.vulnerabilities.length} found</div>
                  </div>
                </div>

                {/* Vulnerabilities */}
                {device.vulnerabilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      Security Issues
                    </h4>
                    <div className="space-y-2">
                      {device.vulnerabilities.map((vuln) => (
                        <div key={vuln.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Lock className="h-4 w-4 text-gray-600" />
                              <h5 className="font-medium">{vuln.type}</h5>
                            </div>
                            <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{vuln.description}</p>
                          {vuln.cve && <div className="text-xs text-gray-500 mb-2">CVE: {vuln.cve}</div>}
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <span className="font-medium text-blue-900">Recommendation: </span>
                            <span className="text-blue-800">{vuln.recommendation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => startDeviceAudit(device.id)}
                    disabled={scanResults[device.id]?.status === "scanning"}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {scanResults[device.id]?.status === "scanning" ? "Auditing..." : "Run Security Audit"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {devices.length === 0 && !isScanning && (
          <Card className="text-center py-12">
            <CardContent>
              <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No IoT devices found</h3>
              <p className="text-gray-600">
                Start a network discovery scan to find and assess IoT devices on your network.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
