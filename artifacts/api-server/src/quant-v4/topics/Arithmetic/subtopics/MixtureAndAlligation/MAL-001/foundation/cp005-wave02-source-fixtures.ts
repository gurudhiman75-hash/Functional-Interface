import {
  MAL_CP005_DISCOVERY_PROTOTYPE_IDS,
  type MalCp005DiscoveryPrototypeId,
} from "./cp005-types";

export const MAL_CP005_WAVE02_SOURCE_STATUS =
  "NORMALIZED_REFERENCE_LOCATORS_V1" as const;

export type MalCp005Wave02EvidenceStrength =
  | "DIRECT_EXAM_FORM"
  | "DIRECT_SOLVED_EXAMPLE"
  | "INVERSE_DERIVED_FROM_DIRECT"
  | "RELATED_COMMERCIAL_FORM"
  | "BOUNDARY_AUTHORITY";

export type MalCp005Wave02Ownership =
  | "MAL_CP005_DIRECT"
  | "MAL_CP005_METHOD_SUPPORT"
  | "MAL_CP001_BOUNDARY"
  | "MAL_CP003_BOUNDARY"
  | "PNL_CP005_BOUNDARY";

export interface MalCp005Wave02SourceFixture {
  sourceId: string;
  workTitle: string;
  edition: string;
  publisher: string;
  locator: string;
  itemLabel: string;
  evidenceStrength: MalCp005Wave02EvidenceStrength;
  ownership: MalCp005Wave02Ownership;
  normalizedSummary: string;
}

