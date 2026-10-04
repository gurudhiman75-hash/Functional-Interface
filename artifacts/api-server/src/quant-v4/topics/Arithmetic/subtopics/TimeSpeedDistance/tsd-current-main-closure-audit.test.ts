import assert from "node:assert/strict";

import {
  generateTsdEngineBatch,
  tsd001EnginePackage,
  tsd002EnginePackage,
  TSD_CURRENT_STUDIO_AUTHORITY,
} from "../../../../../../question-studio/quant-time-speed-distance";
import { quantV4QuestionStudioAdapter } from "../../../../../../question-studio/engines/quant-v4-adapter";
import { TSD_CP003_PERMANENT_QL_IDS } from "./TSD-001/cp003/ql-allocation";
import { TSD_CP004_PERMANENT_QL_IDS } from "./TSD-001/cp004/ql-allocation";
import { TSD_CP005_PERMANENT_QL_IDS } from "./TSD-001/cp005/ql-allocation";
import { TSD_CP006_PERMANENT_QL_IDS } from "./TSD-001/cp006/ql-allocation";
import { TSD_CP007_PERMANENT_QL_IDS } from "./TSD-002/cp007/ql-allocation";
import { TSD_CP008_PERMANENT_QL_IDS } from "./TSD-002/cp008/ql-allocation";
import { TSD_CP009_PERMANENT_QL_IDS } from "./TSD-002/cp009/ql-allocation";
import {
  TSD_CP010_PERMANENT_QL_IDS,
  type TsdCp010QlId,
} from "./TSD-002/cp010/ql-allocation";
import {
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
  previewTsdCp010StudioCandidate,
} from "./TSD-002/cp010/question-studio-candidate-adapter-final";
import {
  TSD_CP011_PERMANENT_QL_IDS,
  type TsdCp011QlId,
} from "./TSD-002/cp011/ql-allocation";
import {
  TSD_CP011_STUDIO_CANDIDATE_PACKAGE,
  previewTsdCp011StudioCandidate,
} from "./TSD-002/cp011/question-studio-candidate";
import {
  TSD_CP012_PERMANENT_QL_IDS,
  type TsdCp012QlId,
} from "./TSD-002/cp012/ql-allocation";
import {
  TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
  previewTsdCp012StudioCandidate,
} from "./TSD-002/cp012/question-studio-candidate";
import { TSD_CANONICAL_LIFECYCLE } from "./canonical-lifecycle";

const LANGUAGES = ["en", "hi", "pa"] as const;

const CP_QL_IDS = Object.freeze({
  "TSD-CP-003": TSD_CP003_PERMANENT_QL_IDS,
  "TSD-CP-004": TSD_CP004_PERMANENT_QL_IDS,
  "TSD-CP-005": TSD_CP005_PERMANENT_QL_IDS,
  "TSD-CP-006": TSD_CP006_PERMANENT_QL_IDS,
  "TSD-CP-007": TSD_CP007_PERMANENT_QL_IDS,
  "TSD-CP-008": TSD_CP008_PERMANENT_QL_IDS,
  "TSD-CP-009": TSD_CP009_PERMANENT_QL_IDS,
  "TSD-CP-010": TSD_CP010_PERMANENT_QL_IDS,
  "TSD-CP-011": TSD_CP011_PERMANENT_QL_IDS,
  "TSD-CP-012": TSD_CP012_PERMANENT_QL_IDS,
});

function expectedQl(ordinal: number) {
  return `TSD-QL-${String(ordinal).padStart(3, "0")}`;
}

function learnerText(question: Record<string, unknown>): string {
  const explanation = typeof question.explanation === "string"
    ? question.explanation
    : JSON.stringify(question.explanation ?? "");
  return `${String(question.text ?? question.stem ?? "")} ${explanation}`;
}

function assertLanguageSurface(
  question: Record<string, unknown>,
  language: (typeof LANGUAGES)[number],
  label: string,
) {
  const text = learnerText(question);
  if (language === "hi") {
    assert.match(text, /[\u0900-\u097F]/u, `${label}: Hindi learner surface lacks Devanagari`);
  }
  if (language === "pa") {
    assert.match(text, /[\u0A00-\u0A7F]/u, `${label}: Punjabi learner surface lacks Gurmukhi`);
  }
}

