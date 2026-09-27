import { generateDi002PermanentQuestion } from "./permanent-question-generator";
import type {
  Di002V2ExamProfile,
  Di002V2Question,
  Di002V2Stimulus,
  Di002V2TaskKind,
} from "./advanced-table-v2-types";

export type Di002LocalizationLocale = "hi-IN" | "pa-IN";

export const DI002_LOCALIZATION_REVIEW_ID = "DI-002-HI-PA-REVIEW-V1" as const;

type NativeContext = Readonly<{
  hi: Readonly<{ title: string; rowHeader: string; prefix?: string }>;
  pa: Readonly<{ title: string; rowHeader: string; prefix?: string }>;
}>;

export const DI002_LOCALIZATION_CONTEXTS: Readonly<Record<string, NativeContext>> = Object.freeze({
  RECRUITMENT_CENTRES: {
    hi: { title: "भर्ती केंद्रों में आवेदन और चयन", rowHeader: "केंद्र", prefix: "केंद्र" },
    pa: { title: "ਭਰਤੀ ਕੇਂਦਰਾਂ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਅਤੇ ਚੋਣ", rowHeader: "ਕੇਂਦਰ", prefix: "ਕੇਂਦਰ" },
  },
  TRAINING_BATCHES: {
    hi: { title: "प्रशिक्षण बैचों में पंजीकृत और चयनित उम्मीदवार", rowHeader: "बैच", prefix: "बैच" },
    pa: { title: "ਸਿਖਲਾਈ ਬੈਚਾਂ ਵਿੱਚ ਰਜਿਸਟਰ ਅਤੇ ਚੁਣੇ ਉਮੀਦਵਾਰ", rowHeader: "ਬੈਚ", prefix: "ਬੈਚ" },
  },
  DEPARTMENTS: {
    hi: { title: "विभागों में आवेदक और अंतिम चयन", rowHeader: "विभाग" },
    pa: { title: "ਵਿਭਾਗਾਂ ਵਿੱਚ ਅਰਜ਼ੀਕਾਰ ਅਤੇ ਅੰਤਿਮ ਚੋਣ", rowHeader: "ਵਿਭਾਗ" },
  },
  SERVICE_UNITS: {
    hi: { title: "सेवा इकाइयों द्वारा संसाधित आवेदन और चयनित उम्मीदवार", rowHeader: "इकाई", prefix: "इकाई" },
    pa: { title: "ਸੇਵਾ ਇਕਾਈਆਂ ਵੱਲੋਂ ਸੰਭਾਲੀਆਂ ਅਰਜ਼ੀਆਂ ਅਤੇ ਚੁਣੇ ਉਮੀਦਵਾਰ", rowHeader: "ਇਕਾਈ", prefix: "ਇਕਾਈ" },
  },
  SCHOLARSHIP_ZONES: {
    hi: { title: "क्षेत्रों के अनुसार छात्रवृत्ति आवेदन और अंतिम चयन", rowHeader: "क्षेत्र", prefix: "क्षेत्र" },
    pa: { title: "ਖੇਤਰਾਂ ਅਨੁਸਾਰ ਸਕਾਲਰਸ਼ਿਪ ਅਰਜ਼ੀਆਂ ਅਤੇ ਅੰਤਿਮ ਚੋਣ", rowHeader: "ਖੇਤਰ", prefix: "ਖੇਤਰ" },
  },
  BRANCH_RECRUITMENT: {
    hi: { title: "शाखाओं में भर्ती आवेदन और चयन", rowHeader: "शाखा", prefix: "शाखा" },
    pa: { title: "ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਭਰਤੀ ਅਰਜ਼ੀਆਂ ਅਤੇ ਚੋਣ", rowHeader: "ਸ਼ਾਖਾ", prefix: "ਸ਼ਾਖਾ" },
  },
});

