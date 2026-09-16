import type { CaeDifficultyEvidence, CaeLocale, CaeRenderedOption, GeneratedCaeQuestion, LocalizedText } from "./types.ts";

type ExpandedComboQl = "CAE-QL-003" | "CAE-QL-004";
type ExpandedComboScenario = Readonly<{
  id: string;
  qlId: ExpandedComboQl;
  anchor: LocalizedText;
  candidates: readonly [LocalizedText, LocalizedText, LocalizedText];
  validIndices: readonly number[];
  rationale: LocalizedText;
}>;

const l = (en: string, hi: string, pa: string): LocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const R = ["I", "II", "III"] as const;

export const CAE_EXPANDED_COMBINATION_FAMILY_IDS = Object.freeze([
  "CAE-FAM-POSSIBLE-CAUSE-COMBINATION-EVIDENCE",
  "CAE-FAM-POSSIBLE-EFFECT-COMBINATION-EVIDENCE",
] as const);

export const CAE_EXPANDED_COMBINATION_SCENARIOS: readonly ExpandedComboScenario[] = Object.freeze([
  {
    id: "exam-entry-delay-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Candidates at several rooms entered the examination hall later than scheduled.", "कई कमरों के उम्मीदवार परीक्षा हॉल में तय समय से देर से पहुँचे।", "ਕਈ ਕਮਰਿਆਂ ਦੇ ਉਮੀਦਵਾਰ ਪਰੀਖਿਆ ਹਾਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ।"),
    candidates: [
      l("The common verification server slowed across the centre.", "केंद्र का साझा सत्यापन सर्वर धीमा हो गया।", "ਕੇਂਦਰ ਦਾ ਸਾਂਝਾ ਤਸਦੀਕ ਸਰਵਰ ਹੌਲਾ ਹੋ ਗਿਆ।"),
      l("One room had fewer chairs than expected.", "एक कमरे में अपेक्षा से कम कुर्सियाँ थीं।", "ਇੱਕ ਕਮਰੇ ਵਿੱਚ ਉਮੀਦ ਨਾਲੋਂ ਘੱਟ ਕੁਰਸੀਆਂ ਸਨ।"),
      l("A security queue formed at the single entrance used by all those rooms.", "उन सभी कमरों के साझा प्रवेश द्वार पर सुरक्षा कतार बन गई।", "ਉਨ੍ਹਾਂ ਸਾਰੇ ਕਮਰਿਆਂ ਦੇ ਸਾਂਝੇ ਦਾਖਲਾ ਦਰਵਾਜ਼ੇ ਉੱਤੇ ਸੁਰੱਖਿਆ ਕਤਾਰ ਬਣ ਗਈ।"),
    ],
    validIndices: [0, 2],
    rationale: l("A centre-wide verification slowdown and a queue at the shared entrance can both delay many candidates. A chair shortage in one room cannot explain the wider delay.", "केंद्र-भर में सत्यापन धीमा होना और साझा प्रवेश द्वार पर कतार—दोनों कई उम्मीदवारों को देर करा सकते हैं। एक कमरे में कुर्सियों की कमी पूरे असर को नहीं समझाती।", "ਕੇਂਦਰ-ਪੱਧਰੀ ਤਸਦੀਕ ਹੌਲੀ ਹੋਣਾ ਅਤੇ ਸਾਂਝੇ ਦਾਖਲਾ ਦਰਵਾਜ਼ੇ ਉੱਤੇ ਕਤਾਰ—ਦੋਵੇਂ ਕਈ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਦੇਰ ਕਰ ਸਕਦੇ ਹਨ। ਇੱਕ ਕਮਰੇ ਵਿੱਚ ਕੁਰਸੀਆਂ ਦੀ ਘਾਟ ਵੱਡੇ ਅਸਰ ਨੂੰ ਨਹੀਂ ਸਮਝਾਉਂਦੀ।"),
  },
  {
    id: "bank-transfer-delay-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Outward bank transfers were delayed across many branches during the same hour.", "एक ही घंटे में कई शाखाओं के बाहर भेजे जाने वाले बैंक ट्रांसफर देर से हुए।", "ਇੱਕੋ ਘੰਟੇ ਵਿੱਚ ਕਈ ਸ਼ਾਖਾਵਾਂ ਦੇ ਬਾਹਰ ਭੇਜੇ ਜਾਣ ਵਾਲੇ ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ ਦੇਰ ਨਾਲ ਹੋਏ।"),
    candidates: [
      l("The central clearing gateway became unstable.", "केंद्रीय क्लियरिंग गेटवे अस्थिर हो गया।", "ਕੇਂਦਰੀ ਕਲੀਅਰਿੰਗ ਗੇਟਵੇ ਅਸਥਿਰ ਹੋ ਗਿਆ।"),
      l("One branch replaced two desktop computers.", "एक शाखा ने दो डेस्कटॉप कंप्यूटर बदले।", "ਇੱਕ ਸ਼ਾਖਾ ਨੇ ਦੋ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਬਦਲੇ।"),
      l("Transaction demand rose sharply near the settlement cut-off time.", "सेटलमेंट की अंतिम समय-सीमा के पास लेनदेन की मांग तेजी से बढ़ी।", "ਸੈਟਲਮੈਂਟ ਦੀ ਆਖਰੀ ਸਮਾਂ-ਸੀਮਾ ਨੇੜੇ ਲੈਣ-ਦੇਣ ਦੀ ਮੰਗ ਤੇਜ਼ੀ ਨਾਲ ਵਧੀ।"),
    ],
    validIndices: [0, 2],
    rationale: l("A central gateway problem and a sharp rise in transfer demand can both delay many branches. Replacing computers in one branch cannot.", "केंद्रीय गेटवे की समस्या और ट्रांसफर मांग में तेज वृद्धि—दोनों कई शाखाओं में देरी कर सकते हैं। एक शाखा में कंप्यूटर बदलना नहीं।", "ਕੇਂਦਰੀ ਗੇਟਵੇ ਦੀ ਸਮੱਸਿਆ ਅਤੇ ਟ੍ਰਾਂਸਫਰ ਮੰਗ ਵਿੱਚ ਤੇਜ਼ ਵਾਧਾ—ਦੋਵੇਂ ਕਈ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਦੇਰੀ ਕਰ ਸਕਦੇ ਹਨ। ਇੱਕ ਸ਼ਾਖਾ ਵਿੱਚ ਕੰਪਿਊਟਰ ਬਦਲਣਾ ਨਹੀਂ।"),
  },
  {
    id: "market-price-rise-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Retail prices of a perishable vegetable rose sharply across the town within two days.", "दो दिनों के भीतर कस्बे भर में एक नाशवान सब्जी की खुदरा कीमत तेजी से बढ़ गई।", "ਦੋ ਦਿਨਾਂ ਅੰਦਰ ਕਸਬੇ ਭਰ ਵਿੱਚ ਇੱਕ ਨਾਸ਼ਵਾਨ ਸਬਜ਼ੀ ਦੀ ਖੁਦਰਾ ਕੀਮਤ ਤੇਜ਼ੀ ਨਾਲ ਵੱਧ ਗਈ।"),
    candidates: [
      l("Heavy rain blocked the main supply route from producing areas.", "तेज बारिश ने उत्पादक क्षेत्रों से आने वाला मुख्य आपूर्ति मार्ग बंद कर दिया।", "ਤੇਜ਼ ਮੀਂਹ ਨੇ ਉਤਪਾਦਕ ਖੇਤਰਾਂ ਤੋਂ ਆਉਣ ਵਾਲਾ ਮੁੱਖ ਸਪਲਾਈ ਰਸਤਾ ਬੰਦ ਕਰ ਦਿੱਤਾ।"),
      l("A festival increased demand for that vegetable across the town.", "एक त्योहार से कस्बे भर में उस सब्जी की मांग बढ़ गई।", "ਇੱਕ ਤਿਉਹਾਰ ਕਾਰਨ ਕਸਬੇ ਭਰ ਵਿੱਚ ਉਸ ਸਬਜ਼ੀ ਦੀ ਮੰਗ ਵੱਧ ਗਈ।"),
      l("One retailer changed the layout of its vegetable section.", "एक दुकानदार ने अपने सब्जी सेक्शन की व्यवस्था बदल दी।", "ਇੱਕ ਦੁਕਾਨਦਾਰ ਨੇ ਆਪਣੇ ਸਬਜ਼ੀ ਭਾਗ ਦੀ ਵਿਵਸਥਾ ਬਦਲ ਦਿੱਤੀ।"),
    ],
    validIndices: [0, 1],
    rationale: l("Lower supply and higher town-wide demand can both raise prices. A layout change in one shop cannot explain a town-wide rise.", "कम आपूर्ति और पूरे कस्बे में बढ़ी मांग—दोनों कीमत बढ़ा सकते हैं। एक दुकान की व्यवस्था बदलना कस्बे-भर की वृद्धि नहीं समझाता।", "ਘੱਟ ਸਪਲਾਈ ਅਤੇ ਪੂਰੇ ਕਸਬੇ ਵਿੱਚ ਵਧੀ ਮੰਗ—ਦੋਵੇਂ ਕੀਮਤ ਵਧਾ ਸਕਦੇ ਹਨ। ਇੱਕ ਦੁਕਾਨ ਦੀ ਵਿਵਸਥਾ ਬਦਲਣਾ ਕਸਬੇ-ਪੱਧਰੀ ਵਾਧੇ ਨੂੰ ਨਹੀਂ ਸਮਝਾਉਂਦਾ।"),
  },
  {
    id: "water-pressure-drop-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Water pressure dropped across several streets supplied by the same distribution zone.", "एक ही वितरण क्षेत्र से जुड़ी कई सड़कों पर पानी का दबाव घट गया।", "ਇੱਕੋ ਵੰਡ ਖੇਤਰ ਨਾਲ ਜੁੜੀਆਂ ਕਈ ਗਲੀਆਂ ਵਿੱਚ ਪਾਣੀ ਦਾ ਦਬਾਅ ਘਟ ਗਿਆ।"),
    candidates: [
      l("The main distribution pump lost output.", "मुख्य वितरण पंप का आउटपुट घट गया।", "ਮੁੱਖ ਵੰਡ ਪੰਪ ਦਾ ਆਉਟਪੁੱਟ ਘਟ ਗਿਆ।"),
      l("A major pipe leak developed within the same zone.", "उसी क्षेत्र में मुख्य पाइप में बड़ी लीकेज हो गई।", "ਉਸੇ ਖੇਤਰ ਵਿੱਚ ਮੁੱਖ ਪਾਈਪ ਵਿੱਚ ਵੱਡੀ ਲੀਕ ਹੋ ਗਈ।"),
      l("One household installed a new storage tank.", "एक घर ने नया पानी का टैंक लगाया।", "ਇੱਕ ਘਰ ਨੇ ਨਵਾਂ ਪਾਣੀ ਟੈਂਕ ਲਗਾਇਆ।"),
    ],
    validIndices: [0, 1],
    rationale: l("A pump-output loss or a major zone leak can reduce pressure across several streets. One household's tank is too small in scope.", "पंप का आउटपुट घटने या क्षेत्र की बड़ी लीकेज से कई सड़कों पर दबाव कम हो सकता है। एक घर का टैंक बहुत सीमित असर रखता है।", "ਪੰਪ ਦਾ ਆਉਟਪੁੱਟ ਘਟਣ ਜਾਂ ਖੇਤਰ ਦੀ ਵੱਡੀ ਲੀਕ ਨਾਲ ਕਈ ਗਲੀਆਂ ਵਿੱਚ ਦਬਾਅ ਘਟ ਸਕਦਾ ਹੈ। ਇੱਕ ਘਰ ਦਾ ਟੈਂਕ ਬਹੁਤ ਸੀਮਿਤ ਅਸਰ ਰੱਖਦਾ ਹੈ।"),
  },
  {
    id: "warehouse-dispatch-delay-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Dispatch vehicles left a regional warehouse later than scheduled.", "क्षेत्रीय गोदाम से डिस्पैच वाहन तय समय से देर से निकले।", "ਖੇਤਰੀ ਗੋਦਾਮ ਤੋਂ ਡਿਸਪੈਚ ਵਾਹਨ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੋਂ ਦੇਰ ਨਾਲ ਨਿਕਲੇ।"),
    candidates: [
      l("The loading-control system failed across several bays.", "कई बे पर लोडिंग-कंट्रोल सिस्टम बंद हो गया।", "ਕਈ ਬੇ ਉੱਤੇ ਲੋਡਿੰਗ-ਕੰਟਰੋਲ ਸਿਸਟਮ ਬੰਦ ਹੋ ਗਿਆ।"),
      l("A shortage of loaders slowed work across the shift.", "लोडिंग कर्मचारियों की कमी से पूरी पाली में काम धीमा हुआ।", "ਲੋਡਿੰਗ ਕਰਮਚਾਰੀਆਂ ਦੀ ਘਾਟ ਨਾਲ ਪੂਰੀ ਸ਼ਿਫਟ ਵਿੱਚ ਕੰਮ ਹੌਲਾ ਹੋਇਆ।"),
      l("One delivery driver requested a route change after departure.", "एक डिलीवरी चालक ने रवाना होने के बाद मार्ग बदलने का अनुरोध किया।", "ਇੱਕ ਡਿਲੀਵਰੀ ਡਰਾਈਵਰ ਨੇ ਰਵਾਨਗੀ ਤੋਂ ਬਾਅਦ ਰਸਤਾ ਬਦਲਣ ਦੀ ਬੇਨਤੀ ਕੀਤੀ।"),
    ],
    validIndices: [0, 1],
    rationale: l("A bay-wide system failure or a shift-wide staff shortage can delay dispatch. A route change requested after departure cannot cause vehicles to leave late.", "कई बे की प्रणाली खराबी या पूरी पाली में कर्मचारियों की कमी डिस्पैच देर करा सकती है। रवाना होने के बाद मांगा गया मार्ग बदलाव देर से निकलने का कारण नहीं हो सकता।", "ਕਈ ਬੇ ਦੀ ਪ੍ਰਣਾਲੀ ਖਰਾਬੀ ਜਾਂ ਪੂਰੀ ਸ਼ਿਫਟ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਦੀ ਘਾਟ ਡਿਸਪੈਚ ਦੇਰ ਕਰ ਸਕਦੀ ਹੈ। ਰਵਾਨਗੀ ਤੋਂ ਬਾਅਦ ਮੰਗਿਆ ਰਸਤਾ ਬਦਲਾਅ ਦੇਰ ਨਾਲ ਨਿਕਲਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਹੋ ਸਕਦਾ।"),
  },
  {
    id: "train-section-delay-three-causes",
    qlId: "CAE-QL-003",
    anchor: l("Several trains lost time while crossing the same rail section.", "एक ही रेल खंड से गुजरते समय कई ट्रेनों को देरी हुई।", "ਇੱਕੋ ਰੇਲ ਖੰਡ ਤੋਂ ਲੰਘਦਿਆਂ ਕਈ ਰੇਲਾਂ ਨੂੰ ਦੇਰੀ ਹੋਈ।"),
    candidates: [
      l("Waterlogging required a temporary speed restriction on that section.", "जलभराव के कारण उस खंड पर अस्थायी गति प्रतिबंध लगाना पड़ा।", "ਪਾਣੀ ਭਰਨ ਕਾਰਨ ਉਸ ਖੰਡ ਉੱਤੇ ਅਸਥਾਈ ਗਤੀ ਪਾਬੰਦੀ ਲਗਾਉਣੀ ਪਈ।"),
      l("A signalling fault repeatedly forced trains to stop before entering the section.", "सिग्नल की खराबी से ट्रेनों को उस खंड में प्रवेश से पहले बार-बार रुकना पड़ा।", "ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ ਕਾਰਨ ਰੇਲਾਂ ਨੂੰ ਉਸ ਖੰਡ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਵਾਰ-ਵਾਰ ਰੁਕਣਾ ਪਿਆ।"),
      l("A refreshment stall at a station changed its menu.", "एक स्टेशन के जलपान स्टॉल ने अपना मेन्यू बदला।", "ਇੱਕ ਸਟੇਸ਼ਨ ਦੇ ਰਿਫ੍ਰੈਸ਼ਮੈਂਟ ਸਟਾਲ ਨੇ ਆਪਣਾ ਮੀਨੂ ਬਦਲਿਆ।"),
    ],
    validIndices: [0, 1],
    rationale: l("A speed restriction and a signalling fault can both delay trains through the same section. A station-stall menu change cannot.", "गति प्रतिबंध और सिग्नल की खराबी—दोनों उसी खंड से गुजरने वाली ट्रेनों को देर करा सकते हैं। स्टॉल का मेन्यू बदलना नहीं।", "ਗਤੀ ਪਾਬੰਦੀ ਅਤੇ ਸਿਗਨਲ ਦੀ ਖਰਾਬੀ—ਦੋਵੇਂ ਉਸੇ ਖੰਡ ਤੋਂ ਲੰਘਣ ਵਾਲੀਆਂ ਰੇਲਾਂ ਨੂੰ ਦੇਰ ਕਰ ਸਕਦੇ ਹਨ। ਸਟਾਲ ਦਾ ਮੀਨੂ ਬਦਲਣਾ ਨਹੀਂ।"),
  },
  {
    id: "heatwave-three-effects-v2",
    qlId: "CAE-QL-004",
    anchor: l("A severe heatwave continued for several days.", "कई दिनों तक गंभीर गर्मी की लहर जारी रही।", "ਕਈ ਦਿਨਾਂ ਤੱਕ ਤੀਬਰ ਗਰਮੀ ਦੀ ਲਹਿਰ ਜਾਰੀ ਰਹੀ।"),
    candidates: [
      l("Electricity demand for cooling increased.", "ठंडक के लिए बिजली की मांग बढ़ी।", "ਠੰਢਕ ਲਈ ਬਿਜਲੀ ਦੀ ਮੰਗ ਵਧੀ।"),
      l("Water consumption increased.", "पानी की खपत बढ़ी।", "ਪਾਣੀ ਦੀ ਖਪਤ ਵਧੀ।"),
      l("Road surfaces in some areas softened or buckled.", "कुछ क्षेत्रों में सड़क की सतह नरम पड़ी या उभर गई।", "ਕੁਝ ਇਲਾਕਿਆਂ ਵਿੱਚ ਸੜਕਾਂ ਦੀ ਸਤਹ ਨਰਮ ਹੋਈ ਜਾਂ ਉਭਰ ਗਈ।"),
    ],
    validIndices: [0, 1, 2],
    rationale: l("A prolonged severe heatwave can increase cooling demand and water use, and can also damage heat-sensitive road surfaces.", "लंबी गंभीर गर्मी ठंडक की बिजली मांग और पानी की खपत बढ़ा सकती है तथा गर्मी-संवेदनशील सड़क सतह को नुकसान पहुँचा सकती है।", "ਲੰਬੀ ਤੀਬਰ ਗਰਮੀ ਠੰਢਕ ਲਈ ਬਿਜਲੀ ਦੀ ਮੰਗ ਅਤੇ ਪਾਣੀ ਦੀ ਖਪਤ ਵਧਾ ਸਕਦੀ ਹੈ ਅਤੇ ਗਰਮੀ-ਸੰਵੇਦਨਸ਼ੀਲ ਸੜਕ ਸਤਹ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦੀ ਹੈ।"),
  },
  {
    id: "heavy-rain-three-effects-v2",
    qlId: "CAE-QL-004",
    anchor: l("Very heavy rain continued over the district for two days.", "जिले में दो दिनों तक बहुत तेज बारिश जारी रही।", "ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਦੋ ਦਿਨਾਂ ਤੱਕ ਬਹੁਤ ਤੇਜ਼ ਮੀਂਹ ਜਾਰੀ ਰਿਹਾ।"),
    candidates: [
      l("Low-lying roads became waterlogged.", "निचली सड़कें जलमग्न हो गईं।", "ਨੀਵੀਆਂ ਸੜਕਾਂ ਪਾਣੀ ਨਾਲ ਭਰ ਗਈਆਂ।"),
      l("Some local transport services were delayed or diverted.", "कुछ स्थानीय परिवहन सेवाएँ देर से चलीं या मोड़ी गईं।", "ਕੁਝ ਸਥਾਨਕ ਆਵਾਜਾਈ ਸੇਵਾਵਾਂ ਦੇਰ ਨਾਲ ਚੱਲੀਆਂ ਜਾਂ ਮੋੜੀਆਂ ਗਈਆਂ।"),
      l("The district administration changed property-tax rates immediately.", "जिला प्रशासन ने तुरंत संपत्ति-कर दरें बदल दीं।", "ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ ਨੇ ਤੁਰੰਤ ਜਾਇਦਾਦ-ਕਰ ਦਰਾਂ ਬਦਲ ਦਿੱਤੀਆਂ।"),
    ],
    validIndices: [0, 1],
    rationale: l("Heavy rain can waterlog roads and disrupt transport. It does not by itself cause an immediate property-tax change.", "तेज बारिश सड़कों पर जलभराव और परिवहन बाधा पैदा कर सकती है। इससे अपने-आप तुरंत संपत्ति-कर दर नहीं बदलती।", "ਤੇਜ਼ ਮੀਂਹ ਸੜਕਾਂ ਉੱਤੇ ਪਾਣੀ ਭਰਾਅ ਅਤੇ ਆਵਾਜਾਈ ਰੁਕਾਵਟ ਪੈਦਾ ਕਰ ਸਕਦਾ ਹੈ। ਇਸ ਨਾਲ ਆਪਣੇ ਆਪ ਤੁਰੰਤ ਜਾਇਦਾਦ-ਕਰ ਦਰ ਨਹੀਂ ਬਦਲਦੀ।"),
  },
  {
    id: "server-overload-three-effects",
    qlId: "CAE-QL-004",
    anchor: l("A public-service portal received far more simultaneous requests than usual.", "एक सार्वजनिक सेवा पोर्टल को सामान्य से बहुत अधिक एक साथ अनुरोध मिले।", "ਇੱਕ ਜਨਤਕ ਸੇਵਾ ਪੋਰਟਲ ਨੂੰ ਆਮ ਨਾਲੋਂ ਬਹੁਤ ਵੱਧ ਇਕੱਠੀਆਂ ਬੇਨਤੀਆਂ ਮਿਲੀਆਂ।"),
    candidates: [
      l("Response times increased.", "प्रतिक्रिया समय बढ़ गया।", "ਜਵਾਬ ਸਮਾਂ ਵੱਧ ਗਿਆ।"),
      l("Some requests timed out before completion.", "कुछ अनुरोध पूरा होने से पहले टाइम आउट हो गए।", "ਕੁਝ ਬੇਨਤੀਆਂ ਪੂਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਟਾਈਮ ਆਉਟ ਹੋ ਗਈਆਂ।"),
      l("The office's physical document store received more files.", "कार्यालय के भौतिक दस्तावेज भंडार में अधिक फाइलें आ गईं।", "ਦਫ਼ਤਰ ਦੇ ਭੌਤਿਕ ਦਸਤਾਵੇਜ਼ ਭੰਡਾਰ ਵਿੱਚ ਹੋਰ ਫਾਈਲਾਂ ਆ ਗਈਆਂ।"),
    ],
    validIndices: [0, 1],
    rationale: l("High simultaneous load can slow responses and cause timeouts. It does not directly increase physical files in a document store.", "बहुत अधिक एक साथ लोड प्रतिक्रिया धीमी कर सकता है और टाइम आउट करा सकता है। इससे भौतिक दस्तावेज भंडार में फाइलें सीधे नहीं बढ़तीं।", "ਬਹੁਤ ਵੱਧ ਇਕੱਠਾ ਲੋਡ ਜਵਾਬ ਹੌਲਾ ਕਰ ਸਕਦਾ ਹੈ ਅਤੇ ਟਾਈਮ ਆਉਟ ਕਰਵਾ ਸਕਦਾ ਹੈ। ਇਸ ਨਾਲ ਭੌਤਿਕ ਦਸਤਾਵੇਜ਼ ਭੰਡਾਰ ਵਿੱਚ ਫਾਈਲਾਂ ਸਿੱਧੇ ਨਹੀਂ ਵਧਦੀਆਂ।"),
  },
  {
    id: "bridge-closure-three-effects",
    qlId: "CAE-QL-004",
    anchor: l("A major road bridge was closed unexpectedly during the evening peak.", "शाम के व्यस्त समय में एक मुख्य सड़क पुल अचानक बंद कर दिया गया।", "ਸ਼ਾਮ ਦੇ ਰੁਸ਼ ਸਮੇਂ ਇੱਕ ਮੁੱਖ ਸੜਕ ਪੁਲ ਅਚਾਨਕ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"),
    candidates: [
      l("Traffic was diverted to alternative crossings.", "यातायात को वैकल्पिक रास्तों पर मोड़ा गया।", "ਆਵਾਜਾਈ ਨੂੰ ਵਿਕਲਪਿਕ ਰਸਤਿਆਂ ਵੱਲ ਮੋੜਿਆ ਗਿਆ।"),
      l("Travel time increased on nearby routes.", "पास के मार्गों पर यात्रा समय बढ़ गया।", "ਨੇੜਲੇ ਰਸਤਿਆਂ ਉੱਤੇ ਯਾਤਰਾ ਸਮਾਂ ਵੱਧ ਗਿਆ।"),
      l("Some bus services changed their routes temporarily.", "कुछ बस सेवाओं ने अस्थायी रूप से अपना मार्ग बदला।", "ਕੁਝ ਬੱਸ ਸੇਵਾਵਾਂ ਨੇ ਅਸਥਾਈ ਤੌਰ ਤੇ ਆਪਣਾ ਰਸਤਾ ਬਦਲਿਆ।"),
    ],
    validIndices: [0, 1, 2],
    rationale: l("Closing a major bridge can divert traffic, lengthen nearby journeys and force temporary bus-route changes.", "मुख्य पुल बंद होने से यातायात मोड़ा जा सकता है, पास की यात्राएँ लंबी हो सकती हैं और बस मार्ग अस्थायी रूप से बदल सकते हैं।", "ਮੁੱਖ ਪੁਲ ਬੰਦ ਹੋਣ ਨਾਲ ਆਵਾਜਾਈ ਮੋੜੀ ਜਾ ਸਕਦੀ ਹੈ, ਨੇੜਲੀਆਂ ਯਾਤਰਾਵਾਂ ਲੰਬੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ ਅਤੇ ਬੱਸ ਰਸਤੇ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬਦਲ ਸਕਦੇ ਹਨ।"),
  },
  {
    id: "fuel-shortage-three-effects",
    qlId: "CAE-QL-004",
    anchor: l("A region faced a prolonged shortage of diesel fuel.", "एक क्षेत्र में डीजल ईंधन की लंबे समय तक कमी रही।", "ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਡੀਜ਼ਲ ਇੰਧਨ ਦੀ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਘਾਟ ਰਹੀ।"),
    candidates: [
      l("Some freight trips were postponed.", "कुछ माल ढुलाई यात्राएँ स्थगित हुईं।", "ਕੁਝ ਮਾਲ ਢੁਆਈ ਯਾਤਰਾਵਾਂ ਮੁਲਤਵੀ ਹੋਈਆਂ।"),
      l("Operating costs increased for transport firms buying fuel at higher prices.", "महंगा ईंधन खरीदने वाली परिवहन कंपनियों की परिचालन लागत बढ़ी।", "ਮਹਿੰਗਾ ਇੰਧਨ ਖਰੀਦਣ ਵਾਲੀਆਂ ਆਵਾਜਾਈ ਕੰਪਨੀਆਂ ਦੀ ਚਲਾਣ ਲਾਗਤ ਵਧੀ।"),
      l("All electric trains in the region stopped running.", "क्षेत्र की सभी इलेक्ट्रिक ट्रेनें चलना बंद हो गईं।", "ਖੇਤਰ ਦੀਆਂ ਸਾਰੀਆਂ ਬਿਜਲੀ ਰੇਲਾਂ ਚੱਲਣੀਆਂ ਬੰਦ ਹੋ ਗਈਆਂ।"),
    ],
    validIndices: [0, 1],
    rationale: l("A diesel shortage can postpone freight movement and raise road-transport costs. It does not directly stop electric trains.", "डीजल की कमी माल ढुलाई स्थगित कर सकती है और सड़क परिवहन लागत बढ़ा सकती है। इससे इलेक्ट्रिक ट्रेनें सीधे बंद नहीं होतीं।", "ਡੀਜ਼ਲ ਦੀ ਘਾਟ ਮਾਲ ਢੁਆਈ ਮੁਲਤਵੀ ਕਰ ਸਕਦੀ ਹੈ ਅਤੇ ਸੜਕ ਆਵਾਜਾਈ ਲਾਗਤ ਵਧਾ ਸਕਦੀ ਹੈ। ਇਸ ਨਾਲ ਬਿਜਲੀ ਰੇਲਾਂ ਸਿੱਧੇ ਬੰਦ ਨਹੀਂ ਹੁੰਦੀਆਂ।"),
  },
  {
    id: "crop-disease-three-effects",
    qlId: "CAE-QL-004",
    anchor: l("A disease sharply reduced output of a widely grown vegetable crop.", "एक बीमारी से बड़े पैमाने पर उगाई जाने वाली सब्जी की पैदावार तेजी से घट गई।", "ਇੱਕ ਬਿਮਾਰੀ ਨਾਲ ਵੱਡੇ ਪੱਧਰ ਤੇ ਉਗਾਈ ਜਾਣ ਵਾਲੀ ਸਬਜ਼ੀ ਦੀ ਪੈਦਾਵਾਰ ਤੇਜ਼ੀ ਨਾਲ ਘਟ ਗਈ।"),
    candidates: [
      l("Wholesale supply of that vegetable fell.", "उस सब्जी की थोक आपूर्ति घट गई।", "ਉਸ ਸਬਜ਼ੀ ਦੀ ਥੋਕ ਸਪਲਾਈ ਘਟ ਗਈ।"),
      l("Its market price came under upward pressure.", "उसकी बाजार कीमत पर बढ़ने का दबाव आया।", "ਉਸਦੀ ਬਾਜ਼ਾਰੀ ਕੀਮਤ ਉੱਤੇ ਵੱਧਣ ਦਾ ਦਬਾਅ ਆਇਆ।"),
      l("Demand for unrelated household appliances increased immediately.", "असंबंधित घरेलू उपकरणों की मांग तुरंत बढ़ गई।", "ਅਸੰਬੰਧਤ ਘਰੇਲੂ ਉਪਕਰਣਾਂ ਦੀ ਮੰਗ ਤੁਰੰਤ ਵੱਧ ਗਈ।"),
    ],
    validIndices: [0, 1],
    rationale: l("Lower crop output can reduce supply and push prices upward. It does not directly increase demand for unrelated appliances.", "कम पैदावार आपूर्ति घटा सकती है और कीमतों पर ऊपर जाने का दबाव डाल सकती है। इससे असंबंधित उपकरणों की मांग सीधे नहीं बढ़ती।", "ਘੱਟ ਪੈਦਾਵਾਰ ਸਪਲਾਈ ਘਟਾ ਸਕਦੀ ਹੈ ਅਤੇ ਕੀਮਤਾਂ ਉੱਤੇ ਵੱਧਣ ਦਾ ਦਬਾਅ ਪਾ ਸਕਦੀ ਹੈ। ਇਸ ਨਾਲ ਅਸੰਬੰਧਤ ਉਪਕਰਣਾਂ ਦੀ ਮੰਗ ਸਿੱਧੇ ਨਹੀਂ ਵਧਦੀ।"),
  },
]);

