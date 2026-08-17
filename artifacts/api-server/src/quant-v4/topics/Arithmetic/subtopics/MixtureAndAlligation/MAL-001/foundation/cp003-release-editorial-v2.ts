import {
  runMalCp003EnglishReleasePipeline as runMalCp003EnglishReleasePipelineV1,
  type MalCp003PermanentQlId,
  type MalCp003ReleasedQuestion,
} from "./cp003-permanent-runtime";

export const MAL_CP003_CHAPTER_CLOSURE_EDITORIAL_V2_ID =
  "MAL-CP003-EN-CHAPTER-CLOSURE-EDITORIAL-V2" as const;

const TRANSFER_VERBS =
  "removed|replaced|transferred|sent|moved|poured|added|returned|withdrawn";
const MAX_MIXED_FRACTION_DENOMINATOR = 32;
const MAX_EXAM_RATIO_COMPONENT = 300;

function sentenceCase(value: string): string {
  return value.replace(/^([a-z])/u, (_match, letter: string) =>
    letter.toUpperCase(),
  );
}

function normaliseLearnerText(value: string): string {
  const bareAmount =
    "((?:[0-9]+(?:\\.[0-9]+)?(?:\\s+[0-9]+\\/[0-9]+)?|[0-9]*x))";
  const pluralAmount = `(${bareAmount.slice(1, -1)} litres)`;

  return value
    .replace(/\b1 ratio parts\b/giu, "1 ratio part")
    .replace(/\b1 parts\b/giu, "1 part")
    .replace(/\b1 litres\b/giu, "1 litre")
    .replace(
      new RegExp(
        `\\b${bareAmount} litre (?=(?:sample|portion|batch|mixture|solution|transfer|return|amount|quantity|container|vessel|tank|drum)\\b)`,
        "giu",
      ),
      "$1-litre ",
    )
    .replace(
      new RegExp(`\\b${bareAmount} litre\\b`, "giu"),
      (_match, amount: string) =>
        `${amount} ${amount === "1" ? "litre" : "litres"}`,
    )
    .replace(
      new RegExp(
        `${pluralAmount} of ([^,.;?]+) is (${TRANSFER_VERBS})`,
        "giu",
      ),
      "$1 of $2 are $3",
    )
    .replace(
      new RegExp(`${pluralAmount} is (${TRANSFER_VERBS})`, "giu"),
      "$1 are $2",
    )
    .replace(/^Check:\s*/iu, "");
}

function normaliseExplanation(
  explanation: MalCp003ReleasedQuestion["explanation"],
): MalCp003ReleasedQuestion["explanation"] {
  const normalise = (value: string) => normaliseLearnerText(value);
  return {
    ...explanation,
    coreConcept: normalise(explanation.coreConcept),
    formula: normalise(explanation.formula),
    steps: explanation.steps.map(normalise),
    verification: normalise(explanation.verification),
    conclusion: normalise(explanation.conclusion),
    examShortcut: normalise(explanation.examShortcut),
    commonTrap: normalise(explanation.commonTrap),
    lines: explanation.lines.map(normalise),
  };
}

function normaliseReasoningGraph(
  graph: MalCp003ReleasedQuestion["reasoningGraph"],
): MalCp003ReleasedQuestion["reasoningGraph"] {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      text: normaliseLearnerText(node.text),
    })),
  };
}

function isExamNatural(question: MalCp003ReleasedQuestion): boolean {
  const learnerChoices = [question.stem, ...question.options].join(" ");
  for (const match of learnerChoices.matchAll(/\b(\d+)\/(\d+)\b/gu)) {
    if (Number(match[2]) > MAX_MIXED_FRACTION_DENOMINATOR) return false;
  }
  for (const match of question.stem.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    if (
      Math.max(Number(match[1]), Number(match[2])) >
      MAX_EXAM_RATIO_COMPONENT
    ) {
      return false;
    }
  }
  return true;
}

function assertEditorialV2(question: MalCp003ReleasedQuestion): void {
  const learnerText = [
    question.stem,
    ...question.options,
    question.explanation.coreConcept,
    question.explanation.formula,
    ...question.explanation.steps,
    question.explanation.verification,
    question.explanation.conclusion,
    question.explanation.examShortcut,
    question.explanation.commonTrap,
  ].join(" ");

  const blockers: readonly [string, RegExp][] = [
    ["undefined label", /\bundefined\b/iu],
    ["singular litres", /\b1 litres\b/iu],
    ["singular parts", /\b1 parts\b|\b1 ratio parts\b/iu],
    [
      "plural transfer agreement",
      /\b(?:\d+(?:\.\d+)?(?:\s+\d+\/\d+)?|\d*x) litres(?: of [^,.;?]+)? is (?:removed|replaced|transferred|sent|moved|poured|added|returned|withdrawn)\b/iu,
    ],
    [
      "plural litre unit",
      /\b(?:[2-9]|\d{2,})(?:\.\d+)?(?:\s+\d+\/\d+)? litre\b/iu,
    ],
    ["duplicated quick check", /Quick check:\s*Check:/iu],
  ];

  if (/^[a-z]/u.test(question.stem)) {
    throw new Error(`${question.questionId}: CP003 V2 stem starts in lowercase.`);
  }
  for (const [label, pattern] of blockers) {
    if (pattern.test(learnerText)) {
      throw new Error(`${question.questionId}: CP003 V2 ${label} regression.`);
    }
  }
  if (!isExamNatural(question)) {
    throw new Error(`${question.questionId}: CP003 V2 exam-realism constraints failed.`);
  }
}

function buildEditorialV2Question(
  base: MalCp003ReleasedQuestion,
): MalCp003ReleasedQuestion {
  const stem = sentenceCase(normaliseLearnerText(base.stem));
  const explanation = normaliseExplanation(base.explanation);
  return {
    ...base,
    stem,
    explanationId: `${base.permanentQlId}-EN-REPEATED-REPLACEMENT-CHAPTER-CLOSURE-V2`,
    explanation,
    reasoningGraph: normaliseReasoningGraph(base.reasoningGraph),
    parameters: {
      ...base.parameters,
      editorialRevisionId: MAL_CP003_CHAPTER_CLOSURE_EDITORIAL_V2_ID,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "CHAPTER_CLOSURE_EDITORIAL_V2",
          passed: true,
          message:
            "Learner prose is sentence-cased and quantity/transfer grammar is normalized without changing mathematics, options or identity.",
        },
        {
          name: "CHAPTER_CLOSURE_EXAM_REALISM_V2",
          passed: true,
          message: `Learner-visible fractions use denominators no larger than ${MAX_MIXED_FRACTION_DENOMINATOR}, and stem ratios keep each component at or below ${MAX_EXAM_RATIO_COMPONENT}.`,
        },
      ],
    },
  };
}

export function runMalCp003EnglishEditorialV2Pipeline(input: {
  questionLanguageId: MalCp003PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp003ReleasedQuestion {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidateSeed =
      attempt === 0
        ? input.seed
        : `${input.seed ?? "mal-cp003-editorial-v2"}:exam-retry:${attempt}`;
    const base = runMalCp003EnglishReleasePipelineV1({
      ...input,
      seed: candidateSeed,
    });
    const question = buildEditorialV2Question(base);
    if (!isExamNatural(question)) continue;
    assertEditorialV2(question);
    return question;
  }
  throw new Error(
    `${input.questionLanguageId}: no exam-natural CP003 editorial V2 state survived.`,
  );
}
