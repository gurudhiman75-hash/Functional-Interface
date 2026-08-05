import {
  relationDisplay,
  type BlrCp006CodeDefinition,
  type BlrCp006DirectRelation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import { positiveModulo } from "./cp007-v2-model";

const DIRECT_RELATIONS: readonly BlrCp006DirectRelation[] = [
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "HUSBAND",
  "WIFE",
];

const TOKEN_PALETTES = [
  { style: "SYMBOL" as const, values: ["×", "−", "+", "÷", "@", "#", "%", "&"] },
  { style: "LETTER" as const, values: ["ka", "mi", "ru", "ta", "lo", "se", "vi", "no"] },
  {
    style: "NEUTRAL_WORD" as const,
    values: ["star", "leaf", "river", "cloud", "stone", "flame", "moon", "seed"],
  },
] as const;

function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = positiveModulo(amount, values.length);
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export function completeBlrCp007V2Key(seed: number): {
  keyStyle: BlrCp007Scenario["keyStyle"];
  codeKey: readonly BlrCp006CodeDefinition[];
} {
  const palette = TOKEN_PALETTES[positiveModulo(seed, TOKEN_PALETTES.length)]!;
  const tokens = rotate(palette.values, seed * 3 + 1);
  const relations = rotate(DIRECT_RELATIONS, seed * 5 + 2);
  return {
    keyStyle: palette.style,
    codeKey: relations.map((relationId, index) => ({
      token: tokens[index]!,
      relationId,
    })),
  };
}

export function blrCp007V2KeyPrompt(
  key: readonly BlrCp006CodeDefinition[],
): string {
  return `Use the following code meanings: ${key
    .map(
      (entry) =>
        `${entry.token} means “is the ${relationDisplay(
          entry.relationId,
        ).toLocaleLowerCase("en-IN")} of”`,
    )
    .join("; ")}. Read every coded pair from left to right.`;
}