function assertReviewQuestion(
  question: Record<string, unknown>,
  packageId: "TSD-001" | "TSD-002",
  cpId: string,
  qlId: string,
  language: (typeof LANGUAGES)[number],
) {
  const label = `${packageId}/${cpId}/${qlId}/${language}`;
  const options = Array.isArray(question.options) ? question.options.map(String) : [];
  const correctIndex = Number(question.correctIndex ?? question.correct);
  const stem = String(question.text ?? question.stem ?? "").trim();
  const explanation = typeof question.explanation === "string"
    ? question.explanation.trim()
    : JSON.stringify(question.explanation ?? "");

  assert.equal(question.packageId, packageId, `${label}: package identity drift`);
  assert.equal(question.canonicalProblemId, cpId, `${label}: checkpoint identity drift`);
  assert.equal(question.qlId ?? question.questionLanguageId, qlId, `${label}: permanent QL identity drift`);
  assert.equal(question.language, language, `${label}: language identity drift`);
  assert.ok(stem.length > 20, `${label}: stem is missing or too short`);
  assert.ok(explanation.length > 20, `${label}: explanation is missing or too short`);
  assert.equal(options.length, 4, `${label}: expected four options`);
  assert.equal(new Set(options).size, 4, `${label}: options are not unique`);
  assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${label}: invalid correct index`);
  assert.equal(question.lifecycleStage, "REVIEW_ONLY", `${label}: review-only lifecycle missing`);
  assert.equal(question.questionBankStatus, "NOT_STORED", `${label}: Question Bank lock changed`);
  assert.equal(question.questionBankWritable, false, `${label}: Question Bank write enabled`);
  assert.equal(question.testEligibility, "INELIGIBLE", `${label}: test eligibility changed`);
  assert.equal(question.testEligible, false, `${label}: test eligibility flag changed`);
  assert.equal(question.publiclyPublishable, false, `${label}: publication lock changed`);
  assert.equal(question.productionReleaseAuthorized, false, `${label}: production release authorization changed`);
  assert.doesNotMatch(
    `${stem} ${explanation} ${options.join(" ")}`,
    /undefined|null|NaN|Infinity|\{\{|\$\{/u,
    `${label}: unresolved learner-facing content`,
  );
  assertLanguageSurface(question, language, label);
}

const allQlIds = Object.values(CP_QL_IDS).flatMap((ids) => [...ids]);
assert.equal(allQlIds.length, 105, "TSD CP003-CP012 must own exactly 105 permanent QLs");
assert.equal(new Set(allQlIds).size, 105, "TSD permanent QL chain contains duplicates");
assert.deepEqual(
  allQlIds,
  Array.from({ length: 105 }, (_, index) => expectedQl(38 + index)),
  "TSD permanent QL chain must be continuous from TSD-QL-038 through TSD-QL-142",
);

assert.equal(TSD_CANONICAL_LIFECYCLE.length, 12, "TSD canonical lifecycle must cover CP001-CP012");
for (const entry of TSD_CANONICAL_LIFECYCLE) {
  const ordinal = Number(entry.checkpoint.slice(2));
  if (ordinal <= 2) {
    assert.equal(entry.lifecycle, "SUPERSEDED_INTO_REMODEL", `${entry.checkpoint}: remodel lifecycle drift`);
    assert.equal(entry.qlAuthority, "NONE", `${entry.checkpoint}: historical QLs must remain superseded`);
  } else {
    assert.equal(entry.lifecycle, "FROZEN", `${entry.checkpoint}: final chapter lifecycle is not frozen`);
    assert.equal(entry.qlAuthority, "PERMANENT", `${entry.checkpoint}: permanent QL authority missing`);
  }
}

const package1 = tsd001EnginePackage();
const package2 = tsd002EnginePackage();
assert.deepEqual(package1.cpIds, ["TSD-CP-005", "TSD-CP-006"]);
assert.deepEqual(package2.cpIds, ["TSD-CP-007", "TSD-CP-008", "TSD-CP-009"]);
for (const pkg of [package1, package2]) {
  assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.productionReleaseAuthorized, false);
}

const adapterPackages = quantV4QuestionStudioAdapter.listPackages();
assert.equal(adapterPackages.filter((pkg) => pkg.packageId === "TSD-001").length, 1, "TSD-001 must have exactly one unified package registration");
assert.equal(adapterPackages.filter((pkg) => pkg.packageId === "TSD-002").length, 1, "TSD-002 must have exactly one unified package registration");
const visibleTsdCpIds = adapterPackages
  .filter((pkg) => pkg.packageId === "TSD-001" || pkg.packageId === "TSD-002")
  .flatMap((pkg) => [...pkg.cpIds, ...(pkg.dynamicCandidateCpIds ?? [])]);
for (const lockedCp of ["TSD-CP-010", "TSD-CP-011", "TSD-CP-012"]) {
  assert.ok(!visibleTsdCpIds.includes(lockedCp), `${lockedCp}: frozen-but-locked checkpoint leaked into Studio selector`);
}

let registeredStudioCases = 0;
for (const [cpId, qlIds] of Object.entries(CP_QL_IDS).filter(([cp]) => {
  const ordinal = Number(cp.slice(-3));
  return ordinal >= 5 && ordinal <= 9;
})) {
  const ordinal = Number(cpId.slice(-3));
  const packageId = ordinal <= 6 ? "TSD-001" : "TSD-002";
  for (const qlId of qlIds) {
    for (const language of LANGUAGES) {
      const result = await generateTsdEngineBatch({
        engineId: "quant-v4",
        packageId,
        canonicalProblemId: cpId,
        questionLanguageId: qlId,
        language,
        seed: `tsd-current-main-closure:${cpId}:${qlId}:${language}`,
        count: 1,
      });
      assert.ok(result, `${packageId}/${cpId}/${qlId}/${language}: generator declined registered TSD request`);
      assert.equal(result.questions.length, 1, `${packageId}/${cpId}/${qlId}/${language}: expected one generated review item`);
      assertReviewQuestion(
        result.questions[0] as Record<string, unknown>,
        packageId,
        cpId,
        qlId,
        language,
      );
      registeredStudioCases += 1;
    }
  }
}
assert.equal(registeredStudioCases, 171, "Expected 57 registered TSD QLs across three languages");

for (const lockedCp of ["TSD-CP-010", "TSD-CP-011", "TSD-CP-012"]) {
  await assert.rejects(
    () => generateTsdEngineBatch({
      engineId: "quant-v4",
      packageId: "TSD-002",
      canonicalProblemId: lockedCp,
      language: "en",
      count: 1,
      seed: `tsd-lock-check:${lockedCp}`,
    }),
    /Question Studio locked/u,
    `${lockedCp}: unified Studio bridge no longer enforces canonical lock`,
  );
}

for (const pkg of [
  TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP011_STUDIO_CANDIDATE_PACKAGE,
  TSD_CP012_STUDIO_CANDIDATE_PACKAGE,
]) {
  assert.equal(pkg.questionStudioRegistrationStatus, "NOT_REGISTERED");
  assert.equal(pkg.persistenceAllowed, false);
  assert.equal(pkg.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.testEligibility, "INELIGIBLE");
  assert.equal(pkg.publiclyPublishable, false);
}

let lockedCandidateCases = 0;
for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
  for (const language of LANGUAGES) {
    const preview = previewTsdCp010StudioCandidate({
      qlId: qlId as TsdCp010QlId,
      language,
      count: 1,
      seed: `tsd-cp010-closure:${qlId}:${language}`,
    });
    assert.equal(preview.questions.length, 1);
    const question = preview.questions[0] as Record<string, unknown>;
    assert.equal(question.questionStudioRegistrationStatus, "NOT_REGISTERED");
    assert.equal(question.persistenceAllowed, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(new Set((question.options as readonly unknown[]).map(String)).size, 4);
    assertLanguageSurface(question, language, `CP010/${qlId}/${language}`);
    lockedCandidateCases += 1;
  }
}
for (const qlId of TSD_CP011_PERMANENT_QL_IDS) {
  for (const language of LANGUAGES) {
    const preview = previewTsdCp011StudioCandidate({
      qlId: qlId as TsdCp011QlId,
      language,
      count: 1,
      seed: `tsd-cp011-closure:${qlId}:${language}`,
    });
    assert.equal(preview.questions.length, 1);
    const question = preview.questions[0] as Record<string, unknown>;
    assert.equal(question.questionStudioRegistrationStatus, "NOT_REGISTERED");
    assert.equal(question.persistenceAllowed, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(new Set((question.options as readonly unknown[]).map(String)).size, 4);
    assertLanguageSurface(question, language, `CP011/${qlId}/${language}`);
    lockedCandidateCases += 1;
  }
}
for (const qlId of TSD_CP012_PERMANENT_QL_IDS) {
  for (const language of LANGUAGES) {
    const preview = previewTsdCp012StudioCandidate({
      qlId: qlId as TsdCp012QlId,
      language,
      count: 1,
      seed: `tsd-cp012-closure:${qlId}:${language}`,
    });
    assert.equal(preview.questions.length, 1);
    const question = preview.questions[0] as Record<string, unknown>;
    assert.equal(question.questionStudioRegistrationStatus, "NOT_REGISTERED");
    assert.equal(question.persistenceAllowed, false);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.publiclyPublishable, false);
    assert.equal(new Set((question.options as readonly unknown[]).map(String)).size, 4);
    assertLanguageSurface(question, language, `CP012/${qlId}/${language}`);
    lockedCandidateCases += 1;
  }
}
assert.equal(lockedCandidateCases, 84, "Expected 28 locked candidate QLs across three languages");

assert.deepEqual(
  [...TSD_CURRENT_STUDIO_AUTHORITY.frozenStudioLockedCheckpointIds],
  ["TSD-CP-010", "TSD-CP-011", "TSD-CP-012"],
);

console.log(JSON.stringify({
  chapter: "Time, Speed & Distance",
  audit: "TSD-CURRENT-MAIN-CLOSURE-V1",
  permanentQlRange: "TSD-QL-038..TSD-QL-142",
  permanentQlCount: allQlIds.length,
  frozenCheckpointCount: TSD_CANONICAL_LIFECYCLE.filter((entry) => entry.lifecycle === "FROZEN").length,
  registeredStudioPackages: ["TSD-001", "TSD-002"],
  registeredStudioCheckpointIds: ["TSD-CP-005", "TSD-CP-006", "TSD-CP-007", "TSD-CP-008", "TSD-CP-009"],
  frozenStudioLockedCheckpointIds: ["TSD-CP-010", "TSD-CP-011", "TSD-CP-012"],
  registeredStudioCases,
  lockedCandidateCases,
  totalCurrentMainAuditCases: registeredStudioCases + lockedCandidateCases,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  verdict: "PASS",
}, null, 2));
