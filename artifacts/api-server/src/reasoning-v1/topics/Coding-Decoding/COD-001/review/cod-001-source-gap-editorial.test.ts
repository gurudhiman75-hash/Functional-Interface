import assert from "node:assert/strict";

import { generateCod001Question } from "../multilingual-runtime";

function strings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) for (const item of value) strings(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value as Record<string, unknown>)) strings(item, output);
  return output;
}

const qlIds = ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"] as const;
const locales = ["hi-IN", "pa-IN"] as const;
const seedsPerQl = 64;
let checked = 0;

for (const qlId of qlIds) {
  for (const locale of locales) {
    for (let seed = 1; seed <= seedsPerQl; seed += 1) {
      const question = generateCod001Question(qlId, locale, seed);
      const explanationText = strings(question.explanation).join(" ");

      assert.doesNotMatch(
        explanationText,
        /(?:चाल|ਚਾਲ)/u,
        `${qlId}/${locale}/${seed} uses mechanical shift wording`,
      );
      assert.doesNotMatch(
        explanationText,
        /ਵਿਆੰਜਨ/u,
        `${qlId}/${locale}/${seed} uses non-canonical Punjabi consonant spelling`,
      );
      assert.doesNotMatch(
        explanationText,
        /(?:विपरीत वर्णमाला अक्षर|ਉਲਟ ਵਰਣਮਾਲਾ ਅੱਖਰ)/u,
        `${qlId}/${locale}/${seed} uses awkward opposite-alphabet phrasing`,
      );

      if (qlId === "COD-QL-201") {
        if (locale === "hi-IN") {
          assert.match(explanationText, /पिछले अक्षर से 1 स्थान अधिक उसी दिशा/u);
          assert.match(explanationText, /इसी बढ़ते क्रम/u);
        } else {
          assert.match(explanationText, /ਪਿਛਲੇ ਅੱਖਰ ਨਾਲੋਂ 1 ਥਾਂ ਵੱਧ ਉਸੇ ਦਿਸ਼ਾ/u);
          assert.match(explanationText, /ਇਸੇ ਵਧਦੇ ਕ੍ਰਮ/u);
        }
      }

      if (qlId === "COD-QL-203") {
        const mappingLines = strings(question.explanation).filter((line) => /→/u.test(line) && /[,:]/u.test(line));
        for (const line of mappingLines) {
          assert.doesNotMatch(line, /[A-Z0-9]\.$/u, `${qlId}/${locale}/${seed} ends a native mapping line with English full stop`);
        }
      }

      checked += 1;
    }
  }
}

assert.equal(checked, qlIds.length * locales.length * seedsPerQl);

console.log(JSON.stringify({
  status: "COD-001 SOURCE-GAP NATIVE EDITORIAL GATE PASSED",
  qlRange: "COD-QL-200..203",
  locales,
  seedsPerQl,
  checkedQuestions: checked,
  mechanicalShiftWording: false,
  nonCanonicalPunjabiConsonantSpelling: false,
  awkwardOppositeAlphabetPhrasing: false,
  englishFullStopOnNativeMappingLine: false,
}, null, 2));
