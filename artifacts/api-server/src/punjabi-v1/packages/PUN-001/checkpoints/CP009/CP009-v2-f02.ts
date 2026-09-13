import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { ANTONYM_PAIRS } from "./CP009-authorities";

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function generateCP009V2F02Forward(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 201);
  const item = rng.pickOne(ANTONYM_PAIRS);
  const distractors = Array.from(new Set(item.distractors.map((value) => value.trim())))
    .filter((value) => value !== item.antonym);
  if (distractors.length < 3) {
    throw new Error(`CP009 V2 ${item.id} needs at least three source-side confusables`);
  }
  const chosen = rng.pickDistinct(distractors, 3);
  const raw: PunjabiQuestionOption[] = [
    { id: "c", text: item.antonym, isCorrect: true },
    { id: "d1", text: chosen[0]!, isCorrect: false },
    { id: "d2", text: chosen[1]!, isCorrect: false },
    { id: "d3", text: chosen[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(raw);
  const templates = [
    `‘${item.word}’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.word}’ ਦੇ ਉਲਟ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।`,
    `‘${item.word}’ ਦਾ ਸਹੀ ਵਿਰੋਧੀ ਸ਼ਬਦ ਦੱਸੋ।`,
  ];
  const stem = rng.pickOne(templates);
  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP009-V2-F02-S${seed}-${difficulty.toUpperCase()}`,
    stem,
    options: options.map((option) => option.text),
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: item.explanationPa,
    difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP009",
      familyId: "F02",
      difficulty,
      language: "pa-Guru",
      seed,
      authorityIds: [item.id],
      generatorRevision: "2.0.1",
      fingerprint: `CP009-V2-${hashText(["F02", difficulty, stem, item.antonym, item.id].join("|"))}`,
    },
  };
  assertValidPunjabiQuestion(question);
  return question;
}
