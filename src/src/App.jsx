import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Car, Eye, RotateCcw, Shield, Sun, ThermometerSun } from "lucide-react";

const tintOptions = [
  { vlt: 0, name: "Clear / No Tint", look: "Factory glass", privacy: "None", note: "Good for windshield protection film if ceramic clear is used." },
  { vlt: 70, name: "70% VLT", look: "Almost clear", privacy: "Very low", note: "Common for windshield or subtle heat rejection." },
  { vlt: 50, name: "50% VLT", look: "Light smoke", privacy: "Low", note: "Clean OEM+ look, easy night visibility." },
  { vlt: 35, name: "35% VLT", look: "Medium smoke", privacy: "Medium", note: "Popular daily-driver shade." },
  { vlt: 30, name: "30% VLT", look: "Medium dark", privacy: "Medium+", note: "Noticeably tinted but still practical." },
  { vlt: 25, name: "25% VLT", look: "Dark smoke", privacy: "High", note: "Sporty look on silver paint." },
  { vlt: 20, name: "20% VLT", look: "Dark", privacy: "High", note: "Very common rear/side tint choice." },
  { vlt: 15, name: "15% VLT", look: "Very dark", privacy: "Very high", note: "Aggressive look, reduced night visibility." },
  { vlt: 10, name: "10% VLT", look: "Limo dark", privacy: "Extreme", note: "Harder to see out at night." },
  { vlt: 5, name: "5% VLT", look: "Limo / blackout", privacy: "Maximum", note: "Strong privacy, lowest visibility." },
];

const filmTypes = [
  { type: "Dyed", price: "$", heat: "Low", best: "Budget look upgrade", details: "Darkens the glass, but heat rejection and lifespan are usually lower." },
  { type: "Carbon", price: "$$", heat: "Medium", best: "Matte look without signal issues", details: "Better durability than dyed, usually less fading." },
  { type: "Ceramic", price: "$$$", heat: "High", best: "Heat rejection and clean visibility", details: "Premium choice for daily driving, especially in hot weather." },
  { type: "IR Ceramic", price: "$$$$", heat: "Very high", best: "Maximum comfort", details: "Highest heat/infrared rejection while keeping a clean shade." },
  { type: "Reflective / Metallic", price: "$$", heat: "Medium-high", best: "Mirror-style look", details: "Can look flashy and may affect signals depending on film." },
  { type: "Chameleon", price: "$$$", heat: "Medium", best: "Color-shifting windshield style", details: "Show-car look; check local rules before installing." },
];

const windows = [
  { key: "windshield", label: "Windshield", short: "Front windshield", path: "M146 124 C196 99 262 88 333 93 C322 109 310 126 300 143 C238 140 189 139 146 124", center: [238, 118] },
  { key: "frontDriver", label: "Front Door Window", short: "Driver/passenger front", path: "M305 94 C350 98 390 113 421 141 L318 143 C324 126 333 111 344 96 C332 95 319 94 305 94", center: [360, 122] },
  { key: "quarter", label: "Rear Quarter Window", short: "Rear side glass", path: "M426 142 C449 116 479 105 516 103 C541 111 563 127 581 145 L430 146 Z", center: [498, 128] },
  { key: "rear", label: "Rear Glass", short: "Back window", path: "M570 105 C626 119 664 143 688 177 C647 165 613 156 579 151 C572 132 566 117 570 105", center: [622, 144] },
  { key: "sunroof", label: "Sunroof", short: "Roof glass", path: "M318 63 C380 48 458 50 515 66 C488 74 383 76 318 63", center: [420, 64] },
];

const baseSelection = {
  windshield: 70,
  frontDriver: 35,
  quarter: 20,
  rear: 20,
  sunroof: 20,
};

function tintColor(vlt) {
  if (vlt === 0) return "rgba(190,210,225,0.18)";
  const alpha = Math.min(0.88, Math.max(0.08, (100 - vlt) / 105));
  return `rgba(3, 12, 24, ${alpha})`;
}

