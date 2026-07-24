import type { Rap003Parameters } from "./types";

type Language = "hi" | "pa";
function v(p: Rap003Parameters, key: string) { return p.variables[key]; }

function election(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (task === "electionWinnerVotes") return hi
    ? `दो उम्मीदवारों के वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} और कुल वैध मत ${v(p, "totalValidVotes")} हैं। विजेता के मत ज्ञात करें।`
    : `ਦੋ ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਅਤੇ ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ${v(p, "totalValidVotes")} ਹਨ। ਜੇਤੂ ਦੀਆਂ ਵੋਟਾਂ ਲੱਭੋ।`;
  if (task === "electionWinningMargin" || task === "electionLoserVotes") return hi
    ? `कुल मतदाता ${v(p, "totalVoters")} हैं। ${v(p, "turnoutPercent")}% ने मतदान किया और डाले गए मतों में ${v(p, "validPercent")}% वैध हैं। दो उम्मीदवारों के वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} है। ${task === "electionWinningMargin" ? "जीत का अंतर" : "हारने वाले के मत"} ज्ञात करें।`
    : `ਕੁੱਲ ਵੋਟਰ ${v(p, "totalVoters")} ਹਨ। ${v(p, "turnoutPercent")}% ਨੇ ਵੋਟ ਪਾਈ ਅਤੇ ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚ ${v(p, "validPercent")}% ਵੈਧ ਹਨ। ਦੋ ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਹੈ। ${task === "electionWinningMargin" ? "ਜਿੱਤ ਦਾ ਅੰਤਰ" : "ਹਾਰਨ ਵਾਲੇ ਦੀਆਂ ਵੋਟਾਂ"} ਲੱਭੋ।`;
  if (task === "electionTotalVotersFromMargin" || task === "electionMarginDifferenceChain") return hi
    ? `जीत का अंतर ${v(p, "winningMargin")} मत है। उम्मीदवारों के वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}, मतदान ${v(p, "turnoutPercent")}% और ${v(p, "validPercent") !== undefined ? `वैध मत ${v(p, "validPercent")}%` : `अवैध मत ${v(p, "invalidPercent")}%`} हैं। कुल मतदाता ज्ञात करें।`
    : `ਜਿੱਤ ਦਾ ਅੰਤਰ ${v(p, "winningMargin")} ਵੋਟਾਂ ਹੈ। ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}, ਵੋਟਿੰਗ ${v(p, "turnoutPercent")}% ਅਤੇ ${v(p, "validPercent") !== undefined ? `ਵੈਧ ਵੋਟਾਂ ${v(p, "validPercent")}%` : `ਅਵੈਧ ਵੋਟਾਂ ${v(p, "invalidPercent")}%`} ਹਨ। ਕੁੱਲ ਵੋਟਰ ਲੱਭੋ।`;
  if (task === "electionInvalidVotes") return hi
    ? `कुल मतदाता ${v(p, "totalVoters")} हैं। ${v(p, "turnoutPercent")}% ने मतदान किया और डाले गए मतों में ${v(p, "invalidPercent")}% अवैध हैं। अवैध मतों की संख्या ज्ञात करें।`
    : `ਕੁੱਲ ਵੋਟਰ ${v(p, "totalVoters")} ਹਨ। ${v(p, "turnoutPercent")}% ਨੇ ਵੋਟ ਪਾਈ ਅਤੇ ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚ ${v(p, "invalidPercent")}% ਅਵੈਧ ਹਨ। ਅਵੈਧ ਵੋਟਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  if (task === "electionPolledVotesFromTurnout") return hi
    ? `कुल मतदाता ${v(p, "totalVoters")} और मतदान प्रतिशत ${v(p, "turnoutPercent")}% है। डाले गए मतों की संख्या ज्ञात करें।`
    : `ਕੁੱਲ ਵੋਟਰ ${v(p, "totalVoters")} ਅਤੇ ਵੋਟਿੰਗ ਪ੍ਰਤੀਸ਼ਤ ${v(p, "turnoutPercent")}% ਹੈ। ਪਈਆਂ ਵੋਟਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  if (task === "electionValidVotesFromInvalidRate") return hi
    ? `कुल डाले गए मत ${v(p, "polledVotes")} हैं और ${v(p, "invalidPercent")}% मत अवैध हैं। वैध मत ज्ञात करें।`
    : `ਕੁੱਲ ਪਈਆਂ ਵੋਟਾਂ ${v(p, "polledVotes")} ਹਨ ਅਤੇ ${v(p, "invalidPercent")}% ਵੋਟਾਂ ਅਵੈਧ ਹਨ। ਵੈਧ ਵੋਟਾਂ ਲੱਭੋ।`;
  if (task === "electionWinnerFromMarginAndValidVotes" || task === "electionLoserFromMarginAndValidVotes") return hi
    ? `कुल वैध मत ${v(p, "totalValidVotes")} और जीत का अंतर ${v(p, "winningMargin")} मत है। ${task.includes("Winner") ? "विजेता" : "हारने वाले"} के मत ज्ञात करें।`
    : `ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ${v(p, "totalValidVotes")} ਅਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ${v(p, "winningMargin")} ਵੋਟਾਂ ਹੈ। ${task.includes("Winner") ? "ਜੇਤੂ" : "ਹਾਰਨ ਵਾਲੇ"} ਦੀਆਂ ਵੋਟਾਂ ਲੱਭੋ।`;
  if (task === "electionThreeCandidateSplit") return hi
    ? `तीन उम्मीदवार ${v(p, "totalValidVotes")} वैध मतों को ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}:${v(p, "candidateRatioC")} के अनुपात में बांटते हैं। विजेता के मत ज्ञात करें।`
    : `ਤਿੰਨ ਉਮੀਦਵਾਰ ${v(p, "totalValidVotes")} ਵੈਧ ਵੋਟਾਂ ਨੂੰ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}:${v(p, "candidateRatioC")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੇ ਹਨ। ਜੇਤੂ ਦੀਆਂ ਵੋਟਾਂ ਲੱਭੋ।`;
  if (task === "electionCandidateSharePercent") return hi
    ? `दो उम्मीदवारों के वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} है। विजेता का मत प्रतिशत ज्ञात करें।`
    : `ਦੋ ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਹੈ। ਜੇਤੂ ਦਾ ਵੋਟ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  if (task === "electionRatioFromVoteSharePercent") return hi
    ? `दो उम्मीदवारों को ${v(p, "percentA")}% और ${v(p, "percentB")}% मत मिलते हैं। उनके मतों का अनुपात ज्ञात करें।`
    : `ਦੋ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ${v(p, "percentA")}% ਅਤੇ ${v(p, "percentB")}% ਵੋਟਾਂ ਮਿਲਦੀਆਂ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "electionOneCandidateMorePercent") return hi
    ? `A को B से ${v(p, "morePercent")}% अधिक मत मिलते हैं। कुल वैध मत ${v(p, "totalValidVotes")} हैं। A के मत ज्ञात करें।`
    : `A ਨੂੰ B ਤੋਂ ${v(p, "morePercent")}% ਵੱਧ ਵੋਟਾਂ ਮਿਲਦੀਆਂ ਹਨ। ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ${v(p, "totalValidVotes")} ਹਨ। A ਦੀਆਂ ਵੋਟਾਂ ਲੱਭੋ।`;
  if (task === "electionMarginAsPercentOfValid") return hi
    ? `दो उम्मीदवारों के वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} है। जीत का अंतर, कुल वैध मतों का कितने प्रतिशत है?`
    : `ਦੋ ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਹੈ। ਜਿੱਤ ਦਾ ਅੰਤਰ, ਕੁੱਲ ਵੈਧ ਵੋਟਾਂ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;
  if (task === "electionTotalElectorateFromCandidateVotes") return hi
    ? `A को ${v(p, "candidateVotes")} मत मिले। वैध मतों का अनुपात ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}, मतदान ${v(p, "turnoutPercent")}% और वैधता ${v(p, "validPercent")}% है। कुल मतदाता ज्ञात करें।`
    : `A ਨੂੰ ${v(p, "candidateVotes")} ਵੋਟਾਂ ਮਿਲੀਆਂ। ਵੈਧ ਵੋਟਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")}, ਵੋਟਿੰਗ ${v(p, "turnoutPercent")}% ਅਤੇ ਵੈਧਤਾ ${v(p, "validPercent")}% ਹੈ। ਕੁੱਲ ਵੋਟਰ ਲੱਭੋ।`;
  if (task === "marketShareWinner") return hi
    ? `₹${v(p, "totalMarket")} के बाजार को दो कंपनियां ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} में बांटती हैं। बड़ी कंपनी का हिस्सा ज्ञात करें।`
    : `₹${v(p, "totalMarket")} ਦੇ ਬਾਜ਼ਾਰ ਨੂੰ ਦੋ ਕੰਪਨੀਆਂ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਵਿੱਚ ਵੰਡਦੀਆਂ ਹਨ। ਵੱਡੀ ਕੰਪਨੀ ਦਾ ਹਿੱਸਾ ਲੱਭੋ।`;
  if (task === "surveyResponseShare") return hi
    ? `कुल ${v(p, "totalResponses")} उत्तर A और B में ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} के अनुपात में बंटे हैं। A के उत्तर ज्ञात करें।`
    : `ਕੁੱਲ ${v(p, "totalResponses")} ਜਵਾਬ A ਅਤੇ B ਵਿੱਚ ${v(p, "candidateRatioA")}:${v(p, "candidateRatioB")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੇ ਹਨ। A ਦੇ ਜਵਾਬ ਲੱਭੋ।`;
  if (task === "electionNotaInvalidStyle") return hi
    ? `कुल मतदाता ${v(p, "totalVoters")} हैं और मतदान ${v(p, "turnoutPercent")}% है। डाले गए मतों में से ${v(p, "notaPercent")}% ने किसी उम्मीदवार को नहीं चुना। ऐसे मतों की संख्या ज्ञात करें।`
    : `ਕੁੱਲ ਵੋਟਰ ${v(p, "totalVoters")} ਹਨ ਅਤੇ ਵੋਟਿੰਗ ${v(p, "turnoutPercent")}% ਹੈ। ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚੋਂ ${v(p, "notaPercent")}% ਨੇ ਕਿਸੇ ਉਮੀਦਵਾਰ ਨੂੰ ਨਹੀਂ ਚੁਣਿਆ। ਅਜਿਹੀਆਂ ਵੋਟਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  if (task === "electionReverseTurnoutFromValidVotes") return hi
    ? `कुल मतदाता ${v(p, "totalVoters")} हैं। वैध मत ${v(p, "totalValidVotes")} हैं, जो डाले गए मतों के ${v(p, "validPercent")}% हैं। मतदान प्रतिशत ज्ञात करें।`
    : `ਕੁੱਲ ਵੋਟਰ ${v(p, "totalVoters")} ਹਨ। ਵੈਧ ਵੋਟਾਂ ${v(p, "totalValidVotes")} ਹਨ, ਜੋ ਪਈਆਂ ਵੋਟਾਂ ਦਾ ${v(p, "validPercent")}% ਹਨ। ਵੋਟਿੰਗ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  return undefined;
}

