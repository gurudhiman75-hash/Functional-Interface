import { ANA_LOCALIZED_FACTS } from "../../../../Analogy/ANA-001/localization";
import {
  CLS_CP001_ENTITY_LABELS,
  localizedClassLabel,
  localizedEntityLabel,
} from "../../CLS-CP-001/localization/cp001-language-pack";
import {
  CLS_CP002_FACTS,
  relationDefinition,
} from "../relation-registry";
import type {
  ClsCp002Pair,
  ClsCp002RelationFact,
} from "../types";

export type ClsCp002Locale = "en-IN" | "hi-IN" | "pa-IN";
export type ClsCp002TranslatedLocale = Exclude<ClsCp002Locale, "en-IN">;

type LocalizedText = {
  readonly hi: string;
  readonly pa: string;
};

const SUPPLEMENTAL_TERMS: Readonly<Record<string, LocalizedText>> = {
  Bottle: { hi: "बोतल", pa: "ਬੋਤਲ" },
  Water: { hi: "पानी", pa: "ਪਾਣੀ" },
  Cup: { hi: "कप", pa: "ਕੱਪ" },
  Tea: { hi: "चाय", pa: "ਚਾਹ" },
  Glass: { hi: "गिलास", pa: "ਗਿਲਾਸ" },
  Juice: { hi: "रस", pa: "ਰਸ" },
  Tank: { hi: "टंकी", pa: "ਟੈਂਕੀ" },
  Fuel: { hi: "ईंधन", pa: "ਈਂਧਨ" },
  Jar: { hi: "जार", pa: "ਬਰਤਨ" },
  Pickles: { hi: "अचार", pa: "ਅਚਾਰ" },
  Envelope: { hi: "लिफाफा", pa: "ਲਿਫ਼ਾਫ਼ਾ" },
  Letter: { hi: "पत्र", pa: "ਚਿੱਠੀ" },
  Cage: { hi: "पिंजरा", pa: "ਪਿੰਜਰਾ" },
  Bird: { hi: "पक्षी", pa: "ਪੰਛੀ" },
  Aquarium: { hi: "मछलीघर", pa: "ਮੱਛੀਘਰ" },
  Fish: { hi: "मछली", pa: "ਮੱਛੀ" },
  Wallet: { hi: "बटुआ", pa: "ਬਟੂਆ" },
  Money: { hi: "पैसे", pa: "ਪੈਸੇ" },
  Basket: { hi: "टोकरी", pa: "ਟੋਕਰੀ" },
  Fruits: { hi: "फल", pa: "ਫਲ" },
  Box: { hi: "डिब्बा", pa: "ਡੱਬਾ" },
  Chocolates: { hi: "चॉकलेट", pa: "ਚਾਕਲੇਟ" },
  Sack: { hi: "बोरी", pa: "ਬੋਰੀ" },
  Grain: { hi: "अनाज", pa: "ਅਨਾਜ" },
  Wood: { hi: "लकड़ी", pa: "ਲੱਕੜ" },
  Table: { hi: "मेज़", pa: "ਮੇਜ਼" },
  Pulp: { hi: "लुगदी", pa: "ਲੁਗਦੀ" },
  Paper: { hi: "कागज़", pa: "ਕਾਗਜ਼" },
  Grapes: { hi: "अंगूर", pa: "ਅੰਗੂਰ" },
  Wine: { hi: "अंगूरी मदिरा", pa: "ਅੰਗੂਰੀ ਮਦਿਰਾ" },
  Clay: { hi: "मिट्टी", pa: "ਮਿੱਟੀ" },
  Pottery: { hi: "मिट्टी के बर्तन", pa: "ਮਿੱਟੀ ਦੇ ਭਾਂਡੇ" },
  Cotton: { hi: "कपास", pa: "ਕਪਾਹ" },
  Cloth: { hi: "कपड़ा", pa: "ਕੱਪੜਾ" },
  Leather: { hi: "चमड़ा", pa: "ਚਮੜਾ" },
  Shoes: { hi: "जूते", pa: "ਜੁੱਤੇ" },
  Milk: { hi: "दूध", pa: "ਦੁੱਧ" },
  Cheese: { hi: "चीज़", pa: "ਚੀਜ਼" },
  Iron: { hi: "लोहा", pa: "ਲੋਹਾ" },
  Tools: { hi: "औज़ार", pa: "ਸੰਦ" },
  Rubber: { hi: "रबर", pa: "ਰਬੜ" },
  Tyre: { hi: "टायर", pa: "ਟਾਇਰ" },
  Sand: { hi: "रेत", pa: "ਰੇਤ" },
  Gold: { hi: "सोना", pa: "ਸੋਨਾ" },
  Jewellery: { hi: "आभूषण", pa: "ਗਹਿਣੇ" },
  Wheat: { hi: "गेहूँ", pa: "ਕਣਕ" },
  Bread: { hi: "ब्रेड", pa: "ਬਰੈੱਡ" },
  Bell: { hi: "घंटी", pa: "ਘੰਟੀ" },
  Ring: { hi: "टन-टन", pa: "ਟਨ-ਟਨ" },
  Clock: { hi: "घड़ी", pa: "ਘੜੀ" },
  Tick: { hi: "टिक-टिक", pa: "ਟਿਕ-ਟਿਕ" },
  Drum: { hi: "ढोल", pa: "ਢੋਲ" },
  Beat: { hi: "थाप", pa: "ਥਾਪ" },
  Horn: { hi: "हॉर्न", pa: "ਹਾਰਨ" },
  Honk: { hi: "पों-पों", pa: "ਪੋਂ-ਪੋਂ" },
  Gun: { hi: "बंदूक", pa: "ਬੰਦੂਕ" },
  Bang: { hi: "धमाका", pa: "ਧਮਾਕਾ" },
  Doorbell: { hi: "दरवाज़े की घंटी", pa: "ਦਰਵਾਜ਼ੇ ਦੀ ਘੰਟੀ" },
  Chime: { hi: "घंटी की धुन", pa: "ਘੰਟੀ ਦੀ ਧੁਨ" },
  Alarm: { hi: "अलार्म", pa: "ਅਲਾਰਮ" },
  Buzz: { hi: "भनभनाहट", pa: "ਭਨਭਨਾਹਟ" },
  Engine: { hi: "इंजन", pa: "ਇੰਜਣ" },
  Roar: { hi: "गरज", pa: "ਗਰਜ" },
  Keyboard: { hi: "कीबोर्ड", pa: "ਕੀਬੋਰਡ" },
  Click: { hi: "क्लिक", pa: "ਕਲਿੱਕ" },
  Camera: { hi: "कैमरा", pa: "ਕੈਮਰਾ" },
  Telephone: { hi: "टेलीफोन", pa: "ਟੈਲੀਫੋਨ" },
  Firecracker: { hi: "पटाखा", pa: "ਪਟਾਕਾ" },
  Father: { hi: "पिता", pa: "ਪਿਤਾ" },
  Son: { hi: "पुत्र", pa: "ਪੁੱਤਰ" },
  Daughter: { hi: "पुत्री", pa: "ਧੀ" },
  Mother: { hi: "माता", pa: "ਮਾਤਾ" },
  Uncle: { hi: "चाचा या मामा", pa: "ਚਾਚਾ ਜਾਂ ਮਾਮਾ" },
  Nephew: { hi: "भतीजा या भांजा", pa: "ਭਤੀਜਾ ਜਾਂ ਭਾਣਜਾ" },
  Niece: { hi: "भतीजी या भांजी", pa: "ਭਤੀਜੀ ਜਾਂ ਭਾਣਜੀ" },
  Aunt: { hi: "चाची या मामी", pa: "ਚਾਚੀ ਜਾਂ ਮਾਮੀ" },
  Parent: { hi: "माता-पिता", pa: "ਮਾਤਾ-ਪਿਤਾ" },
  Child: { hi: "बच्चा", pa: "ਬੱਚਾ" },
  Grandfather: { hi: "दादा", pa: "ਦਾਦਾ" },
  Grandmother: { hi: "दादी", pa: "ਦਾਦੀ" },
};

