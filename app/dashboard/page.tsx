'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStaffUser } from "@/lib/supabase/auth"
import dynamic from "next/dynamic"

// Dynamically import panels to avoid SSR issues
const AdminPanel = dynamic(() => import("./components/AdminPanel"), { ssr: false })
const StaffPanel = dynamic(() => import("./components/StaffPanel"), { ssr: false })

type Role = 'admin' | 'staff'

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const user = await getStaffUser()
      if (!user) {
        router.push('/login')
        return
      }
      setRole(user.role as Role)
      setLoading(false)
    }
    loadUser()
  }, [router])

  if (loading) return <p className="p-6">Loading dashboard…</p>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-amber-500">
        <span className="text-emerald-700">Care</span> on Step
      </h1>

      {role === 'admin' && <AdminPanel />}
      {role === 'staff' && <StaffPanel />}
    </div>
  )
}