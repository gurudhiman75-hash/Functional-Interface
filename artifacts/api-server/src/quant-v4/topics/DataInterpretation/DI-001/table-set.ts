import { hashSeed, ratioDisplay, seededRandom, shuffle } from "./exact";
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

type OptionCandidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
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
  return ratioDisplay(Number(match[1]), Number(match[2]));
}

function ratioFallbacks(answer: string): OptionCandidate[] {
  const match = answer.match(/^(\d+):(\d+)$/);
  if (!match) return [];
  const left = Number(match[1]);
  const right = Number(match[2]);
  const total = left + right;
  return [
    { text: ratioDisplay(left, total), misconceptionId: "PART_TO_TOTAL_FIRST", derivation: "Treats the first comparison part as a share of the combined total." },
    { text: ratioDisplay(right, total), misconceptionId: "PART_TO_TOTAL_SECOND", derivation: "Treats the second comparison part as a share of the combined total." },
    { text: ratioDisplay(total, left), misconceptionId: "TOTAL_TO_PART_FIRST", derivation: "Uses total-to-first-part instead of the requested branch-to-branch ratio." },
    { text: ratioDisplay(total, right), misconceptionId: "TOTAL_TO_PART_SECOND", derivation: "Uses total-to-second-part instead of the requested branch-to-branch ratio." },
  ];
}