const DEPARTMENTS: Readonly<Record<string, Readonly<{hi:string;pa:string}>>> = Object.freeze({
  "Accounts": { hi: "लेखा", pa: "ਲੇਖਾ" },
  "Administration": { hi: "प्रशासन", pa: "ਪ੍ਰਸ਼ਾਸਨ" },
  "Audit": { hi: "लेखा-परीक्षा", pa: "ਆਡਿਟ" },
  "Compliance": { hi: "अनुपालन", pa: "ਅਨੁਪਾਲਨਾ" },
  "Customer Care": { hi: "ग्राहक सेवा", pa: "ਗਾਹਕ ਸੇਵਾ" },
  "Finance": { hi: "वित्त", pa: "ਵਿੱਤ" },
  "Human Resources": { hi: "मानव संसाधन", pa: "ਮਨੁੱਖੀ ਸਰੋਤ" },
  "Information Technology": { hi: "सूचना प्रौद्योगिकी", pa: "ਸੂਚਨਾ ਤਕਨਾਲੋਜੀ" },
  "Legal": { hi: "विधि", pa: "ਕਾਨੂੰਨੀ" },
  "Logistics": { hi: "लॉजिस्टिक्स", pa: "ਲਾਜਿਸਟਿਕਸ" },
  "Marketing": { hi: "विपणन", pa: "ਮਾਰਕੀਟਿੰਗ" },
  "Operations": { hi: "परिचालन", pa: "ਕਾਰਜ" },
  "Planning": { hi: "योजना", pa: "ਯੋਜਨਾ" },
  "Procurement": { hi: "खरीद", pa: "ਖਰੀਦ" },
  "Production": { hi: "उत्पादन", pa: "ਉਤਪਾਦਨ" },
  "Quality": { hi: "गुणवत्ता", pa: "ਗੁਣਵੱਤਾ" },
  "Research": { hi: "अनुसंधान", pa: "ਖੋਜ" },
  "Sales": { hi: "बिक्री", pa: "ਵਿਕਰੀ" },
  "Service": { hi: "सेवा", pa: "ਸੇਵਾ" },
  "Stores": { hi: "भंडार", pa: "ਭੰਡਾਰ" },
  "Support": { hi: "सहायता", pa: "ਸਹਾਇਤਾ" },
  "Training": { hi: "प्रशिक्षण", pa: "ਸਿਖਲਾਈ" },
  "Transport": { hi: "परिवहन", pa: "ਆਵਾਜਾਈ" },
  "Verification": { hi: "सत्यापन", pa: "ਪੜਤਾਲ" },
});

function isHindi(locale: Di002LocalizationLocale) {
  return locale === "hi-IN";
}

function context(stimulus: Di002V2Stimulus, locale: Di002LocalizationLocale) {
  const item = DI002_LOCALIZATION_CONTEXTS[stimulus.contextId];
  if (!item) throw new Error(`DI-002 localization missing context '${stimulus.contextId}'.`);
  return isHindi(locale) ? item.hi : item.pa;
}

function alphaIndex(label: string) {
  const m=label.match(/\b([A-X])$/u);
  return m ? m[1]!.charCodeAt(0)-64 : undefined;
}

function localizeRowLabel(stimulus: Di002V2Stimulus, label: string, locale: Di002LocalizationLocale) {
  if (stimulus.contextId === "DEPARTMENTS") {
    const item=DEPARTMENTS[label];
    if (!item) throw new Error(`DI-002 localization missing department '${label}'.`);
    return isHindi(locale) ? item.hi : item.pa;
  }
  const i=alphaIndex(label);
  if (!i) throw new Error(`DI-002 localization could not map row label '${label}'.`);
  const p=context(stimulus,locale).prefix!;
  return `${p} ${i}`;
}

function actualApplicants(stimulus: Di002V2Stimulus) {
  return stimulus.rows.map((row) => {
    const value=(row.selected*100)/row.selectionPercent;
    if (!Number.isSafeInteger(value)) throw new Error("DI-002 localized applicant reconstruction is not integer-safe.");
    return value;
  });
}

function surfaceIndex(question: Di002V2Question) {
  const n=Number(question.stemSurfaceId.replace(/^S/u,""));
  return Number.isInteger(n) && n>=1 && n<=3 ? n-1 : 0;
}

export function localizeDi002Stimulus(stimulus: Di002V2Stimulus, locale: Di002LocalizationLocale) {
  const c=context(stimulus,locale);
  return {
    ...stimulus,
    title:c.title,
    instruction:isHindi(locale)
      ? "तालिका का अध्ययन कीजिए और प्रश्नों के उत्तर दीजिए। आवेदकों वाले कॉलम में एक मान नहीं दिया गया है; इसे उसी पंक्ति के चयनित उम्मीदवारों और चयन प्रतिशत से ज्ञात किया जा सकता है।"
      : "ਸਾਰਣੀ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ। ਅਰਜ਼ੀਕਾਰਾਂ ਵਾਲੇ ਕਾਲਮ ਵਿੱਚ ਇੱਕ ਮੁੱਲ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ; ਇਸ ਨੂੰ ਉਸੇ ਕਤਾਰ ਦੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਅਤੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਤੋਂ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
    rowHeader:c.rowHeader,
    columns:[
      c.rowHeader,
      isHindi(locale) ? "आवेदक" : "ਅਰਜ਼ੀਕਾਰ",
      isHindi(locale) ? "चयनित" : "ਚੁਣੇ",
      isHindi(locale) ? "चयन %" : "ਚੋਣ %",
    ],
    rows:stimulus.rows.map((row)=>({...row,label:localizeRowLabel(stimulus,row.label,locale)})),
    unit:isHindi(locale) ? "उम्मीदवार" : "ਉਮੀਦਵਾਰ",
  };
}

