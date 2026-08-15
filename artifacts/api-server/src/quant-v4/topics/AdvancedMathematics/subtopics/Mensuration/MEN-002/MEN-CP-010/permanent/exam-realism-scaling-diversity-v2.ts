import type { MenCp010PermanentQlId } from "./allocation";
import {
  MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
  type MenCp010ExamRealismOverlay,
} from "./exam-realism-sources-v2";

const LABELS = ["A", "B", "C", "D"] as const;
const VOLUME_CHANGES = [
  [-10,20],[10,-10],[20,-20],[-20,25],[25,-20],[-25,20],
  [15,10],[-15,-10],[30,-25],[-30,40],[5,20],[20,5],
] as const;
const AREA_LINEAR_CHANGES = [-30,-25,-20,-15,-10,-5,5,10,12.5,15,20,25,30,40,50] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
function tidy(value: number) { return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""); }
function changeText(change: number) { return `${tidy(Math.abs(change))}% ${change >= 0 ? "increase" : "decrease"}`; }

function makeOptions(targetIndex: number, answer: string, wrong: readonly string[]) {
  const unique = [...new Set(wrong.filter((value) => value !== answer))];
  if (unique.length < 3) throw new Error(`CP010 scaling distractors collapsed for ${answer}`);
  let w = 0;
  return LABELS.map((label,index) => index === targetIndex
    ? { label, display: answer, isCorrect: true, misconceptionId: null }
    : { label, display: unique[w]!, isCorrect: false, misconceptionId: `SCALING_DISTRACTOR_${++w}` });
}

export function diversifyMenCp010ScalingOverlayV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
  overlay: MenCp010ExamRealismOverlay | null,
): MenCp010ExamRealismOverlay | null {
  if (qlId === "MEN-002-QL-145") {
    if (!seed.includes("review-v2") && !seed.includes("exam-v2") && hash(`${seed}:volume-scaling-diversity`) % 3 !== 0) return overlay;
    const [sidePct,heightPct] = VOLUME_CHANGES[hash(`${seed}:volume-change-pair`) % VOLUME_CHANGES.length]!;
    const sideFactor = 1 + sidePct/100;
    const heightFactor = 1 + heightPct/100;
    const factor = sideFactor*sideFactor*heightFactor;
    const change = (factor-1)*100;
    const answer = changeText(change);
    const naive = sidePct + heightPct;
    const oneSide = (sideFactor*heightFactor-1)*100;
    const linearised = 2*sidePct + heightPct;
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
      qlId,
      sourceId: "EXAM-V2-PYRAMID-NONUNIFORM-VOLUME-SCALING",
      stem: `The side of the square base of a right pyramid is ${sidePct>=0?"increased":"decreased"} by ${Math.abs(sidePct)}% while its vertical height is ${heightPct>=0?"increased":"decreased"} by ${Math.abs(heightPct)}%. Find the percentage change in its volume.`,
      answer,
      options: makeOptions(targetIndex, answer, [changeText(naive), changeText(oneSide), changeText(linearised)]),
      explanation: {
        keyRule: "For a square-base pyramid V ∝ a²h, so the side factor is squared and the height factor is used once.",
        steps: [
          { title: "Read the given values", body: `Base-side factor = ${tidy(sideFactor)} and height factor = ${tidy(heightFactor)}.` },
          { title: "Choose the formula", body: "New volume factor = (base-side factor)² × (height factor)." },
          { title: "Substitute and calculate", body: `${tidy(sideFactor)}²×${tidy(heightFactor)} = ${tidy(factor)}. Hence the volume shows a ${answer}.` },
          { title: "Check the result", body: `Applying the two dimension changes multiplicatively gives the same factor ${tidy(factor)}.` },
        ],
        shortcut: "For a square base, count the side change twice multiplicatively, then apply the height change.",
        traps: ["Do not simply add the two percentage changes.", "Do not apply the base-side change only once; base area varies as a²."],
      },
      verification: { valid: Number.isFinite(change), method: "V∝a²h with independent percentage scale factors" },
    };
  }

  if (qlId === "MEN-002-QL-146") {
    if (!seed.includes("review-v2") && !seed.includes("exam-v2") && hash(`${seed}:area-scaling-diversity`) % 3 !== 0) return overlay;
    const pct = AREA_LINEAR_CHANGES[hash(`${seed}:linear-change`) % AREA_LINEAR_CHANGES.length]!;
    const k = 1 + pct/100;
    const areaFactor = k*k;
    const change = (areaFactor-1)*100;
    const answer = changeText(change);
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
      qlId,
      sourceId: "EXAM-V2-SIMILAR-AREA-PERCENT-SCALING-DIVERSE",
      stem: `Every corresponding linear dimension of a similar pyramid is ${pct>=0?"increased":"decreased"} by ${Math.abs(pct)}%. Find the percentage change in its total surface area.`,
      answer,
      options: makeOptions(targetIndex, answer, [changeText(pct), changeText((k**3-1)*100), changeText(2*pct)]),
      explanation: {
        keyRule: "For similar solids, surface area scales as the square of the linear scale factor.",
        steps: [
          { title: "Read the given values", body: `Linear scale factor k = ${tidy(k)}.` },
          { title: "Choose the formula", body: "New surface-area factor = k²." },
          { title: "Substitute and calculate", body: `Area factor = ${tidy(k)}² = ${tidy(areaFactor)}. Therefore the total surface area shows a ${answer}.` },
          { title: "Check the result", body: `The square-law scaling gives factor ${tidy(areaFactor)}, consistent with ${answer}.` },
        ],
        shortcut: "Convert the linear percentage to a scale factor and square it.",
        traps: ["Do not use the linear percentage unchanged for area.", "Cube the scale factor only for volume."],
      },
      verification: { valid: Number.isFinite(change), method: "surface-area scaling by k²" },
    };
  }

  return overlay;
}
