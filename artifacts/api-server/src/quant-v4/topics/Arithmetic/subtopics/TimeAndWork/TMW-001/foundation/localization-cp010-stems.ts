import { required } from "./cp001-helpers";
import type {
  TmwCp010CycleSegment,
  TmwCp010GeneratedQuestion,
  TmwCp010Stage,
} from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp009PipeLabel, cp009Time } from "./localization-cp009-language";
import {
  cp010Arrangement,
  cp010Boundary,
  cp010Context,
  cp010Label,
  cp010Level,
  cp010UniquePipes,
} from "./localization-cp010-language";

function compactPipeTimes(
  pipes: ReturnType<typeof cp010UniquePipes>,
  language: TmwLocalizedLanguage,
): string {
  const facts = pipes.map((pipe) => `${cp009PipeLabel(pipe, language)}—${cp009Time(pipe.soloTime, language)}`).join("; ");
  return language === "hi" ? `अकेले समय: ${facts}।` : `ਇਕੱਲੇ ਸਮੇਂ: ${facts}।`;
}

function stageCapabilities(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return compactPipeTimes(cp010UniquePipes((source.parameters.stages ?? []).map((stage) => stage.pipes)), language);
}

function cycleCapabilities(source: TmwCp010GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return compactPipeTimes(cp010UniquePipes((source.parameters.cycle ?? []).map((segment) => segment.pipes)), language);
}

function compactStages(stages: readonly TmwCp010Stage[], language: TmwLocalizedLanguage): string {
  return stages.map((stage, index) => {
    const duration = stage.duration ? `—${cp009Time(stage.duration, language)}` : "";
    return `${index + 1}) ${cp010Arrangement(stage.pipes, language)}${duration}`;
  }).join("; ");
}

function compactCycle(cycle: readonly TmwCp010CycleSegment[], language: TmwLocalizedLanguage): string {
  return cycle.map((segment, index) => `${index + 1}) ${cp010Arrangement(segment.pipes, language)}—${cp009Time(segment.duration, language)}`).join("; ");
}

