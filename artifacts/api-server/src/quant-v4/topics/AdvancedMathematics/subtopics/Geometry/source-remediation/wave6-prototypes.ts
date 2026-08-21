import {
  medianLengthFromCentroidSegment,
  midpointConverseHalfLength,
  perpendicularBisectorConverseConclusion,
  perpendicularBisectorDirectConclusion,
  rational,
  toNumber,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import {
  approximate,
  buildExplanation,
  buildOptions,
  collinear,
  finalizeGapWave6Question,
  parallel,
  perpendicular,
  pointDistance,
  proveClueMinimality,
  wave6Verifier,
} from "./wave6-utils";
import type { GapWave6PrototypeDefinition, GapWave6Question } from "./wave6-types";

function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return hash % count;
}

function point(model: GeoDiagramModel, id: string) {
  const result = model.points.find((candidate) => candidate.id === id);
  if (!result) throw new Error(`Wave 6 diagram point ${id} missing`);
  return result;
}

function directPerpStemDiagram(rAngle: number, splitAngle: number): GeoDiagramModel {
  return {
    points: [
      { id: "P", label: "P", x: 25, y: 155, labelPosition: "SW" },
      { id: "Q", label: "Q", x: 185, y: 155, labelPosition: "SE" },
      { id: "R", label: "R", x: 55, y: 35, labelPosition: "NW" },
      { id: "S", label: "S", x: 105, y: 155, labelPosition: "S" },
      { id: "T", label: "T", x: 105, y: 81.15384615384616, labelPosition: "E" },
    ],
    segments: [
      { id: "PS", fromPointId: "P", toPointId: "S" },
      { id: "SQ", fromPointId: "S", toPointId: "Q" },
      { id: "PR", fromPointId: "P", toPointId: "R" },
      { id: "RT", fromPointId: "R", toPointId: "T" },
      { id: "TQ", fromPointId: "T", toPointId: "Q" },
      { id: "ST", fromPointId: "S", toPointId: "T", style: "CONSTRUCTION" },
      { id: "PT", fromPointId: "P", toPointId: "T", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [
      { id: "given-r-angle", firstPointId: "P", vertexPointId: "R", secondPointId: "Q", label: `${rAngle}¬∞`, radius: 18, labelRadius: 30 },
      { id: "given-tpr-angle", firstPointId: "T", vertexPointId: "P", secondPointId: "R", label: `${splitAngle}¬∞`, radius: 18, labelRadius: 31 },
    ],
    rightAngleMarks: [{ id: "given-right-at-s", vertexPointId: "S", firstRayPointId: "P", secondRayPointId: "T" }],
    equalLengthMarks: [{ id: "given-s-midpoint", segmentIds: ["PS", "SQ"] }],
    parallelMarks: [],
    arcs: [],
    labels: [],
    disclosure: "STEM",
    notToScale: true,
  };
}

function directPerpSolutionDiagram(rAngle: number, splitAngle: number, answer: number): GeoDiagramModel {
  const stem = directPerpStemDiagram(rAngle, splitAngle);
  return {
    ...stem,
    segments: stem.segments,
    angleMarks: stem.angleMarks,
    equalLengthMarks: [
      ...stem.equalLengthMarks,
      { id: "derived-tp-tq", segmentIds: ["PT", "TQ"] },
    ],
    labels: [
      { id: "derived-equality-label", text: "TP = TQ", x: 146, y: 61 },
      { id: "answer-label", text: `‚à†TPQ = ‚à†PQR = ${answer}¬∞`, x: 205, y: 185 },
    ],
    disclosure: "SOLUTION",
  };
}

function rhombusConverseSolutionDiagram(so: number, oq: number, answer: number): GeoDiagramModel {
  return {
    points: [
      { id: "P", label: "P", x: 105, y: 25, labelPosition: "N" },
      { id: "Q", label: "Q", x: 190, y: 105, labelPosition: "E" },
      { id: "R", label: "R", x: 105, y: 185, labelPosition: "S" },
      { id: "S", label: "S", x: 20, y: 105, labelPosition: "W" },
      { id: "M", label: "M", x: 105, y: 105, labelPosition: "SW" },
      { id: "O", label: "O", x: 137, y: 105, labelPosition: "NE" },
    ],
    segments: [
      { id: "PQ", fromPointId: "P", toPointId: "Q" },
      { id: "QR", fromPointId: "Q", toPointId: "R" },
      { id: "RS", fromPointId: "R", toPointId: "S" },
      { id: "SP", fromPointId: "S", toPointId: "P" },
      { id: "PM", fromPointId: "P", toPointId: "M", style: "CONSTRUCTION" },
      { id: "MR", fromPointId: "M", toPointId: "R", style: "CONSTRUCTION" },
      { id: "SM", fromPointId: "S", toPointId: "M", style: "CONSTRUCTION" },
      { id: "MO", fromPointId: "M", toPointId: "O", style: "CONSTRUCTION" },
      { id: "OQ", fromPointId: "O", toPointId: "Q", style: "CONSTRUCTION" },
      { id: "OP", fromPointId: "O", toPointId: "P", style: "CONSTRUCTION" },
      { id: "OR", fromPointId: "O", toPointId: "R", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [],
    rightAngleMarks: [{ id: "rhombus-diagonal-right", vertexPointId: "M", firstRayPointId: "P", secondRayPointId: "Q" }],
    equalLengthMarks: [
      { id: "rhombus-pr-bisected", segmentIds: ["PM", "MR"] },
      { id: "given-op-or", segmentIds: ["OP", "OR"] },
    ],
    parallelMarks: [],
    arcs: [],
    labels: [
      { id: "given-so", text: `SO = ${so} cm`, x: 47, y: 82 },
      { id: "given-oq", text: `OQ = ${oq} cm`, x: 156, y: 82 },
      { id: "derived-collinear", text: "S, O, Q are collinear", x: 70, y: 220 },
      { id: "answer-sq", text: `SQ = ${answer} cm`, x: 80, y: 242 },
    ],
    disclosure: "SOLUTION",
    notToScale: true,
  };
}

function centroidStemDiagram(known: "VERTEX_TO_CENTROID" | "CENTROID_TO_MIDPOINT", length: number): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 105, y: 25, labelPosition: "N" },
      { id: "B", label: "B", x: 25, y: 175, labelPosition: "SW" },
      { id: "C", label: "C", x: 185, y: 175, labelPosition: "SE" },
      { id: "D", label: "D", x: 105, y: 175, labelPosition: "S" },
      { id: "G", label: "G", x: 105, y: 125, labelPosition: "E" },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
      { id: "BD", fromPointId: "B", toPointId: "D" },
      { id: "DC", fromPointId: "D", toPointId: "C" },
      { id: "AG", fromPointId: "A", toPointId: "G", style: "CONSTRUCTION" },
      { id: "GD", fromPointId: "G", toPointId: "D", style: "CONSTRUCTION" },
    ],
    circles: [],
    angleMarks: [],
    rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-d-midpoint", segmentIds: ["BD", "DC"] }],
    parallelMarks: [],
    arcs: [],
    labels: [{
      id: "given-centroid-segment",
      text: `${known === "VERTEX_TO_CENTROID" ? "AG" : "GD"} = ${length} cm`,
      x: 130,
      y: known === "VERTEX_TO_CENTROID" ? 70 : 151,
    }],
    disclosure: "STEM",
    notToScale: true,
  };
}

