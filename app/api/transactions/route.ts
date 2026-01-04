import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  // Get transactions from the past month
  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", monthAgo.toISOString())
    .order("date", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ transactions: data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { fund, amount, category } = body

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      fund,
      amount,
      category,
      date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
