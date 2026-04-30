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
  { id: "dyed", name: "Dyed", price: "$189", heat: 35, uv: 90, description: "Entry level privacy and style." },
  { id: "carbon", name: "Carbon", price: "$269", heat: 58, uv: 99, description: "Matte look, stronger fade resistance." },
  { id: "ceramic", name: "Ceramic", price: "$379", heat: 78, uv: 99, description: "Premium everyday shop package." },
  { id: "ir", name: "IR Ceramic", price: "$499", heat: 92, uv: 99, description: "Maximum comfort and heat rejection." },
  { id: "chameleon", name: "Chameleon", price: "$449", heat: 74, uv: 99, description: "Color-shift windshield/show style." },
];

const windows = {
  windshield: { label: "Windshield", tip: "Usually clear ceramic or 70%+" },
  front: { label: "Front Door Glass", tip: "Driver + passenger front windows" },
  rear: { label: "Rear Quarter Glass", tip: "Small coupe rear side windows" },
  back: { label: "Back Glass", tip: "Rear windshield" },
};

const defaultTint = { windshield: 70, front: 35, rear: 20, back: 20 };

function tintColor(vlt, film) {
  const alpha = Math.min(0.88, Math.max(0.08, (100 - vlt) / 100));
  if (film === "chameleon") return `rgba(68, 84, 210, ${alpha})`;
  if (film === "carbon") return `rgba(5, 10, 16, ${alpha})`;
  return `rgba(0, 5, 15, ${alpha})`;
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>;
}