function geometry(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (task === "geometricAreaRatioFromSide") return hi
    ? `दो समान आकृतियों की संगत भुजाओं का अनुपात ${v(p, "sideRatioA")}:${v(p, "sideRatioB")} है। उनके क्षेत्रफलों का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮਰੂਪ ਆਕ੍ਰਿਤੀਆਂ ਦੀਆਂ ਮਿਲਦੀਆਂ ਭੁਜਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "sideRatioA")}:${v(p, "sideRatioB")} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "geometricAreaRatioFromRadius") return hi
    ? `दो वृत्तों की त्रिज्याओं का अनुपात ${v(p, "radiusRatioA")}:${v(p, "radiusRatioB")} है। क्षेत्रफलों का अनुपात ज्ञात करें।`
    : `ਦੋ ਵਰਤੁਲਾਂ ਦੀਆਂ ਤ੍ਰਿਜਿਆਵਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "radiusRatioA")}:${v(p, "radiusRatioB")} ਹੈ। ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "geometricVolumeRatioFromSide" || task === "geometricPowerMixedStatement") return hi
    ? `दो समान ठोसों की संगत लंबाइयों का अनुपात ${v(p, "sideRatioA")}:${v(p, "sideRatioB")} है। आयतनों का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮਰੂਪ ਠੋਸਾਂ ਦੀਆਂ ਮਿਲਦੀਆਂ ਲੰਬਾਈਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "sideRatioA")}:${v(p, "sideRatioB")} ਹੈ। ਆਇਤਨਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "geometricSideRatioFromArea") return hi
    ? `दो समान आकृतियों के क्षेत्रफलों का अनुपात ${v(p, "areaRatioA")}:${v(p, "areaRatioB")} है। संगत लंबाइयों का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮਰੂਪ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "areaRatioA")}:${v(p, "areaRatioB")} ਹੈ। ਮਿਲਦੀਆਂ ਲੰਬਾਈਆਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "geometricSurfaceAreaRatioFromVolume") return hi
    ? `दो समान ठोसों के आयतनों का अनुपात ${v(p, "volumeRatioA")}:${v(p, "volumeRatioB")} है। पृष्ठीय क्षेत्रफलों का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮਰੂਪ ਠੋਸਾਂ ਦੇ ਆਇਤਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "volumeRatioA")}:${v(p, "volumeRatioB")} ਹੈ। ਸਤਹੀ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "mapScaleAreaRatio") return hi
    ? `दो मानचित्रों के लंबाई पैमानों का अनुपात ${v(p, "scaleRatioA")}:${v(p, "scaleRatioB")} है। दर्शाए गए क्षेत्रफलों का अनुपात ज्ञात करें।`
    : `ਦੋ ਨਕਸ਼ਿਆਂ ਦੇ ਲੰਬਾਈ ਪੈਮਾਨਿਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "scaleRatioA")}:${v(p, "scaleRatioB")} ਹੈ। ਦਰਸਾਏ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "mapScaleLengthFromArea") return hi
    ? `दो मानचित्रों में दर्शाए क्षेत्रफलों का अनुपात ${v(p, "areaRatioA")}:${v(p, "areaRatioB")} है। लंबाई पैमानों का अनुपात ज्ञात करें।`
    : `ਦੋ ਨਕਸ਼ਿਆਂ ਵਿੱਚ ਦਰਸਾਏ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "areaRatioA")}:${v(p, "areaRatioB")} ਹੈ। ਲੰਬਾਈ ਪੈਮਾਨਿਆਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "similarSolidSurfaceToVolume") return hi
    ? `दो समान ठोसों के पृष्ठीय क्षेत्रफलों का अनुपात ${v(p, "surfaceAreaRatioA")}:${v(p, "surfaceAreaRatioB")} है। आयतनों का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮਰੂਪ ਠੋਸਾਂ ਦੇ ਸਤਹੀ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "surfaceAreaRatioA")}:${v(p, "surfaceAreaRatioB")} ਹੈ। ਆਇਤਨਾਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  return undefined;
}

export function renderLocalizedRap003ElectionGeometryStem(p: Rap003Parameters) {
  if (p.language === "en") return undefined;
  const language = p.language as Language;
  if (p.canonicalProblemId === "RAP-CP-021") return election(p, language);
  if (p.canonicalProblemId === "RAP-CP-022") return geometry(p, language);
  return undefined;
}
