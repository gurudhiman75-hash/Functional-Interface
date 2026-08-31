import { subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money } from "./parameter-generator";
import type { Prt001PilotParameters, Prt001Solution, Prt001TaskAnswer } from "./types";

function formatWhole(value: bigint): string {
  return new Intl.NumberFormat("en-IN").format(Number(value));
}

function replaceInternalAllocationKinds(line: string, language: "hi" | "pa"): string {
  const labels = language === "hi"
    ? {
        SALARY: "वेतन",
        COMMISSION: "कमीशन",
        BONUS: "बोनस",
        CHARITY: "दान",
        RESERVE: "रिजर्व",
        EXPENSE: "व्यावसायिक खर्च",
      }
    : {
        SALARY: "ਤਨਖਾਹ",
        COMMISSION: "ਕਮਿਸ਼ਨ",
        BONUS: "ਬੋਨਸ",
        CHARITY: "ਦਾਨ",
        RESERVE: "ਰਿਜ਼ਰਵ",
        EXPENSE: "ਵਪਾਰਕ ਖਰਚ",
      };
  return Object.entries(labels).reduce(
    (current, [internal, localized]) => current.replace(new RegExp(`\\b${internal}\\b`, "g"), localized),
    line,
  );
}

function cleanLocalizedLine(line: string, language: "hi" | "pa", answer: Prt001TaskAnswer): string {
  let cleaned = replaceInternalAllocationKinds(line, language);
  if (language === "hi") {
    cleaned = cleaned
      .replace(`प्रश्न में दी गई शर्त लागू करने पर आवश्यक उत्तर ${answer.display} है।`, `अतः उत्तर ${answer.display} है।`)
      .replace(/; प्रश्न की अज्ञात राशि या समय इसी संबंध से निकाला जाता है।/g, "।");
  } else {
    cleaned = cleaned
      .replace(`ਸਵਾਲ ਦੀ ਦਿੱਤੀ ਸ਼ਰਤ ਲਾਗੂ ਕਰਨ ਤੇ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answer.display} ਹੈ।`, `ਇਸ ਲਈ ਉੱਤਰ ${answer.display} ਹੈ।`)
      .replace(/; ਸਵਾਲ ਦੀ ਅਣਜਾਣ ਰਕਮ ਜਾਂ ਸਮਾਂ ਇਸੇ ਸੰਬੰਧ ਤੋਂ ਨਿਕਲਦਾ ਹੈ।/g, "।");
  }
  return cleaned;
}

