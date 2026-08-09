import { generateBlrCp001Question } from "./BLR-CP-001/cp001-runtime";
import { generateBlrCp002Question } from "./BLR-CP-002/cp002-runtime";
import { generateBlrCp003FinalApprovedBank } from "./BLR-CP-003/cp003-final-approved-bank";
import { generateBlrCp004FrozenBank } from "./BLR-CP-004/cp004-bank";
import { generateBlrCp005FrozenBank } from "./BLR-CP-005/cp005-bank";
import { generateBlrCp006FrozenBank } from "./BLR-CP-006/cp006-runtime";
import { generateBlrCp007FrozenBank } from "./BLR-CP-007/cp007-runtime";

export const BLR_001_ENGLISH_GAP_AUDIT_VERSION =
  "BLR_001_ENGLISH_GAP_AUDIT_V1" as const;

type UnknownRecord = Record<string, unknown>;

export interface Blr001QlContract {
  qlId: string;
  checkpointId: string;
  solveAuthority: string;
  ownership: string;
}

export const BLR_001_QL_CONTRACTS: readonly Blr001QlContract[] = [
  { qlId: "BLR-QL-001", checkpointId: "BLR-CP-001", solveAuthority: "RESOLVE_NAMED_PERSON_RELATION", ownership: "Resolve a direct, reverse or multi-edge named-person relation." },
  { qlId: "BLR-QL-002", checkpointId: "BLR-CP-001", solveAuthority: "IDENTIFY_PERSON_BY_RELATION", ownership: "Identify the unique person having a stated relation." },
  { qlId: "BLR-QL-003", checkpointId: "BLR-CP-001", solveAuthority: "IDENTIFY_PERSON_BY_GENDER", ownership: "Identify a person by clue-entailed gender." },
  { qlId: "BLR-QL-004", checkpointId: "BLR-CP-001", solveAuthority: "IDENTIFY_ORDERED_RELATION_PAIR", ownership: "Select an ordered pair satisfying a relation." },
  { qlId: "BLR-QL-005", checkpointId: "BLR-CP-001", solveAuthority: "SELECT_RELATION_CLAIM", ownership: "Select the supported named-person relation claim." },
  { qlId: "BLR-QL-006", checkpointId: "BLR-CP-001", solveAuthority: "COMPARE_GENERATIONS", ownership: "Compare generation positions in a named family graph." },
  { qlId: "BLR-QL-007", checkpointId: "BLR-CP-001", solveAuthority: "RESOLVE_EXACT_LINEAGE_RELATION", ownership: "Resolve an exact maternal or paternal lineage relation." },
  { qlId: "BLR-QL-008", checkpointId: "BLR-CP-002", solveAuthority: "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION", ownership: "Resolve pointer, photograph, portrait, conversation or nested self-reference chains." },
  { qlId: "BLR-QL-009", checkpointId: "BLR-CP-003", solveAuthority: "SELECT_UNORDERED_FAMILY_PAIR", ownership: "Select an unordered family pair from a shared passage." },
  { qlId: "BLR-QL-010", checkpointId: "BLR-CP-003", solveAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION", ownership: "Identify all passage members satisfying a relation." },
  { qlId: "BLR-QL-011", checkpointId: "BLR-CP-003", solveAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS", ownership: "Identify a passage member by married, unmarried or unresolved status." },
  { qlId: "BLR-QL-012", checkpointId: "BLR-CP-003", solveAuthority: "IDENTIFY_PERSON_BY_EXACT_LINEAGE", ownership: "Identify a passage member by exact lineage." },
  { qlId: "BLR-QL-013", checkpointId: "BLR-CP-004", solveAuthority: "COUNT_MEMBERS_BY_FILTER", ownership: "Count members matching a closed-universe filter." },
  { qlId: "BLR-QL-014", checkpointId: "BLR-CP-004", solveAuthority: "COUNT_RELATIVES_OF_REFERENCE", ownership: "Count relatives of a reference member." },
  { qlId: "BLR-QL-015", checkpointId: "BLR-CP-004", solveAuthority: "COUNT_RELATION_PAIRS", ownership: "Count unordered relation pairs." },
  { qlId: "BLR-QL-016", checkpointId: "BLR-CP-004", solveAuthority: "COUNT_GENERATIONS", ownership: "Count occupied generation rows." },
  { qlId: "BLR-QL-017", checkpointId: "BLR-CP-004", solveAuthority: "SELECT_FAMILY_COMPOSITION_PROFILE", ownership: "Select a complete family-composition vector." },
  { qlId: "BLR-QL-018", checkpointId: "BLR-CP-005", solveAuthority: "RESOLVE_INVARIANT_RELATION", ownership: "Resolve the exact or broad relation invariant across every valid model." },
  { qlId: "BLR-QL-019", checkpointId: "BLR-CP-005", solveAuthority: "RESOLVE_RELATION_UNCERTAINTY", ownership: "Resolve a one-of-two or indeterminate relation." },
  { qlId: "BLR-QL-020", checkpointId: "BLR-CP-005", solveAuthority: "SELECT_CLAIM_BY_MODEL_STATUS", ownership: "Select a definite, possible or impossible claim." },
  { qlId: "BLR-QL-021", checkpointId: "BLR-CP-005", solveAuthority: "IDENTIFY_PERSON_BY_MODEL_STATUS", ownership: "Identify a definite, possible or impossible person." },
  { qlId: "BLR-QL-022", checkpointId: "BLR-CP-005", solveAuthority: "RESOLVE_PERSON_IDENTITY_UNCERTAINTY", ownership: "Resolve one-of-two or indeterminate person identity." },
  { qlId: "BLR-QL-023", checkpointId: "BLR-CP-005", solveAuthority: "DETERMINE_COUNT_BOUND", ownership: "Determine a minimum or maximum count over all valid models." },
  { qlId: "BLR-QL-024", checkpointId: "BLR-CP-005", solveAuthority: "SELECT_COUNT_BY_MODEL_STATUS", ownership: "Select a possible or impossible count." },
  { qlId: "BLR-QL-025", checkpointId: "BLR-CP-005", solveAuthority: "RESOLVE_COUNT_DETERMINACY", ownership: "Resolve an exact or indeterminate count." },
  { qlId: "BLR-QL-026", checkpointId: "BLR-CP-006", solveAuthority: "RESOLVE_CODED_RELATION", ownership: "Decode supplied relation tokens and resolve a relation." },
  { qlId: "BLR-QL-027", checkpointId: "BLR-CP-006", solveAuthority: "IDENTIFY_PERSON_FROM_CODED_GRAPH", ownership: "Identify a person after decoding a coded graph." },
  { qlId: "BLR-QL-028", checkpointId: "BLR-CP-006", solveAuthority: "DETERMINE_GENDER_FROM_CODED_GRAPH", ownership: "Determine clue-entailed gender after decoding." },
  { qlId: "BLR-QL-029", checkpointId: "BLR-CP-006", solveAuthority: "SELECT_CODED_RELATION_PAIR", ownership: "Select a relation pair after decoding." },
  { qlId: "BLR-QL-030", checkpointId: "BLR-CP-006", solveAuthority: "RESOLVE_CODED_FAMILY_SET_RELATION", ownership: "Resolve a relation from a multi-statement coded family set." },
  { qlId: "BLR-QL-031", checkpointId: "BLR-CP-007", solveAuthority: "SELECT_CODED_EXPRESSION", ownership: "Select a complete coded expression for a required relation." },
  { qlId: "BLR-QL-032", checkpointId: "BLR-CP-007", solveAuthority: "COMPLETE_MISSING_CODE_TOKEN", ownership: "Complete one missing relation token." },
  { qlId: "BLR-QL-033", checkpointId: "BLR-CP-007", solveAuthority: "COMPLETE_ORDERED_CODE_TOKEN_PAIR", ownership: "Complete an ordered pair of relation tokens." },
  { qlId: "BLR-QL-034", checkpointId: "BLR-CP-007", solveAuthority: "COMPLETE_MISSING_PERSON", ownership: "Complete a missing person operand in a coded expression." },
  { qlId: "BLR-QL-035", checkpointId: "BLR-CP-007", solveAuthority: "SELECT_CODED_STATEMENT_BY_VALIDITY", ownership: "Select a valid or invalid coded statement." },
] as const;

export const BLR_001_SCOPE_COVERAGE = [
  { family: "direct and reverse named-person relations", status: "COVERED", owners: ["BLR-QL-001", "BLR-QL-002", "BLR-QL-005"] },
  { family: "multi-edge, exact lineage and generation questions", status: "COVERED", owners: ["BLR-QL-001", "BLR-QL-006", "BLR-QL-007"] },
  { family: "pointer, photograph, portrait and conversation chains", status: "COVERED", owners: ["BLR-QL-008"] },
  { family: "shared family passages, pair, identity and marital-status questions", status: "COVERED", owners: ["BLR-QL-009", "BLR-QL-010", "BLR-QL-011", "BLR-QL-012"] },
  { family: "closed-universe counts and family composition", status: "COVERED", owners: ["BLR-QL-013", "BLR-QL-014", "BLR-QL-015", "BLR-QL-016", "BLR-QL-017"] },
  { family: "definite, possible, impossible and indeterminate semantics", status: "COVERED", owners: ["BLR-QL-018", "BLR-QL-019", "BLR-QL-020", "BLR-QL-021", "BLR-QL-022", "BLR-QL-023", "BLR-QL-024", "BLR-QL-025"] },
  { family: "coded-relation decoding", status: "COVERED", owners: ["BLR-QL-026", "BLR-QL-027", "BLR-QL-028", "BLR-QL-029", "BLR-QL-030"] },
  { family: "coded-expression selection, completion and validation", status: "COVERED", owners: ["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"] },
  { family: "Data Sufficiency answer contracts", status: "OUT_OF_SCOPE", owners: [] },
  { family: "profession, city, colour, floor, schedule or seating-led family puzzles", status: "OUT_OF_SCOPE", owners: [] },
  { family: "age arithmetic, inheritance law and genetic pedigrees", status: "OUT_OF_SCOPE", owners: [] },
  { family: "step, half, adoptive and foster relations in V1", status: "OUT_OF_SCOPE", owners: [] },
] as const;

export interface NormalizedBlr001AuditQuestion {
  checkpointId: string;
  qlId: string;
  solveAuthority: string;
  itemId: string;
  seed: number | null;
  stem: string;
  sharedPrompt: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  learnerText: string;
  semanticFingerprint: string;
  raw: UnknownRecord;
}

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? value as UnknownRecord : {};
}

function textField(value: UnknownRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string") return candidate;
  }
  return "";
}

