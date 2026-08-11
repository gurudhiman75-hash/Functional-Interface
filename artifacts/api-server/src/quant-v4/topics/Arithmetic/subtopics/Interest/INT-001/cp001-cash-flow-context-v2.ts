import { asRecord } from "./cp001-localization-foundation";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import type { IntCp001CashFlowContext } from "./cp001-cash-flow-direction";

const BORROWER_SCENARIOS = new Set([
  "BUSINESS_ADVANCE",
  "COMMUNITY_LOAN",
  "CROP_LOAN",
  "EDUCATION_LOAN",
  "EQUIPMENT_LOAN",
  "PERSONAL_AGREEMENT",
  "PERSONAL_LENDING",
]);

const INVESTMENT_SCENARIOS = new Set([
  "FIXED_DEPOSIT",
  "POST_OFFICE",
  "POST_OFFICE_DEPOSIT",
  "SAVINGS_CERTIFICATE",
  "GENERIC",
]);

const NEUTRAL_SCENARIOS = new Set([
  "NEUTRAL",
  "PLAIN_SUM",
  "GENERIC_SUM",
]);

const ACTOR_NAMES: Record<IntCp001Locale, Record<string, string>> = {
  hi: {
    Meera: "मीरा", Harpreet: "हरप्रीत", Aman: "अमन", Gurleen: "गुरलीन",
    Ravi: "रवि", Simran: "सिमरन", Navdeep: "नवदीप", Kiran: "किरण",
  },
  pa: {
    Meera: "ਮੀਰਾ", Harpreet: "ਹਰਪ੍ਰੀਤ", Aman: "ਅਮਨ", Gurleen: "ਗੁਰਲੀਨ",
    Ravi: "ਰਵੀ", Simran: "ਸਿਮਰਨ", Navdeep: "ਨਵਦੀਪ", Kiran: "ਕਿਰਨ",
  },
};

function contextRecord(sourceParameters: unknown) {
  const parameters = asRecord(sourceParameters);
  return asRecord(parameters?.context);
}

function actorName(sourceParameters: unknown, locale: IntCp001Locale): string {
  const context = contextRecord(sourceParameters);
  const actor = typeof context?.actor === "string" ? context.actor : undefined;
  if (actor && ACTOR_NAMES[locale][actor]) return ACTOR_NAMES[locale][actor]!;
  return locale === "hi" ? "एक व्यक्ति" : "ਇੱਕ ਵਿਅਕਤੀ";
}

export function getIntCp001CashFlowContextV2(sourceParameters: unknown): IntCp001CashFlowContext {
  const context = contextRecord(sourceParameters);
  const scenarioId = typeof context?.scenarioId === "string" ? context.scenarioId : "GENERIC";

  if (BORROWER_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "BORROWER_PAYS" };
  if (NEUTRAL_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "NEUTRAL_MATH" };
  if (INVESTMENT_SCENARIOS.has(scenarioId)) return { scenarioId, direction: "INVESTOR_EARNS" };

  // Unknown source scenarios remain neutral until explicitly classified.
  return { scenarioId, direction: "NEUTRAL_MATH" };
}

