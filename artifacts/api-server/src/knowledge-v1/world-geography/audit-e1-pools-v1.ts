import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language = 'en' | 'hi' | 'pa';
type LocalizedValue = Record<Language, string>;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type Fact = {
  cpId: 'WGE-001-CP001' | 'WGE-001-CP003' | 'WGE-001-CP004' | 'WGE-001-CP005';
  key: string;
  label: LocalizedValue;
  stem: LocalizedValue;
  relation: LocalizedValue;
  sourceIds: readonly string[];
  difficulty: Difficulty;
};

const FACTS: readonly Fact[] = [
  // CP001 — continent/ocean relative position
  {
    cpId:'WGE-001-CP001', key:'north-america-three-oceans',
    label:{en:'North America',hi:'उत्तरी अमेरिका',pa:'ਉੱਤਰੀ ਅਮਰੀਕਾ'},
    stem:{
      en:'Which continent has the Arctic Ocean to its north, the Atlantic to its east and the Pacific to its west?',
      hi:'किस महाद्वीप के उत्तर में आर्कटिक महासागर, पूर्व में अटलांटिक महासागर और पश्चिम में प्रशांत महासागर है?',
      pa:'ਕਿਹੜੇ ਮਹਾਂਦੀਪ ਦੇ ਉੱਤਰ ਵੱਲ ਆਰਕਟਿਕ ਮਹਾਂਸਾਗਰ, ਪੂਰਬ ਵੱਲ ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ ਅਤੇ ਪੱਛਮ ਵੱਲ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ ਹੈ?'
    },
    relation:{
      en:'bordered broadly by the Arctic, Atlantic and Pacific oceans',
      hi:'मुख्यतः आर्कटिक, अटलांटिक और प्रशांत महासागरों से घिरा महाद्वीप',
      pa:'ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਆਰਕਟਿਕ, ਐਟਲਾਂਟਿਕ ਅਤੇ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰਾਂ ਨਾਲ ਘਿਰਿਆ ਮਹਾਂਦੀਪ'
    },
    sourceIds:['NCERT-DOMAINS','NOAA-OCEANS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP001', key:'south-america-two-oceans',
    label:{en:'South America',hi:'दक्षिण अमेरिका',pa:'ਦੱਖਣੀ ਅਮਰੀਕਾ'},
    stem:{
      en:'Which continent has the Pacific Ocean along its western side and the Atlantic Ocean along its eastern side?',
      hi:'किस महाद्वीप के पश्चिमी किनारे पर प्रशांत महासागर और पूर्वी किनारे पर अटलांटिक महासागर है?',
      pa:'ਕਿਹੜੇ ਮਹਾਂਦੀਪ ਦੇ ਪੱਛਮੀ ਕਿਨਾਰੇ ਉੱਤੇ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ ਅਤੇ ਪੂਰਬੀ ਕਿਨਾਰੇ ਉੱਤੇ ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ ਹੈ?'
    },
    relation:{
      en:'lies between the Pacific on the west and Atlantic on the east',
      hi:'पश्चिम में प्रशांत और पूर्व में अटलांटिक महासागर के बीच स्थित है',
      pa:'ਪੱਛਮ ਵੱਲ ਪ੍ਰਸ਼ਾਂਤ ਅਤੇ ਪੂਰਬ ਵੱਲ ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ ਵਿਚਕਾਰ ਸਥਿਤ ਹੈ'
    },
    sourceIds:['NCERT-DOMAINS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP001', key:'africa-atlantic-indian',
    label:{en:'Africa',hi:'अफ्रीका',pa:'ਅਫ਼ਰੀਕਾ'},
    stem:{
      en:'Which continent has the Atlantic Ocean to its west and the Indian Ocean to its east?',
      hi:'किस महाद्वीप के पश्चिम में अटलांटिक महासागर और पूर्व में हिंद महासागर है?',
      pa:'ਕਿਹੜੇ ਮਹਾਂਦੀਪ ਦੇ ਪੱਛਮ ਵੱਲ ਐਟਲਾਂਟਿਕ ਮਹਾਂਸਾਗਰ ਅਤੇ ਪੂਰਬ ਵੱਲ ਹਿੰਦ ਮਹਾਂਸਾਗਰ ਹੈ?'
    },
    relation:{
      en:'lies between the Atlantic Ocean on the west and Indian Ocean on the east',
      hi:'पश्चिम में अटलांटिक और पूर्व में हिंद महासागर के बीच स्थित है',
      pa:'ਪੱਛਮ ਵੱਲ ਐਟਲਾਂਟਿਕ ਅਤੇ ਪੂਰਬ ਵੱਲ ਹਿੰਦ ਮਹਾਂਸਾਗਰ ਵਿਚਕਾਰ ਸਥਿਤ ਹੈ'
    },
    sourceIds:['NCERT-DOMAINS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP001', key:'europe-mediterranean',
    label:{en:'Europe',hi:'यूरोप',pa:'ਯੂਰਪ'},
    stem:{
      en:'Which continent lies mainly north of the Mediterranean Sea and west of Asia?',
      hi:'कौन-सा महाद्वीप मुख्यतः भूमध्य सागर के उत्तर और एशिया के पश्चिम में स्थित है?',
      pa:'ਕਿਹੜਾ ਮਹਾਂਦੀਪ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਭੂ-ਮੱਧ ਸਾਗਰ ਦੇ ਉੱਤਰ ਅਤੇ ਏਸ਼ੀਆ ਦੇ ਪੱਛਮ ਵੱਲ ਸਥਿਤ ਹੈ?'
    },
    relation:{
      en:'lies north of the Mediterranean and forms the western part of Eurasia',
      hi:'भूमध्य सागर के उत्तर में स्थित है और यूरेशिया का पश्चिमी भाग बनाता है',
      pa:'ਭੂ-ਮੱਧ ਸਾਗਰ ਦੇ ਉੱਤਰ ਵੱਲ ਸਥਿਤ ਹੈ ਅਤੇ ਯੂਰੇਸ਼ੀਆ ਦਾ ਪੱਛਮੀ ਹਿੱਸਾ ਬਣਾਉਂਦਾ ਹੈ'
    },
    sourceIds:['NCERT-DOMAINS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP001', key:'australia-indian-pacific',
    label:{en:'Australia',hi:'ऑस्ट्रेलिया',pa:'ਆਸਟ੍ਰੇਲੀਆ'},
    stem:{
      en:'Which continent lies in the Southern Hemisphere between the Indian and Pacific oceans?',
      hi:'दक्षिणी गोलार्ध में हिंद और प्रशांत महासागरों के बीच कौन-सा महाद्वीप स्थित है?',
      pa:'ਦੱਖਣੀ ਗੋਲਾਰਧ ਵਿੱਚ ਹਿੰਦ ਅਤੇ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰਾਂ ਵਿਚਕਾਰ ਕਿਹੜਾ ਮਹਾਂਦੀਪ ਸਥਿਤ ਹੈ?'
    },
    relation:{
      en:'a Southern Hemisphere continent between the Indian and Pacific oceans',
      hi:'हिंद और प्रशांत महासागरों के बीच स्थित दक्षिणी गोलार्ध का महाद्वीप',
      pa:'ਹਿੰਦ ਅਤੇ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰਾਂ ਵਿਚਕਾਰ ਸਥਿਤ ਦੱਖਣੀ ਗੋਲਾਰਧ ਦਾ ਮਹਾਂਦੀਪ'
    },
    sourceIds:['NCERT-DOMAINS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP001', key:'asia-three-oceans',
    label:{en:'Asia',hi:'एशिया',pa:'ਏਸ਼ੀਆ'},
    stem:{
      en:'Which continent is bordered by the Arctic Ocean to the north, Pacific Ocean to the east and Indian Ocean to the south?',
      hi:'किस महाद्वीप के उत्तर में आर्कटिक महासागर, पूर्व में प्रशांत महासागर और दक्षिण में हिंद महासागर है?',
      pa:'ਕਿਹੜੇ ਮਹਾਂਦੀਪ ਦੇ ਉੱਤਰ ਵੱਲ ਆਰਕਟਿਕ ਮਹਾਂਸਾਗਰ, ਪੂਰਬ ਵੱਲ ਪ੍ਰਸ਼ਾਂਤ ਮਹਾਂਸਾਗਰ ਅਤੇ ਦੱਖਣ ਵੱਲ ਹਿੰਦ ਮਹਾਂਸਾਗਰ ਹੈ?'
    },
    relation:{
      en:'bordered broadly by the Arctic, Pacific and Indian oceans',
      hi:'मुख्यतः आर्कटिक, प्रशांत और हिंद महासागरों से घिरा महाद्वीप',
      pa:'ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਆਰਕਟਿਕ, ਪ੍ਰਸ਼ਾਂਤ ਅਤੇ ਹਿੰਦ ਮਹਾਂਸਾਗਰਾਂ ਨਾਲ ਘਿਰਿਆ ਮਹਾਂਦੀਪ'
    },
    sourceIds:['NCERT-DOMAINS','NOAA-OCEANS'], difficulty:'Easy'
  },

  // CP003 — named seasonal/orbital events
  {
    cpId:'WGE-001-CP003', key:'june-solstice',
    label:{en:'June solstice',hi:'जून अयनांत',pa:'ਜੂਨ ਅਯਨਾਂਤ'},
    stem:{
      en:'At which annual event is the noon Sun directly overhead near the Tropic of Cancer?',
      hi:'वर्ष की किस घटना पर दोपहर का सूर्य कर्क रेखा के पास सीधा ऊपर दिखाई देता है?',
      pa:'ਸਾਲ ਦੀ ਕਿਹੜੀ ਘਟਨਾ ਵੇਲੇ ਦੁਪਹਿਰ ਦਾ ਸੂਰਜ ਕਰਕ ਰੇਖਾ ਦੇ ਨੇੜੇ ਸਿੱਧਾ ਉੱਪਰ ਹੁੰਦਾ ਹੈ?'
    },
    relation:{
      en:'Sun overhead near the Tropic of Cancer and longest Northern Hemisphere daylight',
      hi:'कर्क रेखा के पास सीधा सूर्य और उत्तरी गोलार्ध में सबसे लंबा दिन',
      pa:'ਕਰਕ ਰੇਖਾ ਦੇ ਨੇੜੇ ਸਿੱਧਾ ਸੂਰਜ ਅਤੇ ਉੱਤਰੀ ਗੋਲਾਰਧ ਵਿੱਚ ਸਭ ਤੋਂ ਲੰਮਾ ਦਿਨ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP003', key:'december-solstice',
    label:{en:'December solstice',hi:'दिसंबर अयनांत',pa:'ਦਸੰਬਰ ਅਯਨਾਂਤ'},
    stem:{
      en:'At which annual event is the noon Sun directly overhead near the Tropic of Capricorn?',
      hi:'वर्ष की किस घटना पर दोपहर का सूर्य मकर रेखा के पास सीधा ऊपर दिखाई देता है?',
      pa:'ਸਾਲ ਦੀ ਕਿਹੜੀ ਘਟਨਾ ਵੇਲੇ ਦੁਪਹਿਰ ਦਾ ਸੂਰਜ ਮਕਰ ਰੇਖਾ ਦੇ ਨੇੜੇ ਸਿੱਧਾ ਉੱਪਰ ਹੁੰਦਾ ਹੈ?'
    },
    relation:{
      en:'Sun overhead near the Tropic of Capricorn and longest Southern Hemisphere daylight',
      hi:'मकर रेखा के पास सीधा सूर्य और दक्षिणी गोलार्ध में सबसे लंबा दिन',
      pa:'ਮਕਰ ਰੇਖਾ ਦੇ ਨੇੜੇ ਸਿੱਧਾ ਸੂਰਜ ਅਤੇ ਦੱਖਣੀ ਗੋਲਾਰਧ ਵਿੱਚ ਸਭ ਤੋਂ ਲੰਮਾ ਦਿਨ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP003', key:'march-equinox',
    label:{en:'March equinox',hi:'मार्च विषुव',pa:'ਮਾਰਚ ਵਿਸ਼ੁਵ'},
    stem:{
      en:'Which annual event marks the beginning of astronomical spring in the Northern Hemisphere with the Sun overhead at the equator?',
      hi:'उत्तरी गोलार्ध में खगोलीय वसंत की शुरुआत और भूमध्य रेखा पर सीधा सूर्य किस वार्षिक घटना से जुड़ा है?',
      pa:'ਉੱਤਰੀ ਗੋਲਾਰਧ ਵਿੱਚ ਖਗੋਲੀ ਬਸੰਤ ਦੀ ਸ਼ੁਰੂਆਤ ਅਤੇ ਭੂ-ਮੱਧ ਰੇਖਾ ਉੱਤੇ ਸਿੱਧਾ ਸੂਰਜ ਕਿਹੜੀ ਸਾਲਾਨਾ ਘਟਨਾ ਨਾਲ ਜੁੜਿਆ ਹੈ?'
    },
    relation:{
      en:'equinox associated with Northern Hemisphere spring and direct rays at the equator',
      hi:'उत्तरी गोलार्ध के वसंत और भूमध्य रेखा पर सीधी किरणों वाला विषुव',
      pa:'ਉੱਤਰੀ ਗੋਲਾਰਧ ਦੀ ਬਸੰਤ ਅਤੇ ਭੂ-ਮੱਧ ਰੇਖਾ ਉੱਤੇ ਸਿੱਧੀਆਂ ਕਿਰਣਾਂ ਵਾਲਾ ਵਿਸ਼ੁਵ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP003', key:'september-equinox',
    label:{en:'September equinox',hi:'सितंबर विषुव',pa:'ਸਤੰਬਰ ਵਿਸ਼ੁਵ'},
    stem:{
      en:'Which annual event marks the beginning of astronomical autumn in the Northern Hemisphere with the Sun overhead at the equator?',
      hi:'उत्तरी गोलार्ध में खगोलीय शरद ऋतु की शुरुआत और भूमध्य रेखा पर सीधा सूर्य किस वार्षिक घटना से जुड़ा है?',
      pa:'ਉੱਤਰੀ ਗੋਲਾਰਧ ਵਿੱਚ ਖਗੋਲੀ ਪਤਝੜ ਦੀ ਸ਼ੁਰੂਆਤ ਅਤੇ ਭੂ-ਮੱਧ ਰੇਖਾ ਉੱਤੇ ਸਿੱਧਾ ਸੂਰਜ ਕਿਹੜੀ ਸਾਲਾਨਾ ਘਟਨਾ ਨਾਲ ਜੁੜਿਆ ਹੈ?'
    },
    relation:{
      en:'equinox associated with Northern Hemisphere autumn and direct rays at the equator',
      hi:'उत्तरी गोलार्ध की शरद ऋतु और भूमध्य रेखा पर सीधी किरणों वाला विषुव',
      pa:'ਉੱਤਰੀ ਗੋਲਾਰਧ ਦੀ ਪਤਝੜ ਅਤੇ ਭੂ-ਮੱਧ ਰੇਖਾ ਉੱਤੇ ਸਿੱਧੀਆਂ ਕਿਰਣਾਂ ਵਾਲਾ ਵਿਸ਼ੁਵ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP003', key:'perihelion',
    label:{en:'Perihelion',hi:'उपसौर',pa:'ਉਪਸੂਰ'},
    stem:{
      en:'What is the point in Earth’s orbit when Earth is closest to the Sun called?',
      hi:'पृथ्वी की कक्षा में सूर्य से सबसे कम दूरी वाले बिंदु को क्या कहा जाता है?',
      pa:'ਧਰਤੀ ਦੀ ਕਕਸ਼ ਵਿੱਚ ਸੂਰਜ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਵਾਲੇ ਬਿੰਦੂ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation:{
      en:'point of Earth’s orbit nearest the Sun, reached in early January',
      hi:'पृथ्वी की कक्षा का सूर्य के सबसे निकट बिंदु, जो जनवरी के आरंभ में आता है',
      pa:'ਧਰਤੀ ਦੀ ਕਕਸ਼ ਦਾ ਸੂਰਜ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਬਿੰਦੂ, ਜੋ ਜਨਵਰੀ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਆਉਂਦਾ ਹੈ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP003', key:'aphelion',
    label:{en:'Aphelion',hi:'अपसौर',pa:'ਅਪਸੂਰ'},
    stem:{
      en:'What is the point in Earth’s orbit when Earth is farthest from the Sun called?',
      hi:'पृथ्वी की कक्षा में सूर्य से सबसे अधिक दूरी वाले बिंदु को क्या कहा जाता है?',
      pa:'ਧਰਤੀ ਦੀ ਕਕਸ਼ ਵਿੱਚ ਸੂਰਜ ਤੋਂ ਸਭ ਤੋਂ ਵੱਧ ਦੂਰੀ ਵਾਲੇ ਬਿੰਦੂ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation:{
      en:'point of Earth’s orbit farthest from the Sun, reached in early July',
      hi:'पृथ्वी की कक्षा का सूर्य से सबसे दूर बिंदु, जो जुलाई के आरंभ में आता है',
      pa:'ਧਰਤੀ ਦੀ ਕਕਸ਼ ਦਾ ਸੂਰਜ ਤੋਂ ਸਭ ਤੋਂ ਦੂਰ ਬਿੰਦੂ, ਜੋ ਜੁਲਾਈ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਆਉਂਦਾ ਹੈ'
    },
    sourceIds:['NASA-SEASONS'], difficulty:'Medium'
  },

  // CP004 — rock identification
  {
    cpId:'WGE-001-CP004', key:'gneiss',
    label:{en:'Gneiss',hi:'नाइस',pa:'ਨਾਈਸ'},
    stem:{
      en:'Which metamorphic rock commonly shows light and dark mineral bands produced under high-grade metamorphism?',
      hi:'उच्च श्रेणी के कायांतरण से बनी हल्की और गहरी खनिज पट्टियाँ सामान्यतः किस कायांतरित शैल में दिखाई देती हैं?',
      pa:'ਉੱਚ ਦਰਜੇ ਦੇ ਰੂਪਾਂਤਰਨ ਨਾਲ ਬਣੀਆਂ ਹਲਕੀਆਂ ਅਤੇ ਗੂੜ੍ਹੀਆਂ ਖਣਿਜ ਪੱਟੀਆਂ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੀ ਰੂਪਾਂਤਰਿਤ ਚੱਟਾਨ ਵਿੱਚ ਦਿਖਾਈ ਦਿੰਦੀਆਂ ਹਨ?'
    },
    relation:{
      en:'high-grade metamorphic rock commonly showing distinct mineral banding',
      hi:'उच्च श्रेणी की कायांतरित शैल जिसमें स्पष्ट खनिज पट्टियाँ मिलती हैं',
      pa:'ਉੱਚ ਦਰਜੇ ਦੀ ਰੂਪਾਂਤਰਿਤ ਚੱਟਾਨ ਜਿਸ ਵਿੱਚ ਸਪਸ਼ਟ ਖਣਿਜ ਪੱਟੀਆਂ ਮਿਲਦੀਆਂ ਹਨ'
    },
    sourceIds:['NPS-METAMORPHIC','NCERT-ROCKS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP004', key:'obsidian',
    label:{en:'Obsidian',hi:'ऑब्सिडियन',pa:'ਓਬਸਿਡੀਅਨ'},
    stem:{
      en:'Which volcanic rock has a glassy texture because lava cooled so rapidly that large crystals did not form?',
      hi:'लावा के बहुत तेजी से ठंडा होने से बड़े क्रिस्टल न बन पाने के कारण किस ज्वालामुखीय शैल की बनावट काँच जैसी होती है?',
      pa:'ਲਾਵਾ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਠੰਢਾ ਹੋਣ ਕਰਕੇ ਵੱਡੇ ਕ੍ਰਿਸਟਲ ਨਾ ਬਣ ਸਕਣ ਕਾਰਨ ਕਿਹੜੀ ਜਵਾਲਾਮੁਖੀ ਚੱਟਾਨ ਦੀ ਬਣਾਵਟ ਕੱਚ ਵਰਗੀ ਹੁੰਦੀ ਹੈ?'
    },
    relation:{
      en:'glassy volcanic rock formed by very rapid cooling of lava',
      hi:'लावा के बहुत तेज ठंडा होने से बनी काँच जैसी ज्वालामुखीय शैल',
      pa:'ਲਾਵਾ ਬਹੁਤ ਤੇਜ਼ ਠੰਢਾ ਹੋਣ ਨਾਲ ਬਣੀ ਕੱਚ ਵਰਗੀ ਜਵਾਲਾਮੁਖੀ ਚੱਟਾਨ'
    },
    sourceIds:['NCERT-ROCKS','NPS-ROCKS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP004', key:'pumice',
    label:{en:'Pumice',hi:'प्यूमिस',pa:'ਪਿਊਮਿਸ'},
    stem:{
      en:'Which volcanic rock is highly vesicular because gas bubbles were trapped as frothy lava cooled?',
      hi:'झागदार लावा के ठंडा होते समय गैस बुलबुले फँस जाने से कौन-सी ज्वालामुखीय शैल बहुत छिद्रयुक्त बनती है?',
      pa:'ਝੱਗਦਾਰ ਲਾਵਾ ਠੰਢਾ ਹੋਣ ਵੇਲੇ ਗੈਸ ਦੇ ਬੁਲਬੁਲੇ ਫਸ ਜਾਣ ਕਰਕੇ ਕਿਹੜੀ ਜਵਾਲਾਮੁਖੀ ਚੱਟਾਨ ਬਹੁਤ ਛਿਦਰਦਾਰ ਬਣਦੀ ਹੈ?'
    },
    relation:{
      en:'light vesicular volcanic rock formed from gas-rich frothy lava',
      hi:'गैस-समृद्ध झागदार लावा से बनी हल्की छिद्रयुक्त ज्वालामुखीय शैल',
      pa:'ਗੈਸ-ਭਰਪੂਰ ਝੱਗਦਾਰ ਲਾਵਾ ਤੋਂ ਬਣੀ ਹਲਕੀ ਛਿਦਰਦਾਰ ਜਵਾਲਾਮੁਖੀ ਚੱਟਾਨ'
    },
    sourceIds:['NCERT-ROCKS','NPS-ROCKS'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP004', key:'conglomerate',
    label:{en:'Conglomerate',hi:'कांग्लोमरेट',pa:'ਕਾਂਗਲੋਮਰੇਟ'},
    stem:{
      en:'Which sedimentary rock is made mainly of rounded gravel-sized fragments cemented together?',
      hi:'गोल कंकड़ आकार के टुकड़ों के आपस में जुड़ने से मुख्यतः कौन-सी अवसादी शैल बनती है?',
      pa:'ਗੋਲ ਕੰਕਰ-ਆਕਾਰ ਦੇ ਟੁਕੜਿਆਂ ਦੇ ਆਪਸ ਵਿੱਚ ਜੁੜਨ ਨਾਲ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕਿਹੜੀ ਅਵਸਾਦੀ ਚੱਟਾਨ ਬਣਦੀ ਹੈ?'
    },
    relation:{
      en:'clastic sedimentary rock containing rounded gravel-sized fragments',
      hi:'गोल कंकड़ आकार के टुकड़ों वाली खंडित अवसादी शैल',
      pa:'ਗੋਲ ਕੰਕਰ-ਆਕਾਰ ਦੇ ਟੁਕੜਿਆਂ ਵਾਲੀ ਟੁਕੜੇਦਾਰ ਅਵਸਾਦੀ ਚੱਟਾਨ'
    },
    sourceIds:['NCERT-ROCKS','NPS-ROCKS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP004', key:'coal',
    label:{en:'Coal',hi:'कोयला',pa:'ਕੋਲਾ'},
    stem:{
      en:'Which rock is commonly classified as an organic sedimentary rock formed from accumulated plant material?',
      hi:'संचित वनस्पति पदार्थ से बनी जैविक अवसादी शैल के रूप में सामान्यतः किसे वर्गीकृत किया जाता है?',
      pa:'ਇਕੱਠੇ ਹੋਏ ਬੂਟਿਆਂ ਦੇ ਪਦਾਰਥ ਤੋਂ ਬਣੀ ਜੈਵਿਕ ਅਵਸਾਦੀ ਚੱਟਾਨ ਵਜੋਂ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਸ ਨੂੰ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation:{
      en:'organic sedimentary rock formed from accumulated and altered plant material',
      hi:'संचित और परिवर्तित वनस्पति पदार्थ से बनी जैविक अवसादी शैल',
      pa:'ਇਕੱਠੇ ਅਤੇ ਬਦਲੇ ਹੋਏ ਬੂਟਿਆਂ ਦੇ ਪਦਾਰਥ ਤੋਂ ਬਣੀ ਜੈਵਿਕ ਅਵਸਾਦੀ ਚੱਟਾਨ'
    },
    sourceIds:['NCERT-ROCKS'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP004', key:'gabbro',
    label:{en:'Gabbro',hi:'गैब्रो',pa:'ਗੈਬਰੋ'},
    stem:{
      en:'Which coarse-grained intrusive igneous rock has a mafic composition broadly similar to basalt?',
      hi:'कौन-सी मोटे क्रिस्टलों वाली अंतर्वेधी आग्नेय शैल की मैफिक संरचना बेसाल्ट से broadly समान होती है?',
      pa:'ਕਿਹੜੀ ਮੋਟੇ ਕ੍ਰਿਸਟਲਾਂ ਵਾਲੀ ਅੰਦਰੂਨੀ ਆਗਨੇਯ ਚੱਟਾਨ ਦੀ ਮੈਫਿਕ ਬਣਤਰ ਬੇਸਾਲਟ ਨਾਲ ਮਿਲਦੀ-ਜੁਲਦੀ ਹੁੰਦੀ ਹੈ?'
    },
    relation:{
      en:'coarse-grained intrusive mafic igneous rock broadly equivalent to basalt in composition',
      hi:'मोटे क्रिस्टलों वाली अंतर्वेधी मैफिक आग्नेय शैल जिसकी संरचना बेसाल्ट जैसी है',
      pa:'ਮੋਟੇ ਕ੍ਰਿਸਟਲਾਂ ਵਾਲੀ ਅੰਦਰੂਨੀ ਮੈਫਿਕ ਆਗਨੇਯ ਚੱਟਾਨ ਜਿਸ ਦੀ ਬਣਤਰ ਬੇਸਾਲਟ ਵਰਗੀ ਹੈ'
    },
    sourceIds:['NCERT-ROCKS','NPS-ROCKS'], difficulty:'Medium'
  },

  // CP005 — named tectonic features
  {
    cpId:'WGE-001-CP005', key:'red-sea-rift',
    label:{en:'Red Sea',hi:'लाल सागर',pa:'ਲਾਲ ਸਾਗਰ'},
    stem:{
      en:'Which water body occupies an active divergent zone between the African and Arabian plates?',
      hi:'अफ्रीकी और अरब प्लेटों के बीच सक्रिय अपसारी क्षेत्र में कौन-सा जल निकाय स्थित है?',
      pa:'ਅਫ਼ਰੀਕੀ ਅਤੇ ਅਰਬ ਪਲੇਟਾਂ ਵਿਚਕਾਰ ਸਰਗਰਮ ਵੱਖਰਾ ਹੋਣ ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ ਕਿਹੜਾ ਜਲ-ਖੇਤਰ ਸਥਿਤ ਹੈ?'
    },
    relation:{
      en:'young oceanic basin developing along divergence between Africa and Arabia',
      hi:'अफ्रीका और अरब के अलग होने से विकसित हो रहा युवा महासागरीय बेसिन',
      pa:'ਅਫ਼ਰੀਕਾ ਅਤੇ ਅਰਬ ਦੇ ਵੱਖ ਹੋਣ ਨਾਲ ਵਿਕਸਿਤ ਹੋ ਰਿਹਾ ਨੌਜਵਾਨ ਮਹਾਂਸਾਗਰੀ ਬੇਸਿਨ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP005', key:'mariana-trench',
    label:{en:'Mariana Trench',hi:'मैरियाना गर्त',pa:'ਮੈਰੀਆਨਾ ਖਾਈ'},
    stem:{
      en:'Which deep-ocean trench is associated with subduction in the western Pacific near the Mariana island arc?',
      hi:'पश्चिमी प्रशांत में मैरियाना द्वीप चाप के पास सबडक्शन से कौन-सा गहरा महासागरीय गर्त जुड़ा है?',
      pa:'ਪੱਛਮੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਮੈਰੀਆਨਾ ਟਾਪੂ-ਚਾਪ ਦੇ ਨੇੜੇ ਸਬਡਕਸ਼ਨ ਨਾਲ ਕਿਹੜੀ ਡੂੰਘੀ ਮਹਾਂਸਾਗਰੀ ਖਾਈ ਜੁੜੀ ਹੈ?'
    },
    relation:{
      en:'deep western Pacific trench formed at an oceanic subduction zone',
      hi:'महासागरीय सबडक्शन क्षेत्र पर बना पश्चिमी प्रशांत का गहरा गर्त',
      pa:'ਮਹਾਂਸਾਗਰੀ ਸਬਡਕਸ਼ਨ ਖੇਤਰ ਉੱਤੇ ਬਣੀ ਪੱਛਮੀ ਪ੍ਰਸ਼ਾਂਤ ਦੀ ਡੂੰਘੀ ਖਾਈ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP005', key:'east-pacific-rise',
    label:{en:'East Pacific Rise',hi:'पूर्वी प्रशांत उत्थान',pa:'ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਉੱਠਾਣ'},
    stem:{
      en:'Which major mid-ocean ridge system is a site of rapid sea-floor spreading in the eastern Pacific?',
      hi:'पूर्वी प्रशांत में तेज समुद्र-तल प्रसार वाला प्रमुख मध्य-महासागरीय रिज तंत्र कौन-सा है?',
      pa:'ਪੂਰਬੀ ਪ੍ਰਸ਼ਾਂਤ ਵਿੱਚ ਤੇਜ਼ ਸਮੁੰਦਰੀ-ਤਲ ਫੈਲਾਅ ਵਾਲੀ ਮੁੱਖ ਮੱਧ-ਮਹਾਂਸਾਗਰੀ ਰਿਜ ਪ੍ਰਣਾਲੀ ਕਿਹੜੀ ਹੈ?'
    },
    relation:{
      en:'divergent mid-ocean ridge system with rapid sea-floor spreading',
      hi:'तेज समुद्र-तल प्रसार वाला अपसारी मध्य-महासागरीय रिज तंत्र',
      pa:'ਤੇਜ਼ ਸਮੁੰਦਰੀ-ਤਲ ਫੈਲਾਅ ਵਾਲੀ ਵੱਖਰੀ ਹੋਣ ਵਾਲੀ ਮੱਧ-ਮਹਾਂਸਾਗਰੀ ਰਿਜ ਪ੍ਰਣਾਲੀ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP005', key:'aleutian-arc',
    label:{en:'Aleutian Islands',hi:'अल्यूशियन द्वीप',pa:'ਅਲਿਊਸ਼ੀਅਨ ਟਾਪੂ'},
    stem:{
      en:'Which island chain is a volcanic arc produced by subduction south of Alaska?',
      hi:'अलास्का के दक्षिण में सबडक्शन से बना ज्वालामुखीय द्वीप चाप कौन-सा है?',
      pa:'ਅਲਾਸਕਾ ਦੇ ਦੱਖਣ ਵੱਲ ਸਬਡਕਸ਼ਨ ਨਾਲ ਬਣਿਆ ਜਵਾਲਾਮੁਖੀ ਟਾਪੂ-ਚਾਪ ਕਿਹੜਾ ਹੈ?'
    },
    relation:{
      en:'volcanic island arc associated with subduction along the Aleutian trench',
      hi:'अल्यूशियन गर्त के साथ सबडक्शन से जुड़ा ज्वालामुखीय द्वीप चाप',
      pa:'ਅਲਿਊਸ਼ੀਅਨ ਖਾਈ ਨਾਲ ਸਬਡਕਸ਼ਨ ਨਾਲ ਜੁੜਿਆ ਜਵਾਲਾਮੁਖੀ ਟਾਪੂ-ਚਾਪ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Hard'
  },
  {
    cpId:'WGE-001-CP005', key:'himalaya-collision',
    label:{en:'Himalaya',hi:'हिमालय',pa:'ਹਿਮਾਲਿਆ'},
    stem:{
      en:'Which mountain system is the classic example of continent–continent collision between the Indian and Eurasian plates?',
      hi:'भारतीय और यूरेशियाई प्लेटों की महाद्वीप–महाद्वीप टक्कर का प्रमुख उदाहरण कौन-सी पर्वत प्रणाली है?',
      pa:'ਭਾਰਤੀ ਅਤੇ ਯੂਰੇਸ਼ੀਆਈ ਪਲੇਟਾਂ ਦੀ ਮਹਾਂਦੀਪ–ਮਹਾਂਦੀਪ ਟੱਕਰ ਦਾ ਪ੍ਰਮੁੱਖ ਉਦਾਹਰਨ ਕਿਹੜੀ ਪਹਾੜੀ ਪ੍ਰਣਾਲੀ ਹੈ?'
    },
    relation:{
      en:'fold mountain system formed mainly by collision of the Indian and Eurasian plates',
      hi:'भारतीय और यूरेशियाई प्लेटों की टक्कर से मुख्यतः बनी वलित पर्वत प्रणाली',
      pa:'ਭਾਰਤੀ ਅਤੇ ਯੂਰੇਸ਼ੀਆਈ ਪਲੇਟਾਂ ਦੀ ਟੱਕਰ ਨਾਲ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਬਣੀ ਮੁੜੀ ਪਹਾੜੀ ਪ੍ਰਣਾਲੀ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP005', key:'san-andreas-transform',
    label:{en:'San Andreas Fault',hi:'सान एंड्रियास भ्रंश',pa:'ਸਾਨ ਐਂਡਰੀਆਸ ਭ੍ਰੰਸ਼'},
    stem:{
      en:'Which major fault in California is a classic example of a transform plate boundary?',
      hi:'कैलिफ़ोर्निया का कौन-सा प्रमुख भ्रंश रूपांतरण प्लेट सीमा का प्रसिद्ध उदाहरण है?',
      pa:'ਕੈਲੀਫ਼ੋਰਨੀਆ ਦਾ ਕਿਹੜਾ ਮੁੱਖ ਭ੍ਰੰਸ਼ ਰੂਪਾਂਤਰ ਪਲੇਟ ਸੀਮਾ ਦਾ ਪ੍ਰਸਿੱਧ ਉਦਾਹਰਨ ਹੈ?'
    },
    relation:{
      en:'major transform fault where plates slide horizontally past one another',
      hi:'प्रमुख रूपांतरण भ्रंश जहाँ प्लेटें एक-दूसरे के पास क्षैतिज रूप से खिसकती हैं',
      pa:'ਮੁੱਖ ਰੂਪਾਂਤਰ ਭ੍ਰੰਸ਼ ਜਿੱਥੇ ਪਲੇਟਾਂ ਇੱਕ-ਦੂਜੇ ਦੇ ਕੋਲੋਂ ਖਿਤਿਜੀ ਤੌਰ ਉੱਤੇ ਖਿਸਕਦੀਆਂ ਹਨ'
    },
    sourceIds:['NCERT-PLATES'], difficulty:'Easy'
  },
];

type TimeFact = {
  key:string;
  degrees:number;
  minutes:number;
  eastWest:'E'|'W';
  difficulty:Difficulty;
};
const TIME_FACTS: readonly TimeFact[] = [
  {key:'15-deg',degrees:15,minutes:60,eastWest:'E',difficulty:'Easy'},
  {key:'30-deg',degrees:30,minutes:120,eastWest:'W',difficulty:'Easy'},
  {key:'45-deg',degrees:45,minutes:180,eastWest:'E',difficulty:'Easy'},
  {key:'60-deg',degrees:60,minutes:240,eastWest:'W',difficulty:'Medium'},
  {key:'75-deg',degrees:75,minutes:300,eastWest:'E',difficulty:'Medium'},
  {key:'90-deg',degrees:90,minutes:360,eastWest:'W',difficulty:'Medium'},
];

const qlIds = {
  cp001:['WGE-001-CP001-QL-AUDIT-DIRECT-V1','WGE-001-CP001-QL-AUDIT-MATCH-V1'],
  cp002:['WGE-001-CP002-QL-AUDIT-LONGITUDE-TIME-V1','WGE-001-CP002-QL-AUDIT-TIME-LONGITUDE-V1'],
  cp003:['WGE-001-CP003-QL-AUDIT-DIRECT-V1','WGE-001-CP003-QL-AUDIT-MATCH-V1'],
  cp004:['WGE-001-CP004-QL-AUDIT-DIRECT-V1','WGE-001-CP004-QL-AUDIT-MATCH-V1'],
  cp005:['WGE-001-CP005-QL-AUDIT-DIRECT-V1','WGE-001-CP005-QL-AUDIT-MATCH-V1'],
} as const;

const MATCH_STEMS: Record<Fact['cpId'],LocalizedValue> = {
  'WGE-001-CP001':{en:'Which continent is correctly matched with its geographic position?',hi:'कौन-सा महाद्वीप अपनी भौगोलिक स्थिति से सही सुमेलित है?',pa:'ਕਿਹੜਾ ਮਹਾਂਦੀਪ ਆਪਣੀ ਭੂਗੋਲਿਕ ਸਥਿਤੀ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
  'WGE-001-CP003':{en:'Which seasonal or orbital event is correctly matched with its description?',hi:'कौन-सी मौसमी या कक्षीय घटना अपने विवरण से सही सुमेलित है?',pa:'ਕਿਹੜੀ ਰੁੱਤੀ ਜਾਂ ਕਕਸ਼ੀ ਘਟਨਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
  'WGE-001-CP004':{en:'Which rock is correctly matched with its description?',hi:'कौन-सी शैल अपने विवरण से सही सुमेलित है?',pa:'ਕਿਹੜੀ ਚੱਟਾਨ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
  'WGE-001-CP005':{en:'Which tectonic feature is correctly matched with its setting?',hi:'कौन-सी विवर्तनिक विशेषता अपने परिवेश से सही सुमेलित है?',pa:'ਕਿਹੜੀ ਟੈਕਟੋਨਿਕ ਵਿਸ਼ੇਸ਼ਤਾ ਆਪਣੇ ਭੂਗੋਲਿਕ ਸੰਦਰਭ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
};

const cpFacts=(cpId:Fact['cpId'])=>FACTS.filter(f=>f.cpId===cpId);
function factOptions(target:Fact){
  const peers=cpFacts(target.cpId);
  const i=peers.findIndex(f=>f.key===target.key);
  if(peers.length!==6||i<0) throw new Error(`Expected six E1 facts for ${target.cpId}`);
  return [target,peers[(i+1)%6]!,peers[(i+3)%6]!,peers[(i+5)%6]!];
}
function order(seed:string){return deterministicShuffle([0,1,2,3],seed);}

function makeDirect(target:Fact):WorldGeographyQuestion{
  const rows=factOptions(target);
  const ord=order(`${target.cpId}:${target.key}:direct`);
  const options=(lang:Language)=>ord.map(i=>rows[i]!.label[lang]);
  const cpNum=target.cpId.slice(-3);
  return {
    id:`${target.cpId}-Q-VP-E1-DIRECT-${target.key}`.toUpperCase(),cpId:target.cpId,
    objective:`audit-e1-direct-${target.key}`,difficulty:target.difficulty,sourceIds:[...target.sourceIds],
    correctIndex:ord.indexOf(0),authoringReviewApproved:false,generationSource:`${target.cpId}-AUDIT-WAVE-E1-V1`,
    qlId:(qlIds as any)[`cp${cpNum}`][0],
    locales:{
      en:{stem:target.stem.en,options:options('en'),explanation:`${target.label.en}: ${target.relation.en}.`},
      hi:{stem:target.stem.hi,options:options('hi'),explanation:`${target.label.hi}: ${target.relation.hi}।`},
      pa:{stem:target.stem.pa,options:options('pa'),explanation:`${target.label.pa}: ${target.relation.pa}।`},
    }
  };
}
function makeMatch(target:Fact):WorldGeographyQuestion{
  const rows=factOptions(target);
  const pairs=(lang:Language)=>[
    `${rows[0]!.label[lang]} — ${rows[0]!.relation[lang]}`,
    `${rows[1]!.label[lang]} — ${rows[2]!.relation[lang]}`,
    `${rows[2]!.label[lang]} — ${rows[3]!.relation[lang]}`,
    `${rows[3]!.label[lang]} — ${rows[1]!.relation[lang]}`,
  ];
  const ord=order(`${target.cpId}:${target.key}:match`);
  const options=(lang:Language)=>{const p=pairs(lang);return ord.map(i=>p[i]!);};
  const cpNum=target.cpId.slice(-3);
  const difficulty:Difficulty=target.difficulty==='Easy'?'Medium':'Hard';
  return {
    id:`${target.cpId}-Q-VP-E1-MATCH-${target.key}`.toUpperCase(),cpId:target.cpId,
    objective:`audit-e1-match-${target.key}`,difficulty,sourceIds:[...new Set(rows.flatMap(f=>f.sourceIds))],
    correctIndex:ord.indexOf(0),authoringReviewApproved:false,generationSource:`${target.cpId}-AUDIT-WAVE-E1-V1`,
    qlId:(qlIds as any)[`cp${cpNum}`][1],
    locales:{
      en:{stem:MATCH_STEMS[target.cpId].en,options:options('en'),explanation:`Correct relation: ${target.label.en} — ${target.relation.en}.`},
      hi:{stem:MATCH_STEMS[target.cpId].hi,options:options('hi'),explanation:`सही संबंध: ${target.label.hi} — ${target.relation.hi}।`},
      pa:{stem:MATCH_STEMS[target.cpId].pa,options:options('pa'),explanation:`ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।`},
    }
  };
}

function fmtTime(minutes:number,lang:Language){
  const h=Math.floor(minutes/60),m=minutes%60;
  if(lang==='en') return m?`${h} h ${m} min`:`${h} hours`;
  if(lang==='hi') return m?`${h} घंटे ${m} मिनट`:`${h} घंटे`;
  return m?`${h} ਘੰਟੇ ${m} ਮਿੰਟ`:`${h} ਘੰਟੇ`;
}
function fmtLon(deg:number,ew:'E'|'W',lang:Language){
  if(lang==='en') return `${deg}° ${ew}`;
  if(lang==='hi') return `${deg}° ${ew==='E'?'पूर्व':'पश्चिम'}`;
  return `${deg}° ${ew==='E'?'ਪੂਰਬ':'ਪੱਛਮ'}`;
}
function timeDistractors(target:TimeFact){
  const values=[target.minutes,target.minutes+60,Math.max(30,target.minutes-60),target.minutes+120];
  return values;
}
function lonDistractors(target:TimeFact){
  const vals=[target.degrees,target.degrees+15,Math.max(15,target.degrees-15),target.degrees+30];
  return vals;
}
function makeTimeFromLongitude(target:TimeFact):WorldGeographyQuestion{
  const id=`WGE-001-CP002-Q-VP-E1-TIME-${target.key}`.toUpperCase();
  const ord=order(`${id}:options`);
  const vals=timeDistractors(target);
  const options=(lang:Language)=>ord.map(i=>fmtTime(vals[i]!,lang));
  const side=target.eastWest;
  const stem:LocalizedValue={
    en:`A place lies ${target.degrees}° ${side} of Greenwich. What is the difference in mean local solar time from Greenwich?`,
    hi:`एक स्थान ग्रीनविच से ${target.degrees}° ${side==='E'?'पूर्व':'पश्चिम'} है। उसके माध्य स्थानीय सौर समय का ग्रीनविच से कितना अंतर होगा?`,
    pa:`ਇੱਕ ਸਥਾਨ ਗ੍ਰੀਨਵਿਚ ਤੋਂ ${target.degrees}° ${side==='E'?'ਪੂਰਬ':'ਪੱਛਮ'} ਵੱਲ ਹੈ। ਉਸ ਦੇ ਔਸਤ ਸਥਾਨਕ ਸੂਰਜੀ ਸਮੇਂ ਦਾ ਗ੍ਰੀਨਵਿਚ ਨਾਲ ਕਿੰਨਾ ਫ਼ਰਕ ਹੋਵੇਗਾ?`
  };
  return {
    id,cpId:'WGE-001-CP002',objective:`audit-e1-longitude-time-${target.key}`,difficulty:target.difficulty,
    sourceIds:['NOAA-LONGITUDE','NASA-EARTH'],correctIndex:ord.indexOf(0),authoringReviewApproved:false,
    generationSource:'WGE-001-CP002-AUDIT-WAVE-E1-V1',qlId:qlIds.cp002[0],
    locales:{
      en:{stem:stem.en,options:options('en'),explanation:`${target.degrees}° × 4 minutes per degree = ${target.minutes} minutes, or ${fmtTime(target.minutes,'en')}. Longitude determines the mean local solar-time difference.`},
      hi:{stem:stem.hi,options:options('hi'),explanation:`${target.degrees}° × 4 मिनट प्रति डिग्री = ${target.minutes} मिनट, अर्थात ${fmtTime(target.minutes,'hi')}। देशांतर से माध्य स्थानीय सौर समय का अंतर निर्धारित होता है।`},
      pa:{stem:stem.pa,options:options('pa'),explanation:`${target.degrees}° × 4 ਮਿੰਟ ਪ੍ਰਤੀ ਡਿਗਰੀ = ${target.minutes} ਮਿੰਟ, ਅਰਥਾਤ ${fmtTime(target.minutes,'pa')}। ਲੰਬਕਾਰ ਨਾਲ ਔਸਤ ਸਥਾਨਕ ਸੂਰਜੀ ਸਮੇਂ ਦਾ ਫ਼ਰਕ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।`},
    }
  };
}
function makeLongitudeFromTime(target:TimeFact):WorldGeographyQuestion{
  const id=`WGE-001-CP002-Q-VP-E1-LONGITUDE-${target.key}`.toUpperCase();
  const ord=order(`${id}:options`);
  const vals=lonDistractors(target);
  const options=(lang:Language)=>ord.map(i=>fmtLon(vals[i]!,target.eastWest,lang));
  const ahead=target.eastWest==='E';
  const stem:LocalizedValue={
    en:`A place is ${fmtTime(target.minutes,'en')} ${ahead?'ahead of':'behind'} Greenwich in mean local solar time. What is its longitude?`,
    hi:`किसी स्थान का माध्य स्थानीय सौर समय ग्रीनविच से ${fmtTime(target.minutes,'hi')} ${ahead?'आगे':'पीछे'} है। उसका देशांतर क्या है?`,
    pa:`ਕਿਸੇ ਸਥਾਨ ਦਾ ਔਸਤ ਸਥਾਨਕ ਸੂਰਜੀ ਸਮਾਂ ਗ੍ਰੀਨਵਿਚ ਤੋਂ ${fmtTime(target.minutes,'pa')} ${ahead?'ਅੱਗੇ':'ਪਿੱਛੇ'} ਹੈ। ਉਸ ਦਾ ਲੰਬਕਾਰ ਕੀ ਹੈ?`
  };
  return {
    id,cpId:'WGE-001-CP002',objective:`audit-e1-time-longitude-${target.key}`,difficulty:target.difficulty,
    sourceIds:['NOAA-LONGITUDE','NASA-EARTH'],correctIndex:ord.indexOf(0),authoringReviewApproved:false,
    generationSource:'WGE-001-CP002-AUDIT-WAVE-E1-V1',qlId:qlIds.cp002[1],
    locales:{
      en:{stem:stem.en,options:options('en'),explanation:`${target.minutes} minutes ÷ 4 minutes per degree = ${target.degrees}°. A time that is ${ahead?'ahead':'behind'} Greenwich indicates ${ahead?'east':'west'} longitude.`},
      hi:{stem:stem.hi,options:options('hi'),explanation:`${target.minutes} मिनट ÷ 4 मिनट प्रति डिग्री = ${target.degrees}°। ग्रीनविच से समय ${ahead?'आगे':'पीछे'} होने का अर्थ ${ahead?'पूर्वी':'पश्चिमी'} देशांतर है।`},
      pa:{stem:stem.pa,options:options('pa'),explanation:`${target.minutes} ਮਿੰਟ ÷ 4 ਮਿੰਟ ਪ੍ਰਤੀ ਡਿਗਰੀ = ${target.degrees}°। ਗ੍ਰੀਨਵਿਚ ਤੋਂ ਸਮਾਂ ${ahead?'ਅੱਗੇ':'ਪਿੱਛੇ'} ਹੋਣ ਦਾ ਅਰਥ ${ahead?'ਪੂਰਬੀ':'ਪੱਛਮੀ'} ਲੰਬਕਾਰ ਹੈ।`},
    }
  };
}

export const WGE_AUDIT_E1_VARIABLE_POOL_QUESTIONS_V1: readonly WorldGeographyQuestion[] = Object.freeze([
  ...FACTS.flatMap(f=>[makeDirect(f),makeMatch(f)]),
  ...TIME_FACTS.flatMap(f=>[makeTimeFromLongitude(f),makeLongitudeFromTime(f)]),
]);

export const WGE_AUDIT_E1_VARIABLE_POOL_QL_IDS_V1: readonly string[] = Object.freeze([
  ...qlIds.cp001,...qlIds.cp002,...qlIds.cp003,...qlIds.cp004,...qlIds.cp005,
]);
