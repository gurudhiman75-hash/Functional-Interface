import type { Trg002Mvp48Id } from "./mvp-48-registry";
import { generateLabelledTrg002Mvp48Question } from "./mvp-runtime-48-labelled";

const FRESH_EDITORIAL_IDS = new Set<string>([
  "TRG-002-QL-002","TRG-002-QL-005","TRG-002-QL-009","TRG-002-QL-014","TRG-002-QL-018","TRG-002-QL-020","TRG-002-QL-024",
  "TRG-002-QL-028","TRG-002-QL-032","TRG-002-QL-035","TRG-002-QL-038","TRG-002-QL-041","TRG-002-QL-043","TRG-002-QL-048",
  "TRG-002-QL-052","TRG-002-QL-055","TRG-002-QL-058","TRG-002-QL-064","TRG-002-QL-067","TRG-002-QL-069","TRG-002-QL-071",
  "TRG-002-QL-076","TRG-002-QL-081","TRG-002-QL-086","TRG-002-QL-091","TRG-002-QL-094","TRG-002-QL-095","TRG-002-QL-096",
]);

/**
 * Student-facing stem authority for the 48-QL candidate.
 *
 * The generators remain the mathematical authority. This layer only remodels
 * their wording into the compact, conventional style used in SSC/banking
 * objective questions. Values and geometric relationships are preserved.
 */
