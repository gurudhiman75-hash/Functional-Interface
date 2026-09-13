import { createRng } from "../../../../core/deterministic-rng";
import type {
  PunjabiDifficulty,
  PunjabiGeneratedQuestion,
  PunjabiQuestionOption,
} from "../../../../core/types";
import { assertValidPunjabiQuestion } from "../CP001/validator";
import {
  PREFIX_ITEMS,
  SUFFIX_ITEMS,
  ROOT_WORD_ITEMS,
  type AffixItem,
  type RootWordItem,
} from "./CP008-authorities";

const ALL_AFFIX_ITEMS = [...PREFIX_ITEMS, ...SUFFIX_ITEMS] as readonly AffixItem[];

type AffixKind = "PREFIX" | "SUFFIX";

type SemanticClass =
  | "negative"
  | "positive"
  | "quantity"
  | "relation"
  | "place"
  | "agent"
  | "quality"
  | "abstract"
  | "neutral";

function hashText(value: string): string {
  let hash = 2166136261;
  for (const ch of value.normalize("NFC")) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function semanticFingerprint(input: {
  familyId: string;
  stem: string;
  correctAnswer: string;
  authorityIds: readonly string[];
}): string {
  const canonical = [
    "PUN-001-CP008-V4",
    input.familyId,
    input.stem,
    input.correctAnswer,
    [...input.authorityIds].sort().join(","),
  ]
    .join("|")
    .normalize("NFC");
  return `CP008-V4-${hashText(canonical)}`;
}

function assembleQuestion(input: {
  familyId: string;
  seed: number;
  difficulty: PunjabiDifficulty;
  stem: string;
  correctAnswer: string;
  distractors: readonly string[];
  explanation: string;
  authorityIds: readonly string[];
}): PunjabiGeneratedQuestion {
  const rng = createRng(input.seed + Number.parseInt(input.familyId.slice(1), 10) * 7919);
  const correct = input.correctAnswer.trim();
  const distractors = Array.from(
    new Set(input.distractors.map((value) => value.trim()).filter(Boolean))
  ).filter((value) => value !== correct);

  if (distractors.length < 3) {
    throw new Error(
      `CP008 V4 ${input.familyId} needs at least three distinct distractors; got ${distractors.length}`
    );
  }

  const picked = rng.pickDistinct(distractors, 3);
  const rawOptions: PunjabiQuestionOption[] = [
    { id: "correct", text: correct, isCorrect: true },
    { id: "d1", text: picked[0]!, isCorrect: false },
    { id: "d2", text: picked[1]!, isCorrect: false },
    { id: "d3", text: picked[2]!, isCorrect: false },
  ];
  const options = rng.shuffle(rawOptions);
  const correctIndex = options.findIndex((option) => option.isCorrect);

  const question: PunjabiGeneratedQuestion = {
    id: `PUN-001-CP008-V4-${input.familyId}-S${input.seed}-${input.difficulty.toUpperCase()}`,
    stem: input.stem,
    options: options.map((option) => option.text),
    correctIndex,
    explanation: input.explanation,
    difficulty: input.difficulty,
    metadata: {
      engine: "punjabi-v1",
      packageId: "PUN-001",
      cpId: "PUN-001-CP008",
      familyId: input.familyId,
      difficulty: input.difficulty,
      language: "pa-Guru",
      seed: input.seed,
      authorityIds: input.authorityIds,
      generatorRevision: "4.0.0",
      fingerprint: semanticFingerprint(input),
    },
  };

  assertValidPunjabiQuestion(question);
  return question;
}

function semanticClass(text: string): SemanticClass {
  if (/(ਬਿਨਾਂ|ਰਹਿਤ|ਬੁਰਾ|ਮੰਦਾ|ਵਿਰੋਧੀ|ਉਲਟ|ਨਾ-ਪੱਖੀ)/u.test(text)) return "negative";
  if (/(ਚੰਗਾ|ਸ਼੍ਰੇਸ਼ਠ|ਆਨੰਦ|ਉੱਚਾ|ਸੁੰਦਰ|ਖੁਸ਼)/u.test(text)) return "positive";
  if (/(ਘੱਟ|ਥੋੜ੍ਹਾ|ਅੱਧਾ|ਬਹੁ|ਵੱਧ|ਹਰੇਕ|ਪ੍ਰਤੀ)/u.test(text)) return "quantity";
  if (/(ਨਾਲ|ਸਾਂਝਾ|ਆਪਸੀ|ਸੰਬੰਧ|ਬਰਾਬਰ)/u.test(text)) return "relation";
  if (/(ਥਾਂ|ਸਥਾਨ|ਘਰ|ਅੰਦਰ|ਵਿਚਕਾਰ|ਅੱਗੇ|ਦੇਸ਼)/u.test(text)) return "place";
  if (/(ਵਾਲਾ|ਕਰਨ ਵਾਲਾ|ਰਚਨਾ ਕਰਨ|ਮਾਲਕ|ਮਾਹਰ|ਆਦੀ)/u.test(text)) return "agent";
  if (/(ਗੁਣ|ਸੁਭਾਅ|ਲੱਛਣ|ਯੁਕਤ)/u.test(text)) return "quality";
  if (/(ਭਾਵ|ਅਵਸਥਾ|ਭਾਵਵਾਚਕ)/u.test(text)) return "abstract";
  return "neutral";
}

function oppositeClass(value: SemanticClass): SemanticClass | null {
  if (value === "negative") return "positive";
  if (value === "positive") return "negative";
  return null;
}

function rankedAffixDistractors(
  item: AffixItem,
  difficulty: PunjabiDifficulty
): string[] {
  const ownClass = semanticClass(item.meaningPa);
  const opposite = oppositeClass(ownClass);
  const sameType = ALL_AFFIX_ITEMS.filter(
    (candidate) => candidate.type === item.type && candidate.id !== item.id
  );

  const ranked = sameType
    .map((candidate) => {
      const candidateClass = semanticClass(candidate.meaningPa);
      let score = 0;
      if (candidateClass === ownClass) score += difficulty === "Hard" ? 8 : 5;
      if (opposite && candidateClass === opposite) score += difficulty === "Hard" ? 7 : 3;
      if (candidate.affix.length === item.affix.length) score += 3;
      if (candidate.affix[0] === item.affix[0]) score += 2;
      score -= Math.abs(candidate.affix.length - item.affix.length);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id));

  const close = ranked.map(({ candidate }) => candidate.affix);
  return Array.from(new Set(close));
}

function groundedWordDistractors(item: AffixItem): string[] {
  const sameItem = [...item.spuriousWords];
  const neighboring = ALL_AFFIX_ITEMS.filter(
    (candidate) => candidate.type === item.type && candidate.id !== item.id
  ).flatMap((candidate) => candidate.validWords);
  return Array.from(new Set([...sameItem, ...neighboring]));
}

function pickAffixItem(seed: number, type: AffixKind): AffixItem {
  const rng = createRng(seed);
  return rng.pickOne(type === "PREFIX" ? PREFIX_ITEMS : SUFFIX_ITEMS);
}

function typeLabel(type: AffixKind): string {
  return type === "PREFIX" ? "ਅਗੇਤਰ" : "ਪਿਛੇਤਰ";
}

export function generateCP008V4F01(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 101);
  const item = pickAffixItem(seed + 103, "PREFIX");
  const word = rng.pickOne(item.validWords);
  const templates = [
    (value: string) => `‘${value}’ ਸ਼ਬਦ ਵਿੱਚ ਵਰਤਿਆ ਅਗੇਤਰ ਕਿਹੜਾ ਹੈ?`,
    (value: string) => `ਸ਼ਬਦ ‘${value}’ ਵਿੱਚ ਅਗੇਤਰ ਦੀ ਪਛਾਣ ਕਰੋ।`,
    (value: string) => `‘${value}’ ਦੀ ਬਣਤਰ ਵਿੱਚ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜਾ ਅਗੇਤਰ ਲੱਗਿਆ ਹੈ?`,
  ];
  return assembleQuestion({
    familyId: "F01",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(word),
    correctAnswer: item.affix,
    distractors: rankedAffixDistractors(item, difficulty),
    explanation: `‘${word}’ ਵਿੱਚ ‘${item.affix}’ ਅਗੇਤਰ ਹੈ। ${item.meaningPa}।`,
    authorityIds: [item.id],
  });
}

