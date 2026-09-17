import { describe, expect, it } from "vitest";
import { ENV_CP014_EXHAUSTIVE_V2_FACTS, ENV_CP014_EXHAUSTIVE_V2_QUESTIONS } from "./env-cp014-exhaustive-v2-additions";

describe("ENV-CP-014 exhaustive V2 NAPCC additions", () => {
  it("adds 12 questions across three NAPCC QLs", () => {
    expect(ENV_CP014_EXHAUSTIVE_V2_QUESTIONS).toHaveLength(12);
    expect(new Set(ENV_CP014_EXHAUSTIVE_V2_QUESTIONS.map((q) => q.qlId)).size).toBe(3);
  });

  it("keeps facts, answers and review state valid", () => {
    const factIds = new Set(Object.keys(ENV_CP014_EXHAUSTIVE_V2_FACTS));
    for (const q of ENV_CP014_EXHAUSTIVE_V2_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      for (const id of q.sourceFactIds) expect(factIds.has(id)).toBe(true);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("excludes mutable climate-current-affairs trivia", () => {
    const text = ENV_CP014_EXHAUSTIVE_V2_QUESTIONS.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ").toLowerCase();
    for (const banned of ["current emissions ranking", "current chairman", "latest temperature", "2026 target", "current capacity"]) {
      expect(text).not.toContain(banned);
    }
    expect(text).not.toContain("associated with");
  });
});
