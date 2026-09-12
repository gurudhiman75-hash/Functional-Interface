import type { OpsPilotExplanationStep, OpsPilotOption } from "./representative-pilots";
import {
  OPS_REPRESENTATIVE_PILOT_IDS,
  generateOpsRepresentativePilot,
} from "./representative-pilots";
import {
  OPS_SUPPLEMENTARY_PILOT_IDS,
  generateOpsSupplementaryPilot,
} from "./supplementary-pilots";
import {
  OPS_FINAL_CANDIDATE_PILOT_IDS,
  generateOpsFinalCandidatePilot,
} from "./final-candidate-pilots";
import {
  arithmeticTrace,
  meaningKey,
  optionLetter,
  parseArrowPair,
  parseMeaningPairs,
  relationSummary,
  relationTrace,
  requireMatch,
  substituteTokenMeanings,
  swapDigits,
  swapOperatorPairs,
  swapWholeNumbers,
  tokensPresent,
  withPrefix,
  type TeachingStep,
} from "./approved-teaching-helpers";

export const OPS_APPROVED_CANDIDATE_IDS = [
  "OPS-CAND-001",
  "OPS-CAND-003",
  "OPS-CAND-004",
  "OPS-CAND-005",
  "OPS-CAND-007",
  "OPS-CAND-008",
  "OPS-CAND-009",
  "OPS-CAND-010",
  "OPS-CAND-011",
  "OPS-CAND-012",
  "OPS-CAND-013",
  "OPS-CAND-014",
  "OPS-CAND-015",
  "OPS-CAND-016",
  "OPS-CAND-017",
  "OPS-CAND-018",
  "OPS-CAND-019",
  "OPS-CAND-020",
  "OPS-CAND-021",
  "OPS-CAND-022",
  "OPS-CAND-023",
  "OPS-CAND-024",
  "OPS-CAND-025",
  "OPS-CAND-026",
  "OPS-CAND-027",
  "OPS-CAND-028",
  "OPS-CAND-029",
  "OPS-CAND-030",
  "OPS-CAND-032",
  "OPS-CAND-033",
  "OPS-CAND-034",
] as const;

export type OpsApprovedCandidateId = (typeof OPS_APPROVED_CANDIDATE_IDS)[number];

export interface ApprovedOpsQuestion {
  candidateId: OpsApprovedCandidateId;
  checkpointId: string;
  seed: number;
  locale: "en-IN";
  localeMode?: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  taskKind: string;
  solveMode: string;
  renderer: "STRUCTURED_TEXT" | "TABLE_OR_GRID";
  stem: string;
  options: readonly OpsPilotOption[];
  correctIndex: number;
  answer: string;
  explanation: {
    ruleStatement: string;
    steps: readonly OpsPilotExplanationStep[];
    conclusion: string;
  };
  proof: {
    unique: true;
    solverRoute: string;
    eligibleCandidateCount: number;
    survivingCandidateCount: 1;
    semanticFingerprint: string;
  };
  metadata: Readonly<Record<string, string | number | boolean>>;
}

type RawQuestion = Omit<ApprovedOpsQuestion, "candidateId"> & { candidateId: string };

const REPRESENTATIVE_IDS = new Set<string>(OPS_REPRESENTATIVE_PILOT_IDS);
const SUPPLEMENTARY_IDS = new Set<string>(OPS_SUPPLEMENTARY_PILOT_IDS);
const BASIC_OPERATOR_PAIRS = [
  "+ ↔ −",
  "+ ↔ ×",
  "+ ↔ ÷",
  "− ↔ ×",
  "− ↔ ÷",
  "× ↔ ÷",
] as const;

function rawQuestion(candidateId: OpsApprovedCandidateId, sourceSeed: number): RawQuestion {
  if (REPRESENTATIVE_IDS.has(candidateId)) {
    return generateOpsRepresentativePilot(candidateId as (typeof OPS_REPRESENTATIVE_PILOT_IDS)[number], sourceSeed) as RawQuestion;
  }
  if (SUPPLEMENTARY_IDS.has(candidateId)) {
    return generateOpsSupplementaryPilot(candidateId as (typeof OPS_SUPPLEMENTARY_PILOT_IDS)[number], sourceSeed) as RawQuestion;
  }
  return generateOpsFinalCandidatePilot(candidateId as (typeof OPS_FINAL_CANDIDATE_PILOT_IDS)[number], sourceSeed) as RawQuestion;
}

function equationFromStem(stem: string): string {
  const match = stem.match(/throughout (.+?) to make it correct\?$/u)
    ?? stem.match(/to make (.+?) correct\?$/u);
  if (!match) throw new Error(`Cannot extract equation from stem: ${stem}`);
  return match[1];
}

