"use client";

import { useBQData } from "@/lib/store";
import Link from "next/link";

export default function Home() {
  const { data, isLoaded } = useBQData();

  if (!isLoaded) return <main style={{ padding: 40 }}>Жүктелуде...</main>;

  const mathSubject = data.subjects.find((s) => s.id === "math");
  const firstMathLessons = mathSubject ? mathSubject.lessons.slice(0, 3) : [];

  return (
    <main>
      <section className="student-hero">
        <div className="hero-copy">
          <span className="kicker">👋 Сәлем, Айша!</span>
          <h1>Жаңа шыңдар күтіп тұр!</h1>
          <p>Бүгінгі мақсат: Жаратылыстанудан 1 сабақ өту және Математикадан 50 XP жинау.</p>
          <div className="hero-actions">
            <Link className="primary-action" href="/subjects">Оқуды жалғастыру 🚀</Link>
          </div>
        </div>
      </section>

      <div className="learning-row">
        <section className="quest-card">
          <div className="section-head" style={{ marginTop: 0 }}>
            <div>
              <h2 style={{ fontSize: "22px" }}>🗺 Математика әлемі</h2>
            </div>
            <Link href="/subjects" className="ghost-action" style={{ minHeight: "36px", padding: "6px 14px", fontSize: "13px" }}>
              Барлық пәндер →
            </Link>
          </div>
          
          <div className="path-preview">
            {firstMathLessons.map((lesson, idx) => (
              <div key={lesson.id} className={`path-node ${idx === 0 ? "active" : ""}`}>
                <b>{idx === 0 ? "⭐" : "🔒"}</b>
                <span>{lesson.title}</span>
              </div>
            ))}
          </div>
          <div className="badges-mini">
             <span>🎯 Кезектегі тақырып: <strong>{firstMathLessons[0]?.title || "Белгісіз"}</strong></span>
          </div>
        </section>

        <section className="reward-card" style={{ background: "linear-gradient(135deg, #ede9ff, #f3e8ff)", border: "2px solid rgba(137,103,232,0.2)" }}>
          <span className="kicker" style={{ color: "#8967e8" }}>🏆 Жетістіктер</span>
          <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>Күнделікті мақсат</h2>
          <div className="student-line">
            <i><em style={{ width: "100%" }} /></i>
            <div>
              <strong>1 сабақ аяқтау</strong>
              <span>1/1 орындалды</span>
            </div>
            <b>✅</b>
          </div>
          <div className="student-line">
            <i><em style={{ width: "40%" }} /></i>
            <div>
              <strong>50 XP жинау</strong>
              <span>20/50 XP</span>
            </div>
            <b style={{ color: "var(--sun)" }}>⏳</b>
          </div>
        </section>
      </div>
    </main>
  );
}
