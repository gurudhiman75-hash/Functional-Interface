import { createRng } from "../../../../core/deterministic-rng";
import { semanticHash } from "../../../../core/semantic-hash";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionFamilyDefinition } from "../../../../core/types";
import { CP002_AUTHORITIES, type SpellingAuthority } from "./CP002-authorities";

function norm(value: string): string {
  return value.normalize("NFC").trim();
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
  const rng = createRng(`${input.familyId}:${input.seed}`);
  const correct = norm(input.correctAnswer);
  const distractors = [...new Set(input.distractors.map(norm))].filter((x) => x && x !== correct);
  if (distractors.length < 3) throw new Error(`CP002 ${input.familyId}: fewer than three valid distractors`);
  const options = rng.shuffle([correct, ...rng.pickDistinct(distractors, 3)]);
  const fingerprint = `CP002-${semanticHash([
    input.familyId,
    input.subtype,
    input.difficulty,
    input.stem,
    correct,
    [...input.authorityIds].sort().join(","),
  ])}`;

  return {
    id: `PUN-001-CP002-${input.familyId}-${fingerprint}`,
    stem: norm(input.stem),
    options,
    correctIndex: options.indexOf(correct),
    explanation: norm(input.explanation),
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP002",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.1.0-forward-port",
      fingerprint,
      lifecycle: "REVIEW_ONLY",
    },
  };
}

function item(seed: number): SpellingAuthority {
  const n = CP002_AUTHORITIES.length;
  const normalized = Math.trunc(seed);
  const index = ((normalized - 1) % n + n) % n;
  return CP002_AUTHORITIES[index]!;
}

function pairedItem(seed: number, offset = 17): SpellingAuthority {
  const first = item(seed);
  let second = item(seed + offset);
  if (second.id === first.id) second = item(seed + offset + 1);
  return second;
}

export function generateCP002F01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Easy") throw new Error("CP002 F01 supports Easy only");
  const target = item(seed + 11);
  return assemble({
    seed,
    difficulty,
    familyId: "F01",
    subtype: "CORRECT_FORM_RECOGNITION",
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ।",
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: target.explanationPa,
    authorityIds: [target.id],
  });
}

export function generateCP002F02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP002 F02 supports Medium only");
  const target = item(seed + 101);
  const wrong = createRng(seed + 103).pickOne(target.incorrect);
  const sentence = target.contextPa.replace(target.correct, wrong);
  return assemble({
    seed,
    difficulty,
    familyId: "F02",
    subtype: "SENTENCE_ERROR_CORRECTION",
    stem: `ਵਾਕ ਵਿੱਚ ਗਲਤ ਲਿਖੇ ਸ਼ਬਦ ਦਾ ਸਹੀ ਰੂਪ ਚੁਣੋ।\n\n“${sentence}”`,
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: `ਵਾਕ ਵਿੱਚ ‘${wrong}’ ਦੀ ਥਾਂ ‘${target.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ। ${target.explanationPa}`,
    authorityIds: [target.id],
  });
}

export function generateCP002F03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Medium") throw new Error("CP002 F03 supports Medium only");
  const target = item(seed + 201);
  const blanked = target.contextPa.replace(target.correct, "____");
  return assemble({
    seed,
    difficulty,
    familyId: "F03",
    subtype: "CONTEXTUAL_COMPLETION",
    stem: `ਖਾਲੀ ਥਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ਚੁਣੋ।\n\n“${blanked}”`,
    correctAnswer: target.correct,
    distractors: target.incorrect,
    explanation: `ਖਾਲੀ ਥਾਂ ਵਿੱਚ ‘${target.correct}’ ਆਵੇਗਾ। ${target.explanationPa}`,
    authorityIds: [target.id],
  });
}