function pairSymbols(source: string): readonly string[] {
  return source
    .split(";")
    .flatMap((entry) => [...parseArrowPair(entry.trim())]);
}

function editoriallyEligible(question: RawQuestion): boolean {
  try {
    switch (question.candidateId) {
      case "OPS-CAND-001": {
        const pairs = parseMeaningPairs(question.stem);
        return pairs.every((pair) => pair.display !== pair.meaning)
          && new Set(pairs.map((pair) => pair.meaning)).size === pairs.length;
      }
      case "OPS-CAND-014": {
        const match = requireMatch(question.stem, /^Interchange (.+) and (.+) throughout (.+), then evaluate it\.$/u, question.candidateId);
        return tokensPresent(match[3], [match[1], match[2]]);
      }
      case "OPS-CAND-015": {
        const match = requireMatch(question.stem, /^Interchange (.+) with (.+) and (.+) with (.+) simultaneously in (.+), then evaluate it\.$/u, question.candidateId);
        return tokensPresent(match[5], [match[1], match[2], match[3], match[4]]);
      }
      case "OPS-CAND-016":
      case "OPS-CAND-017":
      case "OPS-CAND-026":
      case "OPS-CAND-027":
        return tokensPresent(equationFromStem(question.stem), pairSymbols(question.answer.split(";")[0]));
      case "OPS-CAND-018":
        return tokensPresent(equationFromStem(question.stem), pairSymbols(question.answer));
      case "OPS-CAND-019": {
        const match = requireMatch(question.stem, /^After interchanging (.+) and (.+) in every option, select the true equation\.$/u, question.candidateId);
        return tokensPresent(question.answer, [match[1], match[2]]);
      }
      case "OPS-CAND-028": {
        const match = requireMatch(question.stem, /^Interchange operators (.+) and (.+), and interchange the complete numbers (.+) and (.+), in (.+)\. What is the resulting value\?$/u, question.candidateId);
        return tokensPresent(match[5], [match[1], match[2], match[3], match[4]]);
      }
      case "OPS-CAND-029": {
        const match = requireMatch(question.stem, /^After interchanging operators (.+) and (.+), and complete numbers (.+) and (.+), in every option, select the true equation\.$/u, question.candidateId);
        return tokensPresent(question.answer, [match[1], match[2], match[3], match[4]]);
      }
      default:
        return true;
    }
  } catch {
    return false;
  }
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function normalizeQuestion(raw: RawQuestion, requestedSeed: number, sourceSeed: number): ApprovedOpsQuestion {
  let stem = raw.stem;
  let options = [...raw.options];
  let metadata: Record<string, string | number | boolean> = {
    ...raw.metadata,
    teachingExplanationVersion: "V3_APPROVED",
    requestedSeed,
    sourceSeed,
  };

  if (raw.candidateId === "OPS-CAND-016") {
    const distractors = BASIC_OPERATOR_PAIRS.filter((pair) => pair !== raw.answer).slice(0, 3);
    const rebuilt = [raw.answer, ...distractors].map((value): OpsPilotOption => ({
      value,
      errorLabel: value === raw.answer ? null : "WRONG_OPERATOR_PAIR",
    }));
    options = rotate(rebuilt, requestedSeed);
    metadata = { ...metadata, invalidOneWayReplacementOptionRemoved: true };
  }

  if (raw.candidateId === "OPS-CAND-030") {
    stem = `M and N each represent one of +, −, × and ÷. ${stem}`;
  } else if (raw.candidateId === "OPS-CAND-032") {
    stem = `M and N each represent one of +, −, × and ÷. ${stem}`;
  } else if (raw.candidateId === "OPS-CAND-033") {
    stem = `N represents one of +, −, × and ÷. ${stem}`;
  } else if (raw.candidateId === "OPS-CAND-034") {
    stem = "A, B and C represent +, = and > in some order. The statements 3 A 2 B 5 and 7 C 4 are true. Determine the meanings and select the true statement.";
  }

  if (raw.candidateId === "OPS-CAND-028") {
    metadata = { ...metadata, compoundSubtype: "OPERATOR_AND_WHOLE_NUMBER" };
  }

  const correctIndex = options.findIndex((option) => option.value === raw.answer);
  if (correctIndex < 0) throw new Error(`${raw.candidateId} normalized options lost the answer.`);

  const normalized = {
    ...raw,
    candidateId: raw.candidateId as OpsApprovedCandidateId,
    seed: requestedSeed,
    stem,
    options,
    correctIndex,
    metadata,
  } satisfies ApprovedOpsQuestion;
  return normalized;
}

function finaliseExplanation(
  question: ApprovedOpsQuestion,
  ruleStatement: string,
  steps: readonly TeachingStep[],
  conclusion: string,
): ApprovedOpsQuestion {
  if (steps.length < 3) throw new Error(`${question.candidateId} teaching explanation must contain at least three steps.`);
  return {
    ...question,
    explanation: { ruleStatement, steps, conclusion },
    metadata: { ...question.metadata, teachingTraceVerified: true },
  };
}

function calculationSteps(expression: string, prefix?: string): readonly TeachingStep[] {
  const trace = arithmeticTrace(expression);
  if (trace.steps.length === 0) {
    return [{
      label: prefix ? `${prefix}: Read the value` : "Read the value",
      expression,
      result: `Its value is ${trace.value}.`,
    }];
  }
  return prefix ? withPrefix(trace.steps, prefix) : trace.steps;
}

function relationTeachingSteps(statement: string): readonly TeachingStep[] {
  const trace = relationTrace(statement);
  return [
    ...calculationSteps(trace.left.expression, "Left side"),
    ...calculationSteps(trace.right.expression, "Right side"),
    {
      label: "Compare both sides",
      expression: `${trace.left.value} ${trace.relation} ${trace.right.value}`,
      result: `The statement is ${trace.truth ? "true" : "false"}.`,
    },
  ];
}

function mappedEvaluation(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^If (.+), evaluate (.+)\.$/u, question.candidateId);
  const pairs = parseMeaningPairs(match[1]);
  const original = match[2];
  const transformed = substituteTokenMeanings(original, pairs);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Read each printed symbol with its supplied meaning, replace every occurrence, and only then use the normal order of operations.",
    [
      { label: "Read the replacement key", expression: meaningKey(pairs), result: "Do not calculate the printed expression before replacing the symbols." },
      { label: "Replace every occurrence", expression: original, result: transformed },
      ...trace.steps,
    ],
    `Therefore, the required value is ${trace.value}.`,
  );
}