function centroidSolutionDiagram(
  known: "VERTEX_TO_CENTROID" | "CENTROID_TO_MIDPOINT",
  length: number,
  whole: number,
): GeoDiagramModel {
  const stem = centroidStemDiagram(known, length);
  const ag = known === "VERTEX_TO_CENTROID" ? length : 2 * length;
  const gd = known === "CENTROID_TO_MIDPOINT" ? length : length / 2;
  return {
    ...stem,
    labels: [
      { id: "ratio-label", text: "AG : GD = 2 : 1", x: -10, y: 95 },
      { id: "ag-label", text: `AG = ${ag} cm`, x: 130, y: 70 },
      { id: "gd-label", text: `GD = ${gd} cm`, x: 130, y: 151 },
      { id: "whole-label", text: `AD = ${whole} cm`, x: -5, y: 205 },
    ],
    disclosure: "SOLUTION",
  };
}

function midpointStemDiagram(whole: number): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 175, labelPosition: "SW" },
      { id: "B", label: "B", x: 185, y: 175, labelPosition: "SE" },
      { id: "C", label: "C", x: 120, y: 35, labelPosition: "N" },
      { id: "D", label: "D", x: 105, y: 175, labelPosition: "S" },
      { id: "E", label: "E", x: 72.5, y: 105, labelPosition: "NW" },
    ],
    segments: [
      { id: "AD", fromPointId: "A", toPointId: "D" },
      { id: "DB", fromPointId: "D", toPointId: "B" },
      { id: "AE", fromPointId: "A", toPointId: "E" },
      { id: "EC", fromPointId: "E", toPointId: "C" },
      { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "DE", fromPointId: "D", toPointId: "E", style: "CONSTRUCTION" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "given-ad-db", segmentIds: ["AD", "DB"] }],
    parallelMarks: [{ id: "given-de-parallel-bc", segmentIds: ["DE", "BC"] }],
    arcs: [], labels: [{ id: "given-ac", text: `AC = ${whole} cm`, x: 5, y: 82 }],
    disclosure: "STEM", notToScale: true,
  };
}

