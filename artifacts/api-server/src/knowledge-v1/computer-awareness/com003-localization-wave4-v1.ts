import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave2-freeze-v1";
import { COM003_LOCALIZATION_WAVE3_AUTHORITY_V2 } from "./com003-localization-wave3-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import type { Com003ReviewQuestion } from "./com003-review-types";
import type { Com003TargetLanguage, Com003TargetLocale } from "./com003-localization-packet-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

type Bilingual = { hi: string; pa: string };
type Wave4Fact = { entity: string; description: Bilingual };

const WAVE4_QL_IDS = ["COM-003-QL-015", "COM-003-QL-016", "COM-003-QL-017", "COM-003-QL-018", "COM-003-QL-019"] as const;
const WAVE4_QL_SET = new Set<string>(WAVE4_QL_IDS);

const TERM_TRANSLATIONS: Record<string, Bilingual> = {
  "PowerPoint presentation": { hi: "PowerPoint Presentation (प्रेज़ेंटेशन)", pa: "PowerPoint Presentation (ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ)" },
  "Slide": { hi: "Slide (स्लाइड)", pa: "Slide (ਸਲਾਈਡ)" },
  "PowerPoint slide": { hi: "PowerPoint Slide (स्लाइड)", pa: "PowerPoint Slide (ਸਲਾਈਡ)" },
  "Word document": { hi: "Word Document (वर्ड दस्तावेज़)", pa: "Word Document (ਵਰਡ ਦਸਤਾਵੇਜ਼)" },
  "Excel workbook": { hi: "Excel Workbook (वर्कबुक)", pa: "Excel Workbook (ਵਰਕਬੁੱਕ)" },
  "Excel worksheet": { hi: "Excel Worksheet (वर्कशीट)", pa: "Excel Worksheet (ਵਰਕਸ਼ੀਟ)" },
  "Slide layout": { hi: "Slide Layout (स्लाइड लेआउट)", pa: "Slide Layout (ਸਲਾਈਡ ਲੇਆਉਟ)" },
  "Placeholder": { hi: "Placeholder (प्लेसहोल्डर)", pa: "Placeholder (ਪਲੇਸਹੋਲਡਰ)" },
  "Theme": { hi: "Theme (थीम)", pa: "Theme (ਥੀਮ)" },
  "Presentation template": { hi: "Presentation Template (प्रेज़ेंटेशन टेम्पलेट)", pa: "Presentation Template (ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਟੈਮਪਲੇਟ)" },
  "Picture": { hi: "Picture (चित्र)", pa: "Picture (ਤਸਵੀਰ)" },
  "Table": { hi: "Table (तालिका)", pa: "Table (ਟੇਬਲ)" },
  "Chart": { hi: "Chart (चार्ट)", pa: "Chart (ਚਾਰਟ)" },
  "Shape": { hi: "Shape (आकृति)", pa: "Shape (ਆਕ੍ਰਿਤੀ)" },
  "Slide transition": { hi: "Slide Transition (स्लाइड ट्रांज़िशन)", pa: "Slide Transition (ਸਲਾਈਡ ਟ੍ਰਾਂਜ਼ਿਸ਼ਨ)" },
  "Transition": { hi: "Transition (ट्रांज़िशन)", pa: "Transition (ਟ੍ਰਾਂਜ਼ਿਸ਼ਨ)" },
  "Animation": { hi: "Animation (एनीमेशन)", pa: "Animation (ਐਨੀਮੇਸ਼ਨ)" },
  "Transition duration": { hi: "Transition Duration (ट्रांज़िशन अवधि)", pa: "Transition Duration (ਟ੍ਰਾਂਜ਼ਿਸ਼ਨ ਅਵਧੀ)" },
  "Automatic slide advance timing": { hi: "Automatic Slide Advance Timing (स्वचालित स्लाइड अग्रेषण समय)", pa: "Automatic Slide Advance Timing (ਆਟੋਮੈਟਿਕ ਸਲਾਈਡ ਅੱਗੇ ਵਧਣ ਦਾ ਸਮਾਂ)" },
};

