import type { MvpLabelPlan, MvpLabelPlanMap, MvpLabelPlacement, MvpLabelRole, MvpLabelSource } from "./mvp-diagram-label-core";

const A = (): MvpLabelSource => ({ kind: "ANSWER" });
const O = (objectId: string): MvpLabelSource => ({ kind: "OBJECT_HEIGHT", objectId });
const H = (fromPointId: string, toPointId: string): MvpLabelSource => ({ kind: "HORIZONTAL_DISTANCE", fromPointId, toPointId });
const M = (movementId: string): MvpLabelSource => ({ kind: "MOVEMENT_DISTANCE", movementId });
const E = (observerId: string): MvpLabelSource => ({ kind: "EYE_HEIGHT", observerId });
const P = (id: string, role: MvpLabelRole, fromPointId: string, toPointId: string, source: MvpLabelSource, placement: MvpLabelPlacement, symbol?: string): MvpLabelPlan => ({ id, role, fromPointId, toPointId, source, placement, ...(symbol ? { symbol } : {}) });

export const TRG_002_MVP_ADDED_LABEL_PLANS: MvpLabelPlanMap = {
  "TRG-002-QL-002": [P("given-horizontal","GIVEN","object-base","observer-ground",H("object-base","observer-ground"),"BELOW","d"), P("target-height","TARGET_SOLVED","object-base","object-top",A(),"RIGHT","h")],
  "TRG-002-QL-005": [P("given-horizontal","GIVEN","object-base","observer-ground",H("object-base","observer-ground"),"BELOW","d"), P("target-height","TARGET_SOLVED","object-base","object-top",A(),"RIGHT","h")],
  "TRG-002-QL-009": [P("given-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("target-horizontal","TARGET_SOLVED","object-base","observer-ground",A(),"BELOW","d")],
  "TRG-002-QL-014": [P("given-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("given-horizontal","GIVEN","object-base","observer-ground",H("object-base","observer-ground"),"BELOW","d")],
  "TRG-002-QL-018": [P("given-observer-height","GIVEN","observer-base","observer-top",O("observer-building"),"LEFT"), P("given-horizontal","GIVEN","observer-base","target-base",H("observer-base","target-base"),"BELOW"), P("target-height","TARGET_SOLVED","target-base","target-top",A(),"RIGHT","h")],
  "TRG-002-QL-020": [P("given-eye-level","EYE_HEIGHT","observer-ground","observer-eye",E("observer-1"),"LEFT"), P("target-horizontal","TARGET_SOLVED","observer-ground","target-ground",A(),"BELOW","d")],
  "TRG-002-QL-024": [P("given-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("target-sloping","TARGET_SOLVED","observer-eye","object-top",A(),"ABOVE","L")],

  "TRG-002-QL-028": [P("given-shadow","GIVEN","object-base","shadow-tip",H("object-base","shadow-tip"),"BELOW","s"), P("target-height","TARGET_SOLVED","object-base","object-top",A(),"RIGHT","h")],
  "TRG-002-QL-032": [P("given-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("target-shadow","TARGET_SOLVED","object-base","shadow-tip",A(),"BELOW","s")],
  "TRG-002-QL-035": [P("given-old-shadow","GIVEN","object-base","shadow-tip-old",H("object-base","shadow-tip-old"),"BELOW","s₁"), P("target-new-shadow","TARGET_SOLVED","object-base","shadow-tip-new",A(),"ABOVE","s₂")],
  "TRG-002-QL-038": [P("target-foot-distance","TARGET_SOLVED","wall-base","ladder-base",A(),"BELOW","d")],
  "TRG-002-QL-041": [P("given-stump","GIVEN","tree-base","break-point",O("stump"),"LEFT","h"), P("target-fallen-part","TARGET_SOLVED","touch-point","break-point",A(),"ABOVE","L")],
  "TRG-002-QL-043": [P("given-stump","GIVEN","tree-base","break-point",O("stump"),"LEFT","h"), P("target-touch-distance","TARGET_SOLVED","tree-base","touch-point",A(),"BELOW","d")],
  "TRG-002-QL-048": [P("given-mast-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("target-anchor-distance","TARGET_SOLVED","object-base","observer-ground",A(),"BELOW","d")],

  "TRG-002-QL-052": [P("given-separation","GIVEN","near-ground","far-ground",H("near-ground","far-ground"),"BELOW","AB"), P("target-near-distance","TARGET_SOLVED","object-base","near-ground",A(),"ABOVE","x")],
  "TRG-002-QL-055": [P("given-separation","GIVEN","near-ground","far-ground",H("near-ground","far-ground"),"BELOW","AB"), P("target-far-distance","TARGET_SOLVED","object-base","far-ground",A(),"BELOW","x")],
  "TRG-002-QL-058": [P("given-movement","MOVEMENT","far-ground","near-ground",M("movement-1"),"ABOVE","m"), P("target-height","TARGET_SOLVED","object-base","object-top",A(),"RIGHT","h")],
  "TRG-002-QL-064": [P("given-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","h"), P("target-movement","TARGET_SOLVED","near-ground","far-ground",A(),"ABOVE","m")],
  "TRG-002-QL-067": [P("given-near-distance","GIVEN","object-base","near-ground",H("object-base","near-ground"),"ABOVE","x₁"), P("target-far-distance","TARGET_SOLVED","object-base","far-ground",A(),"BELOW","x₂")],
  "TRG-002-QL-069": [P("given-original-distance","GIVEN","object-base","far-ground",H("object-base","far-ground"),"BELOW","x"), P("target-movement","TARGET_SOLVED","far-ground","near-ground",A(),"ABOVE","m")],
  "TRG-002-QL-071": [P("given-near-height","GIVEN","near-base","near-top",O("near-tower"),"LEFT","h₁"), P("given-far-height","GIVEN","far-base","far-top",O("far-tower"),"RIGHT","h₂"), P("target-separation","TARGET_SOLVED","near-base","far-base",A(),"BELOW","d")],

  "TRG-002-QL-076": [P("given-eye-height","EYE_HEIGHT","observer-ground","observer-eye",E("observer-1"),"LEFT","e"), P("given-building-height","GIVEN","object-base","object-top",O("object-1"),"RIGHT","H"), P("target-horizontal","TARGET_SOLVED","object-base","observer-ground",A(),"BELOW","d")],
  "TRG-002-QL-081": [P("given-separation","GIVEN","left-ground","right-ground",H("left-ground","right-ground"),"BELOW","AB"), P("target-height","TARGET_SOLVED","object-base","object-top",A(),"RIGHT","h")],
  "TRG-002-QL-086": [P("given-first-height","GIVEN","first-base","first-top",O("building-1"),"LEFT","h₁"), P("given-second-height","GIVEN","second-base","second-top",O("building-2"),"RIGHT","h₂"), P("target-horizontal","TARGET_SOLVED","first-base","second-base",A(),"BELOW","d")],
  "TRG-002-QL-091": [P("given-observer-height","GIVEN","observer-base","observer-top",O("observer-building"),"LEFT","h₁"), P("target-tower-height","TARGET_SOLVED","target-base","target-top",A(),"RIGHT","h₂")],
  "TRG-002-QL-094": [P("given-tower-height","GIVEN","tower-base","tower-top",O("bank-tower"),"RIGHT","h"), P("target-width","TARGET_SOLVED","tower-base","opposite-bank",A(),"BELOW","w")],
  "TRG-002-QL-095": [P("given-horizontal","GIVEN","base","observer",H("base","observer"),"BELOW","d"), P("target-upper-height","TARGET_SOLVED","roof","upper-top",A(),"RIGHT","h")],
  "TRG-002-QL-096": [P("given-upper-height","GIVEN","roof","upper-top",O("upper-mast"),"RIGHT","h"), P("target-horizontal","TARGET_SOLVED","base","observer",A(),"BELOW","d")],
};
