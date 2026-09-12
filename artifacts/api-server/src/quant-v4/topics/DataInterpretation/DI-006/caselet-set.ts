import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di006Difficulty,
  Di006ExamProfile,
  Di006Explanation,
  Di006Option,
  Di006Question,
  Di006QuestionSet,
  Di006Stimulus,
  Di006TaskKind,
  Di006ValidationCheck,
} from "./types";

const BRANCH_LABELS = ["North Branch", "South Branch", "East Branch", "West Branch", "Central Branch"] as const;
const UNIT_POOL = [20, 25, 40, 50, 60, 80] as const;

const FAMILIES = [
  { b: 5, a: 6, c: 4, d: 3, e: 7, aPercentMore: 20, cNum: 2, cDen: 3, dNum: 3, dDen: 5 },
  { b: 4, a: 5, c: 3, d: 6, e: 7, aPercentMore: 25, cNum: 3, cDen: 5, dNum: 3, dDen: 2 },
  { b: 6, a: 9, c: 3, d: 4, e: 8, aPercentMore: 50, cNum: 1, cDen: 3, dNum: 2, dDen: 3 },
  { b: 8, a: 10, c: 5, d: 6, e: 11, aPercentMore: 25, cNum: 1, cDen: 2, dNum: 3, dDen: 4 },
  { b: 10, a: 12, c: 9, d: 5, e: 14, aPercentMore: 20, cNum: 3, cDen: 4, dNum: 1, dDen: 2 },
] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di006ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di006TaskKind;
  difficulty: Di006Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di006Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-006 received an invalid rational value.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}`;
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

function formatPercent(numerator: number, denominator: number): string {
  return `${formatQuotient(numerator * 100, denominator)}%`;
}

function resolveCounts(stimulus: Di006Stimulus): number[] {
  const counts = Array<number>(stimulus.categories.length).fill(Number.NaN);
  counts[stimulus.directIndex] = stimulus.directValue;

  for (const relation of stimulus.relations) {
    const source = counts[relation.sourceIndex];
    if (!Number.isFinite(source)) throw new Error("DI-006 relation dependency is unresolved.");
    const numerator = source * relation.numerator;
    if (numerator % relation.denominator !== 0) throw new Error("DI-006 relation must resolve to an integer count.");
    counts[relation.targetIndex] = numerator / relation.denominator;
  }

  const knownTotal = counts.reduce((sum, value, index) => index === stimulus.remainderIndex ? sum : sum + value, 0);
  counts[stimulus.remainderIndex] = stimulus.totalCases - knownTotal;
  if (counts.some((value) => !Number.isSafeInteger(value) || value <= 0)) throw new Error("DI-006 resolved a non-positive or non-integer caselet count.");
  return counts;
}

function buildStimulus(seed: string): Di006Stimulus {
  const family = pick(seededRandom(`${seed}:family`), FAMILIES);
  const unit = pick(seededRandom(`${seed}:unit`), UNIT_POOL);
  const categories = shuffle(seededRandom(`${seed}:labels`), BRANCH_LABELS);
  const [aName, bName, cName, dName, eName] = categories;
  const directValue = family.b * unit;
  const totalCases = (family.a + family.b + family.c + family.d + family.e) * unit;

  const aRelation = `${aName} handled ${family.aPercentMore}% more requests than ${bName}.`;
  const cRelation = `${cName} handled ${family.cNum}/${family.cDen} as many requests as ${aName}.`;
  const dRelation = `${dName} handled ${family.dNum}/${family.dDen} as many requests as ${bName}.`;
  const relationBlock = seededRandom(`${seed}:fact-order`)() < 0.5
    ? `${aRelation} ${cRelation} ${dRelation}`
    : `${dRelation} ${aRelation} ${cRelation}`;

  return {
    kind: "CASELET",
    title: "Service requests handled by five regional branches",
    instruction: "Read the caselet carefully and answer the five questions that follow.",
    learnerText: `Together, the five branches handled ${totalCases} service requests. ${bName} handled ${directValue} requests. ${relationBlock} The remaining requests were handled by ${eName}.`,
    categories,
    totalCases,
    directIndex: 1,
    directValue,
    relations: [
      { targetIndex: 0, sourceIndex: 1, numerator: family.a, denominator: family.b, learnerText: aRelation },
      { targetIndex: 2, sourceIndex: 0, numerator: family.cNum, denominator: family.cDen, learnerText: cRelation },
      { targetIndex: 3, sourceIndex: 1, numerator: family.dNum, denominator: family.dDen, learnerText: dRelation },
    ],
    remainderIndex: 4,
    unit: "requests",
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di006Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-006 relational caselet." });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-006 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-006 lost the correct option during deterministic shuffling.");

  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildDrafts(stimulus: Di006Stimulus): Draft[] {
  const counts = resolveCounts(stimulus);
  const [a, b, c, d, e] = counts;
  const [aName, bName, cName, dName, eName] = stimulus.categories;
  const knownSubtotal = a + b + c + d;
  const combinedAC = a + c;
  const combinedShare = formatPercent(combinedAC, stimulus.totalCases);
  const remainderRatio = ratioDisplay(e, b);

  return [
    {
      kind: "DERIVE_PRIMARY_FROM_PERCENT",
      difficulty: "Medium",
      stem: `How many service requests were handled by ${aName}?`,
      answer: String(a),
      candidates: [
        { text: String(b), misconceptionId: "COPY_DIRECT_BRANCH", derivation: `Copies ${bName}'s directly stated count instead of applying the percentage relation.` },
        { text: String(a - b), misconceptionId: "REPORT_ONLY_PERCENT_INCREASE", derivation: "Calculates only the extra requests created by the percentage increase instead of the full branch count." },
        { text: String(a + b), misconceptionId: "ADD_RELATED_BRANCHES", derivation: "Adds the two related branch counts after deriving the first branch instead of reporting the requested branch alone." },
        { text: String(d), misconceptionId: "USE_OTHER_B_RELATION", derivation: `Uses the separate relation for ${dName} to ${bName} instead of the percentage relation for ${aName}.` },
        { text: String(stimulus.totalCases - a), misconceptionId: "USE_COMPLEMENT_OF_BRANCH", derivation: "Reports all requests handled outside the requested branch." },
      ],
      explanation: {
        keyIdea: `Start from ${bName}'s directly stated count, then apply the stated percentage increase to reconstruct ${aName}.`,
        steps: [
          `${bName} = ${b} requests.`,
          `${aName} is ${(a - b) * 100 / b}% more, so ${aName} = ${b} + ${a - b} = ${a}.`,
        ],
        shortcut: `A ${(a - b) * 100 / b}% increase on ${b} can be applied directly as ${b} × ${a}/${b} = ${a}.`,
        trap: "Do not give only the increase. 'Percent more' asks for the original amount plus the increase.",
      },
      evidence: { categoryIndex: 0 },
    },
    {
      kind: "DERIVE_CHAINED_RELATION",
      difficulty: "Hard",
      stem: `How many service requests were handled by ${cName}?`,
      answer: String(c),
      candidates: [
        { text: String(a), misconceptionId: "STOP_AT_INTERMEDIATE_BRANCH", derivation: `Stops after reconstructing ${aName} and reports that intermediate value instead of continuing to ${cName}.` },
        { text: String(b), misconceptionId: "USE_DIRECT_BRANCH", derivation: `Uses ${bName}'s directly stated count without following the chained relation through ${aName}.` },
        { text: String(d), misconceptionId: "FOLLOW_WRONG_RELATION", derivation: `Follows ${dName}'s relation to ${bName} instead of ${cName}'s relation to ${aName}.` },
        { text: String(stimulus.totalCases - c), misconceptionId: "USE_COMPLEMENT_COUNT", derivation: "Reports all requests outside the requested branch instead of the branch count." },
        { text: String(e), misconceptionId: "USE_REMAINDER_BRANCH", derivation: `Uses the caselet remainder assigned to ${eName} instead of the chained relation for ${cName}.` },
      ],
      explanation: {
        keyIdea: `This value is chained: first reconstruct ${aName} from ${bName}, then apply ${cName}'s fractional relation to ${aName}.`,
        steps: [
          `From the first relation, ${aName} = ${a}.`,
          `${cName} = ${c}/${a} of ${aName} = ${c}/${a} × ${a} = ${c} requests.`,
        ],
        shortcut: "Follow the dependency chain in order; do not try to use the direct branch count in the second relation unless the statement says so.",
        trap: `The fraction for ${cName} is applied to ${aName}, not directly to ${bName}.`,
      },
      evidence: { categoryIndex: 2 },
    },
    {
      kind: "REMAINDER_FROM_TOTAL",
      difficulty: "Hard",
      stem: `How many service requests were handled by ${eName}?`,
      answer: String(e),
      candidates: [
        { text: String(knownSubtotal), misconceptionId: "REPORT_KNOWN_SUBTOTAL", derivation: "Adds the four reconstructed non-remainder branches but forgets to subtract that subtotal from the caselet total." },
        { text: String(b), misconceptionId: "COPY_DIRECT_COUNT", derivation: `Copies ${bName}'s stated count rather than finding the unassigned remainder.` },
        { text: String(a), misconceptionId: "USE_PRIMARY_DERIVED_COUNT", derivation: `Reports ${aName}'s reconstructed count instead of completing the total.` },
        { text: String(c), misconceptionId: "USE_CHAINED_COUNT", derivation: `Reports ${cName}'s reconstructed count instead of the remainder branch.` },
        { text: String(d), misconceptionId: "USE_SECOND_RELATION_COUNT", derivation: `Reports ${dName}'s reconstructed count instead of the remainder branch.` },
      ],
      explanation: {
        keyIdea: `Reconstruct the other four branches first; ${eName} receives whatever is left from the stated total.`,
        steps: [
          `Known four-branch subtotal = ${a} + ${b} + ${c} + ${d} = ${knownSubtotal}.`,
          `${eName} = ${stimulus.totalCases} - ${knownSubtotal} = ${e} requests.`,
        ],
        shortcut: "Once the four non-remainder values are known, a single subtraction from the caselet total gives the fifth branch.",
        trap: "The sum of the first four branches is not the answer; it is the amount that must be removed from the total.",
      },
      evidence: { categoryIndex: 4 },
    },
    {
      kind: "COMBINED_INFERRED_SHARE",
      difficulty: "Hard",
      stem: `Together, ${aName} and ${cName} handled what percentage of all service requests?`,
      answer: combinedShare,
      candidates: [
        { text: formatPercent(a, stimulus.totalCases), misconceptionId: "USE_PRIMARY_ONLY", derivation: `Uses only ${aName}'s reconstructed count and omits ${cName}.` },
        { text: formatPercent(c, stimulus.totalCases), misconceptionId: "USE_CHAINED_ONLY", derivation: `Uses only ${cName}'s reconstructed count and omits ${aName}.` },
        { text: formatPercent(e, stimulus.totalCases), misconceptionId: "USE_REMAINDER_SHARE", derivation: `Uses ${eName}'s remainder share instead of combining the two named branches.` },
        { text: formatPercent(combinedAC, knownSubtotal), misconceptionId: "EXCLUDE_REMAINDER_FROM_DENOMINATOR", derivation: "Uses the subtotal of four non-remainder branches as the whole instead of the stated five-branch total." },
        { text: formatPercent(a + d, stimulus.totalCases), misconceptionId: "COMBINE_WRONG_DERIVED_PAIR", derivation: `Combines ${aName} with ${dName} instead of ${cName}.` },
      ],
      explanation: {
        keyIdea: `Both named branch counts must be reconstructed first, then their combined count is compared with the full five-branch total.`,
        steps: [
          `${aName} + ${cName} = ${a} + ${c} = ${combinedAC}.`,
          `Required percentage = ${combinedAC}/${stimulus.totalCases} × 100 = ${combinedShare}.`,
        ],
        shortcut: "Reconstruct only the two required branches, add them, and use the stated total directly as the denominator.",
        trap: "Do not use the four-branch subtotal as the denominator; the question says 'of all service requests'.",
      },
      evidence: { firstIndex: 0, secondIndex: 2 },
    },
    {
      kind: "REMAINDER_TO_DIRECT_RATIO",
      difficulty: "Hard",
      stem: `What is the ratio of service requests handled by ${eName} to those handled by ${bName}?`,
      answer: remainderRatio,
      candidates: [
        { text: ratioDisplay(b, e), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named branches while forming the ratio." },
        { text: ratioDisplay(e, a), misconceptionId: "USE_PRIMARY_AS_SECOND_TERM", derivation: `Uses ${aName} instead of the directly stated ${bName} as the second ratio term.` },
        { text: ratioDisplay(a, b), misconceptionId: "USE_PRIMARY_DIRECT_RELATION", derivation: `Reports the ${aName}:${bName} relation instead of the requested remainder-to-direct ratio.` },
        { text: ratioDisplay(e, c), misconceptionId: "USE_CHAINED_AS_SECOND_TERM", derivation: `Uses ${cName} instead of ${bName} as the second ratio term.` },
        { text: ratioDisplay(stimulus.totalCases, b), misconceptionId: "USE_TOTAL_AS_FIRST_TERM", derivation: "Uses the full caselet total as the first ratio term instead of the remainder branch." },
      ],
      explanation: {
        keyIdea: `First recover ${eName} as the remainder, then compare it with ${bName}'s directly stated count in the order asked.`,
        steps: [
          `${eName} = ${e}; ${bName} = ${b}.`,
          `${e}:${b} = ${remainderRatio}.`,
        ],
        shortcut: "The second ratio term is already given directly; only the remainder branch needs reconstruction before simplifying.",
        trap: "Ratio order matters. 'Remainder branch to direct branch' is not interchangeable with its reverse.",
      },
      evidence: { firstIndex: 4, secondIndex: 1 },
    },
  ];
}

