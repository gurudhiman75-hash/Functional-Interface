import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q, TSD_CP005_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v13";
import { TSD_CP005_NATIVE_EDITORIAL_REVIEW_V3 } from "./native-review-editorial-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericTokens(text: string): readonly string[] {
  return Object.freeze(text.match(/\d+(?:\.\d+)?/g) ?? []);
}

const FEMININE_OBJECTS = new Set([
  "INTERCITY_BUS", "TAXI", "CAR", "DELIVERY_VAN", "COURIER_VAN", "PASSENGER_TRAIN", "EXPRESS_TRAIN",
  "MINIBUS", "JEEP", "POSTAL_VAN", "COMPANY_CAR", "TRANSPORT_VAN", "SHUTTLE_BUS", "PATROL_CAR",
  "SERVICE_VAN", "INSPECTION_JEEP", "TEST_CAR", "MAINTENANCE_VAN", "SHUTTLE_VAN", "MOTORCYCLE", "SERVICE_CAR",
]);

const rows = TSD_CP005_NATIVE_EDITORIAL_REVIEW_V3;
const hi = rows.filter((row) => row.presentation.language === "hi");
const pa = rows.filter((row) => row.presentation.language === "pa");

assert(TSD_CP005_ENGLISH_FREEZE_ID === "TSD-CP-005-EN-v13-frozen", "CP005 native candidate is not based on certified English V13 freeze");
assert(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.length === 78, "CP005 English frozen authority must contain 78 rows");
assert(rows.length === 156, `CP005 native candidate expected 156 rows, received ${rows.length}`);
assert(hi.length === 78 && pa.length === 78, "CP005 native candidate must contain 78 Hindi and 78 Punjabi rows");

for (const languageRows of [hi, pa]) {
  assert(new Set(languageRows.map((row) => row.source.permanentQlId)).size === 13, "native candidate lost QL coverage");
  assert(new Set(languageRows.map((row) => row.source.solveMode)).size === 20, "native candidate lost solve-mode coverage");
  assert(new Set(languageRows.map((row) => row.presentation.stem)).size === 78, "native candidate stems are not unique");
  assert(new Set(languageRows.map((row) => row.source.objectContextId)).size === 44, "native candidate changed selected object-context coverage");
  assert(new Set(languageRows.map((row) => row.source.objectFamily)).size === 25, "native candidate changed selected object-family coverage");
  assert(new Set(languageRows.map((row) => row.source.endpointFamily)).size === 18, "native candidate changed endpoint-family coverage");
  for (const ql of [...new Set(languageRows.map((row) => row.source.permanentQlId))]) {
    const qlRows = languageRows.filter((row) => row.source.permanentQlId === ql);
    assert(qlRows.length === 6, `${ql}: native candidate must contain six rows per language`);
    assert(new Set(qlRows.map((row) => row.presentation.stem)).size === 6, `${ql}: native stem diversity collapsed`);
    assert(new Set(qlRows.map((row) => row.source.objectFamily)).size === 6, `${ql}: native object-family diversity collapsed`);
  }
}

