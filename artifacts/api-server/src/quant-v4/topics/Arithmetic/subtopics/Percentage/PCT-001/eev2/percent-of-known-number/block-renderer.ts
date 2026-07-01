import type {
  EEV2Importance,
  EEV2Visibility,
  ExplanationPlan,
  ExplanationRole,
  GraphNode,
  Provenance,
  RichReasoningGraph,
  StructuredExplanationBlock,
} from "../../../../../../../common/eev2/contracts";
import type {
  RenderedEnglishRoleContent,
  RenderedEnglishRoleSet,
} from "./language-renderer";
import type { PercentOfKnownNumberRoleKind } from "./planner";

export const PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION =
  "1.0.0" as const;

export interface PercentOfKnownNumberBlockProvenanceInput {
  solverVersion: string;
  traceVersion: string;
  graphVersion: string;
  plannerVersion: string;
  languageFamilyVersion: string;
}

const GROUP_DEFINITIONS = [
  {
    groupKind: "RELATIONSHIP_GROUP",
    roleKinds: ["RELATIONSHIP_CONTEXT", "KNOWN_UNIT_MAPPING"],
  },
  {
    groupKind: "UNIT_VALUE_GROUP",
    roleKinds: ["SINGLE_UNIT_DERIVATION"],
  },
  {
    groupKind: "TARGET_GROUP",
    roleKinds: ["TARGET_UNIT_IDENTIFICATION", "TARGET_SCALE_DERIVATION"],
  },
  {
    groupKind: "VERIFICATION_GROUP",
    roleKinds: ["VERIFICATION"],
  },
  {
    groupKind: "ANSWER_GROUP",
    roleKinds: ["ANSWER_INTERPRETATION"],
  },
] as const satisfies readonly {
  groupKind: string;
  roleKinds: readonly PercentOfKnownNumberRoleKind[];
}[];

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function requireRenderedRole(
  renderedRoles: RenderedEnglishRoleSet,
  roleId: string,
): RenderedEnglishRoleContent {
  const renderedRole = renderedRoles.roles.find(
    (candidate) => candidate.roleId === roleId,
  );
  if (!renderedRole) throw new Error(`Missing rendered role: ${roleId}`);
  return renderedRole;
}

function requireGraphNodes(
  graph: RichReasoningGraph,
  role: ExplanationRole,
): readonly GraphNode[] {
  return role.graphRefs.map((graphRef) => {
    const node = graph.nodes.find((candidate) => candidate.nodeId === graphRef);
    if (!node) throw new Error(`Missing graph node for role: ${graphRef}`);
    return node;
  });
}

function roleImportance(role: ExplanationRole): EEV2Importance {
  const importance = role.metadata.importance;
  if (
    importance === "essential" ||
    importance === "supporting" ||
    importance === "optional" ||
    importance === "audit-only"
  ) {
    return importance;
  }
  throw new Error(`Missing role importance: ${role.roleKind}`);
}

function groupVisibility(
  roles: readonly ExplanationRole[],
): EEV2Visibility {
  if (roles.some((role) => role.visibility.state === "visible")) {
    return {
      state: "visible",
      detailModes: unique(
        roles.flatMap((role) => role.visibility.detailModes),
      ),
    };
  }
  const conditionalRole = roles.find(
    (role) => role.visibility.state === "conditional",
  );
  if (conditionalRole) return conditionalRole.visibility;
  return {
    state: "hidden",
    detailModes: unique(
      roles.flatMap((role) => role.visibility.detailModes),
    ),
  };
}

function groupImportance(
  roles: readonly ExplanationRole[],
): EEV2Importance {
  if (roles.some((role) => roleImportance(role) === "essential")) {
    return "essential";
  }
  if (roles.some((role) => roleImportance(role) === "supporting")) {
    return "supporting";
  }
  if (roles.some((role) => roleImportance(role) === "optional")) {
    return "optional";
  }
  return "audit-only";
}

function buildProvenance(
  input: PercentOfKnownNumberBlockProvenanceInput,
): Provenance {
  return {
    ...input,
    blockSchemaVersion: PERCENT_OF_KNOWN_NUMBER_BLOCK_SCHEMA_VERSION,
    projectionVersion: "not-projected",
  };
}

export function renderPercentOfKnownNumberBlocks(
  plan: ExplanationPlan,
  renderedRoles: RenderedEnglishRoleSet,
  graph: RichReasoningGraph,
  provenanceInput: PercentOfKnownNumberBlockProvenanceInput,
): readonly StructuredExplanationBlock[] {
  if (renderedRoles.planId !== plan.planId) {
    throw new Error("Rendered role set does not belong to the explanation plan.");
  }
  if (renderedRoles.detailMode !== plan.detailMode) {
    throw new Error("Rendered role detail mode does not match the plan.");
  }
  if (graph.graphId !== plan.metadata.graphId) {
    throw new Error("Reasoning graph does not belong to the explanation plan.");
  }

  const provenance = buildProvenance(provenanceInput);
  const blocks: StructuredExplanationBlock[] = [];

  for (const group of GROUP_DEFINITIONS) {
    const groupRoles = group.roleKinds.map((roleKind) => {
      const role = plan.roles.find(
        (candidate) => candidate.roleKind === roleKind,
      );
      if (!role) throw new Error(`Missing planned role: ${roleKind}`);
      return role;
    });
    const groupId = `${plan.planId}:block-group:${group.groupKind}`;
    const graphNodes = groupRoles.flatMap((role) =>
      requireGraphNodes(graph, role),
    );

    blocks.push({
      blockId: groupId,
      semanticRole: group.groupKind,
      parentId: null,
      importance: groupImportance(groupRoles),
      visibility: groupVisibility(groupRoles),
      renderedContent: {},
      evidenceRefs: unique([
        ...groupRoles.flatMap((role) => role.graphRefs),
        ...graphNodes.flatMap((node) => node.traceRefs),
      ]),
      valueRefs: unique(graphNodes.flatMap((node) => node.valueRefs)),
      unitRefs: unique(graphNodes.flatMap((node) => node.unitRefs)),
      provenance,
    });

    for (const role of groupRoles) {
      const renderedRole = requireRenderedRole(renderedRoles, role.roleId);
      const roleGraphNodes = requireGraphNodes(graph, role);
      blocks.push({
        blockId: `${plan.planId}:block:${role.roleKind}`,
        semanticRole: role.roleKind,
        parentId: groupId,
        importance: roleImportance(role),
        visibility: role.visibility,
        renderedContent: {
          text: renderedRole.sentence,
          mathLatex: renderedRole.math,
        },
        evidenceRefs: unique([
          ...role.graphRefs,
          ...roleGraphNodes.flatMap((node) => node.traceRefs),
        ]),
        valueRefs: unique(roleGraphNodes.flatMap((node) => node.valueRefs)),
        unitRefs: unique(roleGraphNodes.flatMap((node) => node.unitRefs)),
        provenance,
      });
    }
  }

  return blocks;
}
