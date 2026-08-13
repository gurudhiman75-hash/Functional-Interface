import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverShellV2 } from "./banking-can-never-be-shell-v2";
import { generateBankingCanNeverEditorialV3 } from "./banking-can-never-be-editorial-v3";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
let explanationLines = 0;
let evidencePremiseReferences = 0;
let changedOrdinaryExplanations = 0;
let changedModalExplanations = 0;
let changedLocalizedModalConclusions = 0;
let someContradictedFailures = 0;
let someUndeterminedFailures = 0;
let allEntailedFailures = 0;
let allUndeterminedFailures = 0;
const modalTruthByPosition: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  for (const locale of locales) {
    const base = generateBankingCanNeverShellV2(seed, locale);
    const editorial = generateBankingCanNeverEditorialV3(seed, locale);
    records += 1;

    assert.equal(editorial.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3");
    assert.equal(editorial.authority, base.authority);
    assert.equal(editorial.prototypeId, base.prototypeId);
    assert.equal(editorial.seed, base.seed);
    assert.equal(editorial.locale, base.locale);
    assert.equal(editorial.scenarioId, base.scenarioId);
    assert.equal(editorial.scenarioGroup, base.scenarioGroup);
    assert.equal(editorial.sourcePatternId, base.sourcePatternId);
    assert.deepEqual(editorial.statements, base.statements);
    assert.deepEqual(editorial.options, base.options);
    assert.equal(editorial.correctIndex, base.correctIndex);
    assert.equal(editorial.semanticAnswer, base.semanticAnswer);
    assert.deepEqual(editorial.metadata, base.metadata);
    assert.equal(editorial.explanationEvidence.length, 2);
    assert.equal(editorial.explanation.length, 2);

    assert.deepEqual(
      editorial.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
      base.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
    );

    for (let index = 0; index < 2; index += 1) {
      const conclusion = editorial.conclusions[index];
      const baseConclusion = base.conclusions[index];
      const explanation = editorial.explanation[index] ?? "";
      const baseExplanation = base.explanation[index] ?? "";
      const evidence = editorial.explanationEvidence[index];
      assert.ok(conclusion);
      assert.ok(baseConclusion);
      assert.ok(evidence);
      assert.equal(evidence.label, index === 0 ? "I" : "II");
      assert.equal(evidence.premiseIds.length, editorial.statements.length);
      assert.equal(evidence.renderedPremises.length, editorial.statements.length);
      assert.deepEqual(
        [...evidence.renderedPremises].sort(),
        [...editorial.statements].sort(),
        `${seed}/${locale}/${index}: explanation evidence must equal the complete displayed premise set.`,
      );
      assert.notEqual(explanation, baseExplanation);
      assert.doesNotMatch(
        explanation,
        /ordinary conclusion is true in every valid arrangement|ordinary conclusion is not true in every valid arrangement|solver profile|learner-facing/u,
      );
      assert.ok(
        evidence.renderedPremises.every((statement) => explanation.includes(statement)),
        `${seed}/${locale}/${index}: explanation must quote every premise used by the question.`,
      );
      explanationLines += 1;
      evidencePremiseReferences += evidence.renderedPremises.length;

      if (conclusion.mode === "DEFINITE") changedOrdinaryExplanations += 1;
      else changedModalExplanations += 1;

      if (locale === "en-IN") {
        assert.match(explanation, /class/u, `${seed}/${index}: English explanation must use class/member wording.`);
        assert.doesNotMatch(
          explanation,
          /\bat least one (?:cups|roads|trains|windows|coins|fruits|poets|lamps|flags|chairs|drums|boxes|rings|flowers|birds|gardens|stars|pencils|books|badges|shirts|plates|bells)\b|\bevery (?:cups|roads|trains|windows|coins|fruits|poets|lamps|flags|chairs|drums|boxes|rings|flowers|birds|gardens|stars|pencils|books|badges|shirts|plates|bells)\b|\bno (?:cups|roads|trains|windows|coins|fruits|poets|lamps|flags|chairs|drums|boxes|rings|flowers|birds|gardens|stars|pencils|books|badges|shirts|plates|bells) is\b/u,
        );

        if (conclusion.mode === "CAN_NEVER_BE" && !conclusion.follows) {
          if (conclusion.surfaceKind === "SOME_CAN_NEVER" && conclusion.classification === "CONTRADICTED") {
            someContradictedFailures += 1;
            assert.match(explanation, /every existing member .* forced to stay inside/u);
            assert.match(explanation, /no definite member/u);
          } else if (conclusion.surfaceKind === "SOME_CAN_NEVER" && conclusion.classification === "UNDETERMINED") {
            someUndeterminedFailures += 1;
            assert.match(explanation, /may remain outside/u);
            assert.match(explanation, /not forced in every valid arrangement/u);
          } else if (conclusion.surfaceKind === "ALL_CAN_NEVER" && conclusion.classification === "ENTAILED") {
            allEntailedFailures += 1;
            assert.match(explanation, /every member .* must belong/u);
            assert.match(explanation, /opposite of what the statements force/u);
          } else if (conclusion.surfaceKind === "ALL_CAN_NEVER" && conclusion.classification === "UNDETERMINED") {
            allUndeterminedFailures += 1;
            assert.match(explanation, /at least one valid arrangement can still place every member/u);
            assert.match(explanation, /is not proved/u);
          } else {
            assert.fail(`${seed}: unexpected false modal disposition ${conclusion.surfaceKind}/${conclusion.classification}.`);
          }
        }
      } else {
        assert.doesNotMatch(explanation, /solver profile|learner-facing|subject|predicate|can never be|some \.\.\./iu);
        if (conclusion.mode === "CAN_NEVER_BE") {
          assert.notEqual(conclusion.text, baseConclusion.text);
          changedLocalizedModalConclusions += 1;
          if (locale === "hi-IN") {
            assert.match(conclusion.text, /वर्ग/u);
            assert.doesNotMatch(conclusion.text, /समूह/u);
          } else {
            assert.match(conclusion.text, /ਵਰਗ/u);
            assert.doesNotMatch(conclusion.text, /ਸਮੂਹ/u);
          }
        }
      }
    }

    const modalIndex = editorial.conclusions.findIndex((entry) => entry.mode === "CAN_NEVER_BE");
    const modal = editorial.conclusions[modalIndex];
    assert.ok(modal);
    increment(modalTruthByPosition, `${modalIndex === 0 ? "I" : "II"}|${modal.follows}`);
  }
}

