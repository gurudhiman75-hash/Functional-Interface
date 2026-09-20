import { generateEnvCp001ReviewBatchV4 } from "../ecology-fundamentals/env-cp001-review-generator-v4";
import {
  ENV_LOCALIZATION_V1,
  type EnvLocaleV1,
  type EnvLocalizedQuestionV1,
} from "./env-localization-types-v1";

type NativeLocale = Exclude<EnvLocaleV1, "en">;
type LocalePair = { hi: string; pa: string };
const lp = (hi: string, pa: string): LocalePair => ({ hi, pa });

const ENGLISH_CP001 = Object.freeze(generateEnvCp001ReviewBatchV4());

const ATOM: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Ecology": lp("पारिस्थितिकी", "ਪਰਿਸਥਿਤਿਕੀ"),
  "Environment": lp("पर्यावरण", "ਵਾਤਾਵਰਣ"),
  "Organism": lp("जीव", "ਜੀਵ"),
  "Species": lp("प्रजाति", "ਪ੍ਰਜਾਤੀ"),
  "Population": lp("जनसंख्या", "ਆਬਾਦੀ"),
  "Community": lp("समुदाय", "ਸਮੁਦਾਇ"),
  "Ecosystem": lp("पारितंत्र", "ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ"),
  "Biome": lp("बायोम", "ਬਾਇਓਮ"),
  "Biosphere": lp("जैवमंडल", "ਜੀਵ ਮੰਡਲ"),
  "Habitat": lp("आवास", "ਆਵਾਸ"),
  "Ecological niche": lp("पारिस्थितिक निच", "ਪਰਿਸਥਿਤਿਕ ਨਿਚ"),
  "Ecotone": lp("इकोटोन", "ਇਕੋਟੋਨ"),
  "Edge effect": lp("किनारी प्रभाव", "ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ"),

  "study of organisms and their interactions with the environment": lp("जीवों और पर्यावरण के साथ उनकी पारस्परिक क्रियाओं का अध्ययन", "ਜੀਵਾਂ ਅਤੇ ਵਾਤਾਵਰਣ ਨਾਲ ਉਨ੍ਹਾਂ ਦੀਆਂ ਆਪਸੀ ਕਿਰਿਆਵਾਂ ਦਾ ਅਧਿਐਨ"),
  "biotic and abiotic surroundings affecting an organism": lp("जीव को प्रभावित करने वाला जैविक और अजैविक परिवेश", "ਜੀਵ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਨ ਵਾਲਾ ਜੈਵਿਕ ਅਤੇ ਅਜੈਵਿਕ ਵਾਤਾਵਰਣ"),
  "one individual living entity": lp("एक व्यक्तिगत जीवित इकाई", "ਇੱਕ ਵਿਅਕਤੀਗਤ ਜੀਵਤ ਇਕਾਈ"),
  "interbreeding group capable of producing fertile offspring": lp("आपस में प्रजनन करके उर्वर संतति उत्पन्न करने वाला समूह", "ਆਪਸ ਵਿੱਚ ਪ੍ਰਜਨਨ ਕਰਕੇ ਉਪਜਾਊ ਸੰਤਾਨ ਪੈਦਾ ਕਰਨ ਵਾਲਾ ਸਮੂਹ"),
  "members of the same species living in one area": lp("एक ही क्षेत्र में रहने वाली समान प्रजाति के सदस्य", "ਇੱਕੋ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ"),
  "different species populations living and interacting in one area": lp("एक क्षेत्र में रहने और परस्पर क्रिया करने वाली विभिन्न प्रजातियों की जनसंख्याएँ", "ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਅਤੇ ਆਪਸੀ ਕਿਰਿਆ ਕਰਨ ਵਾਲੀਆਂ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ"),
  "a community interacting with its physical environment": lp("अपने भौतिक पर्यावरण के साथ परस्पर क्रिया करता समुदाय", "ਆਪਣੇ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਨਾਲ ਆਪਸੀ ਕਿਰਿਆ ਕਰਦਾ ਸਮੁਦਾਇ"),
  "large ecological region defined mainly by climate and vegetation": lp("मुख्यतः जलवायु और वनस्पति से निर्धारित बड़ा पारिस्थितिक क्षेत्र", "ਮੁੱਖ ਤੌਰ ਤੇ ਜਲਵਾਯੂ ਅਤੇ ਬਨਸਪਤੀ ਨਾਲ ਨਿਰਧਾਰਤ ਵੱਡਾ ਪਰਿਸਥਿਤਿਕ ਖੇਤਰ"),
  "global zone of life containing all ecosystems": lp("सभी पारितंत्रों को समेटने वाला वैश्विक जीवन क्षेत्र", "ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰਾਂ ਨੂੰ ਸਮੇਟਣ ਵਾਲਾ ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ"),
  "place where an organism lives": lp("वह स्थान जहाँ जीव रहता है", "ਉਹ ਥਾਂ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ"),
  "functional role, resource use and interactions of an organism": lp("जीव की कार्यात्मक भूमिका, संसाधनों का उपयोग और पारस्परिक क्रियाएँ", "ਜੀਵ ਦੀ ਕਾਰਜਾਤਮਕ ਭੂਮਿਕਾ, ਸਰੋਤਾਂ ਦੀ ਵਰਤੋਂ ਅਤੇ ਆਪਸੀ ਕਿਰਿਆਵਾਂ"),
  "transition zone between adjoining ecological communities or ecosystems": lp("सटे हुए पारिस्थितिक समुदायों या पारितंत्रों के बीच संक्रमण क्षेत्र", "ਨਾਲ ਲੱਗਦੇ ਪਰਿਸਥਿਤਿਕ ਸਮੁਦਾਇਆਂ ਜਾਂ ਤੰਤਰਾਂ ਵਿਚਕਾਰ ਸੰਕ੍ਰਮਣ ਖੇਤਰ"),
  "boundary-related change in community structure, often with greater diversity or abundance": lp("सीमा से जुड़ा सामुदायिक संरचना में परिवर्तन, जहाँ अक्सर विविधता या संख्या अधिक होती है", "ਸੀਮਾ ਨਾਲ ਜੁੜਿਆ ਸਮੁਦਾਇਕ ਬਣਤਰ ਵਿੱਚ ਬਦਲਾਅ, ਜਿੱਥੇ ਅਕਸਰ ਵਿਭਿੰਨਤਾ ਜਾਂ ਗਿਣਤੀ ਵੱਧ ਹੁੰਦੀ ਹੈ"),

  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),
  "None": lp("कोई नहीं", "ਕੋਈ ਨਹੀਂ"),
  "Only one": lp("केवल एक", "ਸਿਰਫ਼ ਇੱਕ"),
  "Only two": lp("केवल दो", "ਸਿਰਫ਼ ਦੋ"),
  "All three": lp("तीनों", "ਤਿੰਨੇ"),
});

