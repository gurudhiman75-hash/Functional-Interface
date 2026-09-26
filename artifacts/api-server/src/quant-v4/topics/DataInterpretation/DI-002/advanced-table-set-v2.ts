import {
  hashSeed,
  pick,
  ratioDisplay,
  seededRandom,
  shuffle,
} from "../DI-001/exact";
import type {
  Di002V2Difficulty,
  Di002V2ExamProfile,
  Di002V2Explanation,
  Di002V2Option,
  Di002V2Question,
  Di002V2QuestionSet,
  Di002V2Row,
  Di002V2Stimulus,
  Di002V2TaskKind,
  Di002V2ValidationCheck,
} from "./advanced-table-v2-types";

const OPTION_COUNT_BY_PROFILE: Record<Di002V2ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

const BASE_POOL = [84, 168, 252, 336, 420, 504] as const;
const SELECTED_FACTORS = [4, 5, 6, 7, 8] as const;
const SELECTION_PERCENT_POOL = [40, 50, 60, 70, 80] as const;

const CONTEXTS = [
  {
    id: "RECRUITMENT_CENTRES",
    title: "Applications and selections at recruitment centres",
    rowHeader: "Centre",
    labels: ["Centre A", "Centre B", "Centre C", "Centre D", "Centre E", "Centre F", "Centre G", "Centre H", "Centre I", "Centre J", "Centre K", "Centre L", "Centre M", "Centre N", "Centre O", "Centre P", "Centre Q", "Centre R", "Centre S", "Centre T", "Centre U", "Centre V", "Centre W", "Centre X"],
  },
  {
    id: "TRAINING_BATCHES",
    title: "Candidates registered and selected from training batches",
    rowHeader: "Batch",
    labels: ["Batch A", "Batch B", "Batch C", "Batch D", "Batch E", "Batch F", "Batch G", "Batch H", "Batch I", "Batch J", "Batch K", "Batch L", "Batch M", "Batch N", "Batch O", "Batch P", "Batch Q", "Batch R", "Batch S", "Batch T", "Batch U", "Batch V", "Batch W", "Batch X"],
  },
  {
    id: "DEPARTMENTS",
    title: "Applicants and final selections across departments",
    rowHeader: "Department",
    labels: ["Accounts", "Administration", "Audit", "Compliance", "Customer Care", "Finance", "Human Resources", "Information Technology", "Legal", "Logistics", "Marketing", "Operations", "Planning", "Procurement", "Production", "Quality", "Research", "Sales", "Service", "Stores", "Support", "Training", "Transport", "Verification"],
  },
  {
    id: "SERVICE_UNITS",
    title: "Applications processed and candidates selected by service units",
    rowHeader: "Unit",
    labels: ["Unit A", "Unit B", "Unit C", "Unit D", "Unit E", "Unit F", "Unit G", "Unit H", "Unit I", "Unit J", "Unit K", "Unit L", "Unit M", "Unit N", "Unit O", "Unit P", "Unit Q", "Unit R", "Unit S", "Unit T", "Unit U", "Unit V", "Unit W", "Unit X"],
  },
  {
    id: "SCHOLARSHIP_ZONES",
    title: "Scholarship applications and final selections by zone",
    rowHeader: "Zone",
    labels: ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G", "Zone H", "Zone I", "Zone J", "Zone K", "Zone L", "Zone M", "Zone N", "Zone O", "Zone P", "Zone Q", "Zone R", "Zone S", "Zone T", "Zone U", "Zone V", "Zone W", "Zone X"],
  },
  {
    id: "BRANCH_RECRUITMENT",
    title: "Recruitment applications and selections at branches",
    rowHeader: "Branch",
    labels: ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E", "Branch F", "Branch G", "Branch H", "Branch I", "Branch J", "Branch K", "Branch L", "Branch M", "Branch N", "Branch O", "Branch P", "Branch Q", "Branch R", "Branch S", "Branch T", "Branch U", "Branch V", "Branch W", "Branch X"],
  },
] as const;

const EASY_KINDS: readonly Di002V2TaskKind[] = [
  "DIRECT_SELECTED_VALUE",
  "DIRECT_SELECTION_RATE",
];

const MEDIUM_KINDS: readonly Di002V2TaskKind[] = [
  "MISSING_APPLICANTS_FROM_RATE",
  "REJECTED_COUNT",
  "SELECTED_DIFFERENCE",
  "COMBINED_SELECTED",
  "SELECTION_RATE_POINT_GAP",
  "SELECTED_SHARE_OF_TOTAL",
];

const HARD_KINDS: readonly Di002V2TaskKind[] = [
  "COMBINED_SELECTED_RATIO",
  "RELATIVE_SELECTED_PERCENT_EXCESS",
  "COMBINED_SELECTION_RATE",
  "REJECTED_TO_SELECTED_RATIO",
];

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;

type Draft = Readonly<{
  kind: Di002V2TaskKind;
  difficulty: Di002V2Difficulty;
  stemSurfaceId: "S1" | "S2" | "S3";
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di002V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

function nearestWholePercent(numerator: number, denominator: number): number {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-002 V2 received an invalid percentage fraction.");
  }
  return Math.round((numerator * 100) / denominator);
}