const COPY: Record<CaeLocale, Readonly<{ causePrompt: string; effectPrompt: string; statement: string; causes: string; effects: string }>> = {
  "en-IN": { causePrompt: "Which of the following can reasonably explain the observation?", effectPrompt: "Which of the following can reasonably follow from the cause?", statement: "Statement", causes: "Possible causes", effects: "Possible effects" },
  "hi-IN": { causePrompt: "निम्नलिखित में से कौन-से अवलोकन का उचित कारण हो सकते हैं?", effectPrompt: "निम्नलिखित में से कौन-से कारण से उचित रूप से हो सकते हैं?", statement: "कथन", causes: "संभावित कारण", effects: "संभावित प्रभाव" },
  "pa-IN": { causePrompt: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ ਨਿਰੀਖਣ ਦੇ ਵਾਜਬ ਕਾਰਨ ਹੋ ਸਕਦੇ ਹਨ?", effectPrompt: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ ਕਾਰਨ ਤੋਂ ਵਾਜਬ ਤੌਰ ਤੇ ਹੋ ਸਕਦੇ ਹਨ?", statement: "ਕਥਨ", causes: "ਸੰਭਾਵਿਤ ਕਾਰਨ", effects: "ਸੰਭਾਵਿਤ ਪ੍ਰਭਾਵ" },
};

