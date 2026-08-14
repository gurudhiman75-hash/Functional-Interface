import { mkdirSync, writeFileSync } from "node:fs";
import { buildSpatialFan001ProofCorpus } from "../proofs/spa-fnd-001-fan-001-corpus";
import { buildSpatialFcl001ProofCorpus } from "../proofs/spa-fnd-001-fcl-001-corpus";
import { generateFigureAnalogyProofQuestion } from "../foundation/spatial/analogy-proof-generator";
import { generateFigureClassificationProofQuestion } from "../foundation/spatial/classification-proof-generator";
import { generateClockProofQuestion } from "../foundation/spatial/clock-proof-generator";
import { generateSpatialFanArbitraryAngleQuestionV1 } from "../foundation/spatial/fan-arbitrary-angle-v1";
import { generateSpatialGapLearnerQuestionV1 } from "../foundation/spatial/gap-question-generator-v1";
import { spatialPerceptualSignatureV2, validateLearnerVisibleExplanationV2, validateSpatialPerceptualOptionUniquenessV2 } from "../foundation/spatial/gap-question-perceptual-v2";
import { generateGlyphStringProofQuestion } from "../foundation/spatial/glyph-string-proof-generator";
import { synthesizeSpatialFclAttemptV1, synthesizeSpatialFsrAttemptV1 } from "../foundation/spatial/production-synthesis-v1";
import { renderSpatialSceneToSvg } from "../foundation/spatial/svg-renderer";
import { generateSpatialTransformProofQuestion } from "../foundation/spatial/transform-proof-generator";
import type { SpatialAnalogyFigureState, SpatialScene } from "../foundation/spatial/types";
import { validateSpatialOptionUniqueness, validateSpatialScene } from "../foundation/spatial/validator";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function letter(index: number): string { return String.fromCharCode(65 + index); }
function esc(value: string): string { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }

type Chapter = "MIR-001" | "WAT-001" | "FAN-001" | "FCL-001" | "FSR-001";
interface Explanation { observation: string; rule: string; application: string; check: string }
interface ReviewQuestion {
  proposalId: string;
  proposalName: string;
  chapterCode: Chapter;
  sampleMode: string;
  seed: string;
  stemText: string;
  stimulusScenes: SpatialScene[];
  options: Array<{ scene: SpatialScene }>;
  correctOptionIndex: number;
  learnerExplanation: Explanation;
  recommendedOptionPixels: number;
  lifecycle: { permanentQlId: null; questionStudioDiscoverable: false; questionBankWritable: false; testEligible: false; publiclyPublishable: false };
}

const PQLS: ReadonlyArray<[string, Chapter, string]> = [
  ["MIR-PQL-01","MIR-001","General figure or symbol mirror image"],
  ["MIR-PQL-02","MIR-001","Alphanumeric vector-string mirror image"],
  ["MIR-PQL-03","MIR-001","Analog clock mirror diagram"],
  ["WAT-PQL-01","WAT-001","General figure or symbol water image"],
  ["WAT-PQL-02","WAT-001","Alphanumeric vector-string water image"],
  ["FAN-PQL-01","FAN-001","Whole-figure rigid transformation analogy"],
  ["FAN-PQL-02","FAN-001","Independent component transformation analogy"],
  ["FAN-PQL-03","FAN-001","Component movement or cyclic permutation analogy"],
  ["FAN-PQL-04","FAN-001","Element count change analogy"],
  ["FAN-PQL-05","FAN-001","Shape or symbol substitution analogy"],
  ["FAN-PQL-06","FAN-001","Nesting, size and containment-state analogy"],
  ["FAN-PQL-07","FAN-001","Shading or visual-state analogy"],
  ["FAN-PQL-08","FAN-001","Compound multi-operation analogy"],
  ["FCL-PQL-01","FCL-001","Transform-equivalence classification"],
  ["FCL-PQL-02","FCL-001","Symmetry-property classification"],
  ["FCL-PQL-03","FCL-001","Geometric form and closure classification"],
  ["FCL-PQL-04","FCL-001","Count-relation classification"],
  ["FCL-PQL-05","FCL-001","Nested, replica and relative-size relation classification"],
  ["FCL-PQL-06","FCL-001","Relative-position and orientation relation classification"],
  ["FCL-PQL-07","FCL-001","Topology and connectivity classification"],
  ["FCL-PQL-08","FCL-001","Shading, fill and partition-state classification"],
  ["FCL-PQL-09","FCL-001","Intra-option mirror, water or rotation relation classification"],
  ["FSR-PQL-01","FSR-001","Whole-figure transformation series"],
  ["FSR-PQL-02","FSR-001","Independent component transformation series"],
  ["FSR-PQL-03","FSR-001","Positional movement and cyclic permutation series"],
  ["FSR-PQL-04","FSR-001","Count, addition and removal progression"],
  ["FSR-PQL-05","FSR-001","Shading and fill progression"],
  ["FSR-PQL-06","FSR-001","Substitution and replacement progression"],
  ["FSR-PQL-07","FSR-001","Alternating-operation series"],
  ["FSR-PQL-08","FSR-001","Compound multi-rule series"],
] as const;
const PQL_META = new Map(PQLS.map(([id, chapter, name]) => [id, { chapter, name }] as const));
const LOCK = { permanentQlId: null, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false } as const;