function rowName(stimulus: Di002V2Stimulus, locale: Di002LocalizationLocale, index:number) {
  return localizeRowLabel(stimulus,stimulus.rows[index]!.label,locale);
}

function selectedPhrase(locale:Di002LocalizationLocale) {
  return isHindi(locale) ? "चयनित उम्मीदवारों की संख्या" : "ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ";
}
function applicantsPhrase(locale:Di002LocalizationLocale) {
  return isHindi(locale) ? "आवेदकों की संख्या" : "ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ";
}

function stem(question:Di002V2Question, stimulus:Di002V2Stimulus, locale:Di002LocalizationLocale) {
  const h=isHindi(locale), s=surfaceIndex(question), e=question.evidence;
  const r=(i:number)=>rowName(stimulus,locale,i);
  const sel=selectedPhrase(locale), app=applicantsPhrase(locale);
  switch(question.kind) {
    case "SELECTED_DIFFERENCE": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`${a} और ${b} में चयनित उम्मीदवारों की संख्या में कितना अंतर है?`, `${a} और ${b} में जहाँ अधिक उम्मीदवार चुने गए, वहाँ दूसरे की तुलना में कितने अधिक चुने गए?`, `${a} और ${b} के चयनित उम्मीदवारों की संख्या का निरपेक्ष अंतर ज्ञात कीजिए।`];
      const P=[`${a} ਅਤੇ ${b} ਵਿੱਚ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੈ?`, `${a} ਅਤੇ ${b} ਵਿੱਚ ਜਿੱਥੇ ਵੱਧ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ, ਉੱਥੇ ਦੂਜੇ ਨਾਲੋਂ ਕਿੰਨੇ ਵੱਧ ਚੁਣੇ ਗਏ?`, `${a} ਅਤੇ ${b} ਦੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ ਕੱਢੋ।`];
      return (h?H:P)[s]!;
    }
    case "COMBINED_SELECTED": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`${a} और ${b} से कुल कितने उम्मीदवार चुने गए?`, `${a} और ${b} के चयनित उम्मीदवारों की संयुक्त संख्या ज्ञात कीजिए।`, `${a} और ${b} में चयनित उम्मीदवारों की संख्या का योग कितना है?`];
      const P=[`${a} ਅਤੇ ${b} ਤੋਂ ਕੁੱਲ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ?`, `${a} ਅਤੇ ${b} ਦੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਮਿਲੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਵਿੱਚ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਜੋੜ ਕਿੰਨਾ ਹੈ?`];
      return (h?H:P)[s]!;
    }
    case "MISSING_APPLICANTS_FROM_RATE": {
      const i=Number(e.targetIndex), n=r(i);
      const H=[`${n} के लिए आवेदकों का लुप्त मान कितना है?`, `${n} में दिए गए चयनित उम्मीदवारों और चयन प्रतिशत का उपयोग करके आवेदकों की संख्या ज्ञात कीजिए।`, `${n} के लिए आवेदक कॉलम की लुप्त प्रविष्टि ज्ञात कीजिए।`];
      const P=[`${n} ਲਈ ਅਰਜ਼ੀਕਾਰਾਂ ਦਾ ਗੁੰਮ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`, `${n} ਵਿੱਚ ਦਿੱਤੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਅਤੇ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${n} ਲਈ ਅਰਜ਼ੀਕਾਰ ਕਾਲਮ ਦੀ ਗੁੰਮ ਦਰਜ ਕੱਢੋ।`];
      return (h?H:P)[s]!;
    }
    case "REJECTED_COUNT": {
      const n=r(Number(e.targetIndex));
      const H=[`${n} के कितने आवेदक चयनित नहीं हुए?`, `${n} में चयनित न होने वाले उम्मीदवारों की संख्या ज्ञात कीजिए।`, `${n} के कुल आवेदकों में से कितने उम्मीदवार चयनित नहीं हुए?`];
      const P=[`${n} ਦੇ ਕਿੰਨੇ ਅਰਜ਼ੀਕਾਰ ਚੁਣੇ ਨਹੀਂ ਗਏ?`, `${n} ਵਿੱਚ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${n} ਦੇ ਕੁੱਲ ਅਰਜ਼ੀਕਾਰਾਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਨਹੀਂ ਗਏ?`];
      return (h?H:P)[s]!;
    }
    case "SELECTED_SHARE_OF_TOTAL": {
      const n=r(Number(e.targetIndex));
      const H=[`${n} से चयनित उम्मीदवार, सभी चयनित उम्मीदवारों का लगभग कितने प्रतिशत हैं? निकटतम पूर्ण प्रतिशत बताइए।`, `निकटतम पूर्ण प्रतिशत में, सभी चयनित उम्मीदवारों में ${n} की हिस्सेदारी कितनी है?`, `${n} से चयनित उम्मीदवार कुल चयनित उम्मीदवारों का कितने प्रतिशत हैं? निकटतम पूर्ण प्रतिशत तक पूर्णांकित कीजिए।`];
      const P=[`${n} ਤੋਂ ਚੁਣੇ ਉਮੀਦਵਾਰ, ਸਾਰੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ਲਗਭਗ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਨ? ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ ਦਿਓ।`, `ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ, ਸਾਰੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚ ${n} ਦਾ ਹਿੱਸਾ ਕਿੰਨਾ ਹੈ?`, `${n} ਤੋਂ ਚੁਣੇ ਉਮੀਦਵਾਰ ਕੁੱਲ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਨ? ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਤੱਕ ਗੋਲ ਕਰੋ।`];
      return (h?H:P)[s]!;
    }
    case "COMBINED_REJECTED": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`${a} और ${b} से मिलाकर कितने आवेदक चयनित नहीं हुए?`, `${a} और ${b} में चयनित न होने वाले उम्मीदवारों की संयुक्त संख्या ज्ञात कीजिए।`, `${a} और ${b} के चयनित न होने वाले उम्मीदवारों की संख्या ज्ञात करके उनका कुल बताइए।`];
      const P=[`${a} ਅਤੇ ${b} ਤੋਂ ਇਕੱਠੇ ਕਿੰਨੇ ਅਰਜ਼ੀਕਾਰ ਚੁਣੇ ਨਹੀਂ ਗਏ?`, `${a} ਅਤੇ ${b} ਵਿੱਚ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਮਿਲੀ ਗਿਣਤੀ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਕੁੱਲ ਦਿਓ।`];
      return (h?H:P)[s]!;
    }
    case "APPLICANTS_RATIO": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`${a} और ${b} के आवेदकों की संख्या का अनुपात क्या है?`, `${a} और ${b} के आवेदकों की संख्या का अनुपात इसी क्रम में ज्ञात कीजिए।`, `${a} और ${b} के आवेदकों की संख्या किस अनुपात में है?`];
      const P=[`${a} ਅਤੇ ${b} ਦੇ ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੇ ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ?`];
      return (h?H:P)[s]!;
    }
    case "AVERAGE_SELECTED_THREE_ROWS": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex)),c=r(Number(e.thirdIndex));
      const H=[`${a}, ${b} और ${c} से चयनित उम्मीदवारों की औसत संख्या कितनी है?`, `${a}, ${b} और ${c} के चयनित उम्मीदवारों की औसत संख्या ज्ञात कीजिए।`, `${a}, ${b} और ${c} में औसतन कितने उम्मीदवार चुने गए?`];
      const P=[`${a}, ${b} ਅਤੇ ${c} ਤੋਂ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?`, `${a}, ${b} ਅਤੇ ${c} ਦੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਔਸਤ ਗਿਣਤੀ ਕੱਢੋ।`, `${a}, ${b} ਅਤੇ ${c} ਵਿੱਚ ਔਸਤਨ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ?`];
      return (h?H:P)[s]!;
    }
    case "COMBINED_SELECTED_RATIO": {
      const a=r(Number(e.leftA)),b=r(Number(e.leftB)),c=r(Number(e.rightA)),d=r(Number(e.rightB));
      const H=[`${a} और ${b} से कुल चयनित उम्मीदवारों का ${c} और ${d} से कुल चयनित उम्मीदवारों से अनुपात क्या है?`, `${a} व ${b} के चयनित कुल का ${c} व ${d} के चयनित कुल से अनुपात ज्ञात कीजिए।`, `${a} और ${b} से मिलाकर चयनित उम्मीदवार, ${c} और ${d} से मिलाकर चयनित उम्मीदवारों के किस अनुपात में हैं?`];
      const P=[`${a} ਅਤੇ ${b} ਤੋਂ ਕੁੱਲ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ${c} ਅਤੇ ${d} ਤੋਂ ਕੁੱਲ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਦੇ ਚੁਣੇ ਕੁੱਲ ਦਾ ${c} ਅਤੇ ${d} ਦੇ ਚੁਣੇ ਕੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `${a} ਅਤੇ ${b} ਤੋਂ ਇਕੱਠੇ ਚੁਣੇ ਉਮੀਦਵਾਰ, ${c} ਅਤੇ ${d} ਤੋਂ ਇਕੱਠੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੇ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ?`];
      return (h?H:P)[s]!;
    }
    case "RELATIVE_SELECTED_PERCENT_EXCESS": {
      const a=r(Number(e.largerIndex)),b=r(Number(e.smallerIndex));
      const H=[`${a} से चयनित उम्मीदवारों की संख्या, ${b} से चयनित संख्या से लगभग कितने प्रतिशत अधिक है? निकटतम पूर्ण प्रतिशत बताइए।`, `${a} से चयनित उम्मीदवारों की संख्या ${b} से कितने प्रतिशत अधिक है? निकटतम पूर्ण प्रतिशत तक पूर्णांकित कीजिए।`, `${b} से चयनित संख्या को आधार मानकर, ${a} से चयनित संख्या कितने प्रतिशत अधिक है?`];
      const P=[`${a} ਤੋਂ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ, ${b} ਤੋਂ ਚੁਣੀ ਗਿਣਤੀ ਨਾਲੋਂ ਲਗਭਗ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ? ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਾ ਪ੍ਰਤੀਸ਼ਤ ਦਿਓ।`, `${a} ਤੋਂ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ${b} ਨਾਲੋਂ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ? ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਤੱਕ ਗੋਲ ਕਰੋ।`, `${b} ਤੋਂ ਚੁਣੀ ਗਿਣਤੀ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ, ${a} ਤੋਂ ਚੁਣੀ ਗਿਣਤੀ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`];
      return (h?H:P)[s]!;
    }
    case "COMBINED_SELECTION_RATE": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`यदि ${a} और ${b} को साथ माना जाए, तो उनकी कुल चयन दर निकटतम पूर्ण प्रतिशत में कितनी है?`, `${a} और ${b} के लिए संयुक्त चयन प्रतिशत ज्ञात कीजिए। निकटतम पूर्ण प्रतिशत तक पूर्णांकित कीजिए।`, `${a} और ${b} के सभी आवेदकों में लगभग कितने प्रतिशत उम्मीदवार चयनित हुए?`];
      const P=[`ਜੇ ${a} ਅਤੇ ${b} ਨੂੰ ਇਕੱਠੇ ਮੰਨਿਆ ਜਾਵੇ, ਤਾਂ ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਚੋਣ ਦਰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕਿੰਨੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਲਈ ਕੁੱਲ ਚੋਣ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ। ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰੇ ਪ੍ਰਤੀਸ਼ਤ ਤੱਕ ਗੋਲ ਕਰੋ।`, `${a} ਅਤੇ ${b} ਦੇ ਸਾਰੇ ਅਰਜ਼ੀਕਾਰਾਂ ਵਿੱਚ ਲਗਭਗ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਉਮੀਦਵਾਰ ਚੁਣੇ ਗਏ?`];
      return (h?H:P)[s]!;
    }
    case "REJECTED_TO_SELECTED_RATIO": {
      const a=r(Number(e.firstIndex)),b=r(Number(e.secondIndex));
      const H=[`${a} और ${b} को मिलाकर, चयनित न होने वाले उम्मीदवारों और चयनित उम्मीदवारों का अनुपात क्या है?`, `${a} और ${b} के लिए चयनित न होने वाले उम्मीदवारों का चयनित उम्मीदवारों से अनुपात ज्ञात कीजिए।`, `दोनों पंक्तियों को मिलाने पर चयनित न होने वाले और चयनित उम्मीदवारों की संख्या का अनुपात क्या है?`];
      const P=[`${a} ਅਤੇ ${b} ਨੂੰ ਮਿਲਾ ਕੇ, ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਅਤੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`, `${a} ਅਤੇ ${b} ਲਈ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰਾਂ ਦਾ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਨਾਲ ਅਨੁਪਾਤ ਕੱਢੋ।`, `ਦੋਵੇਂ ਕਤਾਰਾਂ ਨੂੰ ਮਿਲਾਉਣ 'ਤੇ ਨਾ ਚੁਣੇ ਗਏ ਅਤੇ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`];
      return (h?H:P)[s]!;
    }
  }
}

