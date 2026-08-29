import { createHash } from "node:crypto";
import { buildBtdPermanentQuestionV1 } from "../BTD-CP-003/btd-cp003-permanent-generator-v1";
import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";

export const BTD_CP005_ENGLISH_FREEZE_VERSION = "BTD-001-CP005-ENGLISH-FREEZE-v1" as const;

export const BTD_CP005_ENGLISH_FREEZE_MANIFEST_V1 = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-005" as const,
  language: "en" as const,
  reviewAuthorityHead: "905e7a20d553d8b72ed331d8f4ed1b2cc032a550" as const,
  productionAuthorityHead: "942af7a90bae59870b2d42b4a2d98f6df6780498" as const,
  qlCount: 20 as const,
  seedsPerQl: 200 as const,
  canonicalQuestionCount: 4000 as const,
  chapterFingerprint: "63e9ea9e1199cf5f0f987482649bb8264e35607fb7701e0a4dc3b2f030480659" as const,
  reviewQuestionCount: 60 as const,
  reviewFingerprint: "adda57919034a675af3d10da255040bc0a3f33ab820626180ff5f850e9c14910" as const,
  perQl: Object.freeze({
    "BTD-QL-001": "0f520f42b349b686ae4fb657d4be7220d09d9a8dc9cd6d013530473b80dcffc8",
    "BTD-QL-002": "a58b51ad378e1cecc39bdbab7bb1d46d80cde7e53808f8e85560559bbf5c38c3",
    "BTD-QL-003": "33b922ff902d50623537b585bf75d4ab8af8d854e71075ed2810d95f89ba6ec1",
    "BTD-QL-004": "645b17d7c7364951d4b8faaf8fedab8def7ec8590bd2fa04ce39610687e145f1",
    "BTD-QL-005": "4dc62eb7c31db4ce941f37de5ddff9276df5cb57395fcef008ba2a277a465a15",
    "BTD-QL-006": "4ab9c5d0367ec5496954a7ce7cffd0fb46f0bc863a85e13055c86e9164221804",
    "BTD-QL-007": "f6aa1c230ca7fde942f5bff1d69e5ecaad09050a42727ea4d1957ac3c56fa7a5",
    "BTD-QL-008": "fe09316ebc2c26ef0e00707260afd804f1a6dd15abeff7c9daea5c0139a58c64",
    "BTD-QL-009": "7c4803a903deb59174bd5a332883082d60fe240eb38d5165761472fc2f1fa245",
    "BTD-QL-010": "1090da57195048e062a8ded8c311a80a902a1dc5d26ba4314df4880d676715aa",
    "BTD-QL-011": "001b77d0b80238da6a7454168621c619a38c632d6598279fd325a8af493f436c",
    "BTD-QL-012": "57c8c32d713544e969062705dc221f9ebb0c5529f9c822a9482fa3042a779bc5",
    "BTD-QL-013": "030b9e826f8d5e94bb7e94bf8a69b8459f0bec8e910c13a23e17e762b00dab86",
    "BTD-QL-014": "5e72acfaf581c0b49f0f38b35dba99be95c679bb5199a766f49b9a26358dc131",
    "BTD-QL-015": "27dc1d909770b52801b383d51c3e78506eaf6e319421833e396cd1d8d5759fad",
    "BTD-QL-016": "e96386f21d20e5cf13a9cd6880d6aee9a5246abac2f5cc3cbeaea3dfc720f039",
    "BTD-QL-017": "19236b9013ea140aaad26b8aed05fe7cf4295f55edceebd9714d8b857cb32d00",
    "BTD-QL-018": "54a022eb538781001df7196b750f79653fb5d976794ead82f4e23ac8e64eae52",
    "BTD-QL-019": "c8dad2d8cef508c431730a365c6cd57fb849adfd9fac749af0ff807358251ea9",
    "BTD-QL-020": "aea142ef7538d479b23411953a538bd4dfb5bc832ae75c5c628fdba4414d3882",
  } as const),
});

export const BTD_CP005_ENGLISH_FREEZE_BOUNDARY = Object.freeze({
  permanentQlAllocated: true as const,
  productionAuthorityFrozen: true as const,
  contentFreezeStatus: "FROZEN_EN" as const,
  contentFrozen: true as const,
  frozenLanguage: "en" as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function btdCp005EnglishLearnerPayload(question: any) {
  return {
    qlId: question.qlId,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    sourceAuthorityId: question.sourceAuthorityId,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}

export function btdCp005EnglishContentFingerprint(question: any): string {
  return createHash("sha256").update(canonicalJson(btdCp005EnglishLearnerPayload(question))).digest("hex");
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function buildBtdFrozenEnglishQuestionV1(qlId: BtdPermanentQlId, seed: string) {
  const reviewed = buildBtdPermanentQuestionV1(qlId, seed) as any;
  const learnerPayload = btdCp005EnglishLearnerPayload(reviewed);

  return deepFreeze({
    ...reviewed,
    checkpointId: "BTD-CP-005" as const,
    freezeVersion: BTD_CP005_ENGLISH_FREEZE_VERSION,
    language: "en" as const,
    contentFingerprint: createHash("sha256").update(canonicalJson(learnerPayload)).digest("hex"),
    lifecycle: BTD_CP005_ENGLISH_FREEZE_BOUNDARY,
  });
}
