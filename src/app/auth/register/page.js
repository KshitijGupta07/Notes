'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Accent palette (kept consistent with your Login page)
  const COLORS = {
    accent: "#59C3C3",
    accentHover: "#4aa9a9",
    text: "#232323",
    error: "#ef4444",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <style>{`
        /* Center the card like the login page */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        /* Glassmorphism container (less translucent) */
        .container {
          position: relative;
          max-width: 420px;
          width: 100%;
          padding: 2rem;
          border-radius: 16px;

          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.65) 0%,
            rgba(255, 255, 255, 0.5) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);

          backdrop-filter: blur(14px) saturate(120%);
          -webkit-backdrop-filter: blur(14px) saturate(120%);

          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          color: ${COLORS.text};
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        /* Soft sheen */
        .container::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          background: radial-gradient(
            120% 120% at 10% 0%,
            rgba(255,255,255,0.5) 0%,
            rgba(255,255,255,0) 45%
          );
          opacity: 0.4;
        }

        .container:hover {
          transform: translateY(-2px);
          box-shadow:
            0 14px 48px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        /* Backdrop-filter fallback */
        @supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
          .container {
            background: rgba(255, 255, 255, 0.9);
          }
        }

        h2 {
          margin-bottom: 1.25rem;
          font-weight: 800;
          font-size: 1.8rem;
          letter-spacing: 0.2px;
          color: #1f2937;
        }

        label {
          display: block;
          margin-bottom: 0.35rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: #374151;
        }

        input {
          display: block;
          width: 100%;
          margin-bottom: 1rem;

          /* Extra right padding to match login page */
          padding: 0.7rem  0.50rem;

          border-radius: 12px;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.9);
          outline: none;
          font-size: 1rem;
          color: #111827;
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.6),
            0 1px 12px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.25s, border-color 0.25s, background-color 0.25s;
        }

        input::placeholder {
          color: rgba(17, 24, 39, 0.55);
        }

        input:focus {
          border-color: ${COLORS.accent};
          box-shadow:
            0 0 0 3px rgba(89, 195, 195, 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.85);
        }

        button {
          background-color: ${COLORS.accent};
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.22s, transform 0.18s, box-shadow 0.22s;
          display: inline-block;
          margin-top: 0.5rem;
          user-select: none;
          box-shadow: 0 8px 16px rgba(89, 195, 195, 0.25);
        }

        button:hover {
          background-color: ${COLORS.accentHover};
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(89, 195, 195, 0.28);
        }

        .error {
          color: ${COLORS.error};
          margin-top: 1rem;
          font-weight: 700;
        }

        p.login-text {
          margin-top: 1.25rem;
          font-size: 0.95rem;
          color: #374151;
        }

        p.login-text a {
          color: ${COLORS.accent};
          text-decoration: none;
          font-weight: 700;
          transition: color 0.25s, text-decoration-color 0.25s;
        }

        p.login-text a:hover {
          color: ${COLORS.accentHover};
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-page">
        <div className="container" role="main" aria-label="Register form container">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              aria-required="true"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              aria-required="true"
            />

            <button type="submit" aria-label="Submit registration form">
              Register
            </button>
          </form>

          {error && (
            <p className="error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <p className="login-text">
            Already have an account?{" "}
            <Link href="/auth/login" aria-label="Login page link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
