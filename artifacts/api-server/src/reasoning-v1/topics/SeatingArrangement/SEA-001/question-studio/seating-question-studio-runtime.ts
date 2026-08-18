import { canonicalDigest } from "../canonical.ts";
import { sea001EnglishExplanationAuthority, buildSea001ExplanationParityCandidate } from "../localization/explanation-parity-candidate.ts";
import { localizeSea001Names } from "../localization/name-pack.ts";
import { SEA001_MULTILINGUAL_FREEZE_AUTHORITY } from "../localization/multilingual-freeze.ts";
import type { Sea001TranslatedLocale } from "../localization/readiness.ts";
import { sea001CanonicalParityFingerprint } from "../localization/readiness.ts";
import { SEA001_ENGLISH_FREEZE, SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT } from "../permanent/freeze.ts";
import {
  SEA001_BLUEPRINT_TO_PERMANENT_QL,
  SEA001_PERMANENT_QL_IDS,
  SEA001_PERMANENT_QL_REGISTRY,
  type Sea001PermanentQlId,
} from "../permanent/registry.ts";
import {
  sea001BlueprintDescriptors,
  type AuditCaselet,
  type Sea001CheckpointId,
} from "../saturation/corpus.ts";

export const SEA001_QUESTION_STUDIO_PACKAGE_ID = "REASONING_V1_SEA_001" as const;
export const SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY = "SEA001_QUESTION_STUDIO_DYNAMIC_REVIEW_V1" as const;
export const SEA001_QUESTION_STUDIO_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const SEA001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export type Sea001QuestionStudioLanguage = (typeof SEA001_QUESTION_STUDIO_LANGUAGES)[number];

export type Sea001QuestionStudioRequest = Readonly<{
  language?: Sea001QuestionStudioLanguage;
  qlId?: Sea001PermanentQlId;
  checkpointId?: Sea001CheckpointId;
  count?: number;
  seed?: string;
}>;

const CHECKPOINT_DIFFICULTY = Object.freeze({
  "SEA-CP-001": "Easy",
  "SEA-CP-002": "Medium",
  "SEA-CP-003": "Medium",
  "SEA-CP-004": "Medium",
  "SEA-CP-005": "Hard",
} as const);

export const SEA001_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: SEA001_QUESTION_STUDIO_PACKAGE_ID,
  packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  topic: "Seating Arrangement" as const,
  subtopic: "Linear and Circular Seating Foundations" as const,
  chapterId: "REAS-SEA" as const,
  packageCode: "SEA-001" as const,
  name: "SEA-001 Seating Arrangement — Dynamic Multilingual Review" as const,
  label: "Seating Arrangement — 20 Permanent QLs" as const,
  generationDomain: "reasoning-v1" as const,
  qlIds: [...SEA001_PERMANENT_QL_IDS],
  qls: SEA001_PERMANENT_QL_REGISTRY.map((entry) => ({
    permanentQlId: entry.permanentQlId,
    checkpointId: entry.checkpointId,
    blueprintAuthorityId: entry.blueprintAuthorityId,
    name: entry.solveContract,
    difficulty: CHECKPOINT_DIFFICULTY[entry.checkpointId],
  })),
  checkpoints: ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const,
  supportedLanguages: [...SEA001_QUESTION_STUDIO_LANGUAGES],
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  enabled: true,
  active: true,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  registrationStatus: "REGISTERED" as const,
  runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
  integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  sourceEnglishAuthority: SEA001_ENGLISH_FREEZE.approvedReviewFingerprint,
  sourceLocalizationAuthority: SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
  generationRunPersistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: "NOT_STORED" as const,
  questionBankEligible: false,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false,
  mockTestEligible: false,
  productionStagingApproved: false,
  publiclyPublishable: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  permanentQlCount: SEA001_PERMANENT_QL_IDS.length,
}) as const;

type StudioCaselet = AuditCaselet & Partial<{
  humanLanguageReviewRequired: boolean;
  productDeliveryUnlocked: boolean;
  productionStagingApproved: boolean;
}>;

const DESCRIPTORS = sea001BlueprintDescriptors();
const DESCRIPTOR_BY_PBA = new Map(DESCRIPTORS.map((descriptor) => [descriptor.blueprintId, descriptor]));
const PBA_BY_QL = new Map(
  Object.entries(SEA001_BLUEPRINT_TO_PERMANENT_QL).map(([pba, ql]) => [ql as Sea001PermanentQlId, pba]),
);

function localeFor(language: Sea001QuestionStudioLanguage): "en-IN" | Sea001TranslatedLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function translatedDiagramText(text: string, language: Sea001QuestionStudioLanguage): string {
  if (language === "en") return text;
  const locale = localeFor(language) as Sea001TranslatedLocale;
  return localizeSea001Names(text, locale)
    .replaceAll("ENTRANCE", language === "hi" ? "प्रवेश-द्वार" : "ਪ੍ਰਵੇਸ਼-ਦੁਆਰ")
    .replaceAll("STAGE", language === "hi" ? "मंच" : "ਮੰਚ")
    .replaceAll("DOOR", language === "hi" ? "दरवाज़ा" : "ਦਰਵਾਜ਼ਾ");
}

