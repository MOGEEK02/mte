import type { ReactNode } from "react";
import type { ArtKind } from "../services";

// Line drawings that stand for each service (no photos). Drawn on a 400×240 grid,
// in slate lines with the brand yellow for the "active" part.

const LINE = "#94a3b8";
const ACCENT = "#f0b91a";
const LABEL = { fill: "#94a3b8", fontSize: 9, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } as const;

function Contact({ x, y, nc, color = LINE }: { x: number; y: number; nc?: boolean; color?: string }) {
  return (
    <g stroke={color}>
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} />
      <line x1={x + 18} y1={y - 12} x2={x + 18} y2={y + 12} />
      {nc && <line x1={x + 2} y1={y + 12} x2={x + 16} y2={y - 12} />}
    </g>
  );
}

function Coil({ x, y, color = LINE }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} fill="none">
      <path d={`M${x + 6} ${y - 12} Q${x - 2} ${y} ${x + 6} ${y + 12}`} />
      <path d={`M${x + 22} ${y - 12} Q${x + 30} ${y} ${x + 22} ${y + 12}`} />
    </g>
  );
}

function Ladder() {
  return (
    <g strokeWidth={2} strokeLinecap="round">
      <line x1={36} y1={22} x2={36} y2={230} stroke={LINE} />
      <line x1={364} y1={22} x2={364} y2={230} stroke={LINE} />

      {/* Rung 1: start / stop with seal-in, energised */}
      <g stroke={ACCENT}>
        <line x1={36} y1={62} x2={100} y2={62} />
        <line x1={118} y1={62} x2={170} y2={62} />
        <line x1={188} y1={62} x2={290} y2={62} />
        <line x1={318} y1={62} x2={364} y2={62} />
      </g>
      <Contact x={100} y={62} color={ACCENT} />
      <Contact x={170} y={62} nc color={ACCENT} />
      <Coil x={290} y={62} color={ACCENT} />
      <g stroke={LINE}>
        <path d="M78 62 V104 H100" fill="none" />
        <path d="M118 104 H140 V62" fill="none" />
      </g>
      <Contact x={100} y={104} />
      <text x={109} y={40} textAnchor="middle" {...LABEL}>I0.0 MARCHE</text>
      <text x={179} y={40} textAnchor="middle" {...LABEL}>I0.1 ARRÊT</text>
      <text x={304} y={40} textAnchor="middle" {...LABEL}>Q0.0 MOTEUR</text>
      <text x={109} y={130} textAnchor="middle" {...LABEL}>Q0.0</text>

      {/* Rung 2: timer */}
      <g stroke={LINE}>
        <line x1={36} y1={174} x2={100} y2={174} />
        <line x1={118} y1={174} x2={196} y2={174} />
        <rect x={196} y={154} width={64} height={40} rx={3} fill="none" />
        <line x1={260} y1={174} x2={290} y2={174} />
        <line x1={318} y1={174} x2={364} y2={174} />
      </g>
      <Contact x={100} y={174} />
      <Coil x={290} y={174} />
      <text x={228} y={171} textAnchor="middle" {...LABEL} fill="#e2e8f0" fontSize={11}>TON</text>
      <text x={228} y={185} textAnchor="middle" {...LABEL}>T1 · 5 s</text>
      <text x={109} y={154} textAnchor="middle" {...LABEL}>Q0.0</text>
      <text x={304} y={154} textAnchor="middle" {...LABEL}>Q0.1 ALARME</text>

      {/* Rung 3 */}
      <g stroke={LINE} opacity={0.6}>
        <line x1={36} y1={214} x2={100} y2={214} />
        <line x1={118} y1={214} x2={290} y2={214} />
        <line x1={318} y1={214} x2={364} y2={214} />
      </g>
      <g opacity={0.6}>
        <Contact x={100} y={214} nc />
        <Coil x={290} y={214} />
      </g>
    </g>
  );
}

