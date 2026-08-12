import type { BlrRelationId } from "../../foundation/types";
import {
  BLR_CP004_RELATION_PLURALS,
  type GeneratedBlrCp004Question,
} from "../cp004-model";
import {
  localizedBlrCp003RelationLabel,
  type BlrCp003TranslatedLocale,
} from "../../BLR-CP-003/localization/cp003-language-pack";

export const BLR_CP004_LOCALIZATION_VERSION = "blr-cp004-hi-pa-localization-v1" as const;
export const BLR_CP004_MULTILINGUAL_RUNTIME_VERSION = "blr-cp004-counts-multilingual-v1" as const;

export type BlrCp004TranslatedLocale = BlrCp003TranslatedLocale;

export function localeText(locale: BlrCp004TranslatedLocale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function relationIdForPlural(plural: string): BlrRelationId {
  const entry = (Object.entries(BLR_CP004_RELATION_PLURALS) as [BlrRelationId, string][])
    .find(([, value]) => value === plural);
  if (!entry) throw new Error(`CP-004 localization: unknown relation plural '${plural}'.`);
  return entry[0];
}

export function localizedBlrCp004VectorText(
  value: readonly [number, number, number, number],
  locale: BlrCp004TranslatedLocale,
): string {
  return localeText(
    locale,
    `${value[0]} पुरुष, ${value[1]} महिलाएँ, ${value[2]} विवाहित जोड़े, ${value[3]} पीढ़ियाँ`,
    `${value[0]} ਪੁਰਸ਼, ${value[1]} ਮਹਿਲਾਵਾਂ, ${value[2]} ਵਿਆਹੇ ਜੋੜੇ, ${value[3]} ਪੀੜ੍ਹੀਆਂ`,
  );
}

export function localizedBlrCp004OptionText(
  option: GeneratedBlrCp004Question["options"][number],
  locale: BlrCp004TranslatedLocale,
): string {
  if (option.semanticKey.startsWith("NUMBER:")) return option.text;
  const match = /^COUNT_VECTOR:(\d+):(\d+):(\d+):(\d+)$/.exec(option.semanticKey);
  if (!match) throw new Error(`CP-004 localization: unsupported option semantic key ${option.semanticKey}.`);
  return localizedBlrCp004VectorText(
    [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])],
    locale,
  );
}

