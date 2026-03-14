'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Shield, Menu, X } from 'lucide-react'
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function ClinicalSidebar() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  
  async function handleLogout() {
  await supabase.auth.signOut()
  router.push("/login")
}
  const getRole = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (data) {
      setRole(data.role)
    }
  }

  getRole()


  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 md:hidden bg-white border rounded-lg p-2 shadow"
      >
        <Menu size={20} />
      </button>


      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}


      {/* SIDEBAR */}
      <div
        className={`
        fixed top-0 right-0 h-full w-72
        bg-white border-l shadow-xl
        flex flex-col
        transition-transform duration-300
        z-50
        ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Clinical Panel</h2>

          <button
            onClick={() => setOpen(false)}
            className="p-1"
          >
            <X size={18} />
          </button>
        </div>


        {/* MENU */}
        <nav className="flex flex-col p-4 gap-5 text-sm">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-emerald-600"
          >
            <LayoutDashboard size={18}/>
            Dashboard
          </Link>

          <Link
            href="/dashboard/patients"
            className="flex items-center gap-2 hover:text-emerald-600"
          >
            <Users size={18}/>
            Patients
          </Link>
           {role === "admin" && (
           <Link
             href="/dashboard/audit-logs"
             className="flex items-center gap-2  hover:text-emerald-600"
            >
              <Shield size={18}></Shield>
             Audit Logs 
           </Link>
          )}
            
          <button
          onClick={handleLogout}
           className="flex items-center gap-2 text-red-500 hover:text-red-900 mt-auto"
          >
          <LogOut size={18} />
          Logout
        </button>


        </nav>
      </div>


      {/* DESKTOP TAB HANDLE */}
      <button
        onClick={() => setOpen(!open)}
        className="
        hidden md:flex
        fixed top-1/2 right-0 -translate-y-1/2
        bg-white border rounded-l-lg
        shadow p-2
        z-40
        hover:bg-gray-100
        "
      >
        {open ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
      </button>

    </>
  )
}