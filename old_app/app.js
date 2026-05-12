const data = window.BQ_DATA;
const params = new URLSearchParams(location.search);
const page = document.body.dataset.page;

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

// Emoji map per subject
const subjectEmoji = {
  math: "🔢",
  language: "🔤",
  reading: "📖",
  science: "🔬",
  world: "🌍",
};

// Status badge style
const statusStyle = {
  "жақсы өсім":    "background:#dcfce7;color:#16a34a;",
  "қолдау қажет":  "background:#fee2e2;color:#dc2626;",
  "алға шықты":    "background:#dbeafe;color:#2563eb;",
  "қайталау керек":"background:#fef3c7;color:#d97706;",
  "тұрақты":       "background:#f3e8ff;color:#9333ea;",
};

function findLesson() {
  const subjectId = params.get("subject") || "science";
  const lessonId = params.get("lesson") || data.subjects.find((s) => s.id === subjectId)?.lessons[0]?.id || "observe";
  const subject = data.subjects.find((item) => item.id === subjectId) || data.subjects[0];
  const lesson = subject.lessons.find((item) => item.id === lessonId) || subject.lessons[0];
  return { subject, lesson };
}

function subjectCard(subject) {
  const first = subject.lessons[0];
  const emoji = subjectEmoji[subject.id] || "📌";
  const totalXp = subject.lessons.reduce((sum, l) => sum + l.xp, 0);
  return `
    <article class="subject-card ${subject.color}">
      <span class="game-icon">${emoji}</span>
      <span class="world-name">${subject.world}</span>
      <h3>${subject.title}</h3>
      <p>${subject.goal}</p>
      <div class="card-meta">
        <span>📚 ${subject.lessons.length} сабақ</span>
        <span>⭐ +${totalXp} XP</span>
      </div>
      <a class="card-action" href="./lesson.html?subject=${subject.id}&lesson=${first.id}">🚀 Әлемге кіру</a>
    </article>
  `;
}

function renderHome() {
  const target = qs('[data-render="subjects"]');
  if (target) target.innerHTML = data.subjects.map(subjectCard).join("");
}

function renderSubjectCatalog() {
  const target = qs('[data-render="subject-catalog"]');
  if (!target) return;
  target.innerHTML = data.subjects.map((subject) => {
    const emoji = subjectEmoji[subject.id] || "📌";
    return `
    <section class="subject-panel ${subject.color}">
      <div class="subject-panel-head">
        <span class="game-icon">${emoji}</span>
        <div>
          <span class="world-name">${subject.world}</span>
          <h2>${subject.title}</h2>
          <p>${subject.goal}</p>
        </div>
      </div>
      <div class="lesson-list">
        ${subject.lessons.map((lesson, index) => `
          <a class="lesson-row" href="./lesson.html?subject=${subject.id}&lesson=${lesson.id}">
            <b>${index + 1}</b>
            <span>
              <strong>${lesson.title}</strong>
              <small>📂 ${lesson.unit} · ⏱ ${lesson.minutes} мин · ⭐ +${lesson.xp} XP</small>
            </span>
            <i>Бастау →</i>
          </a>
        `).join("")}
      </div>
    </section>
  `}).join("");
}

