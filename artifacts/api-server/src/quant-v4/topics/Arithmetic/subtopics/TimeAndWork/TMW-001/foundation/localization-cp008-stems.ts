import { required } from "./cp001-helpers";
import { subtract } from "./rational";
import { tmwCp008ContributionVector } from "./cp008-engine";
import type { TmwCp008GeneratedQuestion } from "./cp008-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp008Copy,
  cp008Money,
  cp008Name,
  cp008Number,
  cp008Output,
  cp008Role,
} from "./localization-cp008-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function joinedNames(
  source: TmwCp008GeneratedQuestion,
  indices: number[],
  language: TmwLocalizedLanguage,
): string {
  const values = indices.map((index) => cp008Name(source.parameters.context.roles[index].name, language));
  const joiner = language === "hi" ? " और " : " ਅਤੇ ";
  if (values.length <= 1) return values[0] ?? "";
  return `${values.slice(0, -1).join(", ")}${joiner}${values[values.length - 1]}`;
}

function schedule(
  source: TmwCp008GeneratedQuestion,
  index: number,
  language: TmwLocalizedLanguage,
): string {
  const role = source.parameters.context.roles[index];
  const name = cp008Name(role.name, language);
  const output = cp008Output(source.parameters, role.efficiency, language);
  return pair(
    language,
    `${name}: दक्षता ${cp008Number(role.efficiency)} ${output} प्रति घंटा, ${cp008Number(role.days)} दिन, प्रतिदिन ${cp008Number(role.hoursPerDay)} घंटे`,
    `${name}: ਦੱਖਤਾ ${cp008Number(role.efficiency)} ${output} ਪ੍ਰਤੀ ਘੰਟਾ, ${cp008Number(role.days)} ਦਿਨ, ਹਰ ਰੋਜ਼ ${cp008Number(role.hoursPerDay)} ਘੰਟੇ`,
  );
}

function rate(
  source: TmwCp008GeneratedQuestion,
  index: number,
  language: TmwLocalizedLanguage,
): string {
  const role = source.parameters.context.roles[index];
  return `${cp008Number(role.efficiency)} ${cp008Output(source.parameters, role.efficiency, language)} ${language === "hi" ? "प्रति घंटा" : "ਪ੍ਰਤੀ ਘੰਟਾ"}`;
}

