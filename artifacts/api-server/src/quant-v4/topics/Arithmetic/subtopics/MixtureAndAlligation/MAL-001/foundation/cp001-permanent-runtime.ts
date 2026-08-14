import { generateMalCp001FoundationQuestion } from "./cp001-foundation-normalizer";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";
import {
  MAL_CP001_PERMANENT_QL_IDS,
  getMalCp001PermanentAllocation,
} from "./cp001-permanent-allocation";
import type {
  MalCp001PermanentAllocationEntry,
  MalCp001PermanentQlId,
} from "./cp001-permanent-allocation";
import {
  buildMalCp001TeacherExplanation,
} from "./cp001-teacher-explanation";
import type {
  MalCp001TeacherExplanation,
} from "./cp001-teacher-explanation";

function hashIndex(text: string, modulus: number): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulus;
}

function selectPrototype(
  entry: MalCp001PermanentAllocationEntry,
  seed: string,
): MalCp001DiscoveryPrototypeId {
  if (entry.prototypeIds.length === 0) {
    throw new Error(`${entry.qlId} has no executable prototype allocation.`);
  }
  return entry.prototypeIds[
    hashIndex(`${entry.qlId}:${seed}:prototype`, entry.prototypeIds.length)
  ]!;
}

export interface MalCp001PermanentRuntimeInput {
  questionLanguageId?: MalCp001PermanentQlId;
  seed?: string;
  language?: "en";
}

type MalCp001FoundationQuestion = ReturnType<
  typeof generateMalCp001FoundationQuestion
>;

type ReplacedFoundationFields =
  | "permanentQlId"
  | "questionLanguageId"
  | "difficulty"
  | "taskDirection"
  | "answerSemantic"
  | "explanation"
  | "publiclyPublishable"
  | "questionStudioDiscoverable";

export type MalCp001PermanentQuestion = Omit<
  MalCp001FoundationQuestion,
  ReplacedFoundationFields
> & {
  permanentQlId: MalCp001PermanentQlId;
  questionLanguageId: MalCp001PermanentQlId;
  questionId: string;
  language: "en";
  difficulty: MalCp001PermanentAllocationEntry["difficulty"];
  taskDirection: MalCp001PermanentAllocationEntry["taskDirection"];
  answerSemantic: MalCp001PermanentAllocationEntry["answerSemantic"];
  explanation: MalCp001TeacherExplanation;
  maturity: "IMPLEMENTATION_PROOF";
  allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF";
  permanentIdentityFrozen: true;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  traceability: {
    packageId: "MAL-001";
    canonicalProblemId: "MAL-CP-001";
    questionLanguageId: MalCp001PermanentQlId;
    qlTemplateId: MalCp001PermanentAllocationEntry["qlTemplateId"];
    solveModeId: MalCp001PermanentAllocationEntry["solveModeId"];
    prototypeId: MalCp001DiscoveryPrototypeId;
    answerSemantic: MalCp001PermanentAllocationEntry["answerSemantic"];
    taskDirection: MalCp001PermanentAllocationEntry["taskDirection"];
    difficulty: MalCp001PermanentAllocationEntry["difficulty"];
    language: "en";
  };
};

function withTeacherLabels(
  question: MalCp001FoundationQuestion,
  qlId: MalCp001PermanentQlId,
): MalCp001FoundationQuestion {
  if (qlId !== "MAL-QL-001") return question;
  const request = question.parameters.request as any;
  return {
    ...question,
    parameters: {
      ...question.parameters,
      request: {
        ...request,
        lowerComponentLabel: question.parameters.context.lowerLabel,
        higherComponentLabel: question.parameters.context.higherLabel,
      },
    },
  } as MalCp001FoundationQuestion;
}

function formatIndianDigits(value: string): string {
  const digits = value.replace(/,/gu, "");
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return `${groups.join(",")},${lastThree}`;
}

function normaliseMoneyGrouping(value: string): string {
  return value.replace(/₹(\d{4,})(?![\d,])/gu, (_match, digits: string) =>
    `₹${formatIndianDigits(digits)}`,
  );
}

