import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

/**
 * Typed World Geography variable pools use approved source facts and remain
 * under the shared review-only lifecycle after authoring/localization approval.
 */
type LocalizedValue = { en: string; hi: string; pa: string };
type CapitalFact = { key: string; country: LocalizedValue; capital: LocalizedValue };

const CAPITAL_FACTS: readonly CapitalFact[] = [
  { key: 'australia-canberra', country: { en: 'Australia', hi: 'ऑस्ट्रेलिया', pa: 'ਆਸਟ੍ਰੇਲੀਆ' }, capital: { en: 'Canberra', hi: 'कैनबरा', pa: 'ਕੈਨਬਰਾ' } },
  { key: 'kazakhstan-astana', country: { en: 'Kazakhstan', hi: 'कज़ाख़स्तान', pa: 'ਕਜ਼ਾਖਸਤਾਨ' }, capital: { en: 'Astana', hi: 'अस्ताना', pa: 'ਅਸਤਾਨਾ' } },
  { key: 'tanzania-dodoma', country: { en: 'Tanzania', hi: 'तंज़ानिया', pa: 'ਤਨਜ਼ਾਨੀਆ' }, capital: { en: 'Dodoma', hi: 'डोडोमा', pa: 'ਡੋਡੋਮਾ' } },
  { key: 'myanmar-naypyidaw', country: { en: 'Myanmar', hi: 'म्यांमार', pa: 'ਮਿਆਂਮਾਰ' }, capital: { en: 'Naypyidaw', hi: 'नेपीडॉ', pa: 'ਨੇਪੀਡੌ' } },
  { key: 'france-paris', country: { en: 'France', hi: 'फ़्रांस', pa: 'ਫ਼ਰਾਂਸ' }, capital: { en: 'Paris', hi: 'पेरिस', pa: 'ਪੈਰਿਸ' } },
  { key: 'egypt-cairo', country: { en: 'Egypt', hi: 'मिस्र', pa: 'ਮਿਸਰ' }, capital: { en: 'Cairo', hi: 'काहिरा', pa: 'ਕਾਹਿਰਾ' } },
  { key: 'russia-moscow', country: { en: 'Russia', hi: 'रूस', pa: 'ਰੂਸ' }, capital: { en: 'Moscow', hi: 'मॉस्को', pa: 'ਮਾਸਕੋ' } },
  { key: 'turkiye-ankara', country: { en: 'Türkiye', hi: 'तुर्किये', pa: 'ਤੁਰਕੀਏ' }, capital: { en: 'Ankara', hi: 'अंकारा', pa: 'ਅੰਕਾਰਾ' } },
];

const qlIds = {
  countryToCapital: 'WGE-001-CP022-QL001',
  capitalToCountry: 'WGE-001-CP022-QL002',
  matchedPair: 'WGE-001-CP022-QL003',
} as const;
const riverOutletQlId = 'WGE-001-CP019-QL001';
const mountainRangeQlId = 'WGE-001-CP018-QL001';
const lakeDescriptionQlId = 'WGE-001-CP020-QL001';
const desertDescriptionQlId = 'WGE-001-CP021-QL001';
const passageConnectionQlId = 'WGE-001-CP017-QL001';
const oceanCurrentQlId = 'WGE-001-CP016-QL001';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const localizedStem = (kind: keyof typeof qlIds, country: LocalizedValue, capital: LocalizedValue) => ({
  en: kind === 'countryToCapital' ? `What is the capital of ${country.en}?`
    : kind === 'capitalToCountry' ? `Which country's capital is ${capital.en}?`
      : 'Which of the following country–capital pairs is correctly matched?',
  hi: kind === 'countryToCapital' ? `${country.hi} की राजधानी कौन-सी है?`
    : kind === 'capitalToCountry' ? `${capital.hi} किस देश की राजधानी है?`
      : 'निम्नलिखित में से कौन-सा देश–राजधानी युग्म सही है?',
  pa: kind === 'countryToCapital' ? `${country.pa} ਦੀ ਰਾਜਧਾਨੀ ਕਿਹੜੀ ਹੈ?`
    : kind === 'capitalToCountry' ? `${capital.pa} ਕਿਹੜੇ ਦੇਸ਼ ਦੀ ਰਾਜਧਾਨੀ ਹੈ?`
      : 'ਹੇਠਾਂ ਦਿੱਤੇ ਦੇਸ਼–ਰਾਜਧਾਨੀ ਜੋੜਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?',
});

const localizedExplanation = (country: LocalizedValue, capital: LocalizedValue) => ({
  en: `${capital.en} is the capital of ${country.en}.`,
  hi: `${capital.hi}, ${country.hi} की राजधानी है।`,
  pa: `${capital.pa}, ${country.pa} ਦੀ ਰਾਜਧਾਨੀ ਹੈ।`,
});

function localizedOptions(kind: keyof typeof qlIds, target: CapitalFact, distractors: readonly CapitalFact[]) {
  if (kind === 'countryToCapital') return [target, ...distractors].map(f => f.capital);
  if (kind === 'capitalToCountry') return [target, ...distractors].map(f => f.country);
  return [target, ...distractors].map(f => ({
    en: `${f.country.en} — ${f.capital.en}`,
    hi: `${f.country.hi} — ${f.capital.hi}`,
    pa: `${f.country.pa} — ${f.capital.pa}`,
  }));
}