function buildOptions(
  seed: string,
  optionCount: 4 | 5,
  answer: string,
  candidates: readonly OptionCandidate[],
  normalize: (value: string) => string = normalizeText,
) {
  const seen = new Set<string>();
  const retained: Di001Option[] = [];
  const add = (candidate: OptionCandidate) => {
    const key = normalize(candidate.text);
    if (seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI stimulus." });
  candidates.forEach(add);
  if (retained.length < optionCount && normalize === normalizeRatio) ratioFallbacks(answer).forEach(add);
  if (retained.length < optionCount) {
    throw new Error(`DI-001 could construct only ${retained.length} semantically distinct options for answer ${answer}; ${optionCount} are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-001 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildStimulus(seed: string): { stimulus: Di001Stimulus; selectionPercents: number[] } {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const applicants = shuffle(seededRandom(`${seed}:applicants:${attempt}`), APPLICANT_POOL).slice(0, 5);
    const selectionPercents = shuffle(seededRandom(`${seed}:selection-percent:${attempt}`), SELECTION_PERCENT_POOL);
    const rows = BRANCHES.map((branch, index) => {
      const applicantCount = applicants[index]!;
      const selectionPercent = selectionPercents[index]!;
      const selected = (applicantCount * selectionPercent) / 100;
      return { branch, applicants: applicantCount, selected };
    });
    const selectedValues = rows.map((row) => row.selected);
    const integral = selectedValues.every(Number.isInteger);
    const distinctSelected = new Set(selectedValues).size === rows.length;
    const integralAverage = selectedValues.reduce((sum, value) => sum + value, 0) % rows.length === 0;
    if (!integral || !distinctSelected || !integralAverage) continue;
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
  throw new Error("DI-001 could not construct a non-degenerate integral table state within the deterministic attempt bound.");
}

function pairwiseRatioCandidates(
  rows: Di001Stimulus["rows"],
  field: "applicants" | "selected",
  skipLeft: number,
  skipRight: number,
): OptionCandidate[] {
  const candidates: OptionCandidate[] = [];
  for (let left = 0; left < rows.length; left += 1) {
    for (let right = 0; right < rows.length; right += 1) {
      if (left === right || (left === skipLeft && right === skipRight)) continue;
      candidates.push({
        text: ratioDisplay(rows[left]![field], rows[right]![field]),
        misconceptionId: field === "applicants" ? `WRONG_APPLICANT_PAIR_${left}_${right}` : `WRONG_SELECTED_PAIR_${left}_${right}`,
        derivation: field === "applicants"
          ? `Uses ${rows[left]!.branch} and ${rows[right]!.branch} instead of the requested applicant rows.`
          : `Uses Selected values from ${rows[left]!.branch} and ${rows[right]!.branch} instead of the requested Applicants values.`,
      });
    }
  }
  return candidates;
}

function buildQuestionDrafts(stimulus: Di001Stimulus, selectionPercents: readonly number[]): QuestionDraft[] {
  const rows = stimulus.rows;
  const [first, second, third, fourth, fifth] = rows;
  if (!first || !second || !third || !fourth || !fifth) throw new Error("DI-001 table is incomplete.");

  const totalApplicants = rows.reduce((sum, row) => sum + row.applicants, 0);
  const totalSelected = rows.reduce((sum, row) => sum + row.selected, 0);
  const averageApplicants = totalApplicants / rows.length;
  const averageSelected = totalSelected / rows.length;
  if (!Number.isInteger(averageApplicants) || !Number.isInteger(averageSelected)) throw new Error("DI-001 requires integral foundational averages.");

  const differenceSelected = Math.abs(second.selected - fifth.selected);
  const applicantDifference = Math.abs(second.applicants - fifth.applicants);
  const targetPercent = selectionPercents[2]!;
  const targetRatio = ratioDisplay(first.applicants, fourth.applicants);

  const totalCandidates: OptionCandidate[] = [
    { text: formatInteger(totalSelected), misconceptionId: "SUM_WRONG_COLUMN", derivation: "Adds the Selected column instead of Applicants." },
    { text: formatInteger(totalApplicants - first.applicants), misconceptionId: "OMIT_FIRST_ROW", derivation: `Omits ${first.branch} while adding Applicants.` },
    { text: formatInteger(totalApplicants - fifth.applicants), misconceptionId: "OMIT_LAST_ROW", derivation: `Omits ${fifth.branch} while adding Applicants.` },
    { text: formatInteger(averageApplicants), misconceptionId: "AVERAGE_NOT_TOTAL", derivation: "Divides the applicant total by five and reports the mean." },
    ...rows.map((row, index) => ({ text: formatInteger(row.applicants), misconceptionId: `READ_SINGLE_APPLICANT_${index}`, derivation: `Reports only ${row.branch}'s applicant count.` })),
  ];

  const differenceCandidates: OptionCandidate[] = [
    { text: formatInteger(second.selected + fifth.selected), misconceptionId: "ADD_INSTEAD_OF_DIFFERENCE", derivation: "Adds the two Selected values instead of subtracting them." },
    { text: formatInteger(applicantDifference), misconceptionId: "WRONG_COLUMN_DIFFERENCE", derivation: "Finds the difference in Applicants instead of Selected candidates." },
    ...rows.map((row, index) => ({ text: formatInteger(row.selected), misconceptionId: `READ_SINGLE_SELECTED_${index}`, derivation: `Reports ${row.branch}'s Selected cell without comparing the two named rows.` })),
  ];

  const percentageCandidates = selectionPercents
    .filter((_value, index) => index !== 2)
    .map((percent, index): OptionCandidate => ({
      text: `${percent}%`,
      misconceptionId: `READ_OTHER_ROW_PERCENT_${index + 1}`,
      derivation: `Uses the selection percentage belonging to another branch instead of ${third.branch}.`,
    }));

  const ratioCandidates: OptionCandidate[] = [
    { text: ratioDisplay(fourth.applicants, first.applicants), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named branches." },
    ...pairwiseRatioCandidates(rows, "applicants", 0, 3),
    ...pairwiseRatioCandidates(rows, "selected", 0, 3),
    { text: ratioDisplay(first.applicants, first.selected), misconceptionId: "WITHIN_ROW_RATIO", derivation: `Forms Applicants:Selected within ${first.branch} instead of comparing two branches.` },
  ];

  const averageCandidates: OptionCandidate[] = [
    { text: formatInteger(averageApplicants), misconceptionId: "AVERAGE_WRONG_COLUMN", derivation: "Finds the average of Applicants instead of Selected candidates." },
    { text: formatInteger(totalSelected), misconceptionId: "TOTAL_NOT_AVERAGE", derivation: "Adds Selected values but forgets to divide by five." },
    ...rows.map((row, index) => ({ text: formatInteger(row.selected), misconceptionId: `SINGLE_ROW_NOT_AVERAGE_${index}`, derivation: `Uses ${row.branch}'s Selected value instead of averaging all five branches.` })),
  ];

  return [
    {
      kind: "TOTAL", difficulty: "Easy", stem: "What is the total number of applicants across all five branches?", answer: formatInteger(totalApplicants), candidates: totalCandidates,
      explanation: { keyIdea: "The question asks for the total of the Applicants column.", steps: [`${rows.map((row) => row.applicants).join(" + ")} = ${totalApplicants}.`, `Therefore, the five branches have ${totalApplicants} applicants in all.`], shortcut: "Add the Applicants column once; no percentage calculation is needed.", trap: "Do not add the Selected column or divide by five, because the question asks for a total." },
      evidence: { totalApplicants, totalSelected },
    },
    {
      kind: "DIFFERENCE", difficulty: "Easy", stem: `How many more or fewer candidates were selected at ${second.branch} than at ${fifth.branch}?`, answer: formatInteger(differenceSelected), candidates: differenceCandidates,
      explanation: { keyIdea: "Use the Selected values from the two named rows and take their absolute difference.", steps: [`|${second.selected} - ${fifth.selected}| = ${differenceSelected}.`], shortcut: "Read only the two required Selected cells; the other rows are irrelevant.", trap: "The Applicants values are distractor data here; the question specifically asks about selected candidates." },
      evidence: { branchA: second.branch, selectedA: second.selected, branchB: fifth.branch, selectedB: fifth.selected, differenceSelected },
    },
    {
      kind: "PERCENTAGE", difficulty: "Medium", stem: `What percentage of the applicants at ${third.branch} were selected?`, answer: `${targetPercent}%`, candidates: percentageCandidates,
      explanation: { keyIdea: "Selection percentage is Selected divided by Applicants, multiplied by 100.", steps: [`${third.selected}/${third.applicants} × 100 = ${targetPercent}%.`, `So ${targetPercent}% of ${third.branch}'s applicants were selected.`], shortcut: `The fraction ${third.selected}/${third.applicants} reduces directly to ${targetPercent}/100.`, trap: "Keep Applicants in the denominator; reversing the fraction changes the meaning of the percentage." },
      evidence: { branch: third.branch, applicants: third.applicants, selected: third.selected, percentage: targetPercent },
    },
    {
      kind: "RATIO", difficulty: "Medium", stem: `What is the ratio of the number of applicants at ${first.branch} to the number of applicants at ${fourth.branch}?`, answer: targetRatio, normalize: normalizeRatio, candidates: ratioCandidates,
      explanation: { keyIdea: "Take the Applicants values in the same order as the branches named in the question, then reduce the ratio.", steps: [`${first.applicants}:${fourth.applicants} = ${targetRatio}.`], shortcut: "Cancel the greatest common factor directly rather than converting the ratio to decimals.", trap: `Do not reverse the order: the question asks ${first.branch} to ${fourth.branch}.` },
      evidence: { firstBranch: first.branch, firstApplicants: first.applicants, secondBranch: fourth.branch, secondApplicants: fourth.applicants, ratio: targetRatio },
    },
    {
      kind: "AVERAGE", difficulty: "Medium", stem: "What is the average number of selected candidates per branch?", answer: formatInteger(averageSelected), candidates: averageCandidates,
      explanation: { keyIdea: "Average equals the total number selected divided by the number of branches.", steps: [`${rows.map((row) => row.selected).join(" + ")} = ${totalSelected}.`, `${totalSelected} ÷ 5 = ${averageSelected}.`], shortcut: "Add the Selected column and divide once by 5.", trap: "Do not average the Applicants column; both columns contain counts, but only Selected is asked for." },
      evidence: { totalSelected, branchCount: rows.length, averageSelected },
    },
  ];
}

function independentAnswer(stimulus: Di001Stimulus, kind: Di001QuestionKind): string {
  const rows = stimulus.rows;
  switch (kind) {
    case "TOTAL": return formatInteger(rows.reduce((sum, row) => sum + row.applicants, 0));
    case "DIFFERENCE": return formatInteger(Math.abs(rows[1]!.selected - rows[4]!.selected));
    case "PERCENTAGE": {
      const row = rows[2]!;
      const numerator = row.selected * 100;
      if (numerator % row.applicants !== 0) throw new Error("DI-001 verifier found a non-integral percentage state.");
      return `${numerator / row.applicants}%`;
    }
    case "RATIO": return ratioDisplay(rows[0]!.applicants, rows[3]!.applicants);
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
  add("PHYSICAL_COUNTS", set.stimulus.rows.every((row) => Number.isInteger(row.applicants) && Number.isInteger(row.selected) && row.applicants > 0 && row.selected > 0 && row.selected <= row.applicants), "Counts must be positive whole numbers with selected <= applicants.");
  add("NON_DEGENERATE_SELECTED", new Set(set.stimulus.rows.map((row) => row.selected)).size === 5, "Selected counts must be distinct in the foundational table state.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "One foundational set must own five linked questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === set.questions.length, "Each child must test a distinct learner task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the same parent set ID.");
  add("UNIQUE_STEMS", new Set(set.questions.map((question) => question.stem)).size === set.questions.length, "Child stems must be distinct.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every child must expose ${set.optionCount} options for ${set.examProfile}.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every child must have unique displayed options.");
  add("ONE_CORRECT_OPTION", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT"), "Every child must contain exactly one correct option aligned to correctIndex.");
  add("INDEPENDENT_VERIFIER", set.questions.every((question) => independentAnswer(set.stimulus, question.kind) === question.answer), "Independent stimulus recomputation must agree with every child answer.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.keyIdea.length > 20 && question.explanation.steps.length >= 1 && question.explanation.trap.length > 20), "Every child requires a question-specific key idea, worked step and trap.");
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
    const built = buildOptions(`${seed}:${examProfile}:${draft.kind}`, optionCount, draft.answer, draft.candidates, draft.normalize);
    return {
      questionId: `${setId}-Q${index + 1}`,
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
  const { validation: _validation, ...withoutValidation } = set;
  return validateSet(withoutValidation).valid;
}
