import type { SapCp002ExamReadinessV3Package, SapCp002V3Option } from "../exam-readiness-v3/types";
import {
  type ExprNode,
  type Rat,
  add,
  divide,
  equalRat,
  extractExpression,
  formatRat,
  multiply,
  parseExpression,
  parseRat,
  rat,
  reciprocal,
  solveNode,
  subtract,
  visibleOperands,
} from "../exam-readiness-v3/exact";
import { normalizeMathDisplay, normalizeStudentStem } from "./pedagogy";
import type { SapCp002V4Option } from "./types";

interface Draft extends Omit<SapCp002V4Option, "displayIndex"> {}

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function displayRat(value: Rat): string {
  return formatRat(value);
}

function correctDraft(answer: string, visible: readonly string[], analysis: string): Draft {
  return Object.freeze({
    value: answer,
    semanticValue: answer,
    misconceptionId: null,
    analysis,
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
    isCorrect: true,
    numericEquivalenceToCorrect: true,
    satisfiesRequiredForm: true,
  });
}

function wrongDraft(
  value: string,
  misconceptionId: string,
  analysis: string,
  visible: readonly string[],
  numericEquivalenceToCorrect = false,
): Draft {
  return Object.freeze({
    value: normalizeMathDisplay(value),
    semanticValue: normalizeMathDisplay(value),
    misconceptionId,
    analysis: normalizeMathDisplay(analysis),
    routeOperands: visible,
    reproducibleFromVisibleStem: true,
    isCorrect: false,
    numericEquivalenceToCorrect,
    satisfiesRequiredForm: false,
  });
}

function uniqueWrongs(correct: Rat | null, candidates: readonly Draft[], visible: readonly string[]): readonly Draft[] {
  const output: Draft[] = [];
  const used = new Set<string>();
  if (correct) used.add(displayRat(correct));
  for (const candidate of candidates) {
    const value = normalizeMathDisplay(candidate.value);
    const parsed = parseRat(value);
    if (used.has(value)) continue;
    if (correct && parsed && equalRat(parsed, correct)) continue;
    used.add(value);
    output.push(Object.freeze({ ...candidate, value, semanticValue: candidate.semanticValue || value }));
    if (output.length === 3) return Object.freeze(output);
  }
  let delta = 1n;
  while (output.length < 3 && correct) {
    const fallback = rat(correct.n + delta, correct.d);
    delta += 1n;
    const value = displayRat(fallback);
    if (used.has(value) || equalRat(fallback, correct)) continue;
    used.add(value);
    output.push(wrongDraft(
      value,
      "FINAL_NUMERATOR_ARITHMETIC_SLIP",
      `After the correct setup, the final numerator was written as ${fallback.n.toString()} instead of ${correct.n.toString()}.`,
      visible,
    ));
  }
  if (output.length !== 3) throw new Error("V4 could not build three unique distractors.");
  return Object.freeze(output);
}

function binaryAst(stem: string): ExprNode | null {
  const expression = extractExpression(stem);
  return parseExpression(expression);
}

function ql017Drafts(pkg: SapCp002ExamReadinessV3Package, stem: string, answer: string): readonly Draft[] {
  const ast = binaryAst(stem);
  const correct = parseRat(answer);
  const visible = visibleOperands(stem);
  if (!ast || ast.kind !== "BINARY" || (ast.op !== "+" && ast.op !== "-") || !correct) {
    return normalizedBaseDrafts(pkg, answer, visible);
  }
  const left = solveNode(ast.left).value;
  const right = solveNode(ast.right).value;
  const sign = ast.op === "+" ? 1n : -1n;
  const candidates: Draft[] = [];
  const directDenominator = left.d + right.d;
  if (directDenominator !== 0n) {
    candidates.push(wrongDraft(
      displayRat(rat(left.n + sign * right.n, directDenominator)),
      "DIRECT_NUMERATOR_DENOMINATOR_COMBINATION",
      "The numerators and denominators were combined directly instead of first forming equivalent fractions.",
      visible,
    ));
  }
  candidates.push(wrongDraft(
    displayRat(rat(left.n + sign * right.n, left.d * right.d)),
    "PRODUCT_DENOMINATOR_WITHOUT_CROSS_SCALING",
    "The product denominator was used, but the numerators were not cross-scaled to that denominator.",
    visible,
  ));
  if (ast.op === "-") {
    candidates.push(wrongDraft(
      displayRat(add(left, right)),
      "SUBTRACTION_READ_AS_ADDITION",
      `The subtraction sign was read as addition, giving ${displayRat(left)} + ${displayRat(right)}.`,
      visible,
    ));
  } else {
    candidates.push(wrongDraft(
      displayRat(subtract(left, right)),
      "ADDITION_READ_AS_SUBTRACTION",
      `The addition sign was read as subtraction, giving ${displayRat(left)} − ${displayRat(right)}.`,
      visible,
    ));
  }
  candidates.push(wrongDraft(
    displayRat(left),
    "SECOND_FRACTION_OMITTED",
    `The second visible fraction ${displayRat(right)} was omitted, leaving only ${displayRat(left)}.`,
    visible,
  ));
  if (correct.n !== 0n) {
    candidates.push(wrongDraft(
      displayRat(rat(-correct.n, correct.d)),
      "FINAL_SIGN_REVERSED",
      "The correct magnitude was obtained, but the final sign was reversed.",
      visible,
    ));
  }
  return Object.freeze([
    correctDraft(answer, visible, "This is the exact result of the displayed addition or subtraction and is in lowest terms."),
    ...uniqueWrongs(correct, candidates, visible),
  ]);
}

