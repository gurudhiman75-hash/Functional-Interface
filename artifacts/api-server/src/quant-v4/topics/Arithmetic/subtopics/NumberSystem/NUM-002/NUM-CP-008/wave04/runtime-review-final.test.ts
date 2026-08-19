import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave04Package } from "./runtime.ts";
import { generateNumCp008Wave04Reviewed } from "./runtime-review-final.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let packages = 0;
let parityChecks = 0;
let answerBindingChecks = 0;
let workedReviewChecks = 0;
const multiplicityClasses = new Set<string>();
const stemFamilies: Record<string, Set<string>> = Object.fromEntries(NUM_CP008_WAVE04_PROTOTYPE_IDS.map((id) => [id, new Set<string>()]));

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const source = generateNumCp008Wave04Package(prototypeId, seed);
    const reviewed = generateNumCp008Wave04Reviewed(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(reviewed.seed === source.seed, `${label}: seed drift`);
    assert(reviewed.temporaryPrototypeId === source.temporaryPrototypeId, `${label}: prototype drift`);
    assert(reviewed.stem === source.stem, `${label}: stem drift`);
    assert(JSON.stringify(reviewed.options) === JSON.stringify(source.options), `${label}: option drift`);
    assert(reviewed.correctIndex === source.correctIndex, `${label}: correct-index drift`);
    assert(reviewed.canonicalAnswer === source.canonicalAnswer, `${label}: canonical-answer drift`);
    assert(reviewed.verifierAnswer === source.verifierAnswer, `${label}: verifier-answer drift`);
    assert(reviewed.difficulty === source.difficulty, `${label}: difficulty drift`);
    assert(reviewed.mathematicalFingerprint === source.mathematicalFingerprint, `${label}: fingerprint drift`);
    assert(JSON.stringify(reviewed.hiddenState) === JSON.stringify(source.hiddenState), `${label}: hidden-state drift`);
    assert(JSON.stringify(reviewed.lifecycle) === JSON.stringify(source.lifecycle), `${label}: lifecycle drift`);
    parityChecks += 1;

    assert(reviewed.options.length === 4, `${label}: option count`);
    assert(new Set(reviewed.options.map((option) => option.value)).size === 4, `${label}: duplicate options`);
    assert(reviewed.options.filter((option) => option.isCorrect).length === 1, `${label}: keyed-answer count`);
    assert(reviewed.options[reviewed.correctIndex]?.value === reviewed.canonicalAnswer, `${label}: answer binding`);
    assert(reviewed.explanation.finalAnswer === reviewed.canonicalAnswer, `${label}: explanation answer drift`);
    answerBindingChecks += 1;

    const working = reviewed.explanation.steps.join(" ");
    assert(!/generator|prototype|fingerprint|hidden state|authority package/i.test(working), `${label}: implementation vocabulary leak`);
    if (prototypeId === "NUM-CP008-PROT-025") {
      multiplicityClasses.add(reviewed.canonicalAnswer);
      const merged = (reviewed.hiddenState as Record<string, unknown>).merged;
      if (merged) {
        assert(/Write \$x=/.test(working) && /least \$k\$ that works/.test(working) && /final class/.test(working), `${label}: compatible CRT working hidden`);
      } else {
        assert(/For compatibility/.test(working) && /cannot hold together/.test(working) && /no common residue class/.test(working), `${label}: incompatibility proof hidden`);
      }
    } else {
      assert(reviewed.explanation.steps.length === 3, `${label}: triple-set worked step count`);
      assert(/Write \$x=/.test(working) && /least \$k\$ that works/.test(working) && /all the required integers/.test(working), `${label}: complete triple-set CRT work hidden`);
    }
    workedReviewChecks += 1;

    const normalizedStem = reviewed.stem
      .replace(/\d+/g, "#")
      .replace(/\\equiv #/g, "\\equiv #")
      .replace(/\s+/g, " ")
      .trim();
    stemFamilies[prototypeId]!.add(normalizedStem);
    packages += 1;
  }
}

assert(packages === 240, `Expected 240 reviewed packages, got ${packages}`);
assert(multiplicityClasses.size === 3, `Expected all three multiplicity classes, got ${[...multiplicityClasses].join(", ")}`);
for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  assert(stemFamilies[prototypeId]!.size >= 3, `${prototypeId}: expected at least three stem families`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE04_FINAL_WORKED_REVIEW",
  packages,
  parityChecks,
  answerBindingChecks,
  workedReviewChecks,
  multiplicityClasses: [...multiplicityClasses].sort(),
  stemFamilies: Object.fromEntries(Object.entries(stemFamilies).map(([id, values]) => [id, values.size])),
  learnerBlockers: 0,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
}, null, 2));
