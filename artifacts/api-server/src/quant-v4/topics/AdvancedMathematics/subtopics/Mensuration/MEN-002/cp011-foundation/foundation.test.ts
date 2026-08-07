import "./foundation-base.test";
import "./exam-readiness.test";
import "./surface-area.test";
import "./open-containers.test";
import "./inverse-thickness-length.test";
import assert from "node:assert/strict";
import { getMenCp011FoundationPrototypeIds } from "./registry";
import { generateMenCp011FoundationPrototype } from "./runtime";
import { MEN_CP011_MEASUREMENT_AUTHORITY } from "./measurement-profiles";

const seedsPerPrototype = 32;
let packageCount = 0;

for (const prototypeId of getMenCp011FoundationPrototypeIds()) {
  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const question = generateMenCp011FoundationPrototype(
      prototypeId,
      `exam-ready-v2:${prototypeId}:${index}`,
    );
    const promptSvg = question.diagram.svg;
    const solutionSvg = question.solutionDiagram.svg;
    const radialUnit = question.measurementProfile.radialUnit;

    assert.equal(
      question.validation.valid,
      true,
      `${prototypeId} failed MEN-CP-011 Phase 2B validation for seed ${index}: ${question.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join(" | ")}`,
    );
    assert.equal(question.measurementAuthority, MEN_CP011_MEASUREMENT_AUTHORITY);

    for (const svg of [promptSvg, solutionSvg]) {
      assert.match(svg, /data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"/);
      assert.match(svg, /data-view="single-closed-tube"/);
      assert.match(svg, /data-closure="uncut-wall"/);
      assert.match(svg, /data-background="white"/);
      assert.match(svg, /data-responsive="true"/);
      assert.match(svg, /data-region="top-outer-ellipse"/);
      assert.match(svg, /data-region="top-inner-ellipse"/);
      assert.match(svg, /data-region="bottom-outer-ellipse"/);
      assert.match(svg, /data-region="bottom-inner-hidden-ellipse"/);
      assert.match(svg, /data-region="hidden-inner-left-wall"/);
      assert.match(svg, /data-region="hidden-inner-right-wall"/);
      assert.match(svg, /data-region="variable-legend"/);
      assert.match(svg, /data-position="outside-right"/);
      assert.match(svg, /data-label-placement="detached"/);
      assert.match(svg, /not to scale/);
      assert.doesNotMatch(svg, /data-role="radius-vertical-guide"/);
      assert.doesNotMatch(svg, /fill="#dfe9ff"|fill="#c7d8ff"|fill="#6366f1"/);
      assert.doesNotMatch(svg, /<svg[^>]+\bwidth="\d+/);
    }

    assert.match(promptSvg, /data-diagram-role="PROMPT"/);
    assert.match(solutionSvg, /data-diagram-role="SOLUTION"/);

    switch (question.state.representation) {
      case "DIAMETERS":
        assert.match(promptSvg, /data-dimension="outer-diameter" data-orientation="horizontal"/);
        assert.match(promptSvg, /data-dimension="inner-diameter" data-orientation="horizontal"/);
        assert.doesNotMatch(promptSvg, /data-dimension="outer-radius"/);
        assert.doesNotMatch(promptSvg, /data-dimension="inner-radius"/);
        assert.doesNotMatch(promptSvg, /data-dimension="wall-thickness"/);
        break;
      case "OUTER_RADIUS_AND_THICKNESS":
        assert.match(promptSvg, /data-scope="centre-connected"/);
        assert.match(promptSvg, /data-role="top-centre"/);
        assert.match(promptSvg, />r = \?</);
        assert.doesNotMatch(
          promptSvg,
          new RegExp(`r = ${question.state.innerRadius} ${radialUnit}`),
        );
        assert.match(
          solutionSvg,
          new RegExp(`r = ${question.state.innerRadius} ${radialUnit}`),
        );
        assert.match(
          promptSvg,
          /data-dimension="wall-thickness" data-orientation="radial" data-alignment="top-rim"/,
        );
        break;
      case "INVERSE_INNER_RADIUS":
        assert.match(promptSvg, /data-scope="centre-connected"/);
        assert.match(promptSvg, />r = \?</);
        assert.doesNotMatch(
          promptSvg,
          new RegExp(`r = ${question.state.innerRadius} ${radialUnit}`),
        );
        assert.match(
          solutionSvg,
          new RegExp(`r = ${question.state.innerRadius} ${radialUnit}`),
        );
        break;
      case "RADII":
        assert.match(promptSvg, /data-scope="centre-connected"/);
        assert.match(promptSvg, /data-role="top-centre"/);
        assert.match(
          promptSvg,
          /data-dimension="outer-radius" data-orientation="centre-connected"/,
        );
        assert.match(
          promptSvg,
          /data-dimension="inner-radius" data-orientation="centre-connected"/,
        );
        assert.doesNotMatch(promptSvg, /data-dimension="outer-diameter"/);
        assert.doesNotMatch(promptSvg, /data-dimension="inner-diameter"/);
        assert.doesNotMatch(promptSvg, /data-dimension="wall-thickness"/);
        break;
    }

    assert.match(
      promptSvg,
      /data-dimension="pipe-length" data-orientation="vertical"/,
    );
    assert.equal(question.renderSurfaces.attempt.diagram, null);
    assert.equal(question.renderSurfaces.responsiveDiagramPolicy.minWidthPx, 0);
    assert.match(
      question.optionPermutationSeed,
      /^MEN-CP011-OPTION-PERMUTATION-V2\|/,
    );
    assert.doesNotMatch(question.explanation.shortcut, /\\pih/);
    if (question.measurementProfile.mixedUnits) {
      assert.match(
        question.explanation.steps.map((step) => `${step.title} ${step.body}`).join("\n"),
        /Convert/,
      );
    }
    packageCount += 1;
  }
}

assert.equal(
  packageCount,
  getMenCp011FoundationPrototypeIds().length * seedsPerPrototype,
);

console.log(
  `MEN-CP-011 Phase 2B runtime proof passed for ${packageCount} deterministic packages in addition to the 320-package base proof and 48-record balanced unit-representation batch proof.`,
);