function validateSet(set: Omit<Di006QuestionSet, "validation">) {
  const checks: Di006ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const counts = resolveCounts(set.stimulus);

  add("CASELET_KIND", set.stimulus.kind === "CASELET", "DI-006 must expose caselet stimulus semantics.");
  add("FIVE_CATEGORIES", set.stimulus.categories.length === 5, "DI-006 requires five caselet categories.");
  add("PROSE_STIMULUS", set.stimulus.learnerText.length > 180 && !set.stimulus.learnerText.includes("|"), "DI-006 learner stimulus must be prose, not a table serialization.");
  add("RELATIONAL_DEPTH", set.stimulus.relations.length === 3, "DI-006 requires three explicit relational facts before the remainder fact.");
  add("POSITIVE_INTEGER_COUNTS", counts.every((value) => Number.isSafeInteger(value) && value > 0), "All resolved caselet counts must be positive safe integers.");
  add("TOTAL_PARITY", counts.reduce((sum, value) => sum + value, 0) === set.stimulus.totalCases, "Resolved caselet counts must equal the stated total.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-006 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each DI-006 child must test a distinct caselet task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the same caselet parent set ID.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every DI-006 child must expose ${set.optionCount} options.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every caselet child must have unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 40 && question.explanation.trap.length > 30), "Every DI-006 child requires a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-006 Phase 5 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi006CaseletSet(input: { seed?: string; examProfile?: Di006ExamProfile } = {}): Di006QuestionSet {
  const seed = input.seed ?? "DI-006:CASELET:P5";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(stimulus);
  const setId = `DI-006-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di006Question => {
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

  const withoutValidation: Omit<Di006QuestionSet, "validation"> = {
    packageId: "DI-006",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "CASELET_RELATIONAL_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-006",
      representation: "CASELET",
      parentFoundation: "DI-001",
      tableSibling: "DI-002",
      groupedBarSibling: "DI-003",
      lineSibling: "DI-004",
      pieSibling: "DI-005",
      setContractVersion: "DI-006-SET-CONTRACT-V1",
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
    throw new Error(`DI-006 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}