function ql018Drafts(pkg: SapCp002ExamReadinessV3Package, stem: string, answer: string): readonly Draft[] {
  const ast = binaryAst(stem);
  const correct = parseRat(answer);
  const visible = visibleOperands(stem);
  if (!ast || ast.kind !== "BINARY" || ast.op !== "*" || !correct) {
    return normalizedBaseDrafts(pkg, answer, visible);
  }
  const left = solveNode(ast.left).value;
  const right = solveNode(ast.right).value;
  const numeratorProduct = left.n * right.n;
  const candidates = [
    wrongDraft(
      displayRat(left),
      "SECOND_FACTOR_OMITTED",
      `The second factor ${displayRat(right)} was omitted, so only ${displayRat(left)} was reported.`,
      visible,
    ),
    wrongDraft(
      displayRat(rat(numeratorProduct, left.d)),
      "SECOND_DENOMINATOR_OMITTED",
      `The numerators were multiplied, but the denominator ${right.d.toString()} from the second factor was omitted.`,
      visible,
    ),
    wrongDraft(
      displayRat(rat(numeratorProduct, right.d)),
      "FIRST_DENOMINATOR_OMITTED",
      `The numerators were multiplied, but the denominator ${left.d.toString()} from the first factor was omitted.`,
      visible,
    ),
    wrongDraft(
      displayRat(rat(left.n + right.n, left.d + right.d)),
      "FACTORS_COMBINED_AS_FRACTION_SUM",
      "The two factors were combined by adding numerators and denominators instead of multiplying.",
      visible,
    ),
  ];
  return Object.freeze([
    correctDraft(answer, visible, "This follows from valid cross-cancellation and exact multiplication of the remaining factors."),
    ...uniqueWrongs(correct, candidates, visible),
  ]);
}

function parseSimpleEquality(stem: string): { readonly left: string; readonly right: Rat } | null {
  const match = stem.match(/([^:?]+(?:□|\d)[^=]*)=\s*([^?.]+)/);
  if (!match) return null;
  const right = parseRat(match[2]!.trim());
  return right ? Object.freeze({ left: match[1]!.trim(), right }) : null;
}

