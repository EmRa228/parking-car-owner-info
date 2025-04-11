import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { mobile, plate } = await request.json();
  if (!mobile || !plate)
    return NextResponse.json({ error: "Mobile and Plate are required." }, { status: 400 });

  // Insert car record
  const { data: carData, error: carError } = await supabase
    .from("cars")
    .insert([{ plate }])
    .single();
  if (carError)
    return NextResponse.json({ error: carError.message }, { status: 500 });

  // Insert owner record (using mobile for phone; name and unit as placeholders)
  const { error: ownerError } = await supabase
    .from("owners")
    .insert([{ name: "Unknown", unit: "Unknown", phone: mobile, car_id: carData.id }]);
  if (ownerError)
    return NextResponse.json({ error: ownerError.message }, { status: 500 });

  return NextResponse.json({ message: "Inserted successfully." });
}
