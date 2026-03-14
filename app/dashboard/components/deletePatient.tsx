'use client'

import { useState } from "react"
import { archivePatient } from "@/lib/services/patientServices"

interface Props {
  patientId: string
}

export default function ArchivePatientButton({ patientId }: Props) {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleArchive = async () => {
    try {
      setLoading(true)

      await archivePatient(patientId)

      setOpen(false)

      // refresh UI
      location.reload()

    } catch (err) {
      console.error(err)
      alert("Failed to archive patient")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation() // prevents row click navigation
          setOpen(true)
        }}
        className="text-red-600 border px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
      >
        Archive
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-lg shadow-xl w-[380px] p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Archive Patient
            </h2>

            <p className="text-sm text-gray-600">
              Are you sure you want to archive this patient?
              This will hide the record but keep it stored for audit purposes.
            </p>

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleArchive}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Archiving..." : "Confirm Archive"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}