export function generateCP008V4F02(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 201);
  const item = pickAffixItem(seed + 211, "SUFFIX");
  const word = rng.pickOne(item.validWords);
  const templates = [
    (value: string) => `‘${value}’ ਸ਼ਬਦ ਵਿੱਚ ਵਰਤਿਆ ਪਿਛੇਤਰ ਕਿਹੜਾ ਹੈ?`,
    (value: string) => `ਸ਼ਬਦ ‘${value}’ ਦੇ ਅੰਤ ਵਿੱਚ ਜੁੜੇ ਪਿਛੇਤਰ ਦੀ ਪਛਾਣ ਕਰੋ।`,
    (value: string) => `‘${value}’ ਦੀ ਬਣਤਰ ਵਿੱਚ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਬਾਅਦ ਕਿਹੜਾ ਪਿਛੇਤਰ ਲੱਗਿਆ ਹੈ?`,
  ];
  return assembleQuestion({
    familyId: "F02",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(word),
    correctAnswer: item.affix,
    distractors: rankedAffixDistractors(item, difficulty),
    explanation: `‘${word}’ ਵਿੱਚ ‘${item.affix}’ ਪਿਛੇਤਰ ਹੈ। ${item.meaningPa}।`,
    authorityIds: [item.id],
  });
}

