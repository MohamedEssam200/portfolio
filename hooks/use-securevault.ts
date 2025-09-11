"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface PasswordEntry {
  id: string
  website: string
  username: string
  encrypted_password: string
  category: string
  created_at: string
  updated_at: string
}

export function useSecureVault() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchPasswords = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/securevault/passwords")
      const data = await response.json()

      if (response.ok) {
        setPasswords(data.passwords || [])
      } else {
        setError(data.error || "Failed to fetch passwords")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const addPassword = async (passwordData: {
    website: string
    username: string
    password: string
    category: string
  }) => {
    try {
      const response = await fetch("/api/securevault/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchPasswords() // Refresh the list
        return data.password
      } else {
        throw new Error(data.error || "Failed to add password")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add password")
      throw err
    }
  }

  const deletePassword = async (id: string) => {
    try {
      const response = await fetch(`/api/securevault/passwords/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPasswords() // Refresh the list
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete password")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete password")
      throw err
    }
  }

  useEffect(() => {
    fetchPasswords()
  }, [])

  return {
    passwords,
    loading,
    error,
    addPassword,
    deletePassword,
    refetch: fetchPasswords,
  }
}
