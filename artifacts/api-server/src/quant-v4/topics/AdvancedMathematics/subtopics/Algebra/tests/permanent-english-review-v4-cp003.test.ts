import fs from "node:fs";
import path from "node:path";

import {
  addRational,
  divideRational,
  equalsRational,
  rational,
} from "../../../../../shared/algebra";
import {
  ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP003_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp003EnglishReviewV4,
  type AlgCp003ReviewV4PrototypeId,
} from "../permanent/english-review-v4-cp003";
import { ALG_ENGLISH_V3_FREEZE_ID } from "../permanent/english-freeze-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function visibleState(item: ReturnType<typeof generateAlgCp003EnglishReviewV4>) {
  return item.state.kind === "ZERO_SUM_PAIRWISE"
    ? `squareSum:${item.state.squareSum}`
    : `q:${item.state.q}:q2:${item.state.squareCoefficient}`;
}

function verifySemantics(item: ReturnType<typeof generateAlgCp003EnglishReviewV4>, prefix: string) {
  if (item.state.kind === "ZERO_SUM_PAIRWISE") {
    const expected = divideRational(
      rational(BigInt(-item.state.squareSum)),
      rational(2n),
    );
    assert(
      equalsRational(item.canonicalAnswer, expected),
      `${prefix}: zero-sum pairwise identity answer mismatch`,
    );
    return;
  }

  const q = rational(BigInt(item.state.q));
  const coefficient = rational(BigInt(item.state.squareCoefficient));
  const first = addRational(
    item.state.witnessA,
    divideRational(coefficient, item.state.witnessB),
  );
  const second = addRational(
    item.state.witnessB,
    divideRational(coefficient, item.state.witnessC),
  );
  const target = addRational(
    item.state.witnessC,
    divideRational(coefficient, item.state.witnessA),
  );

  assert(equalsRational(first, q), `${prefix}: first cyclic relation failed`);
  assert(equalsRational(second, q), `${prefix}: second cyclic relation failed`);
  assert(equalsRational(target, q), `${prefix}: target cyclic relation failed`);
  assert(equalsRational(item.canonicalAnswer, q), `${prefix}: cyclic canonical answer mismatch`);
}

const samplesPerTarget = 64;
const reviewRows: ReturnType<typeof generateAlgCp003EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP003_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const questions = new Set<string>();
  const explanations = new Set<string>();
  const frames = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp003EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp003EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-003" && first.packageId === "ALG-001", `${prefix}: chapter/package identity changed`);
    assert(first.prototypeId === prototypeId, `${prefix}: prototype identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only content state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    if (prototypeId === "ALG-CP003-CAND-004") {
      assert(first.qlId === "ALG-QL-011", `${prefix}: QL-011 identity changed`);
      assert(first.state.kind === "ZERO_SUM_PAIRWISE", `${prefix}: wrong source state kind`);
    } else {
      assert(first.qlId === "ALG-QL-013", `${prefix}: QL-013 identity changed`);
      assert(first.state.kind === "CYCLIC_RECIPROCAL", `${prefix}: wrong source state kind`);
      assert(first.state.squareCoefficient === first.state.q * first.state.q, `${prefix}: cyclic coefficient must remain q²`);
    }

    verifySemantics(first, prefix);

    assert(/[?\.]$/.test(first.question), `${prefix}: stem does not end like an exam question`);
    assert(first.explanation.length >= 150, `${prefix}: explanation is too thin`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
    assert(!first.explanation.includes("--"), `${prefix}: double-minus learner notation leaked`);

    states.add(visibleState(first));
    questions.add(first.question);
    explanations.add(first.explanation);
    frames.add(first.question.replace(/-?\d+/g, "<n>"));

    if ([7, 19, 37].includes(seed)) reviewRows.push(first);
  }

  const minimumStateCount = prototypeId === "ALG-CP003-CAND-004" ? 34 : 32;
  assert(states.size >= minimumStateCount, `${prototypeId}: visible mathematical state pool remains thin (${states.size}/64 unique)`);
  assert(questions.size >= minimumStateCount, `${prototypeId}: visible question diversity remains thin (${questions.size}/64 unique)`);
  assert(explanations.size >= minimumStateCount, `${prototypeId}: explanation diversity remains thin (${explanations.size}/64 unique)`);
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
  "# Algebra CP-003 Controlled Source Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP003_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "The healthy CP-003 patterns remain untouched. This pack remediates only ALG-CP003-CAND-004 / ALG-QL-011 and ALG-CP003-CAND-006 / ALG-QL-013.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP003_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic semantic samples: **${ALG_CP003_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- CAND-004 minimum visible mathematical states: **34/64**",
  "- CAND-006 minimum visible mathematical states: **32/64**",
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

const mdPath = path.join(outputDir, "algebra-cp003-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP003 V4 controlled reopen passed: ${ALG_CP003_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} semantic/variety samples; review pack ${mdPath}`,
);
