import type { PhysicsLocaleV1 } from "./sci-physics-localization-types-v1";

const SUPPLEMENTS: Readonly<Record<string, Readonly<Record<PhysicsLocaleV1, string>>>> = Object.freeze({
  "SCI-CP003-EXH-A06": {
    en: "The factor becomes 2² = 4 because kinetic energy depends on the square of speed, not directly on speed.",
    hi: "यहाँ गुणक 2² = 4 बनता है क्योंकि गतिज ऊर्जा वेग के सीधे नहीं, बल्कि वेग के वर्ग के समानुपाती होती है।",
    pa: "ਇੱਥੇ ਗੁਣਕ 2² = 4 ਬਣਦਾ ਹੈ ਕਿਉਂਕਿ ਗਤਿਜ ਊਰਜਾ ਵੇਗ ਦੇ ਸਿੱਧੇ ਨਹੀਂ, ਸਗੋਂ ਵੇਗ ਦੇ ਵਰਗ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।",
  },
  "SCI-CP003-EXH-A23": {
    en: "This directly shows that power is the amount of work completed per unit time.",
    hi: "यह गणना सीधे दिखाती है कि शक्ति प्रति इकाई समय में किए गए कार्य की मात्रा है।",
    pa: "ਇਹ ਗਣਨਾ ਸਿੱਧਾ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ ਸ਼ਕਤੀ ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ਕੀਤੇ ਕਾਰਜ ਦੀ ਮਾਤਰਾ ਹੈ।",
  },
  "SCI-CP003-EXH-A24": {
    en: "This means 80% of the supplied input is obtained as useful output from the machine.",
    hi: "इसका अर्थ है कि दिए गए इनपुट का 80% उपयोगी आउटपुट के रूप में मिला।",
    pa: "ਇਸ ਦਾ ਅਰਥ ਹੈ ਕਿ ਦਿੱਤੇ ਇਨਪੁੱਟ ਦਾ 80% ਉਪਯੋਗੀ ਆਉਟਪੁੱਟ ਵਜੋਂ ਮਿਲਿਆ।",
  },
  "SCI-CP004-EXH-A24": {
    en: "A pressure of 50 Pa means a normal force of 50 N acts on each square metre of area.",
    hi: "50 Pa का अर्थ है कि प्रत्येक वर्ग मीटर क्षेत्रफल पर 50 N का लंबवत बल प्रभावी है।",
    pa: "50 Pa ਦਾ ਅਰਥ ਹੈ ਕਿ ਹਰ ਵਰਗ ਮੀਟਰ ਖੇਤਰਫਲ ਉੱਤੇ 50 N ਲੰਬਵਾਂ ਬਲ ਪ੍ਰਭਾਵੀ ਹੈ।",
  },
});

export function extendPhysicsCp003Cp004ExplanationV1(anchorId: string, locale: PhysicsLocaleV1, base: string): string {
  let explanation = base;
  if (locale === "hi") explanation = explanation.replaceAll("MA = Load/Effort", "MA = भार/प्रयास");
  const supplement = SUPPLEMENTS[anchorId]?.[locale];
  return supplement ? `${explanation} ${supplement}` : explanation;
}
