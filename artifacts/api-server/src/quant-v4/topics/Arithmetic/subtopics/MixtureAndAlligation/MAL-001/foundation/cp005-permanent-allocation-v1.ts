import {
  MAL_CP005_DISCOVERY_PROTOTYPE_IDS,
  type MalCp005DiscoveryPrototypeId,
  type MalCp005TaskDirection,
} from "./cp005-types";
import {
  MAL_CP005_WAVE02_PROTOTYPE_DECISIONS,
  type MalCp005Wave02CoreFamily,
} from "./cp005-wave02-merge-split";
import {
  MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE,
} from "./cp005-wave02-source-fixtures";
import {
  MAL_CP005_WAVE03_CANDIDATE_ID,
  MAL_CP005_WAVE03_SOURCE_ID,
} from "./cp005-wave03-price-change-candidate";

export const MAL_CP005_PERMANENT_ALLOCATION_ID =
  "MAL-CP005-EN-PERMANENT-ALLOCATION-V1" as const;

export const MAL_CP005_PERMANENT_QL_IDS = [
  "MAL-QL-048",
  "MAL-QL-049",
  "MAL-QL-050",
  "MAL-QL-051",
  "MAL-QL-052",
  "MAL-QL-053",
  "MAL-QL-054",
  "MAL-QL-055",
  "MAL-QL-056",
  "MAL-QL-057",
  "MAL-QL-058",
  "MAL-QL-059",
  "MAL-QL-060",
] as const;

export type MalCp005PermanentQlId =
  (typeof MAL_CP005_PERMANENT_QL_IDS)[number];

export type MalCp005PermanentQlTemplateId = `MAL-CP005-QLC-${string}`;
export type MalCp005PermanentSolveModeId = `MAL-CP005-SM-${string}`;
export type MalCp005PermanentAuthorityId =
  | MalCp005DiscoveryPrototypeId
  | typeof MAL_CP005_WAVE03_CANDIDATE_ID;

export type MalCp005PermanentAnswerSemantic =
  | "PROFIT_PERCENT"
  | "PURE_TO_ADULTERANT_RATIO"
  | "PURE_TO_CHEAPER_RATIO"
  | "ADULTERANT_QUANTITY"
  | "PURE_QUANTITY"
  | "ADULTERANT_PERCENT_OF_MIXTURE"
  | "SELLING_RATE"
  | "PROFIT_AMOUNT";

export interface MalCp005PermanentAllocationEntry {
  readonly qlId: MalCp005PermanentQlId;
  readonly packageId: "MAL-001";
  readonly cpId: "MAL-CP-005";
  readonly qlTemplateId: MalCp005PermanentQlTemplateId;
  readonly solveModeId: MalCp005PermanentSolveModeId;
  readonly authorityId: MalCp005PermanentAuthorityId;
  readonly coreFamily: MalCp005Wave02CoreFamily;
  readonly title: string;
  readonly taskDirection: MalCp005TaskDirection;
  readonly answerSemantic: MalCp005PermanentAnswerSemantic;
  readonly governingInvariant: string;
  readonly sourceEvidence: readonly string[];
  readonly mergeDisposition: "RETAIN_DISTINCT_TASK_CONTRACT";
  readonly difficultyPolicy: "STATE_DERIVED_EASY_OR_MEDIUM";
  readonly language: "en";
  readonly locale: "en-IN";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_ALLOCATION";
  readonly permanentIdentityFrozen: true;
  readonly maturity: "ENGLISH_ALLOCATION_FROZEN";
  readonly reviewStatus: "PRODUCT_REVIEW_APPROVED";
  readonly approvalScope: "PERMANENT_IDENTITY_ALLOCATION_ONLY";
  readonly active: false;
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

function evidenceFor(prototypeId: MalCp005DiscoveryPrototypeId): readonly string[] {
  const evidence = MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!evidence) {
    throw new Error(`Missing normalized source evidence for ${prototypeId}.`);
  }
  return evidence.normalizedSourceIds;
}

