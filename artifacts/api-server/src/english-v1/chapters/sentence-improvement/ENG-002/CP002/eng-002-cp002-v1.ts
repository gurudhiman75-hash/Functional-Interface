import { deterministicBoolean, deterministicIndex, deterministicPick } from "../../../../core/deterministic";
import type { DifficultyDimensions, Eng001SentenceCandidate, EnglishDifficulty, TenseRuleId } from "../../../../core/types";
import {
  DYNAMIC_TENSE_SCENES_V1,
  ONGOING_TENSE_SCENES_V1,
  STATIVE_TENSE_SCENES_V1,
  type DynamicTenseSceneV1,
  type OngoingTenseSceneV1,
  type StativeTenseSceneV1,
} from "../../../error-spotting/ENG-001/CP002/cp002-semantic-catalog-v1";
import {
  buildEng001Cp002CandidateV1,
  rulesForDifficultyCp002V1,
} from "../../../error-spotting/ENG-001/CP002/cp002-patterns-v1";

export const ENG002_CP002_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp002QuestionV1 {
  questionId: string;
  stem: string;
  sentence: string;
  segments: readonly string[];
  targetIndex: number;
  targetText: string;
  options: readonly string[];
  correctOptionIndex: number;
  correctedSentence: string;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-002";
    cpId: "ENG-002-CP002";
    ruleId: TenseRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    candidateId: string;
    semanticDomain: string;
    sceneId: string;
    noImprovement: boolean;
    reviewOnly: true;
  };
}

export interface GenerateEng002Cp002V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: TenseRuleId;
  noImprovement?: boolean;
}

type Scene = DynamicTenseSceneV1 | OngoingTenseSceneV1 | StativeTenseSceneV1;

function normalizeSurfaceSegment(segment: string): string {
  return segment
    .replace(/\.\.+$/g, ".")
    .replace(/\bcurrently\.$/i, "at the moment.")
    .replace(/\s+/g, " ")
    .trim();
}

function surfaceSegments(candidate: Eng001SentenceCandidate, segments: readonly string[]): string[] {
  return segments.map((segment, index) => {
    let normalized = normalizeSurfaceSegment(segment);
    if (candidate.ruleId === "GR-TNS-002" && candidate.difficulty === "hard" && index < 2) {
      normalized = normalized.replace(/,$/, "");
    }
    return normalized;
  });
}

