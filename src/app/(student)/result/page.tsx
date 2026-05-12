"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bq:lastResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) return <div>Нәтиже жүктелуде...</div>;

  const scoreColor = result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreEmoji = result.score >= 80 ? "🎉" : result.score >= 50 ? "💪" : "📖";
  const weak = result.mistakes.length ? result.mistakes.map((item: any) => item.skill).join(", ") : "қате жоқ";

  return (
    <main>
      <section className="result-hero">
        <div>
          <span className="kicker">🤖 AI талдау</span>
          <h1>{result.lesson}</h1>
          <p>{result.subject} сабағы бойынша нәтижең дайын. AI жауаптарыңды қарап, қай дағдыны күшейту керегін көрсетеді.</p>
        </div>
        <div className="score-ring" style={{ background: `conic-gradient(${scoreColor} 0 ${result.score}%, #e8f0fe ${result.score}% 100%)` }}>
          <div>
            <strong style={{ color: scoreColor }}>{result.score}%</strong>
            <span>{scoreEmoji} нәтиже</span>
          </div>
        </div>
      </section>

      <section className="analysis-grid">
        <article className="analysis-card">
          <h2>😅 Қай жерде қиналдың?</h2>
          <p>{result.mistakes.length ? <>Негізгі қиындық: <strong>{weak}</strong>.</> : "Барлық жауап дұрыс. Енді күрделі тапсырма ашылды! 🌟"}</p>
        </article>
        <article className="analysis-card">
          <h2>🤖 AI түсіндірмесі</h2>
          <p>{result.mistakes.length
            ? "Сен жауапты тез таңдағансың, бірақ сұрақтағы негізгі сөзді белгілемеген болуың мүмкін. Келесіде алдымен шартты оқып, содан кейын амал немесе дәлел таңда."
            : "Сен шартты дұрыс оқып, жауапты тексергенсің. Келесі мақсат — жауабыңды толық дәлелдеу. 💡"
          }</p>
        </article>
        <article className="analysis-card">
          <h2>🗺️ Келесі қадам</h2>
          <p>2 минуттық қайталау: сұрақтағы маңызды сөзді белгіле, өз жауабыңды бір сөйлеммен дәлелде, содан кейін ұқсас тапсырма орында.</p>
        </article>
      </section>

      <section className="mistake-list">
        <h2>❌ Қате сұрақтар</h2>
        {result.mistakes.length
          ? result.mistakes.map((item: any, i: number) => (
            <div key={i} className="mistake-item">
              <strong>{item.q}</strong>
              <span>🔖 Дағды: {item.skill}</span>
              {item.explanation && (
                <span style={{ color: "#4f7cf8", fontWeight: 700, fontSize: 13, marginTop: 4, display: "block" }}>
                  💡 {item.explanation}
                </span>
              )}
            </div>
          ))
          : <p style={{ color: "#22c55e", fontWeight: 800 }}>✅ Қате жоқ. Жарайсың, чемпион!</p>
        }
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <Link className="primary-action" href={`/lesson/${result.subjectId}/${result.lessonId}`}>🔄 Сабақты қайталау</Link>
          <Link className="ghost-action" href="/subjects">📚 Барлық сабақтар</Link>
        </div>
      </section>
    </main>
  );
}
