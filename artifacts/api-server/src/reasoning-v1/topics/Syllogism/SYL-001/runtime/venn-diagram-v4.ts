import type {
  CanonicalConclusion,
  CanonicalModel,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import { learnerCopyV4 } from "./learner-v4-localization";
import type {
  SylLearnerDiagramV4,
  SylLearnerExplanationModeV4,
  SylVennDiagramModeV4,
} from "./learner-v4-types";
import type { SylStructuredProofV3 } from "./structured-proof-v3-types";

interface VennInputV4 {
  locale: SylLocale;
  displayedPremises: readonly SurfacePremise[];
  termLabels: Readonly<Record<TermId, string>>;
  learnerMode: SylLearnerExplanationModeV4;
  correctSemanticValue: string;
}

interface Relation {
  kind: "ALL" | "NO" | "SOME" | "SOME_NOT" | "ONLY_A_FEW" | "IDENTITY";
  subject: TermId;
  predicate: TermId;
  premiseId: string;
}

interface SvgResult {
  mode: Exclude<SylVennDiagramModeV4, "OMITTED_NOT_USEFUL">;
  body: string;
  height: number;
  caption: string;
  description: string;
  semanticSignature: string;
  modelSignature: string | null;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function label(term: TermId, input: VennInputV4): string {
  return input.termLabels[term] ?? term;
}

function relation(premise: SurfacePremise): Relation {
  switch (premise.form) {
    case "ONLY":
      return { kind: "ALL", subject: premise.predicate, predicate: premise.subject, premiseId: premise.premiseId };
    case "ALL":
    case "ARE_ONLY":
      return { kind: "ALL", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "NO":
      return { kind: "NO", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "SOME":
    case "A_FEW":
      return { kind: "SOME", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "SOME_NOT":
    case "NOT_ALL":
      return { kind: "SOME_NOT", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "ONLY_A_FEW":
      return { kind: "ONLY_A_FEW", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "IDENTITY":
      return { kind: "IDENTITY", subject: premise.subject, predicate: premise.predicate, premiseId: premise.premiseId };
    case "FEW":
      throw new Error("Plain FEW is excluded from the V4 learner diagram.");
  }
}

function modelSignature(model: CanonicalModel | null): string | null {
  if (!model) return null;
  const masks = model.occupiedRegions.map((region) => region.mask).sort((a, b) => a - b);
  return `${model.termOrder.join(",")}|${masks.join(",")}`;
}

function parseConclusion(value: string): CanonicalConclusion | null {
  const [form, subject, predicate] = value.split(":");
  if (!["ALL", "NO", "SOME", "SOME_NOT"].includes(form) || !subject || !predicate) return null;
  return {
    conclusionId: `V4-DIAGRAM-${form}-${subject}-${predicate}`,
    form: form as CanonicalConclusion["form"],
    subject: subject as TermId,
    predicate: predicate as TermId,
  };
}

function fittedText(
  x: number,
  y: number,
  text: string,
  className: string,
  maxWidth: number,
): string {
  const fit = [...text].length > 7
    ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"`
    : "";
  return `<text x="${x}" y="${y}" text-anchor="middle" class="${className}"${fit}>${esc(text)}</text>`;
}

function circle(cx: number, cy: number, r: number, cls: string, term: TermId, text: string): string {
  return `<g data-set="${esc(term)}"><circle cx="${cx}" cy="${cy}" r="${r}" class="${cls}"/><text x="${cx}" y="${cy - r + 19}" text-anchor="middle" class="set-label">${esc(text)}</text></g>`;
}

function ellipse(cx: number, cy: number, rx: number, ry: number, cls: string, term: TermId, text: string, labelY: number): string {
  return `<g data-set="${esc(term)}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="${cls}"/><text x="${cx}" y="${labelY}" text-anchor="middle" class="set-label">${esc(text)}</text></g>`;
}

function witness(x: number, y: number, region: string, index = ""): string {
  return `<text x="${x}" y="${y}" text-anchor="middle" class="witness" data-witness-region="${esc(region)}">×${index}</text>`;
}

function forbiddenWitness(x: number, y: number, region: string): string {
  return `<g data-forbidden-region="${esc(region)}">${witness(x, y, region)}<line x1="${x - 10}" y1="${y - 13}" x2="${x + 10}" y2="${y + 5}" class="forbidden"/><line x1="${x + 10}" y1="${y - 13}" x2="${x - 10}" y2="${y + 5}" class="forbidden"/></g>`;
}

function twoSet(relationValue: Relation, input: VennInputV4, impossible = false): SvgResult {
  const c = learnerCopyV4(input.locale);
  const a = label(relationValue.subject, input);
  const b = label(relationValue.predicate, input);
  const signature = `${relationValue.kind}:${relationValue.subject}:${relationValue.predicate}`;
  if (relationValue.kind === "ALL") {
    const body = `<g data-relation="ALL" data-inner="${esc(relationValue.subject)}" data-outer="${esc(relationValue.predicate)}">
      ${ellipse(180, 106, 128, 76, "set-b", relationValue.predicate, b, 49)}
      ${ellipse(180, 119, 66, 38, "set-a", relationValue.subject, a, 115)}
    </g>${impossible ? forbiddenWitness(90, 122, `${relationValue.subject}&!${relationValue.predicate}`) : ""}`;
    return {
      mode: impossible ? "VENN_IMPOSSIBLE" : "VENN_CONTAINMENT",
      body,
      height: 220,
      caption: impossible ? c.captionImpossible(a, b) : c.captionContainment(a, b),
      description: impossible ? c.captionImpossible(a, b) : c.captionContainment(a, b),
      semanticSignature: `${impossible ? "IMPOSSIBLE:" : ""}${signature}`,
      modelSignature: null,
    };
  }
  if (relationValue.kind === "IDENTITY") {
    const body = `<g data-relation="IDENTITY">${ellipse(180, 112, 115, 70, "set-a", relationValue.subject, `${a} = ${b}`, 58)}</g>`;
    return {
      mode: "VENN_CONTAINMENT",
      body,
      height: 220,
      caption: input.locale === "en-IN" ? `${a} and ${b} are the same set.` : input.locale === "hi-IN" ? `${a} और ${b} एक ही वर्ग हैं।` : `${a} ਅਤੇ ${b} ਇੱਕੋ ਵਰਗ ਹਨ।`,
      description: input.locale === "en-IN" ? `${a} and ${b} are identical sets.` : input.locale === "hi-IN" ? `${a} और ${b} समान वर्ग हैं।` : `${a} ਅਤੇ ${b} ਇੱਕੋ ਵਰਗ ਹਨ।`,
      semanticSignature: signature,
      modelSignature: null,
    };
  }
  if (relationValue.kind === "NO") {
    const body = `<g data-relation="NO" data-left="${esc(relationValue.subject)}" data-right="${esc(relationValue.predicate)}">
      ${circle(105, 112, 63, "set-a", relationValue.subject, a)}
      ${circle(255, 112, 63, "set-b", relationValue.predicate, b)}
      ${impossible ? forbiddenWitness(180, 119, `${relationValue.subject}&${relationValue.predicate}`) : ""}
    </g>`;
    return {
      mode: impossible ? "VENN_IMPOSSIBLE" : "VENN_SEPARATION",
      body,
      height: 220,
      caption: impossible ? c.captionImpossible(a, b) : c.captionSeparation(a, b),
      description: impossible ? c.captionImpossible(a, b) : c.captionSeparation(a, b),
      semanticSignature: `${impossible ? "IMPOSSIBLE:" : ""}${signature}`,
      modelSignature: null,
    };
  }

  const overlap = `${relationValue.subject}&${relationValue.predicate}`;
  const subjectOnly = `${relationValue.subject}&!${relationValue.predicate}`;
  const bodyBase = `${circle(138, 112, 76, "set-a", relationValue.subject, a)}${circle(222, 112, 76, "set-b", relationValue.predicate, b)}`;
  if (relationValue.kind === "SOME") {
    return {
      mode: "VENN_OVERLAP",
      body: `<g data-relation="SOME">${bodyBase}${witness(180, 125, overlap)}</g>`,
      height: 220,
      caption: c.captionOverlap(a, b),
      description: c.captionOverlap(a, b),
      semanticSignature: signature,
      modelSignature: null,
    };
  }
  if (relationValue.kind === "SOME_NOT") {
    return {
      mode: "VENN_SUBJECT_ONLY_WITNESS",
      body: `<g data-relation="SOME_NOT">${bodyBase}${witness(102, 125, subjectOnly)}</g>`,
      height: 220,
      caption: c.captionSomeNot(a, b),
      description: c.captionSomeNot(a, b),
      semanticSignature: signature,
      modelSignature: null,
    };
  }
  return {
    mode: "VENN_ONLY_A_FEW",
    body: `<g data-relation="ONLY_A_FEW">${bodyBase}${witness(180, 125, overlap, "₁")}${witness(102, 125, subjectOnly, "₂")}</g>`,
    height: 220,
    caption: c.captionOnlyFew(a, b),
    description: c.captionOnlyFew(a, b),
    semanticSignature: signature,
    modelSignature: null,
  };
}

function impossibleConclusionDiagram(
  semanticValue: string,
  input: VennInputV4,
): SvgResult | null {
  const conclusion = parseConclusion(semanticValue);
  if (!conclusion) return null;
  const subject = label(conclusion.subject, input);
  const predicate = label(conclusion.predicate, input);
  const subjectOnly = `${conclusion.subject}&!${conclusion.predicate}`;
  const overlap = `${conclusion.subject}&${conclusion.predicate}`;

  if (conclusion.form === "ALL") {
    const bodyBase = `${circle(138, 112, 76, "set-a", conclusion.subject, subject)}${circle(222, 112, 76, "set-b", conclusion.predicate, predicate)}`;
    const body = `<g data-relation="IMPOSSIBLE_ALL" data-invalid-conclusion="ALL">${bodyBase}${witness(102, 125, subjectOnly)}<circle cx="102" cy="117" r="18" class="counter-ring"/></g>`;
    const caption = input.locale === "en-IN"
      ? `The × is ${subject} but not ${predicate}. Therefore, not all ${subject} are ${predicate}.`
      : input.locale === "hi-IN"
        ? `× ${subject} है, लेकिन ${predicate} नहीं है। इसलिए सभी ${subject}, ${predicate} नहीं हैं।`
        : `× ${subject} ਹੈ, ਪਰ ${predicate} ਨਹੀਂ ਹੈ। ਇਸ ਲਈ ਸਾਰੇ ${subject}, ${predicate} ਨਹੀਂ ਹਨ।`;
    return {
      mode: "VENN_IMPOSSIBLE",
      body,
      height: 220,
      caption,
      description: caption,
      semanticSignature: `IMPOSSIBLE:ALL:${conclusion.subject}:${conclusion.predicate}`,
      modelSignature: null,
    };
  }

  if (conclusion.form === "NO") {
    const bodyBase = `${circle(138, 112, 76, "set-a", conclusion.subject, subject)}${circle(222, 112, 76, "set-b", conclusion.predicate, predicate)}`;
    const body = `<g data-relation="IMPOSSIBLE_NO" data-invalid-conclusion="NO">${bodyBase}${witness(180, 125, overlap)}<circle cx="180" cy="117" r="18" class="counter-ring"/></g>`;
    const caption = input.locale === "en-IN"
      ? `The × belongs to both ${subject} and ${predicate}, so the two sets cannot be completely separate.`
      : input.locale === "hi-IN"
        ? `× ${subject} और ${predicate} दोनों में है, इसलिए दोनों वर्ग पूरी तरह अलग नहीं हो सकते।`
        : `× ${subject} ਅਤੇ ${predicate} ਦੋਵਾਂ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ।`;
    return {
      mode: "VENN_IMPOSSIBLE",
      body,
      height: 220,
      caption,
      description: caption,
      semanticSignature: `IMPOSSIBLE:NO:${conclusion.subject}:${conclusion.predicate}`,
      modelSignature: null,
    };
  }

  if (conclusion.form === "SOME") {
    return twoSet({
      kind: "NO",
      subject: conclusion.subject,
      predicate: conclusion.predicate,
      premiseId: conclusion.conclusionId,
    }, input, true);
  }

  return twoSet({
    kind: "ALL",
    subject: conclusion.subject,
    predicate: conclusion.predicate,
    premiseId: conclusion.conclusionId,
  }, input, true);
}

function universalChain(relations: readonly Relation[], input: VennInputV4): SvgResult | null {
  const first = relations.find((entry) => entry.kind === "ALL");
  if (!first) return null;
  const second = relations.find((entry) => entry.kind === "ALL" && entry.subject === first.predicate);
  const reverse = relations.find((entry) => entry.kind === "ALL" && entry.predicate === first.subject);
  const chain = second
    ? { inner: first.subject, middle: first.predicate, outer: second.predicate }
    : reverse
      ? { inner: reverse.subject, middle: reverse.predicate, outer: first.predicate }
      : null;
  if (!chain || new Set([chain.inner, chain.middle, chain.outer]).size !== 3) return null;
  const c = learnerCopyV4(input.locale);
  const inner = label(chain.inner, input);
  const middle = label(chain.middle, input);
  const outer = label(chain.outer, input);
  const body = `<g data-relation="ALL_CHAIN" data-inner="${esc(chain.inner)}" data-middle="${esc(chain.middle)}" data-outer="${esc(chain.outer)}">
    ${ellipse(180, 116, 150, 92, "set-c", chain.outer, outer, 43)}
    ${ellipse(180, 126, 105, 64, "set-b", chain.middle, middle, 78)}
    ${ellipse(180, 137, 57, 34, "set-a", chain.inner, inner, 137)}
  </g>`;
  return {
    mode: "VENN_UNIVERSAL_CHAIN",
    body,
    height: 240,
    caption: c.captionChain(inner, middle, outer),
    description: c.captionChain(inner, middle, outer),
    semanticSignature: `ALL_CHAIN:${chain.inner}:${chain.middle}:${chain.outer}`,
    modelSignature: null,
  };
}

function witnessTransfer(relations: readonly Relation[], input: VennInputV4): SvgResult | null {
  const some = relations.find((entry) => entry.kind === "SOME");
  if (!some) return null;
  const no = relations.find((entry) =>
    entry.kind === "NO"
    && (entry.subject === some.subject || entry.subject === some.predicate || entry.predicate === some.subject || entry.predicate === some.predicate));
  if (!no) return null;

  const someTerms = [some.subject, some.predicate] as const;
  const shared = someTerms.find((term) => term === no.subject || term === no.predicate);
  if (!shared) return null;
  const inside = someTerms.find((term) => term !== shared);
  const outside = no.subject === shared ? no.predicate : no.subject;
  if (!inside || outside === inside) return null;

  const c = learnerCopyV4(input.locale);
  const insideLabel = label(inside, input);
  const sharedLabel = label(shared, input);
  const outsideLabel = label(outside, input);
  const body = `<g data-relation="WITNESS_TRANSFER" data-inside="${esc(inside)}" data-shared="${esc(shared)}" data-outside="${esc(outside)}">
    ${circle(102, 118, 70, "set-a", inside, insideLabel)}
    ${circle(168, 118, 70, "set-b", shared, sharedLabel)}
    ${circle(286, 118, 58, "set-c", outside, outsideLabel)}
    ${witness(135, 132, `${inside}&${shared}&!${outside}`)}
  </g>`;
  return {
    mode: "VENN_WITNESS_TRANSFER",
    body,
    height: 230,
    caption: c.captionWitnessTransfer(insideLabel, sharedLabel, outsideLabel),
    description: c.captionWitnessTransfer(insideLabel, sharedLabel, outsideLabel),
    semanticSignature: `WITNESS_TRANSFER:${inside}:${shared}:!${outside}`,
    modelSignature: null,
  };
}

function allAndNo(relations: readonly Relation[], input: VennInputV4): SvgResult | null {
  const all = relations.find((entry) => entry.kind === "ALL");
  if (!all) return null;
  const no = relations.find((entry) => entry.kind === "NO" && (entry.subject === all.predicate || entry.predicate === all.predicate));
  if (!no) return null;
  const outside = no.subject === all.predicate ? no.predicate : no.subject;
  const inner = label(all.subject, input);
  const outer = label(all.predicate, input);
  const third = label(outside, input);
  const body = `<g data-relation="ALL_AND_NO">
    ${ellipse(118, 120, 92, 70, "set-b", all.predicate, outer, 66)}
    ${ellipse(118, 132, 48, 34, "set-a", all.subject, inner, 132)}
    ${circle(278, 120, 58, "set-c", outside, third)}
  </g>`;
  const caption = input.locale === "en-IN"
    ? `${inner} is inside ${outer}, and ${outer} is separate from ${third}.`
    : input.locale === "hi-IN"
      ? `${inner}, ${outer} के अंदर है और ${outer}, ${third} से अलग है।`
      : `${inner}, ${outer} ਦੇ ਅੰਦਰ ਹੈ ਅਤੇ ${outer}, ${third} ਤੋਂ ਵੱਖ ਹੈ।`;
  return {
    mode: "VENN_UNIVERSAL_CHAIN",
    body,
    height: 230,
    caption,
    description: caption,
    semanticSignature: `ALL_NO:${all.subject}:${all.predicate}:!${outside}`,
    modelSignature: null,
  };
}

const FULL_REGION_POINTS: Readonly<Record<string, readonly [number, number]>> = {
  "": [180, 294],
  "0": [73, 130],
  "1": [287, 130],
  "2": [180, 232],
  "0,1": [180, 100],
  "0,2": [120, 182],
  "1,2": [240, 182],
  "0,1,2": [180, 150],
};

const MINI_REGION_POINTS: Readonly<Record<string, readonly [number, number]>> = {
  "": [87, 190],
  "0": [25, 98],
  "1": [149, 98],
  "2": [87, 158],
  "0,1": [87, 74],
  "0,2": [56, 126],
  "1,2": [118, 126],
  "0,1,2": [87, 104],
};

function modelMemberKey(model: CanonicalModel, regionTerms: readonly TermId[]): string {
  return model.termOrder.slice(0, 3)
    .map((term, index) => regionTerms.includes(term) ? String(index) : null)
    .filter((entry): entry is string => entry !== null)
    .join(",");
}

function fullModelPanel(
  model: CanonicalModel,
  input: VennInputV4,
  heading: string,
  panelId: string,
): string {
  const terms = model.termOrder.slice(0, 3);
  const classes = ["set-a", "set-b", "set-c"] as const;
  const centers: readonly [number, number][] = terms.length === 2
    ? [[128, 150], [232, 150]]
    : [[125, 130], [235, 130], [180, 202]];
  const radius = terms.length === 2 ? 78 : 74;
  const labelPositions: readonly [number, number][] = terms.length === 2
    ? [[78, 82], [282, 82]]
    : [[72, 74], [288, 74], [180, 286]];
  const circles = terms.map((term, index) => {
    const [cx, cy] = centers[index];
    const [lx, ly] = labelPositions[index];
    return `<g data-set="${esc(term)}"><circle cx="${cx}" cy="${cy}" r="${radius}" class="${classes[index]}"/>${fittedText(lx, ly, label(term, input), "model-label", 76)}</g>`;
  }).join("");
  const points = model.occupiedRegions.map((region, index) => {
    const key = modelMemberKey(model, region.memberTerms);
    const pointMap = terms.length === 2
      ? { "": [180, 278], "0": [72, 155], "1": [288, 155], "0,1": [180, 155] } as const
      : FULL_REGION_POINTS;
    const [x, y] = pointMap[key as keyof typeof pointMap] ?? [180, 294];
    return witness(x, y, key || "outside-all", String(index + 1));
  }).join("");
  return `<g data-model-panel="${esc(panelId)}">
    <rect x="8" y="8" width="344" height="300" rx="14" class="panel"/>
    <text x="180" y="30" text-anchor="middle" class="panel-label">${esc(heading)}</text>
    ${circles}${points}
  </g>`;
}

function miniModelPanel(
  model: CanonicalModel,
  input: VennInputV4,
  xOffset: number,
  heading: string,
  panelId: string,
): string {
  const terms = model.termOrder.slice(0, 3);
  const classes = ["set-a", "set-b", "set-c"] as const;
  const centers: readonly [number, number][] = terms.length === 2
    ? [[57, 103], [117, 103]]
    : [[55, 92], [119, 92], [87, 138]];
  const radius = terms.length === 2 ? 44 : 42;
  const labelPositions: readonly [number, number][] = terms.length === 2
    ? [[30, 58], [144, 58]]
    : [[28, 53], [146, 53], [87, 184]];
  const circles = terms.map((term, index) => {
    const [cx, cy] = centers[index];
    const [lx, ly] = labelPositions[index];
    return `<g data-set="${esc(term)}"><circle cx="${cx}" cy="${cy}" r="${radius}" class="${classes[index]}"/>${fittedText(lx, ly, label(term, input), "mini-model-label", 50)}</g>`;
  }).join("");
  const twoTermPoints: Readonly<Record<string, readonly [number, number]>> = {
    "": [87, 190], "0": [24, 105], "1": [150, 105], "0,1": [87, 105],
  };
  const points = model.occupiedRegions.map((region, index) => {
    const key = modelMemberKey(model, region.memberTerms);
    const [x, y] = (terms.length === 2 ? twoTermPoints : MINI_REGION_POINTS)[key] ?? [87, 190];
    return `<text x="${x}" y="${y}" text-anchor="middle" class="mini-witness" data-witness-region="${esc(key || "outside-all")}">×${index + 1}</text>`;
  }).join("");
  return `<g transform="translate(${xOffset} 0)" data-model-panel="${esc(panelId)}">
    <rect x="2" y="8" width="174" height="198" rx="12" class="panel"/>
    <text x="87" y="29" text-anchor="middle" class="panel-label">${esc(heading)}</text>
    ${circles}${points}
  </g>`;
}

function modelDiagram(
  mode: "VENN_COUNTEREXAMPLE" | "VENN_POSSIBILITY",
  model: CanonicalModel,
  input: VennInputV4,
): SvgResult | null {
  if (model.termOrder.length > 3 || model.termOrder.length < 2) return null;
  const c = learnerCopyV4(input.locale);
  const heading = mode === "VENN_COUNTEREXAMPLE" ? c.modelFalse : c.oneValidArrangement;
  const body = fullModelPanel(model, input, heading, mode);
  const caption = mode === "VENN_COUNTEREXAMPLE" ? c.captionCounterexample : c.captionPossibility;
  return {
    mode,
    body,
    height: 318,
    caption,
    description: caption,
    semanticSignature: `${mode}:${model.termOrder.join(",")}:${modelSignature(model)}`,
    modelSignature: modelSignature(model),
  };
}

function dualModelDiagram(
  primary: CanonicalModel,
  alternate: CanonicalModel,
  input: VennInputV4,
): SvgResult | null {
  const terms = new Set([...primary.termOrder, ...alternate.termOrder]);
  if (terms.size > 3 || terms.size < 2) return null;
  const c = learnerCopyV4(input.locale);
  const body = `${miniModelPanel(primary, input, 0, c.modelTrue, "TRUE")}${miniModelPanel(alternate, input, 184, c.modelFalse, "FALSE")}`;
  return {
    mode: "VENN_DUAL_MODEL",
    body,
    height: 214,
    caption: c.captionDual,
    description: c.captionDual,
    semanticSignature: `DUAL:${modelSignature(primary)}:${modelSignature(alternate)}`,
    modelSignature: `${modelSignature(primary)}||${modelSignature(alternate)}`,
  };
}

function eitherOrDiagram(relations: readonly Relation[], input: VennInputV4): SvgResult | null {
  const terms = [...new Set(relations.flatMap((entry) => [entry.subject, entry.predicate]))];
  if (terms.length < 2) return null;
  const a = terms[0];
  const b = terms[1];
  const aLabel = label(a, input);
  const bLabel = label(b, input);
  const c = learnerCopyV4(input.locale);
  const panel = (x: number, xWitness: number, panelLabel: string, region: string) => `<g transform="translate(${x} 0)" data-either-or-panel="${esc(panelLabel)}">
    <rect x="4" y="8" width="168" height="155" rx="12" class="panel"/>
    <text x="86" y="29" text-anchor="middle" class="panel-label">${esc(panelLabel)}</text>
    <circle cx="69" cy="91" r="50" class="set-a"/><circle cx="105" cy="91" r="50" class="set-b"/>
    <text x="50" y="57" text-anchor="middle" class="mini-label">${esc(aLabel)}</text>
    <text x="124" y="57" text-anchor="middle" class="mini-label">${esc(bLabel)}</text>
    ${witness(xWitness, 103, region)}
  </g>`;
  const body = `<g data-relation="EITHER_OR_EXACT_ONE">${panel(0, 54, "I", `${a}&!${b}`)}${panel(184, 118, "II", `${b}&!${a}`)}</g>`;
  return {
    mode: "VENN_EITHER_OR",
    body,
    height: 180,
    caption: c.captionEitherOr,
    description: c.captionEitherOr,
    semanticSignature: `EITHER_OR:${a}:${b}`,
    modelSignature: null,
  };
}

function wrapSvg(result: SvgResult, proof: SylStructuredProofV3, locale: SylLocale): string {
  const suffix = proof.identity.reviewVersionId.slice(0, 18);
  const titleId = `syl-v4-title-${suffix}`;
  const descId = `syl-v4-desc-${suffix}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${result.height}" role="img" lang="${locale}" aria-labelledby="${titleId} ${descId}" data-venn-v4="true" data-diagram-mode="${result.mode}" data-answer-sentence="false">
    <title id="${titleId}">${esc(result.caption)}</title>
    <desc id="${descId}">${esc(result.description)}</desc>
    <style>
      .set-a{fill:#dbeafe;fill-opacity:.78;stroke:#2563eb;stroke-width:2.5}
      .set-b{fill:#fef3c7;fill-opacity:.72;stroke:#d97706;stroke-width:2.5}
      .set-c{fill:#e2e8f0;fill-opacity:.72;stroke:#475569;stroke-width:2.5}
      .set-label,.mini-label{font:700 14px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .mini-label{font-size:11px}
      .model-label{font:750 12px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .mini-model-label{font:750 9.5px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .witness{font:900 25px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827}
      .mini-witness{font:900 15px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827}
      .counter-ring{fill:none;stroke:#dc2626;stroke-width:3}
      .forbidden{stroke:#dc2626;stroke-width:3;stroke-linecap:round}
      .panel{fill:#fff;stroke:#94a3b8;stroke-width:1.5}
      .panel-label{font:800 12px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a;letter-spacing:.03em}
    </style>
    ${result.body}
  </svg>`;
}

function omitted(reason: NonNullable<SylLearnerDiagramV4["omissionReason"]>, signature: string): SylLearnerDiagramV4 {
  return {
    enabled: false,
    mode: "OMITTED_NOT_USEFUL",
    omissionReason: reason,
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: signature,
    modelSignature: null,
    answerSentenceEmbedded: false,
    mobileViewBoxWidth: 360,
    diagramCount: 0,
  };
}

export function renderVennDiagramV4(
  proof: SylStructuredProofV3,
  input: VennInputV4,
): SylLearnerDiagramV4 {
  const decisiveIds = new Set(proof.correctOptionProof.premiseIdsUsed);
  const premises = input.displayedPremises.filter((premise) => decisiveIds.has(premise.premiseId));
  const selected = premises.length > 0 ? premises : input.displayedPremises;
  const relations = selected.map(relation);
  const terms = [...new Set(relations.flatMap((entry) => [entry.subject, entry.predicate]))];

  if (input.learnerMode === "CONCLUSION_MASK") {
    return omitted("CONCLUSION_MASK_CLEAR_WITHOUT_DIAGRAM", `OMIT:MASK:${relations.map((entry) => `${entry.kind}:${entry.subject}:${entry.predicate}`).join("|")}`);
  }

  let result: SvgResult | null = null;

  if (input.learnerMode === "DUAL_MODEL" || input.learnerMode === "POSSIBLE_NOT_DEFINITE") {
    const primary = proof.correctOptionProof.proofModel ?? proof.diagramSpec.model;
    const alternate = proof.correctOptionProof.counterModel ?? proof.diagramSpec.alternateModel;
    if (primary && alternate) result = dualModelDiagram(primary, alternate, input);
  } else if (input.learnerMode === "COUNTEREXAMPLE") {
    const model = proof.correctOptionProof.counterModel ?? proof.diagramSpec.model;
    if (model) result = modelDiagram("VENN_COUNTEREXAMPLE", model, input);
  } else if (input.learnerMode === "POSSIBILITY_MODEL") {
    const model = proof.correctOptionProof.proofModel ?? proof.diagramSpec.model;
    if (model) result = modelDiagram("VENN_POSSIBILITY", model, input);
  } else if (input.learnerMode === "EITHER_OR") {
    result = eitherOrDiagram(relations, input);
  } else if (input.learnerMode === "WITNESS_TRANSFER") {
    result = witnessTransfer(relations, input);
  } else if (input.learnerMode === "DIRECT_CONTRADICTION") {
    result = impossibleConclusionDiagram(input.correctSemanticValue, input);
  } else {
    result = universalChain(relations, input)
      ?? witnessTransfer(relations, input)
      ?? allAndNo(relations, input)
      ?? (relations.length === 1 ? twoSet(relations[0], input) : null)
      ?? (relations.find((entry) => entry.kind === "ONLY_A_FEW") ? twoSet(relations.find((entry) => entry.kind === "ONLY_A_FEW")!, input) : null)
      ?? (relations.find((entry) => entry.kind === "SOME_NOT") ? twoSet(relations.find((entry) => entry.kind === "SOME_NOT")!, input) : null)
      ?? (relations.find((entry) => entry.kind === "SOME") ? twoSet(relations.find((entry) => entry.kind === "SOME")!, input) : null)
      ?? (relations.find((entry) => entry.kind === "NO") ? twoSet(relations.find((entry) => entry.kind === "NO")!, input) : null)
      ?? (relations.find((entry) => entry.kind === "ALL") ? twoSet(relations.find((entry) => entry.kind === "ALL")!, input) : null);
  }

  if (!result) {
    return omitted(
      terms.length > 3 ? "MORE_THAN_THREE_TERMS" : "NO_STABLE_SIMPLE_VENN",
      `OMIT:${input.learnerMode}:${relations.map((entry) => `${entry.kind}:${entry.subject}:${entry.predicate}`).join("|")}`,
    );
  }

  return {
    enabled: true,
    mode: result.mode,
    omissionReason: null,
    svg: wrapSvg(result, proof, input.locale),
    caption: result.caption,
    accessibleDescription: result.description,
    semanticSignature: result.semanticSignature,
    modelSignature: result.modelSignature,
    answerSentenceEmbedded: false,
    mobileViewBoxWidth: 360,
    diagramCount: 1,
  };
}