function deriveApplicants(row: Pick<Di002V2Row, "selected" | "selectionPercent">): number {
  const value = (row.selected * 100) / row.selectionPercent;
  if (!Number.isSafeInteger(value) || value < row.selected) {
    throw new Error("DI-002 V2 generated an invalid reverse-percentage applicant count.");
  }
  return value;
}

function actualApplicants(stimulus: Di002V2Stimulus): number[] {
  return stimulus.rows.map((row) => deriveApplicants(row));
}

function buildStimulus(seed: string): Di002V2Stimulus {
  const context = pick(seededRandom(`${seed}:context`), CONTEXTS);
  const labels = shuffle(seededRandom(`${seed}:labels`), context.labels).slice(0, 5);
  const factors = shuffle(seededRandom(`${seed}:factors`), SELECTED_FACTORS);
  const percents = shuffle(seededRandom(`${seed}:rates`), SELECTION_PERCENT_POOL);
  const base = pick(seededRandom(`${seed}:base`), BASE_POOL);
  const hiddenApplicantIndex = pick(seededRandom(`${seed}:hidden`), [0, 1, 2, 3, 4] as const);

  const rows = labels.map((label, index): Di002V2Row => {
    const selected = base * factors[index]!;
    const selectionPercent = percents[index]!;
    const applicants = deriveApplicants({ selected, selectionPercent });
    return {
      label,
      applicants: index === hiddenApplicantIndex ? "?" : applicants,
      selected,
      selectionPercent,
    };
  });

  return {
    kind: "TABLE",
    contextId: context.id,
    title: context.title,
    instruction: "Study the table and answer the questions that follow. One value in the Applicants column is missing and can be found from the same row.",
    rowHeader: context.rowHeader,
    columns: [context.rowHeader, "Applicants", "Selected", "Selection %"],
    rows,
    hiddenApplicantIndex,
    unit: "candidates",
  };
}

