import {
  OPS_QL_FREEZE_VERSION,
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  type OpsQlId,
} from "../registry";
import {
  localizeApprovedOpsQuestion,
  type ApprovedOpsLocale,
} from "../pilot/approved-localization-entry";
import type { ApprovedOpsQuestion } from "../pilot/approved-teaching-canonical";
import {
  arithmeticTrace,
  relationTrace,
  swapDigits,
  swapOperatorPairs,
  type TeachingStep,
} from "../pilot/approved-teaching-helpers";
import type { OpsPilotOption } from "../pilot/representative-pilots";
import { withOpsInstanceDifficulty } from "./final-audit-remediation";

export type OpsAuditedLanguage = "en" | "hi" | "pa";

const OPERATOR_PAIR_TEXTS = [
  "+ ↔ −",
  "+ ↔ ×",
  "+ ↔ ÷",
  "− ↔ ×",
  "− ↔ ÷",
  "× ↔ ÷",
] as const;

function parsePair(source: string): readonly [string, string] {
  const match = source.match(/^(.+) ↔ (.+)$/u);
  if (!match) throw new Error(`Malformed operator pair: ${source}`);
  return [match[1]!, match[2]!] as const;
}

function mix(seed: number, salt: number): number {
  let value = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function int(seed: number, salt: number, minimum: number, maximum: number): number {
  return minimum + (mix(seed, salt) % (maximum - minimum + 1));
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const normalized = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(normalized), ...values.slice(0, normalized)];
}

function safeInteger(expression: string): string | null {
  try {
    const value = arithmeticTrace(expression).value;
    if (!/^-?\d+$/u.test(value)) return null;
    const numeric = Number(value);
    return Number.isSafeInteger(numeric) && Math.abs(numeric) <= 5000 ? value : null;
  } catch {
    return null;
  }
}

function baseTrueEquation(seed: number, salt: number): { expression: string; result: string } | null {
  const a = int(seed, salt + 1, 4, 28);
  const b = int(seed, salt + 2, 2, 12);
  const c = int(seed, salt + 3, 4, 28);
  const d = int(seed, salt + 4, 2, 12);
  const e = int(seed, salt + 5, 2, 20);
  if (new Set([a, b, c, d, e]).size < 4) return null;
  const expression = `${a} × ${b} + ${c} ÷ ${d} − ${e}`;
  const result = safeInteger(expression);
  return result == null ? null : { expression, result };
}

function trueAfterOperatorSwap(equation: string, pair: readonly [string, string]): boolean {
  try {
    return relationTrace(swapOperatorPairs(equation, [pair])).truth;
  } catch {
    return false;
  }
}

