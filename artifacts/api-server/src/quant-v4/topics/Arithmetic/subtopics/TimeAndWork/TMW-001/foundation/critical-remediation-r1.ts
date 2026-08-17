import { add, formatRational, multiply, rational } from "./rational";
import type { TmwCp005Parameters, TmwCp005RegistryEntry } from "./cp005-types";
import type { TmwCp010Parameters, TmwCp010RegistryEntry } from "./cp010-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp007Copy } from "./localization-cp007-language";
import { cp010Context } from "./localization-cp010-language";
import { cp009Time } from "./localization-cp009-language";

function seedIndex(seed: string, length: number): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % length;
}

/**
 * R1 source remediation for TMW-QL-102.
 * Exact-boundary questions are generated only from states in which one whole
 * unit of work is an integral number of complete two-turn cycles. The solo-time
 * fields printed in the stem and the segment rates consumed by the solver are
 * updated together from this single authority.
 */
export function remediateTmwCp005CriticalParameters(
  entry: TmwCp005RegistryEntry,
  parameters: TmwCp005Parameters,
  seed: string,
): TmwCp005Parameters {
  if (entry.qlId !== "TMW-QL-102") return parameters;
  if (parameters.cycle.length !== 2) throw new Error("TMW-QL-102 requires a two-segment cycle");

  const soloTimes = [
    [12, 6],
    [18, 9],
    [24, 12],
    [30, 15],
  ] as const;
  const [firstSoloTime, secondSoloTime] = soloTimes[seedIndex(seed, soloTimes.length)];
  const timeA = rational(firstSoloTime);
  const timeB = rational(secondSoloTime);
  const cycle = parameters.cycle.map((segment, index) => ({
    ...segment,
    rate: rational(1, index === 0 ? firstSoloTime : secondSoloTime),
  }));
  const cycleWork = cycle.reduce(
    (total, segment) => add(total, multiply(segment.rate, segment.duration)),
    rational(0),
  );
  if (cycleWork.numerator !== 1) throw new Error("TMW-QL-102 remediation must yield reciprocal whole-cycle work");
  const exactCycles = cycleWork.denominator;
  if (!Number.isInteger(exactCycles) || exactCycles <= 0) throw new Error("TMW-QL-102 exact cycle count is invalid");
  if (cycle[0].rate.denominator !== timeA.numerator || cycle[1].rate.denominator !== timeB.numerator) {
    throw new Error("TMW-QL-102 stem solo times and cycle rates diverged");
  }

  return {
    ...parameters,
    timeA,
    timeB,
    cycle,
    targetWork: rational(1),
  };
}

/**
 * R1 source remediation for TMW-QL-187.
 * The controller has two exclusive phases: outlet-only down to the lower mark,
 * then inlet-only back to the upper mark. Keeping the outlet active during the
 * refill phase caused the audited incorrect controller answer.
 */
export function remediateTmwCp010CriticalParameters(
  entry: TmwCp010RegistryEntry,
  parameters: TmwCp010Parameters,
): TmwCp010Parameters {
  if (entry.qlId !== "TMW-QL-187") return parameters;
  if (!parameters.levelControl) throw new Error("TMW-QL-187 requires level-control parameters");
  const inletOnly = parameters.levelControl.onPipes.filter((pipe) => pipe.kind === "INLET");
  if (inletOnly.length !== 1) throw new Error("TMW-QL-187 refill phase must contain exactly one inlet");
  return {
    ...parameters,
    levelControl: {
      ...parameters.levelControl,
      onPipes: inletOnly,
    },
  };
}

function insertBeforeFinalQuestion(stem: string, fact: string): string {
  const questionMark = stem.lastIndexOf("?");
  if (questionMark < 0) return `${stem} ${fact}`.trim();
  const sentenceBreak = Math.max(stem.lastIndexOf("।", questionMark), stem.lastIndexOf(".", questionMark));
  if (sentenceBreak < 0) return `${fact} ${stem}`.trim();
  return `${stem.slice(0, sentenceBreak + 1)} ${fact} ${stem.slice(sentenceBreak + 1).trimStart()}`;
}

