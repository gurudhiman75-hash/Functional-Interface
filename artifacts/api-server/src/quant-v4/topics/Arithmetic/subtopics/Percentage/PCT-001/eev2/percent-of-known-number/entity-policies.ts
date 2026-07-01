export type RealismEntityKind =
  | "ABSTRACT"
  | "MONEY"
  | "DISCRETE_COUNT"
  | "MARKS";

export interface EntityRealismPolicy {
  entityKind: RealismEntityKind;
  contextLabel: string;
  singularLabel: string;
  pluralLabel: string;
  preserveContext: boolean;
  integerPresentation: boolean;
  allowDecimals: boolean;
}

const DISCRETE_ENTITIES = new Set([
  "students",
  "employees",
  "books",
  "trees",
  "animals",
  "workers",
  "families",
  "people",
  "votes",
]);

function singularize(label: string): string {
  if (label === "families") return "family";
  if (label.endsWith("ies")) return `${label.slice(0, -3)}y`;
  if (label.endsWith("s")) return label.slice(0, -1);
  return label;
}

export function resolveEntityPolicy(
  semanticUnit: string,
  contextLabel?: string,
): EntityRealismPolicy {
  const normalizedContext = (contextLabel ?? semanticUnit)
    .trim()
    .toLowerCase();

  if (semanticUnit === "abstract-number") {
    return {
      entityKind: "ABSTRACT",
      contextLabel: "number",
      singularLabel: "number",
      pluralLabel: "number",
      preserveContext: false,
      integerPresentation: false,
      allowDecimals: true,
    };
  }

  if (semanticUnit === "rupees") {
    return {
      entityKind: "MONEY",
      contextLabel: normalizedContext === "rupees" ? "amount" : normalizedContext,
      singularLabel: "rupee",
      pluralLabel: "rupees",
      preserveContext: true,
      integerPresentation: false,
      allowDecimals: true,
    };
  }

  if (normalizedContext === "marks" || semanticUnit === "marks") {
    return {
      entityKind: "MARKS",
      contextLabel: "marks",
      singularLabel: "mark",
      pluralLabel: "marks",
      preserveContext: true,
      integerPresentation: false,
      allowDecimals: true,
    };
  }

  const label = DISCRETE_ENTITIES.has(normalizedContext)
    ? normalizedContext
    : semanticUnit;
  return {
    entityKind: "DISCRETE_COUNT",
    contextLabel: label,
    singularLabel: singularize(label),
    pluralLabel: label,
    preserveContext: true,
    integerPresentation: true,
    allowDecimals: false,
  };
}