function buildCandidate016(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const sourceSeed = (seed * 1009 + attempt * 7919 + 101) >>> 0;
    const base = baseTrueEquation(sourceSeed, 20);
    if (!base) continue;
    const answerText = OPERATOR_PAIR_TEXTS[int(sourceSeed, 30, 0, OPERATOR_PAIR_TEXTS.length - 1)]!;
    const answerPair = parsePair(answerText);
    const trueEquation = `${base.expression} = ${base.result}`;
    const printedEquation = swapOperatorPairs(trueEquation, [answerPair]);
    const survivors = OPERATOR_PAIR_TEXTS.filter((pairText) =>
      trueAfterOperatorSwap(printedEquation, parsePair(pairText))
    );
    if (survivors.length !== 1 || survivors[0] !== answerText) continue;

    const sharing = OPERATOR_PAIR_TEXTS.filter((pairText) => {
      if (pairText === answerText) return false;
      const pair = parsePair(pairText);
      return pair.includes(answerPair[0]) || pair.includes(answerPair[1]);
    });
    const disjoint = OPERATOR_PAIR_TEXTS.find((pairText) => {
      if (pairText === answerText) return false;
      const pair = parsePair(pairText);
      return !pair.includes(answerPair[0]) && !pair.includes(answerPair[1]);
    });
    if (sharing.length < 2 || !disjoint) continue;
    const optionValues = rotate([answerText, sharing[0]!, sharing[1]!, disjoint], seed);
    const options: OpsPilotOption[] = optionValues.map((value) => ({
      value,
      errorLabel: value === answerText
        ? null
        : value === disjoint
          ? "CHANGED_BOTH_WRONG_OPERATORS"
          : "KEPT_ONE_OPERATOR_BUT_PAIRED_IT_WRONGLY",
    }));
    const correctIndex = options.findIndex((option) => option.errorLabel === null);
    const transformed = swapOperatorPairs(printedEquation, [answerPair]);
    const relation = relationTrace(transformed);
    const leftTrace = arithmeticTrace(relation.left.expression);
    const rightTrace = arithmeticTrace(relation.right.expression);
    const steps: TeachingStep[] = [
      {
        label: "Apply the proposed interchange in both directions",
        expression: `${answerPair[0]} → ${answerPair[1]}; ${answerPair[1]} → ${answerPair[0]}`,
        result: "Both operators occur in the original equation, so this is a genuine two-way interchange.",
      },
      { label: "Rebuild the complete equation", expression: printedEquation, result: transformed },
      ...leftTrace.steps.map((step) => ({ ...step, label: `Left side: ${step.label}` })),
      ...(rightTrace.steps.length > 0
        ? rightTrace.steps.map((step) => ({ ...step, label: `Right side: ${step.label}` }))
        : [{ label: "Right side: Read the value", expression: relation.right.expression, result: `Its value is ${rightTrace.value}.` }]),
      { label: "Compare both sides", expression: `${leftTrace.value} = ${rightTrace.value}`, result: "The transformed equation is true." },
      { label: "Establish uniqueness", expression: "All six basic operator pairs were tested.", result: `Only ${answerText} makes the equation true.` },
    ];

    return {
      candidateId: "OPS-CAND-016",
      checkpointId: "OPS-CP-005",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_OPERATOR_PAIR_TO_SWAP",
      solveMode: "identifySingleOperatorPairSwapForEquation",
      renderer: "TABLE_OR_GRID",
      stem: `Which pair of operators must be interchanged throughout ${printedEquation} to make it correct?`,
      options,
      correctIndex,
      answer: answerText,
      explanation: {
        ruleStatement: "Test complete two-way operator interchanges only when both operators are visible in the original equation; rebuild the equation, apply ordinary precedence and retain the unique true result.",
        steps,
        conclusion: `Therefore, ${answerText} must be interchanged.`,
      },
      proof: {
        unique: true,
        solverRoute: "GENERATED_ENUMERATE_ALL_VISIBLE_BASIC_OPERATOR_PAIRS",
        eligibleCandidateCount: OPERATOR_PAIR_TEXTS.length,
        survivingCandidateCount: 1,
        semanticFingerprint: `OPS-CAND-016:${printedEquation}:${answerText}`,
      },
      metadata: {
        teachingExplanationVersion: "V3_APPROVED",
        teachingTraceVerified: true,
        requestedSeed: seed,
        sourceSeed,
        generatedEquationState: true,
        completePoolVerified: true,
      },
    };
  }
  throw new Error(`OPS-CAND-016 could not build a unique generated equation for seed ${seed}.`);
}

function digitPairs(equation: string): readonly (readonly [string, string])[] {
  const digits = [...new Set(equation.match(/\d/gu) ?? [])].sort();
  const result: Array<readonly [string, string]> = [];
  for (let left = 0; left < digits.length; left += 1) {
    for (let right = left + 1; right < digits.length; right += 1) {
      result.push([digits[left]!, digits[right]!] as const);
    }
  }
  return result;
}

function compoundRepairTrue(
  equation: string,
  operatorPair: readonly [string, string],
  digitPair: readonly [string, string],
): boolean {
  try {
    const afterOperator = swapOperatorPairs(equation, [operatorPair]);
    const transformed = swapDigits(afterOperator, digitPair[0], digitPair[1]);
    return relationTrace(transformed).truth;
  } catch {
    return false;
  }
}

