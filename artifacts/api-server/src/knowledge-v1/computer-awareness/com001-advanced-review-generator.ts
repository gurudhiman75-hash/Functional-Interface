import { deterministicPick, deterministicShuffle } from "../deterministic";
import {
  verifyKnowledgeComposition,
  verifyKnowledgeStatements,
  type KnowledgeStatementClaim,
} from "../composition-verifier";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact, KnowledgeFactValue } from "../types";
import { COM001_EDITORIAL_REVIEWABLE_FACTS } from "./com001-editorial-review";
import {
  COM001_STORAGE_DEVICE_PROFILES,
  solveStorageProfileConstraints,
  type Com001StorageProfileConstraints,
} from "./com001-storage-device-profiles";
import type { Com001ReviewQuestion } from "./com001-review-types";

function fact(factId: string) {
  const match = COM001_EDITORIAL_REVIEWABLE_FACTS.find(
    (entry) => entry.factId === factId,
  );
  if (!match) throw new Error(`COM-001 editorial review fact ${factId} is unavailable`);
  return match;
}

function finalize(
  qlId: string,
  seed: string,
  stem: string,
  options: string[],
  correctIndex: number,
  canonicalAnswer: string,
  explanation: string,
  sourceIds: string[],
  sourceFactIds: string[],
  solverAuthority: string,
): Com001ReviewQuestion {
  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
  });
  return {
    questionId: `COM001-REVIEW-${qlId}-${seed}`,
    qlId,
    stem,
    options,
    correctIndex,
    canonicalAnswer,
    explanation,
    sourceIds: [...new Set(sourceIds)],
    sourceFactIds: [...new Set(sourceFactIds)],
    solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

type BackupTemplate = {
  stem: string;
  constraints: Com001StorageProfileConstraints;
};

const BACKUP_TEMPLATES: BackupTemplate[] = [
  {
    stem: "Which storage option is magnetic, sequential-access, removable, and suited to both backup and archival use?",
    constraints: {
      medium: "magnetic",
      accessPattern: "sequential",
      removable: true,
      requiredRoles: ["backup", "archive"],
    },
  },
  {
    stem: "Which removable magnetic storage option provides random access and is used for both backup and recovery?",
    constraints: {
      medium: "magnetic",
      accessPattern: "random",
      removable: true,
      requiredRoles: ["backup", "recovery"],
    },
  },
  {
    stem: "Which removable optical option is intended for archival, write-once retention?",
    constraints: {
      medium: "optical",
      removable: true,
      requiredRoles: ["archive", "write-once-retention"],
    },
  },
  {
    stem: "Which removable solid-state option supports random access and can be used as backup media?",
    constraints: {
      medium: "solid-state",
      accessPattern: "random",
      removable: true,
      requiredRoles: ["backup"],
    },
  },
];

function readableRole(role: string) {
  switch (role) {
    case "archive":
      return "archival use";
    case "write-once-retention":
      return "write-once retention";
    case "recovery":
      return "recovery";
    default:
      return role;
  }
}

function backupExplanation(label: string, constraints: Com001StorageProfileConstraints) {
  const properties = [
    constraints.medium ? `${constraints.medium} storage` : undefined,
    constraints.accessPattern ? `${constraints.accessPattern} access` : undefined,
    constraints.removable === true ? "removable media" : undefined,
    ...(constraints.requiredRoles ?? []).map(readableRole),
  ].filter(Boolean);
  return `${label} satisfies all the given conditions: ${properties.join(", ")}. Therefore, ${label} is the correct answer.`;
}

export function generateCom001Ql007Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-007";
  const template = deterministicPick(BACKUP_TEMPLATES, `${seed}:template`);
  const matches = solveStorageProfileConstraints(template.constraints);
  if (matches.length !== 1) {
    throw new Error(`COM-001 QL-007 constraint set resolved to ${matches.length} profiles`);
  }
  const target = matches[0]!;
  const wrongProfiles = deterministicShuffle(
    COM001_STORAGE_DEVICE_PROFILES.filter(
      (profile) => profile.profileId !== target.profileId,
    ),
    `${seed}:wrong`,
  ).slice(0, 3);
  const records = deterministicShuffle(
    [
      { text: target.label, correct: true },
      ...wrongProfiles.map((profile) => ({ text: profile.label, correct: false })),
    ],
    `${seed}:options`,
  );
  const options = records.map((entry) => entry.text);
  const correctIndex = records.findIndex((entry) => entry.correct);
  return finalize(
    qlId,
    seed,
    template.stem,
    options,
    correctIndex,
    target.label,
    backupExplanation(target.label, template.constraints),
    target.sourceRefs.map((entry) => entry.sourceId),
    [],
    "STORAGE_PROFILE_CONSTRAINTS",
  );
}

type CompositionTemplate = {
  claims: KnowledgeStatementClaim[];
};

const primaryLayer: KnowledgeFactValue = {
  kind: "entity_ref",
  entityId: "memory-layer:primary",
  label: { en: "primary memory" },
};
const romFamily: KnowledgeFactValue = {
  kind: "entity_ref",
  entityId: "computer-class:rom",
  label: { en: "ROM" },
};

