'use client'

import { useState } from 'react'
import { signInStaff } from '../../src/lib/supabase/auth' // adjust path if needed
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signInStaff(email, password)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Login successful, redirect based on role
    if (data.role === 'admin') router.push('/dashboard')
    else if (data.role === 'staff') router.push('/dashboard')
    else setError('Unknown role')
  }

  return (
    
    <div className="min-h-screen md:flex flex-row items-center justify-evenly bg-gray-100">
          <div id='company name'>
            <h1 className="text-3xl font-bold text-amber-600 text-center"><span className='text-emerald-600'>Care</span> on Step</h1>
        </div>
        {/* form */}
        <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-80"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Staff Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-900"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-900"
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </form>
    </div>
    </div>
  )
}
