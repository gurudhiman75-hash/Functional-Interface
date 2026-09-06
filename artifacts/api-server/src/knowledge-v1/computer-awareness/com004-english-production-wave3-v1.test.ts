import {
  COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE3_V1,
} from "./com004-english-production-wave3-v1";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
} from "./com004-permanent-ql-allocation-v1";

const issues: string[] = [];
const expectedQls = ["COM-004-QL-009", "COM-004-QL-010", "COM-004-QL-011", "COM-004-QL-012"] as const;
const allowedSurfaceFamilies = new Set([
  "DIRECT_RECALL",
  "CONCEPT_DISCRIMINATION",
  "SCENARIO_APPLICATION",
  "STATEMENT_EVALUATION",
  "MATCHING_REASONING",
]);

const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) issues.push(...allocationAudit.issues.map((issue) => `ALLOCATION:${issue}`));
if (COM004_ENGLISH_PRODUCTION_WAVE3_V1.length !== 48) issues.push(`COUNT:${COM004_ENGLISH_PRODUCTION_WAVE3_V1.length}`);
if (COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.questionCount !== 48) issues.push("AUTHORITY_COUNT_DRIFT");
if (COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.questionsPerQl !== 12) issues.push("AUTHORITY_PER_QL_DRIFT");

const questionIds = new Set<string>();
const allStems = new Set<string>();
for (const question of COM004_ENGLISH_PRODUCTION_WAVE3_V1) {
  if (questionIds.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
  questionIds.add(question.questionId);
  const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
  if (allStems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
  allStems.add(normalizedStem);
  if (question.stem.trim().length < 35) issues.push(`THIN_STEM:${question.questionId}`);
  if (question.explanation.trim().length < 70) issues.push(`THIN_EXPLANATION:${question.questionId}`);
  if (question.options.length !== 4) issues.push(`OPTION_COUNT:${question.questionId}`);
  if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) issues.push(`DUPLICATE_OPTION:${question.questionId}`);
  if (question.correctIndex < 0 || question.correctIndex > 3) issues.push(`ANSWER_INDEX_RANGE:${question.questionId}`);
  if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_POSITION:${question.questionId}`);
  if (!allowedSurfaceFamilies.has(question.surfaceFamily)) issues.push(`SURFACE_FAMILY:${question.questionId}:${question.surfaceFamily}`);
  if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE_ESCAPE:${question.questionId}`);

  const allocation = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((item) => item.permanentQlId === question.qlId);
  if (!allocation) issues.push(`UNKNOWN_QL:${question.questionId}:${question.qlId}`);
  else {
    if (question.authorityProposalId !== allocation.authorityProposalId) issues.push(`AUTHORITY_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.sourceCandidateIds) !== JSON.stringify(allocation.sourceCandidateIds)) issues.push(`SOURCE_CANDIDATE_DRIFT:${question.questionId}`);
  }

  if (/\b(?:therefore|hence|accordingly),?\s+.*\b(?:correct|answer)\b/i.test(question.explanation)) issues.push(`GENERIC_ANSWER_TAIL:${question.questionId}`);
  if (/\b(?:option\s+[a-d]|the correct (?:option|answer) is|answer is)\b/i.test(question.explanation)) issues.push(`OPTION_KEY_LEAK:${question.questionId}`);
  if (/\b(?:as mentioned above|as given in the question|obviously|clearly)\b/i.test(question.explanation)) issues.push(`GENERIC_EXPLANATION_FILLER:${question.questionId}`);
  if (/\{\{|\}\}|\[placeholder\]|<placeholder>|todo\b|tbd\b/i.test(question.stem + " " + question.explanation)) issues.push(`TEMPLATE_JUNK:${question.questionId}`);
}

for (const qlId of expectedQls) {
  const questions = COM004_ENGLISH_PRODUCTION_WAVE3_V1.filter((question) => question.qlId === qlId);
  if (questions.length !== 12) issues.push(`QL_COUNT:${qlId}:${questions.length}`);
  if (new Set(questions.map((question) => question.stem.trim().toLowerCase())).size !== 12) issues.push(`QL_STEM_DIVERSITY:${qlId}`);
  if (new Set(questions.map((question) => question.explanation.trim().toLowerCase())).size < 10) issues.push(`QL_EXPLANATION_DIVERSITY:${qlId}`);
  const openings = new Set(questions.map((question) => question.stem.toLowerCase().replace(/[‘’'“”"():,.?`]/g, "").split(/\s+/).slice(0, 3).join(" ")));
  if (openings.size < 7) issues.push(`MECHANICAL_STEM_OPENINGS:${qlId}:${openings.size}`);
  const surfaceFamilies = new Set(questions.map((question) => question.surfaceFamily));
  if (surfaceFamilies.size < 3) issues.push(`THIN_SURFACE_MIX:${qlId}:${surfaceFamilies.size}`);
}

const httpsQl = COM004_ENGLISH_PRODUCTION_WAVE3_V1.filter((question) => question.qlId === "COM-004-QL-009");
if (!httpsQl.some((question) => /not.*proof|does not.*guarantee|not.*guarantee/i.test(question.explanation))) issues.push("HTTPS_LEGITIMACY_LOCK_MISSING");
if (httpsQl.some((question) => /HTTPS.*(?:proves|guarantees).*legitim/i.test(question.explanation))) issues.push("HTTPS_FALSE_LEGITIMACY");
if (httpsQl.some((question) => /\bport\s*\d+|transport layer|application layer/i.test(question.stem + " " + question.explanation))) issues.push("NETWORKING_DEPTH_LEAK");

const historyQl = COM004_ENGLISH_PRODUCTION_WAVE3_V1.filter((question) => question.qlId === "COM-004-QL-010");
if (!historyQl.some((question) => /precursor/i.test(question.explanation))) issues.push("ARPANET_PRECURSOR_LOCK_MISSING");
if (historyQl.some((question) => /ARPANET (?:is|was) (?:the )?(?:modern )?Internet\b/i.test(question.explanation))) issues.push("ARPANET_EQUIVALENCE_ERROR");
if (!historyQl.some((question) => /one person|single-handed/i.test(question.stem + " " + question.explanation))) issues.push("SINGLE_INVENTOR_MISCONCEPTION_LOCK_MISSING");

const governance = COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.governance;
for (const [key, value] of Object.entries(governance)) if (value !== false) issues.push(`PREMATURE_GOVERNANCE:${key}`);
if (COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.status !== "REVIEW_CANDIDATE_NOT_FROZEN") issues.push("PREMATURE_FREEZE");
if (COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.nextGate !== "COM004_ENGLISH_PRODUCTION_WAVE3_EDITORIAL_AUDIT") issues.push("NEXT_GATE_DRIFT");

if (issues.length) throw new Error(`COM-004 English Production Wave 3 V1 audit failed:\n${issues.join("\n")}`);

console.log(JSON.stringify({
  checkpoint: "COM004_ENGLISH_PRODUCTION_WAVE3_V1_REVIEW_CANDIDATE",
  valid: true,
  qlCount: expectedQls.length,
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE3_V1.length,
  questionsPerQl: 12,
  uniqueStemCount: allStems.size,
  httpsLegitimacyLock: true,
  arpanetPrecursorLock: true,
  runtimeAuthorized: false,
  localizationAuthorized: false,
  questionBankWritesAuthorized: false,
  nextGate: COM004_ENGLISH_PRODUCTION_WAVE3_AUTHORITY_V1.nextGate,
}, null, 2));
