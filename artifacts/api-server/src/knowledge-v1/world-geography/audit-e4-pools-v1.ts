import { deterministicShuffle } from '../deterministic';
import type { WorldGeographyQuestion } from './corpus';

type Language='en'|'hi'|'pa';
type LocalizedValue=Record<Language,string>;
type Difficulty='Easy'|'Medium'|'Hard';

type Fact={
  cpId:'WGE-001-CP023'|'WGE-001-CP041'|'WGE-001-CP042';
  key:string;
  label:LocalizedValue;
  stem:LocalizedValue;
  relation:LocalizedValue;
  sourceIds:readonly string[];
  difficulty:Difficulty;
};

const FACTS:readonly Fact[]=[
  // CP023 — South Asia regional geography, without India-owned framing
  {
    cpId:'WGE-001-CP023',key:'pakistan-indus',
    label:{en:'Pakistan',hi:'पाकिस्तान',pa:'ਪਾਕਿਸਤਾਨ'},
    stem:{en:'Which South Asian country is centred on the Indus basin and has a coast on the Arabian Sea?',
      hi:'कौन-सा दक्षिण एशियाई देश सिंधु बेसिन पर केंद्रित है और अरब सागर पर तट रखता है?',
      pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼ ਸਿੰਧੂ ਬੇਸਿਨ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੈ ਅਤੇ ਅਰਬ ਸਾਗਰ ਉੱਤੇ ਤਟ ਰੱਖਦਾ ਹੈ?'},
    relation:{en:'South Asian country centred on the Indus basin with an Arabian Sea coast',
      hi:'सिंधु बेसिन पर केंद्रित और अरब सागर तट वाला दक्षिण एशियाई देश',
      pa:'ਸਿੰਧੂ ਬੇਸਿਨ ਉੱਤੇ ਕੇਂਦਰਿਤ ਅਤੇ ਅਰਬ ਸਾਗਰ ਤਟ ਵਾਲਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼'},
    sourceIds:['WGE-PHY-023A','WGE-PHY-023B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP023',key:'nepal-himalaya',
    label:{en:'Nepal',hi:'नेपाल',pa:'ਨੇਪਾਲ'},
    stem:{en:'Which South Asian country contains the Kathmandu Valley and rises northward into the high Himalaya?',
      hi:'कौन-सा दक्षिण एशियाई देश काठमांडू घाटी को समेटे है और उत्तर की ओर ऊँचे हिमालय तक उठता है?',
      pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼ ਕਾਠਮੰਡੂ ਘਾਟੀ ਨੂੰ ਸਮੇਟਦਾ ਹੈ ਅਤੇ ਉੱਤਰ ਵੱਲ ਉੱਚੇ ਹਿਮਾਲਿਆ ਤੱਕ ਚੜ੍ਹਦਾ ਹੈ?'},
    relation:{en:'landlocked Himalayan country containing the Kathmandu Valley',
      hi:'काठमांडू घाटी वाला स्थलरुद्ध हिमालयी देश',
      pa:'ਕਾਠਮੰਡੂ ਘਾਟੀ ਵਾਲਾ ਭੂ-ਬੱਧ ਹਿਮਾਲਿਆਈ ਦੇਸ਼'},
    sourceIds:['WGE-PHY-023A','WGE-PHY-023B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP023',key:'bhutan-eastern-himalaya',
    label:{en:'Bhutan',hi:'भूटान',pa:'ਭੂਟਾਨ'},
    stem:{en:'Which landlocked South Asian country has Thimphu as its capital and lies in the eastern Himalaya?',
      hi:'कौन-सा स्थलरुद्ध दक्षिण एशियाई देश, जिसकी राजधानी थिम्फू है, पूर्वी हिमालय में स्थित है?',
      pa:'ਕਿਹੜਾ ਭੂ-ਬੱਧ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼, ਜਿਸ ਦੀ ਰਾਜਧਾਨੀ ਥਿੰਫੂ ਹੈ, ਪੂਰਬੀ ਹਿਮਾਲਿਆ ਵਿੱਚ ਸਥਿਤ ਹੈ?'},
    relation:{en:'landlocked eastern Himalayan country with Thimphu as capital',
      hi:'थिम्फू राजधानी वाला स्थलरुद्ध पूर्वी हिमालयी देश',
      pa:'ਥਿੰਫੂ ਰਾਜਧਾਨੀ ਵਾਲਾ ਭੂ-ਬੱਧ ਪੂਰਬੀ ਹਿਮਾਲਿਆਈ ਦੇਸ਼'},
    sourceIds:['WGE-PHY-023A','WGE-PHY-023B'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP023',key:'bangladesh-delta',
    label:{en:'Bangladesh',hi:'बांग्लादेश',pa:'ਬੰਗਲਾਦੇਸ਼'},
    stem:{en:'Which South Asian country occupies much of the lower Ganges–Brahmaputra–Meghna delta?',
      hi:'कौन-सा दक्षिण एशियाई देश निचले गंगा–ब्रह्मपुत्र–मेघना डेल्टा के बड़े भाग में स्थित है?',
      pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼ ਹੇਠਲੇ ਗੰਗਾ–ਬ੍ਰਹਮਪੁਤ੍ਰ–ਮੇਘਨਾ ਡੈਲਟਾ ਦੇ ਵੱਡੇ ਹਿੱਸੇ ਵਿੱਚ ਸਥਿਤ ਹੈ?'},
    relation:{en:'low-lying deltaic country at the head of the Bay of Bengal',
      hi:'बंगाल की खाड़ी के शीर्ष पर स्थित निम्न डेल्टाई देश',
      pa:'ਬੰਗਾਲ ਦੀ ਖਾੜੀ ਦੇ ਸਿਰੇ ਉੱਤੇ ਸਥਿਤ ਨੀਵਾਂ ਡੈਲਟਾਈ ਦੇਸ਼'},
    sourceIds:['WGE-PHY-023A','WGE-PHY-023B'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP023',key:'sri-lanka-island',
    label:{en:'Sri Lanka',hi:'श्रीलंका',pa:'ਸ੍ਰੀਲੰਕਾ'},
    stem:{en:'Which South Asian island country has a mountainous central interior surrounded by coastal lowlands?',
      hi:'कौन-सा दक्षिण एशियाई द्वीपीय देश मध्य में पर्वतीय उच्चभूमि और चारों ओर तटीय निम्नभूमि रखता है?',
      pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਟਾਪੂ-ਦੇਸ਼ ਮੱਧ ਵਿੱਚ ਪਹਾੜੀ ਉੱਚਭੂਮੀ ਅਤੇ ਆਲੇ-ਦੁਆਲੇ ਤਟਵਰਤੀ ਨੀਵੀਂ ਧਰਤੀ ਰੱਖਦਾ ਹੈ?'},
    relation:{en:'island country with central highlands and surrounding coastal lowlands',
      hi:'मध्य उच्चभूमि और चारों ओर तटीय निम्नभूमि वाला द्वीपीय देश',
      pa:'ਮੱਧ ਉੱਚਭੂਮੀ ਅਤੇ ਆਲੇ-ਦੁਆਲੇ ਤਟਵਰਤੀ ਨੀਵੀਂ ਧਰਤੀ ਵਾਲਾ ਟਾਪੂ-ਦੇਸ਼'},
    sourceIds:['WGE-PHY-023A'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP023',key:'maldives-atolls',
    label:{en:'Maldives',hi:'मालदीव',pa:'ਮਾਲਦੀਵ'},
    stem:{en:'Which South Asian country is composed mainly of low coral islands grouped into atolls?',
      hi:'कौन-सा दक्षिण एशियाई देश मुख्यतः एटोलों में समूहित निम्न प्रवाल द्वीपों से बना है?',
      pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਐਟੋਲਾਂ ਵਿੱਚ ਗਠਿਤ ਨੀਵੇਂ ਕੋਰਲ ਟਾਪੂਆਂ ਤੋਂ ਬਣਿਆ ਹੈ?'},
    relation:{en:'low-lying coral-island archipelago organised into atolls',
      hi:'एटोलों में संगठित निम्न प्रवाल द्वीपसमूह',
      pa:'ਐਟੋਲਾਂ ਵਿੱਚ ਗਠਿਤ ਨੀਵਾਂ ਕੋਰਲ ਟਾਪੂ-ਸਮੂਹ'},
    sourceIds:['WGE-PHY-023A'],difficulty:'Easy'
  },

  // CP041 — human/economic geography
  {
    cpId:'WGE-001-CP041',key:'primary-sector',
    label:{en:'Primary sector',hi:'प्राथमिक क्षेत्र',pa:'ਪ੍ਰਾਇਮਰੀ ਖੇਤਰ'},
    stem:{en:'Which economic sector includes activities that directly obtain resources from nature, such as farming, fishing and mining?',
      hi:'कौन-सा आर्थिक क्षेत्र खेती, मत्स्यन और खनन जैसी प्रकृति से सीधे संसाधन प्राप्त करने वाली गतिविधियों को शामिल करता है?',
      pa:'ਕਿਹੜਾ ਆਰਥਿਕ ਖੇਤਰ ਖੇਤੀ, ਮੱਛੀ ਪਕੜ ਅਤੇ ਖਦਾਨੀ ਵਰਗੀਆਂ ਕੁਦਰਤ ਤੋਂ ਸਿੱਧੇ ਸਰੋਤ ਲੈਣ ਵਾਲੀਆਂ ਗਤੀਵਿਧੀਆਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦਾ ਹੈ?'},
    relation:{en:'activities directly extracting or producing natural resources',
      hi:'प्रकृति से सीधे संसाधन निकालने या उत्पन्न करने वाली गतिविधियाँ',
      pa:'ਕੁਦਰਤ ਤੋਂ ਸਿੱਧੇ ਸਰੋਤ ਕੱਢਣ ਜਾਂ ਪੈਦਾ ਕਰਨ ਵਾਲੀਆਂ ਗਤੀਵਿਧੀਆਂ'},
    sourceIds:['WGE-HUMGEO-NCERT-SYLLABUS'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP041',key:'secondary-sector',
    label:{en:'Secondary sector',hi:'द्वितीयक क्षेत्र',pa:'ਸੈਕੰਡਰੀ ਖੇਤਰ'},
    stem:{en:'Which economic sector transforms raw materials into manufactured goods?',
      hi:'कौन-सा आर्थिक क्षेत्र कच्चे माल को निर्मित वस्तुओं में बदलता है?',
      pa:'ਕਿਹੜਾ ਆਰਥਿਕ ਖੇਤਰ ਕੱਚੇ ਮਾਲ ਨੂੰ ਬਣੀਆਂ ਵਸਤੂਆਂ ਵਿੱਚ ਬਦਲਦਾ ਹੈ?'},
    relation:{en:'processing and manufacturing that transform raw materials into goods',
      hi:'कच्चे माल को वस्तुओं में बदलने वाला प्रसंस्करण और विनिर्माण',
      pa:'ਕੱਚੇ ਮਾਲ ਨੂੰ ਵਸਤੂਆਂ ਵਿੱਚ ਬਦਲਣ ਵਾਲੀ ਪ੍ਰੋਸੈਸਿੰਗ ਅਤੇ ਨਿਰਮਾਣ'},
    sourceIds:['WGE-HUMGEO-NCERT-SYLLABUS','WGE-IND-UNIDO-IDR'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP041',key:'tertiary-sector',
    label:{en:'Tertiary sector',hi:'तृतीयक क्षेत्र',pa:'ਤੀਜਾ ਖੇਤਰ'},
    stem:{en:'Which economic sector mainly provides services such as transport, retail, banking and logistics?',
      hi:'कौन-सा आर्थिक क्षेत्र मुख्यतः परिवहन, खुदरा, बैंकिंग और लॉजिस्टिक्स जैसी सेवाएँ देता है?',
      pa:'ਕਿਹੜਾ ਆਰਥਿਕ ਖੇਤਰ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਆਵਾਜਾਈ, ਖੁਦਰਾ, ਬੈਂਕਿੰਗ ਅਤੇ ਲਾਜਿਸਟਿਕਸ ਵਰਗੀਆਂ ਸੇਵਾਵਾਂ ਦਿੰਦਾ ਹੈ?'},
    relation:{en:'service activities supporting producers and consumers',
      hi:'उत्पादकों और उपभोक्ताओं को सहायता देने वाली सेवा गतिविधियाँ',
      pa:'ਉਤਪਾਦਕਾਂ ਅਤੇ ਖਪਤਕਾਰਾਂ ਨੂੰ ਸਹਾਇਤਾ ਦੇਣ ਵਾਲੀਆਂ ਸੇਵਾ ਗਤੀਵਿਧੀਆਂ'},
    sourceIds:['WGE-HUMGEO-NCERT-SYLLABUS'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP041',key:'quaternary-sector',
    label:{en:'Quaternary sector',hi:'चतुर्थक क्षेत्र',pa:'ਚੌਥਾ ਖੇਤਰ'},
    stem:{en:'Which economic sector is centred on knowledge-intensive activities such as research, data analysis and specialised information services?',
      hi:'कौन-सा आर्थिक क्षेत्र अनुसंधान, आँकड़ा विश्लेषण और विशेष सूचना सेवाओं जैसी ज्ञान-प्रधान गतिविधियों पर केंद्रित है?',
      pa:'ਕਿਹੜਾ ਆਰਥਿਕ ਖੇਤਰ ਖੋਜ, ਡਾਟਾ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਜਾਣਕਾਰੀ ਸੇਵਾਵਾਂ ਵਰਗੀਆਂ ਗਿਆਨ-ਕੇਂਦਰਿਤ ਗਤੀਵਿਧੀਆਂ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੈ?'},
    relation:{en:'knowledge-intensive research and information activities',
      hi:'ज्ञान-प्रधान अनुसंधान और सूचना गतिविधियाँ',
      pa:'ਗਿਆਨ-ਕੇਂਦਰਿਤ ਖੋਜ ਅਤੇ ਜਾਣਕਾਰੀ ਗਤੀਵਿਧੀਆਂ'},
    sourceIds:['WGE-HUMGEO-NCERT-SYLLABUS'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP041',key:'global-value-chain',
    label:{en:'Global value chain',hi:'वैश्विक मूल्य शृंखला',pa:'ਵਿਸ਼ਵ ਮੁੱਲ ਲੜੀ'},
    stem:{en:'A product is designed in one country, assembled in another and marketed from a third. Which concept describes this production pattern?',
      hi:'किसी उत्पाद की रूपरेखा एक देश में बनती है, संयोजन दूसरे में और विपणन तीसरे देश से होता है। यह कौन-सी उत्पादन अवधारणा है?',
      pa:'ਕਿਸੇ ਉਤਪਾਦ ਦੀ ਡਿਜ਼ਾਇਨ ਇੱਕ ਦੇਸ਼ ਵਿੱਚ ਬਣਦੀ ਹੈ, ਜੋੜਾਈ ਦੂਜੇ ਵਿੱਚ ਅਤੇ ਮਾਰਕੀਟਿੰਗ ਤੀਜੇ ਦੇਸ਼ ਤੋਂ ਹੁੰਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਉਤਪਾਦਨ ਧਾਰਣਾ ਹੈ?'},
    relation:{en:'production stages distributed across firms and countries in an interconnected chain',
      hi:'जुड़ी शृंखला में कई देशों और इकाइयों में बँटे उत्पादन चरण',
      pa:'ਜੁੜੀ ਲੜੀ ਵਿੱਚ ਕਈ ਦੇਸ਼ਾਂ ਅਤੇ ਇਕਾਈਆਂ ਵਿੱਚ ਵੰਡੇ ਉਤਪਾਦਨ ਪੜਾਅ'},
    sourceIds:['WGE-IND-WB-GVC'],difficulty:'Medium'
  },
  {
    cpId:'WGE-001-CP041',key:'service-catchment',
    label:{en:'Service catchment',hi:'सेवा प्रभाव क्षेत्र',pa:'ਸੇਵਾ ਪਹੁੰਚ ਖੇਤਰ'},
    stem:{en:'What term describes the surrounding area from which a hospital, school or market draws most of its users?',
      hi:'उस आसपास के क्षेत्र को क्या कहा जाता है जहाँ से अस्पताल, विद्यालय या बाजार अपने अधिकांश उपयोगकर्ताओं को आकर्षित करता है?',
      pa:'ਉਸ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਖੇਤਰ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ ਜਿੱਥੋਂ ਹਸਪਤਾਲ, ਸਕੂਲ ਜਾਂ ਬਾਜ਼ਾਰ ਆਪਣੇ ਜ਼ਿਆਦਾਤਰ ਵਰਤੋਂਕਾਰ ਖਿੱਚਦਾ ਹੈ?'},
    relation:{en:'area from which a service centre draws most of its users',
      hi:'वह क्षेत्र जहाँ से सेवा केंद्र अपने अधिकांश उपयोगकर्ता प्राप्त करता है',
      pa:'ਉਹ ਖੇਤਰ ਜਿੱਥੋਂ ਸੇਵਾ ਕੇਂਦਰ ਆਪਣੇ ਜ਼ਿਆਦਾਤਰ ਵਰਤੋਂਕਾਰ ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ'},
    sourceIds:['WGE-HAB-SETTLEMENT-SERVICES'],difficulty:'Medium'
  },

  // CP042 — water-cycle processes
  {
    cpId:'WGE-001-CP042',key:'evaporation',
    label:{en:'Evaporation',hi:'वाष्पीकरण',pa:'ਵਾਸ਼ਪੀਕਰਨ'},
    stem:{en:'Which process changes liquid water at Earth’s surface into water vapour?',
      hi:'कौन-सी प्रक्रिया पृथ्वी की सतह पर तरल जल को जलवाष्प में बदलती है?',
      pa:'ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਧਰਤੀ ਦੀ ਸਤਹ ਉੱਤੇ ਤਰਲ ਪਾਣੀ ਨੂੰ ਜਲ-ਵਾਸ਼ਪ ਵਿੱਚ ਬਦਲਦੀ ਹੈ?'},
    relation:{en:'change of liquid water into water vapour',
      hi:'तरल जल का जलवाष्प में बदलना',
      pa:'ਤਰਲ ਪਾਣੀ ਦਾ ਜਲ-ਵਾਸ਼ਪ ਵਿੱਚ ਬਦਲਣਾ'},
    sourceIds:['WGE-HYDRO-NCERT','WGE-HYDRO-NOAA'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP042',key:'condensation',
    label:{en:'Condensation',hi:'संघनन',pa:'ਸੰਘਣਨ'},
    stem:{en:'Which process changes water vapour into tiny liquid droplets during cloud formation?',
      hi:'बादल बनने के दौरान कौन-सी प्रक्रिया जलवाष्प को सूक्ष्म तरल बूंदों में बदलती है?',
      pa:'ਬੱਦਲ ਬਣਨ ਦੌਰਾਨ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਜਲ-ਵਾਸ਼ਪ ਨੂੰ ਬਹੁਤ ਛੋਟੀਆਂ ਤਰਲ ਬੂੰਦਾਂ ਵਿੱਚ ਬਦਲਦੀ ਹੈ?'},
    relation:{en:'change of water vapour into liquid droplets',
      hi:'जलवाष्प का तरल बूंदों में बदलना',
      pa:'ਜਲ-ਵਾਸ਼ਪ ਦਾ ਤਰਲ ਬੂੰਦਾਂ ਵਿੱਚ ਬਦਲਣਾ'},
    sourceIds:['WGE-HYDRO-NCERT','WGE-HYDRO-NOAA'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP042',key:'transpiration',
    label:{en:'Transpiration',hi:'वाष्पोत्सर्जन',pa:'ਵਾਸ਼ਪੋਤਸਰਜਨ'},
    stem:{en:'Which process transfers water from plants to the atmosphere mainly through leaves?',
      hi:'कौन-सी प्रक्रिया मुख्यतः पत्तियों के माध्यम से पौधों से जल को वायुमंडल में पहुँचाती है?',
      pa:'ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਪੱਤਿਆਂ ਰਾਹੀਂ ਪੌਦਿਆਂ ਤੋਂ ਪਾਣੀ ਨੂੰ ਵਾਤਾਵਰਣ ਵਿੱਚ ਪਹੁੰਚਾਉਂਦੀ ਹੈ?'},
    relation:{en:'release of water vapour from plants to the atmosphere',
      hi:'पौधों से वायुमंडल में जलवाष्प का उत्सर्जन',
      pa:'ਪੌਦਿਆਂ ਤੋਂ ਵਾਤਾਵਰਣ ਵਿੱਚ ਜਲ-ਵਾਸ਼ਪ ਦਾ ਨਿਕਾਸ'},
    sourceIds:['WGE-HYDRO-NCERT'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP042',key:'infiltration',
    label:{en:'Infiltration',hi:'अंतःप्रवेशन',pa:'ਜ਼ਮੀਨ ਵਿੱਚ ਰਿਸਾਅ'},
    stem:{en:'Which process occurs when water at the ground surface enters the soil?',
      hi:'भूमि की सतह पर मौजूद जल के मिट्टी में प्रवेश करने की प्रक्रिया क्या कहलाती है?',
      pa:'ਧਰਤੀ ਦੀ ਸਤਹ ਉੱਤੇ ਮੌਜੂਦ ਪਾਣੀ ਦੇ ਮਿੱਟੀ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕੀ ਕਹਾਂਦੀ ਹੈ?'},
    relation:{en:'entry of surface water into the soil',
      hi:'सतही जल का मिट्टी में प्रवेश',
      pa:'ਸਤਹੀ ਪਾਣੀ ਦਾ ਮਿੱਟੀ ਵਿੱਚ ਦਾਖਲ ਹੋਣਾ'},
    sourceIds:['WGE-HYDRO-NCERT'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP042',key:'surface-runoff',
    label:{en:'Surface runoff',hi:'सतही अपवाह',pa:'ਸਤਹੀ ਵਹਾਅ'},
    stem:{en:'Which process describes water flowing over the land surface toward streams when it does not infiltrate?',
      hi:'जब जल मिट्टी में नहीं समाता और भूमि की सतह पर बहते हुए नालों या नदियों की ओर जाता है, तो यह कौन-सी प्रक्रिया है?',
      pa:'ਜਦੋਂ ਪਾਣੀ ਮਿੱਟੀ ਵਿੱਚ ਨਹੀਂ ਰਿਸਦਾ ਅਤੇ ਧਰਤੀ ਦੀ ਸਤਹ ਉੱਤੇ ਵਗਦਾ ਹੋਇਆ ਨਾਲਿਆਂ ਜਾਂ ਦਰਿਆਵਾਂ ਵੱਲ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਇਹ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੈ?'},
    relation:{en:'water flowing over the land surface toward drainage channels',
      hi:'भूमि की सतह पर बहकर जलनिकासी धाराओं की ओर जाने वाला जल',
      pa:'ਧਰਤੀ ਦੀ ਸਤਹ ਉੱਤੇ ਵਗ ਕੇ ਨਿਕਾਸੀ ਧਾਰਾਵਾਂ ਵੱਲ ਜਾਣ ਵਾਲਾ ਪਾਣੀ'},
    sourceIds:['WGE-HYDRO-NCERT','WGE-HYDRO-CHART'],difficulty:'Easy'
  },
  {
    cpId:'WGE-001-CP042',key:'groundwater-recharge',
    label:{en:'Groundwater recharge',hi:'भूजल पुनर्भरण',pa:'ਭੂਜਲ ਮੁੜ-ਭਰਾਈ'},
    stem:{en:'Which process adds water to an aquifer as infiltrated water moves downward through soil and rock?',
      hi:'मिट्टी और शैल से नीचे जाते अंतःप्रवेशित जल द्वारा जलभृत में जल जुड़ने की प्रक्रिया क्या कहलाती है?',
      pa:'ਮਿੱਟੀ ਅਤੇ ਚੱਟਾਨ ਵਿੱਚੋਂ ਹੇਠਾਂ ਜਾਂਦੇ ਰਿਸੇ ਪਾਣੀ ਨਾਲ ਜਲਭੰਡਾਰ ਵਿੱਚ ਪਾਣੀ ਸ਼ਾਮਲ ਹੋਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕੀ ਕਹਾਂਦੀ ਹੈ?'},
    relation:{en:'addition of infiltrated water to an aquifer',
      hi:'अंतःप्रवेशित जल का जलभृत में जुड़ना',
      pa:'ਰਿਸੇ ਪਾਣੀ ਦਾ ਜਲਭੰਡਾਰ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ'},
    sourceIds:['WGE-HYDRO-NCERT','WGE-HYDRO-NOAA'],difficulty:'Medium'
  },
];

const qlIds={
 cp023:['WGE-001-CP023-QL-AUDIT-DIRECT-V1','WGE-001-CP023-QL-AUDIT-MATCH-V1'],
 cp041:['WGE-001-CP041-QL-AUDIT-DIRECT-V1','WGE-001-CP041-QL-AUDIT-MATCH-V1'],
 cp042:['WGE-001-CP042-QL-AUDIT-DIRECT-V1','WGE-001-CP042-QL-AUDIT-MATCH-V1'],
} as const;

const MATCH_STEMS:Record<Fact['cpId'],LocalizedValue>={
 'WGE-001-CP023':{en:'Which South Asian country is correctly matched with its regional description?',hi:'कौन-सा दक्षिण एशियाई देश अपने क्षेत्रीय विवरण से सही सुमेलित है?',pa:'ਕਿਹੜਾ ਦੱਖਣੀ ਏਸ਼ੀਆਈ ਦੇਸ਼ ਆਪਣੇ ਖੇਤਰੀ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?'},
 'WGE-001-CP041':{en:'Which human or economic geography concept is correctly matched?',hi:'मानव या आर्थिक भूगोल की कौन-सी अवधारणा सही सुमेलित है?',pa:'ਮਨੁੱਖੀ ਜਾਂ ਆਰਥਿਕ ਭੂਗੋਲ ਦੀ ਕਿਹੜੀ ਧਾਰਣਾ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
 'WGE-001-CP042':{en:'Which water-cycle process is correctly matched with its description?',hi:'जलचक्र की कौन-सी प्रक्रिया अपने विवरण से सही सुमेलित है?',pa:'ਜਲ-ਚੱਕਰ ਦੀ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਆਪਣੇ ਵੇਰਵੇ ਨਾਲ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?'},
};

const cpFacts=(cpId:Fact['cpId'])=>FACTS.filter(f=>f.cpId===cpId);
const shuffle=(s:string)=>deterministicShuffle([0,1,2,3],s);
function selected(target:Fact){
 const p=cpFacts(target.cpId),i=p.findIndex(f=>f.key===target.key);
 if(p.length!==6||i<0)throw new Error(`Expected six E4 facts for ${target.cpId}`);
 return [target,p[(i+1)%6]!,p[(i+3)%6]!,p[(i+5)%6]!];
}
function ql(target:Fact,index:0|1){
 const key=`cp${target.cpId.slice(-3)}` as keyof typeof qlIds;
 return qlIds[key][index];
}
function direct(target:Fact):WorldGeographyQuestion{
 const rows=selected(target),ord=shuffle(`${target.cpId}:${target.key}:direct`);
 const options=(l:Language)=>ord.map(i=>rows[i]!.label[l]);
 return {id:`${target.cpId}-Q-VP-E4-DIRECT-${target.key}`.toUpperCase(),cpId:target.cpId,objective:`audit-e4-direct-${target.key}`,
 difficulty:target.difficulty,sourceIds:[...target.sourceIds],correctIndex:ord.indexOf(0),authoringReviewApproved: true,
 generationSource:`${target.cpId}-AUDIT-WAVE-E4-V1`,qlId:ql(target,0),locales:{
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
 return {id:`${target.cpId}-Q-VP-E4-MATCH-${target.key}`.toUpperCase(),cpId:target.cpId,objective:`audit-e4-match-${target.key}`,
 difficulty,sourceIds:[...new Set(rows.flatMap(f=>f.sourceIds))],correctIndex:ord.indexOf(0),authoringReviewApproved: true,
 generationSource:`${target.cpId}-AUDIT-WAVE-E4-V1`,qlId:ql(target,1),locales:{
  en:{stem:MATCH_STEMS[target.cpId].en,options:options('en'),explanation:`Correct relation: ${target.label.en} — ${target.relation.en}.`},
  hi:{stem:MATCH_STEMS[target.cpId].hi,options:options('hi'),explanation:`सही संबंध: ${target.label.hi} — ${target.relation.hi}।`},
  pa:{stem:MATCH_STEMS[target.cpId].pa,options:options('pa'),explanation:`ਸਹੀ ਸੰਬੰਧ: ${target.label.pa} — ${target.relation.pa}।`},
 }};
}

export const WGE_AUDIT_E4_VARIABLE_POOL_QUESTIONS_V1:readonly WorldGeographyQuestion[]=Object.freeze(FACTS.flatMap(f=>[direct(f),match(f)]));
export const WGE_AUDIT_E4_VARIABLE_POOL_QL_IDS_V1:readonly string[]=Object.freeze([
 ...qlIds.cp023,...qlIds.cp041,...qlIds.cp042,
]);
