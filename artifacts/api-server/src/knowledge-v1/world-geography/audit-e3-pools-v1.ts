import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language='en'|'hi'|'pa';
type LocalizedValue=Record<Language,string>;
type Difficulty='Easy'|'Medium'|'Hard';

type Fact={
  cpId:'WGE-001-CP011'|'WGE-001-CP012'|'WGE-001-CP013'|'WGE-001-CP014'|'WGE-001-CP015';
  key:string;
  label:LocalizedValue;
  stem:LocalizedValue;
  relation:LocalizedValue;
  sourceIds:readonly string[];
  difficulty:Difficulty;
};

const FACTS:readonly Fact[]=[
  // CP011 — cloud and moisture recognition
  {
    cpId:'WGE-001-CP011',key:'cirrus',
    label:{en:'Cirrus',hi:'सिरस',pa:'ਸਿਰਸ'},
    stem:{en:'Which high, thin cloud type is commonly composed mainly of ice crystals?',
      hi:'कौन-सा ऊँचा और पतला बादल सामान्यतः मुख्यतः बर्फ के क्रिस्टलों से बना होता है?',
      pa:'ਕਿਹੜਾ ਉੱਚਾ ਅਤੇ ਪਤਲਾ ਬੱਦਲ ਆਮ ਤੌਰ ਉੱਤੇ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਬਰਫ਼ ਦੇ ਕ੍ਰਿਸਟਲਾਂ ਤੋਂ ਬਣਿਆ ਹੁੰਦਾ ਹੈ?'},
    relation:{en:'high thin cloud formed mainly of ice crystals',
      hi:'मुख्यतः बर्फ के क्रिस्टलों से बना ऊँचा पतला बादल',
      pa:'ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਬਰਫ਼ ਦੇ ਕ੍ਰਿਸਟਲਾਂ ਤੋਂ ਬਣਿਆ ਉੱਚਾ ਪਤਲਾ ਬੱਦਲ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP011',key:'cumulus',
    label:{en:'Cumulus',hi:'क्यूम्यलस',pa:'ਕਿਊਮਿਊਲਸ'},
    stem:{en:'Which cloud type typically has a puffy heap-like appearance with a relatively flat base?',
      hi:'कौन-सा बादल सामान्यतः फूले हुए ढेर जैसा दिखाई देता है और उसका आधार अपेक्षाकृत समतल होता है?',
      pa:'ਕਿਹੜਾ ਬੱਦਲ ਆਮ ਤੌਰ ਉੱਤੇ ਫੁੱਲੇ ਹੋਏ ਢੇਰ ਵਰਗਾ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਅਧਾਰ ਤੁਲਨਾਤਮਕ ਤੌਰ ਉੱਤੇ ਸਮਤਲ ਹੁੰਦਾ ਹੈ?'},
    relation:{en:'puffy heap-like cloud with a fairly flat base',
      hi:'फूले हुए ढेर जैसा बादल जिसका आधार अपेक्षाकृत समतल होता है',
      pa:'ਫੁੱਲੇ ਹੋਏ ਢੇਰ ਵਰਗਾ ਬੱਦਲ ਜਿਸ ਦਾ ਅਧਾਰ ਤੁਲਨਾਤਮਕ ਤੌਰ ਉੱਤੇ ਸਮਤਲ ਹੁੰਦਾ ਹੈ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP011',key:'stratus',
    label:{en:'Stratus',hi:'स्ट्रेटस',pa:'ਸਟ੍ਰੇਟਸ'},
    stem:{en:'Which low cloud type commonly forms a widespread uniform layer across the sky?',
      hi:'कौन-सा निम्न बादल सामान्यतः आकाश में फैली समान परत बनाता है?',
      pa:'ਕਿਹੜਾ ਨੀਵਾਂ ਬੱਦਲ ਆਮ ਤੌਰ ਉੱਤੇ ਆਕਾਸ਼ ਵਿੱਚ ਫੈਲੀ ਇਕਸਾਰ ਪਰਤ ਬਣਾਉਂਦਾ ਹੈ?'},
    relation:{en:'low cloud forming a broad uniform layer',
      hi:'विस्तृत समान परत बनाने वाला निम्न बादल',
      pa:'ਵਿਸ਼ਾਲ ਇਕਸਾਰ ਪਰਤ ਬਣਾਉਣ ਵਾਲਾ ਨੀਵਾਂ ਬੱਦਲ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP011',key:'cumulonimbus',
    label:{en:'Cumulonimbus',hi:'क्यूम्यलोनिम्बस',pa:'ਕਿਊਮਿਊਲੋਨਿੰਬਸ'},
    stem:{en:'Which towering cloud is most strongly associated with thunderstorms, heavy rain and lightning?',
      hi:'कौन-सा ऊँचा विकसित बादल गरज-चमक, भारी वर्षा और बिजली से सबसे अधिक जुड़ा है?',
      pa:'ਕਿਹੜਾ ਬਹੁਤ ਉੱਚਾ ਵਿਕਸਿਤ ਬੱਦਲ ਗਰਜ-ਚਮਕ, ਭਾਰੀ ਵਰਖਾ ਅਤੇ ਬਿਜਲੀ ਨਾਲ ਸਭ ਤੋਂ ਵੱਧ ਜੁੜਿਆ ਹੈ?'},
    relation:{en:'deep vertically developed storm cloud associated with thunderstorms',
      hi:'गरज-चमक से जुड़ा गहराई में विकसित ऊर्ध्वाधर तूफानी बादल',
      pa:'ਗਰਜ-ਚਮਕ ਨਾਲ ਜੁੜਿਆ ਡੂੰਘਾਈ ਵਿੱਚ ਵਿਕਸਿਤ ਖੜ੍ਹਵਾਂ ਤੂਫ਼ਾਨੀ ਬੱਦਲ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP011',key:'advection-fog',
    label:{en:'Advection fog',hi:'अभिवहन कोहरा',pa:'ਅਭਿਵਹਨ ਧੁੰਦ'},
    stem:{en:'Moist air moves horizontally over a colder surface and cools to saturation. Which fog type can form?',
      hi:'नम हवा क्षैतिज रूप से ठंडी सतह के ऊपर चलती है और संतृप्ति तक ठंडी हो जाती है। कौन-सा कोहरा बन सकता है?',
      pa:'ਨਮੀ ਵਾਲੀ ਹਵਾ ਖਿਤਿਜੀ ਤੌਰ ਉੱਤੇ ਠੰਢੀ ਸਤਹ ਦੇ ਉੱਪਰ ਲੰਘਦੀ ਹੈ ਅਤੇ ਸੰਤ੍ਰਪਤੀ ਤੱਕ ਠੰਢੀ ਹੋ ਜਾਂਦੀ ਹੈ। ਕਿਹੜੀ ਧੁੰਦ ਬਣ ਸਕਦੀ ਹੈ?'},
    relation:{en:'fog formed when moist air moves across a colder surface',
      hi:'नम हवा के ठंडी सतह के ऊपर बहने से बनने वाला कोहरा',
      pa:'ਨਮੀ ਵਾਲੀ ਹਵਾ ਦੇ ਠੰਢੀ ਸਤਹ ਉੱਪਰ ਵਗਣ ਨਾਲ ਬਣੀ ਧੁੰਦ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP011',key:'radiation-fog',
    label:{en:'Radiation fog',hi:'विकिरण कोहरा',pa:'ਵਿਕਿਰਣ ਧੁੰਦ'},
    stem:{en:'On a clear calm night, the ground cools rapidly and chills the air just above it to saturation. Which fog type may form?',
      hi:'स्वच्छ और शांत रात में भूमि तेजी से ठंडी होकर उसके ऊपर की हवा को संतृप्ति तक ठंडा कर देती है। कौन-सा कोहरा बन सकता है?',
      pa:'ਸਾਫ਼ ਅਤੇ ਸ਼ਾਂਤ ਰਾਤ ਵਿੱਚ ਧਰਤੀ ਤੇਜ਼ੀ ਨਾਲ ਠੰਢੀ ਹੋ ਕੇ ਉਸ ਦੇ ਉੱਪਰਲੀ ਹਵਾ ਨੂੰ ਸੰਤ੍ਰਪਤੀ ਤੱਕ ਠੰਢਾ ਕਰ ਦਿੰਦੀ ਹੈ। ਕਿਹੜੀ ਧੁੰਦ ਬਣ ਸਕਦੀ ਹੈ?'},
    relation:{en:'fog formed by strong night-time cooling of the ground and near-surface air',
      hi:'रात में भूमि और सतह के पास की हवा के तेज ठंडा होने से बना कोहरा',
      pa:'ਰਾਤ ਨੂੰ ਧਰਤੀ ਅਤੇ ਸਤਹ ਦੇ ਨੇੜੇ ਹਵਾ ਦੇ ਤੇਜ਼ ਠੰਢਾ ਹੋਣ ਨਾਲ ਬਣੀ ਧੁੰਦ'},
    sourceIds:['WGE-ATM-011'],difficulty:'Medium'
  },

  // CP012 — cyclone and climate-variability terms
  {
    cpId:'WGE-001-CP012',key:'hurricane',
    label:{en:'Hurricane',hi:'हरिकेन',pa:'ਹਰੀਕੇਨ'},
    stem:{en:'What regional name is commonly used for a tropical cyclone in the North Atlantic and northeastern Pacific?',
      hi:'उत्तरी अटलांटिक और उत्तर-पूर्वी प्रशांत में उष्णकटिबंधीय चक्रवात के लिए सामान्यतः कौन-सा क्षेत्रीय नाम प्रयुक्त होता है?',
      pa:'ਉੱਤਰੀ ਐਟਲਾਂਟਿਕ ਅਤੇ ਉੱਤਰ-ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਖੇਤਰੀ ਨਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'regional name for a tropical cyclone in the North Atlantic and northeastern Pacific',
      hi:'उत्तरी अटलांटिक और उत्तर-पूर्वी प्रशांत का उष्णकटिबंधीय चक्रवात नाम',
      pa:'ਉੱਤਰੀ ਐਟਲਾਂਟਿਕ ਅਤੇ ਉੱਤਰ-ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਦਾ ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤ ਨਾਂ'},
    sourceIds:['WGE-ATM-012','WGE-ATM-012A'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP012',key:'typhoon',
    label:{en:'Typhoon',hi:'टाइफून',pa:'ਟਾਈਫੂਨ'},
    stem:{en:'What regional name is commonly used for a tropical cyclone in the northwestern Pacific?',
      hi:'उत्तर-पश्चिमी प्रशांत में उष्णकटिबंधीय चक्रवात के लिए सामान्यतः कौन-सा क्षेत्रीय नाम प्रयुक्त होता है?',
      pa:'ਉੱਤਰ-ਪੱਛਮੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਖੇਤਰੀ ਨਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'regional name for a tropical cyclone in the northwestern Pacific',
      hi:'उत्तर-पश्चिमी प्रशांत का उष्णकटिबंधीय चक्रवात नाम',
      pa:'ਉੱਤਰ-ਪੱਛਮੀ ਪ੍ਰਸ਼ਾਂਤ ਦਾ ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤ ਨਾਂ'},
    sourceIds:['WGE-ATM-012','WGE-ATM-012A'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP012',key:'tropical-cyclone',
    label:{en:'Tropical cyclone',hi:'उष्णकटिबंधीय चक्रवात',pa:'ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤ'},
    stem:{en:'Which rotating warm-core storm develops over sufficiently warm tropical ocean water and has organised deep convection?',
      hi:'पर्याप्त गर्म उष्णकटिबंधीय महासागरीय जल पर विकसित होने वाला संगठित गहरे संवहन वाला गर्म-कोर घूर्णन तूफान क्या कहलाता है?',
      pa:'ਕਾਫ਼ੀ ਗਰਮ ਉਸ਼ਣਕਟੀਬੰਧੀ ਮਹਾਂਸਾਗਰੀ ਪਾਣੀ ਉੱਤੇ ਵਿਕਸਿਤ ਹੋਣ ਵਾਲਾ ਸੰਗਠਿਤ ਡੂੰਘੇ ਸੰਵਹਨ ਵਾਲਾ ਗਰਮ-ਕੋਰ ਘੁੰਮਦਾ ਤੂਫ਼ਾਨ ਕੀ ਕਹਾਂਦਾ ਹੈ?'},
    relation:{en:'organised warm-core rotating storm developing over warm tropical oceans',
      hi:'गर्म उष्णकटिबंधीय महासागर पर विकसित संगठित गर्म-कोर घूर्णन तूफान',
      pa:'ਗਰਮ ਉਸ਼ਣਕਟੀਬੰਧੀ ਮਹਾਂਸਾਗਰ ਉੱਤੇ ਵਿਕਸਿਤ ਸੰਗਠਿਤ ਗਰਮ-ਕੋਰ ਘੁੰਮਦਾ ਤੂਫ਼ਾਨ'},
    sourceIds:['WGE-ATM-012'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP012',key:'el-nino',
    label:{en:'El Niño',hi:'एल नीनो',pa:'ਐਲ ਨੀਨੋ'},
    stem:{en:'Which phase is associated with unusually warm surface waters in the central and eastern equatorial Pacific?',
      hi:'भूमध्यरेखीय मध्य और पूर्वी प्रशांत में असामान्य रूप से गर्म सतही जल किस अवस्था से जुड़ा है?',
      pa:'ਭੂ-ਮੱਧੀ ਮੱਧ ਅਤੇ ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਅਸਧਾਰਣ ਤੌਰ ਉੱਤੇ ਗਰਮ ਸਤਹੀ ਪਾਣੀ ਕਿਹੜੀ ਅਵਸਥਾ ਨਾਲ ਜੁੜਿਆ ਹੈ?'},
    relation:{en:'warm phase of equatorial Pacific ocean-atmosphere variability',
      hi:'भूमध्यरेखीय प्रशांत महासागर-वायुमंडल परिवर्तनशीलता की गर्म अवस्था',
      pa:'ਭੂ-ਮੱਧੀ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ-ਵਾਤਾਵਰਣ ਬਦਲਾਅ ਦੀ ਗਰਮ ਅਵਸਥਾ'},
    sourceIds:['WGE-ATM-012B','WGE-ATM-012C'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP012',key:'la-nina',
    label:{en:'La Niña',hi:'ला नीना',pa:'ਲਾ ਨੀਨਾ'},
    stem:{en:'Which phase is associated with unusually cool surface waters in the central and eastern equatorial Pacific?',
      hi:'भूमध्यरेखीय मध्य और पूर्वी प्रशांत में असामान्य रूप से ठंडा सतही जल किस अवस्था से जुड़ा है?',
      pa:'ਭੂ-ਮੱਧੀ ਮੱਧ ਅਤੇ ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਅਸਧਾਰਣ ਤੌਰ ਉੱਤੇ ਠੰਢਾ ਸਤਹੀ ਪਾਣੀ ਕਿਹੜੀ ਅਵਸਥਾ ਨਾਲ ਜੁੜਿਆ ਹੈ?'},
    relation:{en:'cool phase of equatorial Pacific ocean-atmosphere variability',
      hi:'भूमध्यरेखीय प्रशांत महासागर-वायुमंडल परिवर्तनशीलता की ठंडी अवस्था',
      pa:'ਭੂ-ਮੱਧੀ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ-ਵਾਤਾਵਰਣ ਬਦਲਾਅ ਦੀ ਠੰਢੀ ਅਵਸਥਾ'},
    sourceIds:['WGE-ATM-012B','WGE-ATM-012C'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP012',key:'anticyclone',
    label:{en:'Anticyclone',hi:'प्रतिचक्रवात',pa:'ਪ੍ਰਤੀਚੱਕਰਵਾਤ'},
    stem:{en:'Which large-scale pressure system is generally associated with sinking air and surface divergence?',
      hi:'कौन-सी बड़े पैमाने की दाब प्रणाली सामान्यतः नीचे उतरती हवा और सतही अपसरण से जुड़ी होती है?',
      pa:'ਕਿਹੜੀ ਵੱਡੇ ਪੱਧਰ ਦੀ ਦਬਾਅ ਪ੍ਰਣਾਲੀ ਆਮ ਤੌਰ ਉੱਤੇ ਹੇਠਾਂ ਉਤਰਦੀ ਹਵਾ ਅਤੇ ਸਤਹੀ ਵੱਖਰੇ ਵਹਾਅ ਨਾਲ ਜੁੜੀ ਹੁੰਦੀ ਹੈ?'},
    relation:{en:'high-pressure system with sinking air and outward surface flow',
      hi:'नीचे उतरती हवा और बाहर की ओर सतही प्रवाह वाली उच्च-दाब प्रणाली',
      pa:'ਹੇਠਾਂ ਉਤਰਦੀ ਹਵਾ ਅਤੇ ਬਾਹਰ ਵੱਲ ਸਤਹੀ ਵਹਾਅ ਵਾਲੀ ਉੱਚ-ਦਬਾਅ ਪ੍ਰਣਾਲੀ'},
    sourceIds:['WGE-ATM-012'],difficulty:'Medium'
  },

  // CP013 — climate-region recognition
  {
    cpId:'WGE-001-CP013',key:'equatorial-climate',
    label:{en:'Equatorial climate',hi:'भूमध्यरेखीय जलवायु',pa:'ਭੂ-ਮੱਧੀ ਜਲਵਾਯੂ'},
    stem:{en:'Which climate is characterised by high temperatures and heavy rainfall in most months near the equator?',
      hi:'भूमध्य रेखा के पास अधिकांश महीनों में उच्च तापमान और भारी वर्षा वाली जलवायु कौन-सी है?',
      pa:'ਭੂ-ਮੱਧ ਰੇਖਾ ਦੇ ਨੇੜੇ ਜ਼ਿਆਦਾਤਰ ਮਹੀਨਿਆਂ ਵਿੱਚ ਉੱਚ ਤਾਪਮਾਨ ਅਤੇ ਭਾਰੀ ਵਰਖਾ ਵਾਲੀ ਜਲਵਾਯੂ ਕਿਹੜੀ ਹੈ?'},
    relation:{en:'hot wet climate with rainfall in most months near the equator',
      hi:'भूमध्य रेखा के पास अधिकांश महीनों में वर्षा वाली गर्म आर्द्र जलवायु',
      pa:'ਭੂ-ਮੱਧ ਰੇਖਾ ਦੇ ਨੇੜੇ ਜ਼ਿਆਦਾਤਰ ਮਹੀਨਿਆਂ ਵਿੱਚ ਵਰਖਾ ਵਾਲੀ ਗਰਮ ਨਮੀਦਾਰ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP013',key:'savanna-climate',
    label:{en:'Tropical savanna climate',hi:'उष्णकटिबंधीय सवाना जलवायु',pa:'ਉਸ਼ਣਕਟੀਬੰਧੀ ਸਵਾਨਾ ਜਲਵਾਯੂ'},
    stem:{en:'Which tropical climate has a clear wet season and dry season and commonly supports savanna grassland?',
      hi:'कौन-सी उष्णकटिबंधीय जलवायु में स्पष्ट आर्द्र और शुष्क ऋतु होती है तथा सामान्यतः सवाना घासभूमि पाई जाती है?',
      pa:'ਕਿਹੜੀ ਉਸ਼ਣਕਟੀਬੰਧੀ ਜਲਵਾਯੂ ਵਿੱਚ ਸਪਸ਼ਟ ਗਿੱਲੀ ਅਤੇ ਸੁੱਕੀ ਰੁੱਤ ਹੁੰਦੀ ਹੈ ਅਤੇ ਆਮ ਤੌਰ ਉੱਤੇ ਸਵਾਨਾ ਘਾਹ-ਮੈਦਾਨ ਮਿਲਦਾ ਹੈ?'},
    relation:{en:'tropical climate with distinct wet and dry seasons',
      hi:'स्पष्ट आर्द्र और शुष्क ऋतुओं वाली उष्णकटिबंधीय जलवायु',
      pa:'ਸਪਸ਼ਟ ਗਿੱਲੀਆਂ ਅਤੇ ਸੁੱਕੀਆਂ ਰੁੱਤਾਂ ਵਾਲੀ ਉਸ਼ਣਕਟੀਬੰਧੀ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP013',key:'mediterranean-climate',
    label:{en:'Mediterranean climate',hi:'भूमध्यसागरीय जलवायु',pa:'ਭੂ-ਮੱਧ ਸਾਗਰੀ ਜਲਵਾਯੂ'},
    stem:{en:'Which climate is noted for dry summers and wetter winters on the western sides of continents in subtropical latitudes?',
      hi:'उपोष्ण अक्षांशों में महाद्वीपों के पश्चिमी भागों पर शुष्क ग्रीष्म और अधिक वर्षायुक्त शीत ऋतु वाली जलवायु कौन-सी है?',
      pa:'ਉਪ-ਉਸ਼ਣ ਅਕਸ਼ਾਂਸ਼ਾਂ ਵਿੱਚ ਮਹਾਂਦੀਪਾਂ ਦੇ ਪੱਛਮੀ ਹਿੱਸਿਆਂ ਉੱਤੇ ਸੁੱਕੀ ਗਰਮੀ ਅਤੇ ਵੱਧ ਵਰਖਾ ਵਾਲੀ ਸਰਦੀ ਵਾਲੀ ਜਲਵਾਯੂ ਕਿਹੜੀ ਹੈ?'},
    relation:{en:'subtropical west-coast climate with dry summers and wetter winters',
      hi:'शुष्क ग्रीष्म और अधिक वर्षायुक्त शीत ऋतु वाली उपोष्ण पश्चिमी तटीय जलवायु',
      pa:'ਸੁੱਕੀ ਗਰਮੀ ਅਤੇ ਵੱਧ ਵਰਖਾ ਵਾਲੀ ਸਰਦੀ ਵਾਲੀ ਉਪ-ਉਸ਼ਣ ਪੱਛਮੀ ਤਟਵਰਤੀ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP013',key:'marine-west-coast',
    label:{en:'Marine west coast climate',hi:'समुद्री पश्चिमी तटीय जलवायु',pa:'ਸਮੁੰਦਰੀ ਪੱਛਮੀ ਤਟਵਰਤੀ ਜਲਵਾਯੂ'},
    stem:{en:'Which mid-latitude climate has relatively mild temperatures and year-round precipitation under strong ocean influence?',
      hi:'कौन-सी मध्य-अक्षांशीय जलवायु में महासागरीय प्रभाव के कारण तापमान अपेक्षाकृत मृदु और वर्षा लगभग पूरे वर्ष होती है?',
      pa:'ਕਿਹੜੀ ਮੱਧ-ਅਕਸ਼ਾਂਸ਼ੀ ਜਲਵਾਯੂ ਵਿੱਚ ਮਹਾਂਸਾਗਰੀ ਪ੍ਰਭਾਵ ਕਾਰਨ ਤਾਪਮਾਨ ਤੁਲਨਾਤਮਕ ਤੌਰ ਉੱਤੇ ਨਰਮ ਅਤੇ ਵਰਖਾ ਲਗਭਗ ਸਾਰਾ ਸਾਲ ਹੁੰਦੀ ਹੈ?'},
    relation:{en:'mild ocean-influenced mid-latitude climate with precipitation through the year',
      hi:'साल भर वर्षा वाली मृदु महासागरीय मध्य-अक्षांशीय जलवायु',
      pa:'ਸਾਲ ਭਰ ਵਰਖਾ ਵਾਲੀ ਨਰਮ ਮਹਾਂਸਾਗਰੀ ਮੱਧ-ਅਕਸ਼ਾਂਸ਼ੀ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP013',key:'tundra-climate',
    label:{en:'Tundra climate',hi:'टुंड्रा जलवायु',pa:'ਟੁੰਡਰਾ ਜਲਵਾਯੂ'},
    stem:{en:'Which high-latitude climate has a very short cool summer, long cold winter and no true forest?',
      hi:'कौन-सी उच्च-अक्षांशीय जलवायु में बहुत छोटी ठंडी ग्रीष्म, लंबी कठोर शीत ऋतु और वास्तविक वन का अभाव होता है?',
      pa:'ਕਿਹੜੀ ਉੱਚ-ਅਕਸ਼ਾਂਸ਼ੀ ਜਲਵਾਯੂ ਵਿੱਚ ਬਹੁਤ ਛੋਟੀ ਠੰਢੀ ਗਰਮੀ, ਲੰਮੀ ਕਠੋਰ ਸਰਦੀ ਅਤੇ ਅਸਲੀ ਜੰਗਲ ਦੀ ਕਮੀ ਹੁੰਦੀ ਹੈ?'},
    relation:{en:'high-latitude climate with short cool summer and treeless vegetation',
      hi:'छोटी ठंडी ग्रीष्म और वृक्षहीन वनस्पति वाली उच्च-अक्षांशीय जलवायु',
      pa:'ਛੋਟੀ ਠੰਢੀ ਗਰਮੀ ਅਤੇ ਦਰੱਖਤ-ਰਹਿਤ ਬਨਸਪਤੀ ਵਾਲੀ ਉੱਚ-ਅਕਸ਼ਾਂਸ਼ੀ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP013',key:'hot-desert-climate',
    label:{en:'Hot desert climate',hi:'गर्म मरुस्थलीय जलवायु',pa:'ਗਰਮ ਰੇਗਿਸਤਾਨੀ ਜਲਵਾਯੂ'},
    stem:{en:'Which climate is associated with very low rainfall and strong subtropical subsidence in many continental interiors and western margins?',
      hi:'कौन-सी जलवायु बहुत कम वर्षा और अनेक महाद्वीपीय आंतरिक तथा पश्चिमी भागों में उपोष्ण अवरोही वायु से जुड़ी है?',
      pa:'ਕਿਹੜੀ ਜਲਵਾਯੂ ਬਹੁਤ ਘੱਟ ਵਰਖਾ ਅਤੇ ਕਈ ਮਹਾਂਦੀਪੀ ਅੰਦਰੂਨੀ ਤੇ ਪੱਛਮੀ ਹਿੱਸਿਆਂ ਵਿੱਚ ਉਪ-ਉਸ਼ਣ ਹੇਠਾਂ ਉਤਰਦੀ ਹਵਾ ਨਾਲ ਜੁੜੀ ਹੈ?'},
    relation:{en:'very dry subtropical climate commonly linked with descending air',
      hi:'नीचे उतरती हवा से जुड़ी अत्यंत शुष्क उपोष्ण जलवायु',
      pa:'ਹੇਠਾਂ ਉਤਰਦੀ ਹਵਾ ਨਾਲ ਜੁੜੀ ਬਹੁਤ ਸੁੱਕੀ ਉਪ-ਉਸ਼ਣ ਜਲਵਾਯੂ'},
    sourceIds:['WGE-ATM-013'],difficulty:'Medium'
  },

  // CP014 — regional grassland/biome names
  {
    cpId:'WGE-001-CP014',key:'prairies',
    label:{en:'Prairies',hi:'प्रेयरी',pa:'ਪ੍ਰੇਰੀ'},
    stem:{en:'What regional name is commonly used for the temperate grasslands of central North America?',
      hi:'मध्य उत्तरी अमेरिका की समशीतोष्ण घासभूमियों के लिए सामान्यतः कौन-सा क्षेत्रीय नाम प्रयुक्त होता है?',
      pa:'ਮੱਧ ਉੱਤਰੀ ਅਮਰੀਕਾ ਦੇ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨਾਂ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਖੇਤਰੀ ਨਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'temperate grasslands of central North America',
      hi:'मध्य उत्तरी अमेरिका की समशीतोष्ण घासभूमियाँ',
      pa:'ਮੱਧ ਉੱਤਰੀ ਅਮਰੀਕਾ ਦੇ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨ'},
    sourceIds:['WGE-ATM-014A','WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP014',key:'pampas',
    label:{en:'Pampas',hi:'पम्पास',pa:'ਪੰਪਾਸ'},
    stem:{en:'What regional name is commonly used for the extensive temperate grasslands of Argentina and Uruguay?',
      hi:'अर्जेंटीना और उरुग्वे की विस्तृत समशीतोष्ण घासभूमियों के लिए सामान्यतः कौन-सा क्षेत्रीय नाम प्रयुक्त होता है?',
      pa:'ਅਰਜਨਟੀਨਾ ਅਤੇ ਉਰੂਗਵੇ ਦੇ ਵਿਸ਼ਾਲ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨਾਂ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਖੇਤਰੀ ਨਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'temperate grasslands of Argentina and Uruguay',
      hi:'अर्जेंटीना और उरुग्वे की समशीतोष्ण घासभूमियाँ',
      pa:'ਅਰਜਨਟੀਨਾ ਅਤੇ ਉਰੂਗਵੇ ਦੇ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨ'},
    sourceIds:['WGE-ATM-014A','WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP014',key:'steppes',
    label:{en:'Steppes',hi:'स्टेपी',pa:'ਸਟੈੱਪੀ'},
    stem:{en:'What regional name is commonly used for the broad temperate grasslands of the Eurasian interior?',
      hi:'यूरेशिया के आंतरिक भाग की विस्तृत समशीतोष्ण घासभूमियों के लिए सामान्यतः कौन-सा नाम प्रयुक्त होता है?',
      pa:'ਯੂਰੇਸ਼ੀਆ ਦੇ ਅੰਦਰੂਨੀ ਹਿੱਸੇ ਦੇ ਵਿਸ਼ਾਲ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨਾਂ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਨਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'broad temperate grasslands of the Eurasian interior',
      hi:'यूरेशिया के आंतरिक भाग की विस्तृत समशीतोष्ण घासभूमियाँ',
      pa:'ਯੂਰੇਸ਼ੀਆ ਦੇ ਅੰਦਰੂਨੀ ਹਿੱਸੇ ਦੇ ਵਿਸ਼ਾਲ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨ'},
    sourceIds:['WGE-ATM-014A','WGE-ATM-013'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP014',key:'veld',
    label:{en:'Veld',hi:'वेल्ड',pa:'ਵੈਲਡ'},
    stem:{en:'What regional name is associated with temperate grasslands of southern Africa?',
      hi:'दक्षिणी अफ्रीका की समशीतोष्ण घासभूमियों से कौन-सा क्षेत्रीय नाम जुड़ा है?',
      pa:'ਦੱਖਣੀ ਅਫ਼ਰੀਕਾ ਦੇ ਸਮਸ਼ੀਤੋਸ਼ਣ ਘਾਹ-ਮੈਦਾਨਾਂ ਨਾਲ ਕਿਹੜਾ ਖੇਤਰੀ ਨਾਂ ਜੁੜਿਆ ਹੈ?'},
    relation:{en:'regional grassland term associated with southern Africa',
      hi:'दक्षिणी अफ्रीका से जुड़ा क्षेत्रीय घासभूमि नाम',
      pa:'ਦੱਖਣੀ ਅਫ਼ਰੀਕਾ ਨਾਲ ਜੁੜਿਆ ਖੇਤਰੀ ਘਾਹ-ਮੈਦਾਨ ਨਾਂ'},
    sourceIds:['WGE-ATM-014A','WGE-ATM-013'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP014',key:'taiga',
    label:{en:'Taiga',hi:'टाइगा',pa:'ਟਾਈਗਾ'},
    stem:{en:'Which biome is dominated by cold-climate coniferous forest across high northern latitudes?',
      hi:'उच्च उत्तरी अक्षांशों में शीत जलवायु वाले शंकुधारी वनों से प्रभुत्व वाला बायोम कौन-सा है?',
      pa:'ਉੱਚ ਉੱਤਰੀ ਅਕਸ਼ਾਂਸ਼ਾਂ ਵਿੱਚ ਠੰਢੀ ਜਲਵਾਯੂ ਵਾਲੇ ਸ਼ੰਖਧਾਰੀ ਜੰਗਲਾਂ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਜੀਵ-ਖੇਤਰ ਕਿਹੜਾ ਹੈ?'},
    relation:{en:'cold-climate coniferous forest biome of high northern latitudes',
      hi:'उच्च उत्तरी अक्षांशों का शीत शंकुधारी वन बायोम',
      pa:'ਉੱਚ ਉੱਤਰੀ ਅਕਸ਼ਾਂਸ਼ਾਂ ਦਾ ਠੰਢਾ ਸ਼ੰਖਧਾਰੀ ਜੰਗਲੀ ਜੀਵ-ਖੇਤਰ'},
    sourceIds:['WGE-ATM-014A'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP014',key:'tundra',
    label:{en:'Tundra',hi:'टुंड्रा',pa:'ਟੁੰਡਰਾ'},
    stem:{en:'Which treeless cold biome occurs poleward of the main forest zone and commonly overlies permafrost?',
      hi:'मुख्य वन क्षेत्र के ध्रुवीय ओर स्थित वृक्षहीन शीत बायोम, जहाँ सामान्यतः स्थायी जमी भूमि मिलती है, कौन-सा है?',
      pa:'ਮੁੱਖ ਜੰਗਲੀ ਖੇਤਰ ਤੋਂ ਧਰੁਵੀ ਪਾਸੇ ਸਥਿਤ ਦਰੱਖਤ-ਰਹਿਤ ਠੰਢਾ ਜੀਵ-ਖੇਤਰ, ਜਿੱਥੇ ਆਮ ਤੌਰ ਉੱਤੇ ਸਥਾਈ ਜਮੀ ਧਰਤੀ ਮਿਲਦੀ ਹੈ, ਕਿਹੜਾ ਹੈ?'},
    relation:{en:'treeless cold biome commonly associated with permafrost',
      hi:'स्थायी जमी भूमि से जुड़ा वृक्षहीन शीत बायोम',
      pa:'ਸਥਾਈ ਜਮੀ ਧਰਤੀ ਨਾਲ ਜੁੜਿਆ ਦਰੱਖਤ-ਰਹਿਤ ਠੰਢਾ ਜੀਵ-ਖੇਤਰ'},
    sourceIds:['WGE-ATM-014A'],difficulty:'Easy'
  },

  // CP015 — ocean-floor relief
  {
    cpId:'WGE-001-CP015',key:'continental-shelf',
    label:{en:'Continental shelf',hi:'महाद्वीपीय शेल्फ',pa:'ਮਹਾਂਦੀਪੀ ਸ਼ੈਲਫ਼'},
    stem:{en:'Which gently sloping submerged margin extends seaward from a continent before the sea floor steepens?',
      hi:'महाद्वीप से समुद्र की ओर फैला हल्की ढाल वाला डूबा किनारा, जिसके बाद समुद्र-तल अधिक खड़ा हो जाता है, क्या कहलाता है?',
      pa:'ਮਹਾਂਦੀਪ ਤੋਂ ਸਮੁੰਦਰ ਵੱਲ ਫੈਲਿਆ ਹੌਲੀ ਢਲਾਣ ਵਾਲਾ ਡੁੱਬਿਆ ਕਿਨਾਰਾ, ਜਿਸ ਤੋਂ ਬਾਅਦ ਸਮੁੰਦਰੀ ਤਲ ਵੱਧ ਖੜ੍ਹਾ ਹੋ ਜਾਂਦਾ ਹੈ, ਕੀ ਕਹਾਂਦਾ ਹੈ?'},
    relation:{en:'gently sloping submerged continental margin before the shelf break',
      hi:'शेल्फ विराम से पहले हल्की ढाल वाला डूबा महाद्वीपीय किनारा',
      pa:'ਸ਼ੈਲਫ਼ ਟੁੱਟ ਤੋਂ ਪਹਿਲਾਂ ਹੌਲੀ ਢਲਾਣ ਵਾਲਾ ਡੁੱਬਿਆ ਮਹਾਂਦੀਪੀ ਕਿਨਾਰਾ'},
    sourceIds:['WGE-ATM-015A','WGE-ATM-015B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP015',key:'continental-slope',
    label:{en:'Continental slope',hi:'महाद्वीपीय ढाल',pa:'ਮਹਾਂਦੀਪੀ ਢਲਾਣ'},
    stem:{en:'Which steep submarine zone descends from the edge of the continental shelf toward the deep ocean floor?',
      hi:'महाद्वीपीय शेल्फ के किनारे से गहरे महासागरीय तल की ओर उतरने वाला खड़ा समुद्री क्षेत्र क्या कहलाता है?',
      pa:'ਮਹਾਂਦੀਪੀ ਸ਼ੈਲਫ਼ ਦੇ ਕਿਨਾਰੇ ਤੋਂ ਡੂੰਘੇ ਮਹਾਂਸਾਗਰੀ ਤਲ ਵੱਲ ਹੇਠਾਂ ਉਤਰਦਾ ਖੜ੍ਹਾ ਸਮੁੰਦਰੀ ਖੇਤਰ ਕੀ ਕਹਾਂਦਾ ਹੈ?'},
    relation:{en:'steep submerged zone descending from shelf edge toward deep ocean',
      hi:'शेल्फ किनारे से गहरे महासागर की ओर उतरता खड़ा डूबा क्षेत्र',
      pa:'ਸ਼ੈਲਫ਼ ਕਿਨਾਰੇ ਤੋਂ ਡੂੰਘੇ ਮਹਾਂਸਾਗਰ ਵੱਲ ਹੇਠਾਂ ਉਤਰਦਾ ਖੜ੍ਹਾ ਡੁੱਬਿਆ ਖੇਤਰ'},
    sourceIds:['WGE-ATM-015A','WGE-ATM-015B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP015',key:'abyssal-plain',
    label:{en:'Abyssal plain',hi:'अतल मैदान',pa:'ਅਥਾਹ ਮੈਦਾਨ'},
    stem:{en:'Which broad, very flat part of the deep-ocean floor is commonly covered by fine sediment?',
      hi:'गहरे महासागरीय तल का कौन-सा विस्तृत और बहुत समतल भाग सामान्यतः महीन अवसाद से ढका रहता है?',
      pa:'ਡੂੰਘੇ ਮਹਾਂਸਾਗਰੀ ਤਲ ਦਾ ਕਿਹੜਾ ਵਿਸ਼ਾਲ ਅਤੇ ਬਹੁਤ ਸਮਤਲ ਹਿੱਸਾ ਆਮ ਤੌਰ ਉੱਤੇ ਬਰੀਕ ਗਾਦ ਨਾਲ ਢੱਕਿਆ ਰਹਿੰਦਾ ਹੈ?'},
    relation:{en:'broad flat deep-ocean floor commonly mantled by fine sediment',
      hi:'महीन अवसाद से ढका विस्तृत समतल गहरा महासागरीय तल',
      pa:'ਬਰੀਕ ਗਾਦ ਨਾਲ ਢੱਕਿਆ ਵਿਸ਼ਾਲ ਸਮਤਲ ਡੂੰਘਾ ਮਹਾਂਸਾਗਰੀ ਤਲ'},
    sourceIds:['WGE-ATM-015A','WGE-ATM-015B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP015',key:'mid-ocean-ridge',
    label:{en:'Mid-ocean ridge',hi:'मध्य-महासागरीय रिज',pa:'ਮੱਧ-ਮਹਾਂਸਾਗਰੀ ਰਿਜ'},
    stem:{en:'Which long submarine mountain system marks many divergent plate boundaries and sites of new oceanic crust formation?',
      hi:'कौन-सी लंबी समुद्री पर्वत प्रणाली अनेक अपसारी प्लेट सीमाओं और नई महासागरीय पर्पटी के निर्माण स्थलों को चिह्नित करती है?',
      pa:'ਕਿਹੜੀ ਲੰਮੀ ਸਮੁੰਦਰੀ ਪਹਾੜੀ ਪ੍ਰਣਾਲੀ ਕਈ ਵੱਖਰੀਆਂ ਪਲੇਟ ਸੀਮਾਵਾਂ ਅਤੇ ਨਵੀਂ ਮਹਾਂਸਾਗਰੀ ਭੂ-ਪੜਤ ਦੇ ਬਣਨ ਵਾਲੇ ਸਥਾਨਾਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ?'},
    relation:{en:'submarine mountain system associated with divergence and sea-floor spreading',
      hi:'अपसरण और समुद्र-तल प्रसार से जुड़ी समुद्री पर्वत प्रणाली',
      pa:'ਵੱਖਰੇ ਹੋਣ ਅਤੇ ਸਮੁੰਦਰੀ-ਤਲ ਫੈਲਾਅ ਨਾਲ ਜੁੜੀ ਸਮੁੰਦਰੀ ਪਹਾੜੀ ਪ੍ਰਣਾਲੀ'},
    sourceIds:['WGE-ATM-015A','WGE-ATM-015C'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP015',key:'ocean-trench',
    label:{en:'Ocean trench',hi:'महासागरीय गर्त',pa:'ਮਹਾਂਸਾਗਰੀ ਖਾਈ'},
    stem:{en:'Which long, narrow and very deep depression commonly forms at a subduction zone on the ocean floor?',
      hi:'महासागरीय तल पर सबडक्शन क्षेत्र में बनने वाला लंबा, संकरा और बहुत गहरा अवसाद क्या कहलाता है?',
      pa:'ਮਹਾਂਸਾਗਰੀ ਤਲ ਉੱਤੇ ਸਬਡਕਸ਼ਨ ਖੇਤਰ ਵਿੱਚ ਬਣਣ ਵਾਲੀ ਲੰਮੀ, ਤੰਗ ਅਤੇ ਬਹੁਤ ਡੂੰਘੀ ਖੱਡ ਕੀ ਕਹਾਂਦੀ ਹੈ?'},
    relation:{en:'long narrow deep-ocean depression associated with subduction',
      hi:'सबडक्शन से जुड़ा लंबा संकरा गहरा महासागरीय अवसाद',
      pa:'ਸਬਡਕਸ਼ਨ ਨਾਲ ਜੁੜੀ ਲੰਮੀ ਤੰਗ ਡੂੰਘੀ ਮਹਾਂਸਾਗਰੀ ਖਾਈ'},
    sourceIds:['WGE-ATM-015A','WGE-ATM-015C'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP015',key:'guyot',
    label:{en:'Guyot',hi:'गायोट',pa:'ਗਾਇਓਟ'},
    stem:{en:'What is a flat-topped submarine volcanic mountain called?',
      hi:'समतल शीर्ष वाले समुद्र के भीतर स्थित ज्वालामुखीय पर्वत को क्या कहा जाता है?',
      pa:'ਸਮਤਲ ਚੋਟੀ ਵਾਲੇ ਸਮੁੰਦਰ ਅੰਦਰ ਸਥਿਤ ਜਵਾਲਾਮੁਖੀ ਪਹਾੜ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'},
    relation:{en:'flat-topped submarine volcanic mountain',
      hi:'समतल शीर्ष वाला समुद्र के भीतर ज्वालामुखीय पर्वत',
      pa:'ਸਮਤਲ ਚੋਟੀ ਵਾਲਾ ਸਮੁੰਦਰ ਅੰਦਰ ਜਵਾਲਾਮੁਖੀ ਪਹਾੜ'},
    sourceIds:['WGE-ATM-015A'],difficulty:'Medium'
  },
];

const qlIds={
  cp011:['WGE-001-CP011-QL-AUDIT-DIRECT-V1','WGE-001-CP011-QL-AUDIT-MATCH-V1'],
  cp012:['WGE-001-CP012-QL-AUDIT-DIRECT-V1','WGE-001-CP012-QL-AUDIT-MATCH-V1'],
  cp013:['WGE-001-CP013-QL-AUDIT-DIRECT-V1','WGE-001-CP013-QL-AUDIT-MATCH-V1'],
  cp014:['WGE-001-CP014-QL-AUDIT-DIRECT-V1','WGE-001-CP014-QL-AUDIT-MATCH-V1'],
  cp015:['WGE-001-CP015-QL-AUDIT-DIRECT-V1','WGE-001-CP015-QL-AUDIT-MATCH-V1'],
} as const;

const MATCH_STEMS:Record<Fact['cpId'],LocalizedValue>={
 'WGE-001-CP011':{en:'Which cloud or fog term is correctly matched with its description?',hi:'कौन-सा बादल या कोहरा अपने विवरण से सही सुमेलित है?',pa:'ਕਿਹੜਾ ਬੱਦਲ ਜਾਂ ਧੁੰਦ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
 'WGE-001-CP012':{en:'Which cyclone or climate-variability term is correctly matched?',hi:'कौन-सा चक्रवात या जलवायु-परिवर्तनशीलता पद सही सुमेलित है?',pa:'ਕਿਹੜਾ ਚੱਕਰਵਾਤ ਜਾਂ ਜਲਵਾਯੂ-ਬਦਲਾਅ ਸ਼ਬਦ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
 'WGE-001-CP013':{en:'Which climate region is correctly matched with its description?',hi:'कौन-सा जलवायु क्षेत्र अपने विवरण से सही सुमेलित है?',pa:'ਕਿਹੜਾ ਜਲਵਾਯੂ ਖੇਤਰ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
 'WGE-001-CP014':{en:'Which biome or regional grassland name is correctly matched?',hi:'कौन-सा बायोम या क्षेत्रीय घासभूमि नाम सही सुमेलित है?',pa:'ਕਿਹੜਾ ਜੀਵ-ਖੇਤਰ ਜਾਂ ਖੇਤਰੀ ਘਾਹ-ਮੈਦਾਨ ਨਾਂ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
 'WGE-001-CP015':{en:'Which ocean-floor feature is correctly matched with its description?',hi:'कौन-सी महासागरीय तल विशेषता अपने विवरण से सही सुमेलित है?',pa:'ਕਿਹੜੀ ਮਹਾਂਸਾਗਰੀ ਤਲ ਵਿਸ਼ੇਸ਼ਤਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
};

const cpFacts=(cpId:Fact['cpId'])=>FACTS.filter(f=>f.cpId===cpId);
const shuffle=(s:string)=>deterministicShuffle([0,1,2,3],s);
function selected(target:Fact){
 const p=cpFacts(target.cpId),i=p.findIndex(f=>f.key===target.key);
 if(p.length!==6||i<0)throw new Error(`Expected six E3 facts for ${target.cpId}`);
 return [target,p[(i+1)%6]!,p[(i+3)%6]!,p[(i+5)%6]!];
}
function ql(target:Fact,index:0|1){
 const key=`cp${target.cpId.slice(-3)}` as keyof typeof qlIds;
 return qlIds[key][index];
}
function direct(target:Fact):WorldGeographyQuestion{
 const rows=selected(target),ord=shuffle(`${target.cpId}:${target.key}:direct`);
 const options=(l:Language)=>ord.map(i=>rows[i]!.label[l]);
 return {id:`${target.cpId}-Q-VP-E3-DIRECT-${target.key}`.toUpperCase(),cpId:target.cpId,objective:`audit-e3-direct-${target.key}`,
 difficulty:target.difficulty,sourceIds:[...target.sourceIds],correctIndex:ord.indexOf(0),authoringReviewApproved:false,
 generationSource:`${target.cpId}-AUDIT-WAVE-E3-V1`,qlId:ql(target,0),locales:{
  en:{stem:target.stem.en,options:options('en'),explanation:`${target.label.en}: ${target.relation.en}.`},
  hi:{stem:target.stem.hi,options:options('hi'),explanation:`${target.label.hi}: ${target.relation.hi}।`},
  pa:{stem:target.stem.pa,options:options('pa'),explanation:`${target.label.pa}: ${target.relation.pa}।`},
 }};
}
function match(target:Fact):WorldGeographyQuestion{
 const rows=selected(target),ord=shuffle(`${target.cpId}:${target.key}:match`);
 const pairs=(l:Language)=>[
  `${rows[0]!.label[l]} — ${rows[0]!.relation[l]}`,
  `${rows[1]!.label[l]} — ${rows[2]!.relation[l]}`,
  `${rows[2]!.label[l]} — ${rows[3]!.relation[l]}`,
  `${rows[3]!.label[l]} — ${rows[1]!.relation[l]}`,
 ];
 const options=(l:Language)=>{const p=pairs(l);return ord.map(i=>p[i]!);};
 const difficulty:Difficulty=target.difficulty==='Easy'?'Medium':'Hard';
 return {id:`${target.cpId}-Q-VP-E3-MATCH-${target.key}`.toUpperCase(),cpId:target.cpId,objective:`audit-e3-match-${target.key}`,
 difficulty,sourceIds:[...new Set(rows.flatMap(f=>f.sourceIds))],correctIndex:ord.indexOf(0),authoringReviewApproved:false,
 generationSource:`${target.cpId}-AUDIT-WAVE-E3-V1`,qlId:ql(target,1),locales:{
  en:{stem:MATCH_STEMS[target.cpId].en,options:options('en'),explanation:`Correct relation: ${target.label.en} — ${target.relation.en}.`},
  hi:{stem:MATCH_STEMS[target.cpId].hi,options:options('hi'),explanation:`सही संबंध: ${target.label.hi} — ${target.relation.hi}।`},
  pa:{stem:MATCH_STEMS[target.cpId].pa,options:options('pa'),explanation:`ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।`},
 }};
}

export const WGE_AUDIT_E3_VARIABLE_POOL_QUESTIONS_V1:readonly WorldGeographyQuestion[]=Object.freeze(FACTS.flatMap(f=>[direct(f),match(f)]));
export const WGE_AUDIT_E3_VARIABLE_POOL_QL_IDS_V1:readonly string[]=Object.freeze([
 ...qlIds.cp011,...qlIds.cp012,...qlIds.cp013,...qlIds.cp014,...qlIds.cp015,
]);
