import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language = 'en' | 'hi' | 'pa';
type LocalizedValue = Record<Language, string>;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type GisFact = {
  key: string;
  label: LocalizedValue;
  stem: LocalizedValue;
  relation: LocalizedValue;
  sourceIds: readonly string[];
  difficulty: Difficulty;
};

const FACTS: readonly GisFact[] = [
  {
    key: 'georeferencing',
    label: { en: 'Georeferencing', hi: 'भू-संदर्भन', pa: 'ਭੂ-ਸੰਦਰਭਣ' },
    stem: {
      en: 'A scanned map is aligned to known coordinates so that it fits correctly with other spatial layers. Which process is being performed?',
      hi: 'स्कैन किए गए मानचित्र को ज्ञात निर्देशांकों से मिलाया जाता है ताकि वह अन्य स्थानिक परतों के साथ सही बैठे। यह कौन-सी प्रक्रिया है?',
      pa: 'ਸਕੈਨ ਕੀਤੇ ਨਕਸ਼ੇ ਨੂੰ ਜਾਣੇ-ਪਛਾਣੇ ਕੋਆਰਡੀਨੇਟਾਂ ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਇਹ ਹੋਰ ਸਥਾਨਕ ਪਰਤਾਂ ਨਾਲ ਠੀਕ ਬੈਠੇ। ਇਹ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੈ?'
    },
    relation: {
      en: 'aligning spatial data to known real-world coordinates',
      hi: 'स्थानिक आँकड़ों को ज्ञात वास्तविक निर्देशांकों से मिलाना',
      pa: 'ਸਥਾਨਕ ਡਾਟੇ ਨੂੰ ਜਾਣੇ-ਪਛਾਣੇ ਅਸਲੀ ਕੋਆਰਡੀਨੇਟਾਂ ਨਾਲ ਮਿਲਾਉਣਾ'
    },
    sourceIds: ['NCERT-GEOT-TECH'], difficulty: 'Medium'
  },
  {
    key: 'digital-elevation-model',
    label: { en: 'Digital elevation model', hi: 'डिजिटल ऊँचाई मॉडल', pa: 'ਡਿਜ਼ੀਟਲ ਉਚਾਈ ਮਾਡਲ' },
    stem: {
      en: 'Which digital dataset represents terrain elevation across a surface and can be used to derive slope and drainage?',
      hi: 'कौन-सा डिजिटल आँकड़ा-समूह सतह की ऊँचाई दर्शाता है और उससे ढाल तथा अपवाह निकाले जा सकते हैं?',
      pa: 'ਕਿਹੜਾ ਡਿਜ਼ੀਟਲ ਡਾਟਾ-ਸੈੱਟ ਸਤਹ ਦੀ ਉਚਾਈ ਦਰਸਾਉਂਦਾ ਹੈ ਅਤੇ ਇਸ ਤੋਂ ਢਲਾਣ ਅਤੇ ਨਿਕਾਸੀ ਕੱਢੀ ਜਾ ਸਕਦੀ ਹੈ?'
    },
    relation: {
      en: 'a digital representation of terrain elevation',
      hi: 'स्थलाकृति की ऊँचाई का डिजिटल निरूपण',
      pa: 'ਭੂ-ਆਕ੍ਰਿਤੀ ਦੀ ਉਚਾਈ ਦਾ ਡਿਜ਼ੀਟਲ ਰੂਪ'
    },
    sourceIds: ['NCERT-GEOT-TECH', 'ISRO-NRSC'], difficulty: 'Easy'
  },
  {
    key: 'multispectral-imagery',
    label: { en: 'Multispectral imagery', hi: 'बहुवर्णक्रमीय चित्रण', pa: 'ਬਹੁ-ਸਪੈਕਟ੍ਰਲ ਚਿੱਤਰਣ' },
    stem: {
      en: 'A satellite sensor records the same area in several separate wavelength bands. What type of imagery does this produce?',
      hi: 'एक उपग्रह संवेदक उसी क्षेत्र को कई अलग-अलग तरंगदैर्ध्य पट्टियों में दर्ज करता है। इससे किस प्रकार का चित्रण बनता है?',
      pa: 'ਇੱਕ ਉਪਗ੍ਰਹਿ ਸੈਂਸਰ ਇੱਕੋ ਖੇਤਰ ਨੂੰ ਕਈ ਵੱਖ-ਵੱਖ ਤਰੰਗ-ਲੰਬਾਈ ਬੈਂਡਾਂ ਵਿੱਚ ਦਰਜ ਕਰਦਾ ਹੈ। ਇਸ ਨਾਲ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਚਿੱਤਰਣ ਬਣਦਾ ਹੈ?'
    },
    relation: {
      en: 'imagery recorded in multiple wavelength bands',
      hi: 'कई तरंगदैर्ध्य पट्टियों में दर्ज चित्रण',
      pa: 'ਕਈ ਤਰੰਗ-ਲੰਬਾਈ ਬੈਂਡਾਂ ਵਿੱਚ ਦਰਜ ਚਿੱਤਰਣ'
    },
    sourceIds: ['NCERT-GEOT-TECH', 'ISRO-NRSC'], difficulty: 'Medium'
  },
  {
    key: 'change-detection',
    label: { en: 'Change detection', hi: 'परिवर्तन पहचान', pa: 'ਬਦਲਾਅ ਪਛਾਣ' },
    stem: {
      en: 'Satellite images of the same area from two dates are compared to identify where land cover has changed. Which analysis is this?',
      hi: 'एक ही क्षेत्र के दो अलग समय के उपग्रह चित्रों की तुलना करके भूमि-आवरण में बदलाव पहचाना जाता है। यह कौन-सा विश्लेषण है?',
      pa: 'ਇੱਕੋ ਖੇਤਰ ਦੀਆਂ ਦੋ ਵੱਖ ਤਰੀਖਾਂ ਦੀਆਂ ਉਪਗ੍ਰਹਿ ਤਸਵੀਰਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਭੂਮੀ-ਢੱਕਣ ਵਿੱਚ ਬਦਲਾਅ ਪਛਾਣਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੈ?'
    },
    relation: {
      en: 'comparing observations from different dates to map change',
      hi: 'अलग तिथियों के अवलोकनों की तुलना करके बदलाव मानचित्रित करना',
      pa: 'ਵੱਖ ਤਰੀਖਾਂ ਦੇ ਅਵਲੋਕਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਬਦਲਾਅ ਦਾ ਨਕਸ਼ਾ ਬਣਾਉਣਾ'
    },
    sourceIds: ['NCERT-GEOT-TECH', 'ISRO-NRSC'], difficulty: 'Easy'
  },
  {
    key: 'ground-truthing',
    label: { en: 'Ground truthing', hi: 'स्थलीय सत्यापन', pa: 'ਜ਼ਮੀਨੀ ਤਸਦੀਕ' },
    stem: {
      en: 'A remote-sensing classification is checked against observations collected at actual field locations. What is this validation step called?',
      hi: 'सुदूर-संवेदन वर्गीकरण की जाँच वास्तविक मैदानी स्थानों पर एकत्र अवलोकनों से की जाती है। इस सत्यापन चरण को क्या कहा जाता है?',
      pa: 'ਦੂਰ-ਸੰਵੇਦਨ ਵਰਗੀਕਰਨ ਦੀ ਜਾਂਚ ਅਸਲ ਮੈਦਾਨੀ ਥਾਵਾਂ ਉੱਤੇ ਇਕੱਠੇ ਕੀਤੇ ਅਵਲੋਕਨਾਂ ਨਾਲ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਇਸ ਤਸਦੀਕੀ ਕਦਮ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'checking remotely sensed interpretation with field observations',
      hi: 'सुदूर-संवेदन व्याख्या की मैदानी अवलोकनों से जाँच',
      pa: 'ਦੂਰ-ਸੰਵੇਦਨ ਵਿਆਖਿਆ ਦੀ ਮੈਦਾਨੀ ਅਵਲੋਕਨਾਂ ਨਾਲ ਜਾਂਚ'
    },
    sourceIds: ['NCERT-GEOT-TECH'], difficulty: 'Medium'
  },
  {
    key: 'geocoding',
    label: { en: 'Geocoding', hi: 'भू-कोडन', pa: 'ਭੂ-ਕੋਡਿੰਗ' },
    stem: {
      en: 'Street addresses are converted into map coordinates so that they can be plotted as points in GIS. Which process is this?',
      hi: 'सड़क पतों को मानचित्र निर्देशांकों में बदला जाता है ताकि उन्हें भौगोलिक सूचना प्रणाली में बिंदुओं के रूप में दिखाया जा सके। यह कौन-सी प्रक्रिया है?',
      pa: 'ਗਲੀ-ਪਤਿਆਂ ਨੂੰ ਨਕਸ਼ਾ ਕੋਆਰਡੀਨੇਟਾਂ ਵਿੱਚ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ ਤਾਂ ਜੋ ਉਨ੍ਹਾਂ ਨੂੰ ਭੂਗੋਲਿਕ ਜਾਣਕਾਰੀ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਬਿੰਦੂਆਂ ਵਜੋਂ ਦਿਖਾਇਆ ਜਾ ਸਕੇ। ਇਹ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੈ?'
    },
    relation: {
      en: 'converting address descriptions into geographic coordinates',
      hi: 'पते के विवरण को भौगोलिक निर्देशांकों में बदलना',
      pa: 'ਪਤੇ ਦੇ ਵੇਰਵੇ ਨੂੰ ਭੂਗੋਲਿਕ ਕੋਆਰਡੀਨੇਟਾਂ ਵਿੱਚ ਬਦਲਣਾ'
    },
    sourceIds: ['NCERT-GEOT-TECH'], difficulty: 'Medium'
  }
];

