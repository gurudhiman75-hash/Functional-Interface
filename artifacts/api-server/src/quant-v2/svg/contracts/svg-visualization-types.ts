import type {
  Difficulty,
  PercentageCategory,
  PercentageSubtype,
} from "../../canonical/percentage-types";
import type { LanguageCode } from "../../localization/contracts/language-contracts";
import type { ReasoningStepType } from "../../reasoning/reasoning-graph-types";

export type SvgVisualizationNodeType =
  | "percentage_mapping_node"
  | "hidden_base_node"
  | "vote_filter_node"
  | "mixture_balance_node"
  | "population_projection_node"
  | "pass_fail_gap_node"
  | "reverse_percentage_node"
  | "shortcut_node"
  | "answer_confirmation_node"
  | "component_aggregation_node"
  | "base_change_node";

export type SvgEmphasis =
  | "standard"
  | "hidden_base"
  | "shortcut"
  | "final_derivation"
  | "answer";

export type SvgThemeName =
  | "coaching_board"
  | "exam_sheet"
  | "classroom_whiteboard";

export interface SvgPedagogyNode {
  id: string;
  type: SvgVisualizationNodeType;
  sourceStepId?: string;
  sourceStepType?: ReasoningStepType;
  semanticLabelKey: string;
  label: string;
  equation?: string;
  result?: string;
  emphasis: SvgEmphasis;
}

export interface SvgPedagogyEdge {
  from: string;
  to: string;
  relation: "next" | "filter" | "derive" | "confirm";
}

export interface SvgPedagogyGraph {
  id: string;
  language: LanguageCode;
  subtype: PercentageSubtype;
  category: PercentageCategory;
  difficulty: Difficulty;
  title: string;
  nodes: SvgPedagogyNode[];
  edges: SvgPedagogyEdge[];
  metadata: {
    topologyFamily?: string;
    topologyVariant?: string;
    branchCount: number;
    shortcutAvailable: boolean;
  };
}

export interface SvgLayoutNode extends SvgPedagogyNode {
  x: number;
  y: number;
  width: number;
  height: number;
  labelLines: string[];
  equationLines: string[];
}

export interface SvgLayoutGraph extends SvgPedagogyGraph {
  width: number;
  height: number;
  nodes: SvgLayoutNode[];
}

export interface SvgRenderResult {
  svg: string;
  width: number;
  height: number;
  html: string;
  pngDataUri?: string;
}

