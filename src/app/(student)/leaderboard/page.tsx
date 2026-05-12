import { BQ_DATA } from "@/lib/data";

export default function LeaderboardPage() {
  const ranked = [...BQ_DATA.students].sort((a, b) => b.xp - a.xp);
  const maxXp = ranked[0]?.xp || 1;
  const medals = ["🥇", "🥈", "🥉"];
  const podiumColors = [
    "linear-gradient(135deg,#fef3c7,#fde68a)",
    "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
    "linear-gradient(135deg,#fef3c7,#fed7aa)",
  ];

  const meIndex = ranked.findIndex(s => s.name === "Айша");

  return (
    <main>
      <section style={{ marginBottom: "32px" }}>
        <span className="kicker">🏆 Сынып рейтингі</span>
        <h1>Кімдер алда барады?</h1>
        <p>Тапсырмаларды орында, XP жина және жоғары орынға шық!</p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "28px", alignItems: "end" }}>
        {[ranked[1], ranked[0], ranked[2]].map((student, podiumPos) => {
          const actualRank = podiumPos === 0 ? 2 : podiumPos === 1 ? 1 : 3;
          if (!student) return <div key={podiumPos}></div>;
          const medal = medals[actualRank - 1];
          const height = actualRank === 1 ? "180px" : actualRank === 2 ? "140px" : "110px";
          const bg = podiumColors[actualRank - 1];
          return (
            <div key={podiumPos} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "6px" }}>{medal}</div>
              <div style={{ fontSize: "22px", fontWeight: 900, marginBottom: "4px" }}>{student.name}</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 700, marginBottom: "12px" }}>⭐ {student.xp} XP</div>
              <div style={{ background: bg, borderRadius: "16px 16px 0 0", height: height, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: 900, border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>{actualRank}</div>
            </div>
          );
        })}
      </div>

      <div className="teacher-table" style={{ padding: "24px" }}>
        <h2 style={{ marginBottom: "16px" }}>📋 Толық рейтинг тізімі</h2>
        {ranked.map((student, i) => {
          const isMe = i === meIndex;
          const medal = medals[i] || `${i + 1}.`;
          const xpPct = Math.round((student.xp / maxXp) * 100);
          const statusStyle = {
            "жақсы өсім":    "background:#dcfce7;color:#16a34a;",
            "қолдау қажет":  "background:#fee2e2;color:#dc2626;",
            "алға шықты":    "background:#dbeafe;color:#2563eb;",
            "қайталау керек":"background:#fef3c7;color:#d97706;",
            "тұрақты":       "background:#f3e8ff;color:#9333ea;",
          }[student.status] || "background:#f3f4f6;color:#374151;";

          return (
            <div key={i} style={{ 
              display: "grid", gridTemplateColumns: "40px 1fr auto", gap: "12px", alignItems: "center", padding: "14px 12px", borderRadius: "16px", marginBottom: "8px",
              ...(isMe ? { background: "linear-gradient(135deg,rgba(79,124,248,0.1),rgba(168,85,247,0.08))", border: "2px solid rgba(79,124,248,0.25)" } : { background: "#f8faff", border: "1.5px solid var(--line)" })
            }}>
              <div style={{ fontSize: "20px", textAlign: "center", fontWeight: 900 }}>{medal}</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "15px" }}>{student.name} {isMe && <span style={{ fontSize: "11px", background: "#4f7cf8", color: "#fff", borderRadius: "999px", padding: "2px 8px", marginLeft: "6px" }}>Мен</span>}</div>
                <div style={{ marginTop: "4px" }}>
                  <span style={{ ...parseStyle(statusStyle), borderRadius: "999px", padding: "2px 10px", fontSize: "11px", fontWeight: 800 }}>{student.status}</span>
                </div>
                <div style={{ marginTop: "8px", height: "6px", borderRadius: "999px", background: "rgba(79,124,248,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${xpPct}%`, height: "100%", borderRadius: "inherit", background: "linear-gradient(90deg,#4f7cf8,#a855f7)" }}></div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#4f7cf8" }}>⭐ {student.xp}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 700, marginTop: "2px" }}>XP</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function parseStyle(css: string) {
  const obj: any = {};
  css.split(";").forEach(pair => {
    const [key, val] = pair.split(":");
    if (key && val) {
      const camelKey = key.trim().replace(/-./g, x => x[1].toUpperCase());
      obj[camelKey] = val.trim();
    }
  });
  return obj;
}
