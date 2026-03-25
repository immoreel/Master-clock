import { useState, useEffect } from "react";

const C = {
  bg: "#0c0e14",
  surface: "#141820",
  card: "#1a1e28",
  border: "#2a3040",
  accent: "#00e676",
  accent2: "#ffab00",
  red: "#ff5252",
  blue: "#448aff",
  text: "#e0e0e0",
  muted: "#707888",
  dim: "#404858",
};

const font = "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace";

const tabs = [
  { id: "overview", label: "OVERZICHT" },
  { id: "schematic", label: "SCHEMA" },
  { id: "bom", label: "STUKLIJST" },
  { id: "stripboard", label: "STRIPBOARD" },
  { id: "pinout", label: "PINOUT" },
];

// ─── OVERVIEW TAB ────────────────────────────────────
function Overview() {
  const blocks = [
    { x: 20, y: 10, w: 160, h: 60, label: "MIDI IN", sub: "6N137 + 2N3904 inverter", color: C.blue },
    { x: 220, y: 80, w: 180, h: 100, label: "ARDUINO NANO", sub: "ATmega328P", color: C.accent },
    { x: 20, y: 160, w: 160, h: 50, label: "ENCODER", sub: "EC11 + Drukknop", color: C.muted },
    { x: 20, y: 230, w: 160, h: 40, label: "TAP TEMPO", sub: "Tactile switch", color: C.muted },
    { x: 20, y: 290, w: 160, h: 40, label: "START / STOP", sub: "Tactile switch", color: C.muted },
    { x: 20, y: 350, w: 160, h: 50, label: "OLED DISPLAY", sub: "SSD1306 128×64 I2C", color: C.accent2 },
    { x: 20, y: 420, w: 160, h: 60, label: "CV IN ×2", sub: "3.5mm mono, 0-10V safe", color: C.accent },
    { x: 220, y: 200, w: 180, h: 50, label: "9V DC / USB", sub: "Barrel jack + 1N4001", color: C.red },
    { x: 460, y: 10, w: 170, h: 50, label: "MIDI OUT ×2", sub: "5-pin DIN", color: C.blue },
    { x: 460, y: 80, w: 170, h: 50, label: "CLK OUT ×4", sub: "3.5mm mono, 0-5V", color: C.accent },
    { x: 460, y: 150, w: 170, h: 50, label: "PO SYNC", sub: "3.5mm stereo, ~1V", color: C.accent2 },
    { x: 460, y: 220, w: 170, h: 50, label: "RESET / RUN", sub: "3.5mm mono, 0-5V", color: C.red },
  ];

  const arrows = [
    { x1: 180, y1: 40, x2: 220, y2: 110, c: C.blue },
    { x1: 180, y1: 185, x2: 220, y2: 130, c: C.muted },
    { x1: 180, y1: 250, x2: 220, y2: 140, c: C.muted },
    { x1: 180, y1: 310, x2: 220, y2: 150, c: C.muted },
    { x1: 180, y1: 375, x2: 220, y2: 160, c: C.accent2 },
    { x1: 180, y1: 450, x2: 220, y2: 170, c: C.accent },
    { x1: 400, y1: 100, x2: 460, y2: 35, c: C.blue },
    { x1: 400, y1: 120, x2: 460, y2: 105, c: C.accent },
    { x1: 400, y1: 140, x2: 460, y2: 175, c: C.accent2 },
    { x1: 400, y1: 160, x2: 460, y2: 245, c: C.red },
  ];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: 18, marginBottom: 8 }}>Blokdiagram</h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
        Signaalflow van inputs (links) → Arduino Nano → outputs (rechts)
      </p>
      <svg viewBox="0 0 650 500" style={{ width: "100%", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
        {arrows.map((a, i) => (
          <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={a.c} strokeWidth={1.5} opacity={0.5} markerEnd="url(#arrowhead)" />
        ))}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.muted} />
          </marker>
        </defs>
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill={C.card} stroke={b.color} strokeWidth={1.5} opacity={0.9} />
            <text x={b.x + b.w / 2} y={b.y + (b.h > 50 ? b.h / 2 - 6 : b.h / 2 - 2)} textAnchor="middle" fill={b.color} fontSize={12} fontFamily={font} fontWeight="bold">{b.label}</text>
            <text x={b.x + b.w / 2} y={b.y + (b.h > 50 ? b.h / 2 + 12 : b.h / 2 + 14)} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>{b.sub}</text>
          </g>
        ))}
      </svg>

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InfoCard title="Jouw Setup" color={C.accent}>
          <p><strong>MIDI Out 1 →</strong> MC-303 → (MIDI Thru) → Alpha Juno 1</p>
          <p><strong>MIDI Out 2 →</strong> Yamaha RX15</p>
          <p><strong>CLK Out 1-4 →</strong> Eurorack, Scrooge, Elmyra 2</p>
          <p><strong>PO Sync →</strong> Pocket Operators</p>
          <p><strong>CV In 1 →</strong> Tempo CV vanuit eurorack</p>
          <p><strong>CV In 2 →</strong> Swing / divisie CV</p>
        </InfoCard>
        <InfoCard title="Features" color={C.accent2}>
          <p>• BPM 20-300 via encoder</p>
          <p>• Tap tempo (gemiddelde van 4 taps)</p>
          <p>• Start/Stop met MIDI sync</p>
          <p>• Clock divisies: ÷1, ÷2, ÷4, ÷8</p>
          <p>• MIDI In = slave mode</p>
          <p>• CV In: BPM + modulatie (0-10V safe)</p>
          <p>• OLED toont BPM + status</p>
        </InfoCard>
      </div>
    </div>
  );
}

// ─── SCHEMATIC TAB ───────────────────────────────────
function Schematic() {
  const [section, setSection] = useState("midi_out");
  const sections = [
    { id: "midi_out", label: "MIDI Out" },
    { id: "midi_in", label: "MIDI In" },
    { id: "cv_in", label: "CV In" },
    { id: "clock_out", label: "Clock Outputs" },
    { id: "po_sync", label: "PO Sync" },
    { id: "ui", label: "Encoder + Buttons" },
    { id: "display", label: "OLED Display" },
    { id: "power", label: "Voeding" },
  ];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: 18, marginBottom: 12 }}>Schema per sectie</h2>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              background: section === s.id ? C.accent : C.card,
              color: section === s.id ? C.bg : C.text,
              border: `1px solid ${section === s.id ? C.accent : C.border}`,
              borderRadius: 4, padding: "6px 12px", cursor: "pointer",
              fontFamily: font, fontSize: 11, fontWeight: "bold",
            }}
          >{s.label}</button>
        ))}
      </div>
      <SchematicSection section={section} />
    </div>
  );
}

