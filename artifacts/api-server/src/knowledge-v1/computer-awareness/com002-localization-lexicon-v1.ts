import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com002-english-freeze-v1";
import { COM002_TERMINOLOGY_EXTENSION_V1 } from "./com002-localization-lexicon-extension-v1";

export const COM002_LOCALIZATION_VERSION_V1 = "COM-002-LOCALIZATION-V1" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V1 = "COM002_HI_PA_LOCALIZATION_REVIEW_V1" as const;

export type Com002LocalizationLanguageV1 = "en" | "hi" | "pa";
export type Com002TargetLanguageV1 = Exclude<Com002LocalizationLanguageV1, "en">;

export type Com002LocalizedLexeme = Readonly<{ hi: string; pa: string }>;

/**
 * Exact semantic lexemes only. Product names, acronyms, shortcut chords and
 * file extensions may intentionally retain Latin script; surrounding learner
 * prose is localized by the question-surface renderer.
 */
const COM002_CORE_TERMINOLOGY_REGISTRY_V1: Readonly<Record<string, Com002LocalizedLexeme>> = Object.freeze({
  "Operating system": { hi: "ऑपरेटिंग सिस्टम", pa: "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "operating system": { hi: "ऑपरेटिंग सिस्टम", pa: "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "mobile operating system": { hi: "मोबाइल ऑपरेटिंग सिस्टम", pa: "ਮੋਬਾਈਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "open-source operating system": { hi: "ओपन-सोर्स ऑपरेटिंग सिस्टम", pa: "ਓਪਨ-ਸੋਰਸ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "proprietary operating system": { hi: "प्रोप्राइटरी ऑपरेटिंग सिस्टम", pa: "ਪ੍ਰੋਪ੍ਰਾਇਟਰੀ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "proprietary mobile operating system": { hi: "प्रोप्राइटरी मोबाइल ऑपरेटिंग सिस्टम", pa: "ਪ੍ਰੋਪ੍ਰਾਇਟਰੀ ਮੋਬਾਈਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "open-source mobile operating system": { hi: "ओपन-सोर्स मोबाइल ऑपरेटिंग सिस्टम", pa: "ਓਪਨ-ਸੋਰਸ ਮੋਬਾਈਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "Real-time operating system": { hi: "रियल-टाइम ऑपरेटिंग सिस्टम", pa: "ਰੀਅਲ-ਟਾਈਮ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "Single-user operating system": { hi: "सिंगल-यूज़र ऑपरेटिंग सिस्टम", pa: "ਸਿੰਗਲ-ਯੂਜ਼ਰ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "Multi-user operating system": { hi: "मल्टी-यूज़र ऑपरेटिंग सिस्टम", pa: "ਮਲਟੀ-ਯੂਜ਼ਰ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ" },
  "Kernel": { hi: "कर्नेल", pa: "ਕਰਨਲ" },
  "Graphical user interface (GUI)": { hi: "ग्राफिकल यूज़र इंटरफेस (GUI)", pa: "ਗ੍ਰਾਫਿਕਲ ਯੂਜ਼ਰ ਇੰਟਰਫੇਸ (GUI)" },
  "Command-line interface (CLI)": { hi: "कमांड-लाइन इंटरफेस (CLI)", pa: "ਕਮਾਂਡ-ਲਾਈਨ ਇੰਟਰਫੇਸ (CLI)" },
  "Application programming interface (API)": { hi: "एप्लिकेशन प्रोग्रामिंग इंटरफेस (API)", pa: "ਐਪਲੀਕੇਸ਼ਨ ਪ੍ਰੋਗਰਾਮਿੰਗ ਇੰਟਰਫੇਸ (API)" },
  "Basic input/output system (BIOS)": { hi: "बेसिक इनपुट/आउटपुट सिस्टम (BIOS)", pa: "ਬੇਸਿਕ ਇਨਪੁੱਟ/ਆਉਟਪੁੱਟ ਸਿਸਟਮ (BIOS)" },
  "Booting": { hi: "बूटिंग", pa: "ਬੂਟਿੰਗ" },
  "Restart": { hi: "रीस्टार्ट", pa: "ਰੀਸਟਾਰਟ" },
  "Shutdown": { hi: "शटडाउन", pa: "ਸ਼ਟਡਾਊਨ" },
  "Sleep": { hi: "स्लीप", pa: "ਸਲੀਪ" },
  "Hibernate": { hi: "हाइबरनेट", pa: "ਹਾਈਬਰਨੇਟ" },
  "Windows taskbar": { hi: "Windows टास्कबार", pa: "Windows ਟਾਸਕਬਾਰ" },
  "Windows Start menu": { hi: "Windows स्टार्ट मेनू", pa: "Windows ਸਟਾਰਟ ਮੀਨੂ" },
  "Taskbar notification area": { hi: "टास्कबार नोटिफिकेशन क्षेत्र", pa: "ਟਾਸਕਬਾਰ ਨੋਟੀਫਿਕੇਸ਼ਨ ਖੇਤਰ" },
  "File Explorer": { hi: "फ़ाइल एक्सप्लोरर", pa: "ਫ਼ਾਈਲ ਐਕਸਪਲੋਰਰ" },
  "Folder (directory)": { hi: "फ़ोल्डर (डायरेक्टरी)", pa: "ਫ਼ੋਲਡਰ (ਡਾਇਰੈਕਟਰੀ)" },
  "File path": { hi: "फ़ाइल पाथ", pa: "ਫ਼ਾਈਲ ਪਾਥ" },
  "File": { hi: "फ़ाइल", pa: "ਫ਼ਾਈਲ" },
  "File extension": { hi: "फ़ाइल एक्सटेंशन", pa: "ਫ਼ਾਈਲ ਐਕਸਟੈਂਸ਼ਨ" },
  "Recycle Bin": { hi: "रीसायकल बिन", pa: "ਰੀਸਾਈਕਲ ਬਿਨ" },
  "Clipboard": { hi: "क्लिपबोर्ड", pa: "ਕਲਿੱਪਬੋਰਡ" },
  "Taskbar": { hi: "टास्कबार", pa: "ਟਾਸਕਬਾਰ" },
  "Start menu": { hi: "स्टार्ट मेनू", pa: "ਸਟਾਰਟ ਮੀਨੂ" },
  "Copy": { hi: "कॉपी", pa: "ਕਾਪੀ" },
  "Move": { hi: "मूव", pa: "ਮੂਵ" },
  "Rename": { hi: "रीनेम", pa: "ਰੀਨੇਮ" },
  "Delete": { hi: "डिलीट", pa: "ਡਿਲੀਟ" },
  "Search": { hi: "सर्च", pa: "ਸਰਚ" },
  "Windows": { hi: "Windows", pa: "Windows" },
  "Ubuntu": { hi: "Ubuntu", pa: "Ubuntu" },
  "Ubuntu Desktop": { hi: "Ubuntu Desktop", pa: "Ubuntu Desktop" },
  "Android": { hi: "Android", pa: "Android" },
  "iOS": { hi: "iOS", pa: "iOS" },
  "Linux": { hi: "Linux", pa: "Linux" },
  "macOS": { hi: "macOS", pa: "macOS" },
});

export const COM002_TERMINOLOGY_REGISTRY_V1: Readonly<Record<string, Com002LocalizedLexeme>> = Object.freeze({
  ...COM002_CORE_TERMINOLOGY_REGISTRY_V1,
  ...COM002_TERMINOLOGY_EXTENSION_V1,
});

export function localizeCom002LexemeV1(text: string, language: Com002TargetLanguageV1): string {
  const localized = COM002_TERMINOLOGY_REGISTRY_V1[text]?.[language];
  if (!localized) throw new Error(`COM-002 localization lexeme missing [${language}]: ${text}`);
  return localized;
}

export function auditCom002LocalizationLexiconCoverageV1() {
  const missing = new Set<string>();
  const used = new Set<string>();
  for (const fact of COM002_EDITORIALLY_APPROVED_FACTS) {
    if (fact.value.kind !== "text") continue;
    for (const text of [fact.entity.label.en, fact.value.text.en]) {
      used.add(text);
      const entry = COM002_TERMINOLOGY_REGISTRY_V1[text];
      if (!entry?.hi?.trim() || !entry?.pa?.trim()) missing.add(text);
    }
  }
  return {
    valid: missing.size === 0,
    authorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    approvedFactCount: COM002_EDITORIALLY_APPROVED_FACTS.length,
    uniqueSemanticLexemeCount: used.size,
    registeredLexemeCount: [...used].filter((text) => Boolean(COM002_TERMINOLOGY_REGISTRY_V1[text])).length,
    missingLexemes: [...missing].sort(),
  };
}