function pqlMeta(id: string) { const found = PQL_META.get(id); if (!found) throw new Error(`Unknown PQL ${id}`); return found; }
function adaptTransform(proposalId: string, sampleMode: string, q: ReturnType<typeof generateSpatialTransformProofQuestion>, explanationOverride?: Explanation): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed: q.seed, stemText: meta.chapter === "MIR-001" ? "Choose the exact mirror image of the given figure." : "Choose the exact water image of the given figure.", stimulusScenes: [q.sourceScene], options: q.options.map((option) => ({ scene: option.scene })), correctOptionIndex: q.correctOptionIndex, learnerExplanation: explanationOverride ?? q.learnerExplanation, recommendedOptionPixels: Math.max(104, q.reviewMetadata.recommendedOptionPixels ?? 150), lifecycle: LOCK };
}
function adaptGap(proposalId: string, sampleMode: string, q: ReturnType<typeof generateSpatialGapLearnerQuestionV1>): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed: q.seed, stemText: q.stemText, stimulusScenes: q.stimulusScenes, options: q.options.map((option) => ({ scene: option.scene })), correctOptionIndex: q.correctOptionIndex, learnerExplanation: q.learnerExplanation, recommendedOptionPixels: Math.max(104, q.reviewMetadata.recommendedOptionPixels), lifecycle: LOCK };
}
function adaptFanProof(proposalId: string, sampleMode: string, q: ReturnType<typeof generateFigureAnalogyProofQuestion>): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed: q.seed, stemText: "Choose the figure that completes A : B :: C : ?", stimulusScenes: [q.aScene, q.bScene, q.cScene], options: q.options.map((option) => ({ scene: option.scene })), correctOptionIndex: q.correctOptionIndex, learnerExplanation: q.learnerExplanation, recommendedOptionPixels: Math.max(104, q.reviewMetadata.recommendedOptionPixels), lifecycle: LOCK };
}
function adaptFclProof(proposalId: string, sampleMode: string, q: ReturnType<typeof generateFigureClassificationProofQuestion>): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed: q.seed, stemText: "Select the figure that is different from the other three.", stimulusScenes: [], options: q.options.map((option) => ({ scene: option.scene })), correctOptionIndex: q.correctOptionIndex, learnerExplanation: q.learnerExplanation, recommendedOptionPixels: Math.max(104, q.reviewMetadata.recommendedOptionPixels), lifecycle: LOCK };
}
function adaptAngle(proposalId: string, sampleMode: string, q: ReturnType<typeof generateSpatialFanArbitraryAngleQuestionV1>): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed: q.seed, stemText: q.stemText, stimulusScenes: [...q.stimulusScenes], options: q.options.map((option) => ({ scene: option.scene })), correctOptionIndex: q.correctOptionIndex, learnerExplanation: q.learnerExplanation, recommendedOptionPixels: q.reviewMetadata.recommendedOptionPixels, lifecycle: LOCK };
}
function adaptPrimitiveFcl(proposalId: string, sampleMode: string, seed: string, payload: any): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed, stemText: "Select the figure that is different from the other three.", stimulusScenes: [], options: payload.optionScenes.map((scene: SpatialScene) => ({ scene })), correctOptionIndex: payload.correctOptionIndex, learnerExplanation: payload.learnerExplanation, recommendedOptionPixels: 128, lifecycle: LOCK };
}
function adaptSeries(proposalId: string, sampleMode: string, seed: string, payload: any): ReviewQuestion {
  const meta = pqlMeta(proposalId);
  return { proposalId, proposalName: meta.name, chapterCode: meta.chapter, sampleMode, seed, stemText: "Study the figure series and choose the next figure.", stimulusScenes: [...payload.seriesScenes], options: payload.options.map((option: any) => ({ scene: option.scene })), correctOptionIndex: payload.correctOptionIndex, learnerExplanation: payload.learnerExplanation, recommendedOptionPixels: 128, lifecycle: LOCK };
}

