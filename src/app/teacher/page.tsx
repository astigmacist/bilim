import { BQ_DATA } from "@/lib/data";

const statusStyle: Record<string, { bg: string, color: string }> = {
  "жақсы өсім":    { bg: "#dcfce7", color: "#16a34a" },
  "қолдау қажет":  { bg: "#fee2e2", color: "#dc2626" },
  "алға шықты":    { bg: "#dbeafe", color: "#2563eb" },
  "қайталау керек":{ bg: "#fef3c7", color: "#d97706" },
  "тұрақты":       { bg: "#f3e8ff", color: "#9333ea" },
};

export default function TeacherPage() {
  const avg = Math.round(BQ_DATA.students.reduce((sum, s) => sum + s.progress, 0) / BQ_DATA.students.length);
  const summary = BQ_DATA.classSummary || {};
  const ranked = [...BQ_DATA.students].sort((a, b) => b.xp - a.xp);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>Бақылау тақтасы</h1>
        <p style={{ color: "#64748b" }}>Сыныптың жалпы үлгерімі және AI аналитикасы</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>Орташа прогресс</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#0f172a" }}>{avg}%</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>Оқушы саны</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#0f172a" }}>{BQ_DATA.students.length}</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>Аяқталған сабақтар</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#0f172a" }}>{summary.totalLessons || 18}</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>AI ұсыныстары</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6" }}>{summary.aiSuggestions || 7}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
        {/* Students Table */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", marginBottom: "20px" }}>📋 Оқушылар рейтингі</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ color: "#64748b", fontSize: "13px", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Оқушы</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Күйі</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600 }}>Прогресс</th>
                <th style={{ paddingBottom: "12px", fontWeight: 600, textAlign: "right" }}>XP</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((student, i) => {
                const style = statusStyle[student.status] || { bg: "#f1f5f9", color: "#475569" };
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px 0", fontWeight: 600, color: "#1e293b" }}>{medal} {student.name}</td>
                    <td style={{ padding: "16px 0" }}>
                      <span style={{ backgroundColor: style.bg, color: style.color, padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 0", width: "30%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${student.progress}%`, backgroundColor: "#3b82f6", height: "100%" }}></div>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>{student.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 0", textAlign: "right", fontWeight: "bold", color: "#f59e0b" }}>
                      {student.xp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", padding: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🤖</span> AI Аналитика
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Сыныптағы басты қиындық:</div>
            <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: 500 }}>
              Көпшілігі "Есеп шартын құру" тақырыбында қателік жіберді. Келесі сабақта қайталау қажет.
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>AI ұсынысы: Топқа бөлу</div>
            <ul style={{ paddingLeft: "0", listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li style={{ fontSize: "14px", color: "#1e293b", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "6px", borderLeft: "3px solid #3b82f6" }}>
                📘 Шартты оқу тобы (4 оқушы)
              </li>
              <li style={{ fontSize: "14px", color: "#1e293b", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "6px", borderLeft: "3px solid #10b981" }}>
                🧠 Дәлелдеу тобы (3 оқушы)
              </li>
              <li style={{ fontSize: "14px", color: "#1e293b", padding: "8px", backgroundColor: "#f8fafc", borderRadius: "6px", borderLeft: "3px solid #f59e0b" }}>
                🏆 Күрделі есеп тобы (3 оқушы)
              </li>
            </ul>
          </div>

          <button style={{ width: "100%", backgroundColor: "#0f172a", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", marginBottom: "10px" }}>
            AI арнайы тапсырма құру
          </button>
          <button style={{ width: "100%", backgroundColor: "white", color: "#475569", border: "1px solid #cbd5e1", padding: "12px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            Есепті жүктеп алу
          </button>
        </div>
      </div>
    </div>
  );
}
