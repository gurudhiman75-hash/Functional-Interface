import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import { findVennTopologyWitness } from "./logical-venn-topology.ts";
import {
  renderVennTopologySvg,
  type VennTopologyId,
} from "./logical-venn-renderer.ts";
import {
  VEN_001_SCENARIO_AUTHORITIES,
  type VennScenarioAuthority,
  type VennLocale,
} from "./ven-001-scenario-authorities.ts";

export const VEN_001_QUESTION_STUDIO_PACKAGE_ID = "VEN-001" as const;
export const VEN_001_QUESTION_STUDIO_REVIEW_AUTHORITY =
  "VEN-001-TRILINGUAL-REVIEW-CANDIDATES-V1" as const;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const topologyIds: readonly VennTopologyId[] = [
  "THREE_NESTED",
  "THREE_TWO_DISJOINT_SUBSETS",
  "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
  "THREE_PAIRWISE_OVERLAP_WITH_TRIPLE",
  "THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE",
  "THREE_TWO_OVERLAP_ONE_SEPARATE",
];
type VennDifficulty = "Easy" | "Medium";
type VennOperation =
  | "MIXED"
  | "CATEGORIES_TO_DIAGRAM"
  | "DIAGRAM_TO_CATEGORIES";
const localeByLanguage: Record<QuestionStudioLanguage, VennLocale> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

function stableHash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function difficultyFor(topologyId: VennTopologyId): VennDifficulty {
  return topologyId === "THREE_NESTED" ||
    topologyId === "THREE_TWO_DISJOINT_SUBSETS"
    ? "Easy"
    : "Medium";
}
function requestedDifficulty(value: unknown): VennDifficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  throw new Error(
    `VEN-001 supports Easy and Medium review difficulty only; received ${String(value)}`,
  );
}
function count(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50)
    throw new Error("VEN-001 review batches require a count between 1 and 50");
  return value;
}
function language(
  value: QuestionStudioLanguage | undefined,
): QuestionStudioLanguage {
  if (value === undefined || value === "en" || value === "hi" || value === "pa")
    return value ?? "en";
  throw new Error(`VEN-001 does not support language ${String(value)}`);
}
function selectedAuthorities(
  request: QuestionStudioGenerationRequest,
): VennScenarioAuthority[] {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const allowed = new Set([
    "VEN-001",
    "VEN-CP003",
    "VEN-CP003-DIRECT",
    "VEN-CP003-REVERSE",
    ...VEN_001_SCENARIO_AUTHORITIES.map((a) => a.authorityId),
  ]);
  const unknown = selectors.find(
    (selector) => selector.startsWith("VEN-") && !allowed.has(selector),
  );
  if (unknown) throw new Error(`Unknown VEN-001 content selector ${unknown}`);
  const authorityId = selectors.find((selector) =>
    selector.startsWith("VEN-AUTH-"),
  );
  const result = authorityId
    ? VEN_001_SCENARIO_AUTHORITIES.filter((a) => a.authorityId === authorityId)
    : [...VEN_001_SCENARIO_AUTHORITIES];
  if (!result.length)
    throw new Error(`VEN-001 has no scenario for ${authorityId}`);
  return result;
}
function requestedOperation(
  request: QuestionStudioGenerationRequest,
): VennOperation {
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase());
  if (selectors.includes("VEN-CP003-DIRECT")) return "CATEGORIES_TO_DIAGRAM";
  if (selectors.includes("VEN-CP003-REVERSE")) return "DIAGRAM_TO_CATEGORIES";
  return "MIXED";
}
function categoryOption(
  authority: VennScenarioAuthority,
  locale: VennLocale,
): string {
  return authority.sets
    .map((set) => `${set.setId} = ${set.labels[locale]}`)
    .join(locale === "en-IN" ? "; " : "；");
}
function reverseDistractors(
  authority: VennScenarioAuthority,
  seed: number,
): VennScenarioAuthority[] {
  return VEN_001_SCENARIO_AUTHORITIES.filter(
    (candidate) =>
      candidate.authorityId !== authority.authorityId &&
      candidate.topologyId !== authority.topologyId,
  )
    .sort(
      (a, b) =>
        stableHash(`${seed}:${a.authorityId}`) -
          stableHash(`${seed}:${b.authorityId}`) ||
        a.authorityId.localeCompare(b.authorityId),
    )
    .slice(0, 3);
}
function relationExplanation(
  authority: VennScenarioAuthority,
  locale: VennLocale,
  reverse: boolean,
): string {
  const facts = relationText(authority, locale).join(
    locale === "en-IN" ? "; " : "；",
  );
  if (!reverse) return facts + (locale === "en-IN" ? "." : "।");
  if (locale === "hi-IN")
    return `आरेख में तीन समूहों की यही बनावट दिखाई गई है: ${facts}।`;
  if (locale === "pa-IN")
    return `ਚਿੱਤਰ ਵਿੱਚ ਤਿੰਨ ਸਮੂਹਾਂ ਦੀ ਇਹੀ ਬਣਤਰ ਦਿਖਾਈ ਗਈ ਹੈ: ${facts}।`;
  return `The diagram has this three-group structure: ${facts}.`;
}

