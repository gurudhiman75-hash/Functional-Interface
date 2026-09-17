import { describe, expect, it } from "vitest";
import { generatePolCp022ReviewBatchV2 } from "./pol-cp022-review-candidate-v2";

describe("POL-CP-022 Constitutional Bodies & Authorities V2", () => {
  const batch = generatePolCp022ReviewBatchV2();

  it("preserves the intended 80-question profile", () => {
    expect(batch).toHaveLength(80);
    expect(batch.filter((q) => q.difficulty === "Easy")).toHaveLength(24);
    expect(batch.filter((q) => q.difficulty === "Medium")).toHaveLength(40);
    expect(batch.filter((q) => q.difficulty === "Hard")).toHaveLength(16);
    expect(new Set(batch.map((q) => q.qlId)).size).toBe(20);
  });

  it("uses the constitutional office names consistently", () => {
    const joined = batch.map((q) => `${q.stem} ${q.options.join(" ")} ${q.explanation}`).join(" ");
    expect(joined).toContain("Attorney-General for India");
    expect(joined).toContain("Advocate-General for the State");
    expect(joined).not.toMatch(/Attorney General/);
    expect(joined).not.toMatch(/Advocate General/);
  });

  it("adds complete, easy qualification bullets where the stem tests eligibility", () => {
    const attorneyGeneral = batch.find((q) => q.questionId === "POL-CP022-V2-003");
    const advocateGeneral = batch.find((q) => q.questionId === "POL-CP022-V2-007");

    expect(attorneyGeneral?.explanation).toContain("Qualifications:");
    expect(attorneyGeneral?.explanation).toContain("• Citizen of India");
    expect(attorneyGeneral?.explanation).toContain("5 years as a High Court judge");
    expect(attorneyGeneral?.explanation).toContain("10 years as a High Court advocate");
    expect(attorneyGeneral?.explanation).toContain("distinguished jurist");

    expect(advocateGeneral?.explanation).toContain("Qualifications:");
    expect(advocateGeneral?.explanation).toContain("• Citizen of India");
    expect(advocateGeneral?.explanation).toContain("10 years in judicial office");
    expect(advocateGeneral?.explanation).toContain("10 years as an advocate of a High Court");
  });

  it("keeps ordinary explanations concise while allowing qualification notes extra room", () => {
    const enriched = new Set(["POL-CP022-V2-003", "POL-CP022-V2-007"]);
    for (const q of batch) {
      const words = q.explanation.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(13);
      expect(words).toBeLessThanOrEqual(enriched.has(q.questionId) ? 55 : 32);
      expect(q.stem.endsWith("?")).toBe(true);
      expect(q.stem.split(/\s+/).length).toBeLessThanOrEqual(30);
    }
  });
});
