import { createHash } from "node:crypto";

import { localizedSea001Name } from "../../SEA-001/localization/name-pack.ts";
import { generateSea002Cp006ExamRealCaselet } from "./exam-real.ts";
import { localizeCp006FrozenCaselet } from "./localization/frozen-localizer.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  SEA002_CP006_LOCALIZATION_FREEZE,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
} from "./permanent/freeze.ts";
import {
  SEA002_CP006_PERMANENT_QL_IDS,
  SEA002_CP006_PERMANENT_QL_REGISTRY,
  type Sea002Cp006PermanentQlId,
} from "./permanent/registry.ts";
import { cp006ReviewContentFingerprint } from "./cp006-review-corpus.ts";
import type { Sea002Cp006Caselet, Sea002Cp006ChildQuestion } from "./types.ts";

export const SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID = "SEA-002" as const;
export const SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID = "SEA-CP-006" as const;
export const SEA002_CP006_QUESTION_STUDIO_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export const SEA002_CP006_QUESTION_STUDIO_QL_IDS = SEA002_CP006_PERMANENT_QL_IDS;
export const SEA002_CP006_QUESTION_STUDIO_RELEASE_ID = "SEA-002-CP006-QS-MULTILINGUAL-FROZEN-V1" as const;

export type Sea002Cp006QuestionStudioLanguage = (typeof SEA002_CP006_QUESTION_STUDIO_LANGUAGES)[number];
export type Sea002Cp006QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export type Sea002Cp006QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  difficulty?: unknown;
  language?: string;
  seed?: string;
  count?: number;
}>;

