import {
  applyPfcTpfStudioEditorialV1_1,
  PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1,
  type PfcTpfStudioEditorialQuestionV1_1,
} from "./paper-folding-question-studio-editorial-v1-1";
import {
  generatePfcTpfStudioQuestionV1,
  type PfcTpfStudioLanguageV1,
  type PfcTpfStudioQlIdV1,
} from "./paper-folding-question-studio-seeded-runtime-v1";
import { PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1 } from "./paper-folding-question-studio-integration-v1";

const QLS = ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;
const TARGET_STEM_VARIANT_BY_QL = {
  "SPA-QL-035": 0,
  "SPA-QL-036": 1,
  "SPA-QL-037": 2,
  "SPA-QL-038": 3,
} as const;

export const PFC_TPF_QUESTION_STUDIO_OPERATOR_REVIEW_AUTHORITY_V1_2 = Object.freeze({
  authorityId: "PFC-TPF-QUESTION-STUDIO-OPERATOR-REVIEW-V1.2" as const,
  supersedesReviewAuthorityId: "PFC-TPF-QUESTION-STUDIO-OPERATOR-REVIEW-V1.1" as const,
  integrationAuthorityId: PFC_TPF_QUESTION_STUDIO_INTEGRATION_AUTHORITY_V1.authorityId,
  editorialAuthorityId: PFC_TPF_QUESTION_STUDIO_EDITORIAL_AUTHORITY_V1_1.authorityId,
  reviewQuestionCount: 18,
  questionsPerQl: 3,
  languagesPerQl: LANGUAGES,
  permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
  remediation: {
    pairedGeometryAcrossLanguages: true,
    answerPositionCoverage: "A_B_C_D_ALL_REQUIRED" as const,
    forwardStemVariantsCovered: "0_1_2_3_ALL_REQUIRED" as const,
    reachableDeterministicAnswerStemPairsOnly: true,
    reviewAxisSelection: "STEM_VARIANT_FIXED_PER_FORWARD_QL_ANSWER_COVERAGE_SOLVED_ACROSS_SET" as const,
    questionAwareExplanationVariation: true,
    learnerFacingEnglishJargonRemovedFromHindiPunjabi: true,
    reverseInferenceWideOptionLayout: true,
    whiteReviewSurface: true,
  },
  reviewPurpose: "VERIFY_DYNAMIC_STUDIO_GEOMETRY_DISTRACTOR_CLARITY_EDITORIAL_VARIETY_LOCALIZATION_AND_PAYLOAD" as const,
  status: "OPERATOR_REVIEW_V1_2_CANDIDATE" as const,
  questionStudioRegistrationAllowed: false,
} as const);

type ReviewSeedCandidate = {
  seed: string;
  correctIndex: 0 | 1 | 2 | 3;
  stemVariant: number;
};

function candidateSeedsForQl(
  qlId: PfcTpfStudioQlIdV1,
  targetStemVariant?: number,
): ReviewSeedCandidate[] {
  const firstByAnswer = new Map<number, ReviewSeedCandidate>();
  for (let index = 0; index < 256; index += 1) {
    // Numeric suffix is intentional: the V1.1 editorial authority balances stem
    // variants across sequential Studio seeds without changing geometry identity.
    const seed = `pfc-tpf-studio-review-v1-2:${qlId}:${index}`;
    const base = generatePfcTpfStudioQuestionV1({ qlId, seed, language: "en" });
    const edited = applyPfcTpfStudioEditorialV1_1(base);
    if (targetStemVariant !== undefined && edited.editorial.stemVariant !== targetStemVariant) continue;
    if (!firstByAnswer.has(edited.correctIndex)) {
      firstByAnswer.set(edited.correctIndex, {
        seed,
        correctIndex: edited.correctIndex,
        stemVariant: edited.editorial.stemVariant,
      });
    }
    if (firstByAnswer.size === 4) break;
  }
  const candidates = [...firstByAnswer.values()].sort((left, right) =>
    left.correctIndex - right.correctIndex || left.seed.localeCompare(right.seed),
  );
  if (!candidates.length) {
    throw new Error(`${qlId}: unable to find a deterministic review seed${targetStemVariant === undefined ? "" : ` for stem variant ${targetStemVariant}`}.`);
  }
  return candidates;
}

