import assert from "node:assert/strict";
import {
  auditDsfEditorialBatch,
  normalizeDsfEditorialSurface,
  type DsfEditorialAuditRecord,
} from "./editorial-near-duplicate-audit.ts";

const entities = ["Aman", "Bina", "Charan", "Diya", "Ravi", "Neha"] as const;

assert.equal(
  normalizeDsfEditorialSurface("Aman scored 72% and paid ₹450.", entities),
  normalizeDsfEditorialSurface("Ravi scored 61% and paid ₹900.", entities),
  "numeric and caller-declared entity changes should collapse to one perceptual surface",
);
assert.notEqual(
  normalizeDsfEditorialSurface("Aman is greater than Bina.", entities),
  normalizeDsfEditorialSurface("Aman is less than Bina.", entities),
  "directional/comparison semantics must survive normalization",
);

const numericVariants: readonly DsfEditorialAuditRecord[] = [
  {
    id: "NUM-1",
    stem: "Aman scored 72 marks in a test. What is his final score?",
    statementI: "Aman received 12 bonus marks.",
    statementII: "Aman lost 5 marks due to a penalty.",
    solveModeId: "SCORE",
  },
  {
    id: "NUM-2",
    stem: "Ravi scored 84 marks in a test. What is his final score?",
    statementI: "Ravi received 18 bonus marks.",
    statementII: "Ravi lost 7 marks due to a penalty.",
    solveModeId: "SCORE",
  },
];
const numericAudit = auditDsfEditorialBatch(numericVariants, { entityLexicon: entities });
assert.equal(numericAudit.normalizedDuplicateGroups.length, 1, "number/name-only variants must be caught as normalized duplicates");
assert.equal(numericAudit.passed, false);

const swappedStatements: readonly DsfEditorialAuditRecord[] = [
  {
    id: "SWAP-1",
    stem: "Five people sit in one row. Who is in the middle?",
    statementI: "Aman sits immediately left of Bina.",
    statementII: "Charan sits at the right end.",
    solveModeId: "MIDDLE",
  },
  {
    id: "SWAP-2",
    stem: "Five people sit in one row. Who is in the middle?",
    statementI: "Charan sits at the right end.",
    statementII: "Aman sits immediately left of Bina.",
    solveModeId: "MIDDLE",
  },
];
const swapAudit = auditDsfEditorialBatch(swappedStatements, { entityLexicon: entities });
assert.equal(swapAudit.statementSwapGroups.length, 1, "I/II reversal must be caught even when the ordered surfaces differ");
assert.equal(swapAudit.normalizedDuplicateGroups.length, 0, "a pure I/II swap is not an ordered exact duplicate");

const nearParaphrases: readonly DsfEditorialAuditRecord[] = [
  {
    id: "NEAR-1",
    stem: "Five trainees are seated in a straight row. Determine the person occupying the middle seat.",
    statementI: "Aman sits immediately to the left of Bina.",
    statementII: "Charan occupies one of the end seats.",
    solveModeId: "MIDDLE",
  },
  {
    id: "NEAR-2",
    stem: "Five trainees sit in one straight row. Find who occupies the middle position.",
    statementI: "Aman is immediately left of Bina.",
    statementII: "Charan is seated at an end.",
    solveModeId: "MIDDLE",
  },
  {
    id: "FAR-1",
    stem: "A code maps four letters to four distinct digits. Which letter is represented by digit 1?",
    statementI: "P is coded as 3.",
    statementII: "Q is coded as 4.",
    solveModeId: "DECODE",
  },
];
const nearAudit = auditDsfEditorialBatch(nearParaphrases, {
  entityLexicon: entities,
  nearDuplicateThreshold: 0.5,
  minimumSharedTokens: 2,
});
assert(nearAudit.nearDuplicatePairs.some((pair) => new Set([pair.leftId, pair.rightId]).has("NEAR-1") && new Set([pair.leftId, pair.rightId]).has("NEAR-2")), "high-overlap paraphrases should be surfaced");
assert(!nearAudit.nearDuplicatePairs.some((pair) => pair.leftId === "FAR-1" || pair.rightId === "FAR-1"), "unrelated solve-mode content should not be pulled into the default within-mode near-duplicate comparison");

