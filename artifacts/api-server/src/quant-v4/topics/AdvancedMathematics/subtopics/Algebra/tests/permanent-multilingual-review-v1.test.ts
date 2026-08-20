import {
  ALG_ENGLISH_V3_FREEZE_ID,
  ALG_MULTILINGUAL_REVIEW_V1_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualReviewV1,
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
const forbiddenLifecycle = ["ACTIVE", "QUESTION_STUDIO", "QUESTION_BANK_WRITABLE", "PUBLICLY_PUBLISHABLE"];

let samples = 0;
let mappedVariants = 0;
const qlIds = new Set<string>();
const localizedQuestions = new Set<string>();

for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  mappedVariants += variants.length;
  qlIds.add(allocation.qlId);

  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const english = generateAlgPermanentEnglishV3Frozen(allocation.qlId, seed, variantIndex);

      for (const locale of locales) {
        const item = generateAlgPermanentMultilingualReviewV1(allocation.qlId, seed, locale, variantIndex);
        const prefix = `${allocation.qlId}/${english.prototypeId}/${locale}/seed-${seed}`;
        samples += 1;

        assert(item.localizationReviewId === ALG_MULTILINGUAL_REVIEW_V1_ID, `${prefix}: wrong localization review authority`);
        assert(item.sourceEnglishFreezeId === ALG_ENGLISH_V3_FREEZE_ID, `${prefix}: wrong English freeze source`);
        assert(item.locale === locale, `${prefix}: locale mismatch`);
        assert(item.language === (locale === "hi-IN" ? "hi" : "pa"), `${prefix}: language mismatch`);
        assert(item.maturity === "MULTILINGUAL_REVIEW_CANDIDATE_V1", `${prefix}: wrong maturity`);
        assert(item.reviewStatus === "HUMAN_LOCALIZATION_REVIEW_REQUIRED", `${prefix}: wrong review status`);

        assert(item.qlId === english.qlId, `${prefix}: QL changed`);
        assert(item.freezeKey === english.freezeKey, `${prefix}: freeze key changed`);
        assert(item.packageId === english.packageId && item.cpId === english.cpId, `${prefix}: package/CP changed`);
        assert(item.prototypeId === english.prototypeId, `${prefix}: prototype changed`);
        assert(item.prototypeSolveMode === english.prototypeSolveMode, `${prefix}: solve mode changed`);
        assert(item.variantIndex === english.variantIndex && item.seed === english.seed, `${prefix}: generation coordinates changed`);
        assert(stable(item.canonicalAnswer) === stable(english.canonicalAnswer), `${prefix}: canonical answer changed`);
        assert(stable(item.rawDiscoveryItem) === stable(english.rawDiscoveryItem), `${prefix}: raw solver state changed`);
        assert(item.englishQuestion === english.question, `${prefix}: English question provenance changed`);
        assert(item.englishExplanation === english.explanation, `${prefix}: English explanation provenance changed`);

        assert(item.question.trim().length > 0 && item.explanation.trim().length > 0, `${prefix}: blank learner surface`);
        assert(item.question !== english.question, `${prefix}: question was not localized`);
        assert(item.explanation !== english.explanation, `${prefix}: explanation was not localized`);
        assert(locale === "hi-IN" ? devanagari.test(item.question + item.explanation) : gurmukhi.test(item.question + item.explanation), `${prefix}: locale script missing`);
        assert(!/\b(?:Given|Required|Why this method):/i.test(item.explanation), `${prefix}: English solution guide label leaked`);
        assert(!/\b(?:Find|Solve|Factorise|Compare|Classify)\b/.test(item.question), `${prefix}: English command verb leaked in question`);
        assert(!/undefined|NaN|<script|<style/i.test(item.question + item.explanation), `${prefix}: invalid/render-unsafe token`);
        for (const token of forbiddenLifecycle) {
          assert(!item.question.includes(token) && !item.explanation.includes(token), `${prefix}: internal lifecycle token leaked`);
        }

        assert(item.permanentIdentityFrozen && item.semanticContractFrozen && item.solverAuthorityFrozen, `${prefix}: semantic/solver freeze lost`);
        assert(item.englishImplementationFrozen, `${prefix}: English V3 freeze lost`);
        assert(!item.multilingualImplementationFrozen, `${prefix}: multilingual freeze activated prematurely`);
        assert(!item.active && !item.questionStudioDiscoverable, `${prefix}: activation/Question Studio leaked`);
        assert(item.questionBankStatus === "NOT_STORED" && !item.questionBankWritable, `${prefix}: Question Bank leaked`);
        assert(item.testEligibility === "INELIGIBLE" && !item.testEligible, `${prefix}: test eligibility leaked`);
        assert(!item.publiclyPublishable, `${prefix}: publication leaked`);

        if (english.prototypeSolveMode === "data-sufficiency") {
          assert(/(?:^|\n)I\./.test(item.question) && /(?:^|\n)II\./.test(item.question), `${prefix}: Data Sufficiency statements missing`);
        }

        if (seed === 1) localizedQuestions.add(`${locale}:${item.question}`);
      }
    }
  }
}

assert(qlIds.size === 43, `Expected 43 permanent QLs, found ${qlIds.size}`);
assert(mappedVariants === 109, `Expected 109 mapped variants, found ${mappedVariants}`);
assert(samples === 2616, `Expected 2,616 multilingual stress samples, found ${samples}`);
assert(localizedQuestions.size === 218, `Expected 218 deterministic locale-question surfaces, found ${localizedQuestions.size}`);

console.log(`Algebra multilingual review V1 passed: ${samples} samples, 43 QLs, 109 variants, 2 locales`);