function localizeCaselet(source: AuditCaselet, language: Sea001QuestionStudioLanguage): StudioCaselet {
  if (language === "en") return sea001EnglishExplanationAuthority(source);
  const locale = localeFor(language) as Sea001TranslatedLocale;
  const localized = buildSea001ExplanationParityCandidate(source, locale);
  if (sea001CanonicalParityFingerprint(localized) !== sea001CanonicalParityFingerprint(source)) {
    throw new Error(`${source.caseletId}/${locale}: dynamic localization changed canonical semantics.`);
  }
  if (!localized.humanLanguageReviewRequired) {
    throw new Error(`${source.caseletId}/${locale}: dynamic candidate must enter Question Studio review.`);
  }
  if (localized.productDeliveryUnlocked || localized.productionStagingApproved) {
    throw new Error(`${source.caseletId}/${locale}: dynamic candidate bypassed delivery locks.`);
  }
  const learnerSurface = [
    localized.setupText,
    ...localized.clueTexts,
    localized.sharedExplanation,
    ...localized.children.flatMap((child) => [
      child.text,
      child.explanation,
      ...child.options.flatMap((option) => [option.display, option.explanation]),
    ]),
  ].join("\n");
  if (/[A-Za-z]/u.test(learnerSurface)) {
    throw new Error(`${source.caseletId}/${locale}: dynamic localized learner surface contains Latin residue.`);
  }
  return localized;
}

function caseletForQl(
  qlId: Sea001PermanentQlId,
  language: Sea001QuestionStudioLanguage,
  batchSeed: string,
  caseletOrdinal: number,
): StudioCaselet {
  const pba = PBA_BY_QL.get(qlId);
  if (!pba) throw new Error(`No SEA-001 blueprint mapping exists for ${qlId}.`);
  const descriptor = DESCRIPTOR_BY_PBA.get(pba);
  if (!descriptor) throw new Error(`No SEA-001 generator exists for ${pba}.`);

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const seed = `sea001-studio:${batchSeed}:${qlId}:${caseletOrdinal}:${attempt}`;
    try {
      return localizeCaselet(descriptor.generate(seed), language);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `${qlId}: unable to generate a valid ${language} Question Studio caselet after 24 attempts. ${lastError instanceof Error ? lastError.message : ""}`,
  );
}

function eligibleQls(request: Sea001QuestionStudioRequest): readonly Sea001PermanentQlId[] {
  if (request.qlId) {
    const entry = SEA001_PERMANENT_QL_REGISTRY.find((item) => item.permanentQlId === request.qlId);
    if (!entry) throw new Error(`Unknown SEA-001 QL '${request.qlId}'.`);
    if (request.checkpointId && entry.checkpointId !== request.checkpointId) {
      throw new Error(`${request.qlId} belongs to ${entry.checkpointId}, not ${request.checkpointId}.`);
    }
    return [request.qlId];
  }
  const qls = SEA001_PERMANENT_QL_REGISTRY
    .filter((entry) => !request.checkpointId || entry.checkpointId === request.checkpointId)
    .map((entry) => entry.permanentQlId);
  if (!qls.length) throw new Error("No SEA-001 QLs match the requested checkpoint.");
  return qls;
}

function answerText(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(", ");
  return String(value ?? "");
}

function diagramProjection(caselet: StudioCaselet, language: Sea001QuestionStudioLanguage) {
  const diagram = (caselet as unknown as { diagram?: { svg?: string; text?: string } }).diagram;
  const svg = diagram?.svg ? translatedDiagramText(diagram.svg, language) : undefined;
  const text = diagram?.text ?? caselet.diagramText;
  return {
    kind: svg ? "SEATING_SVG" as const : "SEATING_TEXT" as const,
    svg,
    text: text ? translatedDiagramText(text, language) : undefined,
    topology: caselet.topologySnapshot ?? null,
    textFallbackAvailable: Boolean(text),
  };
}