function mappedEquationSelection(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const pairs = parseMeaningPairs(question.stem);
  const answerMatch = requireMatch(question.answer, /^(.+) = (.+)$/u, question.candidateId);
  const original = answerMatch[1];
  const transformed = substituteTokenMeanings(original, pairs);
  const trace = arithmeticTrace(transformed);
  const matching = question.options.findIndex((option) => option.value.endsWith(`= ${trace.value}`));
  return finaliseExplanation(question,
    "Apply the same supplied meanings to the common coded expression, calculate it once, and select the equation with the matching right-hand side.",
    [
      { label: "Read the replacement key", expression: meaningKey(pairs), result: "Use these meanings in every option." },
      { label: "Transform the common left-hand side", expression: original, result: transformed },
      ...trace.steps,
      { label: "Select the matching equation", expression: `The transformed left side equals ${trace.value}.`, result: `Only option ${optionLetter(matching)} has right-hand side ${trace.value}.` },
    ],
    `Hence, ${question.answer} is the only true equation.`,
  );
}

function mixedMappingSelection(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const pairs = parseMeaningPairs(question.stem);
  const steps: TeachingStep[] = [
    { label: "Write the complete meaning key", expression: meaningKey(pairs), result: "Replace arithmetic and relation tokens before judging a statement." },
  ];
  question.options.forEach((option, index) => {
    const transformed = substituteTokenMeanings(option.value, pairs);
    const trace = relationTrace(transformed);
    steps.push({
      label: `Check option ${optionLetter(index)}`,
      expression: option.value,
      result: `${transformed}; ${relationSummary(trace)}.`,
    });
  });
  return finaliseExplanation(question,
    "Replace both arithmetic and relation tokens, calculate each completed statement, and retain the single true option.",
    steps,
    `Therefore, ${question.answer} is the only true statement.`,
  );
}

function mappedRelationRecovery(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^If (.+), which token replaces the blank in (.+) _ (.+)\?$/u, question.candidateId);
  const pairs = parseMeaningPairs(match[1]);
  const left = substituteTokenMeanings(match[2], pairs);
  const right = substituteTokenMeanings(match[3], pairs);
  const completed = substituteTokenMeanings(`${match[2]} ${question.answer} ${match[3]}`, pairs);
  const trace = relationTrace(completed);
  const answerMeaning = pairs.find((pair) => pair.display === question.answer)?.meaning;
  if (!answerMeaning) throw new Error(`${question.candidateId} answer token is absent from the meaning key.`);
  return finaliseExplanation(question,
    "First evaluate the coded arithmetic parts, determine their actual relation, and then choose the display token that represents that relation.",
    [
      { label: "Read the replacement key", expression: meaningKey(pairs), result: "The answer must be a coded token, not the ordinary relation sign." },
      ...calculationSteps(left, "Left side"),
      ...calculationSteps(right, "Right side"),
      { label: "Determine the actual relation", expression: completed, result: relationSummary(trace) },
      { label: "Convert back to the coded token", expression: `${question.answer} → ${answerMeaning}`, result: `${question.answer} is the required display token.` },
    ],
    `Therefore, the blank must be filled with ${question.answer}.`,
  );
}

