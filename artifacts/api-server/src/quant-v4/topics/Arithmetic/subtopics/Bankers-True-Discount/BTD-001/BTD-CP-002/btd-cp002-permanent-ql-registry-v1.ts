import { BTD_CP002_CANDIDATE_CONTRACTS, type BtdCp002CandidateId } from "./btd-cp002-source-saturation-v2";

export type BtdPermanentQlId = `BTD-QL-${string}`;
export type BtdPermanentQlEntry = Readonly<{
  qlId: BtdPermanentQlId;
  origin: "BTD-CP-001" | "BTD-CP-002";
  sourceAuthorityId: string;
  semanticSignature: string;
  answerSemantic: string;
  title: string;
}>;

const CP001: readonly BtdPermanentQlEntry[] = Object.freeze([
  Object.freeze({ qlId: "BTD-QL-001", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-001", semanticSignature: "GIVEN_FACE_RATE_TIME__ASK_PW", answerSemantic: "PRESENT_WORTH", title: "Face value + rate + time -> present worth" }),
  Object.freeze({ qlId: "BTD-QL-002", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-002", semanticSignature: "GIVEN_FACE_RATE_TIME__ASK_TD", answerSemantic: "TRUE_DISCOUNT", title: "Face value + rate + time -> true discount" }),
  Object.freeze({ qlId: "BTD-QL-003", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-003", semanticSignature: "GIVEN_FACE_RATE_TIME__ASK_BD", answerSemantic: "BANKERS_DISCOUNT", title: "Face value + rate + time -> banker's discount" }),
  Object.freeze({ qlId: "BTD-QL-004", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-004", semanticSignature: "GIVEN_FACE_RATE_TIME__ASK_BG", answerSemantic: "BANKERS_GAIN", title: "Face value + rate + time -> banker's gain" }),
  Object.freeze({ qlId: "BTD-QL-005", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-005", semanticSignature: "GIVEN_FACE_TD__ASK_BD", answerSemantic: "BANKERS_DISCOUNT", title: "Face value + true discount -> banker's discount" }),
  Object.freeze({ qlId: "BTD-QL-006", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-006", semanticSignature: "GIVEN_BD_TD_RATIO_TIME__ASK_RATE", answerSemantic: "RATE_PERCENT", title: "BD:TD ratio + time -> annual rate" }),
  Object.freeze({ qlId: "BTD-QL-007", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-007", semanticSignature: "GIVEN_BG_RATE_TIME__ASK_PW", answerSemantic: "PRESENT_WORTH", title: "Banker's gain + rate + time -> present worth" }),
  Object.freeze({ qlId: "BTD-QL-008", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-008", semanticSignature: "GIVEN_BILL_DATES_RATE__ASK_BD", answerSemantic: "BANKERS_DISCOUNT", title: "Bill dates + rate -> banker's discount with grace days" }),
  Object.freeze({ qlId: "BTD-QL-009", origin: "BTD-CP-001", sourceAuthorityId: "BTD-PROT-009", semanticSignature: "GIVEN_BD_TD_RATIO_R_EQ_KT__ASK_RATE", answerSemantic: "RATE_PERCENT", title: "BD:TD ratio + R=kT -> annual rate" }),
]);

const CP002_IDS: readonly BtdCp002CandidateId[] = Object.freeze([
  "BTD-CAND-010", "BTD-CAND-011", "BTD-CAND-012", "BTD-CAND-013", "BTD-CAND-014", "BTD-CAND-015", "BTD-CAND-016", "BTD-CAND-017", "BTD-CAND-018", "BTD-CAND-019", "BTD-CAND-020",
]);
const CP002_TITLES = Object.freeze({
  "BTD-CAND-010": "Present worth + banker's gain -> true discount",
  "BTD-CAND-011": "Two-bill weighted BD system -> face-value difference",
  "BTD-CAND-012": "Banker's discount + true discount -> face value",
  "BTD-CAND-013": "Banker's discount + rate + time -> true discount",
  "BTD-CAND-014": "BD:TD ratio + annual rate -> time",
  "BTD-CAND-015": "Banker's gain + rate + time -> true discount",
  "BTD-CAND-016": "Present worth + true discount -> banker's discount",
  "BTD-CAND-017": "Present worth + true discount -> banker's gain",
  "BTD-CAND-018": "Equal BD/TD across two faces -> time",
  "BTD-CAND-019": "Banker's discount + true discount + time -> annual rate",
  "BTD-CAND-020": "True discount + rate + time -> banker's discount",
} as const);

const CP002: readonly BtdPermanentQlEntry[] = Object.freeze(CP002_IDS.map((candidateId, index) => {
  const contract = BTD_CP002_CANDIDATE_CONTRACTS[candidateId];
  return Object.freeze({
    qlId: `BTD-QL-${String(index + 10).padStart(3, "0")}` as BtdPermanentQlId,
    origin: "BTD-CP-002" as const,
    sourceAuthorityId: candidateId,
    semanticSignature: contract.signature,
    answerSemantic: contract.answerSemantic,
    title: CP002_TITLES[candidateId],
  });
}));

export const BTD_PERMANENT_QL_REGISTRY_VERSION = "BTD-001-PERMANENT-QL-REGISTRY-v1" as const;
export const BTD_PERMANENT_QL_REGISTRY: readonly BtdPermanentQlEntry[] = Object.freeze([...CP001, ...CP002]);
export const BTD_PERMANENT_ALLOCATION_BOUNDARY = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-002" as const,
  permanentQlCount: 20 as const,
  firstQl: "BTD-QL-001" as const,
  lastQl: "BTD-QL-020" as const,
  nextFreeQl: "BTD-QL-021" as const,
  permanentQlAllocationAuthorized: true as const,
  contentFreezeStatus: "REVIEW_LOCKED" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});
