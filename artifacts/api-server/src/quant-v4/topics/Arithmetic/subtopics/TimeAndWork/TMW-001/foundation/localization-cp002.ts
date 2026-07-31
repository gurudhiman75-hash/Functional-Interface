import { required } from "./cp001-helpers";
import { formatRational } from "./rational";
import type { Rational } from "./types";
import type {
  TmwCp002GeneratedQuestion,
  TmwCp002MisconceptionId,
  TmwCp002Parameters,
  TmwCp002SolveMode,
} from "./cp002-types";
import {
  displayLocale,
  type TmwLocalizedLanguage,
  type TmwLocalizedQuestion,
} from "./localization-types";
import {
  formatLocalizedTime,
  localizedOptionLabel,
  localizedPerUnit,
  localizeMathStep,
} from "./localization-glossary";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const jobCopy: Record<string, { hi: string; pa: string }> = {
  "a data-processing assignment": { hi: "डेटा-प्रसंस्करण का काम", pa: "ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਦਾ ਕੰਮ" },
  "a repair project": { hi: "मरम्मत का काम", pa: "ਮੁਰੰਮਤ ਦਾ ਕੰਮ" },
  "a printing order": { hi: "छपाई का ऑर्डर", pa: "ਛਪਾਈ ਦਾ ਆਰਡਰ" },
  "a road-maintenance project": { hi: "सड़क रखरखाव का काम", pa: "ਸੜਕ ਸੰਭਾਲ ਦਾ ਕੰਮ" },
  "a document-verification assignment": { hi: "दस्तावेज़ सत्यापन का काम", pa: "ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਦਾ ਕੰਮ" },
};

const agentCopy: Record<string, { hi: string; pa: string; hiPlural: string; paPlural: string }> = {
  operator: { hi: "ऑपरेटर", pa: "ਆਪਰੇਟਰ", hiPlural: "ऑपरेटर", paPlural: "ਆਪਰੇਟਰ" },
  technician: { hi: "तकनीशियन", pa: "ਟੈਕਨੀਸ਼ੀਅਨ", hiPlural: "तकनीशियन", paPlural: "ਟੈਕਨੀਸ਼ੀਅਨ" },
  machine: { hi: "मशीन", pa: "ਮਸ਼ੀਨ", hiPlural: "मशीनें", paPlural: "ਮਸ਼ੀਨਾਂ" },
  crew: { hi: "दल", pa: "ਟੀਮ", hiPlural: "दल", paPlural: "ਟੀਮਾਂ" },
  clerk: { hi: "क्लर्क", pa: "ਕਲਰਕ", hiPlural: "क्लर्क", paPlural: "ਕਲਰਕ" },
};

const outputCopy: Record<string, { hi: string; pa: string }> = {
  records: { hi: "रिकॉर्ड", pa: "ਰਿਕਾਰਡ" },
  components: { hi: "पुर्ज़े", pa: "ਪੁਰਜ਼ੇ" },
  booklets: { hi: "पुस्तिकाएँ", pa: "ਪੁਸਤਿਕਾਵਾਂ" },
  "metres of road": { hi: "मीटर सड़क", pa: "ਮੀਟਰ ਸੜਕ" },
  applications: { hi: "आवेदन", pa: "ਅਰਜ਼ੀਆਂ" },
};

function job(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return jobCopy[p.context.jobPhrase]?.[language] ?? p.context.jobPhrase;
}

function agent(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return agentCopy[p.context.agentNoun]?.[language] ?? p.context.agentNoun;
}

function agents(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  const value = agentCopy[p.context.agentNoun];
  return value ? (language === "hi" ? value.hiPlural : value.paPlural) : p.context.agentNoun;
}

function output(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  return outputCopy[p.context.outputNoun]?.[language] ?? p.context.outputNoun;
}

function agentLabel(p: TmwCp002Parameters, index: number, language: TmwLocalizedLanguage): string {
  return `${agent(p, language)} ${"ABC"[index] ?? index + 1}`;
}

function joinFacts(values: readonly string[], language: TmwLocalizedLanguage): string {
  if (values.length <= 1) return values[0] ?? "";
  const conjunction = language === "hi" ? "और" : "ਅਤੇ";
  return `${values.slice(0, -1).join("; ")} ${conjunction} ${values[values.length - 1]}`;
}

function timeFact(
  p: TmwCp002Parameters,
  time: Rational,
  index: number,
  language: TmwLocalizedLanguage,
): string {
  const label = agentLabel(p, index, language);
  const value = formatLocalizedTime(time, p.timeUnit, language);
  return copy(
    language,
    `${label} को अकेले ${job(p, language)} पूरा करने में ${value} लगते हैं`,
    `${label} ਨੂੰ ਇਕੱਲੇ ${job(p, language)} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${value} ਲੱਗਦੇ ਹਨ`,
  );
}

function individualFacts(
  p: TmwCp002Parameters,
  language: TmwLocalizedLanguage,
  times: readonly Rational[] = p.individualTimes,
): string {
  return joinFacts(times.map((time, index) => timeFact(p, time, index, language)), language);
}

function pairFacts(p: TmwCp002Parameters, language: TmwLocalizedLanguage): string {
  const pair = required(p.pairwiseTimes, "pairwiseTimes");
  const a = agentLabel(p, 0, language);
  const b = agentLabel(p, 1, language);
  const c = agentLabel(p, 2, language);
  const ab = formatLocalizedTime(pair.ab, p.timeUnit, language);
  const bc = formatLocalizedTime(pair.bc, p.timeUnit, language);
  const ca = formatLocalizedTime(pair.ca, p.timeUnit, language);
  return copy(
    language,
    `${a} और ${b} मिलकर ${ab}, ${b} और ${c} मिलकर ${bc}, तथा ${c} और ${a} मिलकर ${ca} में काम पूरा करते हैं`,
    `${a} ਅਤੇ ${b} ਮਿਲ ਕੇ ${ab}, ${b} ਅਤੇ ${c} ਮਿਲ ਕੇ ${bc}, ਅਤੇ ${c} ਅਤੇ ${a} ਮਿਲ ਕੇ ${ca} ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਦੇ ਹਨ`,
  );
}

