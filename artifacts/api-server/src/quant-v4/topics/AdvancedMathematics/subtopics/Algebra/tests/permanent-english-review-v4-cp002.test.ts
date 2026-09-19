import fs from "node:fs";
import path from "node:path";

import {
  equalsRational,
  rational,
} from "../../../../../shared/algebra";
import {
  ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP002_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp002EnglishReviewV4,
} from "../permanent/english-review-v4-cp002";
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
const reviewRows: ReturnType<typeof generateAlgCp002EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP002_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<number>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp002EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp002EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-002" && first.packageId === "ALG-001", `${prefix}: chapter/package identity changed`);
    assert(first.prototypeId === prototypeId, `${prefix}: prototype identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    let expected: number;
    if (prototypeId === "ALG-CP002-CAND-003") {
      assert(first.qlId === "ALG-QL-007", `${prefix}: QL-007 identity changed`);
      assert(Math.abs(first.k) >= 2, `${prefix}: x + 1/x state is outside the real exam-safe domain`);
      expected = first.k * first.k - 2;
    } else if (prototypeId === "ALG-CP002-CAND-006") {
      assert(first.qlId === "ALG-QL-007", `${prefix}: QL-007 identity changed`);
      expected = first.k * first.k + 2;
    } else {
      assert(first.qlId === "ALG-QL-008", `${prefix}: QL-008 identity changed`);
      expected = first.k * first.k * first.k + 3 * first.k;
    }
    assert(
      equalsRational(first.canonicalAnswer, rational(BigInt(expected))),
      `${prefix}: reciprocal identity answer mismatch`,
    );

    assert(/[?.]$/.test(first.question), `${prefix}: stem does not end like an exam question`);
    assert(first.explanation.length >= 160, `${prefix}: explanation is too thin`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);

    states.add(first.k);
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+/g, "<n>"));

    if ([9, 27, 51].includes(seed)) reviewRows.push(first);
  }

  const expectedStateCount = prototypeId === "ALG-CP002-CAND-003" ? 34 : 37;
  assert(states.size === expectedStateCount, `${prototypeId}: expected ${expectedStateCount} visible k states, got ${states.size}`);
  assert(questions.size >= expectedStateCount, `${prototypeId}: visible question diversity remains thin`);
  assert(explanations.size >= expectedStateCount, `${prototypeId}: explanation diversity remains thin`);
  assert(frames.size >= 4, `${prototypeId}: fewer than four natural stem frames were exercised`);
}

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const md = [
  "# Algebra CP-002 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP002_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pack remediates only the three reciprocal-transform patterns that remained source-limited after delivery-level distractor remediation.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP002_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic samples: **${ALG_CP002_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- plus-reciprocal square states: **34** distinct real-safe k values",
  "- minus-reciprocal square/cube states: **37** distinct k values each",
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

const mdPath = path.join(outputDir, "algebra-cp002-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);
console.log(
  `ALG-CP002 V4 controlled reopen passed: ${ALG_CP002_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/variety samples; review pack ${mdPath}`,
);