const DESCRIPTION_TRANSLATIONS: Record<string, Bilingual> = {
  "edit the active cell": { hi: "active cell को edit करना", pa: "active cell ਨੂੰ edit ਕਰਨਾ" },
  "open the Go To dialog": { hi: "Go To dialog खोलना", pa: "Go To dialog ਖੋਲ੍ਹਣਾ" },
  "open the Format Cells dialog": { hi: "Format Cells dialog खोलना", pa: "Format Cells dialog ਖੋਲ੍ਹਣਾ" },
  "open the column-width command through Windows desktop Excel Ribbon access keys": { hi: "Windows desktop Excel Ribbon access keys से Column Width command खोलना", pa: "Windows desktop Excel Ribbon access keys ਨਾਲ Column Width command ਖੋਲ੍ਹਣਾ" },
  "is organized as a sequence or collection of slides used to present information": { hi: "जानकारी प्रस्तुत करने के लिए slides के sequence या collection के रूप में व्यवस्थित होता है", pa: "ਜਾਣਕਾਰੀ ਪੇਸ਼ ਕਰਨ ਲਈ slides ਦੇ sequence ਜਾਂ collection ਵਜੋਂ ਵਿਵਸਥਿਤ ਹੁੰਦਾ ਹੈ" },
  "an individual presentation page/screen within a PowerPoint presentation": { hi: "PowerPoint presentation के भीतर एक individual presentation page या screen होता है", pa: "PowerPoint presentation ਦੇ ਅੰਦਰ ਇੱਕ individual presentation page ਜਾਂ screen ਹੁੰਦਾ ਹੈ" },
  "controls the arrangement and positioning of placeholders and slide content areas": { hi: "placeholders और slide content areas की arrangement और position नियंत्रित करता है", pa: "placeholders ਅਤੇ slide content areas ਦੀ arrangement ਅਤੇ position ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ" },
  "a container on a slide layout that can hold content such as text, tables, charts, pictures or media": { hi: "slide layout पर एक container होता है जिसमें text, tables, charts, pictures या media रखा जा सकता है", pa: "slide layout ਉੱਤੇ ਇੱਕ container ਹੁੰਦਾ ਹੈ ਜਿਸ ਵਿੱਚ text, tables, charts, pictures ਜਾਂ media ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ" },
  "provides coordinated design elements such as colors, fonts, effects and background styling": { hi: "colors, fonts, effects और background styling जैसे coordinated design elements देता है", pa: "colors, fonts, effects ਅਤੇ background styling ਵਰਗੇ coordinated design elements ਦਿੰਦਾ ਹੈ" },
  "provides a predefined starting design/structure for creating a presentation": { hi: "presentation बनाने के लिए predefined starting design या structure देता है", pa: "presentation ਬਣਾਉਣ ਲਈ predefined starting design ਜਾਂ structure ਦਿੰਦਾ ਹੈ" },
  "can be inserted as visual content on a slide": { hi: "slide पर visual content के रूप में insert किया जा सकता है", pa: "slide ਉੱਤੇ visual content ਵਜੋਂ insert ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ" },
  "can be inserted on a slide to organize data in rows and columns": { hi: "rows और columns में data व्यवस्थित करने के लिए slide पर insert किया जा सकता है", pa: "rows ਅਤੇ columns ਵਿੱਚ data ਵਿਵਸਥਿਤ ਕਰਨ ਲਈ slide ਉੱਤੇ insert ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ" },
  "can be inserted on a slide to visualize data": { hi: "data को visualize करने के लिए slide पर insert किया जा सकता है", pa: "data ਨੂੰ visualize ਕਰਨ ਲਈ slide ਉੱਤੇ insert ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ" },
  "an effect associated with moving from one slide to the next": { hi: "एक slide से अगली slide पर जाने से जुड़ा effect होता है", pa: "ਇੱਕ slide ਤੋਂ ਅਗਲੀ slide ਵੱਲ ਜਾਣ ਨਾਲ ਜੁੜਿਆ effect ਹੁੰਦਾ ਹੈ" },
  "an effect applied to an object or text on a slide": { hi: "slide पर किसी object या text पर लागू किया जाने वाला effect होता है", pa: "slide ਉੱਤੇ ਕਿਸੇ object ਜਾਂ text 'ਤੇ ਲਾਗੂ ਕੀਤਾ ਜਾਣ ਵਾਲਾ effect ਹੁੰਦਾ ਹੈ" },
  "controls how long the transition effect takes; a shorter duration makes it complete faster": { hi: "transition effect को पूरा होने में लगने वाला समय नियंत्रित करता है; कम duration इसे जल्दी पूरा करती है", pa: "transition effect ਨੂੰ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ; ਘੱਟ duration ਇਸਨੂੰ ਜਲਦੀ ਪੂਰਾ ਕਰਦੀ ਹੈ" },
  "specifies time spent on a slide before advancing automatically to the next slide": { hi: "अगली slide पर अपने आप जाने से पहले वर्तमान slide पर बिताया जाने वाला समय तय करता है", pa: "ਅਗਲੀ slide ਵੱਲ ਆਪਣੇ ਆਪ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਮੌਜੂਦਾ slide ਉੱਤੇ ਬਿਤਾਇਆ ਜਾਣ ਵਾਲਾ ਸਮਾਂ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ" },
  "start the slide show from the beginning": { hi: "slide show को शुरुआत से शुरू करना", pa: "slide show ਨੂੰ ਸ਼ੁਰੂ ਤੋਂ ਚਲਾਉਣਾ" },
  "start the slide show from the current slide": { hi: "slide show को current slide से शुरू करना", pa: "slide show ਨੂੰ current slide ਤੋਂ ਚਲਾਉਣਾ" },
};

