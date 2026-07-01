export type EEV2MetadataPrimitive = string | number | boolean | null;

export type EEV2MetadataValue =
  | EEV2MetadataPrimitive
  | readonly EEV2MetadataValue[]
  | { readonly [key: string]: EEV2MetadataValue };

export type EEV2Metadata = Readonly<Record<string, EEV2MetadataValue>>;

export type EEV2DetailMode = "short" | "standard" | "detailed";

export type EEV2Importance =
  | "essential"
  | "supporting"
  | "optional"
  | "audit-only";

export type EEV2VisibilityState = "visible" | "hidden" | "conditional";

export interface EEV2Visibility {
  state: EEV2VisibilityState;
  detailModes: readonly EEV2DetailMode[];
  channels?: readonly string[];
  conditionId?: string;
}

export type ValueReferenceSource =
  | "parameter"
  | "solver"
  | "derived"
  | "answer";

export interface ValueReference {
  refId: string;
  source: ValueReferenceSource;
  sourceKey: string;
  value?: string | number | boolean;
  metadata?: EEV2Metadata;
}

export interface UnitReference {
  refId: string;
  unitKind: string;
  semanticUnit: string;
  entityRef?: string;
  metadata?: EEV2Metadata;
}

export interface TutorThinkingIdea {
  ideaId: string;
  ideaKind: string;
  dependencies: readonly string[];
  valueRefs: readonly string[];
  unitRefs: readonly string[];
  metadata: EEV2Metadata;
}

export interface TutorThinkingTrace {
  traceId: string;
  traceVersion: string;
  methodFamily: string;
  packageId: string;
  taskKind: string;
  ideas: readonly TutorThinkingIdea[];
  valueRefs: readonly ValueReference[];
  unitRefs: readonly UnitReference[];
  dependencies: Readonly<Record<string, readonly string[]>>;
  metadata: EEV2Metadata;
}

export type GraphNodeClassification = "CORE" | "SUPPORTING" | "VERIFICATION";

export interface GraphNode {
  nodeId: string;
  nodeKind: string;
  classification: GraphNodeClassification;
  valueRefs: readonly string[];
  unitRefs: readonly string[];
  traceRefs: readonly string[];
  importance: EEV2Importance;
  metadata: EEV2Metadata;
}

export interface GraphEdge {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  edgeKind: string;
  metadata: EEV2Metadata;
}

export interface RichReasoningGraph {
  graphId: string;
  graphVersion: string;
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  metadata: EEV2Metadata;
}

export interface ExplanationRole {
  roleId: string;
  roleKind: string;
  graphRefs: readonly string[];
  dependencies: readonly string[];
  visibility: EEV2Visibility;
  metadata: EEV2Metadata;
}

export interface ExplanationPlan {
  planId: string;
  planVersion: string;
  methodFamily: string;
  detailMode: EEV2DetailMode;
  roles: readonly ExplanationRole[];
  metadata: EEV2Metadata;
}

export interface RenderedContent {
  text?: string;
  mathLatex?: string;
  accessibilityText?: string;
}

export interface Provenance {
  solverVersion: string;
  traceVersion: string;
  graphVersion: string;
  plannerVersion: string;
  languageFamilyVersion: string;
  blockSchemaVersion: string;
  projectionVersion: string;
}

export interface StructuredExplanationBlock {
  blockId: string;
  semanticRole: string;
  parentId: string | null;
  importance: EEV2Importance;
  visibility: EEV2Visibility;
  renderedContent: RenderedContent;
  evidenceRefs: readonly string[];
  valueRefs: readonly string[];
  unitRefs: readonly string[];
  provenance: Provenance;
}

export interface AuditMetadata {
  packageId: string;
  taskKind: string;
  methodFamily: string;
  locale: string;
  detailMode: EEV2DetailMode;
  deterministicKey: string;
  provenance: Provenance;
  metadata?: EEV2Metadata;
}

export interface EEV2Explanation {
  engineVersion: string;
  methodFamily: string;
  locale: string;
  detailMode: EEV2DetailMode;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  audit: AuditMetadata;
}
