import type { Caselet, Clue, GroupId } from "./index.ts";
import {
  generateLp001BatchStabilizedV4,
  generateLp002BatchStabilizedV4,
  generateLp003BatchStabilizedV4,
  generateLp004BatchStabilizedV4,
  generateLp005BatchStabilizedV4,
  generateLp006BatchStabilizedV4,
  generateLp007BatchStabilizedV4,
  generateLp008BatchStabilizedV4,
} from "./lp-001-008-stabilized-english-v4.ts";

export const LP_001_008_STABILIZED_ENGLISH_V4_1 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V4_1" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V4" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  lp001ExclusionRender: "BINARY_EITHER_OR" as const,
  scope: "LP001_THREE_GROUP_NEGATIVE_EXCLUSIONS_ONLY" as const,
  changesPuzzleSemantics: false as const,
  changesClueSemantics: false as const,
  changesLearnerFacingClueCopy: true as const,
  changesOptions: false as const,
  changesAnswers: false as const,
  changesCorrectIndex: false as const,
  changesDifficulty: false as const,
});

function eitherOrText(caselet: Caselet, clue: Extract<Clue, { kind: "NOT_IN_GROUP" }>): string {
  const allowed = caselet.groups.filter((group): group is GroupId => group !== clue.group);
  if (allowed.length !== 2) throw new Error(`LP-001 either/or rendering expected exactly two allowed groups for ${clue.person}.`);
  return `${clue.person} is assigned to either ${caselet.groupLabels[allowed[0]!]} or ${caselet.groupLabels[allowed[1]!]}.`;
}

function rewriteAll(text: string, replacements: readonly [string, string][]): string {
  return replacements.reduce((current, [before, after]) => current.replaceAll(before, after), text);
}

function rewriteLp001Caselet(caselet: Caselet): Caselet {
  const replacements: Array<[string, string]> = [];
  const clues = caselet.clues.map((clue) => {
    if (clue.kind !== "NOT_IN_GROUP") return clue;
    const text = eitherOrText(caselet, clue);
    replacements.push([clue.text, text]);
    return { ...clue, text };
  });

  const children = caselet.children.map((child) => ({
    ...child,
    stem: rewriteAll(child.stem, replacements),
    explanation: {
      ...child.explanation,
      lines: child.explanation.lines.map((line) => rewriteAll(line, replacements)),
    },
  }));

  return { ...caselet, clues, children };
}

export function generateLp001BatchStabilizedV4_1(seed = "lp-001-stabilized-v4-1", count = 8): Caselet[] {
  return generateLp001BatchStabilizedV4(seed, count).map(rewriteLp001Caselet);
}

export const generateLp002BatchStabilizedV4_1 = generateLp002BatchStabilizedV4;
export const generateLp003BatchStabilizedV4_1 = generateLp003BatchStabilizedV4;
export const generateLp004BatchStabilizedV4_1 = generateLp004BatchStabilizedV4;
export const generateLp005BatchStabilizedV4_1 = generateLp005BatchStabilizedV4;
export const generateLp006BatchStabilizedV4_1 = generateLp006BatchStabilizedV4;
export const generateLp007BatchStabilizedV4_1 = generateLp007BatchStabilizedV4;
export const generateLp008BatchStabilizedV4_1 = generateLp008BatchStabilizedV4;
