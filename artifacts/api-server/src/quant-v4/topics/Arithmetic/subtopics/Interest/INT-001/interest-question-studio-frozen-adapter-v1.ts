import { createHash } from "node:crypto";

export type InterestQuestionStudioLanguage = "en" | "hi" | "pa";

export type InterestQuestionStudioRequest = Readonly<{
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  qlId?: string;
  language?: string;
  seed?: string;
  count?: number;
}>;

export type InterestFrozenSourceGenerator = (
  qlId: string,
  seed: string,
  language: InterestQuestionStudioLanguage,
) => unknown;

export type InterestFrozenAdapterConfig = Readonly<{
  integrationVersion: string;
  cpId: string;
  cpNumber: string;
  name: string;
  qlIds: readonly string[];
  languages: readonly InterestQuestionStudioLanguage[];
  generateSource: InterestFrozenSourceGenerator;
}>;

function toJsonSafe(value: unknown): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return Object.freeze(value.map(toJsonSafe));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Reflect.ownKeys(value as object)
        .filter((key): key is string => typeof key === "string")
        .map((key) => [key, toJsonSafe((value as Record<string, unknown>)[key])]),
    ));
  }
  return value;
}

function stableIndex(text: string, length: number): number {
  return createHash("sha256").update(text).digest().readUInt32BE(0) % length;
}

function optionText(option: any): string {
  if (typeof option === "string") return option;
  return String(option?.text ?? option?.display ?? option?.value ?? "");
}

function explanationLines(source: any): readonly string[] {
  const explanation = source?.explanation ?? {};
  const lines = [
    explanation.keyIdea ?? explanation.mainRule,
    ...(explanation.steps ?? explanation.workedSteps ?? []),
    explanation.examShortcut,
    explanation.verification,
    explanation.conclusion,
    explanation.finalAnswer,
  ].filter(Boolean).map(String);
  return Object.freeze(lines);
}

function assertFrozenBoundary(source: any, qlId: string): void {
  if (!source || typeof source !== "object") throw new Error(`${qlId}: frozen source is missing.`);
  if (source.validation?.ok === false) {
    throw new Error(`${qlId}: frozen source validation failed: ${(source.validation.errors ?? []).join("; ")}`);
  }
  if (source.permanentIdentityFrozen !== true || source.learnerContentFrozen !== true) {
    throw new Error(`${qlId}: source is not a frozen learner authority.`);
  }
  if (source.enabled === true || source.questionStudioDiscoverable === true) {
    throw new Error(`${qlId}: source delivery boundary is already open.`);
  }
  if (source.questionBankStatus !== undefined && source.questionBankStatus !== "NOT_STORED") {
    throw new Error(`${qlId}: source Question Bank boundary drifted.`);
  }
  if (source.questionBankWritable === true || source.testEligible === true || source.mockTestEligible === true || source.publiclyPublishable === true) {
    throw new Error(`${qlId}: downstream source delivery boundary drifted.`);
  }
  if (source.testEligibility !== undefined && source.testEligibility !== "INELIGIBLE") {
    throw new Error(`${qlId}: source test boundary drifted.`);
  }
  const lifecycle = source.lifecycle ?? {};
  if (
    lifecycle.questionStudioDiscoverable === true
    || lifecycle.questionBankWritable === true
    || lifecycle.testEligible === true
    || lifecycle.mockTestEligible === true
    || lifecycle.publiclyPublishable === true
  ) throw new Error(`${qlId}: frozen lifecycle boundary drifted.`);
}

