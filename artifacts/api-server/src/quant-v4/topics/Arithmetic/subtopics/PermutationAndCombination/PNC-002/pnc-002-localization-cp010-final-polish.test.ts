import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import { buildPnc002Cp010LocalizedPresentation } from "./foundation/localization-cp010-reviewed-final";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";
import { buildPnc002ProductionTeacherStudentPresentation } from "./foundation/student-presentation-teacher-production";

function mathTokens(value: string): string[] {
  return [
    ...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g),
  ].map((match) => match[0]!.trim());
}

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-010");
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];
const seeds = ["polish-a", "polish-b", "polish-c"];
let auditedPackages = 0;

for (const entry of entries) {
  for (const locale of locales) {
    for (const seedName of seeds) {
      const source = runPnc002Pipeline({
        questionLanguageId: entry.qlId,
        seed: `pnc-cp010-final-polish:${locale}:${seedName}:${entry.qlId}`,
      });
      assert.equal(source.validation.valid, true);
      const english = buildPnc002ProductionTeacherStudentPresentation(source);
      const localized = buildPnc002Cp010LocalizedPresentation(source, locale);
      const englishSteps = english.explanationSections.find((section) => section.kind === "stepByStep");
      const localizedSteps = localized.explanationSections.find((section) => section.kind === "stepByStep");
      assert.ok(englishSteps && localizedSteps);
      assert.equal(localizedSteps.lines.length, englishSteps.lines.length);
      assert.deepEqual(mathTokens(localizedSteps.lines.join("\n")), mathTokens(englishSteps.lines.join("\n")));
      assert.ok(locale === "hi-IN" ? localized.stem.startsWith("एक") : localized.stem.startsWith("ਇੱਕ"));
      assert.doesNotMatch(localizedSteps.lines.join(" "), /मामल|ਮਾਮਲ/);
      assert.ok(localizedSteps.lines.every((line, index) => line.startsWith(`${index + 1}. `)));
      assert.ok(localizedSteps.lines.slice(0, -1).every((line) => !line.includes(localized.answerLabel)));
      assert.ok(localizedSteps.lines.at(-1)?.includes(localized.answerLabel));
      if (localizedSteps.lines.length > 4) {
        const intermediate = localizedSteps.lines.slice(2, -1).join(" ");
        assert.doesNotMatch(intermediate, locale === "hi-IN" ? /उत्तर जाँचें/ : /ਉੱਤਰ ਜਾਂਚੋ/);
      }
      assert.equal(localized.editorialStatus, "PENDING");
      assert.equal(localized.publiclyPublishable, false);
      auditedPackages += 1;
    }
  }
}

assert.equal(entries.length, 32);
assert.equal(auditedPackages, 32 * 2 * 3);
console.log(JSON.stringify({
  canonicalProblemId: "PNC-CP-010",
  qlRange: ["PNC-QL-177", "PNC-QL-208"],
  locales,
  auditedPackages,
  repeatedAnswerLabelsRemoved: true,
  formulaParityPreserved: true,
  editorialStatus: "PENDING",
  publiclyPublishable: false,
  status: "PASS",
}, null, 2));
