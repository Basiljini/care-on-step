'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AssessmentHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      const { data, error } = await supabase
        .from('assessments') // use your actual table
        .select('*')
        .eq('patient_id', id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAssessments(data)
      }

      setLoading(false)
    }

    fetchAssessments()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">

      <Link
        href={`/dashboard/patients/${id}`}
        className="inline-flex m-2 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back to Patient
      </Link>

      <h1 className="text-2xl font-semibold">
        Assessment History
      </h1>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <div className="space-y-4">
  {assessments.map((assessment) => (
    <Link
      key={assessment.id}
      href={`/dashboard/patients/${id}/assessment/${assessment.id}`}
      className="block border p-4 rounded hover:bg-gray-50 transition"
    >
    <p className="font-medium">
  Assessment by {assessment.staff_name || "Staff"}
</p>

<p className="text-sm text-gray-500">
  {new Date(assessment.created_at).toLocaleString()}
</p>
    </Link>
  ))}
</div>
      )}
    </div>
  )
}