"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";

const GENRES = [
  "Fiction",
  "Sci-Fi",
  "Non-Fiction",
  "Philosophy",
  "Self-Help",
  "Mystery",
  "Fantasy",
  "Romance",
  "Classics",
  "Science",
];

const GOALS: { value: number; label: string; sublabel: string }[] = [
  { value: 12, label: "12", sublabel: "Casual Reader" },
  { value: 24, label: "24", sublabel: "Regular Reader" },
  { value: 52, label: "52", sublabel: "Avid Reader" },
  { value: 100, label: "100", sublabel: "Obsessed" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [readingGoal, setReadingGoal] = useState(0);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <>
      <AppHeader />
      <div
        style={{
          minHeight: "calc(100vh - 54px)",
          backgroundColor: "var(--bg)",
          padding: "40px 24px 80px",
          fontFamily: "var(--font-body), 'DM Sans', sans-serif",
        }}
      >
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "40px" }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: s <= step ? "var(--gold2)" : "transparent",
                border: s <= step ? "none" : "1.5px solid var(--bg3)",
                transition: "all 0.18s ease",
              }}
            />
          ))}
        </div>

        {/* ── Step 1 — Welcome ── */}
        {step === 1 && (
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 8px",
                  }}
                >
                  Welcome to Bookshelf
                </h2>
                <p style={{ fontSize: "14px", color: "var(--ink3)", margin: 0, lineHeight: 1.6 }}>
                  Tell us a bit about yourself to personalize your experience.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink2)" }}>Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    style={{
                      width: "100%",
                      border: "1px solid var(--bg3)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "var(--ink)",
                      outline: "none",
                      fontFamily: "var(--font-body)",
                      boxSizing: "border-box",
                      transition: "border-color 0.18s ease",
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold2)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bg3)"; }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink2)" }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      border: "1px solid var(--bg3)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "var(--ink)",
                      outline: "none",
                      fontFamily: "var(--font-body)",
                      boxSizing: "border-box",
                      transition: "border-color 0.18s ease",
                    }}
                    onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold2)"; }}
                    onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bg3)"; }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => { if (name.trim()) setStep(2); }}
                disabled={!name.trim()}
                style={{
                  width: "100%",
                  backgroundColor: name.trim() ? "var(--gold2)" : "var(--bg3)",
                  color: name.trim() ? "white" : "var(--ink3)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "13px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: name.trim() ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.18s ease",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 — Genres ── */}
        {step === 2 && (
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 8px",
                  }}
                >
                  What do you love to read?
                </h2>
                <p style={{ fontSize: "14px", color: "var(--ink3)", margin: 0 }}>
                  Choose as many as you like.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {GENRES.map((genre) => {
                  const active = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      style={{
                        backgroundColor: active ? "var(--gold3)" : "white",
                        border: active ? "1px solid var(--gold2)" : "1px solid var(--bg3)",
                        color: active ? "var(--gold)" : "var(--ink2)",
                        borderRadius: "999px",
                        padding: "8px 18px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "all 0.18s ease",
                      }}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => { if (selectedGenres.length > 0) setStep(3); }}
                disabled={selectedGenres.length === 0}
                style={{
                  width: "100%",
                  backgroundColor: selectedGenres.length > 0 ? "var(--gold2)" : "var(--bg3)",
                  color: selectedGenres.length > 0 ? "white" : "var(--ink3)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "13px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: selectedGenres.length > 0 ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.18s ease",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 — Reading Goal ── */}
        {step === 3 && (
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 8px",
                  }}
                >
                  Set your reading goal
                </h2>
                <p style={{ fontSize: "14px", color: "var(--ink3)", margin: 0 }}>
                  How many books do you want to read this year?
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {GOALS.map((goal) => {
                  const selected = readingGoal === goal.value;
                  return (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setReadingGoal(goal.value)}
                      style={{
                        backgroundColor: selected ? "var(--gold3)" : "white",
                        border: selected ? "1.5px solid var(--gold2)" : "1px solid var(--bg3)",
                        borderRadius: "14px",
                        padding: "24px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-display), 'Playfair Display', serif",
                          fontSize: "32px",
                          fontWeight: 700,
                          color: "var(--gold2)",
                          margin: "0 0 6px",
                        }}
                      >
                        {goal.label}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--ink3)", margin: 0 }}>{goal.sublabel}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => { if (readingGoal > 0) setStep(4); }}
                disabled={readingGoal === 0}
                style={{
                  width: "100%",
                  backgroundColor: readingGoal > 0 ? "var(--gold2)" : "var(--bg3)",
                  color: readingGoal > 0 ? "white" : "var(--ink3)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "13px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: readingGoal > 0 ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.18s ease",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4 — Success ── */}
        {step === 4 && (
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid var(--bg3)",
                borderRadius: "14px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Checkmark */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "var(--gold3)",
                  border: "2px solid var(--gold2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                ✓
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', serif",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 8px",
                  }}
                >
                  You&apos;re all set, {name || "Reader"}!
                </h2>
                <p style={{ fontSize: "14px", color: "var(--ink3)", margin: 0 }}>
                  Your reading journey starts now. Here&apos;s your profile:
                </p>
              </div>

              {/* Summary */}
              <div
                style={{
                  backgroundColor: "var(--bg2)",
                  borderRadius: "10px",
                  padding: "20px",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "var(--ink3)", display: "flex", alignItems: "center", gap: "6px" }}>
                    📖 Reading goal
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
                    {readingGoal} books in 2026
                  </span>
                </div>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--bg3)",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "var(--ink3)", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    ✦ Genres
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", textAlign: "right" }}>
                    {selectedGenres.join(", ")}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <Link
                  href="/shelf"
                  style={{
                    display: "block",
                    textAlign: "center",
                    backgroundColor: "var(--gold2)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "13px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.18s ease",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  Go to my shelf →
                </Link>
                <Link
                  href="/search"
                  style={{
                    display: "block",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    color: "var(--ink2)",
                    border: "1px solid var(--bg3)",
                    borderRadius: "8px",
                    padding: "13px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    transition: "all 0.18s ease",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  Browse books
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