function localizedTimeUnit(resourceTimeUnit: string, language: TmwLocalizedLanguage): string {
  const hourly = /hour/i.test(resourceTimeUnit);
  if (language === "hi") return hourly ? "प्रति घंटा" : "प्रतिदिन";
  return hourly ? "ਪ੍ਰਤੀ ਘੰਟਾ" : "ਪ੍ਰਤੀ ਦਿਨ";
}

function ql131Stem(question: any, language: TmwLocalizedLanguage): string {
  const p = question.parameters;
  const categories = p.context.categories;
  const sourceIndex = p.sourceCategoryIndex ?? 0;
  const targetIndex = p.targetCategoryIndex ?? p.replacementCategoryIndex ?? 0;
  const count = formatRational(p.crewA[sourceIndex]);
  const sourceName = cp007Copy(categories[sourceIndex].plural, language);
  const targetName = cp007Copy(categories[targetIndex].plural, language);
  return language === "hi"
    ? `${count} ${sourceName} की कुल क्षमता को केवल ${targetName} से बदलना है। समान कुल क्षमता बनाए रखने के लिए कितने ${targetName} चाहिए?`
    : `${count} ${sourceName} ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਨੂੰ ਸਿਰਫ਼ ${targetName} ਨਾਲ ਬਦਲਣਾ ਹੈ। ਇੱਕੋ ਕੁੱਲ ਸਮਰੱਥਾ ਬਣਾਈ ਰੱਖਣ ਲਈ ਕਿੰਨੇ ${targetName} ਚਾਹੀਦੇ ਹਨ?`;
}

function ql133Fact(question: any, language: TmwLocalizedLanguage): string {
  const p = question.parameters;
  const categories = p.context.categories;
  const first = formatRational(categories[0].efficiency);
  const second = formatRational(categories[1].efficiency);
  const output = cp007Copy(p.context.outputUnit, language);
  const timeUnit = localizedTimeUnit(categories[0].resourceTimeUnit, language);
  return language === "hi"
    ? `पहली और दूसरी श्रेणी की व्यक्तिगत दरें क्रमशः ${first} और ${second} ${output} ${timeUnit} हैं।`
    : `ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${first} ਅਤੇ ${second} ${output} ${timeUnit} ਹੈ।`;
}

function ql138Fact(question: any, language: TmwLocalizedLanguage): string {
  const ratio = question.parameters.context.categories
    .map((category: any) => formatRational(category.efficiency))
    .join(":");
  return language === "hi"
    ? `तीनों श्रेणियों की प्रति-संसाधन दक्षताओं का अनुपात ${ratio} है।`
    : `ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ${ratio} ਹੈ।`;
}

function ql148Fact(language: TmwLocalizedLanguage): string {
  return language === "hi"
    ? "दोनों कर्मचारी प्रतिदिन समान संख्या में घंटे काम करते हैं।"
    : "ਦੋਵੇਂ ਕਰਮਚਾਰੀ ਹਰ ਰੋਜ਼ ਇੱਕੋ ਗਿਣਤੀ ਦੇ ਘੰਟੇ ਕੰਮ ਕਰਦੇ ਹਨ।";
}

function ql183Fact(question: any, language: TmwLocalizedLanguage): string {
  const firstStage = question.parameters.stages?.[0];
  const pipe = firstStage?.pipes?.[0];
  if (!pipe) throw new Error("TMW-QL-183 requires its first-stage inlet");
  const time = cp009Time(pipe.soloTime, language);
  const { tank } = cp010Context(question.parameters, language);
  return language === "hi"
    ? `इनलेट A अकेले ${tank} को ${time} में पूरा भर सकती है।`
    : `ਇਨਲੈਟ A ਇਕੱਲੀ ${tank} ਨੂੰ ${time} ਵਿੱਚ ਪੂਰਾ ਭਰ ਸਕਦੀ ਹੈ।`;
}