const LONG_OPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "An organism is one individual; a population is members of the same species living in one area.": lp(
    "जीव एक व्यक्तिगत इकाई है; जनसंख्या एक क्षेत्र में रहने वाली समान प्रजाति के सदस्यों का समूह है।",
    "ਜੀਵ ਇੱਕ ਵਿਅਕਤੀਗਤ ਇਕਾਈ ਹੈ; ਆਬਾਦੀ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਦਾ ਸਮੂਹ ਹੈ।",
  ),
  "A population is one individual; an organism is members of the same species living in one area.": lp(
    "जनसंख्या एक व्यक्तिगत इकाई है; जीव एक क्षेत्र में रहने वाली समान प्रजाति के सदस्यों का समूह है।",
    "ਆਬਾਦੀ ਇੱਕ ਵਿਅਕਤੀਗਤ ਇਕਾਈ ਹੈ; ਜੀਵ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਦਾ ਸਮੂਹ ਹੈ।",
  ),
  "Both organism and population mean populations of different species living together.": lp(
    "जीव और जनसंख्या दोनों का अर्थ साथ रहने वाली विभिन्न प्रजातियों की जनसंख्याएँ हैं।",
    "ਜੀਵ ਅਤੇ ਆਬਾਦੀ ਦੋਵਾਂ ਦਾ ਅਰਥ ਇਕੱਠੇ ਰਹਿਣ ਵਾਲੀਆਂ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹਨ।",
  ),
  "Both organism and population must include the physical environment.": lp(
    "जीव और जनसंख्या दोनों में भौतिक पर्यावरण का शामिल होना आवश्यक है।",
    "ਜੀਵ ਅਤੇ ਆਬਾਦੀ ਦੋਵਾਂ ਵਿੱਚ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਸ਼ਾਮਲ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
  ),

  "A population contains members of one species; a community contains populations of different species.": lp(
    "जनसंख्या में एक प्रजाति के सदस्य होते हैं; समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।",
    "ਆਬਾਦੀ ਵਿੱਚ ਇੱਕ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ ਹੁੰਦੇ ਹਨ; ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।",
  ),
  "A population contains different species; a community contains only one species.": lp(
    "जनसंख्या में विभिन्न प्रजातियाँ होती हैं; समुदाय में केवल एक प्रजाति होती है।",
    "ਆਬਾਦੀ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਹੁੰਦੀਆਂ ਹਨ; ਸਮੁਦਾਇ ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਪ੍ਰਜਾਤੀ ਹੁੰਦੀ ਹੈ।",
  ),
  "Both population and community contain only one species.": lp(
    "जनसंख्या और समुदाय दोनों में केवल एक प्रजाति होती है।",
    "ਆਬਾਦੀ ਅਤੇ ਸਮੁਦਾਇ ਦੋਵਾਂ ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਪ੍ਰਜਾਤੀ ਹੁੰਦੀ ਹੈ।",
  ),
  "Both population and community must include soil, water and other abiotic factors.": lp(
    "जनसंख्या और समुदाय दोनों में मिट्टी, पानी और अन्य अजैविक कारकों का शामिल होना आवश्यक है।",
    "ਆਬਾਦੀ ਅਤੇ ਸਮੁਦਾਇ ਦੋਵਾਂ ਵਿੱਚ ਮਿੱਟੀ, ਪਾਣੀ ਅਤੇ ਹੋਰ ਅਜੈਵਿਕ ਕਾਰਕ ਸ਼ਾਮਲ ਹੋਣੇ ਲਾਜ਼ਮੀ ਹਨ।",
  ),

  "A community is the living populations; an ecosystem includes the community and its physical environment.": lp(
    "समुदाय जीवित जनसंख्याओं से बना होता है; पारितंत्र में समुदाय और उसका भौतिक पर्यावरण दोनों शामिल होते हैं।",
    "ਸਮੁਦਾਇ ਜੀਵਤ ਆਬਾਦੀਆਂ ਤੋਂ ਬਣਦਾ ਹੈ; ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਸਮੁਦਾਇ ਅਤੇ ਉਸਦਾ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।",
  ),
  "A community includes the physical environment, while an ecosystem includes only living populations.": lp(
    "समुदाय में भौतिक पर्यावरण शामिल होता है, जबकि पारितंत्र में केवल जीवित जनसंख्याएँ होती हैं।",
    "ਸਮੁਦਾਇ ਵਿੱਚ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ, ਜਦਕਿ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਸਿਰਫ਼ ਜੀਵਤ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।",
  ),
  "Both community and ecosystem refer only to members of one species.": lp(
    "समुदाय और पारितंत्र दोनों केवल एक प्रजाति के सदस्यों को दर्शाते हैं।",
    "ਸਮੁਦਾਇ ਅਤੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਦੋਵੇਂ ਸਿਰਫ਼ ਇੱਕ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਨੂੰ ਦਰਸਾਉਂਦੇ ਹਨ।",
  ),
  "A community is the global zone of life, while an ecosystem is one individual organism.": lp(
    "समुदाय वैश्विक जीवन क्षेत्र है, जबकि पारितंत्र एक व्यक्तिगत जीव है।",
    "ਸਮੁਦਾਇ ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ ਹੈ, ਜਦਕਿ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਇੱਕ ਵਿਅਕਤੀਗਤ ਜੀਵ ਹੈ।",
  ),

  "A biome is a large ecological region; the biosphere is the global zone containing all ecosystems.": lp(
    "बायोम एक बड़ा पारिस्थितिक क्षेत्र है; जैवमंडल सभी पारितंत्रों को समेटने वाला वैश्विक जीवन क्षेत्र है।",
    "ਬਾਇਓਮ ਇੱਕ ਵੱਡਾ ਪਰਿਸਥਿਤਿਕ ਖੇਤਰ ਹੈ; ਜੀਵ ਮੰਡਲ ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰਾਂ ਨੂੰ ਸਮੇਟਣ ਵਾਲਾ ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ ਹੈ।",
  ),
  "A biome contains all ecosystems on Earth, while the biosphere is one regional ecosystem type.": lp(
    "बायोम पृथ्वी के सभी पारितंत्रों को समेटता है, जबकि जैवमंडल एक क्षेत्रीय पारितंत्र प्रकार है।",
    "ਬਾਇਓਮ ਧਰਤੀ ਦੇ ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰਾਂ ਨੂੰ ਸਮੇਟਦਾ ਹੈ, ਜਦਕਿ ਜੀਵ ਮੰਡਲ ਇੱਕ ਖੇਤਰੀ ਤੰਤਰ ਕਿਸਮ ਹੈ।",
  ),
  "Both biome and biosphere mean the place where a single organism lives.": lp(
    "बायोम और जैवमंडल दोनों का अर्थ वह स्थान है जहाँ एक जीव रहता है।",
    "ਬਾਇਓਮ ਅਤੇ ਜੀਵ ਮੰਡਲ ਦੋਵਾਂ ਦਾ ਅਰਥ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਇੱਕ ਜੀਵ ਰਹਿੰਦਾ ਹੈ।",
  ),
  "A biome is a population of one species, while the biosphere is a community of different species.": lp(
    "बायोम एक प्रजाति की जनसंख्या है, जबकि जैवमंडल विभिन्न प्रजातियों का समुदाय है।",
    "ਬਾਇਓਮ ਇੱਕ ਪ੍ਰਜਾਤੀ ਦੀ ਆਬਾਦੀ ਹੈ, ਜਦਕਿ ਜੀਵ ਮੰਡਲ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦਾ ਸਮੁਦਾਇ ਹੈ।",
  ),
});

