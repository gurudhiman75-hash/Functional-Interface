import type { KnowledgeFact } from "../../types";
import {
  renderGeographyExplanationMapSvgV1,
  type GeographyExplanationMapRenderV1,
  type GeographyExplanationMapSpecV1,
} from "../explanation-maps/geography-explanation-map-v1";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const FACTS = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1;
const SOURCE_RELATIONS = new Set(["originates_from", "source_region", "source_area"]);
const GEOMETRY_AUTHORITY = "GEO-RIV-SCHEMATIC-V1";

function byId(factId: string) {
  const fact = FACTS.find((entry) => entry.factId === factId);
  if (!fact) throw new Error(`Missing CP002 explanation-map fact ${factId}`);
  return fact;
}

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  throw new Error(`Unsupported map value kind for ${fact.factId}`);
}

function factSet(ids: readonly string[]) {
  return [...new Set(ids)];
}

function schematic(args: Omit<GeographyExplanationMapSpecV1, "schemaVersion" | "geometryMode" | "geometryAuthorityId" | "notToScale">) {
  return renderGeographyExplanationMapSvgV1({
    schemaVersion: "GEO_EXPLANATION_MAP_V1",
    geometryMode: "SCHEMATIC",
    geometryAuthorityId: GEOMETRY_AUTHORITY,
    notToScale: true,
    ...args,
  });
}

function sourceMap(fact: KnowledgeFact): GeographyExplanationMapRenderV1 {
  const river = fact.entity.label.en;
  const source = valueText(fact);
  return schematic({
    mapId: `cp002-source-${fact.factId}`,
    kind: "SOURCE",
    title: `${river} source`,
    viewportLabel: "Indus river system",
    caption: `${source} is the reviewed source association for the ${river} River.`,
    sourceFactIds: [fact.factId],
    nodes: [
      { id: "source", label: source, x: 18, y: 48, role: fact.relation === "source_area" ? "pass" : "source", emphasis: "primary" },
      { id: "river", label: river, x: 82, y: 52, role: "river", emphasis: "primary" },
    ],
    links: [{ id: "source-river", from: "source", to: "river", emphasis: "primary" }],
  });
}

function tributaryMap(fact: KnowledgeFact): GeographyExplanationMapRenderV1 {
  const tributary = fact.entity.label.en;
  const parent = valueText(fact);
  return schematic({
    mapId: `cp002-tributary-${fact.factId}`,
    kind: "TRIBUTARY",
    title: `${tributary} and ${parent}`,
    viewportLabel: "Indus river system",
    caption: `${tributary} is a tributary of the ${parent} River.`,
    sourceFactIds: [fact.factId],
    nodes: [
      { id: "tributary", label: tributary, x: 18, y: 27, role: "river", emphasis: "primary" },
      { id: "parent-up", label: parent, x: 18, y: 75, role: "river", emphasis: "context" },
      { id: "join", label: "joins", x: 53, y: 53, role: "confluence", emphasis: "primary" },
      { id: "parent-down", label: parent, x: 84, y: 58, role: "river", emphasis: "primary" },
    ],
    links: [
      { id: "tributary-join", from: "tributary", to: "join", emphasis: "primary" },
      { id: "parent-join", from: "parent-up", to: "join", emphasis: "context" },
      { id: "join-parent", from: "join", to: "parent-down", emphasis: "primary" },
    ],
  });
}

function chenabFormationMap(): GeographyExplanationMapRenderV1 {
  const formation = byId("geo-riv-001-cp002-chenab-formed-chandra-bhaga");
  const tandi = byId("geo-riv-001-cp002-chenab-formation-tandi");
  return schematic({
    mapId: "cp002-chenab-formation-tandi",
    kind: "CONFLUENCE",
    title: "Formation of the Chenab",
    viewportLabel: "Himachal Pradesh · Indus system",
    caption: "Chandra and Bhaga meet at Tandi; from the confluence the river is known as the Chenab.",
    sourceFactIds: [formation.factId, tandi.factId],
    nodes: [
      { id: "chandra", label: "Chandra", x: 15, y: 24, role: "river", emphasis: "primary" },
      { id: "bhaga", label: "Bhaga", x: 15, y: 77, role: "river", emphasis: "primary" },
      { id: "tandi", label: "Tandi", x: 52, y: 52, role: "confluence", emphasis: "primary" },
      { id: "chenab", label: "Chenab", x: 86, y: 57, role: "river", emphasis: "primary" },
    ],
    links: [
      { id: "chandra-tandi", from: "chandra", to: "tandi" },
      { id: "bhaga-tandi", from: "bhaga", to: "tandi" },
      { id: "tandi-chenab", from: "tandi", to: "chenab" },
    ],
  });
}

