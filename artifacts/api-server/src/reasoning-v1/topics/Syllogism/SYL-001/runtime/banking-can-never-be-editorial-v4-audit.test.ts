import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV3 } from "./banking-can-never-be-editorial-v3";
import { generateBankingCanNeverEditorialV4 } from "./banking-can-never-be-editorial-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
let v3Chars = 0;
let v4Chars = 0;
let diagrams = 0;
let fourTermDiagrams = 0;
let exactV5Diagrams = 0;
let supplementalDiagrams = 0;
let repeatedFullPremises = 0;
let internalPremiseEvidenceReferences = 0;
const geometryBySeed = new Map<number, string>();
const schemaCounts: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  for (const locale of locales) {
    const v3 = generateBankingCanNeverEditorialV3(seed, locale);
    const v4 = generateBankingCanNeverEditorialV4(seed, locale);
    records += 1;

    assert.equal(v4.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4");
    assert.equal(v4.authority, v3.authority);
    assert.equal(v4.prototypeId, v3.prototypeId);
    assert.equal(v4.seed, v3.seed);
    assert.equal(v4.locale, v3.locale);
    assert.equal(v4.scenarioId, v3.scenarioId);
    assert.equal(v4.scenarioGroup, v3.scenarioGroup);
    assert.equal(v4.sourcePatternId, v3.sourcePatternId);
    assert.deepEqual(v4.statements, v3.statements);
    assert.deepEqual(v4.conclusions, v3.conclusions);
    assert.deepEqual(v4.options, v3.options);
    assert.equal(v4.correctIndex, v3.correctIndex);
    assert.equal(v4.semanticAnswer, v3.semanticAnswer);
    assert.deepEqual(v4.metadata, v3.metadata);
    assert.deepEqual(v4.explanationEvidence, v3.explanationEvidence);

    assert.equal(v4.visualPolicy.stemDiagram, "NONE");
    assert.equal(v4.visualPolicy.solutionDiagram, "ONE_COMBINED_PREMISE_DIAGRAM");
    assert.equal(v4.visualPolicy.disclosure, "AFTER_ATTEMPT");
    assert.equal(v4.visualPolicy.separateConclusionDiagrams, false);
    assert.equal(v4.visualPolicy.counterexampleSupplement, "TEXT_ONLY_WHEN_NEEDED_V4");
    assert.equal(Object.prototype.hasOwnProperty.call(v4, "diagrams"), false);

    assert.equal(v4.explanation.length, 2);
    for (let index = 0; index < 2; index += 1) {
      const line = v4.explanation[index] ?? "";
      const prior = v3.explanation[index] ?? "";
      v3Chars += prior.length;
      v4Chars += line.length;
      assert.ok(line.length >= 55, `${seed}/${locale}/${index}: explanation is too terse.`);
      assert.ok(line.length <= 420, `${seed}/${locale}/${index}: explanation is still too long.`);
      assert.notEqual(line, prior);
      assert.doesNotMatch(line, /solver profile|learner-facing|canBeTrue|canBeFalse|ENTAILED|UNDETERMINED|CONTRADICTED/u);
      assert.match(line, index === 0 ? /^I:/u : /^II:/u);
      const evidence = v4.explanationEvidence[index];
      assert.ok(evidence);
      assert.equal(evidence.renderedPremises.length, v4.statements.length);
      internalPremiseEvidenceReferences += evidence.renderedPremises.length;
      for (const statement of evidence.renderedPremises) {
        if (line.includes(statement)) repeatedFullPremises += 1;
      }

      if (locale === "en-IN") {
        assert.match(line, /class/u);
        assert.match(line, /Conclusion (?:I|II) (?:follows|does not follow)\./u);
      } else {
        assert.doesNotMatch(line, /solver|learner|can never be|subject|predicate/iu);
      }
    }

    const diagram = v4.diagram;
    assert.equal(diagram.enabled, true);
    assert.equal(diagram.premiseOnly, true);
    assert.equal(diagram.pipelineMode, "CONCLUSION_MASK");
    assert.equal(diagram.diagramCount, 1);
    assert.equal(diagram.mobileViewBoxWidth, 340);
    assert.equal(diagram.omissionReason, null);
    assert.ok(diagram.svg);
    assert.ok(diagram.caption);
    assert.ok(diagram.accessibleDescription);
    assert.doesNotMatch(diagram.svg ?? "", /<script\b|<foreignObject\b/iu);
    assert.match(diagram.svg ?? "", /<svg\b/u);
    diagrams += 1;
    increment(schemaCounts, diagram.schemaVersion);

    if (diagram.schemaVersion === "banking-possibility-four-term-diagram-v4") {
      fourTermDiagrams += 1;
      assert.equal(v4.scenarioId, "SYL-SC-CORE-009");
      assert.equal(diagram.geometrySource, "SAFETY_GATED_FOUR_TERM_TEMPLATE");
    } else if (diagram.geometrySource === "APPROVED_V5_EXACT") {
      exactV5Diagrams += 1;
      assert.match(diagram.svg ?? "", /data-banking-combined-venn="true"/u);
      assert.match(diagram.svg ?? "", /data-premise-only="true"/u);
    } else if (diagram.geometrySource === "SAFETY_GATED_SUPPLEMENTAL_TEMPLATE") {
      supplementalDiagrams += 1;
      assert.match(diagram.svg ?? "", /data-banking-combined-venn="true"/u);
      assert.match(diagram.svg ?? "", /data-premise-only="true"/u);
    } else {
      assert.fail(`${seed}/${locale}: unexpected enabled geometry source ${diagram.geometrySource}.`);
    }

    const existingGeometry = geometryBySeed.get(seed);
    if (existingGeometry === undefined) geometryBySeed.set(seed, diagram.geometrySource);
    else assert.equal(diagram.geometrySource, existingGeometry, `${seed}: geometry source must be locale invariant.`);

    assert.equal(v4.metadata.legacyQlChanged, false);
    assert.equal(v4.metadata.registeredQlCreated, false);
    assert.equal(v4.metadata.connectedToProfilePlanner, false);
    assert.equal(v4.metadata.questionStudioVisible, false);
    assert.equal(v4.metadata.questionBankWritable, false);
    assert.equal(v4.metadata.testEligible, false);
    assert.equal(v4.metadata.publiclyPublishable, false);
  }
}

