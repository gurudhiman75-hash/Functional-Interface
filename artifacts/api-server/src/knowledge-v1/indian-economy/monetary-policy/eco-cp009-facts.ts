export type EcoCp009Fact = {
  id: string;
  term: string;
  meaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const overview = ["RBI-MONETARY-POLICY-OVERVIEW"] as const;
const mpc = ["RBI-MPC-FRAMEWORK"] as const;

export const ECO_CP009_FACTS_V1: readonly EcoCp009Fact[] = Object.freeze([
  { id: "objective", term: "Monetary-policy objective", meaning: "maintain price stability while keeping in mind the objective of growth", sourceIds: overview, sourceFactIds: ["eco-cp009-objective"] },
  { id: "mpc-six", term: "MPC composition", meaning: "a six-member committee with three RBI members and three external members appointed by the Central Government", sourceIds: mpc, sourceFactIds: ["eco-cp009-mpc-six"] },
  { id: "mpc-vote", term: "MPC voting", meaning: "each member has one vote; the RBI Governor has a second or casting vote when votes are equally divided", sourceIds: mpc, sourceFactIds: ["eco-cp009-mpc-vote"] },
  { id: "mpc-meetings", term: "MPC meeting minimum", meaning: "the MPC must meet at least four times in a year", sourceIds: mpc, sourceFactIds: ["eco-cp009-mpc-meetings"] },
  { id: "repo", term: "Policy repo rate", meaning: "the rate at which RBI provides liquidity under LAF against eligible collateral", sourceIds: overview, sourceFactIds: ["eco-cp009-repo"] },
  { id: "sdf", term: "Standing Deposit Facility", meaning: "an overnight facility through which RBI absorbs liquidity without requiring collateral", sourceIds: ["RBI-MONETARY-POLICY-OVERVIEW", "RBI-SDF-SCHEME"], sourceFactIds: ["eco-cp009-sdf"] },
  { id: "msf", term: "Marginal Standing Facility", meaning: "an overnight borrowing facility that acts as a safety valve for banks facing unexpected liquidity shortages", sourceIds: overview, sourceFactIds: ["eco-cp009-msf"] },
  { id: "laf", term: "Liquidity Adjustment Facility", meaning: "RBI operations used to inject liquidity into or absorb liquidity from the banking system", sourceIds: overview, sourceFactIds: ["eco-cp009-laf"] },
  { id: "corridor", term: "LAF corridor", meaning: "SDF forms the floor, policy repo lies in the middle and MSF forms the ceiling", sourceIds: overview, sourceFactIds: ["eco-cp009-corridor"] },
  { id: "crr", term: "Cash Reserve Ratio", meaning: "the prescribed share of banks' net demand and time liabilities kept as cash balances with RBI", sourceIds: overview, sourceFactIds: ["eco-cp009-crr"] },
  { id: "omo", term: "Open Market Operations", meaning: "RBI purchases or sales of government securities used to change durable system liquidity", sourceIds: overview, sourceFactIds: ["eco-cp009-omo"] },
  { id: "bank-rate", term: "Bank Rate", meaning: "the rate under the RBI Act at which RBI is prepared to buy or rediscount eligible bills and commercial paper", sourceIds: overview, sourceFactIds: ["eco-cp009-bank-rate"] },
  { id: "expansionary", term: "Expansionary monetary policy", meaning: "policy actions intended to make liquidity and credit conditions easier", sourceIds: overview, sourceFactIds: ["eco-cp009-expansionary"] },
  { id: "contractionary", term: "Contractionary monetary policy", meaning: "policy actions intended to make liquidity and credit conditions tighter", sourceIds: overview, sourceFactIds: ["eco-cp009-contractionary"] },
]);

export function ecoCp009Fact(id: string) {
  const fact = ECO_CP009_FACTS_V1.find((item) => item.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-009 fact ${id}`);
  return fact;
}

export const ECO_CP009_POLICY_SCENARIOS_V1 = Object.freeze([
  { id: "ease-1", stem: "RBI wants to make short-term funding conditions easier.", answer: "Expansionary monetary policy", explanation: "Easier policy is intended to increase liquidity or reduce the cost of funds, supporting credit and spending.", factIds: ["expansionary"] },
  { id: "tighten-1", stem: "Inflation pressure is persistent and RBI wants to restrain demand.", answer: "Contractionary monetary policy", explanation: "Tighter policy makes liquidity or borrowing conditions less easy, which can moderate credit and demand pressure.", factIds: ["contractionary", "objective"] },
  { id: "omo-buy", stem: "RBI buys government securities from the market.", answer: "System liquidity tends to increase", explanation: "RBI pays for the securities, putting funds into the banking system. OMO purchases therefore inject durable liquidity.", factIds: ["omo"] },
  { id: "omo-sell", stem: "RBI sells government securities in the market.", answer: "System liquidity tends to decrease", explanation: "Buyers pay funds to RBI, drawing money out of the banking system. OMO sales therefore absorb durable liquidity.", factIds: ["omo"] },
  { id: "crr-up", stem: "RBI raises CRR, other things unchanged.", answer: "Banks have less lendable liquidity", explanation: "A larger share of bank liabilities must be kept as cash with RBI, leaving less immediately available for lending.", factIds: ["crr"] },
  { id: "crr-down", stem: "RBI lowers CRR, other things unchanged.", answer: "Banks have more lendable liquidity", explanation: "A smaller mandatory cash balance with RBI leaves more funds available within the banking system.", factIds: ["crr"] },
] as const);
