import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language = 'en' | 'hi' | 'pa';
type LocalizedValue = Record<Language, string>;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type AuditFact = {
  cpId: 'WGE-001-CP037' | 'WGE-001-CP038' | 'WGE-001-CP039' | 'WGE-001-CP040';
  key: string;
  label: LocalizedValue;
  stem: LocalizedValue;
  relation: LocalizedValue;
  sourceIds: readonly string[];
  difficulty: Difficulty;
};

const FACTS: readonly AuditFact[] = [
  // CP037 — Transport, trade routes and ports
  {
    cpId: 'WGE-001-CP037', key: 'dry-port',
    label: { en: 'Dry port', hi: 'ड्राई पोर्ट', pa: 'ਡ੍ਰਾਈ ਪੋਰਟ' },
    stem: {
      en: 'An inland terminal handles customs and transfers containers between road or rail and a distant seaport. What is it called?',
      hi: 'एक अंतर्देशीय टर्मिनल सीमा-शुल्क कार्य करता है और सड़क या रेल से कंटेनरों को दूर स्थित समुद्री बंदरगाह से जोड़ता है। इसे क्या कहा जाता है?',
      pa: 'ਇੱਕ ਅੰਦਰੂਨੀ ਟਰਮੀਨਲ ਕਸਟਮ ਕਾਰਵਾਈ ਕਰਦਾ ਹੈ ਅਤੇ ਸੜਕ ਜਾਂ ਰੇਲ ਰਾਹੀਂ ਕੰਟੇਨਰਾਂ ਨੂੰ ਦੂਰਲੇ ਸਮੁੰਦਰੀ ਬੰਦਰਗਾਹ ਨਾਲ ਜੋੜਦਾ ਹੈ। ਇਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'an inland intermodal terminal connected to a seaport',
      hi: 'समुद्री बंदरगाह से जुड़ा अंतर्देशीय बहु-माध्यम टर्मिनल',
      pa: 'ਸਮੁੰਦਰੀ ਬੰਦਰਗਾਹ ਨਾਲ ਜੁੜਿਆ ਅੰਦਰੂਨੀ ਬਹੁ-ਮਾਧਿਅਮ ਟਰਮੀਨਲ'
    },
    sourceIds: ['WGE-TRN-UNCTAD', 'WGE-TRN-WB-CORRIDORS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP037', key: 'transshipment-hub',
    label: { en: 'Transshipment hub', hi: 'ट्रांसशिपमेंट केंद्र', pa: 'ਟਰਾਂਸਸ਼ਿਪਮੈਂਟ ਕੇਂਦਰ' },
    stem: {
      en: 'At a major port, containers are moved from one oceangoing vessel to another before continuing to their destination. What role is the port performing?',
      hi: 'एक बड़े बंदरगाह पर कंटेनर अंतिम गंतव्य की ओर बढ़ने से पहले एक समुद्री जहाज से दूसरे जहाज में स्थानांतरित किए जाते हैं। बंदरगाह की यह भूमिका क्या कहलाती है?',
      pa: 'ਇੱਕ ਵੱਡੇ ਬੰਦਰਗਾਹ ਉੱਤੇ ਕੰਟੇਨਰ ਮੰਜ਼ਿਲ ਵੱਲ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਸਮੁੰਦਰੀ ਜਹਾਜ਼ ਤੋਂ ਦੂਜੇ ਜਹਾਜ਼ ਵਿੱਚ ਚੜ੍ਹਾਏ ਜਾਂਦੇ ਹਨ। ਬੰਦਰਗਾਹ ਦੀ ਇਹ ਭੂਮਿਕਾ ਕੀ ਕਹਾਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'a port where cargo is transferred between ships',
      hi: 'वह बंदरगाह जहाँ माल एक जहाज से दूसरे जहाज में स्थानांतरित होता है',
      pa: 'ਉਹ ਬੰਦਰਗਾਹ ਜਿੱਥੇ ਮਾਲ ਇੱਕ ਜਹਾਜ਼ ਤੋਂ ਦੂਜੇ ਜਹਾਜ਼ ਵਿੱਚ ਤਬਦੀਲ ਹੁੰਦਾ ਹੈ'
    },
    sourceIds: ['WGE-TRN-UNCTAD'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP037', key: 'bulk-carrier',
    label: { en: 'Bulk carrier', hi: 'बल्क कैरियर', pa: 'ਬਲਕ ਕੈਰੀਅਰ' },
    stem: {
      en: 'Which type of ship is designed mainly to carry unpackaged dry cargo such as iron ore, coal or grain?',
      hi: 'लौह अयस्क, कोयला या अनाज जैसे बिना पैक किए सूखे माल को बड़ी मात्रा में ले जाने के लिए मुख्यतः किस प्रकार का जहाज बनाया जाता है?',
      pa: 'ਲੋਹ ਅਯਸਕ, ਕੋਲਾ ਜਾਂ ਅਨਾਜ ਵਰਗਾ ਬਿਨਾਂ ਪੈਕ ਕੀਤਾ ਸੁੱਕਾ ਮਾਲ ਵੱਡੀ ਮਾਤਰਾ ਵਿੱਚ ਲਿਜਾਣ ਲਈ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਜਹਾਜ਼ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'a vessel for large quantities of unpackaged dry cargo',
      hi: 'बड़ी मात्रा में बिना पैक किए सूखे माल के लिए जहाज',
      pa: 'ਵੱਡੀ ਮਾਤਰਾ ਵਿੱਚ ਬਿਨਾਂ ਪੈਕ ਕੀਤੇ ਸੁੱਕੇ ਮਾਲ ਲਈ ਜਹਾਜ਼'
    },
    sourceIds: ['WGE-TRN-UNCTAD'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP037', key: 'tanker',
    label: { en: 'Tanker', hi: 'टैंकर', pa: 'ਟੈਂਕਰ' },
    stem: {
      en: 'Crude oil has to be moved in very large quantities by sea. Which vessel type is most suited to this cargo?',
      hi: 'कच्चे तेल को समुद्र के रास्ते बहुत बड़ी मात्रा में ले जाना है। इस माल के लिए कौन-सा जहाज सबसे उपयुक्त है?',
      pa: 'ਕੱਚੇ ਤੇਲ ਨੂੰ ਸਮੁੰਦਰ ਰਾਹੀਂ ਬਹੁਤ ਵੱਡੀ ਮਾਤਰਾ ਵਿੱਚ ਲਿਜਾਣਾ ਹੈ। ਇਸ ਮਾਲ ਲਈ ਕਿਹੜਾ ਜਹਾਜ਼ ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਹੈ?'
    },
    relation: {
      en: 'a vessel designed for liquid bulk cargo',
      hi: 'तरल थोक माल के लिए बनाया गया जहाज',
      pa: 'ਤਰਲ ਥੋਕ ਮਾਲ ਲਈ ਬਣਾਇਆ ਗਿਆ ਜਹਾਜ਼'
    },
    sourceIds: ['WGE-TRN-UNCTAD', 'WGE-TRN-EIA'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP037', key: 'roll-on-roll-off',
    label: { en: 'Roll-on/roll-off service', hi: 'रोल-ऑन/रोल-ऑफ सेवा', pa: 'ਰੋਲ-ਆਨ/ਰੋਲ-ਆਫ ਸੇਵਾ' },
    stem: {
      en: 'Cars and trucks are driven directly onto a ship and driven off at the destination port. Which cargo system is being used?',
      hi: 'कारों और ट्रकों को सीधे जहाज पर चढ़ाया जाता है और गंतव्य बंदरगाह पर चलाकर उतारा जाता है। यह कौन-सी माल-परिवहन प्रणाली है?',
      pa: 'ਕਾਰਾਂ ਅਤੇ ਟਰੱਕ ਸਿੱਧੇ ਜਹਾਜ਼ ਉੱਤੇ ਚੜ੍ਹਾਏ ਜਾਂਦੇ ਹਨ ਅਤੇ ਮੰਜ਼ਿਲ ਦੇ ਬੰਦਰਗਾਹ ਉੱਤੇ ਚਲਾ ਕੇ ਉਤਾਰੇ ਜਾਂਦੇ ਹਨ। ਇਹ ਕਿਹੜੀ ਮਾਲ-ਆਵਾਜਾਈ ਪ੍ਰਣਾਲੀ ਹੈ?'
    },
    relation: {
      en: 'vehicle cargo driven onto and off a vessel',
      hi: 'वाहन-माल को जहाज पर चलाकर चढ़ाने और उतारने की व्यवस्था',
      pa: 'ਵਾਹਨ-ਮਾਲ ਨੂੰ ਜਹਾਜ਼ ਉੱਤੇ ਚਲਾ ਕੇ ਚੜ੍ਹਾਉਣ ਅਤੇ ਉਤਾਰਣ ਦੀ ਵਿਵਸਥਾ'
    },
    sourceIds: ['WGE-TRN-UNCTAD'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP037', key: 'chokepoint',
    label: { en: 'Maritime chokepoint', hi: 'समुद्री संकीर्ण मार्ग', pa: 'ਸਮੁੰਦਰੀ ਸੰਕੁਚਿਤ ਰਾਹ' },
    stem: {
      en: 'A narrow sea passage carries a large share of shipping, so its closure can force long detours. Which term best describes such a passage?',
      hi: 'एक संकरा समुद्री मार्ग बहुत अधिक जहाज यातायात वहन करता है, इसलिए उसके बंद होने पर लंबा वैकल्पिक मार्ग लेना पड़ सकता है। ऐसे मार्ग को क्या कहा जाता है?',
      pa: 'ਇੱਕ ਤੰਗ ਸਮੁੰਦਰੀ ਰਾਹ ਰਾਹੀਂ ਬਹੁਤ ਵੱਡੀ ਜਹਾਜ਼ੀ ਆਵਾਜਾਈ ਲੰਘਦੀ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੇ ਬੰਦ ਹੋਣ ਉੱਤੇ ਲੰਮਾ ਬਦਲਵਾਂ ਰਸਤਾ ਲੈਣਾ ਪੈ ਸਕਦਾ ਹੈ। ਅਜਿਹੇ ਰਾਹ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'a narrow strategic passage whose disruption can reroute shipping',
      hi: 'रणनीतिक संकरा मार्ग जिसके बाधित होने पर जहाजों का मार्ग बदल सकता है',
      pa: 'ਰਣਨੀਤਿਕ ਤੰਗ ਰਾਹ ਜਿਸ ਦੇ ਰੁਕਣ ਨਾਲ ਜਹਾਜ਼ੀ ਰਸਤੇ ਬਦਲ ਸਕਦੇ ਹਨ'
    },
    sourceIds: ['WGE-TRN-UNCTAD'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP037', key: 'hub-spoke',
    label: { en: 'Hub-and-spoke network', hi: 'हब-एंड-स्पोक नेटवर्क', pa: 'ਹੱਬ-ਐਂਡ-ਸਪੋਕ ਜਾਲ' },
    stem: {
      en: 'Smaller routes feed cargo into one major terminal, from which it is redistributed to many destinations. Which network pattern does this describe?',
      hi: 'छोटे मार्ग माल को एक बड़े टर्मिनल तक लाते हैं और वहाँ से वह कई गंतव्यों की ओर भेजा जाता है। यह किस नेटवर्क प्रतिरूप का वर्णन है?',
      pa: 'ਛੋਟੇ ਰਸਤੇ ਮਾਲ ਨੂੰ ਇੱਕ ਵੱਡੇ ਟਰਮੀਨਲ ਤੱਕ ਲਿਆਉਂਦੇ ਹਨ ਅਤੇ ਉੱਥੋਂ ਇਹ ਕਈ ਮੰਜ਼ਿਲਾਂ ਵੱਲ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੇ ਜਾਲੀ ਪੈਟਰਨ ਦਾ ਵਰਣਨ ਹੈ?'
    },
    relation: {
      en: 'flows concentrated through a major hub before redistribution',
      hi: 'प्रवाह को बड़े केंद्र पर एकत्र कर फिर विभिन्न दिशाओं में भेजना',
      pa: 'ਪ੍ਰਵਾਹ ਨੂੰ ਵੱਡੇ ਕੇਂਦਰ ਉੱਤੇ ਇਕੱਠਾ ਕਰਕੇ ਫਿਰ ਵੱਖ-ਵੱਖ ਦਿਸ਼ਾਵਾਂ ਵੱਲ ਭੇਜਣਾ'
    },
    sourceIds: ['WGE-TRN-UNCTAD', 'WGE-TRN-WB-CORRIDORS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP037', key: 'last-mile-road',
    label: { en: 'Road transport', hi: 'सड़क परिवहन', pa: 'ਸੜਕ ਆਵਾਜਾਈ' },
    stem: {
      en: 'For door-to-door delivery over the final short leg from a freight terminal, which transport mode usually offers the greatest route flexibility?',
      hi: 'माल टर्मिनल से अंतिम छोटी दूरी तक घर-दर-घर आपूर्ति के लिए सामान्यतः किस परिवहन साधन में सबसे अधिक मार्ग-लचीलापन होता है?',
      pa: 'ਮਾਲ ਟਰਮੀਨਲ ਤੋਂ ਆਖ਼ਰੀ ਛੋਟੀ ਦੂਰੀ ਤੱਕ ਘਰ-ਘਰ ਸਪੁਰਦਗੀ ਲਈ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੇ ਆਵਾਜਾਈ ਸਾਧਨ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਰਸਤਾ-ਲਚਕ ਹੁੰਦੀ ਹੈ?'
    },
    relation: {
      en: 'the most flexible mode for short door-to-door freight movement',
      hi: 'कम दूरी के घर-दर-घर माल परिवहन के लिए सबसे लचीला साधन',
      pa: 'ਛੋਟੀ ਦੂਰੀ ਦੇ ਘਰ-ਘਰ ਮਾਲ ਆਵਾਜਾਈ ਲਈ ਸਭ ਤੋਂ ਲਚਕੀਲਾ ਸਾਧਨ'
    },
    sourceIds: ['WGE-TRN-WB-CORRIDORS'], difficulty: 'Easy'
  },

  // CP038 — Spatial relationships and integrated geography
  {
    cpId: 'WGE-001-CP038', key: 'contour-interval',
    label: { en: 'Contour interval', hi: 'समोच्च अंतराल', pa: 'ਸਮੋਚ ਅੰਤਰਾਲ' },
    stem: {
      en: 'On one topographic map, adjacent contour lines differ by the same vertical amount. What is this fixed difference called?',
      hi: 'एक स्थलाकृतिक मानचित्र पर पास-पास की समोच्च रेखाओं के बीच ऊँचाई का अंतर समान है। इस निश्चित अंतर को क्या कहा जाता है?',
      pa: 'ਇੱਕ ਸਥਲਾਕ੍ਰਿਤੀ ਨਕਸ਼ੇ ਉੱਤੇ ਨਾਲ-ਨਾਲ ਸਮੋਚ ਰੇਖਾਵਾਂ ਵਿਚਕਾਰ ਉਚਾਈ ਦਾ ਅੰਤਰ ਇੱਕੋ ਜਿਹਾ ਹੈ। ਇਸ ਨਿਰਧਾਰਤ ਅੰਤਰ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'the vertical elevation difference between successive contour lines',
      hi: 'लगातार दो समोच्च रेखाओं के बीच ऊर्ध्वाधर ऊँचाई का अंतर',
      pa: 'ਲਗਾਤਾਰ ਦੋ ਸਮੋਚ ਰੇਖਾਵਾਂ ਵਿਚਕਾਰ ਖੜ੍ਹਵੀਂ ਉਚਾਈ ਦਾ ਅੰਤਰ'
    },
    sourceIds: ['NCERT-LANDFORMS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP038', key: 'drainage-divide',
    label: { en: 'Drainage divide', hi: 'जल-विभाजक', pa: 'ਜਲ-ਵਿਭਾਜਕ' },
    stem: {
      en: 'Rain falling on opposite sides of a ridge flows into different river basins. What is the ridge functioning as?',
      hi: 'एक पहाड़ी कटक के विपरीत ढालों पर गिरा वर्षाजल अलग-अलग नदी बेसिनों में बहता है। यह कटक किस रूप में कार्य कर रहा है?',
      pa: 'ਇੱਕ ਪਹਾੜੀ ਕੱਢ ਦੀਆਂ ਵਿਰੋਧੀ ਢਲਾਣਾਂ ਉੱਤੇ ਪਿਆ ਵਰਖਾ-ਜਲ ਵੱਖ-ਵੱਖ ਦਰਿਆਈ ਬੇਸਿਨਾਂ ਵਿੱਚ ਵਗਦਾ ਹੈ। ਇਹ ਕੱਢ ਕਿਸ ਰੂਪ ਵਿੱਚ ਕੰਮ ਕਰ ਰਹੀ ਹੈ?'
    },
    relation: {
      en: 'high ground separating neighbouring drainage basins',
      hi: 'पड़ोसी अपवाह बेसिनों को अलग करने वाली ऊँची भूमि',
      pa: 'ਨੇੜਲੇ ਨਿਕਾਸੀ ਬੇਸਿਨਾਂ ਨੂੰ ਵੱਖ ਕਰਨ ਵਾਲੀ ਉੱਚੀ ਧਰਤੀ'
    },
    sourceIds: ['NCERT-LANDFORMS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP038', key: 'impervious-runoff',
    label: { en: 'Increased surface runoff', hi: 'बढ़ा हुआ सतही अपवाह', pa: 'ਵਧਿਆ ਹੋਇਆ ਸਤਹੀ ਵਹਾਅ' },
    stem: {
      en: 'A catchment is rapidly covered by roads and concrete. After intense rain, which hydrological response is most likely to increase?',
      hi: 'एक जलग्रहण क्षेत्र में तेजी से सड़कें और कंक्रीट की सतहें बढ़ती हैं। तेज वर्षा के बाद कौन-सी जलवैज्ञानिक प्रतिक्रिया सबसे अधिक बढ़ने की संभावना है?',
      pa: 'ਇੱਕ ਜਲਗ੍ਰਹਿਣ ਖੇਤਰ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਸੜਕਾਂ ਅਤੇ ਕਾਂਕਰੀਟ ਦੀਆਂ ਸਤਹਾਂ ਵਧਦੀਆਂ ਹਨ। ਤੇਜ਼ ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਕਿਹੜੀ ਜਲ-ਵਿਗਿਆਨਕ ਪ੍ਰਤੀਕਿਰਿਆ ਵੱਧਣ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਸੰਭਾਵਨਾ ਹੈ?'
    },
    relation: {
      en: 'more water flowing over the surface when infiltration is reduced',
      hi: 'अवशोषण घटने पर सतह के ऊपर अधिक जल बहना',
      pa: 'ਜ਼ਮੀਨ ਵਿੱਚ ਰਿਸਾਅ ਘਟਣ ਉੱਤੇ ਸਤਹ ਉੱਤੇ ਵੱਧ ਪਾਣੀ ਵਗਣਾ'
    },
    sourceIds: ['NCERT-LANDFORMS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP038', key: 'upstream-sediment-trap',
    label: { en: 'Reduced downstream sediment supply', hi: 'नीचे की ओर कम तलछट आपूर्ति', pa: 'ਹੇਠਾਂ ਵੱਲ ਘੱਟ ਗਾਦ ਦੀ ਸਪਲਾਈ' },
    stem: {
      en: 'A large reservoir traps much of a river’s sediment upstream. Which downstream change is a direct consequence?',
      hi: 'एक बड़ा जलाशय नदी की बहुत-सी तलछट को ऊपर ही रोक लेता है। नीचे की ओर कौन-सा परिवर्तन इसका सीधा परिणाम है?',
      pa: 'ਇੱਕ ਵੱਡਾ ਜਲਾਸ਼ਯ ਦਰਿਆ ਦੀ ਕਾਫ਼ੀ ਗਾਦ ਨੂੰ ਉੱਪਰ ਹੀ ਰੋਕ ਲੈਂਦਾ ਹੈ। ਹੇਠਾਂ ਵੱਲ ਕਿਹੜਾ ਬਦਲਾਅ ਇਸ ਦਾ ਸਿੱਧਾ ਨਤੀਜਾ ਹੈ?'
    },
    relation: {
      en: 'less sediment reaching downstream reaches and the river mouth',
      hi: 'नदी के निचले भाग और मुहाने तक कम तलछट पहुँचना',
      pa: 'ਦਰਿਆ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ ਅਤੇ ਮੁਹਾਣੇ ਤੱਕ ਘੱਟ ਗਾਦ ਪਹੁੰਚਣਾ'
    },
    sourceIds: ['NCERT-LANDFORMS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP038', key: 'windward-rain',
    label: { en: 'Orographic rainfall', hi: 'पर्वतीय वर्षा', pa: 'ਪਹਾੜੀ ਵਰਖਾ' },
    stem: {
      en: 'Moist air is forced up a mountain slope, cools and produces rain on the windward side. Which rainfall mechanism is operating?',
      hi: 'नम हवा पर्वतीय ढाल पर ऊपर उठने के लिए बाध्य होती है, ठंडी होकर पवनाभिमुख ढाल पर वर्षा करती है। यह कौन-सी वर्षा प्रक्रिया है?',
      pa: 'ਨਮੀ ਵਾਲੀ ਹਵਾ ਪਹਾੜੀ ਢਲਾਣ ਉੱਤੇ ਚੜ੍ਹਨ ਲਈ ਮਜਬੂਰ ਹੁੰਦੀ ਹੈ, ਠੰਢੀ ਹੋ ਕੇ ਹਵਾ-ਵੱਲੀ ਢਲਾਣ ਉੱਤੇ ਮੀਂਹ ਪਾਂਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਰਖਾ ਪ੍ਰਕਿਰਿਆ ਹੈ?'
    },
    relation: {
      en: 'rain caused by moist air rising over relief',
      hi: 'स्थलरूप के ऊपर उठती नम हवा से होने वाली वर्षा',
      pa: 'ਭੂ-ਆਕ੍ਰਿਤੀ ਉੱਤੇ ਚੜ੍ਹਦੀ ਨਮੀ ਵਾਲੀ ਹਵਾ ਨਾਲ ਹੋਣ ਵਾਲੀ ਵਰਖਾ'
    },
    sourceIds: ['NCERT-LANDFORMS', 'WGE-ATM-013'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP038', key: 'upwelling-fisheries',
    label: { en: 'Coastal upwelling', hi: 'तटीय अपवेलिंग', pa: 'ਤਟਵਰਤੀ ਅਪਵੈਲਿੰਗ' },
    stem: {
      en: 'Winds move surface water away from a coast and colder nutrient-rich water rises from below. Which process is occurring?',
      hi: 'हवाएँ सतही जल को तट से दूर ले जाती हैं और नीचे से ठंडा, पोषक-तत्त्वों वाला जल ऊपर आता है। यह कौन-सी प्रक्रिया है?',
      pa: 'ਹਵਾਵਾਂ ਸਤਹੀ ਪਾਣੀ ਨੂੰ ਤਟ ਤੋਂ ਦੂਰ ਲੈ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਹੇਠਾਂ ਤੋਂ ਠੰਢਾ, ਪੋਸ਼ਕ ਤੱਤਾਂ ਵਾਲਾ ਪਾਣੀ ਉੱਪਰ ਆਉਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੈ?'
    },
    relation: {
      en: 'deep nutrient-rich water rising near a coast',
      hi: 'तट के पास गहरे पोषक-समृद्ध जल का ऊपर आना',
      pa: 'ਤਟ ਦੇ ਨੇੜੇ ਡੂੰਘੇ ਪੋਸ਼ਕ-ਭਰਪੂਰ ਪਾਣੀ ਦਾ ਉੱਪਰ ਆਉਣਾ'
    },
    sourceIds: ['WGE-REG-UN-MAPS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP038', key: 'floodplain-exposure',
    label: { en: 'Flood exposure', hi: 'बाढ़ जोखिम-उद्भासन', pa: 'ਹੜ੍ਹ-ਖਤਰੇ ਨਾਲ ਸਾਮਣਾ' },
    stem: {
      en: 'Two equally strong floods occur, but the one passing through a densely settled floodplain causes much greater damage. Which factor best explains the difference?',
      hi: 'दो समान तीव्रता की बाढ़ आती हैं, पर घनी आबादी वाले बाढ़-मैदान से गुजरने वाली बाढ़ अधिक नुकसान करती है। अंतर का सबसे अच्छा कारण क्या है?',
      pa: 'ਦੋ ਇੱਕੋ ਜਿਹੀ ਤੀਬਰਤਾ ਵਾਲੇ ਹੜ੍ਹ ਆਉਂਦੇ ਹਨ, ਪਰ ਘਣੀ ਆਬਾਦੀ ਵਾਲੇ ਹੜ੍ਹ-ਮੈਦਾਨ ਵਿੱਚੋਂ ਲੰਘਣ ਵਾਲਾ ਹੜ੍ਹ ਵੱਧ ਨੁਕਸਾਨ ਕਰਦਾ ਹੈ। ਇਸ ਅੰਤਰ ਦਾ ਸਭ ਤੋਂ ਚੰਗਾ ਕਾਰਨ ਕੀ ਹੈ?'
    },
    relation: {
      en: 'more people and assets located in the hazard zone',
      hi: 'खतरे वाले क्षेत्र में अधिक लोग और संपत्ति होना',
      pa: 'ਖਤਰੇ ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ ਵੱਧ ਲੋਕ ਅਤੇ ਸੰਪਤੀ ਹੋਣਾ'
    },
    sourceIds: ['NCERT-LANDFORMS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP038', key: 'altitude-temperature',
    label: { en: 'Altitude effect', hi: 'ऊँचाई का प्रभाव', pa: 'ਉਚਾਈ ਦਾ ਪ੍ਰਭਾਵ' },
    stem: {
      en: 'Two places lie at nearly the same latitude, but one is much cooler because it is high in the mountains. Which control best explains the difference?',
      hi: 'दो स्थान लगभग एक ही अक्षांश पर हैं, पर पहाड़ों में अधिक ऊँचाई पर स्थित स्थान काफी ठंडा है। इस अंतर का मुख्य कारण क्या है?',
      pa: 'ਦੋ ਥਾਵਾਂ ਲਗਭਗ ਇੱਕੋ ਅਕਸ਼ਾਂਸ਼ ਉੱਤੇ ਹਨ, ਪਰ ਪਹਾੜਾਂ ਵਿੱਚ ਵੱਧ ਉਚਾਈ ਵਾਲੀ ਥਾਂ ਕਾਫ਼ੀ ਠੰਢੀ ਹੈ। ਇਸ ਅੰਤਰ ਦਾ ਮੁੱਖ ਕਾਰਨ ਕੀ ਹੈ?'
    },
    relation: {
      en: 'temperature generally decreases with increasing elevation in the lower atmosphere',
      hi: 'निचले वायुमंडल में ऊँचाई बढ़ने पर सामान्यतः तापमान घटना',
      pa: 'ਹੇਠਲੇ ਵਾਤਾਵਰਣ ਵਿੱਚ ਉਚਾਈ ਵਧਣ ਨਾਲ ਆਮ ਤੌਰ ਉੱਤੇ ਤਾਪਮਾਨ ਘਟਣਾ'
    },
    sourceIds: ['WGE-ATM-013'], difficulty: 'Easy'
  },

  // CP039 — Qualified records and common confusions
  {
    cpId: 'WGE-001-CP039', key: 'largest-island-qualifier',
    label: { en: 'Greenland', hi: 'ग्रीनलैंड', pa: 'ਗ੍ਰੀਨਲੈਂਡ' },
    stem: {
      en: 'When continents are excluded from the category, which landmass is conventionally identified as the world’s largest island?',
      hi: 'जब महाद्वीपों को द्वीप की श्रेणी से अलग रखा जाता है, तब विश्व का सबसे बड़ा द्वीप सामान्यतः किसे माना जाता है?',
      pa: 'ਜਦੋਂ ਮਹਾਂਦੀਪਾਂ ਨੂੰ ਟਾਪੂ ਦੀ ਸ਼੍ਰੇਣੀ ਤੋਂ ਵੱਖ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਟਾਪੂ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'largest island when continents such as Australia are excluded',
      hi: 'महाद्वीपों, जैसे ऑस्ट्रेलिया, को अलग रखने पर सबसे बड़ा द्वीप',
      pa: 'ਆਸਟ੍ਰੇਲੀਆ ਵਰਗੇ ਮਹਾਂਦੀਪਾਂ ਨੂੰ ਵੱਖ ਰੱਖਣ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਟਾਪੂ'
    },
    sourceIds: ['WGE-REG-M49', 'WGE-REG-DENMARK-GREENLAND'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP039', key: 'caspian-area',
    label: { en: 'Caspian Sea', hi: 'कैस्पियन सागर', pa: 'ਕੈਸਪੀਅਨ ਸਾਗਰ' },
    stem: {
      en: 'Which inland water body is generally ranked largest by surface area when saline lakes are included?',
      hi: 'जब खारे जल वाली झीलों को भी शामिल किया जाता है, तब सतही क्षेत्रफल के आधार पर सबसे बड़ा अंतर्देशीय जल निकाय सामान्यतः कौन-सा माना जाता है?',
      pa: 'ਜਦੋਂ ਖਾਰੇ ਪਾਣੀ ਵਾਲੀਆਂ ਝੀਲਾਂ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਸਤਹੀ ਖੇਤਰਫਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਦਰੂਨੀ ਜਲ-ਸਰੋਤ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'largest inland water body by surface area when saline lakes are counted',
      hi: 'खारी झीलों सहित सतही क्षेत्रफल के आधार पर सबसे बड़ा अंतर्देशीय जल निकाय',
      pa: 'ਖਾਰੀਆਂ ਝੀਲਾਂ ਸਮੇਤ ਸਤਹੀ ਖੇਤਰਫਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਦਰੂਨੀ ਜਲ-ਸਰੋਤ'
    },
    sourceIds: ['WGE-PHY-020A', 'WGE-PHY-020B'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP039', key: 'superior-fresh-area',
    label: { en: 'Lake Superior', hi: 'लेक सुपीरियर', pa: 'ਲੇਕ ਸੁਪੀਰੀਅਰ' },
    stem: {
      en: 'Which lake is commonly identified as the largest freshwater lake by surface area?',
      hi: 'सतही क्षेत्रफल के आधार पर सामान्यतः सबसे बड़ी मीठे पानी की झील कौन-सी मानी जाती है?',
      pa: 'ਸਤਹੀ ਖੇਤਰਫਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਆਮ ਤੌਰ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਝੀਲ ਕਿਹੜੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'largest freshwater lake by surface area',
      hi: 'सतही क्षेत्रफल के आधार पर सबसे बड़ी मीठे पानी की झील',
      pa: 'ਸਤਹੀ ਖੇਤਰਫਲ ਦੇ ਆਧਾਰ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਝੀਲ'
    },
    sourceIds: ['WGE-REC-EPA-GREAT-LAKES'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP039', key: 'baikal-volume',
    label: { en: 'Lake Baikal', hi: 'बैकाल झील', pa: 'ਬੈਕਾਲ ਝੀਲ' },
    stem: {
      en: 'Which lake is commonly identified as containing the greatest volume of liquid freshwater?',
      hi: 'तरल मीठे पानी की सबसे अधिक मात्रा रखने वाली झील सामान्यतः कौन-सी मानी जाती है?',
      pa: 'ਤਰਲ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਮਾਤਰਾ ਰੱਖਣ ਵਾਲੀ ਝੀਲ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'the freshwater lake with the greatest volume',
      hi: 'सबसे अधिक आयतन वाली मीठे पानी की झील',
      pa: 'ਸਭ ਤੋਂ ਵੱਧ ਆਇਤਨ ਵਾਲੀ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਝੀਲ'
    },
    sourceIds: ['WGE-PHY-020A', 'WGE-PHY-020B'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP039', key: 'antarctica-desert',
    label: { en: 'Antarctica', hi: 'अंटार्कटिका', pa: 'ਅੰਟਾਰਕਟਿਕਾ' },
    stem: {
      en: 'If a desert is defined by very low precipitation rather than high temperature, which region is the world’s largest desert?',
      hi: 'यदि मरुस्थल को उच्च तापमान के बजाय बहुत कम वर्षा के आधार पर परिभाषित किया जाए, तो विश्व का सबसे बड़ा मरुस्थल कौन-सा क्षेत्र है?',
      pa: 'ਜੇ ਰੇਗਿਸਤਾਨ ਨੂੰ ਉੱਚੇ ਤਾਪਮਾਨ ਦੀ ਬਜਾਏ ਬਹੁਤ ਘੱਟ ਵਰਖਾ ਦੇ ਆਧਾਰ ਉੱਤੇ ਪਰਿਭਾਸ਼ਿਤ ਕੀਤਾ ਜਾਵੇ, ਤਾਂ ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਰੇਗਿਸਤਾਨ ਕਿਹੜਾ ਖੇਤਰ ਹੈ?'
    },
    relation: {
      en: 'largest desert when polar deserts are included',
      hi: 'ध्रुवीय मरुस्थलों को शामिल करने पर सबसे बड़ा मरुस्थल',
      pa: 'ਧਰੁਵੀ ਰੇਗਿਸਤਾਨਾਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ ਉੱਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਰੇਗਿਸਤਾਨ'
    },
    sourceIds: ['WGE-PHY-021A', 'WGE-PHY-021C'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP039', key: 'sahara-hot-desert',
    label: { en: 'Sahara', hi: 'सहारा', pa: 'ਸਹਾਰਾ' },
    stem: {
      en: 'Which region is conventionally identified as the world’s largest hot desert?',
      hi: 'विश्व का सबसे बड़ा गर्म मरुस्थल सामान्यतः किस क्षेत्र को माना जाता है?',
      pa: 'ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਗਰਮ ਰੇਗਿਸਤਾਨ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜੇ ਖੇਤਰ ਨੂੰ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'largest hot desert',
      hi: 'सबसे बड़ा गर्म मरुस्थल',
      pa: 'ਸਭ ਤੋਂ ਵੱਡਾ ਗਰਮ ਰੇਗਿਸਤਾਨ'
    },
    sourceIds: ['WGE-PHY-021A', 'WGE-PHY-021C'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP039', key: 'river-length-method',
    label: { en: 'Measurement method', hi: 'मापन-पद्धति', pa: 'ਮਾਪਣ ਦੀ ਵਿਧੀ' },
    stem: {
      en: 'Two reliable references give slightly different lengths for the same major river. What most plausibly explains the difference?',
      hi: 'दो विश्वसनीय स्रोत एक ही बड़ी नदी की लंबाई थोड़ी अलग बताते हैं। इस अंतर का सबसे संभावित कारण क्या है?',
      pa: 'ਦੋ ਭਰੋਸੇਯੋਗ ਸਰੋਤ ਇੱਕੋ ਵੱਡੇ ਦਰਿਆ ਦੀ ਲੰਬਾਈ ਥੋੜ੍ਹੀ ਵੱਖ ਦੱਸਦੇ ਹਨ। ਇਸ ਅੰਤਰ ਦਾ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਕਾਰਨ ਕੀ ਹੈ?'
    },
    relation: {
      en: 'different source-point, channel or measurement choices can change reported river length',
      hi: 'उद्गम-बिंदु, नदी-मार्ग या मापन-पद्धति के अलग चुनाव से बताई गई लंबाई बदल सकती है',
      pa: 'ਸਰੋਤ-ਬਿੰਦੂ, ਦਰਿਆਈ ਰਸਤੇ ਜਾਂ ਮਾਪਣ ਦੀ ਵਿਧੀ ਦੇ ਵੱਖਰੇ ਚੋਣ ਨਾਲ ਦੱਸੀ ਲੰਬਾਈ ਬਦਲ ਸਕਦੀ ਹੈ'
    },
    sourceIds: ['WGE-PHY-019A'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP039', key: 'territory-sovereignty',
    label: { en: 'Dependent territory', hi: 'आश्रित क्षेत्र', pa: 'ਆਸ਼੍ਰਿਤ ਖੇਤਰ' },
    stem: {
      en: 'A place has its own local administration but is not a sovereign state in the same sense as an independent country. Which classification avoids the common confusion?',
      hi: 'किसी स्थान का अपना स्थानीय प्रशासन है, पर वह स्वतंत्र देश की तरह संप्रभु राज्य नहीं है। सामान्य भ्रम से बचने के लिए कौन-सा वर्गीकरण सही है?',
      pa: 'ਕਿਸੇ ਥਾਂ ਦਾ ਆਪਣਾ ਸਥਾਨਕ ਪ੍ਰਸ਼ਾਸਨ ਹੈ, ਪਰ ਇਹ ਇੱਕ ਆਜ਼ਾਦ ਦੇਸ਼ ਵਾਂਗ ਸਰਬਭੌਮ ਰਾਜ ਨਹੀਂ ਹੈ। ਆਮ ਭੁਲੇਖੇ ਤੋਂ ਬਚਣ ਲਈ ਕਿਹੜੀ ਵਰਗੀਕਰਨ ਠੀਕ ਹੈ?'
    },
    relation: {
      en: 'a territory that is not itself a sovereign independent state',
      hi: 'ऐसा क्षेत्र जो स्वयं संप्रभु स्वतंत्र राज्य नहीं है',
      pa: 'ਅਜਿਹਾ ਖੇਤਰ ਜੋ ਆਪਣੇ ਆਪ ਵਿੱਚ ਸਰਬਭੌਮ ਆਜ਼ਾਦ ਰਾਜ ਨਹੀਂ ਹੈ'
    },
    sourceIds: ['WGE-REG-M49', 'WGE-REG-UNGEGN'], difficulty: 'Medium'
  },

  // CP040 — Advanced geographic applications
  {
    cpId: 'WGE-001-CP040', key: 'representative-fraction',
    label: { en: 'Representative fraction', hi: 'प्रतिनिधि भिन्न', pa: 'ਪ੍ਰਤੀਨਿਧੀ ਭਿੰਨ' },
    stem: {
      en: 'A map scale is written as 1:50,000. Which term describes this numerical form of scale?',
      hi: 'किसी मानचित्र का पैमाना 1:50,000 लिखा है। पैमाने के इस संख्यात्मक रूप को क्या कहा जाता है?',
      pa: 'ਕਿਸੇ ਨਕਸ਼ੇ ਦਾ ਪੈਮਾਨਾ 1:50,000 ਲਿਖਿਆ ਹੈ। ਪੈਮਾਨੇ ਦੇ ਇਸ ਅੰਕੀ ਰੂਪ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'a map scale expressed as a ratio such as 1:50,000',
      hi: '1:50,000 जैसे अनुपात में व्यक्त मानचित्र पैमाना',
      pa: '1:50,000 ਵਰਗੇ ਅਨੁਪਾਤ ਵਿੱਚ ਦਰਸਾਇਆ ਨਕਸ਼ਾ ਪੈਮਾਨਾ'
    },
    sourceIds: ['WGE-REG-UN-MAPS'], difficulty: 'Easy'
  },
  {
    cpId: 'WGE-001-CP040', key: 'great-circle',
    label: { en: 'Great-circle route', hi: 'महावृत्त मार्ग', pa: 'ਮਹਾਵ੍ਰਿਤ ਰਾਹ' },
    stem: {
      en: 'For two distant points on a spherical Earth, which route represents the shortest surface path between them?',
      hi: 'गोलाकार पृथ्वी पर दो दूर स्थित बिंदुओं के बीच सतह पर सबसे छोटा मार्ग किस प्रकार का होता है?',
      pa: 'ਗੋਲਾਕਾਰ ਧਰਤੀ ਉੱਤੇ ਦੋ ਦੂਰਲੇ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਸਤਹ ਉੱਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਰਾਹ ਕਿਹੜਾ ਹੁੰਦਾ ਹੈ?'
    },
    relation: {
      en: 'the shortest surface path between two points on a sphere',
      hi: 'गोले की सतह पर दो बिंदुओं के बीच सबसे छोटा मार्ग',
      pa: 'ਗੋਲੇ ਦੀ ਸਤਹ ਉੱਤੇ ਦੋ ਬਿੰਦੂਆਂ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਛੋਟਾ ਰਾਹ'
    },
    sourceIds: ['WGE-REG-UN-MAPS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP040', key: 'projection-distortion',
    label: { en: 'Map projection distortion', hi: 'मानचित्र प्रक्षेप विकृति', pa: 'ਨਕਸ਼ਾ ਪ੍ਰੋਜੈਕਸ਼ਨ ਵਿਕ੍ਰਿਤੀ' },
    stem: {
      en: 'Why can a flat world map not preserve area, shape, distance and direction perfectly everywhere at the same time?',
      hi: 'समतल विश्व मानचित्र हर स्थान पर क्षेत्रफल, आकार, दूरी और दिशा को एक साथ पूर्ण रूप से सही क्यों नहीं रख सकता?',
      pa: 'ਸਮਤਲ ਵਿਸ਼ਵ ਨਕਸ਼ਾ ਹਰ ਥਾਂ ਖੇਤਰਫਲ, ਆਕਾਰ, ਦੂਰੀ ਅਤੇ ਦਿਸ਼ਾ ਨੂੰ ਇੱਕੋ ਸਮੇਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹੀ ਕਿਉਂ ਨਹੀਂ ਰੱਖ ਸਕਦਾ?'
    },
    relation: {
      en: 'flattening a curved surface necessarily alters some spatial properties',
      hi: 'वक्र सतह को समतल करने पर कुछ स्थानिक गुणों में बदलाव अनिवार्य है',
      pa: 'ਵਕਰੀ ਸਤਹ ਨੂੰ ਸਮਤਲ ਕਰਨ ਨਾਲ ਕੁਝ ਸਥਾਨਕ ਗੁਣਾਂ ਵਿੱਚ ਬਦਲਾਅ ਲਾਜ਼ਮੀ ਹੈ'
    },
    sourceIds: ['WGE-REG-UN-MAPS'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP040', key: 'rain-shadow',
    label: { en: 'Rain-shadow effect', hi: 'वर्षाछाया प्रभाव', pa: 'ਵਰਖਾ-ਛਾਂ ਪ੍ਰਭਾਵ' },
    stem: {
      en: 'A mountain range has a wet windward slope and a much drier leeward interior. Which process best explains the contrast?',
      hi: 'एक पर्वत-श्रेणी की पवनाभिमुख ढाल नम है और पवनविमुख आंतरिक भाग काफी शुष्क है। इस अंतर को कौन-सी प्रक्रिया सबसे अच्छी तरह समझाती है?',
      pa: 'ਇੱਕ ਪਹਾੜੀ ਲੜੀ ਦੀ ਹਵਾ-ਵੱਲੀ ਢਲਾਣ ਨਮੀ ਵਾਲੀ ਹੈ ਅਤੇ ਹਵਾ ਤੋਂ ਉਲਟੀ ਅੰਦਰੂਨੀ ਢਲਾਣ ਕਾਫ਼ੀ ਸੁੱਕੀ ਹੈ। ਇਸ ਅੰਤਰ ਨੂੰ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?'
    },
    relation: {
      en: 'drying on the leeward side after moist air rises and loses moisture on windward slopes',
      hi: 'नम हवा के पवनाभिमुख ढाल पर उठकर वर्षा करने के बाद पवनविमुख भाग का शुष्क होना',
      pa: 'ਨਮੀ ਵਾਲੀ ਹਵਾ ਦੇ ਹਵਾ-ਵੱਲੀ ਢਲਾਣ ਉੱਤੇ ਚੜ੍ਹ ਕੇ ਮੀਂਹ ਪਾਉਣ ਤੋਂ ਬਾਅਦ ਉਲਟੀ ਢਲਾਣ ਦਾ ਸੁੱਕਾ ਹੋਣਾ'
    },
    sourceIds: ['WGE-ATM-013', 'WGE-REG-PHYSICAL-WORLD'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP040', key: 'port-siting',
    label: { en: 'Port-site suitability', hi: 'बंदरगाह-स्थल उपयुक्तता', pa: 'ਬੰਦਰਗਾਹ-ਸਥਾਨ ਦੀ ਉਚਿਤਤਾ' },
    stem: {
      en: 'A proposed port has deep sheltered water, but poor links to inland markets. Which missing factor most limits its wider economic usefulness?',
      hi: 'प्रस्तावित बंदरगाह के पास गहरा और सुरक्षित जल है, पर अंतर्देशीय बाजारों से संपर्क कमजोर है। कौन-सा अभाव उसकी व्यापक आर्थिक उपयोगिता को सबसे अधिक सीमित करता है?',
      pa: 'ਪ੍ਰਸਤਾਵਿਤ ਬੰਦਰਗਾਹ ਕੋਲ ਡੂੰਘਾ ਅਤੇ ਸੁਰੱਖਿਅਤ ਪਾਣੀ ਹੈ, ਪਰ ਅੰਦਰੂਨੀ ਬਾਜ਼ਾਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਮਜ਼ੋਰ ਹੈ। ਕਿਹੜੀ ਘਾਟ ਇਸ ਦੀ ਵਿਆਪਕ ਆਰਥਿਕ ਉਪਯੋਗਤਾ ਨੂੰ ਸਭ ਤੋਂ ਵੱਧ ਸੀਮਿਤ ਕਰਦੀ ਹੈ?'
    },
    relation: {
      en: 'effective port use depends on both harbour conditions and inland connectivity',
      hi: 'बंदरगाह की उपयोगिता बंदरगाह दशाओं और अंतर्देशीय संपर्क दोनों पर निर्भर करती है',
      pa: 'ਬੰਦਰਗਾਹ ਦੀ ਉਪਯੋਗਤਾ ਬੰਦਰਗਾਹੀ ਹਾਲਾਤਾਂ ਅਤੇ ਅੰਦਰੂਨੀ ਸੰਪਰਕ ਦੋਵਾਂ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ'
    },
    sourceIds: ['WGE-TRN-UNCTAD', 'WGE-TRN-WB-CORRIDORS'], difficulty: 'Hard'
  },
  {
    cpId: 'WGE-001-CP040', key: 'solar-resource',
    label: { en: 'High solar-energy potential', hi: 'उच्च सौर-ऊर्जा क्षमता', pa: 'ਉੱਚ ਸੂਰਜੀ-ਊਰਜਾ ਸੰਭਾਵਨਾ' },
    stem: {
      en: 'Which combination most strongly favours large-scale solar power generation in a hot desert region?',
      hi: 'गर्म मरुस्थलीय क्षेत्र में बड़े पैमाने पर सौर ऊर्जा उत्पादन के लिए कौन-सा संयोजन सबसे अनुकूल है?',
      pa: 'ਗਰਮ ਰੇਗਿਸਤਾਨੀ ਖੇਤਰ ਵਿੱਚ ਵੱਡੇ ਪੱਧਰ ਉੱਤੇ ਸੂਰਜੀ ਊਰਜਾ ਉਤਪਾਦਨ ਲਈ ਕਿਹੜਾ ਜੋੜ ਸਭ ਤੋਂ ਅਨੁਕੂਲ ਹੈ?'
    },
    relation: {
      en: 'strong insolation, frequent clear skies and suitable available land',
      hi: 'तीव्र सौर विकिरण, प्रायः साफ आकाश और उपयुक्त उपलब्ध भूमि',
      pa: 'ਤੀਬਰ ਸੂਰਜੀ ਕਿਰਣਾਂ, ਅਕਸਰ ਸਾਫ਼ ਆਕਾਸ਼ ਅਤੇ ਉਚਿਤ ਉਪਲਬਧ ਧਰਤੀ'
    },
    sourceIds: ['WGE-RES-IEA-ENERGY'], difficulty: 'Medium'
  },
  {
    cpId: 'WGE-001-CP040', key: 'drainage-divide-road',
    label: { en: 'Drainage-divide alignment', hi: 'जल-विभाजक के साथ मार्ग', pa: 'ਜਲ-ਵਿਭਾਜਕ ਨਾਲ ਰਸਤਾ' },
    stem: {
      en: 'A route planner wants to reduce repeated river crossings across a dissected upland. Which broad alignment is usually most helpful?',
      hi: 'एक मार्ग योजनाकार कटी-फटी ऊँची भूमि में बार-बार नदी पार करने से बचना चाहता है। सामान्यतः कौन-सा व्यापक मार्ग-संरेखण सबसे उपयोगी होगा?',
      pa: 'ਇੱਕ ਰਸਤਾ ਯੋਜਨਾਕਾਰ ਕੱਟੀ-ਫੱਟੀ ਉੱਚੀ ਧਰਤੀ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਦਰਿਆ ਪਾਰ ਕਰਨ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹੈ। ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਹੜਾ ਵਿਆਪਕ ਰਸਤਾ-ਸੰਰੇਖਣ ਸਭ ਤੋਂ ਮਦਦਗਾਰ ਹੋਵੇਗਾ?'
    },
    relation: {
      en: 'following higher divides can reduce the number of major stream crossings',
      hi: 'ऊँचे जल-विभाजकों के साथ चलने से बड़े नदी-पारों की संख्या घट सकती है',
      pa: 'ਉੱਚੇ ਜਲ-ਵਿਭਾਜਕਾਂ ਨਾਲ ਚੱਲਣ ਨਾਲ ਵੱਡੇ ਦਰਿਆਈ ਪਾਰਾਂ ਦੀ ਗਿਣਤੀ ਘਟ ਸਕਦੀ ਹੈ'
    },
    sourceIds: ['WGE-REG-PHYSICAL-WORLD', 'WGE-TRN-WB-CORRIDORS'], difficulty: 'Hard'
  },
  {
    cpId: 'WGE-001-CP040', key: 'current-coastal-climate',
    label: { en: 'Ocean-current influence', hi: 'महासागरीय धारा का प्रभाव', pa: 'ਮਹਾਂਸਾਗਰੀ ਧਾਰਾ ਦਾ ਪ੍ਰਭਾਵ' },
    stem: {
      en: 'Two west-coast locations at similar latitudes have different temperatures because one is beside a warm current and the other beside a cold current. Which control is being demonstrated?',
      hi: 'समान अक्षांशों पर स्थित दो पश्चिमी तटीय स्थानों का तापमान अलग है क्योंकि एक के पास गर्म और दूसरे के पास ठंडी महासागरीय धारा बहती है। यह किस नियंत्रण को दर्शाता है?',
      pa: 'ਇੱਕੋ ਜਿਹੇ ਅਕਸ਼ਾਂਸ਼ਾਂ ਉੱਤੇ ਦੋ ਪੱਛਮੀ ਤਟਵਰਤੀ ਥਾਵਾਂ ਦੇ ਤਾਪਮਾਨ ਵੱਖ ਹਨ ਕਿਉਂਕਿ ਇੱਕ ਕੋਲ ਗਰਮ ਅਤੇ ਦੂਜੇ ਕੋਲ ਠੰਢੀ ਮਹਾਂਸਾਗਰੀ ਧਾਰਾ ਵਗਦੀ ਹੈ। ਇਹ ਕਿਹੜੇ ਨਿਯੰਤਰਕ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?'
    },
    relation: {
      en: 'warm and cold currents can modify temperatures along nearby coasts',
      hi: 'गर्म और ठंडी धाराएँ पास के तटों के तापमान को प्रभावित कर सकती हैं',
      pa: 'ਗਰਮ ਅਤੇ ਠੰਢੀਆਂ ਧਾਰਾਵਾਂ ਨੇੜਲੇ ਤਟਾਂ ਦੇ ਤਾਪਮਾਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੀਆਂ ਹਨ'
    },
    sourceIds: ['WGE-REG-PHYSICAL-WORLD'], difficulty: 'Medium'
  }
];

const QL_IDS: Readonly<Record<AuditFact['cpId'], readonly [string, string]>> = {
  'WGE-001-CP037': ['WGE-001-CP037-QL-AUDIT-DIRECT-V1', 'WGE-001-CP037-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP038': ['WGE-001-CP038-QL-AUDIT-DIRECT-V1', 'WGE-001-CP038-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP039': ['WGE-001-CP039-QL-AUDIT-DIRECT-V1', 'WGE-001-CP039-QL-AUDIT-MATCH-V1'],
  'WGE-001-CP040': ['WGE-001-CP040-QL-AUDIT-DIRECT-V1', 'WGE-001-CP040-QL-AUDIT-MATCH-V1'],
};

const MATCH_STEMS: Readonly<Record<AuditFact['cpId'], LocalizedValue>> = {
  'WGE-001-CP037': {
    en: 'Which transport or trade term is correctly matched with its description?',
    hi: 'परिवहन या व्यापार का कौन-सा पद अपने विवरण से सही सुमेलित है?',
    pa: 'ਆਵਾਜਾਈ ਜਾਂ ਵਪਾਰ ਦਾ ਕਿਹੜਾ ਸ਼ਬਦ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'
  },
  'WGE-001-CP038': {
    en: 'Which geographic relationship is correctly matched with its description?',
    hi: 'कौन-सा भौगोलिक संबंध अपने विवरण से सही सुमेलित है?',
    pa: 'ਕਿਹੜਾ ਭੂਗੋਲਿਕ ਸੰਬੰਧ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'
  },
  'WGE-001-CP039': {
    en: 'Which qualified geographic statement is correctly matched?',
    hi: 'कौन-सा योग्यतायुक्त भौगोलिक कथन सही सुमेलित है?',
    pa: 'ਕਿਹੜਾ ਸ਼ਰਤ-ਸਪਸ਼ਟ ਭੂਗੋਲਿਕ ਕਥਨ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'
  },
  'WGE-001-CP040': {
    en: 'Which applied-geography concept is correctly matched with its description?',
    hi: 'अनुप्रयुक्त भूगोल की कौन-सी अवधारणा अपने विवरण से सही सुमेलित है?',
    pa: 'ਲਾਗੂ ਭੂਗੋਲ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'
  }
};

const cpFacts = (cpId: AuditFact['cpId']) => FACTS.filter(f => f.cpId === cpId);

function optionFacts(target: AuditFact): readonly AuditFact[] {
  const peers = cpFacts(target.cpId);
  const index = peers.findIndex(f => f.key === target.key);
  if (peers.length !== 8 || index < 0) throw new Error(`Expected eight audit facts for ${target.cpId}`);
  return [
    target,
    peers[(index + 1) % peers.length]!,
    peers[(index + 3) % peers.length]!,
    peers[(index + 5) % peers.length]!,
  ];
}

function shuffled<T>(target: AuditFact, family: string, values: readonly T[]) {
  const order = deterministicShuffle([0, 1, 2, 3], `${target.cpId}:${target.key}:${family}`);
  return { order, values: order.map(i => values[i]!) };
}

function makeDirect(target: AuditFact): WorldGeographyQuestion {
  const rows = optionFacts(target);
  const en = shuffled(target, 'direct-en', rows.map(f => f.label.en));
  const hi = shuffled(target, 'direct-hi', rows.map(f => f.label.hi));
  const pa = shuffled(target, 'direct-pa', rows.map(f => f.label.pa));
  if (en.order.join() !== hi.order.join() || en.order.join() !== pa.order.join()) throw new Error('Language option-order drift');
  const correctIndex = en.order.indexOf(0);
  return {
    id: `${target.cpId}-Q-VP-AUDIT-DIRECT-${target.key}`.toUpperCase(),
    cpId: target.cpId,
    objective: `audit-variable-direct-${target.key}`,
    difficulty: target.difficulty,
    sourceIds: [...target.sourceIds],
    correctIndex,
    authoringReviewApproved: true,
    generationSource: `${target.cpId}-AUDIT-WAVE-D1-V1`,
    qlId: QL_IDS[target.cpId][0],
    locales: {
      en: { stem: target.stem.en, options: en.values, explanation: `${target.label.en}: ${target.relation.en}.` },
      hi: { stem: target.stem.hi, options: hi.values, explanation: `${target.label.hi}: ${target.relation.hi}।` },
      pa: { stem: target.stem.pa, options: pa.values, explanation: `${target.label.pa}: ${target.relation.pa}।` },
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
  const en = shuffled(target, 'match-en', pairValues('en'));
  const hi = shuffled(target, 'match-hi', pairValues('hi'));
  const pa = shuffled(target, 'match-pa', pairValues('pa'));
  if (en.order.join() !== hi.order.join() || en.order.join() !== pa.order.join()) throw new Error('Language option-order drift');
  const correctIndex = en.order.indexOf(0);
  const difficulty: Difficulty = target.difficulty === 'Easy' ? 'Medium' : 'Hard';
  return {
    id: `${target.cpId}-Q-VP-AUDIT-MATCH-${target.key}`.toUpperCase(),
    cpId: target.cpId,
    objective: `audit-variable-match-${target.key}`,
    difficulty,
    sourceIds: [...new Set(rows.flatMap(f => f.sourceIds))],
    correctIndex,
    authoringReviewApproved: true,
    generationSource: `${target.cpId}-AUDIT-WAVE-D1-V1`,
    qlId: QL_IDS[target.cpId][1],
    locales: {
      en: { stem: MATCH_STEMS[target.cpId].en, options: en.values, explanation: `Correct relation: ${target.label.en} — ${target.relation.en}.` },
      hi: { stem: MATCH_STEMS[target.cpId].hi, options: hi.values, explanation: `सही संबंध: ${target.label.hi} — ${target.relation.hi}।` },
      pa: { stem: MATCH_STEMS[target.cpId].pa, options: pa.values, explanation: `ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।` },
    },
  };
}

export const WGE_AUDIT_D1_VARIABLE_POOL_QUESTIONS_V1: readonly WorldGeographyQuestion[] =
  Object.freeze(FACTS.flatMap(f => [makeDirect(f), makeMatch(f)]));

export const WGE_AUDIT_D1_VARIABLE_POOL_QL_IDS_V1: readonly string[] =
  Object.freeze(Object.values(QL_IDS).flatMap(ids => [...ids]));
