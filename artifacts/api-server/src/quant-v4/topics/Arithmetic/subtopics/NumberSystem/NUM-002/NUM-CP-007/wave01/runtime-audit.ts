import { generateNumCp007Wave01Package } from "./runtime.ts";
import { NUM_CP007_WAVE01_PROTOTYPE_IDS } from "./types.ts";
import { verifyNumCp007Wave01Package } from "./verifier.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerPrototype = 60;
let generatedAuditPackages = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let verifierViolations = 0;
let internalIdentityLeaks = 0;
const stems = new Set<string>();
const representations = new Set<string>();
const answerSemantics = new Set<string>();
const sourceFamilies = new Set<string>();

for (const prototypeId of NUM_CP007_WAVE01_PROTOTYPE_IDS) {
  for (let seed = 1001; seed < 1001 + seedsPerPrototype; seed++) {
    const pkg = generateNumCp007Wave01Package(prototypeId, seed);
    generatedAuditPackages++;
    stems.add(pkg.stem);
    representations.add(pkg.representation);
    answerSemantics.add(pkg.answerSemantic);
    pkg.sourceAncestry.forEach((source) => sourceFamilies.add(source));

    if (/NUM-CP007|PROT-|hiddenState|prototype/i.test(pkg.stem)) internalIdentityLeaks++;
    if (pkg.options.length !== 4 || new Set(pkg.options.map((option) => option.value)).size !== 4 || pkg.options.filter((option) => option.isCorrect).length !== 1) optionViolations++;
    if (verifyNumCp007Wave01Package(pkg) !== pkg.canonicalAnswer) verifierViolations++;

    const lifecycle = pkg.lifecycle;
    if (pkg.permanentQlId !== null || lifecycle.active || lifecycle.questionStudioDiscoverable || lifecycle.questionBankWritable || lifecycle.testEligible || lifecycle.publiclyPublishable) lifecycleViolations++;
  }
}

assert(stems.size >= 300, `Stem diversity is too low: ${stems.size}`);
assert(representations.size >= 4, `Representation breadth is too low: ${representations.size}`);
assert(answerSemantics.size >= 7, `Answer-semantic breadth is too low: ${answerSemantics.size}`);
assert(sourceFamilies.size >= 9, `Source-family breadth is too low: ${sourceFamilies.size}`);
assert(lifecycleViolations === 0, `Lifecycle violations: ${lifecycleViolations}`);
assert(optionViolations === 0, `Option violations: ${optionViolations}`);
assert(verifierViolations === 0, `Verifier violations: ${verifierViolations}`);
assert(internalIdentityLeaks === 0, `Internal identity leaks: ${internalIdentityLeaks}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE01_STRUCTURAL_AUDIT",
  temporaryPrototypeCount: NUM_CP007_WAVE01_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  generatedAuditPackages,
  exactAuditStems: stems.size,
  representations: [...representations].sort(),
  answerSemantics: [...answerSemantics].sort(),
  sourceFamilyCount: sourceFamilies.size,
  lifecycleViolations,
  optionViolations,
  verifierViolations,
  internalIdentityLeaks,
  permanentQlCount: 0,
}, null, 2));
