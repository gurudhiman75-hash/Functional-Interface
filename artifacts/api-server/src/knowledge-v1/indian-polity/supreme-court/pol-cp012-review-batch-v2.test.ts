import { describe, expect, it } from "vitest";
import { generatePolCp012ReviewBatchV2 } from "./pol-cp012-review-generator-v2";

const questions = generatePolCp012ReviewBatchV2();

describe("POL-CP-012 review batch V2", () => {
  it("keeps the intended size and difficulty profile", () => {
    expect(questions).toHaveLength(80);
    expect(questions.filter(q => q.difficulty === "Easy")).toHaveLength(24);
    expect(questions.filter(q => q.difficulty === "Medium")).toHaveLength(40);
    expect(questions.filter(q => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("covers all 20 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of questions) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(20);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answers aligned", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses proper exam-grade stems rather than database-style prompt fragments", () => {
    for (const q of questions) {
      expect(q.stem).not.toMatch(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:/i);
      expect(q.stem).not.toMatch(/\bmainly under:$/i);
      expect(q.stem).not.toMatch(/\bis a:$/i);
      expect(q.stem).not.toMatch(/\bunder:$/i);
      if (!q.stem.startsWith("Consider the following statements:")) {
        expect(q.stem.trim().endsWith("?")).toBe(true);
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(30);
      }
    }
  });

  it("preserves unique helpful explanations without generic clutter", () => {
    expect(new Set(questions.map(q => q.explanation)).size).toBe(questions.length);
    for (const q of questions) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      const maxWords = q.explanation.includes("Qualifications:") || q.explanation.includes("Article 124 qualifications:") ? 65 : 32;
      expect(words).toBeLessThanOrEqual(maxWords);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });
});
