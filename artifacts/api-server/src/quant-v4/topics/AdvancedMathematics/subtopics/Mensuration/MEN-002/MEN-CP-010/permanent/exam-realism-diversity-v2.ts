import type { MenCp010PermanentQlId } from "./allocation";
import {
  MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
  type MenCp010ExamRealismOverlay,
} from "./exam-realism-sources-v2";

const LABELS = ["A", "B", "C", "D"] as const;
const RATIO_PAIRS = [[2,3],[3,4],[4,5],[5,6],[2,5],[3,5],[4,7],[5,8],[3,7],[5,9],[7,9],[7,10]] as const;

export const MEN_CP_010_RATIO_DIVERSITY_SOURCE_IDS = [
  { qlId: "MEN-002-QL-137" as const, sourceId: "EXAM-V2-SIMILAR-AREA-RATIO-DIVERSE" },
  { qlId: "MEN-002-QL-138" as const, sourceId: "EXAM-V2-SIMILAR-LINEAR-FROM-VOLUME-DIVERSE" },
  { qlId: "MEN-002-QL-139" as const, sourceId: "EXAM-V2-SIMILAR-LINEAR-FROM-AREA-DIVERSE" },
] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function ratioOptions(targetIndex: number, answer: string, wrong: readonly string[], ids: readonly string[]) {
  const unique = [...new Set(wrong.filter((value) => value !== answer))];
  if (unique.length < 3) throw new Error(`CP010 ratio diversity distractors collapsed for ${answer}`);
  let w = 0;
  return LABELS.map((label, index) => {
    if (index === targetIndex) return { label, display: answer, isCorrect: true, misconceptionId: null };
    const position = w++;
    return { label, display: unique[position]!, isCorrect: false, misconceptionId: ids[position] ?? `RATIO_DISTRACTOR_${position+1}` };
  });
}

function ratioOverlay(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
): MenCp010ExamRealismOverlay | null {
  if (!["MEN-002-QL-137","MEN-002-QL-138","MEN-002-QL-139"].includes(qlId)) return null;
  // Exam-specific seeds force the expanded SSC-style representation. Ordinary
  // review/runtime seeds mix it with the inherited source so both surfaces are audited.
  if (!seed.includes("exam-v2") && hash(`${seed}:ratio-diversity`) % 2 !== 0) return null;

  const [a,b] = RATIO_PAIRS[hash(`${seed}:ratio-pair`) % RATIO_PAIRS.length]!;
  const linear = `${a}:${b}`;
  const area = `${a*a}:${b*b}`;
  const volume = `${a*a*a}:${b*b*b}`;

  if (qlId === "MEN-002-QL-137") {
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
      qlId,
      sourceId: "EXAM-V2-SIMILAR-AREA-RATIO-DIVERSE",
      stem: `Two similar pyramids have corresponding heights in the ratio ${linear}. Find the ratio of their total surface areas.`,
      answer: area,
      options: ratioOptions(targetIndex, area, [linear, volume, `${b*b}:${a*a}`], ["USE_LINEAR_RATIO","USE_VOLUME_RATIO","REVERSE_RATIO"]),
      explanation: {
        keyRule: "For similar solids, corresponding surface areas vary as the square of the linear ratio.",
        steps: [
          { title: "Read the given values", body: `Corresponding linear ratio = ${linear}.` },
          { title: "Choose the formula", body: "Surface-area ratio = (linear ratio)²." },
          { title: "Substitute and calculate", body: `${a}²:${b}² = ${area}.` },
          { title: "Check the result", body: `Both dimensions scale consistently, so the required surface-area ratio is ${area}.` },
        ],
        shortcut: "Square both terms of the corresponding length ratio.",
        traps: ["Do not use the linear ratio unchanged.", "Cube the ratio only for volumes, not areas."],
      },
      verification: { valid: true, method: "square corresponding linear ratio" },
    };
  }

  if (qlId === "MEN-002-QL-138") {
    return {
      authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
      qlId,
      sourceId: "EXAM-V2-SIMILAR-LINEAR-FROM-VOLUME-DIVERSE",
      stem: `The volumes of two similar pyramids are in the ratio ${volume}. Find the ratio of their corresponding heights.`,
      answer: linear,
      options: ratioOptions(targetIndex, linear, [area, volume, `${b}:${a}`], ["TAKE_SQUARE_ROOT","USE_VOLUME_RATIO_DIRECTLY","REVERSE_RATIO"]),
      explanation: {
        keyRule: "For similar solids, volume ratio is the cube of the corresponding linear ratio.",
        steps: [
          { title: "Read the given values", body: `Volume ratio = ${volume}.` },
          { title: "Choose the formula", body: "Linear ratio = cube root of the volume ratio." },
          { title: "Substitute and calculate", body: `∛${a*a*a}:∛${b*b*b} = ${linear}.` },
          { title: "Check the result", body: `Cubing ${linear} reproduces ${volume}.` },
        ],
        shortcut: "Take the cube root of both ratio terms.",
        traps: ["Do not take a square root for volume ratios.", "Keep the order of the two solids unchanged."],
      },
      verification: { valid: true, method: "exact cube-root recovery" },
    };
  }

  return {
    authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
    qlId,
    sourceId: "EXAM-V2-SIMILAR-LINEAR-FROM-AREA-DIVERSE",
    stem: `The surface areas of two similar pyramids are in the ratio ${area}. Find the ratio of their corresponding heights.`,
    answer: linear,
    options: ratioOptions(targetIndex, linear, [volume, area, `${b}:${a}`], ["TAKE_CUBE_ROOT","USE_AREA_RATIO_DIRECTLY","REVERSE_RATIO"]),
    explanation: {
      keyRule: "For similar solids, surface-area ratio is the square of the corresponding linear ratio.",
      steps: [
        { title: "Read the given values", body: `Surface-area ratio = ${area}.` },
        { title: "Choose the formula", body: "Linear ratio = square root of the surface-area ratio." },
        { title: "Substitute and calculate", body: `√${a*a}:√${b*b} = ${linear}.` },
        { title: "Check the result", body: `Squaring ${linear} reproduces ${area}.` },
      ],
      shortcut: "Take the square root of both area-ratio terms.",
      traps: ["Do not take a cube root for area ratios.", "Keep the order of the two solids unchanged."],
    },
    verification: { valid: true, method: "exact square-root recovery" },
  };
}