const OPTION_TEXT: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": { I: "Only I is possible.", II: "Only II is possible.", III: "Only III is possible.", I_II: "Only I and II are possible.", I_III: "Only I and III are possible.", II_III: "Only II and III are possible.", ALL: "I, II and III are all possible.", NONE: "None is possible." },
  "hi-IN": { I: "केवल I संभव है।", II: "केवल II संभव है।", III: "केवल III संभव है।", I_II: "केवल I और II संभव हैं।", I_III: "केवल I और III संभव हैं।", II_III: "केवल II और III संभव हैं।", ALL: "I, II और III तीनों संभव हैं।", NONE: "कोई भी संभव नहीं है।" },
  "pa-IN": { I: "ਕੇਵਲ I ਸੰਭਵ ਹੈ।", II: "ਕੇਵਲ II ਸੰਭਵ ਹੈ।", III: "ਕੇਵਲ III ਸੰਭਵ ਹੈ।", I_II: "ਕੇਵਲ I ਅਤੇ II ਸੰਭਵ ਹਨ।", I_III: "ਕੇਵਲ I ਅਤੇ III ਸੰਭਵ ਹਨ।", II_III: "ਕੇਵਲ II ਅਤੇ III ਸੰਭਵ ਹਨ।", ALL: "I, II ਅਤੇ III ਤਿੰਨੇ ਸੰਭਵ ਹਨ।", NONE: "ਕੋਈ ਵੀ ਸੰਭਵ ਨਹੀਂ ਹੈ।" },
};

