import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ANA_CP008_ENGLISH_PROTOTYPES } from "./provisional-language-templates.en";
import {
  renderAllLocalizedDirectPrototypes,
  renderAllLocalizedOddPairPrototypes,
  type ProvisionalMixedLocale,
} from "./provisional-language-templates.localized";
import { renderMixedToken } from "./foundation/mixed-token";

const directory = dirname(fileURLToPath(import.meta.url));
const reviewDirectory = join(directory, "review-artifacts");
const AVOIDABLE_PUNJABI_REVIEW_TERMS = /ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਸਰੋਤ|ਸੁਤੰਤਰ|ਵਰਣਮਾਲਾ-ਚਾਲ|ਗਿਣਤੀ-ਪਹਿਲਾਂ|ਪ੍ਰੋਟੋਟਾਈਪ|ਸਿੱਧੀ ਪੂਰਤੀ|ਲਕਸ਼ ਜੋੜਾ|ਸਾਂਝਾ ਨਿਯਮ|Latin script/;
mkdirSync(reviewDirectory, { recursive: true });

const localeConfig: Readonly<Record<ProvisionalMixedLocale, {
  fileName: string;
  title: string;
  status: string;
  overview: {
    families: string;
    directSamples: string;
    oddSamples: string;
    permanentQlIds: string;
    tokenNote: string;
  };
  labels: {
    prototype: string;
    direct: string;
    answer: string;
    rule: string;
    source: string;
    target: string;
    conclusion: string;
    trap: string;
    odd: string;
    commonRule: string;
    validPair: string;
    rejection: string;
  };
}>> = {
  "hi-IN": {
    fileName: "ana-cp-008-provisional-hindi-review.md",
    title: "ANA-CP-008 अस्थायी हिंदी समीक्षा",
    status: "स्थिति: गैर-QL संपादकीय समीक्षा सामग्री",
    overview: {
      families: "प्रोटोटाइप परिवार",
      directSamples: "प्रत्यक्ष पूर्ति नमूने",
      oddSamples: "असंगत युग्म नमूने",
      permanentQlIds: "स्थायी QL ID",
      tokenNote: "सभी अक्षर-संख्या पद जानबूझकर Latin script में सुरक्षित रखे गए हैं।",
    },
    labels: {
      prototype: "प्रोटोटाइप",
      direct: "प्रत्यक्ष पूर्ति",
      answer: "सही उत्तर",
      rule: "नियम",
      source: "पहला युग्म",
      target: "लक्ष्य युग्म",
      conclusion: "निष्कर्ष",
      trap: "निकटतम गलती",
      odd: "असंगत युग्म चयन",
      commonRule: "सामान्य नियम",
      validPair: "सही युग्म",
      rejection: "असंगत युग्म की जाँच",
    },
  },
  "pa-IN": {
    fileName: "ana-cp-008-provisional-punjabi-review.md",
    title: "ANA-CP-008 ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਸਮੀਖਿਆ",
    status: "ਸਥਿਤੀ: ਸਿਰਫ਼ ਭਾਸ਼ਾਈ ਸਮੀਖਿਆ ਲਈ; ਹਾਲੇ ਕੋਈ ਪੱਕਾ QL ਨਹੀਂ ਬਣਾਇਆ ਗਿਆ",
    overview: {
      families: "ਨਿਯਮਾਂ ਦੀਆਂ ਕਿਸਮਾਂ",
      directSamples: "ਖਾਲੀ ਥਾਂ ਵਾਲੇ ਸਵਾਲ",
      oddSamples: "ਵੱਖਰਾ ਜੋੜਾ ਚੁਣਨ ਵਾਲੇ ਸਵਾਲ",
      permanentQlIds: "ਪੱਕੇ QL ID",
      tokenNote: "ਸਵਾਲਾਂ ਦੇ ਅੱਖਰ ਅਤੇ ਗਿਣਤੀਆਂ ਮੂਲ ਰੂਪ ਵਿੱਚ ਹੀ ਰੱਖੀਆਂ ਗਈਆਂ ਹਨ।",
    },
    labels: {
      prototype: "ਨਿਯਮ ਦੀ ਕਿਸਮ",
      direct: "ਖਾਲੀ ਥਾਂ ਵਾਲਾ ਸਵਾਲ",
      answer: "ਸਹੀ ਜਵਾਬ",
      rule: "ਲਾਗੂ ਨਿਯਮ",
      source: "ਪਹਿਲੇ ਜੋੜੇ ਉੱਤੇ ਨਿਯਮ",
      target: "ਦੂਜੇ ਜੋੜੇ ਉੱਤੇ ਨਿਯਮ",
      conclusion: "ਅੰਤਿਮ ਜਵਾਬ",
      trap: "ਆਮ ਗਲਤੀ",
      odd: "ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ",
      commonRule: "ਬਾਕੀ ਤਿੰਨਾਂ ਲਈ ਨਿਯਮ",
      validPair: "ਨਿਯਮ ਨਾਲ ਬਣਿਆ ਜੋੜਾ",
      rejection: "ਵੱਖਰੇ ਜੋੜੇ ਦੀ ਜਾਂਚ",
    },
  },
};

