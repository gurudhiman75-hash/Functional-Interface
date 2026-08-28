import { createHash } from "node:crypto";
import {
  SRI_PERMANENT_ALLOCATION_V1,
  type SriPermanentQlId,
} from "./permanent-allocation-v1";
import {
  buildSriPermanentEnglishReviewCorpusV1,
  type SriPermanentEnglishReviewRecordV1,
} from "./permanent-english-review-v1";

export type SriEnglishFingerprintV1 = `sha256:${string}`;

export const SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1: Readonly<Record<SriPermanentQlId, SriEnglishFingerprintV1>> = Object.freeze({
  "SRI-001-QL-001": "sha256:b291f8f9ab0590287ebf85f03a612b29e144b9d983698bcdeacec0f885e10e4e",
  "SRI-001-QL-002": "sha256:d73876a46c48b6ee0b9deaeb9760626236d487034cb89c327d54dca84bf352d3",
  "SRI-001-QL-003": "sha256:b37442f558af69453cb167710b0ef20ea3c013f61ed19d86106db558ff3be1b3",
  "SRI-001-QL-004": "sha256:e2061045350d0b23fe980147fc04819f221e26aad5338d7f883c406e156ae732",
  "SRI-001-QL-005": "sha256:d32fc1672ff910181566af57021e7b1c546610e125b5eafe7139009cedd5752a",
  "SRI-001-QL-006": "sha256:598f21d46effb230d3eb6b66879548576f7414e6a8be090d8c73a8ce8ecefa76",
  "SRI-001-QL-007": "sha256:3e11e91ed678f091afc7f0f0a333070c938199a0d869b50de3b22575128372de",
  "SRI-001-QL-008": "sha256:d3e9908874aad84bdd4eff8d84f059c42d592ec721d27a3d0b99a25a39ba7a47",
  "SRI-001-QL-009": "sha256:cbec1a5fdd7513819a267a50e091e61d5a8c9f012b2c09512140581ae010e080",
  "SRI-001-QL-010": "sha256:3c8490c0c2323acfa971217fe5ad3676d8d5092c7f0f428069ee2c8cf48bf090",
  "SRI-001-QL-011": "sha256:76f28799c08ced9c0b34cfa77f315b3508558c3fdb63ffd9b99df255b7d0dfc1",
  "SRI-001-QL-012": "sha256:6885ea0880371690350e3b0890d59d0cd8616fe03485b4f088145e794e3661d4",
  "SRI-001-QL-013": "sha256:e5c91bcce87fb1a217964776ee923d64e6563d230527e566697f0dc0beaf7be0",
  "SRI-001-QL-014": "sha256:6a9c3c067e03dfaf6072f3b9ad387a18d95ad10d6321a9fad413acd94fce9f30",
  "SRI-001-QL-015": "sha256:3a505215e2655acf8294650499ebc5fcdcbaec5d909a82dbd22e1ac6e095ffd1",
  "SRI-001-QL-016": "sha256:79404523dfa0711af11502d4691340f34a026c7f4b60efe681463b277eec2f60",
  "SRI-001-QL-017": "sha256:548afc2dba91327724afad0f573b7eb5bee55eaf662269c571afa701423a87c5",
  "SRI-001-QL-018": "sha256:17304c4dbe4072e4d1912edba924c73381ab285f716e453c6bcb711aae51b581",
  "SRI-001-QL-019": "sha256:0b2e7319268355fd9e026a421cef72568c0cd0f22b12d1d8ffa0530fcd5921a2",
  "SRI-001-QL-020": "sha256:4c936957448cc15b80f7542a06d6151d91235e8c0d7d134aecf9cac74406c1ea",
  "SRI-001-QL-021": "sha256:d9bf45c48de2df5b6e9189ddc162950d93aea46cf80a4cd0c89d485c89b0d7b4",
  "SRI-001-QL-022": "sha256:8d8fe34de18e128b6b1ec5d359b7c9b80ec7503ae2a6591950e0b20e9150adf5",
  "SRI-001-QL-023": "sha256:6a79ad40d151b9f5dd3e77879a3b429bd104d0e8a8b4b4cb1a7f23a44c3c0c60",
  "SRI-001-QL-024": "sha256:d93799c312cbd220cdc22576f78d900208726097ef1dad6163f62827f57daf45",
  "SRI-001-QL-025": "sha256:b46fbf1f8bfa0dd3ad67e77131679f3ce8fb75d5f9bebe1d6d12bb96b54a229c",
  "SRI-001-QL-026": "sha256:dda4fa27997313f33c366b60df0c33cae37f1f7a25bf82c4decbb4db20e5c11c",
  "SRI-001-QL-027": "sha256:0af5931b0279dcf74d1efa78351ad944bc53885ecb8060661802d817a2f77d60",
  "SRI-001-QL-028": "sha256:fe3df91cb428bfb772e7ab06968a0514e11adb2a5d773fabb518f5b87034b0b2",
  "SRI-001-QL-029": "sha256:4c6b6b420a4834df28186e4c6c9e15c6ab1945ee666faaebd0382fa7a2e159d0",
  "SRI-002-QL-001": "sha256:dbb0a74f7e96a12aeaab143b89fea51f186b3a6a607a8c72ac7e543c1a21bf3d",
  "SRI-002-QL-002": "sha256:e44cee4a86a19fd7f83214b2a01c874aa4e51187c09a4dcf60cb0e9bd158608e",
  "SRI-002-QL-003": "sha256:dfb738317f38aa6c799b60efe8dd3378ae7bf3d0959914dc3950acc9f8542d50",
  "SRI-002-QL-004": "sha256:3d18042000a7391e240995bb2c961c94c1777cb77a529dbd89e0e171367a77f1",
  "SRI-002-QL-005": "sha256:9cf15a0382142f1f43f1e084a2a1edecd671c3f76871ebcf40d752fa389b16a4",
  "SRI-002-QL-006": "sha256:687e0f5f33bc878239d92716a49acb678694b77d9ffb8b95a4dc0909a4739252",
  "SRI-002-QL-007": "sha256:b71c228fc7187fbc677672cb4b69632bf8df9b17f4774ade0ad2fa235d0e9bb9",
  "SRI-002-QL-008": "sha256:8095ee89a862c009726fef3b842ac61695621c063b9ae6929b54ab3387430245",
  "SRI-002-QL-009": "sha256:54301ed1df4068c737c033bfe00d586034aaaab36801f0a6bf7c864511c4054b",
  "SRI-002-QL-010": "sha256:703c023c1416b9ad4f76c2a5cadee53e08117bb7cf0c042972c7d4bb8641401d",
  "SRI-002-QL-011": "sha256:f7391c8e89a86fc180ce5b6e9f88a7f17af54897b381a4f0da06968f6f02876b",
  "SRI-002-QL-012": "sha256:ae34b77740ebb55cf7a9e3b9a48421973bd481e90646bb3810d9b5cab2f24960",
  "SRI-002-QL-013": "sha256:413ed21a9c63b20f155777b40007c6d456b3219c53c9662665a5bf7596238f9f",
  "SRI-002-QL-014": "sha256:ad995b489ff5c320085bf41b9d90c69db8dc44c193b9caf6b959a7de122e5a07",
  "SRI-002-QL-015": "sha256:daed7bb9e32e9af2ecd281c9dd03fb15b9af0a8ffd24b46bb352bc9aa745e7af",
  "SRI-002-QL-016": "sha256:f6caa8cefd10123637fb1674b72c29932e2fdb3bfb4dcf898691266ca7727ff8",
  "SRI-002-QL-017": "sha256:ba5fe45f9122c1e8453c1b7c70abdb7b3eff7581198ffbb22d9d5c00489d1fe7",
  "SRI-002-QL-018": "sha256:0c059933049639a1511d9587e1499b03613c80540ecc921a03047399df7231f9",
  "SRI-002-QL-019": "sha256:1e343a67a4ddfe19cbaffe5216ad8431329721532e9b0bdb5f893dda74813d8e",
  "SRI-002-QL-020": "sha256:e63077447e4b6bc612d5c9948312fa94d79d2f5fd929c9642655dbde9efcdc15",
  "SRI-002-QL-021": "sha256:b5cf9a8f8a4fcb425e40eaf2180108ebbd350f1019ef68010f708d69eca64837",
  "SRI-002-QL-022": "sha256:a6635c4132b114baada537eeea572a861f80f217fa4717c2426552e75205bc16",
  "SRI-002-QL-023": "sha256:dd469fafba682b12bbff0775a8a19e847cf15610ec18f5b7659dc44678f1f597",
  "SRI-002-QL-024": "sha256:e8374c0f8e10a348e8f5ecb14af185fa4645ce439302422c7a45bbfb3c251b22",
  "SRI-002-QL-025": "sha256:54a4dcfccf318caa80d113d9c3f418387cb9635adf636eee19b293425232f53c",
  "SRI-002-QL-026": "sha256:5ddbc721cc9a9ecdbd0739427e5cc9795e72513932c1f257841ac55793b26b12",
  "SRI-002-QL-027": "sha256:cb532a20b03985fb195ad32f8e4f95fbadf3ac1d9ab42af5f50be1c4f223e958",
  "SRI-002-QL-028": "sha256:a485cba9a02e21e9ee3777ffb703ddefe07428fd7ee3a8342c5e06c9cfc614ac",
  "SRI-002-QL-029": "sha256:46b97b22802bf17ebc4d121b84d1a4a4b52918c6016e7324fa453a445ebb76c0",
} as Record<SriPermanentQlId, SriEnglishFingerprintV1>);

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(object)
        .sort()
        .map((key) => [key, stableValue(object[key])]),
    );
  }
  return value;
}