function explanation(question:Di002V2Question, stimulus:Di002V2Stimulus, locale:Di002LocalizationLocale) {
  const h=isHindi(locale), apps=actualApplicants(stimulus), sel=stimulus.rows.map(r=>r.selected), rej=apps.map((v,i)=>v-sel[i]!);
  const r=(i:number)=>rowName(stimulus,locale,i), e=question.evidence;
  const pct=(n:number,d:number)=>Math.round(n*100/d);
  switch(question.kind) {
    case "SELECTED_DIFFERENCE": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),d=Math.abs(sel[a]!-sel[b]!);
      return {keyIdea:h?"दोनों चयनित मानों का अंतर निकालें।":"ਦੋਵੇਂ ਚੁਣੇ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।",steps:[`${r(a)} = ${sel[a]}, ${r(b)} = ${sel[b]}।`,h?`अंतर = ${Math.max(sel[a]!,sel[b]!)} - ${Math.min(sel[a]!,sel[b]!)} = ${d}।`:`ਅੰਤਰ = ${Math.max(sel[a]!,sel[b]!)} - ${Math.min(sel[a]!,sel[b]!)} = ${d}।`]};
    }
    case "COMBINED_SELECTED": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),n=sel[a]!+sel[b]!;
      return {keyIdea:h?"दोनों चयनित मान जोड़ें।":"ਦੋਵੇਂ ਚੁਣੇ ਮੁੱਲ ਜੋੜੋ।",steps:[`${r(a)} = ${sel[a]}, ${r(b)} = ${sel[b]}।`,h?`कुल चयनित = ${sel[a]} + ${sel[b]} = ${n}।`:`ਕੁੱਲ ਚੁਣੇ = ${sel[a]} + ${sel[b]} = ${n}।`]};
    }
    case "MISSING_APPLICANTS_FROM_RATE": {
      const i=Number(e.targetIndex), row=stimulus.rows[i]!;
      return {keyIdea:h?"चयनित संख्या, आवेदकों का दिया गया प्रतिशत है; इसलिए प्रतिशत को उलटकर आवेदकों की संख्या ज्ञात करें।":"ਚੁਣੀ ਗਿਣਤੀ, ਅਰਜ਼ੀਕਾਰਾਂ ਦਾ ਦਿੱਤਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ; ਇਸ ਲਈ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਉਲਟ ਕੇ ਅਰਜ਼ੀਕਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।",steps:[h?`${row.selectionPercent}% आवेदक = ${row.selected} चयनित।`:`${row.selectionPercent}% ਅਰਜ਼ੀਕਾਰ = ${row.selected} ਚੁਣੇ।`,h?`आवेदक = ${row.selected} × 100 / ${row.selectionPercent} = ${apps[i]}।`:`ਅਰਜ਼ੀਕਾਰ = ${row.selected} × 100 / ${row.selectionPercent} = ${apps[i]}।`],workingTable:{headers:h?["चयनित","चयन %","आवेदक"]:["ਚੁਣੇ","ਚੋਣ %","ਅਰਜ਼ੀਕਾਰ"],rows:[[String(row.selected),`${row.selectionPercent}%`,String(apps[i])]]}};
    }
    case "REJECTED_COUNT": {
      const i=Number(e.targetIndex);
      return {keyIdea:h?"चयनित न होने वाले उम्मीदवार = आवेदक - चयनित।":"ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ = ਅਰਜ਼ੀਕਾਰ - ਚੁਣੇ।",steps:[h?`${r(i)}: आवेदक = ${apps[i]}, चयनित = ${sel[i]}।`:`${r(i)}: ਅਰਜ਼ੀਕਾਰ = ${apps[i]}, ਚੁਣੇ = ${sel[i]}।`,h?`चयनित नहीं = ${apps[i]} - ${sel[i]} = ${rej[i]}।`:`ਨਾ ਚੁਣੇ = ${apps[i]} - ${sel[i]} = ${rej[i]}।`]};
    }
    case "SELECTED_SHARE_OF_TOTAL": {
      const i=Number(e.targetIndex),total=sel.reduce((a,b)=>a+b,0),p=pct(sel[i]!,total);
      return {keyIdea:h?"पूरे चयनित कॉलम का कुल निकालकर संबंधित पंक्ति को उस कुल से भाग दें।":"ਪੂਰੇ ਚੁਣੇ ਕਾਲਮ ਦਾ ਕੁੱਲ ਕੱਢ ਕੇ ਸੰਬੰਧਿਤ ਕਤਾਰ ਨੂੰ ਉਸ ਕੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ।",steps:[h?`सभी चयनित = ${sel.join(" + ")} = ${total}।`:`ਸਾਰੇ ਚੁਣੇ = ${sel.join(" + ")} = ${total}।`,`${sel[i]}/${total} × 100 ≈ ${p}%।`]};
    }
    case "COMBINED_REJECTED": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),n=rej[a]!+rej[b]!;
      return {keyIdea:h?"दोनों पंक्तियों में चयनित न होने वाले उम्मीदवार अलग-अलग निकालें, फिर जोड़ें।":"ਦੋਵੇਂ ਕਤਾਰਾਂ ਵਿੱਚ ਨਾ ਚੁਣੇ ਗਏ ਉਮੀਦਵਾਰ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਜੋੜੋ।",steps:[`${r(a)}: ${apps[a]} - ${sel[a]} = ${rej[a]}।`,`${r(b)}: ${apps[b]} - ${sel[b]} = ${rej[b]}।`,h?`संयुक्त कुल = ${rej[a]} + ${rej[b]} = ${n}।`:`ਕੁੱਲ = ${rej[a]} + ${rej[b]} = ${n}।`]};
    }
    case "APPLICANTS_RATIO": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex);
      return {keyIdea:h?"दोनों आवेदक मान उसी क्रम में लेकर अनुपात सरल करें।":"ਦੋਵੇਂ ਅਰਜ਼ੀਕਾਰ ਮੁੱਲ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲੈ ਕੇ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",steps:[`${r(a)} = ${apps[a]}, ${r(b)} = ${apps[b]}।`,`${apps[a]}:${apps[b]} = ${question.answer}।`]};
    }
    case "AVERAGE_SELECTED_THREE_ROWS": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),c=Number(e.thirdIndex),n=sel[a]!+sel[b]!+sel[c]!;
      return {keyIdea:h?"तीनों चयनित मान जोड़कर 3 से भाग दें।":"ਤਿੰਨੇ ਚੁਣੇ ਮੁੱਲ ਜੋੜ ਕੇ 3 ਨਾਲ ਭਾਗ ਦਿਓ।",steps:[h?`कुल चयनित = ${sel[a]} + ${sel[b]} + ${sel[c]} = ${n}।`:`ਕੁੱਲ ਚੁਣੇ = ${sel[a]} + ${sel[b]} + ${sel[c]} = ${n}।`,h?`औसत = ${n}/3 = ${question.answer}।`:`ਔਸਤ = ${n}/3 = ${question.answer}।`]};
    }
    case "COMBINED_SELECTED_RATIO": {
      const a=Number(e.leftA),b=Number(e.leftB),c=Number(e.rightA),d=Number(e.rightB),x=sel[a]!+sel[b]!,y=sel[c]!+sel[d]!;
      return {keyIdea:h?"पहले दोनों समूहों के चयनित उपकुल निकालें, फिर उनका अनुपात सरल करें।":"ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦੇ ਚੁਣੇ ਉਪ-ਕੁੱਲ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",steps:[`${r(a)} + ${r(b)}: ${sel[a]} + ${sel[b]} = ${x}।`,`${r(c)} + ${r(d)}: ${sel[c]} + ${sel[d]} = ${y}।`,`${x}:${y} = ${question.answer}।`],workingTable:{headers:h?["समूह","चयनित उपकुल"]:["ਸਮੂਹ","ਚੁਣੇ ਉਪ-ਕੁੱਲ"],rows:[[h?"पहला समूह":"ਪਹਿਲਾ ਸਮੂਹ",String(x)],[h?"दूसरा समूह":"ਦੂਜਾ ਸਮੂਹ",String(y)]]}};
    }
    case "RELATIVE_SELECTED_PERCENT_EXCESS": {
      const a=Number(e.largerIndex),b=Number(e.smallerIndex),d=sel[a]!-sel[b]!,p=pct(d,sel[b]!);
      return {keyIdea:h?"'प्रतिशत अधिक' के लिए अंतर को छोटे/आधार मान से भाग दें।":"‘ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ’ ਲਈ ਅੰਤਰ ਨੂੰ ਛੋਟੇ/ਆਧਾਰ ਮੁੱਲ ਨਾਲ ਭਾਗ ਦਿਓ।",steps:[h?`अंतर = ${sel[a]} - ${sel[b]} = ${d}।`:`ਅੰਤਰ = ${sel[a]} - ${sel[b]} = ${d}।`,h?`आधार = ${sel[b]}।`:`ਆਧਾਰ = ${sel[b]}।`,`${d}/${sel[b]} × 100 ≈ ${p}%।`]};
    }
    case "COMBINED_SELECTION_RATE": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),ss=sel[a]!+sel[b]!,aa=apps[a]!+apps[b]!,p=pct(ss,aa);
      return {keyIdea:h?"संयुक्त चयन दर के लिए संयुक्त चयनित को संयुक्त आवेदकों से भाग दें।":"ਕੁੱਲ ਚੋਣ ਦਰ ਲਈ ਕੁੱਲ ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਕੁੱਲ ਅਰਜ਼ੀਕਾਰਾਂ ਨਾਲ ਭਾਗ ਦਿਓ।",steps:[h?`संयुक्त चयनित = ${sel[a]} + ${sel[b]} = ${ss}।`:`ਕੁੱਲ ਚੁਣੇ = ${sel[a]} + ${sel[b]} = ${ss}।`,h?`संयुक्त आवेदक = ${apps[a]} + ${apps[b]} = ${aa}।`:`ਕੁੱਲ ਅਰਜ਼ੀਕਾਰ = ${apps[a]} + ${apps[b]} = ${aa}।`,`${ss}/${aa} × 100 ≈ ${p}%।`],workingTable:{headers:h?["पंक्तियाँ","आवेदक","चयनित"]:["ਕਤਾਰਾਂ","ਅਰਜ਼ੀਕਾਰ","ਚੁਣੇ"],rows:[[`${r(a)} + ${r(b)}`,String(aa),String(ss)]]}};
    }
    case "REJECTED_TO_SELECTED_RATIO": {
      const a=Number(e.firstIndex),b=Number(e.secondIndex),rr=rej[a]!+rej[b]!,ss=sel[a]!+sel[b]!;
      return {keyIdea:h?"दोनों पंक्तियों के चयनित न होने वाले और चयनित कुल अलग-अलग निकालें, फिर अनुपात सरल करें।":"ਦੋਵੇਂ ਕਤਾਰਾਂ ਦੇ ਨਾ ਚੁਣੇ ਅਤੇ ਚੁਣੇ ਕੁੱਲ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",steps:[`${r(a)}: ${apps[a]} - ${sel[a]} = ${rej[a]}; ${r(b)}: ${apps[b]} - ${sel[b]} = ${rej[b]}।`,h?`चयनित नहीं = ${rej[a]} + ${rej[b]} = ${rr}; चयनित = ${sel[a]} + ${sel[b]} = ${ss}।`:`ਨਾ ਚੁਣੇ = ${rej[a]} + ${rej[b]} = ${rr}; ਚੁਣੇ = ${sel[a]} + ${sel[b]} = ${ss}।`,`${rr}:${ss} = ${question.answer}।`],workingTable:{headers:h?["पंक्ति","आवेदक","चयनित","चयनित नहीं"]:["ਕਤਾਰ","ਅਰਜ਼ੀਕਾਰ","ਚੁਣੇ","ਨਾ ਚੁਣੇ"],rows:[[r(a),String(apps[a]),String(sel[a]),String(rej[a])],[r(b),String(apps[b]),String(sel[b]),String(rej[b])]]}};
    }
  }
}