assert.equal(records, 240);
assert.equal(diagrams, 240);
assert.equal(repeatedFullPremises, 0, "Learner explanations must not re-quote complete statements already shown above the diagram.");
assert.ok(internalPremiseEvidenceReferences >= 960, "Complete-premise evidence must remain available for audit.");
assert.ok(v4Chars < v3Chars * 0.75, `Editorial V4 should materially compress learner prose: V3=${v3Chars}, V4=${v4Chars}.`);
assert.ok(fourTermDiagrams > 0, "CORE-009 must exercise the four-term combined-diagram fallback.");
assert.equal(exactV5Diagrams + supplementalDiagrams + fourTermDiagrams, 240);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
  records,
  semanticParityWithEditorialV3: true,
  statementConclusionOptionParity: true,
  explanationChars: {
    v3: v3Chars,
    v4: v4Chars,
    retainedRatio: Number((v4Chars / v3Chars).toFixed(4)),
  },
  repeatedFullPremises,
  internalPremiseEvidenceReferences,
  diagramPolicy: "ONE_COMBINED_PREMISE_DIAGRAM_AFTER_ATTEMPT_V4",
  diagrams,
  schemaCounts,
  exactV5Diagrams,
  supplementalDiagrams,
  fourTermDiagrams,
  omittedDiagrams: 0,
  separateConclusionDiagrams: false,
  counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V4",
  humanDiagramReview: "PENDING",
  difficultyCalibration: "PENDING_EVIDENCE_BASED_PROFILE_FREEZE",
  sourceWeighting: "PENDING_SOURCE_PROFILE_FREEZE",
  activationPermitted: false,
}, null, 2));