const qlIds = ['WGE-001-CP043-QL-AUDIT-DIRECT-V1', 'WGE-001-CP043-QL-AUDIT-MATCH-V1'] as const;
const matchStem: LocalizedValue = {
  en: 'Which GIS or remote-sensing concept is correctly matched with its description?',
  hi: 'भौगोलिक सूचना प्रणाली या सुदूर-संवेदन की कौन-सी अवधारणा अपने विवरण से सही सुमेलित है?',
  pa: 'ਭੂਗੋਲਿਕ ਜਾਣਕਾਰੀ ਪ੍ਰਣਾਲੀ ਜਾਂ ਦੂਰ-ਸੰਵੇਦਨ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'
};

function optionFacts(target: GisFact): readonly GisFact[] {
  const index = FACTS.findIndex(f => f.key === target.key);
  if (index < 0) throw new Error('Unknown CP043 audit fact');
  return [target, FACTS[(index + 1) % FACTS.length]!, FACTS[(index + 3) % FACTS.length]!, FACTS[(index + 5) % FACTS.length]!];
}

function orderFor(target: GisFact, family: string) {
  return deterministicShuffle([0, 1, 2, 3], `WGE-001-CP043:${target.key}:${family}`);
}

function makeDirect(target: GisFact): WorldGeographyQuestion {
  const rows = optionFacts(target);
  const order = orderFor(target, 'direct');
  const options = (language: Language) => order.map(i => rows[i]!.label[language]);
  return {
    id: `WGE-001-CP043-Q-VP-AUDIT-DIRECT-${target.key}`.toUpperCase(),
    cpId: 'WGE-001-CP043',
    objective: `audit-variable-direct-${target.key}`,
    difficulty: target.difficulty,
    sourceIds: [...target.sourceIds],
    correctIndex: order.indexOf(0),
    authoringReviewApproved: false,
    generationSource: 'WGE-001-CP043-AUDIT-WAVE-D3-V1',
    qlId: qlIds[0],
    locales: {
      en: { stem: target.stem.en, options: options('en'), explanation: `${target.label.en}: ${target.relation.en}.` },
      hi: { stem: target.stem.hi, options: options('hi'), explanation: `${target.label.hi}: ${target.relation.hi}।` },
      pa: { stem: target.stem.pa, options: options('pa'), explanation: `${target.label.pa}: ${target.relation.pa}।` },
    },
  };
}

