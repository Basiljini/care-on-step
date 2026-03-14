'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
export default function NewPatientPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    surname: '',
    gender: 'male',
    date_of_birth: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    email: '',
    primary_phone: '',
    partner_phone: '',
    partner_email: '',
      family_physician_name: '',
  family_physician_office: '',
  family_physician_phone: '',

  tcm_name: '',
  tcm_office: '',
  tcm_phone: '',

  podiatrist_name: '',
  podiatrist_office: '',
  podiatrist_phone: '',

  specialist1_name: '',
  specialist1_office: '',
  specialist1_phone: '',

  specialist2_name: '',
  specialist2_office: '',
  specialist2_phone: '',

  surgeon1_name: '',
  surgeon1_office: '',
  surgeon1_phone: '',

  surgeon2_name: '',
  surgeon2_office: '',
  surgeon2_phone: '',

  nurse_name: '',
  nurse_office: '',
  nurse_phone: '',

  report_fax: '',
  medical_notes: '',

  service_start_date: '',
  service_end_date: '',
  service_reason: '',
  consent_signed: false,
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleFinalSubmit = async () => {
  setLoading(true)

  const { data: patientData, error: patientError } =
    await supabase
      .from('patients')
      .insert({
        first_name: form.first_name,
        surname: form.surname,
        gender: form.gender,
        date_of_birth: form.date_of_birth,
        address: form.address,
        city: form.city,
        province: form.province,
        postal_code: form.postal_code,
        email: form.email,
        primary_phone: form.primary_phone,
        partner_phone: form.partner_phone,
        partner_email: form.partner_email,
        family_physician_name: form.family_physician_name,
        family_physician_office: form.family_physician_office,
        family_physician_phone: form.family_physician_phone,
        tcm_name: form.tcm_name,
        tcm_office: form.tcm_office,
        tcm_phone: form.tcm_phone,
        podiatrist_name: form.podiatrist_name,
        podiatrist_office: form.podiatrist_office,
        podiatrist_phone: form.podiatrist_phone,
        specialist1_name: form.specialist1_name,
        specialist1_office: form.specialist1_office,
        specialist1_phone: form.specialist1_phone,
        specialist2_name: form.specialist2_name,
        specialist2_office: form.specialist2_office,
        specialist2_phone: form.specialist2_phone,
        surgeon1_name: form.surgeon1_name,
        surgeon1_office: form.surgeon1_office,
        surgeon1_phone: form.surgeon1_phone,
        surgeon2_name: form.surgeon2_name,
        surgeon2_office: form.surgeon2_office,
        surgeon2_phone: form.surgeon2_phone,
        nurse_name: form.nurse_name,
        nurse_office: form.nurse_office,
        nurse_phone: form.nurse_phone,
        report_fax: form.report_fax,
        medical_notes: form.medical_notes,
        service_start_date: form.service_start_date,
        service_end_date: form.service_end_date,
        service_reason: form.service_reason,
        consent_signed: form.consent_signed
      })
      .select()
      .single()

  if (patientError) {
    alert(patientError.message)
    setLoading(false)
    return
  }

  setLoading(false)
router.push('/dashboard/patients')
}



  return (
   <div>
     <Link
        href={`/dashboard`}
        className="inline-flex mt-1 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back
      </Link>
      <div className="flex items-center justify-center mt-10">
       
        <div className="text-center items-center max-w-3xl p-6">
        <h1 className="text-xl font-bold mb-6">New Patient</h1>
       
       {step === 1 && (
        <form  className="space-y-6 text-center">
          {/* Demographics */}
          <section>
            <h2 className="font-semibold mb-2">Demographics</h2>
  
            <div className="grid grid-cols-2 gap-4">
              <input name="first_name" placeholder="First Name" required onChange={handleChange} />
              <input name="surname" placeholder="Surname" required onChange={handleChange} />
  
              <input type="date" name="date_of_birth" required onChange={handleChange} />
  
              <select name="gender" onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
  
              <input name="address" placeholder="Address" onChange={handleChange} />
              <input name="city" placeholder="City / Town" onChange={handleChange} />
              <input name="province" placeholder="Province" onChange={handleChange} />
              <input name="postal_code" placeholder="Postal Code" onChange={handleChange} />
              <input name="email" placeholder="Email" type="email" onChange={handleChange} />
            </div>
          </section>
          {/* Contact */}
          <section>
            <h2 className="font-semibold mb-2">Contact</h2>
  
            <div className="grid grid-cols-2 gap-4">
              <input name="primary_phone" placeholder="Primary Phone" required onChange={handleChange} />
              <input name="secondary_phone" placeholder="Secondary Phone" onChange={handleChange} />
              <input name="partner_phone" placeholder="Partner Phone" onChange={handleChange} />
              <input name="partner_email" placeholder="Partner Email" type="email" onChange={handleChange} />
            </div>
          </section>  
        </form>
       )}
          {/* medical team */}
      {step === 2 && (
      <section className='p-5'>
    <h2 className="font-semibold mb-4">Medical Team</h2>
  
    {[
      ['Family Physician', 'family_physician'],
      ['TCM Professional', 'tcm'],
      ['Podiatrist', 'podiatrist'],
      ['Specialist 1', 'specialist1'],
      ['Specialist 2', 'specialist2'],
      ['Surgeon 1', 'surgeon1'],
      ['Surgeon 2', 'surgeon2'],
      ['Community Health Nurse', 'nurse'],
    ].map(([label, key]) => (
      <div key={key} className="grid grid-cols-3 gap-4 mb-4">
        <input
          name={`${key}_name`}
          placeholder={`${label} Name`}
          onChange={handleChange}
        />
        <input
          name={`${key}_office`}
          placeholder="Office"
          onChange={handleChange}
        />
        <input
          name={`${key}_phone`}
          placeholder="Phone"
          onChange={handleChange}
        />
      </div>
    ))}
  
    <input
      name="report_fax"
      placeholder="Fax No. for Reports"
      onChange={handleChange}
    />
  
    <textarea
      name="medical_notes"
      placeholder="Notes"
      className="w-full mt-4 p-2 border rounded"
      onChange={handleChange}
    />
  </section>
  )}
  
  {/* service & consent */}
  
  {step === 3 && (
  <section className='p-5 flex flex-col items-center'>
    <h2 className="font-semibold mb-4">Service & Consent</h2>
  
    <div className="grid grid-cols-2 gap-4 items-center">
      <span>from</span>
      <input
        type="date"
        name="service_start_date"
        onChange={handleChange}
        title='from'
      />
      <span>to</span>
      <input
        type="date"
        name="service_end_date"
        onChange={handleChange}
      />
    </div>
    <input className='mt-6'
        name="service_reason"
        placeholder="Reason for Service Closure"
        onChange={handleChange}
      />
  
    <label className="flex items-center gap-2 mt-4">
      <input
        type="checkbox"
        onChange={e =>
          setForm({ ...form, consent_signed: e.target.checked })
        }
      />
      Consent Signed
    </label>
  </section>
  )}
  
  {step === 4 && (
      <section>
        {/* Assessment Form (we’ll add properly next) */}
      </section>
    )}
  {/* save button */}
  
       {/* Navigation Buttons */}
     <div className="flex justify-evenly mt-10">
      {step > 1 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
      )}
  
       {step < 4 ? (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="px-6 py-2 bg-emerald-600 text-white rounded"
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={handleFinalSubmit}
          className="ml-6 px-6 py-2 bg-emerald-700 text-white rounded"
        >
          {loading ? "Saving..." : "Save Patient"}
        </button>
      )}
      </div>
     
    </div>
      </div>
   </div>
  )
}
