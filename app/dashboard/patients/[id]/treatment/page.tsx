'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'


export default function TreatmentHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const [treatments, setTreatments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchTreatments = async () => {
       const { data, error } = await supabase
  .from('client_treatment_forms')
  .select('id, created_at, treatment_data')
  .eq('patient_id', id)
  .order('created_at', { ascending: false })

      if (!error) {
        setTreatments(data || [])
      }

      setLoading(false)
    }

    fetchTreatments()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>

  if (treatments.length === 0)
    return <div className="p-8">No treatments yet.</div>

  return (
    <div>
<Link
  href={`/dashboard/patients/${id}`}
  className="p-2 m-3 inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
>
  ← Back
</Link>
    <div className='bg-emerald-600 flex justify-center p-3 m-2 rounded'>
        <h2 className="text-white p-4 font-bold text-4xl">Treatment History</h2>
      </div>      
      <div className="p-8 space-y-4">
      {treatments.map((t) => {
  const nurse = t.treatment_data?.foot_care_nurse || 'Unknown Nurse'

  return (
    <Link
      key={t.id}
      href={`/dashboard/patients/${id}/treatment/${t.id}`}
      className="block border p-4 rounded hover:bg-gray-50 transition"
    >
      <p className="font-medium">
        {new Date(t.created_at).toLocaleDateString()}
      </p>

      <p className="text-sm text-gray-600">
        Nurse: {nurse}
      </p>

      <p className="text-xs text-gray-400">
        {new Date(t.created_at).toLocaleTimeString()}
      </p>
    </Link>
  )
})}
      </div>
    </div>
  )
}