for (let index = 0; index < TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.length; index += 1) {
  const source = TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q[index]!;
  const h = hi[index]!;
  const p = pa[index]!;
  assert(h.source === source && p.source === source, `row ${index + 1}: native presentation detached from frozen source authority`);
  assert(source.lifecycle.englishFreezeStatus === "FROZEN", `row ${index + 1}: English source is not frozen`);
  for (const native of [h, p]) {
    assert(native.presentation.correctIndex === source.correctIndex, `row ${index + 1}: correct index changed in ${native.presentation.language}`);
    assert(native.presentation.options.length === source.options.length, `row ${index + 1}: option count changed`);
    assert(native.presentation.options[source.correctIndex] === native.presentation.answerText, `row ${index + 1}: keyed native option does not equal native answer`);
    assert(native.presentation.explanation.steps.length === 2, `row ${index + 1}: native explanation must retain exactly two connected steps`);
    for (let optionIndex = 0; optionIndex < source.options.length; optionIndex += 1) {
      assert(
        numericTokens(native.presentation.options[optionIndex]!).join("|") === numericTokens(source.options[optionIndex]!).join("|"),
        `row ${index + 1} option ${optionIndex + 1}: numeric option identity changed`,
      );
    }
    const sourceStemNumbers = numericTokens(source.stem);
    const nativeStemNumbers = numericTokens(native.presentation.stem);
    for (const token of sourceStemNumbers) {
      assert(nativeStemNumbers.includes(token), `row ${index + 1}: source stem number ${token} missing in ${native.presentation.language}`);
    }
    const allNativeText = [
      native.presentation.stem,
      ...native.presentation.options,
      native.presentation.answerText,
      native.presentation.explanation.method,
      ...native.presentation.explanation.steps,
      native.presentation.explanation.shortcut,
      native.presentation.explanation.finalAnswer,
    ].join("\n");
    assert(!allNativeText.includes("3P–Q") && !allNativeText.includes("2P–Q"), `row ${index + 1}: ambiguous multiplied-route notation remains`);
    assert(!native.presentation.stem.includes("दिया गया समय-अंतर") && !native.presentation.stem.includes("ਦਿੱਤਾ ਸਮਾਂ-ਅੰਤਰ"), `row ${index + 1}: redundant meeting-label repair prose remains`);
    assert(!native.presentation.stem.includes("घंटे है") && !native.presentation.stem.includes("ਘੰਟੇ ਹੈ"), `row ${index + 1}: singular agreement used with plural hours`);
    if (native.presentation.language === "hi") assert(!/km\/h पर/u.test(native.presentation.stem), `row ${index + 1}: awkward Hindi speed preposition remains`);
    if (FEMININE_OBJECTS.has(source.objectFamily)) {
      if (native.presentation.language === "hi") {
        assert(!/(?:आते-जाते हैं|चलते हैं|चलता है|पहुँचता है|करता है|लौटता है|मुड़ता है|रुकता है|आता है|चलने वाले)/u.test(native.presentation.stem), `row ${index + 1}: masculine Hindi vehicle agreement remains`);
      } else {
        assert(!/(?:ਆਉਂਦੇ-ਜਾਂਦੇ ਹਨ|ਚਲਦੇ ਹਨ|ਚਲਦਾ ਹੈ|ਪਹੁੰਚਦਾ ਹੈ|ਕਰਦਾ ਹੈ|ਮੁੜਦਾ ਹੈ|ਰੁਕਦਾ ਹੈ|ਆਉਂਦਾ ਹੈ|ਚੱਲਣ ਵਾਲੇ)/u.test(native.presentation.stem), `row ${index + 1}: masculine Punjabi vehicle agreement remains`);
      }
    }
    assert(native.presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `row ${index + 1}: native candidate frozen without approval`);
    assert(!native.presentation.lifecycle.productOwnerApprovalRecorded, `row ${index + 1}: native approval recorded prematurely`);
    assert(!native.presentation.lifecycle.questionStudioEnabled, `row ${index + 1}: Question Studio unlocked`);
    assert(native.presentation.lifecycle.questionBankStatus === "NOT_STORED", `row ${index + 1}: Question Bank unlocked`);
    assert(native.presentation.lifecycle.testEligibility === "INELIGIBLE", `row ${index + 1}: test eligibility unlocked`);
    assert(!native.presentation.lifecycle.publiclyPublishable, `row ${index + 1}: public publication unlocked`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_HI_PA_NATIVE_EDITORIAL_REVIEW_V3",
  englishAuthority: TSD_CP005_ENGLISH_FREEZE_ID,
  englishFrozenRows: 78,
  nativeRows: rows.length,
  hindiRows: hi.length,
  punjabiRows: pa.length,
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  learnerSolveModes: new Set(hi.map((row) => row.source.solveMode)).size,
  selectedObjectContextsPerLanguage: new Set(hi.map((row) => row.source.objectContextId)).size,
  selectedObjectFamiliesPerLanguage: new Set(hi.map((row) => row.source.objectFamily)).size,
  selectedEndpointFamiliesPerLanguage: new Set(hi.map((row) => row.source.endpointFamily)).size,
  stemsPerQlPerLanguage: 6,
  explanationStepsPerQuestion: 2,
  strictScriptAndEnglishLeakGate: true,
  frozenGivenNumericParityGate: true,
  nativeVehicleAgreementGate: true,
  nativeSpeedPhrasingGate: true,
  englishSourceMutation: false,
  multilingualFreezeStatus: "UNFROZEN",
  productOwnerApprovalRecorded: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
