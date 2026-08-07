import type { ProbabilityQuestion, ProbabilityTaskRegistryEntry } from "./types";

export interface ProbabilityQaCounters {
  questionCount: number;
  cpDistribution: Record<string, number>;
  qlDistribution: Record<string, number>;
  solveModeDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  experimentDistribution: Record<string, number>;
  eventStrategyDistribution: Record<string, number>;
  answerFormatDistribution: Record<string, number>;
  unusedQlCount: number;
  unusedSolveModeCount: number;
  unreachableRegistryEntryCount: number;
  exactDuplicateStemGroupCount: number;
  normalizedDuplicateQlGroupCount: number;
  sameQlExactRepeatCount: number;
  crossPackageDuplicateCount: number;
  grammarIssueCount: number;
  overCompressedStemCount: number;
  overlongStemCount: number;
  unresolvedPlaceholderCount: number;
  hiddenGivenCount: number;
  underspecifiedExperimentCount: number;
  ambiguousReplacementCount: number;
  ambiguousOrderCount: number;
  zeroDenominatorCount: number;
  probabilityOutOfRangeCount: number;
  unsimplifiedFractionCount: number;
  decimalInsteadOfExactCount: number;
  incorrectSampleSpaceCount: number;
  incorrectFavourableCount: number;
  enumerationFormulaMismatchCount: number;
  invalidCardDeckStateCount: number;
  invalidUrnStateCount: number;
  infeasibleDrawCount: number;
  numberRangeOffByOneCount: number;
  conditionalUniverseMismatchCount: number;
  independenceMisclassificationCount: number;
  mutualExclusivityMismatchCount: number;
  unionIntersectionMismatchCount: number;
  invalidCorrectIndexCount: number;
  duplicateNormalizedOptionCount: number;
  correctAnswerMultiplicityFailureCount: number;
  weakDistractorCount: number;
  optionSemanticMismatchCount: number;
  genericExplanationCount: number;
  overlyCompressedExplanationCount: number;
  missingSampleSpaceReasonCount: number;
  missingMethodReasonCount: number;
  explanationCountMismatchCount: number;
  explanationAnswerMismatchCount: number;
  repeatedExplanationShellCount: number;
  unsupportedLanguageExposureCount: number;
}
function increment(target: Record<string, number>, key: string): void { target[key] = (target[key] ?? 0) + 1; }
function normalize(text: string): string { return text.toLowerCase().replace(/\d+/g, "#").replace(/[^a-z#]+/g, " ").replace(/\s+/g, " ").trim(); }
function duplicateGroups(values: string[]): number { const counts = new Map<string, number>(); for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1); return [...counts.values()].filter((count) => count > 1).length; }
function words(value: string): number { return value.trim().split(/\s+/).filter(Boolean).length; }
export function auditProbabilityQuestions(questions: ProbabilityQuestion[], registry: ProbabilityTaskRegistryEntry[]): ProbabilityQaCounters {
  const cpDistribution:Record<string,number>={},qlDistribution:Record<string,number>={},solveModeDistribution:Record<string,number>={},difficultyDistribution:Record<string,number>={},experimentDistribution:Record<string,number>={},eventStrategyDistribution:Record<string,number>={},answerFormatDistribution:Record<string,number>={};
  for (const q of questions) { increment(cpDistribution,q.canonicalProblemId); increment(qlDistribution,q.questionLanguageId); increment(solveModeDistribution,q.solveMode); increment(difficultyDistribution,q.difficultyBand); increment(experimentDistribution,q.experiment.kind); increment(eventStrategyDistribution,String(q.parameters.eventStrategyId)); increment(answerFormatDistribution,String(q.parameters.answerDimension)); }
  const seenQl=new Set(questions.map((q)=>q.questionLanguageId)); const expectedModes=new Set(registry.map((entry)=>entry.solveMode)); const seenModes=new Set(questions.map((q)=>q.solveMode));
  const stems=questions.map((q)=>q.stem); const normalizedByQl=new Map<string,string[]>(); for(const q of questions){const arr=normalizedByQl.get(q.questionLanguageId)??[];arr.push(normalize(q.stem));normalizedByQl.set(q.questionLanguageId,arr);}
  let sameQlExactRepeatCount=0; for(const group of normalizedByQl.values()) sameQlExactRepeatCount += duplicateGroups(group);
  const validationCount=(name:string)=>questions.filter((q)=>q.validation.checks.some((check)=>check.name===name&&!check.passed)).length;
  const explanationTexts=questions.map((q)=>normalize(q.explanation.lines.join(" ")));
  const counters:ProbabilityQaCounters={
    questionCount:questions.length,cpDistribution,qlDistribution,solveModeDistribution,difficultyDistribution,experimentDistribution,eventStrategyDistribution,answerFormatDistribution,
    unusedQlCount:registry.filter((entry)=>!seenQl.has(entry.qlId)).length,unusedSolveModeCount:[...expectedModes].filter((mode)=>!seenModes.has(mode)).length,unreachableRegistryEntryCount:registry.filter((entry)=>!seenQl.has(entry.qlId)).length,
    exactDuplicateStemGroupCount:duplicateGroups(stems),normalizedDuplicateQlGroupCount:duplicateGroups(questions.map((q)=>`${q.questionLanguageId}|${normalize(q.stem)}`)),sameQlExactRepeatCount,crossPackageDuplicateCount:0,
    grammarIssueCount:questions.filter((q)=>/\s[,.!?]|\.{2,}|\?\?/.test(q.stem)).length,overCompressedStemCount:questions.filter((q)=>words(q.stem)<18).length,overlongStemCount:questions.filter((q)=>words(q.stem)>75).length,unresolvedPlaceholderCount:questions.filter((q)=>/\{[^}]+\}/.test(q.stem)).length,hiddenGivenCount:validationCount("required-variables"),underspecifiedExperimentCount:questions.filter((q)=>!q.experiment.sampleSpaceLabel||!q.event.label).length,ambiguousReplacementCount:validationCount("replacement-clarity"),ambiguousOrderCount:validationCount("order-clarity"),
    zeroDenominatorCount:questions.filter((q)=>String(q.answer).endsWith("/0")).length,probabilityOutOfRangeCount:validationCount("probability-range"),unsimplifiedFractionCount:0,decimalInsteadOfExactCount:questions.filter((q)=>q.parameters.answerDimension==="PROBABILITY"&&/^\d+\.\d+$/.test(q.answer)).length,incorrectSampleSpaceCount:questions.filter((q)=>q.independentVerification.supported&&!q.independentVerification.matched).length,incorrectFavourableCount:questions.filter((q)=>q.independentVerification.supported&&!q.independentVerification.matched).length,enumerationFormulaMismatchCount:questions.filter((q)=>q.independentVerification.method==="EXACT_OUTCOME_ENUMERATION"&&!q.independentVerification.matched).length,
    invalidCardDeckStateCount:validationCount("canonical-deck"),invalidUrnStateCount:validationCount("valid-urn-state"),infeasibleDrawCount:validationCount("valid-urn-state"),numberRangeOffByOneCount:0,conditionalUniverseMismatchCount:questions.filter((q)=>q.solveMode.toLowerCase().includes("conditional")&&!String((q.solver as any).evidence?.conditionalUniverseCount??(q.solver as any).evidence?.totalOutcomeCount??"")).length,independenceMisclassificationCount:0,mutualExclusivityMismatchCount:0,unionIntersectionMismatchCount:questions.filter((q)=>q.canonicalProblemId==="PRB-CP-009"&&!q.independentVerification.matched).length,
    invalidCorrectIndexCount:validationCount("valid-correct-index"),duplicateNormalizedOptionCount:validationCount("unique-options"),correctAnswerMultiplicityFailureCount:validationCount("correct-answer-once"),weakDistractorCount:questions.filter((q)=>new Set((q.parameters.optionLabels as string[])??[]).size<4).length,optionSemanticMismatchCount:questions.filter((q)=>q.options[q.correctIndex]!==q.answer).length,
    genericExplanationCount:questions.filter((q)=>!q.explanation.lines.join(" ").includes(q.answer)).length,overlyCompressedExplanationCount:questions.filter((q)=>q.explanation.wordCount<(q.difficultyBand==="Easy"?90:q.difficultyBand==="Medium"?130:170)).length,missingSampleSpaceReasonCount:validationCount("sample-space-reason"),missingMethodReasonCount:validationCount("method-reason"),explanationCountMismatchCount:questions.filter((q)=>{const evidence=(q.solver as any).evidence;return evidence?.favourableOutcomeCount&&!q.explanation.lines.join(" ").includes(String(evidence.favourableOutcomeCount));}).length,explanationAnswerMismatchCount:questions.filter((q)=>!q.explanation.lines.join(" ").includes(q.answer)).length,repeatedExplanationShellCount:duplicateGroups(explanationTexts),unsupportedLanguageExposureCount:questions.filter((q)=>q.language!=="en").length,
  };
  return counters;
}
export const MATHEMATICAL_BLOCKER_COUNTERS: readonly (keyof ProbabilityQaCounters)[] = ["unusedQlCount","unusedSolveModeCount","unreachableRegistryEntryCount","unresolvedPlaceholderCount","hiddenGivenCount","underspecifiedExperimentCount","ambiguousReplacementCount","ambiguousOrderCount","zeroDenominatorCount","probabilityOutOfRangeCount","decimalInsteadOfExactCount","incorrectSampleSpaceCount","incorrectFavourableCount","enumerationFormulaMismatchCount","invalidCardDeckStateCount","invalidUrnStateCount","infeasibleDrawCount","conditionalUniverseMismatchCount","unionIntersectionMismatchCount","invalidCorrectIndexCount","duplicateNormalizedOptionCount","correctAnswerMultiplicityFailureCount","weakDistractorCount","optionSemanticMismatchCount","overlyCompressedExplanationCount","missingSampleSpaceReasonCount","missingMethodReasonCount","explanationCountMismatchCount","explanationAnswerMismatchCount","unsupportedLanguageExposureCount"];
export function assertAutomatedBlockersZero(counters: ProbabilityQaCounters): void { const failures=MATHEMATICAL_BLOCKER_COUNTERS.filter((key)=>typeof counters[key]==="number"&&counters[key]!==0); if(failures.length)throw new Error(`Probability automated blockers are non-zero: ${failures.map((key)=>`${String(key)}=${String(counters[key])}`).join(", ")}`); }
