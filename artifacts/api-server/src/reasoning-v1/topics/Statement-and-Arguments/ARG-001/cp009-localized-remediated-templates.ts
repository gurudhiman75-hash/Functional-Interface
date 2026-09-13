import { ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE } from "./cp004-localized-templates.ts";
import type { ArgCp004LocalizedLocale, ArgCp004LocalizedTemplate } from "./cp004-localization-types.ts";
import { ARG_QL_IDS, type ArgQlId } from "./types.ts";

export const ARG_CP009_LOCALIZATION_AUTHORITY = "ARG_CP009_TRILINGUAL_EDITORIAL_REMEDIATION_V1" as const;

function replaceArguments(
  template: ArgCp004LocalizedTemplate,
  firstText?: string,
  secondText?: string,
): ArgCp004LocalizedTemplate["arguments"] {
  return Object.freeze([
    Object.freeze({ ...template.arguments[0], ...(firstText === undefined ? {} : { text: firstText }) }),
    Object.freeze({ ...template.arguments[1], ...(secondText === undefined ? {} : { text: secondText }) }),
  ]) as ArgCp004LocalizedTemplate["arguments"];
}

function replaceDimension(
  template: ArgCp004LocalizedTemplate,
  index: 0 | 1 | 2 | 3,
  values: readonly [string, string, string, string],
): ArgCp004LocalizedTemplate["dimensions"] {
  const dimensions = [
    template.dimensions[0],
    template.dimensions[1],
    template.dimensions[2],
    template.dimensions[3],
  ] as [readonly string[], readonly string[], readonly string[], readonly string[]];
  dimensions[index] = Object.freeze([...values]);
  return Object.freeze(dimensions) as ArgCp004LocalizedTemplate["dimensions"];
}

function patchHindi(template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  switch (template.id) {
    case "ARG-CP003-QL001-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "हाँ। {b} पर {a} चलाने वालों को {c} हो सकती है, इसलिए {d} का उपयोग एक महत्वपूर्ण सुरक्षा जोखिम को सीधे संबोधित कर सकता है।",
        ),
      });

    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "हाँ। {a} पर {b} छापने से {d} के दौरान उठने वाले सभी {c} तुरंत हल होने की गारंटी मिल जाएगी।",
        ),
      });

    case "ARG-CP003-QL002-T05":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "आगे की धोखाधड़ी गतिविधि",
          "अतिरिक्त खाता दुरुपयोग",
          "खाता विवरण पर नियंत्रण का नुकसान",
          "आगे की अनधिकृत प्रोफाइल गतिविधि",
        ]),
        arguments: replaceArguments(
          template,
          "हाँ। {c} के बाद {b} से अलर्ट ग्राहक को {a} में अनधिकृत बदलाव जल्दी पहचानने और {d} को सीमित करने में मदद कर सकता है।",
          "नहीं। {b} से अलर्ट भेजे जाने पर भी {c} हुआ है, इसलिए {a} के बारे में अलर्ट {d} कम करने में कभी मदद नहीं कर सकते।",
        ),
      });

    case "ARG-CP003-QL002-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "शिक्षण समय",
          "आराम और पुनर्प्राप्ति का समय",
          "सीखने की व्यापकता",
          "चर्चा-आधारित सीखने का समय",
        ]),
      });

    case "ARG-CP003-QL003-T04":
      return Object.freeze({
        ...template,
        statement: "क्या सभी {a} को {c} पूरी तरह {b} पर चला जाना चाहिए?",
      });

    case "ARG-CP003-QL004-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "नहीं। {c} में से जो छात्र {d} {b} लेगा, वह {a} में अतिरिक्त सहायता पर स्थायी रूप से निर्भर हो जाएगा।",
        ),
      });

    case "ARG-CP003-QL004-T03":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "नब्बे मिनट की सीमा",
          "एक घंटे की सीमा",
          "एक निर्धारित लचीलेपन की सीमा",
          "सीमित दैनिक सीमा",
        ]),
      });

    case "ARG-CP003-QL004-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 0, [
          "मूल डिजिटल साक्षरता",
          "साइबर सुरक्षा",
          "वित्तीय साक्षरता",
          "करियर योजना",
        ]),
        statement: "क्या {b} को {a} पर {d} देना चाहिए?",
        arguments: replaceArguments(
          template,
          "हाँ। {a} पर {d} में भाग लेने वाला कोई भी व्यक्ति फिर कभी {c} का सामना नहीं करेगा।",
          "नहीं। {a} पर {d} उपलब्ध कराने से मौजूदा सेवाएँ अंततः पूरी तरह अनावश्यक हो जाएँगी क्योंकि {c} समाप्त हो जाएँगी।",
        ),
      });

    case "ARG-CP003-QL004-T06":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "24-घंटे का रिमाइंडर",
          "तीन-दिन का रिमाइंडर",
          "स्पष्ट नवीनीकरण अलर्ट",
          "अग्रिम बिलिंग सूचना",
        ]),
      });

    case "ARG-CP003-QL004-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "नहीं। क्योंकि {a}, {c} के लिए उपयोगी हो सकता है, इसलिए संस्था को {d} रोकने के लिए भी इसे कभी नियंत्रित नहीं करना चाहिए।",
        ),
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "पहुंच-संबंधी जरूरतों वाले उपयोगकर्ताओं",
          "सहायक माध्यमों पर निर्भर उपयोगकर्ताओं",
          "मानक इंटरफेस में बाधाओं का सामना करने वाले उपयोगकर्ताओं",
          "सुलभ डिजिटल उपयोग की आवश्यकता वाले उपयोगकर्ताओं",
        ]),
      });

    case "ARG-CP003-QL005-T08":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 1, [
          "कर्मचारियों",
          "प्रशिक्षुओं",
          "कॉन्ट्रैक्ट स्टाफ",
          "स्वयंसेवकों",
        ]),
        arguments: replaceArguments(
          template,
          undefined,
          "नहीं। जो भी अपने {a} को {c} से बाहर रखना चाहता है, वह जरूर कुछ छिपा रहा है और इसलिए {d} में योगदान नहीं कर सकता।",
        ),
      });

    case "ARG-CP003-QL006-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "प्रभावित केंद्र की जाँच",
          "प्रमाण और दायरे का सत्यापन",
          "प्रभावित सत्रों को अलग करना",
          "अनुपातिक सुधार प्रक्रिया",
        ]),
      });

    case "ARG-CP003-QL006-T05":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "हाँ। यदि {d} की पर्याप्त व्यवस्था हो, तो {c} के दौरान {b} पर {a} सीमित करने से उस मार्ग की दुर्लभ सड़क जगह की मांग घट सकती है।",
          "नहीं। {d} की पर्याप्त व्यवस्था होने पर भी {c} में {b} पर {a} प्रतिबंधित करने से पूरे शहर में स्थायी जाम निश्चित रूप से हो जाएगा।",
        ),
      });

    case "ARG-CP003-QL006-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 1, [
          "छोटा प्रति-वस्तु शुल्क",
          "दिखाई देने वाला पर्यावरण शुल्क",
          "एकल-उपयोग अधिभार",
          "उपभोग-आधारित शुल्क",
        ]),
      });

    default:
      return template;
  }
}