export const MAL_CP005_WAVE02_SOURCE_FIXTURES = [
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q102",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q102",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "MAL_CP001_BOUNDARY",
    normalizedSummary:
      "Two paid rice lots of equal quantity are blended, the sale rate and overall profit are known, and the missing purchase rate of the second lot is requested. This is paid-blend value reconstruction rather than adulteration.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q103",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q103",
    evidenceStrength: "RELATED_COMMERCIAL_FORM",
    ownership: "MAL_CP005_METHOD_SUPPORT",
    normalizedSummary:
      "Two paid tea varieties with known costs and mixing ratio are sold at a known rate and the overall profit percentage is requested. It validates the weighted-cost commercial method used when a cheaper paid ingredient is present.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q104",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q104",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "MAL_CP001_BOUNDARY",
    normalizedSummary:
      "Three legitimate paid varieties are mixed in a stated ratio and sold for profit. The arithmetic is weighted mixture value, but the context is not adulteration and should not create a dishonest-mixing CP-005 contract.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q107",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q107",
    evidenceStrength: "DIRECT_EXAM_FORM",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "Milk purchase rate, adulterated-mixture selling rate and target profit are given; the water-to-milk proportion is requested. This directly supports the free-adulterant commercial ratio contract.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q108",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q108",
    evidenceStrength: "DIRECT_EXAM_FORM",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "A known quantity of free water is added to milk and the mixture is sold at the original milk rate for a target profit; the original milk quantity is requested.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P387-Q109",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 387",
    itemLabel: "Q109",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "MAL_CP001_BOUNDARY",
    normalizedSummary:
      "Two paid tea brands are blended in a known ratio, sale rate and profit are known, and one ingredient cost is missing. The commercial target first determines a mean cost, after which this is ordinary CP-001 source-value reconstruction.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P388-Q111",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "Profit and Loss sequence immediately after printed p. 387",
    itemLabel: "Q111",
    evidenceStrength: "DIRECT_EXAM_FORM",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "A milk seller both adds free water and raises the selling price, with original quantity and purchase rate given; total profit is requested. Adulteration remains indispensable, so this is a genuine CP-005 price-policy extension.",
  },
  {
    sourceId: "RS-AGGARWAL-QA-2017-P393-Q191",
    workTitle: "Quantitative Aptitude for Competitive Examinations",
    edition: "Revised and Enlarged Edition 2017",
    publisher: "S Chand And Company Limited",
    locator: "printed Profit and Loss p. 393",
    itemLabel: "Q191",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "PNL_CP005_BOUNDARY",
    normalizedSummary:
      "Water adulteration is combined with an 800 ml false measure and a nominal markup. Because short delivery is indispensable to the result, the combined fraud belongs to Profit and Loss dishonest-quantity ownership.",
  },
  {
    sourceId: "ARUN-SHARMA-QA-2018-II40-Q36",
    workTitle: "How to Prepare for Quantitative Aptitude for CAT",
    edition: "8th Edition, 2018",
    publisher: "McGraw Hill Education (India) Private Limited",
    locator: "printed Block II p. II.40",
    itemLabel: "Q36",
    evidenceStrength: "DIRECT_EXAM_FORM",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "Milk is bought at a stated rate, diluted with free water, sold at the same rate and a gain is specified; water added per litre of milk is requested.",
  },
  {
    sourceId: "ARUN-SHARMA-QA-2018-II40-Q37",
    workTitle: "How to Prepare for Quantitative Aptitude for CAT",
    edition: "8th Edition, 2018",
    publisher: "McGraw Hill Education (India) Private Limited",
    locator: "printed Block II p. II.40",
    itemLabel: "Q37",
    evidenceStrength: "DIRECT_EXAM_FORM",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "Free water is mixed with honey and the mixture is sold at the honey cost price for a target gain; the mixing proportion is requested.",
  },
  {
    sourceId: "ARUN-SHARMA-QA-2018-II40-SOL5",
    workTitle: "How to Prepare for Quantitative Aptitude for CAT",
    edition: "8th Edition, 2018",
    publisher: "McGraw Hill Education (India) Private Limited",
    locator: "solution block following printed Block II p. II.40",
    itemLabel: "Solution 5",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "MAL_CP001_BOUNDARY",
    normalizedSummary:
      "A target selling rate and profit determine a required average cost for two paid pulse qualities; one ingredient quantity is known and the other is reconstructed. This is generic paid-blend allocation and remains CP-001.",
  },
  {
    sourceId: "ARUN-SHARMA-QA-2018-II40-SOL7",
    workTitle: "How to Prepare for Quantitative Aptitude for CAT",
    edition: "8th Edition, 2018",
    publisher: "McGraw Hill Education (India) Private Limited",
    locator: "solution block following printed Block II p. II.40",
    itemLabel: "Solution 7",
    evidenceStrength: "BOUNDARY_AUTHORITY",
    ownership: "MAL_CP001_BOUNDARY",
    normalizedSummary:
      "A sale rate and target profit determine the mean cost, then two paid salt qualities are alligated and an unknown quantity is found from a known quantity. It is CP-001 quantity allocation, not dishonest adulteration.",
  },
  {
    sourceId: "DISHA-SSC-MATH-ALLIGATION-P77-SOL4",
    workTitle: "SSC Mathematics Guide",
    edition: "uploaded edition",
    publisher: "Disha Publication",
    locator: "printed Alligations p. 77",
    itemLabel: "Solution 4",
    evidenceStrength: "DIRECT_SOLVED_EXAMPLE",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "The worked solution models paid milk as the zero-profit source and free water as the profit-producing source, obtains a milk-water ratio and then converts it to water percentage in the final mixture.",
  },
  {
    sourceId: "DISHA-SSC-MATH-ALLIGATION-P77-SOL9",
    workTitle: "SSC Mathematics Guide",
    edition: "uploaded edition",
    publisher: "Disha Publication",
    locator: "printed Alligations p. 77",
    itemLabel: "Solution 9",
    evidenceStrength: "DIRECT_SOLVED_EXAMPLE",
    ownership: "MAL_CP005_DIRECT",
    normalizedSummary:
      "A stated selling rate and target profit are converted to the required mixture cost; with free water, the worked solution then obtains the water-to-paid-product ratio.",
  },
] as const satisfies readonly MalCp005Wave02SourceFixture[];

export interface MalCp005Wave02PrototypeEvidence {
  prototypeId: MalCp005DiscoveryPrototypeId;
  normalizedSourceIds: readonly string[];
  evidenceStrength: MalCp005Wave02EvidenceStrength;
  rationale: string;
}