function buildCandidate027(seed: number): ApprovedOpsQuestion {
  for (let attempt = 0; attempt < 8000; attempt += 1) {
    const sourceSeed = (seed * 1013 + attempt * 6151 + 211) >>> 0;
    const base = baseTrueEquation(sourceSeed, 40);
    if (!base) continue;
    const trueEquation = `${base.expression} = ${base.result}`;
    const availableDigitPairs = digitPairs(trueEquation).filter((pair) => pair[0] !== "0" && pair[1] !== "0");
    if (availableDigitPairs.length < 2) continue;
    const operatorText = OPERATOR_PAIR_TEXTS[int(sourceSeed, 50, 0, OPERATOR_PAIR_TEXTS.length - 1)]!;
    const operatorPair = parsePair(operatorText);
    const digitPair = availableDigitPairs[int(sourceSeed, 51, 0, availableDigitPairs.length - 1)]!;
    const digitText = `${digitPair[0]} ↔ ${digitPair[1]}`;

    let printedEquation: string;
    try {
      printedEquation = swapOperatorPairs(
        swapDigits(trueEquation, digitPair[0], digitPair[1]),
        [operatorPair],
      );
      relationTrace(printedEquation);
    } catch {
      continue;
    }

    const printedDigitPairs = digitPairs(printedEquation);
    const survivors: string[] = [];
    for (const candidateOperatorText of OPERATOR_PAIR_TEXTS) {
      for (const candidateDigitPair of printedDigitPairs) {
        if (compoundRepairTrue(printedEquation, parsePair(candidateOperatorText), candidateDigitPair)) {
          survivors.push(`${candidateOperatorText}; ${candidateDigitPair[0]} ↔ ${candidateDigitPair[1]}`);
        }
      }
    }
    const answer = `${operatorText}; ${digitText}`;
    if (survivors.length !== 1 || survivors[0] !== answer) continue;

    const wrongOperator = OPERATOR_PAIR_TEXTS.find((pair) => pair !== operatorText)!;
    const wrongDigits = printedDigitPairs.find((pair) => `${pair[0]} ↔ ${pair[1]}` !== digitText);
    if (!wrongDigits) continue;
    const optionValues = rotate([
      answer,
      `${operatorText}; no digit interchange`,
      `no operator interchange; ${digitText}`,
      `${wrongOperator}; ${wrongDigits[0]} ↔ ${wrongDigits[1]}`,
    ], seed);
    const options: OpsPilotOption[] = optionValues.map((value) => ({
      value,
      errorLabel: value === answer
        ? null
        : value.includes("no digit interchange")
          ? "APPLIED_OPERATOR_SWAP_ONLY"
          : value.includes("no operator interchange")
            ? "APPLIED_DIGIT_SWAP_ONLY"
            : "WRONG_OPERATOR_AND_DIGIT_PAIR",
    }));
    const correctIndex = options.findIndex((option) => option.errorLabel === null);
    const afterOperator = swapOperatorPairs(printedEquation, [operatorPair]);
    const transformed = swapDigits(afterOperator, digitPair[0], digitPair[1]);
    const relation = relationTrace(transformed);
    const leftTrace = arithmeticTrace(relation.left.expression);
    const rightTrace = arithmeticTrace(relation.right.expression);
    const steps: TeachingStep[] = [
      { label: "Write both operator replacements", expression: `${operatorPair[0]} → ${operatorPair[1]}; ${operatorPair[1]} → ${operatorPair[0]}`, result: "Both operators occur in the original equation and are changed simultaneously." },
      { label: "Write both global digit replacements", expression: `${digitPair[0]} → ${digitPair[1]}; ${digitPair[1]} → ${digitPair[0]}`, result: "Rebuild every affected number on both sides of the equation." },
      { label: "Apply both changes to the original equation", expression: printedEquation, result: transformed },
      ...leftTrace.steps.map((step) => ({ ...step, label: `Left side: ${step.label}` })),
      ...(rightTrace.steps.length > 0
        ? rightTrace.steps.map((step) => ({ ...step, label: `Right side: ${step.label}` }))
        : [{ label: "Right side: Read the value", expression: relation.right.expression, result: `Its value is ${rightTrace.value}.` }]),
      { label: "Compare both sides", expression: `${leftTrace.value} = ${rightTrace.value}`, result: "The transformed equation is true." },
      { label: "Establish complete-pool uniqueness", expression: `${OPERATOR_PAIR_TEXTS.length} operator pairs × ${printedDigitPairs.length} digit pairs were tested.`, result: `Only ${answer} makes the equation true.` },
    ];

    return {
      candidateId: "OPS-CAND-027",
      checkpointId: "OPS-CP-008",
      seed,
      locale: "en-IN",
      taskKind: "IDENTIFY_OPERATOR_AND_DIGIT_INTERCHANGE",
      solveMode: "identifyOperatorAndDigitPairSwap",
      renderer: "TABLE_OR_GRID",
      stem: `Which operator pair and digit pair must be interchanged throughout ${printedEquation} to make it correct?`,
      options,
      correctIndex,
      answer,
      explanation: {
        ruleStatement: "Test a simultaneous two-way operator interchange together with a global digit-identity interchange; rebuild every affected numeral and retain the unique true equation.",
        steps,
        conclusion: `Therefore, ${answer} is the required compound interchange.`,
      },
      proof: {
        unique: true,
        solverRoute: "GENERATED_COMPLETE_OPERATOR_PAIR_X_DIGIT_PAIR_SEARCH",
        eligibleCandidateCount: OPERATOR_PAIR_TEXTS.length * printedDigitPairs.length,
        survivingCandidateCount: 1,
        semanticFingerprint: `OPS-CAND-027:${printedEquation}:${answer}`,
      },
      metadata: {
        teachingExplanationVersion: "V3_APPROVED",
        teachingTraceVerified: true,
        requestedSeed: seed,
        sourceSeed,
        generatedEquationState: true,
        completePoolVerified: true,
        misconceptionDistractorsGrounded: true,
      },
    };
  }
  throw new Error(`OPS-CAND-027 could not build a unique generated equation for seed ${seed}.`);
}

