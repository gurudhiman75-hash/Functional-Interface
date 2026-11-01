import { add, subtract, multiply, divide, rational, equals, latex, toNumber } from "./math";
import type { Avg001QuestionPackage, Rational } from "./types";

export const AVG_001_COMPLETE_EXPLANATION = "AVG-001 complete learner explanations 2026-11-01";

/** Build the learner's working from the givens, rather than the solver's summary.
 * Keep preparation and final arithmetic separate; neither is shortened to a line limit.
 * This changes explanations only, after the historical editorial release passes.
 */
export function applyAvg001CompleteLearnerExplanation(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  const v = pkg.parameters.values;
  const rv = pkg.parameters.renderVariables;
  const t = (en: string, hi: string, pa: string) => pkg.language === "hi" ? hi : pkg.language === "pa" ? pa : en;
  const n = (value: unknown): Rational => {
    if (value && typeof value === "object" && "numerator" in value && "denominator" in value) return value as Rational;
    const text = String(value).replaceAll(",", "");
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) throw new Error(`${pkg.questionLanguageId}: missing explanation value ${text}`);
    const places = text.split(".")[1]?.length ?? 0;
    return rational(Number(text.replace(".", "")), 10 ** places);
  };
  const get = (key: string) => n((v as unknown as Record<string, unknown>)[key] ?? rv[key]);
  const sum = (items: Rational[]) => items.reduce(add, rational(0));
  const abs = (value: Rational) => rational(Math.abs(value.numerator), value.denominator);
  const f = (value: Rational) => {
    let d = value.denominator;
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    return d === 1 ? String(toNumber(value)) : latex(value);
  };
  const one = rational(1), two = rational(2);
  const prep: string[] = [];
  let idea = "", finalStep = "", result: Rational | undefined;
  const step = (label: string, expression: string, value: Rational) => `${label}: $$${expression} = ${f(value)}$$`;
  const finish = (label: string, expression: string, value: Rational) => { result = value; finalStep = step(label, expression, value); };
  const totalLabel = t("Total", "कुल", "ਕੁੱਲ");
  const averageLabel = t("Average", "औसत", "ਔਸਤ");
  const countLabel = t("Number of observations", "मानों की संख्या", "ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ");
  const oldTotalLabel = t("Total before the change", "बदलाव से पहले का कुल", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਕੁੱਲ");
  const newTotalLabel = t("Total after the change", "बदलाव के बाद का कुल", "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਦਾ ਕੁੱਲ");
  const mode = pkg.solveMode;

  switch (mode) {
    case "findSumFromAverageAndCount": {
      idea = t("The total equals the average multiplied by the number of observations.", "औसत को मानों की संख्या से गुणा करने पर कुल मिलता है।", "ਔਸਤ ਨੂੰ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ਕੁੱਲ ਮਿਲਦਾ ਹੈ।");
      prep.push(t(`There are ${f(get("count"))} observations, with an average of ${f(get("average"))}.`, `मानों की संख्या ${f(get("count"))} और औसत ${f(get("average"))} है।`, `ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ${f(get("count"))} ਅਤੇ ਔਸਤ ${f(get("average"))} ਹੈ।`));
      finish(totalLabel, `${f(get("average"))} \\times ${f(get("count"))}`, multiply(get("average"), get("count"))); break;
    }
    case "findAverageFromSumAndCount":
    case "findCountFromSumAndAverage": {
      const average = mode === "findAverageFromSumAndCount";
      idea = average
        ? t("Divide the total by the number of observations to find the average.", "औसत निकालने के लिए कुल को मानों की संख्या से भाग दें।", "ਔਸਤ ਕੱਢਣ ਲਈ ਕੁੱਲ ਨੂੰ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।")
        : t("The total divided by the average gives the number of observations.", "कुल को औसत से भाग देने पर मानों की संख्या मिलती है।", "ਕੁੱਲ ਨੂੰ ਔਸਤ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ।");
      const divisor = get(average ? "count" : "average");
      prep.push(t(`The total is ${f(get("total"))}; divide it by ${f(divisor)}.`, `कुल ${f(get("total"))} है। इसे ${f(divisor)} से भाग दें।`, `ਕੁੱਲ ${f(get("total"))} ਹੈ। ਇਸ ਨੂੰ ${f(divisor)} ਨਾਲ ਭਾਗ ਦਿਓ।`));
      finish(average ? averageLabel : countLabel, `${f(get("total"))} \\div ${f(divisor)}`, divide(get("total"), divisor)); break;
    }
    case "findMissingValueFromAverage": {
      idea = t("Find the total needed for the stated average, then subtract the known total.", "दिए गए औसत से सभी मानों का कुल निकालें। इसमें से ज्ञात मानों का कुल घटाएँ।", "ਦਿੱਤੀ ਔਸਤ ਤੋਂ ਸਾਰੇ ਮੁੱਲਾਂ ਦਾ ਕੁੱਲ ਕੱਢੋ। ਇਸ ਵਿੱਚੋਂ ਪਤਾ ਮੁੱਲਾਂ ਦਾ ਕੁੱਲ ਘਟਾਓ।");
      const total = multiply(get("count"), get("average"));
      prep.push(step(totalLabel, `${f(get("count"))} \\times ${f(get("average"))}`, total));
      finish(t("Missing value", "बाकी मान", "ਬਾਕੀ ਮੁੱਲ"), `${f(total)} - ${f(get("knownTotal"))}`, subtract(total, get("knownTotal"))); break;
    }
    case "findAverageAfterUniformTransformation": {
      const old = get("oldAverage"), factor = n(rv.factor), change = n(rv.change);
      idea = t("Apply the same operations to the average, in the same order as to each value.", "हर मान पर किए गए गुणा और जोड़ को उसी क्रम में औसत पर लागू करें।", "ਹਰ ਮੁੱਲ ਉੱਤੇ ਕੀਤੇ ਗੁਣਾ ਅਤੇ ਜੋੜ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਔਸਤ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।");
      const scaled = multiply(old, factor);
      prep.push(step(t("Average after multiplication", "गुणा करने के बाद औसत", "ਗੁਣਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਔਸਤ"), `${f(old)} \\times ${f(factor)}`, scaled));
      finish(t("New average", "नया औसत", "ਨਵੀਂ ਔਸਤ"), `${f(scaled)} + (${f(change)})`, add(scaled, change)); break;
    }
    case "findAverageOfConsecutiveSet":
    case "findAverageOfOddOrEvenSet": {
      idea = t("In an equally spaced list, the first and last terms balance around the average.", "समान अंतर वाले पदों का औसत पहले और आखिरी पद के ठीक बीच में होता है।", "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਪਦਾਂ ਦੀ ਔਸਤ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਪਦ ਦੇ ਠੀਕ ਵਿਚਕਾਰ ਹੁੰਦੀ ਹੈ।");
      const endpoints = add(get("firstTerm"), get("lastTerm"));
      prep.push(step(t("Sum of the end terms", "पहले और आखिरी पद का जोड़", "ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਪਦ ਦਾ ਜੋੜ"), `${f(get("firstTerm"))} + ${f(get("lastTerm"))}`, endpoints));
      finish(averageLabel, `${f(endpoints)} \\div 2`, divide(endpoints, two)); break;
    }
    case "findMiddleTermFromAverage": {
      idea = t("With an odd number of equally spaced terms, the middle term equals the average.", "समान अंतर वाले पदों की संख्या विषम हो, तो बीच का पद ही औसत होता है।", "ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਵਿਸ਼ਮ ਹੋਵੇ, ਤਾਂ ਵਿਚਕਾਰਲਾ ਪਦ ਹੀ ਔਸਤ ਹੁੰਦਾ ਹੈ।");
      prep.push(step(t("Position of the middle term", "बीच वाले पद का स्थान", "ਵਿਚਕਾਰਲੇ ਪਦ ਦਾ ਸਥਾਨ"), `(${f(get("count"))} + 1) \\div 2`, divide(add(get("count"), one), two)));
      result = get("average");
      finalStep = `${t("Middle term", "बीच का पद", "ਵਿਚਕਾਰਲਾ ਪਦ")}: $$${f(result)}$$`; break;
    }
    case "findExtremeFromAverageAndCount": {
      const halfSpan = divide(multiply(subtract(get("count"), one), get("commonDifference")), two);
      const smallest = v.targetExtreme === "smallest";
      idea = t("The average is halfway between the two end terms. Move half the full span to reach the requested end.", "औसत दोनों सिरों के बीच में है। सबसे छोटे या बड़े पद के लिए कुल अंतर का आधा औसत से घटाएँ या जोड़ें।", "ਔਸਤ ਦੋਵਾਂ ਸਿਰਿਆਂ ਦੇ ਵਿਚਕਾਰ ਹੈ। ਸਭ ਤੋਂ ਛੋਟਾ ਜਾਂ ਵੱਡਾ ਪਦ ਕੱਢਣ ਲਈ ਕੁੱਲ ਫਰਕ ਦਾ ਅੱਧਾ ਔਸਤ ਵਿੱਚੋਂ ਘਟਾਓ ਜਾਂ ਜੋੜੋ।");
      prep.push(step(t("Distance from the average to either end", "औसत से किसी एक सिरे तक का अंतर", "ਔਸਤ ਤੋਂ ਕਿਸੇ ਇੱਕ ਸਿਰੇ ਤੱਕ ਦਾ ਫਰਕ"), `(${f(get("count"))} - 1) \\times ${f(get("commonDifference"))} \\div 2`, halfSpan));
      finish(t(smallest ? "Smallest term" : "Largest term", smallest ? "सबसे छोटा पद" : "सबसे बड़ा पद", smallest ? "ਸਭ ਤੋਂ ਛੋਟਾ ਪਦ" : "ਸਭ ਤੋਂ ਵੱਡਾ ਪਦ"), `${f(get("average"))} ${smallest ? "-" : "+"} ${f(halfSpan)}`, smallest ? subtract(get("average"), halfSpan) : add(get("average"), halfSpan)); break;
    }
    case "findTermCountFromAverageAndExtreme":
    case "findCommonDifferenceFromAverageCountAndExtreme": {
      const average = n(rv.average), extreme = n(rv.extremeValue), distance = abs(subtract(extreme, average));
      const findCount = mode === "findTermCountFromAverageAndExtreme";
      idea = t("The average is midway between the end terms. The full span is twice the distance from the average to either end.", "औसत पहले और आखिरी पद के बीच में है। इसलिए दोनों सिरों का अंतर, औसत से किसी एक सिरे के अंतर का दोगुना है।", "ਔਸਤ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਪਦ ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਸ ਲਈ ਦੋਵਾਂ ਸਿਰਿਆਂ ਦਾ ਫਰਕ, ਔਸਤ ਤੋਂ ਕਿਸੇ ਇੱਕ ਸਿਰੇ ਦੇ ਫਰਕ ਦਾ ਦੁੱਗਣਾ ਹੈ।");
      prep.push(step(t("Full span", "दोनों सिरों का अंतर", "ਦੋਵਾਂ ਸਿਰਿਆਂ ਦਾ ਫਰਕ"), `2 \\times |${f(extreme)} - ${f(average)}|`, multiply(two, distance)));
      if (findCount) finish(countLabel, `${f(multiply(two, distance))} \\div ${f(get("commonDifference"))} + 1`, add(divide(multiply(two, distance), get("commonDifference")), one));
      else finish(t("Common difference", "हर दो क्रमागत पदों का अंतर", "ਹਰ ਦੋ ਲਗਾਤਾਰ ਪਦਾਂ ਦਾ ਫਰਕ"), `${f(multiply(two, distance))} \\div (${f(get("count"))} - 1)`, divide(multiply(two, distance), subtract(get("count"), one))); break;
    }
    case "findNewAverageAfterAddition":
    case "findNewAverageAfterRemoval":
    case "findNewAverageAfterReplacement":
    case "findAddedMemberValueFromShift":
    case "findRemovedMemberValueFromShift":
    case "findReplacementValueFromShift":
    case "findInningsValueOrNewCricketAverage": {
      const oldCount = get("oldCount"), oldAverage = get("oldAverage");
      const years = n(v.yearsElapsed ?? v.elapsedYears ?? 0);
      const currentAverage = add(oldAverage, years), currentTotal = multiply(oldCount, currentAverage);
      if (years.numerator) prep.push(step(t("Average age after the elapsed years", "इतने वर्ष बाद औसत आयु", "ਇੰਨੇ ਸਾਲਾਂ ਬਾਅਦ ਔਸਤ ਉਮਰ"), `${f(oldAverage)} + ${f(years)}`, currentAverage));
      prep.push(step(oldTotalLabel, `${f(oldCount)} \\times ${f(currentAverage)}`, currentTotal));
      const replacement = mode.includes("Replacement");
      const removal = mode.includes("Removal") || mode.includes("Removed");
      const newCount = replacement ? oldCount : removal ? subtract(oldCount, one) : add(oldCount, one);
      idea = replacement
        ? t("A replacement changes the total, but the number of observations stays the same.", "एक मान बदलने से कुल बदलता है, लेकिन मानों की संख्या वही रहती है।", "ਇੱਕ ਮੁੱਲ ਬਦਲਣ ਨਾਲ ਕੁੱਲ ਬਦਲਦਾ ਹੈ, ਪਰ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।")
        : removal
          ? t("Subtract the outgoing value from the total and reduce the count by one.", "हटाए गए मान को कुल से घटाएँ। मानों की संख्या भी एक कम होगी।", "ਹਟਾਏ ਮੁੱਲ ਨੂੰ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਓ। ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਵੀ ਇੱਕ ਘੱਟ ਹੋਵੇਗੀ।")
          : t("Add the incoming value to the total and increase the count by one.", "नए मान को कुल में जोड़ें। मानों की संख्या भी एक बढ़ेगी।", "ਨਵੇਂ ਮੁੱਲ ਨੂੰ ਕੁੱਲ ਵਿੱਚ ਜੋੜੋ। ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਵੀ ਇੱਕ ਵਧੇਗੀ।");
      if (years.numerator) idea = t("First increase the average age by the elapsed years, since everyone already in the group has grown older. Then account for the membership change.", "पहले बीते वर्षों को औसत आयु में जोड़ें, क्योंकि पुराने समूह के सभी लोगों की आयु बढ़ी है। फिर सदस्य के जुड़ने या जाने का हिसाब करें।", "ਪਹਿਲਾਂ ਬੀਤੇ ਸਾਲ ਔਸਤ ਉਮਰ ਵਿੱਚ ਜੋੜੋ, ਕਿਉਂਕਿ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਸਾਰੇ ਲੋਕਾਂ ਦੀ ਉਮਰ ਵਧੀ ਹੈ। ਫਿਰ ਮੈਂਬਰ ਦੇ ਜੁੜਨ ਜਾਂ ਜਾਣ ਦਾ ਹਿਸਾਬ ਕਰੋ।");
      const cricket = mode === "findInningsValueOrNewCricketAverage";
      const forward = mode === "findNewAverageAfterAddition" || mode === "findNewAverageAfterRemoval" || mode === "findNewAverageAfterReplacement" || (cricket && pkg.parameters.answerType === "AVERAGE");
      if (forward) {
        let newTotal: Rational, expression: string;
        if (replacement) {
          newTotal = add(subtract(currentTotal, get("oldValue")), get("newValue"));
          expression = `${f(currentTotal)} - ${f(get("oldValue"))} + ${f(get("newValue"))}`;
        } else {
          const member = removal ? get("removedValue") : n(v.addedValue ?? v.nextScore);
          newTotal = removal ? subtract(currentTotal, member) : add(currentTotal, member);
          expression = `${f(currentTotal)} ${removal ? "-" : "+"} ${f(member)}`;
        }
        prep.push(step(newTotalLabel, expression, newTotal));
        prep.push(step(t("New count", "नई संख्या", "ਨਵੀਂ ਗਿਣਤੀ"), `${f(oldCount)} ${replacement ? "+ 0" : removal ? "- 1" : "+ 1"}`, newCount));
        finish(averageLabel, `${f(newTotal)} \\div ${f(newCount)}`, divide(newTotal, newCount));
      } else {
        prep.push(step(t("New count", "नई संख्या", "ਨਵੀਂ ਗਿਣਤੀ"), `${f(oldCount)} ${replacement ? "+ 0" : removal ? "- 1" : "+ 1"}`, newCount));
        const targetTotal = multiply(newCount, get("newAverage"));
        prep.push(step(newTotalLabel, `${f(newCount)} \\times ${f(get("newAverage"))}`, targetTotal));
        if (replacement) {
          const delta = subtract(targetTotal, currentTotal);
          prep.push(step(t("Change in the total", "कुल में बदलाव", "ਕੁੱਲ ਵਿੱਚ ਬਦਲਾਅ"), `${f(targetTotal)} - ${f(currentTotal)}`, delta));
          const findOld = v.replacementTarget === "old";
          const known = get(findOld ? "newValue" : "oldValue");
          finish(t(findOld ? "Outgoing value" : "Replacement value", findOld ? "हटाया गया मान" : "नया मान", findOld ? "ਹਟਾਇਆ ਮੁੱਲ" : "ਨਵਾਂ ਮੁੱਲ"), `${f(known)} ${findOld ? "-" : "+"} (${f(delta)})`, findOld ? subtract(known, delta) : add(known, delta));
        } else {
          idea = years.numerator ? idea : t("Find the totals before and after the change. Their difference is the value added or removed.", "बदलाव से पहले और बाद का कुल निकालें। दोनों का अंतर ही जोड़ा या हटाया गया मान है।", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦਾ ਕੁੱਲ ਕੱਢੋ। ਦੋਵਾਂ ਦਾ ਫਰਕ ਹੀ ਜੋੜਿਆ ਜਾਂ ਹਟਾਇਆ ਮੁੱਲ ਹੈ।");
          finish(t(cricket ? "Runs needed in the next innings" : removal ? "Removed value" : "Added value", cricket ? "अगली पारी में आवश्यक रन" : removal ? "हटाया गया मान" : "जोड़ा गया मान", cricket ? "ਅਗਲੀ ਪਾਰੀ ਵਿੱਚ ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ" : removal ? "ਹਟਾਇਆ ਮੁੱਲ" : "ਜੋੜਿਆ ਮੁੱਲ"), removal ? `${f(currentTotal)} - ${f(targetTotal)}` : `${f(targetTotal)} - ${f(currentTotal)}`, removal ? subtract(currentTotal, targetTotal) : subtract(targetTotal, currentTotal));
        }
      } break;
    }
    case "findOriginalCountFromJoiningMemberShift":
    case "findOriginalCountFromLeavingMemberShift": {
      const joining = mode === "findOriginalCountFromJoiningMemberShift";
      const old = get("oldAverage"), next = get("newAverage"), delta = subtract(next, old);
      const member = get(joining ? "addedValue" : "removedValue");
      idea = t("Let n be the original count. Write the total before and after the person joins or leaves.", "पहले की संख्या n मानें। व्यक्ति के जुड़ने या जाने से पहले और बाद के कुल बराबर करके समीकरण बनाएँ।", "ਪਹਿਲਾਂ ਦੀ ਗਿਣਤੀ n ਮੰਨੋ। ਵਿਅਕਤੀ ਦੇ ਜੁੜਨ ਜਾਂ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੇ ਕੁੱਲ ਤੋਂ ਸਮੀਕਰਨ ਬਣਾਓ।");
      prep.push(`$$${f(old)}n ${joining ? "+" : "-"} ${f(member)} = ${f(next)}(n ${joining ? "+" : "-"} 1)$$`);
      const numerator = joining ? subtract(member, next) : subtract(next, member);
      prep.push(`$$(${f(next)} - ${f(old)})n = ${joining ? `${f(member)} - ${f(next)}` : `${f(next)} - ${f(member)}`}$$`);
      finish(t("Original count", "पहले की संख्या", "ਪਹਿਲਾਂ ਦੀ ਗਿਣਤੀ"), `${f(numerator)} \\div (${f(delta)})`, divide(numerator, delta)); break;
    }
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups":
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups":
    case "findOverallTotalFromHierarchy": {
      const counts = (v.groupCounts ?? v.subgroupCounts)!.map(n);
      const averages = (v.groupAverages ?? v.subgroupAverages)!;
      const totals = counts.map((count, i) => multiply(count, averages[i]!));
      idea = t("Find each group's total first. Add the totals and the counts separately.", "पहले हर समूह का कुल निकालें। फिर सभी समूहों के कुल और सदस्यों की संख्याएँ अलग-अलग जोड़ें।", "ਪਹਿਲਾਂ ਹਰ ਸਮੂਹ ਦਾ ਕੁੱਲ ਕੱਢੋ। ਫਿਰ ਸਾਰੇ ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਅਤੇ ਮੈਂਬਰਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਵੱਖ-ਵੱਖ ਜੋੜੋ।");
      totals.forEach((value, i) => prep.push(step(t(`Group ${i + 1} total`, `समूह ${i + 1} का कुल`, `ਸਮੂਹ ${i + 1} ਦਾ ਕੁੱਲ`), `${f(counts[i]!)} \\times ${f(averages[i]!)}`, value)));
      const total = sum(totals), count = sum(counts);
      if (mode === "findOverallTotalFromHierarchy") finish(totalLabel, totals.map(f).join(" + "), total);
      else {
        prep.push(step(totalLabel, totals.map(f).join(" + "), total));
        prep.push(step(t("Combined count", "सभी समूहों की कुल संख्या", "ਸਾਰੇ ਸਮੂਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ"), counts.map(f).join(" + "), count));
        finish(averageLabel, `${f(total)} \\div ${f(count)}`, divide(total, count));
      } break;
    }
    case "findGroupCountFromCombinedAverage":
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": {
      const hierarchy = pkg.canonicalProblemId === "AVG-CP-006";
      const three = mode === "findMissingSubgroupCount";
      const counts = hierarchy ? v.subgroupCounts! : [v.knownGroupCount!];
      const averages = hierarchy ? v.subgroupAverages! : [v.knownGroupAverage!, v.unknownGroupAverage!];
      const knownCounts = (three ? counts.slice(0, 2) : counts.slice(0, 1)).map(n);
      const knownTotal = sum(knownCounts.map((count, i) => multiply(count, averages[i]!)));
      const knownCount = sum(knownCounts);
      const combined = hierarchy ? get("overallAverage") : get("combinedAverage");
      const unknownAverage = hierarchy ? averages[2]! : v.unknownGroupAverage!;
      idea = t("Let n be the missing group size. The sum of the group totals must equal the combined average multiplied by the combined count.", "जिस समूह की संख्या पूछी गई है, उसे n मानें। सभी समूहों का कुल, संयुक्त औसत और कुल संख्या के गुणनफल के बराबर होगा।", "ਜਿਸ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਪੁੱਛੀ ਹੈ, ਉਸ ਨੂੰ n ਮੰਨੋ। ਸਾਰੇ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ, ਸਾਂਝੀ ਔਸਤ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗਾ।");
      prep.push(step(t("Known total", "ज्ञात समूहों का कुल", "ਪਤਾ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ"), knownCounts.map((c, i) => `${f(c)} \\times ${f(averages[i]!)}`).join(" + "), knownTotal));
      prep.push(`$$${f(knownTotal)} + ${f(unknownAverage)}n = ${f(combined)}(${f(knownCount)} + n)$$`);
      const numerator = subtract(multiply(combined, knownCount), knownTotal), denominator = subtract(unknownAverage, combined);
      prep.push(`$$(${f(unknownAverage)} - ${f(combined)})n = ${f(combined)} \\times ${f(knownCount)} - ${f(knownTotal)} = ${f(numerator)}$$`);
      finish(t("Missing group size", "समूह की संख्या", "ਸਮੂਹ ਦੀ ਗਿਣਤੀ"), `${f(numerator)} \\div (${f(denominator)})`, divide(numerator, denominator)); break;
    }
    case "findMissingGroupAverage":
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": {
      const hierarchy = pkg.canonicalProblemId === "AVG-CP-006";
      const counts = (hierarchy ? v.subgroupCounts! : v.groupCounts!).map(n);
      const averages = hierarchy ? v.subgroupAverages! : v.groupAverages!;
      const index = hierarchy ? (v.missingSubgroupIndex ?? 2) : 1;
      const count = sum(counts), combined = hierarchy ? get("overallAverage") : get("combinedAverage");
      const total = multiply(count, combined);
      const knownIndices = counts.map((_, i) => i).filter(i => i !== index);
      const known = sum(knownIndices.map(i => multiply(counts[i]!, averages[i]!)));
      idea = t("Subtract the known group totals from the combined total. Divide what remains by the missing group's count.", "पूरे कुल में से ज्ञात समूहों का कुल घटाएँ। बची राशि को बाकी समूह की संख्या से भाग दें।", "ਪੂਰੇ ਕੁੱਲ ਵਿੱਚੋਂ ਪਤਾ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ ਘਟਾਓ। ਬਾਕੀ ਰਕਮ ਨੂੰ ਬਾਕੀ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।");
      prep.push(step(totalLabel, `${f(count)} \\times ${f(combined)}`, total));
      prep.push(step(t("Known total", "ज्ञात समूहों का कुल", "ਪਤਾ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ"), knownIndices.map(i => `${f(counts[i]!)} \\times ${f(averages[i]!)}`).join(" + "), known));
      const missing = subtract(total, known);
      prep.push(step(t("Remaining group's total", "बाकी समूह का कुल", "ਬਾਕੀ ਸਮੂਹ ਦਾ ਕੁੱਲ"), `${f(total)} - ${f(known)}`, missing));
      finish(averageLabel, `${f(missing)} \\div ${f(counts[index]!)}`, divide(missing, counts[index]!)); break;
    }
    case "findSubgroupTotalFromAverageAndCount": {
      const count = n(v.subgroupCounts![0]), average = v.subgroupAverages![0]!;
      idea = t("Multiply this group's average by its own count.", "इस समूह के औसत को इसी समूह की संख्या से गुणा करें।", "ਇਸ ਸਮੂਹ ਦੀ ਔਸਤ ਨੂੰ ਇਸੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।");
      prep.push(t(`Use ${f(count)} members and an average of ${f(average)}.`, `इस समूह की संख्या ${f(count)} और औसत ${f(average)} है।`, `ਇਸ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ${f(count)} ਅਤੇ ਔਸਤ ${f(average)} ਹੈ।`));
      finish(totalLabel, `${f(count)} \\times ${f(average)}`, multiply(count, average)); break;
    }
    case "findGroupCountRatioFromCombinedAverage": {
      const a = v.groupAverages![0]!, b = v.groupAverages![1]!, combined = get("combinedAverage");
      const gap1 = subtract(combined, a), gap2 = subtract(b, combined);
      idea = t("The shortfall of the first group from the combined average must balance the second group's surplus.", "पहले समूह का औसत संयुक्त औसत से जितना कम है, उसकी कुल कमी दूसरे समूह की कुल बढ़त से बराबर होगी।", "ਪਹਿਲੇ ਸਮੂਹ ਦੀ ਔਸਤ ਸਾਂਝੀ ਔਸਤ ਤੋਂ ਜਿੰਨੀ ਘੱਟ ਹੈ, ਉਸ ਦੀ ਕੁੱਲ ਘਾਟ ਦੂਜੇ ਸਮੂਹ ਦੇ ਕੁੱਲ ਵਾਧੇ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗੀ।");
      prep.push(`$$n_1(${f(combined)} - ${f(a)}) = n_2(${f(b)} - ${f(combined)})$$`);
      result = divide(gap2, gap1);
      finalStep = `${t("First group : second group", "पहला समूह : दूसरा समूह", "ਪਹਿਲਾ ਸਮੂਹ : ਦੂਜਾ ਸਮੂਹ")}: $$n_1:n_2 = ${f(gap2)}:${f(gap1)} = ${result.numerator}:${result.denominator}$$`; break;
    }
    case "findAverageSpeedEqualDistance":
    case "findAverageSpeedEqualTime":
    case "findAverageSpeedForUnequalDistances":
    case "findAverageSpeedForUnequalTimes": {
      const s1 = get("speed1"), s2 = get("speed2");
      const equalDistance = mode === "findAverageSpeedEqualDistance", equalTime = mode === "findAverageSpeedEqualTime";
      const distancesGiven = equalDistance || mode === "findAverageSpeedForUnequalDistances";
      idea = t("Average speed is the total distance divided by the total travelling time.", "औसत चाल, कुल दूरी को कुल समय से भाग देने पर मिलती है।", "ਔਸਤ ਚਾਲ, ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਮਿਲਦੀ ਹੈ।");
      let distance: Rational, time: Rational;
      if (distancesGiven) {
        const d1 = equalDistance ? one : n(rv.distance1), d2 = equalDistance ? one : n(rv.distance2);
        if (equalDistance) prep.push(t("Take each equal stretch as 1 km; the choice of distance does not affect the average speed.", "दोनों बराबर दूरियाँ 1-1 किमी मान लें। बराबर दूरी का कोई भी मान लेने से औसत चाल वही रहेगी।", "ਦੋਵੇਂ ਬਰਾਬਰ ਦੂਰੀਆਂ 1-1 ਕਿਮੀ ਮੰਨ ਲਓ। ਬਰਾਬਰ ਦੂਰੀ ਦਾ ਕੋਈ ਵੀ ਮੁੱਲ ਲੈਣ ਨਾਲ ਔਸਤ ਚਾਲ ਉਹੀ ਰਹੇਗੀ।"));
        const times = [divide(d1, s1), divide(d2, s2)];
        prep.push(step(t("First part's time (hours)", "पहले भाग का समय (घंटे)", "ਪਹਿਲੇ ਹਿੱਸੇ ਦਾ ਸਮਾਂ (ਘੰਟੇ)"), `${f(d1)} \\div ${f(s1)}`, times[0]!));
        prep.push(step(t("Second part's time (hours)", "दूसरे भाग का समय (घंटे)", "ਦੂਜੇ ਹਿੱਸੇ ਦਾ ਸਮਾਂ (ਘੰਟੇ)"), `${f(d2)} \\div ${f(s2)}`, times[1]!));
        distance = add(d1, d2); time = sum(times);
        prep.push(step(t("Total time (hours)", "कुल समय (घंटे)", "ਕੁੱਲ ਸਮਾਂ (ਘੰਟੇ)"), times.map(f).join(" + "), time));
        prep.push(step(t("Total distance (km)", "कुल दूरी (किमी)", "ਕੁੱਲ ਦੂਰੀ (ਕਿਮੀ)"), `${f(d1)} + ${f(d2)}`, distance));
      } else {
        const t1 = equalTime ? one : n(rv.time1), t2 = equalTime ? one : n(rv.time2);
        if (equalTime) prep.push(t("Take each equal duration as 1 hour.", "दोनों बराबर समय 1-1 घंटा मान लें।", "ਦੋਵੇਂ ਬਰਾਬਰ ਸਮੇਂ 1-1 ਘੰਟਾ ਮੰਨ ਲਓ।"));
        const distances = [multiply(s1, t1), multiply(s2, t2)];
        distances.forEach((d, i) => prep.push(step(t(`Part ${i + 1} distance (km)`, `भाग ${i + 1} की दूरी (किमी)`, `ਹਿੱਸਾ ${i + 1} ਦੀ ਦੂਰੀ (ਕਿਮੀ)`), `${f(i ? s2 : s1)} \\times ${f(i ? t2 : t1)}`, d)));
        distance = sum(distances); time = add(t1, t2);
        prep.push(step(t("Total distance (km)", "कुल दूरी (किमी)", "ਕੁੱਲ ਦੂਰੀ (ਕਿਮੀ)"), distances.map(f).join(" + "), distance));
        prep.push(step(t("Total time (hours)", "कुल समय (घंटे)", "ਕੁੱਲ ਸਮਾਂ (ਘੰਟੇ)"), `${f(t1)} + ${f(t2)}`, time));
      }
      finish(t("Average speed (km/h)", "औसत चाल (किमी/घंटा)", "ਔਸਤ ਚਾਲ (ਕਿਮੀ/ਘੰਟਾ)"), `${f(distance)} \\div (${f(time)})`, divide(distance, time)); break;
    }
    case "findCorrectedAverageFromMistake":
    case "findReportedAverageBeforeCorrection":
    case "findCorrectValueFromAverageShift":
    case "findIncorrectValueFromCorrection":
    case "findEntryDifferenceFromAverageCorrection":
    case "findAverageChangeFromEntryCorrection":
    case "findNumberOfItemsFromTotalCorrection":
    case "findCorrectedAverageFromMultipleMistakes": {
      idea = t("A correction changes the total by the correct value minus the recorded value. The count stays the same.", "कुल में बदलाव, सही मान में से दर्ज मान घटाने के बराबर है। मानों की संख्या वही रहती है।", "ਕੁੱਲ ਵਿੱਚ ਬਦਲਾਅ, ਸਹੀ ਮੁੱਲ ਵਿੱਚੋਂ ਦਰਜ ਮੁੱਲ ਘਟਾਉਣ ਦੇ ਬਰਾਬਰ ਹੈ। ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਉਹੀ ਰਹਿੰਦੀ ਹੈ।");
      const count = get("count");
      if (mode === "findCorrectValueFromAverageShift" || mode === "findIncorrectValueFromCorrection" || mode === "findEntryDifferenceFromAverageCorrection") {
        const change = subtract(get("correctedAverage"), get("reportedAverage"));
        const correction = multiply(count, change);
        prep.push(step(t("Change in average", "औसत में बदलाव", "ਔਸਤ ਵਿੱਚ ਬਦਲਾਅ"), `${f(get("correctedAverage"))} - ${f(get("reportedAverage"))}`, change));
        prep.push(step(t("Change in total", "कुल में बदलाव", "ਕੁੱਲ ਵਿੱਚ ਬਦਲਾਅ"), `${f(count)} \\times (${f(change)})`, correction));
        if (mode === "findEntryDifferenceFromAverageCorrection") finish(t("Difference between the two values", "दोनों मानों का अंतर", "ਦੋਵਾਂ ਮੁੱਲਾਂ ਦਾ ਫਰਕ"), `|${f(correction)}|`, abs(correction));
        else {
          const correct = mode === "findCorrectValueFromAverageShift", known = get(correct ? "incorrectValue" : "correctValue");
          finish(t(correct ? "Correct value" : "Previously recorded value", correct ? "सही मान" : "पहले दर्ज मान", correct ? "ਸਹੀ ਮੁੱਲ" : "ਪਹਿਲਾਂ ਦਰਜ ਮੁੱਲ"), `${f(known)} ${correct ? "+" : "-"} (${f(correction)})`, correct ? add(known, correction) : subtract(known, correction));
        }
      } else {
        let correction: Rational;
        if (mode === "findCorrectedAverageFromMultipleMistakes") {
          const corrections = v.correctValues!.map((value, i) => subtract(value, v.incorrectValues![i]!));
          corrections.forEach((value, i) => prep.push(step(t(`Correction ${i + 1}`, `सुधार ${i + 1}`, `ਸੋਧ ${i + 1}`), `${f(v.correctValues![i]!)} - ${f(v.incorrectValues![i]!)}`, value)));
          correction = sum(corrections);
          prep.push(step(t("Net change in total", "कुल में पूरा बदलाव", "ਕੁੱਲ ਵਿੱਚ ਪੂਰਾ ਬਦਲਾਅ"), corrections.map(c => `(${f(c)})`).join(" + "), correction));
        } else {
          correction = subtract(get("correctValue"), get("incorrectValue"));
          prep.push(step(t("Change in total", "कुल में बदलाव", "ਕੁੱਲ ਵਿੱਚ ਬਦਲਾਅ"), `${f(get("correctValue"))} - ${f(get("incorrectValue"))}`, correction));
        }
        if (mode === "findNumberOfItemsFromTotalCorrection") {
          const change = abs(get("averageChange"));
          finish(countLabel, `${f(abs(correction))} \\div ${f(change)}`, divide(abs(correction), change));
        } else if (mode === "findAverageChangeFromEntryCorrection") {
          finish(t("Amount of change in average", "औसत में बदलाव का परिमाण", "ਔਸਤ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ"), `${f(abs(correction))} \\div ${f(count)}`, divide(abs(correction), count));
        } else {
          const change = divide(correction, count);
          prep.push(step(t("Change in average", "औसत में बदलाव", "ਔਸਤ ਵਿੱਚ ਬਦਲਾਅ"), `${f(correction)} \\div ${f(count)}`, change));
          const reverse = mode === "findReportedAverageBeforeCorrection", base = get(reverse ? "correctedAverage" : "reportedAverage");
          finish(t(reverse ? "Previously reported average" : "Correct average", reverse ? "पहले बताया गया औसत" : "सही औसत", reverse ? "ਪਹਿਲਾਂ ਦੱਸੀ ਔਸਤ" : "ਸਹੀ ਔਸਤ"), `${f(base)} ${reverse ? "-" : "+"} (${f(change)})`, reverse ? subtract(base, change) : add(base, change));
        }
      } break;
    }
    default: {
      const exhaustive: never = mode;
      throw new Error(`Missing Average explanation: ${exhaustive}`);
    }
  }

  if (!result || !equals(result, pkg.solver.exactAnswer) || !equals(result, pkg.independentVerification.exactAnswer)) {
    throw new Error(`${pkg.questionLanguageId}: explanation arithmetic disagrees with the verified answer`);
  }
  // Units come from the question, never from a substring such as "age" in "average".
  const stem = pkg.stem;
  const unit = pkg.parameters.answerType === "COUNT" || pkg.parameters.answerType === "RATIO" ? ""
    : /km\/h|किमी\/घंटा|ਕਿਮੀ\/ਘੰਟਾ/.test(stem) ? t(" km/h", " किमी/घंटा", " ਕਿਮੀ/ਘੰਟਾ")
    : /\bkg\b|किग्रा|किलोग्राम|ਕਿਲੋਗ੍ਰਾਮ/.test(stem) ? t(" kg", " किग्रा", " ਕਿਲੋਗ੍ਰਾਮ")
    : /\bruns?\b|रन|ਦੌੜਾਂ/.test(stem) ? t(" runs", " रन", " ਦੌੜਾਂ")
    : /\bmarks?\b|अंक|ਅੰਕ/.test(stem) ? t(" marks", " अंक", " ਅੰਕ")
    : /\byears?\b|वर्ष|साल|ਸਾਲ/.test(stem) ? t(" years", " वर्ष", " ਸਾਲ")
    : /\bkm\b|किमी|ਕਿਮੀ/.test(stem) ? t(" km", " किमी", " ਕਿਮੀ")
    : /\bunits?\b|इकाइ|ਇਕਾਈ/.test(stem) ? t(" units", " इकाइयाँ", " ਇਕਾਈਆਂ") : "";
  const numeric = pkg.parameters.answerType === "RATIO" ? `${result.numerator}:${result.denominator}` : f(result);
  const currency = pkg.parameters.answerType !== "COUNT" && pkg.parameters.answerType !== "RATIO" && stem.includes("₹");
  const answer = `${currency ? "₹" : ""}${numeric}${currency ? "" : unit}`;
  const conclusion = t(`Therefore, the required answer is ${answer}.`, `इसलिए उत्तर ${answer} है।`, `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`);
  const lines = [idea, prep.join("\n\n"), finalStep, conclusion];
  // Historical schema/shortcut checks describe text replaced above. Retire those
  // claims while preserving all mathematical, option and release validations.
  const checks = pkg.validation.checks.filter(check => !/explanation|localized-exam-strategy/.test(check.name));
  checks.push({ name: "avg001-complete-learner-explanation", passed: lines.every(line => line.trim().length > 0), message: "Complete authored working agrees exactly with both mathematical authorities" });
  return { ...pkg, explanation: { lines }, validation: { valid: checks.every(check => check.passed), checks }, traceability: { ...pkg.traceability, learnerExplanationRevision: AVG_001_COMPLETE_EXPLANATION } };
}
