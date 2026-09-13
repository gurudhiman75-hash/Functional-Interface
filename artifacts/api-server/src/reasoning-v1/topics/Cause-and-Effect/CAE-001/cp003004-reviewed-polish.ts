import { generateCaeCombinationQuestion } from "./cp003004-combination.ts";
import type { CaeLocale, GeneratedCaeQuestion } from "./types.ts";

type SurfaceRewrite = Readonly<{
  replacements: Readonly<Record<CaeLocale, readonly (readonly [string, string])[]>>;
  rationale: Readonly<Record<CaeLocale, string>>;
}>;

const REWRITES: Readonly<Record<string, SurfaceRewrite>> = {
  "late-deliveries-second-cause": {
    replacements: {
      "en-IN": [["The company changed the colour of its delivery uniforms.", "A small number of delivery vans were sent for routine servicing during the evening shift."]],
      "hi-IN": [["कंपनी ने डिलीवरी कर्मचारियों की वर्दी का रंग बदला।", "कुछ डिलीवरी वैन शाम की पाली में नियमित सर्विसिंग के लिए भेजी गईं।"]],
      "pa-IN": [["ਕੰਪਨੀ ਨੇ ਡਿਲੀਵਰੀ ਕਰਮਚਾਰੀਆਂ ਦੀ ਵਰਦੀ ਦਾ ਰੰਗ ਬਦਲਿਆ।", "ਕੁਝ ਡਿਲੀਵਰੀ ਵੈਨਾਂ ਸ਼ਾਮ ਦੀ ਸ਼ਿਫਟ ਵਿੱਚ ਨਿਯਮਿਤ ਸਰਵਿਸਿੰਗ ਲਈ ਭੇਜੀਆਂ ਗਈਆਂ।"]],
    },
    rationale: {
      "en-IN": "Servicing a small number of vans is too limited in scope to explain widespread next-day deliveries; a route-planning outage can delay dispatch across many routes.",
      "hi-IN": "कुछ वैन की नियमित सर्विसिंग इतने बड़े स्तर की अगले दिन वाली देरी नहीं समझाती; रूट-प्लानिंग सिस्टम की खराबी कई मार्गों की रवानगी में देरी कर सकती है।",
      "pa-IN": "ਕੁਝ ਵੈਨਾਂ ਦੀ ਨਿਯਮਿਤ ਸਰਵਿਸਿੰਗ ਵੱਡੇ ਪੱਧਰ ਦੀ ਅਗਲੇ ਦਿਨ ਵਾਲੀ ਦੇਰੀ ਨਹੀਂ ਸਮਝਾਉਂਦੀ; ਰੂਟ-ਪਲੈਨਿੰਗ ਸਿਸਟਮ ਦੀ ਖਰਾਬੀ ਕਈ ਰਸਤਿਆਂ ਦੀ ਰਵਾਨਗੀ ਦੇਰ ਨਾਲ ਕਰ ਸਕਦੀ ਹੈ।",
    },
  },
  "library-visits-neither-cause": {
    replacements: {
      "en-IN": [
        ["The college repainted the staff parking area.", "The library rearranged shelves in one reading room."],
        ["The sports department changed the colour of team jerseys.", "One department shifted a morning tutorial by thirty minutes."],
      ],
      "hi-IN": [
        ["कॉलेज ने स्टाफ पार्किंग क्षेत्र को दोबारा रंगा।", "पुस्तकालय ने एक पठन-कक्ष में पुस्तकों की अलमारियाँ फिर से व्यवस्थित कीं।"],
        ["खेल विभाग ने टीम की जर्सियों का रंग बदला।", "एक विभाग ने सुबह की एक ट्यूटोरियल कक्षा का समय तीस मिनट बदला।"],
      ],
      "pa-IN": [
        ["ਕਾਲਜ ਨੇ ਸਟਾਫ਼ ਪਾਰਕਿੰਗ ਖੇਤਰ ਨੂੰ ਮੁੜ ਰੰਗਿਆ।", "ਲਾਇਬ੍ਰੇਰੀ ਨੇ ਇੱਕ ਪੜ੍ਹਨ ਕਮਰੇ ਵਿੱਚ ਕਿਤਾਬਾਂ ਦੀਆਂ ਅਲਮਾਰੀਆਂ ਮੁੜ ਵਿਵਸਥਿਤ ਕੀਤੀਆਂ।"],
        ["ਖੇਡ ਵਿਭਾਗ ਨੇ ਟੀਮ ਜਰਸੀਆਂ ਦਾ ਰੰਗ ਬਦਲਿਆ।", "ਇੱਕ ਵਿਭਾਗ ਨੇ ਸਵੇਰ ਦੀ ਇੱਕ ਟਿਊਟੋਰਿਅਲ ਕਲਾਸ ਦਾ ਸਮਾਂ ਤੀਹ ਮਿੰਟ ਬਦਲਿਆ।"],
      ],
    },
    rationale: {
      "en-IN": "Both changes are limited in scope and do not reasonably explain a sharp college-wide rise in evening library visits.",
      "hi-IN": "दोनों बदलाव सीमित दायरे के हैं और शाम के पुस्तकालय आगमन में कॉलेज-भर की तेज वृद्धि का उचित कारण नहीं बनते।",
      "pa-IN": "ਦੋਵੇਂ ਬਦਲਾਅ ਸੀਮਿਤ ਪੱਧਰ ਦੇ ਹਨ ਅਤੇ ਸ਼ਾਮ ਦੀਆਂ ਲਾਇਬ੍ਰੇਰੀ ਮੁਲਾਕਾਤਾਂ ਵਿੱਚ ਕਾਲਜ-ਪੱਧਰੀ ਤੇਜ਼ ਵਾਧੇ ਨੂੰ ਵਾਜਬ ਤੌਰ ਤੇ ਨਹੀਂ ਸਮਝਾਉਂਦੇ।",
    },
  },
  "bridge-closure-one-effect": {
    replacements: {
      "en-IN": [["The railway station changed the colour of platform signs.", "A local train on a different corridor was rescheduled because of track maintenance."]],
      "hi-IN": [["रेलवे स्टेशन ने प्लेटफॉर्म संकेतों का रंग बदल दिया।", "दूसरे कॉरिडोर की एक स्थानीय ट्रेन को पटरी के रखरखाव के कारण नए समय पर चलाया गया।"]],
      "pa-IN": [["ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨੇ ਪਲੇਟਫਾਰਮ ਨਿਸ਼ਾਨਾਂ ਦਾ ਰੰਗ ਬਦਲ ਦਿੱਤਾ।", "ਦੂਜੇ ਕੌਰੀਡੋਰ ਦੀ ਇੱਕ ਲੋਕਲ ਰੇਲ ਨੂੰ ਪਟੜੀ ਦੇ ਰੱਖ-ਰਖਾਵ ਕਾਰਨ ਨਵੇਂ ਸਮੇਂ ਤੇ ਚਲਾਇਆ ਗਿਆ।"]],
    },
    rationale: {
      "en-IN": "Closing the bridge can divert nearby road traffic. A train rescheduled on another corridor has its own stated cause—track maintenance—so it is not an effect of the bridge closure.",
      "hi-IN": "पुल बंद होने से पास का सड़क यातायात मोड़ा जा सकता है। दूसरे कॉरिडोर की ट्रेन का समय पटरी के रखरखाव के कारण बदला है, इसलिए वह पुल बंद होने का प्रभाव नहीं है।",
      "pa-IN": "ਪੁਲ ਬੰਦ ਹੋਣ ਨਾਲ ਨੇੜਲੀ ਸੜਕ ਆਵਾਜਾਈ ਮੋੜੀ ਜਾ ਸਕਦੀ ਹੈ। ਦੂਜੇ ਕੌਰੀਡੋਰ ਦੀ ਰੇਲ ਦਾ ਸਮਾਂ ਪਟੜੀ ਦੇ ਰੱਖ-ਰਖਾਵ ਕਾਰਨ ਬਦਲਿਆ ਹੈ, ਇਸ ਲਈ ਉਹ ਪੁਲ ਬੰਦ ਹੋਣ ਦਾ ਪ੍ਰਭਾਵ ਨਹੀਂ ਹੈ।",
    },
  },
  "server-load-second-effect": {
    replacements: {
      "en-IN": [["The office garden received new plants.", "A printer at one service counter stopped because it ran out of paper."]],
      "hi-IN": [["कार्यालय के बगीचे में नए पौधे लगाए गए।", "एक सेवा काउंटर का प्रिंटर कागज खत्म होने के कारण रुक गया।"]],
      "pa-IN": [["ਦਫ਼ਤਰ ਦੇ ਬਾਗ ਵਿੱਚ ਨਵੇਂ ਪੌਦੇ ਲਗਾਏ ਗਏ।", "ਇੱਕ ਸੇਵਾ ਕਾਊਂਟਰ ਦਾ ਪ੍ਰਿੰਟਰ ਕਾਗਜ਼ ਖਤਮ ਹੋਣ ਕਾਰਨ ਰੁਕ ਗਿਆ।"]],
    },
    rationale: {
      "en-IN": "Heavy request volume can enlarge the server response queue. The printer stoppage has a separate stated cause—lack of paper—so it does not follow from server load.",
      "hi-IN": "बहुत अधिक अनुरोध सर्वर की प्रतिक्रिया कतार बढ़ा सकते हैं। प्रिंटर रुकने का अलग स्पष्ट कारण—कागज खत्म होना—है, इसलिए वह सर्वर लोड का प्रभाव नहीं है।",
      "pa-IN": "ਬਹੁਤ ਵੱਧ ਬੇਨਤੀਆਂ ਸਰਵਰ ਦੀ ਜਵਾਬ ਕਤਾਰ ਵਧਾ ਸਕਦੀਆਂ ਹਨ। ਪ੍ਰਿੰਟਰ ਰੁਕਣ ਦਾ ਵੱਖਰਾ ਸਪਸ਼ਟ ਕਾਰਨ—ਕਾਗਜ਼ ਖਤਮ ਹੋਣਾ—ਹੈ, ਇਸ ਲਈ ਉਹ ਸਰਵਰ ਲੋਡ ਦਾ ਪ੍ਰਭਾਵ ਨਹੀਂ ਹੈ।",
    },
  },
  "power-failure-three-effects": {
    replacements: {
      "en-IN": [["A nearby school changed its morning assembly song.", "One dispatch vehicle changed route because of roadwork outside the storage complex."]],
      "hi-IN": [["पास के स्कूल ने सुबह की प्रार्थना का गीत बदल दिया।", "स्टोरेज परिसर के बाहर सड़क-कार्य के कारण एक डिस्पैच वाहन ने अपना मार्ग बदला।"]],
      "pa-IN": [["ਨੇੜਲੇ ਸਕੂਲ ਨੇ ਸਵੇਰ ਦੀ ਸਭਾ ਦਾ ਗੀਤ ਬਦਲ ਦਿੱਤਾ।", "ਸਟੋਰੇਜ ਕੰਪਲੈਕਸ ਦੇ ਬਾਹਰ ਸੜਕ ਕੰਮ ਕਾਰਨ ਇੱਕ ਡਿਸਪੈਚ ਵਾਹਨ ਨੇ ਆਪਣਾ ਰਸਤਾ ਬਦਲਿਆ।"]],
    },
    rationale: {
      "en-IN": "The power failure can pause loading and delay dispatch. The route change has its own stated cause—roadwork—so it is not an effect of the storage-unit power failure.",
      "hi-IN": "बिजली बंद होने से लोडिंग रुक सकती है और डिस्पैच में देरी हो सकती है। मार्ग बदलने का अलग स्पष्ट कारण—सड़क-कार्य—है, इसलिए वह स्टोरेज इकाई की बिजली बंद होने का प्रभाव नहीं है।",
      "pa-IN": "ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਨਾਲ ਲੋਡਿੰਗ ਰੁਕ ਸਕਦੀ ਹੈ ਅਤੇ ਡਿਸਪੈਚ ਵਿੱਚ ਦੇਰੀ ਹੋ ਸਕਦੀ ਹੈ। ਰਸਤਾ ਬਦਲਣ ਦਾ ਵੱਖਰਾ ਸਪਸ਼ਟ ਕਾਰਨ—ਸੜਕ ਕੰਮ—ਹੈ, ਇਸ ਲਈ ਉਹ ਸਟੋਰੇਜ ਇਕਾਈ ਦੀ ਬਿਜਲੀ ਬੰਦ ਹੋਣ ਦਾ ਪ੍ਰਭਾਵ ਨਹੀਂ ਹੈ।",
    },
  },
};

export function generateReviewedCaeCombinationQuestion(
  input: Readonly<{ qlId: "CAE-QL-003" | "CAE-QL-004"; locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  const base = generateCaeCombinationQuestion(input);
  const rewrite = REWRITES[base.scenarioVariantId];
  if (!rewrite) return base;

  let stem = base.stem;
  for (const [from, to] of rewrite.replacements[input.locale]) {
    stem = stem.replace(from, to);
  }
  const itemVariantId = `${base.itemVariantId}|surface:plausible-competing-events-v2`;

  return Object.freeze({
    ...base,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    stem,
    explanation: rewrite.rationale[input.locale],
  });
}
