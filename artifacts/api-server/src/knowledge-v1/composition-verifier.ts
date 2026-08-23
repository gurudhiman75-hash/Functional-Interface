import type { KnowledgeFact, KnowledgeFactValue } from "./types";

export type KnowledgeStatementClaim = {
  statementId: string;
  factId: string;
  claimedValue: KnowledgeFactValue;
};

export type KnowledgeStatementTruth = {
  statementId: string;
  factId: string;
  true: boolean;
};

export type KnowledgeCombinationOption = {
  optionId: string;
  trueStatementIds: string[];
};

function normalizedText(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("en");
}

function valueKey(value: KnowledgeFactValue): string {
  switch (value.kind) {
    case "text":
      return `text:${normalizedText(value.text.en)}`;
    case "entity_ref":
      return `entity:${value.entityId}`;
    case "number":
      return `number:${value.value}:${normalizedText(value.unit ?? "")}`;
    case "date":
      return `date:${value.isoDate}`;
    case "boolean":
      return `boolean:${value.value}`;
  }
}

export function verifyKnowledgeStatements(
  facts: readonly KnowledgeFact[],
  claims: readonly KnowledgeStatementClaim[],
): KnowledgeStatementTruth[] {
  const factById = new Map(facts.map((fact) => [fact.factId, fact]));
  const statementIds = new Set<string>();

  return claims.map((claim) => {
    if (!claim.statementId.trim()) {
      throw new Error("Knowledge composition statementId is required.");
    }
    if (statementIds.has(claim.statementId)) {
      throw new Error(`Duplicate knowledge composition statementId ${claim.statementId}.`);
    }
    statementIds.add(claim.statementId);

    const fact = factById.get(claim.factId);
    if (!fact) {
      throw new Error(`Unknown knowledge composition fact ${claim.factId}.`);
    }

    return {
      statementId: claim.statementId,
      factId: claim.factId,
      true: valueKey(fact.value) === valueKey(claim.claimedValue),
    };
  });
}

function normalizedStatementSet(ids: readonly string[]) {
  return [...new Set(ids)].sort();
}

function sameStringArray(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function resolveKnowledgeCombinationAnswer(
  truths: readonly KnowledgeStatementTruth[],
  options: readonly KnowledgeCombinationOption[],
) {
  if (options.length < 2) {
    throw new Error("Knowledge composition requires at least two combination options.");
  }

  const knownStatementIds = new Set(truths.map((entry) => entry.statementId));
  const trueStatementIds = normalizedStatementSet(
    truths.filter((entry) => entry.true).map((entry) => entry.statementId),
  );
  const optionIds = new Set<string>();
  const signatures = new Set<string>();
  const matches: number[] = [];

  options.forEach((option, index) => {
    if (!option.optionId.trim()) {
      throw new Error("Knowledge combination optionId is required.");
    }
    if (optionIds.has(option.optionId)) {
      throw new Error(`Duplicate knowledge combination optionId ${option.optionId}.`);
    }
    optionIds.add(option.optionId);

    if (new Set(option.trueStatementIds).size !== option.trueStatementIds.length) {
      throw new Error(`Knowledge combination option ${option.optionId} repeats a statement.`);
    }
    for (const statementId of option.trueStatementIds) {
      if (!knownStatementIds.has(statementId)) {
        throw new Error(
          `Knowledge combination option ${option.optionId} references unknown statement ${statementId}.`,
        );
      }
    }

    const normalized = normalizedStatementSet(option.trueStatementIds);
    const signature = normalized.join("|");
    if (signatures.has(signature)) {
      throw new Error("Knowledge combination options contain duplicate truth combinations.");
    }
    signatures.add(signature);

    if (sameStringArray(normalized, trueStatementIds)) {
      matches.push(index);
    }
  });

  if (matches.length !== 1) {
    throw new Error(
      `Knowledge composition answer must be unique; found ${matches.length} matching options.`,
    );
  }

  return {
    correctIndex: matches[0]!,
    correctOptionId: options[matches[0]!]!.optionId,
    trueStatementIds,
  };
}

export function verifyKnowledgeComposition(
  facts: readonly KnowledgeFact[],
  claims: readonly KnowledgeStatementClaim[],
  options: readonly KnowledgeCombinationOption[],
) {
  const truths = verifyKnowledgeStatements(facts, claims);
  const answer = resolveKnowledgeCombinationAnswer(truths, options);
  return {
    truths,
    ...answer,
  };
}