function ql187Stem(question: any, language: TmwLocalizedLanguage): string {
  const p = question.parameters;
  const control = p.levelControl;
  if (!control) throw new Error("TMW-QL-187 requires level-control parameters");
  const outlet = control.offPipes.find((pipe: any) => pipe.kind === "OUTLET" || pipe.kind === "LEAK");
  const inlet = control.onPipes.find((pipe: any) => pipe.kind === "INLET");
  if (!outlet || !inlet) throw new Error("TMW-QL-187 requires exclusive outlet and inlet phases");
  const { setting, tank } = cp010Context(p, language);
  const lower = formatRational(control.lower);
  const upper = formatRational(control.upper);
  const outletTime = cp009Time(outlet.soloTime, language);
  const inletTime = cp009Time(inlet.soloTime, language);
  const hit = control.targetUpperHits;
  return language === "hi"
    ? `${setting} में स्वचालित नियंत्रक ${tank} का स्तर ${lower} और ${upper} के बीच रखता है। आउटलेट A अकेले भरी ${tank} को ${outletTime} में खाली कर सकती है और इनलेट B अकेले ${tank} को ${inletTime} में भर सकती है। ऊपरी स्तर से आउटलेट A अकेली चलती है जब तक निचला स्तर न आ जाए; फिर आउटलेट बंद होकर इनलेट B अकेली चलती है जब तक ऊपरी स्तर वापस न आ जाए। ऊपरी स्तर पर अगली ${hit}वीं वापसी तक कितना समय लगेगा?`
    : `${setting} ਵਿੱਚ ਆਟੋਮੈਟਿਕ ਕੰਟਰੋਲਰ ${tank} ਦਾ ਪੱਧਰ ${lower} ਅਤੇ ${upper} ਦੇ ਵਿਚਕਾਰ ਰੱਖਦਾ ਹੈ। ਆਉਟਲੈਟ A ਇਕੱਲੀ ਭਰੀ ${tank} ਨੂੰ ${outletTime} ਵਿੱਚ ਖਾਲੀ ਕਰ ਸਕਦੀ ਹੈ ਅਤੇ ਇਨਲੈਟ B ਇਕੱਲੀ ${tank} ਨੂੰ ${inletTime} ਵਿੱਚ ਭਰ ਸਕਦੀ ਹੈ। ਉੱਪਰਲੇ ਪੱਧਰ ਤੋਂ ਆਉਟਲੈਟ A ਇਕੱਲੀ ਚਲਦੀ ਹੈ ਜਦ ਤੱਕ ਹੇਠਲਾ ਪੱਧਰ ਨਾ ਆ ਜਾਵੇ; ਫਿਰ ਆਉਟਲੈਟ ਬੰਦ ਹੋ ਕੇ ਇਨਲੈਟ B ਇਕੱਲੀ ਚਲਦੀ ਹੈ ਜਦ ਤੱਕ ਉੱਪਰਲਾ ਪੱਧਰ ਮੁੜ ਨਾ ਆ ਜਾਵੇ। ਉੱਪਰਲੇ ਪੱਧਰ ਤੇ ਅਗਲੀ ${hit}ਵੀਂ ਵਾਪਸੀ ਤੱਕ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
}

/** Apply the audited localized blocker fixes after all legacy polish waves. */
export function applyTmw001CriticalLocalizedRemediationR1(
  question: any,
  questionLanguageId: string,
  language: TmwLocalizedLanguage,
): any {
  let stem = question.stem as string;
  switch (questionLanguageId) {
    case "TMW-QL-131":
      stem = ql131Stem(question, language);
      break;
    case "TMW-QL-133":
      stem = insertBeforeFinalQuestion(stem, ql133Fact(question, language));
      break;
    case "TMW-QL-138":
      stem = insertBeforeFinalQuestion(stem, ql138Fact(question, language));
      break;
    case "TMW-QL-148":
      stem = insertBeforeFinalQuestion(stem, ql148Fact(language));
      break;
    case "TMW-QL-183":
      stem = insertBeforeFinalQuestion(stem, ql183Fact(question, language));
      break;
    case "TMW-QL-187":
      stem = ql187Stem(question, language);
      break;
    default:
      return question;
  }
  return {
    ...question,
    stem,
    validation: {
      ...question.validation,
      valid: question.validation?.errors?.length === 0,
    },
  };
}
