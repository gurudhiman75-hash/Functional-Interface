import assert from "node:assert/strict";
import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2,
  LP_001_008_LOCALIZED_GENERATORS_V2,
  type Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v2.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2.localizationFreezeStatus, "NOT_FROZEN");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2.questionStudioActivation, "NOT_ENABLED_UNTIL_HUMAN_APPROVAL");

function rows(child: any): string[][] {
  for (let index = child.explanation.lines.length - 1; index >= 0; index -= 1) {
    const block = child.explanation.lines[index] as string;
    const lines = block.split("\n").filter((line) => line.trim().startsWith("|"));
    if (lines.length >= 3) return lines.slice(2).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  }
  throw new Error(`Missing final table for ${child.questionId}`);
}

function tail(stem: string): string { return stem.split(/\n\s*\n/gu).map((part) => part.trim()).filter(Boolean).at(-1) ?? stem; }
function answerPeople(answer: string): string[] { return answer.split(";").map((part) => part.split("—")[0]!.trim()).filter(Boolean); }
function slotLabel(caselet: any, slot: number): string { return `${slot % 2 === 0 ? "12th" : "27th"} ${caselet.labels.months[Math.floor(slot / 2)]}`; }
function englishTargetIndex(labels: readonly string[], question: string): number { const index = labels.findIndex((label) => question.includes(label)); assert.ok(index >= 0, `Could not resolve English target in: ${question}`); return index; }

const bannedLatinNames = ["Ishita", "Arjun", "Vivek", "Zubin", "Tina", "Nitin", "Rupa"];

for (const language of ["hi", "pa"] as const satisfies readonly Lp001008LocalizedLanguage[]) {
  for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V2)) {
    const batch = generator(language, `target-parity-v2:${packageId}:${language}`, 4);
    for (const caselet of batch) {
      const visible = [caselet.scenario, ...caselet.learnerFacingClues, ...caselet.children.flatMap((child) => [child.stem, ...child.options, child.answer, child.explanation.summary, ...child.explanation.lines])].join("\n");
      for (const name of bannedLatinNames) assert.ok(!visible.includes(name), `${packageId}/${language}: untranslated name ${name}`);

      if (packageId === "LP-006") {
        const english: any = caselet.englishCaselet;
        const englishPeople = english.people.map((id: string) => english.labels.people[id]);
        for (const child of caselet.children.filter((item) => ["LP-QL-021", "LP-QL-022", "LP-QL-023"].includes(item.qlId))) {
          const question = tail((child.englishChild as any).stem);
          const personIndex = englishTargetIndex(englishPeople, question);
          const table = rows(child);
          const person = table[personIndex]![0]!;
          assert.ok(child.stem.includes(person), `${packageId}/${language}/${child.qlId}: wrong person target`);
          const column = child.qlId === "LP-QL-021" ? 1 : child.qlId === "LP-QL-022" ? 2 : 3;
          assert.equal(child.answer, table[personIndex]![column], `${packageId}/${language}/${child.qlId}: answer does not belong to translated target`);
        }
      }

      if (packageId === "LP-007") {
        const english: any = caselet.englishCaselet;
        const englishPeople = english.people.map((id: string) => english.labels.people[id]);
        const englishValues = english.values.map((id: string) => english.labels.values[id]);
        for (const child of caselet.children) {
          const table = rows(child);
          const question = tail((child.englishChild as any).stem);
          if (child.qlId === "LP-QL-025") {
            const personIndex = englishTargetIndex(englishPeople, question);
            assert.ok(child.stem.includes(table[personIndex]![0]!), `${packageId}/${language}/${child.qlId}: wrong person target`);
            assert.equal(child.answer, table[personIndex]![1], `${packageId}/${language}/${child.qlId}: answer does not match target row`);
          } else if (child.qlId === "LP-QL-026") {
            const valueIndex = englishTargetIndex(englishValues, question);
            const valueId = english.values[valueIndex];
            const personIndex = english.people.findIndex((person: string) => english.assignment[person] === valueId);
            const value = table[personIndex]![1]!;
            assert.ok(child.stem.includes(value), `${packageId}/${language}/${child.qlId}: wrong value target`);
            assert.equal(child.answer, table[personIndex]![0], `${packageId}/${language}/${child.qlId}: reverse lookup answer mismatch`);
          } else {
            const people = answerPeople(child.answer);
            const expectedCount = child.qlId === "LP-QL-027" ? 2 : 3;
            assert.equal(people.length, expectedCount);
            for (const person of people) assert.ok(child.stem.includes(person), `${packageId}/${language}/${child.qlId}: named target missing: ${person}`);
          }
        }
      }

      if (packageId === "LP-008") {
        const english: any = caselet.englishCaselet;
        const englishPeople = english.people.map((id: string) => english.labels.people[id]);
        const englishSlots = english.slots.map((slot: number) => slotLabel(english, slot));
        for (const child of caselet.children) {
          const table = rows(child);
          const question = tail((child.englishChild as any).stem);
          if (child.qlId === "LP-QL-029") {
            const slotIndex = englishTargetIndex(englishSlots, question);
            const targetSlot = english.slots[slotIndex];
            const personIndex = english.people.findIndex((person: string) => english.assignment[person] === targetSlot);
            assert.ok(child.stem.includes(table[personIndex]![1]!), `${packageId}/${language}/${child.qlId}: wrong date-month target`);
            assert.equal(child.answer, table[personIndex]![0], `${packageId}/${language}/${child.qlId}: date-to-person answer mismatch`);
          } else if (child.qlId === "LP-QL-030") {
            const personIndex = englishTargetIndex(englishPeople, question);
            assert.ok(child.stem.includes(table[personIndex]![0]!), `${packageId}/${language}/${child.qlId}: wrong person target`);
            assert.equal(child.answer, table[personIndex]![1], `${packageId}/${language}/${child.qlId}: person-to-date answer mismatch`);
          } else {
            const people = answerPeople(child.answer);
            const expectedCount = child.qlId === "LP-QL-031" ? 2 : 3;
            assert.equal(people.length, expectedCount);
            for (const person of people) assert.ok(child.stem.includes(person), `${packageId}/${language}/${child.qlId}: named target missing: ${person}`);
          }
        }
      }
    }
  }
}

console.log("LP-001..008 localization V2 target-parity guard passed: LP-006/007/008 translated stems ask about the same semantic target as frozen English and their marked answers match the final table.");
