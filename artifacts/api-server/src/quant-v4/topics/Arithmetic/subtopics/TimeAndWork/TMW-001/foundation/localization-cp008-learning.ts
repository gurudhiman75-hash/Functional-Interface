import { required } from "./cp001-helpers";
import { tmwCp008ContributionVector } from "./cp008-engine";
import type {
  TmwCp008GeneratedQuestion,
  TmwCp008MisconceptionId,
  TmwCp008RuleId,
} from "./cp008-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp008Copy,
  cp008Money,
  cp008Name,
  cp008Number,
} from "./localization-cp008-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function selectedNames(
  source: TmwCp008GeneratedQuestion,
  indices: number[],
  language: TmwLocalizedLanguage,
): string {
  const values = indices.map((index) => cp008Name(source.parameters.context.roles[index].name, language));
  const joiner = language === "hi" ? " और " : " ਅਤੇ ";
  if (values.length <= 1) return values[0] ?? "";
  return `${values.slice(0, -1).join(", ")}${joiner}${values[values.length - 1]}`;
}

export function tmwCp008LocalizedOpening(
  ruleId: TmwCp008RuleId,
  language: TmwLocalizedLanguage,
): string {
  switch (ruleId) {
    case "TMW_CONTRIBUTION_RATIO":
      return pair(
        language,
        "भुगतान केवल उपस्थिति के आधार पर नहीं बाँटा जाता। प्रत्येक व्यक्ति का योगदान = संख्या × दक्षता × कार्य-दिन × दैनिक घंटे; फिर योगदानों का अनुपात लें।",
        "ਭੁਗਤਾਨ ਸਿਰਫ਼ ਹਾਜ਼ਰੀ ਦੇ ਆਧਾਰ ਉੱਤੇ ਨਹੀਂ ਵੰਡਿਆ ਜਾਂਦਾ। ਹਰ ਵਿਅਕਤੀ ਦਾ ਯੋਗਦਾਨ = ਗਿਣਤੀ × ਦੱਖਤਾ × ਕੰਮ-ਦਿਨ × ਰੋਜ਼ਾਨਾ ਘੰਟੇ; ਫਿਰ ਯੋਗਦਾਨਾਂ ਦਾ ਅਨੁਪਾਤ ਲਓ।",
      );
    case "TMW_PAYMENT_SHARE":
      return pair(
        language,
        "पहले सभी योगदानों को एक ही माप में लिखें। किसी व्यक्ति या चुने समूह का भुगतान = कुल राशि × उसका योगदान ÷ कुल योगदान।",
        "ਪਹਿਲਾਂ ਸਾਰੇ ਯੋਗਦਾਨ ਇੱਕੋ ਮਾਪ ਵਿੱਚ ਲਿਖੋ। ਕਿਸੇ ਵਿਅਕਤੀ ਜਾਂ ਚੁਣੇ ਸਮੂਹ ਦਾ ਭੁਗਤਾਨ = ਕੁੱਲ ਰਕਮ × ਉਸ ਦਾ ਯੋਗਦਾਨ ÷ ਕੁੱਲ ਯੋਗਦਾਨ।",
      );
    case "TMW_PAYMENT_INVERSE":
      return pair(
        language,
        "भुगतान अनुपात और योगदान अनुपात समान होते हैं। ज्ञात भुगतान, समय या दक्षता को उसी संबंध में रखकर अज्ञात राशि या गुणक अलग करें।",
        "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਅਤੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਇੱਕੋ ਹੁੰਦੇ ਹਨ। ਪਤਾ ਭੁਗਤਾਨ, ਸਮਾਂ ਜਾਂ ਦੱਖਤਾ ਨੂੰ ਉਸੇ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖ ਕੇ ਅਣਜਾਣ ਰਕਮ ਜਾਂ ਗੁਣਕ ਵੱਖ ਕਰੋ।",
      );
    case "TMW_STAGED_PAYMENT":
      return pair(
        language,
        "चरणबद्ध काम में केवल वही अवधि गिनें जिसमें व्यक्ति वास्तव में सक्रिय रहा। योगदान = व्यक्तिगत दर × सक्रिय समय।",
        "ਪੜਾਅਵਾਰ ਕੰਮ ਵਿੱਚ ਸਿਰਫ਼ ਉਹੀ ਮਿਆਦ ਗਿਣੋ ਜਿਸ ਵਿੱਚ ਵਿਅਕਤੀ ਅਸਲ ਵਿੱਚ ਸਰਗਰਮ ਰਿਹਾ। ਯੋਗਦਾਨ = ਵਿਅਕਤੀਗਤ ਦਰ × ਸਰਗਰਮ ਸਮਾਂ।",
      );
    case "TMW_PIECE_RATE":
      return pair(
        language,
        "पीस-रेट भुगतान में केवल स्वीकृत इकाइयाँ गिनी जाती हैं। देय राशि = स्वीकृत उत्पादन × प्रति इकाई दर।",
        "ਪੀਸ-ਰੇਟ ਭੁਗਤਾਨ ਵਿੱਚ ਸਿਰਫ਼ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਇਕਾਈਆਂ ਗਿਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੇਣਯੋਗ ਰਕਮ = ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ × ਪ੍ਰਤੀ ਇਕਾਈ ਦਰ।",
      );
    case "TMW_EXTRA_CONTRIBUTION":
      return pair(
        language,
        "लक्ष्य-आधारित बोनस के लिए कुल उत्पादन नहीं, बल्कि लक्ष्य से अधिक उत्पादन गिनें। बोनस उसी अतिरिक्त योगदान के अनुपात में बाँटें।",
        "ਟੀਚਾ-ਅਧਾਰਿਤ ਬੋਨਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ਨਹੀਂ, ਸਗੋਂ ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਗਿਣੋ। ਬੋਨਸ ਉਸੇ ਵਾਧੂ ਯੋਗਦਾਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।",
      );
    case "TMW_SIGNED_CONTRIBUTION":
      return pair(
        language,
        "अस्वीकृत या पुनःकार्य मात्रा को सकारात्मक योगदान नहीं माना जाता। शुद्ध स्वीकृत उत्पादन = दर्ज उत्पादन − अस्वीकृत मात्रा।",
        "ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ ਮਾਤਰਾ ਨੂੰ ਸਕਾਰਾਤਮਕ ਯੋਗਦਾਨ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ। ਸ਼ੁੱਧ ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ = ਦਰਜ ਉਤਪਾਦਨ − ਰੱਦ ਮਾਤਰਾ।",
      );
  }
}

