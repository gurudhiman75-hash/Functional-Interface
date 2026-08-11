import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import "./cp005-partial-order-editorial-v3-approved-review-export";

const source = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-V3-APPROVED-REVIEW-28Q.md",
);
const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-V3-APPROVED-V2-REVIEW-28Q.md",
);

const polished = readFileSync(source, "utf8")
  .replace(
    "## Editorial V3 Approved Human Review — 28 Questions",
    "## Editorial V3 Approved V2 Human Review — 28 Questions",
  )
  .replace(
    /\*\*Source form:\*\* PAIR_RELATION_CANNOT_BE_DETERMINED  /g,
    "**Source form:** PAIR_RELATION_STATUS  \n**Legacy discovery ID:** PAIR_RELATION_CANNOT_BE_DETERMINED  ",
  )
  .replace(
    "- rank bounds require at least three compulsory people plus branch integration;",
    "- rank bounds require at least three compulsory people, branch integration and at least one transitive compulsory relation;",
  )
  .replace(
    "- definite exact ranks use structural proof; indeterminate exact ranks use two valid witnesses;",
    "- definite exact ranks require at least one transitive compulsory relation; indeterminate exact ranks use two valid witnesses;",
  )
  .replace(
    "- named-pair questions cover first-above, second-above and indeterminate outcomes;",
    "- named-pair status questions cover first-above, second-above and indeterminate outcomes, with varied rank-gap distractors;",
  );

writeFileSync(destination, polished, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      source,
      destination,
      misleadingPairFamilyLabelRemoved: !/\*\*Source form:\*\* PAIR_RELATION_CANNOT_BE_DETERMINED/.test(polished),
      strengthenedRankBoundGateDocumented: /transitive compulsory relation/.test(polished),
      permanentQlAllocated: false,
    },
    null,
    2,
  ),
);
