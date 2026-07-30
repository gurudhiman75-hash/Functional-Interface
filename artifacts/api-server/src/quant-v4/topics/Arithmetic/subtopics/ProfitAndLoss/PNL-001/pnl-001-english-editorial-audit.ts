import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  listPnlCp001DynamicQlIds,
  runPnlCp001DynamicPipeline,
} from "./CP-001/cp001-dynamic-runtime";
import {
  listPnlCp002DynamicQlIds,
  runPnlCp002DynamicPipeline,
} from "./CP-002/cp002-dynamic-runtime";
import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./CP-003/cp003-dynamic-runtime";
import {
  listPnlCp004DynamicQlIds,
  runPnlCp004DynamicPipeline,
} from "./CP-004/cp004-dynamic-runtime";
import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./CP-005/cp005-dynamic-runtime";
import {
  listPnlCp006DynamicQlIds,
  runPnlCp006DynamicPipeline,
} from "./CP-006/cp006-dynamic-runtime";

type ReviewPackage = Readonly<{
  archetypeId: string;
  canonicalProblemId: string;
  questionId: string;
  questionLanguageId: string;
  language: string;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  answer: string;
  options: readonly string[];
  correctIndex: number;
  parameters: Readonly<{
    taskKind: string;
    answerSemantic: string;
    seed: string;
    runtimeMode: string;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
  }>;
  explanation: Readonly<{ lines: readonly string[] }>;
  traceability: Readonly<{
    contextFamily?: string;
    representation?: string;
    solveMode?: string;
    misconceptionLabels?: readonly string[];
    generationMode: string;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
  }>;
  validation: Readonly<{ valid: boolean }>;
}>;

type Runtime = Readonly<{
  cpId: string;
  listQlIds: () => readonly string[];
  run: (
    input: Readonly<{
      questionLanguageId: string;
      language: "en";
      seed: string;
    }>,
  ) => ReviewPackage;
}>;

type ReviewRow = Readonly<{
  rowNumber: number;
  cpId: string;
  qlId: string;
  sampleIndex: number;
  seed: string;
  difficulty: string;
  solveMode: string;
  answerSemantic: string;
  contextFamily: string;
  representation: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  answer: string;
  explanation: string;
  misconceptionLabels: string;
  reviewerDecision: string;
  severity: string;
  issueCodes: string;
  reviewerNotes: string;
  replacementStem: string;
  replacementExplanation: string;
}>;

type Finding = Readonly<{
  code: string;
  severity: "BLOCKER" | "MAJOR" | "MINOR" | "NOTE";
  scope: string;
  message: string;
}>;

const runtimes: readonly Runtime[] = [
  {
    cpId: "PNL-CP-001",
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline as Runtime["run"],
  },
  {
    cpId: "PNL-CP-002",
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline as Runtime["run"],
  },
  {
    cpId: "PNL-CP-003",
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline as Runtime["run"],
  },
  {
    cpId: "PNL-CP-004",
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline as Runtime["run"],
  },
  {
    cpId: "PNL-CP-005",
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline as Runtime["run"],
  },
  {
    cpId: "PNL-CP-006",
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline as Runtime["run"],
  },
];

const samplesPerQl = 3;
const candidateSeedsPerQl = 48;
const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/pnl-001-english-editorial-audit",
);
mkdirSync(outputDirectory, { recursive: true });

const editorialSeedSalts = [
  "amber",
  "birch",
  "cobalt",
  "delta",
  "ember",
  "fjord",
  "garnet",
  "harbor",
  "indigo",
  "juniper",
  "kestrel",
  "lotus",
  "marble",
  "nectar",
  "onyx",
  "prairie",
] as const;

function mixedCandidateToken(candidateIndex: number): string {
  let value = Math.imul(candidateIndex + 1, 0x9e3779b1) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value.toString(36);
}

