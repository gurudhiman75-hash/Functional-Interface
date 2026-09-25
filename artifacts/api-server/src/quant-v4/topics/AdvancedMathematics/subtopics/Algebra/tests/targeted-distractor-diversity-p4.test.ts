import {
  ALGEBRA_QUESTION_STUDIO_PATTERNS,
} from "../algebra-question-studio-runtime-v1";
import {
  generateAlgebraStudioQuestionV4,
} from "../algebra-question-studio-runtime-v4";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function signature(options: readonly string[], correctIndex: number) {
  return options.filter((_option, index) => index !== correctIndex).slice().sort().join(" | ");
}

const targets = [
  "ALG-CP009-CAND-002",
  "ALG-CP012-CAND-009",
] as const;

for (const patternId of targets) {
  const pattern = ALGEBRA_QUESTION_STUDIO_PATTERNS.find((row) => row.prototypeId === patternId);
  assert(pattern, `${patternId}: pattern not registered`);

  const signatures = new Set<string>();
  const canonicalAnswers = new Set<string>();

  for (let index = 0; index < 32; index += 1) {
    const seed = `algebra-targeted-distractor-p4:${patternId}:${index}`;
    const first = generateAlgebraStudioQuestionV4({ pattern, language: "en", examProfile: "SSC_CORE", seed });
    const replay = generateAlgebraStudioQuestionV4({ pattern, language: "en", examProfile: "SSC_CORE", seed });

    assert(JSON.stringify(first) === JSON.stringify(replay), `${patternId}/${index}: replay is not deterministic`);
    assert(first.validation.valid, `${patternId}/${index}: delivery validation failed`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${patternId}/${index}: options not four-distinct`);
    assert(first.options[first.correctIndex] === first.answer, `${patternId}/${index}: answer parity failed`);
    assert(first.validation.frozenSourcePreserved, `${patternId}/${index}: frozen source lifecycle was not preserved`);
    assert(first.validation.questionBankLocked && first.validation.testMockLocked && first.validation.publicationLocked, `${patternId}/${index}: lifecycle lock leaked`);

    signatures.add(signature(first.options, first.correctIndex));
    canonicalAnswers.add(JSON.stringify(first.canonicalAnswer));
  }

  assert(signatures.size >= 4, `${patternId}: distractor strategy surface still too repetitive (${signatures.size}/32 signatures)`);
  assert(canonicalAnswers.size >= 4, `${patternId}: source-state diversity unexpectedly collapsed (${canonicalAnswers.size}/32 answers)`);
}

console.log("Targeted Algebra distractor diversity P4 passed for CP009 CAND-002 and CP012 CAND-009.");
