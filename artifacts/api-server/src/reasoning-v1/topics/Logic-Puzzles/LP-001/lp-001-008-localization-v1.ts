import {
  buildLp001ClueBundles,
  generateLp001BatchStabilizedV4_2,
  generateLp002BatchStabilizedV4_2,
  generateLp003BatchStabilizedV4_2,
  generateLp004BatchStabilizedV4_2,
  generateLp005BatchStabilizedV4_2,
  generateLp006BatchStabilizedV4_2,
  generateLp007BatchStabilizedV4_2,
  generateLp008BatchStabilizedV4_2,
} from "./lp-001-008-stabilized-english-v4-2.ts";
import { LP_001_008_ENGLISH_FREEZE_V1 } from "./lp-001-008-permanent-freeze-v1.ts";

export type Lp001008LocalizedLanguage = "hi" | "pa";

export type Lp001008LocalizedChild = {
  questionId: string;
  qlId: string;
  language: Lp001008LocalizedLanguage;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: string;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
  englishChild: unknown;
};

export type Lp001008LocalizedCaselet = {
  packageId: string;
  checkpointId: string;
  language: Lp001008LocalizedLanguage;
  caseletId: string;
  scenarioProfileId: string;
  difficultyBand: string;
  scenario: string;
  learnerFacingClues: readonly string[];
  children: readonly Lp001008LocalizedChild[];
  englishCaselet: unknown;
};

export const LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_001_008_ENGLISH_FREEZE_V1.authorityId,
  sourceEnglishAuthority: LP_001_008_ENGLISH_FREEZE_V1.approvedSourceAuthority,
  packages: Object.freeze(["LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008"] as const),
  permanentQlIds: LP_001_008_ENGLISH_FREEZE_V1.permanentQlIds,
  supportedLanguages: Object.freeze(["hi", "pa"] as const),
  locales: Object.freeze(["hi-IN", "pa-IN"] as const),
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET" as const,
  explanationContract: "PRESERVE_DEPENDENCY_ORDER_PROGRESSIVE_TABLES_AND_GENUINE_CASES" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
  localizationFreezeStatus: "NOT_FROZEN" as const,
  questionStudioActivation: "NOT_ENABLED_UNTIL_HUMAN_APPROVAL" as const,
});

const DAYS = {
  hi: { Monday: "सोमवार", Tuesday: "मंगलवार", Wednesday: "बुधवार", Thursday: "गुरुवार" },
  pa: { Monday: "ਸੋਮਵਾਰ", Tuesday: "ਮੰਗਲਵਾਰ", Wednesday: "ਬੁੱਧਵਾਰ", Thursday: "ਵੀਰਵਾਰ" },
} as const;

