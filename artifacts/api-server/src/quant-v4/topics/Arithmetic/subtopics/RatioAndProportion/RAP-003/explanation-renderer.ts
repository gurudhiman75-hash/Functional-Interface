import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function block(text: string) {
  return `$$${text}$$`;
}

function localizedIntro(parameters: Rap003Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

export function renderRap003Explanation(parameters: Rap003Parameters, solver: Rap003SolverResult): Rap003Explanation {
  if (
    parameters.taskKind === "partnershipProfitShare"
    || parameters.taskKind === "partnershipJoiningPartnerProfit"
    || parameters.taskKind === "partnershipMidPeriodChange"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "In partnership, profit is divided in the ratio of investment multiplied by time.",
          "साझेदारी में लाभ निवेश और समय के गुणनफल के अनुपात में बांटा जाता है.",
          "ਸਾਂਝੇਦਾਰੀ ਵਿੱਚ ਲਾਭ ਨਿਵੇਸ਼ ਅਤੇ ਸਮੇਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਜਾਂਦਾ ਹੈ.",
        ),
        block(`\\text{Investment-time products}=${String(solver.workingValues.productA)}:${String(solver.workingValues.productB)}`),
        block(`\\text{Profit ratio}=${String(solver.workingValues.profitRatio)}`),
        localizedIntro(parameters, "Use the target partner's share of the total profit.", "कुल लाभ में लक्षित साझेदार का हिस्सा लें.", "ਕੁੱਲ ਲਾਭ ਵਿੱਚ ਲਕਸ਼ਿਤ ਸਾਥੀ ਦਾ ਹਿੱਸਾ ਲਵੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "alloyMixingRatioFromTarget"
    || parameters.taskKind === "alloyTargetComponentFromMix"
    || parameters.taskKind === "alloyThreeSourceEqualMix"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "For mixture blending, compare component amounts or component percentages, not just total quantities.",
          "मिश्रण में घटक की मात्रा या प्रतिशत की तुलना करें, केवल कुल मात्रा की नहीं.",
          "ਮਿਸ਼ਰਣ ਵਿੱਚ ਘਟਕ ਦੀ ਮਾਤਰਾ ਜਾਂ ਪ੍ਰਤੀਸ਼ਤ ਦੀ ਤੁਲਨਾ ਕਰੋ, ਸਿਰਫ਼ ਕੁੱਲ ਮਾਤਰਾ ਦੀ ਨਹੀਂ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        parameters.taskKind === "alloyMixingRatioFromTarget"
          ? localizedIntro(parameters, "Use alligation: distance from the target decides the opposite mixing parts.", "एलिगेशन लगाएं: लक्ष्य से दूरी विपरीत मिश्रण भाग देती है.", "ਐਲੀਗੇਸ਼ਨ ਵਰਤੋ: ਲਕਸ਼ ਤੋਂ ਦੂਰੀ ਉਲਟ ਮਿਲਾਉਣ ਵਾਲੇ ਭਾਗ ਦਿੰਦੀ ਹੈ.")
          : localizedIntro(parameters, "Compute the weighted component amount and divide by the total mixture.", "भारित घटक मात्रा निकालकर कुल मिश्रण से भाग दें.", "ਭਾਰਿਤ ਘਟਕ ਮਾਤਰਾ ਕੱਢ ਕੇ ਕੁੱਲ ਮਿਸ਼ਰਣ ਨਾਲ ਭਾਗ ਦਿਓ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "incomeExpenditureSavingsRatio"
    || parameters.taskKind === "incomeExpenditureEqualSavings"
    || parameters.taskKind === "incomeFromSavingsRatio"
    || parameters.taskKind === "expenditureFromSavingsRatio"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "For income-expenditure questions, convert both ratios into actual comparable amounts, then use savings = income - expenditure.",
          "आय-खर्च प्रश्नों में दोनों अनुपातों को तुलनीय वास्तविक राशियों में बदलें, फिर बचत = आय - खर्च लगाएं.",
          "ਆਮਦਨ-ਖਰਚ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਨੂੰ ਤੁਲਨਾਯੋਗ ਅਸਲ ਰਕਮਾਂ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਬਚਤ = ਆਮਦਨ - ਖਰਚ ਵਰਤੋ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        solver.workingValues.incomeScale !== undefined
          ? block(`\\text{Income scale}=${String(solver.workingValues.incomeScale)}`)
          : block(`\\text{Income values}=${String(solver.workingValues.incomeA)}:${String(solver.workingValues.incomeB)}`),
        solver.workingValues.expenditureScale !== undefined
          ? block(`\\text{Expenditure scale}=${String(solver.workingValues.expenditureScale)}`)
          : block(`\\text{Expenditure values}=${String(solver.workingValues.expenditureA)}:${String(solver.workingValues.expenditureB)}`),
        localizedIntro(parameters, "Apply the given savings condition or form the final savings ratio.", "दी गई बचत शर्त लगाएं या अंतिम बचत अनुपात बनाएं.", "ਦਿੱਤੀ ਬਚਤ ਸ਼ਰਤ ਲਗਾਓ ਜਾਂ ਅੰਤਿਮ ਬਚਤ ਅਨੁਪਾਤ ਬਣਾਓ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "replacementFinalRatio"
    || parameters.taskKind === "replacementFinalQuantity"
    || parameters.taskKind === "replacementIterationsFromFinalRatio"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "In repeated replacement, the original liquid is multiplied by the same retention factor each time.",
          "बार-बार बदलने में मूल द्रव हर बार उसी बचत गुणक से गुणा होता है.",
          "ਵਾਰ-ਵਾਰ ਬਦਲਣ ਵਿੱਚ ਮੂਲ ਤਰਲ ਹਰ ਵਾਰ ਉਸੇ ਬਚਤ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਹੁੰਦਾ ਹੈ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        block(`\\text{Retention factor}=${String(solver.workingValues.retentionFactor)}`),
        localizedIntro(parameters, "Use the power of the retention factor for repeated rounds.", "दोहराव के लिए बचत गुणक की घात लगाएं.", "ਦੁਹਰਾਏ ਗਏ ਚੱਕਰਾਂ ਲਈ ਬਚਤ ਗੁਣਕ ਦੀ ਘਾਤ ਵਰਤੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "denominationTotalValue"
    || parameters.taskKind === "denominationCountsFromValue"
    || parameters.taskKind === "denominationTargetCount"
    || parameters.taskKind === "denominationSwapValue"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "For denomination questions, multiply each count-ratio part by its denomination value.",
          "मूल्यवर्ग प्रश्नों में हर संख्या-अनुपात भाग को उसके मूल्य से गुणा करें.",
          "ਮੁੱਲ-ਵਰਗ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਹਰ ਗਿਣਤੀ-ਅਨੁਪਾਤ ਭਾਗ ਨੂੰ ਉਸਦੇ ਮੁੱਲ ਨਾਲ ਗੁਣਾ ਕਰੋ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        solver.workingValues.weightedUnitValue !== undefined
          ? block(`\\text{Value of one ratio unit}=${String(solver.workingValues.weightedUnitValue)}`)
          : block(`\\text{Common unit}=${String(solver.workingValues.commonUnit)}`),
        parameters.taskKind === "denominationSwapValue"
          ? block(`\\text{Swap delta}=${String(solver.workingValues.swapDelta)}`)
          : localizedIntro(parameters, "Use the common multiplier to get the requested value or count.", "मांगे गए मूल्य या संख्या के लिए सामान्य गुणक लगाएं.", "ਮੰਗਿਆ ਮੁੱਲ ਜਾਂ ਗਿਣਤੀ ਲੈਣ ਲਈ ਸਾਂਝਾ ਗੁਣਕ ਵਰਤੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "sdtTimeRatioFromSpeedDistance"
    || parameters.taskKind === "sdtDistanceRatioFromSpeedTime"
    || parameters.taskKind === "sdtSpeedRatioFromDistanceTime"
    || parameters.taskKind === "sdtRaceLead"
    || parameters.taskKind === "sdtOvertakeTime"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Use the speed-distance-time relation: distance = speed multiplied by time.",
          "चाल-दूरी-समय संबंध लगाएं: दूरी = चाल × समय.",
          "ਚਾਲ-ਦੂਰੀ-ਸਮਾਂ ਸੰਬੰਧ ਵਰਤੋ: ਦੂਰੀ = ਚਾਲ × ਸਮਾਂ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        parameters.taskKind === "sdtRaceLead"
          ? localizedIntro(parameters, "When the faster runner finishes, compare how far the slower runner has covered.", "तेज धावक के समाप्त करने पर धीमे धावक द्वारा तय दूरी की तुलना करें.", "ਤੇਜ਼ ਦੌੜਾਕ ਦੇ ਮੁਕੰਮਲ ਕਰਨ ਤੇ ਹੌਲੇ ਦੌੜਾਕ ਵੱਲੋਂ ਤੈਅ ਦੂਰੀ ਦੀ ਤੁਲਨਾ ਕਰੋ.")
          : localizedIntro(parameters, "Rearrange the relation to the requested ratio or time.", "संबंध को मांगे गए अनुपात या समय के अनुसार व्यवस्थित करें.", "ਸੰਬੰਧ ਨੂੰ ਮੰਗੇ ਅਨੁਪਾਤ ਜਾਂ ਸਮੇਂ ਅਨੁਸਾਰ ਬਦਲੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "populationCrossTabCellCount"
    || parameters.taskKind === "populationTotalLiterate"
    || parameters.taskKind === "populationLiteracyPercent"
    || parameters.taskKind === "populationCellRatio"
    || parameters.taskKind === "populationTotalIlliterate"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Build the population table in two steps: first split males and females, then split each row into literate and illiterate.",
          "जनसंख्या तालिका दो चरणों में बनाएं: पहले पुरुष और महिला में बांटें, फिर हर पंक्ति को साक्षर और निरक्षर में बांटें.",
          "ਆਬਾਦੀ ਦੀ ਸਾਰਣੀ ਦੋ ਕਦਮਾਂ ਵਿੱਚ ਬਣਾਓ: ਪਹਿਲਾਂ ਮਰਦ ਅਤੇ ਔਰਤ ਵਿੱਚ ਵੰਡੋ, ਫਿਰ ਹਰ ਕਤਾਰ ਨੂੰ ਪੜ੍ਹੇ-ਲਿਖੇ ਅਤੇ ਅਣਪੜ੍ਹ ਵਿੱਚ ਵੰਡੋ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        solver.workingValues.maleTotal !== undefined
          ? block(`\\text{Male/Female totals}=${String(solver.workingValues.maleTotal)}:${String(solver.workingValues.femaleTotal)}`)
          : localizedIntro(parameters, "Use the relevant cells from the completed table.", "पूर्ण तालिका से संबंधित खाने लें.", "ਪੂਰੀ ਸਾਰਣੀ ਤੋਂ ਸੰਬੰਧਿਤ ਖਾਣੇ ਲਵੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "electionWinnerVotes"
    || parameters.taskKind === "electionWinningMargin"
    || parameters.taskKind === "electionTotalVotersFromMargin"
    || parameters.taskKind === "electionLoserVotes"
    || parameters.taskKind === "electionInvalidVotes"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "For election questions, move through the chain: voters, polled votes, valid votes, then candidate split.",
          "चुनाव प्रश्नों में क्रम से चलें: मतदाता, डाले गए मत, वैध मत, फिर उम्मीदवारों में विभाजन.",
          "ਚੋਣ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਕ੍ਰਮ ਨਾਲ ਚੱਲੋ: ਵੋਟਰ, ਪਈਆਂ ਵੋਟਾਂ, ਵੈਧ ਵੋਟਾਂ, ਫਿਰ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚ ਵੰਡ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        solver.workingValues.validVotes !== undefined
          ? block(`\\text{Valid votes}=${String(solver.workingValues.validVotes)}`)
          : localizedIntro(parameters, "Use the stated valid votes or reverse the margin into valid votes.", "दिए गए वैध मत लें या अंतर से वैध मत उल्टा निकालें.", "ਦਿੱਤੀਆਂ ਵੈਧ ਵੋਟਾਂ ਲਵੋ ਜਾਂ ਅੰਤਰ ਤੋਂ ਵੈਧ ਵੋਟਾਂ ਵਾਪਸ ਕੱਢੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "geometricAreaRatioFromSide"
    || parameters.taskKind === "geometricVolumeRatioFromSide"
    || parameters.taskKind === "geometricSideRatioFromArea"
    || parameters.taskKind === "geometricSurfaceAreaRatioFromVolume"
    || parameters.taskKind === "geometricAreaRatioFromRadius"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "For similar geometric figures, area ratios square the length ratio and volume ratios cube the length ratio.",
          "समरूप ज्यामितीय आकृतियों में क्षेत्रफल अनुपात लंबाई अनुपात का वर्ग और आयतन अनुपात लंबाई अनुपात का घन होता है.",
          "ਸਮਰੂਪ ਜਯਾਮਿਤੀ ਆਕਰਤੀਆਂ ਵਿੱਚ ਖੇਤਰਫਲ ਅਨੁਪਾਤ ਲੰਬਾਈ ਅਨੁਪਾਤ ਦਾ ਵਰਗ ਅਤੇ ਆਇਤਨ ਅਨੁਪਾਤ ਲੰਬਾਈ ਅਨੁਪਾਤ ਦਾ ਘਣ ਹੁੰਦਾ ਹੈ.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        localizedIntro(parameters, "Apply the required power, or reverse it with a square/cube root.", "जरूरी घात लगाएं, या वर्गमूल/घनमूल से उल्टा करें.", "ਲੋੜੀਂਦੀ ਘਾਤ ਲਗਾਓ, ਜਾਂ ਵਰਗਮੂਲ/ਘਨਮੂਲ ਨਾਲ ਉਲਟ ਕਰੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (parameters.taskKind === "ageYearsToReachRatio") {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Add the same unknown number of years to both ages, because everyone ages equally.",
          "दोनों आयु में समान अज्ञात वर्ष जोड़ें, क्योंकि सभी की आयु समान गति से बढ़ती है.",
          "ਦੋਵਾਂ ਉਮਰਾਂ ਵਿੱਚ ਇੱਕੋ ਜਿਹੇ ਅਣਜਾਣ ਸਾਲ ਜੋੜੋ, ਕਿਉਂਕਿ ਸਭ ਦੀ ਉਮਰ ਇੱਕੋ ਤਰ੍ਹਾਂ ਵਧਦੀ ਹੈ.",
        ),
        block(`\\text{Target ratio}=${String(solver.workingValues.futureRatio)}`),
        block(`\\text{Equation}=${solver.mathJax.calculationLatex}`),
        localizedIntro(parameters, "Solve this linear equation for the number of years.", "इस रैखिक समीकरण से वर्षों की संख्या निकालें.", "ਇਸ ਰੇਖੀ ਸਮੀਕਰਨ ਤੋਂ ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ."),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (parameters.taskKind === "ageFutureRatioFromPresent" || parameters.taskKind === "agePastRatioFromPresent") {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Shift both present ages by the same number of years, then simplify the resulting ratio.",
          "à¤¦à¥‹à¤¨à¥‹à¤‚ à¤µà¤°à¥à¤¤à¤®à¤¾à¤¨ à¤†à¤¯à¥à¤“à¤‚ à¤®à¥‡à¤‚ à¤¸à¤®à¤¾à¤¨ à¤µà¤°à¥à¤· à¤œà¥‹à¤¡à¤¼à¥‡à¤‚/à¤˜à¤Ÿà¤¾à¤à¤‚, à¤«à¤¿à¤° à¤®à¤¿à¤²à¥‡ à¤…à¤¨à¥à¤ªà¤¾à¤¤ à¤•à¥‹ à¤¸à¤°à¤² à¤•à¤°à¥‡à¤‚.",
          "à¨¦à©‹à¨µà¨¾à¨‚ à¨®à©Œà¨œà©‚à¨¦à¨¾ à¨‰à¨®à¨°à¨¾à¨‚ à¨µà¨¿à©±à¨š à¨‡à©±à¨•à©‹ à¨œà¨¿à¨¹à©‡ à¨¸à¨¾à¨² à¨œà©‹à©œà©‹/à¨˜à¨Ÿà¨¾à¨“, à¨«à¨¿à¨° à¨®à¨¿à¨²à©‡ à¨…à¨¨à©à¨ªà¨¾à¨¤ à¨¨à©‚à©° à¨¸à¨°à¨² à¨•à¨°à©‹.",
        ),
        block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
        localizedIntro(parameters, "Both ages move by the same amount, so only the shifted values need to be compared.", "à¤¦à¥‹à¤¨à¥‹à¤‚ à¤†à¤¯à¥ à¤¸à¤®à¤¾à¤¨ à¤®à¤¾à¤¤à¥à¤°à¤¾ à¤¸à¥‡ à¤¬à¤¦à¤²à¤¤à¥€ à¤¹à¥ˆ, à¤‡à¤¸à¤²à¤¿à¤ à¤•à¥‡à¤µà¤² à¤¬à¤¦à¤²à¥€ à¤¹à¥à¤ˆ à¤†à¤¯à¥à¤“à¤‚ à¤•à¥€ à¤¤à¥à¤²à¤¨à¤¾ à¤•à¤°à¤¨à¥€ à¤¹à¥ˆ.", "à¨¦à©‹à¨µà¨¾à¨‚ à¨‰à¨®à¨°à¨¾à¨‚ à¨‡à©±à¨•à©‹ à¨®à¨¾à¨¤à¨°à¨¾ à¨¨à¨¾à¨² à¨¬à¨¦à¨²à¨¦à©€à¨†à¨‚ à¨¹à¨¨, à¨‡à¨¸ à¨²à¨ˆ à¨¸à¨¿à¨°à¨« à¨¬à¨¦à¨²à©€à¨†à¨‚ à¨‰à¨®à¨°à¨¾à¨‚ à¨¦à©€ à¨¤à©à¨²à¨¨à¨¾ à¨•à¨°à¨¨à©€ à¨¹à©ˆ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  return {
    explanationId: parameters.explanationId,
    lines: [
      localizedIntro(
        parameters,
        "Let the present ages be ratio parts multiplied by a common unit.",
        "वर्तमान आयु को अनुपात के भागों और एक समान गुणक के रूप में मानें.",
        "ਮੌਜੂਦਾ ਉਮਰਾਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਭਾਗਾਂ ਅਤੇ ਇੱਕ ਸਾਂਝੇ ਗੁਣਕ ਵਜੋਂ ਮੰਨੋ.",
      ),
      block(`\\text{Setup}=${String(solver.workingValues.setup)}`),
      block(`\\text{Equation}=${solver.mathJax.calculationLatex}`),
      localizedIntro(parameters, "Use the time shift or age difference to find the common unit.", "समय परिवर्तन या आयु अंतर से समान गुणक निकालें.", "ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਜਾਂ ਉਮਰ ਦੇ ਅੰਤਰ ਨਾਲ ਸਾਂਝਾ ਗੁਣਕ ਕੱਢੋ."),
      block(`\\text{Common unit}=${String(solver.workingValues.unit)}`),
      block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
    ],
  };
}
