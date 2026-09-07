import { generateDi008ArithmeticSet, type Di008ExamProfile } from "./index";
import { ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";

const profiles: readonly Di008ExamProfile[] = ["BANKING_PRELIMS", "BANKING_MAINS"];
const failures: Array<{ seed: string; profile: Di008ExamProfile; error: string }> = [];

function q(numerator: number, denominator: number): string {
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const sign = numerator < 0 ? "-" : "";
  if (fraction === 0) return `${sign}${whole}`;
  if (fraction % 10 === 0) return `${sign}${whole}.${fraction / 10}`;
  return `${sign}${whole}.${String(fraction).padStart(2, "0")}`;
}
const pct = (n: number, d: number) => `${q(n * 100, d)}%`;

function diagnoseSeed99() {
  const seed = "DI-008-PHASE7-99";
  const previousUnits = shuffle(seededRandom(`${seed}:previous-units`), [200, 240, 280, 320, 360] as const);
  const growthRates = shuffle(seededRandom(`${seed}:growth-rates`), [10, 20, 25, 40, 50] as const);
  const costs = shuffle(seededRandom(`${seed}:costs`), [40, 60, 80, 100, 120] as const);
  const profitRates = shuffle(seededRandom(`${seed}:profit-rates`), [10, 20, 25, 40, 50] as const);
  const rows = previousUnits.map((unitsPrevious, index) => ({
    unitsPrevious,
    unitsCurrent: (unitsPrevious * (100 + growthRates[index]!)) / 100,
    costPerUnit: costs[index]!,
    sellingPricePerUnit: (costs[index]! * (100 + profitRates[index]!)) / 100,
  }));
  const order = shuffle(seededRandom(`${seed}:BANKING_MAINS:roles`), [0, 1, 2, 3, 4] as const);
  const sumUnits = (indices: readonly number[], current: boolean) => indices.reduce((s, i) => s + (current ? rows[i]!.unitsCurrent : rows[i]!.unitsPrevious), 0);
  const revenue = (indices: readonly number[]) => indices.reduce((s, i) => s + rows[i]!.unitsCurrent * rows[i]!.sellingPricePerUnit, 0);
  const cost = (indices: readonly number[]) => indices.reduce((s, i) => s + rows[i]!.unitsCurrent * rows[i]!.costPerUnit, 0);
  const change = [order[0]!, order[1]!];
  const ratioLeft = [order[0]!, order[1]!];
  const ratioRight = [order[2]!, order[3]!];
  const profit = [order[1]!, order[4]!];
  const average = order.slice(0, 4);
  const share = [order[2]!, order[4]!];
  const oldUnits = sumUnits(change, false); const newUnits = sumUnits(change, true); const diff = newUnits - oldUnits;
  const leftRev = revenue(ratioLeft); const rightRev = revenue(ratioRight); const leftUnits = sumUnits(ratioLeft, true); const rightUnits = sumUnits(ratioRight, true); const leftCost = cost(ratioLeft); const rightCost = cost(ratioRight);
  const aggCost = cost(profit); const aggRev = revenue(profit); const aggProfit = aggRev - aggCost;
  const avgProfit = revenue(average) - cost(average);
  const selectedRev = revenue(share); const all = [0,1,2,3,4]; const allRev = revenue(all); const selectedUnits = sumUnits(share,true); const allUnits = sumUnits(all,true); const selectedCost = cost(share); const allCost = cost(all);
  const candidates = {
    UNITS_PERCENT_CHANGE: [pct(diff, oldUnits), `${diff}%`, pct(diff,newUnits), pct(newUnits,oldUnits), pct(oldUnits,newUnits), pct(diff,oldUnits+newUnits)],
    REVENUE_RATIO: [ratioDisplay(leftRev,rightRev), ratioDisplay(rightRev,leftRev), ratioDisplay(leftUnits,rightUnits), ratioDisplay(leftCost,rightCost), ratioDisplay(leftRev,leftRev+rightRev), ratioDisplay(rightRev,leftRev+rightRev)],
    PROFIT_PERCENT: [pct(aggProfit,aggCost), pct(aggProfit,aggRev), pct(aggRev,aggCost), pct(aggCost,aggRev), pct(aggProfit,aggCost+aggRev), pct(aggCost,aggProfit)],
    AVERAGE_PROFIT_PER_PRODUCT: [`₹${q(avgProfit,average.length)}`, `₹${avgProfit}`, `₹${q(avgProfit,average.length-1)}`, `₹${q(avgProfit,average.length+1)}`, `₹${q(revenue(average),average.length)}`, `₹${q(cost(average),average.length)}`],
    REVENUE_SHARE_OF_TOTAL: [pct(selectedRev,allRev), pct(selectedUnits,allUnits), pct(selectedCost,allCost), pct(allRev-selectedRev,allRev), pct(selectedRev,allRev-selectedRev), pct(selectedUnits,sumUnits(all,false))],
  };
  console.log(JSON.stringify({ seed, rows, order, candidates, uniqueCounts: Object.fromEntries(Object.entries(candidates).map(([k,v]) => [k, new Set(v).size])) }));
}

diagnoseSeed99();

for (let seedIndex = 1; seedIndex <= 100; seedIndex += 1) {
  const seed = `DI-008-PHASE7-${seedIndex}`;
  for (const profile of profiles) {
    try {
      generateDi008ArithmeticSet({ seed, examProfile: profile });
    } catch (error) {
      failures.push({ seed, profile, error: error instanceof Error ? error.message : String(error) });
    }
  }
}

console.log(JSON.stringify({ failureStateCount: failures.length, examples: failures.slice(0, 10) }));
if (failures.length) throw new Error(`DI-008 option/generation scan found ${failures.length} failing states.`);
console.log("PASS_DI_008_OPTION_COLLISION_SCAN");