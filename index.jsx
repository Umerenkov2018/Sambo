import { useState, useEffect } from "react";

const COLORS = {
  red: "#E53E3E",
  orange: "#DD6B20",
  yellow: "#D69E2E",
  green: "#38A169",
  blue: "#3182CE",
  purple: "#805AD5",
  pink: "#D53F8C",
  gold: "#ECC94B",
};

const BELT_LEVELS = [
  { name: "Новичок", belt: "Белый пояс", minXP: 0, color: "#E2E8F0", emoji: "🥋" },
  { name: "Ученик", belt: "Жёлтый пояс", minXP: 100, color: "#ECC94B", emoji: "⭐" },
  { name: "Боец", belt: "Оранжевый пояс", minXP: 300, color: "#DD6B20", emoji: "🔥" },
  { name: "Мастер", belt: "Зелёный пояс", minXP: 600, color: "#38A169", emoji: "💪" },
  { name: "Чемпион", belt: "Синий пояс", minXP: 1000, color: "#3182CE", emoji: "🏆" },
];

const ACHIEVEMENTS = [
  { id: "iron_abs", name: "Железный пресс", desc: "50 повторений пресса", icon: "🔥", xp: 30 },
  { id: "streak_10", name: "Крепкий орешек", desc: "10 тренировок подряд", icon: "💎", xp: 50 },
  { id: "technician", name: "Технарь", desc: "5 новых приёмов", icon: "🎯", xp: 40 },
  { id: "fighter", name: "Боец", desc: "Первое соревнование", icon: "⚔️", xp: 60 },
  { id: "pushup_20", name: "Отжиматель", desc: "20 отжиманий", icon: "💪", xp: 25 },
  { id: "plank_60", name: "Стальная планка", desc: "Планка 60 секунд", icon: "🧱", xp: 35 },
];

const INITIAL_PROFILES = [
  { id: 1, name: "Саша", age: 9, avatar: "🥋", xp: 245, trainings: 12, streak: 4 },
  { id: 2, name: "Миша", age: 11, avatar: "👊", xp: 580, trainings: 28, streak: 7 },
];

const EMPTY_TRAINING = {
  date: new Date().toISOString().split("T")[0],
  attended: true,
  late: false,
  hasUniform: true,
  discipline: 5,
  pressReps: "",
  pushups: "",
  squats: "",
  pullups: "",
  burpees: "",
  plankSec: "",
  cornerSec: "",
  bridgeSec: "",
  bridgeRunsAround: "",
  bridgeFlips: "",
  stanceSec: "",
  frogJumps: "",
  legTackles: "",
  fallProtection: 3,
  techniques: [],
  competitionBouts: "",
  competitionPoints: "",
  competitionPlace: "",
  notes: "",
};

const TECHNIQUE_LIST = [
  "Бросок через бедро", "Подсечка", "Зацеп", "Бросок через плечо",
  "Задняя подножка", "Передняя подножка", "Мельница", "Обратный пояс",
];

function getLevel(xp) {
  for (let i = BELT_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= BELT_LEVELS[i].minXP) return BELT_LEVELS[i];
  }
  return BELT_LEVELS[0];
}

function getNextLevel(xp) {
  for (let i = 0; i < BELT_LEVELS.length; i++) {
    if (xp < BELT_LEVELS[i].minXP) return BELT_LEVELS[i];
  }
  return null;
}

