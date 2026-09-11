import { deterministicPick } from "../../../../core/deterministic";
import { classifyEnglishDifficulty } from "../../../../core/difficulty";
import type {
  DifficultyDimensions,
  Eng001SentenceCandidate,
  EnglishDifficulty,
  TenseRuleId,
} from "../../../../core/types";
import { TENSE_SEQUENCE_RULE_BY_ID } from "../../../../grammar/tenses-sequence";
import {
  DYNAMIC_TENSE_SCENES_V1,
  ONGOING_TENSE_SCENES_V1,
  STATIVE_TENSE_SCENES_V1,
  type DynamicTenseSceneV1,
  type OngoingTenseSceneV1,
  type StativeTenseSceneV1,
  type TenseDomainV1,
} from "./cp002-semantic-catalog-v1";

function dims(
  ruleComplexity: DifficultyDimensions["ruleComplexity"],
  dependencyDistance: DifficultyDimensions["dependencyDistance"],
  distractorSimilarity: DifficultyDimensions["distractorSimilarity"],
  sentenceLength: DifficultyDimensions["sentenceLength"],
  ruleInteraction: DifficultyDimensions["ruleInteraction"],
  lexicalLoad: DifficultyDimensions["lexicalLoad"] = 1,
): DifficultyDimensions {
  return { ruleComplexity, dependencyDistance, distractorSimilarity, sentenceLength, ruleInteraction, lexicalLoad };
}

const cap = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
const domainTag = (domain: TenseDomainV1): string => `domain:${domain}`;
const dynamicScene = (seed: string): DynamicTenseSceneV1 => deterministicPick(`${seed}:dynamic`, DYNAMIC_TENSE_SCENES_V1);
const ongoingScene = (seed: string): OngoingTenseSceneV1 => deterministicPick(`${seed}:ongoing`, ONGOING_TENSE_SCENES_V1);
const stativeScene = (seed: string): StativeTenseSceneV1 => deterministicPick(`${seed}:stative`, STATIVE_TENSE_SCENES_V1);

const PAST_MARKERS = ["yesterday", "last Friday", "two days ago", "in 2024"] as const;
const HABIT_MARKERS = ["every morning", "every day", "each week", "regularly"] as const;
const NOW_MARKERS = ["right now", "at the moment", "currently"] as const;

function buildCandidate(input: {
  candidateId: string;
  ruleId: TenseRuleId;
  difficulty: EnglishDifficulty;
  dimensions: DifficultyDimensions;
  correctSegments: readonly string[];
  errorSegments: readonly string[];
  errorIndex: number;
  errorSpan: string;
  correction: string;
  subjectHead: string;
  distractorCue?: string;
  explanationApplication: string;
  tags: readonly string[];
}): Eng001SentenceCandidate {
  const rule = TENSE_SEQUENCE_RULE_BY_ID[input.ruleId];
  const derived = classifyEnglishDifficulty(input.dimensions);
  if (derived !== input.difficulty) {
    throw new Error(`${input.candidateId} difficulty mismatch: requested ${input.difficulty}, derived ${derived}`);
  }
  if (!rule.allowedDifficulties.includes(input.difficulty)) {
    throw new Error(`${input.ruleId} does not admit ${input.difficulty}`);
  }
  return { ...input, mutationId: rule.mutationId };
}

