import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import type { ArgCp003Template } from "./cp003-saturation-types.ts";
import { ARG_QL_IDS, type ArgQlId } from "./types.ts";

export const ARG_CP009_CHECKPOINT_ID = "ARG-CP-009" as const;
export const ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY = "ARG_CP009_ENGLISH_EDITORIAL_REMEDIATION_V1" as const;

function replaceArguments(
  template: ArgCp003Template,
  firstText?: string,
  secondText?: string,
): ArgCp003Template["arguments"] {
  return Object.freeze([
    Object.freeze({ ...template.arguments[0], ...(firstText === undefined ? {} : { text: firstText }) }),
    Object.freeze({ ...template.arguments[1], ...(secondText === undefined ? {} : { text: secondText }) }),
  ]) as ArgCp003Template["arguments"];
}

function replaceDimension(
  template: ArgCp003Template,
  index: 0 | 1 | 2 | 3,
  values: readonly [string, string, string, string],
): ArgCp003Template["dimensions"] {
  const dimensions = [
    template.dimensions[0],
    template.dimensions[1],
    template.dimensions[2],
    template.dimensions[3],
  ] as [readonly string[], readonly string[], readonly string[], readonly string[]];
  dimensions[index] = Object.freeze([...values]);
  return Object.freeze(dimensions) as ArgCp003Template["dimensions"];
}

function patchEnglishTemplate(template: ArgCp003Template): ArgCp003Template {
  switch (template.id) {
    case "ARG-CP003-QL001-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "Yes. Riders of {a} on {b} can suffer {c}, so using {d} can address a material safety risk.",
        ),
      });

    case "ARG-CP003-QL001-T03":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "No. If customers can {c} too easily by mistake in {d}, they may block urgent {a}, so clear recovery and confirmation controls are necessary.",
        ),
      });

    case "ARG-CP003-QL001-T07":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "No. If one fixed benchmark is shown despite {d}, the portal may create expectations that cannot be met; categories need realistic differentiation.",
        ),
      });

    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "Yes. Printing {b} on {a} guarantees that all {c} raised during {d} will be resolved immediately.",
        ),
      });

    case "ARG-CP003-QL002-T05": {
      const dimensions = replaceDimension(template, 3, [
        "further fraudulent activity",
        "additional account misuse",
        "loss of control over account details",
        "further unauthorised profile activity",
      ]);
      return Object.freeze({
        ...template,
        dimensions,
        arguments: replaceArguments(
          template,
          "Yes. After {c}, an alert through {b} can help the customer detect an unauthorised change to the {a} before it contributes to {d}.",
          "No. {c} has occurred even when alerts were sent through {b}, so alerts about the {a} can never help reduce {d}.",
        ),
      });
    }

    case "ARG-CP003-QL002-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "teaching time",
          "time for rest and recovery",
          "breadth of learning",
          "time for discussion-based learning",
        ]),
      });

    case "ARG-CP003-QL003-T02":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "Yes. Using {d} supposedly requires no staff, connectivity or user support, so {a} at {b} becomes unnecessary even with {c}.",
        ),
      });

    case "ARG-CP003-QL003-T03":
      return Object.freeze({
        ...template,
        statement: "Should the city introduce {c} on {a} during {b}?",
      });

    case "ARG-CP003-QL003-T04":
      return Object.freeze({
        ...template,
        statement: "Should all {a} move entirely to {b} {c}?",
      });

    case "ARG-CP003-QL004-T01":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "No. {c} who attend {b} {d} will all become permanently dependent on extra help in {a}.",
        ),
      });

    case "ARG-CP003-QL004-T03":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "a ninety-minute window",
          "a one-hour window",
          "a defined flexibility band",
          "a limited daily range",
        ]),
      });

    case "ARG-CP003-QL004-T04": {
      const dimensions = replaceDimension(template, 0, [
        "basic digital literacy",
        "cyber safety",
        "financial literacy",
        "career planning",
      ]);
      return Object.freeze({
        ...template,
        dimensions,
        statement: "Should {b} offer {d} on {a}?",
        arguments: replaceArguments(
          template,
          "Yes. Anyone attending {d} on {a} will never face {c} again.",
          "No. If {b} offer {d} on {a}, existing services will eventually become completely unnecessary because {c} will vanish.",
        ),
      });
    }

    case "ARG-CP003-QL004-T06":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "a 24-hour reminder",
          "a three-day reminder",
          "a clear pre-renewal alert",
          "an advance billing notice",
        ]),
      });

    case "ARG-CP003-QL004-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          undefined,
          "No. Because {a} can be useful for {c}, the institution should never regulate it even to address {d}.",
        ),
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 2, [
          "users with accessibility needs",
          "users relying on assistive access",
          "users who face barriers in standard interfaces",
          "users needing accessible digital interaction",
        ]),
      });

    case "ARG-CP003-QL005-T08": {
      const dimensions = replaceDimension(template, 1, [
        "employees",
        "trainees",
        "contract staff",
        "volunteers",
      ]);
      return Object.freeze({
        ...template,
        dimensions,
        arguments: replaceArguments(
          template,
          undefined,
          "No. Anyone among {b} who wants {a} kept out of {c} must be hiding something and therefore cannot contribute to {d}.",
        ),
      });
    }

    case "ARG-CP003-QL006-T02":
      return Object.freeze({
        ...template,
        statement: "Should a bank use {b} for every {a}?",
      });

    case "ARG-CP003-QL006-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "investigating the affected centre",
          "verifying evidence and scope",
          "isolating affected sessions",
          "using a proportionate remedial process",
        ]),
      });

    case "ARG-CP003-QL006-T05":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "Yes. With {d}, restricting {a} on {b} during {c} can reduce demand for scarce road space on that corridor.",
          "No. Restricting {a} on {b} during {c} will inevitably create permanent gridlock across the entire city even with {d}.",
        ),
      });

    case "ARG-CP003-QL006-T07":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 1, [
          "a small per-item fee",
          "a visible environmental charge",
          "a single-use surcharge",
          "a consumption-based fee",
        ]),
      });

    default:
      return template;
  }
}

export const ARG_CP009_ENGLISH_TEMPLATES_BY_QL: Readonly<Record<ArgQlId, readonly ArgCp003Template[]>> = Object.freeze(
  ARG_QL_IDS.reduce<Record<ArgQlId, readonly ArgCp003Template[]>>((result, qlId) => {
    result[qlId] = Object.freeze(ARG_CP003_TEMPLATES_BY_QL[qlId].map(patchEnglishTemplate));
    return result;
  }, {} as Record<ArgQlId, readonly ArgCp003Template[]>),
);

export const ARG_CP009_ENGLISH_REMEDIATED_TEMPLATE_IDS = Object.freeze(
  ARG_QL_IDS.flatMap((qlId) => ARG_CP009_ENGLISH_TEMPLATES_BY_QL[qlId].map((template) => template.id)),
);
