import { STA_V4_SCENARIOS, type StaV4QlId } from "./exam-realness-v4-runtime.ts";

type CandidateAuthority = (typeof STA_V4_SCENARIOS)[number]["candidates"][number];
type LocalizedText = CandidateAuthority["textVariants"][number];

const l = (en: string, hi: string, pa: string): LocalizedText => ({ en, hi, pa });
const candidate = (
  id: string,
  implicit: boolean,
  first: LocalizedText,
  second: LocalizedText,
  rationale: LocalizedText,
  misconception: CandidateAuthority["misconception"],
): CandidateAuthority => ({ id, implicit, textVariants: [first, second], rationale, misconception });

const EXTRA_CANDIDATES: Readonly<Record<StaV4QlId, readonly [CandidateAuthority, CandidateAuthority]>> = Object.freeze({
  "STA-QL-001": [
    candidate(
      "TASK_RELEVANT_TO_USERS",
      true,
      l("The instructed task is relevant to the people being addressed.", "निर्देशित कार्य संबोधित लोगों के लिए प्रासंगिक है।", "ਦੱਸੀ ਕਾਰਵਾਈ ਸੰਬੋਧਿਤ ਲੋਕਾਂ ਲਈ ਸਬੰਧਤ ਹੈ।"),
      l("The people addressed have a genuine reason to carry out the stated task.", "संबोधित लोगों के लिए बताए गए कार्य को करना प्रासंगिक है।", "ਸੰਬੋਧਿਤ ਲੋਕਾਂ ਲਈ ਦੱਸਿਆ ਕੰਮ ਕਰਨਾ ਸਬੰਧਤ ਹੈ।"),
      l("A direction about how to perform a task presupposes that the task is relevant to the people being directed.", "कार्य करने का तरीका बताने वाला निर्देश उस कार्य की संबोधित लोगों के लिए प्रासंगिकता मानकर चलता है।", "ਕੰਮ ਕਰਨ ਦਾ ਤਰੀਕਾ ਦੱਸਦੀ ਹਦਾਇਤ ਉਸ ਕੰਮ ਦੀ ਸੰਬੋਧਿਤ ਲੋਕਾਂ ਲਈ ਸਬੰਧਤਾ ਮੰਨਦੀ ਹੈ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "ALTERNATIVE_ROUTE_AVAILABLE",
      false,
      l("A different route is also available for the task.", "उस कार्य के लिए एक दूसरा माध्यम भी उपलब्ध है।", "ਉਸ ਕੰਮ ਲਈ ਇੱਕ ਹੋਰ ਮਾਧਿਅਮ ਵੀ ਉਪਲਬਧ ਹੈ।"),
      l("The task may also be handled through another service route.", "कार्य किसी अन्य सेवा माध्यम से भी किया जा सकता है।", "ਕੰਮ ਕਿਸੇ ਹੋਰ ਸੇਵਾ ਮਾਧਿਅਮ ਰਾਹੀਂ ਵੀ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
      l("An alternative route may exist, but the instruction does not depend on that alternative existing.", "दूसरा माध्यम मौजूद हो सकता है, पर निर्देश उसके मौजूद होने पर निर्भर नहीं है।", "ਹੋਰ ਮਾਧਿਅਮ ਮੌਜੂਦ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਹਦਾਇਤ ਉਸਦੀ ਮੌਜੂਦਗੀ ਉੱਤੇ ਨਿਰਭਰ ਨਹੀਂ।"),
      "RELATED_BUT_IRRELEVANT",
    ),
  ],
  "STA-QL-002": [
    candidate(
      "INTERVENTION_IMPLEMENTABLE",
      true,
      l("The proposed measure is feasible to implement in this setting.", "प्रस्तावित उपाय इस व्यवस्था में लागू करने योग्य है।", "ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ਇਸ ਪ੍ਰਬੰਧ ਵਿੱਚ ਲਾਗੂ ਕਰਨ ਯੋਗ ਹੈ।"),
      l("The setting permits the proposed measure to be put into operation.", "यह व्यवस्था प्रस्तावित उपाय को लागू करने की गुंजाइश देती है।", "ਇਹ ਪ੍ਰਬੰਧ ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ਨੂੰ ਲਾਗੂ ਕਰਨ ਦੀ ਗੁੰਜਾਇਸ਼ ਦਿੰਦਾ ਹੈ।"),
      l("A practical recommendation presupposes that the proposed action is feasible enough to be implemented.", "व्यावहारिक सुझाव प्रस्तावित कार्रवाई के लागू किए जा सकने की पूर्वधारणा रखता है।", "ਵਿਹਾਰਕ ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ਦੇ ਲਾਗੂ ਹੋ ਸਕਣ ਦੀ ਧਾਰਨਾ ਰੱਖਦੀ ਹੈ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "BENEFIT_APPEARS_QUICKLY",
      false,
      l("The intended benefit would appear soon after implementation.", "अपेक्षित लाभ लागू करने के थोड़े समय बाद दिखाई देगा।", "ਉਮੀਦ ਕੀਤਾ ਲਾਭ ਲਾਗੂ ਕਰਨ ਤੋਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਬਾਅਦ ਦਿਖੇਗਾ।"),
      l("The proposed measure would show visible results in the early stage.", "प्रस्तावित उपाय शुरुआती चरण में दिखाई देने वाले परिणाम देगा।", "ਪ੍ਰਸਤਾਵਿਤ ਕਦਮ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਵਿੱਚ ਦਿਖਣ ਵਾਲੇ ਨਤੀਜੇ ਦੇਵੇਗਾ।"),
      l("Speed of benefit may affect attractiveness, but the recommendation does not logically require an immediate effect.", "लाभ की गति आकर्षण बढ़ा सकती है, पर सुझाव के लिए तत्काल प्रभाव आवश्यक नहीं।", "ਲਾਭ ਦੀ ਗਤੀ ਆਕਰਸ਼ਣ ਵਧਾ ਸਕਦੀ ਹੈ, ਪਰ ਸਿਫ਼ਾਰਸ਼ ਲਈ ਤੁਰੰਤ ਪ੍ਰਭਾਵ ਲਾਜ਼ਮੀ ਨਹੀਂ।"),
      "SUPPORTIVE_NOT_NECESSARY",
    ),
  ],
  "STA-QL-003": [
    candidate(
      "AUDIENCE_IN_POSITION_TO_COMPLY",
      true,
      l("The intended audience is in a position to follow the direction.", "लक्षित समूह निर्देश का पालन करने की स्थिति में है।", "ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਹਦਾਇਤ ਦੀ ਪਾਲਣਾ ਕਰਨ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਹੈ।"),
      l("The people addressed have the practical means needed to act on the notice.", "संबोधित लोगों के पास सूचना पर अमल करने के लिए आवश्यक व्यावहारिक साधन हैं।", "ਸੰਬੋਧਿਤ ਲੋਕਾਂ ਕੋਲ ਸੂਚਨਾ ਉੱਤੇ ਅਮਲ ਕਰਨ ਲਈ ਲੋੜੀਂਦੇ ਵਿਹਾਰਕ ਸਾਧਨ ਹਨ।"),
      l("An actionable direction presupposes that its intended audience is in a position to respond to it.", "अमल योग्य निर्देश यह मानकर चलता है कि लक्षित समूह उस पर प्रतिक्रिया देने की स्थिति में है।", "ਅਮਲਯੋਗ ਹਦਾਇਤ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਉਸ ਉੱਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਦੇਣ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਹੈ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "RULE_REDUCES_CONFUSION",
      false,
      l("The revised rule is expected to reduce confusion among users.", "संशोधित नियम उपयोगकर्ताओं में भ्रम घटाने में सहायक माना जाता है।", "ਸੋਧਿਆ ਨਿਯਮ ਵਰਤੋਂਕਾਰਾਂ ਵਿੱਚ ਉਲਝਣ ਘਟਾਉਣ ਲਈ ਸਹਾਇਕ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।"),
      l("The service expects the revised rule to make the process clearer.", "सेवा को लगता है कि संशोधित नियम प्रक्रिया को अधिक स्पष्ट बनाएगा।", "ਸੇਵਾ ਨੂੰ ਲੱਗਦਾ ਹੈ ਕਿ ਸੋਧਿਆ ਨਿਯਮ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਬਣਾਏਗਾ।"),
      l("Greater clarity could be a benefit of the rule, but the notice does not require that benefit in order to direct behaviour.", "अधिक स्पष्टता नियम का लाभ हो सकती है, पर व्यवहार निर्देशित करने के लिए यह लाभ आवश्यक नहीं।", "ਵੱਧ ਸਪਸ਼ਟਤਾ ਨਿਯਮ ਦਾ ਲਾਭ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵਿਹਾਰ ਨੂੰ ਦਿਸ਼ਾ ਦੇਣ ਲਈ ਇਹ ਲਾਭ ਲਾਜ਼ਮੀ ਨਹੀਂ।"),
      "SUPPORTIVE_NOT_NECESSARY",
    ),
  ],
  "STA-QL-004": [
    candidate(
      "CHANGE_OPERATES_AS_DESCRIBED",
      true,
      l("The introduced change will operate substantially as described.", "शुरू किया गया बदलाव मूल रूप से बताए गए तरीके से काम करेगा।", "ਸ਼ੁਰੂ ਕੀਤਾ ਬਦਲਾਅ ਮੁੱਖ ਤੌਰ ਤੇ ਦੱਸੇ ਤਰੀਕੇ ਨਾਲ ਕੰਮ ਕਰੇਗਾ।"),
      l("The mechanism introduced by the change will actually function in the relevant process.", "बदलाव से जो तंत्र जोड़ा गया है वह संबंधित प्रक्रिया में वास्तव में कार्य करेगा।", "ਬਦਲਾਅ ਨਾਲ ਜੋ ਤਰੀਕਾ ਜੋੜਿਆ ਗਿਆ ਹੈ ਉਹ ਸੰਬੰਧਤ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਅਸਲ ਵਿੱਚ ਕੰਮ ਕਰੇਗਾ।"),
      l("A prediction about the effect of a change presupposes that the change will operate in the process being discussed.", "बदलाव के प्रभाव का अनुमान यह मानकर चलता है कि बदलाव संबंधित प्रक्रिया में काम करेगा।", "ਬਦਲਾਅ ਦੇ ਪ੍ਰਭਾਵ ਦਾ ਅਨੁਮਾਨ ਇਹ ਮੰਨਦਾ ਹੈ ਕਿ ਬਦਲਾਅ ਸੰਬੰਧਤ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਕੰਮ ਕਰੇਗਾ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "PARALLEL_CHANGES_LIMITED",
      false,
      l("Other process changes are limited during the same period.", "उसी अवधि में अन्य प्रक्रिया बदलाव सीमित हैं।", "ਉਸੇ ਅਵਧੀ ਵਿੱਚ ਹੋਰ ਪ੍ਰਕਿਰਿਆ ਬਦਲਾਅ ਸੀਮਿਤ ਹਨ।"),
      l("Few unrelated operational changes occur alongside the stated intervention.", "बताए गए उपाय के साथ असंबंधित संचालन बदलाव कम हैं।", "ਦੱਸੇ ਕਦਮ ਦੇ ਨਾਲ ਗੈਰ-ਸੰਬੰਧਤ ਚਲਾਉਣ ਬਦਲਾਅ ਘੱਟ ਹਨ।"),
      l("Parallel changes could complicate attribution, but the stated prediction does not logically require their absence or scarcity.", "समानांतर बदलाव कारण तय करना कठिन कर सकते हैं, पर अनुमान के लिए उनका कम होना आवश्यक नहीं।", "ਸਮਕਾਲੀ ਬਦਲਾਅ ਕਾਰਣ ਨਿਰਧਾਰਤ ਕਰਨਾ ਔਖਾ ਕਰ ਸਕਦੇ ਹਨ, ਪਰ ਅਨੁਮਾਨ ਲਈ ਉਹਨਾਂ ਦਾ ਘੱਟ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।"),
      "RELATED_BUT_IRRELEVANT",
    ),
  ],
  "STA-QL-005": [
    candidate(
      "MESSAGE_REACHES_AUDIENCE",
      true,
      l("The intended audience is exposed to the message in a usable form.", "लक्षित समूह तक संदेश उपयोग योग्य रूप में पहुँचता है।", "ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਤੱਕ ਸੁਨੇਹਾ ਵਰਤਣ ਯੋਗ ਰੂਪ ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ।"),
      l("The persuasive message reaches the people whose response it seeks.", "प्रचार संदेश उन लोगों तक पहुँचता है जिनसे प्रतिक्रिया अपेक्षित है।", "ਪ੍ਰਚਾਰਕ ਸੁਨੇਹਾ ਉਹਨਾਂ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਤੋਂ ਪ੍ਰਤੀਕਿਰਿਆ ਮੰਗੀ ਗਈ ਹੈ।"),
      l("A persuasive appeal presupposes that the intended audience is exposed to the message it is expected to respond to.", "प्रचार अपील यह मानकर चलती है कि लक्षित समूह उस संदेश तक पहुँचता है जिस पर उससे प्रतिक्रिया अपेक्षित है।", "ਪ੍ਰਚਾਰਕ ਅਪੀਲ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਉਸ ਸੁਨੇਹੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ ਜਿਸ ਉੱਤੇ ਉਸ ਤੋਂ ਪ੍ਰਤੀਕਿਰਿਆ ਮੰਗੀ ਗਈ ਹੈ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "AUDIENCE_PRIOR_EXPERIENCE",
      false,
      l("The audience has prior experience with a similar service.", "लक्षित समूह को ऐसी ही सेवा का पहले अनुभव है।", "ਨਿਸ਼ਾਨਾ ਸਮੂਹ ਨੂੰ ਇਸੇ ਤਰ੍ਹਾਂ ਦੀ ਸੇਵਾ ਦਾ ਪਹਿਲਾਂ ਤਜਰਬਾ ਹੈ।"),
      l("People addressed by the message are familiar with comparable offers.", "संदेश पाने वाले लोग समान प्रस्तावों से परिचित हैं।", "ਸੁਨੇਹਾ ਲੈਣ ਵਾਲੇ ਲੋਕ ਮਿਲਦੇ-ਜੁਲਦੇ ਪ੍ਰਸਤਾਵਾਂ ਨਾਲ ਜਾਣੂ ਹਨ।"),
      l("Prior experience may affect persuasion, but the appeal does not depend on the audience having such experience.", "पहले का अनुभव प्रचार पर असर डाल सकता है, पर अपील उसके होने पर निर्भर नहीं।", "ਪਹਿਲਾਂ ਦਾ ਤਜਰਬਾ ਪ੍ਰਚਾਰ ਉੱਤੇ ਅਸਰ ਪਾ ਸਕਦਾ ਹੈ, ਪਰ ਅਪੀਲ ਉਸਦੀ ਮੌਜੂਦਗੀ ਉੱਤੇ ਨਿਰਭਰ ਨਹੀਂ।"),
      "RELATED_BUT_IRRELEVANT",
    ),
  ],
  "STA-QL-006": [
    candidate(
      "EVIDENCE_SCOPE_RELEVANT",
      true,
      l("The evidence group is relevant to the scope of the reported comparison.", "प्रमाण का समूह रिपोर्ट की गई तुलना के दायरे के लिए प्रासंगिक है।", "ਸਬੂਤ ਵਾਲਾ ਸਮੂਹ ਰਿਪੋਰਟ ਕੀਤੀ ਤੁਲਨਾ ਦੇ ਦਾਇਰੇ ਲਈ ਸਬੰਧਤ ਹੈ।"),
      l("The observations used as evidence fit the population or setting addressed by the claim.", "प्रमाण के रूप में लिए गए अवलोकन दावे से जुड़े समूह या परिस्थिति से मेल खाते हैं।", "ਸਬੂਤ ਵਜੋਂ ਲਏ ਨਿਰੀਖਣ ਦਾਅਵੇ ਨਾਲ ਜੁੜੇ ਸਮੂਹ ਜਾਂ ਹਾਲਾਤ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ।"),
      l("An evidence-based comparison presupposes that its evidence is relevant to the scope over which the conclusion is stated.", "प्रमाण-आधारित तुलना यह मानकर चलती है कि प्रमाण निष्कर्ष के दायरे से प्रासंगिक है।", "ਸਬੂਤ-ਆਧਾਰਿਤ ਤੁਲਨਾ ਇਹ ਮੰਨਦੀ ਹੈ ਕਿ ਸਬੂਤ ਨਤੀਜੇ ਦੇ ਦਾਇਰੇ ਨਾਲ ਸਬੰਧਤ ਹੈ।"),
      "REQUIRED_DEPENDENCY",
    ),
    candidate(
      "ANALYST_FAMILIAR_METHOD",
      false,
      l("The analysts are familiar with the data-collection method.", "विश्लेषक डेटा-संग्रह विधि से परिचित हैं।", "ਵਿਸ਼ਲੇਸ਼ਕ ਡਾਟਾ ਇਕੱਠਾ ਕਰਨ ਦੇ ਤਰੀਕੇ ਨਾਲ ਜਾਣੂ ਹਨ।"),
      l("The evidence-gathering procedure is routine for the analysis team.", "प्रमाण जुटाने की प्रक्रिया विश्लेषण दल की नियमित प्रक्रिया है।", "ਸਬੂਤ ਇਕੱਠਾ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਵਿਸ਼ਲੇਸ਼ਣ ਟੀਮ ਦੀ ਰੋਜ਼ਮਰਰਾ ਪ੍ਰਕਿਰਿਆ ਹੈ।"),
      l("Analyst familiarity may make collection easier, but it is not a validity premise of the comparison.", "विश्लेषकों की परिचितता संग्रह आसान कर सकती है, पर तुलना की वैधता की पूर्वधारणा नहीं।", "ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਦੀ ਜਾਣ-ਪਛਾਣ ਇਕੱਠਾ ਕਰਨਾ ਸੌਖਾ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਤੁਲਨਾ ਦੀ ਵੈਧਤਾ ਦੀ ਧਾਰਨਾ ਨਹੀਂ।"),
      "RELATED_BUT_IRRELEVANT",
    ),
  ],
});

let installed = false;
export function installStaV4CandidateMatrix(): void {
  if (installed) return;
  for (const scenario of STA_V4_SCENARIOS) {
    const mutable = scenario.candidates as unknown as CandidateAuthority[];
    for (const extra of EXTRA_CANDIDATES[scenario.qlId]) {
      if (!mutable.some((entry) => entry.id === extra.id)) mutable.push(extra);
    }
  }
  installed = true;
}

installStaV4CandidateMatrix();
export const STA_V4_CANDIDATE_MATRIX_SIZE = 7 as const;
