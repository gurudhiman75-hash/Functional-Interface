import assert from "node:assert/strict";
import { exactKey, formatIndianInteger } from "../foundation/exact";
import { getMenCp007PrototypeIds } from "../foundation/prototype-registry";
import { generateMenCp007Prototype } from "../foundation/runtime";
import { getMenCp007Wave01PrototypeIds } from "../gap-wave-01/registry";
import { generateMenCp007Wave01Prototype } from "../gap-wave-01/runtime";
import { getMenCp007Wave02PrototypeIds } from "../gap-wave-02/registry";
import { generateMenCp007Wave02Prototype } from "../gap-wave-02/runtime";
import { getMenCp007Wave03PrototypeIds } from "../gap-wave-03/registry";
import { generateMenCp007Wave03Prototype } from "../gap-wave-03/runtime";

interface AuditableQuestion {
  prototypeId: string;
  seed: string;
  unit: string;
  stem: string;
  options: Array<{ label: string; value: unknown; display: string; isCorrect: boolean }>;
  answer: string;
  exactAnswer: { kind: string; numerator?: bigint; denominator?: bigint };
  correctIndex: number;
  explanation: {
    keyRule: string;
    steps: Array<{ title: string; body: string; equation?: string }>;
    shortcut: string;
    traps: string[];
  };
  verification: { valid: boolean };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  permanentQlId: null;
  reviewStatus: string;
  questionBankStatus: string;
  testEligibility: string;
  publiclyPublishable: boolean;
  questionStudioDiscoverable: boolean;
}

const tracks = [
  {
    id: "foundation",
    ids: getMenCp007PrototypeIds(),
    generate: (prototypeId: string, seed: string) => generateMenCp007Prototype(prototypeId as never, seed),
  },
  {
    id: "gap-wave-01",
    ids: getMenCp007Wave01PrototypeIds(),
    generate: (prototypeId: string, seed: string) => generateMenCp007Wave01Prototype(prototypeId as never, seed),
  },
  {
    id: "gap-wave-02",
    ids: getMenCp007Wave02PrototypeIds(),
    generate: (prototypeId: string, seed: string) => generateMenCp007Wave02Prototype(prototypeId as never, seed),
  },
  {
    id: "gap-wave-03",
    ids: getMenCp007Wave03PrototypeIds(),
    generate: (prototypeId: string, seed: string) => generateMenCp007Wave03Prototype(prototypeId as never, seed),
  },
] as const;

const foreignCurrencyPattern = /[£€¥]/;
const internalTaxonomyPattern = /MEN-CP007|W[123]-PROT|PROT-|misconceptionId|(?:^|\W)(?:USED|OMITTED|REPORTED|DIVIDED|HALVED|ADDED|SUBTRACTED|COUNTED|PAINTED|CONVERTED|REVERSED|STOPPED|IGNORED|EXTRA)_[A-Z_]+/;
const rawDisplaySlashPattern = /\$\$[^$]*\/[^$]*\$\$/;
const rawPowerOrFractionPattern = /[½¼²³]/;
const hiddenControlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
const ungroupedRupeePattern = /\\text\{₹\}(\d{4,})(?![,\d])/g;
const bannedBoilerplate = [
  "Do not rebuild the full total",
  "do not rebuild the full total",
  "हर स्थान पर वही नियम लगाएँ",
  "ਹਰ ਥਾਂ ਉਹੀ ਨਿਯਮ ਲਗਾਓ",
];

const shortcutOwners = new Map<string, Set<string>>();
const prototypeCount = tracks.reduce((total, track) => total + track.ids.length, 0);
let packageCount = 0;
let currencyPackageCount = 0;

function learnerText(question: AuditableQuestion) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

function assertIndianGrouping(text: string, prototypeId: string, seed: string) {
  for (const match of text.matchAll(ungroupedRupeePattern)) {
    const digits = match[1]!;
    assert.fail(`${prototypeId} ${seed} contains an ungrouped rupee amount: ₹${digits}`);
  }
}

