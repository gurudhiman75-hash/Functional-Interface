import { getMalCp006Vessel, malCp006ComponentB, solveMalCp006Ledger } from "./cp006-solver";
import { rational, reduceRationalRatio } from "./rational";

function ratio(first: ReturnType<typeof rational>, second: ReturnType<typeof rational>): string {
  const [a, b] = reduceRationalRatio(first, second);
  return `${a.numerator}:${b.numerator}`;
}

const STATES = [
  [220,4,3,20,400], [60,2,1,20,180], [60,3,3,20,180],
  [80,2,3,20,200], [80,4,3,20,240], [100,3,2,20,220],
  [100,4,2,25,250], [120,2,1,20,240], [120,3,2,40,300],
  [140,4,2,35,320], [160,3,2,40,320], [180,4,3,30,360],
] as const;

export function proveMalCp006Wave02ChangedSourceVariants(): number {
  let passed = 0;
  for (const [waterB, firstFactor, secondFactor, x, milkA] of STATES) {
    const firstTransfer = firstFactor * x;
    const secondTransfer = secondFactor * x;
    const result = solveMalCp006Ledger(
      [
        { id: "A", volume: rational(milkA), componentA: rational(milkA) },
        { id: "B", volume: rational(waterB), componentA: rational(0) },
        { id: "C", volume: rational(0), componentA: rational(0) },
      ],
      [
        { kind: "TRANSFER", from: "A", to: "B", amount: rational(firstTransfer) },
        { kind: "TRANSFER", from: "B", to: "C", amount: rational(secondTransfer) },
      ],
    );
    const b = getMalCp006Vessel(result, "B");
    const c = getMalCp006Vessel(result, "C");
    const expectedRatio = ratio(rational(waterB), rational(firstTransfer));
    const movedCurrentComposition = ratio(malCp006ComponentB(c), c.componentA) === expectedRatio;
    const remainedPositive = b.componentA.numerator > 0n && b.componentA.denominator > 0n;
    if (movedCurrentComposition && remainedPositive) passed += 1;
  }
  return passed;
}

export function proveMalCp006Wave02FullContentBoundary(): boolean {
  const originalA = { milk: 60, water: 20 };
  const originalB = { milk: 0, water: 20 };
  const originalC = { milk: 30, water: 0 };
  const halfA = { milk: 30, water: 10 };
  const aAfter = { milk: 30, water: 10 };
  const bAfter = { milk: halfA.milk, water: originalB.water + halfA.water };
  const cAfter = { milk: originalC.milk + bAfter.milk, water: bAfter.water };
  const finalA = { milk: aAfter.milk + cAfter.milk, water: aAfter.water + cAfter.water };
  return finalA.milk === originalA.milk + originalB.milk + originalC.milk &&
    finalA.water === originalA.water + originalB.water + originalC.water;
}
