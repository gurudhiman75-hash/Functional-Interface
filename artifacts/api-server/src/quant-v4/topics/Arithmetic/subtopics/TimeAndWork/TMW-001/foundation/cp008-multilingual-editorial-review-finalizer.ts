import { add, divide, multiply, subtract, toLatex } from "./rational";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import type { TmwCp008Parameters, TmwCp008SolveMode } from "./cp008-types";
import type { Rational } from "./types";

type Language = "en" | "hi" | "pa";
type Triplet = readonly [string, string, string];

interface Cp008Trap { optionLabel: string; optionText: string; misconceptionId: string; explanation: string }
interface Cp008Explanation {
  opening: string;
  formula: string;
  givens: string[];
  steps: string[];
  shortcut: { title: string; steps: string[] };
  commonTrap: Cp008Trap;
  conclusion: string;
}
interface Cp008Solution { answerValues: Rational[]; answerText: string; answerType?: string }
interface Cp008Question {
  canonicalProblemId?: string;
  cpId?: string;
  questionLanguageId?: string;
  solveMode?: TmwCp008SolveMode | string;
  stem?: string;
  parameters?: TmwCp008Parameters;
  solution?: Cp008Solution;
  explanation?: Cp008Explanation;
  learnerExplanation?: TmwLearnerExplanationV2;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}

function t(language: Language, text: Triplet): string { return language === "hi" ? text[1] : language === "pa" ? text[2] : text[0]; }
function math(expression: string): string { return `\\(${expression}\\)`; }
function zero(): Rational { return { numerator: 0, denominator: 1 }; }
function sum(values: Rational[]): Rational { return values.reduce((total, current) => add(total, current), zero()); }
function contribution(role: TmwCp008Parameters["context"]["roles"][number]): Rational {
  return multiply(multiply(multiply(role.count, role.efficiency), role.days), role.hoursPerDay);
}
function weights(p: TmwCp008Parameters): [Rational, Rational, Rational] {
  return p.contributionWeights ?? p.context.roles.map(contribution) as [Rational, Rational, Rational];
}
function labeled(language: Language, label: Triplet, expression: string): string {
  const punctuation = language === "en" ? "." : "।";
  return `${t(language, label)}: ${math(expression)}${punctuation}`;
}

