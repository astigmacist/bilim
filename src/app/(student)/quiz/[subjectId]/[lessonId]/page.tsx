"use client";

import { useState, use } from "react";
import { useBQData } from "@/lib/store";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

const subjectEmoji: Record<string, string> = {
  math: "🔢",
  language: "🔤",
  reading: "📖",
  science: "🔬",
  world: "🌍",
};

export default function QuizPage({ params }: { params: Promise<{ subjectId: string; lessonId: string }> }) {
  const { subjectId, lessonId } = use(params);
  const router = useRouter();
  const { data, isLoaded } = useBQData();

  if (!isLoaded) return <main className="quiz-shell" style={{ padding: 40 }}>Жүктелуде...</main>;

  const subject = data.subjects.find((s) => s.id === subjectId);
  if (!subject) return notFound();
  const lesson = subject.lessons.find((l) => l.id === lessonId);
  if (!lesson) return notFound();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ chosen: number; correct: number; explanation: string } | null>(null);

  const item = lesson.quiz[current];
  const pct = Math.round(((current) / lesson.quiz.length) * 100);
  const emoji = subjectEmoji[subject.id] || "📌";

  const handleAnswer = (chosen: number) => {
    const correct = item.answer;
    const explanation = item.explanation || "";
    setFeedback({ chosen, correct, explanation });

    setTimeout(() => {
      const newAnswers = [...answers, chosen];
      setAnswers(newAnswers);
      setFeedback(null);

      if (current < lesson.quiz.length - 1) {
        setCurrent(current + 1);
      } else {
        const mistakes = lesson.quiz
          .map((q, i) => ({ ...q, selected: newAnswers[i], index: i }))
          .filter((q) => q.selected !== q.answer);
        const score = Math.round(((lesson.quiz.length - mistakes.length) / lesson.quiz.length) * 100);
        localStorage.setItem("bq:lastResult", JSON.stringify({
          subject: subject.title,
          subjectId: subject.id,
          lesson: lesson.title,
          lessonId: lesson.id,
          score,
          mistakes,
        }));
        router.push("/result");
      }
    }, 1400);
  };

  return (
    <main className="quiz-shell" style={{ padding: "0 16px" }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>
        <span>{emoji} {subject.title} · {lesson.title}</span>
        <span>Сұрақ {current + 1} / {lesson.quiz.length}</span>
      </div>
      <div className="quiz-progress" style={{ marginBottom: 28 }}>
        <i style={{ width: `${pct}%` }} />
      </div>

      <section className={`quiz-card ${subject.color}`}>
        {/* Question */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(79,124,248,0.12)",
              fontSize: 12,
              fontWeight: 900,
              color: "#4f7cf8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            🧠 {item.skill}
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(20px,3vw,30px)", marginTop: 16, marginBottom: 8, lineHeight: 1.3 }}>
          {item.q}
        </h1>

        {/* Options */}
        <div className="answer-grid">
          {item.options.map((option, index) => {
            let cls = "answer-option";
            if (feedback) {
              if (index === feedback.correct) cls += " correct";
              else if (index === feedback.chosen && index !== feedback.correct) cls += " wrong";
            }
            return (
              <button
                key={index}
                className={cls}
                onClick={() => !feedback && handleAnswer(index)}
                disabled={!!feedback}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <span
                  style={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: feedback
                      ? index === feedback.correct
                        ? "#22c55e"
                        : index === feedback.chosen
                        ? "#ef4444"
                        : "var(--paper)"
                      : "var(--paper)",
                    color: feedback && (index === feedback.correct || index === feedback.chosen) ? "#fff" : "var(--ink)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: 14,
                    transition: "all 0.3s",
                  }}
                >
                  {feedback && index === feedback.correct ? "✓" : feedback && index === feedback.chosen && index !== feedback.correct ? "✗" : String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation panel */}
        {feedback && (
          <div
            style={{
              marginTop: 20,
              padding: "16px 20px",
              borderRadius: 16,
              background: feedback.chosen === feedback.correct
                ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
                : "linear-gradient(135deg,#fff5f5,#fee2e2)",
              border: `2px solid ${feedback.chosen === feedback.correct ? "#22c55e" : "#ef4444"}`,
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6, color: feedback.chosen === feedback.correct ? "#16a34a" : "#dc2626" }}>
              {feedback.chosen === feedback.correct ? "🎉 Дұрыс!" : "❌ Дұрыс емес"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", lineHeight: 1.5 }}>
              💡 {feedback.explanation}
            </div>
          </div>
        )}

        <p className="quiz-note" style={{ marginTop: 20 }}>
          🤖 Жауап таңда — тест соңында барлық қателерің талданады.
        </p>
      </section>

      {/* Navigation dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
        {lesson.quiz.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              borderRadius: 999,
              background: i < current
                ? "#22c55e"
                : i === current
                ? "#4f7cf8"
                : "rgba(79,124,248,0.2)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </main>
  );
}
