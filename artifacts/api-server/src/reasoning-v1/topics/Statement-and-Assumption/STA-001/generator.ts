import { STA_EXECUTABLE_DISCOVERY_LIFECYCLE } from "./lifecycle.ts";
import { answerSetForSelectedCandidates, assertScenarioOracleParity, evaluateAssumptionOracle } from "./oracle.ts";
import { STA_SCENARIOS_BY_QL } from "./prototype-authorities.ts";
import type {
  StaAnswerSet,
  StaCandidateAuthority,
  StaOption,
  StaProposedQlId,
  StaQlId,
  StaQuestion,
  StaRenderedCandidate,
  StaScenarioAuthority,
} from "./types.ts";

export type StaScenarioPoolByQl = Readonly<Record<StaQlId, readonly StaScenarioAuthority[]>>;

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
  if (values.length === 0) throw new Error(`Cannot choose from empty collection (${seed})`);
  return values[hash32(seed) % values.length]!;
}

function sameAnswerSet(a: StaAnswerSet, b: StaAnswerSet): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function answerSetKey(answer: StaAnswerSet): string {
  return answer.join(",");
}

function allAnswerSets(candidateCount: 2 | 3): StaAnswerSet[] {
  const output: StaAnswerSet[] = [];
  const total = 1 << candidateCount;
  for (let mask = 0; mask < total; mask += 1) {
    const set: number[] = [];
    for (let index = 0; index < candidateCount; index += 1) if ((mask & (1 << index)) !== 0) set.push(index);
    output.push(set);
  }
  return output;
}

function roman(index: number): "I" | "II" | "III" {
  if (index === 0) return "I";
  if (index === 1) return "II";
  return "III";
}

function displayAnswerSet(answer: StaAnswerSet, candidateCount: 2 | 3): string {
  const labels = answer.map(roman);
  if (candidateCount === 2) {
    if (answer.length === 0) return "Neither I nor II";
    if (answer.length === 2) return "Both I and II";
    return `Only ${labels[0]}`;
  }
  if (answer.length === 0) return "None of I, II and III";
  if (answer.length === 3) return "All I, II and III";
  if (answer.length === 1) return `Only ${labels[0]}`;
  return `Only ${labels[0]} and ${labels[1]}`;
}

function buildOptions(correct: StaAnswerSet, candidateCount: 2 | 3, seed: string): readonly [StaOption, StaOption, StaOption, StaOption] {
  const distractors = deterministicShuffle(
    allAnswerSets(candidateCount).filter((set) => !sameAnswerSet(set, correct)),
    `${seed}:option-distractors`,
  ).slice(0, 3);
  const sets = deterministicShuffle<StaAnswerSet>([correct, ...distractors], `${seed}:option-order`);
  const options = sets.map((set) => ({
    display: displayAnswerSet(set, candidateCount),
    semanticAnswerSet: [...set],
    isCorrect: sameAnswerSet(set, correct),
  }));
  if (options.length !== 4) throw new Error(`Expected four options for ${seed}`);
  return options as unknown as readonly [StaOption, StaOption, StaOption, StaOption];
}

function renderCandidates(
  scenario: StaScenarioAuthority,
  selected: readonly StaCandidateAuthority[],
  seed: string,
): readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate] {
  const rendered = selected.map((candidate, index) => ({
    label: roman(index),
    candidateId: candidate.candidateId,
    text: choose(candidate.textVariants, `${seed}:${candidate.candidateId}:text`),
    oracle: evaluateAssumptionOracle(scenario, candidate),
  }));
  if (rendered.length === 2) return rendered as [StaRenderedCandidate, StaRenderedCandidate];
  if (rendered.length === 3) return rendered as [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate];
  throw new Error(`${scenario.scenarioId}: unsupported rendered candidate count ${rendered.length}`);
}

function explanationLead(scenario: StaScenarioAuthority, statement: string): string {
  switch (scenario.discourseAct) {
    case "INSTRUCTION":
    case "REQUEST":
      return `The instruction has to be workable as stated: “${statement}”`;
    case "RECOMMENDATION":
    case "PROPOSAL":
    case "DECISION":
      return `The proposal is meant to achieve the purpose stated here: “${statement}”`;
    case "NOTICE":
      return `The notice is meant to guide the people it addresses: “${statement}”`;
    case "PREDICTION":
      return `The prediction connects a stated change with an expected result: “${statement}”`;
    case "ASSERTION":
      return `The claim depends on the connection expressed here: “${statement}”`;
    case "ADVERTISEMENT":
    case "APPEAL":
      return `The message is intended to influence its audience through this claim: “${statement}”`;
  }
}