function twoRiverConfluence(args: {
  mapId: string;
  title: string;
  tributary: string;
  parent: string;
  place: string;
  joinFactId: string;
  placeFactId: string;
}): GeographyExplanationMapRenderV1 {
  const join = byId(args.joinFactId);
  const place = byId(args.placeFactId);
  return schematic({
    mapId: args.mapId,
    kind: "CONFLUENCE",
    title: args.title,
    viewportLabel: "Indus river system",
    caption: `${args.tributary} joins the ${args.parent} at ${args.place}.`,
    sourceFactIds: [join.factId, place.factId],
    nodes: [
      { id: "tributary", label: args.tributary, x: 15, y: 26, role: "river", emphasis: "primary" },
      { id: "parent-up", label: args.parent, x: 15, y: 76, role: "river", emphasis: "context" },
      { id: "place", label: args.place, x: 53, y: 53, role: "confluence", emphasis: "primary" },
      { id: "parent-down", label: args.parent, x: 86, y: 58, role: "river", emphasis: "primary" },
    ],
    links: [
      { id: "tributary-place", from: "tributary", to: "place" },
      { id: "parent-place", from: "parent-up", to: "place", emphasis: "context" },
      { id: "place-down", from: "place", to: "parent-down" },
    ],
  });
}

export function geoRiv001Cp002JhelumCourseMapV1(): GeographyExplanationMapRenderV1 {
  const source = byId("geo-riv-001-cp002-jhelum-source-verinag");
  const srinagar = byId("geo-riv-001-cp002-jhelum-srinagar");
  const wular = byId("geo-riv-001-cp002-jhelum-wular-lake");
  return schematic({
    mapId: "cp002-jhelum-course",
    kind: "COURSE",
    title: "Jhelum: source to Wular Lake",
    viewportLabel: "Kashmir Valley · Indus system",
    caption: "The Jhelum rises at Cheshma Verinag, flows through Srinagar and then through Wular Lake.",
    sourceFactIds: [source.factId, srinagar.factId, wular.factId],
    nodes: [
      { id: "verinag", label: "Verinag", x: 14, y: 73, role: "source", emphasis: "primary" },
      { id: "srinagar", label: "Srinagar", x: 50, y: 52, role: "place", emphasis: "primary" },
      { id: "wular", label: "Wular Lake", x: 85, y: 31, role: "lake", emphasis: "primary" },
    ],
    links: [
      { id: "verinag-srinagar", from: "verinag", to: "srinagar" },
      { id: "srinagar-wular", from: "srinagar", to: "wular" },
    ],
  });
}

