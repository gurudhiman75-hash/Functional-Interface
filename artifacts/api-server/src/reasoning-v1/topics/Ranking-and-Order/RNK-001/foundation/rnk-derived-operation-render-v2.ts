import {
  rnkDerivedOperationSurface,
  type RnkDerivedOperationKind,
} from "./rnk-derived-object-pool-v2";
import type { RnkObjectLocale } from "./rnk-object-pool-v2";

export type RnkDerivedOperationVariables = Readonly<Record<string, string | number>>;

const NEUTRAL_TRANSFER_TEMPLATES: Readonly<Record<RnkObjectLocale, readonly string[]>> = {
  en: [
    "A transfer of {X} is made from {A} to {B}.",
    "{X} is transferred from {A} to {B}.",
  ],
  hi: [
    "{A} से {B} को {X} की राशि हस्तांतरित होती है।",
    "{X} की राशि {A} से {B} को स्थानांतरित होती है।",
  ],
  pa: [
    "{A} ਤੋਂ {B} ਨੂੰ {X} ਦੀ ਰਕਮ ਟ੍ਰਾਂਸਫਰ ਹੁੰਦੀ ਹੈ।",
    "{X} ਦੀ ਰਕਮ {A} ਤੋਂ {B} ਨੂੰ ਟ੍ਰਾਂਸਫਰ ਹੁੰਦੀ ਹੈ।",
  ],
};

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function substitute(template: string, variables: RnkDerivedOperationVariables): string {
  let output = template;
  for (const [key, rawValue] of Object.entries(variables)) {
    output = output.replaceAll(`{${key}}`, String(rawValue));
  }
  const unresolved = output.match(/\{[A-Z][A-Z0-9_]*\}/g);
  if (unresolved) {
    throw new Error(`Unresolved RNK derived-operation variable(s): ${unresolved.join(", ")}`);
  }
  return output.normalize("NFC");
}

export function renderRnkDerivedOperation(
  kind: RnkDerivedOperationKind,
  locale: RnkObjectLocale,
  seed: number,
  variables: RnkDerivedOperationVariables,
): string {
  const templates = kind === "TRANSFER"
    ? NEUTRAL_TRANSFER_TEMPLATES[locale]
    : rnkDerivedOperationSurface(kind).templates[locale];
  if (templates.length === 0) {
    throw new Error(`No RNK derived-operation templates for ${kind}/${locale}.`);
  }
  const template = templates[mix32(seed ^ kind.length ^ locale.length) % templates.length]!;
  return substitute(template, variables);
}

export const RNK_DERIVED_OPERATION_REQUIRED_VARIABLES: Readonly<Record<RnkDerivedOperationKind, readonly string[]>> = {
  TRANSFER: ["A", "B", "X"],
  MULTIPLIER: ["A", "B", "K"],
  FRACTION_OF: ["A", "B", "F"],
  EXACT_DIFFERENCE: ["A", "B", "D"],
  SUM_COMPARISON: ["A", "B", "C"],
  CATEGORY_RATIO: ["A", "B", "K", "R"],
  CATEGORY_AHEAD_COUNT: ["A", "P", "N"],
  BOUNDED_CONSECUTIVE_VALUES: ["L", "H"],
} as const;