const MARKERS = ["TOP_LEFT","TOP_RIGHT","BOTTOM_RIGHT","BOTTOM_LEFT"] as const;
const DIRECTIONS = ["UP","RIGHT","DOWN","LEFT"] as const;
const ANCHORS = ["TOP","RIGHT","BOTTOM","LEFT"] as const;
function rotateState(state: SpatialAnalogyFigureState, quarter: number): SpatialAnalogyFigureState {
  const q = ((quarter % 4) + 4) % 4;
  return { ...state, outerRotationQuarter: ((state.outerRotationQuarter + q) % 4) as any, innerRotationQuarter: ((state.innerRotationQuarter + q) % 4) as any, markerPosition: MARKERS[(MARKERS.indexOf(state.markerPosition) + q) % 4]!, direction: DIRECTIONS[(DIRECTIONS.indexOf(state.direction) + q) % 4]!, segmentAnchor: ANCHORS[(ANCHORS.indexOf(state.segmentAnchor) + q) % 4]! };
}
const FAN_CORPUS = buildSpatialFan001ProofCorpus();
function fanCorpusRule(ruleId: string) { const q = FAN_CORPUS.find((item) => item.ruleId === ruleId); if (!q) throw new Error(`Missing FAN corpus rule ${ruleId}`); return q; }
function fanLegacyVariant(ruleId: string, variant: number) {
  const base = fanCorpusRule(ruleId);
  const distractors = base.options.filter((option) => option.label !== "CORRECT_RULE_APPLICATION").map((option) => ({ ruleId: option.appliedRuleId, label: option.label })) as any;
  return generateFigureAnalogyProofQuestion({ seed: `PQL-COVERAGE:${ruleId}:V${variant}`, prototypeId: `PQL-COVERAGE-${ruleId}-${variant}`, ruleId: base.ruleId, aState: rotateState(base.aState, variant), cState: rotateState(base.cState, variant), distractors });
}
const FCL_CORPUS = buildSpatialFcl001ProofCorpus();
function fclCorpusProperty(propertyId: string) { const q = FCL_CORPUS.find((item) => item.propertyId === propertyId); if (!q) throw new Error(`Missing FCL corpus property ${propertyId}`); return q; }
function fclLegacyVariant(propertyId: string, variant: number) {
  const base = fclCorpusProperty(propertyId);
  return generateFigureClassificationProofQuestion({ seed: `PQL-COVERAGE:${propertyId}:V${variant}`, prototypeId: `PQL-COVERAGE-${propertyId}-${variant}`, propertyId: base.propertyId, presentationProfile: base.presentationProfile, expectedOddIndex: base.correctOptionIndex as 0|1|2|3, states: base.options.map((option) => rotateState(option.state, variant)) as any });
}
function primitiveFcl(proposalId: string, propertyId: any, sampleIndex: number): ReviewQuestion {
  for (let attemptIndex = 0; attemptIndex < 300; attemptIndex += 1) {
    const seed = `PQL-COVERAGE:${proposalId}:${propertyId}:S${sampleIndex}:A${attemptIndex}`;
    const attempt = synthesizeSpatialFclAttemptV1({ seed, familyId: propertyId, desiredCorrectOptionIndex: sampleIndex % 4, attemptIndex });
    if (attempt.status === "ACCEPTED" && "optionScenes" in attempt.candidate.payload) return adaptPrimitiveFcl(proposalId, propertyId, seed, attempt.candidate.payload);
  }
  throw new Error(`${proposalId}/${propertyId}: unable to synthesize primitive FCL sample.`);
}
function compoundSeries(proposalId: string, ruleId: any, sampleIndex: number): ReviewQuestion {
  for (let attemptIndex = 0; attemptIndex < 300; attemptIndex += 1) {
    const seed = `PQL-COVERAGE:${proposalId}:${ruleId}:S${sampleIndex}:A${attemptIndex}`;
    const attempt = synthesizeSpatialFsrAttemptV1({ seed, familyId: ruleId, desiredCorrectOptionIndex: sampleIndex % 4, attemptIndex });
    if (attempt.status === "ACCEPTED" && "seriesScenes" in attempt.candidate.payload) return adaptSeries(proposalId, ruleId, seed, attempt.candidate.payload);
  }
  throw new Error(`${proposalId}/${ruleId}: unable to synthesize compound FSR sample.`);
}
function gap(proposalId: string, gapId: any, sampleIndex: number): ReviewQuestion {
  const seed = `PQL-COVERAGE:${proposalId}:${gapId}:S${sampleIndex}`;
  return adaptGap(proposalId, gapId, generateSpatialGapLearnerQuestionV1({ gapId, seed, desiredCorrectOptionIndex: (sampleIndex % 4) as 0|1|2|3 }));
}

