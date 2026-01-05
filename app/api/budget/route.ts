import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("budget_settings")
    .select("*")
    .eq("id", "default")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { total_budget, categories, fund_sources } = body

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (total_budget !== undefined) updates.total_budget = total_budget
  if (categories !== undefined) updates.categories = categories
  if (fund_sources !== undefined) updates.fund_sources = fund_sources

  const { data, error } = await supabase
    .from("budget_settings")
    .update(updates)
    .eq("id", "default")
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
