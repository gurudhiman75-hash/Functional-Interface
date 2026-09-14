import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import {
  CP001_ARTICULATION,
  CP001_DUTT,
  CP001_GROUPS,
  CP001_LAGAKHARS,
  CP001_LAGAAN,
  CP001_LETTERS,
  CP001_SYSTEM_AUTHORITY_COUNT,
} from "./CP001-authorities";
import {
  CP001_DUTT_WORDS,
  CP001_LAGAKHAR_WORDS,
  CP001_LAGA_WORDS,
  CP001_WORD_AUTHORITIES,
  type CP001WordAuthority,
} from "./CP001-word-corpus";

function norm(value: string): string {
  return value.normalize("NFC").trim();
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}

function ordinal(seed: number, capacity: number): number {
  if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new Error(`Invalid CP001 capacity ${capacity}`);
  const value = Math.trunc(seed) - 1;
  return ((value % capacity) + capacity) % capacity;
}

function combinationAt<T>(items: readonly T[], k: number, index: number): T[] {
  let rank = ordinal(index + 1, choose(items.length, k));
  const out: T[] = [];
  let start = 0;
  for (let position = 0; position < k; position++) {
    const remaining = k - position - 1;
    for (let candidate = start; candidate <= items.length - (k - position); candidate++) {
      const block = choose(items.length - candidate - 1, remaining);
      if (rank < block) {
        out.push(items[candidate]!);
        start = candidate + 1;
        break;
      }
      rank -= block;
    }
  }
  if (out.length !== k) throw new Error(`Unable to unrank CP001 combination k=${k}, index=${index}`);
  return out;
}

