"use client";

import { useState } from "react";
import { useBQData } from "@/lib/store";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function AdminLessonsPage() {
  const { data, isLoaded, saveLesson, deleteLesson } = useBQData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Form State
  const [newLessonSubject, setNewLessonSubject] = useState("math");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonStory, setNewLessonStory] = useState("");
  const [newLessonPractice, setNewLessonPractice] = useState("");
  const [newLessonQuizzes, setNewLessonQuizzes] = useState([
    { q: "", options: ["", "", ""], answer: 0, skill: "ұғым", explanation: "" }
  ]);

  if (!isLoaded) return <div style={{ padding: "32px" }}>Жүктелуде...</div>;

  // Flatten lessons for table display
  const allLessons = data.subjects.flatMap(subject => 
    subject.lessons.map(lesson => ({
      ...lesson,
      subjectName: subject.title,
      subjectId: subject.id,
      subjectColor: subject.color
    }))
  );

  const filteredLessons = allLessons.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuiz = () => {
    setNewLessonQuizzes([...newLessonQuizzes, { q: "", options: ["", "", ""], answer: 0, skill: "ұғым", explanation: "" }]);
  };

  const handleQuizChange = (index: number, field: string, value: any) => {
    const updated = [...newLessonQuizzes];
    (updated[index] as any)[field] = value;
    setNewLessonQuizzes(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...newLessonQuizzes];
    updated[qIndex].options[optIndex] = value;
    setNewLessonQuizzes(updated);
  };

  const openModalForNew = () => {
    setEditingLessonId(null);
    setNewLessonTitle("");
    setNewLessonStory("");
    setNewLessonPractice("");
    setNewLessonQuizzes([{ q: "", options: ["", "", ""], answer: 0, skill: "ұғым", explanation: "" }]);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (lesson: any, subjectId: string) => {
    setEditingLessonId(lesson.id);
    setNewLessonSubject(subjectId);
    setNewLessonTitle(lesson.title);
    setNewLessonStory(lesson.story);
    setNewLessonPractice(lesson.practice);
    setNewLessonQuizzes(lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz : [{ q: "", options: ["", "", ""], answer: 0, skill: "ұғым", explanation: "" }]);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (subjectId: string, lessonId: string) => {
    if (confirm("Бұл сабақты өшіруге сенімдісіз бе?")) {
      deleteLesson(subjectId, lessonId);
    }
  };

  const handleSaveLesson = () => {
    if (!newLessonTitle.trim()) return alert("Сабақ тақырыбын жазыңыз!");

    const lessonObj = {
      id: editingLessonId || `lesson-${Date.now()}`,
      unit: "Жаңа тарау",
      title: newLessonTitle,
      minutes: 15,
      xp: 100,
      skills: ["жаңа дағды"],
      story: newLessonStory,
      learn: ["Мұғалім қосқан жаңа теориялық материал."],
      practice: newLessonPractice,
      quiz: newLessonQuizzes
    };

    saveLesson(newLessonSubject, lessonObj);
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>Оқу бағдарламасы</h1>
          <p style={{ color: "#64748b" }}>Пәндерді, сабақтарды және тест сұрақтарын басқару</p>
        </div>
        <button 
          onClick={openModalForNew}
          style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgb(59 130 246 / 0.5)" }}
        >
          <Plus size={18} />
          Жаңа сабақ қосу
        </button>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Сабақ немесе пән атауы бойынша іздеу..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 40px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
            />
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Пән</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Сабақ тақырыбы</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Ұзақтығы</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>XP</th>
              <th style={{ padding: "16px 24px", fontWeight: 600, borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.map((lesson, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", color: "#1e293b", fontSize: "14px" }}>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ backgroundColor: `var(--${lesson.subjectColor}-light, #f1f5f9)`, color: `var(--${lesson.subjectColor}, #475569)`, padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                    {lesson.subjectName}
                  </span>
                </td>
                <td style={{ padding: "16px 24px", fontWeight: 500 }}>{lesson.title}</td>
                <td style={{ padding: "16px 24px", color: "#64748b" }}>{lesson.minutes} мин</td>
                <td style={{ padding: "16px 24px", color: "#f59e0b", fontWeight: 700 }}>+{lesson.xp}</td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => handleEditClick(lesson, lesson.subjectId)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteClick(lesson.subjectId, lesson.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "white", width: "100%", maxWidth: "700px", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{editingLessonId ? "Сабақты өңдеу" : "Жаңа сабақ қосу"}</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94a3b8" }}>&times;</button>
            </div>
            
            <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Пәнді таңдаңыз</label>
                <select value={newLessonSubject} onChange={(e) => setNewLessonSubject(e.target.value)} disabled={!!editingLessonId} style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", backgroundColor: editingLessonId ? "#f8fafc" : "white" }}>
                  {data.subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Сабақ тақырыбы</label>
                <input value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} type="text" placeholder="Мысалы: Жаңа тақырып" style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Теория (Story)</label>
                <textarea value={newLessonStory} onChange={(e) => setNewLessonStory(e.target.value)} rows={3} placeholder="Сабақтың кіріспе оқиғасы..." style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Тәжірибелік тапсырма (Practice)</label>
                <textarea value={newLessonPractice} onChange={(e) => setNewLessonPractice(e.target.value)} rows={2} placeholder="Оқушы орындайтын тапсырма..." style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", resize: "vertical" }} />
              </div>

              <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "16px" }}>Тест сұрақтары (Quiz)</p>
                {newLessonQuizzes.map((quiz, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: "16px", padding: "16px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <input 
                      value={quiz.q} onChange={(e) => handleQuizChange(qIdx, "q", e.target.value)}
                      placeholder={`${qIdx + 1}-Сұрақ`} style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #cbd5e1", borderRadius: "6px" }} 
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                      {quiz.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input type="radio" name={`answer-${qIdx}`} checked={quiz.answer === oIdx} onChange={() => handleQuizChange(qIdx, "answer", oIdx)} />
                          <input value={opt} onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)} placeholder={`${oIdx + 1}-нұсқа`} style={{ flex: 1, padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
                        </div>
                      ))}
                    </div>
                    <input value={quiz.explanation} onChange={(e) => handleQuizChange(qIdx, "explanation", e.target.value)} placeholder="Дұрыс жауаптың түсіндірмесі" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }} />
                  </div>
                ))}
                
                <button onClick={handleAddQuiz} style={{ backgroundColor: "white", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 500, color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Plus size={16} /> Сұрақ қосу
                </button>
              </div>
            </div>

            <div style={{ padding: "24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setIsAddModalOpen(false)} style={{ backgroundColor: "white", border: "1px solid #cbd5e1", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Болдырмау</button>
              <button onClick={handleSaveLesson} style={{ backgroundColor: "#3b82f6", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 4px 6px -1px rgb(59 130 246 / 0.5)" }}>Сақтау</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
