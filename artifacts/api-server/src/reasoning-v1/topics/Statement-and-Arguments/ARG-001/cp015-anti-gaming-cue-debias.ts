import { createHash } from "node:crypto";

export const ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY = "ARG_CP015_ANTI_GAMING_CUE_DEBIAS_V1" as const;

type Question = Readonly<Record<string, any>>;
type Strength = "STRONG" | "WEAK";
type Language = "en" | "hi" | "pa";

type Rewrite = Readonly<{
  argument: string;
  reason: string;
}>;

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function languageOf(question: Question): Language {
  if (question.locale === "hi-IN" || question.language === "hi") return "hi";
  if (question.locale === "pa-IN" || question.language === "pa") return "pa";
  return "en";
}

function strengthsOf(question: Question, count: number): readonly Strength[] | undefined {
  const strengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths : [];
  if (strengths.length !== count) return undefined;
  const normalized = strengths.map((value) => text(value).toUpperCase());
  if (normalized.some((value) => value !== "STRONG" && value !== "WEAK")) return undefined;
  return normalized as readonly Strength[];
}

function hasEnglishCue(value: string): boolean {
  return /\b(?:always|never|every|everyone|everything|completely|guarantee(?:s|d)?|impossible|automatically|inevitably|necessarily|only when)\b|under any circumstances|must have something to hide/i.test(value);
}

function hasHindiCue(value: string): boolean {
  return /हमेशा|कभी नहीं|\bहर\b|\bसभी\b|पूरी तरह|गारंटी|असंभव|अपने[- ]आप|केवल तभी|निश्चित रूप से|ज़रूर कुछ छिपाने|जरूर कुछ छिपाने/.test(value);
}

function hasPunjabiCue(value: string): boolean {
  return /ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ|ਕਦੇ ਨਹੀਂ|\bਹਰ\b|\bਸਾਰੇ\b|\bਸਾਰੀ\b|ਪੂਰੀ ਤਰ੍ਹਾਂ|ਗਾਰੰਟੀ|ਅਸੰਭਵ|ਆਪਣੇ ਆਪ|ਸਿਰਫ਼ (?:ਉਸ ਵੇਲੇ|ਤਦ)|ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/.test(value);
}

function hasCue(value: string, language: Language): boolean {
  if (language === "hi") return hasHindiCue(value);
  if (language === "pa") return hasPunjabiCue(value);
  return hasEnglishCue(value);
}

