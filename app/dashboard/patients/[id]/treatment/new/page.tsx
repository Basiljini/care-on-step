'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NewTreatmentForm() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    medical_dxs: {
      diabetes: false,
      hypertension: false,
      cardiac: false,
      renal: false,
      other: false,
    },
    medications: {
      anticoagulants: false,
      diabetic: false,
      antihypertensiveness: false,
      diuretics: false,
      none: false,
    },
    neuro: {
      confused: false,
      dementia: false,
      unresponsive: false,
    },
    amb_status: {
      amb: false,
      none: false,
      cane: false,
      walker: false,
      assist: false,
      pa: false,
    },
    client_assessment: "",

    left: {
      pulses: {
        dorsalis_pedis: false,
        posterior_tibial: false,
        both_absent: false,
      },
      pain_location: "",
      sensation: {
        numbness: false,
        tingling: false,
        prickly_needles: false,
      },
      skin: {
        dry: false,
        flaky: false,
        sweaty: false,
        reddened: false,
        rash: false,
        odorous: false,
        cracked_heels: false,
        fissures: false,
        psoriasis: false,
      },
      notes: "",
      treatment_notes: "",
    },

    right: {
      pulses: {
        dorsalis_pedis: false,
        posterior_tibial: false,
        both_absent: false,
      },
      pain_location: "",
      sensation: {
        numbness: false,
        tingling: false,
        prickly_needles: false,
      },
      skin: {
        dry: false,
        flaky: false,
        sweaty: false,
        reddened: false,
        rash: false,
        odorous: false,
        cracked_heels: false,
        fissures: false,
        psoriasis: false,
      },
      notes: "",
      treatment_notes: "",
    },

    education: {
      hygiene: false,
      footwear: false,
      hypertension: false,
      diabetes: false,
      skin_care: false,
      nail_care: false,
      medication: false,
    },

    education_notes: "",

    communication: {
      referral_to: "",
      referral_types: {
        gp: false,
        podiatrist: false,
        diabetic_nurse: false,
        home_health: false,
        endocrinologist: false,
        vascular_surgeon: false,
      },
      ph_fax: "",
      copy_sent_to: "",
    },

    foot_care_nurse: "",
    date: "",

    detailed_foot_image: "",
  })
const handleCheckbox = (path: string[]) => {
  setForm(prev => {
    const newState = structuredClone(prev)

    let current: any = newState
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    const lastKey = path[path.length - 1]
    current[lastKey] = !current[lastKey]

    return newState
  })
}

const handleChange = (path: string[], value: string) => {
  setForm(prev => {
    const newState = structuredClone(prev)

    let current: any = newState
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value

    return newState
  })
}