function editorialCandidateSeed(
  cpId: string,
  qlId: string,
  candidateIndex: number,
): string {
  const salt =
    editorialSeedSalts[(candidateIndex * 7) % editorialSeedSalts.length]!;
  return `pnl-english-editorial:${cpId}:${qlId}:${salt}:${mixedCandidateToken(candidateIndex)}:${candidateIndex}`;
}

function visibleExplanation(pkg: ReviewPackage): string {
  return pkg.explanation.lines.join("\n\n").trim();
}

function wordCount(value: string): number {
  return value
    .replace(/[|*_`#>()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalizedVisible(value: string): string {
  return value
    .toLowerCase()
    .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
    .replace(/\b\d+(?:\.\d+)?%/g, "#%")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/\b(?:x|y|n|r|q|d|c|s|m)\b/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function proseWithoutMath(value: string): string {
  return value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
}

function firstSentence(value: string): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);
  return match?.[1]?.trim() ?? cleaned;
}

function meaningfulProseParagraph(value: string): boolean {
  if (/^\*\*Final answer:/i.test(value.trim())) return false;
  const words = proseWithoutMath(value)
    .replace(/\\[A-Za-z]+(?:\{[^}]*\})?/g, " ")
    .replace(/[^A-Za-z' -]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return words.length >= 5 && words.some((word) => word.length >= 4);
}

function lastEditorialSentence(value: string): string {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter(meaningfulProseParagraph);
  const last = paragraphs.at(-1) ?? "";
  const decimalToken = "<DECIMAL_POINT>";
  const protectedLast = last.replace(/(\d)\.(\d)/g, `$1${decimalToken}$2`);
  const sentences =
    protectedLast
      .match(/[^.!?]+[.!?]?/g)
      ?.map((item) => item.replaceAll(decimalToken, ".").trim())
      .filter(Boolean) ?? [];
  return sentences.at(-1) ?? last;
}

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function countBy<T>(
  values: readonly T[],
  key: (value: T) => string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const item = key(value);
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}

function sortedCounts(
  counts: Readonly<Record<string, number>>,
): readonly Readonly<{ value: string; count: number }>[] {
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort(
      (left, right) =>
        right.count - left.count || left.value.localeCompare(right.value),
    );
}

const candidateDiversityByQl = new Map<
  string,
  Readonly<{
    cpId: string;
    qlId: string;
    exactCandidateStemCount: number;
    normalizedCandidateStemCount: number;
    candidateAnswerCount: number;
  }>
>();

const generated = runtimes.flatMap((runtime) =>
  runtime.listQlIds().flatMap((qlId) => {
    const candidates = Array.from(
      { length: candidateSeedsPerQl },
      (_, index) => {
        const candidateIndex = index + 1;
        const seed = editorialCandidateSeed(runtime.cpId, qlId, candidateIndex);
        return {
          cpId: runtime.cpId,
          qlId,
          candidateIndex,
          seed,
          pkg: runtime.run({
            questionLanguageId: qlId,
            language: "en",
            seed,
          }),
        };
      },
    );
    candidateDiversityByQl.set(qlId, {
      cpId: runtime.cpId,
      qlId,
      exactCandidateStemCount: new Set(
        candidates.map((candidate) => candidate.pkg.stem),
      ).size,
      normalizedCandidateStemCount: new Set(
        candidates.map((candidate) => normalizedVisible(candidate.pkg.stem)),
      ).size,
      candidateAnswerCount: new Set(
        candidates.map((candidate) => candidate.pkg.answer),
      ).size,
    });

    const selected: Array<
      (typeof candidates)[number] & { sampleIndex: number }
    > = [];
    const selectedSeeds = new Set<string>();
    const seenExactStems = new Set<string>();
    const seenStemFingerprints = new Set<string>();
    const seenAnswers = new Set<string>();

    const selectCandidate = (candidate: (typeof candidates)[number]) => {
      selected.push({ ...candidate, sampleIndex: selected.length + 1 });
      selectedSeeds.add(candidate.seed);
      seenExactStems.add(candidate.pkg.stem);
      seenStemFingerprints.add(normalizedVisible(candidate.pkg.stem));
      seenAnswers.add(candidate.pkg.answer);
    };

    // First maximise semantic stem shape and displayed-answer diversity together.
    for (const candidate of candidates) {
      const fingerprint = normalizedVisible(candidate.pkg.stem);
      if (seenStemFingerprints.has(fingerprint)) continue;
      if (seenAnswers.has(candidate.pkg.answer)) continue;
      selectCandidate(candidate);
      if (selected.length === samplesPerQl) break;
    }

    // Contractually fixed answers may still expose different semantic stem shapes.
    if (selected.length < samplesPerQl) {
      for (const candidate of candidates) {
        if (selectedSeeds.has(candidate.seed)) continue;
        const fingerprint = normalizedVisible(candidate.pkg.stem);
        if (seenStemFingerprints.has(fingerprint)) continue;
        selectCandidate(candidate);
        if (selected.length === samplesPerQl) break;
      }
    }

    // If the normalized shape is fixed, prefer a new answer with new values.
    if (selected.length < samplesPerQl) {
      for (const candidate of candidates) {
        if (selectedSeeds.has(candidate.seed)) continue;
        if (seenExactStems.has(candidate.pkg.stem)) continue;
        if (seenAnswers.has(candidate.pkg.answer)) continue;
        selectCandidate(candidate);
        if (selected.length === samplesPerQl) break;
      }
    }

    // Contractually fixed answers may still expose distinct visible values.
    if (selected.length < samplesPerQl) {
      for (const candidate of candidates) {
        if (selectedSeeds.has(candidate.seed)) continue;
        if (seenExactStems.has(candidate.pkg.stem)) continue;
        selectCandidate(candidate);
        if (selected.length === samplesPerQl) break;
      }
    }

    // Fall back only when the runtime candidate pool itself has fewer than
    // three distinct exact stems or answers.
    if (selected.length < samplesPerQl) {
      for (const candidate of candidates) {
        if (selectedSeeds.has(candidate.seed)) continue;
        selectCandidate(candidate);
        if (selected.length === samplesPerQl) break;
      }
    }
    return selected;
  }),
);

const rows: readonly ReviewRow[] = generated.map(
  ({ cpId, qlId, sampleIndex, seed, pkg }, index) => ({
    rowNumber: index + 1,
    cpId,
    qlId,
    sampleIndex,
    seed,
    difficulty: pkg.difficultyBand,
    solveMode: pkg.parameters.taskKind,
    answerSemantic: pkg.parameters.answerSemantic,
    contextFamily: pkg.traceability.contextFamily ?? "UNSPECIFIED",
    representation: pkg.traceability.representation ?? "PARAGRAPH",
    stem: pkg.stem,
    optionA: pkg.options[0] ?? "",
    optionB: pkg.options[1] ?? "",
    optionC: pkg.options[2] ?? "",
    optionD: pkg.options[3] ?? "",
    correctOption: ["A", "B", "C", "D"][pkg.correctIndex] ?? "INVALID",
    answer: pkg.answer,
    explanation: visibleExplanation(pkg),
    misconceptionLabels: (pkg.traceability.misconceptionLabels ?? []).join(
      " | ",
    ),
    reviewerDecision: "",
    severity: "",
    issueCodes: "",
    reviewerNotes: "",
    replacementStem: "",
    replacementExplanation: "",
  }),
);

const fatalFindings: Finding[] = [];
const editorialFindings: Finding[] = [];

for (const { cpId, qlId, sampleIndex, pkg } of generated) {
  const scope = `${cpId}/${qlId}/sample-${sampleIndex}`;
  const explanation = visibleExplanation(pkg);
  const visible = `${pkg.stem}\n${pkg.options.join("\n")}\n${explanation}`;
  const prose = proseWithoutMath(visible);

  if (qlId === "PNL-QL-070") {
    const statementMarker = pkg.stem.match(/Statement\s+(?:I|1)\b/i);
    const lead =
      statementMarker?.index === undefined
        ? pkg.stem
        : pkg.stem.slice(0, statementMarker.index);
    if (
      statementMarker?.index === undefined ||
      /₹\s*[\d,]+|\b\d+(?:\.\d+)?%/.test(lead)
    ) {
      editorialFindings.push({
        code: "DS-LEAD-LEAKAGE",
        severity: "BLOCKER",
        scope,
        message:
          "The data-sufficiency lead must remain insufficient until the statements are evaluated.",
      });
    }
  }

  if (!pkg.validation.valid) {
    fatalFindings.push({
      code: "PACKAGE-VALIDATION-FAILED",
      severity: "BLOCKER",
      scope,
      message: "Runtime package validation is false.",
    });
  }
  if (pkg.options.length !== 4 || new Set(pkg.options).size !== 4) {
    fatalFindings.push({
      code: "INVALID-OPTIONS",
      severity: "BLOCKER",
      scope,
      message: "The generated package does not contain four unique options.",
    });
  }
  if (pkg.options[pkg.correctIndex] !== pkg.answer) {
    fatalFindings.push({
      code: "CORRECT-INDEX-MISMATCH",
      severity: "BLOCKER",
      scope,
      message: "correctIndex does not point to the displayed answer.",
    });
  }
  if (/\bAlternative\s+\d+\b/i.test(pkg.options.join("\n"))) {
    fatalFindings.push({
      code: "FALLBACK-OPTION-LABEL",
      severity: "BLOCKER",
      scope,
      message: "A fallback Alternative n option reached visible output.",
    });
  }
  if (/\{[a-z][A-Za-z0-9_]*\}/.test(prose)) {
    fatalFindings.push({
      code: "UNRESOLVED-PLACEHOLDER",
      severity: "BLOCKER",
      scope,
      message: "Visible prose contains an unresolved dynamic placeholder.",
    });
  }
  if (/\b(?:undefined|NaN|Infinity)\b/.test(visible)) {
    fatalFindings.push({
      code: "INVALID-RUNTIME-TOKEN",
      severity: "BLOCKER",
      scope,
      message: "Visible output contains undefined, NaN or Infinity.",
    });
  }
  if (wordCount(pkg.stem) < 8) {
    fatalFindings.push({
      code: "STEM-TOO-SHORT",
      severity: "BLOCKER",
      scope,
      message: `Stem contains only ${wordCount(pkg.stem)} words.`,
    });
  }
  if (wordCount(explanation) < 30) {
    fatalFindings.push({
      code: "EXPLANATION-TOO-SHORT",
      severity: "BLOCKER",
      scope,
      message: `Explanation contains only ${wordCount(explanation)} words.`,
    });
  }
  if (
    pkg.parameters.runtimeMode !== "DYNAMIC_CANDIDATE" ||
    pkg.parameters.reviewStatus !== "UNREVIEWED_DYNAMIC_CANDIDATE" ||
    pkg.parameters.questionBankStatus !== "NOT_STORED" ||
    pkg.parameters.testEligibility !== "INELIGIBLE" ||
    pkg.parameters.publiclyPublishable !== false ||
    pkg.traceability.generationMode !== "DYNAMIC_CANDIDATE" ||
    pkg.traceability.reviewStatus !== "UNREVIEWED_DYNAMIC_CANDIDATE" ||
    pkg.traceability.questionBankStatus !== "NOT_STORED" ||
    pkg.traceability.testEligibility !== "INELIGIBLE" ||
    pkg.traceability.publiclyPublishable !== false
  ) {
    fatalFindings.push({
      code: "SAFETY-METADATA-DRIFT",
      severity: "BLOCKER",
      scope,
      message:
        "Review-only safety metadata has drifted from the frozen contract.",
    });
  }
  if (wordCount(pkg.stem) > 140) {
    editorialFindings.push({
      code: "LONG-STEM",
      severity: "MINOR",
      scope,
      message: `Stem contains ${wordCount(pkg.stem)} words and needs concision review.`,
    });
  }
  if (wordCount(explanation) > 500) {
    editorialFindings.push({
      code: "LONG-EXPLANATION",
      severity: "MINOR",
      scope,
      message: `Explanation contains ${wordCount(explanation)} words and needs concision review.`,
    });
  }
}

const exactStemGroups = new Map<string, Set<string>>();
const normalizedStemGroups = new Map<string, Set<string>>();
for (const { qlId, pkg } of generated) {
  const exact = pkg.stem.trim();
  const normalized = normalizedVisible(pkg.stem);
  const exactSet = exactStemGroups.get(exact) ?? new Set<string>();
  exactSet.add(qlId);
  exactStemGroups.set(exact, exactSet);
  const normalizedSet =
    normalizedStemGroups.get(normalized) ?? new Set<string>();
  normalizedSet.add(qlId);
  normalizedStemGroups.set(normalized, normalizedSet);
}

const exactCrossQlDuplicates = [...exactStemGroups.entries()]
  .filter(([, qlIds]) => qlIds.size > 1)
  .map(([stem, qlIds]) => ({ stem, qlIds: [...qlIds].sort() }));
for (const group of exactCrossQlDuplicates) {
  fatalFindings.push({
    code: "EXACT-CROSS-QL-STEM-DUPLICATE",
    severity: "BLOCKER",
    scope: group.qlIds.join(", "),
    message: group.stem,
  });
}

const normalizedCrossQlClones = [...normalizedStemGroups.entries()]
  .filter(([, qlIds]) => qlIds.size > 1)
  .map(([fingerprint, qlIds]) => ({ fingerprint, qlIds: [...qlIds].sort() }))
  .sort(
    (left, right) =>
      right.qlIds.length - left.qlIds.length ||
      left.fingerprint.localeCompare(right.fingerprint),
  );
for (const group of normalizedCrossQlClones) {
  editorialFindings.push({
    code: "NORMALISED-CROSS-QL-CLONE",
    severity: "MAJOR",
    scope: group.qlIds.join(", "),
    message: group.fingerprint,
  });
}

const qlGroups = new Map<string, typeof generated>();
for (const item of generated) {
  const group = qlGroups.get(item.qlId) ?? [];
  qlGroups.set(item.qlId, [...group, item]);
}

const sameQlStemRepeat: string[] = [];
const sameQlAnswerRepeat: string[] = [];
const fixedStemQls: string[] = [];
const fixedAnswerQls: string[] = [];
for (const [qlId, group] of qlGroups) {
  const candidateDiversity = candidateDiversityByQl.get(qlId);
  if (new Set(group.map((item) => item.pkg.stem)).size === 1) {
    const fixedStem = (candidateDiversity?.exactCandidateStemCount ?? 0) === 1;
    if (fixedStem) {
      fixedStemQls.push(qlId);
    } else {
      sameQlStemRepeat.push(qlId);
      editorialFindings.push({
        code: "SAME-QL-STEM-REPEAT",
        severity: "MAJOR",
        scope: qlId,
        message: `All three selected samples render the same visible stem despite ${candidateDiversity?.exactCandidateStemCount ?? "unknown"} exact stems in the candidate pool.`,
      });
    }
  }
  if (new Set(group.map((item) => item.pkg.answer)).size === 1) {
    const fixedAnswer = (candidateDiversity?.candidateAnswerCount ?? 0) === 1;
    if (fixedAnswer) {
      fixedAnswerQls.push(qlId);
    } else {
      sameQlAnswerRepeat.push(qlId);
      editorialFindings.push({
        code: "SAME-QL-ANSWER-REPEAT",
        severity: "NOTE",
        scope: qlId,
        message: `The selected samples repeat one answer despite ${candidateDiversity?.candidateAnswerCount ?? "unknown"} answers in the candidate pool.`,
      });
    }
  }
}

const openingCounts = sortedCounts(
  countBy(generated, ({ pkg }) =>
    normalizedVisible(firstSentence(visibleExplanation(pkg))),
  ),
);
const closingCounts = sortedCounts(
  countBy(generated, ({ pkg }) =>
    normalizedVisible(lastEditorialSentence(visibleExplanation(pkg))),
  ),
);
const paragraphCounts = sortedCounts(
  countBy(
    generated.flatMap(({ pkg }) =>
      visibleExplanation(pkg)
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .filter(meaningfulProseParagraph),
    ),
    normalizedVisible,
  ),
);

for (const item of openingCounts
  .filter(({ count }) => count >= 8)
  .slice(0, 25)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-OPENING",
    severity: item.count >= 25 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value,
  });
}
for (const item of closingCounts
  .filter(({ count }) => count >= 8)
  .slice(0, 25)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-CLOSING",
    severity: item.count >= 25 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value,
  });
}
for (const item of paragraphCounts
  .filter(({ count }) => count >= 12)
  .slice(0, 30)) {
  editorialFindings.push({
    code: "REPEATED-EXPLANATION-PARAGRAPH",
    severity: item.count >= 30 ? "MAJOR" : "MINOR",
    scope: `${item.count} samples`,
    message: item.value,
  });
}

const contextFamilyCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => pkg.traceability.contextFamily ?? "UNSPECIFIED",
  ),
);
const representationCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => pkg.traceability.representation ?? "PARAGRAPH",
  ),
);
const difficultyCounts = sortedCounts(
  countBy(generated, ({ pkg }) => pkg.difficultyBand),
);
const cpCounts = sortedCounts(countBy(generated, ({ cpId }) => cpId));
const correctIndexCounts = sortedCounts(
  countBy(
    generated,
    ({ pkg }) => ["A", "B", "C", "D"][pkg.correctIndex] ?? "INVALID",
  ),
);
const genericNounCounts = {
  article: generated.filter(({ pkg }) => /\barticle\b/i.test(pkg.stem)).length,
  trader: generated.filter(({ pkg }) => /\btrader\b/i.test(pkg.stem)).length,
  shopkeeper: generated.filter(({ pkg }) => /\bshopkeeper\b/i.test(pkg.stem))
    .length,
  merchant: generated.filter(({ pkg }) => /\bmerchant\b/i.test(pkg.stem))
    .length,
  seller: generated.filter(({ pkg }) => /\bseller\b/i.test(pkg.stem)).length,
};

for (const item of contextFamilyCounts.filter(({ count }) => count >= 18)) {
  editorialFindings.push({
    code: "CONTEXT-FAMILY-CONCENTRATION",
    severity: "MINOR",
    scope: `${item.count} samples`,
    message: item.value,
  });
}

const positionCounts = Object.fromEntries(
  correctIndexCounts.map(({ value, count }) => [value, count]),
);
const expectedPerPosition = generated.length / 4;
for (const position of ["A", "B", "C", "D"]) {
  const count = positionCounts[position] ?? 0;
  const deviation = Math.abs(count - expectedPerPosition) / expectedPerPosition;
  if (deviation > 0.2) {
    editorialFindings.push({
      code: "CORRECT-OPTION-POSITION-IMBALANCE",
      severity: "MINOR",
      scope: position,
      message: `${count} correct answers; expected approximately ${expectedPerPosition.toFixed(1)}.`,
    });
  }
}

const issueCodeCounts = sortedCounts(
  countBy(editorialFindings, (finding) => finding.code),
);
const fatalCodeCounts = sortedCounts(
  countBy(fatalFindings, (finding) => finding.code),
);

const metrics = {
  packageId: "PNL-001",
  language: "English",
  cpCount: runtimes.length,
  qlCount: qlGroups.size,
  samplesPerQl,
  candidateSeedsPerQl,
  reviewRows: generated.length,
  cpCounts,
  difficultyCounts,
  representationCounts,
  contextFamilyCounts,
  correctIndexCounts,
  genericNounCounts,
  exactCrossQlDuplicateGroups: exactCrossQlDuplicates.length,
  normalizedCrossQlCloneGroups: normalizedCrossQlClones.length,
  sameQlStemRepeatCount: sameQlStemRepeat.length,
  sameQlAnswerRepeatCount: sameQlAnswerRepeat.length,
  contractuallyFixedStemCount: fixedStemQls.length,
  contractuallyFixedStemQls: fixedStemQls,
  contractuallyFixedAnswerCount: fixedAnswerQls.length,
  contractuallyFixedAnswerQls: fixedAnswerQls,
  candidateDiversityByQl: [...candidateDiversityByQl.values()].sort(
    (left, right) => left.qlId.localeCompare(right.qlId),
  ),
  repeatedOpeningPatterns: openingCounts.filter(({ count }) => count >= 8),
  repeatedClosingPatterns: closingCounts.filter(({ count }) => count >= 8),
  repeatedParagraphPatterns: paragraphCounts.filter(({ count }) => count >= 12),
  fatalFindingCount: fatalFindings.length,
  editorialFindingCount: editorialFindings.length,
  fatalCodeCounts,
  issueCodeCounts,
  auditStatus:
    fatalFindings.length > 0
      ? "STRUCTURAL_FAIL"
      : editorialFindings.length > 0
        ? "REVIEW_REQUIRED"
        : "PASS",
  resolvedIssueRegression: {
    issueNumber: 262,
    qlId: "PNL-QL-070",
    code: "DS-LEAD-LEAKAGE",
    status: "RESOLVED_AND_MONITORED",
  },
  runtimeMode: "DYNAMIC_CANDIDATE",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioWiringChanged: false,
};

const csvHeaders: readonly (keyof ReviewRow)[] = [
  "rowNumber",
  "cpId",
  "qlId",
  "sampleIndex",
  "seed",
  "difficulty",
  "solveMode",
  "answerSemantic",
  "contextFamily",
  "representation",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctOption",
  "answer",
  "explanation",
  "misconceptionLabels",
  "reviewerDecision",
  "severity",
  "issueCodes",
  "reviewerNotes",
  "replacementStem",
  "replacementExplanation",
];
const csv = [
  csvHeaders.map(csvCell).join(","),
  ...rows.map((row) =>
    csvHeaders.map((header) => csvCell(row[header])).join(","),
  ),
].join("\n");

const reviewMarkdown = [
  "# PNL-001 English Generated-Question Review Book",
  "",
  "> Three deterministic review samples for every frozen QL. Publication and Question Bank storage remain disabled.",
  "",
  "```text",
  `CPs:              ${runtimes.length}`,
  `QLs:              ${qlGroups.size}`,
  `Samples per QL:   ${samplesPerQl} selected from ${candidateSeedsPerQl} deterministic candidates`,
  `Review rows:      ${generated.length}`,
  "Language:         English",
  "Question Studio:  unchanged",
  "```",
  "",
  ...generated.flatMap(({ cpId, qlId, sampleIndex, seed, pkg }, index) => [
    `## ${index + 1}. ${qlId} — sample ${sampleIndex}`,
    "",
    `- CP: \`${cpId}\``,
    `- Seed: \`${seed}\``,
    `- Difficulty: \`${pkg.difficultyBand}\``,
    `- Solve mode: \`${pkg.parameters.taskKind}\``,
    `- Answer semantic: \`${pkg.parameters.answerSemantic}\``,
    `- Context family: \`${pkg.traceability.contextFamily ?? "UNSPECIFIED"}\``,
    `- Representation: \`${pkg.traceability.representation ?? "PARAGRAPH"}\``,
    "",
    "### Question",
    "",
    pkg.stem,
    "",
    ...pkg.options.map(
      (option, optionIndex) =>
        `- ${["A", "B", "C", "D"][optionIndex]}. ${option}`,
    ),
    "",
    `**Correct option:** ${["A", "B", "C", "D"][pkg.correctIndex]} — ${pkg.answer}`,
    "",
    "### Explanation",
    "",
    visibleExplanation(pkg),
    "",
    "### Reviewer decision",
    "",
    "- Decision:",
    "- Severity:",
    "- Issue codes:",
    "- Notes:",
    "- Replacement stem:",
    "- Replacement explanation:",
    "",
    "---",
    "",
  ]),
].join("\n");

const findingsMarkdown = [
  "# PNL-001 English Editorial Audit Findings",
  "",
  "```text",
  `Audit status:             ${metrics.auditStatus}`,
  `Review rows:              ${metrics.reviewRows}`,
  `Structural blockers:      ${metrics.fatalFindingCount}`,
  `Editorial findings:       ${metrics.editorialFindingCount}`,
  `Exact cross-QL duplicates:${metrics.exactCrossQlDuplicateGroups}`,
  `Normalised clone groups:  ${metrics.normalizedCrossQlCloneGroups}`,
  `Same-QL stem repeats:     ${metrics.sameQlStemRepeatCount}`,
  `Same-QL answer repeats:   ${metrics.sameQlAnswerRepeatCount}`,
  "```",
  "",
  "## Known blocker",
  "",
  "- `PNL-QL-070` / GitHub issue `#262`: the data-sufficiency lead currently leaks enough values before the statements.",
  "",
  "## Structural blockers",
  "",
  ...(fatalFindings.length
    ? fatalFindings.map(
        (finding) =>
          `- **${finding.code}** — ${finding.scope}: ${finding.message}`,
      )
    : ["- None detected by the automated structural audit."]),
  "",
  "## Editorial finding counts",
  "",
  "| Code | Count |",
  "|---|---:|",
  ...issueCodeCounts.map(({ value, count }) => `| \`${value}\` | ${count} |`),
  "",
  "## Highest-frequency repeated explanation openings",
  "",
  "| Count | Normalised opening |",
  "|---:|---|",
  ...openingCounts
    .slice(0, 20)
    .map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Highest-frequency repeated explanation paragraphs",
  "",
  "| Count | Normalised paragraph |",
  "|---:|---|",
  ...paragraphCounts
    .slice(0, 20)
    .map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Context-family concentration",
  "",
  "| Count | Context family |",
  "|---:|---|",
  ...contextFamilyCounts
    .slice(0, 30)
    .map(({ value, count }) => `| ${count} | ${value.replace(/\|/g, "\\|")} |`),
  "",
  "## Correct-option position",
  "",
  "| Position | Count |",
  "|---|---:|",
  ...correctIndexCounts.map(({ value, count }) => `| ${value} | ${count} |`),
  "",
  "## Next editorial action",
  "",
  "1. Resolve structural blockers first.",
  "2. Review repeated explanation openings and generic working paragraphs as systemic generator/template defects.",
  "3. Review every QL in the CSV and record an explicit decision.",
  "4. Correct generator/template code, regenerate the same seeds, and compare the corpus before approving English readiness.",
].join("\n");

writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-review.csv"),
  csv,
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-review.md"),
  reviewMarkdown,
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-metrics.json"),
  JSON.stringify(metrics, null, 2),
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-findings.md"),
  findingsMarkdown,
  "utf8",
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-english-editorial-findings.json"),
  JSON.stringify({ fatalFindings, editorialFindings }, null, 2),
  "utf8",
);

console.log(JSON.stringify(metrics, null, 2));

if (generated.length !== 558 || qlGroups.size !== 186) {
  throw new Error(
    `Editorial corpus size mismatch: ${generated.length} rows across ${qlGroups.size} QLs.`,
  );
}
if (fatalFindings.length > 0) {
  throw new Error(
    `PNL English editorial structural audit found ${fatalFindings.length} blocker(s).`,
  );
}
