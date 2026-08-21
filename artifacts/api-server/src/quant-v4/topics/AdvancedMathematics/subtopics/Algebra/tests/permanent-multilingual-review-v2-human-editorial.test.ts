import {
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentMultilingualReviewV2,
  getAlgPermanentPrototypeIds,
  type AlgReviewLocale,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const locales: readonly AlgReviewLocale[] = ["hi-IN", "pa-IN"];

const hindiAntiPatterns: ReadonlyArray<readonly [RegExp, string]> = [
  [/हैं मूल का/, "unnatural root order"],
  [/^α और β के मूल हैं /m, "unnatural question root order"],
  [/मान रखें: में/, "broken substitution order"],
  [/है उपयोग किया क्योंकि/, "machine-translated justification"],
  [/हैं दिया गया सीधे/, "broken agreement"],
  [/है उपयुक्त क्योंकि/, "broken identity justification"],
  [/वर्ग दिया गया संबंध/, "broken square instruction"],
  [/में सर्वसमिका और अलग करें/, "broken identity substitution"],
  [/विस्तार करने पर तीन वर्ग मिलता है/, "broken expansion wording"],
  [/गणना करें कोष्ठक/, "broken calculation wording"],
  [/वहाँ है कोई नहीं/, "broken no-need conclusion"],
  [/कोई भी नहीं मूल/, "broken zero-root wording"],
  [/\bहै a\b/, "English-article grammar leak"],
  [/द्विघात है धनेतर/, "broken sign-interval wording"],
  [/मूल हैं शामिल/, "broken inclusion wording"],
  [/^A धनात्मक/m, "English article in square argument"],
  [/द्विघात है मूल/, "broken root-interval wording"],
  [/पूर्णांक में वह अंतराल/, "broken integer-count wording"],
  [/सबसे छोटा मान का/, "broken minimum noun order"],
  [/न्यूनतम मान का/, "broken minimum noun order"],
  [/प्राप्त होने योग्य और है/, "broken attainability wording"],
  [/बल्कि से केवल/, "broken comparison wording"],
];

const punjabiAntiPatterns: ReadonlyArray<readonly [RegExp, string]> = [
  [/ਹਨ ਮੂਲ ਦਾ/, "unnatural root order"],
  [/^α ਅਤੇ β ਦੇ ਮੂਲ ਹਨ /m, "unnatural question root order"],
  [/ਮਾਨ ਰੱਖੋ: ਵਿੱਚ/, "broken substitution order"],
  [/ਹੈ ਵਰਤਿਆ ਕਿਉਂਕਿ/, "machine-translated justification"],
  [/ਦਿਜਾਂ ਗਜਾਂ/, "transliteration artifact"],
  [/ਪਹੱਲਾ/, "transliteration artifact"],
  [/ਉੱਥੇ ਹੈ/, "broken no-need conclusion"],
  [/ਕੋਈ ਵੀ ਨਹੀਂ ਮੂਲ/, "broken zero-root wording"],
  [/\bਹੈ a\b/, "English-article grammar leak"],
  [/ਗੈਰ-ਧਨਾਤਮਕ ਵਿਚਕਾਰ ਮੂਲ/, "broken sign-interval wording"],
  [/ਮੂਲ ਹਨ ਸ਼ਾਮਲ/, "broken inclusion wording"],
  [/^A ਧਨਾਤਮਕ/m, "English article in square argument"],
  [/ਦੋ-ਘਾਤੀ ਹੈ ਮੂਲ/, "broken root-interval wording"],
  [/ਸਬਤੋਂ/, "non-editorial minimum wording"],
  [/ਪ੍ਰਾਪਤ ਹੋਵੇਨੇ ਜੋੜ੍ਯ/, "transliteration artifact"],
  [/ਸਗੋਂ ਤੋਂ ਕੇਵਲ/, "broken comparison wording"],
];

let samples = 0;
for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      for (const locale of locales) {
        const item = generateAlgPermanentMultilingualReviewV2(allocation.qlId, seed, locale, variantIndex);
        const surface = `${item.question}\n${item.explanation}`;
        const patterns = locale === "hi-IN" ? hindiAntiPatterns : punjabiAntiPatterns;
        const prefix = `${allocation.qlId}/${item.prototypeId}/${locale}/seed-${seed}`;
        for (const [pattern, label] of patterns) {
          assert(!pattern.test(surface), `${prefix}: ${label}: ${pattern} :: ${surface.slice(0, 420)}`);
        }
        samples += 1;
      }
    }
  }
}

assert(samples === 2616, `Expected 2,616 multilingual editorial samples, found ${samples}`);
console.log(`Algebra multilingual V2 human editorial audit passed: ${samples} samples, known machine-grammar anti-patterns absent`);
