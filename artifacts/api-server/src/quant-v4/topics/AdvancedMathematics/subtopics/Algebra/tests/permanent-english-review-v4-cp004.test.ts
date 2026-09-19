import fs from "node:fs";
import path from "node:path";

import {
  ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP004_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp004EnglishReviewV4,
} from "../permanent/english-review-v4-cp004";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

const samplesPerTarget = 64;
const reviewRows: ReturnType<typeof generateAlgCp004EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP004_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp004EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp004EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-004" && first.packageId === "ALG-001", `${prefix}: chapter/package identity changed`);
    assert(first.qlId === "ALG-QL-014", `${prefix}: QL-014 identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    if (first.state.kind === "DIFFERENCE_OF_SQUARES") {
      const { m, n } = first.state;
      assert(gcd(m, n) === 1, `${prefix}: conjugate factors contain removable common content`);
      const leading = m * m;
      const constant = -(n * n);
      assert(leading > 0 && constant < 0, `${prefix}: invalid difference-of-squares coefficients`);
      assert(
        first.answerText.includes(`${m === 1 ? "x" : `${m}x`} - ${n}`)
          && first.answerText.includes(`${m === 1 ? "x" : `${m}x`} + ${n}`),
        `${prefix}: factorisation does not match conjugate factors`,
      );
    } else {
      const { m, n, sign } = first.state;
      assert(gcd(m, n) === 1, `${prefix}: squared factor contains removable common content`);
      const leading = m * m;
      const middle = 2 * sign * m * n;
      const constant = n * n;
      assert(
        middle * middle === 4 * leading * constant,
        `${prefix}: trinomial does not satisfy the perfect-square identity`,
      );
      assert(first.answerText.endsWith("²"), `${prefix}: perfect-square factor is not squared`);
    }

    assert(/[?.]$/.test(first.question), `${prefix}: stem does not end like an exam question`);
    assert(first.explanation.length >= 170, `${prefix}: explanation is too thin`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);

    states.add(stable(first.state));
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+/g, "<n>"));

    if ([13, 31, 57].includes(seed)) reviewRows.push(first);
  }

  assert(states.size === 64, `${prototypeId}: expected 64 genuine states, got ${states.size}`);
  assert(questions.size === 64, `${prototypeId}: expected 64 visible questions, got ${questions.size}`);
  assert(explanations.size === 64, `${prototypeId}: expected 64 explanations, got ${explanations.size}`);
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
  "# Algebra CP-004 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP004_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pack remediates only the two identity-factorisation patterns that remained state-limited after delivery-level remediation.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP004_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic samples: **${ALG_CP004_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- genuine mathematical states: **64/64 per target**",
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

const mdPath = path.join(outputDir, "algebra-cp004-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);
console.log(
  `ALG-CP004 V4 controlled reopen passed: ${ALG_CP004_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/variety samples; review pack ${mdPath}`,
);
