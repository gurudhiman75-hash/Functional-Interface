import {
  SAP_CP002_ALL_PROTOTYPE_IDS,
  SAP_CP002_TEMPLATE_MAP,
  type SapCp002EnglishTemplateId,
  type SapCp002PrototypeId,
} from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  generateSapCp002EnglishFrozenCandidate,
  type SapCp002EnglishFrozenCandidate,
} from "../english-freeze/runtime";

export const SAP_CP002_PERMANENT_QL_IDS = [
  "SAP-QL-017", "SAP-QL-018", "SAP-QL-019", "SAP-QL-020", "SAP-QL-021", "SAP-QL-022",
  "SAP-QL-023", "SAP-QL-024", "SAP-QL-025", "SAP-QL-026", "SAP-QL-027", "SAP-QL-028",
  "SAP-QL-029", "SAP-QL-030", "SAP-QL-031", "SAP-QL-032", "SAP-QL-033",
] as const;

export type SapCp002PermanentQlId = (typeof SAP_CP002_PERMANENT_QL_IDS)[number];

export const SAP_CP002_TEMPLATE_TO_PERMANENT_QL: Readonly<Record<SapCp002EnglishTemplateId, SapCp002PermanentQlId>> = Object.freeze({
  "SAP-CP002-TPL-FRACTION-SUM-DIFFERENCE": "SAP-QL-017",
  "SAP-CP002-TPL-FRACTION-PRODUCT-CANCELLATION": "SAP-QL-018",
  "SAP-CP002-TPL-FRACTION-DIVISION-RECIPROCAL": "SAP-QL-019",
  "SAP-CP002-TPL-MIXED-FRACTION-CHAIN-WITH-INTEGER-PART": "SAP-QL-020",
  "SAP-CP002-TPL-MIXED-NUMBER-CONVERSION": "SAP-QL-021",
  "SAP-CP002-TPL-FRACTION-OF-GROUPED-FRACTION": "SAP-QL-022",
  "SAP-CP002-TPL-NESTED-COMPLEX-FRACTION": "SAP-QL-023",
  "SAP-CP002-TPL-SIGNED-FRACTION-BRACKET-SCOPE": "SAP-QL-024",
  "SAP-CP002-TPL-PRODUCT-SUM-DIFFERENCE": "SAP-QL-025",
  "SAP-CP002-TPL-RECIPROCAL-EXPRESSION": "SAP-QL-026",
  "SAP-CP002-TPL-FRACTION-COMPLEMENT": "SAP-QL-027",
  "SAP-CP002-TPL-BOUNDED-CONTINUED-FRACTION": "SAP-QL-028",
  "SAP-CP002-TPL-MISSING-FRACTION-COMPONENT": "SAP-QL-029",
  "SAP-CP002-TPL-MISSING-FRACTION-OPERAND": "SAP-QL-030",
  "SAP-CP002-TPL-COMPARE-EVALUATED-FRACTIONS": "SAP-QL-031",
  "SAP-CP002-TPL-SELECT-EQUIVALENT-REDUCED-FRACTION": "SAP-QL-032",
  "SAP-CP002-TPL-IDENTIFY-INCORRECT-FRACTION-STEP": "SAP-QL-033",
});

export interface SapCp002PermanentEnglishPackage extends Omit<SapCp002EnglishFrozenCandidate, "permanentQlId" | "lifecycle"> {
  readonly permanentQlId: SapCp002PermanentQlId;
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly lifecycle: {
    readonly permanentQlId: SapCp002PermanentQlId;
    readonly identityStatus: "PERMANENT_ID_ALLOCATED";
    readonly contentStatus: "ENGLISH_FROZEN";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

export function generateSapCp002PermanentEnglishPackage(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002PermanentEnglishPackage {
  const frozen = generateSapCp002EnglishFrozenCandidate(prototypeId, seed);
  const permanentQlId = SAP_CP002_TEMPLATE_TO_PERMANENT_QL[SAP_CP002_TEMPLATE_MAP[prototypeId]];
  return Object.freeze({
    ...frozen,
    permanentQlId,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE",
    lifecycle: Object.freeze({
      permanentQlId,
      identityStatus: "PERMANENT_ID_ALLOCATED",
      contentStatus: "ENGLISH_FROZEN",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  });
}

export function generateSapCp002PermanentEnglishSweep(seedsPerPrototype: number): readonly SapCp002PermanentEnglishPackage[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const items: SapCp002PermanentEnglishPackage[] = [];
  for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) items.push(generateSapCp002PermanentEnglishPackage(prototypeId, seed));
  }
  return Object.freeze(items);
}