function normaliseQuantityUnits(value: string): string {
  return value.replace(
    /\b(\d[\d,]*(?: \d+\/\d+)?|\d+\/\d+) litre(?:s)?\b/gu,
    (_match, amount: string) =>
      `${amount} ${amount.replace(/,/gu, "") === "1" ? "litre" : "litres"}`,
  );
}

function normaliseSimpleWords(value: string): string {
  return normaliseMoneyGrouping(normaliseQuantityUnits(value))
    .replace(
      /Then solve it like an ordinary value-total question\./giu,
      "Then use the same multiply, add and divide steps.",
    )
    .replace(
      /The first-blend price is only an intermediate result\./giu,
      "The first-blend price is only the result from the first mixing step.",
    )
    .replace(/\b1 parts\b/giu, "1 part")
    .replace(/\bsmall imaginary quantities\b/giu, "small sample quantities")
    .replace(/\btemporary quantities\b/giu, "sample quantities")
    .replace(/\bintermediate result\b/giu, "first result")
    .replace(/\bordinary\b/giu, "normal")
    .replace(/\bpre-blend\b/giu, "first blend")
    .replace(/\bone first blend\b/giu, "one combined blend")
    .replace(/\bvalue already supplied by\b/giu, "value already given by")
    .replace(/\bvalue supplied by\b/giu, "value from")
    .replace(/\bvalue belonging to\b/giu, "value for")
    .replace(/\bbelongs to\b/giu, "is for")
    .replace(/\bthe requested share\b/giu, "the answer")
    .replace(/\bfits the same ratio and total quantity\b/giu, "matches the ratio and total quantity")
    .replace(/\bactual kilograms or litres\b/giu, "kilograms or litres")
    .replace(/\ban actual quantity\b/giu, "the required quantity")
    .replace(/\bactual quantity\b/giu, "required quantity")
    .replace(/\ban real quantity\b/giu, "the required quantity")
    .replace(/\breal quantity\b/giu, "required quantity")
    .replace(/\bnormal two-item\b/giu, "basic two-item")
    .replace(/\balgebra variables\b/giu, "unknown letters")
    .replace(/\bsource prices\b/giu, "item prices")
    .replace(/\bcomponents\b/giu, "items")
    .replace(/\bcomponent\b/giu, "item")
    .replace(/\ban normal\b/giu, "a normal")
    .replace(/\ban first\b/giu, "a first");
}

function normalisePermanentStem(value: string): string {
  return normaliseMoneyGrouping(normaliseQuantityUnits(value))
    .replace(/\b(\d+)\s*:\s*(\d+)\b/gu, "$1 : $2")
    .replace(/,\s*respectively\?/giu, ", in that order?")
    .replace(/\bthat uniform blend\b/giu, "that first blend")
    .replace(/\bsource grades\b/giu, "two grades")
    .replace(/\bweighted average price\b/giu, "average price")
    .replace(/\bmean price\b/giu, "average price");
}

function sentenceCase(value: string): string {
  return value.replace(/^([a-z])/u, (_match, firstLetter: string) =>
    firstLetter.toUpperCase(),
  );
}

function sentenceCaseTeacherStep(value: string): string {
  return value.replace(
    /^(Step \d+: )([a-z])/u,
    (_match, prefix: string, firstLetter: string) =>
      `${prefix}${firstLetter.toUpperCase()}`,
  );
}

function normaliseRatioOption(value: string): string {
  const spaced = value.replace(/\s*:\s*/u, " : ").trim();
  return /\bratio$/iu.test(spaced) ? spaced : `${spaced} ratio`;
}

function normalisePermanentOptionSurface(
  question: MalCp001FoundationQuestion,
  answerSemantic: MalCp001PermanentAllocationEntry["answerSemantic"],
): MalCp001FoundationQuestion {
  const options = question.options.map((option) => {
    const grouped = normaliseMoneyGrouping(normaliseQuantityUnits(option));
    return answerSemantic === "COMPONENT_RATIO"
      ? normaliseRatioOption(grouped)
      : grouped;
  });
  const optionAudit = question.optionAudit.map((item, index) => ({
    ...item,
    text: options[index]!,
  }));
  return {
    ...question,
    stem: normalisePermanentStem(question.stem),
    options,
    optionAudit,
  } as MalCp001FoundationQuestion;
}

