import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
  generateMenCp011InverseReviewBatch,
} from "./inverse-thickness-length";

const review = generateMenCp011InverseReviewBatch();
const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const serialisable = JSON.parse(
  JSON.stringify(
    {
      meta: {
        sourceAuthority: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
        inverseAuthority: MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY,
        generatedAt: new Date().toISOString(),
        permanentQlCount: 0,
        publicationEligible: false,
      },
      audit: review.audit,
      records: review.records,
    },
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
  ),
);

const jsonPath = resolve(
  outputDirectory,
  "men-cp011-inverse-thickness-length-wave01-review.json",
);
writeFileSync(jsonPath, `${JSON.stringify(serialisable, null, 2)}\n`, "utf8");

const markdown = `# MEN-CP-011 Inverse Thickness and Length — Wave 01 Review

- Authority: \`${MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY}\`
- Source commit: \`${serialisable.meta.sourceAuthority}\`
- Runtime prototypes: **${review.audit.prototypeCount}**
- Review records: **${review.audit.recordCount}**
- Unique exact stems: **${review.audit.exactStemCount}**
- Unique stem-option packages: **${review.audit.exactQuestionOptionCount}**
- Distinct physical states: **${review.audit.uniquePhysicalStateCount}**
- Maximum normalized stem repetition: **${review.audit.maximumNormalizedStemRepetition}**
- Answer positions: **A${review.audit.answerPositionCounts.A} B${review.audit.answerPositionCounts.B} C${review.audit.answerPositionCounts.C} D${review.audit.answerPositionCounts.D}**
- Pi policies: **exact π ${review.audit.piPolicyCounts.EXACT_PI}; 22/7 ${review.audit.piPolicyCounts.PI_22_OVER_7}**
- Permanent QLs: **0**
- Publication eligible: **false**

## Implemented inverse families

1. \`MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME\`
   - recover the inner radius from \(V=\pi h(R^2-r^2)\);
   - then calculate \(t=R-r\).
2. \`MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME\`
   - calculate \(h=V/[\pi(R^2-r^2)]\).

## Review safeguards

- target values are hidden in prompt diagrams and revealed only in solution diagrams;
- radius guides are connected to centre \(O\);
- numeric labels are detached from dimension lines;
- mixed-unit conversion is shown explicitly;
- misconception codes remain admin-only;
- all production and Question Studio surfaces remain locked.

## Active blockers

${review.audit.blockers.map((blocker) => `- \`${blocker}\``).join("\n")}
`;

const markdownPath = resolve(
  outputDirectory,
  "men-cp011-inverse-thickness-length-wave01-review.md",
);
writeFileSync(markdownPath, markdown, "utf8");

const log = [
  `authority=${MEN_CP011_INVERSE_THICKNESS_LENGTH_AUTHORITY}`,
  `source=${serialisable.meta.sourceAuthority}`,
  `records=${review.audit.recordCount}`,
  `prototypes=${review.audit.prototypeCount}`,
  `unique_stems=${review.audit.exactStemCount}`,
  `unique_states=${review.audit.uniquePhysicalStateCount}`,
  `answer_positions=${JSON.stringify(review.audit.answerPositionCounts)}`,
  `measurement_profiles=${JSON.stringify(review.audit.measurementProfileCounts)}`,
  `pi_policies=${JSON.stringify(review.audit.piPolicyCounts)}`,
  "permanent_qls=0",
  "publication_eligible=false",
].join("\n");

const logPath = resolve(
  outputDirectory,
  "men-cp011-inverse-thickness-length-wave01-review.log",
);
writeFileSync(logPath, `${log}\n`, "utf8");

console.log(markdown);
console.log(`Wrote ${jsonPath}`);
console.log(`Wrote ${markdownPath}`);
console.log(`Wrote ${logPath}`);
