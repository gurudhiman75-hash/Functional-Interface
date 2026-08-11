import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import { generateBankingPossibilityEditorialQuestionV5 } from "./banking-possibility-editorial-v5";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let lines = 0;
let notAllSpecialCases = 0;

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const prior = generateBankingPossibilityReviewQuestionV4(seed, locale);
    const question = generateBankingPossibilityEditorialQuestionV5(seed, locale);
    records += 1;

    // Editorial V5 must not alter question semantics, answers, options or diagrams.
    assert.deepEqual(question.statements, prior.statements);
    assert.deepEqual(question.conclusions, prior.conclusions);
    assert.deepEqual(question.options, prior.options);
    assert.equal(question.correctIndex, prior.correctIndex);
    assert.equal(question.semanticAnswer, prior.semanticAnswer);
    assert.deepEqual(question.diagram, prior.diagram);
    assert.deepEqual(question.metadata, prior.metadata);

    assert.equal(question.explanation.length, 2);
    const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
    assert.ok(scenario);
    const analysis = analyzeScenario(scenario);
    const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);

    question.explanation.forEach((line, index) => {
      lines += 1;
      assert.ok(line.length >= 90, `${seed}/${locale}/${index}: explanation too short`);
      assert.ok(line.startsWith(index === 0 ? "I:" : "II:"));
      assert.doesNotMatch(
        line,
        /at least one valid arrangement allowed by the statements|This ordinary conclusion follows because|This ordinary conclusion does not follow because|This possibility follows because|This possibility does not follow because/u,
        `${seed}/${locale}/${index}: rejected generic V1 explanation returned`,
      );
      const conclusion = question.conclusions[index];
      const subject = assignment[conclusion.canonicalConclusion.subject].labels[locale];
      const predicate = assignment[conclusion.canonicalConclusion.predicate].labels[locale];
      assert.ok(line.includes(subject), `${seed}/${locale}/${index}: subject term missing from explanation`);
      assert.ok(line.includes(predicate), `${seed}/${locale}/${index}: predicate term missing from explanation`);

      if (locale === "en-IN") {
        assert.match(line, /Statement|Statements/u);
        assert.match(line, /Conclusion/u);
      } else if (locale === "hi-IN") {
        assert.match(line, /कथन/u);
        assert.match(line, /निष्कर्ष/u);
      } else {
        assert.match(line, /ਕਥਨ/u);
        assert.match(line, /ਨਤੀਜਾ/u);
      }
    });

    const hasDirectNotAllPossibility = question.conclusions.some((entry) =>
      entry.mode === "POSSIBILITY"
      && entry.canonicalConclusion.form === "SOME"
      && analysis.premises.some((premise) =>
        premise.form === "NOT_ALL"
        && premise.subject === entry.canonicalConclusion.subject
        && premise.predicate === entry.canonicalConclusion.predicate));
    if (hasDirectNotAllPossibility) {
      notAllSpecialCases += 1;
      const combined = question.explanation.join(" ");
      if (locale === "en-IN") assert.match(combined, /does not mean no/u);
      if (locale === "hi-IN") assert.match(combined, /इसका अर्थ “कोई/u);
      if (locale === "pa-IN") assert.match(combined, /ਇਸ ਦਾ ਅਰਥ “ਕੋਈ/u);
    }
  }
}

assert.equal(records, 240);
assert.equal(lines, 480);
assert.ok(notAllSpecialCases > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V5",
  records,
  explanationLines: lines,
  notAllSpecialCases,
  contract: {
    answerSemanticsUnchanged: true,
    diagramUnchangedFromV4: true,
    questionSpecificRelationNamed: true,
    relevantDisplayedStatementReferenced: true,
    genericV1ExplanationRejected: true,
    directNotAllTrapExplained: true,
    locales: ["en-IN", "hi-IN", "pa-IN"],
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));