function renderLesson() {
  const target = qs('[data-render="lesson"]');
  if (!target) return;
  const { subject, lesson } = findLesson();
  const emoji = subjectEmoji[subject.id] || "📌";
  target.innerHTML = `
    <section class="lesson-hero ${subject.color}">
      <div>
        <a class="ghost-action" href="./subjects.html" style="min-height:36px;padding:6px 16px;font-size:13px;display:inline-flex;margin-bottom:12px;">← Пәндерге оралу</a>
        <span class="world-name">${emoji} ${subject.title} · ${lesson.unit}</span>
        <h1>${lesson.title}</h1>
        <p>${lesson.story}</p>
        <div class="lesson-tags">
          ${lesson.skills.map((skill) => `<span>✅ ${skill}</span>`).join("")}
        </div>
      </div>
      <aside class="mission-box">
        <strong>+${lesson.xp} XP</strong>
        <span>⏱ ${lesson.minutes} минут</span>
        <a class="primary-action wide" href="./quiz.html?subject=${subject.id}&lesson=${lesson.id}">📝 Тестке өту</a>
      </aside>
    </section>

    <section class="lesson-steps">
      <article>
        <span class="step-num">1</span>
        <h2>💡 Түсініп ал</h2>
        <ul>${lesson.learn.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article>
        <span class="step-num">2</span>
        <h2>🎮 Ойын тапсырмасы</h2>
        <p>${lesson.practice}</p>
        <div class="mini-game">
          <button data-check="1">☑ Маңызды деректі белгіледім</button>
          <button data-check="2">☑ Шешім жолын құрдым</button>
          <button data-check="3">☑ Жауапты тексердім</button>
        </div>
      </article>
      <article>
        <span class="step-num">3</span>
        <h2>🗣 Дәлелде</h2>
        <p>Жауапты бір сөйлеммен түсіндір. AI кейін дәлелің толық па, әлде тағы қандай қадам керек екенін көрсетеді.</p>
        <textarea aria-label="Жауап дәлелі" placeholder="Менің ойымша... Себебі..."></textarea>
      </article>
    </section>
  `;
  qsa("[data-check]").forEach((button) => {
    button.addEventListener("click", () => button.classList.toggle("checked"));
  });
}

function renderQuiz() {
  const target = qs('[data-render="quiz"]');
  if (!target) return;
  const { subject, lesson } = findLesson();
  const emoji = subjectEmoji[subject.id] || "📌";
  let current = 0;
  const answers = [];

  function paint() {
    const item = lesson.quiz[current];
    const pct = Math.round(((current + 1) / lesson.quiz.length) * 100);
    target.innerHTML = `
      <section class="quiz-card ${subject.color}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span class="world-name">${emoji} ${subject.title}</span>
          <span style="font-size:13px;font-weight:800;color:var(--muted);">Сұрақ ${current + 1} / ${lesson.quiz.length}</span>
        </div>
        <div class="quiz-progress"><i style="width:${pct}%"></i></div>
        <h1 style="font-size:clamp(20px,3vw,32px);margin-top:20px;">${item.q}</h1>
        <div class="answer-grid">
          ${item.options.map((option, index) => `
            <button class="answer-option" data-answer="${index}">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--paper);font-weight:900;margin-right:10px;font-size:13px;">${index + 1}</span>
              ${option}
            </button>
          `).join("")}
        </div>
        <p class="quiz-note">🤖 Жауап таңда. Тест соңында AI қате түрін түсіндіреді.</p>
      </section>
    `;
    qsa("[data-answer]", target).forEach((button) => {
      button.addEventListener("click", () => {
        const chosen = Number(button.dataset.answer);
        const correct = item.answer;

        // Show visual feedback
        qsa("[data-answer]", target).forEach((btn) => {
          btn.disabled = true;
          if (Number(btn.dataset.answer) === correct) {
            btn.classList.add("correct");
          } else if (Number(btn.dataset.answer) === chosen && chosen !== correct) {
            btn.classList.add("wrong");
          }
        });

        answers[current] = chosen;
        setTimeout(() => {
          if (current < lesson.quiz.length - 1) {
            current += 1;
            paint();
          } else {
            saveResult(subject, lesson, answers);
            location.href = `./result.html?subject=${subject.id}&lesson=${lesson.id}`;
          }
        }, 900);
      });
    });
  }

  paint();
}

function saveResult(subject, lesson, answers) {
  const mistakes = lesson.quiz
    .map((item, index) => ({ ...item, selected: answers[index], index }))
    .filter((item) => item.selected !== item.answer);
  const score = Math.round(((lesson.quiz.length - mistakes.length) / lesson.quiz.length) * 100);
  localStorage.setItem("bq:lastResult", JSON.stringify({
    subject: subject.title,
    subjectId: subject.id,
    lesson: lesson.title,
    lessonId: lesson.id,
    score,
    mistakes,
  }));
}

