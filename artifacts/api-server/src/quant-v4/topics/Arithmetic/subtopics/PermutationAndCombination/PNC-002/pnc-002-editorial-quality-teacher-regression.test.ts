import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "./foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "./foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "./foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "./foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "./foundation/cp012-mixed-runtime-reviewed";
import { buildPnc002ReviewedTeacherStudentPresentation } from "./foundation/student-presentation-teacher-reviewed";
import type { PncStudentPresentation, PncStudentSourcePackage } from "./foundation/student-presentation";

type ValidatedSourcePackage = PncStudentSourcePackage & {
  validation: { valid: boolean };
  publiclyPublishable: boolean;
};

type Entry = { qlId: string; run: () => ValidatedSourcePackage };

const entries: Entry[] = [
  ...getPnc002QuestionEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
  ...getCp011GroupingEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave1Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave2Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
  ...getCp011InverseEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
  ...getCp012Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-teacher-regression:${entry.qlId}` }),
  })),
];

assert.equal(entries.length, 163);

function section(presentation: PncStudentPresentation, kind: string): string[] {
  return presentation.explanationSections.find((item) => item.kind === kind)?.lines ?? [];
}

const byQl = new Map<string, PncStudentPresentation>();
const failures: string[] = [];
const thirdPersonAfterSecondPerson = /\b(?:you|and|or)\s+(?:uses|ignores|counts|omits|treats|misses|duplicates|handles|fails|chooses|reverses|confuses|applies|divides|forms|arranges|stops|drops|adds|represents)\b/i;

for (const entry of entries) {
  try {
    const source = entry.run();
    assert.equal(source.validation.valid, true);
    assert.equal(source.publiclyPublishable, false);
    const presentation = buildPnc002ReviewedTeacherStudentPresentation(source);
    byQl.set(entry.qlId, presentation);

    const steps = section(presentation, "stepByStep");
    const unnumbered = steps.map((line) => line.replace(/^\d+\.\s*/, ""));
    const expansionIndexes = unnumbered
      .map((line, index) => (/^\*\*(?:Expand|Evaluate)/.test(line) ? index : -1))
      .filter((index) => index >= 0);
    const formulaIndex = unnumbered.findIndex((line) => /^\*\*(?:Combine|Calculate|Substitute)/.test(line));
    if (formulaIndex >= 0 && expansionIndexes.length > 0) {
      assert.ok(formulaIndex > Math.max(...expansionIndexes), `${entry.qlId}: formula appears before an arithmetic expansion`);
    }

    for (const line of unnumbered) {
      const display = line.match(/\$\$([^$]+)\$\$/)?.[1];
      if (!display) continue;
      const equality = display.match(/^\s*([\d,]+)\s*=\s*([\d,]+)\s*$/);
      assert.ok(!equality || equality[1] !== equality[2], `${entry.qlId}: redundant numeric equality remains`);
      if (/^\*\*Combine/.test(line)) {
        assert.ok(!/^\d{3,}\s*=/.test(display), `${entry.qlId}: concatenated numeric factors remain`);
        assert.ok(!/\d+!/.test(display), `${entry.qlId}: unevaluated factorial remains in a combined numeric line`);
        assert.ok(!/\d{2,}\d+!/.test(display), `${entry.qlId}: a numeric factor was concatenated with a factorial`);
      }
    }

    const traps = section(presentation, "commonTrapWarning");
    assert.equal(traps.length, 3);
    assert.ok(traps.every((line) => !thirdPersonAfterSecondPerson.test(line)), `${entry.qlId}: trap grammar still mixes second- and third-person verbs`);
  } catch (error) {
    failures.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

assert.deepEqual(failures, []);

function joined(qlId: string, kind: string): string {
  const presentation = byQl.get(qlId);
  assert.ok(presentation, `${qlId}: presentation missing`);
  return [presentation.explanationSections.find((item) => item.kind === kind)?.heading ?? "", ...section(presentation, kind)].join(" ");
}

for (const qlId of ["PNC-QL-211", "PNC-QL-212", "PNC-QL-213", "PNC-QL-214", "PNC-QL-217", "PNC-QL-218"]) {
  assert.match(joined(qlId, "coreConcept"), /unlabelled|interchangeable|whole-group symmetry/i);
  assert.doesNotMatch(joined(qlId, "coreConcept"), /group names make|names already distinguish/i);
  assert.match(joined(qlId, "examSpeedShortcut"), /divide|interchangeable|unlabelled/i);
  assert.doesNotMatch(joined(qlId, "commonTrapWarning"), /group names distinguish|names already distinguish/i);
}

for (const qlId of ["PNC-QL-226", "PNC-QL-227", "PNC-QL-228"]) {
  assert.match(joined(qlId, "coreConcept"), /different objects|Stirling|Bell/i);
  assert.doesNotMatch(joined(qlId, "coreConcept"), /objects are identical|identical objects/i);
  assert.match(joined(qlId, "examSpeedShortcut"), /Stirling|Bell/i);
}

for (const qlId of [
  "PNC-QL-229", "PNC-QL-230", "PNC-QL-231", "PNC-QL-232", "PNC-QL-233", "PNC-QL-234",
  "PNC-QL-235", "PNC-QL-236", "PNC-QL-237", "PNC-QL-238", "PNC-QL-262", "PNC-QL-263",
  "PNC-QL-265", "PNC-QL-266",
]) {
  assert.match(joined(qlId, "coreConcept"), /identical|occupanc|stars and bars|partition/i);
  assert.doesNotMatch(joined(qlId, "coreConcept"), /Different objects make different assignments/i);
  assert.doesNotMatch(joined(qlId, "examSpeedShortcut"), /Different objects suggest repeated receiver choices/i);
}

assert.doesNotMatch(joined("PNC-QL-107", "examSpeedShortcut"), /not together|total minus forbidden/i);
assert.match(joined("PNC-QL-107", "examSpeedShortcut"), /one block|internal block orders/i);
assert.match(joined("PNC-QL-236", "coreConcept"), /bounded|capacity|identical/i);
assert.match(joined("PNC-QL-236", "examSpeedShortcut"), /inclusion–exclusion|capacity/i);
assert.doesNotMatch(joined("PNC-QL-236", "coreConcept"), /different object/i);

const ql269Steps = joined("PNC-QL-269", "stepByStep");
assert.match(ql269Steps, /10\s*\\times\s*3\s*\\times\s*16\s*=\s*480/);
assert.doesNotMatch(ql269Steps, /10316/);
assert.match(joined("PNC-QL-269", "coreConcept"), /quota|captain/i);

for (const qlId of ["PNC-QL-212", "PNC-QL-214", "PNC-QL-246", "PNC-QL-248", "PNC-QL-249", "PNC-QL-267"]) {
  const steps = joined(qlId, "stepByStep");
  assert.doesNotMatch(steps, /286!|10104!|3520\s*6|\}\s*16\s*=|\^\{\d+\}\s+\d+\s*=/);
}

console.log(JSON.stringify({
  packageId: "PNC-002",
  qlCount: byQl.size,
  regressionStandard: "NO_FORMULA_CONCATENATION_NO_REDUNDANT_EQUALITY_CORRECT_IDENTITY_GRAMMATICAL_TRAPS",
  status: "PASS",
}, null, 2));
