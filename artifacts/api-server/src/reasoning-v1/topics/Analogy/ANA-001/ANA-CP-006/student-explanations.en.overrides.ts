import { shiftLetter } from "../foundation/alphabet";
import {
  ANA_CP006_RULES,
  type ClusterRuleContext,
} from "./rule-definitions";

function pairGroups(value: string): string {
  return value.match(/.{1,2}/g)?.join(" | ") ?? value;
}

function parityGroups(value: string): { odd: string; even: string } {
  return {
    odd: [...value].filter((_, index) => index % 2 === 0).join(""),
    even: [...value].filter((_, index) => index % 2 === 1).join(""),
  };
}

function parityProfileText(
  profile: Extract<ClusterRuleContext, { kind: "PARITY_REGROUP" }>["profile"],
): string {
  const texts = {
    ODD_FORWARD_EVEN_FORWARD: "odd-position letters in their original order, followed by even-position letters in their original order",
    EVEN_FORWARD_ODD_FORWARD: "even-position letters in their original order, followed by odd-position letters in their original order",
    ODD_FORWARD_EVEN_REVERSE: "odd-position letters in their original order, followed by even-position letters in reverse order",
    EVEN_FORWARD_ODD_REVERSE: "even-position letters in their original order, followed by odd-position letters in reverse order",
    ODD_REVERSE_EVEN_FORWARD: "odd-position letters in reverse order, followed by even-position letters in their original order",
    EVEN_REVERSE_ODD_FORWARD: "even-position letters in reverse order, followed by odd-position letters in their original order",
  } as const;
  return texts[profile];
}

const adjacent = ANA_CP006_RULES.find((rule) => rule.id === "CLUSTER_ADJACENT_PAIR_SWAP");
if (!adjacent) throw new Error("Missing CP-006 adjacent-pair rule.");
adjacent.explain = (input, output) =>
  `Start with ${input}. Exchange the 1st and 2nd letters, then the 3rd and 4th, and continue in the same way. ` +
  `${pairGroups(input)} becomes ${pairGroups(output)}, so the result is ${output}.`;

const neighbour = ANA_CP006_RULES.find((rule) => rule.id === "CLUSTER_NEIGHBOUR_EXPANSION");
if (!neighbour) throw new Error("Missing CP-006 neighbour-expansion rule.");
neighbour.explain = (input, output, context) => {
  if (context.kind !== "NEIGHBOUR_EXPANSION") return `${input} becomes ${output}.`;
  const parts = [...input].map((letter) => {
    const previous = shiftLetter(letter, -1);
    const next = shiftLetter(letter, 1);
    const replacement = context.order === "PREV_NEXT" ? previous + next : next + previous;
    return `${letter} becomes ${replacement}`;
  });
  return `Start with ${input}. Replace each letter by its two immediate alphabet neighbours in the shown order. ` +
    `${parts.join("; ")}. Joining the new pairs gives ${output}.`;
};

const parity = ANA_CP006_RULES.find((rule) => rule.id === "CLUSTER_PARITY_REGROUP");
if (!parity) throw new Error("Missing CP-006 parity-regroup rule.");
parity.explain = (input, output, context) => {
  if (context.kind !== "PARITY_REGROUP") return `${input} becomes ${output}.`;
  const groups = parityGroups(input);
  return `Start with ${input}. Its odd-position letters are ${groups.odd}, and its even-position letters are ${groups.even}. ` +
    `Write ${parityProfileText(context.profile)}. This gives ${output}.`;
};