const FACTS: Record<string, Wave4Fact> = {
  "com003-excel-shortcut-f2": { entity: "F2", description: DESCRIPTION_TRANSLATIONS["edit the active cell"]! },
  "com003-excel-shortcut-ctrl-g": { entity: "Ctrl+G", description: DESCRIPTION_TRANSLATIONS["open the Go To dialog"]! },
  "com003-excel-shortcut-ctrl-1": { entity: "Ctrl+1", description: DESCRIPTION_TRANSLATIONS["open the Format Cells dialog"]! },
  "com003-excel-shortcut-alt-h-o-w": { entity: "Alt+H, O, W", description: DESCRIPTION_TRANSLATIONS["open the column-width command through Windows desktop Excel Ribbon access keys"]! },
  "com003-powerpoint-presentation-slides": { entity: "PowerPoint presentation", description: DESCRIPTION_TRANSLATIONS["is organized as a sequence or collection of slides used to present information"]! },
  "com003-powerpoint-slide-unit": { entity: "Slide", description: DESCRIPTION_TRANSLATIONS["an individual presentation page/screen within a PowerPoint presentation"]! },
  "com003-powerpoint-layout-role": { entity: "Slide layout", description: DESCRIPTION_TRANSLATIONS["controls the arrangement and positioning of placeholders and slide content areas"]! },
  "com003-powerpoint-placeholder-role": { entity: "Placeholder", description: DESCRIPTION_TRANSLATIONS["a container on a slide layout that can hold content such as text, tables, charts, pictures or media"]! },
  "com003-powerpoint-theme-role": { entity: "Theme", description: DESCRIPTION_TRANSLATIONS["provides coordinated design elements such as colors, fonts, effects and background styling"]! },
  "com003-powerpoint-template-role": { entity: "Presentation template", description: DESCRIPTION_TRANSLATIONS["provides a predefined starting design/structure for creating a presentation"]! },
  "com003-powerpoint-insert-picture": { entity: "Picture", description: DESCRIPTION_TRANSLATIONS["can be inserted as visual content on a slide"]! },
  "com003-powerpoint-insert-table": { entity: "Table", description: DESCRIPTION_TRANSLATIONS["can be inserted on a slide to organize data in rows and columns"]! },
  "com003-powerpoint-insert-chart": { entity: "Chart", description: DESCRIPTION_TRANSLATIONS["can be inserted on a slide to visualize data"]! },
  "com003-powerpoint-transition-definition": { entity: "Slide transition", description: DESCRIPTION_TRANSLATIONS["an effect associated with moving from one slide to the next"]! },
  "com003-powerpoint-animation-definition": { entity: "Animation", description: DESCRIPTION_TRANSLATIONS["an effect applied to an object or text on a slide"]! },
  "com003-powerpoint-transition-duration": { entity: "Transition duration", description: DESCRIPTION_TRANSLATIONS["controls how long the transition effect takes; a shorter duration makes it complete faster"]! },
  "com003-powerpoint-auto-advance-time": { entity: "Automatic slide advance timing", description: DESCRIPTION_TRANSLATIONS["specifies time spent on a slide before advancing automatically to the next slide"]! },
  "com003-powerpoint-shortcut-f5": { entity: "F5", description: DESCRIPTION_TRANSLATIONS["start the slide show from the beginning"]! },
  "com003-powerpoint-shortcut-shift-f5": { entity: "Shift+F5", description: DESCRIPTION_TRANSLATIONS["start the slide show from the current slide"]! },
};