export function generateCP002F04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP002 F04 supports Hard only");
  const a = item(seed + 301);
  const b = pairedItem(seed + 301);
  const rng = createRng(seed + 307);
  const wrongA = rng.pickOne(a.incorrect);
  const wrongB = rng.pickOne(b.incorrect);
  const broken = `${a.contextPa.replace(a.correct, wrongA)} ${b.contextPa.replace(b.correct, wrongB)}`;
  const correct = `${a.contextPa} ${b.contextPa}`;
  const d1 = `${a.contextPa.replace(a.correct, wrongA)} ${b.contextPa}`;
  const d2 = `${a.contextPa} ${b.contextPa.replace(b.correct, wrongB)}`;
  const d3 = `${a.contextPa.replace(a.correct, a.incorrect[1])} ${b.contextPa.replace(b.correct, b.incorrect[1])}`;
  return assemble({
    seed,
    difficulty,
    familyId: "F04",
    subtype: "MULTI_ERROR_SENTENCE_REPAIR",
    stem: `ਦੋਵੇਂ ਸ਼ਬਦ-ਜੋੜ ਠੀਕ ਕਰਕੇ ਸਹੀ ਵਾਕ-ਰੂਪ ਚੁਣੋ।\n\n“${broken}”`,
    correctAnswer: correct,
    distractors: [d1, d2, d3],
    explanation: `ਪਹਿਲੇ ਵਾਕ ਵਿੱਚ ‘${wrongA}’ ਦੀ ਥਾਂ ‘${a.correct}’ ਅਤੇ ਦੂਜੇ ਵਾਕ ਵਿੱਚ ‘${wrongB}’ ਦੀ ਥਾਂ ‘${b.correct}’ ਲਿਖਿਆ ਜਾਵੇਗਾ।`,
    authorityIds: [a.id, b.id],
  });
}

export function generateCP002F05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  if (difficulty !== "Hard") throw new Error("CP002 F05 supports Hard only");
  const target = item(seed + 401);
  const other = pairedItem(seed + 401);
  const correct = `${target.correct} — ${other.correct}`;
  const d1 = `${target.incorrect[0]} — ${other.correct}`;
  const d2 = `${target.correct} — ${other.incorrect[0]}`;
  const d3 = `${target.incorrect[1]} — ${other.incorrect[1]}`;
  return assemble({
    seed,
    difficulty,
    familyId: "F05",
    subtype: "TWO_WORD_PRECISION",
    stem: "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਦੋਵੇਂ ਸ਼ਬਦ ਸ਼ੁੱਧ ਲਿਖੇ ਹੋਏ ਹਨ।",
    correctAnswer: correct,
    distractors: [d1, d2, d3],
    explanation: `ਸਹੀ ਜੋੜ ‘${target.correct} — ${other.correct}’ ਹੈ।`,
    authorityIds: [target.id, other.id],
  });
}

export const CP002_FAMILIES: readonly PunjabiQuestionFamilyDefinition[] = [
  { familyId: "F01", subtype: "CORRECT_FORM_RECOGNITION", name: "ਸ਼ੁੱਧ ਸ਼ਬਦ ਦੀ ਪਛਾਣ", targetDifficulties: ["Easy"], generate: generateCP002F01 },
  { familyId: "F02", subtype: "SENTENCE_ERROR_CORRECTION", name: "ਵਾਕ ਵਿੱਚ ਸ਼ਬਦ-ਜੋੜ ਸੁਧਾਰ", targetDifficulties: ["Medium"], generate: generateCP002F02 },
  { familyId: "F03", subtype: "CONTEXTUAL_COMPLETION", name: "ਸੰਦਰਭ ਅਨੁਸਾਰ ਸ਼ਬਦ-ਜੋੜ", targetDifficulties: ["Medium"], generate: generateCP002F03 },
  { familyId: "F04", subtype: "MULTI_ERROR_SENTENCE_REPAIR", name: "ਦੋਹਰਾ ਸ਼ਬਦ-ਜੋੜ ਸੁਧਾਰ", targetDifficulties: ["Hard"], generate: generateCP002F04 },
  { familyId: "F05", subtype: "TWO_WORD_PRECISION", name: "ਦੋ ਸ਼ਬਦਾਂ ਦੀ ਸ਼ੁੱਧਤਾ", targetDifficulties: ["Hard"], generate: generateCP002F05 },
] as const;
