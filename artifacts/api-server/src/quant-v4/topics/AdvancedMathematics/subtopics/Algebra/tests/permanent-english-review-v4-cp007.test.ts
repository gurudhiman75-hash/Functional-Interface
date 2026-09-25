import fs from "node:fs";
import path from "node:path";

import { formatRational, solveLinearSystem2V } from "../../../../../shared/algebra";
import { generateAlgCp007DiscoveryItem } from "../ALG-002/ALG-CP-007";
import {
  ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY,
  ALG_CP007_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp007EnglishReviewV4,
} from "../permanent/english-review-v4-cp007";
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
const reviewRows: ReturnType<typeof generateAlgCp007EnglishReviewV4>[] = [];

for (const prototypeId of ALG_CP007_ENGLISH_REVIEW_V4_TARGETS) {
  const explanations = new Set<string>();
  const states = new Set<string>();

  for (let seed = 1; seed <= samplesPerTarget; seed += 1) {
    const baseline = generateAlgCp007DiscoveryItem(prototypeId, seed);
    const first = generateAlgCp007EnglishReviewV4(prototypeId, seed);
    const replay = generateAlgCp007EnglishReviewV4(prototypeId, seed);
    const prefix = `${prototypeId}/seed-${seed}`;

    assert(stable(first) === stable(replay), `${prefix}: generation is not deterministic`);
    assert(first.authority === ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY, `${prefix}: wrong authority`);
    assert(first.sourceFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: source freeze reference missing`);
    assert(first.cpId === "ALG-CP-007" && first.packageId === "ALG-002", `${prefix}: CP/package identity changed`);
    assert(first.qlId === "ALG-QL-022", `${prefix}: QL-022 identity changed`);
    assert(first.permanentIdentityFrozen && first.semanticContractFrozen && first.solverAuthorityFrozen, `${prefix}: frozen semantic boundary lost`);
    assert(!first.learnerContentFrozen && first.reviewStatus === "REVIEW_CANDIDATE_ONLY", `${prefix}: review-only state missing`);
    assert(!first.active && !first.questionStudioDiscoverable, `${prefix}: activation leaked`);
    assert(!first.questionBankWritable && !first.testEligible && !first.publiclyPublishable, `${prefix}: production eligibility leaked`);

    assert(first.question === baseline.stem, `${prefix}: explanation-only reopen changed the stem`);
    assert(stable(first.system) === stable(baseline.system), `${prefix}: explanation-only reopen changed the system`);
    assert(stable(first.answer) === stable(baseline.answer), `${prefix}: explanation-only reopen changed the answer`);

    const solved = solveLinearSystem2V(first.system);
    if (prototypeId === "ALG-CP007-CAND-005") {
      assert(solved.kind === "NO_SOLUTION", `${prefix}: exact solver did not confirm no solution`);
      assert(first.answerText === "No solution", `${prefix}: wrong learner-facing classification`);
      assert(/parallel but distinct/.test(first.explanation), `${prefix}: no-solution geometric conclusion is missing`);
      assert(/actual second constant/.test(first.explanation), `${prefix}: constant-ratio mismatch is not shown`);
    } else {
      assert(solved.kind === "INFINITE_SOLUTIONS", `${prefix}: exact solver did not confirm infinite solutions`);
      assert(first.answerText === "Infinitely many solutions", `${prefix}: wrong learner-facing classification`);
      assert(/same line/.test(first.explanation), `${prefix}: infinite-solution geometric conclusion is missing`);
      assert(/constant follows the same multiplier/.test(first.explanation), `${prefix}: constant-ratio equality is not shown`);
    }

    assert(first.explanation.length >= 260, `${prefix}: explanation is too thin`);
    assert(numericSpecificity(first.explanation) >= 5, `${prefix}: explanation lacks question-specific numerical working`);
    assert(!/associated|mainly|therefore therefore/i.test(first.question + " " + first.explanation), `${prefix}: mechanical wording leaked`);
    assert(first.explanation.includes(formatRational(first.system.a2)) && first.explanation.includes(formatRational(first.system.b2)), `${prefix}: actual second-row coefficients are missing from the explanation`);

    explanations.add(first.explanation);
    states.add(stable(first.system));

    if ([7, 29, 53].includes(seed)) reviewRows.push(first);
  }

  assert(states.size >= 48, `${prototypeId}: baseline state diversity unexpectedly collapsed (${states.size}/64)`);
  assert(explanations.size >= 48, `${prototypeId}: explanation diversity remains too narrow (${explanations.size}/64)`);
}

const outputDir = path.resolve(
  process.cwd().endsWith(`${path.sep}artifacts${path.sep}api-server`)
    ? process.cwd()
    : path.resolve(process.cwd(), "artifacts/api-server"),
  "dist/quant-v4/algebra",
);
fs.mkdirSync(outputDir, { recursive: true });

const md = [
  "# Algebra CP-007 Explanation-Only Controlled Reopen — V4 Review",
  "",
  `Authority: \`${ALG_CP007_ENGLISH_REVIEW_V4_AUTHORITY}\``,
  "",
  "Status: **REVIEW CANDIDATE ONLY — NOT FROZEN / NOT TEST ELIGIBLE**",
  "",
  "This pass changes no stem, system state, or answer. It remediates only the explanations for CAND-005 and CAND-006.",
  "",
  "## Proof scope",
  "",
  `- targeted patterns: **${ALG_CP007_ENGLISH_REVIEW_V4_TARGETS.length}**`,
  `- deterministic replay samples: **${ALG_CP007_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget}**`,
  "- baseline stems: **preserved exactly**",
  "- baseline systems: **preserved exactly**",
  "- baseline answers: **preserved exactly**",
  "- classifications: **independently verified by the exact 2×2 solver**",
  "- explanations: **numeric coefficient/constant ratio working added**",
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

const mdPath = path.join(outputDir, "algebra-cp007-explanation-reopen-v4-review.md");
fs.writeFileSync(mdPath, `${md}\n`);

console.log(
  `ALG-CP007 V4 explanation-only reopen passed: ${ALG_CP007_ENGLISH_REVIEW_V4_TARGETS.length * samplesPerTarget} exact replay samples; review pack ${mdPath}`,
);
