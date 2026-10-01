import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language = 'en' | 'hi' | 'pa';
type LocalizedValue = Record<Language, string>;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type AuditFact = {
  cpId: 'WGE-001-CP032' | 'WGE-001-CP033' | 'WGE-001-CP034' | 'WGE-001-CP035' | 'WGE-001-CP036';
  key: string;
  label: LocalizedValue;
  stem: LocalizedValue;
  relation: LocalizedValue;
  sourceIds: readonly string[];
  difficulty: Difficulty;
};

const FACTS: readonly AuditFact[] = [
  // CP032 — Population and migration
  {
    cpId: 'WGE-001-CP032', key: 'physiological-density',
    label: { en: 'Physiological density', hi: 'कायिक जनसंख्या घनत्व', pa: 'ਕਾਇਕ ਆਬਾਦੀ ਘਣਤਾ' },
    stem: {
      en: 'Which density measure compares the total population with the amount of arable land?',
      hi: 'कौन-सा घनत्व माप कुल जनसंख्या की तुलना कृषि योग्य भूमि के क्षेत्रफल से करता है?',
      pa: 'ਕਿਹੜਾ ਘਣਤਾ ਮਾਪ ਕੁੱਲ ਆਬਾਦੀ ਦੀ ਤੁਲਨਾ ਖੇਤੀਯੋਗ ਜ਼ਮੀਨ ਦੇ ਖੇਤਰਫਲ ਨਾਲ ਕਰਦਾ ਹੈ?'
    },
    relation: {
      en: 'population per unit of arable land',
      hi: 'कृषि योग्य भूमि की प्रति इकाई जनसंख्या',
      pa: 'ਖੇਤੀਯੋਗ ਜ਼ਮੀਨ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਆਬਾਦੀ'
    },
    sourceIds: ['WGE-POP-NCERT'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP032', key: 'international-migration',
    label: { en: 'International migration', hi: 'अंतरराष्ट्रीय प्रवासन', pa: 'ਅੰਤਰਰਾਸ਼ਟਰੀ ਪ੍ਰਵਾਸ' },
    stem: {
      en: 'A person changes usual residence from one country to another. Which type of migration is this?',
      hi: 'कोई व्यक्ति अपना सामान्य निवास एक देश से दूसरे देश में बदलता है। यह किस प्रकार का प्रवासन है?',
      pa: 'ਕੋਈ ਵਿਅਕਤੀ ਆਪਣਾ ਆਮ ਨਿਵਾਸ ਇੱਕ ਦੇਸ਼ ਤੋਂ ਦੂਜੇ ਦੇਸ਼ ਵਿੱਚ ਬਦਲਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਪ੍ਰਵਾਸ ਹੈ?'
    },
    relation: {
      en: 'movement that crosses an international boundary to change usual residence',
      hi: 'सामान्य निवास बदलने के लिए अंतरराष्ट्रीय सीमा पार करना',
      pa: 'ਆਮ ਨਿਵਾਸ ਬਦਲਣ ਲਈ ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਰਹੱਦ ਪਾਰ ਕਰਨਾ'
    },
    sourceIds: ['WGE-POP-IOM'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP032', key: 'internal-displacement',
    label: { en: 'Internal displacement', hi: 'आंतरिक विस्थापन', pa: 'ਅੰਦਰੂਨੀ ਵਿਸਥਾਪਨ' },
    stem: {
      en: 'People are forced to leave their homes by conflict but remain within their own country. Which term applies?',
      hi: 'संघर्ष के कारण लोगों को अपने घर छोड़ने पड़ते हैं, पर वे अपने ही देश की सीमा के भीतर रहते हैं। इस स्थिति के लिए कौन-सा पद सही है?',
      pa: 'ਟਕਰਾਅ ਕਾਰਨ ਲੋਕਾਂ ਨੂੰ ਆਪਣੇ ਘਰ ਛੱਡਣੇ ਪੈਂਦੇ ਹਨ, ਪਰ ਉਹ ਆਪਣੇ ਹੀ ਦੇਸ਼ ਦੀ ਸਰਹੱਦ ਅੰਦਰ ਰਹਿੰਦੇ ਹਨ। ਇਸ ਹਾਲਤ ਲਈ ਕਿਹੜਾ ਸ਼ਬਦ ਠੀਕ ਹੈ?'
    },
    relation: {
      en: 'forced movement without crossing an international border',
      hi: 'अंतरराष्ट्रीय सीमा पार किए बिना मजबूरन स्थान बदलना',
      pa: 'ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਰਹੱਦ ਪਾਰ ਕੀਤੇ ਬਿਨਾਂ ਮਜਬੂਰੀ ਵਿੱਚ ਥਾਂ ਬਦਲਣਾ'
    },
    sourceIds: ['WGE-POP-IOM'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP032', key: 'remittance',
    label: { en: 'Remittance', hi: 'प्रेषित धन', pa: 'ਘਰ ਭੇਜੀ ਕਮਾਈ' },
    stem: {
      en: 'A migrant worker sends part of earnings back to the household in the place of origin. What is this transfer called?',
      hi: 'एक प्रवासी श्रमिक अपनी कमाई का कुछ भाग मूल स्थान पर रहने वाले परिवार को भेजता है। इस धन-हस्तांतरण को क्या कहा जाता है?',
      pa: 'ਇੱਕ ਪ੍ਰਵਾਸੀ ਮਜ਼ਦੂਰ ਆਪਣੀ ਕਮਾਈ ਦਾ ਕੁਝ ਹਿੱਸਾ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿੰਦੇ ਪਰਿਵਾਰ ਨੂੰ ਭੇਜਦਾ ਹੈ। ਇਸ ਪੈਸੇ ਦੀ ਭੇਜਤ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'money sent by a migrant to people in the place of origin',
      hi: 'प्रवासी द्वारा मूल स्थान पर लोगों को भेजा गया धन',
      pa: 'ਪ੍ਰਵਾਸੀ ਵੱਲੋਂ ਮੂਲ ਥਾਂ ਉੱਤੇ ਲੋਕਾਂ ਨੂੰ ਭੇਜਿਆ ਗਿਆ ਪੈਸਾ'
    },
    sourceIds: ['WGE-POP-IOM'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP032', key: 'demographic-dividend',
    label: { en: 'Demographic dividend', hi: 'जनसांख्यिकीय लाभांश', pa: 'ਜਨਸਾਂਖਿਆਕੀ ਲਾਭਾਂਸ਼' },
    stem: {
      en: 'A country has a rising share of working-age people relative to dependants. Which potential economic advantage can this age structure create?',
      hi: 'किसी देश में आश्रित जनसंख्या की तुलना में कार्यशील आयु वर्ग का हिस्सा बढ़ रहा है। यह आयु-संरचना कौन-सा संभावित आर्थिक लाभ पैदा कर सकती है?',
      pa: 'ਕਿਸੇ ਦੇਸ਼ ਵਿੱਚ ਆਸ਼੍ਰਿਤ ਆਬਾਦੀ ਦੇ ਮੁਕਾਬਲੇ ਕੰਮਕਾਜੀ ਉਮਰ ਵਾਲੇ ਲੋਕਾਂ ਦਾ ਹਿੱਸਾ ਵੱਧ ਰਿਹਾ ਹੈ। ਇਹ ਉਮਰ-ਬਣਤਰ ਕਿਹੜਾ ਸੰਭਾਵੀ ਆਰਥਿਕ ਲਾਭ ਪੈਦਾ ਕਰ ਸਕਦੀ ਹੈ?'
    },
    relation: {
      en: 'potential growth benefit from a relatively large working-age population',
      hi: 'तुलनात्मक रूप से बड़ी कार्यशील आयु जनसंख्या से मिलने वाला संभावित विकास लाभ',
      pa: 'ਤੁਲਨਾਤਮਕ ਤੌਰ ਉੱਤੇ ਵੱਡੀ ਕੰਮਕਾਜੀ ਉਮਰ ਦੀ ਆਬਾਦੀ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਸੰਭਾਵੀ ਵਿਕਾਸ ਲਾਭ'
    },
    sourceIds: ['WGE-POP-UN-DESA', 'WGE-POP-NCERT'], difficulty: 'Hard'
  },
  {
    cpId: 'WGE-001-CP032', key: 'population-momentum',
    label: { en: 'Population momentum', hi: 'जनसंख्या संवेग', pa: 'ਆਬਾਦੀ ਸੰਵੇਗ' },
    stem: {
      en: 'Birth rates fall to around replacement level, yet total population keeps growing for some time because many people are entering reproductive ages. What explains this?',
      hi: 'जन्म दर लगभग प्रतिस्थापन स्तर तक गिर जाती है, फिर भी बड़ी युवा आबादी के प्रजनन आयु में प्रवेश करने के कारण कुल जनसंख्या कुछ समय तक बढ़ती रहती है। इसे क्या समझाता है?',
      pa: 'ਜਨਮ ਦਰ ਲਗਭਗ ਬਦਲੀ-ਪੱਧਰ ਤੱਕ ਘਟ ਜਾਂਦੀ ਹੈ, ਫਿਰ ਵੀ ਵੱਡੀ ਨੌਜਵਾਨ ਆਬਾਦੀ ਦੇ ਪ੍ਰਜਨਨ ਉਮਰ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਕਾਰਨ ਕੁੱਲ ਆਬਾਦੀ ਕੁਝ ਸਮਾਂ ਵਧਦੀ ਰਹਿੰਦੀ ਹੈ। ਇਸ ਨੂੰ ਕੀ ਸਮਝਾਉਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'continued growth caused by a youthful age structure even after fertility falls',
      hi: 'प्रजनन दर घटने के बाद भी युवा आयु-संरचना के कारण जारी जनसंख्या वृद्धि',
      pa: 'ਜਨਨ ਦਰ ਘਟਣ ਤੋਂ ਬਾਅਦ ਵੀ ਨੌਜਵਾਨ ਉਮਰ-ਬਣਤਰ ਕਾਰਨ ਜਾਰੀ ਆਬਾਦੀ ਵਾਧਾ'
    },
    sourceIds: ['WGE-POP-UN-DESA'], difficulty: 'Hard'
  },

  // CP033 — Settlements and urban geography
  {
    cpId: 'WGE-001-CP033', key: 'dispersed-settlement',
    label: { en: 'Dispersed settlement', hi: 'प्रकीर्ण बस्ती', pa: 'ਖਿਲਰੀ ਬਸਤੀ' },
    stem: {
      en: 'Farmhouses are widely separated across the countryside rather than grouped into a compact village. Which settlement pattern is this?',
      hi: 'ग्रामीण क्षेत्र में मकान सघन गाँव में समूहित होने के बजाय दूर-दूर फैले हैं। यह कौन-सा बस्ती प्रतिरूप है?',
      pa: 'ਪਿੰਡੂ ਖੇਤਰ ਵਿੱਚ ਘਰ ਸੰਘਣੇ ਪਿੰਡ ਵਿੱਚ ਇਕੱਠੇ ਹੋਣ ਦੀ ਬਜਾਏ ਦੂਰ-ਦੂਰ ਫੈਲੇ ਹਨ। ਇਹ ਕਿਹੜਾ ਬਸਤੀ ਪੈਟਰਨ ਹੈ?'
    },
    relation: {
      en: 'dwellings spread widely rather than clustered together',
      hi: 'मकानों का समूहित होने के बजाय दूर-दूर फैला होना',
      pa: 'ਘਰਾਂ ਦਾ ਇਕੱਠੇ ਹੋਣ ਦੀ ਬਜਾਏ ਦੂਰ-ਦੂਰ ਫੈਲਿਆ ਹੋਣਾ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP033', key: 'central-business-district',
    label: { en: 'Central business district', hi: 'केंद्रीय व्यापारिक क्षेत्र', pa: 'ਕੇਂਦਰੀ ਵਪਾਰਿਕ ਖੇਤਰ' },
    stem: {
      en: 'Which urban zone typically contains a strong concentration of offices, shops and commercial services near the city centre?',
      hi: 'शहर के केंद्र के पास कार्यालयों, दुकानों और व्यावसायिक सेवाओं की अधिक सघनता वाला क्षेत्र सामान्यतः क्या कहलाता है?',
      pa: 'ਸ਼ਹਿਰ ਦੇ ਕੇਂਦਰ ਕੋਲ ਦਫ਼ਤਰਾਂ, ਦੁਕਾਨਾਂ ਅਤੇ ਵਪਾਰਿਕ ਸੇਵਾਵਾਂ ਦੀ ਵੱਧ ਸੰਘਣਤਾ ਵਾਲਾ ਖੇਤਰ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਕਹਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'the central concentration of commercial and office functions',
      hi: 'व्यापार और कार्यालय कार्यों का केंद्रीय संकेंद्रण',
      pa: 'ਵਪਾਰ ਅਤੇ ਦਫ਼ਤਰੀ ਕੰਮਾਂ ਦਾ ਕੇਂਦਰੀ ਇਕੱਠ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP033', key: 'peri-urban-zone',
    label: { en: 'Peri-urban zone', hi: 'परि-नगरीय क्षेत्र', pa: 'ਸ਼ਹਿਰ-ਕਿਨਾਰੇ ਦਾ ਬਦਲਦਾ ਖੇਤਰ' },
    stem: {
      en: 'At a city’s edge, farmland, housing, warehouses and new roads are mixed together and land use is changing rapidly. Which zone is this?',
      hi: 'शहर के किनारे खेती की भूमि, आवास, गोदाम और नई सड़कें साथ-साथ हैं तथा भूमि उपयोग तेजी से बदल रहा है। यह कौन-सा क्षेत्र है?',
      pa: 'ਸ਼ਹਿਰ ਦੇ ਕਿਨਾਰੇ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ, ਰਿਹਾਇਸ਼, ਗੋਦਾਮ ਅਤੇ ਨਵੀਆਂ ਸੜਕਾਂ ਇਕੱਠੀਆਂ ਹਨ ਅਤੇ ਜ਼ਮੀਨੀ ਵਰਤੋਂ ਤੇਜ਼ੀ ਨਾਲ ਬਦਲ ਰਹੀ ਹੈ। ਇਹ ਕਿਹੜਾ ਖੇਤਰ ਹੈ?'
    },
    relation: {
      en: 'a transition zone where rural and urban land uses mix',
      hi: 'संक्रमण क्षेत्र जहाँ ग्रामीण और नगरीय भूमि उपयोग मिलते हैं',
      pa: 'ਬਦਲਾਅ ਵਾਲਾ ਖੇਤਰ ਜਿੱਥੇ ਪਿੰਡੂ ਅਤੇ ਸ਼ਹਿਰੀ ਜ਼ਮੀਨੀ ਵਰਤੋਂ ਮਿਲਦੀ ਹੈ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP033', key: 'commuter-belt',
    label: { en: 'Commuter belt', hi: 'दैनिक आवागमन पट्टी', pa: 'ਰੋਜ਼ਾਨਾ ਆਵਾਜਾਈ ਪੱਟੀ' },
    stem: {
      en: 'Many residents live outside a major city but travel into it regularly for work. What is the surrounding residential zone commonly called?',
      hi: 'बहुत से लोग बड़े शहर के बाहर रहते हैं, पर काम के लिए नियमित रूप से शहर आते-जाते हैं। आसपास के इस आवासीय क्षेत्र को सामान्यतः क्या कहा जाता है?',
      pa: 'ਬਹੁਤ ਸਾਰੇ ਲੋਕ ਵੱਡੇ ਸ਼ਹਿਰ ਤੋਂ ਬਾਹਰ ਰਹਿੰਦੇ ਹਨ ਪਰ ਕੰਮ ਲਈ ਨਿਯਮਿਤ ਤੌਰ ਉੱਤੇ ਸ਼ਹਿਰ ਆਉਂਦੇ-ਜਾਂਦੇ ਹਨ। ਆਲੇ-ਦੁਆਲੇ ਦੇ ਇਸ ਰਿਹਾਇਸ਼ੀ ਖੇਤਰ ਨੂੰ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'an outer residential area linked to a city by regular commuting',
      hi: 'नियमित दैनिक आवागमन से शहर से जुड़ा बाहरी आवासीय क्षेत्र',
      pa: 'ਨਿਯਮਿਤ ਰੋਜ਼ਾਨਾ ਆਵਾਜਾਈ ਰਾਹੀਂ ਸ਼ਹਿਰ ਨਾਲ ਜੁੜਿਆ ਬਾਹਰੀ ਰਿਹਾਇਸ਼ੀ ਖੇਤਰ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP033', key: 'settlement-hierarchy',
    label: { en: 'Settlement hierarchy', hi: 'बस्ती पदानुक्रम', pa: 'ਬਸਤੀ ਪਦਾਨੁਕ੍ਰਮ' },
    stem: {
      en: 'Villages, towns and cities are arranged by increasing size and range of services. Which concept describes this ordering?',
      hi: 'गाँवों, कस्बों और शहरों को बढ़ते आकार और सेवाओं की सीमा के अनुसार क्रम में रखा जाता है। यह कौन-सी अवधारणा है?',
      pa: 'ਪਿੰਡਾਂ, ਕਸਬਿਆਂ ਅਤੇ ਸ਼ਹਿਰਾਂ ਨੂੰ ਵੱਧਦੇ ਆਕਾਰ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਪਹੁੰਚ ਦੇ ਅਨੁਸਾਰ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਧਾਰਣਾ ਹੈ?'
    },
    relation: {
      en: 'ordering settlements by size, functions and service range',
      hi: 'बस्तियों को आकार, कार्य और सेवा-क्षेत्र के अनुसार क्रमबद्ध करना',
      pa: 'ਬਸਤੀਆਂ ਨੂੰ ਆਕਾਰ, ਕੰਮ ਅਤੇ ਸੇਵਾ-ਖੇਤਰ ਦੇ ਅਨੁਸਾਰ ਕ੍ਰਮਬੱਧ ਕਰਨਾ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP033', key: 'urban-heat-island',
    label: { en: 'Urban heat island', hi: 'नगरीय ऊष्मा द्वीप', pa: 'ਸ਼ਹਿਰੀ ਤਾਪ ਟਾਪੂ' },
    stem: {
      en: 'At night, a dense built-up city centre remains warmer than nearby rural surroundings. Which urban-climate effect does this describe?',
      hi: 'रात में घना निर्मित शहरी केंद्र आसपास के ग्रामीण क्षेत्र से अधिक गर्म रहता है। यह कौन-सा नगरीय जलवायु प्रभाव है?',
      pa: 'ਰਾਤ ਨੂੰ ਘਣਾ ਬਣਿਆ ਸ਼ਹਿਰੀ ਕੇਂਦਰ ਨੇੜਲੇ ਪਿੰਡੂ ਖੇਤਰ ਨਾਲੋਂ ਵੱਧ ਗਰਮ ਰਹਿੰਦਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਸ਼ਹਿਰੀ ਜਲਵਾਯੂ ਪ੍ਰਭਾਵ ਹੈ?'
    },
    relation: {
      en: 'built-up urban areas remaining warmer than nearby rural areas',
      hi: 'निर्मित नगरीय क्षेत्र का पास के ग्रामीण क्षेत्र से अधिक गर्म रहना',
      pa: 'ਬਣੇ ਹੋਏ ਸ਼ਹਿਰੀ ਖੇਤਰ ਦਾ ਨੇੜਲੇ ਪਿੰਡੂ ਖੇਤਰ ਨਾਲੋਂ ਵੱਧ ਗਰਮ ਰਹਿਣਾ'
    },
    sourceIds: ['WGE-SET-UNHABITAT'], difficulty: 'Medium'
  },

  // CP034 — World agriculture and livestock
  {
    cpId: 'WGE-001-CP034', key: 'shifting-cultivation',
    label: { en: 'Shifting cultivation', hi: 'स्थानांतरी कृषि', pa: 'ਥਾਂ-ਬਦਲ ਖੇਤੀ' },
    stem: {
      en: 'A small plot is cultivated for a few years and then left fallow while cultivation moves to another plot. Which farming system is this?',
      hi: 'एक छोटे खेत पर कुछ वर्षों तक खेती की जाती है, फिर उसे परती छोड़कर खेती दूसरे खेत में स्थानांतरित कर दी जाती है। यह कौन-सी कृषि प्रणाली है?',
      pa: 'ਇੱਕ ਛੋਟੇ ਖੇਤ ਉੱਤੇ ਕੁਝ ਸਾਲ ਖੇਤੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ, ਫਿਰ ਉਸ ਨੂੰ ਪਰਤੀ ਛੱਡ ਕੇ ਖੇਤੀ ਦੂਜੇ ਖੇਤ ਵੱਲ ਬਦਲ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਖੇਤੀ ਪ੍ਰਣਾਲੀ ਹੈ?'
    },
    relation: {
      en: 'cultivation moves between plots with a fallow period',
      hi: 'परती अवधि के साथ खेती का अलग-अलग खेतों में स्थानांतरण',
      pa: 'ਪਰਤੀ ਅਵਧੀ ਨਾਲ ਖੇਤੀ ਦਾ ਵੱਖ-ਵੱਖ ਖੇਤਾਂ ਵੱਲ ਬਦਲਣਾ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP034', key: 'terrace-farming',
    label: { en: 'Terrace farming', hi: 'सीढ़ीदार खेती', pa: 'ਪੌੜੀਦਾਰ ਖੇਤੀ' },
    stem: {
      en: 'Farmers cut a steep hillside into a series of level steps to reduce runoff and make cultivation easier. What is this practice called?',
      hi: 'किसान तीखी पहाड़ी ढाल को समतल सीढ़ियों में काटते हैं ताकि अपवाह घटे और खेती आसान हो। इस पद्धति को क्या कहा जाता है?',
      pa: 'ਕਿਸਾਨ ਤੇਜ਼ ਪਹਾੜੀ ਢਲਾਣ ਨੂੰ ਸਮਤਲ ਪੌੜੀਆਂ ਵਿੱਚ ਕੱਟਦੇ ਹਨ ਤਾਂ ਜੋ ਵਹਾਅ ਘਟੇ ਅਤੇ ਖੇਤੀ ਆਸਾਨ ਹੋਵੇ। ਇਸ ਤਰੀਕੇ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'cultivation on step-like level surfaces cut into slopes',
      hi: 'ढालों पर काटकर बनाई गई समतल सीढ़ियों पर खेती',
      pa: 'ਢਲਾਣਾਂ ਵਿੱਚ ਕੱਟ ਕੇ ਬਣਾਈਆਂ ਸਮਤਲ ਪੌੜੀਆਂ ਉੱਤੇ ਖੇਤੀ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP034', key: 'transhumance',
    label: { en: 'Transhumance', hi: 'मौसमी पशु-स्थानांतरण', pa: 'ਮੌਸਮੀ ਪਸ਼ੂ-ਥਾਂ ਬਦਲੀ' },
    stem: {
      en: 'Herders move livestock seasonally between established lowland and highland pastures. Which practice is this?',
      hi: 'पशुपालक पशुओं को ऋतु के अनुसार निश्चित निचले और ऊँचे चरागाहों के बीच ले जाते हैं। यह कौन-सी प्रथा है?',
      pa: 'ਪਸ਼ੂਪਾਲਕ ਪਸ਼ੂਆਂ ਨੂੰ ਮੌਸਮ ਦੇ ਅਨੁਸਾਰ ਨਿਰਧਾਰਤ ਨੀਵੇਂ ਅਤੇ ਉੱਚੇ ਚਰਾਗਾਹਾਂ ਵਿਚਕਾਰ ਲੈ ਜਾਂਦੇ ਹਨ। ਇਹ ਕਿਹੜੀ ਪ੍ਰਥਾ ਹੈ?'
    },
    relation: {
      en: 'seasonal movement of livestock between established grazing areas',
      hi: 'निश्चित चरागाहों के बीच पशुओं का मौसमी स्थानांतरण',
      pa: 'ਨਿਰਧਾਰਤ ਚਰਾਗਾਹਾਂ ਵਿਚਕਾਰ ਪਸ਼ੂਆਂ ਦੀ ਮੌਸਮੀ ਥਾਂ-ਬਦਲੀ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP034', key: 'market-gardening',
    label: { en: 'Market gardening', hi: 'बाजारोन्मुख बागवानी', pa: 'ਬਾਜ਼ਾਰ-ਕੇਂਦਰਿਤ ਬਾਗਬਾਨੀ' },
    stem: {
      en: 'A farm near a large city specialises in fresh vegetables and fruit for rapid sale in the urban market. Which farming type best fits?',
      hi: 'बड़े शहर के पास एक खेत ताजी सब्जियों और फलों का उत्पादन शहरी बाजार में शीघ्र बिक्री के लिए करता है। यह किस प्रकार की खेती है?',
      pa: 'ਵੱਡੇ ਸ਼ਹਿਰ ਕੋਲ ਇੱਕ ਖੇਤ ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ ਅਤੇ ਫਲ ਸ਼ਹਿਰੀ ਬਾਜ਼ਾਰ ਵਿੱਚ ਜਲਦੀ ਵਿਕਰੀ ਲਈ ਉਗਾਉਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਖੇਤੀ ਹੈ?'
    },
    relation: {
      en: 'intensive production of fresh produce for nearby urban markets',
      hi: 'पास के शहरी बाजारों के लिए ताजा उपज का गहन उत्पादन',
      pa: 'ਨੇੜਲੇ ਸ਼ਹਿਰੀ ਬਾਜ਼ਾਰਾਂ ਲਈ ਤਾਜ਼ੀ ਉਪਜ ਦਾ ਗਹਿਰਾ ਉਤਪਾਦਨ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP034', key: 'crop-rotation',
    label: { en: 'Crop rotation', hi: 'फसल चक्र', pa: 'ਫਸਲ ਚੱਕਰ' },
    stem: {
      en: 'Different crops are grown on the same field in a planned sequence over successive seasons. What is this practice called?',
      hi: 'एक ही खेत में अलग-अलग फसलें क्रमबद्ध योजना के अनुसार लगातार मौसमों में उगाई जाती हैं। यह पद्धति क्या कहलाती है?',
      pa: 'ਇੱਕੋ ਖੇਤ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਫਸਲਾਂ ਯੋਜਨਾਬੱਧ ਕ੍ਰਮ ਅਨੁਸਾਰ ਲਗਾਤਾਰ ਮੌਸਮਾਂ ਵਿੱਚ ਉਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇਸ ਤਰੀਕੇ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'growing different crops in a planned sequence on the same land',
      hi: 'एक ही भूमि पर अलग-अलग फसलों को नियोजित क्रम में उगाना',
      pa: 'ਇੱਕੋ ਜ਼ਮੀਨ ਉੱਤੇ ਵੱਖ-ਵੱਖ ਫਸਲਾਂ ਨੂੰ ਯੋਜਨਾਬੱਧ ਕ੍ਰਮ ਵਿੱਚ ਉਗਾਉਣਾ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP034', key: 'monoculture',
    label: { en: 'Monoculture', hi: 'एकल फसल प्रणाली', pa: 'ਇਕ-ਫਸਲੀ ਪ੍ਰਣਾਲੀ' },
    stem: {
      en: 'A very large commercial farm repeatedly grows one crop over an extensive area. Which term describes this system?',
      hi: 'एक बहुत बड़ा व्यावसायिक खेत विस्तृत क्षेत्र में बार-बार एक ही फसल उगाता है। इस प्रणाली को क्या कहा जाता है?',
      pa: 'ਇੱਕ ਬਹੁਤ ਵੱਡਾ ਵਪਾਰਕ ਖੇਤ ਵੱਡੇ ਖੇਤਰ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਇੱਕੋ ਫਸਲ ਉਗਾਉਂਦਾ ਹੈ। ਇਸ ਪ੍ਰਣਾਲੀ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'large-scale cultivation dominated by a single crop',
      hi: 'एक ही फसल प्रधान बड़े पैमाने की खेती',
      pa: 'ਇੱਕੋ ਫਸਲ-ਪ੍ਰਧਾਨ ਵੱਡੇ ਪੱਧਰ ਦੀ ਖੇਤੀ'
    },
    sourceIds: ['WGE-AGR-FAO-SYS'], difficulty: 'Easy'
  },

  // CP035 — Minerals and energy resources
  {
    cpId: 'WGE-001-CP035', key: 'coal-fossil-fuel',
    label: { en: 'Coal', hi: 'कोयला', pa: 'ਕੋਲਾ' },
    stem: {
      en: 'Which energy resource is a solid fossil fuel formed from ancient organic matter and is non-renewable on human timescales?',
      hi: 'कौन-सा ऊर्जा संसाधन प्राचीन जैविक पदार्थ से बना ठोस जीवाश्म ईंधन है और मानव समय-मान पर अनवीकरणीय है?',
      pa: 'ਕਿਹੜਾ ਊਰਜਾ ਸਰੋਤ ਪ੍ਰਾਚੀਨ ਜੈਵਿਕ ਪਦਾਰਥ ਤੋਂ ਬਣਿਆ ਠੋਸ ਜੀਵਾਸ਼ਮ ਇੰਧਨ ਹੈ ਅਤੇ ਮਨੁੱਖੀ ਸਮੇਂ ਦੇ ਪੱਧਰ ਉੱਤੇ ਗੈਰ-ਨਵੀਕਰਣਯੋਗ ਹੈ?'
    },
    relation: {
      en: 'a solid non-renewable fossil fuel',
      hi: 'ठोस अनवीकरणीय जीवाश्म ईंधन',
      pa: 'ਠੋਸ ਗੈਰ-ਨਵੀਕਰਣਯੋਗ ਜੀਵਾਸ਼ਮ ਇੰਧਨ'
    },
    sourceIds: ['WGE-RES-IEA-ENERGY'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP035', key: 'natural-gas',
    label: { en: 'Natural gas', hi: 'प्राकृतिक गैस', pa: 'ਕੁਦਰਤੀ ਗੈਸ' },
    stem: {
      en: 'Which fossil fuel is gaseous under ordinary conditions and is commonly transported by pipeline or as liquefied natural gas?',
      hi: 'कौन-सा जीवाश्म ईंधन सामान्य परिस्थितियों में गैसीय होता है और प्रायः पाइपलाइन या द्रवीकृत प्राकृतिक गैस के रूप में ले जाया जाता है?',
      pa: 'ਕਿਹੜਾ ਜੀਵਾਸ਼ਮ ਇੰਧਨ ਆਮ ਹਾਲਾਤਾਂ ਵਿੱਚ ਗੈਸੀਅਸ ਹੁੰਦਾ ਹੈ ਅਤੇ ਆਮ ਤੌਰ ਉੱਤੇ ਪਾਈਪਲਾਈਨ ਜਾਂ ਤਰਲ ਕੀਤੀ ਕੁਦਰਤੀ ਗੈਸ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਜਾਇਆ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'a gaseous fossil fuel transported by pipeline or in liquefied form',
      hi: 'पाइपलाइन या द्रवीकृत रूप में पहुँचाया जाने वाला गैसीय जीवाश्म ईंधन',
      pa: 'ਪਾਈਪਲਾਈਨ ਜਾਂ ਤਰਲ ਰੂਪ ਵਿੱਚ ਲਿਜਾਇਆ ਜਾਣ ਵਾਲਾ ਗੈਸੀਅਸ ਜੀਵਾਸ਼ਮ ਇੰਧਨ'
    },
    sourceIds: ['WGE-RES-IEA-ENERGY'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP035', key: 'uranium',
    label: { en: 'Uranium', hi: 'यूरेनियम', pa: 'ਯੂਰੇਨੀਅਮ' },
    stem: {
      en: 'Which mined mineral resource is used as fuel in conventional nuclear fission power generation?',
      hi: 'परंपरागत नाभिकीय विखंडन विद्युत उत्पादन में ईंधन के रूप में किस खनिज संसाधन का उपयोग किया जाता है?',
      pa: 'ਰਵਾਇਤੀ ਨਿਊਕਲੀਅਰ ਵਿਖੰਡਨ ਬਿਜਲੀ ਉਤਪਾਦਨ ਵਿੱਚ ਇੰਧਨ ਵਜੋਂ ਕਿਹੜੇ ਖਣਿਜ ਸਰੋਤ ਦੀ ਵਰਤੋਂ ਹੁੰਦੀ ਹੈ?'
    },
    relation: {
      en: 'a mined non-renewable fuel used in nuclear fission',
      hi: 'नाभिकीय विखंडन में प्रयुक्त खनन किया गया अनवीकरणीय ईंधन',
      pa: 'ਨਿਊਕਲੀਅਰ ਵਿਖੰਡਨ ਵਿੱਚ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਖੋਦਿਆ ਗਿਆ ਗੈਰ-ਨਵੀਕਰਣਯੋਗ ਇੰਧਨ'
    },
    sourceIds: ['WGE-RES-USGS-DATA'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP035', key: 'lithium',
    label: { en: 'Lithium', hi: 'लिथियम', pa: 'ਲਿਥੀਅਮ' },
    stem: {
      en: 'Which mineral has become especially important for rechargeable lithium-ion batteries used in electric vehicles and energy storage?',
      hi: 'विद्युत वाहनों और ऊर्जा भंडारण में प्रयुक्त पुनर्भरणीय लिथियम-आयन बैटरियों के लिए कौन-सा खनिज विशेष रूप से महत्वपूर्ण है?',
      pa: 'ਬਿਜਲੀ ਵਾਹਨਾਂ ਅਤੇ ਊਰਜਾ ਸਟੋਰੇਜ ਵਿੱਚ ਵਰਤੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਰੀਚਾਰਜੇਬਲ ਲਿਥੀਅਮ-ਆਇਨ ਬੈਟਰੀਆਂ ਲਈ ਕਿਹੜਾ ਖਣਿਜ ਖਾਸ ਮਹੱਤਵ ਰੱਖਦਾ ਹੈ?'
    },
    relation: {
      en: 'a key mineral input for lithium-ion batteries',
      hi: 'लिथियम-आयन बैटरियों का प्रमुख खनिज इनपुट',
      pa: 'ਲਿਥੀਅਮ-ਆਇਨ ਬੈਟਰੀਆਂ ਲਈ ਮੁੱਖ ਖਣਿਜ ਇਨਪੁੱਟ'
    },
    sourceIds: ['WGE-RES-USGS-MCS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP035', key: 'offshore-wind',
    label: { en: 'Offshore wind energy', hi: 'अपतटीय पवन ऊर्जा', pa: 'ਸਮੁੰਦਰੀ ਤਟ ਤੋਂ ਬਾਹਰ ਪਵਨ ਊਰਜਾ' },
    stem: {
      en: 'Wind turbines are installed in shallow coastal waters where winds are strong and relatively persistent. Which energy resource is being developed?',
      hi: 'उथले तटीय समुद्री जल में जहाँ हवाएँ तेज और अपेक्षाकृत नियमित हैं, पवन टर्बाइन लगाए जाते हैं। यहाँ कौन-सा ऊर्जा संसाधन विकसित किया जा रहा है?',
      pa: 'ਉਥਲੇ ਤਟਵਰਤੀ ਸਮੁੰਦਰੀ ਪਾਣੀ ਵਿੱਚ ਜਿੱਥੇ ਹਵਾਵਾਂ ਤੇਜ਼ ਅਤੇ ਤੁਲਨਾਤਮਕ ਤੌਰ ਉੱਤੇ ਨਿਯਮਿਤ ਹਨ, ਪਵਨ ਟਰਬਾਈਨ ਲਗਾਏ ਜਾਂਦੇ ਹਨ। ਇੱਥੇ ਕਿਹੜਾ ਊਰਜਾ ਸਰੋਤ ਵਿਕਸਿਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ?'
    },
    relation: {
      en: 'wind power generated by turbines located at sea',
      hi: 'समुद्र में स्थित टर्बाइनों से उत्पन्न पवन ऊर्जा',
      pa: 'ਸਮੁੰਦਰ ਵਿੱਚ ਲੱਗੀਆਂ ਟਰਬਾਈਨਾਂ ਤੋਂ ਬਣਾਈ ਪਵਨ ਊਰਜਾ'
    },
    sourceIds: ['WGE-RES-IEA-ENERGY'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP035', key: 'metal-recycling',
    label: { en: 'Metal recycling', hi: 'धातु पुनर्चक्रण', pa: 'ਧਾਤ ਮੁੜ-ਚੱਕਰੀਕਰਨ' },
    stem: {
      en: 'Which strategy can reduce demand for newly mined metal ore by recovering usable metal from discarded products?',
      hi: 'त्यागे गए उत्पादों से उपयोगी धातु वापस प्राप्त करके नए खनिज अयस्क की माँग कम करने वाली रणनीति कौन-सी है?',
      pa: 'ਫੈਂਕੇ ਗਏ ਉਤਪਾਦਾਂ ਤੋਂ ਵਰਤੋਂਯੋਗ ਧਾਤ ਮੁੜ ਪ੍ਰਾਪਤ ਕਰਕੇ ਨਵੇਂ ਖਣਿਜ ਅਯਸਕ ਦੀ ਮੰਗ ਘਟਾਉਣ ਵਾਲੀ ਰਣਨੀਤੀ ਕਿਹੜੀ ਹੈ?'
    },
    relation: {
      en: 'recovering metals from used products to reduce primary extraction',
      hi: 'प्रयुक्त उत्पादों से धातु वापस लेकर प्राथमिक खनन की आवश्यकता कम करना',
      pa: 'ਵਰਤੇ ਉਤਪਾਦਾਂ ਤੋਂ ਧਾਤ ਮੁੜ ਲੈ ਕੇ ਮੁੱਢਲੀ ਖਦਾਨੀ ਦੀ ਲੋੜ ਘਟਾਉਣਾ'
    },
    sourceIds: ['WGE-RES-USGS-DATA'], difficulty: 'Medium'
  },

  // CP036 — Industries and economic regions
  {
    cpId: 'WGE-001-CP036', key: 'agglomeration-economies',
    label: { en: 'Agglomeration economies', hi: 'समूहन अर्थलाभ', pa: 'ਉਦਯੋਗਿਕ ਇਕੱਠ ਦੇ ਲਾਭ' },
    stem: {
      en: 'Several related firms benefit from locating close together because they share suppliers, skilled labour and services. Which concept explains this advantage?',
      hi: 'कई संबंधित उद्योग पास-पास स्थित होकर आपूर्तिकर्ताओं, कुशल श्रम और सेवाओं को साझा करने से लाभ लेते हैं। इस लाभ को कौन-सी अवधारणा समझाती है?',
      pa: 'ਕਈ ਸੰਬੰਧਤ ਉਦਯੋਗ ਨੇੜੇ-ਨੇੜੇ ਸਥਿਤ ਹੋ ਕੇ ਸਪਲਾਇਰਾਂ, ਕੁਸ਼ਲ ਮਜ਼ਦੂਰੀ ਅਤੇ ਸੇਵਾਵਾਂ ਸਾਂਝੀਆਂ ਕਰਨ ਨਾਲ ਲਾਭ ਲੈਂਦੇ ਹਨ। ਇਸ ਲਾਭ ਨੂੰ ਕਿਹੜੀ ਧਾਰਣਾ ਸਮਝਾਉਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'cost or productivity advantages gained by firms clustering together',
      hi: 'उद्योगों के एक साथ समूहित होने से मिलने वाले लागत या उत्पादकता लाभ',
      pa: 'ਉਦਯੋਗਾਂ ਦੇ ਇਕੱਠੇ ਹੋਣ ਨਾਲ ਮਿਲਣ ਵਾਲੇ ਲਾਗਤ ਜਾਂ ਉਤਪਾਦਕਤਾ ਲਾਭ'
    },
    sourceIds: ['WGE-IND-UNIDO-LOCATION'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP036', key: 'deglomeration',
    label: { en: 'Deglomeration', hi: 'विसमूहन', pa: 'ਉਦਯੋਗਿਕ ਵਿਖਰਾਅ' },
    stem: {
      en: 'High land costs, congestion and pollution push some firms away from an overcrowded industrial centre. Which process is occurring?',
      hi: 'ऊँची भूमि लागत, भीड़ और प्रदूषण कुछ उद्योगों को अत्यधिक सघन औद्योगिक केंद्र से बाहर जाने के लिए प्रेरित करते हैं। यह कौन-सी प्रक्रिया है?',
      pa: 'ਉੱਚੀ ਜ਼ਮੀਨ ਲਾਗਤ, ਭੀੜ ਅਤੇ ਪ੍ਰਦੂਸ਼ਣ ਕੁਝ ਉਦਯੋਗਾਂ ਨੂੰ ਬਹੁਤ ਸੰਘਣੇ ਉਦਯੋਗਿਕ ਕੇਂਦਰ ਤੋਂ ਬਾਹਰ ਜਾਣ ਲਈ ਮਜਬੂਰ ਕਰਦੇ ਹਨ। ਇਹ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੈ?'
    },
    relation: {
      en: 'firms moving away when clustering costs outweigh its benefits',
      hi: 'जब समूहन की लागत लाभ से अधिक हो जाए तो उद्योगों का बाहर जाना',
      pa: 'ਜਦੋਂ ਇਕੱਠ ਦੀ ਲਾਗਤ ਲਾਭ ਤੋਂ ਵੱਧ ਹੋ ਜਾਵੇ ਤਾਂ ਉਦਯੋਗਾਂ ਦਾ ਬਾਹਰ ਜਾਣਾ'
    },
    sourceIds: ['WGE-IND-UNIDO-LOCATION'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP036', key: 'backward-linkage',
    label: { en: 'Backward linkage', hi: 'पश्च संबंध', pa: 'ਪਿੱਛਲਾ ਉਦਯੋਗਿਕ ਜੋੜ' },
    stem: {
      en: 'A car factory creates demand for nearby firms making tyres, glass and components. Which industrial linkage does this illustrate?',
      hi: 'एक कार कारखाना टायर, काँच और पुर्जे बनाने वाली आसपास की इकाइयों की माँग पैदा करता है। यह कौन-सा औद्योगिक संबंध दिखाता है?',
      pa: 'ਇੱਕ ਕਾਰ ਫੈਕਟਰੀ ਟਾਇਰ, ਕੱਚ ਅਤੇ ਪੁਰਜ਼ੇ ਬਣਾਉਣ ਵਾਲੀਆਂ ਨੇੜਲੀਆਂ ਇਕਾਈਆਂ ਲਈ ਮੰਗ ਪੈਦਾ ਕਰਦੀ ਹੈ। ਇਹ ਕਿਹੜਾ ਉਦਯੋਗਿਕ ਜੋੜ ਦਰਸਾਉਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'demand created for firms supplying inputs to an industry',
      hi: 'किसी उद्योग को इनपुट देने वाली इकाइयों के लिए उत्पन्न माँग',
      pa: 'ਕਿਸੇ ਉਦਯੋਗ ਨੂੰ ਇਨਪੁੱਟ ਦੇਣ ਵਾਲੀਆਂ ਇਕਾਈਆਂ ਲਈ ਪੈਦਾ ਹੋਈ ਮੰਗ'
    },
    sourceIds: ['WGE-IND-UNIDO-LOCATION'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP036', key: 'forward-linkage',
    label: { en: 'Forward linkage', hi: 'अग्र संबंध', pa: 'ਅੱਗਲਾ ਉਦਯੋਗਿਕ ਜੋੜ' },
    stem: {
      en: 'A steel plant supports downstream factories that use steel to manufacture machinery and vehicles. Which industrial linkage is this?',
      hi: 'एक इस्पात संयंत्र उन आगे की इकाइयों को सहारा देता है जो इस्पात से मशीनरी और वाहन बनाती हैं। यह कौन-सा औद्योगिक संबंध है?',
      pa: 'ਇੱਕ ਸਟੀਲ ਪਲਾਂਟ ਉਹਨਾਂ ਅੱਗੇ ਵਾਲੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਸਹਾਰਾ ਦਿੰਦਾ ਹੈ ਜੋ ਸਟੀਲ ਤੋਂ ਮਸ਼ੀਨਰੀ ਅਤੇ ਵਾਹਨ ਬਣਾਉਂਦੀਆਂ ਹਨ। ਇਹ ਕਿਹੜਾ ਉਦਯੋਗਿਕ ਜੋੜ ਹੈ?'
    },
    relation: {
      en: 'connections to industries that use an output as their input',
      hi: 'उत्पाद को अपने इनपुट के रूप में उपयोग करने वाले आगे के उद्योगों से संबंध',
      pa: 'ਉਤਪਾਦ ਨੂੰ ਆਪਣੇ ਇਨਪੁੱਟ ਵਜੋਂ ਵਰਤਣ ਵਾਲੇ ਅੱਗੇ ਦੇ ਉਦਯੋਗਾਂ ਨਾਲ ਸੰਬੰਧ'
    },
    sourceIds: ['WGE-IND-UNIDO-LOCATION'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP036', key: 'industrial-inertia',
    label: { en: 'Industrial inertia', hi: 'औद्योगिक जड़त्व', pa: 'ਉਦਯੋਗਿਕ ਜੜਤਾ' },
    stem: {
      en: 'An old industrial centre remains important even after its original raw-material advantage has weakened because skills, infrastructure and supplier networks are already established. Which concept explains this?',
      hi: 'मूल कच्चे माल का लाभ घटने के बाद भी पुराना औद्योगिक केंद्र महत्वपूर्ण बना रहता है क्योंकि कौशल, आधारभूत संरचना और आपूर्तिकर्ता नेटवर्क पहले से मौजूद हैं। इसे कौन-सी अवधारणा समझाती है?',
      pa: 'ਮੂਲ ਕੱਚੇ ਮਾਲ ਦਾ ਲਾਭ ਘਟਣ ਤੋਂ ਬਾਅਦ ਵੀ ਪੁਰਾਣਾ ਉਦਯੋਗਿਕ ਕੇਂਦਰ ਮਹੱਤਵਪੂਰਨ ਰਹਿੰਦਾ ਹੈ ਕਿਉਂਕਿ ਹੁਨਰ, ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਅਤੇ ਸਪਲਾਇਰ ਜਾਲ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਹਨ। ਇਸ ਨੂੰ ਕਿਹੜੀ ਧਾਰਣਾ ਸਮਝਾਉਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'continued industrial location because established advantages persist',
      hi: 'स्थापित लाभ बने रहने के कारण उद्योग का पुराने स्थान पर टिके रहना',
      pa: 'ਸਥਾਪਿਤ ਲਾਭ ਕਾਇਮ ਰਹਿਣ ਕਾਰਨ ਉਦਯੋਗ ਦਾ ਪੁਰਾਣੇ ਸਥਾਨ ਉੱਤੇ ਬਣਿਆ ਰਹਿਣਾ'
    },
    sourceIds: ['WGE-IND-UNIDO-LOCATION'], difficulty: 'Hard'
  },
  {
    cpId: 'WGE-001-CP036', key: 'global-value-chain-stage',
    label: { en: 'Global value chain', hi: 'वैश्विक मूल्य शृंखला', pa: 'ਵਿਸ਼ਵ ਮੁੱਲ ਲੜੀ' },
    stem: {
      en: 'A product is designed in one country, assembled in another and marketed from a third. Which production pattern does this illustrate?',
      hi: 'किसी उत्पाद की रूपरेखा एक देश में बनती है, संयोजन दूसरे देश में होता है और विपणन तीसरे देश से किया जाता है। यह कौन-सा उत्पादन प्रतिरूप है?',
      pa: 'ਕਿਸੇ ਉਤਪਾਦ ਦੀ ਡਿਜ਼ਾਇਨ ਇੱਕ ਦੇਸ਼ ਵਿੱਚ ਬਣਦੀ ਹੈ, ਜੋੜਾਈ ਦੂਜੇ ਦੇਸ਼ ਵਿੱਚ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮਾਰਕੀਟਿੰਗ ਤੀਜੇ ਦੇਸ਼ ਤੋਂ ਹੁੰਦੀ ਹੈ। ਇਹ ਕਿਹੜਾ ਉਤਪਾਦਨ ਪੈਟਰਨ ਹੈ?'
    },
    relation: {
      en: 'different stages of production distributed across multiple countries',
      hi: 'उत्पादन के अलग-अलग चरणों का कई देशों में विभाजन',
      pa: 'ਉਤਪਾਦਨ ਦੇ ਵੱਖ-ਵੱਖ ਪੜਾਅ ਕਈ ਦੇਸ਼ਾਂ ਵਿੱਚ ਵੰਡੇ ਹੋਏ'
    },
    sourceIds: ['WGE-IND-WB-GVC'], difficulty: 'Medium'
  }
];

const QL_IDS: Readonly<Record<AuditFact['cpId'], readonly [string, string]>> = {
  'WGE-001-CP032': ['WGE-001-CP032-QL-AUDIT-DIRECT-V1', 'WGE-001-CP032-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP033': ['WGE-001-CP033-QL-AUDIT-DIRECT-V1', 'WGE-001-CP033-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP034': ['WGE-001-CP034-QL-AUDIT-DIRECT-V1', 'WGE-001-CP034-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP035': ['WGE-001-CP035-QL-AUDIT-DIRECT-V1', 'WGE-001-CP035-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP036': ['WGE-001-CP036-QL-AUDIT-DIRECT-V1', 'WGE-001-CP036-QL-AUDIT-MATCH-V1'],
};

const MATCH_STEMS: Readonly<Record<AuditFact['cpId'], LocalizedValue>> = {
  'WGE-001-CP032': { en: 'Which population or migration concept is correctly matched with its description?', hi: 'जनसंख्या या प्रवासन की कौन-सी अवधारणा अपने विवरण से सही सुमेलित है?', pa: 'ਆਬਾਦੀ ਜਾਂ ਪ੍ਰਵਾਸ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?' },
  'WGE-001-CP033': { en: 'Which settlement or urban-geography concept is correctly matched?', hi: 'बस्ती या नगरीय भूगोल की कौन-सी अवधारणा सही सुमेलित है?', pa: 'ਬਸਤੀ ਜਾਂ ਸ਼ਹਿਰੀ ਭੂਗੋਲ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?' },
  'WGE-001-CP034': { en: 'Which farming concept is correctly matched with its description?', hi: 'कृषि की कौन-सी अवधारणा अपने विवरण से सही सुमेलित है?', pa: 'ਖੇਤੀ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?' },
  'WGE-001-CP035': { en: 'Which mineral or energy-resource term is correctly matched?', hi: 'खनिज या ऊर्जा-संसाधन का कौन-सा पद सही सुमेलित है?', pa: 'ਖਣਿਜ ਜਾਂ ਊਰਜਾ-ਸਰੋਤ ਦਾ ਕਿਹੜਾ ਸ਼ਬਦ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?' },
  'WGE-001-CP036': { en: 'Which industrial-geography concept is correctly matched?', hi: 'औद्योगिक भूगोल की कौन-सी अवधारणा सही सुमेलित है?', pa: 'ਉਦਯੋਗਿਕ ਭੂਗੋਲ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?' },
};

const cpFacts = (cpId: AuditFact['cpId']) => FACTS.filter(f => f.cpId === cpId);

function optionFacts(target: AuditFact): readonly AuditFact[] {
  const peers = cpFacts(target.cpId);
  const index = peers.findIndex(f => f.key === target.key);
  if (peers.length !== 6 || index < 0) throw new Error(`Expected six audit facts for ${target.cpId}`);
  return [target, peers[(index + 1) % peers.length]!, peers[(index + 3) % peers.length]!, peers[(index + 5) % peers.length]!];
}

function orderFor(target: AuditFact, family: string) {
  return deterministicShuffle([0, 1, 2, 3], `${target.cpId}:${target.key}:${family}`);
}

function makeDirect(target: AuditFact): WorldGeographyQuestion {
  const rows = optionFacts(target);
  const order = orderFor(target, 'direct');
  const options = (language: Language) => order.map(i => rows[i]!.label[language]);
  return {
    id: `${target.cpId}-Q-VP-AUDIT-DIRECT-${target.key}`.toUpperCase(),
    cpId: target.cpId,
    objective: `audit-variable-direct-${target.key}`,
    difficulty: target.difficulty,
    sourceIds: [...target.sourceIds],
    correctIndex: order.indexOf(0),
    authoringReviewApproved: true,
    generationSource: `${target.cpId}-AUDIT-WAVE-D2-V1`,
    qlId: QL_IDS[target.cpId][0],
    locales: {
      en: { stem: target.stem.en, options: options('en'), explanation: `${target.label.en}: ${target.relation.en}.` },
      hi: { stem: target.stem.hi, options: options('hi'), explanation: `${target.label.hi}: ${target.relation.hi}।` },
      pa: { stem: target.stem.pa, options: options('pa'), explanation: `${target.label.pa}: ${target.relation.pa}।` },
    },
  };
}

function makeMatch(target: AuditFact): WorldGeographyQuestion {
  const rows = optionFacts(target);
  const pairValues = (language: Language) => [
    `${rows[0]!.label[language]} — ${rows[0]!.relation[language]}`,
    `${rows[1]!.label[language]} — ${rows[2]!.relation[language]}`,
    `${rows[2]!.label[language]} — ${rows[3]!.relation[language]}`,
    `${rows[3]!.label[language]} — ${rows[1]!.relation[language]}`,
  ];
  const order = orderFor(target, 'match');
  const options = (language: Language) => {
    const pairs = pairValues(language);
    return order.map(i => pairs[i]!);
  };
  const difficulty: Difficulty = target.difficulty === 'Easy' ? 'Medium' : 'Hard';
  return {
    id: `${target.cpId}-Q-VP-AUDIT-MATCH-${target.key}`.toUpperCase(),
    cpId: target.cpId,
    objective: `audit-variable-match-${target.key}`,
    difficulty,
    sourceIds: [...new Set(rows.flatMap(f => f.sourceIds))],
    correctIndex: order.indexOf(0),
    authoringReviewApproved: true,
    generationSource: `${target.cpId}-AUDIT-WAVE-D2-V1`,
    qlId: QL_IDS[target.cpId][1],
    locales: {
      en: { stem: MATCH_STEMS[target.cpId].en, options: options('en'), explanation: `Correct relation: ${target.label.en} — ${target.relation.en}.` },
      hi: { stem: MATCH_STEMS[target.cpId].hi, options: options('hi'), explanation: `सही संबंध: ${target.label.hi} — ${target.relation.hi}।` },
      pa: { stem: MATCH_STEMS[target.cpId].pa, options: options('pa'), explanation: `ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।` },
    },
  };
}

export const WGE_AUDIT_D2_VARIABLE_POOL_QUESTIONS_V1: readonly WorldGeographyQuestion[] =
  Object.freeze(FACTS.flatMap(f => [makeDirect(f), makeMatch(f)]));

export const WGE_AUDIT_D2_VARIABLE_POOL_QL_IDS_V1: readonly string[] =
  Object.freeze(Object.values(QL_IDS).flatMap(ids => [...ids]));
