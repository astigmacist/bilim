"use client";

import { useBQData } from "@/lib/store";
import { Search } from "lucide-react";
import { useState } from "react";

export default function AdminStudentsPage() {
  const { data, isLoaded } = useBQData();
  const [searchTerm, setSearchTerm] = useState("");

  if (!isLoaded) return <div style={{ padding: "32px" }}>Жүктелуде...</div>;

  const filteredStudents = data.students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>Оқушылар тізімі</h1>
        <p style={{ color: "#64748b" }}>Сыныптағы оқушылардың үлгерімі мен рейтингі</p>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ position: "relative", maxWidth: "400px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Оқушының аты бойынша іздеу..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 40px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Оқушы</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>XP</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Прогресс</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Күйі</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontSize: "14px" }}>
                <td style={{ padding: "16px 24px", fontWeight: 600 }}>{student.name}</td>
                <td style={{ padding: "16px 24px", color: "#f59e0b", fontWeight: 700 }}>{student.xp}</td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "150px" }}>
                    <div style={{ flex: 1, backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${student.progress}%`, backgroundColor: "#3b82f6", height: "100%" }}></div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>{student.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
