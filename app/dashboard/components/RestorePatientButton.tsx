// RestorePatientButton.tsx
'use client'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'

export default function RestorePatientButton({ patientId, onRestored }: { patientId: string, onRestored?: () => void }) {
  const [loading, setLoading] = useState(false)

  const restorePatient = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('patients')
      .update({ deleted_at: null })
      .eq('id', patientId)
      .select()
      .single() // returns the updated row

    setLoading(false)

    if (error) {
      console.error('Failed to restore patient:', error)
      alert('Failed to restore patient')
      return
    }

    // callback to refresh parent component
    onRestored?.()
  }

  return (
    <button
      onClick={restorePatient}
      disabled={loading}
      className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
    >
      {loading ? 'Restoring...' : 'Restore'}
    </button>
  )
}