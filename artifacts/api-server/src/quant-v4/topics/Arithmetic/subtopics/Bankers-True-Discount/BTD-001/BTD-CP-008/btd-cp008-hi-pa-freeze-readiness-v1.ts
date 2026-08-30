import { createHash } from "node:crypto";
import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import type { BtdCp007LanguageV5 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v5";
import { buildBtdLocalizedQuestionV5 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v5";

export const BTD_CP008_HI_PA_FREEZE_READINESS_VERSION = "BTD-001-CP008-HI-PA-FREEZE-READINESS-v1" as const;

export const BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1 = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-008" as const,
  sourceLocalizationVersion: "BTD-001-CP007-HI-PA-LOCALIZATION-v5" as const,
  sourceReviewHead: "677c3f6a982f4a7caa06c8df96fbc5ad9bdb18f6" as const,
  fingerprintProbeHead: "2ba2657c2ca7051adcad9568946c76deabdd3176" as const,
  qlCount: 20 as const,
  languages: Object.freeze(["hi", "pa"] as const),
  seedsPerQlPerLanguage: 100 as const,
  canonicalQuestionCount: 4000 as const,
  reviewQuestionCount: 120 as const,
  chapterFingerprint: "43f0f013d562f7e31382d14dda4fe1db4300566cd91592290dfc7b1f518a0a87" as const,
  reviewFingerprint: "ed36555d23de2e6f764bbc95c4b9a3ea490e260f6415b14ca14d1cc0224fe48b" as const,
  perQlLanguage: Object.freeze({
    "BTD-QL-001:hi": "5599c3b58521f47215723ddf21806def1277baba83a50e56b6980c514ae213c9",
    "BTD-QL-001:pa": "078f98eaa55f9e5f93c77a88bc10557e012e8757fe2bfd47ac18427ec874a18e",
    "BTD-QL-002:hi": "934b9fb6ec4d9f6f9438ccfb3b8b5636bd5ab29eb0f33d5e3bdfd75ae00f1be8",
    "BTD-QL-002:pa": "9001ba9c970e4f0fa417d11cbc9896c43e01e0dd448ed97b10925d0317ce6ce6",
    "BTD-QL-003:hi": "547ffd0b2e57afa965651168aecf8e7fd930262176fca6f5414460bb92993d2d",
    "BTD-QL-003:pa": "9645b9aad3b00388cecc96563518324a156329a6511970652c38611216ea1148",
    "BTD-QL-004:hi": "e58bb27f46dd1020d088a443cd5164422291e580dbece23862d896c1325930f6",
    "BTD-QL-004:pa": "0568999950e6f67ae8701137def6a9b9bca655528d762aaf0e6e70516a3828cd",
    "BTD-QL-005:hi": "fa5fce62ffd60a3ccb32dc318ca625ffbfd96af45410cbbde826761d98ec9f4e",
    "BTD-QL-005:pa": "247020bfcccb965fddd995d0053e90e42cd0378ad7f3acfca15b8a2740228a6a",
    "BTD-QL-006:hi": "d460f4a146db14282e8e8170353c4f2165764fbfd8b01538b194f49ea7646431",
    "BTD-QL-006:pa": "5abd81eca0322f419a661fc47825ecf36a27adcf63af95433be2feb522b839ff",
    "BTD-QL-007:hi": "3e10f495c073d976b5272abdf1991d706ecf8b8757bee6b6b9a7c47945a74380",
    "BTD-QL-007:pa": "41da1c9ba43481b2075b65fa056fc73443e14c8da6689d3e1a64fe935d50e3c3",
    "BTD-QL-008:hi": "df29770b9234bc7ab8f7f771aa6bb402b6d0ff083ba841dcd6917924d1767388",
    "BTD-QL-008:pa": "ee358ea71875085a645f858214e13f504ad52ecee91d7606f0b2b3c12216a663",
    "BTD-QL-009:hi": "440605e9cc4f33a3fef22b627af8ae7be78fc6a45d197eebdf466d01d56c2487",
    "BTD-QL-009:pa": "66b1e6b9a6f97a0c5c5d82a1fe3d91c60ebf16d821f8d00d4175fdb0e40053ec",
    "BTD-QL-010:hi": "88c8169ed28343165adaa656c06c8740275e194fbf3c05d98d2c8b06663b008e",
    "BTD-QL-010:pa": "0b95e79ea40f247e45e7711afaff635569a94858404c19ec0fdaea294bd15305",
    "BTD-QL-011:hi": "ba655a15b96a5356e9ed3394d93aae2d7074bab2e2fd6ea4d5a312616c6bd8aa",
    "BTD-QL-011:pa": "d3cd7fa586fdbf67c15816a2b2276acdd9f00b39d2c602406dd76aba7ecef8ac",
    "BTD-QL-012:hi": "6b56774b3ddc6a534c7729714f8ed00a68616f5bb796cd273343bad05a7a7934",
    "BTD-QL-012:pa": "9d256573e6d7c65cb1db696c9beebca149a6ebfa376c489c49d0231ff00452c4",
    "BTD-QL-013:hi": "388af0d5fe9cda4b665c8bd6f4c7ca3d6160ccadd327646549211cc79c70063b",
    "BTD-QL-013:pa": "99c35d9cc860ec3eba31def5dd9a251c045b24f279049f72dedae5fe10c2b78d",
    "BTD-QL-014:hi": "b1a79ad1cc2b84639e7ba43194efd8225de35b45c9a8dccaa03f2221ed772c1e",
    "BTD-QL-014:pa": "52ec49eef1f8375af30dbf570b3d2bb5b747085c1a9e182df3108c7467b83164",
    "BTD-QL-015:hi": "efc9af011b90200247dad4076d0a9a9962cc7af18f135c2ed82b2c42972b9671",
    "BTD-QL-015:pa": "c034a6d0bac2c638bb1dc4b6a1b968258cd6f2c3a7533d086444657bfe504605",
    "BTD-QL-016:hi": "d4d4e023c833bd1f7d62016163d31b21817b12b35b8d26ef6aea219895acec2d",
    "BTD-QL-016:pa": "e4e1c40a5277d0d2d5525c2dcc39d48b9471fe04923c3e79d6902eb76d98ae65",
    "BTD-QL-017:hi": "29c2f368a32509693bc29297ff4997ae55a753b0a5995e358a9a81ba1a0f56f8",
    "BTD-QL-017:pa": "431a286019622cf02355bcd31c65c6cde97b9e096d2c644bccde37b60968165a",
    "BTD-QL-018:hi": "e184b7632556b9ba170984ab9710f9660a1e971fe72d4d138b90792b1965ba10",
    "BTD-QL-018:pa": "226d8808f1882666760de145673062f6f16046599aaf5be398d367e9314d7311",
    "BTD-QL-019:hi": "fd9bf363c9e4d3ba7a9a81f295459efff37f7fa09a9d35298bc87801aa567dc4",
    "BTD-QL-019:pa": "af3895c9a3bde0441a21a36a770a65521144fba6b0a3547accdecd8f3d07d599",
    "BTD-QL-020:hi": "405482488eac42fbde10dc9152055826667531bb8b72dde5702874416e12d3bc",
    "BTD-QL-020:pa": "9a4d81634279adb7430342c9a4ff23c7e17dddda65e2b0e8d4aa956c41cfbac6",
  } as const),
});

