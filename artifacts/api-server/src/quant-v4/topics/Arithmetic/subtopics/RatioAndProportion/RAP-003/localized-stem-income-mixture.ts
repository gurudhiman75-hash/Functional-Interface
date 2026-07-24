import type { Rap003Parameters } from "./types";

type Language = "hi" | "pa";

function v(p: Rap003Parameters, key: string) { return p.variables[key]; }
function has(p: Rap003Parameters, key: string) { return p.variables[key] !== undefined; }
function target(p: Rap003Parameters) {
  return String(v(p, "targetPerson") ?? "") === String(v(p, "personB") ?? "") ? "B" : "A";
}

function income(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const ql = p.questionLanguageId;
  const t = target(p);
  const incomeRatio = `${v(p, "incomeRatioA")}:${v(p, "incomeRatioB")}`;
  const expenseRatio = `${v(p, "expenditureRatioA")}:${v(p, "expenditureRatioB")}`;
  const savingsRatio = `${v(p, "savingsRatioA")}:${v(p, "savingsRatioB")}`;

  if (["RAP-QL-951", "RAP-QL-955", "RAP-QL-974"].includes(ql)) {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। आय की एक इकाई ₹${v(p, "incomeUnit")} और खर्च की एक इकाई ₹${v(p, "expenditureUnit")} है। उनकी बचत का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਆਮਦਨ ਦੀ ਇੱਕ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਅਤੇ ਖਰਚ ਦੀ ਇੱਕ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-952") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। दोनों की बचत बराबर है। A की आय ₹${v(p, "givenIncomeA")} है। ${t} की बचत ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਦੋਵਾਂ ਦੀ ਬਚਤ ਬਰਾਬਰ ਹੈ। A ਦੀ ਆਮਦਨ ₹${v(p, "givenIncomeA")} ਹੈ। ${t} ਦੀ ਬਚਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-957") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। दोनों की बचत बराबर है। B का खर्च ₹${v(p, "givenExpenditureB")} है। ${t} की बचत ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਦੋਵਾਂ ਦੀ ਬਚਤ ਬਰਾਬਰ ਹੈ। B ਦਾ ਖਰਚ ₹${v(p, "givenExpenditureB")} ਹੈ। ${t} ਦੀ ਬਚਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-953") {
    return hi
      ? `A और B की आय, खर्च और बचत के अनुपात क्रमशः ${incomeRatio}, ${expenseRatio} और ${savingsRatio} हैं। B का खर्च ₹${v(p, "givenExpenditureB")} है। ${t} की आय ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ, ਖਰਚ ਅਤੇ ਬਚਤ ਦੇ ਅਨੁਪਾਤ ਕ੍ਰਮਵਾਰ ${incomeRatio}, ${expenseRatio} ਅਤੇ ${savingsRatio} ਹਨ। B ਦਾ ਖਰਚ ₹${v(p, "givenExpenditureB")} ਹੈ। ${t} ਦੀ ਆਮਦਨ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-954") {
    return hi
      ? `A और B की आय, खर्च और बचत के अनुपात क्रमशः ${incomeRatio}, ${expenseRatio} और ${savingsRatio} हैं। A की आय ₹${v(p, "givenIncomeA")} है। ${t} का खर्च ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ, ਖਰਚ ਅਤੇ ਬਚਤ ਦੇ ਅਨੁਪਾਤ ਕ੍ਰਮਵਾਰ ${incomeRatio}, ${expenseRatio} ਅਤੇ ${savingsRatio} ਹਨ। A ਦੀ ਆਮਦਨ ₹${v(p, "givenIncomeA")} ਹੈ। ${t} ਦਾ ਖਰਚ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-958") {
    return hi
      ? `A और B के खर्च का अनुपात ${expenseRatio} और बचत का अनुपात ${savingsRatio} है। खर्च की इकाई ₹${v(p, "expenditureUnit")} तथा बचत की इकाई ₹${v(p, "savingsUnit")} है। उनकी आय का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਅਤੇ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ${savingsRatio} ਹੈ। ਖਰਚ ਦੀ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਅਤੇ ਬਚਤ ਦੀ ਇਕਾਈ ₹${v(p, "savingsUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-959") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} और बचत का अनुपात ${savingsRatio} है। आय की इकाई ₹${v(p, "incomeUnit")} तथा बचत की इकाई ₹${v(p, "savingsUnit")} है। उनके खर्च का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ${savingsRatio} ਹੈ। ਆਮਦਨ ਦੀ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਅਤੇ ਬਚਤ ਦੀ ਇਕਾਈ ₹${v(p, "savingsUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-960" || ql === "RAP-QL-970") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। दोनों अनुपातों में समान इकाई है। बचत का अंतर ₹${v(p, "savingsDifference")} है। ${t} की आय ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਇੱਕੋ ਇਕਾਈ ਹੈ। ਬਚਤ ਦਾ ਅੰਤਰ ₹${v(p, "savingsDifference")} ਹੈ। ${t} ਦੀ ਆਮਦਨ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-961") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। दोनों अनुपातों में समान इकाई है। कुल बचत ₹${v(p, "savingsSum")} है। ${t} का खर्च ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਦੋਵੇਂ ਅਨੁਪਾਤਾਂ ਵਿੱਚ ਇੱਕੋ ਇਕਾਈ ਹੈ। ਕੁੱਲ ਬਚਤ ₹${v(p, "savingsSum")} ਹੈ। ${t} ਦਾ ਖਰਚ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-962") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} है। A अपनी आय का ${v(p, "savePercentA")}% तथा B ${v(p, "savePercentB")}% बचाता है। उनकी बचत का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਹੈ। A ਆਪਣੀ ਆਮਦਨ ਦਾ ${v(p, "savePercentA")}% ਅਤੇ B ${v(p, "savePercentB")}% ਬਚਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-963") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। आय की इकाई ₹${v(p, "incomeUnit")} और खर्च की इकाई ₹${v(p, "expenditureUnit")} है। ${t} की बचत, आय का कितने प्रतिशत है?`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਆਮਦਨ ਦੀ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਅਤੇ ਖਰਚ ਦੀ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਹੈ। ${t} ਦੀ ਬਚਤ, ਆਮਦਨ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;
  }
  if (ql === "RAP-QL-964") {
    return hi
      ? `दो परिवारों की आय का अनुपात ${incomeRatio} और खर्च का अनुपात ${expenseRatio} है। आय की इकाई ₹${v(p, "incomeUnit")} तथा खर्च की इकाई ₹${v(p, "expenditureUnit")} है। दोनों की कुल बचत ज्ञात करें।`
      : `ਦੋ ਪਰਿਵਾਰਾਂ ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਆਮਦਨ ਦੀ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਅਤੇ ਖਰਚ ਦੀ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਹੈ। ਦੋਵਾਂ ਦੀ ਕੁੱਲ ਬਚਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-965") {
    return hi
      ? `A और B के वेतन का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। दोनों की समान इकाई ₹${v(p, "incomeUnit")} है। उनकी बचत का अंतर ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਤਨਖਾਹ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਦੋਵਾਂ ਦੀ ਇੱਕੋ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਬਚਤ ਦਾ ਅੰਤਰ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-966") {
    return hi
      ? `दो दुकानों की आय का अनुपात ${v(p, "revenueRatioA")}:${v(p, "revenueRatioB")} और लागत का अनुपात ${v(p, "costRatioA")}:${v(p, "costRatioB")} है। आय की इकाई ₹${v(p, "revenueUnit")} तथा लागत की इकाई ₹${v(p, "costUnit")} है। लाभ का अनुपात ज्ञात करें।`
      : `ਦੋ ਦੁਕਾਨਾਂ ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${v(p, "revenueRatioA")}:${v(p, "revenueRatioB")} ਅਤੇ ਲਾਗਤ ਦਾ ਅਨੁਪਾਤ ${v(p, "costRatioA")}:${v(p, "costRatioB")} ਹੈ। ਆਮਦਨ ਦੀ ਇਕਾਈ ₹${v(p, "revenueUnit")} ਅਤੇ ਲਾਗਤ ਦੀ ਇਕਾਈ ₹${v(p, "costUnit")} ਹੈ। ਲਾਭ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-967") {
    return hi
      ? `A और B की आय बराबर ₹${v(p, "incomeValue")} है। खर्च का अनुपात ${expenseRatio} और खर्च की इकाई ₹${v(p, "expenditureUnit")} है। उनकी बचत का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਬਰਾਬਰ ₹${v(p, "incomeValue")} ਹੈ। ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਅਤੇ ਖਰਚ ਦੀ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-968") {
    return hi
      ? `A और B का खर्च बराबर ₹${v(p, "expenseValue")} है। आय का अनुपात ${incomeRatio} और आय की इकाई ₹${v(p, "incomeUnit")} है। उनकी बचत का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦਾ ਖਰਚ ਬਰਾਬਰ ₹${v(p, "expenseValue")} ਹੈ। ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਆਮਦਨ ਦੀ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਬਚਤ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-969") {
    return hi
      ? `A और B की जेब खर्च राशि का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। इकाइयां ₹${v(p, "incomeUnit")} और ₹${v(p, "expenditureUnit")} हैं। बचत का अनुपात ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਜੇਬ-ਖਰਚ ਰਕਮ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਇਕਾਈਆਂ ₹${v(p, "incomeUnit")} ਅਤੇ ₹${v(p, "expenditureUnit")} ਹਨ। ਬਚਤ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-971") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} तथा खर्च का अनुपात ${expenseRatio} है। समान इकाई में खर्च का अंतर ₹${v(p, "expenseDifference")} है। ${t} की बचत ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਹੈ। ਇੱਕੋ ਇਕਾਈ ਵਿੱਚ ਖਰਚ ਦਾ ਅੰਤਰ ₹${v(p, "expenseDifference")} ਹੈ। ${t} ਦੀ ਬਚਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-972") {
    return hi
      ? `A और B की आय का अनुपात ${incomeRatio} और कुल आय ₹${v(p, "totalIncome")} है। खर्च का अनुपात ${expenseRatio} तथा इकाई ₹${v(p, "expenditureUnit")} है। दोनों की कुल बचत ज्ञात करें।`
      : `A ਅਤੇ B ਦੀ ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਕੁੱਲ ਆਮਦਨ ₹${v(p, "totalIncome")} ਹੈ। ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਅਤੇ ਇਕਾਈ ₹${v(p, "expenditureUnit")} ਹੈ। ਦੋਵਾਂ ਦੀ ਕੁੱਲ ਬਚਤ ਲੱਭੋ।`;
  }
  if (ql === "RAP-QL-973") {
    return hi
      ? `A और B के खर्च का अनुपात ${expenseRatio} और कुल खर्च ₹${v(p, "totalExpense")} है। आय का अनुपात ${incomeRatio} तथा इकाई ₹${v(p, "incomeUnit")} है। दोनों की कुल आय ज्ञात करें।`
      : `A ਅਤੇ B ਦੇ ਖਰਚ ਦਾ ਅਨੁਪਾਤ ${expenseRatio} ਅਤੇ ਕੁੱਲ ਖਰਚ ₹${v(p, "totalExpense")} ਹੈ। ਆਮਦਨ ਦਾ ਅਨੁਪਾਤ ${incomeRatio} ਅਤੇ ਇਕਾਈ ₹${v(p, "incomeUnit")} ਹੈ। ਦੋਵਾਂ ਦੀ ਕੁੱਲ ਆਮਦਨ ਲੱਭੋ।`;
  }
  return undefined;
}

