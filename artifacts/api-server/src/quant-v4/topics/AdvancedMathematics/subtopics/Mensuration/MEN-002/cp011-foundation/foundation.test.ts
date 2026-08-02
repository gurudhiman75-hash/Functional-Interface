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
      `tube-diagram-v2:${prototypeId}:${index}`,
    );
    const svg = question.diagram.svg;

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed corrected tube-diagram validation for seed ${index}.`,
    );
    assert.match(svg, /data-diagram-version="TUBE_ORTHOGRAPHIC_V2"/);
    assert.match(svg, /data-view="end-cross-section"/);
    assert.match(svg, /data-view="longitudinal-section"/);
    assert.match(svg, /data-region="annular-material"/);
    assert.match(svg, /data-region="open-inner-void"/);
    assert.match(svg, /data-region="continuous-inner-void"/);
    assert.match(svg, /data-open-end="near-top-wall"/);
    assert.match(svg, /data-open-end="far-top-wall"/);
    assert.doesNotMatch(svg, /M135 65 L395 65/);
    assert.doesNotMatch(svg, /L455 110 L195 110 Z/);
    assert.match(
      question.diagram.accessibleText,
      /annular material.*longitudinal section.*full pipe length/i,
    );

    switch (question.state.representation) {
      case "DIAMETERS":
        assert.match(svg, /data-dimension="outer-diameter"/);
        assert.match(svg, /data-dimension="inner-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="outer-radius"/);
        assert.doesNotMatch(svg, /data-dimension="inner-radius"/);
        assert.doesNotMatch(svg, /data-dimension="wall-thickness"/);
        break;
      case "OUTER_RADIUS_AND_THICKNESS":
        assert.match(svg, /data-dimension="outer-radius"/);
        assert.match(svg, /data-dimension="inner-radius"/);
        assert.match(svg, /data-dimension="wall-thickness"/);
        assert.doesNotMatch(svg, /data-dimension="outer-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="inner-diameter"/);
        break;
      case "INVERSE_INNER_RADIUS":
        assert.match(svg, /data-dimension="outer-radius"/);
        assert.match(svg, /data-dimension="inner-radius"/);
        assert.match(svg, />r = \?</);
        assert.doesNotMatch(
          svg,
          new RegExp(`r = ${question.state.innerRadius} cm`),
        );
        break;
      case "RADII":
        assert.match(svg, /data-dimension="outer-radius"/);
        assert.match(svg, /data-dimension="inner-radius"/);
        assert.doesNotMatch(svg, /data-dimension="outer-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="inner-diameter"/);
        assert.doesNotMatch(svg, /data-dimension="wall-thickness"/);
        break;
    }

    assert.match(svg, /data-dimension="pipe-length"/);
    diagramProofCount += 1;
  }
}

assert.equal(
  diagramProofCount,
  getMenCp011FoundationPrototypeIds().length * seedsPerPrototype,
);

console.log(
  `MEN-CP-011 orthographic tube-diagram V2 proof passed for ${diagramProofCount} deterministic packages.`,
);