function makeMatch(target: GisFact): WorldGeographyQuestion {
  const rows = optionFacts(target);
  const pairs = (language: Language) => [
    `${rows[0]!.label[language]} — ${rows[0]!.relation[language]}`,
    `${rows[1]!.label[language]} — ${rows[2]!.relation[language]}`,
    `${rows[2]!.label[language]} — ${rows[3]!.relation[language]}`,
    `${rows[3]!.label[language]} — ${rows[1]!.relation[language]}`,
  ];
  const order = orderFor(target, 'match');
  const options = (language: Language) => {
    const values = pairs(language);
    return order.map(i => values[i]!);
  };
  const difficulty: Difficulty = target.difficulty === 'Easy' ? 'Medium' : 'Hard';
  return {
    id: `WGE-001-CP043-Q-VP-AUDIT-MATCH-${target.key}`.toUpperCase(),
    cpId: 'WGE-001-CP043',
    objective: `audit-variable-match-${target.key}`,
    difficulty,
    sourceIds: [...new Set(rows.flatMap(f => f.sourceIds))],
    correctIndex: order.indexOf(0),
    authoringReviewApproved: false,
    generationSource: 'WGE-001-CP043-AUDIT-WAVE-D3-V1',
    qlId: qlIds[1],
    locales: {
      en: { stem: matchStem.en, options: options('en'), explanation: `Correct relation: ${target.label.en} — ${target.relation.en}.` },
      hi: { stem: matchStem.hi, options: options('hi'), explanation: `सही संबंध: ${target.label.hi} — ${target.relation.hi}।` },
      pa: { stem: matchStem.pa, options: options('pa'), explanation: `ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।` },
    },
  };
}

export const WGE_AUDIT_D3_VARIABLE_POOL_QUESTIONS_V1: readonly WorldGeographyQuestion[] =
  Object.freeze(FACTS.flatMap(f => [makeDirect(f), makeMatch(f)]));

export const WGE_AUDIT_D3_VARIABLE_POOL_QL_IDS_V1: readonly string[] =
  Object.freeze([...qlIds]);
