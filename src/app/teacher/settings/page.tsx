"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>Баптаулар</h1>
        <p style={{ color: "#64748b" }}>Жеке профиль және жүйелік параметрлер</p>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", padding: "24px", maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Аты-жөні</label>
            <input type="text" defaultValue="Гаухар Тоқбергенова" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Email</label>
            <input type="email" defaultValue="tokbergenova.1979@mail.ru" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Мектеп</label>
            <input type="text" defaultValue="№136 мектеп-лицей" style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
          </div>
          <button style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", width: "max-content", marginTop: "8px" }}>
            Сақтау
          </button>
        </div>
      </div>
    </div>
  );
}
