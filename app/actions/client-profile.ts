import { SupabaseClient } from '@supabase/supabase-js'

export async function initializeClientProfile(
  supabase: SupabaseClient,
  contactId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .rpc('initialize_client_profile', {
        p_contact_id: contactId,
        p_user_id: userId
      })

    if (error) {
      console.error('Error in initializeClientProfile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to initialize client profile:', error)
    throw error
  }
}