function rewriteEnglish(argument: string): Rewrite {
  let next = argument;
  let reason = "The argument treats a broad assumption as sufficient without establishing the missing link needed for the conclusion.";

  if (/always careless/i.test(next)) {
    next = next
      .replace(/are always careless/gi, "are generally careless")
      .replace(/should never affect/gi, "should not influence");
    reason = "It stereotypes late or walk-in users instead of assessing demand, staffing or service-access needs.";
  } else if (/completely eliminate queues for all/i.test(next)) {
    next = next.replace(/will completely eliminate queues for all/gi, "should be treated as sufficient to solve the queue problem for");
    reason = "A limited extension may reduce pressure, but it is not evidence that no other demand or capacity measure is needed.";
  } else if (/automatically useless/i.test(next)) {
    next = next.replace(/anything displayed afterwards is automatically useless/gi, "information displayed afterwards has little practical value and need not be prioritised");
    reason = "Completion of a process does not remove the value of relevant clarification, accountability or correction information.";
  } else if (/\bdigital\b.*\bnecessarily\b/i.test(next)) {
    next = next
      .replace(/necessarily produce better/gi, "should be assumed to produce better")
      .replace(/necessarily provide better/gi, "should be assumed to provide better")
      .replace(/\bin every\b/gi, "across");
    reason = "The delivery format alone does not establish superior learning outcomes across different learners and tasks.";
  } else if (/can never help reduce/i.test(next)) {
    next = next.replace(/can never help reduce/gi, "should be dismissed as ineffective for reducing");
    reason = "A counterexample does not show that an alert has no useful early-warning effect in other cases.";
  } else if (/disappear completely/i.test(next)) {
    next = next.replace(/will disappear completely/gi, "should no longer be treated as a material problem");
    reason = "One orientation or training intervention does not by itself establish that future misunderstanding is no longer material.";
  } else if (/one (?:user|customer).*failed/i.test(next) && /(?:impossible|never)/i.test(next)) {
    next = next.replace(/, so .*$/i, ", so the control should be regarded as too unreliable for legitimate changes.");
    reason = "One failed attempt is anecdotal evidence and does not establish that the control is broadly unusable for legitimate users.";
  } else if (/\bverification\b/i.test(next) && /\bguarantee|becomes impossible|can never occur/i.test(next)) {
    next = next.replace(/(?:guarantees? that|means that|ensures that).*$/i, "should be treated as enough reason to make further fraud safeguards unnecessary.");
    if (next === argument) next = next.replace(/,?\s*every future fraud attempt becomes impossible\.?$/i, ", so further fraud safeguards should be treated as unnecessary.");
    reason = "Verification can reduce risk, but that does not make other fraud safeguards unnecessary.";
  } else if (/expensive desktop computer/i.test(next) && /\bevery\b/i.test(next)) {
    next = next
      .replace(/would require every ([^,.]+?) to own an expensive desktop computer/gi, "should be rejected because it depends on $1 having desktop access")
      .replace(/require every ([^,.]+?) to own an expensive desktop computer/gi, "depend on $1 having desktop access")
      .replace(/only if every ([^,.]+?) has an expensive desktop computer/gi, "only where $1 has desktop access")
      .replace(/unless every ([^,.]+?) owns an expensive desktop computer/gi, "unless visitors have desktop access");
    reason = "It assumes desktop ownership is a necessary implementation condition and ignores assisted, mobile or walk-in booking routes.";
  } else if (/automatically become available everywhere/i.test(next)) {
    next = next.replace(/will automatically become available everywhere/gi, "should be assumed to be ready at rollout");
    reason = "Announcing a transition does not establish that the required capacity, support or fallback arrangements will be ready by the rollout date.";
  } else if (/can never be conducted securely under any circumstances/i.test(next)) {
    next = next.replace(/can never be conducted securely under any circumstances, regardless of/gi, "should be rejected on security grounds rather than evaluated with");
    reason = "It rejects the format without assessing whether the stated safeguards or fallback arrangements materially address the risk.";
  } else if (/work automatically/i.test(next)) {
    next = next.replace(/will work automatically/gi, "should work without a separate communication or readiness plan");
    reason = "Changing the rule or bins does not establish user adoption, staff readiness or collection capacity.";
  } else if (/time[- ]slot/i.test(next) && /(?:impossible|inaccessible|always)/i.test(next)) {
    next = next
      .replace(/permanently impossible to deliver/gi, "too impractical to deliver reliably")
      .replace(/always makes public services inaccessible to everyone/gi, "should be assumed to reduce public access enough to outweigh its queue-management benefit")
      .replace(/only if every visitor has an expensive desktop computer/gi, "only where visitors have desktop access")
      .replace(/impossible unless every visitor owns an expensive desktop computer/gi, "unsuitable where visitors do not have desktop access");
    reason = "It turns an implementation concern into a rejection of the system without considering assisted or walk-in alternatives.";
  } else if (/personal recording devices/i.test(next) && /necessarily causes|should never regulate/i.test(next)) {
    next = next
      .replace(/Every use of personal recording devices[^,]* necessarily causes unauthorised recording, so no exception such as ([^,.]+) can ever be justified/gi, "Because misuse of personal recording devices can occur, $1 should not be treated as a meaningful exception")
      .replace(/should never regulate it even to address unauthorised recording/gi, "should treat separate regulation of unauthorised recording as unnecessary");
    reason = "The existence of misuse does not erase legitimate exceptions, and legitimate exceptions do not remove the case for targeted regulation.";
  } else if (/advance billing notice/i.test(next) && /nobody will ever choose/i.test(next)) {
    next = "No. An advance billing notice would itself discourage renewal, so informing users about the upcoming charge works against a legitimate renewal objective.";
    reason = "It assumes the notice's effect on renewal without evidence and ignores the informed-choice purpose of advance billing information.";
  } else if (/limited restriction/i.test(next) && /never be allowed/i.test(next)) {
    next = next.replace(/If a limited restriction ([^,]+) helps even once, ([^.]+) should never be allowed there again\.?/i, "Evidence that a limited restriction $1 helped during one peak is enough to justify extending it beyond the defined period.");
    reason = "A benefit from a limited measure does not justify expanding its duration or scope without further evidence.";
  } else if (/brief limit on heavy vehicles/i.test(next) && /ruin every activity/i.test(next)) {
    next = next.replace(/will permanently ruin every activity in the surrounding area/gi, "should be assumed to damage surrounding activity enough to reject a time-limited restriction without testing alternatives");
    reason = "It predicts severe area-wide harm from a brief restriction without evidence about actual displacement or local activity.";
  } else if (/must have something to hide/i.test(next)) {
    next = next.replace(/^No\. Any (.+?) who ask about (.+?) must have something to hide\.?$/i, "No. $1 who ask about $2 are probably trying to avoid oversight, so their concern should carry little weight.");
    reason = "It stereotypes people who ask about monitoring instead of addressing the necessity, scope or safeguards of the policy.";
  } else if (/like everyone else/i.test(next)) {
    next = next.replace(/are simply trying to avoid prolonged standing like everyone else/gi, "mainly reflect a preference to avoid standing rather than a distinct access barrier");
    reason = "It dismisses a mobility limitation as preference instead of addressing the access barrier created by prolonged standing.";
  } else if (/guarantee perfect future deadline discipline/i.test(next)) {
    next = next.replace(/will guarantee perfect future deadline discipline from everyone in the future/gi, "should be sufficient by itself to produce consistent future deadline compliance");
    reason = "Public naming does not by itself establish future compliance, and the argument ignores privacy and proportionality considerations.";
  } else if (/always unacceptable in every context/i.test(next)) {
    next = next.replace(/is always unacceptable in every context, regardless of consent, purpose or safeguards/gi, "should be rejected without considering consent, purpose or safeguards because public display can create privacy concerns");
    reason = "A privacy concern is relevant, but the argument refuses to assess the purpose, consent and safeguards that determine proportionality.";
  } else if (/modern (?:technology|monitoring tool)/i.test(next) && /(?:always|automatically) fair/i.test(next)) {
    next = next.replace(/because (.+?) is (?:a )?modern (?:technology|monitoring tool),? so (.+?) (?:must always|is automatically) be? ?fair.*$/i, "because $1 is modern technology, its use should be presumed fair without a separate necessity or proportionality assessment.");
    if (next === argument) next = next.replace(/must always be fair|is automatically fair/gi, "should be presumed fair without a separate necessity assessment");
    reason = "Being modern does not establish that a monitoring measure is necessary, proportionate or fair in the stated context.";
  } else if (/complaint can occur only when guilt is certain/i.test(next)) {
    next = next.replace(/One (.+?) complaint can occur only when guilt is certain/gi, "A single $1 complaint should be treated as sufficient proof of guilt");
    reason = "A complaint is an allegation, not proof; irreversible action still requires evidence and a proportionate process.";
  } else if (/anomaly alert is always proof of fraud/i.test(next)) {
    next = next.replace(/A machine-learning anomaly alert is always proof of fraud/gi, "A machine-learning anomaly alert should be treated as sufficient proof of fraud");
    reason = "An anomaly alert is a risk signal, not conclusive proof, especially where transaction context may be incomplete.";
  } else if (/should never use temporary risk controls/i.test(next)) {
    next = next.replace(/the bank should never use temporary risk controls or investigate flagged transactions at all instead of terminate the customer relationship/gi, "the bank should avoid temporary controls and investigation rather than act until certainty is available");
    reason = "It creates a false choice between certainty and inaction instead of considering reversible controls and investigation.";
  } else if (/newly added device/i.test(next) && /Every instance/i.test(next)) {
    next = "Yes. Payments from a newly added device should be treated as presumptively fraudulent, so mandatory pre-authorisation should be adopted without considering lower-friction risk checks.";
    reason = "A risk indicator can justify extra scrutiny, but it does not establish that one control is appropriate for all such transactions.";
  } else if (/must either ignore every/i.test(next)) {
    next = next.replace(/must either ignore every ([^;]+?) or permanently ([^;]+?);/gi, "must either decline to act on individual $1 or permanently $2;");
    reason = "It presents inaction and a permanent blanket response as the only choices, ignoring proportionate investigation and targeted remedies.";
  } else if (/single .* allegation proves that every candidate and centre/i.test(next)) {
    next = next.replace(/A single (.+?) allegation proves that every candidate and centre in (.+?) was affected/gi, "A single $1 allegation is enough to infer that the integrity of $2 as a whole was compromised");
    reason = "One allegation does not establish examination-wide impact without evidence about affected candidates, centres or sessions.";
  } else if (/will inevitably create permanent gridlock/i.test(next)) {
    next = next.replace(/will inevitably create permanent gridlock across the entire city even with/gi, "should be rejected because displacement is likely to create severe citywide congestion despite");
    reason = "It assumes extreme network-wide displacement without testing the stated parallel-road or transport capacity.";
  } else if (/must ignore every future complaint|can never act on another complaint|can occur only when guilt is already certain|always proves the most serious misconduct/i.test(next)) {
    next = next
      .replace(/must ignore every future complaint as well/gi, "would have little basis for acting on later complaints either")
      .replace(/every future complaint must be ignored/gi, "later complaints would also have little basis for action")
      .replace(/can never act on another complaint/gi, "would have little basis for acting on a later complaint")
      .replace(/can occur only when guilt is already certain/gi, "should be treated as sufficient proof of guilt")
      .replace(/always proves the most serious misconduct/gi, "should be treated as sufficient proof of the most serious misconduct");
    reason = "It substitutes an allegation or one response decision for the evidence and proportionality needed in each case.";
  }

  if (hasEnglishCue(next)) {
    next = next
      .replace(/\balways\b/gi, "generally")
      .replace(/\bnever\b/gi, "hardly ever")
      .replace(/\beveryone\b/gi, "most people")
      .replace(/\bevery\b/gi, "most")
      .replace(/\bcompletely\b/gi, "substantially")
      .replace(/\bautomatically\b/gi, "without further intervention")
      .replace(/\binevitably\b/gi, "predictably")
      .replace(/\bnecessarily\b/gi, "by itself")
      .replace(/\bimpossible\b/gi, "impractical")
      .replace(/\bonly when\b/gi, "mainly when")
      .replace(/under any circumstances/gi, "in practice")
      .replace(/must have something to hide/gi, "is probably trying to avoid oversight")
      .replace(/guarantees? that/gi, "is treated as enough reason to assume that");
  }

  return Object.freeze({ argument: next, reason });
}

