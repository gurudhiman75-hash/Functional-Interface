import { spatialSceneSemanticFingerprint } from "./normalize";
import { validateSpatialFclCueAuditV2, validateSpatialPerceptualOptionUniquenessV2 } from "./gap-question-perceptual-v2";
import { SpatialSeededRandom } from "./seed";
import type { SpatialPoint, SpatialScene } from "./types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "./validator";

export type SpatialFclGeometricFormModeV1 = "CLOSED_VS_OPEN" | "POLYGON_VS_CURVED" | "EVEN_SIDED_POLYGON";

export interface SpatialFclGeometricFormQuestionV1 {
  version: "SPA-FND-001-FCL-GEOMETRIC-FORM-SAFE-V1";
  familyCode: "SPA-001";
  chapterCode: "FCL-001";
  proposalId: "FCL-PQL-03";
  seed: string;
  mode: SpatialFclGeometricFormModeV1;
  stemText: string;
  options: Array<{ scene: SpatialScene; visibleName: string; followsRule: boolean; sceneFingerprint: string }>;
  correctOptionIndex: 0 | 1 | 2 | 3;
  learnerExplanation: { observation: string; rule: string; application: string; check: string };
  reviewMetadata: { recommendedOptionPixels: 104; perceptualUniquenessCheck: "PASS"; ambiguityAudit: "PASS" };
  lifecycle: { permanentQlId: null; questionStudioDiscoverable: false; questionBankWritable: false; testEligible: false; publiclyPublishable: false };
}

const VIEW = { minX: 0, minY: 0, width: 100, height: 100 } as const;
const STYLE = { stroke: "#111111", strokeWidth: 2.6, fill: "none", lineJoin: "round" as const, lineCap: "round" as const };

