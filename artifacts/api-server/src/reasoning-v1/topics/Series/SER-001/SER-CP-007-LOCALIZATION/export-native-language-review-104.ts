import { SER_CP007_TEMPLATE_PROBES_V71 } from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import { generateSerCp007PermanentEnglishPackage } from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-permanent-runtime";
import {
  SER_CP007_PERMANENT_QL_IDS,
  SER_PERMANENT_QL_BY_ID,
  type SerCp007PermanentQlId,
} from "../SER-PERMANENT-QL-REGISTRY";
import { generateSerCp007PermanentLocalizedPackage } from "./ser-cp-007-localized-runtime-final";

interface ReviewTriplet {
  readonly permanentQlId: SerCp007PermanentQlId;
  readonly temporaryTemplateId: string;
  readonly seed: number;
  readonly taskKind: string;
  readonly difficulty: string;
  readonly releaseTier: string;
  readonly studentReleasePoolKey: string;
  readonly english: ReturnType<typeof generateSerCp007PermanentEnglishPackage>;
  readonly hindi: ReturnType<typeof generateSerCp007PermanentLocalizedPackage>;
  readonly punjabi: ReturnType<typeof generateSerCp007PermanentLocalizedPackage>;
}

const TARGET_PER_QL = 8;
const SEEDS = [1, 2, 3] as const;

function identity(entry: ReviewTriplet): string {
  return `${entry.temporaryTemplateId}:${entry.seed}`;
}

function selectBalanced(entries: readonly ReviewTriplet[]): readonly ReviewTriplet[] {
  const buckets = new Map<string, ReviewTriplet[]>();
  for (const entry of [...entries].sort((left, right) =>
    [left.taskKind, left.difficulty, left.temporaryTemplateId, left.seed]
      .join("|")
      .localeCompare(
        [right.taskKind, right.difficulty, right.temporaryTemplateId, right.seed].join(
          "|",
        ),
      ),
  )) {
    const bucket = buckets.get(entry.taskKind) ?? [];
    bucket.push(entry);
    buckets.set(entry.taskKind, bucket);
  }

  const selected: ReviewTriplet[] = [];
  const taskKinds = [...buckets.keys()].sort();
  while (selected.length < TARGET_PER_QL) {
    let added = false;
    for (const taskKind of taskKinds) {
      const next = buckets.get(taskKind)?.shift();
      if (!next) continue;
      selected.push(next);
      added = true;
      if (selected.length === TARGET_PER_QL) break;
    }
    if (!added) break;
  }
  return selected;
}

const candidates: ReviewTriplet[] = [];
for (const probe of [...SER_CP007_TEMPLATE_PROBES_V71].sort((left, right) =>
  left.temporaryTemplateId.localeCompare(right.temporaryTemplateId),
)) {
  for (const seed of SEEDS) {
    const english = generateSerCp007PermanentEnglishPackage(
      probe.temporaryTemplateId,
      seed,
    );
    const hindi = generateSerCp007PermanentLocalizedPackage(
      probe.temporaryTemplateId,
      "hi-IN",
      seed,
    );
    const punjabi = generateSerCp007PermanentLocalizedPackage(
      probe.temporaryTemplateId,
      "pa-IN",
      seed,
    );

    if (
      hindi.permanentQlId !== english.permanentQlId ||
      punjabi.permanentQlId !== english.permanentQlId
    ) {
      throw new Error(`Permanent QL parity failed for ${probe.temporaryTemplateId}:${seed}.`);
    }
    if (
      hindi.question.correctAnswer !== english.question.correctAnswer ||
      punjabi.question.correctAnswer !== english.question.correctAnswer
    ) {
      throw new Error(`Answer parity failed for ${probe.temporaryTemplateId}:${seed}.`);
    }
    if (
      hindi.review.studentReleasePoolKey !== english.review.studentReleasePoolKey ||
      punjabi.review.studentReleasePoolKey !== english.review.studentReleasePoolKey
    ) {
      throw new Error(`Release-pool parity failed for ${probe.temporaryTemplateId}:${seed}.`);
    }

    candidates.push({
      permanentQlId: english.permanentQlId,
      temporaryTemplateId: english.temporaryTemplateId,
      seed,
      taskKind: english.review.editorialTaskKind,
      difficulty: english.review.difficulty,
      releaseTier: english.review.releaseTier,
      studentReleasePoolKey: english.review.studentReleasePoolKey,
      english,
      hindi,
      punjabi,
    });
  }
}

const selected: ReviewTriplet[] = [];
for (const permanentQlId of SER_CP007_PERMANENT_QL_IDS) {
  const qlCandidates = candidates.filter(
    (entry) => entry.permanentQlId === permanentQlId,
  );
  const qlSelection = selectBalanced(qlCandidates);
  if (qlSelection.length !== TARGET_PER_QL) {
    throw new Error(
      `${permanentQlId} produced ${qlSelection.length} review records; expected ${TARGET_PER_QL}.`,
    );
  }
  selected.push(...qlSelection);
}

