import { createHash } from "node:crypto";

import { polishArgCp015LocalizedTwoArgumentSurface } from "./cp015-localized-two-argument-surface-polish.ts";

export const ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY = "ARG_CP015_LOCALIZED_COMBO_SURFACE_POLISH_V1" as const;
export const ARG_CP015_ENGLISH_COMBO_POLISH_AUTHORITY = "ARG_CP015_ENGLISH_COMBO_SURFACE_POLISH_V1" as const;

type Question = Readonly<Record<string, any>>;

const ROMAN = ["I", "II", "III", "IV"] as const;

function polishEnglish(value: string): string {
  return value
    .replace(/^(Yes|No)\.\s+([a-z])/g, (_match, prefix: string, letter: string) => `${prefix}. ${letter.toUpperCase()}`)
    .replaceAll("a member of office employees", "an office employee")
    .replaceAll("a member of remote employees", "a remote employee")
    .replaceAll("a member of contract workers", "a contract worker")
    .replaceAll("a member of field staff", "a field staff member")
    .replaceAll("Members of office employees", "Office employees")
    .replaceAll("Members of remote employees", "Remote employees")
    .replaceAll("Members of contract workers", "Contract workers")
    .replaceAll("Members of field staff", "Field staff")
    .replaceAll("Employees among office employees", "Office employees")
    .replaceAll("Employees among remote employees", "Remote employees")
    .replaceAll("Employees among contract workers", "Contract workers")
    .replaceAll("Employees among field staff", "Field staff")
    .replace(/\bA mistaken one ([a-z-]+(?:\s+[a-z-]+)*)/gi, "A mistaken $1")
    .replace(/\ban erroneous one ([a-z-]+(?:\s+[a-z-]+)*)/gi, "an erroneous $1")
    .replace(/\b(registration services|routine document services|standard certificate services|fee-payment services) becomes permanently unworkable\b/gi, "$1 become permanently unworkable")
    .replace(/Publishing (model answer points|evaluation criteria) without keeping it current could misdirect users, so ([^.]+) must be able to update it promptly\./gi, "Publishing $1 without keeping them current could misdirect users, so $2 must be able to update them promptly.")
    .replace(/\b(model answer points|evaluation criteria) should display only if it can keep the information updated\b/gi, "$1 should be displayed only if the information can be kept updated");
}