function TintPreviewCar({ selection, activeWindow, setActiveWindow, view }) {
  const isRear = view === "rear";
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-100 via-zinc-100 to-slate-300 p-4 shadow-inner">
      <svg viewBox="0 0 840 390" className="w-full drop-shadow-xl" role="img" aria-label="Silver 2004 Infiniti G35 Coupe tint preview">
        <defs>
          <linearGradient id="silverPaint" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="30%" stopColor="#cbd5e1" />
            <stop offset="65%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="bodyShadow" x1="0" x2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.26" />
          </filter>
        </defs>

        <ellipse cx="420" cy="325" rx="330" ry="32" fill="rgba(15,23,42,.18)" />

        <motion.g animate={{ rotateY: isRear ? 8 : 0 }} transition={{ type: "spring", stiffness: 80 }} style={{ transformOrigin: "center" }}>
          <path d="M86 244 C92 203 121 171 166 150 C214 124 256 79 329 66 C416 50 516 62 598 112 C650 144 705 168 754 204 C775 219 785 244 775 267 L742 283 L126 284 C103 276 82 265 86 244 Z" fill="url(#silverPaint)" stroke="#64748b" strokeWidth="3" filter="url(#softShadow)" />
          <path d="M113 230 C205 202 526 202 744 225 C757 232 762 247 754 263 L123 263 C107 255 105 241 113 230 Z" fill="url(#bodyShadow)" opacity=".55" />
          <path d="M167 150 C223 102 264 71 333 63 C418 50 508 63 579 104 C541 96 471 89 397 90 C303 91 226 112 167 150 Z" fill="#e5e7eb" stroke="#94a3b8" strokeWidth="3" />

          {windows.map((w) => (
            <g key={w.key} onClick={() => setActiveWindow(w.key)} className="cursor-pointer">
              <path d={w.path} fill={tintColor(selection[w.key])} stroke={activeWindow === w.key ? "#f97316" : "#e2e8f0"} strokeWidth={activeWindow === w.key ? 5 : 2.5} />
              <path d={w.path} fill="url(#glassSheen)" opacity=".18" />
              {activeWindow === w.key && (
                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx={w.center[0]} cy={w.center[1]} r="12" fill="#f97316" />
              )}
            </g>
          ))}

          <path d="M145 124 C196 99 262 88 333 93" fill="none" stroke="#475569" strokeWidth="3" opacity=".45" />
          <path d="M422 141 L430 146" stroke="#475569" strokeWidth="4" opacity=".45" />
          <path d="M303 145 L300 236" stroke="#64748b" strokeWidth="3" opacity=".5" />
          <path d="M584 151 L612 239" stroke="#64748b" strokeWidth="3" opacity=".5" />
          <path d="M206 249 C268 238 522 237 704 252" fill="none" stroke="#f8fafc" strokeWidth="3" opacity=".55" />
          <path d="M98 229 C128 220 155 219 180 226" fill="none" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
          <path d="M707 226 C729 230 751 237 767 249" fill="none" stroke="#fef3c7" strokeWidth="8" strokeLinecap="round" />

          <g>
            <circle cx="230" cy="279" r="50" fill="#111827" />
            <circle cx="230" cy="279" r="31" fill="#475569" />
            <circle cx="230" cy="279" r="13" fill="#cbd5e1" />
            <circle cx="629" cy="279" r="50" fill="#111827" />
            <circle cx="629" cy="279" r="31" fill="#475569" />
            <circle cx="629" cy="279" r="13" fill="#cbd5e1" />
          </g>
        </motion.g>

        <defs>
          <linearGradient id="glassSheen" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity=".25" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
        <Car className="h-4 w-4" /> 2004 Infiniti G35 Coupe · Silver
      </div>
    </div>
  );
}

