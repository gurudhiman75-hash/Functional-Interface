import { describe, expect, it } from "vitest";
import { ENV_CP021_FACT_BY_ID_V1 } from "./env-cp021-facts";
import { ENV_CP021_REVIEW_QUESTIONS_V1 } from "./env-cp021-review-generator-v1";

describe("ENV-CP-021 exhaustive remediation review V1", () => {
  const questions = ENV_CP021_REVIEW_QUESTIONS_V1;

  it("has 48 questions across 12 QLs", () => {
    expect(questions).toHaveLength(48);
    expect(new Set(questions.map((q) => q.qlId)).size).toBe(12);
  });

  it("keeps four questions and all answer positions inside every QL", () => {
    const byQl = new Map<string, typeof questions[number][]>();
    for (const q of questions) byQl.set(q.qlId, [...(byQl.get(q.qlId) ?? []), q]);
    for (const group of byQl.values()) {
      expect(group).toHaveLength(4);
      expect(new Set(group.map((q) => q.correctIndex))).toEqual(new Set([0, 1, 2, 3]));
    }
  });

  it("represents Easy, Medium and Hard", () => {
    expect(new Set(questions.map((q) => q.difficulty))).toEqual(new Set(["Easy", "Medium", "Hard"]));
  });

  it("keeps options unique and provenance valid", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceFactIds.length).toBeGreaterThan(0);
      for (const id of q.sourceFactIds) expect(ENV_CP021_FACT_BY_ID_V1[id]).toBeTruthy();
      expect(q.reviewOnly).toBe(true);
      expect(q.runtimeRegistered).toBe(false);
    }
  });

  it("has no duplicate stem-answer signatures", () => {
    const signatures = questions.map((q) => `${q.stem.toLowerCase()}::${q.options[q.correctIndex].toLowerCase()}`);
    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("keeps learner-facing wording concise and clean", () => {
    for (const q of questions) {
      expect(q.stem.length).toBeLessThanOrEqual(155);
      expect(q.explanation.length).toBeGreaterThanOrEqual(45);
      expect(q.explanation.length).toBeLessThanOrEqual(235);
      const learnerText = `${q.stem} ${q.explanation}`.toLowerCase();
      expect(learnerText).not.toContain("associated with");
      expect(learnerText).not.toMatch(/option\s+[abcd]/);
      expect(learnerText).not.toContain("ql-");
      expect(learnerText).not.toContain("cp021");
    }
  });

  it("covers every audit gap explicitly", () => {
    const text = questions.map((q) => `${q.qlName} ${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ").toLowerCase();
    for (const required of ["succession", "environmental impact assessment", "project elephant", "chipko", "appiko", "silent valley", "khejarli", "national action plan on climate change", "national solar mission", "national water mission", "green india mission"]) {
      expect(text).toContain(required);
    }
  });

  it("avoids mutable-current trivia", () => {
    const text = questions.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ").toLowerCase();
    for (const banned of ["current number", "currently has", "latest", "current ranking", "current chairperson", "current chairman", "this year", "2026 population"]) {
      expect(text).not.toContain(banned);
    }
  });
});