export function tmwCp008LocalizedGivens(
  source: TmwCp008GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  const c = p.context.roles;
  const target = p.targetIndex ?? 0;
  const weights = tmwCp008ContributionVector(p);
  const output = cp008Copy(p.context.outputUnit, language);

  switch (source.solveMode) {
    case "findPaymentRatioFromContributionFactors":
      return pair(
        language,
        `${cp008Name(c[0].name, language)} का योगदान गुणनफल: ${cp008Number(c[0].efficiency)} × ${cp008Number(c[0].days)} × ${cp008Number(c[0].hoursPerDay)}।`,
        `${cp008Name(c[0].name, language)} ਦਾ ਯੋਗਦਾਨ ਗੁਣਨਫਲ: ${cp008Number(c[0].efficiency)} × ${cp008Number(c[0].days)} × ${cp008Number(c[0].hoursPerDay)}।`,
      ).split("\n").concat(pair(
        language,
        `${cp008Name(c[1].name, language)} का योगदान गुणनफल: ${cp008Number(c[1].efficiency)} × ${cp008Number(c[1].days)} × ${cp008Number(c[1].hoursPerDay)}।`,
        `${cp008Name(c[1].name, language)} ਦਾ ਯੋਗਦਾਨ ਗੁਣਨਫਲ: ${cp008Number(c[1].efficiency)} × ${cp008Number(c[1].days)} × ${cp008Number(c[1].hoursPerDay)}।`,
      ));

    case "findSelectedPartyPayment": {
      const selected = required(p.selectedIndices, "selectedIndices");
      return [
        pair(language, `कुल भुगतान: ${cp008Money(p.totalPayment)}।`, `ਕੁੱਲ ਭੁਗਤਾਨ: ${cp008Money(p.totalPayment)}।`),
        pair(language, `चुना प्राप्तकर्ता: ${selectedNames(source, selected, language)}।`, `ਚੁਣਿਆ ਪ੍ਰਾਪਤਕਰਤਾ: ${selectedNames(source, selected, language)}।`),
      ];
    }

    case "findTotalPaymentPoolFromKnownShare": {
      const reported = required(p.reportedPayments, "reportedPayments");
      return [
        pair(language, `योगदान अनुपात: ${weights.map(cp008Number).join(":")}।`, `ਯੋਗਦਾਨ ਅਨੁਪਾਤ: ${weights.map(cp008Number).join(":")}।`),
        pair(language, `ज्ञात हिस्सा: ${cp008Name(c[target].name, language)} = ${cp008Money(reported[target])}।`, `ਪਤਾ ਹਿੱਸਾ: ${cp008Name(c[target].name, language)} = ${cp008Money(reported[target])}।`),
      ];
    }

    case "findResidualPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      const known = required(p.knownPaymentIndices, "knownPaymentIndices");
      return [
        pair(language, `कुल राशि: ${cp008Money(p.totalPayment)}।`, `ਕੁੱਲ ਰਕਮ: ${cp008Money(p.totalPayment)}।`),
        pair(language, `पहले से दिए भुगतान: ${known.map((index) => cp008Money(reported[index])).join(" + ")}।`, `ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ: ${known.map((index) => cp008Money(reported[index])).join(" + ")}।`),
      ];
    }

    case "findPaymentAfterStagedParticipation":
      return [
        pair(language, `कुल भुगतान: ${cp008Money(p.totalPayment)}।`, `ਕੁੱਲ ਭੁਗਤਾਨ: ${cp008Money(p.totalPayment)}।`),
        pair(language, `लक्ष्य हिस्सा: ${cp008Name(c[target].name, language)}; केवल सक्रिय अवधि गिनें।`, `ਟੀਚਾ ਹਿੱਸਾ: ${cp008Name(c[target].name, language)}; ਸਿਰਫ਼ ਸਰਗਰਮ ਮਿਆਦ ਗਿਣੋ।`),
      ];

    case "findPaymentFromCompletedFractions":
      return [
        pair(language, `कार्य-हिस्से: ${weights.map(cp008Number).join(", ")}।`, `ਕੰਮ-ਹਿੱਸੇ: ${weights.map(cp008Number).join(", ")}।`),
        pair(language, `कुल भुगतान: ${cp008Money(p.totalPayment)}; लक्ष्य: ${cp008Name(c[target].name, language)}।`, `ਕੁੱਲ ਭੁਗਤਾਨ: ${cp008Money(p.totalPayment)}; ਟੀਚਾ: ${cp008Name(c[target].name, language)}।`),
      ];

    case "findContributionFactorRatioFromPayments": {
      const reported = required(p.reportedPayments, "reportedPayments");
      return [
        pair(language, `भुगतान अनुपात: ${cp008Money(reported[0])}:${cp008Money(reported[1])}।`, `ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ${cp008Money(reported[0])}:${cp008Money(reported[1])}।`),
        pair(language, p.factorTarget === "EFFICIENCY_RATIO" ? "ज्ञात गुणक: कार्य-दिन; अज्ञात: दक्षता अनुपात।" : "ज्ञात गुणक: दक्षता; अज्ञात: कार्य-दिन अनुपात।", p.factorTarget === "EFFICIENCY_RATIO" ? "ਪਤਾ ਗੁਣਕ: ਕੰਮ-ਦਿਨ; ਅਣਜਾਣ: ਦੱਖਤਾ ਅਨੁਪਾਤ।" : "ਪਤਾ ਗੁਣਕ: ਦੱਖਤਾ; ਅਣਜਾਣ: ਕੰਮ-ਦਿਨ ਅਨੁਪਾਤ।"),
      ];
    }

    case "findMissingTimeFromPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      return [
        pair(language, `भुगतान: ${cp008Money(reported[target])} और ${cp008Money(reported[target === 0 ? 1 : 0])}।`, `ਭੁਗਤਾਨ: ${cp008Money(reported[target])} ਅਤੇ ${cp008Money(reported[target === 0 ? 1 : 0])}।`),
        pair(language, `अज्ञात: ${cp008Name(c[target].name, language)} के कार्य-दिन।`, `ਅਣਜਾਣ: ${cp008Name(c[target].name, language)} ਦੇ ਕੰਮ-ਦਿਨ।`),
      ];
    }

    case "findMissingEfficiencyFromPayment": {
      const reported = required(p.reportedPayments, "reportedPayments");
      return [
        pair(language, `भुगतान: ${cp008Money(reported[target])} और ${cp008Money(reported[target === 0 ? 1 : 0])}।`, `ਭੁਗਤਾਨ: ${cp008Money(reported[target])} ਅਤੇ ${cp008Money(reported[target === 0 ? 1 : 0])}।`),
        pair(language, `अज्ञात: ${cp008Name(c[target].name, language)} की प्रति घंटा दर।`, `ਅਣਜਾਣ: ${cp008Name(c[target].name, language)} ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ।`),
      ];
    }

    case "findMixedCategoryPaymentDistribution":
      return [
        pair(language, `श्रेणी योगदान अनुपात: ${weights.map(cp008Number).join(":")}।`, `ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ ਅਨੁਪਾਤ: ${weights.map(cp008Number).join(":")}।`),
        pair(language, `कुल भुगतान ${cp008Money(p.totalPayment)}; उत्तर तीनों श्रेणियों के बताए क्रम में चाहिए।`, `ਕੁੱਲ ਭੁਗਤਾਨ ${cp008Money(p.totalPayment)}; ਉੱਤਰ ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਚਾਹੀਦਾ ਹੈ।`),
      ];

    case "findPieceRatePaymentFromOutput":
      return [
        pair(language, `स्वीकृत उत्पादन: ${cp008Number(c[target].output)} ${output}।`, `ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ: ${cp008Number(c[target].output)} ${output}।`),
        pair(language, `प्रति इकाई दर: ${cp008Money(required(p.pieceRate, "pieceRate"))}।`, `ਪ੍ਰਤੀ ਇਕਾਈ ਦਰ: ${cp008Money(required(p.pieceRate, "pieceRate"))}।`),
      ];

    case "findBonusShareFromExtraContribution":
      return [
        pair(language, `अतिरिक्त योगदान: ${weights.map(cp008Number).join(":")}।`, `ਵਾਧੂ ਯੋਗਦਾਨ: ${weights.map(cp008Number).join(":")}।`),
        pair(language, `बोनस पूल: ${cp008Money(required(p.bonusPool, "bonusPool"))}।`, `ਬੋਨਸ ਪੂਲ: ${cp008Money(required(p.bonusPool, "bonusPool"))}।`),
      ];

    case "findPaymentAfterSignedContribution":
      return [
        pair(language, `शुद्ध स्वीकृत योगदान: ${weights.map(cp008Number).join(":")}।`, `ਸ਼ੁੱਧ ਮਨਜ਼ੂਰ ਯੋਗਦਾਨ: ${weights.map(cp008Number).join(":")}।`),
        pair(language, `भुगतान पूल: ${cp008Money(p.totalPayment)}।`, `ਭੁਗਤਾਨ ਪੂਲ: ${cp008Money(p.totalPayment)}।`),
      ];
  }
}

