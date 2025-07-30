'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function NotesPage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editNote, setEditNote] = useState(null);
  const router = useRouter();

  // Palette
  const COLORS = {
    accent: "#59C3C3",
    accentHover: "#4aa9a9",
    highlight: "#FF5A36",
    highlightHover: "#e04a27",
    success: "#059669",
    successHover: "#047a52",
    text: "#232323",
  };

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const u = getCookie("user");
    const id = getCookie("userId");

    if (!u || !id) {
      router.push("/auth/login");
    } else {
      setUser(decodeURIComponent(u));
      setUserId(id);
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetch("/api/notes")
        .then((res) => res.json())
        .then(setNotes)
        .catch(() => {});
    }
  }, [userId]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newNote, userId }),
    });
    const added = await res.json();
    setNotes([added, ...notes]);
    setNewNote({ title: "", content: "" });
  };

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(notes.filter((n) => n._id !== id));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/notes/${editNote._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editNote),
    });
    const updatedNotes = await fetch("/api/notes").then((res) => res.json());
    setNotes(updatedNotes);
    setEditNote(null);
  };

  const logout = () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/auth/login");
  };

  if (!user || !userId) return null;

  // Styles (glass container + glass inputs/cards)
  const mainStyle = {
    padding: "2rem",
    maxWidth: "780px",
    margin: "4rem auto",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    color: "#374151", // slightly lighter than pure black
    minHeight: "60vh",
    borderRadius: "20px",

    // Glassmorphism container
    background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.5) 100%)",
    border: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 12px 48px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.35)",
    backdropFilter: "blur(14px) saturate(120%)",
    WebkitBackdropFilter: "blur(14px) saturate(120%)",
  };

  const cardStyle = {
    borderRadius: "16px",
    background: "rgba(255,255,255,0.65)",
    padding: "1.2rem 1.25rem",
    marginBottom: "1.1rem",
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 6px 22px rgba(0, 0, 0, 0.07), inset 0 1px 1px rgba(255,255,255,0.55)",
    transition: "box-shadow 0.25s, transform 0.25s, background-color 0.25s",
  };

  const inputBase = {
    display: "block",
    width: "100%",
    marginBottom: "0.9rem",
    // extra right padding so text/emoji/icons have room
    padding: "0.7rem  0.50rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.9)",
    background: "rgba(255,255,255,0.75)",
    color: "#111827",
    fontSize: "1rem",
    outline: "none",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 10px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.25s, border-color 0.25s, background-color 0.25s",
  };

  const headingStyle = { color: COLORS.accent, fontWeight: 800 };

  const getButtonStyle = (type) => {
    let bg, hover;
    if (type === "add" || type === "edit") {
      bg = COLORS.accent; hover = COLORS.accentHover;
    } else if (type === "update") {
      bg = COLORS.success; hover = COLORS.successHover;
    } else {
      bg = COLORS.highlight; hover = COLORS.highlightHover;
    }
    return {
      backgroundColor: bg,
      color: "white",
      border: "none",
      padding: "0.55rem 1.1rem",
      borderRadius: "12px",
      margin: "0 0.45rem 0.45rem 0",
      fontSize: "0.98rem",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: `0 8px 16px ${bg}40`,
      transition: "background-color 0.22s, transform 0.18s, box-shadow 0.22s",
    };
  };

  return (
    <>
      <style>{`
        .card-anim { transition: box-shadow 0.25s, transform 0.25s; border-radius: 16px; }
        .card-anim:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.12); }
        .btn-anim { transition: background-color 0.22s, transform 0.18s; border-radius: 12px; }
        .btn-anim:hover { transform: translateY(-1px); }
        .btn-accent:hover { background-color: ${COLORS.accentHover} !important; }
        .btn-highlight:hover { background-color: ${COLORS.highlightHover} !important; }
        .btn-success:hover { background-color: ${COLORS.successHover} !important; }
        input[type="text"]:focus, textarea:focus {
          border-color: ${COLORS.accent};
          box-shadow: 0 0 0 3px rgba(89, 195, 195, 0.18), inset 0 1px 1px rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.85);
        }
      `}</style>

      <main style={mainStyle}>
        <h1
  className={pacifico.className}
  style={{
    ...headingStyle,
    fontSize: "2.1rem",
    letterSpacing: "0.04em",
    marginBottom: "0.4rem",
    // Blue → Indigo → Violet → Fuchsia
    background: "linear-gradient(90deg, #3B82F6 0%, #6366F1 33%, #8B5CF6 66%, #D946EF 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent", // fallback
  }}
>
  Welcome, {decodeURIComponent(user)}
</h1>


        <p style={{ marginTop: 0, marginBottom: "1.2rem", color: "#6B7280", fontFamily: "sans-serif" }}>
          Capture your thoughts and edit them anytime.
        </p>

        {/* Add Note */}
        <form onSubmit={addNote} style={{ marginTop: "1.2rem" }}>
          <h2 style={{ ...headingStyle, fontSize: "1.25rem", color: "#1f2937", fontFamily: "sans-serif" }}>
            Add Note
          </h2>

          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Title"
            required
            style={inputBase}
          />

          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            placeholder="Content"
            required
            rows={3}
            style={{ ...inputBase, resize: "vertical", minHeight: 72 }}
          />

          <button
            type="submit"
            className="btn-anim btn-accent"
            style={getButtonStyle("add")}
          >
            Add Note
          </button>
        </form>

        {/* Edit Note */}
        {editNote && (
          <form onSubmit={saveEdit} style={{ marginTop: "2rem" }}>
            <h2 style={{ ...headingStyle, fontSize: "1.15rem", color: "#1f2937", fontFamily: "sans-serif" }}>
              Edit Note
            </h2>

            <input
              type="text"
              value={editNote.title}
              onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
              style={inputBase}
            />

            <textarea
              value={editNote.content}
              onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
              rows={3}
              style={{ ...inputBase, resize: "vertical", minHeight: 72 }}
            />

            <button
              type="submit"
              className="btn-anim btn-success"
              style={getButtonStyle("update")}
            >
              Update Note
            </button>
            <button
              type="button"
              onClick={() => setEditNote(null)}
              className="btn-anim btn-highlight"
              style={getButtonStyle("cancel")}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Notes List */}
        <h2 style={{ ...headingStyle, marginTop: "2.2rem", fontSize: "1.18rem", color: "#1f2937", fontFamily: "sans-serif" }}>
          Your Notes
        </h2>

        {notes.length === 0 ? (
          <p style={{ color: "#6B7280", fontFamily: "sans-serif" }}>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="card-anim" style={cardStyle}>
              <h3 style={{ color: "#111827", fontSize: "1.06rem", marginTop: 0, marginBottom: "0.35rem", fontFamily: "sans-serif" }}>
                {note.title}
              </h3>
              <p style={{ color: "#4B5563", minHeight: 24, marginTop: 0, marginBottom: "0.6rem", fontFamily: "sans-serif" }}>
                {note.content}
              </p>
              <button
                onClick={() => setEditNote(note)}
                className="btn-anim btn-accent"
                style={getButtonStyle("edit")}
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note._id)}
                className="btn-anim btn-highlight"
                style={getButtonStyle("delete")}
              >
                Delete
              </button>
            </div>
          ))
        )}

        {/* Logout Button */}
        <div style={{ marginTop: "2.2rem", textAlign: "center" }}>
          <button
            onClick={logout}
            className="btn-anim btn-highlight"
            style={{
              ...getButtonStyle("logout"),
              borderRadius: "14px",
              fontSize: "1.05rem",
              padding: "0.7rem 2rem",
            }}
          >
            Logout
          </button>
        </div>
      </main>
    </>
  );
}