function correctedLead(
  sourceParameters: unknown,
  locale: IntCp001Locale,
  scenarioId: string,
): string | undefined {
  const actor = actorName(sourceParameters, locale);

  if (locale === "hi") {
    const leads: Record<string, string> = {
      BUSINESS_ADVANCE: `${actor} ने स्थानीय वित्त कार्यालय से कार्यशील पूंजी के लिए व्यावसायिक अग्रिम ऋण लिया है`,
      COMMUNITY_LOAN: `${actor} ने सामुदायिक ऋण समूह से सदस्य ऋण लिया है`,
      PERSONAL_LENDING: `${actor} ने निजी ऋण समझौते के तहत ऋण लिया है`,
      POST_OFFICE_DEPOSIT: `${actor} ने डाकघर में मियादी जमा की है`,
    };
    return leads[scenarioId];
  }

  const leads: Record<string, string> = {
    BUSINESS_ADVANCE: `${actor} ਨੇ ਸਥਾਨਕ ਵਿੱਤ ਦਫ਼ਤਰ ਤੋਂ ਕਾਰੋਬਾਰ ਲਈ ਅਗਾਊਂ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`,
    COMMUNITY_LOAN: `${actor} ਨੇ ਸਥਾਨਕ ਕਰਜ਼ਾ ਸਮੂਹ ਤੋਂ ਮੈਂਬਰ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`,
    PERSONAL_LENDING: `${actor} ਨੇ ਨਿੱਜੀ ਕਰਜ਼ਾ ਸਮਝੌਤੇ ਤਹਿਤ ਕਰਜ਼ਾ ਲਿਆ ਹੈ`,
    POST_OFFICE_DEPOSIT: `${actor} ਨੇ ਡਾਕਘਰ ਵਿੱਚ ਮਿਆਦੀ ਜਮ੍ਹਾ ਕਰਵਾਈ ਹੈ`,
  };
  return leads[scenarioId];
}

export function alignIntCp001ContextLeadV2(
  stem: string,
  sourceParameters: unknown,
  locale: IntCp001Locale,
  scenarioId: string,
): string {
  const lead = correctedLead(sourceParameters, locale, scenarioId);
  if (!lead) return stem;
  const delimiter = stem.indexOf("।");
  if (delimiter < 0) return stem;
  return `${lead}${stem.slice(delimiter)}`;
}

export function validateIntCp001ContextLeadV2(
  stem: string,
  locale: IntCp001Locale,
  cashFlow: IntCp001CashFlowContext,
): string[] {
  const errors: string[] = [];
  const firstSentence = stem.split("।", 1)[0] ?? stem;

  if (cashFlow.direction === "BORROWER_PAYS") {
    const investmentLead = locale === "hi"
      ? /(?:निवेश|सावधि जमा|मियादी जमा|धन जमा|बचत प्रमाणपत्र)/u
      : /(?:ਨਿਵੇਸ਼|ਮਿਆਦੀ ਜਮ੍ਹਾ|ਰਕਮ ਜਮ੍ਹਾ|ਬਚਤ ਸਰਟੀਫਿਕੇਟ)/u;
    const borrowerLead = locale === "hi"
      ? /(?:ऋण|उधार|कर्ज़)/u
      : /(?:ਕਰਜ਼|ਉਧਾਰ)/u;
    if (investmentLead.test(firstSentence)) errors.push("Borrowing scenario uses an investment/deposit opening.");
    if (!borrowerLead.test(firstSentence)) errors.push("Borrowing scenario lacks an explicit loan opening.");
  }

  if (cashFlow.direction === "INVESTOR_EARNS") {
    const loanLead = locale === "hi"
      ? /(?:ऋण लिया|उधार लिया|कर्ज़ लिया)/u
      : /(?:ਕਰਜ਼[^।]*ਲਿਆ|ਉਧਾਰ ਲਿਆ)/u;
    const investmentLead = locale === "hi"
      ? /(?:निवेश|जमा|बचत प्रमाणपत्र)/u
      : /(?:ਨਿਵੇਸ਼|ਜਮ੍ਹਾ|ਬਚਤ ਸਰਟੀਫਿਕੇਟ)/u;
    if (loanLead.test(firstSentence)) errors.push("Investment scenario uses a loan-taking opening.");
    if (!investmentLead.test(firstSentence)) errors.push("Investment scenario lacks an investment/deposit opening.");
  }

  if (cashFlow.direction === "NEUTRAL_MATH") {
    const directionalLead = locale === "hi"
      ? /(?:ऋण लिया|उधार लिया|कर्ज़ लिया|निवेश|जमा)/u
      : /(?:ਕਰਜ਼|ਉਧਾਰ ਲਿਆ|ਨਿਵੇਸ਼|ਜਮ੍ਹਾ)/u;
    if (directionalLead.test(firstSentence)) errors.push("Neutral scenario uses a directional financial opening.");
  }

  return errors;
}
