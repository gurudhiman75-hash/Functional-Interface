import { formatNumber, formatPercent, mathJaxBlock } from "./math";
import type { Pct007Explanation, Pct007Parameters, Pct007ReasoningGraph, Pct007SolverResult } from "./types";

function pair(statement: string, expression: string) {
  return [statement, mathJaxBlock(expression)];
}

function asNumber(parameters: Pct007Parameters, key: string) {
  return Number(parameters.variables[key] ?? 0);
}

function asString(parameters: Pct007Parameters, key: string, fallback = "") {
  return String(parameters.variables[key] ?? fallback);
}

function stableDryingPart(parameters: Pct007Parameters, solver: Pct007SolverResult) {
  const direct = Number(solver.evidence["solidAmount"] ?? solver.evidence["soluteAmount"] ?? NaN);
  if (Number.isFinite(direct)) return direct;

  const baseValue = asNumber(parameters, "baseValue");
  const waterRate = asNumber(parameters, "waterRate");
  if (baseValue > 0 && waterRate > 0) return (baseValue * (100 - waterRate)) / 100;

  const oldRate = asNumber(parameters, "oldRate");
  if (baseValue > 0 && oldRate > 0) return (baseValue * oldRate) / 100;

  const finalWeight = asNumber(parameters, "value1");
  const dryWaterRate = asNumber(parameters, "dryWaterRate");
  if (finalWeight > 0 && dryWaterRate > 0) return (finalWeight * (100 - dryWaterRate)) / 100;

  return 0;
}

function cleanRenderedAnswer(answer: string) {
  return answer.replaceAll("$$", "").trim().replace(/\.+$/, "");
}

