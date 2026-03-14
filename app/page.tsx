'use client'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import LoginPage from './login/page'

export default function Home() {
  const test = async () => {
    const { data, error } = await supabase.from('patients').select('*')
    console.log(data, error)
  }

  test()

  return(
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-10'>
       <div>
        <h1 className='text-6xl text-black'>Welcome to <span className='text-emerald-700 font-bold'>Care</span><span className='font-bold ms-2 text-amber-600'>On Step</span></h1>
      </div>
      <Link href="/login">
        <button className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors w-md">Get Started</button>
      </Link>
    </main>
      
   
  )
}