function remodelExamStem(qlId: string, stem: string) {
  switch (qlId) {
    case "TRG-002-QL-001":
      return stem.replace(
        /^From a point (.+?) m from the foot of a tower, the angle of elevation of its top is (.+?)°\. Find the tower's height\.$/,
        "The angle of elevation of the top of a tower from a point on level ground $1 m from its foot is $2°. What is the height of the tower?",
      );
    case "TRG-002-QL-002":
      return stem.replace(
        /^From a point (.+?) m from a vertical flagpole, its top is seen at an elevation of (.+?)°\. Find its height\.$/,
        "The angle of elevation of the top of a vertical flagpole from a point on level ground $1 m from its foot is $2°. What is the height of the flagpole?",
      );
    case "TRG-002-QL-005":
      return stem.replace(
        /^From a point (.+?) m from a tower, the angle of elevation(?: of its top)? is (.+?)°\. Find the exact height\.$/,
        "The angle of elevation of the top of a tower from a point on level ground $1 m from its foot is $2°. What is the height of the tower?",
      );
    case "TRG-002-QL-007":
      return stem.replace(
        /^A vertical pole is (.+?) m high\. Its top is seen at an elevation of (.+?)°\. Find the horizontal distance to the pole\.$/,
        "From a point on level ground, the angle of elevation of the top of a $1 m high vertical pole is $2°. What is the horizontal distance of the point from the foot of the pole?",
      );
    case "TRG-002-QL-009":
      return stem
        .replace(
          /^A vertical pole is (.+?) m high and its top is seen at (.+?)°\. Find the horizontal distance to the pole\.$/,
          "From a point on level ground, the angle of elevation of the top of a $1 m high vertical pole is $2°. What is the horizontal distance of the point from the foot of the pole?",
        )
        .replace(
          /^A vertical pole is (.+?) m high\. From a point on level ground, the angle of elevation of its top is (.+?)°\. Find the horizontal distance to the pole\.$/,
          "From a point on level ground, the angle of elevation of the top of a $1 m high vertical pole is $2°. What is the horizontal distance of the point from the foot of the pole?",
        );
    case "TRG-002-QL-012":
      return stem.replace(
        /^A tower is (.+?) m high and a point is (.+?) m from its foot\. Find the angle of elevation of the top\.$/,
        "A point on level ground is $2 m from the foot of a tower $1 m high. What is the angle of elevation of the top of the tower from the point?",
      );
    case "TRG-002-QL-014":
      return stem.replace(
        /^A chimney is (.+?) m high and an observation point is (.+?) m from its foot\. Find the angle of elevation(?: of the top)?\.$/,
        "A point on level ground is $2 m from the foot of a chimney $1 m high. What is the angle of elevation of the top of the chimney from the point?",
      );
    case "TRG-002-QL-015":
      return stem.replace(
        /^From the top of a (.+?) m building, the top of a vertical pole (.+?) m away is seen at an angle of depression of (.+?)°\. Find the height of the pole\.$/,
        "From the top of a $1 m high building, the angle of depression of the top of a vertical pole is $3°. If the horizontal distance between the building and the pole is $2 m, what is the height of the pole?",
      );
    case "TRG-002-QL-018":
      return stem
        .replace(
          /^From the top of a (.+?) m building, the top of a pole (.+?) m away is seen at a depression of (.+?)°\. Find the pole's height\.$/,
          "From the top of a $1 m high building, the angle of depression of the top of a vertical pole is $3°. If the horizontal distance between the building and the pole is $2 m, what is the height of the pole?",
        )
        .replace(
          /^From the top of a (.+?) m building, the top of a pole is seen at an angle of depression of (.+?)°\. The horizontal distance between the building and the pole is (.+?) m\. Find the pole's height\.$/,
          "From the top of a $1 m high building, the angle of depression of the top of a vertical pole is $2°. If the horizontal distance between the building and the pole is $3 m, what is the height of the pole?",
        );
    case "TRG-002-QL-020":
      return stem
        .replace(
          /^From a point (.+?) m above ground, the top of a (.+?) m pole is seen at (.+?)° depression\. Find the horizontal distance\.$/,
          "From a point $1 m above level ground, the angle of depression of the top of a $2 m high vertical pole is $3°. What is the horizontal distance between the point and the pole?",
        )
        .replace(
          /^From a point (.+?) m above ground, the top of a (.+?) m pole is seen at an angle of depression of (.+?)°\. Find the horizontal distance\.$/,
          "From a point $1 m above level ground, the angle of depression of the top of a $2 m high vertical pole is $3°. What is the horizontal distance between the point and the pole?",
        );
    case "TRG-002-QL-023":
      return stem.replace(
        /^The line of sight to the top of a tower is (.+?) m and makes (.+?)° with the horizontal\. Find the tower's height\.$/,
        "From a point on level ground, the line of sight to the top of a tower is $1 m long and makes an angle of $2° with the horizontal. What is the height of the tower?",
      );
    case "TRG-002-QL-024":
      return stem.replace(
        /^A building is (.+?) m high\. Its top is observed at an angle of elevation of (.+?)°\. Find the sloping distance from the observer to the top\.$/,
        "From a point on level ground, the angle of elevation of the top of a $1 m high building is $2°. What is the distance from the observer to the top of the building?",
      );
    case "TRG-002-QL-025":
    case "TRG-002-QL-028":
      return stem.replace(
        /^A vertical pole casts a (.+?) m shadow when the sun's angle of elevation is (.+?)°\. Find the height of the pole\.$/,
        "When the angle of elevation of the sun is $2°, a vertical pole casts a shadow $1 m long. What is the height of the pole?",
      );
    case "TRG-002-QL-030":
      return stem.replace(
        /^A vertical pole is (.+?) m high\. When the sun's angle of elevation is (.+?)°, find the length of its shadow\.$/,
        "A vertical pole is $1 m high. What is the length of its shadow when the angle of elevation of the sun is $2°?",
      );
    case "TRG-002-QL-032":
      return stem.replace(
        /^A tree is (.+?) m high\. When the sun's angle of elevation is (.+?)°, find the length of its shadow\.$/,
        "A tree is $1 m high. What is the length of its shadow when the angle of elevation of the sun is $2°?",
      );
    case "TRG-002-QL-033":
      return stem.replace(
        /^A pole casts a (.+?) m shadow when the sun's elevation is (.+?)°\. What will its shadow be when the elevation becomes (.+?)°\?$/,
        "A pole casts a shadow $1 m long when the angle of elevation of the sun is $2°. What will be the length of its shadow when the angle becomes $3°?",
      );
    case "TRG-002-QL-035":
      return stem
        .replace(
          /^A pole casts a (.+?) m shadow when the sun's elevation is (.+?)°\. Later the elevation becomes (.+?)°\. Find the new shadow length\.$/,
          "A pole casts a shadow $1 m long when the angle of elevation of the sun is $2°. If the angle later becomes $3°, what will be the new length of the shadow?",
        )
        .replace(
          /^A pole casts a (.+?) m shadow when the angle of elevation of the sun is (.+?)°\. Later, this angle becomes (.+?)°\. Find the new shadow length\.$/,
          "A pole casts a shadow $1 m long when the angle of elevation of the sun is $2°. If the angle later becomes $3°, what will be the new length of the shadow?",
        );
    case "TRG-002-QL-036":
      return stem.replace(
        /^A (.+?) m ladder makes an angle of (.+?)° with the ground against a vertical wall\. How high does it reach\?$/,
        "A ladder $1 m long rests against a vertical wall and makes an angle of $2° with the ground. How high up the wall does it reach?",
      );
    case "TRG-002-QL-038":
      return stem.replace(
        /^A (.+?) m ladder leans against a vertical wall and makes an angle of (.+?)° with the ground\. How far is its foot from the wall\?$/,
        "A ladder $1 m long rests against a vertical wall and makes an angle of $2° with the ground. What is the distance between the foot of the ladder and the wall?",
      );
    case "TRG-002-QL-041":
      return stem.replace(
        /^A tree breaks (.+?) m above the ground\. Its upper part touches the ground and makes an angle of (.+?)° with the ground\. Find the length of the fallen part\.$/,
        "A tree breaks at a point $1 m above the ground and its upper end touches the ground. If the broken part makes an angle of $2° with the ground, what is the length of the broken part?",
      );
    case "TRG-002-QL-043":
      return stem.replace(
        /^A pole breaks (.+?) m above the ground\. The upper part touches the ground and makes an angle of (.+?)° with the ground\. How far from the foot of the pole does it touch the ground\?$/,
        "A vertical pole breaks at a point $1 m above the ground and its upper end touches the ground. If the broken part makes an angle of $2° with the ground, how far from the foot of the pole does the upper end touch the ground?",
      );
    case "TRG-002-QL-045":
      return stem.replace(
        /^A guy wire joins the top of a (.+?) m mast to a ground anchor and makes (.+?)° with the ground\. Find the wire length\.$/,
        "A guy wire is attached from the top of a $1 m high mast to a point on level ground and makes an angle of $2° with the ground. What is the length of the wire?",
      );
    case "TRG-002-QL-048":
      return stem
        .replace(
          /^A supporting wire from the top of a (.+?) m mast is fixed to the ground and makes a (.+?)° angle with it\. Find the horizontal distance of the anchor from the mast\.$/,
          "A supporting wire from the top of a $1 m high mast is anchored to level ground and makes an angle of $2° with the ground. What is the horizontal distance between the foot of the mast and the anchor?",
        )
        .replace(
          /^A supporting wire from the top of a (.+?) m mast is fixed to the ground and makes an angle of (.+?)° with the ground\. Find the horizontal distance of the anchor from the mast\.$/,
          "A supporting wire from the top of a $1 m high mast is anchored to level ground and makes an angle of $2° with the ground. What is the horizontal distance between the foot of the mast and the anchor?",
        );
    case "TRG-002-QL-049":
      return stem.replace(
        /^Two observation points A and B on the same side of a tower are (.+?) m apart, B being nearer\. The angle of elevation is (.+?)° at A, the farther point, and (.+?)° at B, the nearer point\. Find the tower height\.$/,
        "Points A and B lie on the same straight line with the foot of a tower and are on the same side of it. B is nearer the tower and AB = $1 m. The angles of elevation of the top are $2° from A and $3° from B. What is the height of the tower?",
      );
    case "TRG-002-QL-052":
      return stem.replace(
        /^Two observation points on the same side of a tower are (.+?) m apart\. Their angles of elevation are (.+?)° at the farther point and (.+?)° at the nearer point\. Find the nearer point's distance from the tower\.$/,
        "Two points on the same side of a tower and in the same straight line with its foot are $1 m apart. The angles of elevation of the top are $2° from the farther point and $3° from the nearer point. What is the distance of the nearer point from the foot of the tower?",
      );
    case "TRG-002-QL-055":
      return stem.replace(
        /^Two points on the same side of a tower are (.+?) m apart\. The angles of elevation of the top are (.+?)° at the nearer point and (.+?)° at the farther point\. Find the farther point's distance from the tower\.$/,
        "Two points on the same side of a tower and in the same straight line with its foot are $1 m apart. The angles of elevation of the top are $2° from the nearer point and $3° from the farther point. What is the distance of the farther point from the foot of the tower?",
      );
    case "TRG-002-QL-056":
      return stem.replace(
        /^An observer sees the top of a tower at an elevation of (.+?)°\. After walking (.+?) m directly toward the tower, the angle of elevation becomes (.+?)°\. How far is the observer from the tower now\?$/,
        "From a point on level ground, the angle of elevation of the top of a tower is $1°. After moving $2 m straight towards the tower, the angle becomes $3°. What is the observer's new distance from the foot of the tower?",
      );
    case "TRG-002-QL-058":
      return stem.replace(
        /^An observer sees a tower top at (.+?)°\. After walking (.+?) m directly toward the tower, the angle becomes (.+?)°\. Find the height of the tower\.$/,
        "From a point on level ground, the angle of elevation of the top of a tower is $1°. After moving $2 m straight towards the tower, the angle becomes $3°. What is the height of the tower?",
      );
    case "TRG-002-QL-061":
      return stem.replace(
        /^An observer sees the top of a tower at an elevation of (.+?)°\. After walking (.+?) m directly away from the tower, the angle of elevation becomes (.+?)°\. Find the height of the tower\.$/,
        "From a point on level ground, the angle of elevation of the top of a tower is $1°. After moving $2 m straight away from the tower, the angle becomes $3°. What is the height of the tower?",
      );
    case "TRG-002-QL-064":
      return stem.replace(
        /^A tower is (.+?) m high\. An observer sees its top at (.+?)°, then walks straight away until the angle becomes (.+?)°\. How far did the observer walk\?$/,
        "The angle of elevation of the top of a tower $1 m high is $2° from a point on level ground. The observer then moves straight away from the tower until the angle becomes $3°. How far does the observer move?",
      );
    case "TRG-002-QL-065":
      return stem.replace(
        /^The angle of elevation of a tower top is (.+?)°\. After an observer walks (.+?) m toward the tower, the angle becomes (.+?)°\. Find the observer's original distance from the tower\.$/,
        "From a point on level ground, the angle of elevation of the top of a tower is $1°. After moving $2 m straight towards the tower, the angle becomes $3°. What was the observer's original distance from the foot of the tower?",
      );
    case "TRG-002-QL-067":
      return stem.replace(
        /^From a point (.+?) m from a tower, the angle of elevation of its top is (.+?)°\. From a farther point on the same straight line through the tower's foot, the angle is (.+?)°\. Find the farther point's distance from the tower\.$/,
        "From point A on level ground, $1 m from the foot of a tower, the angle of elevation of its top is $2°. From a farther point B on the same straight line, the angle is $3°. What is the distance of B from the foot of the tower?",
      );
    case "TRG-002-QL-068":
      return stem.replace(
        /^A tower is (.+?) m high\. From two points on the same side of the tower, the angles of elevation of its top are (.+?)° and (.+?)°\. Find the distance between the two observation points\.$/,
        "A tower is $1 m high. From two points on the same side of the tower and in the same straight line with its foot, the angles of elevation of the top are $2° and $3°. What is the distance between the two points?",
      );
    case "TRG-002-QL-069":
      return stem.replace(
        /^From a point (.+?) m from a tower, its top is seen at an angle of elevation of (.+?)°\. An observer walks straight toward the tower until the angle becomes (.+?)°\. How far does the observer walk\?$/,
        "From a point on level ground $1 m from the foot of a tower, the angle of elevation of its top is $2°. The observer moves straight towards the tower until the angle becomes $3°. How far does the observer move?",
      );
    case "TRG-002-QL-071":
      return stem.replace(
        /^From an observation point on level ground, the tops of two towers of heights (.+?) m and (.+?) m are each seen at an angle of elevation of (.+?)°\. The observation point and the feet of both towers lie on the same straight line, with both towers on the same side of the observation point\. Find the distance between their feet\.$/,
        "From a point P on level ground, the angles of elevation of the tops of two towers $1 m and $2 m high are both $3°. If P and the feet of the towers are collinear and both towers lie on the same side of P, what is the distance between the feet of the towers?",
      );
    case "TRG-002-QL-073":
      return stem.replace(
        /^An observer's eye level is (.+?) m above the ground\. From a point (.+?) m from a building, the angle of elevation of the top is (.+?)°\. Find the height of the building\.$/,
        "An observer's eye is $1 m above level ground. From a point $2 m from the foot of a building, the angle of elevation of the top is $3°. What is the height of the building?",
      );
    case "TRG-002-QL-076":
      return stem.replace(
        /^An observer's eye is (.+?) m above the ground\. The top of a (.+?) m building is seen at an angle of elevation of (.+?)°\. Find the horizontal distance from the observer to the building\.$/,
        "An observer's eye is $1 m above level ground. The angle of elevation of the top of a $2 m high building is $3°. What is the horizontal distance from the observer to the foot of the building?",
      );
    case "TRG-002-QL-078":
      return stem.replace(
        /^Two observation points are (.+?) m apart on opposite sides of a tower\. From each point, the angle of elevation of the tower top is (.+?)°\. Find the height of the tower\.$/,
        "Two points on level ground are $1 m apart and lie on opposite sides of a tower. From each point, the angle of elevation of the top of the tower is $2°. What is the height of the tower?",
      );
    case "TRG-002-QL-081":
      return stem.replace(
        /^Two observation points are (.+?) m apart on opposite sides of a tower\. The angle of elevation of the top is (.+?)° at one point and (.+?)° at the other\. Find the height of the tower\.$/,
        "Two points on level ground are $1 m apart and lie on opposite sides of a tower. The angles of elevation of the top are $2° from one point and $3° from the other. What is the height of the tower?",
      );
    case "TRG-002-QL-083":
      return stem.replace(
        /^From the top of a (.+?) m building, the top of a second building is seen at an angle of elevation of (.+?)°\. The horizontal distance between the feet of the two buildings is (.+?) m\. Find the height of the second building\.$/,
        "From the top of a $1 m high building, the angle of elevation of the top of another building is $2°. If the horizontal distance between their feet is $3 m, what is the height of the second building?",
      );
    case "TRG-002-QL-086":
      return stem.replace(
        /^Two buildings are (.+?) m and (.+?) m high\. From the roof of the shorter building, the top of the taller one is seen at (.+?)°\. Find the horizontal distance between them\.$/,
        "Two buildings are $1 m and $2 m high. From the roof of the shorter building, the angle of elevation of the top of the taller building is $3°. What is the horizontal distance between the buildings?",
      );
    case "TRG-002-QL-088":
      return stem.replace(
        /^From the top of a (.+?) m building, the base of a tower is seen at (.+?)° depression and the tower top at (.+?)° elevation\. Find the tower height\.$/,
        "A tower and a building stand on the same level ground. From the top of the $1 m high building, the angle of depression of the foot of the tower is $2° and the angle of elevation of its top is $3°. What is the height of the tower?",
      );
    case "TRG-002-QL-091":
      return stem.replace(
        /^From the top of a (.+?) m building, the base of a tower is seen at a depression of (.+?)° and its top at an elevation of (.+?)°\. Find the height of the tower\.$/,
        "A tower and a building stand on the same level ground. From the top of the $1 m high building, the angle of depression of the foot of the tower is $2° and the angle of elevation of its top is $3°. What is the height of the tower?",
      );
    case "TRG-002-QL-092":
    case "TRG-002-QL-094":
      return stem.replace(
        /^A (.+?) m tower stands on one river bank\. From its top, (?:a point|the point) directly opposite(?: the tower)? on the other bank is seen at (?:a )?(?:angle of )?depression of? (.+?)°\. Find the river width\.$/,
        "A tower $1 m high stands at the edge of a river bank. From its top, the angle of depression of a point directly opposite on the other bank is $2°. What is the width of the river?",
      );
    case "TRG-002-QL-095":
      return stem.replace(
        /^From a point(?: on level ground)? (.+?) m from (?:the foot of )?a building, the angle of elevation of its roof is (.+?)° and that of the top of a mast on the roof is (.+?)°\. Find the height of the mast\.$/,
        "From a point on level ground $1 m from the foot of a building, the angles of elevation of the roof and the top of a vertical mast on the roof are $2° and $3° respectively. What is the height of the mast?",
      );
    case "TRG-002-QL-096":
      return stem.replace(
        /^A (.+?) m mast stands vertically on the roof of a building\. From a point on level ground, the angles of elevation of the roof and the top of the mast are (.+?)° and (.+?)° respectively\. Find the horizontal distance from the foot of the building to the observation point\.$/,
        "A vertical mast $1 m high stands on the roof of a building. From a point on level ground, the angles of elevation of the roof and the top of the mast are $2° and $3° respectively. What is the horizontal distance between the point and the foot of the building?",
      );
    default:
      return stem;
  }
}