function formatPhysical(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export function renderTmwCp010LocalizedStem(
  source: TmwCp010GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const stages = p.stages ?? [];
  const cycle = p.cycle ?? [];
  const { tank } = cp010Context(p, language);
  const initial = cp010Level(p.initialLevel, language);
  const target = cp010Boundary(p, language);

  if (language === "hi") {
    switch (source.solveMode) {
      case "findCompletionAfterDelayedActivation":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "delay"), language)} तक चलता है; फिर ${cp010Arrangement(stages[1].pipes, language)} ${tank} के ${target} होने तक चलता है। शुरू से कितना समय लगेगा?`;
      case "findCompletionAfterDelayedDeactivation":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "delay"), language)} तक चलता है; फिर ${cp010Arrangement(stages[1].pipes, language)} ${tank} के ${target} होने तक चलता है। शुरू से कितना समय लगेगा?`;
      case "findCompletionWithMultipleStaggeredEvents":
        return `${tank} शुरू में खाली है। ${stageCapabilities(source, language)} समय-सारणी: ${compactStages(stages, language)}। अंतिम व्यवस्था पूरी भरने तक चलती है। कुल समय कितना है?`;
      case "findCompletionWithInterruptedFlow":
        return `${tank} शुरू में खाली है। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "first duration"), language)} तक चलता है; फिर ${cp009Time(required(stages[1].duration, "idle duration"), language)} कोई प्रवाह नहीं; उसके बाद ${cp010Arrangement(stages[2].pipes, language)} पूरी भरने तक चलता है। कुल समय कितना है?`;
      case "findCompletionFromPartialLevelAndStages":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "duration"), language)} तक; फिर ${cp010Arrangement(stages[1].pipes, language)} पूरी भरने तक चलता है। कुल समय कितना है?`;
      case "findFinalLevelAfterStagedSchedule":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} समय-सारणी: ${compactStages(stages, language)}। अंत में टंकी का कितना भाग भरा होगा?`;
      case "findCompletionAfterThresholdSwitch":
        return `${tank} शुरू में खाली है। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} स्तर ${cp010Level(required(p.thresholdLevel, "threshold"), language)} तक चलता है; फिर सेंसर ${cp010Arrangement(stages[1].pipes, language)} चालू करता है। पूरी भरने में कुल कितना समय लगेगा?`;
      case "findEventTimeFromKnownCompletion":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} पहले ${cp010Arrangement(stages[0].pipes, language)} चलता है; अज्ञात समय पर व्यवस्था ${cp010Arrangement(stages[1].pipes, language)} हो जाती है। टंकी ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} में भरती है। बदलाव कब हुआ?`;
      case "findRequiredFinalStageRate":
        return `${tank} शुरू में खाली है और ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} में भरनी है। ${compactPipeTimes(cp010UniquePipes([stages[0].pipes]), language)} पहले ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "first duration"), language)} तक चलता है; फिर अज्ञात-दर वाला अंतिम भराव अकेला चलता है। उसकी प्रति घंटा दर क्या होनी चाहिए?`;
      case "findCapacityFromStagedPhysicalFlows":
        return `${tank} शुरू में खाली है। प्रवाह-सारणी: ${required(p.physicalStages, "physical stages").map((stage, index) => `${index + 1}) ${cp010Label(stage.label, language)}—${formatPhysical(stage.netFlowLitresPerHour.numerator / stage.netFlowLitresPerHour.denominator)} लीटर/घंटा, ${cp009Time(stage.duration, language)}`).join("; ")}। अंत में टंकी पूरी भरती है। क्षमता कितनी है?`;
      case "findCompletionWithAlternatingPipes":
        return `${tank} शुरू में खाली है। ${cycleCapabilities(source, language)} दोहराव चक्र: ${compactCycle(cycle, language)}। भाग 1 से शुरू करें। टंकी भरने में कितना समय लगेगा?`;
      case "findCompletionWithPeriodicSchedule":
        return `${tank} शुरू में खाली है। ${cycleCapabilities(source, language)} बिना विराम दोहराव चक्र: ${compactCycle(cycle, language)}। टंकी भरने में कितना समय लगेगा?`;
      case "findAutomaticLevelControlCompletion": {
        const control = required(p.levelControl, "level control");
        const pipes = cp010UniquePipes([control.offPipes, control.onPipes]);
        return `${tank} का नियंत्रक स्तर ${cp010Level(control.lower, language)} और ${cp010Level(control.upper, language)} के बीच रखता है। ${compactPipeTimes(pipes, language)} ऊपरी स्तर से ${cp010Arrangement(control.offPipes, language)} निचले स्तर तक; फिर ${cp010Arrangement(control.onPipes, language)} वापस ऊपरी स्तर तक चलता है। ऊपरी स्तर की अगली ${control.targetUpperHits}वीं प्राप्ति तक कितना समय लगेगा?`;
      }
      case "findCompletionFromArbitraryCyclePhase":
        return `${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} चक्र: ${compactCycle(cycle, language)}। शुरुआत भाग ${(p.startingCycleIndex ?? 0) + 1} से है, फिर सामान्य क्रम चलता है। भरने में कितना समय लगेगा?`;
      case "findFullCycleCountToBoundary":
        return `${tank} शुरू में खाली है। ${cycleCapabilities(source, language)} चक्र: ${compactCycle(cycle, language)}। अंतिम अपूर्ण चक्र से पहले कितने पूरे चक्र समाप्त होंगे?`;
      case "findTerminalActiveSegment":
        return `${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} चक्र: ${compactCycle(cycle, language)}। टंकी पहली बार किस भाग में पूरी भरेगी?`;
      case "findBoundaryEventTimeUnderSchedule":
        return `${tank} शुरू में ${initial} है। ${cycleCapabilities(source, language)} चक्र: ${compactCycle(cycle, language)}। टंकी पहली बार ${target} कब होगी?`;
      case "findScheduleAdjustmentForDeadline":
        return `${tank} शुरू में ${initial} है। ${stageCapabilities(source, language)} बदलाव से पहले ${cp010Arrangement(stages[0].pipes, language)}, बाद में ${cp010Arrangement(stages[1].pipes, language)}। बदलाव मूलतः ${cp009Time(required(p.adjustmentBaseDuration, "baseline"), language)} बाद है। ${cp009Time(required(p.requiredDeadline, "deadline"), language)} की समय-सीमा के लिए इसे कितने घंटे ${p.adjustmentDirection === "EARLIER" ? "पहले" : "बाद"} करना होगा?`;
    }
  }

  switch (source.solveMode) {
    case "findCompletionAfterDelayedActivation":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "delay"), language)} ਲਈ ਚੱਲਦਾ ਹੈ; ਫਿਰ ${cp010Arrangement(stages[1].pipes, language)} ${tank} ਦੇ ${target} ਹੋਣ ਤੱਕ ਚੱਲਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionAfterDelayedDeactivation":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "delay"), language)} ਲਈ ਚੱਲਦਾ ਹੈ; ਫਿਰ ${cp010Arrangement(stages[1].pipes, language)} ${tank} ਦੇ ${target} ਹੋਣ ਤੱਕ ਚੱਲਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionWithMultipleStaggeredEvents":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ਸਮਾਂ-ਸਾਰਣੀ: ${compactStages(stages, language)}। ਅੰਤਿਮ ਵਿਵਸਥਾ ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦੀ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`;
    case "findCompletionWithInterruptedFlow":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "first duration"), language)} ਲਈ ਚੱਲਦਾ ਹੈ; ਫਿਰ ${cp009Time(required(stages[1].duration, "idle duration"), language)} ਕੋਈ ਪ੍ਰਵਾਹ ਨਹੀਂ; ਉਸ ਤੋਂ ਬਾਅਦ ${cp010Arrangement(stages[2].pipes, language)} ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`;
    case "findCompletionFromPartialLevelAndStages":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "duration"), language)} ਲਈ; ਫਿਰ ${cp010Arrangement(stages[1].pipes, language)} ਪੂਰੀ ਭਰਨ ਤੱਕ ਚੱਲਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`;
    case "findFinalLevelAfterStagedSchedule":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਸਮਾਂ-ਸਾਰਣੀ: ${compactStages(stages, language)}। ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਭਰਿਆ ਹੋਵੇਗਾ?`;
    case "findCompletionAfterThresholdSwitch":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${stageCapabilities(source, language)} ${cp010Arrangement(stages[0].pipes, language)} ਪੱਧਰ ${cp010Level(required(p.thresholdLevel, "threshold"), language)} ਤੱਕ ਚੱਲਦਾ ਹੈ; ਫਿਰ ਸੈਂਸਰ ${cp010Arrangement(stages[1].pipes, language)} ਚਾਲੂ ਕਰਦਾ ਹੈ। ਪੂਰੀ ਭਰਨ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findEventTimeFromKnownCompletion":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ਚੱਲਦਾ ਹੈ; ਅਣਜਾਣ ਸਮੇਂ ਉੱਤੇ ਵਿਵਸਥਾ ${cp010Arrangement(stages[1].pipes, language)} ਹੋ ਜਾਂਦੀ ਹੈ। ਟੈਂਕੀ ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} ਵਿੱਚ ਭਰਦੀ ਹੈ। ਬਦਲਾਅ ਕਦੋਂ ਹੋਇਆ?`;
    case "findRequiredFinalStageRate":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ ਅਤੇ ${cp009Time(required(p.knownCompletionTime, "completion time"), language)} ਵਿੱਚ ਭਰਨੀ ਹੈ। ${compactPipeTimes(cp010UniquePipes([stages[0].pipes]), language)} ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)} ${cp009Time(required(stages[0].duration, "first duration"), language)} ਲਈ ਚੱਲਦਾ ਹੈ; ਫਿਰ ਅਣਜਾਣ ਦਰ ਵਾਲਾ ਅੰਤਿਮ ਭਰਾਅ ਇਕੱਲਾ ਚੱਲਦਾ ਹੈ। ਉਸ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਕੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`;
    case "findCapacityFromStagedPhysicalFlows":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ਪ੍ਰਵਾਹ-ਸਾਰਣੀ: ${required(p.physicalStages, "physical stages").map((stage, index) => `${index + 1}) ${cp010Label(stage.label, language)}—${formatPhysical(stage.netFlowLitresPerHour.numerator / stage.netFlowLitresPerHour.denominator)} ਲੀਟਰ/ਘੰਟਾ, ${cp009Time(stage.duration, language)}`).join("; ")}। ਅੰਤ ਵਿੱਚ ਟੈਂਕੀ ਪੂਰੀ ਭਰਦੀ ਹੈ। ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੈ?`;
    case "findCompletionWithAlternatingPipes":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${cycleCapabilities(source, language)} ਦੁਹਰਾਅ ਚੱਕਰ: ${compactCycle(cycle, language)}। ਭਾਗ 1 ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਟੈਂਕੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findCompletionWithPeriodicSchedule":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${cycleCapabilities(source, language)} ਬਿਨਾਂ ਵਿਰਾਮ ਦੁਹਰਾਅ ਚੱਕਰ: ${compactCycle(cycle, language)}। ਟੈਂਕੀ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findAutomaticLevelControlCompletion": {
      const control = required(p.levelControl, "level control");
      const pipes = cp010UniquePipes([control.offPipes, control.onPipes]);
      return `${tank} ਦਾ ਕੰਟਰੋਲਰ ਪੱਧਰ ${cp010Level(control.lower, language)} ਅਤੇ ${cp010Level(control.upper, language)} ਵਿਚਕਾਰ ਰੱਖਦਾ ਹੈ। ${compactPipeTimes(pipes, language)} ਉੱਪਰਲੇ ਪੱਧਰ ਤੋਂ ${cp010Arrangement(control.offPipes, language)} ਹੇਠਲੇ ਪੱਧਰ ਤੱਕ; ਫਿਰ ${cp010Arrangement(control.onPipes, language)} ਵਾਪਸ ਉੱਪਰਲੇ ਪੱਧਰ ਤੱਕ ਚੱਲਦਾ ਹੈ। ਉੱਪਰਲੇ ਪੱਧਰ ਦੀ ਅਗਲੀ ${control.targetUpperHits}ਵੀਂ ਪ੍ਰਾਪਤੀ ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    }
    case "findCompletionFromArbitraryCyclePhase":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਚੱਕਰ: ${compactCycle(cycle, language)}। ਸ਼ੁਰੂਆਤ ਭਾਗ ${(p.startingCycleIndex ?? 0) + 1} ਤੋਂ ਹੈ, ਫਿਰ ਆਮ ਕ੍ਰਮ ਚੱਲਦਾ ਹੈ। ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    case "findFullCycleCountToBoundary":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ਖਾਲੀ ਹੈ। ${cycleCapabilities(source, language)} ਚੱਕਰ: ${compactCycle(cycle, language)}। ਅੰਤਿਮ ਅਧੂਰੇ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਕਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਮੁਕੰਮਲ ਹੋਣਗੇ?`;
    case "findTerminalActiveSegment":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਚੱਕਰ: ${compactCycle(cycle, language)}। ਟੈਂਕੀ ਪਹਿਲੀ ਵਾਰ ਕਿਹੜੇ ਭਾਗ ਵਿੱਚ ਪੂਰੀ ਭਰੇਗੀ?`;
    case "findBoundaryEventTimeUnderSchedule":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${cycleCapabilities(source, language)} ਚੱਕਰ: ${compactCycle(cycle, language)}। ਟੈਂਕੀ ਪਹਿਲੀ ਵਾਰ ${target} ਕਦੋਂ ਹੋਵੇਗੀ?`;
    case "findScheduleAdjustmentForDeadline":
      return `${tank} ਸ਼ੁਰੂ ਵਿੱਚ ${initial} ਹੈ। ${stageCapabilities(source, language)} ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ${cp010Arrangement(stages[0].pipes, language)}, ਬਾਅਦ ਵਿੱਚ ${cp010Arrangement(stages[1].pipes, language)}। ਬਦਲਾਅ ਮੂਲ ਰੂਪ ਵਿੱਚ ${cp009Time(required(p.adjustmentBaseDuration, "baseline"), language)} ਬਾਅਦ ਹੈ। ${cp009Time(required(p.requiredDeadline, "deadline"), language)} ਦੀ ਸਮਾਂ-ਸੀਮਾ ਲਈ ਇਸ ਨੂੰ ਕਿੰਨੇ ਘੰਟੇ ${p.adjustmentDirection === "EARLIER" ? "ਪਹਿਲਾਂ" : "ਬਾਅਦ"} ਕਰਨਾ ਹੋਵੇਗਾ?`;
  }
}
