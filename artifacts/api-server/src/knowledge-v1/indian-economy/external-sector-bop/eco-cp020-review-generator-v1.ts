import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp020Fact } from "./eco-cp020-facts";
import type { EcoCp020ReviewQuestion } from "./eco-cp020-review-types";

const qlNames: Record<number, string> = {
  1: "BoP meaning and structure",
  2: "Current account",
  3: "Trade balance versus current account",
  4: "Invisibles",
  5: "Capital and financial flows",
  6: "FDI versus FPI",
  7: "Currency appreciation and depreciation",
  8: "Devaluation and revaluation",
  9: "Foreign-exchange reserves",
  10: "Current-account convertibility",
  11: "LERMS and exchange-rate reform",
  12: "Mixed external-sector distinctions",
};

function make(
  n: number,
  ql: number,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  answer: string,
  distractors: string[],
  factIds: string[],
  explanation: string,
): EcoCp020ReviewQuestion {
  const facts = factIds.map(ecoCp020Fact);
  return {
    questionId: `ECO-CP-020-Q${String(n).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-020",
    qlId: `ECO-QL-${String(ql).padStart(2, "0")}`,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options: [answer, ...distractors],
    correctIndex: 0,
    canonicalAnswer: answer,
    explanation,
    sourceIds: [...new Set(facts.flatMap((f) => f.sourceIds))],
    sourceFactIds: factIds,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export const ECO_CP020_REVIEW_V1: EcoCp020ReviewQuestion[] = [
  make(1,1,"Easy","What does the Balance of Payments record?","A country's economic transactions with the rest of the world over a period",["Only government tax receipts","Only merchandise exports","Only foreign loans"],["bop-definition"],"BoP records external economic transactions over a period."),
  make(2,1,"Medium","Which two broad groups form the core of the Balance of Payments?","Current-account transactions and capital/financial transactions",["Tax and non-tax revenue","Revenue and capital expenditure","Primary and secondary markets"],["bop-definition","current-account","capital-flows"],"BoP separates current transactions from external capital and financial flows."),
  make(3,1,"Hard","Which item belongs to the current account rather than a capital flow?","Export of software services",["Foreign direct investment inflow","External commercial borrowing","Portfolio investment inflow"],["current-account","services","capital-flows"],"Services are current-account items. Investment and borrowing are capital/financial flows."),

  make(4,2,"Easy","Which item is included in the current account?","Merchandise exports",["Foreign direct investment","External borrowing","Portfolio investment"],["current-account"],"Goods trade is part of the current account."),
  make(5,2,"Medium","Which group contains only current-account items?","Goods, services, income and current transfers",["FDI, FPI, loans and banking capital","Equity, bonds, deposits and loans","Tax revenue, borrowing, grants and expenditure"],["current-account"],"The current account covers goods, services, income and current transfers."),
  make(6,2,"Medium","A worker sends money from abroad to family in India. Where is it recorded in the BoP?","Current transfers in the current account",["Foreign direct investment","Portfolio investment","External commercial borrowing"],["transfers","current-account"],"Workers' remittances are private current transfers."),
  make(7,2,"Hard","Which transaction changes the current account without changing merchandise trade?","Receipt from exported software services",["Import of crude oil","Export of wheat","Purchase of foreign shares by an investor"],["services","trade-balance","capital-flows"],"Software-service receipts affect invisibles and the current account, not merchandise trade."),

  make(8,3,"Easy","What does the trade balance compare?","Merchandise exports and merchandise imports",["FDI inflows and FPI inflows","Services receipts and transfers","Government revenue and expenditure"],["trade-balance"],"Trade balance concerns merchandise exports minus merchandise imports."),
  make(9,3,"Medium","Can a country have a merchandise trade deficit but a smaller current-account deficit?","Yes, a surplus in invisibles can partly offset the trade deficit",["No, both balances must always be equal","Yes, but only if FDI is positive","No, because services are in the capital account"],["trade-balance","invisibles","current-account"],"Positive services, income or transfer flows can offset part of a merchandise deficit."),
  make(10,3,"Medium","Which balance is broader than the merchandise trade balance?","Current-account balance",["Primary-market balance","Fiscal balance","Money-market balance"],["trade-balance","current-account"],"The current account includes trade plus services, income and transfers."),
  make(11,3,"Hard","Merchandise trade is in deficit, but services and transfers show a large surplus. Which statement is correct?","The current-account deficit can be smaller than the trade deficit",["The current account must equal the trade deficit","FDI automatically becomes a current receipt","The trade balance becomes a capital-account item"],["trade-balance","invisibles","current-account"],"Invisibles can offset part of a merchandise trade deficit."),

  make(12,4,"Easy","Which of the following is an invisible receipt?","Software-service export earnings",["Export of machinery","Import of crude oil","Import of wheat"],["invisibles","services"],"Services are invisible current-account items."),
  make(13,4,"Medium","Which item is classified as income in the current account?","Dividend received on foreign investment",["Export of rice","FDI inflow into an Indian company","External commercial borrowing"],["income","current-account"],"Cross-border dividends and interest are investment-income items."),
  make(14,4,"Medium","Which item is a current transfer?","Workers' remittances",["Purchase of equity by a foreign investor","Import of machinery","External loan receipt"],["transfers"],"Workers' remittances are private current transfers."),
  make(15,4,"Hard","Which pair contains only invisible current-account items?","Travel services and workers' remittances",["Crude-oil imports and FDI","Machinery exports and portfolio investment","External loans and banking capital"],["invisibles","services","transfers"],"Travel is a service and remittances are transfers; both are invisibles."),

  make(16,5,"Easy","Which transaction is a capital or financial flow?","Foreign direct investment",["Export of software services","Workers' remittances","Merchandise exports"],["capital-flows","fdi"],"FDI is an external investment flow, not a current-account receipt."),
  make(17,5,"Medium","Which group contains only external capital or financial flows?","Direct investment, portfolio investment and loans",["Goods, services and remittances","Exports, imports and travel","Interest income, software exports and transfers"],["capital-flows"],"Investment and borrowing flows belong to the capital/financial side of BoP."),
  make(18,5,"Medium","A foreign investor buys Indian government or company securities without seeking management control. Which flow is this closest to?","Portfolio investment",["Merchandise export","Current transfer","Service receipt"],["capital-flows","fpi"],"Portfolio investment is investment in marketable securities without the direct-investment relationship."),
  make(19,5,"Hard","Which transaction raises external liabilities but does not enter merchandise trade?","An external loan received by an Indian borrower",["Export of textiles","Import of machinery","Receipt for tourism services"],["capital-flows","trade-balance"],"External borrowing is a capital/financial flow and does not enter merchandise trade."),

  make(20,6,"Easy","Which investment is more closely linked with a lasting ownership interest in an enterprise?","Foreign Direct Investment",["Foreign Portfolio Investment","Workers' remittance","Tourism receipt"],["fdi","fpi"],"FDI reflects a direct investment relationship and lasting interest."),
  make(21,6,"Medium","Which investment is generally more easily traded in financial markets?","Foreign Portfolio Investment",["Foreign Direct Investment","Current transfer","Merchandise export"],["fdi","fpi"],"FPI is portfolio investment in marketable securities and is generally more liquid than FDI."),
  make(22,6,"Medium","A foreign firm establishes or acquires a lasting stake in an Indian business. Which flow is this?","FDI",["FPI","Current transfer","Service export"],["fdi"],"A lasting investment interest is characteristic of FDI."),
  make(23,6,"Hard","Which statement best distinguishes FDI from FPI?","FDI reflects a direct investment relationship, while FPI is portfolio investment in marketable securities",["FDI is a current transfer, while FPI is merchandise trade","FDI is always short-term debt, while FPI is always long-term debt","Both are service exports"],["fdi","fpi"],"FDI is direct investment; FPI is portfolio investment."),

  make(24,7,"Easy","What is currency depreciation?","A fall in a currency's external value under a market-determined exchange rate",["An official tax increase","A rise in a currency's external value","A fall in domestic interest rates only"],["depreciation"],"Depreciation is a market-driven fall in a currency's external value."),
  make(25,7,"Easy","What is currency appreciation?","A rise in a currency's external value under a market-determined exchange rate",["An official downward reset","A fall in external value","A rise in import duty"],["appreciation"],"Appreciation is a market-driven rise in external value."),
  make(26,7,"Medium","All else equal, what is a likely effect of domestic-currency depreciation?","Imports become costlier in domestic currency",["Imports automatically become cheaper","Exports become impossible","Foreign exchange ceases to exist"],["depreciation","currency-export-effect"],"Depreciation raises the domestic-currency cost of imports, all else equal."),
  make(27,7,"Hard","All else equal, which combination is most consistent with currency depreciation?","Domestic exports become cheaper to foreign buyers and imports become costlier domestically",["Exports become dearer abroad and imports cheaper domestically","Both exports and imports become costless","Only domestic taxes change"],["depreciation","currency-export-effect"],"Depreciation tends to improve export price competitiveness while raising import cost in domestic currency."),

  make(28,8,"Easy","What is devaluation?","An official downward change in a currency's value under an administered exchange-rate system",["A market-driven rise in value","A market-driven fall called appreciation","An increase in foreign reserves"],["devaluation"],"Devaluation is an official downward reset, unlike market depreciation."),
  make(29,8,"Medium","Which statement correctly distinguishes depreciation from devaluation?","Depreciation is market-driven, while devaluation is an official downward adjustment",["Both always mean an official upward adjustment","Depreciation applies only to taxes","Devaluation is a current transfer"],["depreciation","devaluation"],"Depreciation comes from market movement; devaluation is an official action under an administered regime."),
  make(30,8,"Hard","Which pair is correctly matched?","Appreciation—market rise in value; revaluation—official upward adjustment",["Appreciation—official fall; revaluation—market fall","Depreciation—official rise; devaluation—market rise","Devaluation—current transfer; appreciation—capital flow"],["appreciation","revaluation"],"Appreciation is market-driven; revaluation is an official upward change."),

  make(31,9,"Easy","Why are foreign-exchange reserves important?","They provide external reserve assets for meeting payment needs and absorbing external shocks",["They determine domestic tax slabs","They replace the current account","They are company equity capital"],["reserves"],"Forex reserves provide external liquidity and a buffer against payment pressures."),
  make(32,9,"Medium","Which institution manages India's official foreign-exchange reserves?","Reserve Bank of India",["SEBI","CACP","FCI"],["reserves"],"RBI manages India's official foreign-exchange reserves."),
  make(33,9,"Medium","If external payments temporarily exceed external receipts, which buffer can help meet the gap?","Foreign-exchange reserves",["MSP stocks","Demat accounts","GST compensation"],["reserves"],"Reserve assets can be used to meet temporary external-payment needs."),
  make(34,9,"Hard","Which statement best describes the relation between reserves and the BoP?","Changes in reserve assets can help finance or absorb overall external imbalances",["Reserves are part of merchandise exports","Reserves are identical to FDI","Reserves determine all domestic prices"],["reserves","bop-definition"],"Reserve changes help settle overall external imbalances in the BoP framework."),

  make(35,10,"Easy","In which year did India achieve current-account convertibility?","1994",["1991","1992","1993"],["india-1994"],"India accepted current-account convertibility in August 1994."),
  make(36,10,"Medium","What does current-account convertibility mainly relate to?","Foreign exchange for current international transactions",["Unlimited freedom for every capital movement","Automatic conversion of fiscal deficit into reserves","Free issue of company shares"],["convertibility"],"Current-account convertibility concerns payments for current international transactions."),
  make(37,10,"Hard","Which statement is correct about India's 1994 convertibility milestone?","It concerned current-account transactions, not complete capital-account freedom",["It created full unrestricted capital-account convertibility","It abolished the rupee","It ended merchandise trade"],["india-1994","convertibility"],"India's 1994 milestone was current-account convertibility, not full capital-account convertibility."),

  make(38,11,"Easy","What was LERMS?","A transitional dual exchange-rate system introduced in 1992",["A stock-exchange index","A fiscal-deficit rule","A crop-pricing scheme"],["lerms-1992"],"LERMS introduced a dual exchange-rate arrangement in 1992."),
  make(39,11,"Medium","When did India move to a unified market-determined exchange rate?","1993",["1991","1992","1994"],["unified-1993"],"The dual LERMS rates were unified from March 1993."),
  make(40,11,"Hard","Which sequence of exchange-rate reforms is correct?","1992 LERMS → 1993 unified market rate → 1994 current-account convertibility",["1994 convertibility → 1992 LERMS → 1993 unified rate","1993 unified rate → 1991 LERMS → 1992 convertibility","1992 convertibility → 1994 LERMS → 1993 unified rate"],["lerms-1992","unified-1993","india-1994"],"India moved from LERMS to a unified market rate and then to current-account convertibility."),

  make(41,12,"Medium","Consider the statements. I. Services are part of the current account. II. FDI is a capital/financial flow. Which option is correct?","Both I and II",["I only","II only","Neither I nor II"],["services","fdi","capital-flows"],"Both statements are correct."),
  make(42,12,"Hard","Which combination is correctly matched?","Remittance—current transfer; FDI—capital flow; depreciation—market fall in currency value",["Remittance—FDI; FPI—service export; depreciation—official rise","FDI—merchandise trade; remittance—loan; appreciation—official fall","Service export—capital flow; FPI—current transfer; devaluation—market rise"],["transfers","fdi","depreciation"],"Remittances are transfers, FDI is a capital flow and depreciation is market-driven currency weakening."),
  make(43,12,"Hard","A country has a merchandise deficit but strong service exports and remittance receipts. Which balance is most directly improved by those invisibles?","Current-account balance",["Only merchandise trade balance","Only fiscal balance","Only primary-market balance"],["trade-balance","invisibles","current-account"],"Services and remittances improve the current account but do not change merchandise trade balance."),
  make(44,12,"Hard","Which statement best separates current-account convertibility from FDI liberalisation?","Convertibility concerns current payments, while FDI liberalisation concerns cross-border investment flows",["Both refer only to merchandise exports","Convertibility means unrestricted FPI only","FDI liberalisation means current transfers only"],["convertibility","fdi","capital-flows"],"Current-account convertibility concerns current transactions; FDI concerns investment flows."),
];