function ql029Drafts(pkg: SapCp002ExamReadinessV3Package, stem: string, answer: string): readonly Draft[] {
  const equality = parseSimpleEquality(stem);
  const correct = parseRat(answer);
  const visible = visibleOperands(stem);
  if (!equality || !correct) return normalizedBaseDrafts(pkg, answer, visible);
  const numeratorMatch = equality.left.match(/^□\/(\d+)\s*\+\s*([−-]?\d+\/\d+)$/);
  const denominatorMatch = equality.left.match(/^(\d+)\/□\s*\+\s*([−-]?\d+\/\d+)$/);
  const candidates: Draft[] = [];
  if (numeratorMatch) {
    const denominator = BigInt(numeratorMatch[1]!);
    const known = parseRat(numeratorMatch[2]!)!;
    const residual = subtract(equality.right, known);
    const wrongSum = multiply(add(equality.right, known), rat(denominator));
    candidates.push(
      wrongDraft(displayRat(rat(residual.n)), "RESIDUAL_NUMERATOR_ONLY", `After isolating ${displayRat(residual)}, only its numerator was selected; the denominator factor ${denominator.toString()} was not applied.`, visible),
      wrongDraft(displayRat(wrongSum), "KNOWN_FRACTION_ADDED_INSTEAD_OF_SUBTRACTED", "The known fraction was added to the right-hand side instead of subtracted before recovering the numerator.", visible),
      wrongDraft(denominator.toString(), "VISIBLE_DENOMINATOR_SELECTED", "The visible denominator was copied as the missing numerator without solving the equality.", visible),
    );
  } else if (denominatorMatch) {
    const numerator = BigInt(denominatorMatch[1]!);
    const known = parseRat(denominatorMatch[2]!)!;
    const residual = subtract(equality.right, known);
    const multiplied = multiply(rat(numerator), residual);
    candidates.push(
      wrongDraft(displayRat(rat(residual.d)), "RESIDUAL_DENOMINATOR_COPIED", "The denominator of the isolated fraction was copied directly instead of solving numerator ÷ residual.", visible),
      wrongDraft(displayRat(multiplied), "MULTIPLIED_INSTEAD_OF_DIVIDED", `The visible numerator ${numerator.toString()} was multiplied by the isolated fraction instead of divided by it.`, visible),
      wrongDraft(displayRat(rat(correct.n + 1n)), "FINAL_INTEGER_ARITHMETIC_SLIP", `The denominator was isolated correctly, but the final integer was recorded as ${correct.n + 1n} instead of ${correct.n}.`, visible),
    );
  }
  if (candidates.length === 0) return normalizedBaseDrafts(pkg, answer, visible);
  return Object.freeze([
    correctDraft(answer, visible, "Substitution of this integer makes the displayed fraction equality exact."),
    ...uniqueWrongs(correct, candidates, visible),
  ]);
}

function ql030Drafts(pkg: SapCp002ExamReadinessV3Package, stem: string, answer: string): readonly Draft[] {
  const equality = parseSimpleEquality(stem);
  const correct = parseRat(answer);
  const visible = visibleOperands(stem);
  if (!equality || !correct) return normalizedBaseDrafts(pkg, answer, visible);
  const match = equality.left.match(/^([−-]?\d+\/\d+)\s*([+−-])\s*□$/);
  if (!match) return normalizedBaseDrafts(pkg, answer, visible);
  const known = parseRat(match[1]!)!;
  const operator = match[2]!.replace("−", "-");
  const wrongSign = operator === "+" ? subtract(known, equality.right) : subtract(equality.right, known);
  const wrongSum = add(known, equality.right);
  const candidates: Draft[] = [
    wrongDraft(displayRat(wrongSign), "INVERSE_OPERATION_DIRECTION_REVERSED", "The terms were subtracted in the reverse order while isolating the missing fraction.", visible),
    wrongDraft(displayRat(wrongSum), "INVERSE_OPERATION_REPLACED_BY_ADDITION", "The two visible sides were added instead of applying the required inverse operation.", visible),
  ];
  if (correct.n !== 0n) {
    candidates.push(wrongDraft(displayRat(reciprocal(correct)), "RECIPROCAL_OF_ISOLATED_VALUE", "The reciprocal of the isolated missing fraction was selected.", visible));
  }
  candidates.push(wrongDraft(displayRat(rat(correct.n + 1n, correct.d)), "FINAL_NUMERATOR_ARITHMETIC_SLIP", "The blank was isolated, but the final numerator was recorded one unit too large.", visible));
  return Object.freeze([
    correctDraft(answer, visible, "Substitution of this fraction makes the displayed equality exact."),
    ...uniqueWrongs(correct, candidates, visible),
  ]);
}

