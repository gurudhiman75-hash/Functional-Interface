import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

/**
 * Whole-template localization for finalized CP010-CP012 learner surfaces.
 * Mathematical captures are emitted in their original order and unchanged.
 */
export function localizeSriC010C012FinalizedSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  let match: RegExpMatchArray | null;

  if (text === "Both I and II") return locale === "hi-IN" ? "I और II दोनों" : "I ਅਤੇ II ਦੋਵੇਂ";
  if (text === "Only I") return locale === "hi-IN" ? "केवल I" : "ਕੇਵਲ I";
  if (text === "Only II") return locale === "hi-IN" ? "केवल II" : "ਕੇਵਲ II";
  if (text === "Neither I nor II") return locale === "hi-IN" ? "न I, न II" : "ਨਾ I, ਨਾ II";

  match = text.match(/^Write (.+) as a (?:sum|difference) of two simple square roots\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} को दो सरल वर्गमूलों के रूप में लिखिए।`
    : `${match[1]} ਨੂੰ ਦੋ ਸਰਲ ਵਰਗਮੂਲਾਂ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Find the exact denested form of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सटीक सरल करणी रूप ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਟੀਕ ਸਰਲ ਕਰਣੀ ਰੂਪ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Can (.+) be written as (.+) for non-negative integers m,n\?$/u);
  if (match) return locale === "hi-IN"
    ? `क्या ${match[1]} को ${match[2]} के रूप में लिखा जा सकता है, जहाँ m,n गैर-ऋणात्मक पूर्णांक हैं?`
    : `ਕੀ ${match[1]} ਨੂੰ ${match[2]} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ, ਜਿੱਥੇ m,n ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਅੰਕ ਹਨ?`;

  match = text.match(/^Decide whether (.+) is denestable into two integer-radicand square roots\.$/u);
  if (match) return locale === "hi-IN"
    ? `निर्धारित कीजिए कि ${match[1]} को पूर्णांक करणीगत संख्याओं वाले दो वर्गमूलों में सरल किया जा सकता है या नहीं।`
    : `ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ${match[1]} ਨੂੰ ਪੂਰਨ ਅੰਕ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਵਾਲੇ ਦੋ ਵਰਗਮੂਲਾਂ ਵਿੱਚ ਸਰਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।`;

  match = text.match(/^Is (.+) denestable in the form (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `क्या ${match[1]} को ${match[2]} के रूप में सरल किया जा सकता है?` : `ਕੀ ${match[1]} ਨੂੰ ${match[2]} ਦੇ ਰੂਪ ਵਿੱਚ ਸਰਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?`;

  match = text.match(/^Classify (.+) as denestable or not denestable over integer radicands\.$/u);
  if (match) return locale === "hi-IN"
    ? `पूर्णांक करणीगत संख्याओं के लिए निर्धारित कीजिए कि ${match[1]} सरल करणी रूप में बदला जा सकता है या नहीं।`
    : `ਪੂਰਨ ਅੰਕ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਲਈ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ${match[1]} ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਬਦਲਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।`;

  if (text === "For integer-radicand denesting, A²−4B must be a non-negative perfect square and yield integer m,n.") {
    return locale === "hi-IN"
      ? "पूर्णांक करणीगत संख्याओं में सरल करने के लिए A²−4B गैर-ऋणात्मक पूर्ण वर्ग होना चाहिए और m,n पूर्णांक मिलने चाहिए।"
      : "ਪੂਰਨ ਅੰਕ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਸਰਲ ਕਰਨ ਲਈ A²−4B ਗੈਰ-ਰਿਣਾਤਮਕ ਪੂਰਨ ਵਰਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਅਤੇ m,n ਪੂਰਨ ਅੰਕ ਮਿਲਣੇ ਚਾਹੀਦੇ ਹਨ।";
  }
  if (text === "The exact denesting test succeeds.") return locale === "hi-IN" ? "सटीक सरलीकरण जाँच सफल है।" : "ਸਟੀਕ ਸਰਲੀਕਰਨ ਜਾਂਚ ਸਫਲ ਹੈ।";
  if (text === "The exact denesting test fails.") return locale === "hi-IN" ? "सटीक सरलीकरण जाँच असफल है।" : "ਸਟੀਕ ਸਰਲੀਕਰਨ ਜਾਂਚ ਅਸਫਲ ਹੈ।";
  if (text === "Decide whether the nested surd has the supported denested form.") return locale === "hi-IN" ? "निर्धारित कीजिए कि संयुक्त करणी का समर्थित सरल रूप है या नहीं।" : "ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਸੰਯੁਕਤ ਕਰਣੀ ਦਾ ਸਮਰਥਿਤ ਸਰਲ ਰੂਪ ਹੈ ਜਾਂ ਨਹੀਂ।";

  match = text.match(/^Squaring (.+) gives (.+)\. Determine A and B\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का वर्ग करने पर ${match[2]} मिलता है। A और B ज्ञात कीजिए।` : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੇ ${match[2]} ਮਿਲਦਾ ਹੈ। A ਅਤੇ B ਪਤਾ ਕਰੋ।`;

  match = text.match(/^For (.+), recover the nested-surd parameters \(A,B\) after squaring\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का वर्ग करने के बाद संयुक्त करणी के पैरामीटर (A,B) ज्ञात कीजिए।` : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੋਂ ਬਾਅਦ ਸੰਯੁਕਤ ਕਰਣੀ ਦੇ ਪੈਰਾਮੀਟਰ (A,B) ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Find \(A,B\) such that (.+)=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `(A,B) ज्ञात कीजिए ताकि ${match[1]}=${match[2]}।` : `(A,B) ਪਤਾ ਕਰੋ ਤਾਂ ਜੋ ${match[1]}=${match[2]}।`;

  if (text === "Square the two-term surd: the rational part is m+n and the cross-term contains √(mn).") return locale === "hi-IN" ? "दो पदों वाली करणी का वर्ग कीजिए: परिमेय भाग m+n है और मिश्र पद में √(mn) आता है।" : "ਦੋ ਪਦਾਂ ਵਾਲੀ ਕਰਣੀ ਦਾ ਵਰਗ ਕਰੋ: ਪਰਿਮੇਯ ਭਾਗ m+n ਹੈ ਅਤੇ ਮਿਸ਼ਰਤ ਪਦ ਵਿੱਚ √(mn) ਆਉਂਦਾ ਹੈ।";
  if (text === "Recover the two nested-surd parameters.") return locale === "hi-IN" ? "संयुक्त करणी के दोनों पैरामीटर ज्ञात कीजिए।" : "ਸੰਯੁਕਤ ਕਰਣੀ ਦੇ ਦੋਵੇਂ ਪੈਰਾਮੀਟਰ ਪਤਾ ਕਰੋ।";

  match = text.match(/^The denested form of (.+) is (.+)\. Determine x\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरल रूप ${match[2]} है। x ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਰਲ ਰੂਪ ${match[2]} ਹੈ। x ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Find the missing radicand x in (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} में अनुपस्थित करणीगत संख्या x ज्ञात कीजिए।` : `${match[1]} ਵਿੱਚ ਗੁੰਮ ਕਰਣੀਗਤ ਸੰਖਿਆ x ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Recover x when (.+) denests (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `जब ${match[1]}, ${match[2]} का सरल रूप है, तब x ज्ञात कीजिए।` : `ਜਦੋਂ ${match[1]}, ${match[2]} ਦਾ ਸਰਲ ਰੂਪ ਹੈ, ਤਦ x ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Known radicand = (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `ज्ञात करणीगत संख्या = ${match[1]}।` : `ਜਾਣੀ ਕਰਣੀਗਤ ਸੰਖਿਆ = ${match[1]}।`;
  match = text.match(/^Check: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `जाँच: ${match[1]}।` : `ਜਾਂਚ: ${match[1]}।`;
  if (text === "Recover the missing denested radicand.") return locale === "hi-IN" ? "सरल रूप की अनुपस्थित करणीगत संख्या ज्ञात कीजिए।" : "ਸਰਲ ਰੂਪ ਦੀ ਗੁੰਮ ਕਰਣੀਗਤ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।";

  match = text.match(/^Evaluate the positive infinite radical (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `धनात्मक अनंत आवर्ती करणी ${match[1]} का मान ज्ञात कीजिए।` : `ਧਨਾਤਮਕ ਅਨੰਤ ਆਵਰਤੀ ਕਰਣੀ ${match[1]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Let x denote (.+)\. Find the positive fixed point x\.$/u);
  if (match) return locale === "hi-IN" ? `x से ${match[1]} को दर्शाइए। धनात्मक स्थिर-बिंदु x ज्ञात कीजिए।` : `x ਨਾਲ ${match[1]} ਨੂੰ ਦਰਸਾਓ। ਧਨਾਤਮਕ ਸਥਿਰ-ਬਿੰਦੂ x ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Find the positive value of the repeating radical x=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `आवर्ती करणी x=${match[1]} का धनात्मक मान ज्ञात कीजिए।` : `ਆਵਰਤੀ ਕਰਣੀ x=${match[1]} ਦਾ ਧਨਾਤਮਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  if (text === "The repeating tail is again x, so square x=√(k+x) and keep the positive fixed point.") return locale === "hi-IN" ? "आवर्ती शेष भाग फिर x ही है, इसलिए x=√(k+x) का वर्ग कीजिए और धनात्मक स्थिर-बिंदु रखिए।" : "ਆਵਰਤੀ ਬਾਕੀ ਭਾਗ ਫਿਰ x ਹੀ ਹੈ, ਇਸ ਲਈ x=√(k+x) ਦਾ ਵਰਗ ਕਰੋ ਅਤੇ ਧਨਾਤਮਕ ਸਥਿਰ-ਬਿੰਦੂ ਰੱਖੋ।";
  match = text.match(/^The positive root is x=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `धनात्मक मूल x=${match[1]} है।` : `ਧਨਾਤਮਕ ਮੂਲ x=${match[1]} ਹੈ।`;
  if (text === "Evaluate the positive repeating radical fixed point.") return locale === "hi-IN" ? "धनात्मक आवर्ती करणी का स्थिर-बिंदु मान ज्ञात कीजिए।" : "ਧਨਾਤਮਕ ਆਵਰਤੀ ਕਰਣੀ ਦਾ ਸਥਿਰ-ਬਿੰਦੂ ਮੁੱਲ ਪਤਾ ਕਰੋ।";

  match = text.match(/^Without decimal approximation, compare (.+) with (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दशमलव सन्निकटन के बिना ${match[1]} और ${match[2]} की तुलना कीजिए।` : `ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਤੋਂ ਬਿਨਾਂ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  match = text.match(/^Compare the positive surds (.+) and (.+) by exact arithmetic\.$/u);
  if (match) return locale === "hi-IN" ? `धनात्मक करणियों ${match[1]} और ${match[2]} की सटीक गणना से तुलना कीजिए।` : `ਧਨਾਤਮਕ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਸਟੀਕ ਗਣਨਾ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।`;
  match = text.match(/^Without decimals, determine the order of (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दशमलव के बिना ${match[1]} और ${match[2]} का क्रम निर्धारित कीजिए।` : `ਦਸ਼ਮਲਵ ਤੋਂ ਬਿਨਾਂ ${match[1]} ਅਤੇ ${match[2]} ਦਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਕਰੋ।`;
  match = text.match(/^Use a common exact power to compare (.+) with (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `समान सटीक घात का उपयोग करके ${match[1]} और ${match[2]} की तुलना कीजिए।` : `ਸਾਂਝੀ ਸਟੀਕ ਘਾਤ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  match = text.match(/^Determine the exact order of the different-index radicals (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `भिन्न मूल-घातांक वाली करणियों ${match[1]} और ${match[2]} का सटीक क्रम निर्धारित कीजिए।` : `ਵੱਖਰੇ ਮੂਲ-ਘਾਤਾਂਕ ਵਾਲੀਆਂ ਕਰਣੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਦਾ ਸਟੀਕ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਕਰੋ।`;
  if (text === "Both radicals are positive, so compare their squares exactly.") return locale === "hi-IN" ? "दोनों करणियाँ धनात्मक हैं, इसलिए उनके वर्गों की सटीक तुलना कीजिए।" : "ਦੋਵੇਂ ਕਰਣੀਆਂ ਧਨਾਤਮਕ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਵਰਗਾਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।";
  if (text === "Because both quantities are positive, square them and compare the resulting integers.") return locale === "hi-IN" ? "दोनों राशियाँ धनात्मक हैं, इसलिए उनका वर्ग करके प्राप्त पूर्णांकों की तुलना कीजिए।" : "ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਧਨਾਤਮਕ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦਾ ਵਰਗ ਕਰਕੇ ਮਿਲੇ ਪੂਰਨ ਅੰਕਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।";
  match = text.match(/^Raise both positive radicals to the common power (.+); this preserves their order\.$/u);
  if (match) return locale === "hi-IN" ? `दोनों धनात्मक करणियों को समान घात ${match[1]} तक उठाइए; इससे उनका क्रम बना रहता है।` : `ਦੋਵੇਂ ਧਨਾਤਮਕ ਕਰਣੀਆਂ ਨੂੰ ਸਾਂਝੀ ਘਾਤ ${match[1]} ਤੱਕ ਚੁੱਕੋ; ਇਸ ਨਾਲ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਰਕਰਾਰ ਰਹਿੰਦਾ ਹੈ।`;
  if (text === "Compare n with the consecutive perfect squares around it.") return locale === "hi-IN" ? "n की तुलना उसके आस-पास के क्रमागत पूर्ण वर्गों से कीजिए।" : "n ਦੀ ਤੁਲਨਾ ਨੇੜਲੇ ਲਗਾਤਾਰ ਪੂਰਨ ਵਰਗਾਂ ਨਾਲ ਕਰੋ।";

  match = text.match(/^Between which consecutive integers does (.+) lie\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} किन दो क्रमागत पूर्णांकों के बीच है?` : `${match[1]} ਕਿਹੜੇ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ?`;
  match = text.match(/^Locate (.+) between two consecutive integers\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को दो क्रमागत पूर्णांकों के बीच स्थित कीजिए।` : `${match[1]} ਨੂੰ ਦੋ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਸਥਿਤ ਕਰੋ।`;
  match = text.match(/^Choose the exact consecutive-integer interval containing (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} वाला सटीक क्रमागत-पूर्णांक अंतराल चुनिए।` : `${match[1]} ਵਾਲਾ ਸਟੀਕ ਲਗਾਤਾਰ-ਪੂਰਨ-ਅੰਕ ਅੰਤਰਾਲ ਚੁਣੋ।`;
  match = text.match(/^Without decimals, bound (.+) by consecutive integers\.$/u);
  if (match) return locale === "hi-IN" ? `दशमलव के बिना ${match[1]} को क्रमागत पूर्णांकों से सीमाबद्ध कीजिए।` : `ਦਸ਼ਮਲਵ ਤੋਂ ਬਿਨਾਂ ${match[1]} ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਸੀਮਿਤ ਕਰੋ।`;
  match = text.match(/^Which exact integer bound contains (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} किस सटीक पूर्णांक सीमा में आता है?` : `${match[1]} ਕਿਹੜੀ ਸਟੀਕ ਪੂਰਨ ਅੰਕ ਸੀਮਾ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`;
  match = text.match(/^Choose the true range statement for (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के लिए सही परास कथन चुनिए।` : `${match[1]} ਲਈ ਸਹੀ ਪਰਾਸ ਕਥਨ ਚੁਣੋ।`;
  match = text.match(/^Bound the irrational quantity (.+) exactly by consecutive integers\.$/u);
  if (match) return locale === "hi-IN" ? `अपरिमेय राशि ${match[1]} को क्रमागत पूर्णांकों से सटीक रूप से सीमाबद्ध कीजिए।` : `ਅਪਰਿਮੇਯ ਰਾਸ਼ੀ ${match[1]} ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਸਟੀਕ ਤੌਰ ਤੇ ਸੀਮਿਤ ਕਰੋ।`;
  if (text === "Locate the square root between consecutive integers.") return locale === "hi-IN" ? "वर्गमूल को क्रमागत पूर्णांकों के बीच स्थित कीजिए।" : "ਵਰਗਮੂਲ ਨੂੰ ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਵਿਚਕਾਰ ਸਥਿਤ ਕਰੋ।";
  if (text === "Choose the exact range statement.") return locale === "hi-IN" ? "सटीक परास कथन चुनिए।" : "ਸਟੀਕ ਪਰਾਸ ਕਥਨ ਚੁਣੋ।";

  match = text.match(/^If x=(.+), find (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `यदि x=${match[1]}, तो ${match[2]} ज्ञात कीजिए।` : `ਜੇ x=${match[1]}, ਤਾਂ ${match[2]} ਪਤਾ ਕਰੋ।`;
  match = text.match(/^For x=(.+), evaluate (.+) exactly\.$/u);
  if (match) return locale === "hi-IN" ? `x=${match[1]} के लिए ${match[2]} का सटीक मान ज्ञात कीजिए।` : `x=${match[1]} ਲਈ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Use the conjugate of x=(.+) to find (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `x=${match[1]} के संयुग्मी का उपयोग करके ${match[2]} ज्ञात कीजिए।` : `x=${match[1]} ਦੇ ਸੰਯੁਗਮੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[2]} ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Without decimal approximation, determine (.+) when x=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का मान दशमलव सन्निकटन के बिना ज्ञात कीजिए, जब x=${match[2]}।` : `${match[1]} ਦਾ ਮੁੱਲ ਦਸ਼ਮਲਵ ਅਨੁਮਾਨ ਤੋਂ ਬਿਨਾਂ ਪਤਾ ਕਰੋ, ਜਦੋਂ x=${match[2]}।`;
  if (text === "Since (a+√b)(a−√b)=1, the conjugate is 1/x. First find x+1/x, then square it.") return locale === "hi-IN" ? "क्योंकि (a+√b)(a−√b)=1, इसलिए संयुग्मी 1/x है। पहले x+1/x ज्ञात कीजिए, फिर उसका वर्ग कीजिए।" : "ਕਿਉਂਕਿ (a+√b)(a−√b)=1, ਇਸ ਲਈ ਸੰਯੁਗਮੀ 1/x ਹੈ। ਪਹਿਲਾਂ x+1/x ਪਤਾ ਕਰੋ, ਫਿਰ ਇਸ ਦਾ ਵਰਗ ਕਰੋ।";
  if (text === "Evaluate the transformed reciprocal-conjugate target.") return locale === "hi-IN" ? "रूपांतरित व्युत्क्रम-संयुग्मी लक्ष्य का मान ज्ञात कीजिए।" : "ਰੂਪਾਂਤਰਿਤ ਵਿਉਤਕ੍ਰਮ-ਸੰਯੁਗਮੀ ਲਕਸ਼ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।";

  match = text.match(/^Solve (.+) for (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को ${match[2]} के लिए हल कीजिए।` : `${match[1]} ਨੂੰ ${match[2]} ਲਈ ਹੱਲ ਕਰੋ।`;
  match = text.match(/^Within (.+), find x if (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के भीतर, यदि ${match[2]}, तो x ज्ञात कीजिए।` : `${match[1]} ਦੇ ਅੰਦਰ, ਜੇ ${match[2]}, ਤਾਂ x ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Find the bounded real solution of (.+), where (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सीमाबद्ध वास्तविक हल ज्ञात कीजिए, जहाँ ${match[2]}।` : `${match[1]} ਦਾ ਸੀਮਿਤ ਵਾਸਤਵਿਕ ਹੱਲ ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${match[2]}।`;
  match = text.match(/^Determine x in (.+) satisfying (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} में ${match[2]} को संतुष्ट करने वाला x ज्ञात कीजिए।` : `${match[1]} ਵਿੱਚ ${match[2]} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ x ਪਤਾ ਕਰੋ।`;
  if (text === "Square the non-negative equation, solve the linear result, then substitute the candidate into the original radical equation.") return locale === "hi-IN" ? "गैर-ऋणात्मक समीकरण का वर्ग कीजिए, प्राप्त रैखिक समीकरण हल कीजिए, फिर मान को मूल करणी समीकरण में रखकर जाँचिए।" : "ਗੈਰ-ਰਿਣਾਤਮਕ ਸਮੀਕਰਨ ਦਾ ਵਰਗ ਕਰੋ, ਮਿਲਿਆ ਰੇਖੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ, ਫਿਰ ਮੁੱਲ ਨੂੰ ਮੂਲ ਕਰਣੀ ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖ ਕੇ ਜਾਂਚੋ।";
  match = text.match(/^Original-equation check: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `मूल समीकरण की जाँच: ${match[1]}।` : `ਮੂਲ ਸਮੀਕਰਨ ਦੀ ਜਾਂਚ: ${match[1]}।`;
  if (text === "Solve the bounded radical equation and verify the original domain.") return locale === "hi-IN" ? "सीमाबद्ध करणी समीकरण हल कीजिए और मूल क्षेत्र की जाँच कीजिए।" : "ਸੀਮਿਤ ਕਰਣੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ ਅਤੇ ਮੂਲ ਖੇਤਰ ਦੀ ਜਾਂਚ ਕਰੋ।";

  match = text.match(/^Squaring (.+) gives candidates (.+) and (.+)\. Which candidate is extraneous\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का वर्ग करने पर मान ${match[2]} और ${match[3]} मिलते हैं। कौन-सा मान बाह्य है?` : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੇ ਮੁੱਲ ${match[2]} ਅਤੇ ${match[3]} ਮਿਲਦੇ ਹਨ। ਕਿਹੜਾ ਮੁੱਲ ਬਾਹਰੀ ਹੈ?`;
  match = text.match(/^For (.+), the squared equation yields (.+) and (.+)\. Which value must be rejected\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के वर्ग किए समीकरण से ${match[2]} और ${match[3]} मिलते हैं। कौन-सा मान अस्वीकार करना है?` : `${match[1]} ਦੇ ਵਰਗ ਕੀਤੇ ਸਮੀਕਰਨ ਤੋਂ ${match[2]} ਅਤੇ ${match[3]} ਮਿਲਦੇ ਹਨ। ਕਿਹੜਾ ਮੁੱਲ ਰੱਦ ਕਰਨਾ ਹੈ?`;
  match = text.match(/^After squaring (.+), candidates (.+), (.+) appear\. Identify the extraneous root\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का वर्ग करने के बाद ${match[2]}, ${match[3]} मिलते हैं। बाह्य मूल पहचानिए।` : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੋਂ ਬਾਅਦ ${match[2]}, ${match[3]} ਮਿਲਦੇ ਹਨ। ਬਾਹਰੀ ਮੂਲ ਪਛਾਣੋ।`;
  match = text.match(/^Which candidate fails the original equation (.+): (.+) or (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `मूल समीकरण ${match[1]} में ${match[2]} और ${match[3]} में कौन-सा मान असफल है?` : `ਮੂਲ ਸਮੀਕਰਨ ${match[1]} ਵਿੱਚ ${match[2]} ਅਤੇ ${match[3]} ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੁੱਲ ਅਸਫਲ ਹੈ?`;
  if (text === "A squared equation can admit a candidate with negative original right-hand side. Substitute both candidates into the unsquared equation.") return locale === "hi-IN" ? "वर्ग किया समीकरण ऐसा मान दे सकता है जिसके लिए मूल दायाँ पक्ष ऋणात्मक हो। दोनों मानों को बिना वर्ग वाले मूल समीकरण में रखकर जाँचिए।" : "ਵਰਗ ਕੀਤਾ ਸਮੀਕਰਨ ਐਸਾ ਮੁੱਲ ਦੇ ਸਕਦਾ ਹੈ ਜਿਸ ਲਈ ਮੂਲ ਸੱਜਾ ਪਾਸਾ ਰਿਣਾਤਮਕ ਹੋਵੇ। ਦੋਵੇਂ ਮੁੱਲਾਂ ਨੂੰ ਬਿਨਾਂ ਵਰਗ ਵਾਲੇ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖ ਕੇ ਜਾਂਚੋ।";
  match = text.match(/^For x=(.+): (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `x=${match[1]} के लिए: ${match[2]}।` : `x=${match[1]} ਲਈ: ${match[2]}।`;
  match = text.match(/^Reject x=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `x=${match[1]} को अस्वीकार कीजिए।` : `x=${match[1]} ਨੂੰ ਰੱਦ ਕਰੋ।`;
  if (text === "Identify the candidate introduced by squaring that fails the original equation.") return locale === "hi-IN" ? "वर्ग करने से आया वह मान पहचानिए जो मूल समीकरण में असफल है।" : "ਵਰਗ ਕਰਨ ਨਾਲ ਆਇਆ ਉਹ ਮੁੱਲ ਪਛਾਣੋ ਜੋ ਮੂਲ ਸਮੀਕਰਨ ਵਿੱਚ ਅਸਫਲ ਹੈ।";

  match = text.match(/^For (.+), consider the statements: (.+) Which are true\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के लिए कथनों पर विचार कीजिए: ${match[2]} कौन-से सत्य हैं?` : `${match[1]} ਲਈ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: ${match[2]} ਕਿਹੜੇ ਸੱਚ ਹਨ?`;
  match = text.match(/^Which statement set is correct for (.+)\? (.+)$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के लिए कौन-सा कथन-समूह सही है? ${match[2]}` : `${match[1]} ਲਈ ਕਿਹੜਾ ਕਥਨ-ਸਮੂਹ ਸਹੀ ਹੈ? ${match[2]}`;
  match = text.match(/^Evaluate the two exact bound statements about (.+): (.+)$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के बारे में दोनों सटीक सीमा-कथनों की सत्यता जाँचिए: ${match[2]}` : `${match[1]} ਬਾਰੇ ਦੋਵੇਂ ਸਟੀਕ ਸੀਮਾ-ਕਥਨਾਂ ਦੀ ਸੱਚਾਈ ਜਾਂਚੋ: ${match[2]}`;
  match = text.match(/^Without decimals, decide the truth of: (.+)$/u);
  if (match) return locale === "hi-IN" ? `दशमलव के बिना इनकी सत्यता निर्धारित कीजिए: ${match[1]}` : `ਦਸ਼ਮਲਵ ਤੋਂ ਬਿਨਾਂ ਇਨ੍ਹਾਂ ਦੀ ਸੱਚਾਈ ਨਿਰਧਾਰਤ ਕਰੋ: ${match[1]}`;
  match = text.match(/^Hence (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `अतः ${match[1]}।` : `ਇਸ ਲਈ ${match[1]}।`;
  match = text.match(/^Truth set: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सत्य कथन: ${match[1]}।` : `ਸੱਚ ਕਥਨ: ${match[1]}।`;
  if (text === "Determine which bound statements are true.") return locale === "hi-IN" ? "निर्धारित कीजिए कि कौन-से सीमा-कथन सत्य हैं।" : "ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਕਿਹੜੇ ਸੀਮਾ-ਕਥਨ ਸੱਚ ਹਨ।";

  match = text.match(/^Simplify (.+) by interpreting the root as a rational exponent\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को मूल को परिमेय घातांक मानकर सरल कीजिए।` : `${match[1]} ਨੂੰ ਮੂਲ ਨੂੰ ਪਰਿਮੇਯ ਘਾਤਾਂਕ ਮੰਨ ਕੇ ਸਰਲ ਕਰੋ।`;
  match = text.match(/^Use fractional indices to reduce (.+) to simplest radical form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को भिन्नात्मक घातांकों से सरलतम करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕਾਂ ਨਾਲ ਸਭ ਤੋਂ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;
  match = text.match(/^Convert (.+) to exponent notation, simplify the powers, then return to radical form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को घातांक रूप में बदलिए, घातों को सरल कीजिए, फिर करणी रूप में लौटाइए।` : `${match[1]} ਨੂੰ ਘਾਤਾਂਕ ਰੂਪ ਵਿੱਚ ਬਦਲੋ, ਘਾਤਾਂ ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਵਾਪਸ ਲਿਖੋ।`;
  match = text.match(/^Find the exact simplified form of (.+) using rational exponents\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का परिमेय घातांकों से सटीक सरल रूप ज्ञात कीजिए।` : `${match[1]} ਦਾ ਪਰਿਮੇਯ ਘਾਤਾਂਕਾਂ ਨਾਲ ਸਟੀਕ ਸਰਲ ਰੂਪ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^The perfect (.+)th-power part contributes (.+) outside the radical\.$/u);
  if (match) return locale === "hi-IN" ? `पूर्ण ${match[1]}वीं-घात वाला भाग करणी के बाहर ${match[2]} देता है।` : `ਪੂਰਨ ${match[1]}ਵੀਂ-ਘਾਤ ਵਾਲਾ ਭਾਗ ਕਰਣੀ ਤੋਂ ਬਾਹਰ ${match[2]} ਦਿੰਦਾ ਹੈ।`;
  if (text === "Simplify the radical using rational-exponent structure.") return locale === "hi-IN" ? "परिमेय-घातांक संरचना का उपयोग करके करणी को सरल कीजिए।" : "ਪਰਿਮੇਯ-ਘਾਤਾਂਕ ਬਣਤਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕਰਣੀ ਨੂੰ ਸਰਲ ਕਰੋ।";

  match = text.match(/^Evaluate (.+) by converting it to (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को ${match[2]} में बदलकर मान ज्ञात कीजिए।` : `${match[1]} ਨੂੰ ${match[2]} ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Rewrite (.+) as a radical and simplify exactly\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को करणी रूप में लिखकर सटीक रूप से सरल कीजिए।` : `${match[1]} ਨੂੰ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖ ਕੇ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।`;
  match = text.match(/^Use radical form to find the exact value of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का करणी रूप से सटीक मान ज्ञात कीजिए।` : `${match[1]} ਦਾ ਕਰਣੀ ਰੂਪ ਨਾਲ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Convert the fractional index (.+) to a root before evaluating it\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} भिन्नात्मक घातांक को मान निकालने से पहले मूल रूप में बदलिए।` : `${match[1]} ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਨੂੰ ਮੁੱਲ ਕੱਢਣ ਤੋਂ ਪਹਿਲਾਂ ਮੂਲ ਰੂਪ ਵਿੱਚ ਬਦਲੋ।`;
  if (text === "Interpret p/q as taking the qth root and then the pth power; the visible base was reverse-constructed as a perfect qth power.") return locale === "hi-IN" ? "p/q का अर्थ पहले qवाँ मूल और फिर pवीं घात लेना है; दिया आधार पूर्ण qवीं घात के रूप में बनाया गया है।" : "p/q ਦਾ ਅਰਥ ਪਹਿਲਾਂ qਵਾਂ ਮੂਲ ਅਤੇ ਫਿਰ pਵੀਂ ਘਾਤ ਲੈਣਾ ਹੈ; ਦਿੱਤਾ ਅਧਾਰ ਪੂਰਨ qਵੀਂ ਘਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਬਣਾਇਆ ਗਿਆ ਹੈ।";

  match = text.match(/^Are (.+) and (.+) equal, or is one greater\?$/u);
  if (match) return locale === "hi-IN" ? `क्या ${match[1]} और ${match[2]} बराबर हैं, या कोई एक बड़ा है?` : `ਕੀ ${match[1]} ਅਤੇ ${match[2]} ਬਰਾਬਰ ਹਨ, ਜਾਂ ਕੋਈ ਇੱਕ ਵੱਡਾ ਹੈ?`;
  match = text.match(/^Using exact radical-index equivalence, compare (.+) with (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सटीक करणी-घातांक समतुल्यता से ${match[1]} और ${match[2]} की तुलना कीजिए।` : `ਸਟੀਕ ਕਰਣੀ-ਘਾਤਾਂਕ ਸਮਤੁਲਤਾ ਨਾਲ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  match = text.match(/^Determine the relation between (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और ${match[2]} के बीच संबंध निर्धारित कीजिए।` : `${match[1]} ਅਤੇ ${match[2]} ਵਿਚਕਾਰ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਕਰੋ।`;
  if (text === "Both expressions have the same exact rational exponent.") return locale === "hi-IN" ? "दोनों व्यंजकों का सटीक परिमेय घातांक समान है।" : "ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦਾ ਸਟੀਕ ਪਰਿਮੇਯ ਘਾਤਾਂਕ ਇੱਕੋ ਹੈ।";
  if (text === "Compare the radical and fractional-index representations exactly.") return locale === "hi-IN" ? "करणी और भिन्नात्मक-घातांक रूपों की सटीक तुलना कीजिए।" : "ਕਰਣੀ ਅਤੇ ਭਿੰਨਾਤਮਕ-ਘਾਤਾਂਕ ਰੂਪਾਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।";

  match = text.match(/^Convert the radical to an index and solve (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को करणी से घातांक रूप में बदलकर हल कीजिए।` : `${match[1]} ਨੂੰ ਕਰਣੀ ਤੋਂ ਘਾਤਾਂਕ ਰੂਪ ਵਿੱਚ ਬਦਲ ਕੇ ਹੱਲ ਕਰੋ।`;
  match = text.match(/^Determine x from the mixed radical-index equation (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `मिश्रित करणी-घातांक समीकरण ${match[1]} से x ज्ञात कीजिए।` : `ਮਿਸ਼ਰਤ ਕਰਣੀ-ਘਾਤਾਂਕ ਸਮੀਕਰਨ ${match[1]} ਤੋਂ x ਪਤਾ ਕਰੋ।`;
  if (text === "Replace the square root by exponent 1/2, express the integer target as a power of the same base, then equate exponents.") return locale === "hi-IN" ? "वर्गमूल को 1/2 घात से बदलिए, पूर्णांक लक्ष्य को उसी आधार की घात में लिखिए, फिर घातांक बराबर कीजिए।" : "ਵਰਗਮੂਲ ਨੂੰ 1/2 ਘਾਤ ਨਾਲ ਬਦਲੋ, ਪੂਰਨ ਅੰਕ ਲਕਸ਼ ਨੂੰ ਉਸੇ ਅਧਾਰ ਦੀ ਘਾਤ ਵਿੱਚ ਲਿਖੋ, ਫਿਰ ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰੋ।";
  if (text === "Solve the equation using both radical and index structure.") return locale === "hi-IN" ? "करणी और घातांक दोनों संरचनाओं का उपयोग करके समीकरण हल कीजिए।" : "ਕਰਣੀ ਅਤੇ ਘਾਤਾਂਕ ਦੋਵੇਂ ਬਣਤਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।";

  match = text.match(/^First simplify the surd, then find (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `पहले करणी को सरल कीजिए, फिर ${match[1]} ज्ञात कीजिए।` : `ਪਹਿਲਾਂ ਕਰਣੀ ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ${match[1]} ਪਤਾ ਕਰੋ।`;
  match = text.match(/^Use surd simplification and a negative index to evaluate (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `करणी सरलीकरण और ऋणात्मक घातांक का उपयोग करके ${match[1]} का मान ज्ञात कीजिए।` : `ਕਰਣੀ ਸਰਲੀਕਰਨ ਅਤੇ ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  if (text === "Simplify √(m²r)=m√r, then apply the negative exponent and cancel the remaining factor r.") return locale === "hi-IN" ? "√(m²r)=m√r को सरल कीजिए, फिर ऋणात्मक घातांक लगाकर बचा गुणनखंड r काटिए।" : "√(m²r)=m√r ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਗਾ ਕੇ ਬਚਿਆ ਗੁਣਨਖੰਡ r ਕੱਟੋ।";
  if (text === "Evaluate the transformed target using one surd step and one index step.") return locale === "hi-IN" ? "एक करणी चरण और एक घातांक चरण से रूपांतरित लक्ष्य का मान ज्ञात कीजिए।" : "ਇੱਕ ਕਰਣੀ ਪੜਾਅ ਅਤੇ ਇੱਕ ਘਾਤਾਂਕ ਪੜਾਅ ਨਾਲ ਰੂਪਾਂਤਰਿਤ ਲਕਸ਼ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।";

  return undefined;
}
