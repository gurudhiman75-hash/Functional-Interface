import { compare, rational } from "./rational";
import { required } from "./cp001-helpers";
import { tmwCp009NetRate } from "./cp009-engine";
import type {
  TmwCp009GeneratedQuestion,
  TmwCp009MisconceptionId,
  TmwCp009RuleId,
} from "./cp009-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp009Boundary,
  cp009FlowUnit,
  cp009NetDirection,
  cp009Number,
  cp009PipeLabel,
  cp009PipeList,
  cp009Time,
} from "./localization-cp009-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

export function tmwCp009LocalizedOpening(
  ruleId: TmwCp009RuleId,
  language: TmwLocalizedLanguage,
): string {
  switch (ruleId) {
    case "TMW_POSITIVE_FLOW":
      return pair(language, "हर भरने वाली पाइप का समय दर में बदलें: प्रति घंटा भरा भाग = 1/समय। पाइपों के समय नहीं, उनकी दरें जोड़ी जाती हैं।", "ਹਰ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦਾ ਸਮਾਂ ਦਰ ਵਿੱਚ ਬਦਲੋ: ਪ੍ਰਤੀ ਘੰਟਾ ਭਰਿਆ ਹਿੱਸਾ = 1/ਸਮਾਂ। ਪਾਈਪਾਂ ਦੇ ਸਮੇਂ ਨਹੀਂ, ਉਨ੍ਹਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।");
    case "TMW_SIGNED_FLOW":
      return pair(language, "भरने वाली पाइप की दर धनात्मक और निकासी पाइप या रिसाव की दर ऋणात्मक लें। शुद्ध दर का चिन्ह दिशा बताता है और उसका परिमाण गति बताता है।", "ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਦੀ ਦਰ ਧਨਾਤਮਕ ਅਤੇ ਨਿਕਾਸੀ ਪਾਈਪ ਜਾਂ ਰਿਸਾਅ ਦੀ ਦਰ ਰਿਣਾਤਮਕ ਲਵੋ। ਸ਼ੁੱਧ ਦਰ ਦਾ ਚਿੰਨ੍ਹ ਦਿਸ਼ਾ ਅਤੇ ਉਸ ਦਾ ਪਰਿਮਾਣ ਗਤੀ ਦੱਸਦਾ ਹੈ।");
    case "TMW_COMPONENT_EXTRACTION":
      return pair(language, "पहले संयुक्त परिणाम से आवश्यक शुद्ध दर निकालें। फिर ज्ञात हस्ताक्षरित दरों को घटाकर अज्ञात पाइप की दर अलग करें और अंत में उसका व्युत्क्रम लें।", "ਪਹਿਲਾਂ ਸਾਂਝੇ ਨਤੀਜੇ ਤੋਂ ਲੋੜੀਂਦੀ ਸ਼ੁੱਧ ਦਰ ਕੱਢੋ। ਫਿਰ ਪਤਾ ਚਿੰਨ੍ਹਿਤ ਦਰਾਂ ਘਟਾ ਕੇ ਅਣਜਾਣ ਪਾਈਪ ਦੀ ਦਰ ਵੱਖ ਕਰੋ ਅਤੇ ਅੰਤ ਵਿੱਚ ਉਸ ਦਾ ਉਲਟ ਲਵੋ।");
    case "TMW_PIPE_COUNT":
      return pair(language, "समान भरने वाली पाइपों में कुल दर = पाइपों की संख्या × एक पाइप की दर। इसलिए संख्या और भरने का समय व्युत्क्रमानुपाती हैं।", "ਇੱਕੋ ਜਿਹੀਆਂ ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਵਿੱਚ ਕੁੱਲ ਦਰ = ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ × ਇੱਕ ਪਾਈਪ ਦੀ ਦਰ। ਇਸ ਲਈ ਗਿਣਤੀ ਅਤੇ ਭਰਨ ਦਾ ਸਮਾਂ ਉਲਟ ਅਨੁਪਾਤੀ ਹਨ।");
    case "TMW_PHYSICAL_FLOW":
      return pair(language, "भौतिक प्रवाह में क्षमता = प्रवाह दर × समय। मिनट और घंटे की इकाइयाँ पहले समान करें, फिर आवश्यक गुणा या भाग करें।", "ਭੌਤਿਕ ਪ੍ਰਵਾਹ ਵਿੱਚ ਸਮਰੱਥਾ = ਪ੍ਰਵਾਹ ਦਰ × ਸਮਾਂ। ਮਿੰਟ ਅਤੇ ਘੰਟੇ ਦੀਆਂ ਇਕਾਈਆਂ ਪਹਿਲਾਂ ਇੱਕੋ ਕਰੋ, ਫਿਰ ਲੋੜੀਂਦਾ ਗੁਣਾ ਜਾਂ ਭਾਗ ਕਰੋ।");
    case "TMW_INITIAL_LEVEL":
      return pair(language, "दिए गए प्रारंभिक स्तर से शुरू करें। भरने के लिए शेष भाग 1−प्रारंभिक स्तर है; खाली करने के लिए वर्तमान भरा भाग ही घटाना है।", "ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਭਰਨ ਲਈ ਬਾਕੀ ਹਿੱਸਾ 1−ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਹੈ; ਖਾਲੀ ਕਰਨ ਲਈ ਮੌਜੂਦਾ ਭਰਿਆ ਹਿੱਸਾ ਹੀ ਘਟਾਉਣਾ ਹੈ।");
    case "TMW_CAPACITY_COMPARISON":
      return pair(language, "हर टंकी की क्षमता उसकी भरने की दर और भरने के समय का गुणनफल है। दोनों गुणनफलों का अनुपात प्रश्न में दिए क्रम में रखें।", "ਹਰ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ਉਸ ਦੀ ਭਰਨ ਦਰ ਅਤੇ ਭਰਨ ਸਮੇਂ ਦਾ ਗੁਣਨਫਲ ਹੈ। ਦੋਵਾਂ ਗੁਣਨਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ।");
    case "TMW_FLOW_EFFICIENCY":
      return pair(language, "एक ही टंकी के लिए पाइप की दक्षता भरने के समय के व्युत्क्रमानुपाती है। अधिक समय का अर्थ कम प्रभावी प्रवाह है।", "ਇੱਕੋ ਟੈਂਕੀ ਲਈ ਪਾਈਪ ਦੀ ਦੱਖਤਾ ਭਰਨ ਸਮੇਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤੀ ਹੈ। ਵੱਧ ਸਮੇਂ ਦਾ ਅਰਥ ਘੱਟ ਪ੍ਰਭਾਵੀ ਪ੍ਰਵਾਹ ਹੈ।");
    case "TMW_DIRECTION_FEASIBILITY":
      return pair(language, "शुद्ध दर का चिन्ह स्तर बढ़ने, घटने या स्थिर रहने की दिशा बताता है। समय-सीमा प्रश्न में पहले सीमा तक पहुँचने का सही समय निकालकर उपलब्ध अवधि से तुलना करें।", "ਸ਼ੁੱਧ ਦਰ ਦਾ ਚਿੰਨ੍ਹ ਪੱਧਰ ਵਧਣ, ਘਟਣ ਜਾਂ ਸਥਿਰ ਰਹਿਣ ਦੀ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ। ਸਮਾਂ-ਸੀਮਾ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪਹਿਲਾਂ ਸੀਮਾ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਹੀ ਸਮਾਂ ਕੱਢ ਕੇ ਉਪਲਬਧ ਮਿਆਦ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।");
  }
}