function makeQuestion(target: CapitalFact, kind: keyof typeof qlIds, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => CAPITAL_FACTS[(targetIndex + i + 1) % CAPITAL_FACTS.length]!);
  const optionFacts = localizedOptions(kind, target, distractors);
  const id = `WGE-001-CP022-Q-VP01-${kind}-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => optionFacts[index]![language]);
  const correctIndex = order.indexOf(0);
  const stem = localizedStem(kind, target.country, target.capital);
  const explanation = localizedExplanation(target.country, target.capital);
  return {
    id,
    cpId: 'WGE-001-CP022',
    objective: `variable-${kind}-${target.key}`,
    difficulty: kind === 'countryToCapital' ? 'Easy' : 'Medium',
    sourceIds: ['WGE-PHY-022A'],
    correctIndex,
    authoringReviewApproved: true,
    generationSource: 'WGE-001-CP022-VARIABLE-POOL-V1',
    qlId: qlIds[kind],
    locales: {
      en: { stem: stem.en, options: options('en'), explanation: explanation.en },
      hi: { stem: stem.hi, options: options('hi'), explanation: explanation.hi },
      pa: { stem: stem.pa, options: options('pa'), explanation: explanation.pa },
    },
  };
}

type RiverOutletFact = { key: string; river: LocalizedValue; outlet: LocalizedValue };
const RIVER_OUTLET_FACTS: readonly RiverOutletFact[] = [
  { key: 'amazon-atlantic', river: { en: 'Amazon', hi: 'अमेज़न', pa: 'ਐਮਾਜ਼ਨ' }, outlet: { en: 'Atlantic Ocean', hi: 'अटलांटिक महासागर', pa: 'ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ' } },
  { key: 'nile-mediterranean', river: { en: 'Nile', hi: 'नील', pa: 'ਨੀਲ' }, outlet: { en: 'Mediterranean Sea', hi: 'भूमध्य सागर', pa: 'ਭੂ-ਮੱਧ ਸਾਗਰ' } },
  { key: 'niger-guinea', river: { en: 'Niger', hi: 'नाइजर', pa: 'ਨਾਈਜਰ' }, outlet: { en: 'Gulf of Guinea', hi: 'गिनी की खाड़ी', pa: 'ਗਿਨੀ ਦੀ ਖਾੜੀ' } },
  { key: 'zambezi-indian', river: { en: 'Zambezi', hi: 'ज़ाम्बेज़ी', pa: 'ਜ਼ਾਮਬੇਜ਼ੀ' }, outlet: { en: 'Indian Ocean', hi: 'हिंद महासागर', pa: 'ਹਿੰਦ ਮਹਾਂਸਾਗਰ' } },
  { key: 'volga-caspian', river: { en: 'Volga', hi: 'वोल्गा', pa: 'ਵੋਲਗਾ' }, outlet: { en: 'Caspian Sea', hi: 'कैस्पियन सागर', pa: 'ਕੈਸਪੀਅਨ ਸਾਗਰ' } },
  { key: 'danube-black-sea', river: { en: 'Danube', hi: 'डेन्यूब', pa: 'ਡੈਨਿਊਬ' }, outlet: { en: 'Black Sea', hi: 'काला सागर', pa: 'ਕਾਲਾ ਸਾਗਰ' } },
  { key: 'rhine-north-sea', river: { en: 'Rhine', hi: 'राइन', pa: 'ਰਾਈਨ' }, outlet: { en: 'North Sea', hi: 'उत्तरी सागर', pa: 'ਉੱਤਰੀ ਸਾਗਰ' } },
  { key: 'mississippi-mexico', river: { en: 'Mississippi', hi: 'मिसिसिपी', pa: 'ਮਿਸਿਸਿਪੀ' }, outlet: { en: 'Gulf of Mexico', hi: 'मैक्सिको की खाड़ी', pa: 'ਮੈਕਸੀਕੋ ਦੀ ਖਾੜੀ' } },
  { key: 'mackenzie-beaufort', river: { en: 'Mackenzie', hi: 'मैकेंज़ी', pa: 'ਮੈਕੈਂਜ਼ੀ' }, outlet: { en: 'Beaufort Sea', hi: 'ब्यूफ़ोर्ट सागर', pa: 'ਬਿਊਫੋਰਟ ਸਾਗਰ' } },
  { key: 'yangtze-east-china', river: { en: 'Yangtze', hi: 'यांग्त्सी', pa: 'ਯਾਂਗਤਸੀ' }, outlet: { en: 'East China Sea', hi: 'पूर्वी चीन सागर', pa: 'ਪੂਰਬੀ ਚੀਨ ਸਾਗਰ' } },
  { key: 'huang-he-bohai', river: { en: 'Huang He', hi: 'हुआंग हे', pa: 'ਹੁਆਂਗ ਹੇ' }, outlet: { en: 'Bohai Sea', hi: 'बोहाई सागर', pa: 'ਬੋਹਾਈ ਸਾਗਰ' } },
  { key: 'mekong-south-china', river: { en: 'Mekong', hi: 'मेकांग', pa: 'ਮੇਕਾਂਗ' }, outlet: { en: 'South China Sea', hi: 'दक्षिण चीन सागर', pa: 'ਦੱਖਣੀ ਚੀਨ ਸਾਗਰ' } },
  { key: 'congo-atlantic', river: { en: 'Congo', hi: 'कांगो', pa: 'ਕਾਂਗੋ' }, outlet: { en: 'Atlantic Ocean', hi: 'अटलांटिक महासागर', pa: 'ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ' } },
  { key: 'st-lawrence-atlantic', river: { en: 'St. Lawrence', hi: 'सेंट लॉरेंस', pa: 'ਸੇਂਟ ਲਾਰੈਂਸ' }, outlet: { en: 'Atlantic Ocean', hi: 'अटलांटिक महासागर', pa: 'ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ' } },
  { key: 'tigris-euphrates-persian-gulf', river: { en: 'Tigris and Euphrates (via the Shatt al-Arab)', hi: 'टिगरिस और यूफ्रेटीस (शत्त-अल-अरब के रास्ते)', pa: 'ਟਾਈਗਰਿਸ ਅਤੇ ਯੂਫ਼ਰੇਟਿਸ (ਸ਼ੱਤ ਅਲ-ਅਰਬ ਰਾਹੀਂ)' }, outlet: { en: 'Persian Gulf', hi: 'फ़ारस की खाड़ी', pa: 'ਫ਼ਾਰਸ ਦੀ ਖਾੜੀ' } },
];

function makeRiverOutletQuestion(target: RiverOutletFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => RIVER_OUTLET_FACTS[(targetIndex + i + 1) % RIVER_OUTLET_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => ({
    en: `${f.river.en} — ${f.outlet.en}`,
    hi: `${f.river.hi} — ${f.outlet.hi}`,
    pa: `${f.river.pa} — ${f.outlet.pa}`,
  }));
  const id = `WGE-001-CP019-Q-VP01-RIVEROUTLET-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const stem = {
    en: 'Which river–outlet pair is correctly matched?',
    hi: 'नदी और उसके मुहाने का सही युग्म कौन-सा है?',
    pa: 'ਦਰਿਆ ਅਤੇ ਉਸ ਦੇ ਮੁਹਾਣੇ ਦਾ ਸਹੀ ਜੋੜ ਕਿਹੜਾ ਹੈ?',
  };
  const explanation = {
    en: `The ${target.river.en} flows into the ${target.outlet.en}.`,
    hi: `${target.river.hi} नदी ${target.outlet.hi} में गिरती है।`,
    pa: `${target.river.pa} ਦਰਿਆ ${target.outlet.pa} ਵਿੱਚ ਡਿੱਗਦਾ ਹੈ।`,
  };
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  return {
    id,
    cpId: 'WGE-001-CP019',
    objective: `variable-river-outlet-${target.key}`,
    difficulty: 'Medium',
    sourceIds: ['WGE-PHY-019A'],
    correctIndex: order.indexOf(0),
    authoringReviewApproved: true,
    generationSource: 'WGE-001-CP019-VARIABLE-POOL-V1',
    qlId: riverOutletQlId,
    locales: {
      en: { stem: stem.en, options: options('en'), explanation: explanation.en },
      hi: { stem: stem.hi, options: options('hi'), explanation: explanation.hi },
      pa: { stem: stem.pa, options: options('pa'), explanation: explanation.pa },
    },
  };
}

type MountainRangeFact = {
  key: string;
  name: LocalizedValue;
  clue: LocalizedValue;
  sourceId: string;
};