const handleImageUpload = async (file: File) => {
  const fileName = `treatment-${crypto.randomUUID()}.${file.name.split('.').pop()}`

  const { error } = await supabase.storage
    .from('foot-assessments')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    return
  }

  setForm(prev => ({
    ...prev,
    detailed_foot_image: fileName
  }))
}
const handleSubmit = async () => {
  setLoading(true)

  const { error } = await supabase
    .from('client_treatment_forms')
    .insert([
      {
        patient_id: id,
        treatment_data: {
          ...form,
          detailed_foot_image: undefined
        },
        detailed_foot_image: form.detailed_foot_image
      }
    ])

  setLoading(false)

  if (!error) {
    router.push(`/dashboard/patients/${id}`)
  } else {
    console.error(error)
  }
}
return (
  <div className="max-w-6xl mx-auto p-8 space-y-10">
    <Link
        href={`/dashboard/patients/${id}`}
        className="inline-flex m-2 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back 
      </Link>

   <div className='bg-emerald-600 p-3'>
        <h1 className="text-2xl text-white font-semibold border-b pb-3">
          Client Treatment Form
        </h1>
   </div>

    {/* ================= GENERAL INFORMATION ================= */}

    <div className="border rounded-lg p-6 space-y-6">

      {/* Medical Dxs */}
      <div>
        <h2 className="font-semibold mb-2">Medical Dxs</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(form.medical_dxs).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.medical_dxs[key as keyof typeof form.medical_dxs]}
                onChange={() => handleCheckbox(["medical_dxs", key])}
              />
              {key.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div>
        <h2 className="font-semibold mb-2">Medications</h2>
        <div className="md:grid grid-cols-2 gap-2 ">
          {Object.keys(form.medications).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.medications[key as keyof typeof form.medications]}
                onChange={() => handleCheckbox(["medications", key])}
              />
              {key.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      {/* Neuro */}
      <div>
        <h2 className="font-semibold mb-2">Neuro (A&Ox)</h2>
        <div className="md:grid grid-cols-2 gap-2">
          {Object.keys(form.neuro).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.neuro[key as keyof typeof form.neuro]}
                onChange={() => handleCheckbox(["neuro", key])}
              />
              {key.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      {/* Amb Status */}
      <div>
        <h2 className="font-semibold mb-2">Amb Status</h2>
        <div className="md:grid grid-cols-2 gap-2">
          {Object.keys(form.amb_status).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.amb_status[key as keyof typeof form.amb_status]}
                onChange={() => handleCheckbox(["amb_status", key])}
              />
              {key.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      

      {/* Client Assessment */}
      <div>
        <h2 className="font-semibold mb-2">
          Client's Assessment of General Health and Foot Concerns
        </h2>
        <textarea
          className="w-full border rounded p-3"
          rows={4}
          value={form.client_assessment}
          onChange={(e) =>
            handleChange(["client_assessment"], e.target.value)
          }
        />
      </div>

      {/* Detailed Foot Image */}
      <div>
        <h2 className="font-semibold mb-2">
          Detailed Foot Assessment (Upload Image)
        </h2>

        <div className="flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageUpload(e.target.files[0])
                }
              }}
            />
        </div>

        {form.detailed_foot_image && (
          <p className="text-sm text-green-600 mt-2">
            Image uploaded successfully
          </p>
        )}
      </div>
    </div>
    {/* ================= LEFT & RIGHT FOOT ================= */}

<div className="grid md:grid-cols-2 gap-8">

  {/* ================= LEFT FOOT ================= */}
  <div className="border rounded-lg p-6 space-y-6">
    <h2 className="text-lg font-semibold border-b pb-2">
      Left
    </h2>

    {/* Pulses */}
    <div>
      <h3 className="font-medium mb-2">Pulses</h3>
      {Object.keys(form.left.pulses).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.left.pulses[key as keyof typeof form.left.pulses]}
            onChange={() => handleCheckbox(["left", "pulses", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Pain */}
    <div>
      <h3 className="font-medium mb-2">Pain (/Loc)</h3>
      <input
        type="text"
        className="w-full border rounded p-2"
        value={form.left.pain_location}
        onChange={(e) =>
          handleChange(["left", "pain_location"], e.target.value)
        }
      />
    </div>

    {/* Sensation */}
    <div>
      <h3 className="font-medium mb-2">Sensation</h3>
      {Object.keys(form.left.sensation).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.left.sensation[key as keyof typeof form.left.sensation]}
            onChange={() => handleCheckbox(["left", "sensation", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Skin */}
    <div>
      <h3 className="font-medium mb-2">Skin</h3>
      {Object.keys(form.left.skin).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.left.skin[key as keyof typeof form.left.skin]}
            onChange={() => handleCheckbox(["left", "skin", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Notes */}
    <div>
      <h3 className="font-medium mb-2">Notes (Abnormals)</h3>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={form.left.notes}
        onChange={(e) =>
          handleChange(["left", "notes"], e.target.value)
        }
      />
    </div>

    {/* Treatment Notes */}
    <div>
      <h3 className="font-medium mb-2">Treatment Notes</h3>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={form.left.treatment_notes}
        onChange={(e) =>
          handleChange(["left", "treatment_notes"], e.target.value)
        }
      />
    </div>
  </div>


  {/* ================= RIGHT FOOT ================= */}
  <div className="border rounded-lg p-6 space-y-6">
    <h2 className="text-lg font-semibold border-b pb-2">
      Right
    </h2>

    {/* Pulses */}
    <div>
      <h3 className="font-medium mb-2">Pulses</h3>
      {Object.keys(form.right.pulses).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.right.pulses[key as keyof typeof form.right.pulses]}
            onChange={() => handleCheckbox(["right", "pulses", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Pain */}
    <div>
      <h3 className="font-medium mb-2">Pain (/Loc)</h3>
      <input
        type="text"
        className="w-full border rounded p-2"
        value={form.right.pain_location}
        onChange={(e) =>
          handleChange(["right", "pain_location"], e.target.value)
        }
      />
    </div>

    {/* Sensation */}
    <div>
      <h3 className="font-medium mb-2">Sensation</h3>
      {Object.keys(form.right.sensation).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.right.sensation[key as keyof typeof form.right.sensation]}
            onChange={() => handleCheckbox(["right", "sensation", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Skin */}
    <div>
      <h3 className="font-medium mb-2">Skin</h3>
      {Object.keys(form.right.skin).map((key) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={form.right.skin[key as keyof typeof form.right.skin]}
            onChange={() => handleCheckbox(["right", "skin", key])}
          />
          {" "}{key.replace("_", " ")}
        </label>
      ))}
    </div>

    {/* Notes */}
    <div>
      <h3 className="font-medium mb-2">Notes (Abnormals)</h3>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={form.right.notes}
        onChange={(e) =>
          handleChange(["right", "notes"], e.target.value)
        }
      />
    </div>

    {/* Treatment Notes */}
    <div>
      <h3 className="font-medium mb-2">Treatment Notes</h3>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={form.right.treatment_notes}
        onChange={(e) =>
          handleChange(["right", "treatment_notes"], e.target.value)
        }
      />
    </div>
  </div>

</div>
    {/* ================= EDUCATION & COMMUNICATION ================= */}

    <div className="border rounded-lg p-6 space-y-6">
        {/* Education */}
        <div>
            <h2 className="font-semibold mb-2">Education</h2>   
            <div className=' md:flex md:flex-row md:items-center md:gap-4'>
                {Object.keys(form.education).map((key) => (
                    <label key={key} className="block">
                        <input  
                            type="checkbox"
                            checked={form.education[key as keyof typeof form.education]}
                            onChange={() => handleCheckbox(["education", key])}
                        />
                        {" "}{key.replace("_", " ")}
                    </label>
                ))}
            </div>
        </div>
  
        {/* Education Notes */}     
        <div></div>
            <h2 className="font-semibold mb-2">Education Notes</h2>
            <textarea
                className="w-full border rounded p-3"
                rows={4}
                value={form.education_notes}
                onChange={(e) =>
                    handleChange(["education_notes"], e.target.value)
                }
            />
        </div>

        {/* Communication */}
        <div>
            <h2 className="font-semibold mb-2">Communication</h2>
            <div className="mb-4"></div>
                <label className="block mb-1">Referral To:</label>
                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={form.communication.referral_to}
                    onChange={(e) =>
                        handleChange(["communication", "referral_to"], e.target.value)
                    }
                />
            </div>

            <div>
                <label className="block mb-1">Referral Types:</label>
                <div className="md:flex md:flex-row md:items-center md:gap-4">
                    {Object.keys(form.communication.referral_types).map((key) => (
                        <label key={key} className="block">
                            <input  
                                type="checkbox"
                                checked={form.communication.referral_types[key as keyof typeof form.communication.referral_types]}
                                onChange={() => handleCheckbox(["communication", "referral_types", key])}
                            />
                            {" "}{key.replace("_", " ")}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block mb-1">PH/Fax:</label>
                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={form.communication.ph_fax}
                    onChange={(e) =>
                        handleChange(["communication", "ph_fax"], e.target.value)
                    }
                />
            </div>

            <div>
                <label className="block mb-1">Copy Sent To:</label>
                <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={form.communication.copy_sent_to}
                    onChange={(e) =>
                        handleChange(["communication", "copy_sent_to"], e.target.value)
                    }
                />
            </div>
            <div>
                <label className="block mb-1">Foot Care Nurse:</label>
                <input
                    type="text" 
                    className="w-full border rounded p-2"
                    value={form.foot_care_nurse}
                    onChange={(e) =>
                        handleChange(["foot_care_nurse"], e.target.value)
                    }
                />
            </div>
            <div>
                <label className="block mb-1">Date:</label>
                <input
                    type="date" 
                    className="w-full border rounded p-2"
                    value={form.date}
                    onChange={(e) =>
                        handleChange(["date"], e.target.value)
                    }
                />
            </div>

            <div className="text-right">
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-6 py-2 bg-emerald-600 text-white rounded hover:opacity-80"
    >
      {loading ? "Saving..." : "Save Treatment Form"}
    </button>
  </div>
            </div>
)}
