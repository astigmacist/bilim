import Link from "next/link";
import { Subject } from "@/lib/data";

const subjectEmoji: Record<string, string> = {
  math: "🔢",
  language: "🔤",
  reading: "📖",
  science: "🔬",
  world: "🌍",
};

export function SubjectCard({ subject }: { subject: Subject }) {
  const emoji = subjectEmoji[subject.id] || "📌";
  const totalXp = subject.lessons.reduce((sum, l) => sum + l.xp, 0);
  const firstLessonId = subject.lessons[0]?.id;

  return (
    <article className={`subject-card ${subject.color}`}>
      <span className="game-icon">{emoji}</span>
      <span className="world-name">{subject.world}</span>
      <h3>{subject.title}</h3>
      <p>{subject.goal}</p>
      <div className="card-meta">
        <span>📚 {subject.lessons.length} сабақ</span>
        <span>⭐ +{totalXp} XP</span>
      </div>
      <Link className="card-action" href={`/lesson/${subject.id}/${firstLessonId}`}>🚀 Әлемге кіру</Link>
    </article>
  );
}
