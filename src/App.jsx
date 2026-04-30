
import React, { useMemo, useState } from "react";

const tintOptions = [
  { vlt: 80, label: "80% Air Ceramic", note: "Almost clear, premium heat rejection" },
  { vlt: 70, label: "70% Ceramic", note: "Clean windshield option" },
  { vlt: 50, label: "50% Light Smoke", note: "OEM+ look" },
  { vlt: 35, label: "35% Street", note: "Balanced daily tint" },
  { vlt: 25, label: "25% Smoke", note: "Sporty privacy" },
  { vlt: 20, label: "20% Dark", note: "Popular side/rear setup" },
  { vlt: 15, label: "15% Deep", note: "Aggressive dark look" },
  { vlt: 5, label: "5% Limo", note: "Blackout privacy" },
];

const filmTypes = [
  { id: "dyed", name: "Dyed", price: 189, heat: 35, uv: 90, description: "Entry-level privacy and style." },
  { id: "carbon", name: "Carbon", price: 269, heat: 58, uv: 99, description: "Matte look with better fade resistance." },
  { id: "ceramic", name: "Ceramic", price: 379, heat: 78, uv: 99, description: "Premium everyday shop package." },
  { id: "ir", name: "IR Ceramic", price: 499, heat: 92, uv: 99, description: "Maximum comfort and heat rejection." },
  { id: "chameleon", name: "Chameleon", price: 449, heat: 74, uv: 99, description: "Color-shift windshield/show style." },
];

const windows = {
  windshield: { label: "Windshield", tip: "Usually clear ceramic or 70%+", points: "43.6,25.2 55.8,25.6 56.7,39.8 42.6,39.1" },
  front: { label: "Front Door Glass", tip: "Driver + passenger front windows", points: "26.3,25.7 39.5,25.3 40.2,43.5 25.0,41.7" },
  rear: { label: "Rear Quarter Glass", tip: "Small coupe rear side windows", points: "11.2,28.7 25.4,25.8 24.4,41.5 8.0,40.6" },
  back: { label: "Back Glass", tip: "Rear windshield", points: "3.0,32.8 11.0,28.8 7.7,40.8 1.2,41.7" },
};

const defaultTint = { windshield: 70, front: 35, rear: 20, back: 20 };

function tintColor(vlt, film) {
  const alpha = Math.min(0.82, Math.max(0.08, (100 - vlt) / 125));
  if (film === "chameleon") return `rgba(58, 72, 190, ${alpha})`;
  if (film === "carbon") return `rgba(3, 7, 13, ${alpha})`;
  return `rgba(0, 8, 18, ${alpha})`;
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>;
}

