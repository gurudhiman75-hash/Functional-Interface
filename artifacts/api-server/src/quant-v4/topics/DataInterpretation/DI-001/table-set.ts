import {
  hashSeed,
  ratioDisplay,
  seededRandom,
  shuffle,
} from "./exact";
import type {
  Di001Difficulty,
  Di001ExamProfile,
  Di001Explanation,
  Di001Option,
  Di001Question,
  Di001QuestionKind,
  Di001QuestionSet,
  Di001SetValidation,
  Di001Stimulus,
} from "./types";

const BRANCHES = ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"] as const;
const APPLICANT_POOL = [150, 200, 250, 300, 350, 400] as const;
const SELECTION_PERCENT_POOL = [40, 50, 60, 70, 80] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di001ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type OptionCandidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type QuestionDraft = Readonly<{
  kind: Di001QuestionKind;
  difficulty: Di001Difficulty;
  stem: string;
  answer: string;
  candidates: readonly OptionCandidate[];
  explanation: Di001Explanation;
  evidence: Readonly<Record<string, string | number>>;
  normalize?: (value: string) => string;
}>;

function formatInteger(value: number): string {
  if (!Number.isInteger(value)) throw new Error(`DI-001 expected an integer but received ${value}.`);
  return String(value);
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeRatio(value: string): string {
  const match = value.trim().match(/^(\d+)\s*:\s*(\d+)$/);
  if (!match) return normalizeText(value);
  const left = Number(match[1]);
  const right = Number(match[2]);
  return ratioDisplay(left, right);
}

function buildOptions(
  seed: string,
  optionCount: 4 | 5,
  answer: string,
  candidates: readonly OptionCandidate[],
  normalize: (value: string) => string = normalizeText,
): { options: string[]; optionMetadata: Di001Option[]; correctIndex: number } {
  const seen = new Set<string>();
  const retained: Di001Option[] = [];

  const add = (candidate: OptionCandidate) => {
    const key = normalize(candidate.text);
    if (seen.has(key)) return;
    seen.add(key);
    retained.push({
      text: candidate.text,
      misconceptionId: candidate.misconceptionId,
      derivation: candidate.derivation,
    });
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI stimulus." });
  for (const candidate of candidates) add(candidate);

  if (retained.length < optionCount) {
    throw new Error(`DI-001 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const chosen = retained.slice(0, optionCount);
  const shuffled = shuffle(seededRandom(`${seed}:options`), chosen);
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-001 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function buildStimulus(seed: string): { stimulus: Di001Stimulus; selectionPercents: number[] } {
  const applicants = shuffle(seededRandom(`${seed}:applicants`), APPLICANT_POOL).slice(0, 5);
  const selectionPercents = shuffle(seededRandom(`${seed}:selection-percent`), SELECTION_PERCENT_POOL);

  const rows = BRANCHES.map((branch, index) => {
    const applicantCount = applicants[index]!;
    const selectionPercent = selectionPercents[index]!;
    const selected = (applicantCount * selectionPercent) / 100;
    if (!Number.isInteger(selected)) throw new Error("DI-001 generated a non-integral selected-candidate count.");
    return { branch, applicants: applicantCount, selected };
  });

  return {
    stimulus: {
      kind: "TABLE",
      title: "Applicants and selected candidates at five branches",
      instruction: "Study the table and answer the five questions that follow.",
      columns: ["Branch", "Applicants", "Selected"],
      rows,
      unit: "candidates",
    },
    selectionPercents,
  };
}

function buildQuestionDrafts(stimulus: Di001Stimulus, selectionPercents: readonly number[]): QuestionDraft[] {
  const rows = stimulus.rows;
  const totalApplicants = rows.reduce((sum, row) => sum + row.applicants, 0);
  const totalSelected = rows.reduce((sum, row) => sum + row.selected, 0);
  const averageApplicants = totalApplicants / rows.length;
  const averageSelected = totalSelected / rows.length;
  if (!Number.isInteger(averageApplicants) || !Number.isInteger(averageSelected)) {
    throw new Error("DI-001 foundational table state must keep both chapter averages integral.");
  }

  const first = rows[0]!;
  const second = rows[1]!;
  const third = rows[2]!;
  const fourth = rows[3]!;
  const fifth = rows[4]!;

  const differenceSelected = Math.abs(second.selected - fifth.selected);
  const comparisonDifference = Math.abs(first.selected - fourth.selected);
  const applicantDifference = Math.abs(second.applicants - fifth.applicants);

  const targetPercent = selectionPercents[2]!;
  const otherPercents = selectionPercents.filter((_value, index) => index !== 2);

  const targetRatio = ratioDisplay(first.applicants, fourth.applicants);
  const reverseTargetRatio = ratioDisplay(fourth.applicants, first.applicants);
  const selectedTargetRatio = ratioDisplay(first.selected, fourth.selected);
  const alternateApplicantRatio = ratioDisplay(second.applicants, fifth.applicants);
  const alternateSelectedRatio = ratioDisplay(second.selected, fifth.selected);
  const branchSelectionRatio = ratioDisplay(first.applicants, first.selected);
  const fourthSelectionRatio = ratioDisplay(fourth.applicants, fourth.selected);

  return [
    {
      kind: "TOTAL",
      difficulty: "Easy",
      stem: "What is the total number of applicants across all five branches?",
      answer: formatInteger(totalApplicants),
      candidates: [
        { text: formatInteger(totalSelected), misconceptionId: "SUM_WRONG_COLUMN", derivation: "Adds the Selected column instead of Applicants." },
        { text: formatInteger(totalApplicants - first.applicants), misconceptionId: "OMIT_FIRST_ROW", derivation: `Omits ${first.branch} while adding the Applicants column.` },
        { text: formatInteger(totalApplicants - fifth.applicants), misconceptionId: "OMIT_LAST_ROW", derivation: `Omits ${fifth.branch} while adding the Applicants column.` },
        { text: formatInteger(averageApplicants), misconceptionId: "AVERAGE_NOT_TOTAL", derivation: "Divides the applicant total by five and reports the average instead of the total." },
        { text: formatInteger(totalSelected + first.applicants), misconceptionId: "MIX_COLUMNS", derivation: `Adds all selected candidates and then adds ${first.branch}'s applicant count.` },
      ],
      explanation: {
        keyIdea: "The question asks for the total of the Applicants column.",
        steps: [
          `${rows.map((row) => row.applicants).join(" + ")} = ${totalApplicants}.`,
          `Therefore, the five branches have ${totalApplicants} applicants in all.`,
        ],
        shortcut: "Add the column once; no percentage or selection calculation is needed.",
        trap: "Do not add the Selected column or divide by five, because the question asks for a total.",
      },
      evidence: { totalApplicants, totalSelected },
    },
    {
      kind: "DIFFERENCE",
      difficulty: "Easy",
      stem: `How many more or fewer candidates were selected at ${second.branch} than at ${fifth.branch}?`,
      answer: formatInteger(differenceSelected),
      candidates: [
        { text: formatInteger(second.selected + fifth.selected), misconceptionId: "ADD_INSTEAD_OF_DIFFERENCE", derivation: `Adds ${second.selected} and ${fifth.selected} instead of subtracting them.` },
        { text: formatInteger(applicantDifference), misconceptionId: "WRONG_COLUMN_DIFFERENCE", derivation: "Finds the difference in Applicants instead of Selected candidates." },
        { text: formatInteger(comparisonDifference), misconceptionId: "WRONG_ROWS", derivation: `Uses ${first.branch} and ${fourth.branch} instead of the two named branches.` },
        { text: formatInteger(second.selected), misconceptionId: "READ_SINGLE_CELL", derivation: `Reports ${second.branch}'s Selected value without comparing it with ${fifth.branch}.` },
        { text: formatInteger(fifth.selected), misconceptionId: "READ_OTHER_CELL", derivation: `Reports ${fifth.branch}'s Selected value without taking the difference.` },
      ],
      explanation: {
        keyIdea: "Use the Selected values from the two named rows and take their absolute difference.",
        steps: [`|${second.selected} - ${fifth.selected}| = ${differenceSelected}.`],
        shortcut: "Read only the two required cells; the other rows are irrelevant.",
        trap: "The Applicants values are distractor data here; the question specifically asks about selected candidates.",
      },
      evidence: { branchA: second.branch, selectedA: second.selected, branchB: fifth.branch, selectedB: fifth.selected, differenceSelected },
    },
    {
      kind: "PERCENTAGE",
      difficulty: "Medium",
      stem: `What percentage of the applicants at ${third.branch} were selected?`,
      answer: `${targetPercent}%`,
      candidates: otherPercents.map((percent, offset) => ({
        text: `${percent}%`,
        misconceptionId: `READ_OTHER_ROW_PERCENT_${offset + 1}`,
        derivation: `Uses the selection percentage belonging to another branch instead of ${third.branch}.`,
      })),
      explanation: {
        keyIdea: "Selection percentage is Selected divided by Applicants, multiplied by 100.",
        steps: [
          `${third.selected}/${third.applicants} × 100 = ${targetPercent}%.`,
          `So ${targetPercent}% of ${third.branch}'s applicants were selected.`,
        ],
        shortcut: `Compare ${third.selected} with ${third.applicants}; the fraction reduces directly to ${targetPercent}/100.`,
        trap: "Keep the denominator as Applicants. Reversing the fraction changes the meaning of the percentage.",
      },
      evidence: { branch: third.branch, applicants: third.applicants, selected: third.selected, percentage: targetPercent },
    },
    {
      kind: "RATIO",
      difficulty: "Medium",
      stem: `What is the ratio of the number of applicants at ${first.branch} to the number of applicants at ${fourth.branch}?`,
      answer: targetRatio,
      normalize: normalizeRatio,
      candidates: [
        { text: reverseTargetRatio, misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named branches." },
        { text: selectedTargetRatio, misconceptionId: "RATIO_WRONG_COLUMN", derivation: "Uses Selected values instead of Applicants." },
        { text: alternateApplicantRatio, misconceptionId: "RATIO_WRONG_ROWS", derivation: `Uses ${second.branch} and ${fifth.branch} instead of the named branches.` },
        { text: alternateSelectedRatio, misconceptionId: "RATIO_WRONG_ROWS_AND_COLUMN", derivation: "Uses the wrong rows and the Selected column." },
        { text: branchSelectionRatio, misconceptionId: "WITHIN_ROW_RATIO", derivation: `Forms Applicants:Selected within ${first.branch} instead of comparing two branches.` },
        { text: fourthSelectionRatio, misconceptionId: "WITHIN_OTHER_ROW_RATIO", derivation: `Forms Applicants:Selected within ${fourth.branch}.` },
      ],
      explanation: {
        keyIdea: "Take the Applicants values in the same order as the branches named in the question, then reduce the ratio.",
        steps: [`${first.applicants}:${fourth.applicants} = ${targetRatio}.`],
        shortcut: "Cancel the greatest common factor directly rather than converting the ratio to decimals.",
        trap: `Do not reverse the order: the question asks ${first.branch} to ${fourth.branch}.`,
      },
      evidence: { firstBranch: first.branch, firstApplicants: first.applicants, secondBranch: fourth.branch, secondApplicants: fourth.applicants, ratio: targetRatio },
    },
    {
      kind: "AVERAGE",
      difficulty: "Medium",
      stem: "What is the average number of selected candidates per branch?",
      answer: formatInteger(averageSelected),
      candidates: [
        { text: formatInteger(averageApplicants), misconceptionId: "AVERAGE_WRONG_COLUMN", derivation: "Finds the average of Applicants instead of Selected candidates." },
        { text: formatInteger(totalSelected), misconceptionId: "TOTAL_NOT_AVERAGE", derivation: "Adds the Selected column but forgets to divide by five." },
        { text: formatInteger(Math.max(...rows.map((row) => row.selected))), misconceptionId: "MAX_NOT_AVERAGE", derivation: "Reports the largest Selected value rather than the mean." },
        { text: formatInteger(Math.min(...rows.map((row) => row.selected))), misconceptionId: "MIN_NOT_AVERAGE", derivation: "Reports the smallest Selected value rather than the mean." },
        { text: formatInteger(third.selected), misconceptionId: "MIDDLE_ROW_NOT_AVERAGE", derivation: `Uses ${third.branch}'s Selected value as though the middle row represented the average.` },
      ],
      explanation: {
        keyIdea: "Average equals the total number selected divided by the number of branches.",
        steps: [
          `${rows.map((row) => row.selected).join(" + ")} = ${totalSelected}.`,
          `${totalSelected} ÷ 5 = ${averageSelected}.`,
        ],
        shortcut: "Because there are five rows, add the Selected column and divide once by 5.",
        trap: "Do not average the Applicants column; both columns contain counts, but only Selected is asked for.",
      },
      evidence: { totalSelected, branchCount: rows.length, averageSelected },
    },
  ];
}

function independentAnswer(stimulus: Di001Stimulus, kind: Di001QuestionKind): string {
  const rows = stimulus.rows;
  switch (kind) {
    case "TOTAL":
      return formatInteger(rows.reduce((sum, row) => sum + row.applicants, 0));
    case "DIFFERENCE":
      return formatInteger(Math.abs(rows[1]!.selected - rows[4]!.selected));
    case "PERCENTAGE": {
      const row = rows[2]!;
      const numerator = row.selected * 100;
      if (numerator % row.applicants !== 0) throw new Error("DI-001 verifier found a non-integral percentage state.");
      return `${numerator / row.applicants}%`;
    }
    case "RATIO":
      return ratioDisplay(rows[0]!.applicants, rows[3]!.applicants);
    case "AVERAGE": {
      const total = rows.reduce((sum, row) => sum + row.selected, 0);
      if (total % rows.length !== 0) throw new Error("DI-001 verifier found a non-integral average state.");
      return formatInteger(total / rows.length);
    }
  }
}

function validateSet(set: Omit<Di001QuestionSet, "validation">): Di001SetValidation {
  const checks: Array<{ id: string; passed: boolean; message: string }> = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("TABLE_ROW_COUNT", set.stimulus.rows.length === 5, "The foundational table must contain exactly five rows.");
  add(
    "PHYSICAL_COUNTS",
    set.stimulus.rows.every((row) => Number.isInteger(row.applicants) && Number.isInteger(row.selected) && row.applicants > 0 && row.selected > 0 && row.selected <= row.applicants),
    "Applicants and selected counts must be positive whole numbers with selected <= applicants.",
  );
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "One foundational set must own five linked questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === set.questions.length, "Each child question must test a distinct learner task in this foundation.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child question must retain the same parent set ID.");
  add("UNIQUE_STEMS", new Set(set.questions.map((question) => question.stem)).size === set.questions.length, "Linked child stems must be distinct.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every child must expose ${set.optionCount} options for ${set.examProfile}.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every child must have unique displayed options.");
  add(
    "ONE_CORRECT_OPTION",
    set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT"),
    "Every child must contain exactly one correct option aligned to correctIndex.",
  );
  add(
    "INDEPENDENT_VERIFIER",
    set.questions.every((question) => independentAnswer(set.stimulus, question.kind) === question.answer),
    "Independent stimulus recomputation must agree with every child answer.",
  );
  add(
    "EXPLANATION_SPECIFICITY",
    set.questions.every((question) => question.explanation.keyIdea.length > 20 && question.explanation.steps.length >= 1 && question.explanation.trap.length > 20),
    "Every child requires a question-specific key idea, worked step and trap.",
  );
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "Phase-0 DI content must remain review-only and non-public.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi001TableSet(input: { seed?: string; examProfile?: Di001ExamProfile } = {}): Di001QuestionSet {
  const seed = input.seed ?? "DI-001:TABLE:PHASE0";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const { stimulus, selectionPercents } = buildStimulus(seed);
  const drafts = buildQuestionDrafts(stimulus, selectionPercents);
  const setId = `DI-001-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di001Question => {
    const questionId = `${setId}-Q${index + 1}`;
    const built = buildOptions(
      `${seed}:${examProfile}:${draft.kind}`,
      optionCount,
      draft.answer,
      draft.candidates,
      draft.normalize,
    );
    return {
      questionId,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: built.options,
      optionMetadata: built.optionMetadata,
      correctIndex: built.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation: Omit<Di001QuestionSet, "validation"> = {
    packageId: "DI-001",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "FOUNDATIONAL_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-001",
      representation: "TABLE",
      setContractVersion: "DI-001-SET-CONTRACT-V1",
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
    throw new Error(`DI-001 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}

export function verifyDi001QuestionSet(set: Di001QuestionSet): boolean {
  return validateSet({ ...set, validation: undefined } as unknown as Omit<Di001QuestionSet, "validation">).valid;
}
