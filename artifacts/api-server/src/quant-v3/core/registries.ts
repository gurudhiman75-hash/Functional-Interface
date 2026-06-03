import type {
  ArchetypeRegistry,
  CanonicalProblemRegistry,
  SubtopicRegistry,
  TopicRegistry,
} from "./types";

export const TOPIC_REGISTRY = {} as const satisfies TopicRegistry;
export const SUBTOPIC_REGISTRY = {} as const satisfies SubtopicRegistry;
export const ARCHETYPE_REGISTRY = {} as const satisfies ArchetypeRegistry;
export const CANONICAL_PROBLEM_REGISTRY = {} as const satisfies CanonicalProblemRegistry;

export function getTopicRegistry(): TopicRegistry {
  return TOPIC_REGISTRY;
}

export function getSubtopicRegistry(): SubtopicRegistry {
  return SUBTOPIC_REGISTRY;
}

export function getArchetypeRegistry(): ArchetypeRegistry {
  return ARCHETYPE_REGISTRY;
}

export function getCanonicalProblemRegistry(): CanonicalProblemRegistry {
  return CANONICAL_PROBLEM_REGISTRY;
}