function mixture(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (["alloyMixingRatioFromTarget", "alloyTargetExactlyMidpoint", "alloyNonMidpointTrap", "alloyPureAndImpureMix", "alloyZeroComponentMix", "mixingRatioFromAveragePrice"].includes(task)) {
    return hi
      ? `पहले मिश्रण में मुख्य घटक ${v(p, "percentA")}% और दूसरे में ${v(p, "percentB")}% है। ${v(p, "targetPercent")}% वाला मिश्रण पाने के लिए दोनों को किस अनुपात में मिलाएं?`
      : `ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "percentA")}% ਅਤੇ ਦੂਜੇ ਵਿੱਚ ${v(p, "percentB")}% ਹੈ। ${v(p, "targetPercent")}% ਵਾਲਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣ ਲਈ ਦੋਵਾਂ ਨੂੰ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?`;
  }
  if (["alloyTargetComponentFromMix", "sugarSolutionConcentration"].includes(task)) {
    return hi
      ? `पहले मिश्रण के ${v(p, "quantityA")} लीटर में मुख्य घटक ${v(p, "percentA")}% और दूसरे के ${v(p, "quantityB")} लीटर में ${v(p, "percentB")}% है। अंतिम प्रतिशत ज्ञात करें।`
      : `ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਦੇ ${v(p, "quantityA")} ਲੀਟਰ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "percentA")}% ਅਤੇ ਦੂਜੇ ਦੇ ${v(p, "quantityB")} ਲੀਟਰ ਵਿੱਚ ${v(p, "percentB")}% ਹੈ। ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  }
  if (task === "alloyThreeSourceEqualMix") {
    return hi
      ? `तीन मिश्रण समान मात्रा में मिलाए जाते हैं। उनमें मुख्य घटक और अन्य भाग के अनुपात ${v(p, "ratioAComponent")}:${v(p, "ratioAOther")}, ${v(p, "ratioBComponent")}:${v(p, "ratioBOther")} और ${v(p, "ratioCComponent")}:${v(p, "ratioCOther")} हैं। अंतिम अनुपात ज्ञात करें।`
      : `ਤਿੰਨ ਮਿਸ਼ਰਣ ਬਰਾਬਰ ਮਾਤਰਾ ਵਿੱਚ ਮਿਲਾਏ ਜਾਂਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ਅਤੇ ਹੋਰ ਹਿੱਸੇ ਦੇ ਅਨੁਪਾਤ ${v(p, "ratioAComponent")}:${v(p, "ratioAOther")}, ${v(p, "ratioBComponent")}:${v(p, "ratioBOther")} ਅਤੇ ${v(p, "ratioCComponent")}:${v(p, "ratioCOther")} ਹਨ। ਅੰਤਿਮ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  }
  if (["weightedAverageGroup", "marksAverageMixture"].includes(task)) {
    return hi
      ? `समूह A में ${v(p, "quantityA")} सदस्य हैं और औसत ${v(p, "averageA")} है। समूह B में ${v(p, "quantityB")} सदस्य हैं और औसत ${v(p, "averageB")} है। संयुक्त औसत ज्ञात करें।`
      : `ਸਮੂਹ A ਵਿੱਚ ${v(p, "quantityA")} ਮੈਂਬਰ ਹਨ ਅਤੇ ਔਸਤ ${v(p, "averageA")} ਹੈ। ਸਮੂਹ B ਵਿੱਚ ${v(p, "quantityB")} ਮੈਂਬਰ ਹਨ ਅਤੇ ਔਸਤ ${v(p, "averageB")} ਹੈ। ਸਾਂਝੀ ਔਸਤ ਲੱਭੋ।`;
  }
  if (task === "alloyMissingQuantity") {
    return hi
      ? `${v(p, "quantityA")} लीटर मिश्रण में मुख्य घटक ${v(p, "percentA")}% है। ${v(p, "percentB")}% वाले दूसरे मिश्रण की कितनी मात्रा मिलाने पर प्रतिशत ${v(p, "targetPercent")}% होगा?`
      : `${v(p, "quantityA")} ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "percentA")}% ਹੈ। ${v(p, "percentB")}% ਵਾਲੇ ਦੂਜੇ ਮਿਸ਼ਰਣ ਦੀ ਕਿੰਨੀ ਮਾਤਰਾ ਮਿਲਾਉਣ ਨਾਲ ਪ੍ਰਤੀਸ਼ਤ ${v(p, "targetPercent")}% ਹੋਵੇਗਾ?`;
  }
  if (task === "alloyMissingSourcePercent") {
    return hi
      ? `पहले मिश्रण में मुख्य घटक ${v(p, "percentA")}% है। दोनों मिश्रण ${v(p, "mixRatioA")}:${v(p, "mixRatioB")} में मिलाए जाते हैं और अंतिम प्रतिशत ${v(p, "targetPercent")}% है। दूसरे मिश्रण का प्रतिशत ज्ञात करें।`
      : `ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "percentA")}% ਹੈ। ਦੋਵੇਂ ਮਿਸ਼ਰਣ ${v(p, "mixRatioA")}:${v(p, "mixRatioB")} ਵਿੱਚ ਮਿਲਾਏ ਜਾਂਦੇ ਹਨ ਅਤੇ ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ${v(p, "targetPercent")}% ਹੈ। ਦੂਜੇ ਮਿਸ਼ਰਣ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  }
  if (task === "alloyTargetFromThreeSources") {
    return hi
      ? `तीन मिश्रणों की मात्राएं ${v(p, "quantityA")}, ${v(p, "quantityB")} और ${v(p, "quantityC")} लीटर तथा मुख्य घटक के प्रतिशत ${v(p, "percentA")}%, ${v(p, "percentB")}% और ${v(p, "percentC")}% हैं। अंतिम प्रतिशत ज्ञात करें।`
      : `ਤਿੰਨ ਮਿਸ਼ਰਣਾਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ${v(p, "quantityA")}, ${v(p, "quantityB")} ਅਤੇ ${v(p, "quantityC")} ਲੀਟਰ ਅਤੇ ਮੁੱਖ ਘਟਕ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ${v(p, "percentA")}%, ${v(p, "percentB")}% ਅਤੇ ${v(p, "percentC")}% ਹਨ। ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  }
  if (task === "weightedProfitPercentMix" || task === "weightedDiscountMix") {
    return hi
      ? `₹${v(p, "quantityA")} पर ${v(p, "averageA")}% और ₹${v(p, "quantityB")} पर ${v(p, "averageB")}% की दर लागू होती है। भारित औसत प्रतिशत ज्ञात करें।`
      : `₹${v(p, "quantityA")} ਉੱਤੇ ${v(p, "averageA")}% ਅਤੇ ₹${v(p, "quantityB")} ਉੱਤੇ ${v(p, "averageB")}% ਦੀ ਦਰ ਲਾਗੂ ਹੁੰਦੀ ਹੈ। ਭਾਰਿਤ ਔਸਤ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  }
  if (task === "averagePriceFromRatio") {
    return hi
      ? `दो वस्तुएं ${v(p, "ratioA")}:${v(p, "ratioB")} के अनुपात में मिलाई जाती हैं। उनके मूल्य ₹${v(p, "priceA")} और ₹${v(p, "priceB")} प्रति किलोग्राम हैं। औसत मूल्य ज्ञात करें।`
      : `ਦੋ ਵਸਤਾਂ ${v(p, "ratioA")}:${v(p, "ratioB")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਮੁੱਲ ₹${v(p, "priceA")} ਅਤੇ ₹${v(p, "priceB")} ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਹਨ। ਔਸਤ ਮੁੱਲ ਲੱਭੋ।`;
  }
  if (task === "reverseWeightedAverageCount") {
    return hi
      ? `समूह A में ${v(p, "quantityA")} सदस्य और औसत ${v(p, "averageA")} है। समूह B का औसत ${v(p, "averageB")} और संयुक्त औसत ${v(p, "combinedAverage")} है। समूह B के सदस्यों की संख्या ज्ञात करें।`
      : `ਸਮੂਹ A ਵਿੱਚ ${v(p, "quantityA")} ਮੈਂਬਰ ਅਤੇ ਔਸਤ ${v(p, "averageA")} ਹੈ। ਸਮੂਹ B ਦੀ ਔਸਤ ${v(p, "averageB")} ਅਤੇ ਸਾਂਝੀ ਔਸਤ ${v(p, "combinedAverage")} ਹੈ। ਸਮੂਹ B ਦੇ ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  }
  if (task === "reverseWeightedAverageGroupAvg") {
    return hi
      ? `समूह A में ${v(p, "quantityA")} सदस्य और औसत ${v(p, "averageA")} है। समूह B में ${v(p, "quantityB")} सदस्य हैं। संयुक्त औसत ${v(p, "combinedAverage")} है। समूह B का औसत ज्ञात करें।`
      : `ਸਮੂਹ A ਵਿੱਚ ${v(p, "quantityA")} ਮੈਂਬਰ ਅਤੇ ਔਸਤ ${v(p, "averageA")} ਹੈ। ਸਮੂਹ B ਵਿੱਚ ${v(p, "quantityB")} ਮੈਂਬਰ ਹਨ। ਸਾਂਝੀ ਔਸਤ ${v(p, "combinedAverage")} ਹੈ। ਸਮੂਹ B ਦੀ ਔਸਤ ਲੱਭੋ।`;
  }
  if (task === "alloyReplaceToTarget") {
    return hi
      ? `${v(p, "totalQuantity")} लीटर मिश्रण में मुख्य घटक ${v(p, "initialPercent")}% है। कुछ मिश्रण निकालकर ${v(p, "addPercent")}% वाला घोल भरा जाता है। अंतिम प्रतिशत ${v(p, "targetPercent")}% करने के लिए कितने लीटर बदलें?`
      : `${v(p, "totalQuantity")} ਲੀਟਰ ਮਿਸ਼ਰਣ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "initialPercent")}% ਹੈ। ਕੁਝ ਮਿਸ਼ਰਣ ਕੱਢ ਕੇ ${v(p, "addPercent")}% ਵਾਲਾ ਘੋਲ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ${v(p, "targetPercent")}% ਕਰਨ ਲਈ ਕਿੰਨੇ ਲੀਟਰ ਬਦਲੇ ਜਾਣ?`;
  }
  if (task === "alloyRatioToFinalPercent") {
    return hi
      ? `दो मिश्रणों में मुख्य घटक ${v(p, "percentA")}% और ${v(p, "percentB")}% है। उन्हें ${v(p, "mixRatioA")}:${v(p, "mixRatioB")} में मिलाया जाता है। अंतिम प्रतिशत ज्ञात करें।`
      : `ਦੋ ਮਿਸ਼ਰਣਾਂ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ${v(p, "percentA")}% ਅਤੇ ${v(p, "percentB")}% ਹੈ। ਉਨ੍ਹਾਂ ਨੂੰ ${v(p, "mixRatioA")}:${v(p, "mixRatioB")} ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`;
  }
  return undefined;
}

export function renderLocalizedRap003IncomeMixtureStem(p: Rap003Parameters) {
  if (p.language === "en") return undefined;
  const language = p.language as Language;
  if (p.canonicalProblemId === "RAP-CP-015") return income(p, language);
  if (p.canonicalProblemId === "RAP-CP-016") return mixture(p, language);
  return undefined;
}