function polishHindi(value: string): string {
  return value
    .replaceAll("शाम के व्यस्त समय के समय", "शाम के व्यस्त समय में")
    .replaceAll("स्कूल छुट्टी के समय के दौरान", "स्कूल छुट्टी के दौरान")
    .replaceAll("भुगतान खाता में", "भुगतान खाते में")
    .replaceAll("भुगतान खाता के", "भुगतान खाते के")
    .replaceAll("मानक प्रमाणपत्र सेवाओं लेने", "मानक प्रमाणपत्र सेवाएँ लेने")
    .replaceAll("नियमित दस्तावेज सेवाओं लेने", "नियमित दस्तावेज सेवाएँ लेने")
    .replaceAll("पंजीकरण सेवाओं लेने", "पंजीकरण सेवाएँ लेने")
    .replaceAll("शुल्क भुगतान सेवाओं लेने", "शुल्क भुगतान सेवाएँ लेने")
    .replaceAll("सटीक समय पर पहुँचना नहीं कर पाते", "सटीक समय पर पहुँच नहीं पाते")
    .replaceAll("तय स्लॉट पूरा नहीं कर सकते", "तय स्लॉट के समय पहुँच नहीं सकते")
    .replaceAll("नियमित दस्तावेज सेवाओं फिर कभी ठीक से नहीं दी जा सकेगी", "नियमित दस्तावेज सेवाएँ फिर कभी ठीक से नहीं दी जा सकेंगी")
    .replaceAll("पंजीकरण सेवाओं स्थायी रूप से अव्यावहारिक हो जाएगी", "पंजीकरण सेवाएँ स्थायी रूप से अव्यावहारिक हो जाएँगी")
    .replaceAll("वेबकैम गतिविधि की निगरानी निगरानी", "वेबकैम गतिविधि की निगरानी")
    .replace(/(लगातार स्क्रीन रिकॉर्डिंग|स्थान ट्रैकिंग|कीस्ट्रोक लॉगिंग|वेबकैम गतिविधि की निगरानी) की पहले चेतावनी/g, "$1 के बारे में अग्रिम सूचना")
    .replaceAll("दूरस्थ कर्मचारियों कीस्ट्रोक लॉगिंग के उपयोग पर सवाल उठाते हैं", "दूरस्थ कर्मचारी कीस्ट्रोक लॉगिंग के उपयोग पर सवाल उठाते हैं")
    .replaceAll("कीस्ट्रोक लॉगिंग केवल दूरस्थ कर्मचारियों की विशिष्ट कदाचार जाँच में उपयोग हो रहा है", "कीस्ट्रोक लॉगिंग केवल दूरस्थ कर्मचारियों से जुड़ी विशिष्ट कदाचार जाँच में उपयोग हो रही है")
    .replaceAll("कार्यालय कर्मचारियों के कर्मचारी", "किसी कार्यालय कर्मचारी")
    .replaceAll("संविदा कर्मचारियों के कर्मचारी", "किसी संविदा कर्मचारी")
    .replaceAll("दूरस्थ कर्मचारियों के कर्मचारी", "किसी दूरस्थ कर्मचारी")
    .replaceAll("संविदा कर्मचारियों में कोई कर्मचारी", "कोई संविदा कर्मचारी")
    .replaceAll("कार्यालय कर्मचारियों में कोई कर्मचारी", "कोई कार्यालय कर्मचारी")
    .replaceAll("दूरस्थ कर्मचारियों में कोई कर्मचारी", "कोई दूरस्थ कर्मचारी")
    .replaceAll("प्राधिकरण शिकायत को इसे", "प्राधिकरण को इसे")
    .replaceAll("प्राधिकरण शिकायत उसे", "प्राधिकरण उसे")
    .replaceAll("एक खरीदार शिकायत", "खरीदार की एक शिकायत")
    .replaceAll("एक नकल शिकायत", "नकल की एक शिकायत")
    .replaceAll("एक कदाचार आरोप", "कदाचार का एक आरोप")
    .replaceAll("कदाचार का एक आरोप पर", "कदाचार के एक आरोप पर")
    .replaceAll("कदाचार का एक आरोप को", "कदाचार के एक आरोप को")
    .replaceAll("कदाचार का एक आरोप में", "कदाचार के एक आरोप में")
    .replaceAll("खरीदार की एक शिकायत तभी हो सकता है", "खरीदार की एक शिकायत तभी हो सकती है")
    .replaceAll("नकल की एक शिकायत तभी हो सकता है", "नकल की एक शिकायत तभी हो सकती है")
    .replaceAll("गलत खरीदार की एक शिकायत गंभीर नुकसान कर सकता है", "खरीदार की गलत शिकायत गंभीर नुकसान कर सकती है")
    .replaceAll("गलत नकल की एक शिकायत गंभीर नुकसान कर सकता है", "नकल की गलत शिकायत गंभीर नुकसान कर सकती है")
    .replaceAll("खरीदार की एक शिकायत शिकायत या संकेत है, दोष का स्वतः प्रमाण नहीं", "खरीदार की एक शिकायत अपने-आप दोष का प्रमाण नहीं है")
    .replaceAll("नकल की एक शिकायत शिकायत या संकेत है, दोष का स्वतः प्रमाण नहीं", "नकल की एक शिकायत अपने-आप दोष का प्रमाण नहीं है")
    .replaceAll("एक स्वचालित धोखाधड़ी संकेत शिकायत या संकेत है, दोष का स्वतः प्रमाण नहीं", "एक स्वचालित धोखाधड़ी संकेत अपने-आप दोष का प्रमाण नहीं है")
    .replaceAll("स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को परिणाम की प्रक्रिया समझने और संभावित त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मॉडल उत्तर बिंदु उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करता है", "स्पष्ट मूल्यांकन मानदंड उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करते हैं")
    .replaceAll("यदि मॉडल उत्तर बिंदु बदल सकता है", "यदि मॉडल उत्तर बिंदु बदल सकते हैं")
    .replaceAll("यदि मूल्यांकन मानदंड बदल सकता है", "यदि मूल्यांकन मानदंड बदल सकते हैं")
    .replace(/(यदि (?:मॉडल उत्तर बिंदु|मूल्यांकन मानदंड) बदल सकते हैं, तो [^.]+? को )इसे( अद्यतन रखना होगा)/g, "$1इन्हें$2");
}

