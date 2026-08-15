import type { MenCp010PermanentQlId } from "./allocation";
import {
  MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
  type MenCp010ExamRealismOverlay,
} from "./exam-realism-sources-v2";

const LABELS = ["A", "B", "C", "D"] as const;
const VESSELS = [
  [14,7,18],[14,7,21],[14,7,24],[14,7,27],[14,7,30],
  [12,6,24],[12,6,30],[10,5,28],[16,8,21],[18,9,20],
  [15,10,24],[20,10,15],[18,12,15],[21,14,10],[15,5,21],
] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
function tidy(value: number) { return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""); }

export function diversifyMenCp010CapacityOverlayV2(
  qlId: MenCp010PermanentQlId,
  seed: string,
  targetIndex: number,
  overlay: MenCp010ExamRealismOverlay | null,
): MenCp010ExamRealismOverlay | null {
  if (
    !overlay ||
    qlId !== "MEN-002-QL-143" ||
    overlay.sourceId !== "EXAM-V2-FRUSTUM-BUCKET-CAPACITY"
  ) return overlay;

  const [R,r,h] = VESSELS[hash(`${seed}:capacity-vessel`) % VESSELS.length]!;
  const cm3 = (22/7) * h * (R*R + R*r + r*r) / 3;
  const litres = cm3 / 1000;
  const answer = `${tidy(litres)} litres`;
  if (!(litres > 1 && litres < 30)) throw new Error(`Unrealistic CP010 capacity state: ${answer}`);
  const wrong = [
    `${tidy(cm3)} litres`,
    `${tidy(litres*3)} litres`,
    `${tidy(litres/10)} litres`,
  ];
  let w = 0;
  const options = LABELS.map((label, index) => {
    if (index === targetIndex) return { label, display: answer, isCorrect: true, misconceptionId: null };
    const misconceptionId = ["MISS_CM3_TO_LITRE","OMIT_ONE_THIRD","WRONG_CONVERSION"][w]!;
    return { label, display: wrong[w++]!, isCorrect: false, misconceptionId };
  });

  return {
    authority: MEN_CP_010_EXAM_REALISM_SOURCES_V2_AUTHORITY,
    qlId,
    sourceId: overlay.sourceId,
    stem: `A bucket is shaped like a conical frustum with top radius ${R} cm, bottom radius ${r} cm and vertical height ${h} cm. Using π = 22/7, find its capacity in litres.`,
    answer,
    options,
    explanation: {
      keyRule: "Find the conical-frustum volume in cubic centimetres, then convert to litres.",
      steps: [
        { title: "Read the given values", body: `R = ${R} cm, r = ${r} cm, h = ${h} cm and π = 22/7.` },
        { title: "Choose the formula", body: "V = πh(R²+Rr+r²)/3 and 1000 cm³ = 1 litre." },
        { title: "Substitute and calculate", body: `V = (22/7)×${h}×(${R}²+${R}×${r}+${r}²)/3 = ${tidy(cm3)} cm³. Capacity = ${tidy(cm3)}/1000 = ${answer}.` },
        { title: "Check the result", body: `The dimensions give a practical vessel capacity of ${answer}.` },
      ],
      shortcut: "Complete the volume in cm³ first; perform the litre conversion only at the end.",
      traps: ["Do not report cm³ directly as litres.", "Do not omit the mixed Rr term or the one-third factor."],
    },
    verification: { valid: true, method: "frustum volume with π=22/7 and explicit cm³-to-litre conversion" },
  };
}
