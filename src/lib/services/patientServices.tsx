import { supabase } from "@/lib/supabase/client"

export async function archivePatient(patientId: string) {

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase
    .from("patients")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id
    })
    .eq("id", patientId)

  if (error) {
    throw error
  }

  await supabase.from("audit_logs").insert({
    action: "PATIENT_ARCHIVED",
    patient_id: patientId,
    performed_by: user.id
  })
}