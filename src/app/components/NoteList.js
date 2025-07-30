"use client";

export default function NoteList({ notes, onDelete }) {
  return (
    <div>
      <h3>Your Notes</h3>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <strong>{note.title}</strong>: {note.content}
              <button onClick={() => onDelete(note._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
