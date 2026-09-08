import { strict as assert } from "node:assert";
import { validateComputerAwarenessEditorialText } from "./computer-awareness-editorial-policy";

assert.deepEqual(validateComputerAwarenessEditorialText({ stem: "Which network covers a building?", explanation: "A LAN (Local Area Network) covers a limited area." }), { valid: true, issues: [] });
assert.deepEqual(validateComputerAwarenessEditorialText({ stem: "Which network covers a building?", explanation: "A LAN covers a limited area." }).issues, ["UNEXPANDED_ABBREVIATION:LAN"]);
assert.deepEqual(validateComputerAwarenessEditorialText({ stem: "In the following question, which network is used?", explanation: "A Local Area Network covers a building." }).issues, ["UNNECESSARY_STEM_OPENING"]);
console.log("[COMPUTER-AWARENESS-EDITORIAL-POLICY] PASS");
