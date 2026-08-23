import { evaluateAssumptionOracle } from "./oracle.ts";
import type { StaAnswerSet, StaCandidateAuthority, StaOracleResult, StaScenarioAuthority } from "./types.ts";
import { STA_SEMANTIC_EXTENSION_V3_BY_QL } from "./semantic-extension-v3-authorities.ts";
import type {
  StaExtensionLocale,
  StaExtensionOption,
  StaExtensionQlId,
  StaExtensionQuestion,
  StaExtensionRenderedCandidate,
  StaExtensionScenarioAuthority,
} from "./semantic-extension-v3-types.ts";

export const STA_SEMANTIC_EXTENSION_V3_VERSION = "SEMANTIC_EXTENSION_V3" as const;

export interface StaExtensionLocalizedRendering {
  readonly statementVariants: readonly [string, ...string[]];
  readonly candidateText: Readonly<Record<string, string>>;
  readonly rationale: Readonly<Record<string, string>>;
}

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createRng(seed: string): () => number {
  let state = hash32(seed) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function deterministicShuffle<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  const rng = createRng(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    const temp = output[index]!;
    output[index] = output[swapIndex]!;
    output[swapIndex] = temp;
  }
  return output;
}

function choose<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error(`${seed}: cannot choose from empty collection`);
  return values[hash32(seed) % values.length]!;
}

function oracleScenario(scenario: StaExtensionScenarioAuthority): StaScenarioAuthority {
  // The frozen oracle does not inspect qlId/checkpoint identity. This structural cast lets
  // the additive V3 extension reuse the immutable oracle without changing any frozen blob.
  return scenario as unknown as StaScenarioAuthority;
}

export function evaluateStaExtensionCandidate(
  scenario: StaExtensionScenarioAuthority,
  candidate: StaCandidateAuthority,
): StaOracleResult {
  return evaluateAssumptionOracle(oracleScenario(scenario), candidate);
}

export function assertStaExtensionScenarioOracleParity(scenario: StaExtensionScenarioAuthority): void {
  for (const candidate of scenario.candidates) {
    const oracle = evaluateStaExtensionCandidate(scenario, candidate);
    if (oracle.classification !== candidate.expectedClassification) {
      throw new Error(`${scenario.scenarioId}/${candidate.candidateId}: editorial=${candidate.expectedClassification} oracle=${oracle.classification} (${oracle.evidenceCode})`);
    }
  }
}

function roman(index: number): "I" | "II" | "III" {
  if (index === 0) return "I";
  if (index === 1) return "II";
  if (index === 2) return "III";
  throw new Error(`Unsupported extension candidate index ${index}`);
}

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function allAnswerSets(candidateCount: 2 | 3): StaAnswerSet[] {
  const output: number[][] = [];
  for (let mask = 0; mask < (1 << candidateCount); mask += 1) {
    const answer: number[] = [];
    for (let index = 0; index < candidateCount; index += 1) if ((mask & (1 << index)) !== 0) answer.push(index);
    output.push(answer);
  }
  return output;
}

function joinLabels(locale: StaExtensionLocale, labels: readonly string[]): string {
  if (labels.length <= 1) return labels[0] ?? "";
  const conjunction = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  if (labels.length === 2) return `${labels[0]}${conjunction}${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}${conjunction}${labels.at(-1)}`;
}

function displayAnswerSet(answer: StaAnswerSet, candidateCount: 2 | 3, locale: StaExtensionLocale): string {
  const labels = answer.map(roman);
  const allLabels = Array.from({ length: candidateCount }, (_, index) => roman(index));
  if (answer.length === 0) {
    const joined = joinLabels(locale, allLabels);
    if (locale === "hi-IN") return `${joined} में से कोई नहीं`;
    if (locale === "pa-IN") return `${joined} ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਨਹੀਂ`;
    return `None of ${joined}`;
  }
  if (answer.length === candidateCount) {
    const joined = joinLabels(locale, allLabels);
    if (locale === "hi-IN") return `${joined} सभी`;
    if (locale === "pa-IN") return `${joined} ਸਾਰੀਆਂ`;
    return `All ${joined}`;
  }
  const joined = joinLabels(locale, labels);
  if (locale === "hi-IN") return `केवल ${joined}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ${joined}`;
  return `Only ${joined}`;
}