function renderStem(source: TmwCp002GeneratedQuestion, language: TmwLocalizedLanguage): string {
  const mode = source.solveMode as TmwCp002SolveMode;
  const p = source.parameters;
  const assignment = job(p, language);

  switch (mode) {
    case "findCombinedTimeFromIndividualTimes":
      return copy(
        language,
        `${individualFacts(p, language)}। यदि सभी शुरू से साथ काम करें, तो ${assignment} कितने समय में पूरा होगा?`,
        `${individualFacts(p, language)}। ਜੇ ਸਾਰੇ ਸ਼ੁਰੂ ਤੋਂ ਇਕੱਠੇ ਕੰਮ ਕਰਨ, ਤਾਂ ${assignment} ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findCombinedWorkInGivenTime": {
      const duration = formatLocalizedTime(required(p.duration, "duration"), p.timeUnit, language);
      return copy(
        language,
        `${individualFacts(p, language)}। सभी ${duration} तक साथ काम करते हैं। काम का कितना भाग पूरा होगा?`,
        `${individualFacts(p, language)}। ਸਾਰੇ ${duration} ਤੱਕ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    }
    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const known = p.individualTimes.slice(0, -1);
      const target = p.individualTimes.length - 1;
      const combined = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      return copy(
        language,
        `${individualFacts(p, language, known)}। ${agentLabel(p, target, language)} को साथ लेने पर तीनों ${assignment} को ${combined} में पूरा करते हैं। ${agentLabel(p, target, language)} अकेले कितना समय लेगा?`,
        `${individualFacts(p, language, known)}। ${agentLabel(p, target, language)} ਨੂੰ ਨਾਲ ਲੈਣ ਉੱਤੇ ਤਿੰਨੇ ${assignment} ਨੂੰ ${combined} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${agentLabel(p, target, language)} ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`,
      );
    }
    case "findAllTogetherTimeFromPairwiseTimes":
      return copy(
        language,
        `${assignment} के लिए ${pairFacts(p, language)}। तीनों मिलकर कितना समय लेंगे?`,
        `${assignment} ਲਈ ${pairFacts(p, language)}। ਤਿੰਨੇ ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੇ?`,
      );
    case "findIndividualTimeFromPairwiseTimes": {
      const target = required(p.targetAgentIndex, "targetAgentIndex");
      return copy(
        language,
        `${assignment} के लिए ${pairFacts(p, language)}। ${agentLabel(p, target, language)} अकेले कितना समय लेगा?`,
        `${assignment} ਲਈ ${pairFacts(p, language)}। ${agentLabel(p, target, language)} ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`,
      );
    }
    case "findPairTimeFromAllTogetherAndThirdTime": {
      const all = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      const third = formatLocalizedTime(required(p.thirdTime, "thirdTime"), p.timeUnit, language);
      return copy(
        language,
        `${agentLabel(p, 0, language)}, ${agentLabel(p, 1, language)} और ${agentLabel(p, 2, language)} मिलकर ${assignment} को ${all} में पूरा करते हैं। ${agentLabel(p, 2, language)} अकेले ${third} लेता है। पहले दो मिलकर कितना समय लेंगे?`,
        `${agentLabel(p, 0, language)}, ${agentLabel(p, 1, language)} ਅਤੇ ${agentLabel(p, 2, language)} ਮਿਲ ਕੇ ${assignment} ਨੂੰ ${all} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ${agentLabel(p, 2, language)} ਇਕੱਲਾ ${third} ਲੈਂਦਾ ਹੈ। ਪਹਿਲੇ ਦੋ ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੇ?`,
      );
    }
    case "findNetTimeWithDestructiveAgent": {
      const destructive = formatLocalizedTime(required(p.destructiveTime, "destructiveTime"), p.timeUnit, language);
      return copy(
        language,
        `${individualFacts(p, language)}। साथ चल रही रिवर्क प्रक्रिया किए गए काम को बिगाड़ती रहती है और पूरे काम को ${destructive} में निष्फल कर सकती है। ${agents(p, language)} के काम करते रहने पर काम कितने समय में पूरा होगा?`,
        `${individualFacts(p, language)}। ਨਾਲ ਚੱਲ ਰਹੀ ਰੀਵਰਕ ਪ੍ਰਕਿਰਿਆ ਹੋਇਆ ਕੰਮ ਖਰਾਬ ਕਰਦੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਪੂਰੇ ਕੰਮ ਨੂੰ ${destructive} ਵਿੱਚ ਬੇਅਸਰ ਕਰ ਸਕਦੀ ਹੈ। ${agents(p, language)} ਦੇ ਕੰਮ ਕਰਦੇ ਰਹਿਣ ਉੱਤੇ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    }
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const net = formatLocalizedTime(required(p.netTime, "netTime"), p.timeUnit, language);
      return copy(
        language,
        `${individualFacts(p, language)}। साथ चल रही रिवर्क प्रक्रिया कुछ किया हुआ काम बिगाड़ती रहती है। दोनों के काम करने पर भी पूरा काम ${net} में होता है। रिवर्क प्रक्रिया अकेले पूरे काम को कितने समय में निष्फल करेगी?`,
        `${individualFacts(p, language)}। ਨਾਲ ਚੱਲ ਰਹੀ ਰੀਵਰਕ ਪ੍ਰਕਿਰਿਆ ਕੁਝ ਕੀਤਾ ਹੋਇਆ ਕੰਮ ਖਰਾਬ ਕਰਦੀ ਰਹਿੰਦੀ ਹੈ। ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਉੱਤੇ ਵੀ ਪੂਰਾ ਕੰਮ ${net} ਵਿੱਚ ਹੁੰਦਾ ਹੈ। ਰੀਵਰਕ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਬੇਅਸਰ ਕਰੇਗੀ?`,
      );
    }
    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const known = formatLocalizedTime(required(p.knownPositiveTimes, "knownPositiveTimes")[0], p.timeUnit, language);
      const destructive = formatLocalizedTime(required(p.destructiveTime, "destructiveTime"), p.timeUnit, language);
      const net = formatLocalizedTime(required(p.netTime, "netTime"), p.timeUnit, language);
      return copy(
        language,
        `${agentLabel(p, 1, language)} अकेले ${assignment} को ${known} में पूरा करता है। रिवर्क प्रक्रिया पूरे काम को ${destructive} में निष्फल कर सकती है। दोनों के काम करने और रिवर्क जारी रहने पर काम ${net} में पूरा होता है। ${agentLabel(p, 0, language)} अकेले कितना समय लेगा?`,
        `${agentLabel(p, 1, language)} ਇਕੱਲਾ ${assignment} ਨੂੰ ${known} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਰੀਵਰਕ ਪ੍ਰਕਿਰਿਆ ਪੂਰੇ ਕੰਮ ਨੂੰ ${destructive} ਵਿੱਚ ਬੇਅਸਰ ਕਰ ਸਕਦੀ ਹੈ। ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਅਤੇ ਰੀਵਰਕ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ ਕੰਮ ${net} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${agentLabel(p, 0, language)} ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`,
      );
    }
    case "findIdenticalAgentCountFromSingleAndCombinedTime": {
      const single = formatLocalizedTime(p.individualTimes[0], p.timeUnit, language);
      const combined = formatLocalizedTime(required(p.combinedTime, "combinedTime"), p.timeUnit, language);
      return copy(
        language,
        `एक ${agent(p, language)} ${assignment} को ${single} में पूरा करता है। समान क्षमता वाली कुछ ${agents(p, language)} मिलकर इसे ${combined} में पूरा करती हैं। समूह में कितनी ${agents(p, language)} हैं?`,
        `ਇੱਕ ${agent(p, language)} ${assignment} ਨੂੰ ${single} ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੀਆਂ ਕੁਝ ${agents(p, language)} ਮਿਲ ਕੇ ਇਸ ਨੂੰ ${combined} ਵਿੱਚ ਪੂਰਾ ਕਰਦੀਆਂ ਹਨ। ਸਮੂਹ ਵਿੱਚ ਕਿੰਨੀਆਂ ${agents(p, language)} ਹਨ?`,
      );
    }
    case "findCombinedTimeFromIdenticalAgentCount": {
      const single = formatLocalizedTime(p.individualTimes[0], p.timeUnit, language);
      const count = required(p.identicalAgentCount, "identicalAgentCount");
      return copy(
        language,
        `एक ${agent(p, language)} ${assignment} को ${single} में पूरा करता है। समान क्षमता वाली ${count} ${agents(p, language)} मिलकर कितना समय लेंगी?`,
        `ਇੱਕ ${agent(p, language)} ${assignment} ਨੂੰ ${single} ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੀਆਂ ${count} ${agents(p, language)} ਮਿਲ ਕੇ ਕਿੰਨਾ ਸਮਾਂ ਲੈਣਗੀਆਂ?`,
      );
    }
    case "findCombinedOutputFromExplicitRates": {
      const rates = required(p.explicitRates, "explicitRates");
      const duration = formatLocalizedTime(required(p.duration, "duration"), p.timeUnit, language);
      const facts = rates.map((rate, index) => copy(
        language,
        `${agentLabel(p, index, language)} की दर ${formatRational(rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} है`,
        `${agentLabel(p, index, language)} ਦੀ ਦਰ ${formatRational(rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਹੈ`,
      ));
      return copy(
        language,
        `${joinFacts(facts, language)}। सभी ${duration} तक साथ काम करें, तो कुल उत्पादन कितना होगा?`,
        `${joinFacts(facts, language)}। ਸਾਰੇ ${duration} ਤੱਕ ਇਕੱਠੇ ਕੰਮ ਕਰਨ, ਤਾਂ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    }
    case "findMissingRateFromSignedNetRate": {
      const terms = required(p.signedKnownRates, "signedKnownRates").map((item, index) => copy(
        language,
        item.sign === 1
          ? `इकाई ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} जोड़ती है`
          : `इकाई ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} रिवर्क में वापस भेजती है`,
        item.sign === 1
          ? `ਇਕਾਈ ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਜੋੜਦੀ ਹੈ`
          : `ਇਕਾਈ ${"AB"[index]} ${formatRational(item.rate)} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਰੀਵਰਕ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਹੈ`,
      ));
      const net = formatRational(required(p.netRate, "netRate"));
      const role = required(p.missingRateSign, "missingRateSign") === 1
        ? copy(language, "उत्पादन जोड़ती है", "ਉਤਪਾਦਨ ਜੋੜਦੀ ਹੈ")
        : copy(language, "उत्पादन रिवर्क में वापस भेजती है", "ਉਤਪਾਦਨ ਰੀਵਰਕ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਹੈ");
      return copy(
        language,
        `${joinFacts(terms, language)}। एक अतिरिक्त इकाई ${role}। अंतिम शुद्ध दर ${net} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} है। अतिरिक्त इकाई की दर का परिमाण ज्ञात कीजिए।`,
        `${joinFacts(terms, language)}। ਇੱਕ ਵਾਧੂ ਇਕਾਈ ${role}। ਅੰਤਿਮ ਸ਼ੁੱਧ ਦਰ ${net} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)} ਹੈ। ਵਾਧੂ ਇਕਾਈ ਦੀ ਦਰ ਦਾ ਪਰਿਮਾਣ ਕੱਢੋ।`,
      );
    }
    case "findCompletionTimeDifferenceBetweenTeams": {
      const a = required(p.teamATimes, "teamATimes").map((value) => formatLocalizedTime(value, p.timeUnit, language));
      const b = required(p.teamBTimes, "teamBTimes").map((value) => formatLocalizedTime(value, p.timeUnit, language));
      return copy(
        language,
        `टीम A और टीम B को ${assignment} की एक-एक समान प्रति दी गई है। A1 और A2 अकेले क्रमशः ${a[0]} और ${a[1]} लेते हैं; B1 और B2 अकेले क्रमशः ${b[0]} और ${b[1]} लेते हैं। प्रत्येक टीम के दोनों सदस्य साथ काम करते हैं। दोनों टीमों के पूरा करने के समय में कितना अंतर है?`,
        `ਟੀਮ A ਅਤੇ ਟੀਮ B ਨੂੰ ${assignment} ਦੀ ਇੱਕ-ਇੱਕ ਇਕੋ ਜਿਹੀ ਪ੍ਰਤੀ ਦਿੱਤੀ ਗਈ ਹੈ। A1 ਅਤੇ A2 ਇਕੱਲੇ ਕ੍ਰਮਵਾਰ ${a[0]} ਅਤੇ ${a[1]} ਲੈਂਦੇ ਹਨ; B1 ਅਤੇ B2 ਇਕੱਲੇ ਕ੍ਰਮਵਾਰ ${b[0]} ਅਤੇ ${b[1]} ਲੈਂਦੇ ਹਨ। ਹਰ ਟੀਮ ਦੇ ਦੋਵੇਂ ਮੈਂਬਰ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਦੋਵੇਂ ਟੀਮਾਂ ਦੇ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`,
      );
    }
  }
}

function localizedAnswerText(
  source: TmwCp002GeneratedQuestion,
  value: Rational,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const number = formatRational(value);
  switch (source.solution.answerType) {
    case "TIME":
      return formatLocalizedTime(value, p.timeUnit, language);
    case "FRACTION":
      return copy(language, `${number} काम`, `ਕੰਮ ਦਾ ${number} ਹਿੱਸਾ`);
    case "COUNT":
      return `${number} ${agents(p, language)}`;
    case "OUTPUT":
      return `${number} ${output(p, language)}`;
    case "RATE":
      return `${number} ${output(p, language)} ${localizedPerUnit(p.timeUnit, language)}`;
  }
}

function localizeCp002Math(value: string, language: TmwLocalizedLanguage): string {
  const pairs: Array<[string, string, string]> = [
    ["Individual times", "अलग-अलग समय", "ਵੱਖ-ਵੱਖ ਸਮੇਂ"],
    ["known times", "ज्ञात समय", "ਪਤਾ ਸਮੇਂ"],
    ["Positive times", "सकारात्मक काम के समय", "ਸਕਾਰਾਤਮਕ ਕੰਮ ਦੇ ਸਮੇਂ"],
    ["Known positive times", "ज्ञात सकारात्मक समय", "ਪਤਾ ਸਕਾਰਾਤਮਕ ਸਮੇਂ"],
    ["Rates", "दरें", "ਦਰਾਂ"],
    ["Team A times", "टीम A के समय", "ਟੀਮ A ਦੇ ਸਮੇਂ"],
    ["Team B times", "टीम B के समय", "ਟੀਮ B ਦੇ ਸਮੇਂ"],
    ["target agent", "लक्षित सदस्य", "ਟੀਚੇ ਵਾਲਾ ਮੈਂਬਰ"],
    ["missing sign", "अज्ञात पद का चिह्न", "ਅਣਜਾਣ ਪਦ ਦਾ ਚਿੰਨ੍ਹ"],
    ["Check", "जाँच", "ਜਾਂਚ"],
  ];
  let result = localizeMathStep(value, language);
  for (const [english, hi, pa] of pairs) result = result.replaceAll(english, language === "hi" ? hi : pa);
  return result;
}

function opening(mode: TmwCp002SolveMode, language: TmwLocalizedLanguage): string {
  const values: Record<TmwCp002SolveMode, [string, string]> = {
    findCombinedTimeFromIndividualTimes: ["साथ काम करने पर समय नहीं, काम की दरें जोड़ी जाती हैं; कुल दर का व्युत्क्रम समूह का समय देता है।", "ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵੇਲੇ ਸਮੇਂ ਨਹੀਂ, ਕੰਮ ਦੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ; ਕੁੱਲ ਦਰ ਦਾ ਉਲਟ ਸਮੂਹ ਦਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ।"],
    findCombinedWorkInGivenTime: ["पहले सभी दरें जोड़ें और फिर साझा समय से गुणा करके पूरा हुआ भाग निकालें।", "ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਫਿਰ ਸਾਂਝੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਕੱਢੋ।"],
    findMissingIndividualTimeFromCombinedAndKnownTimes: ["सभी की कुल दर में से ज्ञात सदस्यों की दरें घटाने पर अज्ञात सदस्य की दर मिलती है।", "ਸਭ ਦੀ ਕੁੱਲ ਦਰ ਵਿੱਚੋਂ ਪਤਾ ਮੈਂਬਰਾਂ ਦੀਆਂ ਦਰਾਂ ਘਟਾਉਣ ਉੱਤੇ ਅਣਜਾਣ ਮੈਂਬਰ ਦੀ ਦਰ ਮਿਲਦੀ ਹੈ।"],
    findAllTogetherTimeFromPairwiseTimes: ["तीनों जोड़ी-दरों के योग में हर सदस्य की दर दो बार आती है, इसलिए योग को दो से भाग दें।", "ਤਿੰਨਾਂ ਜੋੜੀ-ਦਰਾਂ ਦੇ ਜੋੜ ਵਿੱਚ ਹਰ ਮੈਂਬਰ ਦੀ ਦਰ ਦੋ ਵਾਰ ਆਉਂਦੀ ਹੈ, ਇਸ ਲਈ ਜੋੜ ਨੂੰ ਦੋ ਨਾਲ ਭਾਗ ਦਿਓ।"],
    findIndividualTimeFromPairwiseTimes: ["लक्षित सदस्य वाली दोनों जोड़ी-दरें जोड़ें, विपरीत जोड़ी-दर घटाएँ और फिर आधा करें।", "ਟੀਚੇ ਵਾਲੇ ਮੈਂਬਰ ਦੀਆਂ ਦੋਵੇਂ ਜੋੜੀ-ਦਰਾਂ ਜੋੜੋ, ਸਾਹਮਣੀ ਜੋੜੀ-ਦਰ ਘਟਾਓ ਅਤੇ ਫਿਰ ਅੱਧਾ ਕਰੋ।"],
    findPairTimeFromAllTogetherAndThirdTime: ["तीनों की कुल दर में से तीसरे सदस्य की दर घटाने पर आवश्यक जोड़ी की दर मिलती है।", "ਤਿੰਨਾਂ ਦੀ ਕੁੱਲ ਦਰ ਵਿੱਚੋਂ ਤੀਜੇ ਮੈਂਬਰ ਦੀ ਦਰ ਘਟਾਉਣ ਉੱਤੇ ਲੋੜੀਂਦੀ ਜੋੜੀ ਦੀ ਦਰ ਮਿਲਦੀ ਹੈ।"],
    findNetTimeWithDestructiveAgent: ["उत्पादक दरें जुड़ती हैं, जबकि काम बिगाड़ने वाली रिवर्क दर घटती है।", "ਉਤਪਾਦਕ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਜਦਕਿ ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਰੀਵਰਕ ਦਰ ਘਟਦੀ ਹੈ।"],
    findDestructiveTimeFromPositiveAndNetTimes: ["कुल उत्पादक दर और देखी गई शुद्ध दर का अंतर रिवर्क की दर है।", "ਕੁੱਲ ਉਤਪਾਦਕ ਦਰ ਅਤੇ ਮਿਲੀ ਸ਼ੁੱਧ ਦਰ ਦਾ ਅੰਤਰ ਰੀਵਰਕ ਦੀ ਦਰ ਹੈ।"],
    findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes: ["शुद्ध दर में रिवर्क दर वापस जोड़कर और ज्ञात उत्पादक दर घटाकर अज्ञात दर अलग करें।", "ਸ਼ੁੱਧ ਦਰ ਵਿੱਚ ਰੀਵਰਕ ਦਰ ਵਾਪਸ ਜੋੜ ਕੇ ਅਤੇ ਪਤਾ ਉਤਪਾਦਕ ਦਰ ਘਟਾ ਕੇ ਅਣਜਾਣ ਦਰ ਅਲੱਗ ਕਰੋ।"],
    findIdenticalAgentCountFromSingleAndCombinedTime: ["समान क्षमता वाले सदस्यों की संख्या अकेले के समय को समूह के समय से भाग देकर मिलती है।", "ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਇਕੱਲੇ ਦੇ ਸਮੇਂ ਨੂੰ ਸਮੂਹ ਦੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲਦੀ ਹੈ।"],
    findCombinedTimeFromIdenticalAgentCount: ["समान क्षमता वाले सदस्यों के लिए समूह का समय अकेले के समय को उनकी संख्या से भाग देने पर मिलता है।", "ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੇ ਮੈਂਬਰਾਂ ਲਈ ਸਮੂਹ ਦਾ ਸਮਾਂ ਇਕੱਲੇ ਦੇ ਸਮੇਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।"],
    findCombinedOutputFromExplicitRates: ["सभी स्पष्ट उत्पादन दरें जोड़ें और साझा समय से गुणा करें।", "ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਉਤਪਾਦਨ ਦਰਾਂ ਜੋੜੋ ਅਤੇ ਸਾਂਝੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
    findMissingRateFromSignedNetRate: ["उत्पादन जोड़ने वाली दरें धनात्मक और रिवर्क वाली दरें ऋणात्मक लेकर अज्ञात पद अलग करें।", "ਉਤਪਾਦਨ ਜੋੜਨ ਵਾਲੀਆਂ ਦਰਾਂ ਧਨਾਤਮਕ ਅਤੇ ਰੀਵਰਕ ਵਾਲੀਆਂ ਦਰਾਂ ਰਿਣਾਤਮਕ ਲੈ ਕੇ ਅਣਜਾਣ ਪਦ ਅਲੱਗ ਕਰੋ।"],
    findCompletionTimeDifferenceBetweenTeams: ["दोनों टीमों की दर और समय अलग-अलग निकालें, फिर समयों का परिमाण-अंतर लें।", "ਦੋਵੇਂ ਟੀਮਾਂ ਦੀ ਦਰ ਅਤੇ ਸਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਸਮਿਆਂ ਦਾ ਪਰਿਮਾਣ-ਅੰਤਰ ਲਵੋ।"],
  };
  return values[mode][language === "hi" ? 0 : 1];
}

function shortcut(mode: TmwCp002SolveMode, answer: string, language: TmwLocalizedLanguage): { title: string; steps: string[] } {
  const titles: Record<TmwCp002SolveMode, [string, string]> = {
    findCombinedTimeFromIndividualTimes: ["10-सेकंड दर जोड़", "10-ਸਕਿੰਟ ਦਰ ਜੋੜ"],
    findCombinedWorkInGivenTime: ["10-सेकंड दर × समय", "10-ਸਕਿੰਟ ਦਰ × ਸਮਾਂ"],
    findMissingIndividualTimeFromCombinedAndKnownTimes: ["10-सेकंड अज्ञात दर", "10-ਸਕਿੰਟ ਅਣਜਾਣ ਦਰ"],
    findAllTogetherTimeFromPairwiseTimes: ["10-सेकंड जोड़ी आधा-योग", "10-ਸਕਿੰਟ ਜੋੜੀ ਅੱਧਾ-ਜੋੜ"],
    findIndividualTimeFromPairwiseTimes: ["10-सेकंड दो जोड़, एक घटा", "10-ਸਕਿੰਟ ਦੋ ਜੋੜ, ਇੱਕ ਘਟਾ"],
    findPairTimeFromAllTogetherAndThirdTime: ["10-सेकंड तीसरी दर हटाएँ", "10-ਸਕਿੰਟ ਤੀਜੀ ਦਰ ਹਟਾਓ"],
    findNetTimeWithDestructiveAgent: ["10-सेकंड शुद्ध दर", "10-ਸਕਿੰਟ ਸ਼ੁੱਧ ਦਰ"],
    findDestructiveTimeFromPositiveAndNetTimes: ["10-सेकंड रिवर्क दर", "10-ਸਕਿੰਟ ਰੀਵਰਕ ਦਰ"],
    findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes: ["10-सेकंड उत्पादक दर", "10-ਸਕਿੰਟ ਉਤਪਾਦਕ ਦਰ"],
    findIdenticalAgentCountFromSingleAndCombinedTime: ["10-सेकंड समान संख्या", "10-ਸਕਿੰਟ ਇਕੋ ਗਿਣਤੀ"],
    findCombinedTimeFromIdenticalAgentCount: ["10-सेकंड समान समूह", "10-ਸਕਿੰਟ ਇਕੋ ਸਮੂਹ"],
    findCombinedOutputFromExplicitRates: ["10-सेकंड कुल उत्पादन", "10-ਸਕਿੰਟ ਕੁੱਲ ਉਤਪਾਦਨ"],
    findMissingRateFromSignedNetRate: ["10-सेकंड चिह्नित दर", "10-ਸਕਿੰਟ ਚਿੰਨ੍ਹ ਵਾਲੀ ਦਰ"],
    findCompletionTimeDifferenceBetweenTeams: ["10-सेकंड टीम तुलना", "10-ਸਕਿੰਟ ਟੀਮ ਤੁਲਨਾ"],
  };
  return {
    title: titles[mode][language === "hi" ? 0 : 1],
    steps: [copy(language, `दर संबंध सीधे लगाने पर उत्तर ${answer} है।`, `ਦਰ ਦਾ ਸੰਬੰਧ ਸਿੱਧਾ ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answer} ਹੈ।`)],
  };
}

function trapReason(id: Exclude<TmwCp002MisconceptionId, "CORRECT">, language: TmwLocalizedLanguage): string {
  const values: Record<Exclude<TmwCp002MisconceptionId, "CORRECT">, [string, string]> = {
    ADD_TIMES_INSTEAD_OF_RATES: ["इस विकल्प में साथ काम करने वालों के समय जोड़ दिए गए हैं, जबकि उनकी दरें जुड़नी चाहिए।", "ਇਸ ਚੋਣ ਵਿੱਚ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵਾਲਿਆਂ ਦੇ ਸਮੇਂ ਜੋੜੇ ਗਏ ਹਨ, ਜਦਕਿ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।"],
    AVERAGE_TIMES: ["यह विकल्प समयों का साधारण औसत लेता है, जो अलग-अलग दरों वाले सदस्यों पर लागू नहीं होता।", "ਇਹ ਚੋਣ ਸਮਿਆਂ ਦਾ ਸਧਾਰਨ ਔਸਤ ਲੈਂਦੀ ਹੈ, ਜੋ ਵੱਖ-ਵੱਖ ਦਰਾਂ ਵਾਲੇ ਮੈਂਬਰਾਂ ਉੱਤੇ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦਾ।"],
    OMIT_ONE_AGENT: ["इस विकल्प में एक सदस्य की दर छूट गई है, इसलिए कुल दर कम हो गई।", "ਇਸ ਚੋਣ ਵਿੱਚ ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ ਰਹਿ ਗਈ ਹੈ, ਇਸ ਲਈ ਕੁੱਲ ਦਰ ਘੱਟ ਹੋ ਗਈ।"],
    RECIPROCAL_NOT_TAKEN: ["यह विकल्प मिली दर को ही समय मान लेता है; समय के लिए उसका व्युत्क्रम चाहिए।", "ਇਹ ਚੋਣ ਮਿਲੀ ਦਰ ਨੂੰ ਹੀ ਸਮਾਂ ਮੰਨ ਲੈਂਦੀ ਹੈ; ਸਮੇਂ ਲਈ ਉਸ ਦਾ ਉਲਟ ਚਾਹੀਦਾ ਹੈ।"],
    PAIRWISE_FACTOR_TWO_MISSED: ["जोड़ी-दरों के योग में हर सदस्य दो बार गिना जाता है; दो से भाग न देने से यह विकल्प बनता है।", "ਜੋੜੀ-ਦਰਾਂ ਦੇ ਜੋੜ ਵਿੱਚ ਹਰ ਮੈਂਬਰ ਦੋ ਵਾਰ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ; ਦੋ ਨਾਲ ਭਾਗ ਨਾ ਦੇਣ ਕਰਕੇ ਇਹ ਚੋਣ ਬਣਦੀ ਹੈ।"],
    PAIRWISE_WRONG_SIGN: ["लक्षित सदस्य निकालते समय विपरीत जोड़ी-दर घटनी चाहिए; गलत चिह्न से यह विकल्प मिलता है।", "ਟੀਚੇ ਵਾਲਾ ਮੈਂਬਰ ਕੱਢਦੇ ਸਮੇਂ ਸਾਹਮਣੀ ਜੋੜੀ-ਦਰ ਘਟਣੀ ਚਾਹੀਦੀ ਹੈ; ਗਲਤ ਚਿੰਨ੍ਹ ਨਾਲ ਇਹ ਚੋਣ ਮਿਲਦੀ ਹੈ।"],
    DESTRUCTIVE_RATE_ADDED: ["रिवर्क काम घटाता है, इसलिए उसकी दर जोड़ने के बजाय घटानी होती है।", "ਰੀਵਰਕ ਕੰਮ ਘਟਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਉਸ ਦੀ ਦਰ ਜੋੜਨ ਦੀ ਥਾਂ ਘਟਾਉਣੀ ਹੁੰਦੀ ਹੈ।"],
    DESTRUCTIVE_RATE_OMITTED: ["इस विकल्प में रिवर्क दर को पूरी तरह छोड़ दिया गया है, इसलिए शुद्ध दर गलत है।", "ਇਸ ਚੋਣ ਵਿੱਚ ਰੀਵਰਕ ਦਰ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਸ਼ੁੱਧ ਦਰ ਗਲਤ ਹੈ।"],
    KNOWN_RATE_WRONG_SIGN: ["ज्ञात दर को गलत चिह्न से लेने पर अज्ञात दर की दिशा बदल जाती है।", "ਪਤਾ ਦਰ ਨੂੰ ਗਲਤ ਚਿੰਨ੍ਹ ਨਾਲ ਲੈਣ ਉੱਤੇ ਅਣਜਾਣ ਦਰ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਜਾਂਦੀ ਹੈ।"],
    INVERT_BEFORE_ISOLATING: ["अज्ञात दर अलग करने से पहले व्युत्क्रम लेने पर यह गलत मान बनता है।", "ਅਣਜਾਣ ਦਰ ਅਲੱਗ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉਲਟ ਲੈਣ ਉੱਤੇ ਇਹ ਗਲਤ ਮਾਨ ਬਣਦਾ ਹੈ।"],
    IDENTICAL_COUNT_MULTIPLIED: ["समान सदस्यों के साथ समय संख्या से भाग होता है; गुणा करने पर यह विकल्प मिलता है।", "ਇਕੋ ਜਿਹੇ ਮੈਂਬਰਾਂ ਨਾਲ ਸਮਾਂ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਹੁੰਦਾ ਹੈ; ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਇਹ ਚੋਣ ਮਿਲਦੀ ਹੈ।"],
    IDENTICAL_COUNT_IGNORED: ["इस विकल्प में समान सदस्यों की संख्या का प्रभाव ही नहीं लिया गया।", "ਇਸ ਚੋਣ ਵਿੱਚ ਇਕੋ ਜਿਹੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਸਰ ਹੀ ਨਹੀਂ ਲਿਆ ਗਿਆ।"],
    DURATION_OMITTED: ["कुल दर को दिए गए समय से गुणा किए बिना छोड़ने पर यह विकल्प मिलता है।", "ਕੁੱਲ ਦਰ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਛੱਡਣ ਉੱਤੇ ਇਹ ਚੋਣ ਮਿਲਦੀ ਹੈ।"],
    ONE_RATE_OMITTED: ["कुल उत्पादन निकालते समय एक स्पष्ट दर छूट गई है।", "ਕੁੱਲ ਉਤਪਾਦਨ ਕੱਢਦੇ ਸਮੇਂ ਇੱਕ ਦਿੱਤੀ ਦਰ ਰਹਿ ਗਈ ਹੈ।"],
    TEAM_TIMES_ADDED: ["टीम के सदस्य साथ काम करते हैं, इसलिए उनके समय नहीं बल्कि दरें जुड़ती हैं।", "ਟੀਮ ਦੇ ਮੈਂਬਰ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਨਹੀਂ ਸਗੋਂ ਦਰਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।"],
    FASTER_TEAM_TIME_REPORTED: ["यह विकल्प दोनों टीमों के समय का अंतर लेने के बजाय तेज टीम का समय ही बताता है।", "ਇਹ ਚੋਣ ਦੋਵੇਂ ਟੀਮਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ਲੈਣ ਦੀ ਥਾਂ ਤੇਜ਼ ਟੀਮ ਦਾ ਸਮਾਂ ਹੀ ਦੱਸਦੀ ਹੈ।"],
    SLOWER_TEAM_TIME_REPORTED: ["यह विकल्प दोनों टीमों के समय का अंतर लेने के बजाय धीमी टीम का समय ही बताता है।", "ਇਹ ਚੋਣ ਦੋਵੇਂ ਟੀਮਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ਲੈਣ ਦੀ ਥਾਂ ਹੌਲੀ ਟੀਮ ਦਾ ਸਮਾਂ ਹੀ ਦੱਸਦੀ ਹੈ।"],
  };
  return values[id][language === "hi" ? 0 : 1];
}

function conclusion(source: TmwCp002GeneratedQuestion, answer: string, language: TmwLocalizedLanguage): string {
  const mode = source.solveMode as TmwCp002SolveMode;
  const values: Record<TmwCp002SolveMode, [string, string]> = {
    findCombinedTimeFromIndividualTimes: [`अतः पूरा समूह काम को ${answer} में पूरा करेगा।`, `ਇਸ ਲਈ ਪੂਰਾ ਸਮੂਹ ਕੰਮ ਨੂੰ ${answer} ਵਿੱਚ ਪੂਰਾ ਕਰੇਗਾ।`],
    findCombinedWorkInGivenTime: [`अतः दिए गए समय में ${answer} पूरा होगा।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ${answer} ਪੂਰਾ ਹੋਵੇਗਾ।`],
    findMissingIndividualTimeFromCombinedAndKnownTimes: [`अतः अज्ञात सदस्य अकेले ${answer} लेगा।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਮੈਂਬਰ ਇਕੱਲਾ ${answer} ਲਵੇਗਾ।`],
    findAllTogetherTimeFromPairwiseTimes: [`अतः तीनों मिलकर ${answer} लेंगे।`, `ਇਸ ਲਈ ਤਿੰਨੇ ਮਿਲ ਕੇ ${answer} ਲੈਣਗੇ।`],
    findIndividualTimeFromPairwiseTimes: [`अतः पूछा गया सदस्य अकेले ${answer} लेगा।`, `ਇਸ ਲਈ ਪੁੱਛਿਆ ਗਿਆ ਮੈਂਬਰ ਇਕੱਲਾ ${answer} ਲਵੇਗਾ।`],
    findPairTimeFromAllTogetherAndThirdTime: [`अतः आवश्यक जोड़ी ${answer} लेगी।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਜੋੜੀ ${answer} ਲਵੇਗੀ।`],
    findNetTimeWithDestructiveAgent: [`अतः रिवर्क जारी रहने पर काम ${answer} में पूरा होगा।`, `ਇਸ ਲਈ ਰੀਵਰਕ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ ਕੰਮ ${answer} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ।`],
    findDestructiveTimeFromPositiveAndNetTimes: [`अतः रिवर्क प्रक्रिया अकेले पूरे काम को ${answer} में निष्फल करेगी।`, `ਇਸ ਲਈ ਰੀਵਰਕ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਨੂੰ ${answer} ਵਿੱਚ ਬੇਅਸਰ ਕਰੇਗੀ।`],
    findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes: [`अतः अज्ञात उत्पादक सदस्य अकेले ${answer} लेगा।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਉਤਪਾਦਕ ਮੈਂਬਰ ਇਕੱਲਾ ${answer} ਲਵੇਗਾ।`],
    findIdenticalAgentCountFromSingleAndCombinedTime: [`अतः समूह में ${answer} हैं।`, `ਇਸ ਲਈ ਸਮੂਹ ਵਿੱਚ ${answer} ਹਨ।`],
    findCombinedTimeFromIdenticalAgentCount: [`अतः समान क्षमता वाला समूह ${answer} लेगा।`, `ਇਸ ਲਈ ਇਕੋ ਸਮਰੱਥਾ ਵਾਲਾ ਸਮੂਹ ${answer} ਲਵੇਗਾ।`],
    findCombinedOutputFromExplicitRates: [`अतः कुल उत्पादन ${answer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ${answer} ਹੈ।`],
    findMissingRateFromSignedNetRate: [`अतः अज्ञात दर का परिमाण ${answer} है।`, `ਇਸ ਲਈ ਅਣਜਾਣ ਦਰ ਦਾ ਪਰਿਮਾਣ ${answer} ਹੈ।`],
    findCompletionTimeDifferenceBetweenTeams: [`अतः दोनों टीमों के समय का अंतर ${answer} है।`, `ਇਸ ਲਈ ਦੋਵੇਂ ਟੀਮਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ${answer} ਹੈ।`],
  };
  return values[mode][language === "hi" ? 0 : 1];
}

export function localizeTmwCp002Question(
  source: TmwCp002GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: localizedAnswerText(source, option.value, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const trapId = source.explanation.commonTrap.misconceptionId;
  let trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId && option.text === source.explanation.commonTrap.optionText);
  if (trapIndex < 0) trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === trapId);
  const localizedAnswer = localizedAnswerText(source, source.solution.answer, language);
  const localizedTrapOption = options[trapIndex] ?? options[0] ?? "";
  const errors = [...source.validation.errors];
  if (trapIndex < 0) errors.push("Localized common trap is not linked to an option");
  if (new Set(options).size !== 4) errors.push("Localized options are not unique");
  const scriptText = [renderStem(source, language), opening(source.solveMode, language), trapReason(trapId, language), conclusion(source, localizedAnswer, language)].join(" ");
  if (language === "hi" && !/[\u0900-\u097F]/.test(scriptText)) errors.push("Hindi delivery has no Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(scriptText)) errors.push("Punjabi delivery has no Gurmukhi text");

  return {
    archetypeId: source.archetypeId,
    canonicalProblemId: source.canonicalProblemId,
    questionLanguageId: source.questionLanguageId,
    solveMode: source.solveMode,
    language,
    locale: displayLocale(language),
    sourceLanguage: "en",
    seed: source.seed,
    stem: renderStem(source, language),
    parameters: source.parameters,
    solution: {
      ...source.solution,
      answerText: localizedAnswer,
    },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening: opening(source.solveMode, language),
      formula: source.explanation.formula,
      steps: source.explanation.steps.map((step) => localizeCp002Math(step, language)),
      shortcut: shortcut(source.solveMode, localizedAnswer, language),
      commonTrap: {
        optionLabel: localizedOptionLabel(trapIndex, language),
        optionText: localizedTrapOption,
        misconceptionId: trapId,
        explanation: trapReason(trapId, language),
      },
      conclusion: conclusion(source, localizedAnswer, language),
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
