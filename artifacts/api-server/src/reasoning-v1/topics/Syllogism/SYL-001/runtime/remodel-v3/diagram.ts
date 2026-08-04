import type {
  SurfacePremise,
  SylLocale,
  TermId,
} from "../../foundation/types";
import type { TermAssignment } from "../localization";
import { modelStateLabel } from "./localization";
import type {
  SylCombinedDiagramSpecV3,
  SylProofModelSnapshotV3,
} from "./types";
import type { SylStructuredProofCoreV3 } from "./proof";

interface DiagramInput {
  readonly qlId: string;
  readonly seed: number;
  readonly scenarioId: string;
  readonly locale: SylLocale;
  readonly displayedPremises: readonly SurfacePremise[];
  readonly assignment: TermAssignment;
  readonly correctOptionIndex: number;
  readonly correctOptionText: string;
  readonly core: SylStructuredProofCoreV3;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

const POSITIONS: readonly Point[] = Object.freeze([
  { x: 150, y: 180 },
  { x: 480, y: 125 },
  { x: 810, y: 180 },
  { x: 290, y: 310 },
  { x: 670, y: 310 },
]);

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function safeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

function short(value: string, limit = 28): string {
  const chars = [...value];
  return chars.length <= limit ? value : `${chars.slice(0, limit - 1).join("")}…`;
}

function termLabel(termId: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[termId]?.labels[locale] ?? termId;
}

function premiseRelationLabel(premise: SurfacePremise, locale: SylLocale): string {
  const english = (() => {
    switch (premise.form) {
      case "ALL": return "all → inside";
      case "NO": return "no overlap";
      case "SOME": return "some overlap";
      case "SOME_NOT": return "some outside";
      case "ONLY": return "only: direction reverses";
      case "ARE_ONLY": return "all → inside";
      case "A_FEW": return "at least one overlap";
      case "ONLY_A_FEW": return "overlap + outside witness";
      case "NOT_ALL": return "at least one outside";
      case "IDENTITY": return "same class";
      case "FEW": return "unsupported FEW";
    }
  })();
  if (locale === "hi-IN") {
    const map: Record<typeof english, string> = {
      "all → inside": "सभी → अंदर",
      "no overlap": "कोई साझा भाग नहीं",
      "some overlap": "कुछ साझा",
      "some outside": "कुछ बाहर",
      "only: direction reverses": "केवल: दिशा उलटी",
      "at least one overlap": "कम-से-कम एक साझा",
      "overlap + outside witness": "साझा + बाहर सदस्य",
      "at least one outside": "कम-से-कम एक बाहर",
      "same class": "एक ही वर्ग",
      "unsupported FEW": "FEW असमर्थित",
    };
    return map[english];
  }
  if (locale === "pa-IN") {
    const map: Record<typeof english, string> = {
      "all → inside": "ਸਾਰੇ → ਅੰਦਰ",
      "no overlap": "ਕੋਈ ਸਾਂਝ ਨਹੀਂ",
      "some overlap": "ਕੁਝ ਸਾਂਝ",
      "some outside": "ਕੁਝ ਬਾਹਰ",
      "only: direction reverses": "ਕੇਵਲ: ਦਿਸ਼ਾ ਉਲਟੀ",
      "at least one overlap": "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਾਂਝ",
      "overlap + outside witness": "ਸਾਂਝ + ਬਾਹਰ ਮੈਂਬਰ",
      "at least one outside": "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਬਾਹਰ",
      "same class": "ਇੱਕੋ ਵਰਗ",
      "unsupported FEW": "FEW ਅਸਮਰਥਿਤ",
    };
    return map[english];
  }
  return english;
}

function relationLine(
  premise: SurfacePremise,
  index: number,
  points: Readonly<Record<TermId, Point>>,
  locale: SylLocale,
  markerId: string,
): string {
  const from = points[premise.subject];
  const to = points[premise.predicate];
  if (!from || !to) return "";
  const midpointX = (from.x + to.x) / 2;
  const midpointY = (from.y + to.y) / 2 - 8 - (index % 2) * 14;
  const dashed = premise.form === "NO" || premise.form === "SOME_NOT" || premise.form === "NOT_ALL";
  const arrow = ["ALL", "ONLY", "ARE_ONLY"].includes(premise.form);
  return [
    `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#334155" stroke-width="2.5" ${dashed ? 'stroke-dasharray="7 6"' : ""} ${arrow ? `marker-end="url(#${markerId})"` : ""}/>` ,
    `<rect x="${midpointX - 84}" y="${midpointY - 15}" width="168" height="24" rx="12" fill="#ffffff" stroke="#cbd5e1"/>`,
    `<text x="${midpointX}" y="${midpointY + 2}" text-anchor="middle" font-size="13" font-weight="700" fill="#334155">${escapeXml(short(premiseRelationLabel(premise, locale), 24))}</text>`,
  ].join("");
}

function modelLines(model: SylProofModelSnapshotV3 | null): readonly string[] {
  if (!model) return Object.freeze([]);
  return Object.freeze(model.occupiedRegions.map((region) => {
    const members = region.memberLabels.length > 0 ? region.memberLabels.join(", ") : "outside all named classes";
    return `${region.witnessId}: ${members}`;
  }));
}

function modelPanel(
  model: SylProofModelSnapshotV3 | null,
  x: number,
  y: number,
  width: number,
  locale: SylLocale,
): string {
  if (!model) return "";
  const title = modelStateLabel(model.purpose, locale);
  const lines = modelLines(model).slice(0, 5);
  const height = 58 + Math.max(1, lines.length) * 24;
  return [
    `<g>` ,
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="14" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>`,
    `<text x="${x + 16}" y="${y + 26}" font-size="15" font-weight="800" fill="#0f172a">${escapeXml(short(title, 44))}</text>`,
    ...(lines.length > 0 ? lines : [locale === "en-IN" ? "No witness row is required." : locale === "hi-IN" ? "अलग सदस्य पंक्ति आवश्यक नहीं है।" : "ਵੱਖ ਮੈਂਬਰ ਲਾਈਨ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"]).map((line, index) =>
      `<text x="${x + 18}" y="${y + 54 + index * 24}" font-size="14" fill="#334155">${escapeXml(short(line, 54))}</text>`),
    `</g>`,
  ].join("");
}

function titleCopy(locale: SylLocale, optionIndex: number): string {
  if (locale === "hi-IN") return `विकल्प ${optionIndex} क्यों सही है — संयुक्त संबंध आरेख`;
  if (locale === "pa-IN") return `ਵਿਕਲਪ ${optionIndex} ਕਿਉਂ ਸਹੀ ਹੈ — ਜੋੜਿਆ ਸੰਬੰਧ ਚਿੱਤਰ`;
  return `Why Option ${optionIndex} is correct — combined relation diagram`;
}

function relationHeading(locale: SylLocale): string {
  if (locale === "hi-IN") return "सभी प्रासंगिक कथन एक ही संबंध मानचित्र में";
  if (locale === "pa-IN") return "ਸਾਰੇ ਸੰਬੰਧਿਤ ਕਥਨ ਇੱਕੋ ਸੰਬੰਧ ਨਕਸ਼ੇ ਵਿੱਚ";
  return "All relevant statements in one relation map";
}

function proofHeading(locale: SylLocale): string {
  if (locale === "hi-IN") return "सही विकल्प का दृश्य प्रमाण";
  if (locale === "pa-IN") return "ਸਹੀ ਵਿਕਲਪ ਦਾ ਦ੍ਰਿਸ਼ ਪ੍ਰਮਾਣ";
  return "Visual proof of the correct option";
}

export function renderCombinedDiagramV3(input: DiagramInput): SylCombinedDiagramSpecV3 {
  const relevantPremiseIds = Object.freeze(input.displayedPremises.map((premise) => premise.premiseId));
  const termIds = Object.freeze([...new Set(input.displayedPremises.flatMap((premise) => [premise.subject, premise.predicate]))].slice(0, POSITIONS.length));
  const points: Record<TermId, Point> = {};
  termIds.forEach((termId, index) => { points[termId] = POSITIONS[index]!; });
  const idBase = safeId(`syl-diagram-${input.locale}-${input.qlId}-seed-${input.seed}-${input.scenarioId}-v3`);
  const titleId = `${idBase}-title`;
  const descriptionId = `${idBase}-desc`;
  const markerId = `${idBase}-arrow`;
  const correctOptionNumber = input.correctOptionIndex + 1;
  const title = titleCopy(input.locale, correctOptionNumber);
  const textAlternative = `${title}. ${input.core.combinedRelation}`;
  const isTwoState = input.core.diagramMode === "POSSIBLE_NOT_DEFINITE_TWO_STATE_MODEL";
  const graphBottom = 385;
  const modelY = 460;
  const proofLines = input.core.correctOptionProof.reasoningSteps.slice(0, 4);
  const panelHeight = isTwoState ? 190 : 165;
  const height = modelY + panelHeight + 145;

  const premiseEdges = input.displayedPremises.map((premise, index) =>
    relationLine(premise, index, points, input.locale, markerId)).join("");
  const nodes = termIds.map((termId, index) => {
    const point = points[termId]!;
    const value = termLabel(termId, input.locale, input.assignment);
    return `<g data-term-id="${escapeXml(termId)}"><rect x="${point.x - 78}" y="${point.y - 28}" width="156" height="56" rx="18" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-size="16" font-weight="800" fill="#1e3a8a">${escapeXml(short(value, 18))}</text></g>`;
  }).join("");

  const modelSvg = isTwoState
    ? [
      modelPanel(input.core.satisfyingModel, 45, modelY, 420, input.locale),
      modelPanel(input.core.counterModel, 495, modelY, 420, input.locale),
    ].join("")
    : modelPanel(input.core.satisfyingModel ?? input.core.counterModel, 175, modelY, 610, input.locale);

  const proofTextY = modelY + panelHeight + 5;
  const proofText = proofLines.map((line, index) =>
    `<text x="70" y="${proofTextY + index * 24}" font-size="14" fill="#334155">${escapeXml(`${index + 1}. ${short(line, 104)}`)}</text>`).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" lang="${input.locale}" aria-labelledby="${titleId} ${descriptionId}" viewBox="0 0 960 ${height}" width="960" height="${height}" data-diagram-version="syl-combined-diagram-v3" data-diagram-count="1" data-correct-option-only="true" data-all-relevant-premises="true">
<title id="${titleId}">${escapeXml(title)}</title>
<desc id="${descriptionId}">${escapeXml(textAlternative)}</desc>
<defs><marker id="${markerId}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#334155"/></marker></defs>
<rect x="1" y="1" width="958" height="${height - 2}" rx="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
<text x="480" y="38" text-anchor="middle" font-size="21" font-weight="900" fill="#0f172a">${escapeXml(short(title, 72))}</text>
<text x="480" y="72" text-anchor="middle" font-size="15" font-weight="800" fill="#475569">${escapeXml(relationHeading(input.locale))}</text>
<g data-integrated-premise-map="true">${premiseEdges}${nodes}</g>
<line x1="35" y1="${graphBottom}" x2="925" y2="${graphBottom}" stroke="#cbd5e1"/>
<rect x="45" y="405" width="870" height="44" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
<text x="65" y="433" font-size="16" font-weight="900" fill="#166534">${escapeXml(`${proofHeading(input.locale)}: ${short(input.correctOptionText, 66)}`)}</text>
${modelSvg}
${proofText}
</svg>`;

  return Object.freeze({
    diagramCount: 1,
    mode: input.core.diagramMode,
    correctOptionOnly: true,
    allRelevantPremisesIncluded: true,
    relevantPremiseIds,
    correctOptionDisplayIndex: correctOptionNumber,
    correctOptionText: input.correctOptionText,
    premises: Object.freeze([...input.displayedPremises]),
    focusedConclusions: input.core.focusedConclusions,
    satisfyingModel: input.core.satisfyingModel,
    counterModel: input.core.counterModel,
    titleId,
    descriptionId,
    textAlternative,
    svg,
  });
}
