import { runPct001Pipeline } from "./PCT-001";
import library1 from "./PCT-001/question-language.en.json";
import { runPct002Pipeline } from "./PCT-002";
import library2 from "./PCT-002/question-language.en.json";
import { runPct003Pipeline } from "./PCT-003";
import library3 from "./PCT-003/question-language.en.json";
import { runPct004Pipeline } from "./PCT-004";
import library4 from "./PCT-004/question-language.en.json";
import { runPct005Pipeline } from "./PCT-005";
import library5 from "./PCT-005/question-language.en.json";
import { runPct006Pipeline } from "./PCT-006";
import library6 from "./PCT-006/question-language.en.json";
import { runPct007Pipeline } from "./PCT-007";
import library7 from "./PCT-007/question-language.en.json";
import assert from "node:assert/strict";
import { toQuestionStudioPreview } from "../../../../generation-engine-core";

function numericState(value: any): any {
  if (typeof value === "number") return value;
  if (Array.isArray(value))
    return value.map(numericState).filter((x) => x !== undefined);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).flatMap(([k, v]) => {
        const n = numericState(v);
        return n === undefined ? [] : [[k, n]];
      }),
    );
}
function visibleNative(text: string, language: string) {
  assert(
    (language === "hi" ? /[\u0900-\u097f]/ : /[\u0a00-\u0a7f]/).test(text),
  );
  assert(
    !/\b(?:the|find|what|which|is|are|then|original|total|value|Turnout|Savings|Expenditure)\b/i.test(
      text.replace(/\\[A-Za-z]+/g, ""),
    ),
    text,
  );
  assert(
    !/undefined|NaN|\{(?:baseValue|percentageRate|wholeLabel)\}/.test(text),
  );
}
let checked = 0,
  qlCount = 0,
  cpCount = 0;
for (const { packageId, run, library } of [
  { packageId: "PCT-001", run: runPct001Pipeline as any, library: library1 },
  { packageId: "PCT-002", run: runPct002Pipeline as any, library: library2 },
  { packageId: "PCT-003", run: runPct003Pipeline as any, library: library3 },
  { packageId: "PCT-004", run: runPct004Pipeline as any, library: library4 },
  { packageId: "PCT-005", run: runPct005Pipeline as any, library: library5 },
  { packageId: "PCT-006", run: runPct006Pipeline as any, library: library6 },
  { packageId: "PCT-007", run: runPct007Pipeline as any, library: library7 },
]) {
  cpCount += Object.keys(library).length;
  for (const [cp, data] of Object.entries(library) as any[])
    for (const ql of Object.keys(data.families ?? {})) {
      qlCount++;
      for (let seedIndex = 0; seedIndex < 3; seedIndex++) {
        const options = {
          questionLanguageId: ql,
          seed: `PCT-NATIVE:${packageId}:${ql}:${seedIndex}`,
        };
        const en = run(cp, { ...options, language: "en" });
        assert(en.validation.valid);
        for (const language of ["hi", "pa"] as const) {
          const q = run(cp, { ...options, language });
          assert(
            q.validation.valid,
            `${packageId}/${ql}/${language}: invalid source`,
          );
          assert.equal(q.questionLanguageId, ql);
          assert.deepEqual(
            numericState(q.parameters.variables),
            numericState(en.parameters.variables),
          );
          assert.deepEqual(
            numericState(q.solver.evidence),
            numericState(en.solver.evidence),
          );
          if (!/[A-Za-z]{3,}/.test(en.answer))
            assert.equal(q.answer, en.answer);
          else
            assert.deepEqual(
              q.answer.match(/\d+(?:\.\d+)?/g),
              en.answer.match(/\d+(?:\.\d+)?/g),
            );
          visibleNative(q.stem, language);
          visibleNative(q.explanation.lines.join(" "), language);
          const snapshot = JSON.stringify(q);
          const preview = toQuestionStudioPreview(q, { seed: options.seed });
          assert.equal(
            JSON.stringify(q),
            snapshot,
            "Review projection mutated source",
          );
          assert.equal(preview.metadata.language, language);
          assert.equal(preview.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
          assert.equal(preview.questionBankWritable, false);
          assert.equal(preview.testEligible, false);
          assert.equal(preview.publiclyPublishable, false);
          assert.equal(preview.productionReleaseAuthorized, false);
          assert.equal(preview.manualApprovalRequired, true);
          assert(preview.questionId.includes(`:${language}:native-review-v1`));
          assert.equal(new Set(preview.options).size, preview.options.length);
          assert.equal(
            preview.options[preview.correctIndex].replaceAll("$", ""),
            preview.canonicalAnswer.display.replaceAll("$", ""),
          );
          checked++;
        }
      }
    }
}
assert.equal(qlCount, 1950);
assert.equal(cpCount, 66);
console.log(
  "PCT_NATIVE_DELIVERY_V1",
  JSON.stringify({
    checked,
    qls: qlCount,
    checkpoints: cpCount,
    numericParity: true,
    nativeFormulaLabels: true,
    lifecycleLocked: true,
  }),
);
