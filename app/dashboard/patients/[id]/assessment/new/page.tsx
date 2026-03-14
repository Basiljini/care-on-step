'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid' // make sure to install: npm i uuid

export default function AssessmentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    general_health: '',
    foot_concerns: '',
    medical_history: '',
    medications: '',
    past_medical_history: '',

    focussed_review: {
      neuro: { unresponsive: false, dementia: false, confused: false },
      diabetes: { NIDDM: false, IDDM: false, stable: false, gestational: false },
      musculoskeletal: { pain: false, ARTH: false, ROM_OK: false },
      ambulation: { AMB: false, none: false, cane: false, WC: false, walker: false, assist: false, PA: false },
      notes: '',
    },

    lower_extremities: {
      right: {
        BKA: false,
        AKA: false,
        color: '',
        temperature: '',
        sensation: '',
        skin: '',
        capillary_refill: '',
        edema: '',
        varicosities: '',
      },
      left: {
        BKA: false,
        AKA: false,
        color: '',
        temperature: '',
        sensation: '',
        skin: '',
        capillary_refill: '',
        edema: '',
        varicosities: '',
      },
    },

    footwear: '',
    notes: '',
    foot_image_url: '',
  })

  const handleImageUpload = async (file: File) => {
  const fileName = `foot-${crypto.randomUUID()}-${Date.now()}`

  const { error } = await supabase.storage
    .from('foot-assessments')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    return
  }

  // Store ONLY fileName
  setForm((prev) => ({
    ...prev,
    foot_image_url: fileName
  }))
}
  

 const handleSubmit = async () => {
  setLoading(true)

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const user = userData?.user
    if (!user) throw new Error('User not authenticated')

    // Generate new ID for new assessment
    const newAssessmentId = uuidv4()

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        id: newAssessmentId,
        patient_id: id,           // existing patient id
        assessment_data: form,    // full form JSON
        staff_id: user.id,
        staff_name: user.email,
        ...form,                  // keep other flattened fields if needed
      })

    if (error) throw error

    router.push(`/dashboard/patients/${id}`)
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Something went wrong')
    setLoading(false)
  }
}

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <Link
        href={`/dashboard/patients/${id}`}
        className="inline-flex m-2 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50  transition"
      >
        ← Back 
      </Link>

      <div className='bg-emerald-600 text-white px-4 py-2'>
          <h1 className="text-2xl font-bold">Client Assessment</h1>
    
      </div>
      {/* GENERAL HEALTH */}
      <Section title="General Health">
        <div className='md:grid-cols-2 gap-6 grid'>
         <TextArea
          label="Client's Assessment of General Health"
          value={form.general_health}
          onChange={(value) => setForm({ ...form, general_health: value })}
        />
        <TextArea
          label="Client's Foot Concerns"
          value={form.foot_concerns}
          onChange={(value) => setForm({ ...form, foot_concerns: value })}
        />
        <TextArea
          label="Medical History"
          value={form.medical_history}
          onChange={(value) => setForm({ ...form, medical_history: value })}
        />
        <TextArea
          label="Medications / Herbals / OTCs"
          value={form.medications}
          onChange={(value) => setForm({ ...form, medications: value })}
        />
        <TextArea
          label="Past Medical History"
          value={form.past_medical_history}
          onChange={(value) => setForm({ ...form, past_medical_history: value })}
        />
        </div>
       
      </Section>

      {/* FOCUSSED REVIEW */}
      <Section title="Focussed Systems Review">

        <SubHeading title="Neuro (A&OX)" />
        <div className='flex flex-wrap gap-6 justify-between'>
        <Checkbox
          label="Unresponsive"
          checked={form.focussed_review.neuro.unresponsive}
            onChange={(checked) =>
                setForm({
                    ...form,
                    focussed_review: {
                        ...form.focussed_review,
                        neuro: { ...form.focussed_review.neuro, unresponsive: checked }
                    }
                })
            }
        />
        <Checkbox
          label="Dementia"
          checked={form.focussed_review.neuro.dementia}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                neuro: { ...form.focussed_review.neuro, dementia: checked }
              }
            })
          }
        />
        <Checkbox
          label="Confused"
          checked={form.focussed_review.neuro.confused}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                neuro: { ...form.focussed_review.neuro, confused: checked }
              }
            })
          }
        />
        </div>
        <hr />
        <SubHeading title="Diabetes" />
            <div className='flex flex-wrap gap-6 justify-between'>
        <Checkbox
          label="NIDDM"
          checked={form.focussed_review.diabetes.NIDDM}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                diabetes: { ...form.focussed_review.diabetes, NIDDM: checked }
              }
            })
          }
        />
        <Checkbox
          label="IDDM"
          checked={form.focussed_review.diabetes.IDDM}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                diabetes: { ...form.focussed_review.diabetes, IDDM: checked }
              }
            })
          }
        />
        <Checkbox
          label="Stable"
          checked={form.focussed_review.diabetes.stable}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                diabetes: { ...form.focussed_review.diabetes, stable: checked }
              }
            })
          }
        />
        <Checkbox
          label="Gestational"
          checked={form.focussed_review.diabetes.gestational}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                diabetes: { ...form.focussed_review.diabetes, gestational: checked }
              }
            })
          }
        />
        </div>
        <hr />
        <SubHeading title="Musculoskeletal" />
            <div className='flex flex-wrap gap-6 justify-between'>
        <Checkbox
          label="Pain"  
          checked={form.focussed_review.musculoskeletal.pain}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                musculoskeletal: { ...form.focussed_review.musculoskeletal, pain: checked }
              }
            })
          }
        />
        <Checkbox
          label="ARTH"
          checked={form.focussed_review.musculoskeletal.ARTH}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                musculoskeletal: { ...form.focussed_review.musculoskeletal, ARTH: checked }
              }
            })
          }
        />
        <Checkbox
          label="ROM OK"
          checked={form.focussed_review.musculoskeletal.ROM_OK} 
            onChange={(checked) =>
              setForm({
                ...form,
                focussed_review: {
                  ...form.focussed_review,
                  musculoskeletal: { ...form.focussed_review.musculoskeletal, ROM_OK: checked }
                }
              })
            }
        />
        </div>
        <hr />
        <SubHeading title="Ambulation" />
        <div className='flex flex-wrap gap-6 justify-between'>
        <Checkbox
          label="AMB" 
            checked={form.focussed_review.ambulation.AMB}  
            onChange={(checked) =>
              setForm({
                ...form,
                focussed_review: {
                  ...form.focussed_review,
                  ambulation: { ...form.focussed_review.ambulation, AMB: checked }
                }
              })
            }   
        />
        <Checkbox
          label="None"
            checked={form.focussed_review.ambulation.none}
            onChange={(checked) =>
              setForm({
                ...form,
                focussed_review: {
                    ...form.focussed_review,
                    ambulation: { ...form.focussed_review.ambulation, none: checked }
                }
                })

            }
        />
        <Checkbox       label="Cane"
          checked={form.focussed_review.ambulation.cane}
          onChange={(checked) =>
            setForm({
              ...form,
              focussed_review: {
                ...form.focussed_review,
                ambulation: { ...form.focussed_review.ambulation, cane: checked }
              }
            })
          }
        />
        <Checkbox
          label="Wheelchair"
          checked={form.focussed_review.ambulation.WC}  
            onChange={(checked) =>
                setForm({
                    ...form,
                    focussed_review: {
                        ...form.focussed_review,
                        ambulation: { ...form.focussed_review.ambulation, WC: checked }
                    }
                })
            }
        />
        <Checkbox   
         label="Walker"
            checked={form.focussed_review.ambulation.walker}
            onChange={(checked) =>
                setForm({
                    ...form,
                    focussed_review: {
                        ...form.focussed_review,
                        ambulation: { ...form.focussed_review.ambulation, walker: checked }
                    }
                })
            }   
        />
        <Checkbox
          label="Assist"
            checked={form.focussed_review.ambulation.assist}
            onChange={(checked) =>
                setForm({
                    ...form,
                    focussed_review: {
                        ...form.focussed_review,
                        ambulation: { ...form.focussed_review.ambulation, assist: checked }
                    }
                })
            }
        />
        <Checkbox
          label="PA"
            checked={form.focussed_review.ambulation.PA}
            onChange={(checked) =>
                setForm({
                    ...form,
                    focussed_review: {
                        ...form.focussed_review,
                        ambulation: { ...form.focussed_review.ambulation, PA: checked }
                    }
                })
            }
        />
            </div>
            <hr />
        <TextArea
          label="Notes"
          value={form.focussed_review.notes}
          onChange={(value) =>
            setForm({
              ...form,
              focussed_review: { ...form.focussed_review, notes: value }
            })
          }
        />
      </Section>
      {/* RIGHT LEG */}
      <Section title="Lower Extremities – Right Leg">
        <div className='md:grid-cols-2 gap-6 grid'>
            <TextArea
          label="Color"
          value={form.lower_extremities.right.color}
          onChange={(value) =>
            setForm({
              ...form,
              lower_extremities: {
                ...form.lower_extremities,
                right: { ...form.lower_extremities.right, color: value }
              }
            })
          }
        />
        <TextArea
          label="Temperature"
          value={form.lower_extremities.right.temperature}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, temperature: value }
                    }
                })
            }
        />
        <TextArea
          label="Sensation"
          value={form.lower_extremities.right.sensation}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, sensation: value }
                    }
                })
            }
        />
        <TextArea
          label="Skin"
            value={form.lower_extremities.right.skin}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, skin: value }
                    }                })
            }
        />
        <TextArea
          label="Capillary Refill"
            value={form.lower_extremities.right.capillary_refill}
            onChange={(value) =>
                setForm({
                    ...form,            
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, capillary_refill: value }
                    }                })
            }
        />
        <TextArea
          label="Edema"
            value={form.lower_extremities.right.edema}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, edema: value }
                    }
                })
            }
        />
        <TextArea
          label="Varicosities"      
            value={form.lower_extremities.right.varicosities}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        right: { ...form.lower_extremities.right, varicosities: value }
                    }
                })
            }
        />

        </div>
      </Section>
   <hr />
      {/* LEFT LEG */}
      <Section title="Lower Extremities – Left Leg">
        <div className='md:grid-cols-2 gap-6 grid'>
            <TextArea
          label="Color"
          value={form.lower_extremities.left.color}
          onChange={(value) =>
            setForm({
              ...form,
              lower_extremities: {
                ...form.lower_extremities,
                left: { ...form.lower_extremities.left, color: value }
              }
            })
          }
        />
        <TextArea
          label="Temperature"
          value={form.lower_extremities.left.temperature}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, temperature: value }
                    }
                })
            }
        />
        <TextArea
          label="Sensation"
          value={form.lower_extremities.left.sensation}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, sensation: value }
                    }
                })
            }
        />
        <TextArea
          label="Skin"
            value={form.lower_extremities.left.skin}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, skin: value }
                    }                })
            }
        />
        <TextArea
          label="Capillary Refill"
            value={form.lower_extremities.left.capillary_refill}
            onChange={(value) =>
                setForm({
                    ...form,            
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, capillary_refill: value }
                    }                })
            }
        />
        <TextArea
          label="Edema"
            value={form.lower_extremities.left.edema}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, edema: value }
                    }
                })
            }
        />
        <TextArea
          label="Varicosities"      
            value={form.lower_extremities.left.varicosities}
            onChange={(value) =>
                setForm({
                    ...form,
                    lower_extremities: {
                        ...form.lower_extremities,
                        left: { ...form.lower_extremities.left, varicosities: value }
                    }
                })
            }
        />

        </div>
        
      </Section>
