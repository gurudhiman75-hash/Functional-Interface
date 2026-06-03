export type QuantV3TopicId = string;
export type QuantV3SubtopicId = string;
export type QuantV3ArchetypeId = string;
export type QuantV3CanonicalProblemId = string;

export type QuantV3OwnershipFolder =
  | "archetypes"
  | "explanations"
  | "stems"
  | "shortcuts"
  | "distractors"
  | "scenarios"
  | "validators"
  | "localization";

export type QuantV3OwnedModuleKind =
  | QuantV3OwnershipFolder
  | "realismRules"
  | "canonicalProblemModel";

export interface QuantV3TopicConfig {
  topicId: QuantV3TopicId;
  displayName: string;
  subtopics: readonly QuantV3SubtopicId[];
}

export interface QuantV3TopicRegistryEntry extends QuantV3TopicConfig {
  sourcePath: string;
}

export interface QuantV3SubtopicRegistryEntry {
  subtopicId: QuantV3SubtopicId;
  topicId: QuantV3TopicId;
  displayName: string;
  ownershipRoot: string;
  ownershipFolders: readonly QuantV3OwnershipFolder[];
  archetypes: readonly QuantV3ArchetypeId[];
}

export interface QuantV3ArchetypeRegistryEntry {
  archetypeId: QuantV3ArchetypeId;
  topicId: QuantV3TopicId;
  subtopicId: QuantV3SubtopicId;
  ownershipRoot: string;
  ownedModules: readonly QuantV3OwnedModuleKind[];
}

export interface QuantV3CanonicalProblemRegistryEntry {
  canonicalProblemId: QuantV3CanonicalProblemId;
  archetypeId: QuantV3ArchetypeId;
  ownerPath: string;
}

export type TopicRegistry = Readonly<Record<QuantV3TopicId, QuantV3TopicRegistryEntry>>;
export type SubtopicRegistry = Readonly<Record<QuantV3SubtopicId, QuantV3SubtopicRegistryEntry>>;
export type ArchetypeRegistry = Readonly<Record<QuantV3ArchetypeId, QuantV3ArchetypeRegistryEntry>>;
export type CanonicalProblemRegistry = Readonly<Record<QuantV3CanonicalProblemId, QuantV3CanonicalProblemRegistryEntry>>;

