import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { resolveExamIdentity } from "../artifacts/examtree/src/lib/exam-identity.ts";

test("bank recruiters take precedence over regional rural bank wording", () => {
  for (const name of ["IBPS RRB Officer Scale I", "IBPS RRB Office Assistant"]) {
    assert.deepEqual(resolveExamIdentity({ name, familyCode: "BANKING" }), {
      label: "IBPS", asset: "category-icons/ibps-library-official.png",
    });
  }
  assert.equal(resolveExamIdentity({ name: "RRB NTPC", familyCode: "RAILWAYS" }).label, "Railways");
});

test("named bodies keep their own identity rather than a broad family logo", () => {
  for (const [name, familyCode, label] of [
    ["SSC CGL", "SSC", "SSC"], ["SSC CPO", "SSC", "SSC"],
    ["SBI PO", "BANKING", "SBI"], ["RBI Grade B", "BANKING", "RBI"],
    ["NABARD Grade A", "BANKING", "NABARD"], ["SEBI Grade A", "BANKING", "SEBI"],
    ["LIC AAO", "INSURANCE", "LIC"], ["NIACL Assistant", "INSURANCE", "NIACL"],
    ["Punjab Police Constable", "PUNJAB", "Punjab Police"],
    ["PSPCL Assistant Lineman", "PUNJAB", "PSPCL"],
    ["Punjab Patwari", "PUNJAB", "PSSSB"], ["Punjab Naib Tehsildar", "PUNJAB", "PPSC"],
  ]) {
    const identity = resolveExamIdentity({ name, familyCode });
    assert.equal(identity?.label, label, name);
    if (identity.asset) assert.ok(existsSync(new URL(`../artifacts/examtree/public/${identity.asset}`, import.meta.url)), name);
  }
  assert.equal(resolveExamIdentity({ name: "SEBI Grade A", familyCode: "BANKING" }).asset, undefined);
});

test("catalog identifiers and missing authority data have bounded fallbacks", () => {
  assert.equal(resolveExamIdentity({ name: "Officer", examCode: "ibps_rrb_po", familyCode: "banking" }).label, "IBPS");
  assert.equal(resolveExamIdentity({ name: "General practice", familyCode: "railways" }).label, "Railways");
  assert.equal(resolveExamIdentity({ name: "General practice", familyCode: "insurance" }).label, "INSURE");
  assert.equal(resolveExamIdentity({ name: "Unclassified practice" }), undefined);
});
