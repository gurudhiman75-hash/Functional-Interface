import "./foundation-base.test";
import assert from "node:assert/strict";
import { getMenCp011FoundationPrototypeIds } from "./registry";
import { generateMenCp011FoundationPrototype } from "./runtime";

const seedsPerPrototype = 32;
let diagramProofCount = 0;

for (const prototypeId of getMenCp011FoundationPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011FoundationPrototype(
      prototypeId,
      `approved-tube-v1:${prototypeId}:${index}`,
    );
    const svg = question.diagram.svg;

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed approved tube-diagram validation for seed ${index}.`,
    );

    assert.match(svg, /data-diagram-version="TUBE_EXAMTREE_APPROVED_V1"/);
    assert.match(svg, /data-view="single-closed-tube"/);
    assert.match(svg, /data-closure="uncut-wall"/);
    assert.match(svg, /data-background="white"/);
    assert.match(svg, /data-region="top-outer-ellipse"/);
    assert.match(svg, /data-region="top-inner-ellipse"/);
    assert.match(svg, /data-region="bottom-outer-ellipse"/);
    assert.match(svg, /data-region="bottom-inner-hidden-ellipse"/);
    assert.match(svg, /data-region="hidden-inner-left-wall"/);
    assert.match(svg, /data-region="hidden-inner-right-wall"/);
    assert.match(svg, /data-region="variable-legend"/);
    assert.match(svg, /data-position="outside-right"/);
    assert.match(svg, /empty void/);
    assert.match(svg, /not to scale/);

    assert.doesNotMatch(svg, /data-view="end-cross-section"/);
    assert.doesNotMatch(svg, /data-view="longitudinal-section"/);
    assert.doesNotMatch(svg, /data-role="radius-vertical-guide"/);
    assert.doesNotMatch(svg, /data-dimension="outer-radius" data-orientation="vertical"/);
    assert.doesNotMatch(svg, /data-dimension="inner-radius" data-orientation="vertical"/);
    assert.doesNotMatch(svg, /data-dimension="outer-diameter" data-orientation="vertical"/);
    assert.doesNotMatch(svg, /data-dimension="inner-diameter" data-orientation="vertical"/);
    assert.doesNotMatch(svg, /fill="#dfe9ff"|fill="#c7d8ff"|fill="#6366f1"/);

    assert.match(
      question.diagram.accessibleText,
      /single uncut.*matching outer ellipses.*dashed inner walls.*top face.*height is outside/i,
    );

    switch (question.state.representation) {
      case "DIAMETERS":
        assert.match(svg, /data-dimension="outer-diameter" data-orientation="horizontal"/);
        assert.match(svg, /data-dimension="inner-diameter" data-orientation="horizontal"/);
        assert.match(svg, /D = Outer diameter/);
        assert.match(svg, /d = Inner diameter/);
        assert.doesNotMatch(svg, /data-dimension="outer-radius"/);
        assert.doesNotMatch(svg, /data-dimension="inner-radius"/);
        assert.doesNotMatch(svg, /data-dimension="wall-thickness"/);
        break;
      case "OUTER_RADIUS_AND_THICKNESS":
        assert.match(svg, /data-dimension="outer-radius" data-orientation="horizontal"/);
        assert.match(svg, /data-dimension="inner-radius" data-orientation="horizontal"/);
        assert.match(
          svg,
          /data-dimension="wall-thickness" data-orientation="horizontal" data-alignment="top-rim"/,
        );
        assert.match(svg, /t = Wall thickness/);
        assert.doesNotMatch(svg, /data-dimension="outer-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="inner-diameter"/);
        break;
      case "INVERSE_INNER_RADIUS":
        assert.match(svg, /data-dimension="outer-radius" data-orientation="horizontal"/);
        assert.match(svg, /data-dimension="inner-radius" data-orientation="horizontal"/);
        assert.match(svg, />r = \?</);
        assert.doesNotMatch(
          svg,
          new RegExp(`r = ${question.state.innerRadius} cm`),
        );
        break;
      case "RADII":
        assert.match(svg, /data-dimension="outer-radius" data-orientation="horizontal"/);
        assert.match(svg, /data-dimension="inner-radius" data-orientation="horizontal"/);
        assert.match(svg, /R = Outer radius/);
        assert.match(svg, /r = Inner radius/);
        assert.doesNotMatch(svg, /data-dimension="outer-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="inner-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="wall-thickness"/);
        break;
    }

    assert.match(
      svg,
      /data-dimension="pipe-length" data-orientation="vertical"/,
    );
    diagramProofCount += 1;
  }
}

assert.equal(
  diagramProofCount,
  getMenCp011FoundationPrototypeIds().length * seedsPerPrototype,
);

console.log(
  `MEN-CP-011 approved ExamTree tube-diagram V1 proof passed for ${diagramProofCount} deterministic packages.`,
);
