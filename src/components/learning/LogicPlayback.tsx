import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  SeatingDiagramData,
  SeatingDiagramSeat,
  SeatingExplanationFlow as SeatingExplanationFlowData,
} from "@workspace/api-zod";
import type { Language } from "@/lib/lang-utils";
import { QuestionRichText } from "@/components/QuestionRichText";
import { cn } from "@/lib/utils";

type LocalizedStepContent = {
  explanation_steps?: unknown;
  explanationSteps?: unknown;
  steps?: unknown;
  explanation?: unknown;
};

type LogicPlaybackProps = {
  logic?: unknown | null;
  diagram?: SeatingDiagramData | null;
  seatingDiagram?: SeatingDiagramData | null;
  seatingExplanationFlow?: SeatingExplanationFlowData | null;
  content?: unknown | null;
  languages?: unknown | null;
  currentLang?: Language;
  availableLanguages?: Language[];
  onLanguageChange?: (lang: Language) => void;
  className?: string;
};

type SeatPoint = {
  id: string;
  x: number;
  y: number;
  seat: SeatingDiagramSeat;
  label: string;
  highlighted: boolean;
};

const LANGUAGE_SHORT_LABEL: Record<Language, string> = {
  en: "EN",
  hi: "\u0939\u093f",
  pa: "\u0A2A\u0A70",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function cleanLabel(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "?" || trimmed === "-" || trimmed.toLowerCase() === "empty") {
    return "";
  }
  return trimmed;
}

function localizedSteps(languages: unknown, lang: Language): string[] {
  if (!isRecord(languages)) return [];
  const pack = languages[lang] as LocalizedStepContent | undefined;
  if (!isRecord(pack)) return [];
  const raw = pack.explanation_steps ?? pack.explanationSteps ?? pack.steps;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((step) => {
      if (typeof step === "string") return step;
      if (isRecord(step)) {
        const text = step.text ?? step.caption ?? step.statement ?? step.explanation;
        return typeof text === "string" ? text : "";
      }
      return "";
    })
    .filter((step) => step.trim().length > 0);
}

function localizedExplanation(languages: unknown, lang: Language): string {
  if (!isRecord(languages)) return "";
  const pack = languages[lang] as LocalizedStepContent | undefined;
  if (!isRecord(pack)) return "";
  return typeof pack.explanation === "string" ? pack.explanation : "";
}

function inferAvailableLanguages(languages: unknown, provided?: Language[]): Language[] {
  if (provided?.length) return provided;
  if (!isRecord(languages)) return ["en"];
  const langs: Language[] = ["en"];
  if (languages.hi) langs.push("hi");
  if (languages.pa) langs.push("pa");
  return langs;
}

function getStepDiagram(
  flow: SeatingExplanationFlowData | null | undefined,
  finalDiagram: SeatingDiagramData | null | undefined,
  stepIndex: number,
) {
  if (stepIndex < 0) return null;
  return flow?.steps?.[stepIndex]?.arrangementSnapshot ?? finalDiagram ?? null;
}