function normaliseTeacherLanguage(
  explanation: MalCp001TeacherExplanation,
): MalCp001TeacherExplanation {
  const conclusionWithAgreement = explanation.conclusion.replace(
    /\b((?:tea\s+)?leaves|beans) costs\b/giu,
    "$1 cost",
  );
  const coreConcept = normaliseSimpleWords(explanation.coreConcept);
  return {
    ...explanation,
    opening: coreConcept,
    coreConcept,
    formula: normaliseSimpleWords(explanation.formula),
    steps: explanation.steps.map((step) =>
      sentenceCaseTeacherStep(normaliseSimpleWords(step)),
    ),
    examShortcut: normaliseSimpleWords(explanation.examShortcut),
    verification: normaliseSimpleWords(explanation.verification),
    commonTrap: normaliseSimpleWords(explanation.commonTrap).replace(
      /^Common trap:\s+([A-Z])/u,
      (_match, firstLetter: string) =>
        `Common trap: ${firstLetter.toLowerCase()}`,
    ),
    conclusion: sentenceCase(normaliseSimpleWords(conclusionWithAgreement)),
  };
}

/**
 * Generates one permanently identified CP-001 question in implementation-proof
 * mode. The package is deliberately inactive and cannot be routed to any
 * public, Question Studio, Question Bank or test surface.
 */
export function runMalCp001PermanentPipeline(
  input: MalCp001PermanentRuntimeInput = {},
): MalCp001PermanentQuestion {
  const questionLanguageId =
    input.questionLanguageId ?? MAL_CP001_PERMANENT_QL_IDS[0];
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-001 permanent runtime only supports English; received ${language}.`,
    );
  }

  const allocation = getMalCp001PermanentAllocation(questionLanguageId);
  const seed = input.seed ?? `mal-001:${questionLanguageId}:default`;
  const prototypeId = selectPrototype(allocation, seed);
  const foundationQuestion = generateMalCp001FoundationQuestion(prototypeId, seed);

  if (!foundationQuestion.validation.ok) {
    throw new Error(
      `${questionLanguageId}/${seed} failed foundation validation: ${foundationQuestion.validation.errors.join("; ")}`,
    );
  }
  if (!allocation.prototypeIds.includes(prototypeId)) {
    throw new Error(
      `${questionLanguageId}/${seed} selected an unallocated prototype.`,
    );
  }
  if (foundationQuestion.foundationQlTemplateId !== allocation.qlTemplateId) {
    throw new Error(
      `${questionLanguageId}/${seed} template mismatch: ${foundationQuestion.foundationQlTemplateId}/${allocation.qlTemplateId}.`,
    );
  }
  if (foundationQuestion.foundationSolveModeId !== allocation.solveModeId) {
    throw new Error(
      `${questionLanguageId}/${seed} solve-mode mismatch: ${foundationQuestion.foundationSolveModeId}/${allocation.solveModeId}.`,
    );
  }

  const optionQuestion = normalisePermanentOptionSurface(
    foundationQuestion,
    allocation.answerSemantic,
  );
  const explanation = normaliseTeacherLanguage(
    buildMalCp001TeacherExplanation(
      withTeacherLabels(optionQuestion, allocation.qlId),
      allocation.qlId,
    ),
  );

  return {
    ...optionQuestion,
    permanentQlId: allocation.qlId,
    questionLanguageId: allocation.qlId,
    questionId: `MAL-001:${allocation.qlId}:${seed}`,
    language: "en",
    difficulty: allocation.difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    explanation,
    maturity: "IMPLEMENTATION_PROOF",
    allocationStatus: "ALLOCATED_IMPLEMENTATION_PROOF",
    permanentIdentityFrozen: true,
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-001",
      questionLanguageId: allocation.qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      prototypeId,
      answerSemantic: allocation.answerSemantic,
      taskDirection: allocation.taskDirection,
      difficulty: allocation.difficulty,
      language: "en",
    },
  };
}