const SHORTCUT = /^(?:F2|F5|Shift\+F5|Ctrl\+[A-Z1]|Alt\+H, O, W)$/;
function locale(language: Com003TargetLanguage): Com003TargetLocale { return language === "hi" ? "hi-IN" : "pa-IN"; }
function t(value: Bilingual, language: Com003TargetLanguage) { return value[language]; }
function translateOption(value: string, language: Com003TargetLanguage) {
  if (SHORTCUT.test(value) || /^(?:Ctrl\+S|Ctrl\+P|Ctrl\+F)$/.test(value)) return value;
  const term = TERM_TRANSLATIONS[value];
  if (term) return t(term, language);
  const description = DESCRIPTION_TRANSLATIONS[value];
  if (description) return t(description, language);
  throw new Error(`COM-003 Wave-4 missing option translation: ${value}`);
}
function targetFact(question: Com003ReviewQuestion) {
  const fact = FACTS[question.targetFactId];
  if (!fact) throw new Error(`COM-003 Wave-4 missing target fact localization: ${question.targetFactId}`);
  return fact;
}

const HI_LEADS = ["दिए गए तथ्य के आधार पर", "मानक desktop व्यवहार में", "सही PowerPoint/Excel mapping में", "प्रश्न के मुख्य संकेत से", "तकनीकी परिभाषा के अनुसार", "प्रतियोगी परीक्षा के संदर्भ में", "विकल्पों की तुलना करने पर", "मानक Office शब्दावली में", "इस feature के वास्तविक scope के अनुसार", "सही shortcut/concept मिलाने पर", "canonical fact के अनुसार", "यहाँ निर्णायक तथ्य यह है कि"];
const PA_LEADS = ["ਦਿੱਤੇ ਤੱਥ ਦੇ ਆਧਾਰ 'ਤੇ", "ਮਿਆਰੀ desktop ਵਿਵਹਾਰ ਵਿੱਚ", "ਸਹੀ PowerPoint/Excel mapping ਵਿੱਚ", "ਪ੍ਰਸ਼ਨ ਦੇ ਮੁੱਖ ਸੰਕੇਤ ਤੋਂ", "ਤਕਨੀਕੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ", "ਮੁਕਾਬਲਾ ਪਰੀਖਿਆ ਦੇ ਸੰਦਰਭ ਵਿੱਚ", "ਵਿਕਲਪਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ 'ਤੇ", "ਮਿਆਰੀ Office ਸ਼ਬਦਾਵਲੀ ਵਿੱਚ", "ਇਸ feature ਦੇ ਅਸਲ scope ਅਨੁਸਾਰ", "ਸਹੀ shortcut/concept ਮਿਲਾਉਣ 'ਤੇ", "canonical fact ਅਨੁਸਾਰ", "ਇੱਥੇ ਨਿਰਣਾਇਕ ਤੱਥ ਇਹ ਹੈ ਕਿ"];
function lead(language: Com003TargetLanguage, index: number) { return (language === "hi" ? HI_LEADS : PA_LEADS)[index]!; }

