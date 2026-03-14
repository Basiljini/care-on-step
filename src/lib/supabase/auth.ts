import { supabase } from './client'

export const signInStaff = async (email: string, password: string) => {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password })

  if (authError) {
    return { data: null, error: authError }
  }

  if (!authData.user) {
    return { data: null, error: new Error('No user returned from auth') }
  }

  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('role')
    .eq('email', authData.user.email)
    .single()

  if (staffError || !staffData) {
    return { data: null, error: staffError ?? new Error('Staff role not found') }
  }

  return {
    data: {
      id: authData.user.id,
      email: authData.user.email,
      role: staffData.role,
    },
    error: null,
  }
}

export const signOutStaff = async () => {
  return await supabase.auth.signOut()
}

export const getStaffUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) return null

  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('role')
    .eq('email', data.user.email)
    .single()

  if (staffError || !staffData) return null

  return {
    id: data.user.id,
    email: data.user.email,
    role: staffData.role,
  }
}