function booleanField(value: UnknownRecord, key: string): boolean | undefined {
  return typeof value[key] === "boolean" ? value[key] as boolean : undefined;
}

function numberField(value: UnknownRecord, key: string): number | undefined {
  return typeof value[key] === "number" ? value[key] as number : undefined;
}

function stringLeaves(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => stringLeaves(entry, output));
  else if (value && typeof value === "object") Object.values(value as UnknownRecord).forEach((entry) => stringLeaves(entry, output));
  return output;
}

function optionText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  const entry = record(value);
  return textField(entry, ["text", "value", "optionValue", "label", "answer"]);
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function simpleHash(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function checkpointForQl(qlId: string): string {
  return BLR_001_QL_CONTRACTS.find((entry) => entry.qlId === qlId)?.checkpointId ?? "UNKNOWN";
}

function normalizeQuestion(value: unknown): NormalizedBlr001AuditQuestion {
  const raw = record(value);
  const metadata = record(raw.metadata);
  const qlId = textField(raw, ["qlId", "permanentQlId"]);
  const checkpointId = textField(raw, ["checkpointId"]) || checkpointForQl(qlId);
  const solveAuthority = textField(raw, ["solveAuthority", "finalAuthority"]) || textField(metadata, ["solveAuthority"]);
  const stem = textField(raw, ["stem", "question"]);
  const sharedPrompt = textField(raw, ["sharedPrompt", "passage", "prompt"]);
  const optionValues = Array.isArray(raw.options) ? raw.options : [];
  const options = optionValues.map(optionText);
  const correctIndex = numberField(raw, "correctIndex") ?? optionValues.findIndex((entry) => booleanField(record(entry), "isCorrect") === true);
  const answer = textField(raw, ["answer", "correctAnswer"]) || options[correctIndex] || "";
  const itemId = textField(raw, ["itemId", "questionId", "id"]) || `${checkpointId}-${qlId}-${simpleHash(`${sharedPrompt}\n${stem}\n${options.join("¦")}`)}`;
  const fingerprint = textField(metadata, ["semanticFingerprint", "runtimeSemanticFingerprint", "hiddenFingerprint"]) || simpleHash(`${qlId}¦${sharedPrompt}¦${stem}¦${options.join("¦")}¦${correctIndex}`);
  const explanationText = stringLeaves(raw.explanation).join("\n");
  return {
    checkpointId,
    qlId,
    solveAuthority,
    itemId,
    seed: numberField(raw, "seed") ?? numberField(metadata, "sourceSeed") ?? null,
    stem,
    sharedPrompt,
    options,
    correctIndex,
    answer,
    learnerText: [sharedPrompt, stem, ...options, explanationText].filter(Boolean).join("\n"),
    semanticFingerprint: fingerprint,
    raw,
  };
}

function buildQuestionCorpus(): readonly NormalizedBlr001AuditQuestion[] {
  const questions: unknown[] = [];
  const cp001Qls = BLR_001_QL_CONTRACTS.filter((entry) => entry.checkpointId === "BLR-CP-001").map((entry) => entry.qlId);
  for (const qlId of cp001Qls) {
    for (let seed = 0; seed < 64; seed += 1) questions.push(generateBlrCp001Question(qlId as never, seed));
  }
  for (let seed = 0; seed < 96; seed += 1) questions.push(generateBlrCp002Question("BLR-QL-008", seed));
  questions.push(...generateBlrCp003FinalApprovedBank());
  questions.push(...generateBlrCp004FrozenBank());
  questions.push(...generateBlrCp005FrozenBank());
  questions.push(...generateBlrCp006FrozenBank());
  questions.push(...generateBlrCp007FrozenBank());
  return questions.map(normalizeQuestion);
}

const FORBIDDEN_LEARNER_PATTERNS: readonly { code: string; pattern: RegExp }[] = [
  { code: "UNSTATED_GENDER_SPOONFEEDING", pattern: /\bgender\b.{0,45}\b(?:not stated|not given|not specified|unstated)\b/i },
  { code: "NAME_GENDER_STEREOTYPE", pattern: /\b(?:name suggests|name indicates|traditionally (?:male|female) name|commonly (?:a )?(?:male|female) name|because of (?:the )?name)\b/i },
  { code: "INTERNAL_RUNTIME_LEAK", pattern: /\b(?:semanticFingerprint|sourcePrototypeId|runtimeVersion|prototypeOnly)\b/i },
  { code: "BROKEN_RENDER_VALUE", pattern: /(?:\[object Object\]|\bundefined\b|\bNaN\b)/i },
];

const GENDERED_ANSWERS = new Set([
  "father", "mother", "son", "daughter", "brother", "sister", "husband", "wife",
  "grandfather", "grandmother", "grandson", "granddaughter", "great-grandfather", "great-grandmother",
  "great-grandson", "great-granddaughter", "uncle", "aunt", "nephew", "niece", "father-in-law",
  "mother-in-law", "son-in-law", "daughter-in-law", "brother-in-law", "sister-in-law", "male", "female",
]);
const EXPLICIT_GENDER_EVIDENCE = /\b(?:father|mother|son|daughter|brother|sister|husband|wife|grandfather|grandmother|grandson|granddaughter|uncle|aunt|nephew|niece|man|woman|male|female)\b/i;

function templateKey(question: NormalizedBlr001AuditQuestion): string {
  return normalizeWhitespace(`${question.sharedPrompt}\n${question.stem}\n${question.options.join("¦")}`)
    .replace(/\b[A-Z][a-z]{2,}\b/g, "<NAME>")
    .replace(/\b[A-Z]\b/g, "<PERSON>")
    .replace(/\b\d+\b/g, "<NUMBER>")
    .toLocaleLowerCase("en-IN");
}

function topLevelLockFailures(question: NormalizedBlr001AuditQuestion): string[] {
  const failures: string[] = [];
  const expectedFalse = ["publiclyPublishable", "questionStudioVisible", "questionBankEligible", "mockTestEligible"];
  for (const key of expectedFalse) {
    const actual = booleanField(question.raw, key);
    if (actual === true) failures.push(`${question.itemId}: ${key} unexpectedly true`);
  }
  const prototypeOnly = booleanField(question.raw, "prototypeOnly");
  if (prototypeOnly === true) failures.push(`${question.itemId}: permanent corpus contains prototype-only record`);
  const reviewOnly = booleanField(question.raw, "reviewOnly");
  if (reviewOnly === false) failures.push(`${question.itemId}: reviewOnly unexpectedly false`);
  return failures;
}

export interface Blr001EnglishGapAuditResult {
  auditVersion: typeof BLR_001_ENGLISH_GAP_AUDIT_VERSION;
  permanentQlRange: "BLR-QL-001..BLR-QL-035";
  nextAvailableQlId: "BLR-QL-036";
  plannedCheckpointCount: 7;
  permanentQlCount: number;
  solveAuthorityCount: number;
  auditedQuestionCount: number;
  checkpointQuestionCounts: Readonly<Record<string, number>>;
  qlQuestionCounts: Readonly<Record<string, number>>;
  exactCrossQlSurfaceCollisions: number;
  normalizedCrossQlTemplateCollisions: number;
  learnerTextFailures: number;
  genderEvidenceFailures: number;
  optionContractFailures: number;
  lifecycleLockFailures: number;
  ownershipFailures: number;
  openIncludedScopeFamilies: number;
  failures: readonly string[];
  templateCollisionExamples: readonly string[];
  reviewSamples: readonly NormalizedBlr001AuditQuestion[];
  verdict: "CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE" | "REMEDIATION_REQUIRED";
}

export function buildBlr001EnglishGapAudit(): Blr001EnglishGapAuditResult {
  const failures: string[] = [];
  const questions = buildQuestionCorpus();
  const contractMap = new Map(BLR_001_QL_CONTRACTS.map((entry) => [entry.qlId, entry]));

  const expectedQlIds = Array.from({ length: 35 }, (_, index) => `BLR-QL-${String(index + 1).padStart(3, "0")}`);
  const actualContractQlIds = BLR_001_QL_CONTRACTS.map((entry) => entry.qlId);
  if (JSON.stringify(actualContractQlIds) !== JSON.stringify(expectedQlIds)) failures.push("Permanent QL inventory is not contiguous BLR-QL-001..035.");
  if (new Set(BLR_001_QL_CONTRACTS.map((entry) => entry.solveAuthority)).size !== 35) failures.push("Two permanent QLs share one solve-authority identifier.");

  const qlCounts: Record<string, number> = {};
  const checkpointCounts: Record<string, number> = {};
  const exactSurfaces = new Map<string, Set<string>>();
  const templateSurfaces = new Map<string, Set<string>>();
  const learnerFailures: string[] = [];
  const genderFailures: string[] = [];
  const optionFailures: string[] = [];
  const lockFailures: string[] = [];
  const ownershipFailures: string[] = [];

  for (const question of questions) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    checkpointCounts[question.checkpointId] = (checkpointCounts[question.checkpointId] ?? 0) + 1;
    const contract = contractMap.get(question.qlId);
    if (!contract) ownershipFailures.push(`${question.itemId}: unknown permanent QL ${question.qlId}`);
    else {
      if (contract.checkpointId !== question.checkpointId) ownershipFailures.push(`${question.itemId}: checkpoint ${question.checkpointId} does not own ${question.qlId}`);
      if (contract.solveAuthority !== question.solveAuthority) ownershipFailures.push(`${question.itemId}: authority ${question.solveAuthority} does not match ${contract.solveAuthority}`);
    }

    if (!question.stem) learnerFailures.push(`${question.itemId}: empty stem`);
    for (const forbidden of FORBIDDEN_LEARNER_PATTERNS) {
      if (forbidden.pattern.test(question.learnerText)) learnerFailures.push(`${question.itemId}: ${forbidden.code}`);
    }

    if (question.options.length !== 4) optionFailures.push(`${question.itemId}: expected 4 options, got ${question.options.length}`);
    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) optionFailures.push(`${question.itemId}: invalid correct index ${question.correctIndex}`);
    if (new Set(question.options.map((entry) => normalizeWhitespace(entry).toLocaleLowerCase("en-IN"))).size !== question.options.length) optionFailures.push(`${question.itemId}: duplicate displayed options`);
    const flagged = Array.isArray(question.raw.options)
      ? question.raw.options.filter((entry) => booleanField(record(entry), "isCorrect") === true).length
      : 0;
    if (flagged > 0 && flagged !== 1) optionFailures.push(`${question.itemId}: ${flagged} options flagged correct`);
    if (question.answer && question.options[question.correctIndex] && normalizeWhitespace(question.answer) !== normalizeWhitespace(question.options[question.correctIndex]!)) {
      optionFailures.push(`${question.itemId}: answer/correct-index mismatch`);
    }

    if (GENDERED_ANSWERS.has(normalizeWhitespace(question.answer).toLocaleLowerCase("en-IN")) && !EXPLICIT_GENDER_EVIDENCE.test(`${question.sharedPrompt}\n${question.stem}`)) {
      genderFailures.push(`${question.itemId}: gendered answer lacks an explicit learner-visible gender-bearing clue`);
    }

    lockFailures.push(...topLevelLockFailures(question));

    const exactKey = normalizeWhitespace(`${question.sharedPrompt}\n${question.stem}\n${question.options.join("¦")}`).toLocaleLowerCase("en-IN");
    const exactQls = exactSurfaces.get(exactKey) ?? new Set<string>();
    exactQls.add(question.qlId);
    exactSurfaces.set(exactKey, exactQls);
    const normalizedKey = templateKey(question);
    const templateQls = templateSurfaces.get(normalizedKey) ?? new Set<string>();
    templateQls.add(question.qlId);
    templateSurfaces.set(normalizedKey, templateQls);
  }

  for (const qlId of expectedQlIds) if (!qlCounts[qlId]) ownershipFailures.push(`${qlId}: no audited runtime question`);

  const exactCollisions = [...exactSurfaces.values()].filter((qls) => qls.size > 1);
  const templateCollisions = [...templateSurfaces.entries()].filter(([, qls]) => qls.size > 1);
  if (exactCollisions.length) failures.push(`${exactCollisions.length} exact learner surfaces cross permanent QL boundaries.`);

  const openIncludedScope = BLR_001_SCOPE_COVERAGE.filter((entry) => entry.status !== "OUT_OF_SCOPE" && entry.status !== "COVERED");
  if (openIncludedScope.length) failures.push(`${openIncludedScope.length} included source families remain open.`);

  failures.push(...learnerFailures, ...genderFailures, ...optionFailures, ...lockFailures, ...ownershipFailures);

  const reviewSamples = BLR_001_QL_CONTRACTS.flatMap((contract) =>
    questions.filter((question) => question.qlId === contract.qlId).slice(0, 2)
  );

  return {
    auditVersion: BLR_001_ENGLISH_GAP_AUDIT_VERSION,
    permanentQlRange: "BLR-QL-001..BLR-QL-035",
    nextAvailableQlId: "BLR-QL-036",
    plannedCheckpointCount: 7,
    permanentQlCount: BLR_001_QL_CONTRACTS.length,
    solveAuthorityCount: new Set(BLR_001_QL_CONTRACTS.map((entry) => entry.solveAuthority)).size,
    auditedQuestionCount: questions.length,
    checkpointQuestionCounts: checkpointCounts,
    qlQuestionCounts: qlCounts,
    exactCrossQlSurfaceCollisions: exactCollisions.length,
    normalizedCrossQlTemplateCollisions: templateCollisions.length,
    learnerTextFailures: learnerFailures.length,
    genderEvidenceFailures: genderFailures.length,
    optionContractFailures: optionFailures.length,
    lifecycleLockFailures: lockFailures.length,
    ownershipFailures: ownershipFailures.length,
    openIncludedScopeFamilies: openIncludedScope.length,
    failures,
    templateCollisionExamples: templateCollisions.slice(0, 20).map(([, qls]) => [...qls].sort().join(" ↔ ")),
    reviewSamples,
    verdict: failures.length ? "REMEDIATION_REQUIRED" : "CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE",
  };
}
