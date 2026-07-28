import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import { buildPnc002Cp007LocalizedPresentation } from "./foundation/localization-cp007-release";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-007");
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];

for (const entry of entries) {
  for (const locale of locales) {
    const source = runPnc002Pipeline({
      questionLanguageId: entry.qlId,
      seed: `pnc-cp007-localization-release:${locale}:${entry.qlId}`,
    });
    const presentation = buildPnc002Cp007LocalizedPresentation(source, locale);
    const text = [
      presentation.stem,
      ...presentation.displayOptions,
      ...presentation.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
    ].join(" ");

    assert.doesNotMatch(text, /दी गई दी गई|ਦਿੱਤੀ ਦਿੱਤੀ/);
    assert.doesNotMatch(text, /यह मान ब्लॉक के लिए|ਇਹ ਮੁੱਲ ਬਲਾਕ ਲਈ/);
    if (/व्यक्तियों|कलाकारों/.test(presentation.stem)) {
      assert.doesNotMatch(presentation.stem, /तरीकों से सजाया जा सकता है/);
    }
    if (/ਵਿਅਕਤੀਆਂ|ਕਲਾਕਾਰਾਂ/.test(presentation.stem)) {
      assert.doesNotMatch(presentation.stem, /ਤਰੀਕਿਆਂ ਨਾਲ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ/);
    }
    assert.equal(presentation.publiclyPublishable, false);
    assert.equal(presentation.editorialStatus, "PENDING");
  }
}

console.log(JSON.stringify({
  packageId: "PNC-002",
  canonicalProblemId: "PNC-CP-007",
  locales,
  qlCount: entries.length,
  releaseLanguageRegressions: "PASS",
  publiclyPublishable: false,
  status: "PASS",
}, null, 2));