function mix32(value: number): number { let x = value | 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
function hashText(value: string): number { let hash = 2166136261; for (const ch of value) { hash ^= ch.charCodeAt(0); hash = Math.imul(hash, 16777619); } return hash >>> 0; }
function shuffled<T>(values: readonly T[], seed: number): readonly T[] { const out = [...values]; let state = mix32(seed ^ 0x34004cae); for (let i = out.length - 1; i > 0; i -= 1) { state = mix32(state + i); const j = state % (i + 1); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function comboId(indices: readonly number[]): string { if (indices.length === 0) return "NONE"; if (indices.length === 3) return "ALL"; return indices.map((index) => R[index]).join("_"); }

function difficulty(): CaeDifficultyEvidence {
  return { causalDistance: 1, hiddenLinks: 0, topologyComplexity: 3, plausibleDistractors: 3, visibleEventCount: 4, inferenceBurden: 5, candidatePlausibilityBurden: 5, score: 18 };
}

export function generateExpandedCaeCombinationQuestion(input: Readonly<{ qlId: ExpandedComboQl; locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const pool = CAE_EXPANDED_COMBINATION_SCENARIOS.filter((scenario) => scenario.qlId === input.qlId);
  const scenario = pool[mix32((input.seed >>> 0) ^ hashText(input.qlId)) % pool.length]!;
  const correctId = comboId(scenario.validIndices);
  const all = ["I", "II", "III", "I_II", "I_III", "II_III", "ALL", "NONE"];
  const wrong = shuffled(all.filter((id) => id !== correctId), input.seed).slice(0, 3);
  const optionIds = shuffled([correctId, ...wrong], input.seed ^ 0x3311);
  const options: readonly CaeRenderedOption[] = optionIds.map((id) => ({ id, text: OPTION_TEXT[input.locale][id]!, isCorrect: id === correctId, distractorRole: id === correctId ? undefined : "OVERGENERALISATION" as const }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const causeMode = input.qlId === "CAE-QL-003";
  const familyId = causeMode ? CAE_EXPANDED_COMBINATION_FAMILY_IDS[0] : CAE_EXPANDED_COMBINATION_FAMILY_IDS[1];
  const projectionId = causeMode ? "CAE-PLAN-PROBABLE-CAUSE-COMBINATION" : "CAE-PLAN-PROBABLE-EFFECT-COMBINATION";
  const operation = causeMode ? "CAUSE_THREE" : "EFFECT_THREE_EXPANDED";
  const stateId = [`projection:${projectionId}`, `family:${familyId}`, `variant:${scenario.id}`, `operation:${operation}`, `truth:${scenario.validIndices.join("-") || "none"}`].join("|");
  const itemVariantId = `${stateId}|profile:FOUR_WAY|presentation:${optionIds.join(">")}`;
  const copy = COPY[input.locale];
  const stem = `${causeMode ? copy.causePrompt : copy.effectPrompt}\n\n${copy.statement}: ${scenario.anchor[input.locale]}\n\n${causeMode ? copy.causes : copy.effects}:\n${scenario.candidates.map((candidate, index) => `${R[index]}. ${candidate[input.locale]}`).join("\n")}`;
  const anchorId = `${scenario.id}:anchor`;
  const candidateIds = scenario.candidates.map((_, index) => `${scenario.id}:candidate-${index + 1}`);

  return Object.freeze({
    chapterId: "CAE-001",
    checkpointId: causeMode ? "CAE-CP-003" : "CAE-CP-004",
    qlId: input.qlId,
    projectionId,
    scenarioFamilyId: familyId,
    scenarioVariantId: scenario.id,
    causalStateId: stateId,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    causalWorldId: `CAE-WORLD-EXPANDED-COMBO-${scenario.id}`,
    causalStructure: `${operation}:${correctId}`,
    locale: input.locale,
    seed: input.seed,
    difficulty: "HARD",
    difficultyEvidence: difficulty(),
    questionProfile: "FOUR_WAY",
    visibleContext: { backdrop: null, visibleNodeIds: [anchorId, ...candidateIds], hiddenNodeIds: [] },
    stem,
    options: options.map((option) => option.text),
    correctIndex,
    answerId: correctId,
    explanation: scenario.rationale[input.locale],
    causalTrace: causeMode ? [...scenario.validIndices.map((index) => candidateIds[index]!), anchorId] : [anchorId, ...scenario.validIndices.map((index) => candidateIds[index]!)],
    distractorMechanisms: options.flatMap((option) => option.distractorRole ? [option.distractorRole] : []),
    candidateComparisons: [],
    optionMetadata: options,
    metadata: { solver: "CAE_CAUSAL_WORLD_SOLVER_V3", sourceMode: "CURATED_COMPOSABLE_SCENARIO", qlAllocation: "PROVISIONAL_PENDING_SOURCE_SATURATION", reviewOnly: true, questionBankWritable: false, testEligible: false, mockEligible: false, publicEligible: false },
  });
}