function renderBaselineInverseLocalized(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
}): string[] | undefined {
  const { parameters, solution, answer } = input;
  if (parameters.language === "en") return undefined;
  const language = parameters.language;
  const [partnerA, partnerB] = parameters.state.partners;
  const [segmentA, segmentB] = parameters.state.partners.map((partner) => partner.capitalSegments[0]!);
  const durationA = subtractRational(segmentA!.end, segmentA!.start);
  const durationB = subtractRational(segmentB!.end, segmentB!.start);
  const ratio = solution.normalizedRatio.join(":");
  const totalDuration = parameters.state.totalDuration;

  if (language === "hi") {
    switch (parameters.entry.solveMode) {
      case "findUnknownCapitalFromShareRatioAndDurations":
        return [
          `लाभ अनुपात पूंजी × समय के अनुपात के बराबर है। इसलिए x × ${formatPrt001Duration(durationA, "hi")} : ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB, "hi")} = ${ratio}।`,
          `इस समीकरण को हल करने पर ${partnerA!.partnerId} की पूंजी x = ${answer.display} मिलती है।`,
          `अतः आवश्यक पूंजी ${answer.display} है।`,
        ];
      case "findUnknownDurationFromShareRatioAndCapitals":
        return [
          `लाभ अनुपात पूंजी × समय से बनता है। इसलिए ${formatPrt001Money(segmentA!.capital)} × x : ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB, "hi")} = ${ratio}।`,
          `समीकरण से ${partnerA!.partnerId} की निवेश अवधि x = ${answer.display} मिलती है।`,
          `अतः आवश्यक अवधि ${answer.display} है।`,
        ];
      case "findUnknownJoinTimeFromProfitRatio":
        return [
          `${partnerA!.partnerId} का योगदान ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration, "hi")} है। यदि ${partnerB!.partnerId} x महीने बाद जुड़ा, तो उसकी सक्रिय अवधि ${formatPrt001Duration(totalDuration, "hi")} − x होगी।`,
          `अतः ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration, "hi")} : ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration, "hi")} − x) = ${ratio}; इससे x = ${answer.display}।`,
          `इसलिए ${partnerB!.partnerId} ${answer.display} बाद शामिल हुआ।`,
        ];
      case "findUnknownAddedCapitalFromProfitRatio": {
        const [firstA] = partnerA!.capitalSegments;
        const changeTime = firstA!.end;
        const remainingTime = subtractRational(totalDuration, changeTime);
        return [
          `${partnerA!.partnerId} का पूंजी-समय योगदान ${formatPrt001Money(firstA!.capital)} × ${formatPrt001Duration(changeTime, "hi")} + (${formatPrt001Money(firstA!.capital)} + x) × ${formatPrt001Duration(remainingTime, "hi")} है।`,
          `${partnerB!.partnerId} का योगदान ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(totalDuration, "hi")} है। दोनों को लाभ अनुपात ${ratio} में रखने पर x = ${answer.display} मिलता है।`,
          `अतः जोड़ी गई पूंजी ${answer.display} है।`,
        ];
      }
      case "findEventTimeForEqualProfitShares": {
        const [firstA, secondA] = partnerA!.capitalSegments;
        return [
          `बराबर लाभ के लिए दोनों के पूंजी-समय योगदान बराबर होंगे। यदि बदलाव x महीने बाद हुआ, तो ${partnerA!.partnerId} का योगदान ${formatPrt001Money(firstA!.capital)} × x + ${formatPrt001Money(secondA!.capital)} × (${formatPrt001Duration(totalDuration, "hi")} − x) है।`,
          `${partnerB!.partnerId} का योगदान ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(totalDuration, "hi")} है। दोनों को बराबर रखने पर x = ${answer.display}।`,
          `अतः पूंजी ${answer.display} बाद बदली गई।`,
        ];
      }
      case "findUnknownCapitalInThreePartnerSystem": {
        const partnerC = parameters.state.partners[2]!;
        const segmentC = partnerC.capitalSegments[0]!;
        const durationC = subtractRational(segmentC.end, segmentC.start);
        const ratioA = solution.normalizedRatio[0]!;
        const ratioC = solution.normalizedRatio[2]!;
        return [
          `${partnerA!.partnerId} का ज्ञात योगदान ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(durationA, "hi")} = ${formatWhole(solution.timeline.weights[0]!.effectiveCapital.numerator)} है।`,
          `लाभ में ${partnerA!.partnerId}:${partnerC.partnerId} के भाग ${ratioA}:${ratioC} हैं, इसलिए x × ${formatPrt001Duration(durationC, "hi")} का उसी अनुपात में होना आवश्यक है। इससे x = ${answer.display}।`,
          `अतः ${partnerC.partnerId} की पूंजी ${answer.display} है।`,
        ];
      }
      case "findUnknownSalaryFromFinalPartnerReceipts": {
        const partA = solution.normalizedRatio[0]!;
        const totalParts = solution.normalizedRatio.reduce((sum, part) => sum + part, 0n);
        return [
          `समान निवेश अवधि में शेष लाभ ${ratio} में बँटेगा। वेतन s मानें; तब ${partnerA!.partnerId} की अंतिम प्राप्ति = s + ${partA}/${totalParts} × (${parameters.renderVariables.totalProfit} − s)।`,
          `यह प्राप्ति ${parameters.renderVariables.finalReceipt} दी है। समीकरण हल करने पर s = ${answer.display}।`,
          `अतः वेतन ${answer.display} है।`,
        ];
      }
      case "findUnknownJoinTimeWithPreDistributionDeduction": {
        const deduction = solution.pool.executions[0]?.amount;
        return [
          `पहले ${deduction ? formatPrt001Money(deduction) : String(parameters.renderVariables.deduction)} घटाने पर बाँटने योग्य लाभ ${formatPrt001Money(solution.pool.distributablePool)} बचता है।`,
          `${partnerB!.partnerId} का ज्ञात हिस्सा ${parameters.renderVariables.knownShare} उसके अनुपातिक भाग तय करता है। यदि वह x महीने बाद जुड़ा, तो उसका योगदान ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration, "hi")} − x) होगा; पूंजी-समय अनुपात से x = ${answer.display}।`,
          `अतः ${partnerB!.partnerId} ${answer.display} बाद शामिल हुआ।`,
        ];
      }
    }
  }

  switch (parameters.entry.solveMode) {
    case "findUnknownCapitalFromShareRatioAndDurations":
      return [
        `ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਪੂੰਜੀ × ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ। ਇਸ ਲਈ x × ${formatPrt001Duration(durationA, "pa")} : ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB, "pa")} = ${ratio}।`,
        `ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਤੇ ${partnerA!.partnerId} ਦੀ ਪੂੰਜੀ x = ${answer.display} ਮਿਲਦੀ ਹੈ।`,
        `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਪੂੰਜੀ ${answer.display} ਹੈ।`,
      ];
    case "findUnknownDurationFromShareRatioAndCapitals":
      return [
        `ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ਪੂੰਜੀ × ਸਮੇਂ ਤੋਂ ਬਣਦਾ ਹੈ। ਇਸ ਲਈ ${formatPrt001Money(segmentA!.capital)} × x : ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(durationB, "pa")} = ${ratio}।`,
        `ਸਮੀਕਰਨ ਤੋਂ ${partnerA!.partnerId} ਦੀ ਨਿਵੇਸ਼ ਮਿਆਦ x = ${answer.display} ਮਿਲਦੀ ਹੈ।`,
        `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਮਿਆਦ ${answer.display} ਹੈ।`,
      ];
    case "findUnknownJoinTimeFromProfitRatio":
      return [
        `${partnerA!.partnerId} ਦਾ ਯੋਗਦਾਨ ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration, "pa")} ਹੈ। ਜੇ ${partnerB!.partnerId} x ਮਹੀਨੇ ਬਾਅਦ ਜੁੜਿਆ, ਤਾਂ ਉਸਦੀ ਸਰਗਰਮ ਮਿਆਦ ${formatPrt001Duration(totalDuration, "pa")} − x ਹੋਵੇਗੀ।`,
        `ਇਸ ਲਈ ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(totalDuration, "pa")} : ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration, "pa")} − x) = ${ratio}; ਇਸ ਤੋਂ x = ${answer.display}।`,
        `ਅਤੇ ${partnerB!.partnerId} ${answer.display} ਬਾਅਦ ਸ਼ਾਮਲ ਹੋਇਆ।`,
      ];
    case "findUnknownAddedCapitalFromProfitRatio": {
      const [firstA] = partnerA!.capitalSegments;
      const changeTime = firstA!.end;
      const remainingTime = subtractRational(totalDuration, changeTime);
      return [
        `${partnerA!.partnerId} ਦਾ ਪੂੰਜੀ-ਸਮਾਂ ਯੋਗਦਾਨ ${formatPrt001Money(firstA!.capital)} × ${formatPrt001Duration(changeTime, "pa")} + (${formatPrt001Money(firstA!.capital)} + x) × ${formatPrt001Duration(remainingTime, "pa")} ਹੈ।`,
        `${partnerB!.partnerId} ਦਾ ਯੋਗਦਾਨ ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(totalDuration, "pa")} ਹੈ। ਦੋਵਾਂ ਨੂੰ ਮੁਨਾਫ਼ਾ ਅਨੁਪਾਤ ${ratio} ਵਿੱਚ ਰੱਖਣ ਤੇ x = ${answer.display} ਮਿਲਦਾ ਹੈ।`,
        `ਇਸ ਲਈ ਜੋੜੀ ਗਈ ਪੂੰਜੀ ${answer.display} ਹੈ।`,
      ];
    }
    case "findEventTimeForEqualProfitShares": {
      const [firstA, secondA] = partnerA!.capitalSegments;
      return [
        `ਬਰਾਬਰ ਮੁਨਾਫ਼ੇ ਲਈ ਦੋਵਾਂ ਦੇ ਪੂੰਜੀ-ਸਮਾਂ ਯੋਗਦਾਨ ਬਰਾਬਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਜੇ ਤਬਦੀਲੀ x ਮਹੀਨੇ ਬਾਅਦ ਹੋਈ, ਤਾਂ ${partnerA!.partnerId} ਦਾ ਯੋਗਦਾਨ ${formatPrt001Money(firstA!.capital)} × x + ${formatPrt001Money(secondA!.capital)} × (${formatPrt001Duration(totalDuration, "pa")} − x) ਹੈ।`,
        `${partnerB!.partnerId} ਦਾ ਯੋਗਦਾਨ ${formatPrt001Money(segmentB!.capital)} × ${formatPrt001Duration(totalDuration, "pa")} ਹੈ। ਦੋਵੇਂ ਬਰਾਬਰ ਰੱਖਣ ਤੇ x = ${answer.display}।`,
        `ਇਸ ਲਈ ਪੂੰਜੀ ${answer.display} ਬਾਅਦ ਬਦਲੀ ਗਈ।`,
      ];
    }
    case "findUnknownCapitalInThreePartnerSystem": {
      const partnerC = parameters.state.partners[2]!;
      const segmentC = partnerC.capitalSegments[0]!;
      const durationC = subtractRational(segmentC.end, segmentC.start);
      const ratioA = solution.normalizedRatio[0]!;
      const ratioC = solution.normalizedRatio[2]!;
      return [
        `${partnerA!.partnerId} ਦਾ ਜਾਣਿਆ ਯੋਗਦਾਨ ${formatPrt001Money(segmentA!.capital)} × ${formatPrt001Duration(durationA, "pa")} = ${formatWhole(solution.timeline.weights[0]!.effectiveCapital.numerator)} ਹੈ।`,
        `ਮੁਨਾਫ਼ੇ ਵਿੱਚ ${partnerA!.partnerId}:${partnerC.partnerId} ਦੇ ਭਾਗ ${ratioA}:${ratioC} ਹਨ, ਇਸ ਲਈ x × ${formatPrt001Duration(durationC, "pa")} ਵੀ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਇਸ ਤੋਂ x = ${answer.display}।`,
        `ਇਸ ਲਈ ${partnerC.partnerId} ਦੀ ਪੂੰਜੀ ${answer.display} ਹੈ।`,
      ];
    }
    case "findUnknownSalaryFromFinalPartnerReceipts": {
      const partA = solution.normalizedRatio[0]!;
      const totalParts = solution.normalizedRatio.reduce((sum, part) => sum + part, 0n);
      return [
        `ਇੱਕੋ ਨਿਵੇਸ਼ ਮਿਆਦ ਵਿੱਚ ਬਾਕੀ ਮੁਨਾਫ਼ਾ ${ratio} ਵਿੱਚ ਵੰਡੇਗਾ। ਤਨਖਾਹ s ਮੰਨੋ; ਤਾਂ ${partnerA!.partnerId} ਦੀ ਅੰਤਿਮ ਪ੍ਰਾਪਤੀ = s + ${partA}/${totalParts} × (${parameters.renderVariables.totalProfit} − s)।`,
        `ਇਹ ਪ੍ਰਾਪਤੀ ${parameters.renderVariables.finalReceipt} ਦਿੱਤੀ ਹੈ। ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ ਤੇ s = ${answer.display}।`,
        `ਇਸ ਲਈ ਤਨਖਾਹ ${answer.display} ਹੈ।`,
      ];
    }
    case "findUnknownJoinTimeWithPreDistributionDeduction": {
      const deduction = solution.pool.executions[0]?.amount;
      return [
        `ਪਹਿਲਾਂ ${deduction ? formatPrt001Money(deduction) : String(parameters.renderVariables.deduction)} ਘਟਾਉਣ ਤੇ ਵੰਡਣ ਯੋਗ ਮੁਨਾਫ਼ਾ ${formatPrt001Money(solution.pool.distributablePool)} ਬਚਦਾ ਹੈ।`,
        `${partnerB!.partnerId} ਦਾ ਦਿੱਤਾ ਹਿੱਸਾ ${parameters.renderVariables.knownShare} ਉਸਦੇ ਅਨੁਪਾਤੀ ਭਾਗ ਤੈਅ ਕਰਦਾ ਹੈ। ਜੇ ਉਹ x ਮਹੀਨੇ ਬਾਅਦ ਜੁੜਿਆ, ਤਾਂ ਉਸਦਾ ਯੋਗਦਾਨ ${formatPrt001Money(segmentB!.capital)} × (${formatPrt001Duration(totalDuration, "pa")} − x) ਹੋਵੇਗਾ; ਪੂੰਜੀ-ਸਮਾਂ ਅਨੁਪਾਤ ਤੋਂ x = ${answer.display}।`,
        `ਇਸ ਲਈ ${partnerB!.partnerId} ${answer.display} ਬਾਅਦ ਸ਼ਾਮਲ ਹੋਇਆ।`,
      ];
    }
  }
  return undefined;
}

export function polishPrt001LocalizedExplanation(input: {
  parameters: Prt001PilotParameters;
  solution: Prt001Solution;
  answer: Prt001TaskAnswer;
  lines: readonly string[];
}): string[] {
  if (input.parameters.language === "en") return [...input.lines];
  const inverse = renderBaselineInverseLocalized(input);
  if (inverse) return inverse;
  return input.lines.map((line) => cleanLocalizedLine(line, input.parameters.language as "hi" | "pa", input.answer));
}
