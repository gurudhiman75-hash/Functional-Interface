import { normalizeWfmWord } from "./lexicon";
import type { WfmDifficulty } from "./types";

export interface WfmSelectedLetterFixture {
  readonly sourceWord: string;
  readonly positions: readonly number[];
  readonly acceptedWords: readonly string[];
}

export interface WfmRearrangementFixture {
  readonly mode: "JUMBLED_WORD" | "NUMBERED_SEQUENCE";
  readonly targetWord: string;
  readonly distractorWords?: readonly [string, string, string];
}

function signature(word: string): string {
  return [...normalizeWfmWord(word)].sort().join("");
}

function selectedLetters(fixture: WfmSelectedLetterFixture): string {
  const source = normalizeWfmWord(fixture.sourceWord);
  return fixture.positions.map((position) => source[position - 1] ?? "").join("");
}

export const WFM_SELECTED_LETTER_FIXTURES: readonly WfmSelectedLetterFixture[] = [
  { sourceWord: "TEACHER", positions: [2, 3, 4], acceptedWords: ["ACE"] },
  { sourceWord: "TRACE", positions: [2, 3, 4], acceptedWords: ["ARC", "CAR"] },
  { sourceWord: "STREAM", positions: [3, 4, 5], acceptedWords: ["ARE", "EAR", "ERA"] },
  { sourceWord: "EXQUISITE", positions: [2, 3, 7], acceptedWords: [] },
  { sourceWord: "STONE", positions: [2, 3, 4], acceptedWords: ["NOT", "TON"] },
  { sourceWord: "CABLE", positions: [1, 2, 3], acceptedWords: ["CAB"] },
  { sourceWord: "WONDER", positions: [1, 2, 3], acceptedWords: ["NOW", "OWN", "WON"] },
  { sourceWord: "GODOWN", positions: [1, 2, 3], acceptedWords: ["DOG", "GOD"] },
  { sourceWord: "MARKET", positions: [2, 3, 4], acceptedWords: ["ARK"] },
  { sourceWord: "RECOGNIZE", positions: [1, 3, 6, 7], acceptedWords: [] },
  { sourceWord: "PLANET", positions: [1, 2, 3, 5], acceptedWords: ["LEAP", "PALE", "PLEA"] },
  { sourceWord: "ELEVATE", positions: [1, 2, 5, 6], acceptedWords: ["LATE", "TALE", "TEAL"] },
  { sourceWord: "REACTION", positions: [1, 2, 3, 4], acceptedWords: ["ACRE", "CARE", "RACE"] },
] as const;

export function selectedFixtureLetters(fixture: WfmSelectedLetterFixture): string {
  return selectedLetters(fixture);
}

export function selectedFixtureDifficulty(fixture: WfmSelectedLetterFixture): WfmDifficulty {
  const count = fixture.acceptedWords.length;
  const selectedLength = selectedLetters(fixture).length;
  if (count <= 1) return "EASY";
  if (count === 2) return "MEDIUM";
  return selectedLength >= 4 ? "HARD" : "MEDIUM";
}

for (const fixture of WFM_SELECTED_LETTER_FIXTURES) {
  const letters = selectedLetters(fixture);
  for (const word of fixture.acceptedWords) {
    if (signature(word) !== signature(letters)) {
      throw new Error(`WFM selected-letter authority drift: ${fixture.sourceWord}/${fixture.positions.join(",")} -> ${word}`);
    }
  }
}

export const WFM_REARRANGEMENT_FIXTURES: readonly WfmRearrangementFixture[] = [
  { mode: "JUMBLED_WORD", targetWord: "CANDLE", distractorWords: ["GARDEN", "SILVER", "PLANET"] },
  { mode: "JUMBLED_WORD", targetWord: "GARDEN", distractorWords: ["CANDLE", "SILVER", "PLANET"] },
  { mode: "JUMBLED_WORD", targetWord: "SILVER", distractorWords: ["CANDLE", "GARDEN", "PLANET"] },
  { mode: "JUMBLED_WORD", targetWord: "PLANET", distractorWords: ["CANDLE", "GARDEN", "SILVER"] },
  { mode: "JUMBLED_WORD", targetWord: "ORANGE", distractorWords: ["CANDLE", "GARDEN", "SILVER"] },
  { mode: "JUMBLED_WORD", targetWord: "HOSPITAL", distractorWords: ["TRIANGLE", "NOTEBOOK", "LANGUAGE"] },
  { mode: "JUMBLED_WORD", targetWord: "COMPUTER", distractorWords: ["COMPLETE", "CONVINCE", "BUILDING"] },
  { mode: "JUMBLED_WORD", targetWord: "PAINTING", distractorWords: ["TEACHING", "BUILDING", "CROSSING"] },
  { mode: "JUMBLED_WORD", targetWord: "CONSERVATION", distractorWords: ["CONFIRMATION", "CONSTRUCTION", "DISTRIBUTION"] },
  { mode: "NUMBERED_SEQUENCE", targetWord: "GARDEN" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "SILVER" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "PLANET" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "BRIDGE" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "MARKET" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "TRIANGLE" },
  { mode: "NUMBERED_SEQUENCE", targetWord: "HOSPITAL" },
] as const;

function multisetOverlap(left: string, right: string): number {
  const a = normalizeWfmWord(left);
  const b = normalizeWfmWord(right);
  const counts = new Map<string, number>();
  for (const letter of a) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  let common = 0;
  for (const letter of b) {
    const available = counts.get(letter) ?? 0;
    if (available <= 0) continue;
    common += 1;
    counts.set(letter, available - 1);
  }
  return common / Math.max(a.length, b.length, 1);
}

export function rearrangementFixtureDifficulty(fixture: WfmRearrangementFixture): WfmDifficulty {
  const target = normalizeWfmWord(fixture.targetWord);
  if (fixture.mode === "NUMBERED_SEQUENCE") {
    return target.length >= 8 ? "HARD" : "MEDIUM";
  }
  const maxSimilarity = Math.max(...(fixture.distractorWords ?? []).map((word) => multisetOverlap(target, word)), 0);
  const repeatedTypes = [...new Set(target)].filter((letter) => target.split(letter).length - 1 > 1).length;
  const score = (target.length >= 8 ? 1 : 0) + (maxSimilarity >= 0.75 ? 1 : 0) + (repeatedTypes >= 2 ? 1 : 0);
  if (score >= 2) return "HARD";
  if (score === 1) return "MEDIUM";
  return "EASY";
}

for (const fixture of WFM_REARRANGEMENT_FIXTURES) {
  const target = normalizeWfmWord(fixture.targetWord);
  if (fixture.mode === "NUMBERED_SEQUENCE" && new Set(target).size !== target.length) {
    throw new Error(`Numbered WFM fixture must use unique target letters: ${target}`);
  }
  if (fixture.distractorWords) {
    for (const distractor of fixture.distractorWords) {
      if (signature(distractor) === signature(target)) {
        throw new Error(`WFM rearrangement distractor is also an anagram: ${target}/${distractor}`);
      }
      if (normalizeWfmWord(distractor).length !== target.length) {
        throw new Error(`WFM rearrangement options must have equal length: ${target}/${distractor}`);
      }
    }
  }
}
