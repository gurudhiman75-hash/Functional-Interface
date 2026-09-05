import type { KnowledgeFact } from "../types";
import { COM003_CANDIDATE_FACTS } from "./com003-candidate-fact-corpus";
import { COM003_PROVISIONAL_LEARNER_TASKS } from "./com003-office-productivity-merge-split-audit";

export type Com003DistractorStrategy =
  | "SEMANTIC_FACT_POOL"
  | "CONTROLLED_CLOSED_SET"
  | "HYBRID_REVIEW_SYNTHESIS";

export type Com003DistractorReadiness = {
  taskId: string;
  strategy: Com003DistractorStrategy;
  targetRelations: string[];
  genericRelationMinimums?: Record<string, number>;
  controlledPoolIds?: string[];
  versionScoped: boolean;
  genericRuntimeAllowed: boolean;
  rationale: string[];
};

/**
 * COM-003 deliberately does not mutate the shared knowledge-v1 distractor
 * engine. The generic engine filters targets/distractors to an exact relation,
 * which is ideal for sufficiently broad relation families but too restrictive
 * for small, closed Office concept sets. COM-002 already established the safer
 * pattern: chapter review synthesis may use deterministic controlled option
 * pools while canonical correctness/explanations remain source-fact driven.
 */
export const COM003_DISTRACTOR_READINESS: readonly Com003DistractorReadiness[] = [
  {
    taskId: "COM003-PT-001",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["application_primary_purpose", "software_classification"],
    controlledPoolIds: ["office-application-identities", "office-software-categories"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Word/Excel/PowerPoint form a three-item closed identity set; generic exact-relation distractors cannot always supply three wrong options."],
  },
  {
    taskId: "COM003-PT-002",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["office_extension_type"],
    genericRelationMinimums: { office_extension_type: 7 },
    versionScoped: false,
    genericRuntimeAllowed: true,
    rationale: ["Seven source-backed Office extensions provide sufficient exact-relation option diversity."],
  },
  {
    taskId: "COM003-PT-003",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["common_command_effect", "common_shortcut_action"],
    genericRelationMinimums: { common_command_effect: 8, common_shortcut_action: 8 },
    versionScoped: true,
    genericRuntimeAllowed: true,
    rationale: ["Both command and shortcut relations have broad exact-relation pools; shortcut surfaces must state Windows desktop context where required."],
  },
  {
    taskId: "COM003-PT-004",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["word_document_concept", "word_editing_operation", "word_character_formatting", "word_formatting_shortcut", "word_paragraph_alignment"],
    controlledPoolIds: ["office-artifact-types", "word-editing-actions", "word-formatting-controls", "word-formatting-shortcuts", "word-alignments"],
    versionScoped: true,
    genericRuntimeAllowed: false,
    rationale: ["Formatting and alignment have adequate sibling facts, but document/edit/shortcut subrelations are too small for generic 4-option generation; one task-level review synthesizer should route by surface."],
  },
  {
    taskId: "COM003-PT-005",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["word_correction_feature"],
    genericRelationMinimums: { word_correction_feature: 5 },
    versionScoped: false,
    genericRuntimeAllowed: true,
    rationale: ["Find, Replace, spelling, grammar and AutoCorrect form a five-entity feature-purpose family."],
  },
  {
    taskId: "COM003-PT-006",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["word_page_element_role", "word_page_orientation"],
    controlledPoolIds: ["word-page-elements", "word-page-orientations"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Header/footer/page-number and portrait/landscape are intentionally small closed sets; use cross-subset page-layout distractors rather than inventing extra facts."],
  },
  {
    taskId: "COM003-PT-007",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["mail_merge_relation"],
    genericRelationMinimums: { mail_merge_relation: 5 },
    versionScoped: false,
    genericRuntimeAllowed: true,
    rationale: ["Mail merge plus its four principal components provide an exact-relation fact family with safe role distractors."],
  },
  {
    taskId: "COM003-PT-008",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["excel_structure_concept", "excel_cell_address", "excel_cell_range"],
    controlledPoolIds: ["excel-structure-terms", "excel-reference-notation"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Workbook/worksheet/row/column/cell is broad enough, but address/range notation is intentionally sparse and needs syntax-aware controlled options."],
  },
  {
    taskId: "COM003-PT-009",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["excel_formula_syntax", "excel_formula_operator"],
    controlledPoolIds: ["excel-formula-prefix-symbols", "excel-arithmetic-operators"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Arithmetic operators form a four-item fact set, while formula-prefix recognition is a singleton truth and must use controlled symbol distractors."],
  },
  {
    taskId: "COM003-PT-010",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["excel_basic_function", "excel_autosum_behavior"],
    controlledPoolIds: ["excel-basic-functions", "excel-autosum-actions"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Five basic functions support semantic choices, but AutoSum behavior has only two canonical facts and requires controlled function/action options."],
  },
  {
    taskId: "COM003-PT-011",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["excel_reference_behavior", "excel_reference_notation"],
    controlledPoolIds: ["excel-reference-types", "excel-reference-notation"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Relative versus absolute reference behavior is a deliberately small conceptual contrast; syntax-aware notation options are safer than padding the target relation."],
  },
  {
    taskId: "COM003-PT-012",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["excel_data_feature"],
    genericRelationMinimums: { excel_data_feature: 6 },
    versionScoped: false,
    genericRuntimeAllowed: true,
    rationale: ["Sort, filter and AutoFill behaviors have six distinct exact-relation facts."],
  },
  {
    taskId: "COM003-PT-013",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["excel_row_column_operation"],
    genericRelationMinimums: { excel_row_column_operation: 4 },
    versionScoped: false,
    genericRuntimeAllowed: true,
    rationale: ["Four row/column operation facts are sufficient for a standard four-option semantic pool."],
  },
  {
    taskId: "COM003-PT-014",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["excel_chart_purpose"],
    controlledPoolIds: ["excel-basic-chart-types"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["The initial chart target set deliberately contains only three high-confidence exam-level chart types; controlled chart-name options avoid promoting weak chart-choice claims."],
  },
  {
    taskId: "COM003-PT-015",
    strategy: "SEMANTIC_FACT_POOL",
    targetRelations: ["excel_shortcut_action"],
    genericRelationMinimums: { excel_shortcut_action: 4 },
    versionScoped: true,
    genericRuntimeAllowed: true,
    rationale: ["Four source-backed Excel shortcut/action facts satisfy semantic option geometry, but all targets require explicit Windows desktop/version context."],
  },
  {
    taskId: "COM003-PT-016",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["powerpoint_structure_concept", "powerpoint_creation_structure"],
    controlledPoolIds: ["office-artifact-types", "powerpoint-creation-concepts"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Layout/theme/placeholder/template has a four-fact pool, while presentation/slide identity is a two-item closed relation and needs artifact distractors."],
  },
  {
    taskId: "COM003-PT-017",
    strategy: "HYBRID_REVIEW_SYNTHESIS",
    targetRelations: ["powerpoint_insertable_object", "powerpoint_version_scoped_ui_mapping"],
    controlledPoolIds: ["powerpoint-insertable-objects", "powerpoint-version-scoped-tabs"],
    versionScoped: true,
    genericRuntimeAllowed: false,
    rationale: ["Insertable objects are a small closed set and the Ribbon mapping is a single explicitly version-scoped fact; both require controlled options and strict platform wording."],
  },
  {
    taskId: "COM003-PT-018",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["powerpoint_motion_effect", "powerpoint_transition_timing"],
    controlledPoolIds: ["powerpoint-motion-effects", "powerpoint-timing-concepts"],
    versionScoped: false,
    genericRuntimeAllowed: false,
    rationale: ["Transition-versus-animation and duration-versus-auto-advance are paired concepts; closed-set options preserve the exact semantic distinction."],
  },
  {
    taskId: "COM003-PT-019",
    strategy: "CONTROLLED_CLOSED_SET",
    targetRelations: ["powerpoint_slideshow_shortcut"],
    controlledPoolIds: ["powerpoint-slideshow-shortcuts"],
    versionScoped: true,
    genericRuntimeAllowed: false,
    rationale: ["F5 and Shift+F5 are the only initial slide-show shortcut targets; controlled known-shortcut distractors avoid adding low-yield targets merely to satisfy pool size."],
  },
] as const;

function taskFacts(taskId: string): KnowledgeFact[] {
  return COM003_CANDIDATE_FACTS.filter((fact) => fact.tags.includes(`provisional-task:${taskId}`));
}

export function auditCom003DistractorReadiness() {
  const issues: string[] = [];
  const provisionalTaskIds = COM003_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId)
    .sort();
  const strategyTaskIds = COM003_DISTRACTOR_READINESS.map((entry) => entry.taskId).sort();

  if (JSON.stringify(provisionalTaskIds) !== JSON.stringify(strategyTaskIds)) {
    issues.push("DISTRACTOR_STRATEGIES_DO_NOT_COVER_PROVISIONAL_TASKS_EXACTLY");
  }

  const seenTasks = new Set<string>();
  for (const entry of COM003_DISTRACTOR_READINESS) {
    if (seenTasks.has(entry.taskId)) issues.push(`DUPLICATE_TASK_STRATEGY:${entry.taskId}`);
    seenTasks.add(entry.taskId);
    const facts = taskFacts(entry.taskId);
    if (!facts.length) issues.push(`TASK_WITHOUT_FACTS:${entry.taskId}`);

    const actualRelations = new Set(facts.map((fact) => fact.relation));
    for (const relation of entry.targetRelations) {
      if (!actualRelations.has(relation)) issues.push(`DECLARED_RELATION_WITHOUT_FACT:${entry.taskId}:${relation}`);
    }

    if (entry.strategy === "SEMANTIC_FACT_POOL") {
      if (!entry.genericRuntimeAllowed) issues.push(`SEMANTIC_STRATEGY_NOT_GENERIC_ALLOWED:${entry.taskId}`);
      if (!entry.genericRelationMinimums) issues.push(`SEMANTIC_STRATEGY_WITHOUT_MINIMUMS:${entry.taskId}`);
      for (const [relation, minimum] of Object.entries(entry.genericRelationMinimums ?? {})) {
        const relationFacts = facts.filter((fact) => fact.relation === relation);
        const uniqueValues = new Set(relationFacts.map((fact) =>
          fact.value.kind === "text" ? fact.value.text.en.trim().toLowerCase() : JSON.stringify(fact.value),
        ));
        if (relationFacts.length < minimum) issues.push(`THIN_GENERIC_RELATION:${entry.taskId}:${relation}:${relationFacts.length}<${minimum}`);
        if (uniqueValues.size < 4) issues.push(`GENERIC_RELATION_HAS_FEWER_THAN_FOUR_VALUES:${entry.taskId}:${relation}:${uniqueValues.size}`);
      }
    } else {
      if (entry.genericRuntimeAllowed) issues.push(`CONTROLLED_STRATEGY_GENERIC_ALLOWED:${entry.taskId}`);
      if (!entry.controlledPoolIds?.length) issues.push(`CONTROLLED_STRATEGY_WITHOUT_POOL:${entry.taskId}`);
    }

    const hasVersionScopedFacts = facts.some((fact) => fact.tags.includes("version-scoped"));
    if (entry.versionScoped !== hasVersionScopedFacts) {
      issues.push(`VERSION_SCOPE_DECLARATION_DRIFT:${entry.taskId}:${entry.versionScoped}:${hasVersionScopedFacts}`);
    }
  }

  const semanticTaskIds = COM003_DISTRACTOR_READINESS.filter((entry) => entry.strategy === "SEMANTIC_FACT_POOL").map((entry) => entry.taskId);
  const controlledTaskIds = COM003_DISTRACTOR_READINESS.filter((entry) => entry.strategy !== "SEMANTIC_FACT_POOL").map((entry) => entry.taskId);
  const versionScopedTaskIds = COM003_DISTRACTOR_READINESS.filter((entry) => entry.versionScoped).map((entry) => entry.taskId);

  if (semanticTaskIds.length !== 7) issues.push(`UNEXPECTED_SEMANTIC_TASK_COUNT:${semanticTaskIds.length}`);
  if (controlledTaskIds.length !== 12) issues.push(`UNEXPECTED_CONTROLLED_TASK_COUNT:${controlledTaskIds.length}`);
  if (versionScopedTaskIds.length !== 5) issues.push(`UNEXPECTED_VERSION_SCOPED_TASK_COUNT:${versionScopedTaskIds.length}`);

  return {
    valid: issues.length === 0,
    taskCount: COM003_DISTRACTOR_READINESS.length,
    semanticTaskIds,
    controlledTaskIds,
    versionScopedTaskIds,
    sharedEngineChangeRequired: false,
    controlledPoolImplementationRequired: true,
    permanentQlCount: 0,
    allocationReady: false,
    productionEligible: false,
    issues,
  };
}
