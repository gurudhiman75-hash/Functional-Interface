import assert from "node:assert/strict";
import { applyAvg001NaturalLanguageV35Review } from "./foundation/natural-language-v3-5-review";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

function generate(qlId: string, language: Avg001Language): Avg001QuestionPackage {
  const seed = `avg-001-natural-language-v3-4:${qlId}`;
  const source = language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
  return applyAvg001NaturalLanguageV35Review(source);
}

for (const language of ["en", "hi", "pa"] as const) {
  const ql010 = generate("AVG-QL-010", language);
  assert.doesNotMatch([ql010.stem, ...ql010.options, ...ql010.explanation.lines].join("\n"), /₹₹/);

  for (const qlId of ["AVG-QL-015", "AVG-QL-016", "AVG-QL-018"] as const) {
    const question = generate(qlId, language);
    assert.doesNotMatch(`${question.options.join(" ")} ${question.answer}`, /₹/);
    if (language !== "en") {
      assert.ok([...question.options, question.answer].every((value) => /^\d+$/.test(value)));
    }
  }

  for (const qlId of ["AVG-QL-275", "AVG-QL-302"] as const) {
    const question = generate(qlId, language);
    assert.doesNotMatch(question.stem, /₹₹|\d₹\d|(?:एक दिया गया मान|ਇੱਕ ਦਿੱਤਾ ਮੁੱਲ)/);
  }

  const ql390 = generate("AVG-QL-390", language);
  assert.doesNotMatch(`${ql390.options.join(" ")} ${ql390.answer}`, /₹/);
}

const ql108English = generate("AVG-QL-108", "en");
assert.match(ql108English.explanation.lines[1]!, /\\text\{Required term\}/);
assert.doesNotMatch(ql108English.explanation.lines[1]!, /(^|[^A-Za-z\\])ext\{/);

const ql302Hindi = generate("AVG-QL-302", "hi");
assert.match(ql302Hindi.stem, /औसत दैनिक बिक्री .* हो गई।/);
assert.doesNotMatch(ql302Hindi.stem, /औसत दैनिक बिक्री .* हो गया।/);

console.log("PASS AVG-001 V3.5 targeted audit: all reported defects and QL-302 Hindi agreement are locked.");
