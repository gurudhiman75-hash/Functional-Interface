import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1,
  generateLp001LocalizedBatchV1,
  generateLp002LocalizedBatchV1,
  generateLp003LocalizedBatchV1,
  generateLp004LocalizedBatchV1,
  generateLp005LocalizedBatchV1,
  generateLp006LocalizedBatchV1,
  generateLp007LocalizedBatchV1,
  generateLp008LocalizedBatchV1,
  type Lp001008LocalizedCaselet,
  type Lp001008LocalizedChild,
  type Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";

export const LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2 = Object.freeze({
  ...LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1,
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2" as const,
  supersedes: LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V2" as const,
  editorialFocus: "QUESTION_TARGET_PARITY_AND_COMPLETE_NAME_LOCALIZATION" as const,
  targetExtraction: "QUESTION_TAIL_OR_CORRECT_OPTION_SEMANTICS" as const,
});

const NAME_PATCH: Record<Lp001008LocalizedLanguage, Record<string, string>> = {
  hi: { Ishita: "इशिता", Arjun: "अर्जुन", Vivek: "विवेक", Zubin: "जुबिन", Tina: "टीना", Nitin: "नितिन", Rupa: "रूपा" },
  pa: { Ishita: "ਇਸ਼ਿਤਾ", Arjun: "ਅਰਜੁਨ", Vivek: "ਵਿਵੇਕ", Zubin: "ਜ਼ੁਬਿਨ", Tina: "ਟੀਨਾ", Nitin: "ਨਿਤਿਨ", Rupa: "ਰੂਪਾ" },
};

function patchNames(language: Lp001008LocalizedLanguage, text: string): string {
  let output = text;
  for (const [source, target] of Object.entries(NAME_PATCH[language])) output = output.split(source).join(target);
  return output;
}

function questionTail(stem: string): string {
  return stem.split(/\n\s*\n/gu).map((part) => part.trim()).filter(Boolean).at(-1) ?? stem.trim();
}

