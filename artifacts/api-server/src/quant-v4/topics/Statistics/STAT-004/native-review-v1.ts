import { pick, seededRandom } from "../shared/exact";
import { normalizeStatisticsFoundationLanguage } from "../shared/foundation-native-v1";
import { assertStat004Question } from "./data-foundations";
import { getStat004PermanentQlForContract } from "./permanent-ql-registry";
import { buildStat004ReviewFacts } from "./review-facts-v1";
import type { Stat004Question } from "./types";

export { normalizeStatisticsFoundationLanguage as normalizeStat004Language };
type NativeLanguage = "hi" | "pa";
type Copy = readonly [string, string];
const terms: Readonly<Record<string, Copy>> = {
  "primary data": ["प्राथमिक आँकड़े", "ਮੁੱਢਲੇ ਅੰਕੜੇ"],
  "secondary data": ["द्वितीयक आँकड़े", "ਦੁਤੀਆ ਅੰਕੜੇ"],
  "published records": ["प्रकाशित अभिलेख", "ਪ੍ਰਕਾਸ਼ਿਤ ਰਿਕਾਰਡ"],
  "a sampling error": ["प्रतिचयन त्रुटि", "ਨਮੂਨਾਕਰਨ ਦੀ ਗਲਤੀ"],
  "complete enumeration": ["पूर्ण गणना", "ਪੂਰੀ ਗਿਣਤੀ"],
  "a sample survey": ["प्रतिदर्श सर्वेक्षण", "ਨਮੂਨਾ ਸਰਵੇਖਣ"],
  "indirect oral investigation": [
    "अप्रत्यक्ष मौखिक अन्वेषण",
    "ਅਸਿੱਧੀ ਮੌਖਿਕ ਪੜਤਾਲ",
  ],
  "secondary-data collection": [
    "द्वितीयक आँकड़ों का संग्रह",
    "ਦੁਤੀਆ ਅੰਕੜਿਆਂ ਦਾ ਸੰਗ੍ਰਹਿ",
  ],
  "direct personal investigation": [
    "प्रत्यक्ष व्यक्तिगत अन्वेषण",
    "ਸਿੱਧੀ ਨਿੱਜੀ ਪੜਤਾਲ",
  ],
  "a mailed questionnaire": [
    "डाक से भेजी प्रश्नावली",
    "ਡਾਕ ਰਾਹੀਂ ਭੇਜੀ ਪ੍ਰਸ਼ਨਾਵਲੀ",
  ],
  "published-source collection": [
    "प्रकाशित स्रोतों से संग्रह",
    "ਪ੍ਰਕਾਸ਼ਿਤ ਸਰੋਤਾਂ ਤੋਂ ਸੰਗ੍ਰਹਿ",
  ],
  "respondent-completed questionnaire": [
    "उत्तरदाता द्वारा भरी प्रश्नावली",
    "ਉੱਤਰਦਾਤਾ ਵੱਲੋਂ ਭਰੀ ਪ੍ਰਸ਼ਨਾਵਲੀ",
  ],
  schedule: ["अनुसूची", "ਅਨੁਸੂਚੀ"],
  "observation sheet": ["अवलोकन पत्रक", "ਨਿਰੀਖਣ ਪੱਤਰ"],
  "published statistical table": [
    "प्रकाशित सांख्यिकीय सारणी",
    "ਪ੍ਰਕਾਸ਼ਿਤ ਅੰਕੜਾ ਸਾਰਣੀ",
  ],
  observation: ["अवलोकन", "ਨਿਰੀਖਣ"],
  "mailed questionnaire": [
    "डाक से भेजी प्रश्नावली",
    "ਡਾਕ ਰਾਹੀਂ ਭੇਜੀ ਪ੍ਰਸ਼ਨਾਵਲੀ",
  ],
  "secondary-data analysis": [
    "द्वितीयक आँकड़ों का विश्लेषण",
    "ਦੁਤੀਆ ਅੰਕੜਿਆਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
  ],
  "Whether definitions, units, population coverage and reference periods are comparable":
    [
      "परिभाषाएँ, इकाइयाँ, समष्टि का दायरा और संदर्भ अवधियाँ तुलनीय हैं या नहीं",
      "ਪਰਿਭਾਸ਼ਾਵਾਂ, ਇਕਾਈਆਂ, ਸਮਸ਼ਟੀ ਦਾ ਦਾਇਰਾ ਅਤੇ ਸੰਦਰਭ ਸਮੇਂ ਤੁਲਨਾਯੋਗ ਹਨ ਜਾਂ ਨਹੀਂ",
    ],
  "Which report has the larger numbers": [
    "किस रिपोर्ट में संख्याएँ बड़ी हैं",
    "ਕਿਹੜੀ ਰਿਪੋਰਟ ਵਿੱਚ ਸੰਖਿਆਵਾਂ ਵੱਡੀਆਂ ਹਨ",
  ],
  "Whether both reports use the same page layout": [
    "दोनों रिपोर्टों की पृष्ठ-सज्जा एक जैसी है या नहीं",
    "ਦੋਵੇਂ ਰਿਪੋਰਟਾਂ ਦੀ ਸਫ਼ਾ ਸਜਾਵਟ ਇੱਕੋ ਜਿਹੀ ਹੈ ਜਾਂ ਨਹੀਂ",
  ],
  "Whether the reports were printed in the same year": [
    "रिपोर्टें एक ही वर्ष में छपी थीं या नहीं",
    "ਰਿਪੋਰਟਾਂ ਇੱਕੋ ਸਾਲ ਛਪੀਆਂ ਸਨ ਜਾਂ ਨਹੀਂ",
  ],
  "a qualitative attribute": ["गुणात्मक विशेषता", "ਗੁਣਾਤਮਕ ਵਿਸ਼ੇਸ਼ਤਾ"],
  "a continuous variable": ["सतत चर", "ਨਿਰੰਤਰ ਚਰ"],
  "a numerical magnitude": ["संख्यात्मक परिमाण", "ਸੰਖਿਆਤਮਕ ਪਰਿਮਾਣ"],
  "a class mark": ["वर्ग मध्यबिंदु", "ਵਰਗ ਦਾ ਮੱਧ-ਬਿੰਦੂ"],
  "number of buses in a depot": [
    "डिपो में बसों की संख्या",
    "ਡਿਪੂ ਵਿੱਚ ਬੱਸਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  "number of calls received": [
    "प्राप्त कॉलों की संख्या",
    "ਪ੍ਰਾਪਤ ਕਾਲਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  "weight of a package": ["पैकेट का भार", "ਪੈਕੇਟ ਦਾ ਭਾਰ"],
  "temperature of a sample": ["नमूने का तापमान", "ਨਮੂਨੇ ਦਾ ਤਾਪਮਾਨ"],
  "chronological classification": [
    "कालानुक्रमिक वर्गीकरण",
    "ਸਮੇਂ ਅਨੁਸਾਰ ਵਰਗੀਕਰਨ",
  ],
  "geographical classification": ["भौगोलिक वर्गीकरण", "ਭੂਗੋਲਿਕ ਵਰਗੀਕਰਨ"],
  "qualitative classification": ["गुणात्मक वर्गीकरण", "ਗੁਣਾਤਮਕ ਵਰਗੀਕਰਨ"],
  "individual classification": ["व्यक्तिगत वर्गीकरण", "ਵਿਅਕਤੀਗਤ ਵਰਗੀਕਰਨ"],
  "one-way classification": ["एकमार्गी वर्गीकरण", "ਇੱਕ-ਪੱਖੀ ਵਰਗੀਕਰਨ"],
  "two-way classification": ["द्विमार्गी वर्गीकरण", "ਦੋ-ਪੱਖੀ ਵਰਗੀਕਰਨ"],
  "chronological classification only": [
    "केवल कालानुक्रमिक वर्गीकरण",
    "ਕੇਵਲ ਸਮੇਂ ਅਨੁਸਾਰ ਵਰਗੀਕਰਨ",
  ],
  "a raw-data array": [
    "कच्चे आँकड़ों का क्रमबद्ध विन्यास",
    "ਕੱਚੇ ਅੰਕੜਿਆਂ ਦੀ ਕ੍ਰਮਬੱਧ ਲੜੀ",
  ],
  stub: ["पंक्ति शीर्षक (स्टब)", "ਕਤਾਰ ਸਿਰਲੇਖ (ਸਟੱਬ)"],
  "captions (boxhead)": ["स्तंभ शीर्षक (बॉक्सहेड)", "ਕਾਲਮ ਸਿਰਲੇਖ (ਬਾਕਸਹੈੱਡ)"],
  "table body": ["सारणी का मुख्य भाग", "ਸਾਰਣੀ ਦਾ ਮੁੱਖ ਭਾਗ"],
  "source note": ["स्रोत संबंधी टिप्पणी", "ਸਰੋਤ ਸੰਬੰਧੀ ਟਿੱਪਣੀ"],
  "Both adjacent classes": [
    "दोनों आसन्न वर्गों में",
    "ਦੋਵੇਂ ਨਾਲ ਲੱਗਦੇ ਵਰਗਾਂ ਵਿੱਚ",
  ],
  "Neither adjacent class": [
    "दोनों में से किसी वर्ग में नहीं",
    "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵਰਗ ਵਿੱਚ ਨਹੀਂ",
  ],
};
const measured = [
  [
    "weight of parcels handled in a day",
    "एक दिन में सँभाले गए पार्सलों का भार",
    "ਇੱਕ ਦਿਨ ਵਿੱਚ ਸੰਭਾਲੇ ਗਏ ਪਾਰਸਲਾਂ ਦਾ ਭਾਰ",
  ],
  [
    "time taken to complete a task",
    "कार्य पूरा करने में लगा समय",
    "ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਲੱਗਿਆ ਸਮਾਂ",
  ],
  [
    "length of metal rods produced",
    "बनाई गई धातु की छड़ों की लंबाई",
    "ਬਣਾਈਆਂ ਧਾਤ ਦੀਆਂ ਛੜਾਂ ਦੀ ਲੰਬਾਈ",
  ],
  [
    "volume of water used by a household",
    "परिवार द्वारा उपयोग किए पानी का आयतन",
    "ਪਰਿਵਾਰ ਵੱਲੋਂ ਵਰਤੇ ਪਾਣੀ ਦਾ ਆਇਤਨ",
  ],
] as const;
const counted = [
  [
    "number of customer complaints in a week",
    "एक सप्ताह में ग्राहकों की शिकायतों की संख्या",
    "ਇੱਕ ਹਫ਼ਤੇ ਵਿੱਚ ਗਾਹਕਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  [
    "number of machines operating in a plant",
    "कारखाने में चल रही मशीनों की संख्या",
    "ਕਾਰਖਾਨੇ ਵਿੱਚ ਚੱਲ ਰਹੀਆਂ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  [
    "number of seeds in a packet",
    "पैकेट में बीजों की संख्या",
    "ਪੈਕੇਟ ਵਿੱਚ ਬੀਜਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  [
    "number of absent students in a class",
    "कक्षा में अनुपस्थित विद्यार्थियों की संख्या",
    "ਜਮਾਤ ਵਿੱਚ ਗੈਰਹਾਜ਼ਰ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ",
  ],
  [
    "number of calls received in an hour",
    "एक घंटे में प्राप्त कॉलों की संख्या",
    "ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਪ੍ਰਾਪਤ ਕਾਲਾਂ ਦੀ ਗਿਣਤੀ",
  ],
  [
    "number of defective units in a batch",
    "खेप में दोषपूर्ण इकाइयों की संख्या",
    "ਖੇਪ ਵਿੱਚ ਨੁਕਸਦਾਰ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ",
  ],
] as const;

/** Authored complete scenario surfaces and semantic option labels. */
export function renderStat004Native(
  source: Stat004Question,
  language: NativeLanguage,
) {
  assertStat004Question(source);
  const owner = getStat004PermanentQlForContract(source.contractId);
  if (owner.qlId !== source.qlId)
    throw new Error("STAT-004 native QL ownership mismatch.");
  const facts = buildStat004ReviewFacts(source.contractId, source.seed);
  const t = (hi: string, pa: string) => (language === "hi" ? hi : pa);
  const choice = (copies: readonly Copy[], index: number) => {
    const c = copies[index];
    if (!c) throw new Error("Uncovered STAT-004 native variant");
    return c[language === "hi" ? 0 : 1];
  };
  const dynamic = new Map<string, string>();
  const option = (value: string) => {
    const custom = dynamic.get(value);
    if (custom !== undefined) return custom;
    const copy = terms[value];
    if (copy) return copy[language === "hi" ? 0 : 1];
    if (/^\d+(?:, \d+)*$/u.test(value)) return value;
    throw new Error(`Untranslated STAT-004 option '${value}'.`);
  };
  let stems: readonly string[] = [],
    explanation = "",
    expected = "";
  switch (facts.kind) {
    case "PRIMARY_VS_SECONDARY_SOURCE": {
      const scenario = choice(
        [
          [
            "कारखाना अपने श्रमिकों से उनकी रोज़ की यात्रा के समय पर नया सर्वेक्षण भरवाता है।",
            "ਕਾਰਖਾਨਾ ਆਪਣੇ ਕਾਮਿਆਂ ਤੋਂ ਰੋਜ਼ਾਨਾ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ਬਾਰੇ ਨਵਾਂ ਸਰਵੇਖਣ ਭਰਵਾਉਂਦਾ ਹੈ।",
          ],
          [
            "शोधकर्ता इस महीने माल की कमी दर्ज करने के लिए दुकानदारों से सीधे बातचीत करता है।",
            "ਖੋਜਕਰਤਾ ਇਸ ਮਹੀਨੇ ਮਾਲ ਦੀ ਘਾਟ ਦਰਜ ਕਰਨ ਲਈ ਦੁਕਾਨਦਾਰਾਂ ਨਾਲ ਸਿੱਧੀ ਗੱਲਬਾਤ ਕਰਦਾ ਹੈ।",
          ],
          [
            "कृषि अधिकारी इस मौसम के अध्ययन के लिए चुने गए खेतों की उपज स्वयं मापता है।",
            "ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਇਸ ਮੌਸਮ ਦੇ ਅਧਿਐਨ ਲਈ ਚੁਣੇ ਖੇਤਾਂ ਦੀ ਉਪਜ ਆਪ ਮਾਪਦਾ ਹੈ।",
          ],
          [
            "महाविद्यालय नए अध्ययन के लिए विद्यार्थियों से उनके दैनिक अध्ययन के घंटे पूछता है।",
            "ਕਾਲਜ ਨਵੇਂ ਅਧਿਐਨ ਲਈ ਵਿਦਿਆਰਥੀਆਂ ਤੋਂ ਰੋਜ਼ਾਨਾ ਪੜ੍ਹਾਈ ਦੇ ਘੰਟੇ ਪੁੱਛਦਾ ਹੈ।",
          ],
          [
            "अस्पताल इस सप्ताह बाह्य रोगी विभाग में आए मरीजों से सीधे उनके प्रतीक्षा समय दर्ज करता है।",
            "ਹਸਪਤਾਲ ਇਸ ਹਫ਼ਤੇ ਬਾਹਰੀ ਮਰੀਜ਼ ਵਿਭਾਗ ਵਿੱਚ ਆਏ ਮਰੀਜ਼ਾਂ ਤੋਂ ਸਿੱਧੇ ਉਨ੍ਹਾਂ ਦੇ ਉਡੀਕ ਸਮੇਂ ਦਰਜ ਕਰਦਾ ਹੈ।",
          ],
          [
            "परिवहन कार्यालय यात्रियों से सीधे उनकी सुबह की यात्रा की अवधि पूछता है।",
            "ਆਵਾਜਾਈ ਦਫ਼ਤਰ ਯਾਤਰੀਆਂ ਤੋਂ ਸਿੱਧੇ ਉਨ੍ਹਾਂ ਦੇ ਸਵੇਰ ਦੇ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।",
          ],
        ],
        facts.variant,
      );
      stems = [
        scenario +
          t(" ये किस प्रकार के आँकड़े हैं?", " ਇਹ ਕਿਸ ਕਿਸਮ ਦੇ ਅੰਕੜੇ ਹਨ?"),
        t(
          "नए अध्ययन के लिए अन्वेषक संबंधित व्यक्तियों से सीधे उत्तर एकत्र करता है। ये किस प्रकार के आँकड़े हैं?",
          "ਨਵੇਂ ਅਧਿਐਨ ਲਈ ਪੜਤਾਲਕਰਤਾ ਸੰਬੰਧਿਤ ਵਿਅਕਤੀਆਂ ਤੋਂ ਸਿੱਧੇ ਉੱਤਰ ਇਕੱਠੇ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਸ ਕਿਸਮ ਦੇ ਅੰਕੜੇ ਹਨ?",
        ),
      ];
      expected = "primary data";
      explanation = t(
        "वर्तमान अध्ययन के लिए पहली बार सीधे एकत्र किए आँकड़े प्राथमिक आँकड़े हैं। पहले से उपलब्ध रिपोर्ट का उपयोग करने पर वे इस अध्ययन के लिए द्वितीयक आँकड़े होते।",
        "ਮੌਜੂਦਾ ਅਧਿਐਨ ਲਈ ਪਹਿਲੀ ਵਾਰ ਸਿੱਧੇ ਇਕੱਠੇ ਕੀਤੇ ਅੰਕੜੇ ਮੁੱਢਲੇ ਅੰਕੜੇ ਹਨ। ਪਹਿਲਾਂ ਤੋਂ ਉਪਲਬਧ ਰਿਪੋਰਟ ਵਰਤਣ ਨਾਲ ਉਹ ਇਸ ਅਧਿਐਨ ਲਈ ਦੁਤੀਆ ਅੰਕੜੇ ਹੁੰਦੇ।",
      );
      break;
    }
    case "CENSUS_VS_SAMPLE_ENUMERATION": {
      const population = choice(
        [
          [
            "महाविद्यालय के सभी 640 विद्यार्थियों",
            "ਕਾਲਜ ਦੇ ਸਾਰੇ 640 ਵਿਦਿਆਰਥੀਆਂ",
          ],
          ["गाँव के प्रत्येक परिवार", "ਪਿੰਡ ਦੇ ਹਰੇਕ ਪਰਿਵਾਰ"],
          ["कारखाने की सभी 275 मशीनों", "ਕਾਰਖਾਨੇ ਦੀਆਂ ਸਾਰੀਆਂ 275 ਮਸ਼ੀਨਾਂ"],
          ["बाज़ार की प्रत्येक पंजीकृत दुकान", "ਬਾਜ਼ਾਰ ਦੀ ਹਰੇਕ ਦਰਜ ਦੁਕਾਨ"],
          [
            "कंपनी की वेतन-सूची के प्रत्येक कर्मचारी",
            "ਕੰਪਨੀ ਦੀ ਤਨਖ਼ਾਹ ਸੂਚੀ ਦੇ ਹਰੇਕ ਕਰਮਚਾਰੀ",
          ],
          ["डिपो से चलने वाली सभी बसों", "ਡਿਪੂ ਤੋਂ ਚੱਲਣ ਵਾਲੀਆਂ ਸਾਰੀਆਂ ਬੱਸਾਂ"],
        ],
        facts.variant,
      );
      stems = [
        t(
          `सर्वेक्षण में ${population} से संबंधित जानकारी ली जाती है। यह कौन-सी विधि है?`,
          `ਸਰਵੇਖਣ ਵਿੱਚ ${population} ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਈ ਜਾਂਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
        t(
          `अन्वेषक निर्धारित समष्टि की प्रत्येक इकाई, अर्थात ${population} से संबंधित जानकारी प्राप्त करता है। यह किसका उदाहरण है?`,
          `ਪੜਤਾਲਕਰਤਾ ਨਿਰਧਾਰਤ ਸਮਸ਼ਟੀ ਦੀ ਹਰੇਕ ਇਕਾਈ, ਅਰਥਾਤ ${population} ਬਾਰੇ ਜਾਣਕਾਰੀ ਲੈਂਦਾ ਹੈ। ਇਹ ਕਿਸ ਦੀ ਉਦਾਹਰਨ ਹੈ?`,
        ),
      ];
      expected = "complete enumeration";
      explanation = t(
        "निर्धारित समष्टि की प्रत्येक इकाई शामिल है, इसलिए यह पूर्ण गणना है। प्रतिदर्श सर्वेक्षण में केवल चुना हुआ भाग शामिल होता है।",
        "ਨਿਰਧਾਰਤ ਸਮਸ਼ਟੀ ਦੀ ਹਰੇਕ ਇਕਾਈ ਸ਼ਾਮਲ ਹੈ, ਇਸ ਲਈ ਇਹ ਪੂਰੀ ਗਿਣਤੀ ਹੈ। ਨਮੂਨਾ ਸਰਵੇਖਣ ਵਿੱਚ ਕੇਵਲ ਚੁਣਿਆ ਹਿੱਸਾ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।",
      );
      break;
    }
    case "DIRECT_PERSONAL_INVESTIGATION": {
      const topic = choice(
        [
          ["परिवारों के जल उपयोग", "ਪਰਿਵਾਰਾਂ ਵੱਲੋਂ ਪਾਣੀ ਦੀ ਵਰਤੋਂ"],
          ["किसानों की बीज संबंधी पसंद", "ਕਿਸਾਨਾਂ ਦੀ ਬੀਜ ਸੰਬੰਧੀ ਪਸੰਦ"],
          ["श्रमिकों की पाली संबंधी पसंद", "ਕਾਮਿਆਂ ਦੀ ਕੰਮ ਦੀ ਪਾਰੀ ਸੰਬੰਧੀ ਪਸੰਦ"],
          [
            "खुदरा विक्रेताओं की साप्ताहिक बिक्री",
            "ਪ੍ਰਚੂਨ ਵਿਕਰੇਤਾਵਾਂ ਦੀ ਹਫ਼ਤਾਵਾਰੀ ਵਿਕਰੀ",
          ],
        ],
        facts.variant,
      );
      stems = [
        t(
          `अन्वेषक संबंधित व्यक्तियों से मिलकर ${topic} के बारे में स्वयं पूछता है। संग्रह की कौन-सी विधि है?`,
          `ਪੜਤਾਲਕਰਤਾ ਸੰਬੰਧਿਤ ਵਿਅਕਤੀਆਂ ਨੂੰ ਮਿਲ ਕੇ ${topic} ਬਾਰੇ ਆਪ ਪੁੱਛਦਾ ਹੈ। ਸੰਗ੍ਰਹਿ ਦੀ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
        t(
          `${topic} पर जानकारी लेने के लिए अन्वेषक उत्तरदाताओं से मिलता है और उनके उत्तर सीधे दर्ज करता है। यह कौन-सी विधि है?`,
          `${topic} ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਈ ਪੜਤਾਲਕਰਤਾ ਉੱਤਰਦਾਤਿਆਂ ਨੂੰ ਮਿਲਦਾ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਉੱਤਰ ਸਿੱਧੇ ਦਰਜ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
      ];
      expected = "direct personal investigation";
      explanation = t(
        "जानकारी संबंधित व्यक्तियों से अन्वेषक स्वयं लेता है, इसलिए यह प्रत्यक्ष व्यक्तिगत अन्वेषण है। अप्रत्यक्ष मौखिक विधि में जानकारी अन्य जानकार व्यक्तियों से ली जाती है।",
        "ਜਾਣਕਾਰੀ ਸੰਬੰਧਿਤ ਵਿਅਕਤੀਆਂ ਤੋਂ ਪੜਤਾਲਕਰਤਾ ਆਪ ਲੈਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਸਿੱਧੀ ਨਿੱਜੀ ਪੜਤਾਲ ਹੈ। ਅਸਿੱਧੀ ਮੌਖਿਕ ਵਿਧੀ ਵਿੱਚ ਜਾਣਕਾਰੀ ਹੋਰ ਜਾਣਕਾਰ ਵਿਅਕਤੀਆਂ ਤੋਂ ਲਈ ਜਾਂਦੀ ਹੈ।",
      );
      break;
    }
    case "INDIRECT_ORAL_INVESTIGATION": {
      const group = choice(
        [
          [
            "ऐसे मौसमी श्रमिकों जिनसे व्यक्तिगत संपर्क कठिन है",
            "ਅਜਿਹੇ ਮੌਸਮੀ ਕਾਮਿਆਂ ਜਿਨ੍ਹਾਂ ਨਾਲ ਨਿੱਜੀ ਸੰਪਰਕ ਔਖਾ ਹੈ",
          ],
          ["बाज़ार छोड़ चुके व्यापारियों", "ਬਾਜ਼ਾਰ ਛੱਡ ਚੁੱਕੇ ਵਪਾਰੀਆਂ"],
          [
            "अस्थायी सड़क बंद होने से प्रभावित क्षेत्र के परिवारों",
            "ਆਰਜ਼ੀ ਸੜਕ ਬੰਦ ਹੋਣ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਦੇ ਪਰਿਵਾਰਾਂ",
          ],
        ],
        facts.variant,
      );
      stems = [
        t(
          `${group} का अध्ययन करते समय अन्वेषक उनसे सीधे संपर्क करने के बजाय उन्हें अच्छी तरह जानने वाले कई व्यक्तियों से जानकारी लेता है। यह कौन-सी विधि है?`,
          `${group} ਦਾ ਅਧਿਐਨ ਕਰਦੇ ਸਮੇਂ ਪੜਤਾਲਕਰਤਾ ਉਨ੍ਹਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਨ ਦੀ ਥਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਜਾਣਦੇ ਕਈ ਵਿਅਕਤੀਆਂ ਤੋਂ ਜਾਣਕਾਰੀ ਲੈਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
        t(
          `${group} से सीधे उत्तर मिलना कठिन है। अन्वेषक जानकार गवाहों से जानकारी एकत्र करता है। यह कौन-सी विधि है?`,
          `${group} ਤੋਂ ਸਿੱਧੇ ਉੱਤਰ ਮਿਲਣੇ ਔਖੇ ਹਨ। ਪੜਤਾਲਕਰਤਾ ਜਾਣਕਾਰ ਗਵਾਹਾਂ ਤੋਂ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
      ];
      expected = "indirect oral investigation";
      explanation = t(
        "जानकारी अध्ययन की इकाइयों से सीधे न लेकर उन्हें जानने वाले अन्य व्यक्तियों से ली गई है। यह अप्रत्यक्ष मौखिक अन्वेषण है; गवाहों की विश्वसनीयता भी जाँची जानी चाहिए।",
        "ਜਾਣਕਾਰੀ ਅਧਿਐਨ ਦੀਆਂ ਇਕਾਈਆਂ ਤੋਂ ਸਿੱਧੀ ਲੈਣ ਦੀ ਥਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਜਾਣਦੇ ਹੋਰ ਵਿਅਕਤੀਆਂ ਤੋਂ ਲਈ ਗਈ ਹੈ। ਇਹ ਅਸਿੱਧੀ ਮੌਖਿਕ ਪੜਤਾਲ ਹੈ; ਗਵਾਹਾਂ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਵੀ ਜਾਂਚਣੀ ਚਾਹੀਦੀ ਹੈ।",
      );
      break;
    }
    case "SCHEDULE_VS_QUESTIONNAIRE": {
      const process = choice(
        [
          [
            "गणनाकर्मी घरों में जाकर प्रश्न पूछते हैं और प्रत्येक उत्तर स्वयं लिखते हैं।",
            "ਗਿਣਤੀ ਕਰਮਚਾਰੀ ਘਰਾਂ ਵਿੱਚ ਜਾ ਕੇ ਸਵਾਲ ਪੁੱਛਦੇ ਹਨ ਅਤੇ ਹਰੇਕ ਉੱਤਰ ਆਪ ਲਿਖਦੇ ਹਨ।",
          ],
          [
            "शोध कार्यालय डाक से फॉर्म भेजता है। उत्तरदाता उन्हें स्वयं भरकर लौटाते हैं।",
            "ਖੋਜ ਦਫ਼ਤਰ ਡਾਕ ਰਾਹੀਂ ਫਾਰਮ ਭੇਜਦਾ ਹੈ। ਉੱਤਰਦਾਤਾ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪ ਭਰ ਕੇ ਵਾਪਸ ਭੇਜਦੇ ਹਨ।",
          ],
          [
            "क्षेत्रीय अन्वेषक प्रत्येक प्रश्न पढ़कर सुनाते हैं और उत्तर स्वयं फॉर्म में भरते हैं।",
            "ਖੇਤਰੀ ਪੜਤਾਲਕਰਤਾ ਹਰੇਕ ਸਵਾਲ ਪੜ੍ਹ ਕੇ ਸੁਣਾਉਂਦੇ ਹਨ ਅਤੇ ਉੱਤਰ ਆਪ ਫਾਰਮ ਵਿੱਚ ਭਰਦੇ ਹਨ।",
          ],
        ],
        facts.variant,
      );
      stems = [
        process +
          t(
            " यहाँ फॉर्म का उपयोग किस रूप में हो रहा है?",
            " ਇੱਥੇ ਫਾਰਮ ਕਿਸ ਰੂਪ ਵਿੱਚ ਵਰਤਿਆ ਜਾ ਰਿਹਾ ਹੈ?",
          ),
        process +
          t(
            " यह अनुसूची विधि है या प्रश्नावली विधि?",
            " ਇਹ ਅਨੁਸੂਚੀ ਵਿਧੀ ਹੈ ਜਾਂ ਪ੍ਰਸ਼ਨਾਵਲੀ ਵਿਧੀ?",
          ),
      ];
      expected =
        facts.variant === 1 ? "respondent-completed questionnaire" : "schedule";
      explanation =
        facts.variant === 1
          ? t(
              "उत्तरदाता स्वयं फॉर्म भरकर लौटाते हैं, इसलिए यह प्रश्नावली विधि है। अनुसूची में गणनाकर्मी प्रश्न पूछकर उत्तर दर्ज करता है।",
              "ਉੱਤਰਦਾਤਾ ਆਪ ਫਾਰਮ ਭਰ ਕੇ ਵਾਪਸ ਭੇਜਦੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਪ੍ਰਸ਼ਨਾਵਲੀ ਵਿਧੀ ਹੈ। ਅਨੁਸੂਚੀ ਵਿੱਚ ਗਿਣਤੀ ਕਰਮਚਾਰੀ ਸਵਾਲ ਪੁੱਛ ਕੇ ਉੱਤਰ ਦਰਜ ਕਰਦਾ ਹੈ।",
            )
          : t(
              "प्रश्न पूछने और उत्तर लिखने का कार्य गणनाकर्मी करता है, इसलिए यह अनुसूची है। प्रश्नावली सामान्यतः उत्तरदाता स्वयं भरता है।",
              "ਸਵਾਲ ਪੁੱਛਣ ਅਤੇ ਉੱਤਰ ਲਿਖਣ ਦਾ ਕੰਮ ਗਿਣਤੀ ਕਰਮਚਾਰੀ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਅਨੁਸੂਚੀ ਹੈ। ਪ੍ਰਸ਼ਨਾਵਲੀ ਆਮ ਤੌਰ 'ਤੇ ਉੱਤਰਦਾਤਾ ਆਪ ਭਰਦਾ ਹੈ।",
            );
      break;
    }
    case "OBSERVATION_METHOD": {
      const activity = choice(
        [
          ["टोल नाके पर वाहनों का प्रवेश", "ਟੋਲ ਨਾਕੇ 'ਤੇ ਵਾਹਨਾਂ ਦਾ ਦਾਖ਼ਲਾ"],
          [
            "सेवा की कतार में ग्राहकों का जुड़ना",
            "ਸੇਵਾ ਦੀ ਕਤਾਰ ਵਿੱਚ ਗਾਹਕਾਂ ਦਾ ਲੱਗਣਾ",
          ],
          [
            "चिह्नित दाना क्षेत्र में पक्षियों का आना",
            "ਨਿਸ਼ਾਨਬੱਧ ਚੋਗਾ ਖੇਤਰ ਵਿੱਚ ਪੰਛੀਆਂ ਦਾ ਆਉਣਾ",
          ],
          [
            "उत्पादन पाली के दौरान मशीनों का रुकना",
            "ਉਤਪਾਦਨ ਦੀ ਪਾਰੀ ਦੌਰਾਨ ਮਸ਼ੀਨਾਂ ਦਾ ਰੁਕਣਾ",
          ],
          [
            "पंजीकरण काउंटर पर मरीजों का पहुँचना",
            "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਾਊਂਟਰ 'ਤੇ ਮਰੀਜ਼ਾਂ ਦਾ ਪਹੁੰਚਣਾ",
          ],
          [
            "स्कैनिंग बिंदु से पैकेटों का गुजरना",
            "ਸਕੈਨਿੰਗ ਬਿੰਦੂ ਤੋਂ ਪੈਕੇਟਾਂ ਦਾ ਲੰਘਣਾ",
          ],
        ],
        facts.variant,
      );
      stems = [
        t(
          `अन्वेषक ${activity} स्वयं देखकर हर घटना दर्ज करता है; किसी से बताने को नहीं कहता। यह कौन-सी विधि है?`,
          `ਪੜਤਾਲਕਰਤਾ ${activity} ਆਪ ਦੇਖ ਕੇ ਹਰੇਕ ਘਟਨਾ ਦਰਜ ਕਰਦਾ ਹੈ; ਕਿਸੇ ਨੂੰ ਦੱਸਣ ਲਈ ਨਹੀਂ ਕਹਿੰਦਾ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
        t(
          `${activity} की जानकारी के लिए अन्वेषक घटनाएँ होते समय उन्हें स्वयं देखता और दर्ज करता है। यह कौन-सी विधि है?`,
          `${activity} ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਈ ਪੜਤਾਲਕਰਤਾ ਘਟਨਾਵਾਂ ਵਾਪਰਨ ਵੇਲੇ ਉਨ੍ਹਾਂ ਨੂੰ ਆਪ ਦੇਖਦਾ ਅਤੇ ਦਰਜ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਵਿਧੀ ਹੈ?`,
        ),
      ];
      expected = "observation";
      explanation = t(
        "घटनाएँ होते समय स्वयं देखकर दर्ज की जा रही हैं। उत्तरदाताओं के बताए विवरण पर निर्भरता नहीं है, इसलिए यह अवलोकन विधि है।",
        "ਘਟਨਾਵਾਂ ਵਾਪਰਨ ਵੇਲੇ ਆਪ ਦੇਖ ਕੇ ਦਰਜ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ। ਉੱਤਰਦਾਤਿਆਂ ਦੇ ਦੱਸੇ ਵੇਰਵਿਆਂ 'ਤੇ ਨਿਰਭਰਤਾ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿਰੀਖਣ ਵਿਧੀ ਹੈ।",
      );
      break;
    }
    case "SECONDARY_DATA_FITNESS": {
      const subject = choice(
        [
          ["परिवारों के बिजली उपयोग", "ਪਰਿਵਾਰਾਂ ਵੱਲੋਂ ਬਿਜਲੀ ਦੀ ਵਰਤੋਂ"],
          ["प्रति हेक्टेयर फसल उत्पादन", "ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਫ਼ਸਲ ਉਤਪਾਦਨ"],
          ["विद्यालय की मासिक उपस्थिति", "ਸਕੂਲ ਦੀ ਮਹੀਨਾਵਾਰ ਹਾਜ਼ਰੀ"],
          ["अस्पताल में औसत प्रतीक्षा समय", "ਹਸਪਤਾਲ ਵਿੱਚ ਔਸਤ ਉਡੀਕ ਸਮਾਂ"],
        ],
        facts.variant,
      );
      stems = [
        t(
          `शोधकर्ता ${subject} की दो उपलब्ध रिपोर्टों की तुलना करता है। उनकी संदर्भ अवधियाँ और इकाइयाँ अलग हैं। आँकड़ों की तुलना से पहले क्या जाँचना चाहिए?`,
          `ਖੋਜਕਰਤਾ ${subject} ਦੀਆਂ ਦੋ ਉਪਲਬਧ ਰਿਪੋਰਟਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਸੰਦਰਭ ਸਮੇਂ ਅਤੇ ਇਕਾਈਆਂ ਵੱਖਰੇ ਹਨ। ਅੰਕੜਿਆਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਜਾਂਚਣਾ ਚਾਹੀਦਾ ਹੈ?`,
        ),
        t(
          `दो प्रकाशित स्रोतों से ${subject} के आँकड़े मिलाने से पहले कौन-सी जाँच आवश्यक है?`,
          `ਦੋ ਪ੍ਰਕਾਸ਼ਿਤ ਸਰੋਤਾਂ ਤੋਂ ${subject} ਦੇ ਅੰਕੜੇ ਮਿਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜੀ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ?`,
        ),
      ];
      expected =
        "Whether definitions, units, population coverage and reference periods are comparable";
      explanation = t(
        "तुलना के लिए परिभाषाओं, मापन इकाइयों, समष्टि के दायरे और संदर्भ अवधियों का मेल जरूरी है। बड़ी संख्याएँ या एक जैसी पृष्ठ-सज्जा तुलनीयता सिद्ध नहीं करतीं।",
        "ਤੁਲਨਾ ਲਈ ਪਰਿਭਾਸ਼ਾਵਾਂ, ਮਾਪ ਇਕਾਈਆਂ, ਸਮਸ਼ਟੀ ਦੇ ਦਾਇਰੇ ਅਤੇ ਸੰਦਰਭ ਸਮਿਆਂ ਦਾ ਮੇਲ ਜ਼ਰੂਰੀ ਹੈ। ਵੱਡੀਆਂ ਸੰਖਿਆਵਾਂ ਜਾਂ ਇੱਕੋ ਜਿਹੀ ਸਫ਼ਾ ਸਜਾਵਟ ਤੁਲਨਾਯੋਗਤਾ ਸਿੱਧ ਨਹੀਂ ਕਰਦੀ।",
      );
      break;
    }
    case "QUALITATIVE_CLASSIFICATION": {
      const attribute = choice(
        [
          ["खाना पकाने के मुख्य ईंधन", "ਖਾਣਾ ਪਕਾਉਣ ਦੇ ਮੁੱਖ ਬਾਲਣ"],
          ["उगाई गई फसल के प्रकार", "ਉਗਾਈ ਫ਼ਸਲ ਦੀ ਕਿਸਮ"],
          ["वैवाहिक स्थिति", "ਵਿਆਹੁਤਾ ਸਥਿਤੀ"],
          ["काम पर जाने के परिवहन साधन", "ਕੰਮ 'ਤੇ ਜਾਣ ਦੇ ਆਵਾਜਾਈ ਸਾਧਨ"],
        ],
        facts.variant,
      );
      stems = [
        t(
          `सर्वेक्षण में परिवारों को ${attribute} के आधार पर समूहों में रखा गया है। यह किस प्रकार की विशेषता है?`,
          `ਸਰਵੇਖਣ ਵਿੱਚ ਪਰਿਵਾਰਾਂ ਨੂੰ ${attribute} ਦੇ ਆਧਾਰ 'ਤੇ ਸਮੂਹਾਂ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਇਹ ਕਿਸ ਕਿਸਮ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ?`,
        ),
        t(
          `प्रत्येक इकाई को ${attribute} की नामित श्रेणी में रखा गया है। वर्गीकरण का आधार क्या है?`,
          `ਹਰੇਕ ਇਕਾਈ ਨੂੰ ${attribute} ਦੀ ਨਾਮ ਵਾਲੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ। ਵਰਗੀਕਰਨ ਦਾ ਆਧਾਰ ਕੀ ਹੈ?`,
        ),
      ];
      expected = "a qualitative attribute";
      explanation = t(
        "समूह किसी प्रकार या श्रेणी का वर्णन करते हैं, संख्यात्मक माप का नहीं। इसलिए वर्गीकरण गुणात्मक विशेषता पर आधारित है।",
        "ਸਮੂਹ ਕਿਸੇ ਕਿਸਮ ਜਾਂ ਸ਼੍ਰੇਣੀ ਦਾ ਵੇਰਵਾ ਦਿੰਦੇ ਹਨ, ਸੰਖਿਆਤਮਕ ਮਾਪ ਦਾ ਨਹੀਂ। ਇਸ ਲਈ ਵਰਗੀਕਰਨ ਗੁਣਾਤਮਕ ਵਿਸ਼ੇਸ਼ਤਾ 'ਤੇ ਆਧਾਰਿਤ ਹੈ।",
      );
      break;
    }
    case "DISCRETE_VS_CONTINUOUS_VARIABLE": {
      for (const [en, hi, pa] of [...measured, ...counted])
        dynamic.set(en, t(hi, pa));
      stems = facts.askMeasured
        ? [
            t(
              "निम्न में से कौन-सा सतत मापन है?",
              "ਹੇਠਲਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਿਰੰਤਰ ਮਾਪ ਹੈ?",
            ),
            t(
              "निम्न में से कौन-सा सतत चर है?",
              "ਹੇਠਲਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਿਰੰਤਰ ਚਰ ਹੈ?",
            ),
          ]
        : [
            t(
              "निम्न में से कौन-सी विविक्त गणना है?",
              "ਹੇਠਲਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਵਿਵਿਕਤ ਗਿਣਤੀ ਹੈ?",
            ),
            t(
              "निम्न में से कौन-सा विविक्त चर है?",
              "ਹੇਠਲਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਵਿਕਤ ਚਰ ਹੈ?",
            ),
          ];
      expected = facts.askMeasured
        ? measured[facts.measured]![0]
        : counted[facts.counted]![0];
      explanation = facts.askMeasured
        ? t(
            `${option(expected)} एक मापन है और किसी परास में भिन्नात्मक मान भी ले सकता है, इसलिए यह सतत है। इकाइयों की गिनती अलग-अलग पूर्णांक मान लेती है।`,
            `${option(expected)} ਇੱਕ ਮਾਪ ਹੈ ਅਤੇ ਕਿਸੇ ਦਾਇਰੇ ਵਿੱਚ ਭਿੰਨਾਤਮਕ ਮੁੱਲ ਵੀ ਲੈ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਨਿਰੰਤਰ ਹੈ। ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ ਵੱਖਰੇ ਪੂਰਨ ਅੰਕ ਮੁੱਲ ਲੈਂਦੀ ਹੈ।`,
          )
        : t(
            `${option(expected)} अलग-अलग इकाइयों की गिनती है, इसलिए यह विविक्त है। भार या तापमान जैसे मापन किसी अंतराल में लगातार बदल सकते हैं।`,
            `${option(expected)} ਵੱਖਰੀਆਂ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਵਿਵਿਕਤ ਹੈ। ਭਾਰ ਜਾਂ ਤਾਪਮਾਨ ਵਰਗੇ ਮਾਪ ਕਿਸੇ ਅੰਤਰਾਲ ਵਿੱਚ ਲਗਾਤਾਰ ਬਦਲ ਸਕਦੇ ਹਨ।`,
          );
      break;
    }
    case "CHRONOLOGICAL_VS_GEOGRAPHICAL_CLASSIFICATION": {
      stems = [
        facts.chronological
          ? t(
              "सांख्यिकीय सार में एक जिले की वर्षा 2019 से 2024 तक प्रत्येक वर्ष के लिए अलग दी गई है। यह कौन-सा वर्गीकरण है?",
              "ਅੰਕੜਾ ਸਾਰ ਵਿੱਚ ਇੱਕ ਜ਼ਿਲ੍ਹੇ ਦੀ ਵਰਖਾ 2019 ਤੋਂ 2024 ਤੱਕ ਹਰੇਕ ਸਾਲ ਲਈ ਵੱਖਰੀ ਦਿੱਤੀ ਹੈ। ਇਹ ਕਿਹੜਾ ਵਰਗੀਕਰਨ ਹੈ?",
            )
          : t(
              "सांख्यिकीय सार में किसी क्षेत्र की वार्षिक वर्षा प्रत्येक जिले के लिए अलग दी गई है। यह कौन-सा वर्गीकरण है?",
              "ਅੰਕੜਾ ਸਾਰ ਵਿੱਚ ਕਿਸੇ ਖੇਤਰ ਦੀ ਸਾਲਾਨਾ ਵਰਖਾ ਹਰੇਕ ਜ਼ਿਲ੍ਹੇ ਲਈ ਵੱਖਰੀ ਦਿੱਤੀ ਹੈ। ਇਹ ਕਿਹੜਾ ਵਰਗੀਕਰਨ ਹੈ?",
            ),
      ];
      expected = facts.chronological
        ? "chronological classification"
        : "geographical classification";
      explanation = facts.chronological
        ? t(
            "आँकड़े वर्ष के अनुसार व्यवस्थित हैं, इसलिए यह कालानुक्रमिक वर्गीकरण है। स्थान के अनुसार व्यवस्था भौगोलिक वर्गीकरण होती।",
            "ਅੰਕੜੇ ਸਾਲ ਅਨੁਸਾਰ ਸਜਾਏ ਹਨ, ਇਸ ਲਈ ਇਹ ਸਮੇਂ ਅਨੁਸਾਰ ਵਰਗੀਕਰਨ ਹੈ। ਸਥਾਨ ਅਨੁਸਾਰ ਸਜਾਵਟ ਭੂਗੋਲਿਕ ਵਰਗੀਕਰਨ ਹੁੰਦੀ।",
          )
        : t(
            "आँकड़े जिले अर्थात स्थान के अनुसार व्यवस्थित हैं, इसलिए यह भौगोलिक वर्गीकरण है। वर्ष के अनुसार व्यवस्था कालानुक्रमिक होती।",
            "ਅੰਕੜੇ ਜ਼ਿਲ੍ਹੇ ਅਰਥਾਤ ਸਥਾਨ ਅਨੁਸਾਰ ਸਜਾਏ ਹਨ, ਇਸ ਲਈ ਇਹ ਭੂਗੋਲਿਕ ਵਰਗੀਕਰਨ ਹੈ। ਸਾਲ ਅਨੁਸਾਰ ਸਜਾਵਟ ਸਮੇਂ ਅਨੁਸਾਰ ਹੁੰਦੀ।",
          );
      break;
    }
    case "ONE_WAY_VS_TWO_WAY_CLASSIFICATION": {
      const attrs = choice(
        [
          [
            "अध्ययन वर्ष और निवास के प्रकार",
            "ਪੜ੍ਹਾਈ ਦੇ ਸਾਲ ਅਤੇ ਰਿਹਾਇਸ਼ ਦੀ ਕਿਸਮ",
          ],
          ["व्यवसाय और लिंग", "ਕਿੱਤੇ ਅਤੇ ਲਿੰਗ"],
          ["आयु वर्ग और रोजगार की स्थिति", "ਉਮਰ ਵਰਗ ਅਤੇ ਰੁਜ਼ਗਾਰ ਦੀ ਸਥਿਤੀ"],
        ],
        facts.variant,
      );
      stems = [
        t(
          `सारणी में व्यक्तियों को ${attrs} के आधार पर संयुक्त रूप से वर्गीकृत किया गया है। यह कौन-सा वर्गीकरण है?`,
          `ਸਾਰਣੀ ਵਿੱਚ ਵਿਅਕਤੀਆਂ ਨੂੰ ${attrs} ਦੇ ਆਧਾਰ 'ਤੇ ਸਾਂਝੇ ਤੌਰ 'ਤੇ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਵਰਗੀਕਰਨ ਹੈ?`,
        ),
        t(
          `सारणी की पंक्तियाँ और स्तंभ प्रत्येक इकाई को ${attrs}, दोनों के आधार पर वर्गीकृत करते हैं। यह कौन-सा वर्गीकरण है?`,
          `ਸਾਰਣੀ ਦੀਆਂ ਕਤਾਰਾਂ ਅਤੇ ਕਾਲਮ ਹਰੇਕ ਇਕਾਈ ਨੂੰ ${attrs}, ਦੋਵਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਵਰਗੀਕ੍ਰਿਤ ਕਰਦੇ ਹਨ। ਇਹ ਕਿਹੜਾ ਵਰਗੀਕਰਨ ਹੈ?`,
        ),
      ];
      expected = "two-way classification";
      explanation = t(
        `प्रत्येक इकाई के लिए दो विशेषताएँ, ${attrs}, साथ ली गई हैं। इसलिए यह द्विमार्गी वर्गीकरण है। एकमार्गी वर्गीकरण में केवल एक विशेषता ली जाती है।`,
        `ਹਰੇਕ ਇਕਾਈ ਲਈ ਦੋ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ, ${attrs}, ਇਕੱਠੀਆਂ ਲਈਆਂ ਹਨ। ਇਸ ਲਈ ਇਹ ਦੋ-ਪੱਖੀ ਵਰਗੀਕਰਨ ਹੈ। ਇੱਕ-ਪੱਖੀ ਵਰਗੀਕਰਨ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਵਿਸ਼ੇਸ਼ਤਾ ਲਈ ਜਾਂਦੀ ਹੈ।`,
      );
      break;
    }
    case "TABLE_COMPONENTS": {
      stems = [
        facts.variant === 0
          ? t(
              "सारणी के बाएँ स्तंभ में प्रत्येक पंक्ति के समूह का नाम दिया है। इस भाग को क्या कहते हैं?",
              "ਸਾਰਣੀ ਦੇ ਖੱਬੇ ਕਾਲਮ ਵਿੱਚ ਹਰੇਕ ਕਤਾਰ ਦੇ ਸਮੂਹ ਦਾ ਨਾਂ ਦਿੱਤਾ ਹੈ। ਇਸ ਭਾਗ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
            )
          : t(
              "सारणी के आँकड़ा स्तंभों के ऊपर छपे शीर्षक प्रत्येक स्तंभ का अर्थ बताते हैं। इन्हें क्या कहते हैं?",
              "ਸਾਰਣੀ ਦੇ ਅੰਕੜਾ ਕਾਲਮਾਂ ਦੇ ਉੱਪਰ ਛਪੇ ਸਿਰਲੇਖ ਹਰੇਕ ਕਾਲਮ ਦਾ ਅਰਥ ਦੱਸਦੇ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?",
            ),
      ];
      expected = facts.variant === 0 ? "stub" : "captions (boxhead)";
      explanation = t(
        "स्टब में पंक्ति शीर्षक होते हैं। कैप्शन या बॉक्सहेड में स्तंभ शीर्षक होते हैं। मुख्य भाग में आँकड़ों वाली कोशिकाएँ और स्रोत टिप्पणी में आँकड़ों का स्रोत दिया जाता है।",
        "ਸਟੱਬ ਵਿੱਚ ਕਤਾਰ ਸਿਰਲੇਖ ਹੁੰਦੇ ਹਨ। ਕੈਪਸ਼ਨ ਜਾਂ ਬਾਕਸਹੈੱਡ ਵਿੱਚ ਕਾਲਮ ਸਿਰਲੇਖ ਹੁੰਦੇ ਹਨ। ਮੁੱਖ ਭਾਗ ਵਿੱਚ ਅੰਕੜਿਆਂ ਵਾਲੇ ਖਾਨੇ ਅਤੇ ਸਰੋਤ ਟਿੱਪਣੀ ਵਿੱਚ ਅੰਕੜਿਆਂ ਦਾ ਸਰੋਤ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।",
      );
      break;
    }
    case "FREQUENCY_TABLE_CHECK": {
      const total = facts.frequencies.reduce((a, b) => a + b, 0);
      expected = String(total);
      stems = [
        t(
          `सारणी की वर्ग आवृत्तियाँ ${facts.frequencies.join(", ")} हैं। कच्ची सूची में ${facts.stated} प्रेक्षण हैं। वर्ग आवृत्तियों का योग Σf कितना है?`,
          `ਸਾਰਣੀ ਦੀਆਂ ਵਰਗ ਬਾਰੰਬਾਰਤਾਵਾਂ ${facts.frequencies.join(", ")} ਹਨ। ਕੱਚੀ ਸੂਚੀ ਵਿੱਚ ${facts.stated} ਪ੍ਰੇਖਣ ਹਨ। ਵਰਗ ਬਾਰੰਬਾਰਤਾਵਾਂ ਦਾ ਜੋੜ Σf ਕਿੰਨਾ ਹੈ?`,
        ),
        t(
          `सारणी की वर्ग आवृत्तियाँ ${facts.frequencies.join(", ")} हैं। उनका योग Σf कितना है?`,
          `ਸਾਰਣੀ ਦੀਆਂ ਵਰਗ ਬਾਰੰਬਾਰਤਾਵਾਂ ${facts.frequencies.join(", ")} ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਜੋੜ Σf ਕਿੰਨਾ ਹੈ?`,
        ),
      ];
      explanation = t(
        `Σf = ${facts.frequencies.join(" + ")} = ${total}। यह योग दिए गए ${facts.stated} प्रेक्षणों से ${total === facts.stated ? "मेल खाता है" : "मेल नहीं खाता"}। किसी पूर्ण आवृत्ति वितरण में कुल आवृत्ति प्रेक्षणों की संख्या के बराबर होनी चाहिए।`,
        `Σf = ${facts.frequencies.join(" + ")} = ${total}। ਇਹ ਜੋੜ ਦਿੱਤੇ ${facts.stated} ਪ੍ਰੇਖਣਾਂ ਨਾਲ ${total === facts.stated ? "ਮੇਲ ਖਾਂਦਾ ਹੈ" : "ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ"}। ਪੂਰੇ ਬਾਰੰਬਾਰਤਾ ਵੰਡ ਵਿੱਚ ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ ਪ੍ਰੇਖਣਾਂ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।`,
      );
      break;
    }
    case "MUTUALLY_EXCLUSIVE_CLASS_INTERVALS": {
      const b = facts.boundary,
        previous = `${b - 10}–${b}`,
        next = `${b}–${b + 10}`,
        last = `${b + 10}–${b + 20}`;
      for (const interval of [previous, next])
        dynamic.set(
          `${interval} only`,
          t(`केवल ${interval} में`, `ਕੇਵਲ ${interval} ਵਿੱਚ`),
        );
      expected = `${next} only`;
      stems = [
        t(
          `वर्ग ${previous}, ${next} और ${last} हैं। प्रत्येक वर्ग में निचली सीमा शामिल और ऊपरी सीमा शामिल नहीं है; अंतिम वर्ग की ऊपरी सीमा भी शामिल है। ठीक ${b} का प्रेक्षण किस वर्ग में रखा जाएगा?`,
          `ਵਰਗ ${previous}, ${next} ਅਤੇ ${last} ਹਨ। ਹਰੇਕ ਵਰਗ ਵਿੱਚ ਹੇਠਲੀ ਹੱਦ ਸ਼ਾਮਲ ਅਤੇ ਉੱਪਰਲੀ ਹੱਦ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ; ਅੰਤਿਮ ਵਰਗ ਦੀ ਉੱਪਰਲੀ ਹੱਦ ਵੀ ਸ਼ਾਮਲ ਹੈ। ਠੀਕ ${b} ਦਾ ਪ੍ਰੇਖਣ ਕਿਸ ਵਰਗ ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇਗਾ?`,
        ),
        t(
          `अंतराल ${previous}, ${next} और ${last} में निचली सीमा शामिल तथा ऊपरी सीमा शामिल नहीं है। ${b} का प्रेक्षण किस अंतराल में आएगा?`,
          `ਅੰਤਰਾਲ ${previous}, ${next} ਅਤੇ ${last} ਵਿੱਚ ਹੇਠਲੀ ਹੱਦ ਸ਼ਾਮਲ ਅਤੇ ਉੱਪਰਲੀ ਹੱਦ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ। ${b} ਦਾ ਪ੍ਰੇਖਣ ਕਿਸ ਅੰਤਰਾਲ ਵਿੱਚ ਆਵੇਗਾ?`,
        ),
      ];
      explanation = t(
        `पहले वर्ग ${previous} की ऊपरी सीमा ${b} शामिल नहीं है। अगले वर्ग ${next} की निचली सीमा ${b} शामिल है। इसलिए प्रेक्षण केवल ${next} में आता है।`,
        `ਪਹਿਲੇ ਵਰਗ ${previous} ਦੀ ਉੱਪਰਲੀ ਹੱਦ ${b} ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ। ਅਗਲੇ ਵਰਗ ${next} ਦੀ ਹੇਠਲੀ ਹੱਦ ${b} ਸ਼ਾਮਲ ਹੈ। ਇਸ ਲਈ ਪ੍ਰੇਖਣ ਕੇਵਲ ${next} ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`,
      );
      break;
    }
    case "BUILD_A_BASIC_FREQUENCY_TABLE": {
      const fs = [
        facts.values.filter((x) => x >= 0 && x < 4).length,
        facts.values.filter((x) => x >= 4 && x < 8).length,
        facts.values.filter((x) => x >= 8 && x < 12).length,
      ];
      expected = fs.join(", ");
      const data = facts.values.join(", ");
      stems = [
        t(
          `प्रेक्षण ${data} हैं। आवृत्ति सारणी के अंतराल 0–4, 4–8 और 8–12 हैं; निचली सीमा शामिल और ऊपरी सीमा शामिल नहीं है। इसी क्रम में वर्ग आवृत्तियाँ क्या हैं?`,
          `ਪ੍ਰੇਖਣ ${data} ਹਨ। ਬਾਰੰਬਾਰਤਾ ਸਾਰਣੀ ਦੇ ਅੰਤਰਾਲ 0–4, 4–8 ਅਤੇ 8–12 ਹਨ; ਹੇਠਲੀ ਹੱਦ ਸ਼ਾਮਲ ਅਤੇ ਉੱਪਰਲੀ ਹੱਦ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ। ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਵਰਗ ਬਾਰੰਬਾਰਤਾਵਾਂ ਕੀ ਹਨ?`,
        ),
        t(
          `प्रेक्षण ${data} को 0–4, 4–8 और 8–12 में बाँटा जाता है। प्रत्येक अंतराल की निचली सीमा शामिल और ऊपरी सीमा शामिल नहीं है। वर्ग आवृत्तियाँ क्रमशः क्या होंगी?`,
          `ਪ੍ਰੇਖਣ ${data} ਨੂੰ 0–4, 4–8 ਅਤੇ 8–12 ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ। ਹਰੇਕ ਅੰਤਰਾਲ ਦੀ ਹੇਠਲੀ ਹੱਦ ਸ਼ਾਮਲ ਅਤੇ ਉੱਪਰਲੀ ਹੱਦ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ। ਵਰਗ ਬਾਰੰਬਾਰਤਾਵਾਂ ਕ੍ਰਮਵਾਰ ਕੀ ਹੋਣਗੀਆਂ?`,
        ),
      ];
      const header = t(
        "अंतराल | उसमें आने वाले मान | आवृत्ति",
        "ਅੰਤਰਾਲ | ਉਸ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਮੁੱਲ | ਬਾਰੰਬਾਰਤਾ",
      );
      explanation =
        `| ${header} |\n|---|---|---:|\n${[
          [0, 4],
          [4, 8],
          [8, 12],
        ]
          .map(
            ([l, u], i) =>
              `| [${l}, ${u}) | ${facts.values.filter((x) => x >= l! && x < u!).join(", ")} | ${fs[i]} |`,
          )
          .join("\n")}\n\n` +
        t(
          `कुल आवृत्ति = ${fs.join(" + ")} = ${facts.values.length}, जो प्रेक्षणों की संख्या है।`,
          `ਕੁੱਲ ਬਾਰੰਬਾਰਤਾ = ${fs.join(" + ")} = ${facts.values.length}, ਜੋ ਪ੍ਰੇਖਣਾਂ ਦੀ ਗਿਣਤੀ ਹੈ।`,
        );
      break;
    }
    default: {
      const unreachable: never = facts;
      throw new Error(`Uncovered native facts ${unreachable}`);
    }
  }
  if (source.answer !== expected)
    throw new Error("STAT-004 native semantic answer mismatch.");
  const options = source.options.map(option);
  if (new Set(options).size !== 4)
    throw new Error("STAT-004 native options collapsed.");
  const stem = pick(
    seededRandom(`${source.seed}:${source.contractId}:${source.examProfile}`),
    stems,
  );
  return {
    stem,
    options,
    correctIndex: source.correctIndex,
    answer: options[source.correctIndex]!,
    explanation,
    facts,
  };
}

export function localizeStat004Batch<
  T extends {
    generationContext: Record<string, unknown>;
    questionPackages: Stat004Question[];
    questions: any[];
  },
>(
  batch: T,
  language: "en" | NativeLanguage,
): Omit<T, "generationContext" | "questions"> & {
  generationContext: Record<string, unknown>;
  questions: any[];
} {
  if (language === "en") return batch;
  const fields = {
    language,
    sourceLanguage: "en",
    runtimeMode: "STAT004_NATIVE_REVIEW_V1",
    reviewStatus: "NATIVE_REVIEW_CANDIDATE",
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
    releaseId: "STAT-004-NATIVE-REVIEW-V1",
    sourceReleaseId: batch.generationContext.releaseId,
    releaseFreezeStatus: "NATIVE_HUMAN_REVIEW_PENDING",
    reviewOnly: true,
    manualApprovalRequired: true,
    questionBankWritable: false,
    questionBankEligible: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  };
  return {
    ...batch,
    generationContext: { ...batch.generationContext, ...fields },
    questions: batch.questions.map((q, index) => {
      const source = batch.questionPackages[index]!;
      if (
        q.sourceQuestionId !== source.questionId ||
        q.permanentQlId !== source.qlId ||
        q.answer !== source.answer ||
        q.correctIndex !== source.correctIndex
      )
        throw new Error("STAT-004 native source identity mismatch.");
      const native = renderStat004Native(source, language);
      return {
        ...q,
        ...fields,
        text: native.stem,
        stem: native.stem,
        options: native.options,
        correct: native.correctIndex,
        correctIndex: native.correctIndex,
        answer: native.answer,
        sourceAnswer: source.answer,
        sourceOptions: [...source.options],
        questionId: `${q.questionId}:${language}`,
        explanation: native.explanation,
        canonicalAnswer: {
          ...q.canonicalAnswer,
          value: native.answer,
          display: native.answer,
          rendered: native.answer,
        },
        reviewFacts: native.facts,
        metadata: { ...q.metadata, ...fields },
        traceability: {
          sourceQuestionId: source.questionId,
          permanentQlId: source.qlId,
          ...fields,
        },
      };
    }),
  };
}
