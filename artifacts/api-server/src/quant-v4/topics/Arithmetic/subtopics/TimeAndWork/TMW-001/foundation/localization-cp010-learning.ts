import type {
  TmwCp010GeneratedQuestion,
  TmwCp010MisconceptionId,
  TmwCp010RuleId,
} from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp009Time } from "./localization-cp009-language";
import {
  cp010AnswerText,
  cp010Boundary,
  cp010Label,
  cp010Level,
  cp010NumberedSegments,
  cp010StageText,
} from "./localization-cp010-language";

export function tmwCp010LocalizedOpening(
  ruleId: TmwCp010RuleId,
  language: TmwLocalizedLanguage,
): string {
  const hi: Record<TmwCp010RuleId, string> = {
    TMW_STAGE_EVENT_LEDGER: "हर पाइप खुलने, बंद होने, मरम्मत या रुकावट पर कार्यक्रम को अलग चरण में बाँटें। प्रत्येक चरण की चिह्न सहित शुद्ध दर केवल उसी चरण की अवधि पर लगाएँ और प्राप्त टंकी-स्तर को अगले चरण में आगे ले जाएँ।",
    TMW_CYCLE_ACCUMULATION: "पूरे क्रम को एक चक्र मानें। प्रति चक्र सही स्तर-परिवर्तन निकालें, सीमा पार किए बिना जितने पूरे चक्र सुरक्षित हों उतने लें, फिर अंतिम चक्र के खंड क्रम से जाँचें।",
    TMW_LEVEL_TRIGGER: "स्तर-सेंसर का बदलाव अनुमानित समय पर नहीं, दिए गए स्तर पर होता है। पहले उस स्तर तक पहुँचने का समय निकालें, फिर बदली हुई व्यवस्था की दर लगाएँ।",
    TMW_STAGE_INVERSE: "अंतिम स्तर को सभी चरणों के योगदानों के योग के रूप में लिखें। अज्ञात घटना-समय, अंतिम दर या बदलाव-समय को चर मानकर उसी स्तर-समीकरण से अलग करें।",
    TMW_STAGED_PHYSICAL_FLOW: "हर भौतिक चरण का शुद्ध आयतन = शुद्ध प्रवाह × अवधि। सभी चिह्न सहित आयतनों को जोड़कर टंकी की भरी गई मात्रा या क्षमता से मिलाएँ।",
  };
  const pa: Record<TmwCp010RuleId, string> = {
    TMW_STAGE_EVENT_LEDGER: "ਹਰ ਪਾਈਪ ਖੁੱਲ੍ਹਣ, ਬੰਦ ਹੋਣ, ਮੁਰੰਮਤ ਜਾਂ ਰੁਕਾਵਟ ਉੱਤੇ ਕਾਰਜਕ੍ਰਮ ਨੂੰ ਵੱਖਰੇ ਪੜਾਅ ਵਿੱਚ ਵੰਡੋ। ਹਰ ਪੜਾਅ ਦੀ ਚਿੰਨ੍ਹ ਸਮੇਤ ਸ਼ੁੱਧ ਦਰ ਸਿਰਫ਼ ਉਸੇ ਮਿਆਦ ਲਈ ਲਗਾਓ ਅਤੇ ਮਿਲਿਆ ਟੈਂਕੀ ਪੱਧਰ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਲੈ ਜਾਓ।",
    TMW_CYCLE_ACCUMULATION: "ਪੂਰੇ ਕ੍ਰਮ ਨੂੰ ਇੱਕ ਚੱਕਰ ਮੰਨੋ। ਪ੍ਰਤੀ ਚੱਕਰ ਸਹੀ ਪੱਧਰ ਬਦਲਾਅ ਕੱਢੋ, ਸੀਮਾ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ ਜਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਸੁਰੱਖਿਅਤ ਹਨ ਉਨ੍ਹਾਂ ਨੂੰ ਲਓ, ਫਿਰ ਅੰਤਿਮ ਚੱਕਰ ਦੇ ਖੰਡ ਕ੍ਰਮਵਾਰ ਜਾਂਚੋ।",
    TMW_LEVEL_TRIGGER: "ਪੱਧਰ ਸੈਂਸਰ ਦਾ ਬਦਲਾਅ ਅੰਦਾਜ਼ੇ ਦੇ ਸਮੇਂ ਉੱਤੇ ਨਹੀਂ, ਦਿੱਤੇ ਪੱਧਰ ਉੱਤੇ ਹੁੰਦਾ ਹੈ। ਪਹਿਲਾਂ ਉਸ ਪੱਧਰ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਬਦਲੀ ਵਿਵਸਥਾ ਦੀ ਦਰ ਲਗਾਓ।",
    TMW_STAGE_INVERSE: "ਅੰਤਿਮ ਪੱਧਰ ਨੂੰ ਸਾਰੇ ਪੜਾਵਾਂ ਦੇ ਯੋਗਦਾਨਾਂ ਦੇ ਜੋੜ ਵਜੋਂ ਲਿਖੋ। ਅਣਜਾਣ ਘਟਨਾ ਸਮਾਂ, ਅੰਤਿਮ ਦਰ ਜਾਂ ਬਦਲਾਅ ਸਮਾਂ ਨੂੰ ਚਲ ਮੰਨ ਕੇ ਉਸੇ ਪੱਧਰ ਸਮੀਕਰਨ ਤੋਂ ਅਲੱਗ ਕਰੋ।",
    TMW_STAGED_PHYSICAL_FLOW: "ਹਰ ਭੌਤਿਕ ਪੜਾਅ ਦਾ ਸ਼ੁੱਧ ਆਇਤਨ = ਸ਼ੁੱਧ ਪ੍ਰਵਾਹ × ਮਿਆਦ। ਸਾਰੇ ਚਿੰਨ੍ਹ ਸਮੇਤ ਆਇਤਨਾਂ ਨੂੰ ਜੋੜ ਕੇ ਟੈਂਕੀ ਦੀ ਭਰੀ ਮਾਤਰਾ ਜਾਂ ਸਮਰੱਥਾ ਨਾਲ ਮਿਲਾਓ।",
  };
  return language === "hi" ? hi[ruleId] : pa[ruleId];
}