assert.equal(records, 240);
assert.equal(explanationLines, 480);
assert.equal(changedOrdinaryExplanations, 240);
assert.equal(changedModalExplanations, 240);
assert.equal(changedLocalizedModalConclusions, 160);
assert.ok(evidencePremiseReferences >= 960);
assert.equal(modalTruthByPosition["I|true"], 60);
assert.equal(modalTruthByPosition["I|false"], 60);
assert.equal(modalTruthByPosition["II|true"], 60);
assert.equal(modalTruthByPosition["II|false"], 60);

// These are measured diagnostic populations, not target weights. The release
// anti-pattern grid balances status, modal position and modal kind; it does not
// artificially rebalance the solver's internal false-reason classifications.
assert.equal(someContradictedFailures, 10);
assert.equal(someUndeterminedFailures, 10);
assert.equal(allEntailedFailures, 5);
assert.equal(allUndeterminedFailures, 15);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
  records,
  explanationLines,
  evidencePremiseReferences,
  changedOrdinaryExplanations,
  changedModalExplanations,
  changedLocalizedModalConclusions,
  modalTruthByPosition,
  falseModalReasonClasses: {
    someContradictedFailures,
    someUndeterminedFailures,
    allEntailedFailures,
    allUndeterminedFailures,
    status: "MEASURED_NOT_TARGET_WEIGHTED",
  },
  semanticParityWithShellV2: true,
  completePremiseEvidence: true,
  genericSolverExplanationOccurrences: 0,
  englishPluralAgreementLeakage: 0,
  hindiPunjabiEnglishModalLeaks: 0,
  explanationPolicy: "COMPLETE_PREMISE_DISPOSITION_SPECIFIC_REASONING_V3",
  activationPermitted: false,
}, null, 2));
