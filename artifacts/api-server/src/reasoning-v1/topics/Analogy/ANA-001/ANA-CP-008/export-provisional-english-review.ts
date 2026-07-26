import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  renderAllDirectEnglishPrototypes,
  renderAllOddPairEnglishPrototypes,
} from "./provisional-language-templates.en";
import { renderMixedToken } from "./foundation/mixed-token";

const directory = dirname(fileURLToPath(import.meta.url));
const reviewDirectory = join(directory, "review-artifacts");
const markdownPath = join(reviewDirectory, "ana-cp-008-provisional-english-review.md");
const jsonPath = join(reviewDirectory, "ana-cp-008-provisional-english-review.json");

mkdirSync(reviewDirectory, { recursive: true });

const direct = renderAllDirectEnglishPrototypes();
const odd = renderAllOddPairEnglishPrototypes();

const markdown: string[] = [
  "# ANA-CP-008 Provisional English Review",
  "",
  "Status: NON-QL EDITORIAL REVIEW ARTIFACT",
  "",
  `Candidate prototype families: ${ANA_CP008_ENGLISH_PROTOTYPES.length}`,
  `Direct-completion samples: ${direct.length}`,
  `Odd-pair samples: ${odd.length}`,
  "Permanent QL IDs allocated: 0",
  "",
  "> These samples are not publicly publishable. They are deterministic editorial prototypes generated from the provisional rule authority and independent solver.",
  "",
];

for (const prototype of ANA_CP008_ENGLISH_PROTOTYPES) {
  const directSample = direct.find((entry) => entry.prototypeId === prototype.prototypeId);
  const oddSample = odd.find((entry) => entry.prototypeId === prototype.prototypeId);
  if (!directSample || !oddSample) throw new Error(`Missing rendered review samples for ${prototype.prototypeId}.`);

  markdown.push(
    `## ${prototype.title}`,
    "",
    `**Prototype ID:** \`${prototype.prototypeId}\``,
    "",
    `**Solve contract:** ${prototype.solveContract}`,
    "",
    `**Token-order decision:** ${prototype.tokenOrderDecision}`,
    "",
    `**Source note:** ${prototype.sourceNote}`,
    "",
    "### Direct completion",
    "",
    directSample.stem,
    "",
    `**Correct answer:** ${renderMixedToken(directSample.correctAnswer)}`,
    "",
    `**Rule:** ${directSample.explanation.ruleStatement}`,
    "",
    `**Source:** ${directSample.explanation.sourceDemonstration}`,
    "",
    `**Target:** ${directSample.explanation.targetApplication}`,
    "",
    `**Conclusion:** ${directSample.explanation.conclusion}`,
    "",
    `**Trap note:** ${directSample.explanation.closestTrapRejection}`,
    "",
    "### Odd/incorrect pair selection",
    "",
    oddSample.stem,
    "",
    ...oddSample.options.map((option, index) =>
      `${String.fromCharCode(65 + index)}. ${renderMixedToken(option.input)} : ${renderMixedToken(option.output)}${index === oddSample.correctIndex ? " **✓ odd pair**" : ""}`,
    ),
    "",
    `**Common rule:** ${oddSample.explanation.commonRule}`,
    "",
    ...oddSample.explanation.validPairDemonstrations.flatMap((demonstration, index) => [
      `**Valid pair ${index + 1}:** ${demonstration}`,
      "",
    ]),
    `**Odd-pair rejection:** ${oddSample.explanation.oddPairRejection}`,
    "",
    `**Conclusion:** ${oddSample.explanation.conclusion}`,
    "",
    "---",
    "",
  );
}

const reviewPayload = {
  status: "NON_QL_EDITORIAL_REVIEW",
  publiclyPublishable: false,
  permanentQlIdsAllocated: 0,
  prototypeFamilyCount: ANA_CP008_ENGLISH_PROTOTYPES.length,
  directSampleCount: direct.length,
  oddPairSampleCount: odd.length,
  prototypes: ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) => ({
    definition: prototype,
    direct: direct.find((entry) => entry.prototypeId === prototype.prototypeId),
    oddPair: odd.find((entry) => entry.prototypeId === prototype.prototypeId),
  })),
};

writeFileSync(markdownPath, markdown.join("\n"), "utf8");
writeFileSync(jsonPath, JSON.stringify(reviewPayload, null, 2) + "\n", "utf8");

console.log("ANA-CP-008 provisional English review exported.", {
  markdownPath,
  jsonPath,
  prototypeFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  directSamples: direct.length,
  oddPairSamples: odd.length,
});