function ql015Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const fact = targetFact(question); const d = t(fact.description, language); const shortcut = fact.entity;
  if (question.surfaceMode === "ACTION_TO_SHORTCUT") {
    const ordinal = [0,2,4,6,8,10].indexOf(index);
    const hi = [`Windows desktop Excel में ${d} के लिए कौन-सा shortcut प्रयोग होता है?`, `इस Windows desktop Excel action के लिए shortcut पहचानिए: ${d}।`, `${d}—इस कार्य का सही Excel desktop shortcut कौन-सा है?`, `Windows desktop संदर्भ में ${d} करने वाला key combination चुनिए।`, `कौन-सा Excel shortcut इस action से मेल खाता है: ${d}?`, `दिए गए Windows desktop Excel task ${d} के लिए सही shortcut कौन-सा है?`];
    const pa = [`Windows desktop Excel ਵਿੱਚ ${d} ਲਈ ਕਿਹੜਾ shortcut ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`, `ਇਸ Windows desktop Excel action ਲਈ shortcut ਪਛਾਣੋ: ${d}।`, `${d}—ਇਸ ਕੰਮ ਦਾ ਸਹੀ Excel desktop shortcut ਕਿਹੜਾ ਹੈ?`, `Windows desktop ਸੰਦਰਭ ਵਿੱਚ ${d} ਕਰਨ ਵਾਲਾ key combination ਚੁਣੋ।`, `ਕਿਹੜਾ Excel shortcut ਇਸ action ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਦਿੱਤੇ Windows desktop Excel task ${d} ਲਈ ਸਹੀ shortcut ਕਿਹੜਾ ਹੈ?`];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [1,3,5,7,9,11].indexOf(index);
  const hi = [`Windows desktop Excel में ${shortcut} क्या करता है?`, `${shortcut} से जुड़ा सही Excel action कौन-सा है?`, `Windows desktop संदर्भ में ${shortcut} का function पहचानिए।`, `${shortcut} किस Excel action को trigger करता है?`, `दिए गए Excel shortcut ${shortcut} का सही उपयोग चुनिए।`, `Windows desktop Excel में ${shortcut} किस कार्य से मेल खाता है?`];
  const pa = [`Windows desktop Excel ਵਿੱਚ ${shortcut} ਕੀ ਕਰਦਾ ਹੈ?`, `${shortcut} ਨਾਲ ਜੁੜਿਆ ਸਹੀ Excel action ਕਿਹੜਾ ਹੈ?`, `Windows desktop ਸੰਦਰਭ ਵਿੱਚ ${shortcut} ਦਾ function ਪਛਾਣੋ।`, `${shortcut} ਕਿਹੜੇ Excel action ਨੂੰ trigger ਕਰਦਾ ਹੈ?`, `ਦਿੱਤੇ Excel shortcut ${shortcut} ਦੀ ਸਹੀ ਵਰਤੋਂ ਚੁਣੋ।`, `Windows desktop Excel ਵਿੱਚ ${shortcut} ਕਿਹੜੇ ਕੰਮ ਨਾਲ ਮਿਲਦਾ ਹੈ?`];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql016Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  if (question.surfaceMode === "CREATION_CONCEPT_FROM_ROLE") {
    const ordinal = [1,3,5,7,9,11].indexOf(index);
    const hi = [`कौन-सा PowerPoint creation concept ${d}?`, `इस presentation-design role से सही concept पहचानिए: ${d}।`, `${d}—यह किस PowerPoint design concept का कार्य है?`, `कौन-सा presentation feature इस definition से मेल खाता है: ${d}?`, `सही PowerPoint creation/design term चुनिए जो ${d}।`, `दिए गए role ${d} के लिए PowerPoint concept कौन-सा है?`];
    const pa = [`ਕਿਹੜਾ PowerPoint creation concept ${d}?`, `ਇਸ presentation-design role ਤੋਂ ਸਹੀ concept ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ PowerPoint design concept ਦਾ ਕੰਮ ਹੈ?`, `ਕਿਹੜਾ presentation feature ਇਸ definition ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ PowerPoint creation/design term ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ role ${d} ਲਈ PowerPoint concept ਕਿਹੜਾ ਹੈ?`];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [0,2,4,6,8,10].indexOf(index);
  const hi = [`कौन-सा PowerPoint artifact/concept ${d}?`, `इस presentation structure description से term पहचानिए: ${d}।`, `${d}—यह किस PowerPoint item का वर्णन है?`, `कौन-सा presentation unit या artifact इस विवरण से मेल खाता है: ${d}?`, `सही PowerPoint structure concept चुनिए जो ${d}।`, `दिए गए presentation description ${d} के लिए सही term कौन-सा है?`];
  const pa = [`ਕਿਹੜਾ PowerPoint artifact/concept ${d}?`, `ਇਸ presentation structure description ਤੋਂ term ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ PowerPoint item ਦਾ ਵਰਣਨ ਹੈ?`, `ਕਿਹੜਾ presentation unit ਜਾਂ artifact ਇਸ ਵਰਣਨ ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ PowerPoint structure concept ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ presentation description ${d} ਲਈ ਸਹੀ term ਕਿਹੜਾ ਹੈ?`];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql017Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  const hi = [`कौन-सा PowerPoint insertable object ${d}?`, `इस purpose से slide object पहचानिए: ${d}।`, `${d}—यह किस object का सही उपयोग है जिसे slide पर insert किया जा सकता है?`, `कौन-सा PowerPoint object इस role से मेल खाता है: ${d}?`, `सही insertable slide object चुनिए जो ${d}।`, `दिए गए presentation-object description ${d} के लिए object कौन-सा है?`, `PowerPoint में ${d} वाला insertable object पहचानिए।`, `कौन-सा slide object इस use-case के लिए उपयुक्त है: ${d}?`, `इस insertable-content role से सही PowerPoint object चुनिए: ${d}।`, `${d} करने के लिए slide पर कौन-सा object insert किया जाता है?`, `निम्न में से कौन-सा PowerPoint object ${d}?`, `दिए गए slide-content purpose ${d} से object का नाम बताइए।`];
  const pa = [`ਕਿਹੜਾ PowerPoint insertable object ${d}?`, `ਇਸ purpose ਤੋਂ slide object ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ object ਦੀ ਸਹੀ ਵਰਤੋਂ ਹੈ ਜਿਸਨੂੰ slide ਉੱਤੇ insert ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?`, `ਕਿਹੜਾ PowerPoint object ਇਸ role ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ insertable slide object ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ presentation-object description ${d} ਲਈ object ਕਿਹੜਾ ਹੈ?`, `PowerPoint ਵਿੱਚ ${d} ਵਾਲਾ insertable object ਪਛਾਣੋ।`, `ਕਿਹੜਾ slide object ਇਸ use-case ਲਈ ਉਚਿਤ ਹੈ: ${d}?`, `ਇਸ insertable-content role ਤੋਂ ਸਹੀ PowerPoint object ਚੁਣੋ: ${d}।`, `${d} ਕਰਨ ਲਈ slide ਉੱਤੇ ਕਿਹੜਾ object insert ਕੀਤਾ ਜਾਂਦਾ ਹੈ?`, `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ PowerPoint object ${d}?`, `ਦਿੱਤੇ slide-content purpose ${d} ਤੋਂ object ਦਾ ਨਾਮ ਦੱਸੋ।`];
  return (language === "hi" ? hi : pa)[index]!;
}

function ql018Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  if (question.surfaceMode === "TIMING_CONCEPT_FROM_EFFECT") {
    const ordinal = [1,3,5,7,9,11].indexOf(index);
    const hi = [`कौन-सा PowerPoint timing concept ${d}?`, `इस timing effect से सही setting पहचानिए: ${d}।`, `${d}—यह किस presentation timing concept का वर्णन है?`, `कौन-सा PowerPoint timing control इस description से मेल खाता है: ${d}?`, `सही timing concept चुनिए जो ${d}।`, `दिए गए slide-transition timing behavior ${d} के लिए term कौन-सा है?`];
    const pa = [`ਕਿਹੜਾ PowerPoint timing concept ${d}?`, `ਇਸ timing effect ਤੋਂ ਸਹੀ setting ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ presentation timing concept ਦਾ ਵਰਣਨ ਹੈ?`, `ਕਿਹੜਾ PowerPoint timing control ਇਸ description ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ timing concept ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ slide-transition timing behavior ${d} ਲਈ term ਕਿਹੜਾ ਹੈ?`];
    return (language === "hi" ? hi : pa)[ordinal]!;
  }
  const ordinal = [0,2,4,6,8,10].indexOf(index);
  const hi = [`कौन-सा PowerPoint effect ${d}?`, `इस scope से presentation effect पहचानिए: ${d}।`, `${d}—यह किस PowerPoint effect की परिभाषा है?`, `कौन-सा effect इस slide/object behavior से मेल खाता है: ${d}?`, `सही PowerPoint effect चुनिए जो ${d}।`, `दिए गए presentation-effect description ${d} के लिए term कौन-सा है?`];
  const pa = [`ਕਿਹੜਾ PowerPoint effect ${d}?`, `ਇਸ scope ਤੋਂ presentation effect ਪਛਾਣੋ: ${d}।`, `${d}—ਇਹ ਕਿਹੜੇ PowerPoint effect ਦੀ ਪਰਿਭਾਸ਼ਾ ਹੈ?`, `ਕਿਹੜਾ effect ਇਸ slide/object behavior ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਸਹੀ PowerPoint effect ਚੁਣੋ ਜੋ ${d}।`, `ਦਿੱਤੇ presentation-effect description ${d} ਲਈ term ਕਿਹੜਾ ਹੈ?`];
  return (language === "hi" ? hi : pa)[ordinal]!;
}

