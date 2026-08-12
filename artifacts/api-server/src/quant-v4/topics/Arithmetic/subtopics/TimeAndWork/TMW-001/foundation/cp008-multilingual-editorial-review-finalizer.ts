import { add, divide, formatRational, multiply, subtract, toLatex } from "./rational";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp008Parameters, TmwCp008SolveMode } from "./cp008-types";
import type { Rational } from "./types";

type Language = "en" | "hi" | "pa";

interface Cp008Trap {
  optionLabel: string;
  optionText: string;
  misconceptionId: string;
  explanation: string;
}

interface Cp008Explanation {
  opening: string;
  formula: string;
  givens: string[];
  steps: string[];
  shortcut: { title: string; steps: string[] };
  commonTrap: Cp008Trap;
  conclusion: string;
}

interface Cp008Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: TmwCp008SolveMode | string;
  stem?: string;
  parameters?: TmwCp008Parameters;
  solution?: { answerValues: Rational[]; answerText: string; answerType?: string };
  explanation?: Cp008Explanation;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, en: string, hi: string, pa: string): string {
  return language === "hi" ? hi : language === "pa" ? pa : en;
}

function math(expression: string): string {
  return `\\(${expression}\\)`;
}

function value(x: Rational): string {
  return formatRational(x);
}

function contribution(role: TmwCp008Parameters["context"]["roles"][number]): Rational {
  return multiply(multiply(multiply(role.count, role.efficiency), role.days), role.hoursPerDay);
}

function sum(values: Rational[]): Rational {
  return values.reduce((total, current) => add(total, current), { numerator: 0, denominator: 1 });
}

function contributionVector(p: TmwCp008Parameters): [Rational, Rational, Rational] {
  if (p.contributionWeights) return p.contributionWeights;
  return p.context.roles.map(contribution) as [Rational, Rational, Rational];
}

function answerLine(mode: string, answer: string, language: Language, factorTarget?: string): string {
  switch (mode) {
    case "findPaymentRatioFromContributionFactors":
      return t(language, `Therefore, the payment ratio is ${answer}.`, `अतः भुगतान अनुपात ${answer} है।`, `ਇਸ ਲਈ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ${answer} ਹੈ।`);
    case "findTotalPaymentPoolFromKnownShare":
      return t(language, `Therefore, the total payment pool is ${answer}.`, `अतः कुल भुगतान राशि ${answer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ${answer} ਹੈ।`);
    case "findResidualPayment":
      return t(language, `Therefore, the remaining payment is ${answer}.`, `अतः शेष भुगतान ${answer} है।`, `ਇਸ ਲਈ ਬਾਕੀ ਭੁਗਤਾਨ ${answer} ਹੈ।`);
    case "findContributionFactorRatioFromPayments":
      if (factorTarget === "EFFICIENCY_RATIO") return t(language, `Therefore, the efficiency ratio is ${answer}.`, `अतः काम-दर का अनुपात ${answer} है।`, `ਇਸ ਲਈ ਕੰਮ-ਦਰ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`);
      return t(language, `Therefore, the work-time ratio is ${answer}.`, `अतः काम के दिनों का अनुपात ${answer} है।`, `ਇਸ ਲਈ ਕੰਮ ਦੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`);
    case "findMissingTimeFromPayment":
      return t(language, `Therefore, the required work duration is ${answer}.`, `अतः आवश्यक काम की अवधि ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ ਦੀ ਮਿਆਦ ${answer} ਹੈ।`);
    case "findMissingEfficiencyFromPayment":
      return t(language, `Therefore, the required work rate is ${answer}.`, `अतः आवश्यक काम-दर ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ ${answer} ਹੈ।`);
    case "findMixedCategoryPaymentDistribution":
      return t(language, `Therefore, the payments in the stated order are ${answer}.`, `अतः बताए गए क्रम में भुगतान ${answer} हैं।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ ${answer} ਹਨ।`);
    case "findPieceRatePaymentFromOutput":
      return t(language, `Therefore, the piece-rate payment due is ${answer}.`, `अतः देय पीस-रेट भुगतान ${answer} है।`, `ਇਸ ਲਈ ਦੇਣਯੋਗ ਪੀਸ-ਰੇਟ ਭੁਗਤਾਨ ${answer} ਹੈ।`);
    case "findBonusShareFromExtraContribution":
      return t(language, `Therefore, the bonus share is ${answer}.`, `अतः बोनस का हिस्सा ${answer} है।`, `ਇਸ ਲਈ ਬੋਨਸ ਦਾ ਹਿੱਸਾ ${answer} ਹੈ।`);
    case "findPaymentAfterSignedContribution":
      return t(language, `Therefore, the payment based on accepted net output is ${answer}.`, `अतः मान्य शुद्ध उत्पादन के आधार पर भुगतान ${answer} है।`, `ਇਸ ਲਈ ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਭੁਗਤਾਨ ${answer} ਹੈ।`);
    default:
      return t(language, `Therefore, the required payment is ${answer}.`, `अतः आवश्यक भुगतान ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਭੁਗਤਾਨ ${answer} ਹੈ।`);
  }
}

