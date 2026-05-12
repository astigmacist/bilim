"use client";

import { useBQData } from "@/lib/store";
import Link from "next/link";

const subjectEmoji: Record<string, string> = {
  math: "🔢",
  language: "🔤",
  reading: "📖",
  science: "🔬",
  world: "🌍",
  kazakh: "✍️",
};

export default function SubjectsPage() {
  const { data, isLoaded } = useBQData();

  if (!isLoaded) return <main style={{ padding: 40 }}>Жүктелуде...</main>;

  return (
    <main>
      <section className="catalog-hero">
        <span className="kicker">📚 Пәндер каталогы</span>
        <h1>Барлық оқу әлемдері</h1>
        <p>Өзіңе ұнайтын пәнді таңда және жаңа білім шыңдарын бағындыр!</p>
      </section>

      <div className="subject-catalog">
        {data.subjects.map((subject) => {
          const emoji = subjectEmoji[subject.id] || "📌";
          return (
            <section key={subject.id} className={`subject-panel ${subject.color}`}>
              <div className="subject-panel-head">
                <span className="game-icon">{emoji}</span>
                <div>
                  <span className="world-name">{subject.world}</span>
                  <h2>{subject.title}</h2>
                  <p>{subject.goal}</p>
                </div>
              </div>
              <div className="lesson-list">
                {subject.lessons.map((lesson, index) => (
                  <Link key={lesson.id} className="lesson-row" href={`/lesson/${subject.id}/${lesson.id}`}>
                    <b>{index + 1}</b>
                    <span>
                      <strong>{lesson.title}</strong>
                      <small>📂 {lesson.unit} · ⏱ {lesson.minutes} мин · ⭐ +{lesson.xp} XP</small>
                    </span>
                    <i>Бастау →</i>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
