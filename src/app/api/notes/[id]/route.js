import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
   const awaitedParams = await params;
  const id = awaitedParams.id;

  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("notes-app");

  await db.collection("notes").updateOne(
    { _id: new ObjectId(id) },
    { $set: { title: body.title, content: body.content } }
  );

  return NextResponse.json({ message: "Note updated" });
}

export async function DELETE(req, context) {
  const params = await context.params;
  const id = params.id;

  const client = await clientPromise;
  const db = client.db("notes-app");

  await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Note deleted" });
}
