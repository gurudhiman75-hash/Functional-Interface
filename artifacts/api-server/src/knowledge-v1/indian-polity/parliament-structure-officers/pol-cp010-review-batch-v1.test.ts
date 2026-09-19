import { describe, expect, it } from "vitest";
import { generatePolCp010ReviewBatchV1 } from "./pol-cp010-review-generator-v1";

describe("POL-CP-010 Parliament Structure & Officers V1", () => {
  const questions = generatePolCp010ReviewBatchV1();

  it("keeps the approved review shape", () => {
    expect(questions).toHaveLength(80);
    expect(new Set(questions.map(q => q.qlId)).size).toBe(20);
    expect(questions.filter(q => q.difficulty === "Easy")).toHaveLength(24);
    expect(questions.filter(q => q.difficulty === "Medium")).toHaveLength(44);
    expect(questions.filter(q => q.difficulty === "Hard")).toHaveLength(12);
  });

  it("keeps options unique and answers aligned", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBe(q.canonicalAnswer);
    }
  });

  it("uses compact stems and balanced explanations", () => {
    expect(new Set(questions.map(q => q.explanation)).size).toBe(questions.length);
    for (const q of questions) {
      if (!q.stem.startsWith("Consider the following statements")) {
        expect(q.stem.trim().split(/\s+/).length).toBeLessThanOrEqual(28);
      }
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(11);
      const maxWords = q.explanation.includes("Article 84 qualifications:") ? 60 : 30;
      expect(words).toBeLessThanOrEqual(maxWords);
    }
  });

  it("protects high-yield Parliament distinctions", () => {
    const text = questions.map(q => `${q.stem}\n${q.canonicalAnswer}\n${q.explanation}`).join("\n");
    expect(text).toMatch(/President and two Houses/i);
    expect(text).toMatch(/twelve/i);
    expect(text).toMatch(/single transferable vote/i);
    expect(text).toMatch(/continuing House/i);
    expect(text).toMatch(/thirty years/i);
    expect(text).toMatch(/twenty-five years/i);
    expect(text).toMatch(/six months/i);
    expect(text).toMatch(/fourteen days/i);
    expect(text).toMatch(/first instance/i);
    expect(text).toMatch(/separate secretarial staff/i);
  });
});
