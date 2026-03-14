'use client'

import { useRouter } from 'next/navigation'
import HomeButton from './HomeButton'

export default function StaffPanel() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Staff Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/dashboard/patients/new')}
          className="p-6 rounded bg-emerald-500 text-white hover:bg-emerald-800"
        >
          Create New Patient
        </button>

        <button
          onClick={() => router.push('/dashboard/patients')}
          className="p-6 rounded bg-amber-700 text-white hover:bg-amber-800"
        >
          View / Update Existing Patients
        </button>
      </div>
    </div>
  )
}
