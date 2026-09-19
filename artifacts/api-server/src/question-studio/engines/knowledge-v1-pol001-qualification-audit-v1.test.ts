import { describe, expect, it } from "vitest";
import { generatePolCp007ReviewBatchV6 } from "../../knowledge-v1/indian-polity/president/pol-cp007-review-generator-v6";
import { generatePolCp008ReviewBatchV6 } from "../../knowledge-v1/indian-polity/vice-president/pol-cp008-review-generator-v6";
import { generatePolCp010ReviewBatchV1 } from "../../knowledge-v1/indian-polity/parliament-structure-officers/pol-cp010-review-generator-v1";
import { generatePolCp012ReviewBatchV2 } from "../../knowledge-v1/indian-polity/supreme-court/pol-cp012-review-generator-v2";
import { generatePolCp013ReviewBatchV1 } from "../../knowledge-v1/indian-polity/high-courts-subordinate-judiciary-writs/pol-cp013-review-generator-v1";
import { generatePolCp014ReviewBatchV1 } from "../../knowledge-v1/indian-polity/governor/pol-cp014-review-generator-v1";
import { generatePolCp016ReviewBatchV1 } from "../../knowledge-v1/indian-polity/state-legislature/pol-cp016-review-generator-v1";
import { generatePolCp022ReviewBatchV2 } from "../../knowledge-v1/indian-polity/constitutional-bodies/pol-cp022-review-candidate-v2";

function expectFullSet(explanation: string, terms: RegExp[]) {
  expect(explanation).toMatch(/Qualifications:/i);
  for (const term of terms) expect(explanation).toMatch(term);
}

describe("POL-001 final qualification explanation audit", () => {
  it("keeps President qualification questions complete", () => {
    const byId = new Map(generatePolCp007ReviewBatchV6().map((q) => [q.questionId, q]));
    for (const id of ["003", "025", "026", "027", "028"]) {
      expectFullSet(byId.get(`POL-CP007-V6-${id}`)!.explanation, [
        /citizen of India/i,
        /35 years/i,
        /Lok Sabha/i,
        /office of profit/i,
      ]);
    }
  });

  it("keeps Vice-President qualification questions complete", () => {
    const byId = new Map(generatePolCp008ReviewBatchV6().map((q) => [q.questionId, q]));
    for (const id of ["003", "033", "034", "035", "036", "039"]) {
      expectFullSet(byId.get(`POL-CP008-V6-${id}`)!.explanation, [
        /citizen of India/i,
        /35 years/i,
        /Rajya Sabha/i,
        /office of profit/i,
      ]);
    }
  });

  it("keeps Parliament membership qualification questions complete", () => {
    const questions = generatePolCp010ReviewBatchV1().filter((q) => q.qlId === "POL-010-QL-009");
    expect(questions).toHaveLength(4);
    for (const q of questions) {
      expectFullSet(q.explanation, [
        /citizen of India/i,
        /oath\/affirmation/i,
        /25.*Lok Sabha|Lok Sabha.*25/i,
        /30.*Rajya Sabha|Rajya Sabha.*30/i,
        /prescribed by Parliament/i,
      ]);
    }
  });

  it("keeps Supreme Court Judge qualification questions complete", () => {
    const questions = generatePolCp012ReviewBatchV2();
    const qualificationQuestions = questions.filter(
      (q) => q.qlId === "POL-012-QL-004" || /separate minimum age.*Supreme Court/i.test(q.stem),
    );
    expect(qualificationQuestions.length).toBeGreaterThanOrEqual(5);
    for (const q of qualificationQuestions) {
      expectFullSet(q.explanation, [
        /citizen of India/i,
        /5 years.*High Court judge/i,
        /10 years.*High Court advocate/i,
        /distinguished jurist/i,
      ]);
    }
  });

  it("keeps High Court Judge qualification questions complete", () => {
    const questions = generatePolCp013ReviewBatchV1().filter((q) => q.qlId === "POL-013-QL-005");
    expect(questions).toHaveLength(4);
    for (const q of questions) {
      expectFullSet(q.explanation, [
        /citizen of India/i,
        /10 years.*judicial office/i,
        /10 years.*High Court advocate/i,
      ]);
    }
  });

  it("keeps Governor qualifications separate from conditions of office", () => {
    const questions = generatePolCp014ReviewBatchV1().filter(
      (q) => /qualifications for appointment as Governor|minimum age for appointment as Governor|citizenship condition applies to appointment as Governor/i.test(q.stem),
    );
    expect(questions).toHaveLength(3);
    for (const q of questions) {
      expectFullSet(q.explanation, [/citizen of India/i, /35 years/i]);
      expect(q.explanation).toMatch(/Article 158.*separate/i);
    }
  });

  it("keeps State Legislature membership qualification questions complete", () => {
    const questions = generatePolCp016ReviewBatchV1().filter((q) => /minimum age for membership of a State Legislative/i.test(q.stem));
    expect(questions).toHaveLength(2);
    for (const q of questions) {
      expectFullSet(q.explanation, [
        /citizen of India/i,
        /oath\/affirmation/i,
        /25.*Assembly|Assembly.*25/i,
        /30.*Council|Council.*30/i,
        /prescribed by Parliament/i,
      ]);
    }
  });

  it("retains full Attorney-General and Advocate-General qualification notes", () => {
    const questions = generatePolCp022ReviewBatchV2();
    const agi = questions.find((q) => /Attorney-General/i.test(q.stem) && /qualif|eligible/i.test(q.stem));
    const adv = questions.find((q) => /Advocate-General/i.test(q.stem) && /qualif|eligible/i.test(q.stem));
    expect(agi).toBeTruthy();
    expect(adv).toBeTruthy();
    expectFullSet(agi!.explanation, [/citizen of India/i, /5 years/i, /10 years/i, /distinguished jurist/i]);
    expectFullSet(adv!.explanation, [/citizen of India/i, /10 years.*judicial office/i, /10 years.*High Court advocate/i]);
  });
});
