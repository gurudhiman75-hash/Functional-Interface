import {
  type Lp011AttributeId,
  type Lp011BoxId,
  type Lp011Caselet,
  type Lp011Child,
  type Lp011Clue,
  type Lp011Position,
} from "./lp-011.ts";
import { generateLp011BatchStabilizedV1_3 } from "./lp-011-stabilized-v1-3.ts";
import { LP_011_ENGLISH_FREEZE_V1 } from "./lp-011-permanent-freeze-v1.ts";

export type Lp011LocalizedLanguage = "hi" | "pa";

export type Lp011LocalizedChild = Omit<Lp011Child, "stem" | "options" | "answer" | "explanation"> & {
  language: Lp011LocalizedLanguage;
  stem: string;
  options: string[];
  answer: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp011LocalizedCaselet = Omit<Lp011Caselet, "scenario" | "attributeLabels" | "attributeNoun" | "clues" | "children"> & {
  language: Lp011LocalizedLanguage;
  scenario: string;
  attributeLabels: Record<Lp011AttributeId, string>;
  attributeNoun: string;
  clues: readonly Lp011Clue[];
  children: readonly Lp011LocalizedChild[];
  englishCaselet: Lp011Caselet;
};

export const LP_011_HI_PA_LOCALIZATION_REVIEW_V1 = Object.freeze({
  authorityId: "LP_011_HI_PA_LOCALIZATION_REVIEW_V1" as const,
  sourceEnglishAuthorityId: LP_011_ENGLISH_FREEZE_V1.authorityId,
  packageId: "LP-011" as const,
  checkpointId: "LP-CP-011" as const,
  permanentQlIds: ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"] as const,
  supportedLanguages: ["hi", "pa"] as const,
  locales: ["hi-IN", "pa-IN"] as const,
  localizationMethod: "SEMANTIC_REBUILD_FROM_FROZEN_SOLVED_CASELET" as const,
  status: "HUMAN_REVIEW_CANDIDATE_V1" as const,
  runtimeMode: "REVIEW_ONLY" as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

type LocalCopy = {
  noun: string;
  scenario: string;
  labels: Record<string, string>;
  holder: (value: string) => string;
  has: (box: string, value: string) => string;
  notHas: (box: string, value: string) => string;
};

const COPY: Record<Lp011LocalizedLanguage, Record<string, LocalCopy>> = {
  hi: {
    COLOURED_BOXES: {
      noun: "रंग",
      scenario: "पाँच बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स का रंग अलग है।",
      labels: { Blue: "नीला", Green: "हरा", Red: "लाल", Yellow: "पीला", White: "सफेद" },
      holder: (value) => `${value} रंग वाला बॉक्स`,
      has: (box, value) => `${box} का रंग ${value} है।`,
      notHas: (box, value) => `${box} का रंग ${value} नहीं है।`,
    },
    WAREHOUSE_ITEMS: {
      noun: "वस्तु",
      scenario: "गोदाम में पाँच बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स में अलग वस्तु रखी है।",
      labels: { Books: "किताबें", Pens: "पेन", Files: "फाइलें", Maps: "नक्शे", Forms: "फॉर्म" },
      holder: (value) => `जिस बॉक्स में ${value} हैं`,
      has: (box, value) => `${box} में ${value} हैं।`,
      notHas: (box, value) => `${box} में ${value} नहीं हैं।`,
    },
    RELIEF_MATERIAL: {
      noun: "राहत सामग्री",
      scenario: "पाँच राहत-सामग्री बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स में अलग राहत सामग्री है।",
      labels: { Blankets: "कंबल", Rations: "राशन", Medicines: "दवाइयाँ", Torches: "टॉर्च", Tarpaulins: "तिरपाल" },
      holder: (value) => `${value} वाला बॉक्स`,
      has: (box, value) => `${box} में ${value} हैं।`,
      notHas: (box, value) => `${box} में ${value} नहीं हैं।`,
    },
    OFFICE_STOCK: {
      noun: "कार्यालय सामग्री",
      scenario: "कार्यालय-सामग्री के पाँच बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स में अलग सामग्री है।",
      labels: { Registers: "रजिस्टर", Folders: "फोल्डर", Envelopes: "लिफाफे", Notepads: "नोटपैड", Labels: "लेबल" },
      holder: (value) => `${value} वाला बॉक्स`,
      has: (box, value) => `${box} में ${value} हैं।`,
      notHas: (box, value) => `${box} में ${value} नहीं हैं।`,
    },
    LAB_SUPPLIES: {
      noun: "प्रयोगशाला सामग्री",
      scenario: "प्रयोगशाला-सामग्री के पाँच बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स में अलग सामग्री है।",
      labels: { Gloves: "दस्ताने", Slides: "स्लाइड", Tubes: "ट्यूब", Masks: "मास्क", Swabs: "स्वैब" },
      holder: (value) => `${value} वाला बॉक्स`,
      has: (box, value) => `${box} में ${value} हैं।`,
      notHas: (box, value) => `${box} में ${value} नहीं हैं।`,
    },
    BOOK_CATEGORIES: {
      noun: "विषय",
      scenario: "पाँच बॉक्स A, B, C, D और E एक के ऊपर एक रखे गए हैं। प्रत्येक बॉक्स में अलग विषय की किताबें हैं।",
      labels: { History: "इतिहास", Science: "विज्ञान", Mathematics: "गणित", English: "अंग्रेज़ी", Geography: "भूगोल" },
      holder: (value) => `${value} की किताबों वाला बॉक्स`,
      has: (box, value) => `${box} में ${value} की किताबें हैं।`,
      notHas: (box, value) => `${box} में ${value} की किताबें नहीं हैं।`,
    },
  },
  pa: {
    COLOURED_BOXES: {
      noun: "ਰੰਗ",
      scenario: "ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਦਾ ਰੰਗ ਵੱਖਰਾ ਹੈ।",
      labels: { Blue: "ਨੀਲਾ", Green: "ਹਰਾ", Red: "ਲਾਲ", Yellow: "ਪੀਲਾ", White: "ਚਿੱਟਾ" },
      holder: (value) => `${value} ਰੰਗ ਵਾਲਾ ਬਾਕਸ`,
      has: (box, value) => `${box} ਦਾ ਰੰਗ ${value} ਹੈ।`,
      notHas: (box, value) => `${box} ਦਾ ਰੰਗ ${value} ਨਹੀਂ ਹੈ।`,
    },
    WAREHOUSE_ITEMS: {
      noun: "ਵਸਤੂ",
      scenario: "ਗੋਦਾਮ ਵਿੱਚ ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਵਿੱਚ ਵੱਖਰੀ ਵਸਤੂ ਹੈ।",
      labels: { Books: "ਕਿਤਾਬਾਂ", Pens: "ਪੈਨ", Files: "ਫਾਈਲਾਂ", Maps: "ਨਕਸ਼ੇ", Forms: "ਫਾਰਮ" },
      holder: (value) => `ਜਿਸ ਬਾਕਸ ਵਿੱਚ ${value} ਹਨ`,
      has: (box, value) => `${box} ਵਿੱਚ ${value} ਹਨ।`,
      notHas: (box, value) => `${box} ਵਿੱਚ ${value} ਨਹੀਂ ਹਨ।`,
    },
    RELIEF_MATERIAL: {
      noun: "ਰਾਹਤ ਸਮੱਗਰੀ",
      scenario: "ਰਾਹਤ ਸਮੱਗਰੀ ਦੇ ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਵਿੱਚ ਵੱਖਰੀ ਰਾਹਤ ਸਮੱਗਰੀ ਹੈ।",
      labels: { Blankets: "ਕੰਬਲ", Rations: "ਰਾਸ਼ਨ", Medicines: "ਦਵਾਈਆਂ", Torches: "ਟਾਰਚਾਂ", Tarpaulins: "ਤਿਰਪਾਲ" },
      holder: (value) => `${value} ਵਾਲਾ ਬਾਕਸ`,
      has: (box, value) => `${box} ਵਿੱਚ ${value} ਹਨ।`,
      notHas: (box, value) => `${box} ਵਿੱਚ ${value} ਨਹੀਂ ਹਨ।`,
    },
    OFFICE_STOCK: {
      noun: "ਦਫ਼ਤਰੀ ਸਮੱਗਰੀ",
      scenario: "ਦਫ਼ਤਰੀ ਸਮੱਗਰੀ ਦੇ ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਵਿੱਚ ਵੱਖਰੀ ਸਮੱਗਰੀ ਹੈ।",
      labels: { Registers: "ਰਜਿਸਟਰ", Folders: "ਫੋਲਡਰ", Envelopes: "ਲਿਫ਼ਾਫੇ", Notepads: "ਨੋਟਪੈਡ", Labels: "ਲੇਬਲ" },
      holder: (value) => `${value} ਵਾਲਾ ਬਾਕਸ`,
      has: (box, value) => `${box} ਵਿੱਚ ${value} ਹਨ।`,
      notHas: (box, value) => `${box} ਵਿੱਚ ${value} ਨਹੀਂ ਹਨ।`,
    },
    LAB_SUPPLIES: {
      noun: "ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਸਮੱਗਰੀ",
      scenario: "ਪ੍ਰਯੋਗਸ਼ਾਲਾ ਸਮੱਗਰੀ ਦੇ ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਵਿੱਚ ਵੱਖਰੀ ਸਮੱਗਰੀ ਹੈ।",
      labels: { Gloves: "ਦਸਤਾਨੇ", Slides: "ਸਲਾਈਡਾਂ", Tubes: "ਟਿਊਬਾਂ", Masks: "ਮਾਸਕ", Swabs: "ਸਵੈਬ" },
      holder: (value) => `${value} ਵਾਲਾ ਬਾਕਸ`,
      has: (box, value) => `${box} ਵਿੱਚ ${value} ਹਨ।`,
      notHas: (box, value) => `${box} ਵਿੱਚ ${value} ਨਹੀਂ ਹਨ।`,
    },
    BOOK_CATEGORIES: {
      noun: "ਵਿਸ਼ਾ",
      scenario: "ਪੰਜ ਬਾਕਸ A, B, C, D ਅਤੇ E ਇੱਕ ਦੇ ਉੱਪਰ ਇੱਕ ਰੱਖੇ ਹੋਏ ਹਨ। ਹਰ ਬਾਕਸ ਵਿੱਚ ਵੱਖਰੇ ਵਿਸ਼ੇ ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ।",
      labels: { History: "ਇਤਿਹਾਸ", Science: "ਵਿਗਿਆਨ", Mathematics: "ਗਣਿਤ", English: "ਅੰਗਰੇਜ਼ੀ", Geography: "ਭੂਗੋਲ" },
      holder: (value) => `${value} ਦੀਆਂ ਕਿਤਾਬਾਂ ਵਾਲਾ ਬਾਕਸ`,
      has: (box, value) => `${box} ਵਿੱਚ ${value} ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ।`,
      notHas: (box, value) => `${box} ਵਿੱਚ ${value} ਦੀਆਂ ਕਿਤਾਬਾਂ ਨਹੀਂ ਹਨ।`,
    },
  },
};

function box(language: Lp011LocalizedLanguage, value: Lp011BoxId): string {
  return language === "hi" ? `बॉक्स ${value}` : `ਬਾਕਸ ${value}`;
}

function position(language: Lp011LocalizedLanguage, value: Lp011Position): string {
  return language === "hi" ? `नीचे से स्थान ${value}` : `ਹੇਠੋਂ ਸਥਾਨ ${value}`;
}

function profileCopy(language: Lp011LocalizedLanguage, caselet: Lp011Caselet): LocalCopy {
  const copy = COPY[language][caselet.scenarioProfileId];
  if (!copy) throw new Error(`Missing LP-011 ${language} profile copy for ${caselet.scenarioProfileId}`);
  return copy;
}

function localLabel(copy: LocalCopy, caselet: Lp011Caselet, attribute: Lp011AttributeId): string {
  const english = caselet.attributeLabels[attribute];
  const localized = copy.labels[english];
  if (!localized) throw new Error(`Missing localized LP-011 label: ${english}`);
  return localized;
}

function renderClue(language: Lp011LocalizedLanguage, caselet: Lp011Caselet, clue: Lp011Clue): string {
  const copy = profileCopy(language, caselet);
  const label = (attribute: Lp011AttributeId) => localLabel(copy, caselet, attribute);
  const b = (value: Lp011BoxId) => box(language, value);
  const holder = (attribute: Lp011AttributeId) => copy.holder(label(attribute));

  if (language === "hi") {
    switch (clue.kind) {
      case "BOX_ABOVE_BOX": return `${b(clue.upper)}, ${b(clue.lower)} से ऊपर है।`;
      case "BOX_IMMEDIATELY_ABOVE_BOX": return `${b(clue.upper)}, ${b(clue.lower)} के ठीक ऊपर है।`;
      case "BOXES_BETWEEN_BOX_BOX": return `${b(clue.left)} और ${b(clue.right)} के बीच ${clue.count} बॉक्स ${clue.count === 1 ? "है" : "हैं"}।`;
      case "BOX_NOT_POSITION": return `${b(clue.box)} ${position(language, clue.position)} पर नहीं है।`;
      case "BOX_HAS_ATTRIBUTE": return copy.has(b(clue.box), label(clue.attribute));
      case "BOX_NOT_ATTRIBUTE": return copy.notHas(b(clue.box), label(clue.attribute));
      case "ATTRIBUTE_ABOVE_BOX": return `${holder(clue.attribute)}, ${b(clue.box)} से ऊपर है।`;
      case "BOX_ABOVE_ATTRIBUTE": return `${b(clue.box)}, ${holder(clue.attribute)} से ऊपर है।`;
      case "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX": return `${holder(clue.attribute)}, ${b(clue.box)} के ठीक ऊपर है।`;
      case "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE": return `${b(clue.box)}, ${holder(clue.attribute)} के ठीक ऊपर है।`;
      case "ATTRIBUTE_ABOVE_ATTRIBUTE": return `${holder(clue.upper)}, ${holder(clue.lower)} से ऊपर है।`;
    }
  }

  switch (clue.kind) {
    case "BOX_ABOVE_BOX": return `${b(clue.upper)}, ${b(clue.lower)} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    case "BOX_IMMEDIATELY_ABOVE_BOX": return `${b(clue.upper)}, ${b(clue.lower)} ਦੇ ਬਿਲਕੁਲ ਉੱਪਰ ਹੈ।`;
    case "BOXES_BETWEEN_BOX_BOX": return `${b(clue.left)} ਅਤੇ ${b(clue.right)} ਦੇ ਵਿਚਕਾਰ ${clue.count} ਬਾਕਸ ${clue.count === 1 ? "ਹੈ" : "ਹਨ"}।`;
    case "BOX_NOT_POSITION": return `${b(clue.box)} ${position(language, clue.position)} 'ਤੇ ਨਹੀਂ ਹੈ।`;
    case "BOX_HAS_ATTRIBUTE": return copy.has(b(clue.box), label(clue.attribute));
    case "BOX_NOT_ATTRIBUTE": return copy.notHas(b(clue.box), label(clue.attribute));
    case "ATTRIBUTE_ABOVE_BOX": return `${holder(clue.attribute)}, ${b(clue.box)} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    case "BOX_ABOVE_ATTRIBUTE": return `${b(clue.box)}, ${holder(clue.attribute)} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    case "ATTRIBUTE_IMMEDIATELY_ABOVE_BOX": return `${holder(clue.attribute)}, ${b(clue.box)} ਦੇ ਬਿਲਕੁਲ ਉੱਪਰ ਹੈ।`;
    case "BOX_IMMEDIATELY_ABOVE_ATTRIBUTE": return `${b(clue.box)}, ${holder(clue.attribute)} ਦੇ ਬਿਲਕੁਲ ਉੱਪਰ ਹੈ।`;
    case "ATTRIBUTE_ABOVE_ATTRIBUTE": return `${holder(clue.upper)}, ${holder(clue.lower)} ਤੋਂ ਉੱਪਰ ਹੈ।`;
  }
}

function localizeOption(language: Lp011LocalizedLanguage, caselet: Lp011Caselet, option: string): string {
  const copy = profileCopy(language, caselet);
  for (const english of Object.values(caselet.attributeLabels)) {
    const localized = copy.labels[english];
    if (localized && option.includes(english)) option = option.replace(english, localized);
  }
  option = option.replace(/Box ([A-E])/gu, (_, id) => box(language, id as Lp011BoxId));
  option = option.replace(/(1st|2nd|3rd|4th|5th) from bottom/gu, (match) => {
    const value = Number(match.charAt(0)) as Lp011Position;
    return position(language, value);
  });
  return option;
}

function localizedSetup(language: Lp011LocalizedLanguage, caselet: Lp011Caselet): string {
  const copy = profileCopy(language, caselet);
  const values = caselet.attributes.map((attribute) => localLabel(copy, caselet, attribute)).join(", ");
  if (language === "hi") {
    return `${copy.scenario} ${copy.noun} हैं: ${values}। स्थान नीचे से ऊपर 1 से 5 तक गिने जाते हैं। हर बॉक्स एक स्थान पर है और हर ${copy.noun} केवल एक बॉक्स से जुड़ा है।`;
  }
  return `${copy.scenario} ${copy.noun} ਹਨ: ${values}। ਸਥਾਨ ਹੇਠੋਂ ਉੱਪਰ 1 ਤੋਂ 5 ਤੱਕ ਗਿਣੇ ਜਾਂਦੇ ਹਨ। ਹਰ ਬਾਕਸ ਇੱਕ ਸਥਾਨ 'ਤੇ ਹੈ ਅਤੇ ਹਰ ${copy.noun} ਸਿਰਫ਼ ਇੱਕ ਬਾਕਸ ਨਾਲ ਜੁੜਿਆ ਹੈ।`;
}

function localizedStem(language: Lp011LocalizedLanguage, caselet: Lp011Caselet, child: Lp011Child): string {
  const copy = profileCopy(language, caselet);
  const englishStem = child.stem;
  const boxMatch = englishStem.match(/Box ([A-E])/u);
  const targetBox = boxMatch ? box(language, boxMatch[1] as Lp011BoxId) : "";
  const attributeEnglish = Object.values(caselet.attributeLabels).find((value) => englishStem.includes(value));
  const attribute = attributeEnglish ? copy.labels[attributeEnglish] : "";

  if (language === "hi") {
    if (child.qlId === "LP-QL-041") return `${targetBox} का ${copy.noun} क्या है?`;
    if (child.qlId === "LP-QL-042") return `${attribute} किस बॉक्स से जुड़ा है?`;
    if (child.qlId === "LP-QL-043") return `${copy.holder(attribute)} नीचे से किस स्थान पर है?`;
    return `${targetBox} के सही ${copy.noun} और स्थान वाला विकल्प चुनिए।`;
  }
  if (child.qlId === "LP-QL-041") return `${targetBox} ਦਾ ${copy.noun} ਕੀ ਹੈ?`;
  if (child.qlId === "LP-QL-042") return `${attribute} ਕਿਸ ਬਾਕਸ ਨਾਲ ਜੁੜਿਆ ਹੈ?`;
  if (child.qlId === "LP-QL-043") return `${copy.holder(attribute)} ਹੇਠੋਂ ਕਿਹੜੇ ਸਥਾਨ 'ਤੇ ਹੈ?`;
  return `${targetBox} ਦੇ ਸਹੀ ${copy.noun} ਅਤੇ ਸਥਾਨ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`;
}

function finalTable(language: Lp011LocalizedLanguage, caselet: Lp011Caselet): string {
  const copy = profileCopy(language, caselet);
  const rows = [...caselet.boxes]
    .sort((left, right) => caselet.assignment.positionByBox[right] - caselet.assignment.positionByBox[left])
    .map((id) => `| ${caselet.assignment.positionByBox[id]} | ${box(language, id)} | ${localLabel(copy, caselet, caselet.assignment.attributeByBox[id])} |`);
  const header = language === "hi" ? `| स्थान | बॉक्स | ${copy.noun} |` : `| ਸਥਾਨ | ਬਾਕਸ | ${copy.noun} |`;
  return [header, "|---|---|---|", ...rows].join("\n");
}

function localizeChild(language: Lp011LocalizedLanguage, caselet: Lp011Caselet, child: Lp011Child): Lp011LocalizedChild {
  const options = child.options.map((option) => localizeOption(language, caselet, option));
  const answer = options[child.correctIndex]!;
  const clueLines = caselet.clues.map((clue, index) => {
    const prefix = language === "hi" ? `**चरण ${index + 1}**` : `**ਕਦਮ ${index + 1}**`;
    return `${prefix}\n\n${renderClue(language, caselet, clue)}`;
  });
  const summary = language === "hi"
    ? `शर्तों को क्रम से लगाकर तालिका पूरी करें। सही उत्तर ${answer} है।`
    : `ਸ਼ਰਤਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਗਾ ਕੇ ਸਾਰਣੀ ਪੂਰੀ ਕਰੋ। ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  const completed = language === "hi"
    ? `**अंतिम व्यवस्था**\n\n${finalTable(language, caselet)}`
    : `**ਅੰਤਿਮ ਵਿਵਸਥਾ**\n\n${finalTable(language, caselet)}`;
  const decision = language === "hi"
    ? `अब पूछे गए प्रश्न के अनुसार तालिका पढ़ें। इसलिए सही उत्तर **${answer}** है।`
    : `ਹੁਣ ਪੁੱਛੇ ਗਏ ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਸਾਰਣੀ ਪੜ੍ਹੋ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ **${answer}** ਹੈ।`;
  return {
    ...child,
    language,
    stem: localizedStem(language, caselet, child),
    options,
    answer,
    explanation: { summary, lines: [...clueLines, completed, decision] },
  };
}

function localizeCaselet(language: Lp011LocalizedLanguage, caselet: Lp011Caselet): Lp011LocalizedCaselet {
  const copy = profileCopy(language, caselet);
  const translatedClues = caselet.clues.map((clue) => ({ ...clue, text: renderClue(language, caselet, clue) })) as readonly Lp011Clue[];
  const attributeLabels = Object.fromEntries(caselet.attributes.map((attribute) => [attribute, localLabel(copy, caselet, attribute)])) as Record<Lp011AttributeId, string>;
  return {
    ...caselet,
    language,
    scenario: localizedSetup(language, caselet),
    attributeLabels,
    attributeNoun: copy.noun,
    clues: translatedClues,
    children: caselet.children.map((child) => localizeChild(language, caselet, child)),
    englishCaselet: caselet,
  };
}

export function generateLp011LocalizedBatchV1(language: Lp011LocalizedLanguage, seed = "lp-011-localization-v1", count = 8): Lp011LocalizedCaselet[] {
  return generateLp011BatchStabilizedV1_3(seed, count).map((caselet) => localizeCaselet(language, caselet));
}
