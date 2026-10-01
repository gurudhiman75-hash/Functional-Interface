import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle.ts";

export const VEN_001_SHAPE_REGION_CP_ID = "VEN-CP011" as const;
type L = QuestionStudioLanguage;
type T = Record<L, string>;
const tr = (en: string, hi: string, pa: string): T => ({ en, hi, pa });
const CONTEXTS = [
  {
    id: "SCHOOL_ACTIVITIES",
    sets: [
      tr(
        "students who read the school newspaper",
        "विद्यालय का समाचार-पत्र पढ़ने वाले विद्यार्थी",
        "ਸਕੂਲ ਦਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who play a team sport",
        "टीम खेल खेलने वाले विद्यार्थी",
        "ਟੀਮ ਖੇਡ ਖੇਡਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who attend the science club",
        "विज्ञान क्लब में जाने वाले विद्यार्थी",
        "ਵਿਗਿਆਨ ਕਲੱਬ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "COMMUNITY_SURVEY",
    sets: [
      tr(
        "residents who use the public library",
        "सार्वजनिक पुस्तकालय का उपयोग करने वाले निवासी",
        "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use the sports centre",
        "खेल केंद्र का उपयोग करने वाले निवासी",
        "ਖੇਡ ਕੇਂਦਰ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who attend cultural events",
        "सांस्कृतिक कार्यक्रमों में जाने वाले निवासी",
        "ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
    ],
  },
  {
    id: "TRAINING_COURSE",
    sets: [
      tr(
        "trainees who completed the safety module",
        "सुरक्षा मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the digital-skills module",
        "डिजिटल-कौशल मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਡਿਜ਼ਿਟਲ-ਹੁਨਰ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the first-aid module",
        "प्राथमिक उपचार मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "MEDIA_PREFERENCES",
    sets: [
      tr(
        "people who read the daily paper",
        "दैनिक समाचार-पत्र पढ़ने वाले लोग",
        "ਰੋਜ਼ਾਨਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who listen to a news podcast",
        "समाचार पॉडकास्ट सुनने वाले लोग",
        "ਖ਼ਬਰਾਂ ਦਾ ਪੌਡਕਾਸਟ ਸੁਣਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who watch the evening bulletin",
        "शाम का समाचार बुलेटिन देखने वाले लोग",
        "ਸ਼ਾਮ ਦਾ ਖ਼ਬਰ ਬੁਲੇਟਿਨ ਦੇਖਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
  {
    id: "HEALTH_CAMP",
    sets: [
      tr(
        "visitors who received a blood-pressure check",
        "रक्तचाप जाँच कराने वाले आगंतुक",
        "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a vision check",
        "दृष्टि जाँच कराने वाले आगंतुक",
        "ਨਜ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a diabetes check",
        "मधुमेह जाँच कराने वाले आगंतुक",
        "ਸ਼ੂਗਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
    ],
  },
  {
    id: "WORKPLACE_TOOLS",
    sets: [
      tr(
        "staff who use the project dashboard",
        "परियोजना डैशबोर्ड का उपयोग करने वाले कर्मचारी",
        "ਪ੍ਰੋਜੈਕਟ ਡੈਸ਼ਬੋਰਡ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the shared calendar",
        "साझा कैलेंडर का उपयोग करने वाले कर्मचारी",
        "ਸਾਂਝਾ ਕੈਲੰਡਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the team chat",
        "टीम चैट का उपयोग करने वाले कर्मचारी",
        "ਟੀਮ ਚੈਟ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
    ],
  },
  {
    id: "TRAVEL_SURVEY",
    sets: [
      tr(
        "travellers who used a bus",
        "बस से यात्रा करने वाले यात्री",
        "ਬੱਸ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a train",
        "रेलगाड़ी से यात्रा करने वाले यात्री",
        "ਰੇਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a bicycle",
        "साइकिल से यात्रा करने वाले यात्री",
        "ਸਾਈਕਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
    ],
  },
  {
    id: "WEEKEND_HOBBIES",
    sets: [
      tr("people who garden", "बागवानी करने वाले लोग", "ਬਾਗਬਾਨੀ ਕਰਨ ਵਾਲੇ ਲੋਕ"),
      tr(
        "people who cook a new recipe",
        "नई रेसिपी बनाने वाले लोग",
        "ਨਵੀਂ ਰੈਸਿਪੀ ਬਣਾਉਣ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who take photographs",
        "तस्वीरें लेने वाले लोग",
        "ਤਸਵੀਰਾਂ ਖਿੱਚਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
  {
    id: "EXAM_PREPARATION",
    sets: [
      tr(
        "candidates who attend mathematics classes",
        "गणित की कक्षाओं में जाने वाले अभ्यर्थी",
        "ਗਣਿਤ ਦੀਆਂ ਕਲਾਸਾਂ ਲੈਣ ਵਾਲੇ ਉਮੀਦਵਾਰ",
      ),
      tr(
        "candidates who attend English classes",
        "अंग्रेज़ी की कक्षाओं में जाने वाले अभ्यर्थी",
        "ਅੰਗਰੇਜ਼ੀ ਦੀਆਂ ਕਲਾਸਾਂ ਲੈਣ ਵਾਲੇ ਉਮੀਦਵਾਰ",
      ),
      tr(
        "candidates who attend general-awareness classes",
        "सामान्य जागरूकता की कक्षाओं में जाने वाले अभ्यर्थी",
        "ਆਮ ਜਾਣਕਾਰੀ ਦੀਆਂ ਕਲਾਸਾਂ ਲੈਣ ਵਾਲੇ ਉਮੀਦਵਾਰ",
      ),
    ],
  },
  {
    id: "CROP_CULTIVATION",
    sets: [
      tr(
        "farmers who cultivate wheat",
        "गेहूँ उगाने वाले किसान",
        "ਕਣਕ ਉਗਾਉਣ ਵਾਲੇ ਕਿਸਾਨ",
      ),
      tr(
        "farmers who cultivate mustard",
        "सरसों उगाने वाले किसान",
        "ਸਰ੍ਹੋਂ ਉਗਾਉਣ ਵਾਲੇ ਕਿਸਾਨ",
      ),
      tr(
        "farmers who cultivate cotton",
        "कपास उगाने वाले किसान",
        "ਕਪਾਹ ਉਗਾਉਣ ਵਾਲੇ ਕਿਸਾਨ",
      ),
    ],
  },
  {
    id: "LIBRARY_BORROWING",
    sets: [
      tr(
        "library members who borrow fiction",
        "कथा-साहित्य लेने वाले पुस्तकालय सदस्य",
        "ਗਲਪ ਦੀਆਂ ਕਿਤਾਬਾਂ ਲੈਣ ਵਾਲੇ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰ",
      ),
      tr(
        "library members who borrow biographies",
        "जीवनियाँ लेने वाले पुस्तकालय सदस्य",
        "ਜੀਵਨੀਆਂ ਲੈਣ ਵਾਲੇ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰ",
      ),
      tr(
        "library members who borrow science books",
        "विज्ञान की पुस्तकें लेने वाले पुस्तकालय सदस्य",
        "ਵਿਗਿਆਨ ਦੀਆਂ ਕਿਤਾਬਾਂ ਲੈਣ ਵਾਲੇ ਲਾਇਬ੍ਰੇਰੀ ਮੈਂਬਰ",
      ),
    ],
  },
  {
    id: "ONLINE_PURCHASES",
    sets: [
      tr(
        "customers who bought groceries online",
        "ऑनलाइन किराने का सामान खरीदने वाले ग्राहक",
        "ਆਨਲਾਈਨ ਰਾਸ਼ਨ ਖਰੀਦਣ ਵਾਲੇ ਗਾਹਕ",
      ),
      tr(
        "customers who bought clothing online",
        "ऑनलाइन कपड़े खरीदने वाले ग्राहक",
        "ਆਨਲਾਈਨ ਕੱਪੜੇ ਖਰੀਦਣ ਵਾਲੇ ਗਾਹਕ",
      ),
      tr(
        "customers who bought electronic goods online",
        "ऑनलाइन इलेक्ट्रॉनिक सामान खरीदने वाले ग्राहक",
        "ਆਨਲਾਈਨ ਇਲੈਕਟ੍ਰਾਨਿਕ ਸਮਾਨ ਖਰੀਦਣ ਵਾਲੇ ਗਾਹਕ",
      ),
    ],
  },
  {
    id: "DIGITAL_DEVICES",
    sets: [
      tr(
        "residents who use a smartphone",
        "स्मार्टफ़ोन का उपयोग करने वाले निवासी",
        "ਸਮਾਰਟਫ਼ੋਨ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use a laptop",
        "लैपटॉप का उपयोग करने वाले निवासी",
        "ਲੈਪਟਾਪ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use a tablet",
        "टैबलेट का उपयोग करने वाले निवासी",
        "ਟੈਬਲੈੱਟ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
    ],
  },
  {
    id: "PAYMENT_METHODS",
    sets: [
      tr(
        "customers who paid using UPI",
        "UPI से भुगतान करने वाले ग्राहक",
        "UPI ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰਨ ਵਾਲੇ ਗਾਹਕ",
      ),
      tr(
        "customers who paid using a debit card",
        "डेबिट कार्ड से भुगतान करने वाले ग्राहक",
        "ਡੈਬਿਟ ਕਾਰਡ ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰਨ ਵਾਲੇ ਗਾਹਕ",
      ),
      tr(
        "customers who paid in cash",
        "नकद भुगतान करने वाले ग्राहक",
        "ਨਕਦ ਭੁਗਤਾਨ ਕਰਨ ਵਾਲੇ ਗਾਹਕ",
      ),
    ],
  },
  {
    id: "COMMUNITY_VOLUNTEERING",
    sets: [
      tr(
        "volunteers who joined literacy programmes",
        "साक्षरता कार्यक्रमों में शामिल स्वयंसेवक",
        "ਸਾਖਰਤਾ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਵਲੰਟੀਅਰ",
      ),
      tr(
        "volunteers who joined health camps",
        "स्वास्थ्य शिविरों में शामिल स्वयंसेवक",
        "ਸਿਹਤ ਕੈਂਪਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਵਲੰਟੀਅਰ",
      ),
      tr(
        "volunteers who joined cleanliness drives",
        "स्वच्छता अभियानों में शामिल स्वयंसेवक",
        "ਸਫ਼ਾਈ ਮੁਹਿੰਮਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਵਲੰਟੀਅਰ",
      ),
    ],
  },
  {
    id: "WORKPLACE_SOFTWARE",
    sets: [
      tr(
        "staff who use spreadsheet software",
        "स्प्रेडशीट सॉफ़्टवेयर का उपयोग करने वाले कर्मचारी",
        "ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਸਾਫ਼ਟਵੇਅਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use video-conferencing software",
        "वीडियो-कॉन्फ़्रेंसिंग सॉफ़्टवेयर का उपयोग करने वाले कर्मचारी",
        "ਵੀਡੀਓ ਕਾਨਫ਼ਰੰਸਿੰਗ ਸਾਫ਼ਟਵੇਅਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use presentation software",
        "प्रेज़ेंटेशन सॉफ़्टवेयर का उपयोग करने वाले कर्मचारी",
        "ਪ੍ਰੈਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫ਼ਟਵੇਅਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
    ],
  },
  {
    id: "CULTURAL_EVENTS",
    sets: [
      tr(
        "visitors who attended folk-music performances",
        "लोक-संगीत कार्यक्रमों में शामिल आगंतुक",
        "ਲੋਕ-ਸੰਗੀਤ ਦੇ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who attended theatre performances",
        "नाटक देखने वाले आगंतुक",
        "ਨਾਟਕ ਦੇਖਣ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who attended craft exhibitions",
        "शिल्प प्रदर्शनियों में शामिल आगंतुक",
        "ਦਸਤਕਾਰੀ ਦੀਆਂ ਪ੍ਰਦਰਸ਼ਨੀਆਂ ਵਿੱਚ ਸ਼ਾਮਲ ਆਏ ਲੋਕ",
      ),
    ],
  },
  {
    id: "STREAMING_VIEWERS",
    sets: [
      tr(
        "viewers who stream films",
        "ऑनलाइन फ़िल्में देखने वाले दर्शक",
        "ਆਨਲਾਈਨ ਫ਼ਿਲਮਾਂ ਦੇਖਣ ਵਾਲੇ ਦਰਸ਼ਕ",
      ),
      tr(
        "viewers who stream sports",
        "ऑनलाइन खेल देखने वाले दर्शक",
        "ਆਨਲਾਈਨ ਖੇਡਾਂ ਦੇਖਣ ਵਾਲੇ ਦਰਸ਼ਕ",
      ),
      tr(
        "viewers who stream documentaries",
        "ऑनलाइन वृत्तचित्र देखने वाले दर्शक",
        "ਆਨਲਾਈਨ ਦਸਤਾਵੇਜ਼ੀ ਫ਼ਿਲਮਾਂ ਦੇਖਣ ਵਾਲੇ ਦਰਸ਼ਕ",
      ),
    ],
  },
  {
    id: "SKILL_COURSES",
    sets: [
      tr(
        "trainees who completed a computer-basics course",
        "कंप्यूटर की बुनियादी जानकारी का पाठ्यक्रम पूरा करने वाले प्रशिक्षु",
        "ਕੰਪਿਊਟਰ ਦੀ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ ਦਾ ਕੋਰਸ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed a spoken-English course",
        "बोलचाल की अंग्रेज़ी का पाठ्यक्रम पूरा करने वाले प्रशिक्षु",
        "ਬੋਲਚਾਲ ਦੀ ਅੰਗਰੇਜ਼ੀ ਦਾ ਕੋਰਸ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed a first-aid course",
        "प्राथमिक उपचार का पाठ्यक्रम पूरा करने वाले प्रशिक्षु",
        "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਦਾ ਕੋਰਸ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "MUNICIPAL_SERVICES",
    sets: [
      tr(
        "residents who use the city bus service",
        "शहर की बस सेवा का उपयोग करने वाले निवासी",
        "ਸ਼ਹਿਰ ਦੀ ਬੱਸ ਸੇਵਾ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use public parks",
        "सार्वजनिक पार्कों में जाने वाले निवासी",
        "ਜਨਤਕ ਪਾਰਕਾਂ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who take part in recycling programmes",
        "पुनर्चक्रण कार्यक्रमों में भाग लेने वाले निवासी",
        "ਮੁੜ-ਵਰਤੋਂ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਹਿੱਸਾ ਲੈਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
    ],
  },
] as const;
type Context = (typeof CONTEXTS)[number];
const STEM_OPENERS: Record<string, T> = {
  SCHOOL_ACTIVITIES: tr(
    "At a school, students take part in the newspaper club, team sports and the science club.",
    "एक विद्यालय में विद्यार्थी समाचार-पत्र क्लब, टीम खेलों और विज्ञान क्लब में भाग लेते हैं।",
    "ਇੱਕ ਸਕੂਲ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਅਖ਼ਬਾਰ ਕਲੱਬ, ਟੀਮ ਖੇਡਾਂ ਅਤੇ ਵਿਗਿਆਨ ਕਲੱਬ ਵਿੱਚ ਹਿੱਸਾ ਲੈਂਦੇ ਹਨ।",
  ),
  COMMUNITY_SURVEY: tr(
    "Residents in a neighbourhood use the public library and sports centre, or attend cultural events.",
    "एक मोहल्ले के निवासी सार्वजनिक पुस्तकालय और खेल केंद्र का उपयोग करते हैं या सांस्कृतिक कार्यक्रमों में जाते हैं।",
    "ਇੱਕ ਮੁਹੱਲੇ ਦੇ ਵਸਨੀਕ ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਅਤੇ ਖੇਡ ਕੇਂਦਰ ਵਰਤਦੇ ਹਨ ਜਾਂ ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਜਾਂਦੇ ਹਨ।",
  ),
  TRAINING_COURSE: tr(
    "A training institute tracks trainees completing its safety, digital-skills and first-aid modules.",
    "एक प्रशिक्षण संस्थान सुरक्षा, डिजिटल-कौशल और प्राथमिक उपचार मॉड्यूल पूरे करने वाले प्रशिक्षुओं का लेखा रखता है।",
    "ਇੱਕ ਸਿਖਲਾਈ ਸੰਸਥਾ ਸੁਰੱਖਿਆ, ਡਿਜ਼ਿਟਲ ਹੁਨਰ ਅਤੇ ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਦੇ ਮੋਡੀਊਲ ਪੂਰੇ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀਆਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖਦੀ ਹੈ।",
  ),
  MEDIA_PREFERENCES: tr(
    "A media-use study counts daily newspaper readers, news-podcast listeners and evening-bulletin viewers.",
    "मीडिया के उपयोग से जुड़े अध्ययन में दैनिक समाचार-पत्र पढ़ने, समाचार पॉडकास्ट सुनने और शाम का बुलेटिन देखने वालों की गिनती की गई।",
    "ਮੀਡੀਆ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਅਧਿਐਨ ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ, ਖ਼ਬਰਾਂ ਦਾ ਪੌਡਕਾਸਟ ਸੁਣਨ ਅਤੇ ਸ਼ਾਮ ਦਾ ਬੁਲੇਟਿਨ ਦੇਖਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੀਤੀ ਗਈ।",
  ),
  HEALTH_CAMP: tr(
    "At a health camp, visitors receive blood-pressure, vision and diabetes checks.",
    "स्वास्थ्य शिविर में आगंतुक रक्तचाप, दृष्टि और मधुमेह की जाँच कराते हैं।",
    "ਸਿਹਤ ਕੈਂਪ ਵਿੱਚ ਆਏ ਲੋਕ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ, ਨਜ਼ਰ ਅਤੇ ਸ਼ੂਗਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਂਦੇ ਹਨ।",
  ),
  WORKPLACE_TOOLS: tr(
    "An office review records staff using the project dashboard, shared calendar and team chat.",
    "कार्यालय की समीक्षा में परियोजना डैशबोर्ड, साझा कैलेंडर और टीम चैट का उपयोग करने वाले कर्मचारियों का विवरण है।",
    "ਦਫ਼ਤਰੀ ਸਮੀਖਿਆ ਵਿੱਚ ਪ੍ਰੋਜੈਕਟ ਡੈਸ਼ਬੋਰਡ, ਸਾਂਝਾ ਕੈਲੰਡਰ ਅਤੇ ਟੀਮ ਚੈਟ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀਆਂ ਦਾ ਵੇਰਵਾ ਹੈ।",
  ),
  TRAVEL_SURVEY: tr(
    "On a travel route, passengers use buses, trains and bicycles, sometimes using more than one mode.",
    "एक यात्रा मार्ग पर यात्री बस, रेलगाड़ी और साइकिल का उपयोग करते हैं; कुछ यात्री एक से अधिक साधन अपनाते हैं।",
    "ਇੱਕ ਸਫ਼ਰੀ ਰੂਟ ਉੱਤੇ ਯਾਤਰੀ ਬੱਸ, ਰੇਲ ਅਤੇ ਸਾਈਕਲ ਵਰਤਦੇ ਹਨ; ਕੁਝ ਯਾਤਰੀ ਇੱਕ ਤੋਂ ਵੱਧ ਸਾਧਨ ਵਰਤਦੇ ਹਨ।",
  ),
  WEEKEND_HOBBIES: tr(
    "A weekend-club register lists people who garden, try new recipes and take photographs.",
    "सप्ताहांत क्लब के रजिस्टर में बागवानी, नई रेसिपी बनाने और तस्वीरें लेने वाले लोगों का विवरण है।",
    "ਹਫ਼ਤੇ-ਅੰਤ ਦੇ ਕਲੱਬ ਦੇ ਰਜਿਸਟਰ ਵਿੱਚ ਬਾਗਬਾਨੀ, ਨਵੀਆਂ ਰੈਸਿਪੀਆਂ ਬਣਾਉਣ ਅਤੇ ਤਸਵੀਰਾਂ ਖਿੱਚਣ ਵਾਲੇ ਲੋਕਾਂ ਦਾ ਵੇਰਵਾ ਹੈ।",
  ),
  EXAM_PREPARATION: tr(
    "At an exam-preparation centre, candidates attend mathematics, English and general-awareness classes.",
    "परीक्षा-तैयारी केंद्र में अभ्यर्थी गणित, अंग्रेज़ी और सामान्य जागरूकता की कक्षाएँ लेते हैं।",
    "ਇਮਤਿਹਾਨ ਦੀ ਤਿਆਰੀ ਕਰਾਉਣ ਵਾਲੇ ਕੇਂਦਰ ਵਿੱਚ ਉਮੀਦਵਾਰ ਗਣਿਤ, ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਆਮ ਜਾਣਕਾਰੀ ਦੀਆਂ ਕਲਾਸਾਂ ਲੈਂਦੇ ਹਨ।",
  ),
  CROP_CULTIVATION: tr(
    "Farmers in a block cultivate wheat, mustard and cotton, with some growing more than one crop.",
    "एक क्षेत्र के किसान गेहूँ, सरसों और कपास उगाते हैं; कुछ किसान एक से अधिक फसलें भी उगाते हैं।",
    "ਇੱਕ ਇਲਾਕੇ ਦੇ ਕਿਸਾਨ ਕਣਕ, ਸਰ੍ਹੋਂ ਅਤੇ ਕਪਾਹ ਉਗਾਉਂਦੇ ਹਨ; ਕੁਝ ਕਿਸਾਨ ਇੱਕ ਤੋਂ ਵੱਧ ਫ਼ਸਲਾਂ ਵੀ ਉਗਾਉਂਦੇ ਹਨ।",
  ),
  LIBRARY_BORROWING: tr(
    "Library records show members borrowing fiction, biographies and science books.",
    "पुस्तकालय के अभिलेखों में कथा-साहित्य, जीवनियाँ और विज्ञान की पुस्तकें लेने वाले सदस्यों की संख्या दी गई है।",
    "ਲਾਇਬ੍ਰੇਰੀ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ ਗਲਪ, ਜੀਵਨੀਆਂ ਅਤੇ ਵਿਗਿਆਨ ਦੀਆਂ ਕਿਤਾਬਾਂ ਲੈਣ ਵਾਲੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਦਿੱਤੀ ਗਈ ਹੈ।",
  ),
  ONLINE_PURCHASES: tr(
    "An online retailer groups customers by purchases of groceries, clothing and electronic goods.",
    "एक ऑनलाइन विक्रेता ग्राहकों को किराने के सामान, कपड़ों और इलेक्ट्रॉनिक वस्तुओं की खरीद के आधार पर दर्ज करता है।",
    "ਇੱਕ ਆਨਲਾਈਨ ਵਿਕਰੇਤਾ ਗਾਹਕਾਂ ਨੂੰ ਰਾਸ਼ਨ, ਕੱਪੜੇ ਅਤੇ ਇਲੈਕਟ੍ਰਾਨਿਕ ਸਮਾਨ ਦੀ ਖਰੀਦ ਅਨੁਸਾਰ ਦਰਜ ਕਰਦਾ ਹੈ।",
  ),
  DIGITAL_DEVICES: tr(
    "A household study records residents who use smartphones, laptops and tablets.",
    "एक घरेलू अध्ययन में स्मार्टफ़ोन, लैपटॉप और टैबलेट का उपयोग करने वाले निवासियों का विवरण है।",
    "ਘਰੇਲੂ ਅਧਿਐਨ ਵਿੱਚ ਸਮਾਰਟਫ਼ੋਨ, ਲੈਪਟਾਪ ਅਤੇ ਟੈਬਲੈੱਟ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕਾਂ ਦਾ ਵੇਰਵਾ ਹੈ।",
  ),
  PAYMENT_METHODS: tr(
    "A shop's payment records cover customers paying by UPI, debit card and cash.",
    "एक दुकान के भुगतान अभिलेखों में UPI, डेबिट कार्ड और नकद से भुगतान करने वाले ग्राहक शामिल हैं।",
    "ਇੱਕ ਦੁਕਾਨ ਦੇ ਭੁਗਤਾਨ ਰਿਕਾਰਡ ਵਿੱਚ UPI, ਡੈਬਿਟ ਕਾਰਡ ਅਤੇ ਨਕਦ ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰਨ ਵਾਲੇ ਗਾਹਕ ਸ਼ਾਮਲ ਹਨ।",
  ),
  COMMUNITY_VOLUNTEERING: tr(
    "A community organisation assigns volunteers to literacy programmes, health camps and cleanliness drives.",
    "एक सामुदायिक संस्था स्वयंसेवकों को साक्षरता कार्यक्रमों, स्वास्थ्य शिविरों और स्वच्छता अभियानों में लगाती है।",
    "ਇੱਕ ਭਾਈਚਾਰਕ ਸੰਸਥਾ ਵਲੰਟੀਅਰਾਂ ਨੂੰ ਸਾਖਰਤਾ ਪ੍ਰੋਗਰਾਮਾਂ, ਸਿਹਤ ਕੈਂਪਾਂ ਅਤੇ ਸਫ਼ਾਈ ਮੁਹਿੰਮਾਂ ਵਿੱਚ ਲਗਾਉਂਦੀ ਹੈ।",
  ),
  WORKPLACE_SOFTWARE: tr(
    "A company checks which staff use spreadsheet, video-conferencing and presentation software.",
    "एक कंपनी यह दर्ज करती है कि कौन-से कर्मचारी स्प्रेडशीट, वीडियो-कॉन्फ़्रेंसिंग और प्रेज़ेंटेशन सॉफ़्टवेयर का उपयोग करते हैं।",
    "ਇੱਕ ਕੰਪਨੀ ਦਰਜ ਕਰਦੀ ਹੈ ਕਿ ਕਿਹੜੇ ਕਰਮਚਾਰੀ ਸਪ੍ਰੈੱਡਸ਼ੀਟ, ਵੀਡੀਓ ਕਾਨਫ਼ਰੰਸਿੰਗ ਅਤੇ ਪ੍ਰੈਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫ਼ਟਵੇਅਰ ਵਰਤਦੇ ਹਨ।",
  ),
  CULTURAL_EVENTS: tr(
    "At a cultural festival, visitors attend folk-music performances, theatre and craft exhibitions.",
    "सांस्कृतिक उत्सव में आगंतुक लोक-संगीत कार्यक्रमों, नाटकों और शिल्प प्रदर्शनियों में शामिल होते हैं।",
    "ਸੱਭਿਆਚਾਰਕ ਮੇਲੇ ਵਿੱਚ ਲੋਕ ਲੋਕ-ਸੰਗੀਤ ਦੇ ਪ੍ਰੋਗਰਾਮਾਂ, ਨਾਟਕਾਂ ਅਤੇ ਦਸਤਕਾਰੀ ਦੀਆਂ ਪ੍ਰਦਰਸ਼ਨੀਆਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।",
  ),
  STREAMING_VIEWERS: tr(
    "A streaming platform counts viewers watching films, sports and documentaries.",
    "एक स्ट्रीमिंग मंच पर फ़िल्में, खेल और वृत्तचित्र देखने वाले दर्शकों की संख्या दर्ज की गई है।",
    "ਇੱਕ ਸਟ੍ਰੀਮਿੰਗ ਪਲੇਟਫ਼ਾਰਮ ਉੱਤੇ ਫ਼ਿਲਮਾਂ, ਖੇਡਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ੀ ਫ਼ਿਲਮਾਂ ਦੇਖਣ ਵਾਲੇ ਦਰਸ਼ਕਾਂ ਦੀ ਗਿਣਤੀ ਦਰਜ ਹੈ।",
  ),
  SKILL_COURSES: tr(
    "A training programme tracks learners completing computer-basics, spoken-English and first-aid courses.",
    "एक प्रशिक्षण कार्यक्रम कंप्यूटर की बुनियादी जानकारी, बोलचाल की अंग्रेज़ी और प्राथमिक उपचार के पाठ्यक्रम पूरे करने वाले प्रशिक्षुओं का लेखा रखता है।",
    "ਇੱਕ ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ ਕੰਪਿਊਟਰ ਦੀ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ, ਬੋਲਚਾਲ ਦੀ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਦੇ ਕੋਰਸ ਪੂਰੇ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀਆਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖਦਾ ਹੈ।",
  ),
  MUNICIPAL_SERVICES: tr(
    "A city report records residents using the bus service, visiting public parks and joining recycling programmes.",
    "शहर की रिपोर्ट में बस सेवा का उपयोग करने, सार्वजनिक पार्कों में जाने और पुनर्चक्रण कार्यक्रमों में भाग लेने वाले निवासियों का विवरण है।",
    "ਸ਼ਹਿਰ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਬੱਸ ਸੇਵਾ ਵਰਤਣ, ਜਨਤਕ ਪਾਰਕਾਂ ਵਿੱਚ ਜਾਣ ਅਤੇ ਮੁੜ-ਵਰਤੋਂ ਪ੍ਰੋਗਰਾਮਾਂ ਵਿੱਚ ਹਿੱਸਾ ਲੈਣ ਵਾਲੇ ਵਸਨੀਕਾਂ ਦਾ ਵੇਰਵਾ ਹੈ।",
  ),
};
const QUESTIONS: readonly {
  key: string;
  masks: number[];
  label: T;
  pattern: "single" | "pair" | "triple" | "union" | "exactly-one";
}[] = [
  {
    key: "only-A",
    masks: [1],
    label: tr(
      "in only the first set",
      "केवल पहले समूह में",
      "ਸਿਰਫ਼ ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ",
    ),
    pattern: "single",
  },
  {
    key: "only-B",
    masks: [2],
    label: tr(
      "in only the second set",
      "केवल दूसरे समूह में",
      "ਸਿਰਫ਼ ਦੂਜੇ ਸਮੂਹ ਵਿੱਚ",
    ),
    pattern: "single",
  },
  {
    key: "only-C",
    masks: [4],
    label: tr(
      "in only the third set",
      "केवल तीसरे समूह में",
      "ਸਿਰਫ਼ ਤੀਜੇ ਸਮੂਹ ਵਿੱਚ",
    ),
    pattern: "single",
  },
  {
    key: "A-and-B-not-C",
    masks: [3],
    label: tr(
      "in both the first and second sets, but not the third",
      "पहले और दूसरे दोनों समूहों में, लेकिन तीसरे में नहीं",
      "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ, ਪਰ ਤੀਜੇ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "A-and-C-not-B",
    masks: [5],
    label: tr(
      "in both the first and third sets, but not the second",
      "पहले और तीसरे दोनों समूहों में, लेकिन दूसरे में नहीं",
      "ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ, ਪਰ ਦੂਜੇ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "B-and-C-not-A",
    masks: [6],
    label: tr(
      "in both the second and third sets, but not the first",
      "दूसरे और तीसरे दोनों समूहों में, लेकिन पहले में नहीं",
      "ਦੂਜੇ ਅਤੇ ਤੀਜੇ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ, ਪਰ ਪਹਿਲੇ ਵਿੱਚ ਨਹੀਂ",
    ),
    pattern: "pair",
  },
  {
    key: "all-three",
    masks: [7],
    label: tr("in all three sets", "तीनों समूहों में", "ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ"),
    pattern: "triple",
  },
  {
    key: "at-least-two",
    masks: [3, 5, 6, 7],
    label: tr(
      "in at least two sets",
      "कम-से-कम दो समूहों में",
      "ਘੱਟੋ-ਘੱਟ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ",
    ),
    pattern: "union",
  },
  {
    key: "exactly-one",
    masks: [1, 2, 4],
    label: tr("in exactly one set", "ठीक एक समूह में", "ਠੀਕ ਇੱਕ ਸਮੂਹ ਵਿੱਚ"),
    pattern: "exactly-one",
  },
  {
    key: "any-shape",
    masks: [1, 2, 3, 4, 5, 6, 7],
    label: tr(
      "in at least one set",
      "कम-से-कम एक समूह में",
      "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ",
    ),
    pattern: "union",
  },
];
function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
type ShapeKind =
  | "circle"
  | "ellipse"
  | "rectangle"
  | "square"
  | "triangle"
  | "right-triangle"
  | "diamond"
  | "trapezoid"
  | "pentagon";
export type ShapeLayout = {
  id: string;
  shapes: readonly [ShapeKind, ShapeKind, ShapeKind];
};
export const LAYOUTS: readonly ShapeLayout[] = [
  {
    id: "CIRCLE_RECTANGLE_TRIANGLE",
    shapes: ["circle", "rectangle", "triangle"],
  },
  {
    id: "ELLIPSE_RECTANGLE_TRIANGLE",
    shapes: ["ellipse", "rectangle", "triangle"],
  },
  { id: "CIRCLE_SQUARE_TRIANGLE", shapes: ["circle", "square", "triangle"] },
  {
    id: "CIRCLE_RECTANGLE_DIAMOND",
    shapes: ["circle", "rectangle", "diamond"],
  },
  { id: "ELLIPSE_SQUARE_DIAMOND", shapes: ["ellipse", "square", "diamond"] },
  {
    id: "ELLIPSE_RECTANGLE_DIAMOND",
    shapes: ["ellipse", "rectangle", "diamond"],
  },
  {
    id: "CIRCLE_RECTANGLE_RIGHT_TRIANGLE",
    shapes: ["circle", "rectangle", "right-triangle"],
  },
  {
    id: "ELLIPSE_RECTANGLE_TRAPEZOID",
    shapes: ["ellipse", "rectangle", "trapezoid"],
  },
  {
    id: "CIRCLE_RECTANGLE_PENTAGON",
    shapes: ["circle", "rectangle", "pentagon"],
  },
];
const POLYGONS = {
  triangle: [
    [304, 95],
    [64, 433],
    [538, 463],
  ],
  diamond: [
    [304, 95],
    [538, 279],
    [304, 463],
    [64, 279],
  ],
  "right-triangle": [
    [120, 100],
    [340, 100],
    [120, 480],
  ],
  trapezoid: [
    [176, 92],
    [430, 92],
    [556, 478],
    [54, 478],
  ],
  pentagon: [
    [304, 76],
    [566, 266],
    [466, 478],
    [142, 478],
    [42, 266],
  ],
} as const;
function inside(shape: ShapeKind, x: number, y: number): boolean {
  if (shape === "circle") return (x - 397) ** 2 + (y - 237) ** 2 < 175 ** 2;
  if (shape === "ellipse")
    return (x - 397) ** 2 / 225 ** 2 + (y - 237) ** 2 / 150 ** 2 < 1;
  if (shape === "rectangle") return x > 76 && x < 575 && y > 200 && y < 374;
  if (shape === "square") return x > 180 && x < 520 && y > 170 && y < 510;
  const points = POLYGONS[shape];
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]!,
      [xj, yj] = points[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}
function segDist(
  x: number,
  y: number,
  a: readonly number[],
  b: readonly number[],
): number {
  const dx = b[0]! - a[0]!,
    dy = b[1]! - a[1]!;
  const t = Math.max(
    0,
    Math.min(1, ((x - a[0]!) * dx + (y - a[1]!) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(x - a[0]! - t * dx, y - a[1]! - t * dy);
}
function clearance(shape: ShapeKind, x: number, y: number): number {
  if (shape === "circle") return Math.abs(Math.hypot(x - 397, y - 237) - 175);
  if (shape === "ellipse")
    return Math.abs(Math.hypot((x - 397) / 225, (y - 237) / 150) - 1) * 150;
  if (shape === "rectangle" || shape === "square") {
    const [left, top, right, bottom] =
      shape === "rectangle" ? [76, 200, 575, 374] : [180, 170, 520, 510];
    if (inside(shape, x, y))
      return Math.min(x - left, right - x, y - top, bottom - y);
    return Math.hypot(
      Math.max(left - x, 0, x - right),
      Math.max(top - y, 0, y - bottom),
    );
  }
  const points = POLYGONS[shape];
  return Math.min(
    ...points.map((a, i) => segDist(x, y, a, points[(i + 1) % points.length]!)),
  );
}
const POINT_CACHE = new Map<string, readonly (readonly [number, number])[]>();
export function pointsFor(
  layout: ShapeLayout,
): readonly (readonly [number, number])[] {
  const cached = POINT_CACHE.get(layout.id);
  if (cached) return cached;
  const best: ({ x: number; y: number; margin: number } | undefined)[] =
    Array(8).fill(undefined);
  for (let y = 72; y < 488; y += 3)
    for (let x = 24; x < 620; x += 3) {
      const mask = maskAt(layout, x, y);
      const margin = Math.min(
        ...layout.shapes.map((shape) => clearance(shape, x, y)),
      );
      if (margin < 20 || (x < 160 && y < 90)) continue;
      if (!best[mask] || margin > best[mask]!.margin)
        best[mask] = { x, y, margin };
    }
  if (best.some((point) => !point))
    throw new Error(
      `Shape layout ${layout.id} lacks readable masks: ${best
        .map((point, mask) => (point ? "" : mask))
        .filter(Boolean)
        .join(",")}`,
    );
  const result = best.map((point) => [point!.x, point!.y] as const);
  POINT_CACHE.set(layout.id, result);
  return result;
}
export function maskAt(layout: ShapeLayout, x: number, y: number): number {
  return layout.shapes.reduce(
    (mask, shape, i) => mask | (inside(shape, x, y) ? 1 << i : 0),
    0,
  );
}
export function pointClearance(
  layout: ShapeLayout,
  x: number,
  y: number,
): number {
  return Math.min(...layout.shapes.map((shape) => clearance(shape, x, y)));
}
function shapeMarkup(shape: ShapeKind, color: string): string {
  const style = `fill="${color}" fill-opacity=".28" stroke="${color}" stroke-width="3"`;
  if (shape === "circle") return `<circle cx="397" cy="237" r="175" ${style}/>`;
  if (shape === "ellipse")
    return `<ellipse cx="397" cy="237" rx="225" ry="150" ${style}/>`;
  if (shape === "rectangle")
    return `<rect x="76" y="200" width="499" height="174" ${style}/>`;
  if (shape === "square")
    return `<rect x="180" y="170" width="340" height="340" ${style}/>`;
  return `<polygon points="${POLYGONS[shape].map(([x, y]) => `${x},${y}`).join(" ")}" ${style}/>`;
}
const SHAPE_LABELS: Record<ShapeKind, T> = {
  circle: tr("circle", "वृत्त", "ਚੱਕਰ"),
  ellipse: tr("ellipse", "दीर्घवृत्त", "ਅੰਡਾਕਾਰ"),
  rectangle: tr("rectangle", "आयत", "ਆਇਤ"),
  square: tr("square", "वर्ग", "ਵਰਗ"),
  triangle: tr("triangle", "त्रिभुज", "ਤਿਕੋਣ"),
  "right-triangle": tr("right-angled triangle", "समकोण त्रिभुज", "ਸਮਕੋਣ ਤਿਕੋਣ"),
  diamond: tr("diamond", "हीराकार", "ਹੀਰੇ ਵਰਗਾ ਆਕਾਰ"),
  trapezoid: tr("trapezoid", "समलंब चतुर्भुज", "ਸਮਲੰਬ ਚਤੁਰਭੁਜ"),
  pentagon: tr("pentagon", "पंचभुज", "ਪੰਜਭੁਜ"),
};
function regionName(mask: number, l: L): string {
  const en = [
    "outside all three shapes",
    "first shape only",
    "second shape only",
    "first and second shapes only",
    "third shape only",
    "first and third shapes only",
    "second and third shapes only",
    "all three shapes",
  ];
  const hi = [
    "तीनों आकृतियों के बाहर",
    "केवल पहली आकृति",
    "केवल दूसरी आकृति",
    "पहली और दूसरी आकृति, तीसरी के बिना",
    "केवल तीसरी आकृति",
    "पहली और तीसरी आकृति, दूसरी के बिना",
    "दूसरी और तीसरी आकृति, पहली के बिना",
    "तीनों आकृतियाँ",
  ];
  const pa = [
    "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਤੋਂ ਬਾਹਰ",
    "ਸਿਰਫ਼ ਪਹਿਲਾ ਆਕਾਰ",
    "ਸਿਰਫ਼ ਦੂਜਾ ਆਕਾਰ",
    "ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਆਕਾਰ, ਤੀਜੇ ਤੋਂ ਬਿਨਾਂ",
    "ਸਿਰਫ਼ ਤੀਜਾ ਆਕਾਰ",
    "ਪਹਿਲੇ ਅਤੇ ਤੀਜੇ ਆਕਾਰ, ਦੂਜੇ ਤੋਂ ਬਿਨਾਂ",
    "ਦੂਜੇ ਅਤੇ ਤੀਜੇ ਆਕਾਰ, ਪਹਿਲੇ ਤੋਂ ਬਿਨਾਂ",
    "ਤਿੰਨੇ ਆਕਾਰ",
  ];
  return (l === "en" ? en : l === "hi" ? hi : pa)[mask]!;
}
function svg(
  r: readonly number[],
  c: Context,
  l: L,
  layout: ShapeLayout,
): string {
  const points = pointsFor(layout),
    categories = c.sets.map((x) => x[l]);
  const labels = layout.shapes.map(
    (shape, i) => `${"ABC"[i]} — ${SHAPE_LABELS[shape][l]} = ${categories[i]}`,
  );
  const marks = layout.shapes
    .map((shape, i) =>
      shapeMarkup(shape, ["#25845f", "#7b4ab5", "#d28b21"][i]!),
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 500" role="img" aria-label="Counts in three overlapping geometric shapes"><rect x="4" y="4" width="632" height="492" rx="10" fill="#fff" stroke="#b8c3cf"/>${marks}<g font-family="sans-serif" font-size="13" fill="#152536"><text x="8" y="23">${labels[0]}</text><text x="8" y="42">${labels[1]}</text><text x="8" y="61">${labels[2]}</text></g><g font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#152536">${r.map((v, m) => `<text x="${points[m]![0]}" y="${points[m]![1]}" data-mask="${m}">${v}</text>`).join("")}</g><metadata data-layout="${layout.id}" data-label-clearance="20"/></svg>`;
}
function stem(
  c: Context,
  q: (typeof QUESTIONS)[number],
  l: L,
  layout: ShapeLayout,
): string {
  const title = STEM_OPENERS[c.id]![l];
  const names = layout.shapes.map((shape) => SHAPE_LABELS[shape][l]);
  const participating = [0, 1, 2].filter((index) =>
    q.masks.some((mask) => mask & (1 << index)),
  );
  const ask =
    q.pattern === "single"
      ? l === "en"
        ? `How many people are in the region belonging only to the ${names[participating[0]!]}?`
        : l === "hi"
          ? `केवल ${names[participating[0]!]} वाले क्षेत्र में कितने लोग हैं?`
          : `ਸਿਰਫ਼ ${names[participating[0]!]} ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕ ਹਨ?`
      : q.pattern === "pair"
        ? l === "en"
          ? `How many people are in the region common to the ${names[participating[0]!]} and ${names[participating[1]!]}, but not the ${names[[0, 1, 2].find((i) => !participating.includes(i))!]}?`
          : l === "hi"
            ? `${names[participating[0]!]} और ${names[participating[1]!]} के साझा क्षेत्र में, लेकिन ${names[[0, 1, 2].find((i) => !participating.includes(i))!]} में नहीं, कितने लोग हैं?`
            : `${names[participating[0]!]} ਅਤੇ ${names[participating[1]!]} ਦੇ ਸਾਂਝੇ ਖੇਤਰ ਵਿੱਚ, ਪਰ ${names[[0, 1, 2].find((i) => !participating.includes(i))!]} ਵਿੱਚ ਨਹੀਂ, ਕਿੰਨੇ ਲੋਕ ਹਨ?`
        : q.pattern === "triple"
          ? l === "en"
            ? "How many people are in the region common to all three shapes?"
            : l === "hi"
              ? "तीनों आकृतियों के साझा क्षेत्र में कितने लोग हैं?"
              : "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਦੇ ਸਾਂਝੇ ਖੇਤਰ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕ ਹਨ?"
          : q.key === "at-least-two"
            ? l === "en"
              ? "How many people belong to at least two of these groups?"
              : l === "hi"
                ? "कम-से-कम दो समूहों में कितने लोग हैं?"
                : "ਘੱਟੋ-ਘੱਟ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕ ਹਨ?"
            : q.key === "exactly-one"
              ? l === "en"
                ? "How many people belong to exactly one of these groups?"
                : l === "hi"
                  ? "ठीक एक समूह में कितने लोग हैं?"
                  : "ਠੀਕ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕ ਹਨ?"
              : l === "en"
                ? "How many people belong to at least one of these groups?"
                : l === "hi"
                  ? "कम-से-कम एक समूह में कितने लोग हैं?"
                  : "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਕਿੰਨੇ ਲੋਕ ਹਨ?";
  return `${title} ${ask}`;
}
export function isVen001ShapeRegionRequest(
  req: QuestionStudioGenerationRequest,
): boolean {
  const selectors = [
    req.packageId,
    req.patternId,
    req.canonicalProblemId,
    req.questionLanguageId,
  ].map((v) => text(v).toUpperCase());
  return (
    selectors.includes(VEN_001_SHAPE_REGION_CP_ID) ||
    selectors.includes("VEN-001-SHAPE-REGIONS")
  );
}
export function generateVen001ShapeRegionBatch(
  req: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (req.runtimeMode && req.runtimeMode !== "review-only")
    throw new Error("VEN-001 shape-region questions are review-only");
  const l = req.language ?? "en";
  if (!(l === "en" || l === "hi" || l === "pa"))
    throw new Error(`Unsupported VEN-001 language: ${l}`);
  const count = req.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50)
    throw new Error("VEN-CP011 batch count must be 1–50");
  const seed = text(req.seed) || "ven-001-shape-regions-review-v1";
  const contextStart = hash(`${seed}:context-order`) % CONTEXTS.length;
  const questions = Array.from({ length: count }, (_, i) => {
    const c = CONTEXTS[(contextStart + i) % CONTEXTS.length]!;
    const q = QUESTIONS[hash(`${seed}:query:${i}`) % QUESTIONS.length]!;
    const layout = LAYOUTS[i % LAYOUTS.length]!;
    const regions = Array.from(
      { length: 8 },
      (_, m) => 8 + (hash(`${seed}:${i}:${c.id}:${m}`) % 42),
    );
    const answer = q.masks.reduce((sum, m) => sum + regions[m]!, 0);
    const distractors = [
      ...new Set(
        [
          answer + regions[(q.masks[0]! + 1) % 8]!,
          Math.max(0, answer - regions[(q.masks[0]! + 2) % 8]!),
          answer + regions[(q.masks[0]! + 3) % 8]!,
        ].map(String),
      ),
    ];
    for (let delta = 1; distractors.length < 3; delta++) {
      const v = String(answer + delta);
      if (v !== String(answer) && !distractors.includes(v)) distractors.push(v);
    }
    const options = [String(answer), ...distractors.slice(0, 3)].sort(
      (a, b) => hash(`${seed}:${i}:${a}`) - hash(`${seed}:${i}:${b}`),
    );
    const correctIndex = options.indexOf(String(answer));
    let explanation: string;
    const namedValues = q.masks.map(
      (m) => `${regionName(m, l)}: ${regions[m]}`,
    );
    const calculation = q.masks.map((m) => String(regions[m])).join(" + ");
    if (l === "en")
      explanation = `Use ${namedValues.join(q.masks.length === 2 ? " and " : "; ")}. These are the ${q.label[l]} region${q.masks.length > 1 ? "s" : ""}; the remaining diagram regions do not meet that condition. ${calculation} = ${answer}.`;
    else if (l === "hi")
      explanation = `${namedValues.join("; ")}। यही ${q.label[l]} वाले क्षेत्र हैं; आरेख के बाकी क्षेत्र इस शर्त में नहीं आते। ${calculation} = ${answer}।`;
    else
      explanation = `${namedValues.join("; ")}। ਇਹ ${q.label[l]} ਵਾਲੇ ਖੇਤਰ ਹਨ; ਚਿੱਤਰ ਦੇ ਬਾਕੀ ਖੇਤਰ ਇਸ ਸ਼ਰਤ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ। ${calculation} = ${answer}।`;
    const id = `VEN-CP011:${c.id}:${q.key}:${hash(`${seed}:${i}`)}:${l}`;
    const questionStem = stem(c, q, l, layout);
    return {
      ...lifecycle,
      id,
      questionId: id,
      packageId: "VEN-001",
      patternId: VEN_001_SHAPE_REGION_CP_ID,
      cpId: VEN_001_SHAPE_REGION_CP_ID,
      checkpointId: VEN_001_SHAPE_REGION_CP_ID,
      subject: "Reasoning Ability",
      contentDomain: "Geometric Venn diagram region reading",
      topic: "Venn Diagrams",
      subtopic: "Geometric shape region counts",
      language: l,
      locale: l === "en" ? "en-IN" : l === "hi" ? "hi-IN" : "pa-IN",
      stem: questionStem,
      text: questionStem,
      options,
      optionLabels: ["A", "B", "C", "D"],
      correctIndex,
      correct: correctIndex,
      answer: "ABCD"[correctIndex],
      canonicalAnswer: String(answer),
      explanation,
      stimulusSvgs: [svg(regions, c, l, layout)],
      explanationSvgs: [svg(regions, c, l, layout)],
      optionDetails: options.map((value, j) => ({
        label: "ABCD"[j],
        text: value,
        isCorrect: j === correctIndex,
      })),
      difficulty: "Medium",
      difficultyLabel: "Medium",
      difficultyAuthority: "PROVISIONAL_OPERATION_BASED",
      questionOperation: "GEOMETRIC_REGION_COUNT",
      generationSeed: seed,
      reviewStatus: "REVIEW_CANDIDATE_TRILINGUAL",
      runtimeMode: "review-only",
      reviewOnly: true,
      readOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      sharedStimulus: questionStem,
      semanticMetadata: {
        scenarioId: c.id,
        shapeLayoutId: layout.id,
        shapeTypes: layout.shapes,
        queryKey: q.key,
        queryPattern: q.pattern,
        shapeSetLabels: c.sets.map((s) => s[l]),
        exclusiveRegions: regions,
        selectedMasks: q.masks,
      },
      validation: {
        exactlyOneCorrect:
          options.filter((x) => x === String(answer)).length === 1,
        fourUniqueOptions: new Set(options).size === 4,
        allEightRegionsVisible: regions.length === 8,
        shapeLayoutHasEightRegions: true,
        labelClearancePx: 20,
        localeParityPendingHumanReview: true,
      },
    };
  });
  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "VEN-001",
      requestedCheckpoint: VEN_001_SHAPE_REGION_CP_ID,
      language: l,
      seed,
      count,
      reviewOnly: true,
      questionBankWritable: false,
    },
  };
}
