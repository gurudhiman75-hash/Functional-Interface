import type {
  ClsCp006Item,
  ClsCp006OptionKind,
  ClsCp006PrototypeDefinition,
  ClsCp006RuleId,
} from "./types";

export const CLS_CP006_ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"] as readonly string[];
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const CLS_CP006_RULE_IDS: readonly ClsCp006RuleId[] = [
  "LETTER_VOWEL_CONSONANT_CLASS",
  "LETTER_POSITION_PARITY",
  "LETTER_ALPHABET_HALF",
  "PAIR_ABSOLUTE_POSITION_GAP",
  "PAIR_SIGNED_POSITION_GAP",
  "PAIR_POSITION_SUM",
  "PAIR_OPPOSITE_STATUS",
  "PAIR_VOWEL_CONSONANT_COMPOSITION",
];

export const CLS_CP006_SINGLE_RULE_IDS: readonly ClsCp006RuleId[] = [
  "LETTER_VOWEL_CONSONANT_CLASS",
  "LETTER_POSITION_PARITY",
  "LETTER_ALPHABET_HALF",
];

export const CLS_CP006_PAIR_RULE_IDS: readonly ClsCp006RuleId[] = [
  "PAIR_ABSOLUTE_POSITION_GAP",
  "PAIR_SIGNED_POSITION_GAP",
  "PAIR_POSITION_SUM",
  "PAIR_OPPOSITE_STATUS",
  "PAIR_VOWEL_CONSONANT_COMPOSITION",
];

export function clsCp006LetterPosition(letter: string): number {
  if (!/^[A-Z]$/.test(letter)) {
    throw new Error(`CLS-CP-006 requires one uppercase Latin letter: ${letter}`);
  }
  return letter.charCodeAt(0) - 64;
}

export function clsCp006IsVowel(letter: string): boolean {
  clsCp006LetterPosition(letter);
  return VOWELS.has(letter);
}

export function clsCp006FormatItem(item: ClsCp006Item): string {
  return item.kind === "LETTER" ? item.letters[0] : `${item.letters[0]}–${item.letters[1]}`;
}

export function clsCp006ParseOption(option: string): ClsCp006Item {
  if (/^[A-Z]$/.test(option)) return { kind: "LETTER", letters: [option] };
  const pair = /^([A-Z])[–-]([A-Z])$/.exec(option);
  if (!pair || pair[1] === pair[2]) throw new Error(`Invalid CLS-CP-006 option: ${option}`);
  return { kind: "LETTER_PAIR", letters: [pair[1]!, pair[2]!] };
}

export function clsCp006RuleIdsForKind(kind: ClsCp006OptionKind): readonly ClsCp006RuleId[] {
  return kind === "LETTER" ? CLS_CP006_SINGLE_RULE_IDS : CLS_CP006_PAIR_RULE_IDS;
}

export function clsCp006RuleValue(item: ClsCp006Item, ruleId: ClsCp006RuleId): string {
  if (item.kind === "LETTER") {
    const letter = item.letters[0];
    const position = clsCp006LetterPosition(letter);
    switch (ruleId) {
      case "LETTER_VOWEL_CONSONANT_CLASS":
        return clsCp006IsVowel(letter) ? "VOWEL" : "CONSONANT";
      case "LETTER_POSITION_PARITY":
        return position % 2 === 0 ? "EVEN_POSITION" : "ODD_POSITION";
      case "LETTER_ALPHABET_HALF":
        return position <= 13 ? "FIRST_HALF" : "SECOND_HALF";
      default:
        throw new Error(`Rule ${ruleId} is incompatible with a single-letter option.`);
    }
  }

  const [first, second] = item.letters;
  const firstPosition = clsCp006LetterPosition(first);
  const secondPosition = clsCp006LetterPosition(second);
  switch (ruleId) {
    case "PAIR_ABSOLUTE_POSITION_GAP":
      return String(Math.abs(secondPosition - firstPosition));
    case "PAIR_SIGNED_POSITION_GAP":
      return String(secondPosition - firstPosition);
    case "PAIR_POSITION_SUM":
      return String(firstPosition + secondPosition);
    case "PAIR_OPPOSITE_STATUS":
      return firstPosition + secondPosition === 27 ? "OPPOSITE_PAIR" : "NOT_OPPOSITE_PAIR";
    case "PAIR_VOWEL_CONSONANT_COMPOSITION":
      return `${clsCp006IsVowel(first) ? "V" : "C"}${clsCp006IsVowel(second) ? "V" : "C"}`;
    default:
      throw new Error(`Rule ${ruleId} is incompatible with a letter-pair option.`);
  }
}

