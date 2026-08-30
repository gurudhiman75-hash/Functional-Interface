import assert from "node:assert/strict";

import {
  COM002_LOCALIZATION_VERSION_V5,
  localizeCom002QuestionV5,
} from "./com002-localization-v5";
import { generateCom002ReviewQuestionV6 } from "./com002-review-synthesis-v6";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

const badHindi = [
  /फ़ाइल-स्टोरेज संसाधन ऑपरेटिंग सिस्टम का कार्य है।/u,
  / क्रिया का प्रभाव है:/u,
  / का अर्थ है:/u,
  /रीनेम क्रिया[^।\n?]*बदलता है/u,
  /कौन-सी सिस्टम क्रिया यह काम करती है:/u,
  /रीनेम क्रिया मूल आइटम को वहीं छोड़ने के बजाय उसका स्थान बदलती है/u,
  /इसलिए केवल [^।\n]+ सही उत्तर है।/u,
  /सही उत्तर है क्योंकि यह प्रश्न में दिए गए सिस्टम कार्य से मेल खाता है/u,
  /इस वर्णन से मेल खाता है:/u,
];
const badPunjabi = [
  /ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।/u,
  / ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ:/u,
  / ਦਾ ਅਰਥ ਹੈ:/u,
  /ਰੀਨੇਮ ਕਾਰਵਾਈ[^।\n?]*ਬਦਲਦਾ ਹੈ/u,
  /ਕਿਹੜੀ ਸਿਸਟਮ ਕਾਰਵਾਈ ਇਹ ਕੰਮ ਕਰਦੀ ਹੈ:/u,
  /ਰੀਨੇਮ ਕਾਰਵਾਈ ਮੂਲ ਆਈਟਮ ਨੂੰ ਥਾਂ ਤੇ ਛੱਡਣ ਦੀ ਬਜਾਇ ਉਸਦੀ ਥਾਂ ਬਦਲਦੀ ਹੈ/u,
  /ਇਸ ਲਈ ਕੇਵਲ [^।\n]+ ਸਹੀ ਉੱਤਰ ਹੈ।/u,
  /ਸਹੀ ਉੱਤਰ ਹੈ ਕਿਉਂਕਿ ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਸਿਸਟਮ ਕੰਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ/u,
  /ਇਸ ਵਰਣਨ ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ:/u,
];