function operationName(operator: string): string {
  switch (operator) {
    case "+": return "addition";
    case "−": return "subtraction";
    case "×": return "multiplication";
    case "÷": return "division";
    default: return operator;
  }
}

function missingOperator(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Which operator replaces the blank in (.+) _ (.+) = (.+)\?$/u, question.candidateId);
  const steps = ["+", "−", "×", "÷"].map((operator): TeachingStep => {
    const statement = `${match[1]} ${operator} ${match[2]} = ${match[3]}`;
    const trace = relationTrace(statement);
    return {
      label: `Test ${operationName(operator)} (${operator})`,
      expression: statement,
      result: relationSummary(trace),
    };
  });
  return finaliseExplanation(question,
    "Test every allowed operator in the blank and retain the only operation that makes the equation true.",
    steps,
    `Only ${operationName(question.answer)} works, so the missing operator is ${question.answer}.`,
  );
}

function missingRelation(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Which relation sign replaces the blank in (.+) _ (.+)\?$/u, question.candidateId);
  const completed = `${match[1]} ${question.answer} ${match[2]}`;
  return finaliseExplanation(question,
    "Calculate the two arithmetic sides independently and compare their exact values.",
    [
      ...calculationSteps(match[1], "Left side"),
      ...calculationSteps(match[2], "Right side"),
      ...relationTeachingSteps(completed).slice(-1),
    ],
    `Therefore, the missing relation sign is ${question.answer}.`,
  );
}

function fillBlanks(source: string, values: readonly string[]): string {
  let index = 0;
  const completed = source.replace(/_/gu, () => values[index++] ?? "_");
  if (index !== values.length || completed.includes("_")) throw new Error(`Could not fill all blanks in: ${source}`);
  return completed;
}

function orderedFill(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const source = question.candidateId === "OPS-CAND-012"
    ? requireMatch(question.stem, /^Select the ordered pair of operators that makes (.+) true\.$/u, question.candidateId)[1]
    : requireMatch(question.stem, /^Select the ordered sequence that makes (.+) a true equation\.$/u, question.candidateId)[1];
  const values = question.answer.split(",").map((value) => value.trim());
  const completed = fillBlanks(source, values);
  const trace = relationTrace(completed);
  return finaliseExplanation(question,
    "Place the symbols in the exact order shown in an option, then evaluate the completed equation using ordinary precedence.",
    [
      { label: "Keep the option order unchanged", expression: question.answer, result: `Insert the symbols from left to right into ${source}.` },
      { label: "Form the completed equation", expression: source, result: completed },
      ...relationTeachingSteps(completed),
    ],
    `Both sides agree, so the required ordered ${values.length === 2 ? "pair" : "sequence"} is ${question.answer}.`,
  );
}

function prescribedOperatorSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Interchange (.+) and (.+) throughout (.+), then evaluate it\.$/u, question.candidateId);
  const pair = [match[1], match[2]] as const;
  const transformed = swapOperatorPairs(match[3], [pair]);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "An interchange is simultaneous and two-way: every occurrence of the first operator becomes the second, and every occurrence of the second becomes the first.",
    [
      { label: "Write both directions of the interchange", expression: `${pair[0]} → ${pair[1]}; ${pair[1]} → ${pair[0]}`, result: "Apply both changes to the original expression at the same time." },
      { label: "Transform the whole expression", expression: match[3], result: transformed },
      ...trace.steps,
    ],
    `Therefore, the value after interchange is ${trace.value}.`,
  );
}

function prescribedDoubleSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Interchange (.+) with (.+) and (.+) with (.+) simultaneously in (.+), then evaluate it\.$/u, question.candidateId);
  const pairs = [[match[1], match[2]], [match[3], match[4]]] as const;
  const transformed = swapOperatorPairs(match[5], pairs);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Apply both operator interchanges simultaneously, then complete multiplication and division before addition and subtraction.",
    [
      { label: "Write all four replacement directions", expression: `${match[1]} → ${match[2]}; ${match[2]} → ${match[1]}; ${match[3]} → ${match[4]}; ${match[4]} → ${match[3]}`, result: "Each original operator is changed exactly once." },
      { label: "Transform the expression", expression: match[5], result: transformed },
      ...trace.steps,
    ],
    `Therefore, the required value is ${trace.value}.`,
  );
}

function identifyOperatorSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const equation = equationFromStem(question.stem);
  const pairs = question.answer.split(";").map((entry) => parseArrowPair(entry.trim()));
  const transformed = swapOperatorPairs(equation, pairs);
  const trace = relationTrace(transformed);
  const pairText = pairs.flatMap(([left, right]) => [`${left} → ${right}`, `${right} → ${left}`]).join("; ");
  return finaliseExplanation(question,
    pairs.length === 1
      ? "Test each complete operator pair as a simultaneous two-way interchange and retain the unique pair that makes the equation true."
      : "Apply both disjoint operator pairs simultaneously; a valid answer must use all four replacement directions and make the equation true.",
    [
      { label: "Apply the proposed interchange in both directions", expression: pairText, result: "Change every occurrence in the original equation." },
      { label: "Rebuild the equation", expression: equation, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Establish uniqueness", expression: `${question.proof.eligibleCandidateCount} eligible interchange choices were checked.`, result: "Exactly one choice makes the equation true." },
    ],
    `Therefore, ${question.answer} must be interchanged.`,
  );
}

function relationBoundarySwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const equation = equationFromStem(question.stem);
  const pair = parseArrowPair(question.answer);
  const transformed = swapOperatorPairs(equation, [pair]);
  return finaliseExplanation(question,
    "When the equality sign is interchanged, first transform every sign and then locate the new equality sign before evaluating the two new sides.",
    [
      { label: "Swap both signs everywhere", expression: `${pair[0]} → ${pair[1]}; ${pair[1]} → ${pair[0]}`, result: "The equation boundary may move." },
      { label: "Rebuild the equation boundary", expression: equation, result: transformed },
      ...relationTeachingSteps(transformed),
    ],
    `The transformed equation is true, so the required pair is ${question.answer}.`,
  );
}

function optionAfterOperatorSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^After interchanging (.+) and (.+) in every option, select the true equation\.$/u, question.candidateId);
  const transformed = swapOperatorPairs(question.answer, [[match[1], match[2]]]);
  const trace = relationTrace(transformed);
  return finaliseExplanation(question,
    "Apply the prescribed two-way operator interchange independently to each printed equation and select the one whose transformed form is true.",
    [
      { label: "Write both replacement directions", expression: `${match[1]} → ${match[2]}; ${match[2]} → ${match[1]}`, result: "Use this same swap in every option." },
      { label: "Transform the keyed option", expression: question.answer, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Select the matching option", expression: relationSummary(trace), result: "The other right-hand sides do not equal the transformed left side." },
    ],
    `Hence, ${question.answer} is the correct printed option.`,
  );
}

function identifyWholeNumberSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const equation = equationFromStem(question.stem);
  const [left, right] = parseArrowPair(question.answer);
  const transformed = swapWholeNumbers(equation, left, right);
  return finaliseExplanation(question,
    "Swap complete number tokens as whole units; do not alter individual digits inside any other number.",
    [
      { label: "Identify the two complete numbers", expression: `${left} ↔ ${right}`, result: "Replace each complete token by the other everywhere in the equation." },
      { label: "Transform the equation", expression: equation, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Establish uniqueness", expression: `${question.proof.eligibleCandidateCount} complete-number pairs were checked.`, result: "Only this pair makes the equation true." },
    ],
    `Therefore, the required complete numbers are ${left} and ${right}.`,
  );
}

function prescribedWholeNumberSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Interchange the complete numbers (.+) and (.+) in (.+), then evaluate it\.$/u, question.candidateId);
  const transformed = swapWholeNumbers(match[3], match[1], match[2]);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Treat each stated number as one complete token, exchange the two complete tokens, and then evaluate the transformed expression.",
    [
      { label: "Swap complete number tokens", expression: `${match[1]} ↔ ${match[2]}`, result: "Digits inside other numbers remain unchanged." },
      { label: "Transform the expression", expression: match[3], result: transformed },
      ...trace.steps,
    ],
    `Therefore, the resulting value is ${trace.value}.`,
  );
}

function optionAfterWholeNumberSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^After interchanging the complete numbers (.+) and (.+) in every option, select the true equation\.$/u, question.candidateId);
  const transformed = swapWholeNumbers(question.answer, match[1], match[2]);
  return finaliseExplanation(question,
    "Exchange the stated complete-number tokens in every option, evaluate the transformed equation, and select the unique true one.",
    [
      { label: "Identify complete tokens", expression: `${match[1]} ↔ ${match[2]}`, result: "Do not perform a digit-by-digit replacement." },
      { label: "Transform the keyed option", expression: question.answer, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Select the matching equation", expression: `The transformed equation is true.`, result: "The alternative right-hand sides do not match the transformed left side." },
    ],
    `Hence, ${question.answer} is the correct printed option.`,
  );
}

function identifyDigitSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const equation = equationFromStem(question.stem);
  const [left, right] = parseArrowPair(question.answer);
  const transformed = swapDigits(equation, left, right);
  return finaliseExplanation(question,
    "A global digit interchange changes every occurrence of both digit identities, including occurrences inside multi-digit numbers and on both sides of the equation.",
    [
      { label: "Write both digit replacements", expression: `${left} → ${right}; ${right} → ${left}`, result: "Rebuild every affected numeral after the simultaneous swap." },
      { label: "Rebuild the full equation", expression: equation, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Establish uniqueness", expression: `${question.proof.eligibleCandidateCount} digit pairs were checked.`, result: "Only this pair produces a valid true equation without a leading zero." },
    ],
    `Therefore, the digits ${left} and ${right} must be interchanged.`,
  );
}

function prescribedDigitSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^Interchange digits (\d) and (\d) globally in (.+), then evaluate it\.$/u, question.candidateId);
  const transformed = swapDigits(match[3], match[1], match[2]);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Replace both digit identities globally, rebuild all affected numbers, and then evaluate the rebuilt expression.",
    [
      { label: "Write both digit replacements", expression: `${match[1]} → ${match[2]}; ${match[2]} → ${match[1]}`, result: "Apply the swap inside multi-digit numbers as well." },
      { label: "Rebuild the expression", expression: match[3], result: transformed },
      ...trace.steps,
    ],
    `Therefore, the value after the digit interchange is ${trace.value}.`,
  );
}

function optionAfterDigitSwap(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^After interchanging digits (\d) and (\d) globally in every option, select the true equation\.$/u, question.candidateId);
  const transformed = swapDigits(question.answer, match[1], match[2]);
  return finaliseExplanation(question,
    "Apply the global two-way digit replacement to every numeral in each option and select the equation whose rebuilt form is true.",
    [
      { label: "Write both digit replacements", expression: `${match[1]} → ${match[2]}; ${match[2]} → ${match[1]}`, result: "The right-hand side must also be rebuilt if it contains either digit." },
      { label: "Rebuild the keyed option", expression: question.answer, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Select the matching equation", expression: "The rebuilt equation is true.", result: "The other rebuilt options are false." },
    ],
    `Hence, ${question.answer} is the correct printed option.`,
  );
}

function compoundIdentify(question: ApprovedOpsQuestion, digitMode: boolean): ApprovedOpsQuestion {
  const equation = equationFromStem(question.stem);
  const [operatorText, numberText] = question.answer.split(";").map((entry) => entry.trim());
  const operatorPair = parseArrowPair(operatorText);
  const numberPair = parseArrowPair(numberText);
  const operatorTransformed = swapOperatorPairs(equation, [operatorPair]);
  const transformed = digitMode
    ? swapDigits(operatorTransformed, numberPair[0], numberPair[1])
    : swapWholeNumbers(operatorTransformed, numberPair[0], numberPair[1]);
  return finaliseExplanation(question,
    digitMode
      ? "Apply the operator interchange and the global digit interchange to the same original equation; both components are required."
      : "Apply the operator interchange and the complete-number interchange to the same original equation; both components are required.",
    [
      { label: "Write the operator interchange", expression: `${operatorPair[0]} → ${operatorPair[1]}; ${operatorPair[1]} → ${operatorPair[0]}`, result: "Change every occurrence of both operators." },
      { label: digitMode ? "Write the global digit interchange" : "Write the complete-number interchange", expression: `${numberPair[0]} → ${numberPair[1]}; ${numberPair[1]} → ${numberPair[0]}`, result: digitMode ? "Rebuild every affected numeral." : "Change only complete matching number tokens." },
      { label: "Apply both changes to the original equation", expression: equation, result: transformed },
      ...relationTeachingSteps(transformed),
      { label: "Establish uniqueness", expression: `${question.proof.eligibleCandidateCount} compound choices were checked.`, result: "Exactly one complete compound choice makes the equation true." },
    ],
    `Therefore, the required compound interchange is ${question.answer}.`,
  );
}