export function tmwCp009LocalizedGivens(
  source: TmwCp009GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  const net = tmwCp009NetRate(p.pipes);
  switch (source.solveMode) {
    case "findFillTimeFromPositiveInlets":
    case "findFillTimeFromMixedPipes":
    case "findEmptyTimeFromMixedPipes":
      return [
        pair(language, `पाइप अभिलेख: ${cp009PipeList(p, language)}।`, `ਪਾਈਪ ਰਿਕਾਰਡ: ${cp009PipeList(p, language)}।`),
        pair(language, `लक्ष्य: टंकी को ${source.solveMode === "findEmptyTimeFromMixedPipes" ? "पूरी खाली" : "पूरी भरने"} का समय।`, `ਟੀਚਾ: ਟੈਂਕੀ ਨੂੰ ${source.solveMode === "findEmptyTimeFromMixedPipes" ? "ਪੂਰੀ ਖਾਲੀ" : "ਪੂਰੀ ਭਰਨ"} ਦਾ ਸਮਾਂ।`),
      ];
    case "findNetFractionChangedInGivenTime":
      return [
        pair(language, `संचालन अवधि: ${cp009Time(required(p.duration, "duration"), language)}।`, `ਚਲਾਉਣ ਦੀ ਮਿਆਦ: ${cp009Time(required(p.duration, "duration"), language)}।`),
        pair(language, `शुद्ध दिशा: ${cp009NetDirection(p, language)}; लक्ष्य बदला हुआ भाग है।`, `ਸ਼ੁੱਧ ਦਿਸ਼ਾ: ${cp009NetDirection(p, language)}; ਟੀਚਾ ਬਦਲਿਆ ਹਿੱਸਾ ਹੈ।`),
      ];
    case "findMissingInletTime":
    case "findMissingOutletOrLeakTime": {
      const pipe = p.pipes[required(p.unknownPipeIndex, "unknownPipeIndex")];
      return [
        pair(language, `संयुक्त परिणाम: टंकी ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} में ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)} जाती है।`, `ਸਾਂਝਾ ਨਤੀਜਾ: ਟੈਂਕੀ ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} ਵਿੱਚ ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)} ਜਾਂਦੀ ਹੈ।`),
        pair(language, `अज्ञात: ${cp009PipeLabel(pipe, language)} का अकेले काम करने का समय।`, `ਅਣਜਾਣ: ${cp009PipeLabel(pipe, language)} ਦਾ ਇਕੱਲੀ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ।`),
      ];
    }
    case "findIdenticalPipeCountForTargetTime":
      return [pair(language, `एक पाइप का समय: ${cp009Time(required(p.identicalPipeSoloTime, "identicalPipeSoloTime"), language)}।`, `ਇੱਕ ਪਾਈਪ ਦਾ ਸਮਾਂ: ${cp009Time(required(p.identicalPipeSoloTime, "identicalPipeSoloTime"), language)}।`), pair(language, `वांछित समूह समय: ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)}।`, `ਲੋੜੀਂਦਾ ਸਮੂਹ ਸਮਾਂ: ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)}।`)];
    case "findTankCapacityFromFlowAndTime":
      return [pair(language, `प्रवाह: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} लीटर प्रति घंटा।`, `ਪ੍ਰਵਾਹ: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ।`), pair(language, `भरने का समय: ${cp009Time(required(p.physicalTime, "physicalTime"), language)}।`, `ਭਰਨ ਦਾ ਸਮਾਂ: ${cp009Time(required(p.physicalTime, "physicalTime"), language)}।`)];
    case "findFlowRateFromCapacityAndTime":
      return [pair(language, `क्षमता: ${cp009Number(required(p.capacity, "capacity"))} लीटर।`, `ਸਮਰੱਥਾ: ${cp009Number(required(p.capacity, "capacity"))} ਲੀਟਰ।`), pair(language, `भरने का समय: ${cp009Time(required(p.physicalTime, "physicalTime"), language)}।`, `ਭਰਨ ਦਾ ਸਮਾਂ: ${cp009Time(required(p.physicalTime, "physicalTime"), language)}।`)];
    case "findTimeFromCapacityAndNetFlow":
      return [pair(language, `क्षमता: ${cp009Number(required(p.capacity, "capacity"))} लीटर।`, `ਸਮਰੱਥਾ: ${cp009Number(required(p.capacity, "capacity"))} ਲੀਟਰ।`), pair(language, `शुद्ध भराव: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} लीटर प्रति घंटा।`, `ਸ਼ੁੱਧ ਭਰਾਅ: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ।`)];
    case "convertFlowUnits":
      return [pair(language, `दिया प्रवाह: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ${cp009FlowUnit(required(p.sourceFlowUnit, "sourceFlowUnit"), language)}।`, `ਦਿੱਤਾ ਪ੍ਰਵਾਹ: ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ${cp009FlowUnit(required(p.sourceFlowUnit, "sourceFlowUnit"), language)}।`), pair(language, `आवश्यक इकाई: ${cp009FlowUnit(required(p.targetFlowUnit, "targetFlowUnit"), language)}।`, `ਲੋੜੀਂਦੀ ਇਕਾਈ: ${cp009FlowUnit(required(p.targetFlowUnit, "targetFlowUnit"), language)}।`)];
    case "findTimeFromInitialLevelToBoundary":
      return [pair(language, `प्रारंभिक स्तर: ${cp009Number(required(p.initialLevel, "initialLevel"))} भरी।`, `ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ: ${cp009Number(required(p.initialLevel, "initialLevel"))} ਭਰੀ।`), pair(language, `लक्ष्य सीमा: ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)}।`, `ਟੀਚਾ ਸੀਮਾ: ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)}।`)];
    case "findFinalLevelAfterGivenTime":
      return [pair(language, `प्रारंभिक स्तर: ${cp009Number(required(p.initialLevel, "initialLevel"))} भरी।`, `ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ: ${cp009Number(required(p.initialLevel, "initialLevel"))} ਭਰੀ।`), pair(language, `संचालन समय: ${cp009Time(required(p.duration, "duration"), language)}।`, `ਚਲਾਉਣ ਦਾ ਸਮਾਂ: ${cp009Time(required(p.duration, "duration"), language)}।`)];
    case "compareTankCapacities":
      return [pair(language, "दोनों टंकियाँ खाली से शुरू होकर पूरी भरती हैं।", "ਦੋਵੇਂ ਟੈਂਕੀਆਂ ਖਾਲੀ ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਪੂਰੀਆਂ ਭਰਦੀਆਂ ਹਨ।"), pair(language, "आवश्यक क्रम: टंकी A की क्षमता : टंकी B की क्षमता।", "ਲੋੜੀਂਦਾ ਕ੍ਰਮ: ਟੈਂਕੀ A ਦੀ ਸਮਰੱਥਾ : ਟੈਂਕੀ B ਦੀ ਸਮਰੱਥਾ।")];
    case "findReducedPipeEfficiencyFromChangedTime":
    case "findBlockagePercentFromChangedTime":
      return [pair(language, `पुराना भरने का समय: ${cp009Time(required(p.originalTime, "originalTime"), language)}।`, `ਪੁਰਾਣਾ ਭਰਨ ਸਮਾਂ: ${cp009Time(required(p.originalTime, "originalTime"), language)}।`), pair(language, `बदला भरने का समय: ${cp009Time(required(p.changedTime, "changedTime"), language)}।`, `ਬਦਲਿਆ ਭਰਨ ਸਮਾਂ: ${cp009Time(required(p.changedTime, "changedTime"), language)}।`)];
    case "findNetRateDirection":
      return [pair(language, `पाइप अभिलेख: ${cp009PipeList(p, language)}।`, `ਪਾਈਪ ਰਿਕਾਰਡ: ${cp009PipeList(p, language)}।`), pair(language, "लक्ष्य: सभी पाइपों के साथ जल-स्तर की दिशा।", "ਟੀਚਾ: ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਨਾਲ ਪਾਣੀ ਦੇ ਪੱਧਰ ਦੀ ਦਿਸ਼ਾ।")];
    case "findBoundaryEventFeasibility":
      return [pair(language, `प्रारंभिक स्तर ${cp009Number(required(p.initialLevel, "initialLevel"))}; उपलब्ध समय ${cp009Time(required(p.decisionWindow, "decisionWindow"), language)}।`, `ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ${cp009Number(required(p.initialLevel, "initialLevel"))}; ਉਪਲਬਧ ਸਮਾਂ ${cp009Time(required(p.decisionWindow, "decisionWindow"), language)}।`), pair(language, `जाँची जा रही सीमा: ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)}।`, `ਜਾਂਚੀ ਜਾ ਰਹੀ ਸੀਮਾ: ${cp009Boundary(required(p.targetBoundary, "targetBoundary"), language)}।`)];
  }
}

