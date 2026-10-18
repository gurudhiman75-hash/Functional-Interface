import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const name="scripts/restore-examtree-qs-oct18-backup-isolated.sh";
const sh=readFileSync(name,"utf8");
test("restore script parses correctly and is pinned to exactly one isolated database",()=>{
 const p=spawnSync("bash",["-n",name],{encoding:"utf8"});
 assert.equal(p.status,0,p.stderr);
 assert.match(sh,/TARGET_HOST=ep-dawn-scene-aty54zjw\.c-9\.us-east-1\.aws\.neon\.tech/);
 assert.match(sh,/TARGET_DB=examtree_qs_backup_restore_20261018/);
 assert.match(sh,/ARCHIVE=examtree-neon-daily-20261018T130740Z-localhost\.dump\.gpg/);
 assert.match(sh,/\[\[ "\$IDENTITY" == "\$TARGET_DB\|0" \]\]/);
 assert.match(sh,/PGHOST="\$TARGET_HOST"/);
 assert.match(sh,/--single-transaction --exit-on-error/);
 assert.match(sh,/sha256sum --check --status/);
});
test("requires verified TLS, encrypt-key isolation, fixed restore target",()=>{
 assert.match(sh,/PGSSLMODE=verify-full/);
 assert.match(sh,/PGSSLROOTCERT=\/etc\/ssl\/certs\/ca-certificates\.crt/);
 assert.match(sh,/--passphrase-fd 3/);
 assert.match(sh,/EXAMTREE_PG_BIN_DIR/);
 assert.match(sh,/examtree-neon-backup-passphrase/);
 assert.doesNotMatch(sh,/\bgcloud\s+(?:tasks|run|scheduler)\s/);
 assert.doesNotMatch(sh,/\b(?:dropdb|DROP DATABASE|TRUNCATE|DROP TABLE)\b/);
});