function toStudioQuestion(
  caselet: StudioCaselet,
  childIndex: number,
  qlId: Sea001PermanentQlId,
  language: Sea001QuestionStudioLanguage,
) {
  const child = caselet.children[childIndex];
  if (!child) throw new Error(`${caselet.caseletId}: missing child ${childIndex + 1}.`);
  const frozenContracts = SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT[caselet.checkpointId] as readonly string[];
  const correctCount = child.options.filter((option) => option.isCorrect).length;
  const valid = caselet.solverOracleAgreement.passed
    && child.options.length === 4
    && correctCount === 1
    && child.options[child.answerIndex]?.isCorrect === true
    && frozenContracts.includes(child.queryContractId);
  if (!valid) throw new Error(`${caselet.caseletId}/Q${child.questionOrder}: failed Question Studio validation.`);

  const sharedPrompt = [
    caselet.setupText,
    ...caselet.clueTexts.map((clue, index) => `${index + 1}. ${clue}`),
  ].join("\n");
  const canonicalItemId = `${caselet.caseletId}:Q${child.questionOrder}`;
  const questionLanguageId = `${canonicalItemId}:${language}`;
  const renderer = diagramProjection(caselet, language);
  const contentFingerprint = canonicalDigest({
    qlId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    canonicalParity: sea001CanonicalParityFingerprint(caselet),
    questionOrder: child.questionOrder,
    language,
    stem: child.text,
    options: child.options.map((option) => option.display),
  });

  return {
    archetypeId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
    packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: caselet.checkpointId,
    qlId,
    checkpointId: caselet.checkpointId,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    caseletId: caselet.caseletId,
    questionOrder: child.questionOrder,
    questionId: `${questionLanguageId}:question-studio`,
    canonicalItemId,
    questionLanguageId,
    language,
    locale: localeFor(language),
    difficultyBand: CHECKPOINT_DIFFICULTY[caselet.checkpointId],
    useMode: "CASELET_CHILD",
    sharedPrompt,
    stem: child.text,
    options: child.options.map((option) => option.display),
    optionDetails: child.options.map((option, index) => ({
      label: ["A", "B", "C", "D"][index]!,
      text: option.display,
      studentExplanation: option.explanation,
      isCorrect: option.isCorrect,
      semanticKey: option.semanticFingerprint,
    })),
    correctIndex: child.answerIndex,
    answer: child.options[child.answerIndex]?.display ?? answerText(child.answer),
    decodedStatements: [...caselet.clueTexts],
    explanation: {
      steps: caselet.sharedExplanation.split(/\n+/u).map((line) => line.trim()).filter(Boolean),
      conclusion: child.explanation,
      shortcut: "",
      commonTrap: "",
      familyTree: null,
      diagramProof: renderer,
    },
    reasoningGraph: {
      constraints: caselet.constraints ?? [],
      proofTrace: caselet.proofTrace ?? [],
      solverKeys: caselet.solverOracleAgreement.productionKeys,
    },
    renderer,
    contentFingerprint,
    parameters: {
      chapterId: "REAS-SEA",
      packageCode: "SEA-001",
      checkpointId: caselet.checkpointId,
      blueprintAuthorityId: caselet.blueprintAuthorityId,
      qlId,
      seed: caselet.seed,
      runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC",
      sourceEnglishFreeze: SEA001_ENGLISH_FREEZE.approvedReviewFingerprint,
      sourceLocalizationFreeze: SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      persistenceAllowed: true,
    },
    traceability: {
      caseletId: caselet.caseletId,
      qlId,
      checkpointId: caselet.checkpointId,
      blueprintAuthorityId: caselet.blueprintAuthorityId,
      clueSetFingerprint: caselet.clueSetFingerprint ?? null,
      canonicalParityFingerprint: sea001CanonicalParityFingerprint(caselet),
      answerDeterminingFactFingerprint: child.answerDeterminingFactFingerprint,
      contentFingerprint,
      integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    },
    safety: {
      reviewOnly: true,
      questionStudioVisible: true,
      persistenceAllowed: true,
      questionBankEligible: false,
      mockTestEligible: false,
      productionStagingApproved: false,
      publiclyPublishable: false,
    },
    validation: {
      valid: true as const,
      solverOracleAgreement: true as const,
      fourOptions: true as const,
      singleCorrectAnswer: true as const,
      frozenQueryContract: true as const,
      canonicalParityPreserved: true as const,
    },
  } as const;
}

export function generateSea001QuestionStudioBatch(request: Sea001QuestionStudioRequest = {}) {
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 4) || 4)));
  const language = request.language ?? "en";
  if (!SEA001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported SEA-001 language '${language}'.`);
  }
  const qls = eligibleQls(request);
  const batchSeed = request.seed?.trim() || [
    SEA001_QUESTION_STUDIO_PACKAGE_ID,
    language,
    request.checkpointId ?? "all-checkpoints",
    request.qlId ?? "all-qls",
  ].join(":");

  const questions: ReturnType<typeof toStudioQuestion>[] = [];
  let caseletOrdinal = 0;
  while (questions.length < count) {
    const qlId = qls[caseletOrdinal % qls.length]!;
    const caselet = caseletForQl(qlId, language, batchSeed, caseletOrdinal);
    for (let childIndex = 0; childIndex < caselet.children.length && questions.length < count; childIndex += 1) {
      questions.push(toStudioQuestion(caselet, childIndex, qlId, language));
    }
    caseletOrdinal += 1;
  }

  return {
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: SEA001_QUESTION_STUDIO_PACKAGE_ID,
      packageCode: "SEA-001" as const,
      seed: batchSeed,
      runtimeMode: SEA001_QUESTION_STUDIO_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC" as const,
      integrationAuthority: SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
      sourceEnglishFreeze: SEA001_ENGLISH_FREEZE.approvedReviewFingerprint,
      sourceLocalizationFreeze: SEA001_MULTILINGUAL_FREEZE_AUTHORITY,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED" as const,
      persistenceAllowed: true as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      productionStagingApproved: false as const,
      publiclyPublishable: false as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
    questions,
  } as const;
}
