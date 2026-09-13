import { createRng } from "../../../../core/deterministic-rng";
import type { PunjabiDifficulty, PunjabiGeneratedQuestion, PunjabiQuestionOption } from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { ANTONYM_PAIRS, SYNONYM_SETS } from "./CP009-authorities";

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function uniqueCandidates<T extends { text: string }>(values: readonly T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const value of values) {
    const key = value.text.normalize("NFC").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push({ ...value, text: key });
  }
  return result;
}

function assemblePairQuestion(input: {
  familyId: "F07" | "F08";
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 9001);
  const correct = input.correctAnswer.normalize("NFC").trim();
  const distractors = Array.from(new Set(input.distractors.map((value) => value.normalize("NFC").trim())))
    .filter((value) => value && value !== correct);
  if (distractors.length < 3) throw new Error(`CP009 V2 ${input.familyId} pair guard needs three unique distractors; got ${distractors.length}`);
  const chosen = distractors.length === 3 ? distractors : rng.pickDistinct(distractors, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: correct, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonical = ["PUN-001-CP009-V2.1", input.familyId, input.difficulty, input.stem, correct, [...input.authorityIds].sort().join(",")].join("|");
  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP009-V2-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((option) => option.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP009",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "2.1.0",
      fingerprint: `CP009-V2-${hashText(canonical)}`,
    },
  };
  assertValidPunjabiQuestion(question);
  return question;
}

export function generateCP009V21F07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 701);
  const correctItem = createRng(seed + 709).pickOne(SYNONYM_SETS);
  const correctPair = `${correctItem.headword} — ${correctItem.primarySynonym}`;
  const candidates = uniqueCandidates(
    SYNONYM_SETS
      .filter((item) => item.id !== correctItem.id)
      .flatMap((item) => item.distractors.map((distractor) => ({ text: `${item.headword} — ${distractor}`, authorityId: item.id })))
      .filter((candidate) => candidate.text !== correctPair),
  );
  if (candidates.length < 3) throw new Error("CP009 V2 F07 authority pool cannot form three unique false pairs");
  const chosen = rng.pickDistinct(candidates, 3);
  return assemblePairQuestion({
    familyId: "F07",
    seed,
    difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",
    correctAnswer: correctPair,
    distractors: chosen.map((item) => item.text),
    explanation: `‘${correctItem.headword}’ ਅਤੇ ‘${correctItem.primarySynonym}’ ਸਮਾਨ ਅਰਥ ਪ੍ਰਗਟ ਕਰਦੇ ਹਨ।`,
    authorityIds: [correctItem.id, ...chosen.map((item) => item.authorityId)],
  });
}

export function generateCP009V21F08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 801);
  const correctItem = createRng(seed + 809).pickOne(ANTONYM_PAIRS);
  const correctPair = `${correctItem.word} — ${correctItem.antonym}`;
  const candidates = uniqueCandidates(
    ANTONYM_PAIRS
      .filter((item) => item.id !== correctItem.id)
      .flatMap((item) => item.distractors.map((distractor) => ({ text: `${item.word} — ${distractor}`, authorityId: item.id })))
      .filter((candidate) => candidate.text !== correctPair),
  );
  if (candidates.length < 3) throw new Error("CP009 V2 F08 authority pool cannot form three unique false pairs");
  const chosen = rng.pickDistinct(candidates, 3);
  return assemblePairQuestion({
    familyId: "F08",
    seed,
    difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਵਿਰੋਧੀ ਸ਼ਬਦਾਂ ਦੀ ਸਹੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",
    correctAnswer: correctPair,
    distractors: chosen.map((item) => item.text),
    explanation: correctItem.explanationPa,
    authorityIds: [correctItem.id, ...chosen.map((item) => item.authorityId)],
  });
}