const LATIN = [["LATIN-F","LATIN-R"],["LATIN-L","LATIN-Q","LATIN-F"]] as const;
const DIGITS = [["DIGIT-2","DIGIT-4","DIGIT-7"],["DIGIT-5","DIGIT-2","DIGIT-4","DIGIT-7"]] as const;
const CLOCK_TIMES = [{hour:1,minute:20},{hour:2,minute:35},{hour:4,minute:10},{hour:7,minute:25}] as const;
function makeSample(proposalId: string, i: number): ReviewQuestion {
  const seed = `PQL-COVERAGE:${proposalId}:S${i}`;
  switch (proposalId) {
    case "MIR-PQL-01": return adaptTransform(proposalId,"general-composition",generateSpatialTransformProofQuestion({seed,chapterCode:"MIR-001",prototypeId:`${proposalId}-${i}`,requestedTransform:"REFLECT_VERTICAL",instructionKey:"MIR_SELECT_EXACT_MIRROR"}));
    case "WAT-PQL-01": return adaptTransform(proposalId,"general-composition",generateSpatialTransformProofQuestion({seed,chapterCode:"WAT-001",prototypeId:`${proposalId}-${i}`,requestedTransform:"REFLECT_HORIZONTAL",instructionKey:"WAT_SELECT_EXACT_WATER"}));
    case "MIR-PQL-02":
    case "WAT-PQL-02": {
      const isMirror = proposalId.startsWith("MIR"); const glyphIds = i % 2 === 0 ? LATIN[(i/2)%2]! : DIGITS[Math.floor(i/2)%2]!; const stimulusKind = i % 2 === 0 ? "LATIN_GLYPH_STRING" : "WESTERN_ARABIC_DIGIT_STRING";
      return adaptTransform(proposalId, stimulusKind, generateGlyphStringProofQuestion({seed,chapterCode:isMirror?"MIR-001":"WAT-001",prototypeId:`${proposalId}-${i}`,requestedTransform:isMirror?"REFLECT_VERTICAL":"REFLECT_HORIZONTAL",instructionKey:isMirror?"MIR_SELECT_STRING":"WAT_SELECT_STRING",glyphIds,stimulusKind}));
    }
    case "MIR-PQL-03": {
      const q = generateClockProofQuestion({seed,chapterCode:"MIR-001",prototypeId:`${proposalId}-${i}`,requestedTransform:"REFLECT_VERTICAL",instructionKey:"MIR_SELECT_CLOCK_DIAGRAM",time:CLOCK_TIMES[i]!});
      const explanation: Explanation = { observation:"Treat the clock as a figure. A vertical mirror keeps the 12–6 axis fixed while moving both visible hands to the opposite left-right positions.", rule:"Reflect the complete dial-and-hand geometry across the vertical axis. Do not solve this diagram-selection question by subtracting clock times.", application:"Track the minute-hand direction and the hour-hand direction separately, reflect each across the vertical centre line, and keep their distances from the centre unchanged.", check:`Option ${letter(q.correctOptionIndex)} alone places both hands at their geometrically reflected positions.` };
      return adaptTransform(proposalId,"analog-clock-geometry",q,explanation);
    }
    case "FAN-PQL-01": { const angles = [45,-45,135,-135] as const; return adaptAngle(proposalId,`${angles[i]}-degree-whole-rotation`,generateSpatialFanArbitraryAngleQuestionV1({seed,angleDeg:angles[i],desiredCorrectOptionIndex:(i%4) as 0|1|2|3})); }
    case "FAN-PQL-02": return gap(proposalId,"FAN-GAP-01",i);
    case "FAN-PQL-03": return i < 2 ? gap(proposalId,"FAN-GAP-02",i) : adaptFanProof(proposalId,"legacy-single-marker-cycle",fanLegacyVariant("MOVE_MARKER_CLOCKWISE",i));
    case "FAN-PQL-04": return adaptFanProof(proposalId,i%2===0?"add-element":"remove-element",fanLegacyVariant(i%2===0?"ADD_SEGMENT":"REMOVE_SEGMENT",i));
    case "FAN-PQL-05": return adaptFanProof(proposalId,"substitution-cycle",fanLegacyVariant("SUBSTITUTE_INNER_NEXT",i));
    case "FAN-PQL-06": return i===0?gap(proposalId,"FAN-GAP-03",i):i===1?gap(proposalId,"FAN-GAP-04",i):adaptFanProof(proposalId,"inner-outer-exchange",fanLegacyVariant("SWAP_INNER_OUTER",i));
    case "FAN-PQL-07": return adaptFanProof(proposalId,"shading-toggle",fanLegacyVariant("TOGGLE_INNER_SHADING",i));
    case "FAN-PQL-08": return i<2?gap(proposalId,"FAN-GAP-05",i):adaptFanProof(proposalId,"rotation-plus-shading",fanLegacyVariant("COMPOUND_ROTATE_90_CW_TOGGLE_SHADING",i));
    case "FCL-PQL-01": return gap(proposalId,"FCL-GAP-01",i);
    case "FCL-PQL-02": return primitiveFcl(proposalId,["VERTICAL_SYMMETRY","HORIZONTAL_SYMMETRY","HALF_TURN_SYMMETRY","QUARTER_TURN_SYMMETRY"][i]!,i);
    case "FCL-PQL-03": return primitiveFcl(proposalId,["EVEN_SIDED_POLYGON","CLOSED_SHAPE","POLYGON","CLOSED_SHAPE"][i]!,i);
    case "FCL-PQL-04": return i<2?gap(proposalId,"FCL-GAP-02",i):adaptFclProof(proposalId,i===2?"inner-side-count-relation":"outer-side-count-relation",fclLegacyVariant(i===2?"SEGMENT_MATCHES_INNER_SIDES_MINUS_ONE":"SEGMENT_MATCHES_OUTER_SIDES_MINUS_ONE",i));
    case "FCL-PQL-05": return gap(proposalId,"FCL-GAP-03",i);
    case "FCL-PQL-06": return i<2?gap(proposalId,"FCL-GAP-04",i):adaptFclProof(proposalId,i===2?"marker-arrow-side":"arrow-dot-side",fclLegacyVariant(i===2?"MARKER_ON_ARROW_SIDE":"ARROW_POINTS_TO_SEGMENT_ANCHOR",i));
    case "FCL-PQL-07": return primitiveFcl(proposalId,["HAS_BRANCH_JUNCTION","HAS_TRUE_CROSSING","TWO_FREE_TERMINALS","HAS_BRANCH_JUNCTION"][i]!,i);
    case "FCL-PQL-08": return i<2?gap(proposalId,"FCL-GAP-05",i):primitiveFcl(proposalId,"PARTITIONED_FIGURE",i);
    case "FCL-PQL-09": return gap(proposalId,"FCL-GAP-06",i);
    case "FSR-PQL-01": return gap(proposalId,"FSR-GAP-01",i);
    case "FSR-PQL-02": return gap(proposalId,"FSR-GAP-02",i);
    case "FSR-PQL-03": return gap(proposalId,i<2?"FSR-GAP-03":"FSR-GAP-07",i);
    case "FSR-PQL-04": return gap(proposalId,"FSR-GAP-04",i);
    case "FSR-PQL-05": return gap(proposalId,"FSR-GAP-05",i);
    case "FSR-PQL-06": return gap(proposalId,"FSR-GAP-06",i);
    case "FSR-PQL-07": return gap(proposalId,"FSR-GAP-08",i);
    case "FSR-PQL-08": return compoundSeries(proposalId,i%2===0?"ROTATE_90_CW_MOVE_MARKER_CCW":"ROTATE_90_CCW_MOVE_DOTS_CW",i);
    default: throw new Error(`No sample factory for ${proposalId}`);
  }
}

