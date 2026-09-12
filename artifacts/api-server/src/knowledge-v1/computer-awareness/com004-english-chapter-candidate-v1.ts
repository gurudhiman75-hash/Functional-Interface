import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
  type Com004PermanentQlId,
} from "./com004-permanent-ql-allocation-v1";
import {
  COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE1_V1,
} from "./com004-english-production-wave1-v1-1";
import {
  COM004_ENGLISH_PRODUCTION_WAVE2_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE2_V1,
} from "./com004-english-production-wave2-v1";
import {
  COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE3_V1,
} from "./com004-english-production-wave3-v1";
import {
  COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE4_V1,
} from "./com004-english-production-wave4-v1-1";
import {
  COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE5_V1,
} from "./com004-english-production-wave5-v1";

export type Com004EnglishChapterQuestionV1 = {
  questionId: string;
  qlId: Com004PermanentQlId;
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  reviewOnly: true;
  runtimeRegistered: false;
};

export const COM004_ENGLISH_CHAPTER_CANDIDATE_V1: Com004EnglishChapterQuestionV1[] = Object.freeze([
  ...COM004_ENGLISH_PRODUCTION_WAVE1_V1,
  ...COM004_ENGLISH_PRODUCTION_WAVE2_V1,
  ...COM004_ENGLISH_PRODUCTION_WAVE3_V1,
  ...COM004_ENGLISH_PRODUCTION_WAVE4_V1,
  ...COM004_ENGLISH_PRODUCTION_WAVE5_V1,
]) as unknown as Com004EnglishChapterQuestionV1[];

export const COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-CHAPTER-CANDIDATE-V1" as const,
  chapterCode: "COM-004" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  permanentQlCount: 17,
  questionsPerQl: 12,
  questionCount: COM004_ENGLISH_CHAPTER_CANDIDATE_V1.length,
  waveAuthorities: Object.freeze([
    COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1.authorityId,
    COM004_ENGLISH_PRODUCTION_WAVE2_AUTHORITY_V1.authorityId,
    COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.authorityId,
    COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1.authorityId,
    COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.authorityId,
  ]),
  editorialOverlays: Object.freeze({
    wave1: COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1.editorialOverlay.version,
    wave4: COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1.editorialOverlay.version,
  }),
  governance: Object.freeze({
    englishFreezeAuthorized: false,
    localizationAuthorized: false,
    difficultyAuthorityAuthorized: false,
    questionStudioRuntimeAuthorized: false,
    questionBankWritesAuthorized: false,
    testEligibilityAuthorized: false,
    mockTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    publicPublicationAuthorized: false,
    productionReleased: false,
  }),
  nextGate: "COM004_ENGLISH_CHAPTER_EDITORIAL_AUDIT_V1" as const,
});

