"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith("/teacher");

  return (
    <header className={`site-header ${isTeacher ? 'teacher-header' : ''}`}>
      <Link href="/" className="logo">
        <span>BQ</span>
        <b>BilimQuest AI</b>
      </Link>

      <nav className="main-nav">
        <Link href="/" className={pathname === "/" ? "active" : ""}>🏠 Басты бет</Link>
        <Link href="/subjects" className={pathname === "/subjects" ? "active" : ""}>📚 Пәндер</Link>
        <Link href="/leaderboard" className={pathname === "/leaderboard" ? "active" : ""}>🏆 Рейтинг</Link>
      </nav>

      <Link href="/teacher" className="teacher-link">👩‍🏫 Мұғалімге</Link>
    </header>
  );
}
