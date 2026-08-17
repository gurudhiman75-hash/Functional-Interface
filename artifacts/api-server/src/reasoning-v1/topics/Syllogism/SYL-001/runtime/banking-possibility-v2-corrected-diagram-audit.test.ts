import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityReviewQuestionV2Corrected,
} from "./banking-possibility-review-question-v2-corrected";
import { generateBankingPossibilityShellV2 } from "./banking-possibility-shell-v2";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
const geometrySources: Record<string, number> = {};
const statuses: Record<string, number> = {};
const dispositions: Record<string, number> = {};
const possibilityForms: Record<string, number> = {};
const correctOptionPositions: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  const localeQuestions = locales.map((locale) => {
    const base = generateBankingPossibilityShellV2(seed, locale);
    const reviewed = generateBankingPossibilityReviewQuestionV2Corrected(seed, locale);
    const { diagram, ...reviewedBase } = reviewed;

    // Attaching a premise diagram must not alter corrected V2 semantics or copy.
    assert.deepEqual(reviewedBase, base);

    records += 1;
    assert.equal(reviewed.authority, "SYL_001_BANKING_POSSIBILITY_SHELL_V2");
    assert.equal(reviewed.prototypeId, "SYL-PROTOTYPE-BANK-POSSIBILITY-002");
    assert.equal(reviewed.metadata.possibilitySemanticProfile, "BANKING_EXAM_POSSIBILITY_V2");
    assert.equal(reviewed.metadata.legacyQlChanged, false);
    assert.equal(reviewed.metadata.registeredQlCreated, false);
    assert.equal(reviewed.metadata.connectedToProfilePlanner, false);
    assert.equal(reviewed.metadata.questionStudioVisible, false);
    assert.equal(reviewed.metadata.questionBankWritable, false);
    assert.equal(reviewed.metadata.testEligible, false);
    assert.equal(reviewed.metadata.publiclyPublishable, false);

    assert.equal(diagram.enabled, true);
    assert.equal(diagram.premiseOnly, true);
    assert.equal(diagram.pipelineMode, "CONCLUSION_MASK");
    assert.equal(diagram.diagramCount, 1);
    assert.equal(diagram.mobileViewBoxWidth, 340);
    assert.ok(diagram.svg);
    assert.match(diagram.svg, /<svg\b/u);
    assert.match(diagram.svg, /data-premise-only="true"/u);
    assert.ok(diagram.caption);
    assert.ok(diagram.accessibleDescription);

    const possibility = reviewed.conclusions.find((entry) => entry.mode === "POSSIBILITY");
    assert.ok(possibility);
    assert.ok(possibility.possibilityDisposition);
    assert.ok(["ALL", "SOME", "SOME_NOT"].includes(possibility.canonicalConclusion.form));
    assert.equal(
      possibility.follows,
      possibility.possibilityDisposition === "OPEN_POSSIBILITY",
    );
    if (possibility.possibilityDisposition === "ALREADY_DEFINITE") {
      assert.equal(possibility.classification, "ENTAILED");
      assert.equal(possibility.follows, false);
    }

    increment(geometrySources, diagram.geometrySource);
    increment(statuses, reviewed.semanticAnswer);
    increment(dispositions, possibility.possibilityDisposition);
    increment(possibilityForms, possibility.canonicalConclusion.form);
    increment(correctOptionPositions, String(reviewed.correctIndex));
    return reviewed;
  });

  const canonical = localeQuestions[0];
  for (const question of localeQuestions.slice(1)) {
    assert.equal(question.scenarioId, canonical.scenarioId);
    assert.equal(question.sourcePatternId, canonical.sourcePatternId);
    assert.equal(question.semanticAnswer, canonical.semanticAnswer);
    assert.equal(question.correctIndex, canonical.correctIndex);
    assert.deepEqual(
      question.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
      canonical.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
    );
  }
}

assert.equal(records, 240);
for (const status of ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"]) {
  assert.ok((statuses[status] ?? 0) > 0, `${status} must remain represented.`);
}
for (const disposition of ["OPEN_POSSIBILITY", "ALREADY_DEFINITE", "IMPOSSIBLE"]) {
  assert.ok((dispositions[disposition] ?? 0) > 0, `${disposition} must remain represented.`);
}
for (const form of ["ALL", "SOME", "SOME_NOT"]) {
  assert.ok((possibilityForms[form] ?? 0) > 0, `${form} must remain represented.`);
}

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_V2_CORRECTED_DIAGRAMS",
  records,
  diagramSlots: records,
  enabledDiagrams: records,
  omittedDiagrams: 0,
  geometrySources,
  semanticStatuses: statuses,
  possibilityDispositions: dispositions,
  possibilityForms,
  correctOptionPositions,
  semanticParityWithV2Shell: true,
  premiseOnlyDiagramBridge: true,
  locks: {
    legacyQlChanged: false,
    registeredQlCreated: false,
    connectedToProfilePlanner: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    activationPermitted: false,
  },
}, null, 2));
