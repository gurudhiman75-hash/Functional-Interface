import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[“”"'’.!?।,:;—–-]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

let records = 0;
let conclusionReasons = 0;
let verifiedPremiseReferences = 0;
let duplicateTerminalPunctuation = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      records += 1;

      const learnerText = [
        ...presentation.learnerExplanation.shortReasoning,
        presentation.learnerExplanation.conclusion,
        ...presentation.learnerExplanation.conclusionResults.map((result) => result.shortReason),
        ...presentation.optionAnalysis.flatMap((option) => [option.verdictLabel, option.studentReason]),
        presentation.diagram.caption ?? "",
        presentation.diagram.accessibleDescription ?? "",
      ].join(" ");
      const punctuationMatches = learnerText.match(/(?:\.[”"]\.|।[”"]।|!!|\?\?|।।)/gu) ?? [];
      duplicateTerminalPunctuation += punctuationMatches.length;
      assert.equal(
        punctuationMatches.length,
        0,
        `${definition.qlId}/${seed}/${locale}: duplicate terminal punctuation remains`,
      );

      for (const [index, result] of presentation.learnerExplanation.conclusionResults.entries()) {
        conclusionReasons += 1;
        const evaluation = question.reviewLogic.conclusionEvaluations[index];
        if (!evaluation || evaluation.classification === "UNDETERMINED") continue;
        const relevantStatements = question.structuredProofV3.statementMeanings
          .filter((entry) => evaluation.verdictImpactPremiseIds.includes(entry.premiseId))
          .map((entry) => entry.statement);
        for (const statement of relevantStatements) {
          verifiedPremiseReferences += 1;
          assert.ok(
            normalize(result.shortReason).includes(normalize(statement)),
            `${definition.qlId}/${seed}/${locale}: conclusion ${index + 1} omits decisive premise ${statement}`,
          );
        }
      }

      if (definition.qlId === "SYL-QL-008" && seed === 3 && locale === "en-IN") {
        const secondReason = presentation.learnerExplanation.conclusionResults[1]?.shortReason ?? "";
        assert.ok(secondReason.includes("Some gardens are bells"));
        assert.ok(secondReason.includes("All bells are stones"));
        assert.ok(secondReason.includes("No stones are boxes"));
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.equal(duplicateTerminalPunctuation, 0);
assert.ok(conclusionReasons > 0);
assert.ok(verifiedPremiseReferences > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_EDITORIAL_POLISH",
  records,
  conclusionReasons,
  verifiedPremiseReferences,
  duplicateTerminalPunctuation,
  namedRegression: {
    qlId: "SYL-QL-008",
    seed: 3,
    locale: "en-IN",
    allThreeDecisivePremisesPresent: true,
  },
}, null, 2));