function ql019Stem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  const d = t(targetFact(question).description, language);
  const hi = [`Windows desktop PowerPoint में ${d} के लिए कौन-सा shortcut है?`, `इस slide-show action का सही PowerPoint shortcut पहचानिए: ${d}।`, `Windows desktop PowerPoint में ${d} करने वाला shortcut चुनिए।`, `कौन-सा key combination इस slide-show action से मेल खाता है: ${d}?`, `दिए गए PowerPoint desktop task ${d} के लिए shortcut कौन-सा है?`, `सही shortcut-action pair चुनिए जहाँ action है: ${d}।`, `Windows desktop संदर्भ में slide show को ${d} के लिए कौन-सी key दबाई जाती है?`, `PowerPoint slide-show में ${d}; सही shortcut बताइए।`, `कौन-सा Windows desktop PowerPoint shortcut इस कार्य को करता है: ${d}?`, `दिए गए slide-show start action ${d} का shortcut पहचानिए।`, `${d}—इस PowerPoint action के लिए सही key combination कौन-सा है?`, `Windows desktop PowerPoint में इस action ${d} से मेल खाने वाला shortcut चुनिए।`];
  const pa = [`Windows desktop PowerPoint ਵਿੱਚ ${d} ਲਈ ਕਿਹੜਾ shortcut ਹੈ?`, `ਇਸ slide-show action ਦਾ ਸਹੀ PowerPoint shortcut ਪਛਾਣੋ: ${d}।`, `Windows desktop PowerPoint ਵਿੱਚ ${d} ਕਰਨ ਵਾਲਾ shortcut ਚੁਣੋ।`, `ਕਿਹੜਾ key combination ਇਸ slide-show action ਨਾਲ ਮਿਲਦਾ ਹੈ: ${d}?`, `ਦਿੱਤੇ PowerPoint desktop task ${d} ਲਈ shortcut ਕਿਹੜਾ ਹੈ?`, `ਸਹੀ shortcut-action pair ਚੁਣੋ ਜਿੱਥੇ action ਹੈ: ${d}।`, `Windows desktop ਸੰਦਰਭ ਵਿੱਚ slide show ਨੂੰ ${d} ਲਈ ਕਿਹੜੀ key ਦਬਾਈ ਜਾਂਦੀ ਹੈ?`, `PowerPoint slide-show ਵਿੱਚ ${d}; ਸਹੀ shortcut ਦੱਸੋ।`, `ਕਿਹੜਾ Windows desktop PowerPoint shortcut ਇਹ ਕੰਮ ਕਰਦਾ ਹੈ: ${d}?`, `ਦਿੱਤੇ slide-show start action ${d} ਦਾ shortcut ਪਛਾਣੋ।`, `${d}—ਇਸ PowerPoint action ਲਈ ਸਹੀ key combination ਕਿਹੜਾ ਹੈ?`, `Windows desktop PowerPoint ਵਿੱਚ ਇਸ action ${d} ਨਾਲ ਮਿਲਦਾ shortcut ਚੁਣੋ।`];
  return (language === "hi" ? hi : pa)[index]!;
}

