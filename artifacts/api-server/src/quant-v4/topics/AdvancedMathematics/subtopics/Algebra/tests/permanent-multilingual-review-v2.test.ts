import {
  ALG_ENGLISH_V3_FREEZE_ID,
  ALG_MULTILINGUAL_REVIEW_V2_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualReviewV2,
  getAlgPermanentPrototypeIds,
  type AlgReviewLocale,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

const locales: readonly AlgReviewLocale[] = ["hi-IN", "pa-IN"];
const devanagari = /[\u0900-\u097F]/;
const gurmukhi = /[\u0A00-\u0A7F]/;
const allowedAsciiMathWords = new Set([
  "ab", "bc", "ca", "abc", "ax", "bx", "cx", "kx", "mx", "ac", "ii", "iii", "iv",
]);
const residue = new Map<string, Set<string>>();
const wrongScript = new Map<string, Set<string>>();

function auditEnglishResidue(prefix: string, text: string): void {
  for (const raw of text.match(/[A-Za-z]{2,}/g) ?? []) {
    const token = raw.toLowerCase();
    if (allowedAsciiMathWords.has(token)) continue;
    if (!residue.has(token)) residue.set(token, new Set());
    const examples = residue.get(token)!;
    if (examples.size < 4) examples.add(`${prefix}: ${text.slice(0, 220)}`);
  }
}
function auditScriptPurity(locale: AlgReviewLocale, prefix: string, text: string): void {
  const wrong = locale === "hi-IN" ? text.match(/[\u0A00-\u0A7F]+/g) : text.match(/[\u0900-\u097F]+/g);
  for (const token of wrong ?? []) {
    const key = `${locale}:${token}`;
    if (!wrongScript.has(key)) wrongScript.set(key, new Set());
    const examples = wrongScript.get(key)!;
    if (examples.size < 3) examples.add(`${prefix}: ${text.slice(0, 220)}`);
  }
}

let samples = 0;
let mappedVariants = 0;
const qlIds = new Set<string>();
const deterministicSurfaces = new Set<string>();

for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  mappedVariants += variants.length;
  qlIds.add(allocation.qlId);

  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const english = generateAlgPermanentEnglishV3Frozen(allocation.qlId, seed, variantIndex);
      for (const locale of locales) {
        const item = generateAlgPermanentMultilingualReviewV2(allocation.qlId, seed, locale, variantIndex);
        const prefix = `${allocation.qlId}/${english.prototypeId}/${locale}/seed-${seed}`;
        samples += 1;

        assert(item.localizationReviewId === ALG_MULTILINGUAL_REVIEW_V2_ID, `${prefix}: wrong V2 review authority`);
        assert(item.sourceEnglishFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: wrong frozen English source`);
        assert(item.maturity === "MULTILINGUAL_REVIEW_CANDIDATE_V2", `${prefix}: wrong maturity`);
        assert(item.reviewStatus === "FAMILY_AWARE_HUMAN_LOCALIZATION_REVIEW_REQUIRED", `${prefix}: wrong review status`);
        assert(item.locale === locale && item.language === (locale === "hi-IN" ? "hi" : "pa"), `${prefix}: locale/language mismatch`);

        assert(item.qlId === english.qlId && item.freezeKey === english.freezeKey, `${prefix}: QL/freeze key changed`);
        assert(item.packageId === english.packageId && item.cpId === english.cpId, `${prefix}: package/CP changed`);
        assert(item.prototypeId === english.prototypeId && item.prototypeSolveMode === english.prototypeSolveMode, `${prefix}: prototype/solve mode changed`);
        assert(item.variantIndex === english.variantIndex && item.seed === english.seed, `${prefix}: coordinates changed`);
        assert(stable(item.canonicalAnswer) === stable(english.canonicalAnswer), `${prefix}: canonical answer changed`);
        assert(stable(item.rawDiscoveryItem) === stable(english.rawDiscoveryItem), `${prefix}: raw solver state changed`);
        assert(item.englishQuestion === english.question && item.englishExplanation === english.explanation, `${prefix}: English provenance changed`);

        assert(item.question.trim().length > 0 && item.explanation.trim().length > 0, `${prefix}: blank localized surface`);
        assert(item.question !== english.question && item.explanation !== english.explanation, `${prefix}: localization missing`);
        assert(locale === "hi-IN" ? devanagari.test(item.question + item.explanation) : gurmukhi.test(item.question + item.explanation), `${prefix}: target script missing`);
        assert(!/undefined|NaN|<script|<style/i.test(item.question + item.explanation), `${prefix}: render-unsafe token`);

        auditEnglishResidue(`${prefix}/question`, item.question);
        auditEnglishResidue(`${prefix}/explanation`, item.explanation);
        auditScriptPurity(locale, `${prefix}/question`, item.question);
        auditScriptPurity(locale, `${prefix}/explanation`, item.explanation);

        assert(item.permanentIdentityFrozen && item.semanticContractFrozen && item.solverAuthorityFrozen && item.englishImplementationFrozen, `${prefix}: frozen upstream authority lost`);
        assert(!item.multilingualImplementationFrozen, `${prefix}: multilingual freeze activated prematurely`);
        assert(!item.active && !item.questionStudioDiscoverable, `${prefix}: activation/Question Studio leaked`);
        assert(item.questionBankStatus === "NOT_STORED" && !item.questionBankWritable, `${prefix}: Question Bank leaked`);
        assert(item.testEligibility === "INELIGIBLE" && !item.testEligible && !item.publiclyPublishable, `${prefix}: downstream eligibility leaked`);

        if (english.prototypeSolveMode === "data-sufficiency") {
          assert(/(?:^|\n)I\./.test(item.question) && /(?:^|\n)II\./.test(item.question), `${prefix}: Data Sufficiency statements missing`);
        }
        if (seed === 1) deterministicSurfaces.add(`${locale}:${item.question}`);
      }
    }
  }
}

assert(qlIds.size === 43, `Expected 43 QLs, found ${qlIds.size}`);
assert(mappedVariants === 109, `Expected 109 mapped variants, found ${mappedVariants}`);
assert(samples === 2616, `Expected 2,616 V2 samples, found ${samples}`);
assert(deterministicSurfaces.size === 218, `Expected 218 deterministic locale surfaces, found ${deterministicSurfaces.size}`);

const failures: string[] = [];
if (residue.size > 0) {
  const details = [...residue.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([token, examples]) => `${token}: ${[...examples].join(" || ")}`)
    .join("\n");
  failures.push(`English prose residue remains (${residue.size} tokens):\n${details}`);
}
if (wrongScript.size > 0) {
  const details = [...wrongScript.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([token, examples]) => `${token}: ${[...examples].join(" || ")}`)
    .join("\n");
  failures.push(`Cross-script residue remains (${wrongScript.size} tokens):\n${details}`);
}
if (failures.length > 0) throw new Error(`Multilingual V2 editorial purity failed:\n${failures.join("\n\n")}`);

console.log(`Algebra multilingual review V2 passed: ${samples} samples, 43 QLs, 109 variants, 2 locales, zero English prose residue, zero cross-script residue`);