function normalizeSelector(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeLanguage(value: unknown): Sea002Cp006QuestionStudioLanguage {
  const language = String(value ?? "en").trim().toLowerCase();
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SEA-CP-006 does not support Question Studio language ${language}.`);
}

function normalizeDifficulty(value: unknown): Sea002Cp006QuestionStudioDifficulty {
  const difficulty = String(value ?? "Medium").trim().toLowerCase();
  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium" || difficulty === "moderate") return "Medium";
  if (difficulty === "hard") return "Hard";
  throw new Error(`SEA-CP-006 does not support Question Studio difficulty ${String(value)}.`);
}

function isCp006Ql(value: unknown): value is Sea002Cp006PermanentQlId {
  return SEA002_CP006_QUESTION_STUDIO_QL_IDS.includes(String(value ?? "") as Sea002Cp006PermanentQlId);
}

export function isSea002Cp006QuestionStudioRequest(request: Sea002Cp006QuestionStudioRequest): boolean {
  const packageId = normalizeSelector(request.packageId ?? request.archetypeId);
  const patternId = normalizeSelector(request.patternId);
  const topic = normalizeSelector(request.topic);
  const subtopic = normalizeSelector(request.subtopic);
  const checkpointId = String(request.canonicalProblemId ?? request.cpId ?? "");
  return packageId === "sea 002"
    || patternId.includes("sea cp 006")
    || patternId.includes("sea 002")
    || checkpointId === SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID
    || isCp006Ql(request.questionLanguageId)
    || topic === "seating arrangement"
    || subtopic === "seating arrangement"
    || subtopic === "two parallel rows"
    || subtopic === "two parallel rows facing each other"
    || (topic === "reasoning" && subtopic.includes("seating"));
}

function qlEntry(qlId: Sea002Cp006PermanentQlId) {
  const entry = SEA002_CP006_PERMANENT_QL_REGISTRY.find((candidate) => candidate.permanentQlId === qlId);
  if (!entry) throw new Error(`${qlId} is not registered for SEA-CP-006.`);
  return entry;
}

function stableRank(value: string): number {
  return createHash("sha256").update(value).digest().readUInt32BE(0);
}

function rotatedQlOrder(seed: string): readonly Sea002Cp006PermanentQlId[] {
  const offset = stableRank(`${seed}:ql-offset`) % SEA002_CP006_QUESTION_STUDIO_QL_IDS.length;
  return Object.freeze(Array.from({ length: SEA002_CP006_QUESTION_STUDIO_QL_IDS.length }, (_, index) =>
    SEA002_CP006_QUESTION_STUDIO_QL_IDS[(offset + index) % SEA002_CP006_QUESTION_STUDIO_QL_IDS.length]!,
  ));
}

function widthForDifficulty(difficulty: Sea002Cp006QuestionStudioDifficulty): 4 | 5 | 6 {
  if (difficulty === "Easy") return 4;
  if (difficulty === "Medium") return 5;
  return 6;
}

function localeForLanguage(language: Sea002Cp006QuestionStudioLanguage): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function positionWording(text: string): string {
  return text
    .replaceAll("Seats in the same vertical column are exactly opposite each other.", "Seats at the same position across the two rows are exactly opposite each other.")
    .replaceAll("same vertical column", "same position across the two rows")
    .replaceAll("vertical columns", "positions")
    .replaceAll("vertical column", "position")
    .replaceAll("observer columns", "positions")
    .replaceAll("observer column", "position")
    .replaceAll("Columns", "Positions")
    .replaceAll("columns", "positions")
    .replaceAll("Column", "Position")
    .replaceAll("column", "position");
}

function englishDisplayCaselet(caselet: Sea002Cp006Caselet) {
  return Object.freeze({
    locale: "en-IN" as const,
    canonicalCaseletId: caselet.caseletId,
    permanentQlId: qlEntry(SEA002_CP006_PERMANENT_QL_REGISTRY.find((entry) => entry.blueprintAuthorityId === caselet.blueprintAuthorityId)!.permanentQlId).permanentQlId,
    canonicalContentFingerprint: cp006ReviewContentFingerprint(caselet),
    presentationFingerprint: cp006ReviewContentFingerprint(caselet),
    setupText: positionWording(caselet.setupText),
    clueTexts: Object.freeze(caselet.clueTexts.map(positionWording)),
    sharedExplanation: positionWording(caselet.sharedExplanation),
    children: Object.freeze(caselet.children.map((child) => Object.freeze({
      questionOrder: child.questionOrder,
      queryContractId: child.queryContractId,
      answerType: child.answerType,
      answerDeterminingFactFingerprint: child.answerDeterminingFactFingerprint,
      answerIndex: child.answerIndex,
      canonicalAnswer: child.answer,
      displayAnswer: child.answer,
      text: positionWording(child.text),
      explanation: positionWording(child.explanation),
      options: Object.freeze(child.options.map((option) => Object.freeze({
        displayValue: option.value,
        isCorrect: option.isCorrect,
        misconceptionId: option.misconceptionId,
        explanation: positionWording(option.explanation),
      }))),
    }))),
  });
}

function displayCaselet(caselet: Sea002Cp006Caselet, language: Sea002Cp006QuestionStudioLanguage) {
  if (language === "en") return englishDisplayCaselet(caselet);
  return localizeCp006FrozenCaselet(caselet, language === "hi" ? "hi-IN" : "pa-IN");
}

function localizedPerson(person: string, language: Sea002Cp006QuestionStudioLanguage): string {
  return language === "en" ? person : localizedSea001Name(person, language === "hi" ? "hi-IN" : "pa-IN");
}

function xml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function solutionDiagramText(caselet: Sea002Cp006Caselet, language: Sea002Cp006QuestionStudioLanguage): string {
  const top = caselet.state.top.map((person) => localizedPerson(person, language)).join("   ");
  const bottom = caselet.state.bottom.map((person) => localizedPerson(person, language)).join("   ");
  if (language === "hi") return `ऊपरी पंक्ति (मुख दक्षिण ↓): ${top}\nनिचली पंक्ति (मुख उत्तर ↑): ${bottom}`;
  if (language === "pa") return `ਉੱਪਰਲੀ ਕਤਾਰ (ਮੂੰਹ ਦੱਖਣ ↓): ${top}\nਹੇਠਲੀ ਕਤਾਰ (ਮੂੰਹ ਉੱਤਰ ↑): ${bottom}`;
  return `Upper row (faces south ↓): ${top}\nLower row (faces north ↑): ${bottom}`;
}

function solutionDiagramSvg(caselet: Sea002Cp006Caselet, language: Sea002Cp006QuestionStudioLanguage): string {
  const n = caselet.state.seatCountPerRow;
  const gap = n <= 4 ? 180 : Math.max(128, Math.floor(720 / (n - 1)));
  const startX = 88;
  const width = startX * 2 + (n - 1) * gap;
  const labels = {
    en: { title: "Solved arrangement", top: "Upper row · faces south", bottom: "Lower row · faces north" },
    hi: { title: "हल की गई व्यवस्था", top: "ऊपरी पंक्ति · मुख दक्षिण", bottom: "निचली पंक्ति · मुख उत्तर" },
    pa: { title: "ਹੱਲ ਕੀਤੀ ਬੈਠਕ", top: "ਉੱਪਰਲੀ ਕਤਾਰ · ਮੂੰਹ ਦੱਖਣ", bottom: "ਹੇਠਲੀ ਕਤਾਰ · ਮੂੰਹ ਉੱਤਰ" },
  }[language];
  const seats = (y: number, people: readonly string[], arrow: string) => people.map((canonical, index) => {
    const x = startX + index * gap;
    const person = xml(localizedPerson(canonical, language));
    return `<g><rect x="${x - 54}" y="${y - 28}" width="108" height="56" rx="9" fill="white" stroke="black"/><text x="${x}" y="${y - 2}" text-anchor="middle" font-size="15">${person}</text><text x="${x}" y="${y + 18}" text-anchor="middle" font-size="15">${arrow}</text></g>`;
  }).join("");
  const links = Array.from({ length: n }, (_, index) => {
    const x = startX + index * gap;
    return `<line x1="${x}" y1="126" x2="${x}" y2="194" stroke="#555" stroke-dasharray="5 5"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 320" role="img" aria-label="${xml(labels.title)}"><rect width="100%" height="100%" fill="white"/><text x="24" y="30" font-size="18" font-weight="700">${xml(labels.title)}</text><text x="24" y="62" font-size="13">${xml(labels.top)} ↓</text><text x="24" y="292" font-size="13">${xml(labels.bottom)} ↑</text>${seats(105, caselet.state.top, "↓")}${links}${seats(215, caselet.state.bottom, "↑")}</svg>`;
}

function assertSourceLocks(): void {
  if (!SEA002_CP006_ENGLISH_FREEZE.freezeActive || !SEA002_CP006_LOCALIZATION_FREEZE.freezeActive) {
    throw new Error("SEA-CP-006 Question Studio requires both frozen English and frozen Hindi/Punjabi authorities.");
  }
  if (!SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen) {
    throw new Error("SEA-CP-006 localization freeze is not active.");
  }
  if (SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-CP-006 source lifecycle drifted beyond the approved adapter-only activation boundary.");
  }
}

function normalizedQuestion(
  caselet: Sea002Cp006Caselet,
  display: ReturnType<typeof displayCaselet>,
  childIndex: number,
  qlId: Sea002Cp006PermanentQlId,
  language: Sea002Cp006QuestionStudioLanguage,
  difficulty: Sea002Cp006QuestionStudioDifficulty,
  requestSeed: string,
) {
  const sourceChild = caselet.children[childIndex]!;
  const displayChild = display.children[childIndex]!;
  const entry = qlEntry(qlId);
  const options = displayChild.options.map((option) => option.displayValue);
  const correctIndex = sourceChild.answerIndex;
  if (options.length !== 4 || displayChild.answerIndex !== correctIndex || !displayChild.options[correctIndex]?.isCorrect) {
    throw new Error(`${caselet.caseletId}: localized option identity drift.`);
  }
  const identity = createHash("sha256")
    .update(JSON.stringify({ caseletId: caselet.caseletId, qlId, childIndex, language, requestSeed }))
    .digest("hex")
    .slice(0, 20);
  const fullStem = [
    display.setupText,
    "",
    ...display.clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
    "",
    displayChild.text,
  ].join("\n");
  const explanation = [display.sharedExplanation, displayChild.explanation].filter(Boolean).join("\n\n");
  const solutionText = solutionDiagramText(caselet, language);
  const solutionSvg = solutionDiagramSvg(caselet, language);

  return Object.freeze({
    text: fullStem,
    stem: fullStem,
    setupText: display.setupText,
    clueTexts: display.clueTexts,
    childStem: displayChild.text,
    options: Object.freeze(options),
    correct: correctIndex,
    correctIndex,
    answer: displayChild.displayAnswer,
    canonicalAnswer: Object.freeze({
      kind: "symbolic" as const,
      value: sourceChild.answer,
      display: displayChild.displayAnswer,
      rendered: displayChild.displayAnswer,
      rounding: "exact" as const,
    }),
    explanation,
    packageExplanation: Object.freeze({
      shared: display.sharedExplanation,
      child: displayChild.explanation,
      optionRationales: Object.freeze(displayChild.options.map((option) => option.explanation)),
    }),
    solutionDiagram: Object.freeze({
      kind: "PARALLEL_ROWS_SVG" as const,
      solutionOnly: true as const,
      text: solutionText,
      svg: solutionSvg,
      background: "white" as const,
    }),
    difficulty,
    difficultyLabel: difficulty,
    patternId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
    section: "Reasoning",
    topic: "Seating Arrangement",
    subtopic: "Two Parallel Rows Facing Each Other",
    generationBackend: "reasoning-v1",
    debugSource: "reasoning-v1-sea-002-cp006-frozen-multilingual-runtime",
    packageSource: "reasoning-v1-sea-002-cp006-frozen-multilingual-runtime",
    packageId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: qlId,
    qlId,
    explanationId: `${qlId}-EXP-${language.toUpperCase()}`,
    questionId: `SEA-CP006-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
    caseletId: caselet.caseletId,
    queryContractId: sourceChild.queryContractId,
    answerType: sourceChild.answerType,
    language,
    locale: localeForLanguage(language),
    runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY" as const,
    questionStudioDiscoverable: true as const,
    sourceQuestionStudioRegistered: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    authorityId: entry.blueprintAuthorityId,
    authorityLabel: entry.solveContract,
    taskKind: sourceChild.queryContractId,
    optionMetadata: Object.freeze(sourceChild.options.map((option, index) => Object.freeze({
      canonicalValue: option.value,
      displayValue: options[index],
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId ?? null,
      rationale: displayChild.options[index]!.explanation,
    }))),
    validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
    semanticMetadata: Object.freeze({
      packageId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
      permanentQlId: qlId,
      blueprintAuthorityId: entry.blueprintAuthorityId,
      queryContractId: sourceChild.queryContractId,
      answerDeterminingFactFingerprint: sourceChild.answerDeterminingFactFingerprint,
      structuralFingerprint: caselet.structuralFingerprint,
      canonicalContentFingerprint: cp006ReviewContentFingerprint(caselet),
      presentationFingerprint: display.presentationFingerprint,
    }),
    traceability: Object.freeze({
      releaseId: SEA002_CP006_QUESTION_STUDIO_RELEASE_ID,
      englishFreezeFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
      localizedFreezeFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
      approvedLocalizationArtifactId: SEA002_CP006_LOCALIZATION_FREEZE.approvedArtifactId,
      sourceLifecycle: SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
      sourceQuestionStudioRegistered: false as const,
      adapterQuestionStudioDiscoverable: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
    proceduralLogic: Object.freeze({ state: caselet.state, clues: caselet.clues }),
    logic: Object.freeze({ state: caselet.state, clues: caselet.clues }),
    requestSeed,
  });
}

export function listSea002Cp006QuestionStudioPackages() {
  assertSourceLocks();
  return [Object.freeze({
    id: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
    packageId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
    type: "reasoning-v1",
    section: "Reasoning",
    domain: "reasoning",
    subject: "Reasoning Ability",
    topic: "Seating Arrangement",
    subtopic: "Two Parallel Rows Facing Each Other",
    name: "SEA-002 Seating Arrangement — Two Parallel Rows Facing Each Other",
    label: "Seating Arrangement — Two Parallel Rows Facing Each Other",
    generationDomain: "reasoning-v1",
    cpIds: Object.freeze([SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID]),
    canonicalProblems: Object.freeze([Object.freeze({
      id: SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
      label: "Two parallel rows facing each other",
    })]),
    permanentQlCount: SEA002_CP006_QUESTION_STUDIO_QL_IDS.length,
    permanentQlIds: SEA002_CP006_QUESTION_STUDIO_QL_IDS,
    supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
    supportedLanguages: SEA002_CP006_QUESTION_STUDIO_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    supportedRuntimeModes: Object.freeze(["QUESTION_STUDIO_ACTIVE"] as const),
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    reviewOnly: true,
    sourceQuestionStudioRegistered: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    releaseId: SEA002_CP006_QUESTION_STUDIO_RELEASE_ID,
    englishFreezeFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
    localizedFreezeFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
  })];
}

export async function generateSea002Cp006QuestionStudioBatch(request: Sea002Cp006QuestionStudioRequest = {}) {
  assertSourceLocks();
  const language = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const width = widthForDifficulty(difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const explicitCp = String(request.canonicalProblemId ?? request.cpId ?? "") || undefined;
  if (explicitCp && explicitCp !== SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID) {
    throw new Error(`SEA-CP-006 integration cannot serve canonical problem ${explicitCp}.`);
  }
  const explicitQl = String(request.questionLanguageId ?? "") || undefined;
  if (explicitQl && !isCp006Ql(explicitQl)) throw new Error(`${explicitQl} is not owned by SEA-CP-006.`);

  const batchSeed = request.seed?.trim()
    || `question-studio:SEA-002:SEA-CP-006:${language}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const qlOrder = explicitQl ? [explicitQl as Sea002Cp006PermanentQlId] : rotatedQlOrder(batchSeed);
  const caseletRounds = explicitQl
    ? Math.ceil(count / 4)
    : Math.ceil(count / (4 * qlOrder.length));

  const generatedCaselets: Array<Readonly<{
    qlId: Sea002Cp006PermanentQlId;
    source: Sea002Cp006Caselet;
    display: ReturnType<typeof displayCaselet>;
    requestSeed: string;
  }>> = [];

  for (let round = 0; round < caseletRounds; round += 1) {
    for (const qlId of qlOrder) {
      const entry = qlEntry(qlId);
      const caseletSeed = `${batchSeed}:${qlId}:round-${round}:${difficulty}`;
      const source = generateSea002Cp006ExamRealCaselet(entry.blueprintAuthorityId, caseletSeed, width);
      const display = displayCaselet(source, language);
      generatedCaselets.push(Object.freeze({ qlId, source, display, requestSeed: caseletSeed }));
    }
  }

  const questionPackages: ReturnType<typeof normalizedQuestion>[] = [];
  for (let childIndex = 0; childIndex < 4 && questionPackages.length < count; childIndex += 1) {
    for (const generated of generatedCaselets) {
      if (questionPackages.length >= count) break;
      questionPackages.push(normalizedQuestion(
        generated.source,
        generated.display,
        childIndex,
        generated.qlId,
        language,
        difficulty,
        generated.requestSeed,
      ));
    }
  }

  if (questionPackages.length !== count) {
    throw new Error(`SEA-CP-006 generated ${questionPackages.length} questions for requested count ${count}.`);
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1",
      packageId: SEA002_CP006_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "REAS-SEA",
      checkpointId: SEA002_CP006_QUESTION_STUDIO_CHECKPOINT_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      lifecycleStatus: "REVIEW_ONLY",
      releaseId: SEA002_CP006_QUESTION_STUDIO_RELEASE_ID,
      language,
      locale: localeForLanguage(language),
      difficulty,
      seatCountPerRow: width,
      permanentQlCount: SEA002_CP006_QUESTION_STUDIO_QL_IDS.length,
      permanentQlIds: SEA002_CP006_QUESTION_STUDIO_QL_IDS,
      frozenQueryContracts: SEA002_CP006_FROZEN_QUERY_CONTRACTS,
      englishFreezeFingerprint: SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint,
      localizedFreezeFingerprint: SEA002_CP006_LOCALIZATION_FREEZE.approvedLocalizedReviewFingerprint,
      sourceQuestionStudioRegistered: false,
      adapterQuestionStudioDiscoverable: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    }),
    questionPackages: Object.freeze(questionPackages),
    questions: Object.freeze(questionPackages),
  });
}
