import {
  formatNumber,
  getComparableAnswerKey,
  normalizeQuantV4Answer,
  renderQuantV4Answer,
  type QuantV4AnswerLike,
  type QuantV4CanonicalAnswer,
} from "./answer-contract";

export interface QuantV4OptionGenerationInput {
  seed?: string;
  existingOptions?: readonly unknown[];
  optionCount?: number;
  context?: QuantV4OptionGenerationContext;
}

export interface QuantV4OptionGenerationContext {
  packageId?: string;
  archetypeId?: string;
  canonicalProblemId?: string;
  questionLanguageId?: string;
  taskKind?: string;
  answerType?: string;
  difficulty?: string;
  stem?: string;
  variables?: Record<string, unknown>;
  traceability?: unknown;
}

export interface QuantV4OptionGenerationResult {
  options: string[];
  correct: number;
  canonicalAnswer: QuantV4CanonicalAnswer;
}

function seededHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleDeterministically<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = seededHash(seed) || 1;
  for (let index = shuffled.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex]!,
      shuffled[index]!,
    ];
  }
  return shuffled;
}

function normalizeOptionIdentity(value: string) {
  return normalizeMathLiteral(value)
    .replace(/\\\\%/g, "%")
    .replace(/\\%/g, "%")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/[.]+$/g, "")
    .trim()
    .toLowerCase();
}

function sanitizeOptionText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/([.!?])\1+$/g, "$1")
    .trim();
}

function addUnique(options: string[], value: string) {
  const trimmed = sanitizeOptionText(value);
  if (!trimmed) return;
  const key = normalizeOptionIdentity(trimmed);
  if (!options.some((existing) => normalizeOptionIdentity(existing) === key)) {
    options.push(trimmed);
  }
}

function unwrapMathDelimiters(value: string) {
  const trimmed = value.trim();
  if (/^\$\$[\s\S]*\$\$$/.test(trimmed)) {
    return trimmed.slice(2, -2).trim();
  }
  if (/^\\\([\s\S]*\\\)$/.test(trimmed)) {
    return trimmed.slice(2, -2).trim();
  }
  if (/^\\\[[\s\S]*\\\]$/.test(trimmed)) {
    return trimmed.slice(2, -2).trim();
  }
  return trimmed;
}

function normalizeMathLiteral(value: string) {
  return unwrapMathDelimiters(value)
    .replace(/\\%/g, "%")
    .replace(/\\\\%/g, "%")
    .replace(/\s+/g, " ")
    .trim();
}