function localizedStem(question: Com003ReviewQuestion, language: Com003TargetLanguage, index: number) {
  switch (question.qlId) {
    case "COM-003-QL-015": return ql015Stem(question, language, index);
    case "COM-003-QL-016": return ql016Stem(question, language, index);
    case "COM-003-QL-017": return ql017Stem(question, language, index);
    case "COM-003-QL-018": return ql018Stem(question, language, index);
    case "COM-003-QL-019": return ql019Stem(question, language, index);
    default: throw new Error(`Unsupported COM-003 Wave-4 QL ${question.qlId}`);
  }
}

function localizedExplanation(question: Com003ReviewQuestion, language: Com003TargetLanguage, answer: string, index: number) {
  const d = t(targetFact(question).description, language); const prefix = lead(language, index);
  if (language === "hi") {
    if (/COM-003-QL-(015|019)/.test(question.qlId)) return `${prefix}, ${answer} सही उत्तर है; Windows desktop context में इसका canonical action ${d}।`;
    return `${prefix}, ${answer} सही उत्तर है क्योंकि canonical PowerPoint fact के अनुसार यह ${d}।`;
  }
  if (/COM-003-QL-(015|019)/.test(question.qlId)) return `${prefix}, ${answer} ਸਹੀ ਉੱਤਰ ਹੈ; Windows desktop context ਵਿੱਚ ਇਸਦਾ canonical action ${d}।`;
  return `${prefix}, ${answer} ਸਹੀ ਉੱਤਰ ਹੈ ਕਿਉਂਕਿ canonical PowerPoint fact ਅਨੁਸਾਰ ਇਹ ${d}।`;
}