const strictTranslations = {
  "supports one user at a time": {
    hi: "एक समय में एक उपयोगकर्ता का समर्थन करता है",
    pa: "ਇੱਕ ਸਮੇਂ ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ",
  },
  "shares processor time among many users or tasks": {
    hi: "कई उपयोगकर्ताओं या कार्यों के बीच प्रोसेसर समय साझा करता है",
    pa: "ਕਈ ਵਰਤੋਂਕਾਰਾਂ ਜਾਂ ਟਾਸਕਾਂ ਵਿਚਕਾਰ ਪ੍ਰੋਸੈਸਰ ਸਮਾਂ ਸਾਂਝਾ ਕਰਦਾ ਹੈ",
  },
  "responds to events within strict time limits": {
    hi: "कठोर समय सीमाओं के भीतर घटनाओं पर प्रतिक्रिया करता है",
    pa: "ਸਖ਼ਤ ਸਮਾਂ ਸੀਮਾਵਾਂ ਅੰਦਰ ਘਟਨਾਵਾਂ ਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਕਰਦਾ ਹੈ",
  },
  "allows many programs to run during the same period": {
    hi: "एक ही अवधि में कई प्रोग्राम चलने देता है",
    pa: "ਇੱਕੋ ਸਮੇਂ ਦੌਰਾਨ ਕਈ ਪ੍ਰੋਗਰਾਮ ਚੱਲਣ ਦਿੰਦਾ ਹੈ",
  },
  "gives CPU time to processes": {
    hi: "प्रक्रियाओं को CPU समय देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ CPU ਸਮਾਂ ਦਿੰਦਾ ਹੈ",
  },
  "gives memory to processes": {
    hi: "प्रक्रियाओं को मेमोरी देता है",
    pa: "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਮੈਮੋਰੀ ਦਿੰਦਾ ਹੈ",
  },
  "uses buttons, icons, windows, and other graphical controls": {
    hi: "बटन, आइकन, विंडो और अन्य ग्राफिकल कंट्रोल का उपयोग करता है",
    pa: "ਬਟਨ, ਆਇਕਨ, ਵਿੰਡੋ ਅਤੇ ਹੋਰ ਗ੍ਰਾਫਿਕਲ ਕੰਟਰੋਲ ਵਰਤਦਾ ਹੈ",
  },
  "open apps, settings, files, and search": {
    hi: "ऐप, सेटिंग्स, फ़ाइलें और सर्च खोलना",
    pa: "ਐਪ, ਸੈਟਿੰਗਾਂ, ਫ਼ਾਈਲਾਂ ਅਤੇ ਸਰਚ ਖੋਲ੍ਹਣਾ",
  },
  "help launch apps, switch open windows and access system features": {
    hi: "ऐप लॉन्च करने, खुली विंडो बदलने और सिस्टम सुविधाओं तक पहुँचने में मदद करना",
    pa: "ਐਪ ਖੋਲ੍ਹਣ, ਖੁੱਲ੍ਹੀਆਂ ਵਿੰਡੋਆਂ ਵਿਚਕਾਰ ਬਦਲਣ ਅਤੇ ਸਿਸਟਮ ਸੁਵਿਧਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਵਿੱਚ ਮਦਦ ਕਰਨਾ",
  },
  "change display settings": {
    hi: "डिस्प्ले सेटिंग्स बदलना",
    pa: "ਡਿਸਪਲੇ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  },
  "change mouse settings": {
    hi: "माउस सेटिंग्स बदलना",
    pa: "ਮਾਊਸ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  },
  "change date and time settings": {
    hi: "दिनांक और समय सेटिंग्स बदलना",
    pa: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਸੈਟਿੰਗਾਂ ਬਦਲਣਾ",
  },
  "add, remove or manage printers": {
    hi: "प्रिंटर जोड़ना, हटाना या प्रबंधित करना",
    pa: "ਪ੍ਰਿੰਟਰ ਜੋੜਨਾ, ਹਟਾਉਣਾ ਜਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰਨਾ",
  },
  "changes the item's name": {
    hi: "आइटम का नाम बदलता है",
    pa: "ਆਈਟਮ ਦਾ ਨਾਂ ਬਦਲਦਾ ਹੈ",
  },
  "finds matching files or folders": {
    hi: "मेल खाने वाली फ़ाइलें या फ़ोल्डर ढूँढता है",
    pa: "ਮੇਲ ਖਾਂਦੀਆਂ ਫ਼ਾਈਲਾਂ ਜਾਂ ਫ਼ੋਲਡਰ ਲੱਭਦਾ ਹੈ",
  },
  "removes the selected item from its current location": {
    hi: "चुने गए आइटम को उसकी मौजूदा जगह से हटाता है",
    pa: "ਚੁਣੀ ਆਈਟਮ ਨੂੰ ਉਸਦੀ ਮੌਜੂਦਾ ਥਾਂ ਤੋਂ ਹਟਾਉਂਦਾ ਹੈ",
  },
  "moves the item to another location": {
    hi: "आइटम को दूसरी जगह ले जाता है",
    pa: "ਆਈਟਮ ਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲੈ ਜਾਂਦਾ ਹੈ",
  },
  "brings the deleted item back": {
    hi: "डिलीट किए गए आइटम को वापस लाता है",
    pa: "ਡਿਲੀਟ ਕੀਤੀ ਆਈਟਮ ਨੂੰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ",
  },
} as const;

let audited = 0;
let strictParityAudited = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v6-localization-v5:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV6({ qlId, seed });

    for (const language of languages) {
      const question = localizeCom002QuestionV5({ qlId, seed, language });
      const replay = localizeCom002QuestionV5({ qlId, seed, language });

      assert.deepEqual(replay, question, `${qlId}/${seed}/${language}: V5 replay drift`);
      assert.equal(question.localizationV5.version, COM002_LOCALIZATION_VERSION_V5);
      assert.equal(question.localizationV5.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V6-ERRATA-REVIEW-CANDIDATE-2");
      assert.equal(question.localizationV5.englishQuestionId, english.questionId);
      assert.equal(question.qlId, english.qlId);
      assert.equal(question.cpId, english.cpId);
      assert.equal(question.surfaceMode, english.surfaceMode);
      assert.equal(question.targetFactId, english.targetFactId);
      assert.deepEqual(question.sourceIds, english.sourceIds);
      assert.deepEqual(question.sourceFactIds, english.sourceFactIds);
      assert.equal(question.solverAuthority, english.solverAuthority);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.runtimeRegistered, false);
      assert.equal("localizationV4" in question, false);
      assert.equal("lifecycleV4" in question, false);
      assert.equal(question.lifecycleV5.englishV5BaseFrozen, true);
      assert.equal(question.lifecycleV5.englishV6ErrataCandidate, true);
      assert.equal(question.lifecycleV5.localizationHumanReviewAccepted, false);
      assert.equal(question.lifecycleV5.localizationFingerprintsPinned, false);
      assert.equal(question.lifecycleV5.localizationFrozen, false);
      assert.equal(question.lifecycleV5.questionStudioActive, false);
      assert.equal(question.lifecycleV5.questionBankWritable, false);
      assert.equal(question.lifecycleV5.testEligible, false);
      assert.equal(question.lifecycleV5.mockTestEligible, false);
      assert.equal(question.lifecycleV5.publiclyPublishable, false);
      assert.equal(question.lifecycleV5.productionReleaseAuthorized, false);

      const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
      const badPatterns = language === "hi" ? badHindi : badPunjabi;
      for (const pattern of badPatterns) {
        assert.doesNotMatch(learnerText, pattern, `${qlId}/${seed}/${language}: known V4/editorial defect survived V5`);
      }

      if (language === "hi") {
        assert.match(question.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem missing Devanagari`);
        assert.match(question.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation missing Devanagari`);
      } else {
        assert.match(question.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem missing Gurmukhi`);
        assert.match(question.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi`);
      }

      english.options.forEach((option, optionIndex) => {
        const expected = strictTranslations[option as keyof typeof strictTranslations]?.[language];
        if (!expected) return;
        assert.equal(question.options[optionIndex], expected, `${qlId}/${seed}/${language}: simplified option parity drift`);
        strictParityAudited += 1;
      });

      audited += 1;
    }
  }
}

