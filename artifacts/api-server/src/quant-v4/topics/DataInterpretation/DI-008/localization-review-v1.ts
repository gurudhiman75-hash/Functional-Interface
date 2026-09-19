import { generateDi008PermanentQuestion } from "./permanent-question-generator";
import type {
  Di008V2ExamProfile,
  Di008V2Question,
  Di008V2Row,
  Di008V2Stimulus,
  Di008V2TaskKind,
} from "./arithmetic-v2-types";

export type Di008LocalizationLocale = "hi-IN" | "pa-IN";

type LocalizedPair = Readonly<{ hi: string; pa: string }>;

export const DI008_LOCALIZATION_REVIEW_ID = "DI-008-HI-PA-REVIEW-V1" as const;
export const DI008_LOCALIZATION_RELEASE_ID = "DI-008-HI-PA-FROZEN-V1" as const;

export const DI008_LOCALIZATION_LABELS: Readonly<Record<string, LocalizedPair>> = Object.freeze({
  "Notebooks": { hi: "नोटबुक", pa: "ਨੋਟਬੁੱਕ" },
  "Folders": { hi: "फ़ोल्डर", pa: "ਫੋਲਡਰ" },
  "Marker sets": { hi: "मार्कर सेट", pa: "ਮਾਰਕਰ ਸੈੱਟ" },
  "Desk files": { hi: "डेस्क फ़ाइलें", pa: "ਡੈਸਕ ਫਾਈਲਾਂ" },
  "Staplers": { hi: "स्टेपलर", pa: "ਸਟੇਪਲਰ" },
  "Pens": { hi: "पेन", pa: "ਪੈਨ" },
  "Pencils": { hi: "पेंसिल", pa: "ਪੈਂਸਿਲ" },
  "Erasers": { hi: "रबर", pa: "ਰਬੜ" },
  "Highlighters": { hi: "हाइलाइटर", pa: "ਹਾਈਲਾਈਟਰ" },
  "Clipboards": { hi: "क्लिपबोर्ड", pa: "ਕਲਿੱਪਬੋਰਡ" },
  "Envelopes": { hi: "लिफ़ाफ़े", pa: "ਲਿਫ਼ਾਫ਼ੇ" },
  "Register books": { hi: "रजिस्टर", pa: "ਰਜਿਸਟਰ" },
  "Sticky notes": { hi: "स्टिकी नोट", pa: "ਸਟਿੱਕੀ ਨੋਟ" },
  "Correction pens": { hi: "करेक्शन पेन", pa: "ਕਰੈਕਸ਼ਨ ਪੈਨ" },
  "Geometry boxes": { hi: "ज्यामिति बॉक्स", pa: "ਜਿਆਮਿਤੀ ਬਾਕਸ" },
  "Glue sticks": { hi: "गोंद स्टिक", pa: "ਗੂੰਦ ਸਟਿਕ" },
  "Punching machines": { hi: "पंच मशीन", pa: "ਪੰਚ ਮਸ਼ੀਨ" },
  "Paper clips": { hi: "पेपर क्लिप", pa: "ਪੇਪਰ ਕਲਿੱਪ" },
  "Binder clips": { hi: "बाइंडर क्लिप", pa: "ਬਾਈਂਡਰ ਕਲਿੱਪ" },
  "Whiteboard markers": { hi: "व्हाइटबोर्ड मार्कर", pa: "ਵਾਈਟਬੋਰਡ ਮਾਰਕਰ" },
  "Sketch pens": { hi: "स्केच पेन", pa: "ਸਕੈਚ ਪੈਨ" },
  "Index cards": { hi: "इंडेक्स कार्ड", pa: "ਇੰਡੈਕਸ ਕਾਰਡ" },
  "Drawing sheets": { hi: "ड्रॉइंग शीट", pa: "ਡਰਾਇੰਗ ਸ਼ੀਟ" },
  "Writing pads": { hi: "राइटिंग पैड", pa: "ਰਾਈਟਿੰਗ ਪੈਡ" },

  "Tea packs": { hi: "चाय पैक", pa: "ਚਾਹ ਪੈਕ" },
  "Coffee jars": { hi: "कॉफी जार", pa: "ਕੌਫੀ ਜਾਰ" },
  "Cereal boxes": { hi: "सीरियल बॉक्स", pa: "ਸੀਰੀਅਲ ਬਾਕਸ" },
  "Biscuit packs": { hi: "बिस्कुट पैक", pa: "ਬਿਸਕੁਟ ਪੈਕ" },
  "Juice cartons": { hi: "जूस कार्टन", pa: "ਜੂਸ ਕਾਰਟਨ" },
  "Noodle packs": { hi: "नूडल पैक", pa: "ਨੂਡਲ ਪੈਕ" },
  "Pasta packets": { hi: "पास्ता पैकेट", pa: "ਪਾਸਤਾ ਪੈਕਟ" },
  "Jam bottles": { hi: "जैम की बोतलें", pa: "ਜੈਮ ਦੀਆਂ ਬੋਤਲਾਂ" },
  "Sauce bottles": { hi: "सॉस की बोतलें", pa: "ਸੌਸ ਦੀਆਂ ਬੋਤਲਾਂ" },
  "Snack packs": { hi: "स्नैक पैक", pa: "ਸਨੈਕ ਪੈਕ" },
  "Oat boxes": { hi: "ओट्स बॉक्स", pa: "ਓਟਸ ਬਾਕਸ" },
  "Spice boxes": { hi: "मसाला बॉक्स", pa: "ਮਸਾਲਾ ਬਾਕਸ" },
  "Soup packets": { hi: "सूप पैकेट", pa: "ਸੂਪ ਪੈਕਟ" },
  "Milk powder tins": { hi: "दूध पाउडर के डिब्बे", pa: "ਦੁੱਧ ਪਾਊਡਰ ਦੇ ਡੱਬੇ" },
  "Pickle jars": { hi: "अचार के जार", pa: "ਅਚਾਰ ਦੇ ਜਾਰ" },
  "Chocolate boxes": { hi: "चॉकलेट बॉक्स", pa: "ਚਾਕਲੇਟ ਬਾਕਸ" },
  "Dry-fruit packs": { hi: "सूखे मेवों के पैक", pa: "ਸੁੱਕੇ ਮੇਵਿਆਂ ਦੇ ਪੈਕ" },
  "Honey bottles": { hi: "शहद की बोतलें", pa: "ਸ਼ਹਿਦ ਦੀਆਂ ਬੋਤਲਾਂ" },
  "Wafer packs": { hi: "वेफ़र पैक", pa: "ਵੇਫਰ ਪੈਕ" },
  "Breakfast mix packs": { hi: "नाश्ता मिश्रण पैक", pa: "ਨਾਸ਼ਤਾ ਮਿਸ਼ਰਣ ਪੈਕ" },
  "Instant drink jars": { hi: "इंस्टेंट ड्रिंक जार", pa: "ਤੁਰੰਤ ਪੇਅ ਜਾਰ" },
  "Cookie boxes": { hi: "कुकी बॉक्स", pa: "ਕੁਕੀ ਬਾਕਸ" },
  "Energy bar boxes": { hi: "एनर्जी बार बॉक्स", pa: "ਐਨਰਜੀ ਬਾਰ ਬਾਕਸ" },
  "Vermicelli packs": { hi: "सेवई पैक", pa: "ਸੇਵਈਆਂ ਦੇ ਪੈਕ" },

  "Footballs": { hi: "फुटबॉल", pa: "ਫੁੱਟਬਾਲ" },
  "Badminton rackets": { hi: "बैडमिंटन रैकेट", pa: "ਬੈਡਮਿੰਟਨ ਰੈਕਟ" },
  "Cricket gloves": { hi: "क्रिकेट दस्ताने", pa: "ਕ੍ਰਿਕਟ ਦਸਤਾਨੇ" },
  "Skipping ropes": { hi: "कूदने की रस्सियाँ", pa: "ਕੂਦਣ ਵਾਲੀਆਂ ਰੱਸੀਆਂ" },
  "Gym bottles": { hi: "जिम बोतलें", pa: "ਜਿਮ ਬੋਤਲਾਂ" },
  "Volleyballs": { hi: "वॉलीबॉल", pa: "ਵਾਲੀਬਾਲ" },
  "Basketballs": { hi: "बास्केटबॉल", pa: "ਬਾਸਕਟਬਾਲ" },
  "Tennis rackets": { hi: "टेनिस रैकेट", pa: "ਟੈਨਿਸ ਰੈਕਟ" },
  "Table-tennis bats": { hi: "टेबल टेनिस बैट", pa: "ਟੇਬਲ ਟੈਨਿਸ ਬੈਟ" },
  "Cricket bats": { hi: "क्रिकेट बैट", pa: "ਕ੍ਰਿਕਟ ਬੈਟ" },
  "Shin guards": { hi: "शिन गार्ड", pa: "ਸ਼ਿਨ ਗਾਰਡ" },
  "Sports cones": { hi: "स्पोर्ट्स कोन", pa: "ਸਪੋਰਟਸ ਕੋਨ" },
  "Hand grips": { hi: "हैंड ग्रिप", pa: "ਹੈਂਡ ਗ੍ਰਿਪ" },
  "Yoga mats": { hi: "योगा मैट", pa: "ਯੋਗਾ ਮੈਟ" },
  "Resistance bands": { hi: "रेज़िस्टेंस बैंड", pa: "ਰਜ਼ਿਸਟੈਂਸ ਬੈਂਡ" },
  "Dumbbells": { hi: "डम्बल", pa: "ਡੰਬਲ" },
  "Knee caps": { hi: "नी कैप", pa: "ਨੀ ਕੈਪ" },
  "Sports bags": { hi: "स्पोर्ट्स बैग", pa: "ਸਪੋਰਟਸ ਬੈਗ" },
  "Swimming goggles": { hi: "स्विमिंग गॉगल", pa: "ਤੈਰਨ ਵਾਲੇ ਗੋਗਲ" },
  "Wrist bands": { hi: "कलाई बैंड", pa: "ਕਲਾਈ ਬੈਂਡ" },
  "Training bibs": { hi: "ट्रेनिंग बिब", pa: "ਟ੍ਰੇਨਿੰਗ ਬਿਬ" },
  "Shuttlecock tubes": { hi: "शटलकॉक ट्यूब", pa: "ਸ਼ਟਲਕਾਕ ਟਿਊਬ" },
  "Exercise balls": { hi: "व्यायाम बॉल", pa: "ਕਸਰਤ ਬਾਲ" },
  "Boxing gloves": { hi: "बॉक्सिंग दस्ताने", pa: "ਬਾਕਸਿੰਗ ਦਸਤਾਨੇ" },

  "USB cables": { hi: "यूएसबी केबल", pa: "ਯੂਐਸਬੀ ਕੇਬਲ" },
  "Power banks": { hi: "पावर बैंक", pa: "ਪਾਵਰ ਬੈਂਕ" },
  "Keyboards": { hi: "कीबोर्ड", pa: "ਕੀਬੋਰਡ" },
  "Earphones": { hi: "ईयरफ़ोन", pa: "ਈਅਰਫੋਨ" },
  "Webcams": { hi: "वेबकैम", pa: "ਵੈਬਕੈਮ" },
  "Computer mice": { hi: "कंप्यूटर माउस", pa: "ਕੰਪਿਊਟਰ ਮਾਊਸ" },
  "Memory cards": { hi: "मेमोरी कार्ड", pa: "ਮੈਮੋਰੀ ਕਾਰਡ" },
  "USB hubs": { hi: "यूएसबी हब", pa: "ਯੂਐਸਬੀ ਹੱਬ" },
  "Chargers": { hi: "चार्जर", pa: "ਚਾਰਜਰ" },
  "HDMI cables": { hi: "एचडीएमआई केबल", pa: "ਐਚਡੀਐਮਆਈ ਕੇਬਲ" },
  "Bluetooth speakers": { hi: "ब्लूटूथ स्पीकर", pa: "ਬਲੂਟੂਥ ਸਪੀਕਰ" },
  "Wireless mice": { hi: "वायरलेस माउस", pa: "ਵਾਇਰਲੈੱਸ ਮਾਊਸ" },
  "Mouse pads": { hi: "माउस पैड", pa: "ਮਾਊਸ ਪੈਡ" },
  "Card readers": { hi: "कार्ड रीडर", pa: "ਕਾਰਡ ਰੀਡਰ" },
  "Laptop stands": { hi: "लैपटॉप स्टैंड", pa: "ਲੈਪਟਾਪ ਸਟੈਂਡ" },
  "Cooling pads": { hi: "कूलिंग पैड", pa: "ਕੂਲਿੰਗ ਪੈਡ" },
  "Microphones": { hi: "माइक्रोफ़ोन", pa: "ਮਾਈਕ੍ਰੋਫੋਨ" },
  "Wi-Fi adapters": { hi: "वाई-फाई अडैप्टर", pa: "ਵਾਈ-ਫਾਈ ਐਡਾਪਟਰ" },
  "Type-C adapters": { hi: "टाइप-सी अडैप्टर", pa: "ਟਾਈਪ-ਸੀ ਐਡਾਪਟਰ" },
  "Portable drives": { hi: "पोर्टेबल ड्राइव", pa: "ਪੋਰਟੇਬਲ ਡਰਾਈਵ" },
  "Smart plugs": { hi: "स्मार्ट प्लग", pa: "ਸਮਾਰਟ ਪਲੱਗ" },
  "Cable organisers": { hi: "केबल ऑर्गनाइज़र", pa: "ਕੇਬਲ ਆਰਗਨਾਈਜ਼ਰ" },
  "Numeric keypads": { hi: "न्यूमेरिक कीपैड", pa: "ਨਿਊਮੈਰਿਕ ਕੀਪੈਡ" },
  "Headsets": { hi: "हेडसेट", pa: "ਹੈੱਡਸੈੱਟ" },

  "Table lamps": { hi: "टेबल लैंप", pa: "ਟੇਬਲ ਲੈਂਪ" },
  "Electric kettles": { hi: "इलेक्ट्रिक केतली", pa: "ਇਲੈਕਟ੍ਰਿਕ ਕੇਤਲੀ" },
  "Steam irons": { hi: "स्टीम आयरन", pa: "ਸਟੀਮ ਆਇਰਨ" },
  "Storage boxes": { hi: "स्टोरेज बॉक्स", pa: "ਸਟੋਰੇਜ ਬਾਕਸ" },
  "Mixer jars": { hi: "मिक्सर जार", pa: "ਮਿਕਸਰ ਜਾਰ" },
  "Wall clocks": { hi: "दीवार घड़ियाँ", pa: "ਦੀਵਾਰੀ ਘੜੀਆਂ" },
  "Vacuum flasks": { hi: "वैक्यूम फ्लास्क", pa: "ਵੈਕਿਊਮ ਫਲਾਸਕ" },
  "Lunch boxes": { hi: "लंच बॉक्स", pa: "ਲੰਚ ਬਾਕਸ" },
  "Extension boards": { hi: "एक्सटेंशन बोर्ड", pa: "ਐਕਸਟੈਂਸ਼ਨ ਬੋਰਡ" },
  "Table fans": { hi: "टेबल पंखे", pa: "ਟੇਬਲ ਪੱਖੇ" },
  "Water jugs": { hi: "पानी के जग", pa: "ਪਾਣੀ ਦੇ ਜੱਗ" },
  "Serving trays": { hi: "परोसने की ट्रे", pa: "ਪਰੋਸਣ ਵਾਲੀਆਂ ਟਰੇਆਂ" },
  "Kitchen scales": { hi: "रसोई तराज़ू", pa: "ਰਸੋਈ ਤਰਾਜ਼ੂ" },
  "Door mats": { hi: "दरवाज़े की चटाइयाँ", pa: "ਦਰਵਾਜ਼ੇ ਦੀਆਂ ਚਟਾਈਆਂ" },
  "Laundry baskets": { hi: "कपड़ों की टोकरियाँ", pa: "ਕੱਪੜਿਆਂ ਦੀਆਂ ਟੋਕਰੀਆਂ" },
  "Waste bins": { hi: "कूड़ेदान", pa: "ਕੂੜੇਦਾਨ" },
  "Bathroom shelves": { hi: "बाथरूम शेल्फ", pa: "ਬਾਥਰੂਮ ਸ਼ੈਲਫ" },
  "Tea kettles": { hi: "चाय की केतली", pa: "ਚਾਹ ਦੀ ਕੇਤਲੀ" },
  "Food containers": { hi: "खाद्य डिब्बे", pa: "ਖਾਣੇ ਦੇ ਡੱਬੇ" },
  "Cleaning brushes": { hi: "सफ़ाई ब्रश", pa: "ਸਫਾਈ ਬਰਸ਼" },
  "Clothes hangers": { hi: "कपड़ों के हैंगर", pa: "ਕੱਪੜਿਆਂ ਦੇ ਹੈਂਗਰ" },
  "Spice racks": { hi: "मसाला रैक", pa: "ਮਸਾਲਾ ਰੈਕ" },
  "Bottle sets": { hi: "बोतल सेट", pa: "ਬੋਤਲ ਸੈੱਟ" },
  "Hand blenders": { hi: "हैंड ब्लेंडर", pa: "ਹੈਂਡ ਬਲੈਂਡਰ" },

  "Paper reams": { hi: "कागज़ की रीम", pa: "ਕਾਗਜ਼ ਦੀਆਂ ਰੀਮਾਂ" },
  "Desk organisers": { hi: "डेस्क ऑर्गनाइज़र", pa: "ਡੈਸਕ ਆਰਗਨਾਈਜ਼ਰ" },
  "Ink cartridges": { hi: "इंक कार्ट्रिज", pa: "ਇੰਕ ਕਾਰਟ੍ਰਿਜ" },
  "Label rolls": { hi: "लेबल रोल", pa: "ਲੇਬਲ ਰੋਲ" },
  "Document trays": { hi: "दस्तावेज़ ट्रे", pa: "ਦਸਤਾਵੇਜ਼ ਟਰੇਆਂ" },
  "File covers": { hi: "फ़ाइल कवर", pa: "ਫਾਈਲ ਕਵਰ" },
  "Memo pads": { hi: "मेमो पैड", pa: "ਮੀਮੋ ਪੈਡ" },
  "Calculator units": { hi: "कैलकुलेटर", pa: "ਕੈਲਕੂਲੇਟਰ" },
  "Desk calendars": { hi: "डेस्क कैलेंडर", pa: "ਡੈਸਕ ਕੈਲੰਡਰ" },
  "Stamp pads": { hi: "स्टैम्प पैड", pa: "ਸਟੈਂਪ ਪੈਡ" },
  "Printer paper boxes": { hi: "प्रिंटर पेपर बॉक्स", pa: "ਪ੍ਰਿੰਟਰ ਪੇਪਰ ਬਾਕਸ" },
  "Name-badge packs": { hi: "नाम-बैज पैक", pa: "ਨਾਂ-ਬੈਜ ਪੈਕ" },
  "Laminating pouches": { hi: "लैमिनेशन पाउच", pa: "ਲੈਮੀਨੇਸ਼ਨ ਪਾਊਚ" },
  "Binding combs": { hi: "बाइंडिंग कॉम्ब", pa: "ਬਾਈਂਡਿੰਗ ਕਾਂਬ" },
  "Receipt rolls": { hi: "रसीद रोल", pa: "ਰਸੀਦ ਰੋਲ" },
  "Packing tape rolls": { hi: "पैकिंग टेप रोल", pa: "ਪੈਕਿੰਗ ਟੇਪ ਰੋਲ" },
  "Whiteboard erasers": { hi: "व्हाइटबोर्ड डस्टर", pa: "ਵਾਈਟਬੋਰਡ ਡਸਟਰ" },
  "Pen stands": { hi: "पेन स्टैंड", pa: "ਪੈਨ ਸਟੈਂਡ" },
  "Clip boxes": { hi: "क्लिप बॉक्स", pa: "ਕਲਿੱਪ ਬਾਕਸ" },
  "Document envelopes": { hi: "दस्तावेज़ लिफ़ाफ़े", pa: "ਦਸਤਾਵੇਜ਼ ਲਿਫ਼ਾਫ਼ੇ" },
  "Spiral binding coils": { hi: "स्पाइरल बाइंडिंग कॉइल", pa: "ਸਪਾਇਰਲ ਬਾਈਂਡਿੰਗ ਕੌਇਲ" },
  "Archive boxes": { hi: "अभिलेख बॉक्स", pa: "ਅਭਿਲੇਖ ਬਾਕਸ" },
  "Correction tape packs": { hi: "करेक्शन टेप पैक", pa: "ਕਰੈਕਸ਼ਨ ਟੇਪ ਪੈਕ" },
  "Carbon paper packs": { hi: "कार्बन पेपर पैक", pa: "ਕਾਰਬਨ ਪੇਪਰ ਪੈਕ" },
});