function RealG35Preview({ selected, setSelected, tint, film, spin }) {
  return (
    <div className="preview-shell">
      <div className="garage-lines" />
      <div className={spin ? "photo-card spinning" : "photo-card"}>
        <img src="/g35.webp" alt="Silver Infiniti G35 coupe" />
        <button className={`hotspot windshield ${selected === "windshield" ? "active" : ""}`} onClick={() => setSelected("windshield")} style={{ background: tintColor(tint.windshield, film) }} />
        <button className={`hotspot front ${selected === "front" ? "active" : ""}`} onClick={() => setSelected("front")} style={{ background: tintColor(tint.front, film) }} />
        <button className={`hotspot rear ${selected === "rear" ? "active" : ""}`} onClick={() => setSelected("rear")} style={{ background: tintColor(tint.rear, film) }} />
        <button className={`hotspot back ${selected === "back" ? "active" : ""}`} onClick={() => setSelected("back")} style={{ background: tintColor(tint.back, film) }} />
      </div>
      <div className="preview-note">Using your actual G35 photo. Upload it to GitHub as <b>public/g35.webp</b>.</div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState("front");
  const [tint, setTint] = useState(defaultTint);
  const [film, setFilm] = useState("ceramic");
  const [spin, setSpin] = useState(false);

  const filmInfo = filmTypes.find((item) => item.id === film);
  const selectedTint = tintOptions.find((item) => item.vlt === tint[selected]);

  const estimate = useMemo(() => {
    const base = Number(filmInfo.price.replace("$", ""));
    const windshield = tint.windshield <= 80 ? 89 : 0;
    return base + windshield;
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
        <div className="nav-actions"><button onClick={() => setSpin(!spin)}>{spin ? "Stop Preview" : "Play 3D/GIF Preview"}</button><button className="primary">Quote Build</button></div>
      </header>

      <main className="hero-grid">
        <section className="left-card">
          <div className="headline">
            <p>Legit tint shop configurator</p>
            <h1>Preview tint on a real silver G35 coupe.</h1>
            <span>Pick a window, choose ceramic/carbon/dyed film, test every VLT shade, and show the customer a clean dark shop-style preview.</span>
          </div>
          <RealG35Preview selected={selected} setSelected={setSelected} tint={tint} film={film} spin={spin} />
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
        <div className="card film-card"><h3>Film package</h3>{filmTypes.map((item) => <button key={item.id} onClick={() => setFilm(item.id)} className={film === item.id ? "active" : ""}><div><b>{item.name}</b><span>{item.description}</span></div><strong>{item.price}</strong></button>)}</div>
        <div className="card"><h3>{filmInfo.name} performance</h3><Stat label="Heat rejection" value={filmInfo.heat} /><Stat label="UV rejection" value={filmInfo.uv} /><Stat label="Privacy feel" value={100 - selectedTint.vlt} /><div className="price"><span>Estimated package</span><b>${estimate}</b></div></div>
        <div className="card presets"><h3>Fast presets</h3><button onClick={() => preset("clean")}>Clean OEM+</button><button onClick={() => preset("daily")}>Daily dark</button><button onClick={() => preset("blackout")}>Blackout show look</button><div className="summary"><b>Current selection</b><span>{windows[selected].label}: {selectedTint.vlt}% {filmInfo.name}</span></div></div>
      </section>
    </div>
  );
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#030712;color:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif}button{font:inherit}.app{min-height:100vh;padding:22px;background:radial-gradient(circle at 15% -10%,rgba(59,130,246,.28),transparent 34%),radial-gradient(circle at 90% 0%,rgba(249,115,22,.18),transparent 30%),linear-gradient(180deg,#050816,#030712 55%,#020617)}.nav{max-width:1480px;margin:0 auto 18px;display:flex;justify-content:space-between;align-items:center}.logo{display:flex;gap:12px;align-items:center}.logo>span{height:48px;width:58px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,#f97316,#facc15);color:#111827;font-weight:950;letter-spacing:-.06em}.logo b{display:block;font-size:18px}.logo small{color:#94a3b8}.nav-actions{display:flex;gap:10px}.nav-actions button,.presets button{border:1px solid rgba(255,255,255,.12);background:rgba(15,23,42,.85);color:#fff;padding:11px 15px;border-radius:14px;cursor:pointer}.nav-actions .primary{background:#f97316;border-color:#fb923c}.hero-grid{max-width:1480px;margin:auto;display:grid;grid-template-columns:1.35fr .65fr;gap:18px}.left-card,.control-card,.card{border:1px solid rgba(148,163,184,.18);background:rgba(15,23,42,.72);backdrop-filter:blur(18px);border-radius:30px;box-shadow:0 30px 90px rgba(0,0,0,.42)}.left-card,.control-card,.card{padding:22px}.headline p{margin:0 0 8px;color:#fb923c;text-transform:uppercase;font-size:12px;font-weight:900;letter-spacing:.16em}.headline h1{margin:0;max-width:880px;font-size:clamp(36px,5vw,72px);line-height:.9;letter-spacing:-.065em}.headline span{display:block;max-width:760px;margin-top:14px;color:#cbd5e1;line-height:1.6}.preview-shell{position:relative;height:590px;margin-top:24px;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#111827,#030712);display:grid;place-items:center}.garage-lines{position:absolute;inset:45% -20% -20%;background-image:linear-gradient(rgba(148,163,184,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.12) 1px,transparent 1px);background-size:42px 42px;transform:rotateX(68deg);opacity:.7}.photo-card{position:relative;width:min(980px,94%);border-radius:24px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.08);transform:perspective(1200px) rotateY(-8deg) rotateX(2deg);transition:.35s}.photo-card img{display:block;width:100%;filter:contrast(1.08) saturate(.95) brightness(.88)}.photo-card:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(2,6,23,.3),transparent 30%,rgba(251,146,60,.08));pointer-events:none}.spinning{animation:spinPreview 3.8s ease-in-out infinite alternate}@keyframes spinPreview{0%{transform:perspective(1200px) rotateY(-14deg) rotateX(2deg) scale(.99)}50%{transform:perspective(1200px) rotateY(0deg) rotateX(1deg) scale(1.01)}100%{transform:perspective(1200px) rotateY(14deg) rotateX(2deg) scale(.99)}}.preview-note{position:absolute;left:18px;bottom:18px;background:rgba(2,6,23,.78);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px 12px;color:#cbd5e1;font-size:13px}.hotspot{position:absolute;border:2px solid rgba(255,255,255,.22);cursor:pointer;mix-blend-mode:multiply;transition:.18s;backdrop-filter:blur(1px)}.hotspot:hover,.hotspot.active{border-color:#fb923c;box-shadow:0 0 0 5px rgba(251,146,60,.28),0 0 32px rgba(251,146,60,.3);mix-blend-mode:multiply}.windshield{left:36.5%;top:20.5%;width:17%;height:18%;clip-path:polygon(12% 0,100% 10%,85% 100%,0 83%)}.front{left:51.5%;top:20.5%;width:13.8%;height:20%;clip-path:polygon(5% 2%,100% 7%,88% 100%,0 93%)}.rear{left:64.2%;top:22.5%;width:13.5%;height:16.5%;clip-path:polygon(8% 12%,77% 0,100% 100%,0 94%)}.back{left:78%;top:26%;width:8.5%;height:15%;clip-path:polygon(5% 5%,84% 0,100% 100%,0 88%)}.selected-panel{padding:18px;border-radius:24px;background:linear-gradient(135deg,rgba(251,146,60,.18),rgba(37,99,235,.16));border:1px solid rgba(255,255,255,.12)}.selected-panel p{margin:0 0 6px;color:#fb923c;text-transform:uppercase;font-size:12px;font-weight:900}.selected-panel h2{margin:0;font-size:32px}.selected-panel span{color:#cbd5e1}.control-card section{margin-top:22px}.control-card h3,.card h3{margin:0 0 12px}.window-grid{display:grid;gap:10px}.window-grid button,.shade-grid button,.film-card button{border:1px solid rgba(148,163,184,.18);background:rgba(2,6,23,.58);color:#fff;border-radius:16px;padding:12px;cursor:pointer}.window-grid button{display:flex;justify-content:space-between}.active{outline:2px solid #fb923c!important;background:rgba(251,146,60,.14)!important}.shade-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.shade-grid i{display:block;height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.14);margin-bottom:8px}.shade-grid strong{display:block}.shade-grid small{display:block;color:#94a3b8;margin-top:3px}.shop-grid{max-width:1480px;margin:18px auto 0;display:grid;grid-template-columns:1.25fr .85fr .7fr;gap:18px}.film-card{display:grid;gap:10px}.film-card button{display:flex;justify-content:space-between;align-items:center;text-align:left}.film-card span{display:block;color:#94a3b8;font-size:13px;margin-top:4px}.stat{display:grid;grid-template-columns:120px 1fr 45px;gap:12px;align-items:center;margin:14px 0;color:#cbd5e1}.stat div{height:10px;border-radius:999px;background:#1e293b;overflow:hidden}.stat i{display:block;height:100%;background:linear-gradient(90deg,#f97316,#22c55e)}.price{margin-top:22px;padding:18px;border-radius:18px;background:#020617;display:flex;justify-content:space-between;align-items:center}.price span{color:#94a3b8}.price b{font-size:36px;color:#fb923c}.presets{display:grid;gap:10px}.summary{margin-top:10px;border-top:1px solid rgba(148,163,184,.18);padding-top:14px;display:grid;gap:6px}.summary span{color:#cbd5e1}@media(max-width:1060px){.hero-grid,.shop-grid{grid-template-columns:1fr}.preview-shell{height:470px}.nav{align-items:flex-start;flex-direction:column}.app{padding:14px}}@media(max-width:680px){.headline h1{font-size:40px}.preview-shell{height:330px}.shade-grid{grid-template-columns:1fr}.stat{grid-template-columns:1fr}.nav-actions{width:100%}.nav-actions button{flex:1}.preview-note{font-size:11px}}
`;

