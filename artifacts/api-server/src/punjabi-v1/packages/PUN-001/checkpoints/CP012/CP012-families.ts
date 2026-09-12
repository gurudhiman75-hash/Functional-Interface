/**
 * CP012 Question Families:
 * CP012-F01: Proverb Meaning / Lesson (ਅਖਾਣ ਦਾ ਭਾਵ-ਅਰਥ)
 * CP012-F02: Proverb Completion (ਅਖਾਣ ਪੂਰਾ ਕਰਨਾ)
 */

import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import { CP012_PROVERB_ITEMS, type ProverbItem } from "./CP012-authorities";

function assembleCP012Question(input: {
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
      `Insufficient distinct distractors for CP012 ${input.familyId}. Got ${filteredDistractors.length}`
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
    id: `PUN-001-CP012-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: shuffledOptions.map((o) => o.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP012",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "1.0.0",
      fingerprint: `FINGERPRINT-CP012-${input.familyId}-${input.seed}`,
    },
  };

  assertValidPunjabiQuestion(q);
  return q;
}

// -------------------------------------------------------------------------
const CP012_F01_STEM_TEMPLATES = [
  (prv: string) => `ਅਖਾਣ ‘${prv}’ ਦਾ ਸਹੀ ਭਾਵ-ਅਰਥ ਕੀ ਹੈ?`,
  (prv: string) => `‘${prv}’ ਕਹਾਵਤ ਵਿੱਚ ਕਿਹੜੀ ਜੀਵਨ-ਸਿੱਖਿਆ ਜਾਂ ਭਾਵ ਛੁਪਿਆ ਹੋਇਆ ਹੈ?`,
  (prv: string) => `ਲੋਕ-ਅਖਾਣ ‘${prv}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਦਰਜ ਹੈ?`,
  (prv: string) => `ਜਦੋਂ ਕੋਈ ਬੋਲਦਾ ਹੈ: “${prv}”, ਤਾਂ ਇਸ ਦਾ ਸਹੀ ਮਤਲਬ ਕੀ ਬਣਦਾ ਹੈ?`,
  (prv: string) => `ਪੰਜਾਬੀ ਅਖਾਣ ‘${prv}’ ਦਾ ਅਸਲ ਮਨੋਰਥ ਕੀ ਦਰਸਾਉਣਾ ਹੈ?`,
  (prv: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਅਖਾਣ ‘${prv}’ ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਕਰਦਾ ਹੈ?`,
];

const CP012_F02_STEM_TEMPLATES = [
  (p1: string) => `ਅਖਾਣ ਦੀਆਂ ਤੁਕਾਂ ਪੂਰੀਆਂ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n\n“${p1} _______”`,
  (p1: string) => `ਹੇਠ ਦਿੱਤੇ ਅਧੂਰੇ ਅਖਾਣ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਢੁਕਵੀਂ ਤੁਕ ਚੁਣੋ:\n\n“${p1} _______”`,
  (p1: string) => `“${p1} _______” — ਖ਼ਾਲੀ ਥਾਂ ਭਰ ਕੇ ਪ੍ਰਮਾਣਿਕ ਪੰਜਾਬੀ ਅਖਾਣ ਮੁਕੰਮਲ ਕਰੋ:`,
  (p1: string) => `ਦਿੱਤੀ ਗਈ ਅਖਾਣ ਦੀ ਪਹਿਲੀ ਤੁਕ “${p1}” ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਦੂਸਰੀ ਤੁਕ ਚੁਣੋ:`,
  (p1: string) => `ਲੋਕ-ਬੋਲੀ ਅਨੁਸਾਰ ਅਧੂਰੇ ਅਖਾਣ “${p1} _______” ਦਾ ਸਹੀ ਅੰਤ ਕਿਹੜਾ ਹੈ?`,
  (p1: string) => `ਅਧੂਰੀ ਤੁਕ “${p1} _______” ਲਈ ਸਹੀ ਵਿਕਲਪ ਦੱਸੋ:`,
];

const CP012_F02_REVERSE_TEMPLATES = [
  (p2: string) => `ਹੇਠਾਂ ਦਿੱਤੀ ਤੁਕ “_______ ${p2}” ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਅਖਾਣ ਦਾ ਪਹਿਲਾ ਅੱਧ ਚੁਣੋ:`,
  (p2: string) => `ਅਖਾਣ ਦਾ ਮੁੱਢਲਾ ਹਿੱਸਾ ਲੱਭੋ:\n\n“_______ ${p2}”`,
  (p2: string) => `ਕਿਹੜੀ ਤੁਕ ਨਾਲ ਮਿਲ ਕੇ ਅਖਾਣ “_______ ${p2}” ਪੂਰਾ ਹੁੰਦਾ ਹੈ?`,
  (p2: string) => `ਦਿੱਤੇ ਗਏ ਅਖਾਣ ਦੀ ਪਿਛਲੀ ਤੁਕ “_______ ${p2}” ਦਾ ਮੁੱਢਲਾ ਅੰਗ ਕਿਹੜਾ ਹੈ?`,
];

const CP012_F03_STEM_TEMPLATES = [
  (sit: string) => `ਹੇਠਾਂ ਦਿੱਤੀ ਸਥਿਤੀ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?\n\n“${sit}”`,
  (sit: string) => `“${sit}” — ਇਸ ਸਥਿਤੀ ਨੂੰ ਬਿਆਨ ਕਰਨ ਲਈ ਟਕਸਾਲੀ ਪੰਜਾਬੀ ਦਾ ਕਿਹੜਾ ਅਖਾਣ ਢੁਕਵਾਂ ਹੈ?`,
  (sit: string) => `ਕਿਸੇ ਪ੍ਰਸੰਗ ਵਿੱਚ ਜਦੋਂ ${sit}, ਤਾਂ ਉਸ ਮੌਕੇ ਕਿਹੜਾ ਅਖਾਣ ਬੋਲਿਆ ਜਾਂਦਾ ਹੈ?`,
  (sit: string) => `ਹੇਠ ਲਿਖੀ ਘਟਨਾ ਜਾਂ ਪਰਿਸਥਿਤੀ ਦੇ ਢੁਕਵੇਂ ਪ੍ਰਗਟਾਵੇ ਲਈ ਸਹੀ ਅਖਾਣ ਚੁਣੋ:\n\n“${sit}”`,
  (sit: string) => `ਇਸ ਵਿਸ਼ੇਸ਼ ਘਟਨਾਚੱਕਰ “${sit}” ਸੰਦਰਭ ਵਿੱਚ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਲੋਕ-ਅਖਾਣ ਕਿਹੜਾ ਹੈ?`,
];

// -------------------------------------------------------------------------
// FAMILY 1: Proverb Meaning / Lesson (ਅਖਾਣ ਦਾ ਭਾਵ-ਅਰਥ)
// -------------------------------------------------------------------------
export function generateCP012F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(CP012_PROVERB_ITEMS);
  const easyTemplates = [
    (prv: string) => `ਅਖਾਣ ‘${prv}’ ਦਾ ਸਧਾਰਨ ਅਰਥ ਕੀ ਹੈ?`,
    (prv: string) => `‘${prv}’ ਕਹਾਵਤ ਦਾ ਸਹੀ ਭਾਵ-ਅਰਥ ਚੁਣੋ:`,
    (prv: string) => `ਪੰਜਾਬੀ ਅਖਾਣ ‘${prv}’ ਦਾ ਮੁੱਢਲਾ ਅਰਥ ਕਿਹੜਾ ਹੈ?`,
  ];
  const medTemplates = [
    (prv: string) => `ਲੋਕ-ਅਖਾਣ ‘${prv}’ ਦਾ ਢੁਕਵਾਂ ਅਰਥ ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਦਰਜ ਹੈ?`,
    (prv: string) => `ਜਦੋਂ ਕੋਈ ਬੋਲਦਾ ਹੈ: “${prv}”, ਤਾਂ ਇਸ ਦਾ ਸਹੀ ਮਤਲਬ ਕੀ ਬਣਦਾ ਹੈ?`,
    (prv: string) => `ਪੰਜਾਬੀ ਅਖਾਣ ‘${prv}’ ਦਾ ਅਸਲ ਮਨੋਰਥ ਕੀ ਦਰਸਾਉਣਾ ਹੈ?`,
  ];
  const hardTemplates = [
    (prv: string) => `ਟਕਸਾਲੀ ਲੋਕਧਾਰਾ ਅਨੁਸਾਰ ‘${prv}’ ਦਾ ਗੂੜ੍ਹ ਭਾਵ-ਅਰਥ ਕਿਹੜਾ ਹੈ?`,
    (prv: string) => `‘${prv}’ ਕਹਾਵਤ ਵਿੱਚ ਕਿਹੜੀ ਜੀਵਨ-ਸਿੱਖਿਆ ਜਾਂ ਨੈਤਿਕ ਭਾਵ ਛੁਪਿਆ ਹੋਇਆ ਹੈ?`,
    (prv: string) => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਕਲਪ ਅਖਾਣ ‘${prv}’ ਦੀ ਸਭ ਤੋਂ ਸਟੀਕ ਵਿਆਖਿਆ ਕਰਦਾ ਹੈ?`,
  ];
  const templates = difficulty === "Easy" ? easyTemplates : difficulty === "Medium" ? medTemplates : hardTemplates;
  const stemTemplate = rng.pickOne(templates);

  return assembleCP012Question({
    familyId: "F01",
    seed,
    difficulty,
    stem: stemTemplate(item.proverbPa),
    correctAnswer: item.meaningPa,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

// -------------------------------------------------------------------------
// FAMILY 2: Proverb Completion (ਅਖਾਣ ਪੂਰਾ ਕਰਨਾ)
// -------------------------------------------------------------------------
export function generateCP012F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(CP012_PROVERB_ITEMS);
  const isForward = rng.next() > 0.4;

  if (isForward) {
  const easyFwd = [
    (p1: string) => `ਸਧਾਰਨ ਤੁਕ “${p1} _______” ਨੂੰ ਪੂਰਾ ਕਰੋ:`,
    (p1: string) => `“${p1} _______” — ਖ਼ਾਲੀ ਥਾਂ ਭਰ ਕੇ ਅਖਾਣ ਮੁਕੰਮਲ ਕਰੋ:`,
  ];
  const medFwd = [
    (p1: string) => `ਅਖਾਣ ਦੀਆਂ ਤੁਕਾਂ ਪੂਰੀਆਂ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ:\n\n“${p1} _______”`,
    (p1: string) => `ਹੇਠ ਦਿੱਤੇ ਅਧੂਰੇ ਅਖਾਣ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਢੁਕਵੀਂ ਤੁਕ ਚੁਣੋ:\n\n“${p1} _______”`,
  ];
  const hardFwd = [
    (p1: string) => `ਪ੍ਰਮਾਣਿਕ ਪੰਜਾਬੀ ਲੋਕ-ਬੋਲੀ ਅਨੁਸਾਰ ਅਧੂਰੇ ਅਖਾਣ “${p1} _______” ਦਾ ਸ਼ੁੱਧ ਅੰਤ ਕਿਹੜਾ ਹੈ?`,
    (p1: string) => `ਦਿੱਤੀ ਗਈ ਅਖਾਣ ਦੀ ਪਹਿਲੀ ਤੁਕ “${p1}” ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਸਹੀ ਦੂਸਰੀ ਤੁਕ ਚੁਣੋ:`,
  ];
  const templates = difficulty === "Easy" ? easyFwd : difficulty === "Medium" ? medFwd : hardFwd;
  const stemTemplate = rng.pickOne(templates);
    const otherSecondParts = Array.from(
      new Set(
        CP012_PROVERB_ITEMS.filter(
          (i) => i.id !== item.id && i.secondPartPa.trim() !== item.secondPartPa.trim()
        ).map((i) => i.secondPartPa)
      )
    );

    return assembleCP012Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: stemTemplate(item.firstPartPa),
      correctAnswer: item.secondPartPa,
      distractors: otherSecondParts,
      explanation: `ਸਹੀ ਅਖਾਣ ਹੈ: “${item.proverbPa}”। (${item.explanationPa})`,
      authorityIds: [item.id],
    });
  } else {
    const stemTemplate = rng.pickOne(CP012_F02_REVERSE_TEMPLATES);
    const otherFirstParts = Array.from(
      new Set(
        CP012_PROVERB_ITEMS.filter(
          (i) => i.id !== item.id && i.firstPartPa.trim() !== item.firstPartPa.trim()
        ).map((i) => i.firstPartPa)
      )
    );

    return assembleCP012Question({
      familyId: "F02",
      seed,
      difficulty,
      stem: stemTemplate(item.secondPartPa),
      correctAnswer: item.firstPartPa,
      distractors: otherFirstParts,
      explanation: `ਸਹੀ ਅਖਾਣ ਹੈ: “${item.proverbPa}”। (${item.explanationPa})`,
      authorityIds: [item.id],
    });
  }
}

// -------------------------------------------------------------------------
// FAMILY 3: Situational Proverb Application (ਪ੍ਰਸੰਗ ਮੁਤਾਬਕ ਢੁਕਵਾਂ ਅਖਾਣ)
// -------------------------------------------------------------------------
export function generateCP012F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed);

  const item = rng.pickOne(CP012_PROVERB_ITEMS);
  const easySit = [
    (sit: string) => `ਸਥਿਤੀ “${sit}” ਲਈ ਢੁਕਵਾਂ ਅਖਾਣ ਚੁਣੋ:`,
    (sit: string) => `ਇਸ ਮੌਕੇ ਕਿਹੜਾ ਅਖਾਣ ਬੋਲਿਆ ਜਾਵੇਗਾ?\n“${sit}”`,
  ];
  const medSit = [
    (sit: string) => `ਹੇਠਾਂ ਦਿੱਤੀ ਸਥਿਤੀ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਅਖਾਣ ਕਿਹੜਾ ਹੈ?\n\n“${sit}”`,
    (sit: string) => `ਕਿਸੇ ਪ੍ਰਸੰਗ ਵਿੱਚ ਜਦੋਂ ${sit}, ਤਾਂ ਉਸ ਮੌਕੇ ਕਿਹੜਾ ਅਖਾਣ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`,
  ];
  const hardSit = [
    (sit: string) => `ਇਸ ਵਿਸ਼ੇਸ਼ ਘਟਨਾਚੱਕਰ “${sit}” ਸੰਦਰਭ ਵਿੱਚ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਲੋਕ-ਅਖਾਣ ਕਿਹੜਾ ਹੈ?`,
    (sit: string) => `“${sit}” — ਇਸ ਗੰਭੀਰ ਪਰਿਸਥਿਤੀ ਦੇ ਢੁਕਵੇਂ ਪ੍ਰਗਟਾਵੇ ਲਈ ਸਹੀ ਅਖਾਣ ਚੁਣੋ:`,
  ];
  const templates = difficulty === "Easy" ? easySit : difficulty === "Medium" ? medSit : hardSit;
  const stemTemplate = rng.pickOne(templates);

  const otherProverbs = Array.from(
    new Set(
      CP012_PROVERB_ITEMS.filter(
        (i) => i.id !== item.id && i.proverbPa.trim() !== item.proverbPa.trim()
      ).map((i) => i.proverbPa)
    )
  );

  return assembleCP012Question({
    familyId: "F03",
    seed,
    difficulty,
    stem: stemTemplate(item.situationPa),
    correctAnswer: item.proverbPa,
    distractors: otherProverbs,
    explanation: `${item.explanationPa} ਇਸ ਲਈ ਇਸ ਪ੍ਰਸੰਗ ਵਿੱਚ ਅਖਾਣ ‘${item.proverbPa}’ ਬਿਲਕੁਲ ਢੁਕਵਾਂ ਹੈ।`,
    authorityIds: [item.id],
  });
}
