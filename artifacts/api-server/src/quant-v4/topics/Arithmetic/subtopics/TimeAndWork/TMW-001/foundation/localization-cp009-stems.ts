import { compare } from "./rational";
import { required } from "./cp001-helpers";
import { tmwCp009NetRate } from "./cp009-engine";
import type { TmwCp009GeneratedQuestion, TmwCp009Pipe } from "./cp009-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp009Boundary,
  cp009Copy,
  cp009FlowUnit,
  cp009Number,
  cp009PipeLabel,
  cp009PipeList,
  cp009Time,
} from "./localization-cp009-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function setting(source: TmwCp009GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return `${cp009Copy(source.parameters.context.setting, language)} ${language === "hi" ? "में" : "ਵਿੱਚ"}`;
}

function tank(source: TmwCp009GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return cp009Copy(source.parameters.context.tankLabel, language);
}

function pipeAction(pipe: TmwCp009Pipe, language: TmwLocalizedLanguage): string {
  if (pipe.kind === "INLET") return pair(language, "भरने", "ਭਰਨ");
  return pair(language, "खाली करने", "ਖਾਲੀ ਕਰਨ");
}

function initialBoundary(boundary: "FULL" | "EMPTY", language: TmwLocalizedLanguage): string {
  if (boundary === "FULL") return pair(language, "शुरू में खाली", "ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ");
  return pair(language, "शुरू में पूरी तरह भरी", "ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ");
}