function renderResult() {
  const target = qs('[data-render="result"]');
  if (!target) return;
  const stored = localStorage.getItem("bq:lastResult");
  const fallback = {
    subject: "Жаратылыстану",
    subjectId: "science",
    lesson: "Бақылау қалай жүргізіледі?",
    lessonId: "observe",
    score: 67,
    mistakes: [
      { q: "Қорытынды қашан жасалады?", skill: "қорытынды", selected: 1, answer: 0 },
    ],
  };
  const result = stored ? JSON.parse(stored) : fallback;
  const weak = result.mistakes.length ? result.mistakes.map((item) => item.skill).join(", ") : "қате жоқ";

  // Score color
  const scoreColor = result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreEmoji = result.score >= 80 ? "🎉" : result.score >= 50 ? "💪" : "📖";

  target.innerHTML = `
    <section class="result-hero">
      <div>
        <span class="kicker">🤖 AI талдау</span>
        <h1>${result.lesson}</h1>
        <p>${result.subject} сабағы бойынша нәтижең дайын. AI жауаптарыңды қарап, қай дағдыны күшейту керегін көрсетеді.</p>
      </div>
      <div class="score-ring" style="background:conic-gradient(${scoreColor} 0 ${result.score}%, #e8f0fe ${result.score}% 100%);">
        <div>
          <strong style="color:${scoreColor};">${result.score}%</strong>
          <span>${scoreEmoji} нәтиже</span>
        </div>
      </div>
    </section>
    <section class="analysis-grid">
      <article class="analysis-card">
        <h2>😅 Қай жерде қиналдың?</h2>
        <p>${result.mistakes.length ? `Негізгі қиындық: <strong>${weak}</strong>.` : "Барлық жауап дұрыс. Енді күрделі тапсырма ашылды! 🌟"}</p>
      </article>
      <article class="analysis-card">
        <h2>🤖 AI түсіндірмесі</h2>
        <p>${result.mistakes.length
          ? "Сен жауапты тез таңдағансың, бірақ сұрақтағы негізгі сөзді белгілемеген болуың мүмкін. Келесіде алдымен шартты оқып, содан кейін амал немесе дәлел таңда."
          : "Сен шартты дұрыс оқып, жауапты тексергенсің. Келесі мақсат — жауабыңды толық дәлелдеу. 💡"
        }</p>
      </article>
      <article class="analysis-card">
        <h2>🗺️ Келесі қадам</h2>
        <p>2 минуттық қайталау: сұрақтағы маңызды сөзді белгіле, өз жауабыңды бір сөйлеммен дәлелде, содан кейін ұқсас тапсырма орында.</p>
      </article>
    </section>
    <section class="mistake-list">
      <h2>❌ Қате сұрақтар</h2>
      ${result.mistakes.length
        ? result.mistakes.map((item) => `
          <div class="mistake-item">
            <strong>${item.q}</strong>
            <span>🔖 Дағды: ${item.skill}</span>
          </div>
        `).join("")
        : `<p style="color:#22c55e;font-weight:800;">✅ Қате жоқ. Жарайсың, чемпион!</p>`
      }
      <a class="primary-action" href="./lesson.html?subject=${result.subjectId}&lesson=${result.lessonId}" style="margin-top:16px;">🔄 Сабақты қайталау</a>
    </section>
  `;
}