function getSeatCoordinates(
  diagram: SeatingDiagramData,
  seat: SeatingDiagramSeat,
  index: number,
  total: number,
) {
  const manifestSlot = diagram.layoutManifest?.slots?.[index];
  if (manifestSlot?.coordinates) {
    const x = manifestSlot.coordinates.x;
    const y = manifestSlot.coordinates.y;
    return {
      x: x <= 100 ? x * 8 : x,
      y: y <= 100 ? y * 4 : y,
    };
  }

  const arrangement = diagram.arrangementType;
  if (arrangement === "circular" || arrangement === "square" || arrangement === "rectangular") {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / Math.max(total, 1);
    return { x: 400 + 165 * Math.cos(angle), y: 200 + 125 * Math.sin(angle) };
  }

  if (arrangement === "parallel-row" || arrangement === "double-row") {
    const rowCount = diagram.rowCount ?? 2;
    const colCount = diagram.colCount ?? Math.ceil(total / rowCount);
    const row = seat.row ?? Math.floor(index / colCount);
    const col = seat.col ?? index % colCount;
    const x = colCount <= 1 ? 400 : 90 + (col / (colCount - 1)) * 620;
    const y = rowCount <= 1 ? 200 : 145 + (row / (rowCount - 1)) * 110;
    return { x, y };
  }

  if (arrangement === "floor" || arrangement === "box-stack" || arrangement === "ranking") {
    return {
      x: 400,
      y: total <= 1 ? 200 : 60 + ((total - index - 1) / (total - 1)) * 280,
    };
  }

  if (arrangement === "scheduling" || arrangement === "mapping") {
    const cols = diagram.colCount ?? Math.ceil(Math.sqrt(total));
    const rows = diagram.rowCount ?? Math.ceil(total / cols);
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: cols <= 1 ? 400 : 100 + (col / (cols - 1)) * 600,
      y: rows <= 1 ? 200 : 90 + (row / (rows - 1)) * 220,
    };
  }

  return {
    x: total <= 1 ? 400 : 80 + (index / (total - 1)) * 640,
    y: 210,
  };
}