export function createInterestFrozenQuestionStudioAdapter(config: InterestFrozenAdapterConfig) {
  const packageId = "INT-001" as const;
  const qlIds = Object.freeze([...config.qlIds]);
  const languages = Object.freeze([...config.languages]);
  const languageSet = new Set<string>(languages);
  const qlSet = new Set<string>(qlIds);
  const multilingual = languages.length > 1;
  const reviewStatus = multilingual
    ? "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY"
    : "FROZEN_ENGLISH_CONTENT_AUTHORITY";

  function languageOf(value: unknown): InterestQuestionStudioLanguage {
    const language = String(value ?? "en").trim().toLowerCase();
    if (languageSet.has(language)) return language as InterestQuestionStudioLanguage;
    throw new Error(`${config.cpId} does not support language '${language}'.`);
  }

  function qlOf(value: unknown): string | undefined {
    const qlId = String(value ?? "").trim().toUpperCase();
    if (!qlId) return undefined;
    if (qlSet.has(qlId)) return qlId;
    throw new Error(`${qlId} is not owned by ${config.cpId}.`);
  }

  function normalize(source: any, qlId: string, language: InterestQuestionStudioLanguage, requestSeed: string) {
    assertFrozenBoundary(source, qlId);
    const stem = String(source.stem ?? source.presentation?.markdown ?? source.presentation?.prompt ?? "").trim();
    if (!stem) throw new Error(`${qlId}: frozen stem is empty.`);
    const options = Object.freeze((source.options ?? []).map(optionText));
    if (options.length !== 4 || new Set(options).size !== 4 || options.some((option) => !option.trim())) {
      throw new Error(`${qlId}: frozen options must contain four unique non-empty choices.`);
    }
    const correctIndex = Number(source.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new Error(`${qlId}: frozen correctIndex is invalid.`);
    }
    const answer = String(source.correctAnswer ?? options[correctIndex]);
    if (answer !== options[correctIndex]) throw new Error(`${qlId}: frozen answer no longer binds to the correct option.`);
    const lines = explanationLines(source);
    if (!lines.length) throw new Error(`${qlId}: frozen explanation is empty.`);
    const identity = createHash("sha256").update(`${config.integrationVersion}:${qlId}:${language}:${requestSeed}`).digest("hex").slice(0, 20);
    const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
    const hiddenState = toJsonSafe(source.mathematicalState ?? source.internalProvenance?.sourceState ?? source.state ?? {});
    const solveContract = String(
      source.solveContract
      ?? source.frozenRegistry?.solveContract
      ?? source.mathematicalState?.answerSemantic
      ?? source.answerSemantic
      ?? "",
    );
    const normalized = Object.freeze({
      packageId,
      canonicalProblemId: config.cpId,
      questionLanguageId: qlId,
      qlId,
      questionId: `INT-CP${config.cpNumber}-${qlId.slice(-3)}-${language.toUpperCase()}-${identity}`,
      stem,
      options,
      correctIndex,
      answer,
      difficultyBand: String(source.difficultyBand ?? source.difficulty ?? source.baselineDifficulty ?? "Medium"),
      language,
      locale,
      explanation: Object.freeze({ lines }),
      runtimeMode: "QUESTION_STUDIO_ACTIVE" as const,
      reviewStatus,
      questionStudioDiscoverable: true as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      preRegistrationOnly: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      manualApprovalRequired: true as const,
      solveContract,
      requestSeed,
      freezeId: String(source.freezeId ?? source.localizedVersion ?? ""),
      integrationAuthority: config.integrationVersion,
      traceability: Object.freeze({
        permanentQlId: qlId,
        sourceFreezeId: String(source.freezeId ?? source.localizedVersion ?? ""),
        permanentIdentityFrozen: true as const,
        learnerContentFrozen: true as const,
        questionStudioDiscoverable: true as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
      }),
      hiddenState,
    });
    JSON.stringify(normalized);
    return normalized;
  }

  function preview(pkg: ReturnType<typeof normalize>, index: number, count: number) {
    return Object.freeze({
      text: pkg.stem,
      stem: pkg.stem,
      options: pkg.options,
      correct: pkg.correctIndex,
      correctIndex: pkg.correctIndex,
      answer: pkg.answer,
      canonicalAnswer: Object.freeze({ kind: "symbolic", value: pkg.answer, display: pkg.answer, rendered: pkg.answer, rounding: "exact" }),
      explanation: pkg.explanation.lines.join("\n\n"),
      packageExplanation: pkg.explanation,
      difficulty: pkg.difficultyBand,
      difficultyLabel: pkg.difficultyBand,
      patternId: pkg.qlId,
      section: "Quant",
      topic: "Arithmetic",
      subtopic: "Interest",
      generationBackend: "quant-v4",
      debugSource: `quant-v4-interest-${config.cpId.toLowerCase()}-frozen-review`,
      packageSource: `quant-v4-interest-${config.cpId.toLowerCase()}-frozen-review`,
      packageId: pkg.packageId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      qlId: pkg.qlId,
      questionId: pkg.questionId,
      seed: pkg.requestSeed,
      language: pkg.language,
      locale: pkg.locale,
      runtimeMode: pkg.runtimeMode,
      reviewStatus: pkg.reviewStatus,
      questionStudioDiscoverable: true as const,
      questionStudioRegistrationStatus: pkg.questionStudioRegistrationStatus,
      questionStudioStagingStatus: pkg.questionStudioStagingStatus,
      questionBankStatus: pkg.questionBankStatus,
      questionBankWritable: false as const,
      testEligibility: pkg.testEligibility,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      manualApprovalRequired: true as const,
      solveMode: pkg.solveContract,
      validation: Object.freeze({ ok: true as const, valid: true as const, errors: Object.freeze([] as string[]) }),
      traceability: pkg.traceability,
      proceduralLogic: pkg.hiddenState,
      logic: pkg.hiddenState,
      questionIndex: index + 1,
      questionCount: count,
      integrationAuthority: pkg.integrationAuthority,
    });
  }

  function listPackages() {
    return [Object.freeze({
      id: packageId,
      packageId,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      subject: "Quantitative Aptitude",
      topic: "Arithmetic",
      subtopic: "Interest",
      name: config.name,
      label: config.name,
      generationDomain: "quant-v4",
      cpIds: Object.freeze([config.cpId]),
      permanentQlCount: qlIds.length,
      permanentQlIds: qlIds,
      supportedLanguages: languages,
      enabled: true,
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus,
      questionStudioDiscoverable: true,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationVersion: config.integrationVersion,
    })];
  }

  async function generateBatch(request: InterestQuestionStudioRequest = {}) {
    const language = languageOf(request.language);
    const explicitCp = request.canonicalProblemId ?? request.cpId;
    if (explicitCp && explicitCp !== config.cpId) throw new Error(`${config.cpId} cannot serve ${explicitCp}.`);
    const explicitQl = qlOf(request.questionLanguageId ?? request.qlId);
    const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
    const batchSeed = String(request.seed ?? "").trim() || `question-studio:${config.cpId}:${language}:${Date.now()}`;
    const pool = explicitQl ? [explicitQl] : [...qlIds];
    const offset = stableIndex(`${batchSeed}:offset`, pool.length);
    const questionPackages = [];
    const questions = [];
    for (let index = 0; index < count; index += 1) {
      const qlId = pool[(offset + index) % pool.length]!;
      const itemSeed = `${batchSeed}:${qlId}:${index}`;
      const source = config.generateSource(qlId, itemSeed, language);
      const pkg = normalize(source, qlId, language, itemSeed);
      questionPackages.push(pkg);
      questions.push(preview(pkg, index, count));
    }
    const result = Object.freeze({
      ok: true as const,
      packageId,
      canonicalProblemId: config.cpId,
      language,
      count,
      integrationVersion: config.integrationVersion,
      questionPackages: Object.freeze(questionPackages),
      questions: Object.freeze(questions),
    });
    JSON.stringify(result);
    return result;
  }

  return Object.freeze({
    integrationVersion: config.integrationVersion,
    packageId,
    cpId: config.cpId,
    qlIds,
    languages,
    reviewStatus,
    listPackages,
    generateBatch,
  });
}