type MixedMeaning = "+" | "=" | ">";

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [[...values]];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const rest = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const suffix of permutations(rest)) result.push([value, ...suffix]);
  });
  return result;
}

function substituteMixed(statement: string, mapping: Readonly<Record<string, MixedMeaning>>): string {
  return statement.split(" ").map((token) => mapping[token] ?? token).join(" ");
}

function buildCandidate034(seed: number): ApprovedOpsQuestion {
  const sourceSeed = mix(seed, 70);
  const tokenOrder = rotate(["A", "B", "C"], int(sourceSeed, 71, 0, 2));
  const meaningOrder = rotate<MixedMeaning>(["+", "=", ">"], int(sourceSeed, 72, 0, 2));
  const mapping = Object.fromEntries(tokenOrder.map((token, index) => [token, meaningOrder[index]!])) as Record<string, MixedMeaning>;
  const tokenFor = (meaning: MixedMeaning) => tokenOrder[meaningOrder.indexOf(meaning)]!;
  const addToken = tokenFor("+");
  const equalToken = tokenFor("=");
  const greaterToken = tokenFor(">");

  const x = int(sourceSeed, 73, 2, 15);
  const y = int(sourceSeed, 74, 2, 12);
  const p = int(sourceSeed, 75, 12, 30);
  const q = int(sourceSeed, 76, 2, Math.max(2, p - 2));
  const evidence = [
    `${x} ${addToken} ${y} ${equalToken} ${x + y}`,
    `${p} ${greaterToken} ${q}`,
  ] as const;

  const candidateMappings = permutations<MixedMeaning>(["+", "=", ">"])
    .map((meanings) => Object.fromEntries(["A", "B", "C"].map((token, index) => [token, meanings[index]!])) as Record<string, MixedMeaning>)
    .filter((candidate) => evidence.every((statement) => {
      try {
        return relationTrace(substituteMixed(statement, candidate)).truth;
      } catch {
        return false;
      }
    }));
  if (candidateMappings.length !== 1) throw new Error(`OPS-CAND-034 evidence was not unique for seed ${seed}.`);

  const u = int(sourceSeed, 77, 3, 16);
  const v = int(sourceSeed, 78, 2, 11);
  const correct = `${u} ${addToken} ${v} ${equalToken} ${u + v}`;
  const optionValues = rotate([
    correct,
    `${u} ${addToken} ${v} ${greaterToken} ${u + v + 1}`,
    `${u + v} ${greaterToken} ${u + v + 2}`,
    `${u} ${equalToken} ${v} ${addToken} ${u + v}`,
  ], seed);
  const evaluated = optionValues.map((statement) => {
    try {
      return relationTrace(substituteMixed(statement, mapping)).truth;
    } catch {
      return false;
    }
  });
  if (evaluated.filter(Boolean).length !== 1 || !evaluated[optionValues.indexOf(correct)]) {
    throw new Error(`OPS-CAND-034 options were not uniquely true for seed ${seed}.`);
  }
  const options: OpsPilotOption[] = optionValues.map((value, index) => ({
    value,
    errorLabel: evaluated[index] ? null : "STATEMENT_FALSE_UNDER_INFERRED_MAPPING",
  }));
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  const mappingText = tokenOrder.map((token) => `${token} → ${mapping[token]}`).join("; ");
  const steps: TeachingStep[] = [
    { label: "Determine the comparison token", expression: evidence[1], result: `${greaterToken} must mean > because ${p} > ${q}.` },
    { label: "Determine the arithmetic and equality tokens", expression: evidence[0], result: `${addToken} means + and ${equalToken} means = because ${x} + ${y} = ${x + y}.` },
    { label: "Record the inferred key", expression: mappingText, result: "Use this same mapping for every option." },
    ...options.map((option, index) => {
      const transformed = substituteMixed(option.value, mapping);
      let truth = false;
      try { truth = relationTrace(transformed).truth; } catch { truth = false; }
      return { label: `Check option ${String.fromCharCode(65 + index)}`, expression: option.value, result: `${transformed}; ${truth ? "true" : "false"}.` };
    }),
  ];

  return {
    candidateId: "OPS-CAND-034",
    checkpointId: "OPS-CP-009",
    seed,
    locale: "en-IN",
    taskKind: "INFER_MAPPING_AND_IDENTIFY_TRUE_STATEMENT",
    solveMode: "inferMixedArithmeticRelationMappingThenSelectStatement",
    renderer: "TABLE_OR_GRID",
    stem: `A, B and C represent +, = and > in some order. The statements ${evidence[0]} and ${evidence[1]} are true. Determine the meanings and select the true statement.`,
    options,
    correctIndex,
    answer: correct,
    explanation: {
      ruleStatement: "Infer the arithmetic, equality and comparison meanings from all supplied evidence, then transform and evaluate every option under that one mapping.",
      steps,
      conclusion: `Therefore, ${correct} is the only true option.`,
    },
    proof: {
      unique: true,
      solverRoute: "GENERATED_ENUMERATE_MIXED_ARITHMETIC_RELATION_MAPPINGS",
      eligibleCandidateCount: 6,
      survivingCandidateCount: 1,
      semanticFingerprint: `OPS-CAND-034:${evidence.join("|")}:${mappingText}:${correct}`,
    },
    metadata: {
      teachingExplanationVersion: "V3_APPROVED",
      teachingTraceVerified: true,
      requestedSeed: seed,
      sourceSeed,
      evidenceCount: 2,
      relationTokenInferred: true,
      generatedMixedMappingState: true,
      mappingPermutationVaries: true,
    },
  };
}