export function renderTmwCp008LocalizedStem(
  source: TmwCp008GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const c = p.context.roles;
  const setting = cp008Copy(p.context.setting, language);
  const task = cp008Copy(p.context.task, language);
  const output = cp008Copy(p.context.outputUnit, language);
  const target = p.targetIndex ?? 0;
  const weights = tmwCp008ContributionVector(p);

  switch (source.solveMode) {
    case "findPaymentRatioFromContributionFactors":
      return pair(
        language,
        `${setting} में ${cp008Name(c[0].name, language)} और ${cp008Name(c[1].name, language)} ने ${task} पूरा किया। योगदान अभिलेख: ${schedule(source, 0, language)}; ${schedule(source, 1, language)}। भुगतान वास्तविक योगदान के अनुपात में बाँटा जाता है। दोनों का भुगतान अनुपात क्या है?`,
        `${setting} ਵਿੱਚ ${cp008Name(c[0].name, language)} ਅਤੇ ${cp008Name(c[1].name, language)} ਨੇ ${task} ਪੂਰਾ ਕੀਤਾ। ਯੋਗਦਾਨ ਰਿਕਾਰਡ: ${schedule(source, 0, language)}; ${schedule(source, 1, language)}। ਭੁਗਤਾਨ ਅਸਲ ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ। ਦੋਵਾਂ ਦਾ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );

    case "findSelectedPartyPayment": {
      const selected = required(p.selectedIndices, "selectedIndices");
      return pair(
        language,
        `${setting} में तीन कर्मचारियों ने ${task} पूरा किया। योगदान अभिलेख: ${schedule(source, 0, language)}; ${schedule(source, 1, language)}; ${schedule(source, 2, language)}। कुल श्रम भुगतान ${cp008Money(p.totalPayment)} है और इसे योगदान के अनुसार बाँटना है। ${joinedNames(source, selected, language)} को कुल कितना भुगतान मिलेगा?`,
        `${setting} ਵਿੱਚ ਤਿੰਨ ਕਰਮਚਾਰੀਆਂ ਨੇ ${task} ਪੂਰਾ ਕੀਤਾ। ਯੋਗਦਾਨ ਰਿਕਾਰਡ: ${schedule(source, 0, language)}; ${schedule(source, 1, language)}; ${schedule(source, 2, language)}। ਕੁੱਲ ਮਜ਼ਦੂਰੀ ਭੁਗਤਾਨ ${cp008Money(p.totalPayment)} ਹੈ ਅਤੇ ਇਹ ਯੋਗਦਾਨ ਅਨੁਸਾਰ ਵੰਡਣਾ ਹੈ। ${joinedNames(source, selected, language)} ਨੂੰ ਕੁੱਲ ਕਿੰਨਾ ਭੁਗਤਾਨ ਮਿਲੇਗਾ?`,
      );
    }

    case "findTotalPaymentPoolFromKnownShare": {
      const reported = required(p.reportedPayments, "reportedPayments");
      const ratio = weights.map((value) => cp008Number(value)).join(":");
      return pair(
        language,
        `${setting} में ${task} के लिए भुगतान योगदान के अनुसार बाँटा गया। सत्यापित योगदान अनुपात ${ratio} है। ${cp008Name(c[target].name, language)} का हिस्सा ${cp008Money(reported[target])} है। कुल भुगतान राशि कितनी थी?`,
        `${setting} ਵਿੱਚ ${task} ਲਈ ਭੁਗਤਾਨ ਯੋਗਦਾਨ ਅਨੁਸਾਰ ਵੰਡਿਆ ਗਿਆ। ਤਸਦੀਕ ਕੀਤਾ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${cp008Name(c[target].name, language)} ਦਾ ਹਿੱਸਾ ${cp008Money(reported[target])} ਹੈ। ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ਕਿੰਨੀ ਸੀ?`,
      );
    }

    case "findResidualPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      const known = required(p.knownPaymentIndices, "knownPaymentIndices");
      const knownText = known
        .map((index) => `${cp008Name(c[index].name, language)}—${cp008Money(reported[index])}`)
        .join(language === "hi" ? ", " : ", ");
      return pair(
        language,
        `${setting} में ${task} के लिए कुल ${cp008Money(p.totalPayment)} निर्धारित हैं। ज्ञात भुगतान: ${knownText}। शेष राशि ${cp008Name(c[target].name, language)} को मिलेगी। वह राशि कितनी है?`,
        `${setting} ਵਿੱਚ ${task} ਲਈ ਕੁੱਲ ${cp008Money(p.totalPayment)} ਨਿਰਧਾਰਤ ਹਨ। ਪਤਾ ਭੁਗਤਾਨ: ${knownText}। ਬਾਕੀ ਰਕਮ ${cp008Name(c[target].name, language)} ਨੂੰ ਮਿਲੇਗੀ। ਉਹ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
      );
    }

    case "findPaymentAfterStagedParticipation": {
      const event = required(p.eventKind, "eventKind");
      const nameA = cp008Name(c[0].name, language);
      const nameB = cp008Name(c[1].name, language);
      if (event === "JOIN") {
        const delay = subtract(c[0].days, c[1].days);
        return pair(
          language,
          `${setting} में ${nameA} ने ${task} शुरू किया और कुल ${cp008Number(c[0].days)} दिन काम किया। ${nameB} ${cp008Number(delay)} दिन बाद जुड़ा और शेष ${cp008Number(c[1].days)} दिन काम किया। दोनों की दक्षता समान है। ${cp008Money(p.totalPayment)} को वास्तविक योगदान के अनुसार बाँटने पर ${cp008Name(c[target].name, language)} को कितना मिलेगा?`,
          `${setting} ਵਿੱਚ ${nameA} ਨੇ ${task} ਸ਼ੁਰੂ ਕੀਤਾ ਅਤੇ ਕੁੱਲ ${cp008Number(c[0].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ। ${nameB} ${cp008Number(delay)} ਦਿਨ ਬਾਅਦ ਸ਼ਾਮਲ ਹੋਇਆ ਅਤੇ ਬਾਕੀ ${cp008Number(c[1].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ। ਦੋਵਾਂ ਦੀ ਦੱਖਤਾ ਇੱਕੋ ਹੈ। ${cp008Money(p.totalPayment)} ਨੂੰ ਅਸਲ ਯੋਗਦਾਨ ਅਨੁਸਾਰ ਵੰਡਣ ਤੇ ${cp008Name(c[target].name, language)} ਨੂੰ ਕਿੰਨਾ ਮਿਲੇਗਾ?`,
        );
      }
      if (event === "LEAVE") {
        return pair(
          language,
          `${setting} में ${nameA} और ${nameB} ने ${task} साथ शुरू किया। ${nameA} ने ${cp008Number(c[0].days)} दिन और ${nameB} ने ${cp008Number(c[1].days)} दिन काम किया। दोनों की दक्षता समान है। ${cp008Money(p.totalPayment)} को योगदान के अनुसार बाँटने पर ${cp008Name(c[target].name, language)} का हिस्सा कितना होगा?`,
          `${setting} ਵਿੱਚ ${nameA} ਅਤੇ ${nameB} ਨੇ ${task} ਇਕੱਠੇ ਸ਼ੁਰੂ ਕੀਤਾ। ${nameA} ਨੇ ${cp008Number(c[0].days)} ਦਿਨ ਅਤੇ ${nameB} ਨੇ ${cp008Number(c[1].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ। ਦੋਵਾਂ ਦੀ ਦੱਖਤਾ ਇੱਕੋ ਹੈ। ${cp008Money(p.totalPayment)} ਨੂੰ ਯੋਗਦਾਨ ਅਨੁਸਾਰ ਵੰਡਣ ਤੇ ${cp008Name(c[target].name, language)} ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
        );
      }
      return pair(
        language,
        `${setting} में ${nameA} ने ${task} पर ${cp008Number(c[0].days)} दिन काम किया और फिर जिम्मेदारी ${nameB} को सौंप दी, जिसने ${cp008Number(c[1].days)} दिन काम किया। उनकी व्यक्तिगत दरें ${rate(source, 0, language)} और ${rate(source, 1, language)} हैं। ${cp008Money(p.totalPayment)} में ${cp008Name(c[target].name, language)} का हिस्सा कितना है?`,
        `${setting} ਵਿੱਚ ${nameA} ਨੇ ${task} ਉੱਤੇ ${cp008Number(c[0].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ ਅਤੇ ਫਿਰ ਜ਼ਿੰਮੇਵਾਰੀ ${nameB} ਨੂੰ ਸੌਂਪ ਦਿੱਤੀ, ਜਿਸ ਨੇ ${cp008Number(c[1].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ। ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ${rate(source, 0, language)} ਅਤੇ ${rate(source, 1, language)} ਹੈ। ${cp008Money(p.totalPayment)} ਵਿੱਚ ${cp008Name(c[target].name, language)} ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੈ?`,
      );
    }

    case "findPaymentFromCompletedFractions":
      return pair(
        language,
        `${setting} में तीन कर्मचारियों ने ${task} पूरा किया। उनके सत्यापित कार्य-हिस्से क्रमशः ${weights.map(cp008Number).join(", ")} हैं। कुल भुगतान ${cp008Money(p.totalPayment)} है। ${cp008Name(c[target].name, language)} को कितना मिलेगा?`,
        `${setting} ਵਿੱਚ ਤਿੰਨ ਕਰਮਚਾਰੀਆਂ ਨੇ ${task} ਪੂਰਾ ਕੀਤਾ। ਉਨ੍ਹਾਂ ਦੇ ਤਸਦੀਕ ਕੀਤੇ ਕੰਮ-ਹਿੱਸੇ ਕ੍ਰਮਵਾਰ ${weights.map(cp008Number).join(", ")} ਹਨ। ਕੁੱਲ ਭੁਗਤਾਨ ${cp008Money(p.totalPayment)} ਹੈ। ${cp008Name(c[target].name, language)} ਨੂੰ ਕਿੰਨਾ ਮਿਲੇਗਾ?`,
      );

    case "findContributionFactorRatioFromPayments": {
      const reported = required(p.reportedPayments, "reportedPayments");
      if (p.factorTarget === "EFFICIENCY_RATIO") {
        return pair(
          language,
          `${setting} में ${cp008Name(c[0].name, language)} और ${cp008Name(c[1].name, language)} को ${task} के लिए क्रमशः ${cp008Money(reported[0])} और ${cp008Money(reported[1])} मिले। उन्होंने ${cp008Number(c[0].days)} और ${cp008Number(c[1].days)} दिन काम किया तथा दैनिक घंटे समान थे। उनकी दक्षताओं का अनुपात क्या है?`,
          `${setting} ਵਿੱਚ ${cp008Name(c[0].name, language)} ਅਤੇ ${cp008Name(c[1].name, language)} ਨੂੰ ${task} ਲਈ ਕ੍ਰਮਵਾਰ ${cp008Money(reported[0])} ਅਤੇ ${cp008Money(reported[1])} ਮਿਲੇ। ਉਨ੍ਹਾਂ ਨੇ ${cp008Number(c[0].days)} ਅਤੇ ${cp008Number(c[1].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਸਨ। ਉਨ੍ਹਾਂ ਦੀ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        );
      }
      return pair(
        language,
        `${setting} में ${cp008Name(c[0].name, language)} और ${cp008Name(c[1].name, language)} को क्रमशः ${cp008Money(reported[0])} और ${cp008Money(reported[1])} मिले। उनकी व्यक्तिगत दरें ${rate(source, 0, language)} और ${rate(source, 1, language)} हैं तथा दैनिक घंटे समान हैं। दोनों के कार्य-दिनों का अनुपात क्या है?`,
        `${setting} ਵਿੱਚ ${cp008Name(c[0].name, language)} ਅਤੇ ${cp008Name(c[1].name, language)} ਨੂੰ ਕ੍ਰਮਵਾਰ ${cp008Money(reported[0])} ਅਤੇ ${cp008Money(reported[1])} ਮਿਲੇ। ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ${rate(source, 0, language)} ਅਤੇ ${rate(source, 1, language)} ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਹਨ। ਦੋਵਾਂ ਦੇ ਕੰਮ-ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );
    }

    case "findMissingTimeFromPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      const other = target === 0 ? 1 : 0;
      return pair(
        language,
        `${setting} में ${cp008Name(c[target].name, language)} और ${cp008Name(c[other].name, language)} को ${task} के लिए ${cp008Money(reported[target])} और ${cp008Money(reported[other])} मिले। उनकी दरें ${rate(source, target, language)} और ${rate(source, other, language)} हैं तथा दैनिक घंटे समान हैं। ${cp008Name(c[other].name, language)} ने ${cp008Number(c[other].days)} दिन काम किया। ${cp008Name(c[target].name, language)} ने कितने दिन काम किया?`,
        `${setting} ਵਿੱਚ ${cp008Name(c[target].name, language)} ਅਤੇ ${cp008Name(c[other].name, language)} ਨੂੰ ${task} ਲਈ ${cp008Money(reported[target])} ਅਤੇ ${cp008Money(reported[other])} ਮਿਲੇ। ਉਨ੍ਹਾਂ ਦੀ ਦਰ ${rate(source, target, language)} ਅਤੇ ${rate(source, other, language)} ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਹਨ। ${cp008Name(c[other].name, language)} ਨੇ ${cp008Number(c[other].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ। ${cp008Name(c[target].name, language)} ਨੇ ਕਿੰਨੇ ਦਿਨ ਕੰਮ ਕੀਤਾ?`,
      );
    }

    case "findMissingEfficiencyFromPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      const other = target === 0 ? 1 : 0;
      return pair(
        language,
        `${setting} में ${cp008Name(c[target].name, language)} और ${cp008Name(c[other].name, language)} ने क्रमशः ${cp008Number(c[target].days)} और ${cp008Number(c[other].days)} दिन काम किया तथा उन्हें ${cp008Money(reported[target])} और ${cp008Money(reported[other])} मिले। दैनिक घंटे समान हैं और ${cp008Name(c[other].name, language)} की दर ${rate(source, other, language)} है। ${cp008Name(c[target].name, language)} की प्रति घंटा दर क्या है?`,
        `${setting} ਵਿੱਚ ${cp008Name(c[target].name, language)} ਅਤੇ ${cp008Name(c[other].name, language)} ਨੇ ਕ੍ਰਮਵਾਰ ${cp008Number(c[target].days)} ਅਤੇ ${cp008Number(c[other].days)} ਦਿਨ ਕੰਮ ਕੀਤਾ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ${cp008Money(reported[target])} ਅਤੇ ${cp008Money(reported[other])} ਮਿਲੇ। ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਇੱਕੋ ਹਨ ਅਤੇ ${cp008Name(c[other].name, language)} ਦੀ ਦਰ ${rate(source, other, language)} ਹੈ। ${cp008Name(c[target].name, language)} ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਕੀ ਹੈ?`,
      );
    }

    case "findMixedCategoryPaymentDistribution":
      return pair(
        language,
        `${setting} में मिश्रित दल ने ${task} पूरा किया। दल में ${cp008Number(c[0].count)} ${cp008Role(p, 0, language, true)}, ${cp008Number(c[1].count)} ${cp008Role(p, 1, language, true)} और ${cp008Number(c[2].count)} ${cp008Role(p, 2, language, true)} हैं। उनकी व्यक्तिगत दरें क्रमशः ${rate(source, 0, language)}, ${rate(source, 1, language)} और ${rate(source, 2, language)} हैं; सभी ने समान समय काम किया। ${cp008Money(p.totalPayment)} को तीन श्रेणियों में बताए गए क्रम में बाँटें।`,
        `${setting} ਵਿੱਚ ਮਿਲੇ-ਜੁਲੇ ਦਲ ਨੇ ${task} ਪੂਰਾ ਕੀਤਾ। ਦਲ ਵਿੱਚ ${cp008Number(c[0].count)} ${cp008Role(p, 0, language, true)}, ${cp008Number(c[1].count)} ${cp008Role(p, 1, language, true)} ਅਤੇ ${cp008Number(c[2].count)} ${cp008Role(p, 2, language, true)} ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${rate(source, 0, language)}, ${rate(source, 1, language)} ਅਤੇ ${rate(source, 2, language)} ਹੈ; ਸਭ ਨੇ ਇੱਕੋ ਸਮਾਂ ਕੰਮ ਕੀਤਾ। ${cp008Money(p.totalPayment)} ਨੂੰ ਤਿੰਨ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਦਿੱਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਵੰਡੋ।`,
      );

    case "findPieceRatePaymentFromOutput": {
      const pieceRate = required(p.pieceRate, "pieceRate");
      return pair(
        language,
        `${setting} में ${cp008Name(c[target].name, language)} ने ${task} के लिए ${cp008Number(c[target].output)} स्वीकृत ${output} पूरे किए। तय पीस-रेट ${cp008Money(pieceRate)} प्रति इकाई है। देय भुगतान कितना है?`,
        `${setting} ਵਿੱਚ ${cp008Name(c[target].name, language)} ਨੇ ${task} ਲਈ ${cp008Number(c[target].output)} ਮਨਜ਼ੂਰਸ਼ੁਦਾ ${output} ਪੂਰੇ ਕੀਤੇ। ਤੈਅ ਪੀਸ-ਰੇਟ ${cp008Money(pieceRate)} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ। ਦੇਣਯੋਗ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੈ?`,
      );
    }

    case "findBonusShareFromExtraContribution": {
      const bonus = required(p.bonusPool, "bonusPool");
      const records = c.map((role) => `${cp008Name(role.name, language)}—${cp008Number(role.output)}/${cp008Number(role.baselineOutput)}`).join(", ");
      return pair(
        language,
        `${setting} में ${cp008Money(bonus)} का बोनस केवल लक्ष्य से अधिक उत्पादन के अनुपात में बाँटा जाता है। अभिलेख में वास्तविक उत्पादन/लक्ष्य: ${records} ${output}। ${cp008Name(c[target].name, language)} को कितना बोनस मिलेगा?`,
        `${setting} ਵਿੱਚ ${cp008Money(bonus)} ਦਾ ਬੋਨਸ ਸਿਰਫ਼ ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ। ਰਿਕਾਰਡ ਵਿੱਚ ਅਸਲ ਉਤਪਾਦਨ/ਟੀਚਾ: ${records} ${output}। ${cp008Name(c[target].name, language)} ਨੂੰ ਕਿੰਨਾ ਬੋਨਸ ਮਿਲੇਗਾ?`,
      );
    }

    case "findPaymentAfterSignedContribution": {
      const records = c.map((role) => `${cp008Name(role.name, language)}—${cp008Number(role.output)}-${cp008Number(role.defectiveOutput)}`).join(", ");
      return pair(
        language,
        `${setting} में ${cp008Money(p.totalPayment)} को स्वीकृत शुद्ध उत्पादन के अनुसार बाँटना है। अभिलेख में कुल उत्पादन−अस्वीकृत/पुनःकार्य मात्रा: ${records} ${output}। ${cp008Name(c[target].name, language)} का भुगतान कितना है?`,
        `${setting} ਵਿੱਚ ${cp008Money(p.totalPayment)} ਨੂੰ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਅਨੁਸਾਰ ਵੰਡਣਾ ਹੈ। ਰਿਕਾਰਡ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ−ਰੱਦ/ਮੁੜ-ਕੰਮ ਮਾਤਰਾ: ${records} ${output}। ${cp008Name(c[target].name, language)} ਦਾ ਭੁਗਤਾਨ ਕਿੰਨਾ ਹੈ?`,
      );
    }
  }
}