function selectReviewSeeds(): Record<PfcTpfStudioQlIdV1, string> {
  const candidateLists = QLS.map((qlId) => {
    const targetStemVariant = (TARGET_STEM_VARIANT_BY_QL as Partial<Record<PfcTpfStudioQlIdV1, number>>)[qlId];
    return {
      qlId: qlId as PfcTpfStudioQlIdV1,
      candidates: candidateSeedsForQl(qlId as PfcTpfStudioQlIdV1, targetStemVariant),
    };
  });

  const selected = new Map<PfcTpfStudioQlIdV1, ReviewSeedCandidate>();
  let solution: Map<PfcTpfStudioQlIdV1, ReviewSeedCandidate> | null = null;

  function visit(index: number, coveredAnswers: Set<number>): void {
    if (solution) return;
    if (index === candidateLists.length) {
      if (coveredAnswers.size === 4) solution = new Map(selected);
      return;
    }
    const remaining = candidateLists.length - index;
    if (coveredAnswers.size + remaining < 4) return;
    const { qlId, candidates } = candidateLists[index]!;
    for (const candidate of candidates) {
      selected.set(qlId, candidate);
      const nextCovered = new Set(coveredAnswers);
      nextCovered.add(candidate.correctIndex);
      visit(index + 1, nextCovered);
      if (solution) return;
    }
    selected.delete(qlId);
  }

  visit(0, new Set());
  if (!solution) {
    throw new Error("PFC/TPF Studio V1.2 review could not select real deterministic seeds covering all answer positions while preserving the four forward stem variants.");
  }
  return Object.fromEntries(
    [...solution.entries()].map(([qlId, candidate]) => [qlId, candidate.seed]),
  ) as Record<PfcTpfStudioQlIdV1, string>;
}

export function generatePfcTpfStudioOperatorReviewV1_2(): PfcTpfStudioEditorialQuestionV1_1[] {
  const questions: PfcTpfStudioEditorialQuestionV1_1[] = [];
  const seedByQl = selectReviewSeeds();
  for (const qlId of QLS) {
    const seed = seedByQl[qlId as PfcTpfStudioQlIdV1];
    for (const language of LANGUAGES) {
      const base = generatePfcTpfStudioQuestionV1({
        qlId: qlId as PfcTpfStudioQlIdV1,
        language: language as PfcTpfStudioLanguageV1,
        seed,
      });
      questions.push(applyPfcTpfStudioEditorialV1_1(base));
    }
  }
  return questions;
}

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderPfcTpfStudioOperatorReviewHtmlV1_2(questions = generatePfcTpfStudioOperatorReviewV1_2()): string {
  const cards = questions.map((question) => `<article class="q" data-ql="${question.qlId}" data-language="${question.language}" data-provenance="${question.provenance}"><div class="meta">${question.qlId} · ${question.language.toUpperCase()} · ${esc(question.mode)} · ${esc(question.representation)} · ${question.provenance} · stem V${question.editorial.stemVariant + 1}</div><h2>${esc(question.qlName)}</h2><p><strong>Question:</strong> ${esc(question.stem)}</p><div class="stimulus">${question.stimulusSvgs.join("")}</div><div class="options">${question.optionSvgs.map((svg, index) => `<div class="option"><strong>${["A", "B", "C", "D"][index]}</strong>${svg}</div>`).join("")}</div><p><strong>Answer:</strong> ${question.answer}</p><div class="ex"><p><strong>Observe:</strong> ${esc(question.explanation.observation)}</p><p><strong>Rule:</strong> ${esc(question.explanation.rule)}</p><p><strong>Apply:</strong> ${esc(question.explanation.application)}</p><p><strong>Check:</strong> ${esc(question.explanation.check)}</p></div><p class="small">Generation seed: ${esc(question.generationSeed)} · Geometry fingerprint: ${question.contentFingerprint} · Editorial fingerprint: ${question.editorial.editorialFingerprint}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC TPF Question Studio Operator Review V1.2</title><style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;line-height:1.45}.wrap{max-width:1220px;margin:auto;padding:18px}.intro,.q{border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:18px;background:#fff}.meta,.small{font-size:12px;color:#555}.q h2{font-size:18px}.stimulus{overflow:auto;margin:12px 0;background:#fff}.stimulus svg{max-width:100%;height:auto;background:#fff}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.q[data-ql="SPA-QL-039"] .options{grid-template-columns:repeat(2,minmax(0,1fr))}.option{border:1px solid #ddd;border-radius:8px;padding:8px;text-align:center;overflow:hidden;background:#fff}.option svg{max-width:100%;height:auto;background:#fff}.ex{border-top:1px solid #eee;margin-top:12px;padding-top:8px}.ex p{margin:5px 0}@media(max-width:780px){.options{grid-template-columns:repeat(2,minmax(0,1fr))}.q[data-ql="SPA-QL-039"] .options{grid-template-columns:1fr}.wrap{padding:10px}}@media(max-width:440px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="intro"><h1>PFC / TPF Question Studio Operator Review V1.2</h1><p>18 review items covering all six permanent QLs. English, Hindi and Punjabi show exactly the same geometry for each QL. The four forward-fold QLs deliberately cover all four stem styles, while the six selected real generation seeds collectively cover answer positions A, B, C and D. Explanations vary by seed while preserving the same solving rule. Reverse-inference options use a wider layout. Registration, persistence and test/public eligibility remain locked until this surface is approved.</p></section>${cards}</main></body></html>`;
}
