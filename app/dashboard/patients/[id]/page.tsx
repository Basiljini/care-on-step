'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function PatientDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [patient, setPatient] = useState<any>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)


  useEffect(() => {
    if (id) {
      fetchPatient()
      fetchAssessments()
    }
  }, [id])

  const fetchPatient = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setPatient(data)
  }

  const fetchAssessments = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('patient_id', id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

 const assessmentsWithSignedUrls = await Promise.all(
  (data || []).map(async (assessment) => {
    if (!assessment.foot_image_url) return assessment

    try {
      const { data: signedData, error } = await supabase.storage
        .from('foot-assessments')
        .createSignedUrl(assessment.foot_image_url, 60 * 60)

      if (error) {
        console.warn("Missing file:", assessment.foot_image_url)
        return assessment
      }

      return {
        ...assessment,
        signed_image_url: signedData?.signedUrl
      }
    } catch (err) {
      console.warn("Storage error:", err)
      return assessment
    }
  })
)


  setAssessments(assessmentsWithSignedUrls)
  setLoading(false)
}

  if (loading) return <div className="p-6">Loading...</div>
  if (!patient) return <div className="p-6">Patient not found</div>

  const renderBooleanGroup = (title: string, obj: any) => {
  if (!obj) return null

  const activeItems = Object.entries(obj)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)

  if (activeItems.length === 0) return null

  return (
    <div className="mb-3">
      <p className="font-medium">{title}</p>
      <p className="text-gray-700">
        {activeItems.join(', ')}
      </p>
    </div>
  )
}


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link
  href="/dashboard/patients"
  className="inline-flex m-2 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
>
  ← Back
</Link>
      {/* Header */}
      <div className="md:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {patient.first_name} {patient.surname}
          </h1>
          <p className="text-gray-600">
            DOB: {patient.date_of_birth}
          </p>
        </div>

       <button
  onClick={() =>
    router.push(`/dashboard/patients/${id}/assessment/new`)
  }
  className="px-4 py-2 mt-5 bg-emerald-600 text-white rounded hover:opacity-80"
>
  + Add Assessment
</button>   
 <button
  onClick={() => router.push(`/dashboard/patients/${id}/assessment`)}
  className="mt-5 px-4 py-2 bg-amber-600 text-white rounded hover:opacity-80"
  >
  View Assessment History
  </button>
  <button
    onClick={() => router.push(`/dashboard/patients/${id}/treatment/new`)}
    className="mt-5 px-4 py-2 bg-emerald-600 text-white rounded hover:opacity-80"
  >
   + Add Treatment Form
  </button>
  <button
  onClick={() => router.push(`/dashboard/patients/${id}/treatment`)}
  className="mt-5 px-4 py-2 bg-amber-600 text-white rounded hover:opacity-80"
  >
  View Treatment History
  </button>
 
    </div>

      {/* Demographics */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-white shadow rounded p-6">
          <h2 className="font-semibold mb-4">Contact Details</h2>
          <p><strong>Phone:</strong> {patient.primary_phone}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>City:</strong> {patient.city}</p>
          <p><strong>Province:</strong> {patient.province}</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="font-semibold mb-4">Medical Team (History)</h2>
          <p><strong>Family Physician:</strong> {patient.family_physician_name}</p>
          <p><strong>TCM:</strong> {patient.tcm_name}</p>
          <p><strong>Podiatrist:</strong> {patient.podiatrist_name}</p>
          <p><strong>Specialist 1:</strong> {patient.specialist1_name}</p>
          <p><strong>Surgeon 1:</strong> {patient.surgeon1_name}</p>
        </div>
      </div>

      {/* Service History */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="font-semibold mb-4">Service History</h2>
        <p><strong>Start:</strong> {patient.service_start_date}</p>
        <p><strong>End:</strong> {patient.service_end_date}</p>
        <p><strong>Reason:</strong> {patient.service_reason}</p>
        <p><strong>Consent Signed:</strong> {patient.consent_signed ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}
