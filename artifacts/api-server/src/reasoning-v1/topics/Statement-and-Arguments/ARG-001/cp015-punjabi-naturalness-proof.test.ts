import assert from "node:assert/strict";

import { generateArgCp015QuestionStudioBatch } from "./cp015-perceived-diversity-expansion.ts";

type Question = Readonly<Record<string, any>>;

const ROMAN = ["I", "II", "III", "IV"] as const;
const cells = [
  { profileMode: "core" as const, difficulty: "Easy" as const },
  { profileMode: "core" as const, difficulty: "Medium" as const },
  { profileMode: "core" as const, difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Easy" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard" as const },
] as const;

function reasons(question: Question): readonly string[] {
  const explanation = String(question.explanation ?? "");
  const args = Array.isArray(question.arguments) ? question.arguments : [];
  const labels = args.map((_: unknown, index: number) => `ਦਲੀਲ ${ROMAN[index]} `);
  return labels.map((label: string, index: number) => {
    const start = explanation.indexOf(label);
    assert.ok(start >= 0, `${question.questionId}: missing ${label}`);
    const colon = explanation.indexOf(": ", start);
    assert.ok(colon >= 0, `${question.questionId}: missing reason delimiter`);
    const next = labels[index + 1];
    const end = next ? explanation.indexOf(next, colon + 2) : explanation.length;
    return explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim();
  });
}

let rolloutSurfacesChecked = 0;
let rolloutSemanticReasonsChecked = 0;
let reportingTimeSurfacesChecked = 0;
let employeeSurfacesChecked = 0;

for (const qlId of ["ARG-QL-003", "ARG-QL-004", "ARG-QL-005"] as const) {
  for (const cell of cells) {
    for (let seedIndex = 0; seedIndex < 160; seedIndex += 1) {
      const batch = generateArgCp015QuestionStudioBatch({
        profileMode: cell.profileMode,
        examProfile: "examProfile" in cell ? cell.examProfile : undefined,
        qlId,
        language: "pa",
        difficulty: cell.difficulty,
        seed: `ARG-CP015-PA-NATURALNESS:${qlId}:${cell.profileMode}:${"examProfile" in cell ? cell.examProfile : "CORE"}:${cell.difficulty}:${seedIndex}`,
        count: 1,
      });
      const question = batch.questions[0] as Question;
      const args = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
      const fullSurface = [String(question.statement ?? ""), ...args, String(question.explanation ?? "")].join(" ");

      if (qlId === "ARG-QL-003") {
        rolloutSurfacesChecked += 1;
        assert.doesNotMatch(fullSurface, /ਪੂਰੀ ਤਰ੍ਹਾਂ ਡਿਜ਼ਿਟਲ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰ ਉੱਤੇ ਲਿਆਂਦਾ ਜਾਣਾ/, `${question.questionId}: unnatural singular digital-exam-centre construction leaked`);
        assert.doesNotMatch(fullSurface, /ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ ਜੋ ਵੀ ਹੋਣ/, `${question.questionId}: unnatural connectivity concessive construction leaked`);
        assert.doesNotMatch(fullSurface, /ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ ਜੋ ਵੀ ਹੋਣ/, `${question.questionId}: unnatural device/centre concessive construction leaked`);
        assert.doesNotMatch(fullSurface, /ਜ਼ਿਆਦਾਤਰ ਥਾਂ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਸਿੱਧੇ ਉਪਲਬਧ/, `${question.questionId}: unnatural rollout-availability phrase leaked`);

        const rs = reasons(question);
        for (let index = 0; index < args.length; index += 1) {
          const argument = args[index]!;
          const reason = rs[index]!;
          if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਕਨੈਕਟਿਵਿਟੀ.*ਉਪਲਬਧ/.test(argument)) {
            rolloutSemanticReasonsChecked += 1;
            assert.match(reason, /(?:ਕਨੈਕਟਿਵਿਟੀ|ਨੈੱਟਵਰਕ)/, `${question.questionId}: connectivity rollout argument got an unrelated reason`);
            assert.doesNotMatch(reason, /ਤਰਬੀਅਤਯਾਫ਼ਤਾ ਸਟਾਫ/, `${question.questionId}: connectivity rollout reason incorrectly talks about trained staff`);
          }
          if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ.*ਉਪਲਬਧ/.test(argument)) {
            rolloutSemanticReasonsChecked += 1;
            assert.match(reason, /(?:ਡਿਵਾਈਸ|ਕੇਂਦਰ|ਉਪਕਰਣ|ਸਮਰੱਥਾ)/, `${question.questionId}: device/centre rollout argument got an unrelated reason`);
          }
        }
      } else if (qlId === "ARG-QL-004") {
        if (/ਵੱਖਰੇ ਰਿਪੋਰਟਿੰਗ ਸਮੇਂ/.test(fullSurface)) reportingTimeSurfacesChecked += 1;
        assert.doesNotMatch(fullSurface, /ਵੱਖਰੇ ਰਿਪੋਰਟਿੰਗ ਸਮੇਂ[^।]*ਘੱਟ ਕਰ ਸਕਦਾ ਹੈ/, `${question.questionId}: plural reporting-time subject retained singular reduction verb`);
        assert.doesNotMatch(fullSurface, /ਵੱਖਰੇ ਰਿਪੋਰਟਿੰਗ ਸਮੇਂ[^।]*ਕਾਇਮ ਰੱਖ ਸਕਦਾ ਹੈ/, `${question.questionId}: plural reporting-time subject retained singular maintenance verb`);
        assert.doesNotMatch(fullSurface, /ਵੱਖਰੇ ਰਿਪੋਰਟਿੰਗ ਸਮੇਂ[^।]*ਲਾਗੂ ਨਹੀਂ ਹੋ ਸਕਦਾ/, `${question.questionId}: plural reporting-time subject retained singular applicability verb`);
      } else {
        employeeSurfacesChecked += 1;
        assert.doesNotMatch(fullSurface, /(?:ਦਫ਼ਤਰੀ|ਦੂਰਸਥ|ਰਿਮੋਟ|ਕੌਨਟ੍ਰੈਕਟ) ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/, `${question.questionId}: oblique employee-subject construction leaked`);
      }
    }
  }
}

assert.ok(rolloutSurfacesChecked > 0, "Punjabi naturalness proof did not exercise QL003 rollout surfaces");
assert.ok(rolloutSemanticReasonsChecked > 0, "Punjabi naturalness proof did not exercise rollout semantic reasons");
assert.ok(reportingTimeSurfacesChecked > 0, "Punjabi naturalness proof did not exercise QL004 reporting-time surfaces");
assert.ok(employeeSurfacesChecked > 0, "Punjabi naturalness proof did not exercise QL005 employee surfaces");

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_PUNJABI_NATURALNESS",
  rolloutSurfacesChecked,
  rolloutSemanticReasonsChecked,
  reportingTimeSurfacesChecked,
  employeeSurfacesChecked,
}, null, 2));
