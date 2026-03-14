'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function TreatmentSinglePage() {
  const { id, treatmentId } = useParams<{
    id: string
    treatmentId: string
  }>()

  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pdfRef = useRef<HTMLDivElement>(null)

  const fetchTreatment = async () => {
    const { data, error } = await supabase
      .from('client_treatment_forms')
      .select('*')
      .eq('id', treatmentId)
      .maybeSingle()

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    // Generate signed URL
    if (data?.detailed_foot_image) {
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from('foot-assessments')
          .createSignedUrl(data.detailed_foot_image, 60 * 60)

      if (!signedError) setSignedImageUrl(signedData?.signedUrl || null)
      else console.error("Signed URL error:", signedError)
    }

    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!treatmentId) {
      setLoading(false)
      return
    }
    fetchTreatment()
  }, [treatmentId])

  if (loading) return <div className="p-8">Loading...</div>
  if (!data) return <div className="p-8">Treatment not found.</div>

  const form = data.treatment_data || { 'N/A': 'No treatment data available' }

  const renderCheckboxGroup = (title: string, values: any) => {
    if (!values) return null
    const selected = Object.entries(values)
      .filter(([_, v]) => v === true)
      .map(([k]) => k)
    if (selected.length === 0) return null
    return (
      <div className="mb-4">
        <p className="font-semibold">{title}</p>
        <p>{selected.join(', ')}</p>
      </div>
    )
  }

  // ------------------- DOWNLOAD PDF -------------------
  const downloadPDF = async () => {
    if (!pdfRef.current) return
    const html2pdf = (await import("html2pdf.js")).default

    html2pdf()
      .set({
        margin: 0.5,
        filename: `treatment-${treatmentId}.pdf`,
        image: { type: "jpeg", quality: 1 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc: Document) => {
            const allElements = clonedDoc.querySelectorAll("*")
            allElements.forEach(el => {
              const style = window.getComputedStyle(el)
              if (style.color.includes("lab("))
                el.setAttribute("style", "color: black !important;")
              if (style.backgroundColor.includes("lab("))
                el.setAttribute("style", "background-color: white !important;")
            })
          },
        },
      })
      .from(pdfRef.current)
      .save()
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <Link
        href={`/dashboard/patients/${id}/treatment`}
        className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back
      </Link>

      <div className="flex justify-between items-center m-2 rounded-2xl p-4">
        <h1 className="text-2xl text-black font-bold">Treatment Form</h1>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Download PDF
        </button>
      </div>

      <div ref={pdfRef} style={{ color: "black", backgroundColor: "white" }}>
        {/* General Info */}
        <div className="border p-4 rounded space-y-2">
          <p><strong>Nurse:</strong> {form.foot_care_nurse}</p>
          <p><strong>Date:</strong> {form.date}</p>
        </div>

        {/* Medical Section */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-3">Medical</h2>
          {renderCheckboxGroup("Medical Dxs", form.medical_dxs)}
          {renderCheckboxGroup("Medications", form.medications)}
          {renderCheckboxGroup("Neuro (A&Ox)", form.neuro)}
          {renderCheckboxGroup("Amb Status", form.amb_status)}

          {form.general_health && (
            <div className="mt-3">
              <p className="font-semibold">
                Client's Assessment of General Health and Foot Concerns
              </p>
              <p>{form.general_health}</p>
            </div>
          )}
        </div>

        {/* LEFT FOOT */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-3">Left Foot</h2>
          {renderCheckboxGroup("Pulses", form.left?.pulses)}
          <p><strong>Pain:</strong> {form.left?.pain_location}</p>
          {renderCheckboxGroup("Sensation", form.left?.sensation)}
          {renderCheckboxGroup("Skin", form.left?.skin)}
          <p><strong>Notes (abnormals):</strong> {form.left?.notes}</p>
          <p><strong>Treatment Notes:</strong> {form.left?.treatment_notes}</p>
        </div>

        {/* RIGHT FOOT */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-3">Right Foot</h2>
          {renderCheckboxGroup("Pulses", form.right?.pulses)}
          <p><strong>Pain:</strong> {form.right?.pain_location}</p>
          {renderCheckboxGroup("Sensation", form.right?.sensation)}
          {renderCheckboxGroup("Skin", form.right?.skin)}
          <p><strong>Notes (abnormals):</strong> {form.right?.notes}</p>
          <p><strong>Treatment Notes:</strong> {form.right?.treatment_notes}</p>
        </div>

        {/* Education */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-3">Education</h2>
          {renderCheckboxGroup("Education Topics", form.education)}
          <p><strong>Notes:</strong> {form.education_notes}</p>
        </div>

        {/* Communication */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-3">Communication</h2>
          <p><strong>Referral To:</strong> {form.communication?.referral_to || "—"}</p>
          {renderCheckboxGroup("Referral Types", form.communication?.referral_types)}
          <p><strong>Ph/Fax:</strong> {form.communication?.ph_fax || "—"}</p>
          <p><strong>Copy sent to:</strong> {form.communication?.copy_sent_to || "—"}</p>
        </div>

        {/* Foot Image */}
        {signedImageUrl && (
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Detailed Foot Assessment Image</h2>
            <img
              src={signedImageUrl}
              alt="Foot"
              className="w-64 rounded-lg border shadow cursor-pointer hover:opacity-80 transition"
              onClick={() => setSelectedImage(signedImageUrl)}
            />
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={() => setSelectedImage(null)} />
          <div className="relative bg-white p-6 rounded-xl shadow-2xl max-w-5xl w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full Foot Image"
              className="max-h-[75vh] w-auto mx-auto rounded"
            />
            <div className="text-center mt-6">
              <a
                href={selectedImage}
                download
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}