export function renderTmwCp009LocalizedStem(
  source: TmwCp009GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const label = tank(source, language);
  const net = tmwCp009NetRate(p.pipes);

  switch (source.solveMode) {
    case "findFillTimeFromPositiveInlets":
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में खाली है। ${cp009PipeList(p, language)}। सभी भरने वाली पाइपें एक साथ खोलने पर टंकी पूरी भरने में कितना समय लेंगी?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਖੋਲ੍ਹਣ ਤੇ ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );

    case "findFillTimeFromMixedPipes":
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में खाली है। ${cp009PipeList(p, language)}। सभी पाइपें लगातार खुली रहती हैं। टंकी पूरी भरने में कितना समय लगेगा?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਲਗਾਤਾਰ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ। ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );

    case "findEmptyTimeFromMixedPipes":
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में पूरी तरह भरी है। ${cp009PipeList(p, language)}। सभी पाइपें लगातार खुली रहती हैं। टंकी पूरी खाली होने में कितना समय लगेगा?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਲਗਾਤਾਰ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ। ਟੈਂਕੀ ਪੂਰੀ ਖਾਲੀ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );

    case "findNetFractionChangedInGivenTime": {
      const rising = compare(net, { numerator: 0, denominator: 1 }) > 0;
      return pair(
        language,
        `${setting(source, language)} ${cp009PipeList(p, language)}। टंकी शुरू में ${rising ? "खाली" : "पूरी तरह भरी"} है और सभी पाइपें ${cp009Time(required(p.duration, "duration"), language)} तक खुली रहती हैं। इस अवधि में टंकी का कितना भाग ${rising ? "भरेगा" : "खाली होगा"}?`,
        `${setting(source, language)} ${cp009PipeList(p, language)}। ਟੈਂਕੀ ਸ਼ੁਰੂ ਵਿੱਚ ${rising ? "ਖਾਲੀ" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰੀ"} ਹੈ ਅਤੇ ਸਾਰੀਆਂ ਪਾਈਪਾਂ ${cp009Time(required(p.duration, "duration"), language)} ਤੱਕ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ। ਇਸ ਮਿਆਦ ਵਿੱਚ ਟੈਂਕੀ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ${rising ? "ਭਰੇਗਾ" : "ਖਾਲੀ ਹੋਵੇਗਾ"}?`,
      );
    }

    case "findMissingInletTime": {
      const index = required(p.unknownPipeIndex, "unknownPipeIndex");
      const unknown = p.pipes[index];
      const boundary = required(p.targetBoundary, "targetBoundary");
      return pair(
        language,
        `${setting(source, language)} ज्ञात पाइपें: ${cp009PipeList(p, language, index)}। ${cp009PipeLabel(unknown, language)} भी उसी समय खोली जाती है। सभी पाइपें मिलकर ${initialBoundary(boundary, language)} ${label} को ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} में ${cp009Boundary(boundary, language)} देती हैं। ${cp009PipeLabel(unknown, language)} अकेले टंकी भरने में कितना समय लेगी?`,
        `${setting(source, language)} ਪਤਾ ਪਾਈਪਾਂ: ${cp009PipeList(p, language, index)}। ${cp009PipeLabel(unknown, language)} ਵੀ ਉਸੇ ਵੇਲੇ ਖੋਲੀ ਜਾਂਦੀ ਹੈ। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਮਿਲ ਕੇ ${initialBoundary(boundary, language)} ${label} ਨੂੰ ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} ਵਿੱਚ ${cp009Boundary(boundary, language)} ਦਿੰਦੀਆਂ ਹਨ। ${cp009PipeLabel(unknown, language)} ਇਕੱਲੀ ਟੈਂਕੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗੀ?`,
      );
    }

    case "findMissingOutletOrLeakTime": {
      const index = required(p.unknownPipeIndex, "unknownPipeIndex");
      const unknown = p.pipes[index];
      const boundary = required(p.targetBoundary, "targetBoundary");
      return pair(
        language,
        `${setting(source, language)} ज्ञात पाइपें: ${cp009PipeList(p, language, index)}। ${cp009PipeLabel(unknown, language)} भी लगातार काम करती है। सभी पाइपें मिलकर ${initialBoundary(boundary, language)} ${label} को ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} में ${cp009Boundary(boundary, language)} देती हैं। ${cp009PipeLabel(unknown, language)} अकेले पूरी भरी टंकी खाली करने में कितना समय लेगी?`,
        `${setting(source, language)} ਪਤਾ ਪਾਈਪਾਂ: ${cp009PipeList(p, language, index)}। ${cp009PipeLabel(unknown, language)} ਵੀ ਲਗਾਤਾਰ ਕੰਮ ਕਰਦੀ ਹੈ। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਮਿਲ ਕੇ ${initialBoundary(boundary, language)} ${label} ਨੂੰ ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} ਵਿੱਚ ${cp009Boundary(boundary, language)} ਦਿੰਦੀਆਂ ਹਨ। ${cp009PipeLabel(unknown, language)} ਇਕੱਲੀ ਪੂਰੀ ਭਰੀ ਟੈਂਕੀ ਖਾਲੀ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗੀ?`,
      );
    }

    case "findIdenticalPipeCountForTargetTime":
      return pair(
        language,
        `${setting(source, language)} एक भरने वाली पाइप खाली ${label} को ${cp009Time(required(p.identicalPipeSoloTime, "identicalPipeSoloTime"), language)} में भरती है। टंकी को ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} में भरने के लिए ऐसी कितनी समान पाइपें एक साथ खोलनी होंगी?`,
        `${setting(source, language)} ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਖਾਲੀ ${label} ਨੂੰ ${cp009Time(required(p.identicalPipeSoloTime, "identicalPipeSoloTime"), language)} ਵਿੱਚ ਭਰਦੀ ਹੈ। ਟੈਂਕੀ ਨੂੰ ${cp009Time(required(p.targetCompletionTime, "targetCompletionTime"), language)} ਵਿੱਚ ਭਰਨ ਲਈ ਅਜਿਹੀਆਂ ਕਿੰਨੀਆਂ ਇੱਕੋ ਜਿਹੀਆਂ ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਖੋਲ੍ਹਣੀਆਂ ਪੈਣਗੀਆਂ?`,
      );

    case "findTankCapacityFromFlowAndTime":
      return pair(
        language,
        `${setting(source, language)} एक भरने वाली पाइप ${cp009Number(required(p.physicalFlow, "physicalFlow"))} लीटर पानी प्रति घंटा देती है और खाली ${label} को ${cp009Time(required(p.physicalTime, "physicalTime"), language)} में भरती है। टंकी की क्षमता कितनी है?`,
        `${setting(source, language)} ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ਲੀਟਰ ਪਾਣੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਿੰਦੀ ਹੈ ਅਤੇ ਖਾਲੀ ${label} ਨੂੰ ${cp009Time(required(p.physicalTime, "physicalTime"), language)} ਵਿੱਚ ਭਰਦੀ ਹੈ। ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੈ?`,
      );

    case "findFlowRateFromCapacityAndTime":
      return pair(
        language,
        `${setting(source, language)} ${label} की क्षमता ${cp009Number(required(p.capacity, "capacity"))} लीटर है। एक भरने वाली पाइप इसे खाली अवस्था से ${cp009Time(required(p.physicalTime, "physicalTime"), language)} में भरती है। पाइप की प्रवाह दर लीटर प्रति घंटा में कितनी है?`,
        `${setting(source, language)} ${label} ਦੀ ਸਮਰੱਥਾ ${cp009Number(required(p.capacity, "capacity"))} ਲੀਟਰ ਹੈ। ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਇਸ ਨੂੰ ਖਾਲੀ ਹਾਲਤ ਤੋਂ ${cp009Time(required(p.physicalTime, "physicalTime"), language)} ਵਿੱਚ ਭਰਦੀ ਹੈ। ਪਾਈਪ ਦੀ ਪ੍ਰਵਾਹ ਦਰ ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਵਿੱਚ ਕਿੰਨੀ ਹੈ?`,
      );

    case "findTimeFromCapacityAndNetFlow":
      return pair(
        language,
        `${setting(source, language)} खाली ${label} की क्षमता ${cp009Number(required(p.capacity, "capacity"))} लीटर है। सभी पाइपों का शुद्ध भराव ${cp009Number(required(p.physicalFlow, "physicalFlow"))} लीटर प्रति घंटा है। टंकी पूरी भरने में कितना समय लगेगा?`,
        `${setting(source, language)} ਖਾਲੀ ${label} ਦੀ ਸਮਰੱਥਾ ${cp009Number(required(p.capacity, "capacity"))} ਲੀਟਰ ਹੈ। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਦਾ ਸ਼ੁੱਧ ਭਰਾਅ ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਹੈ। ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );

    case "convertFlowUnits":
      return pair(
        language,
        `${setting(source, language)} एक आपूर्ति पाइप ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ${cp009FlowUnit(required(p.sourceFlowUnit, "sourceFlowUnit"), language)} पानी देती है। यही प्रवाह दर ${cp009FlowUnit(required(p.targetFlowUnit, "targetFlowUnit"), language)} में कितनी होगी?`,
        `${setting(source, language)} ਇੱਕ ਸਪਲਾਈ ਪਾਈਪ ${cp009Number(required(p.physicalFlow, "physicalFlow"))} ${cp009FlowUnit(required(p.sourceFlowUnit, "sourceFlowUnit"), language)} ਪਾਣੀ ਦਿੰਦੀ ਹੈ। ਇਹੀ ਪ੍ਰਵਾਹ ਦਰ ${cp009FlowUnit(required(p.targetFlowUnit, "targetFlowUnit"), language)} ਵਿੱਚ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      );

    case "findTimeFromInitialLevelToBoundary": {
      const boundary = required(p.targetBoundary, "targetBoundary");
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में ${cp009Number(required(p.initialLevel, "initialLevel"))} भरी है। ${cp009PipeList(p, language)}। सभी पाइपें लगातार खुली रहती हैं। टंकी ${cp009Boundary(boundary, language)} होने में कितना समय लेगी?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ${cp009Number(required(p.initialLevel, "initialLevel"))} ਭਰੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਲਗਾਤਾਰ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ। ਟੈਂਕੀ ${cp009Boundary(boundary, language)} ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗੀ?`,
      );
    }

    case "findFinalLevelAfterGivenTime":
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में ${cp009Number(required(p.initialLevel, "initialLevel"))} भरी है। ${cp009PipeList(p, language)}। सभी पाइपें ${cp009Time(required(p.duration, "duration"), language)} तक खुली रहें और उससे पहले कोई सीमा न पहुँचे, तो अंत में टंकी कितनी भरी होगी?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ${cp009Number(required(p.initialLevel, "initialLevel"))} ਭਰੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ${cp009Time(required(p.duration, "duration"), language)} ਤੱਕ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿਣ ਅਤੇ ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਕੋਈ ਸੀਮਾ ਨਾ ਆਵੇ, ਤਾਂ ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ਕਿੰਨੀ ਭਰੀ ਹੋਵੇਗੀ?`,
      );

    case "compareTankCapacities": {
      const state = required(p.comparison, "comparison");
      return pair(
        language,
        `${setting(source, language)} दो पानी की टंकियाँ अलग-अलग भरी जाती हैं। टंकी A को ${cp009Number(state.flowA)} लीटर प्रति घंटा की दर से ${cp009Time(state.timeA, language)} तक और टंकी B को ${cp009Number(state.flowB)} लीटर प्रति घंटा की दर से ${cp009Time(state.timeB, language)} तक भरा जाता है। दोनों खाली से शुरू होकर ठीक पूरी भरती हैं। क्षमता A:B का अनुपात क्या है?`,
        `${setting(source, language)} ਦੋ ਪਾਣੀ ਦੀਆਂ ਟੈਂਕੀਆਂ ਵੱਖ-ਵੱਖ ਭਰੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਟੈਂਕੀ A ਨੂੰ ${cp009Number(state.flowA)} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਦੀ ਦਰ ਨਾਲ ${cp009Time(state.timeA, language)} ਤੱਕ ਅਤੇ ਟੈਂਕੀ B ਨੂੰ ${cp009Number(state.flowB)} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ ਦੀ ਦਰ ਨਾਲ ${cp009Time(state.timeB, language)} ਤੱਕ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵੇਂ ਖਾਲੀ ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਬਿਲਕੁਲ ਪੂਰੀਆਂ ਭਰਦੀਆਂ ਹਨ। ਸਮਰੱਥਾ A:B ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );
    }

    case "findReducedPipeEfficiencyFromChangedTime":
      return pair(
        language,
        `${setting(source, language)} एक भरने वाली पाइप पहले खाली ${label} को ${cp009Time(required(p.originalTime, "originalTime"), language)} में भरती थी। खनिज जमाव के बाद वही काम ${cp009Time(required(p.changedTime, "changedTime"), language)} में होता है। नई दक्षता : पुरानी दक्षता का अनुपात क्या है?`,
        `${setting(source, language)} ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਪਹਿਲਾਂ ਖਾਲੀ ${label} ਨੂੰ ${cp009Time(required(p.originalTime, "originalTime"), language)} ਵਿੱਚ ਭਰਦੀ ਸੀ। ਖਣਿਜ ਜਮਾਵ ਤੋਂ ਬਾਅਦ ਉਹੀ ਕੰਮ ${cp009Time(required(p.changedTime, "changedTime"), language)} ਵਿੱਚ ਹੁੰਦਾ ਹੈ। ਨਵੀਂ ਦੱਖਤਾ : ਪੁਰਾਣੀ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );

    case "findBlockagePercentFromChangedTime":
      return pair(
        language,
        `${setting(source, language)} एक भरने वाली पाइप पहले खाली ${label} को ${cp009Time(required(p.originalTime, "originalTime"), language)} में भरती थी। रुकावट के बाद वही टंकी ${cp009Time(required(p.changedTime, "changedTime"), language)} में भरती है। प्रभावी प्रवाह दर कितने प्रतिशत कम हुई?`,
        `${setting(source, language)} ਇੱਕ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਪਹਿਲਾਂ ਖਾਲੀ ${label} ਨੂੰ ${cp009Time(required(p.originalTime, "originalTime"), language)} ਵਿੱਚ ਭਰਦੀ ਸੀ। ਰੁਕਾਵਟ ਤੋਂ ਬਾਅਦ ਉਹੀ ਟੈਂਕੀ ${cp009Time(required(p.changedTime, "changedTime"), language)} ਵਿੱਚ ਭਰਦੀ ਹੈ। ਪ੍ਰਭਾਵੀ ਪ੍ਰਵਾਹ ਦਰ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟੀ?`,
      );

    case "findNetRateDirection":
      return pair(
        language,
        `${setting(source, language)} ${cp009PipeList(p, language)}। सभी पाइपें एक साथ खोलने पर ${label} में पानी के स्तर के साथ क्या होगा?`,
        `${setting(source, language)} ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ਇਕੱਠੀਆਂ ਖੋਲ੍ਹਣ ਤੇ ${label} ਵਿੱਚ ਪਾਣੀ ਦੇ ਪੱਧਰ ਨਾਲ ਕੀ ਹੋਵੇਗਾ?`,
      );

    case "findBoundaryEventFeasibility": {
      const boundary = required(p.targetBoundary, "targetBoundary");
      return pair(
        language,
        `${setting(source, language)} ${label} शुरू में ${cp009Number(required(p.initialLevel, "initialLevel"))} भरी है। ${cp009PipeList(p, language)}। सभी पाइपें ${cp009Time(required(p.decisionWindow, "decisionWindow"), language)} तक खुली रहती हैं। क्या इस अवधि में टंकी ${cp009Boundary(boundary, language)} जाएगी?`,
        `${setting(source, language)} ${label} ਸ਼ੁਰੂ ਵਿੱਚ ${cp009Number(required(p.initialLevel, "initialLevel"))} ਭਰੀ ਹੈ। ${cp009PipeList(p, language)}। ਸਾਰੀਆਂ ਪਾਈਪਾਂ ${cp009Time(required(p.decisionWindow, "decisionWindow"), language)} ਤੱਕ ਖੁੱਲ੍ਹੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ। ਕੀ ਇਸ ਮਿਆਦ ਵਿੱਚ ਟੈਂਕੀ ${cp009Boundary(boundary, language)} ਜਾਵੇਗੀ?`,
      );
    }
  }
}