function surface(seed: string, variants: readonly [string, string, string]) {
  const index = pick(seededRandom(seed), [0, 1, 2] as const);
  return {
    stemSurfaceId: (`S${index + 1}`) as "S1" | "S2" | "S3",
    stem: variants[index],
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di002V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-002 V2 table." });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-002 V2 could construct only ${retained.length} unique options for answer ${answer}; ${optionCount} are required.`);
  }

  const chosen = retained.slice(0, optionCount);
  const shuffled = shuffle(seededRandom(`${seed}:options`), chosen);
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-002 V2 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function pair(seed: string, allowed: readonly (readonly [number, number])[]) {
  return pick(seededRandom(seed), allowed);
}

function fourTuple(seed: string) {
  return pick(
    seededRandom(seed),
    [
      [0, 1, 2, 3],
      [0, 2, 1, 4],
      [0, 4, 1, 3],
      [1, 2, 3, 4],
      [1, 4, 0, 2],
      [2, 4, 0, 3],
    ] as const,
  );
}

function buildAllDrafts(seed: string, stimulus: Di002V2Stimulus): Draft[] {
  const rows = stimulus.rows;
  const applicants = actualApplicants(stimulus);
  const selected = rows.map((row) => row.selected);
  const rejected = rows.map((row, index) => applicants[index]! - row.selected);
  const totalSelected = selected.reduce((sum, value) => sum + value, 0);

  const directIndex = pick(seededRandom(`${seed}:direct-index`), [0, 1, 2, 3, 4] as const);
  const rateIndex = pick(seededRandom(`${seed}:rate-index`), [0, 1, 2, 3, 4] as const);
  const hiddenIndex = stimulus.hiddenApplicantIndex;
  const visibleIndexes = [0, 1, 2, 3, 4].filter((index) => index !== hiddenIndex);
  const rejectedIndex = pick(seededRandom(`${seed}:rejected-index`), visibleIndexes);

  const differencePair = pair(`${seed}:difference-pair`, [[0, 1], [0, 3], [1, 2], [1, 4], [2, 4], [3, 4]] as const);
  const combinedPair = pair(`${seed}:combined-pair`, [[0, 2], [0, 4], [1, 3], [2, 4], [1, 4]] as const);
  const pointPair = pair(`${seed}:point-pair`, [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]] as const);
  const shareIndex = pick(seededRandom(`${seed}:share-index`), [0, 1, 2, 3, 4] as const);
  const ratioTuple = fourTuple(`${seed}:ratio-groups`);
  const relativePair = pair(`${seed}:relative-pair`, [[0, 1], [0, 3], [1, 2], [1, 4], [2, 3], [3, 4]] as const);
  const ratePair = pair(`${seed}:combined-rate-pair`, [[0, 2], [0, 4], [1, 3], [1, 4], [2, 4]] as const);
  const rejectPair = pair(`${seed}:reject-ratio-pair`, [[0, 1], [0, 3], [1, 2], [1, 4], [2, 4]] as const);

  const [diffA, diffB] = differencePair;
  const diffAnswer = Math.abs(selected[diffA]! - selected[diffB]!);
  const [combA, combB] = combinedPair;
  const combinedAnswer = selected[combA]! + selected[combB]!;
  const [pointA, pointB] = pointPair;
  const pointGap = Math.abs(rows[pointA]!.selectionPercent - rows[pointB]!.selectionPercent);
  const sharePercent = nearestWholePercent(selected[shareIndex]!, totalSelected);

  const [leftA, leftB, rightA, rightB] = ratioTuple;
  const leftSelected = selected[leftA]! + selected[leftB]!;
  const rightSelected = selected[rightA]! + selected[rightB]!;
  const ratioAnswer = ratioDisplay(leftSelected, rightSelected);

  const [relA, relB] = relativePair;
  const largerIndex = selected[relA]! > selected[relB]! ? relA : relB;
  const smallerIndex = largerIndex === relA ? relB : relA;
  const relativeDifference = selected[largerIndex]! - selected[smallerIndex]!;
  const relativePercent = nearestWholePercent(relativeDifference, selected[smallerIndex]!);

  const [rateA, rateB] = ratePair;
  const rateSelected = selected[rateA]! + selected[rateB]!;
  const rateApplicants = applicants[rateA]! + applicants[rateB]!;
  const combinedRate = nearestWholePercent(rateSelected, rateApplicants);
  const simpleRateAverage = Math.round((rows[rateA]!.selectionPercent + rows[rateB]!.selectionPercent) / 2);

  const [rejectA, rejectB] = rejectPair;
  const combinedRejected = rejected[rejectA]! + rejected[rejectB]!;
  const combinedSelectedForRejectPair = selected[rejectA]! + selected[rejectB]!;
  const rejectedRatio = ratioDisplay(combinedRejected, combinedSelectedForRejectPair);

  const directSurface = surface(`${seed}:DIRECT_SELECTED_VALUE:surface`, [
    `How many candidates were selected from ${rows[directIndex]!.label}?`,
    `Find the number of selected candidates for ${rows[directIndex]!.label}.`,
    `The Selected value for ${rows[directIndex]!.label} is:`,
  ]);

  const rateSurface = surface(`${seed}:DIRECT_SELECTION_RATE:surface`, [
    `What was the selection percentage for ${rows[rateIndex]!.label}?`,
    `Find the selection rate shown for ${rows[rateIndex]!.label}.`,
    `The Selection % for ${rows[rateIndex]!.label} is:`,
  ]);

  const hiddenRow = rows[hiddenIndex]!;
  const missingSurface = surface(`${seed}:MISSING_APPLICANTS_FROM_RATE:surface`, [
    `The Applicants value for ${hiddenRow.label} is missing. How many candidates applied there?`,
    `For ${hiddenRow.label}, ${hiddenRow.selected} candidates were selected at a selection rate of ${hiddenRow.selectionPercent}%. Find the number of applicants.`,
    `Using the data for ${hiddenRow.label}, calculate the missing Applicants entry.`,
  ]);

  const rejectedSurface = surface(`${seed}:REJECTED_COUNT:surface`, [
    `How many applicants from ${rows[rejectedIndex]!.label} were not selected?`,
    `Find the number of candidates not selected from ${rows[rejectedIndex]!.label}.`,
    `Applicants minus Selected for ${rows[rejectedIndex]!.label} equals:`,
  ]);

  const differenceSurface = surface(`${seed}:SELECTED_DIFFERENCE:surface`, [
    `What is the difference between the numbers selected from ${rows[diffA]!.label} and ${rows[diffB]!.label}?`,
    `How many more candidates were selected in the higher of ${rows[diffA]!.label} and ${rows[diffB]!.label} than in the other?`,
    `Find the absolute difference in Selected values for ${rows[diffA]!.label} and ${rows[diffB]!.label}.`,
  ]);

  const combinedSurface = surface(`${seed}:COMBINED_SELECTED:surface`, [
    `How many candidates were selected altogether from ${rows[combA]!.label} and ${rows[combB]!.label}?`,
    `Find the combined Selected total for ${rows[combA]!.label} and ${rows[combB]!.label}.`,
    `The sum of selected candidates from ${rows[combA]!.label} and ${rows[combB]!.label} is:`,
  ]);

  const pointSurface = surface(`${seed}:SELECTION_RATE_POINT_GAP:surface`, [
    `What is the difference between the selection rates of ${rows[pointA]!.label} and ${rows[pointB]!.label}?`,
    `By how many percentage points do the selection rates of ${rows[pointA]!.label} and ${rows[pointB]!.label} differ?`,
    `Find the absolute gap in Selection % between ${rows[pointA]!.label} and ${rows[pointB]!.label}.`,
  ]);

  const shareSurface = surface(`${seed}:SELECTED_SHARE_OF_TOTAL:surface`, [
    `The selected candidates from ${rows[shareIndex]!.label} form approximately what percentage of all selected candidates? Give the nearest whole percent.`,
    `To the nearest whole percent, what share of the total Selected column comes from ${rows[shareIndex]!.label}?`,
    `Selected candidates from ${rows[shareIndex]!.label} are what percent of the all-row selected total, to the nearest whole percent?`,
  ]);

  const ratioSurface = surface(`${seed}:COMBINED_SELECTED_RATIO:surface`, [
    `What is the ratio of the combined number selected from ${rows[leftA]!.label} and ${rows[leftB]!.label} to that from ${rows[rightA]!.label} and ${rows[rightB]!.label}?`,
    `Find the ratio: Selected(${rows[leftA]!.label} + ${rows[leftB]!.label}) : Selected(${rows[rightA]!.label} + ${rows[rightB]!.label}).`,
    `The combined selected totals of ${rows[leftA]!.label}, ${rows[leftB]!.label} and ${rows[rightA]!.label}, ${rows[rightB]!.label} are in what ratio, in that order?`,
  ]);

  const relativeSurface = surface(`${seed}:RELATIVE_SELECTED_PERCENT_EXCESS:surface`, [
    `The number selected from ${rows[largerIndex]!.label} is approximately what percent more than that from ${rows[smallerIndex]!.label}? Give the nearest whole percent.`,
    `By what percentage does Selected for ${rows[largerIndex]!.label} exceed Selected for ${rows[smallerIndex]!.label}, to the nearest whole percent?`,
    `Taking ${rows[smallerIndex]!.label} as the base, find the percentage excess of the Selected value for ${rows[largerIndex]!.label}. Round to the nearest whole percent.`,
  ]);

  const combinedRateSurface = surface(`${seed}:COMBINED_SELECTION_RATE:surface`, [
    `If ${rows[rateA]!.label} and ${rows[rateB]!.label} are considered together, what is their overall selection rate to the nearest whole percent?`,
    `Find the combined selection percentage for ${rows[rateA]!.label} and ${rows[rateB]!.label}. Use their combined Selected and combined Applicants values and round to the nearest whole percent.`,
    `To the nearest whole percent, Selected(${rows[rateA]!.label} + ${rows[rateB]!.label}) is what percent of Applicants(${rows[rateA]!.label} + ${rows[rateB]!.label})?`,
  ]);

  const rejectedRatioSurface = surface(`${seed}:REJECTED_TO_SELECTED_RATIO:surface`, [
    `For ${rows[rejectA]!.label} and ${rows[rejectB]!.label} together, what is the ratio of candidates not selected to candidates selected?`,
    `Find the ratio of combined Rejected to combined Selected for ${rows[rejectA]!.label} and ${rows[rejectB]!.label}.`,
    `After finding the rejected counts for ${rows[rejectA]!.label} and ${rows[rejectB]!.label}, form their combined Rejected : Selected ratio.`,
  ]);

  return [
    {
      kind: "DIRECT_SELECTED_VALUE",
      difficulty: "Easy",
      ...directSurface,
      answer: String(selected[directIndex]!),
      candidates: rows
        .map((row, index) => ({ row, index }))
        .filter(({ index }) => index !== directIndex)
        .map(({ row, index }) => ({ text: String(row.selected), misconceptionId: `READ_SELECTED_ROW_${index + 1}`, derivation: `Reads the Selected value from ${row.label} instead of the requested row.` })),
      explanation: {
        keyIdea: "Read the required entry directly from the Selected column.",
        steps: [`${rows[directIndex]!.label} has ${selected[directIndex]} in the Selected column.`],
      },
      evidence: { targetIndex: directIndex },
    },
    {
      kind: "DIRECT_SELECTION_RATE",
      difficulty: "Easy",
      ...rateSurface,
      answer: `${rows[rateIndex]!.selectionPercent}%`,
      candidates: rows
        .map((row, index) => ({ row, index }))
        .filter(({ index }) => index !== rateIndex)
        .map(({ row, index }) => ({ text: `${row.selectionPercent}%`, misconceptionId: `READ_RATE_ROW_${index + 1}`, derivation: `Reads the Selection % from ${row.label} instead of the requested row.` })),
      explanation: {
        keyIdea: "Read the required percentage directly from the Selection % column.",
        steps: [`${rows[rateIndex]!.label} shows a selection rate of ${rows[rateIndex]!.selectionPercent}%.`],
      },
      evidence: { targetIndex: rateIndex },
    },
    {
      kind: "MISSING_APPLICANTS_FROM_RATE",
      difficulty: "Medium",
      ...missingSurface,
      answer: String(applicants[hiddenIndex]!),
      candidates: [
        ...applicants.map((value, index) => ({ value, index })).filter(({ index }) => index !== hiddenIndex).map(({ value, index }) => ({
          text: String(value),
          misconceptionId: `COPY_APPLICANTS_ROW_${index + 1}`,
          derivation: `Copies the Applicants value reconstructed for ${rows[index]!.label}.`,
        })),
        { text: String(hiddenRow.selected), misconceptionId: "COPY_SELECTED", derivation: "Copies the Selected count instead of recovering the whole applicant count." },
        { text: String(applicants[hiddenIndex]! - hiddenRow.selected), misconceptionId: "USE_REJECTED_ONLY", derivation: "Finds the rejected count and mistakes it for total applicants." },
      ],
      explanation: {
        keyIdea: "The Selected figure is the stated percentage of Applicants, so reverse the percentage.",
        steps: [
          `${hiddenRow.selectionPercent}% of Applicants = ${hiddenRow.selected}.`,
          `Applicants = ${hiddenRow.selected} × 100 / ${hiddenRow.selectionPercent} = ${applicants[hiddenIndex]}.`,
        ],
        workingTable: {
          headers: ["Selected", "Selection %", "Applicants"],
          rows: [[String(hiddenRow.selected), `${hiddenRow.selectionPercent}%`, String(applicants[hiddenIndex]!)]],
        },
      },
      evidence: { targetIndex: hiddenIndex },
    },
    {
      kind: "REJECTED_COUNT",
      difficulty: "Medium",
      ...rejectedSurface,
      answer: String(rejected[rejectedIndex]!),
      candidates: [
        { text: String(selected[rejectedIndex]!), misconceptionId: "COPY_SELECTED", derivation: "Uses Selected instead of Applicants minus Selected." },
        { text: String(applicants[rejectedIndex]!), misconceptionId: "COPY_APPLICANTS", derivation: "Uses the full Applicants value without subtracting Selected." },
        ...rejected.map((value, index) => ({ value, index })).filter(({ index }) => index !== rejectedIndex).map(({ value, index }) => ({
          text: String(value),
          misconceptionId: `REJECTED_OTHER_ROW_${index + 1}`,
          derivation: `Uses the rejected count from ${rows[index]!.label}.`,
        })),
      ],
      explanation: {
        keyIdea: "Candidates not selected = Applicants − Selected.",
        steps: [
          `Applicants at ${rows[rejectedIndex]!.label} = ${applicants[rejectedIndex]}.`,
          `Not selected = ${applicants[rejectedIndex]} - ${selected[rejectedIndex]} = ${rejected[rejectedIndex]}.`,
        ],
      },
      evidence: { targetIndex: rejectedIndex },
    },
    {
      kind: "SELECTED_DIFFERENCE",
      difficulty: "Medium",
      ...differenceSurface,
      answer: String(diffAnswer),
      candidates: [
        { text: String(selected[diffA]! + selected[diffB]!), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two Selected values instead of finding their difference." },
        { text: String(selected[diffA]!), misconceptionId: "USE_FIRST_VALUE", derivation: "Uses only the first Selected value." },
        { text: String(selected[diffB]!), misconceptionId: "USE_SECOND_VALUE", derivation: "Uses only the second Selected value." },
        { text: String(Math.abs(applicants[diffA]! - applicants[diffB]!)), misconceptionId: "USE_APPLICANTS_DIFFERENCE", derivation: "Finds the difference in Applicants instead of Selected." },
        { text: String(Math.abs(rejected[diffA]! - rejected[diffB]!)), misconceptionId: "USE_REJECTED_DIFFERENCE", derivation: "Finds the difference in rejected counts instead of Selected." },
      ],
      explanation: {
        keyIdea: "Use the two values from the Selected column and subtract the smaller from the larger.",
        steps: [
          `Selected values = ${selected[diffA]} and ${selected[diffB]}.`,
          `Difference = |${selected[diffA]} - ${selected[diffB]}| = ${diffAnswer}.`,
        ],
      },
      evidence: { firstIndex: diffA, secondIndex: diffB },
    },
    {
      kind: "COMBINED_SELECTED",
      difficulty: "Medium",
      ...combinedSurface,
      answer: String(combinedAnswer),
      candidates: [
        { text: String(Math.abs(selected[combA]! - selected[combB]!)), misconceptionId: "SUBTRACT_INSTEAD_OF_ADD", derivation: "Subtracts the two Selected values instead of combining them." },
        { text: String(selected[combA]!), misconceptionId: "USE_FIRST_ONLY", derivation: "Uses only the first named row." },
        { text: String(selected[combB]!), misconceptionId: "USE_SECOND_ONLY", derivation: "Uses only the second named row." },
        { text: String(applicants[combA]! + applicants[combB]!), misconceptionId: "ADD_APPLICANTS", derivation: "Adds Applicants instead of Selected." },
        { text: String(totalSelected), misconceptionId: "USE_ALL_ROW_TOTAL", derivation: "Uses the Selected total for all five rows." },
      ],
      explanation: {
        keyIdea: "Add the Selected values for the two named rows.",
        steps: [
          `${rows[combA]!.label}: ${selected[combA]}; ${rows[combB]!.label}: ${selected[combB]}.`,
          `Combined Selected = ${selected[combA]} + ${selected[combB]} = ${combinedAnswer}.`,
        ],
      },
      evidence: { firstIndex: combA, secondIndex: combB },
    },
    {
      kind: "SELECTION_RATE_POINT_GAP",
      difficulty: "Medium",
      ...pointSurface,
      answer: `${pointGap} percentage points`,
      candidates: [
        { text: `${nearestWholePercent(pointGap, Math.min(rows[pointA]!.selectionPercent, rows[pointB]!.selectionPercent))}%`, misconceptionId: "RELATIVE_PERCENT_NOT_POINTS", derivation: "Calculates relative percentage change instead of the percentage-point gap." },
        { text: `${Math.max(rows[pointA]!.selectionPercent, rows[pointB]!.selectionPercent)} percentage points`, misconceptionId: "USE_LARGER_RATE", derivation: "Copies the larger rate instead of subtracting." },
        { text: `${Math.min(rows[pointA]!.selectionPercent, rows[pointB]!.selectionPercent)} percentage points`, misconceptionId: "USE_SMALLER_RATE", derivation: "Copies the smaller rate instead of subtracting." },
        { text: `${rows[pointA]!.selectionPercent + rows[pointB]!.selectionPercent} percentage points`, misconceptionId: "ADD_RATES", derivation: "Adds the two rates instead of finding their gap." },
        { text: `${Math.abs(selected[pointA]! - selected[pointB]!)} percentage points`, misconceptionId: "USE_SELECTED_GAP", derivation: "Uses the gap in Selected counts and labels it as percentage points." },
      ],
      explanation: {
        keyIdea: "A percentage-point gap is found by subtracting the two percentage rates.",
        steps: [
          `Rates = ${rows[pointA]!.selectionPercent}% and ${rows[pointB]!.selectionPercent}%.`,
          `Gap = |${rows[pointA]!.selectionPercent} - ${rows[pointB]!.selectionPercent}| = ${pointGap} percentage points.`,
        ],
      },
      evidence: { firstIndex: pointA, secondIndex: pointB },
    },
    {
      kind: "SELECTED_SHARE_OF_TOTAL",
      difficulty: "Medium",
      ...shareSurface,
      answer: `${sharePercent}%`,
      candidates: [
        { text: `${nearestWholePercent(selected[shareIndex]!, applicants[shareIndex]!)}%`, misconceptionId: "USE_ROW_APPLICANTS_AS_WHOLE", derivation: "Calculates the row selection rate instead of share of all selected candidates." },
        { text: `${nearestWholePercent(totalSelected, selected[shareIndex]!)}%`, misconceptionId: "REVERSE_PART_WHOLE", derivation: "Reverses part and whole." },
        { text: `${rows[shareIndex]!.selectionPercent}%`, misconceptionId: "COPY_SELECTION_RATE", derivation: "Copies the row Selection % instead of using the Selected-column total." },
        { text: `${nearestWholePercent(applicants[shareIndex]!, applicants.reduce((sum, value) => sum + value, 0))}%`, misconceptionId: "USE_APPLICANT_SHARE", derivation: "Finds the row share of Applicants rather than Selected." },
        { text: `${nearestWholePercent(selected[(shareIndex + 1) % 5]!, totalSelected)}%`, misconceptionId: "USE_ADJACENT_ROW_SHARE", derivation: "Calculates the Selected share for a different row." },
      ],
      explanation: {
        keyIdea: "Use the requested Selected value as the part and the total of the Selected column as the whole.",
        steps: [
          `All-row Selected total = ${selected.join(" + ")} = ${totalSelected}.`,
          `Required share = ${selected[shareIndex]}/${totalSelected} × 100 ≈ ${sharePercent}%.`,
        ],
      },
      evidence: { targetIndex: shareIndex },
    },
    {
      kind: "COMBINED_SELECTED_RATIO",
      difficulty: "Hard",
      ...ratioSurface,
      answer: ratioAnswer,
      candidates: [
        { text: ratioDisplay(rightSelected, leftSelected), misconceptionId: "REVERSE_GROUP_RATIO", derivation: "Reverses the two combined groups." },
        { text: ratioDisplay(selected[leftA]!, selected[rightA]!), misconceptionId: "USE_FIRST_ROW_ONLY", derivation: "Uses only the first row of each group." },
        { text: ratioDisplay(selected[leftB]!, selected[rightB]!), misconceptionId: "USE_SECOND_ROW_ONLY", derivation: "Uses only the second row of each group." },
        { text: ratioDisplay(applicants[leftA]! + applicants[leftB]!, applicants[rightA]! + applicants[rightB]!), misconceptionId: "USE_APPLICANTS_GROUPS", derivation: "Forms the grouping from Applicants instead of Selected." },
        { text: ratioDisplay(selected[leftA]! + selected[rightA]!, selected[leftB]! + selected[rightB]!), misconceptionId: "REGROUP_CROSSWISE", derivation: "Regroups the four rows crosswise." },
      ],
      explanation: {
        keyIdea: "Find each named Selected subtotal first, then reduce their ratio.",
        steps: [
          `First subtotal = ${selected[leftA]} + ${selected[leftB]} = ${leftSelected}.`,
          `Second subtotal = ${selected[rightA]} + ${selected[rightB]} = ${rightSelected}.`,
          `${leftSelected}:${rightSelected} = ${ratioAnswer}.`,
        ],
        workingTable: {
          headers: ["Group", "Selected subtotal"],
          rows: [["First group", String(leftSelected)], ["Second group", String(rightSelected)]],
        },
      },
      evidence: { leftA, leftB, rightA, rightB },
    },
    {
      kind: "RELATIVE_SELECTED_PERCENT_EXCESS",
      difficulty: "Hard",
      ...relativeSurface,
      answer: `${relativePercent}%`,
      candidates: [
        { text: `${relativeDifference}%`, misconceptionId: "COUNT_GAP_AS_PERCENT", derivation: "Attaches a percent sign to the count difference without using a base." },
        { text: `${nearestWholePercent(relativeDifference, selected[largerIndex]!)}%`, misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger Selected value as the base." },
        { text: `${nearestWholePercent(selected[largerIndex]!, selected[smallerIndex]!)}%`, misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the whole larger value relative to the smaller instead of only the excess." },
        { text: `${nearestWholePercent(selected[smallerIndex]!, selected[largerIndex]!)}%`, misconceptionId: "REVERSE_COMPARISON", derivation: "Forms the reverse relative comparison." },
        { text: `${Math.abs(rows[largerIndex]!.selectionPercent - rows[smallerIndex]!.selectionPercent)}%`, misconceptionId: "COMPARE_SELECTION_RATES", derivation: "Compares Selection % values instead of Selected counts." },
      ],
      explanation: {
        keyIdea: "For 'percent more', divide the difference by the smaller/original value.",
        steps: [
          `Difference in Selected = ${selected[largerIndex]} - ${selected[smallerIndex]} = ${relativeDifference}.`,
          `Base = ${selected[smallerIndex]}.`,
          `Percentage excess = ${relativeDifference}/${selected[smallerIndex]} × 100 ≈ ${relativePercent}%.`,
        ],
      },
      evidence: { largerIndex, smallerIndex },
    },
    {
      kind: "COMBINED_SELECTION_RATE",
      difficulty: "Hard",
      ...combinedRateSurface,
      answer: `${combinedRate}%`,
      candidates: [
        { text: `${simpleRateAverage}%`, misconceptionId: "SIMPLE_AVERAGE_OF_RATES", derivation: "Averages the two row rates without weighting by Applicants." },
        { text: `${rows[rateA]!.selectionPercent}%`, misconceptionId: "USE_FIRST_RATE", derivation: "Uses only the first row's selection rate." },
        { text: `${rows[rateB]!.selectionPercent}%`, misconceptionId: "USE_SECOND_RATE", derivation: "Uses only the second row's selection rate." },
        { text: `${nearestWholePercent(rateApplicants, rateSelected)}%`, misconceptionId: "REVERSE_SELECTED_APPLICANTS", derivation: "Divides combined Applicants by combined Selected." },
        { text: `${nearestWholePercent(rateSelected, totalSelected)}%`, misconceptionId: "USE_ALL_SELECTED_AS_DENOMINATOR", derivation: "Uses the all-row Selected total as the denominator." },
      ],
      explanation: {
        keyIdea: "A combined selection rate must use combined Selected divided by combined Applicants; do not average the two rates directly.",
        steps: [
          `Combined Selected = ${selected[rateA]} + ${selected[rateB]} = ${rateSelected}.`,
          `Combined Applicants = ${applicants[rateA]} + ${applicants[rateB]} = ${rateApplicants}.`,
          `Overall selection rate = ${rateSelected}/${rateApplicants} × 100 ≈ ${combinedRate}%.`,
        ],
        workingTable: {
          headers: ["Rows combined", "Applicants", "Selected"],
          rows: [[`${rows[rateA]!.label} + ${rows[rateB]!.label}`, String(rateApplicants), String(rateSelected)]],
        },
      },
      evidence: { firstIndex: rateA, secondIndex: rateB },
    },
    {
      kind: "REJECTED_TO_SELECTED_RATIO",
      difficulty: "Hard",
      ...rejectedRatioSurface,
      answer: rejectedRatio,
      candidates: [
        { text: ratioDisplay(combinedSelectedForRejectPair, combinedRejected), misconceptionId: "REVERSE_RATIO", derivation: "Reverses Rejected : Selected." },
        { text: ratioDisplay(applicants[rejectA]! + applicants[rejectB]!, combinedSelectedForRejectPair), misconceptionId: "APPLICANTS_TO_SELECTED", derivation: "Uses Applicants instead of Rejected in the first term." },
        { text: ratioDisplay(rejected[rejectA]!, selected[rejectA]!), misconceptionId: "FIRST_ROW_ONLY", derivation: "Uses only the first named row." },
        { text: ratioDisplay(rejected[rejectB]!, selected[rejectB]!), misconceptionId: "SECOND_ROW_ONLY", derivation: "Uses only the second named row." },
        { text: ratioDisplay(Math.abs(rejected[rejectA]! - rejected[rejectB]!), combinedSelectedForRejectPair), misconceptionId: "REJECTED_DIFFERENCE", derivation: "Uses the difference between rejected counts instead of their sum." },
      ],
      explanation: {
        keyIdea: "First find rejected candidates for each row, add them, then compare the combined rejected total with the combined selected total.",
        steps: [
          `Rejected: ${rows[rejectA]!.label} = ${applicants[rejectA]} - ${selected[rejectA]} = ${rejected[rejectA]}; ${rows[rejectB]!.label} = ${applicants[rejectB]} - ${selected[rejectB]} = ${rejected[rejectB]}.`,
          `Combined Rejected = ${rejected[rejectA]} + ${rejected[rejectB]} = ${combinedRejected}; Combined Selected = ${selected[rejectA]} + ${selected[rejectB]} = ${combinedSelectedForRejectPair}.`,
          `${combinedRejected}:${combinedSelectedForRejectPair} = ${rejectedRatio}.`,
        ],
        workingTable: {
          headers: ["Row", "Applicants", "Selected", "Rejected"],
          rows: [
            [rows[rejectA]!.label, String(applicants[rejectA]), String(selected[rejectA]), String(rejected[rejectA])],
            [rows[rejectB]!.label, String(applicants[rejectB]), String(selected[rejectB]), String(rejected[rejectB])],
          ],
        },
      },
      evidence: { firstIndex: rejectA, secondIndex: rejectB },
    },
  ];
}

function selectedKinds(seed: string): Di002V2TaskKind[] {
  const easy = shuffle(seededRandom(`${seed}:easy-kinds`), EASY_KINDS).slice(0, 1);
  const medium = shuffle(seededRandom(`${seed}:medium-kinds`), MEDIUM_KINDS).slice(0, 2);
  const hard = shuffle(seededRandom(`${seed}:hard-kinds`), HARD_KINDS).slice(0, 2);
  return shuffle(seededRandom(`${seed}:question-order`), [...easy, ...medium, ...hard]);
}

function validateSet(set: Omit<Di002V2QuestionSet, "validation">) {
  const checks: Di002V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("FIVE_LINKED_QUESTIONS", set.questions.length === 5, "Each DI-002 V2 set must contain exactly five linked questions.");
  add("DIFFICULTY_MIX", set.questions.filter((q) => q.difficulty === "Easy").length === 1
    && set.questions.filter((q) => q.difficulty === "Medium").length === 2
    && set.questions.filter((q) => q.difficulty === "Hard").length === 2,
  "Each set must contain exactly 1 Easy, 2 Medium and 2 Hard questions.");
  add("OPTION_SHAPE", set.questions.every((q) => q.options.length === set.optionCount && new Set(q.options).size === set.optionCount), "Every question must expose the profile-specific number of unique options.");
  add("ANSWER_INDEX", set.questions.every((q) => q.options[q.correctIndex] === q.answer), "Every correct index must point to the canonical answer.");
  add("INTEGER_TABLE", set.stimulus.rows.every((row) => Number.isInteger(row.selected) && Number.isInteger(row.selectionPercent) && (row.applicants === "?" || Number.isInteger(row.applicants))), "Learner-facing table values must remain integer-only.");
  add("ONE_MISSING_APPLICANT", set.stimulus.rows.filter((row) => row.applicants === "?").length === 1, "Exactly one Applicants value must be hidden.");
  add("WHOLE_PERCENT_SURFACE", set.questions.every((q) => !/\d+\.\d+%/u.test(q.answer)), "Percentage answers must not expose decimals.");
  add("HARD_MULTI_STEP", set.questions.filter((q) => q.difficulty === "Hard").every((q) => q.explanation.steps.length >= 3), "Hard questions must retain multi-step explanations.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && !set.traceability.questionBankWritable && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication && !set.traceability.productionReleaseAuthorized, "DI-002 V2 must remain review-only before approval.");

  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi002V2Set(input: { seed?: string; examProfile?: Di002V2ExamProfile } = {}): Di002V2QuestionSet {
  const seed = String(input.seed ?? "DI002-V2-DEFAULT").trim() || "DI002-V2-DEFAULT";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const setId = `DI-002-V2-${hashSeed(seed).toString(16).padStart(8, "0")}`;
  const stimulus = buildStimulus(seed);
  const allDrafts = buildAllDrafts(seed, stimulus);
  const draftByKind = new Map(allDrafts.map((draft) => [draft.kind, draft] as const));
  const kinds = selectedKinds(seed);

  const questions = kinds.map((kind, index): Di002V2Question => {
    const draft = draftByKind.get(kind);
    if (!draft) throw new Error(`DI-002 V2 is missing draft logic for ${kind}.`);
    const optionState = buildOptions(`${seed}:${kind}:${index}`, optionCount, draft.answer, draft.candidates);
    return {
      questionId: `${setId}:Q${index + 1}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stemSurfaceId: draft.stemSurfaceId,
      stem: draft.stem,
      options: optionState.options,
      optionMetadata: optionState.optionMetadata,
      correctIndex: optionState.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation = {
    packageId: "DI-002" as const,
    reviewVersion: "V2" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile,
    optionCount,
    setDifficulty: "ADVANCED_TABLE_MIXED_V2" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-002" as const,
      representation: "TABLE" as const,
      parentFoundation: "DI-001" as const,
      setContractVersion: "DI-002-SET-CONTRACT-V2" as const,
      questionLogicVersion: "DI-002-QUESTION-LOGIC-V2" as const,
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL_WITH_EXPLICIT_WHOLE_PERCENT_ROUNDING" as const,
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-002 V2 validation failed for ${seed}: ${failed}.`);
  }

  return { ...withoutValidation, validation };
}

export const DI002_V2_CONTEXT_COUNT = CONTEXTS.length;
export const DI002_V2_OBJECT_LABEL_COUNT = CONTEXTS.reduce((sum, context) => sum + context.labels.length, 0);
export const DI002_V2_TASK_KINDS = Object.freeze([...EASY_KINDS, ...MEDIUM_KINDS, ...HARD_KINDS]);