export function diversifyMenCp010ExamRealismOverlayV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
  overlay: MenCp010ExamRealismOverlay | null,
): MenCp010ExamRealismOverlay | null {
  const ratio = ratioOverlay(qlId, seed, targetIndex);
  if (ratio) return ratio;

  if (
    !overlay ||
    qlId !== "MEN-002-QL-136" ||
    overlay.sourceId !== "EXAM-V2-PYRAMID-CUT-PART-VOLUME-RATIO"
  ) return overlay;

  const n = 2 + (hash(`${seed}:parallel-cut-denominator`) % 8);
  const lower = n ** 3 - 1;
  const answer = `${lower}:1`;
  const distractors = [`${n-1}:1`, `${n*n-1}:1`, `1:${lower}`];
  let wrongIndex = 0;
  const options = LABELS.map((label, index) => {
    if (index === targetIndex) return { label, display: answer, isCorrect: true, misconceptionId: null };
    const misconceptionId = ["USE_LINEAR_RATIO", "USE_AREA_RATIO", "REVERSE_RATIO"][wrongIndex]!;
    return { label, display: distractors[wrongIndex++]!, isCorrect: false, misconceptionId };
  });

  return {
    authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
    qlId,
    sourceId: overlay.sourceId,
    stem: `A pyramid is cut by a plane parallel to its base so that the height of the small pyramid above the cut is 1/${n} of the original height. Find the ratio of the volume of the lower frustum to the volume of the small top pyramid.`,
    answer,
    options,
    explanation: {
      keyRule: "The top pyramid is similar to the whole pyramid, so its volume fraction is the cube of the linear fraction.",
      steps: [
        { title: "Read the given values", body: `Top-to-whole linear ratio = 1:${n}.` },
        { title: "Choose the formula", body: "For similar solids, Vtop:Vwhole = 1:n³; then subtract the top part from the whole." },
        { title: "Substitute and calculate", body: `Vtop:Vwhole = 1:${n**3}. Therefore Vfrustum:Vtop = (${n**3}-1):1 = ${answer}.` },
        { title: "Check the result", body: `The two parts add back to ${n**3} equal top-volume units, so ${answer} is consistent.` },
      ],
      shortcut: "Cube the height ratio first, then take the complement.",
      traps: ["Do not use the linear ratio directly for volume.", "Keep the requested order: lower frustum first, top pyramid second."],
    },
    verification: { valid: lower + 1 === n**3, method: "similar-pyramid cube ratio followed by complement" },
  };
}