function SchematicSection({ section }) {
  const w = 640, h = 300;
  const svgStyle = { width: "100%", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` };

  if (section === "midi_out") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} ${h}`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">MIDI OUT ×2 (voor MC-303, RX15, Alpha Juno)</text>
          {/* Arduino TX pin */}
          <text x={30} y={70} fill={C.accent2} fontSize={11} fontFamily={font}>Arduino D1 (TX)</text>
          <line x1={160} y1={67} x2={200} y2={67} stroke={C.accent} strokeWidth={2} />

          {/* Branch to two outputs */}
          <line x1={200} y1={67} x2={200} y2={47} stroke={C.accent} strokeWidth={1.5} />
          <line x1={200} y1={67} x2={200} y2={167} stroke={C.accent} strokeWidth={1.5} />

          {/* MIDI OUT 1 */}
          <line x1={200} y1={47} x2={240} y2={47} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={240} y={47} label="220Ω" id="R1" />
          <line x1={300} y1={47} x2={400} y2={47} stroke={C.accent} strokeWidth={1.5} />
          <text x={410} y={51} fill={C.text} fontSize={10} fontFamily={font}>→ DIN pin 5</text>

          {/* 5V line for OUT 1 */}
          <text x={170} y={100} fill={C.red} fontSize={10} fontFamily={font}>5V</text>
          <line x1={195} y1={97} x2={240} y2={97} stroke={C.red} strokeWidth={1.5} />
          <Resistor x={240} y={97} label="220Ω" id="R2" color={C.red} />
          <line x1={300} y1={97} x2={400} y2={97} stroke={C.red} strokeWidth={1.5} />
          <text x={410} y={101} fill={C.text} fontSize={10} fontFamily={font}>→ DIN pin 4</text>

          <text x={410} y={131} fill={C.muted} fontSize={10} fontFamily={font}>DIN pin 2 → GND</text>

          {/* DIN connector symbol */}
          <circle cx={550} cy={80} r={35} fill="none" stroke={C.dim} strokeWidth={1.5} />
          <text x={550} y={85} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>MIDI</text>
          <text x={550} y={95} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>OUT 1</text>

          {/* MIDI OUT 2 - same circuit */}
          <line x1={200} y1={167} x2={240} y2={167} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={240} y={167} label="220Ω" id="R3" />
          <line x1={300} y1={167} x2={400} y2={167} stroke={C.accent} strokeWidth={1.5} />
          <text x={410} y={171} fill={C.text} fontSize={10} fontFamily={font}>→ DIN pin 5</text>

          <text x={170} y={220} fill={C.red} fontSize={10} fontFamily={font}>5V</text>
          <line x1={195} y1={217} x2={240} y2={217} stroke={C.red} strokeWidth={1.5} />
          <Resistor x={240} y={217} label="220Ω" id="R4" color={C.red} />
          <line x1={300} y1={217} x2={400} y2={217} stroke={C.red} strokeWidth={1.5} />
          <text x={410} y={221} fill={C.text} fontSize={10} fontFamily={font}>→ DIN pin 4</text>

          <text x={410} y={251} fill={C.muted} fontSize={10} fontFamily={font}>DIN pin 2 → GND</text>

          <circle cx={550} cy={200} r={35} fill="none" stroke={C.dim} strokeWidth={1.5} />
          <text x={550} y={205} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>MIDI</text>
          <text x={550} y={215} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>OUT 2</text>

          <text x={20} y={290} fill={C.muted} fontSize={10} fontFamily={font}>Tip: MC-303 MIDI Thru → Alpha Juno 1 (daisy chain)</text>
        </svg>
        <NoteBox>
          Elke MIDI output is een current-loop: de 220Ω weerstanden beperken de stroom tot ~5mA per output.
          De Arduino TX pin kan beide outputs direct aansturen (totaal ~10mA sink, binnen spec).
          DIN pin 2 = GND shield, pin 4 = +5V via 220Ω, pin 5 = data via 220Ω.
        </NoteBox>
      </div>
    );
  }

  if (section === "midi_in") {
    return (
      <div>
        <svg viewBox={`0 0 ${w + 120} 320`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">MIDI IN — 6N137 + 2N3904 inverter</text>

          {/* DIN connector */}
          <circle cx={60} cy={120} r={35} fill="none" stroke={C.dim} strokeWidth={1.5} />
          <text x={60} y={118} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>MIDI</text>
          <text x={60} y={128} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>IN</text>

          {/* Pin 4 line */}
          <text x={105} y={95} fill={C.text} fontSize={10} fontFamily={font}>pin 4</text>
          <line x1={140} y1={92} x2={170} y2={92} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={170} y={92} label="220Ω" id="R5" />
          <line x1={230} y1={92} x2={280} y2={92} stroke={C.accent} strokeWidth={1.5} />

          {/* Pin 5 line */}
          <text x={105} y={155} fill={C.text} fontSize={10} fontFamily={font}>pin 5</text>
          <line x1={140} y1={152} x2={280} y2={152} stroke={C.accent} strokeWidth={1.5} />

          {/* 6N137 box */}
          <rect x={280} y={70} width={120} height={110} rx={4} fill={C.card} stroke={C.blue} strokeWidth={1.5} />
          <text x={340} y={90} textAnchor="middle" fill={C.blue} fontSize={12} fontFamily={font} fontWeight="bold">6N137</text>
          <text x={290} y={110} fill={C.muted} fontSize={9} fontFamily={font}>2: LED+</text>
          <text x={290} y={130} fill={C.muted} fontSize={9} fontFamily={font}>3: LED−</text>
          <text x={290} y={168} fill={C.muted} fontSize={9} fontFamily={font}>5: GND</text>
          <text x={355} y={110} fill={C.muted} fontSize={9} fontFamily={font}>8: VCC</text>
          <text x={355} y={130} fill={C.muted} fontSize={9} fontFamily={font}>6: OUT</text>
          <text x={355} y={150} fill={C.accent2} fontSize={9} fontFamily={font}>7: EN→VCC</text>

          {/* Output side */}
          <line x1={400} y1={127} x2={430} y2={127} stroke={C.accent} strokeWidth={1.5} />

          {/* Pull-up resistor */}
          <line x1={430} y1={127} x2={430} y2={80} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={430} y={60} label="R6 10kΩ" id="R6" vertical />
          <text x={458} y={55} fill={C.red} fontSize={10} fontFamily={font}>5V</text>

          {/* Base resistor to Q1 */}
          <line x1={430} y1={127} x2={470} y2={127} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={470} y={127} label="R18 10kΩ" id="R18" />
          <line x1={530} y1={127} x2={545} y2={127} stroke={C.accent} strokeWidth={1.5} />

          {/* Q1 2N3904 transistor */}
          <rect x={545} y={92} width={50} height={70} rx={4} fill={C.card} stroke={C.accent} strokeWidth={1.5} />
          <text x={570} y={108} textAnchor="middle" fill={C.accent} fontSize={10} fontFamily={font} fontWeight="bold">Q1</text>
          <text x={570} y={120} textAnchor="middle" fill={C.muted} fontSize={8} fontFamily={font}>2N3904</text>
          <text x={550} y={137} fill={C.muted} fontSize={7} fontFamily={font}>B</text>
          <text x={575} y={90} fill={C.muted} fontSize={7} fontFamily={font}>C</text>
          <text x={575} y={170} fill={C.muted} fontSize={7} fontFamily={font}>E</text>

          {/* Collector → pull-up → 5V */}
          <line x1={570} y1={92} x2={570} y2={65} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={570} y={45} label="R19 10kΩ" id="R19" vertical />
          <text x={590} y={35} fill={C.red} fontSize={10} fontFamily={font}>5V</text>

          {/* Collector → Arduino RX */}
          <line x1={570} y1={80} x2={620} y2={80} stroke={C.accent} strokeWidth={2} />
          <text x={625} y={84} fill={C.accent2} fontSize={11} fontFamily={font}>→ Arduino D0 (RX)</text>

          {/* Emitter → GND */}
          <line x1={570} y1={162} x2={570} y2={180} stroke={C.muted} strokeWidth={1.5} />
          <text x={570} y={192} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>GND</text>

          {/* Protection diode */}
          <text x={245} y={75} fill={C.muted} fontSize={9} fontFamily={font}>1N4148</text>
          <line x1={260} y1={82} x2={260} y2={92} stroke={C.accent2} strokeWidth={1} />
          <line x1={260} y1={145} x2={260} y2={152} stroke={C.accent2} strokeWidth={1} />
          <text x={235} y={125} fill={C.accent2} fontSize={18}>↕</text>

          {/* VCC connection */}
          <line x1={400} y1={107} x2={420} y2={107} stroke={C.red} strokeWidth={1} />
          <line x1={420} y1={107} x2={420} y2={80} stroke={C.red} strokeWidth={1} />
          <text x={415} y={75} fill={C.red} fontSize={9} fontFamily={font}>5V</text>

          {/* Enable pin 7 to VCC */}
          <line x1={400} y1={147} x2={420} y2={147} stroke={C.red} strokeWidth={1} />
          <line x1={420} y1={147} x2={420} y2={110} stroke={C.red} strokeWidth={1} strokeDasharray="3,2" />

          {/* GND connections */}
          <text x={280} y={200} fill={C.muted} fontSize={9} fontFamily={font}>Pin 5 → GND</text>

          <text x={20} y={240} fill={C.muted} fontSize={10} fontFamily={font}>6N137 output is geïnverteerd → Q1 (2N3904) invertert terug → correct signaal op RX</text>
          <text x={20} y={258} fill={C.muted} fontSize={10} fontFamily={font}>Pin 7 (Enable) → VCC  |  1N4148: beschermt LED tegen omgekeerde spanning</text>
        </svg>
        <NoteBox>
          De 6N137 is sneller dan de 6N138 — prima voor MIDI. Maar de output is geïnverteerd!
          De Arduino UART verwacht idle=HIGH, maar de 6N137 geeft idle=LOW.
          
          OPLOSSING: een 2N3904 NPN transistor als inverter.
          6N137 pin 6 → R18 10kΩ → Q1 base. Q1 collector → R19 10kΩ pull-up naar 5V → Arduino RX.
          Q1 emitter → GND. Wanneer 6N137 output HIGH is, geleidt Q1 en trekt de collector LOW.
          Wanneer 6N137 output LOW is (idle), is Q1 uit en trekt R19 de lijn HIGH. Precies wat de UART wil.
          
          100nF ontkoppelcondensator tussen pin 8 (VCC) en pin 5 (GND) niet vergeten!
        </NoteBox>
      </div>
    );
  }

  if (section === "cv_in") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 340`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">CV INPUT ×2 (0-10V eurorack safe)</text>

          {[0, 1].map((ch) => {
            const y = 65 + ch * 150;
            const pin = ch === 0 ? "A0" : "A1";
            const label = ch === 0 ? "CV 1: BPM" : "CV 2: MOD (swing/divisie)";
            return (
              <g key={ch}>
                <text x={20} y={y - 10} fill={C.accent2} fontSize={11} fontFamily={font} fontWeight="bold">{label}</text>

                {/* Jack symbol */}
                <circle cx={50} cy={y + 30} r={12} fill="none" stroke={C.dim} strokeWidth={1.5} />
                <text x={50} y={y + 33} textAnchor="middle" fill={C.muted} fontSize={7} fontFamily={font}>3.5mm</text>

                {/* Input line */}
                <line x1={62} y1={y + 30} x2={100} y2={y + 30} stroke={C.accent} strokeWidth={2} />

                {/* R_in 100kΩ */}
                <Resistor x={100} y={y + 30} label="100kΩ" id={`Rcv${ch}a`} />

                {/* Junction point */}
                <line x1={160} y1={y + 30} x2={320} y2={y + 30} stroke={C.accent} strokeWidth={2} />
                <circle cx={250} cy={y + 30} r={3} fill={C.accent} />

                {/* R_gnd 100kΩ to GND */}
                <line x1={250} y1={y + 30} x2={250} y2={y + 55} stroke={C.accent} strokeWidth={1.5} />
                <Resistor x={230} y={y + 65} label="100kΩ" id={`Rcv${ch}b`} />
                <line x1={250} y1={y + 85} x2={250} y2={y + 100} stroke={C.muted} strokeWidth={1} />
                <text x={250} y={y + 112} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>GND</text>

                {/* D1: overvoltage clamp to 5V */}
                <line x1={300} y1={y + 30} x2={300} y2={y + 10} stroke={C.red} strokeWidth={1.5} />
                <text x={308} y={y + 7} fill={C.muted} fontSize={7} fontFamily={font}>D{ch * 2 + 1}: 1N4148</text>
                <line x1={295} y1={y + 10} x2={305} y2={y + 10} stroke={C.red} strokeWidth={2} />
                <polygon points={`295,${y + 10} 305,${y + 10} 300,${y + 3}`} fill="none" stroke={C.red} strokeWidth={1} />
                <line x1={300} y1={y + 3} x2={300} y2={y - 5} stroke={C.red} strokeWidth={1} />
                <text x={308} y={y - 3} fill={C.red} fontSize={8} fontFamily={font}>5V</text>

                {/* D2: negative clamp to GND */}
                <line x1={330} y1={y + 30} x2={330} y2={y + 50} stroke={C.accent2} strokeWidth={1.5} />
                <text x={338} y={y + 60} fill={C.muted} fontSize={7} fontFamily={font}>D{ch * 2 + 2}: 1N4148</text>
                <line x1={325} y1={y + 50} x2={335} y2={y + 50} stroke={C.accent2} strokeWidth={2} />
                <polygon points={`325,${y + 50} 335,${y + 50} 330,${y + 57}`} fill="none" stroke={C.accent2} strokeWidth={1} />
                <line x1={330} y1={y + 57} x2={330} y2={y + 68} stroke={C.muted} strokeWidth={1} />
                <text x={330} y={y + 80} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>GND</text>

                {/* To Arduino */}
                <text x={325} y={y + 24} fill={C.accent2} fontSize={10} fontFamily={font}>→ Arduino {pin}</text>
              </g>
            );
          })}

          <text x={20} y={325} fill={C.muted} fontSize={10} fontFamily={font}>Spanningsdeler 100k/100k: 10V → 5V, 5V → 2.5V. Dioden klemmen af op 0V en 5V.</text>
        </svg>
        <NoteBox>
          Het circuit beschermt de Arduino ADC (0-5V) tegen eurorack spanningen (-5V tot +10V).
          De 100kΩ/100kΩ spanningsdeler halveert de spanning: 0-10V wordt 0-5V op de ADC.
          De twee 1N4148 dioden klemmen het signaal af: D1 naar 5V (beschermt tegen overvoltage), D2 naar GND (beschermt tegen negatieve spanning).
          
          CV 1 (BPM): 0V = 40 BPM, 5V = 170 BPM, 10V = 300 BPM (lineair, instelbaar in software).
          CV 2 (MOD): instelbaar via menu — kan swing amount, clock divisie, of pulslengte aansturen.
          
          Eurorack LFO → CV In = tempo modulatie!
          Sequencer CV → CV In = getrapte tempo changes per stap.
        </NoteBox>
      </div>
    );
  }

  if (section === "clock_out") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 320`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">CLOCK OUTPUTS ×4 (Eurorack / Scrooge / Elmyra 2)</text>
          {[0, 1, 2, 3].map((i) => {
            const y = 60 + i * 60;
            const pins = ["D7", "D8", "D9", "D10"];
            const divs = ["÷1 (♩)", "÷2 (𝅗𝅥)", "÷4 (𝅝)", "÷8 / vrij"];
            return (
              <g key={i}>
                <text x={30} y={y + 4} fill={C.accent2} fontSize={11} fontFamily={font}>Arduino {pins[i]}</text>
                <line x1={145} y1={y} x2={185} y2={y} stroke={C.accent} strokeWidth={2} />
                <Resistor x={185} y={y} label="100Ω" id={`R${7 + i}`} />
                <line x1={245} y1={y} x2={380} y2={y} stroke={C.accent} strokeWidth={2} />

                {/* 3.5mm jack symbol */}
                <circle cx={400} cy={y} r={12} fill="none" stroke={C.dim} strokeWidth={1.5} />
                <line x1={388} y1={y} x2={394} y2={y} stroke={C.text} strokeWidth={1} />
                <text x={420} y={y + 4} fill={C.text} fontSize={10} fontFamily={font}>3.5mm mono — {divs[i]}</text>

                <text x={420} y={y + 18} fill={C.muted} fontSize={9} fontFamily={font}>sleeve → GND</text>
              </g>
            );
          })}

          <text x={20} y={310} fill={C.muted} fontSize={10} fontFamily={font}>Output: 0-5V pulsen. Compatibel met eurorack, Neutral Labs, Korg Volca/NTS-1.</text>
        </svg>
        <NoteBox>
          De 100Ω serieweerstand beschermt de Arduino-pin tegen kortsluiting.
          Output is 0-5V, wat geaccepteerd wordt door vrijwel alle eurorack modules.
          Divisies zijn in software instelbaar — output 4 kun je via het menu configureren.
          Pulslengte: ~10-20ms (instelbaar). Duty cycle 50% is ook een optie.
        </NoteBox>
      </div>
    );
  }

  if (section === "po_sync") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 260`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">POCKET OPERATOR SYNC OUTPUT</text>

          <text x={30} y={80} fill={C.accent2} fontSize={11} fontFamily={font}>Arduino D11</text>
          <line x1={145} y1={77} x2={185} y2={77} stroke={C.accent} strokeWidth={2} />
          <Resistor x={185} y={77} label="47kΩ" id="R11" />
          <line x1={245} y1={77} x2={320} y2={77} stroke={C.accent} strokeWidth={2} />

          {/* Junction point */}
          <circle cx={320} cy={77} r={3} fill={C.accent} />

          {/* To jack tip */}
          <line x1={320} y1={77} x2={420} y2={77} stroke={C.accent} strokeWidth={1.5} />
          <text x={430} y={81} fill={C.text} fontSize={10} fontFamily={font}>→ Tip (Left/Sync)</text>

          {/* Voltage divider to GND */}
          <line x1={320} y1={77} x2={320} y2={110} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={300} y={120} label="10kΩ" id="R12" />
          <line x1={320} y1={140} x2={320} y2={160} stroke={C.muted} strokeWidth={1.5} />
          <text x={310} y={175} fill={C.muted} fontSize={10} fontFamily={font}>GND</text>

          {/* Ring */}
          <text x={430} y={120} fill={C.muted} fontSize={10} fontFamily={font}>Ring (Right) = niet aangesloten</text>
          <text x={430} y={140} fill={C.muted} fontSize={10} fontFamily={font}>(of audio passthrough input)</text>

          {/* Sleeve */}
          <text x={430} y={170} fill={C.muted} fontSize={10} fontFamily={font}>Sleeve → GND</text>

          {/* Stereo jack symbol */}
          <rect x={530} y={60} width={60} height={50} rx={8} fill="none" stroke={C.accent2} strokeWidth={1.5} />
          <text x={560} y={82} textAnchor="middle" fill={C.accent2} fontSize={9} fontFamily={font}>3.5mm</text>
          <text x={560} y={97} textAnchor="middle" fill={C.accent2} fontSize={9} fontFamily={font}>STEREO</text>

          <text x={30} y={220} fill={C.muted} fontSize={10} fontFamily={font}>Spanningsdeler: 5V × 10k/(47k+10k) ≈ 0.88V amplitude</text>
          <text x={30} y={238} fill={C.muted} fontSize={10} fontFamily={font}>PO's verwachten een audio-level klik op het linkerkanaal (~1V)</text>
        </svg>
        <NoteBox>
          Pocket Operators gebruiken een stereo 3.5mm jack: links = sync, rechts = audio doorsluizen.
          De spanningsdeler brengt het 5V signaal terug naar ~0.9V, wat binnen het audio-bereik van de PO valt.
          SY-mode op de PO instellen op SY4 (volgt alleen sync, geen audio) of SY2 (sync + audio in).
        </NoteBox>
      </div>
    );
  }

  if (section === "ui") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 280`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">ENCODER + BUTTONS (alle met interne pull-up)</text>

          {/* Encoder */}
          <rect x={30} y={50} width={100} height={80} rx={4} fill={C.card} stroke={C.accent2} strokeWidth={1.5} />
          <text x={80} y={75} textAnchor="middle" fill={C.accent2} fontSize={11} fontFamily={font} fontWeight="bold">ENCODER</text>
          <text x={80} y={95} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>EC11 type</text>
          <text x={80} y={115} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>met drukknop</text>

          <line x1={130} y1={65} x2={250} y2={65} stroke={C.accent} strokeWidth={1.5} />
          <text x={260} y={69} fill={C.text} fontSize={10} fontFamily={font}>CLK → D2 (INPUT_PULLUP)</text>

          <line x1={130} y1={85} x2={250} y2={85} stroke={C.accent} strokeWidth={1.5} />
          <text x={260} y={89} fill={C.text} fontSize={10} fontFamily={font}>DT → D3 (INPUT_PULLUP)</text>

          <line x1={130} y1={105} x2={250} y2={105} stroke={C.accent} strokeWidth={1.5} />
          <text x={260} y={109} fill={C.text} fontSize={10} fontFamily={font}>SW → D4 (INPUT_PULLUP)</text>

          <line x1={130} y1={120} x2={250} y2={120} stroke={C.muted} strokeWidth={1} />
          <text x={260} y={124} fill={C.muted} fontSize={10} fontFamily={font}>GND → GND</text>

          {/* Tap Tempo */}
          <rect x={30} y={155} width={100} height={40} rx={4} fill={C.card} stroke={C.dim} strokeWidth={1.5} />
          <text x={80} y={180} textAnchor="middle" fill={C.text} fontSize={10} fontFamily={font}>TAP TEMPO</text>
          <line x1={130} y1={175} x2={250} y2={175} stroke={C.accent} strokeWidth={1.5} />
          <text x={260} y={179} fill={C.text} fontSize={10} fontFamily={font}>→ D5 (INPUT_PULLUP) + GND</text>

          {/* Start/Stop */}
          <rect x={30} y={210} width={100} height={40} rx={4} fill={C.card} stroke={C.dim} strokeWidth={1.5} />
          <text x={80} y={235} textAnchor="middle" fill={C.text} fontSize={10} fontFamily={font}>START/STOP</text>
          <line x1={130} y1={230} x2={250} y2={230} stroke={C.accent} strokeWidth={1.5} />
          <text x={260} y={234} fill={C.text} fontSize={10} fontFamily={font}>→ D6 (INPUT_PULLUP) + GND</text>

          <text x={30} y={275} fill={C.muted} fontSize={10} fontFamily={font}>Alle switches schakelen naar GND. Arduino interne pull-ups = geen externe weerstanden nodig.</text>
        </svg>
        <NoteBox>
          De encoder gebruikt interrupt-pins D2/D3 voor betrouwbare detectie bij hoge draaisnelheid.
          Buttons gebruiken INPUT_PULLUP — drukken verbindt de pin met GND, wat een LOW geeft.
          Software debounce: 50ms voor buttons, 2ms voor encoder. Geen hardware debounce nodig.
        </NoteBox>
      </div>
    );
  }

  if (section === "display") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 200`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">OLED DISPLAY (SSD1306 128×64, I2C)</text>

          <rect x={30} y={55} width={140} height={90} rx={4} fill={C.card} stroke={C.accent2} strokeWidth={1.5} />
          <rect x={45} y={68} width={110} height={55} rx={2} fill={C.bg} stroke={C.dim} strokeWidth={1} />
          <text x={100} y={90} textAnchor="middle" fill={C.accent} fontSize={14} fontFamily={font} fontWeight="bold">120 BPM</text>
          <text x={100} y={108} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily={font}>▶ RUNNING</text>

          <line x1={170} y1={75} x2={280} y2={75} stroke={C.accent} strokeWidth={1.5} />
          <text x={290} y={79} fill={C.text} fontSize={10} fontFamily={font}>SDA → A4</text>

          <line x1={170} y1={95} x2={280} y2={95} stroke={C.accent} strokeWidth={1.5} />
          <text x={290} y={99} fill={C.text} fontSize={10} fontFamily={font}>SCL → A5</text>

          <line x1={170} y1={115} x2={280} y2={115} stroke={C.red} strokeWidth={1.5} />
          <text x={290} y={119} fill={C.red} fontSize={10} fontFamily={font}>VCC → 5V (of 3.3V)</text>

          <line x1={170} y1={135} x2={280} y2={135} stroke={C.muted} strokeWidth={1.5} />
          <text x={290} y={139} fill={C.muted} fontSize={10} fontFamily={font}>GND → GND</text>

          <text x={290} y={175} fill={C.muted} fontSize={10} fontFamily={font}>I2C adres: 0x3C (standaard)</text>
        </svg>
        <NoteBox>
          SSD1306 OLED modules met 4 pins (VCC, GND, SDA, SCL) zijn het makkelijkst.
          Check of je module 5V of 3.3V nodig heeft — de meeste 4-pin modules hebben een ingebouwde regulator en accepteren beide.
          Library: Adafruit_SSD1306 + Adafruit_GFX voor Arduino.
        </NoteBox>
      </div>
    );
  }

  if (section === "power") {
    return (
      <div>
        <svg viewBox={`0 0 ${w} 280`} style={svgStyle}>
          <text x={20} y={25} fill={C.accent} fontSize={13} fontFamily={font} fontWeight="bold">VOEDING (9V DC adapter via barrel jack)</text>

          {/* Barrel jack symbol */}
          <rect x={30} y={55} width={70} height={50} rx={6} fill={C.card} stroke={C.accent2} strokeWidth={1.5} />
          <circle cx={65} cy={75} r={10} fill="none" stroke={C.dim} strokeWidth={1.5} />
          <circle cx={65} cy={75} r={3} fill={C.accent2} />
          <text x={65} y={120} textAnchor="middle" fill={C.accent2} fontSize={9} fontFamily={font}>2.1mm DC</text>
          <text x={65} y={132} textAnchor="middle" fill={C.accent2} fontSize={9} fontFamily={font}>Jack</text>

          {/* Center pin = + */}
          <text x={30} y={50} fill={C.muted} fontSize={8} fontFamily={font}>center +</text>

          {/* +9V line */}
          <line x1={100} y1={65} x2={140} y2={65} stroke={C.red} strokeWidth={2} />

          {/* 1N4001 protection diode */}
          <rect x={140} y={57} width={50} height={16} rx={2} fill="none" stroke={C.red} strokeWidth={1.5} />
          <text x={165} y={68} textAnchor="middle" fill={C.red} fontSize={8} fontFamily={font}>1N4001</text>
          <text x={165} y={50} textAnchor="middle" fill={C.muted} fontSize={7} fontFamily={font}>reverse polarity</text>
          <text x={165} y={42} textAnchor="middle" fill={C.muted} fontSize={7} fontFamily={font}>bescherming</text>

          <line x1={190} y1={65} x2={240} y2={65} stroke={C.red} strokeWidth={2} />

          {/* Junction */}
          <circle cx={240} cy={65} r={3} fill={C.red} />

          {/* C1: 100µF electrolytic */}
          <line x1={240} y1={65} x2={240} y2={90} stroke={C.red} strokeWidth={1.5} />
          <line x1={230} y1={95} x2={250} y2={95} stroke={C.accent2} strokeWidth={2} />
          <line x1={232} y1={102} x2={248} y2={102} stroke={C.accent2} strokeWidth={1.5} />
          <text x={260} y={100} fill={C.accent2} fontSize={8} fontFamily={font}>100µF 25V</text>
          <line x1={240} y1={107} x2={240} y2={125} stroke={C.muted} strokeWidth={1} />
          <text x={240} y={138} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>GND</text>

          {/* C2: 100nF ceramic */}
          <line x1={310} y1={65} x2={310} y2={90} stroke={C.red} strokeWidth={1.5} />
          <line x1={300} y1={95} x2={320} y2={95} stroke={C.accent2} strokeWidth={1.5} />
          <line x1={302} y1={102} x2={318} y2={102} stroke={C.accent2} strokeWidth={1.5} />
          <text x={330} y={100} fill={C.accent2} fontSize={8} fontFamily={font}>100nF</text>
          <line x1={310} y1={107} x2={310} y2={125} stroke={C.muted} strokeWidth={1} />
          <text x={310} y={138} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily={font}>GND</text>

          {/* To VIN */}
          <line x1={240} y1={65} x2={420} y2={65} stroke={C.red} strokeWidth={2} />
          <text x={430} y={69} fill={C.accent2} fontSize={11} fontFamily={font}>→ Arduino VIN</text>

          {/* GND line */}
          <line x1={100} y1={87} x2={420} y2={87} stroke={C.muted} strokeWidth={2} />
          <text x={430} y={91} fill={C.accent2} fontSize={11} fontFamily={font}>→ Arduino GND</text>

          {/* Power indicator LED (optional) */}
          <text x={20} y={175} fill={C.accent2} fontSize={11} fontFamily={font} fontWeight="bold">Optioneel: Power LED</text>
          <text x={20} y={195} fill={C.text} fontSize={10} fontFamily={font}>Arduino 5V pin</text>
          <line x1={140} y1={192} x2={180} y2={192} stroke={C.accent} strokeWidth={1.5} />
          <Resistor x={180} y={192} label="1kΩ" id="Rled" />
          <line x1={240} y1={192} x2={280} y2={192} stroke={C.accent} strokeWidth={1.5} />

          {/* LED symbol */}
          <polygon points="280,185 280,199 295,192" fill="none" stroke={C.accent} strokeWidth={1.5} />
          <line x1={295} y1={185} x2={295} y2={199} stroke={C.accent} strokeWidth={1.5} />
          <text x={305} y={196} fill={C.accent} fontSize={8} fontFamily={font}>LED</text>
          <text x={305} y={206} fill={C.muted} fontSize={7} fontFamily={font}>(groen)</text>

          <line x1={295} y1={192} x2={340} y2={192} stroke={C.muted} strokeWidth={1.5} />
          <text x={345} y={196} fill={C.muted} fontSize={10} fontFamily={font}>→ GND</text>

          <text x={20} y={240} fill={C.muted} fontSize={10} fontFamily={font}>Gebruik center-positive 9V DC adapter, min. 500mA.</text>
          <text x={20} y={258} fill={C.muted} fontSize={10} fontFamily={font}>USB voeding werkt ook (direct via micro-USB), maar niet beide tegelijk!</text>
        </svg>
        <NoteBox>
          De 1N4001 diode beschermt tegen omgekeerde polariteit — als je per ongeluk een center-negative adapter aansluit, gaat er niets kapot.
          De 100µF elco filtert spanningsrimpel van goedkope adapters, de 100nF keramisch vangt snelle ruis op.
          
          De Arduino Nano regulator (AMS1117) accepteert 7-12V op de VIN pin en maakt er 5V van.
          Bij 9V en ~80mA stroomverbruik wordt de regulator nauwelijks warm.
          
          Sluit NOOIT tegelijk USB en een DC adapter aan — dit kan de USB-poort van je computer beschadigen.
          
          Power LED is optioneel maar handig: een groene LED achter een 1kΩ weerstand op de 5V rail
          laat zien dat het apparaat aan staat.
        </NoteBox>
      </div>
    );
  }

  return null;
}

function Resistor({ x, y, label, id, color = C.accent, vertical = false }) {
  if (vertical) {
    return (
      <g>
        <rect x={x - 8} y={y - 15} width={16} height={30} rx={2} fill="none" stroke={color} strokeWidth={1.5} />
        <text x={x + 15} y={y + 4} fill={C.muted} fontSize={8} fontFamily={font}>{label}</text>
      </g>
    );
  }
  return (
    <g>
      <rect x={x} y={y - 8} width={60} height={16} rx={2} fill="none" stroke={color} strokeWidth={1.5} />
      <text x={x + 30} y={y + 4} textAnchor="middle" fill={C.muted} fontSize={8} fontFamily={font}>{label}</text>
    </g>
  );
}

// ─── BOM TAB ─────────────────────────────────────────
function BillOfMaterials() {
  const [checked, setChecked] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Load from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("bom-checked");
        if (result && result.value) {
          setChecked(JSON.parse(result.value));
        }
      } catch (e) {
        // Key doesn't exist yet, start fresh
      }
      setLoaded(true);
    })();
  }, []);

  // Save to persistent storage on change
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set("bom-checked", JSON.stringify(checked));
      } catch (e) {
        console.error("Storage save failed:", e);
      }
    })();
  }, [checked, loaded]);

  const parts = [
    { cat: "Microcontroller", items: [
      { part: "Arduino Nano", value: "ATmega328P", qty: 1, note: "Clone werkt prima. Headers meegeleverd." },
    ]},
    { cat: "Display", items: [
      { part: "OLED Display", value: "SSD1306 128×64 I2C", qty: 1, note: "4-pin variant (VCC, GND, SDA, SCL)" },
    ]},
    { cat: "Connectoren", items: [
      { part: "DIN 5-pin socket", value: "Female, panel mount", qty: 3, note: "2× MIDI Out, 1× MIDI In" },
      { part: "3.5mm mono jack", value: "Panel mount, PJ-301M", qty: 7, note: "4× clock out, 1× reset/run, 2× CV in" },
      { part: "3.5mm stereo jack", value: "Panel mount", qty: 1, note: "PO sync output" },
      { part: "DC barrel jack", value: "2.1mm, panel mount", qty: 1, note: "9V DC adapter ingang" },
    ]},
    { cat: "Halfgeleiders", items: [
      { part: "6N137", value: "High-speed optocoupler", qty: 1, note: "MIDI In galvanische scheiding (pin 7→VCC!)" },
      { part: "1N4148", value: "Signaaldiode", qty: 5, note: "1× MIDI In + 4× CV input bescherming" },
      { part: "1N4001", value: "Gelijkrichterdiode", qty: 1, note: "Omgekeerde polariteit bescherming voeding" },
      { part: "LED 3mm", value: "Groen", qty: 1, note: "Power indicator (optioneel)" },
      { part: "2N3904", value: "NPN transistor", qty: 1, note: "6N137 output inverter (je hebt ze al!)" },
    ]},
    { cat: "Weerstanden (1/4W)", items: [
      { part: "220Ω", value: "Koolfilm of metaalfilm", qty: 5, note: "MIDI circuits (4× out, 1× in)" },
      { part: "100Ω", value: "Koolfilm of metaalfilm", qty: 5, note: "Clock output bescherming" },
      { part: "10kΩ", value: "Koolfilm of metaalfilm", qty: 4, note: "6N137 pull-up + PO divider + Q1 base + Q1 collector" },
      { part: "47kΩ", value: "Koolfilm of metaalfilm", qty: 1, note: "PO sync spanningsdeler" },
      { part: "100kΩ", value: "Koolfilm of metaalfilm", qty: 4, note: "CV input spanningsdelers (2× per kanaal)" },
      { part: "1kΩ", value: "Koolfilm of metaalfilm", qty: 1, note: "Power LED voorschakelweerstand" },
    ]},
    { cat: "Condensatoren", items: [
      { part: "100nF", value: "Keramisch", qty: 3, note: "Ontkoppeling VCC (6N137 + Arduino + voeding)" },
      { part: "100µF 25V", value: "Elektrolytisch", qty: 1, note: "Voedingsfilter bij barrel jack" },
    ]},
    { cat: "Inputs", items: [
      { part: "Rotary Encoder", value: "EC11, met drukknop", qty: 1, note: "BPM instelling + menu" },
      { part: "Tactile switch", value: "6×6mm", qty: 2, note: "Tap tempo + Start/Stop" },
    ]},
    { cat: "Overig", items: [
      { part: "9V DC adapter", value: "Center-positive, 500mA+", qty: 1, note: "Standaard 2.1mm barrel, bijv. van een oude router" },
      { part: "Stripboard", value: "≥25×40 gaten", qty: 1, note: "Koper strips, 2.54mm raster" },
      { part: "Pin headers", value: "Female, 2×15 pin", qty: 1, note: "Socket voor Arduino Nano" },
      { part: "Draad", value: "Vertind koperdraad / hookup wire", qty: 1, note: "Diverse kleuren voor overzicht" },
      { part: "Behuizing", value: "Hammond 1590B of groter", qty: 1, note: "Aluminium, makkelijk te boren" },
      { part: "Knop", value: "Voor rotary encoder", qty: 1, note: "6mm as, geaard metaal of kunststof" },
      { part: "Afstandhouders", value: "M3 nylon", qty: 4, note: "Stripboard montage in behuizing" },
    ]},
  ];

  const allItems = parts.flatMap((cat, ci) => cat.items.map((_, ii) => `${ci}-${ii}`));
  const totalCount = allItems.length;
  const checkedCount = allItems.filter(k => checked[k]).length;
  const pct = Math.round((checkedCount / totalCount) * 100);

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: 18, marginBottom: 4 }}>Stuklijst (Bill of Materials)</h2>
      <p style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Alles is verkrijgbaar bij de bekende shops (Reichelt, Mouser, AliExpress, Banzai Music)</p>

      {/* Progress bar */}
      <div style={{ background: C.card, borderRadius: 8, padding: 12, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ color: C.text, fontSize: 13, fontFamily: font, fontWeight: "bold" }}>
            {checkedCount === totalCount ? "✓ Alles binnen!" : `${checkedCount} / ${totalCount} onderdelen`}
          </span>
          <span style={{ color: pct === 100 ? C.accent : C.accent2, fontSize: 13, fontFamily: font, fontWeight: "bold" }}>{pct}%</span>
          {checkedCount > 0 && (
            <button onClick={() => setChecked({})} style={{
              background: "transparent", border: `1px solid ${C.dim}`, borderRadius: 4,
              color: C.muted, fontSize: 10, fontFamily: font, padding: "3px 8px", cursor: "pointer",
              marginLeft: 8,
            }}>Reset</button>
          )}
        </div>
        <div style={{ background: C.bg, borderRadius: 4, height: 8, overflow: "hidden" }}>
          <div style={{
            background: pct === 100 ? C.accent : `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
            height: "100%", width: `${pct}%`, borderRadius: 4,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {parts.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: C.accent2, fontSize: 13, fontWeight: "bold", fontFamily: font }}>{cat.cat}</span>
            <span style={{ color: C.muted, fontSize: 10, fontFamily: font }}>
              {cat.items.filter((_, ii) => checked[`${ci}-${ii}`]).length}/{cat.items.length}
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: font }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ ...thStyle, width: "32px", textAlign: "center" }}></th>
                <th style={{ ...thStyle, width: "20%" }}>Onderdeel</th>
                <th style={{ ...thStyle, width: "20%" }}>Waarde</th>
                <th style={{ ...thStyle, width: "6%", textAlign: "center" }}>Qty</th>
                <th style={{ ...thStyle }}>Opmerking</th>
              </tr>
            </thead>
            <tbody>
              {cat.items.map((item, ii) => {
                const key = `${ci}-${ii}`;
                const done = checked[key];
                return (
                  <tr key={ii}
                    onClick={() => toggle(key)}
                    style={{
                      borderBottom: `1px solid ${C.border}22`,
                      cursor: "pointer",
                      opacity: done ? 0.45 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center", padding: "6px 4px" }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, display: "inline-flex",
                        alignItems: "center", justifyContent: "center",
                        border: `2px solid ${done ? C.accent : C.dim}`,
                        background: done ? C.accent : "transparent",
                        transition: "all 0.15s",
                      }}>
                        {done && <span style={{ color: C.bg, fontSize: 12, fontWeight: "bold", lineHeight: 1 }}>✓</span>}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textDecoration: done ? "line-through" : "none" }}>{item.part}</td>
                    <td style={{ ...tdStyle, color: C.muted, textDecoration: done ? "line-through" : "none" }}>{item.value}</td>
                    <td style={{ ...tdStyle, textAlign: "center", color: C.accent }}>{item.qty}</td>
                    <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <div style={{ background: C.card, borderRadius: 6, padding: 12, marginTop: 8, border: `1px solid ${C.border}` }}>
        <div style={{ color: C.accent2, fontSize: 12, fontWeight: "bold", marginBottom: 4, fontFamily: font }}>💡 Kostenschatting</div>
        <p style={{ color: C.muted, fontSize: 11, fontFamily: font, margin: 0 }}>
          Arduino Nano (clone): ~€4 · OLED: ~€3 · DIN sockets (3×): ~€3 · 3.5mm jacks (8×): ~€8 · DC jack + adapter: ~€5 · 6N137: ~€1 · Weerstanden + diodes + LED: ~€4 · Condensatoren: ~€1 · Encoder: ~€2 · Stripboard + behuizing: ~€10 · Buttons + draad + headers: ~€4.
          <br />Totaal: <span style={{ color: C.accent }}>~€42-48</span> (bij AliExpress/budget shops) tot <span style={{ color: C.accent }}>~€65-75</span> (bij Reichelt/Mouser)
        </p>
      </div>
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "6px 8px", color: C.muted, fontWeight: "normal", fontSize: 10 };
const tdStyle = { padding: "6px 8px", color: C.text };

// ─── STRIPBOARD TAB ──────────────────────────────────
function Stripboard() {
  const [view, setView] = useState("grid");
  const [showComps, setShowComps] = useState(true);
  const [showCuts, setShowCuts] = useState(true);
  const [showWires, setShowWires] = useState(true);
  const [showArduino, setShowArduino] = useState(true);
  const cell = 14;
  const COLS = 37;
  const ROWS = 30;
  const pad = 75;

  // ── Arduino pin mapping (row: leftPin, rightPin) ──
  // Arduino left pins at col 8, right pins at col 15 (7 apart = 0.6")
  const nanoTop = 3;  // first pin row
  const nanoL = 8;    // left pin column
  const nanoR = 15;   // right pin column
  const nanoPins = [
    { l: "D1/TX", r: "D13" },
    { l: "D0/RX", r: "3V3" },
    { l: "RST",   r: "AREF" },
    { l: "GND",   r: "A0" },
    { l: "D2",    r: "A1" },
    { l: "D3",    r: "A2" },
    { l: "D4",    r: "A3" },
    { l: "D5",    r: "A4/SDA" },
    { l: "D6",    r: "A5/SCL" },
    { l: "D7",    r: "A6" },
    { l: "D8",    r: "A7" },
    { l: "D9",    r: "5V" },
    { l: "D10",   r: "RST2" },
    { l: "D11",   r: "GND2" },
    { l: "D12",   r: "VIN" },
  ];

  // ── Strip cuts ──
  const cuts = [
    // Under Arduino: separate left/right pins
    ...Array.from({ length: 15 }, (_, i) => ({ r: nanoTop + i, c: 11 })),
    ...Array.from({ length: 15 }, (_, i) => ({ r: nanoTop + i, c: 12 })),
    // MIDI Out: isolate R1/R2 outputs from R3/R4
    { r: 3, c: 24 },   // TX strip: separate MIDI OUT 1 from 2
    { r: 14, c: 24 },  // 5V row: separate MIDI OUT 1 from 2 (for pin4 resistors)
    // PO Sync: isolate divider junction from output
    { r: 16, c: 27 },
    // 6N137 pin separation
    { r: 20, c: 3 }, { r: 21, c: 3 }, { r: 22, c: 3 }, { r: 23, c: 3 },
    { r: 20, c: 8 }, { r: 21, c: 8 }, { r: 22, c: 8 }, { r: 23, c: 8 },
    // CV input: isolate divider junction
    { r: 26, c: 18 }, { r: 27, c: 18 },
    // Power: isolate barrel jack side from VIN
    { r: 29, c: 18 },
  ];

  // ── Components on board ──
  // Each: { type, row, c1, c2, label, color, note }
  const comps = [
    // MIDI Out resistors (from TX=row3 and 5V=row14)
    { type: "R", r: 3,  c1: 17, c2: 21, label: "R1 220Ω", color: C.blue, note: "TX → MIDI OUT 1 pin 5" },
    { type: "R", r: 3,  c1: 25, c2: 29, label: "R3 220Ω", color: C.blue, note: "TX → MIDI OUT 2 pin 5" },
    { type: "R", r: 14, c1: 17, c2: 21, label: "R2 220Ω", color: C.blue, note: "5V → MIDI OUT 1 pin 4" },
    { type: "R", r: 14, c1: 25, c2: 29, label: "R4 220Ω", color: C.blue, note: "5V → MIDI OUT 2 pin 4" },
    // MIDI In resistor
    { type: "R", r: 19, c1: 2, c2: 6, label: "R5 220Ω", color: C.blue, note: "DIN pin 4 → 6N137 pin 2" },
    // 6N137 optocoupler
    { type: "IC", r: 20, c1: 3, c2: 8, label: "6N137", color: C.blue, note: "Pin 1(top-left) at r20,c3" },
    // 6N137 pull-up
    { type: "R", r: 22, c1: 9, c2: 13, label: "R6 10kΩ", color: C.blue, note: "Pin 6 (out) pull-up → 5V" },
    // 2N3904 inverter (between 6N137 and Arduino RX)
    { type: "R", r: 24, c1: 9, c2: 13, label: "R18 10kΩ", color: C.blue, note: "6N137 pin 6 → Q1 base" },
    { type: "IC", r: 24, c1: 14, c2: 16, label: "Q1 2N3904", color: C.blue, note: "E=GND(r25) B=R18(r24) C=R19(r25)" },
    { type: "R", r: 25, c1: 17, c2: 21, label: "R19 10kΩ", color: C.blue, note: "Q1 collector pull-up → 5V" },
    // 6N137 decoupling cap
    { type: "C", r: 23, c1: 9, c2: 10, label: "C1 100nF", color: C.accent2, note: "Pin 8 (VCC) → pin 5 (GND)" },
    // 1N4148 MIDI In protection
    { type: "D", r: 19, c1: 7, c2: 8, label: "D5 1N4148", color: C.red, note: "Across 6N137 LED pins" },
    // Clock output resistors
    { type: "R", r: 12, c1: 17, c2: 21, label: "R7 100Ω", color: C.accent, note: "D7 → CLK OUT 1" },
    { type: "R", r: 13, c1: 17, c2: 21, label: "R8 100Ω", color: C.accent, note: "D8 → CLK OUT 2" },
    { type: "R", r: 9, c1: 17, c2: 21, label: "R9 100Ω", color: C.accent, note: "D9 → CLK OUT 3 (via wire from D9 row)" },
    { type: "R", r: 15, c1: 17, c2: 21, label: "R10 100Ω", color: C.accent, note: "D10 → CLK OUT 4" },
    // Reset/Run output resistor
    { type: "R", r: 17, c1: 17, c2: 21, label: "R15 100Ω", color: C.red, note: "D12 → RESET/RUN" },
    // PO Sync voltage divider
    { type: "R", r: 16, c1: 17, c2: 23, label: "R11 47kΩ", color: C.accent2, note: "D11 → PO junction" },
    { type: "R", r: 16, c1: 28, c2: 32, label: "R12 10kΩ", color: C.accent2, note: "PO junction → GND" },
    // CV Input 1 (connected to A0=row 6 right side)
    { type: "R", r: 26, c1: 2, c2: 8, label: "R13 100kΩ", color: C.accent, note: "CV1 jack → divider" },
    { type: "R", r: 26, c1: 19, c2: 25, label: "R14 100kΩ", color: C.accent, note: "CV1 divider → GND" },
    { type: "D", r: 26, c1: 13, c2: 15, label: "D1 1N4148", color: C.red, note: "CV1 clamp → 5V" },
    { type: "D", r: 26, c1: 15, c2: 17, label: "D2 1N4148", color: C.red, note: "CV1 clamp → GND" },
    // CV Input 2 (connected to A1=row 7 right side)
    { type: "R", r: 27, c1: 2, c2: 8, label: "R15 100kΩ", color: C.accent, note: "CV2 jack → divider" },
    { type: "R", r: 27, c1: 19, c2: 25, label: "R16 100kΩ", color: C.accent, note: "CV2 divider → GND" },
    { type: "D", r: 27, c1: 13, c2: 15, label: "D3 1N4148", color: C.red, note: "CV2 clamp → 5V" },
    { type: "D", r: 27, c1: 15, c2: 17, label: "D4 1N4148", color: C.red, note: "CV2 clamp → GND" },
    // Power input
    { type: "D", r: 29, c1: 19, c2: 22, label: "D6 1N4001", color: C.red, note: "Barrel+ → VIN (reverse protect)" },
    { type: "C", r: 29, c1: 23, c2: 25, label: "C2 100µF", color: C.accent2, note: "VIN filtered → GND" },
    { type: "C", r: 29, c1: 26, c2: 27, label: "C3 100nF", color: C.accent2, note: "VIN filtered → GND" },
    // Power LED
    { type: "R", r: 1, c1: 28, c2: 32, label: "R17 1kΩ", color: C.accent, note: "5V → LED → GND" },
  ];

  // ── Wire jumpers (underside of board) ──
  const wires = [
    // Power buses
    { r1: 14, c1: 16, r2: 0, c2: 16, color: C.red, label: "Arduino 5V → 5V bus" },
    { r1: 0, c1: 26, r2: 14, c2: 26, color: C.red, label: "5V bus → R4 (MIDI OUT 2)" },
    { r1: 6, c1: 7, r2: 1, c2: 7, color: C.muted, label: "Arduino GND → GND bus" },
    { r1: 17, c1: 16, r2: 1, c2: 17, color: C.muted, label: "Arduino GND2 → GND bus" },
    // Power input
    { r1: 29, c1: 23, r2: 17, c2: 16, color: C.red, label: "Power VIN → Arduino VIN" },
    { r1: 29, c1: 25, r2: 1, c2: 25, color: C.muted, label: "Power GND → GND bus" },
    // MIDI — through 2N3904 inverter
    { r1: 22, c1: 9, r2: 24, c2: 9, color: C.blue, label: "6N137 out → Q1 base R" },
    { r1: 25, c1: 16, r2: 4, c2: 7, color: C.blue, label: "Q1 collector → RX (D0)" },
    { r1: 25, c1: 21, r2: 0, c2: 21, color: C.red, label: "R19 pull-up → 5V bus" },
    { r1: 25, c1: 14, r2: 1, c2: 14, color: C.muted, label: "Q1 emitter → GND bus" },
    { r1: 3, c1: 16, r2: 3, c2: 25, color: C.blue, label: "TX bridge over cuts" },
    // Left pin → right side bridges (under board, over Arduino)
    { r1: 9, c1: 7, r2: 9, c2: 16, color: C.accent, label: "D9 bridge → R9 (CLK3)" },
    { r1: 12, c1: 7, r2: 12, c2: 16, color: C.accent, label: "D7 bridge → R7 (CLK1)" },
    { r1: 13, c1: 7, r2: 13, c2: 16, color: C.accent, label: "D8 bridge → R8 (CLK2)" },
    { r1: 15, c1: 7, r2: 15, c2: 16, color: C.accent, label: "D10 bridge → R10 (CLK4)" },
    { r1: 16, c1: 7, r2: 16, c2: 16, color: C.accent2, label: "D11 bridge → R11 (PO)" },
    { r1: 17, c1: 7, r2: 17, c2: 16, color: C.red, label: "D12 bridge → R15 (RUN)" },
    // CV inputs
    { r1: 26, c1: 12, r2: 6, c2: 16, color: C.accent, label: "CV1 junction → A0" },
    { r1: 27, c1: 12, r2: 7, c2: 16, color: C.accent, label: "CV2 junction → A1" },
    { r1: 26, c1: 19, r2: 1, c2: 19, color: C.muted, label: "CV1 R_gnd → GND bus" },
    { r1: 27, c1: 19, r2: 1, c2: 20, color: C.muted, label: "CV2 R_gnd → GND bus" },
    // OLED (I2C)
    { r1: 10, c1: 16, r2: 0, c2: 22, color: C.accent2, label: "A4/SDA → OLED header" },
    { r1: 11, c1: 16, r2: 0, c2: 23, color: C.accent2, label: "A5/SCL → OLED header" },
  ];

  // ── Edge connections (wires to panel-mount parts) ──
  const edges = [
    // Right side outputs
    { r: 3, side: "R", label: "MIDI OUT 1 (pin5)", color: C.blue },
    { r: 14, side: "R", label: "MIDI OUT 1 (pin4)", color: C.blue },
    { r: 9, side: "R", label: "CLK 3 (÷4)", color: C.accent },
    { r: 12, side: "R", label: "CLK 1 (÷1)", color: C.accent },
    { r: 13, side: "R", label: "CLK 2 (÷2)", color: C.accent },
    { r: 15, side: "R", label: "CLK 4 (instelbaar)", color: C.accent },
    { r: 16, side: "R", label: "PO SYNC (tip)", color: C.accent2 },
    { r: 17, side: "R", label: "RESET/RUN", color: C.red },
    // Left side inputs
    { r: 19, side: "L", label: "MIDI IN (pin4)", color: C.blue },
    { r: 20, side: "L", label: "MIDI IN (pin5)", color: C.blue },
    { r: 26, side: "L", label: "CV IN 1 jack", color: C.accent },
    { r: 27, side: "L", label: "CV IN 2 jack", color: C.accent },
    { r: 29, side: "L", label: "DC JACK (+)", color: C.red },
    { r: 29, side: "L2", label: "DC JACK (−) → GND", color: C.muted },
  ];

  const layerBtn = (label, active, toggle, color) => (
    <button onClick={toggle} style={{
      background: active ? color + "33" : C.card,
      color: active ? color : C.dim,
      border: `1px solid ${active ? color : C.border}`,
      borderRadius: 4, padding: "4px 10px", cursor: "pointer",
      fontFamily: font, fontSize: 10, fontWeight: "bold",
      opacity: active ? 1 : 0.5,
    }}>{active ? "●" : "○"} {label}</button>
  );

  const gridView = (
    <div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ color: C.muted, fontSize: 10, fontFamily: font, lineHeight: "28px", marginRight: 4 }}>Lagen:</span>
        {layerBtn("Componenten", showComps, () => setShowComps(!showComps), C.accent2)}
        {layerBtn("Arduino", showArduino, () => setShowArduino(!showArduino), C.accent)}
        {layerBtn("Cuts", showCuts, () => setShowCuts(!showCuts), C.red)}
        {layerBtn("Draden", showWires, () => setShowWires(!showWires), C.blue)}
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 16 }}>
      <svg
        viewBox={`0 0 ${COLS * cell + pad * 2 + 100} ${ROWS * cell + pad * 2 + 10}`}
        style={{ minWidth: 700, background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}
      >
        {/* Column numbers */}
        {Array.from({ length: COLS }, (_, c) => (
          <text key={`cn${c}`} x={pad + c * cell + cell / 2} y={pad - 6}
            textAnchor="middle" fill={C.dim} fontSize={6} fontFamily={font}>{c + 1}</text>
        ))}
        {/* Row numbers */}
        {Array.from({ length: ROWS }, (_, r) => (
          <text key={`rn${r}`} x={pad - 8} y={pad + r * cell + cell / 2 + 2}
            textAnchor="middle" fill={C.dim} fontSize={6} fontFamily={font}>{r + 1}</text>
        ))}

        {/* Copper strips */}
        {Array.from({ length: ROWS }, (_, r) => (
          <line key={`s${r}`}
            x1={pad} y1={pad + r * cell + cell / 2}
            x2={pad + COLS * cell} y2={pad + r * cell + cell / 2}
            stroke="#8B6914" strokeWidth={cell - 3} opacity={0.12} />
        ))}

        {/* Power bus highlighting */}
        <line x1={pad} y1={pad + 0 * cell + cell / 2} x2={pad + COLS * cell} y2={pad + 0 * cell + cell / 2}
          stroke={C.red} strokeWidth={cell - 3} opacity={0.15} />
        <line x1={pad} y1={pad + 1 * cell + cell / 2} x2={pad + COLS * cell} y2={pad + 1 * cell + cell / 2}
          stroke={C.muted} strokeWidth={cell - 3} opacity={0.15} />
        <text x={pad + 2} y={pad + cell / 2 + 3} fill={C.red} fontSize={7} fontFamily={font} fontWeight="bold">+5V</text>
        <text x={pad + 2} y={pad + cell + cell / 2 + 3} fill={C.muted} fontSize={7} fontFamily={font} fontWeight="bold">GND</text>

        {/* Holes */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => (
            <circle key={`h${r}-${c}`}
              cx={pad + c * cell + cell / 2} cy={pad + r * cell + cell / 2}
              r={1.5} fill={C.dim} opacity={0.3} />
          ))
        )}

        {/* Strip cuts */}
        {showCuts && cuts.map((cut, i) => (
          <g key={`cut${i}`}>
            <line x1={pad + cut.c * cell + cell / 2 - 3} y1={pad + cut.r * cell + cell / 2 - 3}
              x2={pad + cut.c * cell + cell / 2 + 3} y2={pad + cut.r * cell + cell / 2 + 3}
              stroke={C.red} strokeWidth={1.5} />
            <line x1={pad + cut.c * cell + cell / 2 + 3} y1={pad + cut.r * cell + cell / 2 - 3}
              x2={pad + cut.c * cell + cell / 2 - 3} y2={pad + cut.r * cell + cell / 2 + 3}
              stroke={C.red} strokeWidth={1.5} />
          </g>
        ))}

        {/* Arduino Nano */}
        {showArduino && <>
        <rect
          x={pad + nanoL * cell - 1} y={pad + nanoTop * cell - 1}
          width={(nanoR - nanoL + 1) * cell + 2} height={15 * cell + 2}
          rx={3} fill={C.card} stroke={C.accent} strokeWidth={2} opacity={0.95}
        />
        <text x={pad + (nanoL + (nanoR - nanoL) / 2) * cell + cell / 2} y={pad + (nanoTop + 5) * cell}
          textAnchor="middle" fill={C.accent} fontSize={8} fontFamily={font} fontWeight="bold">ARDUINO</text>
        <text x={pad + (nanoL + (nanoR - nanoL) / 2) * cell + cell / 2} y={pad + (nanoTop + 6.5) * cell}
          textAnchor="middle" fill={C.accent} fontSize={8} fontFamily={font} fontWeight="bold">NANO</text>
        {/* USB end indicator */}
        <rect x={pad + (nanoL + 2) * cell} y={pad + nanoTop * cell - 4}
          width={4 * cell} height={5} rx={1} fill={C.dim} opacity={0.5} />
        <text x={pad + (nanoL + 4) * cell} y={pad + nanoTop * cell - 6}
          textAnchor="middle" fill={C.dim} fontSize={5} fontFamily={font}>USB</text>

        {/* Arduino pin labels */}
        {nanoPins.map((pin, i) => (
          <g key={`ap${i}`}>
            {/* Left pin dot */}
            <circle cx={pad + nanoL * cell + cell / 2} cy={pad + (nanoTop + i) * cell + cell / 2}
              r={2.5} fill={C.accent} />
            <text x={pad + nanoL * cell - 2} y={pad + (nanoTop + i) * cell + cell / 2 + 2}
              textAnchor="end" fill={C.accent2} fontSize={5} fontFamily={font}>{pin.l}</text>
            {/* Right pin dot */}
            <circle cx={pad + nanoR * cell + cell / 2} cy={pad + (nanoTop + i) * cell + cell / 2}
              r={2.5} fill={C.accent} />
            <text x={pad + (nanoR + 1) * cell + 2} y={pad + (nanoTop + i) * cell + cell / 2 + 2}
              textAnchor="start" fill={C.accent2} fontSize={5} fontFamily={font}>{pin.r}</text>
          </g>
        ))}
        </>}

        {/* Components */}
        {showComps && comps.map((comp, i) => {
          const x1 = pad + comp.c1 * cell + 2;
          const y = pad + comp.r * cell + cell / 2;
          const w = (comp.c2 - comp.c1) * cell - 4;

          if (comp.type === "IC") {
            // DIP IC
            const h = 4 * cell;
            return (
              <g key={`comp${i}`}>
                <rect x={pad + comp.c1 * cell} y={pad + comp.r * cell}
                  width={(comp.c2 - comp.c1) * cell} height={h}
                  rx={2} fill={C.card} stroke={comp.color} strokeWidth={1.5} />
                <text x={pad + (comp.c1 + (comp.c2 - comp.c1) / 2) * cell}
                  y={pad + comp.r * cell + h / 2 + 3}
                  textAnchor="middle" fill={comp.color} fontSize={7} fontFamily={font} fontWeight="bold">
                  {comp.label}
                </text>
                {/* Notch */}
                <circle cx={pad + comp.c1 * cell + 6} cy={pad + comp.r * cell + 6}
                  r={2} fill="none" stroke={comp.color} strokeWidth={0.8} />
              </g>
            );
          }

          // Resistors, caps, diodes
          const colors = { R: comp.color, C: C.accent2, D: C.red };
          const bgColor = comp.type === "D" ? `${C.red}22` : "none";
          return (
            <g key={`comp${i}`}>
              <rect x={x1} y={y - 4} width={w} height={8}
                rx={comp.type === "C" ? 1 : 2}
                fill={bgColor} stroke={colors[comp.type] || comp.color} strokeWidth={1.2} />
              <text x={x1 + w / 2} y={y + 2.5}
                textAnchor="middle" fill={colors[comp.type] || comp.color}
                fontSize={5} fontFamily={font}>{comp.label}</text>
            </g>
          );
        })}

        {/* Wire jumpers (shown as curved dashed lines) */}
        {showWires && wires.map((w, i) => {
          const x1 = pad + w.c1 * cell + cell / 2;
          const y1 = pad + w.r1 * cell + cell / 2;
          const x2 = pad + w.c2 * cell + cell / 2;
          const y2 = pad + w.r2 * cell + cell / 2;
          return (
            <g key={`wire${i}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={w.color} strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />
              <circle cx={x1} cy={y1} r={2} fill={w.color} opacity={0.6} />
              <circle cx={x2} cy={y2} r={2} fill={w.color} opacity={0.6} />
            </g>
          );
        })}

        {/* Edge connection labels */}
        {edges.filter(e => e.side === "R").map((e, i) => (
          <text key={`er${i}`}
            x={pad + COLS * cell + 6} y={pad + e.r * cell + cell / 2 + 2}
            fill={e.color} fontSize={6} fontFamily={font}>→ {e.label}</text>
        ))}
        {edges.filter(e => e.side === "L").map((e, i) => (
          <text key={`el${i}`}
            x={pad - 10} y={pad + e.r * cell + cell / 2 + 2}
            textAnchor="end" fill={e.color} fontSize={6} fontFamily={font}>{e.label} ←</text>
        ))}

        {/* Legend */}
        <g transform={`translate(${pad}, ${pad + ROWS * cell + 8})`}>
          <text x={0} y={0} fill={C.muted} fontSize={6} fontFamily={font}>
            Bovenaanzicht (componentzijde) — strips lopen horizontaal aan onderzijde — ✕ = strip doorsnijden — stippellijn = draad aan onderzijde
          </text>
        </g>
      </svg>
    </div>
    </div>
  );

  const tableView = (
    <div>
      <h3 style={{ color: C.accent, fontSize: 14, marginBottom: 8 }}>Componentplaatsing</h3>
      <p style={{ color: C.muted, fontSize: 11, marginBottom: 12 }}>Rij- en kolomnummers komen overeen met het grid hierboven.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: font }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            <th style={{ ...thStyle, width: "20%" }}>Component</th>
            <th style={{ ...thStyle, width: "15%" }}>Rij</th>
            <th style={{ ...thStyle, width: "15%" }}>Kolom</th>
            <th style={{ ...thStyle }}>Verbinding</th>
          </tr>
        </thead>
        <tbody>
          {comps.map((comp, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
              <td style={{ ...tdStyle, color: comp.color, fontWeight: "bold" }}>{comp.label}</td>
              <td style={{ ...tdStyle, color: C.muted }}>{comp.r + 1}</td>
              <td style={{ ...tdStyle, color: C.muted }}>{comp.c1 + 1} → {comp.c2 + 1}</td>
              <td style={{ ...tdStyle, color: C.muted, fontSize: 10 }}>{comp.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: C.accent2, fontSize: 14, marginTop: 16, marginBottom: 8 }}>Draadbruggen (onderzijde)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: font }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            <th style={thStyle}>Draad</th>
            <th style={thStyle}>Van (rij, kol)</th>
            <th style={thStyle}>Naar (rij, kol)</th>
          </tr>
        </thead>
        <tbody>
          {wires.map((w, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
              <td style={{ ...tdStyle, color: w.color }}>{w.label}</td>
              <td style={{ ...tdStyle, color: C.muted }}>rij {w.r1 + 1}, kol {w.c1 + 1}</td>
              <td style={{ ...tdStyle, color: C.muted }}>rij {w.r2 + 1}, kol {w.c2 + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: C.red, fontSize: 14, marginTop: 16, marginBottom: 8 }}>Strip doorsnijdingen</h3>
      <p style={{ color: C.muted, fontSize: 11 }}>
        Gebruik een 3mm boor of stanleymes om de koperbaan door te snijden op deze posities (aan de koperzijde/onderkant):
      </p>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: font, lineHeight: 1.8, marginTop: 8 }}>
        <span style={{ color: C.accent }}>Onder Arduino:</span> rij 4-18, kol 12 en 13 (30 cuts){" · "}
        <span style={{ color: C.blue }}>MIDI Out:</span> rij 4 kol 25, rij 15 kol 25{" · "}
        <span style={{ color: C.accent2 }}>PO Sync:</span> rij 17 kol 28{" · "}
        <span style={{ color: C.blue }}>6N137:</span> rij 21-24 kol 4 en 9 (8 cuts){" · "}
        <span style={{ color: C.accent }}>CV:</span> rij 27-28 kol 19{" · "}
        <span style={{ color: C.red }}>Power:</span> rij 30 kol 19
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: 18, marginBottom: 8 }}>Stripboard Layout</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[{ id: "grid", label: "GRID" }, { id: "table", label: "PLAATSINGSLIJST" }].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            background: view === v.id ? C.accent : C.card,
            color: view === v.id ? C.bg : C.text,
            border: `1px solid ${view === v.id ? C.accent : C.border}`,
            borderRadius: 4, padding: "6px 12px", cursor: "pointer",
            fontFamily: font, fontSize: 11, fontWeight: "bold",
          }}>{v.label}</button>
        ))}
      </div>

      {view === "grid" ? gridView : tableView}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <InfoCard title="Bouwvolgorde" color={C.accent}>
          <p>1. Soldeer female pin headers voor Arduino</p>
          <p>2. Maak alle stripsneden (✕ markeringen)</p>
          <p>3. Soldeer voedingscircuit (D6 + C2 + C3)</p>
          <p>4. Soldeer weerstanden (kleinste eerst)</p>
          <p>5. Soldeer signaaldiodes (1N4148) + caps</p>
          <p>6. Soldeer IC-voet voor 6N137</p>
          <p>7. Draadbruggen aan onderzijde</p>
          <p>8. Test voeding: 9V adapter → 5V op pin</p>
          <p>9. Plaats Arduino + 6N137</p>
          <p>10. Power LED aansluiten</p>
        </InfoCard>
        <InfoCard title="Tips" color={C.accent2}>
          <p>• Gebruik een IC-voet voor de 6N137</p>
          <p>• Draadbruggen: vertind koperdraad aan onderzijde</p>
          <p>• Jacks + DIN: panel mount, met draad naar board</p>
          <p>• Test elke sectie apart voordat je verder gaat</p>
          <p>• OLED + encoder: met dupont-kabels naar board</p>
          <p>• Kleurcode draden: rood=5V, zwart=GND, geel=signaal</p>
          <p>• <strong style={{color: C.red}}>NOOIT USB + DC adapter tegelijk!</strong></p>
        </InfoCard>
      </div>
    </div>
  );
}

// ─── PINOUT TAB ──────────────────────────────────────
function Pinout() {
  const pins = [
    { pin: "D0 / RX", func: "MIDI In", detail: "Via 6N137 → 2N3904 inverter → RX", color: C.blue },
    { pin: "D1 / TX", func: "MIDI Out ×2", detail: "Naar 2× DIN connector via 220Ω", color: C.blue },
    { pin: "D2", func: "Encoder CLK", detail: "Interrupt pin, INPUT_PULLUP", color: C.accent2 },
    { pin: "D3", func: "Encoder DT", detail: "Interrupt pin, INPUT_PULLUP", color: C.accent2 },
    { pin: "D4", func: "Encoder SW", detail: "Drukknop, INPUT_PULLUP", color: C.accent2 },
    { pin: "D5", func: "Tap Tempo", detail: "Tactile switch naar GND", color: C.muted },
    { pin: "D6", func: "Start / Stop", detail: "Tactile switch naar GND", color: C.muted },
    { pin: "D7", func: "Clock Out 1", detail: "÷1 (kwart noot) via 100Ω", color: C.accent },
    { pin: "D8", func: "Clock Out 2", detail: "÷2 (halve noot) via 100Ω", color: C.accent },
    { pin: "D9", func: "Clock Out 3", detail: "÷4 (hele noot) via 100Ω", color: C.accent },
    { pin: "D10", func: "Clock Out 4", detail: "Instelbaar (÷1 t/m ×4) via 100Ω", color: C.accent },
    { pin: "D11", func: "PO Sync", detail: "Via 47kΩ + 10kΩ spanningsdeler", color: C.accent2 },
    { pin: "D12", func: "Reset / Run", detail: "Gate output via 100Ω, HIGH = running", color: C.red },
    { pin: "A0", func: "CV In 1: BPM", detail: "0-10V safe, via 100kΩ divider + diodeklem", color: C.accent },
    { pin: "A1", func: "CV In 2: MOD", detail: "0-10V safe, instelbaar (swing/divisie/etc)", color: C.accent },
    { pin: "A4 (SDA)", func: "OLED Data", detail: "I2C SDA naar SSD1306", color: C.accent2 },
    { pin: "A5 (SCL)", func: "OLED Clock", detail: "I2C SCL naar SSD1306", color: C.accent2 },
  ];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: 18, marginBottom: 12 }}>Arduino Nano Pinout</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: font }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            <th style={{ ...thStyle, width: "15%" }}>Pin</th>
            <th style={{ ...thStyle, width: "20%" }}>Functie</th>
            <th style={{ ...thStyle }}>Detail</th>
          </tr>
        </thead>
        <tbody>
          {pins.map((p, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
              <td style={{ ...tdStyle, color: p.color, fontWeight: "bold" }}>{p.pin}</td>
              <td style={tdStyle}>{p.func}</td>
              <td style={{ ...tdStyle, color: C.muted, fontSize: 11 }}>{p.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ color: C.accent2, fontSize: 15, marginBottom: 8 }}>Vrije pinnen voor uitbreidingen</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <InfoCard title="Beschikbaar" color={C.accent}>
            <p>D13, A2, A3, A6, A7</p>
            <p>= 5 vrije pinnen</p>
          </InfoCard>
          <InfoCard title="Ideeën" color={C.accent2}>
            <p>• Extra clock outputs (meer divisies)</p>
            <p>• Extra CV inputs (A2, A3)</p>
            <p>• LED indicators per output</p>
            <p>• Swing amount potmeter</p>
            <p>• DIN Sync (Sync24) output</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────
function InfoCard({ title, color, children }) {
  return (
    <div style={{ background: C.card, borderRadius: 6, padding: 12, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}` }}>
      <div style={{ color, fontSize: 12, fontWeight: "bold", marginBottom: 6, fontFamily: font }}>{title}</div>
      <div style={{ color: C.text, fontSize: 11, fontFamily: font, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function NoteBox({ children }) {
  return (
    <div style={{ background: C.card, borderRadius: 6, padding: 12, marginTop: 12, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent2}` }}>
      <div style={{ color: C.muted, fontSize: 11, fontFamily: font, lineHeight: 1.7, whiteSpace: "pre-line" }}>{children}</div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────
export default function MasterClock() {
  const [tab, setTab] = useState("overview");

  const content = {
    overview: <Overview />,
    schematic: <Schematic />,
    bom: <BillOfMaterials />,
    stripboard: <Stripboard />,
    pinout: <Pinout />,
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: font, minHeight: "100vh", padding: 16, boxSizing: "border-box" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
          <h1 style={{ fontSize: 22, color: C.accent, margin: 0, letterSpacing: 2 }}>
            ⏱ MASTER CLOCK
          </h1>
          <p style={{ color: C.muted, fontSize: 11, margin: "4px 0 0 0" }}>
            MIDI + CV + PO Sync — Arduino Nano based — Stripboard build
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? C.card : "transparent",
                color: tab === t.id ? C.accent : C.muted,
                border: "none",
                borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
                padding: "8px 14px",
                cursor: "pointer",
                fontFamily: font,
                fontSize: 11,
                fontWeight: "bold",
                letterSpacing: 1,
                transition: "all 0.15s",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Content */}
        {content[tab]}
      </div>
    </div>
  );
}
