/** Select display captions from the script already used by the diagram title. */
export function diagramLabels(title: string) {
  if (/[\u0a00-\u0a7f]/u.test(title))
    return {
      before: "ਪਹਿਲਾਂ",
      after: "ਬਾਅਦ",
      ratio: "ਅਨੁਪਾਤ",
      operation: "ਤਬਦੀਲੀ",
      targetRatio: "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ",
      quantityRatio: "ਮਾਤਰਾਵਾਂ ਦਾ ਅਨੁਪਾਤ",
      totalParts: "ਕੁੱਲ ਹਿੱਸੇ",
      priceGap: "ਮੁੱਲਾਂ ਦਾ ਫ਼ਰਕ",
      valuePerPart: "ਹਰ ਹਿੱਸੇ ਦਾ ਮੁੱਲ",
      opposite: "ਉਲਟ ਫ਼ਰਕਾਂ ਤੋਂ",
      and: "ਅਤੇ",
      deviationDescription:
        "ਟੀਚੇ ਤੋਂ ਘੱਟ ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤੂਆਂ ਦੀ ਕਮੀ ਅਤੇ ਵੱਧ ਮੁੱਲ ਵਾਲੀਆਂ ਵਸਤੂਆਂ ਦਾ ਵਾਧਾ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।",
      below: "ਟੀਚੇ ਤੋਂ ਘੱਟ — ਕਮੀ",
      above: "ਟੀਚੇ ਤੋਂ ਵੱਧ — ਵਾਧਾ",
      deficit: "ਕਮੀ",
      surplus: "ਵਾਧਾ",
    };
  if (/[\u0900-\u097f]/u.test(title))
    return {
      before: "पहले",
      after: "बाद में",
      ratio: "अनुपात",
      operation: "बदलाव",
      targetRatio: "लक्षित अनुपात",
      quantityRatio: "मात्राओं का अनुपात",
      totalParts: "कुल भाग",
      priceGap: "मूल्यों का अंतर",
      valuePerPart: "प्रत्येक भाग का मूल्य",
      opposite: "विपरीत अंतरों से",
      and: "और",
      deviationDescription:
        "लक्ष्य से कम मूल्य वाली वस्तुओं की कमी और अधिक मूल्य वाली वस्तुओं की वृद्धि बराबर होती है।",
      below: "लक्ष्य से कम — कमी",
      above: "लक्ष्य से अधिक — वृद्धि",
      deficit: "कमी",
      surplus: "वृद्धि",
    };
  return {
    before: "Before",
    after: "After",
    ratio: "Ratio",
    operation: "OPERATION",
    targetRatio: "Target ratio",
    quantityRatio: "Quantity ratio",
    totalParts: "Total parts",
    priceGap: "Price gap",
    valuePerPart: "Value per part",
    opposite: "The opposite differences give",
    and: "and",
    deviationDescription:
      "Items below the target create deficits and items above the target create surpluses; their totals balance at the mean.",
    below: "Below target — deficit",
    above: "Above target — surplus",
    deficit: "deficit",
    surplus: "surplus",
  };
}
export function diagramQuantity(quantity: string, unit: string): string {
  return /(?:kg|litres?|parts?|किलोग्राम|किग्रा|लीटर|भाग|ਕਿਲੋਗ੍ਰਾਮ|ਕਿਗ੍ਰਾ|ਲੀਟਰ|ਹਿੱਸ[ਾੇ])\s*$/iu.test(
    quantity,
  )
    ? quantity
    : `${quantity} ${unit}`;
}
