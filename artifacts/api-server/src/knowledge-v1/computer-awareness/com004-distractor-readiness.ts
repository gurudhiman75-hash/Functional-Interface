import type { KnowledgeFact } from "../types";
import { COM004_CANDIDATE_FACTS } from "./com004-candidate-fact-corpus";
import { COM004_PROVISIONAL_LEARNER_TASKS } from "./com004-merge-split-audit";
import { auditCom004CorpusSaturation } from "./com004-corpus-saturation-audit";

export type Com004DistractorStrategy =
  | "SEMANTIC_FACT_POOL"
  | "CONTROLLED_CLOSED_SET"
  | "HYBRID_REVIEW_SYNTHESIS";

export type Com004DistractorReadiness = {
  taskId: string;
  strategy: Com004DistractorStrategy;
  targetRelations: string[];
  genericRelationMinimums?: Record<string, number>;
  controlledPoolIds?: string[];
  versionScoped: boolean;
  genericRuntimeAllowed: boolean;
  rationale: string[];
};

/**
 * Distractor geometry for COM-004 before permanent QL allocation.
 *
 * Small binary/closed contrasts intentionally stay controlled rather than
 * padding the fact graph with weak facts merely to satisfy four-option shape.
 */
export const COM004_DISTRACTOR_READINESS: readonly Com004DistractorReadiness[] = [
  { taskId: "COM004-PT-001", strategy: "SEMANTIC_FACT_POOL", targetRelations: ["web_core_concept"], genericRelationMinimums: { web_core_concept: 6 }, versionScoped: false, genericRuntimeAllowed: true, rationale: ["Six distinct Web core concepts support same-neighborhood semantic distractors without cross-topic padding."] },
  { taskId: "COM004-PT-002", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["browser_search_classification"], controlledPoolIds: ["browser-search-service-identities"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["Browser/search-engine classification contains repeated class labels; controlled identity pools prevent duplicate-value or category-leak options."] },
  { taskId: "COM004-PT-003", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["transfer_direction"], controlledPoolIds: ["upload-download-directions"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["Upload/download is a deliberate two-way contrast; distractors must be direction-aware rather than padded with unrelated transfer terms."] },
  { taskId: "COM004-PT-004", strategy: "SEMANTIC_FACT_POOL", targetRelations: ["browser_action_effect"], genericRelationMinimums: { browser_action_effect: 4 }, versionScoped: false, genericRuntimeAllowed: true, rationale: ["Refresh, back, forward and bookmark provide four durable browser-action effects."] },
  { taskId: "COM004-PT-005", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["url_identity_component"], controlledPoolIds: ["url-identity-components", "url-component-snippets"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["URL expansion/purpose and component roles share one task but need surface-aware option types; a raw mixed semantic pool would combine expansions with component definitions."] },
  { taskId: "COM004-PT-006", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["http_https_awareness"], controlledPoolIds: ["http-https-statements"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["HTTP/HTTPS is a tightly guarded conceptual contrast, including the explicit rule that HTTPS alone does not prove site legitimacy."] },
  { taskId: "COM004-PT-007", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["email_address_header_role"], controlledPoolIds: ["email-address-components", "email-header-fields"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["Address structure and To/CC/BCC/Subject share a message-header model but require field-type-aware distractors, especially for recipient visibility."] },
  { taskId: "COM004-PT-008", strategy: "SEMANTIC_FACT_POOL", targetRelations: ["email_folder_state"], genericRelationMinimums: { email_folder_state: 6 }, versionScoped: false, genericRuntimeAllowed: true, rationale: ["Six mailbox-state concepts provide a strong exact-relation pool while preserving the Outbox-versus-Sent distinction."] },
  { taskId: "COM004-PT-009", strategy: "SEMANTIC_FACT_POOL", targetRelations: ["email_action_feature_role"], genericRelationMinimums: { email_action_feature_role: 5 }, versionScoped: false, genericRuntimeAllowed: true, rationale: ["Reply, Reply All, Forward, Attachment and Signature provide five distinct operation/feature roles."] },
  { taskId: "COM004-PT-010", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["email_protocol_fact"], controlledPoolIds: ["email-protocol-acronyms", "email-protocol-roles"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["SMTP/POP3/IMAP form a three-protocol closed set; expansions and role statements must not be mixed blindly in one option pool."] },
  { taskId: "COM004-PT-011", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["digital_service_concept"], controlledPoolIds: ["ecommerce-egovernance-concepts"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["E-commerce versus e-governance is a small conceptual contrast; controlled examples preserve commercial-versus-government-service semantics."] },
  { taskId: "COM004-PT-012", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["netiquette_principle"], controlledPoolIds: ["netiquette-safe-scenarios"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["Scenario options must be objectively answerable from the approved principles; subjective etiquette wording fails closed."] },
  { taskId: "COM004-PT-013", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["otp_qr_fact"], controlledPoolIds: ["otp-qr-identities", "otp-qr-purposes"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["OTP and QR are a two-concept set with different expansions and functions; controlled pools avoid mixing an acronym expansion with a purpose statement."] },
  { taskId: "COM004-PT-014", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["upi_fact"], controlledPoolIds: ["upi-expansion", "upi-durable-purposes"], versionScoped: true, genericRuntimeAllowed: false, rationale: ["UPI has one canonical expansion plus slowly mutable capability facts; controlled review synthesis keeps canonical naming and validity scope explicit."] },
  { taskId: "COM004-PT-015", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["aeps_ussd_fact"], controlledPoolIds: ["aeps-ussd-expansions", "aeps-ussd-purpose-contrast"], versionScoped: true, genericRuntimeAllowed: false, rationale: ["AePS and USSD form a useful contrast, but expansions, authentication model and access-channel properties require typed option pools."] },
  { taskId: "COM004-PT-016", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["payment_tool_concept"], controlledPoolIds: ["card-wallet-pos-identities", "payment-tool-purpose-contrast"], versionScoped: true, genericRuntimeAllowed: false, rationale: ["Cards, prepaid instruments, wallets and PoS share a payment-tool neighborhood but mixed relation surfaces need controlled type-aware options."] },
  { taskId: "COM004-PT-017", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["internet_banking_concept"], controlledPoolIds: ["internet-banking-service-concepts"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["The task establishes the broad e-banking service concept; controlled banking/non-banking service options are safer than generic value swapping."] },
  { taskId: "COM004-PT-018", strategy: "HYBRID_REVIEW_SYNTHESIS", targetRelations: ["fund_transfer_service_fact"], controlledPoolIds: ["neft-rtgs-imps-expansions", "fund-transfer-settlement-models", "fund-transfer-authorities"], versionScoped: true, genericRuntimeAllowed: false, rationale: ["NEFT/RTGS/IMPS facts mix expansions, settlement models and ownership; review synthesis must choose distractors from the same semantic subtype and respect validity scope."] },
  { taskId: "COM004-PT-019", strategy: "CONTROLLED_CLOSED_SET", targetRelations: ["digital_service_safe_action"], controlledPoolIds: ["digital-banking-safe-unsafe-actions"], versionScoped: false, genericRuntimeAllowed: false, rationale: ["Multiple safe actions can all be true, so scenario distractors must pair one clearly appropriate action with source-approved unsafe alternatives rather than treating other safe actions as wrong."] },
] as const;

function taskFacts(taskId: string): KnowledgeFact[] {
  return COM004_CANDIDATE_FACTS.filter((fact) => fact.tags.includes(`provisional-task:${taskId}`));
}

export function auditCom004DistractorReadiness() {
  const issues: string[] = [];
  const saturation = auditCom004CorpusSaturation();
  if (!saturation.valid) issues.push(...saturation.issues.map((issue) => `CORPUS:${issue}`));

  const provisionalTaskIds = COM004_PROVISIONAL_LEARNER_TASKS
    .filter((task) => task.disposition === "PROVISIONAL_TASK")
    .map((task) => task.provisionalTaskId)
    .sort();
  const strategyTaskIds = COM004_DISTRACTOR_READINESS.map((entry) => entry.taskId).sort();
  if (JSON.stringify(provisionalTaskIds) !== JSON.stringify(strategyTaskIds)) {
    issues.push("DISTRACTOR_STRATEGIES_DO_NOT_COVER_PROVISIONAL_TASKS_EXACTLY");
  }

  const seenTasks = new Set<string>();
  for (const entry of COM004_DISTRACTOR_READINESS) {
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

  const semanticTaskIds = COM004_DISTRACTOR_READINESS.filter((entry) => entry.strategy === "SEMANTIC_FACT_POOL").map((entry) => entry.taskId);
  const controlledTaskIds = COM004_DISTRACTOR_READINESS.filter((entry) => entry.strategy !== "SEMANTIC_FACT_POOL").map((entry) => entry.taskId);
  const versionScopedTaskIds = COM004_DISTRACTOR_READINESS.filter((entry) => entry.versionScoped).map((entry) => entry.taskId);

  if (semanticTaskIds.length !== 4) issues.push(`UNEXPECTED_SEMANTIC_TASK_COUNT:${semanticTaskIds.length}`);
  if (controlledTaskIds.length !== 15) issues.push(`UNEXPECTED_CONTROLLED_TASK_COUNT:${controlledTaskIds.length}`);
  if (versionScopedTaskIds.length !== 4) issues.push(`UNEXPECTED_VERSION_SCOPED_TASK_COUNT:${versionScopedTaskIds.length}`);

  return {
    valid: issues.length === 0,
    taskCount: COM004_DISTRACTOR_READINESS.length,
    semanticTaskIds,
    controlledTaskIds,
    versionScopedTaskIds,
    sharedEngineChangeRequired: false,
    controlledPoolImplementationRequired: true,
    permanentQlCount: 0,
    allocationReady: issues.length === 0,
    productionEligible: false,
    nextGate: issues.length === 0 ? "COM004_EDITORIAL_FACT_REVIEW_AND_PERMANENT_QL_ALLOCATION" as const : "BLOCKED" as const,
    issues,
  };
}
