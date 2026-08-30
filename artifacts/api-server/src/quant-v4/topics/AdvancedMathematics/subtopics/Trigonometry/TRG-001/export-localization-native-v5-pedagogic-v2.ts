import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import { TRG_001_LOCALIZATION_QL_IDS } from "./localization-v1";
import { trg001V5BindingFor } from "./localization-native-v5-registry";
import { generateLocalizedTrg001QuestionNativeV5PedagogicV2 } from "./localization-native-v5-pedagogic-v2";

const output = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/trg-001-localization-native-v5-pedagogic-v2-review.json");
mkdirSync(dirname(output), { recursive: true });

const rows = TRG_001_LOCALIZATION_QL_IDS.map((qlId) => {
  const seed = `trg001-pedagogic-v2-review-${qlId}`;
  const en: any = generateHumanApprovedTrg001Question(qlId, seed);
  const hi: any = generateLocalizedTrg001QuestionNativeV5PedagogicV2(qlId, seed, "hi-IN");
  const pa: any = generateLocalizedTrg001QuestionNativeV5PedagogicV2(qlId, seed, "pa-IN");
  const binding = trg001V5BindingFor(qlId);
  return {
    qlId,
    cpId: en.cpId,
    solveMode: en.solveMode,
    difficulty: en.difficulty,
    target: en.target,
    seed,
    v5Binding: binding,
    english: { stem: en.stem, options: en.options.map((o: any) => o.display), answer: en.answer, explanation: en.explanation },
    hindi: { stem: hi.stem, options: hi.options.map((o: any) => o.display), answer: hi.localizedAnswerDisplay, explanation: hi.explanation, fingerprint: hi.localizationProof.localizationFingerprint },
    punjabi: { stem: pa.stem, options: pa.options.map((o: any) => o.display), answer: pa.localizedAnswerDisplay, explanation: pa.explanation, fingerprint: pa.localizationProof.localizationFingerprint },
    governance: {
      humanLanguageReview: "PENDING",
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      publiclyPublishable: false,
    },
  };
});

writeFileSync(output, `${JSON.stringify({
  packageId: "TRG-001",
  status: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_V2",
  rows: rows.length,
  localizedSurfaces: rows.length * 2,
  humanLanguageReview: "PENDING",
  multilingualFreeze: false,
  activation: false,
  publicRelease: false,
  reviewRows: rows,
}, null, 2)}\n`, "utf8");
console.log(`TRG001_PEDAGOGIC_V2_REVIEW_PACK_WRITTEN rows=${rows.length} surfaces=${rows.length * 2} output=${output}`);
