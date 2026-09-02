import { INT_CP010_FINAL_AUTHORITIES, generateIntCp010PermanentEnglish, generateIntCp010PermanentLocalized } from "./cp010-final-registry-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let englishChecks = 0;
let localizedChecks = 0;
let backwardOrderChecks = 0;
let grammarChecks = 0;

for (const entry of INT_CP010_FINAL_AUTHORITIES) {
  for (let index = 0; index < 300; index += 1) {
    const seed = `cp010:final-polish:${entry.permanentQlId}:${index}`;
    const en = generateIntCp010PermanentEnglish(entry.permanentQlId, seed) as any;
    const enText = `${en.stem}\n${en.explanation.keyIdea}\n${en.explanation.steps.join("\n")}`;
    assert(!/\ba education loan\b/iu.test(enText), `${entry.permanentQlId}/${seed}: English article error survived permanent polish`);
    assert(!/\b(?:farm-machinery finance|vehicle finance|workshop-equipment finance)\b/iu.test(en.stem), `${entry.permanentQlId}/${seed}: awkward finance context survived permanent polish`);
    assert(!/(?:undefined|null|NaN|after after|₹-)/u.test(enText), `${entry.permanentQlId}/${seed}: malformed English learner token`);
    grammarChecks += 3;
    englishChecks += 1;

    if (entry.authorityId === "INT-CP010-AUTH-02") {
      const periods = en.mathematicalState.periodRatesPercent.length;
      const recurrence = en.explanation.steps.slice(1, -1);
      assert(recurrence.length === periods, `${entry.permanentQlId}/${seed}: English reverse-recurrence step count drift`);
      assert(recurrence[0]!.startsWith(`Before year ${periods}:`), `${entry.permanentQlId}/${seed}: English explanation does not begin from final year`);
      assert(recurrence.at(-1)!.startsWith("Before year 1:"), `${entry.permanentQlId}/${seed}: English explanation does not finish at opening year`);
      backwardOrderChecks += 3;
    }

    for (const language of ["hi", "pa"] as const) {
      const q = generateIntCp010PermanentLocalized(entry.permanentQlId, seed, language) as any;
      const learner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}`;
      assert(!/(?:undefined|null|NaN|after after|₹-)/u.test(learner), `${entry.permanentQlId}/${seed}/${language}: malformed localized learner token`);
      localizedChecks += 1;
      grammarChecks += 1;

      if (entry.authorityId === "INT-CP010-AUTH-02") {
        const periods = q.mathematicalState.periodRatesPercent.length;
        const recurrence = q.explanation.steps.slice(1, -1);
        const firstPrefix = language === "hi" ? `वर्ष ${periods} से पहले:` : `ਸਾਲ ${periods} ਤੋਂ ਪਹਿਲਾਂ:`;
        const lastPrefix = language === "hi" ? "वर्ष 1 से पहले:" : "ਸਾਲ 1 ਤੋਂ ਪਹਿਲਾਂ:";
        assert(recurrence.length === periods, `${entry.permanentQlId}/${seed}/${language}: localized reverse-recurrence step count drift`);
        assert(recurrence[0]!.startsWith(firstPrefix), `${entry.permanentQlId}/${seed}/${language}: explanation does not begin from final year`);
        assert(recurrence.at(-1)!.startsWith(lastPrefix), `${entry.permanentQlId}/${seed}/${language}: explanation does not finish at opening year`);
        backwardOrderChecks += 3;
      }
    }
  }
}

console.log(JSON.stringify({
  englishChecks,
  localizedChecks,
  backwardOrderChecks,
  grammarChecks,
  permanentQlIds: INT_CP010_FINAL_AUTHORITIES.map((entry) => entry.permanentQlId),
}, null, 2));
console.log("PASS_INT_CP010_FINAL_POLISH_AUDIT");
