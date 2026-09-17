import { describe, expect, it } from "vitest";
import { ENV_CP015_EXHAUSTIVE_V2_FACTS, ENV_CP015_EXHAUSTIVE_V2_QUESTIONS } from "./env-cp015-exhaustive-v2-additions";

describe("ENV-CP-015 exhaustive V2 EIA additions", () => {
  it("adds 12 questions across three EIA QLs", () => {
    expect(ENV_CP015_EXHAUSTIVE_V2_QUESTIONS).toHaveLength(12);
    expect(new Set(ENV_CP015_EXHAUSTIVE_V2_QUESTIONS.map((q) => q.qlId)).size).toBe(3);
  });

  it("keeps answers and provenance valid", () => {
    const factIds = new Set(Object.keys(ENV_CP015_EXHAUSTIVE_V2_FACTS));
    for (const q of ENV_CP015_EXHAUSTIVE_V2_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds).toEqual(["PARIVESH-EIA-NOTIFICATION-2006-SO1533E"]);
      for (const id of q.sourceFactIds) expect(factIds.has(id)).toBe(true);
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("keeps the EIA layer stable and exam-focused", () => {
    const text = ENV_CP015_EXHAUSTIVE_V2_QUESTIONS.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ").toLowerCase();
    expect(text).not.toContain("associated with");
    expect(text).not.toContain("current threshold");
    expect(text).not.toContain("latest amendment");
    expect(text).not.toMatch(/option\s+[abcd]/);
  });
});