const payload: Record<string, unknown> = {
  status: "NON_QL_LOCALIZED_EDITORIAL_REVIEW",
  publiclyPublishable: false,
  permanentQlIdsAllocated: 0,
  prototypeFamilyCount: ANA_CP008_ENGLISH_PROTOTYPES.length,
  locales: {},
};

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const config = localeConfig[locale];
  const direct = renderAllLocalizedDirectPrototypes(locale);
  const odd = renderAllLocalizedOddPairPrototypes(locale);
  const lines: string[] = [
    `# ${config.title}`,
    "",
    config.status,
    "",
    `${config.overview.families}: ${ANA_CP008_ENGLISH_PROTOTYPES.length}`,
    `${config.overview.directSamples}: ${direct.length}`,
    `${config.overview.oddSamples}: ${odd.length}`,
    `${config.overview.permanentQlIds}: 0`,
    "",
    `> ${config.overview.tokenNote}`,
    "",
  ];

  for (const prototype of ANA_CP008_ENGLISH_PROTOTYPES) {
    const directSample = direct.find((entry) => entry.prototypeId === prototype.prototypeId);
    const oddSample = odd.find((entry) => entry.prototypeId === prototype.prototypeId);
    if (!directSample || !oddSample) throw new Error(`Missing localized review sample for ${locale} ${prototype.prototypeId}.`);

    lines.push(
      `## ${config.labels.prototype}: ${prototype.prototypeId}`,
      "",
      `### ${config.labels.direct}`,
      "",
      directSample.stem,
      "",
      `**${config.labels.answer}:** ${renderMixedToken(directSample.correctAnswer)}`,
      "",
      `**${config.labels.rule}:** ${directSample.explanation.ruleStatement}`,
      "",
      `**${config.labels.source}:** ${directSample.explanation.sourceDemonstration}`,
      "",
      `**${config.labels.target}:** ${directSample.explanation.targetApplication}`,
      "",
      `**${config.labels.conclusion}:** ${directSample.explanation.conclusion}`,
      "",
      `**${config.labels.trap}:** ${directSample.explanation.closestTrapRejection}`,
      "",
      `### ${config.labels.odd}`,
      "",
      oddSample.stem,
      "",
      ...oddSample.options.map((option, index) =>
        `${String.fromCharCode(65 + index)}. ${renderMixedToken(option.input)} : ${renderMixedToken(option.output)}${index === oddSample.correctIndex ? " **✓**" : ""}`,
      ),
      "",
      `**${config.labels.commonRule}:** ${oddSample.explanation.commonRule}`,
      "",
      ...oddSample.explanation.validPairDemonstrations.flatMap((text, index) => [
        `**${config.labels.validPair} ${index + 1}:** ${text}`,
        "",
      ]),
      `**${config.labels.rejection}:** ${oddSample.explanation.oddPairRejection}`,
      "",
      `**${config.labels.conclusion}:** ${oddSample.explanation.conclusion}`,
      "",
      "---",
      "",
    );
  }

  const reviewText = lines.join("\n");
  if (locale === "pa-IN" && AVOIDABLE_PUNJABI_REVIEW_TERMS.test(reviewText)) {
    throw new Error("Punjabi review artifact contains avoidable textbook-style wording.");
  }
  writeFileSync(join(reviewDirectory, config.fileName), reviewText, "utf8");
  (payload.locales as Record<string, unknown>)[locale] = { direct, oddPair: odd };
}

writeFileSync(
  join(reviewDirectory, "ana-cp-008-provisional-localized-review.json"),
  JSON.stringify(payload, null, 2) + "\n",
  "utf8",
);

console.log("ANA-CP-008 Hindi/Punjabi review exported.", {
  prototypeFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  directSamples: ANA_CP008_ENGLISH_PROTOTYPES.length * 2,
  oddPairSamples: ANA_CP008_ENGLISH_PROTOTYPES.length * 2,
  permanentQlIdsAllocated: 0,
});