function prescribedCompound(question: ApprovedOpsQuestion, optionMode: boolean): ApprovedOpsQuestion {
  const pattern = optionMode
    ? /^After interchanging operators (.+) and (.+), and complete numbers (.+) and (.+), in every option, select the true equation\.$/u
    : /^Interchange operators (.+) and (.+), and interchange the complete numbers (.+) and (.+), in (.+)\. What is the resulting value\?$/u;
  const match = requireMatch(question.stem, pattern, question.candidateId);
  const original = optionMode ? question.answer : match[5];
  const afterOperators = swapOperatorPairs(original, [[match[1], match[2]]]);
  const transformed = swapWholeNumbers(afterOperators, match[3], match[4]);
  const traceSteps = optionMode ? relationTeachingSteps(transformed) : arithmeticTrace(transformed).steps;
  return finaliseExplanation(question,
    "Apply both prescribed interchanges simultaneously to the original expression or equation, then calculate the transformed form using normal precedence.",
    [
      { label: "Write the operator interchange", expression: `${match[1]} → ${match[2]}; ${match[2]} → ${match[1]}`, result: "Change every occurrence of both operators." },
      { label: "Write the complete-number interchange", expression: `${match[3]} → ${match[4]}; ${match[4]} → ${match[3]}`, result: "Change only the complete matching number tokens." },
      { label: "Apply both changes", expression: original, result: transformed },
      ...traceSteps,
      ...(optionMode ? [{ label: "Select the matching equation", expression: "The transformed keyed equation is true.", result: "The alternative right-hand sides do not match." }] : []),
    ],
    optionMode
      ? `Hence, ${question.answer} is the correct printed option.`
      : `Therefore, the resulting value is ${question.answer}.`,
  );
}

function operationResult(left: string, operator: string, right: string): string {
  return arithmeticTrace(`${left} ${operator} ${right}`).value;
}

function inferOperation(left: string, right: string, expected: string): string {
  const matches = ["+", "−", "×", "÷"].filter((operator) => operationResult(left, operator, right) === expected);
  if (matches.length !== 1) throw new Error(`Hidden operation is not uniquely inferable for ${left}, ${right}, ${expected}.`);
  return matches[0];
}

function hiddenMappingEvaluation(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^M and N each represent one of \+, −, × and ÷\. Given (.+) M (.+) = (.+) and (.+) N (.+) = (.+), evaluate (.+)\.$/u, question.candidateId);
  const m = inferOperation(match[1], match[2], match[3]);
  const n = inferOperation(match[4], match[5], match[6]);
  const target = match[7];
  const transformed = substituteTokenMeanings(target, [{ display: "M", meaning: m }, { display: "N", meaning: n }]);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Use the complete evidence to infer one unique arithmetic meaning for each token, substitute those meanings into the target, and then calculate.",
    [
      { label: "Find the meaning of M", expression: `${match[1]} M ${match[2]} = ${match[3]}`, result: `Among +, −, × and ÷, only ${operationName(m)} works: ${match[1]} ${m} ${match[2]} = ${match[3]}.` },
      { label: "Find the meaning of N", expression: `${match[4]} N ${match[5]} = ${match[6]}`, result: `Among +, −, × and ÷, only ${operationName(n)} works: ${match[4]} ${n} ${match[5]} = ${match[6]}.` },
      { label: "Substitute in the target", expression: target, result: transformed },
      ...trace.steps,
    ],
    `Therefore, the target value is ${trace.value}.`,
  );
}

function hiddenMappingOption(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^M and N each represent one of \+, −, × and ÷\. Given (.+) M (.+) = (.+) and (.+) N (.+) = (.+), infer M and N, then select the true target equation\.$/u, question.candidateId);
  const m = inferOperation(match[1], match[2], match[3]);
  const n = inferOperation(match[4], match[5], match[6]);
  const answer = requireMatch(question.answer, /^(.+) = (.+)$/u, question.candidateId);
  const transformed = substituteTokenMeanings(answer[1], [{ display: "M", meaning: m }, { display: "N", meaning: n }]);
  const trace = arithmeticTrace(transformed);
  return finaliseExplanation(question,
    "Infer the hidden meanings from the evidence, transform the common target expression, and select the option with the matching right-hand side.",
    [
      { label: "Infer M", expression: `${match[1]} M ${match[2]} = ${match[3]}`, result: `${match[1]} ${m} ${match[2]} = ${match[3]}, so M means ${m}.` },
      { label: "Infer N", expression: `${match[4]} N ${match[5]} = ${match[6]}`, result: `${match[4]} ${n} ${match[5]} = ${match[6]}, so N means ${n}.` },
      { label: "Transform the target expression", expression: answer[1], result: transformed },
      ...trace.steps,
      { label: "Compare the target options", expression: `The transformed target equals ${trace.value}.`, result: `Only the option ending in = ${trace.value} is true.` },
    ],
    `Hence, ${question.answer} is the correct equation.`,
  );
}

