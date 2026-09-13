import {
  assertStructuralPunjabiQuestion,
  createDeterministicRng,
  semanticFingerprint,
  type DeterministicRng,
  type PunjabiDifficulty,
  type PunjabiGeneratedQuestion,
} from "../../../../../core/runtime";
import {
  CARRIER_AUTHORITIES,
  CP001_LIFECYCLE,
  LAGA_AUTHORITIES,
  LAGAKHAR_AUTHORITIES,
  NAVEEN_LETTERS,
  SUBJOINED_AUTHORITIES,
  TRADITIONAL_GURMUKHI_ORDER,
  VARG_AUTHORITIES,
  WORD_ORTHOGRAPHY_AUTHORITIES,
} from "./authorities";

export const CP001_GENERATOR_REVISION = "2.0.0-forward-port" as const;

export interface CP001FamilyDefinition {
  familyId: string;
  subtype: string;
  allowedDifficulties: readonly PunjabiDifficulty[];
  generate(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion;
}

interface AssembleInput {
  familyId: string;
  subtype: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
  semanticKey: string;
  rng: DeterministicRng;
}

function assemble(input: AssembleInput): PunjabiGeneratedQuestion {
  const distractors = Array.from(new Set(input.distractors.map((value) => value.normalize("NFC"))))
    .filter((value) => value !== input.correctAnswer.normalize("NFC"));
  if (distractors.length < 3) {
    throw new Error(`${input.familyId} requires three unique same-domain distractors.`);
  }

  const chosen = distractors.length === 3 ? distractors : input.rng.pickDistinct(distractors, 3);
  const rawOptions = [input.correctAnswer, ...chosen];
  const options = input.rng.shuffle(rawOptions);
  const correctIndex = options.indexOf(input.correctAnswer);
  const fingerprint = semanticFingerprint([
    "PUN-001-CP001",
    input.familyId,
    input.subtype,
    input.semanticKey,
    input.correctAnswer,
    ...[...input.authorityIds].sort(),
  ]);

  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP001-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options,
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP001",
      familyId: input.familyId,
      subtype: input.subtype,
      difficulty: input.difficulty,
      seed: input.seed,
      authorityIds: [...input.authorityIds],
      generatorRevision: CP001_GENERATOR_REVISION,
      semanticFingerprint: fingerprint,
      lifecycle: CP001_LIFECYCLE,
    },
  };

  assertStructuralPunjabiQuestion(question);
  return question;
}

function distractorLetters(correct: string, rng: DeterministicRng): string[] {
  const pool = [...TRADITIONAL_GURMUKHI_ORDER, ...NAVEEN_LETTERS].filter((letter) => letter !== correct);
  return rng.pickDistinct(pool, 3);
}

function generateF01(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F01");
  const maxIndex = TRADITIONAL_GURMUKHI_ORDER.length - 2;
  const index = 3 + Math.floor(rng.next() * Math.max(1, maxIndex - 2));
  const current = TRADITIONAL_GURMUKHI_ORDER[index]!;
  const correct = TRADITIONAL_GURMUKHI_ORDER[index + 1]!;
  return assemble({
    familyId: "F01",
    subtype: "alphabet-next",
    seed,
    difficulty,
    stem: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ‘${current}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
    correctAnswer: correct,
    distractors: distractorLetters(correct, rng),
    explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ‘${current}’ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ‘${correct}’ ਆਉਂਦਾ ਹੈ।`,
    authorityIds: ["CP001-TRADITIONAL-ORDER"],
    semanticKey: `${current}>${correct}`,
    rng,
  });
}

function generateF02(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F02");
  const index = 4 + Math.floor(rng.next() * (TRADITIONAL_GURMUKHI_ORDER.length - 5));
  const current = TRADITIONAL_GURMUKHI_ORDER[index]!;
  const correct = TRADITIONAL_GURMUKHI_ORDER[index - 1]!;
  return assemble({
    familyId: "F02",
    subtype: "alphabet-previous",
    seed,
    difficulty,
    stem: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ‘${current}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅੱਖਰ ਆਉਂਦਾ ਹੈ?`,
    correctAnswer: correct,
    distractors: distractorLetters(correct, rng),
    explanation: `ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ‘${current}’ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ‘${correct}’ ਆਉਂਦਾ ਹੈ।`,
    authorityIds: ["CP001-TRADITIONAL-ORDER"],
    semanticKey: `${correct}<${current}`,
    rng,
  });
}

function generateF03(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F03");
  const authority = rng.pickOne(VARG_AUTHORITIES);
  const letter = rng.pickOne(authority.letters);
  const otherNames = VARG_AUTHORITIES.filter((item) => item.id !== authority.id).map((item) => item.name);
  return assemble({
    familyId: "F03",
    subtype: "varg-membership",
    seed,
    difficulty,
    stem: `ਅੱਖਰ ‘${letter}’ ਕਿਹੜੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`,
    correctAnswer: authority.name,
    distractors: otherNames,
    explanation: `‘${letter}’ ${authority.name} ਦਾ ਅੱਖਰ ਹੈ।`,
    authorityIds: [authority.id],
    semanticKey: `${letter}:${authority.name}`,
    rng,
  });
}

