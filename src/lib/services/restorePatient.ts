import { supabase } from "@/lib/supabase/client"

export async function restorePatient(patientId: string) {

  const { error } = await supabase
    .from("patients")
    .update({
      archived: false
    })
    .eq("id", patientId)

  if (error) {
    throw error
  }

}