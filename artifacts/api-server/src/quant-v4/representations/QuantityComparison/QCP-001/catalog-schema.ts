export const QCP_CATALOG_PATTERNS = [
  "BA24-01",
  "BA24-02",
  "BA24-03",
  "BA24-04",
  "BA24-06",
  "BA24-10",
  "BA24-11",
  "BA24-12",
  "BA24-13",
  "BA24-14",
  "BA24-15",
  "BA24-16",
  "BA24-18",
  "BA24-19",
  "BA24-20",
  "BA22-01",
  "BA22-02",
  "BA22-03",
  "BA22-04",
  "BA22-05",
] as const;
export type QcpCatalogPattern = (typeof QCP_CATALOG_PATTERNS)[number];
export interface QcpCatalogState {
  readonly kind: "SOURCE_CATALOG";
  readonly pattern: QcpCatalogPattern;
  readonly quantity: "I" | "II";
  readonly scale: number;
  readonly rootIndex: 0 | 1;
}
export const QCP_CATALOG_EXCLUSIONS = Object.freeze({
  "BA24-05": "Remaining time versus total elapsed time reverses the relation.",
  "BA24-07": "Published key conflicts with exact equality (108 = 108).",
  "BA24-08": "Published key conflicts with the numerical comparison (10 < 20).",
  "BA24-09": "Single-colour versus colour-union event reverses the relation.",
  "BA24-17":
    "The work group after the changes is unspecified and reverses the relation.",
});
export function catalogRootCount(
  s: Pick<QcpCatalogState, "pattern" | "quantity">,
): number {
  return s.pattern === "BA24-13" ||
    (s.pattern === "BA24-03" && s.quantity === "II")
    ? 2
    : 1;
}
export function validateCatalogState(s: QcpCatalogState): void {
  if (
    !s ||
    s.kind !== "SOURCE_CATALOG" ||
    !QCP_CATALOG_PATTERNS.includes(s.pattern) ||
    !["I", "II"].includes(s.quantity) ||
    !Number.isSafeInteger(s.scale) ||
    s.scale < 1 ||
    s.scale > (s.pattern === "BA24-02" ? 2 : 3) ||
    !Number.isSafeInteger(s.rootIndex) ||
    s.rootIndex < 0 ||
    s.rootIndex >= catalogRootCount(s)
  )
    throw Error("Unsupported reviewed-source state");
}
export function catalogTruthOwners(
  pattern: QcpCatalogPattern,
): readonly (
  | "ALG-002"
  | "PNC-001"
  | "INT-001"
  | "TMW-001"
  | "MEN-001"
  | "TSD-002"
)[] {
  if (["BA24-03", "BA24-10", "BA22-04"].includes(pattern))
    return ["ALG-002", "PNC-001"];
  if (pattern === "BA22-02") return ["ALG-002", "INT-001"];
  if (pattern === "BA24-15") return ["ALG-002", "TMW-001"];
  if (pattern === "BA24-04") return ["ALG-002", "MEN-001"];
  if (["BA24-01", "BA24-16"].includes(pattern)) return ["ALG-002", "TSD-002"];
  return ["ALG-002"];
}