const questions: ReviewQuestion[] = [];
for (const [proposalId] of PQLS) for (let i=0;i<4;i+=1) questions.push(makeSample(proposalId,i));
assert(PQLS.length===30,`Expected 30 PQLs, got ${PQLS.length}.`);
assert(questions.length===120,`Expected 120 review questions, got ${questions.length}.`);
assert(!questions.some((q)=>q.proposalId.includes("HOLD")),"Held PQL leaked into active review.");
assert(!questions.some((q)=>q.chapterCode==="WAT-001"&&q.sampleMode.includes("clock")),"Held WAT clock leaked into active review.");

const perceptualQuestionKeys = new Map<string,Set<string>>();
for (const q of questions) {
  assert(q.options.length===4,`${q.proposalId}/${q.seed}: expected four options.`);
  assert(q.recommendedOptionPixels>=104,`${q.proposalId}/${q.seed}: mobile option floor below 104px.`);
  assert(q.lifecycle.permanentQlId===null&&!q.lifecycle.questionStudioDiscoverable&&!q.lifecycle.questionBankWritable&&!q.lifecycle.testEligible&&!q.lifecycle.publiclyPublishable,`${q.proposalId}/${q.seed}: lifecycle lock leaked.`);
  const scenes=[...q.stimulusScenes,...q.options.map((o)=>o.scene)];
  for(const scene of scenes){const valid=validateSpatialScene(scene);assert(valid.ok,`${q.proposalId}/${q.seed}: invalid scene ${scene.id}.`);}
  assert(validateSpatialOptionUniqueness(q.options.map((o)=>o.scene)).ok,`${q.proposalId}/${q.seed}: semantic option collision.`);
  assert(validateSpatialPerceptualOptionUniquenessV2(q.options.map((o)=>o.scene)).ok,`${q.proposalId}/${q.seed}: perceptual option collision.`);
  const explanationGate=validateLearnerVisibleExplanationV2([q.learnerExplanation.observation,q.learnerExplanation.rule,q.learnerExplanation.application,q.learnerExplanation.check]);
  assert(explanationGate.ok,`${q.proposalId}/${q.seed}: learner explanation gate failed: ${explanationGate.errors.join(",")}.`);
  if(q.proposalId==="MIR-PQL-03"){
    const text=Object.values(q.learnerExplanation).join(" ");
    assert(!/12:00|11:60|subtract|minus|−/i.test(text),`${q.seed}: numeric mirror-time shortcut leaked into MIR clock learner explanation.`);
  }
  const key=JSON.stringify({stimulus:q.stimulusScenes.map(spatialPerceptualSignatureV2),options:q.options.map((o)=>spatialPerceptualSignatureV2(o.scene)).sort(),correct:spatialPerceptualSignatureV2(q.options[q.correctOptionIndex]!.scene)});
  const set=perceptualQuestionKeys.get(q.proposalId)??new Set<string>(); set.add(key); perceptualQuestionKeys.set(q.proposalId,set);
}
for(const [proposalId] of PQLS) assert(perceptualQuestionKeys.get(proposalId)?.size===4,`${proposalId}: four review samples are not perceptually distinct.`);
assert(questions.filter((q)=>q.proposalId==="FAN-PQL-01").some((q)=>q.sampleMode.includes("45-degree")),"FAN 45° parameter missing.");
assert(questions.filter((q)=>q.proposalId==="FAN-PQL-01").some((q)=>q.sampleMode.includes("135-degree")),"FAN 135° parameter missing.");

