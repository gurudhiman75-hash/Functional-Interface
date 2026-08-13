export const MAL_CP006_WAVE02_RUNTIME_ID = "MAL-CP006-EN-OPEN-DISCOVERY-WAVE02-V1" as const;

export const MAL_CP006_WAVE02_PROTOTYPE_IDS = [
  "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO",
  "MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT",
] as const;

export type MalCp006Wave02PrototypeId = (typeof MAL_CP006_WAVE02_PROTOTYPE_IDS)[number];

export interface MalCp006Wave02SourceFixture {
  sourceId: string;
  publisher: string;
  title: string;
  url: string;
  disposition: "CP006_DIRECT" | "CP006_SUPPORTING" | "CP001_BOUNDARY" | "SUPPLEMENTAL";
  supportedPrototypeIds: readonly MalCp006Wave02PrototypeId[];
  observedContract: string;
  ownershipReason: string;
  witnessAnswer?: string;
}

export const MAL_CP006_WAVE02_SOURCE_FIXTURES: readonly MalCp006Wave02SourceFixture[] = [
  {
    sourceId: "CAT-2025-S3-ROUND-TRIP-INVERSE",
    publisher: "CAT 2025 Slot 3 / Cracku archive",
    title: "Equal round-trip transfer with target final ratio",
    url: "https://cracku.in/cat-2025-slot-3-quant-question-paper-solved",
    disposition: "CP006_DIRECT",
    supportedPrototypeIds: ["MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO"],
    observedContract: "Unknown amount moves A to B; after B is mixed, the same amount moves from current B back to A; the target ratio in A determines the amount.",
    ownershipReason: "The return sample uses B's changed composition, so a stage ledger is essential.",
    witnessAnswer: "16 litres",
  },
  {
    sourceId: "IBPS-RRB-CLERK-2019-MAINS-CHAIN",
    publisher: "IBPS RRB Clerk 2019 Mains / EduRev archive",
    title: "A to B to C chain with remaining component in B",
    url: "https://edurev.in/p/256292/IBPS-RRB-Clerk-2019-Mains-Question-Paper-with-Solutions",
    disposition: "CP006_DIRECT",
    supportedPrototypeIds: ["MAL-CP006-PROT-CHANGED-SOURCE-CHAIN-REMAINING-COMPONENT"],
    observedContract: "A pure liquid is moved to B; a sample of current B then moves to empty C; C's ratio determines the variable and the requested amount remains in B.",
    ownershipReason: "The second transfer must sample B after B has changed.",
    witnessAnswer: "64 ml",
  },
  {
    sourceId: "BANK-MAINS-2021-GENERAL-INVERSE-RETURN",
    publisher: "BankersAdda bank-mains practice",
    title: "Known first transfer, unknown current return transfer",
    url: "https://www.bankersadda.com/quantitative-aptitude-quiz-for-bank-mains-exams-2021-21st-january/",
    disposition: "CP006_SUPPORTING",
    supportedPrototypeIds: ["MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO"],
    observedContract: "A known first transfer changes B; an unknown amount from current B returns to A; A's final ratio determines the return amount.",
    ownershipReason: "This supports the general inverse form beyond the equal-round-trip CAT witness.",
    witnessAnswer: "50 litres",
  },
  {
    sourceId: "BANK-MAINS-2022-FULL-CONTENT-CHAIN",
    publisher: "BankersAdda IBPS PO Mains practice",
    title: "Half A to B, all B to C, all C to A",
    url: "https://www.bankersadda.com/quantitative-aptitude-quiz-for-ibps-po-mains-2022-6th-january/",
    disposition: "CP001_BOUNDARY",
    supportedPrototypeIds: [],
    observedContract: "Material passes through three vessels but all contents of B and C ultimately join A.",
    ownershipReason: "The intermediate order telescopes to an aggregate blend; current-source sampling is not required for the answer.",
  },
  {
    sourceId: "RBI-ASSISTANT-2022-STAGED-BLEND",
    publisher: "RBI Assistant Mains memory-based / Testbook archive",
    title: "B added to A, proportional removal, then C added",
    url: "https://testbook.com/question-answer/there-are-three-vessels-a-b-and-c-having-milk-to--6090f03c43656df6d24357e5",
    disposition: "CP001_BOUNDARY",
    supportedPrototypeIds: [],
    observedContract: "B is blended into A, a proportional amount is removed from A, then C is blended into A.",
    ownershipReason: "The removal preserves A's ratio and no changed source is later sampled into a distinct vessel; this is compound blending/scaling.",
  },
  {
    sourceId: "THREE-VESSEL-CAPACITY-CHAIN-SUPPLEMENTAL",
    publisher: "EduRev mixture practice",
    title: "Capacity-constrained A to B to C redistribution",
    url: "https://edurev.in/test/31158/Test-Mixture-Problems",
    disposition: "SUPPLEMENTAL",
    supportedPrototypeIds: [],
    observedContract: "Capacity deficits force partial A-to-B and current B-to-C transfers, followed by redistribution of current C.",
    ownershipReason: "Genuine CP006 topology, but retained only as a non-target-exam gap signal in this wave.",
  },
] as const;

export const MAL_CP006_WAVE02_DIRECT_SOURCE_IDS = MAL_CP006_WAVE02_SOURCE_FIXTURES
  .filter((fixture) => fixture.disposition === "CP006_DIRECT")
  .map((fixture) => fixture.sourceId);
