import { PNL_001_CANONICAL_REVIEW_LIBRARY } from "./question-studio-review.library";
import { runPnlCp001DynamicPipeline } from "./CP-001/cp001-dynamic-runtime";
import { runPnlCp002DynamicPipeline } from "./CP-002/cp002-dynamic-runtime";
import { runPnlCp003DynamicPipeline } from "./CP-003/cp003-dynamic-runtime";
import { runPnlCp004DynamicPipeline } from "./CP-004/cp004-dynamic-runtime";
import { runPnlCp005DynamicPipeline } from "./CP-005/cp005-dynamic-runtime";
import { runPnlCp006DynamicPipeline } from "./CP-006/cp006-dynamic-runtime";

type ReviewEntry = Readonly<{
  qlId: string;
  cpId: string;
  stem: string;
  options: readonly string[];
  answer: string;
}>;

type ReviewLibrary = Readonly<{
  entries: Readonly<Record<string, ReviewEntry>>;
}>;

type DynamicPackage = Readonly<{
  questionLanguageId: string;
  stem: string;
  answer: string;
  parameters: Readonly<{
    variables: Readonly<Record<string, unknown>>;
  }>;
}>;

type DynamicRun = (input: Readonly<{
  questionLanguageId?: string;
  language?: "en";
  seed?: string;
}>) => DynamicPackage;

const library = PNL_001_CANONICAL_REVIEW_LIBRARY as ReviewLibrary;
const entries = Object.values(library.entries);
const runtimeByCp = new Map<string, DynamicRun>([
  ["PNL-CP-001", runPnlCp001DynamicPipeline as DynamicRun],
  ["PNL-CP-002", runPnlCp002DynamicPipeline as DynamicRun],
  ["PNL-CP-003", runPnlCp003DynamicPipeline as DynamicRun],
  ["PNL-CP-004", runPnlCp004DynamicPipeline as DynamicRun],
  ["PNL-CP-005", runPnlCp005DynamicPipeline as DynamicRun],
  ["PNL-CP-006", runPnlCp006DynamicPipeline as DynamicRun],
]);

const seedAuthorities = [
  { name: "runtime-default", seed: (qlId: string) => `${qlId}:dynamic-default` },
  { name: "canonical-review", seed: (qlId: string) => `${qlId}:canonical-review` },
  { name: "wave03-runtime-review", seed: (qlId: string) => `${qlId}:wave03-runtime-review` },
  { name: "review-fixture", seed: (qlId: string) => `${qlId}:review-fixture` },
  { name: "canonical-prefix", seed: (qlId: string) => `canonical-review:${qlId}` },
  { name: "question-studio", seed: (qlId: string) => `pnl-question-studio:${qlId}` },
] as const;

function numericTokens(value: string): readonly string[] {
  return [...value.matchAll(/(?:₹\s*)?\d[\d,]*(?:\.\d+)?%?/g)]
    .map((match) => match[0]!.replace(/[₹,\s]/g, ""))
    .sort();
}

function normalizedAnswer(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .trim()
    .toLowerCase();
}

const results = seedAuthorities.map((authority) => {
  let numericStemMatches = 0;
  let exactAnswerMatches = 0;
  let bothMatch = 0;
  const mismatchSamples: unknown[] = [];

  for (const entry of entries) {
    const run = runtimeByCp.get(entry.cpId);
    if (!run) throw new Error(`${entry.cpId}: dynamic runtime missing.`);
    const generated = run({
      questionLanguageId: entry.qlId,
      language: "en",
      seed: authority.seed(entry.qlId),
    });
    const stemMatch =
      JSON.stringify(numericTokens(generated.stem)) ===
      JSON.stringify(numericTokens(entry.stem));
    const answerMatch =
      normalizedAnswer(generated.answer) === normalizedAnswer(entry.answer);
    if (stemMatch) numericStemMatches += 1;
    if (answerMatch) exactAnswerMatches += 1;
    if (stemMatch && answerMatch) bothMatch += 1;
    if ((!stemMatch || !answerMatch) && mismatchSamples.length < 4) {
      mismatchSamples.push({
        qlId: entry.qlId,
        canonicalNumbers: numericTokens(entry.stem),
        generatedNumbers: numericTokens(generated.stem),
        canonicalAnswer: entry.answer,
        generatedAnswer: generated.answer,
        variableKeys: Object.keys(generated.parameters.variables).sort(),
      });
    }
  }

  return {
    authority: authority.name,
    numericStemMatches,
    exactAnswerMatches,
    bothMatch,
    mismatchSamples,
  };
});

console.log(
  JSON.stringify(
    {
      entryCount: entries.length,
      canonicalContextObjects: 0,
      candidateSeedResults: results,
    },
    null,
    2,
  ),
);

const exactAuthority = results.find((result) => result.bothMatch === entries.length);
if (!exactAuthority) {
  throw new Error(
    "No known dynamic seed authority reproduces all reviewed canonical fixture values.",
  );
}
