import { add, rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp012ExecutableCases } from "./executable-cases";
import { generateTsdCp012SourceExtensionCases, verifyTsdCp012SourceExtension } from "./source-executable-extensions";
import { TSD_CP012_SOURCE_CANDIDATES } from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 source executable coverage proof failed: ${message}`);
}

const requiredTargetsBySource = Object.freeze({
  "CP012-INV-001": ["TOTAL_DISTANCE"],
  "CP012-INV-002": ["TOTAL_TIME"],
  "CP012-INV-003": ["UNKNOWN_FINAL_SPEED"],
  "CP012-INV-004": ["TOTAL_DISTANCE"],
  "CP012-INV-005": ["TOTAL_TIME"],
  "CP012-INV-006": ["PERIODIC_DISTANCE"],
  "CP012-INV-007": ["EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE"],
  "CP012-INV-008": ["COMPLETION_TIME", "REST_COUNT", "REST_DURATION"],
  "CP012-INV-009": ["DISTANCE_REMAINING_AFTER_STAGES"],
  "CP012-INV-010": ["REQUIRED_FINAL_SPEED"],
  "CP012-INV-011": ["REQUIRED_FINAL_TIME"],
  "CP012-INV-012": ["STAGE_BOUNDARY_DISTANCE"],
  "CP012-INV-013": ["REQUIRED_FINAL_SPEED", "REQUIRED_FINAL_TIME", "STAGE_BOUNDARY_DISTANCE", "MAXIMUM_DELAY"],
  "CP012-INV-014": ["TOTAL_TIME"],
  "CP012-INV-015": ["TOTAL_TIME"],
  "CP012-INV-016": ["CLOSED_ROUTE_OPPOSITE_MEETING_TIME"],
  "CP012-INV-017": ["TOTAL_TIME"],
  "CP012-INV-018": ["DISTANCE_SPLIT_A"],
  "CP012-INV-019": ["FASTEST_ROUTE_INDEX"],
  "CP012-INV-020": ["REQUIRED_FINAL_SPEED", "MINIMUM_SPEED"],
  "CP012-INV-021": ["MAXIMUM_DELAY"],
  "CP012-INV-022": ["MISSING_STAGE_DISTANCE"],
  "CP012-INV-023": ["MISSING_DISTANCE", "MISSING_TIME", "MISSING_SPEED", "MISSING_STAGE_DISTANCE"],
  "CP012-INV-024": ["MISSING_DISTANCE", "MISSING_TIME"],
  "CP012-INV-025": ["MISSING_SPEED"],
  "CP012-INV-026": ["MISSING_STAGE_DISTANCE"],
  "CP012-INV-027": ["MISSING_STAGE_DISTANCE"],
  "CP012-INV-028": ["MEETING_TIME_FROM_FIRST_DEPARTURE", "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE", "DELAY_B"],
  "CP012-INV-029": ["RAFT_CATCH_TIME_FROM_RAFT_START", "RAFT_CATCH_DISTANCE_FROM_START", "CURRENT_SPEED", "DROPPED_OBJECT_RECOVERY_DISTANCE"],
  "CP012-INV-030": ["TRACK_GAP_AT_FASTER_FINISH", "HEAD_START_FOR_DEAD_HEAT", "FIRST_OVERTAKE_TIME"],
  "CP012-INV-031": ["TIME_WITH_STOP_AFTER", "TIME_WITH_DELAYED_ACTIVATION", "UNKNOWN_ACTIVE_TIME_BEFORE_STOP"],
  "CP012-INV-032": ["X", "Y"],
  "CP012-INV-033": ["MINIMUM_SPEED"],
  "CP012-INV-034": ["MAXIMUM_DELAY"],
  "CP012-INV-035": ["VALID_SET"],
  "CP012-INV-036": ["COUNT"],
  "CP012-XCP-041": ["TIME_WITH_DIRECTION_REVERSAL"],
  "CP012-XCP-042": ["TIME_WITH_STOP_AFTER", "TIME_WITH_DELAYED_ACTIVATION"],
} as const);

const learnerSources = TSD_CP012_SOURCE_CANDIDATES.filter((x) => x.disposition === "LEARNER_AUTHORITY");
assert(learnerSources.length === 38, `expected 38 learner sources, found ${learnerSources.length}`);
assert(Object.keys(requiredTargetsBySource).length === 38, "coverage map must contain exactly 38 learner-source entries");
assert(learnerSources.every((x) => x.sourceId in requiredTargetsBySource), "every learner source must appear in executable coverage map");
assert(Object.keys(requiredTargetsBySource).every((sourceId) => learnerSources.some((x) => x.sourceId === sourceId)), "coverage map must not contain QA or unknown source IDs");

const baseCases = generateTsdCp012ExecutableCases();
const extensionCases = generateTsdCp012SourceExtensionCases();
const targetSets = new Map<string, Set<string>>();
for (const executableCase of [...baseCases, ...extensionCases]) {
  const set = targetSets.get(executableCase.authorityKey) ?? new Set<string>();
  set.add(executableCase.input.target);
  targetSets.set(executableCase.authorityKey, set);
}

for (const source of learnerSources) {
  const required = requiredTargetsBySource[source.sourceId as keyof typeof requiredTargetsBySource];
  const available = targetSets.get(source.authorityKey!);
  assert(available, `${source.sourceId}: no executable targets exist for ${source.authorityKey}`);
  for (const target of required) assert(available.has(target), `${source.sourceId}: required executable target ${target} is missing`);
}

let extensionAccepts = 0;
let extensionTamperRejects = 0;
for (const executableCase of extensionCases) {
  const verification = verifyTsdCp012SourceExtension(executableCase.input, executableCase.expected);
  assert(verification.accepted, `${executableCase.caseId}: extension verifier rejected expected solution (${verification.reason})`);
  extensionAccepts += 1;
  const tampered = Object.freeze({ ...executableCase.expected, answer: add(executableCase.expected.answer, rational(1)) });
  const tamperedVerification = verifyTsdCp012SourceExtension(executableCase.input, tampered);
  assert(!tamperedVerification.accepted, `${executableCase.caseId}: extension verifier accepted deliberate tamper`);
  extensionTamperRejects += 1;
}

const extensionTargetNames = new Set(extensionCases.map((x) => x.input.target));
assert(extensionTargetNames.size === 3, "three source-backed extension target families are required");
assert(extensionCases.length === 6, "expected two deterministic cases for each source-backed extension target");

console.log("TSD-CP-012 LEARNER-SOURCE EXECUTABLE COVERAGE PROOF: PASS");
console.log(JSON.stringify({
  learnerSources: learnerSources.length,
  baseExecutableCases: baseCases.length,
  sourceExtensionCases: extensionCases.length,
  combinedExecutableEvidence: baseCases.length + extensionCases.length,
  extensionTargetFamilies: [...extensionTargetNames],
  extensionVerifierAccepts: extensionAccepts,
  extensionTamperRejects,
  uncoveredLearnerSources: 0,
}, null, 2));
