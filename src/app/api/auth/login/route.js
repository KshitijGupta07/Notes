import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db("notes-app");

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // ✅ Create a successful response and set cookies
  const res = NextResponse.json({ message: "Login successful" });

  res.cookies.set("user", encodeURIComponent(email), {
    path: "/",
    httpOnly: false, // must be false to read it on client side
  });

  res.cookies.set("userId", user._id.toString(), {
    path: "/",
    httpOnly: false,
  });

  return res;
}
