import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { plate, color, model } = await request.json();
  let query = supabase.from("cars").select(`*, owner:owners(*)`);

  if (plate) query = query.ilike("plate", `%${plate}%`);
  if (color) query = query.ilike("color", `%${color}%`);
  if (model) query = query.ilike("model", `%${model}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}
