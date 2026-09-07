import { getQuantV4OptionCount } from "../../../../common/exam-profile";
import {
  SAP_BANKING_SPEED_PROFILES,
  generateSapBankingSpeedQuestion,
  listSapBankingSpeedEligibleQls,
  type SapBankingSpeedExamProfile,
} from "./banking-speed-profile";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const profiles: readonly SapBankingSpeedExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
let questions = 0;
let deterministicReplayChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let speedTargetChecks = 0;

const cpCoverage = new Map<SapBankingSpeedExamProfile, Set<string>>();
const difficultyCoverage = new Map<SapBankingSpeedExamProfile, Set<string>>();
const approximationCounts = new Map<SapBankingSpeedExamProfile, number>();
const exactCounts = new Map<SapBankingSpeedExamProfile, number>();

for (const profileId of profiles) {
  const profile = SAP_BANKING_SPEED_PROFILES[profileId];
  const eligible = listSapBankingSpeedEligibleQls(profileId);
  assert(profile.optionCount === 5, `${profileId}: profile option count must be five.`);
  assert(profile.optionCount === getQuantV4OptionCount(profileId), `${profileId}: central option-count contract drifted.`);
  assert(eligible.length > 0, `${profileId}: no eligible SAP QLs.`);
  assert(eligible.every((entry) => profile.eligibleCpIds.includes(entry.checkpointId)), `${profileId}: eligible QL escaped profile CP scope.`);
  assert(eligible.every((entry) => entry.defaultWeight > 0), `${profileId}: zero-weight QL entered speed pool.`);
  if (profileId === "BANKING_PRELIMS") {
    assert(eligible.every((entry) => !entry.specialist), "BANKING_PRELIMS: specialist QL entered the speed pool.");
    assert(eligible.every((entry) => entry.checkpointId !== "SAP-CP-005" && entry.checkpointId !== "SAP-CP-012"), "BANKING_PRELIMS: specialist structural/reverse checkpoint entered the speed pool.");
  }
  cpCoverage.set(profileId, new Set());
  difficultyCoverage.set(profileId, new Set());
  approximationCounts.set(profileId, 0);
  exactCounts.set(profileId, 0);
}

for (let seedIndex = 1; seedIndex <= 120; seedIndex += 1) {
  for (const profileId of profiles) {
    const seed = `SAP-BANKING-SPEED-P1:${seedIndex}`;
    const first = generateSapBankingSpeedQuestion({ seed, examProfile: profileId });
    const replay = generateSapBankingSpeedQuestion({ seed, examProfile: profileId });
    assert(JSON.stringify(first) === JSON.stringify(replay), `${profileId}/${seedIndex}: deterministic replay failed.`);
    deterministicReplayChecks += 1;

    assert(first.examProfile === profileId, `${profileId}/${seedIndex}: exam profile drifted.`);
    assert(first.options.length === 5 && first.optionCount === 5, `${profileId}/${seedIndex}: banking delivery is not five-option.`);
    assert(new Set(first.options).size === 5, `${profileId}/${seedIndex}: displayed options are not unique.`);
    assert(first.options[4] === "None of these", `${profileId}/${seedIndex}: fifth option policy drifted.`);
    assert(Number.isInteger(first.correctIndex) && first.correctIndex >= 0 && first.correctIndex < 4, `${profileId}/${seedIndex}: Phase-1 known-false fifth option became correct.`);
    assert(first.bankingOptionAnalysis.length === 5, `${profileId}/${seedIndex}: every displayed option requires delivery metadata.`);
    assert(first.bankingOptionAnalysis[4]?.misconceptionId === "NONE_OF_THESE_KNOWN_FALSE", `${profileId}/${seedIndex}: fifth-option diagnosis is missing.`);
    optionChecks += 5;

    const speed = first.bankingSpeedProfile;
    const profile = SAP_BANKING_SPEED_PROFILES[profileId];
    assert(profile.eligibleCpIds.includes(speed.sourceCheckpointId), `${profileId}/${seedIndex}: generated CP is outside the profile.`);
    if (profileId === "BANKING_PRELIMS") assert(speed.sourceSpecialist === false, `${profileId}/${seedIndex}: specialist QL leaked into Prelims.`);
    assert(
      speed.approximationContract === (speed.sourceCheckpointId >= "SAP-CP-007" ? "CERTIFIED_APPROXIMATION_ONLY" : "EXACT_RESULT_REQUIRED"),
      `${profileId}/${seedIndex}: exact/approximation boundary drifted.`,
    );
    assert(Number.isInteger(speed.targetSolveSeconds) && speed.targetSolveSeconds > 0, `${profileId}/${seedIndex}: invalid solve-time target.`);
    speedTargetChecks += 1;

    assert(first.reviewStatus === "BANKING_SPEED_PROFILE_REVIEW_ONLY", `${profileId}/${seedIndex}: review lock opened.`);
    assert(first.questionBankStatus === "NOT_STORED", `${profileId}/${seedIndex}: Question Bank lock opened.`);
    assert(first.testEligibility === "INELIGIBLE", `${profileId}/${seedIndex}: mock/test lock opened.`);
    assert(first.publiclyPublishable === false, `${profileId}/${seedIndex}: public publication lock opened.`);
    assert(first.traceability.questionStudioDiscoverable === false, `${profileId}/${seedIndex}: profile became Question Studio discoverable.`);
    lifecycleChecks += 1;

    cpCoverage.get(profileId)!.add(speed.sourceCheckpointId);
    difficultyCoverage.get(profileId)!.add(String(first.difficultyBand ?? first.difficulty));
    if (speed.approximationContract === "CERTIFIED_APPROXIMATION_ONLY") {
      approximationCounts.set(profileId, approximationCounts.get(profileId)! + 1);
    } else {
      exactCounts.set(profileId, exactCounts.get(profileId)! + 1);
    }
    questions += 1;
  }
}

for (const profileId of profiles) {
  const approximation = approximationCounts.get(profileId)!;
  const exact = exactCounts.get(profileId)!;
  const total = approximation + exact;
  const share = approximation / total;
  assert(approximation > 0 && exact > 0, `${profileId}: both exact and approximation SAP families must be exercised.`);
  assert(share >= 0.3 && share <= 0.8, `${profileId}: approximation mix collapsed to ${(share * 100).toFixed(1)}%.`);
  assert(cpCoverage.get(profileId)!.size >= 6, `${profileId}: checkpoint coverage is too narrow (${cpCoverage.get(profileId)!.size}).`);
  assert(difficultyCoverage.get(profileId)!.size >= 2, `${profileId}: generated speed profile did not exercise enough difficulty bands.`);
}

console.log(JSON.stringify({
  status: "PASS_SAP_BANKING_SPEED_PROFILE_P1",
  questions,
  deterministicReplayChecks,
  optionChecks,
  lifecycleChecks,
  speedTargetChecks,
  eligibleQlCounts: Object.fromEntries(profiles.map((profileId) => [profileId, listSapBankingSpeedEligibleQls(profileId).length])),
  checkpointCoverage: Object.fromEntries([...cpCoverage].map(([profileId, values]) => [profileId, [...values].sort()])),
  difficultyCoverage: Object.fromEntries([...difficultyCoverage].map(([profileId, values]) => [profileId, [...values].sort()])),
  approximationCounts: Object.fromEntries(approximationCounts),
  exactCounts: Object.fromEntries(exactCounts),
}));