function patchPunjabi(template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  switch (template.id) {
    case "ARG-CP003-QL001-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {b} ਉੱਤੇ {a} ਚਲਾਉਣ ਵਾਲਿਆਂ ਨੂੰ {c} ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ {d} ਦੀ ਵਰਤੋਂ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੁਰੱਖਿਆ ਜੋਖਮ ਨੂੰ ਸਿੱਧਾ ਸੰਬੋਧ ਸਕਦੀ ਹੈ।",
        ),
      });

    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {a} ਉੱਤੇ {b} ਛਾਪਣ ਨਾਲ {d} ਦੌਰਾਨ ਉੱਠਣ ਵਾਲੇ ਸਾਰੇ {c} ਤੁਰੰਤ ਹੱਲ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ।",
        ),
      });

    case "ARG-CP003-QL002-T05":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "ਅਗਲੀ ਧੋਖਾਧੜੀ ਗਤੀਵਿਧੀ",
          "ਵਾਧੂ ਖਾਤਾ ਦੁਰਵਰਤੋਂ",
          "ਖਾਤਾ ਵੇਰਵਿਆਂ ਉੱਤੇ ਕਾਬੂ ਦਾ ਨੁਕਸਾਨ",
          "ਅਗਲੀ ਗੈਰ-ਅਧਿਕਾਰਤ ਪ੍ਰੋਫਾਈਲ ਗਤੀਵਿਧੀ",
        ]),
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {c} ਤੋਂ ਬਾਅਦ {b} ਰਾਹੀਂ ਅਲਰਟ ਗਾਹਕ ਨੂੰ {a} ਵਿੱਚ ਗੈਰ-ਅਧਿਕਾਰਤ ਬਦਲਾਅ ਜਲਦੀ ਪਛਾਣਣ ਅਤੇ {d} ਨੂੰ ਸੀਮਿਤ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ।",
          "ਨਹੀਂ। {b} ਰਾਹੀਂ ਅਲਰਟ ਆਉਣ ਦੇ ਬਾਵਜੂਦ {c} ਹੋਇਆ ਹੈ, ਇਸ ਲਈ {a} ਬਾਰੇ ਅਲਰਟ {d} ਘੱਟ ਕਰਨ ਵਿੱਚ ਕਦੇ ਮਦਦ ਨਹੀਂ ਕਰ ਸਕਦੇ।",
        ),
      });

    case "ARG-CP003-QL002-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "ਪੜ੍ਹਾਉਣ ਦਾ ਸਮਾਂ",
          "ਆਰਾਮ ਅਤੇ ਸੁਧਾਰ ਲਈ ਸਮਾਂ",
          "ਸਿੱਖਣ ਦੀ ਵਿਸ਼ਾਲਤਾ",
          "ਚਰਚਾ-ਅਧਾਰਿਤ ਸਿੱਖਣ ਦਾ ਸਮਾਂ",
        ]),
      });

    case "ARG-CP003-QL003-T04":
      return Object.freeze({
        ...template,
        statement: "ਕੀ ਸਾਰੀਆਂ {a} ਨੂੰ {c} ਪੂਰੀ ਤਰ੍ਹਾਂ {b} ਉੱਤੇ ਲਿਆਂਦਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
      });

    case "ARG-CP003-QL004-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "ਨਹੀਂ। {c} ਵਿੱਚੋਂ ਜੋ ਵਿਦਿਆਰਥੀ {d} {b} ਲਵੇਗਾ, ਉਹ {a} ਵਿੱਚ ਵਾਧੂ ਮਦਦ ਉੱਤੇ ਸਦਾ ਲਈ ਨਿਰਭਰ ਹੋ ਜਾਵੇਗਾ।",
        ),
      });

    case "ARG-CP003-QL004-T03":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "ਨੱਬੇ ਮਿੰਟ ਦੀ ਹੱਦ",
          "ਇੱਕ ਘੰਟੇ ਦੀ ਹੱਦ",
          "ਇੱਕ ਨਿਰਧਾਰਤ ਲਚਕੀਲਾਪਣ ਹੱਦ",
          "ਸੀਮਿਤ ਰੋਜ਼ਾਨਾ ਹੱਦ",
        ]),
      });

    case "ARG-CP003-QL004-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 0, [
          "ਮੁੱਢਲੀ ਡਿਜ਼ਿਟਲ ਸਾਖਰਤਾ",
          "ਸਾਇਬਰ ਸੁਰੱਖਿਆ",
          "ਵਿੱਤੀ ਸਾਖਰਤਾ",
          "ਕਰੀਅਰ ਯੋਜਨਾ",
        ]),
        statement: "ਕੀ {b} ਨੂੰ {a} ਬਾਰੇ {d} ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?",
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {a} ਬਾਰੇ {d} ਵਿੱਚ ਹਿੱਸਾ ਲੈਣ ਵਾਲਾ ਕੋਈ ਵੀ ਵਿਅਕਤੀ ਫਿਰ ਕਦੇ {c} ਦਾ ਸਾਹਮਣਾ ਨਹੀਂ ਕਰੇਗਾ।",
          "ਨਹੀਂ। {a} ਬਾਰੇ {d} ਦੇਣ ਨਾਲ ਮੌਜੂਦਾ ਸੇਵਾਵਾਂ ਆਖ਼ਿਰਕਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੇਲੋੜੀਆਂ ਹੋ ਜਾਣਗੀਆਂ ਕਿਉਂਕਿ {c} ਖਤਮ ਹੋ ਜਾਣਗੀਆਂ।",
        ),
      });

    case "ARG-CP003-QL004-T06":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "24-ਘੰਟਿਆਂ ਦਾ ਰਿਮਾਈਂਡਰ",
          "ਤਿੰਨ-ਦਿਨਾਂ ਦਾ ਰਿਮਾਈਂਡਰ",
          "ਸਪਸ਼ਟ ਨਵੀਨੀਕਰਨ ਅਲਰਟ",
          "ਅਗਾਊਂ ਬਿਲਿੰਗ ਸੂਚਨਾ",
        ]),
      });

    case "ARG-CP003-QL004-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "ਨਹੀਂ। ਕਿਉਂਕਿ {a}, {c} ਲਈ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਸੰਸਥਾ ਨੂੰ {d} ਰੋਕਣ ਲਈ ਵੀ ਇਸ ਨੂੰ ਕਦੇ ਨਿਯੰਤਰਿਤ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ।",
        ),
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "ਪਹੁੰਚ-ਸਬੰਧੀ ਲੋੜਾਂ ਵਾਲੇ ਵਰਤੋਂਕਾਰਾਂ",
          "ਸਹਾਇਕ ਮਾਧਿਅਮਾਂ ਉੱਤੇ ਨਿਰਭਰ ਵਰਤੋਂਕਾਰਾਂ",
          "ਮਿਆਰੀ ਇੰਟਰਫੇਸ ਵਿੱਚ ਰੁਕਾਵਟਾਂ ਦਾ ਸਾਹਮਣਾ ਕਰਨ ਵਾਲੇ ਵਰਤੋਂਕਾਰਾਂ",
          "ਪਹੁੰਚਯੋਗ ਡਿਜ਼ਿਟਲ ਵਰਤੋਂ ਦੀ ਲੋੜ ਵਾਲੇ ਵਰਤੋਂਕਾਰਾਂ",
        ]),
      });

    case "ARG-CP003-QL005-T08":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 1, [
          "ਕਰਮਚਾਰੀਆਂ",
          "ਟ੍ਰੇਨੀਜ਼",
          "ਕਾਂਟ੍ਰੈਕਟ ਸਟਾਫ",
          "ਸਵੈਸੇਵਕਾਂ",
        ]),
        arguments: replaceArguments(
          template,
          undefined,
          "ਨਹੀਂ। ਜੋ ਵੀ ਆਪਣੇ {a} ਨੂੰ {c} ਤੋਂ ਬਾਹਰ ਰੱਖਣਾ ਚਾਹੁੰਦਾ ਹੈ, ਉਹ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾ ਰਿਹਾ ਹੈ ਅਤੇ ਇਸ ਲਈ {d} ਵਿੱਚ ਯੋਗਦਾਨ ਨਹੀਂ ਦੇ ਸਕਦਾ।",
        ),
      });

    case "ARG-CP003-QL006-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "ਪ੍ਰਭਾਵਿਤ ਕੇਂਦਰ ਦੀ ਜਾਂਚ",
          "ਸਬੂਤ ਅਤੇ ਦਾਇਰੇ ਦੀ ਤਸਦੀਕ",
          "ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨਾਂ ਨੂੰ ਵੱਖ ਕਰਨਾ",
          "ਅਨੁਪਾਤਿਕ ਸੁਧਾਰ ਪ੍ਰਕਿਰਿਆ",
        ]),
      });

    case "ARG-CP003-QL006-T05":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "ਹਾਂ। ਜੇ {d} ਦੀ ਢੁੱਕਵੀਂ ਵਿਵਸਥਾ ਹੋਵੇ, ਤਾਂ {c} ਦੌਰਾਨ {b} ਉੱਤੇ {a} ਸੀਮਿਤ ਕਰਨ ਨਾਲ ਉਸ ਰਸਤੇ ਦੀ ਘੱਟ ਸੜਕ ਜਗ੍ਹਾ ਦੀ ਮੰਗ ਘਟ ਸਕਦੀ ਹੈ।",
          "ਨਹੀਂ। {d} ਦੀ ਢੁੱਕਵੀਂ ਵਿਵਸਥਾ ਹੋਣ ਦੇ ਬਾਵਜੂਦ {c} ਦੌਰਾਨ {b} ਉੱਤੇ {a} ਸੀਮਿਤ ਕਰਨ ਨਾਲ ਪੂਰੇ ਸ਼ਹਿਰ ਵਿੱਚ ਸਥਾਈ ਜਾਮ ਜ਼ਰੂਰ ਹੋ ਜਾਵੇਗਾ।",
        ),
      });

    case "ARG-CP003-QL006-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 1, [
          "ਛੋਟੀ ਪ੍ਰਤੀ-ਵਸਤੂ ਫੀਸ",
          "ਸਪਸ਼ਟ ਵਾਤਾਵਰਣ ਫੀਸ",
          "ਇੱਕ-ਵਾਰ ਵਰਤੋਂ ਸਰਚਾਰਜ",
          "ਖਪਤ-ਅਧਾਰਿਤ ਫੀਸ",
        ]),
      });

    default:
      return template;
  }
}

function buildLocale(locale: ArgCp004LocalizedLocale): Readonly<Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>> {
  const patch = locale === "hi-IN" ? patchHindi : patchPunjabi;
  return Object.freeze(
    ARG_QL_IDS.reduce<Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>>((result, qlId) => {
      result[qlId] = Object.freeze(ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[locale][qlId].map(patch));
      return result;
    }, {} as Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>),
  );
}

export const ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE = Object.freeze({
  "hi-IN": buildLocale("hi-IN"),
  "pa-IN": buildLocale("pa-IN"),
});

export function getArgCp009LocalizedTemplate(input: {
  readonly locale: ArgCp004LocalizedLocale;
  readonly qlId: ArgQlId;
  readonly templateId: string;
}): ArgCp004LocalizedTemplate {
  const found = ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE[input.locale][input.qlId]
    .find((template) => template.id === input.templateId);
  if (!found) throw new Error(`${input.locale}/${input.qlId}: missing CP009 localized template ${input.templateId}`);
  return found;
}
