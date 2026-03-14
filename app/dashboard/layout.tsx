'use client';
import ClinicalSidebar from "./components/clinicalSlidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* SIDEBAR */}
      <ClinicalSidebar />

    </div>
  )
}