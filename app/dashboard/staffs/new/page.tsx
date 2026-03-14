'use client'
import { useState } from 'react'

export default function CreateStaffPage() {
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      // ← THIS IS WHERE YOU ADD THE FETCH CALL
      const res = await fetch('/api/sendStaffMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, dob }),
      })

      const data = await res.json() // now JSON is returned

      if (!res.ok) throw new Error(data.error || 'Failed to send email')

      setSuccess('New Staff Request sent successfully!')
      setFullName('')
      setDob('')
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-4">
      <h1 className="text-xl font-semibold">Create New Staff</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          {loading ? 'Sending...' : 'Create Staff'}
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  )
}