import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("notes-app");

  const notes = await db.collection("notes").find().toArray();
  return NextResponse.json(notes);
}

export async function POST(req) {
  const body = await req.json();
  const { title, content, userId } = body;

  if (!title || !content || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("notes-app");

  const result = await db.collection("notes").insertOne({
    title,
    content,
    userId,
    createdAt: new Date(),
  });

  const newNote = await db.collection("notes").findOne({ _id: result.insertedId });
  return NextResponse.json(newNote);
}