const METHODS: Record<string, Triplet> = {
  findPaymentRatioFromContributionFactors: [
    "Compute each contribution as work rate × days × daily hours, then simplify the contribution ratio",
    "हर व्यक्ति का योगदान काम-दर × दिन × प्रतिदिन घंटे से निकालें और योगदान अनुपात को सरल करें",
    "ਹਰ ਵਿਅਕਤੀ ਦਾ ਯੋਗਦਾਨ ਕੰਮ-ਦਰ × ਦਿਨ × ਹਰ ਰੋਜ਼ ਘੰਟੇ ਨਾਲ ਕੱਢੋ ਅਤੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਸਧਾਰੋ",
  ],
  findSelectedPartyPayment: [
    "Find all contributions, add them, and multiply the selected contribution share by the total payment",
    "सभी योगदान निकालकर जोड़ें और चुने गए योगदान वाले हिस्से को कुल भुगतान से गुणा करें",
    "ਸਾਰੇ ਯੋਗਦਾਨ ਕੱਢ ਕੇ ਜੋੜੋ ਅਤੇ ਚੁਣੇ ਯੋਗਦਾਨ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਕੁੱਲ ਭੁਗਤਾਨ ਨਾਲ ਗੁਣਾ ਕਰੋ",
  ],
  findTotalPaymentPoolFromKnownShare: [
    "Use the stated contribution ratio and the known payment share to recover the whole payment pool",
    "दिए गए योगदान अनुपात और ज्ञात भुगतान हिस्से से पूरी भुगतान राशि निकालें",
    "ਦਿੱਤੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਅਤੇ ਪਤਾ ਭੁਗਤਾਨ ਹਿੱਸੇ ਤੋਂ ਪੂਰੀ ਭੁਗਤਾਨ ਰਕਮ ਕੱਢੋ",
  ],
  findResidualPayment: [
    "Add the payments already made and subtract that sum from the fixed total",
    "पहले दिए गए भुगतान जोड़ें और उनका योग निर्धारित कुल राशि से घटाएँ",
    "ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਜੋੜੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ ਨਿਰਧਾਰਤ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਘਟਾਓ",
  ],
  findPaymentAfterStagedParticipation: [
    "Use only actual participation; any equal daily-hours factor cancels from the contribution ratio",
    "केवल वास्तविक भागीदारी लें; प्रतिदिन समान घंटे योगदान अनुपात से कट जाते हैं",
    "ਕੇਵਲ ਅਸਲ ਭਾਗੀਦਾਰੀ ਲਵੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਵਿੱਚੋਂ ਕੱਟ ਜਾਂਦੇ ਹਨ",
  ],
  findPaymentFromCompletedFractions: [
    "Use the verified fractions of completed work directly as payment shares",
    "सत्यापित कार्य-हिस्सों को सीधे भुगतान के हिस्से मानें",
    "ਤਸਦੀਕ ਕੀਤੇ ਕੰਮ-ਹਿੱਸਿਆਂ ਨੂੰ ਸਿੱਧਾ ਭੁਗਤਾਨ ਦੇ ਹਿੱਸੇ ਮੰਨੋ",
  ],
  findContributionFactorRatioFromPayments: [
    "Payment ratio equals contribution ratio; cancel the known factors and isolate the requested ratio",
    "भुगतान अनुपात योगदान अनुपात के बराबर है; ज्ञात गुणकों को काटकर माँगा गया अनुपात निकालें",
    "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ; ਪਤਾ ਗੁਣਕ ਕੱਟ ਕੇ ਮੰਗਿਆ ਅਨੁਪਾਤ ਕੱਢੋ",
  ],
  findMissingTimeFromPayment: [
    "Use payment ratio and work rates; equal daily hours cancel, leaving the unknown work duration",
    "भुगतान अनुपात और काम-दरों का उपयोग करें; प्रतिदिन समान घंटे कट जाते हैं और अज्ञात काम-अवधि मिलती है",
    "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਅਤੇ ਕੰਮ-ਦਰਾਂ ਵਰਤੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ ਅਤੇ ਅਣਜਾਣ ਕੰਮ-ਮਿਆਦ ਮਿਲਦੀ ਹੈ",
  ],
  findMissingEfficiencyFromPayment: [
    "Use payment ratio and work durations; equal daily hours cancel, leaving the unknown work rate",
    "भुगतान अनुपात और काम-अवधियों का उपयोग करें; प्रतिदिन समान घंटे कट जाते हैं और अज्ञात काम-दर मिलती है",
    "ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਅਤੇ ਕੰਮ-ਮਿਆਦਾਂ ਵਰਤੋ; ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ ਅਤੇ ਅਣਜਾਣ ਕੰਮ-ਦਰ ਮਿਲਦੀ ਹੈ",
  ],
  findMixedCategoryPaymentDistribution: [
    "Because all categories work for equal time, compare count × individual rate and split the payment in that ratio",
    "सभी श्रेणियाँ समान समय काम करती हैं, इसलिए संख्या × एक व्यक्ति की काम-दर की तुलना करके भुगतान बाँटें",
    "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਇੱਕੋ ਸਮਾਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਗਿਣਤੀ × ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਕੰਮ-ਦਰ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਭੁਗਤਾਨ ਵੰਡੋ",
  ],
  findPieceRatePaymentFromOutput: [
    "Multiply accepted output by the payment per accepted unit",
    "स्वीकृत उत्पादन को प्रति स्वीकृत इकाई भुगतान से गुणा करें",
    "ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਨੂੰ ਪ੍ਰਤੀ ਮਨਜ਼ੂਰ ਇਕਾਈ ਭੁਗਤਾਨ ਨਾਲ ਗੁਣਾ ਕਰੋ",
  ],
  findBonusShareFromExtraContribution: [
    "Subtract each target from actual output, then split the bonus by extra output",
    "हर वास्तविक उत्पादन से उसका लक्ष्य घटाएँ और बोनस को अतिरिक्त उत्पादन के अनुपात में बाँटें",
    "ਹਰ ਅਸਲ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਉਸ ਦਾ ਟੀਚਾ ਘਟਾਓ ਅਤੇ ਬੋਨਸ ਵਾਧੂ ਉਤਪਾਦਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ",
  ],
  findPaymentAfterSignedContribution: [
    "Deduct rejected or rework output from recorded output, then split payment by accepted net output",
    "दर्ज उत्पादन से अस्वीकृत या पुनःकार्य घटाएँ और भुगतान को मान्य शुद्ध उत्पादन के अनुपात में बाँटें",
    "ਦਰਜ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ ਘਟਾਓ ਅਤੇ ਭੁਗਤਾਨ ਨੂੰ ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ",
  ],
};