function polishExactPresentation(text: string) {
  return text
    .replace(/-(\d+) \+ (\d+)√3/g, (_match, rational: string, surd: string) =>
      rational === surd ? `${rational}(√3−1)` : `${surd}√3−${rational}`,
    )
    .replace(/\b(\d+)\/2 m\b/g, (_match, numerator: string) => {
      const value = Number(numerator) / 2;
      return `${Number.isInteger(value) ? value : value.toFixed(1)} m`;
    })
    .replace(/(\d+√3)=\1 m/g, "$1 m");
}

function polishStudentPresentation(question: any) {
  return {
    ...question,
    answer: polishExactPresentation(question.answer),
    options: question.options.map((option: any) => ({ ...option, display: polishExactPresentation(option.display) })),
    explanation: {
      ...question.explanation,
      keyRule: polishExactPresentation(question.explanation.keyRule),
      shortcut: polishExactPresentation(question.explanation.shortcut),
      traps: question.explanation.traps.map((trap: string) => polishExactPresentation(trap)),
      steps: question.explanation.steps.map((step: any) => ({ ...step, body: polishExactPresentation(step.body) })),
    },
  };
}

export function generateFinalEditorialTrg002Mvp48Question(qlId: Trg002Mvp48Id, seed: string) {
  const question: any = generateLabelledTrg002Mvp48Question(qlId, seed);
  return polishStudentPresentation({
    ...question,
    stem: remodelExamStem(qlId, question.stem),
    reviewStatus: "AI_REVIEWED" as const,
    aiEditorialStatus: "PASS" as const,
    humanReviewStatus: "PENDING" as const,
    finalEditorialReview: {
      status: "PASS" as const,
      reviewedAt: "2026-08-16",
      scope: FRESH_EDITORIAL_IDS.has(qlId) ? "TRG-002_MVP_28_ADDITIONS_FRESH" as const : "TRG-002_PROOF_20_CARRIED" as const,
      runtimeSpecVisualInspection: "NOT_ASSERTED_PER_INSTANCE" as const,
      representativeRuntimeVisualEvidence: "EXTERNAL_REVIEW_ARTIFACT" as const,
      representativeVisualReviewScope: "ONE_DESIGNATED_REVIEW_INSTANCE_PER_QL" as const,
      appUiRenderedInspection: "PENDING" as const,
      renderedVisualInspection: "PENDING" as const,
      humanReviewSubstituted: false,
    },
  });
}