function buildOptions(correct: StaAnswerSet, candidateCount: 2 | 3, locale: StaExtensionLocale, seed: string): StaExtensionQuestion["options"] {
  const distractors = deterministicShuffle(
    allAnswerSets(candidateCount).filter((set) => !sameAnswerSet(set, correct)),
    `${seed}:extension-option-distractors`,
  ).slice(0, 3);
  const sets = deterministicShuffle<StaAnswerSet>([correct, ...distractors], `${seed}:extension-option-order`);
  const options = sets.map((set) => ({
    display: displayAnswerSet(set, candidateCount, locale),
    semanticAnswerSet: [...set],
    isCorrect: sameAnswerSet(set, correct),
  } satisfies StaExtensionOption));
  if (options.length !== 4) throw new Error(`${seed}: extension requires four options`);
  return options as unknown as StaExtensionQuestion["options"];
}

function statementVariants(
  scenario: StaExtensionScenarioAuthority,
  rendering?: StaExtensionLocalizedRendering,
): readonly [string, ...string[]] {
  return rendering?.statementVariants ?? scenario.statementVariants;
}

function candidateText(
  candidate: StaCandidateAuthority,
  rendering?: StaExtensionLocalizedRendering,
): string {
  return rendering?.candidateText[candidate.candidateId] ?? candidate.textVariants[0]!;
}

function candidateRationale(
  candidate: StaCandidateAuthority,
  rendering?: StaExtensionLocalizedRendering,
): string {
  return rendering?.rationale[candidate.candidateId] ?? candidate.rationale;
}

function answerSetFor(
  scenario: StaExtensionScenarioAuthority,
  selected: readonly StaCandidateAuthority[],
): StaAnswerSet {
  const answer: number[] = [];
  selected.forEach((candidate, index) => {
    if (evaluateStaExtensionCandidate(scenario, candidate).classification === "IMPLICIT") answer.push(index);
  });
  return answer;
}

function explanationLead(qlId: StaExtensionQlId, locale: StaExtensionLocale): string {
  if (qlId === "STA-QL-005") {
    if (locale === "hi-IN") return "देखें कि संदेश जिस प्रतिक्रिया या रुचि पर निर्भर करता है, उसके लिए कौन-सी बातें वास्तव में माननी पड़ती हैं।";
    if (locale === "pa-IN") return "ਵੇਖੋ ਕਿ ਸੁਨੇਹੇ ਦੀ ਉਮੀਦ ਕੀਤੀ ਪ੍ਰਤੀਕਿਰਿਆ ਜਾਂ ਦਿਲਚਸਪੀ ਲਈ ਕਿਹੜੀਆਂ ਗੱਲਾਂ ਅਸਲ ਵਿੱਚ ਮੰਨਣੀਆਂ ਪੈਂਦੀਆਂ ਹਨ।";
    return "Check which assumptions are actually required for the persuasive message to have a relevant audience and possible response.";
  }
  if (locale === "hi-IN") return "देखें कि तुलना या प्रमाण से निकाले गए दावे के लिए कौन-सी माप, तुलना या प्रतिनिधित्व की बातें आवश्यक हैं।";
  if (locale === "pa-IN") return "ਵੇਖੋ ਕਿ ਤੁਲਨਾ ਜਾਂ ਸਬੂਤ ਤੋਂ ਕੀਤੇ ਦਾਅਵੇ ਲਈ ਮਾਪ, ਤੁਲਨਾ ਜਾਂ ਨੁਮਾਇੰਦਗੀ ਬਾਰੇ ਕਿਹੜੀਆਂ ਗੱਲਾਂ ਲਾਜ਼ਮੀ ਹਨ।";
  return "Check which assumptions are required for the comparison or evidence to support the stated claim.";
}

function candidateExplanation(
  locale: StaExtensionLocale,
  label: string,
  implicit: boolean,
  rationale: string,
): string {
  if (locale === "hi-IN") return `पूर्वधारणा ${label} ${implicit ? "निहित है" : "निहित नहीं है"}: ${rationale}`;
  if (locale === "pa-IN") return `ਧਾਰਨਾ ${label} ${implicit ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationale}`;
  return `Assumption ${label} is ${implicit ? "implicit" : "not implicit"}: ${rationale}`;
}

function conclusion(locale: StaExtensionLocale, display: string): string {
  if (locale === "hi-IN") return `इसलिए सही विकल्प है: ${display}।`;
  if (locale === "pa-IN") return `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${display}।`;
  return `Therefore, the correct choice is ${display}.`;
}