const CONTEXT_TITLES: Readonly<Record<Di008V2Stimulus["contextId"], LocalizedPair>> = Object.freeze({
  STATIONERY_WHOLESALE: { hi: "पाँच स्टेशनरी वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਸਟੇਸ਼ਨਰੀ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
  PACKAGED_FOODS: { hi: "पाँच पैक खाद्य वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਪੈਕ ਕੀਤੀਆਂ ਖਾਦ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
  SPORTS_GOODS: { hi: "पाँच खेल वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਖੇਡ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
  ELECTRONIC_ACCESSORIES: { hi: "पाँच इलेक्ट्रॉनिक सहायक वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਇਲੈਕਟ੍ਰਾਨਿਕ ਸਹਾਇਕ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
  HOUSEHOLD_ITEMS: { hi: "पाँच घरेलू वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਘਰੇਲੂ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
  OFFICE_SUPPLIES: { hi: "पाँच कार्यालय वस्तुओं की बिक्री, लागत और विक्रय मूल्य", pa: "ਪੰਜ ਦਫ਼ਤਰੀ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ, ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ" },
});

function isHindi(locale: Di008LocalizationLocale) {
  return locale === "hi-IN";
}

function localizedLabel(label: string, locale: Di008LocalizationLocale) {
  const pair = DI008_LOCALIZATION_LABELS[label];
  if (!pair) throw new Error(`DI-008 localization is missing learner label '${label}'.`);
  return isHindi(locale) ? pair.hi : pair.pa;
}

function localizedNames(rows: readonly Di008V2Row[], indices: readonly number[], locale: Di008LocalizationLocale): string {
  const labels = indices.map((index) => localizedLabel(rows[index]!.label, locale));
  if (labels.length <= 1) return labels[0] ?? "";
  const joiner = isHindi(locale) ? " और " : " ਅਤੇ ";
  if (labels.length === 2) return labels[0] + joiner + labels[1];
  return labels.slice(0, -1).join(", ") + joiner + labels[labels.length - 1];
}

function rowCost(row: Di008V2Row) {
  return row.unitsCurrent * row.costPerUnit;
}

function rowRevenue(row: Di008V2Row) {
  return row.unitsCurrent * row.sellingPricePerUnit;
}

function rowProfit(row: Di008V2Row) {
  return rowRevenue(row) - rowCost(row);
}

function sumUnits(rows: readonly Di008V2Row[], indices: readonly number[], key: "unitsPrevious" | "unitsCurrent") {
  return indices.reduce((sum, index) => sum + rows[index]![key], 0);
}

function costTotal(rows: readonly Di008V2Row[], indices: readonly number[]) {
  return indices.reduce((sum, index) => sum + rowCost(rows[index]!), 0);
}

function revenueTotal(rows: readonly Di008V2Row[], indices: readonly number[]) {
  return indices.reduce((sum, index) => sum + rowRevenue(rows[index]!), 0);
}

function profitTotal(rows: readonly Di008V2Row[], indices: readonly number[]) {
  return indices.reduce((sum, index) => sum + rowProfit(rows[index]!), 0);
}

function money(value: number) {
  return "₹" + String(value);
}

function stemFor(question: Di008V2Question, stimulus: Di008V2Stimulus, locale: Di008LocalizationLocale) {
  const p = question.evidence.primaryIndices;
  const s = question.evidence.secondaryIndices ?? [];
  const a = localizedNames(stimulus.rows, p, locale);
  const b = localizedNames(stimulus.rows, s, locale);
  const v = question.stemVariant;

  if (isHindi(locale)) {
    switch (question.kind) {
      case "UNIT_INCREASE":
        return [
          `पिछली अवधि की तुलना में वर्तमान अवधि में ${a} की कितनी अधिक इकाइयाँ बेची गईं?`,
          `${a} की बेची गई इकाइयों में पिछली अवधि से वर्तमान अवधि तक कितनी वृद्धि हुई?`,
          `${a} की वर्तमान अवधि की बिक्री पिछली अवधि से कितनी इकाइयाँ अधिक है?`,
        ][v]!;
      case "REVENUE_AMOUNT":
        return [
          `वर्तमान अवधि में ${a} से प्राप्त कुल बिक्री राशि कितनी है?`,
          `वर्तमान अवधि में ${a} की बिक्री से कितनी राशि प्राप्त हुई?`,
          `${a} की वर्तमान अवधि की बिक्री का कुल मूल्य कितना है?`,
        ][v]!;
      case "PERCENT_CHANGE":
        return [
          `पिछली अवधि की तुलना में वर्तमान अवधि में ${a} की बेची गई इकाइयों में कितने प्रतिशत वृद्धि हुई?`,
          `${a} की बिक्री इकाइयों में दोनों अवधियों के बीच प्रतिशत वृद्धि ज्ञात कीजिए।`,
          `${a} की बेची गई इकाइयाँ पिछली अवधि से कितने प्रतिशत बढ़ीं?`,
        ][v]!;
      case "PROFIT_AMOUNT":
        return [
          `वर्तमान अवधि में ${a} की बिक्री से कुल लाभ कितना हुआ?`,
          `${a} की वर्तमान अवधि की बिक्री पर प्राप्त लाभ ज्ञात कीजिए।`,
          `वर्तमान अवधि में ${a} से प्राप्त कुल लाभ कितना है?`,
        ][v]!;
      case "PROFIT_PERCENT":
        return [
          `वर्तमान अवधि में ${a} पर कुल लागत के आधार पर लाभ प्रतिशत कितना है?`,
          `${a} का लाभ, वर्तमान अवधि की कुल लागत का कितने प्रतिशत है?`,
          `${a} के लिए वर्तमान अवधि का लाभ प्रतिशत ज्ञात कीजिए।`,
        ][v]!;
      case "REVENUE_SHARE":
        return [
          `${a} से प्राप्त वर्तमान अवधि की बिक्री राशि, सभी पाँच वस्तुओं की कुल बिक्री राशि का कितने प्रतिशत है?`,
          `सभी पाँच वस्तुओं की वर्तमान अवधि की कुल बिक्री राशि में ${a} का हिस्सा कितने प्रतिशत है?`,
          `कुल वर्तमान अवधि की बिक्री राशि में ${a} की प्रतिशत हिस्सेदारी ज्ञात कीजिए।`,
        ][v]!;
      case "PROFIT_RATIO":
        return [
          `वर्तमान अवधि में ${a} और ${b} से प्राप्त लाभ का अनुपात क्रमशः कितना है?`,
          `${a} और ${b} के वर्तमान अवधि के लाभों का अनुपात उसी क्रम में ज्ञात कीजिए।`,
          `${a} से प्राप्त लाभ और ${b} से प्राप्त लाभ का अनुपात कितना है?`,
        ][v]!;
      case "AVERAGE_PROFIT":
        return [
          `${a} से वर्तमान अवधि में प्राप्त औसत लाभ कितना है?`,
          `वर्तमान अवधि में ${a} का औसत लाभ ज्ञात कीजिए।`,
          `${a} के वर्तमान अवधि के लाभ का औसत कितना है?`,
        ][v]!;
      case "COMBINED_PERCENT_CHANGE":
        return [
          `${a} की संयुक्त बिक्री इकाइयों में पिछली अवधि से वर्तमान अवधि तक कितने प्रतिशत वृद्धि हुई?`,
          `${a} की बिक्री को मिलाकर दोनों अवधियों के बीच प्रतिशत वृद्धि ज्ञात कीजिए।`,
          `${a} की कुल बेची गई इकाइयाँ पिछली अवधि से कितने प्रतिशत बढ़ीं?`,
        ][v]!;
      case "COMBINED_PROFIT_PERCENT":
        return [
          `${a} को मिलाकर वर्तमान अवधि की कुल लागत पर लाभ प्रतिशत कितना है?`,
          `${a} की वर्तमान अवधि की कुल लागत और लाभ को मिलाकर लाभ प्रतिशत ज्ञात कीजिए।`,
          `${a} को एक साथ लेने पर वर्तमान अवधि का कुल लाभ प्रतिशत कितना है?`,
        ][v]!;
      case "GROUP_REVENUE_RATIO":
        return [
          `वर्तमान अवधि में ${a} और ${b} की बिक्री राशि का अनुपात क्रमशः कितना है?`,
          `${a} और ${b} की वर्तमान अवधि की कुल बिक्री राशि का अनुपात उसी क्रम में ज्ञात कीजिए।`,
          `${a} से प्राप्त बिक्री राशि और ${b} से प्राप्त बिक्री राशि का अनुपात कितना है?`,
        ][v]!;
      case "WEIGHTED_AVERAGE_SELLING_PRICE":
        return [
          `वर्तमान अवधि में बेची गई इकाइयों को भार मानकर ${a} का प्रति इकाई भारित औसत विक्रय मूल्य कितना है?`,
          `${a} के लिए वर्तमान अवधि की इकाइयों के आधार पर प्रति इकाई औसत विक्रय मूल्य ज्ञात कीजिए।`,
          `${a} की कुल बिक्री राशि को कुल बेची गई इकाइयों से भाग देने पर प्रति इकाई औसत विक्रय मूल्य कितना होगा?`,
        ][v]!;
    }
  }

  switch (question.kind) {
    case "UNIT_INCREASE":
      return [
        `ਪਿਛਲੀ ਅਵਧੀ ਦੇ ਮੁਕਾਬਲੇ ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਦੀਆਂ ਕਿੰਨੀਆਂ ਵੱਧ ਇਕਾਈਆਂ ਵਿਕੀਆਂ?`,
        `${a} ਦੀਆਂ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਵਿੱਚ ਪਿਛਲੀ ਅਵਧੀ ਤੋਂ ਮੌਜੂਦਾ ਅਵਧੀ ਤੱਕ ਕਿੰਨਾ ਵਾਧਾ ਹੋਇਆ?`,
        `${a} ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਪਿਛਲੀ ਅਵਧੀ ਨਾਲੋਂ ਕਿੰਨੀਆਂ ਇਕਾਈਆਂ ਵੱਧ ਹੈ?`,
      ][v]!;
    case "REVENUE_AMOUNT":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਤੋਂ ਪ੍ਰਾਪਤ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਕਿੰਨੀ ਹੈ?`,
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਦੀ ਵਿਕਰੀ ਤੋਂ ਕਿੰਨੀ ਰਕਮ ਪ੍ਰਾਪਤ ਹੋਈ?`,
        `${a} ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਦਾ ਕੁੱਲ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "PERCENT_CHANGE":
      return [
        `ਪਿਛਲੀ ਅਵਧੀ ਦੇ ਮੁਕਾਬਲੇ ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਦੀਆਂ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਇਆ?`,
        `${a} ਦੀਆਂ ਵਿਕਰੀ ਇਕਾਈਆਂ ਵਿੱਚ ਦੋ ਅਵਧੀਆਂ ਦੇ ਵਿਚਕਾਰ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਕੱਢੋ।`,
        `${a} ਦੀਆਂ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਪਿਛਲੀ ਅਵਧੀ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧੀਆਂ?`,
      ][v]!;
    case "PROFIT_AMOUNT":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਦੀ ਵਿਕਰੀ ਤੋਂ ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੋਇਆ?`,
        `${a} ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਉੱਤੇ ਪ੍ਰਾਪਤ ਲਾਭ ਕੱਢੋ।`,
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਤੋਂ ਪ੍ਰਾਪਤ ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "PROFIT_PERCENT":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਲਈ ਕੁੱਲ ਲਾਗਤ ਦੇ ਆਧਾਰ ਉੱਤੇ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਦਾ ਲਾਭ, ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਲਾਗਤ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `${a} ਲਈ ਮੌਜੂਦਾ ਅਵਧੀ ਦਾ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ।`,
      ][v]!;
    case "REVENUE_SHARE":
      return [
        `${a} ਤੋਂ ਪ੍ਰਾਪਤ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਰਕਮ, ਸਾਰੀਆਂ ਪੰਜ ਵਸਤੂਆਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `ਸਾਰੀਆਂ ਪੰਜ ਵਸਤੂਆਂ ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਵਿੱਚ ${a} ਦਾ ਹਿੱਸਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਵਿੱਚ ${a} ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸੇਦਾਰੀ ਕੱਢੋ।`,
      ][v]!;
    case "PROFIT_RATIO":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਅਤੇ ${b} ਤੋਂ ਪ੍ਰਾਪਤ ਲਾਭ ਦਾ ਅਨੁਪਾਤ ਕ੍ਰਮਵਾਰ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਅਤੇ ${b} ਦੇ ਮੌਜੂਦਾ ਅਵਧੀ ਦੇ ਲਾਭਾਂ ਦਾ ਅਨੁਪਾਤ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਕੱਢੋ।`,
        `${a} ਤੋਂ ਪ੍ਰਾਪਤ ਲਾਭ ਅਤੇ ${b} ਤੋਂ ਪ੍ਰਾਪਤ ਲਾਭ ਦਾ ਅਨੁਪਾਤ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "AVERAGE_PROFIT":
      return [
        `${a} ਤੋਂ ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ਪ੍ਰਾਪਤ ਔਸਤ ਲਾਭ ਕਿੰਨਾ ਹੈ?`,
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਦਾ ਔਸਤ ਲਾਭ ਕੱਢੋ।`,
        `${a} ਦੇ ਮੌਜੂਦਾ ਅਵਧੀ ਦੇ ਲਾਭ ਦਾ ਔਸਤ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "COMBINED_PERCENT_CHANGE":
      return [
        `${a} ਦੀਆਂ ਮਿਲੀ-ਜੁਲੀ ਵਿਕਰੀ ਇਕਾਈਆਂ ਵਿੱਚ ਪਿਛਲੀ ਅਵਧੀ ਤੋਂ ਮੌਜੂਦਾ ਅਵਧੀ ਤੱਕ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਇਆ?`,
        `${a} ਦੀ ਵਿਕਰੀ ਨੂੰ ਜੋੜ ਕੇ ਦੋ ਅਵਧੀਆਂ ਦੇ ਵਿਚਕਾਰ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਕੱਢੋ।`,
        `${a} ਦੀਆਂ ਕੁੱਲ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਪਿਛਲੀ ਅਵਧੀ ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਧੀਆਂ?`,
      ][v]!;
    case "COMBINED_PROFIT_PERCENT":
      return [
        `${a} ਨੂੰ ਮਿਲਾ ਕੇ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਲਾਗਤ ਉੱਤੇ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਲਾਗਤ ਅਤੇ ਲਾਭ ਨੂੰ ਜੋੜ ਕੇ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ।`,
        `${a} ਨੂੰ ਇਕੱਠੇ ਲੈਣ ਉੱਤੇ ਮੌਜੂਦਾ ਅਵਧੀ ਦਾ ਕੁੱਲ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "GROUP_REVENUE_RATIO":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀ ਵਿਕਰੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ਕ੍ਰਮਵਾਰ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਅਤੇ ${b} ਦੀ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਕੱਢੋ।`,
        `${a} ਤੋਂ ਪ੍ਰਾਪਤ ਵਿਕਰੀ ਰਕਮ ਅਤੇ ${b} ਤੋਂ ਪ੍ਰਾਪਤ ਵਿਕਰੀ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ਕਿੰਨਾ ਹੈ?`,
      ][v]!;
    case "WEIGHTED_AVERAGE_SELLING_PRICE":
      return [
        `ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਨੂੰ ਭਾਰ ਮੰਨ ਕੇ ${a} ਦਾ ਪ੍ਰਤੀ ਇਕਾਈ ਭਾਰਿਤ ਔਸਤ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਲਈ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀਆਂ ਇਕਾਈਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਔਸਤ ਵਿਕਰੀ ਮੁੱਲ ਕੱਢੋ।`,
        `${a} ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਨੂੰ ਕੁੱਲ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਪ੍ਰਤੀ ਇਕਾਈ ਔਸਤ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      ][v]!;
  }
}

function explanationFor(question: Di008V2Question, stimulus: Di008V2Stimulus, locale: Di008LocalizationLocale) {
  const rows = stimulus.rows;
  const p = question.evidence.primaryIndices;
  const s = question.evidence.secondaryIndices ?? [];
  const a = localizedNames(rows, p, locale);
  const b = localizedNames(rows, s, locale);
  const hi = isHindi(locale);

  const pack = (keyIdeaHi: string, keyIdeaPa: string, stepsHi: string[], stepsPa: string[]) => ({
    keyIdea: hi ? keyIdeaHi : keyIdeaPa,
    steps: hi ? stepsHi : stepsPa,
  });

  switch (question.kind) {
    case "UNIT_INCREASE": {
      const row = rows[p[0]!]!;
      const increase = row.unitsCurrent - row.unitsPrevious;
      return pack(
        "इकाइयों में वृद्धि जानने के लिए वर्तमान अवधि की बिक्री में से पिछली अवधि की बिक्री घटाएँ।",
        "ਇਕਾਈਆਂ ਵਿੱਚ ਵਾਧਾ ਜਾਣਨ ਲਈ ਮੌਜੂਦਾ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਵਿੱਚੋਂ ਪਿਛਲੀ ਅਵਧੀ ਦੀ ਵਿਕਰੀ ਘਟਾਓ।",
        [`${a}: पिछली अवधि = ${row.unitsPrevious} इकाइयाँ, वर्तमान अवधि = ${row.unitsCurrent} इकाइयाँ।`, `वृद्धि = ${row.unitsCurrent} - ${row.unitsPrevious} = ${increase} इकाइयाँ।`],
        [`${a}: ਪਿਛਲੀ ਅਵਧੀ = ${row.unitsPrevious} ਇਕਾਈਆਂ, ਮੌਜੂਦਾ ਅਵਧੀ = ${row.unitsCurrent} ਇਕਾਈਆਂ।`, `ਵਾਧਾ = ${row.unitsCurrent} - ${row.unitsPrevious} = ${increase} ਇਕਾਈਆਂ।`],
      );
    }
    case "REVENUE_AMOUNT": {
      const row = rows[p[0]!]!;
      const revenue = rowRevenue(row);
      return pack(
        "कुल बिक्री राशि = वर्तमान अवधि में बेची गई इकाइयाँ × प्रति इकाई विक्रय मूल्य।",
        "ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ ਵਿਕੀਆਂ ਇਕਾਈਆਂ × ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ।",
        [`${a}: वर्तमान अवधि की इकाइयाँ = ${row.unitsCurrent}, प्रति इकाई विक्रय मूल्य = ₹${row.sellingPricePerUnit}।`, `कुल बिक्री राशि = ${row.unitsCurrent} × ₹${row.sellingPricePerUnit} = ${money(revenue)}।`],
        [`${a}: ਮੌਜੂਦਾ ਅਵਧੀ ਦੀਆਂ ਇਕਾਈਆਂ = ${row.unitsCurrent}, ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ = ₹${row.sellingPricePerUnit}।`, `ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ${row.unitsCurrent} × ₹${row.sellingPricePerUnit} = ${money(revenue)}।`],
      );
    }
    case "PERCENT_CHANGE":
    case "COMBINED_PERCENT_CHANGE": {
      const previous = sumUnits(rows, p, "unitsPrevious");
      const current = sumUnits(rows, p, "unitsCurrent");
      const increase = current - previous;
      return pack(
        "प्रतिशत वृद्धि के लिए पहले वृद्धि निकालें और उसे पिछली अवधि की कुल इकाइयों के आधार पर प्रतिशत में बदलें।",
        "ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਲਈ ਪਹਿਲਾਂ ਵਾਧਾ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਪਿਛਲੀ ਅਵਧੀ ਦੀਆਂ ਕੁੱਲ ਇਕਾਈਆਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।",
        [`पिछली अवधि में ${a} की कुल इकाइयाँ = ${previous}; वर्तमान अवधि में = ${current}।`, `वृद्धि = ${current} - ${previous} = ${increase} इकाइयाँ।`, `प्रतिशत वृद्धि = ${increase}/${previous} × 100 = ${question.answer}।`],
        [`ਪਿਛਲੀ ਅਵਧੀ ਵਿੱਚ ${a} ਦੀਆਂ ਕੁੱਲ ਇਕਾਈਆਂ = ${previous}; ਮੌਜੂਦਾ ਅਵਧੀ ਵਿੱਚ = ${current}।`, `ਵਾਧਾ = ${current} - ${previous} = ${increase} ਇਕਾਈਆਂ।`, `ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ = ${increase}/${previous} × 100 = ${question.answer}।`],
      );
    }
    case "PROFIT_AMOUNT": {
      const cost = costTotal(rows, p);
      const revenue = revenueTotal(rows, p);
      const profit = revenue - cost;
      return pack(
        "लाभ = कुल बिक्री राशि - कुल लागत। एक से अधिक वस्तुएँ हों तो पहले उनकी लागत और बिक्री राशि जोड़ें।",
        "ਲਾਭ = ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ - ਕੁੱਲ ਲਾਗਤ। ਇੱਕ ਤੋਂ ਵੱਧ ਵਸਤੂਆਂ ਹੋਣ ਤਾਂ ਪਹਿਲਾਂ ਉਨ੍ਹਾਂ ਦੀ ਲਾਗਤ ਅਤੇ ਵਿਕਰੀ ਰਕਮ ਜੋੜੋ।",
        [`${a} की कुल लागत = ${money(cost)}।`, `कुल बिक्री राशि = ${money(revenue)}।`, `लाभ = ${money(revenue)} - ${money(cost)} = ${money(profit)}।`],
        [`${a} ਦੀ ਕੁੱਲ ਲਾਗਤ = ${money(cost)}।`, `ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ${money(revenue)}।`, `ਲਾਭ = ${money(revenue)} - ${money(cost)} = ${money(profit)}।`],
      );
    }
    case "PROFIT_PERCENT":
    case "COMBINED_PROFIT_PERCENT": {
      const cost = costTotal(rows, p);
      const revenue = revenueTotal(rows, p);
      const profit = revenue - cost;
      return pack(
        "लाभ प्रतिशत निकालने के लिए कुल लाभ को कुल लागत से भाग देकर 100 से गुणा करें।",
        "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢਣ ਲਈ ਕੁੱਲ ਲਾਭ ਨੂੰ ਕੁੱਲ ਲਾਗਤ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।",
        [`${a} की कुल लागत = ${money(cost)}; कुल बिक्री राशि = ${money(revenue)}।`, `लाभ = ${money(revenue)} - ${money(cost)} = ${money(profit)}।`, `लाभ प्रतिशत = ${money(profit)}/${money(cost)} × 100 = ${question.answer}।`],
        [`${a} ਦੀ ਕੁੱਲ ਲਾਗਤ = ${money(cost)}; ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ${money(revenue)}।`, `ਲਾਭ = ${money(revenue)} - ${money(cost)} = ${money(profit)}।`, `ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ = ${money(profit)}/${money(cost)} × 100 = ${question.answer}।`],
      );
    }
    case "REVENUE_SHARE": {
      const selectedRevenue = revenueTotal(rows, p);
      const totalRevenue = revenueTotal(rows, [0, 1, 2, 3, 4]);
      return pack(
        "प्रतिशत हिस्सेदारी = चुनी गई वस्तुओं की बिक्री राशि ÷ सभी पाँच वस्तुओं की कुल बिक्री राशि × 100।",
        "ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸੇਦਾਰੀ = ਚੁਣੀਆਂ ਵਸਤੂਆਂ ਦੀ ਵਿਕਰੀ ਰਕਮ ÷ ਸਾਰੀਆਂ ਪੰਜ ਵਸਤੂਆਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ × 100।",
        [`${a} की बिक्री राशि = ${money(selectedRevenue)}।`, `सभी पाँच वस्तुओं की कुल बिक्री राशि = ${money(totalRevenue)}।`, `हिस्सेदारी = ${money(selectedRevenue)}/${money(totalRevenue)} × 100 = ${question.answer}।`],
        [`${a} ਦੀ ਵਿਕਰੀ ਰਕਮ = ${money(selectedRevenue)}।`, `ਸਾਰੀਆਂ ਪੰਜ ਵਸਤੂਆਂ ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ${money(totalRevenue)}।`, `ਹਿੱਸੇਦਾਰੀ = ${money(selectedRevenue)}/${money(totalRevenue)} × 100 = ${question.answer}।`],
      );
    }
    case "PROFIT_RATIO": {
      const left = profitTotal(rows, p);
      const right = profitTotal(rows, s);
      return pack(
        "दोनों पक्षों का लाभ अलग-अलग निकालें और पूछे गए क्रम में अनुपात सरल करें।",
        "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦਾ ਲਾਭ ਵੱਖ-ਵੱਖ ਕੱਢੋ ਅਤੇ ਪੁੱਛੇ ਗਏ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।",
        [`${a} का लाभ = ${money(left)}।`, `${b} का लाभ = ${money(right)}।`, `आवश्यक अनुपात = ${left}:${right} = ${question.answer}।`],
        [`${a} ਦਾ ਲਾਭ = ${money(left)}।`, `${b} ਦਾ ਲਾਭ = ${money(right)}।`, `ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ = ${left}:${right} = ${question.answer}।`],
      );
    }
    case "AVERAGE_PROFIT": {
      const total = profitTotal(rows, p);
      return pack(
        "औसत लाभ के लिए चुनी गई वस्तुओं का कुल लाभ जोड़कर वस्तुओं की संख्या से भाग दें।",
        "ਔਸਤ ਲਾਭ ਲਈ ਚੁਣੀਆਂ ਵਸਤੂਆਂ ਦਾ ਕੁੱਲ ਲਾਭ ਜੋੜ ਕੇ ਵਸਤੂਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`${a} का कुल लाभ = ${money(total)}।`, `वस्तुओं की संख्या = ${p.length}।`, `औसत लाभ = ${money(total)} ÷ ${p.length} = ${question.answer}।`],
        [`${a} ਦਾ ਕੁੱਲ ਲਾਭ = ${money(total)}।`, `ਵਸਤੂਆਂ ਦੀ ਗਿਣਤੀ = ${p.length}।`, `ਔਸਤ ਲਾਭ = ${money(total)} ÷ ${p.length} = ${question.answer}।`],
      );
    }
    case "GROUP_REVENUE_RATIO": {
      const left = revenueTotal(rows, p);
      const right = revenueTotal(rows, s);
      return pack(
        "दोनों समूहों की बिक्री राशि अलग-अलग जोड़ें और उसके बाद उसी क्रम में अनुपात बनाएँ।",
        "ਦੋਵੇਂ ਸਮੂਹਾਂ ਦੀ ਵਿਕਰੀ ਰਕਮ ਵੱਖ-ਵੱਖ ਜੋੜੋ ਅਤੇ ਫਿਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਅਨੁਪਾਤ ਬਣਾਓ।",
        [`${a} की बिक्री राशि = ${money(left)}।`, `${b} की बिक्री राशि = ${money(right)}।`, `आवश्यक अनुपात = ${left}:${right} = ${question.answer}।`],
        [`${a} ਦੀ ਵਿਕਰੀ ਰਕਮ = ${money(left)}।`, `${b} ਦੀ ਵਿਕਰੀ ਰਕਮ = ${money(right)}।`, `ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ = ${left}:${right} = ${question.answer}।`],
      );
    }
    case "WEIGHTED_AVERAGE_SELLING_PRICE": {
      const revenue = revenueTotal(rows, p);
      const units = sumUnits(rows, p, "unitsCurrent");
      return pack(
        "भारित औसत विक्रय मूल्य के लिए कुल बिक्री राशि को कुल बेची गई इकाइयों से भाग दें।",
        "ਭਾਰਿਤ ਔਸਤ ਵਿਕਰੀ ਮੁੱਲ ਲਈ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ ਨੂੰ ਕੁੱਲ ਵਿਕੀਆਂ ਇਕਾਈਆਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
        [`${a} की कुल बिक्री राशि = ${money(revenue)}।`, `कुल बेची गई इकाइयाँ = ${units}।`, `भारित औसत विक्रय मूल्य = ${money(revenue)} ÷ ${units} = ${question.answer} प्रति इकाई।`],
        [`${a} ਦੀ ਕੁੱਲ ਵਿਕਰੀ ਰਕਮ = ${money(revenue)}।`, `ਕੁੱਲ ਵਿਕੀਆਂ ਇਕਾਈਆਂ = ${units}।`, `ਭਾਰਿਤ ਔਸਤ ਵਿਕਰੀ ਮੁੱਲ = ${money(revenue)} ÷ ${units} = ${question.answer} ਪ੍ਰਤੀ ਇਕਾਈ।`],
      );
    }
  }
}

export function localizeDi008Stimulus(stimulus: Di008V2Stimulus, locale: Di008LocalizationLocale) {
  const hi = isHindi(locale);
  const titlePair = CONTEXT_TITLES[stimulus.contextId];
  return {
    ...stimulus,
    title: hi ? titlePair.hi : titlePair.pa,
    instruction: hi
      ? "तालिका का अध्ययन कीजिए और नीचे दिए गए पाँच प्रश्नों के उत्तर दीजिए। लागत मूल्य और विक्रय मूल्य प्रति इकाई दिए गए हैं।"
      : "ਸਾਰਣੀ ਦਾ ਅਧਿਐਨ ਕਰੋ ਅਤੇ ਹੇਠਾਂ ਦਿੱਤੇ ਪੰਜ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ। ਲਾਗਤ ਮੁੱਲ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ਪ੍ਰਤੀ ਇਕਾਈ ਦਿੱਤੇ ਗਏ ਹਨ।",
    rowLabel: hi ? "वस्तु" : "ਵਸਤੂ",
    columnLabels: {
      unitsPrevious: hi ? "पिछली अवधि की इकाइयाँ" : "ਪਿਛਲੀ ਅਵਧੀ ਦੀਆਂ ਇਕਾਈਆਂ",
      unitsCurrent: hi ? "वर्तमान अवधि की इकाइयाँ" : "ਮੌਜੂਦਾ ਅਵਧੀ ਦੀਆਂ ਇਕਾਈਆਂ",
      costPerUnit: hi ? "प्रति इकाई लागत मूल्य" : "ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ਮੁੱਲ",
      sellingPricePerUnit: hi ? "प्रति इकाई विक्रय मूल्य" : "ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ",
    },
    rows: stimulus.rows.map((row) => ({ ...row, label: localizedLabel(row.label, locale) })),
  };
}

export function localizeDi008Question(
  source: ReturnType<typeof generateDi008PermanentQuestion>,
  locale: Di008LocalizationLocale,
) {
  const stimulus = localizeDi008Stimulus(source.stimulus, locale);
  const question = source.question;
  return {
    packageId: "DI-008" as const,
    requestedSeed: source.requestedSeed,
    sourceSeed: source.sourceSeed,
    examProfile: source.examProfile,
    language: locale === "hi-IN" ? "hi" as const : "pa" as const,
    locale,
    localizationReviewId: DI008_LOCALIZATION_REVIEW_ID,
    localizationStatus: "HI_PA_FROZEN" as const,
    sourceEnglishStatus: "ENGLISH_REVIEW_APPROVED" as const,
    stimulus,
    question: {
      ...question,
      stem: stemFor(question, source.stimulus, locale),
      explanation: explanationFor(question, source.stimulus, locale),
    },
    validation: source.validation,
    traceability: {
      ...source.traceability,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "HI_PA_FROZEN" as const,
      questionStudioDiscoverable: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
}

export function generateDi008LocalizedReviewQuestion(input: {
  seed: string;
  examProfile: Di008V2ExamProfile;
  taskKind: Di008V2TaskKind;
  locale: Di008LocalizationLocale;
}) {
  return localizeDi008Question(
    generateDi008PermanentQuestion({
      seed: input.seed,
      examProfile: input.examProfile,
      taskKind: input.taskKind,
    }),
    input.locale,
  );
}