// Global ranges already established in CP018. India-specific regional
// geography is deliberately excluded; the Himalaya clue only identifies the
// range containing Everest, without adding India-specific facts.
const MOUNTAIN_RANGE_FACTS: readonly MountainRangeFact[] = [
  { key: 'andes', name: { en: 'Andes', hi: 'एंडीज़', pa: 'ਐਂਡੀਜ਼' }, clue: { en: 'This range follows the western edge of South America beside the Pacific coast.', hi: 'यह पर्वतमाला दक्षिण अमेरिका के पश्चिमी किनारे पर प्रशांत तट के साथ फैली है।', pa: 'ਇਹ ਪਰਬਤ-ਲੜੀ ਦੱਖਣੀ ਅਮਰੀਕਾ ਦੇ ਪੱਛਮੀ ਕਿਨਾਰੇ ਉੱਤੇ ਪ੍ਰਸ਼ਾਂਤ ਤਟ ਦੇ ਨਾਲ ਫੈਲੀ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'rockies', name: { en: 'Rocky Mountains', hi: 'रॉकी पर्वतमाला', pa: 'ਰੌਕੀ ਪਰਬਤ-ਲੜੀ' }, clue: { en: 'This range extends through western North America, from Canada into the United States.', hi: 'यह पर्वतमाला पश्चिमी उत्तरी अमेरिका में कनाडा से संयुक्त राज्य अमेरिका तक फैली है।', pa: 'ਇਹ ਪਰਬਤ-ਲੜੀ ਪੱਛਮੀ ਉੱਤਰੀ ਅਮਰੀਕਾ ਵਿੱਚ ਕੈਨੇਡਾ ਤੋਂ ਸੰਯੁਕਤ ਰਾਜ ਤੱਕ ਫੈਲੀ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'alps', name: { en: 'Alps', hi: 'आल्प्स', pa: 'ਐਲਪਸ' }, clue: { en: 'This high mountain arc crosses central Europe.', hi: 'यह ऊँचा पर्वतीय चाप मध्य यूरोप में फैला है।', pa: 'ਇਹ ਉੱਚੀ ਪਰਬਤੀ ਚਾਪ ਮੱਧ ਯੂਰਪ ਵਿੱਚ ਫੈਲੀ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'atlas', name: { en: 'Atlas Mountains', hi: 'एटलस पर्वत', pa: 'ਐਟਲਸ ਪਰਬਤ' }, clue: { en: 'This range extends across north-western Africa.', hi: 'यह पर्वतमाला उत्तर-पश्चिमी अफ्रीका में फैली है।', pa: 'ਇਹ ਪਰਬਤ-ਲੜੀ ਉੱਤਰ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਵਿੱਚ ਫੈਲੀ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'urals', name: { en: 'Urals', hi: 'यूराल', pa: 'ਯੂਰਾਲ' }, clue: { en: 'This range is conventionally used as part of the boundary between Europe and Asia.', hi: 'इस पर्वतमाला को परंपरागत रूप से यूरोप और एशिया की सीमा का एक भाग माना जाता है।', pa: 'ਇਸ ਪਰਬਤ-ਲੜੀ ਨੂੰ ਰਵਾਇਤੀ ਤੌਰ ਉੱਤੇ ਯੂਰਪ ਅਤੇ ਏਸ਼ੀਆ ਦੀ ਹੱਦ ਦਾ ਇੱਕ ਹਿੱਸਾ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'great-dividing-range', name: { en: 'Great Dividing Range', hi: 'ग्रेट डिवाइडिंग रेंज', pa: 'ਗ੍ਰੇਟ ਡਿਵਾਈਡਿੰਗ ਰੇਂਜ' }, clue: { en: 'This major range runs along eastern Australia.', hi: 'यह प्रमुख पर्वतमाला ऑस्ट्रेलिया के पूर्वी भाग में फैली है।', pa: 'ਇਹ ਮੁੱਖ ਪਰਬਤ-ਲੜੀ ਆਸਟ੍ਰੇਲੀਆ ਦੇ ਪੂਰਬੀ ਹਿੱਸੇ ਵਿੱਚ ਫੈਲੀ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'himalaya', name: { en: 'Himalaya', hi: 'हिमालय', pa: 'ਹਿਮਾਲਿਆ' }, clue: { en: 'Mount Everest is part of this mountain system.', hi: 'माउंट एवरेस्ट इसी पर्वत-प्रणाली का हिस्सा है।', pa: 'ਮਾਊਂਟ ਐਵਰੈਸਟ ਇਸੇ ਪਰਬਤ-ਪ੍ਰਣਾਲੀ ਦਾ ਹਿੱਸਾ ਹੈ।' }, sourceId: 'WGE-PHY-018A' },
  { key: 'appalachians', name: { en: 'Appalachians', hi: 'एपलाचियन', pa: 'ਐਪਲੇਸ਼ੀਅਨ' }, clue: { en: 'This old, heavily eroded range lies in eastern North America.', hi: 'यह पुरानी और अत्यधिक अपरदित पर्वतमाला पूर्वी उत्तरी अमेरिका में स्थित है।', pa: 'ਇਹ ਪੁਰਾਣੀ ਅਤੇ ਬਹੁਤ ਘਿਸੀ ਹੋਈ ਪਰਬਤ-ਲੜੀ ਪੂਰਬੀ ਉੱਤਰੀ ਅਮਰੀਕਾ ਵਿੱਚ ਸਥਿਤ ਹੈ।' }, sourceId: 'WGE-PHY-018B' },
];

const MOUNTAIN_RANGE_STEMS: Readonly<Record<MountainRangeFact['key'], LocalizedValue>> = {
  andes: { en: 'Which range runs along the Pacific side of South America?', hi: 'दक्षिण अमेरिका के प्रशांत तट के साथ कौन-सी पर्वतमाला फैली है?', pa: 'ਦੱਖਣੀ ਅਮਰੀਕਾ ਦੇ ਪ੍ਰਸ਼ਾਂਤ ਤਟ ਨਾਲ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਫੈਲੀ ਹੈ?' },
  rockies: { en: 'Which range extends through western North America from Canada into the United States?', hi: 'कनाडा से संयुक्त राज्य अमेरिका तक पश्चिमी उत्तरी अमेरिका में कौन-सी पर्वतमाला फैली है?', pa: 'ਕੈਨੇਡਾ ਤੋਂ ਸੰਯੁਕਤ ਰਾਜ ਤੱਕ ਪੱਛਮੀ ਉੱਤਰੀ ਅਮਰੀਕਾ ਵਿੱਚ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਫੈਲੀ ਹੈ?' },
  alps: { en: 'Which range forms a high arc across central Europe?', hi: 'मध्य यूरोप में ऊँचा पर्वतीय चाप कौन-सी पर्वतमाला बनाती है?', pa: 'ਮੱਧ ਯੂਰਪ ਵਿੱਚ ਉੱਚੀ ਪਰਬਤੀ ਚਾਪ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਬਣਾਉਂਦੀ ਹੈ?' },
  atlas: { en: 'Which range extends across north-western Africa?', hi: 'उत्तर-पश्चिमी अफ्रीका में कौन-सी पर्वतमाला फैली है?', pa: 'ਉੱਤਰ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਵਿੱਚ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਫੈਲੀ ਹੈ?' },
  urals: { en: 'Which range forms part of the conventional boundary between Europe and Asia?', hi: 'यूरोप और एशिया की परंपरागत सीमा का एक भाग कौन-सी पर्वतमाला बनाती है?', pa: 'ਯੂਰਪ ਅਤੇ ਏਸ਼ੀਆ ਦੀ ਰਵਾਇਤੀ ਹੱਦ ਦਾ ਇੱਕ ਹਿੱਸਾ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਬਣਾਉਂਦੀ ਹੈ?' },
  'great-dividing-range': { en: 'Which range runs along eastern Australia?', hi: 'ऑस्ट्रेलिया के पूर्वी भाग में कौन-सी पर्वतमाला फैली है?', pa: 'ਆਸਟ੍ਰੇਲੀਆ ਦੇ ਪੂਰਬੀ ਹਿੱਸੇ ਵਿੱਚ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਫੈਲੀ ਹੈ?' },
  himalaya: { en: 'Mount Everest belongs to which mountain range?', hi: 'माउंट एवरेस्ट किस पर्वतमाला का हिस्सा है?', pa: 'ਮਾਊਂਟ ਐਵਰੈਸਟ ਕਿਹੜੀ ਪਰਬਤ-ਲੜੀ ਦਾ ਹਿੱਸਾ ਹੈ?' },
  appalachians: { en: 'Which old, heavily eroded range lies in eastern North America?', hi: 'पूर्वी उत्तरी अमेरिका में कौन-सी प्राचीन और अत्यधिक अपरदित पर्वतमाला स्थित है?', pa: 'ਪੂਰਬੀ ਉੱਤਰੀ ਅਮਰੀਕਾ ਵਿੱਚ ਕਿਹੜੀ ਪੁਰਾਣੀ ਅਤੇ ਬਹੁਤ ਘਿਸੀ ਹੋਈ ਪਰਬਤ-ਲੜੀ ਸਥਿਤ ਹੈ?' },
};

function makeMountainRangeQuestion(target: MountainRangeFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => MOUNTAIN_RANGE_FACTS[(targetIndex + i + 1) % MOUNTAIN_RANGE_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => f.name);
  const id = `WGE-001-CP018-Q-VP01-RANGE-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  const stem = MOUNTAIN_RANGE_STEMS[target.key];
  const explanation = {
    en: `${target.name.en}: ${target.clue.en}`,
    hi: `${target.name.hi}: ${target.clue.hi}`,
    pa: `${target.name.pa}: ${target.clue.pa}`,
  };
  return {
    id, cpId: 'WGE-001-CP018', objective: `variable-mountain-range-${target.key}`,
    difficulty: ['andes', 'rockies', 'alps', 'atlas'].includes(target.key) ? 'Easy' : 'Medium',
    sourceIds: [target.sourceId], correctIndex: order.indexOf(0), authoringReviewApproved: true,
    generationSource: 'WGE-001-CP018-VARIABLE-POOL-V1', qlId: mountainRangeQlId,
    locales: {
      en: { stem: stem.en, options: options('en'), explanation: explanation.en },
      hi: { stem: stem.hi, options: options('hi'), explanation: explanation.hi },
      pa: { stem: stem.pa, options: options('pa'), explanation: explanation.pa },
    },
  };
}

type LakeFact = {
  key: string;
  name: LocalizedValue;
  clue: LocalizedValue;
  sourceId: string;
  difficulty: 'Easy' | 'Medium';
};

const LAKE_FACTS: readonly LakeFact[] = [
  { key: 'superior', name: { en: 'Superior', hi: 'सुपीरियर', pa: 'ਸੁਪੀਰੀਅਰ' }, clue: { en: 'It has the largest surface area of the five Great Lakes.', hi: 'पाँच ग्रेट लेक्स में इसका सतही क्षेत्रफल सबसे बड़ा है।', pa: 'ਪੰਜ ਗ੍ਰੇਟ ਲੇਕਸ ਵਿੱਚ ਇਸ ਦਾ ਸਤਹੀ ਖੇਤਰਫਲ ਸਭ ਤੋਂ ਵੱਧ ਹੈ।' }, sourceId: 'WGE-PHY-020A', difficulty: 'Easy' },
  { key: 'michigan', name: { en: 'Michigan', hi: 'मिशिगन', pa: 'ਮਿਸ਼ੀਗਨ' }, clue: { en: 'It is the only Great Lake located wholly within the United States.', hi: 'यह एकमात्र ग्रेट लेक है जो पूरी तरह संयुक्त राज्य अमेरिका में स्थित है।', pa: 'ਇਹ ਇਕੱਲੀ ਗ੍ਰੇਟ ਲੇਕ ਹੈ ਜੋ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਯੁਕਤ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ।' }, sourceId: 'WGE-PHY-020A', difficulty: 'Easy' },
  { key: 'baikal', name: { en: 'Baikal', hi: 'बैकाल', pa: 'ਬੈਕਾਲ' }, clue: { en: 'This Siberian lake contains the greatest volume of freshwater of any lake.', hi: 'साइबेरिया की इस झील में किसी भी झील की तुलना में सबसे अधिक मीठा पानी है।', pa: 'ਸਾਇਬੇਰੀਆ ਦੀ ਇਸ ਝੀਲ ਵਿੱਚ ਕਿਸੇ ਵੀ ਝੀਲ ਨਾਲੋਂ ਸਭ ਤੋਂ ਵੱਧ ਮਿੱਠਾ ਪਾਣੀ ਹੈ।' }, sourceId: 'WGE-PHY-020B', difficulty: 'Medium' },
  { key: 'victoria', name: { en: 'Victoria', hi: 'विक्टोरिया', pa: 'ਵਿਕਟੋਰੀਆ' }, clue: { en: 'Tanzania, Uganda and Kenya border this African lake.', hi: 'अफ्रीका की इस झील की सीमा तंज़ानिया, युगांडा और केन्या से लगती है।', pa: 'ਅਫ਼ਰੀਕਾ ਦੀ ਇਸ ਝੀਲ ਦੀ ਹੱਦ ਤਨਜ਼ਾਨੀਆ, ਯੂਗਾਂਡਾ ਅਤੇ ਕੀਨੀਆ ਨਾਲ ਲੱਗਦੀ ਹੈ।' }, sourceId: 'WGE-PHY-020B', difficulty: 'Easy' },
  { key: 'tanganyika', name: { en: 'Tanganyika', hi: 'टांगान्यिका', pa: 'ਟਾਂਗਾਨੀਕਾ' }, clue: { en: 'This long East African lake occupies part of the Rift Valley and borders four countries.', hi: 'पूर्वी अफ्रीका की यह लंबी झील रिफ्ट घाटी के एक भाग में है और चार देशों से लगती है।', pa: 'ਪੂਰਬੀ ਅਫ਼ਰੀਕਾ ਦੀ ਇਹ ਲੰਮੀ ਝੀਲ ਰਿਫਟ ਘਾਟੀ ਦੇ ਇੱਕ ਹਿੱਸੇ ਵਿੱਚ ਹੈ ਅਤੇ ਚਾਰ ਦੇਸ਼ਾਂ ਨਾਲ ਲੱਗਦੀ ਹੈ।' }, sourceId: 'WGE-PHY-020B', difficulty: 'Medium' },
  { key: 'aral', name: { en: 'Aral Sea', hi: 'अराल सागर', pa: 'ਅਰਾਲ ਸਾਗਰ' }, clue: { en: 'This Central Asian lake shrank sharply after water was diverted from its feeder rivers.', hi: 'मध्य एशिया की यह झील उन नदियों का पानी मोड़ने के बाद बहुत सिकुड़ गई जो इसमें पानी लाती थीं।', pa: 'ਮੱਧ ਏਸ਼ੀਆ ਦੀ ਇਹ ਝੀਲ ਇਸ ਵਿੱਚ ਪਾਣੀ ਲਿਆਉਣ ਵਾਲੀਆਂ ਨਦੀਆਂ ਦਾ ਪਾਣੀ ਮੋੜੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਕਾਫ਼ੀ ਸੁੰਗੜ ਗਈ।' }, sourceId: 'WGE-PHY-020C', difficulty: 'Medium' },
  { key: 'chad', name: { en: 'Chad', hi: 'चाड झील', pa: 'ਚਾਡ ਝੀਲ' }, clue: { en: 'This lake lies in the Sahel south of the Sahara, and its area varies considerably.', hi: 'यह झील सहारा के दक्षिण में साहेल क्षेत्र में है और इसका क्षेत्रफल काफ़ी बदलता रहता है।', pa: 'ਇਹ ਝੀਲ ਸਹਾਰਾ ਦੇ ਦੱਖਣ ਵੱਲ ਸਹੇਲ ਖੇਤਰ ਵਿੱਚ ਹੈ ਅਤੇ ਇਸ ਦਾ ਖੇਤਰਫਲ ਕਾਫ਼ੀ ਬਦਲਦਾ ਰਹਿੰਦਾ ਹੈ।' }, sourceId: 'WGE-PHY-020B', difficulty: 'Medium' },
  { key: 'erie', name: { en: 'Erie', hi: 'ईरी', pa: 'ਈਰੀ' }, clue: { en: 'It is the shallowest of the five Great Lakes.', hi: 'पाँच ग्रेट लेक्स में यह सबसे उथली है।', pa: 'ਪੰਜ ਗ੍ਰੇਟ ਲੇਕਸ ਵਿੱਚ ਇਹ ਸਭ ਤੋਂ ਘੱਟ ਡੂੰਘੀ ਹੈ।' }, sourceId: 'WGE-PHY-020A', difficulty: 'Easy' },
  { key: 'ontario', name: { en: 'Ontario', hi: 'ओंटारियो', pa: 'ਓਨਟਾਰੀਓ' }, clue: { en: 'This Great Lake drains eastward through the St. Lawrence River system.', hi: 'इस ग्रेट लेक का पानी सेंट लॉरेंस नदी-तंत्र से होकर पूर्व की ओर बहता है।', pa: 'ਇਸ ਗ੍ਰੇਟ ਲੇਕ ਦਾ ਪਾਣੀ ਸੇਂਟ ਲਾਰੈਂਸ ਦਰਿਆ-ਤੰਤਰ ਰਾਹੀਂ ਪੂਰਬ ਵੱਲ ਵਗਦਾ ਹੈ।' }, sourceId: 'WGE-PHY-020A', difficulty: 'Medium' },
];

const LAKE_STEMS: Readonly<Record<LakeFact['key'], LocalizedValue>> = {
  superior: { en: 'Which of the Great Lakes is largest in surface area?', hi: 'ग्रेट लेक्स में सतही क्षेत्रफल के अनुसार सबसे बड़ी झील कौन-सी है?', pa: 'ਗ੍ਰੇਟ ਲੇਕਸ ਵਿੱਚ ਸਤਹੀ ਖੇਤਰਫਲ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਵੱਡੀ ਝੀਲ ਕਿਹੜੀ ਹੈ?' },
  michigan: { en: 'Which Great Lake lies wholly within the United States?', hi: 'कौन-सी ग्रेट लेक पूरी तरह संयुक्त राज्य अमेरिका में स्थित है?', pa: 'ਕਿਹੜੀ ਗ੍ਰੇਟ ਲੇਕ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਯੁਕਤ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ?' },
  baikal: { en: 'Which lake contains the greatest volume of freshwater?', hi: 'किस झील में मीठे पानी का सबसे बड़ा भंडार है?', pa: 'ਕਿਹੜੀ ਝੀਲ ਵਿੱਚ ਮਿੱਠੇ ਪਾਣੀ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਭੰਡਾਰ ਹੈ?' },
  victoria: { en: 'Which African lake borders Tanzania, Uganda and Kenya?', hi: 'तंज़ानिया, युगांडा और केन्या से सीमा साझा करने वाली अफ्रीकी झील कौन-सी है?', pa: 'ਤਨਜ਼ਾਨੀਆ, ਯੂਗਾਂਡਾ ਅਤੇ ਕੀਨੀਆ ਨਾਲ ਹੱਦ ਸਾਂਝੀ ਕਰਨ ਵਾਲੀ ਅਫ਼ਰੀਕੀ ਝੀਲ ਕਿਹੜੀ ਹੈ?' },
  tanganyika: { en: 'Which lake in the East African Rift is bordered by four countries?', hi: 'पूर्वी अफ्रीकी रिफ्ट की कौन-सी झील चार देशों से लगती है?', pa: 'ਪੂਰਬੀ ਅਫ਼ਰੀਕੀ ਰਿਫਟ ਦੀ ਕਿਹੜੀ ਝੀਲ ਚਾਰ ਦੇਸ਼ਾਂ ਨਾਲ ਲੱਗਦੀ ਹੈ?' },
  aral: { en: 'Which Central Asian lake shrank sharply after river water was diverted for irrigation?', hi: 'सिंचाई के लिए नदियों का पानी मोड़े जाने के बाद मध्य एशिया की कौन-सी झील तेज़ी से सिकुड़ गई?', pa: 'ਸਿੰਚਾਈ ਲਈ ਦਰਿਆਵਾਂ ਦਾ ਪਾਣੀ ਮੋੜੇ ਜਾਣ ਤੋਂ ਬਾਅਦ ਮੱਧ ਏਸ਼ੀਆ ਦੀ ਕਿਹੜੀ ਝੀਲ ਤੇਜ਼ੀ ਨਾਲ ਸੁੰਗੜ ਗਈ?' },
  chad: { en: 'Which Sahelian lake lies immediately south of the Sahara?', hi: 'सहारा के ठीक दक्षिण में स्थित साहेल की झील कौन-सी है?', pa: 'ਸਹਾਰਾ ਦੇ ਬਿਲਕੁਲ ਦੱਖਣ ਵਿੱਚ ਸਥਿਤ ਸਹੇਲ ਦੀ ਝੀਲ ਕਿਹੜੀ ਹੈ?' },
  erie: { en: 'Which of the Great Lakes is the shallowest?', hi: 'ग्रेट लेक्स में सबसे कम गहराई वाली झील कौन-सी है?', pa: 'ਗ੍ਰੇਟ ਲੇਕਸ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਡੂੰਘੀ ਝੀਲ ਕਿਹੜੀ ਹੈ?' },
  ontario: { en: 'Which Great Lake drains east through the St. Lawrence River system?', hi: 'सेंट लॉरेंस नदी-तंत्र से होकर पूर्व की ओर किस ग्रेट लेक का पानी बहता है?', pa: 'ਸੇਂਟ ਲਾਰੈਂਸ ਦਰਿਆ-ਤੰਤਰ ਰਾਹੀਂ ਪੂਰਬ ਵੱਲ ਕਿਹੜੀ ਗ੍ਰੇਟ ਲੇਕ ਦਾ ਪਾਣੀ ਵਗਦਾ ਹੈ?' },
};

function makeLakeQuestion(target: LakeFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => LAKE_FACTS[(targetIndex + i + 1) % LAKE_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => f.name);
  const id = `WGE-001-CP020-Q-VP01-LAKE-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  const stem = LAKE_STEMS[target.key];
  const explanation = {
    en: `${target.name.en}: ${target.clue.en}`,
    hi: `${target.name.hi}: ${target.clue.hi}`,
    pa: `${target.name.pa}: ${target.clue.pa}`,
  };
  return {
    id, cpId: 'WGE-001-CP020', objective: `variable-lake-identification-${target.key}`,
    difficulty: target.difficulty, sourceIds: [target.sourceId], correctIndex: order.indexOf(0),
    authoringReviewApproved: true, generationSource: 'WGE-001-CP020-VARIABLE-POOL-V1', qlId: lakeDescriptionQlId,
    locales: {
      en: { stem: stem.en, options: options('en'), explanation: explanation.en },
      hi: { stem: stem.hi, options: options('hi'), explanation: explanation.hi },
      pa: { stem: stem.pa, options: options('pa'), explanation: explanation.pa },
    },
  };
}

type DesertFact = {
  key: string;
  name: LocalizedValue;
  clue: LocalizedValue;
  difficulty: 'Easy' | 'Medium';
};

// The Thar is intentionally excluded because it belongs to the active India
// Geography workstream, not this World Geography pool.
const DESERT_FACTS: readonly DesertFact[] = [
  { key: 'sahara', name: { en: 'Sahara', hi: 'सहारा', pa: 'ਸਹਾਰਾ' }, clue: { en: 'This vast hot desert covers much of North Africa.', hi: 'यह विशाल गर्म मरुस्थल उत्तर अफ्रीका के बड़े भाग में फैला है।', pa: 'ਇਹ ਵਿਸ਼ਾਲ ਗਰਮ ਰੇਗਿਸਤਾਨ ਉੱਤਰੀ ਅਫ਼ਰੀਕਾ ਦੇ ਵੱਡੇ ਹਿੱਸੇ ਵਿੱਚ ਫੈਲਿਆ ਹੈ।' }, difficulty: 'Easy' },
  { key: 'gobi', name: { en: 'Gobi', hi: 'गोबी', pa: 'ਗੋਬੀ' }, clue: { en: 'This cold desert extends across southern Mongolia and northern China.', hi: 'यह ठंडा मरुस्थल दक्षिणी मंगोलिया और उत्तरी चीन में फैला है।', pa: 'ਇਹ ਠੰਢਾ ਰੇਗਿਸਤਾਨ ਦੱਖਣੀ ਮੰਗੋਲੀਆ ਅਤੇ ਉੱਤਰੀ ਚੀਨ ਵਿੱਚ ਫੈਲਿਆ ਹੈ।' }, difficulty: 'Easy' },
  { key: 'atacama', name: { en: 'Atacama', hi: 'अटाकामा', pa: 'ਅਟਾਕਾਮਾ' }, clue: { en: 'This extremely arid desert occupies the Pacific-facing side of northern Chile.', hi: 'यह अत्यंत शुष्क मरुस्थल उत्तरी चिली के प्रशांत-मुखी भाग में है।', pa: 'ਇਹ ਬਹੁਤ ਸੁੱਕਾ ਰੇਗਿਸਤਾਨ ਉੱਤਰੀ ਚਿਲੀ ਦੇ ਪ੍ਰਸ਼ਾਂਤ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਿੱਸੇ ਵਿੱਚ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'namib', name: { en: 'Namib', hi: 'नामिब', pa: 'ਨਾਮਿਬ' }, clue: { en: 'This coastal desert runs along Namibia and nearby parts of south-western Africa.', hi: 'यह तटीय मरुस्थल नामीबिया और दक्षिण-पश्चिमी अफ्रीका के निकटवर्ती भागों में फैला है।', pa: 'ਇਹ ਤਟਵਰਤੀ ਰੇਗਿਸਤਾਨ ਨਾਮੀਬੀਆ ਅਤੇ ਦੱਖਣ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਦੇ ਨੇੜਲੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਫੈਲਿਆ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'antarctic', name: { en: 'Antarctic Desert', hi: 'अंटार्कटिक मरुस्थल', pa: 'ਅੰਟਾਰਕਟਿਕ ਰੇਗਿਸਤਾਨ' }, clue: { en: 'This polar desert receives very little precipitation despite its extensive ice cover.', hi: 'बर्फ़ की विशाल परत होने के बावजूद इस ध्रुवीय मरुस्थल में बहुत कम वर्षण होता है।', pa: 'ਬਰਫ਼ ਦੀ ਵਿਸ਼ਾਲ ਪਰਤ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਇਸ ਧਰੁਵੀ ਰੇਗਿਸਤਾਨ ਵਿੱਚ ਬਹੁਤ ਘੱਟ ਵਰਖਾ ਹੁੰਦੀ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'kalahari', name: { en: 'Kalahari', hi: 'कालाहारी', pa: 'ਕਾਲਾਹਾਰੀ' }, clue: { en: 'This large semi-arid basin lies across Botswana and neighbouring parts of southern Africa.', hi: 'यह बड़ा अर्ध-शुष्क बेसिन बोत्सवाना और दक्षिणी अफ्रीका के निकटवर्ती भागों में फैला है।', pa: 'ਇਹ ਵੱਡਾ ਅਰਧ-ਖੁਸ਼ਕ ਬੇਸਿਨ ਬੋਤਸਵਾਨਾ ਅਤੇ ਦੱਖਣੀ ਅਫ਼ਰੀਕਾ ਦੇ ਨੇੜਲੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਫੈਲਿਆ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'patagonian', name: { en: 'Patagonian Desert', hi: 'पैटागोनियाई मरुस्थल', pa: 'ਪੈਟਾਗੋਨੀਆਈ ਰੇਗਿਸਤਾਨ' }, clue: { en: 'This desert lies east of the southern Andes in the rain shadow, chiefly in Argentina.', hi: 'यह मरुस्थल दक्षिणी एंडीज़ के पूर्व में वर्षा-छाया क्षेत्र में, मुख्यतः अर्जेंटीना में स्थित है।', pa: 'ਇਹ ਰੇਗਿਸਤਾਨ ਦੱਖਣੀ ਐਂਡੀਜ਼ ਦੇ ਪੂਰਬ ਵੱਲ ਵਰਖਾ-ਛਾਂ ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ, ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਅਰਜਨਟੀਨਾ ਵਿੱਚ ਸਥਿਤ ਹੈ।' }, difficulty: 'Medium' },
];

const DESERT_STEMS: Readonly<Record<DesertFact['key'], LocalizedValue>> = {
  sahara: { en: 'Which hot desert covers a vast belt of North Africa?', hi: 'उत्तर अफ्रीका के विशाल भाग में कौन-सा गर्म मरुस्थल फैला है?', pa: 'ਉੱਤਰੀ ਅਫ਼ਰੀਕਾ ਦੇ ਵਿਸ਼ਾਲ ਹਿੱਸੇ ਵਿੱਚ ਕਿਹੜਾ ਗਰਮ ਰੇਗਿਸਤਾਨ ਫੈਲਿਆ ਹੈ?' },
  gobi: { en: 'Which cold desert extends across southern Mongolia and northern China?', hi: 'दक्षिणी मंगोलिया और उत्तरी चीन में कौन-सा ठंडा मरुस्थल फैला है?', pa: 'ਦੱਖਣੀ ਮੰਗੋਲੀਆ ਅਤੇ ਉੱਤਰੀ ਚੀਨ ਵਿੱਚ ਕਿਹੜਾ ਠੰਢਾ ਰੇਗਿਸਤਾਨ ਫੈਲਿਆ ਹੈ?' },
  atacama: { en: 'Which extremely arid desert lies along the Pacific coast of northern Chile?', hi: 'उत्तरी चिली के प्रशांत तट पर कौन-सा अत्यंत शुष्क मरुस्थल स्थित है?', pa: 'ਉੱਤਰੀ ਚਿਲੀ ਦੇ ਪ੍ਰਸ਼ਾਂਤ ਤਟ ਉੱਤੇ ਕਿਹੜਾ ਬਹੁਤ ਸੁੱਕਾ ਰੇਗਿਸਤਾਨ ਸਥਿਤ ਹੈ?' },
  namib: { en: 'Which coastal desert extends along Namibia in south-western Africa?', hi: 'दक्षिण-पश्चिमी अफ्रीका में नामीबिया के तट पर कौन-सा मरुस्थल फैला है?', pa: 'ਦੱਖਣ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਵਿੱਚ ਨਾਮੀਬੀਆ ਦੇ ਤਟ ਨਾਲ ਕਿਹੜਾ ਰੇਗਿਸਤਾਨ ਫੈਲਿਆ ਹੈ?' },
  antarctic: { en: 'Which polar desert receives very little precipitation despite its extensive ice cover?', hi: 'बर्फ़ की विशाल परत के बावजूद किस ध्रुवीय मरुस्थल में बहुत कम वर्षण होता है?', pa: 'ਬਰਫ਼ ਦੀ ਵਿਸ਼ਾਲ ਪਰਤ ਦੇ ਬਾਵਜੂਦ ਕਿਹੜੇ ਧਰੁਵੀ ਰੇਗਿਸਤਾਨ ਵਿੱਚ ਬਹੁਤ ਘੱਟ ਵਰਖਾ ਹੁੰਦੀ ਹੈ?' },
  kalahari: { en: 'Which semi-arid basin covers Botswana and neighbouring parts of southern Africa?', hi: 'बोत्सवाना और दक्षिणी अफ्रीका के निकटवर्ती भागों में कौन-सा अर्ध-शुष्क बेसिन फैला है?', pa: 'ਬੋਤਸਵਾਨਾ ਅਤੇ ਦੱਖਣੀ ਅਫ਼ਰੀਕਾ ਦੇ ਨੇੜਲੇ ਹਿੱਸਿਆਂ ਵਿੱਚ ਕਿਹੜਾ ਅਰਧ-ਖੁਸ਼ਕ ਬੇਸਿਨ ਫੈਲਿਆ ਹੈ?' },
  patagonian: { en: 'Which desert lies east of the southern Andes in Argentina’s rain shadow?', hi: 'अर्जेंटीना में दक्षिणी एंडीज़ के पूर्व की वर्षा-छाया में कौन-सा मरुस्थल स्थित है?', pa: 'ਅਰਜਨਟੀਨਾ ਵਿੱਚ ਦੱਖਣੀ ਐਂਡੀਜ਼ ਦੇ ਪੂਰਬ ਵੱਲ ਵਰਖਾ-ਛਾਂ ਵਿੱਚ ਕਿਹੜਾ ਰੇਗਿਸਤਾਨ ਸਥਿਤ ਹੈ?' },
};

function makeDesertQuestion(target: DesertFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => DESERT_FACTS[(targetIndex + i + 1) % DESERT_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => f.name);
  const id = `WGE-001-CP021-Q-VP01-DESERT-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  const stem = DESERT_STEMS[target.key];
  const explanation = {
    en: `${target.name.en}: ${target.clue.en}`,
    hi: `${target.name.hi}: ${target.clue.hi}`,
    pa: `${target.name.pa}: ${target.clue.pa}`,
  };
  return {
    id, cpId: 'WGE-001-CP021', objective: `variable-desert-identification-${target.key}`,
    difficulty: target.difficulty, sourceIds: ['WGE-PHY-021A'], correctIndex: order.indexOf(0),
    authoringReviewApproved: true, generationSource: 'WGE-001-CP021-VARIABLE-POOL-V1', qlId: desertDescriptionQlId,
    locales: {
      en: { stem: stem.en, options: options('en'), explanation: explanation.en },
      hi: { stem: stem.hi, options: options('hi'), explanation: explanation.hi },
      pa: { stem: stem.pa, options: options('pa'), explanation: explanation.pa },
    },
  };
}

type PassageFact = {
  key: string;
  name: LocalizedValue;
  stem: LocalizedValue;
  explanation: LocalizedValue;
  sourceIds: readonly string[];
  difficulty: 'Easy' | 'Medium';
};

// World passages already covered in CP017. India-specific Palk Strait and
// subcontinent location facts are intentionally left in their owning track.
const PASSAGE_FACTS: readonly PassageFact[] = [
  { key: 'gibraltar', name: { en: 'Strait of Gibraltar', hi: 'जिब्राल्टर जलडमरूमध्य', pa: 'ਜਿਬਰਾਲਟਰ ਜਲਡਮਰੂ' }, stem: { en: 'Which strait connects the Atlantic Ocean with the Mediterranean Sea?', hi: 'अटलांटिक महासागर को भूमध्य सागर से कौन-सा जलडमरूमध्य जोड़ता है?', pa: 'ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ ਨੂੰ ਭੂ-ਮੱਧ ਸਾਗਰ ਨਾਲ ਕਿਹੜਾ ਜਲਡਮਰੂ ਜੋੜਦਾ ਹੈ?' }, explanation: { en: 'The Strait of Gibraltar is the narrow western entrance to the Mediterranean from the Atlantic.', hi: 'जिब्राल्टर जलडमरूमध्य अटलांटिक से भूमध्य सागर का संकरा पश्चिमी प्रवेश-द्वार है।', pa: 'ਜਿਬਰਾਲਟਰ ਜਲਡਮਰੂ ਐਟਲਾਂਟਿਕ ਤੋਂ ਭੂ-ਮੱਧ ਸਾਗਰ ਦਾ ਤੰਗ ਪੱਛਮੀ ਪ੍ਰਵੇਸ਼-ਰਾਹ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Easy' },
  { key: 'hormuz', name: { en: 'Strait of Hormuz', hi: 'होर्मुज़ जलडमरूमध्य', pa: 'ਹੋਰਮੁਜ਼ ਜਲਡਮਰੂ' }, stem: { en: 'Which strait links the Persian Gulf with the Gulf of Oman?', hi: 'फ़ारस की खाड़ी से ओमान की खाड़ी तक जाने वाला जलडमरूमध्य कौन-सा है?', pa: 'ਫ਼ਾਰਸ ਦੀ ਖਾੜੀ ਤੋਂ ਓਮਾਨ ਦੀ ਖਾੜੀ ਤੱਕ ਜਾਣ ਵਾਲਾ ਜਲਡਮਰੂ ਕਿਹੜਾ ਹੈ?' }, explanation: { en: 'The Strait of Hormuz is the narrow outlet from the Persian Gulf to the Gulf of Oman.', hi: 'होर्मुज़ जलडमरूमध्य फ़ारस की खाड़ी से ओमान की खाड़ी तक जाने वाला संकरा मार्ग है।', pa: 'ਹੋਰਮੁਜ਼ ਜਲਡਮਰੂ ਫ਼ਾਰਸ ਦੀ ਖਾੜੀ ਤੋਂ ਓਮਾਨ ਦੀ ਖਾੜੀ ਤੱਕ ਜਾਣ ਵਾਲਾ ਤੰਗ ਰਾਹ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Easy' },
  { key: 'bab-el-mandeb', name: { en: 'Bab el-Mandeb Strait', hi: 'बाब-अल-मंदेब जलडमरूमध्य', pa: 'ਬਾਬ ਅਲ-ਮੰਦਬ ਜਲਡਮਰੂ' }, stem: { en: 'Which strait links the Red Sea with the Gulf of Aden?', hi: 'लाल सागर को अदन की खाड़ी से कौन-सा जलडमरूमध्य जोड़ता है?', pa: 'ਲਾਲ ਸਾਗਰ ਨੂੰ ਅਦਨ ਦੀ ਖਾੜੀ ਨਾਲ ਕਿਹੜਾ ਜਲਡਮਰੂ ਜੋੜਦਾ ਹੈ?' }, explanation: { en: 'Bab el-Mandeb links the Red Sea to the Gulf of Aden.', hi: 'बाब-अल-मंदेब लाल सागर को अदन की खाड़ी से जोड़ता है।', pa: 'ਬਾਬ ਅਲ-ਮੰਦਬ ਲਾਲ ਸਾਗਰ ਨੂੰ ਅਦਨ ਦੀ ਖਾੜੀ ਨਾਲ ਜੋੜਦਾ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Easy' },
  { key: 'malacca', name: { en: 'Strait of Malacca', hi: 'मलक्का जलडमरूमध्य', pa: 'ਮਲੱਕਾ ਜਲਡਮਰੂ' }, stem: { en: 'Which strait is the main sea route between the Andaman Sea and the South China Sea?', hi: 'अंडमान सागर और दक्षिण चीन सागर के बीच मुख्य समुद्री मार्ग कौन-सा जलडमरूमध्य है?', pa: 'ਅੰਡੇਮਾਨ ਸਾਗਰ ਅਤੇ ਦੱਖਣੀ ਚੀਨ ਸਾਗਰ ਵਿਚਕਾਰ ਮੁੱਖ ਸਮੁੰਦਰੀ ਰਾਹ ਕਿਹੜਾ ਜਲਡਮਰੂ ਹੈ?' }, explanation: { en: 'The Strait of Malacca runs between the Malay Peninsula and Sumatra and links the Andaman Sea with the South China Sea.', hi: 'मलक्का जलडमरूमध्य मलय प्रायद्वीप और सुमात्रा के बीच है तथा अंडमान सागर को दक्षिण चीन सागर से जोड़ता है।', pa: 'ਮਲੱਕਾ ਜਲਡਮਰੂ ਮਲਾਯੀ ਪ੍ਰਾਇਦੀਪ ਅਤੇ ਸੁਮਾਤਰਾ ਵਿਚਕਾਰ ਹੈ ਅਤੇ ਅੰਡੇਮਾਨ ਸਾਗਰ ਨੂੰ ਦੱਖਣੀ ਚੀਨ ਸਾਗਰ ਨਾਲ ਜੋੜਦਾ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Medium' },
  { key: 'bering', name: { en: 'Bering Strait', hi: 'बेरिंग जलडमरूमध्य', pa: 'ਬੇਰਿੰਗ ਜਲਡਮਰੂ' }, stem: { en: 'The waterway between Chukotka and Alaska is the:', hi: 'चुकोटका और अलास्का के बीच का जलडमरूमध्य है:', pa: 'ਚੁਕੋਤਕਾ ਅਤੇ ਅਲਾਸਕਾ ਵਿਚਕਾਰਲਾ ਜਲਡਮਰੂ ਹੈ:' }, explanation: { en: 'The Bering Strait separates Russia’s Chukotka Peninsula from Alaska.', hi: 'बेरिंग जलडमरूमध्य रूस के चुकोटका प्रायद्वीप को अलास्का से अलग करता है।', pa: 'ਬੇਰਿੰਗ ਜਲਡਮਰੂ ਰੂਸ ਦੇ ਚੁਕੋਤਕਾ ਪ੍ਰਾਇਦੀਪ ਨੂੰ ਅਲਾਸਕਾ ਤੋਂ ਵੱਖ ਕਰਦਾ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Easy' },
  { key: 'bosporus', name: { en: 'Bosporus', hi: 'बॉस्फोरस', pa: 'ਬੋਸਫੋਰਸ' }, stem: { en: 'Which passage connects the Black Sea with the Sea of Marmara?', hi: 'काला सागर को मरमरा सागर से कौन-सा जलमार्ग जोड़ता है?', pa: 'ਕਾਲੇ ਸਾਗਰ ਨੂੰ ਮਾਰਮਾਰਾ ਸਾਗਰ ਨਾਲ ਕਿਹੜਾ ਜਲਮਾਰਗ ਜੋੜਦਾ ਹੈ?' }, explanation: { en: 'The Bosporus leads from the Black Sea into the Sea of Marmara.', hi: 'बॉस्फोरस काला सागर से मरमरा सागर तक जाने वाला जलमार्ग है।', pa: 'ਬੋਸਫੋਰਸ ਕਾਲੇ ਸਾਗਰ ਤੋਂ ਮਾਰਮਾਰਾ ਸਾਗਰ ਤੱਕ ਜਾਣ ਵਾਲਾ ਜਲਮਾਰਗ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Medium' },
  { key: 'dardanelles', name: { en: 'Dardanelles', hi: 'डार्डानेल्स', pa: 'ਡਾਰਡਾਨੇਲਜ਼' }, stem: { en: 'Which waterway opens from the Sea of Marmara to the Aegean Sea?', hi: 'मरमरा सागर से एजियन सागर तक जाने वाला जलमार्ग कौन-सा है?', pa: 'ਮਾਰਮਾਰਾ ਸਾਗਰ ਤੋਂ ਏਜੀਅਨ ਸਾਗਰ ਤੱਕ ਜਾਣ ਵਾਲਾ ਜਲਮਾਰਗ ਕਿਹੜਾ ਹੈ?' }, explanation: { en: 'The Dardanelles is the south-western passage from the Sea of Marmara to the Aegean Sea.', hi: 'डार्डानेल्स मरमरा सागर से एजियन सागर की ओर जाने वाला दक्षिण-पश्चिमी मार्ग है।', pa: 'ਡਾਰਡਾਨੇਲਜ਼ ਮਾਰਮਾਰਾ ਸਾਗਰ ਤੋਂ ਏਜੀਅਨ ਸਾਗਰ ਵੱਲ ਜਾਣ ਵਾਲਾ ਦੱਖਣ-ਪੱਛਮੀ ਰਾਹ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Medium' },
  { key: 'dover', name: { en: 'Dover Strait', hi: 'डोवर जलडमरूमध्य', pa: 'ਡੋਵਰ ਜਲਡਮਰੂ' }, stem: { en: 'Which strait links the English Channel with the North Sea?', hi: 'इंग्लिश चैनल को उत्तरी सागर से कौन-सा जलडमरूमध्य जोड़ता है?', pa: 'ਉੱਤਰੀ ਸਾਗਰ ਨੂੰ ਇੰਗਲਿਸ਼ ਚੈਨਲ ਨਾਲ ਜੋੜਨ ਵਾਲਾ ਜਲਡਮਰੂ ਕਿਹੜਾ ਹੈ?' }, explanation: { en: 'The Strait of Dover is the narrow passage from the English Channel into the North Sea.', hi: 'डोवर जलडमरूमध्य इंग्लिश चैनल से उत्तरी सागर तक जाने वाला संकरा मार्ग है।', pa: 'ਡੋਵਰ ਜਲਡਮਰੂ ਇੰਗਲਿਸ਼ ਚੈਨਲ ਤੋਂ ਉੱਤਰੀ ਸਾਗਰ ਤੱਕ ਜਾਣ ਵਾਲਾ ਤੰਗ ਰਾਹ ਹੈ।' }, sourceIds: ['WGE-PHY-017A', 'WGE-PHY-017B'], difficulty: 'Easy' },
];

function makePassageQuestion(target: PassageFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => PASSAGE_FACTS[(targetIndex + i + 1) % PASSAGE_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => f.name);
  const id = `WGE-001-CP017-Q-VP01-PASSAGE-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  return {
    id, cpId: 'WGE-001-CP017', objective: `variable-passage-identification-${target.key}`,
    difficulty: target.difficulty, sourceIds: [...target.sourceIds], correctIndex: order.indexOf(0),
    authoringReviewApproved: true, generationSource: 'WGE-001-CP017-VARIABLE-POOL-V1', qlId: passageConnectionQlId,
    locales: {
      en: { stem: target.stem.en, options: options('en'), explanation: target.explanation.en },
      hi: { stem: target.stem.hi, options: options('hi'), explanation: target.explanation.hi },
      pa: { stem: target.stem.pa, options: options('pa'), explanation: target.explanation.pa },
    },
  };
}

type OceanCurrentFact = {
  key: string;
  name: LocalizedValue;
  stem: LocalizedValue;
  explanation: LocalizedValue;
  difficulty: 'Easy' | 'Medium';
};

const OCEAN_CURRENT_FACTS: readonly OceanCurrentFact[] = [
  { key: 'north-atlantic-drift', name: { en: 'North Atlantic Drift', hi: 'उत्तरी अटलांटिक प्रवाह', pa: 'ਉੱਤਰੀ ਐਟਲਾਂਟਿਕ ਡ੍ਰਿਫਟ' }, stem: { en: 'Which warm current continues the Gulf Stream towards western Europe?', hi: 'गल्फ स्ट्रीम को पश्चिमी यूरोप की ओर आगे ले जाने वाली गर्म धारा कौन-सी है?', pa: 'ਗਲਫ਼ ਸਟ੍ਰੀਮ ਨੂੰ ਪੱਛਮੀ ਯੂਰਪ ਵੱਲ ਅੱਗੇ ਲਿਜਾਣ ਵਾਲੀ ਗਰਮ ਧਾਰਾ ਕਿਹੜੀ ਹੈ?' }, explanation: { en: 'The North Atlantic Drift is the eastward continuation of the Gulf Stream and carries relatively warm water towards western Europe.', hi: 'उत्तरी अटलांटिक प्रवाह गल्फ स्ट्रीम का पूर्व की ओर बढ़ता भाग है और अपेक्षाकृत गर्म जल पश्चिमी यूरोप तक ले जाता है।', pa: 'ਉੱਤਰੀ ਐਟਲਾਂਟਿਕ ਡ੍ਰਿਫਟ ਗਲਫ਼ ਸਟ੍ਰੀਮ ਦਾ ਪੂਰਬ ਵੱਲ ਵਧਦਾ ਹਿੱਸਾ ਹੈ ਅਤੇ ਮੁਕਾਬਲਤਨ ਗਰਮ ਪਾਣੀ ਪੱਛਮੀ ਯੂਰਪ ਵੱਲ ਲੈ ਜਾਂਦਾ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'kuroshio', name: { en: 'Kuroshio Current', hi: 'कुरोशियो धारा', pa: 'ਕੁਰੋਸ਼ਿਓ ਧਾਰਾ' }, stem: { en: 'Which warm current flows north along the coast of Japan?', hi: 'जापान के तट के साथ उत्तर की ओर कौन-सी गर्म धारा बहती है?', pa: 'ਜਪਾਨ ਦੇ ਤਟ ਨਾਲ ਉੱਤਰ ਵੱਲ ਕਿਹੜੀ ਗਰਮ ਧਾਰਾ ਵਗਦੀ ਹੈ?' }, explanation: { en: 'The Kuroshio is a warm current that flows north past Japan in the North Pacific.', hi: 'कुरोशियो उत्तरी प्रशांत महासागर में जापान के पास उत्तर की ओर बहने वाली गर्म धारा है।', pa: 'ਕੁਰੋਸ਼ਿਓ ਉੱਤਰੀ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ ਵਿੱਚ ਜਪਾਨ ਦੇ ਕੋਲੋਂ ਉੱਤਰ ਵੱਲ ਵਗਣ ਵਾਲੀ ਗਰਮ ਧਾਰਾ ਹੈ।' }, difficulty: 'Easy' },
  { key: 'california', name: { en: 'California Current', hi: 'कैलिफ़ोर्निया धारा', pa: 'ਕੈਲੀਫ਼ੋਰਨੀਆ ਧਾਰਾ' }, stem: { en: 'Which cold current carries water south along North America’s Pacific coast?', hi: 'उत्तरी अमेरिका के प्रशांत तट के साथ दक्षिण की ओर कौन-सी ठंडी धारा बहती है?', pa: 'ਉੱਤਰੀ ਅਮਰੀਕਾ ਦੇ ਪ੍ਰਸ਼ਾਂਤ ਤਟ ਨਾਲ ਦੱਖਣ ਵੱਲ ਕਿਹੜੀ ਠੰਢੀ ਧਾਰਾ ਵਗਦੀ ਹੈ?' }, explanation: { en: 'The California Current flows south along the western coast of North America.', hi: 'कैलिफ़ोर्निया धारा उत्तरी अमेरिका के पश्चिमी तट के साथ दक्षिण की ओर बहती है।', pa: 'ਕੈਲੀਫ਼ੋਰਨੀਆ ਧਾਰਾ ਉੱਤਰੀ ਅਮਰੀਕਾ ਦੇ ਪੱਛਮੀ ਤਟ ਨਾਲ ਦੱਖਣ ਵੱਲ ਵਗਦੀ ਹੈ।' }, difficulty: 'Easy' },
  { key: 'peru-humboldt', name: { en: 'Peru (Humboldt) Current', hi: 'पेरू (हम्बोल्ट) धारा', pa: 'ਪੇਰੂ (ਹੰਬੋਲਟ) ਧਾਰਾ' }, stem: { en: 'Which cold current flows north along the west coast of South America?', hi: 'दक्षिण अमेरिका के पश्चिमी तट के साथ उत्तर की ओर कौन-सी ठंडी धारा बहती है?', pa: 'ਦੱਖਣੀ ਅਮਰੀਕਾ ਦੇ ਪੱਛਮੀ ਤਟ ਨਾਲ ਉੱਤਰ ਵੱਲ ਕਿਹੜੀ ਠੰਢੀ ਧਾਰਾ ਵਗਦੀ ਹੈ?' }, explanation: { en: 'The Peru, or Humboldt, Current flows north along South America’s Pacific coast; coastal upwelling there brings nutrient-rich water towards the surface.', hi: 'पेरू या हम्बोल्ट धारा दक्षिण अमेरिका के प्रशांत तट के साथ उत्तर की ओर बहती है। यहाँ तटीय अपवेलिंग पोषक तत्त्वों वाला जल सतह तक लाती है।', pa: 'ਪੇਰੂ ਜਾਂ ਹੰਬੋਲਟ ਧਾਰਾ ਦੱਖਣੀ ਅਮਰੀਕਾ ਦੇ ਪ੍ਰਸ਼ਾਂਤ ਤਟ ਨਾਲ ਉੱਤਰ ਵੱਲ ਵਗਦੀ ਹੈ। ਇੱਥੇ ਤਟਵਰਤੀ ਅਪਵੈਲਿੰਗ ਪੋਸ਼ਕ ਤੱਤਾਂ ਵਾਲਾ ਪਾਣੀ ਸਤਹ ਤੱਕ ਲਿਆਉਂਦੀ ਹੈ।' }, difficulty: 'Medium' },
  { key: 'benguela', name: { en: 'Benguela Current', hi: 'बेंगुएला धारा', pa: 'ਬੇਂਗੁਏਲਾ ਧਾਰਾ' }, stem: { en: 'Which cold current flows north off south-western Africa?', hi: 'दक्षिण-पश्चिमी अफ्रीका के तट से उत्तर की ओर कौन-सी ठंडी धारा बहती है?', pa: 'ਦੱਖਣ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਦੇ ਤਟ ਤੋਂ ਉੱਤਰ ਵੱਲ ਕਿਹੜੀ ਠੰਢੀ ਧਾਰਾ ਵਗਦੀ ਹੈ?' }, explanation: { en: 'The Benguela Current flows north off south-western Africa. Upwelling in this region supports productive fisheries.', hi: 'बेंगुएला धारा दक्षिण-पश्चिमी अफ्रीका के तट से उत्तर की ओर बहती है। इस क्षेत्र की अपवेलिंग समृद्ध मत्स्य क्षेत्रों को सहारा देती है।', pa: 'ਬੇਂਗੁਏਲਾ ਧਾਰਾ ਦੱਖਣ-ਪੱਛਮੀ ਅਫ਼ਰੀਕਾ ਦੇ ਤਟ ਤੋਂ ਉੱਤਰ ਵੱਲ ਵਗਦੀ ਹੈ। ਇਸ ਖੇਤਰ ਦੀ ਅਪਵੈਲਿੰਗ ਮੱਛੀਆਂ ਦੇ ਵੱਡੇ ਭੰਡਾਰਾਂ ਨੂੰ ਸਹਾਰਾ ਦਿੰਦੀ ਹੈ।' }, difficulty: 'Easy' },
];

function makeOceanCurrentQuestion(target: OceanCurrentFact, targetIndex: number): WorldGeographyQuestion {
  const distractors = Array.from({ length: 3 }, (_, i) => OCEAN_CURRENT_FACTS[(targetIndex + i + 1) % OCEAN_CURRENT_FACTS.length]!);
  const factOptions = [target, ...distractors].map(f => f.name);
  const id = `WGE-001-CP016-Q-VP01-CURRENT-${target.key}`.toUpperCase();
  const order = deterministicShuffle([0, 1, 2, 3], `${id}:option-order`);
  const options = (language: 'en' | 'hi' | 'pa') => order.map(index => factOptions[index]![language]);
  return {
    id, cpId: 'WGE-001-CP016', objective: `variable-ocean-current-${target.key}`,
    difficulty: target.difficulty, sourceIds: ['WGE-PHY-016A', 'WGE-PHY-016B'], correctIndex: order.indexOf(0),
    authoringReviewApproved: true, generationSource: 'WGE-001-CP016-VARIABLE-POOL-V1', qlId: oceanCurrentQlId,
    locales: {
      en: { stem: target.stem.en, options: options('en'), explanation: target.explanation.en },
      hi: { stem: target.stem.hi, options: options('hi'), explanation: target.explanation.hi },
      pa: { stem: target.stem.pa, options: options('pa'), explanation: target.explanation.pa },
    },
  };
}

export const WGE_VARIABLE_POOL_QUESTIONS_V1: readonly WorldGeographyQuestion[] = deepFreeze([
  ...CAPITAL_FACTS.flatMap((fact, index) => [
    makeQuestion(fact, 'countryToCapital', index),
    makeQuestion(fact, 'capitalToCountry', index),
    makeQuestion(fact, 'matchedPair', index),
  ]),
  ...RIVER_OUTLET_FACTS.map(makeRiverOutletQuestion),
  ...MOUNTAIN_RANGE_FACTS.map(makeMountainRangeQuestion),
  ...LAKE_FACTS.map(makeLakeQuestion),
  ...DESERT_FACTS.map(makeDesertQuestion),
  ...PASSAGE_FACTS.map(makePassageQuestion),
  ...OCEAN_CURRENT_FACTS.map(makeOceanCurrentQuestion),
]);

export const WGE_VARIABLE_POOL_QL_IDS_V1 = Object.freeze([...Object.values(qlIds), riverOutletQlId, mountainRangeQlId, lakeDescriptionQlId, desertDescriptionQlId, passageConnectionQlId, oceanCurrentQlId]);
