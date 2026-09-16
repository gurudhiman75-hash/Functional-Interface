import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP004_AGREEMENT_CONTEXTS, CP004_GENDER_PAIRS, CP004_NUMBER_PAIRS, type CP004AgreementContext } from "./CP004-authorities";

function norm(value: string): string { return value.normalize("NFC").trim(); }
function ordinal(seed: number, capacity: number): number {
  if (capacity <= 0) throw new Error("CP004 authority pool is empty");
  const value = Math.trunc(seed) - 1;
  return ((value % capacity) + capacity) % capacity;
}

function assemble(input: { seed: number; difficulty: PunjabiDifficulty; familyId: string; subtype: string; stem: string; correctAnswer: string; distractors: readonly string[]; explanation: string; authorityIds: readonly string[] }): PunjabiGeneratedQuestion {
  const rng = createRng(`CP004:${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP004 ${input.familyId}: fewer than three distinct distractors`);
  const selected = rng.pickDistinct(distractors, 3);
  const options = rng.shuffle([correct, ...selected]);
  const fingerprint = `CP004-${semanticHash([input.familyId, input.subtype, input.difficulty, norm(input.stem), correct, [...selected].sort().join("|"), [...input.authorityIds].sort().join(",")])}`;
  return {
    id: `PUN-001-CP004-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem), options, correctIndex: options.indexOf(correct), explanation: norm(input.explanation), difficulty: input.difficulty,
    metadata: { engine: "punjabi-v1", packageId: "PUN-001", cpId: "PUN-001-CP004", familyId: input.familyId, subtype: input.subtype, difficulty: input.difficulty, language: "pa-Guru", seed: input.seed, authorityIds: input.authorityIds, generatorRevision: "1.0.0-forward-port", fingerprint, lifecycle: "REVIEW_ONLY" },
  };
}

function requireDifficulty(actual: PunjabiDifficulty, expected: PunjabiDifficulty, family: string): void {
  if (actual !== expected) throw new Error(`CP004 ${family} supports ${expected} only`);
}

export function generateCP004F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F01");
  const t = CP004_GENDER_PAIRS[ordinal(seed, CP004_GENDER_PAIRS.length)]!;
  return assemble({ seed, difficulty, familyId: "F01", subtype: "MASCULINE_TO_FEMININE", stem: `‘${t.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.feminine, distractors: t.feminineDistractors, explanation: `‘${t.masculine}’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘${t.feminine}’ ਹੈ।`, authorityIds: [t.id] });
}

export function generateCP004F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F02");
  const t = CP004_GENDER_PAIRS[ordinal(seed, CP004_GENDER_PAIRS.length)]!;
  return assemble({ seed, difficulty, familyId: "F02", subtype: "FEMININE_TO_MASCULINE", stem: `‘${t.feminine}’ ਦਾ ਪੁਲਿੰਗ ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.masculine, distractors: t.masculineDistractors, explanation: `‘${t.feminine}’ ਦਾ ਪੁਲਿੰਗ ‘${t.masculine}’ ਹੈ।`, authorityIds: [t.id] });
}

export function generateCP004F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F03");
  const t = CP004_NUMBER_PAIRS[ordinal(seed, CP004_NUMBER_PAIRS.length)]!;
  return assemble({ seed, difficulty, familyId: "F03", subtype: "SINGULAR_TO_PLURAL", stem: `‘${t.singular}’ ਦਾ ਬਹੁਵਚਨ ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.plural, distractors: t.pluralDistractors, explanation: `‘${t.singular}’ ਦਾ ਬਹੁਵਚਨ ‘${t.plural}’ ਹੈ।`, authorityIds: [t.id] });
}

export function generateCP004F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Easy", "F04");
  const t = CP004_NUMBER_PAIRS[ordinal(seed, CP004_NUMBER_PAIRS.length)]!;
  return assemble({ seed, difficulty, familyId: "F04", subtype: "PLURAL_TO_SINGULAR", stem: `‘${t.plural}’ ਦਾ ਇਕਵਚਨ ਕਿਹੜਾ ਹੈ?`, correctAnswer: t.singular, distractors: t.singularDistractors, explanation: `‘${t.plural}’ ਦਾ ਇਕਵਚਨ ‘${t.singular}’ ਹੈ।`, authorityIds: [t.id] });
}

export function generateCP004F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F05");
  const t = CP004_GENDER_PAIRS[ordinal(seed, CP004_GENDER_PAIRS.length)]!;
  const correct = `${t.masculine} — ${t.feminine}`;
  const distractors = t.feminineDistractors.map((x) => `${t.masculine} — ${x}`);
  return assemble({ seed, difficulty, familyId: "F05", subtype: "CORRECT_GENDER_PAIR", stem: "ਕਿਹੜਾ ਪੁਲਿੰਗ–ਇਸਤਰੀ ਲਿੰਗ ਜੋੜਾ ਸਹੀ ਹੈ?", correctAnswer: correct, distractors, explanation: `‘${t.masculine}’ ਦਾ ਸਹੀ ਇਸਤਰੀ ਲਿੰਗ ‘${t.feminine}’ ਹੈ, ਇਸ ਲਈ ਇਹ ਜੋੜਾ ਸਹੀ ਹੈ।`, authorityIds: [t.id] });
}

