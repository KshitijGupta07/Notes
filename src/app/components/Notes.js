"use client";

import { useEffect, useState } from "react";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  }

  async function handleDelete(id) {
    await fetch("/api/notes", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  }

  return (
    <div>
      <NoteForm onNoteAdded={fetchNotes} />
      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  );
}
