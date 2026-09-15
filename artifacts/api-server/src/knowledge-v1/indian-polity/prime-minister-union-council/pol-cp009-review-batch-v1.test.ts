import { describe, expect, it } from "vitest";
import { generatePolCp009ReviewBatchV1 } from "./pol-cp009-review-generator-v1";

describe("POL-CP-009 Prime Minister and Union Council V1", () => {
  const questions = generatePolCp009ReviewBatchV1();

  it("keeps the planned review structure", () => {
    expect(questions).toHaveLength(72);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(18);
    expect(questions.filter(q => q.difficulty === "Easy")).toHaveLength(20);
    expect(questions.filter(q => q.difficulty === "Medium")).toHaveLength(40);
    expect(questions.filter(q => q.difficulty === "Hard")).toHaveLength(12);
  });

  it("keeps four unique options and aligned answers", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
      expect(q.sourceIds).toContain("LEGISLATIVE-DEPT-CONSTITUTION-2025");
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeEligible).toBe(false);
    }
  });

  it("uses compact stems and balanced explanations", () => {
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements")) {
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(28);
      }
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(11);
      expect(words).toBeLessThanOrEqual(30);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|Match the topic|Remember the word/i);
    }
    expect(new Set(questions.map(q => q.explanation)).size).toBe(questions.length);
  });

  it("keeps key constitutional distinctions explicit", () => {
    const text = questions.map(q => `${q.stem}\n${q.explanation}`).join("\n");
    expect(text).toMatch(/collectively responsible to Lok Sabha/i);
    expect(text).toMatch(/six consecutive months/i);
    expect(text).toMatch(/fifteen per cent|15%/i);
    expect(text).toMatch(/Ninety-first Amendment/i);
    expect(text).toMatch(/Third Schedule/i);
    expect(text).toMatch(/does not itself give.*right to vote/i);
    expect(text).toMatch(/Cabinet-rank group within the wider Council/i);
    expect(text).toMatch(/Tenth Schedule/i);
  });
});