function assemble(input: {
  seed: number;
  difficulty: PunjabiDifficulty;
  familyId: string;
  subtype: string;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(`CP001:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP001 ${input.familyId}: fewer than three distinct distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP001-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    norm(input.stem),
    correct,
    [...selected].sort().join("|"),
    [...input.authorityIds].sort().join(","),
  ])}`;
  return {
    id: `PUN-001-CP001-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP001",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.0.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

const BASIC_35 = CP001_LETTERS.slice(0, 35);
const GROUP_NAMES = CP001_GROUPS.map((x) => x.namePa);
const PLACE_NAMES = [...new Set(CP001_ARTICULATION.map((x) => x.placePa))];
const LAGA_NAMES = CP001_LAGAAN.map((x) => x.namePa);
const WORD_TARGET_NAMES = [...new Set(CP001_WORD_AUTHORITIES.map((x) => x.targetNamePa))];

function alternativeLabel(label: string, offset: number): string {
  const index = WORD_TARGET_NAMES.indexOf(label);
  return WORD_TARGET_NAMES[(index + 1 + offset) % WORD_TARGET_NAMES.length]!;
}

export function generateCP001F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP001 F01 supports Easy only");
  const directionAfter = ordinal(seed, 2) === 0;
  const candidates = directionAfter ? BASIC_35.slice(0, -1) : BASIC_35.slice(1);
  const target = candidates[ordinal(Math.ceil(seed / 2), candidates.length)]!;
  const targetIndex = BASIC_35.findIndex((x) => x.id === target.id);
  const correct = BASIC_35[targetIndex + (directionAfter ? 1 : -1)]!;
  const distractors = BASIC_35.filter((x) => x.id !== correct.id && x.id !== target.id)
    .slice(Math.max(0, targetIndex - 3), Math.min(BASIC_35.length, targetIndex + 4))
    .map((x) => x.letter);
  while (distractors.length < 3) distractors.push(...BASIC_35.filter((x) => x.id !== correct.id).map((x) => x.letter));
  return assemble({
    seed, difficulty, familyId: "F01", subtype: "ALPHABET_SEQUENCE",
    stem: directionAfter
      ? `ਗੁਰਮੁਖੀ ਦੀ ਪੈਂਤੀ ਵਿੱਚ ‘${target.letter}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`
      : `ਗੁਰਮੁਖੀ ਦੀ ਪੈਂਤੀ ਵਿੱਚ ‘${target.letter}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
    correctAnswer: correct.letter,
    distractors,
    explanation: `ਪੈਂਤੀ ਦੀ ਨਿਰਧਾਰਤ ਤਰਤੀਬ ਵਿੱਚ ‘${target.letter}’ ਦੇ ${directionAfter ? "ਬਾਅਦ" : "ਪਹਿਲਾਂ"} ‘${correct.letter}’ ਆਉਂਦਾ ਹੈ।`,
    authorityIds: [target.id, correct.id],
  });
}

export function generateCP001F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP001 F02 supports Easy only");
  const target = CP001_LETTERS[ordinal(seed, CP001_LETTERS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F02", subtype: "LETTER_GROUP_CLASSIFICATION",
    stem: `ਅੱਖਰ ‘${target.letter}’ ਕਿਸ ਟੋਲੀ ਜਾਂ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
    correctAnswer: target.groupPa,
    distractors: GROUP_NAMES.filter((x) => x !== target.groupPa),
    explanation: `‘${target.letter}’ ${target.groupPa} ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F03 supports Medium only");
  const target = CP001_ARTICULATION[ordinal(seed, CP001_ARTICULATION.length)]!;
  return assemble({
    seed, difficulty, familyId: "F03", subtype: "ARTICULATION_PLACE",
    stem: `ਅੱਖਰ ‘${target.letter}’ ਦਾ ਮੁੱਖ ਉਚਾਰਨ-ਸਥਾਨ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: target.placePa,
    distractors: PLACE_NAMES.filter((x) => x !== target.placePa),
    explanation: `‘${target.letter}’ ${target.vargPa} ਦਾ ਅੱਖਰ ਹੈ ਅਤੇ ਇਸ ਦਾ ਉਚਾਰਨ-ਸਥਾਨ ${target.placePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP001 F04 supports Easy only");
  const target = CP001_LAGAAN[ordinal(seed, CP001_LAGAAN.length)]!;
  const answer = `${target.carrier} + ${target.namePa}`;
  const distractors = CP001_LAGAAN.filter((x) => x.id !== target.id).map((x) => `${x.carrier} + ${x.namePa}`);
  return assemble({
    seed, difficulty, familyId: "F04", subtype: "VOWEL_CARRIER_COMPOSITION",
    stem: `ਸਵਰ ‘${target.independentVowel}’ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ ਸਵਰ-ਵਾਹਕ ਅਤੇ ਲਗ ਦਾ ਜੋੜ ਸਹੀ ਹੈ?`,
    correctAnswer: answer,
    distractors,
    explanation: `‘${target.independentVowel}’ ਲਈ ${target.carrier} ਨਾਲ ${target.namePa} ਦਾ ਸੰਬੰਧ ਬਣਦਾ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F05 supports Medium only");
  const target = CP001_LAGAAN[ordinal(seed, CP001_LAGAAN.length)]!;
  const mode = ordinal(Math.floor((seed - 1) / CP001_LAGAAN.length) + 1, 3);
  let correct = target.symbol;
  let distractors = CP001_LAGAAN.filter((x) => x.id !== target.id).map((x) => x.symbol);
  let stem = `‘${target.namePa}’ ਦਾ ਲਿਖਤੀ ਚਿੰਨ੍ਹ ਕਿਹੜਾ ਹੈ?`;
  let explanation = `‘${target.namePa}’ ਦਾ ਚਿੰਨ੍ਹ ‘${target.symbol}’ ਹੈ।`;
  if (mode === 1) {
    correct = `${target.positionPa} — ${target.lengthPa}`;
    distractors = CP001_LAGAAN.filter((x) => x.id !== target.id).map((x) => `${x.positionPa} — ${x.lengthPa}`);
    stem = `‘${target.namePa}’ ਦੀ ਥਾਂ ਅਤੇ ਸਵਰ-ਲੰਬਾਈ ਦਾ ਸਹੀ ਜੋੜ ਚੁਣੋ।`;
    explanation = `‘${target.namePa}’ ${target.positionPa} ਲੱਗਦੀ ਹੈ ਅਤੇ ਇਸ ਨੂੰ ${target.lengthPa} ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।`;
  } else if (mode === 2) {
    correct = target.independentVowel;
    distractors = CP001_LAGAAN.filter((x) => x.id !== target.id).map((x) => x.independentVowel);
    stem = `‘${target.namePa}’ ਨਾਲ ਬਣਦਾ ਸੁਤੰਤਰ ਸਵਰ ਕਿਹੜਾ ਹੈ?`;
    explanation = `‘${target.namePa}’ ਨਾਲ ਸੰਬੰਧਿਤ ਸੁਤੰਤਰ ਸਵਰ ‘${target.independentVowel}’ ਹੈ।`;
  }
  return assemble({ seed, difficulty, familyId: "F05", subtype: "LAGA_PROPERTY", stem, correctAnswer: correct, distractors, explanation, authorityIds: [target.id] });
}

export function generateCP001F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F06 supports Medium only");
  const target = CP001_LAGA_WORDS[ordinal(seed, CP001_LAGA_WORDS.length)]!;
  const stem = target.targetNamePa === "ਮੁਕਤਾ"
    ? `ਸ਼ਬਦ ‘${target.word}’ ਵਿੱਚ ਬਿਨਾ ਵੱਖਰੇ ਮਾਤਰਾ-ਚਿੰਨ੍ਹ ਵਾਲੀ ਧੁਨੀ ਲਈ ਕਿਹੜੀ ਲਗ ਮੰਨੀ ਜਾਂਦੀ ਹੈ?`
    : `ਸ਼ਬਦ ‘${target.word}’ ਵਿੱਚ ‘${target.targetSymbol}’ ਚਿੰਨ੍ਹ ਕਿਹੜੀ ਲਗ ਹੈ?`;
  return assemble({
    seed, difficulty, familyId: "F06", subtype: "WORD_LAGA_IDENTIFICATION",
    stem,
    correctAnswer: target.targetNamePa,
    distractors: LAGA_NAMES.filter((x) => x !== target.targetNamePa),
    explanation: `ਸ਼ਬਦ ‘${target.word}’ ਵਿੱਚ ਦਰਸਾਇਆ ਰੂਪ ${target.targetNamePa} ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F07 supports Medium only");
  const expanded = CP001_LAGAKHARS.flatMap((mark) => mark.allowedLagaPa.map((laga) => ({ mark, laga })));
  const target = expanded[ordinal(seed, expanded.length)]!;
  const disallowed = LAGA_NAMES.filter((x) => !target.mark.allowedLagaPa.includes(x));
  return assemble({
    seed, difficulty, familyId: "F07", subtype: "LAGAKHAR_DISTRIBUTION",
    stem: `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${target.mark.namePa}’ ਨਾਲ ਸਹੀ ਲਗ-ਜੋੜ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: `${target.mark.namePa} — ${target.laga}`,
    distractors: disallowed.map((x) => `${target.mark.namePa} — ${x}`),
    explanation: `‘${target.mark.namePa}’ ${target.mark.allowedLagaPa.join(", ")} ਨਾਲ ਵਰਤੀ ਜਾਂਦੀ ਹੈ; ਇਸ ਲਈ ‘${target.laga}’ ਵਾਲਾ ਜੋੜ ਸਹੀ ਹੈ।`,
    authorityIds: [target.mark.id],
  });
}

export function generateCP001F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F08 supports Medium only");
  const target = CP001_LAGAKHAR_WORDS[ordinal(seed, CP001_LAGAKHAR_WORDS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F08", subtype: "WORD_LAGAKHAR_IDENTIFICATION",
    stem: `ਸ਼ਬਦ ‘${target.word}’ ਵਿੱਚ ‘${target.targetSymbol}’ ਕਿਹੜਾ ਲਗਾਖਰ ਹੈ?`,
    correctAnswer: target.targetNamePa,
    distractors: ["ਬਿੰਦੀ", "ਟਿੱਪੀ", "ਅੱਧਕ", "ਕੋਈ ਲਗਾਖਰ ਨਹੀਂ"].filter((x) => x !== target.targetNamePa),
    explanation: `‘${target.word}’ ਵਿੱਚ ‘${target.targetSymbol}’ ${target.targetNamePa} ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP001 F09 supports Medium only");
  const target = CP001_DUTT_WORDS[ordinal(seed, CP001_DUTT_WORDS.length)]!;
  return assemble({
    seed, difficulty, familyId: "F09", subtype: "DUTT_AKKHAR_USAGE",
    stem: `ਸ਼ਬਦ ‘${target.word}’ ਵਿੱਚ ਕਿਹੜਾ ਦੁੱਤ ਅੱਖਰ ਵਰਤਿਆ ਗਿਆ ਹੈ?`,
    correctAnswer: target.targetNamePa,
    distractors: ["ਪੈਰੀਂ ਹਾਹਾ", "ਪੈਰੀਂ ਰਾਰਾ", "ਪੈਰੀਂ ਵਾਵਾ", "ਕੋਈ ਦੁੱਤ ਅੱਖਰ ਨਹੀਂ"].filter((x) => x !== target.targetNamePa),
    explanation: `‘${target.word}’ ਵਿੱਚ ${target.targetNamePa} ਵਰਤਿਆ ਗਿਆ ਹੈ।`,
    authorityIds: [target.id],
  });
}

export function generateCP001F10(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP001 F10 supports Hard only");
  const space = CP001_LAGA_WORDS.length * CP001_LAGAKHAR_WORDS.length;
  const rank = ordinal(seed, space);
  const a = CP001_LAGA_WORDS[Math.floor(rank / CP001_LAGAKHAR_WORDS.length)]!;
  const b = CP001_LAGAKHAR_WORDS[rank % CP001_LAGAKHAR_WORDS.length]!;
  const correct = `${a.word} — ${a.targetNamePa}; ${b.word} — ${b.targetNamePa}`;
  return assemble({
    seed, difficulty, familyId: "F10", subtype: "TWO_WORD_ORTHOGRAPHY_ANALYSIS",
    stem: "ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਲਈ ਸਹੀ ਲਿਪੀ-ਵਿਸ਼ਲੇਸ਼ਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।",
    correctAnswer: correct,
    distractors: [
      `${a.word} — ${alternativeLabel(a.targetNamePa, 0)}; ${b.word} — ${b.targetNamePa}`,
      `${a.word} — ${a.targetNamePa}; ${b.word} — ${alternativeLabel(b.targetNamePa, 1)}`,
      `${a.word} — ${alternativeLabel(a.targetNamePa, 2)}; ${b.word} — ${alternativeLabel(b.targetNamePa, 3)}`,
    ],
    explanation: `‘${a.word}’ ਵਿੱਚ ${a.targetNamePa} ਅਤੇ ‘${b.word}’ ਵਿੱਚ ${b.targetNamePa} ਦਰਸਾਇਆ ਗਿਆ ਹੈ।`,
    authorityIds: [a.id, b.id],
  });
}

function mappingText(items: readonly CP001WordAuthority[], shifts: readonly number[]): string {
  return items.map((item, index) => `${item.word} — ${shifts[index] === 0 ? item.targetNamePa : alternativeLabel(item.targetNamePa, shifts[index]!)}`).join("; ");
}

export function generateCP001F11(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP001 F11 supports Hard only");
  const quartet = combinationAt(CP001_WORD_AUTHORITIES, 4, ordinal(seed, choose(CP001_WORD_AUTHORITIES.length, 4)));
  const correct = mappingText(quartet, [0, 0, 0, 0]);
  return assemble({
    seed, difficulty, familyId: "F11", subtype: "FOUR_WORD_FEATURE_MATCH",
    stem: "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਚਾਰਾਂ ਸ਼ਬਦਾਂ ਦਾ ਲਿਪੀ-ਚਿੰਨ੍ਹ ਨਾਲ ਮੇਲ ਸਹੀ ਹੈ।",
    correctAnswer: correct,
    distractors: [
      mappingText(quartet, [1, 0, 0, 0]),
      mappingText(quartet, [0, 2, 0, 3]),
      mappingText(quartet, [4, 0, 5, 0]),
    ],
    explanation: `ਸਹੀ ਮੇਲ ਹੈ: ${correct}।`,
    authorityIds: quartet.map((x) => x.id),
  });
}

export function generateCP001F12(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP001 F12 supports Hard only");
  const space = CP001_LETTERS.length * CP001_LAGAAN.length * CP001_WORD_AUTHORITIES.length;
  const rank = ordinal(seed, space);
  const wordIndex = rank % CP001_WORD_AUTHORITIES.length;
  const lagaIndex = Math.floor(rank / CP001_WORD_AUTHORITIES.length) % CP001_LAGAAN.length;
  const letterIndex = Math.floor(rank / (CP001_WORD_AUTHORITIES.length * CP001_LAGAAN.length));
  const letter = CP001_LETTERS[letterIndex]!;
  const laga = CP001_LAGAAN[lagaIndex]!;
  const word = CP001_WORD_AUTHORITIES[wordIndex]!;
  const nextGroup = GROUP_NAMES[(GROUP_NAMES.indexOf(letter.groupPa) + 1) % GROUP_NAMES.length]!;
  const nextLaga = CP001_LAGAAN[(lagaIndex + 1) % CP001_LAGAAN.length]!;
  const correct = `${letter.letter} — ${letter.groupPa}; ${laga.independentVowel} — ${laga.carrier} + ${laga.namePa}; ${word.word} — ${word.targetNamePa}`;
  return assemble({
    seed, difficulty, familyId: "F12", subtype: "CROSS_SYSTEM_RELATION",
    stem: "ਅੱਖਰ, ਸਵਰ-ਵਾਹਕ ਅਤੇ ਸ਼ਬਦ-ਚਿੰਨ੍ਹ ਦੇ ਤਿੰਨਾਂ ਸੰਬੰਧਾਂ ਵਿੱਚੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    correctAnswer: correct,
    distractors: [
      `${letter.letter} — ${nextGroup}; ${laga.independentVowel} — ${laga.carrier} + ${laga.namePa}; ${word.word} — ${word.targetNamePa}`,
      `${letter.letter} — ${letter.groupPa}; ${laga.independentVowel} — ${nextLaga.carrier} + ${nextLaga.namePa}; ${word.word} — ${word.targetNamePa}`,
      `${letter.letter} — ${letter.groupPa}; ${laga.independentVowel} — ${laga.carrier} + ${laga.namePa}; ${word.word} — ${alternativeLabel(word.targetNamePa, 0)}`,
    ],
    explanation: `ਸਹੀ ਸੰਬੰਧ ਹਨ: ${correct}।`,
    authorityIds: [letter.id, laga.id, word.id],
  });
}

export function getCP001BreadthReport() {
  const capacities = {
    F01: 68,
    F02: CP001_LETTERS.length,
    F03: CP001_ARTICULATION.length,
    F04: CP001_LAGAAN.length,
    F05: CP001_LAGAAN.length * 3,
    F06: CP001_LAGA_WORDS.length,
    F07: CP001_LAGAKHARS.reduce((sum, x) => sum + x.allowedLagaPa.length, 0),
    F08: CP001_LAGAKHAR_WORDS.length,
    F09: CP001_DUTT_WORDS.length,
    F10: CP001_LAGA_WORDS.length * CP001_LAGAKHAR_WORDS.length,
    F11: choose(CP001_WORD_AUTHORITIES.length, 4),
    F12: CP001_LETTERS.length * CP001_LAGAAN.length * CP001_WORD_AUTHORITIES.length,
  } as const;
  return {
    systemAuthorityCount: CP001_SYSTEM_AUTHORITY_COUNT,
    wordAuthorityCount: CP001_WORD_AUTHORITIES.length,
    totalAtomicAuthorities: CP001_SYSTEM_AUTHORITY_COUNT + CP001_WORD_AUTHORITIES.length,
    basicLetterCount: 35,
    supplementaryLetterCount: 6,
    vowelCarrierCount: 3,
    lagaCount: CP001_LAGAAN.length,
    lagakharCount: CP001_LAGAKHARS.length,
    duttCount: CP001_DUTT.length,
    familyCount: 12,
    capacities,
    totalSemanticCapacity: Object.values(capacities).reduce((sum, value) => sum + value, 0),
  } as const;
}

export const CP001_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "ALPHABET_SEQUENCE", name: "ਵਰਣਮਾਲਾ ਕ੍ਰਮ", targetDifficulties: ["Easy"], generate: generateCP001F01 },
  { familyId: "F02", subtype: "LETTER_GROUP_CLASSIFICATION", name: "ਅੱਖਰ-ਵਰਗ ਪਛਾਣ", targetDifficulties: ["Easy"], generate: generateCP001F02 },
  { familyId: "F03", subtype: "ARTICULATION_PLACE", name: "ਉਚਾਰਨ-ਸਥਾਨ", targetDifficulties: ["Medium"], generate: generateCP001F03 },
  { familyId: "F04", subtype: "VOWEL_CARRIER_COMPOSITION", name: "ਸਵਰ-ਵਾਹਕ ਜੋੜ", targetDifficulties: ["Easy"], generate: generateCP001F04 },
  { familyId: "F05", subtype: "LAGA_PROPERTY", name: "ਲਗ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ", targetDifficulties: ["Medium"], generate: generateCP001F05 },
  { familyId: "F06", subtype: "WORD_LAGA_IDENTIFICATION", name: "ਸ਼ਬਦ ਵਿੱਚ ਲਗ", targetDifficulties: ["Medium"], generate: generateCP001F06 },
  { familyId: "F07", subtype: "LAGAKHAR_DISTRIBUTION", name: "ਲਗਾਖਰ-ਲਗ ਸੰਬੰਧ", targetDifficulties: ["Medium"], generate: generateCP001F07 },
  { familyId: "F08", subtype: "WORD_LAGAKHAR_IDENTIFICATION", name: "ਸ਼ਬਦ ਵਿੱਚ ਲਗਾਖਰ", targetDifficulties: ["Medium"], generate: generateCP001F08 },
  { familyId: "F09", subtype: "DUTT_AKKHAR_USAGE", name: "ਦੁੱਤ ਅੱਖਰ ਵਰਤੋਂ", targetDifficulties: ["Medium"], generate: generateCP001F09 },
  { familyId: "F10", subtype: "TWO_WORD_ORTHOGRAPHY_ANALYSIS", name: "ਦੋ ਸ਼ਬਦਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ", targetDifficulties: ["Hard"], generate: generateCP001F10 },
  { familyId: "F11", subtype: "FOUR_WORD_FEATURE_MATCH", name: "ਚਾਰ ਸ਼ਬਦਾਂ ਦਾ ਮੇਲ", targetDifficulties: ["Hard"], generate: generateCP001F11 },
  { familyId: "F12", subtype: "CROSS_SYSTEM_RELATION", name: "ਮਿਸ਼ਰਤ ਲਿਪੀ ਸੰਬੰਧ", targetDifficulties: ["Hard"], generate: generateCP001F12 },
] as const;