function methodFor(mode: string, language: Language): string {
  const methods: Record<string, [string, string, string]> = {
    findPaymentRatioFromContributionFactors: [
      "Compute each worker's contribution as rate × days × daily hours, then simplify the two contributions as a payment ratio",
      "हर व्यक्ति का योगदान काम-दर × दिन × प्रतिदिन घंटे से निकालें और दोनों योगदानों को सरल करके भुगतान अनुपात लिखें",
      "ਹਰ ਵਿਅਕਤੀ ਦਾ ਯੋਗਦਾਨ ਕੰਮ-ਦਰ × ਦਿਨ × ਹਰ ਰੋਜ਼ ਘੰਟੇ ਨਾਲ ਕੱਢੋ ਅਤੇ ਦੋਵੇਂ ਯੋਗਦਾਨ ਸਧਾਰ ਕੇ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਲਿਖੋ",
    ],
    findSelectedPartyPayment: [
      "Find all contributions, add them, and multiply the selected contribution share by the total payment",
      "सभी योगदान निकालकर जोड़ें और चुने गए व्यक्ति या समूह के योगदान वाले हिस्से को कुल भुगतान से गुणा करें",
      "ਸਾਰੇ ਯੋਗਦਾਨ ਕੱਢ ਕੇ ਜੋੜੋ ਅਤੇ ਚੁਣੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮੂਹ ਦੇ ਯੋਗਦਾਨ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਕੁੱਲ ਭੁਗਤਾਨ ਨਾਲ ਗੁਣਾ ਕਰੋ",
    ],
    findTotalPaymentPoolFromKnownShare: [
      "Use the stated contribution ratio to convert the known person's payment share back to the whole payment pool",
      "दिए गए योगदान अनुपात से ज्ञात व्यक्ति के भुगतान वाले हिस्से को पूरी भुगतान राशि में बदलें",
      "ਦਿੱਤੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਤੋਂ ਪਤਾ ਵਿਅਕਤੀ ਦੇ ਭੁਗਤਾਨ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਪੂਰੀ ਭੁਗਤਾਨ ਰਕਮ ਵਿੱਚ ਬਦਲੋ",
    ],
    findResidualPayment: [
      "Add the payments already made and subtract that sum from the fixed total amount",
      "पहले दिए गए भुगतानों को जोड़ें और उनका योग निर्धारित कुल राशि में से घटाएँ",
      "ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਜੋੜੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਨਿਰਧਾਰਤ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਘਟਾਓ",
    ],
    findPaymentAfterStagedParticipation: [
      "Compare only the actual participation of the workers; any equal daily-hours factor cancels from the contribution ratio",
      "केवल वास्तविक भागीदारी की तुलना करें; प्रतिदिन समान घंटे होने पर वह समान गुणक योगदान अनुपात से कट जाता है",
      "ਕੇਵਲ ਅਸਲ ਭਾਗੀਦਾਰੀ ਦੀ ਤੁਲਨਾ ਕਰੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਹੋਣ ਤੇ ਉਹ ਸਾਂਝਾ ਗੁਣਕ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਵਿੱਚੋਂ ਕੱਟ ਜਾਂਦਾ ਹੈ",
    ],
    findPaymentFromCompletedFractions: [
      "Use the verified fractions of total work directly as contribution shares of the payment",
      "सत्यापित कार्य-हिस्सों को सीधे भुगतान के योगदान-हिस्से मानकर राशि बाँटें",
      "ਤਸਦੀਕ ਕੀਤੇ ਕੰਮ-ਹਿੱਸਿਆਂ ਨੂੰ ਸਿੱਧਾ ਭੁਗਤਾਨ ਦੇ ਯੋਗਦਾਨ-ਹਿੱਸੇ ਮੰਨ ਕੇ ਰਕਮ ਵੰਡੋ",
    ],
    findContributionFactorRatioFromPayments: [
      "Payment ratio equals contribution ratio; cancel the known common factors and isolate the requested ratio",
      "भुगतान अनुपात योगदान अनुपात के बराबर है; ज्ञात समान गुणकों को काटकर माँगा गया अनुपात निकालें",
      "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ; ਪਤਾ ਸਾਂਝੇ ਗੁਣਕ ਕੱਟ ਕੇ ਮੰਗਿਆ ਅਨੁਪਾਤ ਕੱਢੋ",
    ],
    findMissingTimeFromPayment: [
      "Use the payment ratio and the two work rates; equal daily hours cancel, leaving the unknown number of days",
      "भुगतान अनुपात और दोनों काम-दरों का उपयोग करें; प्रतिदिन समान घंटे कट जाते हैं और अज्ञात दिनों की संख्या मिलती है",
      "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਅਤੇ ਦੋਵੇਂ ਕੰਮ-ਦਰਾਂ ਵਰਤੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ ਅਤੇ ਅਣਜਾਣ ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ",
    ],
    findMissingEfficiencyFromPayment: [
      "Use the payment ratio and the known work durations; equal daily hours cancel, leaving the unknown work rate",
      "भुगतान अनुपात और ज्ञात काम-अवधियों का उपयोग करें; प्रतिदिन समान घंटे कट जाते हैं और अज्ञात काम-दर मिलती है",
      "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਅਤੇ ਪਤਾ ਕੰਮ-ਮਿਆਦਾਂ ਵਰਤੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ ਅਤੇ ਅਣਜਾਣ ਕੰਮ-ਦਰ ਮਿਲਦੀ ਹੈ",
    ],
    findMixedCategoryPaymentDistribution: [
      "Because all three categories work for equal time, compare count × individual rate for each category and split the payment in that ratio",
      "तीनों श्रेणियाँ समान समय काम करती हैं, इसलिए हर श्रेणी के लिए संख्या × एक व्यक्ति की काम-दर लें और उसी अनुपात में भुगतान बाँटें",
      "ਤਿੰਨੋਂ ਸ਼੍ਰੇਣੀਆਂ ਇੱਕੋ ਸਮਾਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਹਰ ਸ਼੍ਰੇਣੀ ਲਈ ਗਿਣਤੀ × ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਕੰਮ-ਦਰ ਲਵੋ ਅਤੇ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਭੁਗਤਾਨ ਵੰਡੋ",
    ],
    findPieceRatePaymentFromOutput: [
      "Multiply only the accepted output by the stated payment per accepted unit",
      "केवल स्वीकृत उत्पादन को दी गई प्रति स्वीकृत इकाई दर से गुणा करें",
      "ਕੇਵਲ ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਨੂੰ ਦਿੱਤੀ ਪ੍ਰਤੀ ਮਨਜ਼ੂਰ ਇਕਾਈ ਦਰ ਨਾਲ ਗੁਣਾ ਕਰੋ",
    ],
    findBonusShareFromExtraContribution: [
      "Subtract each target from actual output, then split the bonus in the ratio of those extra outputs",
      "हर व्यक्ति के वास्तविक उत्पादन से उसका लक्ष्य घटाएँ और बोनस को इन अतिरिक्त उत्पादनों के अनुपात में बाँटें",
      "ਹਰ ਵਿਅਕਤੀ ਦੇ ਅਸਲ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਉਸ ਦਾ ਟੀਚਾ ਘਟਾਓ ਅਤੇ ਬੋਨਸ ਇਨ੍ਹਾਂ ਵਾਧੂ ਉਤਪਾਦਨਾਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ",
    ],
    findPaymentAfterSignedContribution: [
      "Deduct rejected or rework output from each recorded output, then split the payment by accepted net output",
      "हर दर्ज उत्पादन में से अस्वीकृत या पुनःकार्य घटाएँ और भुगतान को मान्य शुद्ध उत्पादन के अनुपात में बाँटें",
      "ਹਰ ਦਰਜ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ ਘਟਾਓ ਅਤੇ ਭੁਗਤਾਨ ਨੂੰ ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ",
    ],
  };
  const chosen = methods[mode] ?? methods.findSelectedPartyPayment;
  return t(language, chosen[0], chosen[1], chosen[2]);
}

