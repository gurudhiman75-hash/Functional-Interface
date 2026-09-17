export type EcoCp008FactRow = {
  id: string;
  label: string;
  meaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const ECO_CP008_HISTORY_ROWS_V1: readonly EcoCp008FactRow[] = Object.freeze([
  {
    id: "rbi-act",
    label: "Reserve Bank of India Act, 1934",
    meaning: "the statute under which RBI was established",
    sourceIds: ["RBI-HISTORY-FACTFILE"],
    sourceFactIds: ["eco-cp008-rbi-act-1934"],
  },
  {
    id: "operations-1935",
    label: "1 April 1935",
    meaning: "the date on which RBI commenced operations",
    sourceIds: ["RBI-HISTORY-FACTFILE"],
    sourceFactIds: ["eco-cp008-operations-1935"],
  },
  {
    id: "office-move-1937",
    label: "Calcutta to Mumbai in 1937",
    meaning: "RBI's Central Office was initially in Calcutta and moved permanently to Mumbai in 1937",
    sourceIds: ["RBI-HISTORY-FACTFILE"],
    sourceFactIds: ["eco-cp008-office-move-1937"],
  },
  {
    id: "nationalisation-1949",
    label: "1 January 1949",
    meaning: "the date from which RBI was nationalised",
    sourceIds: ["RBI-HISTORY-FACTFILE", "RBI-ANNUAL-REPORT-OWNERSHIP"],
    sourceFactIds: ["eco-cp008-nationalisation-1949"],
  },
  {
    id: "government-ownership",
    label: "Government of India ownership",
    meaning: "RBI was originally privately owned but after nationalisation its ownership vested in Government of India",
    sourceIds: ["RBI-ANNUAL-REPORT-OWNERSHIP"],
    sourceFactIds: ["eco-cp008-government-ownership"],
  },
]);

export const ECO_CP008_FUNCTION_ROWS_V1: readonly EcoCp008FactRow[] = Object.freeze([
  {
    id: "central-bank",
    label: "Central bank of India",
    meaning: "RBI is India's central bank and apex monetary authority",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-central-bank"],
  },
  {
    id: "monetary-authority",
    label: "Monetary authority",
    meaning: "RBI formulates, implements and monitors monetary policy",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-monetary-authority"],
  },
  {
    id: "banker-government",
    label: "Banker to Government",
    meaning: "RBI manages banking transactions of the Central Government and may act for State Governments by agreement",
    sourceIds: ["RBI-BANKER-GOV-BANKS", "RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-banker-government"],
  },
  {
    id: "debt-manager",
    label: "Government debt manager",
    meaning: "RBI manages public debt and government-security operations assigned to it under law",
    sourceIds: ["RBI-BANKER-GOV-BANKS"],
    sourceFactIds: ["eco-cp008-debt-manager"],
  },
  {
    id: "banker-banks",
    label: "Banker to banks",
    meaning: "RBI maintains banking accounts used for reserves and inter-bank settlements",
    sourceIds: ["RBI-BANKER-GOV-BANKS", "RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-banker-banks"],
  },
  {
    id: "lender-last-resort",
    label: "Lender of last resort",
    meaning: "RBI can provide liquidity to a solvent bank facing temporary liquidity stress when other funding is unavailable",
    sourceIds: ["RBI-BANKER-GOV-BANKS"],
    sourceFactIds: ["eco-cp008-lender-last-resort"],
  },
  {
    id: "financial-regulator",
    label: "Regulator and supervisor of the financial system",
    meaning: "RBI prescribes and supervises broad banking and financial-system parameters within its legal remit",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-financial-regulator"],
  },
  {
    id: "forex-manager",
    label: "Manager of foreign exchange",
    meaning: "RBI manages the Foreign Exchange Management Act, 1999 framework and supports orderly foreign-exchange-market development",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-forex-manager"],
  },
  {
    id: "payment-regulator",
    label: "Regulator and supervisor of payment and settlement systems",
    meaning: "RBI is the designated authority for regulation and supervision of payment systems under the PSS Act, 2007",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS", "RBI-PSS-FAQ"],
    sourceFactIds: ["eco-cp008-payment-regulator"],
  },
  {
    id: "developmental-role",
    label: "Developmental role",
    meaning: "RBI performs promotional and developmental functions in support of national financial objectives",
    sourceIds: ["RBI-ABOUT-US-FUNCTIONS"],
    sourceFactIds: ["eco-cp008-developmental-role"],
  },
]);

export const ECO_CP008_CURRENCY_ROWS_V1: readonly EcoCp008FactRow[] = Object.freeze([
  {
    id: "banknote-issue",
    label: "RBI issues banknotes",
    meaning: "Section 22 gives RBI the sole right to issue banknotes in India, subject to the statutory one-rupee-note exception",
    sourceIds: ["RBI-CURRENCY-FAQ", "RBI-ONE-RUPEE-NOTE"],
    sourceFactIds: ["eco-cp008-banknote-issue"],
  },
  {
    id: "coin-minting",
    label: "Government of India mints coins",
    meaning: "coins are designed and minted by Government of India under the Coinage Act framework",
    sourceIds: ["RBI-CURRENCY-FAQ"],
    sourceFactIds: ["eco-cp008-coin-minting"],
  },
  {
    id: "coin-distribution",
    label: "RBI distributes coins",
    meaning: "RBI's role in coins is principally distribution of coins supplied by Government of India",
    sourceIds: ["RBI-CURRENCY-FAQ"],
    sourceFactIds: ["eco-cp008-coin-distribution"],
  },
  {
    id: "one-rupee-note",
    label: "One-rupee note is a Government of India issue",
    meaning: "the one-rupee currency note is printed by Government of India and carries the Finance Secretary's signature",
    sourceIds: ["RBI-ONE-RUPEE-NOTE"],
    sourceFactIds: ["eco-cp008-one-rupee-note"],
  },
]);

export function ecoCp008Fact(id: string): EcoCp008FactRow {
  const all = [
    ...ECO_CP008_HISTORY_ROWS_V1,
    ...ECO_CP008_FUNCTION_ROWS_V1,
    ...ECO_CP008_CURRENCY_ROWS_V1,
  ];
  const row = all.find((item) => item.id === id);
  if (!row) throw new Error(`Unknown ECO-CP-008 fact: ${id}`);
  return row;
}
