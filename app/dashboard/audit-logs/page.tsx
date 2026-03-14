'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import RestorePatientButton from "../components/RestorePatientButton" // make sure path is correct

type AuditLog = {
  id: string
  action: string
  table_name: string
  row_id: string
  changed_by: string
  old_data: any
  new_data: any
  created_at: string
}

type Staff = {
  id: string
  full_name: string
}

type Patient = {
  id: string
  first_name: string
  surname: string
  deleted_at: string | null
}

const PAGE_SIZE = 20

const actionColors: Record<string, string> = {
  INSERT: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  ARCHIVE: "bg-yellow-100 text-yellow-700"
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [staff, setStaff] = useState<Record<string, Staff>>({})
  const [patients, setPatients] = useState<Record<string, Patient>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  

  useEffect(() => {
    fetchLogs()
  }, [page])

  async function fetchLogs() {
    setLoading(true)

    // 1. Fetch logs with pagination
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)

    if (error) {
      console.error("Audit fetch error:", error)
      setLoading(false)
      return
    }

    const logsData = data as AuditLog[]
    setLogs(logsData)

    // 2. Collect unique staff and patient IDs
    const staffIds = [...new Set(logsData.map(l => l.changed_by))]
    const patientIds = [...new Set(logsData.map(l => l.row_id))]

    // 3. Fetch staff data
    const { data: staffData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", staffIds)

    // 4. Fetch active patients
    const { data: activePatients } = await supabase
      .from("patients")
      .select("id, first_name, surname, deleted_at")
      .in("id", patientIds)

    // 5. Fetch soft-deleted patients as well
    const { data: deletedPatients } = await supabase
      .from("patients")
      .select("id, first_name, surname, deleted_at")
      .in("id", patientIds)
      .neq("deleted_at", null)

    const staffMap: Record<string, Staff> = {}
    const patientMap: Record<string, Patient> = {}

    staffData?.forEach(s => staffMap[s.id] = s)
    activePatients?.forEach(p => patientMap[p.id] = p)
    deletedPatients?.forEach(p => patientMap[p.id] = p)

    setStaff(staffMap)
    setPatients(patientMap)

    setLoading(false)
  }

  // Calculate changes between old_data and new_data
  function diff(oldData: any, newData: any) {
    if (!oldData || !newData) return []

    const changes: any[] = []
    Object.keys(newData).forEach(key => {
      const before = oldData[key]
      const after = newData[key]
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        changes.push({ field: key, before, after })
      }
    })
    return changes
  }

  function avatar(name?: string) {
    const letter = name?.charAt(0).toUpperCase() || "?"
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
        {letter}
      </div>
    )
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }

  // Filter logs by patient name
  const filteredLogs = logs.filter(log => {
    const patient = patients[log.row_id]
    const fullName = patient ? `${patient.first_name} ${patient.surname}`.toLowerCase() : ""
    return fullName.includes(search.toLowerCase())
  })

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">System Audit Logs</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by patient name..."
        className="border rounded p-2 w-full mb-4"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(0) }}
      />

      <div className="bg-white border rounded-lg overflow-hidden">
        {loading && <div className="p-6 text-center">Loading logs...</div>}
        {!loading && filteredLogs.length === 0 && (
          <div className="p-6 text-center text-gray-500">No logs found</div>
        )}

        {!loading && filteredLogs.map(log => {
          const staffName = staff[log.changed_by]?.full_name || "Unknown Staff"
          const patient = patients[log.row_id]
          const patientName = patient ? `${patient.first_name} ${patient.surname}` : "Unknown Patient"
          const changes = diff(log.old_data, log.new_data)

          return (
            <div key={log.id} className="border-b">
              <div
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {avatar(staffName)}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {/* Restore button for soft-deleted patients */}
                      {patient?.deleted_at && (
                        <div onClick={e => e.stopPropagation()}>
                          <RestorePatientButton
                              patientId={patient.id}
                              onRestored={async () => {
                            // Refresh logs and patient map after restore
                           await fetchLogs()
                         }}
                        />
                        </div>
                      )}

                      <span className={`px-2 py-1 text-xs rounded ${actionColors[log.action] || "bg-gray-100"}`}>
                        {log.action}
                      </span>
                      <span className="font-medium">{staffName}</span>
                      <span className="text-gray-500">on</span>
                      <span className="font-medium">{patientName}</span>
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(log.created_at)}</div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  {expanded === log.id ? "Hide Changes" : "View Changes"}
                </div>
              </div>

              {expanded === log.id && (
                <div className="bg-gray-50 p-4 space-y-3">
                  {changes.length === 0 && <div className="text-gray-500">No field changes</div>}
                  {changes.map((c, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 border rounded p-3 text-sm bg-white">
                      <div className="font-medium">{c.field}</div>
                      <div className="text-red-600">- {JSON.stringify(c.before)}</div>
                      <div className="text-green-600">+ {JSON.stringify(c.after)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="border px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}