export function localizedBlrCp004Stem(
  record: GeneratedBlrCp004Question,
  locale: BlrCp004TranslatedLocale,
): string {
  switch (record.sourcePrototypeId) {
    case "BLR-CP004-PROT-COUNT-TOTAL-MEMBERS":
      return localeText(locale, "परिवार में कुल कितने नामित सदस्य हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਨਾਮਿਤ ਮੈਂਬਰ ਹਨ?");

    case "BLR-CP004-PROT-COUNT-GENDER-MEMBERS": {
      const male = /male members/i.test(record.stem);
      return male
        ? localeText(locale, "परिवार में कितने पुरुष सदस्य हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕਿੰਨੇ ਪੁਰਸ਼ ਮੈਂਬਰ ਹਨ?")
        : localeText(locale, "परिवार में कितनी महिला सदस्य हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕਿੰਨੀਆਂ ਮਹਿਲਾ ਮੈਂਬਰ ਹਨ?");
    }

    case "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS":
      if (/explicitly unmarried/i.test(record.stem)) {
        return localeText(locale, "स्पष्ट रूप से अविवाहित बताए गए सदस्य कितने हैं?", "ਸਪਸ਼ਟ ਤੌਰ ’ਤੇ ਅਵਿਵਾਹਿਤ ਦੱਸੇ ਮੈਂਬਰ ਕਿੰਨੇ ਹਨ?");
      }
      if (/marital status is unstated/i.test(record.stem)) {
        return localeText(locale, "जिन सदस्यों की वैवाहिक स्थिति नहीं बताई गई है, उनकी संख्या कितनी है?", "ਜਿਨ੍ਹਾਂ ਮੈਂਬਰਾਂ ਦੀ ਵਿਆਹੀ ਸਥਿਤੀ ਨਹੀਂ ਦੱਸੀ ਗਈ, ਉਹਨਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?");
      }
      if (/named spouse/i.test(record.stem)) {
        return localeText(locale, "जिन सदस्यों के जीवनसाथी का नाम दिया गया है, उनकी संख्या कितनी है?", "ਜਿਨ੍ਹਾਂ ਮੈਂਬਰਾਂ ਦੇ ਜੀਵਨਸਾਥੀ ਦਾ ਨਾਮ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਉਹਨਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ?");
      }
      throw new Error(`CP-004 localization: unsupported marital-status stem '${record.stem}'.`);

    case "BLR-CP004-PROT-COUNT-GENERATION-MEMBERS": {
      if (/oldest generation/i.test(record.stem)) {
        return localeText(locale, "सबसे पुरानी पीढ़ी में कितने सदस्य हैं?", "ਸਭ ਤੋਂ ਵੱਡੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਕਿੰਨੇ ਮੈਂਬਰ ਹਨ?");
      }
      if (/youngest generation/i.test(record.stem)) {
        return localeText(locale, "सबसे नई पीढ़ी में कितने सदस्य हैं?", "ਸਭ ਤੋਂ ਛੋਟੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਕਿੰਨੇ ਮੈਂਬਰ ਹਨ?");
      }
      const generation = /generation (-?\d+)/i.exec(record.stem)?.[1];
      if (generation !== undefined) {
        return localeText(locale, `पीढ़ी ${generation} में कितने सदस्य हैं?`, `ਪੀੜ੍ਹੀ ${generation} ਵਿੱਚ ਕਿੰਨੇ ਮੈਂਬਰ ਹਨ?`);
      }
      throw new Error(`CP-004 localization: unsupported generation-member stem '${record.stem}'.`);
    }

    case "BLR-CP004-PROT-COUNT-DIRECT-RELATIVES":
    case "BLR-CP004-PROT-COUNT-EXTENDED-RELATIVES": {
      const match = /^How many (.+) of (.+) are named in the family\?$/.exec(record.stem);
      if (!match) throw new Error(`CP-004 localization: unsupported relative stem '${record.stem}'.`);
      const relationId = relationIdForPlural(match[1]!);
      const relation = localizedBlrCp003RelationLabel(relationId, locale);
      const reference = match[2]!;
      return localeText(
        locale,
        `परिवार में ${reference} के ${relation} के रूप में कितने सदस्य नामित हैं?`,
        `ਪਰਿਵਾਰ ਵਿੱਚ ${reference} ਦੇ ${relation} ਵਜੋਂ ਕਿੰਨੇ ਮੈਂਬਰ ਨਾਮਿਤ ਹਨ?`,
      );
    }

    case "BLR-CP004-PROT-COUNT-SHARED-CHILDREN": {
      const match = /^How many children of (.+) and (.+) are named in the family\?$/.exec(record.stem);
      if (!match) throw new Error(`CP-004 localization: unsupported shared-children stem '${record.stem}'.`);
      return localeText(
        locale,
        `परिवार में ${match[1]} और ${match[2]} की कितनी संतानें नामित हैं?`,
        `ਪਰਿਵਾਰ ਵਿੱਚ ${match[1]} ਅਤੇ ${match[2]} ਦੀਆਂ ਕਿੰਨੀਆਂ ਸੰਤਾਨਾਂ ਨਾਮਿਤ ਹਨ?`,
      );
    }

    case "BLR-CP004-PROT-COUNT-MARRIED-COUPLES":
      return localeText(locale, "परिवार में कितने विवाहित जोड़े हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕਿੰਨੇ ਵਿਆਹੇ ਜੋੜੇ ਹਨ?");
    case "BLR-CP004-PROT-COUNT-SIBLING-PAIRS":
      return localeText(locale, "परिवार में भाई-बहन के कितने युग्म हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਭਰਾ-ਭੈਣ ਦੇ ਕਿੰਨੇ ਜੋੜੇ ਹਨ?");
    case "BLR-CP004-PROT-COUNT-PARENT-CHILD-PAIRS":
      return localeText(locale, "परिवार में माता-पिता–संतान के कितने संबंध हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਮਾਤਾ-ਪਿਤਾ–ਸੰਤਾਨ ਦੇ ਕਿੰਨੇ ਸੰਬੰਧ ਹਨ?");
    case "BLR-CP004-PROT-COUNT-COUSIN-PAIRS":
      return localeText(locale, "परिवार में कज़िन के कितने युग्म हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕਜ਼ਨ ਦੇ ਕਿੰਨੇ ਜੋੜੇ ਹਨ?");
    case "BLR-CP004-PROT-COUNT-GENERATIONS":
      return localeText(locale, "परिवार में कुल कितनी पीढ़ियाँ दर्शाई गई हैं?", "ਪਰਿਵਾਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੀਆਂ ਪੀੜ੍ਹੀਆਂ ਦਰਸਾਈਆਂ ਗਈਆਂ ਹਨ?");
    case "BLR-CP004-PROT-SELECT-COMPOSITION-PROFILE":
      return localeText(
        locale,
        "कौन-सा विकल्प क्रमशः पुरुषों, महिलाओं, विवाहित जोड़ों और पीढ़ियों की सही संख्या देता है?",
        "ਕਿਹੜਾ ਵਿਕਲਪ ਕ੍ਰਮਵਾਰ ਪੁਰਸ਼ਾਂ, ਮਹਿਲਾਵਾਂ, ਵਿਆਹੇ ਜੋੜਿਆਂ ਅਤੇ ਪੀੜ੍ਹੀਆਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਦਿੰਦਾ ਹੈ?",
      );
  }
}

