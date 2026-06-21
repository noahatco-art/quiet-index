import { StrictMode, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Volume2, Search, ArrowDownUp, ExternalLink, Info, Leaf, Award } from "lucide-react";

// ── Sample data (swap in your own + real affiliate links later) ──
const PRODUCTS = [
  { id: 1, name: "Bosch 800 Series Dishwasher", category: "Dishwashers", db: 42, price: "$$$", priceNum: 3, note: "One of the quietest dishwashers sold in the US." },
  { id: 2, name: "Miele G 7000 Dishwasher", category: "Dishwashers", db: 38, price: "$$$$", priceNum: 4, note: "Whisper-grade; you'll forget it's running." },
  { id: 3, name: "GE Profile Ultra-Quiet", category: "Dishwashers", db: 45, price: "$$$", priceNum: 3, note: "Great balance of price and silence." },
  { id: 4, name: "Vitamix Quiet One", category: "Blenders", db: 64, price: "$$$$", priceNum: 4, note: "Sound-dampening hood; built for cafes." },
  { id: 5, name: "NutriBullet Smart Touch", category: "Blenders", db: 78, price: "$$", priceNum: 2, note: "Quieter than most personal blenders." },
  { id: 6, name: "Coway Airmega 200M", category: "Air Purifiers", db: 24, price: "$$", priceNum: 2, note: "Near-silent on low; barely a hum." },
  { id: 7, name: "Levoit Core 300", category: "Air Purifiers", db: 24, price: "$", priceNum: 1, note: "Sleep mode is genuinely silent." },
  { id: 8, name: "Blueair Blue Pure 211+", category: "Air Purifiers", db: 31, price: "$$", priceNum: 2, note: "Soft white-noise hum some people love." },
  { id: 9, name: "Zephyr Lux Range Hood", category: "Range Hoods", db: 49, price: "$$$$", priceNum: 4, note: "Powerful airflow without the roar." },
  { id: 10, name: "Broan-NuTone Quiet Hood", category: "Range Hoods", db: 55, price: "$$", priceNum: 2, note: "Solid pick for small kitchens." },
  { id: 11, name: "Midea Duo Portable AC", category: "Portable AC", db: 42, price: "$$$", priceNum: 3, note: "Quietest portable AC we've measured." },
  { id: 12, name: "LG Dual Inverter Window AC", category: "Portable AC", db: 44, price: "$$$", priceNum: 3, note: "Inverter keeps it low and steady." },
  { id: 13, name: "Fellow Ode Gen 2 Grinder", category: "Coffee Grinders", db: 68, price: "$$$", priceNum: 3, note: "Engineered specifically to be quiet." },
  { id: 14, name: "Baratza Encore ESP", category: "Coffee Grinders", db: 75, price: "$$", priceNum: 2, note: "Reasonably hushed for a burr grinder." },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

// dB → human descriptor
function feel(db) {
  if (db <= 30) return "Quieter than a whisper";
  if (db <= 40) return "Like a quiet library";
  if (db <= 50) return "Soft rainfall";
  if (db <= 60) return "Calm conversation";
  if (db <= 70) return "Normal speaking voice";
  return "Busy restaurant";
}

// dB → bar color (calm green → soft amber)
function barColor(db) {
  if (db <= 35) return "#7da87b";
  if (db <= 50) return "#9bb48a";
  if (db <= 65) return "#cbb274";
  return "#c79a6a";
}

const REFERENCE = [
  { label: "Whisper", db: 30 },
  { label: "Library", db: 40 },
  { label: "Rainfall", db: 50 },
  { label: "Conversation", db: 60 },
  { label: "Busy cafe", db: 70 },
];

function QuietIndex() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("quiet");
  const [maxPrice] = useState(4);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const okCat = category === "All" || p.category === category;
      const okQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const okPrice = p.priceNum <= maxPrice;
      return okCat && okQuery && okPrice;
    });
    list.sort((a, b) => (sort === "quiet" ? a.db - b.db : a.priceNum - b.priceNum));
    return list;
  }, [category, query, sort, maxPrice]);

  // the quietest dB in the current view — gets the glow
  const quietestDb = filtered.length ? Math.min(...filtered.map((p) => p.db)) : null;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f6f4ef", minHeight: "100vh", color: "#3a3a36" }}>
      <style>{`
        @keyframes qi-fadeup { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform: translateY(0); } }
        @keyframes qi-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes qi-eq { 0%,100% { transform: scaleY(0.35); opacity:0.55; } 50% { transform: scaleY(1); opacity:1; } }
        @keyframes qi-ring { 0% { transform: scale(0.7); opacity:0.5; } 100% { transform: scale(2.2); opacity:0; } }
        @keyframes qi-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes qi-glow { 0%,100% { box-shadow: 0 0 0 1.5px rgba(125,168,123,0.9), 0 6px 22px rgba(125,168,123,0.18); } 50% { box-shadow: 0 0 0 1.5px rgba(125,168,123,1), 0 8px 30px rgba(125,168,123,0.34); } }
        .qi-fadeup { animation: qi-fadeup .9s ease both; }
        .qi-eqbar { transform-origin: bottom; animation: qi-eq 1.5s ease-in-out infinite; }
        .qi-bar { transform-origin: bottom; animation: qi-grow .9s cubic-bezier(.2,.8,.2,1) both; }
        .qi-quietest { animation: qi-glow 2.8s ease-in-out infinite; }
      `}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Hero */}
        <header style={{ position: "relative", textAlign: "center", padding: "72px 0 48px", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 520, height: 320, background: "radial-gradient(ellipse at center, rgba(125,168,123,0.18), rgba(125,168,123,0) 70%)", pointerEvents: "none" }} />

          <div className="qi-fadeup" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 5, height: 38, marginBottom: 26, position: "relative" }}>
            {[22, 34, 28, 38, 26, 32, 20].map((h, i) => (
              <div
                key={i}
                className="qi-eqbar"
                style={{ width: 6, height: h, borderRadius: 4, background: barColor(30 + i * 6), animationDelay: `${i * 0.13}s` }}
              />
            ))}
          </div>

          <div className="qi-fadeup" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#7da87b", marginBottom: 18, position: "relative" }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1px solid #7da87b", animation: "qi-ring 2.4s ease-out infinite" }} />
              <Leaf size={18} style={{ animation: "qi-float 3.5s ease-in-out infinite" }} />
            </span>
            <span style={{ fontFamily: "system-ui", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>The Quiet Index</span>
          </div>

          <h1 className="qi-fadeup" style={{ fontSize: 42, fontWeight: 400, margin: "0 0 16px", lineHeight: 1.2, animationDelay: ".1s", position: "relative" }}>
            The quietest appliances,<br />ranked by decibel.
          </h1>
          <p className="qi-fadeup" style={{ fontFamily: "system-ui", fontSize: 16, color: "#76746c", maxWidth: 480, margin: "0 auto", lineHeight: 1.6, animationDelay: ".2s", position: "relative" }}>
            Thin walls? A sleeping baby? Noise sensitivity? We measure what matters and rank appliances purely by how quiet they are.
          </p>
        </header>

        {/* Reference scale */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "26px 28px", marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ fontFamily: "system-ui", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#a9a79e", marginBottom: 18 }}>
            How loud is a decibel, really?
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 90 }}>
            {REFERENCE.map((r, i) => (
              <div key={r.label} style={{ flex: 1, textAlign: "center" }}>
                <div className="qi-bar" style={{ height: r.db, background: barColor(r.db), borderRadius: "6px 6px 0 0", marginBottom: 8, animationDelay: `${0.15 + i * 0.1}s` }} />
                <div style={{ fontFamily: "system-ui", fontSize: 11, color: "#76746c" }}>{r.label}</div>
                <div style={{ fontFamily: "system-ui", fontSize: 11, color: "#b3b1a8" }}>{r.db} dB</div>
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#b3b1a8" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search appliances..."
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 36px", borderRadius: 10, border: "1px solid #e4e1d8", background: "#fff", fontFamily: "system-ui", fontSize: 14, color: "#3a3a36", outline: "none" }}
            />
          </div>
          <button
            onClick={() => setSort(sort === "quiet" ? "price" : "quiet")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: "1px solid #e4e1d8", background: "#fff", fontFamily: "system-ui", fontSize: 13, color: "#5a5850", cursor: "pointer" }}
          >
            <ArrowDownUp size={14} />
            {sort === "quiet" ? "Quietest first" : "Cheapest first"}
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "7px 14px", borderRadius: 20, fontFamily: "system-ui", fontSize: 13, cursor: "pointer",
                border: "1px solid " + (category === c ? "#7da87b" : "#e4e1d8"),
                background: category === c ? "#7da87b" : "#fff",
                color: category === c ? "#fff" : "#76746c",
                transition: "all .2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((p) => {
            const isQuietest = p.db === quietestDb;
            return (
              <div
                key={p.id}
                className={isQuietest ? "qi-quietest" : ""}
                style={{
                  position: "relative", background: "#fff", borderRadius: 16, padding: "22px 24px",
                  boxShadow: isQuietest ? undefined : "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap",
                }}
              >
                {isQuietest && (
                  <span style={{ position: "absolute", top: -10, left: 20, display: "inline-flex", alignItems: "center", gap: 4, background: "#7da87b", color: "#fff", fontFamily: "system-ui", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, boxShadow: "0 2px 6px rgba(125,168,123,0.4)" }}>
                    <Award size={11} /> Quietest
                  </span>
                )}

                <div style={{ textAlign: "center", minWidth: 70 }}>
                  <div style={{ fontSize: 30, fontWeight: 400, color: barColor(p.db) }}>{p.db}</div>
                  <div style={{ fontFamily: "system-ui", fontSize: 10, letterSpacing: 1, color: "#b3b1a8", textTransform: "uppercase" }}>decibels</div>
                </div>

                <div style={{ flex: "1 1 220px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 18 }}>{p.name}</span>
                    <span style={{ fontFamily: "system-ui", fontSize: 11, color: "#9bb48a", border: "1px solid #d7e3cf", borderRadius: 6, padding: "2px 6px" }}>{p.category}</span>
                  </div>
                  <div style={{ fontFamily: "system-ui", fontSize: 13, color: "#76746c", margin: "6px 0" }}>{p.note}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "system-ui", fontSize: 12, color: "#a9a79e" }}>
                    <Volume2 size={13} /> {feel(p.db)} &nbsp;·&nbsp; {p.price}
                  </div>
                </div>

                {/* affiliate button (drop your real Amazon link in href later) */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#3a3a36", color: "#fff", fontFamily: "system-ui", fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}
                >
                  Check price <ExternalLink size={13} />
                </a>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, fontFamily: "system-ui", color: "#a9a79e" }}>
              No appliances match your filters yet.
            </div>
          )}
        </div>

        {/* Ad slot */}
        <div style={{ marginTop: 32, border: "1px dashed #d8d5cc", borderRadius: 14, padding: 28, textAlign: "center", fontFamily: "system-ui", fontSize: 12, color: "#b3b1a8", background: "#faf9f5" }}>
          Ad space — a single, unobtrusive display unit lives here
        </div>

        {/* Affiliate disclosure */}
        <div style={{ marginTop: 28, display: "flex", gap: 8, fontFamily: "system-ui", fontSize: 12, color: "#a9a79e", lineHeight: 1.6 }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>As an Amazon Associate, I earn from qualifying purchases. The Quiet Index may earn a commission when you buy through our links, at no extra cost to you. Decibel figures are illustrative samples; replace with your own measured or manufacturer data.</span>
        </div>

      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QuietIndex />
  </StrictMode>
);