function polishPunjabi(value: string): string {
  return value
    .replaceAll("ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਦੀ ਨਿਗਰਾਨੀ ਨਿਗਰਾਨੀ", "ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਦੀ ਨਿਗਰਾਨੀ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਨਿਗਰਾਨੀ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ")
    .replaceAll("ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ ਨਿਗਰਾਨੀ", "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ")
    .replace(/(ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ|ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ|ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ|ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਦੀ ਨਿਗਰਾਨੀ) ਦੀ ਪਹਿਲਾਂ ਚੇਤਾਵਨੀ/g, "$1 ਬਾਰੇ ਅਗਾਊਂ ਸੂਚਨਾ")
    .replaceAll("ਤੈਅ ਸਲਾਟ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕਦੇ", "ਤੈਅ ਸਲਾਟ ਦੇ ਸਮੇਂ ਨਹੀਂ ਪਹੁੰਚ ਸਕਦੇ")
    .replaceAll("ਠੇਕਾ ਕਰਮਚਾਰੀਆਂ ਦੇ ਕਰਮਚਾਰੀ", "ਕਿਸੇ ਠੇਕਾ ਕਰਮਚਾਰੀ")
    .replaceAll("ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀਆਂ ਦੇ ਕਰਮਚਾਰੀ", "ਕਿਸੇ ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀ")
    .replaceAll("ਰਿਮੋਟ ਕਰਮਚਾਰੀਆਂ ਦੇ ਕਰਮਚਾਰੀ", "ਕਿਸੇ ਰਿਮੋਟ ਕਰਮਚਾਰੀ")
    .replaceAll("ਇੱਕ ਖਰੀਦਦਾਰ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ")
    .replaceAll("ਇੱਕ ਨਕਲ ਦੀ ਸ਼ਿਕਾਇਤ", "ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ")
    .replaceAll("ਇੱਕ ਗਲਤ ਵਿਹਾਰ ਦਾ ਦੋਸ਼", "ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼")
    .replaceAll("ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਕਾਰਨ", "ਗਲਤ ਵਿਹਾਰ ਦੇ ਇੱਕ ਦੋਸ਼ ਕਾਰਨ")
    .replaceAll("ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਤੋਂ", "ਗਲਤ ਵਿਹਾਰ ਦੇ ਇੱਕ ਦੋਸ਼ ਤੋਂ")
    .replaceAll("ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਦੇ ਆਧਾਰ", "ਗਲਤ ਵਿਹਾਰ ਦੇ ਇੱਕ ਦੋਸ਼ ਦੇ ਆਧਾਰ")
    .replaceAll("ਗਲਤ ਇੱਕ ਆਟੋਮੈਟਿਕ ਧੋਖਾਧੜੀ ਸੰਕੇਤ ਦੇ ਆਧਾਰ", "ਇੱਕ ਗਲਤ ਆਟੋਮੈਟਿਕ ਧੋਖਾਧੜੀ ਸੰਕੇਤ ਦੇ ਆਧਾਰ")
    .replaceAll("ਗਲਤ ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਦੇ ਆਧਾਰ", "ਗਲਤ ਵਿਹਾਰ ਦੇ ਇੱਕ ਗਲਤ ਦੋਸ਼ ਦੇ ਆਧਾਰ")
    .replaceAll("ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਸਿਰਫ਼ ਤਦ ਹੋ ਸਕਦਾ ਹੈ", "ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਸਿਰਫ਼ ਤਦ ਹੀ ਲੱਗ ਸਕਦਾ ਹੈ")
    .replaceAll("ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਹੈ, ਦੋਸ਼ ਦਾ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ", "ਗਲਤ ਵਿਹਾਰ ਦਾ ਇੱਕ ਦੋਸ਼ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ")
    .replaceAll("ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦਾ ਹੈ", "ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦੀ ਹੈ")
    .replaceAll("ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦਾ ਹੈ", "ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦੀ ਹੈ")
    .replaceAll("ਗਲਤ ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦਾ ਹੈ", "ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਗਲਤ ਸ਼ਿਕਾਇਤ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ")
    .replaceAll("ਗਲਤ ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦਾ ਹੈ", "ਨਕਲ ਦੀ ਗਲਤ ਸ਼ਿਕਾਇਤ ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ")
    .replaceAll("ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਹੈ, ਦੋਸ਼ ਦਾ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ", "ਇੱਕ ਖਰੀਦਦਾਰ ਦੀ ਸ਼ਿਕਾਇਤ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ")
    .replaceAll("ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਹੈ, ਦੋਸ਼ ਦਾ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ", "ਨਕਲ ਦੀ ਇੱਕ ਸ਼ਿਕਾਇਤ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਨਤੀਜੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਸੰਭਾਵਿਤ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ", "ਸਪੱਸ਼ਟ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ")
    .replaceAll("ਜੇ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਬਦਲ ਸਕਦਾ ਹੈ", "ਜੇ ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ ਬਦਲ ਸਕਦੇ ਹਨ")
    .replaceAll("ਜੇ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਬਦਲ ਸਕਦਾ ਹੈ", "ਜੇ ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ ਬਦਲ ਸਕਦੇ ਹਨ")
    .replace(/(ਜੇ (?:ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ) ਬਦਲ ਸਕਦੇ ਹਨ, ਤਾਂ [^.]+? ਨੂੰ )ਇਸ ਨੂੰ( ਅੱਪਡੇਟ ਰੱਖਣਾ ਹੋਵੇਗਾ)/g, "$1ਇਨ੍ਹਾਂ ਨੂੰ$2");
}

