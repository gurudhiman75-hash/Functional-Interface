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
mkdirSync(reviewDirectory, { recursive: true });

const localeConfig: Readonly<Record<ProvisionalMixedLocale, {
  fileName: string;
  title: string;
  status: string;
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
    title: "ANA-CP-008 ਆਰਜ਼ੀ ਪੰਜਾਬੀ ਸਮੀਖਿਆ",
    status: "ਸਥਿਤੀ: ਗੈਰ-QL ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਸਮੱਗਰੀ",
    labels: {
      prototype: "ਪ੍ਰੋਟੋਟਾਈਪ",
      direct: "ਸਿੱਧੀ ਪੂਰਤੀ",
      answer: "ਸਹੀ ਉੱਤਰ",
      rule: "ਨਿਯਮ",
      source: "ਪਹਿਲਾ ਜੋੜਾ",
      target: "ਲਕਸ਼ ਜੋੜਾ",
      conclusion: "ਨਤੀਜਾ",
      trap: "ਸਭ ਤੋਂ ਨੇੜਲੀ ਗਲਤੀ",
      odd: "ਵੱਖਰਾ ਜੋੜਾ ਚੋਣ",
      commonRule: "ਸਾਂਝਾ ਨਿਯਮ",
      validPair: "ਸਹੀ ਜੋੜਾ",
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
    `प्रोटोटाइप / ਪ੍ਰੋਟੋਟਾਈਪ परिवार: ${ANA_CP008_ENGLISH_PROTOTYPES.length}`,
    `प्रत्यक्ष / ਸਿੱਧੇ नमूने: ${direct.length}`,
    `असंगत / ਵੱਖਰੇ युग्म नमूने: ${odd.length}`,
    "स्थायी / ਪੱਕੇ QL ID: 0",
    "",
    "> सभी अक्षर-संख्या पद Latin script में जानबूझकर सुरक्षित रखे गए हैं। / ਸਾਰੇ ਅੱਖਰ-ਗਿਣਤੀ ਪਦ ਜਾਣਬੁੱਝ ਕੇ Latin script ਵਿੱਚ ਰੱਖੇ ਗਏ ਹਨ।",
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

  writeFileSync(join(reviewDirectory, config.fileName), lines.join("\n"), "utf8");
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
