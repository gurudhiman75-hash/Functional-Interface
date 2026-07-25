import assert from "node:assert/strict";
import { ANA_CP007_PILOT_WORDS, enabledPilotWords, pilotWordsByPattern } from "./word-registry";
import { deriveWordStructure, removeConsonants, removeVowels } from "./word-structure";

assert.equal(ANA_CP007_PILOT_WORDS.length, 80, "The v1 pilot registry should contain 80 reviewed records.");
assert.equal(new Set(ANA_CP007_PILOT_WORDS.map((entry) => entry.id)).size, ANA_CP007_PILOT_WORDS.length);
assert.equal(new Set(ANA_CP007_PILOT_WORDS.map((entry) => entry.word)).size, ANA_CP007_PILOT_WORDS.length);

for (const entry of ANA_CP007_PILOT_WORDS) {
  assert.match(entry.id, /^ANA-WORD-\d{3}$/);
  assert.match(entry.word, /^[A-Z]+$/);
  assert.ok(entry.word.length >= 4 && entry.word.length <= 10, `${entry.word} is outside the pilot length domain.`);
  assert.equal(entry.locale, "en-IN");
  assert.equal(entry.editorialStatus, "REVIEWED");
  assert.ok(entry.sourceRefs.length > 0);
  assert.deepEqual(entry.structure, deriveWordStructure(entry.word), `${entry.word} has stale derived metadata.`);
  assert.equal(entry.structure.vowels.length + entry.structure.consonants.length, entry.word.length);
  assert.equal(entry.structure.alphabetPositions.length, entry.word.length);
  assert.equal(entry.structure.equalityPattern.length, entry.word.length);
}

const enabled = enabledPilotWords();
assert.equal(enabled.length, 80);

const patternGroups = pilotWordsByPattern();
const usablePatternGroups = [...patternGroups.values()].filter((group) => group.length >= 2);
assert.ok(usablePatternGroups.length >= 4, `Only ${usablePatternGroups.length} repeated-pattern groups are currently reusable.`);
assert.ok((patternGroups.get("1-2-3-2-1")?.length ?? 0) >= 5);
assert.ok((patternGroups.get("1-2-2-1")?.length ?? 0) >= 5);
assert.ok((patternGroups.get("1-2-3-3-2-4")?.length ?? 0) >= 3);
assert.ok((patternGroups.get("1-2-2-3-4")?.length ?? 0) >= 3);

const vowelRemovalEligible = enabled.filter((entry) => {
  const output = removeVowels(entry.word);
  return entry.structure.vowels.length >= 2 && output.length >= 2 &&
    output !== entry.structure.oddPositionLetters && output !== entry.structure.evenPositionLetters;
});
const consonantRemovalEligible = enabled.filter((entry) => {
  const output = removeConsonants(entry.word);
  return entry.structure.consonants.length >= 2 && output.length >= 2 &&
    output !== entry.structure.oddPositionLetters && output !== entry.structure.evenPositionLetters;
});
const differentialShiftEligible = enabled.filter((entry) =>
  entry.structure.vowels.length >= 2 && entry.structure.consonants.length >= 2,
);
const repeatedPatternEligible = enabled.filter((entry) => entry.structure.repeatedPositionCount > 0);

assert.ok(vowelRemovalEligible.length >= 25, `Only ${vowelRemovalEligible.length} words support clean vowel removal.`);
assert.ok(consonantRemovalEligible.length >= 25, `Only ${consonantRemovalEligible.length} words support clean consonant removal.`);
assert.ok(differentialShiftEligible.length >= 25, `Only ${differentialShiftEligible.length} words activate both letter classes sufficiently.`);
assert.ok(repeatedPatternEligible.length >= 25, `Only ${repeatedPatternEligible.length} words contain repeated letters.`);

const lengthCounts = new Map<number, number>();
for (const entry of enabled) {
  lengthCounts.set(entry.word.length, (lengthCounts.get(entry.word.length) ?? 0) + 1);
}
for (const length of [4, 5, 6, 7, 8, 9, 10]) {
  assert.ok((lengthCounts.get(length) ?? 0) > 0, `The pilot has no length-${length} word.`);
}

console.log("ANA-CP-007 pilot word registry audit passed.", {
  records: enabled.length,
  lengths: Object.fromEntries([...lengthCounts.entries()].sort(([left], [right]) => left - right)),
  usablePatternGroups: usablePatternGroups.length,
  vowelRemovalEligible: vowelRemovalEligible.length,
  consonantRemovalEligible: consonantRemovalEligible.length,
  differentialShiftEligible: differentialShiftEligible.length,
  repeatedPatternEligible: repeatedPatternEligible.length,
});