export function generateCP008V4F03(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 301);
  const type: AffixKind = rng.next() > 0.5 ? "PREFIX" : "SUFFIX";
  const item = pickAffixItem(seed + 307, type);
  const spurious = rng.pickOne(item.spuriousWords);
  const valid = rng.pickDistinct(item.validWords, 3);
  const label = typeLabel(type);
  const templates = [
    () => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਸ਼ਬਦ ਵਿੱਚ ‘${item.affix}’ ${label} ਵਜੋਂ ਨਹੀਂ ਵਰਤਿਆ ਗਿਆ?`,
    () => `‘${item.affix}’ ${label} ਵਾਲੇ ਸ਼ਬਦਾਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਮੂਲ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    () => `ਕਿਹੜਾ ਸ਼ਬਦ ‘${item.affix}’ ${label} ਲਗਾ ਕੇ ਨਹੀਂ ਬਣਿਆ?`,
  ];
  return assembleQuestion({
    familyId: "F03",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: spurious,
    distractors: valid,
    explanation: `‘${spurious}’ ਵਿੱਚ ‘${item.affix}’ ${label} ਨਹੀਂ ਹੈ; ਇਹ ਅੱਖਰ ਮੂਲ ਸ਼ਬਦ ਦਾ ਹੀ ਹਿੱਸਾ ਹਨ।`,
    authorityIds: [item.id],
  });
}

export function generateCP008V4F04(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 401);
  const item = rng.pickOne(ROOT_WORD_ITEMS);
  const label = typeLabel(item.affixType);
  const templates = [
    () => `‘${item.derivedWord}’ ਦਾ ਮੂਲ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    () => `‘${item.derivedWord}’ ਵਿੱਚੋਂ ‘${item.affix}’ ${label} ਵੱਖ ਕਰਨ ਤੇ ਕਿਹੜਾ ਮੂਲ ਸ਼ਬਦ ਬਚਦਾ ਹੈ?`,
    () => `ਸ਼ਬਦ-ਰਚਨਾ ਅਨੁਸਾਰ ‘${item.derivedWord}’ ਦਾ ਮੂਲ ਅੰਗ ਚੁਣੋ।`,
  ];
  return assembleQuestion({
    familyId: "F04",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: item.rootWord,
    distractors: item.distractors,
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

export function generateCP008V4F05(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 501);
  const item = pickAffixItem(seed + 503, "PREFIX");
  const correct = rng.pickOne(item.validWords);
  const templates = [
    () => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.affix}’ ਅਗੇਤਰ ਨਾਲ ਬਣਿਆ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    () => `‘${item.affix}’ ਨੂੰ ਅਗੇਤਰ ਵਜੋਂ ਵਰਤਣ ਵਾਲਾ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,
    () => `ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ‘${item.affix}’ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਪਹਿਲਾਂ ਅਗੇਤਰ ਵਜੋਂ ਜੁੜਿਆ ਹੈ?`,
  ];
  return assembleQuestion({
    familyId: "F05",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: correct,
    distractors: groundedWordDistractors(item),
    explanation: `‘${correct}’ ਵਿੱਚ ‘${item.affix}’ ਅਗੇਤਰ ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ। ${item.meaningPa}।`,
    authorityIds: [item.id],
  });
}

export function generateCP008V4F06(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 601);
  const item = pickAffixItem(seed + 607, "SUFFIX");
  const correct = rng.pickOne(item.validWords);
  const templates = [
    () => `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ‘${item.affix}’ ਪਿਛੇਤਰ ਨਾਲ ਬਣਿਆ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?`,
    () => `‘${item.affix}’ ਨੂੰ ਪਿਛੇਤਰ ਵਜੋਂ ਵਰਤਣ ਵਾਲਾ ਸਹੀ ਸ਼ਬਦ ਚੁਣੋ।`,
    () => `ਕਿਹੜੇ ਸ਼ਬਦ ਵਿੱਚ ‘${item.affix}’ ਮੂਲ ਸ਼ਬਦ ਤੋਂ ਬਾਅਦ ਪਿਛੇਤਰ ਵਜੋਂ ਜੁੜਿਆ ਹੈ?`,
  ];
  return assembleQuestion({
    familyId: "F06",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: correct,
    distractors: groundedWordDistractors(item),
    explanation: `‘${correct}’ ਵਿੱਚ ‘${item.affix}’ ਪਿਛੇਤਰ ਵਜੋਂ ਵਰਤਿਆ ਗਿਆ ਹੈ। ${item.meaningPa}।`,
    authorityIds: [item.id],
  });
}

