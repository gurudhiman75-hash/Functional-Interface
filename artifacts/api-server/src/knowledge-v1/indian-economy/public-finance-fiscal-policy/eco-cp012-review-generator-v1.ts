import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp012Fact } from "./eco-cp012-facts";
import type { EcoCp012ReviewQuestion } from "./eco-cp012-review-types";

const qlNames: Record<number, string> = {
  1: "Public finance and fiscal-policy concepts",
  2: "Expansionary versus contractionary fiscal policy",
  3: "Revenue receipts and capital receipts",
  4: "Revenue expenditure and capital expenditure",
  5: "Fiscal deficit concept and application",
  6: "Revenue deficit concept and application",
  7: "Primary deficit concept and application",
  8: "Debt, non-debt receipts and public borrowing",
  9: "FRBM concept and purpose",
  10: "Automatic stabilisers",
  11: "Statement evaluation",
  12: "Mixed deficit and classification distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql === 1 || ql === 2 || ql === 3 || ql === 4) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if (ql === 5 || ql === 6 || ql === 7 || ql === 8) return row < 2 ? "Medium" : row === 2 ? "Medium" : "Hard";
  if (ql === 9 || ql === 10) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp012Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

const qlCases: Record<number, Case[]> = {
  1: [
    { stem: "Public finance mainly deals with:", correct: "Government revenue, expenditure and borrowing", options: ["Government revenue, expenditure and borrowing", "Only household saving", "Only company profits", "Only stock-market trading"], explanation: "Public finance studies how Government raises resources, spends them and borrows, along with the economic effects of these decisions.", factIds: ["public-finance"] },
    { stem: "Fiscal policy mainly works through:", correct: "Government taxation, expenditure and borrowing", options: ["Government taxation, expenditure and borrowing", "Only RBI note issue", "Only bank reserve accounts", "Only foreign-exchange trading"], explanation: "Fiscal policy uses Government taxes, spending and borrowing to influence economic activity and public finances.", factIds: ["fiscal-policy"] },
    { stem: "Which action belongs to fiscal policy rather than monetary policy?", correct: "Government increases public expenditure", options: ["Government increases public expenditure", "RBI changes the repo rate", "RBI changes CRR", "RBI conducts an SDF operation"], explanation: "Government expenditure is a fiscal-policy instrument. Repo, CRR and SDF are monetary-policy instruments used by RBI.", factIds: ["fiscal-policy"] },
    { stem: "Which statement best separates fiscal policy from monetary policy?", correct: "Fiscal policy uses Government budget tools; monetary policy uses central-bank instruments", options: ["Fiscal policy uses Government budget tools; monetary policy uses central-bank instruments", "Both mean only tax changes", "Both are controlled only by commercial banks", "Fiscal policy deals only with currency printing"], explanation: "Fiscal policy operates through Government revenue, spending and borrowing, whereas monetary policy operates through central-bank tools affecting liquidity and interest conditions.", factIds: ["fiscal-policy"] },
  ],
  2: [
    { stem: "Which is generally expansionary fiscal policy?", correct: "Higher Government spending or lower taxes", options: ["Higher Government spending or lower taxes", "Lower Government spending and higher taxes", "Higher CRR only", "Higher repo rate only"], explanation: "Expansionary fiscal policy raises aggregate demand by increasing spending or reducing the tax burden.", factIds: ["expansionary-fiscal"] },
    { stem: "Which is generally contractionary fiscal policy?", correct: "Lower Government spending or higher taxes", options: ["Lower Government spending or higher taxes", "Higher Government spending and lower taxes", "Lower repo rate", "OMO purchase by RBI"], explanation: "Contractionary fiscal policy restrains aggregate demand by reducing spending or increasing taxes.", factIds: ["contractionary-fiscal"] },
    { stem: "The economy is in a deep slowdown. Which fiscal direction is most likely to support demand?", correct: "Increase Government spending or reduce taxes", options: ["Increase Government spending or reduce taxes", "Cut spending and raise taxes", "Raise CRR", "Raise the policy repo rate"], explanation: "During a slowdown, expansionary fiscal policy can support demand through higher public spending or lower taxes.", factIds: ["expansionary-fiscal"] },
    { stem: "Demand is overheating and inflationary pressure is strong. Which fiscal action is most contractionary?", correct: "Reduce Government spending and/or raise taxes", options: ["Reduce Government spending and/or raise taxes", "Increase spending and cut taxes", "Lower reserve requirements", "Buy securities through OMO"], explanation: "Reducing spending or raising taxes withdraws demand from the economy, which is the basic contractionary fiscal direction.", factIds: ["contractionary-fiscal"] },
  ],
  3: [
    { stem: "Income-tax receipts of Government are classified as:", correct: "Revenue receipts", options: ["Revenue receipts", "Capital receipts", "Capital expenditure", "Public debt repayment"], explanation: "Tax revenue is a revenue receipt because it does not create a new liability or reduce Government assets.", factIds: ["revenue-receipt"] },
    { stem: "Government borrowing is classified as:", correct: "Capital receipt", options: ["Capital receipt", "Revenue receipt", "Revenue expenditure", "Tax revenue"], explanation: "Borrowing is a capital receipt because it creates a repayment liability for Government.", factIds: ["capital-receipt", "debt-capital-receipt"] },
    { stem: "Recovery of a loan earlier given by Government is a:", correct: "Non-debt capital receipt", options: ["Non-debt capital receipt", "Tax revenue receipt", "Revenue expenditure", "Interest payment"], explanation: "Loan recovery reduces a Government financial asset but does not create fresh debt, so it is a non-debt capital receipt.", factIds: ["nondebt-capital-receipt"] },
    { stem: "Which pair is correctly classified?", correct: "Tax revenue — revenue receipt; borrowing — capital receipt", options: ["Tax revenue — revenue receipt; borrowing — capital receipt", "Borrowing — revenue receipt; tax revenue — capital receipt", "Loan recovery — revenue expenditure; tax revenue — capital expenditure", "Disinvestment — revenue receipt; borrowing — revenue expenditure"], explanation: "Tax revenue is a revenue receipt, while borrowing is a capital receipt because it creates a liability.", factIds: ["revenue-receipt", "capital-receipt", "debt-capital-receipt"] },
  ],
  4: [
    { stem: "Payment of Government salaries is generally:", correct: "Revenue expenditure", options: ["Revenue expenditure", "Capital expenditure", "Capital receipt", "Non-debt receipt"], explanation: "Salaries are part of normal Government operations and do not directly create a Government asset, so they are revenue expenditure.", factIds: ["revenue-expenditure"] },
    { stem: "Government spending on constructing a new highway is generally:", correct: "Capital expenditure", options: ["Capital expenditure", "Revenue receipt", "Revenue expenditure", "Tax receipt"], explanation: "A new highway creates a long-lived public asset, so the spending is capital expenditure.", factIds: ["capital-expenditure"] },
    { stem: "Interest paid on Government debt is generally classified as:", correct: "Revenue expenditure", options: ["Revenue expenditure", "Capital expenditure", "Capital receipt", "Non-tax capital receipt"], explanation: "Interest payments are recurring obligations and do not create a Government asset, so they fall under revenue expenditure.", factIds: ["revenue-expenditure", "public-debt"] },
    { stem: "Which distinction is correct?", correct: "Capital expenditure creates assets or reduces liabilities; revenue expenditure mainly supports current operations", options: ["Capital expenditure creates assets or reduces liabilities; revenue expenditure mainly supports current operations", "Revenue expenditure always creates physical assets", "Capital expenditure means only tax collection", "Revenue expenditure is a type of borrowing"], explanation: "Capital expenditure is linked to asset creation or liability reduction, whereas revenue expenditure mainly finances current services and obligations.", factIds: ["revenue-expenditure", "capital-expenditure"] },
  ],
  5: [
    { stem: "Fiscal deficit indicates the Government's:", correct: "Overall borrowing requirement", options: ["Overall borrowing requirement", "Tax revenue only", "Interest payment only", "Capital expenditure only"], explanation: "Fiscal deficit is the gap between total expenditure and total non-debt receipts. That gap represents the overall borrowing requirement.", factIds: ["fiscal-deficit"] },
    { stem: "Fiscal deficit is calculated as:", correct: "Total expenditure minus total non-debt receipts", options: ["Total expenditure minus total non-debt receipts", "Revenue receipts minus revenue expenditure", "Fiscal deficit minus interest payments", "Tax revenue minus subsidies"], explanation: "Fiscal deficit = total expenditure − total non-debt receipts. Debt receipts are excluded because borrowing finances the deficit itself.", factIds: ["fiscal-deficit"] },
    { stem: "Total expenditure is 1,000 and total non-debt receipts are 760. Fiscal deficit is:", correct: "240", options: ["240", "760", "1,760", "100"], explanation: "Fiscal deficit = 1,000 − 760 = 240. The result is the amount that must broadly be financed through borrowing or other debt creation.", factIds: ["fiscal-deficit"] },
    { stem: "Why are debt receipts excluded when calculating fiscal deficit?", correct: "Because borrowing is used to finance the deficit and should not be counted as a non-debt resource", options: ["Because borrowing is used to finance the deficit and should not be counted as a non-debt resource", "Because borrowing is tax revenue", "Because all debt is revenue expenditure", "Because fiscal deficit ignores total expenditure"], explanation: "Fiscal deficit measures the gap before new borrowing fills it. Including debt receipts would hide the Government's actual borrowing requirement.", factIds: ["fiscal-deficit", "debt-capital-receipt"] },
  ],
  6: [
    { stem: "Revenue deficit is calculated as:", correct: "Revenue expenditure minus revenue receipts", options: ["Revenue expenditure minus revenue receipts", "Total expenditure minus total receipts", "Fiscal deficit minus interest payments", "Capital expenditure minus borrowings"], explanation: "Revenue deficit = revenue expenditure − revenue receipts. It shows whether current revenues are sufficient to meet current expenditure.", factIds: ["revenue-deficit"] },
    { stem: "Revenue expenditure is 700 and revenue receipts are 620. Revenue deficit is:", correct: "80", options: ["80", "620", "700", "1,320"], explanation: "Revenue deficit = 700 − 620 = 80.", factIds: ["revenue-deficit"] },
    { stem: "A revenue deficit means:", correct: "Current revenue receipts are insufficient to cover revenue expenditure", options: ["Current revenue receipts are insufficient to cover revenue expenditure", "Government has no capital expenditure", "Government has no public debt", "All capital receipts are zero"], explanation: "Revenue deficit specifically compares current revenue receipts with revenue expenditure. It does not by itself tell us that capital spending or debt is zero.", factIds: ["revenue-deficit"] },
    { stem: "Which situation can exist even if Government has no revenue deficit?", correct: "A fiscal deficit caused by capital expenditure exceeding non-debt capital receipts", options: ["A fiscal deficit caused by capital expenditure exceeding non-debt capital receipts", "Revenue expenditure exceeding revenue receipts", "Negative revenue receipts by definition", "No Government borrowing under any condition"], explanation: "Revenue balance can be zero while the Government still borrows to finance capital expenditure. Therefore fiscal deficit can remain positive even without a revenue deficit.", factIds: ["revenue-deficit", "fiscal-deficit", "capital-expenditure"] },
  ],
  7: [
    { stem: "Primary deficit equals:", correct: "Fiscal deficit minus interest payments", options: ["Fiscal deficit minus interest payments", "Revenue deficit plus taxes", "Capital expenditure minus borrowings", "Revenue receipts minus interest payments"], explanation: "Primary deficit removes interest payments from fiscal deficit to show the current-period deficit excluding the burden of past debt.", factIds: ["primary-deficit"] },
    { stem: "Fiscal deficit is 300 and interest payments are 120. Primary deficit is:", correct: "180", options: ["180", "120", "300", "420"], explanation: "Primary deficit = 300 − 120 = 180.", factIds: ["primary-deficit"] },
    { stem: "If fiscal deficit equals interest payments, primary deficit is:", correct: "Zero", options: ["Zero", "Equal to revenue deficit", "Equal to total expenditure", "Always negative"], explanation: "Primary deficit = fiscal deficit − interest payments. If the two are equal, the difference is zero.", factIds: ["primary-deficit"] },
    { stem: "What does a zero primary deficit imply?", correct: "The fiscal deficit is entirely accounted for by interest payments", options: ["The fiscal deficit is entirely accounted for by interest payments", "Government has no public debt", "Revenue receipts equal total expenditure", "All taxes have been abolished"], explanation: "If primary deficit is zero, fiscal deficit equals interest payments. Current non-interest spending is therefore not adding to the deficit beyond the interest burden.", factIds: ["primary-deficit", "public-debt"] },
  ],
  8: [
    { stem: "Which is a debt-creating capital receipt?", correct: "Government borrowing", options: ["Government borrowing", "Loan recovery", "Disinvestment receipt", "Tax revenue"], explanation: "Borrowing creates a future repayment obligation, so it is a debt-creating capital receipt.", factIds: ["debt-capital-receipt"] },
    { stem: "Which is a non-debt capital receipt?", correct: "Recovery of loans", options: ["Recovery of loans", "Market borrowing", "Treasury bill borrowing", "External loan"], explanation: "Loan recovery reduces a Government financial asset but does not create a new debt liability.", factIds: ["nondebt-capital-receipt"] },
    { stem: "Why can persistent fiscal deficits raise future interest burdens?", correct: "They can require additional borrowing, increasing the stock of public debt", options: ["They can require additional borrowing, increasing the stock of public debt", "They automatically eliminate all debt", "They turn taxes into capital assets", "They make interest payments disappear"], explanation: "Financing repeated fiscal deficits through borrowing adds to public debt, which can raise future interest-payment obligations.", factIds: ["fiscal-deficit", "public-debt"] },
    { stem: "Which pair correctly separates borrowing from disinvestment?", correct: "Borrowing creates debt; disinvestment reduces Government financial assets without creating new debt", options: ["Borrowing creates debt; disinvestment reduces Government financial assets without creating new debt", "Both are tax revenue", "Both are revenue expenditure", "Disinvestment creates debt while borrowing reduces assets only"], explanation: "Borrowing creates a repayment liability. Disinvestment is a non-debt capital receipt because Government sells part of a financial asset instead.", factIds: ["debt-capital-receipt", "nondebt-capital-receipt"] },
  ],
  9: [
    { stem: "FRBM stands for:", correct: "Fiscal Responsibility and Budget Management", options: ["Fiscal Responsibility and Budget Management", "Financial Regulation and Banking Management", "Federal Revenue and Budget Mechanism", "Fiscal Reserve and Borrowing Method"], explanation: "FRBM refers to the Fiscal Responsibility and Budget Management framework created by the 2003 Act.", factIds: ["frbm"] },
    { stem: "A central purpose of the FRBM framework is to promote:", correct: "Fiscal discipline, sustainability and transparency", options: ["Fiscal discipline, sustainability and transparency", "Permanent elimination of all Government spending", "Stock-market price control", "Currency-note printing"], explanation: "The FRBM framework emphasises prudent debt and deficit management, fiscal sustainability and transparency in Government finances.", factIds: ["frbm"] },
    { stem: "Which approach is most consistent with FRBM principles?", correct: "Managing deficits and debt within a transparent medium-term fiscal framework", options: ["Managing deficits and debt within a transparent medium-term fiscal framework", "Hiding borrowing outside fiscal statements", "Ignoring long-term debt sustainability", "Changing targets without disclosure"], explanation: "FRBM is built around medium-term fiscal management, debt sustainability and transparency rather than opaque or purely short-term budgeting.", factIds: ["frbm"] },
  ],
  10: [
    { stem: "An automatic stabiliser works:", correct: "Without a new discretionary policy decision each time", options: ["Without a new discretionary policy decision each time", "Only after Parliament changes the law during every slowdown", "Only through RBI repo changes", "Only through currency printing"], explanation: "Automatic stabilisers respond as economic conditions change without requiring a fresh policy decision each time.", factIds: ["automatic-stabiliser"] },
    { stem: "During a slowdown, tax collections fall automatically as incomes weaken. This is an example of:", correct: "Automatic stabilisation", options: ["Automatic stabilisation", "Open market operation", "Bank credit creation", "Currency depreciation"], explanation: "Lower incomes reduce some tax collections automatically, cushioning the fall in disposable income without a new tax-law change.", factIds: ["automatic-stabiliser"] },
    { stem: "Which best distinguishes an automatic stabiliser from discretionary fiscal policy?", correct: "Automatic stabilisers respond under existing rules; discretionary policy requires a new decision", options: ["Automatic stabilisers respond under existing rules; discretionary policy requires a new decision", "Automatic stabilisers are monetary policy", "Discretionary fiscal policy never changes taxes", "There is no difference"], explanation: "Automatic stabilisers operate through existing tax and transfer rules, while discretionary policy involves an explicit new Government action.", factIds: ["automatic-stabiliser", "fiscal-policy"] },
  ],
  11: [
    { stem: "Consider the statements: I. Revenue deficit equals revenue expenditure minus revenue receipts. II. Primary deficit equals fiscal deficit minus interest payments. Which is correct?", correct: "Both I and II", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I gives the revenue-deficit formula. Statement II gives the primary-deficit formula, so both are correct.", factIds: ["revenue-deficit", "primary-deficit"] },
    { stem: "Consider the statements: I. Borrowing is a debt-creating capital receipt. II. Loan recovery is a revenue receipt. Which is correct?", correct: "I only", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I is correct because borrowing creates a liability. Statement II is false because loan recovery is a non-debt capital receipt, not a revenue receipt.", factIds: ["debt-capital-receipt", "nondebt-capital-receipt"] },
    { stem: "Consider the statements: I. Capital expenditure may create assets. II. Interest payments are generally revenue expenditure. Which is correct?", correct: "Both I and II", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Capital expenditure can create Government assets, while interest payments are recurring obligations classified as revenue expenditure.", factIds: ["capital-expenditure", "revenue-expenditure"] },
  ],
  12: [
    { stem: "Which deficit measure most directly shows the borrowing requirement before new debt financing?", correct: "Fiscal deficit", options: ["Fiscal deficit", "Revenue deficit", "Primary deficit", "Trade deficit"], explanation: "Fiscal deficit measures total expenditure minus non-debt receipts, so it most directly captures the Government's overall borrowing requirement.", factIds: ["fiscal-deficit"] },
    { stem: "Which deficit removes the effect of interest payments on past debt?", correct: "Primary deficit", options: ["Primary deficit", "Revenue deficit", "Fiscal deficit", "Current-account deficit"], explanation: "Primary deficit subtracts interest payments from fiscal deficit, isolating the current non-interest fiscal imbalance.", factIds: ["primary-deficit"] },
    { stem: "Revenue deficit is zero, but capital expenditure exceeds non-debt capital receipts. Which can still be positive?", correct: "Fiscal deficit", options: ["Fiscal deficit", "Revenue deficit by definition", "Tax revenue only", "Automatic stabiliser"], explanation: "Even with no revenue deficit, Government may still need borrowing to finance capital expenditure. Fiscal deficit can therefore remain positive.", factIds: ["revenue-deficit", "fiscal-deficit", "capital-expenditure", "nondebt-capital-receipt"] },
  ],
};

export const ECO_CP012_REVIEW_V1: EcoCp012ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-012-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-012",
      qlId: `ECO-QL-${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, index),
      stem: row.stem,
      options,
      correctIndex: target,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      ...bundle,
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
});