function Hmi() {
  return (
    <g strokeWidth={1.8} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <rect x={34} y={18} width={332} height={204} rx={10} stroke={LINE} />
      <rect x={46} y={30} width={308} height={180} rx={4} stroke={LINE} opacity={0.5} />
      <line x1={46} y1={52} x2={354} y2={52} stroke={LINE} opacity={0.5} />
      <text x={56} y={45} {...LABEL} fill="#e2e8f0" stroke="none">LIGNE 1 · AUTO</text>
      <text x={344} y={45} textAnchor="end" {...LABEL} stroke="none">08:42</text>

      {/* Tank with level */}
      <rect x={66} y={70} width={52} height={96} rx={4} stroke={LINE} />
      <rect x={69} y={112} width={46} height={51} rx={2} fill={ACCENT} fillOpacity={0.85} stroke="none" />
      <text x={92} y={182} textAnchor="middle" {...LABEL} stroke="none">CUVE 62 %</text>
      <path d="M118 90 H150 V120 H176" stroke={LINE} />

      {/* Pump / motor status */}
      <circle cx={192} cy={120} r={16} stroke={ACCENT} />
      <path d="M186 112 L200 120 L186 128 Z" fill={ACCENT} stroke="none" />
      <path d="M208 120 H238" stroke={LINE} />
      <text x={192} y={152} textAnchor="middle" {...LABEL} stroke="none">P1 MARCHE</text>

      {/* Trend */}
      <rect x={244} y={68} width={96} height={64} rx={3} stroke={LINE} opacity={0.6} />
      <path d="M250 118 L262 108 L274 112 L286 96 L298 100 L310 86 L322 90 L334 80" stroke={ACCENT} strokeWidth={2} />
      <text x={292} y={146} textAnchor="middle" {...LABEL} stroke="none">PRESSION 3,2 bar</text>

      {/* Buttons */}
      <rect x={244} y={166} width={44} height={22} rx={4} fill={ACCENT} stroke="none" />
      <text x={266} y={180.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#051526" fontFamily="ui-monospace, Menlo, monospace">MARCHE</text>
      <rect x={296} y={166} width={44} height={22} rx={4} stroke={LINE} />
      <text x={318} y={180.5} textAnchor="middle" {...LABEL} stroke="none">ARRÊT</text>
    </g>
  );
}

function Scope() {
  const grid: ReactNode[] = [];
  for (let x = 80; x < 360; x += 40) grid.push(<line key={`v${x}`} x1={x} y1={30} x2={x} y2={210} />);
  for (let y = 75; y < 210; y += 45) grid.push(<line key={`h${y}`} x1={40} y1={y} x2={360} y2={y} />);
  return (
    <g strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x={40} y={30} width={320} height={180} rx={10} stroke={LINE} />
      <g stroke={LINE} strokeWidth={1} opacity={0.25} strokeDasharray="2 4">
        {grid}
      </g>
      {/* Digital input trace with a glitch */}
      <path d="M40 160 H76 V100 H120 V160 H150 V100 H196 V160 H214" stroke="#e2e8f0" />
      <path d="M214 160 V128 H220 V160 H226 V108 H231 V160 H238 V136 H244 V160 H250" stroke={ACCENT} />
      <path d="M250 160 V100 H296 V160 H326 V100 H360" stroke="#e2e8f0" />
      <g stroke={ACCENT} strokeWidth={1.5} strokeDasharray="4 4">
        <line x1={210} y1={60} x2={210} y2={200} />
        <line x1={254} y1={60} x2={254} y2={200} />
      </g>
      <rect x={202} y={40} width={60} height={18} rx={4} fill={ACCENT} stroke="none" />
      <text x={232} y={52.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#051526" fontFamily="ui-monospace, Menlo, monospace" stroke="none">
        DÉFAUT
      </text>
      <text x={52} y={48} {...LABEL} stroke="none">CH1 · I0.3 CAPTEUR</text>
      <text x={348} y={200} textAnchor="end" {...LABEL} stroke="none">24 V · 10 ms/div</text>
    </g>
  );
}

function Panel() {
  const terminals: ReactNode[] = [];
  for (let x = 82; x < 320; x += 11) terminals.push(<rect key={x} x={x} y={198} width={8} height={14} rx={1} />);
  return (
    <g strokeWidth={1.8} fill="none" strokeLinejoin="round">
      <rect x={58} y={14} width={284} height={212} rx={8} stroke={LINE} />
      {/* Rail 1: breakers, PLC, power supply */}
      <line x1={70} y1={58} x2={330} y2={58} stroke={LINE} opacity={0.5} />
      <g stroke={LINE}>
        {[78, 94, 110, 126].map((x) => (
          <g key={x}>
            <rect x={x} y={38} width={13} height={38} rx={2} />
            <rect x={x + 3.5} y={50} width={6} height={9} rx={1} />
          </g>
        ))}
        <rect x={152} y={36} width={104} height={42} rx={3} />
        <rect x={268} y={36} width={56} height={42} rx={3} />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={166 + i * 12} cy={48} r={2.6} fill={i % 2 ? "#475569" : ACCENT} stroke="none" />
      ))}
      <text x={204} y={70} textAnchor="middle" {...LABEL}>PLC</text>
      <text x={296} y={62} textAnchor="middle" {...LABEL}>24 V DC</text>

      {/* Ducts */}
      <rect x={70} y={92} width={260} height={12} rx={2} stroke={LINE} opacity={0.5} />
      <rect x={70} y={172} width={260} height={12} rx={2} stroke={LINE} opacity={0.5} />

      {/* Rail 2: contactors, relays, drive */}
      <g stroke={LINE}>
        {[80, 118, 156].map((x) => (
          <rect key={x} x={x} y={118} width={30} height={40} rx={3} />
        ))}
        {[198, 212, 226].map((x) => (
          <rect key={x} x={x} y={124} width={11} height={30} rx={2} />
        ))}
        <rect x={256} y={112} width={64} height={52} rx={4} />
        <rect x={266} y={120} width={44} height={14} rx={2} />
      </g>
      <text x={95} y={142} textAnchor="middle" {...LABEL}>KM1</text>
      <text x={133} y={142} textAnchor="middle" {...LABEL}>KM2</text>
      <text x={171} y={142} textAnchor="middle" {...LABEL}>KM3</text>
      <text x={288} y={153} textAnchor="middle" {...LABEL}>VFD</text>

      {/* Terminal strip */}
      <g stroke={LINE} opacity={0.8}>{terminals}</g>

      {/* PLC output → KM1, highlighted */}
      <path d="M176 78 V98 H95 V118" stroke={ACCENT} strokeWidth={2.2} />
      <path d="M95 158 V178 H120 V198" stroke={ACCENT} strokeWidth={2.2} />
    </g>
  );
}

