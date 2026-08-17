import assert from "node:assert/strict";
import {
  SYL_EXAM_TARGET_MIX_V2,
  SYL_SOURCE_PROFILE_CLOSEOUT_V2,
  SYL_SOURCE_SNAPSHOTS_V2,
} from "../source-authority/source-profile-closeout-v2";
import {
  SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1,
  SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1,
} from "../source-authority/source-question-ledger-v1";

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

const ledger = SYL_PUNJAB_SOURCE_QUESTION_LEDGER_V1;
assert.equal(ledger.length, 12);
assert.equal(new Set(ledger.map((entry) => entry.ledgerId)).size, ledger.length);
assert.equal(new Set(ledger.map((entry) => entry.sourceUrl)).size, ledger.length);
assert.ok(ledger.every((entry) => entry.examProfile === "PUNJAB_POLICE"));
assert.ok(ledger.every((entry) => entry.examName === "Punjab Police Constable"));
assert.ok(ledger.every((entry) => entry.provenance === "SECONDARY_OFFICIAL_PAPER_TAGGED"));
assert.ok(ledger.every((entry) => entry.optionCount === 4));
assert.ok(ledger.every((entry) => entry.taskShell === "CONCLUSION_FOLLOW_MASK"));
assert.ok(ledger.every((entry) => entry.premiseCount === 2 || entry.premiseCount === 3));
assert.ok(ledger.every((entry) => entry.conclusionCount === 2 || entry.conclusionCount === 3));

const byYear = countBy(ledger.map((entry) => entry.heldOn.slice(0, 4)));
const byPremiseCount = countBy(ledger.map((entry) => String(entry.premiseCount)));
const byConclusionCount = countBy(ledger.map((entry) => String(entry.conclusionCount)));
const forms = countBy(ledger.flatMap((entry) => entry.premiseForms));
const features = countBy(ledger.flatMap((entry) => entry.features));

assert.deepEqual(byYear, { "2023": 2, "2024": 4, "2025": 6 });
assert.deepEqual(byPremiseCount, { "2": 9, "3": 3 });
assert.deepEqual(byConclusionCount, { "2": 11, "3": 1 });
assert.equal(forms.ALL, 14);
assert.equal(forms.SOME, 11);
assert.equal(forms.NO, 2);
assert.equal(forms.ONLY ?? 0, 0);
assert.equal(forms.ONLY_A_FEW ?? 0, 0);
assert.equal(features.POSSIBILITY_CONCLUSION_IN_STANDARD_SHELL, 1);
assert.equal(features.THREE_CONCLUSION_COMBINATION, 1);
assert.ok((features.SAME_VS_DIFFERENT_WITNESS_TRAP ?? 0) >= 3);
assert.ok((features.CHAIN_INFERENCE ?? 0) >= 6);

assert.equal(SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.status, "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE");
assert.equal(SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.officialPdfArchivedCount, 0);

const punjabSnapshot = SYL_SOURCE_SNAPSHOTS_V2.find((entry) => entry.examProfile === "PUNJAB");
assert.ok(punjabSnapshot);
assert.equal(punjabSnapshot.status, "PROVISIONAL_SECONDARY_OFFICIAL_PAPER_SAMPLE");
assert.equal(punjabSnapshot.evidenceUrls.length, 12);
assert.ok(punjabSnapshot.authorityBoundary.includes("Punjab Police"));
assert.ok(punjabSnapshot.authorityBoundary.includes("not"));

const punjabMix = SYL_EXAM_TARGET_MIX_V2.find((entry) => entry.profile === "PUNJAB");
assert.ok(punjabMix);
assert.equal(punjabMix.status, "PROVISIONAL_SOURCE_BACKED");
assert.equal(punjabMix.entries.reduce((sum, entry) => sum + entry.weight, 0), 100);
assert.deepEqual(
  Object.fromEntries(punjabMix.entries.map((entry) => [entry.familyId, entry.weight])),
  {
    PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION: 90,
    PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION: 10,
  },
);
assert.ok(punjabMix.note.includes("Not a statewide Punjab profile"));

assert.equal(SYL_SOURCE_PROFILE_CLOSEOUT_V2.mockWeightingFrozen, false);
assert.equal(SYL_SOURCE_PROFILE_CLOSEOUT_V2.permanentQlFreezePermitted, false);
assert.equal(
  SYL_SOURCE_PROFILE_CLOSEOUT_V2.profileStatus.PUNJAB_STATEWIDE,
  "BLOCKED_NOT_REPRESENTATIVE",
);

console.log(JSON.stringify({
  status: "PASS_SYL_001_PUNJAB_POLICE_SOURCE_LEDGER_AUDIT",
  authority: SYL_SOURCE_PROFILE_CLOSEOUT_V2.authorityId,
  ledger: {
    questions: ledger.length,
    provenance: countBy(ledger.map((entry) => entry.provenance)),
    byYear,
    byPremiseCount,
    byConclusionCount,
    premiseForms: forms,
    features,
    officialPdfArchived: SYL_PUNJAB_SOURCE_LEDGER_SUMMARY_V1.officialPdfArchivedCount,
  },
  provisionalPunjabPoliceMix: Object.fromEntries(
    punjabMix.entries.map((entry) => [entry.familyId, entry.weight]),
  ),
  boundaries: {
    PunjabPolice: SYL_SOURCE_PROFILE_CLOSEOUT_V2.profileStatus.PUNJAB_POLICE,
    PunjabStatewide: SYL_SOURCE_PROFILE_CLOSEOUT_V2.profileStatus.PUNJAB_STATEWIDE,
    mockWeightingFrozen: SYL_SOURCE_PROFILE_CLOSEOUT_V2.mockWeightingFrozen,
    permanentQlFreezePermitted: SYL_SOURCE_PROFILE_CLOSEOUT_V2.permanentQlFreezePermitted,
  },
}, null, 2));
