import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>🚀 <b>BilimQuest AI</b> — Цифрлық және AI технологияларымен оқу</span>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/subjects">📚 Пәндер</Link>
        <Link href="/leaderboard">🏆 Рейтинг</Link>
        <Link href="/teacher">👩‍🏫 Мұғалімге кіру</Link>
      </div>
    </footer>
  );
}