for (const track of tracks) {
  for (const prototypeId of track.ids) {
    const shortcutVariants = new Set<string>();

    for (let index = 0; index < 80; index += 1) {
      const seed = `men-cp007-production:${track.id}:${prototypeId}:${index}`;
      const question = track.generate(prototypeId, seed) as unknown as AuditableQuestion;
      const text = learnerText(question);
      const failureSummary = question.validation.checks
        .filter((check) => !check.passed)
        .map((check) => `${check.name}: ${check.message}`)
        .join("; ");

      assert.equal(question.validation.valid, true, `${prototypeId} ${seed}: ${failureSummary}`);
      assert.equal(question.verification.valid, true, `${prototypeId} ${seed} failed independent verification.`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => exactKey(option.value as never))).size, 4);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.options[question.correctIndex]?.isCorrect, true);
      assert.equal(question.answer, question.options[question.correctIndex]?.display);
      assert.equal(question.explanation.steps.length >= 2, true);
      assert.equal(question.explanation.traps.length, 3);
      assert.equal(foreignCurrencyPattern.test(text), false, `${prototypeId} ${seed} contains foreign currency.`);
      assert.equal(rawPowerOrFractionPattern.test(text), false, `${prototypeId} ${seed} contains raw Unicode maths.`);
      assert.equal(rawDisplaySlashPattern.test(text), false, `${prototypeId} ${seed} contains raw slash division in display maths.`);
      assert.equal(hiddenControlPattern.test(text), false, `${prototypeId} ${seed} contains a hidden control character.`);
      assert.equal(internalTaxonomyPattern.test(JSON.stringify(question.explanation)), false, `${prototypeId} ${seed} leaks internal taxonomy.`);
      assert.ok(!bannedBoilerplate.some((phrase) => text.includes(phrase)), `${prototypeId} ${seed} contains banned boilerplate.`);
      assert.ok(question.explanation.shortcut.trim().length >= 24, `${prototypeId} ${seed} has an underdeveloped shortcut.`);
      assert.ok(question.stem.endsWith("?") || question.stem.endsWith("."));
      assert.equal(question.permanentQlId, null);
      assert.equal(question.reviewStatus, "UNREVIEWED");
      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.questionStudioDiscoverable, false);

      question.options.filter((option) => !option.isCorrect).forEach((option) => {
        assert.ok(
          question.explanation.traps.some((trap) => trap.startsWith(`Option ${option.label} (${option.display}): Common mistake:`)),
          `${prototypeId} ${seed} does not explain displayed wrong option ${option.label}.`,
        );
      });

      if (question.unit.startsWith("₹")) {
        currencyPackageCount += 1;
        assert.ok(text.includes("₹"), `${prototypeId} ${seed} is a money question without the rupee symbol.`);
        assertIndianGrouping(text, prototypeId, seed);
        if (question.unit === "₹") {
          assert.ok(question.answer.startsWith("$\\text{₹}"));
          if (question.exactAnswer.kind === "RATIONAL" && question.exactAnswer.denominator === 1n && (question.exactAnswer.numerator ?? 0n) >= 1000n) {
            assert.ok(question.answer.includes(formatIndianInteger(question.exactAnswer.numerator!)));
          }
        } else {
          assert.ok(question.answer.startsWith("$\\frac{\\text{₹}"));
        }
      }

      shortcutVariants.add(question.explanation.shortcut);
      const ownerKey = `${track.id}:${prototypeId}`;
      const owners = shortcutOwners.get(question.explanation.shortcut) ?? new Set<string>();
      owners.add(ownerKey);
      shortcutOwners.set(question.explanation.shortcut, owners);
      packageCount += 1;
    }

    assert.ok(shortcutVariants.size >= 1, `${prototypeId} has no usable shortcut.`);
  }
}

const allowedPresentationEquivalentOwners = new Set([
  [
    "foundation:MEN-CP007-PROT-CUBOID-SPACE-DIAGONAL",
    "foundation:MEN-CP007-PROT-LONGEST-ROD-CUBOID",
  ].sort().join("|"),
]);
const crossContractShortcutDuplicates = [...shortcutOwners.entries()]
  .filter(([, owners]) => owners.size > 1)
  .map(([shortcut, owners]) => ({ shortcut, owners: [...owners].sort() }))
  .filter(({ owners }) => !allowedPresentationEquivalentOwners.has(owners.join("|")));
assert.deepEqual(crossContractShortcutDuplicates, [], "The same shortcut text is reused across genuinely distinct CP-007 contracts.");
assert.equal(prototypeCount, 64);
assert.equal(packageCount, 5_120);
assert.ok(currencyPackageCount > 0, "The CP-wide audit must exercise rupee cost and rate packages.");

console.log(
  `MEN-CP-007 Indian editorial production audit passed: ${packageCount} packages across ${prototypeCount} temporary contracts; ` +
  `${currencyPackageCount} rupee packages verified with Indian grouping and no foreign-currency leakage.`,
);