export function generateStaSemanticExtensionV3Question(
  seed: string,
  qlId: StaExtensionQlId,
  locale: StaExtensionLocale = "en-IN",
  localizedRendering?: Readonly<Record<string, StaExtensionLocalizedRendering>>,
): StaExtensionQuestion {
  const pool = STA_SEMANTIC_EXTENSION_V3_BY_QL[qlId];
  const scenario = choose(pool, `${seed}:${qlId}:scenario`);
  assertStaExtensionScenarioOracleParity(scenario);
  const candidateCount = choose(scenario.allowedCandidateCounts, `${seed}:${scenario.scenarioId}:candidate-count`);
  const selectedAuthorities = deterministicShuffle(scenario.candidates, `${seed}:${scenario.scenarioId}:candidate-selection`).slice(0, candidateCount);
  const rendering = localizedRendering?.[scenario.scenarioId];
  const statement = choose(statementVariants(scenario, rendering), `${seed}:${scenario.scenarioId}:statement`);
  const candidates = selectedAuthorities.map((candidate, index) => ({
    label: roman(index),
    candidateId: candidate.candidateId,
    text: candidateText(candidate, rendering),
    oracle: evaluateStaExtensionCandidate(scenario, candidate),
    ...(candidate.misconceptionClass ? { misconceptionClass: candidate.misconceptionClass } : {}),
  })) as unknown as StaExtensionQuestion["candidates"];
  const answerSet = answerSetFor(scenario, selectedAuthorities);
  const options = buildOptions(answerSet, candidateCount, locale, seed);
  const answerIndexRaw = options.findIndex((option) => option.isCorrect);
  if (answerIndexRaw < 0 || answerIndexRaw > 3) throw new Error(`${seed}: extension correct option missing`);
  const answerIndex = answerIndexRaw as 0 | 1 | 2 | 3;
  const explanationParts = [explanationLead(qlId, locale)];
  candidates.forEach((candidate, index) => {
    const authority = selectedAuthorities[index]!;
    explanationParts.push(candidateExplanation(
      locale,
      candidate.label,
      candidate.oracle.classification === "IMPLICIT",
      candidateRationale(authority, rendering),
    ));
  });
  explanationParts.push(conclusion(locale, options[answerIndex]!.display));
  const question: StaExtensionQuestion = {
    questionId: `STA-EXT-${hash32(`${seed}:${scenario.scenarioId}`).toString(16).padStart(8, "0")}`,
    packageId: "STA-001",
    chapterId: "REAS-STA",
    extensionVersion: STA_SEMANTIC_EXTENSION_V3_VERSION,
    qlId,
    checkpointId: scenario.checkpointId,
    scenarioId: scenario.scenarioId,
    seed,
    locale,
    difficulty: scenario.difficulty,
    sourceProfile: scenario.sourceProfile,
    sourceAuthorityId: scenario.sourceAuthorityId,
    statement,
    candidates,
    options,
    answerIndex,
    answerSet,
    explanation: explanationParts.join("\n\n"),
    oracleParity: true,
    lifecycle: {
      coreQl001To004: "IMMUTABLE_FROZEN",
      semanticExtensionV3: "REVIEW_CANDIDATE",
      ql005Status: "REVIEW_CANDIDATE_V1",
      ql006Status: "REVIEW_CANDIDATE_V1",
      multilingualChapterFrozen: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
  assertStaSemanticExtensionV3QuestionIntegrity(question);
  return question;
}

export function assertStaSemanticExtensionV3QuestionIntegrity(question: StaExtensionQuestion): void {
  if (question.qlId !== "STA-QL-005" && question.qlId !== "STA-QL-006") throw new Error(`${question.questionId}: invalid extension QL`);
  if (question.candidates.length !== 2 && question.candidates.length !== 3) throw new Error(`${question.questionId}: invalid assumption count`);
  if (question.options.length !== 4) throw new Error(`${question.questionId}: expected four options`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: correct option is not unique`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer index mismatch`);
  if (!sameAnswerSet(question.options[question.answerIndex]!.semanticAnswerSet, question.answerSet)) throw new Error(`${question.questionId}: answer-set mismatch`);
  if (new Set(question.options.map((option) => option.semanticAnswerSet.join(","))).size !== 4) throw new Error(`${question.questionId}: duplicate semantic options`);
  if (new Set(question.options.map((option) => option.display)).size !== 4) throw new Error(`${question.questionId}: duplicate visible options`);
  if (question.candidates.some((candidate) => candidate.oracle.evidenceCode === "MISSING_SEMANTIC_NEGATION")) throw new Error(`${question.questionId}: missing semantic negation`);
  if (question.explanation.includes(question.statement)) throw new Error(`${question.questionId}: explanation repeats full statement`);
  if (/STA-EXT|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY|BREAKS_/.test(question.explanation)) throw new Error(`${question.questionId}: internal authority leaked into explanation`);
  if (question.lifecycle.coreQl001To004 !== "IMMUTABLE_FROZEN" || question.lifecycle.questionStudioDiscoverable) throw new Error(`${question.questionId}: lifecycle drift`);
}