export function generateCP004F06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F06");
  const t = CP004_NUMBER_PAIRS[ordinal(seed, CP004_NUMBER_PAIRS.length)]!;
  const correct = `${t.singular} — ${t.plural}`;
  const distractors = t.pluralDistractors.map((x) => `${t.singular} — ${x}`);
  return assemble({ seed, difficulty, familyId: "F06", subtype: "CORRECT_NUMBER_PAIR", stem: "ਕਿਹੜਾ ਇਕਵਚਨ–ਬਹੁਵਚਨ ਜੋੜਾ ਸਹੀ ਹੈ?", correctAnswer: correct, distractors, explanation: `‘${t.singular}’ ਦਾ ਸਹੀ ਬਹੁਵਚਨ ‘${t.plural}’ ਹੈ, ਇਸ ਲਈ ਇਹ ਜੋੜਾ ਸਹੀ ਹੈ।`, authorityIds: [t.id] });
}

function agreementQuestion(seed: number, difficulty: PunjabiDifficulty, familyId: string, subtype: string, stem: string, pool: readonly CP004AgreementContext[]): PunjabiGeneratedQuestion {
  const t = pool[ordinal(seed, pool.length)]!;
  return assemble({ seed, difficulty, familyId, subtype, stem, correctAnswer: t.correct, distractors: t.incorrect, explanation: t.principlePa, authorityIds: [t.id] });
}

const GENDER_CONTEXTS = CP004_AGREEMENT_CONTEXTS.filter((x) => x.dimension === "GENDER");
const NUMBER_CONTEXTS = CP004_AGREEMENT_CONTEXTS.filter((x) => x.dimension === "NUMBER");

export function generateCP004F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F07");
  return agreementQuestion(seed, difficulty, "F07", "GENDER_AGREEMENT", "ਲਿੰਗ ਦੇ ਅਨੁਸਾਰ ਕਿਹੜਾ ਵਾਕ ਸਹੀ ਹੈ?", GENDER_CONTEXTS);
}

export function generateCP004F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Medium", "F08");
  return agreementQuestion(seed, difficulty, "F08", "NUMBER_AGREEMENT", "ਵਚਨ ਦੇ ਅਨੁਸਾਰ ਕਿਹੜਾ ਵਾਕ ਸਹੀ ਹੈ?", NUMBER_CONTEXTS);
}

export function generateCP004F09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  requireDifficulty(difficulty, "Hard", "F09");
  return agreementQuestion(seed, difficulty, "F09", "MIXED_GENDER_NUMBER_AGREEMENT", "ਲਿੰਗ ਅਤੇ ਵਚਨ ਦੇ ਅਨੁਸਾਰ ਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ।", CP004_AGREEMENT_CONTEXTS);
}

export const CP004_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "MASCULINE_TO_FEMININE", name: "ਪੁਲਿੰਗ ਤੋਂ ਇਸਤਰੀ ਲਿੰਗ", targetDifficulties: ["Easy"], generate: generateCP004F01 },
  { familyId: "F02", subtype: "FEMININE_TO_MASCULINE", name: "ਇਸਤਰੀ ਲਿੰਗ ਤੋਂ ਪੁਲਿੰਗ", targetDifficulties: ["Easy"], generate: generateCP004F02 },
  { familyId: "F03", subtype: "SINGULAR_TO_PLURAL", name: "ਇਕਵਚਨ ਤੋਂ ਬਹੁਵਚਨ", targetDifficulties: ["Easy"], generate: generateCP004F03 },
  { familyId: "F04", subtype: "PLURAL_TO_SINGULAR", name: "ਬਹੁਵਚਨ ਤੋਂ ਇਕਵਚਨ", targetDifficulties: ["Easy"], generate: generateCP004F04 },
  { familyId: "F05", subtype: "CORRECT_GENDER_PAIR", name: "ਸਹੀ ਲਿੰਗ ਜੋੜਾ", targetDifficulties: ["Medium"], generate: generateCP004F05 },
  { familyId: "F06", subtype: "CORRECT_NUMBER_PAIR", name: "ਸਹੀ ਵਚਨ ਜੋੜਾ", targetDifficulties: ["Medium"], generate: generateCP004F06 },
  { familyId: "F07", subtype: "GENDER_AGREEMENT", name: "ਲਿੰਗ ਅਨੁਸਾਰ ਵਾਕ", targetDifficulties: ["Medium"], generate: generateCP004F07 },
  { familyId: "F08", subtype: "NUMBER_AGREEMENT", name: "ਵਚਨ ਅਨੁਸਾਰ ਵਾਕ", targetDifficulties: ["Medium"], generate: generateCP004F08 },
  { familyId: "F09", subtype: "MIXED_GENDER_NUMBER_AGREEMENT", name: "ਲਿੰਗ–ਵਚਨ ਸ਼ੁੱਧਤਾ", targetDifficulties: ["Hard"], generate: generateCP004F09 },
] as const;
