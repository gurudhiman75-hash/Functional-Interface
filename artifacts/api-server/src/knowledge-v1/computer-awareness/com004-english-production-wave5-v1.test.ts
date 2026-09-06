import {
  COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1,
  COM004_ENGLISH_PRODUCTION_WAVE5_V1,
} from "./com004-english-production-wave5-v1";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
} from "./com004-permanent-ql-allocation-v1";

const issues: string[] = [];
const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) issues.push(...allocationAudit.issues.map((issue) => `ALLOCATION:${issue}`));
if (COM004_ENGLISH_PRODUCTION_WAVE5_V1.length !== 12) issues.push(`COUNT:${COM004_ENGLISH_PRODUCTION_WAVE5_V1.length}`);
if (COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.questionCount !== 12) issues.push("AUTHORITY_COUNT_DRIFT");

const qlAllocation = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((item) => item.permanentQlId === "COM-004-QL-017");
if (!qlAllocation) issues.push("QL017_ALLOCATION_MISSING");

const ids = new Set<string>();
const stems = new Set<string>();
for (const question of COM004_ENGLISH_PRODUCTION_WAVE5_V1) {
  if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
  ids.add(question.questionId);
  const stem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
  if (stems.has(stem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
  stems.add(stem);
  if (question.stem.trim().length < 35) issues.push(`THIN_STEM:${question.questionId}`);
  if (question.explanation.trim().length < 70) issues.push(`THIN_EXPLANATION:${question.questionId}`);
  if (question.options.length !== 4 || new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) issues.push(`OPTION_SET:${question.questionId}`);
  if (question.correctIndex < 0 || question.correctIndex > 3 || question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER_POSITION:${question.questionId}`);
  if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE_ESCAPE:${question.questionId}`);
  if (qlAllocation) {
    if (question.authorityProposalId !== qlAllocation.authorityProposalId) issues.push(`AUTHORITY_DRIFT:${question.questionId}`);
    if (JSON.stringify(question.sourceCandidateIds) !== JSON.stringify(qlAllocation.sourceCandidateIds)) issues.push(`SOURCE_CANDIDATE_DRIFT:${question.questionId}`);
  }
  if (/\b(?:the correct (?:option|answer) is|answer is|obviously|clearly)\b/i.test(question.explanation)) issues.push(`GENERIC_EXPLANATION:${question.questionId}`);
  if (/\{\{|\}\}|\[placeholder\]|<placeholder>|todo\b|tbd\b/i.test(question.stem + " " + question.explanation)) issues.push(`TEMPLATE_JUNK:${question.questionId}`);
}

const openings = new Set(COM004_ENGLISH_PRODUCTION_WAVE5_V1.map((question) => question.stem.toLowerCase().replace(/[‘’'“”"():,.?`]/g, "").split(/\s+/).slice(0, 3).join(" ")));
if (openings.size < 8) issues.push(`MECHANICAL_STEM_OPENINGS:${openings.size}`);
if (new Set(COM004_ENGLISH_PRODUCTION_WAVE5_V1.map((question) => question.explanation.trim().toLowerCase())).size < 11) issues.push("EXPLANATION_DIVERSITY");
if (new Set(COM004_ENGLISH_PRODUCTION_WAVE5_V1.map((question) => question.surfaceFamily)).size < 4) issues.push("THIN_SURFACE_MIX");

const corpusText = COM004_ENGLISH_PRODUCTION_WAVE5_V1.map((question) => `${question.stem} ${question.explanation}`).join("\n");
if (!/HTTPS alone|does not.*legitimacy|not a legitimacy guarantee/i.test(corpusText)) issues.push("HTTPS_LEGITIMACY_LOCK_MISSING");
if (!/(password|PIN).*OTP|OTP.*(?:password|PIN)/i.test(corpusText)) issues.push("AUTH_SECRET_SECRECY_MISSING");
if (!/public Wi-Fi|open public Wi-Fi/i.test(corpusText)) issues.push("PUBLIC_WIFI_SAFETY_MISSING");
if (!/trusted personal device|trusted device/i.test(corpusText)) issues.push("TRUSTED_DEVICE_SAFETY_MISSING");
if (!/COM-006|dedicated security chapter/i.test(corpusText)) issues.push("SECURITY_CHAPTER_BOUNDARY_MISSING");
if (/\b(?:port\s*\d+|packet format|malware signature)\b/i.test(COM004_ENGLISH_PRODUCTION_WAVE5_V1.map((question) => question.explanation).join("\n"))) issues.push("SECURITY_NETWORKING_DEPTH_LEAK");

const governance = COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.governance;
for (const [key, value] of Object.entries(governance)) if (value !== false) issues.push(`PREMATURE_GOVERNANCE:${key}`);
if (COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.status !== "REVIEW_CANDIDATE_NOT_FROZEN") issues.push("PREMATURE_FREEZE");
if (COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.nextGate !== "COM004_ENGLISH_PRODUCTION_WAVE5_EDITORIAL_AUDIT") issues.push("NEXT_GATE_DRIFT");

if (issues.length) throw new Error(`COM-004 English Production Wave 5 V1 audit failed:\n${issues.join("\n")}`);
console.log(JSON.stringify({ checkpoint:"COM004_ENGLISH_PRODUCTION_WAVE5_V1_REVIEW_CANDIDATE", valid:true, qlCount:1, questionCount:12, uniqueStemCount:stems.size, httpsLegitimacyLock:true, authSecretSecrecy:true, securityBoundary:true, runtimeAuthorized:false, localizationAuthorized:false, questionBankWritesAuthorized:false, nextGate:COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1.nextGate }, null, 2));
