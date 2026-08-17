import { required } from "./cp001-helpers";
import { formatRational } from "./rational";
import type { Rational } from "./types";
import type { TmwCp002Parameters, TmwCp002SolveMode } from "./cp002-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import { formatLocalizedTime, localizedPerUnit } from "./localization-glossary";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const jobs: Record<string, { hi: string; pa: string }> = {
  "a data-processing assignment": { hi: "डेटा-प्रसंस्करण का काम", pa: "ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਦਾ ਕੰਮ" },
  "a repair project": { hi: "मरम्मत का काम", pa: "ਮੁਰੰਮਤ ਦਾ ਕੰਮ" },
  "a printing order": { hi: "छपाई का ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a road-maintenance project": { hi: "सड़क रखरखाव का काम", pa: "ਸੜਕ ਸੰਭਾਲ ਦਾ ਕੰਮ" },
  "a document-verification assignment": { hi: "दस्तावेज़ सत्यापन का काम", pa: "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦਾ ਕੰਮ" },
};

const agentNames: Record<string, { hi: string; pa: string; hiPlural: string; paPlural: string }> = {
  operator: { hi: "ऑपरेटर", pa: "ਆਪਰੇਟਰ", hiPlural: "ऑपरेटर", paPlural: "ਆਪਰੇਟਰ" },
  technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ", hiPlural: "तकनीशियन", paPlural: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ", hiPlural: "मशीनें", paPlural: "ਮਸ਼ੀਨਾਂ" },
  crew: { hi: "दल", pa: "ਟੀਮ", hiPlural: "दल", paPlural: "ਟੀਮਾਂ" },
  clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ", hiPlural: "क्लर्क", paPlural: "ਕਲਰਕ" },
};

