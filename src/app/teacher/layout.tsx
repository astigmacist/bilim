"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings, Menu, Bot } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      color: isActive ? "#ffffff" : "#cbd5e1",
      backgroundColor: isActive ? "#3b82f6" : "transparent",
      textDecoration: "none",
      fontWeight: isActive ? 600 : 500,
      transition: "all 0.2s",
    };
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside style={{ width: "260px", backgroundColor: "#0f172a", color: "#f8fafc", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "24px", fontSize: "22px", fontWeight: "bold", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>📚</span>
            <div>
              Bilim<span style={{ color: "#38bdf8" }}>Quest</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/teacher" style={getLinkStyle("/teacher")}>
              <LayoutDashboard size={20} />
              Бақылау тақтасы
            </Link>
            <Link href="/teacher/lessons" style={getLinkStyle("/teacher/lessons")}>
              <BookOpen size={20} />
              Оқу бағдарламасы
            </Link>
            <Link href="/teacher/students" style={getLinkStyle("/teacher/students")}>
              <Users size={20} />
              Оқушылар
            </Link>
            <Link href="/teacher/ai" style={getLinkStyle("/teacher/ai")}>
              <span style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                <span style={{ position: "relative" }}>
                  <Bot size={20} />
                  <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", backgroundColor: "#3b82f6", borderRadius: "50%", border: "2px solid #0f172a" }}></span>
                </span>
                AI Көмекші
              </span>
            </Link>
            <Link href="/teacher/settings" style={getLinkStyle("/teacher/settings")}>
              <Settings size={20} />
              Баптаулар
            </Link>
          </nav>
          <div style={{ padding: "20px 16px", borderTop: "1px solid #1e293b", fontSize: "14px", color: "#64748b" }}>
            Teacher Portal v1.0
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Navbar */}
        <header style={{ height: "64px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "8px", borderRadius: "8px", display: "flex" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Menu size={24} />
            </button>
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "18px" }}>Мұғалім панелі</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/" style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>
              Сайтқа қайту ➔
            </Link>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e2e8f0", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid #cbd5e1" }}>
              А.А
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
