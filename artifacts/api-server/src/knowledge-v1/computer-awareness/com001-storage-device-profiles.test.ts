import { strict as assert } from "node:assert";

import {
  COM001_STORAGE_DEVICE_PROFILES,
  auditCom001StorageProfiles,
  solveStorageProfileConstraints,
} from "./com001-storage-device-profiles";

const audit = auditCom001StorageProfiles();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.profileCount, 6);
assert.equal(audit.canonicalTapeSolveCount, 1);
assert.equal(
  COM001_STORAGE_DEVICE_PROFILES.every(
    (profile) => profile.review.status === "REVIEW_REQUIRED",
  ),
  true,
);

const tape = solveStorageProfileConstraints({
  medium: "magnetic",
  accessPattern: "sequential",
  removable: true,
  requiredRoles: ["backup", "archive"],
});
assert.deepEqual(tape.map((entry) => entry.label), ["Magnetic tape"]);

const rdx = solveStorageProfileConstraints({
  medium: "magnetic",
  accessPattern: "random",
  removable: true,
  requiredRoles: ["backup", "recovery"],
});
assert.deepEqual(rdx.map((entry) => entry.label), ["RDX removable disk"]);

const worm = solveStorageProfileConstraints({
  medium: "optical",
  removable: true,
  requiredRoles: ["archive", "write-once-retention"],
});
assert.deepEqual(worm.map((entry) => entry.label), ["WORM optical media"]);
