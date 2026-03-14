'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import ArchivePatientButton from '../components/deletePatient'

const PAGE_SIZE = 20

export default function PatientsListPage() {

  const router = useRouter()

  const [patients, setPatients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [role,setRole] = useState<string | null>(null)

  const [page,setPage] = useState(1)
  const [total,setTotal] = useState(0)

  useEffect(()=>{
    fetchUserRole()
  },[])

  useEffect(()=>{
    fetchPatients()
  },[page,search])

  async function fetchUserRole(){
    const {data:{user}} = await supabase.auth.getUser()

    if(!user) return

    const {data: profile} = await supabase
      .from("profiles")
      .select("role")
      .eq("id",user.id)
      .single()

    setRole(profile?.role ?? null)
  }

  async function fetchPatients(){

    setLoading(true)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from,to)

    if(search){
      query = query.or(`first_name.ilike.%${search}%,surname.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if(error){
      console.error(error)
      return
    }

    setPatients(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (

    <div className="p-6">

      <Link
        href="/dashboard"
        className="inline-flex m-3 p-2 items-center gap-2 px-3 py-1.5 border rounded-lg text-sm hover:text-amber-50 hover:bg-amber-600 hover:border-amber-50 transition">
        ← Back
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>

        <button
          onClick={() => router.push('/dashboard/patients/new')}
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          + New Patient
        </button>
      </div>

      <input
        placeholder="Search patient..."
        className="border p-2 w-full mb-6 rounded"
        value={search}
        onChange={(e) => {
          setPage(1)
          setSearch(e.target.value)
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">

          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">DOB</th>
                <th className="p-3">Phone</th>
                <th className="p-3">City</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (

                <tr
                  key={patient.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/patients/${patient.id}`)
                  }
                >

                  <td className="p-3">
                    {patient.first_name} {patient.surname}
                  </td>

                  <td className="p-3">
                    {new Date(patient.date_of_birth).toLocaleDateString()}
                  </td>

                  <td className="p-3">{patient.primary_phone}</td>

                  <td className="p-3">{patient.city}</td>

                  <td className="p-3">

                    {role === "admin" && (
                      <div onClick={(e)=>e.stopPropagation()}>
                        <ArchivePatientButton patientId={patient.id}/>
                      </div>
                    )}

                  </td>

                </tr>

              ))}
            </tbody>
          </table>

          {patients.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No patients found
            </p>
          )}

          {/* Pagination */}

          <div className="flex justify-between items-center p-4">

            <button
              disabled={page === 1}
              onClick={()=>setPage(page-1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={()=>setPage(page+1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>
      )}
    </div>
  )
}