import {
  ZERO,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  normalizeRatio,
  rational,
  subtractRational,
} from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001Random } from "./random";
import type {
  Prt001PilotParameters,
  Prt001Solution,
  Prt001TaskAnswer,
  Rational,
} from "./types";

function positive(value: Rational): boolean {
  return compareRational(value, ZERO) > 0;
}

function formatCandidate(
  parameters: Prt001PilotParameters,
  value: Rational,
): string {
  return parameters.entry.answerType === "DURATION"
    ? formatPrt001Duration(value, parameters.language)
    : parameters.entry.answerType === "PERCENT"
      ? `${formatRational(value)}%`
      : formatPrt001Money(value);
}

function addRatioCandidate(
  candidates: Set<string>,
  values: readonly Rational[],
): void {
  if (values.some((value) => !positive(value))) return;
  candidates.add(normalizeRatio(values).join(":"));
}

function ratioOptions(
  parameters: Prt001PilotParameters,
  answer: Extract<Prt001TaskAnswer, { kind: "RATIO" }>,
): string[] {
  const candidates = new Set<string>([answer.display]);
  const reversed = [...answer.ratio].reverse().map((value) => rational(value));
  addRatioCandidate(candidates, reversed);
  const segments = parameters.state.partners.map(
    (partner) => partner.capitalSegments[0]!,
  );
  addRatioCandidate(
    candidates,
    segments.map((item) => item.capital),
  );
  addRatioCandidate(
    candidates,
    segments.map((item) => subtractRational(item.end, item.start)),
  );
  for (let index = 0; index < answer.ratio.length; index += 1) {
    addRatioCandidate(
      candidates,
      answer.ratio.map((value, itemIndex) =>
        rational(value + (itemIndex === index ? 1n : 0n)),
      ),
    );
  }
  return [...candidates].slice(0, 4);
}

function rationalOptions(
  parameters: Prt001PilotParameters,
  solution: Prt001Solution,
  answer: Extract<Prt001TaskAnswer, { kind: "RATIONAL" }>,
): string[] {
  const candidates = new Set<string>([answer.display]);
  const partners = parameters.state.partners;
  const [partnerA, partnerB] = partners;
  const [segmentA, segmentB] = partners.map(
    (partner) => partner.capitalSegments[0]!,
  );
  const durationA = subtractRational(segmentA!.end, segmentA!.start);
  const durationB = subtractRational(segmentB!.end, segmentB!.start);
  const targetIndex =
    parameters.targetPartnerId === partnerB!.partnerId ? 1 : 0;
  const targetCapital =
    targetIndex === 0 ? segmentA!.capital : segmentB!.capital;
  const otherCapital =
    targetIndex === 0 ? segmentB!.capital : segmentA!.capital;
  const targetDuration = targetIndex === 0 ? durationA : durationB;
  const otherDuration = targetIndex === 0 ? durationB : durationA;
  const gross = parameters.state.grossProfitOrLoss;

  const add = (value: Rational) => {
    if (positive(value)) candidates.add(formatCandidate(parameters, value));
  };

  if (
    parameters.entry.solveMode ===
      "findPartnerShareFromTotalProfitAndCapitals" ||
    parameters.entry.solveMode ===
      "findPartnerShareFromTotalProfitCapitalDuration"
  ) {
    add(divideRational(gross, rational(2)));
    add(solution.distributedShares[partners[1 - targetIndex]!.partnerId]!);
    add(
      multiplyRational(
        gross,
        divideRational(targetCapital, {
          numerator:
            targetCapital.numerator * otherCapital.denominator +
            otherCapital.numerator * targetCapital.denominator,
          denominator: targetCapital.denominator * otherCapital.denominator,
        }),
      ),
    );
    add(
      multiplyRational(
        gross,
        divideRational(targetDuration, {
          numerator:
            targetDuration.numerator * otherDuration.denominator +
            otherDuration.numerator * targetDuration.denominator,
          denominator: targetDuration.denominator * otherDuration.denominator,
        }),
      ),
    );
  } else if (
    parameters.entry.solveMode === "findTotalProfitFromPartnerShareAndCapitals"
  ) {
    const knownShare = solution.distributedShares[parameters.targetPartnerId!]!;
    const targetPart = solution.normalizedRatio[targetIndex]!;
    const otherPart = solution.normalizedRatio[1 - targetIndex]!;
    const totalParts = targetPart + otherPart;
    add(knownShare);
    add(subtractRational(gross, knownShare));
    add(multiplyRational(knownShare, rational(2)));
    add(
      divideRational(
        multiplyRational(knownShare, rational(totalParts)),
        rational(otherPart),
      ),
    );
  } else if (
    parameters.entry.solveMode ===
    "findProfitDifferenceFromTotalProfitAndCapitals"
  ) {
    add(divideRational(gross, rational(2)));
    add(solution.distributedShares[partnerA!.partnerId]!);
    add(solution.distributedShares[partnerB!.partnerId]!);
  } else if (
    parameters.entry.solveMode ===
    "findUnknownCapitalFromShareRatioAndDurations"
  ) {
    const contributionRatio = divideRational(
      solution.timeline.weights[0]!.effectiveCapital,
      solution.timeline.weights[1]!.effectiveCapital,
    );
    add(segmentB!.capital);
    add(multiplyRational(contributionRatio, segmentB!.capital));
    add(
      multiplyRational(segmentB!.capital, divideRational(durationA, durationB)),
    );
  } else if (
    parameters.entry.solveMode ===
    "findUnknownDurationFromShareRatioAndCapitals"
  ) {
    const contributionRatio = divideRational(
      solution.timeline.weights[0]!.effectiveCapital,
      solution.timeline.weights[1]!.effectiveCapital,
    );
    add(durationB);
    add(multiplyRational(contributionRatio, durationB));
    add(
      multiplyRational(
        durationB,
        divideRational(segmentA!.capital, segmentB!.capital),
      ),
    );
  }

  for (const factor of [
    rational(2),
    rational(1, 2),
    rational(3, 2),
    rational(3),
  ]) {
    add(multiplyRational(answer.exact, factor));
  }
  return [...candidates].slice(0, 4);
}

export function generatePrt001Options(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
  random: Prt001Random;
}): { options: string[]; correctIndex: number } {
  const candidates =
    input.answer.kind === "RATIO"
      ? ratioOptions(input.parameters, input.answer)
      : rationalOptions(input.parameters, input.solution, input.answer);
  if (candidates.length !== 4) {
    throw new Error(
      `could not generate four unique options for ${input.parameters.questionLanguageId}`,
    );
  }
  const options = input.random.shuffle(candidates);
  return { options, correctIndex: options.indexOf(input.answer.display) };
}
