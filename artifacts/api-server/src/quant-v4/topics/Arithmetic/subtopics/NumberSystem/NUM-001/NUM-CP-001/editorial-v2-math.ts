const inline = (value: string) => `\\(${value}\\)`;

function fractionBody(value: string): string {
  return value.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? String(numerator) : `\\frac{${numerator}}{${denominator}}`);
}

function mathBody(value: string): string {
  return fractionBody(value)
    .replace(/×/gu, "\\times")
    .replace(/÷/gu, "\\div")
    .replace(/−/gu, "-")
    .replace(/\s+/gu, " ")
    .trim();
}

function unwrapInline(value: string): string {
  const match = value.trim().match(/^\\\((.*)\\\)$/u);
  return match ? String(match[1]) : value.trim();
}

function wrapRawFormulae(value: string): string {
  let output = value;

  // Join labelled exact values into one mathematical unit: A = 1/2, B = -1, etc.
  output = output.replace(/\b([A-D])\s*=\s*\\\((.*?)\\\)/gu, (_match, label, body) => inline(`${label}=${mathBody(String(body))}`));
  output = output.replace(/\b([A-D]|x|n|b|p|q|r|m)\s*=\s*(-?\d+(?:\.\d+)?)\b/gu, (_match, label, number) => inline(`${label}=${number}`));

  // Chained inequalities and interval notation.
  output = output.replace(/(-?\d+\/\d+)\s*<\s*([A-Za-z])\s*<\s*(-?\d+\/\d+)/gu, (_match, left, variable, right) => inline(`${fractionBody(left)}<${variable}<${fractionBody(right)}`));
  output = output.replace(/(-?\d+(?:\.\d+)?)\s*<\s*([A-Za-z])\s*<\s*(-?\d+(?:\.\d+)?)/gu, (_match, left, variable, right) => inline(`${left}<${variable}<${right}`));
  output = output.replace(/([[(]\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*,\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*[\])])/gu, (_match, interval) => inline(String(interval).replace(/\s+/gu, "")));

  // Ordering strings and explicit arithmetic working.
  output = output.replace(/\b([A-D](?:\s*<\s*[A-D]){2,})\b/gu, (_match, order) => inline(String(order).replace(/\s+/gu, "")));
  output = output.replace(/(-?\d+(?:\.\d+)?\s*(?:[+\-−×÷]\s*\(?-?\d+(?:\.\d+)?\)?)+\s*=\s*-?\d+(?:\.\d+)?)/gu, (_match, working) => inline(mathBody(String(working))));

  // Lists of integer values shown as mathematical answer sets.
  output = output.replace(/(?<![\w\\])(-?\d+(?:\s*,\s*-?\d+){2,})(?![\w])/gu, (_match, list) => inline(String(list).replace(/\s+/gu, "")));

  // Explanation labels should introduce a typeset calculation, not leave raw operators in prose.
  const workingLabels = /(Count|Middle integer|Left point|Right point|Average|औसत|मध्य पूर्णांक|बायाँ बिंदु|दायाँ बिंदु|ਔਸਤ|ਵਿਚਕਾਰਲਾ ਪੂਰਨ ਅੰਕ|ਖੱਬਾ ਬਿੰਦੂ|ਸੱਜਾ ਬਿੰਦੂ)\s*=\s*([^.;।\n]+)(?=[.;।])/gu;
  output = output.replace(workingLabels, (_match, label, working) => `${label}: ${inline(mathBody(unwrapInline(String(working))))}`);

  return output;
}

export function latexifyLearnerText(value: string): string {
  const spans: string[] = [];
  let output = wrapRawFormulae(value).replace(/\\\((.*?)\\\)/gu, (_match, body) => {
    const index = spans.push(inline(mathBody(String(body)))) - 1;
    return `MATHSPAN${index}ENDSPAN`;
  });

  output = output.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? inline(String(numerator)) : inline(`\\frac{${numerator}}{${denominator}}`));
  output = output.replace(/\b(AB)\b/gu, (_match, symbol) => inline(String(symbol)));
  output = output.replace(/\b([xbnpqrm])\b/gu, (_match, variable) => inline(String(variable)));

  return output.replace(/MATHSPAN(\d+)ENDSPAN/gu, (_match, index) => spans[Number(index)] ?? "");
}

export function latexifyEditorialSurface(surface: any) {
  return {
    ...surface,
    stem: latexifyLearnerText(String(surface.stem)),
    options: Object.freeze((surface.options ?? []).map((value: string) => latexifyLearnerText(String(value)))),
    answer: latexifyLearnerText(String(surface.answer)),
    concept: latexifyLearnerText(String(surface.concept ?? "")),
    steps: Object.freeze((surface.steps ?? []).map((value: string) => latexifyLearnerText(String(value)))),
  };
}
