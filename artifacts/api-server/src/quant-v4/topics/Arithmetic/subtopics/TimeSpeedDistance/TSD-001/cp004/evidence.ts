import { TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD, TSD_CP003_HI_PA_FREEZE_ID, TSD_CP003_HI_PA_FREEZE_STATUS } from "../cp003/localization/native-approved-freeze";
import { TSD_CP004_PERMANENT_QL_IDS, TSD_CP004_NEXT_PERMANENT_QL_ID } from "./ql-allocation";
import { TSD_CP004_REVIEW_AUTHORITIES } from "./generator";
import { generateCp004AuditPool, generateCp004ReviewQuestions } from "./runtime-engine";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function structuralClass(row: { representation: string; input: { directionCase?: string } }): string {
  const raw = Number(row.representation.split(":").at(-1) ?? "0");
  const variant = Number.isInteger(raw) ? ((raw % 6) + 6) % 6 : 0;
  const structure = ["DIRECT", "OBSERVATION", "CHECKPOINT", "RECONSTRUCTION", "DIRECT", "OBSERVATION"][variant]!;
  return `${structure}${row.input.directionCase ? `:${row.input.directionCase}` : ""}`;
}

function wrongPaths(row: (typeof audit)[number]): readonly string[] {
  return row.internalOptionAudit
    .filter((entry) => !entry.isCorrect && entry.wrongWorking)
    .map((entry) => `${entry.wrongWorking!.misconceptionId}|${entry.wrongWorking!.calculation.trim().toLowerCase()}`);
}

const audit = generateCp004AuditPool(40);
const selected = generateCp004ReviewQuestions(6);

assert(TSD_CP004_REVIEW_AUTHORITIES.length === 10, "expected ten CP004 learner authorities");
assert(TSD_CP004_PERMANENT_QL_IDS.length === 10, "expected ten CP004 permanent QLs");
assert(TSD_CP004_PERMANENT_QL_IDS[0] === "TSD-QL-048", "CP004 must start at TSD-QL-048");
assert(TSD_CP004_PERMANENT_QL_IDS[9] === "TSD-QL-057", "CP004 must end current allocation at TSD-QL-057");
assert(TSD_CP004_NEXT_PERMANENT_QL_ID === "TSD-QL-058", "next QL must remain TSD-QL-058");
assert(audit.length === 400, `expected 400 audit questions, received ${audit.length}`);
assert(selected.length === 60, `expected 60 selected questions, received ${selected.length}`);
assert(audit.every((row) => row.validation.valid), "audit contains invalid generated question");
assert(selected.every((row) => row.validation.valid), "selection contains invalid generated question");
assert(new Set(selected.map((row) => row.stem)).size === selected.length, "selected stems are not globally unique");
assert(new Set(selected.map((row) => row.mathematicalFingerprint)).size === selected.length, "selected mathematical fingerprints are not globally unique");
assert(new Set(selected.map((row) => row.solveMode)).size === 23, `selection must cover all 23 executable core/clock modes, covered ${new Set(selected.map((row) => row.solveMode)).size}`);
assert(new Set(selected.map((row) => row.permanentQlId)).size === 10, "selection must cover all ten permanent QLs");

for (const ql of TSD_CP004_PERMANENT_QL_IDS) {
  const qlRows = selected.filter((row) => row.permanentQlId === ql);
  assert(qlRows.length === 6, `${ql}: expected six selected questions`);
  const structures = qlRows.map(structuralClass);
  assert(new Set(structures).size >= 4, `${ql}: fewer than four structural stem classes in the six-question review set (${structures.join(", ")})`);
  const counts = [...new Set(structures)].map((key) => structures.filter((value) => value === key).length);
  assert(Math.max(...counts) <= 2, `${ql}: one stem structure appears more than twice in the six-question review set`);
}

for (const authority of TSD_CP004_REVIEW_AUTHORITIES) {
  const authorityRows = audit.filter((row) => row.authorityKey === authority.authorityKey);
  assert(authorityRows.length === 40, `${authority.authorityKey}: expected 40 audit questions`);
  assert(new Set(authorityRows.map((row) => row.mathematicalFingerprint)).size >= 20, `${authority.authorityKey}: mathematical state diversity is too narrow`);
}