function buildSteps(mode: string, p: TmwCp008Parameters, answer: string, language: Language): string[] {
  const roles = p.context.roles;
  const a = roles[0];
  const b = roles[1];
  const weights = contributionVector(p);
  const answerValues = [] as Rational[];
  const final = answerLine(mode, answer, language, p.factorTarget);

  switch (mode) {
    case "findPaymentRatioFromContributionFactors": {
      const ca = contribution(a), cb = contribution(b);
      return [
        t(language, `First contribution: ${math(`${toLatex(a.efficiency)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}=${toLatex(ca)}`)}.`, `पहला योगदान: ${math(`${toLatex(a.efficiency)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}=${toLatex(ca)}`)}।`, `ਪਹਿਲਾ ਯੋਗਦਾਨ: ${math(`${toLatex(a.efficiency)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}=${toLatex(ca)}`)}।`),
        t(language, `Second contribution: ${math(`${toLatex(b.efficiency)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}=${toLatex(cb)}`)}.`, `दूसरा योगदान: ${math(`${toLatex(b.efficiency)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}=${toLatex(cb)}`)}।`, `ਦੂਜਾ ਯੋਗਦਾਨ: ${math(`${toLatex(b.efficiency)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}=${toLatex(cb)}`)}।`),
        final,
      ];
    }
    case "findSelectedPartyPayment": {
      const all = weights;
      const total = sum(all);
      const selectedIndices = p.selectedIndices ?? [p.targetIndex ?? 0];
      const selectedWeights = selectedIndices.map(index => all[index]);
      const selectedTotal = sum(selectedWeights);
      const selectedExpression = selectedWeights.map(toLatex).join("+");
      const payment = multiply(p.totalPayment, divide(selectedTotal, total));
      return [
        t(language, `Contributions: ${math(`${toLatex(all[0])},\\ ${toLatex(all[1])},\\ ${toLatex(all[2])}`)}.`, `योगदान: ${math(`${toLatex(all[0])},\\ ${toLatex(all[1])},\\ ${toLatex(all[2])}`)}।`, `ਯੋਗਦਾਨ: ${math(`${toLatex(all[0])},\\ ${toLatex(all[1])},\\ ${toLatex(all[2])}`)}।`),
        t(language, `Total contribution: ${math(`${all.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `कुल योगदान: ${math(`${all.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਕੁੱਲ ਯੋਗਦਾਨ: ${math(`${all.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
        t(language, `Selected contribution: ${math(selectedWeights.length === 1 ? toLatex(selectedTotal) : `${selectedExpression}=${toLatex(selectedTotal)}`)}.`, `चुना गया योगदान: ${math(selectedWeights.length === 1 ? toLatex(selectedTotal) : `${selectedExpression}=${toLatex(selectedTotal)}`)}।`, `ਚੁਣਿਆ ਯੋਗਦਾਨ: ${math(selectedWeights.length === 1 ? toLatex(selectedTotal) : `${selectedExpression}=${toLatex(selectedTotal)}`)}।`),
        t(language, `Payment: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(selectedTotal)}}{${toLatex(total)}}=${toLatex(payment)}`)}.`, `भुगतान: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(selectedTotal)}}{${toLatex(total)}}=${toLatex(payment)}`)}।`, `ਭੁਗਤਾਨ: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(selectedTotal)}}{${toLatex(total)}}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    case "findTotalPaymentPoolFromKnownShare": {
      const total = sum(weights);
      const target = p.targetIndex ?? 0;
      const known = p.reportedPayments?.[target] ?? { numerator: 0, denominator: 1 };
      return [
        t(language, `Contribution-ratio total: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `योगदान अनुपात का कुल: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਦਾ ਕੁੱਲ: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
        t(language, `Known share is ${math(`\\frac{${toLatex(weights[target])}}{${toLatex(total)}}`)} of the total.`, `ज्ञात हिस्सा कुल राशि का ${math(`\\frac{${toLatex(weights[target])}}{${toLatex(total)}}`)} है।`, `ਪਤਾ ਹਿੱਸਾ ਕੁੱਲ ਰਕਮ ਦਾ ${math(`\\frac{${toLatex(weights[target])}}{${toLatex(total)}}`)} ਹੈ।`),
        t(language, `Total payment: ${math(`${toLatex(known)}\\times\\frac{${toLatex(total)}}{${toLatex(weights[target])}}=${toLatex(p.totalPayment)}`)}.`, `कुल भुगतान: ${math(`${toLatex(known)}\\times\\frac{${toLatex(total)}}{${toLatex(weights[target])}}=${toLatex(p.totalPayment)}`)}।`, `ਕੁੱਲ ਭੁਗਤਾਨ: ${math(`${toLatex(known)}\\times\\frac{${toLatex(total)}}{${toLatex(weights[target])}}=${toLatex(p.totalPayment)}`)}।`),
        final,
      ];
    }
    case "findResidualPayment": {
      const knownIndices = p.knownPaymentIndices ?? [];
      const known = knownIndices.map(index => p.reportedPayments?.[index] ?? { numerator: 0, denominator: 1 });
      const knownSum = sum(known);
      const residual = subtract(p.totalPayment, knownSum);
      return [
        t(language, `Payments already made: ${math(`${known.map(toLatex).join("+")}=${toLatex(knownSum)}`)}.`, `पहले दिए भुगतान: ${math(`${known.map(toLatex).join("+")}=${toLatex(knownSum)}`)}।`, `ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ: ${math(`${known.map(toLatex).join("+")}=${toLatex(knownSum)}`)}।`),
        t(language, `Remaining payment: ${math(`${toLatex(p.totalPayment)}-${toLatex(knownSum)}=${toLatex(residual)}`)}.`, `शेष भुगतान: ${math(`${toLatex(p.totalPayment)}-${toLatex(knownSum)}=${toLatex(residual)}`)}।`, `ਬਾਕੀ ਭੁਗਤਾਨ: ${math(`${toLatex(p.totalPayment)}-${toLatex(knownSum)}=${toLatex(residual)}`)}।`),
        final,
      ];
    }
    case "findPaymentAfterStagedParticipation": {
      const ca = multiply(a.efficiency, a.days), cb = multiply(b.efficiency, b.days);
      const total = add(ca, cb);
      const target = p.targetIndex ?? 0;
      const targetContribution = target === 0 ? ca : cb;
      const payment = multiply(p.totalPayment, divide(targetContribution, total));
      return [
        t(language, `After cancelling the common daily-hours factor, contributions are ${math(`${toLatex(ca)}:${toLatex(cb)}`)}.`, `प्रतिदिन समान घंटे काटने पर योगदान ${math(`${toLatex(ca)}:${toLatex(cb)}`)} हैं।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟਣ ਤੇ ਯੋਗਦਾਨ ${math(`${toLatex(ca)}:${toLatex(cb)}`)} ਹਨ।`),
        t(language, `Total contribution units: ${math(`${toLatex(ca)}+${toLatex(cb)}=${toLatex(total)}`)}.`, `कुल योगदान इकाइयाँ: ${math(`${toLatex(ca)}+${toLatex(cb)}=${toLatex(total)}`)}।`, `ਕੁੱਲ ਯੋਗਦਾਨ ਇਕਾਈਆਂ: ${math(`${toLatex(ca)}+${toLatex(cb)}=${toLatex(total)}`)}।`),
        t(language, `Required payment: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(targetContribution)}}{${toLatex(total)}}=${toLatex(payment)}`)}.`, `माँगा गया भुगतान: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(targetContribution)}}{${toLatex(total)}}=${toLatex(payment)}`)}।`, `ਮੰਗਿਆ ਭੁਗਤਾਨ: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(targetContribution)}}{${toLatex(total)}}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    case "findPaymentFromCompletedFractions": {
      const total = sum(weights), target = p.targetIndex ?? 0;
      const payment = multiply(p.totalPayment, divide(weights[target], total));
      return [
        t(language, `Verified work fractions total ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `सत्यापित कार्य-हिस्सों का योग ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)} है।`, `ਤਸਦੀਕ ਕੀਤੇ ਕੰਮ-ਹਿੱਸਿਆਂ ਦਾ ਜੋੜ ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)} ਹੈ।`),
        t(language, `Required work fraction: ${math(toLatex(weights[target]))}.`, `माँगा गया कार्य-हिस्सा: ${math(toLatex(weights[target]))}।`, `ਮੰਗਿਆ ਕੰਮ-ਹਿੱਸਾ: ${math(toLatex(weights[target]))}।`),
        t(language, `Payment: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}.`, `भुगतान: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`, `ਭੁਗਤਾਨ: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(weights[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    case "findContributionFactorRatioFromPayments": {
      const pa = p.reportedPayments?.[0] ?? { numerator: 0, denominator: 1 };
      const pb = p.reportedPayments?.[1] ?? { numerator: 0, denominator: 1 };
      const requestedA = p.factorTarget === "EFFICIENCY_RATIO" ? multiply(pa, b.days) : multiply(pa, b.efficiency);
      const requestedB = p.factorTarget === "EFFICIENCY_RATIO" ? multiply(pb, a.days) : multiply(pb, a.efficiency);
      return [
        t(language, `Payment ratio: ${math(`${toLatex(pa)}:${toLatex(pb)}`)}.`, `भुगतान अनुपात: ${math(`${toLatex(pa)}:${toLatex(pb)}`)}।`, `ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ${math(`${toLatex(pa)}:${toLatex(pb)}`)}।`),
        t(language, `After cancelling the common factor, the requested ratio is ${math(`${toLatex(requestedA)}:${toLatex(requestedB)}`)}.`, `समान गुणक काटने पर माँगा गया अनुपात ${math(`${toLatex(requestedA)}:${toLatex(requestedB)}`)} है।`, `ਸਾਂਝਾ ਗੁਣਕ ਕੱਟਣ ਤੇ ਮੰਗਿਆ ਅਨੁਪਾਤ ${math(`${toLatex(requestedA)}:${toLatex(requestedB)}`)} ਹੈ।`),
        final,
      ];
    }
    case "findMissingTimeFromPayment": {
      const target = p.targetIndex ?? 0, known = target === 0 ? 1 : 0;
      const px = p.reportedPayments?.[target] ?? { numerator: 0, denominator: 1 };
      const pk = p.reportedPayments?.[known] ?? { numerator: 0, denominator: 1 };
      const days = divide(multiply(multiply(px, roles[known].efficiency), roles[known].days), multiply(pk, roles[target].efficiency));
      return [
        t(language, `Payment ratio: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}.`, `भुगतान अनुपात: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}।`, `ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}।`),
        t(language, `Equal daily hours cancel, so required days ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].efficiency)}}=${toLatex(days)}`)}.`, `प्रतिदिन समान घंटे कट जाते हैं, इसलिए आवश्यक दिन ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].efficiency)}}=${toLatex(days)}`)}।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਲੋੜੀਂਦੇ ਦਿਨ ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].efficiency)}}=${toLatex(days)}`)}।`),
        final,
      ];
    }
    case "findMissingEfficiencyFromPayment": {
      const target = p.targetIndex ?? 0, known = target === 0 ? 1 : 0;
      const px = p.reportedPayments?.[target] ?? { numerator: 0, denominator: 1 };
      const pk = p.reportedPayments?.[known] ?? { numerator: 0, denominator: 1 };
      const rate = divide(multiply(multiply(px, roles[known].efficiency), roles[known].days), multiply(pk, roles[target].days));
      return [
        t(language, `Payment ratio: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}.`, `भुगतान अनुपात: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}।`, `ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ${math(`\\frac{${toLatex(px)}}{${toLatex(pk)}}`)}।`),
        t(language, `Equal daily hours cancel, so required work rate ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].days)}}=${toLatex(rate)}`)}.`, `प्रतिदिन समान घंटे कट जाते हैं, इसलिए आवश्यक काम-दर ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].days)}}=${toLatex(rate)}`)}।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ ${math(`=\\frac{${toLatex(px)}\\times${toLatex(roles[known].efficiency)}\\times${toLatex(roles[known].days)}}{${toLatex(pk)}\\times${toLatex(roles[target].days)}}=${toLatex(rate)}`)}।`),
        final,
      ];
    }
    case "findMixedCategoryPaymentDistribution": {
      const categoryWeights = roles.map(role => multiply(role.count, role.efficiency)) as [Rational, Rational, Rational];
      const total = sum(categoryWeights);
      return [
        t(language, `Equal time cancels; category contributions are ${math(`${toLatex(categoryWeights[0])},\\ ${toLatex(categoryWeights[1])},\\ ${toLatex(categoryWeights[2])}`)}.`, `समान समय कट जाता है; श्रेणी-योगदान ${math(`${toLatex(categoryWeights[0])},\\ ${toLatex(categoryWeights[1])},\\ ${toLatex(categoryWeights[2])}`)} हैं।`, `ਇੱਕੋ ਸਮਾਂ ਕੱਟ ਜਾਂਦਾ ਹੈ; ਸ਼੍ਰੇਣੀ-ਯੋਗਦਾਨ ${math(`${toLatex(categoryWeights[0])},\\ ${toLatex(categoryWeights[1])},\\ ${toLatex(categoryWeights[2])}`)} ਹਨ।`),
        t(language, `Contribution total: ${math(`${categoryWeights.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `योगदान का कुल: ${math(`${categoryWeights.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਯੋਗਦਾਨ ਦਾ ਕੁੱਲ: ${math(`${categoryWeights.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
        ...p.solutionAnswerValues?.map(() => "") ?? [],
        final,
      ].filter(Boolean);
    }
    case "findPieceRatePaymentFromOutput": {
      const output = roles[0].output;
      const rate = p.pieceRate ?? { numerator: 0, denominator: 1 };
      const payment = multiply(output, rate);
      return [
        t(language, `Accepted output: ${math(toLatex(output))}.`, `स्वीकृत उत्पादन: ${math(toLatex(output))}।`, `ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ: ${math(toLatex(output))}।`),
        t(language, `Payment per accepted unit: ${math(toLatex(rate))}.`, `प्रति स्वीकृत इकाई भुगतान: ${math(toLatex(rate))}।`, `ਪ੍ਰਤੀ ਮਨਜ਼ੂਰ ਇਕਾਈ ਭੁਗਤਾਨ: ${math(toLatex(rate))}।`),
        t(language, `Payment: ${math(`${toLatex(output)}\\times${toLatex(rate)}=${toLatex(payment)}`)}.`, `भुगतान: ${math(`${toLatex(output)}\\times${toLatex(rate)}=${toLatex(payment)}`)}।`, `ਭੁਗਤਾਨ: ${math(`${toLatex(output)}\\times${toLatex(rate)}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    case "findBonusShareFromExtraContribution": {
      const extras = roles.map(role => subtract(role.output, role.baselineOutput)) as [Rational, Rational, Rational];
      const total = sum(extras), target = p.targetIndex ?? 0;
      const bonus = p.bonusPool ?? p.totalPayment;
      const payment = multiply(bonus, divide(extras[target], total));
      return [
        t(language, `Extra outputs: ${math(`${toLatex(extras[0])},\\ ${toLatex(extras[1])},\\ ${toLatex(extras[2])}`)}.`, `लक्ष्य से अधिक उत्पादन: ${math(`${toLatex(extras[0])},\\ ${toLatex(extras[1])},\\ ${toLatex(extras[2])}`)}।`, `ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ: ${math(`${toLatex(extras[0])},\\ ${toLatex(extras[1])},\\ ${toLatex(extras[2])}`)}।`),
        t(language, `Total extra output: ${math(`${extras.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `कुल अतिरिक्त उत्पादन: ${math(`${extras.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਕੁੱਲ ਵਾਧੂ ਉਤਪਾਦਨ: ${math(`${extras.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
        t(language, `Bonus share: ${math(`${toLatex(bonus)}\\times\\frac{${toLatex(extras[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}.`, `बोनस का हिस्सा: ${math(`${toLatex(bonus)}\\times\\frac{${toLatex(extras[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`, `ਬੋਨਸ ਦਾ ਹਿੱਸਾ: ${math(`${toLatex(bonus)}\\times\\frac{${toLatex(extras[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    case "findPaymentAfterSignedContribution": {
      const net = roles.map(role => subtract(role.output, role.defectiveOutput)) as [Rational, Rational, Rational];
      const total = sum(net), target = p.targetIndex ?? 0;
      const payment = multiply(p.totalPayment, divide(net[target], total));
      return [
        t(language, `Accepted net outputs: ${math(`${toLatex(net[0])},\\ ${toLatex(net[1])},\\ ${toLatex(net[2])}`)}.`, `मान्य शुद्ध उत्पादन: ${math(`${toLatex(net[0])},\\ ${toLatex(net[1])},\\ ${toLatex(net[2])}`)}।`, `ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ: ${math(`${toLatex(net[0])},\\ ${toLatex(net[1])},\\ ${toLatex(net[2])}`)}।`),
        t(language, `Net-output total: ${math(`${net.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `शुद्ध उत्पादन का कुल: ${math(`${net.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦਾ ਕੁੱਲ: ${math(`${net.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
        t(language, `Payment: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(net[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}.`, `भुगतान: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(net[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`, `ਭੁਗਤਾਨ: ${math(`${toLatex(p.totalPayment)}\\times\\frac{${toLatex(net[target])}}{${toLatex(total)}}=${toLatex(payment)}`)}।`),
        final,
      ];
    }
    default:
      return [final];
  }
}

function fixStem(stem: string, language: Language): string {
  if (language === "hi") {
    return stem
      .replace(/रंगाई का ठेका के लिए/g, "रंगाई के ठेके के लिए")
      .replace(/पुर्जा-असेंबली ऑर्डर के लिए/g, "पुर्जा-असेंबली ऑर्डर के लिए")
      .replace(/योगदान अभिलेख/g, "काम का विवरण")
      .replace(/दक्षता (\d+(?:\/\d+)? (?:वर्ग मीटर|पुर्ज़े|फाइलें|पैकेज) प्रति घंटा)/g, "काम-दर $1");
  }
  if (language === "pa") {
    return stem
      .replace(/ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/g, "ਰੰਗਾਈ ਦੇ ਠੇਕੇ ਲਈ")
      .replace(/ਯੋਗਦਾਨ ਰਿਕਾਰਡ/g, "ਕੰਮ ਦਾ ਵੇਰਵਾ")
      .replace(/ਦੱਖਤਾ (\d+(?:\/\d+)? (?:ਵਰਗ ਮੀਟਰ|ਪੁਰਜ਼ੇ|ਫਾਈਲਾਂ|ਪੈਕੇਜ) ਪ੍ਰਤੀ ਘੰਟਾ)/g, "ਕੰਮ-ਦਰ $1");
  }
  return stem.replace(/contribution record/gi, "work record");
}

function fixTrap(trap: Cp008Trap, mode: string, language: Language): Cp008Trap {
  if (trap.misconceptionId !== "TOTAL_REPORTED_AS_SHARE" || mode === "findTotalPaymentPoolFromKnownShare") return trap;
  return {
    ...trap,
    explanation: t(
      language,
      "This option uses the whole payment or bonus pool, but the question asks only for the selected worker's or group's share.",
      "इस विकल्प में पूरी भुगतान या बोनस राशि ले ली गई है, जबकि प्रश्न केवल चुने गए व्यक्ति या समूह का हिस्सा पूछता है।",
      "ਇਸ ਚੋਣ ਵਿੱਚ ਪੂਰੀ ਭੁਗਤਾਨ ਜਾਂ ਬੋਨਸ ਰਕਮ ਲੈ ਲਈ ਗਈ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਕੇਵਲ ਚੁਣੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮੂਹ ਦਾ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।",
    ),
  };
}

export function finalizeTmwCp008MultilingualEditorialReview<T extends Cp008Question>(
  question: T,
  language: Language,
): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-008" || !question.parameters || !question.solution) return question;
  const mode = String(question.solveMode ?? "");
  const stem = fixStem(question.stem ?? "", language);
  const finalAnswer = answerLine(mode, question.solution.answerText, language, question.parameters.factorTarget);
  let learnerSolution = buildSteps(mode, question.parameters, question.solution.answerText, language);

  if (mode === "findMixedCategoryPaymentDistribution") {
    const roles = question.parameters.context.roles;
    const weights = roles.map(role => multiply(role.count, role.efficiency)) as [Rational, Rational, Rational];
    const total = sum(weights);
    const payments = question.solution.answerValues;
    learnerSolution = [
      t(language, `Equal time cancels; category contributions are ${math(`${toLatex(weights[0])},\\ ${toLatex(weights[1])},\\ ${toLatex(weights[2])}`)}.`, `समान समय कट जाता है; श्रेणी-योगदान ${math(`${toLatex(weights[0])},\\ ${toLatex(weights[1])},\\ ${toLatex(weights[2])}`)} हैं।`, `ਇੱਕੋ ਸਮਾਂ ਕੱਟ ਜਾਂਦਾ ਹੈ; ਸ਼੍ਰੇਣੀ-ਯੋਗਦਾਨ ${math(`${toLatex(weights[0])},\\ ${toLatex(weights[1])},\\ ${toLatex(weights[2])}`)} ਹਨ।`),
      t(language, `Contribution total: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}.`, `योगदान का कुल: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}।`, `ਯੋਗਦਾਨ ਦਾ ਕੁੱਲ: ${math(`${weights.map(toLatex).join("+")}=${toLatex(total)}`)}।`),
      t(language, `Payments: ${math(`${toLatex(payments[0])},\\ ${toLatex(payments[1])},\\ ${toLatex(payments[2])}`)}.`, `भुगतान: ${math(`${toLatex(payments[0])},\\ ${toLatex(payments[1])},\\ ${toLatex(payments[2])}`)}।`, `ਭੁਗਤਾਨ: ${math(`${toLatex(payments[0])},\\ ${toLatex(payments[1])},\\ ${toLatex(payments[2])}`)}।`),
      finalAnswer,
    ];
  }

  const learnerExplanation: TmwLearnerExplanationV2 = {
    method: methodFor(mode, language),
    solution: learnerSolution,
    answer: finalAnswer,
  };
  const learnerErrors = validateTmwLearnerExplanationV2(learnerExplanation);

  const explanation = question.explanation ? {
    ...question.explanation,
    steps: learnerSolution.slice(0, -1),
    commonTrap: fixTrap(question.explanation.commonTrap, mode, language),
    conclusion: finalAnswer,
  } : question.explanation;

  const errors = [...(question.validation?.errors ?? [])];
  const combinedText = [stem, learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer, ...(explanation?.steps ?? []), explanation?.commonTrap?.explanation ?? ""].join(" ");
  if (language !== "en" && /Target fraction|accepted components|accepted square metres|per accepted unit|square metres per|components per/i.test(combinedText)) {
    errors.push("CP008 multilingual editorial review: untranslated English learner fragment remains");
  }
  if (/[\u0000-\u001F\u007F]/u.test(combinedText)) errors.push("CP008 multilingual editorial review: control character remains in learner text");
  if (/रंगाई का ठेका के लिए|ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/u.test(stem)) errors.push("CP008 multilingual editorial review: contract postposition grammar remains");
  if (mode !== "findTotalPaymentPoolFromKnownShare" && explanation?.commonTrap?.misconceptionId === "TOTAL_REPORTED_AS_SHARE" && /प्रश्न कुल भुगतान राशि पूछता है|ਪ੍ਰਸ਼ਨ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ਪੁੱਛਦਾ ਹੈ/u.test(explanation.commonTrap.explanation)) {
    errors.push("CP008 multilingual editorial review: total-payment trap misstates the question target");
  }
  errors.push(...learnerErrors.map(error => `CP008 multilingual editorial review: ${error}`));

  return {
    ...question,
    stem,
    learnerExplanation,
    explanation,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
