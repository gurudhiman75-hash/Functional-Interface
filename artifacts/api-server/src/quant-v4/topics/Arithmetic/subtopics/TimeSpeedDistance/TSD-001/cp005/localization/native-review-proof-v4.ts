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

assert(TSD_CP005_ENGLISH_FREEZE_ID === "TSD-CP-005-EN-v13-frozen", "native V3 is not based on certified English V13 freeze");
assert(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.length === 78, "English frozen authority must contain 78 rows");
assert(rows.length === 156 && hi.length === 78 && pa.length === 78, "native V3 must contain 78 Hindi + 78 Punjabi rows");

for (const languageRows of [hi, pa]) {
  assert(new Set(languageRows.map((row) => row.source.permanentQlId)).size === 13, "native V3 lost QL coverage");
  assert(new Set(languageRows.map((row) => row.source.solveMode)).size === 20, "native V3 lost solve-mode coverage");
  assert(new Set(languageRows.map((row) => row.presentation.stem)).size === 78, "native V3 stems are not unique");
  assert(new Set(languageRows.map((row) => row.source.objectContextId)).size === 44, "native V3 changed object-context coverage");
  assert(new Set(languageRows.map((row) => row.source.objectFamily)).size === 25, "native V3 changed object-family coverage");
  assert(new Set(languageRows.map((row) => row.source.endpointFamily)).size === 18, "native V3 changed endpoint-family coverage");
  for (const ql of [...new Set(languageRows.map((row) => row.source.permanentQlId))]) {
    const qlRows = languageRows.filter((row) => row.source.permanentQlId === ql);
    assert(qlRows.length === 6, `${ql}: expected six rows per language`);
    assert(new Set(qlRows.map((row) => row.presentation.stem)).size === 6, `${ql}: localized stem diversity collapsed`);
    assert(new Set(qlRows.map((row) => row.source.objectFamily)).size === 6, `${ql}: localized object diversity collapsed`);
  }
}

for (let index = 0; index < 78; index += 1) {
  const source = TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q[index]!;
  const nativeRows = [hi[index]!, pa[index]!];
  assert(nativeRows.every((row) => row.source === source), `row ${index + 1}: presentation detached from frozen source`);
  assert(source.lifecycle.englishFreezeStatus === "FROZEN", `row ${index + 1}: English source not frozen`);

  for (const native of nativeRows) {
    const lang = native.presentation.language;
    assert(native.presentation.correctIndex === source.correctIndex, `row ${index + 1}/${lang}: correct index changed`);
    assert(native.presentation.options.length === source.options.length, `row ${index + 1}/${lang}: option count changed`);
    assert(native.presentation.options[source.correctIndex] === native.presentation.answerText, `row ${index + 1}/${lang}: keyed option != answer`);
    assert(native.presentation.explanation.steps.length === 2, `row ${index + 1}/${lang}: explanation is not exactly two steps`);

    for (let optionIndex = 0; optionIndex < source.options.length; optionIndex += 1) {
      assert(numericTokens(native.presentation.options[optionIndex]!).join("|") === numericTokens(source.options[optionIndex]!).join("|"),
        `row ${index + 1}/${lang} option ${optionIndex + 1}: numeric option identity changed`);
    }
    const nativeStemNumbers = numericTokens(native.presentation.stem);
    for (const token of numericTokens(source.stem)) {
      assert(nativeStemNumbers.includes(token), `row ${index + 1}/${lang}: frozen stem number ${token} missing`);
    }

    const allText = [native.presentation.stem, ...native.presentation.options, native.presentation.answerText,
      native.presentation.explanation.method, ...native.presentation.explanation.steps,
      native.presentation.explanation.shortcut, native.presentation.explanation.finalAnswer].join("\n");
    assert(!allText.includes("3P–Q") && !allText.includes("2P–Q"), `row ${index + 1}/${lang}: ambiguous multiplied-route notation remains`);
    assert(!native.presentation.stem.includes("दिया गया समय-अंतर") && !native.presentation.stem.includes("ਦਿੱਤਾ ਸਮਾਂ-ਅੰਤਰ"), `row ${index + 1}/${lang}: redundant meeting-label repair remains`);
    // Hindi 'हैं' is 'है' plus the nasal mark U+0902, so reject only true singular 'है'.
    assert(!/घंटे है(?!ं)/u.test(native.presentation.stem) && !/ਘੰਟੇ ਹੈ/u.test(native.presentation.stem), `row ${index + 1}/${lang}: singular agreement used with plural hours`);
    if (lang === "hi") assert(!/km\/h पर/u.test(native.presentation.stem), `row ${index + 1}: awkward Hindi speed preposition remains`);

    if (FEMININE_OBJECTS.has(source.objectFamily)) {
      if (lang === "hi") {
        assert(!/(?:आते-जाते हैं|चलते हैं|चलता है|पहुँचता है|करता है|लौटता है|मुड़ता है|रुकता है|आता है|चलने वाले)/u.test(native.presentation.stem), `row ${index + 1}: masculine Hindi vehicle agreement remains`);
      } else {
        assert(!/(?:ਆਉਂਦੇ-ਜਾਂਦੇ ਹਨ|ਚਲਦੇ ਹਨ|ਚਲਦਾ ਹੈ|ਪਹੁੰਚਦਾ ਹੈ|ਕਰਦਾ ਹੈ|ਮੁੜਦਾ ਹੈ|ਰੁਕਦਾ ਹੈ|ਆਉਂਦਾ ਹੈ|ਚੱਲਣ ਵਾਲੇ)/u.test(native.presentation.stem), `row ${index + 1}: masculine Punjabi vehicle agreement remains`);
      }
    }

    assert(native.presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `row ${index + 1}/${lang}: native candidate frozen prematurely`);
    assert(!native.presentation.lifecycle.productOwnerApprovalRecorded, `row ${index + 1}/${lang}: native approval recorded prematurely`);
    assert(!native.presentation.lifecycle.questionStudioEnabled, `row ${index + 1}/${lang}: Studio unlocked`);
    assert(native.presentation.lifecycle.questionBankStatus === "NOT_STORED", `row ${index + 1}/${lang}: Bank unlocked`);
    assert(native.presentation.lifecycle.testEligibility === "INELIGIBLE", `row ${index + 1}/${lang}: tests unlocked`);
    assert(!native.presentation.lifecycle.publiclyPublishable, `row ${index + 1}/${lang}: publication unlocked`);
  }
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_HI_PA_NATIVE_EDITORIAL_REVIEW_V3",
  englishAuthority: TSD_CP005_ENGLISH_FREEZE_ID,
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
