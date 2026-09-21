import fs from "node:fs";
import path from "node:path";

import {
  equalsRational,
  rational,
} from "../../../../../shared/algebra";
import {
  ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP012_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp012EnglishReviewV4,
} from "../permanent/english-review-v4-cp012";
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
const reviewRows: ReturnType<typeof generateAlgCp012EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP012_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp012EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp012EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-012" && first.packageId === "ALG-002", `${prefix}: CP/package identity changed`);
    assert(first.qlId === "ALG-QL-043", `${prefix}: QL-043 identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);
    assert(first.state.sum >= 6 && first.state.sum <= 41, `${prefix}: fixed sum is outside the exam-safe review pool`);
    assert(
      equalsRational(first.balancedVariable, rational(BigInt(first.state.sum), 3n)),
      `${prefix}: equality-state value must be sum/3`,
    );

    if (prototypeId === "ALG-CP012-CAND-011") {
      assert(first.state.target === "RECIPROCAL_SUM", `${prefix}: reciprocal target changed`);
      assert(
        equalsRational(first.canonicalAnswer, rational(9n, BigInt(first.state.sum))),
        `${prefix}: reciprocal Cauchy bound mismatch`,
      );
      assert(first.explanation.includes("(x + y + z)(1/x + 1/y + 1/z)"), `${prefix}: Cauchy reciprocal working is missing`);
    } else {
      assert(first.state.target === "SQUARE_SUM", `${prefix}: square-sum target changed`);
      assert(
        equalsRational(first.canonicalAnswer, rational(BigInt(first.state.sum * first.state.sum), 3n)),
        `${prefix}: square-sum Cauchy bound mismatch`,
      );
      assert(first.explanation.includes("(x + y + z)²"), `${prefix}: Cauchy square-sum working is missing`);
    }

    assert(first.explanation.length >= 185, `${prefix}: explanation is too thin`);
    assert(first.explanation.includes("x = y = z"), `${prefix}: equality condition is missing`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
    assert(!/(\d+\/\d+) = \1/.test(first.explanation), `${prefix}: tautological fraction simplification leaked`);

    states.add(stable(first.state));
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+(?:\/\d+)?/g, "<n>"));

    if ([7, 25, 35].includes(seed)) reviewRows.push(first);
  }

  assert(states.size === 36, `${prototypeId}: expected 36 distinct mathematical states, got ${states.size}`);
  assert(questions.size >= 36, `${prototypeId}: visible question diversity remains thin`);
  assert(explanations.size === 36, `${prototypeId}: explanation diversity remains thin`);
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
  "# Algebra CP-012 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP012_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pass remediates only ALG-CP012-CAND-011 and CAND-012 under ALG-QL-043.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP012_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic samples: **${ALG_CP012_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- distinct mathematical states: **36 per target**",
  "- natural stem frames: **4 per target**",
  "- equality state: **x = y = z = sum/3 explicitly verified**",
  "- Cauchy lower bounds: **independently verified with exact rationals**",
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

const mdPath = path.join(outputDir, "algebra-cp012-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP012 V4 controlled reopen passed: ${ALG_CP012_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/variety samples; review pack ${mdPath}`,
);