function rewriteHindi(argument: string): Rewrite {
  let next = argument;
  let reason = "यह तर्क आवश्यक तथ्य सिद्ध किए बिना एक व्यापक धारणा को निष्कर्ष के लिए पर्याप्त मान लेता है।";

  next = next
    .replace(/हमेशा लापरवाह/g, "आम तौर पर लापरवाह")
    .replace(/कभी प्रभावित नहीं करनी चाहिए/g, "निर्णय में महत्व नहीं दिया जाना चाहिए")
    .replace(/कतारें पूरी तरह समाप्त हो जाएँगी/g, "कतार की समस्या के लिए अकेले ही पर्याप्त होगा")
    .replace(/हर समस्या तुरंत हल होने की गारंटी मिल जाएगी/g, "अधिकतर समस्याओं के समाधान के लिए इसे ही पर्याप्त मान लिया जाएगा")
    .replace(/कभी स्टॉप नहीं चूकेगा/g, "स्टॉप छूटने की समस्या को नगण्य मान लिया जा सकता है")
    .replace(/हर ([^।,.]+?) कार्यक्रम में/g, "विभिन्न $1 कार्यक्रमों में")
    .replace(/हर वैध बदलाव हमेशा असंभव हो जाएगा/g, "यह नियंत्रण वैध बदलावों के लिए बहुत अविश्वसनीय मान लिया जाएगा")
    .replace(/गारंटी देता है कि ([^।]+?) कभी ([^।]+?) नहीं/g, "$1 के जोखिम को इतना कम मानता है कि अतिरिक्त सुरक्षा की जरूरत नहीं रहेगी")
    .replace(/यह गारंटी देता है कि उससे जुड़ी धोखाधड़ी कभी नहीं हो सकती/g, "को इतना प्रभावी मानता है कि अतिरिक्त धोखाधड़ी सुरक्षा की जरूरत नहीं रहेगी")
    .replace(/भविष्य की हर धोखाधड़ी असंभव हो जाएगी/g, "भविष्य की धोखाधड़ी के लिए अतिरिक्त सुरक्षा अनावश्यक मान ली जाएगी")
    .replace(/कोई भी वास्तविक उपयोगकर्ता ([^।]+?) कभी नहीं बदल पाएगा/g, "एक असफल प्रयास के आधार पर यह तरीका वास्तविक उपयोगकर्ताओं के लिए बहुत अविश्वसनीय मान लिया जाएगा")
    .replace(/हर नागरिक के पास महँगा डेस्कटॉप कंप्यूटर होना जरूरी होगा/g, "डेस्कटॉप उपलब्धता को अनिवार्य शर्त मान लिया जाएगा")
    .replace(/हर आगंतुक के पास महंगा डेस्कटॉप कंप्यूटर होना जरूरी होगा/g, "डेस्कटॉप उपलब्धता को अनिवार्य शर्त मान लिया जाएगा")
    .replace(/हर आगंतुक महंगा डेस्कटॉप कंप्यूटर रखता हो/g, "आगंतुकों के पास डेस्कटॉप उपलब्ध हो")
    .replace(/हर आगंतुक के पास महंगा डेस्कटॉप न हो/g, "आगंतुकों के पास डेस्कटॉप उपलब्ध न हो")
    .replace(/हर प्रकार के ([^।,.]+?) संभाल सकता है/g, "विभिन्न $1 संभालने के लिए अकेले पर्याप्त माना जाता है")
    .replace(/कोई उपयोगी सेवा कभी नहीं दे सकती/g, "उपयोगी सेवा देने के लिए बहुत अविश्वसनीय मान ली जाती है")
    .replace(/अपने आप काम करेगा/g, "बिना अलग तैयारी योजना के काम कर लेगा")
    .replace(/हर जगह ([^।]+?) अपने आप उपलब्ध हो जाएगा/g, "$1 घोषित समय तक तैयार मान लिया जाएगा")
    .replace(/स्थायी रूप से असंभव बना देता है/g, "व्यावहारिक रूप से अनुपयोगी बना देता है")
    .replace(/हमेशा के लिए असंभव हो जाएगा/g, "इतना अव्यावहारिक हो जाएगा कि इसे छोड़ देना चाहिए")
    .replace(/हमेशा सार्वजनिक सेवाओं को हर व्यक्ति के लिए अनुपलब्ध बना देती है/g, "सार्वजनिक पहुँच को इतना घटा देती है कि कतार-प्रबंधन लाभ पर विचार करने की जरूरत नहीं")
    .replace(/भविष्य में इससे जुड़ी हर कठिनाई को पूरी तरह समाप्त कर देगी/g, "भविष्य की कठिनाइयों के लिए किसी अन्य उपाय की जरूरत नहीं छोड़ेगी")
    .replace(/हर समय बंद कर देना चाहिए/g, "तय अवधि से आगे भी प्रतिबंध बढ़ा देना चाहिए")
    .replace(/स्थानीय गतिविधि को हमेशा के लिए खत्म कर देगा/g, "स्थानीय गतिविधि को इतना नुकसान पहुँचाएगा कि सीमित प्रतिबंध भी नहीं आजमाना चाहिए")
    .replace(/आसपास के हर व्यवसाय को स्थायी रूप से बंद कर देता है/g, "आसपास के कारोबार को इतना नुकसान पहुँचाता है कि सीमित प्रतिबंध भी नहीं आजमाना चाहिए")
    .replace(/कोई बदलाव अपने-आप अनुचित होगा/g, "बदलाव को मौजूदा व्यवस्था से कम उचित मान लेना चाहिए")
    .replace(/उसके पास जरूर कुछ छिपाने को है/g, "वह शायद निगरानी से बचना चाहता है, इसलिए उसकी आपत्ति को कम महत्व देना चाहिए")
    .replace(/हर संदर्भ में हमेशा गलत है, चाहे सहमति, उद्देश्य या सुरक्षा उपाय कुछ भी हों/g, "गोपनीयता की चिंता के कारण सहमति, उद्देश्य और सुरक्षा उपायों की अलग जाँच किए बिना गलत मान लेना चाहिए")
    .replace(/इसका उपयोग हमेशा न्यायसंगत होगा/g, "इसके उपयोग को अलग आवश्यकता या अनुपातिकता जाँच के बिना न्यायसंगत मान लेना चाहिए")
    .replace(/की हर घटना या तो धोखाधड़ी है या उसे धोखाधड़ी मानना चाहिए, इसलिए केवल ([^।]+?) ही खाते को बचा सकता है/g, "को अपने-आप उच्च जोखिम मानकर $1 अपनाना चाहिए, बिना कम-घर्षण वाले जोखिम उपायों की तुलना किए")
    .replace(/या तो हर ([^।;]+?) अनदेखी करनी होगी या ([^।;]+?) स्थायी रूप से बंद करना होगा/g, "या तो अलग-अलग $1 पर कार्रवाई नहीं करनी चाहिए या $2 स्थायी रूप से बंद करना चाहिए")
    .replace(/एक ([^।]+?) का आरोप ही सिद्ध करता है कि ([^।]+?) का हर अभ्यर्थी और केंद्र प्रभावित था/g, "एक $1 का आरोप ही यह मानने के लिए पर्याप्त है कि $2 की समग्र निष्पक्षता प्रभावित हुई")
    .replace(/एक ([^।]+?) की शिकायत ही सिद्ध करता है कि ([^।]+?) का हर अभ्यर्थी और केंद्र प्रभावित था/g, "एक $1 की शिकायत ही यह मानने के लिए पर्याप्त है कि $2 की समग्र निष्पक्षता प्रभावित हुई")
    .replace(/केवल तभी हो सकती है जब दोष निश्चित हो/g, "को दोष का पर्याप्त प्रमाण मान लेना चाहिए")
    .replace(/स्थायी जाम निश्चित रूप से हो जाएगा/g, "गंभीर शहर-व्यापी जाम मान लेना चाहिए, बिना वैकल्पिक मार्ग क्षमता जाँचे")
    .replace(/भविष्य की हर शिकायत अनदेखी करनी चाहिए/g, "बाद की शिकायतों पर भी कार्रवाई का आधार बहुत कमजोर मानना चाहिए")
    .replace(/दोष बिना संदेह स्थापित माना जाना चाहिए/g, "संकेत को ही दोष का पर्याप्त प्रमाण मान लेना चाहिए");

  if (hasHindiCue(next)) {
    next = next
      .replace(/हमेशा/g, "आम तौर पर")
      .replace(/कभी नहीं/g, "शायद ही")
      .replace(/\bहर\b/g, "अधिकांश")
      .replace(/\bसभी\b/g, "अधिकांश")
      .replace(/पूरी तरह/g, "काफी हद तक")
      .replace(/असंभव/g, "बहुत अव्यावहारिक")
      .replace(/अपने[- ]आप/g, "बिना किसी अतिरिक्त कदम के")
      .replace(/केवल तभी/g, "मुख्यतः तभी")
      .replace(/निश्चित रूप से/g, "बहुत संभवतः")
      .replace(/ज़रूर कुछ छिपाने|जरूर कुछ छिपाने/g, "शायद निगरानी से बचने")
      .replace(/गारंटी देता है कि/g, "यह मान लेने के लिए पर्याप्त माना जाता है कि")
      .replace(/गारंटी मिल जाएगी/g, "इसे पर्याप्त मान लिया जाएगा");
  }

  if (/एक उपयोगकर्ता|एक ग्राहक|एक घटना|एक प्रयास/.test(argument)) {
    reason = "एक घटना या एक असफल प्रयास से पूरे नियंत्रण या सभी वास्तविक उपयोगकर्ताओं के बारे में व्यापक निष्कर्ष नहीं निकाला जा सकता।";
  } else if (/आधुनिक|डिजिटल/.test(argument)) {
    reason = "केवल तकनीक या माध्यम का आधुनिक/डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।";
  } else if (/शिकायत|आरोप|संकेत|रिपोर्ट/.test(argument)) {
    reason = "शिकायत, आरोप या जोखिम-संकेत अपने-आप प्रमाण नहीं है; कार्रवाई के लिए साक्ष्य और अनुपातिक प्रक्रिया चाहिए।";
  } else if (/डेस्कटॉप|समय-स्लॉट|स्लॉट/.test(argument)) {
    reason = "यह सहायता, मोबाइल या वॉक-इन विकल्पों को देखे बिना डेस्कटॉप उपलब्धता को अनिवार्य कार्यान्वयन शर्त मान लेता है।";
  }

  return Object.freeze({ argument: next, reason });
}