export function tmwCp008LocalizedShortcut(
  source: TmwCp008GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const p = source.parameters;
  const target = p.targetIndex ?? 0;
  const weights = tmwCp008ContributionVector(p);
  const title = (hi: string, pa: string): string => pair(language, `10-सेकंड ${hi}`, `10-ਸਕਿੰਟ ${pa}`);

  switch (source.solveMode) {
    case "findPaymentRatioFromContributionFactors":
      return { title: title("योगदान गुणनफल", "ਯੋਗਦਾਨ ਗੁਣਨਫਲ"), steps: [pair(language, "हर व्यक्ति के लिए दक्षता × दिन × दैनिक घंटे लिखें।", "ਹਰ ਵਿਅਕਤੀ ਲਈ ਦੱਖਤਾ × ਦਿਨ × ਰੋਜ਼ਾਨਾ ਘੰਟੇ ਲਿਖੋ।"), pair(language, `समान गुणक काटकर अनुपात घटाएँ; उत्तर ${answerText}।`, `ਸਾਂਝੇ ਗੁਣਕ ਕੱਟ ਕੇ ਅਨੁਪਾਤ ਘਟਾਓ; ਉੱਤਰ ${answerText}।`)] };
    case "findSelectedPartyPayment":
    case "findPaymentAfterStagedParticipation":
    case "findPaymentFromCompletedFractions":
      return { title: title("हिस्सा भिन्न", "ਹਿੱਸਾ ਭਿੰਨ"), steps: [pair(language, "चुने योगदान को कुल योगदान से भाग देकर हिस्सा बनाएँ।", "ਚੁਣੇ ਯੋਗਦਾਨ ਨੂੰ ਕੁੱਲ ਯੋਗਦਾਨ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਹਿੱਸਾ ਬਣਾਓ।"), pair(language, `उस हिस्से को कुल राशि से गुणा करें; उत्तर ${answerText}।`, `ਉਸ ਹਿੱਸੇ ਨੂੰ ਕੁੱਲ ਰਕਮ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findTotalPaymentPoolFromKnownShare":
      return { title: title("उलटा हिस्सा", "ਉਲਟ ਹਿੱਸਾ"), steps: [pair(language, "ज्ञात व्यक्ति का योगदान-भिन्न पहचानें।", "ਪਤਾ ਵਿਅਕਤੀ ਦਾ ਯੋਗਦਾਨ-ਭਿੰਨ ਪਛਾਣੋ।"), pair(language, `ज्ञात भुगतान को उस भिन्न से भाग दें; कुल राशि ${answerText}।`, `ਪਤਾ ਭੁਗਤਾਨ ਨੂੰ ਉਸ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦਿਓ; ਕੁੱਲ ਰਕਮ ${answerText}।`)] };
    case "findResidualPayment":
      return { title: title("सीधा शेष", "ਸਿੱਧਾ ਬਾਕੀ"), steps: [pair(language, "ज्ञात भुगतानों को जोड़ें।", "ਪਤਾ ਭੁਗਤਾਨ ਜੋੜੋ।"), pair(language, `कुल राशि में से यह योग घटाएँ; शेष ${answerText}।`, `ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਇਹ ਜੋੜ ਘਟਾਓ; ਬਾਕੀ ${answerText}।`)] };
    case "findContributionFactorRatioFromPayments":
      return { title: title("गुणक काटें", "ਗੁਣਕ ਕੱਟੋ"), steps: [pair(language, "भुगतान अनुपात = दक्षता × समय अनुपात लिखें।", "ਭੁਗਤਾਨ ਅਨੁਪਾਤ = ਦੱਖਤਾ × ਸਮਾਂ ਅਨੁਪਾਤ ਲਿਖੋ।"), pair(language, `ज्ञात गुणक काटकर माँगा अनुपात पाएँ; उत्तर ${answerText}।`, `ਪਤਾ ਗੁਣਕ ਕੱਟ ਕੇ ਮੰਗਿਆ ਅਨੁਪਾਤ ਲਵੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findMissingTimeFromPayment":
      return { title: title("भुगतान से समय", "ਭੁਗਤਾਨ ਤੋਂ ਸਮਾਂ"), steps: [pair(language, "भुगतान अनुपात में ज्ञात दक्षताओं और ज्ञात समय को रखें।", "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਵਿੱਚ ਪਤਾ ਦੱਖਤਾਵਾਂ ਅਤੇ ਪਤਾ ਸਮਾਂ ਰੱਖੋ।"), pair(language, `अज्ञात समय अलग करें; उत्तर ${answerText}।`, `ਅਣਜਾਣ ਸਮਾਂ ਵੱਖ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findMissingEfficiencyFromPayment":
      return { title: title("भुगतान से दर", "ਭੁਗਤਾਨ ਤੋਂ ਦਰ"), steps: [pair(language, "भुगतान अनुपात में दोनों कार्य-अवधियाँ रखें।", "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਵਿੱਚ ਦੋਵਾਂ ਕੰਮ-ਮਿਆਦਾਂ ਰੱਖੋ।"), pair(language, `लक्ष्य दक्षता अलग करें; उत्तर ${answerText}।`, `ਟੀਚਾ ਦੱਖਤਾ ਵੱਖ ਕਰੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findMixedCategoryPaymentDistribution":
      return { title: title("तीन हिस्से", "ਤਿੰਨ ਹਿੱਸੇ"), steps: [pair(language, `तीनों श्रेणी योगदान ${weights.map(cp008Number).join(":")} के अनुपात में लिखें।`, `ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ ${weights.map(cp008Number).join(":")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਲਿਖੋ।`), pair(language, `कुल राशि को उसी क्रम में बाँटें; उत्तर ${answerText}।`, `ਕੁੱਲ ਰਕਮ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਵੰਡੋ; ਉੱਤਰ ${answerText}।`)] };
    case "findPieceRatePaymentFromOutput":
      return { title: title("पीस-रेट गुणा", "ਪੀਸ-ਰੇਟ ਗੁਣਾ"), steps: [pair(language, "केवल स्वीकृत इकाइयाँ लें।", "ਸਿਰਫ਼ ਮਨਜ਼ੂਰ ਇਕਾਈਆਂ ਲਵੋ।"), pair(language, `स्वीकृत इकाइयाँ × प्रति इकाई दर = ${answerText}।`, `ਮਨਜ਼ੂਰ ਇਕਾਈਆਂ × ਪ੍ਰਤੀ ਇਕਾਈ ਦਰ = ${answerText}।`)] };
    case "findBonusShareFromExtraContribution":
      return { title: title("लक्ष्य से अधिक", "ਟੀਚੇ ਤੋਂ ਵੱਧ"), steps: [pair(language, "हर व्यक्ति के वास्तविक उत्पादन में से उसका लक्ष्य घटाएँ।", "ਹਰ ਵਿਅਕਤੀ ਦੇ ਅਸਲ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਉਸ ਦਾ ਟੀਚਾ ਘਟਾਓ।"), pair(language, `बोनस को अतिरिक्त योगदान अनुपात में बाँटें; लक्ष्य हिस्सा ${weights[target].numerator}, उत्तर ${answerText}।`, `ਬੋਨਸ ਨੂੰ ਵਾਧੂ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ; ਟੀਚਾ ਹਿੱਸਾ ${weights[target].numerator}, ਉੱਤਰ ${answerText}।`)] };
    case "findPaymentAfterSignedContribution":
      return { title: title("शुद्ध उत्पादन", "ਸ਼ੁੱਧ ਉਤਪਾਦਨ"), steps: [pair(language, "हर दर्ज उत्पादन में से अस्वीकृत या पुनःकार्य मात्रा घटाएँ।", "ਹਰ ਦਰਜ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ ਮਾਤਰਾ ਘਟਾਓ।"), pair(language, `राशि को शुद्ध अनुपात में बाँटें; उत्तर ${answerText}।`, `ਰਕਮ ਨੂੰ ਸ਼ੁੱਧ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ; ਉੱਤਰ ${answerText}।`)] };
  }
}

export function tmwCp008LocalizedTrapReason(
  misconceptionId: TmwCp008MisconceptionId,
  language: TmwLocalizedLanguage,
): string {
  switch (misconceptionId) {
    case "TIME_FACTOR_IGNORED":
      return pair(language, "यह विकल्प कार्य-अवधि को छोड़कर केवल दक्षता देखता है।", "ਇਹ ਚੋਣ ਕੰਮ-ਮਿਆਦ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਦੱਖਤਾ ਵੇਖਦੀ ਹੈ।");
    case "EFFICIENCY_FACTOR_IGNORED":
      return pair(language, "यह विकल्प दक्षता को छोड़कर केवल समय देखता है।", "ਇਹ ਚੋਣ ਦੱਖਤਾ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਸਮਾਂ ਵੇਖਦੀ ਹੈ।");
    case "HOURS_FACTOR_IGNORED":
      return pair(language, "यह विकल्प दैनिक घंटों के अंतर को शामिल नहीं करता।", "ਇਹ ਚੋਣ ਰੋਜ਼ਾਨਾ ਘੰਟਿਆਂ ਦਾ ਫਰਕ ਸ਼ਾਮਲ ਨਹੀਂ ਕਰਦੀ।");
    case "EQUAL_SPLIT_ASSUMED":
      return pair(language, "यह विकल्प योगदान अलग होने पर भी राशि बराबर बाँट देता है।", "ਇਹ ਚੋਣ ਯੋਗਦਾਨ ਵੱਖ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਰਕਮ ਬਰਾਬਰ ਵੰਡ ਦਿੰਦੀ ਹੈ।");
    case "RATIO_USED_AS_MONEY":
      return pair(language, "यह विकल्प योगदान-भार को रुपये की राशि समझ लेता है।", "ਇਹ ਚੋਣ ਯੋਗਦਾਨ-ਭਾਰ ਨੂੰ ਰੁਪਏ ਦੀ ਰਕਮ ਮੰਨ ਲੈਂਦੀ ਹੈ।");
    case "TOTAL_REPORTED_AS_SHARE":
      return pair(language, "यह विकल्प माँगे गए हिस्से के स्थान पर पूरी राशि बता देता है।", "ਇਹ ਚੋਣ ਮੰਗੇ ਹਿੱਸੇ ਦੀ ਥਾਂ ਪੂਰੀ ਰਕਮ ਦੱਸ ਦਿੰਦੀ ਹੈ।");
    case "KNOWN_PAYMENT_NOT_SUBTRACTED":
      return pair(language, "यह विकल्प पहले से दिए भुगतान कुल राशि से नहीं घटाता।", "ਇਹ ਚੋਣ ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਉਂਦੀ।");
    case "RATIO_ORDER_REVERSED":
      return pair(language, "यह विकल्प व्यक्तियों या श्रेणियों का माँगा क्रम उलट देता है।", "ਇਹ ਚੋਣ ਵਿਅਕਤੀਆਂ ਜਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਮੰਗਿਆ ਕ੍ਰਮ ਉਲਟ ਦਿੰਦੀ ਹੈ।");
    case "CONTRIBUTION_FACTOR_NOT_ISOLATED":
      return pair(language, "यह विकल्प ज्ञात समय या दक्षता गुणक को अलग किए बिना भुगतान अनुपात ही रख देता है।", "ਇਹ ਚੋਣ ਪਤਾ ਸਮਾਂ ਜਾਂ ਦੱਖਤਾ ਗੁਣਕ ਵੱਖ ਕੀਤੇ ਬਿਨਾਂ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਹੀ ਰੱਖ ਦਿੰਦੀ ਹੈ।");
    case "PIECE_RATE_NOT_APPLIED":
      return pair(language, "यह विकल्प स्वीकृत उत्पादन और प्रति इकाई दर का गुणा नहीं करता।", "ਇਹ ਚੋਣ ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਅਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਦਰ ਦਾ ਗੁਣਾ ਨਹੀਂ ਕਰਦੀ।");
    case "BASELINE_OUTPUT_NOT_SUBTRACTED":
      return pair(language, "यह विकल्प लक्ष्य से अधिक उत्पादन के बजाय पूरा उत्पादन बोनस में गिनता है।", "ਇਹ ਚੋਣ ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ਦੀ ਥਾਂ ਪੂਰਾ ਉਤਪਾਦਨ ਬੋਨਸ ਵਿੱਚ ਗਿਣਦੀ ਹੈ।");
    case "DEFECTIVE_OUTPUT_NOT_DEDUCTED":
      return pair(language, "यह विकल्प अस्वीकृत या पुनःकार्य मात्रा को शुद्ध योगदान से नहीं घटाता।", "ਇਹ ਚੋਣ ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ ਮਾਤਰਾ ਨੂੰ ਸ਼ੁੱਧ ਯੋਗਦਾਨ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਉਂਦੀ।");
    case "PLAUSIBLE_SCALE_ERROR":
      return pair(language, "यह विकल्प सही अनुपात के बाद कुल राशि से गलत पैमाने पर गुणा या भाग करता है।", "ਇਹ ਚੋਣ ਸਹੀ ਅਨੁਪਾਤ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਰਕਮ ਨਾਲ ਗਲਤ ਪੈਮਾਨੇ ਉੱਤੇ ਗੁਣਾ ਜਾਂ ਭਾਗ ਕਰਦੀ ਹੈ।");
    case "CORRECT":
      return pair(language, "यह सही उत्तर है।", "ਇਹ ਸਹੀ ਉੱਤਰ ਹੈ।");
  }
}

export function tmwCp008LocalizedConclusion(
  source: TmwCp008GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  switch (source.solution.answerType) {
    case "RATIO":
      return pair(language, `अतः आवश्यक अनुपात ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ${answerText} ਹੈ।`);
    case "MONEY":
      return pair(language, `अतः देय राशि ${answerText} है।`, `ਇਸ ਲਈ ਦੇਣਯੋਗ ਰਕਮ ${answerText} ਹੈ।`);
    case "MONEY_TRIPLE":
      return pair(language, `अतः बताए गए क्रम में भुगतान ${answerText} हैं।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ ${answerText} ਹਨ।`);
    case "TIME":
      return pair(language, `अतः आवश्यक समय ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਮਾਂ ${answerText} ਹੈ।`);
    case "EFFICIENCY":
      return pair(language, `अतः आवश्यक प्रति घंटा दर ${answerText} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ${answerText} ਹੈ।`);
  }
}