function ql032Drafts(pkg: SapCp002ExamReadinessV3Package, stem: string, answer: string): readonly Draft[] {
  const visible = visibleOperands(stem);
  const correct = parseRat(answer);
  if (!correct) return normalizedBaseDrafts(pkg, answer, visible);
  let multiplier = 2n;
  const baseValues = new Set(pkg.options.map((option) => normalizeMathDisplay(option.value)));
  let unreduced = "";
  const unreducedText = (): string => {
    const sign = correct.n < 0n ? "−" : "";
    const numerator = correct.n < 0n ? -correct.n : correct.n;
    return `${sign}${(numerator * multiplier).toString()}/${(correct.d * multiplier).toString()}`;
  };
  unreduced = unreducedText();
  while (baseValues.has(unreduced) || unreduced === answer) {
    multiplier += 1n;
    unreduced = unreducedText();
  }
  const candidates = pkg.options
    .filter((option) => !option.isCorrect)
    .map((option) => wrongDraft(
      option.value,
      option.misconceptionId ?? "NON_EQUIVALENT_OPTION",
      option.analysis,
      visible,
      false,
    ));
  const unreducedDraft = wrongDraft(
    unreduced,
    "EQUIVALENT_NOT_LOWEST_TERMS",
    `${unreduced} has the correct numerical value, but its numerator and denominator still share the factor ${multiplier.toString()}.`,
    visible,
    true,
  );
  const wrongs = uniqueWrongs(correct, [unreducedDraft, ...candidates], visible);
  return Object.freeze([
    correctDraft(answer, visible, "This option is numerically equivalent to the expression and its numerator and denominator are coprime."),
    ...wrongs,
  ]);
}

function normalizedBaseDrafts(pkg: SapCp002ExamReadinessV3Package, answer: string, visible: readonly string[]): readonly Draft[] {
  return Object.freeze(pkg.options.map((option) => {
    const { displayIndex: _displayIndex, ...rest } = option;
    return Object.freeze({
      ...rest,
      value: option.isCorrect ? answer : normalizeMathDisplay(option.value),
      semanticValue: option.isCorrect ? answer : normalizeMathDisplay(option.semanticValue),
      routeOperands: option.routeOperands.length ? option.routeOperands : visible,
    }) as Draft;
  }));
}

export function buildOptionDraftsV4(
  pkg: SapCp002ExamReadinessV3Package,
  stem: string,
  answer: string,
): readonly Draft[] {
  switch (pkg.permanentQlId) {
    case "SAP-QL-017": return ql017Drafts(pkg, stem, answer);
    case "SAP-QL-018": return ql018Drafts(pkg, stem, answer);
    case "SAP-QL-029": return ql029Drafts(pkg, stem, answer);
    case "SAP-QL-030": return ql030Drafts(pkg, stem, answer);
    case "SAP-QL-032": return ql032Drafts(pkg, stem, answer);
    default: return normalizedBaseDrafts(pkg, answer, visibleOperands(stem));
  }
}

const positionCache = new Map<string, number>();

function desiredCorrectIndex(pkg: SapCp002ExamReadinessV3Package, seed: number): number {
  const group = `${pkg.permanentQlId}|${pkg.temporaryPrototypeId}`;
  const cacheKey = `${group}|${seed}`;
  const cached = positionCache.get(cacheKey);
  if (cached !== undefined) return cached;
  let position = hash32(`${group}|${seed}|SAP_CP002_OPTION_ORDER_V4`) % 4;
  if (seed >= 4) {
    const previous = [1, 2, 3].map((offset) => desiredCorrectIndex(pkg, seed - offset));
    if (previous.every((value) => value === position)) {
      position = (position + 1 + (hash32(`${group}|${seed}|break-run`) % 3)) % 4;
    }
  }
  positionCache.set(cacheKey, position);
  return position;
}

export function orderOptionsV4(
  pkg: SapCp002ExamReadinessV3Package,
  drafts: readonly Draft[],
): readonly SapCp002V4Option[] {
  const correct = drafts.find((option) => option.isCorrect);
  const wrongs = drafts.filter((option) => !option.isCorrect);
  if (!correct || wrongs.length !== 3) throw new Error(`${pkg.permanentQlId}/${pkg.seed}: V4 option construction failed.`);
  const wrongOffset = hash32(`${pkg.canonicalPayloadKey}|${pkg.seed}|wrong-order`) % wrongs.length;
  const rotatedWrongs = wrongs.map((_, index) => wrongs[(index + wrongOffset) % wrongs.length]!);
  const correctIndex = desiredCorrectIndex(pkg, pkg.seed);
  const ordered: Draft[] = [];
  let wrongCursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) ordered.push(correct);
    else ordered.push(rotatedWrongs[wrongCursor++]!);
  }
  return Object.freeze(ordered.map((option, index) => Object.freeze({
    ...option,
    displayIndex: index + 1,
  })));
}

export function normalizedAnswerV4(pkg: SapCp002ExamReadinessV3Package): string {
  return normalizeMathDisplay(pkg.canonicalAnswer);
}

export function normalizedStemV4(pkg: SapCp002ExamReadinessV3Package): string {
  return normalizeStudentStem(pkg.stem);
}
