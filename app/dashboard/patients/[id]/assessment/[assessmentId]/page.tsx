'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useRef } from "react"
import { useReactToPrint } from 'react-to-print'

export default function AssessmentSinglePage() {

  const { id, assessmentId } = useParams<{
    id: string
    assessmentId: string
  }>()

  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const pdfRef = useRef<HTMLDivElement>(null)


 useEffect(() => {
  const fetchAssessment = async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .maybeSingle()

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(false)
      return
    }

    // Signed image URL
    if (data.foot_image_url) {
      const { data: signedData } =
        await supabase.storage
          .from('foot-assessments')
          .createSignedUrl(data.foot_image_url, 60 * 60)
      setSignedImageUrl(signedData?.signedUrl || null)
    }

    // <-- key change here
    setAssessment(data)
    setLoading(false)
  }

  fetchAssessment()
}, [assessmentId])


  if (loading) return <div className="p-8">Loading...</div>
  if (!assessment) return <div className="p-8">Assessment not found</div>

const downloadPDF = async () => {
  if (!pdfRef.current) return

  const html2pdf = (await import("html2pdf.js")).default

  html2pdf()
    .set({
      margin: 0.5,
      filename: `assessment-${assessmentId}.pdf`,
      image: { type: "jpeg", quality: 1 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: true,
        onclone: (clonedDoc: Document) => {
          // Force Tailwind classes to use safe colors
          const allElements = clonedDoc.querySelectorAll("*")
          allElements.forEach(el => {
            const style = window.getComputedStyle(el)
            if (style.color.includes("lab(")) el.setAttribute("style", "color: black !important;")
            if (style.backgroundColor.includes("lab(")) el.setAttribute("style", "background-color: white !important;")
          })
        },
      },
    })
    .from(pdfRef.current)
    .save()
}
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 ">

      <Link
        href={`/dashboard/patients/${id}/assessment`}
        className="inline-flex m-2 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back to Assessment History
      </Link>

     <div className="flex justify-between items-center">
  <h1 className="text-2xl font-semibold">
    Assessment Details
  </h1>

  <button
  onClick={downloadPDF}
  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-800"
>
  Download PDF
</button>
</div>
    <div  ref={pdfRef}
  style={{
    color: 'black',
    backgroundColor: 'white'
  }}>
        {/* GENERAL HEALTH */}
  
        <Section title="General Health">
          <Display label="General Health" value={assessment.general_health} />
          <Display label="Foot Concerns" value={assessment.foot_concerns} />
          <Display label="Medical History" value={assessment.medical_history} />
          <Display label="Medications" value={assessment.medications} />
          <Display label="Past Medical History" value={assessment.past_medical_history} />
        </Section>
  
  
        {/* FOCUSSED SYSTEM REVIEW */}
  
        {assessment.focussed_review && (
          <Section title="Focussed Systems Review">
  
            <SubHeading title="Neuro" />
            {renderCheckboxGroup(assessment.focussed_review.neuro)}
  
            <SubHeading title="Diabetes" />
            {renderCheckboxGroup(assessment.focussed_review.diabetes)}
  
            <SubHeading title="Musculoskeletal" />
            {renderCheckboxGroup(assessment.focussed_review.musculoskeletal)}
  
            <SubHeading title="Ambulation" />
            {renderCheckboxGroup(assessment.focussed_review.ambulation)}
  
            <Display
              label="Notes"
              value={assessment.focussed_review.notes}
            />
  
          </Section>
        )}
  
  
        {/* LOWER EXTREMITIES */}
  
        {assessment.lower_extremities && (
          <Section title="Lower Extremities">
  
            <SubHeading title="Right Leg" />
            {renderKeyValueObject(assessment.lower_extremities.right)}
  
            <SubHeading title="Left Leg" />
            {renderKeyValueObject(assessment.lower_extremities.left)}
  
          </Section>
        )}
  
  
        {/* FOOTWEAR */}
  
        <Section title="Footwear / Appliances">
          <Display label="Footwear" value={assessment.footwear} />
          <Display label="Notes" value={assessment.notes} />
        </Section>
  
  
        {/* IMAGE */}
  
  
  
  {signedImageUrl && (
    <Section title="Foot Image">
      <img
        src={signedImageUrl}
        alt="Foot Assessment"
        className="w-72 rounded border cursor-pointer hover:opacity-80 transition"
        onClick={() => setSelectedImage(signedImageUrl)}
      />
    </Section>
  )}
    </div>
 
 {/* IMAGE MODAL */}

{selectedImage && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="relative bg-white p-6 rounded-xl shadow-2xl max-w-5xl w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={selectedImage}
        alt="Full Foot Assessment"
        className="max-h-[75vh] w-auto mx-auto rounded"
      />

      {/* Download */}
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


/* UI components */

const Section = ({ title, children }: any) => (
  <div className="bg-white shadow rounded p-6 space-y-4">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    {children}
  </div>
)

const SubHeading = ({ title }: any) => (
  <h3 className="font-semibold mt-4">{title}</h3>
)

const Display = ({ label, value }: any) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p>{value || '—'}</p>
  </div>
)

const renderCheckboxGroup = (obj: any) => {
  if (!obj) return null

  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(obj).map(([key, value]) =>
        value === true ? (
          <span
            key={key}
            className="px-2 py-1 bg-emerald-100 rounded text-sm"
          >
            {key}
          </span>
        ) : null
      )}
    </div>
  )
}

const renderKeyValueObject = (obj: any) => {
  if (!obj) return null

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(obj).map(([key, value]) => (
        <Display key={key} label={key} value={value} />
      ))}
    </div>
  )
}