function correctCircleLabelOrder(authority: VennScenarioAuthority): string[] {
  if (authority.topologyId === "THREE_NESTED") {
    const supersets = new Map(authority.sets.map((set) => [set.setId, 0]));
    for (const relation of authority.relations)
      if (relation.relation === "LEFT_SUBSET_RIGHT")
        supersets.set(relation.right, (supersets.get(relation.right) ?? 0) + 1);
    return [...authority.sets]
      .sort(
        (a, b) => (supersets.get(b.setId) ?? 0) - (supersets.get(a.setId) ?? 0),
      )
      .map((set) => set.setId);
  }
  if (
    authority.topologyId === "THREE_TWO_DISJOINT_SUBSETS" ||
    authority.topologyId === "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET"
  ) {
    const outer = authority.relations.find(
      (relation) =>
        relation.left !== relation.right &&
        relation.relation === "LEFT_SUBSET_RIGHT" &&
        authority.relations.filter(
          (r) =>
            r.relation === "LEFT_SUBSET_RIGHT" && r.right === relation.right,
        ).length === 2,
    )?.right;
    if (!outer)
      throw new Error(
        `VEN-001 cannot locate outer set in ${authority.authorityId}`,
      );
    return [
      outer,
      ...authority.sets
        .map((set) => set.setId)
        .filter((setId) => setId !== outer),
    ];
  }
  return authority.sets.map((set) => set.setId);
}
function stemFor(authority: VennScenarioAuthority, locale: VennLocale): string {
  const groups = authority.sets
    .map((set) => `${set.setId} = ${set.labels[locale]}`)
    .join(locale === "en-IN" ? ", " : "，");
  if (locale === "hi-IN")
    return `मानें, ${groups}। कौन-सा आरेख इन समूहों का सही संबंध दिखाता है?`;
  if (locale === "pa-IN")
    return `ਮੰਨੋ, ${groups}। ਕਿਹੜਾ ਚਿੱਤਰ ਇਨ੍ਹਾਂ ਸਮੂਹਾਂ ਦਾ ਸਹੀ ਸੰਬੰਧ ਦਿਖਾਉਂਦਾ ਹੈ?`;
  return `Let ${groups}. Which diagram shows the relationship among these groups?`;
}
function stemForDiagram(locale: VennLocale): string {
  if (locale === "hi-IN")
    return "दिए गए वेन आरेख से मेल खाने वाले तीन समूहों का सही सेट चुनें।";
  if (locale === "pa-IN")
    return "ਦਿੱਤੇ ਵੇਨ ਚਿੱਤਰ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਤਿੰਨ ਸਮੂਹਾਂ ਦਾ ਸਹੀ ਸੈੱਟ ਚੁਣੋ।";
  return "Choose the set of three groups that best matches the Venn diagram.";
}