function Drive() {
  return (
    <g strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Drive */}
      <rect x={38} y={44} width={92} height={152} rx={8} stroke={LINE} />
      <rect x={50} y={58} width={68} height={30} rx={3} stroke={LINE} />
      <text x={84} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT} stroke="none" fontFamily="ui-monospace, Menlo, monospace">
        50.0 Hz
      </text>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={58 + i * 17} cy={110} r={5} stroke={LINE} />
      ))}
      <line x1={50} y1={132} x2={118} y2={132} stroke={LINE} opacity={0.4} />
      <line x1={50} y1={142} x2={102} y2={142} stroke={LINE} opacity={0.4} />
      <text x={84} y={184} textAnchor="middle" {...LABEL} stroke="none">VARIATEUR</text>

      {/* Output cable U V W */}
      <g stroke={LINE}>
        <line x1={130} y1={150} x2={262} y2={150} />
        <line x1={130} y1={160} x2={262} y2={160} />
        <line x1={130} y1={170} x2={262} y2={170} />
      </g>
      <text x={146} y={192} {...LABEL} stroke="none">U  V  W</text>

      {/* PWM and the resulting sine */}
      <path
        d="M148 96 H156 V66 H160 V96 H166 V66 H174 V96 H178 V66 H190 V96 H194 V66 H208 V96 H212 V66 H224 V96 H228 V66 H236 V96 H242 V66 H246 V96 H254"
        stroke={LINE}
        strokeWidth={1.4}
        opacity={0.7}
      />
      <path d="M148 81 C 166 50, 184 50, 201 81 S 236 112, 254 81" stroke={ACCENT} strokeWidth={2.4} />

      {/* Motor */}
      <circle cx={310} cy={160} r={44} stroke={LINE} />
      <text x={310} y={162} textAnchor="middle" fontSize={24} fontWeight={700} fill="#e2e8f0" stroke="none" fontFamily="Inter, sans-serif">
        M
      </text>
      <text x={310} y={182} textAnchor="middle" fontSize={12} fill="#94a3b8" stroke="none" fontFamily="Inter, sans-serif">
        3~
      </text>
      <rect x={354} y={154} width={22} height={12} rx={2} stroke={LINE} />
      <path d="M262 150 H268 M262 160 H266 M262 170 H268" stroke={LINE} />
    </g>
  );
}

const ART: Record<ArtKind, () => ReactNode> = { ladder: Ladder, hmi: Hmi, scope: Scope, panel: Panel, drive: Drive };

/** Decorative drawing for a service, on a navy grid background. */
export function ServiceArt({ kind, className = "" }: { kind: ArtKind; className?: string }) {
  const Art = ART[kind];
  return (
    <div className={`bg-grid relative overflow-hidden bg-navy-900 ${className}`}>
      <svg viewBox="0 0 400 240" aria-hidden="true" className="absolute inset-0 size-full p-[6%]">
        <Art />
      </svg>
    </div>
  );
}
