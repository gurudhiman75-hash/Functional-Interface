import { required } from "./cp001-helpers";
import type { TmwCp010GeneratedQuestion } from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp009Time } from "./localization-cp009-language";
import {
  cp010Arrangement,
  cp010Boundary,
  cp010Capabilities,
  cp010Context,
  cp010Label,
  cp010Level,
  cp010NumberedSegments,
  cp010StageText,
  cp010UniquePipes,
} from "./localization-cp010-language";

function sentenceList(items: string[]): string {
  return items.join(" ");
}

function stageCapabilities(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  const p = source.parameters;
  const { tank } = cp010Context(p, language);
  return cp010Capabilities(cp010UniquePipes((p.stages ?? []).map((stage) => stage.pipes)), tank, language);
}

function cycleCapabilities(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  const p = source.parameters;
  const { tank } = cp010Context(p, language);
  return cp010Capabilities(cp010UniquePipes((p.cycle ?? []).map((segment) => segment.pipes)), tank, language);
}

function stageSequence(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return sentenceList(required(source.parameters.stages, "stages").map((stage) => `${cp010StageText(stage, language)}।`));
}

function targetNoun(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return cp010Boundary(source.parameters, language);
}

export function renderTmwCp010LocalizedStem(
  source: TmwCp010GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const stages = p.stages ?? [];
  const cycle = p.cycle ?? [];
  const { setting, tank } = cp010Context(p, language);
  const initial = cp010Level(p.initialLevel, language);
  const target = targetNoun(source, language);

  if (language === "hi") {
    switch (source.solveMode) {
      case "findCompletionAfterDelayedActivation":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp009Time(required(stages[0].duration, "delay"), language)} तक ${cp010Arrangement(stages[0].pipes, language)}। इसके बाद दूसरी व्यवस्था लागू होकर ${cp010Arrangement(stages[1].pipes, language)} और टंकी ${target} होने तक यही व्यवस्था चलती रहती है। शुरू से कुल कितना समय लगेगा?`;
      case "findCompletionAfterDelayedDeactivation":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp009Time(required(stages[0].duration, "delay"), language)} तक ${cp010Arrangement(stages[0].pipes, language)}। फिर एक पाइप बंद या रिसाव ठीक होने के बाद ${cp010Arrangement(stages[1].pipes, language)}। टंकी ${target} होने तक शुरू से कुल कितना समय लगेगा?`;
      case "findCompletionWithMultipleStaggeredEvents":
        return `${setting} में ${tank} शुरू में पूरी तरह खाली है। ${stageCapabilities(source, language)} चरणबद्ध कार्यक्रम इस प्रकार है: ${stageSequence(source, language)} अंतिम व्यवस्था टंकी पूरी भरने तक चलती है। पूरा कार्यक्रम कितने समय में समाप्त होगा?`;
      case "findCompletionWithInterruptedFlow":
        return `${setting} में ${tank} शुरू में पूरी तरह खाली है। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} पहले ${cp009Time(required(stages[0].duration, "first duration"), language)} तक चलती है। फिर ${cp009Time(required(stages[1].duration, "idle duration"), language)} तक सारा प्रवाह बंद रहता है। उसके बाद ${cp010Arrangement(stages[2].pipes, language)} और टंकी पूरी भरने तक चलती रहती है। शुरू से कितना समय लगेगा?`;
      case "findCompletionFromPartialLevelAndStages":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp009Time(required(stages[0].duration, "duration"), language)} तक ${cp010Arrangement(stages[0].pipes, language)}। इसके बाद ${cp010Arrangement(stages[1].pipes, language)} और टंकी पूरी भरने तक चलती रहती है। कुल समय कितना होगा?`;
      case "findFinalLevelAfterStagedSchedule":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पूरा चरणबद्ध कार्यक्रम: ${stageSequence(source, language)} कार्यक्रम के अंत में टंकी का कितना भाग भरा होगा?`;
      case "findCompletionAfterThresholdSwitch":
        return `${setting} में ${tank} शुरू में पूरी तरह खाली है। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} तब तक चलती है जब तक स्तर ${cp010Level(required(p.thresholdLevel, "threshold"), language)} न हो जाए। सेंसर फिर व्यवस्था बदलकर ${cp010Arrangement(stages[1].pipes, language)}। शुरू से टंकी पूरी भरने में कितना समय लगेगा?`;
      case "findEventTimeFromKnownCompletion":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp010Arrangement(stages[0].pipes, language)}। किसी अज्ञात समय पर व्यवस्था बदलती है और फिर ${cp010Arrangement(stages[1].pipes, language)}। टंकी शुरू से ठीक ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} में पूरी भर जाती है। व्यवस्था कितने घंटे बाद बदली?`;
      case "findRequiredFinalStageRate":
        return `${setting} में शुरू में खाली ${tank} को ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} में पूरा भरना है। पहले ${cp009Time(required(stages[0].duration, "first duration"), language)} तक ${cp010Arrangement(stages[0].pipes, language)}। शेष समय अंतिम पाइप अकेली चलती है। उसे प्रति घंटा टंकी का कितना भाग भरना चाहिए?`;
      case "findCapacityFromStagedPhysicalFlows":
        return `${setting} में शुरू में खाली ${tank} को चरणबद्ध भौतिक प्रवाह से भरा जाता है। ${required(p.physicalStages, "physical stages").map((stage, index) => `${index + 1}. ${cp010Label(stage.label, language)}: ${formatPhysical(stage.netFlowLitresPerHour.numerator / stage.netFlowLitresPerHour.denominator)} लीटर प्रति घंटा, अवधि ${cp009Time(stage.duration, language)}।`).join(" ")} अंत में टंकी पूरी भर जाती है। उसकी क्षमता कितनी है?`;
      case "findCompletionWithAlternatingPipes":
        return `${setting} में ${tank} शुरू में पूरी तरह खाली है। ${cycleCapabilities(source, language)} दो-खंड वाला कार्यक्रम भाग 1 से शुरू होकर लगातार दोहरता है: ${cp010NumberedSegments(cycle, language)} टंकी पूरी भरने में कुल कितना समय लगेगा?`;
      case "findCompletionWithPeriodicSchedule":
        return `${setting} में शुरू में खाली ${tank} के लिए यह क्रमबद्ध चक्र बिना अंतराल दोहरता है। ${cycleCapabilities(source, language)} ${cp010NumberedSegments(cycle, language)} टंकी पूरी भरने में कितना समय लगेगा?`;
      case "findAutomaticLevelControlCompletion": {
        const control = required(p.levelControl, "level control");
        return `${setting} में स्वचालित नियंत्रक ${tank} का स्तर ${cp010Level(control.lower, language)} और ${cp010Level(control.upper, language)} के बीच रखता है। ${cp010Capabilities(cp010UniquePipes([control.offPipes, control.onPipes]), tank, language)} ऊपरी स्तर से निकासी चरण शुरू होता है; निचले स्तर पर पहुँचने पर भराव चरण चालू होकर ऊपरी स्तर वापस लाता है। ऊपरी स्तर पर अगली ${control.targetUpperHits}वीं वापसी तक कितना समय लगेगा?`;
      }
      case "findCompletionFromArbitraryCyclePhase":
        return `${setting} में ${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} दोहराव चक्र: ${cp010NumberedSegments(cycle, language)} कार्यक्रम भाग ${(p.startingCycleIndex ?? 0) + 1} से शुरू होकर फिर सामान्य क्रम में चलता है। टंकी पूरी भरने में कितना समय लगेगा?`;
      case "findFullCycleCountToBoundary":
        return `${setting} में शुरू में खाली ${tank} यह चक्र दोहराती है। ${cycleCapabilities(source, language)} ${cp010NumberedSegments(cycle, language)} अंतिम अपूर्ण चक्र में टंकी भरने से पहले कितने पूरे चक्र समाप्त होंगे?`;
      case "findTerminalActiveSegment":
        return `${setting} में ${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} दोहराव कार्यक्रम: ${cp010NumberedSegments(cycle, language)} टंकी पहली बार किस खंड में पूरी भरेगी?`;
      case "findBoundaryEventTimeUnderSchedule":
        return `${setting} में ${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} यह कार्यक्रम इसी क्रम में लगातार दोहरता है: ${cp010NumberedSegments(cycle, language)} टंकी पहली बार ${target} कब होगी?`;
      case "findScheduleAdjustmentForDeadline":
        return `${setting} में ${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} बदलाव से पहले ${cp010Arrangement(stages[0].pipes, language)} और बदलाव के बाद ${cp010Arrangement(stages[1].pipes, language)}। मूल योजना में बदलाव ${cp009Time(required(p.adjustmentBaseDuration, "baseline"), language)} बाद होता है। टंकी को ठीक ${cp009Time(required(p.requiredDeadline, "deadline"), language)} तक भरने के लिए बदलाव को कितने घंटे ${p.adjustmentDirection === "EARLIER" ? "पहले" : "बाद में"} करना होगा?`;
    }
  }

  switch (source.solveMode) {
    case "findCompletionAfterDelayedActivation":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp009Time(required(stages[0].duration, "delay"), language)} ਲਈ ${cp010Arrangement(stages[0].pipes, language)}। ਇਸ ਤੋਂ ਬਾਅਦ ਦੂਜੀ ਵਿਵਸਥਾ ਲਾਗੂ ਹੋ ਕੇ ${cp010Arrangement(stages[1].pipes, language)} ਅਤੇ ਟੈਂਕੀ ${target} ਹੋਣ ਤੱਕ ਇਹੀ ਵਿਵਸਥਾ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionAfterDelayedDeactivation":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp009Time(required(stages[0].duration, "delay"), language)} ਲਈ ${cp010Arrangement(stages[0].pipes, language)}। ਫਿਰ ਇੱਕ ਪਾਈਪ ਬੰਦ ਜਾਂ ਰਿਸਾਅ ਠੀਕ ਹੋਣ ਤੋਂ ਬਾਅਦ ${cp010Arrangement(stages[1].pipes, language)}। ਟੈਂਕੀ ${target} ਹੋਣ ਤੱਕ ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionWithMultipleStaggeredEvents":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ਪੜਾਅਵਾਰ ਕਾਰਜਕ੍ਰਮ: ${stageSequence(source, language)} ਅੰਤਿਮ ਵਿਵਸਥਾ ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦੀ ਹੈ। ਪੂਰਾ ਕਾਰਜਕ੍ਰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਮੁਕੰਮਲ ਹੋਵੇਗਾ?`;
    case "findCompletionWithInterruptedFlow":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} ਪਹਿਲਾਂ ${cp009Time(required(stages[0].duration, "first duration"), language)} ਲਈ ਚੱਲਦੀ ਹੈ। ਫਿਰ ${cp009Time(required(stages[1].duration, "idle duration"), language)} ਲਈ ਸਾਰਾ ਪ੍ਰਵਾਹ ਬੰਦ ਰਹਿੰਦਾ ਹੈ। ਉਸ ਤੋਂ ਬਾਅਦ ${cp010Arrangement(stages[2].pipes, language)} ਅਤੇ ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionFromPartialLevelAndStages":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp009Time(required(stages[0].duration, "duration"), language)} ਲਈ ${cp010Arrangement(stages[0].pipes, language)}। ਇਸ ਤੋਂ ਬਾਅਦ ${cp010Arrangement(stages[1].pipes, language)} ਅਤੇ ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`;
    case "findFinalLevelAfterStagedSchedule":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪੂਰਾ ਪੜਾਅਵਾਰ ਕਾਰਜਕ੍ਰਮ: ${stageSequence(source, language)} ਕਾਰਜਕ੍ਰਮ ਦੇ ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਭਰਿਆ ਹੋਵੇਗਾ?`;
    case "findCompletionAfterThresholdSwitch":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} ਤਦ ਤੱਕ ਚੱਲਦੀ ਹੈ ਜਦੋਂ ਤੱਕ ਪੱਧਰ ${cp010Level(required(p.thresholdLevel, "threshold"), language)} ਨਾ ਹੋ ਜਾਵੇ। ਸੈਂਸਰ ਫਿਰ ਵਿਵਸਥਾ ਬਦਲ ਕੇ ${cp010Arrangement(stages[1].pipes, language)}। ਸ਼ੁਰੂ ਤੋਂ ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findEventTimeFromKnownCompletion":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)}। ਕਿਸੇ ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਵਿਵਸਥਾ ਬਦਲਦੀ ਹੈ ਅਤੇ ਫਿਰ ${cp010Arrangement(stages[1].pipes, language)}। ਟੈਂਕੀ ਸ਼ੁਰੂ ਤੋਂ ਠੀਕ ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} ਵਿੱਚ ਪੂਰੀ ਭਰ ਜਾਂਦੀ ਹੈ। ਵਿਵਸਥਾ ਕਿੰਨੇ ਘੰਟਿਆਂ ਬਾਅਦ ਬਦਲੀ?`;
    case "findRequiredFinalStageRate":
      return `${setting} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ${tank} ਨੂੰ ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} ਵਿੱਚ ਪੂਰਾ ਭਰਨਾ ਹੈ। ਪਹਿਲਾਂ ${cp009Time(required(stages[0].duration, "first duration"), language)} ਲਈ ${cp010Arrangement(stages[0].pipes, language)}। ਬਾਕੀ ਸਮੇਂ ਅੰਤਿਮ ਪਾਈਪ ਇਕੱਲੀ ਚੱਲਦੀ ਹੈ। ਉਸ ਨੂੰ ਪ੍ਰਤੀ ਘੰਟਾ ਟੈਂਕੀ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਭਰਨਾ ਚਾਹੀਦਾ ਹੈ?`;
    case "findCapacityFromStagedPhysicalFlows":
      return `${setting} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ${tank} ਨੂੰ ਪੜਾਅਵਾਰ ਭੌਤਿਕ ਪ੍ਰਵਾਹ ਨਾਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ${required(p.physicalStages, "physical stages").map((stage, index) => `${index + 1}. ${cp010Label(stage.label, language)}: ${formatPhysical(stage.netFlowLitresPerHour.numerator / stage.netFlowLitresPerHour.denominator)} ਲੀਟਰ ਪ੍ਰਤੀ ਘੰਟਾ, ਮਿਆਦ ${cp009Time(stage.duration, language)}।`).join(" ")} ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ਪੂਰੀ ਭਰ ਜਾਂਦੀ ਹੈ। ਇਸ ਦੀ ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੈ?`;
    case "findCompletionWithAlternatingPipes":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਹੈ। ${cycleCapabilities(source, language)} ਦੋ-ਖੰਡ ਵਾਲਾ ਕਾਰਜਕ੍ਰਮ ਭਾਗ 1 ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਲਗਾਤਾਰ ਦੁਹਰਦਾ ਹੈ: ${cp010NumberedSegments(cycle, language)} ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionWithPeriodicSchedule":
      return `${setting} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ${tank} ਲਈ ਇਹ ਕ੍ਰਮਬੱਧ ਚੱਕਰ ਬਿਨਾਂ ਵਿਰਾਮ ਦੁਹਰਦਾ ਹੈ। ${cycleCapabilities(source, language)} ${cp010NumberedSegments(cycle, language)} ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findAutomaticLevelControlCompletion": {
      const control = required(p.levelControl, "level control");
      return `${setting} ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਕੰਟਰੋਲਰ ${tank} ਦਾ ਪੱਧਰ ${cp010Level(control.lower, language)} ਅਤੇ ${cp010Level(control.upper, language)} ਦੇ ਵਿਚਕਾਰ ਰੱਖਦਾ ਹੈ। ${cp010Capabilities(cp010UniquePipes([control.offPipes, control.onPipes]), tank, language)} ਉੱਪਰਲੇ ਪੱਧਰ ਤੋਂ ਨਿਕਾਸੀ ਪੜਾਅ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ; ਹੇਠਲੇ ਪੱਧਰ ਉੱਤੇ ਭਰਾਅ ਪੜਾਅ ਚਾਲੂ ਹੋ ਕੇ ਉੱਪਰਲਾ ਪੱਧਰ ਵਾਪਸ ਲਿਆਉਂਦਾ ਹੈ। ਉੱਪਰਲੇ ਪੱਧਰ ਉੱਤੇ ਅਗਲੀ ${control.targetUpperHits}ਵੀਂ ਵਾਪਸੀ ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    }
    case "findCompletionFromArbitraryCyclePhase":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਦੁਹਰਾਅ ਚੱਕਰ: ${cp010NumberedSegments(cycle, language)} ਕਾਰਜਕ੍ਰਮ ਭਾਗ ${(p.startingCycleIndex ?? 0) + 1} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਫਿਰ ਆਮ ਕ੍ਰਮ ਵਿੱਚ ਚੱਲਦਾ ਹੈ। ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findFullCycleCountToBoundary":
      return `${setting} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ${tank} ਇਹ ਚੱਕਰ ਦੁਹਰਾਉਂਦੀ ਹੈ। ${cycleCapabilities(source, language)} ${cp010NumberedSegments(cycle, language)} ਅੰਤਿਮ ਅਧੂਰੇ ਚੱਕਰ ਵਿੱਚ ਟੈਂਕੀ ਭਰਨ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਮੁਕੰਮਲ ਹੋਣਗੇ?`;
    case "findTerminalActiveSegment":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਦੁਹਰਾਅ ਕਾਰਜਕ੍ਰਮ: ${cp010NumberedSegments(cycle, language)} ਟੈਂਕੀ ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੇ ਖੰਡ ਵਿੱਚ ਪੂਰੀ ਭਰੇਗੀ?`;
    case "findBoundaryEventTimeUnderSchedule":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਇਹ ਕਾਰਜਕ੍ਰਮ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਤਾਰ ਦੁਹਰਦਾ ਹੈ: ${cp010NumberedSegments(cycle, language)} ਟੈਂਕੀ ਪਹਿਲੀ ਵਾਰ ${target} ਕਦੋਂ ਹੋਵੇਗੀ?`;
    case "findScheduleAdjustmentForDeadline":
      return `${setting} ਵਿੱਚ ${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ਅਤੇ ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ${cp010Arrangement(stages[1].pipes, language)}। ਮੂਲ ਯੋਜਨਾ ਵਿੱਚ ਬਦਲਾਅ ${cp009Time(required(p.adjustmentBaseDuration, "baseline"), language)} ਬਾਅਦ ਹੁੰਦਾ ਹੈ। ਟੈਂਕੀ ਨੂੰ ਠੀਕ ${cp009Time(required(p.requiredDeadline, "deadline"), language)} ਤੱਕ ਭਰਨ ਲਈ ਬਦਲਾਅ ਕਿੰਨੇ ਘੰਟੇ ${p.adjustmentDirection === "EARLIER" ? "ਪਹਿਲਾਂ" : "ਬਾਅਦ"} ਕਰਨਾ ਹੋਵੇਗਾ?`;
  }
}

function formatPhysical(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}
