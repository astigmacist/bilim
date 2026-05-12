"use client";

import { use, useState } from "react";
import { useBQData } from "@/lib/store";
import Link from "next/link";
import { notFound } from "next/navigation";

const subjectEmoji: Record<string, string> = {
  math: "🔢",
  language: "🔤",
  reading: "📖",
  science: "🔬",
  world: "🌍",
  kazakh: "✍️",
};

export default function LessonPage({ params }: { params: Promise<{ subjectId: string; lessonId: string }> }) {
  const { data, isLoaded } = useBQData();
  const { subjectId, lessonId } = use(params);
  
  if (!isLoaded) return <main className="page-shell" style={{ padding: 40 }}>Жүктелуде...</main>;

  const subject = data.subjects.find((s) => s.id === subjectId);
  if (!subject) return notFound();
  
  const lesson = subject.lessons.find((l) => l.id === lessonId);
  if (!lesson) return notFound();
  
  const emoji = subjectEmoji[subject.id] || "📌";
  const lessonIndex = subject.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = subject.lessons[lessonIndex + 1];

  return (
    <main className="page-shell">
      {/* HERO */}
      <section className={`lesson-hero ${subject.color}`} style={{ marginBottom: 24 }}>
        <div>
          <Link
            className="ghost-action"
            href="/subjects"
            style={{ minHeight: 36, padding: "6px 16px", fontSize: 13, display: "inline-flex", marginBottom: 14 }}
          >
            ← Пәндерге оралу
          </Link>
          <span className="world-name">{emoji} {subject.title} · {lesson.unit}</span>
          <h1 style={{ fontSize: "clamp(26px,4vw,44px)", marginTop: 6 }}>{lesson.title}</h1>
          <p style={{ fontSize: 17, marginTop: 10, maxWidth: 600, color: "rgba(26,26,46,0.75)" }}>{lesson.story}</p>
          <div className="lesson-tags" style={{ marginTop: 14 }}>
            {lesson.skills.map((skill) => (
              <span key={skill}>✅ {skill}</span>
            ))}
          </div>
        </div>
        <aside className="mission-box">
          <strong>+{lesson.xp} XP</strong>
          <span>⏱ {lesson.minutes} минут</span>
          <Link className="primary-action wide" href={`/quiz/${subject.id}/${lesson.id}`}>
            📝 Тестке өту →
          </Link>
          {nextLesson && (
            <Link className="ghost-action wide" href={`/lesson/${subject.id}/${nextLesson.id}`} style={{ fontSize: 13 }}>
              Келесі сабақ →
            </Link>
          )}
        </aside>
      </section>

      {/* STEP 1: THEORY */}
      <div className="lesson-steps" style={{ gridTemplateColumns: "1fr" }}>
        <article style={{ padding: 28 }}>
          <span className="step-num">1</span>
          <h2 style={{ marginBottom: 16 }}>💡 Тақырыпты үйрен</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {lesson.learn.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: `rgba(79,124,248,${0.04 + i * 0.02})`,
                  border: "1.5px solid rgba(79,124,248,0.12)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    minWidth: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4f7cf8,#a855f7)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </article>

        {/* STEP 2: PRACTICE */}
        <article style={{ padding: 28 }}>
          <span className="step-num">2</span>
          <h2 style={{ marginBottom: 12 }}>🎮 Тәжірибелік тапсырма</h2>
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 16,
              background: "linear-gradient(135deg,#fef9c3,#fef3c7)",
              border: "2px solid rgba(255,181,71,0.35)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.6,
            }}
          >
            📌 {lesson.practice}
          </div>
          <PracticeChecker lesson={lesson} />
        </article>

        {/* STEP 3: EXPLAIN */}
        <article style={{ padding: 28 }}>
          <span className="step-num">3</span>
          <h2 style={{ marginBottom: 12 }}>🗣 Өз сөзіңмен түсіндір</h2>
          <p style={{ marginBottom: 14 }}>
            Осы тақырыпты досыңа қалай түсіндірер едің? Жазып жаттық!
          </p>
          <textarea
            aria-label="Жауап дәлелі"
            placeholder="Менің ойымша... Себебі... Мысалы..."
            style={{ width: "100%", minHeight: 120, borderRadius: 14, border: "2px solid var(--line)", padding: "14px 16px", fontSize: 15, fontFamily: "inherit", background: "#fafbff", resize: "vertical" }}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <Link className="primary-action" href={`/quiz/${subject.id}/${lesson.id}`} style={{ gap: 10 }}>
              🚀 Тестті бастаймыз!
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

function PracticeChecker({ lesson }: { lesson: { quiz: Array<{ q: string; options: string[]; answer: number }> } }) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const all = done.every(Boolean);
  const labels = ["Берілгендерді белгіледім", "Амалды таңдадым", "Жауапты тексердім"];

  return (
    <div className="mini-game" style={{ marginTop: 14 }}>
      {labels.map((label, i) => (
        <button
          key={i}
          className={done[i] ? "checked" : ""}
          onClick={() => setDone((prev) => { const n = [...prev]; n[i] = !n[i]; return n; })}
        >
          {done[i] ? "✅" : "⬜"} {label}
        </button>
      ))}
      {all && (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#f0fdf4", border: "2px solid #22c55e", color: "#16a34a", fontWeight: 800, textAlign: "center", fontSize: 15 }}>
          🎉 Керемет! Тест тапсыруға дайынсың!
        </div>
      )}
    </div>
  );
}