function buildWave4(language: Com003TargetLanguage): readonly Com003LocalizedQuestionV1[] {
  if (!COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen) throw new Error("COM-003 English must be frozen before Wave-4 localization.");
  if (!COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1.governance.waveLocalizationFrozen) throw new Error("COM-003 Wave-2 freeze authority is required before Wave-4 authoring.");
  if (COM003_LOCALIZATION_WAVE3_AUTHORITY_V2.totalLocalizedQuestionCount !== 120) throw new Error("COM-003 Wave-3 authored corpus must be complete before Wave-4 authoring.");
  const sources = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) => WAVE4_QL_SET.has(question.qlId));
  if (sources.length !== 60) throw new Error(`COM-003 Wave-4 expected 60 English sources, found ${sources.length}`);
  return sources.map((source, globalIndex) => {
    const index = globalIndex % 12; targetFact(source);
    const options = source.options.map((option) => translateOption(option, language));
    const canonicalAnswer = options[source.correctIndex]!;
    return Object.freeze({
      localizationId: `${source.questionId}:${locale(language)}:AUTHORED-W4-V1`,
      sourceQuestionId: source.questionId, qlId: source.qlId, cpId: source.cpId, surfaceMode: source.surfaceMode,
      targetFactId: source.targetFactId, language, locale: locale(language), stem: localizedStem(source, language, index),
      options, correctIndex: source.correctIndex, canonicalAnswer, explanation: localizedExplanation(source, language, canonicalAnswer, index),
      sourceIds: [...source.sourceIds], sourceFactIds: [...source.sourceFactIds], versionScoped: source.versionScoped,
      solverAuthority: "CANONICAL_FACT_RELATION" as const, sourceEnglishFrozen: true as const, localizationReviewOnly: true as const,
      localizationFrozen: false as const, runtimeRegistered: false as const, productionReleased: false as const,
    });
  });
}

export const COM003_HINDI_LOCALIZATION_WAVE4_V1 = Object.freeze(buildWave4("hi"));
export const COM003_PUNJABI_LOCALIZATION_WAVE4_V1 = Object.freeze(buildWave4("pa"));
export const COM003_LOCALIZATION_WAVE4_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-WAVE4-AUTHORED-V1" as const,
  englishFreezeAuthorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  precedingAuthoredWaveAuthorityId: COM003_LOCALIZATION_WAVE3_AUTHORITY_V2.authorityId,
  qlIds: Object.freeze([...WAVE4_QL_IDS]), englishSourceQuestionCount: 60,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE4_V1.length, punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE4_V1.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE4_V1.length + COM003_PUNJABI_LOCALIZATION_WAVE4_V1.length,
  authoredFromCanonicalFactIds: true, versionScopedDesktopContextPreserved: true, protectedShortcutTokensPreserved: true,
  optionOrderPreserved: true, correctIndexPreserved: true, provenancePreserved: true, localizationFrozen: false,
  runtimeRegistered: false, questionStudioRegistrationAuthorized: false, automaticPublicationAuthorized: false,
  nextGate: "COM003_LOCALIZATION_WAVE4_SEMANTIC_EDITORIAL_AUDIT_V1" as const,
});
