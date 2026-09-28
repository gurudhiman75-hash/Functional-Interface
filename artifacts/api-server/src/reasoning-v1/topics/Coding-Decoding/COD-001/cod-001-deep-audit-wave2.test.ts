import assert from "node:assert/strict";

import { generateCod001Question } from "./multilingual-runtime";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

const cp008Ids = ["COD-QL-173", "COD-QL-174"] as const;
const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
let checked = 0;

for (const qlId of cp008Ids) {
  for (const locale of locales) {
    for (let seed = 0; seed < 60; seed++) {
      const question = generateCod001Question(qlId, locale, seed) as Record<string, unknown>;
      const prompt = asRecord(question.structuredPrompt);
      const mapping = Array.isArray(prompt.mapping) ? prompt.mapping : [];
      const topology = String(prompt.topology ?? "");
      const difficulty = String(question.difficulty ?? "");

      assert.ok(["EASY", "MEDIUM", "HARD"].includes(difficulty), `${qlId}/${locale}/${seed}: invalid difficulty.`);
      assert.ok(mapping.length >= 4, `${qlId}/${locale}/${seed}: mapping unexpectedly thin.`);

      if (qlId === "COD-QL-173") {
        const expected = topology === "OPEN_CHAIN" && mapping.length <= 5 ? "EASY" : "MEDIUM";
        assert.equal(
          difficulty,
          expected,
          `${qlId}/${locale}/${seed}: direct-renaming difficulty does not match visible burden.`,
        );
      } else {
        const factCategory = String(asRecord(question.metadata).factCategory ?? "");
        const expected = factCategory === "CATEGORY" && (topology === "CYCLE" || mapping.length >= 6)
          ? "HARD"
          : "MEDIUM";
        assert.equal(
          difficulty,
          expected,
          `${qlId}/${locale}/${seed}: semantic-renaming difficulty does not match visible burden.`,
        );
      }

      const stem = String(question.stem ?? "");
      assert.ok(stem.length >= 20, `${qlId}/${locale}/${seed}: stem too thin.`);
      assert.doesNotMatch(
        stem,
        /associated with|most closely linked|broad(?:ly)?|prototype|authority|fingerprint/i,
        `${qlId}/${locale}/${seed}: mechanical/internal wording leaked into stem.`,
      );

      checked++;
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_COD_001_DEEP_AUDIT_WAVE2",
  cp008Qls: cp008Ids,
  locales,
  seedsPerQlPerLocale: 60,
  checked,
  seedDrivenDifficulty: false,
}, null, 2));
