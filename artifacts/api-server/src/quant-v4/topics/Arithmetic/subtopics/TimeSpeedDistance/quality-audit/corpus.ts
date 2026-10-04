import { generateCp003EnglishFrozenRecords as source0 } from "../TSD-001/cp003/english-frozen";
import { generateCp003AllApprovedNativeFrozenRows as source1 } from "../TSD-001/cp003/localization/native-approved-freeze";
import { TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q as source2 } from "../TSD-001/cp004/english-approved-freeze";
import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q as source3 } from "../TSD-001/cp005/english-approved-freeze-v13";
import { TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q as source4 } from "../TSD-001/cp005/localization/native-approved-freeze-v5";
import { TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q as source5 } from "../TSD-001/cp006/english-approved-freeze-v5";
import { TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q as source6 } from "../TSD-001/cp006/localization/native-approved-freeze-v7";
import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS as source7 } from "../TSD-002/cp008/english-rendered-review";
import { TSD_CP008_FINAL_RENDERED_LOCALIZED_QUESTIONS as source8 } from "../TSD-002/cp008/localized-rendered-review-final";
import { TSD_CP009_RENDERED_ENGLISH_QUESTIONS as source9 } from "../TSD-002/cp009/english-rendered-review";
import { TSD_CP009_RENDERED_LOCALIZED_QUESTIONS as source10 } from "../TSD-002/cp009/localized-rendered-review";
import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW as source11 } from "../TSD-002/cp010/exam-paper-review-final-v3-all";
import { TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW as source12 } from "../TSD-002/cp010/exam-paper-review-final-v3-all";
import { TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW as source13 } from "../TSD-002/cp010/exam-paper-review-final-v3-all";
import { TSD_CP011_ENGLISH_REVIEW as source14 } from "../TSD-002/cp011/english-review-final";
import { TSD_CP011_RELEASE_HINDI_REVIEW as source15 } from "../TSD-002/cp011/native-review-release";
import { TSD_CP011_RELEASE_PUNJABI_REVIEW as source16 } from "../TSD-002/cp011/native-review-release";
import { TSD_CP012_ENGLISH_REVIEW_FINAL as source17 } from "../TSD-002/cp012/english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL as source18 } from "../TSD-002/cp012/native-review-editorial-final";
import { TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL as source19 } from "../TSD-002/cp012/native-review-editorial-final";
import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "../TSD-002/cp007/english-freeze-registry";
import { previewTsdCp007QuestionStudioReview } from "../TSD-002/cp007/question-studio-review-adapter";

/** Audit snapshot only; importing this module cannot register or release content. */
export function buildTsdQualityAuditCorpus() {
  const rows: Record<string, any>[] = [];
  function append(checkpoint: string, defaultLanguage: string, authoritySource: string, input: readonly any[]) {
    for (const original of input) {
      const presentation = original.presentation ?? original;
      const source = original.source ?? original;
      rows.push({ checkpoint, authoritySource,
        qlId: presentation.qlId ?? source.permanentQlId ?? source.authorityPermanentQlId ?? source.qlId,
        familyId: presentation.familyId ?? source.familyId ?? source.questionLanguageId,
        language: String(presentation.language ?? presentation.locale ?? original.language ?? defaultLanguage).split("-")[0],
        stem: presentation.stem ?? presentation.text,
        explanation: presentation.explanation ?? source.explanation,
        answer: presentation.answerText ?? presentation.answer ?? source.answerText ?? source.answer,
        options: presentation.options, correctIndex: presentation.correctIndex,
        difficulty: presentation.difficulty ?? presentation.difficultyBand ?? source.difficulty,
        scene: presentation.scene ?? source.scene,
        objectFamily: presentation.objectFamily ?? source.objectFamily,
        input: source.input, solution: source.solution,
      });
    }
  }
append("CP003", "en", "TSD-001/cp003/english-frozen", source0());
append("CP003", "native", "TSD-001/cp003/localization/native-approved-freeze", source1());
append("CP004", "en", "TSD-001/cp004/english-approved-freeze", source2);
append("CP005", "en", "TSD-001/cp005/english-approved-freeze-v13", source3);
append("CP005", "native", "TSD-001/cp005/localization/native-approved-freeze-v5", source4);
append("CP006", "en", "TSD-001/cp006/english-approved-freeze-v5", source5);
append("CP006", "native", "TSD-001/cp006/localization/native-approved-freeze-v7", source6);
append("CP008", "en", "TSD-002/cp008/english-rendered-review", source7);
append("CP008", "native", "TSD-002/cp008/localized-rendered-review-final", source8);
append("CP009", "en", "TSD-002/cp009/english-rendered-review", source9);
append("CP009", "native", "TSD-002/cp009/localized-rendered-review", source10);
append("CP010", "en", "TSD-002/cp010/exam-paper-review-final-v3-all", source11);
append("CP010", "hi", "TSD-002/cp010/exam-paper-review-final-v3-all", source12);
append("CP010", "pa", "TSD-002/cp010/exam-paper-review-final-v3-all", source13);
append("CP011", "en", "TSD-002/cp011/english-review-final", source14);
append("CP011", "hi", "TSD-002/cp011/native-review-release", source15);
append("CP011", "pa", "TSD-002/cp011/native-review-release", source16);
append("CP012", "en", "TSD-002/cp012/english-review-editorial-final", source17);
append("CP012", "hi", "TSD-002/cp012/native-review-editorial-final", source18);
append("CP012", "pa", "TSD-002/cp012/native-review-editorial-final", source19);
  for (const language of ["en", "hi", "pa"] as const) {
    for (const ql of TSD_CP007_FROZEN_ENGLISH_REGISTRY) {
      for (const family of ql.stemFamilies) {
        append("CP007", language, "TSD-002/cp007/question-studio-review-adapter", previewTsdCp007QuestionStudioReview({language, familyId: family.familyId, seed: "TSD-QUALITY-AUDIT-20261004"}).questions);
      }
    }
  }
  return rows;
}
