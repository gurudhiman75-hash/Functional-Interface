import assert from "node:assert/strict";

import { evaluateMasterPackPublication } from "./daily-master-pack-publication-policy";

const packs = ["en", "hi", "pa"].map((language) => ({ language, payloadSha256: `${language}-hash` }));
const base = { hasActiveApproval: true, alreadyPublished: false, approved: packs, current: packs };

assert.equal(evaluateMasterPackPublication(base).ready, true);
assert.equal(evaluateMasterPackPublication({ ...base, hasActiveApproval: false }).ready, false);
assert.equal(evaluateMasterPackPublication({ ...base, alreadyPublished: true }).ready, false);
assert.equal(evaluateMasterPackPublication({ ...base, current: packs.slice(0, 2) }).ready, false);
assert.match(
  evaluateMasterPackPublication({
    ...base,
    current: packs.map((pack) => pack.language === "pa" ? { ...pack, payloadSha256: "edited" } : pack),
  }).blockers.join(" "),
  /PA pack changed/,
);
console.log("daily master pack publication policy: ok");