function renderPastTime(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = dynamicScene(seed);
  const marker = deterministicPick(`${seed}:past-marker`, PAST_MARKERS);
  const correctVerb = scene.past;
  const wrongVerb = `has ${scene.participle}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `TNS1:PAST-TIME:${scene.id}:${marker}:E`,
      ruleId: "GR-TNS-001",
      difficulty,
      dimensions: dims(1, 1, 1, 1, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, `${marker}.`],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${marker}.`],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: marker,
      explanationApplication: `“${marker}” fixes the action at a finished past time, so the simple past “${correctVerb}” is required.`,
      tags: ["pattern:finished-past", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:PAST-TIME:${scene.id}:${marker}:M`,
    ruleId: "GR-TNS-001",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1),
    correctSegments: [`${cap(scene.context)},`, scene.subject, correctVerb, `${scene.object} ${marker}.`],
    errorSegments: [`${cap(scene.context)},`, scene.subject, wrongVerb, `${scene.object} ${marker}.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: marker,
    explanationApplication: `The finished-past marker “${marker}” requires the simple past “${correctVerb}”; present perfect is not used with that completed past time.`,
    tags: ["pattern:finished-past", "dependency:time-cue-late", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderContinuingAction(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = ongoingScene(seed);
  const correctVerb = `has been ${scene.ing}`;
  const wrongVerb = `is ${scene.ing}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `TNS1:CONTINUING:${scene.id}:M`,
      ruleId: "GR-TNS-002",
      difficulty,
      dimensions: dims(3, 3, 3, 2, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, `${scene.continuingMarker}.`],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${scene.continuingMarker}.`],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: scene.continuingMarker,
      explanationApplication: `The action began in the past and is still continuing at “${scene.continuingMarker}”, so “${correctVerb}” is required.`,
      tags: ["pattern:continuing-action", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:CONTINUING:${scene.id}:H`,
    ruleId: "GR-TNS-002",
    difficulty,
    dimensions: dims(4, 4, 4, 3, 1),
    correctSegments: [`${cap(scene.subject)},`, `${scene.modifier},`, correctVerb, `${scene.object} ${scene.continuingMarker}.`],
    errorSegments: [`${cap(scene.subject)},`, `${scene.modifier},`, wrongVerb, `${scene.object} ${scene.continuingMarker}.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: scene.continuingMarker,
    explanationApplication: `The time cue “${scene.continuingMarker}” shows an action continuing from the past to now; the location phrase does not change that tense choice.`,
    tags: ["pattern:continuing-action", "dependency:modifier", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderHabit(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = dynamicScene(seed);
  const marker = deterministicPick(`${seed}:habit-marker`, HABIT_MARKERS);
  const correctVerb = scene.present3sg;
  const wrongVerb = `is ${scene.ing}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `TNS1:HABIT:${scene.id}:${marker}:E`,
      ruleId: "GR-TNS-003",
      difficulty,
      dimensions: dims(2, 1, 1, 1, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, `${marker}.`],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${marker}.`],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: marker,
      explanationApplication: `“${marker}” describes a routine, so the simple present “${correctVerb}” is required.`,
      tags: ["pattern:habit", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:HABIT:${scene.id}:${marker}:M`,
    ruleId: "GR-TNS-003",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1),
    correctSegments: [`${cap(scene.context)},`, scene.subject, correctVerb, `${scene.object} ${marker}.`],
    errorSegments: [`${cap(scene.context)},`, scene.subject, wrongVerb, `${scene.object} ${marker}.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: marker,
    explanationApplication: `The repeated-time cue “${marker}” marks a routine, so use the simple present “${correctVerb}”.`,
    tags: ["pattern:habit", "dependency:fronted-context", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderCurrentAction(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = dynamicScene(seed);
  const marker = deterministicPick(`${seed}:now-marker`, NOW_MARKERS);
  const correctVerb = `is ${scene.ing}`;
  const wrongVerb = scene.present3sg;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `TNS1:NOW:${scene.id}:${marker}:E`,
      ruleId: "GR-TNS-004",
      difficulty,
      dimensions: dims(2, 1, 1, 1, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, `${marker}.`],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${marker}.`],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: marker,
      explanationApplication: `“${marker}” shows that the action is happening now, so use “${correctVerb}”.`,
      tags: ["pattern:current-action", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:NOW:${scene.id}:${marker}:M`,
    ruleId: "GR-TNS-004",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1),
    correctSegments: [`${cap(scene.context)},`, scene.subject, correctVerb, `${scene.object} ${marker}.`],
    errorSegments: [`${cap(scene.context)},`, scene.subject, wrongVerb, `${scene.object} ${marker}.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: marker,
    explanationApplication: `The explicit present-time cue “${marker}” requires the present continuous “${correctVerb}”.`,
    tags: ["pattern:current-action", "dependency:fronted-context", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderStative(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty !== "medium") throw new Error("GR-TNS-005 is medium-only in CP002 V1 surface generation");
  const scene = stativeScene(seed);
  const correctVerb = scene.present3sg;
  const wrongVerb = `is ${scene.ing}`;
  return buildCandidate({
    candidateId: `TNS1:STATIVE:${scene.id}:M`,
    ruleId: "GR-TNS-005",
    difficulty,
    dimensions: dims(3, 2, 3, 2, 1),
    correctSegments: [cap(scene.subject), correctVerb, scene.object, `${scene.modifier}.`],
    errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${scene.modifier}.`],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    explanationApplication: `“${scene.base}” describes a state here, so the simple form “${correctVerb}” is used instead of a continuous form.`,
    tags: ["pattern:stative", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderDidBase(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = dynamicScene(seed);
  const correctVerb = `did not ${scene.base}`;
  const wrongVerb = `did not ${scene.past}`;
  if (difficulty === "easy") {
    return buildCandidate({
      candidateId: `TNS1:DID-BASE:${scene.id}:E`,
      ruleId: "GR-TNS-006",
      difficulty,
      dimensions: dims(2, 1, 1, 1, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, "yesterday."],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, "yesterday."],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      explanationApplication: `After “did not”, the main verb stays in the base form “${scene.base}”.`,
      tags: ["pattern:did-base", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:DID-BASE:${scene.id}:M`,
    ruleId: "GR-TNS-006",
    difficulty,
    dimensions: dims(2, 3, 3, 2, 1),
    correctSegments: [`${cap(scene.context)},`, scene.subject, correctVerb, `${scene.object} yesterday.`],
    errorSegments: [`${cap(scene.context)},`, scene.subject, wrongVerb, `${scene.object} yesterday.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    explanationApplication: `“Did” already carries the past tense, so the lexical verb must remain “${scene.base}”.`,
    tags: ["pattern:did-base", "dependency:fronted-context", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderPastSequence(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = ongoingScene(seed);
  const correctVerb = difficulty === "hard" ? `had already ${scene.participle}` : `had ${scene.participle}`;
  const wrongVerb = difficulty === "hard" ? `has already ${scene.participle}` : `has ${scene.participle}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `TNS1:PAST-SEQUENCE:${scene.id}:M`,
      ruleId: "GR-TNS-007",
      difficulty,
      dimensions: dims(4, 3, 3, 2, 1),
      correctSegments: [`By the time ${scene.laterPastClause},`, scene.subject, correctVerb, `${scene.object}.`],
      errorSegments: [`By the time ${scene.laterPastClause},`, scene.subject, wrongVerb, `${scene.object}.`],
      errorIndex: 2,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: scene.laterPastClause,
      explanationApplication: `The ${scene.subject.replace(/^the /, "")} completed the action before “${scene.laterPastClause}”, so the earlier action takes the past perfect.`,
      tags: ["pattern:past-sequence", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:PAST-SEQUENCE:${scene.id}:H`,
    ruleId: "GR-TNS-007",
    difficulty,
    dimensions: dims(5, 4, 4, 3, 1),
    correctSegments: [`By the time ${scene.laterPastClause},`, `${scene.subject} ${scene.modifier}`, correctVerb, `${scene.object}.`],
    errorSegments: [`By the time ${scene.laterPastClause},`, `${scene.subject} ${scene.modifier}`, wrongVerb, `${scene.object}.`],
    errorIndex: 2,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: scene.laterPastClause,
    explanationApplication: `The completed action happened before the later past event “${scene.laterPastClause}”; “had already + past participle” marks that earlier action.`,
    tags: ["pattern:past-sequence", "dependency:long", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderPastInterruption(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  const scene = ongoingScene(seed);
  const correctVerb = `was ${scene.ing}`;
  const wrongVerb = `has been ${scene.ing}`;
  if (difficulty === "medium") {
    return buildCandidate({
      candidateId: `TNS1:PAST-INTERRUPTION:${scene.id}:M`,
      ruleId: "GR-TNS-008",
      difficulty,
      dimensions: dims(4, 3, 3, 2, 1),
      correctSegments: [cap(scene.subject), correctVerb, scene.object, `when ${scene.interruptionClause}.`],
      errorSegments: [cap(scene.subject), wrongVerb, scene.object, `when ${scene.interruptionClause}.`],
      errorIndex: 1,
      errorSpan: wrongVerb,
      correction: correctVerb,
      subjectHead: scene.subject,
      distractorCue: scene.interruptionClause,
      explanationApplication: `The action was already in progress when the past event “${scene.interruptionClause}” occurred, so use the past continuous.`,
      tags: ["pattern:past-interruption", `scene:${scene.id}`, domainTag(scene.domain)],
    });
  }
  return buildCandidate({
    candidateId: `TNS1:PAST-INTERRUPTION:${scene.id}:H`,
    ruleId: "GR-TNS-008",
    difficulty,
    dimensions: dims(5, 4, 4, 3, 1),
    correctSegments: [`${cap(scene.subject)} ${scene.modifier}`, correctVerb, scene.object, `when ${scene.interruptionClause}.`],
    errorSegments: [`${cap(scene.subject)} ${scene.modifier}`, wrongVerb, scene.object, `when ${scene.interruptionClause}.`],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: scene.interruptionClause,
    explanationApplication: `The interruption is a completed past event, while the first action was in progress at that time; therefore “${correctVerb}” is required.`,
    tags: ["pattern:past-interruption", "dependency:long", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderSinglePast(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty !== "medium") throw new Error("GR-TNS-009 is medium-only in CP002 V1 surface generation");
  const scene = dynamicScene(seed);
  const marker = deterministicPick(`${seed}:single-past-marker`, PAST_MARKERS);
  const correctVerb = scene.past;
  const wrongVerb = `had ${scene.participle}`;
  return buildCandidate({
    candidateId: `TNS1:SINGLE-PAST:${scene.id}:${marker}:M`,
    ruleId: "GR-TNS-009",
    difficulty,
    dimensions: dims(3, 3, 3, 2, 1),
    correctSegments: [cap(scene.subject), correctVerb, scene.object, `${marker}.`],
    errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${marker}.`],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: marker,
    explanationApplication: `Only one completed past event is stated at “${marker}”; there is no later past reference point, so simple past is sufficient.`,
    tags: ["pattern:single-past", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

function renderStativeDuration(difficulty: EnglishDifficulty, seed: string): Eng001SentenceCandidate {
  if (difficulty !== "medium") throw new Error("GR-TNS-010 is medium-only in CP002 V1 surface generation");
  const scene = stativeScene(seed);
  const correctVerb = `has ${scene.participle}`;
  const wrongVerb = `has been ${scene.ing}`;
  return buildCandidate({
    candidateId: `TNS1:STATIVE-DURATION:${scene.id}:M`,
    ruleId: "GR-TNS-010",
    difficulty,
    dimensions: dims(4, 2, 3, 2, 1),
    correctSegments: [cap(scene.subject), correctVerb, scene.object, `${scene.durationMarker}.`],
    errorSegments: [cap(scene.subject), wrongVerb, scene.object, `${scene.durationMarker}.`],
    errorIndex: 1,
    errorSpan: wrongVerb,
    correction: correctVerb,
    subjectHead: scene.subject,
    distractorCue: scene.durationMarker,
    explanationApplication: `The state began in the past and still holds, but “${scene.base}” is stative here, so use the present perfect simple “${correctVerb}”.`,
    tags: ["pattern:stative-duration", `scene:${scene.id}`, domainTag(scene.domain)],
  });
}

export const ENG001_CP002_V1_NO_ERROR_RULE_IDS = [
  "GR-TNS-001",
  "GR-TNS-002",
  "GR-TNS-003",
  "GR-TNS-004",
  "GR-TNS-005",
  "GR-TNS-006",
  "GR-TNS-007",
  "GR-TNS-008",
  "GR-TNS-010",
] as const satisfies readonly TenseRuleId[];

export function rulesForDifficultyCp002V1(difficulty: EnglishDifficulty): readonly TenseRuleId[] {
  if (difficulty === "easy") return ["GR-TNS-001", "GR-TNS-003", "GR-TNS-004", "GR-TNS-006"];
  if (difficulty === "medium") return [
    "GR-TNS-001",
    "GR-TNS-002",
    "GR-TNS-003",
    "GR-TNS-004",
    "GR-TNS-005",
    "GR-TNS-006",
    "GR-TNS-007",
    "GR-TNS-008",
    "GR-TNS-009",
    "GR-TNS-010",
  ];
  return ["GR-TNS-002", "GR-TNS-007", "GR-TNS-008"];
}

export function buildEng001Cp002CandidateV1(input: {
  ruleId: TenseRuleId;
  difficulty: EnglishDifficulty;
  seed: string;
}): Eng001SentenceCandidate {
  switch (input.ruleId) {
    case "GR-TNS-001": return renderPastTime(input.difficulty, input.seed);
    case "GR-TNS-002": return renderContinuingAction(input.difficulty, input.seed);
    case "GR-TNS-003": return renderHabit(input.difficulty, input.seed);
    case "GR-TNS-004": return renderCurrentAction(input.difficulty, input.seed);
    case "GR-TNS-005": return renderStative(input.difficulty, input.seed);
    case "GR-TNS-006": return renderDidBase(input.difficulty, input.seed);
    case "GR-TNS-007": return renderPastSequence(input.difficulty, input.seed);
    case "GR-TNS-008": return renderPastInterruption(input.difficulty, input.seed);
    case "GR-TNS-009": return renderSinglePast(input.difficulty, input.seed);
    case "GR-TNS-010": return renderStativeDuration(input.difficulty, input.seed);
  }
}

export function semanticDomainOfCp002V1(candidate: Eng001SentenceCandidate): TenseDomainV1 | undefined {
  return candidate.tags.find((tag) => tag.startsWith("domain:"))?.slice("domain:".length) as TenseDomainV1 | undefined;
}