const concentrationRecords: readonly DsfEditorialAuditRecord[] = Array.from({ length: 10 }, (_, index) => ({
  id: `OBJ-${index}`,
  stem: `Question family ${index} asks about a distinct target word ${String.fromCharCode(97 + index)}.`,
  statementI: `Statement alpha ${index} uses clue word ${String.fromCharCode(107 + index)}.`,
  statementII: `Statement beta ${index} uses another clue word ${String.fromCharCode(117 + index)}.`,
  explanation: `Opening ${index} explains this case with a different proof route.`,
  solveModeId: `MODE-${index}`,
  contextId: `CTX-${index % 5}`,
  objectKey: index < 6 ? "OVERUSED_OBJECT" : `OBJKEY-${index}`,
  structuralFingerprint: `STRUCT-${index}`,
}));
const concentrationAudit = auditDsfEditorialBatch(concentrationRecords, {
  nearDuplicateThreshold: 0.95,
  minimumSharedTokens: 5,
  minimumContextCount: 5,
  minimumObjectCount: 5,
  maximumObjectShare: 0.5,
  maximumStructuralCluster: 2,
  maximumExplanationOpeningCluster: 2,
});
assert(concentrationAudit.violations.some((violation) => violation.includes("Largest object share")), "object-pool concentration must be enforceable");

const cleanRecords: readonly DsfEditorialAuditRecord[] = [
  {
    id: "CLEAN-1",
    stem: "A river boat problem asks for the upstream travel time.",
    statementI: "The still-water speed is known exactly.",
    statementII: "The stream speed and distance are both specified.",
    explanation: "Use relative speed first, then divide the distance by that speed.",
    solveModeId: "BOAT",
    contextId: "RIVER",
    objectKey: "BOAT-A",
    structuralFingerprint: "S1",
  },
  {
    id: "CLEAN-2",
    stem: "A square pyramid problem asks for its volume.",
    statementI: "The base side is fixed.",
    statementII: "The vertical height is fixed.",
    explanation: "Identify the base area and combine it with the perpendicular height.",
    solveModeId: "PYRAMID",
    contextId: "MODEL",
    objectKey: "PYRAMID-A",
    structuralFingerprint: "S2",
  },
  {
    id: "CLEAN-3",
    stem: "A ranking problem asks for the total number of candidates.",
    statementI: "The rank from the top is given.",
    statementII: "The rank from the bottom is given.",
    explanation: "Combine the two end ranks and remove the duplicated candidate.",
    solveModeId: "RANK",
    contextId: "EXAM",
    objectKey: "RANK-A",
    structuralFingerprint: "S3",
  },
  {
    id: "CLEAN-4",
    stem: "A calendar problem asks for the weekday after a forward shift.",
    statementI: "The starting weekday is specified.",
    statementII: "The day-count remainder modulo seven is specified.",
    explanation: "Reduce the movement modulo seven and shift from the known weekday.",
    solveModeId: "CALENDAR",
    contextId: "DATE",
    objectKey: "CAL-A",
    structuralFingerprint: "S4",
  },
];
const cleanAudit = auditDsfEditorialBatch(cleanRecords, {
  nearDuplicateThreshold: 0.82,
  minimumSharedTokens: 4,
  minimumContextCount: 4,
  minimumObjectCount: 4,
  maximumObjectShare: 0.3,
  maximumStructuralCluster: 1,
  maximumExplanationOpeningCluster: 1,
});
assert.deepEqual(cleanAudit.violations, []);
assert.equal(cleanAudit.passed, true);

console.log(JSON.stringify({
  status: "PASS_DSF_CP014_EDITORIAL_NEAR_DUPLICATE_FOUNDATION",
  numericDuplicateGroups: numericAudit.normalizedDuplicateGroups.length,
  swapDuplicateGroups: swapAudit.statementSwapGroups.length,
  nearDuplicatePairs: nearAudit.nearDuplicatePairs.length,
  concentrationViolations: concentrationAudit.violations,
  cleanPassed: cleanAudit.passed,
}, null, 2));
