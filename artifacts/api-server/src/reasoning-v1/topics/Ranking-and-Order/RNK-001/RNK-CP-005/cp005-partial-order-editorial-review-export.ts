import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import "./cp005-partial-order-editorial-review-export-v2";

const destination = resolve(
  process.cwd(),
  "artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/RNK-CP-005/generated/RNK-CP-005-PARTIAL-ORDER-EDITORIAL-REVIEW-28Q.md",
);

const polished = readFileSync(destination, "utf8").replace(
  /([A-Z][a-z]+) cannot be placed below the people who are necessarily behind \1\./g,
  "The statements limit how far $1 can move down the ranking.",
);

writeFileSync(destination, polished, "utf8");
