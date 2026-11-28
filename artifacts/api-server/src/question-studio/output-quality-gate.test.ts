import assert from "node:assert/strict";
import { inspectQuestionStudioOutput as inspect } from "./output-quality-gate";
import { normalizeQuestionStudioText } from "./output-normalizer";

const codes = (input: Parameters<typeof inspect>[0]) => inspect(input).map((finding) => finding.code);
const base = { packageId: "TEST", options: ["1", "2", "3", "4"], correctIndex: 0 } as const;

// Defects found in the November 2026 stem audit.
assert.ok(codes({ ...base, language: "hi", stem: "p-मान NaN और सार्थकता स्तर α = 0.05 है।" }).includes("PLACEHOLDER"));
assert.ok(codes({ ...base, language: "en", stem: "LISTENER = Bhavna\nmother -> Kavita\nHow is Bhavna related?" }).includes("SOLVER_TRACE_LEAK"));
assert.ok(codes({ ...base, language: "en", stem: "Simplify \\frac{6}{6+\\sqrt{3}}." }).includes("RAW_LATEX_OUTSIDE_MATH"));
assert.ok(codes({ ...base, language: "en", stem: "Find p.", options: ["15\\%", "16%", "14%", "85%"] }).includes("CORRECT_OPTION_FORMAT_TELL"));
assert.ok(codes({ ...base, language: "en", stem: "Simplify (1/8)^(-3) × 2^3.", options: ["2^12", "4097", "4095", "8192"] }).includes("CORRECT_OPTION_FORMAT_TELL"));
assert.ok(codes({ ...base, language: "en", stem: "Find k if 4x² - 40x + 5k = 0 has equal roots.", options: ["x > y", "x < y", "x = y", "20"], correctIndex: 3 }).includes("OPTIONS_DONT_MATCH_STEM"));
assert.ok(codes({ ...base, language: "hi", stem: "Home टैबटैब समूह कौन-सा है?" }).includes("DUPLICATED_TOKEN"));
assert.ok(codes({ ...base, language: "pa", stem: "ਨਕਸ਼ਾ ਪ੍ਰক্ষেপ ਕੀ ਹੈ?" }).includes("OTHER_INDIC_SCRIPT"));
assert.ok(codes({ ...base, language: "pa", stem: "कॉਰਪਸ ਜੂਰੀਸ ਸਿਵਿਲਿਸ ਕਿਸ ਨੇ ਤਿਆਰ ਕਰਵਾਇਆ?" }).includes("DEVANAGARI_IN_PUNJABI"));
assert.ok(codes({ ...base, language: "hi", stem: "उत्तर चुनिए।", options: ["ਜੂਨ ਵਿੱਚ", "ख", "ग", "घ"] }).includes("GURMUKHI_IN_HINDI"));
assert.ok(codes({ ...base, language: "hi", stem: "कौन-सा compariसोन सही है?" }).includes("MIXED_SCRIPT_WORD"));
assert.ok(codes({ ...base, language: "en", stem: "Gagan is the son of Vikas.\nHarjit is the son of Gagan.\n\nGagan is the son of Vikas. How is Harjit related?" }).includes("DUPLICATED_RELATION_LIST"));

// Clean items and known false positives stay clean.
assert.deepEqual(codes({ ...base, language: "hi", stem: "रीना के नाना और दादा कौन हैं?" }), []);
assert.deepEqual(codes({ ...base, language: "en", stem: "Fail to reject the null hypothesis at α = 0.05?" }), []);
assert.deepEqual(codes({ ...base, language: "en", stem: "Find $\\frac{1}{2}$ of 35%." }), []);
assert.deepEqual(codes({ ...base, language: "hi", stem: "गुरमुखी में 'ਸ' अक्षर कौन-सा है?", options: ["ਸ", "ਹ", "ਕ", "ਖ"] }), []);

// The normalizer resolves the mechanical presentation defects the gate catches.
for (const raw of ["Simplify \\frac{6}{6+\\sqrt{3}}+\\frac{5}{6-\\sqrt{3}} into simplest surd form.", "15\\%", "2 + \\frac{1}{33}\\sqrt{3}"]) {
  assert.deepEqual(codes({ ...base, language: "en", stem: normalizeQuestionStudioText(raw) }), [], raw);
}
assert.equal(normalizeQuestionStudioText("यदि \\frac{8}{7+\\sqrt{7}}=A+B\\sqrt{7}, तो"), "यदि $\\frac{8}{7+\\sqrt{7}}=A+B\\sqrt{7}$, तो");
assert.equal(normalizeQuestionStudioText("$$35\\%$$ and 35\\%"), "$$35\\%$$ and 35%");
assert.equal(normalizeQuestionStudioText("$$\\text{Group D}$$"), "Group D");
assert.equal(normalizeQuestionStudioText("$$\\text{cm}^{2}$$"), "$$\\text{cm}^{2}$$");

console.log("question-studio output quality gate: ok");
