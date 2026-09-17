import { describe, expect, it } from "vitest";
import { generatePolCp023ReviewBatchV1 } from "./pol-cp023-review-candidate-v1";

describe("POL-CP-023 Statutory & Executive Bodies V1", () => {
  const batch = generatePolCp023ReviewBatchV1();

  it("builds the intended 80-question profile", () => {
    expect(batch).toHaveLength(80);
    expect(batch.filter((q) => q.difficulty === "Easy")).toHaveLength(24);
    expect(batch.filter((q) => q.difficulty === "Medium")).toHaveLength(40);
    expect(batch.filter((q) => q.difficulty === "Hard")).toHaveLength(16);
  });

  it("keeps 20 QLs with four questions each", () => {
    const counts = new Map<string, number>();
    for (const q of batch) counts.set(q.qlId, (counts.get(q.qlId) ?? 0) + 1);
    expect(counts.size).toBe(20);
    for (const count of counts.values()) expect(count).toBe(4);
  });

  it("keeps options unique and answer positions balanced", () => {
    const positions = [0, 0, 0, 0];
    for (const q of batch) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correctIndex]).toBeTruthy();
      positions[q.correctIndex] += 1;
    }
    expect(positions).toEqual([20, 20, 20, 20]);
  });

  it("keeps stems concise and explanations useful", () => {
    expect(new Set(batch.map((q) => q.stem)).size).toBe(80);
    expect(new Set(batch.map((q) => q.explanation)).size).toBe(80);
    for (const q of batch) {
      const words = q.explanation.replace(/\n[-*]?/g, " ").trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      expect(words).toBeLessThanOrEqual(45);
      expect(q.stem.endsWith("?")).toBe(true);
      expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
      expect(q.explanation).not.toMatch(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i);
    }
  });

  it("retains high-yield cross-body distinctions", () => {
    const joined = batch.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ");
    expect(joined).toContain("1 January 2015");
    expect(joined).toContain("Protection of Human Rights Act, 1993");
    expect(joined).toContain("Central Vigilance Commission Act, 2003");
    expect(joined).toContain("Right to Information Act, 2005");
    expect(joined).toContain("Lokpal and Lokayuktas Act, 2013");
    expect(joined).toContain("Delhi Special Police Establishment Act, 1946");
  });

  it("adds easy qualification notes where they add revision value", () => {
    const notes = batch.filter((q) => /Qualifications:|Restrictions:/.test(q.explanation));
    expect(notes.length).toBeGreaterThanOrEqual(5);
  });

  it("excludes current-office-holder trivia", () => {
    const joined = batch.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ");
    expect(joined).not.toMatch(/current chairperson|present chairperson|current commissioner|present commissioner/i);
  });
});
