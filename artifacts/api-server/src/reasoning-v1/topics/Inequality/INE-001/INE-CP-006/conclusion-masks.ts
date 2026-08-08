import type { IneCp006ConclusionMask } from "./types";

const TWO_CONCLUSION_MASKS: readonly IneCp006ConclusionMask[] = [
  "ONLY_I",
  "ONLY_II",
  "BOTH",
  "NEITHER",
];

const THREE_CONCLUSION_MASKS: readonly IneCp006ConclusionMask[] = [
  "ONLY_I",
  "ONLY_II",
  "ONLY_III",
  "I_AND_II",
  "I_AND_III",
  "II_AND_III",
  "ALL_THREE",
  "NEITHER",
];

export function conclusionMasksForCount(
  count: 2 | 3,
): readonly IneCp006ConclusionMask[] {
  return count === 2 ? TWO_CONCLUSION_MASKS : THREE_CONCLUSION_MASKS;
}

export function truthPatternForConclusionMask(
  mask: IneCp006ConclusionMask,
  count: 2 | 3,
): readonly boolean[] {
  if (count === 2) {
    if (mask === "ONLY_I") return [true, false];
    if (mask === "ONLY_II") return [false, true];
    if (mask === "BOTH") return [true, true];
    if (mask === "NEITHER") return [false, false];
    throw new Error(`${mask} is not valid for two conclusions.`);
  }
  if (mask === "ONLY_I") return [true, false, false];
  if (mask === "ONLY_II") return [false, true, false];
  if (mask === "ONLY_III") return [false, false, true];
  if (mask === "I_AND_II") return [true, true, false];
  if (mask === "I_AND_III") return [true, false, true];
  if (mask === "II_AND_III") return [false, true, true];
  if (mask === "ALL_THREE") return [true, true, true];
  if (mask === "NEITHER") return [false, false, false];
  throw new Error(`${mask} is not valid for three conclusions.`);
}

export function conclusionMaskForTruths(
  truths: readonly boolean[],
): IneCp006ConclusionMask {
  const key = truths.map((truth) => (truth ? "1" : "0")).join("");
  const maskByKey: Readonly<Record<string, IneCp006ConclusionMask>> = {
    "10": "ONLY_I",
    "01": "ONLY_II",
    "11": "BOTH",
    "00": "NEITHER",
    "100": "ONLY_I",
    "010": "ONLY_II",
    "001": "ONLY_III",
    "110": "I_AND_II",
    "101": "I_AND_III",
    "011": "II_AND_III",
    "111": "ALL_THREE",
    "000": "NEITHER",
  };
  const mask = maskByKey[key];
  if (!mask) throw new Error(`Unsupported conclusion truth pattern ${key}.`);
  return mask;
}

export function conclusionMaskLabel(
  mask: IneCp006ConclusionMask,
  count: 2 | 3,
): string {
  if (mask === "ONLY_I") return "Only conclusion I follows";
  if (mask === "ONLY_II") return "Only conclusion II follows";
  if (mask === "ONLY_III") return "Only conclusion III follows";
  if (mask === "BOTH") return "Both conclusions I and II follow";
  if (mask === "I_AND_II") return "Only conclusions I and II follow";
  if (mask === "I_AND_III") return "Only conclusions I and III follow";
  if (mask === "II_AND_III") return "Only conclusions II and III follow";
  if (mask === "ALL_THREE") return "All three conclusions follow";
  return count === 2
    ? "Neither conclusion I nor conclusion II follows"
    : "None of the conclusions follow";
}