function rebuildStem(locale: string, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : locale === "pa-IN" ? "ਕਥਨ" : "Statement";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : locale === "pa-IN" ? "ਦਲੀਲਾਂ" : "Arguments";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function polishArgCp015LocalizedComboSurface(question: Question): Question {
  const locale = String(question.locale ?? "");
  if (locale !== "en-IN" && locale !== "hi-IN" && locale !== "pa-IN") return question;

  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if ((locale === "hi-IN" || locale === "pa-IN") && sourceArguments.length === 2) {
    return polishArgCp015LocalizedTwoArgumentSurface(question);
  }

  const isEnglish = locale === "en-IN";
  if (isEnglish) {
    if (!question.comboEditorialAuthority) return question;
  } else if (!question.localizedComboEditorialAuthority) {
    return question;
  }

  const polish = isEnglish ? polishEnglish : locale === "hi-IN" ? polishHindi : polishPunjabi;
  const authority = isEnglish ? ARG_CP015_ENGLISH_COMBO_POLISH_AUTHORITY : ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY;
  const sourceStatement = String(question.statement ?? "");
  const sourceExplanation = String(question.explanation ?? "");
  let statement = polish(sourceStatement);
  const argumentsList = Object.freeze(sourceArguments.map((argument) => polish(argument)));
  let explanation = polish(sourceExplanation);

  const sourceForPlural = String(question.sourceStatement ?? sourceStatement);
  if (locale === "hi-IN" && /मॉडल उत्तर बिंदु|मूल्यांकन मानदंड/.test(sourceForPlural)) {
    explanation = explanation.replaceAll("द्वारा इसे अद्यतन रखना", "द्वारा इन्हें अद्यतन रखना");
  }
  if (locale === "pa-IN" && /ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ|ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ/.test(sourceForPlural)) {
    explanation = explanation.replaceAll("ਵੱਲੋਂ ਇਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ", "ਵੱਲੋਂ ਇਨ੍ਹਾਂ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ");
  }

  if (String(question.qlId) === "ARG-QL-006") {
    if (locale === "hi-IN") {
      statement = statement
        .replace(/^क्या (.+) के बाद (.+) द्वारा तत्काल स्थायी दंड उचित है\?$/, "क्या $1 मिलने के बाद $2 द्वारा तत्काल स्थायी दंड उचित है?")
        .replace(/^क्या (.+) के तुरंत बाद (.+) द्वारा स्थायी दंड लगाना उचित है\?$/, "क्या $1 मिलने के तुरंत बाद $2 द्वारा स्थायी दंड लगाना उचित है?");
    } else if (locale === "pa-IN") {
      statement = statement
        .replace(/^ਕੀ (.+) ਤੋਂ ਬਾਅਦ (.+) ਵੱਲੋਂ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਵਾਜਬ ਹੈ\?$/, "ਕੀ $1 ਮਿਲਣ ਤੋਂ ਬਾਅਦ $2 ਵੱਲੋਂ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਵਾਜਬ ਹੈ?")
        .replace(/^ਕੀ (.+) ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ (.+) ਵੱਲੋਂ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾਉਣਾ ਵਾਜਬ ਹੈ\?$/, "ਕੀ $1 ਮਿਲਣ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ $2 ਵੱਲੋਂ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾਉਣਾ ਵਾਜਬ ਹੈ?");
    }
  }

  const changed = statement !== sourceStatement
    || explanation !== sourceExplanation
    || argumentsList.some((value, index) => value !== sourceArguments[index]);

  if (!changed) {
    return Object.freeze({
      ...question,
      ...(isEnglish
        ? { englishComboPolishAuthority: ARG_CP015_ENGLISH_COMBO_POLISH_AUTHORITY }
        : { localizedComboPolishAuthority: ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY }),
    });
  }

  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    authority,
    isEnglish ? question.comboEditorialAuthority : question.localizedComboEditorialAuthority,
    question.qlId,
    question.examProfile,
    locale,
    statement,
    argumentsList,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement,
    arguments: argumentsList,
    explanation,
    stem,
    text: stem,
    prePolishStatement: sourceStatement,
    prePolishExplanation: sourceExplanation,
    ...(isEnglish
      ? { englishComboPolishAuthority: ARG_CP015_ENGLISH_COMBO_POLISH_AUTHORITY }
      : { localizedComboPolishAuthority: ARG_CP015_LOCALIZED_COMBO_POLISH_AUTHORITY }),
    questionId: `ARG-001:${question.qlId}:${question.examProfile}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
  });
}