function freezeRow(row: SriPermanentEnglishReviewRecordV1) {
  return {
    permanentQlId: row.qlId,
    permanentSolveModeId: row.solveModeId,
    packageId: row.packageId,
    checkpointId: row.checkpointId,
    retainedGroupId: row.retainedGroupId,
    qlTitle: row.qlTitle,
    prototypeAncestryMember: row.memberCandidateId,
    reviewSeedIndex: row.reviewSeedIndex,
    seed: row.question.seed,
    state: row.question.state,
    stem: row.question.stem,
    options: row.question.options.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: option.text,
      isCorrect: index === row.question.correctIndex,
      misconceptionId: option.misconceptionId,
    })),
    answer: row.question.answer.text,
    explanation: row.question.explanation,
    verification: row.question.verification,
  };
}

export function computeSriPermanentEnglishFingerprintsV1(): Readonly<Record<SriPermanentQlId, SriEnglishFingerprintV1>> {
  const corpus = buildSriPermanentEnglishReviewCorpusV1(2);
  const grouped = new Map<SriPermanentQlId, ReturnType<typeof freezeRow>[]>();
  for (const row of corpus) {
    const records = grouped.get(row.qlId) ?? [];
    records.push(freezeRow(row));
    grouped.set(row.qlId, records);
  }

  const output = {} as Record<SriPermanentQlId, SriEnglishFingerprintV1>;
  for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
    const records = grouped.get(allocation.qlId);
    if (!records) throw new Error(`Missing permanent English review records for ${allocation.qlId}`);
    const canonical = JSON.stringify(stableValue(records));
    output[allocation.qlId] = `sha256:${createHash("sha256").update(canonical, "utf8").digest("hex")}`;
  }
  return Object.freeze(output);
}