const COMPOSITION_TEMPLATES: CompositionTemplate[] = [
  {
    claims: [
      { statementId: "I", factId: "com001-ram-volatility", claimedValue: { kind: "text", text: { en: "volatile" } } },
      { statementId: "II", factId: "com001-rom-volatility", claimedValue: { kind: "text", text: { en: "volatile" } } },
      { statementId: "III", factId: "com001-byte-bits", claimedValue: { kind: "number", value: 8, unit: "bits" } },
      { statementId: "IV", factId: "com001-ssd-medium", claimedValue: { kind: "text", text: { en: "magnetic" } } },
    ],
  },
  {
    claims: [
      { statementId: "I", factId: "com001-ram-layer", claimedValue: primaryLayer },
      { statementId: "II", factId: "com001-hdd-layer", claimedValue: primaryLayer },
      { statementId: "III", factId: "com001-eprom-subtype", claimedValue: romFamily },
      { statementId: "IV", factId: "com001-cd-medium", claimedValue: { kind: "text", text: { en: "solid-state" } } },
    ],
  },
  {
    claims: [
      { statementId: "I", factId: "com001-cpu-cache-volatility", claimedValue: { kind: "text", text: { en: "volatile" } } },
      { statementId: "II", factId: "com001-eeprom-volatility", claimedValue: { kind: "text", text: { en: "volatile" } } },
      { statementId: "III", factId: "com001-sd-card-medium-expansion", claimedValue: { kind: "text", text: { en: "solid-state" } } },
      { statementId: "IV", factId: "com001-gib-bytes", claimedValue: { kind: "number", value: 1_073_741_824, unit: "bytes" } },
    ],
  },
];

function valueText(value: KnowledgeFactValue) {
  if (value.kind === "text") return value.text.en;
  if (value.kind === "entity_ref") return value.label.en;
  if (value.kind === "number") {
    const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value.value);
    return `${formatted} ${value.unit ?? ""}`.trim();
  }
  if (value.kind === "date") return value.isoDate;
  return value.value ? "true" : "false";
}

function statementText(claim: KnowledgeStatementClaim) {
  const target = fact(claim.factId);
  const entity = target.entity.label.en;
  switch (target.relation) {
    case "has_volatility":
      return `${entity} is ${valueText(claim.claimedValue)}.`;
    case "classified_as_memory_layer":
      return `${entity} is classified as ${valueText(claim.claimedValue)}.`;
    case "is_subtype_of":
      return `${entity} is a subtype of ${valueText(claim.claimedValue)}.`;
    case "uses_storage_medium":
      return `${entity} uses ${valueText(claim.claimedValue)} storage technology.`;
    case "capacity_unit_relation":
      return `${entity} equals ${valueText(claim.claimedValue)}.`;
    default:
      return `${entity}: ${valueText(claim.claimedValue)}.`;
  }
}

function actualFactSentence(target: KnowledgeFact) {
  const entity = target.entity.label.en;
  switch (target.relation) {
    case "has_volatility":
      return `${entity} is ${valueText(target.value)}`;
    case "classified_as_memory_layer":
      return `${entity} is classified as ${valueText(target.value)}`;
    case "is_subtype_of":
      return `${entity} is a subtype of ${valueText(target.value)}`;
    case "uses_storage_medium":
      return `${entity} uses ${valueText(target.value)} storage technology`;
    case "capacity_unit_relation":
      return `${entity} equals ${valueText(target.value)}`;
    default:
      return `${entity} has the value ${valueText(target.value)}`;
  }
}

function subsets(ids: readonly string[]) {
  const output: string[][] = [];
  const count = 1 << ids.length;
  for (let mask = 0; mask < count; mask += 1) {
    const selected = ids.filter((_, index) => (mask & (1 << index)) !== 0);
    output.push(selected);
  }
  return output;
}

function combinationLabel(ids: readonly string[]) {
  if (ids.length === 0) return "None of the statements";
  if (ids.length === 1) return `${ids[0]} only`;
  return `${ids.slice(0, -1).join(", ")} and ${ids.at(-1)} only`;
}

export function generateCom001Ql008Review(seed: string): Com001ReviewQuestion {
  const qlId = "COM-001-QL-008";
  const template = deterministicPick(COMPOSITION_TEMPLATES, `${seed}:template`);
  const facts = template.claims.map((claim) => fact(claim.factId));
  const truthVector = verifyKnowledgeStatements(facts, template.claims);
  const trueIds = truthVector
    .filter((entry) => entry.true)
    .map((entry) => entry.statementId)
    .sort();
  const trueSignature = trueIds.join("|");
  const alternatives = deterministicShuffle(
    subsets(template.claims.map((claim) => claim.statementId))
      .filter((entry) => entry.join("|") !== trueSignature),
    `${seed}:combination-alternatives`,
  ).slice(0, 3);
  const combinations = deterministicShuffle(
    [trueIds, ...alternatives],
    `${seed}:combination-options`,
  );
  const optionModels = combinations.map((trueStatementIds, index) => ({
    optionId: `OPT-${index + 1}`,
    trueStatementIds,
  }));
  const result = verifyKnowledgeComposition(facts, template.claims, optionModels);
  const options = combinations.map(combinationLabel);
  const canonicalAnswer = options[result.correctIndex]!;
  const stem = [
    "Consider the following statements:",
    ...template.claims.map((claim) => `${claim.statementId}. ${statementText(claim)}`),
    "Which of the above statements are correct?",
  ].join("\n");
  const explanationParts = result.truths.map((entry) => {
    const target = fact(entry.factId);
    return `${entry.statementId} is ${entry.true ? "correct" : "incorrect"} because ${actualFactSentence(target)}.`;
  });
  const explanation = `${explanationParts.join(" ")} Therefore, ${combinationLabel(trueIds)} are correct.`;
  return finalize(
    qlId,
    seed,
    stem,
    options,
    result.correctIndex,
    canonicalAnswer,
    explanation,
    facts.map((entry) => entry.source.sourceId),
    facts.map((entry) => entry.factId),
    "MULTI_FACT_COMPOSITION",
  );
}
