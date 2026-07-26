import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ENGLISH_SENTENCE_CODE_SCENARIOS } from "./datasets/scenarios.en";
import { instantiateEnglishSentenceCodeTopology } from "./language-instantiator.en";
import { SENTENCE_CODE_TOPOLOGY_KINDS } from "./topology-generator";

const outputDirectory = resolve(process.argv[2] ?? "cod-cp009-english-scenario-output");
mkdirSync(outputDirectory, { recursive: true });

const instances = ENGLISH_SENTENCE_CODE_SCENARIOS.map((scenario, index) =>
  instantiateEnglishSentenceCodeTopology(scenario.topologyKind, 10_000 + index, scenario.id),
);

writeFileSync(
  resolve(outputDirectory, "cod-cp009-english-scenarios.jsonl"),
  `${instances.map((instance) => JSON.stringify(instance)).join("\n")}\n`,
  "utf8",
);

const markdown: string[] = [
  "# COD-CP-009 — English Sentence Scenario Catalogue",
  "",
  "Status: language-data prototype only; no permanent QLs and no complete questions.",
  "",
  `Reviewed scenarios: ${instances.length}`,
  "",
];

for (const kind of SENTENCE_CODE_TOPOLOGY_KINDS) {
  markdown.push(`## ${kind}`, "");
  for (const instance of instances.filter((candidate) => candidate.topologyKind === kind)) {
    markdown.push(
      `### ${instance.scenarioId}`,
      "",
      `- Theme: ${instance.theme}`,
      `- Frame: ${instance.frameId}`,
      `- Abstract solution count: ${instance.reviewer.abstract.expectedSolutionCount}`,
      `- Topology fingerprint: \`${instance.reviewer.abstract.topologyFingerprint}\``,
      "",
      "| Statement | Natural English message | Displayed code words |",
      "|---|---|---|",
      ...[...instance.rows]
        .sort((left, right) => left.rowId.localeCompare(right.rowId))
        .map((row) => `| ${row.rowId} | ${row.sentence} | ${row.displayedCode} |`),
      "",
      `- Target word: **${instance.targetWord}**`,
      `- Reviewer target code: **${instance.targetDisplayToken}**`,
      ...(instance.phraseWords ? [
        `- Target phrase: **${instance.phraseWords.join(" ")}**`,
        `- Reviewer phrase-code set: **${instance.phraseDisplayTokens!.join(" ")}**`,
      ] : []),
      ...(instance.missingPresentation ? [
        `- Missing-token row: **${instance.missingPresentation.sentence}**`,
        `- Displayed incomplete code: **${instance.missingPresentation.displayedCodeWithBlank}**`,
        `- Reviewer missing token: **${instance.missingPresentation.correctDisplayToken}**`,
      ] : []),
      "",
    );
  }
}

writeFileSync(
  resolve(outputDirectory, "cod-cp009-english-scenario-catalogue.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

const summary = {
  checkpoint: "COD-CP-009",
  maturity: "ENGLISH_LANGUAGE_DATA_PROTOTYPE",
  permanentQlsCreated: 0,
  scenarios: instances.length,
  topologyCounts: Object.fromEntries(
    SENTENCE_CODE_TOPOLOGY_KINDS.map((kind) => [kind, instances.filter((instance) => instance.topologyKind === kind).length]),
  ),
  rows: instances.reduce((total, instance) => total + instance.rows.length, 0),
  missingPresentations: instances.filter((instance) => instance.missingPresentation).length,
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputDirectory, ...summary }, null, 2));
