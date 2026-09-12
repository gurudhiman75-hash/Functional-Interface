import {
  ANA_CP010_SEMANTIC_RELATIONS,
  type AnaCp010SemanticRelationId,
} from "./semantic-registry";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN");
}

export function independentlyValidateAnaCp010SemanticPair(
  relationId: AnaCp010SemanticRelationId,
  left: string,
  right: string,
  locale: "en-IN" | "hi-IN" | "pa-IN" = "en-IN",
): boolean {
  const relation = ANA_CP010_SEMANTIC_RELATIONS.find((entry) => entry.id === relationId);
  if (!relation) return false;
  return relation.facts.some((entry) =>
    normalize(entry.left[locale]) === normalize(left)
      && normalize(entry.right[locale]) === normalize(right),
  );
}
