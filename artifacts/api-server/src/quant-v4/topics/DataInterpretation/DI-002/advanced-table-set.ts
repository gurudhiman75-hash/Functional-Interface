import {
  hashSeed,
  pick,
  ratioDisplay,
  seededRandom,
  shuffle,
} from "../DI-001/exact";
import type {
  Di002Difficulty,
  Di002ExamProfile,
  Di002Explanation,
  Di002Option,
  Di002Question,
  Di002QuestionSet,
  Di002Row,
  Di002Stimulus,
  Di002TaskKind,
  Di002ValidationCheck,
} from "./types";

const BRANCHES = ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"] as const;
const SELECTED_FACTORS = [4, 5, 6, 7, 8] as const;
const BASE_POOL = [84, 126, 168, 210, 252, 294] as const;
const SELECTION_PERCENT_POOL = [40, 50, 60, 70, 80] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di002ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di002TaskKind;
  difficulty: Di002Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di002Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function formatPercent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-002 received an invalid percentage fraction.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function deriveApplicants(row: Pick<Di002Row, "selected" | "selectionPercent">): number {
  const value = (row.selected * 100) / row.selectionPercent;
  if (!Number.isSafeInteger(value) || value < row.selected) {
    throw new Error("DI-002 generated an invalid reverse-percentage applicant count.");
  }
  return value;
}