export function tmwCp010LocalizedGivens(
  source: TmwCp010GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  const stages = p.stages ?? [];
  const cycle = p.cycle ?? [];
  const initial = language === "hi" ? `प्रारंभिक स्तर: ${cp010Level(p.initialLevel, language)}।` : `ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ: ${cp010Level(p.initialLevel, language)}।`;

  switch (source.solveMode) {
    case "findCompletionAfterDelayedActivation":
    case "findCompletionAfterDelayedDeactivation":
    case "findCompletionWithMultipleStaggeredEvents":
    case "findCompletionWithInterruptedFlow":
    case "findCompletionFromPartialLevelAndStages":
    case "findFinalLevelAfterStagedSchedule":
      return [
        initial,
        language === "hi"
          ? `चरण: ${stages.map((stage) => cp010StageText(stage, language)).join("; ")}।`
          : `ਪੜਾਅ: ${stages.map((stage) => cp010StageText(stage, language)).join("; ")}।`,
      ];
    case "findCompletionAfterThresholdSwitch":
      return [
        language === "hi" ? `सेंसर स्तर: ${cp010Level(p.thresholdLevel!, language)}।` : `ਸੈਂਸਰ ਪੱਧਰ: ${cp010Level(p.thresholdLevel!, language)}।`,
        language === "hi" ? `पहले और बाद की व्यवस्थाओं को अलग चरण मानना है।` : `ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀਆਂ ਵਿਵਸਥਾਵਾਂ ਨੂੰ ਵੱਖਰੇ ਪੜਾਅ ਮੰਨਣਾ ਹੈ।`,
      ];
    case "findEventTimeFromKnownCompletion":
      return [
        language === "hi" ? `कुल ज्ञात समय: ${cp009Time(p.knownCompletionTime!, language)}; अंतिम स्तर पूरी तरह भरा।` : `ਕੁੱਲ ਪਤਾ ਸਮਾਂ: ${cp009Time(p.knownCompletionTime!, language)}; ਅੰਤਿਮ ਪੱਧਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਿਆ।`,
        language === "hi" ? `अज्ञात: पहली व्यवस्था की अवधि।` : `ਅਣਜਾਣ: ਪਹਿਲੀ ਵਿਵਸਥਾ ਦੀ ਮਿਆਦ।`,
      ];
    case "findRequiredFinalStageRate":
      return [
        language === "hi" ? `पहला चरण: ${cp010StageText(stages[0], language)}।` : `ਪਹਿਲਾ ਪੜਾਅ: ${cp010StageText(stages[0], language)}।`,
        language === "hi" ? `कुल अनुमत समय: ${cp009Time(p.knownCompletionTime!, language)}; अज्ञात अंतिम दर।` : `ਕੁੱਲ ਮਨਜ਼ੂਰ ਸਮਾਂ: ${cp009Time(p.knownCompletionTime!, language)}; ਅਣਜਾਣ ਅੰਤਿਮ ਦਰ।`,
      ];
    case "findCapacityFromStagedPhysicalFlows":
      return [
        language === "hi" ? "टंकी शुरू में खाली और अंत में पूरी भरी है।" : "ਟੈਂਕੀ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਅਤੇ ਅੰਤ ਵਿੱਚ ਪੂਰੀ ਭਰੀ ਹੈ।",
        language === "hi" ? `भौतिक चरणों की संख्या: ${p.physicalStages?.length ?? 0}।` : `ਭੌਤਿਕ ਪੜਾਵਾਂ ਦੀ ਗਿਣਤੀ: ${p.physicalStages?.length ?? 0}।`,
      ];
    case "findAutomaticLevelControlCompletion":
      return [
        language === "hi" ? `नियंत्रण सीमा: ${cp010Level(p.levelControl!.lower, language)} से ${cp010Level(p.levelControl!.upper, language)}।` : `ਕੰਟਰੋਲ ਸੀਮਾ: ${cp010Level(p.levelControl!.lower, language)} ਤੋਂ ${cp010Level(p.levelControl!.upper, language)}।`,
        language === "hi" ? `ऊपरी स्तर पर आवश्यक वापसी: ${p.levelControl!.targetUpperHits} बार।` : `ਉੱਪਰਲੇ ਪੱਧਰ ਉੱਤੇ ਲੋੜੀਂਦੀ ਵਾਪਸੀ: ${p.levelControl!.targetUpperHits} ਵਾਰ।`,
      ];
    case "findScheduleAdjustmentForDeadline":
      return [
        language === "hi" ? `मूल बदलाव-समय: ${cp009Time(p.adjustmentBaseDuration!, language)}।` : `ਮੂਲ ਬਦਲਾਅ ਸਮਾਂ: ${cp009Time(p.adjustmentBaseDuration!, language)}।`,
        language === "hi" ? `नई समय-सीमा: ${cp009Time(p.requiredDeadline!, language)}; बदलाव ${p.adjustmentDirection === "EARLIER" ? "पहले" : "बाद में"} करना है।` : `ਨਵੀਂ ਸਮਾਂ-ਸੀਮਾ: ${cp009Time(p.requiredDeadline!, language)}; ਬਦਲਾਅ ${p.adjustmentDirection === "EARLIER" ? "ਪਹਿਲਾਂ" : "ਬਾਅਦ"} ਕਰਨਾ ਹੈ।`,
      ];
    default:
      return [
        initial,
        language === "hi"
          ? `चक्र भाग ${(p.startingCycleIndex ?? 0) + 1} से शुरू होता है; क्रम: ${cp010NumberedSegments(cycle, language)}`
          : `ਚੱਕਰ ਭਾਗ ${(p.startingCycleIndex ?? 0) + 1} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ; ਕ੍ਰਮ: ${cp010NumberedSegments(cycle, language)}`,
      ];
  }
}