function buildExplanation(
  statement: string,
  rendered: StaQuestion["candidates"],
  scenario: StaScenarioAuthority,
  selectedAuthorities: readonly StaCandidateAuthority[],
  answerSet: StaAnswerSet,
): string {
  const lines: string[] = [explanationLead(scenario, statement)];
  rendered.forEach((candidate, index) => {
    const authority = selectedAuthorities[index]!;
    if (candidate.oracle.classification === "IMPLICIT") {
      lines.push(`Assumption ${candidate.label} is implicit: ${authority.rationale}`);
    } else {
      lines.push(`Assumption ${candidate.label} is not implicit: ${authority.rationale}`);
    }
  });
  lines.push(`Therefore, the correct choice is ${displayAnswerSet(answerSet, rendered.length as 2 | 3)}.`);
  return lines.join("\n\n");
}

export function generateStaQuestionFromPool(
  seed: string,
  qlId: StaQlId,
  scenarioPool: StaScenarioPoolByQl,
): StaQuestion {
  const scenarios = scenarioPool[qlId];
  const scenario = choose(scenarios, `${seed}:${qlId}:scenario`);
  assertScenarioOracleParity(scenario);

  const candidateCount = choose(scenario.allowedCandidateCounts, `${seed}:${scenario.scenarioId}:candidate-count`);
  const selectedAuthorities = deterministicShuffle(scenario.candidates, `${seed}:${scenario.scenarioId}:candidate-selection`).slice(0, candidateCount);
  const statement = choose(scenario.statementVariants, `${seed}:${scenario.scenarioId}:statement`);
  const rendered = renderCandidates(scenario, selectedAuthorities, seed);
  const answerSet = answerSetForSelectedCandidates(scenario, selectedAuthorities);
  const options = buildOptions(answerSet, candidateCount, seed);
  const rawAnswerIndex = options.findIndex((option) => option.isCorrect);
  if (rawAnswerIndex < 0 || rawAnswerIndex > 3) throw new Error(`${seed}: correct option missing`);
  const answerIndex = rawAnswerIndex as 0 | 1 | 2 | 3;

  const question: StaQuestion = {
    questionId: `STA-${hash32(`${seed}:${scenario.scenarioId}`).toString(16).padStart(8, "0")}`,
    packageId: "STA-001",
    chapterId: "REAS-STA",
    checkpointId: scenario.checkpointId,
    qlId,
    proposedQlId: qlId,
    scenarioId: scenario.scenarioId,
    seed,
    locale: "en-IN",
    difficulty: scenario.difficulty,
    sourceProfile: scenario.sourceProfile,
    statement,
    candidates: rendered,
    options,
    answerIndex,
    answerSet,
    explanation: buildExplanation(statement, rendered, scenario, selectedAuthorities, answerSet),
    oracleParity: true,
    lifecycle: STA_EXECUTABLE_DISCOVERY_LIFECYCLE,
  };
  assertStaDiscoveryQuestionIntegrity(question);
  return question;
}

export function generateStaDiscoveryQuestion(seed: string, proposedQlId: StaProposedQlId): StaQuestion {
  return generateStaQuestionFromPool(seed, proposedQlId, STA_SCENARIOS_BY_QL);
}

export function assertStaDiscoveryQuestionIntegrity(question: StaQuestion): void {
  if (question.qlId !== question.proposedQlId) throw new Error(`${question.questionId}: frozen QL identity mismatch`);
  if (question.candidates.length !== 2 && question.candidates.length !== 3) throw new Error(`${question.questionId}: invalid candidate count`);
  if (question.options.length !== 4) throw new Error(`${question.questionId}: expected four options`);
  if (question.options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${question.questionId}: option correctness is not unique`);
  if (!question.options[question.answerIndex]?.isCorrect) throw new Error(`${question.questionId}: answer index mismatch`);
  if (!sameAnswerSet(question.options[question.answerIndex]!.semanticAnswerSet, question.answerSet)) throw new Error(`${question.questionId}: answer set mismatch`);
  const optionSetKeys = new Set(question.options.map((option) => answerSetKey(option.semanticAnswerSet)));
  if (optionSetKeys.size !== 4) throw new Error(`${question.questionId}: duplicate semantic options`);
  const optionDisplays = new Set(question.options.map((option) => option.display));
  if (optionDisplays.size !== 4) throw new Error(`${question.questionId}: duplicate visible options`);
  if (question.candidates.some((candidate) => candidate.oracle.evidenceCode === "MISSING_SEMANTIC_NEGATION")) throw new Error(`${question.questionId}: missing semantic negation`);
  if (/STA-|BREAKS_|REQUIRED_HIDDEN_DEPENDENCY|NO_REQUIRED_DEPENDENCY/.test(question.explanation)) throw new Error(`${question.questionId}: internal authority leaked into explanation`);
  if (question.lifecycle.permanentQlCount !== 4 || question.lifecycle.questionStudioDiscoverable) throw new Error(`${question.questionId}: permanent-Ql lifecycle mismatch or downstream gate opened`);
}
