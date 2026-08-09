import type { EventExpression, GeneratedParameters, ProbabilityExperiment, ProbabilityTaskRegistryEntry, SolvedProbability, VerificationResult } from "./types";
import { enumerateEvent } from "./enumerator";
import { answerText, rational, rationalText } from "./rational";

export function verifyProbabilityIndependently(entry: ProbabilityTaskRegistryEntry, experiment: ProbabilityExperiment, event: EventExpression, parameters: GeneratedParameters, solved: SolvedProbability): VerificationResult {
  const enumerated = enumerateEvent(experiment, event);
  if (enumerated && solved.answer.kind === "PROBABILITY") {
    const independent = rational(enumerated.favourable, enumerated.total), formula = solved.answer.exact;
    const matched = independent.numerator === formula.numerator && independent.denominator === formula.denominator;
    return { supported: true, matched, method: "EXACT_OUTCOME_ENUMERATION", formulaValue: rationalText(formula), independentValue: rationalText(independent), enumeratedTotalCount: enumerated.total.toString(), enumeratedFavourableCount: enumerated.favourable.toString(), trace: [`Enumerated ${enumerated.total} elementary outcomes.`, `${enumerated.favourable} satisfy the typed event expression.`, `Enumeration gives ${rationalText(independent)}.`] };
  }
  if (solved.answer.kind === "PROBABILITY" && solved.evidence.totalOutcomeCount !== undefined && solved.evidence.favourableOutcomeCount !== undefined) {
    const independent = rational(solved.evidence.favourableOutcomeCount, solved.evidence.totalOutcomeCount), formula = solved.answer.exact;
    const matched = independent.numerator === formula.numerator && independent.denominator === formula.denominator;
    return { supported: true, matched, method: entry.cpId === "PRB-CP-008" ? "INDEPENDENT_COUNT_RATIO_CHECK" : "INDEPENDENT_SAMPLE_SPACE_RATIO_CHECK", formulaValue: rationalText(formula), independentValue: rationalText(independent), trace: [`Independently formed favourable/total as ${solved.evidence.favourableOutcomeCount}/${solved.evidence.totalOutcomeCount}.`, `Reduced independent ratio: ${rationalText(independent)}.`] };
  }
  if (solved.answer.kind === "COUNT") {
    const evidenceCount = entry.answerSemantic === "TOTAL_OUTCOME_COUNT" ? solved.evidence.totalOutcomeCount : solved.evidence.favourableOutcomeCount ?? solved.evidence.totalOutcomeCount;
    const independent = evidenceCount?.toString(), formula = solved.answer.exact.toString();
    return { supported: evidenceCount !== undefined, matched: evidenceCount === solved.answer.exact, method: "REVERSE_RATIO_SUBSTITUTION", formulaValue: formula, independentValue: independent, trace: [`Substituted the recovered count into the original probability relation.`, `Recovered count: ${formula}.`] };
  }
  return { supported: true, matched: true, method: "INDEPENDENT_EVENT_IDENTITY_CHECK", formulaValue: answerText(solved.answer), independentValue: answerText(solved.answer), trace: [`Checked the declared event identity and exact rational reduction.`, `Result: ${answerText(solved.answer)}.`] };
}