function polygonPoints(sides: number, radius: number, rotationDeg: number, center = { x: 50, y: 50 }): SpatialPoint[] {
  return Array.from({ length: sides }, (_, index) => {
    const angle = (rotationDeg - 90 + (360 * index) / sides) * Math.PI / 180;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
}

function polygonScene(id: string, sides: number, radius: number, rotationDeg: number, name: string): SpatialScene {
  return { version: "1.0", id, viewBox: VIEW, nodes: [{ id: `${id}-shape`, kind: "polygon", points: polygonPoints(sides, radius, rotationDeg), role: "main-shape", style: STYLE }], metadata: { chapterCode: "FCL-001", semanticRole: name } };
}
function circleScene(id: string, radius: number): SpatialScene {
  return { version: "1.0", id, viewBox: VIEW, nodes: [{ id: `${id}-circle`, kind: "circle", center: { x: 50, y: 50 }, radius, role: "main-shape", style: STYLE }], metadata: { chapterCode: "FCL-001", semanticRole: "circle" } };
}
function rectangleScene(id: string, halfW: number, halfH: number, rotationDeg: number): SpatialScene {
  const base = [{x:-halfW,y:-halfH},{x:halfW,y:-halfH},{x:halfW,y:halfH},{x:-halfW,y:halfH}];
  const a = rotationDeg * Math.PI / 180;
  const points = base.map(({x,y}) => ({ x: 50 + x*Math.cos(a)-y*Math.sin(a), y: 50 + x*Math.sin(a)+y*Math.cos(a) }));
  return { version:"1.0", id, viewBox:VIEW, nodes:[{id:`${id}-rectangle`,kind:"polygon",points,role:"main-shape",style:STYLE}], metadata:{chapterCode:"FCL-001",semanticRole:"rectangle"} };
}
function openScene(id: string, kind: "U"|"V"|"L"|"Z", scale: number, rotationQuarter: number): SpatialScene {
  const templates: Record<string, SpatialPoint[]> = {
    U: [{x:32,y:30},{x:32,y:66},{x:68,y:66},{x:68,y:30}],
    V: [{x:30,y:30},{x:50,y:68},{x:70,y:30}],
    L: [{x:34,y:28},{x:34,y:68},{x:70,y:68}],
    Z: [{x:30,y:32},{x:70,y:32},{x:30,y:68},{x:70,y:68}],
  };
  const quarter = ((rotationQuarter % 4)+4)%4;
  const angle = quarter*Math.PI/2;
  const points = templates[kind]!.map((p) => {
    const x=(p.x-50)*scale, y=(p.y-50)*scale;
    return {x:50+x*Math.cos(angle)-y*Math.sin(angle),y:50+x*Math.sin(angle)+y*Math.cos(angle)};
  });
  return {version:"1.0",id,viewBox:VIEW,nodes:[{id:`${id}-open`,kind:"polyline",points,role:"main-shape",style:STYLE}],metadata:{chapterCode:"FCL-001",semanticRole:`open-${kind}`}};
}

function optionLetter(index: number): string { return String.fromCharCode(65 + index); }

export function generateSpatialFclGeometricFormQuestionV1(input: { seed: string; mode: SpatialFclGeometricFormModeV1; desiredCorrectOptionIndex?: 0|1|2|3 }): SpatialFclGeometricFormQuestionV1 {
  const rng = new SpatialSeededRandom(input.seed);
  const desired = input.desiredCorrectOptionIndex ?? (rng.int(0,3) as 0|1|2|3);
  const size = () => rng.int(25,34);
  const rot = () => rng.int(0,11)*15;
  let commons: Array<{scene:SpatialScene;visibleName:string}> = [];
  let odd: {scene:SpatialScene;visibleName:string};
  let rule: string;
  if (input.mode === "CLOSED_VS_OPEN") {
    const closedPool = rng.shuffle([
      {name:"triangle", build:(id:string)=>polygonScene(id,3,size(),rot(),"triangle")},
      {name:"square", build:(id:string)=>polygonScene(id,4,size(),rot(),"square")},
      {name:"pentagon", build:(id:string)=>polygonScene(id,5,size(),rot(),"pentagon")},
      {name:"hexagon", build:(id:string)=>polygonScene(id,6,size(),rot(),"hexagon")},
      {name:"circle", build:(id:string)=>circleScene(id,size())},
    ]).slice(0,3);
    commons = closedPool.map((item,index)=>({scene:item.build(`${input.seed}-closed-${index}`),visibleName:item.name}));
    const openKind = rng.pick(["U","V","L","Z"] as const);
    odd = {scene:openScene(`${input.seed}-odd-open`,openKind,rng.int(85,112)/100,rng.int(0,3)),visibleName:`open ${openKind}-shaped line`};
    rule = "form one closed shape";
  } else if (input.mode === "POLYGON_VS_CURVED") {
    const sidePool = rng.shuffle([3,4,5,6]).slice(0,3);
    commons = sidePool.map((sides,index)=>({scene:polygonScene(`${input.seed}-polygon-${index}`,sides,size(),rot(),`${sides}-sided polygon`),visibleName:sides===3?"triangle":sides===4?"quadrilateral":sides===5?"pentagon":"hexagon"}));
    odd = {scene:circleScene(`${input.seed}-odd-circle`,size()),visibleName:"circle"};
    rule = "are closed polygons made only of straight sides";
  } else {
    commons = [
      {scene:polygonScene(`${input.seed}-square`,4,size(),rot(),"square"),visibleName:"square"},
      {scene:rectangleScene(`${input.seed}-rectangle`,rng.int(23,31),rng.int(15,22),rot()),visibleName:"rectangle"},
      {scene:polygonScene(`${input.seed}-hexagon`,6,size(),rot(),"hexagon"),visibleName:"hexagon"},
    ];
    const oddSides = rng.pick([3,5] as const);
    odd = {scene:polygonScene(`${input.seed}-odd`,oddSides,size(),rot(),oddSides===3?"triangle":"pentagon"),visibleName:oddSides===3?"triangle":"pentagon"};
    rule = "are polygons with an even number of sides";
  }
  const commonOptions = commons.map((item)=>({...item,followsRule:true}));
  const audit = validateSpatialFclCueAuditV2({decisiveCue:"rule",cues:{rule:["common","common","common","odd"],fill:["outline","outline","outline","outline"],count:["one","one","one","one"]}});
  if(!audit.ok) throw new Error(`${input.seed}: geometric-form ambiguity audit failed: ${audit.errors.join(",")}`);
  const ordered = [...commonOptions];
  ordered.splice(desired,0,{...odd,followsRule:false});
  const options = ordered.map((item)=>({...item,sceneFingerprint:spatialSceneSemanticFingerprint(item.scene)}));
  for(const option of options){const validation=validateSpatialScene(option.scene);if(!validation.ok) throw new Error(`${input.seed}: invalid geometric-form option.`);}
  if(!validateSpatialOptionUniqueness(options.map((option)=>option.scene)).ok) throw new Error(`${input.seed}: semantic option collision.`);
  if(!validateSpatialPerceptualOptionUniquenessV2(options.map((option)=>option.scene)).ok) throw new Error(`${input.seed}: perceptual option collision.`);
  const application = options.map((option,index)=>`${optionLetter(index)}. ${option.visibleName}: ${option.followsRule?"follows":"does not follow"} the rule`).join("  ");
  return {
    version:"SPA-FND-001-FCL-GEOMETRIC-FORM-SAFE-V1",familyCode:"SPA-001",chapterCode:"FCL-001",proposalId:"FCL-PQL-03",seed:input.seed,mode:input.mode,
    stemText:"Select the figure that is different from the other three.",options,correctOptionIndex:desired,
    learnerExplanation:{observation:"Compare whether each complete figure has the same basic geometric form property.",rule:`Three figures ${rule}.`,application,check:`Only option ${optionLetter(desired)} breaks that visible geometric rule, so it is the odd figure.`},
    reviewMetadata:{recommendedOptionPixels:104,perceptualUniquenessCheck:"PASS",ambiguityAudit:"PASS"},
    lifecycle:{permanentQlId:null,questionStudioDiscoverable:false,questionBankWritable:false,testEligible:false,publiclyPublishable:false},
  };
}
