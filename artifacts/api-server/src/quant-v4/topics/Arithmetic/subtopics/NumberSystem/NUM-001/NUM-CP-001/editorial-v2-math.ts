const inline = (value: string) => `\\(${value}\\)`;

function fractionBody(value: string): string {
  return value.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? String(numerator) : `\\frac{${numerator}}{${denominator}}`);
}

function wrapRawFormulae(value: string): string {
  let output = value;
  output = output.replace(/(-?\d+\/\d+)\s*<\s*([A-Za-z])\s*<\s*(-?\d+\/\d+)/gu, (_match, left, variable, right) => inline(`${fractionBody(left)}<${variable}<${fractionBody(right)}`));
  output = output.replace(/(-?\d+(?:\.\d+)?)\s*<\s*([A-Za-z])\s*<\s*(-?\d+(?:\.\d+)?)/gu, (_match, left, variable, right) => inline(`${left}<${variable}<${right}`));
  output = output.replace(/\b([A-D](?:\s*<\s*[A-D]){2,})\b/gu, (_match, order) => inline(String(order).replace(/\s+/gu, "")));
  output = output.replace(/([[(]-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?[\])])/gu, (_match, interval) => inline(String(interval).replace(/\s+/gu, "")));
  output = output.replace(/\b(Count|Middle integer|Left point|Right point)\s*=\s*([^.;\n]+)(?=\.)/gu, (_match, label, working) => `${label} = ${inline(String(working).replace(/÷/gu, "\\div").replace(/×/gu, "\\times"))}`);
  return output;
}

export function latexifyLearnerText(value: string): string {
  const spans: string[] = [];
  let output = wrapRawFormulae(value).replace(/\\\((.*?)\\\)/gu, (_match, body) => {
    const index = spans.push(inline(fractionBody(String(body)))) - 1;
    return `MATHSPAN${index}ENDSPAN`;
  });
  output = output.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? inline(String(numerator)) : inline(`\\frac{${numerator}}{${denominator}}`));
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
