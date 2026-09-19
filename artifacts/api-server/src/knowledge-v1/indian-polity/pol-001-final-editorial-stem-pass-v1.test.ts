import { describe, expect, it } from "vitest";
import { applyPolityFinalEditorialStemPass, hasDatabaseStylePolityStem } from "./pol-001-final-editorial-stem-pass-v1";

describe("POL-001 final editorial stem pass V1",()=>{
  it("rewrites only exact database-style Article stems",()=>{
    const q={questionId:"POL-CP004-V3-001",stem:"Article 14 deals with:",answer:"Equality before law"};
    const out=applyPolityFinalEditorialStemPass(q);
    expect(out.stem).not.toBe(q.stem);
    expect(out.stem.endsWith("?")).toBe(true);
    expect(out.answer).toBe(q.answer);
    expect(hasDatabaseStylePolityStem(out.stem)).toBe(false);
  });

  it("preserves already exam-grade stems byte-for-byte",()=>{
    const q={questionId:"POL-CP014-V3-001",stem:"Which Article provides for a Governor for each State?",answer:"Article 153"};
    expect(applyPolityFinalEditorialStemPass(q)).toBe(q);
  });

  it("also catches the 'mainly deals with' variant",()=>{
    const q={questionId:"POL-CP011-V2-001",stem:"Article 107 mainly deals with:"};
    expect(hasDatabaseStylePolityStem(q.stem)).toBe(true);
    expect(applyPolityFinalEditorialStemPass(q).stem).toMatch(/\?$/);
  });
});