function analysisOptions(item: RootWordItem): string[] {
  const correct =
    item.affixType === "PREFIX"
      ? `${item.affix} + ${item.rootWord}`
      : `${item.rootWord} + ${item.affix}`;
  const reversed =
    item.affixType === "PREFIX"
      ? `${item.rootWord} + ${item.affix}`
      : `${item.affix} + ${item.rootWord}`;
  const grounded = item.distractors.map((root) =>
    item.affixType === "PREFIX" ? `${item.affix} + ${root}` : `${root} + ${item.affix}`
  );
  return Array.from(new Set([reversed, ...grounded])).filter((value) => value !== correct);
}

export function generateCP008V4F07(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 701);
  const item = rng.pickOne(ROOT_WORD_ITEMS);
  const correct =
    item.affixType === "PREFIX"
      ? `${item.affix} + ${item.rootWord}`
      : `${item.rootWord} + ${item.affix}`;
  const templates = [
    () => `‘${item.derivedWord}’ ਦਾ ਸਹੀ ਸ਼ਬਦ-ਨਿਖੇੜ ਕਿਹੜਾ ਹੈ?`,
    () => `‘${item.derivedWord}’ ਦੀ ਬਣਤਰ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਵੱਖ ਕਰਕੇ ਦਰਸਾਉਣ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,
    () => `‘${item.derivedWord}’ ਵਿੱਚ ਅਗੇਤਰ/ਪਿਛੇਤਰ ਅਤੇ ਮੂਲ ਸ਼ਬਦ ਦੀ ਸਹੀ ਵੰਡ ਕਿਹੜੀ ਹੈ?`,
  ];
  return assembleQuestion({
    familyId: "F07",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: correct,
    distractors: analysisOptions(item),
    explanation: item.explanationPa,
    authorityIds: [item.id],
  });
}

function semanticOptionPool(item: AffixItem): string[] {
  const ownClass = semanticClass(item.meaningPa);
  const opposite = oppositeClass(ownClass);
  const candidates = ALL_AFFIX_ITEMS.filter(
    (candidate) => candidate.type === item.type && candidate.id !== item.id
  );
  const close = candidates.filter((candidate) => semanticClass(candidate.meaningPa) === ownClass);
  const opposites = opposite
    ? candidates.filter((candidate) => semanticClass(candidate.meaningPa) === opposite)
    : [];
  const rest = candidates.filter(
    (candidate) => !close.includes(candidate) && !opposites.includes(candidate)
  );
  return Array.from(
    new Set([...close, ...opposites, ...rest].map((candidate) => candidate.affix))
  );
}

export function generateCP008V4F08(
  seed: number,
  difficulty: PunjabiDifficulty
): PunjabiGeneratedQuestion {
  const rng = createRng(seed + 801);
  const type: AffixKind = rng.next() > 0.5 ? "PREFIX" : "SUFFIX";
  const item = pickAffixItem(seed + 809, type);
  const label = typeLabel(type);
  const templates = [
    () => `‘${item.meaningPa}’ — ਇਸ ਅਰਥ ਨਾਲ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ${label} ਕਿਹੜਾ ਹੈ?`,
    () => `ਦਿੱਤੇ ਅਰਥ ਲਈ ਸਹੀ ${label} ਚੁਣੋ: ${item.meaningPa}।`,
    () => `ਕਿਹੜਾ ${label} ਇਸ ਅਰਥ ਨੂੰ ਪ੍ਰਗਟ ਕਰਦਾ ਹੈ: ${item.meaningPa}?`,
  ];
  return assembleQuestion({
    familyId: "F08",
    seed,
    difficulty,
    stem: rng.pickOne(templates)(),
    correctAnswer: item.affix,
    distractors: semanticOptionPool(item),
    explanation: `‘${item.affix}’ ${label} ${item.meaningPa}।`,
    authorityIds: [item.id],
  });
}

export const CP008_V4_FAMILY_GENERATORS = {
  F01: generateCP008V4F01,
  F02: generateCP008V4F02,
  F03: generateCP008V4F03,
  F04: generateCP008V4F04,
  F05: generateCP008V4F05,
  F06: generateCP008V4F06,
  F07: generateCP008V4F07,
  F08: generateCP008V4F08,
} as const;

export type CP008V4FamilyId = keyof typeof CP008_V4_FAMILY_GENERATORS;