export default function App() {
  const [selection, setSelection] = useState(baseSelection);
  const [activeWindow, setActiveWindow] = useState("frontDriver");
  const [filmType, setFilmType] = useState("Ceramic");
  const [view, setView] = useState("side");

  const activeInfo = windows.find((w) => w.key === activeWindow);
  const selectedTint = tintOptions.find((t) => t.vlt === selection[activeWindow]);
  const filmInfo = filmTypes.find((f) => f.type === filmType);

  const darknessScore = useMemo(() => {
    const values = Object.values(selection);
    return Math.round(values.reduce((sum, v) => sum + (100 - v), 0) / values.length);
  }, [selection]);

  function setWindowTint(vlt) {
    setSelection((current) => ({ ...current, [activeWindow]: vlt }));
  }

  function applyAll(vlt) {
    setSelection(Object.fromEntries(windows.map((w) => [w.key, vlt])));
  }

  function reset() {
    setSelection(baseSelection);
    setFilmType("Ceramic");
    setActiveWindow("frontDriver");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <Badge className="bg-orange-500 text-white hover:bg-orange-500">Tint review website concept</Badge>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">G35 Coupe Tint Visualizer</h1>
              <p className="max-w-2xl text-slate-300">Click a window, choose the tint percentage, compare film types, and build a customer-ready tint package for a silver 2004 Infiniti G35 coupe.</p>
            </motion.div>

            <TintPreviewCar selection={selection} activeWindow={activeWindow} setActiveWindow={setActiveWindow} view={view} />

            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant={view === "side" ? "default" : "secondary"} onClick={() => setView("side")}>Side preview</Button>
              <Button variant={view === "rear" ? "default" : "secondary"} onClick={() => setView("rear")}>Angled preview</Button>
              <Button variant="outline" className="border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset demo</Button>
            </div>
          </div>

          <Card className="border-slate-800 bg-slate-900/95 text-slate-100 shadow-2xl">
            <CardContent className="space-y-5 p-5">
              <div>
                <p className="text-sm uppercase tracking-wide text-orange-400">Selected area</p>
                <h2 className="text-2xl font-bold">{activeInfo.label}</h2>
                <p className="text-sm text-slate-400">{activeInfo.short}</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold">Current shade</span>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white">{selectedTint.vlt}% VLT</span>
                </div>
                <Slider value={[selection[activeWindow]]} min={5} max={70} step={5} onValueChange={([value]) => setWindowTint(value)} />
                <p className="mt-3 text-sm text-slate-300">{selectedTint.name}: {selectedTint.look}. Privacy: {selectedTint.privacy}.</p>
              </div>

              <Tabs defaultValue="shades" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="shades">Shades</TabsTrigger>
                  <TabsTrigger value="film">Film</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="shades" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {tintOptions.map((tint) => (
                      <button key={tint.vlt} onClick={() => setWindowTint(tint.vlt)} className={`rounded-2xl border p-3 text-left transition hover:scale-[1.02] ${selection[activeWindow] === tint.vlt ? "border-orange-400 bg-orange-500/15" : "border-slate-700 bg-slate-800"}`}>
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full border border-white/20" style={{ background: tintColor(tint.vlt) }} />
                          <span className="font-bold">{tint.vlt}%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{tint.look}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" onClick={() => applyAll(35)}>Apply 35% all</Button>
                    <Button size="sm" onClick={() => applyAll(20)}>Apply 20% all</Button>
                    <Button size="sm" onClick={() => applyAll(5)}>Apply 5% all</Button>
                  </div>
                </TabsContent>

                <TabsContent value="film" className="mt-4 space-y-3">
                  {filmTypes.map((film) => (
                    <button key={film.type} onClick={() => setFilmType(film.type)} className={`w-full rounded-2xl border p-4 text-left transition ${filmType === film.type ? "border-orange-400 bg-orange-500/15" : "border-slate-700 bg-slate-800"}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">{film.type}</h3>
                        <span className="text-sm text-orange-300">{film.price}</span>
                      </div>
                      <p className="text-sm text-slate-300">{film.best}</p>
                      <p className="mt-1 text-xs text-slate-500">Heat rejection: {film.heat}</p>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="summary" className="mt-4 space-y-3">
                  <div className="grid gap-2">
                    {windows.map((w) => (
                      <button key={w.key} onClick={() => setActiveWindow(w.key)} className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-left hover:bg-slate-700">
                        <span>{w.label}</span>
                        <span className="font-bold text-orange-300">{selection[w.key]}%</span>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">
                    Package: <b className="text-white">{filmType}</b> film. Overall darkness score: <b className="text-white">{darknessScore}/100</b>.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900 text-slate-100"><CardContent className="p-5"><Sun className="mb-3 h-6 w-6 text-orange-400" /><h3 className="font-bold">VLT means visible light</h3><p className="mt-2 text-sm text-slate-400">Higher number = lighter tint. Lower number = darker tint and more privacy.</p></CardContent></Card>
          <Card className="border-slate-800 bg-slate-900 text-slate-100"><CardContent className="p-5"><ThermometerSun className="mb-3 h-6 w-6 text-orange-400" /><h3 className="font-bold">Ceramic is the premium upsell</h3><p className="mt-2 text-sm text-slate-400">It can reject more heat without needing the darkest shade.</p></CardContent></Card>
          <Card className="border-slate-800 bg-slate-900 text-slate-100"><CardContent className="p-5"><Shield className="mb-3 h-6 w-6 text-orange-400" /><h3 className="font-bold">Check local tint law</h3><p className="mt-2 text-sm text-slate-400">Use this for visual review first, then confirm legal limits before install.</p></CardContent></Card>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-2"><Eye className="h-5 w-5 text-orange-400" /><h2 className="text-2xl font-bold">All tint choices to show customers</h2></div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {tintOptions.map((t) => (
              <div key={t.vlt} className="rounded-2xl bg-slate-800 p-4">
                <div className="mb-3 h-16 rounded-xl border border-white/10" style={{ background: tintColor(t.vlt) }} />
                <h3 className="font-black">{t.vlt}% VLT</h3>
                <p className="text-sm text-slate-300">{t.name}</p>
                <p className="mt-2 text-xs text-slate-500">{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="pb-8 text-center text-sm text-slate-500">Demo concept for reviewing tint packages on a silver 2004 Infiniti G35 coupe.</footer>
      </div>
    </main>
  );
}