function relationText(
  authority: VennScenarioAuthority,
  locale: VennLocale,
): string[] {
  const label = new Map(
    authority.sets.map((set) => [set.setId, set.labels[locale]]),
  );
  return authority.relations.map(({ left, right, relation }) => {
    const a = label.get(left)!;
    const b = label.get(right)!;
    if (locale === "hi-IN") {
      if (relation === "LEFT_SUBSET_RIGHT")
        return `${a} का हर सदस्य ${b} में है`;
      if (relation === "DISJOINT")
        return `${a} और ${b} का कोई सदस्य समान नहीं है`;
      if (relation === "PARTIAL_OVERLAP")
        return `${a} और ${b} के कुछ सदस्य समान हैं, लेकिन दोनों समूह पूरी तरह समान नहीं हैं`;
      if (relation === "RIGHT_SUBSET_LEFT")
        return `${b} का हर सदस्य ${a} में है`;
      return `${a} और ${b} के सदस्य समान हैं`;
    }
    if (locale === "pa-IN") {
      if (relation === "LEFT_SUBSET_RIGHT")
        return `${a} ਦਾ ਹਰ ਮੈਂਬਰ ${b} ਵਿੱਚ ਹੈ`;
      if (relation === "DISJOINT")
        return `${a} ਅਤੇ ${b} ਦਾ ਕੋਈ ਸਾਂਝਾ ਮੈਂਬਰ ਨਹੀਂ ਹੈ`;
      if (relation === "PARTIAL_OVERLAP")
        return `${a} ਅਤੇ ${b} ਦੇ ਕੁਝ ਮੈਂਬਰ ਸਾਂਝੇ ਹਨ, ਪਰ ਦੋਵੇਂ ਸਮੂਹ ਪੂਰੀ ਤਰ੍ਹਾਂ ਇੱਕੋ ਨਹੀਂ ਹਨ`;
      if (relation === "RIGHT_SUBSET_LEFT")
        return `${b} ਦਾ ਹਰ ਮੈਂਬਰ ${a} ਵਿੱਚ ਹੈ`;
      return `${a} ਅਤੇ ${b} ਦੇ ਮੈਂਬਰ ਇੱਕੋ ਹਨ`;
    }
    if (relation === "LEFT_SUBSET_RIGHT") return `Every ${a} is a ${b}`;
    if (relation === "DISJOINT")
      return `${a} and ${b} have no members in common`;
    if (relation === "PARTIAL_OVERLAP")
      return `${a} and ${b} share some, but not all, members`;
    if (relation === "RIGHT_SUBSET_LEFT") return `Every ${b} is a ${a}`;
    return `${a} and ${b} contain the same members`;
  });
}
function distractors(correct: VennTopologyId, seed: number): VennTopologyId[] {
  const pool = topologyIds
    .filter((id) => id !== correct)
    .sort(
      (a, b) =>
        stableHash(`${seed}:${a}`) - stableHash(`${seed}:${b}`) ||
        a.localeCompare(b),
    );
  return pool.slice(0, 3);
}
function shuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = stableHash(`${seed}:${i}`) % (i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export const VEN_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition =
  {
    engineId: "reasoning-v1",
    packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
    subject: "Reasoning Ability",
    topic: "Reasoning",
    subtopic: "Logical Venn Diagrams",
    label: "Reasoning · Logical Venn Diagrams — VEN-001",
    enabled: true,
    cpIds: ["VEN-CP003"],
    supportedLanguages: ["en", "hi", "pa"],
    supportedDifficulties: ["Easy", "Medium"],
    difficultyFilterSupported: true,
    runtimeMode: "review-only",
    supportedRuntimeModes: ["review-only"],
    lifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
    manualApprovalRequired: true,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: false,
    questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: null,
    testEligibility: lifecycle.testEligibility,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    metadata: {
      chapterId: "VEN-001",
      reviewStatus: "PENDING_TRILINGUAL_HUMAN_REVIEW",
      registrationAuthorityId: VEN_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      permanentQlIdsAllocated: false,
      supportedQuestionOperations: [
        "CATEGORIES_TO_DIAGRAM",
        "DIAGRAM_TO_CATEGORIES",
      ],
    },
  };

export function isVen001QuestionStudioRequest(
  request: QuestionStudioGenerationRequest,
): boolean {
  const packageId = text(request.packageId);
  if (packageId) return packageId === VEN_001_QUESTION_STUDIO_PACKAGE_ID;
  const selectors = [
    request.patternId,
    request.canonicalProblemId,
    request.questionLanguageId,
  ].map((value) => text(value).toUpperCase());
  if (
    selectors.some(
      (value) =>
        value === "VEN-001" ||
        value.startsWith("VEN-CP") ||
        value.startsWith("VEN-AUTH-"),
    )
  )
    return true;
  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return (
    topic.includes("logical venn") ||
    subtopic.includes("logical venn") ||
    topic.includes("venn diagrams")
  );
}

export function generateVen001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (request.runtimeMode && request.runtimeMode !== "review-only")
    throw new Error(
      "VEN-001 only supports review-only Question Studio generation",
    );
  const n = count(request.count);
  const difficulty = requestedDifficulty(request.difficulty);
  const lang = language(request.language);
  const locale = localeByLanguage[lang];
  const baseSeed = text(request.seed) || "ven-001-question-studio-review-v1";
  const operation = requestedOperation(request);
  const authorities = selectedAuthorities(request)
    .filter(
      (authority) =>
        !difficulty || difficultyFor(authority.topologyId) === difficulty,
    )
    .sort(
      (a, b) =>
        stableHash(`${baseSeed}:${a.authorityId}`) -
          stableHash(`${baseSeed}:${b.authorityId}`) ||
        a.authorityId.localeCompare(b.authorityId),
    );
  if (!authorities.length)
    throw new Error(
      `VEN-001 has no ${difficulty ?? "requested"} review authorities in the selected content pack`,
    );
  if (n > authorities.length)
    throw new Error(
      `VEN-001 currently has ${authorities.length} distinct ${difficulty ?? "review"} authorities; requested ${n}`,
    );
  const questions = authorities.slice(0, n).map((authority, index) => {
    const witness = findVennTopologyWitness(
      authority.sets.map((set) => set.setId),
      authority.relations,
      authority.threeWayIntersection,
    );
    if (!witness)
      throw new Error(
        `VEN-001 authority ${authority.authorityId} is not satisfiable`,
      );
    const seed = `${baseSeed}:${authority.authorityId}:${index}`;
    const reverse =
      operation === "DIAGRAM_TO_CATEGORIES" ||
      (operation === "MIXED" && stableHash(`${seed}:operation`) % 2 === 1);
    const targetLabels = correctCircleLabelOrder(authority);
    let options: string[];
    let optionSvgs: string[] | undefined;
    let stimulusSvgs: string[] | undefined;
    let optionDetails: Record<string, unknown>[];
    let correctIndex: number;
    if (reverse) {
      const distractorAuthorities = reverseDistractors(
        authority,
        stableHash(`${seed}:reverse-options`),
      );
      if (distractorAuthorities.length !== 3)
        throw new Error(
          `VEN-001 needs three unique reverse-choice authorities for ${authority.authorityId}`,
        );
      const candidates = shuffle(
        [authority, ...distractorAuthorities],
        stableHash(`${seed}:reverse-option-order`),
      );
      options = candidates.map((candidate) =>
        categoryOption(candidate, locale),
      );
      correctIndex = candidates.findIndex(
        (candidate) => candidate.authorityId === authority.authorityId,
      );
      stimulusSvgs = [
        renderVennTopologySvg(authority.topologyId, undefined, false),
      ];
      optionDetails = candidates.map((candidate, optionIndex) => ({
        label: String.fromCharCode(65 + optionIndex),
        text: options[optionIndex],
        isCorrect: optionIndex === correctIndex,
        semanticKey: candidate.authorityId,
      }));
    } else {
      const selectedOptions = shuffle(
        [
          authority.topologyId,
          ...distractors(authority.topologyId, stableHash(seed)),
        ],
        stableHash(`${seed}:option-order`),
      );
      correctIndex = selectedOptions.indexOf(authority.topologyId);
      optionSvgs = selectedOptions.map((topologyId) =>
        renderVennTopologySvg(
          topologyId,
          topologyId === authority.topologyId ? targetLabels : ["A", "B", "C"],
        ),
      );
      options = ["A", "B", "C", "D"];
      optionDetails = optionSvgs.map((svg, optionIndex) => ({
        label: String.fromCharCode(65 + optionIndex),
        text: "Venn diagram",
        svg,
        isCorrect: optionIndex === correctIndex,
        semanticKey: selectedOptions[optionIndex],
      }));
    }
    const stem = reverse ? stemForDiagram(locale) : stemFor(authority, locale);
    const explanation = relationExplanation(authority, locale, reverse);
    return {
      ...lifecycle,
      id: `${authority.authorityId}:${stableHash(seed)}:${lang}`,
      questionId: `${authority.authorityId}:${stableHash(seed)}:${lang}`,
      packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "VEN-001",
      patternId: "VEN-CP003",
      cpId: "VEN-CP003",
      checkpointId: "VEN-CP003",
      candidateId: authority.authorityId,
      sourceAuthorityId: authority.authorityId,
      sourceAuthorityVersion: "VEN-001-CANDIDATES-V1",
      subject: "Reasoning",
      topic: "Logical Venn Diagrams",
      subtopic: "Category-set classification",
      questionOperation: reverse
        ? "DIAGRAM_TO_CATEGORIES"
        : "CATEGORIES_TO_DIAGRAM",
      language: lang,
      locale,
      stem,
      text: stem,
      options,
      optionLabels: ["A", "B", "C", "D"],
      ...(optionSvgs ? { optionSvgs } : {}),
      ...(stimulusSvgs ? { stimulusSvgs } : {}),
      optionDetails,
      correctIndex,
      correct: correctIndex,
      answer: String.fromCharCode(65 + correctIndex),
      canonicalAnswer: options[correctIndex],
      explanation,
      difficulty: difficultyFor(authority.topologyId),
      difficultyLabel: difficultyFor(authority.topologyId),
      difficultyAuthority: "PROVISIONAL_STRUCTURE_BASED_CANDIDATE",
      generationSeed: seed,
      runtimeMode: "review-only",
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: VEN_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      reviewStatus: authority.reviewStatus,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      runtimeRegistered: true,
      reviewOnly: true,
      readOnly: true,
      productionReleased: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      validation: {
        topologySatisfiable: true,
        exactlyOneCorrect:
          optionDetails.filter((option) => option.isCorrect === true).length ===
          1,
        distinctOptions:
          new Set(optionDetails.map((option) => option.semanticKey)).size === 4,
        localeParityPendingHumanReview: true,
      },
      semanticMetadata: {
        authorityDomain: authority.domain,
        assertedRelations: authority.relations,
        threeWayIntersection: authority.threeWayIntersection ?? "UNSPECIFIED",
        targetTopologyId: authority.topologyId,
        correctCircleLabelOrder: targetLabels,
        topologyWitness: witness.membershipAtoms,
      },
    };
  });
  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: VEN_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "VEN-001",
      topic: "Logical Venn Diagrams",
      runtimeMode: "review-only",
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: VEN_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      language: lang,
      requestedOperation: operation,
      requestedDifficulty: difficulty ?? "Mixed",
      difficultyFilterApplied: difficulty !== undefined,
      difficultyCalibrationStatus: "PROVISIONAL_STRUCTURE_BASED_CANDIDATE",
      sourceAuthorityIds: questions.map((q) => q.sourceAuthorityId),
      sourceAuthorityCount: authorities.length,
      seed: baseSeed,
      count: n,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      productionReleaseAuthorized: false,
    },
  };
}