export function tmwCp010LocalizedShortcut(
  source: TmwCp010GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const hi = (title: string, first: string, second: string) => ({ title: `10-सेकंड ${title}`, steps: [first, `${second} उत्तर: ${answerText}।`] });
  const pa = (title: string, first: string, second: string) => ({ title: `10-ਸਕਿੰਟ ${title}`, steps: [first, `${second} ਉੱਤਰ: ${answerText}।`] });
  const h = language === "hi";
  switch (source.solveMode) {
    case "findCompletionAfterDelayedActivation": return h ? hi("देरी से खुलने वाला चरण", "देरी के दौरान केवल पहली व्यवस्था की दर लगाएँ।", "घटना के स्तर से शेष भाग को दूसरी दर से पूरा करें।") : pa("ਦੇਰੀ ਨਾਲ ਖੁੱਲ੍ਹਣ ਵਾਲਾ ਪੜਾਅ", "ਦੇਰੀ ਦੌਰਾਨ ਸਿਰਫ਼ ਪਹਿਲੀ ਵਿਵਸਥਾ ਦੀ ਦਰ ਲਗਾਓ।", "ਘਟਨਾ ਵਾਲੇ ਪੱਧਰ ਤੋਂ ਬਾਕੀ ਹਿੱਸਾ ਦੂਜੀ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰੋ।");
    case "findCompletionAfterDelayedDeactivation": return h ? hi("देरी से बंद होने वाला चरण", "बंद होने तक पहली संयुक्त दर लगाएँ।", "उस स्तर से बदली दर पर शेष समय निकालें।") : pa("ਦੇਰੀ ਨਾਲ ਬੰਦ ਹੋਣ ਵਾਲਾ ਪੜਾਅ", "ਬੰਦ ਹੋਣ ਤੱਕ ਪਹਿਲੀ ਸਾਂਝੀ ਦਰ ਲਗਾਓ।", "ਉਸ ਪੱਧਰ ਤੋਂ ਬਦਲੀ ਦਰ ਉੱਤੇ ਬਾਕੀ ਸਮਾਂ ਕੱਢੋ।");
    case "findCompletionWithMultipleStaggeredEvents": return h ? hi("घटना-सारणी", "हर अंतराल की अवधि, सक्रिय पाइप और स्तर-परिवर्तन की अलग पंक्ति बनाएँ।", "अंतिम चरण में बचा स्तर अंतिम दर से भाग दें।") : pa("ਘਟਨਾ ਸਾਰਣੀ", "ਹਰ ਅੰਤਰਾਲ ਦੀ ਮਿਆਦ, ਸਰਗਰਮ ਪਾਈਪ ਅਤੇ ਪੱਧਰ ਬਦਲਾਅ ਦੀ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਓ।", "ਅੰਤਿਮ ਪੜਾਅ ਵਿੱਚ ਬਾਕੀ ਪੱਧਰ ਨੂੰ ਅੰਤਿਮ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।");
    case "findCompletionWithInterruptedFlow": return h ? hi("शून्य-प्रवाह अंतराल", "रुकावट में स्तर नहीं बदलता, पर समय जुड़ता है।", "सक्रिय समय हल कर पूरी रुकावट अवधि जोड़ें।") : pa("ਸਿਫ਼ਰ-ਪ੍ਰਵਾਹ ਅੰਤਰਾਲ", "ਰੁਕਾਵਟ ਵਿੱਚ ਪੱਧਰ ਨਹੀਂ ਬਦਲਦਾ, ਪਰ ਸਮਾਂ ਜੁੜਦਾ ਹੈ।", "ਸਰਗਰਮ ਸਮਾਂ ਹੱਲ ਕਰਕੇ ਪੂਰੀ ਰੁਕਾਵਟ ਮਿਆਦ ਜੋੜੋ।");
    case "findCompletionFromPartialLevelAndStages": return h ? hi("शेष स्तर से शुरुआत", "एक पूरी टंकी नहीं, 1−प्रारंभिक स्तर से शुरू करें।", "हर चरण का योगदान क्रम से घटाएँ।") : pa("ਬਾਕੀ ਪੱਧਰ ਤੋਂ ਸ਼ੁਰੂਆਤ", "ਇੱਕ ਪੂਰੀ ਟੈਂਕੀ ਨਹੀਂ, 1−ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।", "ਹਰ ਪੜਾਅ ਦਾ ਯੋਗਦਾਨ ਕ੍ਰਮਵਾਰ ਘਟਾਓ।");
    case "findFinalLevelAfterStagedSchedule": return h ? hi("चिह्न सहित स्तर जोड़", "हर शुद्ध दर को उसकी अवधि से गुणा करें।", "सभी चिह्न सहित परिवर्तन प्रारंभिक स्तर में जोड़ें।") : pa("ਚਿੰਨ੍ਹ ਸਮੇਤ ਪੱਧਰ ਜੋੜ", "ਹਰ ਸ਼ੁੱਧ ਦਰ ਨੂੰ ਉਸ ਦੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ।", "ਸਾਰੇ ਚਿੰਨ੍ਹ ਸਮੇਤ ਬਦਲਾਅ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਵਿੱਚ ਜੋੜੋ।");
    case "findCompletionAfterThresholdSwitch": return h ? hi("सेंसर-स्तर विभाजन", "पहली दर से सेंसर स्तर तक समय निकालें।", "फिर शेष स्तर को नई दर से पूरा करें।") : pa("ਸੈਂਸਰ ਪੱਧਰ ਵੰਡ", "ਪਹਿਲੀ ਦਰ ਨਾਲ ਸੈਂਸਰ ਪੱਧਰ ਤੱਕ ਸਮਾਂ ਕੱਢੋ।", "ਫਿਰ ਬਾਕੀ ਪੱਧਰ ਨੂੰ ਨਵੀਂ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰੋ।");
    case "findEventTimeFromKnownCompletion": return h ? hi("भारित समय समीकरण", "पहले चरण का समय x और दूसरे का T−x रखें।", "स्तर-समीकरण से x अलग करें।") : pa("ਭਾਰਿਤ ਸਮਾਂ ਸਮੀਕਰਨ", "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਸਮਾਂ x ਅਤੇ ਦੂਜੇ ਦਾ T−x ਰੱਖੋ।", "ਪੱਧਰ ਸਮੀਕਰਨ ਤੋਂ x ਅਲੱਗ ਕਰੋ।");
    case "findRequiredFinalStageRate": return h ? hi("शेष दर", "पहले चरण का स्तर-परिवर्तन कुल लक्ष्य से घटाएँ।", "शेष परिवर्तन को शेष समय से भाग दें।") : pa("ਬਾਕੀ ਦਰ", "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਪੱਧਰ ਬਦਲਾਅ ਕੁੱਲ ਟੀਚੇ ਤੋਂ ਘਟਾਓ।", "ਬਾਕੀ ਬਦਲਾਅ ਨੂੰ ਬਾਕੀ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।");
    case "findCapacityFromStagedPhysicalFlows": return h ? hi("आयतन-सारणी", "हर चरण में लीटर प्रति घंटा × घंटे करें।", "चिह्न सहित आयतन जोड़ें; पूरा भराव ही क्षमता है।") : pa("ਆਇਤਨ ਸਾਰਣੀ", "ਹਰ ਪੜਾਅ ਵਿੱਚ ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ × ਘੰਟੇ ਕਰੋ।", "ਚਿੰਨ੍ਹ ਸਮੇਤ ਆਇਤਨ ਜੋੜੋ; ਪੂਰਾ ਭਰਾਅ ਹੀ ਸਮਰੱਥਾ ਹੈ।");
    case "findAutomaticLevelControlCompletion": return h ? hi("नियंत्रण-पट्टी चक्र", "ऊपरी से निचले और निचले से ऊपरी स्तर का समय अलग निकालें।", "एक नियंत्रण चक्र को आवश्यक वापसी संख्या से गुणा करें।") : pa("ਕੰਟਰੋਲ ਪੱਟੀ ਚੱਕਰ", "ਉੱਪਰਲੇ ਤੋਂ ਹੇਠਲੇ ਅਤੇ ਹੇਠਲੇ ਤੋਂ ਉੱਪਰਲੇ ਪੱਧਰ ਦਾ ਸਮਾਂ ਵੱਖਰਾ ਕੱਢੋ।", "ਇੱਕ ਕੰਟਰੋਲ ਚੱਕਰ ਨੂੰ ਲੋੜੀਂਦੀ ਵਾਪਸੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।");
    case "findFullCycleCountToBoundary": return h ? hi("सुरक्षित पूरे चक्र", "प्रति चक्र स्तर-परिवर्तन निकालें।", "सीमा वाले अंतिम चक्र से पहले केवल पूरे चक्र गिनें।") : pa("ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ", "ਪ੍ਰਤੀ ਚੱਕਰ ਪੱਧਰ ਬਦਲਾਅ ਕੱਢੋ।", "ਸੀਮਾ ਵਾਲੇ ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਸਿਰਫ਼ ਪੂਰੇ ਚੱਕਰ ਗਿਣੋ।");
    case "findTerminalActiveSegment": return h ? hi("अंतिम खंड जाँच", "सुरक्षित पूरे चक्र हटाएँ।", "अगले खंड क्रम से लगाएँ; सीमा छूने वाला पहला खंड उत्तर है।") : pa("ਅੰਤਿਮ ਖੰਡ ਜਾਂਚ", "ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਹਟਾਓ।", "ਅਗਲੇ ਖੰਡ ਕ੍ਰਮਵਾਰ ਲਗਾਓ; ਸੀਮਾ ਛੂਹਣ ਵਾਲਾ ਪਹਿਲਾ ਖੰਡ ਉੱਤਰ ਹੈ।");
    case "findScheduleAdjustmentForDeadline": return h ? hi("समय-सीमा अंतर", "नई समय-सीमा के लिए आवश्यक बदलाव-समय निकालें।", "मूल समय से उसका अंतर ही आगे/पीछे समायोजन है।") : pa("ਸਮਾਂ-ਸੀਮਾ ਅੰਤਰ", "ਨਵੀਂ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਸਮਾਂ ਕੱਢੋ।", "ਮੂਲ ਸਮੇਂ ਤੋਂ ਉਸ ਦਾ ਅੰਤਰ ਹੀ ਪਹਿਲਾਂ/ਬਾਅਦ ਦਾ ਸਮਾਯੋਜਨ ਹੈ।");
    default: return h ? hi("पूरा चक्र और अंतिम शेष", "एक पूरे चक्र का समय और स्तर-परिवर्तन निकालें।", "सुरक्षित पूरे चक्र लें, फिर अंतिम खंड क्रम से जाँचें।") : pa("ਪੂਰਾ ਚੱਕਰ ਅਤੇ ਅੰਤਿਮ ਬਾਕੀ", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦਾ ਸਮਾਂ ਅਤੇ ਪੱਧਰ ਬਦਲਾਅ ਕੱਢੋ।", "ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ ਲਓ, ਫਿਰ ਅੰਤਿਮ ਖੰਡ ਕ੍ਰਮਵਾਰ ਜਾਂਚੋ।");
  }
}

export function tmwCp010LocalizedTrapReason(
  id: TmwCp010MisconceptionId,
  language: TmwLocalizedLanguage,
): string {
  const hi: Record<TmwCp010MisconceptionId, string> = {
    CORRECT: "सही चरणबद्ध गणना।",
    PRE_EVENT_STAGE_IGNORED: "घटना से पहले का चरण छोड़ दिया गया है; उस चरण का स्तर-परिवर्तन और समय दोनों जरूरी हैं।",
    POST_EVENT_STAGE_IGNORED: "घटना के बाद का चरण छोड़ दिया गया है।",
    EVENT_TIME_ADDED_TWICE: "घटना तक बीता समय कुल समय में दो बार जोड़ दिया गया है।",
    PIPE_SIGN_IGNORED: "निकासी या रिसाव की ऋणात्मक दिशा को भराव की तरह जोड़ दिया गया है।",
    INITIAL_LEVEL_IGNORED: "टंकी के दिए गए प्रारंभिक स्तर को शून्य मान लिया गया है।",
    IDLE_INTERVAL_IGNORED: "शून्य-प्रवाह अंतराल स्तर नहीं बदलता, पर कुल समय में पूरा जुड़ता है।",
    THRESHOLD_SWITCH_IGNORED: "सेंसर स्तर पर व्यवस्था बदलने की शर्त को नहीं लगाया गया।",
    CYCLE_ORDER_REVERSED: "चक्र के खंड गलत क्रम में लगाए गए हैं।",
    ONE_FULL_CYCLE_TOO_MANY: "सीमा से पहले एक अतिरिक्त पूरा चक्र जोड़ दिया गया है।",
    ONE_FULL_CYCLE_TOO_FEW: "एक वैध पूरा चक्र कम लिया गया है।",
    TERMINAL_FRACTION_IGNORED: "अंतिम खंड के आंशिक समय को छोड़ दिया गया है।",
    WRONG_TERMINAL_SEGMENT: "अंतिम चक्र को क्रम से जाँचे बिना गलत खंड चुना गया है।",
    BOUNDARY_TIME_NOT_CHECKED: "हर खंड के भीतर सीमा पहुँचने का समय जाँचना जरूरी है।",
    PHYSICAL_STAGE_OMITTED: "भौतिक प्रवाह का एक चरण आयतन-योग से छूट गया है।",
    INVERSE_STAGE_NOT_ISOLATED: "अज्ञात घटना-समय या दर को स्तर-समीकरण से सही अलग नहीं किया गया।",
    STAGE_DURATION_COMPLEMENT_USED: "पूछे गए चरण के बजाय कुल समय में से उसका पूरक दिया गया है।",
    ORIGINAL_EVENT_TIME_REPORTED: "समायोजन के बजाय मूल बदलाव-समय ही उत्तर दिया गया है।",
    PHYSICAL_DURATION_IGNORED: "लीटर प्रति घंटा को अवधि से गुणा किए बिना आयतन मान लिया गया है।",
    COMPLEMENT_LEVEL_REPORTED: "अंतिम भरे भाग के बजाय उसका खाली पूरक दिया गया है।",
    CONTROL_CYCLE_COUNT_IGNORED: "आवश्यक ऊपरी-स्तर वापसी की संख्या लागू नहीं की गई।",
    RATE_TIME_RECIPROCAL_ERROR: "दर और समय के व्युत्क्रम संबंध को उलटा लगाया गया है।",
    PLAUSIBLE_SCALE_ERROR: "गणना सही दिशा में है, पर मान को गलत गुणक से बढ़ाया या घटाया गया है।",
  };
  const pa: Record<TmwCp010MisconceptionId, string> = {
    CORRECT: "ਸਹੀ ਪੜਾਅਵਾਰ ਗਣਨਾ।",
    PRE_EVENT_STAGE_IGNORED: "ਘਟਨਾ ਤੋਂ ਪਹਿਲਾਂ ਵਾਲਾ ਪੜਾਅ ਛੱਡਿਆ ਗਿਆ ਹੈ; ਉਸ ਦਾ ਪੱਧਰ ਬਦਲਾਅ ਅਤੇ ਸਮਾਂ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਹਨ।",
    POST_EVENT_STAGE_IGNORED: "ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਵਾਲਾ ਪੜਾਅ ਛੱਡਿਆ ਗਿਆ ਹੈ।",
    EVENT_TIME_ADDED_TWICE: "ਘਟਨਾ ਤੱਕ ਬੀਤਿਆ ਸਮਾਂ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚ ਦੋ ਵਾਰ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
    PIPE_SIGN_IGNORED: "ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਦੀ ਰਿਣਾਤਮਕ ਦਿਸ਼ਾ ਨੂੰ ਭਰਾਅ ਵਾਂਗ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
    INITIAL_LEVEL_IGNORED: "ਟੈਂਕੀ ਦੇ ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਨੂੰ ਸਿਫ਼ਰ ਮੰਨਿਆ ਗਿਆ ਹੈ।",
    IDLE_INTERVAL_IGNORED: "ਸਿਫ਼ਰ-ਪ੍ਰਵਾਹ ਅੰਤਰਾਲ ਪੱਧਰ ਨਹੀਂ ਬਦਲਦਾ, ਪਰ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਜੁੜਦਾ ਹੈ।",
    THRESHOLD_SWITCH_IGNORED: "ਸੈਂਸਰ ਪੱਧਰ ਉੱਤੇ ਵਿਵਸਥਾ ਬਦਲਣ ਦੀ ਸ਼ਰਤ ਨਹੀਂ ਲਗਾਈ ਗਈ।",
    CYCLE_ORDER_REVERSED: "ਚੱਕਰ ਦੇ ਖੰਡ ਗਲਤ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਏ ਗਏ ਹਨ।",
    ONE_FULL_CYCLE_TOO_MANY: "ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਵਾਧੂ ਪੂਰਾ ਚੱਕਰ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
    ONE_FULL_CYCLE_TOO_FEW: "ਇੱਕ ਵੈਧ ਪੂਰਾ ਚੱਕਰ ਘੱਟ ਲਿਆ ਗਿਆ ਹੈ।",
    TERMINAL_FRACTION_IGNORED: "ਅੰਤਿਮ ਖੰਡ ਦਾ ਅੰਸ਼ਕ ਸਮਾਂ ਛੱਡਿਆ ਗਿਆ ਹੈ।",
    WRONG_TERMINAL_SEGMENT: "ਅੰਤਿਮ ਚੱਕਰ ਨੂੰ ਕ੍ਰਮਵਾਰ ਜਾਂਚੇ ਬਿਨਾਂ ਗਲਤ ਖੰਡ ਚੁਣਿਆ ਗਿਆ ਹੈ।",
    BOUNDARY_TIME_NOT_CHECKED: "ਹਰ ਖੰਡ ਦੇ ਅੰਦਰ ਸੀਮਾ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਜਾਂਚਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
    PHYSICAL_STAGE_OMITTED: "ਭੌਤਿਕ ਪ੍ਰਵਾਹ ਦਾ ਇੱਕ ਪੜਾਅ ਆਇਤਨ ਜੋੜ ਤੋਂ ਛੁੱਟ ਗਿਆ ਹੈ।",
    INVERSE_STAGE_NOT_ISOLATED: "ਅਣਜਾਣ ਘਟਨਾ ਸਮਾਂ ਜਾਂ ਦਰ ਨੂੰ ਪੱਧਰ ਸਮੀਕਰਨ ਤੋਂ ਠੀਕ ਅਲੱਗ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
    STAGE_DURATION_COMPLEMENT_USED: "ਪੁੱਛੇ ਪੜਾਅ ਦੀ ਥਾਂ ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਉਸ ਦਾ ਪੂਰਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    ORIGINAL_EVENT_TIME_REPORTED: "ਸਮਾਯੋਜਨ ਦੀ ਥਾਂ ਮੂਲ ਬਦਲਾਅ ਸਮਾਂ ਹੀ ਉੱਤਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    PHYSICAL_DURATION_IGNORED: "ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਨੂੰ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਆਇਤਨ ਮੰਨਿਆ ਗਿਆ ਹੈ।",
    COMPLEMENT_LEVEL_REPORTED: "ਅੰਤਿਮ ਭਰੇ ਹਿੱਸੇ ਦੀ ਥਾਂ ਉਸ ਦਾ ਖਾਲੀ ਪੂਰਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    CONTROL_CYCLE_COUNT_IGNORED: "ਲੋੜੀਂਦੀ ਉੱਪਰਲੇ ਪੱਧਰ ਵਾਪਸੀ ਦੀ ਗਿਣਤੀ ਲਾਗੂ ਨਹੀਂ ਕੀਤੀ ਗਈ।",
    RATE_TIME_RECIPROCAL_ERROR: "ਦਰ ਅਤੇ ਸਮੇਂ ਦੇ ਉਲਟ ਸੰਬੰਧ ਨੂੰ ਗਲਤ ਲਗਾਇਆ ਗਿਆ ਹੈ।",
    PLAUSIBLE_SCALE_ERROR: "ਗਣਨਾ ਸਹੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ, ਪਰ ਮਾਨ ਨੂੰ ਗਲਤ ਗੁਣਕ ਨਾਲ ਵਧਾਇਆ ਜਾਂ ਘਟਾਇਆ ਗਿਆ ਹੈ।",
  };
  return language === "hi" ? hi[id] : pa[id];
}

export function tmwCp010LocalizedConclusion(
  source: TmwCp010GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  if (language === "hi") {
    switch (source.solution.answerType) {
      case "TIME": return source.solveMode === "findScheduleAdjustmentForDeadline" ? `अतः कार्यक्रम का बदलाव ${answerText} करना होगा।` : `अतः आवश्यक समय: ${answerText}।`;
      case "LEVEL": return `अतः कार्यक्रम के अंत में टंकी ${answerText} है।`;
      case "FLOW_RATE": return `अतः अंतिम पाइप की आवश्यक दर: ${answerText}।`;
      case "CAPACITY": return `अतः टंकी की क्षमता: ${answerText}।`;
      case "COUNT": return `अतः अंतिम चक्र से पहले ${answerText} समाप्त होते हैं।`;
      case "SEGMENT": return `अतः टंकी ${answerText} में सीमा तक पहुँचती है।`;
    }
  }
  switch (source.solution.answerType) {
    case "TIME": return source.solveMode === "findScheduleAdjustmentForDeadline" ? `ਇਸ ਲਈ ਕਾਰਜਕ੍ਰਮ ਦਾ ਬਦਲਾਅ ${answerText} ਕਰਨਾ ਹੋਵੇਗਾ।` : `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ: ${answerText}।`;
    case "LEVEL": return `ਇਸ ਲਈ ਕਾਰਜਕ੍ਰਮ ਦੇ ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ${answerText} ਹੈ।`;
    case "FLOW_RATE": return `ਇਸ ਲਈ ਅੰਤਿਮ ਪਾਈਪ ਦੀ ਲੋੜੀਂਦੀ ਦਰ: ${answerText}।`;
    case "CAPACITY": return `ਇਸ ਲਈ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ: ${answerText}।`;
    case "COUNT": return `ਇਸ ਲਈ ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ${answerText} ਮੁਕੰਮਲ ਹੁੰਦੇ ਹਨ।`;
    case "SEGMENT": return `ਇਸ ਲਈ ਟੈਂਕੀ ${answerText} ਵਿੱਚ ਸੀਮਾ ਤੱਕ ਪਹੁੰਚਦੀ ਹੈ।`;
  }
}