export function assertSriPermanentEnglishFreezeV1(): void {
  const observed = computeSriPermanentEnglishFingerprintsV1();
  const expectedIds = Object.keys(SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1).sort();
  const observedIds = Object.keys(observed).sort();
  if (JSON.stringify(expectedIds) !== JSON.stringify(observedIds)) {
    throw new Error("SRI permanent English fingerprint QL set drift");
  }
  for (const qlId of expectedIds as SriPermanentQlId[]) {
    const expected = SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1[qlId];
    const actual = observed[qlId];
    if (actual !== expected) {
      throw new Error(`${qlId} English freeze drift: expected ${expected}, observed ${actual}`);
    }
  }
}

export const SRI_PERMANENT_ENGLISH_FREEZE_V1 = Object.freeze(
  SRI_PERMANENT_ALLOCATION_V1.map((allocation) =>
    Object.freeze({
      ...allocation,
      allocationStatus: "PERMANENT_ENGLISH_FROZEN_V1" as const,
      solveModeFrozen: true as const,
      englishFingerprint: SRI_PERMANENT_ENGLISH_FINGERPRINTS_V1[allocation.qlId],
      englishFrozen: true as const,
      locale: "en-IN" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    }),
  ),
);

const freezeByQlId = new Map(SRI_PERMANENT_ENGLISH_FREEZE_V1.map((entry) => [entry.qlId, entry] as const));

export function getSriPermanentEnglishFreezeByQlId(qlId: SriPermanentQlId) {
  const entry = freezeByQlId.get(qlId);
  if (!entry) throw new Error(`Unknown SRI permanent English-frozen QL: ${qlId}`);
  return entry;
}