function midpointSolutionDiagram(whole: number, half: number): GeoDiagramModel {
  const stem = midpointStemDiagram(whole);
  return {
    ...stem,
    equalLengthMarks: [...stem.equalLengthMarks, { id: "derived-ae-ec", segmentIds: ["AE", "EC"] }],
    labels: [
      { id: "given-ac", text: `AC = ${whole} cm`, x: 5, y: 82 },
      { id: "derived-midpoint", text: "AE = EC", x: 92, y: 78 },
      { id: "answer-ec", text: `ECH = ${half} cm`, x: 130, y: 110 },
    ],
    disclosure: "SOLUTION",
  };
}

function generatePerpBisectorDirect(seed: string): GapWave6Question {
  const variants = [
    { r: 62, split: 38, answer: 40, stem: "In triangle PQR, ‚à£R = 62¬∞. The perpendicular bisector of PQ at S meets QR at T. If ‚à£TPR = 38¬∞, find ‚à£PQR." },
    { r: 54, split: 30, answer: 48, stem: "For ŒîPQR, the perpendicular bisector of PQ passes through S and cuts QR at T. Given ‚àØPRQ = 54¬∞ and ‚àØTPR = 30¬∞, what is ‚à£PQR?" },
    { r: 70, split: 34, answer: 38, stem: "In the shown triangle, ST is the perpendicular bisector of PQ and T lies on QR. If ‚à£PRQ = 70¬∞ and ‚à£TPR = 34¬∞, calculate ‚àØPQR." },
  ] as const;
  const v = variants[variantIndex(seed, variants.length)];
  const expected = `${v.answer}¬∞`;
  const clueIds = ["ST_PERP_BISECTS_PQ", "T_ON_QR", "R_ANGLE_GIVEN", "TPR_ANGLE_GIVEN", "TARGET_Q"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? `${(180 - v.r - v.split) / 2}¬∞` : null;
  const model = directPerpStemDiagram(v.r, v.split);
  const solution = directPerpSolutionDiagram(v.r, v.split, v.answer);
  const P = point(model, "P"); const Q = point(model, "Q"); const R = point(model, "R"); const S = point(model, "S"); const T = point(model, "T");
  const topology = approximate(pointDistance(P, S), pointDistance(S, Q)) && perpendicular(P, Q, S, T) && collinear(R, T, Q)
    && approximate(pointDistance(T, P), pointDistance(T, Q)) && perpendicularBisectorDirectConclusion() === "EQUIDISTANT_FROM_ENDPOINTS";
  const theoremTrace: TheoremId[] = ["PERPENDICULAR_BISECTOR_EQUIDISU9Pà∞Äâ%M=M1M}	M}91Là∞ÄâQI%91}91}MU4âtÏ(ÄÅçΩπÕ–ÅΩ¡—•ΩπMï–ÄÙÅâ’•±ë=¡—•ΩπÃ°ï·¡ïç—ïê∞Ål(ÄÄÄÅÏÅ—ï·–ËÅÄëÏ»Ä®ÅÿπÖπÕ›ï…˜
¡å∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâAIA}	%MQ=I}=IQM}EU1}	M}91M}M!Ià∞Å…Ö—•ΩπÖ±îËÄâUÕïÃÅ—°îÅ›°Ω±îÅ…ïµÖ•π•πúÅÖπù±îÅÖÃÉä"çAEHÅ•πÕ—ïÖêÅΩòÅÕ°Ö…•πúÅ•–Åâï—›ïï∏Å—°îÅï≈’Ö∞Å•ÕΩÕçï±ïÃÅÖπù±ïÃ∏àÅÙ∞(ÄÄÄÅÏÅ—ï·–ËÅÄëÏ†ƒ‡¿Ä¥Åÿπ»§ÄºÄ…˜
¡Ä∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâAIA}	%MQ=I}%9=IM}MA1%Q}Q}@à∞Å…Ö—•ΩπÖ±îËÄâQ…ïÖ—ÃÅ—°îÅïπ—•…îÅÖπù±îÅÖ–Å@ÅÖÃÅï≈’Ö∞Å—ºÉä"ΩAEHÅÖπêÅ•ùπΩ…ïÃÅ—°îÅÕ—Ö—ïêÉä"ΩQAIp∏àÅÙ∞(ÄÄÄÅÏÅ—ï·–ËÅÄëÌÿπÕ¡±•—˜
¡Ä∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâAIA}	%MQ=I}=A%M}%Y9}MA1%Pà∞Å…Ö—•ΩπÖ±îËÄâΩ¡•ïÃÉä"çQAHÅë•…ïç—±‰Å—ºÉä"ΩAEHÅ›•—°Ω’–Å’Õ•πúÅQ@ÄÙÅQDÅÖπêÅ—°îÅ—…•Öπù±îÅÖπù±îÅÕ’¥∏àÅÙ∞(ÄÅt∞ÅÕïïê§Ï(ÄÅ…ï—’…∏Åô•πÖ±•ÈïÖ¡]•ŸîŸE’ïÕ—•Ω∏°Ï(ÄÄÄÅ—ïµ¡Ω…Ö…ÂA…Ω—Ω—Â¡ï%êËÄâ<µQ5@µ@µ\ÿµ@¿¿ÿµAI@µ	%MQ=HµEU%%MQ9Pµ91µXƒà∞(ÄÄÄÅÕΩ’…çïÖ¡%êËÄâ<µ@¥¿¿ÿΩAIA9%U1I}	%MQ=I}EU1}%MQ9}%IPà∞(ÄÄÄÅÕΩ’…çïŸ•ëïπçï%ëÃËÅlâMIµQMQ	==,µ0¥»¿»‘µP»µAI@µ	%MQ=Hµ91¥»¿»ÿât∞(ÄÄÄÅÕΩ±Ÿï5ΩëîËÄâ¡ï…¡ïπë•ç’±Ö…	•Õïç—Ω…QΩ%ÕΩÕçï±ïÕπù±ïIïçΩŸï…‰à∞(ÄÄÄÅÕïïê∞ÅÕ—ï¥ËÅÿπÕ—ï¥∞Ä∏∏πΩ¡—•ΩπMï–∞(ÄÄÄÅï·¡±ÖπÖ—•Ω∏ËÅâ’•±ë·¡±ÖπÖ—•Ω∏°—°ïΩ…ïµQ…Öçî∞Ål(ÄÄÄÄÄÄâPÅ±•ïÃÅΩ∏Å—°îÅ¡ï…¡ïπë•ç’±Ö»Åâ•Õïç—Ω»ÅΩòÅAD∞ÅÕºÅQ@ÄÙÅQD∏ÅQ°ï…ïôΩ…îÅ—…•Öπù±îÅQADÅ•ÃÅ•ÕΩÕçï±ïÃÅÖπêÉä"ΩQADÄÙÉä"ΩQE@ÄÙÉä"ΩAEH∏à∞(ÄÄÄÄÄÅÅ1ï–Éä"ΩAEHÄÙÅ‡∏ÅQ°ï∏Å—°îÅô’±∞ÅÖπù±îÅÖ–Å@Å•ÃÅ‡Ä¨ÄëÌÿπÕ¡±•—˜
¿πÄ∞(ÄÄÄÄÄÅÅUÕ•πúÅ—°îÅÖπù±îÅÕ’¥ÅΩòÅ—…•Öπù±îÅAEHËÄ°‡Ä¨ÄëÌÿπÕ¡±•—Ù§Ä¨Å‡Ä¨ÄëÌÿπ…ÙÄÙÄƒ‡¿∏Å!ïπçîÄ…‡ÄÙÄëÏƒ‡¿Ä¥Åÿπ»Ä¥ÅÿπÕ¡±•—Ù∞ÅÕºÅ‡ÄÙÄëÌÿπÖπÕ›ï…˜
¿πÄ∞(ÄÄÄÅt§∞(ÄÄÄÅ—°ïΩ…ïµQ…Öçî∞Åë•Õ¡±ÖÂïë±’ï%ëÃËÅç±’ï%ëÃ∞Åµ•π•µÖ±•—ÂA…ΩΩòËÅ¡…ΩŸï±’ï5•π•µÖ±•—‰°ç±’ï%ëÃ∞ÅÕΩ±Ÿî∞Åï·¡ïç—ïê§∞(ÄÄÄÅ•πëï¡ïπëïπ—Yï…•ô•ï…IïÕ’±–ËÅ›ÖŸîŸYï…•ô•ï»†â!%!}AI%M%=9}==I%9Qà∞Å—Ω¡Ω±Ωù‰∞Ål(ÄÄÄÄÄÄâLÅ•ÃÅ—°îÅµ•ë¡Ω•π–ÅΩòÅADÅ•∏Å—°îÅçΩΩ…ë•πÖ—îÅµΩëï∞à∞ÄâMPÅ•ÃÅ¡ï…¡ïπë•ç’±Ö»Å—ºÅADà∞ÄâPÅ±•ïÃÅΩ∏ÅEHÅÖπêÅΩ∏Å—°îÅ¡ï…¡ïπë•ç’±Ö»Åâ•Õïç—Ω»ÅΩòÅADà∞Äâ•πëï¡ïπëïπ–Åë•Õ—ÖπçîÅç°ïç¨ÅçΩπô•…µÃÅQ@ÄÙÅQDà∞(ÄÄÄÅt§∞(ÄÄÄÅë•Öù…Öµ•Õ¡ΩÕ•—•Ω∏ËÄâIEU%I}	=Q à∞Åë•Öù…Öµ5Ωëï∞ËÅµΩëï∞∞ÅÕΩ±’—•Ωπ•Öù…Öµ5Ωëï∞ËÅÕΩ±’—•Ω∏∞(ÄÅÙ§Ï)Ù()ô’πç—•Ω∏Åùïπï…Ö—ïAï…¡	•Õïç—Ω…ΩπŸï…ÕïI°Ωµâ’Ã°ÕïïêËÅÕ—…•πú§ËÅÖ¡]ÖŸîŸE’ïÕ—•Ω∏ÅÏ(ÄÅçΩπÕ–ÅŸÖ…•Öπ—ÃÄÙÅl(ÄÄÄÅÏÅÕºËÄ‘∞ÅΩƒËÄ‹∞ÅÖπÕ›ï»ËÄƒ»∞ÅÕ—ï¥ËÄâAEILÅ•ÃÅÑÅ…°Ωµâ’Ã∏Å<∞Å•ÃÅÖ∏Å•π—ï…•Ω»Å¡Ω•π–ÅÕ’ç†Å—°Ö–Å=@ÄÙÅ=H∏Å%òÅM<ÄÙÄ‘Åç¥ÅÖπêÅ=DÄÙÄ‹Åç¥∞Åô•πêÅ—°îÅ±ïπù—†ÅΩòÅë•ÖùΩπÖ∞ÅMD∏àÅÙ∞(ÄÄÄÅÏÅÕºËÄ‡∞ÅΩƒËÄƒƒ∞ÅÖπÕ›ï»ËÄƒ‰∞ÅÕ—ï¥ËÄâ%∏Å…°Ωµâ’ÃÅAEIL∞ÅÖ∏Å•π—ï…•Ω»Å¡Ω•π–Å<ÅÕÖ—•Õô•ïÃÅ=@ÄÙÅ=H∏Å•Ÿï∏ÅM<ÄÙÄ‡Åç¥ÅÖπêÅ=DÄÙÄƒƒÅç¥∞Å›°Ö–Å•ÃÅMD¸àÅÙ∞(ÄÄÄÅÏÅÕºËÄ‰∞ÅΩƒËÄƒÃ∞ÅÖπÕ›ï»ËÄ»»∞ÅÕ—ï¥ËÄâÅ¡Ω•π–Å<Å±•ïÃÅ•πÕ•ëîÅ…°Ωµâ’ÃÅAEILÅÖπêÅ•ÃÅï≈’Ö±±‰Åë•Õ—Öπ–Åô…Ω¥Å@ÅÖπêÅH∏Å%òÅM<ÄÙÄ‰Åç¥ÅÖπêÅ=DÄÙÄƒÃÅç¥∞ÅçÖ±ç’±Ö—îÅMD∏àÅÙ∞(ÄÅtÅÖÃÅçΩπÕ–Ï(ÄÅçΩπÕ–ÅÿÄÙÅŸÖ…•Öπ—ÕmŸÖ…•Öπ—%πëï‡°Õïïê∞ÅŸÖ…•Öπ—Ãπ±ïπù—†•tÏ(ÄÅçΩπÕ–Åï·¡ïç—ïêÄÙÅÄëÌÿπÖπÕ›ï…ÙÅçµÄÏ(ÄÅçΩπÕ–Åç±’ï%ëÃÄÙÅlâAEIM}I!=5	ULà∞Äâ=A}EU1M}=Hà∞ÄâM=}%Y8à∞Äâ=E}%Y8à∞ÄâQIQ}MDâtÅÖÃÅçΩπÕ–Ï(ÄÅçΩπÕ–ÅÕΩ±ŸîÄÙÄ°Öç—•ŸîËÅIïÖëΩπ±ÂMï–ÒÕ—…•πú¯§ÄÙ¯Åç±’ï%ëÃπïŸï…‰†°•ê§ÄÙ¯ÅÖç—•Ÿîπ°ÖÃ°•ê§§Ä¸ÅÄëÌÿπÕºÄ¨ÅÿπΩ≈ÙÅçµÄÄËÅπ’±∞Ï(ÄÅçΩπÕ–ÅÕΩ±’—•Ω∏ÄÙÅ…°Ωµâ’ÕΩπŸï…ÕïMΩ±’—•Ωπ•Öù…Ö¥°ÿπÕº∞ÅÿπΩƒ∞ÅÿπÖπÕ›ï»§Ï(ÄÅçΩπÕ–Å@ÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞Äâ@à§ÏÅçΩπÕ–ÅDÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞ÄâDà§ÏÅçΩπÕ–ÅHÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞ÄâHà§ÏÅçΩπÕ–ÅLÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞ÄâLà§ÏÅçΩπÕ–Å4ÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞Äâ4à§ÏÅçΩπÕ–Å<ÄÙÅ¡Ω•π–°ÕΩ±’—•Ω∏∞Äâ<à§Ï(ÄÅçΩπÕ–Å—Ω¡Ω±Ωù‰ÄÙÅÖ¡¡…Ω·•µÖ—î°¡Ω•π—•Õ—Öπçî°@∞Å4§∞Å¡Ω•π—•Õ—Öπçî°4∞ÅH§§ÄòòÅ¡ï…¡ïπë•ç’±Ö»°@∞ÅH∞ÅL∞ÅD§(ÄÄÄÄòòÅÖ¡¡…Ω·•µÖ—î°¡Ω•π—•Õ—Öπçî°<∞Å@§∞Å¡Ω•π—•Õ—Öπçî°<∞ÅH§§ÄòòÅçΩ±±•πïÖ»°L∞Å<∞ÅD§(ÄÄÄÄòòÅ¡ï…¡ïπë•ç’±Ö…	•Õïç—Ω…ΩπŸï…ÕïΩπç±’Õ•Ω∏†§ÄÙÙÙÄâ1%M}=9}AIA9%U1I}	%MQ=HàÏ(ÄÅçΩπÕ–Å—°ïΩ…ïµQ…ÖçîËÅQ°ïΩ…ïµ%ëmtÄÙÅlâI!=5	UM}%=91M}AIA9%U1Hà∞ÄâAIA9%U1I}	%MQ=I}=9YIMàÅtÏ(ÄÅçΩπÕ–ÅΩ¡—•ΩπMï–ÄÙÅâ’•±ë=¡—•ΩπÃ°ï·¡ïç—ïê∞Ål(ÄÄÄÅÏÅ—ï·–ËÅÄëÌ5Ö—†πÖâÃ°ÿπΩƒÄ¥ÅÿπÕº•ÙÅçµÄ∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâ=11%9I}M59QM}MU	QIQà∞Å…Ö—•ΩπÖ±îËÄâM’â—…Öç—ÃÅM<Åô…Ω¥Å=DÅ•πÕ—ïÖêÅΩòÅÖëë•πúÅ—°îÅ—›ºÅÖë©Öçïπ–Å¡Ö…—ÃÅΩòÅë•ÖùΩπÖ∞ÅM,∏àÅÙ∞(ÄÄÄÅÏÅ—ï·–ËÅÄëÏ»Ä®ÅÿπÕΩÙÅçµÄ∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâMMU5M}=}5%A=%9Q}I=5}M<à∞Å…Ö—•ΩπÖ±îËÄâÕÕ’µïÃÅ<Å•ÃÅ—°îÅµ•ë¡Ω•π–ÅΩòÅMDÅÖπêÅëΩ’â±ïÃÅM<ÏÅ=DÄÙÅ=HÅëΩïÃÅπΩ–ÅµÖ≠îÅ<Å—°îÅµ•ë¡Ω•π–ÅΩòÅMD∏àÅÙ∞(ÄÄÄÅÏÅ—ï·–ËÅÄëÏ»Ä®ÅÿπΩ≈ÙÅçµÄ∞Åµ•ÕçΩπçï¡—•Ωπ%êËÄâMMU5M}=}5%A=%9Q}I=5}=Dà∞Å…Ö—•ΩπÖ±îËÄâÕÕ’µïÃÅ<Å•ÃÅ—°îÅµ•ë¡Ω•π–ÅΩòÅMDÅÖπêÅëΩ’â±ïÃÅ=D∏àÅÙ∞(ÄÅt∞ÅÕïïê§Ï(ÄÅ…ï—’…∏Åô•πÖ±•ÈïÖ¡]ÖŸîŸE’ïÕ—•Ω∏°Ï(ÄÄÄÅ—ïµ¡Ω…Ö…ÂA…Ω—Ω—Â¡ï%êËÄâ<µQ5@µ@µ\ÿµ@¿¿ÿµAI@µ	%MQ=Hµ=9YIMµI!=5	ULµXƒà∞(ÄÄÄÅÕΩ’…çïÖ¡%êËÄâ<µ@¥¿¿ÿΩAIA9%U1I}	%MQ=I}EU1}%MQ9}=9YIMà∞(ÄÄÄÅÕΩ’…çïŸ•ëïπçï%ëÃËÅlâMIµQMQ	==,µ0µI!=5	ULµAI@µ	%MQ=Hµ=9YIM¥»¿»–ât∞(ÄÄÄÅÕΩ±Ÿï5ΩëîËÄâï≈’Ö±•Õ—ÖπçïÕQΩAï…¡ïπë•ç’±Ö…	•Õïç—Ω…QΩ•ÖùΩπÖ±1ïπù—†à∞(ÄÄÄÅÕïïê∞ÅÕ—ï¥ËÅÿπÕ—ï¥∞Ä∏∏πΩ¡—•ΩπMï–∞(ÄÄÄÅï·¡±ÖπÖ—•Ω∏ËÅâ’•±ë·¡±ÖπÖ—•Ω∏°—°ïΩ…ïµQ…Öçî∞Ål(ÄÄÄÄÄÄâ%∏ÅÑÅ…°Ωµâ’Ã∞Åë•ÖùΩπÖ∞ÅMDÅ•ÃÅ—°îÅ¡ï…¡ïπë•ç’±Ö»Åâ•Õïç—Ω»ÅΩòÅë•ÖùΩπÖ∞ÅAH∏à∞(ÄÄÄÄÄÄâ	ïçÖ’ÕîÅ=@ÄÙÅ=H∞Å<Å•ÃÅï≈’•ë•Õ—Öπ–Åô…Ω¥Å@ÅÖπêÅH∏Å	‰Å—°îÅçΩπŸï…ÕîÅ¡ï…¡ïπë•ç’±Ö»µâ•Õïç—Ω»Å—°ïΩ…ï¥∞Å<Åµ’Õ–Å±•îÅΩ∏Å—°îÅ¡ï…¡ïπë•ç’±Ö»Åâ•Õïç—Ω»ÅΩòÅAH∞ÅÕºÅL∞Å<ÅÖπêÅDÅÖ…îÅçΩ±±•πïÖ»∏à∞(ÄÄÄÄÄÅÅQ°ï…ïôΩ…îÅMD