const MONTHS = {
  hi: { January: "जनवरी", February: "फरवरी", March: "मार्च", April: "अप्रैल", May: "मई", June: "जून", July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर" },
  pa: { January: "ਜਨਵਰੀ", February: "ਫ਼ਰਵਰੀ", March: "ਮਾਰਚ", April: "ਅਪ੍ਰੈਲ", May: "ਮਈ", June: "ਜੂਨ", July: "ਜੁਲਾਈ", August: "ਅਗਸਤ", September: "ਸਤੰਬਰ", October: "ਅਕਤੂਬਰ", November: "ਨਵੰਬਰ", December: "ਦਸੰਬਰ" },
} as const;

const CITIES = {
  hi: { Delhi: "दिल्ली", Mumbai: "मुंबई", Kolkata: "कोलकाता", Chennai: "चेन्नई", Hyderabad: "हैदराबाद", Jaipur: "जयपुर", Lucknow: "लखनऊ", Pune: "पुणे", Ahmedabad: "अहमदाबाद", Bhopal: "भोपाल", Chandigarh: "चंडीगढ़", Dehradun: "देहरादून", Guwahati: "गुवाहाटी", Indore: "इंदौर", Kanpur: "कानपुर", Kochi: "कोच्चि", Nagpur: "नागपुर", Patna: "पटना", Ranchi: "रांची", Surat: "सूरत", Bhubaneswar: "भुवनेश्वर", Visakhapatnam: "विशाखापत्तनम", Thiruvananthapuram: "तिरुवनंतपुरम", Coimbatore: "कोयंबटूर" },
  pa: { Delhi: "ਦਿੱਲੀ", Mumbai: "ਮੁੰਬਈ", Kolkata: "ਕੋਲਕਾਤਾ", Chennai: "ਚੇਨਈ", Hyderabad: "ਹੈਦਰਾਬਾਦ", Jaipur: "ਜੈਪੁਰ", Lucknow: "ਲਖਨਊ", Pune: "ਪੁਣੇ", Ahmedabad: "ਅਹਿਮਦਾਬਾਦ", Bhopal: "ਭੋਪਾਲ", Chandigarh: "ਚੰਡੀਗੜ੍ਹ", Dehradun: "ਦੇਹਰਾਦੂਨ", Guwahati: "ਗੁਵਾਹਾਟੀ", Indore: "ਇੰਦੌਰ", Kanpur: "ਕਾਨਪੁਰ", Kochi: "ਕੋਚੀ", Nagpur: "ਨਾਗਪੁਰ", Patna: "ਪਟਨਾ", Ranchi: "ਰਾਂਚੀ", Surat: "ਸੂਰਤ", Bhubaneswar: "ਭੁਵਨੇਸ਼ਵਰ", Visakhapatnam: "ਵਿਸਾਖਾਪਟਨਮ", Thiruvananthapuram: "ਤਿਰੁਵਨੰਤਪੁਰਮ", Coimbatore: "ਕੋਇੰਬਤੂਰ" },
} as const;

const NAMES: Record<Lp001008LocalizedLanguage, Record<string, string>> = {
  hi: {
    Aarav: "आरव", Bhavna: "भावना", Charu: "चारु", Dev: "देव", Ishaan: "ईशान", Ishan: "ईशान", Meera: "मीरा", Nakul: "नकुल", Pallavi: "पल्लवी", Rohan: "रोहन", Simran: "सिमरन", Tanya: "तान्या", Varun: "वरुण", Yash: "यश", Zoya: "ज़ोया", Karan: "करण", Neha: "नेहा", Manav: "मानव", Ritu: "रितु", Sahil: "साहिल", Anika: "अनिका", Kabir: "कबीर", Jasleen: "जसलीन", Mohan: "मोहन", Tara: "तारा",
    Asha: "आशा", Baldev: "बलदेव", Chetan: "चेतन", Deepak: "दीपक", Esha: "ईशा", Farhan: "फरहान", Gita: "गीता", Ananya: "अनन्या", Divya: "दिव्या", Ekta: "एकता", Faisal: "फैसल", Harish: "हरीश", Aman: "अमन", Charan: "चरण", Eklavya: "एकलव्य", Anita: "अनीता", Baljeet: "बलजीत", Chitra: "चित्रा", Kamal: "कमल", Lata: "लता", Mohit: "मोहित", Nisha: "निशा", Omkar: "ओमकार", Bikram: "बिक्रम", Farah: "फराह", Amit: "अमित", Bharat: "भारत", Dimple: "डिंपल", Feroz: "फिरोज़", Arun: "अरुण", Beena: "बीना", Chander: "चंदर", Devika: "देविका", Iqbal: "इकबाल",
    Diya: "दिया", Eshan: "ईशान", Kavya: "काव्या", Gaurav: "गौरव", Meena: "मीना", Pooja: "पूजा", Rakesh: "राकेश", Sneha: "स्नेहा", Priya: "प्रिया", Rahul: "राहुल", Tarun: "तरुण", Jyoti: "ज्योति", Kiran: "किरण", Mona: "मोना", Naveen: "नवीन", Reema: "रीमा", Aditya: "आदित्य", Geeta: "गीता", Nandini: "नंदिनी", Tanvi: "तन्वी", Harsh: "हर्ष", Jatin: "जतिन", Komal: "कोमल", Lokesh: "लोकेश", Namita: "नमिता", Pranav: "प्रणव", Sanya: "सान्या", Chandan: "चंदन", Ira: "इरा", Parth: "पार्थ", Sonal: "सोनल", Dinesh: "दिनेश", Gopal: "गोपाल", Harini: "हरिनी", Irfan: "इरफान", Juhi: "जुही", Kartik: "कार्तिक", Leela: "लीला", Aditi: "अदिति",
  },
  pa: {
    Aarav: "ਆਰਵ", Bhavna: "ਭਾਵਨਾ", Charu: "ਚਾਰੂ", Dev: "ਦੇਵ", Ishaan: "ਈਸ਼ਾਨ", Ishan: "ਈਸ਼ਾਨ", Meera: "ਮੀਰਾ", Nakul: "ਨਕੁਲ", Pallavi: "ਪੱਲਵੀ", Rohan: "ਰੋਹਨ", Simran: "ਸਿਮਰਨ", Tanya: "ਤਾਨਿਆ", Varun: "ਵਰੁਣ", Yash: "ਯਸ਼", Zoya: "ਜ਼ੋਇਆ", Karan: "ਕਰਨ", Neha: "ਨੇਹਾ", Manav: "ਮਾਨਵ", Ritu: "ਰਿਤੂ", Sahil: "ਸਾਹਿਲ", Anika: "ਅਨਿਕਾ", Kabir: "ਕਬੀਰ", Jasleen: "ਜਸਲੀਨ", Mohan: "ਮੋਹਨ", Tara: "ਤਾਰਾ",
    Asha: "ਆਸ਼ਾ", Baldev: "ਬਲਦੇਵ", Chetan: "ਚੇਤਨ", Deepak: "ਦੀਪਕ", Esha: "ਈਸ਼ਾ", Farhan: "ਫਰਹਾਨ", Gita: "ਗੀਤਾ", Ananya: "ਅਨਨਿਆ", Divya: "ਦਿਵਿਆ", Ekta: "ਏਕਤਾ", Faisal: "ਫੈਸਲ", Harish: "ਹਰੀਸ਼", Aman: "ਅਮਨ", Charan: "ਚਰਨ", Eklavya: "ਏਕਲਵਿਆ", Anita: "ਅਨੀਤਾ", Baljeet: "ਬਲਜੀਤ", Chitra: "ਚਿਤਰਾ", Kamal: "ਕਮਲ", Lata: "ਲਤਾ", Mohit: "ਮੋਹਿਤ", Nisha: "ਨਿਸ਼ਾ", Omkar: "ਓਮਕਾਰ", Bikram: "ਬਿਕਰਮ", Farah: "ਫਰਾਹ", Amit: "ਅਮਿਤ", Bharat: "ਭਰਤ", Dimple: "ਡਿੰਪਲ", Feroz: "ਫਿਰੋਜ਼", Arun: "ਅਰੁਣ", Beena: "ਬੀਨਾ", Chander: "ਚੰਦਰ", Devika: "ਦੇਵਿਕਾ", Iqbal: "ਇਕਬਾਲ",
    Diya: "ਦੀਆ", Eshan: "ਈਸ਼ਾਨ", Kavya: "ਕਾਵਿਆ", Gaurav: "ਗੌਰਵ", Meena: "ਮੀਨਾ", Pooja: "ਪੂਜਾ", Rakesh: "ਰਾਕੇਸ਼", Sneha: "ਸਨੇਹਾ", Priya: "ਪ੍ਰਿਆ", Rahul: "ਰਾਹੁਲ", Tarun: "ਤਰੁਣ", Jyoti: "ਜੋਤੀ", Kiran: "ਕਿਰਨ", Mona: "ਮੋਨਾ", Naveen: "ਨਵੀਨ", Reema: "ਰੀਮਾ", Aditya: "ਆਦਿਤਿਆ", Geeta: "ਗੀਤਾ", Nandini: "ਨੰਦਿਨੀ", Tanvi: "ਤਨਵੀ", Harsh: "ਹਰਸ਼", Jatin: "ਜਤਿਨ", Komal: "ਕੋਮਲ", Lokesh: "ਲੋਕੇਸ਼", Namita: "ਨਮਿਤਾ", Pranav: "ਪ੍ਰਣਵ", Sanya: "ਸਾਨਿਆ", Chandan: "ਚੰਦਨ", Ira: "ਇਰਾ", Parth: "ਪਾਰਥ", Sonal: "ਸੋਨਲ", Dinesh: "ਦਿਨੇਸ਼", Gopal: "ਗੋਪਾਲ", Harini: "ਹਰੀਨੀ", Irfan: "ਇਰਫਾਨ", Juhi: "ਜੁਹੀ", Kartik: "ਕਾਰਤਿਕ", Leela: "ਲੀਲਾ", Aditi: "ਅਦਿਤੀ",
  },
};

const TERMS: Record<Lp001008LocalizedLanguage, Record<string, string>> = {
  hi: {
    "Household Survey": "घरेलू सर्वेक्षण", "Community Outreach": "सामुदायिक संपर्क", "Data Review": "डेटा समीक्षा", "Lesson Planning": "पाठ योजना", "Classroom Observation": "कक्षा अवलोकन", "Assessment Review": "मूल्यांकन समीक्षा", "Customer-Service Audit": "ग्राहक सेवा ऑडिट", "Loan-File Audit": "ऋण फाइल ऑडिट", "Compliance Audit": "अनुपालन ऑडिट", "Field Inspection": "मैदानी निरीक्षण", "Public Grievance": "जन शिकायत", "Records Review": "अभिलेख समीक्षा", "Eligibility Check": "पात्रता जांच", "Document Check": "दस्तावेज़ जांच", "Interview Check": "साक्षात्कार जांच", "Household Visits": "घरेलू दौरे", "Community Meetings": "सामुदायिक बैठकें", "Records Compilation": "अभिलेख संकलन", "Student Interviews": "छात्र साक्षात्कार", "Campus Inspection": "परिसर निरीक्षण", "Evidence Analysis": "साक्ष्य विश्लेषण", "Roads and Drainage": "सड़क और जल निकासी", "Parks and Lighting": "पार्क और प्रकाश व्यवस्था", "Budget and Records": "बजट और अभिलेख",
    Branch: "शाखा", Centre: "केंद्र", "Village Health Centre": "ग्राम स्वास्थ्य केंद्र", "Block Hospital": "ब्लॉक अस्पताल", "Community Hall": "सामुदायिक भवन", "Women and Child Centre": "महिला एवं बाल केंद्र", "Government Senior Secondary School": "राजकीय वरिष्ठ माध्यमिक विद्यालय", "Model School": "मॉडल स्कूल", "Girls' School": "बालिका विद्यालय", "College Campus": "कॉलेज परिसर", "Upper Canal": "ऊपरी नहर", "Village Tank": "ग्राम तालाब", "Irrigation Dam": "सिंचाई बांध", "River Outfall": "नदी निकास",
    "first-aid kits": "प्राथमिक उपचार किट", blankets: "कंबल", "water bottles": "पानी की बोतलें", "solar lamps": "सौर लैंप", "ration packets": "राशन पैकेट", "sanitation kits": "स्वच्छता किट", tarpaulins: "तिरपाल", "mathematics papers": "गणित के प्रश्नपत्र", "science projects": "विज्ञान परियोजनाएँ", "history files": "इतिहास फाइलें", "attendance registers": "उपस्थिति रजिस्टर", maps: "मानचित्र", "exam answer sheets": "परीक्षा उत्तर-पुस्तिकाएँ", "sports records": "खेल अभिलेख", "loan files": "ऋण फाइलें", "cash vouchers": "नकद वाउचर", "KYC forms": "केवाईसी फॉर्म", "audit registers": "ऑडिट रजिस्टर", "cheque books": "चेक बुक", "locker records": "लॉकर अभिलेख", "complaint files": "शिकायत फाइलें", "brake shoes": "ब्रेक शू", "signal lamps": "सिग्नल लैंप", "coupling pins": "कपलिंग पिन", "track tools": "ट्रैक औज़ार", "first-aid stock": "प्राथमिक उपचार सामग्री", "cable reels": "केबल रील", "warning flags": "चेतावनी झंडे", "ballot-unit seals": "बैलेट यूनिट सील", "ink bottles": "स्याही की बोतलें", "training manuals": "प्रशिक्षण पुस्तिकाएँ", "voter slips": "मतदाता पर्चियाँ", "stationery kits": "स्टेशनरी किट", "control-unit forms": "कंट्रोल यूनिट फॉर्म", "route maps": "मार्ग मानचित्र", "ORS packets": "ओआरएस पैकेट", vaccines: "टीके", gloves: "दस्ताने", masks: "मास्क", "test strips": "टेस्ट स्ट्रिप", syringes: "सीरिंज", registers: "रजिस्टर",
    "water survey": "जल सर्वेक्षण", "school survey": "विद्यालय सर्वेक्षण", "road survey": "सड़क सर्वेक्षण", "health survey": "स्वास्थ्य सर्वेक्षण", "market survey": "बाज़ार सर्वेक्षण", attendance: "उपस्थिति", "answer-sheet collection": "उत्तर-पुस्तिका संग्रह", "bell duty": "घंटी ड्यूटी", "main gate duty": "मुख्य द्वार ड्यूटी", "room inspection": "कक्ष निरीक्षण", "cash review": "नकद समीक्षा", "loan-file review": "ऋण फाइल समीक्षा", "customer-file review": "ग्राहक फाइल समीक्षा", "locker review": "लॉकर समीक्षा", "complaint review": "शिकायत समीक्षा", registration: "पंजीकरण", "medicine desk": "दवा डेस्क", "child check-up": "बाल जांच", "health education": "स्वास्थ्य शिक्षा", records: "अभिलेख", "signal check": "सिग्नल जांच", "track check": "ट्रैक जांच", "brake check": "ब्रेक जांच", "safety check": "सुरक्षा जांच", "store check": "स्टोर जांच", "road repair": "सड़क मरम्मत", "street-light work": "स्ट्रीट लाइट कार्य", "drain inspection": "नाली निरीक्षण", "park work": "पार्क कार्य", "water-line work": "जल लाइन कार्य",
    Mathematics: "गणित", Reasoning: "रीजनिंग", English: "अंग्रेज़ी", "General Awareness": "सामान्य जागरूकता", "Computer Awareness": "कंप्यूटर जागरूकता", "Quantitative Aptitude": "मात्रात्मक योग्यता", Science: "विज्ञान", "Current Affairs": "समसामयिकी", Assessment: "मूल्यांकन", "Classroom Management": "कक्षा प्रबंधन", "Educational Technology": "शैक्षिक प्रौद्योगिकी", "Child Development": "बाल विकास", "Inclusive Education": "समावेशी शिक्षा", "Language Teaching": "भाषा शिक्षण", "School Leadership": "विद्यालय नेतृत्व", Accounts: "लेखा", Loans: "ऋण", "Customer Service": "ग्राहक सेवा", "Risk Review": "जोखिम समीक्षा", "Cash Management": "नकद प्रबंधन", Compliance: "अनुपालन", "Credit Review": "ऋण समीक्षा", "Digital Banking": "डिजिटल बैंकिंग", Nutrition: "पोषण", "Child Care": "बाल देखभाल", "First Aid": "प्राथमिक उपचार", "Public Health": "जन स्वास्थ्य", Immunisation: "टीकाकरण", "Maternal Health": "मातृ स्वास्थ्य", Sanitation: "स्वच्छता", Water: "जल", Soil: "मृदा", Agriculture: "कृषि", Environment: "पर्यावरण", Climate: "जलवायु", Forests: "वन", Geology: "भूविज्ञान", "Public Policy": "लोक नीति", Signals: "सिग्नल", Track: "ट्रैक", Brakes: "ब्रेक", "Safety Rules": "सुरक्षा नियम", "Electrical Systems": "विद्युत प्रणाली", Operations: "संचालन", Maintenance: "रखरखाव", Communication: "संचार",
    Mango: "आम", Apple: "सेब", Guava: "अमरूद", Kiwi: "कीवी", Orange: "संतरा", Banana: "केला", Grapes: "अंगूर", Papaya: "पपीता", Pear: "नाशपाती", Peach: "आड़ू", "Library Work": "पुस्तकालय कार्य", "Sports Education": "खेल शिक्षा", "Fraud Control": "धोखाधड़ी नियंत्रण", Recovery: "वसूली", "Rural Health": "ग्रामीण स्वास्थ्य", Transport: "परिवहन", Debate: "वाद-विवाद", Drama: "नाटक", Music: "संगीत", Photography: "फोटोग्राफी", Robotics: "रोबोटिक्स", Athletics: "एथलेटिक्स", "Eco Club": "इको क्लब", Library: "पुस्तकालय", Volunteering: "स्वयंसेवा", "Fine Arts": "ललित कला", Payroll: "वेतन प्रणाली", Inventory: "भंडार", Attendance: "उपस्थिति", Procurement: "खरीद", "Help Desk": "सहायता डेस्क", Records: "अभिलेख", "Travel Desk": "यात्रा डेस्क", Billing: "बिलिंग", Security: "सुरक्षा", Scheduling: "समय-निर्धारण",
    Selected: "चयनित", "Not selected": "चयनित नहीं",
  },
  pa: {
    "Household Survey": "ਘਰੇਲੂ ਸਰਵੇਖਣ", "Community Outreach": "ਸਮੁਦਾਇਕ ਸੰਪਰਕ", "Data Review": "ਡਾਟਾ ਸਮੀਖਿਆ", "Lesson Planning": "ਪਾਠ ਯੋਜਨਾ", "Classroom Observation": "ਕਲਾਸ ਅਵਲੋਕਨ", "Assessment Review": "ਮੁਲਾਂਕਣ ਸਮੀਖਿਆ", "Customer-Service Audit": "ਗਾਹਕ ਸੇਵਾ ਆਡਿਟ", "Loan-File Audit": "ਕਰਜ਼ ਫ਼ਾਈਲ ਆਡਿਟ", "Compliance Audit": "ਅਨੁਪਾਲਨਾ ਆਡਿਟ", "Field Inspection": "ਮੈਦਾਨੀ ਜਾਂਚ", "Public Grievance": "ਜਨਤਕ ਸ਼ਿਕਾਇਤ", "Records Review": "ਰਿਕਾਰਡ ਸਮੀਖਿਆ", "Eligibility Check": "ਯੋਗਤਾ ਜਾਂਚ", "Document Check": "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ", "Interview Check": "ਇੰਟਰਵਿਊ ਜਾਂਚ", "Household Visits": "ਘਰੇਲੂ ਦੌਰੇ", "Community Meetings": "ਸਮੁਦਾਇਕ ਮੀਟਿੰਗਾਂ", "Records Compilation": "ਰਿਕਾਰਡ ਸੰਕਲਨ", "Student Interviews": "ਵਿਦਿਆਰਥੀ ਇੰਟਰਵਿਊ", "Campus Inspection": "ਕੈਂਪਸ ਜਾਂਚ", "Evidence Analysis": "ਸਬੂਤ ਵਿਸ਼ਲੇਸ਼ਣ", "Roads and Drainage": "ਸੜਕਾਂ ਅਤੇ ਨਿਕਾਸੀ", "Parks and Lighting": "ਪਾਰਕ ਅਤੇ ਰੋਸ਼ਨੀ", "Budget and Records": "ਬਜਟ ਅਤੇ ਰਿਕਾਰਡ",
    Branch: "ਸ਼ਾਖਾ", Centre: "ਕੇਂਦਰ", "Village Health Centre": "ਪਿੰਡ ਸਿਹਤ ਕੇਂਦਰ", "Block Hospital": "ਬਲਾਕ ਹਸਪਤਾਲ", "Community Hall": "ਕਮਿਊਨਿਟੀ ਹਾਲ", "Women and Child Centre": "ਮਹਿਲਾ ਅਤੇ ਬਾਲ ਕੇਂਦਰ", "Government Senior Secondary School": "ਸਰਕਾਰੀ ਸੀਨੀਅਰ ਸੈਕੰਡਰੀ ਸਕੂਲ", "Model School": "ਮਾਡਲ ਸਕੂਲ", "Girls' School": "ਕੁੜੀਆਂ ਦਾ ਸਕੂਲ", "College Campus": "ਕਾਲਜ ਕੈਂਪਸ", "Upper Canal": "ਉੱਪਰੀ ਨਹਿਰ", "Village Tank": "ਪਿੰਡ ਦਾ ਤਲਾਬ", "Irrigation Dam": "ਸਿੰਚਾਈ ਬੰਧ", "River Outfall": "ਦਰਿਆ ਨਿਕਾਸ",
    "first-aid kits": "ਫਸਟ ਏਡ ਕਿੱਟਾਂ", blankets: "ਕੰਬਲ", "water bottles": "ਪਾਣੀ ਦੀਆਂ ਬੋਤਲਾਂ", "solar lamps": "ਸੋਲਰ ਲੈਂਪ", "ration packets": "ਰਾਸ਼ਨ ਪੈਕਟ", "sanitation kits": "ਸਫ਼ਾਈ ਕਿੱਟਾਂ", tarpaulins: "ਤਰਪਾਲਾਂ", "mathematics papers": "ਗਣਿਤ ਦੇ ਪ੍ਰਸ਼ਨ ਪੱਤਰ", "science projects": "ਵਿਗਿਆਨ ਪ੍ਰੋਜੈਕਟ", "history files": "ਇਤਿਹਾਸ ਫ਼ਾਈਲਾਂ", "attendance registers": "ਹਾਜ਼ਰੀ ਰਜਿਸਟਰ", maps: "ਨਕਸ਼ੇ", "exam answer sheets": "ਪਰੀਖਿਆ ਉੱਤਰ-ਪੱਤਰੀਆਂ", "sports records": "ਖੇਡ ਰਿਕਾਰਡ", "loan files": "ਕਰਜ਼ ਫ਼ਾਈਲਾਂ", "cash vouchers": "ਨਕਦ ਵਾਊਚਰ", "KYC forms": "ਕੇਵਾਈਸੀ ਫਾਰਮ", "audit registers": "ਆਡਿਟ ਰਜਿਸਟਰ", "cheque books": "ਚੈਕ ਬੁੱਕਾਂ", "locker records": "ਲਾਕਰ ਰਿਕਾਰਡ", "complaint files": "ਸ਼ਿਕਾਇਤ ਫ਼ਾਈਲਾਂ", "brake shoes": "ਬ੍ਰੇਕ ਸ਼ੂ", "signal lamps": "ਸਿਗਨਲ ਲੈਂਪ", "coupling pins": "ਕਪਲਿੰਗ ਪਿਨ", "track tools": "ਟਰੈਕ ਔਜ਼ਾਰ", "first-aid stock": "ਫਸਟ ਏਡ ਸਮੱਗਰੀ", "cable reels": "ਕੇਬਲ ਰੀਲਾਂ", "warning flags": "ਚੇਤਾਵਨੀ ਝੰਡੇ", "ballot-unit seals": "ਬੈਲਟ ਯੂਨਿਟ ਸੀਲਾਂ", "ink bottles": "ਸਿਆਹੀ ਦੀਆਂ ਬੋਤਲਾਂ", "training manuals": "ਟ੍ਰੇਨਿੰਗ ਮੈਨੁਅਲ", "voter slips": "ਵੋਟਰ ਸਲਿੱਪਾਂ", "stationery kits": "ਸਟੇਸ਼ਨਰੀ ਕਿੱਟਾਂ", "control-unit forms": "ਕੰਟਰੋਲ ਯੂਨਿਟ ਫਾਰਮ", "route maps": "ਰੂਟ ਨਕਸ਼ੇ", "ORS packets": "ਓਆਰਐਸ ਪੈਕਟ", vaccines: "ਟੀਕੇ", gloves: "ਦਸਤਾਨੇ", masks: "ਮਾਸਕ", "test strips": "ਟੈਸਟ ਸਟ੍ਰਿਪਾਂ", syringes: "ਸਿਰਿੰਜਾਂ", registers: "ਰਜਿਸਟਰ",
    "water survey": "ਪਾਣੀ ਸਰਵੇਖਣ", "school survey": "ਸਕੂਲ ਸਰਵੇਖਣ", "road survey": "ਸੜਕ ਸਰਵੇਖਣ", "health survey": "ਸਿਹਤ ਸਰਵੇਖਣ", "market survey": "ਬਾਜ਼ਾਰ ਸਰਵੇਖਣ", attendance: "ਹਾਜ਼ਰੀ", "answer-sheet collection": "ਉੱਤਰ-ਪੱਤਰੀ ਇਕੱਠ", "bell duty": "ਘੰਟੀ ਡਿਊਟੀ", "main gate duty": "ਮੁੱਖ ਗੇਟ ਡਿਊਟੀ", "room inspection": "ਕਮਰਾ ਜਾਂਚ", "cash review": "ਨਕਦ ਸਮੀਖਿਆ", "loan-file review": "ਕਰਜ਼ ਫ਼ਾਈਲ ਸਮੀਖਿਆ", "customer-file review": "ਗਾਹਕ ਫ਼ਾਈਲ ਸਮੀਖਿਆ", "locker review": "ਲਾਕਰ ਸਮੀਖਿਆ", "complaint review": "ਸ਼ਿਕਾਇਤ ਸਮੀਖਿਆ", registration: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ", "medicine desk": "ਦਵਾਈ ਡੈਸਕ", "child check-up": "ਬੱਚਿਆਂ ਦੀ ਜਾਂਚ", "health education": "ਸਿਹਤ ਸਿੱਖਿਆ", records: "ਰਿਕਾਰਡ", "signal check": "ਸਿਗਨਲ ਜਾਂਚ", "track check": "ਟਰੈਕ ਜਾਂਚ", "brake check": "ਬ੍ਰੇਕ ਜਾਂਚ", "safety check": "ਸੁਰੱਖਿਆ ਜਾਂਚ", "store check": "ਸਟੋਰ ਜਾਂਚ", "road repair": "ਸੜਕ ਮੁਰੰਮਤ", "street-light work": "ਸਟ੍ਰੀਟ ਲਾਈਟ ਕੰਮ", "drain inspection": "ਨਾਲੀ ਜਾਂਚ", "park work": "ਪਾਰਕ ਕੰਮ", "water-line work": "ਪਾਣੀ ਲਾਈਨ ਕੰਮ",
    Mathematics: "ਗਣਿਤ", Reasoning: "ਰੀਜ਼ਨਿੰਗ", English: "ਅੰਗਰੇਜ਼ੀ", "General Awareness": "ਆਮ ਜਾਗਰੂਕਤਾ", "Computer Awareness": "ਕੰਪਿਊਟਰ ਜਾਗਰੂਕਤਾ", "Quantitative Aptitude": "ਗਣਿਤੀ ਯੋਗਤਾ", Science: "ਵਿਗਿਆਨ", "Current Affairs": "ਕਰੰਟ ਅਫੇਅਰਜ਼", Assessment: "ਮੁਲਾਂਕਣ", "Classroom Management": "ਕਲਾਸ ਪ੍ਰਬੰਧਨ", "Educational Technology": "ਸਿੱਖਿਆ ਤਕਨਾਲੋਜੀ", "Child Development": "ਬਾਲ ਵਿਕਾਸ", "Inclusive Education": "ਸਮਾਵੇਸ਼ੀ ਸਿੱਖਿਆ", "Language Teaching": "ਭਾਸ਼ਾ ਅਧਿਆਪਨ", "School Leadership": "ਸਕੂਲ ਨੇਤ੍ਰਿਤਵ", Accounts: "ਲੇਖੇ", Loans: "ਕਰਜ਼", "Customer Service": "ਗਾਹਕ ਸੇਵਾ", "Risk Review": "ਜੋਖਮ ਸਮੀਖਿਆ", "Cash Management": "ਨਕਦ ਪ੍ਰਬੰਧਨ", Compliance: "ਅਨੁਪਾਲਨਾ", "Credit Review": "ਕ੍ਰੈਡਿਟ ਸਮੀਖਿਆ", "Digital Banking": "ਡਿਜ਼ਿਟਲ ਬੈਂਕਿੰਗ", Nutrition: "ਪੋਸ਼ਣ", "Child Care": "ਬਾਲ ਦੇਖਭਾਲ", "First Aid": "ਫਸਟ ਏਡ", "Public Health": "ਜਨ ਸਿਹਤ", Immunisation: "ਟੀਕਾਕਰਨ", "Maternal Health": "ਮਾਤਾ ਸਿਹਤ", Sanitation: "ਸਫ਼ਾਈ", Water: "ਪਾਣੀ", Soil: "ਮਿੱਟੀ", Agriculture: "ਖੇਤੀਬਾੜੀ", Environment: "ਵਾਤਾਵਰਣ", Climate: "ਜਲਵਾਯੂ", Forests: "ਜੰਗਲ", Geology: "ਭੂ-ਵਿਗਿਆਨ", "Public Policy": "ਜਨ ਨੀਤੀ", Signals: "ਸਿਗਨਲ", Track: "ਟਰੈਕ", Brakes: "ਬ੍ਰੇਕ", "Safety Rules": "ਸੁਰੱਖਿਆ ਨਿਯਮ", "Electrical Systems": "ਬਿਜਲੀ ਪ੍ਰਣਾਲੀਆਂ", Operations: "ਸੰਚਾਲਨ", Maintenance: "ਰੱਖ-ਰਖਾਅ", Communication: "ਸੰਚਾਰ",
    Mango: "ਅੰਬ", Apple: "ਸੇਬ", Guava: "ਅਮਰੂਦ", Kiwi: "ਕੀਵੀ", Orange: "ਸੰਤਰਾ", Banana: "ਕੇਲਾ", Grapes: "ਅੰਗੂਰ", Papaya: "ਪਪੀਤਾ", Pear: "ਨਾਸ਼ਪਾਤੀ", Peach: "ਆੜੂ", "Library Work": "ਲਾਇਬ੍ਰੇਰੀ ਕੰਮ", "Sports Education": "ਖੇਡ ਸਿੱਖਿਆ", "Fraud Control": "ਧੋਖਾਧੜੀ ਨਿਯੰਤਰਣ", Recovery: "ਵਸੂਲੀ", "Rural Health": "ਪਿੰਡ ਸਿਹਤ", Transport: "ਆਵਾਜਾਈ", Debate: "ਵਾਦ-ਵਿਵਾਦ", Drama: "ਨਾਟਕ", Music: "ਸੰਗੀਤ", Photography: "ਫੋਟੋਗ੍ਰਾਫੀ", Robotics: "ਰੋਬੋਟਿਕਸ", Athletics: "ਐਥਲੈਟਿਕਸ", "Eco Club": "ਈਕੋ ਕਲੱਬ", Library: "ਲਾਇਬ੍ਰੇਰੀ", Volunteering: "ਸੇਵਾ ਕਾਰਜ", "Fine Arts": "ਲਲਿਤ ਕਲਾ", Payroll: "ਤਨਖਾਹ ਪ੍ਰਣਾਲੀ", Inventory: "ਸਟਾਕ", Attendance: "ਹਾਜ਼ਰੀ", Procurement: "ਖਰੀਦ", "Help Desk": "ਹੈਲਪ ਡੈਸਕ", Records: "ਰਿਕਾਰਡ", "Travel Desk": "ਯਾਤਰਾ ਡੈਸਕ", Billing: "ਬਿਲਿੰਗ", Security: "ਸੁਰੱਖਿਆ", Scheduling: "ਸਮਾਂ-ਸਾਰਣੀ",
    Selected: "ਚੁਣਿਆ", "Not selected": "ਨਹੀਂ ਚੁਣਿਆ",
  },
};

function list(language: Lp001008LocalizedLanguage, values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  const joiner = language === "hi" ? " और " : " ਅਤੇ ";
  return values.length === 2 ? `${values[0]}${joiner}${values[1]}` : `${values.slice(0, -1).join(", ")}${joiner}${values.at(-1)}`;
}

function term(language: Lp001008LocalizedLanguage, value: string): string {
  const trimmed = String(value).trim();
  if (NAMES[language][trimmed]) return NAMES[language][trimmed]!;
  if ((DAYS[language] as Record<string, string>)[trimmed]) return (DAYS[language] as Record<string, string>)[trimmed]!;
  if ((MONTHS[language] as Record<string, string>)[trimmed]) return (MONTHS[language] as Record<string, string>)[trimmed]!;
  if ((CITIES[language] as Record<string, string>)[trimmed]) return (CITIES[language] as Record<string, string>)[trimmed]!;
  if (TERMS[language][trimmed]) return TERMS[language][trimmed]!;
  const cityPlace = trimmed.match(/^(.+) (Branch|Centre)$/u);
  if (cityPlace) return `${term(language, cityPlace[1]!)} ${term(language, cityPlace[2]!)}`;
  const numbered = trimmed.match(/^(Block|Room|Ward) (\d+|[A-E])$/u);
  if (numbered) {
    const noun = numbered[1] === "Block" ? (language === "hi" ? "ब्लॉक" : "ਬਲਾਕ") : numbered[1] === "Room" ? (language === "hi" ? "कक्ष" : "ਕਮਰਾ") : (language === "hi" ? "वार्ड" : "ਵਾਰਡ");
    return `${noun} ${numbered[2]}`;
  }
  const date = trimmed.match(/^(12|27)(?:th)?\s+(.+)$/u);
  if (date) return `${date[1]} ${term(language, date[2]!)}`;
  return trimmed;
}

function replacementMap(language: Lp001008LocalizedLanguage, values: readonly string[]): Map<string, string> {
  return new Map([...new Set(values.filter(Boolean))].map((value) => [value, term(language, value)]));
}

function replaceKnown(text: string, replacements: ReadonlyMap<string, string>): string {
  let output = text;
  for (const [source, target] of [...replacements.entries()].sort((a, b) => b[0].length - a[0].length)) output = output.split(source).join(target);
  return output;
}

function localizeTableLine(language: Lp001008LocalizedLanguage, line: string, replacements: ReadonlyMap<string, string>): string {
  if (!line.trim().startsWith("|")) return line;
  const header: Record<string, [string, string]> = {
    Person: ["व्यक्ति", "ਵਿਅਕਤੀ"], "Panel / group": ["पैनल / समूह", "ਪੈਨਲ / ਸਮੂਹ"], Day: ["दिन", "ਦਿਨ"], Location: ["स्थान", "ਸਥਾਨ"], "Position from bottom": ["नीचे से स्थान", "ਹੇਠਾਂ ਤੋਂ ਸਥਾਨ"], Item: ["वस्तु", "ਵਸਤੂ"], Candidate: ["उम्मीदवार", "ਉਮੀਦਵਾਰ"], Status: ["स्थिति", "ਸਥਿਤੀ"], Duty: ["ड्यूटी", "ਡਿਊਟੀ"], "Study area": ["अध्ययन क्षेत्र", "ਅਧਿਐਨ ਖੇਤਰ"], City: ["शहर", "ਸ਼ਹਿਰ"], "Date and month": ["तारीख और महीना", "ਤਾਰੀਖ ਅਤੇ ਮਹੀਨਾ"], Customer: ["ग्राहक", "ਗਾਹਕ"], Fruit: ["फल", "ਫਲ"], Teacher: ["शिक्षक", "ਅਧਿਆਪਕ"], Module: ["मॉड्यूल", "ਮੋਡੀਊਲ"], Officer: ["अधिकारी", "ਅਧਿਕਾਰੀ"], "Service area": ["सेवा क्षेत्र", "ਸੇਵਾ ਖੇਤਰ"], Researcher: ["शोधकर्ता", "ਖੋਜਕਰਤਾ"], "Study area": ["अध्ययन क्षेत्र", "ਅਧਿਐਨ ਖੇਤਰ"], Student: ["विद्यार्थी", "ਵਿਦਿਆਰਥੀ"], Activity: ["गतिविधि", "ਗਤੀਵਿਧੀ"], Coordinator: ["समन्वयक", "ਕੋਆਰਡੀਨੇਟਰ"], System: ["प्रणाली", "ਸਿਸਟਮ"],
  };
  const parts = line.split("|");
  return parts.map((cell, index) => {
    if (index === 0 || index === parts.length - 1) return cell;
    const paddingLeft = cell.match(/^\s*/u)?.[0] ?? "";
    const paddingRight = cell.match(/\s*$/u)?.[0] ?? "";
    const raw = cell.trim();
    if (/^---+$/u.test(raw)) return cell;
    const translatedHeader = header[raw]?.[language === "hi" ? 0 : 1];
    const translated = translatedHeader ?? term(language, replaceKnown(raw, replacements));
    return `${paddingLeft}${translated}${paddingRight}`;
  }).join("|");
}

function localizeMetaLine(language: Lp001008LocalizedLanguage, input: string, replacements: ReadonlyMap<string, string>, clueMap: ReadonlyMap<string, string>): string {
  let line = input;
  for (const [source, target] of [...clueMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
    line = line.split(source).join(target);
    line = line.split(source.replace(/[.]$/u, "")).join(target.replace(/[।.]$/u, ""));
  }
  line = replaceKnown(line, replacements);
  if (line.trim().startsWith("|")) return localizeTableLine(language, line, replacements);
  if (language === "hi") {
    line = line
      .replace(/\*\*Step (\d+): Complete the arrangement\*\*/gu, "**चरण $1: व्यवस्था पूरी करें**")
      .replace(/\*\*Step (\d+): Answer the question\*\*/gu, "**चरण $1: प्रश्न का उत्तर दें**")
      .replace(/\*\*Step (\d+)\*\*/gu, "**चरण $1**")
      .replace(/\*\*Case 1\*\*/gu, "**स्थिति 1**").replace(/\*\*Case 2\*\*/gu, "**स्थिति 2**")
      .replace(/Start with this clue —/gu, "इस शर्त से शुरू करें —").replace(/Now use this clue —/gu, "अब यह शर्त लें —").replace(/Next take this clue —/gu, "इसके बाद यह शर्त लें —").replace(/Then apply this clue —/gu, "फिर यह शर्त लगाएँ —")
      .replace(/Use these connected clues in this order:/gu, "इन जुड़ी हुई शर्तों को इस क्रम में लें:").replace(/Use these connected clues together —/gu, "इन जुड़ी हुई शर्तों को साथ लें —")
      .replace(/^First:/gu, "पहले:").replace(/^Then:/gu, "फिर:").replace(/; then /gu, "; फिर ")
      .replace(/The table becomes:/gu, "तालिका अब इस प्रकार होगी:").replace(/We can now write:/gu, "अब तालिका में लिख सकते हैं:").replace(/This updates the table to:/gu, "तालिका अब इस प्रकार अपडेट होगी:").replace(/So far, the table is:/gu, "अब तक तालिका इस प्रकार है:")
      .replace(/Only two arrangements are left, so check both cases\./gu, "अब केवल दो व्यवस्थाएँ बचती हैं। दोनों स्थितियाँ देखें।").replace(/The clues now leave two possible arrangements\./gu, "इन शर्तों के बाद दो संभावित व्यवस्थाएँ बचती हैं।").replace(/At this point, only two cases remain\./gu, "इस चरण पर केवल दो स्थितियाँ बचती हैं।").replace(/We are down to two possible cases\./gu, "अब केवल दो संभावित स्थितियाँ बचती हैं।").replace(/Only two arrangements remain, so check both cases\./gu, "अब केवल दो व्यवस्थाएँ बचती हैं। दोनों स्थितियाँ देखें।")
      .replace(/This clue rules out Case 1\. Keep Case 2\./gu, "यह शर्त स्थिति 1 को हटा देती है। स्थिति 2 सही रहती है।").replace(/This clue rules out Case 2\. Keep Case 1\./gu, "यह शर्त स्थिति 2 को हटा देती है। स्थिति 1 सही रहती है।").replace(/This clue removes Case 1\. Keep Case 2\./gu, "यह शर्त स्थिति 1 को हटा देती है। स्थिति 2 रखें।").replace(/This clue removes Case 2\. Keep Case 1\./gu, "यह शर्त स्थिति 2 को हटा देती है। स्थिति 1 रखें।")
      .replace(/The completed table is:/gu, "पूरी तालिका इस प्रकार है:").replace(/So the final arrangement is:/gu, "अंतिम व्यवस्था इस प्रकार है:").replace(/Now the whole table is fixed:/gu, "अब पूरी तालिका तय हो गई है:").replace(/The final table is:/gu, "अंतिम तालिका इस प्रकार है:")
      .replace(/The table becomes:/gu, "तालिका अब इस प्रकार होगी:")
      .replace(/From the completed table, the answer is \*\*(.+)\*\*\./gu, "पूरी तालिका से उत्तर **$1** है।");
  } else {
    line = line
      .replace(/\*\*Step (\d+): Complete the arrangement\*\*/gu, "**ਕਦਮ $1: ਵਿਵਸਥਾ ਪੂਰੀ ਕਰੋ**")
      .replace(/\*\*Step (\d+): Answer the question\*\*/gu, "**ਕਦਮ $1: ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ**")
      .replace(/\*\*Step (\d+)\*\*/gu, "**ਕਦਮ $1**")
      .replace(/\*\*Case 1\*\*/gu, "**ਕੇਸ 1**").replace(/\*\*Case 2\*\*/gu, "**ਕੇਸ 2**")
      .replace(/Start with this clue —/gu, "ਇਸ ਸ਼ਰਤ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ —").replace(/Now use this clue —/gu, "ਹੁਣ ਇਹ ਸ਼ਰਤ ਲਗਾਓ —").replace(/Next take this clue —/gu, "ਅਗਲੀ ਇਹ ਸ਼ਰਤ ਲਵੋ —").replace(/Then apply this clue —/gu, "ਫਿਰ ਇਹ ਸ਼ਰਤ ਲਗਾਓ —")
      .replace(/Use these connected clues in this order:/gu, "ਇਨ੍ਹਾਂ ਜੁੜੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਲਵੋ:").replace(/Use these connected clues together —/gu, "ਇਨ੍ਹਾਂ ਜੁੜੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਇਕੱਠੇ ਲਵੋ —")
      .replace(/^First:/gu, "ਪਹਿਲਾਂ:").replace(/^Then:/gu, "ਫਿਰ:").replace(/; then /gu, "; ਫਿਰ ")
      .replace(/The table becomes:/gu, "ਸਾਰਣੀ ਹੁਣ ਇਸ ਤਰ੍ਹਾਂ ਬਣਦੀ ਹੈ:").replace(/We can now write:/gu, "ਹੁਣ ਸਾਰਣੀ ਵਿੱਚ ਲਿਖ ਸਕਦੇ ਹਾਂ:").replace(/This updates the table to:/gu, "ਸਾਰਣੀ ਹੁਣ ਇਸ ਤਰ੍ਹਾਂ ਅੱਪਡੇਟ ਹੁੰਦੀ ਹੈ:").replace(/So far, the table is:/gu, "ਹੁਣ ਤੱਕ ਸਾਰਣੀ ਇਹ ਹੈ:")
      .replace(/Only two arrangements are left, so check both cases\./gu, "ਹੁਣ ਕੇਵਲ ਦੋ ਵਿਵਸਥਾਵਾਂ ਬਚਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਕੇਸ ਵੇਖੋ।").replace(/The clues now leave two possible arrangements\./gu, "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਤੋਂ ਬਾਅਦ ਦੋ ਸੰਭਵ ਵਿਵਸਥਾਵਾਂ ਬਚਦੀਆਂ ਹਨ।").replace(/At this point, only two cases remain\./gu, "ਇਸ ਮੋੜ 'ਤੇ ਕੇਵਲ ਦੋ ਕੇਸ ਬਚਦੇ ਹਨ।").replace(/We are down to two possible cases\./gu, "ਹੁਣ ਕੇਵਲ ਦੋ ਸੰਭਵ ਕੇਸ ਬਚਦੇ ਹਨ।").replace(/Only two arrangements remain, so check both cases\./gu, "ਹੁਣ ਕੇਵਲ ਦੋ ਵਿਵਸਥਾਵਾਂ ਬਚਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਕੇਸ ਵੇਖੋ।")
      .replace(/This clue rules out Case 1\. Keep Case 2\./gu, "ਇਹ ਸ਼ਰਤ ਕੇਸ 1 ਨੂੰ ਰੱਦ ਕਰਦੀ ਹੈ। ਕੇਸ 2 ਸਹੀ ਰਹਿੰਦਾ ਹੈ।").replace(/This clue rules out Case 2\. Keep Case 1\./gu, "ਇਹ ਸ਼ਰਤ ਕੇਸ 2 ਨੂੰ ਰੱਦ ਕਰਦੀ ਹੈ। ਕੇਸ 1 ਸਹੀ ਰਹਿੰਦਾ ਹੈ।").replace(/This clue removes Case 1\. Keep Case 2\./gu, "ਇਹ ਸ਼ਰਤ ਕੇਸ 1 ਨੂੰ ਹਟਾ ਦਿੰਦੀ ਹੈ। ਕੇਸ 2 ਰੱਖੋ।").replace(/This clue removes Case 2\. Keep Case 1\./gu, "ਇਹ ਸ਼ਰਤ ਕੇਸ 2 ਨੂੰ ਹਟਾ ਦਿੰਦੀ ਹੈ। ਕੇਸ 1 ਰੱਖੋ।")
      .replace(/The completed table is:/gu, "ਪੂਰੀ ਸਾਰਣੀ ਇਹ ਹੈ:").replace(/So the final arrangement is:/gu, "ਅੰਤਿਮ ਵਿਵਸਥਾ ਇਹ ਹੈ:").replace(/Now the whole table is fixed:/gu, "ਹੁਣ ਪੂਰੀ ਸਾਰਣੀ ਨਿਸ਼ਚਿਤ ਹੈ:").replace(/The final table is:/gu, "ਅੰਤਿਮ ਸਾਰਣੀ ਇਹ ਹੈ:")
      .replace(/From the completed table, the answer is \*\*(.+)\*\*\./gu, "ਪੂਰੀ ਸਾਰਣੀ ਤੋਂ ਉੱਤਰ **$1** ਹੈ।");
  }
  return line;
}

function localizeExplanation(language: Lp001008LocalizedLanguage, child: any, replacements: ReadonlyMap<string, string>, clueMap: ReadonlyMap<string, string>): { summary: string; lines: string[] } {
  const answer = replaceKnown(child.answer, replacements);
  return {
    summary: language === "hi" ? `उपयोगी शर्तों को पहले लेकर तालिका को चरण-दर-चरण भरें। आवश्यक उत्तर ${answer} है।` : `ਲਾਭਦਾਇਕ ਸ਼ਰਤਾਂ ਪਹਿਲਾਂ ਲੈ ਕੇ ਸਾਰਣੀ ਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਭਰੋ। ਲੋੜੀਂਦਾ ਉੱਤਰ ${answer} ਹੈ।`,
    lines: child.explanation.lines.map((block: string) => block.split("\n").map((line: string) => localizeMetaLine(language, line, replacements, clueMap)).join("\n")),
  };
}

function localizedChild(language: Lp001008LocalizedLanguage, child: any, stem: string, replacements: ReadonlyMap<string, string>, clueMap: ReadonlyMap<string, string>): Lp001008LocalizedChild {
  const options = child.options.map((option: string) => replaceKnown(option, replacements));
  return {
    questionId: child.questionId, qlId: child.qlId, language, stem, options, correctIndex: child.correctIndex,
    answer: options[child.correctIndex]!, difficultyBand: child.difficultyBand, misconceptionFamily: child.misconceptionFamily,
    explanation: localizeExplanation(language, child, replacements, clueMap), englishChild: child,
  };
}

function referenced(source: string, labels: readonly string[]): string[] { return labels.filter((label) => source.includes(label)); }
function numberFromStem(stem: string): string { return stem.match(/\b([1-7])(?:st|nd|rd|th)?\b/u)?.[1] ?? "?"; }

function localizeLp001(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const groups = caselet.groups.map((id: string) => caselet.groupLabels[id]);
  const dynamic = [...caselet.people, ...groups]; const replacements = replacementMap(language, dynamic);
  const bundles = buildLp001ClueBundles(caselet);
  const localizeSingle = (clue: any): string => {
    if (clue.kind === "SAME_GROUP") return language === "hi" ? `${term(language, clue.left)} और ${term(language, clue.right)} एक ही समूह में हैं।` : `${term(language, clue.left)} ਅਤੇ ${term(language, clue.right)} ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਹਨ।`;
    if (clue.kind === "DIFFERENT_GROUPS") return language === "hi" ? `${term(language, clue.left)} और ${term(language, clue.right)} अलग-अलग समूहों में हैं।` : `${term(language, clue.left)} ਅਤੇ ${term(language, clue.right)} ਵੱਖ-ਵੱਖ ਸਮੂਹਾਂ ਵਿੱਚ ਹਨ।`;
    return language === "hi" ? `${term(language, clue.person)} ${term(language, caselet.groupLabels[clue.group])} समूह में नहीं है।` : `${term(language, clue.person)} ${term(language, caselet.groupLabels[clue.group])} ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਹੈ।`;
  };
  const bundleText = (bundle: any): string => {
    if (bundle.clues.length >= 2 && bundle.clues.every((clue: any) => clue.kind === "NOT_IN_GROUP")) {
      const person = term(language, bundle.clues[0].person); const labels = bundle.clues.map((clue: any) => term(language, caselet.groupLabels[clue.group]));
      return language === "hi" ? `${person} न तो ${labels[0]} में है और न ही ${labels[1]} में।` : `${person} ਨਾ ${labels[0]} ਵਿੱਚ ਹੈ ਅਤੇ ਨਾ ਹੀ ${labels[1]} ਵਿੱਚ।`;
    }
    if (bundle.clues.length >= 2 && bundle.clues.every((clue: any) => clue.kind === "DIFFERENT_GROUPS")) {
      const counts = new Map<string, number>(); for (const clue of bundle.clues) { counts.set(clue.left, (counts.get(clue.left) ?? 0) + 1); counts.set(clue.right, (counts.get(clue.right) ?? 0) + 1); }
      const anchor = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]![0];
      const others = bundle.clues.map((clue: any) => clue.left === anchor ? clue.right : clue.left).map((value: string) => term(language, value));
      return language === "hi" ? `${term(language, anchor)} ${list(language, others)}—दोनों से अलग समूह में है।` : `${term(language, anchor)} ${list(language, others)}—ਦੋਵਾਂ ਤੋਂ ਵੱਖ ਸਮੂਹ ਵਿੱਚ ਹੈ।`;
    }
    return localizeSingle(bundle.clues[0]);
  };
  const learnerFacingClues = bundles.map(bundleText);
  const clueMap = new Map<string, string>();
  bundles.forEach((bundle: any, index: number) => clueMap.set(bundle.text, learnerFacingClues[index]!));
  caselet.clues.forEach((clue: any) => clueMap.set(clue.text, localizeSingle(clue)));
  const people = caselet.people.map((p: string) => term(language, p)); const localizedGroups = groups.map((g: string) => term(language, g));
  const scenario = language === "hi" ? `छह व्यक्ति—${list(language, people)}—तीन समूहों में बाँटे गए हैं। समूह हैं ${list(language, localizedGroups)}। प्रत्येक समूह में ठीक दो व्यक्ति हैं।` : `ਛੇ ਵਿਅਕਤੀ—${list(language, people)}—ਤਿੰਨ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡੇ ਗਏ ਹਨ। ਸਮੂਹ ਹਨ ${list(language, localizedGroups)}। ਹਰ ਸਮੂਹ ਵਿੱਚ ਠੀਕ ਦੋ ਵਿਅਕਤੀ ਹਨ।`;
  const groupRef = (stem: string) => referenced(stem, groups)[0]; const personRef = (stem: string) => referenced(stem, caselet.people)[0];
  const stemFor = (child: any): string => {
    if (child.qlId === "LP-QL-001") return language === "hi" ? `${term(language, personRef(child.stem))} किस समूह में है?` : `${term(language, personRef(child.stem))} ਕਿਸ ਸਮੂਹ ਵਿੱਚ ਹੈ?`;
    if (child.qlId === "LP-QL-002") return language === "hi" ? "निम्नलिखित में से कौन-सा जोड़ा एक ही समूह में है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਹੈ?";
    if (child.qlId === "LP-QL-003") return language === "hi" ? `${term(language, groupRef(child.stem))} समूह में कौन-से दो व्यक्ति हैं?` : `${term(language, groupRef(child.stem))} ਸਮੂਹ ਵਿੱਚ ਕਿਹੜੇ ਦੋ ਵਿਅਕਤੀ ਹਨ?`;
    return language === "hi" ? "निम्नलिखित में से कौन-सा जोड़ा अलग-अलग समूहों में है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜਾ ਵੱਖ-ਵੱਖ ਸਮੂਹਾਂ ਵਿੱਚ ਹੈ?";
  };
  return { packageId: "LP-001", checkpointId: "LP-CP-001", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp002(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const locations = caselet.locations.map((id: string) => caselet.locationLabels[id]); const dynamic = [...caselet.people, ...caselet.days, ...locations]; const replacements = replacementMap(language, dynamic);
  const clueText = (clue: any): string => {
    const p = (value: string) => term(language, value); const loc = (id: string) => term(language, caselet.locationLabels[id]); const day = (value: string) => term(language, value);
    if (language === "hi") {
      if (clue.kind === "NOT_DAY") return `${p(clue.person)} का दिन ${day(clue.day)} नहीं है।`;
      if (clue.kind === "NOT_LOCATION") return `${p(clue.person)} ${loc(clue.location)} से संबंधित नहीं है।`;
      if (clue.kind === "DAY_BEFORE") return `${p(clue.left)} का दिन ${p(clue.right)} से पहले है।`;
      if (clue.kind === "LOCATION_BEFORE") return `दिए गए स्थान-क्रम में ${p(clue.left)} का स्थान ${p(clue.right)} के स्थान से पहले है।`;
      return `${p(clue.left)} और ${p(clue.right)} के दिनों में ठीक ${clue.distance} दिन का अंतर है।`;
    }
    if (clue.kind === "NOT_DAY") return `${p(clue.person)} ਦਾ ਦਿਨ ${day(clue.day)} ਨਹੀਂ ਹੈ।`;
    if (clue.kind === "NOT_LOCATION") return `${p(clue.person)} ${loc(clue.location)} ਨਾਲ ਸੰਬੰਧਿਤ ਨਹੀਂ ਹੈ।`;
    if (clue.kind === "DAY_BEFORE") return `${p(clue.left)} ਦਾ ਦਿਨ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
    if (clue.kind === "LOCATION_BEFORE") return `ਦਿੱਤੇ ਸਥਾਨ-ਕ੍ਰਮ ਵਿੱਚ ${p(clue.left)} ਦਾ ਸਥਾਨ ${p(clue.right)} ਦੇ ਸਥਾਨ ਤੋਂ ਪਹਿਲਾਂ ਹੈ।`;
    return `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਦਿਨਾਂ ਵਿੱਚ ਠੀਕ ${clue.distance} ਦਿਨਾਂ ਦਾ ਅੰਤਰ ਹੈ।`;
  };
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `चार व्यक्ति—${list(language, caselet.people.map((p: string) => term(language, p)))}—चार अलग दिनों ${list(language, caselet.days.map((d: string) => term(language, d)))} और चार अलग स्थानों ${list(language, locations.map((v: string) => term(language, v)))} से जुड़े हैं। स्थान दिए गए क्रम में हैं। प्रत्येक व्यक्ति का दिन और स्थान अलग है।` : `ਚਾਰ ਵਿਅਕਤੀ—${list(language, caselet.people.map((p: string) => term(language, p)))}—ਚਾਰ ਵੱਖ ਦਿਨਾਂ ${list(language, caselet.days.map((d: string) => term(language, d)))} ਅਤੇ ਚਾਰ ਵੱਖ ਸਥਾਨਾਂ ${list(language, locations.map((v: string) => term(language, v)))} ਨਾਲ ਜੁੜੇ ਹਨ। ਸਥਾਨ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਹਨ। ਹਰ ਵਿਅਕਤੀ ਦਾ ਦਿਨ ਅਤੇ ਸਥਾਨ ਵੱਖ ਹੈ।`;
  const person = (stem: string) => referenced(stem, caselet.people)[0]; const day = (stem: string) => referenced(stem, caselet.days)[0];
  const stemFor = (child: any): string => child.qlId === "LP-QL-005" ? (language === "hi" ? `${term(language, person(child.stem))} को कौन-सा दिन मिला है?` : `${term(language, person(child.stem))} ਨੂੰ ਕਿਹੜਾ ਦਿਨ ਮਿਲਿਆ ਹੈ?`) : child.qlId === "LP-QL-006" ? (language === "hi" ? `${term(language, person(child.stem))} से कौन-सा स्थान संबंधित है?` : `${term(language, person(child.stem))} ਨਾਲ ਕਿਹੜਾ ਸਥਾਨ ਸੰਬੰਧਿਤ ਹੈ?`) : child.qlId === "LP-QL-007" ? (language === "hi" ? `${term(language, day(child.stem))} को कौन-सा व्यक्ति निर्धारित है?` : `${term(language, day(child.stem))} ਨੂੰ ਕਿਹੜਾ ਵਿਅਕਤੀ ਨਿਰਧਾਰਤ ਹੈ?`) : (language === "hi" ? "निम्नलिखित में से कौन-सा व्यक्ति-दिन-स्थान मिलान सही है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਅਕਤੀ-ਦਿਨ-ਸਥਾਨ ਮਿਲਾਨ ਸਹੀ ਹੈ?");
  return { packageId: "LP-002", checkpointId: "LP-CP-002", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp003(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const items = caselet.boxes.map((id: string) => caselet.boxLabels[id]); const replacements = replacementMap(language, items);
  const item = (id: string) => term(language, caselet.boxLabels[id]);
  const clueText = (clue: any): string => language === "hi"
    ? clue.kind === "ABOVE" ? `${item(clue.upper)} वाली वस्तु ${item(clue.lower)} वाली वस्तु से ऊपर है।` : clue.kind === "IMMEDIATELY_ABOVE" ? `${item(clue.upper)} वाली वस्तु ${item(clue.lower)} वाली वस्तु के ठीक ऊपर है।` : clue.kind === "BOXES_BETWEEN" ? `${item(clue.left)} और ${item(clue.right)} के बीच ठीक ${clue.count} वस्तु${clue.count === 1 ? "" : "एँ"} हैं।` : clue.kind === "NOT_ADJACENT" ? `${item(clue.left)} और ${item(clue.right)} पास-पास नहीं हैं।` : `${item(clue.box)} नीचे से ${clue.position}वें स्थान पर नहीं है।`
    : clue.kind === "ABOVE" ? `${item(clue.upper)} ਵਾਲੀ ਵਸਤੂ ${item(clue.lower)} ਵਾਲੀ ਵਸਤੂ ਤੋਂ ਉੱਪਰ ਹੈ।` : clue.kind === "IMMEDIATELY_ABOVE" ? `${item(clue.upper)} ਵਾਲੀ ਵਸਤੂ ${item(clue.lower)} ਵਾਲੀ ਵਸਤੂ ਦੇ ਠੀਕ ਉੱਪਰ ਹੈ।` : clue.kind === "BOXES_BETWEEN" ? `${item(clue.left)} ਅਤੇ ${item(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count} ਵਸਤੂ${clue.count === 1 ? "" : "ਆਂ"} ਹਨ।` : clue.kind === "NOT_ADJACENT" ? `${item(clue.left)} ਅਤੇ ${item(clue.right)} ਨਾਲ-ਨਾਲ ਨਹੀਂ ਹਨ।` : `${item(clue.box)} ਹੇਠਾਂ ਤੋਂ ${clue.position}ਵੇਂ ਸਥਾਨ 'ਤੇ ਨਹੀਂ ਹੈ।`;
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `सात अलग वस्तुएँ—${list(language, items.map((v: string) => term(language, v)))}—एक के ऊपर एक रखी हैं। नीचे से ऊपर स्थान 1 से 7 तक हैं और हर स्थान पर एक ही वस्तु है।` : `ਸੱਤ ਵੱਖ ਵਸਤੂਆਂ—${list(language, items.map((v: string) => term(language, v)))}—ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੀਆਂ ਹਨ। ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਸਥਾਨ 1 ਤੋਂ 7 ਤੱਕ ਹਨ ਅਤੇ ਹਰ ਸਥਾਨ 'ਤੇ ਇੱਕ ਹੀ ਵਸਤੂ ਹੈ।`;
  const itemRefs = (stem: string) => referenced(stem, items); const stemFor = (child: any): string => child.qlId === "LP-QL-009" ? (language === "hi" ? `नीचे से ${numberFromStem(child.stem)}वें स्थान पर कौन-सी वस्तु है?` : `ਹੇਠਾਂ ਤੋਂ ${numberFromStem(child.stem)}ਵੇਂ ਸਥਾਨ 'ਤੇ ਕਿਹੜੀ ਵਸਤੂ ਹੈ?`) : child.qlId === "LP-QL-010" ? (language === "hi" ? `${term(language, itemRefs(child.stem)[0])} नीचे से किस स्थान पर है?` : `${term(language, itemRefs(child.stem)[0])} ਹੇਠਾਂ ਤੋਂ ਕਿਹੜੇ ਸਥਾਨ 'ਤੇ ਹੈ?`) : child.qlId === "LP-QL-011" ? (language === "hi" ? `${term(language, itemRefs(child.stem)[0])} और ${term(language, itemRefs(child.stem)[1])} के बीच कितनी वस्तुएँ हैं?` : `${term(language, itemRefs(child.stem)[0])} ਅਤੇ ${term(language, itemRefs(child.stem)[1])} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੀਆਂ ਵਸਤੂਆਂ ਹਨ?`) : (language === "hi" ? `${term(language, itemRefs(child.stem)[0])} के ठीक ऊपर कौन-सी वस्तु है?` : `${term(language, itemRefs(child.stem)[0])} ਦੇ ਠੀਕ ਉੱਪਰ ਕਿਹੜੀ ਵਸਤੂ ਹੈ?`);
  return { packageId: "LP-003", checkpointId: "LP-CP-003", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp004(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const candidates = caselet.candidates.map((id: string) => caselet.candidateLabels[id]); const replacements = replacementMap(language, [...candidates, "Selected", "Not selected"]); const c = (id: string) => term(language, caselet.candidateLabels[id]);
  const clueText = (clue: any): string => {
    if (language === "hi") {
      if (clue.kind === "MUST_SELECT") return `${c(clue.candidate)} का चयन होता है।`;
      if (clue.kind === "MUST_NOT_SELECT") return `${c(clue.candidate)} का चयन नहीं होता।`;
      if (clue.kind === "TOGETHER") return `${c(clue.first)} और ${c(clue.second)} या तो दोनों चुने जाते हैं या दोनों नहीं।`;
      if (clue.kind === "NOT_TOGETHER") return `${c(clue.first)} और ${c(clue.second)} दोनों एक साथ नहीं चुने जा सकते।`;
      if (clue.kind === "EXACTLY_ONE") return `${c(clue.first)} और ${c(clue.second)} में से ठीक एक चुना जाता है।`;
      return `यदि ${c(clue.first)} चुना जाता है, तो ${c(clue.second)} भी चुना जाता है।`;
    }
    if (clue.kind === "MUST_SELECT") return `${c(clue.candidate)} ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।`;
    if (clue.kind === "MUST_NOT_SELECT") return `${c(clue.candidate)} ਨਹੀਂ ਚੁਣਿਆ ਜਾਂਦਾ।`;
    if (clue.kind === "TOGETHER") return `${c(clue.first)} ਅਤੇ ${c(clue.second)} ਜਾਂ ਦੋਵੇਂ ਚੁਣੇ ਜਾਂਦੇ ਹਨ ਜਾਂ ਦੋਵੇਂ ਨਹੀਂ।`;
    if (clue.kind === "NOT_TOGETHER") return `${c(clue.first)} ਅਤੇ ${c(clue.second)} ਦੋਵੇਂ ਇਕੱਠੇ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।`;
    if (clue.kind === "EXACTLY_ONE") return `${c(clue.first)} ਅਤੇ ${c(clue.second)} ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।`;
    return `ਜੇ ${c(clue.first)} ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ${c(clue.second)} ਵੀ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।`;
  };
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `सात उम्मीदवार—${list(language, candidates.map((v: string) => term(language, v)))}—दिए गए हैं। इनमें से ठीक ${caselet.committeeSize} उम्मीदवार चुने जाते हैं।` : `ਸੱਤ ਉਮੀਦਵਾਰ—${list(language, candidates.map((v: string) => term(language, v)))}—ਦਿੱਤੇ ਗਏ ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਠੀਕ ${caselet.committeeSize} ਉਮੀਦਵਾਰ ਚੁਣੇ ਜਾਂਦੇ ਹਨ।`;
  const names = (stem: string) => referenced(stem, candidates).map((v) => term(language, v)); const stemFor = (child: any): string => child.qlId === "LP-QL-013" ? (language === "hi" ? "किस जोड़े के दोनों सदस्य चुने गए हैं?" : "ਕਿਹੜੇ ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਮੈਂਬਰ ਚੁਣੇ ਗਏ ਹਨ?") : child.qlId === "LP-QL-014" ? (language === "hi" ? "किस जोड़े में ठीक एक सदस्य चुना गया है?" : "ਕਿਹੜੇ ਜੋੜੇ ਵਿੱਚ ਠੀਕ ਇੱਕ ਮੈਂਬਰ ਚੁਣਿਆ ਗਿਆ ਹੈ?") : child.qlId === "LP-QL-015" ? (language === "hi" ? `${list(language, names(child.stem))} के चयन के बारे में कौन-सा विकल्प सही है?` : `${list(language, names(child.stem))} ਦੀ ਚੋਣ ਬਾਰੇ ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`) : (language === "hi" ? `${list(language, names(child.stem))} में से कितने चुने गए हैं?` : `${list(language, names(child.stem))} ਵਿੱਚੋਂ ਕਿੰਨੇ ਚੁਣੇ ਗਏ ਹਨ?`);
  return { packageId: "LP-004", checkpointId: "LP-CP-004", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp005(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const people = caselet.people.map((id: string) => caselet.labels.people[id]); const duties = caselet.duties.map((id: string) => caselet.labels.duties[id]); const places = caselet.places.map((id: string) => caselet.labels.places[id]); const replacements = replacementMap(language, [...people, ...duties, ...places]);
  const p = (id: string) => term(language, caselet.labels.people[id]); const d = (id: string) => term(language, caselet.labels.duties[id]); const l = (id: string) => term(language, caselet.labels.places[id]);
  const clueText = (clue: any): string => language === "hi"
    ? clue.kind === "PERSON_DUTY" ? `${p(clue.person)} को ${d(clue.duty)} ड्यूटी मिली है।` : clue.kind === "NOT_PERSON_DUTY" ? `${p(clue.person)} को ${d(clue.duty)} ड्यूटी नहीं मिली है।` : clue.kind === "PERSON_PLACE" ? `${p(clue.person)} का स्थान ${l(clue.place)} है।` : clue.kind === "NOT_PERSON_PLACE" ? `${p(clue.person)} का स्थान ${l(clue.place)} नहीं है।` : clue.kind === "DUTY_PLACE" ? `${d(clue.duty)} ड्यूटी का स्थान ${l(clue.place)} है।` : `${d(clue.duty)} ड्यूटी का स्थान ${l(clue.place)} नहीं है।`
    : clue.kind === "PERSON_DUTY" ? `${p(clue.person)} ਨੂੰ ${d(clue.duty)} ਡਿਊਟੀ ਮਿਲੀ ਹੈ।` : clue.kind === "NOT_PERSON_DUTY" ? `${p(clue.person)} ਨੂੰ ${d(clue.duty)} ਡਿਊਟੀ ਨਹੀਂ ਮਿਲੀ।` : clue.kind === "PERSON_PLACE" ? `${p(clue.person)} ਦਾ ਸਥਾਨ ${l(clue.place)} ਹੈ।` : clue.kind === "NOT_PERSON_PLACE" ? `${p(clue.person)} ਦਾ ਸਥਾਨ ${l(clue.place)} ਨਹੀਂ ਹੈ।` : clue.kind === "DUTY_PLACE" ? `${d(clue.duty)} ਡਿਊਟੀ ਦਾ ਸਥਾਨ ${l(clue.place)} ਹੈ।` : `${d(clue.duty)} ਡਿਊਟੀ ਦਾ ਸਥਾਨ ${l(clue.place)} ਨਹੀਂ ਹੈ।`;
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `पाँच व्यक्ति—${list(language, people.map((v: string) => term(language, v)))}—पाँच अलग ड्यूटियों ${list(language, duties.map((v: string) => term(language, v)))} और पाँच अलग स्थानों ${list(language, places.map((v: string) => term(language, v)))} से जुड़े हैं। प्रत्येक व्यक्ति की एक अलग ड्यूटी और एक अलग स्थान है।` : `ਪੰਜ ਵਿਅਕਤੀ—${list(language, people.map((v: string) => term(language, v)))}—ਪੰਜ ਵੱਖ ਡਿਊਟੀਆਂ ${list(language, duties.map((v: string) => term(language, v)))} ਅਤੇ ਪੰਜ ਵੱਖ ਸਥਾਨਾਂ ${list(language, places.map((v: string) => term(language, v)))} ਨਾਲ ਜੁੜੇ ਹਨ। ਹਰ ਵਿਅਕਤੀ ਦੀ ਇੱਕ ਵੱਖ ਡਿਊਟੀ ਅਤੇ ਇੱਕ ਵੱਖ ਸਥਾਨ ਹੈ।`;
  const person = (stem: string) => referenced(stem, people)[0]; const duty = (stem: string) => referenced(stem, duties)[0]; const stemFor = (child: any): string => child.qlId === "LP-QL-017" ? (language === "hi" ? `${term(language, person(child.stem))} को कौन-सी ड्यूटी मिली है?` : `${term(language, person(child.stem))} ਨੂੰ ਕਿਹੜੀ ਡਿਊਟੀ ਮਿਲੀ ਹੈ?`) : child.qlId === "LP-QL-018" ? (language === "hi" ? `${term(language, person(child.stem))} का स्थान कौन-सा है?` : `${term(language, person(child.stem))} ਦਾ ਸਥਾਨ ਕਿਹੜਾ ਹੈ?`) : child.qlId === "LP-QL-019" ? (language === "hi" ? `${term(language, duty(child.stem))} ड्यूटी किस व्यक्ति को मिली है?` : `${term(language, duty(child.stem))} ਡਿਊਟੀ ਕਿਸ ਵਿਅਕਤੀ ਨੂੰ ਮਿਲੀ ਹੈ?`) : (language === "hi" ? "निम्नलिखित में से कौन-सा व्यक्ति-ड्यूटी-स्थान मिलान सही है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਅਕਤੀ-ਡਿਊਟੀ-ਸਥਾਨ ਮਿਲਾਨ ਸਹੀ ਹੈ?");
  return { packageId: "LP-005", checkpointId: "LP-CP-005", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp006(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const people = caselet.people.map((id: string) => caselet.labels.people[id]); const subjects = caselet.subjects.map((id: string) => caselet.labels.subjects[id]); const cities = caselet.cities.map((id: string) => caselet.labels.cities[id]); const replacements = replacementMap(language, [...people, ...caselet.days, ...subjects, ...cities]); const p = (id: string) => term(language, caselet.labels.people[id]); const s = (id: string) => term(language, caselet.labels.subjects[id]); const c = (id: string) => term(language, caselet.labels.cities[id]);
  const clueText = (clue: any): string => language === "hi" ? clue.kind === "PERSON_DAY" ? `${p(clue.person)} को ${term(language, clue.day)} दिन मिला है।` : clue.kind === "PERSON_SUBJECT" ? `${p(clue.person)} का अध्ययन क्षेत्र ${s(clue.subject)} है।` : clue.kind === "PERSON_CITY" ? `${p(clue.person)} का शहर ${c(clue.city)} है।` : clue.kind === "DAY_BEFORE" ? `${p(clue.first)} का दिन ${p(clue.second)} से पहले है।` : clue.kind === "SUBJECT_CITY" ? `${s(clue.subject)} अध्ययन क्षेत्र ${c(clue.city)} शहर से जुड़ा है।` : `${s(clue.subject)} अध्ययन क्षेत्र ${c(clue.city)} शहर से नहीं जुड़ा है।` : clue.kind === "PERSON_DAY" ? `${p(clue.person)} ਨੂੰ ${term(language, clue.day)} ਦਿਨ ਮਿਲਿਆ ਹੈ।` : clue.kind === "PERSON_SUBJECT" ? `${p(clue.person)} ਦਾ ਅਧਿਐਨ ਖੇਤਰ ${s(clue.subject)} ਹੈ।` : clue.kind === "PERSON_CITY" ? `${p(clue.person)} ਦਾ ਸ਼ਹਿਰ ${c(clue.city)} ਹੈ।` : clue.kind === "DAY_BEFORE" ? `${p(clue.first)} ਦਾ ਦਿਨ ${p(clue.second)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।` : clue.kind === "SUBJECT_CITY" ? `${s(clue.subject)} ਅਧਿਐਨ ਖੇਤਰ ${c(clue.city)} ਸ਼ਹਿਰ ਨਾਲ ਜੁੜਿਆ ਹੈ।` : `${s(clue.subject)} ਅਧਿਐਨ ਖੇਤਰ ${c(clue.city)} ਸ਼ਹਿਰ ਨਾਲ ਨਹੀਂ ਜੁੜਿਆ।`;
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `चार व्यक्ति—${list(language, people.map((v: string) => term(language, v)))}—चार दिनों ${list(language, caselet.days.map((v: string) => term(language, v)))}, चार अध्ययन क्षेत्रों ${list(language, subjects.map((v: string) => term(language, v)))} और चार शहरों ${list(language, cities.map((v: string) => term(language, v)))} से एक-एक करके जुड़े हैं। हर दिन, अध्ययन क्षेत्र और शहर केवल एक बार उपयोग होता है।` : `ਚਾਰ ਵਿਅਕਤੀ—${list(language, people.map((v: string) => term(language, v)))}—ਚਾਰ ਦਿਨਾਂ ${list(language, caselet.days.map((v: string) => term(language, v)))}, ਚਾਰ ਅਧਿਐਨ ਖੇਤਰਾਂ ${list(language, subjects.map((v: string) => term(language, v)))} ਅਤੇ ਚਾਰ ਸ਼ਹਿਰਾਂ ${list(language, cities.map((v: string) => term(language, v)))} ਨਾਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜੁੜੇ ਹਨ। ਹਰ ਦਿਨ, ਅਧਿਐਨ ਖੇਤਰ ਅਤੇ ਸ਼ਹਿਰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।`;
  const person = (stem: string) => referenced(stem, people)[0]; const stemFor = (child: any): string => child.qlId === "LP-QL-021" ? (language === "hi" ? `${term(language, person(child.stem))} को कौन-सा दिन मिला है?` : `${term(language, person(child.stem))} ਨੂੰ ਕਿਹੜਾ ਦਿਨ ਮਿਲਿਆ ਹੈ?`) : child.qlId === "LP-QL-022" ? (language === "hi" ? `${term(language, person(child.stem))} का अध्ययन क्षेत्र कौन-सा है?` : `${term(language, person(child.stem))} ਦਾ ਅਧਿਐਨ ਖੇਤਰ ਕਿਹੜਾ ਹੈ?`) : child.qlId === "LP-QL-023" ? (language === "hi" ? `${term(language, person(child.stem))} का शहर कौन-सा है?` : `${term(language, person(child.stem))} ਦਾ ਸ਼ਹਿਰ ਕਿਹੜਾ ਹੈ?`) : (language === "hi" ? "निम्नलिखित में से कौन-सा व्यक्ति-दिन-अध्ययन क्षेत्र-शहर मिलान सही है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਵਿਅਕਤੀ-ਦਿਨ-ਅਧਿਐਨ ਖੇਤਰ-ਸ਼ਹਿਰ ਮਿਲਾਨ ਸਹੀ ਹੈ?");
  return { packageId: "LP-006", checkpointId: "LP-CP-006", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp007(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const people = caselet.people.map((id: string) => caselet.labels.people[id]); const values = caselet.values.map((id: string) => caselet.labels.values[id]); const replacements = replacementMap(language, [...people, ...values]); const p = (id: string) => term(language, caselet.labels.people[id]); const v = (id: string) => term(language, caselet.labels.values[id]);
  const clueText = (clue: any): string => language === "hi" ? clue.kind === "PERSON_VALUE" ? `${p(clue.person)} का विकल्प ${v(clue.value)} है।` : clue.kind === "PERSON_EITHER" ? `${p(clue.person)} का विकल्प ${v(clue.values[0])} या ${v(clue.values[1])} में से एक है।` : `${p(clue.person)} का विकल्प ${v(clue.value)} नहीं है।` : clue.kind === "PERSON_VALUE" ? `${p(clue.person)} ਦੀ ਚੋਣ ${v(clue.value)} ਹੈ।` : clue.kind === "PERSON_EITHER" ? `${p(clue.person)} ਦੀ ਚੋਣ ${v(clue.values[0])} ਜਾਂ ${v(clue.values[1])} ਵਿੱਚੋਂ ਇੱਕ ਹੈ।` : `${p(clue.person)} ਦੀ ਚੋਣ ${v(clue.value)} ਨਹੀਂ ਹੈ।`;
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `पाँच व्यक्ति—${list(language, people.map((x: string) => term(language, x)))}—पाँच अलग विकल्पों ${list(language, values.map((x: string) => term(language, x)))} से एक-एक करके जुड़े हैं। हर विकल्प केवल एक व्यक्ति को मिलता है।` : `ਪੰਜ ਵਿਅਕਤੀ—${list(language, people.map((x: string) => term(language, x)))}—ਪੰਜ ਵੱਖ ਚੋਣਾਂ ${list(language, values.map((x: string) => term(language, x)))} ਨਾਲ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜੁੜੇ ਹਨ। ਹਰ ਚੋਣ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਮਿਲਦੀ ਹੈ।`;
  const pRefs = (stem: string) => referenced(stem, people).map((x) => term(language, x)); const value = (stem: string) => referenced(stem, values)[0]; const stemFor = (child: any): string => child.qlId === "LP-QL-025" ? (language === "hi" ? `${pRefs(child.stem)[0]} का विकल्प कौन-सा है?` : `${pRefs(child.stem)[0]} ਦੀ ਚੋਣ ਕਿਹੜੀ ਹੈ?`) : child.qlId === "LP-QL-026" ? (language === "hi" ? `${term(language, value(child.stem))} विकल्प किस व्यक्ति का है?` : `${term(language, value(child.stem))} ਚੋਣ ਕਿਸ ਵਿਅਕਤੀ ਦੀ ਹੈ?`) : child.qlId === "LP-QL-027" ? (language === "hi" ? `${list(language, pRefs(child.stem))} के लिए सही विकल्पों वाला मिलान कौन-सा है?` : `${list(language, pRefs(child.stem))} ਲਈ ਸਹੀ ਚੋਣਾਂ ਵਾਲਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?`) : (language === "hi" ? `${list(language, pRefs(child.stem))} के लिए सही मिलान कौन-सा है?` : `${list(language, pRefs(child.stem))} ਲਈ ਸਹੀ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?`);
  return { packageId: "LP-007", checkpointId: "LP-CP-007", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

function localizeLp008(language: Lp001008LocalizedLanguage, caselet: any): Lp001008LocalizedCaselet {
  const people = caselet.people.map((id: string) => caselet.labels.people[id]); const months = caselet.months.map((id: number) => caselet.labels.months[id]); const slots = caselet.slots.map((slot: number) => `${slot % 2 === 0 ? "12th" : "27th"} ${caselet.labels.months[Math.floor(slot / 2)]}`); const replacements = replacementMap(language, [...people, ...months, ...slots]); const p = (id: string) => term(language, caselet.labels.people[id]); const slot = (value: number) => term(language, `${value % 2 === 0 ? "12th" : "27th"} ${caselet.labels.months[Math.floor(value / 2)]}`); const month = (id: number) => term(language, caselet.labels.months[id]);
  const clueText = (clue: any): string => language === "hi" ? clue.kind === "PERSON_SLOT" ? `${p(clue.person)} की तारीख ${slot(clue.slot)} है।` : clue.kind === "SAME_MONTH" ? `${p(clue.left)} और ${p(clue.right)} एक ही महीने में हैं।` : clue.kind === "SAME_DATE" ? `${p(clue.left)} और ${p(clue.right)} की तारीख समान है।` : clue.kind === "BEFORE" ? `${p(clue.left)} की तारीख ${p(clue.right)} से पहले है।` : clue.kind === "BETWEEN" ? `${p(clue.left)} और ${p(clue.right)} के बीच ठीक ${clue.count} व्यक्ति हैं।` : `${p(clue.person)} का महीना ${month(clue.month)} नहीं है।` : clue.kind === "PERSON_SLOT" ? `${p(clue.person)} ਦੀ ਤਾਰੀਖ ${slot(clue.slot)} ਹੈ।` : clue.kind === "SAME_MONTH" ? `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਇੱਕੋ ਮਹੀਨੇ ਵਿੱਚ ਹਨ।` : clue.kind === "SAME_DATE" ? `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੀ ਤਾਰੀਖ ਇੱਕੋ ਹੈ।` : clue.kind === "BEFORE" ? `${p(clue.left)} ਦੀ ਤਾਰੀਖ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।` : clue.kind === "BETWEEN" ? `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count} ਵਿਅਕਤੀ ਹਨ।` : `${p(clue.person)} ਦਾ ਮਹੀਨਾ ${month(clue.month)} ਨਹੀਂ ਹੈ।`;
  const learnerFacingClues = caselet.clues.map(clueText); const clueMap = new Map(caselet.clues.map((clue: any, i: number) => [clue.text, learnerFacingClues[i]!]));
  const scenario = language === "hi" ? `आठ व्यक्ति—${list(language, people.map((x: string) => term(language, x)))}—चार महीनों ${list(language, months.map((x: string) => term(language, x)))} में निर्धारित हैं। हर महीने दो संभावित तारीखें 12 और 27 हैं। आठों तारीख-महीना स्थान अलग-अलग हैं।` : `ਅੱਠ ਵਿਅਕਤੀ—${list(language, people.map((x: string) => term(language, x)))}—ਚਾਰ ਮਹੀਨਿਆਂ ${list(language, months.map((x: string) => term(language, x)))} ਵਿੱਚ ਨਿਰਧਾਰਤ ਹਨ। ਹਰ ਮਹੀਨੇ ਦੋ ਸੰਭਵ ਤਾਰੀਖਾਂ 12 ਅਤੇ 27 ਹਨ। ਅੱਠੇ ਤਾਰੀਖ-ਮਹੀਨਾ ਸਥਾਨ ਵੱਖ ਹਨ।`;
  const pRefs = (stem: string) => referenced(stem, people).map((x) => term(language, x)); const slotRef = (stem: string) => slots.find((x: string) => stem.includes(x)); const stemFor = (child: any): string => child.qlId === "LP-QL-029" ? (language === "hi" ? `${term(language, slotRef(child.stem) ?? "")} पर कौन-सा व्यक्ति निर्धारित है?` : `${term(language, slotRef(child.stem) ?? "")} ਨੂੰ ਕਿਹੜਾ ਵਿਅਕਤੀ ਨਿਰਧਾਰਤ ਹੈ?`) : child.qlId === "LP-QL-030" ? (language === "hi" ? `${pRefs(child.stem)[0]} की तारीख और महीना क्या है?` : `${pRefs(child.stem)[0]} ਦੀ ਤਾਰੀਖ ਅਤੇ ਮਹੀਨਾ ਕੀ ਹੈ?`) : child.qlId === "LP-QL-031" ? (language === "hi" ? `${list(language, pRefs(child.stem))} के लिए सही तारीख-महीना मिलान कौन-सा है?` : `${list(language, pRefs(child.stem))} ਲਈ ਸਹੀ ਤਾਰੀਖ-ਮਹੀਨਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?`) : (language === "hi" ? `${list(language, pRefs(child.stem))} के लिए सही तारीख-महीना मिलान कौन-सा है?` : `${list(language, pRefs(child.stem))} ਲਈ ਸਹੀ ਤਾਰੀਖ-ਮਹੀਨਾ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?`);
  return { packageId: "LP-008", checkpointId: "LP-CP-008", language, caseletId: caselet.caseletId, scenarioProfileId: caselet.scenarioProfileId, difficultyBand: caselet.difficultyBand, scenario, learnerFacingClues, children: caselet.children.map((child: any) => localizedChild(language, child, stemFor(child), replacements, clueMap)), englishCaselet: caselet };
}

export function generateLp001LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-001-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp001BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp001(language, caselet)); }
export function generateLp002LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-002-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp002BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp002(language, caselet)); }
export function generateLp003LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-003-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp003BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp003(language, caselet)); }
export function generateLp004LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-004-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp004BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp004(language, caselet)); }
export function generateLp005LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-005-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp005BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp005(language, caselet)); }
export function generateLp006LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-006-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp006BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp006(language, caselet)); }
export function generateLp007LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-007-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp007BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp007(language, caselet)); }
export function generateLp008LocalizedBatchV1(language: Lp001008LocalizedLanguage, seed = "lp-008-localization-v1", count = 8): Lp001008LocalizedCaselet[] { return generateLp008BatchStabilizedV4_2(seed, count).map((caselet) => localizeLp008(language, caselet)); }

export const LP_001_008_LOCALIZED_GENERATORS_V1 = Object.freeze({
  "LP-001": generateLp001LocalizedBatchV1,
  "LP-002": generateLp002LocalizedBatchV1,
  "LP-003": generateLp003LocalizedBatchV1,
  "LP-004": generateLp004LocalizedBatchV1,
  "LP-005": generateLp005LocalizedBatchV1,
  "LP-006": generateLp006LocalizedBatchV1,
  "LP-007": generateLp007LocalizedBatchV1,
  "LP-008": generateLp008LocalizedBatchV1,
});
