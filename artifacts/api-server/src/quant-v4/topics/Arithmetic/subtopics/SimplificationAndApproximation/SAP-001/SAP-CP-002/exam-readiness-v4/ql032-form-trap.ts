import type { SapCp002ExamReadinessV3Package } from "../exam-readiness-v3/types";
import type { SapCp002V4Option } from "./types";

export type SapCp002V4OptionDraft = Omit<SapCp002V4Option, "displayIndex">;

function parseValue(value: string): { readonly numerator: bigint; readonly denominator: bigint } {
  const normalized = value.replace(/−/g, "-").trim();
  const fraction = normalized.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) {
    return Object.freeze({
      numerator: BigInt(fraction[1]!),
      denominator: BigInt(fraction[2]!),
    });
  }
  if (/^-?\d+$/.test(normalized)) {
    return Object.freeze({ numerator: BigInt(normalized), denominator: 1n });
  }
  throw new Error(`QL-032 expected a rational answer, received ${value}.`);
}

function formatUnreduced(numerator: bigint, denominator: bigint): string {
  const sign = numerator < 0n ? "−" : "";
  const magnitude = numerator < 0n ? -numerator : numerator;
  return `${sign}${magnitude.toString()}/${denominator.toString()}`;
}

export function enforceQl032FormTrap(
  pkg: SapCp002ExamReadinessV3Package,
  answer: string,
  drafts: readonly SapCp002V4OptionDraft[],
): readonly SapCp002V4OptionDraft[] {
  if (pkg.permanentQlId !== "SAP-QL-032") return drafts;
  const correct = drafts.find((option) => option.isCorrect);
  if (!correct) throw new Error(`${pkg.permanentQlId}/${pkg.seed}: missing correct QL-032 option.`);
  const nonEquivalent = drafts.filter((option) => !option.isCorrect && !option.numericEquivalenceToCorrect);
  if (nonEquivalent.length < 2) {
    throw new Error(`${pkg.permanentQlId}/${pkg.seed}: QL-032 needs two non-equivalent distractors.`);
  }

  const exact = parseValue(answer);
  const existing = new Set(drafts.map((option) => option.value));
  let multiplier = 2n;
  let unreduced = formatUnreduced(exact.numerator * multiplier, exact.denominator * multiplier);
  while (existing.has(unreduced) || unreduced === answer) {
    multiplier += 1n;
    unreduced = formatUnreduced(exact.numerator * multiplier, exact.denominator * multiplier);
  }

  const trap: SapCp002V4OptionDraft = Object.freeze({
    value: unreduced,
    semanticValue: answer,
    misconceptionId: "EQUIVALENT_NOT_LOWEST_TERMS",
    analysis: `${unreduced} has the correct numerical value, but ${multiplier.toString()} divides both its numerator and denominator, so it is not in lowest terms.`,
    routeOperands: correct.routeOperands,
    reproducibleFromVisibleStem: true,
    isCorrect: false,
    numericEquivalenceToCorrect: true,
    satisfiesRequiredForm: false,
  });

  return Object.freeze([
    correct,
    trap,
    nonEquivalent[0]!,
    nonEquivalent[1]!,
  ]);
}
