import { strict as assert } from "node:assert";

import {
  COM003_WORD_TABS_HINDI_REVIEW,
  COM003_WORD_TABS_PUNJABI_REVIEW,
} from "./com003-word-tabs-completion-v1";
import {
  COM003_OFFICE_TABS_HINDI_REVIEW,
  COM003_OFFICE_TABS_PUNJABI_REVIEW,
} from "./com003-office-tabs-completion-v1";

const allowedTechnicalTerms = new Set(
  `Microsoft Word Excel PowerPoint Office Ribbon File Home Insert Design Layout References Mailings Review View Page Layout Formulas Data Animations Transitions Slide Show Backstage Quick Access Toolbar Formula Bar Name Box Status Bar Title Bar Scroll Bar Navigation Pane Format Painter Merge Center Text Box WordArt SmartArt PivotTable Recommended Charts Header Footer Print Area Print Titles Scale to Fit Function Library Insert Function AutoSum Name Manager Trace Precedents Trace Dependents Error Checking Show Formulas Calculate Now What-If Analysis Data Validation Text to Columns Flash Fill Remove Duplicates Freeze Panes View Side by Side Arrange All Page Break Preview Slide Master Presenter View Animation Pane Add Animation Effect Options Apply to All Rehearse Timings Record Slide Show From Beginning From Current Set Up Slide Show Format Background Slide Size Reading View Slide Sorter Master Views Outline View Grayscale Font Color Text Highlight Change Case Line Spacing Track Changes New Comment Table of Contents Cross-reference Insert Caption Mark Entry Mail Merge Address Block Greeting Line Insert Merge Field Preview Results Finish Merge Page Numbers Page Color Page Borders Clipboard Font Styles Editing Paragraph Number Cells Chart Table Pictures Slicer Shape Shapes Icons Equation Symbol Themes Effects Colors Margins Orientation Size Breaks Gridlines Headings Print Export Info Share Protect Save Open Close Normal Notes Comments Zoom Ruler Find Replace Clear Fill Sort Filter Title Status Name Box Contextual Watermark Borders Columns Citation Citations Bibliography Footnote Footnotes Endnote Endnotes Spacing Indent Editor Compare Thesaurus Translate Spelling Word Count Language Outline Section Animation Transition Duration Start After Click Use Hide Record Reorder Trigger Custom Background Variants Designer Video Audio Link Comment Speaker VBA PDF DOCX XLSX PPTX CSV URL SUM B`.split(/\\s+/),
);

function findLeakage(value: string) {
  return Array.from(value.matchAll(/[A-Za-z][A-Za-z&'/-]*/g))
    .map((match) => match[0])
    .filter((token) => !allowedTechnicalTerms.has(token));
}

const nativeCorpora = [
  ["Hindi", COM003_WORD_TABS_HINDI_REVIEW, COM003_OFFICE_TABS_HINDI_REVIEW],
  ["Punjabi", COM003_WORD_TABS_PUNJABI_REVIEW, COM003_OFFICE_TABS_PUNJABI_REVIEW],
] as const;

const leaks: string[] = [];
for (const [language, ...corpora] of nativeCorpora) {
  for (const corpus of corpora) {
    for (const question of corpus) {
      const fields = [question.stem, ...question.options, question.canonicalAnswer, question.explanation];
      for (const [fieldIndex, field] of fields.entries()) {
        for (const token of findLeakage(field)) {
          leaks.push(`${language}:${question.sourceQuestionId}:field-${fieldIndex}:${token}`);
        }
      }
    }
  }
}

assert.equal(leaks.length, 0, `Native-language English leakage found: ${leaks.slice(0, 20).join(", ")}`);
assert.equal(
  nativeCorpora.flatMap(([, ...corpora]) => corpora).some((corpus) =>
    corpus.some((question) => /[⟦⟧⟪⟫¤§]/.test([question.stem, ...question.options, question.canonicalAnswer, question.explanation].join(" "))),
  ),
  false,
  "Native corpus contains an unresolved localization placeholder",
);

console.log("[COM003-NATIVE-LANGUAGE-QUALITY-V1] PASS Hindi/Punjabi generic-English leakage=0; official UI labels preserved");