const chapterCounts = questions.reduce<Record<string,number>>((acc,q)=>{acc[q.chapterCode]=(acc[q.chapterCode]??0)+1;return acc;},{});
const review = { version:"SPA-FND-001-PROPOSED-QL-COVERAGE-REVIEW-V1", activeProposedQls:PQLS.length, questionsPerPql:4, totalQuestions:questions.length, chapterCounts, holdsExcluded:["WAT-HOLD-P01","FCL-HOLD-P01"], lifecycle:{...LOCK,englishHumanFreeze:false}, pqls:PQLS.map(([proposalId,chapterCode,name])=>({proposalId,chapterCode,name,questions:questions.filter((q)=>q.proposalId===proposalId).map((q)=>({sampleMode:q.sampleMode,seed:q.seed,stemText:q.stemText,correctOption:letter(q.correctOptionIndex),learnerExplanation:q.learnerExplanation,stimulusSvgs:q.stimulusScenes.map(renderSpatialSceneToSvg),optionSvgs:q.options.map((o)=>renderSpatialSceneToSvg(o.scene))}))})) };
function strip(svgs:string[],prefix:string){return `<div class="strip">${svgs.map((svg,i)=>`<div class="figure"><div class="cap">${prefix} ${i+1}</div>${svg}</div>`).join("")}</div>`;}
const sections=review.pqls.map((pql)=>`<section class="pql"><h2>${esc(pql.proposalId)} — ${esc(pql.name)}</h2><div class="qlmeta">${esc(pql.chapterCode)} · 4 learner-review questions</div>${pql.questions.map((q,i)=>`<article class="card"><h3>${i+1}. ${esc(q.sampleMode)}</h3><p><strong>Stem:</strong> ${esc(q.stemText)}</p>${q.stimulusSvgs.length?`<h4>Stimulus</h4>${strip(q.stimulusSvgs,"Figure")}`:""}<h4>Options</h4>${strip(q.optionSvgs,"Option")}<p class="answer"><strong>Answer:</strong> ${q.correctOption}</p><div class="ex"><p><strong>Observe:</strong> ${esc(q.learnerExplanation.observation)}</p><p><strong>Rule:</strong> ${esc(q.learnerExplanation.rule)}</p><p><strong>Apply:</strong> ${esc(q.learnerExplanation.application)}</p><p><strong>Check:</strong> ${esc(q.learnerExplanation.check)}</p></div></article>`).join("")}</section>`).join("");
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spatial 30-PQL Final Review</title><style>body{font-family:Arial,sans-serif;background:#f3f4f6;color:#171717;margin:0}main{max-width:1220px;margin:auto;padding:24px}.summary,.pql{background:#fff;border:1px solid #ddd;border-radius:12px;padding:18px;margin-bottom:22px}.qlmeta{color:#666;font-size:13px;margin-bottom:12px}.card{border-top:1px solid #e5e7eb;padding:16px 0}.strip{display:flex;flex-wrap:wrap;gap:12px}.figure{width:128px;border:1px solid #ddd;border-radius:8px;padding:6px;text-align:center;background:white}.figure svg{width:100%;height:auto;display:block}.cap{font-size:11px;color:#666}.ex{background:#fafafa;border-left:3px solid #aaa;padding:8px 12px}.ex p{margin:6px 0}.answer{font-size:14px}@media(max-width:520px){main{padding:9px}.summary,.pql{padding:11px}.figure{width:104px}.ex{font-size:13px}}</style></head><body><main><div class="summary"><h1>Spatial Proposed QL Coverage Review V1</h1><p><strong>30 active proposed QLs · 120 learner questions · 4 per PQL.</strong></p><p>Organized by learner curriculum rather than technical gap IDs. WAT clock and FCL identity-set holds are excluded. Permanent QLs remain 0 and human English/mobile freeze remains pending.</p></div>${sections}</main></body></html>`;
const evidence={status:"PASS_SPA_FND_001_PROPOSED_QL_REVIEW_COVERAGE_V1",coverage:{activeProposedQls:30,questionsPerPql:4,totalQuestions:120,chapterCounts},checks:{exactThirtyActivePqls:true,fourPerPql:true,perceptuallyDistinctWithinEveryPql:true,semanticAndPerceptualOptionUniqueness:true,learnerVisibleExplanations:true,fan45And135ParameterCoverage:true,mirrorClockGeometryOnlyLearnerMethod:true,heldWaterClockExcluded:true,heldFclIdentitySetExcluded:true,minimumMobileOptionPixels104:true,lifecycleIsolation:true},lifecycle:{...LOCK,englishHumanFreeze:false},nextGate:"SPATIAL_PROPOSED_QL_INCOMPLETE_SLICE_SCALE_COMPLETION_V1"};
const out="dist/reasoning-v1/spatial";mkdirSync(out,{recursive:true});writeFileSync(`${out}/spa-proposed-ql-coverage-v1-review.json`,JSON.stringify(review,null,2));writeFileSync(`${out}/spa-proposed-ql-coverage-v1-review.html`,html);writeFileSync(`${out}/spa-proposed-ql-coverage-v1-evidence.json`,JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
