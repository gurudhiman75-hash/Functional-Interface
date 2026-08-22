export const ALG_PERMANENT_ALLOCATION_AUTHORITY =
  "ALG-PERMANENT-QL-ALLOCATION-V2" as const;

export const ALG_PERMANENT_QL_IDS = Array.from(
  { length: 43 },
  (_unused, index) => `ALG-QL-${String(index + 1).padStart(3, "0")}`,
) as readonly `ALG-QL-${string}`[];

export type AlgPermanentQlId = `ALG-QL-${string}`;
export type AlgFreezeKey = `F-C${string}`;
export type AlgPermanentTemplateId = `ALG-CP${string}-TPL-${string}`;
export type AlgPermanentSolveModeId = `ALG-CP${string}-SM-${string}`;

export interface AlgPermanentContractDefinition {
  readonly freezeKey: AlgFreezeKey;
  readonly packageId: "ALG-001" | "ALG-002";
  readonly cpId: `ALG-CP-${string}`;
  readonly title: string;
  readonly templateCode: string;
  readonly evidenceLevel: "DIRECT_OR_TARGET_EVIDENCE" | "TARGET_TAXONOMY" | "COMPARABLE_RECRUITMENT_EVIDENCE";
}

export const ALG_RETAINED_CONTRACTS = [
  ["F-C001", "ALG-001", "ALG-CP-001", "Coefficient extraction", "COEFFICIENT-EXTRACTION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C002", "ALG-001", "ALG-CP-001", "Simplify / expand algebraic expression", "SIMPLIFY-EXPAND-EXPRESSION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C003", "ALG-001", "ALG-CP-001", "Evaluate one-variable algebraic expression", "EVALUATE-ONE-VARIABLE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C004", "ALG-001", "ALG-CP-001", "Evaluate multi-variable algebraic expression", "EVALUATE-MULTI-VARIABLE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C005", "ALG-001", "ALG-CP-002", "Square-sum identity from sum/product", "SQUARE-SUM-IDENTITY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C006", "ALG-001", "ALG-CP-002", "Cube-sum identity from sum/product", "CUBE-SUM-IDENTITY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C007", "ALG-001", "ALG-CP-002", "Reciprocal square transform", "RECIPROCAL-SQUARE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C008", "ALG-001", "ALG-CP-002", "Reciprocal cube transform", "RECIPROCAL-CUBE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C009", "ALG-001", "ALG-CP-002", "Higher reciprocal power via recurrence", "RECIPROCAL-HIGHER-POWER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C010", "ALG-001", "ALG-CP-002", "Scaled reciprocal transform", "SCALED-RECIPROCAL", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C011", "ALG-001", "ALG-CP-003", "Symmetric square / pairwise-product conversion", "SYMMETRIC-SQUARE-PAIRWISE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C012", "ALG-001", "ALG-CP-003", "Zero-sum cubic identity", "ZERO-SUM-CUBIC", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C013", "ALG-001", "ALG-CP-003", "Cyclic reciprocal multi-variable relation", "CYCLIC-RECIPROCAL", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C014", "ALG-001", "ALG-CP-004", "Identity-form recognition / factorisation", "IDENTITY-FACTORISATION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C015", "ALG-001", "ALG-CP-004", "Generic quadratic factorisation", "QUADRATIC-FACTORISATION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C016", "ALG-001", "ALG-CP-005", "Remainder under a linear divisor", "LINEAR-DIVISOR-REMAINDER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C017", "ALG-001", "ALG-CP-005", "Parameter from remainder/factor condition", "REMAINDER-PARAMETER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C018", "ALG-001", "ALG-CP-005", "Two parameters from two remainder/factor conditions", "TWO-REMAINDER-PARAMETERS", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C019", "ALG-001", "ALG-CP-005", "Parameter plus common remainder across two polynomials", "COMMON-REMAINDER-PARAMETER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C020", "ALG-002", "ALG-CP-006", "Solve one-variable linear equation", "LINEAR-EQUATION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C021", "ALG-002", "ALG-CP-007", "Solve unique 2×2 linear system", "LINEAR-SYSTEM-UNIQUE", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C022", "ALG-002", "ALG-CP-007", "Classify 2×2 system solution state", "LINEAR-SYSTEM-CLASSIFY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C023", "ALG-002", "ALG-CP-007", "Parameter for system consistency / inconsistency", "LINEAR-SYSTEM-PARAMETER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C024", "ALG-002", "ALG-CP-008", "Solve rational equation with original-domain filtering", "RATIONAL-EQUATION-DOMAIN", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C025", "ALG-002", "ALG-CP-009", "Solve / classify quadratic across root states", "QUADRATIC-SOLVE-CLASSIFY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C026", "ALG-002", "ALG-CP-009", "Parameter for equal roots", "QUADRATIC-EQUAL-ROOT-PARAMETER", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C027", "ALG-002", "ALG-CP-009", "Parameter / coefficient from root condition", "QUADRATIC-ROOT-CONDITION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C028", "ALG-002", "ALG-CP-010", "Direct quadratic Vieta invariant / infer missing root", "VIETA-DIRECT-QUADRATIC", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C029", "ALG-002", "ALG-CP-010", "Derived symmetric quadratic-root expression", "VIETA-DERIVED-SYMMETRIC", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C030", "ALG-002", "ALG-CP-010", "Construct quadratic from sum and product", "VIETA-CONSTRUCT-SUM-PRODUCT", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C031", "ALG-002", "ALG-CP-010", "Construct quadratic under controlled root transformation", "ROOT-TRANSFORMATION", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C032", "ALG-002", "ALG-CP-011", "Banking comparison of all admissible quadratic roots", "BANKING-QUADRATIC-COMPARISON", "TARGET_TAXONOMY"],
  ["F-C033", "ALG-002", "ALG-CP-012", "Solve linear inequality constraints", "LINEAR-INEQUALITY", "TARGET_TAXONOMY"],
  ["F-C034", "ALG-002", "ALG-CP-012", "Solve quadratic inequality / sign region", "QUADRATIC-INEQUALITY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C035", "ALG-002", "ALG-CP-012", "Find quadratic extremum", "QUADRATIC-EXTREMUM", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C036", "ALG-002", "ALG-CP-012", "Parameter range for global quadratic sign", "QUADRATIC-GLOBAL-SIGN", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C037", "ALG-002", "ALG-CP-013", "Solve absolute-value equation", "ABSOLUTE-EQUATION", "COMPARABLE_RECRUITMENT_EVIDENCE"],
  ["F-C038", "ALG-002", "ALG-CP-013", "Solve absolute-value inequality", "ABSOLUTE-INEQUALITY", "COMPARABLE_RECRUITMENT_EVIDENCE"],
  ["F-C039", "ALG-002", "ALG-CP-014", "Quantity comparison across all admissible states", "QUANTITY-COMPARISON", "TARGET_TAXONOMY"],
  ["F-C040", "ALG-002", "ALG-CP-014", "Algebraic data sufficiency", "DATA-SUFFICIENCY", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C041", "ALG-002", "ALG-CP-007", "Solve unique 3×3 linear system", "LINEAR-SYSTEM-3X3", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C042", "ALG-002", "ALG-CP-010", "Direct cubic Vieta invariant", "VIETA-DIRECT-CUBIC", "DIRECT_OR_TARGET_EVIDENCE"],
  ["F-C043", "ALG-002", "ALG-CP-012", "Symmetric positive-variable extremum under fixed sum", "SYMMETRIC-FIXED-SUM-EXTREMUM", "DIRECT_OR_TARGET_EVIDENCE"],
] as const satisfies readonly (readonly [AlgFreezeKey, "ALG-001" | "ALG-002", `ALG-CP-${string}`, string, string, AlgPermanentContractDefinition["evidenceLevel"]])[];

export interface AlgPermanentAllocationEntry {
  readonly authority: typeof ALG_PERMANENT_ALLOCATION_AUTHORITY;
  readonly qlId: AlgPermanentQlId;
  readonly freezeKey: AlgFreezeKey;
  readonly packageId: "ALG-001" | "ALG-002";
  readonly cpId: `ALG-CP-${string}`;
  readonly templateId: AlgPermanentTemplateId;
  readonly solveModeId: AlgPermanentSolveModeId;
  readonly title: string;
  readonly evidenceLevel: AlgPermanentContractDefinition["evidenceLevel"];
  readonly sourceAuthority: readonly string[];
  readonly allocationStatus: "SOURCE_AUDITED_PERMANENT_IDENTITY_ALLOCATED_INACTIVE";
  readonly permanentIdentityFrozen: true;
  readonly semanticContractFrozen: true;
  readonly englishImplementationFrozen: false;
  readonly multilingualImplementationFrozen: false;
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

if (ALG_RETAINED_CONTRACTS.length !== 43) throw new Error("Algebra retained contract count must be exactly 43");
if (ALG_PERMANENT_QL_IDS.length !== ALG_RETAINED_CONTRACTS.length) throw new Error("Algebra permanent QL allocation count mismatch");

const cpCounters = new Map<string, number>();

export const ALG_PERMANENT_ALLOCATION: readonly AlgPermanentAllocationEntry[] = ALG_RETAINED_CONTRACTS.map((contract, index) => {
  const [freezeKey, packageId, cpId, title, templateCode, evidenceLevel] = contract;
  const cpNumber = cpId.slice(-3);
  const localIndex = (cpCounters.get(cpId) ?? 0) + 1;
  cpCounters.set(cpId, localIndex);
  return {
    authority: ALG_PERMANENT_ALLOCATION_AUTHORITY,
    qlId: ALG_PERMANENT_QL_IDS[index]!,
    freezeKey,
    packageId,
    cpId,
    templateId: `ALG-CP${cpNumber}-TPL-${templateCode}` as AlgPermanentTemplateId,
    solveModeId: `ALG-CP${cpNumber}-SM-${String(localIndex).padStart(3, "0")}` as AlgPermanentSolveModeId,
    title,
    evidenceLevel,
    sourceAuthority: [
      "ALG-FINAL-RETAINED-CONTRACT-MATRIX-V2",
      "ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2",
      "ALG-FINAL-SOURCE-GAP-AUDIT-V2",
      freezeKey,
    ],
    allocationStatus: "SOURCE_AUDITED_PERMANENT_IDENTITY_ALLOCATED_INACTIVE",
    permanentIdentityFrozen: true,
    semanticContractFrozen: true,
    englishImplementationFrozen: false,
    multilingualImplementationFrozen: false,
    active: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
});

const byQlId = new Map(ALG_PERMANENT_ALLOCATION.map((row) => [row.qlId, row]));
const byFreezeKey = new Map(ALG_PERMANENT_ALLOCATION.map((row) => [row.freezeKey, row]));

export function getAlgPermanentAllocation(qlId: AlgPermanentQlId): AlgPermanentAllocationEntry {
  const row = byQlId.get(qlId);
  if (!row) throw new Error(`Unknown Algebra permanent QL ID: ${qlId}`);
  return row;
}

export function getAlgPermanentAllocationForFreezeKey(freezeKey: AlgFreezeKey): AlgPermanentAllocationEntry {
  const row = byFreezeKey.get(freezeKey);
  if (!row) throw new Error(`Unknown Algebra freeze key: ${freezeKey}`);
  return row;
}

export function auditAlgPermanentAllocation() {
  const ids = ALG_PERMANENT_ALLOCATION.map((row) => row.qlId);
  const freezeKeys = ALG_PERMANENT_ALLOCATION.map((row) => row.freezeKey);
  const expectedIds = Array.from({ length: 43 }, (_unused, index) => `ALG-QL-${String(index + 1).padStart(3, "0")}`);
  return {
    authority: ALG_PERMANENT_ALLOCATION_AUTHORITY,
    permanentQlCount: ids.length,
    firstQlId: ids[0],
    lastQlId: ids.at(-1),
    uniqueQlCount: new Set(ids).size,
    uniqueFreezeKeyCount: new Set(freezeKeys).size,
    alg001Count: ALG_PERMANENT_ALLOCATION.filter((row) => row.packageId === "ALG-001").length,
    alg002Count: ALG_PERMANENT_ALLOCATION.filter((row) => row.packageId === "ALG-002").length,
    cp015Count: ALG_PERMANENT_ALLOCATION.filter((row) => row.cpId === "ALG-CP-015").length,
    contiguousIdRange: JSON.stringify(ids) === JSON.stringify(expectedIds),
    lifecycleLocked: ALG_PERMANENT_ALLOCATION.every((row) =>
      row.permanentIdentityFrozen &&
      row.semanticContractFrozen &&
      !row.englishImplementationFrozen &&
      !row.multilingualImplementationFrozen &&
      !row.active &&
      !row.questionStudioDiscoverable &&
      row.questionBankStatus === "NOT_STORED" &&
      row.testEligibility === "INELIGIBLE" &&
      !row.publiclyPublishable
    ),
  } as const;
}