function answerLine(mode: string, answer: string, language: Language, factorTarget?: string): string {
  const map: Record<string, Triplet> = {
    findPaymentRatioFromContributionFactors: [`Therefore, the payment ratio is ${answer}.`, `अतः भुगतान अनुपात ${answer} है।`, `ਇਸ ਲਈ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ${answer} ਹੈ।`],
    findTotalPaymentPoolFromKnownShare: [`Therefore, the total payment is ${answer}.`, `अतः कुल भुगतान राशि ${answer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ${answer} ਹੈ।`],
    findResidualPayment: [`Therefore, the remaining payment is ${answer}.`, `अतः शेष भुगतान ${answer} है।`, `ਇਸ ਲਈ ਬਾਕੀ ਭੁਗਤਾਨ ${answer} ਹੈ।`],
    findMissingTimeFromPayment: [`Therefore, the required work duration is ${answer}.`, `अतः आवश्यक काम की अवधि ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ ਦੀ ਮਿਆਦ ${answer} ਹੈ।`],
    findMissingEfficiencyFromPayment: [`Therefore, the required work rate is ${answer}.`, `अतः आवश्यक काम-दर ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ-ਦਰ ${answer} ਹੈ।`],
    findMixedCategoryPaymentDistribution: [`Therefore, the payments in the stated order are ${answer}.`, `अतः बताए गए क्रम में भुगतान ${answer} हैं।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ ${answer} ਹਨ।`],
    findPieceRatePaymentFromOutput: [`Therefore, the piece-rate payment is ${answer}.`, `अतः देय पीस-रेट भुगतान ${answer} है।`, `ਇਸ ਲਈ ਦੇਣਯੋਗ ਪੀਸ-ਰੇਟ ਭੁਗਤਾਨ ${answer} ਹੈ।`],
    findBonusShareFromExtraContribution: [`Therefore, the bonus share is ${answer}.`, `अतः बोनस का हिस्सा ${answer} है।`, `ਇਸ ਲਈ ਬੋਨਸ ਦਾ ਹਿੱਸਾ ${answer} ਹੈ।`],
    findPaymentAfterSignedContribution: [`Therefore, the accepted-net-output payment is ${answer}.`, `अतः मान्य शुद्ध उत्पादन के आधार पर भुगतान ${answer} है।`, `ਇਸ ਲਈ ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਭੁਗਤਾਨ ${answer} ਹੈ।`],
  };
  if (mode === "findContributionFactorRatioFromPayments") {
    return factorTarget === "EFFICIENCY_RATIO"
      ? t(language, [`Therefore, the work-rate ratio is ${answer}.`, `अतः काम-दर का अनुपात ${answer} है।`, `ਇਸ ਲਈ ਕੰਮ-ਦਰ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`])
      : t(language, [`Therefore, the work-time ratio is ${answer}.`, `अतः काम के दिनों का अनुपात ${answer} है।`, `ਇਸ ਲਈ ਕੰਮ ਦੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${answer} ਹੈ।`]);
  }
  return t(language, map[mode] ?? [`Therefore, the required payment is ${answer}.`, `अतः आवश्यक भुगतान ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਭੁਗਤਾਨ ${answer} ਹੈ।`]);
}