function rewritePunjabi(argument: string): Rewrite {
  let next = argument;
  let reason = "ਇਹ ਦਲੀਲ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ਸਾਬਤ ਕੀਤੇ ਬਿਨਾਂ ਇੱਕ ਵਿਆਪਕ ਧਾਰਨਾ ਨੂੰ ਨਤੀਜੇ ਲਈ ਕਾਫ਼ੀ ਮੰਨ ਲੈਂਦੀ ਹੈ।";

  next = next
    .replace(/ਹਰ ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੱਲ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ/g, "ਜ਼ਿਆਦਾਤਰ ਸਮੱਸਿਆਵਾਂ ਦੇ ਹੱਲ ਲਈ ਇਸਨੂੰ ਹੀ ਕਾਫ਼ੀ ਮੰਨ ਲਿਆ ਜਾਵੇਗਾ")
    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਤਮ ਹੋ ਜਾਵੇਗਾ/g, "ਇੰਨਾ ਘੱਟ ਮੰਨ ਲਿਆ ਜਾਵੇਗਾ ਕਿ ਹੋਰ ਕਦਮ ਦੀ ਲੋੜ ਨਹੀਂ ਰਹੇਗੀ")
    .replace(/ਹਰ ਵਾਜਬ ਬਦਲਾਅ ਹਮੇਸ਼ਾਂ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ/g, "ਇਹ ਕੰਟਰੋਲ ਵਾਜਬ ਬਦਲਾਵਾਂ ਲਈ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਸਾਰੀ ਸਮਰੱਥਾ ਜ਼ਰੂਰ ਗੁਆ ਦੇਣਗੇ/g, "ਸਮਰੱਥਾ ਇੰਨੀ ਘਟ ਜਾਵੇਗੀ ਕਿ ਇਸ ਢੰਗ ਨੂੰ ਰੱਦ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਹਰ ([^।,.]+?) ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ/g, "ਵੱਖ-ਵੱਖ $1 ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ")
    .replace(/ਲਾਜ਼ਮੀ ਦਿੰਦੇ ਹਨ/g, "ਬਿਨਾਂ ਵੱਖਰੇ ਸਬੂਤ ਦੇ ਬਿਹਤਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਇਹ ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ ਇਸ ਨਾਲ ਜੁੜੀ ਧੋਖਾਧੜੀ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦੀ/g, "ਨੂੰ ਇੰਨਾ ਪ੍ਰਭਾਵੀ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ ਕਿ ਹੋਰ ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਨਹੀਂ ਰਹਿੰਦੀ")
    .replace(/ਭਵਿੱਖ ਦੀ ਹਰ ਧੋਖਾਧੜੀ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗੀ/g, "ਭਵਿੱਖ ਦੀ ਧੋਖਾਧੜੀ ਲਈ ਹੋਰ ਸੁਰੱਖਿਆ ਬੇਲੋੜੀ ਮੰਨੀ ਜਾਵੇਗੀ")
    .replace(/ਹਰ ਅਸਲੀ ਬਦਲਾਅ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ/g, "ਇੱਕ ਨਾਕਾਮੀ ਦੇ ਆਧਾਰ 'ਤੇ ਇਹ ਢੰਗ ਅਸਲੀ ਬਦਲਾਵਾਂ ਲਈ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਕੋਈ ਵੀ ਅਸਲੀ ਵਰਤੋਂਕਾਰ ([^।]+?) ਕਦੇ ਨਹੀਂ ਬਦਲ ਸਕੇਗਾ/g, "ਇੱਕ ਨਾਕਾਮੀ ਦੇ ਆਧਾਰ 'ਤੇ ਇਹ ਢੰਗ ਅਸਲੀ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਹਰ ਅਸਲੀ ਬੇਨਤੀ ਵੀ ਅਸੰਭਵ ਹੋਵੇਗੀ/g, "ਇੱਕ ਨਾਕਾਮੀ ਦੇ ਆਧਾਰ 'ਤੇ ਅਸਲੀ ਬੇਨਤੀਆਂ ਲਈ ਇਹ ਢੰਗ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਹਰ ਥਾਂ ([^।]+?) ਆਪਣੇ ਆਪ ਉਪਲਬਧ ਹੋ ਜਾਣਗੇ/g, "$1 ਘੋਸ਼ਿਤ ਸਮੇਂ ਤੱਕ ਤਿਆਰ ਮੰਨੇ ਜਾਣੇ ਚਾਹੀਦੇ ਹਨ")
    .replace(/ਹਰ ਕਿਸਮ ਦੇ ([^।,.]+?) ਸੰਭਾਲ ਸਕਦੇ ਹਨ/g, "ਵੱਖ-ਵੱਖ $1 ਸੰਭਾਲਣ ਲਈ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਮੰਨੇ ਜਾਂਦੇ ਹਨ")
    .replace(/ਕੋਈ ਲਾਭਦਾਇਕ ਸੇਵਾ ਕਦੇ ਨਹੀਂ ਦੇ ਸਕਦੀ/g, "ਲਾਭਦਾਇਕ ਸੇਵਾ ਦੇਣ ਲਈ ਬਹੁਤ ਅਣਭਰੋਸੇਯੋਗ ਮੰਨੀ ਜਾਂਦੀ ਹੈ")
    .replace(/ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੋਵੇਗਾ/g, "ਡੈਸਕਟਾਪ ਪਹੁੰਚ ਨੂੰ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਸਦਾ ਲਈ ਅਸੰਭਵ ਬਣਾ ਦਿੰਦੀ ਹੈ/g, "ਅਮਲ ਵਿੱਚ ਇੰਨੀ ਔਖੀ ਬਣਾ ਦਿੰਦੀ ਹੈ ਕਿ ਇਸਨੂੰ ਛੱਡ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ/g, "ਅਮਲ ਵਿੱਚ ਇੰਨਾ ਔਖਾ ਹੋ ਜਾਵੇਗਾ ਕਿ ਇਸਨੂੰ ਛੱਡ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਭਵਿੱਖ ਵਿੱਚ ਇਸ ਨਾਲ ਜੁੜੀ ਹਰ ਮੁਸ਼ਕਲ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਤਮ ਕਰ ਦੇਵੇਗੀ/g, "ਭਵਿੱਖ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਲਈ ਹੋਰ ਕਿਸੇ ਉਪਾਅ ਦੀ ਲੋੜ ਨਹੀਂ ਛੱਡੇਗੀ")
    .replace(/ਕੋਈ ਵੀ ਕਦੇ ([^।]+?) ਨਹੀਂ ਚੁਣੇਗਾ/g, "ਸੂਚਨਾ ਮਿਲਣ ਨਾਲ $1 ਚੁਣਨ ਦੀ ਇੱਛਾ ਇੰਨੀ ਘਟੇਗੀ ਕਿ ਜਾਣਕਾਰੀ ਦੇਣਾ ਉਲਟ ਨਤੀਜਾ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਹਰ ਵਰਤੋਂ ਲਾਜ਼ਮੀ ਗੈਰ-ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਿੰਗ ਪੈਦਾ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ([^।]+?) ਕੋਈ ਅਪਵਾਦ ਕਦੇ ਵਾਜਬ ਨਹੀਂ ਹੋ ਸਕਦਾ/g, "ਗਲਤ ਵਰਤੋਂ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ $1 ਨੂੰ ਅਰਥਪੂਰਨ ਅਪਵਾਦ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ")
    .replace(/ਸਥਾਨਕ ਸਰਗਰਮੀ ਨੂੰ ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗਾ/g, "ਸਥਾਨਕ ਸਰਗਰਮੀ ਨੂੰ ਇੰਨਾ ਨੁਕਸਾਨ ਪਹੁੰਚਾਏਗਾ ਕਿ ਸੀਮਿਤ ਪਾਬੰਦੀ ਵੀ ਨਹੀਂ ਅਜ਼ਮਾਉਣੀ ਚਾਹੀਦੀ")
    .replace(/ਆਲੇ-ਦੁਆਲੇ ਹਰ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਬਰਬਾਦ ਕਰ ਦੇਵੇਗੀ/g, "ਆਲੇ-ਦੁਆਲੇ ਦੀ ਸਰਗਰਮੀ ਨੂੰ ਇੰਨਾ ਨੁਕਸਾਨ ਪਹੁੰਚਾਏਗੀ ਕਿ ਸੀਮਿਤ ਪਾਬੰਦੀ ਵੀ ਨਹੀਂ ਅਜ਼ਮਾਉਣੀ ਚਾਹੀਦੀ")
    .replace(/ਭਵਿੱਖ ਵਿੱਚ ਹਰ ਕਿਸੇ ਦੇ ਭਵਿੱਖਲੇ ਹਾਜ਼ਰੀ ਵਿਹਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਯਕੀਨੀ ਹੋ ਜਾਵੇਗੀ/g, "ਭਵਿੱਖਲੇ ਹਾਜ਼ਰੀ ਵਿਹਾਰ ਲਈ ਇਸ ਕਦਮ ਨੂੰ ਆਪਣੇ ਆਪ ਵਿੱਚ ਕਾਫ਼ੀ ਮੰਨਿਆ ਜਾਵੇਗਾ")
    .replace(/ਹਰ ਸੰਦਰਭ ਵਿੱਚ ਹਮੇਸ਼ਾਂ ਗਲਤ ਹੈ, ਭਾਵੇਂ ਸਹਿਮਤੀ, ਮਕਸਦ ਜਾਂ ਸੁਰੱਖਿਆ ਉਪਾਅ ਕੁਝ ਵੀ ਹੋਣ/g, "ਪਰਦੇਦਾਰੀ ਦੀ ਚਿੰਤਾ ਕਰਕੇ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਦੀ ਵੱਖਰੀ ਜਾਂਚ ਤੋਂ ਬਿਨਾਂ ਗਲਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ/g, "ਉਹ ਸ਼ਾਇਦ ਨਿਗਰਾਨੀ ਤੋਂ ਬਚਣਾ ਚਾਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਉਸਦੀ ਆਪਤੀ ਨੂੰ ਘੱਟ ਭਾਰ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਇਸ ਦੀ ਵਰਤੋਂ ਹਮੇਸ਼ਾਂ ਨਿਆਂਯੋਗ ਹੋਵੇਗੀ/g, "ਇਸ ਦੀ ਵਰਤੋਂ ਨੂੰ ਵੱਖਰੀ ਲੋੜ ਜਾਂ ਅਨੁਪਾਤਿਕਤਾ ਜਾਂਚ ਤੋਂ ਬਿਨਾਂ ਨਿਆਂਯੋਗ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਦੀ ਹਰ ਘਟਨਾ ਜਾਂ ਤਾਂ ਧੋਖਾਧੜੀ ਹੈ ਜਾਂ ਉਸਨੂੰ ਧੋਖਾਧੜੀ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ਕੇਵਲ ([^।]+?) ਹੀ ਖਾਤੇ ਨੂੰ ਬਚਾ ਸਕਦਾ ਹੈ/g, "ਨੂੰ ਆਪਣੇ ਆਪ ਉੱਚ ਜੋਖਮ ਮੰਨ ਕੇ $1 ਲਾਗੂ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ, ਘੱਟ-ਘਰਸ਼ਣ ਵਾਲੇ ਜੋਖਮ ਕਦਮਾਂ ਦੀ ਤੁਲਨਾ ਕੀਤੇ ਬਿਨਾਂ")
    .replace(/ਜਾਂ ਹਰ ([^।;]+?) ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ ਜਾਂ ([^।;]+?) ਸਦਾ ਲਈ ਬੰਦ ਕਰਨਾ ਪਵੇਗਾ/g, "ਜਾਂ ਵੱਖ-ਵੱਖ $1 ਉੱਤੇ ਕਾਰਵਾਈ ਨਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ ਜਾਂ $2 ਪੱਕੇ ਤੌਰ 'ਤੇ ਬੰਦ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਇੱਕ ([^।]+?) ਦੀ ਸ਼ਿਕਾਇਤ ਹੀ ਸਾਬਤ ਕਰਦੀ ਹੈ ਕਿ ([^।]+?) ਦਾ ਹਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਇੱਕ $1 ਦੀ ਸ਼ਿਕਾਇਤ ਹੀ ਇਹ ਮੰਨਣ ਲਈ ਕਾਫ਼ੀ ਹੈ ਕਿ $2 ਦੀ ਸਮੁੱਚੀ ਨਿਰਪੱਖਤਾ ਪ੍ਰਭਾਵਿਤ ਹੋਈ")
    .replace(/ਸਿਰਫ਼ ਉਸ ਵੇਲੇ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਯਕੀਨੀ ਹੋਵੇ/g, "ਨੂੰ ਦੋਸ਼ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਸਿਰਫ਼ ਤਦ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ/g, "ਨੂੰ ਦੋਸ਼ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਸਥਾਈ ਜਾਮ ਜ਼ਰੂਰ ਹੋ ਜਾਵੇਗਾ/g, "ਗੰਭੀਰ ਸ਼ਹਿਰ-ਵਿਆਪੀ ਜਾਮ ਮੰਨ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ, ਵਿਕਲਪੀ ਰੂਟ ਸਮਰੱਥਾ ਜਾਂਚੇ ਬਿਨਾਂ")
    .replace(/ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ/g, "ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਉੱਤੇ ਵੀ ਕਾਰਵਾਈ ਦਾ ਆਧਾਰ ਬਹੁਤ ਕਮਜ਼ੋਰ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਹਮੇਸ਼ਾਂ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਵਿਹਾਰ ਨੂੰ ਸਾਬਤ ਕਰ ਦਿੰਦਾ ਹੈ/g, "ਨੂੰ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਵਿਹਾਰ ਦਾ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨਣਾ ਚਾਹੀਦਾ ਹੈ");

  if (hasPunjabiCue(next)) {
    next = next
      .replace(/ਹਮੇਸ਼ਾ|ਹਮੇਸ਼ਾ/g, "ਆਮ ਤੌਰ 'ਤੇ")
      .replace(/ਕਦੇ ਨਹੀਂ/g, "ਬਹੁਤ ਘੱਟ")
      .replace(/\bਹਰ\b/g, "ਜ਼ਿਆਦਾਤਰ")
      .replace(/\bਸਾਰੇ\b|\bਸਾਰੀ\b/g, "ਜ਼ਿਆਦਾਤਰ")
      .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ/g, "ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ")
      .replace(/ਅਸੰਭਵ/g, "ਅਮਲ ਵਿੱਚ ਬਹੁਤ ਔਖਾ")
      .replace(/ਆਪਣੇ ਆਪ/g, "ਬਿਨਾਂ ਕਿਸੇ ਹੋਰ ਕਦਮ ਦੇ")
      .replace(/ਸਿਰਫ਼ ਉਸ ਵੇਲੇ|ਸਿਰਫ਼ ਤਦ/g, "ਮੁੱਖ ਤੌਰ 'ਤੇ ਤਦ")
      .replace(/ਜ਼ਰੂਰ|ਜ਼ਰੂਰ/g, "ਸੰਭਵਤ:")
      .replace(/ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ/g, "ਇਹ ਮੰਨਣ ਲਈ ਕਾਫ਼ੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ ਕਿ")
      .replace(/ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ/g, "ਇਸਨੂੰ ਕਾਫ਼ੀ ਮੰਨ ਲਿਆ ਜਾਵੇਗਾ");
  }

  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ|ਇੱਕ ਗਾਹਕ|ਇੱਕ ਨਾਕਾਮੀ/.test(argument)) {
    reason = "ਇੱਕ ਨਾਕਾਮੀ ਜਾਂ ਇੱਕ ਘਟਨਾ ਤੋਂ ਪੂਰੇ ਕੰਟਰੋਲ ਜਾਂ ਸਾਰੇ ਵਾਜਬ ਵਰਤੋਂਕਾਰਾਂ ਬਾਰੇ ਵਿਆਪਕ ਨਤੀਜਾ ਨਹੀਂ ਕੱਢਿਆ ਜਾ ਸਕਦਾ।";
  } else if (/ਆਧੁਨਿਕ|ਡਿਜ਼ਿਟਲ/.test(argument)) {
    reason = "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ/ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।";
  } else if (/ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਰਿਪੋਰਟ|ਸੰਕੇਤ/.test(argument)) {
    reason = "ਸ਼ਿਕਾਇਤ, ਦੋਸ਼ ਜਾਂ ਜੋਖਮ-ਸੰਕੇਤ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ ਹੁੰਦਾ; ਕਾਰਵਾਈ ਲਈ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਪ੍ਰਕਿਰਿਆ ਚਾਹੀਦੀ ਹੈ।";
  } else if (/ਡੈਸਕਟਾਪ|ਸਮਾਂ-ਸਲਾਟ|ਸਲਾਟ/.test(argument)) {
    reason = "ਇਹ ਸਹਾਇਤਾ, ਮੋਬਾਈਲ ਜਾਂ ਵਾਕ-ਇਨ ਵਿਕਲਪ ਵੇਖੇ ਬਿਨਾਂ ਡੈਸਕਟਾਪ ਪਹੁੰਚ ਨੂੰ ਲਾਜ਼ਮੀ ਲਾਗੂ ਕਰਨ ਦੀ ਸ਼ਰਤ ਮੰਨ ਲੈਂਦਾ ਹੈ।";
  }

  return Object.freeze({ argument: next, reason });
}

function rewriteWeak(argument: string, language: Language): Rewrite {
  if (language === "hi") return rewriteHindi(argument);
  if (language === "pa") return rewritePunjabi(argument);
  return rewriteEnglish(argument);
}

function explanationPrefixes(language: Language, count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} `;
    if (language === "pa") return `ਦਲੀਲ ${label} `;
    return `Argument ${label} `;
  });
}

function extractReasons(question: Question, language: Language, count: number): string[] | undefined {
  const explanation = text(question.explanation);
  const prefixes = explanationPrefixes(language, count);
  const reasons: string[] = [];
  for (let index = 0; index < prefixes.length; index += 1) {
    const start = explanation.indexOf(prefixes[index]!);
    if (start < 0) return undefined;
    const colon = explanation.indexOf(": ", start);
    if (colon < 0) return undefined;
    const nextPrefix = prefixes[index + 1];
    const end = nextPrefix ? explanation.indexOf(nextPrefix, colon + 2) : explanation.length;
    reasons.push(explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim());
  }
  return reasons;
}

function formatExplanation(language: Language, strengths: readonly Strength[], reasons: readonly string[]): string {
  return reasons.map((reason, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} ${strengths[index] === "STRONG" ? "मजबूत" : "कमजोर"} है: ${reason}`;
    if (language === "pa") return `ਦਲੀਲ ${label} ${strengths[index] === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${reason}`;
    return `Argument ${label} is ${strengths[index]!.toLowerCase()}: ${reason}`;
  }).join(" ");
}