function parseTableRows(block: string): string[][] {
  const lines = block.split("\n").filter((line) => line.trim().startsWith("|"));
  if (lines.length < 3) return [];
  return lines.slice(2).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

function finalRows(child: Lp001008LocalizedChild): string[][] {
  for (let index = child.explanation.lines.length - 1; index >= 0; index -= 1) {
    const block = child.explanation.lines[index]!;
    if (!block.includes("|")) continue;
    const rows = parseTableRows(block);
    if (rows.length) return rows;
  }
  throw new Error(`No final table found for ${child.questionId}`);
}

function englishLabelIndex(values: readonly string[], target: string): number {
  const index = values.findIndex((value) => target.includes(value));
  if (index < 0) throw new Error(`Unable to resolve learner target from question tail: ${target}`);
  return index;
}

function localizedPeopleFromAnswer(answer: string): string[] {
  return answer.split(";").map((part) => part.split("—")[0]!.trim()).filter(Boolean);
}

function patchChild(language: Lp001008LocalizedLanguage, child: Lp001008LocalizedChild): Lp001008LocalizedChild {
  return {
    ...child,
    stem: patchNames(language, child.stem),
    options: child.options.map((option) => patchNames(language, option)),
    answer: patchNames(language, child.answer),
    explanation: {
      summary: patchNames(language, child.explanation.summary),
      lines: child.explanation.lines.map((line) => patchNames(language, line)),
    },
  };
}

function polishLp006(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const english = caselet.englishCaselet as any;
  const englishPeople = english.people.map((id: string) => english.labels.people[id]);
  const children = caselet.children.map((raw) => {
    const child = patchChild(language, raw);
    if (!["LP-QL-021", "LP-QL-022", "LP-QL-023"].includes(child.qlId)) return child;
    const tail = questionTail((raw.englishChild as any).stem);
    const personIndex = englishLabelIndex(englishPeople, tail);
    const person = finalRows(child)[personIndex]![0]!;
    const stem = child.qlId === "LP-QL-021"
      ? (language === "hi" ? `${person} को कौन-सा दिन मिला है?` : `${person} ਨੂੰ ਕਿਹੜਾ ਦਿਨ ਮਿਲਿਆ ਹੈ?`)
      : child.qlId === "LP-QL-022"
        ? (language === "hi" ? `${person} का अध्ययन क्षेत्र कौन-सा है?` : `${person} ਦਾ ਅਧਿਐਨ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?`)
        : (language === "hi" ? `${person} का शहर कौन-सा है?` : `${person} ਦਾ ਸ਼ਹਿਰ ਕਿਹੜਾ ਹੈ?`);
    return { ...child, stem };
  });
  return { ...caselet, scenario: patchNames(language, caselet.scenario), learnerFacingClues: caselet.learnerFacingClues.map((clue) => patchNames(language, clue)), children };
}

function polishLp007(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const english = caselet.englishCaselet as any;
  const englishPeople = english.people.map((id: string) => english.labels.people[id]);
  const englishValues = english.values.map((id: string) => english.labels.values[id]);
  const children = caselet.children.map((raw) => {
    const child = patchChild(language, raw);
    const rows = finalRows(child);
    const tail = questionTail((raw.englishChild as any).stem);
    if (child.qlId === "LP-QL-025") {
      const personIndex = englishLabelIndex(englishPeople, tail);
      const person = rows[personIndex]![0]!;
      return { ...child, stem: language === "hi" ? `${person} का विकल्प कौन-सा है?` : `${person} ਦੀ ਚੋਣ ਕਿਹੜੀ ਹੈ?` };
    }
    if (child.qlId === "LP-QL-026") {
      const valueIndex = englishLabelIndex(englishValues, tail);
      const valueId = english.values[valueIndex];
      const personIndex = english.people.findIndex((person: string) => english.assignment[person] === valueId);
      const value = rows[personIndex]![1]!;
      return { ...child, stem: language === "hi" ? `${value} विकल्प किस व्यक्ति का है?` : `${value} ਚੋਣ ਕਿਸ ਵਿਅਕਤੀ ਦੀ ਹੈ?` };
    }
    const people = localizedPeopleFromAnswer(child.answer);
    if (child.qlId === "LP-QL-027") return { ...child, stem: language === "hi" ? `${people[0]} और ${people[1]} के लिए सही विकल्पों वाला मिलान कौन-सा है?` : `${people[0]} ਅਤੇ ${people[1]} ਲਈ ਸਹੀ ਚੋਣਾਂ ਵਾਲਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?` };
    if (child.qlId === "LP-QL-028") return { ...child, stem: language === "hi" ? `${people.join(", ")} के लिए सही मिलान कौन-सा है?` : `${people.join(", ")} ਲਈ ਸਹੀ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?` };
    return child;
  });
  return { ...caselet, scenario: patchNames(language, caselet.scenario), learnerFacingClues: caselet.learnerFacingClues.map((clue) => patchNames(language, clue)), children };
}

function slotLabelEnglish(caselet: any, slot: number): string {
  return `${slot % 2 === 0 ? "12th" : "27th"} ${caselet.labels.months[Math.floor(slot / 2)]}`;
}

function polishLp008(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const english = caselet.englishCaselet as any;
  const englishPeople = english.people.map((id: string) => english.labels.people[id]);
  const englishSlots = english.slots.map((slot: number) => slotLabelEnglish(english, slot));
  const children = caselet.children.map((raw) => {
    const child = patchChild(language, raw);
    const rows = finalRows(child);
    const tail = questionTail((raw.englishChild as any).stem);
    if (child.qlId === "LP-QL-029") {
      const slotIndex = englishLabelIndex(englishSlots, tail);
      const targetSlot = english.slots[slotIndex];
      const personIndex = english.people.findIndex((person: string) => english.assignment[person] === targetSlot);
      const slot = rows[personIndex]![1]!;
      return { ...child, stem: language === "hi" ? `${slot} पर कौन-सा व्यक्ति निर्धारित है?` : `${slot} ਨੂੰ ਕਿਹੜਾ ਵਿਅਕਤੀ ਨਿਰਧਾਰਤ ਹੈ?` };
    }
    if (child.qlId === "LP-QL-030") {
      const personIndex = englishLabelIndex(englishPeople, tail);
      const person = rows[personIndex]![0]!;
      return { ...child, stem: language === "hi" ? `${person} की तारीख और महीना क्या है?` : `${person} ਦੀ ਤਾਰੀਖ ਅਤੇ ਮਹੀਨਾ ਕੀ ਹੈ?` };
    }
    const people = localizedPeopleFromAnswer(child.answer);
    if (child.qlId === "LP-QL-031") return { ...child, stem: language === "hi" ? `${people[0]} और ${people[1]} के लिए सही तारीख-महीना मिलान कौन-सा है?` : `${people[0]} ਅਤੇ ${people[1]} ਲਈ ਸਹੀ ਤਾਰੀਖ-ਮਹੀਨਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?` };
    if (child.qlId === "LP-QL-032") return { ...child, stem: language === "hi" ? `${people.join(", ")} के लिए सही तारीख-महीना मिलान कौन-सा है?` : `${people.join(", ")} ਲਈ ਸਹੀ ਤਾਰੀਖ-ਮਹੀਨਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?` };
    return child;
  });
  return { ...caselet, scenario: patchNames(language, caselet.scenario), learnerFacingClues: caselet.learnerFacingClues.map((clue) => patchNames(language, clue)), children };
}

function patchGeneric(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  return {
    ...caselet,
    scenario: patchNames(language, caselet.scenario),
    learnerFacingClues: caselet.learnerFacingClues.map((clue) => patchNames(language, clue)),
    children: caselet.children.map((child) => patchChild(language, child)),
  };
}

export function generateLp001LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-001-localization-v2", count = 8) { return generateLp001LocalizedBatchV1(language, seed, count).map((caselet) => patchGeneric(language, caselet)); }
export function generateLp002LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-002-localization-v2", count = 8) { return generateLp002LocalizedBatchV1(language, seed, count).map((caselet) => patchGeneric(language, caselet)); }
export function generateLp003LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-003-localization-v2", count = 8) { return generateLp003LocalizedBatchV1(language, seed, count).map((caselet) => patchGeneric(language, caselet)); }
export function generateLp004LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-004-localization-v2", count = 8) { return generateLp004LocalizedBatchV1(language, seed, count).map((caselet) => patchGeneric(language, caselet)); }
export function generateLp005LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-005-localization-v2", count = 8) { return generateLp005LocalizedBatchV1(language, seed, count).map((caselet) => patchGeneric(language, caselet)); }
export function generateLp006LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-006-localization-v2", count = 8) { return generateLp006LocalizedBatchV1(language, seed, count).map((caselet) => polishLp006(language, caselet)); }
export function generateLp007LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-007-localization-v2", count = 8) { return generateLp007LocalizedBatchV1(language, seed, count).map((caselet) => polishLp007(language, caselet)); }
export function generateLp008LocalizedBatchV2(language: Lp001008LocalizedLanguage, seed = "lp-008-localization-v2", count = 8) { return generateLp008LocalizedBatchV1(language, seed, count).map((caselet) => polishLp008(language, caselet)); }

export const LP_001_008_LOCALIZED_GENERATORS_V2 = Object.freeze({
  "LP-001": generateLp001LocalizedBatchV2,
  "LP-002": generateLp002LocalizedBatchV2,
  "LP-003": generateLp003LocalizedBatchV2,
  "LP-004": generateLp004LocalizedBatchV2,
  "LP-005": generateLp005LocalizedBatchV2,
  "LP-006": generateLp006LocalizedBatchV2,
  "LP-007": generateLp007LocalizedBatchV2,
  "LP-008": generateLp008LocalizedBatchV2,
});