export function localizeDi002Question(source:ReturnType<typeof generateDi002PermanentQuestion>,locale:Di002LocalizationLocale) {
  return {
    packageId:"DI-002" as const,
    requestedSeed:source.requestedSeed,
    sourceSeed:source.sourceSeed,
    examProfile:source.examProfile,
    language:locale==="hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId:DI002_LOCALIZATION_REVIEW_ID,
    localizationStatus:"HI_PA_REVIEW_CANDIDATE" as const,
    sourceEnglishStatus:"ENGLISH_REVIEW_APPROVED" as const,
    stimulus:localizeDi002Stimulus(source.stimulus,locale),
    question:{
      ...source.question,
      stem:stem(source.question,source.stimulus,locale),
      explanation:explanation(source.question,source.stimulus,locale),
    },
    validation:source.validation,
    traceability:{
      ...source.traceability,
      reviewStatus:"MULTILINGUAL_REVIEW_CANDIDATE" as const,
      localizationStatus:"HI_PA_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable:false as const,
      questionBankStatus:"NOT_STORED" as const,
      questionBankWritable:false as const,
      testEligibility:"INELIGIBLE" as const,
      testEligible:false as const,
      mockTestEligible:false as const,
      publiclyPublishable:false as const,
      automaticStudentPublication:false as const,
      productionReleaseAuthorized:false as const,
    },
  };
}

export function generateDi002LocalizedReviewQuestion(input:{
  seed:string;
  examProfile:Di002V2ExamProfile;
  taskKind:Di002V2TaskKind;
  locale:Di002LocalizationLocale;
}) {
  return localizeDi002Question(generateDi002PermanentQuestion({seed:input.seed,examProfile:input.examProfile,taskKind:input.taskKind}),input.locale);
}
