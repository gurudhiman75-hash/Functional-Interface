export type EcoCp007ConceptRow = {
  id: string;
  term: string;
  meaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const ncert = ["NCERT-MACRO-MONEY-BANKING"] as const;
const aggregates = ["NCERT-MACRO-MONEY-BANKING", "RBI-MONETARY-AGGREGATES", "RBI-MONEY-STOCK-MEASURES"] as const;

export const ECO_CP007_CONCEPT_ROWS_V1: readonly EcoCp007ConceptRow[] = Object.freeze([
  { id: "barter", term: "Barter exchange", meaning: "direct exchange of goods or services without using money", sourceIds: ncert, sourceFactIds: ["eco-cp007-barter"] },
  { id: "double-coincidence", term: "Double coincidence of wants", meaning: "each side must want exactly what the other side offers in a barter exchange", sourceIds: ncert, sourceFactIds: ["eco-cp007-double-coincidence"] },
  { id: "medium", term: "Medium of exchange", meaning: "money is accepted between buyers and sellers to complete exchange", sourceIds: ncert, sourceFactIds: ["eco-cp007-medium"] },
  { id: "unit", term: "Unit of account", meaning: "money provides a common unit in which prices and values are expressed", sourceIds: ncert, sourceFactIds: ["eco-cp007-unit"] },
  { id: "store", term: "Store of value", meaning: "money can transfer purchasing power from the present to the future", sourceIds: ncert, sourceFactIds: ["eco-cp007-store"] },
  { id: "deferred", term: "Standard of deferred payment", meaning: "future payments and debts can be stated and settled in money", sourceIds: ncert, sourceFactIds: ["eco-cp007-deferred"] },
  { id: "fiat", term: "Fiat money", meaning: "money whose acceptability comes from the issuing authority rather than intrinsic commodity value", sourceIds: ncert, sourceFactIds: ["eco-cp007-fiat"] },
  { id: "legal-tender", term: "Legal tender", meaning: "money that cannot be refused for settlement of a transaction under law", sourceIds: ncert, sourceFactIds: ["eco-cp007-legal-tender"] },
  { id: "demand-deposit", term: "Demand deposit", meaning: "a bank deposit payable by the bank on demand of the account holder", sourceIds: ncert, sourceFactIds: ["eco-cp007-demand-deposit"] },
  { id: "time-deposit", term: "Time deposit", meaning: "a bank deposit having a fixed period to maturity", sourceIds: ncert, sourceFactIds: ["eco-cp007-time-deposit"] },
  { id: "money-supply", term: "Money supply", meaning: "the stock of money with the public at a particular point of time", sourceIds: aggregates, sourceFactIds: ["eco-cp007-money-supply"] },
  { id: "reserve-money", term: "Reserve money", meaning: "the monetary base or high-powered money that forms the base for expansion of money supply", sourceIds: aggregates, sourceFactIds: ["eco-cp007-reserve-money"] },
]);

export const ECO_CP007_AGGREGATE_ROWS_V1 = Object.freeze([
  {
    id: "m1",
    aggregate: "M1",
    classification: "Narrow money",
    formula: "Currency with public + demand deposits with banking system + other deposits with RBI",
    shortFormula: "Currency with public + demand deposits + other deposits with RBI",
    liquidityRank: 1,
    sourceIds: aggregates,
    sourceFactIds: ["eco-cp007-m1"],
  },
  {
    id: "m2",
    aggregate: "M2",
    classification: "Narrow money",
    formula: "M1 + savings deposits of post office savings banks",
    shortFormula: "M1 + post-office savings deposits",
    liquidityRank: 2,
    sourceIds: aggregates,
    sourceFactIds: ["eco-cp007-m2"],
  },
  {
    id: "m3",
    aggregate: "M3",
    classification: "Broad money",
    formula: "M1 + time deposits with the banking system",
    shortFormula: "M1 + time deposits with banks",
    liquidityRank: 3,
    sourceIds: aggregates,
    sourceFactIds: ["eco-cp007-m3"],
  },
  {
    id: "m4",
    aggregate: "M4",
    classification: "Broad money",
    formula: "M3 + all deposits with post office savings banks excluding National Savings Certificates",
    shortFormula: "M3 + total post-office deposits excluding NSCs",
    liquidityRank: 4,
    sourceIds: aggregates,
    sourceFactIds: ["eco-cp007-m4"],
  },
] as const);

export const ECO_CP007_FUNCTION_SCENARIOS_V1 = Object.freeze([
  { id: "fn-1", stem: "A shopkeeper accepts money instead of demanding another good in exchange.", answer: "Medium of exchange", explanation: "Money removes the need for direct barter because it is generally accepted in exchange." },
  { id: "fn-2", stem: "A laptop is priced at ₹50,000 and a book at ₹500.", answer: "Unit of account", explanation: "Money gives a common unit for quoting and comparing the values of different goods." },
  { id: "fn-3", stem: "A person keeps money today to spend several months later.", answer: "Store of value", explanation: "Money can carry purchasing power from the present into the future, although inflation can reduce that purchasing power." },
  { id: "fn-4", stem: "A loan contract states that ₹20,000 will be repaid next year.", answer: "Standard of deferred payment", explanation: "Money provides the unit in which a future debt is stated and later settled." },
] as const);

export const ECO_CP007_DEPOSIT_SCENARIOS_V1 = Object.freeze([
  { id: "dep-1", stem: "A balance can be withdrawn whenever the account holder asks for it.", answer: "Demand deposit", explanation: "A demand deposit is payable on demand rather than after a fixed maturity period." },
  { id: "dep-2", stem: "A deposit is placed for a fixed maturity period.", answer: "Time deposit", explanation: "A time deposit has a specified period to maturity, unlike a demand deposit." },
  { id: "dep-3", stem: "A current-account balance can be used to make payments without waiting for maturity.", answer: "Demand deposit", explanation: "Current-account funds are payable on demand, so they are demand deposits." },
  { id: "dep-4", stem: "A fixed deposit matures after a stated period.", answer: "Time deposit", explanation: "A fixed deposit is a time deposit because withdrawal is linked to a maturity period." },
] as const);

export const ECO_CP007_MULTIPLIER_CASES_V1 = Object.freeze([
  { id: "mul-1", reserve: 100, money: 400, multiplier: 4 },
  { id: "mul-2", reserve: 200, money: 1000, multiplier: 5 },
  { id: "mul-3", reserve: 250, money: 750, multiplier: 3 },
  { id: "mul-4", reserve: 300, money: 1200, multiplier: 4 },
] as const);
