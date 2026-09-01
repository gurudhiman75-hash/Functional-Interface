import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import type { ArgCp003Template } from "./cp003-saturation-types.ts";
import type { ArgCp009Template } from "./cp009-remediation-types.ts";
import type { ArgQlId } from "./types.ts";

const AUTHORITY = "ARG_CP009_EDITORIAL_REMEDIATION_V1" as const;

function patchArgument(
  template: ArgCp003Template,
  index: 0 | 1,
  patch: Partial<ArgCp003Template["arguments"][number]>,
): ArgCp003Template["arguments"][number] {
  return Object.freeze({ ...template.arguments[index], ...patch });
}

function remediate(template: ArgCp003Template): ArgCp009Template {
  switch (template.id) {
    case "ARG-CP003-QL001-T01":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Riders of {a} on {b} can suffer {c}, so {d} can address a material safety risk.",
          }),
          template.arguments[1],
        ] as const,
      });

    case "ARG-CP003-QL001-T03":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        statement: "Should customers be able to use {d} to {c} when they notice {b} affecting {a}?",
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. After {b}, using {d} to {c} can reduce the risk of further unauthorised {a} while the customer seeks help.",
          }),
          patchArgument(template, 1, {
            text: "No. If customers can trigger this control too easily through {d}, genuine customers may block urgent {a}, so clear recovery and confirmation controls are necessary.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL001-T07":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          template.arguments[0],
          patchArgument(template, 1, {
            text: "No. If one fixed benchmark is shown for {c} despite {d}, the portal may create expectations that cannot be met; categories need realistic differentiation.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        statement: "Should {a} include {b} for {c} during {d}?",
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Printing {b} on {a} guarantees that all {c} raised during {d} will be resolved immediately.",
          }),
          patchArgument(template, 1, {
            text: "No. {b} should not be printed on {a} because receipts used for {d} should not contain a contact number for {c}.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL002-T05":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          ["registered mobile number", "recovery email address", "registered recovery device", "transaction-limit setting"],
          template.dimensions[1],
          template.dimensions[2],
          ["further unauthorised account activity", "fraudulent payment attempts", "loss of recovery access", "additional security changes"],
        ] as const,
      });

    case "ARG-CP003-QL002-T07":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0], template.dimensions[1], template.dimensions[2],
          ["teaching time", "time for individual feedback", "breadth of learning", "time for discussion-based learning"],
        ] as const,
      });

    case "ARG-CP003-QL003-T02":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Using {d} supposedly requires no staff, connectivity or user support, so {a} at {b} becomes unnecessary even with {c}.",
          }),
          template.arguments[1],
        ] as const,
      });

    case "ARG-CP003-QL003-T03":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        statement: "Should the city introduce {c} on {a} during {b}?",
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. {c} during {b} can reduce conflict between dense pedestrian movement and vehicles on {a}.",
          }),
          patchArgument(template, 1, {
            text: "No. Traffic and deliveries may shift to {d}, so diversion capacity and access arrangements must be workable before {c} is introduced on {a} during {b}.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL003-T04":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        statement: "Should all {a} move entirely to {b} {c}?",
      });

    case "ARG-CP003-QL004-T01":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          template.arguments[0],
          patchArgument(template, 1, {
            text: "No. {c} who attend {b} {d} will all become permanently dependent on extra help in {a}.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL004-T03":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          ["flexible starting times", "staggered starting times", "limited arrival-time flexibility", "bounded reporting-time flexibility"],
          template.dimensions[1],
          ["a ninety-minute window", "a one-hour window", "two defined start bands", "a limited daily range"],
          template.dimensions[3],
        ] as const,
      });

    case "ARG-CP003-QL004-T04":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Anyone attending {a} offered as {d} at {b} will never face {c} again.",
          }),
          template.arguments[1],
        ] as const,
      });

    case "ARG-CP003-QL004-T06":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        statement: "Should an online service send {c} when {a} is about to become {b}?",
      });

    case "ARG-CP003-QL004-T08":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        arguments: [
          template.arguments[0],
          patchArgument(template, 1, {
            text: "No. Because {a} can be useful for {c}, the institution should never regulate {a} in {b} even to address {d}.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        correlatedPairs: [Object.freeze({
          dimensions: [1, 2] as const,
          values: [
            ["screen-reader compatibility", "users with visual disabilities"],
            ["screen-reader compatibility", "users relying on screen readers"],
            ["screen-reader compatibility", "blind and low-vision users"],
            ["screen-reader compatibility", "users navigating non-visually"],
            ["keyboard-only navigation", "users unable to operate a mouse"],
            ["keyboard-only navigation", "keyboard-dependent users"],
            ["keyboard-only navigation", "users with motor disabilities"],
            ["keyboard-only navigation", "users relying on non-mouse controls"],
            ["high-contrast display support", "users needing high-contrast interfaces"],
            ["high-contrast display support", "users with low vision"],
            ["high-contrast display support", "users with contrast-sensitivity limitations"],
            ["high-contrast display support", "users who struggle with low-contrast text"],
            ["accessible form labels", "users relying on assistive technology"],
            ["accessible form labels", "screen-reader users completing forms"],
            ["accessible form labels", "blind users completing online forms"],
            ["accessible form labels", "users navigating forms non-visually"],
          ] as const,
        })],
      });

    case "ARG-CP003-QL005-T08":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0],
          ["employees", "trainees", "contract staff", "volunteers"],
          template.dimensions[2],
          template.dimensions[3],
        ] as const,
        statement: "Should an organisation publish the {a} of its {b} in {c}?",
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Publishing the {a} of its {b} in {c} will automatically create {d}.",
          }),
          patchArgument(template, 1, {
            text: "No. Any {b} member who wants {a} kept out of {c} must be hiding something and therefore cannot contribute to {d}.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL006-T02":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0],
          ["automatic blocking", "mandatory pre-authorisation", "a blanket decline rule", "an automatic transaction hold"],
          template.dimensions[2],
          template.dimensions[3],
        ] as const,
      });

    case "ARG-CP003-QL006-T04":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0], template.dimensions[1], template.dimensions[2],
          ["investigating the affected centre", "verifying evidence and scope", "isolating affected sessions", "using a proportionate remedial process"],
        ] as const,
      });

    case "ARG-CP003-QL006-T05":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0], template.dimensions[1], template.dimensions[2],
          ["adequate public transport and alternative-route capacity", "parallel-road capacity", "park-and-ride capacity", "reliable bus-and-metro access"],
        ] as const,
        arguments: [
          patchArgument(template, 0, {
            text: "Yes. Where {d} is available, restricting {a} on {b} during {c} can reduce demand for scarce road space on that corridor.",
          }),
          patchArgument(template, 1, {
            text: "No. Restricting {a} on {b} during {c} will inevitably create permanent gridlock across the entire city even where {d} is available.",
          }),
        ] as const,
      });

    case "ARG-CP003-QL006-T07":
      return Object.freeze({
        ...template,
        remediationAuthority: AUTHORITY,
        dimensions: [
          template.dimensions[0],
          ["a small per-item fee", "a visible environmental charge", "a single-use surcharge", "a consumption-based fee"],
          template.dimensions[2], template.dimensions[3],
        ] as const,
      });

    default:
      return Object.freeze({ ...template, remediationAuthority: AUTHORITY });
  }
}

function remediateQl(qlId: ArgQlId): readonly ArgCp009Template[] {
  return Object.freeze(ARG_CP003_TEMPLATES_BY_QL[qlId].map(remediate));
}

export const ARG_CP009_ENGLISH_TEMPLATES_BY_QL: Readonly<Record<ArgQlId, readonly ArgCp009Template[]>> = Object.freeze({
  "ARG-QL-001": remediateQl("ARG-QL-001"),
  "ARG-QL-002": remediateQl("ARG-QL-002"),
  "ARG-QL-003": remediateQl("ARG-QL-003"),
  "ARG-QL-004": remediateQl("ARG-QL-004"),
  "ARG-QL-005": remediateQl("ARG-QL-005"),
  "ARG-QL-006": remediateQl("ARG-QL-006"),
});