function retainedCoreFor(prototypeId: MalCp005DiscoveryPrototypeId): MalCp005Wave02CoreFamily {
  const decision = MAL_CP005_WAVE02_PROTOTYPE_DECISIONS.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  if (!decision || decision.decision !== "RETAIN_DISTINCT_TASK_CONTRACT") {
    throw new Error(`${prototypeId} is not retained by the Wave 02 authority.`);
  }
  return decision.coreFamily;
}

const DEFINITIONS = [
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[0],
    template: "PROFIT-FROM-FREE-ADULTERANT-QUANTITIES",
    title: "Find profit percentage from pure-product and free-adulterant quantities",
    taskDirection: "FORWARD",
    answerSemantic: "PROFIT_PERCENT",
    invariant:
      "When the mixture is sold at the pure product cost price, profit percentage equals free-adulterant quantity divided by paid pure quantity, multiplied by 100.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[1],
    template: "RATIO-FROM-TARGET-PROFIT-AT-PURE-COST",
    title: "Find pure-product : free-adulterant ratio for a target profit at cost price",
    taskDirection: "INVERSE",
    answerSemantic: "PURE_TO_ADULTERANT_RATIO",
    invariant:
      "At the pure product cost price, pure product : free adulterant reduces to 100 : target-profit-percent.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[2],
    template: "ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT",
    title: "Find free-adulterant quantity from pure quantity and target profit",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "ADULTERANT_QUANTITY",
    invariant:
      "Required free-adulterant quantity equals paid pure quantity multiplied by target-profit-percent divided by 100.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[3],
    template: "PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT",
    title: "Find original pure quantity from free adulterant and target profit",
    taskDirection: "INVERSE",
    answerSemantic: "PURE_QUANTITY",
    invariant:
      "Paid pure quantity equals free-adulterant quantity multiplied by 100 divided by target-profit-percent.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[4],
    template: "ADULTERANT-PERCENT-FROM-TARGET-PROFIT",
    title: "Find free-adulterant percentage of the final mixture from target profit",
    taskDirection: "INVERSE",
    answerSemantic: "ADULTERANT_PERCENT_OF_MIXTURE",
    invariant:
      "If gain is g percent at pure cost price, adulterant share of the final mixture is 100g/(100+g) percent.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[5],
    template: "PROFIT-FROM-ADULTERANT-PERCENT",
    title: "Find profit percentage from free-adulterant percentage of the final mixture",
    taskDirection: "FORWARD",
    answerSemantic: "PROFIT_PERCENT",
    invariant:
      "If adulterant is a percent of the final mixture, gain percent at pure cost price is 100a/(100-a).",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[6],
    template: "PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE",
    title: "Find profit percentage from a free-adulterant blend and an independent selling rate",
    taskDirection: "FORWARD",
    answerSemantic: "PROFIT_PERCENT",
    invariant:
      "Actual cost is paid pure quantity times cost price; revenue is total mixture quantity times selling price; profit percentage is computed on actual cost.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[7],
    template: "FREE-BLEND-RATIO-FROM-COST-SP-AND-TARGET-PROFIT",
    title: "Find pure-product : free-adulterant ratio from cost price, selling price and target profit",
    taskDirection: "INVERSE",
    answerSemantic: "PURE_TO_ADULTERANT_RATIO",
    invariant:
      "Convert selling price and target profit to the required average cost, then alligate cost price against zero-cost adulterant.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[8],
    template: "FREE-BLEND-SELLING-PRICE-FROM-RATIO-AND-TARGET-PROFIT",
    title: "Find selling price from a free-adulterant ratio and target profit",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "SELLING_RATE",
    invariant:
      "Compute the mixture average cost from the paid pure fraction, then apply the target-profit multiplier to obtain selling price.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[9],
    template: "PROFIT-FROM-CHEAPER-INGREDIENT-BLEND",
    title: "Find profit percentage from a cheaper-ingredient blend and selling price",
    taskDirection: "FORWARD",
    answerSemantic: "PROFIT_PERCENT",
    invariant:
      "Use the weighted paid cost of both ingredients as actual cost, compare with total sale revenue, and compute profit percentage on actual cost.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[10],
    template: "CHEAPER-INGREDIENT-RATIO-FROM-TARGET-PROFIT",
    title: "Find high-cost : cheaper-ingredient ratio for a target profit",
    taskDirection: "INVERSE",
    answerSemantic: "PURE_TO_CHEAPER_RATIO",
    invariant:
      "Convert selling price and target profit to required average cost, then use opposite differences between the two paid ingredient costs and the target mean.",
  },
  {
    authorityId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[11],
    template: "CHEAPER-INGREDIENT-SELLING-PRICE-FROM-RATIO-AND-TARGET-PROFIT",
    title: "Find selling price from a cheaper-ingredient blend ratio and target profit",
    taskDirection: "RECONSTRUCTION",
    answerSemantic: "SELLING_RATE",
    invariant:
      "Compute weighted average paid cost for the stated ratio and apply the target-profit multiplier to obtain selling price.",
  },
  {
    authorityId: MAL_CP005_WAVE03_CANDIDATE_ID,
    template: "PROFIT-AMOUNT-AFTER-FREE-ADULTERATION-AND-PRICE-INCREASE",
    title: "Find total profit amount after free adulteration and a selling-price increase above cost price",
    taskDirection: "FORWARD",
    answerSemantic: "PROFIT_AMOUNT",
    invariant:
      "Actual cost depends only on paid pure quantity; the selling-price increase applies to every unit of the enlarged mixture, so monetary profit retains the paid-quantity scale.",
  },
] as const satisfies readonly {
  authorityId: MalCp005PermanentAuthorityId;
  template: string;
  title: string;
  taskDirection: MalCp005TaskDirection;
  answerSemantic: MalCp005PermanentAnswerSemantic;
  invariant: string;
}[];

