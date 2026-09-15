import { describe, expect, it } from "vitest";
import { generatePolCp011ReviewBatchV1 } from "./pol-cp011-review-generator-v1";

const questions = generatePolCp011ReviewBatchV1();

describe("POL-CP-011 review batch V1", () => {
  it("has the intended size and difficulty profile", () => {
    expect(questions).toHaveLength(88);
    expect(questions.filter(q => q.difficulty === "Easy")).toHaveLength(24);
    expect(questions.filter(q => q.difficulty === "Medium")).toHaveLength(48);
    expect(questions.filter(q => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("covers all 22 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of questions) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(22);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answers aligned", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses unique balanced explanations without generic clutter", () => {
    expect(new Set(questions.map(q => q.explanation)).size).toBe(questions.length);
    for (const q of questions) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(11);
      expect(words).toBeLessThanOrEqual(30);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });

  it("preserves high-yield parliamentary distinctions", () => {
    const joined = questions.map(q => `${q.stem} ${q.canonicalAnswer} ${q.explanation}`).join("\n");
    expect(joined).toContain("14 days");
    expect(joined).toContain("Speaker of Lok Sabha");
    expect(joined).toContain("Re. 1");
    expect(joined).toContain("Rs. 100");
    expect(joined).toContain("Vote on account");
    expect(joined).toContain("Appropriation");
    expect(joined).toContain("Consolidated Fund");
  });
});
