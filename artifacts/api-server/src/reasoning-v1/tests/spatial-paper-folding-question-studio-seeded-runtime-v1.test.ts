import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  generatePfcTpfStudioQuestionV1,
  PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  type PfcTpfStudioQlIdV1,
} from "../foundation/spatial/paper-folding-question-studio-seeded-runtime-v1";
import {
  generatePfcTpfStudioOperatorReviewV1,
  PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1,
  renderPfcTpfStudioOperatorReviewHtmlV1,
} from "../foundation/spatial/paper-folding-question-studio-operator-review-v1";
import { PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1 } from "../foundation/spatial/paper-folding-question-studio-integration-v1";
import { PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 } from "../foundation/spatial/paper-folding-localization-freeze-v2";

const QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const;

assert.equal(PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.localizationFrozen, true);
assert.equal(PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.experimentalStretchEnabled, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1.persistenceAllowed, false);

const diversity: Record<string, number> = {};
const provenanceSeen = new Set<string>();
const modesSeen = new Set<string>();
let boundaryNotchSeen = false;
let generatedQuestionCount = 0;

for (const qlId of QLS) {
  const fingerprints = new Set<string>();
  for (let index = 0; index < 12; index += 1) {
    const question = generatePfcTpfStudioQuestionV1({
      qlId: qlId as PfcTpfStudioQlIdV1,
      seed: `studio-diversity:${qlId}:${index}`,
      language: "en",
    });
    generatedQuestionCount += 1;
    fingerprints.add(question.contentFingerprint);
    provenanceSeen.add(question.provenance);
    modesSeen.add(question.mode);
    if (question.mode === "BOUNDARY_NOTCH_UNFOLD") boundaryNotchSeen = true;
    assert.equal(question.qlId, qlId);
    assert.equal(question.validation.exactSolverBacked, true);
    assert.equal(question.validation.uniqueAnswer, true);
    assert.equal(question.validation.optionArtUnique, true);
    assert.equal(question.validation.spacingOnlyDistractorsAllowed, false);
    assert.equal(question.validation.falsePyqAttribution, false);
    assert.equal(question.optionSvgs.length, 4);
    assert.equal(new Set(question.optionSvgs).size, 4);
    assert.ok(!/PYQ|past[- ]paper/i.test(question.stem));
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.persistenceAllowed, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.ok(question.canonicalAnchorId.includes(qlId));
    if (qlId <= "SPA-QL-038") {
      const cutoutCounts = question.optionSvgs.map((svg) => (svg.match(/data-cutout="transparent"/g) ?? []).length);
      assert.equal(new Set(cutoutCounts).size, 4, `${qlId}/${question.generationSeed}: forward options must differ in visible cut count, not slight spacing.`);
    }
  }
  diversity[qlId] = fingerprints.size;
  assert.ok(fingerprints.size >= 10, `${qlId}: expected at least 10 unique seeded fingerprints from 12 requests.`);
}

for (let index = 12; index < 36 && (!boundaryNotchSeen || !provenanceSeen.has("CONTROLLED_NOVEL")); index += 1) {
  for (const qlId of ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038"] as const) {
    const question = generatePfcTpfStudioQuestionV1({ qlId, seed: `studio-coverage:${qlId}:${index}`, language: "en" });
    provenanceSeen.add(question.provenance);
    modesSeen.add(question.mode);
    if (question.mode === "BOUNDARY_NOTCH_UNFOLD") boundaryNotchSeen = true;
  }
}
assert.ok(provenanceSeen.has("SOURCE_BACKED_CORE"));
assert.ok(provenanceSeen.has("CONTROLLED_NOVEL"));
assert.equal(boundaryNotchSeen, true);
assert.ok([...modesSeen].some((mode) => mode.includes("DIAGONAL") || mode.includes("CORNER")));
assert.ok([...modesSeen].some((mode) => mode.includes("TRANSPARENT")));
assert.ok([...modesSeen].some((mode) => mode.startsWith("TARGET_")));

const multilingualParity: Record<string, boolean> = {};
for (const qlId of QLS) {
  const seed = `studio-language-parity:${qlId}`;
  const en = generatePfcTpfStudioQuestionV1({ qlId, seed, language: "en" });
  const hi = generatePfcTpfStudioQuestionV1({ qlId, seed, language: "hi" });
  const pa = generatePfcTpfStudioQuestionV1({ qlId, seed, language: "pa" });
  for (const localized of [hi, pa]) {
    assert.equal(localized.contentFingerprint, en.contentFingerprint);
    assert.deepEqual(localized.stimulusSvgs, en.stimulusSvgs);
    assert.deepEqual(localized.optionSvgs, en.optionSvgs);
    assert.equal(localized.correctIndex, en.correctIndex);
    assert.equal(localized.answer, en.answer);
    assert.equal(localized.provenance, en.provenance);
    assert.equal(localized.representation, en.representation);
    assert.equal(localized.canonicalAnchorId, en.canonicalAnchorId);
  }
  assert.notEqual(hi.stem, en.stem);
  assert.notEqual(pa.stem, en.stem);
  assert.ok(/[\u0900-\u097F]/.test(hi.stem));
  assert.ok(/[\u0A00-\u0A7F]/.test(pa.stem));
  multilingualParity[qlId] = true;
}

const review = generatePfcTpfStudioOperatorReviewV1();
assert.equal(review.length, 18);
for (const qlId of QLS) {
  const slice = review.filter((question) => question.qlId === qlId);
  assert.equal(slice.length, 3);
  assert.deepEqual([...new Set(slice.map((question) => question.language))].sort(), ["en", "hi", "pa"]);
}
const html = renderPfcTpfStudioOperatorReviewHtmlV1(review);
assert.ok(html.includes("PFC / TPF Question Studio Operator Review V1"));
assert.equal((html.match(/class="q"/g) ?? []).length, 18);
assert.equal((html.match(/class="option"/g) ?? []).length, 72);

const evidence = {
  status: "PASS_PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_V1",
  runtimeAuthority: PFC_TPF_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  integrationAuthority: PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1,
  operatorReviewAuthority: PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1,
  localizationFreezeAuthorityId: PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2.authorityId,
  permanentQlRange: "SPA-QL-035..SPA-QL-040",
  permanentQlCount: 6,
  generatedDiversityQuestionCount: generatedQuestionCount,
  uniqueFingerprintCountsByQl: diversity,
  sourceBackedCoreSeen: provenanceSeen.has("SOURCE_BACKED_CORE"),
  controlledNovelSeen: provenanceSeen.has("CONTROLLED_NOVEL"),
  experimentalStretchSeen: false,
  boundaryNotchTopologySeen: boundaryNotchSeen,
  reverseInferenceSeen: [...modesSeen].some((mode) => mode.startsWith("TARGET_")),
  transparentSuperpositionSeen: [...modesSeen].some((mode) => mode.includes("TRANSPARENT")),
  multilingualGeometryParity: multilingualParity,
  optionArtUnique: true,
  spacingOnlyForwardDistractorsRejectedByVisibleMarkCount: true,
  falsePyqAttribution: false,
  operatorReviewQuestionCount: review.length,
  governance: {
    questionStudioDiscoverable: false,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    nextGate: "PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_V1_DECISION",
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-operator-review-v1.html", html, "utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-question-studio-seeded-runtime-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
