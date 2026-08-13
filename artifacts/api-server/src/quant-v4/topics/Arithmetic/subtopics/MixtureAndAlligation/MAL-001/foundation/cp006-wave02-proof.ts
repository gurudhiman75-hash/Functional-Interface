import { getMalCp006Vessel, malCp006ComponentB, solveMalCp006Ledger } from "./cp006-solver";
import { rational, reduceRationalRatio } from "./rational";

function ratioOf(first: ReturnType<typeof rational>, second: ReturnType<typeof rational>): string {
  const [a, b] = reduceRationalRatio(first, second);
  return `${a.numerator}:${b.numerator}`;
}

export function proveMalCp006Wave02CatWitness(): boolean {
  const result = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(60), componentA: rational(60) },
      { id: "B", volume: rational(60), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(16) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(16) },
    ],
  );
  const a = getMalCp006Vessel(result, "A");
  return ratioOf(a.componentA, malCp006ComponentB(a)) === "15:4";
}

export function proveMalCp006Wave02IbpsWitness(): boolean {
  const result = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(400), componentA: rational(400) },
      { id: "B", volume: rational(220), componentA: rational(0) },
      { id: "C", volume: rational(0), componentA: rational(0) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(80) },
      { kind: "TRANSFER", from: "B", to: "C", amount: rational(60) },
    ],
  );
  const b = getMalCp006Vessel(result, "B");
  const c = getMalCp006Vessel(result, "C");
  return b.componentA.numerator === 64n && b.componentA.denominator === 1n &&
    ratioOf(malCp006ComponentB(c), c.componentA) === "11:4";
}

export function proveMalCp006Wave02GeneralInverseWitness(): boolean {
  const result = solveMalCp006Ledger(
    [
      { id: "A", volume: rational(100), componentA: rational(60) },
      { id: "B", volume: rational(80), componentA: rational(32) },
    ],
    [
      { kind: "TRANSFER", from: "A", to: "B", amount: rational(20) },
      { kind: "TRANSFER", from: "B", to: "A", amount: rational(50) },
    ],
  );
  const a = getMalCp006Vessel(result, "A");
  const bAfterFirst = result.snapshots[1].vessels.find((v) => v.id === "B")!;
  return ratioOf(bAfterFirst.componentA, malCp006ComponentB(bAfterFirst)) === "11:14" &&
    ratioOf(a.componentA, malCp006ComponentB(a)) === "7:6";
}

export function proveMalCp006Wave02InverseVariants(): number {
  const pairs = [[40,10],[48,16],[60,12],[60,15],[60,20],[70,28],[72,24],[80,20],[84,28],[90,18],[96,32],[100,25],[105,42],[108,36],[120,30],[120,40]] as const;
  let passed = 0;
  for (const [v, x] of pairs) {
    const result = solveMalCp006Ledger(
      [{ id: "A", volume: rational(v), componentA: rational(v) }, { id: "B", volume: rational(v), componentA: rational(0) }],
      [{ kind: "TRANSFER", from: "A", to: "B", amount: rational(x) }, { kind: "TRANSFER", from: "B", to: "A", amount: rational(x) }],
    );
    const a = getMalCp006Vessel(result, "A");
    if (ratioOf(a.componentA, malCp006ComponentB(a)) === ratioOf(rational(v), rational(x))) passed += 1;
  }
  return passed;
}