const normalize = (value: string) => value.trim().toLowerCase().replace(/[‘’'“”"():,.?`]/g, "").replace(/\s+/g, " ");

export function auditCom004EnglishChapterCandidateV1() {
  const issues: string[] = [];
  const questions = COM004_ENGLISH_CHAPTER_CANDIDATE_V1;
  const allocationAudit = auditCom004PermanentQlAllocationV1();
  if (!allocationAudit.valid) issues.push(...allocationAudit.issues.map((issue) => `ALLOCATION:${issue}`));

  const expectedWaveCounts = [48, 48, 48, 48, 12];
  const actualWaveCounts = [
    COM004_ENGLISH_PRODUCTION_WAVE1_V1.length,
    COM004_ENGLISH_PRODUCTION_WAVE2_V1.length,
    COM004_ENGLISH_PRODUCTION_WAVE3_V1.length,
    COM004_ENGLISH_PRODUCTION_WAVE4_V1.length,
    COM004_ENGLISH_PRODUCTION_WAVE5_V1.length,
  ];
  actualWaveCounts.forEach((count, index) => {
    if (count !== expectedWaveCounts[index]) issues.push(`WAVE_COUNT:W${index + 1}:${count}`);
  });

  if (questions.length !== 204) issues.push(`CHAPTER_COUNT:${questions.length}`);
  if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.questionCount !== 204) issues.push("AUTHORITY_COUNT_DRIFT");
  if (COM004_PERMANENT_QL_ALLOCATIONS_V1.length !== 17) issues.push(`QL_ALLOCATION_COUNT:${COM004_PERMANENT_QL_ALLOCATIONS_V1.length}`);
  if (COM004_ENGLISH_PRODUCTION_WAVE1_AUTHORITY_V1.editorialOverlay.version !== "V1.1") issues.push("WAVE1_EDITORIAL_OVERLAY_DRIFT");
  if (COM004_ENGLISH_PRODUCTION_WAVE4_AUTHORITY_V1.editorialOverlay.version !== "V1.1") issues.push("WAVE4_EDITORIAL_OVERLAY_DRIFT");

  const ids = new Set<string>();
  const stems = new Set<string>();
  const answerPositions = [0, 0, 0, 0];

  for (const question of questions) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);

    const normalizedStem = normalize(question.stem);
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);

    if (question.stem.trim().length < 35) issues.push(`THIN_STEM:${question.questionId}`);
    if (question.explanation.trim().length < 70) issues.push(`THIN_EXPLANATION:${question.questionId}`);
    if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}:${question.options.length}`);
    if (new Set(question.options.map(normalize)).size !== 4) issues.push(`DUPLICATE_OPTION:${question.questionId}`);
    if (question.correctIndex < 0 || question.correctIndex > 3) issues.push(`ANSWER_INDEX_RANGE:${question.questionId}`);
    else answerPositions[question.correctIndex] += 1;
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_BINDING:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE_ESCAPE:${question.questionId}`);

    const allocation = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((item) => item.permanentQlId === question.qlId);
    if (!allocation) issues.push(`UNKNOWN_QL:${question.questionId}:${question.qlId}`);
    else {
      if (question.authorityProposalId !== allocation.authorityProposalId) issues.push(`AUTHORITY_DRIFT:${question.questionId}`);
      if (JSON.stringify(question.sourceCandidateIds) !== JSON.stringify(allocation.sourceCandidateIds)) issues.push(`SOURCE_CANDIDATE_DRIFT:${question.questionId}`);
    }

    const editorialText = `${question.stem} ${question.explanation}`;
    if (/\b(?:option\s+[a-d]|the correct (?:option|answer) is|answer is)\b/i.test(question.explanation)) issues.push(`OPTION_KEY_LEAK:${question.questionId}`);
    if (/\b(?:as mentioned above|as given in the question|obviously|clearly)\b/i.test(question.explanation)) issues.push(`GENERIC_EXPLANATION_FILLER:${question.questionId}`);
    if (/\{\{|\}\}|\[placeholder\]|<placeholder>|\btodo\b|\btbd\b/i.test(editorialText)) issues.push(`TEMPLATE_JUNK:${question.questionId}`);
    if (/\b(?:therefore|hence|accordingly),?\s+.*\b(?:correct|answer)\b/i.test(question.explanation)) issues.push(`GENERIC_ANSWER_TAIL:${question.questionId}`);
  }

  const expectedQls = Array.from({ length: 17 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}` as Com004PermanentQlId);
  for (const qlId of expectedQls) {
    const qlQuestions = questions.filter((question) => question.qlId === qlId);
    if (qlQuestions.length !== 12) issues.push(`QL_COUNT:${qlId}:${qlQuestions.length}`);
    if (new Set(qlQuestions.map((question) => normalize(question.stem))).size !== 12) issues.push(`QL_STEM_DIVERSITY:${qlId}`);
    if (new Set(qlQuestions.map((question) => normalize(question.explanation))).size < 10) issues.push(`QL_EXPLANATION_DIVERSITY:${qlId}`);
    if (new Set(qlQuestions.map((question) => question.surfaceFamily)).size < 3) issues.push(`THIN_SURFACE_MIX:${qlId}`);
    const openings = new Set(qlQuestions.map((question) => normalize(question.stem).split(" ").slice(0, 3).join(" ")));
    if (openings.size < 6) issues.push(`MECHANICAL_STEM_OPENINGS:${qlId}:${openings.size}`);
  }

  answerPositions.forEach((count, index) => {
    if (count < 35 || count > 70) issues.push(`ANSWER_POSITION_SKEW:${index}:${count}`);
  });

  const webVsInternet = questions.filter((question) => question.qlId === "COM-004-QL-002");
  if (!webVsInternet.some((question) => /Internet.*broader|Web.*service|Web.*Internet/i.test(question.explanation))) issues.push("WEB_INTERNET_BOUNDARY_MISSING");

  const browserSearch = questions.filter((question) => question.qlId === "COM-004-QL-005");
  if (!browserSearch.some((question) => /browser.*search engine|search engine.*browser/i.test(question.explanation))) issues.push("BROWSER_SEARCH_BOUNDARY_MISSING");

  const urlDomain = questions.filter((question) => question.qlId === "COM-004-QL-008");
  if (urlDomain.some((question) => /(?:\.gov|\.org|\.com).*\b(?:guarantee|proof|always means)\b/i.test(`${question.stem} ${question.explanation}`))) issues.push("TLD_LEGITIMACY_OVERCLAIM");

  const mailProtocol = questions.filter((question) => question.qlId === "COM-004-QL-015");
  if (!mailProtocol.some((question) => /POP3.*(?:not.*always|invariably.*inaccurate|leave copies)/i.test(question.explanation))) issues.push("POP3_RETENTION_LOCK_MISSING");
  if (mailProtocol.some((question) => /\bport\s*\d+|\b(?:25|110|143|465|587|993|995)\b/i.test(`${question.stem} ${question.explanation}`))) issues.push("MAIL_PROTOCOL_PORT_LEAK");

  const bankingCapability = questions.filter((question) => question.qlId === "COM-004-QL-016");
  if (bankingCapability.some((question) => /₹|rupees?|\b(?:limit|timing|cutoff)\s+(?:is|of)\s+\d/i.test(`${question.stem} ${question.explanation}`))) issues.push("CURRENT_BANKING_RULE_LEAK");

  const bankingSafety = questions.filter((question) => question.qlId === "COM-004-QL-017");
  if (!bankingSafety.some((question) => /HTTPS alone is not a legitimacy guarantee|HTTPS alone proves.*genuine/i.test(`${question.stem} ${question.explanation}`))) issues.push("HTTPS_LEGITIMACY_LOCK_MISSING");
  if (!bankingSafety.some((question) => /COM-006|security chapter/i.test(`${question.stem} ${question.explanation}`))) issues.push("CYBER_SECURITY_OWNERSHIP_BOUNDARY_MISSING");

  for (const [key, value] of Object.entries(COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.governance)) {
    if (value !== false) issues.push(`PREMATURE_GOVERNANCE:${key}`);
  }
  if (COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.status !== "REVIEW_CANDIDATE_NOT_FROZEN") issues.push("PREMATURE_FREEZE");

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    permanentQlCount: expectedQls.length,
    questionCount: questions.length,
    questionsPerQl: 12,
    uniqueQuestionIds: ids.size,
    uniqueStems: stems.size,
    answerPositions: Object.freeze([...answerPositions]),
    englishFrozen: false,
    localizationAuthorized: false,
    runtimeAuthorized: false,
    questionBankWritesAuthorized: false,
    nextGate: COM004_ENGLISH_CHAPTER_CANDIDATE_AUTHORITY_V1.nextGate,
  });
}