export const BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY = Object.freeze({
  readinessStatus: "READY_FOR_EXPLICIT_FREEZE_APPROVAL" as const,
  multilingualFreezeApproved: false as const,
  multilingualFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

function jsonNative<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function btdCp008HiPaLearnerPayload(question: any) {
  return jsonNative({
    qlId: question.qlId,
    language: question.language,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    sourceStateFingerprint: question.sourceStateFingerprint,
    englishContentFingerprint: question.englishContentFingerprint,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
}

export function btdCp008HiPaContentFingerprint(question: any): string {
  return createHash("sha256").update(canonicalJson(btdCp008HiPaLearnerPayload(question))).digest("hex");
}

export function buildBtdHiPaFreezeReadinessCandidateV1(qlId: BtdPermanentQlId, seed: string, language: BtdCp007LanguageV5) {
  const reviewed = buildBtdLocalizedQuestionV5(qlId, seed, language) as any;
  return Object.freeze({
    ...reviewed,
    checkpointId: "BTD-CP-008" as const,
    readinessVersion: BTD_CP008_HI_PA_FREEZE_READINESS_VERSION,
    readinessFingerprint: btdCp008HiPaContentFingerprint(reviewed),
    lifecycle: BTD_CP008_HI_PA_FREEZE_READINESS_BOUNDARY,
  });
}
