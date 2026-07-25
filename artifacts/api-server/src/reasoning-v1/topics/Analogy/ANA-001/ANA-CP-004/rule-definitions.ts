export interface SetRuleContext {
  k?: number;
  ratio?: number;
}

export interface NumberSetRuleDefinition {
  id: string;
  label: string;
  priority: number;
  contexts: readonly SetRuleContext[];
  minInput: number;
  maxInput: number;
  apply(first: number, second: number, context: SetRuleContext): number | null;
  explain(first: number, second: number, result: number, context: SetRuleContext): string;
}

const fixed = (contexts: readonly SetRuleContext[] = [{}]) => contexts;
const kValues = (...values: number[]) => values.map((k) => ({ k }));
const ratioValues = (...values: number[]) => values.map((ratio) => ({ ratio }));

export const ANA_CP004_RULES: readonly NumberSetRuleDefinition[] = [
  { id: "SET_SUM", label: "the third number is the sum of the first two", priority: 1, contexts: fixed(), minInput: 2, maxInput: 40, apply: (a,b) => a+b, explain: (a,b,c) => `${a} + ${b} = ${c}` },
  { id: "SET_ABS_DIFFERENCE", label: "the third number is the absolute difference of the first two", priority: 2, contexts: fixed(), minInput: 3, maxInput: 60, apply: (a,b) => Math.abs(a-b) || null, explain: (a,b,c) => `|${a} - ${b}| = ${c}` },
  { id: "SET_PRODUCT", label: "the third number is the product of the first two", priority: 2, contexts: fixed(), minInput: 2, maxInput: 18, apply: (a,b) => a*b, explain: (a,b,c) => `${a} × ${b} = ${c}` },
  { id: "SET_PRODUCT_ADJUST", label: "multiply the first two numbers and add a constant", priority: 5, contexts: kValues(1,2,3,5,7), minInput: 2, maxInput: 15, apply: (a,b,c) => a*b+c.k!, explain: (a,b,r,c) => `(${a} × ${b}) + ${c.k} = ${r}` },
  { id: "SET_SQUARE_SUM", label: "the third number is the sum of the squares of the first two", priority: 5, contexts: fixed(), minInput: 2, maxInput: 14, apply: (a,b) => a*a+b*b, explain: (a,b,c) => `${a}² + ${b}² = ${c}` },
  { id: "SET_SQUARE_DIFFERENCE", label: "the third number is the positive difference of the squares", priority: 5, contexts: fixed(), minInput: 3, maxInput: 16, apply: (a,b) => Math.abs(a*a-b*b) || null, explain: (a,b,c) => `|${a}² - ${b}²| = ${c}` },
  { id: "SET_PRODUCT_PLUS_FIRST", label: "multiply the first two numbers and add the first", priority: 5, contexts: fixed(), minInput: 2, maxInput: 16, apply: (a,b) => a*b+a, explain: (a,b,c) => `(${a} × ${b}) + ${a} = ${c}` },
  { id: "SET_PRODUCT_PLUS_SECOND", label: "multiply the first two numbers and add the second", priority: 5, contexts: fixed(), minInput: 2, maxInput: 16, apply: (a,b) => a*b+b, explain: (a,b,c) => `(${a} × ${b}) + ${b} = ${c}` },
  { id: "SET_PRODUCT_MINUS_FIRST", label: "multiply the first two numbers and subtract the first", priority: 5, contexts: fixed(), minInput: 3, maxInput: 18, apply: (a,b) => a*b-a > 0 ? a*b-a : null, explain: (a,b,c) => `(${a} × ${b}) - ${a} = ${c}` },
  { id: "SET_PRODUCT_MINUS_SECOND", label: "multiply the first two numbers and subtract the second", priority: 5, contexts: fixed(), minInput: 3, maxInput: 18, apply: (a,b) => a*b-b > 0 ? a*b-b : null, explain: (a,b,c) => `(${a} × ${b}) - ${b} = ${c}` },
  { id: "SET_AVERAGE", label: "the third number is the average of the first two", priority: 3, contexts: fixed(), minInput: 2, maxInput: 60, apply: (a,b) => (a+b)%2===0 ? (a+b)/2 : null, explain: (a,b,c) => `(${a} + ${b}) ÷ 2 = ${c}` },
  { id: "SET_RATIO_PRESERVING", label: "the third number is the first multiplied by a fixed ratio", priority: 4, contexts: ratioValues(2,3,4,5), minInput: 2, maxInput: 25, apply: (a,_b,c) => a*c.ratio!, explain: (a,_b,r,c) => `${a} × ${c.ratio} = ${r}` },
  { id: "SET_FACTOR_MULTIPLE", label: "the third number is the second multiplied by a fixed factor", priority: 4, contexts: kValues(2,3,4,5), minInput: 2, maxInput: 25, apply: (_a,b,c) => b*c.k!, explain: (_a,b,r,c) => `${b} × ${c.k} = ${r}` },
  { id: "SET_CONSECUTIVE_CONSTRUCTION", label: "the third number continues the consecutive pattern", priority: 2, contexts: fixed(), minInput: 2, maxInput: 50, apply: (a,b) => b===a+1 ? b+1 : null, explain: (a,b,c) => `${a}, ${b}, ${c} are consecutive numbers` },
  { id: "SET_MATCHING_TRIPLES", label: "the third number equals twice the sum of the first two", priority: 5, contexts: fixed(), minInput: 2, maxInput: 24, apply: (a,b) => 2*(a+b), explain: (a,b,c) => `2 × (${a} + ${b}) = ${c}` },
  { id: "SET_CORRESPONDING_MISSING_MEMBER", label: "the third number is the first plus twice the second", priority: 5, contexts: fixed(), minInput: 2, maxInput: 24, apply: (a,b) => a+2*b, explain: (a,b,c) => `${a} + (2 × ${b}) = ${c}` },
];

export function setRuleById(id: string): NumberSetRuleDefinition {
  const rule = ANA_CP004_RULES.find((entry) => entry.id === id);
  if (!rule) throw new Error(`Unknown ANA-CP-004 rule: ${id}`);
  return rule;
}