function oneHiddenOperation(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const match = requireMatch(question.stem, /^N represents one of \+, −, × and ÷\. If (.+) N (.+) = (.+), which arithmetic operation does N represent\?$/u, question.candidateId);
  const steps = ["+", "−", "×", "÷"].map((operator): TeachingStep => {
    const value = operationResult(match[1], operator, match[2]);
    return {
      label: `Test ${operationName(operator)}`,
      expression: `${match[1]} ${operator} ${match[2]}`,
      result: `${value}${value === match[3] ? ", which matches the evidence." : `, not ${match[3]}.`}`,
    };
  });
  return finaliseExplanation(question,
    "Test every operation in the stated domain and retain the one operation that reproduces the supplied result exactly.",
    steps,
    `Therefore, N represents ${operationName(question.answer)} (${question.answer}).`,
  );
}

function hiddenMixedMapping(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  const pairs = [
    { display: "A", meaning: "+" },
    { display: "B", meaning: "=" },
    { display: "C", meaning: ">" },
  ] as const;
  const steps: TeachingStep[] = [
    { label: "Determine C", expression: "7 C 4 is true", result: "C must be > because 7 > 4 is true; = is false and + would not form a relation statement." },
    { label: "Determine A and B", expression: "3 A 2 B 5 is true", result: "Using A = + and B = = gives 3 + 2 = 5, which is true; reversing them gives 3 = 2 + 5, which is false." },
    { label: "Record the inferred key", expression: meaningKey(pairs), result: "Use this one mapping for every option." },
  ];
  question.options.forEach((option, index) => {
    const transformed = substituteTokenMeanings(option.value, pairs);
    const trace = relationTrace(transformed);
    steps.push({ label: `Check option ${optionLetter(index)}`, expression: option.value, result: `${transformed}; ${relationSummary(trace)}.` });
  });
  return finaliseExplanation(question,
    "Infer the arithmetic and relation meanings from the two facts, then transform and evaluate every option under the same mapping.",
    steps,
    `Therefore, ${question.answer} is the only true option.`,
  );
}

function applyApprovedExplanation(question: ApprovedOpsQuestion): ApprovedOpsQuestion {
  switch (question.candidateId) {
    case "OPS-CAND-001":
    case "OPS-CAND-004":
    case "OPS-CAND-005": return mappedEvaluation(question);
    case "OPS-CAND-003":
    case "OPS-CAND-007": return mappedEquationSelection(question);
    case "OPS-CAND-008": return mixedMappingSelection(question);
    case "OPS-CAND-009": return mappedRelationRecovery(question);
    case "OPS-CAND-010": return missingOperator(question);
    case "OPS-CAND-011": return missingRelation(question);
    case "OPS-CAND-012":
    case "OPS-CAND-013": return orderedFill(question);
    case "OPS-CAND-014": return prescribedOperatorSwap(question);
    case "OPS-CAND-015": return prescribedDoubleSwap(question);
    case "OPS-CAND-016":
    case "OPS-CAND-017": return identifyOperatorSwap(question);
    case "OPS-CAND-018": return relationBoundarySwap(question);
    case "OPS-CAND-019": return optionAfterOperatorSwap(question);
    case "OPS-CAND-020": return identifyWholeNumberSwap(question);
    case "OPS-CAND-021": return prescribedWholeNumberSwap(question);
    case "OPS-CAND-022": return optionAfterWholeNumberSwap(question);
    case "OPS-CAND-023": return identifyDigitSwap(question);
    case "OPS-CAND-024": return prescribedDigitSwap(question);
    case "OPS-CAND-025": return optionAfterDigitSwap(question);
    case "OPS-CAND-026": return compoundIdentify(question, false);
    case "OPS-CAND-027": return compoundIdentify(question, true);
    case "OPS-CAND-028": return prescribedCompound(question, false);
    case "OPS-CAND-029": return prescribedCompound(question, true);
    case "OPS-CAND-030": return hiddenMappingEvaluation(question);
    case "OPS-CAND-032": return hiddenMappingOption(question);
    case "OPS-CAND-033": return oneHiddenOperation(question);
    case "OPS-CAND-034": return hiddenMixedMapping(question);
  }
}

export function generateApprovedOpsQuestion(candidateId: OpsApprovedCandidateId, seed: number): ApprovedOpsQuestion {
  if (!Number.isInteger(seed) || seed < 0) throw new Error(`Approved runtime seed must be a non-negative integer; received ${seed}.`);
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const sourceSeed = seed * 1009 + attempt;
    try {
      const raw = rawQuestion(candidateId, sourceSeed);
      if (!editoriallyEligible(raw)) continue;
      const normalized = normalizeQuestion(raw, seed, sourceSeed);
      return applyApprovedExplanation(normalized);
    } catch {
      continue;
    }
  }
  throw new Error(`${candidateId} could not produce an editorially eligible approved question for seed ${seed}.`);
}
