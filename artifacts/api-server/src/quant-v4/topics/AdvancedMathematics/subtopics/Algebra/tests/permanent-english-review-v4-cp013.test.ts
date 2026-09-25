import fs from "node:fs";
import path from "node:path";

import {
  divideRational,
  formatRational,
  negateRational,
} from "../../../../../shared/algebra";
import { generateAlgCp013DiscoveryItem } from "../ALG-002/ALG-CP-013";
import {
  ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP013_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp013EnglishReviewV4,
} from "../permanent/english-review-v4-cp013";
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
const reviewRows: ReturnType<typeof generateAlgCp013EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP013_ENGLISH_REVIEW_V4_TARGETS) {
  const states = new Set<string>();
  const explanations = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const first = generateAlgCp013EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp013EnglishReviewV4(prototypeId, seed);
    const baseline = generateAlgCp013DiscoveryItem(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-013" && first.packageId === "ALG-002", `${prefix}: CP/package identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    // This pass is explanation-only: learner question, exact state and answer
    // must remain byte-for-byte equivalent to the active source generator.
    assert(first.question === baseline.stem, `${prefix}: explanation pass changed the question`);
    assert(stable(first.math) === stable(baseline.math), `${prefix}: explanation pass changed the math state`);
    assert(stable(first.answer) === stable(baseline.answer), `${prefix}: explanation pass changed the canonical answer`);

    assert(first.explanation.length >= 190, `${prefix}: explanation is too thin`);
    assert(numericSpecificity(first.explanation) >= 2, `${prefix}: explanation lacks question-specific numerical working`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
    assert(!/Therefore[^.]*, so /i.test(first.explanation), `${prefix}: redundant conclusion wording leaked`);

    if (prototypeId === "ALG-CP013-CAND-004") {
      assert(first.qlId === "ALG-QL-037", `${prefix}: absolute-equation QL changed`);
      assert(first.math.kind === "ABS_EQUATION", `${prefix}: expected absolute-equation state`);
      assert(first.math.rhs.numerator < 0n, `${prefix}: CAND-004 must retain a negative right-hand side`);
      assert(/always at least 0/.test(first.explanation), `${prefix}: non-negativity reasoning is missing`);
    } else {
      assert(first.qlId === "ALG-QL-038", `${prefix}: absolute-inequality QL changed`);
      assert(first.math.kind === "ABS_INEQUALITY", `${prefix}: expected absolute-inequality state`);
      assert(first.math.rhs.numerator === 0n, `${prefix}: CAND-007 must retain zero boundary`);
      const root = divideRational(negateRational(first.math.b), first.math.a);
      assert(
        first.explanation.includes(`x = ${formatRational(root)}`),
        `${prefix}: zero-boundary explanation does not show the actual root`,
      );
      assert(
        first.explanation.includes(first.math.operator === "GE" ? "equality (≥ 0)" : "strict inequality"),
        `${prefix}: explanation does not distinguish ≥ from >`,
      );
    }

    states.add(stable(first.math));
    explanations.add(first.explanation);

    if ([7, 29, 53].includes(seed)) reviewRows.push(first);
  }

  assert(states.size >= 32, `${prototypeId}: active source state diversity unexpectedly narrowed (${states.size}/64)`);
  assert(explanations.size >= 32, `${prototypeId}: explanation diversity remains too narrow (${explanations.size}/64)`);
}

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const md = [
  "# Algebra CP-013 Controlled Explanation Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP013_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pass changes explanations only for CAND-004 and CAND-007. Questions, mathematical states and canonical answers are replayed unchanged from the active CP-013 source generator.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP013_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic explanation samples: **${ALG_CP013_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- source question/state/answer parity: **required for every sample**",
  "- explanation diversity: **at least 32/64 per target**",
  "- CAND-004: **explicit negative-RHS impossibility reasoning**",
  "- CAND-007: **actual zero point shown and > / ≥ distinction explained**",
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

const mdPath = path.join(outputDir, "algebra-cp013-source-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP013 V4 explanation reopen passed: ${ALG_CP013_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} parity/explanation samples; review pack ${mdPath}`,
);
