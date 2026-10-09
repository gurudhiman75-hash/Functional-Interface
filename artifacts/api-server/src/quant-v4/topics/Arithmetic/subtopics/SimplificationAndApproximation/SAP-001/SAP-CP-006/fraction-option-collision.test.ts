import assert from "node:assert/strict";
import { generateSapCp006 } from "./runtime";

const ids = ["SAP-CP006-PROT-EQUIVALENT-EXPRESSION", "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT"] as const;
for (const id of ids) {
  for (let seed = 1; seed <= 2000; seed++) {
    const row = generateSapCp006(id, seed);
    const { a, b, p } = row.oracle.data;
    const targetN = BigInt(a! * 100 + p! * b!), targetD = BigInt(b! * 100);
    const values = row.options.map(option => {
      const fraction = option.value.split(" = ").at(-1)!;
      const [n, d] = fraction.split("/").map(BigInt);
      assert.ok(d! > 0n);
      assert.equal(n! * targetD === targetN * d!, option.isCorrect);
      return { n: n!, d: d! };
    });
    for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
      assert.notEqual(values[i]!.n * values[j]!.d, values[j]!.n * values[i]!.d);
    }
    assert.equal(row.options.length, 4);
    assert.equal(row.options.filter(option => option.isCorrect).length, 1);
    assert.equal(row.validation.ok, true);
  }
}
console.log("SAP CP006 fraction options: PASS 4,000 cases including regression seeds 394 and 1486; distinct exact values and one correct answer");
