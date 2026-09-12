import type { Caselet } from "./index.ts";
import type { Lp002Caselet } from "./lp-002.ts";
import type { Lp003Caselet } from "./lp-003.ts";
import type { Lp004Caselet } from "./lp-004.ts";
import type { Lp005Caselet } from "./lp-005.ts";
import type { Lp006Caselet } from "./lp-006.ts";
import type { Lp007Caselet } from "./lp-007.ts";
import type { Lp008Caselet } from "./lp-008.ts";
import {
  generateLp001BatchStabilizedV3_1,
  generateLp002BatchStabilizedV3_1,
  generateLp003BatchStabilizedV3_1,
  generateLp004BatchStabilizedV3_1,
  generateLp005BatchStabilizedV3_1,
  generateLp006BatchStabilizedV3_1,
  generateLp007BatchStabilizedV3_1,
  generateLp008BatchStabilizedV3_1,
} from "./lp-001-008-stabilized-english-v3-1.ts";

export const LP_001_008_STABILIZED_ENGLISH_V3_2 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V3_2" as const,
  parentAuthority: "LP_001_008_STABILIZED_ENGLISH_V3_1" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  explanationStyle: "SIMPLE_VARIED_LANGUAGE_WITH_CASE_TABLES" as const,
  caseDisplay: "MARKDOWN_TABLE" as const,
  changesPuzzleSemantics: false as const,
  changesStem: false as const,
  changesClues: false as const,
  changesOptions: false as const,
  changesAnswer: false as const,
  changesCorrectIndex: false as const,
  changesDifficulty: false as const,
});

type ExplanationCaselet = {
  caseletId?: string;
  children: readonly {
    explanation: { summary: string; lines: string[] };
    [key: string]: unknown;
  }[];
  [key: string]: unknown;
};

const FIXED_PHRASES = [
  "So we can fix: ",
  "From this, we get: ",
  "This gives us: ",
  "Therefore, we can place: ",
] as const;

const HOLD_PHRASES = [
  "This clue does not decide anything alone. Keep it with the other clues.",
  "No complete entry is fixed yet. We will use this clue with the next clue.",
  "This clue only narrows the arrangement for now. Keep it in mind.",
  "Nothing is fully fixed from this clue alone. Use it with the remaining clues.",
] as const;

const CASE_INTROS = [
  "At this point, two cases are possible for",
  "Now we have two possible cases for",
  "The remaining choice gives two cases for",
  "We now compare two cases for",
] as const;

const RESOLUTIONS = [
  "Apply this clue to both cases. Case 2 breaks the clue, so remove it. Case 1 remains.",
  "Now check both cases. Case 2 is not possible with this clue. Therefore, keep Case 1.",
  "This clue removes Case 2. So Case 1 is the valid case, and the remaining entries follow.",
  "Compare the two cases with this clue. Case 2 conflicts with it, so cross out Case 2 and keep Case 1.",
] as const;

const STEP_VERBS = ["Use this clue", "Apply this clue", "Work with this clue", "Read this clue"] as const;

function hash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(values: readonly T[], key: string): T {
  return values[hash(key) % values.length]!;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").trim();
}

function convertCaseBlock(line: string, key: string): string {
  const pattern = /Now check two cases for ([^:\n]+):\n\n\*\*Case 1:\*\* ([\s\S]+?)\n\n\*\*Case 2:\*\* ([^\n]+)(?=$|\n)/u;
  const match = line.match(pattern);
  if (!match) return line;
  const subject = match[1]!.trim();
  const case1 = escapeCell(match[2]!);
  const case2 = escapeCell(match[3]!);
  const intro = `${pick(CASE_INTROS, `${key}:case-intro`)} **${subject}**:`;
  const table = [
    "| Case | Possibility |",
    "|---|---|",
    `| Case 1 | ${case1} |`,
    `| Case 2 | ${case2} |`,
  ].join("\n");
  return line.replace(pattern, `${intro}\n\n${table}`);
}

function varyLine(line: string, key: string): string {
  let result = line;

  result = result.replace(/\*\*Step (\d+): Use the clue —/u, (_match, stepNumber: string) =>
    `**Step ${stepNumber}: ${pick(STEP_VERBS, `${key}:step:${stepNumber}`)} —`);

  result = result.replace(
    "Using this clue with the earlier clues, we get: ",
    pick(FIXED_PHRASES, `${key}:fixed`),
  );

  result = result.replace(
    "This clue alone does not fix an entry. Keep it for the next step.",
    pick(HOLD_PHRASES, `${key}:hold`),
  );

  result = convertCaseBlock(result, key);

  result = result.replace(
    "Check both cases with this clue. Case 2 breaks the clue, so reject it. Keep Case 1. The remaining entries are then fixed.",
    pick(RESOLUTIONS, `${key}:resolution`),
  );

  return result;
}

function restyle<T extends ExplanationCaselet>(caselet: T, packageId: string): T {
  const caseletKey = `${packageId}:${caselet.caseletId ?? "caselet"}`;
  return {
    ...caselet,
    children: caselet.children.map((child, childIndex) => ({
      ...child,
      explanation: {
        ...child.explanation,
        lines: child.explanation.lines.map((line, lineIndex) =>
          varyLine(line, `${caseletKey}:child:${childIndex}:line:${lineIndex}`)),
      },
    })),
  } as T;
}

export function generateLp001BatchStabilizedV3_2(seed = "lp-001-stabilized-v3-2", count = 8): Caselet[] { return generateLp001BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-001")); }
export function generateLp002BatchStabilizedV3_2(seed = "lp-002-stabilized-v3-2", count = 8): Lp002Caselet[] { return generateLp002BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-002")); }
export function generateLp003BatchStabilizedV3_2(seed = "lp-003-stabilized-v3-2", count = 8): Lp003Caselet[] { return generateLp003BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-003")); }
export function generateLp004BatchStabilizedV3_2(seed = "lp-004-stabilized-v3-2", count = 8): Lp004Caselet[] { return generateLp004BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-004")); }
export function generateLp005BatchStabilizedV3_2(seed = "lp-005-stabilized-v3-2", count = 8): Lp005Caselet[] { return generateLp005BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-005")); }
export function generateLp006BatchStabilizedV3_2(seed = "lp-006-stabilized-v3-2", count = 8): Lp006Caselet[] { return generateLp006BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-006")); }
export function generateLp007BatchStabilizedV3_2(seed = "lp-007-stabilized-v3-2", count = 8): Lp007Caselet[] { return generateLp007BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-007")); }
export function generateLp008BatchStabilizedV3_2(seed = "lp-008-stabilized-v3-2", count = 8): Lp008Caselet[] { return generateLp008BatchStabilizedV3_1(seed, count).map((caselet) => restyle(caselet, "LP-008")); }
