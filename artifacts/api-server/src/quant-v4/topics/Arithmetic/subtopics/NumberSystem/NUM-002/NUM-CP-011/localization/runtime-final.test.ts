import assert from "node:assert/strict";

import { NUM_CP011_PERMANENT_QL_IDS, type NumCp011PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp011LocalizedFinal } from "./runtime-final.ts";
import type { NumCp011LocalizedLanguage } from "./types.ts";

const languages: readonly NumCp011LocalizedLanguage[] = ["hi", "pa"];
let packages = 0;
let answerBindings = 0;
let textualNoSolutionBindings = 0;

for (const qlId of NUM_CP011_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 80; seed += 1) {
    for (const language of languages) {
      const q = generateNumCp011LocalizedFinal(qlId as NumCp011PermanentQlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;
      assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier drift`);
      assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct-option binding drift`);
      assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation-final binding drift`);
      assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      answerBindings += 1;

      if (q.temporaryPrototypeId === "NUM-CP011-PROT-008" && !/^\{|^\d/u.test(q.canonicalAnswer)) {
        const expected = language === "hi" ? "कोई धनात्मक पूर्णांक n नहीं" : "ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ";
        assert.equal(q.canonicalAnswer, expected, `${label}: textual no-solution answer drift`);
        textualNoSolutionBindings += 1;
      }
      packages += 1;
    }
  }
}

assert.equal(packages, 13 * 80 * 2);
assert.equal(answerBindings, packages);
assert.ok(textualNoSolutionBindings >= 20, `Expected repeated localized no-solution bindings, got ${textualNoSolutionBindings}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_HI_PA_FINAL_BINDING",
  packages,
  answerBindings,
  textualNoSolutionBindings,
  downstreamActivations: 0,
}, null, 2));
