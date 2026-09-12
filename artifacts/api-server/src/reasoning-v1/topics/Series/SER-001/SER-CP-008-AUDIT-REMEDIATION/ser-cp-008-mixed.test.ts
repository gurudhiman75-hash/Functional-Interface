import assert from "node:assert/strict";
import { SER_CP008_MIXED_QL_IDS, SER_CP008_QL_AUTHORITIES } from "./question-language";
import { generateSerCp008Final } from "./runtime-final";
import { independentlySolveVisibleSerCp008Mixed } from "./mixed-visible-verifier";

assert.deepEqual(SER_CP008_MIXED_QL_IDS, [
  "SER-QL-019",
  "SER-QL-020",
  "SER-QL-021",
  "SER-QL-022",
  "SER-QL-023",
  "SER-QL-024",
  "SER-QL-025",
  "SER-QL-026",
  "SER-QL-027",
  "SER-QL-028",
]);
assert.equal(SER_CP008_QL_AUTHORITIES.length, 15);

// Exact source-style fixtures solved only from what a learner sees.
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-019", "Find the number.\nD4, X24, E5, H8, T20, L?"),
  "12",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-020", "Find the number.\nC10G, H20L, L17E, L?Q"),
  "29",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-021", "Find the missing term.\nUV5, XZ10, AD17, ?, GL37"),
  "DH26",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-022", "Find the next term.\n5E, 7F, 11H, 17K, ?"),
  "25O",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-023", "Find the next term.\nA1, D4, I9, P16, Y25, J36, ?"),
  "W49",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-024", "Complete the series.\nE25, J100, O225, ?"),
  "T400",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-025", "Find the wrong term.\nF4, H9, J15, L25, N36"),
  "J15",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-026", "Find the next term.\nB7K, KB7, ?"),
  "7KB",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-027", "Find the next term.\nD4U, G9R, J16O, ?"),
  "M25L",
);
assert.equal(
  independentlySolveVisibleSerCp008Mixed("SER-QL-028", "Fill the blanks.\n1 2 _ _ 3 _ C D 5 6 E _ 7 8 _ H"),
  "A B 4 F G",
);

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const seedsPerQl = 240;
const lowEntropyAllowed = new Set(["SER-QL-023", "SER-QL-024"]);
const report: Record<string, unknown>[] = [];

for (const qlId of SER_CP008_MIXED_QL_IDS) {
  const answerPositions = [0, 0, 0, 0];
  const difficulties = new Set<string>();
  const visible = new Set<string>();
  const full = new Set<string>();

  for (let seed = 0; seed < seedsPerQl; seed += 1) {
    const english = generateSerCp008Final(qlId, seed, "en-IN");
    const replay = generateSerCp008Final(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}:${seed} deterministic replay failed.`);
    assert.equal(english.seed, seed);
    assert.equal(english.qlId, qlId);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4, `${qlId}:${seed} has duplicate options.`);
    assert.equal(english.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(english.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)));
    assert.equal(english.options[english.correctIndex]!.value, english.correctAnswer);

    const independentlySolved = independentlySolveVisibleSerCp008Mixed(qlId, english.stem);
    assert.equal(independentlySolved, english.correctAnswer, `${qlId}:${seed} visible-state solver disagrees.`);
    assert.equal(english.options.filter((option) => option.value === independentlySolved).length, 1);

    const requestedIndex = ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
    assert.equal(english.correctIndex, requestedIndex);
    answerPositions[english.correctIndex] += 1;
    difficulties.add(english.difficulty);
    visible.add(english.stem.split("\n").at(-1)!);
    full.add(JSON.stringify({ stem: english.stem, options: english.options, answer: english.correctAnswer, difficulty: english.difficulty }));

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp008Final(qlId, seed, locale);
      assert.equal(localized.correctAnswer, english.correctAnswer, `${qlId}:${seed}:${locale} changed the answer.`);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures);
      assert.deepEqual(
        localized.options.map((option) => [option.value, option.errorLabel]),
        english.options.map((option) => [option.value, option.errorLabel]),
      );
      assert.ok(localized.explanation.length >= 3);
      const combined = `${localized.stem}\n${localized.explanation.join("\n")}`;
      if (locale === "hi-IN") assert.match(combined, /[\u0900-\u097F]/u, `${qlId}:${seed} Hindi script missing.`);
      if (locale === "pa-IN") assert.match(combined, /[\u0A00-\u0A7F]/u, `${qlId}:${seed} Punjabi script missing.`);
    }
  }

  assert.deepEqual(answerPositions, [60, 60, 60, 60], `${qlId} answer positions are biased.`);
  const visibleMinimum = lowEntropyAllowed.has(qlId) ? 0.30 : 0.60;
  assert.ok(visible.size / seedsPerQl >= visibleMinimum, `${qlId} visible diversity ${visible.size}/${seedsPerQl} is below ${visibleMinimum}.`);
  assert.ok(full.size / seedsPerQl >= 0.90, `${qlId} full-output diversity ${full.size}/${seedsPerQl} is below 0.90.`);

  report.push({
    qlId,
    answerPositions,
    difficulties: [...difficulties],
    visibleUnique: visible.size,
    fullUnique: full.size,
  });
}

// Difficulty must follow reasoning structure, not the magnitude of numbers or strings.
assert.equal(generateSerCp008Final("SER-QL-019", 7).difficulty, "EASY");
assert.equal(generateSerCp008Final("SER-QL-020", 7).difficulty, "MEDIUM");
assert.equal(generateSerCp008Final("SER-QL-021", 7).difficulty, "HARD");
assert.equal(generateSerCp008Final("SER-QL-024", 7).difficulty, "MEDIUM");
assert.equal(generateSerCp008Final("SER-QL-025", 7).difficulty, "MEDIUM");
assert.equal(generateSerCp008Final("SER-QL-026", 7).difficulty, "MEDIUM");
assert.equal(generateSerCp008Final("SER-QL-028", 7).difficulty, "HARD");

console.log("SER-CP-008 mixed source-saturation audit passed.", report);