const inline = (body: string): string => `\\(${body}\\)`;

function mathBody(value: string): string {
  return value
    .replace(/×/gu, "\\times")
    .replace(/÷/gu, "\\div")
    .replace(/−/gu, "-")
    .replace(/\s+/gu, " ")
    .trim();
}

function convertDollarMath(value: string): string {
  // The legacy CP003 teacher uses both $...$ and $$...$$. Convert display
  // delimiters first so the single-dollar pass cannot leave orphan dollars.
  return value
    .replace(/\$\$([\s\S]*?)\$\$/gu, (_match, body) => inline(mathBody(String(body))))
    .replace(/\$([^$\n]+)\$/gu, (_match, body) => inline(mathBody(String(body))));
}

function protectExistingMath(value: string, spans: string[]): string {
  return value.replace(/\\\((.*?)\\\)/gu, (_match, body) => {
    const index = spans.push(inline(mathBody(String(body)))) - 1;
    return `NUMCP003MATH${index}SPAN`;
  });
}

function wrapEquations(value: string): string {
  let output = value;

  output = output.replace(
    /\b([0-9XYAB]{2,})\s*([+\-])\s*([0-9XYAB]{1,})\s*=\s*([0-9XYAB]{2,})\b/gu,
    (_match, left, operator, middle, right) => inline(`${left} ${operator} ${middle} = ${right}`),
  );

  output = output.replace(
    /\b([XYAB])\s*\+\s*([XYAB])\s*=\s*(-?\d+)\b/gu,
    (_match, left, right, total) => inline(`${left} + ${right} = ${total}`),
  );

  output = output.replace(
    /\b([XYAB])\s*=\s*(-?\d+)\b/gu,
    (_match, variable, number) => inline(`${variable} = ${number}`),
  );

  output = output.replace(
    /\b(-?\d+)\s*([+\-×÷])\s*(-?\d+)\s*=\s*(-?\d+)\b/gu,
    (_match, left, operator, right, result) => inline(mathBody(`${left} ${operator} ${right} = ${result}`)),
  );

  return output;
}

function wrapStructuredMath(value: string): string {
  let output = value;

  // Wrap a complete ordered-pair set before wrapping individual pairs.
  output = output.replace(
    /\{\s*((?:\(\s*-?\d+\s*,\s*-?\d+\s*\)\s*,\s*)+\(\s*-?\d+\s*,\s*-?\d+\s*\))\s*\}/gu,
    (_match, body) => inline(`\\{${String(body).replace(/\s+/gu, " ")}\\}`),
  );

  output = output.replace(
    /\{\s*((?:-?\d+\s*,\s*)+-?\d+)\s*\}/gu,
    (_match, body) => inline(`\\{${String(body).replace(/\s+/gu, " ")}\\}`),
  );

  output = output.replace(
    /\(\s*([XYAB]|-?\d+)\s*,\s*([XYAB]|-?\d+)\s*\)/gu,
    (_match, first, second) => inline(`(${first}, ${second})`),
  );

  output = output.replace(
    /\b(?=[0-9XYAB]{2,}\b)(?=[0-9XYAB]*\d)(?=[0-9XYAB]*[XYAB])[0-9XYAB]{2,}\b/gu,
    (token) => inline(token),
  );

  return output;
}

function wrapRemainingVariables(value: string): string {
  let output = value;
  output = output.replace(/\b([XY])\b/gu, (_match, variable) => inline(String(variable)));
  output = output.replace(/\bA\s+and\s+B\b/gu, `${inline("A")} and ${inline("B")}`);
  output = output.replace(/\bvalue of ([AB])\b/gu, (_match, variable) => `value of ${inline(String(variable))}`);
  output = output.replace(/\bpossible value of ([AB])\b/gu, (_match, variable) => `possible value of ${inline(String(variable))}`);
  return output;
}

function flattenNestedInlineMath(value: string): string {
  let output = "";
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value.startsWith("\\(", index)) {
      if (depth === 0) output += "\\(";
      depth += 1;
      index += 1;
      continue;
    }
    if (value.startsWith("\\)", index)) {
      if (depth > 0) {
        depth -= 1;
        if (depth === 0) output += "\\)";
      } else {
        output += "\\)";
      }
      index += 1;
      continue;
    }
    output += value[index];
  }
  return output;
}

export function latexifyNumCp003LearnerText(value: string): string {
  const spans: string[] = [];
  let output = protectExistingMath(convertDollarMath(String(value)), spans);

  output = wrapEquations(output);
  output = protectExistingMath(output, spans);

  output = wrapStructuredMath(output);
  output = protectExistingMath(output, spans);

  output = wrapRemainingVariables(output);
  output = protectExistingMath(output, spans);

  output = output.replace(/NUMCP003MATH(\d+)SPAN/gu, (_match, index) => spans[Number(index)] ?? "");
  return flattenNestedInlineMath(output);
}