function contextText(context?: QuantV4OptionGenerationContext) {
  return [
    context?.packageId,
    context?.archetypeId,
    context?.canonicalProblemId,
    context?.questionLanguageId,
    context?.taskKind,
    context?.answerType,
    context?.difficulty,
    context?.stem,
    ...Object.entries(context?.variables ?? {}).flatMap(([key, value]) => [
      key,
      typeof value === "string" || typeof value === "number"
        ? String(value)
        : "",
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isReverseComparisonContext(context?: QuantV4OptionGenerationContext) {
  const text = contextText(context);
  return (
    /\b(moretoless|lesstomore|reverse|exceeds|cheaper|higher than|lower than)\b/i.test(text) ||
    /by what percent .* (more|less|above|below|higher|lower) than/i.test(text)
  );
}

function isBoundedPercentageContext(context?: QuantV4OptionGenerationContext) {
  const text = contextText(context);
  return /\b(ratiotopercentage|complementarypercentage|missingpercentage|share|component|solute|solvent|milk|water|sugar|distribution|remainder|vacant|booked|valid|invalid|passed|failed|remaining|used|recovered|not recovered|boys|girls|male|female|children|attendance percentage|polling percentage|approval rate|selection rate|success rate|defect percentage|percentage share|vote percentage|new percentage of|updated percentage of|revised percentage of|new share of|updated share of|revised share of|percentage of the whole|percentage of the total|as a percentage of the whole|as a percentage of the total|what percent of the total|share of the whole|share of the total|in the new total|revised percentage|revised share|rest are|remainder are)\b/i.test(text);
}

function isCountLikeContext(context?: QuantV4OptionGenerationContext) {
  const text = contextText(context);
  return /\b(people|students|passengers|voters|cartons|boxes|items|units|marks|votes|employees|applicants|accounts|bags|books|seats|patients|respondents|children|boys|girls|males|females)\b/i.test(text);
}

function percentValueFromOption(option: string) {
  const normalized = normalizeMathLiteral(option);
  const match = normalized.match(/^(-?[\d,]+(?:\.\d+)?)\s*%$/);
  if (!match) return null;
  const value = Number(match[1]!.replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

function numericValueFromOption(option: string) {
  const normalized = normalizeMathLiteral(option);
  const match = normalized.match(/^-?[\d,]+(?:\.\d+)?$/);
  if (!match) return null;
  const value = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

function inferOptionPrecision(value: string) {
  const decimal = value.match(/\.(\d+)/);
  return decimal ? decimal[1]!.length : 0;
}

function usesDisplayMath(answer: QuantV4CanonicalAnswer) {
  const rendered = answer.rendered?.trim() ?? "";
  return (
    /^\$\$[\s\S]*\$\$$/.test(rendered) ||
    /^\\\([\s\S]*\\\)$/.test(rendered) ||
    /^\\\[[\s\S]*\\\]$/.test(rendered)
  );
}

function wrapLikeReference(answer: QuantV4CanonicalAnswer, value: string) {
  if (!usesDisplayMath(answer)) {
    return value;
  }

  const escaped = value.replace(/%/g, "\\%");
  const rendered = answer.rendered?.trim() ?? "";
  if (/^\$\$[\s\S]*\$\$$/.test(rendered)) {
    return `$$${escaped}$$`;
  }
  if (/^\\\([\s\S]*\\\)$/.test(rendered)) {
    return `\\(${escaped}\\)`;
  }
  if (/^\\\[[\s\S]*\\\]$/.test(rendered)) {
    return `\\[${escaped}\\]`;
  }
  return value;
}

function inferSimpleCanonicalDistractorBase(answer: QuantV4CanonicalAnswer): QuantV4CanonicalAnswer | null {
  if (answer.kind !== "symbolic") {
    return answer;
  }

  const candidates = [
    answer.display,
    answer.value,
    answer.rendered,
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map(normalizeMathLiteral);

  for (const candidate of candidates) {
    const latexFraction = candidate.match(
      /^\\frac\{(-?[\d,]+(?:\.\d+)?)\}\{(-?[\d,]+(?:\.\d+)?)\}$/,
    );
    if (latexFraction) {
      return {
        kind: "fraction",
        numerator: Number(latexFraction[1]!.replace(/,/g, "")),
        denominator: Number(latexFraction[2]!.replace(/,/g, "")),
        display: `${latexFraction[1]}/${latexFraction[2]}`,
        rounding: "exact",
      };
    }

    const percent = candidate.match(/^(-?[\d,]+(?:\.\d+)?)%$/);
    if (percent) {
      const value = Number(percent[1]!.replace(/,/g, ""));
      if (Number.isFinite(value)) {
        return {
          kind: "percentage",
          value,
          precision: inferOptionPrecision(percent[1]!),
          display: `${formatNumber(value, inferOptionPrecision(percent[1]!))}%`,
          rounding: "exact",
        };
      }
    }

    const numeric = candidate.match(/^-?[\d,]+(?:\.\d+)?$/);
    if (numeric) {
      const value = Number(candidate.replace(/,/g, ""));
      if (Number.isFinite(value)) {
        return {
          kind: Number.isInteger(value) ? "integer" : "decimal",
          value,
          precision: inferOptionPrecision(candidate),
          display: formatNumber(value, inferOptionPrecision(candidate)),
          rounding: "exact",
        };
      }
    }
  }

  return null;
}

function formatFractionLikeReference(
  referenceAnswer: QuantV4CanonicalAnswer,
  numerator: number,
  denominator: number,
) {
  return wrapLikeReference(
    referenceAnswer,
    `\\frac{${formatNumber(numerator)}}{${formatNumber(denominator)}}`,
  );
}

function isWeakGeneratedOption(
  option: string,
  answer: QuantV4CanonicalAnswer,
  context?: QuantV4OptionGenerationContext,
) {
  const raw = option.trim();
  const normalized = normalizeMathLiteral(option);
  if (!normalized) return true;
  if (/(?:^|\s)[+-]\s*1$/.test(normalized)) return true;
  if (/\$\$[\s\S]*\$\$\s*[+-]?\s*\d+\s*$/.test(raw)) return true;
  if (/\\\)[\s]*[+-]?\s*\d+\s*$/.test(raw)) return true;
  if (/[=][\s]*\$\$/.test(raw)) return true;
  if (/\bundefined\b|\bnull\b|\bNaN\b/i.test(normalized)) return true;
  if (/[.!?]{2,}$/.test(raw)) return true;
  if (/[a-zA-Z]\s*[+\-*/]\s*\d/.test(normalized)) return true;

  const base = inferSimpleCanonicalDistractorBase(answer);
  if (
    base &&
    "value" in base &&
    typeof base.value === "number" &&
    base.value >= 0 &&
    normalized.startsWith("-")
  ) {
    return true;
  }

  const percentValue = percentValueFromOption(option);
  if (percentValue !== null) {
    if (!isReverseComparisonContext(context) && isBoundedPercentageContext(context)) {
      if (percentValue < 0 || percentValue > 100) return true;
    }

    if (!isReverseComparisonContext(context)) {
      const answerBase = inferSimpleCanonicalDistractorBase(answer);
      const answerPercent =
        answer.kind === "percentage"
          ? answer.value
          : answerBase?.kind === "percentage"
            ? answerBase.value
            : null;
      const absurdLimit =
        typeof answerPercent === "number" && Number.isFinite(answerPercent)
          ? Math.max(200, Math.abs(answerPercent) * 3 + 10)
          : 200;
      if (percentValue > absurdLimit || percentValue < -100) return true;
    }
  }

  const numericValue = numericValueFromOption(option);
  if (
    numericValue !== null &&
    numericValue < 0 &&
    !/\b(loss|decrease|change|difference|error)\b/i.test(contextText(context))
  ) {
    return true;
  }

  return false;
}

function numericOffsets(value: number) {
  const magnitude = Math.abs(value);
  if (magnitude >= 1000) return [100, -100, 50, -50, 10, -10];
  if (magnitude >= 100) return [10, -10, 20, -20, 5, -5];
  if (magnitude >= 10) return [1, -1, 2, -2, 5, -5];
  return [0.5, -0.5, 1, -1, 2, -2];
}

function formatLike(answer: QuantV4CanonicalAnswer, value: number) {
  switch (answer.kind) {
    case "integer":
    case "decimal":
      return formatNumber(value, answer.precision);
    case "percentage":
      return `${formatNumber(value, answer.precision)}%`;
    case "currency":
      return `${answer.currency}${formatNumber(value, answer.precision)}`;
    case "unit":
      return `${formatNumber(value, answer.precision)} ${answer.unit}`.trim();
    default:
      return formatNumber(value);
  }
}

function formatLikeReference(
  baseAnswer: QuantV4CanonicalAnswer,
  referenceAnswer: QuantV4CanonicalAnswer,
  value: number,
) {
  return wrapLikeReference(referenceAnswer, formatLike(baseAnswer, value));
}

function percentageDistractors(
  answer: Extract<QuantV4CanonicalAnswer, { kind: "percentage"; value: number }>,
  referenceAnswer: QuantV4CanonicalAnswer,
  context?: QuantV4OptionGenerationContext,
) {
  const precision = Math.max(0, answer.precision ?? 2);
  const round = (value: number) => Number(formatNumber(value, precision));
  if (isBoundedPercentageContext(context) && !isReverseComparisonContext(context)) {
    const candidates = [
      100 - answer.value,
      answer.value + 1,
      answer.value - 1,
      answer.value + 5,
      answer.value - 5,
      Math.round(answer.value),
      Math.ceil(answer.value),
    ].map(round);

    return candidates
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0 &&
          value <= 100 &&
          Math.abs(value - answer.value) > Number.EPSILON,
      )
      .map((value) => formatLikeReference(answer, referenceAnswer, value));
  }

  const candidates = [
    answer.value > 0 && answer.value < 100
      ? round((100 * answer.value) / (100 - answer.value))
      : NaN,
    answer.value > 0
      ? round((100 * answer.value) / (100 + answer.value))
      : NaN,
    round(Math.round(answer.value)),
    round(Math.ceil(answer.value)),
    round(answer.value + Math.max(1, precision > 0 ? 0.75 : 1)),
    round(Math.max(0, answer.value - Math.max(1, precision > 0 ? 0.75 : 1))),
  ];

  return candidates
    .filter((value) => Number.isFinite(value) && Math.abs(value - answer.value) > Number.EPSILON)
    .map((value) => formatLikeReference(answer, referenceAnswer, value));
}

function numericDistractors(
  answer: Extract<QuantV4CanonicalAnswer, { value: number }>,
  referenceAnswer: QuantV4CanonicalAnswer = answer,
  context?: QuantV4OptionGenerationContext,
) {
  if (answer.kind === "percentage") {
    return percentageDistractors(answer, referenceAnswer, context);
  }

  const values = numericOffsets(answer.value).map((offset) => {
    const candidate = answer.value + offset;
    return isCountLikeContext(context) || answer.kind === "integer"
      ? Math.round(candidate)
      : candidate;
  });
  return values
    .filter(
      (value) =>
        Number.isFinite(value) &&
        (!isCountLikeContext(context) || Number.isInteger(value)) &&
        value >= 0,
    )
    .map((value) => formatLikeReference(answer, referenceAnswer, value));
}

function fractionDistractors(
  answer: Extract<QuantV4CanonicalAnswer, { kind: "fraction" }>,
  referenceAnswer: QuantV4CanonicalAnswer = answer,
) {
  const numerator = answer.numerator;
  const denominator = answer.denominator;
  return [
    formatFractionLikeReference(referenceAnswer, numerator + 1, denominator),
    formatFractionLikeReference(referenceAnswer, Math.max(1, numerator - 1), denominator),
    formatFractionLikeReference(referenceAnswer, numerator, denominator + 1),
    formatFractionLikeReference(referenceAnswer, numerator, Math.max(1, denominator - 1)),
    formatFractionLikeReference(referenceAnswer, denominator, numerator || 1),
  ];
}

function ratioDistractors(answer: Extract<QuantV4CanonicalAnswer, { kind: "ratio" }>) {
  const terms = [...answer.terms];
  const candidates: string[] = [];
  for (let index = 0; index < terms.length; index++) {
    const plus = [...terms];
    plus[index] = (plus[index] ?? 0) + 1;
    candidates.push(plus.join(":"));

    const minus = [...terms];
    minus[index] = Math.max(1, (minus[index] ?? 0) - 1);
    candidates.push(minus.join(":"));
  }
  candidates.push([...terms].reverse().join(":"));
  return candidates;
}

function percentagePointDistractors(value: string) {
  const match = value.match(
    /(?<points>-?[\d,]+(?:\.\d+)?)\s+percentage points(?:\s+and\s+(?<relative>-?[\d,]+(?:\.\d+)?)%)?/i,
  );
  if (!match?.groups) return [];

  const points = Number(match.groups.points.replace(/,/g, ""));
  const relative =
    typeof match.groups.relative === "string"
      ? Number(match.groups.relative.replace(/,/g, ""))
      : null;
  if (!Number.isFinite(points)) return [];

  const pointDelta = Math.max(1, Math.round(Math.abs(points) / 2) || 1);
  if (relative !== null && Number.isFinite(relative)) {
    return [
      `${formatNumber(points)} percentage points and ${formatNumber(Math.max(0, relative - 5))}%`,
      `${formatNumber(points + pointDelta)} percentage points and ${formatNumber(relative)}%`,
      `${formatNumber(relative)} percentage points and ${formatNumber(points)}%`,
      `${formatNumber(Math.max(0, points - pointDelta))} percentage points and ${formatNumber(relative + 5)}%`,
    ];
  }

  return [
    `${formatNumber(points + pointDelta)} percentage points`,
    `${formatNumber(Math.max(0, points - pointDelta))} percentage points`,
    `${formatNumber(points)}%`,
  ];
}

function numericTextDistractors(value: string) {
  const match = value.match(/(?<amount>-?[\d,]+(?:\.\d+)?)/);
  if (!match?.groups) return [];
  const amountText = match.groups.amount;
  const amount = Number(amountText.replace(/,/g, ""));
  if (!Number.isFinite(amount)) return [];
  const precision = inferOptionPrecision(amountText);
  const delta =
    Math.abs(amount) >= 1000
      ? 500
      : Math.abs(amount) >= 100
        ? 50
        : Math.abs(amount) >= 10
          ? 5
          : 1;

  return [amount + delta, Math.max(0, amount - delta), amount * 2]
    .filter((candidate) => Number.isFinite(candidate) && candidate !== amount)
    .map((candidate) =>
      value.replace(amountText, formatNumber(candidate, precision)),
    );
}

function symbolicDistractors(
  answer: Extract<QuantV4CanonicalAnswer, { kind: "symbolic" }>,
  context?: QuantV4OptionGenerationContext,
) {
  const derived = inferSimpleCanonicalDistractorBase(answer);
  if (derived) {
    if (
      derived.kind === "integer" ||
      derived.kind === "decimal" ||
      derived.kind === "percentage" ||
      derived.kind === "currency" ||
      derived.kind === "unit"
    ) {
      return numericDistractors(derived, answer, context);
    }
    if (derived.kind === "fraction") {
      return fractionDistractors(derived, answer);
    }
  }

  const value = answer.display ?? answer.value;
  if (!value) return ["0", "1", "2"];

  const percentagePointOptions = percentagePointDistractors(value);
  if (percentagePointOptions.length) {
    return percentagePointOptions;
  }

  const quantitativeComparison = value.match(
    /^(?<subject>.+?) is (?<direction>greater|less) by (?<prefix>Rs\.\s*)?(?<amount>[\d,]+(?:\.\d+)?)(?<suffix>.*)$/i,
  );
  if (quantitativeComparison?.groups) {
    const amount = Number(
      quantitativeComparison.groups.amount.replace(/,/g, ""),
    );
    const precision = inferOptionPrecision(
      quantitativeComparison.groups.amount,
    );
    const delta =
      amount >= 1000
        ? 500
        : amount >= 100
          ? 50
          : amount >= 10
            ? 5
            : 1;
    const renderAmount = (candidate: number) =>
      `${quantitativeComparison.groups.prefix ?? ""}${formatNumber(candidate, precision)}${quantitativeComparison.groups.suffix}`;
    return [
      `${quantitativeComparison.groups.subject} is ${quantitativeComparison.groups.direction === "greater" ? "less" : "greater"} by ${renderAmount(amount)}`,
      `${quantitativeComparison.groups.subject} is ${quantitativeComparison.groups.direction} by ${renderAmount(amount + delta)}`,
      `${quantitativeComparison.groups.subject} is ${quantitativeComparison.groups.direction} by ${renderAmount(Math.max(0, amount - delta))}`,
    ];
  }

  const percentageComparison = value.match(
    /^(?<left>.+?) is (?<amount>[\d,]+(?:\.\d+)?)% (?<direction>more|less) than (?<right>.+?)(?<suffix>\.?)$/i,
  );
  if (percentageComparison?.groups) {
    const amount = Number(
      percentageComparison.groups.amount.replace(/,/g, ""),
    );
    const precision = inferOptionPrecision(
      percentageComparison.groups.amount,
    );
    const delta = amount >= 10 ? 5 : 1;
    const renderAmount = (candidate: number) =>
      `${formatNumber(candidate, precision)}%`;
    return [
      `${percentageComparison.groups.left} is ${renderAmount(amount)} ${percentageComparison.groups.direction === "more" ? "less" : "more"} than ${percentageComparison.groups.right}${percentageComparison.groups.suffix ?? ""}`,
      `${percentageComparison.groups.left} is ${renderAmount(amount + delta)} ${percentageComparison.groups.direction} than ${percentageComparison.groups.right}${percentageComparison.groups.suffix ?? ""}`,
      `${percentageComparison.groups.left} is ${renderAmount(Math.max(0, amount - delta))} ${percentageComparison.groups.direction} than ${percentageComparison.groups.right}${percentageComparison.groups.suffix ?? ""}`,
    ];
  }

  const equalityComparison = value.match(
    /^(?<left>.+?) and (?<right>.+?) are equal\.?$/i,
  );
  if (equalityComparison?.groups) {
    return [
      `${equalityComparison.groups.left} is 10% more than ${equalityComparison.groups.right}.`,
      `${equalityComparison.groups.left} is 10% less than ${equalityComparison.groups.right}.`,
      `${equalityComparison.groups.right} is greater than ${equalityComparison.groups.left}.`,
    ];
  }

  const numericTextOptions = numericTextDistractors(value);
  if (numericTextOptions.length) {
    return numericTextOptions;
  }

  return ["Cannot be determined", "Both are equal", "None of these"];
}

function distractorsFor(
  answer: QuantV4CanonicalAnswer,
  context?: QuantV4OptionGenerationContext,
) {
  switch (answer.kind) {
    case "integer":
    case "decimal":
    case "percentage":
    case "currency":
    case "unit":
      return numericDistractors(answer, answer, context);
    case "fraction":
      return fractionDistractors(answer);
    case "ratio":
      return ratioDistractors(answer);
    case "symbolic":
      return symbolicDistractors(answer, context);
  }
}

function fallbackOptionsFor(
  answer: QuantV4CanonicalAnswer,
  offset: number,
  context?: QuantV4OptionGenerationContext,
) {
  if (
    answer.kind === "integer" ||
    answer.kind === "decimal" ||
    answer.kind === "percentage" ||
    answer.kind === "currency" ||
    answer.kind === "unit"
  ) {
    const signedOffsets = [offset, -offset, offset + 1, -(offset + 1)];
    return signedOffsets.map((candidateOffset) => {
      let fallbackValue = answer.value + candidateOffset;
      if (
        answer.kind === "percentage" &&
        isBoundedPercentageContext(context) &&
        !isReverseComparisonContext(context)
      ) {
        fallbackValue = Math.max(0, Math.min(100, fallbackValue));
      }
      if (isCountLikeContext(context) || answer.kind === "integer") {
        fallbackValue = Math.max(0, Math.round(fallbackValue));
      }
      return formatLike(answer, fallbackValue);
    });
  }

  const rendered = renderQuantV4Answer(answer);
  const numericTextOptions = numericTextDistractors(rendered);
  if (numericTextOptions.length) {
    return numericTextOptions;
  }

  return [
    "Cannot be determined",
    "Both are equal",
    "None of these",
    "Insufficient information",
  ];
}

function correctIndexFromCanonical(options: readonly string[], canonicalAnswer: QuantV4CanonicalAnswer) {
  const canonicalKey = getComparableAnswerKey(canonicalAnswer);
  const rendered = renderQuantV4Answer(canonicalAnswer).trim();
  const display = (canonicalAnswer.display ?? rendered).trim();
  const exact = options.findIndex((option) => option.trim() === rendered || option.trim() === display);
  if (exact >= 0) return exact;

  return options.findIndex((option) => {
    try {
      return getComparableAnswerKey(option as QuantV4AnswerLike) === canonicalKey;
    } catch {
      return false;
    }
  });
}

export function buildQuantV4AnswerOptions(
  answer: QuantV4AnswerLike,
  input: QuantV4OptionGenerationInput = {},
): QuantV4OptionGenerationResult {
  const canonicalAnswer = normalizeQuantV4Answer(answer);
  const desiredCount = Math.max(2, Math.floor(input.optionCount ?? 4));
  const seed = input.seed ?? renderQuantV4Answer(canonicalAnswer) ?? "quant-v4";
  const existingOptions = Array.isArray(input.existingOptions)
    ? input.existingOptions.map((option) => String(option ?? "").trim()).filter(Boolean)
    : [];
  const filteredExistingOptions = existingOptions.filter(
    (option) => !isWeakGeneratedOption(option, canonicalAnswer, input.context),
  );

  if (filteredExistingOptions.length >= desiredCount) {
    const options: string[] = [];
    for (const option of filteredExistingOptions) addUnique(options, option);
    const deduped = options.slice(0, desiredCount);
    const existingCorrect = correctIndexFromCanonical(deduped, canonicalAnswer);
    if (existingCorrect >= 0) {
      return { options: deduped, correct: existingCorrect, canonicalAnswer };
    }
  }

  const generated: string[] = [];
  addUnique(generated, renderQuantV4Answer(canonicalAnswer));
  for (const option of filteredExistingOptions) addUnique(generated, option);
  for (const option of distractorsFor(canonicalAnswer, input.context)) {
    if (!isWeakGeneratedOption(option, canonicalAnswer, input.context)) {
      addUnique(generated, option);
    }
  }

  let fallbackOffset = 1;
  let fallbackGuard = 0;
  while (generated.length < desiredCount && fallbackGuard < desiredCount * 24) {
    for (const option of fallbackOptionsFor(canonicalAnswer, fallbackOffset, input.context)) {
      if (!isWeakGeneratedOption(option, canonicalAnswer, input.context)) {
        addUnique(generated, option);
      }
      if (generated.length >= desiredCount) break;
    }
    fallbackOffset++;
    fallbackGuard++;
  }

  for (const option of [
    "Cannot be determined",
    "Both are equal",
    "None of these",
    "Insufficient information",
  ]) {
    if (generated.length >= desiredCount) break;
    addUnique(generated, option);
  }

  const shuffled = shuffleDeterministically(generated.slice(0, desiredCount), seed);
  const correct = correctIndexFromCanonical(shuffled, canonicalAnswer);
  if (correct < 0) {
    throw new Error(`Canonical answer was lost while building options: ${renderQuantV4Answer(canonicalAnswer)}`);
  }
  if (shuffled.filter((option) => correctIndexFromCanonical([option], canonicalAnswer) === 0).length !== 1) {
    throw new Error(`Canonical answer must appear exactly once in generated options: ${renderQuantV4Answer(canonicalAnswer)}`);
  }
  return { options: shuffled, correct, canonicalAnswer };
}

export { renderQuantV4Answer } from "./answer-contract";