function beasSatlujChenabChainMap(): GeographyExplanationMapRenderV1 {
  const beasJoin = byId("geo-riv-001-cp002-beas-joins-satluj");
  const harike = byId("geo-riv-001-cp002-beas-satluj-confluence-harike");
  const satlujJoin = byId("geo-riv-001-cp002-satluj-joins-chenab-panjnad");
  const panjnad = byId("geo-riv-001-cp002-satluj-chenab-confluence-panjnad");
  return schematic({
    mapId: "cp002-beas-satluj-chenab-chain",
    kind: "SYSTEM_CHAIN",
    title: "Beas → Satluj → Chenab",
    viewportLabel: "Indus river system",
    caption: "The Beas joins the Satluj at Harike; the Satluj later joins the Chenab at Panjnad.",
    sourceFactIds: [beasJoin.factId, harike.factId, satlujJoin.factId, panjnad.factId],
    nodes: [
      { id: "beas", label: "Beas", x: 10, y: 25, role: "river", emphasis: "primary" },
      { id: "harike", label: "Harike", x: 32, y: 43, role: "confluence", emphasis: "primary" },
      { id: "satluj", label: "Satluj", x: 52, y: 55, role: "river", emphasis: "primary" },
      { id: "panjnad", label: "Panjnad", x: 72, y: 62, role: "confluence", emphasis: "primary" },
      { id: "chenab", label: "Chenab", x: 91, y: 69, role: "river", emphasis: "primary" },
    ],
    links: [
      { id: "beas-harike", from: "beas", to: "harike" },
      { id: "harike-satluj", from: "harike", to: "satluj" },
      { id: "satluj-panjnad", from: "satluj", to: "panjnad" },
      { id: "panjnad-chenab", from: "panjnad", to: "chenab" },
    ],
  });
}

function jhelumRaviChenabMap(): GeographyExplanationMapRenderV1 {
  const jhelumJoin = byId("geo-riv-001-cp002-jhelum-joins-chenab-trimmu");
  const trimmu = byId("geo-riv-001-cp002-jhelum-chenab-confluence-trimmu");
  const raviJoin = byId("geo-riv-001-cp002-ravi-joins-chenab");
  return schematic({
    mapId: "cp002-jhelum-ravi-chenab-chain",
    kind: "SYSTEM_CHAIN",
    title: "Jhelum and Ravi join the Chenab",
    viewportLabel: "Indus river system",
    caption: "The Jhelum joins the Chenab at Trimmu, while the Ravi also joins the Chenab before the downstream Panjnad stage.",
    sourceFactIds: [jhelumJoin.factId, trimmu.factId, raviJoin.factId],
    nodes: [
      { id: "jhelum", label: "Jhelum", x: 12, y: 20, role: "river", emphasis: "primary" },
      { id: "trimmu", label: "Trimmu", x: 43, y: 38, role: "confluence", emphasis: "primary" },
      { id: "ravi", label: "Ravi", x: 31, y: 78, role: "river", emphasis: "primary" },
      { id: "chenab", label: "Chenab", x: 86, y: 57, role: "river", emphasis: "primary" },
    ],
    links: [
      { id: "jhelum-trimmu", from: "jhelum", to: "trimmu" },
      { id: "trimmu-chenab", from: "trimmu", to: "chenab" },
      { id: "ravi-chenab", from: "ravi", to: "chenab" },
    ],
  });
}

function mapForConfluenceQuestion(question: GeoRiv001Cp002ReviewQuestion) {
  if (question.canonicalAnswer === "Chandra and Bhaga" || question.canonicalAnswer === "Tandi") {
    return chenabFormationMap();
  }
  if (question.canonicalAnswer === "Trimmu") {
    return twoRiverConfluence({
      mapId: "cp002-jhelum-chenab-trimmu",
      title: "Jhelum joins Chenab at Trimmu",
      tributary: "Jhelum",
      parent: "Chenab",
      place: "Trimmu",
      joinFactId: "geo-riv-001-cp002-jhelum-joins-chenab-trimmu",
      placeFactId: "geo-riv-001-cp002-jhelum-chenab-confluence-trimmu",
    });
  }
  if (question.canonicalAnswer === "Harike") {
    return twoRiverConfluence({
      mapId: "cp002-beas-satluj-harike",
      title: "Beas joins Satluj at Harike",
      tributary: "Beas",
      parent: "Satluj",
      place: "Harike",
      joinFactId: "geo-riv-001-cp002-beas-joins-satluj",
      placeFactId: "geo-riv-001-cp002-beas-satluj-confluence-harike",
    });
  }
  if (question.canonicalAnswer === "Panjnad") {
    return twoRiverConfluence({
      mapId: "cp002-satluj-chenab-panjnad",
      title: "Satluj joins Chenab at Panjnad",
      tributary: "Satluj",
      parent: "Chenab",
      place: "Panjnad",
      joinFactId: "geo-riv-001-cp002-satluj-joins-chenab-panjnad",
      placeFactId: "geo-riv-001-cp002-satluj-chenab-confluence-panjnad",
    });
  }
  return undefined;
}

