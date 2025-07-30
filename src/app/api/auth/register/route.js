import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("notes-app");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hashing password

    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
