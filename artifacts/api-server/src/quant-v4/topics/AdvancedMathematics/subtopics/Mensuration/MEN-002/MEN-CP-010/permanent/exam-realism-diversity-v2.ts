import type { MenCp010PermanentQlId } from "./allocation";
import {
  MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
  type MenCp010ExamRealismOverlay,
} from "./exam-realism-sources-v2";

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function diversifyMenCp010ExamRealismOverlayV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
  overlay: MenCp010ExamRealismOverlay | null,
): MenCp010ExamRealismOverlay | null {
  if (
    !overlay ||
    qlId !== "MEN-002-QL-136" ||
    overlay.sourceId !== "EXAM-V2-PYRAMID-CUT-PART-VOLUME-RATIO"
  ) return overlay;

  // V1 exam overlay used only n=2,3,4. Setter review exhausted those states.
  // Keep the same reasoning contract while widening the valid parallel-cut
  // fractions to 1/n for n=2..9.
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