function renderTeacher() {
  const target = qs('[data-render="teacher"]');
  if (!target) return;
  const avg = Math.round(data.students.reduce((sum, s) => sum + s.progress, 0) / data.students.length);
  const summary = data.classSummary || {};

  // Sort students by XP descending for ranking
  const ranked = [...data.students].sort((a, b) => b.xp - a.xp);
  const maxXp = ranked[0]?.xp || 1;

  target.innerHTML = `
    <section class="teacher-hero">
      <div>
        <span class="kicker">📊 Мұғалім панелі</span>
        <h1>Сыныптағы дағдылар картасы</h1>
        <p>Бұл бет оқушыларға көрінбейді. Мұнда мұғалім прогресс, қате түрі, AI ұсынысы және келесі сабаққа дайын тапсырманы көреді.</p>
        ${summary.topSubject ? `
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">
          <span style="background:#dcfce7;color:#16a34a;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:800;">🏆 Үздік пән: ${summary.topSubject}</span>
          <span style="background:#fee2e2;color:#dc2626;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:800;">⚠️ Қиын пән: ${summary.weakSubject}</span>
        </div>` : ""}
      </div>
      <div class="teacher-stat">
        <strong>${avg}%</strong>
        <span>орташа прогресс</span>
      </div>
    </section>

    <section class="teacher-metrics">
      <article>
        <strong>${data.students.length}</strong>
        <span>👦 оқушы</span>
      </article>
      <article>
        <strong>${summary.totalLessons || 18}</strong>
        <span>📚 аяқталған сабақ</span>
      </article>
      <article>
        <strong>${summary.aiSuggestions || 7}</strong>
        <span>🤖 AI ұсыныс</span>
      </article>
      <article>
        <strong>${summary.supportGroup || 3}</strong>
        <span>🆘 қолдау тобы</span>
      </article>
    </section>

    <section class="teacher-grid">
      <div class="teacher-table">
        <h2 style="margin-bottom:16px;">📋 Оқушы прогресі <span style="font-size:14px;color:var(--muted);font-weight:700;">(XP бойынша рейтинг)</span></h2>
        ${ranked.map((student, i) => {
          const style = statusStyle[student.status] || "background:#f3f4f6;color:#374151;";
          const xpPct = Math.round((student.xp / maxXp) * 100);
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`;
          return `
          <article class="student-line">
            <div>
              <strong>${medal} ${student.name}</strong>
              <span style="margin-top:4px;">
                <span style="${style}border-radius:999px;padding:2px 10px;font-size:11px;font-weight:800;">${student.status}</span>
                &nbsp;·&nbsp; ${student.weak}
              </span>
            </div>
            <div style="text-align:right;">
              <b style="display:block;font-size:16px;">${student.progress}%</b>
              <small style="color:var(--muted);font-size:11px;font-weight:700;">⭐ ${student.xp} XP</small>
            </div>
            <i><em style="width:${student.progress}%"></em></i>
          </article>
        `}).join("")}
      </div>
      <aside class="teacher-ai">
        <h2 style="margin-bottom:12px;">🤖 AI ұсынысы</h2>
        <p>Келесі сабақта сыныпты үш топқа бөлу ұсынылады:</p>
        <ul style="margin:12px 0;padding-left:20px;">
          <li style="margin-bottom:8px;">📘 Шартты оқу тобы (4 оқушы)</li>
          <li style="margin-bottom:8px;">🧠 Дәлелдеу тобы (3 оқушы)</li>
          <li style="margin-bottom:8px;">🏆 Күрделі есеп тобы (3 оқушы)</li>
        </ul>
        <p>Қолдау қажет оқушыларға суретпен берілген қысқа нұсқаулық және бір ғана мақсат беріңіз.</p>
        <button class="primary-action" style="margin-top:16px;width:100%;">➕ Қосымша тапсырма құру</button>
        <button class="ghost-action" style="margin-top:10px;width:100%;justify-content:center;">📩 Ата-аналарға хабарлама жіберу</button>
      </aside>
    </section>
  `;
}

function renderLeaderboard() {
  const target = qs('[data-render="leaderboard"]');
  if (!target) return;

  const ranked = [...data.students].sort((a, b) => b.xp - a.xp);
  const maxXp = ranked[0]?.xp || 1;
  const medals = ["🥇", "🥈", "🥉"];
  const podiumColors = [
    "linear-gradient(135deg,#fef3c7,#fde68a)",
    "linear-gradient(135deg,#f1f5f9,#e2e8f0)",
    "linear-gradient(135deg,#fef3c7,#fed7aa)",
  ];

  // Current user (mock: Айша is #1 by XP in our data)
  const meIndex = ranked.findIndex(s => s.name === "Айша");

  target.innerHTML = `
    <section style="margin-bottom:32px;">
      <span class="kicker">🏆 Сынып рейтингі</span>
      <h1>Кімдер алда барады?</h1>
      <p>Тапсырмаларды орында, XP жина және жоғары орынға шық!</p>
    </section>

    <!-- Top 3 Podium -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;align-items:end;">
      ${[ranked[1], ranked[0], ranked[2]].map((student, podiumPos) => {
        const actualRank = podiumPos === 0 ? 2 : podiumPos === 1 ? 1 : 3;
        if (!student) return '<div></div>';
        const medal = medals[actualRank - 1];
        const height = actualRank === 1 ? "180px" : actualRank === 2 ? "140px" : "110px";
        const bg = podiumColors[actualRank - 1];
        return `
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:6px;">${medal}</div>
            <div style="font-size:22px;font-weight:900;margin-bottom:4px;">${student.name}</div>
            <div style="font-size:13px;color:var(--muted);font-weight:700;margin-bottom:12px;">⭐ ${student.xp} XP</div>
            <div style="background:${bg};border-radius:16px 16px 0 0;height:${height};display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;border:2px solid rgba(255,255,255,0.8);box-shadow:0 4px 16px rgba(0,0,0,0.08);">${actualRank}</div>
          </div>
        `;
      }).join("")}
    </div>

    <!-- Full Leaderboard Table -->
    <div class="teacher-table" style="padding:24px;">
      <h2 style="margin-bottom:16px;">📋 Толық рейтинг тізімі</h2>
      ${ranked.map((student, i) => {
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

        return `
          <div style="display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;padding:14px 12px;border-radius:16px;margin-bottom:8px;
            ${isMe ? "background:linear-gradient(135deg,rgba(79,124,248,0.1),rgba(168,85,247,0.08));border:2px solid rgba(79,124,248,0.25);" : "background:#f8faff;border:1.5px solid var(--line);"}"
          >
            <div style="font-size:20px;text-align:center;font-weight:900;">${medal}</div>
            <div>
              <div style="font-weight:900;font-size:15px;">${student.name} ${isMe ? '<span style="font-size:11px;background:#4f7cf8;color:#fff;border-radius:999px;padding:2px 8px;margin-left:6px;">Мен</span>' : ""}</div>
              <div style="margin-top:4px;">
                <span style="${statusStyle}border-radius:999px;padding:2px 10px;font-size:11px;font-weight:800;">${student.status}</span>
              </div>
              <div style="margin-top:8px;height:6px;border-radius:999px;background:rgba(79,124,248,0.1);overflow:hidden;">
                <div style="width:${xpPct}%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#4f7cf8,#a855f7);"></div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:18px;font-weight:900;color:#4f7cf8;">⭐ ${student.xp}</div>
              <div style="font-size:11px;color:var(--muted);font-weight:700;margin-top:2px;">XP</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <!-- Motivational CTA -->
    <div style="margin-top:24px;padding:28px;border-radius:var(--radius);background:linear-gradient(135deg,#4f7cf8,#a855f7);color:#fff;text-align:center;box-shadow:0 8px 32px rgba(79,124,248,0.3);">
      <div style="font-size:32px;margin-bottom:8px;">🚀</div>
      <h2 style="color:#fff;margin-bottom:8px;">Алға, Айша!</h2>
      <p style="color:rgba(255,255,255,0.85);margin-bottom:20px;">Бірінші орынға шығу үшін тек 230 XP жетіспейді. Бүгін екі сабақты аяқта!</p>
      <a class="ghost-action" href="./subjects.html" style="color:#fff;border-color:rgba(255,255,255,0.4);display:inline-flex;">📚 Сабаққа кіру</a>
    </div>
  `;
}

if (page === "home") renderHome();
if (page === "subjects") renderSubjectCatalog();
if (page === "lesson") renderLesson();
if (page === "quiz") renderQuiz();
if (page === "result") renderResult();
if (page === "teacher-dashboard") renderTeacher();
if (page === "leaderboard") renderLeaderboard();
