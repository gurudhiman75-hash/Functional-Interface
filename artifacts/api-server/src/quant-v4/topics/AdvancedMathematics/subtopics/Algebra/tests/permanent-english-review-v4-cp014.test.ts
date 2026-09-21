import fs from "node:fs";
import path from "node:path";

import {
  compareRationalPossibilitySets,
  compareRationalQuantities,
} from "../../../../../shared/algebra";
import { generateAlgCp014DiscoveryItem } from "../ALG-002/ALG-CP-014";
import {
  ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP014_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp014EnglishReviewV4,
} from "../permanent/english-review-v4-cp014";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function numericSpecificity(text: string) {
  return (text.match(/-?\d+(?:\/\d+)?/g) ?? []).length;
}

const samplesPerTarget = 64;
const reviewRows: ReturnType<typeof generateAlgCp014EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP014_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp014EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp014EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-014" && first.packageId === "ALG-002", `${prefix}: package identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);
    assert(first.explanation.length >= 190, `${prefix}: explanation is too thin`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);

    if (prototypeId === "ALG-CP014-CAND-002" || prototypeId === "ALG-CP014-CAND-003") {
      assert(first.qlId === "ALG-QL-039", `${prefix}: quantity-comparison QL identity changed`);
      assert(first.math.kind === "SET_QC", `${prefix}: expected set quantity-comparison state`);
      assert(first.answer.kind === "QUANTITY_RELATION", `${prefix}: expected quantity-comparison answer`);
      const expected = compareRationalPossibilitySets(first.math.quantityIValues, first.math.quantityIIValues);
      assert(first.answer.value === expected, `${prefix}: quantity relation does not match the exact state`);

      const lowVsHigh = compareRationalQuantities(first.math.quantityIValues[0]!, first.math.quantityIIValues[1]!);
      const highVsLow = compareRationalQuantities(first.math.quantityIValues[1]!, first.math.quantityIIValues[0]!);
      if (prototypeId === "ALG-CP014-CAND-003") {
        assert(lowVsHigh !== highVsLow, `${prefix}: indeterminate case does not demonstrate changing relations`);
      } else {
        assert(lowVsHigh === highVsLow, `${prefix}: determinate case changes relation across extreme pairings`);
      }
    } else {
      assert(first.qlId === "ALG-QL-040", `${prefix}: data-sufficiency QL identity changed`);
      assert(first.answer.kind === "DATA_SUFFICIENCY", `${prefix}: expected data-sufficiency answer`);
      const baseline = generateAlgCp014DiscoveryItem(prototypeId, seed);
      assert(baseline.answer.kind === "DATA_SUFFICIENCY", `${prefix}: baseline answer kind changed`);
      assert(first.answer.value === baseline.answer.value, `${prefix}: V4 changed the retained data-sufficiency verdict`);
      assert(numericSpecificity(first.explanation) >= 3, `${prefix}: explanation lacks question-specific numerical working`);
      assert(first.question.includes("I.") && first.question.includes("II."), `${prefix}: data-sufficiency statements are not visible in the review question`);
      assert(!/Therefore,?\s+(?:Either|Even|Both)/.test(first.explanation), `${prefix}: final verdict sentence has awkward capitalization`);
      if (prototypeId === "ALG-CP014-CAND-006") {
        const lines = first.question.split("\n");
        assert(lines[1] !== lines[2], `${prefix}: either-alone case repeats the exact same statement twice`);
      }
      if (prototypeId === "ALG-CP014-CAND-007") {
        assert(/x = -?\d/.test(first.explanation) && /y = -?\d/.test(first.explanation), `${prefix}: combined-system explanation must show the solved x and y values`);
      }
      if (prototypeId === "ALG-CP014-CAND-008") {
        assert(/times those in Statement I/.test(first.explanation), `${prefix}: dependent-system explanation must show the concrete row multiple`);
      }
    }

    states.add(stable(first.math));
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+(?:\/\d+)?/g, "<n>"));

    if ([7, 30, 53].includes(seed)) reviewRows.push(first);
  }

  if (prototypeId === "ALG-CP014-CAND-002" || prototypeId === "ALG-CP014-CAND-003") {
    assert(states.size === 64, `${prototypeId}: expected 64 genuine comparison states, got ${states.size}`);
    assert(questions.size === 64, `${prototypeId}: expected 64 visible questions, got ${questions.size}`);
    assert(explanations.size === 64, `${prototypeId}: expected 64 question-specific explanations, got ${explanations.size}`);
    assert(frames.size >= 4, `${prototypeId}: fewer than four natural comparison frames were exercised`);
  } else {
    assert(states.size >= 32, `${prototypeId}: source state diversity remains too narrow (${states.size}/64)`);
    assert(explanations.size >= 32, `${prototypeId}: question-specific explanation diversity remains too narrow (${explanations.size}/64)`);
  }
}

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const md = [
  "# Algebra CP-014 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP014_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "CAND-001 is deliberately untouched because the post-delivery audit already scores it at 98/100.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP014_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic/explanation samples: **${ALG_CP014_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- CAND-002 and CAND-003: **64/64 distinct mathematical states each**",
  "- data sufficiency CAND-004..008: **question-specific numerical explanations**",
  "- retained verdicts: **replayed against the existing CP-014 generator**",
  "- lifecycle: **review-only; no Question Bank/test/public promotion**",
  "",
  "## Human-review sample",
  "",
  ...reviewRows.flatMap((row, index) => [
    `### ${index + 1}. ${row.prototypeId} / ${row.qlId} — seed ${row.seed}`,
    "",
    row.question,
    "",
    `**Answer:** ${row.answerText}`,
    "",
    `**Explanation:** ${row.explanation}`,
    "",
  ]),
].join("\n");

const mdPath = path.join(outputDir, "algebra-cp014-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP014 V4 controlled reopen passed: ${ALG_CP014_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/explanation samples; review pack ${mdPath}`,
);
