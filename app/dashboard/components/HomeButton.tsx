'use client'

import Link from 'next/link'

export default function HomeButton() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm 
      hover:bg-amber-600 hover:text-white transition"
    >
      Home
    </Link>
  )
}