// Re-run the exact historical human-review seeds that first exposed defects.
for (const qlId of [
  "COM-002-QL-001",
  "COM-002-QL-004",
  "COM-002-QL-006",
  "COM-002-QL-009",
  "COM-002-QL-010",
  "COM-002-QL-013",
]) {
  for (const suffix of ["A", "B"] as const) {
    const seed = `human-review-wave1:${qlId}:${suffix}`;
    for (const language of languages) {
      const question = localizeCom002QuestionV5({ qlId, seed, language });
      const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
      for (const pattern of language === "hi" ? badHindi : badPunjabi) {
        assert.doesNotMatch(learnerText, pattern, `${qlId}/${seed}/${language}: review-wave defect survived V5`);
      }
    }
  }
}

// Exercise the exact 13 seeds used by the interactive V5 export. These checks
// make the rendered review pack itself part of the regression contract.
for (const qlId of qlIds) {
  const seed = `localization-human-review-v4:${qlId}`;
  const english = generateCom002ReviewQuestionV6({ qlId, seed });
  for (const language of languages) {
    const question = localizeCom002QuestionV5({ qlId, seed, language });
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    for (const pattern of language === "hi" ? badHindi : badPunjabi) {
      assert.doesNotMatch(learnerText, pattern, `${qlId}/${language}: exported review-pack defect survived V5`);
    }

    if (qlId === "COM-002-QL-001" && english.surfaceMode === "ENTITY_TO_FUNCTION") {
      assert.equal(
        question.stem,
        language === "hi"
          ? "इनमें से कौन-सा ऑपरेटिंग सिस्टम का कार्य है?"
          : "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ?",
      );
    }
    if (qlId === "COM-002-QL-006") {
      assert.doesNotMatch(question.stem, /:/u);
      assert.doesNotMatch(
        question.explanation,
        language === "hi"
          ? /सही उत्तर है क्योंकि यह प्रश्न में दिए गए सिस्टम कार्य से मेल खाता है/u
          : /ਸਹੀ ਉੱਤਰ ਹੈ ਕਿਉਂਕਿ ਇਹ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਸਿਸਟਮ ਕੰਮ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ/u,
      );
      assert.doesNotMatch(question.explanation, language === "hi" ? /का अर्थ है:/u : /ਦਾ ਅਰਥ ਹੈ:/u);
    }
    if (qlId === "COM-002-QL-007") {
      assert.equal(
        question.options[english.correctIndex],
        language === "hi"
          ? "ऐप लॉन्च करने, खुली विंडो बदलने और सिस्टम सुविधाओं तक पहुँचने में मदद करना"
          : "ਐਪ ਖੋਲ੍ਹਣ, ਖੁੱਲ੍ਹੀਆਂ ਵਿੰਡੋਆਂ ਵਿਚਕਾਰ ਬਦਲਣ ਅਤੇ ਸਿਸਟਮ ਸੁਵਿਧਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਵਿੱਚ ਮਦਦ ਕਰਨਾ",
      );
    }
    if (qlId === "COM-002-QL-008") {
      assert.equal(
        question.stem,
        language === "hi"
          ? "संबंधित व्यू विकल्प चालू होने पर छिपे आइटम दिखाने के लिए इनमें से किसका उपयोग किया जाता है?"
          : "ਸੰਬੰਧਿਤ ਵਿਊ ਵਿਕਲਪ ਚਾਲੂ ਹੋਣ ਤੇ ਲੁਕੀਆਂ ਆਈਟਮਾਂ ਦਿਖਾਉਣ ਲਈ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸਦੀ ਵਰਤੋਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ?",
      );
      assert.doesNotMatch(question.explanation, /^[^:।\n]+:\s+/u);
    }
    if (qlId === "COM-002-QL-011") {
      assert.equal(
        question.canonicalAnswer,
        language === "hi" ? "डिलीट किए गए आइटम को वापस लाता है" : "ਡਿਲੀਟ ਕੀਤੀ ਆਈਟਮ ਨੂੰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ",
      );
    }
    if (qlId === "COM-002-QL-013") {
      assert.doesNotMatch(question.explanation, language === "hi" ? /सही उत्तर है।/u : /ਸਹੀ ਉੱਤਰ ਹੈ।/u);
    }
  }
}

assert.equal(audited, 1040);
assert.ok(strictParityAudited > 0, "V5 corpus must exercise strict simplified-option parity overrides");
console.log("[com002-localization-v5] PASS", {
  questions: audited,
  strictParityAudited,
  candidateOnly: true,
  semanticProvenancePreserved: true,
  exactExportSeedsCovered: true,
  directSemanticExplanations: true,
  parallelLocalizedOptions: true,
  knownEditorialDefectsRemoved: true,
});