function Confetti({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!active) return;
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: Object.values(COLORS)[Math.floor(Math.random() * Object.values(COLORS).length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);
  if (!particles.length) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: "-20px",
          width: p.size, height: p.size,
          backgroundColor: p.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `fall 2s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

function XPBar({ xp }) {
  const level = getLevel(xp);
  const next = getNextLevel(xp);
  const progress = next ? ((xp - level.minXP) / (next.minXP - level.minXP)) * 100 : 100;
  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#718096", marginBottom: 4 }}>
        <span>{level.belt}</span>
        {next && <span>{xp}/{next.minXP} XP</span>}
      </div>
      <div style={{ background: "#EDF2F7", borderRadius: 99, height: 10, overflow: "hidden" }}>
        <div style={{
          width: `${progress}%`, height: "100%",
          background: `linear-gradient(90deg, ${level.color}, ${next?.color || "#ECC94B"})`,
          borderRadius: 99, transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, record }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "14px 16px",
      border: `2px solid ${record ? "#ECC94B" : "#EDF2F7"}`,
      position: "relative", overflow: "hidden",
    }}>
      {record && (
        <div style={{ position: "absolute", top: 6, right: 8, fontSize: 14 }}>⭐</div>
      )}
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || "#1A202C" }}>{value || "—"}</div>
      <div style={{ fontSize: 11, color: "#718096", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function NumberInput({ label, value, onChange, icon, max }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 4 }}>
        <span>{icon}</span>{label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => onChange(Math.max(0, (parseInt(value) || 0) - 1))}
          style={{ width: 36, height: 36, borderRadius: 10, border: "2px solid #E2E8F0", background: "white", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>−</button>
        <input type="number" value={value} onChange={e => onChange(e.target.value)} min="0" max={max || 999}
          style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 700, border: "2px solid #E2E8F0", borderRadius: 10, padding: "6px 0", outline: "none" }} />
        <button onClick={() => onChange((parseInt(value) || 0) + 1)}
          style={{ width: 36, height: 36, borderRadius: 10, border: "2px solid #E2E8F0", background: "#667EEA", color: "white", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
      </div>
    </div>
  );
}

// ---- Main App ----
export default function SamboTracker() {
  const [screen, setScreen] = useState("profiles");
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState(null);
  const [trainings, setTrainings] = useState({});
  const [training, setTraining] = useState(EMPTY_TRAINING);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const [unlockedAch, setUnlockedAch] = useState({ 1: ["fighter"], 2: ["fighter", "pushup_20"] });
  const [newRecords, setNewRecords] = useState([]);

  const profile = profiles.find(p => p.id === activeProfile);
  const myTrainings = trainings[activeProfile] || [];
  const level = profile ? getLevel(profile.xp) : BELT_LEVELS[0];

  function showToast(msg, color = "#38A169") {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  }

  function selectProfile(id) {
    setActiveProfile(id);
    setScreen("home");
  }

  function startTraining() {
    setTraining({ ...EMPTY_TRAINING, date: new Date().toISOString().split("T")[0] });
    setNewRecords([]);
    setScreen("training");
  }

  function saveTraining() {
    const earned = [];
    // Check records vs previous
    const prev = myTrainings;
    const maxPrev = (field) => Math.max(0, ...prev.map(t => parseInt(t[field]) || 0));

    if ((parseInt(training.pushups) || 0) > maxPrev("pushups") && (parseInt(training.pushups) || 0) > 0) earned.push("отжимания");
    if ((parseInt(training.pressReps) || 0) > maxPrev("pressReps") && (parseInt(training.pressReps) || 0) > 0) earned.push("пресс");
    if ((parseInt(training.plankSec) || 0) > maxPrev("plankSec") && (parseInt(training.plankSec) || 0) > 0) earned.push("планка");
    setNewRecords(earned);

    const gainedXP = 20 + earned.length * 10 + (training.competitionBouts ? 15 : 0);

    // Check achievements
    const newAch = [];
    const allAch = unlockedAch[activeProfile] || [];
    const totalPress = myTrainings.reduce((s, t) => s + (parseInt(t.pressReps) || 0), 0) + (parseInt(training.pressReps) || 0);
    if (totalPress >= 50 && !allAch.includes("iron_abs")) newAch.push("iron_abs");
    if ((parseInt(training.pushups) || 0) >= 20 && !allAch.includes("pushup_20")) newAch.push("pushup_20");
    if ((parseInt(training.plankSec) || 0) >= 60 && !allAch.includes("plank_60")) newAch.push("plank_60");
    if (training.competitionBouts && !allAch.includes("fighter")) newAch.push("fighter");

    setTrainings(prev => ({ ...prev, [activeProfile]: [...(prev[activeProfile] || []), training] }));
    setProfiles(prev => prev.map(p => p.id === activeProfile
      ? { ...p, xp: p.xp + gainedXP, trainings: p.trainings + 1 }
      : p
    ));
    if (newAch.length) {
      setUnlockedAch(prev => ({ ...prev, [activeProfile]: [...(prev[activeProfile] || []), ...newAch] }));
      showToast(`🏅 Новое достижение: ${ACHIEVEMENTS.find(a => a.id === newAch[0])?.name}!`);
    }
    if (earned.length > 0) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 100);
      showToast(`⭐ Новый рекорд: ${earned.join(", ")}! +${gainedXP} XP`, "#D69E2E");
    } else {
      showToast(`✅ Тренировка сохранена! +${gainedXP} XP`);
    }
    setScreen("home");
  }

  function updateTraining(field, val) {
    setTraining(prev => ({ ...prev, [field]: val }));
  }

  function toggleTechnique(tech) {
    setTraining(prev => ({
      ...prev,
      techniques: prev.techniques.includes(tech)
        ? prev.techniques.filter(t => t !== tech)
        : [...prev.techniques, tech],
    }));
  }

  const recentTrainings = myTrainings.slice(-7);

  // --- SCREENS ---

  if (screen === "profiles") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🥋</div>
      <h1 style={{ color: "white", fontSize: 28, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.03em" }}>САМБО ТРЕКЕР</h1>
      <p style={{ color: "#90CDF4", margin: "0 0 32px", fontSize: 14 }}>Выбери бойца</p>

      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
        {profiles.map(p => {
          const lv = getLevel(p.xp);
          return (
            <button key={p.id} onClick={() => selectProfile(p.id)} style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20, padding: "16px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${lv.color}40, ${lv.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: `2px solid ${lv.color}` }}>
                {p.avatar}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>{p.name}</div>
                <div style={{ color: lv.color, fontSize: 12, fontWeight: 600 }}>{lv.emoji} {lv.belt}</div>
                <div style={{ color: "#718096", fontSize: 11 }}>{p.trainings} тренировок • {p.xp} XP</div>
              </div>
              <div style={{ color: "#90CDF4", fontSize: 22 }}>›</div>
            </button>
          );
        })}

        <button onClick={() => {}} style={{
          background: "transparent", border: "2px dashed rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "14px", cursor: "pointer", color: "rgba(255,255,255,0.4)",
          fontSize: 14, fontWeight: 600,
        }}>+ Добавить бойца</button>
      </div>
    </div>
  );

  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Confetti active={confetti} />
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toast.color, color: "white", padding: "12px 24px", borderRadius: 99, fontWeight: 700, fontSize: 14, zIndex: 9998, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1A1A2E, #0F3460)`, padding: "28px 20px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#90CDF4", fontSize: 13, marginBottom: 4 }}>Привет, боец! 👊</div>
            <h2 style={{ color: "white", margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>{profile?.name}</h2>
            <div style={{ color: level.color, fontSize: 14, fontWeight: 700, marginTop: 2 }}>{level.emoji} {level.belt}</div>
          </div>
          <button onClick={() => setScreen("profiles")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, padding: "8px 14px", color: "white", fontSize: 24, cursor: "pointer" }}>
            {profile?.avatar}
          </button>
        </div>
        <XPBar xp={profile?.xp || 0} />
      </div>

      {/* Main content */}
      <div style={{ padding: "0 16px", marginTop: -50 }}>
        {/* Action card */}
        <div style={{ background: "white", borderRadius: 24, padding: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            <StatCard label="Всего" value={profile?.trainings} icon="🥋" color="#3182CE" />
            <StatCard label="Серия" value={`${profile?.streak}🔥`} icon="📅" color="#DD6B20" />
            <StatCard label="XP" value={profile?.xp} icon="⭐" color="#D69E2E" />
          </div>
          <button onClick={startTraining} style={{
            width: "100%", padding: "18px", background: "linear-gradient(135deg, #667EEA, #764BA2)",
            border: "none", borderRadius: 18, color: "white", fontSize: 18, fontWeight: 800,
            cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 8px 20px rgba(102,126,234,0.4)",
          }}>
            ➕ Новая тренировка
          </button>
        </div>

        {/* Recent sessions */}
        {recentTrainings.length > 0 && (
          <div style={{ background: "white", borderRadius: 24, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: "#1A202C" }}>📊 Последние тренировки</h3>
            {recentTrainings.slice().reverse().map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: i < recentTrainings.length - 1 ? "1px solid #F7FAFC" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.attended ? "#EBF8FF" : "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 12 }}>
                  {t.attended ? "✅" : "❌"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1A202C" }}>{t.date}</div>
                  <div style={{ fontSize: 12, color: "#718096" }}>
                    {[t.pushups && `${t.pushups} отжим.`, t.pressReps && `${t.pressReps} пресс`, t.plankSec && `${t.plankSec}с планка`].filter(Boolean).join(" · ") || "Посещение"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Достижения", icon: "🏅", screen: "achievements" },
            { label: "Прогресс", icon: "📈", screen: "progress" },
          ].map(btn => (
            <button key={btn.screen} onClick={() => setScreen(btn.screen)} style={{
              background: "white", border: "2px solid #EDF2F7", borderRadius: 18, padding: "16px",
              cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#4A5568",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{btn.icon}</div>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (screen === "training") return (
    <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 100 }}>
      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg, #1A1A2E, #0F3460)", padding: "20px 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setScreen("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer", fontSize: 16 }}>←</button>
        <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 800 }}>🥋 Новая тренировка</h2>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Attendance */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#1A202C" }}>📍 Посещаемость</h3>
          {[
            { field: "attended", label: "Посетил тренировку", icon: "✅" },
            { field: "late", label: "Опоздал", icon: "⏰" },
            { field: "hasUniform", label: "Есть форма", icon: "🥋" },
          ].map(item => (
            <div key={item.field} onClick={() => updateTraining(item.field, !training[item.field])} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: "1px solid #F7FAFC" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4A5568" }}>{item.icon} {item.label}</span>
              <div style={{ width: 50, height: 28, borderRadius: 99, background: training[item.field] ? "#667EEA" : "#E2E8F0", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 4, left: training[item.field] ? 26 : 4, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* General fitness */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#1A202C" }}>💪 Общая физическая подготовка</h3>
          <NumberInput label="Пресс за 30 сек" value={training.pressReps} onChange={v => updateTraining("pressReps", v)} icon="🔥" />
          <NumberInput label="Отжимания" value={training.pushups} onChange={v => updateTraining("pushups", v)} icon="💪" />
          <NumberInput label="Приседания за 1 мин" value={training.squats} onChange={v => updateTraining("squats", v)} icon="🦵" />
          <NumberInput label="Подтягивания" value={training.pullups} onChange={v => updateTraining("pullups", v)} icon="⬆️" />
          <NumberInput label="Бёрпи за 1 мин" value={training.burpees} onChange={v => updateTraining("burpees", v)} icon="🤸" />
          <NumberInput label="Планка (сек)" value={training.plankSec} onChange={v => updateTraining("plankSec", v)} icon="⏱" />
          <NumberInput label="Уголок (сек)" value={training.cornerSec} onChange={v => updateTraining("cornerSec", v)} icon="📐" />
          <NumberInput label="Мост (сек)" value={training.bridgeSec} onChange={v => updateTraining("bridgeSec", v)} icon="🌉" />
        </div>

        {/* Wrestling specific */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#1A202C" }}>🤼 Борцовская подготовка</h3>
          <NumberInput label="Забегания на мосту" value={training.bridgeRunsAround} onChange={v => updateTraining("bridgeRunsAround", v)} icon="🔄" />
          <NumberInput label="Перевороты на мосту" value={training.bridgeFlips} onChange={v => updateTraining("bridgeFlips", v)} icon="↪️" />
          <NumberInput label="Стойка (сек)" value={training.stanceSec} onChange={v => updateTraining("stanceSec", v)} icon="🧎" />
          <NumberInput label="Выпрыгивания (лягушка)" value={training.frogJumps} onChange={v => updateTraining("frogJumps", v)} icon="🐸" />
          <NumberInput label="Проходы в ноги" value={training.legTackles} onChange={v => updateTraining("legTackles", v)} icon="🦵" />
        </div>

        {/* Techniques */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#1A202C" }}>📚 Техника</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TECHNIQUE_LIST.map(tech => (
              <button key={tech} onClick={() => toggleTechnique(tech)} style={{
                padding: "8px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: training.techniques.includes(tech) ? "#667EEA" : "#F7FAFC",
                color: training.techniques.includes(tech) ? "white" : "#4A5568",
                border: `2px solid ${training.techniques.includes(tech) ? "#667EEA" : "#E2E8F0"}`,
                transition: "all 0.15s",
              }}>
                {training.techniques.includes(tech) ? "✓ " : ""}{tech}
              </button>
            ))}
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#1A202C" }}>🏆 Соревнования (если были)</h3>
          <NumberInput label="Схватки" value={training.competitionBouts} onChange={v => updateTraining("competitionBouts", v)} icon="🤝" />
          <NumberInput label="Набранные баллы" value={training.competitionPoints} onChange={v => updateTraining("competitionPoints", v)} icon="⭐" />
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>🥇 Занятое место</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["1", "2", "3", ""].map(place => (
                <button key={place} onClick={() => updateTraining("competitionPlace", place)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer",
                  border: `2px solid ${training.competitionPlace === place ? "#667EEA" : "#E2E8F0"}`,
                  background: training.competitionPlace === place ? "#667EEA" : "white",
                  color: training.competitionPlace === place ? "white" : "#4A5568",
                }}>
                  {place ? `${["🥇","🥈","🥉"][parseInt(place)-1]} ${place}` : "—"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={saveTraining} style={{
          width: "100%", padding: "18px", background: "linear-gradient(135deg, #38A169, #276749)",
          border: "none", borderRadius: 18, color: "white", fontSize: 18, fontWeight: 800,
          cursor: "pointer", boxShadow: "0 8px 20px rgba(56,161,105,0.4)", marginBottom: 8,
        }}>
          💾 Сохранить тренировку
        </button>
      </div>
    </div>
  );

  if (screen === "achievements") {
    const myUnlocked = unlockedAch[activeProfile] || [];
    return (
      <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg, #1A1A2E, #0F3460)", padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setScreen("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer", fontSize: 16 }}>←</button>
          <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 800 }}>🏅 Достижения</h2>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 12 }}>
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{level.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1A202C" }}>{level.name}</div>
              <div style={{ fontSize: 14, color: "#718096" }}>{level.belt} · {profile?.xp} XP</div>
              <XPBar xp={profile?.xp || 0} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ACHIEVEMENTS.map(ach => {
              const unlocked = myUnlocked.includes(ach.id);
              return (
                <div key={ach.id} style={{
                  background: unlocked ? "white" : "#F7FAFC",
                  borderRadius: 20, padding: 16, border: `2px solid ${unlocked ? "#ECC94B" : "#E2E8F0"}`,
                  opacity: unlocked ? 1 : 0.5,
                  boxShadow: unlocked ? "0 4px 15px rgba(236,201,75,0.2)" : "none",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8, filter: unlocked ? "none" : "grayscale(1)" }}>{ach.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#1A202C", marginBottom: 2 }}>{ach.name}</div>
                  <div style={{ fontSize: 11, color: "#718096" }}>{ach.desc}</div>
                  <div style={{ fontSize: 11, color: "#ECC94B", fontWeight: 700, marginTop: 4 }}>+{ach.xp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "progress") {
    const exercises = [
      { key: "pushups", label: "Отжимания", icon: "💪", color: "#667EEA" },
      { key: "pressReps", label: "Пресс", icon: "🔥", color: "#E53E3E" },
      { key: "plankSec", label: "Планка (сек)", icon: "⏱", color: "#38A169" },
      { key: "squats", label: "Приседания", icon: "🦵", color: "#DD6B20" },
    ];
    return (
      <div style={{ minHeight: "100vh", background: "#F7FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 24 }}>
        <div style={{ background: "linear-gradient(135deg, #1A1A2E, #0F3460)", padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setScreen("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer", fontSize: 16 }}>←</button>
          <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 800 }}>📈 Прогресс</h2>
        </div>
        <div style={{ padding: 16 }}>
          {myTrainings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#718096" }}>
              <div style={{ fontSize: 60, marginBottom: 12 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Данных пока нет</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Добавь первую тренировку!</div>
            </div>
          ) : exercises.map(ex => {
            const data = myTrainings.map((t, i) => ({ i, val: parseInt(t[ex.key]) || 0 })).filter(d => d.val > 0);
            if (!data.length) return null;
            const max = Math.max(...data.map(d => d.val));
            return (
              <div key={ex.key} style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#1A202C" }}>{ex.icon} {ex.label}</div>
                  <div style={{ background: ex.color + "20", color: ex.color, fontWeight: 800, padding: "4px 12px", borderRadius: 99, fontSize: 14 }}>
                    Рекорд: {max}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                  {data.map((d, idx) => (
                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ fontSize: 9, color: "#718096" }}>{d.val}</div>
                      <div style={{
                        width: "100%", background: d.val === max ? ex.color : ex.color + "50",
                        borderRadius: 6, height: Math.max(8, (d.val / max) * 60),
                        transition: "height 0.5s",
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