function localizeCandidate034(question: ApprovedOpsQuestion, locale: ApprovedOpsLocale): ApprovedOpsQuestion {
  const hi = locale === "hi-IN";
  const stem = question.stem.match(/^A, B and C represent \+, = and > in some order\. The statements (.+) and (.+) are true\. Determine the meanings and select the true statement\.$/u);
  if (!stem) throw new Error(`Cannot localize generated OPS-CAND-034 stem: ${question.stem}`);
  const labels = question.explanation.steps.map((step) => {
    if (step.label === "Determine the comparison token") return hi ? "तुलना-चिह्न का अर्थ निकालें" : "ਤੁਲਨਾ-ਚਿੰਨ੍ਹ ਦਾ ਅਰਥ ਕੱਢੋ";
    if (step.label === "Determine the arithmetic and equality tokens") return hi ? "गणितीय और बराबरी चिह्नों के अर्थ निकालें" : "ਗਣਿਤੀ ਅਤੇ ਬਰਾਬਰੀ ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਕੱਢੋ";
    if (step.label === "Record the inferred key") return hi ? "मिली हुई कुंजी लिखें" : "ਮਿਲੀ ਹੋਈ ਕੁੰਜੀ ਲਿਖੋ";
    const option = step.label.match(/^Check option ([A-D])$/u);
    if (option) return hi ? `विकल्प ${option[1]} जाँचें` : `ਵਿਕਲਪ ${option[1]} ਜਾਂਚੋ`;
    return step.label;
  });
  return {
    ...question,
    locale,
    stem: hi
      ? `A, B और C किसी क्रम में +, = और > को दर्शाते हैं। ${stem[1]} तथा ${stem[2]} दोनों सही हैं। इनके अर्थ निकालकर सही कथन चुनिए।`
      : `A, B ਅਤੇ C ਕਿਸੇ ਕ੍ਰਮ ਵਿੱਚ +, = ਅਤੇ > ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ। ${stem[1]} ਅਤੇ ${stem[2]} ਦੋਵੇਂ ਸਹੀ ਹਨ। ਇਨ੍ਹਾਂ ਦੇ ਅਰਥ ਲੱਭ ਕੇ ਸਹੀ ਕਥਨ ਚੁਣੋ।`,
    explanation: {
      ruleStatement: hi
        ? "सभी दिए तथ्यों से गणितीय, बराबरी और तुलना-चिह्नों के अर्थ निकालिए, फिर उसी एक कुंजी से हर विकल्प की जाँच कीजिए।"
        : "ਸਾਰੇ ਦਿੱਤੇ ਤੱਥਾਂ ਤੋਂ ਗਣਿਤੀ, ਬਰਾਬਰੀ ਅਤੇ ਤੁਲਨਾ-ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਕੱਢੋ, ਫਿਰ ਉਸੇ ਇੱਕ ਕੁੰਜੀ ਨਾਲ ਹਰ ਵਿਕਲਪ ਜਾਂਚੋ।",
      steps: question.explanation.steps.map((step, index) => ({ ...step, label: labels[index]! })),
      conclusion: hi
        ? `अतः ${question.answer} ही एकमात्र सही विकल्प है।`
        : `ਇਸ ਲਈ ${question.answer} ਹੀ ਇਕੱਲਾ ਸਹੀ ਵਿਕਲਪ ਹੈ।`,
    },
  };
}

