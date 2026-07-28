import { runMen001Pipeline } from "./pipeline";
import type { Men001ActiveCanonicalProblemId } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function generate(
  cpId: Men001ActiveCanonicalProblemId,
  qlId: string,
  seed: string,
) {
  return runMen001Pipeline(cpId, {
    language: "en",
    questionLanguageId: qlId,
    seed,
  });
}

function shortcut(question: ReturnType<typeof runMen001Pipeline>) {
  return question.explanation.sections.find(
    (section) => section.kind === "EXAM_SHORTCUT",
  );
}

const isosceles = generate(
  "MEN-CP-001",
  "MEN-001-QL-017",
  "men-001-human-review:MEN-001-QL-017:0",
);
assert(shortcut(isosceles), "QL-017 must expose the Pythagorean-triplet exam shortcut.");
assert(
  shortcut(isosceles)!.paragraphs.some((paragraph) => /Pythagorean triplet/.test(paragraph)),
  "QL-017 shortcut must explain why the triplet saves time.",
);

const ratioTriplet = generate(
  "MEN-CP-001",
  "MEN-001-QL-020",
  "men-001-human-review:MEN-001-QL-020:0",
);
assert(shortcut(ratioTriplet), "QL-020 must use the right-triangle shortcut when the generated sides form a triplet.");
assert(
  shortcut(ratioTriplet)!.paragraphs.some((paragraph) => /instead of applying Heron's formula/.test(paragraph)),
  "QL-020 shortcut must explicitly replace Heron's formula only for a valid triplet state.",
);

const ratioNonTriplet = generate(
  "MEN-CP-001",
  "MEN-001-QL-020",
  "men-001-human-review:MEN-001-QL-020:1",
);
assert(shortcut(ratioNonTriplet), "QL-020 must still expose a safe exam-speed block for a non-right triangle.");
assert(
  shortcut(ratioNonTriplet)!.paragraphs.every((paragraph) => !/Pythagorean triplet/.test(paragraph)),
  "QL-020 must not claim a triplet shortcut for a non-right triangle.",
);

const uniformIncrease = generate(
  "MEN-CP-006",
  "MEN-001-QL-414",
  "men-001-human-review:MEN-001-QL-414:1",
);
assert(shortcut(uniformIncrease), "QL-414 must expose the successive-percentage shortcut.");
assert(
  shortcut(uniformIncrease)!.equations.some((equation) => /2\s*\\times\s*20/.test(equation) && /44\\%/.test(equation)),
  "QL-414 shortcut must calculate 2p + p²/100 for p = 20.",
);

const increaseTitles = uniformIncrease.explanation.sections
  .filter((section) => section.kind === "STEP")
  .map((section) => section.title);
assert(increaseTitles.includes("Find the New Area Percentage"), "QL-414 must name the new-area-percentage step explicitly.");
assert(increaseTitles.includes("Find the Percentage Increase"), "QL-414 must name the net-increase step explicitly.");

const uniformDecrease = generate(
  "MEN-CP-006",
  "MEN-001-QL-415",
  "men-001-human-review:MEN-001-QL-415:0",
);
assert(shortcut(uniformDecrease), "QL-415 must expose the uniform-decrease shortcut.");
assert(
  uniformDecrease.explanation.sections.every(
    (section) => section.kind !== "STEP" || section.title !== "Continue the Calculation",
  ),
  "QL-415 must merge adjacent new-area steps instead of emitting a generic continuation heading.",
);

for (const question of [isosceles, ratioTriplet, ratioNonTriplet, uniformIncrease, uniformDecrease]) {
  const paragraphs = question.explanation.sections.flatMap((section) => section.paragraphs).join(" ");
  assert(!/Use the previous result in the next part of the calculation\./.test(paragraphs), `${question.questionLanguageId} retains the previous-result filler sentence.`);
  assert(!/Substitute the supplied measurements into the governing formula\./.test(paragraphs), `${question.questionLanguageId} retains the supplied-measurements filler sentence.`);

  const equations = question.explanation.sections.flatMap((section) => section.equations);
  assert(equations.every((equation) => !/\\text\{Heron\}'s/.test(equation)), `${question.questionLanguageId} retains the broken Heron possessive.`);
  assert(equations.every((equation) => !/\\text\{(?:m|cm)\}\^2/.test(equation)), `${question.questionLanguageId} retains an unbraced square-unit exponent.`);
}

console.log("MEN-001 exam-strategy polish passed: dynamic shortcuts, actionable steps and LaTeX normalization verified.");
