import type { AnalogyDirection, SemanticFact } from "./types";

function semanticKey(left: string, relation: string, direction: AnalogyDirection): string {
  return `${left.trim().toLocaleLowerCase("en-IN")}::${relation}::${direction}`;
}

export class SemanticFactRegistry {
  private readonly facts = new Map<string, SemanticFact>();

  constructor(initialFacts: readonly SemanticFact[] = []) {
    for (const fact of initialFacts) this.register(fact);
  }

  register(fact: SemanticFact): void {
    if (!fact.id.trim() || !fact.left.trim() || !fact.right.trim() || !fact.relation.trim()) {
      throw new Error("Semantic facts require id, left, right and relation.");
    }
    if (!fact.predicate.trim() || !fact.explanation.trim()) {
      throw new Error(`Semantic fact ${fact.id} requires natural-language predicate and explanation text.`);
    }
    if (!fact.answerCategory.trim() || !fact.sourceCategory.trim()) {
      throw new Error(`Semantic fact ${fact.id} requires source and answer categories.`);
    }
    if (!/^\d+\.\d+\.\d+$/.test(fact.version)) {
      throw new Error(`Semantic fact ${fact.id} has an invalid semantic version.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fact.verifiedAt)) {
      throw new Error(`Semantic fact ${fact.id} has an invalid verification date.`);
    }
    if (fact.validFrom && !/^\d{4}-\d{2}-\d{2}$/.test(fact.validFrom)) {
      throw new Error(`Semantic fact ${fact.id} has an invalid validFrom date.`);
    }
    if (fact.validTo && !/^\d{4}-\d{2}-\d{2}$/.test(fact.validTo)) {
      throw new Error(`Semantic fact ${fact.id} has an invalid validTo date.`);
    }
    const key = semanticKey(fact.left, fact.relation, fact.direction);
    const existing = this.facts.get(key);
    if (existing && existing.id !== fact.id) {
      throw new Error(`Conflicting semantic fact for ${key}: ${existing.id} and ${fact.id}`);
    }
    this.facts.set(key, Object.freeze({ ...fact }));
  }

  resolve(left: string, relation: string, direction: AnalogyDirection = "FORWARD"): SemanticFact | undefined {
    const fact = this.facts.get(semanticKey(left, relation, direction));
    return fact?.status === "CURATED" ? fact : undefined;
  }

  allCurated(locale?: SemanticFact["locale"]): readonly SemanticFact[] {
    return [...this.facts.values()].filter(
      (fact) => fact.status === "CURATED" && (!locale || fact.locale === locale),
    );
  }
}

export function applySemanticFact(fact: SemanticFact, input: string): string {
  const normalized = input.trim().toLocaleLowerCase("en-IN");
  const expected = (fact.direction === "FORWARD" ? fact.left : fact.right).trim().toLocaleLowerCase("en-IN");
  if (normalized !== expected) {
    throw new Error(`Fact ${fact.id} cannot be applied to ${input} in ${fact.direction} direction.`);
  }
  return fact.direction === "FORWARD" ? fact.right : fact.left;
}