const outputs: Record<string, { hi: string; pa: string }> = {
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  "metres of road": { hi: "मीटर सड़क", pa: "ਮੀਟਰ ਸੜਕ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
};

function job(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return jobs[p.context.jobPhrase]?.[language] ?? p.context.jobPhrase;
}

function agent(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return agentNames[p.context.agentNoun]?.[language] ?? p.context.agentNoun;
}

function agents(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  const value = agentNames[p.context.agentNoun];
  return value ? (language === "hi" ? value.hiPlural : value.paPlural) : p.context.agentNoun;
}

function output(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return outputs[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function label(p: TmwCp002Parameters, index: number, language: TmwLocalizedLanguage): string {
  return `${agent(p, language)} ${"ABC"[index] ?? index + 1}`;
}

function pairFacts(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  const pair = required(p.pairwiseTimes, "pairwiseTimes");
  const a = label(p, 0, language);
  const b = label(p, 1, language);
  const c = label(p, 2, language);
  const ab = formatLocalizedTime(pair.ab, p.timeUnit, language);
  const bc = formatLocalizedTime(pair.bc, p.timeUnit, language);
  const ca = formatLocalizedTime(pair.ca, p.timeUnit, language);
  return copy(
    language,
    `${a} और ${b} मिलकर ${ab}, ${b} और ${c} मिलकर ${bc}, तथा ${c} और ${a} मिलकर ${ca} में काम पूरा करते हैं`,
    `${a} ਅਤੇ ${b} ਮਿਲ ਕੇ ${ab}, ${b} ਅਤੇ ${c} ਮਿਲ ਕੇ ${bc}, ਅਤੇ ${c} ਅਤੇ ${a} ਮਿਲ ਕੇ ${ca} ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ`,
  );
}

function fractionText(value: Rational, language: TmwLocalizedLanguage): string {
  const number = formatRational(value);
  return copy(language, `काम का ${number} भाग`, `ਕੰਮ ਦਾ ${number} ਹਿੱਸਾ`);
}

function polishedStem(
  question: TmwLocalizedQuestion,
  p: TmwCp002Parameters,
  mode: TmwCp002SolveMode,
  language: TmwLocalizedLanguage,
): string {
  switch (mode) {
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const combined = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      return copy(
        language,
        `${label(p, 0, language)} को अकेले ${job(p, language)} पूरा करने में ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} और ${label(p, 1, language)} को ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} लगते हैं। ${label(p, 2, language)} को साथ लेने पर तीनों यह काम ${combined} में पूरा करते हैं। ${label(p, 2, language)} को अकेले कितना समय लगेगा?`,
        `${label(p, 0, language)} ਨੂੰ ਇਕੱਲੇ ${job(p, language)} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} ਅਤੇ ${label(p, 1, language)} ਨੂੰ ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} ਲੱਗਦੇ ਹਨ। ${label(p, 2, language)} ਨੂੰ ਨਾਲ ਲੈਣ ਉੱਤੇ ਤਿੰਨੇ ਇਹ ਕੰਮ ${combined} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${label(p, 2, language)} ਨੂੰ ਇਕੱਲੇ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    }
    case "findAllTogetherTimeFromPairwiseTimes":
      return copy(language, `${job(p, language)} में ${pairFacts(p, language)}। तीनों मिलकर कितना समय लेंगे?`, `${job(p, language)} ਵਿੱਚ ${pairFacts(p, language)}। ਤਿੰਨੇ ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੇ?`);
    case "findIndividualTimeFromPairwiseTimes": {
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      return copy(language, `${job(p, language)} में ${pairFacts(p, language)}। ${label(p, target, language)} को अकेले कितना समय लगेगा?`, `${job(p, language)} ਵਿੱਚ ${pairFacts(p, language)}। ${label(p, target, language)} ਨੂੰ ਇਕੱਲੇ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    }
    case "findPairTimeFromAllTogetherAndThirdTime": {
      const all = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      const third = formatLocalizedTime(required(p.thirdTime, "thirdTime"), p.timeUnit, language);
      return copy(
        language,
        `${label(p, 0, language)}, ${label(p, 1, language)} और ${label(p, 2, language)} मिलकर यह काम ${all} में पूरा करते हैं। ${label(p, 2, language)} को अकेले ${third} लगते हैं। पहले दो मिलकर कितना समय लेंगे?`,
        `${label(p, 0, language)}, ${label(p, 1, language)} ਅਤੇ ${label(p, 2, language)} ਮਿਲ ਕੇ ਇਹ ਕੰਮ ${all} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${label(p, 2, language)} ਨੂੰ ਇਕੱਲੇ ${third} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੇ ਦੋ ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੇ?`,
      );
    }
    case "findNetTimeWithDestructiveAgent": {
      const destructive = formatLocalizedTime(required(p.destructiveTime, "destructiveTime"), p.timeUnit, language);
      return copy(
        language,
        `${label(p, 0, language)} और ${label(p, 1, language)} अकेले यह काम क्रमशः ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} और ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} में करते हैं। साथ ही एक प्रक्रिया किए हुए काम को दोबारा काम के लिए वापस भेजती रहती है; वह पूरे काम के बराबर काम को ${destructive} में वापस भेज सकती है। दोनों के काम करते रहने पर काम कितने समय में पूरा होगा?`,
        `${label(p, 0, language)} ਅਤੇ ${label(p, 1, language)} ਇਕੱਲੇ ਇਹ ਕੰਮ ਕ੍ਰਮਵਾਰ ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} ਅਤੇ ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} ਵਿੱਚ ਕਰਦੇ ਹਨ। ਨਾਲ ਹੀ ਇੱਕ ਪ੍ਰਕਿਰਿਆ ਹੋਇਆ ਕੰਮ ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਰਹਿੰਦੀ ਹੈ; ਉਹ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ${destructive} ਵਿੱਚ ਵਾਪਸ ਭੇਜ ਸਕਦੀ ਹੈ। ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਦੇ ਰਹਿਣ ਉੱਤੇ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    }
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const net = formatLocalizedTime(required(p.netTime, "netTime"), p.timeUnit, language);
      return copy(
        language,
        `${label(p, 0, language)} और ${label(p, 1, language)} अकेले यह काम क्रमशः ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} और ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} में करते हैं। कुछ किया हुआ काम दोबारा काम के लिए वापस जाता रहता है, फिर भी काम ${net} में पूरा होता है। वापस भेजने वाली प्रक्रिया अकेले पूरे काम के बराबर काम को कितने समय में वापस भेजेगी?`,
        `${label(p, 0, language)} ਅਤੇ ${label(p, 1, language)} ਇਕੱਲੇ ਇਹ ਕੰਮ ਕ੍ਰਮਵਾਰ ${formatLocalizedTime(p.individualTimes[0], p.timeUnit, language)} ਅਤੇ ${formatLocalizedTime(p.individualTimes[1], p.timeUnit, language)} ਵਿੱਚ ਕਰਦੇ ਹਨ। ਕੁਝ ਕੀਤਾ ਹੋਇਆ ਕੰਮ ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਜਾਂਦਾ ਰਹਿੰਦਾ ਹੈ, ਫਿਰ ਵੀ ਕੰਮ ${net} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਵਾਪਸ ਭੇਜੇਗੀ?`,
      );
    }
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const known = formatLocalizedTime(required(p.knownPositiveTimes, "knownPositiveTimes")[0], p.timeUnit, language);
      const destructive = formatLocalizedTime(required(p.destructiveTime, "destructiveTime"), p.timeUnit, language);
      const net = formatLocalizedTime(required(p.netTime, "netTime"), p.timeUnit, language);
      return copy(
        language,
        `${label(p, 1, language)} को अकेले यह काम पूरा करने में ${known} लगते हैं। वापस भेजने वाली प्रक्रिया पूरे काम के बराबर काम को ${destructive} में वापस भेज सकती है। दोनों के काम करने और यह प्रक्रिया जारी रहने पर काम ${net} में पूरा होता है। ${label(p, 0, language)} को अकेले कितना समय लगेगा?`,
        `${label(p, 1, language)} ਨੂੰ ਇਕੱਲੇ ਇਹ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${known} ਲੱਗਦੇ ਹਨ। ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ${destructive} ਵਿੱਚ ਵਾਪਸ ਭੇਜ ਸਕਦੀ ਹੈ। ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਅਤੇ ਇਹ ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ ਕੰਮ ${net} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${label(p, 0, language)} ਨੂੰ ਇਕੱਲੇ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    }
    case "findIdenticalAgentCountFromSingleAndCombinedTime": {
      const single = formatLocalizedTime(p.individualTimes[0], p.timeUnit, language);
      const combined = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      return copy(
        language,
        `यदि एक ${agent(p, language)} अकेले काम करे, तो यह काम ${single} में पूरा होगा। समान क्षमता वाले कई ${agents(p, language)} इसे ${combined} में पूरा करते हैं। उनकी संख्या कितनी है?`,
        `ਜੇ ਇੱਕ ${agent(p, language)} ਇਕੱਲਾ ਕੰਮ ਕਰੇ, ਤਾਂ ਇਹ ਕੰਮ ${single} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ। ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੇ ਕਈ ${agents(p, language)} ਇਸ ਨੂੰ ${combined} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`,
      );
    }
    case "findCombinedTimeFromIdenticalAgentCount": {
      const single = formatLocalizedTime(p.individualTimes[0], p.timeUnit, language);
      const count = required(p.identicalAgentCount, "identicalAgentCount");
      return copy(
        language,
        `यदि एक ${agent(p, language)} अकेले काम करे, तो यह काम ${single} में पूरा होगा। समान क्षमता वाले ${count} ${agents(p, language)} मिलकर कितना समय लेंगे?`,
        `ਜੇ ਇੱਕ ${agent(p, language)} ਇਕੱਲਾ ਕੰਮ ਕਰੇ, ਤਾਂ ਇਹ ਕੰਮ ${single} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ। ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੇ ${count} ${agents(p, language)} ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੇ?`,
      );
    }
    case "findMissingRateFromSignedNetRate": {
      const terms = required(p.signedKnownRates, "signedKnownRates").map((item, index) => copy(
        language,
        item.sign === 1
          ? `इकाई ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} पूरा करती है`
          : `इकाई ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} दोबारा काम के लिए वापस भेजती है`,
        item.sign === 1
          ? `ਇਕਾਈ ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਪੂਰੇ ਕਰਦੀ ਹੈ`
          : `ਇਕਾਈ ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਹੈ`,
      ));
      const conjunction = language === "hi" ? "और" : "ਅਤੇ";
      const net = formatRational(required(p.netRate, "netRate"));
      const role = required(p.missingRateSign, "missingRateSign") === 1
        ? copy(language, "काम पूरा करती है", "ਕੰਮ ਪੂਰਾ ਕਰਦੀ ਹੈ")
        : copy(language, "काम दोबारा करने के लिए वापस भेजती है", "ਕੰਮ ਮੁੜ ਕਰਨ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਹੈ");
      return copy(
        language,
        `${terms.join(` ${conjunction} `)}। एक अतिरिक्त इकाई ${role}। अंतिम शुद्ध दर ${net} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} है। अतिरिक्त इकाई की दर ज्ञात कीजिए।`,
        `${terms.join(` ${conjunction} `)}। ਇੱਕ ਵਾਧੂ ਇਕਾਈ ${role}। ਅੰਤਿਮ ਸ਼ੁੱਧ ਦਰ ${net} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਹੈ। ਵਾਧੂ ਇਕਾਈ ਦੀ ਦਰ ਕੱਢੋ।`,
      );
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const a = required(p.teamATimes, "teamATimes").map((value) => formatLocalizedTime(value, p.timeUnit, language));
      const b = required(p.teamBTimes, "teamBTimes").map((value) => formatLocalizedTime(value, p.timeUnit, language));
      return copy(
        language,
        `टीम A और टीम B को एक जैसा ${job(p, language)} दिया गया है। A1 और A2 अकेले क्रमशः ${a[0]} और ${a[1]} लेते हैं; B1 और B2 अकेले क्रमशः ${b[0]} और ${b[1]} लेते हैं। हर टीम के दोनों सदस्य साथ काम करते हैं। दोनों टीमों के समय में कितना अंतर है?`,
        `ਟੀਮ A ਅਤੇ ਟੀਮ B ਨੂੰ ਇਕੋ ਜਿਹਾ ${job(p, language)} ਦਿੱਤਾ ਗਿਆ ਹੈ। A1 ਅਤੇ A2 ਇਕੱਲੇ ਕ੍ਰਮਵਾਰ ${a[0]} ਅਤੇ ${a[1]} ਲੈਂਦੇ ਹਨ; B1 ਅਤੇ B2 ਇਕੱਲੇ ਕ੍ਰਮਵਾਰ ${b[0]} ਅਤੇ ${b[1]} ਲੈਂਦੇ ਹਨ। ਹਰ ਟੀਮ ਦੇ ਦੋਵੇਂ ਮੈਂਬਰ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਦੋਵੇਂ ਟੀਮਾਂ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`,
      );
    }
    default:
      return question.stem;
  }
}

export function polishTmwCp002LocalizedQuestion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const p = question.parameters as TmwCp002Parameters;
  const mode = question.solveMode as TmwCp002SolveMode;
  let optionAudit = question.optionAudit;
  let options = question.options;
  let answerText = question.solution.answerText;
  let commonTrap = question.explanation.commonTrap;
  let conclusion = question.explanation.conclusion;

  if (question.solution.answerType === "FRACTION") {
    optionAudit = question.optionAudit.map((option) => ({ ...option, text: fractionText(option.value, language) }));
    options = optionAudit.map((option) => option.text);
    answerText = fractionText(question.solution.answer, language);
    const trapIndex = optionAudit.findIndex((option) => option.misconceptionId === commonTrap.misconceptionId);
    commonTrap = { ...commonTrap, optionText: options[trapIndex] ?? options[0] ?? "" };
    conclusion = copy(language, `अतः दिए गए समय में ${answerText} पूरा होगा।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ${answerText} ਪੂਰਾ ਹੋਵੇਗਾ।`);
  }

  let opening = question.explanation.opening;
  let trapExplanation = commonTrap.explanation;
  if (mode === "findCombinedTimeFromIndividualTimes") {
    opening = copy(language, "साथ काम करने पर समय नहीं, काम की दरें जोड़ी जाती हैं; कुल दर का उलटा समूह का समय देता है।", "ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵੇਲੇ ਸਮੇਂ ਨਹੀਂ, ਕੰਮ ਦੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ; ਕੁੱਲ ਦਰ ਦਾ ਉਲਟ ਸਮੂਹ ਦਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ।");
    trapExplanation = trapExplanation.replace("व्युत्क्रम", "उलटा");
  }
  if (["findNetTimeWithDestructiveAgent", "findDestructiveTimeFromPositiveAndNetTimes", "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes"].includes(mode)) {
    opening = copy(language, "काम पूरा करने वाली दरें जुड़ती हैं और दोबारा काम के लिए वापस भेजने वाली दर घटती है।", "ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਾਲੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਦਰ ਘਟਦੀ ਹੈ।");
    trapExplanation = trapExplanation.replaceAll("रिवर्क", "दोबारा काम").replaceAll("ਰੀਵਰਕ", "ਮੁੜ ਕੰਮ");
    conclusion = conclusion.replaceAll("रिवर्क", "दोबारा काम").replaceAll("रीवर्क", "दोबारा काम").replaceAll("ਰੀਵਰਕ", "ਮੁੜ ਕੰਮ");
  }
  if (mode === "findMissingRateFromSignedNetRate") {
    opening = copy(language, "काम जोड़ने वाली दर को + और दोबारा काम के लिए वापस भेजने वाली दर को − मानकर अज्ञात दर अलग करें।", "ਕੰਮ ਜੋੜਨ ਵਾਲੀ ਦਰ ਨੂੰ + ਅਤੇ ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਦਰ ਨੂੰ − ਮੰਨ ਕੇ ਅਣਜਾਣ ਦਰ ਅਲੱਗ ਕਰੋ।");
    conclusion = copy(language, `अतः अज्ञात दर ${answerText} है।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਦਰ ${answerText} ਹੈ।`);
  }
  if (mode === "findCompletionTimeDifferenceBetweenTeams") {
    opening = copy(language, "दोनों टीमों की दर और समय अलग-अलग निकालें, फिर दोनों समयों का अंतर लें।", "ਦੋਵੇਂ ਟੀਮਾਂ ਦੀ ਦਰ ਅਤੇ ਸਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਲਵੋ।");
  }

  return {
    ...question,
    stem: polishedStem(question, p, mode, language),
    solution: { ...question.solution, answerText },
    options,
    optionAudit,
    explanation: {
      ...question.explanation,
      opening,
      commonTrap: { ...commonTrap, explanation: trapExplanation },
      conclusion,
    },
  };
}
