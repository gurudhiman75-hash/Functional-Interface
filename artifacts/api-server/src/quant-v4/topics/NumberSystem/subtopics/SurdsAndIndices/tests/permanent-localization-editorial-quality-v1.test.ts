import { strict as assert } from "node:assert";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../permanent-allocation-v1";
import { buildSriPermanentEnglishReviewCorpusV1 } from "../permanent-english-review-v1";
import {
  generateSriPermanentLocalizedQuestionV1,
  localizeSriDiscoveryQuestionV1,
  type SriLocalizedLocaleV1,
} from "../permanent-localization-v1";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly SriLocalizedLocaleV1[];
const SEEDS_PER_QL = 24;
const EXPECTED_QLS = 58;
const EXPECTED_REVIEW_ROWS = 184;
const ALLOWED_MULTI_LETTER_LATIN = new Set(["ab", "mn", "mx", "ii", "iii", "iv"]);

const failures = new Set<string>();
let runtimeQuestions = 0;
let reviewRows = 0;
let learnerSurfaces = 0;

for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  for (let seedIndex = 0; seedIndex < SEEDS_PER_QL; seedIndex += 1) {
    const externalSeed = `phase9-editorial-quality:${seedIndex}`;
    for (const locale of LOCALES) {
      const localized = generateSriPermanentLocalizedQuestionV1(allocation.qlId, externalSeed, locale);
      runtimeQuestions += 1;
      const surfaces = learnerSurfacesOf(localized.question);
      learnerSurfaces += surfaces.length;
      auditSurfaces(`${allocation.qlId}/${localized.sourceCandidateId}/${locale}`, surfaces);
    }
  }
}

const reviewCorpus = buildSriPermanentEnglishReviewCorpusV1(2);
assert.equal(reviewCorpus.length, EXPECTED_REVIEW_ROWS);
for (const row of reviewCorpus) {
  for (const locale of LOCALES) {
    const localized = localizeSriDiscoveryQuestionV1(row.question, locale);
    reviewRows += 1;
    const surfaces = learnerSurfacesOf(localized);
    learnerSurfaces += surfaces.length;
    auditSurfaces(`${row.qlId}/${row.memberCandidateId}/${locale}/review`, surfaces);
  }
}

assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, EXPECTED_QLS);
assert.equal(runtimeQuestions, EXPECTED_QLS * SEEDS_PER_QL * LOCALES.length);
assert.equal(reviewRows, EXPECTED_REVIEW_ROWS * LOCALES.length);
assert.deepEqual(
  [...failures],
  [],
  `SRI localized learner prose failed editorial-quality gates:\n${[...failures].join("\n")}`,
);

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_LOCALIZATION_EDITORIAL_QUALITY_V1",
  permanentQls: EXPECTED_QLS,
  locales: LOCALES,
  runtimeSeedsPerQl: SEEDS_PER_QL,
  localizedRuntimeQuestions: runtimeQuestions,
  localizedReviewRows: reviewRows,
  learnerSurfacesAudited: learnerSurfaces,
  allowedSymbolicLatinTokens: [...ALLOWED_MULTI_LETTER_LATIN],
  machineLiteralPresentationChecks: true,
  editorialQualityPassed: true,
}, null, 2));

function learnerSurfacesOf(question: {
  readonly stem: string;
  readonly options: readonly { readonly text: string }[];
  readonly explanation: {
    readonly given: string;
    readonly asked: string;
    readonly method: string;
    readonly working: readonly string[];
    readonly answer: string;
  };
  readonly answer: { readonly text: string };
}): readonly string[] {
  return [
    question.stem,
    ...question.options.map((option) => option.text),
    question.explanation.given,
    question.explanation.asked,
    question.explanation.method,
    ...question.explanation.working,
    question.explanation.answer,
    question.answer.text,
  ];
}

function auditSurfaces(scope: string, surfaces: readonly string[]): void {
  for (const text of surfaces) {
    const residues = unexpectedLatinWords(text);
    if (residues.length > 0 && failures.size < 240) {
      failures.add(`${scope}: latin:${residues.join(", ")} :: ${text}`);
    }
    for (const problem of machineLiteralProblems(text)) {
      if (failures.size < 240) failures.add(`${scope}: ${problem} :: ${text}`);
    }
  }
}

function unexpectedLatinWords(text: string): readonly string[] {
  // LaTeX commands such as \\sqrt, \\frac and \\cdots are mathematical syntax,
  // not learner prose. Single Latin letters are also valid algebraic symbols.
  // Everything else must be native Hindi/Punjabi prose unless explicitly allowed
  // as a compact mathematical token or Roman statement label.
  const withoutLatexCommands = text.replace(/\\[A-Za-z]+/gu, " ");
  const tokens = [...withoutLatexCommands.matchAll(/\b[A-Za-z]{2,}\b/gu)]
    .map((match) => match[0].toLowerCase())
    .filter((token) => !ALLOWED_MULTI_LETTER_LATIN.has(token));
  return [...new Set(tokens)];
}

function machineLiteralProblems(text: string): readonly string[] {
  const problems: string[] = [];
  if (/[\u0900-\u097F\u0A00-\u0A7F]s\b/u.test(text)) problems.push("attached-English-suffix");
  if (/निर्धारित कीजिए x से/u.test(text)) problems.push("machine-order-hi-determine-x-from");
  if (/ਨਿਰਧਾਰਤ ਕਰੋ x ਤੋਂ/u.test(text)) problems.push("machine-order-pa-determine-x-from");
  if (/का मान ज्ञात कीजिए\s+[A-Za-z0-9\\(]/u.test(text)) problems.push("machine-order-hi-value-of");
  if (/ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ\s+[A-Za-z0-9\\(]/u.test(text)) problems.push("machine-order-pa-value-of");
  if (/x\+-\d/u.test(text)) problems.push("malformed-signed-shift");
  if (/x\+0(?=[}=])/u.test(text)) problems.push("redundant-zero-shift");
  return problems;
}
