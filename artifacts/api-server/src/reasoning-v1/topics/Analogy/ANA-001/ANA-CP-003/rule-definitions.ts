export interface NumericRuleContext {
  k?: number;
  m?: number;
}

export interface NumericRuleDefinition {
  id: string;
  label: string;
  family: "WHOLE_NUMBER" | "DIGIT_BASED";
  priority: number;
  minInput: number;
  maxInput: number;
  parameters: readonly NumericRuleContext[];
  apply(input: number, context: NumericRuleContext): number | null;
  explain(input: number, output: number, context: NumericRuleContext): string;
}

function digits(input: number): [number, number] {
  return [Math.floor(input / 10), input % 10];
}

const fixed = (contexts: readonly NumericRuleContext[] = [{}]) => contexts;
const kValues = (...values: number[]) => values.map((k) => ({ k }));
const mkValues = (multipliers: readonly number[], constants: readonly number[]) =>
  multipliers.flatMap((m) => constants.map((k) => ({ m, k })));

export const ANA_CP003_RULES: readonly NumericRuleDefinition[] = [
  { id: "NUM_ADD_K", label: "add a constant", family: "WHOLE_NUMBER", priority: 1, minInput: 3, maxInput: 80, parameters: kValues(3,4,5,6,7,8,9,11,12), apply: (n,c) => n + c.k!, explain: (n,o,c) => `${n} + ${c.k} = ${o}` },
  { id: "NUM_SUBTRACT_K", label: "subtract a constant", family: "WHOLE_NUMBER", priority: 1, minInput: 15, maxInput: 99, parameters: kValues(3,4,5,6,7,8,9,11,12), apply: (n,c) => n - c.k! > 0 ? n - c.k! : null, explain: (n,o,c) => `${n} - ${c.k} = ${o}` },
  { id: "NUM_MULTIPLY_K", label: "multiply by a constant", family: "WHOLE_NUMBER", priority: 2, minInput: 3, maxInput: 30, parameters: kValues(2,3,4,5,6), apply: (n,c) => n * c.k!, explain: (n,o,c) => `${n} × ${c.k} = ${o}` },
  { id: "NUM_DIVIDE_K", label: "divide by a constant", family: "WHOLE_NUMBER", priority: 2, minInput: 12, maxInput: 120, parameters: kValues(2,3,4,5,6), apply: (n,c) => n % c.k! === 0 ? n / c.k! : null, explain: (n,o,c) => `${n} ÷ ${c.k} = ${o}` },
  { id: "NUM_MULTIPLY_ADD", label: "multiply then add", family: "WHOLE_NUMBER", priority: 4, minInput: 3, maxInput: 25, parameters: mkValues([2,3,4],[1,3,5,7]), apply: (n,c) => n * c.m! + c.k!, explain: (n,o,c) => `(${n} × ${c.m}) + ${c.k} = ${o}` },
  { id: "NUM_MULTIPLY_SUBTRACT", label: "multiply then subtract", family: "WHOLE_NUMBER", priority: 4, minInput: 5, maxInput: 30, parameters: mkValues([2,3,4],[1,3,5,7]), apply: (n,c) => n * c.m! - c.k! > 0 ? n * c.m! - c.k! : null, explain: (n,o,c) => `(${n} × ${c.m}) - ${c.k} = ${o}` },
  { id: "NUM_DIVIDE_ADD", label: "divide then add", family: "WHOLE_NUMBER", priority: 4, minInput: 12, maxInput: 120, parameters: mkValues([2,3,4,5],[2,3,5]), apply: (n,c) => n % c.m! === 0 ? n / c.m! + c.k! : null, explain: (n,o,c) => `(${n} ÷ ${c.m}) + ${c.k} = ${o}` },
  { id: "NUM_DIVIDE_SUBTRACT", label: "divide then subtract", family: "WHOLE_NUMBER", priority: 4, minInput: 20, maxInput: 150, parameters: mkValues([2,3,4,5],[2,3,5]), apply: (n,c) => n % c.m! === 0 && n / c.m! - c.k! > 0 ? n / c.m! - c.k! : null, explain: (n,o,c) => `(${n} ÷ ${c.m}) - ${c.k} = ${o}` },
  { id: "NUM_SQUARE", label: "square", family: "WHOLE_NUMBER", priority: 3, minInput: 3, maxInput: 18, parameters: fixed(), apply: (n) => n*n, explain: (n,o) => `${n}² = ${o}` },
  { id: "NUM_SQUARE_ADD", label: "square then add", family: "WHOLE_NUMBER", priority: 5, minInput: 3, maxInput: 16, parameters: kValues(1,2,3,5,7), apply: (n,c) => n*n+c.k!, explain: (n,o,c) => `${n}² + ${c.k} = ${o}` },
  { id: "NUM_SQUARE_SUBTRACT", label: "square then subtract", family: "WHOLE_NUMBER", priority: 5, minInput: 4, maxInput: 17, parameters: kValues(1,2,3,5,7), apply: (n,c) => n*n-c.k! > 0 ? n*n-c.k! : null, explain: (n,o,c) => `${n}² - ${c.k} = ${o}` },
  { id: "NUM_CUBE", label: "cube", family: "WHOLE_NUMBER", priority: 5, minInput: 2, maxInput: 9, parameters: fixed(), apply: (n) => n*n*n, explain: (n,o) => `${n}³ = ${o}` },
  { id: "NUM_CUBE_ADD", label: "cube then add", family: "WHOLE_NUMBER", priority: 6, minInput: 2, maxInput: 8, parameters: kValues(1,2,3,5), apply: (n,c) => n*n*n+c.k!, explain: (n,o,c) => `${n}³ + ${c.k} = ${o}` },
  { id: "NUM_DOUBLE_SQUARE", label: "double then square", family: "WHOLE_NUMBER", priority: 6, minInput: 2, maxInput: 10, parameters: fixed(), apply: (n) => (2*n)*(2*n), explain: (n,o) => `(2 × ${n})² = ${o}` },
  { id: "NUM_HALF_SQUARE", label: "halve then square", family: "WHOLE_NUMBER", priority: 6, minInput: 4, maxInput: 30, parameters: fixed(), apply: (n) => n%2===0 ? (n/2)*(n/2) : null, explain: (n,o) => `(${n} ÷ 2)² = ${o}` },
  { id: "NUM_TIMES_SUCCESSOR", label: "multiply by the successor", family: "WHOLE_NUMBER", priority: 5, minInput: 3, maxInput: 20, parameters: fixed(), apply: (n) => n*(n+1), explain: (n,o) => `${n} × (${n} + 1) = ${o}` },
  { id: "NUM_TIMES_PREDECESSOR", label: "multiply by the predecessor", family: "WHOLE_NUMBER", priority: 5, minInput: 4, maxInput: 21, parameters: fixed(), apply: (n) => n*(n-1), explain: (n,o) => `${n} × (${n} - 1) = ${o}` },
  { id: "DIGIT_SUM", label: "sum the digits", family: "DIGIT_BASED", priority: 2, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return a+b; }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → ${a} + ${b} = ${o}`; } },
  { id: "DIGIT_PRODUCT", label: "multiply the digits", family: "DIGIT_BASED", priority: 3, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return a*b; }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → ${a} × ${b} = ${o}`; } },
  { id: "DIGIT_ABS_DIFF", label: "take the absolute digit difference", family: "DIGIT_BASED", priority: 3, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return Math.abs(a-b); }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → |${a} - ${b}| = ${o}`; } },
  { id: "DIGIT_SUM_SQUARES", label: "add the squares of the digits", family: "DIGIT_BASED", priority: 5, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return a*a+b*b; }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → ${a}² + ${b}² = ${o}`; } },
  { id: "DIGIT_PRODUCT_PLUS_SUM", label: "add digit product and digit sum", family: "DIGIT_BASED", priority: 6, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return a*b+a+b; }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → (${a} × ${b}) + ${a} + ${b} = ${o}`; } },
  { id: "DIGIT_REVERSE", label: "reverse the digits", family: "DIGIT_BASED", priority: 4, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return 10*b+a; }, explain: (n,o) => `Reversing the digits of ${n} gives ${o}` },
  { id: "DIGIT_POSITIONAL", label: "multiply the digits and add the tens digit", family: "DIGIT_BASED", priority: 7, minInput: 23, maxInput: 98, parameters: fixed(), apply: (n) => { const [a,b]=digits(n); return a*b+a; }, explain: (n,o) => { const [a,b]=digits(n); return `${n} → (${a} × ${b}) + ${a} = ${o}`; } },
];

export function numericRuleById(id: string): NumericRuleDefinition {
  const rule = ANA_CP003_RULES.find((entry) => entry.id === id);
  if (!rule) throw new Error(`Unknown ANA-CP-003 rule: ${id}`);
  return rule;
}
