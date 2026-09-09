import { generateEng001Cp001QuestionV3 } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v3";
import {
  buildEng001Cp001CandidateV3,
  rulesForDifficultyV3,
  semanticDomainOf,
} from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v3";
import { buildEng001Cp001ReviewV3Markdown } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-review-v3-export";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const domains = new Set<string>();
  const surfaces = new Set<string>();
  for (const ruleId of rulesForDifficultyV3(difficulty)) {
    for (let index = 0; index < 160; index += 1) {
      const seed = `v3-candidate:${difficulty}:${ruleId}:${index}`;
      const candidate = buildEng001Cp001CandidateV3({ ruleId, difficulty, seed });
      const changed = candidate.correctSegments
        .map((segment, position) => segment === candidate.errorSegments[position] ? -1 : position)
        .filter((position) => position >= 0);
      assert(changed.length === 1 && changed[0] === candidate.errorIndex, `${seed} changed more than one segment`);
      assert(candidate.correctSegments.every((segment) => segment.trim().length > 0), `${seed} contains an empty segment`);
      const domain = semanticDomainOf(candidate);
      assert(Boolean(domain), `${seed} lacks a semantic domain tag`);
      domains.add(domain!);
      surfaces.add(candidate.correctSegments.join(" "));
    }
  }
  assert(domains.size >= 12, `${difficulty} covers only ${domains.size} semantic domains`);
  assert(surfaces.size >= 80, `${difficulty} exposes only ${surfaces.size} distinct sentence surfaces`);
}

for (const qlId of ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (let index = 0; index < 200; index += 1) {
      const input = { qlId, difficulty, seed: `v3-question:${qlId}:${difficulty}:${index}` } as const;
      const first = generateEng001Cp001QuestionV3(input);
      const second = generateEng001Cp001QuestionV3(input);
      assert(stable(first) === stable(second), `Non-deterministic question for ${input.seed}`);
      assert(first.explanation.includes(first.correctedSentence), `${first.questionId} omits corrected sentence`);
      if (qlId === "ENG-001-QL002") {
        assert(first.segments.length === 3, `${first.questionId} must have three sentence segments`);
      }
      if (qlId === "ENG-001-QL007") {
        assert(first.options[first.correctOptionIndex] === "No error", `${first.questionId} must key No error`);
      }
    }
  }
}

const review = buildEng001Cp001ReviewV3Markdown();
for (const heading of ["## Easy", "## Medium", "## Hard"]) {
  assert(review.includes(heading), `Review export missing ${heading}`);
}
assert(review.includes("domain:" ) === false, "Review should show human-readable domain labels, not internal tags");
assert(review.includes("SEMANTICALLY_DIVERSE"), "Review export missing V3 diversity status");

console.log("ENG-001-CP001 V3 semantic-diversity tests passed.");
