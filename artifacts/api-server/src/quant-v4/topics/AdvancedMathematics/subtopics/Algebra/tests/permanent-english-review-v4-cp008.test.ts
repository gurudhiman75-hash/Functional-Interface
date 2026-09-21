import fs from "node:fs";
import path from "node:path";

import {
  equalsRational,
  rational,
  solveRationalEquationOverRationals,
} from "../../../../../shared/algebra";
import {
  ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP008_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp008EnglishReviewV4,
} from "../permanent/english-review-v4-cp008";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

const samplesPerTarget = 64;
const reviewRows: ReturnType<typeof generateAlgCp008EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP008_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();
  const booleanOutcomes = new Set<boolean>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp008EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp008EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-008" && first.packageId === "ALG-002", `${prefix}: CP/package identity changed`);
    assert(first.qlId === "ALG-QL-024", `${prefix}: QL-024 identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);
    assert(first.explanation.length >= 190, `${prefix}: explanation is too thin`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
    assert(!first.question.includes("(0)/(1)") && !first.question.includes("(1)/(1)"), `${prefix}: constant side is rendered as a trivial fraction`);
    assert(!/including any excluded value/i.test(first.question), `${prefix}: ambiguous excluded-value wording leaked`);

    if (prototypeId === "ALG-CP001-CAND-006") {
      assert(first.state.kind === "DOMAIN_CHECK", `${prefix}: wrong domain-check state`);
      assert(first.answer.kind === "BOOLEAN", `${prefix}: wrong domain-check answer kind`);
      const expected = first.state.denominatorValue !== 0;
      assert(first.state.defined === expected, `${prefix}: domain state is inconsistent`);
      assert(first.answer.value === expected, `${prefix}: domain-check answer mismatch`);
      booleanOutcomes.add(first.answer.value);
    } else {
      assert(first.equation, `${prefix}: rational equation is missing`);
      const solved = solveRationalEquationOverRationals(first.equation);

      if (prototypeId === "ALG-CP008-CAND-005") {
        assert(first.state.kind === "NO_VALID_ROOT", `${prefix}: wrong no-root state`);
        assert(first.answer.kind === "NO_SOLUTION", `${prefix}: wrong no-solution answer kind`);
        assert(solved.kind === "NO_SOLUTION", `${prefix}: exact solver did not confirm no solution`);
      } else {
        assert(first.state.kind === "INFINITE_ON_DOMAIN", `${prefix}: wrong restricted-domain state`);
        assert(first.answer.kind === "INFINITE_ON_DOMAIN", `${prefix}: wrong infinite-domain answer kind`);
        assert(solved.kind === "INFINITE_ON_DOMAIN", `${prefix}: exact solver did not confirm infinite-on-domain solution`);
        assert(solved.excludedValues.length === 1, `${prefix}: expected one excluded value`);
        assert(
          equalsRational(solved.excludedValues[0]!, rational(BigInt(first.state.excluded))),
          `${prefix}: excluded value mismatch`,
        );
      }
    }

    states.add(stable(first.state));
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+(?:\/\d+)?/g, "<n>"));

    if ([7, 29, 53].includes(seed)) reviewRows.push(first);
  }

  assert(states.size === 64, `${prototypeId}: expected 64 distinct mathematical states, got ${states.size}`);
  assert(questions.size === 64, `${prototypeId}: expected 64 visible questions, got ${questions.size}`);
  assert(explanations.size === 64, `${prototypeId}: expected 64 question-specific explanations, got ${explanations.size}`);
  assert(frames.size >= 4, `${prototypeId}: fewer than four natural stem frames were exercised`);
  if (prototypeId === "ALG-CP001-CAND-006") {
    assert(booleanOutcomes.size === 2, "Domain-check review must exercise both defined and undefined outcomes");
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
  "# Algebra CP-008 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP008_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pass targets only the two low-state rational-equation families plus the thin legacy domain-check explanation.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP008_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic samples: **${ALG_CP008_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- distinct mathematical states: **64/64 per target**",
  "- domain check: **both defined and undefined outcomes exercised**",
  "- rational equations: **independently verified by the exact solver**",
  "- natural stem frames: **4 per target**",
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

const mdPath = path.join(outputDir, "algebra-cp008-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP008 V4 controlled reopen passed: ${ALG_CP008_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/variety samples; review pack ${mdPath}`,
);