function sentenceFromSegments(segments: readonly string[]): string {
  return segments
    .map(normalizeSurfaceSegment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\.\.+/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function chooseRule(input: GenerateEng002Cp002V1Input): TenseRuleId {
  const allowed = rulesForDifficultyCp002V1(input.difficulty) as readonly TenseRuleId[];
  if (input.ruleId) {
    if (!allowed.includes(input.ruleId)) {
      throw new Error(`${input.ruleId} does not support ${input.difficulty} in ENG-002 CP002`);
    }
    return input.ruleId;
  }
  return deterministicPick(`${input.seed}:eng002:cp002:rule:${input.difficulty}`, allowed);
}

function sceneIdOf(candidate: Eng001SentenceCandidate): string {
  const sceneId = candidate.tags.find((tag) => tag.startsWith("scene:"))?.slice("scene:".length);
  if (!sceneId) throw new Error(`${candidate.candidateId} lacks a CP002 scene id`);
  return sceneId;
}

function sceneForCandidate(candidate: Eng001SentenceCandidate): Scene {
  const sceneId = sceneIdOf(candidate);
  const ruleId = candidate.ruleId as TenseRuleId;
  if (["GR-TNS-001", "GR-TNS-003", "GR-TNS-004", "GR-TNS-006", "GR-TNS-009"].includes(ruleId)) {
    const scene = DYNAMIC_TENSE_SCENES_V1.find((entry) => entry.id === sceneId);
    if (!scene) throw new Error(`${candidate.candidateId} cannot resolve dynamic scene ${sceneId}`);
    return scene;
  }
  if (["GR-TNS-002", "GR-TNS-007", "GR-TNS-008"].includes(ruleId)) {
    const scene = ONGOING_TENSE_SCENES_V1.find((entry) => entry.id === sceneId);
    if (!scene) throw new Error(`${candidate.candidateId} cannot resolve ongoing scene ${sceneId}`);
    return scene;
  }
  const scene = STATIVE_TENSE_SCENES_V1.find((entry) => entry.id === sceneId);
  if (!scene) throw new Error(`${candidate.candidateId} cannot resolve stative scene ${sceneId}`);
  return scene;
}

function semanticDomainOf(candidate: Eng001SentenceCandidate): string {
  const domain = candidate.tags.find((tag) => tag.startsWith("domain:"))?.slice("domain:".length);
  if (!domain) throw new Error(`${candidate.candidateId} lacks a semantic domain`);
  return domain;
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values.map((entry) => entry.trim()).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function tenseDistractorPool(candidate: Eng001SentenceCandidate, scene: Scene): string[] {
  const ruleId = candidate.ruleId as TenseRuleId;
  const wrong = candidate.errorSpan.trim();
  switch (ruleId) {
    case "GR-TNS-001": {
      const s = scene as DynamicTenseSceneV1;
      return unique([wrong, `had ${s.participle}`, `has been ${s.ing}`, `will ${s.base}`]);
    }
    case "GR-TNS-002": {
      const s = scene as OngoingTenseSceneV1;
      return unique([wrong, `had been ${s.ing}`, `was ${s.ing}`, `will be ${s.ing}`]);
    }
    case "GR-TNS-003": {
      const s = scene as DynamicTenseSceneV1;
      return unique([wrong, `had ${s.participle}`, `will ${s.base}`, `was ${s.ing}`]);
    }
    case "GR-TNS-004": {
      const s = scene as DynamicTenseSceneV1;
      return unique([wrong, `has ${s.participle}`, `had ${s.participle}`, `will ${s.base}`]);
    }
    case "GR-TNS-005": {
      const s = scene as StativeTenseSceneV1;
      return unique([wrong, `has been ${s.ing}`, `was ${s.ing}`, `had been ${s.ing}`]);
    }
    case "GR-TNS-006": {
      const s = scene as DynamicTenseSceneV1;
      return unique([wrong, `has not ${s.participle}`, `had not ${s.participle}`, `will not ${s.base}`]);
    }
    case "GR-TNS-007": {
      const s = scene as OngoingTenseSceneV1;
      return unique([wrong, `has been ${s.ing}`, `is ${s.ing}`, `will have ${s.participle}`]);
    }
    case "GR-TNS-008": {
      const s = scene as OngoingTenseSceneV1;
      return unique([wrong, `is ${s.ing}`, `will be ${s.ing}`, `had ${s.participle}`]);
    }
    case "GR-TNS-009": {
      const s = scene as DynamicTenseSceneV1;
      return unique([wrong, `has ${s.participle}`, `will ${s.base}`, `has been ${s.ing}`]);
    }
    case "GR-TNS-010": {
      const s = scene as StativeTenseSceneV1;
      return unique([wrong, `is ${s.ing}`, `was ${s.ing}`, s.present3sg]);
    }
  }
}

function replacementChoices(input: {
  candidate: Eng001SentenceCandidate;
  correctTarget: string;
  wrongTarget: string;
  targetText: string;
  noImprovement: boolean;
}): string[] {
  const scene = sceneForCandidate(input.candidate);
  const pool = tenseDistractorPool(input.candidate, scene)
    .filter((entry) => entry.toLowerCase() !== input.targetText.toLowerCase())
    .filter((entry) => entry.toLowerCase() !== input.correctTarget.toLowerCase());
  const values = input.noImprovement
    ? unique([input.wrongTarget, ...pool]).slice(0, 3)
    : unique([input.correctTarget, ...pool]).slice(0, 3);
  if (values.length !== 3) {
    throw new Error(`${input.candidate.candidateId} could not build three unique sentence-improvement choices`);
  }
  return values;
}

function shuffleThree(seed: string, values: readonly string[]): string[] {
  const out = [...values];
  for (let index = out.length - 1; index > 0; index -= 1) {
    const other = deterministicIndex(`${seed}:shuffle:${index}`, index + 1);
    [out[index], out[other]] = [out[other]!, out[index]!];
  }
  return out;
}

function easyConcept(ruleId: TenseRuleId): string {
  switch (ruleId) {
    case "GR-TNS-001": return "When a sentence gives a finished past time such as yesterday or last Friday, use the simple past. Do not use the present perfect with that finished time.";
    case "GR-TNS-002": return "When an action started in the past and is still continuing now, use has/have been + verb-ing for this pattern.";
    case "GR-TNS-003": return "For a habit or regular routine, use the simple present.";
    case "GR-TNS-004": return "For an action happening now, use am/is/are + verb-ing.";
    case "GR-TNS-005": return "Some verbs describe a state rather than an action. Verbs such as know, understand and own normally do not use the continuous form in this meaning.";
    case "GR-TNS-006": return "After did or did not, keep the main verb in its base form because did already shows the past tense.";
    case "GR-TNS-007": return "When two past actions are clearly ordered, use the past perfect for the action that happened first.";
    case "GR-TNS-008": return "When one action was already in progress and another past action interrupted it, use was/were + verb-ing for the ongoing action.";
    case "GR-TNS-009": return "For one completed past event, use the simple past. Past perfect is needed only when another past point or event gives a comparison.";
    case "GR-TNS-010": return "For a state that started in the past and is still true now, use has/have + past participle. A stative verb normally does not need a continuous form here.";
  }
}

function easyApplication(candidate: Eng001SentenceCandidate): string {
  const text = candidate.explanationApplication.trim().replace(/^[“\"]?/, "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateEng002Cp002QuestionV1(input: GenerateEng002Cp002V1Input): Eng002Cp002QuestionV1 {
  const ruleId = chooseRule(input);
  const candidate = buildEng001Cp002CandidateV1({
    ruleId,
    difficulty: input.difficulty,
    seed: `${input.seed}:${ruleId}`,
  });
  if (candidate.errorIndex === null) throw new Error(`${candidate.candidateId} has no tense mutation target`);

  const correctSegments = surfaceSegments(candidate, candidate.correctSegments);
  const errorSegments = surfaceSegments(candidate, candidate.errorSegments);
  const correctTarget = correctSegments[candidate.errorIndex]!.trim();
  const wrongTarget = errorSegments[candidate.errorIndex]!.trim();
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) {
    throw new Error(`${candidate.candidateId} does not expose a distinct sentence-improvement target`);
  }

  const noImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp002:no-improvement`, 0.25);
  const visibleSegments = noImprovement ? correctSegments : errorSegments;
  const targetText = visibleSegments[candidate.errorIndex]!.trim();
  const replacements = replacementChoices({ candidate, correctTarget, wrongTarget, targetText, noImprovement });
  const shuffled = shuffleThree(`${input.seed}:eng002:cp002:options`, replacements);
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost the correct replacement`);

  const sentence = sentenceFromSegments(visibleSegments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const concept = easyConcept(ruleId);
  const application = easyApplication(candidate);
  const explanation = noImprovement
    ? `No improvement: “${correctTarget}” is already the correct tense form. Concept: ${concept} Here, ${application} Correct sentence: ${correctedSentence}`
    : `Error: “${wrongTarget}” does not fit the time or tense meaning; use “${correctTarget}”. Concept: ${concept} Here, ${application} Correct sentence: ${correctedSentence}`;

  return {
    questionId: `ENG-002-CP002-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP002_STEM,
    sentence,
    segments: visibleSegments,
    targetIndex: candidate.errorIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english",
      chapterId: "ENG-002",
      cpId: "ENG-002-CP002",
      ruleId,
      mutationId: candidate.mutationId,
      difficulty: candidate.difficulty,
      dimensions: candidate.dimensions,
      seed: input.seed,
      candidateId: candidate.candidateId,
      semanticDomain: semanticDomainOf(candidate),
      sceneId: sceneIdOf(candidate),
      noImprovement,
      reviewOnly: true,
    },
  };
}
