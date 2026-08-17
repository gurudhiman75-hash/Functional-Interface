import type { CategoryTerm } from "./types";

function term(
  termKey: string,
  enPlural: string,
  enSingular: string,
  hiPlural: string,
  hiSingular: string,
  paPlural: string,
  paSingular: string,
  paGender: "M" | "F",
): CategoryTerm {
  return {
    termKey,
    labels: { "en-IN": enPlural, "hi-IN": hiPlural, "pa-IN": paPlural },
    singularLabels: { "en-IN": enSingular, "hi-IN": hiSingular, "pa-IN": paSingular },
    paGender,
  };
}

export const SYL_CATEGORY_TERMS: readonly CategoryTerm[] = Object.freeze([
  term("poets", "poets", "poet", "कवि", "कवि", "ਕਵੀ", "ਕਵੀ", "M"),
  term("lamps", "lamps", "lamp", "दीपक", "दीपक", "ਦੀਵੇ", "ਦੀਵਾ", "M"),
  term("rivers", "rivers", "river", "नदियाँ", "नदी", "ਦਰਿਆ", "ਦਰਿਆ", "M"),
  term("badges", "badges", "badge", "बैज", "बैज", "ਬੈਜ", "ਬੈਜ", "M"),
  term("windows", "windows", "window", "खिड़कियाँ", "खिड़की", "ਖਿੜਕੀਆਂ", "ਖਿੜਕੀ", "F"),
  term("gardens", "gardens", "garden", "बगीचे", "बगीचा", "ਬਾਗ਼", "ਬਾਗ਼", "M"),
  term("coins", "coins", "coin", "सिक्के", "सिक्का", "ਸਿੱਕੇ", "ਸਿੱਕਾ", "M"),
  term("drums", "drums", "drum", "ढोल", "ढोल", "ਢੋਲ", "ਢੋਲ", "M"),
  term("kites", "kites", "kite", "पतंगें", "पतंग", "ਪਤੰਗਾਂ", "ਪਤੰਗ", "F"),
  term("books", "books", "book", "पुस्तकें", "पुस्तक", "ਕਿਤਾਬਾਂ", "ਕਿਤਾਬ", "F"),
  term("chairs", "chairs", "chair", "कुर्सियाँ", "कुर्सी", "ਕੁਰਸੀਆਂ", "ਕੁਰਸੀ", "F"),
  term("clouds", "clouds", "cloud", "बादल", "बादल", "ਬੱਦਲ", "ਬੱਦਲ", "M"),
  term("trains", "trains", "train", "रेलगाड़ियाँ", "रेलगाड़ी", "ਰੇਲਗੱਡੀਆਂ", "ਰੇਲਗੱਡੀ", "F"),
  term("pencils", "pencils", "pencil", "पेंसिलें", "पेंसिल", "ਪੈਂਸਿਲਾਂ", "ਪੈਂਸਿਲ", "F"),
  term("flowers", "flowers", "flower", "फूल", "फूल", "ਫੁੱਲ", "ਫੁੱਲ", "M"),
  term("boxes", "boxes", "box", "डिब्बे", "डिब्बा", "ਡੱਬੇ", "ਡੱਬਾ", "M"),
  term("maps", "maps", "map", "नक्शे", "नक्शा", "ਨਕਸ਼ੇ", "ਨਕਸ਼ਾ", "M"),
  term("bells", "bells", "bell", "घंटियाँ", "घंटी", "ਘੰਟੀਆਂ", "ਘੰਟੀ", "F"),
  term("cups", "cups", "cup", "कप", "कप", "ਕੱਪ", "ਕੱਪ", "M"),
  term("stones", "stones", "stone", "पत्थर", "पत्थर", "ਪੱਥਰ", "ਪੱਥਰ", "M"),
  term("rings", "rings", "ring", "अंगूठियाँ", "अंगूठी", "ਅੰਗੂਠੀਆਂ", "ਅੰਗੂਠੀ", "F"),
  term("stars", "stars", "star", "तारे", "तारा", "ਤਾਰੇ", "ਤਾਰਾ", "M"),
  term("flags", "flags", "flag", "झंडे", "झंडा", "ਝੰਡੇ", "ਝੰਡਾ", "M"),
  term("roads", "roads", "road", "सड़कें", "सड़क", "ਸੜਕਾਂ", "ਸੜਕ", "F"),
  term("birds", "birds", "bird", "पक्षी", "पक्षी", "ਪੰਛੀ", "ਪੰਛੀ", "M"),
  term("fruits", "fruits", "fruit", "फल", "फल", "ਫਲ", "ਫਲ", "M"),
  term("shirts", "shirts", "shirt", "कमीज़ें", "कमीज़", "ਕਮੀਜ਼ਾਂ", "ਕਮੀਜ਼", "F"),
  term("boats", "boats", "boat", "नावें", "नाव", "ਕਿਸ਼ਤੀਆਂ", "ਕਿਸ਼ਤੀ", "F"),
  term("clocks", "clocks", "clock", "घड़ियाँ", "घड़ी", "ਘੜੀਆਂ", "ਘੜੀ", "F"),
  term("plates", "plates", "plate", "प्लेटें", "प्लेट", "ਪਲੇਟਾਂ", "ਪਲੇਟ", "F"),
]);