function namesMentioned(text: string, seats: SeatingDiagramSeat[]) {
  const lower = text.toLowerCase();
  return new Set(
    seats
      .map((seat) => cleanLabel(seat.label))
      .filter((label) => label && lower.includes(label.toLowerCase())),
  );
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function logicClues(logic: unknown): Record<string, unknown>[] {
  if (!isRecord(logic)) return [];
  const raw = logic.clues ?? logic.edges ?? logic.relations ?? [];
  return Array.isArray(raw) ? raw.filter(isRecord) : [];
}

function clueEntityIds(clue: Record<string, unknown>) {
  return [
    clue.subjectId,
    clue.objectId,
    clue.anchorObjectId,
    clue.from,
    clue.to,
    clue.entityId,
  ]
    .filter((value): value is string => typeof value === "string")
    .map(normalizeKey);
}

function isCircularLayout(diagram?: SeatingDiagramData | null) {
  return diagram?.arrangementType === "circular" || diagram?.arrangementType === "square" || diagram?.arrangementType === "rectangular";
}

function isLinearLayout(diagram?: SeatingDiagramData | null) {
  return diagram?.arrangementType === "linear";
}

function seatScale(point: SeatPoint, diagram?: SeatingDiagramData | null) {
  if (!isCircularLayout(diagram)) return 1;
  return point.y < 200 ? 0.86 : 1.05;
}

function directionTriangle(x: number, y: number, direction: "up" | "down" | "in" | "out", center = { x: 400, y: 200 }) {
  if (direction === "up") return `${x},${y - 10} ${x - 9},${y + 7} ${x + 9},${y + 7}`;
  if (direction === "down") return `${x},${y + 10} ${x - 9},${y - 7} ${x + 9},${y - 7}`;

  const dx = x - center.x;
  const dy = y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const tx = direction === "in" ? x - ux * 30 : x + ux * 30;
  const ty = direction === "in" ? y - uy * 30 : y + uy * 30;
  const px = -uy;
  const py = ux;
  const bx = direction === "in" ? x - ux * 15 : x + ux * 15;
  const by = direction === "in" ? y - uy * 15 : y + uy * 15;
  return `${tx},${ty} ${bx + px * 8},${by + py * 8} ${bx - px * 8},${by - py * 8}`;
}

export default function LogicPlayback({
  logic,
  diagram,
  seatingDiagram,
  seatingExplanationFlow,
  content,
  languages,
  currentLang = "en",
  availableLanguages,
  onLanguageChange,
  className,
}: LogicPlaybackProps) {
  const resolvedDiagram = seatingDiagram ?? diagram ?? null;
  const resolvedContent = content ?? languages;
  const clues = useMemo(() => logicClues(logic), [logic]);
  const langs = useMemo(
    () => inferAvailableLanguages(resolvedContent, availableLanguages),
    [availableLanguages, resolvedContent],
  );
  const stepCaptions = useMemo(
    () => localizedSteps(resolvedContent, currentLang),
    [currentLang, resolvedContent],
  );
  const fallbackExplanation = useMemo(
    () => localizedExplanation(resolvedContent, currentLang),
    [currentLang, resolvedContent],
  );
  const flowSteps = seatingExplanationFlow?.steps ?? [];
  const timelineSteps = resolvedDiagram?.layoutManifest?.reasoningTimeline ?? [];
  const finalSeats = resolvedDiagram?.seats ?? [];
  const totalSteps = Math.max(stepCaptions.length, flowSteps.length, timelineSteps.length, clues.length, finalSeats.length ? 1 : 0);
  const [currentStep, setCurrentStep] = useState(0);

  const boundedStep = Math.min(currentStep, totalSteps);
  const activeStepIndex = boundedStep - 1;
  const activeDiagram = getStepDiagram(seatingExplanationFlow, resolvedDiagram, activeStepIndex);
  const baseDiagram = resolvedDiagram ?? activeDiagram;
  const seats = baseDiagram?.seats ?? [];
  const snapshotSeats = activeDiagram?.seats ?? [];
  const snapshotByPosition = new Map(snapshotSeats.map((seat) => [seat.position, seat]));
  const visibleEntityIds = new Set(
    clues
      .slice(0, Math.max(boundedStep, 0))
      .flatMap((clue) => clueEntityIds(clue)),
  );
  const caption =
    boundedStep === 0
      ? "Start with an empty board. Use Next to watch the arrangement being built from the stored logic."
      : stepCaptions[activeStepIndex] ??
        flowSteps[activeStepIndex]?.text ??
        timelineSteps[activeStepIndex]?.note ??
        fallbackExplanation ??
        "This step applies the next stored reasoning clue.";
  const activeNames = namesMentioned(caption, seats);
  const activeClueIds = new Set(activeStepIndex >= 0 ? clueEntityIds(clues[activeStepIndex] ?? {}) : []);

  const visibleSeatPoints = useMemo<SeatPoint[]>(() => {
    if (!baseDiagram || boundedStep === 0) return [];
    const hasSnapshots = snapshotSeats.length > 0 && snapshotSeats.some((seat) => cleanLabel(seat.label));
    return seats
      .map((seat, index) => {
        const snapshotSeat = snapshotByPosition.get(seat.position);
        const finalLabel = cleanLabel(seat.label);
        const snapshotLabel = cleanLabel(snapshotSeat?.label);
        const finalKey = normalizeKey(finalLabel);
        const shouldRevealByLogic = visibleEntityIds.has(finalKey);
        const label =
          snapshotLabel ||
          (hasSnapshots ? "" : shouldRevealByLogic || boundedStep >= totalSteps ? finalLabel : "");
        const coords = getSeatCoordinates(baseDiagram, seat, index, seats.length);
        return {
          id: `${seat.position}-${label || "empty"}`,
          x: coords.x,
          y: coords.y,
          seat,
          label,
          highlighted:
            Boolean(snapshotSeat?.highlighted || snapshotSeat?.isAnswer || seat.highlighted || seat.isAnswer) ||
            (label ? activeNames.has(label) : false),
        };
      })
      .filter((point) => point.label);
  }, [activeNames, baseDiagram, boundedStep, seats, snapshotByPosition, snapshotSeats, totalSteps, visibleEntityIds]);

  const circularLayout = isCircularLayout(baseDiagram);
  const linearLayout = isLinearLayout(baseDiagram);
  const hasPlayback = Boolean(baseDiagram?.seats?.length);
  const canMoveBack = boundedStep > 0;
  const canMoveNext = boundedStep < totalSteps;
  const captionLang = currentLang === "pa" ? "pa" : currentLang === "hi" ? "hi" : "en";
  const activeConnectorPoints = visibleSeatPoints.filter((point) => activeClueIds.has(normalizeKey(point.label))).slice(0, 2);

  return (
    <section className={cn("overflow-hidden rounded-md border border-slate-800 bg-slate-950 text-slate-100", className)}>
      <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Logic Playback</p>
          <p className="mt-1 text-sm text-slate-400">
            Step {boundedStep} of {Math.max(totalSteps, 1)}
          </p>
        </div>
        <div className="sticky top-2 z-10 flex self-end rounded-md border border-slate-700 bg-slate-900/95 p-1 shadow-lg shadow-black/20 sm:self-auto">
          {langs.map((lang) => (
            <button
              key={lang}
              type="button"
              className={cn(
                "min-h-11 rounded px-3 text-xs font-semibold transition",
                currentLang === lang
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
              onClick={() => onLanguageChange?.(lang)}
            >
              {LANGUAGE_SHORT_LABEL[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="logic-playback-scrollbar overflow-x-auto rounded-md border border-slate-800 bg-slate-50 p-3">
          <svg
            viewBox="0 0 800 400"
            role="img"
            aria-label="Step-by-step seating arrangement"
            className="h-auto w-full"
            style={{ minWidth: linearLayout && seats.length > 8 ? `${seats.length * 96}px` : undefined }}
          >
            <defs>
              <filter id="logic-playback-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="logic-table-fill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="logic-chair-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            {linearLayout ? (
              <g>
                <rect x="58" y="252" width="684" height="8" rx="4" fill="#cbd5e1" />
                <rect x="70" y="262" width="660" height="2" rx="1" fill="#e2e8f0" />
              </g>
            ) : null}
            {circularLayout ? (
              <g>
                <circle cx="400" cy="200" r="112" fill="url(#logic-table-fill)" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="400" cy="200" r="82" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                <ellipse cx="400" cy="238" rx="92" ry="14" fill="#94a3b8" opacity="0.16" />
              </g>
            ) : null}
            {hasPlayback
              ? seats.map((seat, index) => {
                  const { x, y } = getSeatCoordinates(baseDiagram!, seat, index, seats.length);
                  const seatNumber = seat.seatLabel ?? String(index + 1);
                  const facing = String(seat.facing).toLowerCase();
                  const chairW = linearLayout ? 54 : 38;
                  const chairH = linearLayout ? 44 : 38;
                  const scale = circularLayout ? (y < 200 ? 0.88 : 1.04) : 1;
                  const arrowDirection =
                    linearLayout
                      ? facing === "south" ? "down" : "up"
                      : facing === "outward" ? "out" : "in";
                  return linearLayout ? (
                    <g key={`ghost-${seat.position}`}>
                      <path
                        d={`M ${x - chairW / 2} ${y + chairH / 2} L ${x - chairW / 2} ${y - 10} Q ${x - chairW / 2} ${y - chairH / 2} ${x - chairW / 2 + 14} ${y - chairH / 2} L ${x + chairW / 2 - 14} ${y - chairH / 2} Q ${x + chairW / 2} ${y - chairH / 2} ${x + chairW / 2} ${y - 10} L ${x + chairW / 2} ${y + chairH / 2}`}
                        fill="url(#logic-chair-fill)"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                      />
                      <polygon points={directionTriangle(x, facing === "south" ? y + 48 : y - 48, arrowDirection as "up" | "down")} fill="#818cf8" opacity="0.85" />
                      <text x={x} y={y + 72} textAnchor="middle" className="fill-slate-400 text-[15px] font-semibold">
                        {seatNumber}
                      </text>
                    </g>
                  ) : (
                    <g key={`ghost-${seat.position}`} transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
                      <circle cx={x} cy={y} r="21" fill="url(#logic-chair-fill)" stroke="#94a3b8" strokeDasharray="5 4" strokeWidth="1.5" />
                      <polygon points={directionTriangle(x, y, arrowDirection as "in" | "out")} fill="#818cf8" opacity="0.85" />
                      <text x={x} y={y + 43} textAnchor="middle" className="fill-slate-400 text-[13px] font-semibold">
                        {seatNumber}
                      </text>
                    </g>
                  );
                })
              : null}
            {activeConnectorPoints.length === 2 ? (
              <motion.line
                x1={activeConnectorPoints[0].x}
                y1={activeConnectorPoints[0].y}
                x2={activeConnectorPoints[1].x}
                y2={activeConnectorPoints[1].y}
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.58"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0.18, 0.68, 0.38] }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ) : null}
            <AnimatePresence>
              {visibleSeatPoints.map((point) => (
                <motion.g
                  key={point.id}
                  layoutId={`logic-seat-${point.seat.position}-${normalizeKey(point.label)}`}
                  initial={{ opacity: 0, y: -7, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  {point.highlighted ? (
                    circularLayout ? (
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r={29 * seatScale(point, baseDiagram)}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        filter="url(#logic-playback-glow)"
                        animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    ) : (
                      <motion.rect
                        x={point.x - 34}
                        y={point.y - 30}
                        width="68"
                        height="60"
                        rx="10"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        filter="url(#logic-playback-glow)"
                        animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )
                  ) : null}
                  {circularLayout ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={22 * seatScale(point, baseDiagram)}
                      fill={point.highlighted ? "#4f46e5" : "#1e3a8a"}
                      stroke="#bfdbfe"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <path
                      d={`M ${point.x - 29} ${point.y + 23} L ${point.x - 29} ${point.y - 11} Q ${point.x - 29} ${point.y - 28} ${point.x - 12} ${point.y - 28} L ${point.x + 12} ${point.y - 28} Q ${point.x + 29} ${point.y - 28} ${point.x + 29} ${point.y - 11} L ${point.x + 29} ${point.y + 23}`}
                      fill={point.highlighted ? "#4f46e5" : "#1e3a8a"}
                      stroke="#bfdbfe"
                      strokeWidth="1.5"
                    />
                  )}
                  <text
                    x={point.x}
                    y={point.y + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-[15px] font-bold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {point.label.length > 9 ? `${point.label.slice(0, 8)}\u2026` : point.label}
                  </text>
                </motion.g>
              ))}
            </AnimatePresence>
            {!hasPlayback ? (
              <text x="400" y="200" textAnchor="middle" className="fill-slate-400 text-[18px]">
                No arrangement diagram stored
              </text>
            ) : null}
          </svg>
        </div>

        <div className="mt-4 space-y-3">
          <div className="relative flex items-center justify-between gap-1 px-1">
            <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-slate-700" />
            {Array.from({ length: Math.max(totalSteps, 1) + 1 }).map((_, step) => (
              <button
                key={step}
                type="button"
                aria-label={`Jump to step ${step}`}
                className={cn(
                  "relative z-10 h-3 w-3 rounded-full border transition",
                  step <= boundedStep
                    ? "border-indigo-400 bg-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
                    : "border-slate-600 bg-slate-900 hover:border-slate-400",
                )}
                onClick={() => setCurrentStep(step)}
              />
            ))}
          </div>
          <input
            aria-label="Logic playback step"
            className="h-2 w-full accent-indigo-500"
            min={0}
            max={Math.max(totalSteps, 0)}
            step={1}
            type="range"
            value={boundedStep}
            onChange={(event) => setCurrentStep(Number(event.target.value))}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-blue-900 bg-blue-950 px-3 text-sm font-medium text-slate-100 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canMoveBack}
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-blue-950 px-3 text-sm font-semibold text-white transition ring-1 ring-indigo-500/60 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canMoveNext}
              onClick={() => setCurrentStep((step) => Math.min(totalSteps, step + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100",
            captionLang === "pa" && "pa-caption punjabi-playback-text",
          )}
          lang={captionLang}
          style={
            captionLang === "pa"
              ? {
                  fontFamily: "'Noto Sans Gurmukhi', sans-serif",
                  lineHeight: 2,
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing: "antialiased",
                }
              : undefined
          }
        >
          <QuestionRichText content={caption} lang={captionLang} />
        </div>
      </div>
      {logic ? <span className="sr-only">Stored procedural logic is available for this playback.</span> : null}
    </section>
  );
}