function generatedEnglishQuestion(qlId: OpsQlId, seed: number): ApprovedOpsQuestion | null {
  if (qlId === "OPS-QL-014") return buildCandidate016(seed);
  if (qlId === "OPS-QL-025") return buildCandidate027(seed);
  if (qlId === "OPS-QL-031") return buildCandidate034(seed);
  return null;
}

export function generateAuditedOpsQuestion(
  qlId: OpsQlId,
  seed: number,
  language: OpsAuditedLanguage = "en",
) {
  const generatedEnglish = generatedEnglishQuestion(qlId, seed);
  if (!generatedEnglish) {
    const base = language === "en"
      ? generateFrozenOpsQuestion(qlId, seed)
      : generateLocalizedFrozenOpsQuestion(qlId, seed, language === "hi" ? "hi-IN" : "pa-IN");
    return withOpsInstanceDifficulty(base);
  }

  const localized = language === "en"
    ? generatedEnglish
    : qlId === "OPS-QL-031"
      ? localizeCandidate034(generatedEnglish, language === "hi" ? "hi-IN" : "pa-IN")
      : localizeApprovedOpsQuestion(generatedEnglish, language === "hi" ? "hi-IN" : "pa-IN");
  const withIdentity = {
    ...localized,
    qlId,
    qlFreezeVersion: OPS_QL_FREEZE_VERSION,
  };
  return withOpsInstanceDifficulty(withIdentity);
}