const RELATION_TEXT: Readonly<Record<string, LocalizedText>> = {
  SEM_ANIMAL_YOUNG: { hi: "दूसरा शब्द पहले जानवर के बच्चे का नाम है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੇ ਬੱਚੇ ਦਾ ਨਾਮ ਹੈ।" },
  SEM_MALE_FEMALE: { hi: "दूसरा शब्द पहले नर जानवर का मादा रूप है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਨਰ ਜਾਨਵਰ ਦਾ ਮਾਦਾ ਰੂਪ ਹੈ।" },
  SEM_ANIMAL_SOUND: { hi: "दूसरा शब्द पहले जानवर की खास आवाज़ है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੀ ਖਾਸ ਆਵਾਜ਼ ਹੈ।" },
  SEM_ANIMAL_MOVEMENT: { hi: "दूसरा शब्द पहले जानवर की खास चाल है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੀ ਖਾਸ ਚਾਲ ਹੈ।" },
  SEM_WORKER_WORKPLACE: { hi: "दूसरा शब्द पहले व्यक्ति का सामान्य कार्यस्थल है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਵਿਅਕਤੀ ਦਾ ਆਮ ਕੰਮ ਕਰਨ ਵਾਲਾ ਸਥਾਨ ਹੈ।" },
  SEM_WORKER_TOOL: { hi: "दूसरा शब्द पहले कामगार का मुख्य औज़ार है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਕਾਰੀਗਰ ਦਾ ਮੁੱਖ ਸੰਦ ਹੈ।" },
  SEM_WORKER_PRODUCT: { hi: "दूसरी वस्तु पहले व्यक्ति द्वारा बनाई जाती है।", pa: "ਦੂਜੀ ਚੀਜ਼ ਪਹਿਲੇ ਵਿਅਕਤੀ ਵੱਲੋਂ ਬਣਾਈ ਜਾਂਦੀ ਹੈ।" },
  SEM_INSTRUMENT_MEASUREMENT: { hi: "पहला यंत्र दूसरी मात्रा को मापता है।", pa: "ਪਹਿਲਾ ਯੰਤਰ ਦੂਜੀ ਮਾਤਰਾ ਨੂੰ ਮਾਪਦਾ ਹੈ।" },
  SEM_QUANTITY_UNIT: { hi: "दूसरा शब्द पहली भौतिक मात्रा की इकाई है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਭੌਤਿਕ ਮਾਤਰਾ ਦੀ ਇਕਾਈ ਹੈ।" },
  SEM_OBJECT_FUNCTION: { hi: "दूसरा शब्द पहली वस्तु का मुख्य काम बताता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਚੀਜ਼ ਦਾ ਮੁੱਖ ਕੰਮ ਦੱਸਦਾ ਹੈ।" },
  SEM_PART_WHOLE: { hi: "पहली वस्तु दूसरी बड़ी वस्तु का भाग है।", pa: "ਪਹਿਲੀ ਚੀਜ਼ ਦੂਜੀ ਵੱਡੀ ਚੀਜ਼ ਦਾ ਹਿੱਸਾ ਹੈ।" },
  SEM_MEMBER_CLASS: { hi: "पहला शब्द दूसरे वर्ग का सदस्य है।", pa: "ਪਹਿਲਾ ਸ਼ਬਦ ਦੂਜੇ ਵਰਗ ਦਾ ਮੈਂਬਰ ਹੈ।" },
  SEM_INDIVIDUAL_GROUP: { hi: "दूसरा शब्द वह समूह है जिसमें पहला सदस्य शामिल होता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਉਹ ਸਮੂਹ ਹੈ ਜਿਸ ਵਿੱਚ ਪਹਿਲਾ ਮੈਂਬਰ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।" },
  SEM_PRODUCT_MATERIAL: { hi: "दूसरा पदार्थ पहली वस्तु को बनाने में काम आता है।", pa: "ਦੂਜੀ ਸਮੱਗਰੀ ਪਹਿਲੀ ਚੀਜ਼ ਬਣਾਉਣ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।" },
  SEM_PLACE_PURPOSE: { hi: "दूसरा शब्द पहले स्थान का मुख्य उद्देश्य बताता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਸਥਾਨ ਦਾ ਮੁੱਖ ਮਕਸਦ ਦੱਸਦਾ ਹੈ।" },
  LEX_SYNONYM: { hi: "दोनों शब्दों के अर्थ समान हैं।", pa: "ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦੇ ਅਰਥ ਇੱਕੋ ਜਿਹੇ ਹਨ।" },
  LEX_ANTONYM: { hi: "दोनों शब्दों के अर्थ विपरीत हैं।", pa: "ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦੇ ਅਰਥ ਉਲਟ ਹਨ।" },
  LEX_INTENSITY_UP: { hi: "दूसरा शब्द पहले से अधिक तीव्र अर्थ बताता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਨਾਲੋਂ ਵੱਧ ਤੀਬਰ ਅਰਥ ਦੱਸਦਾ ਹੈ।" },
  LEX_INTENSITY_DOWN: { hi: "दूसरा शब्द पहले से हल्का अर्थ बताता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਨਾਲੋਂ ਹਲਕਾ ਅਰਥ ਦੱਸਦਾ ਹੈ।" },
  LEX_CAUSE_EFFECT: { hi: "पहला कारण और दूसरा उसका प्रभाव है।", pa: "ਪਹਿਲਾ ਕਾਰਨ ਅਤੇ ਦੂਜਾ ਉਸਦਾ ਪ੍ਰਭਾਵ ਹੈ।" },
  LEX_EFFECT_CAUSE: { hi: "पहला प्रभाव और दूसरा उसका कारण है।", pa: "ਪਹਿਲਾ ਪ੍ਰਭਾਵ ਅਤੇ ਦੂਜਾ ਉਸਦਾ ਕਾਰਨ ਹੈ।" },
  LEX_CONDITION_SYMPTOM: { hi: "दूसरा शब्द पहली स्थिति का सामान्य लक्षण है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਹਾਲਤ ਦਾ ਆਮ ਲੱਛਣ ਹੈ।" },
  LEX_ACTION_RESULT: { hi: "दूसरा शब्द पहली क्रिया का सामान्य परिणाम है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਕਿਰਿਆ ਦਾ ਆਮ ਨਤੀਜਾ ਹੈ।" },
  LEX_OBJECT_CHARACTERISTIC: { hi: "दूसरा शब्द पहली वस्तु की मुख्य विशेषता है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਚੀਜ਼ ਦੀ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ।" },
  LEX_WORD_DEFINITION: { hi: "दूसरा भाग पहले शब्द का अर्थ बताता है।", pa: "ਦੂਜਾ ਭਾਗ ਪਹਿਲੇ ਸ਼ਬਦ ਦਾ ਅਰਥ ਦੱਸਦਾ ਹੈ।" },
  LEX_DEFICIENCY_MISSING_QUALITY: { hi: "पहला शब्द दूसरे गुण की कमी बताता है।", pa: "ਪਹਿਲਾ ਸ਼ਬਦ ਦੂਜੇ ਗੁਣ ਦੀ ਘਾਟ ਦੱਸਦਾ ਹੈ।" },
  LEX_STUDY_SUBJECT: { hi: "पहला विषय दूसरे का अध्ययन करता है।", pa: "ਪਹਿਲਾ ਵਿਸ਼ਾ ਦੂਜੇ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।" },
  SEM_CONTAINER_CONTENT: { hi: "पहली वस्तु में दूसरी वस्तु सामान्यतः रखी जाती है।", pa: "ਪਹਿਲੀ ਚੀਜ਼ ਵਿੱਚ ਦੂਜੀ ਚੀਜ਼ ਆਮ ਤੌਰ ਤੇ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।" },
  SEM_MATERIAL_PRODUCT: { hi: "दूसरी वस्तु पहले कच्चे माल से बनाई जाती है।", pa: "ਦੂਜੀ ਚੀਜ਼ ਪਹਿਲੀ ਕੱਚੀ ਸਮੱਗਰੀ ਤੋਂ ਬਣਾਈ ਜਾਂਦੀ ਹੈ।" },
  SEM_OBJECT_SOUND: { hi: "दूसरा शब्द पहली वस्तु की खास आवाज़ है।", pa: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੀ ਚੀਜ਼ ਦੀ ਖਾਸ ਆਵਾਜ਼ ਹੈ।" },
  SEM_KIN_ONE_GENERATION_DOWN: { hi: "दूसरा पारिवारिक संबंध पहले से एक पीढ़ी नीचे है।", pa: "ਦੂਜਾ ਪਰਿਵਾਰਕ ਰਿਸ਼ਤਾ ਪਹਿਲੇ ਨਾਲੋਂ ਇੱਕ ਪੀੜ੍ਹੀ ਹੇਠਾਂ ਹੈ।" },
};

const RELATION_LABELS: Readonly<Record<string, LocalizedText>> = {
  SEM_ANIMAL_YOUNG: { hi: "जानवर और उसका बच्चा", pa: "ਜਾਨਵਰ ਅਤੇ ਉਸਦਾ ਬੱਚਾ" },
  SEM_MALE_FEMALE: { hi: "नर और मादा", pa: "ਨਰ ਅਤੇ ਮਾਦਾ" },
  SEM_ANIMAL_SOUND: { hi: "जानवर और आवाज़", pa: "ਜਾਨਵਰ ਅਤੇ ਆਵਾਜ਼" },
  SEM_ANIMAL_MOVEMENT: { hi: "जानवर और चाल", pa: "ਜਾਨਵਰ ਅਤੇ ਚਾਲ" },
  SEM_WORKER_WORKPLACE: { hi: "व्यक्ति और कार्यस्थल", pa: "ਵਿਅਕਤੀ ਅਤੇ ਕੰਮ ਦਾ ਸਥਾਨ" },
  SEM_WORKER_TOOL: { hi: "कामगार और औज़ार", pa: "ਕਾਰੀਗਰ ਅਤੇ ਸੰਦ" },
  SEM_WORKER_PRODUCT: { hi: "बनाने वाला और उत्पाद", pa: "ਬਣਾਉਣ ਵਾਲਾ ਅਤੇ ਉਤਪਾਦ" },
  SEM_INSTRUMENT_MEASUREMENT: { hi: "यंत्र और मापी जाने वाली मात्रा", pa: "ਯੰਤਰ ਅਤੇ ਮਾਪੀ ਜਾਣ ਵਾਲੀ ਮਾਤਰਾ" },
  SEM_QUANTITY_UNIT: { hi: "मात्रा और इकाई", pa: "ਮਾਤਰਾ ਅਤੇ ਇਕਾਈ" },
  SEM_OBJECT_FUNCTION: { hi: "वस्तु और उसका काम", pa: "ਚੀਜ਼ ਅਤੇ ਉਸਦਾ ਕੰਮ" },
  SEM_PART_WHOLE: { hi: "भाग और पूरी वस्तु", pa: "ਹਿੱਸਾ ਅਤੇ ਪੂਰੀ ਚੀਜ਼" },
  SEM_MEMBER_CLASS: { hi: "सदस्य और वर्ग", pa: "ਮੈਂਬਰ ਅਤੇ ਵਰਗ" },
  SEM_INDIVIDUAL_GROUP: { hi: "सदस्य और समूह", pa: "ਮੈਂਬਰ ਅਤੇ ਸਮੂਹ" },
  SEM_PRODUCT_MATERIAL: { hi: "उत्पाद और सामग्री", pa: "ਉਤਪਾਦ ਅਤੇ ਸਮੱਗਰੀ" },
  SEM_PLACE_PURPOSE: { hi: "स्थान और उद्देश्य", pa: "ਸਥਾਨ ਅਤੇ ਮਕਸਦ" },
  LEX_SYNONYM: { hi: "समान अर्थ", pa: "ਇੱਕੋ ਅਰਥ" },
  LEX_ANTONYM: { hi: "विपरीत अर्थ", pa: "ਉਲਟ ਅਰਥ" },
  LEX_INTENSITY_UP: { hi: "कम से अधिक तीव्रता", pa: "ਘੱਟ ਤੋਂ ਵੱਧ ਤੀਬਰਤਾ" },
  LEX_INTENSITY_DOWN: { hi: "अधिक से कम तीव्रता", pa: "ਵੱਧ ਤੋਂ ਘੱਟ ਤੀਬਰਤਾ" },
  LEX_CAUSE_EFFECT: { hi: "कारण और प्रभाव", pa: "ਕਾਰਨ ਅਤੇ ਪ੍ਰਭਾਵ" },
  LEX_EFFECT_CAUSE: { hi: "प्रभाव और कारण", pa: "ਪ੍ਰਭਾਵ ਅਤੇ ਕਾਰਨ" },
  LEX_CONDITION_SYMPTOM: { hi: "स्थिति और लक्षण", pa: "ਹਾਲਤ ਅਤੇ ਲੱਛਣ" },
  LEX_ACTION_RESULT: { hi: "क्रिया और परिणाम", pa: "ਕਿਰਿਆ ਅਤੇ ਨਤੀਜਾ" },
  LEX_OBJECT_CHARACTERISTIC: { hi: "वस्तु और विशेषता", pa: "ਚੀਜ਼ ਅਤੇ ਵਿਸ਼ੇਸ਼ਤਾ" },
  LEX_WORD_DEFINITION: { hi: "शब्द और अर्थ", pa: "ਸ਼ਬਦ ਅਤੇ ਅਰਥ" },
  LEX_DEFICIENCY_MISSING_QUALITY: { hi: "कमी और गायब गुण", pa: "ਘਾਟ ਅਤੇ ਗੈਰਹਾਜ਼ਰ ਗੁਣ" },
  LEX_STUDY_SUBJECT: { hi: "अध्ययन और विषय", pa: "ਅਧਿਐਨ ਅਤੇ ਵਿਸ਼ਾ" },
  SEM_CONTAINER_CONTENT: { hi: "पात्र और सामग्री", pa: "ਭਾਂਡਾ ਅਤੇ ਅੰਦਰਲੀ ਚੀਜ਼" },
  SEM_MATERIAL_PRODUCT: { hi: "कच्चा माल और उत्पाद", pa: "ਕੱਚੀ ਸਮੱਗਰੀ ਅਤੇ ਉਤਪਾਦ" },
  SEM_OBJECT_SOUND: { hi: "वस्तु और आवाज़", pa: "ਚੀਜ਼ ਅਤੇ ਆਵਾਜ਼" },
  SEM_KIN_ONE_GENERATION_DOWN: { hi: "एक पीढ़ी नीचे का संबंध", pa: "ਇੱਕ ਪੀੜ੍ਹੀ ਹੇਠਾਂ ਦਾ ਰਿਸ਼ਤਾ" },
};

const FACT_BY_ID = new Map(CLS_CP002_FACTS.map((fact) => [fact.factId, fact]));
const ANA_LOCALIZED_BY_KEY = new Map(
  ANA_LOCALIZED_FACTS
    .filter((fact) => fact.status === "CURATED")
    .map((fact) => [`${fact.locale}:${fact.canonicalFactId}`, fact]),
);

function localeText(entry: LocalizedText, locale: ClsCp002TranslatedLocale): string {
  return locale === "hi-IN" ? entry.hi : entry.pa;
}

function canonicalAnaFactId(factId: string): string | null {
  if (!factId.startsWith("CLS-CP002-ANA-")) return null;
  return factId.slice("CLS-CP002-".length);
}

function localizedAnaFact(factId: string, locale: ClsCp002TranslatedLocale) {
  const canonicalId = canonicalAnaFactId(factId);
  return canonicalId ? ANA_LOCALIZED_BY_KEY.get(`${locale}:${canonicalId}`) : undefined;
}

function supplementalTerm(label: string, locale: ClsCp002TranslatedLocale): string | undefined {
  const entry = SUPPLEMENTAL_TERMS[label];
  return entry ? localeText(entry, locale) : undefined;
}

function cp001Term(label: string, locale: ClsCp002TranslatedLocale): string | undefined {
  return CLS_CP001_ENTITY_LABELS[label] ? localizedEntityLabel(label, locale) : undefined;
}

function localizedFactPair(fact: ClsCp002RelationFact, locale: ClsCp002TranslatedLocale): readonly [string, string] {
  const ana = localizedAnaFact(fact.factId, locale);
  if (ana) return [ana.left, ana.right];
  const left = supplementalTerm(fact.left, locale);
  const right = supplementalTerm(fact.right, locale);
  if (left && right) return [left, right];
  throw new Error(`Missing ${locale} pair translation for ${fact.factId}`);
}

function uniqueValue(values: readonly string[], message: string): string {
  const unique = [...new Set(values)];
  if (unique.length !== 1) throw new Error(`${message}: ${unique.join(" | ")}`);
  return unique[0]!;
}

function localizeSideFromSources(
  label: string,
  side: "left" | "right",
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): string {
  const values: string[] = [];
  for (const factId of sourceFactIds) {
    const fact = FACT_BY_ID.get(factId);
    if (!fact || fact[side] !== label) continue;
    const localized = localizedFactPair(fact, locale);
    values.push(side === "left" ? localized[0] : localized[1]);
  }
  if (values.length > 0) return uniqueValue(values, `Conflicting ${locale} translations for ${side} '${label}'`);

  const supplemental = supplementalTerm(label, locale);
  if (supplemental) return supplemental;
  const cp001 = cp001Term(label, locale);
  if (cp001) return cp001;
  throw new Error(`Unable to localize ${side} term '${label}' for ${locale}`);
}

export function localizeClsCp002Pair(
  pair: ClsCp002Pair,
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): ClsCp002Pair {
  for (const factId of sourceFactIds) {
    const fact = FACT_BY_ID.get(factId);
    if (!fact) continue;
    const localized = localizedFactPair(fact, locale);
    if (fact.left === pair.left && fact.right === pair.right) {
      return { left: localized[0], right: localized[1] };
    }
    if (fact.left === pair.right && fact.right === pair.left) {
      return { left: localized[1], right: localized[0] };
    }
  }

  return {
    left: localizeSideFromSources(pair.left, "left", sourceFactIds, locale),
    right: localizeSideFromSources(pair.right, "right", sourceFactIds, locale),
  };
}

function canonicalSideFromSources(
  label: string,
  side: "left" | "right",
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): string {
  const values: string[] = [];
  for (const factId of sourceFactIds) {
    const fact = FACT_BY_ID.get(factId);
    if (!fact) continue;
    const localized = localizedFactPair(fact, locale);
    const displayed = side === "left" ? localized[0] : localized[1];
    if (displayed === label) values.push(fact[side]);
  }
  for (const [english, entry] of Object.entries(SUPPLEMENTAL_TERMS)) {
    if (localeText(entry, locale) === label) values.push(english);
  }
  for (const [english, entry] of Object.entries(CLS_CP001_ENTITY_LABELS)) {
    const displayed = locale === "hi-IN" ? entry.hi : entry.pa;
    if (displayed === label) values.push(english);
  }
  return uniqueValue(values, `Unable to reverse ${locale} ${side} term '${label}'`);
}

export function canonicalizeClsCp002Pair(
  pair: ClsCp002Pair,
  sourceFactIds: readonly string[],
  locale: ClsCp002TranslatedLocale,
): ClsCp002Pair {
  for (const factId of sourceFactIds) {
    const fact = FACT_BY_ID.get(factId);
    if (!fact) continue;
    const localized = localizedFactPair(fact, locale);
    if (localized[0] === pair.left && localized[1] === pair.right) {
      return { left: fact.left, right: fact.right };
    }
    if (localized[1] === pair.left && localized[0] === pair.right) {
      return { left: fact.right, right: fact.left };
    }
  }
  return {
    left: canonicalSideFromSources(pair.left, "left", sourceFactIds, locale),
    right: canonicalSideFromSources(pair.right, "right", sourceFactIds, locale),
  };
}

export function localizedClsCp002RelationRule(
  relationId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    const label = localizedClassLabel(classId, locale);
    return locale === "hi-IN"
      ? `जोड़ी के दोनों शब्द ${label} हैं।`
      : `ਜੋੜੀ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ${label} ਹਨ।`;
  }
  const entry = RELATION_TEXT[relationId];
  if (!entry) throw new Error(`Missing ${locale} rule text for ${relationId}`);
  return localeText(entry, locale);
}

