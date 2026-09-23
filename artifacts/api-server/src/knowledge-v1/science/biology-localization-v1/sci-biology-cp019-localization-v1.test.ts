import { describe, expect, it } from "vitest";
import { SCI_BIOLOGY_CP019_HI_V1, SCI_BIOLOGY_CP019_PA_V1, validateSciBiologyCp019LocalizationV1 } from "./sci-biology-localization-generator-v1";

describe("SCI-CP-019 biology localization V1",()=>{
  it("preserves English invariants for both native locales",()=>{
    const r=validateSciBiologyCp019LocalizationV1();
    expect(r.errors).toEqual([]);
    expect(r.valid).toBe(true);
    expect(r.hindi).toBe(60);
    expect(r.punjabi).toBe(60);
  });
  it("uses native scripts in learner-facing text",()=>{
    expect(SCI_BIOLOGY_CP019_HI_V1.every(q=>/[\u0900-\u097F]/.test(q.stem)&&/[\u0900-\u097F]/.test(q.explanation))).toBe(true);
    expect(SCI_BIOLOGY_CP019_PA_V1.every(q=>/[\u0A00-\u0A7F]/.test(q.stem)&&/[\u0A00-\u0A7F]/.test(q.explanation))).toBe(true);
  });
  it("keeps localized stems unique within each locale",()=>{
    expect(new Set(SCI_BIOLOGY_CP019_HI_V1.map(q=>q.stem)).size).toBe(60);
    expect(new Set(SCI_BIOLOGY_CP019_PA_V1.map(q=>q.stem)).size).toBe(60);
  });
});