function targetPairFact(question: GeoRiv001Cp002ReviewQuestion) {
  const entity = question.canonicalAnswer.split(" — ")[0]?.trim();
  if (!entity) return undefined;
  return question.sourceFactIds
    .map((id) => FACTS.find((fact) => fact.factId === id))
    .find((fact): fact is KnowledgeFact => Boolean(fact && fact.entity.label.en === entity && SOURCE_RELATIONS.has(fact.relation)));
}

export function buildGeoRiv001Cp002ExplanationMapV1(
  question: GeoRiv001Cp002ReviewQuestion,
): GeographyExplanationMapRenderV1 | undefined {
  if (question.qlId === "GEO-RIV-001-QL-010" || question.qlId === "GEO-RIV-001-QL-011") {
    const fact = question.sourceFactIds
      .map((id) => FACTS.find((entry) => entry.factId === id))
      .find((entry): entry is KnowledgeFact => Boolean(entry && SOURCE_RELATIONS.has(entry.relation)));
    return fact ? sourceMap(fact) : undefined;
  }

  if (question.qlId === "GEO-RIV-001-QL-012") {
    const fact = question.sourceFactIds
      .map((id) => FACTS.find((entry) => entry.factId === id))
      .find((entry): entry is KnowledgeFact => Boolean(entry && ["tributary_of", "headstream_of"].includes(entry.relation)));
    if (!fact) return undefined;
    return fact.relation === "headstream_of" ? chenabFormationMap() : tributaryMap(fact);
  }

  if (question.qlId === "GEO-RIV-001-QL-013") return mapForConfluenceQuestion(question);

  if (question.qlId === "GEO-RIV-001-QL-014" || question.qlId === "GEO-RIV-001-QL-015") {
    const fact = targetPairFact(question);
    return fact ? sourceMap(fact) : undefined;
  }

  if (question.qlId === "GEO-RIV-001-QL-016") {
    if (question.canonicalAnswer === "Jhelum and Ravi") return jhelumRaviChenabMap();
    if (["Satluj", "Chenab", "Beas → Satluj → Chenab"].includes(question.canonicalAnswer)) {
      return beasSatlujChenabChainMap();
    }
  }

  return undefined;
}

export function attachGeoRiv001Cp002ExplanationMapV1(question: GeoRiv001Cp002ReviewQuestion) {
  const explanationMap = buildGeoRiv001Cp002ExplanationMapV1(question);
  return explanationMap ? { ...question, explanationMap } : question;
}

export const GEO_RIV_001_CP002_EXPLANATION_MAP_PATTERN_EXAMPLES_V1 = Object.freeze({
  source: sourceMap(byId("geo-riv-001-cp002-jhelum-source-verinag")),
  tributary: tributaryMap(byId("geo-riv-001-cp002-lidder-jhelum")),
  confluence: chenabFormationMap(),
  course: geoRiv001Cp002JhelumCourseMapV1(),
  systemChain: beasSatlujChenabChainMap(),
});

export function auditGeoRiv001Cp002ExplanationMapV1(question: GeoRiv001Cp002ReviewQuestion) {
  const map = buildGeoRiv001Cp002ExplanationMapV1(question);
  if (!map) return { valid: true, mapped: false, issues: [] as string[] };
  const issues: string[] = [];
  if (!map.svg.includes("<svg") || !map.svg.includes("</svg>")) issues.push("INVALID_SVG");
  if (map.spec.geometryMode !== "SCHEMATIC" || map.spec.notToScale !== true) issues.push("UNSAFE_GEOMETRY_MODE");
  if (!map.spec.sourceFactIds.every((id) => FACTS.some((fact) => fact.factId === id))) issues.push("UNKNOWN_MAP_FACT");
  if (map.spec.nodes.length > 6) issues.push("TOO_MANY_LABELLED_NODES");
  return { valid: issues.length === 0, mapped: true, issues };
}