export const MAL_CP005_WAVE02_PROTOTYPE_EVIDENCE: readonly MalCp005Wave02PrototypeEvidence[] = [
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[0],
    normalizedSourceIds: ["ARUN-SHARMA-QA-2018-II40-Q36", "DISHA-SSC-MATH-ALLIGATION-P77-SOL4"],
    evidenceStrength: "INVERSE_DERIVED_FROM_DIRECT",
    rationale: "The forward gain calculation is the exact inverse of source-backed free-water quantity and percentage forms under the same cost-base invariant.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[1],
    normalizedSourceIds: ["ARUN-SHARMA-QA-2018-II40-Q37"],
    evidenceStrength: "DIRECT_EXAM_FORM",
    rationale: "The source directly asks the free-adulterant mixing proportion for a target gain at pure-product cost.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[2],
    normalizedSourceIds: ["ARUN-SHARMA-QA-2018-II40-Q36"],
    evidenceStrength: "DIRECT_EXAM_FORM",
    rationale: "The source directly asks the free-water quantity per known pure-product quantity at a target gain.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[3],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q108"],
    evidenceStrength: "DIRECT_EXAM_FORM",
    rationale: "The source directly asks the original pure quantity from known free water and target profit.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[4],
    normalizedSourceIds: ["DISHA-SSC-MATH-ALLIGATION-P77-SOL4"],
    evidenceStrength: "DIRECT_SOLVED_EXAMPLE",
    rationale: "The worked SSC solution explicitly derives the adulterant share of the final mixture from the commercial condition.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[5],
    normalizedSourceIds: ["DISHA-SSC-MATH-ALLIGATION-P77-SOL4"],
    evidenceStrength: "INVERSE_DERIVED_FROM_DIRECT",
    rationale: "Profit from final-mixture adulterant percentage is the reversible companion of the source-backed percentage derivation.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[6],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q107", "RS-AGGARWAL-QA-2017-P388-Q111"],
    evidenceStrength: "INVERSE_DERIVED_FROM_DIRECT",
    rationale: "Both sources make the selling rate independent of the free-water ratio; the forward profit contract is the same money ledger with the unknown moved to profit.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[7],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q107", "DISHA-SSC-MATH-ALLIGATION-P77-SOL9"],
    evidenceStrength: "DIRECT_EXAM_FORM",
    rationale: "The sources directly support deriving a free-adulterant ratio from pure cost, selling rate and target profit.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[8],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q107", "DISHA-SSC-MATH-ALLIGATION-P77-SOL9"],
    evidenceStrength: "INVERSE_DERIVED_FROM_DIRECT",
    rationale: "Required selling rate is the algebraic inverse of the directly sourced commercial-ratio condition.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[9],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q103"],
    evidenceStrength: "RELATED_COMMERCIAL_FORM",
    rationale: "The source directly validates weighted paid-ingredient cost followed by a commercial profit comparison; CP-005 retention is limited to genuinely lower-grade/adulterant framing.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[10],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q103", "ARUN-SHARMA-QA-2018-II40-SOL5"],
    evidenceStrength: "DIRECT_SOLVED_EXAMPLE",
    rationale: "The target-average-cost and alligation step is directly sourced; CP-005 use must retain an adulterant/lower-grade commercial composition rather than a neutral blend.",
  },
  {
    prototypeId: MAL_CP005_DISCOVERY_PROTOTYPE_IDS[11],
    normalizedSourceIds: ["RS-AGGARWAL-QA-2017-P387-Q103"],
    evidenceStrength: "INVERSE_DERIVED_FROM_DIRECT",
    rationale: "Required selling rate is the inverse commercial direction of the directly sourced weighted-cost profit form.",
  },
];

export function malCp005Wave02SourceById(sourceId: string): MalCp005Wave02SourceFixture | undefined {
  return MAL_CP005_WAVE02_SOURCE_FIXTURES.find((source) => source.sourceId === sourceId);
}