function localizedText(parameters: Pct007Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

function renderLocalizedPct007Explanation(
  parameters: Pct007Parameters,
  solver: Pct007SolverResult,
): string[] | null {
  if (parameters.language === "en") return null;

  const lines: string[] = [];
  const renderedAnswer = cleanRenderedAnswer(solver.answer);

  switch (parameters.solveMode) {
    case "findSavingsFromSpendRate":
    case "findExpenditureFromSavingsRate":
    case "findIncomeFromSavingsAmount":
    case "findIncomeFromExpenditureAmount":
    case "findExpenditureFromSavingsAmount": {
      const income = Number(solver.evidence["income"] ?? 0);
      const savingsRate = Number(solver.evidence["savingsRate"] ?? 0);
      const spendRate = Number(solver.evidence["spendRate"] ?? solver.evidence["expenditureRate"] ?? 0);
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Income, expenditure, and savings are parts of the same base, so first identify the relevant percentage of income.",
            "आय, व्यय और बचत एक ही आधार के भाग हैं, इसलिए पहले आय का संबंधित प्रतिशत पहचानिए।",
            "ਆਮਦਨ, ਖਰਚ ਅਤੇ ਬਚਤ ਇੱਕੋ ਆਧਾਰ ਦੇ ਹਿੱਸੇ ਹਨ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਆਮਦਨ ਦਾ ਸੰਬੰਧਿਤ ਪ੍ਰਤੀਸ਼ਤ ਪਛਾਣੋ।",
          ),
          `\\text{Savings rate} + \\text{Expenditure rate} = 100\\%`,
        ),
      );
      if (income > 0) {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              "Now use the identified percentage on the income.",
              "अब पहचाने गए प्रतिशत को आय पर लागू कीजिए।",
              "ਹੁਣ ਪਛਾਣੇ ਹੋਏ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਆਮਦਨ ਤੇ ਲਾਗੂ ਕਰੋ।",
            ),
            String(solver.mathJax["core"] ?? ""),
          ),
        );
      } else {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              "Recover the income from the known percentage part first.",
              "पहले ज्ञात प्रतिशत वाले भाग से आय ज्ञात कीजिए।",
              "ਪਹਿਲਾਂ ਜਾਣੇ ਹੋਏ ਪ੍ਰਤੀਸ਼ਤ ਵਾਲੇ ਹਿੱਸੇ ਤੋਂ ਆਮਦਨ ਕੱਢੋ।",
            ),
            String(solver.mathJax["core"] ?? ""),
          ),
        );
      }
      if (savingsRate > 0) {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              `The savings percentage here is ${formatPercent(savingsRate)}.`,
              `यहाँ बचत का प्रतिशत ${formatPercent(savingsRate)} है।`,
              `ਇੱਥੇ ਬਚਤ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${formatPercent(savingsRate)} ਹੈ।`,
            ),
            `${formatPercent(savingsRate)}`,
          ),
        );
      } else if (spendRate > 0) {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              `The expenditure percentage here is ${formatPercent(spendRate)}.`,
              `यहाँ व्यय का प्रतिशत ${formatPercent(spendRate)} है।`,
              `ਇੱਥੇ ਖਰਚ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${formatPercent(spendRate)} ਹੈ।`,
            ),
            `${formatPercent(spendRate)}`,
          ),
        );
      }
      lines.push(
        ...pair(
          localizedText(
            parameters,
            `So the required answer is ${renderedAnswer}.`,
            `अतः आवश्यक उत्तर ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findMarksFromTotalMarks":
    case "findTotalFromMarksPercent":
    case "findPassMarksFromTotalMarks":
    case "findTotalFromFailMargin":
    case "findTotalFromPassMargin": {
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Use the marks percentage relation from the question and substitute the given values.",
            "प्रश्न में दिए गए अंकों के प्रतिशत संबंध का उपयोग करके मान रखिए।",
            "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਅੰਕਾਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਮਾਨ ਰੱਖੋ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            "This directly gives the required marks or total marks.",
            "इससे सीधे आवश्यक अंक या कुल अंक मिल जाते हैं।",
            "ਇਸ ਨਾਲ ਸਿੱਧੇ ਲੋੜੀਂਦੇ ਅੰਕ ਜਾਂ ਕੁੱਲ ਅੰਕ ਮਿਲ ਜਾਂਦੇ ਹਨ।",
          ),
          parameters.language === "hi" ? `\\text{परिणाम}=${renderedAnswer}` : `\\text{ਨਤੀਜਾ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findVotesPolledFromTurnout":
    case "findValidVotesFromInvalidRate":
    case "findCandidateVotesFromValidVotes":
    case "findWinningMarginFromVoteShare":
    case "findTotalVotersFromVotesPolled": {
      const votesPolled = Number(solver.evidence["votesPolled"] ?? 0);
      const validVotes = Number(solver.evidence["validVotes"] ?? 0);
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Election questions move in stages: votes polled, valid votes, and then the required candidate votes or margin.",
            "चुनाव के प्रश्न चरणों में चलते हैं: पड़े हुए वोट, वैध वोट, और फिर आवश्यक उम्मीदवार के वोट या अंतर।",
            "ਚੋਣ ਦੇ ਪ੍ਰਸ਼ਨ ਪੜਾਅਾਂ ਵਿੱਚ ਹੁੰਦੇ ਹਨ: ਪਏ ਹੋਏ ਵੋਟ, ਵੈਧ ਵੋਟ, ਅਤੇ ਫਿਰ ਲੋੜੀਂਦੇ ਉਮੀਦਵਾਰ ਦੇ ਵੋਟ ਜਾਂ ਅੰਤਰ।",
          ),
          `\\frac{\\text{Turnout rate}}{100}\\times\\text{Total voters}`,
        ),
      );

      if (parameters.solveMode === "findVotesPolledFromTurnout" || parameters.solveMode === "findTotalVotersFromVotesPolled") {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              "Now apply the turnout relation directly or reverse it as required.",
              "अब मतदान प्रतिशत संबंध को सीधे लागू कीजिए या आवश्यकता अनुसार उलटा कीजिए।",
              "ਹੁਣ ਮਤਦਾਨ ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਨੂੰ ਸਿੱਧਾ ਲਾਗੂ ਕਰੋ ਜਾਂ ਲੋੜ ਅਨੁਸਾਰ ਉਲਟੋ।",
            ),
            String(solver.mathJax["core"] ?? ""),
          ),
        );
      } else if (parameters.solveMode === "findValidVotesFromInvalidRate") {
        if (votesPolled > 0) {
          lines.push(...pair(localizedText(parameters, "First find the votes polled.", "पहले पड़े हुए वोट ज्ञात कीजिए।", "ਪਹਿਲਾਂ ਪਏ ਹੋਏ ਵੋਟ ਕੱਢੋ।"), `${formatNumber(votesPolled)}`));
        }
        lines.push(...pair(localizedText(parameters, "Now remove invalid votes from the polled votes.", "अब पड़े हुए वोटों में से अवैध वोट हटाइए।", "ਹੁਣ ਪਏ ਹੋਏ ਵੋਟਾਂ ਵਿੱਚੋਂ ਅਵੈਧ ਵੋਟ ਕੱਢੋ।"), String(solver.mathJax["core"] ?? "")));
      } else if (parameters.solveMode === "findCandidateVotesFromValidVotes") {
        if (votesPolled > 0) {
          lines.push(...pair(localizedText(parameters, "First find the votes polled.", "पहले पड़े हुए वोट ज्ञात कीजिए।", "ਪਹਿਲਾਂ ਪਏ ਹੋਏ ਵੋਟ ਕੱਢੋ।"), `${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair(localizedText(parameters, "After removing invalid votes, we get the valid votes.", "अवैध वोट हटाने के बाद वैध वोट मिलते हैं।", "ਅਵੈਧ ਵੋਟ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਵੈਧ ਵੋਟ ਮਿਲਦੇ ਹਨ।"), `${formatNumber(validVotes)}`));
        }
        lines.push(...pair(localizedText(parameters, "Now apply the candidate's share to the valid votes.", "अब उम्मीदवार का प्रतिशत वैध वोटों पर लागू कीजिए।", "ਹੁਣ ਉਮੀਦਵਾਰ ਦਾ ਹਿੱਸਾ ਵੈਧ ਵੋਟਾਂ ਤੇ ਲਾਗੂ ਕਰੋ।"), String(solver.mathJax["core"] ?? "")));
      } else {
        if (votesPolled > 0) {
          lines.push(...pair(localizedText(parameters, "First find the votes polled.", "पहले पड़े हुए वोट ज्ञात कीजिए।", "ਪਹਿਲਾਂ ਪਏ ਹੋਏ ਵੋਟ ਕੱਢੋ।"), `${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair(localizedText(parameters, "After removing invalid votes, we get the valid votes.", "अवैध वोट हटाने के बाद वैध वोट मिलते हैं।", "ਅਵੈਧ ਵੋਟ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਵੈਧ ਵੋਟ ਮਿਲਦੇ ਹਨ।"), `${formatNumber(validVotes)}`));
        }
        lines.push(...pair(localizedText(parameters, "Now compare the two candidate vote totals.", "अब दोनों उम्मीदवारों के वोटों की तुलना कीजिए।", "ਹੁਣ ਦੋਵੇਂ ਉਮੀਦਵਾਰਾਂ ਦੇ ਵੋਟਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"), String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(localizedText(parameters, `So the required answer is ${renderedAnswer}.`, `अतः आवश्यक उत्तर ${renderedAnswer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`), parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`));
      break;
    }
    case "findRevisedValueAfterIncrease":
    case "findOriginalValueBeforeIncrease":
    case "findRevisedValueAfterDecrease":
    case "findUsedQuantityFromPercent":
    case "findRemainingQuantityFromPercent": {
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Keep the stated quantity as the base and apply the percentage change shown in the question.",
            "दिए गए परिमाण को आधार मानकर प्रश्न में दिया गया प्रतिशत परिवर्तन लागू कीजिए।",
            "ਦਿੱਤੀ ਮਾਤਰਾ ਨੂੰ ਆਧਾਰ ਮੰਨ ਕੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            `So the required quantity is ${renderedAnswer}.`,
            `अतः आवश्यक मात्रा ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{मात्रा}=${renderedAnswer}` : `\\text{ਮਾਤਰਾ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findComponentFromTotalAndRate":
    case "findOtherComponentFromTotalAndRate":
    case "findTotalFromComponentAndRate":
    case "findRateFromComponentAndTotal":
    case "findTotalFromOtherComponentAndRate": {
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Direct mixture questions depend on the component share of the total mixture.",
            "प्रत्यक्ष मिश्रण वाले प्रश्न कुल मिश्रण में घटक के हिस्से पर आधारित होते हैं।",
            "ਸਿੱਧੇ ਮਿਸ਼ਰਣ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਕੁੱਲ ਮਿਸ਼ਰਣ ਵਿੱਚ ਘਟਕ ਦੇ ਹਿੱਸੇ ਤੇ ਆਧਾਰਿਤ ਹੁੰਦੇ ਹਨ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            `So the required result is ${renderedAnswer}.`,
            `अतः आवश्यक परिणाम ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਨਤੀਜਾ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{परिणाम}=${renderedAnswer}` : `\\text{ਨਤੀਜਾ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findFinalDryWeight":
    case "findWaterLostAfterDrying":
    case "findFinalVolumeAfterEvaporation":
    case "findEvaporatedAmount":
    case "findInitialWeightFromFinalDryWeight": {
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "In drying and evaporation, the solid or solute remains unchanged; only the water part changes.",
            "सूखने और वाष्पीकरण में ठोस या विलेय भाग समान रहता है; केवल पानी वाला भाग बदलता है।",
            "ਸੁਕਾਉਣ ਅਤੇ ਬਾਫ਼ ਬਣਨ ਵਿੱਚ ਠੋਸ ਜਾਂ ਵਿੱਲੀਨ ਹਿੱਸਾ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ; ਸਿਰਫ਼ ਪਾਣੀ ਵਾਲਾ ਹਿੱਸਾ ਬਦਲਦਾ ਹੈ।",
          ),
          parameters.language === "hi" ? `\\text{स्थिर भाग}=${formatNumber(stableDryingPart(parameters, solver))}` : `\\text{ਸਥਿਰ ਭਾਗ}=${formatNumber(stableDryingPart(parameters, solver))}`,
        ),
        ...pair(
          localizedText(
            parameters,
            "Now use the new percentage composition to obtain the required quantity.",
            "अब नई प्रतिशत संरचना का उपयोग करके आवश्यक मात्रा ज्ञात कीजिए।",
            "ਹੁਣ ਨਵੀਂ ਪ੍ਰਤੀਸ਼ਤ ਬਣਤਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਲੋੜੀਂਦੀ ਮਾਤਰਾ ਕੱਢੋ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            `So the required answer is ${renderedAnswer}.`,
            `अतः आवश्यक उत्तर ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findDiscountAmount":
    case "findBillAfterDiscount":
    case "findTaxOrChargeAmount":
    case "findFinalBillAfterDiscountAndTax":
    case "findCommissionAmount": {
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Apply each billing percentage to the correct amount in the stated order.",
            "बिल से जुड़े प्रत्येक प्रतिशत को दिए गए क्रम में सही राशि पर लागू कीजिए।",
            "ਬਿਲ ਨਾਲ ਸੰਬੰਧਿਤ ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਠੀਕ ਰਕਮ ਤੇ ਲਾਗੂ ਕਰੋ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            `So the required bill amount or charge is ${renderedAnswer}.`,
            `अतः आवश्यक बिल राशि या शुल्क ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਬਿਲ ਰਕਮ ਜਾਂ ਸ਼ੁਲਕ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{राशि}=${renderedAnswer}` : `\\text{ਰਕਮ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findPercentageErrorFromWrongAndCorrect":
    case "findCorrectValueFromOverstatement":
    case "findCorrectValueFromUnderstatement":
    case "findPercentageErrorOnBill":
    case "findActualValueFromMeasuredError": {
      const isDirectError =
        parameters.solveMode === "findPercentageErrorFromWrongAndCorrect" ||
        parameters.solveMode === "findPercentageErrorOnBill";
      lines.push(
        ...pair(
          localizedText(
            parameters,
            isDirectError
              ? "First find the absolute error, then compare it with the correct value."
              : "Use the stated percentage error to reverse the recorded value.",
            isDirectError
              ? "पहले निरपेक्ष त्रुटि ज्ञात कीजिए, फिर उसकी तुलना सही मान से कीजिए।"
              : "दिए गए प्रतिशत त्रुटि का उपयोग करके दर्ज मान को उलटिए।",
            isDirectError
              ? "ਪਹਿਲਾਂ ਪਰਮ ਗਲਤੀ ਕੱਢੋ, ਫਿਰ ਇਸ ਦੀ ਤੁਲਨਾ ਸਹੀ ਮਾਨ ਨਾਲ ਕਰੋ।"
              : "ਦਿੱਤੀ ਗਈ ਪ੍ਰਤੀਸ਼ਤ ਗਲਤੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦਰਜ ਮਾਨ ਨੂੰ ਉਲਟੋ।",
          ),
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(
          localizedText(
            parameters,
            `So the required result is ${renderedAnswer}.`,
            `अतः आवश्यक परिणाम ${renderedAnswer} है।`,
            `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਨਤੀਜਾ ${renderedAnswer} ਹੈ।`,
          ),
          parameters.language === "hi" ? `\\text{परिणाम}=${renderedAnswer}` : `\\text{ਨਤੀਜਾ}=${renderedAnswer}`,
        ),
      );
      break;
    }
    case "findRemainingAfterOneRemoval":
    case "findRemainingAfterTwoSameRemovals":
    case "findRemainingAfterThreeSameRemovals":
    case "findRemainingAfterTwoDifferentRemovals":
    case "findTotalRemovedAfterTwoDifferentRemovals": {
      const afterFirst = Number(solver.evidence["afterFirst"] ?? NaN);
      const afterSecond = Number(solver.evidence["afterSecond"] ?? NaN);
      const remaining = Number(solver.evidence["remaining"] ?? NaN);
      lines.push(
        ...pair(
          localizedText(
            parameters,
            "Repeated reduction always acts on the current remainder, not on the original quantity again.",
            "बार-बार की गई कमी हमेशा वर्तमान शेष भाग पर लगती है, मूल मात्रा पर नहीं।",
            "ਦੁਹਰਾਈ ਗਈ ਘਟਾਉ ਹਮੇਸ਼ਾਂ ਮੌਜੂਦਾ ਬਚੀ ਮਾਤਰਾ ਤੇ ਲੱਗਦੀ ਹੈ, ਮੂਲ ਮਾਤਰਾ ਤੇ ਨਹੀਂ।",
          ),
          `\\frac{100-\\text{Rate}}{100}`,
        ),
      );
      if (Number.isFinite(afterFirst)) {
        lines.push(...pair(localizedText(parameters, "After the first reduction, we get the new remainder.", "पहली कमी के बाद नया शेष भाग मिलता है।", "ਪਹਿਲੀ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਬਚੀ ਮਾਤਰਾ ਮਿਲਦੀ ਹੈ।"), `${formatNumber(afterFirst)}`));
      }
      if (Number.isFinite(afterSecond)) {
        lines.push(...pair(localizedText(parameters, "After the second reduction, use the new remainder again.", "दूसरी कमी के बाद फिर से नया शेष भाग उपयोग कीजिए।", "ਦੂਜੀ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਬਚੀ ਮਾਤਰਾ ਨੂੰ ਫਿਰ ਵਰਤੋ।"), `${formatNumber(afterSecond)}`));
      } else if (
        parameters.solveMode !== "findRemainingAfterOneRemoval" &&
        Number.isFinite(remaining) &&
        parameters.solveMode !== "findTotalRemovedAfterTwoDifferentRemovals"
      ) {
        lines.push(...pair(localizedText(parameters, "After the repeated reduction, we get the final remainder.", "दोहराई गई कमी के बाद अंतिम शेष भाग मिलता है।", "ਦੁਹਰਾਈ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਬਚੀ ਮਾਤਰਾ ਮਿਲਦੀ ਹੈ।"), `${formatNumber(remaining)}`));
      }

      if (parameters.solveMode === "findTotalRemovedAfterTwoDifferentRemovals") {
        if (Number.isFinite(remaining)) {
          lines.push(...pair(localizedText(parameters, "After the second reduction, identify the quantity left.", "दूसरी कमी के बाद बची हुई मात्रा ज्ञात कीजिए।", "ਦੂਜੀ ਘਟਾਉ ਤੋਂ ਬਾਅਦ ਬਚੀ ਮਾਤਰਾ ਲੱਭੋ।"), `${formatNumber(remaining)}`));
        }
        lines.push(...pair(localizedText(parameters, "Now subtract the final remainder from the original quantity to get the total removed.", "अब कुल हटाई गई मात्रा पाने के लिए अंतिम शेष को मूल मात्रा से घटाइए।", "ਹੁਣ ਕੁੱਲ ਹਟਾਈ ਮਾਤਰਾ ਲੱਭਣ ਲਈ ਅੰਤਿਮ ਬਚੀ ਮਾਤਰਾ ਨੂੰ ਮੂਲ ਮਾਤਰਾ ਵਿੱਚੋਂ ਘਟਾਓ।"), String(solver.mathJax["core"] ?? "")));
      } else {
        lines.push(...pair(localizedText(parameters, "Now apply the final reduction step required in the question.", "अब प्रश्नानुसार अंतिम कमी वाला चरण लागू कीजिए।", "ਹੁਣ ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਅੰਤਿਮ ਘਟਾਉ ਵਾਲਾ ਕਦਮ ਲਾਗੂ ਕਰੋ।"), String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(localizedText(parameters, `So the required remaining or used quantity is ${renderedAnswer}.`, `अतः आवश्यक शेष या प्रयुक्त मात्रा ${renderedAnswer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਬਚੀ ਜਾਂ ਵਰਤੀ ਮਾਤਰਾ ${renderedAnswer} ਹੈ।`), parameters.language === "hi" ? `\\text{मात्रा}=${renderedAnswer}` : `\\text{ਮਾਤਰਾ}=${renderedAnswer}`));
      break;
    }
    case "findCaseletSavings":
    case "findCaseletCandidateVotes":
    case "findCaseletFinalBill":
    case "findCaseletRemainingGoodUnits":
    case "findCaseletComparison": {
      const subjectA = asString(parameters, "subjectA", "First");
      const subjectB = asString(parameters, "subjectB", "Second");
      const leadByMode: Record<string, [string, string, string]> = {
        findCaseletSavings: [
          "Savings are the part of income left after expenses.",
          "बचत वह भाग है जो खर्च के बाद आय में बचता है।",
          "ਬਚਤ ਉਹ ਹਿੱਸਾ ਹੈ ਜੋ ਖਰਚ ਤੋਂ ਬਾਅਦ ਆਮਦਨ ਵਿੱਚ ਬਚਦਾ ਹੈ।",
        ],
        findCaseletCandidateVotes: [
          "After removing invalid votes, apply the candidate's share to the valid votes.",
          "अवैध वोट हटाने के बाद उम्मीदवार का प्रतिशत वैध वोटों पर लागू कीजिए।",
          "ਅਵੈਧ ਵੋਟ ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਉਮੀਦਵਾਰ ਦਾ ਹਿੱਸਾ ਵੈਧ ਵੋਟਾਂ ਤੇ ਲਾਗੂ ਕਰੋ।",
        ],
        findCaseletFinalBill: [
          "Apply the discount first, then apply the tax or charge to the reduced bill.",
          "पहले छूट लगाइए, फिर घटे हुए बिल पर कर या शुल्क लगाइए।",
          "ਪਹਿਲਾਂ ਛੂਟ ਲਗਾਓ, ਫਿਰ ਘਟੇ ਹੋਏ ਬਿਲ ਤੇ ਕਰ ਜਾਂ ਸ਼ੁਲਕ ਲਗਾਓ।",
        ],
        findCaseletRemainingGoodUnits: [
          "First remove defective units, then apply the second percentage to the good units.",
          "पहले खराब इकाइयाँ हटाइए, फिर अच्छे भाग पर दूसरा प्रतिशत लगाइए।",
          "ਪਹਿਲਾਂ ਖਰਾਬ ਇਕਾਈਆਂ ਕੱਢੋ, ਫਿਰ ਚੰਗੇ ਹਿੱਸੇ ਤੇ ਦੂਜਾ ਪ੍ਰਤੀਸ਼ਤ ਲਗਾਓ।",
        ],
        findCaseletComparison: [
          "Convert each percentage into its actual value before comparing the two sides.",
          "दोनों पक्षों की तुलना से पहले प्रत्येक प्रतिशत को वास्तविक मान में बदलिए।",
          "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਅਸਲ ਮਾਨ ਵਿੱਚ ਬਦਲੋ।",
        ],
      };
      const lead = leadByMode[String(parameters.solveMode)] ?? [
        "Use the given percentages in order to reach the required value.",
        "आवश्यक मान तक पहुँचने के लिए दिए गए प्रतिशत क्रम से उपयोग कीजिए।",
        "ਲੋੜੀਂਦੇ ਮਾਨ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਕ੍ਰਮਵਾਰ ਵਰਤੋ।",
      ];
      lines.push(...pair(localizedText(parameters, lead[0], lead[1], lead[2]), String(solver.mathJax["core"] ?? "")));
      if (parameters.solveMode === "findCaseletComparison") {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              `Now compare the actual values of ${subjectA} and ${subjectB}.`,
              `अब ${subjectA} और ${subjectB} के वास्तविक मानों की तुलना कीजिए।`,
              `ਹੁਣ ${subjectA} ਅਤੇ ${subjectB} ਦੇ ਅਸਲ ਮਾਨਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
            ),
            parameters.language === "hi" ? `\\text{तुलना}=${renderedAnswer}` : `\\text{ਤੁਲਨਾ}=${renderedAnswer}`,
          ),
        );
      } else {
        lines.push(
          ...pair(
            localizedText(
              parameters,
              `This gives the required value as ${renderedAnswer}.`,
              `इससे आवश्यक मान ${renderedAnswer} मिलता है।`,
              `ਇਸ ਨਾਲ ਲੋੜੀਂਦਾ ਮਾਨ ${renderedAnswer} ਮਿਲਦਾ ਹੈ।`,
            ),
            parameters.language === "hi" ? `\\text{परिणाम}=${renderedAnswer}` : `\\text{ਨਤੀਜਾ}=${renderedAnswer}`,
          ),
        );
      }
      lines.push(...pair(localizedText(parameters, `So the final answer is ${renderedAnswer}.`, `अतः अंतिम उत्तर ${renderedAnswer} है।`, `ਇਸ ਲਈ ਅੰਤਿਮ ਜਵਾਬ ${renderedAnswer} ਹੈ।`), parameters.language === "hi" ? `\\text{उत्तर}=${renderedAnswer}` : `\\text{ਜਵਾਬ}=${renderedAnswer}`));
      break;
    }
  }

  return lines;
}

export function renderPct007Explanation(
  parameters: Pct007Parameters,
  solver: Pct007SolverResult,
  _graph: Pct007ReasoningGraph,
): Pct007Explanation {
  const localizedLines = renderLocalizedPct007Explanation(parameters, solver);
  if (localizedLines) {
    return {
      explanationId: parameters.explanationId,
      lines: localizedLines,
    };
  }

  const lines: string[] = [];
  const renderedAnswer = cleanRenderedAnswer(solver.answer);

  switch (parameters.solveMode) {
    case "findSavingsFromSpendRate":
    case "findExpenditureFromSavingsRate":
    case "findIncomeFromSavingsAmount":
    case "findIncomeFromExpenditureAmount":
    case "findExpenditureFromSavingsAmount": {
      const income = Number(solver.evidence["income"] ?? 0);
      const savingsRate = Number(solver.evidence["savingsRate"] ?? 0);
      const spendRate = Number(solver.evidence["spendRate"] ?? solver.evidence["expenditureRate"] ?? 0);
      lines.push(
        ...pair(
          "Income, expenditure, and savings are parts of the same base, so first identify the relevant percentage of income.",
          `\\text{Savings rate} + \\text{Expenditure rate} = 100\\%`,
        ),
      );
      if (income > 0) {
        lines.push(...pair("Now use the identified percentage on the income.", String(solver.mathJax["core"] ?? "")));
      } else {
        lines.push(...pair("Recover the income from the known percentage part first.", String(solver.mathJax["core"] ?? "")));
      }
      if (savingsRate > 0) {
        lines.push(...pair(`The savings percentage here is ${formatPercent(savingsRate)}.`, `\\text{Savings rate}=${formatPercent(savingsRate)}`));
      } else if (spendRate > 0) {
        lines.push(...pair(`The expenditure percentage here is ${formatPercent(spendRate)}.`, `\\text{Expenditure rate}=${formatPercent(spendRate)}`));
      }
      lines.push(...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findMarksFromTotalMarks":
    case "findTotalFromMarksPercent":
    case "findPassMarksFromTotalMarks":
    case "findTotalFromFailMargin":
    case "findTotalFromPassMargin": {
      lines.push(
        ...pair(
          "Use the marks percentage relation from the question and substitute the given values.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair("This directly gives the required marks or total marks.", `\\text{Result}=${renderedAnswer}`),
      );
      break;
    }
    case "findVotesPolledFromTurnout":
    case "findValidVotesFromInvalidRate":
    case "findCandidateVotesFromValidVotes":
    case "findWinningMarginFromVoteShare":
    case "findTotalVotersFromVotesPolled": {
      const votesPolled = Number(solver.evidence["votesPolled"] ?? 0);
      const validVotes = Number(solver.evidence["validVotes"] ?? 0);
      lines.push(
        ...pair(
          "Election questions move in stages: votes polled, valid votes, and then the required candidate votes or margin.",
          `\\text{Votes polled} = \\frac{\\text{Turnout rate}}{100}\\times\\text{Total voters}`,
        ),
      );

      if (parameters.solveMode === "findVotesPolledFromTurnout" || parameters.solveMode === "findTotalVotersFromVotesPolled") {
        lines.push(...pair("Now apply the turnout relation directly or reverse it as required.", String(solver.mathJax["core"] ?? "")));
      } else if (parameters.solveMode === "findValidVotesFromInvalidRate") {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        lines.push(...pair("Now remove invalid votes from the polled votes.", String(solver.mathJax["core"] ?? "")));
      } else if (parameters.solveMode === "findCandidateVotesFromValidVotes") {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair("After removing invalid votes, we get the valid votes.", `\\text{Valid votes}=${formatNumber(validVotes)}`));
        }
        lines.push(...pair("Now apply the candidate's share to the valid votes.", String(solver.mathJax["core"] ?? "")));
      } else {
        if (votesPolled > 0) {
          lines.push(...pair("First find the votes polled.", `\\text{Votes polled}=${formatNumber(votesPolled)}`));
        }
        if (validVotes > 0) {
          lines.push(...pair("After removing invalid votes, we get the valid votes.", `\\text{Valid votes}=${formatNumber(validVotes)}`));
        }
        lines.push(...pair("Now compare the two candidate vote totals.", String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findRevisedValueAfterIncrease":
    case "findOriginalValueBeforeIncrease":
    case "findRevisedValueAfterDecrease":
    case "findUsedQuantityFromPercent":
    case "findRemainingQuantityFromPercent": {
      lines.push(
        ...pair(
          "Keep the stated quantity as the base and apply the percentage change shown in the question.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required quantity is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findComponentFromTotalAndRate":
    case "findOtherComponentFromTotalAndRate":
    case "findTotalFromComponentAndRate":
    case "findRateFromComponentAndTotal":
    case "findTotalFromOtherComponentAndRate": {
      lines.push(
        ...pair(
          "Direct mixture questions depend on the component share of the total mixture.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findFinalDryWeight":
    case "findWaterLostAfterDrying":
    case "findFinalVolumeAfterEvaporation":
    case "findEvaporatedAmount":
    case "findInitialWeightFromFinalDryWeight": {
      lines.push(
        ...pair(
          "In drying and evaporation, the solid or solute remains unchanged; only the water part changes.",
          `\\text{Unchanged solid or solute} = \\text{same before and after}`,
        ),
        ...pair("First express the unchanged solid or solute quantity.", `\\text{Stable part}=${formatNumber(stableDryingPart(parameters, solver))}`),
        ...pair("Now use the new percentage composition to obtain the required quantity.", String(solver.mathJax["core"] ?? "")),
        ...pair(`So the required answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findDiscountAmount":
    case "findBillAfterDiscount":
    case "findTaxOrChargeAmount":
    case "findFinalBillAfterDiscountAndTax":
    case "findCommissionAmount": {
      lines.push(
        ...pair(
          "Apply each billing percentage to the correct amount in the stated order.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required bill amount or charge is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findPercentageErrorFromWrongAndCorrect":
    case "findCorrectValueFromOverstatement":
    case "findCorrectValueFromUnderstatement":
    case "findPercentageErrorOnBill":
    case "findActualValueFromMeasuredError": {
      const isDirectError =
        parameters.solveMode === "findPercentageErrorFromWrongAndCorrect" ||
        parameters.solveMode === "findPercentageErrorOnBill";
      lines.push(
        ...pair(
          isDirectError
            ? "First find the absolute error, then compare it with the correct value."
            : "Use the stated percentage error to reverse the recorded value.",
          String(solver.mathJax["core"] ?? ""),
        ),
        ...pair(`So the required result is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`),
      );
      break;
    }
    case "findRemainingAfterOneRemoval":
    case "findRemainingAfterTwoSameRemovals":
    case "findRemainingAfterThreeSameRemovals":
    case "findRemainingAfterTwoDifferentRemovals":
    case "findTotalRemovedAfterTwoDifferentRemovals": {
      const afterFirst = Number(solver.evidence["afterFirst"] ?? NaN);
      const afterSecond = Number(solver.evidence["afterSecond"] ?? NaN);
      const remaining = Number(solver.evidence["remaining"] ?? NaN);
      lines.push(
        ...pair(
          "Repeated reduction always acts on the current remainder, not on the original quantity again.",
          `\\text{Remainder after one step} = \\text{Current quantity}\\times\\frac{100-\\text{Rate}}{100}`,
        ),
      );
      if (Number.isFinite(afterFirst)) {
        lines.push(...pair("After the first reduction, we get the new remainder.", `\\text{After first reduction}=${formatNumber(afterFirst)}`));
      }
      if (Number.isFinite(afterSecond)) {
        lines.push(...pair("After the second reduction, use the new remainder again.", `\\text{After second reduction}=${formatNumber(afterSecond)}`));
      } else if (
        parameters.solveMode !== "findRemainingAfterOneRemoval" &&
        Number.isFinite(remaining) &&
        parameters.solveMode !== "findTotalRemovedAfterTwoDifferentRemovals"
      ) {
        lines.push(...pair("After the repeated reduction, we get the final remainder.", `\\text{Final remainder}=${formatNumber(remaining)}`));
      }

      if (parameters.solveMode === "findTotalRemovedAfterTwoDifferentRemovals") {
        if (Number.isFinite(remaining)) {
          lines.push(...pair("After the second reduction, identify the quantity left.", `\\text{Final remainder}=${formatNumber(remaining)}`));
        }
        lines.push(...pair("Now subtract the final remainder from the original quantity to get the total removed.", String(solver.mathJax["core"] ?? "")));
      } else {
        lines.push(...pair("Now apply the final reduction step required in the question.", String(solver.mathJax["core"] ?? "")));
      }

      lines.push(...pair(`So the required remaining or used quantity is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
    case "findCaseletSavings":
    case "findCaseletCandidateVotes":
    case "findCaseletFinalBill":
    case "findCaseletRemainingGoodUnits":
    case "findCaseletComparison": {
      const subjectA = asString(parameters, "subjectA", "First");
      const subjectB = asString(parameters, "subjectB", "Second");
      const leadByMode: Record<string, string> = {
        findCaseletSavings: "Savings are the part of income left after expenses.",
        findCaseletCandidateVotes: "After removing invalid votes, apply the candidate's share to the valid votes.",
        findCaseletFinalBill: "Apply the discount first, then apply the tax or charge to the reduced bill.",
        findCaseletRemainingGoodUnits: "First remove defective units, then apply the second percentage to the good units.",
        findCaseletComparison: "Convert each percentage into its actual value before comparing the two sides.",
      };
      lines.push(
        ...pair(
          leadByMode[String(parameters.solveMode)] ?? "Use the given percentages in order to reach the required value.",
          String(solver.mathJax["core"] ?? ""),
        ),
      );
      if (parameters.solveMode === "findCaseletComparison") {
        lines.push(...pair(`Now compare the actual values of ${subjectA} and ${subjectB}.`, `\\text{Comparison}=${renderedAnswer}`));
      } else {
        lines.push(...pair(`This gives the required value as ${renderedAnswer}.`, `\\text{Result}=${renderedAnswer}`));
      }
      lines.push(...pair(`So the final answer is ${renderedAnswer}.`, `\\text{Answer}=${renderedAnswer}`));
      break;
    }
  }

  return {
    explanationId: parameters.explanationId,
    lines,
  };
}