function generateF04(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F04");
  const authority = rng.pickOne(VARG_AUTHORITIES);
  const distractors = VARG_AUTHORITIES.filter((item) => item.id !== authority.id).map((item) => item.nasal);
  return assemble({
    familyId: "F04",
    subtype: "varg-nasal",
    seed,
    difficulty,
    stem: `${authority.name} ਦਾ ਨਾਸਕੀ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: authority.nasal,
    distractors,
    explanation: `${authority.name} ਦੇ ਪੰਜ ਅੱਖਰ ${authority.letters.join(", ")} ਹਨ; ਇਨ੍ਹਾਂ ਵਿੱਚ ਨਾਸਕੀ ਅੱਖਰ ‘${authority.nasal}’ ਹੈ।`,
    authorityIds: [authority.id],
    semanticKey: `${authority.name}:${authority.nasal}`,
    rng,
  });
}

function generateF05(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F05");
  const correct = rng.pickOne(NAVEEN_LETTERS);
  const traditionalPool = TRADITIONAL_GURMUKHI_ORDER.filter((letter) => !NAVEEN_LETTERS.includes(letter as (typeof NAVEEN_LETTERS)[number]));
  return assemble({
    familyId: "F05",
    subtype: "naveen-letter-recognition",
    seed,
    difficulty,
    stem: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਨਵੀਨ ਅੱਖਰ ਕਿਹੜਾ ਹੈ?",
    correctAnswer: correct,
    distractors: rng.pickDistinct(traditionalPool, 3),
    explanation: `‘${correct}’ ਗੁਰਮੁਖੀ ਦਾ ਨਵੀਨ ਅੱਖਰ ਹੈ।`,
    authorityIds: ["CP001-NAVEEN-LETTERS"],
    semanticKey: correct,
    rng,
  });
}

function generateF06(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F06");
  const authority = rng.pickOne(LAGA_AUTHORITIES);
  const distractors = LAGA_AUTHORITIES.filter((item) => item.id !== authority.id).map((item) => item.name);
  return assemble({
    familyId: "F06",
    subtype: "laga-symbol-name",
    seed,
    difficulty,
    stem: `ਚਿੰਨ੍ਹ ‘${authority.symbol}’ ਨੂੰ ਕਿਹੜੀ ਲਗ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?`,
    correctAnswer: authority.name,
    distractors,
    explanation: `‘${authority.symbol}’ ${authority.name} ਦਾ ਚਿੰਨ੍ਹ ਹੈ।`,
    authorityIds: [authority.id],
    semanticKey: `${authority.symbol}:${authority.name}`,
    rng,
  });
}

function generateF07(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F07");
  const authority = rng.pickOne(CARRIER_AUTHORITIES);
  const distractors = CARRIER_AUTHORITIES.filter((item) => item.id !== authority.id).map((item) => item.independentVowel);
  return assemble({
    familyId: "F07",
    subtype: "carrier-laga-application",
    seed,
    difficulty,
    stem: `ਸਵਰ-ਵਾਹਕ ‘${authority.carrier}’ ਨਾਲ ${authority.lagaName} ਜੋੜਨ ਤੇ ਕਿਹੜਾ ਸਵਰ ਬਣਦਾ ਹੈ?`,
    correctAnswer: authority.independentVowel,
    distractors,
    explanation: `‘${authority.carrier}’ ਨਾਲ ${authority.lagaName} ‘${authority.lagaSymbol}’ ਜੋੜਨ ਤੇ ‘${authority.independentVowel}’ ਬਣਦਾ ਹੈ।`,
    authorityIds: [authority.id],
    semanticKey: `${authority.carrier}+${authority.lagaName}=${authority.independentVowel}`,
    rng,
  });
}

function generateF08(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F08");
  const authority = rng.pickOne(WORD_ORTHOGRAPHY_AUTHORITIES);
  const sameFeatureNames = authority.testedFeature === "ਲਗ"
    ? LAGA_AUTHORITIES.map((item) => item.name)
    : [...LAGAKHAR_AUTHORITIES.map((item) => item.name), "ਹਲੰਤ"];
  return assemble({
    familyId: "F08",
    subtype: "word-feature-identification",
    seed,
    difficulty,
    stem: `‘${authority.word}’ ਦੇ ‘${authority.focus}’ ਵਿੱਚ ਕਿਹੜੀ ${authority.testedFeature} ਵਰਤੀ ਗਈ ਹੈ?`,
    correctAnswer: authority.correctName,
    distractors: sameFeatureNames.filter((name) => name !== authority.correctName),
    explanation: authority.explanationPa,
    authorityIds: [authority.id],
    semanticKey: `${authority.word}:${authority.focus}:${authority.correctName}`,
    rng,
  });
}

function generateF09(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F09");
  const authority = rng.pickOne(SUBJOINED_AUTHORITIES);
  const distractors = ["ਹ", "ਰ", "ਵ", "ਯ", "ਲ"].filter((letter) => letter !== authority.subjoinedLetter);
  return assemble({
    familyId: "F09",
    subtype: "subjoined-context",
    seed,
    difficulty,
    stem: `‘${authority.word}’ ਦੇ ‘${authority.visibleSegment}’ ਵਿੱਚ ਕਿਹੜਾ ਅੱਖਰ ਪੈਰੀਂ ਰੂਪ ਵਿੱਚ ਆਇਆ ਹੈ?`,
    correctAnswer: authority.subjoinedLetter,
    distractors,
    explanation: authority.explanationPa,
    authorityIds: [authority.id],
    semanticKey: `${authority.word}:${authority.visibleSegment}:${authority.subjoinedLetter}`,
    rng,
  });
}

function generateF10(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const rng = createDeterministicRng(seed, "CP001-F10");
  const first = rng.pickOne(WORD_ORTHOGRAPHY_AUTHORITIES);
  const secondPool = WORD_ORTHOGRAPHY_AUTHORITIES.filter((item) => item.id !== first.id && item.correctName !== first.correctName);
  const second = rng.pickOne(secondPool);
  const pool = [...LAGA_AUTHORITIES.map((item) => item.name), ...LAGAKHAR_AUTHORITIES.map((item) => item.name)];
  const wrongA = rng.pickOne(pool.filter((name) => name !== first.correctName && name !== second.correctName));
  const wrongB = rng.pickOne(pool.filter((name) => name !== first.correctName && name !== second.correctName && name !== wrongA));
  const correct = `${first.correctName} — ${second.correctName}`;
  return assemble({
    familyId: "F10",
    subtype: "paired-orthographic-analysis",
    seed,
    difficulty,
    stem: `ਪਹਿਲਾ: ‘${first.word}’ ਦੇ ‘${first.focus}’ ਦੀ ਪਛਾਣ ਕਰੋ। ਦੂਜਾ: ‘${second.word}’ ਦੇ ‘${second.focus}’ ਦੀ ਪਛਾਣ ਕਰੋ। ਸਹੀ ਜੋੜਾ ਕਿਹੜਾ ਹੈ?`,
    correctAnswer: correct,
    distractors: [
      `${second.correctName} — ${first.correctName}`,
      `${wrongA} — ${second.correctName}`,
      `${first.correctName} — ${wrongB}`,
    ],
    explanation: `ਪਹਿਲੇ ਭਾਗ ਵਿੱਚ ${first.correctName} ਅਤੇ ਦੂਜੇ ਭਾਗ ਵਿੱਚ ${second.correctName} ਵਰਤੀ ਗਈ ਹੈ।`,
    authorityIds: [first.id, second.id],
    semanticKey: `${first.id}+${second.id}`,
    rng,
  });
}

export const CP001_FAMILIES: readonly CP001FamilyDefinition[] = [
  { familyId: "F01", subtype: "alphabet-next", allowedDifficulties: ["easy"], generate: generateF01 },
  { familyId: "F02", subtype: "alphabet-previous", allowedDifficulties: ["easy", "medium"], generate: generateF02 },
  { familyId: "F03", subtype: "varg-membership", allowedDifficulties: ["easy", "medium"], generate: generateF03 },
  { familyId: "F04", subtype: "varg-nasal", allowedDifficulties: ["medium"], generate: generateF04 },
  { familyId: "F05", subtype: "naveen-letter-recognition", allowedDifficulties: ["easy", "medium"], generate: generateF05 },
  { familyId: "F06", subtype: "laga-symbol-name", allowedDifficulties: ["easy"], generate: generateF06 },
  { familyId: "F07", subtype: "carrier-laga-application", allowedDifficulties: ["medium", "hard"], generate: generateF07 },
  { familyId: "F08", subtype: "word-feature-identification", allowedDifficulties: ["medium", "hard"], generate: generateF08 },
  { familyId: "F09", subtype: "subjoined-context", allowedDifficulties: ["medium", "hard"], generate: generateF09 },
  { familyId: "F10", subtype: "paired-orthographic-analysis", allowedDifficulties: ["hard"], generate: generateF10 },
] as const;

export function generateCP001ByFamily(
  familyId: string,
  seed: number,
  difficulty: PunjabiDifficulty,
): PunjabiGeneratedQuestion {
  const family = CP001_FAMILIES.find((item) => item.familyId === familyId);
  if (!family) throw new Error(`Unknown CP001 family: ${familyId}`);
  if (!family.allowedDifficulties.includes(difficulty)) {
    throw new Error(`${familyId} does not support ${difficulty} difficulty.`);
  }
  return family.generate(seed, difficulty);
}

export function generateCP001(seed: number, difficulty: PunjabiDifficulty): PunjabiGeneratedQuestion {
  const eligible = CP001_FAMILIES.filter((family) => family.allowedDifficulties.includes(difficulty));
  const rng = createDeterministicRng(seed, `CP001-${difficulty}-family`);
  const family = rng.pickOne(eligible);
  return family.generate(seed, difficulty);
}