export function localizedBlrCp004AuthorityConcept(
  record: GeneratedBlrCp004Question,
  locale: BlrCp004TranslatedLocale,
): readonly string[] {
  switch (record.solveAuthority) {
    case "COUNT_MEMBERS_BY_FILTER":
      return [
        localeText(locale, "पहले पूछी गई सदस्य-श्रेणी तय करें और प्रत्येक योग्य व्यक्ति को केवल एक बार गिनें।", "ਪਹਿਲਾਂ ਪੁੱਛੀ ਗਈ ਮੈਂਬਰ-ਸ਼੍ਰੇਣੀ ਤੈਅ ਕਰੋ ਅਤੇ ਹਰ ਯੋਗ ਵਿਅਕਤੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਗਿਣੋ।"),
        record.sourcePrototypeId === "BLR-CP004-PROT-COUNT-MARITAL-STATUS-MEMBERS"
          ? localeText(locale, "वैवाहिक स्थिति में केवल स्पष्ट प्रमाण मानें; जीवनसाथी का उल्लेख न होना अविवाहित होने का प्रमाण नहीं है।", "ਵਿਆਹੀ ਸਥਿਤੀ ਲਈ ਕੇਵਲ ਸਪਸ਼ਟ ਸਬੂਤ ਮੰਨੋ; ਜੀਵਨਸਾਥੀ ਦਾ ਜ਼ਿਕਰ ਨਾ ਹੋਣਾ ਅਵਿਵਾਹਿਤ ਹੋਣ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ।")
          : localeText(locale, "किसी नाम का कई कथनों में आना उसे नया सदस्य नहीं बनाता।", "ਕਿਸੇ ਨਾਮ ਦਾ ਕਈ ਕਥਨਾਂ ਵਿੱਚ ਆਉਣਾ ਉਸਨੂੰ ਨਵਾਂ ਮੈਂਬਰ ਨਹੀਂ ਬਣਾਉਂਦਾ।"),
      ];
    case "COUNT_RELATIVES_OF_REFERENCE":
      return [
        localeText(locale, "संदर्भ व्यक्ति को स्थिर रखकर केवल मांगे गए संबंध वाले सदस्यों को गिनें।", "ਹਵਾਲਾ ਵਿਅਕਤੀ ਨੂੰ ਸਥਿਰ ਰੱਖ ਕੇ ਕੇਵਲ ਮੰਗੇ ਗਏ ਸੰਬੰਧ ਵਾਲੇ ਮੈਂਬਰਾਂ ਨੂੰ ਗਿਣੋ।"),
        localeText(locale, "हर योग्य नाम को एक बार गिनें और गैर-योग्य रिश्तों को शामिल न करें।", "ਹਰ ਯੋਗ ਨਾਮ ਨੂੰ ਇੱਕ ਵਾਰ ਗਿਣੋ ਅਤੇ ਗੈਰ-ਯੋਗ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਸ਼ਾਮਲ ਨਾ ਕਰੋ।"),
      ];
    case "COUNT_RELATION_PAIRS":
      return [
        localeText(locale, "प्रश्न में मांगे गए संबंध-युग्मों की सूची बनाएं।", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੇ ਗਏ ਸੰਬੰਧ-ਜੋੜਿਆਂ ਦੀ ਸੂਚੀ ਬਣਾਓ।"),
        localeText(locale, "एक ही युग्म को उलटे क्रम में दोबारा न गिनें।", "ਇੱਕੋ ਜੋੜੇ ਨੂੰ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਦੁਬਾਰਾ ਨਾ ਗਿਣੋ।"),
      ];
    case "COUNT_GENERATIONS":
      return [
        localeText(locale, "परिवार को क्षैतिज पीढ़ी-पंक्तियों में रखें और केवल भरी हुई पंक्तियाँ गिनें।", "ਪਰਿਵਾਰ ਨੂੰ ਆੜੀਆਂ ਪੀੜ੍ਹੀ-ਕਤਾਰਾਂ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਕੇਵਲ ਭਰੀਆਂ ਕਤਾਰਾਂ ਗਿਣੋ।"),
        localeText(locale, "विवाह और भाई-बहन का संबंध अपने-आप पीढ़ी नहीं बदलता।", "ਵਿਆਹ ਅਤੇ ਭਰਾ-ਭੈਣ ਦਾ ਸੰਬੰਧ ਆਪਣੇ-ਆਪ ਪੀੜ੍ਹੀ ਨਹੀਂ ਬਦਲਦਾ।"),
      ];
    case "SELECT_FAMILY_COMPOSITION_PROFILE":
      return [
        localeText(locale, "पुरुष, महिला, विवाहित जोड़े और पीढ़ियाँ—चारों गणनाएँ एक ही पूर्ण परिवार-मानचित्र से निकालें।", "ਪੁਰਸ਼, ਮਹਿਲਾਵਾਂ, ਵਿਆਹੇ ਜੋੜੇ ਅਤੇ ਪੀੜ੍ਹੀਆਂ—ਚਾਰੇ ਹਿਸਾਬ ਇੱਕੋ ਪੂਰੇ ਪਰਿਵਾਰਕ ਨਕਸ਼ੇ ਤੋਂ ਕੱਢੋ।"),
        localeText(locale, "विकल्प तभी सही है जब उसके चारों घटक सही हों।", "ਵਿਕਲਪ ਤਦੋਂ ਹੀ ਸਹੀ ਹੈ ਜਦੋਂ ਉਸਦੇ ਚਾਰੇ ਭਾਗ ਸਹੀ ਹੋਣ।"),
      ];
  }
}

export function localizedBlrCp004Shortcut(
  record: GeneratedBlrCp004Question,
  locale: BlrCp004TranslatedLocale,
): string {
  switch (record.solveAuthority) {
    case "COUNT_MEMBERS_BY_FILTER":
      return localeText(locale, "योग्य नामों पर एक-एक निशान लगाकर अंतिम संख्या लें।", "ਯੋਗ ਨਾਂਵਾਂ ’ਤੇ ਇੱਕ-ਇੱਕ ਨਿਸ਼ਾਨ ਲਗਾ ਕੇ ਅੰਤਿਮ ਗਿਣਤੀ ਲਵੋ।");
    case "COUNT_RELATIVES_OF_REFERENCE":
      return localeText(locale, "संदर्भ व्यक्ति को घेरें और केवल मांगे गए रिश्ते की शाखाएँ ट्रेस करें।", "ਹਵਾਲਾ ਵਿਅਕਤੀ ਨੂੰ ਘੇਰੋ ਅਤੇ ਕੇਵਲ ਮੰਗੇ ਗਏ ਰਿਸ਼ਤੇ ਦੀਆਂ ਸ਼ਾਖਾਵਾਂ ਟ੍ਰੇਸ ਕਰੋ।");
    case "COUNT_RELATION_PAIRS":
      return localeText(locale, "हर युग्म को एक निश्चित क्रम में लिखें और दोहराव काट दें।", "ਹਰ ਜੋੜੇ ਨੂੰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ ਅਤੇ ਦੁਹਰਾਵ ਕੱਟ ਦਿਓ।");
    case "COUNT_GENERATIONS":
      return localeText(locale, "परिवार को पंक्तियों में बनाकर भरी हुई पीढ़ी-पंक्तियाँ गिनें।", "ਪਰਿਵਾਰ ਨੂੰ ਕਤਾਰਾਂ ਵਿੱਚ ਬਣਾਕੇ ਭਰੀਆਂ ਪੀੜ੍ਹੀ-ਕਤਾਰਾਂ ਗਿਣੋ।");
    case "SELECT_FAMILY_COMPOSITION_PROFILE":
      return localeText(locale, "चार छोटे खाने बनाएं—पुरुष, महिला, जोड़े, पीढ़ियाँ—और पहले गलत घटक पर विकल्प काट दें।", "ਚਾਰ ਛੋਟੇ ਖਾਨੇ ਬਣਾਓ—ਪੁਰਸ਼, ਮਹਿਲਾਵਾਂ, ਜੋੜੇ, ਪੀੜ੍ਹੀਆਂ—ਅਤੇ ਪਹਿਲੇ ਗਲਤ ਭਾਗ ’ਤੇ ਵਿਕਲਪ ਕੱਟ ਦਿਓ।");
  }
}
