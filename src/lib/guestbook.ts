import { supabase } from "./supabase"

export type Post = {
  id: number
  timestamp: number
  name: string
  content: string
}

export async function getGuestbookPosts(offset: number, limit: number) {
  if (!supabase) {
    return { posts: [], total: 0 }
  }

  const { data, error, count } = await supabase
    .from("guestbook")
    .select("id, name, content, created_at", { count: "exact" })
    .eq("valid", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw error
  }

  return {
    posts: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      content: row.content,
      timestamp: Math.floor(new Date(row.created_at).getTime() / 1000),
    })),
    total: count ?? 0,
  }
}

export async function createGuestbookPost(
  name: string,
  content: string,
  password: string,
) {
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  const { error } = await supabase.rpc("create_guestbook_post", {
    p_name: name,
    p_content: content,
    p_password: password,
  })

  if (error) {
    throw error
  }
}

export async function deleteGuestbookPost(id: number, password: string) {
  if (!supabase) {
    throw new Error("SUPABASE_NOT_CONFIGURED")
  }

  const { error } = await supabase.rpc("delete_guestbook_post", {
    post_id: id,
    password,
  })

  if (error) {
    if (error.message.includes("INCORRECT_PASSWORD")) {
      throw new Error("FORBIDDEN")
    }
    throw error
  }
}
