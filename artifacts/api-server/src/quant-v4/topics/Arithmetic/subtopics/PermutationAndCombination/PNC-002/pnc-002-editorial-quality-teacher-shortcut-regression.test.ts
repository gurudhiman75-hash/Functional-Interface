import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import { runPnc002Pipeline } from "./foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "./foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "./foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "./foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "./foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "./foundation/cp012-mixed-runtime-reviewed";
import { buildPnc002ProductionTeacherStudentPresentation } from "./foundation/student-presentation-teacher-production";
import type { PncStudentSourcePackage } from "./foundation/student-presentation";

type ValidatedSourcePackage = PncStudentSourcePackage & {
  validation: { valid: boolean };
  publiclyPublishable: boolean;
};

type Entry = { qlId: string; run: () => ValidatedSourcePackage };

const entries: Entry[] = [
  ...getPnc002QuestionEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
  ...getCp011GroupingEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011GroupingPipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave1Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
  ...getCp011DistributionWave2Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
  ...getCp011InverseEntries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
  ...getCp012Entries().map((entry) => ({
    qlId: entry.qlId,
    run: () => runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `pnc-shortcut-regression:${entry.qlId}` }),
  })),
];

assert.equal(entries.length, 163);
const failures: string[] = [];
const shortcuts = new Map<string, string>();

for (const entry of entries) {
  try {
    const source = entry.run();
    assert.equal(source.validation.valid, true);
    assert.equal(source.publiclyPublishable, false);
    const presentation = buildPnc002ProductionTeacherStudentPresentation(source);
    const shortcut = presentation.explanationSections.find((section) => section.kind === "examSpeedShortcut");
    assert.ok(shortcut);
    assert.equal(shortcut.lines.length, 1);
    const line = shortcut.lines[0]!;
    shortcuts.set(entry.qlId, line);
    assert.ok(line.includes("$"), `${entry.qlId}: shortcut is not tied to its formula`);
    assert.doesNotMatch(line, /Write the structural factors before multiplying|Write the counting stages separately/i);
  } catch (error) {
    failures.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

assert.deepEqual(failures, []);

const expectedPatterns: Record<string, RegExp> = {
  "PNC-QL-125": /fixed position|compulsory item/i,
  "PNC-QL-126": /end/i,
  "PNC-QL-127": /two ends/i,
  "PNC-QL-129": /equally likely orders|divide/i,
  "PNC-QL-133": /starting patterns|alternation/i,
  "PNC-QL-140": /position set|particular items/i,
  "PNC-QL-153": /exact quota/i,
  "PNC-QL-155": /allowed category|disjoint case/i,
  "PNC-QL-159": /total committees minus/i,
  "PNC-QL-161": /positive quota splits/i,
  "PNC-QL-162": /specially identified set/i,
  "PNC-QL-165": /both particular members/i,
  "PNC-QL-166": /forbidden case/i,
  "PNC-QL-188": /circular block|neighbour/i,
  "PNC-QL-191": /clockwise position/i,
  "PNC-QL-194": /clockwise orders/i,
  "PNC-QL-222": /all labelled assignments minus|onto/i,
  "PNC-QL-223": /multinomial/i,
  "PNC-QL-224": /specified receiver/i,
  "PNC-QL-256": /which one.*stays fixed|other card/i,
  "PNC-QL-257": /inclusion–exclusion/i,
  "PNC-QL-264": /occupancy vectors|capacity/i,
};

for (const [qlId, pattern] of Object.entries(expectedPatterns)) {
  assert.match(shortcuts.get(qlId) ?? "", pattern, `${qlId}: family-specific shortcut missing`);
}

console.log(JSON.stringify({
  packageId: "PNC-002",
  qlCount: shortcuts.size,
  genericShortcutFallbackCount: 0,
  status: "PASS",
}, null, 2));
