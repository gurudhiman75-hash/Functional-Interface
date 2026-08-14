const inline = (value: string) => `\\(${value}\\)`;

function fractionBody(value: string): string {
  return value.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? String(numerator) : `\\frac{${numerator}}{${denominator}}`);
}

function mathBody(value: string): string {
  return fractionBody(value)
    .replace(/×/gu, "\\times")
    .replace(/÷/gu, "\\div")
    .replace(/−/gu, "-")
    .replace(/([A-Za-z0-9)])\^(\d+)/gu, "$1^{$2}")
    .replace(/([A-Za-z0-9)])²/gu, "$1^{2}")
    .replace(/([A-Za-z0-9)])³/gu, "$1^{3}")
    .replace(/\s+/gu, " ")
    .trim();
}

const WORKING_LABELS = "Count|Middle integer|Left point|Right point|Average|औसत|मध्य पूर्णांक|बायाँ बिंदु|दायाँ बिंदु|ਔਸਤ|ਵਿਚਕਾਰਲਾ ਪੂਰਨ ਅੰਕ|ਖੱਬਾ ਬਿੰਦੂ|ਸੱਜਾ ਬਿੰਦੂ";

function prejoinExistingMath(value: string): string {
  let output = value;
  output = output.replace(/\b([A-D])\s*=\s*\\\((.*?)\\\)/gu, (_match, label, body) => inline(`${label}=${mathBody(String(body))}`));
  const workingWithInline = new RegExp(`(${WORKING_LABELS})\\s*=\\s*\\\\\\((.*?)\\\\\\)(?=[.;।])`, "gu");
  output = output.replace(workingWithInline, (_match, label, body) => `${label}: ${inline(mathBody(String(body)))}`);
  return output;
}

function wrapRawFormulae(value: string): string {
  let output = value;

  output = output.replace(/\b([A-D]|x|n|b|p|q|r|m)\s*=\s*(-?\d+(?:\.\d+)?)\b/gu, (_match, label, number) => inline(`${label}=${number}`));

  // Capture a labelled calculation before any inner arithmetic can be wrapped separately.
  const workingLabels = new RegExp(`(${WORKING_LABELS})\\s*=\\s*([^.;।\\n]+)(?=[.;।])`, "gu");
  output = output.replace(workingLabels, (_match, label, working) => `${label}: ${inline(mathBody(String(working)))}`);

  output = output.replace(/(-?\d+\/\d+)\s*<\s*([A-Za-z])\s*<\s*(-?\d+\/\d+)/gu, (_match, left, variable, right) => inline(`${fractionBody(left)}<${variable}<${fractionBody(right)}`));
  output = output.replace(/(-?\d+(?:\.\d+)?)\s*<\s*([A-Za-z])\s*<\s*(-?\d+(?:\.\d+)?)/gu, (_match, left, variable, right) => inline(`${left}<${variable}<${right}`));
  output = output.replace(/([[(]\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*,\s*(?:-?\d+(?:\.\d+)?|[a-z])\s*[\])])/gu, (_match, interval) => inline(String(interval).replace(/\s+/gu, "")));

  output = output.replace(/\b([A-D](?:\s*<\s*[A-D]){2,})\b/gu, (_match, order) => inline(String(order).replace(/\s+/gu, "")));
  output = output.replace(/(-?\d+(?:\.\d+)?\s*(?:[+\-−×÷]\s*\(?-?\d+(?:\.\d+)?\)?)+\s*=\s*-?\d+(?:\.\d+)?)/gu, (_match, working) => inline(mathBody(String(working))));

  output = output.replace(/\b((?:\d+)?[xbnpqrm](?:\^\{?\d+\}?|[²³])?(?:\s*[+\-−×]\s*(?:\d+)?[xbnpqrm](?:\^\{?\d+\}?|[²³])?)+)\b/gu, (_match, expression) => inline(mathBody(String(expression))));
  output = output.replace(/\b([xbnpqrm](?:\^\{?\d+\}?|[²³]))\b/gu, (_match, expression) => inline(mathBody(String(expression))));

  output = output.replace(/(?<![\w\\])(-?\d+(?:\s*,\s*-?\d+){2,})(?![\w])/gu, (_match, list) => inline(String(list).replace(/\s+/gu, "")));

  return output;
}

export function latexifyLearnerText(value: string): string {
  const spans: string[] = [];
  const protect = (text: string) => text.replace(/\\\((.*?)\\\)/gu, (_match, body) => {
    const index = spans.push(inline(mathBody(String(body)))) - 1;
    return `MATHSPAN${index}ENDSPAN`;
  });

  let output = protect(prejoinExistingMath(value));
  output = wrapRawFormulae(output);
  output = protect(output);

  output = output.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? inline(String(numerator)) : inline(`\\frac{${numerator}}{${denominator}}`));
  output = output.replace(/\b(AB)\b/gu, (_match, symbol) => inline(String(symbol)));
  output = output.replace(/\b(\d+[xbnpqrm])\b/gu, (_match, expression) => inline(mathBody(String(expression))));
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