function buildStimulus(seed: string): Di002Stimulus {
  const random = seededRandom(`${seed}:stimulus`);
  const base = pick(random, BASE_POOL);
  const percents = shuffle(seededRandom(`${seed}:rates`), SELECTION_PERCENT_POOL);
  const hiddenApplicantIndex = pick(seededRandom(`${seed}:hidden-applicant`), [0, 1, 2, 3, 4] as const);

  const rows = BRANCHES.map((branch, index): Di002Row => {
    const selected = base * SELECTED_FACTORS[index]!;
    const selectionPercent = percents[index]!;
    const applicants = deriveApplicants({ selected, selectionPercent });
    return {
      branch,
      applicants: index === hiddenApplicantIndex ? "?" : applicants,
      selected,
      selectionPercent,
    };
  });

  return {
    kind: "TABLE",
    title: "Applicants, selected candidates and selection rates at five branches",
    instruction: "Study the table carefully and answer the five questions that follow. One Applicants entry is missing and can be reconstructed from the same row.",
    columns: ["Branch", "Applicants", "Selected", "Selection %"],
    rows,
    hiddenApplicantIndex,
    unit: "candidates",
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di002Option[] = [];

  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push({
      text: candidate.text,
      misconceptionId: candidate.misconceptionId,
      derivation: candidate.derivation,
    });
  };

  add({
    text: answer,
    misconceptionId: "CORRECT",
    derivation: "Exact recomputation from the shared DI-002 stimulus.",
  });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-002 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const chosen = retained.slice(0, optionCount);
  const shuffled = shuffle(seededRandom(`${seed}:options`), chosen);
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-002 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function buildDrafts(seed: string, stimulus: Di002Stimulus): Draft[] {
  const rows = stimulus.rows;
  const applicantCounts = rows.map(deriveApplicants);
  const selectedCounts = rows.map((row) => row.selected);
  const totalSelected = selectedCounts.reduce((sum, value) => sum + value, 0);
  const totalApplicants = applicantCounts.reduce((sum, value) => sum + value, 0);

  const hiddenIndex = stimulus.hiddenApplicantIndex;
  const hiddenRow = rows[hiddenIndex]!;
  const hiddenApplicants = applicantCounts[hiddenIndex]!;
  const otherApplicantCandidates = applicantCounts
    .map((value, index) => ({ value, index }))
    .filter((entry) => entry.index !== hiddenIndex);

  const percentPair = pick(
    seededRandom(`${seed}:selected-change-pair`),
    [[0, 1], [0, 2], [0, 4], [1, 2], [1, 3], [1, 4]] as const,
  );
  const fromIndex = percentPair[0];
  const toIndex = percentPair[1];
  const fromSelected = rows[fromIndex]!.selected;
  const toSelected = rows[toIndex]!.selected;
  const selectedDifference = toSelected - fromSelected;
  const selectedChange = formatPercent(selectedDifference, fromSelected);
  const rateDifferenceForSelectedPair = Math.abs(rows[toIndex]!.selectionPercent - rows[fromIndex]!.selectionPercent);

  const sharePair = pick(
    seededRandom(`${seed}:share-pair`),
    [[0, 1], [0, 4], [1, 3], [3, 4]] as const,
  );
  const shareFirst = sharePair[0];
  const shareSecond = sharePair[1];
  const shareSelected = rows[shareFirst]!.selected + rows[shareSecond]!.selected;
  const shareAnswer = formatPercent(shareSelected, totalSelected);
  const omittedIndex = [0, 1, 2, 3, 4].find((index) => index !== shareFirst && index !== shareSecond)!;

  const ratioTuple = pick(
    seededRandom(`${seed}:ratio-groups`),
    [[0, 2, 1, 3], [0, 4, 1, 2], [0, 1, 3, 4], [1, 4, 0, 2]] as const,
  );
  const [leftA, leftB, rightA, rightB] = ratioTuple;
  const leftSelected = rows[leftA]!.selected + rows[leftB]!.selected;
  const rightSelected = rows[rightA]!.selected + rows[rightB]!.selected;
  const ratioAnswer = ratioDisplay(leftSelected, rightSelected);

  const ratePair = pick(
    seededRandom(`${seed}:rate-change-pair`),
    [[40, 50], [40, 60], [40, 80], [50, 60], [50, 70], [50, 80]] as const,
  );
  const rateFromIndex = rows.findIndex((row) => row.selectionPercent === ratePair[0]);
  const rateToIndex = rows.findIndex((row) => row.selectionPercent === ratePair[1]);
  if (rateFromIndex < 0 || rateToIndex < 0) throw new Error("DI-002 could not resolve the selected rate pair.");
  const rateFrom = rows[rateFromIndex]!.selectionPercent;
  const rateTo = rows[rateToIndex]!.selectionPercent;
  const rateDifference = rateTo - rateFrom;
  const rateRelativeAnswer = formatPercent(rateDifference, rateFrom);
  const selectedMagnitudeDifference = Math.abs(rows[rateToIndex]!.selected - rows[rateFromIndex]!.selected);
  const selectedMagnitudeBase = Math.min(rows[rateToIndex]!.selected, rows[rateFromIndex]!.selected);

  return [
    {
      kind: "MISSING_REVERSE_PERCENTAGE",
      difficulty: "Medium",
      stem: `The Applicants entry for ${hiddenRow.branch} is missing. If ${hiddenRow.selected} candidates were selected and the selection rate was ${hiddenRow.selectionPercent}%, how many candidates had applied at that branch?`,
      answer: String(hiddenApplicants),
      candidates: [
        ...otherApplicantCandidates.map((entry) => ({
          text: String(entry.value),
          misconceptionId: `COPY_OTHER_ROW_APPLICANTS_${entry.index + 1}`,
          derivation: `Copies the reconstructed Applicants value from ${rows[entry.index]!.branch} instead of solving the missing row.`,
        })),
        { text: String(hiddenRow.selected), misconceptionId: "COPY_SELECTED_AS_APPLICANTS", derivation: "Copies the Selected count and ignores that it represents only a percentage of Applicants." },
        { text: String(hiddenApplicants - hiddenRow.selected), misconceptionId: "USE_NOT_SELECTED_COUNT", derivation: "Reports the number not selected instead of the total number of applicants." },
        { text: String(totalSelected), misconceptionId: "USE_TABLE_SELECTED_TOTAL", derivation: "Uses the total Selected count across all branches instead of reconstructing the missing row." },
        { text: String(totalApplicants), misconceptionId: "USE_TABLE_APPLICANT_TOTAL", derivation: "Uses the reconstructed Applicants total for all branches instead of the single missing branch." },
      ],
      explanation: {
        keyIdea: "Reverse the percentage relation: Selected = Applicants × selection rate / 100.",
        steps: [
          `${hiddenRow.selectionPercent}% of Applicants = ${hiddenRow.selected}.`,
          `Applicants = ${hiddenRow.selected} × 100 / ${hiddenRow.selectionPercent} = ${hiddenApplicants}.`,
        ],
        shortcut: `Divide ${hiddenRow.selected} by ${hiddenRow.selectionPercent / 100} to recover the whole directly.`,
        trap: "Do not multiply by the percentage again; the table gives the part and asks for the original whole.",
      },
      evidence: { hiddenIndex },
    },
    {
      kind: "PERCENT_CHANGE_SELECTED",
      difficulty: "Medium",
      stem: `By what percentage did the number of selected candidates increase from ${rows[fromIndex]!.branch} to ${rows[toIndex]!.branch}?`,
      answer: selectedChange,
      candidates: [
        { text: formatPercent(selectedDifference, toSelected), misconceptionId: "USE_NEW_VALUE_AS_DENOMINATOR", derivation: `Divides the increase by the new Selected count ${toSelected} instead of the original ${fromSelected}.` },
        { text: formatPercent(selectedDifference, totalSelected), misconceptionId: "USE_TABLE_TOTAL_AS_DENOMINATOR", derivation: "Divides the two-row increase by the total Selected count for all five branches." },
        { text: formatPercent(rateDifferenceForSelectedPair, rows[fromIndex]!.selectionPercent), misconceptionId: "COMPARE_SELECTION_RATES_INSTEAD", derivation: "Compares the two selection-rate percentages instead of the Selected candidate counts." },
        { text: `${rateDifferenceForSelectedPair}%`, misconceptionId: "USE_PERCENTAGE_POINT_GAP", derivation: "Reports the percentage-point gap between row selection rates, which is a different quantity." },
        { text: formatPercent(toSelected, fromSelected), misconceptionId: "REPORT_NEW_AS_PERCENT_OF_OLD", derivation: "Reports the new Selected count as a percentage of the old count instead of the percentage increase." },
        { text: `${selectedDifference}%`, misconceptionId: "TREAT_COUNT_DIFFERENCE_AS_PERCENT", derivation: "Attaches a percent sign to the absolute count increase without dividing by the original count." },
      ],
      explanation: {
        keyIdea: "Percentage increase uses the original Selected count as the denominator.",
        steps: [
          `Increase = ${toSelected} - ${fromSelected} = ${selectedDifference}.`,
          `Percentage increase = ${selectedDifference}/${fromSelected} × 100 = ${selectedChange}.`,
        ],
        shortcut: "When comparing two table rows, identify the old value first; that row supplies the denominator.",
        trap: "Do not use the new value, total table value or the Selection % column as the denominator.",
      },
      evidence: { fromIndex, toIndex },
    },
    {
      kind: "SHARE_OF_TOTAL_SELECTED",
      difficulty: "Medium",
      stem: `Together, what percentage of all selected candidates came from ${rows[shareFirst]!.branch} and ${rows[shareSecond]!.branch}?`,
      answer: shareAnswer,
      candidates: [
        { text: formatPercent(rows[shareFirst]!.selected, totalSelected), misconceptionId: "USE_FIRST_BRANCH_ONLY", derivation: `Uses only ${rows[shareFirst]!.branch}'s Selected count and ignores the second named branch.` },
        { text: formatPercent(rows[shareSecond]!.selected, totalSelected), misconceptionId: "USE_SECOND_BRANCH_ONLY", derivation: `Uses only ${rows[shareSecond]!.branch}'s Selected count and ignores the first named branch.` },
        { text: formatPercent(totalSelected, shareSelected), misconceptionId: "REVERSE_PART_WHOLE", derivation: "Reverses part and whole, dividing the all-branch Selected total by the two-branch subtotal." },
        { text: formatPercent(shareSelected, totalSelected - rows[omittedIndex]!.selected), misconceptionId: "OMIT_ONE_ROW_FROM_TOTAL", derivation: `Builds the denominator after accidentally omitting ${rows[omittedIndex]!.branch} from the Selected total.` },
        { text: formatPercent(shareSelected, rows[shareFirst]!.selected), misconceptionId: "USE_FIRST_BRANCH_AS_WHOLE", derivation: `Treats ${rows[shareFirst]!.branch}'s Selected count as the whole instead of all five branches.` },
        { text: `${rows[shareFirst]!.selectionPercent}%`, misconceptionId: "COPY_SELECTION_RATE", derivation: `Copies ${rows[shareFirst]!.branch}'s row Selection % instead of finding its combined share of the table total.` },
      ],
      explanation: {
        keyIdea: "Add the Selected counts for the two named branches, then divide by the Selected total for all five branches.",
        steps: [
          `Named-branch subtotal = ${rows[shareFirst]!.selected} + ${rows[shareSecond]!.selected} = ${shareSelected}.`,
          `All-branch Selected total = ${selectedCounts.join(" + ")} = ${totalSelected}.`,
          `Required share = ${shareSelected}/${totalSelected} × 100 = ${shareAnswer}.`,
        ],
        shortcut: "The denominator is the total of the same column named in the numerator: Selected candidates.",
        trap: "Do not use Applicants or a row's Selection % when the question asks for share of the Selected total.",
      },
      evidence: { firstIndex: shareFirst, secondIndex: shareSecond },
    },
    {
      kind: "COMBINED_SELECTED_RATIO",
      difficulty: "Hard",
      stem: `What is the ratio of the combined number selected at ${rows[leftA]!.branch} and ${rows[leftB]!.branch} to the combined number selected at ${rows[rightA]!.branch} and ${rows[rightB]!.branch}?`,
      answer: ratioAnswer,
      candidates: [
        { text: ratioDisplay(rightSelected, leftSelected), misconceptionId: "REVERSE_COMBINED_RATIO", derivation: "Reverses the two combined groups after calculating their Selected subtotals." },
        { text: ratioDisplay(rows[leftA]!.selected, rows[rightA]!.selected), misconceptionId: "USE_FIRST_ROW_OF_EACH_GROUP", derivation: "Uses only the first branch from each named pair instead of combining both branches." },
        { text: ratioDisplay(rows[leftB]!.selected, rows[rightB]!.selected), misconceptionId: "USE_SECOND_ROW_OF_EACH_GROUP", derivation: "Uses only the second branch from each named pair instead of combining both branches." },
        { text: ratioDisplay(rows[leftA]!.selected + rows[rightA]!.selected, rows[leftB]!.selected + rows[rightB]!.selected), misconceptionId: "REGROUP_CROSSWISE", derivation: "Regroups the four branches crosswise instead of preserving the two pairs named in the question." },
        { text: ratioDisplay(applicantCounts[leftA]! + applicantCounts[leftB]!, applicantCounts[rightA]! + applicantCounts[rightB]!), misconceptionId: "USE_APPLICANTS_COLUMN", derivation: "Forms the requested grouping from Applicants instead of Selected candidates." },
        { text: ratioDisplay(leftSelected, rows[rightA]!.selected), misconceptionId: "OMIT_ONE_RIGHT_GROUP_BRANCH", derivation: `Combines the left group correctly but omits ${rows[rightB]!.branch} from the right group.` },
      ],
      explanation: {
        keyIdea: "Form each named Selected subtotal first, then reduce the ratio of the two subtotals.",
        steps: [
          `First group = ${rows[leftA]!.selected} + ${rows[leftB]!.selected} = ${leftSelected}.`,
          `Second group = ${rows[rightA]!.selected} + ${rows[rightB]!.selected} = ${rightSelected}.`,
          `${leftSelected}:${rightSelected} = ${ratioAnswer}.`,
        ],
        shortcut: "Do not simplify individual row ratios first; add within each group before reducing the final ratio.",
        trap: "Keep the group order exactly as stated and remain in the Selected column.",
      },
      evidence: { leftA, leftB, rightA, rightB },
    },
    {
      kind: "RELATIVE_SELECTION_RATE_CHANGE",
      difficulty: "Hard",
      stem: `The selection rate at ${rows[rateToIndex]!.branch} is what percent higher than the selection rate at ${rows[rateFromIndex]!.branch}?`,
      answer: rateRelativeAnswer,
      candidates: [
        { text: `${rateDifference}%`, misconceptionId: "PERCENTAGE_POINTS_NOT_RELATIVE_PERCENT", derivation: `Reports the ${rateDifference}-percentage-point gap instead of measuring that gap relative to ${rateFrom}%.` },
        { text: formatPercent(rateDifference, rateTo), misconceptionId: "USE_NEW_RATE_AS_DENOMINATOR", derivation: `Divides the rate gap by the new rate ${rateTo}% instead of the original ${rateFrom}%.` },
        { text: formatPercent(rateTo, rateFrom), misconceptionId: "REPORT_NEW_RATE_AS_PERCENT_OF_OLD", derivation: "Reports the new rate as a percentage of the old rate rather than the percentage by which it is higher." },
        { text: formatPercent(selectedMagnitudeDifference, selectedMagnitudeBase), misconceptionId: "COMPARE_SELECTED_COUNTS_INSTEAD_OF_RATES", derivation: "Compares Selected candidate counts in the two rows instead of comparing their Selection % values." },
        { text: formatPercent(rateFrom, rateTo), misconceptionId: "REPORT_OLD_RATE_AS_PERCENT_OF_NEW", derivation: "Forms the reverse rate ratio rather than the relative increase from old to new." },
        { text: `${rateFrom + rateTo}%`, misconceptionId: "ADD_THE_TWO_RATES", derivation: "Adds the two row percentages even though the question asks for relative increase." },
      ],
      explanation: {
        keyIdea: "A percentage-point difference and a relative percentage increase are different: divide the rate gap by the original rate.",
        steps: [
          `Rate gap = ${rateTo}% - ${rateFrom}% = ${rateDifference} percentage points.`,
          `Relative increase = ${rateDifference}/${rateFrom} × 100 = ${rateRelativeAnswer}.`,
        ],
        shortcut: "For 'what percent higher', use (new − old) / old; for 'how many percentage points', stop after subtraction.",
        trap: `The answer is not simply ${rateDifference}% unless the original rate happened to make those two quantities equal.`,
      },
      evidence: { fromIndex: rateFromIndex, toIndex: rateToIndex },
    },
  ];
}

function validateSet(set: Omit<Di002QuestionSet, "validation">) {
  const checks: Di002ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("TABLE_ROW_COUNT", set.stimulus.rows.length === 5, "DI-002 requires exactly five table rows.");
  add("ONE_HIDDEN_APPLICANT", set.stimulus.rows.filter((row) => row.applicants === "?").length === 1, "Exactly one Applicants cell must be hidden.");
  add("HIDDEN_INDEX_PARITY", set.stimulus.rows[set.stimulus.hiddenApplicantIndex]?.applicants === "?", "The hidden applicant index must point to the missing cell.");
  add("PHYSICAL_ROWS", set.stimulus.rows.every((row) => {
    const reconstructed = deriveApplicants(row);
    return row.selected > 0 && row.selectionPercent > 0 && row.selectionPercent < 100 && reconstructed >= row.selected;
  }), "Every row must reconstruct to a valid positive applicant count.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-002 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each linked child must test a distinct advanced Table DI task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the parent set ID.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every child must expose ${set.optionCount} options.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every child must have unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 25 && question.explanation.trap.length > 25), "Every child must contain a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-002 Phase 1 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi002AdvancedTableSet(input: { seed?: string; examProfile?: Di002ExamProfile } = {}): Di002QuestionSet {
  const seed = input.seed ?? "DI-002:ADVANCED-TABLE:P1";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(seed, stimulus);
  const setId = `DI-002-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di002Question => {
    const questionId = `${setId}-Q${index + 1}`;
    const optionPackage = buildOptions(`${seed}:${examProfile}:${draft.kind}`, optionCount, draft.answer, draft.candidates);
    return {
      questionId,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: optionPackage.options,
      optionMetadata: optionPackage.optionMetadata,
      correctIndex: optionPackage.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation: Omit<Di002QuestionSet, "validation"> = {
    packageId: "DI-002",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "ADVANCED_TABLE_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-002",
      representation: "TABLE",
      parentFoundation: "DI-001",
      setContractVersion: "DI-002-SET-CONTRACT-V1",
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL",
      reviewStatus: "UNREVIEWED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-002 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}