const STEM: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Members of the same species living in one area form a:": lp("एक क्षेत्र में रहने वाली समान प्रजाति के सदस्य मिलकर क्या बनाते हैं?", "ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ ਮਿਲ ਕੇ ਕੀ ਬਣਾਉਂਦੇ ਹਨ?"),
  "Populations of different species living together form a:": lp("साथ रहने वाली विभिन्न प्रजातियों की जनसंख्याएँ मिलकर क्या बनाती हैं?", "ਇਕੱਠੇ ਰਹਿਣ ਵਾਲੀਆਂ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਮਿਲ ਕੇ ਕੀ ਬਣਾਉਂਦੀਆਂ ਹਨ?"),
  "A community interacting with its physical environment forms an:": lp("भौतिक पर्यावरण के साथ परस्पर क्रिया करता समुदाय क्या बनाता है?", "ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਨਾਲ ਆਪਸੀ ਕਿਰਿਆ ਕਰਦਾ ਸਮੁਦਾਇ ਕੀ ਬਣਾਉਂਦਾ ਹੈ?"),
  "The global zone of life is called the:": lp("वैश्विक जीवन क्षेत्र को क्या कहा जाता है?", "ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),

  "Ecology is the study of:": lp("पारिस्थितिकी किसका अध्ययन है?", "ਪਰਿਸਥਿਤਿਕੀ ਕਿਸਦਾ ਅਧਿਐਨ ਹੈ?"),
  "What is a habitat?": lp("आवास क्या है?", "ਆਵਾਸ ਕੀ ਹੈ?"),
  "What is an ecological niche?": lp("पारिस्थितिक निच क्या है?", "ਪਰਿਸਥਿਤਿਕ ਨਿਚ ਕੀ ਹੈ?"),
  "What is a biome?": lp("बायोम क्या है?", "ਬਾਇਓਮ ਕੀ ਹੈ?"),

  "A single tiger in a forest represents a:": lp("वन में एक अकेला बाघ किस पारिस्थितिक स्तर को दर्शाता है?", "ਜੰਗਲ ਵਿੱਚ ਇੱਕ ਇਕੱਲਾ ਬਾਘ ਕਿਹੜੇ ਪਰਿਸਥਿਤਿਕ ਪੱਧਰ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "All chital deer in one grassland form a:": lp("एक घासभूमि में रहने वाले सभी चीतल मिलकर क्या बनाते हैं?", "ਇੱਕ ਘਾਹੀ ਮੈਦਾਨ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਸਾਰੇ ਚੀਤਲ ਮਿਲ ਕੇ ਕੀ ਬਣਾਉਂਦੇ ਹਨ?"),
  "Trees, birds, insects and mammals living together in a forest form a:": lp("वन में साथ रहने वाले पेड़, पक्षी, कीट और स्तनधारी मिलकर क्या बनाते हैं?", "ਜੰਗਲ ਵਿੱਚ ਇਕੱਠੇ ਰਹਿਣ ਵਾਲੇ ਦਰੱਖਤ, ਪੰਛੀ, ਕੀੜੇ ਅਤੇ ਸਤਨਧਾਰੀ ਮਿਲ ਕੇ ਕੀ ਬਣਾਉਂਦੇ ਹਨ?"),
  "Plants, animals, soil and water interacting in a pond form an:": lp("तालाब में पौधे, जानवर, मिट्टी और पानी की पारस्परिक क्रिया से क्या बनता है?", "ਤਲਾਬ ਵਿੱਚ ਪੌਦੇ, ਜਾਨਵਰ, ਮਿੱਟੀ ਅਤੇ ਪਾਣੀ ਦੀ ਆਪਸੀ ਕਿਰਿਆ ਨਾਲ ਕੀ ਬਣਦਾ ਹੈ?"),

  "The forest where a tiger lives is its:": lp("जिस वन में बाघ रहता है, वह उसका क्या है?", "ਜਿਸ ਜੰਗਲ ਵਿੱਚ ਬਾਘ ਰਹਿੰਦਾ ਹੈ, ਉਹ ਉਸਦਾ ਕੀ ਹੈ?"),
  "A bee's role as a pollinator is part of its:": lp("परागणकर्ता के रूप में मधुमक्खी की भूमिका उसके किस भाग को दर्शाती है?", "ਪਰਾਗਣਕ ਵਜੋਂ ਮਧੂਮੱਖੀ ਦੀ ਭੂਮਿਕਾ ਉਸਦੇ ਕਿਸ ਪੱਖ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ?"),
  "The pond where a freshwater fish lives is its:": lp("जिस तालाब में मीठे पानी की मछली रहती है, वह उसका क्या है?", "ਜਿਸ ਤਲਾਬ ਵਿੱਚ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਮੱਛੀ ਰਹਿੰਦੀ ਹੈ, ਉਹ ਉਸਦਾ ਕੀ ਹੈ?"),
  "A vulture's feeding role in an ecosystem is part of its:": lp("पारितंत्र में गिद्ध की भोजन संबंधी भूमिका उसके किस भाग को दर्शाती है?", "ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਗਿੱਧ ਦੀ ਖੁਰਾਕੀ ਭੂਮਿਕਾ ਉਸਦੇ ਕਿਸ ਪੱਖ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ?"),

  "Which is the correct order from lower to higher ecological level?": lp("निम्न से उच्च पारिस्थितिक स्तर का सही क्रम कौन-सा है?", "ਹੇਠਲੇ ਤੋਂ ਉੱਚੇ ਪਰਿਸਥਿਤਿਕ ਪੱਧਰ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?"),

  "Which statement correctly compares an organism and a population?": lp("जीव और जनसंख्या की सही तुलना कौन-सा कथन करता है?", "ਜੀਵ ਅਤੇ ਆਬਾਦੀ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),
  "Which statement correctly compares a population and a community?": lp("जनसंख्या और समुदाय की सही तुलना कौन-सा कथन करता है?", "ਆਬਾਦੀ ਅਤੇ ਸਮੁਦਾਇ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),
  "Which statement correctly compares a community and an ecosystem?": lp("समुदाय और पारितंत्र की सही तुलना कौन-सा कथन करता है?", "ਸਮੁਦਾਇ ਅਤੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),
  "Which statement correctly compares a biome and the biosphere?": lp("बायोम और जैवमंडल की सही तुलना कौन-सा कथन करता है?", "ਬਾਇਓਮ ਅਤੇ ਜੀਵ ਮੰਡਲ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),

  "The transition zone between two ecological communities is called:": lp("दो पारिस्थितिक समुदायों के बीच संक्रमण क्षेत्र को क्या कहा जाता है?", "ਦੋ ਪਰਿਸਥਿਤਿਕ ਸਮੁਦਾਇਆਂ ਵਿਚਕਾਰ ਸੰਕ੍ਰਮਣ ਖੇਤਰ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
  "The boundary zone between a forest and grassland is an:": lp("वन और घासभूमि के बीच का सीमा क्षेत्र क्या कहलाता है?", "ਜੰਗਲ ਅਤੇ ਘਾਹੀ ਮੈਦਾਨ ਵਿਚਕਾਰਲਾ ਸੀਮਾ ਖੇਤਰ ਕੀ ਕਹਾਉਂਦਾ ਹੈ?"),
  "Greater diversity near the boundary of two habitats is called:": lp("दो आवासों की सीमा के पास अधिक विविधता को क्या कहा जाता है?", "ਦੋ ਆਵਾਸਾਂ ਦੀ ਸੀਮਾ ਨੇੜੇ ਵੱਧ ਵਿਭਿੰਨਤਾ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
  "A change in community composition at a habitat boundary is called:": lp("आवास की सीमा पर समुदाय की संरचना में परिवर्तन को क्या कहा जाता है?", "ਆਵਾਸ ਦੀ ਸੀਮਾ ਤੇ ਸਮੁਦਾਇ ਦੀ ਬਣਤਰ ਵਿੱਚ ਬਦਲਾਅ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),

  "Which pair is correctly matched?": lp("कौन-सा युग्म सही सुमेलित है?", "ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?"),
  "Which pair is incorrectly matched?": lp("कौन-सा युग्म गलत सुमेलित है?", "ਕਿਹੜਾ ਜੋੜ ਗਲਤ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?"),

  "Consider the following statements:\nI. A population contains members of the same species living in one area.\nII. A community contains populations of different species.\nWhich is correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\nI. जनसंख्या में एक क्षेत्र में रहने वाली समान प्रजाति के सदस्य होते हैं।\nII. समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।\nकौन-सा विकल्प सही है?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\nI. ਆਬਾਦੀ ਵਿੱਚ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ ਹੁੰਦੇ ਹਨ।\nII. ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।\nਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?",
  ),
  "Consider the following statements:\nI. A community contains populations of different species.\nII. An ecosystem excludes non-living factors.\nWhich is correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\nI. समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।\nII. पारितंत्र में अजैविक कारक शामिल नहीं होते।\nकौन-सा विकल्प सही है?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\nI. ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।\nII. ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਅਜੈਵਿਕ ਕਾਰਕ ਸ਼ਾਮਲ ਨਹੀਂ ਹੁੰਦੇ।\nਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?",
  ),
  "Consider the following statements:\nI. Habitat means an organism's functional role.\nII. Niche includes an organism's role and resource use.\nWhich is correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\nI. आवास का अर्थ जीव की कार्यात्मक भूमिका है।\nII. निच में जीव की भूमिका और संसाधनों का उपयोग शामिल है।\nकौन-सा विकल्प सही है?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\nI. ਆਵਾਸ ਦਾ ਅਰਥ ਜੀਵ ਦੀ ਕਾਰਜਾਤਮਕ ਭੂਮਿਕਾ ਹੈ।\nII. ਨਿਚ ਵਿੱਚ ਜੀਵ ਦੀ ਭੂਮਿਕਾ ਅਤੇ ਸਰੋਤਾਂ ਦੀ ਵਰਤੋਂ ਸ਼ਾਮਲ ਹੈ।\nਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?",
  ),
  "Consider the following statements:\nI. An ecotone is the ecological change seen at a boundary.\nII. Edge effect is the boundary zone itself.\nWhich is correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\nI. इकोटोन सीमा पर दिखाई देने वाला पारिस्थितिक परिवर्तन है।\nII. किनारी प्रभाव स्वयं सीमा क्षेत्र है।\nकौन-सा विकल्प सही है?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\nI. ਇਕੋਟੋਨ ਸੀਮਾ ਤੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਪਰਿਸਥਿਤਿਕ ਬਦਲਾਅ ਹੈ।\nII. ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਖੁਦ ਸੀਮਾ ਖੇਤਰ ਹੈ।\nਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?",
  ),

  "Consider the following statements:\n1. An organism is one living individual.\n2. A population contains different species.\n3. A community contains populations of different species.\nHow many are correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\n1. जीव एक व्यक्तिगत जीवित इकाई है।\n2. जनसंख्या में विभिन्न प्रजातियाँ होती हैं।\n3. समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।\nकितने कथन सही हैं?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\n1. ਜੀਵ ਇੱਕ ਵਿਅਕਤੀਗਤ ਜੀਵਤ ਇਕਾਈ ਹੈ।\n2. ਆਬਾਦੀ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।\n3. ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।\nਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
  ),
  "Consider the following statements:\n1. A community contains different species.\n2. An ecosystem includes the physical environment.\n3. A biome is the global zone of life.\nHow many are correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\n1. समुदाय में विभिन्न प्रजातियाँ होती हैं।\n2. पारितंत्र में भौतिक पर्यावरण शामिल होता है।\n3. बायोम वैश्विक जीवन क्षेत्र है।\nकितने कथन सही हैं?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\n1. ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।\n2. ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।\n3. ਬਾਇਓਮ ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ ਹੈ।\nਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
  ),
  "Consider the following statements:\n1. Habitat is where an organism lives.\n2. Niche describes its role and resource use.\n3. An ecotone is a transition zone between communities.\nHow many are correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\n1. आवास वह स्थान है जहाँ जीव रहता है।\n2. निच उसकी भूमिका और संसाधनों के उपयोग को बताता है।\n3. इकोटोन समुदायों के बीच संक्रमण क्षेत्र है।\nकितने कथन सही हैं?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\n1. ਆਵਾਸ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ।\n2. ਨਿਚ ਉਸਦੀ ਭੂਮਿਕਾ ਅਤੇ ਸਰੋਤਾਂ ਦੀ ਵਰਤੋਂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।\n3. ਇਕੋਟੋਨ ਸਮੁਦਾਇਆਂ ਵਿਚਕਾਰ ਸੰਕ੍ਰਮਣ ਖੇਤਰ ਹੈ।\nਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
  ),
  "Consider the following statements:\n1. A biome is a large ecological region.\n2. The biosphere includes all ecosystems on Earth.\n3. Edge effect is an ecological change at a boundary.\nHow many are correct?": lp(
    "निम्नलिखित कथनों पर विचार कीजिए:\n1. बायोम एक बड़ा पारिस्थितिक क्षेत्र है।\n2. जैवमंडल में पृथ्वी के सभी पारितंत्र शामिल हैं।\n3. किनारी प्रभाव सीमा पर होने वाला पारिस्थितिक परिवर्तन है।\nकितने कथन सही हैं?",
    "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:\n1. ਬਾਇਓਮ ਇੱਕ ਵੱਡਾ ਪਰਿਸਥਿਤਿਕ ਖੇਤਰ ਹੈ।\n2. ਜੀਵ ਮੰਡਲ ਵਿੱਚ ਧਰਤੀ ਦੇ ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਸ਼ਾਮਲ ਹਨ।\n3. ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਸੀਮਾ ਤੇ ਹੋਣ ਵਾਲਾ ਪਰਿਸਥਿਤਿਕ ਬਦਲਾਅ ਹੈ।\nਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
  ),

  "Which statement correctly compares habitat and niche?": lp("आवास और निच की सही तुलना कौन-सा कथन करता है?", "ਆਵਾਸ ਅਤੇ ਨਿਚ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),
  "Which statement correctly compares an ecotone and edge effect?": lp("इकोटोन और किनारी प्रभाव की सही तुलना कौन-सा कथन करता है?", "ਇਕੋਟੋਨ ਅਤੇ ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਬਿਆਨ ਕਰਦਾ ਹੈ?"),
});

const EXPLANATION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "A population is made up of members of the same species living in one area.": lp("जनसंख्या एक क्षेत्र में रहने वाली समान प्रजाति के सदस्यों से बनती है।", "ਆਬਾਦੀ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਤੋਂ ਬਣਦੀ ਹੈ।"),
  "A community contains populations of different species living together.": lp("समुदाय में साथ रहने वाली विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।", "ਸਮੁਦਾਇ ਵਿੱਚ ਇਕੱਠੇ ਰਹਿਣ ਵਾਲੀਆਂ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
  "An ecosystem includes living organisms and the physical environment.": lp("पारितंत्र में जीवित जीव और भौतिक पर्यावरण दोनों शामिल होते हैं।", "ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਜੀਵਤ ਜੀਵ ਅਤੇ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"),
  "The biosphere includes all ecosystems on Earth.": lp("जैवमंडल में पृथ्वी के सभी पारितंत्र शामिल होते हैं।", "ਜੀਵ ਮੰਡਲ ਵਿੱਚ ਧਰਤੀ ਦੇ ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"),

  "Ecology studies organisms and their relationship with the environment.": lp("पारिस्थितिकी जीवों और पर्यावरण के साथ उनके संबंधों का अध्ययन करती है।", "ਪਰਿਸਥਿਤਿਕੀ ਜੀਵਾਂ ਅਤੇ ਵਾਤਾਵਰਣ ਨਾਲ ਉਨ੍ਹਾਂ ਦੇ ਸੰਬੰਧਾਂ ਦਾ ਅਧਿਐਨ ਕਰਦੀ ਹੈ।"),
  "A habitat is the place where an organism lives.": lp("आवास वह स्थान है जहाँ जीव रहता है।", "ਆਵਾਸ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ।"),
  "A niche is an organism's role, resource use and interactions.": lp("निच में जीव की भूमिका, संसाधनों का उपयोग और उसकी पारस्परिक क्रियाएँ शामिल होती हैं।", "ਨਿਚ ਵਿੱਚ ਜੀਵ ਦੀ ਭੂਮਿਕਾ, ਸਰੋਤਾਂ ਦੀ ਵਰਤੋਂ ਅਤੇ ਉਸ ਦੀਆਂ ਆਪਸੀ ਕਿਰਿਆਵਾਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ।"),
  "A biome is a large region mainly defined by climate and vegetation.": lp("बायोम एक बड़ा क्षेत्र है, जो मुख्यतः जलवायु और वनस्पति से निर्धारित होता है।", "ਬਾਇਓਮ ਇੱਕ ਵੱਡਾ ਖੇਤਰ ਹੈ ਜੋ ਮੁੱਖ ਤੌਰ ਤੇ ਜਲਵਾਯੂ ਅਤੇ ਬਨਸਪਤੀ ਨਾਲ ਨਿਰਧਾਰਤ ਹੁੰਦਾ ਹੈ।"),

  "One tiger is one organism.": lp("एक बाघ एक जीव है।", "ਇੱਕ ਬਾਘ ਇੱਕ ਜੀਵ ਹੈ।"),
  "Members of the same species living in one area form a population.": lp("एक क्षेत्र में रहने वाली समान प्रजाति के सदस्य जनसंख्या बनाते हैं।", "ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ ਆਬਾਦੀ ਬਣਾਉਂਦੇ ਹਨ।"),
  "Different species living together form a community.": lp("साथ रहने वाली विभिन्न प्रजातियाँ समुदाय बनाती हैं।", "ਇਕੱਠੇ ਰਹਿਣ ਵਾਲੀਆਂ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਸਮੁਦਾਇ ਬਣਾਉਂਦੀਆਂ ਹਨ।"),
  "An ecosystem includes living organisms and non-living surroundings.": lp("पारितंत्र में जीवित जीव और अजैविक परिवेश दोनों शामिल होते हैं।", "ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਜੀਵਤ ਜੀਵ ਅਤੇ ਅਜੈਵਿਕ ਵਾਤਾਵਰਣ ਦੋਵੇਂ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"),

  "Habitat is where an organism lives. Niche is its role there.": lp("आवास वह स्थान है जहाँ जीव रहता है; निच वहाँ उसकी भूमिका को बताता है।", "ਆਵਾਸ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ; ਨਿਚ ਉੱਥੇ ਉਸਦੀ ਭੂਮਿਕਾ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"),
  "A pollinator's role is part of its ecological niche.": lp("परागणकर्ता की भूमिका उसके पारिस्थितिक निच का भाग है।", "ਪਰਾਗਣਕ ਦੀ ਭੂਮਿਕਾ ਉਸਦੇ ਪਰਿਸਥਿਤਿਕ ਨਿਚ ਦਾ ਹਿੱਸਾ ਹੈ।"),
  "The place where an organism lives is its habitat.": lp("जहाँ जीव रहता है, वही उसका आवास है।", "ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ, ਉਹੀ ਉਸਦਾ ਆਵਾਸ ਹੈ।"),
  "Feeding role and interactions are part of an organism's niche.": lp("भोजन संबंधी भूमिका और पारस्परिक क्रियाएँ जीव के निच का भाग हैं।", "ਖੁਰਾਕੀ ਭੂਮਿਕਾ ਅਤੇ ਆਪਸੀ ਕਿਰਿਆਵਾਂ ਜੀਵ ਦੇ ਨਿਚ ਦਾ ਹਿੱਸਾ ਹਨ।"),

  "Ecological levels move from smaller units to broader ones in this order.": lp("पारिस्थितिक स्तर इस क्रम में छोटी इकाइयों से व्यापक इकाइयों की ओर बढ़ते हैं।", "ਪਰਿਸਥਿਤਿਕ ਪੱਧਰ ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਛੋਟੀਆਂ ਇਕਾਈਆਂ ਤੋਂ ਵੱਡੀਆਂ ਇਕਾਈਆਂ ਵੱਲ ਵਧਦੇ ਹਨ।"),

  "An organism is one individual. A population is a group of the same species in one area.": lp("जीव एक व्यक्तिगत इकाई है। जनसंख्या एक क्षेत्र में रहने वाली समान प्रजाति का समूह है।", "ਜੀਵ ਇੱਕ ਵਿਅਕਤੀਗਤ ਇਕਾਈ ਹੈ। ਆਬਾਦੀ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਦਾ ਸਮੂਹ ਹੈ।"),
  "A population has one species. A community has populations of different species.": lp("जनसंख्या में एक प्रजाति होती है। समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।", "ਆਬਾਦੀ ਵਿੱਚ ਇੱਕ ਪ੍ਰਜਾਤੀ ਹੁੰਦੀ ਹੈ। ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
  "A community includes living populations. An ecosystem also includes the physical environment.": lp("समुदाय में जीवित जनसंख्याएँ होती हैं। पारितंत्र में भौतिक पर्यावरण भी शामिल होता है।", "ਸਮੁਦਾਇ ਵਿੱਚ ਜੀਵਤ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਵੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।"),
  "A biome is a large region. The biosphere includes all ecosystems on Earth.": lp("बायोम एक बड़ा क्षेत्र है। जैवमंडल में पृथ्वी के सभी पारितंत्र शामिल होते हैं।", "ਬਾਇਓਮ ਇੱਕ ਵੱਡਾ ਖੇਤਰ ਹੈ। ਜੀਵ ਮੰਡਲ ਵਿੱਚ ਧਰਤੀ ਦੇ ਸਾਰੇ ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"),

  "An ecotone is the transition zone between two communities.": lp("इकोटोन दो समुदायों के बीच संक्रमण क्षेत्र है।", "ਇਕੋਟੋਨ ਦੋ ਸਮੁਦਾਇਆਂ ਵਿਚਕਾਰ ਸੰਕ੍ਰਮਣ ਖੇਤਰ ਹੈ।"),
  "The boundary zone itself is called an ecotone.": lp("सीमा क्षेत्र स्वयं इकोटोन कहलाता है।", "ਸੀਮਾ ਖੇਤਰ ਖੁਦ ਇਕੋਟੋਨ ਕਹਾਉਂਦਾ ਹੈ।"),
  "The ecological change seen near a boundary is called edge effect.": lp("सीमा के पास दिखाई देने वाला पारिस्थितिक परिवर्तन किनारी प्रभाव कहलाता है।", "ਸੀਮਾ ਨੇੜੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਪਰਿਸਥਿਤਿਕ ਬਦਲਾਅ ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਕਹਾਉਂਦਾ ਹੈ।"),
  "A boundary-related change in a community is called edge effect.": lp("सीमा से जुड़ा सामुदायिक परिवर्तन किनारी प्रभाव कहलाता है।", "ਸੀਮਾ ਨਾਲ ਜੁੜਿਆ ਸਮੁਦਾਇਕ ਬਦਲਾਅ ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਕਹਾਉਂਦਾ ਹੈ।"),

  "Species means an interbreeding group that can produce fertile offspring.": lp("प्रजाति ऐसा समूह है जिसके सदस्य आपस में प्रजनन करके उर्वर संतति उत्पन्न कर सकते हैं।", "ਪ੍ਰਜਾਤੀ ਉਹ ਸਮੂਹ ਹੈ ਜਿਸਦੇ ਜੀਵ ਆਪਸ ਵਿੱਚ ਪ੍ਰਜਨਨ ਕਰਕੇ ਉਪਜਾਊ ਸੰਤਾਨ ਪੈਦਾ ਕਰ ਸਕਦੇ ਹਨ।"),
  "A population is members of the same species living in one area.": lp("जनसंख्या एक क्षेत्र में रहने वाली समान प्रजाति के सदस्यों का समूह है।", "ਆਬਾਦੀ ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵਾਂ ਦਾ ਸਮੂਹ ਹੈ।"),
  "An ecosystem is a community interacting with its physical environment.": lp("पारितंत्र अपने भौतिक पर्यावरण के साथ परस्पर क्रिया करता समुदाय है।", "ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਆਪਣੇ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਨਾਲ ਆਪਸੀ ਕਿਰਿਆ ਕਰਦਾ ਸਮੁਦਾਇ ਹੈ।"),

  "Habitat is where an organism lives; its role is its niche.": lp("आवास वह स्थान है जहाँ जीव रहता है; उसकी भूमिका उसका निच है।", "ਆਵਾਸ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ; ਉਸਦੀ ਭੂਮਿਕਾ ਉਸਦਾ ਨਿਚ ਹੈ।"),
  "Niche is an organism's role; the transition zone is an ecotone.": lp("निच जीव की भूमिका है; संक्रमण क्षेत्र इकोटोन है।", "ਨਿਚ ਜੀਵ ਦੀ ਭੂਮਿਕਾ ਹੈ; ਸੰਕ੍ਰਮਣ ਖੇਤਰ ਇਕੋਟੋਨ ਹੈ।"),
  "An ecotone is the boundary zone; edge effect is the change seen there.": lp("इकोटोन सीमा क्षेत्र है; वहाँ दिखाई देने वाला परिवर्तन किनारी प्रभाव है।", "ਇਕੋਟੋਨ ਸੀਮਾ ਖੇਤਰ ਹੈ; ਉੱਥੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਬਦਲਾਅ ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਹੈ।"),
  "Edge effect is a boundary-related ecological change; habitat is the living place.": lp("किनारी प्रभाव सीमा से जुड़ा पारिस्थितिक परिवर्तन है; आवास जीव के रहने का स्थान है।", "ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਸੀਮਾ ਨਾਲ ਜੁੜਿਆ ਪਰਿਸਥਿਤਿਕ ਬਦਲਾਅ ਹੈ; ਆਵਾਸ ਜੀਵ ਦੇ ਰਹਿਣ ਦੀ ਥਾਂ ਹੈ।"),

  "Both are correct: population means one species; community includes different species.": lp("दोनों सही हैं: जनसंख्या में एक प्रजाति होती है, जबकि समुदाय में विभिन्न प्रजातियाँ होती हैं।", "ਦੋਵੇਂ ਸਹੀ ਹਨ: ਆਬਾਦੀ ਵਿੱਚ ਇੱਕ ਪ੍ਰਜਾਤੀ ਹੁੰਦੀ ਹੈ, ਜਦਕਿ ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
  "Only I is correct. An ecosystem includes both living and non-living components.": lp("केवल I सही है। पारितंत्र में जीवित और अजैविक दोनों घटक शामिल होते हैं।", "ਸਿਰਫ਼ I ਸਹੀ ਹੈ। ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਜੀਵਤ ਅਤੇ ਅਜੈਵਿਕ ਦੋਵੇਂ ਘਟਕ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"),
  "Only II is correct. Habitat is the living place; niche is the organism's role.": lp("केवल II सही है। आवास रहने का स्थान है; निच जीव की भूमिका है।", "ਸਿਰਫ਼ II ਸਹੀ ਹੈ। ਆਵਾਸ ਰਹਿਣ ਦੀ ਥਾਂ ਹੈ; ਨਿਚ ਜੀਵ ਦੀ ਭੂਮਿਕਾ ਹੈ।"),
  "Neither is correct. Ecotone is the boundary zone; edge effect is the change seen there.": lp("दोनों में से कोई सही नहीं है। इकोटोन सीमा क्षेत्र है; किनारी प्रभाव वहाँ होने वाला परिवर्तन है।", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਸਹੀ ਨਹੀਂ ਹੈ। ਇਕੋਟੋਨ ਸੀਮਾ ਖੇਤਰ ਹੈ; ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਉੱਥੇ ਹੋਣ ਵਾਲਾ ਬਦਲਾਅ ਹੈ।"),

  "Statements 1 and 3 are correct. A population contains members of the same species.": lp("कथन 1 और 3 सही हैं। जनसंख्या में समान प्रजाति के सदस्य होते हैं।", "ਬਿਆਨ 1 ਅਤੇ 3 ਸਹੀ ਹਨ। ਆਬਾਦੀ ਵਿੱਚ ਇੱਕੋ ਪ੍ਰਜਾਤੀ ਦੇ ਜੀਵ ਹੁੰਦੇ ਹਨ।"),
  "Statements 1 and 2 are correct. The biosphere, not a biome, is the global zone of life.": lp("कथन 1 और 2 सही हैं। वैश्विक जीवन क्षेत्र जैवमंडल है, बायोम नहीं।", "ਬਿਆਨ 1 ਅਤੇ 2 ਸਹੀ ਹਨ। ਵਿਸ਼ਵ ਜੀਵਨ ਖੇਤਰ ਜੀਵ ਮੰਡਲ ਹੈ, ਬਾਇਓਮ ਨਹੀਂ।"),
  "All three statements are correct.": lp("तीनों कथन सही हैं।", "ਤਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ।"),

  "A population has one species; a community has populations of different species.": lp("जनसंख्या में एक प्रजाति होती है; समुदाय में विभिन्न प्रजातियों की जनसंख्याएँ होती हैं।", "ਆਬਾਦੀ ਵਿੱਚ ਇੱਕ ਪ੍ਰਜਾਤੀ ਹੁੰਦੀ ਹੈ; ਸਮੁਦਾਇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਪ੍ਰਜਾਤੀਆਂ ਦੀਆਂ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
  "A community has living populations; an ecosystem also includes the physical environment.": lp("समुदाय में जीवित जनसंख्याएँ होती हैं; पारितंत्र में भौतिक पर्यावरण भी शामिल होता है।", "ਸਮੁਦਾਇ ਵਿੱਚ ਜੀਵਤ ਆਬਾਦੀਆਂ ਹੁੰਦੀਆਂ ਹਨ; ਪਰਿਸਥਿਤਿਕ ਤੰਤਰ ਵਿੱਚ ਭੌਤਿਕ ਵਾਤਾਵਰਣ ਵੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।"),
  "Habitat is where an organism lives; niche is its role and resource use.": lp("आवास वह स्थान है जहाँ जीव रहता है; निच उसकी भूमिका और संसाधनों के उपयोग को बताता है।", "ਆਵਾਸ ਉਹ ਥਾਂ ਹੈ ਜਿੱਥੇ ਜੀਵ ਰਹਿੰਦਾ ਹੈ; ਨਿਚ ਉਸਦੀ ਭੂਮਿਕਾ ਅਤੇ ਸਰੋਤਾਂ ਦੀ ਵਰਤੋਂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"),
  "Ecotone is the boundary zone; edge effect is the ecological change seen there.": lp("इकोटोन सीमा क्षेत्र है; किनारी प्रभाव वहाँ दिखाई देने वाला पारिस्थितिक परिवर्तन है।", "ਇਕੋਟੋਨ ਸੀਮਾ ਖੇਤਰ ਹੈ; ਕਿਨਾਰੀ ਪ੍ਰਭਾਵ ਉੱਥੇ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਪਰਿਸਥਿਤਿਕ ਬਦਲਾਅ ਹੈ।"),
});

function native(map: Readonly<Record<string, LocalePair>>, key: string, locale: NativeLocale): string | undefined {
  return map[key]?.[locale];
}

function option(text: string, locale: NativeLocale): string {
  const exact = native(ATOM, text, locale) ?? native(LONG_OPTION, text, locale);
  if (exact) return exact;

  if (text.includes(" → ")) {
    return text.split(" → ").map((part) => option(part, locale)).join(" → ");
  }
  if (text.includes(" — ")) {
    return text.split(" — ").map((part) => option(part, locale)).join(" — ");
  }
  if (text.includes("; ")) {
    return text.split("; ").map((part) => option(part, locale)).join("; ");
  }
  if (text.includes(": ")) {
    const [left, ...right] = text.split(": ");
    return `${option(left, locale)}: ${option(right.join(": "), locale)}`;
  }
  throw new Error(`ENV-CP-001 localization missing option: ${text}`);
}

function localizedBase(
  q: (typeof ENGLISH_CP001)[number],
  locale: EnvLocaleV1,
  stem: string,
  options: string[],
  canonicalAnswer: string,
  explanation: string,
): EnvLocalizedQuestionV1 {
  return {
    ...q,
    questionId: locale === "en" ? q.questionId : `${q.questionId}-${locale.toUpperCase()}`,
    stem,
    options,
    canonicalAnswer,
    explanation,
    locale,
    localizationV1: {
      version: ENV_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      semanticInvariant: true,
      cpInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true,
    },
  };
}

function localizeNative(q: (typeof ENGLISH_CP001)[number], locale: NativeLocale): EnvLocalizedQuestionV1 {
  const stem = native(STEM, q.stem, locale);
  const explanation = native(EXPLANATION, q.explanation, locale);
  if (!stem) throw new Error(`${q.questionId}: missing localized stem`);
  if (!explanation) throw new Error(`${q.questionId}: missing localized explanation`);
  const options = q.options.map((value) => option(value, locale));
  return localizedBase(q, locale, stem, options, options[q.correctIndex], explanation);
}

export function generateEnvCp001LocalizedReviewV1(locale: EnvLocaleV1): EnvLocalizedQuestionV1[] {
  if (locale === "en") {
    return ENGLISH_CP001.map((q) => localizedBase(q, locale, q.stem, [...q.options], q.canonicalAnswer, q.explanation));
  }
  return ENGLISH_CP001.map((q) => localizeNative(q, locale));
}

export const ENV_CP001_MULTILINGUAL_V1 = Object.freeze({
  en: generateEnvCp001LocalizedReviewV1("en"),
  hi: generateEnvCp001LocalizedReviewV1("hi"),
  pa: generateEnvCp001LocalizedReviewV1("pa"),
});