export function localizedClsCp002RelationLabel(
  relationId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    const label = localizedClassLabel(classId, locale);
    return locale === "hi-IN" ? `${label} की जोड़ी` : `${label} ਦੀ ਜੋੜੀ`;
  }
  const entry = RELATION_LABELS[relationId];
  if (!entry) {
    const fallback = relationDefinition(relationId).label;
    throw new Error(`Missing ${locale} relation label for ${relationId} (${fallback})`);
  }
  return localeText(entry, locale);
}

export function auditClsCp002TranslationCoverage(): {
  readonly importedFactCount: number;
  readonly supplementalFactCount: number;
  readonly relationCount: number;
} {
  let importedFactCount = 0;
  let supplementalFactCount = 0;
  for (const fact of CLS_CP002_FACTS) {
    for (const locale of ["hi-IN", "pa-IN"] as const) localizedFactPair(fact, locale);
    if (fact.sourceLibrary === "CLS-CP-002") supplementalFactCount += 1;
    else importedFactCount += 1;
  }
  const relationIds = new Set(CLS_CP002_FACTS.map((fact) => fact.relationId));
  for (const relationId of relationIds) {
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      localizedClsCp002RelationLabel(relationId, locale);
      localizedClsCp002RelationRule(relationId, locale);
    }
  }
  return { importedFactCount, supplementalFactCount, relationCount: relationIds.size };
}
