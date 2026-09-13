import {
  type Lp011Caselet,
  type Lp011Child,
  type Lp011Clue,
} from "./lp-011.ts";
import { generateLp011BatchStabilizedV1_2 } from "./lp-011-stabilized-v1-2.ts";

export const LP_011_STABILIZED_V1_3 = Object.freeze({
  authorityId: "LP_011_STABILIZED_V1_3" as const,
  parentAuthority: "LP_011_STABILIZED_V1_2" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  changesPuzzleSemantics: false as const,
  changesQlSemantics: false as const,
  terminologyNormalized: true as const,
  machineValueWordingRemoved: true as const,
  containerNamingConsistent: true as const,
});

function pluralNoun(noun: string): string {
  if (noun === "colour") return "colours";
  if (noun === "stock item") return "stock items";
  if (noun === "supply") return "supplies";
  if (noun === "subject") return "subjects";
  return `${noun}s`;
}

function normalizeSetup(caselet: Lp011Caselet): string {
  let text = caselet.scenario
    .replace(/^Five cartons A, B, C, D and E are stacked one above another\. Each carton/u, "Five boxes A, B, C, D and E are stacked one above another. Each box")
    .replace(`The five ${caselet.attributeNoun} values are `, `The ${pluralNoun(caselet.attributeNoun)} are `);

  const oldEnding = `Each box occupies one position and each ${caselet.attributeNoun} is used exactly once.`;
  const newEnding = caselet.attributeNoun === "colour"
    ? "Each box occupies one position and each colour appears on exactly one box."
    : caselet.attributeNoun === "subject"
      ? "Each box occupies one position and each subject occurs in exactly one box."
      : `Each box occupies one position and each ${caselet.attributeNoun} occurs in exactly one box.`;
  text = text.replace(oldEnding, newEnding);
  return text;
}

function normalizeText(text: string, noun: string): string {
  let result = text;

  if (noun === "colour") {
    result = result
      .replace(/Box ([A-E]) has ([A-Za-z ]+) as its colour\./gu, "Box $1 is painted $2.")
      .replace(/Box ([A-E]) does not have ([A-Za-z ]+) as its colour\./gu, "Box $1 is not painted $2.")
      .replace(/Which colour belongs to Box ([A-E])\?/gu, "What is the colour of Box $1?")
      .replace(/Which box has ([A-Za-z ]+) as its colour\?/gu, "Which box is painted $1?")
      .replace(/the box with ([A-Za-z ]+) colour/gu, "the $1 box");
  } else if (noun === "subject") {
    result = result
      .replace(/Box ([A-E]) has ([A-Za-z ]+) as its subject\./gu, "Box $1 contains books of $2.")
      .replace(/Box ([A-E]) does not have ([A-Za-z ]+) as its subject\./gu, "Box $1 does not contain books of $2.")
      .replace(/Which subject belongs to Box ([A-E])\?/gu, "Which subject books are kept in Box $1?")
      .replace(/Which box has ([A-Za-z ]+) as its subject\?/gu, "Which box contains books of $1?")
      .replace(/the box with ([A-Za-z ]+) subject/gu, "the box containing $1 books");
  } else {
    result = result
      .replace(new RegExp(`Box ([A-E]) has ([A-Za-z ]+) as its ${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\.`, "gu"), "Box $1 contains $2.")
      .replace(new RegExp(`Box ([A-E]) does not have ([A-Za-z ]+) as its ${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\.`, "gu"), "Box $1 does not contain $2.")
      .replace(new RegExp(`Which ${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")} belongs to Box ([A-E])\\?`, "gu"), `Which ${noun} is kept in Box $1?`)
      .replace(new RegExp(`Which box has ([A-Za-z ]+) as its ${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\?`, "gu"), "Which box contains $1?");
  }

  result = result.replace(
    new RegExp(`At which position from the bottom is the box with ([A-Za-z ]+) ${noun.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")} kept\\?`, "gu"),
    "At which position from the bottom is the box containing $1 kept?",
  );
  return result;
}

function normalizeChild(child: Lp011Child, noun: string): Lp011Child {
  return {
    ...child,
    stem: normalizeText(child.stem, noun),
    explanation: {
      ...child.explanation,
      lines: child.explanation.lines.map((line) => normalizeText(line, noun)),
    },
  };
}

function normalizeClue(clue: Lp011Clue, noun: string): Lp011Clue {
  return { ...clue, text: normalizeText(clue.text, noun) } as Lp011Clue;
}

function normalizeCaselet(caselet: Lp011Caselet): Lp011Caselet {
  return {
    ...caselet,
    scenario: normalizeSetup(caselet),
    clues: caselet.clues.map((clue) => normalizeClue(clue, caselet.attributeNoun)),
    children: caselet.children.map((child) => normalizeChild(child, caselet.attributeNoun)),
  };
}

export function generateLp011BatchStabilizedV1_3(seed = "lp-011-stabilized-v1-3", count = 12): Lp011Caselet[] {
  return generateLp011BatchStabilizedV1_2(seed, count).map(normalizeCaselet);
}