function RealG35Preview({ selected, setSelected, tint, film, inspect, setInspect }) {
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });

  function onPointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY, panX: inspect.panX, panY: inspect.panY });
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setInspect((current) => ({ ...current, panX: start.panX + e.clientX - start.x, panY: start.panY + e.clientY - start.y }));
  }

  function onPointerUp() {
    setDragging(false);
  }

  function zoomTo(key) {
    const presets = {
      all: { zoom: 1, panX: 0, panY: 0 },
      windshield: { zoom: 1.9, panX: -190, panY: 72 },
      front: { zoom: 1.9, panX: 10, panY: 80 },
      rear: { zoom: 1.85, panX: 250, panY: 85 },
      back: { zoom: 1.8, panX: 345, panY: 80 },
    };
    setInspect(presets[key]);
    if (key !== "all") setSelected(key);
  }

  return (
    <div className="preview-shell">
      <div className="black-studio-grid" />
      <div className="preview-toolbar">
        <button onClick={() => zoomTo("all")}>Full car</button>
        {Object.keys(windows).map((key) => <button key={key} onClick={() => zoomTo(key)} className={selected === key ? "active" : ""}>{windows[key].label}</button>)}
      </div>

      <div
        className={dragging ? "photo-stage grabbing" : "photo-stage"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="car-photo-wrap"
          style={{ transform: `translate(${inspect.panX}px, ${inspect.panY}px) scale(${inspect.zoom}) rotateY(${inspect.tilt}deg)` }}
        >
          <img className="car-photo" src="/g35.webp" alt="Silver Infiniti G35 coupe" draggable="false" />
          <svg className="tint-svg" viewBox="0 0 100 62" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glassShine" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,.33)" />
                <stop offset="36%" stopColor="rgba(255,255,255,.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {Object.entries(windows).map(([key, item]) => (
              <polygon
                key={key}
                points={item.points}
                className={selected === key ? "window-poly selected" : "window-poly"}
                fill={tintColor(tint[key], film)}
                onClick={(e) => { e.stopPropagation(); setSelected(key); }}
              />
            ))}
            {Object.entries(windows).map(([key, item]) => (
              <polygon
                key={`${key}-shine`}
                points={item.points}
                className="window-shine"
                fill="url(#glassShine)"
                onClick={(e) => { e.stopPropagation(); setSelected(key); }}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="camera-controls">
        <label>Zoom <input type="range" min="1" max="2.4" step="0.01" value={inspect.zoom} onChange={(e) => setInspect({ ...inspect, zoom: Number(e.target.value) })} /></label>
        <label>Camera angle <input type="range" min="-15" max="15" step="1" value={inspect.tilt} onChange={(e) => setInspect({ ...inspect, tilt: Number(e.target.value) })} /></label>
        <button onClick={() => setInspect({ zoom: 1, panX: 0, panY: 0, tilt: 0 })}>Reset view</button>
      </div>
      <div className="hint-pill">Drag the car to inspect · use zoom for close-up window preview</div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState("front");
  const [tint, setTint] = useState(defaultTint);
  const [film, setFilm] = useState("ceramic");
  const [inspect, setInspect] = useState({ zoom: 1, panX: 0, panY: 0, tilt: 0 });

  const filmInfo = filmTypes.find((item) => item.id === film);
  const selectedTint = tintOptions.find((item) => item.vlt === tint[selected]);

  const estimate = useMemo(() => {
    const windshield = tint.windshield <= 80 ? 89 : 0;
    return filmInfo.price + windshield;
  }, [filmInfo, tint.windshield]);

  function updateTint(vlt) {
    setTint((current) => ({ ...current, [selected]: vlt }));
  }

  function preset(type) {
    if (type === "clean") setTint({ windshield: 80, front: 50, rear: 35, back: 35 });
    if (type === "daily") setTint({ windshield: 70, front: 35, rear: 20, back: 20 });
    if (type === "blackout") setTint({ windshield: 50, front: 15, rear: 5, back: 5 });
  }

  return (
    <div className="app">
      <style>{styles}</style>
      <header className="nav">
        <div className="logo"><span>G35</span><div><b>Tint Studio Pro</b><small>2004 Infiniti G35 Coupe</small></div></div>
        <div className="nav-actions"><button onClick={() => setInspect({ zoom: 1.9, panX: 10, panY: 80, tilt: 0 })}>Inspect Glass</button><button className="primary">Quote Build</button></div>
      </header>

      <main className="hero-grid">
        <section className="left-card">
          <div className="headline">
            <p>Black studio preview</p>
            <h1>Accurate tint preview on your G35 photo.</h1>
            <span>Click the real windows, zoom in, drag the camera around the photo, and compare ceramic, carbon, dyed, IR ceramic, and chameleon film packages.</span>
          </div>
          <RealG35Preview selected={selected} setSelected={setSelected} tint={tint} film={film} inspect={inspect} setInspect={setInspect} />
        </section>

        <aside className="control-card">
          <div className="selected-panel">
            <p>Editing</p>
            <h2>{windows[selected].label}</h2>
            <span>{windows[selected].tip}</span>
          </div>

          <section>
            <h3>Choose window</h3>
            <div className="window-grid">
              {Object.entries(windows).map(([key, item]) => (
                <button key={key} onClick={() => setSelected(key)} className={selected === key ? "active" : ""}>
                  <span>{item.label}</span><b>{tint[key]}%</b>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Tint shade</h3>
            <div className="shade-grid">
              {tintOptions.map((option) => (
                <button key={option.vlt} onClick={() => updateTint(option.vlt)} className={tint[selected] === option.vlt ? "active" : ""}>
                  <i style={{ background: tintColor(option.vlt, film) }} />
                  <strong>{option.vlt}%</strong>
                  <small>{option.label}</small>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </main>

      <section className="shop-grid">
        <div className="card film-card"><h3>Film package</h3>{filmTypes.map((item) => <button key={item.id} onClick={() => setFilm(item.id)} className={film === item.id ? "active" : ""}><div><b>{item.name}</b><span>{item.description}</span></div><strong>${item.price}</strong></button>)}</div>
        <div className="card"><h3>{filmInfo.name} performance</h3><Stat label="Heat rejection" value={filmInfo.heat} /><Stat label="UV rejection" value={filmInfo.uv} /><Stat label="Privacy feel" value={100 - selectedTint.vlt} /><div className="price"><span>Estimated package</span><b>${estimate}</b></div></div>
        <div className="card presets"><h3>Fast presets</h3><button onClick={() => preset("clean")}>Clean OEM+</button><button onClick={() => preset("daily")}>Daily dark</button><button onClick={() => preset("blackout")}>Blackout show look</button><div className="summary"><b>Current selection</b><span>{windows[selected].label}: {selectedTint.vlt}% {filmInfo.name}</span></div></div>
      </section>
    </div>
  );
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#000;color:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif}button{font:inherit}.app{min-height:100vh;padding:22px;background:#000}.nav{max-width:1500px;margin:0 auto 18px;display:flex;justify-content:space-between;align-items:center}.logo{display:flex;gap:12px;align-items:center}.logo>span{height:48px;width:58px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,#f97316,#facc15);color:#111827;font-weight:950;letter-spacing:-.06em}.logo b{display:block;font-size:18px}.logo small{color:#94a3b8}.nav-actions{display:flex;gap:10px}.nav-actions button,.presets button,.camera-controls button,.preview-toolbar button{border:1px solid rgba(255,255,255,.12);background:#080d18;color:#fff;padding:11px 15px;border-radius:14px;cursor:pointer}.nav-actions .primary{background:#f97316;border-color:#fb923c}.hero-grid{max-width:1500px;margin:auto;display:grid;grid-template-columns:1.35fr .65fr;gap:18px}.left-card,.control-card,.card{border:1px solid rgba(148,163,184,.16);background:#05070d;border-radius:30px;box-shadow:0 30px 90px rgba(0,0,0,.72)}.left-card,.control-card,.card{padding:22px}.headline p{margin:0 0 8px;color:#fb923c;text-transform:uppercase;font-size:12px;font-weight:900;letter-spacing:.16em}.headline h1{margin:0;max-width:920px;font-size:clamp(36px,5vw,72px);line-height:.9;letter-spacing:-.065em}.headline span{display:block;max-width:760px;margin-top:14px;color:#cbd5e1;line-height:1.6}.preview-shell{position:relative;height:670px;margin-top:24px;border-radius:28px;overflow:hidden;background:radial-gradient(circle at 50% 28%,#151a24,#030408 62%,#000);display:grid;place-items:center}.black-studio-grid{position:absolute;inset:45% -30% -20%;background-image:linear-gradient(rgba(148,163,184,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.08) 1px,transparent 1px);background-size:42px 42px;transform:rotateX(68deg);opacity:.72}.preview-toolbar{position:absolute;top:16px;left:16px;right:16px;z-index:5;display:flex;gap:8px;flex-wrap:wrap}.preview-toolbar .active{outline:2px solid #fb923c!important;background:rgba(251,146,60,.16)!important}.photo-stage{position:relative;width:100%;height:100%;display:grid;place-items:center;overflow:hidden;cursor:grab;touch-action:none}.photo-stage.grabbing{cursor:grabbing}.car-photo-wrap{position:relative;width:min(1120px,96%);transition:transform .25s ease;transform-origin:center center;user-select:none}.car-photo{display:block;width:100%;border-radius:24px;filter:contrast(1.12) saturate(.9) brightness(.86);box-shadow:0 46px 100px rgba(0,0,0,.72),0 0 0 1px rgba(255,255,255,.08)}.tint-svg{position:absolute;inset:0;width:100%;height:100%;border-radius:24px}.window-poly{cursor:pointer;stroke:rgba(255,255,255,.2);stroke-width:.22;transition:.18s;mix-blend-mode:multiply}.window-poly:hover,.window-poly.selected{stroke:#fb923c;stroke-width:.55;filter:drop-shadow(0 0 6px rgba(251,146,60,.7))}.window-shine{pointer-events:none;mix-blend-mode:screen;opacity:.35}.camera-controls{position:absolute;left:16px;right:16px;bottom:16px;z-index:5;display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end;background:rgba(0,0,0,.66);border:1px solid rgba(255,255,255,.1);padding:12px;border-radius:18px}.camera-controls label{color:#cbd5e1;font-size:13px}.camera-controls input{display:block;width:100%;margin-top:6px;accent-color:#fb923c}.hint-pill{position:absolute;right:18px;bottom:92px;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:10px 13px;color:#cbd5e1;font-size:13px}.selected-panel{padding:18px;border-radius:24px;background:linear-gradient(135deg,rgba(251,146,60,.16),rgba(15,23,42,.9));border:1px solid rgba(255,255,255,.1)}.selected-panel p{margin:0 0 6px;color:#fb923c;text-transform:uppercase;font-size:12px;font-weight:900}.selected-panel h2{margin:0;font-size:32px}.selected-panel span{color:#cbd5e1}.control-card section{margin-top:22px}.control-card h3,.card h3{margin:0 0 12px}.window-grid{display:grid;gap:10px}.window-grid button,.shade-grid button,.film-card button{border:1px solid rgba(148,163,184,.16);background:#080d18;color:#fff;border-radius:16px;padding:12px;cursor:pointer}.window-grid button{display:flex;justify-content:space-between}.active{outline:2px solid #fb923c!important;background:rgba(251,146,60,.14)!important}.shade-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.shade-grid i{display:block;height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.14);margin-bottom:8px}.shade-grid strong{display:block}.shade-grid small{display:block;color:#94a3b8;margin-top:3px}.shop-grid{max-width:1500px;margin:18px auto 0;display:grid;grid-template-columns:1.25fr .85fr .7fr;gap:18px}.film-card{display:grid;gap:10px}.film-card button{display:flex;justify-content:space-between;align-items:center;text-align:left}.film-card span{display:block;color:#94a3b8;font-size:13px;margin-top:4px}.stat{display:grid;grid-template-columns:120px 1fr 45px;gap:12px;align-items:center;margin:14px 0;color:#cbd5e1}.stat div{height:10px;border-radius:999px;background:#1e293b;overflow:hidden}.stat i{display:block;height:100%;background:linear-gradient(90deg,#f97316,#22c55e)}.price{margin-top:22px;padding:18px;border-radius:18px;background:#000;display:flex;justify-content:space-between;align-items:center}.price span{color:#94a3b8}.price b{font-size:36px;color:#fb923c}.presets{display:grid;gap:10px}.summary{margin-top:10px;border-top:1px solid rgba(148,163,184,.18);padding-top:14px;display:grid;gap:6px}.summary span{color:#cbd5e1}@media(max-width:1080px){.hero-grid,.shop-grid{grid-template-columns:1fr}.preview-shell{height:540px}.nav{align-items:flex-start;flex-direction:column}.app{padding:14px}}@media(max-width:720px){.headline h1{font-size:40px}.preview-shell{height:430px}.shade-grid{grid-template-columns:1fr}.stat{grid-template-columns:1fr}.nav-actions{width:100%}.nav-actions button{flex:1}.camera-controls{grid-template-columns:1fr}.hint-pill{display:none}.preview-toolbar{position:relative;top:auto;left:auto;right:auto;margin-bottom:8px}.photo-stage{height:100%}}
`;
