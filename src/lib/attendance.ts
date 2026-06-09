import { supabase } from "./supabase"

export async function createAttendance(
  side: string,
  name: string,
  meal: string,
  count: number,
) {
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  const { error } = await supabase.from("attendance").insert({
    side,
    name,
    meal,
    count,
  })

  if (error) {
    throw error
  }
}