assert(selected.every((row) => (row.explanation as unknown as Record<string, unknown>).optionAnalysis === undefined), "option analysis leaked into public explanation");
assert(selected.every((row) => row.explanation.steps.some((step) => step.includes("="))), "selected explanation lacks connected numerical working");
assert(selected.every((row) => row.internalOptionAudit.filter((entry) => !entry.isCorrect && entry.applicability === "EXACT_METHOD").length === 3), "every selected question must have three exact-method wrong workings");
assert(audit.every((row) => row.internalOptionAudit.filter((entry) => !entry.isCorrect).length === 3), "audit question missing three distractors");
assert(audit.every((row) => new Set(wrongPaths(row)).size === 3), "audit question does not contain three distinct misconception paths");
assert(audit.every((row) => row.internalOptionAudit.every((entry) => entry.isCorrect || !entry.wrongWorking || !/scaled|alter final arithmetic|answer ×|answer ÷/i.test(entry.wrongWorking.calculation))), "generic arithmetic filler leaked into distractors");

const ratioRows = audit.filter((row) => row.solveMode === "findSpeedRatioFromMeetingPoint");
assert(ratioRows.length > 0, "ratio-from-meeting-point mode missing from audit");
assert(ratioRows.every((row) => row.internalOptionAudit.some((entry) => !entry.isCorrect && entry.misconceptionId === "REVERSE_MEETING_RATIO")), "ratio questions must retain the reversed-ratio misconception");
assert(ratioRows.every((row) => row.internalOptionAudit.some((entry) => !entry.isCorrect && entry.misconceptionId === "ASSUME_MIDPOINT")), "ratio questions must retain the 1:1 midpoint misconception");

assert(audit.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "downstream lifecycle lock violated");

const positions = [0, 1, 2, 3].map((position) => audit.filter((row) => row.correctIndex === position).length);
assert(positions.every((count) => count > 70), `correct-option balance too weak: ${positions.join(",")}`);

const difficulty = {
  EASY: selected.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: selected.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: selected.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 18 && difficulty.MEDIUM === 30 && difficulty.HARD === 12, `unexpected difficulty mix ${JSON.stringify(difficulty)}`);

const wrongWorkingCount = audit.reduce((total, row) => total + row.internalOptionAudit.filter((entry) => !entry.isCorrect).length, 0);
assert(wrongWorkingCount === 1200, `expected 1200 exact wrong workings, received ${wrongWorkingCount}`);
assert(TSD_CP003_HI_PA_FREEZE_STATUS === "APPROVED_NATIVE_FROZEN", "CP003 multilingual freeze status changed");
assert(TSD_CP003_HI_PA_FREEZE_ID === "TSD-CP-003-HI-PA-v1-frozen", "CP003 freeze ID changed");
assert(TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD === "49965e649a7f688c2dd9f3ca5a2c909dc0240423", "CP003 approved source head changed");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_ENGLISH_CANDIDATE_V2_EDITORIAL",
  permanentQlRange: "TSD-QL-048..TSD-QL-057",
  nextPermanentQl: TSD_CP004_NEXT_PERMANENT_QL_ID,
  learnerAuthorities: TSD_CP004_REVIEW_AUTHORITIES.length,
  executableModesCovered: new Set(selected.map((row) => row.solveMode)).size,
  auditQuestions: audit.length,
  selectedQuestions: selected.length,
  questionsPerAuthority: 6,
  minimumStructuralClassesPerQl: Math.min(...TSD_CP004_PERMANENT_QL_IDS.map((ql) => new Set(selected.filter((row) => row.permanentQlId === ql).map(structuralClass)).size)),
  minimumMathematicalFingerprintsPerAuthority: Math.min(...TSD_CP004_REVIEW_AUTHORITIES.map((authority) => new Set(audit.filter((row) => row.authorityKey === authority.authorityKey).map((row) => row.mathematicalFingerprint)).size)),
  exactWrongWorkings: wrongWorkingCount,
  distractorContract: "THREE_DISTINCT_SEMANTIC_PATHS_UNIT_SPECIFIC_SELECTION",
  ratioReversalPreserved: true,
  correctOptionPositions: positions,
  difficulty,
  publicExplanationContract: "METHOD_CONNECTED_NUMERIC_STEPS_SHORTCUT_ANSWER",
  optionAnalysisPublic: false,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  cp003MultilingualFreeze: TSD_CP003_HI_PA_FREEZE_STATUS,
  cp003FreezeId: TSD_CP003_HI_PA_FREEZE_ID,
  cp003ApprovedSourceHead: TSD_CP003_HI_PA_APPROVED_SOURCE_HEAD,
}, null, 2));
