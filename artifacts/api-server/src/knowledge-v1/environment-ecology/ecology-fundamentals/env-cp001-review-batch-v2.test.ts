import { describe, expect, it } from "vitest";
import {
  ENV_CP001_ORGANISATION_ROWS_V1,
  ENV_CP001_TERM_ROWS_V1,
  getEnvCp001TermByName,
} from "./env-cp001-facts";
import {
  ENV_CP001_ORGANISATION_ORDER_V1,
  generateEnvCp001ReviewBatchV2,
} from "./env-cp001-review-generator-v2";
import { ENV_CP001_SOURCE_IDS_V1 } from "./env-cp001-sources";

describe("ENV-CP-001 ecology-fundamentals review batch", () => {
  const questions = generateEnvCp001ReviewBatchV2();

  it("produces a 48-question review batch with all 12 QLs represented", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((question) => question.qlId)).size).toBe(12);
    for (let ql = 1; ql <= 12; ql += 1) {
      const qlId = `ENV-001-QL-${String(ql).padStart(3, "0")}`;
      expect(questions.filter((question) => question.qlId === qlId)).toHaveLength(4);
    }
  });

  it("keeps every review question structurally valid", () => {
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options.every((option) => typeof option === "string" && option.trim().length > 0)).toBe(true);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.options[question.correctIndex]).toBe(question.canonicalAnswer);
      expect(question.stem.trim().length).toBeGreaterThan(15);
      expect(question.explanation.trim().length).toBeGreaterThan(20);
      expect(question.sourceIds.length).toBeGreaterThan(0);
      expect(question.sourceFactIds.length).toBeGreaterThan(0);
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(false);
    }
  });

  it("uses all four answer positions and all three difficulty bands", () => {
    expect(new Set(questions.map((question) => question.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    expect(new Set(questions.map((question) => question.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
    expect(questions.filter((question) => question.difficulty === "Easy")).toHaveLength(12);
    expect(questions.filter((question) => question.difficulty === "Medium")).toHaveLength(28);
    expect(questions.filter((question) => question.difficulty === "Hard")).toHaveLength(8);
  });

  it("uses a compact but sufficiently broad canonical term library", () => {
    expect(ENV_CP001_TERM_ROWS_V1).toHaveLength(13);
    expect(new Set(ENV_CP001_TERM_ROWS_V1.map((row) => row.term)).size).toBe(13);
    expect(ENV_CP001_TERM_ROWS_V1.map((row) => row.term)).toEqual(
      expect.arrayContaining([
        "Ecology",
        "Environment",
        "Species",
        "Population",
        "Community",
        "Ecosystem",
        "Biome",
        "Biosphere",
        "Habitat",
        "Ecological niche",
        "Ecotone",
        "Edge effect",
      ]),
    );
  });

  it("preserves the canonical ecological organisation order", () => {
    expect(ENV_CP001_ORGANISATION_ROWS_V1).toHaveLength(6);
    expect(ENV_CP001_ORGANISATION_ORDER_V1).toEqual([
      "Organism",
      "Population",
      "Community",
      "Ecosystem",
      "Biome",
      "Biosphere",
    ]);
  });

  it("covers all four basic ecological levels in scenario questions", () => {
    const scenarioAnswers = new Set(
      questions
        .filter((question) => question.qlId === "ENV-001-QL-003")
        .map((question) => question.canonicalAnswer),
    );
    expect(scenarioAnswers).toEqual(new Set(["Organism", "Population", "Community", "Ecosystem"]));
  });

  it("keeps habitat and niche conceptually distinct", () => {
    const habitat = getEnvCp001TermByName("Habitat");
    const niche = getEnvCp001TermByName("Ecological niche");
    expect(habitat.compactDefinition).toContain("place");
    expect(niche.compactDefinition).toContain("functional role");
    expect(niche.compactDefinition).toContain("interactions");
  });

  it("keeps ecotone and edge effect conceptually distinct", () => {
    const ecotone = getEnvCp001TermByName("Ecotone");
    const edge = getEnvCp001TermByName("Edge effect");
    expect(ecotone.compactDefinition).toContain("transition zone");
    expect(edge.compactDefinition).toContain("boundary-related change");
  });

  it("resolves every fact source ID in the CP source registry", () => {
    const sourceIds = new Set(ENV_CP001_SOURCE_IDS_V1);
    for (const row of ENV_CP001_TERM_ROWS_V1) {
      for (const sourceId of row.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
    for (const question of questions) {
      for (const sourceId of question.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("has no duplicate review question signatures", () => {
    const signatures = questions.map((question) =>
      [question.qlId, question.stem, question.canonicalAnswer].join("::"),
    );
    expect(new Set(signatures).size).toBe(questions.length);
  });

  it("avoids known editorial defects in stems and explanations", () => {
    const text = questions.map((question) => `${question.stem}\n${question.explanation}`).join("\n");
    expect(text).not.toMatch(/associated with/i);
    expect(text).not.toMatch(/option\s+[abcd]/i);
    expect(text).not.toMatch(/current president|current prime minister|incumbent/i);
  });

  it("does not leak later-CP content into ecology fundamentals", () => {
    const text = questions.map((question) => `${question.stem}\n${question.explanation}`).join("\n");
    expect(text).not.toMatch(/producer|consumer|decomposer|trophic level|food chain|nitrogen cycle|ramsar|iucn/i);
  });
});
