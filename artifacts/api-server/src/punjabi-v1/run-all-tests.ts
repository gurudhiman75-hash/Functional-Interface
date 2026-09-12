/**
 * Comprehensive Punjabi Engine (`punjabi-v1`) Test Runner
 * Executes all foundational, all 14 checkpoints, package registry, and Question Studio test suites.
 */

console.log("\n=======================================================");
console.log("  EXAMTREE PUNJABI CONTENT ENGINE (punjabi-v1)");
console.log("  Comprehensive Automated Verification Suite (14 CPs)");
console.log("=======================================================\n");

const startTime = Date.now();

// 1. Foundation: Unicode & Grapheme contracts
import "./foundation/unicode/unicode-contracts.test";

// 2. All 14 Checkpoints (CP001 through CP014)
import "./packages/PUN-001/checkpoints/CP001/CP001.test";
import "./packages/PUN-001/checkpoints/CP002/CP002.test";
import "./packages/PUN-001/checkpoints/CP003/CP003.test";
import "./packages/PUN-001/checkpoints/CP004/CP004.test";
import "./packages/PUN-001/checkpoints/CP005/CP005.test";
import "./packages/PUN-001/checkpoints/CP006/CP006.test";
import "./packages/PUN-001/checkpoints/CP007/CP007.test";
import "./packages/PUN-001/checkpoints/CP008/CP008.test";
import "./packages/PUN-001/checkpoints/CP009/CP009.test";
import "./packages/PUN-001/checkpoints/CP010/CP010.test";
import "./packages/PUN-001/checkpoints/CP011/CP011.test";
import "./packages/PUN-001/checkpoints/CP012/CP012.test";
import "./packages/PUN-001/checkpoints/CP013/CP013.test";
import "./packages/PUN-001/checkpoints/CP014/CP014.test";

// 3. Package Registry Dispatcher
import "./packages/PUN-001/package.test";

// 4. Question Studio Adapter
import "./question-studio/question-studio-adapter.test";

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\n>>> ALL PUNJABI-V1 TEST SUITES PASSED (Duration: ${duration}s) <<<\n`);
