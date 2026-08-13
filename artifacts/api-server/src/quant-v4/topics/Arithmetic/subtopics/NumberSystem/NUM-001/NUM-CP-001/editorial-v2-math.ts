const inline = (value: string) => `\\(${value}\\)`;

function fractionBody(value: string): string {
  return value.replace(/(-?\d+)\/(\d+)\b/gu, (_match, numerator, denominator) => denominator === "1" ? String(numerator) : `\\frac{${numerator}}{${denominator}}`);
}

export function latexifyLearnerText(value: string): string {
  const spans: string[] = [];
  let output = value.replace(/\\\((.*?)\\\)/gu, (_match, body) => {
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
