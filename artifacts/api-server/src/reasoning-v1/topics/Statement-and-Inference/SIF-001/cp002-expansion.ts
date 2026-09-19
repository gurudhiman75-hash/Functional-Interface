import type { SifAnswerClass, SifContextDomain, SifDifficulty, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

type L = readonly [string, string, string];
type ContextRow = readonly [id: string, domain: SifContextDomain, a: L, b: L, c: L];
const t = ([en, hi, pa]: L): SifLocalizedText => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
const guard = { evaluatesSupport: true, assumptionQuestion: false, conclusionQuestion: false, argumentQuestion: false, causeEffectQuestion: false, courseOfActionQuestion: false } as const;

function make(input: { id: string; domain: SifContextDomain; difficulty: SifDifficulty; answer: SifAnswerClass; statement: L; first: L; second: L; explanation: L }): SifScenarioAuthority {
  const firstFollows = input.answer === "ONLY_I" || input.answer === "BOTH";
  const secondFollows = input.answer === "ONLY_II" || input.answer === "BOTH";
  return {
    id: input.id, cpId: "SIF-CP002", difficulty: input.difficulty, domain: input.domain, mechanisms: ["DUAL_EVALUATION"], statement: t(input.statement), facts: [{ id: "F1", text: t(input.statement) }],
    candidates: [
      { id: "I", text: t(input.first), follows: firstFollows, strength: firstFollows ? "CERTAIN" : "POSSIBLE_ONLY", supportFactIds: ["F1"], ...(!firstFollows && input.answer !== "EITHER" ? { distractorType: "UNSUPPORTED_DETAIL" as const } : {}) },
      { id: "II", text: t(input.second), follows: secondFollows, strength: secondFollows ? "CERTAIN" : "POSSIBLE_ONLY", supportFactIds: ["F1"], ...(!secondFollows && input.answer !== "EITHER" ? { distractorType: "UNSUPPORTED_DETAIL" as const } : {}) },
    ], explanation: t(input.explanation), identityGuard: guard,
  };
}

const onlyIRows: readonly ContextRow[] = [
  ["TRAINING", "WORKPLACE", ["new employee", "नए कर्मचारी", "ਨਵੇਂ ਕਰਮਚਾਰੀ"], ["the safety orientation", "सुरक्षा परिचय सत्र", "ਸੁਰੱਖਿਆ ਜਾਣ-ਪਛਾਣ ਸੈਸ਼ਨ"], ["the optional software demonstration", "वैकल्पिक सॉफ्टवेयर प्रदर्शन", "ਚੋਣਵੇਂ ਸਾਫਟਵੇਅਰ ਪ੍ਰਦਰਸ਼ਨ"]],
  ["REGISTRATION", "EDUCATION", ["registered learner", "पंजीकृत शिक्षार्थी", "ਰਜਿਸਟਰ ਸਿਖਿਆਰਥੀ"], ["the basic assessment", "मूल्यांकन की आधारभूत परीक्षा", "ਮੁੱਢਲਾ ਮੁਲਾਂਕਣ"], ["the advanced workshop", "उन्नत कार्यशाला", "ਉੱਚ ਵਰਕਸ਼ਾਪ"]],
  ["VERIFICATION", "BANKING", ["selected account", "चयनित खाते", "ਚੁਣੇ ਖਾਤੇ"], ["the identity verification", "पहचान सत्यापन", "ਪਛਾਣ ਤਸਦੀਕ"] , ["the mobile-banking trial", "मोबाइल बैंकिंग परीक्षण", "ਮੋਬਾਈਲ ਬੈਂਕਿੰਗ ਟ੍ਰਾਇਲ"]],
  ["INSPECTION", "BUSINESS", ["listed machine", "सूचीबद्ध मशीन", "ਸੂਚੀਬੱਧ ਮਸ਼ੀਨ"], ["the safety inspection", "सुरक्षा निरीक्षण", "ਸੁਰੱਖਿਆ ਜਾਂਚ"], ["the efficiency test", "दक्षता परीक्षण", "ਕਾਰਗੁਜ਼ਾਰੀ ਜਾਂਚ"]],
  ["BRIEFING", "TRANSPORT", ["route supervisor", "मार्ग पर्यवेक्षक", "ਰੂਟ ਨਿਗਰਾਨ"], ["the morning briefing", "सुबह की ब्रीफिंग", "ਸਵੇਰ ਦੀ ਜਾਣਕਾਰੀ ਮੀਟਿੰਗ"], ["the optional depot tour", "वैकल्पिक डिपो दौरा", "ਚੋਣਵਾਂ ਡਿਪੂ ਦੌਰਾ"]],
  ["FILING", "PUBLIC_ADMINISTRATION", ["received application", "प्राप्त आवेदन", "ਮਿਲੀ ਅਰਜ਼ੀ"], ["the preliminary check", "प्रारंभिक जांच", "ਮੁੱਢਲੀ ਜਾਂਚ"], ["the same-day decision stage", "उसी दिन निर्णय चरण", "ਉਸੇ ਦਿਨ ਫ਼ੈਸਲਾ ਪੜਾਅ"]],
  ["MEMBERSHIP", "EVERYDAY", ["new member", "नए सदस्य", "ਨਵੇਂ ਮੈਂਬਰ"], ["the introductory session", "परिचय सत्र", "ਜਾਣ-ਪਛਾਣ ਸੈਸ਼ਨ"], ["the weekend activity", "सप्ताहांत गतिविधि", "ਹਫ਼ਤੇ-ਅੰਤ ਸਰਗਰਮੀ"]],
  ["QUALITY", "BUSINESS", ["production batch", "उत्पादन बैच", "ਉਤਪਾਦਨ ਬੈਚ"], ["the quality check", "गुणवत्ता जांच", "ਗੁਣਵੱਤਾ ਜਾਂਚ"], ["the export review", "निर्यात समीक्षा", "ਨਿਰਯਾਤ ਸਮੀਖਿਆ"]],
  ["INDUCTION", "WORKPLACE", ["intern", "प्रशिक्षु", "ਇੰਟਰਨ"], ["the induction programme", "परिचय कार्यक्रम", "ਜਾਣ-ਪਛਾਣ ਪ੍ਰੋਗਰਾਮ"], ["the voluntary field visit", "स्वैच्छिक क्षेत्र दौरा", "ਸਵੈਛਿਕ ਫੀਲਡ ਦੌਰਾ"]],
];

const onlyI = onlyIRows.map(([id, domain, member, required, optional]) => make({ id: `SIF-CP002-ONLY-I-${id}`, domain, difficulty: "EASY", answer: "ONLY_I",
  statement: [`For every ${member[0]}, ${required[0]} was completed. Some also went through ${optional[0]}.`, `हर ${member[1]} के लिए ${required[1]} पूरा किया गया। कुछ के लिए ${optional[1]} भी हुआ।`, `ਹਰ ${member[2]} ਲਈ ${required[2]} ਪੂਰਾ ਕੀਤਾ ਗਿਆ। ਕੁਝ ਲਈ ${optional[2]} ਵੀ ਹੋਇਆ।`],
  first: [`Every ${member[0]} went through ${required[0]}.`, `हर ${member[1]} के लिए ${required[1]} पूरा हुआ।`, `ਹਰ ${member[2]} ਲਈ ${required[2]} ਪੂਰਾ ਹੋਇਆ।`],
  second: [`The optional stage covered most of them.`, `वैकल्पिक चरण उनमें से अधिकांश के लिए हुआ।`, `ਚੋਣਵਾਂ ਪੜਾਅ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ ਜ਼ਿਆਦਾਤਰ ਲਈ ਹੋਇਆ।`],
  explanation: [`“Every” supports Inference I. “Some” does not establish “most”, so Inference II does not follow. Therefore, only I follows.`, `“हर” से अनुमान I सही होता है। “कुछ” से “अधिकांश” सिद्ध नहीं होता, इसलिए अनुमान II सही नहीं है। अतः केवल I सही है।`, `“ਹਰ” ਤੋਂ ਅਨੁਮਾਨ I ਸਹੀ ਹੁੰਦਾ ਹੈ। “ਕੁਝ” ਤੋਂ “ਜ਼ਿਆਦਾਤਰ” ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਅਨੁਮਾਨ II ਸਹੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ I ਸਹੀ ਹੈ।`] }));

const sequenceRows: readonly ContextRow[] = [
  ["ROAD-CHECK", "TRANSPORT", ["the morning bus left", "सुबह की बस रवाना हुई", "ਸਵੇਰ ਦੀ ਬੱਸ ਚੱਲੀ"], ["the road check began", "सड़क जांच शुरू हुई", "ਸੜਕ ਜਾਂਚ ਸ਼ੁਰੂ ਹੋਈ"], ["the evening bus left", "शाम की बस रवाना हुई", "ਸ਼ਾਮ ਦੀ ਬੱਸ ਚੱਲੀ"]],
  ["FILE-REVIEW", "PUBLIC_ADMINISTRATION", ["the application was received", "आवेदन प्राप्त हुआ", "ਅਰਜ਼ੀ ਮਿਲੀ"], ["the document review began", "दस्तावेज समीक्षा शुरू हुई", "ਦਸਤਾਵੇਜ਼ ਸਮੀਖਿਆ ਸ਼ੁਰੂ ਹੋਈ"], ["the verification note was issued", "सत्यापन टिप्पणी जारी हुई", "ਤਸਦੀਕ ਟਿੱਪਣੀ ਜਾਰੀ ਹੋਈ"]],
  ["ACCOUNT-AUDIT", "BANKING", ["the cash counter closed", "नकद काउंटर बंद हुआ", "ਨਕਦ ਕਾਊਂਟਰ ਬੰਦ ਹੋਇਆ"], ["the daily audit began", "दैनिक ऑडिट शुरू हुआ", "ਰੋਜ਼ਾਨਾ ਆਡਿਟ ਸ਼ੁਰੂ ਹੋਇਆ"], ["the audit report was signed", "ऑडिट रिपोर्ट पर हस्ताक्षर हुए", "ਆਡਿਟ ਰਿਪੋਰਟ ਉੱਤੇ ਦਸਤਖ਼ਤ ਹੋਏ"]],
  ["RESULT-PROCESS", "EDUCATION", ["the examination ended", "परीक्षा समाप्त हुई", "ਪ੍ਰੀਖਿਆ ਮੁੱਕੀ"], ["answer-sheet checking began", "उत्तर-पुस्तिका जांच शुरू हुई", "ਉੱਤਰ-ਪੱਤਰੀ ਜਾਂਚ ਸ਼ੁਰੂ ਹੋਈ"], ["the result was published", "परिणाम प्रकाशित हुआ", "ਨਤੀਜਾ ਜਾਰੀ ਹੋਇਆ"]],
  ["ORDER-PROCESS", "BUSINESS", ["the order was confirmed", "ऑर्डर की पुष्टि हुई", "ਆਰਡਰ ਦੀ ਪੁਸ਼ਟੀ ਹੋਈ"], ["packing began", "पैकिंग शुरू हुई", "ਪੈਕਿੰਗ ਸ਼ੁਰੂ ਹੋਈ"], ["the parcel was dispatched", "पार्सल भेजा गया", "ਪਾਰਸਲ ਭੇਜਿਆ ਗਿਆ"]],
  ["SHIFT-HANDOVER", "WORKPLACE", ["the day shift ended", "दिन की पाली समाप्त हुई", "ਦਿਨ ਦੀ ਸ਼ਿਫਟ ਮੁੱਕੀ"], ["the handover meeting began", "कार्य-हस्तांतरण बैठक शुरू हुई", "ਕੰਮ-ਹਵਾਲਗੀ ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਹੋਈ"], ["the night shift started", "रात की पाली शुरू हुई", "ਰਾਤ ਦੀ ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਹੋਈ"]],
  ["CLINIC-FLOW", "EVERYDAY", ["registration closed", "पंजीकरण बंद हुआ", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਬੰਦ ਹੋਈ"], ["consultation began", "परामर्श शुरू हुआ", "ਸਲਾਹ ਸ਼ੁਰੂ ਹੋਈ"], ["the pharmacy counter opened", "दवा काउंटर खुला", "ਦਵਾਈ ਕਾਊਂਟਰ ਖੁੱਲ੍ਹਿਆ"]],
  ["WAREHOUSE-FLOW", "BUSINESS", ["the stock count ended", "स्टॉक गणना समाप्त हुई", "ਸਟਾਕ ਗਿਣਤੀ ਮੁੱਕੀ"], ["reconciliation began", "मिलान शुरू हुआ", "ਮਿਲਾਨ ਸ਼ੁਰੂ ਹੋਇਆ"], ["the final stock note was issued", "अंतिम स्टॉक टिप्पणी जारी हुई", "ਅੰਤਿਮ ਸਟਾਕ ਟਿੱਪਣੀ ਜਾਰੀ ਹੋਈ"]],
  ["TRAINING-FLOW", "WORKPLACE", ["the lecture ended", "व्याख्यान समाप्त हुआ", "ਲੈਕਚਰ ਮੁੱਕਿਆ"], ["the assessment began", "मूल्यांकन शुरू हुआ", "ਮੁਲਾਂਕਣ ਸ਼ੁਰੂ ਹੋਇਆ"], ["certificates were distributed", "प्रमाणपत्र बांटे गए", "ਸਰਟੀਫਿਕੇਟ ਵੰਡੇ ਗਏ"]],
];

const onlyII = sequenceRows.map(([id, domain, firstEvent, middleEvent, lastEvent]) => make({ id: `SIF-CP002-ONLY-II-${id}`, domain, difficulty: "MEDIUM", answer: "ONLY_II",
  statement: [`First, ${firstEvent[0]}. After that, ${middleEvent[0]}; later, ${lastEvent[0]}.`, `पहले ${firstEvent[1]}। उसके बाद ${middleEvent[1]} और बाद में ${lastEvent[1]}।`, `ਪਹਿਲਾਂ ${firstEvent[2]}। ਉਸ ਤੋਂ ਬਾਅਦ ${middleEvent[2]} ਅਤੇ ਫਿਰ ${lastEvent[2]}।`],
  first: ["The first event occurred because of the second event.", "पहली घटना दूसरी घटना के कारण हुई।", "ਪਹਿਲੀ ਘਟਨਾ ਦੂਜੀ ਘਟਨਾ ਕਾਰਨ ਹੋਈ।"],
  second: ["The third event occurred after the second event.", "तीसरी घटना दूसरी घटना के बाद हुई।", "ਤੀਜੀ ਘਟਨਾ ਦੂਜੀ ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਹੋਈ।"],
  explanation: [`The stated order directly supports Inference II. A later event cannot be inferred to have caused an earlier one, so Inference I does not follow. Therefore, only II follows.`, `दिया गया क्रम सीधे अनुमान II का समर्थन करता है। बाद की घटना को पहली घटना का कारण नहीं माना जा सकता, इसलिए अनुमान I सही नहीं है। अतः केवल II सही है।`, `ਦਿੱਤਾ ਕ੍ਰਮ ਸਿੱਧਾ ਅਨੁਮਾਨ II ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ। ਬਾਅਦ ਦੀ ਘਟਨਾ ਨੂੰ ਪਹਿਲੀ ਘਟਨਾ ਦਾ ਕਾਰਨ ਨਹੀਂ ਮੰਨਿਆ ਜਾ ਸਕਦਾ, ਇਸ ਲਈ ਅਨੁਮਾਨ I ਸਹੀ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਕੇਵਲ II ਸਹੀ ਹੈ।`] }));

const bothRows: readonly [string, SifContextDomain, number, number, L][] = [
  ["SURVEY", "SURVEY", 320, 180, ["customers", "ग्राहकों", "ਗਾਹਕਾਂ"]], ["APPLICATIONS", "PUBLIC_ADMINISTRATION", 275, 125, ["applications", "आवेदनों", "ਅਰਜ਼ੀਆਂ"]], ["PAYMENTS", "BANKING", 360, 140, ["payments", "भुगतानों", "ਭੁਗਤਾਨਾਂ"]], ["STUDENTS", "EDUCATION", 290, 210, ["students", "विद्यार्थियों", "ਵਿਦਿਆਰਥੀਆਂ"]], ["ORDERS", "BUSINESS", 340, 160, ["orders", "ऑर्डरों", "ਆਰਡਰਾਂ"]], ["EMPLOYEES", "WORKPLACE", 260, 240, ["employees", "कर्मचारियों", "ਕਰਮਚਾਰੀਆਂ"]], ["PASSENGERS", "TRANSPORT", 310, 190, ["passengers", "यात्रियों", "ਯਾਤਰੀਆਂ"]], ["MEMBERS", "EVERYDAY", 280, 220, ["members", "सदस्यों", "ਮੈਂਬਰਾਂ"]], ["RESPONSES", "SURVEY", 350, 150, ["responses", "प्रतिक्रियाओं", "ਜਵਾਬਾਂ"]],
];

const both = bothRows.map(([id, domain, first, second, people]) => make({ id: `SIF-CP002-BOTH-${id}`, domain, difficulty: "EASY", answer: "BOTH",
  statement: [`Of 500 ${people[0]}, ${first} were recorded in the first category and ${second} in the second category.`, `500 ${people[1]} में से ${first} पहली श्रेणी और ${second} दूसरी श्रेणी में दर्ज थे।`, `500 ${people[2]} ਵਿੱਚੋਂ ${first} ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਅਤੇ ${second} ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਦਰਜ ਸਨ।`],
  first: ["The first category contained more entries than the second.", "पहली श्रेणी में दूसरी श्रेणी से अधिक प्रविष्टियां थीं।", "ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਨਾਲੋਂ ਵੱਧ ਦਰਜਾਂ ਸਨ।"],
  second: [`The second category contained fewer than ${second + 25} entries.`, `दूसरी श्रेणी में ${second + 25} से कम प्रविष्टियां थीं।`, `ਦੂਜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ${second + 25} ਤੋਂ ਘੱਟ ਦਰਜਾਂ ਸਨ।`],
  explanation: [`Since ${first} is greater than ${second}, I follows. Since ${second} is below ${second + 25}, II also follows. Therefore, both I and II follow.`, `${first}, ${second} से अधिक है, इसलिए I सही है। ${second}, ${second + 25} से कम है, इसलिए II भी सही है। अतः दोनों सही हैं।`, `${first}, ${second} ਨਾਲੋਂ ਵੱਧ ਹੈ, ਇਸ ਲਈ I ਸਹੀ ਹੈ। ${second}, ${second + 25} ਤੋਂ ਘੱਟ ਹੈ, ਇਸ ਲਈ II ਵੀ ਸਹੀ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਸਹੀ ਹਨ।`] }));

const neitherRows: readonly ContextRow[] = [
  ["BRANCH-WAIT", "BANKING", ["customers", "ग्राहकों", "ਗਾਹਕਾਂ"], ["one branch", "एक शाखा", "ਇੱਕ ਸ਼ਾਖਾ"], ["long waiting times", "लंबे प्रतीक्षा समय", "ਲੰਮੇ ਉਡੀਕ ਸਮੇਂ"]],
  ["CLASSROOM-LIGHT", "EDUCATION", ["students", "विद्यार्थियों", "ਵਿਦਿਆਰਥੀਆਂ"], ["one classroom", "एक कक्षा", "ਇੱਕ ਕਲਾਸਰੂਮ"], ["poor lighting", "कम रोशनी", "ਘੱਟ ਰੌਸ਼ਨੀ"]],
  ["OFFICE-NETWORK", "WORKPLACE", ["employees", "कर्मचारियों", "ਕਰਮਚਾਰੀਆਂ"], ["one office floor", "एक कार्यालय तल", "ਇੱਕ ਦਫ਼ਤਰੀ ਮੰਜ਼ਿਲ"], ["a slow network", "धीमे नेटवर्क", "ਹੌਲੇ ਨੈੱਟਵਰਕ"]],
  ["ROUTE-DELAY", "TRANSPORT", ["passengers", "यात्रियों", "ਯਾਤਰੀਆਂ"], ["one bus route", "एक बस मार्ग", "ਇੱਕ ਬੱਸ ਰੂਟ"], ["a delay", "देरी", "ਦੇਰੀ"]],
  ["STORE-QUEUE", "BUSINESS", ["shoppers", "खरीदारों", "ਖਰੀਦਦਾਰਾਂ"], ["one store", "एक दुकान", "ਇੱਕ ਦੁਕਾਨ"], ["the billing queue", "बिलिंग कतार", "ਬਿਲਿੰਗ ਕਤਾਰ"]],
  ["COUNTER-FORMS", "PUBLIC_ADMINISTRATION", ["applicants", "आवेदकों", "ਅਰਜ਼ੀਕਾਰਾਂ"], ["one service counter", "एक सेवा काउंटर", "ਇੱਕ ਸੇਵਾ ਕਾਊਂਟਰ"], ["form availability", "फॉर्म उपलब्धता", "ਫਾਰਮ ਉਪਲਬਧਤਾ"]],
  ["CLINIC-SEATING", "EVERYDAY", ["visitors", "आगंतुकों", "ਮੁਲਾਕਾਤੀਆਂ"], ["one clinic", "एक क्लिनिक", "ਇੱਕ ਕਲੀਨਿਕ"], ["limited seating", "सीमित बैठने की जगह", "ਘੱਟ ਬੈਠਣ ਦੀ ਥਾਂ"]],
  ["WAREHOUSE-SCANNER", "BUSINESS", ["workers", "कर्मचारियों", "ਕਰਮਚਾਰੀਆਂ"], ["one warehouse section", "एक गोदाम अनुभाग", "ਇੱਕ ਗੋਦਾਮ ਸ਼ਾਖਾ"], ["a faulty scanner", "खराब स्कैनर", "ਖਰਾਬ ਸਕੈਨਰ"]],
  ["PORTAL-LOGIN", "EDUCATION", ["users", "उपयोगकर्ताओं", "ਵਰਤੋਂਕਾਰਾਂ"], ["one training portal", "एक प्रशिक्षण पोर्टल", "ਇੱਕ ਸਿਖਲਾਈ ਪੋਰਟਲ"], ["login difficulty", "लॉगिन कठिनाई", "ਲਾਗਇਨ ਮੁਸ਼ਕਲ"]],
];

const neither = neitherRows.map(([id, domain, people, place, issue]) => make({ id: `SIF-CP002-NEITHER-${id}`, domain, difficulty: "MEDIUM", answer: "NEITHER",
  statement: [`At ${place[0]}, several ${people[0]} reported ${issue[0]} on Monday.`, `सोमवार को ${place[1]} में कई ${people[1]} ने ${issue[1]} की शिकायत की।`, `ਸੋਮਵਾਰ ਨੂੰ ${place[2]} ਵਿੱਚ ਕਈ ${people[2]} ਨੇ ${issue[2]} ਬਾਰੇ ਸ਼ਿਕਾਇਤ ਕੀਤੀ।`],
  first: [`All ${people[0]} everywhere faced the same issue.`, `हर स्थान के सभी ${people[1]} को यही समस्या हुई।`, `ਹਰ ਥਾਂ ਦੇ ਸਾਰੇ ${people[2]} ਨੂੰ ਇਹੀ ਸਮੱਸਿਆ ਆਈ।`],
  second: ["The issue is permanently present at that location.", "उस स्थान पर यह समस्या हमेशा रहती है।", "ਉਸ ਥਾਂ ਉੱਤੇ ਇਹ ਸਮੱਸਿਆ ਹਮੇਸ਼ਾਂ ਰਹਿੰਦੀ ਹੈ।"],
  explanation: ["The statement concerns several people at one place on one day. It supports neither a universal claim nor a permanent condition. Therefore, neither I nor II follows.", "कथन एक स्थान पर एक दिन के कुछ लोगों से संबंधित है। इससे न सार्वभौमिक दावा सिद्ध होता है और न स्थायी स्थिति। अतः न I न II सही है।", "ਕਥਨ ਇੱਕ ਥਾਂ ਉੱਤੇ ਇੱਕ ਦਿਨ ਦੇ ਕੁਝ ਲੋਕਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ। ਇਸ ਤੋਂ ਨਾ ਸਰਬਵਿਆਪੀ ਦਾਅਵਾ ਸਾਬਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਨਾ ਸਥਾਈ ਹਾਲਤ। ਇਸ ਲਈ ਨਾ I ਨਾ II ਸਹੀ ਹੈ।"] }));

const eitherRows: readonly [string, SifContextDomain, L, L, L][] = [
  ["COORDINATOR", "EDUCATION", ["Meera", "मीरा", "ਮੀਰਾ"], ["Kavita", "कविता", "ਕਵਿਤਾ"], ["appointed as coordinator", "समन्वयक नियुक्त किया जाएगा", "ਕੋਆਰਡੀਨੇਟਰ ਨਿਯੁਕਤ ਕੀਤਾ ਜਾਵੇਗਾ"]],
  ["SUPERVISOR", "WORKPLACE", ["Arun", "अरुण", "ਅਰੁਣ"], ["Vijay", "विजय", "ਵਿਜੈ"], ["assigned as shift supervisor", "पाली पर्यवेक्षक बनाया जाएगा", "ਸ਼ਿਫਟ ਨਿਗਰਾਨ ਬਣਾਇਆ ਜਾਵੇਗਾ"]],
  ["AUDITOR", "BANKING", ["Team A", "दल A", "ਟੀਮ A"], ["Team B", "दल B", "ਟੀਮ B"], ["selected for the branch audit", "शाखा ऑडिट के लिए चुना जाएगा", "ਸ਼ਾਖਾ ਆਡਿਟ ਲਈ ਚੁਣਿਆ ਜਾਵੇਗਾ"]],
  ["SUPPLIER", "BUSINESS", ["Supplier X", "आपूर्तिकर्ता X", "ਸਪਲਾਇਰ X"], ["Supplier Y", "आपूर्तिकर्ता Y", "ਸਪਲਾਇਰ Y"], ["awarded the supply contract", "आपूर्ति अनुबंध दिया जाएगा", "ਸਪਲਾਈ ਠੇਕਾ ਦਿੱਤਾ ਜਾਵੇਗਾ"]],
  ["ROUTE", "TRANSPORT", ["Route A", "मार्ग A", "ਰੂਟ A"], ["Route B", "मार्ग B", "ਰੂਟ B"], ["used for the trial service", "परीक्षण सेवा के लिए उपयोग होगा", "ਟ੍ਰਾਇਲ ਸੇਵਾ ਲਈ ਵਰਤਿਆ ਜਾਵੇਗਾ"]],
  ["SITE", "PUBLIC_ADMINISTRATION", ["Site P", "स्थल P", "ਸਥਾਨ P"], ["Site Q", "स्थल Q", "ਸਥਾਨ Q"], ["chosen for the service centre", "सेवा केंद्र के लिए चुना जाएगा", "ਸੇਵਾ ਕੇਂਦਰ ਲਈ ਚੁਣਿਆ ਜਾਵੇਗਾ"]],
  ["VENUE", "EVERYDAY", ["Hall 1", "सभागार 1", "ਹਾਲ 1"], ["Hall 2", "सभागार 2", "ਹਾਲ 2"], ["used for the community event", "सामुदायिक कार्यक्रम के लिए उपयोग होगा", "ਭਾਈਚਾਰਕ ਸਮਾਗਮ ਲਈ ਵਰਤਿਆ ਜਾਵੇਗਾ"]],
  ["COURSE", "EDUCATION", ["Course A", "पाठ्यक्रम A", "ਕੋਰਸ A"], ["Course B", "पाठ्यक्रम B", "ਕੋਰਸ B"], ["offered in the evening slot", "शाम के समय में चलाया जाएगा", "ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਵਿੱਚ ਚਲਾਇਆ ਜਾਵੇਗਾ"]],
  ["PROJECT", "WORKPLACE", ["Project M", "परियोजना M", "ਪ੍ਰੋਜੈਕਟ M"], ["Project N", "परियोजना N", "ਪ੍ਰੋਜੈਕਟ N"], ["given priority this month", "इस महीने प्राथमिकता दी जाएगी", "ਇਸ ਮਹੀਨੇ ਤਰਜੀਹ ਦਿੱਤੀ ਜਾਵੇਗੀ"]],
];

const either = eitherRows.map(([id, domain, firstChoice, secondChoice, action]) => make({ id: `SIF-CP002-${id}-EITHER`, domain, difficulty: "HARD", answer: "EITHER",
  statement: [`Exactly one of ${firstChoice[0]} and ${secondChoice[0]} will be ${action[0]}.`, `${firstChoice[1]} और ${secondChoice[1]} में से ठीक एक को ${action[1]}।`, `${firstChoice[2]} ਅਤੇ ${secondChoice[2]} ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਨੂੰ ${action[2]}।`],
  first: [`${firstChoice[0]} will be ${action[0]}.`, `${firstChoice[1]} को ${action[1]}।`, `${firstChoice[2]} ਨੂੰ ${action[2]}।`],
  second: [`${secondChoice[0]} will be ${action[0]}.`, `${secondChoice[1]} को ${action[1]}।`, `${secondChoice[2]} ਨੂੰ ${action[2]}।`],
  explanation: ["The statement guarantees that exactly one of the two alternatives will occur but does not identify which one. Therefore, either I or II follows.", "कथन निश्चित करता है कि दोनों में से ठीक एक विकल्प होगा, लेकिन कौन-सा यह नहीं बताता। अतः या तो I या II सही है।", "ਕਥਨ ਇਹ ਯਕੀਨੀ ਕਰਦਾ ਹੈ ਕਿ ਦੋਵਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਵਿਕਲਪ ਹੋਵੇਗਾ, ਪਰ ਕਿਹੜਾ ਇਹ ਨਹੀਂ ਦੱਸਦਾ। ਇਸ ਲਈ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸਹੀ ਹੈ।"] }));

export const SIF_CP002_EXPANDED_AUTHORITIES: readonly SifScenarioAuthority[] = Array.from({ length: 9 }, (_, index) => [onlyI[index], onlyII[index], both[index], neither[index], either[index]]).flat();