if (selected.length !== 104) {
  throw new Error(`Expected 104 review triplets, received ${selected.length}.`);
}
if (new Set(selected.map(identity)).size !== selected.length) {
  throw new Error("Native-language review selection contains duplicate template-seed identities.");
}

const taskCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
for (const entry of selected) {
  taskCounts.set(entry.taskKind, (taskCounts.get(entry.taskKind) ?? 0) + 1);
  difficultyCounts.set(
    entry.difficulty,
    (difficultyCounts.get(entry.difficulty) ?? 0) + 1,
  );
}

const sections: string[] = [
  "# SER-001 Hindi and Punjabi Native-Language Review — 104 Triplets",
  "",
  "This pack is for manual language-quality review only. English is the frozen reference; Hindi and Punjabi are localization candidates attached to the same inactive permanent QLs.",
  "",
  "## Review status",
  "",
  "```text",
  `Review triplets: 104`,
  `English reference records: 104`,
  `Localized candidate records: 208`,
  `Permanent QLs represented: ${SER_CP007_PERMANENT_QL_IDS.length}`,
  `Records per permanent QL: ${TARGET_PER_QL}`,
  "Localization status: implemented, pending native-language manual review",
  "Question Studio: disabled",
  "Question Bank writes: disabled",
  "Test eligibility: disabled",
  "Public publication: disabled",
  "```",
  "",
  "## What reviewers must check",
  "",
  "1. The Hindi/Punjabi stem sounds natural for SSC, banking and state-exam learners.",
  "2. The rule and steps are easy to understand, not literal machine translation.",
  "3. Mathematical/series meaning, options and correct answer match English exactly.",
  "4. No English learner prose or wrong-script words remain.",
  "5. Terminology is consistent across questions.",
  "6. Mark each item Approve, Edit or Reject and write the exact correction.",
  "",
  "## Task distribution",
  "",
  "| Task | Triplets |",
  "|---|---:|",
  ...[...taskCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([task, count]) => `| \`${task}\` | ${count} |`),
  "",
  "## Difficulty distribution",
  "",
  "| Difficulty | Triplets |",
  "|---|---:|",
  ...[...difficultyCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([difficulty, count]) => `| ${difficulty} | ${count} |`),
  "",
  "---",
  "",
];

for (const [index, entry] of selected.entries()) {
  const registry = SER_PERMANENT_QL_BY_ID[entry.permanentQlId];
  const number = String(index + 1).padStart(3, "0");
  sections.push(
    `## Review Item ${number}`,
    "",
    `- **Permanent QL:** \`${entry.permanentQlId}\` — ${registry.title}`,
    `- **Template:** \`${entry.temporaryTemplateId}\``,
    `- **Seed:** \`${entry.seed}\``,
    `- **Task:** \`${entry.taskKind}\``,
    `- **Difficulty:** **${entry.difficulty}**`,
    `- **Release tier:** **${entry.releaseTier}**`,
    `- **Release pool:** \`${entry.studentReleasePoolKey}\``,
    "",
    "### English frozen reference",
    "",
    entry.english.review.conciseReview,
    "",
    "### Hindi candidate",
    "",
    entry.hindi.review.conciseReview,
    "",
    "### Punjabi candidate",
    "",
    entry.punjabi.review.conciseReview,
    "",
    "### Reviewer decision",
    "",
    "- **Hindi:** [ ] Approve  [ ] Edit  [ ] Reject",
    "- **Punjabi:** [ ] Approve  [ ] Edit  [ ] Reject",
    "- [ ] Stem is natural and exam-like",
    "- [ ] Explanation is student-friendly",
    "- [ ] Options and answer preserve English meaning",
    "- [ ] No English prose or mixed-script contamination",
    "- [ ] Terminology is consistent",
    "",
    "**Hindi correction/notes:**",
    "",
    "> ",
    "",
    "**Punjabi correction/notes:**",
    "",
    "> ",
    "",
    "---",
    "",
  );
}

sections.push(
  "# Final native-language decision",
  "",
  "- [ ] All 104 Hindi samples approved or corrected",
  "- [ ] All 104 Punjabi samples approved or corrected",
  "- [ ] Cross-question terminology consistency checked",
  "- [ ] Answer, option, difficulty, release-tier and release-pool parity retained",
  "- [ ] No mixed-script or English learner-prose leakage remains",
  "- [ ] Ready for multilingual manual-freeze proposal",
  "",
  "**Final reviewer notes:**",
  "",
  "> ",
  "",
);

console.log(sections.join("\n"));