<hr />
      {/* FOOTWEAR */}
      <Section title="Footwear / Appliances">
       <div className='md:grid grid-cols-2 gap-6 grid'>
             <TextArea
          label="Footwear"
          value={form.footwear}
          onChange={(value) => setForm({ ...form, footwear: value })}
        />
         <TextArea
            label="Additional Notes"
            value={form.notes}
            onChange={(value) => setForm({ ...form, notes: value })}
          />
       </div>
      </Section>

      {/* IMAGE UPLOAD */}
      <Section title="Detailed Foot Assessment Image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageUpload(e.target.files[0])
            }
          }}
        />
        {form.foot_image_url && (
          <img src={form.foot_image_url} className="mt-4 w-48 border rounded" />
        )}
      </Section>

      <div className="pt-8 border-t">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded"
        >
          {loading ? 'Saving...' : 'Submit Assessment'}
        </button>
      </div>

    </div>
  )
}

type SectionProps = {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <div className="bg-white shadow rounded p-6 space-y-6">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    {children}
  </div>
)

const SubHeading = ({ title }: { title: string }) => (
  <h3 className="text-md font-semibold mt-4">{title}</h3>
)

const TextArea = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border p-2 rounded min-h-[100px]"
    />
  </div>
)

const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) => (
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
)
