import { ANA_CP006_RULES } from "./rule-definitions";

for (const rule of ANA_CP006_RULES) {
  const explainInDetail = rule.explain;
  rule.explain = (input, output, context) => {
    const transformation = `${input} becomes ${output}.`;
    const detail = explainInDetail(input, output, context).trim();
    return detail.startsWith(transformation)
      ? detail
      : `${transformation} ${detail}`;
  };
}
