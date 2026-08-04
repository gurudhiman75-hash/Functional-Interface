import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let generated = 0;
for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    const question = generateSylQuestion(definition.qlId, seed, "en-IN");
    const explanation = question.explanation;

    for (const point of explanation.tier1Concept.premiseBreakdown) {
      assert(
        !/^No .+ is .+$/u.test(point.compactRule),
        `${definition.qlId}/${seed} uses singular grammar after a plural category: ${point.compactRule}`,
      );
      assert(
        !/^At least one [a-z]+s stays outside /iu.test(point.naturalRule),
        `${definition.qlId}/${seed} uses a plural category as a singular member: ${point.naturalRule}`,
      );
    }

    assert(
      !/^Rewrite ‘Only/u.test(explanation.tier3Shortcut.shortcut),
      `${definition.qlId}/${seed} retains advanced rewrite wording.`,
    );
    assert(
      !/^Split ‘Only a few/u.test(explanation.tier3Shortcut.shortcut),
      `${definition.qlId}/${seed} retains advanced split wording.`,
    );
    generated += 1;
  }
}

assert(generated === 18 * 80, `Expected 1440 English questions, generated ${generated}.`);
console.log(JSON.stringify({
  status: "SYL-001 weak-English language audit passed",
  generatedEnglishQuestions: generated,
  rejectedPatterns: [
    "No plural is plural",
    "At least one plural stays outside",
    "Rewrite-only jargon",
    "Split-only-a-few jargon",
  ],
}, null, 2));
