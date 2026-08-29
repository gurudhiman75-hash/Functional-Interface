import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { listQuantV4Packages } from "../../../../../generation-engine";
import {
  GEO_001_QUESTION_STUDIO_CP_IDS,
  GEO_001_QUESTION_STUDIO_QL_IDS,
  GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1,
} from "../question-studio-standard-integration";
import { GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1 } from "./geometry-permanent-multilingual-freeze-proof-v1";

const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/geometry-question-studio-standard-integration-v1",
);
mkdirSync(outputDirectory, { recursive: true });

const packageCard = listQuantV4Packages().find((pkg) => pkg.packageId === "GEO-001");
if (!packageCard) throw new Error("GEO-001 is missing from the normal Quant Question Studio package registry.");

const evidence = Object.freeze({
  status: "GEOMETRY_NORMAL_QUESTION_STUDIO_INTEGRATION_V1_EVIDENCE",
  authority: GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1,
  sourceMultilingualFreezeProof: GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1,
  normalPackageCard: packageCard,
  permanentQlIds: GEO_001_QUESTION_STUDIO_QL_IDS,
  cpIds: GEO_001_QUESTION_STUDIO_CP_IDS,
});

writeFileSync(
  resolve(outputDirectory, "geometry-question-studio-standard-integration-v1.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);

const markdown = [
  "# ExamTree Geometry — Normal Question Studio Integration V1",
  "",
  `**Package:** GEO-001`,
  `**Permanent QLs:** ${GEO_001_QUESTION_STUDIO_QL_IDS.length}`,
  `**Checkpoints:** ${GEO_001_QUESTION_STUDIO_CP_IDS.length}`,
  `**Languages:** ${GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.supportedLanguages.join(", ")}`,
  `**Source multilingual freeze artifact:** ${GEO_PERMANENT_MULTILINGUAL_FREEZE_PROOF_V1.proof.artifactId}`,
  "",
  "Geometry is registered in the same quant-v4 package list and generateQuestion dispatcher used by the normal admin Question Studio workflow.",
  "",
  "Question Studio discoverability/generation is active. Question Bank conversion, test eligibility and public publication remain locked by package metadata and the standard conversion guard.",
  "",
  `Post-proof next gate: **${GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.postProofNextGate}**.`,
  "",
].join("\n");

writeFileSync(
  resolve(outputDirectory, "geometry-question-studio-standard-integration-v1.md"),
  markdown,
);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_NORMAL_QUESTION_STUDIO_INTEGRATION_V1",
  packageId: "GEO-001",
  permanentQlCount: GEO_001_QUESTION_STUDIO_QL_IDS.length,
  cpCount: GEO_001_QUESTION_STUDIO_CP_IDS.length,
  languages: GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.supportedLanguages,
  questionStudioDiscoverable:
    GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.questionStudioDiscoverable,
  questionBankWritable:
    GEO_001_QUESTION_STUDIO_STANDARD_INTEGRATION_V1.lifecycle.questionBankWritable,
  outputDirectory,
}));