if (DEFINITIONS.length !== MAL_CP005_PERMANENT_QL_IDS.length) {
  throw new Error("MAL-CP-005 permanent definition count must equal QL count.");
}

export const MAL_CP005_PERMANENT_ALLOCATION = DEFINITIONS.map(
  (definition, index): MalCp005PermanentAllocationEntry => {
    const isWave03Candidate = definition.authorityId === MAL_CP005_WAVE03_CANDIDATE_ID;
    const coreFamily: MalCp005Wave02CoreFamily = isWave03Candidate
      ? "FREE_ADULTERANT_COMMERCIAL_RATE"
      : retainedCoreFor(definition.authorityId as MalCp005DiscoveryPrototypeId);
    const sourceEvidence = isWave03Candidate
      ? [MAL_CP005_WAVE03_SOURCE_ID]
      : evidenceFor(definition.authorityId as MalCp005DiscoveryPrototypeId);

    return {
      qlId: MAL_CP005_PERMANENT_QL_IDS[index]!,
      packageId: "MAL-001",
      cpId: "MAL-CP-005",
      qlTemplateId: `MAL-CP005-QLC-${definition.template}`,
      solveModeId: `MAL-CP005-SM-${String(index + 1).padStart(3, "0")}`,
      authorityId: definition.authorityId,
      coreFamily,
      title: definition.title,
      taskDirection: definition.taskDirection,
      answerSemantic: definition.answerSemantic,
      governingInvariant: definition.invariant,
      sourceEvidence,
      mergeDisposition: "RETAIN_DISTINCT_TASK_CONTRACT",
      difficultyPolicy: "STATE_DERIVED_EASY_OR_MEDIUM",
      language: "en",
      locale: "en-IN",
      allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_ALLOCATION",
      permanentIdentityFrozen: true,
      maturity: "ENGLISH_ALLOCATION_FROZEN",
      reviewStatus: "PRODUCT_REVIEW_APPROVED",
      approvalScope: "PERMANENT_IDENTITY_ALLOCATION_ONLY",
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
    };
  },
);

export const MAL_CP005_PERMANENT_QL_RANGE = "MAL-QL-048..MAL-QL-060" as const;

const byQl = new Map(
  MAL_CP005_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]),
);

export function getMalCp005PermanentAllocation(
  qlId: MalCp005PermanentQlId,
): MalCp005PermanentAllocationEntry {
  const entry = byQl.get(qlId);
  if (!entry) throw new Error(`Unknown MAL-CP-005 permanent QL: ${qlId}.`);
  return entry;
}
