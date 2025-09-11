"use client"

import { useState, useCallback } from "react"

interface IoTDevice {
  id: string
  name: string
  ip: string
  mac: string
  manufacturer: string
  device_type: string
  model: string
  firmware: string
  last_seen: string
  status: string
  open_ports: number[]
  services: Array<{
    port: number
    protocol: string
    service: string
    version: string
    banner: string
  }>
  vulnerabilities: Array<{
    type: string
    severity: string
    description: string
    cve?: string
    solution: string
    exploitable: boolean
  }>
  security_score: number
  encryption: string
  authentication: string
}

interface ScanResults {
  total_devices: number
  vulnerable_devices: number
  critical_vulns: number
  high_vulns: number
  medium_vulns: number
  low_vulns: number
  average_security_score: number
  scan_duration: number
}

export function useIoTScanner() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [scanResults, setScanResults] = useState<ScanResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)

  const startScan = useCallback(
    async (networkRange: string, scanType: "quick" | "deep" | "stealth" = "quick", maxThreads = 10) => {
      setLoading(true)
      setError(null)
      setScanProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 2000)

      try {
        const response = await fetch("/api/iot-security/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            networkRange,
            scanType,
            maxThreads,
          }),
        })

        const data = await response.json()

        clearInterval(progressInterval)
        setScanProgress(100)

        if (response.ok && data.success) {
          if (data.result && data.result.devices) {
            setDevices(data.result.devices)
            setScanResults(data.result.scan_info?.scan_results || null)
          }
          return data
        } else {
          setError(data.error || "Scan failed")
          return null
        }
      } catch (err) {
        clearInterval(progressInterval)
        setError(err instanceof Error ? err.message : "Network error")
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const analyzeDevice = useCallback(async (deviceIp: string) => {
    try {
      const response = await fetch("/api/iot-security/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceIp,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return data.result
      } else {
        setError(data.error || "Analysis failed")
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
      return null
    }
  }, [])

  const exportResults = useCallback(async () => {
    try {
      const response = await fetch("/api/iot-security/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devices,
          scanResults,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `iot_security_report_${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError("Export failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export error")
    }
  }, [devices, scanResults])

  return {
    devices,
    scanResults,
    loading,
    error,
    scanProgress,
    startScan,
    analyzeDevice,
    exportResults,
  }
}