export const CLS_CP006_SINGLE_DOMAIN: readonly ClsCp006Item[] = CLS_CP006_ALPHABET.map((letter) => ({
  kind: "LETTER" as const,
  letters: [letter] as const,
}));

export const CLS_CP006_PAIR_DOMAIN: readonly ClsCp006Item[] = CLS_CP006_ALPHABET.flatMap((first) =>
  CLS_CP006_ALPHABET.filter((second) => second !== first).map((second) => ({
    kind: "LETTER_PAIR" as const,
    letters: [first, second] as const,
  })),
);

export function clsCp006DomainForKind(kind: ClsCp006OptionKind): readonly ClsCp006Item[] {
  return kind === "LETTER" ? CLS_CP006_SINGLE_DOMAIN : CLS_CP006_PAIR_DOMAIN;
}

export const CLS_CP006_PROTOTYPES: readonly ClsCp006PrototypeDefinition[] = [
  {
    prototypeId: "CLS-CP006-PROT-001",
    title: "Vowel-consonant letter outlier",
    task: "FIND_ODD_LETTER",
    optionKind: "LETTER",
    allowedRuleIds: ["LETTER_VOWEL_CONSONANT_CLASS"],
  },
  {
    prototypeId: "CLS-CP006-PROT-002",
    title: "Alphabet-position parity outlier",
    task: "FIND_ODD_LETTER",
    optionKind: "LETTER",
    allowedRuleIds: ["LETTER_POSITION_PARITY"],
  },
  {
    prototypeId: "CLS-CP006-PROT-003",
    title: "Alphabet-half letter outlier",
    task: "FIND_ODD_LETTER",
    optionKind: "LETTER",
    allowedRuleIds: ["LETTER_ALPHABET_HALF"],
  },
  {
    prototypeId: "CLS-CP006-PROT-004",
    title: "Absolute-gap letter-pair outlier",
    task: "FIND_ODD_LETTER_PAIR",
    optionKind: "LETTER_PAIR",
    allowedRuleIds: ["PAIR_ABSOLUTE_POSITION_GAP"],
  },
  {
    prototypeId: "CLS-CP006-PROT-005",
    title: "Signed-gap letter-pair outlier",
    task: "FIND_ODD_LETTER_PAIR",
    optionKind: "LETTER_PAIR",
    allowedRuleIds: ["PAIR_SIGNED_POSITION_GAP"],
  },
  {
    prototypeId: "CLS-CP006-PROT-006",
    title: "Position-sum letter-pair outlier",
    task: "FIND_ODD_LETTER_PAIR",
    optionKind: "LETTER_PAIR",
    allowedRuleIds: ["PAIR_POSITION_SUM"],
  },
  {
    prototypeId: "CLS-CP006-PROT-007",
    title: "Opposite-letter-pair status outlier",
    task: "FIND_ODD_LETTER_PAIR",
    optionKind: "LETTER_PAIR",
    allowedRuleIds: ["PAIR_OPPOSITE_STATUS"],
  },
  {
    prototypeId: "CLS-CP006-PROT-008",
    title: "Vowel-consonant pair-composition outlier",
    task: "FIND_ODD_LETTER_PAIR",
    optionKind: "LETTER_PAIR",
    allowedRuleIds: ["PAIR_VOWEL_CONSONANT_COMPOSITION"],
  },
];

export const CLS_CP006_PROTOTYPE_BY_ID = new Map(
  CLS_CP006_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]),
);
