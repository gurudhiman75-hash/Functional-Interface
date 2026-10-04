// Current-main TSD closure suite.
// These imports execute the final checkpoint assertions at module load.

import "./TSD-001/cp005/proof";
import "./TSD-001/cp005/english-approved-freeze-proof-v13";
import "./TSD-001/cp005/localization/native-approved-freeze-proof-v5";

import "./TSD-001/cp006/proof";
import "./TSD-001/cp006/english-approved-freeze-proof-v5";
import "./TSD-001/cp006/localization/native-approved-freeze-proof-v7";

import "./TSD-002/cp007/allocation-proof.test";
import "./TSD-002/cp007/ownership-proof.test";
import "./TSD-002/cp007/executable-proof.test";
import "./TSD-002/cp007/english-freeze-proof.test";
import "./TSD-002/cp007/localization-freeze-proof.test";
import "./TSD-002/cp007/question-studio-review-proof.test";

import "./TSD-002/cp008/allocation-proof.test";
import "./TSD-002/cp008/ownership-proof.test";
import "./TSD-002/cp008/executable-proof.test";
import "./TSD-002/cp008/source-saturation-proof.test";
import "./TSD-002/cp008/english-freeze-proof.test";
import "./TSD-002/cp008/localization-freeze-proof.test";
import "./TSD-002/cp008/question-studio-review-proof.test";

import "./TSD-002/cp009/allocation-proof.test";
import "./TSD-002/cp009/final-ownership-proof.test";
import "./TSD-002/cp009/executable-proof.test";
import "./TSD-002/cp009/source-saturation-proof.test";
import "./TSD-002/cp009/english-freeze-proof.test";
import "./TSD-002/cp009/localization-freeze-proof.test";
import "./TSD-002/cp009/question-studio-review-adapter-proof.test";

import "./TSD-002/cp010/allocation-proof.test";
import "./TSD-002/cp010/final-ownership-proof.test";
import "./TSD-002/cp010/executable-proof.test";
import "./TSD-002/cp010/source-saturation-proof.test";
import "./TSD-002/cp010/exam-paper-v3-proof.test";
import "./TSD-002/cp010/english-freeze-proof.test";
import "./TSD-002/cp010/localization-freeze-proof.test";
import "./TSD-002/cp010/question-studio-candidate-proof.test";
import "./TSD-002/cp010/question-studio-preregistration-lock-proof.test";

import "./TSD-002/cp011/allocation-proof.test";
import "./TSD-002/cp011/executable-proof.test";
import "./TSD-002/cp011/source-saturation-proof.test";
import "./TSD-002/cp011/representation-saturation-proof.test";
import "./TSD-002/cp011/english-authoring-proof.test";
import "./TSD-002/cp011/english-freeze-proof.test";
import "./TSD-002/cp011/native-localization-proof.test";
import "./TSD-002/cp011/localization-freeze-proof.test";
import "./TSD-002/cp011/multilingual-review-export-proof.test";
import "./TSD-002/cp011/question-studio-candidate-proof.test";
import "./TSD-002/cp011/question-studio-preregistration-lock-proof.test";

import "./TSD-002/cp012/allocation-proof.test";
import "./TSD-002/cp012/executable-proof.test";
import "./TSD-002/cp012/source-saturation-proof.test";
import "./TSD-002/cp012/source-executable-coverage-proof.test";
import "./TSD-002/cp012/representation-saturation-proof.test";
import "./TSD-002/cp012/ownership-boundaries-proof.test";
import "./TSD-002/cp012/two-engine-provenance-proof.test";
import "./TSD-002/cp012/upstream-stack-compatibility-proof.test";
import "./TSD-002/cp012/english-authoring-proof.test";
import "./TSD-002/cp012/english-freeze-proof.test";
import "./TSD-002/cp012/native-localization-proof.test";
import "./TSD-002/cp012/localization-freeze-proof.test";
import "./TSD-002/cp012/multilingual-review-export-proof.test";
import "./TSD-002/cp012/question-studio-candidate-proof.test";
import "./TSD-002/cp012/question-studio-distractor-coverage-proof.test";
import "./TSD-002/cp012/question-studio-difficulty-contract-proof.test";
import "./TSD-002/cp012/question-studio-option-realness-proof.test";
import "./TSD-002/cp012/question-studio-preregistration-lock-proof.test";

console.log(JSON.stringify({
  chapter: "Time, Speed & Distance",
  suite: "TSD-FROZEN-CHECKPOINT-PROOFS-CURRENT-MAIN-V1",
  checkpoints: ["CP005", "CP006", "CP007", "CP008", "CP009", "CP010", "CP011", "CP012"],
  obsoleteBespokeRouteProofsIntentionallyExcluded: true,
  currentUnifiedQuestionStudioProof: "tsd-current-main-closure-audit.test.ts",
  verdict: "PASS",
}, null, 2));