export function tmwCp009LocalizedShortcut(
  source: TmwCp009GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const title = (hi: string, pa: string): string => pair(language, `10-सेकंड ${hi}`, `10-ਸਕਿੰਟ ${pa}`);
  switch (source.solveMode) {
    case "findFillTimeFromPositiveInlets": return { title: title("लघुत्तम दर विधि", "ਲਘੁੱਤਮ ਦਰ ਵਿਧੀ"), steps: [pair(language, "पाइप समयों का लघुत्तम समापवर्त्य लेकर टंकी की काल्पनिक इकाइयाँ बनाएँ।", "ਪਾਈਪ ਸਮਿਆਂ ਦਾ ਲਘੁੱਤਮ ਸਮਾਪਵਰਤਕ ਲੈ ਕੇ ਟੈਂਕੀ ਦੀਆਂ ਕਲਪਿਤ ਇਕਾਈਆਂ ਬਣਾਓ।"), pair(language, `प्रति घंटा भरी इकाइयाँ जोड़कर कुल इकाइयों को उनसे भाग दें; उत्तर ${answerText}।`, `ਪ੍ਰਤੀ ਘੰਟਾ ਭਰੀਆਂ ਇਕਾਈਆਂ ਜੋੜ ਕੇ ਕੁੱਲ ਇਕਾਈਆਂ ਨੂੰ ਉਨ੍ਹਾਂ ਨਾਲ ਭਾਗ ਦਿਓ; ਉੱਤਰ ${answerText}।`)] };
    case "findFillTimeFromMixedPipes":
    case "findEmptyTimeFromMixedPipes": return { title: title("चिह्नित दर जाँच", "ਚਿੰਨ੍ਹਿਤ ਦਰ ਜਾਂਚ"), steps: [pair(language, "हर भरने वाली पाइप के लिए +1/T और हर निकासी या रिसाव के लिए −1/T लिखें।", "ਹਰ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਲਈ +1/T ਅਤੇ ਹਰ ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਲਈ −1/T ਲਿਖੋ।"), pair(language, `चिन्ह से दिशा जाँचें और परिमाण का व्युत्क्रम लें; उत्तर ${answerText}।`, `ਚਿੰਨ੍ਹ ਨਾਲ ਦਿਸ਼ਾ ਜਾਂਚੋ ਅਤੇ ਪਰਿਮਾਣ ਦਾ ਉਲਟ ਲਵੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findNetFractionChangedInGivenTime": return { title: title("दर गुणा समय", "ਦਰ ਗੁਣਾ ਸਮਾਂ"), steps: [pair(language, "प्रति घंटा शुद्ध बदला भाग निकालें।", "ਪ੍ਰਤੀ ਘੰਟਾ ਸ਼ੁੱਧ ਬਦਲਿਆ ਹਿੱਸਾ ਕੱਢੋ।"), pair(language, `उसके परिमाण को अवधि से गुणा करें; उत्तर ${answerText}।`, `ਉਸ ਦੇ ਪਰਿਮਾਣ ਨੂੰ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findMissingInletTime":
    case "findMissingOutletOrLeakTime": return { title: title("दर अंतर", "ਦਰ ਅੰਤਰ"), steps: [pair(language, "संयुक्त परिणाम को हस्ताक्षरित शुद्ध दर में बदलें।", "ਸਾਂਝੇ ਨਤੀਜੇ ਨੂੰ ਚਿੰਨ੍ਹਿਤ ਸ਼ੁੱਧ ਦਰ ਵਿੱਚ ਬਦਲੋ।"), pair(language, `ज्ञात दरें घटाकर अज्ञात दर का परिमाण लें और उसका व्युत्क्रम करें; उत्तर ${answerText}।`, `ਪਤਾ ਦਰਾਂ ਘਟਾ ਕੇ ਅਣਜਾਣ ਦਰ ਦਾ ਪਰਿਮਾਣ ਲਵੋ ਅਤੇ ਉਸ ਦਾ ਉਲਟ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findIdenticalPipeCountForTargetTime": return { title: title("उलटा संख्या संबंध", "ਉਲਟ ਗਿਣਤੀ ਸੰਬੰਧ"), steps: [pair(language, "समान पाइपों में संख्या और समय व्युत्क्रमानुपाती हैं।", "ਇੱਕੋ ਜਿਹੀਆਂ ਪਾਈਪਾਂ ਵਿੱਚ ਗਿਣਤੀ ਅਤੇ ਸਮਾਂ ਉਲਟ ਅਨੁਪਾਤੀ ਹਨ।"), pair(language, `एक-पाइप समय ÷ लक्ष्य समय = ${answerText}।`, `ਇੱਕ-ਪਾਈਪ ਸਮਾਂ ÷ ਟੀਚਾ ਸਮਾਂ = ${answerText}।`)] };
    case "findTankCapacityFromFlowAndTime":
    case "findFlowRateFromCapacityAndTime":
    case "findTimeFromCapacityAndNetFlow": return { title: title("क्षमता-दर-समय", "ਸਮਰੱਥਾ-ਦਰ-ਸਮਾਂ"), steps: [pair(language, "क्षमता = प्रवाह दर × समय लिखें।", "ਸਮਰੱਥਾ = ਪ੍ਰਵਾਹ ਦਰ × ਸਮਾਂ ਲਿਖੋ।"), pair(language, `माँगी मात्रा को अकेला करके सीधे गणना करें; उत्तर ${answerText}।`, `ਮੰਗੀ ਮਾਤਰਾ ਨੂੰ ਇਕੱਲਾ ਕਰਕੇ ਸਿੱਧੀ ਗਿਣਤੀ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "convertFlowUnits": return { title: title("साठ का नियम", "ਸੱਠ ਦਾ ਨਿਯਮ"), steps: [pair(language, "प्रति मिनट से प्रति घंटा जाने पर 60 से गुणा करें।", "ਪ੍ਰਤੀ ਮਿੰਟ ਤੋਂ ਪ੍ਰਤੀ ਘੰਟਾ ਜਾਣ ਤੇ 60 ਨਾਲ ਗੁਣਾ ਕਰੋ।"), pair(language, `प्रति घंटा से प्रति मिनट जाने पर 60 से भाग दें; उत्तर ${answerText}।`, `ਪ੍ਰਤੀ ਘੰਟਾ ਤੋਂ ਪ੍ਰਤੀ ਮਿੰਟ ਜਾਣ ਤੇ 60 ਨਾਲ ਭਾਗ ਦਿਓ; ਉੱਤਰ ${answerText}।`)] };
    case "findTimeFromInitialLevelToBoundary": return { title: title("शेष स्तर", "ਬਾਕੀ ਪੱਧਰ"), steps: [pair(language, "भरने के लिए 1−प्रारंभिक स्तर, खाली करने के लिए प्रारंभिक स्तर लें।", "ਭਰਨ ਲਈ 1−ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ, ਖਾਲੀ ਕਰਨ ਲਈ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਲਵੋ।"), pair(language, `आवश्यक बदलाव को शुद्ध दर के परिमाण से भाग दें; उत्तर ${answerText}।`, `ਲੋੜੀਂਦੇ ਬਦਲਾਅ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਦੇ ਪਰਿਮਾਣ ਨਾਲ ਭਾਗ ਦਿਓ; ਉੱਤਰ ${answerText}।`)] };
    case "findFinalLevelAfterGivenTime": return { title: title("हस्ताक्षरित स्तर अद्यतन", "ਚਿੰਨ੍ਹਿਤ ਪੱਧਰ ਅਪਡੇਟ"), steps: [pair(language, "शुद्ध दर × समय को उसके चिन्ह सहित निकालें।", "ਸ਼ੁੱਧ ਦਰ × ਸਮਾਂ ਨੂੰ ਉਸ ਦੇ ਚਿੰਨ੍ਹ ਸਮੇਤ ਕੱਢੋ।"), pair(language, `इस बदलाव को प्रारंभिक स्तर में जोड़ें; उत्तर ${answerText}।`, `ਇਸ ਬਦਲਾਅ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਵਿੱਚ ਜੋੜੋ; ਉੱਤਰ ${answerText}।`)] };
    case "compareTankCapacities": return { title: title("गुणनफल अनुपात", "ਗੁਣਨਫਲ ਅਨੁਪਾਤ"), steps: [pair(language, "दोनों टंकियों के लिए प्रवाह × समय लिखें।", "ਦੋਵਾਂ ਟੈਂਕੀਆਂ ਲਈ ਪ੍ਰਵਾਹ × ਸਮਾਂ ਲਿਖੋ।"), pair(language, `समान गुणक काटकर A:B क्रम रखें; उत्तर ${answerText}।`, `ਸਾਂਝੇ ਗੁਣਕ ਕੱਟ ਕੇ A:B ਕ੍ਰਮ ਰੱਖੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findReducedPipeEfficiencyFromChangedTime": return { title: title("उलटा समय अनुपात", "ਉਲਟ ਸਮਾਂ ਅਨੁਪਾਤ"), steps: [pair(language, "एक ही टंकी के लिए दक्षता अनुपात समय अनुपात का उलटा है।", "ਇੱਕੋ ਟੈਂਕੀ ਲਈ ਦੱਖਤਾ ਅਨੁਪਾਤ ਸਮਾਂ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੈ।"), pair(language, `नई:पुरानी दक्षता = पुराना:नया समय; उत्तर ${answerText}।`, `ਨਵੀਂ:ਪੁਰਾਣੀ ਦੱਖਤਾ = ਪੁਰਾਣਾ:ਨਵਾਂ ਸਮਾਂ; ਉੱਤਰ ${answerText}।`)] };
    case "findBlockagePercentFromChangedTime": return { title: title("शेष दक्षता", "ਬਾਕੀ ਦੱਖਤਾ"), steps: [pair(language, "शेष दक्षता = पुराना समय ÷ नया समय।", "ਬਾਕੀ ਦੱਖਤਾ = ਪੁਰਾਣਾ ਸਮਾਂ ÷ ਨਵਾਂ ਸਮਾਂ।"), pair(language, `रुकावट प्रतिशत = 100%−शेष दक्षता प्रतिशत; उत्तर ${answerText}।`, `ਰੁਕਾਵਟ ਪ੍ਰਤੀਸ਼ਤ = 100%−ਬਾਕੀ ਦੱਖਤਾ ਪ੍ਰਤੀਸ਼ਤ; ਉੱਤਰ ${answerText}।`)] };
    case "findNetRateDirection": return { title: title("चिन्ह जाँच", "ਚਿੰਨ੍ਹ ਜਾਂਚ"), steps: [pair(language, "भरने और निकालने की कुल दर अलग-अलग जोड़ें।", "ਭਰਨ ਅਤੇ ਕੱਢਣ ਦੀ ਕੁੱਲ ਦਰ ਵੱਖ-ਵੱਖ ਜੋੜੋ।"), pair(language, `धनात्मक = भरना, ऋणात्मक = खाली होना, शून्य = कोई बदलाव नहीं; उत्तर ${answerText}।`, `ਧਨਾਤਮਕ = ਭਰਨਾ, ਰਿਣਾਤਮਕ = ਖਾਲੀ ਹੋਣਾ, ਸਿਫ਼ਰ = ਕੋਈ ਬਦਲਾਅ ਨਹੀਂ; ਉੱਤਰ ${answerText}।`)] };
    case "findBoundaryEventFeasibility": return { title: title("सीमा तुलना", "ਸੀਮਾ ਤੁਲਨਾ"), steps: [pair(language, "वर्तमान स्तर से पूरी भरने या खाली होने तक आवश्यक बदलाव निकालें।", "ਮੌਜੂਦਾ ਪੱਧਰ ਤੋਂ ਪੂਰੀ ਭਰਨ ਜਾਂ ਖਾਲੀ ਹੋਣ ਤੱਕ ਲੋੜੀਂਦਾ ਬਦਲਾਅ ਕੱਢੋ।"), pair(language, `सीमा समय की उपलब्ध अवधि से तुलना करें; उत्तर ${answerText}।`, `ਸੀਮਾ ਸਮੇਂ ਦੀ ਉਪਲਬਧ ਮਿਆਦ ਨਾਲ ਤੁਲਨਾ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
  }
}

export function tmwCp009LocalizedTrapReason(
  id: TmwCp009MisconceptionId,
  language: TmwLocalizedLanguage,
): string {
  switch (id) {
    case "OTHER_PIPES_IGNORED": return pair(language, "यह विकल्प अन्य खुली पाइपों के योगदान को छोड़कर केवल एक पाइप का समय लेता है।", "ਇਹ ਚੋਣ ਹੋਰ ਖੁੱਲ੍ਹੀਆਂ ਪਾਈਪਾਂ ਦੇ ਯੋਗਦਾਨ ਨੂੰ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਇੱਕ ਪਾਈਪ ਦਾ ਸਮਾਂ ਲੈਂਦੀ ਹੈ।");
    case "PIPE_TIMES_ADDED": return pair(language, "यह विकल्प पाइपों की दरें जोड़ने के बजाय उनके समय जोड़ता या औसत करता है।", "ਇਹ ਚੋਣ ਪਾਈਪਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜਨ ਦੀ ਥਾਂ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਜੋੜਦੀ ਜਾਂ ਔਸਤ ਕਰਦੀ ਹੈ।");
    case "OUTFLOW_ADDED_AS_INFLOW": return pair(language, "यह विकल्प निकासी या रिसाव को ऋणात्मक लेने के बजाय भराव में जोड़ देता है।", "ਇਹ ਚੋਣ ਨਿਕਾਸੀ ਜਾਂ ਰਿਸਾਅ ਨੂੰ ਰਿਣਾਤਮਕ ਲੈਣ ਦੀ ਥਾਂ ਭਰਾਅ ਵਿੱਚ ਜੋੜ ਦਿੰਦੀ ਹੈ।");
    case "INFLOW_SUBTRACTED_FROM_OUTFLOW_WRONGLY": return pair(language, "यह विकल्प हस्ताक्षरित दरों का घटाव उलटी दिशा में करता है।", "ਇਹ ਚੋਣ ਚਿੰਨ੍ਹਿਤ ਦਰਾਂ ਦਾ ਘਟਾਅ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਕਰਦੀ ਹੈ।");
    case "TIME_USED_AS_RATE": return pair(language, "यह विकल्प पूर्णता समय को सीधे दर मानता है या दिए समय को ही उत्तर बना देता है।", "ਇਹ ਚੋਣ ਪੂਰਨਤਾ ਸਮੇਂ ਨੂੰ ਸਿੱਧਾ ਦਰ ਮੰਨਦੀ ਹੈ ਜਾਂ ਦਿੱਤੇ ਸਮੇਂ ਨੂੰ ਹੀ ਉੱਤਰ ਬਣਾ ਦਿੰਦੀ ਹੈ।");
    case "DURATION_IGNORED": return pair(language, "यह विकल्प प्रति घंटा दर पर रुक जाता है और दी गई अवधि लागू नहीं करता।", "ਇਹ ਚੋਣ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਉੱਤੇ ਰੁਕ ਜਾਂਦੀ ਹੈ ਅਤੇ ਦਿੱਤੀ ਮਿਆਦ ਲਾਗੂ ਨਹੀਂ ਕਰਦੀ।");
    case "INITIAL_LEVEL_IGNORED": return pair(language, "यह विकल्प आंशिक भरी टंकी को पूरी खाली या पूरी भरी मान लेता है।", "ਇਹ ਚੋਣ ਅੰਸ਼ਿਕ ਭਰੀ ਟੈਂਕੀ ਨੂੰ ਪੂਰੀ ਖਾਲੀ ਜਾਂ ਪੂਰੀ ਭਰੀ ਮੰਨ ਲੈਂਦੀ ਹੈ।");
    case "REMAINING_LEVEL_IGNORED": return pair(language, "यह विकल्प लक्ष्य तक आवश्यक शेष बदलाव के बजाय वर्तमान स्तर का गलत भाग उपयोग करता है।", "ਇਹ ਚੋਣ ਟੀਚੇ ਤੱਕ ਲੋੜੀਂਦੇ ਬਾਕੀ ਬਦਲਾਅ ਦੀ ਥਾਂ ਮੌਜੂਦਾ ਪੱਧਰ ਦਾ ਗਲਤ ਹਿੱਸਾ ਵਰਤਦੀ ਹੈ।");
    case "KNOWN_PIPE_SIGN_IGNORED": return pair(language, "यह विकल्प ज्ञात पाइप को छोड़ता है या उसे गलत धनात्मक/ऋणात्मक चिन्ह देता है।", "ਇਹ ਚੋਣ ਪਤਾ ਪਾਈਪ ਨੂੰ ਛੱਡਦੀ ਹੈ ਜਾਂ ਉਸ ਨੂੰ ਗਲਤ ਧਨਾਤਮਕ/ਰਿਣਾਤਮਕ ਚਿੰਨ੍ਹ ਦਿੰਦੀ ਹੈ।");
    case "COUNT_RATIO_REVERSED": return pair(language, "यह विकल्प समान पाइपों की संख्या और समय का उलटा संबंध गलत दिशा में लगाता है।", "ਇਹ ਚੋਣ ਇੱਕੋ ਜਿਹੀਆਂ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਮੇਂ ਦਾ ਉਲਟ ਸੰਬੰਧ ਗਲਤ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਉਂਦੀ ਹੈ।");
    case "CAPACITY_REPORTED_AS_FLOW": return pair(language, "यह विकल्प टंकी की क्षमता को समय से भाग दिए बिना प्रवाह दर बता देता है।", "ਇਹ ਚੋਣ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ਨੂੰ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿੱਤੇ ਬਿਨਾਂ ਪ੍ਰਵਾਹ ਦਰ ਦੱਸ ਦਿੰਦੀ ਹੈ।");
    case "CAPACITY_FLOW_TIME_REVERSED": return pair(language, "यह विकल्प क्षमता, प्रवाह और समय का संबंध उलटी गणना से उपयोग करता है।", "ਇਹ ਚੋਣ ਸਮਰੱਥਾ, ਪ੍ਰਵਾਹ ਅਤੇ ਸਮੇਂ ਦਾ ਸੰਬੰਧ ਉਲਟੀ ਗਿਣਤੀ ਨਾਲ ਵਰਤਦੀ ਹੈ।");
    case "FLOW_UNIT_NOT_CONVERTED": return pair(language, "यह विकल्प मिनट और घंटे की इकाइयाँ नहीं बदलता या 60 का गुणक उलटा लगाता है।", "ਇਹ ਚੋਣ ਮਿੰਟ ਅਤੇ ਘੰਟੇ ਦੀਆਂ ਇਕਾਈਆਂ ਨਹੀਂ ਬਦਲਦੀ ਜਾਂ 60 ਦਾ ਗੁਣਕ ਉਲਟ ਲਗਾਉਂਦੀ ਹੈ।");
    case "RATIO_ORDER_REVERSED": return pair(language, "यह विकल्प सही अनुपात को प्रश्न में माँगे क्रम के उलट लिखता है।", "ਇਹ ਚੋਣ ਸਹੀ ਅਨੁਪਾਤ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੇ ਕ੍ਰਮ ਦੇ ਉਲਟ ਲਿਖਦੀ ਹੈ।");
    case "TIME_EFFICIENCY_INVERSION_MISSED": return pair(language, "यह विकल्प भरने के समय और पाइप दक्षता को सीधे समानुपाती मानता है।", "ਇਹ ਚੋਣ ਭਰਨ ਸਮੇਂ ਅਤੇ ਪਾਈਪ ਦੱਖਤਾ ਨੂੰ ਸਿੱਧਾ ਅਨੁਪਾਤੀ ਮੰਨਦੀ ਹੈ।");
    case "BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY": return pair(language, "यह विकल्प रुकावट से खोई दक्षता के बजाय बची हुई दक्षता बताता है।", "ਇਹ ਚੋਣ ਰੁਕਾਵਟ ਨਾਲ ਗੁੰਮ ਦੱਖਤਾ ਦੀ ਥਾਂ ਬਚੀ ਹੋਈ ਦੱਖਤਾ ਦੱਸਦੀ ਹੈ।");
    case "DIRECTION_FROM_PIPE_COUNT": return pair(language, "यह विकल्प पाइपों की संख्या देखकर दिशा मान लेता है, उनकी वास्तविक हस्ताक्षरित दरें नहीं तुलना करता।", "ਇਹ ਚੋਣ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ ਵੇਖ ਕੇ ਦਿਸ਼ਾ ਮੰਨ ਲੈਂਦੀ ਹੈ, ਉਨ੍ਹਾਂ ਦੀਆਂ ਅਸਲ ਚਿੰਨ੍ਹਿਤ ਦਰਾਂ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਕਰਦੀ।");
    case "BOUNDARY_TIME_NOT_CHECKED": return pair(language, "यह विकल्प सही सीमा समय की उपलब्ध अवधि से तुलना किए बिना हाँ या नहीं कहता है।", "ਇਹ ਚੋਣ ਸਹੀ ਸੀਮਾ ਸਮੇਂ ਦੀ ਉਪਲਬਧ ਮਿਆਦ ਨਾਲ ਤੁਲਨਾ ਕੀਤੇ ਬਿਨਾਂ ਹਾਂ ਜਾਂ ਨਹੀਂ ਕਹਿੰਦੀ ਹੈ।");
    case "PLAUSIBLE_SCALE_ERROR": return pair(language, "यह पास का मान है, लेकिन हस्ताक्षरित प्रवाह समीकरण और लक्ष्य स्थिति को पूरा नहीं करता।", "ਇਹ ਨੇੜਲਾ ਮਾਨ ਹੈ, ਪਰ ਚਿੰਨ੍ਹਿਤ ਪ੍ਰਵਾਹ ਸਮੀਕਰਨ ਅਤੇ ਟੀਚਾ ਹਾਲਤ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।");
    case "CORRECT": return pair(language, "यह सही उत्तर है।", "ਇਹ ਸਹੀ ਉੱਤਰ ਹੈ।");
  }
}

export function tmwCp009LocalizedConclusion(
  source: TmwCp009GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  switch (source.solution.answerType) {
    case "TIME": return pair(language, `अतः आवश्यक समय: ${answerText}।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ: ${answerText}।`);
    case "FRACTION": return pair(language, `अतः निर्धारित अवधि में ${answerText}।`, `ਇਸ ਲਈ ਨਿਰਧਾਰਤ ਮਿਆਦ ਵਿੱਚ ${answerText}।`);
    case "COUNT": return pair(language, `अतः आवश्यक पाइपों की संख्या: ${answerText}।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀਆਂ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ: ${answerText}।`);
    case "CAPACITY": return pair(language, `अतः टंकी की क्षमता: ${answerText}।`, `ਇਸ ਲਈ ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ: ${answerText}।`);
    case "FLOW_RATE": return pair(language, `अतः आवश्यक प्रवाह दर: ${answerText}।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਵਾਹ ਦਰ: ${answerText}।`);
    case "LEVEL": return pair(language, `अतः अंतिम जल-स्तर: ${answerText}।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਪਾਣੀ ਪੱਧਰ: ${answerText}।`);
    case "RATIO": return pair(language, `अतः आवश्यक अनुपात: ${answerText}।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ: ${answerText}।`);
    case "PERCENT": return pair(language, `अतः प्रभावी प्रवाह दर में कमी: ${answerText}।`, `ਇਸ ਲਈ ਪ੍ਰਭਾਵੀ ਪ੍ਰਵਾਹ ਦਰ ਵਿੱਚ ਕਮੀ: ${answerText}।`);
    case "DIRECTION": return pair(language, `अतः ${answerText}।`, `ਇਸ ਲਈ ${answerText}।`);
    case "DECISION": return pair(language, `अतः ${answerText}।`, `ਇਸ ਲਈ ${answerText}।`);
  }
}