function stemFor(question: Question, language: Language, argumentsList: readonly string[]): string {
  const statement = text(question.statement);
  if (language === "hi") return `कथन: ${statement}\nतर्क:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
  if (language === "pa") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
  return `Statement: ${statement}\nArguments:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function debiasArgCp015AnswerCues(question: Question): Question {
  const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (argumentsList.length < 2 || argumentsList.length > 4) return question;
  const strengths = strengthsOf(question, argumentsList.length);
  if (!strengths) return question;
  const language = languageOf(question);
  const reasons = extractReasons(question, language, argumentsList.length);
  if (!reasons) return question;

  const nextArguments = [...argumentsList];
  const nextReasons = [...reasons];
  const changedIndices: number[] = [];

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = text(argumentsList[index]);
    if (strengths[index] !== "WEAK" || !hasCue(argument, language)) continue;
    const rewritten = rewriteWeak(argument, language);
    if (rewritten.argument === argument) continue;
    nextArguments[index] = rewritten.argument;
    nextReasons[index] = rewritten.reason;
    changedIndices.push(index);
  }

  if (changedIndices.length === 0) return question;

  const frozenArguments = Object.freeze(nextArguments);
  const explanation = formatExplanation(language, strengths, nextReasons);
  const stem = stemFor(question, language, frozenArguments);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
    question.qlId,
    question.templateId,
    question.examProfile,
    question.difficulty,
    question.locale,
    question.statement,
    frozenArguments,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    arguments: frozenArguments,
    explanation,
    stem,
    text: stem,
    antiGamingCueDebiasAuthority: ARG_CP015_ANTI_GAMING_CUE_DEBIAS_AUTHORITY,
    cueDebiasedArgumentIndices: Object.freeze(changedIndices),
    contentFingerprint,
    questionId: `ARG-001:${question.qlId}:${text(question.examProfile) || "core"}:CP015:${contentFingerprint.slice(0, 20)}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:CUE-DEBIAS`,
    diversitySourceMode: "CP015_EDITORIAL_SURFACE_WITH_ANTI_GAMING_CUE_DEBIAS" as const,
  });
}
