import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q, TSD_CP005_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v13";
import { TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1 } from "./native-review-candidate-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericTokens(text: string): readonly string[] {
  return Object.freeze(text.match(/\d+(?:\.\d+)?/g) ?? []);
}

const rows = TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1;
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
  phase: "TSD_CP005_HI_PA_NATIVE_REVIEW_CANDIDATE_V1",
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
  englishSourceMutation: false,
  multilingualFreezeStatus: "UNFROZEN",
  productOwnerApprovalRecorded: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
