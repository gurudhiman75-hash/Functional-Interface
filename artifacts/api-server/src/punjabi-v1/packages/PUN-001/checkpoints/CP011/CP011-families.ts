/**
 * CP011 Question Families:
 * CP011-F01: Idiom Meaning Resolution (ਮੁਹਾਵਰੇ ਦਾ ਅਰਥ)
 * CP011-F02: Contextual Sentence Blank Completion (ਵਾਕ ਵਿੱਚ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਭਰਨਾ)
 * CP011-F03: Reverse Meaning / Scenario to Idiom (ਅਰਥ ਤੋਂ ਮੁਹਾਵਰੇ ਦੀ ਪਛਾਣ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP011_IDIOM_ITEMS, type IdiomMasteryItem } from "./CP011-authorities";

function assembleCP011Question(input: {
  familyId: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed);

  const filteredDistractors = Array.from(
    new Set(
      input.distractors
        .map((d) => d.trim())
        .filter((d) => d.length > 0 && d !== input.correctAnswer.trim())
    )
  );
  if (filteredDistractors.length < 3) {
    throw new Error(
      `Insufficient distinct distractors for CP011 ${input.familyId}. Got ${filteredDistractors.length}`
    );
  }

  const selectedDistractors = rng.pickDistinct(filteredDistractors, 3);

  const rawOptions: PunjabiQuestionOption[] = [
    { id: "opt-correct", text: input.correctAnswer, isCorrect: true },
    { id: "opt-dist-1", text: selectedDistractors[0]!, isCorrect: false },
    { id: "opt-dist-2", text: selectedDistractors[1]!, isCorrect: false },
    { id: "opt-dist-3", text: selectedDistractors[2]!, isCorrect: false },
  ];

  const shuffledOptions = rng.shuffle(rawOptions);
  const correctIndex = shuffledOptions.findIndex((o) => o.isCorrect);

  const q: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP011-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP011",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP011-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
// TEMPLATES: F01 (Idiom Meaning Resolution)
// -------------------------------------------------------------------------

const CP011_F01_EASY_TEMPLATES = [
  (idm: string) => `ਮੁਹਾਵਰਾ ‘${idm}’ ਦਾ ਸਹੀ ਅਰਥ ਚੁਣੋ:`,
  (idm: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਮੁਹਾਵਰੇ ‘${idm}’ ਦਾ ਢੁਕਵਾਂ ਭਾਵ ਪ੍ਰਗਟਾਉਂਦਾ ਹੈ?`,
  (idm: string) => `‘${idm}’ ਮੁਹਾਵਰੇ ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਕੀ ਹੋਵੇਗੀ?`,
];

const CP011_F01_MED_TEMPLATES = [
  (idm: string) => `ਜਦੋਂ ਕੋਈ ਵਿਅਕਤੀ ‘${idm}’ ਆਖਦਾ ਹੈ, ਤਾਂ ਉਸ ਦਾ ਅਸਲ ਮਤਲਬ ਕੀ ਹੁੰਦਾ ਹੈ?`,
  (idm: string) => `ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਮੁਹਾਵਰੇ ‘${idm}’ ਦਾ ਸਹੀ ਭਾਵ-ਅਰਥ ਦੱਸੋ:`,
  (idm: string) => `ਦਿੱਤੇ ਗਏ ਮੁਹਾਵਰੇ ‘${idm}’ ਦੇ ਸਹੀ ਅਰਥ ਵਾਲਾ ਵਿਕਲਪ ਲੱਭੋ:`,
];

const CP011_F01_HARD_TEMPLATES = [
  (idm: string) => `ਪ੍ਰੀਖਿਆ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਮੁਹਾਵਰਾ ‘${idm}’ ਕਿਸ ਭਾਵ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`,
  (idm: string) => `ਕਿਹੜਾ ਵਿਕਲਪ ‘${idm}’ ਮੁਹਾਵਰੇ ਦਾ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਅਰਥ ਪੇਸ਼ ਕਰਦਾ ਹੈ?`,
  (idm: string) => `ਡੂੰਘੇ ਭਾਸ਼ਾਈ ਸੰਦਰਭ ਵਿੱਚ ਮੁਹਾਵਰਾ ‘${idm}’ ਕਿਸ ਲੱਛਣਿਕ ਅਰਥ ਦਾ ਲਖਾਇਕ ਹੈ?`,
];

// -------------------------------------------------------------------------
// TEMPLATES: F02 (Contextual Sentence Blank)
// -------------------------------------------------------------------------

const CP011_F02_EASY_TEMPLATES = [
  (ctx: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਵਾਕ ਦੀ ਖ਼ਾਲੀ ਥਾਂ ਵਿੱਚ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਚੁਣੋ:

“${ctx}”`,
  (ctx: string) => `ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ਖ਼ਾਲੀ ਥਾਂ 'ਤੇ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ਢੁਕਵਾਂ ਬੈਠਦਾ ਹੈ?

“${ctx}”`,
];

const CP011_F02_MED_TEMPLATES = [
  (ctx: string) => `“${ctx}” — ਇਸ ਵਾਕ ਦੇ ਅਰਥ ਨੂੰ ਮੁਕੰਮਲ ਕਰਨ ਲਈ ਸਹੀ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?`,
  (ctx: string) => `ਦਿੱਤੇ ਗਏ ਕਥਨ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਦੀ ਪੂਰਤੀ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੋਵੇਗਾ?

“${ctx}”`,
];

const CP011_F02_HARD_TEMPLATES = [
  (ctx: string) => `ਪ੍ਰਸੰਗਿਕ ਵਾਕ ਪੂਰਾ ਕਰਨ ਲਈ ਸਹੀ ਮੁਹਾਵਰੇ ਦੀ ਚੋਣ ਕਰੋ:

“${ctx}”`,
  (ctx: string) => `ਹੇਠ ਲਿਖੇ ਵਾਕ ਵਿੱਚ ਖ਼ਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਪ੍ਰਮਾਣਿਕ ਮੁਹਾਵਰਾ ਆਵੇਗਾ?

“${ctx}”`,
];

// -------------------------------------------------------------------------
// TEMPLATES: F03 (Scenario to Idiom)
// -------------------------------------------------------------------------

const CP011_F03_EASY_TEMPLATES = [
  (m: string) => `ਹੇਠਾਂ ਦਿੱਤੇ ਅਰਥ ਲਈ ਢੁਕਵਾਂ ਪੰਜਾਬੀ ਮੁਹਾਵਰਾ ਕਿਹੜਾ ਹੈ?

“${m}”`,
  (m: string) => `ਕਿਸੇ ਅਜਿਹੀ ਸਥਿਤੀ ਲਈ ਜਿੱਥੇ “${m}”, ਕਿਹੜਾ ਮੁਹਾਵਰਾ ਬੋਲਿਆ ਜਾਂਦਾ ਹੈ?`,
];

const CP011_F03_MED_TEMPLATES = [
  (m: string) => `“${m}” — ਇਸ ਭਾਵ-ਅਰਥ ਨੂੰ ਪ੍ਰਗਟ ਕਰਨ ਵਾਲਾ ਪ੍ਰਮਾਣਿਕ ਮੁਹਾਵਰਾ ਚੁਣੋ:`,
  (m: string) => `ਦਿੱਤੇ ਗਏ ਅਰਥ “${m}” ਦਾ ਸਹੀ ਪ੍ਰਤੀਕ ਮੁਹਾਵਰਾ ਦੱਸੋ:`,
];

const CP011_F03_HARD_TEMPLATES = [
  (m: string) => `ਜਦੋਂ ਕਿਸੇ ਨੂੰ “${m}” ਕਹਿਣਾ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ ਮੁਹਾਵਰਾ ਢੁਕਵਾਂ ਹੈ?`,
  (m: string) => `ਭਾਵ “${m}” ਨੂੰ ਸਹੀ ਰੂਪ ਵਿੱਚ ਦਰਸਾਉਂਦੇ ਮੁਹਾਵਰੇ ਦੀ ਚੋਣ ਕਰੋ:`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Idiom Meaning Resolution (ਮੁਹਾਵਰੇ ਦਾ ਅਰਥ)
// -------------------------------------------------------------------------
export function generateCP011F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(CP011_IDIOM_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP011_F01_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP011_F01_HARD_TEMPLATES
      : CP011_F01_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  return assembleCP011Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(item.idiomPa),
    correctAnswer: item.meaningPa,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Contextual Sentence Blank Completion
// -------------------------------------------------------------------------
export function generateCP011F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(CP011_IDIOM_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP011_F02_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP011_F02_HARD_TEMPLATES
      : CP011_F02_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  const otherIdioms = Array.from(
    new Set(
      CP011_IDIOM_ITEMS.filter((i) => i.id !== item.id && i.idiomPa !== item.idiomPa).map(
        (i) => i.idiomPa
      )
    )
  );

  return assembleCP011Question({
    familyId: "F02",
    seed,
    difficulty,
    stem: stemTemplate(item.contextSentence),
    correctAnswer: item.idiomPa,
    distractors: otherIdioms,
    explanation: `${item.explanationPa} ਇਸ ਲਈ ਵਾਕ ਦੇ ਪ੍ਰਸੰਗ ਅਨੁਸਾਰ ‘${item.idiomPa}’ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਮੁਹਾਵਰਾ ਹੈ।`,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 3: Reverse Meaning / Scenario to Idiom
// -------------------------------------------------------------------------
export function generateCP011F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);
  const item = rng.pickOne(CP011_IDIOM_ITEMS);

  const templatePool =
    difficulty === "Easy"
      ? CP011_F03_EASY_TEMPLATES
      : difficulty === "Hard"
      ? CP011_F03_HARD_TEMPLATES
      : CP011_F03_MED_TEMPLATES;

  const stemTemplate = rng.pickOne(templatePool);

  const otherIdioms = Array.from(
    new Set(
      CP011_IDIOM_ITEMS.filter((i) => i.id !== item.id && i.idiomPa !== item.idiomPa).map(
        (i) => i.idiomPa
      )
    )
  );

  return assembleCP011Question({
    familyId: "F03",
    seed,
    difficulty,
    stem: stemTemplate(item.meaningPa),
    correctAnswer: item.idiomPa,
    distractors: otherIdioms,
    explanation: `${item.explanationPa} ਇਸ ਲਈ “${item.meaningPa}” ਲਈ ਸਹੀ ਮੁਹਾਵਰਾ ‘${item.idiomPa}’ ਹੈ।`,
    authorityIds: [item.id],
  });
}
