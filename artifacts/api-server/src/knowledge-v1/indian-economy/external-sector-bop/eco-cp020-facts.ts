import type { EcoCp020SourceId } from "./eco-cp020-sources";

export type EcoCp020Fact = {
  id: string;
  fact: string;
  sourceIds: EcoCp020SourceId[];
};

export const ECO_CP020_FACTS_V1: EcoCp020Fact[] = [
  { id: "bop-definition", fact: "Balance of Payments records a country's economic transactions with the rest of the world over a period.", sourceIds: ["RBI-BOP-STRUCTURE"] },
  { id: "current-account", fact: "The current account includes goods, services, income and current transfers.", sourceIds: ["RBI-BOP-STRUCTURE"] },
  { id: "trade-balance", fact: "Trade balance is exports of merchandise minus imports of merchandise.", sourceIds: ["RBI-BOP-STRUCTURE"] },
  { id: "invisibles", fact: "Invisibles broadly include services, income and transfers.", sourceIds: ["RBI-BOP-STRUCTURE", "RBI-BOP-INVISIBLES"] },
  { id: "services", fact: "Travel, transportation, insurance and software/business services are service items in the current account.", sourceIds: ["RBI-BOP-INVISIBLES"] },
  { id: "transfers", fact: "Current transfers include private transfers such as workers' remittances and official transfers.", sourceIds: ["RBI-BOP-INVISIBLES"] },
  { id: "income", fact: "Investment income includes interest, dividends and profits related to cross-border assets and liabilities.", sourceIds: ["RBI-BOP-INVISIBLES"] },
  { id: "capital-flows", fact: "External capital/financial flows include direct investment, portfolio investment, loans, banking capital and other capital.", sourceIds: ["RBI-BOP-STRUCTURE"] },
  { id: "fdi", fact: "FDI is foreign investment intended to establish a lasting investment interest and, under Indian rules, includes specified equity investment in unlisted companies or qualifying holdings in listed companies.", sourceIds: ["RBI-FDI-FPI"] },
  { id: "fpi", fact: "FPI is portfolio investment in listed equity below the prescribed direct-investment threshold and is generally more marketable than FDI.", sourceIds: ["RBI-FDI-FPI"] },
  { id: "appreciation", fact: "Currency appreciation means a rise in the currency's external value under a market-determined exchange rate.", sourceIds: ["RBI-FOREX-HISTORY"] },
  { id: "depreciation", fact: "Currency depreciation means a fall in the currency's external value under a market-determined exchange rate.", sourceIds: ["RBI-FOREX-HISTORY"] },
  { id: "devaluation", fact: "Devaluation is an official downward change in a currency's value under an administered or fixed exchange-rate arrangement, unlike market depreciation.", sourceIds: ["RBI-EXCHANGE-REFORM"] },
  { id: "revaluation", fact: "Revaluation is an official upward change in a currency's value under an administered or fixed exchange-rate arrangement.", sourceIds: ["RBI-EXCHANGE-REFORM"] },
  { id: "reserves", fact: "Foreign-exchange reserves are external reserve assets that can help meet external payment needs and absorb BoP pressures.", sourceIds: ["RBI-BOP-STRUCTURE"] },
  { id: "convertibility", fact: "Current-account convertibility allows foreign exchange for current international transactions subject to the applicable framework.", sourceIds: ["RBI-EXCHANGE-REFORM", "RBI-FOREX-HISTORY"] },
  { id: "india-1994", fact: "India accepted current-account convertibility in August 1994 under Article VIII of the IMF Articles of Agreement.", sourceIds: ["RBI-FOREX-HISTORY"] },
  { id: "lerms-1992", fact: "LERMS introduced a dual exchange-rate arrangement in March 1992 as a transitional reform.", sourceIds: ["RBI-EXCHANGE-REFORM"] },
  { id: "unified-1993", fact: "India moved to a unified market-determined exchange rate from March 1993.", sourceIds: ["RBI-EXCHANGE-REFORM", "RBI-FOREX-HISTORY"] },
  { id: "currency-export-effect", fact: "All else equal, currency depreciation tends to make domestic goods cheaper for foreign buyers and imports costlier in domestic currency.", sourceIds: ["RBI-FOREX-HISTORY"] },
];

export function ecoCp020Fact(id: string): EcoCp020Fact {
  const fact = ECO_CP020_FACTS_V1.find((item) => item.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-020 fact: ${id}`);
  return fact;
}
