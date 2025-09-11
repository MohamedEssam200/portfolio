"use client"

import { useState, useEffect, useCallback } from "react"

interface NetworkPacket {
  id: string
  timestamp: string
  source: string
  destination: string
  protocol: string
  size: number
  threats: Array<{
    type: string
    description: string
    severity: string
  }>
  threat_level: string
  source_port: number
  dest_port: number
}

interface NetworkStats {
  total_packets: number
  total_bytes: number
  threats_detected: number
  active_connections: number
  bandwidth_bps: number
  monitoring: boolean
}

export function useNetworkAnalyzer() {
  const [packets, setPackets] = useState<NetworkPacket[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    total_packets: 0,
    total_bytes: 0,
    threats_detected: 0,
    active_connections: 0,
    bandwidth_bps: 0,
    monitoring: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startCapture = useCallback(
    async (networkInterface = "eth0", duration?: number) => {
      setLoading(true)
      setError(null)
      setIsMonitoring(true)

      try {
        const response = await fetch("/api/network-analyzer/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "capture",
            interface: networkInterface,
            duration,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          if (data.result && data.result.packets) {
            setPackets(data.result.packets)
            setStats(data.result.capture_info?.statistics || stats)
          }
          return data
        } else {
          setError(data.error || "Capture failed")
          return null
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error")
        return null
      } finally {
        setLoading(false)
        setIsMonitoring(false)
      }
    },
    [stats],
  )

  const stopCapture = useCallback(() => {
    setIsMonitoring(false)
    // In a real implementation, this would send a stop signal to the backend
  }, [])

  const getNetworkStats = useCallback(async () => {
    try {
      const response = await fetch("/api/network-analyzer/stats")
      const data = await response.json()

      if (response.ok && data.success) {
        return data.data
      } else {
        setError(data.error || "Failed to get network stats")
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
      return null
    }
  }, [])

  const analyzeTraffic = useCallback(async (trafficType: "http" | "dns" | "tcp" | "all" = "all") => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/network-analyzer/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "analyze",
          traffic_type: trafficType,
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
    } finally {
      setLoading(false)
    }
  }, [])

  // Simulate real-time packet updates when monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate new packets
        const newPacket: NetworkPacket = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          destination: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          protocol: ["HTTP", "HTTPS", "DNS", "TCP", "UDP", "FTP"][Math.floor(Math.random() * 6)],
          size: Math.floor(Math.random() * 4096) + 64,
          threats:
            Math.random() > 0.8
              ? [
                  {
                    type: "suspicious_activity",
                    description: "Unusual traffic pattern detected",
                    severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
                  },
                ]
              : [],
          threat_level: Math.random() > 0.8 ? ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] : "None",
          source_port: Math.floor(Math.random() * 65535),
          dest_port: Math.floor(Math.random() * 65535),
        }

        setPackets((prev) => [newPacket, ...prev.slice(0, 99)]) // Keep last 100 packets

        setStats((prev) => ({
          ...prev,
          total_packets: prev.total_packets + 1,
          total_bytes: prev.total_bytes + newPacket.size,
          threats_detected: prev.threats_detected + (newPacket.threats.length > 0 ? 1 : 0),
          active_connections: Math.floor(Math.random() * 50) + 10,
          bandwidth_bps: Math.floor(Math.random() * 1000000) + 100000,
          monitoring: true,
        }))
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  return {
    packets,
    stats,
    loading,
    error,
    isMonitoring,
    startCapture,
    stopCapture,
    getNetworkStats,
    analyzeTraffic,
  }
}
