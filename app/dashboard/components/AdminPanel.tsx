'use client'

import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const router = useRouter()

  return (
    <div className="space-y-6">
        <div>
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
           onClick={() => router.push('/dashboard/staffs/new')}
          className="p-6 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Create New Staff
        </button>

        <button
          onClick={() => router.push('/dashboard/staffs/remove')}
          className="p-6 rounded bg-amber-600 text-white hover:bg-amber-700"
        >
          Delete Existing Staff
        </button>
         <button
          onClick={() => router.push('/dashboard/patients/new')}
          className="p-6 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Create New Patient
        </button>
         <button
          onClick={() => router.push('/dashboard/patients')}
          className="p-6 rounded bg-amber-600 text-white hover:bg-amber-700"
        >
          Update / Delete Existing Patient
        </button>
      </div>
    </div>
  )
}