function buildSteps(mode: string, p: TmwCp008Parameters, solution: Cp008Solution, language: Language): string[] {
  const r = p.context.roles;
  const w = weights(p);
  const final = answerLine(mode, solution.answerText, language, p.factorTarget);
  const L = {
    first: ["First contribution", "पहला योगदान", "ਪਹਿਲਾ ਯੋਗਦਾਨ"] as Triplet,
    second: ["Second contribution", "दूसरा योगदान", "ਦੂਜਾ ਯੋਗਦਾਨ"] as Triplet,
    all: ["Contributions", "योगदान", "ਯੋਗਦਾਨ"] as Triplet,
    total: ["Total contribution", "कुल योगदान", "ਕੁੱਲ ਯੋਗਦਾਨ"] as Triplet,
    selected: ["Selected contribution", "चुना गया योगदान", "ਚੁਣਿਆ ਯੋਗਦਾਨ"] as Triplet,
    payment: ["Payment", "भुगतान", "ਭੁਗਤਾਨ"] as Triplet,
    ratio: ["Payment ratio", "भुगतान अनुपात", "ਭੁਗਤਾਨ ਅਨੁਪਾਤ"] as Triplet,
  };
  switch (mode) {
    case "findPaymentRatioFromContributionFactors": {
      const a = contribution(r[0]), b = contribution(r[1]);
      return [
        labeled(language, L.first, `${toLatex(r[0].efficiency)}\\times${toLatex(r[0].days)}\\times${toLatex(r[0].hoursPerDay)}=${toLatex(a)}`),
        labeled(language, L.second, `${toLatex(r[1].efficiency)}\\times${toLatex(r[1].days)}\\times${toLatex(r[1].hoursPerDay)}=${toLatex(b)}`),
        final,
      ];
    }
    case "findSelectedPartyPayment": {
      const total = sum(w), indices = p.selectedIndices ?? [p.targetIndex ?? 0], selectedWeights = indices.map(index => w[index]), selected = sum(selectedWeights);
      const selectedExpr = selectedWeights.length === 1 ? toLatex(selected) : `${selectedWeights.map(toLatex).join("+")}=${toLatex(selected)}`;
      return [
        labeled(language, L.all, `${toLatex(w[0])},\\ ${toLatex(w[1])},\\ ${toLatex(w[2])}`),
        labeled(language, L.total, `${w.map(toLatex).join("+")}=${toLatex(total)}`),
        labeled(language, L.selected, selectedExpr),
        labeled(language, L.payment, `${toLatex(p.totalPayment)}\\times\\frac{${toLatex(selected)}}{${toLatex(total)}}=${toLatex(solution.answerValues[0])}`),
        final,
      ];
    }
    case "findTotalPaymentPoolFromKnownShare": {
      const total = sum(w), target = p.targetIndex ?? 0, known = p.reportedPayments?.[target] ?? zero();
      return [
        labeled(language, ["Contribution-ratio total", "योगदान अनुपात का कुल", "ਯੋਗਦਾਨ ਅਨੁਪਾਤ ਦਾ ਕੁੱਲ"], `${w.map(toLatex).join("+")}=${toLatex(total)}`),
        t(language, [`Known payment is ${math(`\\frac{${toLatex(w[target])}}{${toLatex(total)}}`)} of the total.`, `ज्ञात भुगतान कुल राशि का ${math(`\\frac{${toLatex(w[target])}}{${toLatex(total)}}`)} है।`, `ਪਤਾ ਭੁਗਤਾਨ ਕੁੱਲ ਰਕਮ ਦਾ ${math(`\\frac{${toLatex(w[target])}}{${toLatex(total)}}`)} ਹੈ।`]),
        labeled(language, ["Total payment", "कुल भुगतान", "ਕੁੱਲ ਭੁਗਤਾਨ"], `${toLatex(known)}\\times\\frac{${toLatex(total)}}{${toLatex(w[target])}}=${toLatex(p.totalPayment)}`),
        final,
      ];
    }
    case "findResidualPayment": {
      const known = (p.knownPaymentIndices ?? []).map(index => p.reportedPayments?.[index] ?? zero()), paid = sum(known);
      return [
        labeled(language, ["Payments already made", "पहले दिए भुगतान", "ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ"], `${known.map(toLatex).join("+")}=${toLatex(paid)}`),
        labeled(language, ["Remaining payment", "शेष भुगतान", "ਬਾਕੀ ਭੁਗਤਾਨ"], `${toLatex(p.totalPayment)}-${toLatex(paid)}=${toLatex(solution.answerValues[0])}`),
        final,
      ];
    }
    case "findPaymentAfterStagedParticipation": {
      const a = multiply(r[0].efficiency, r[0].days), b = multiply(r[1].efficiency, r[1].days), total = add(a, b), target = p.targetIndex ?? 0, chosen = target === 0 ? a : b;
      return [
        t(language, [`Equal daily hours cancel; contribution ratio is ${math(`${toLatex(a)}:${toLatex(b)}`)}.`, `प्रतिदिन समान घंटे कट जाते हैं; योगदान अनुपात ${math(`${toLatex(a)}:${toLatex(b)}`)} है।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ; ਯੋਗਦਾਨ ਅਨੁਪਾਤ ${math(`${toLatex(a)}:${toLatex(b)}`)} ਹੈ।`]),
        labeled(language, L.total, `${toLatex(a)}+${toLatex(b)}=${toLatex(total)}`),
        labeled(language, L.payment, `${toLatex(p.totalPayment)}\\times\\frac{${toLatex(chosen)}}{${toLatex(total)}}=${toLatex(solution.answerValues[0])}`),
        final,
      ];
    }
    case "findPaymentFromCompletedFractions": {
      const total = sum(w), target = p.targetIndex ?? 0;
      return [
        labeled(language, ["Verified fraction total", "सत्यापित कार्य-हिस्सों का योग", "ਤਸਦੀਕ ਕੀਤੇ ਕੰਮ-ਹਿੱਸਿਆਂ ਦਾ ਜੋੜ"], `${w.map(toLatex).join("+")}=${toLatex(total)}`),
        labeled(language, ["Required work fraction", "माँगा गया कार्य-हिस्सा", "ਮੰਗਿਆ ਕੰਮ-ਹਿੱਸਾ"], toLatex(w[target])),
        labeled(language, L.payment, `${toLatex(p.totalPayment)}\\times\\frac{${toLatex(w[target])}}{${toLatex(total)}}=${toLatex(solution.answerValues[0])}`),
        final,
      ];
    }
    case "findContributionFactorRatioFromPayments": {
      const pa = p.reportedPayments?.[0] ?? zero(), pb = p.reportedPayments?.[1] ?? zero();
      const x = p.factorTarget === "EFFICIENCY_RATIO" ? multiply(pa, r[1].days) : multiply(pa, r[1].efficiency);
      const y = p.factorTarget === "EFFICIENCY_RATIO" ? multiply(pb, r[0].days) : multiply(pb, r[0].efficiency);
      return [labeled(language, L.ratio, `${toLatex(pa)}:${toLatex(pb)}`), labeled(language, ["Requested ratio after cancelling common factors", "समान गुणक काटने के बाद माँगा अनुपात", "ਸਾਂਝੇ ਗੁਣਕ ਕੱਟਣ ਤੋਂ ਬਾਅਦ ਮੰਗਿਆ ਅਨੁਪਾਤ"], `${toLatex(x)}:${toLatex(y)}`), final];
    }
    case "findMissingTimeFromPayment": {
      const target = p.targetIndex ?? 0, known = target === 0 ? 1 : 0, px = p.reportedPayments?.[target] ?? zero(), pk = p.reportedPayments?.[known] ?? zero();
      return [
        labeled(language, L.ratio, `\\frac{${toLatex(px)}}{${toLatex(pk)}}`),
        t(language, [`Equal daily hours cancel, so days ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].efficiency)}}=${toLatex(solution.answerValues[0])}`)}.`, `प्रतिदिन समान घंटे कट जाते हैं, इसलिए दिन ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].efficiency)}}=${toLatex(solution.answerValues[0])}`)}।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਦਿਨ ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].efficiency)}}=${toLatex(solution.answerValues[0])}`)}।`]),
        final,
      ];
    }
    case "findMissingEfficiencyFromPayment": {
      const target = p.targetIndex ?? 0, known = target === 0 ? 1 : 0, px = p.reportedPayments?.[target] ?? zero(), pk = p.reportedPayments?.[known] ?? zero();
      return [
        labeled(language, L.ratio, `\\frac{${toLatex(px)}}{${toLatex(pk)}}`),
        t(language, [`Equal daily hours cancel, so work rate ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].days)}}=${toLatex(solution.answerValues[0])}`)}.`, `प्रतिदिन समान घंटे कट जाते हैं, इसलिए काम-दर ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].days)}}=${toLatex(solution.answerValues[0])}`)}।`, `ਹਰ ਰੋਜ਼ ਇੱਕੋ ਘੰਟੇ ਕੱਟ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਕੰਮ-ਦਰ ${math(`=\\frac{${toLatex(px)}\\times${toLatex(r[known].efficiency)}\\times${toLatex(r[known].days)}}{${toLatex(pk)}\\times${toLatex(r[target].days)}}=${toLatex(solution.answerValues[0])}`)}।`]),
        final,
      ];
    }
    case "findMixedCategoryPaymentDistribution": {
      const c = r.map(role => multiply(role.count, role.efficiency)) as [Rational, Rational, Rational], total = sum(c);
      return [
        t(language, [`Equal time cancels; category contributions are ${math(`${toLatex(c[0])},\\ ${toLatex(c[1])},\\ ${toLatex(c[2])}`)}.`, `समान समय कट जाता है; श्रेणी-योगदान ${math(`${toLatex(c[0])},\\ ${toLatex(c[1])},\\ ${toLatex(c[2])}`)} हैं।`, `ਇੱਕੋ ਸਮਾਂ ਕੱਟ ਜਾਂਦਾ ਹੈ; ਸ਼੍ਰੇਣੀ-ਯੋਗਦਾਨ ${math(`${toLatex(c[0])},\\ ${toLatex(c[1])},\\ ${toLatex(c[2])}`)} ਹਨ।`]),
        labeled(language, L.total, `${c.map(toLatex).join("+")}=${toLatex(total)}`),
        labeled(language, ["Payments in order", "क्रम में भुगतान", "ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ"], `${solution.answerValues.map(toLatex).join(",\\ ")}`),
        final,
      ];
    }
    case "findPieceRatePaymentFromOutput": {
      const q = r[0].output, rate = p.pieceRate ?? zero();
      return [labeled(language, ["Accepted output", "स्वीकृत उत्पादन", "ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ"], toLatex(q)), labeled(language, ["Payment per accepted unit", "प्रति स्वीकृत इकाई भुगतान", "ਪ੍ਰਤੀ ਮਨਜ਼ੂਰ ਇਕਾਈ ਭੁਗਤਾਨ"], toLatex(rate)), labeled(language, L.payment, `${toLatex(q)}\\times${toLatex(rate)}=${toLatex(solution.answerValues[0])}`), final];
    }
    case "findBonusShareFromExtraContribution": {
      const e = r.map(role => subtract(role.output, role.baselineOutput)) as [Rational, Rational, Rational], total = sum(e), target = p.targetIndex ?? 0, bonus = p.bonusPool ?? p.totalPayment;
      return [t(language, [`Extra outputs are ${math(`${toLatex(e[0])},\\ ${toLatex(e[1])},\\ ${toLatex(e[2])}`)}.`, `लक्ष्य से अधिक उत्पादन ${math(`${toLatex(e[0])},\\ ${toLatex(e[1])},\\ ${toLatex(e[2])}`)} हैं।`, `ਟੀਚੇ ਤੋਂ ਵੱਧ ਉਤਪਾਦਨ ${math(`${toLatex(e[0])},\\ ${toLatex(e[1])},\\ ${toLatex(e[2])}`)} ਹਨ।`]), labeled(language, ["Total extra output", "कुल अतिरिक्त उत्पादन", "ਕੁੱਲ ਵਾਧੂ ਉਤਪਾਦਨ"], `${e.map(toLatex).join("+")}=${toLatex(total)}`), labeled(language, ["Bonus share", "बोनस का हिस्सा", "ਬੋਨਸ ਦਾ ਹਿੱਸਾ"], `${toLatex(bonus)}\\times\\frac{${toLatex(e[target])}}{${toLatex(total)}}=${toLatex(solution.answerValues[0])}`), final];
    }
    case "findPaymentAfterSignedContribution": {
      const n = r.map(role => subtract(role.output, role.defectiveOutput)) as [Rational, Rational, Rational], total = sum(n), target = p.targetIndex ?? 0;
      return [t(language, [`Accepted net outputs are ${math(`${toLatex(n[0])},\\ ${toLatex(n[1])},\\ ${toLatex(n[2])}`)}.`, `मान्य शुद्ध उत्पादन ${math(`${toLatex(n[0])},\\ ${toLatex(n[1])},\\ ${toLatex(n[2])}`)} हैं।`, `ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਉਤਪਾਦਨ ${math(`${toLatex(n[0])},\\ ${toLatex(n[1])},\\ ${toLatex(n[2])}`)} ਹਨ।`]), labeled(language, ["Net-output total", "शुद्ध उत्पादन का कुल", "ਸ਼ੁੱਧ ਉਤਪਾਦਨ ਦਾ ਕੁੱਲ"], `${n.map(toLatex).join("+")}=${toLatex(total)}`), labeled(language, L.payment, `${toLatex(p.totalPayment)}\\times\\frac{${toLatex(n[target])}}{${toLatex(total)}}=${toLatex(solution.answerValues[0])}`), final];
    }
    default: return [final];
  }
}

function fixStem(stem: string, language: Language): string {
  if (language === "hi") return stem.replace(/रंगाई का ठेका के लिए/g, "रंगाई के ठेके के लिए").replace(/योगदान अभिलेख/g, "काम का विवरण").replace(/दक्षता (\d+(?:\/\d+)? (?:वर्ग मीटर|पुर्ज़े|फाइलें|पैकेज) प्रति घंटा)/g, "काम-दर $1");
  if (language === "pa") return stem.replace(/ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/g, "ਰੰਗਾਈ ਦੇ ਠੇਕੇ ਲਈ").replace(/ਯੋਗਦਾਨ ਰਿਕਾਰਡ/g, "ਕੰਮ ਦਾ ਵੇਰਵਾ").replace(/ਦੱਖਤਾ (\d+(?:\/\d+)? (?:ਵਰਗ ਮੀਟਰ|ਪੁਰਜ਼ੇ|ਫਾਈਲਾਂ|ਪੈਕੇਜ) ਪ੍ਰਤੀ ਘੰਟਾ)/g, "ਕੰਮ-ਦਰ $1");
  return stem.replace(/Contribution record/gi, "Work record");
}

function fixTrap(trap: Cp008Trap, mode: string, language: Language): Cp008Trap {
  if (trap.misconceptionId !== "TOTAL_REPORTED_AS_SHARE" || mode === "findTotalPaymentPoolFromKnownShare") return trap;
  return { ...trap, explanation: t(language, [
    "This option uses the whole payment or bonus pool, but the question asks only for the selected worker's or group's share.",
    "इस विकल्प में पूरी भुगतान या बोनस राशि ले ली गई है, जबकि प्रश्न केवल चुने गए व्यक्ति या समूह का हिस्सा पूछता है।",
    "ਇਸ ਚੋਣ ਵਿੱਚ ਪੂਰੀ ਭੁਗਤਾਨ ਜਾਂ ਬੋਨਸ ਰਕਮ ਲੈ ਲਈ ਗਈ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਕੇਵਲ ਚੁਣੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮੂਹ ਦਾ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।",
  ]) };
}

export function finalizeTmwCp008MultilingualEditorialReview<T extends Cp008Question>(question: T, language: Language): T {
  if ((question.canonicalProblemId ?? question.cpId) !== "TMW-CP-008" || !question.parameters || !question.solution) return question;
  const mode = String(question.solveMode ?? "");
  const stem = fixStem(question.stem ?? "", language);
  const solutionSteps = buildSteps(mode, question.parameters, question.solution, language);
  const answer = answerLine(mode, question.solution.answerText, language, question.parameters.factorTarget);
  const learnerExplanation: TmwLearnerExplanationV2 = { method: t(language, METHODS[mode] ?? METHODS.findSelectedPartyPayment), solution: solutionSteps, answer };
  const explanation = question.explanation ? { ...question.explanation, steps: solutionSteps.slice(0, -1), commonTrap: fixTrap(question.explanation.commonTrap, mode, language), conclusion: answer } : question.explanation;
  const errors = [...(question.validation?.errors ?? [])];
  const learnerErrors = validateTmwLearnerExplanationV2(learnerExplanation);
  const text = [stem, learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer, ...(explanation?.steps ?? []), explanation?.commonTrap?.explanation ?? ""].join(" ");
  if (language !== "en" && /Target fraction|accepted components|accepted square metres|per accepted unit|square metres per|components per/i.test(text)) errors.push("CP008 multilingual editorial review: untranslated English learner fragment remains");
  if (/[\u0000-\u001F\u007F]/u.test(text)) errors.push("CP008 multilingual editorial review: control character remains in learner text");
  if (/रंगाई का ठेका के लिए|ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ/u.test(stem)) errors.push("CP008 multilingual editorial review: contract postposition grammar remains");
  if (mode !== "findTotalPaymentPoolFromKnownShare" && explanation?.commonTrap?.misconceptionId === "TOTAL_REPORTED_AS_SHARE" && /प्रश्न कुल भुगतान राशि पूछता है|ਪ੍ਰਸ਼ਨ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ ਪੁੱਛਦਾ ਹੈ/u.test(explanation.commonTrap.explanation)) errors.push("CP008 multilingual editorial review: trap misstates the question target");
  errors.push(...learnerErrors.map(error => `CP008 multilingual editorial review: ${error}`));
  return { ...question, stem, learnerExplanation, explanation, validation: { valid: errors.length === 0, errors }, publiclyPublishable: false };
}
