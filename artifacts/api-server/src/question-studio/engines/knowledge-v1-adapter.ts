import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { knowledgeV1Com001QuestionStudioAdapter } from "./knowledge-v1-com001-adapter";
import { knowledgeV1Com002QuestionStudioAdapterV3 } from "./knowledge-v1-com002-adapter-v3";
import {
  isCom003QuestionStudioRequestV2,
  knowledgeV1Com003QuestionStudioAdapterV2,
} from "./knowledge-v1-com003-adapter-v2";
import {
  isCom003WordTabsQuestionStudioRequest,
  knowledgeV1Com003WordTabsQuestionStudioAdapterV1,
} from "./knowledge-v1-com003-word-tabs-adapter-v1";
import {
  isCom003OfficeTabsQuestionStudioRequest,
  knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1,
} from "./knowledge-v1-com003-office-tabs-adapter-v1";
import {
  isCom005QuestionStudioRequestV1,
  knowledgeV1Com005QuestionStudioAdapterV1,
} from "./knowledge-v1-com005-adapter-v1";
import {
  isCom006QuestionStudioRequestV1,
  knowledgeV1Com006QuestionStudioAdapterV1,
} from "./knowledge-v1-com006-adapter-v1";
import {
  isCom004QuestionStudioRequestV1,
  knowledgeV1Com004QuestionStudioAdapterV1,
} from "./knowledge-v1-com004-adapter-v1";
import {
  isCom007QuestionStudioRequestV1,
  knowledgeV1Com007QuestionStudioAdapterV1,
} from "./knowledge-v1-com007-adapter-v1";
import {
  isCom008QuestionStudioRequestV1,
  knowledgeV1Com008QuestionStudioAdapterV1,
} from "./knowledge-v1-com008-adapter-v1";
import {
  isEnv001QuestionStudioRequestV1,
  knowledgeV1Env001QuestionStudioAdapterV1,
} from "./knowledge-v1-env001-adapter-v1";
import {
  isEco001QuestionStudioRequestV1,
  knowledgeV1Eco001QuestionStudioAdapterV1,
} from "./knowledge-v1-eco001-adapter-v1";
import {
  isGeoCli001QuestionStudioRequestV1,
  knowledgeV1GeoCli001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-cli-001-adapter-v1";
import {
  isGeoPhy001QuestionStudioRequestV1,
  knowledgeV1GeoPhy001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-phy-001-adapter-v1";
import {
  isGeoRiv001QuestionStudioRequestV1,
  knowledgeV1GeoRiv001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-riv-001-adapter-v1";
import {
  isGeoSoi001QuestionStudioRequestV1,
  knowledgeV1GeoSoi001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-soi-001-adapter-v1";
import {
  isPgk001QuestionStudioRequestV1,
  knowledgeV1Pgk001QuestionStudioAdapterV1,
} from "./knowledge-v1-pgk001-adapter-v1";
import {
  isPgk001MatchFollowingQuestionStudioRequestV1,
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1,
} from "./knowledge-v1-pgk001-match-following-adapter-v1";
import {
  isHis001QuestionStudioRequestV1,
  knowledgeV1His001QuestionStudioAdapterV1,
} from "./knowledge-v1-his001-adapter-v1";
import { isWhi001QuestionStudioRequestV1, knowledgeV1Whi001QuestionStudioAdapterV1 } from "./knowledge-v1-whi001-adapter-v1";
import {
  isPol001QuestionStudioRequestV1,
  knowledgeV1Pol001QuestionStudioAdapterV1,
} from "./knowledge-v1-pol001-adapter-v1";
import {
  isSci001QuestionStudioRequestV1,
  knowledgeV1Sci001QuestionStudioAdapterV1,
} from "./knowledge-v1-sci001-adapter-v1";

/**
 * Subject-family composite for knowledge-v1. Individual chapter adapters own
 * their content/freeze/lifecycle rules; this adapter only exposes them through
 * one engine ID across Static GK subject families.
 */
export const knowledgeV1QuestionStudioAdapter: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    const packages = [
      ...knowledgeV1Com001QuestionStudioAdapter.listPackages(),
      ...knowledgeV1Com002QuestionStudioAdapterV3.listPackages(),
      ...knowledgeV1Com003QuestionStudioAdapterV2.listPackages(),
      ...knowledgeV1Com003WordTabsQuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com004QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com005QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com006QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com007QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Com008QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Env001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Eco001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1GeoCli001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1GeoPhy001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1GeoRiv001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1GeoSoi001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Pgk001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1His001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Whi001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Pol001QuestionStudioAdapterV1.listPackages(),
      ...knowledgeV1Sci001QuestionStudioAdapterV1.listPackages(),
    ];
    const ids = packages.map((pkg) => pkg.packageId);
    if (new Set(ids).size !== ids.length) {
      throw new Error("knowledge-v1 Question Studio package IDs must be unique");
    }
    return packages;
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    if (isSci001QuestionStudioRequestV1(request)) {
      return knowledgeV1Sci001QuestionStudioAdapterV1.generate(request);
    }
    if (isEnv001QuestionStudioRequestV1(request)) {
      return knowledgeV1Env001QuestionStudioAdapterV1.generate(request);
    }
    if (isEco001QuestionStudioRequestV1(request)) {
      return knowledgeV1Eco001QuestionStudioAdapterV1.generate(request);
    }
    if (isGeoCli001QuestionStudioRequestV1(request)) {
      return knowledgeV1GeoCli001QuestionStudioAdapterV1.generate(request);
    }
    if (isGeoPhy001QuestionStudioRequestV1(request)) {
      return knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate(request);
    }
    if (isGeoRiv001QuestionStudioRequestV1(request)) {
      return knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate(request);
    }
    if (isGeoSoi001QuestionStudioRequestV1(request)) {
      return knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate(request);
    }
    if (isPgk001MatchFollowingQuestionStudioRequestV1(request)) {
      return knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate(request);
    }
    if (isPgk001QuestionStudioRequestV1(request)) {
      return knowledgeV1Pgk001QuestionStudioAdapterV1.generate(request);
    }
    if (isHis001QuestionStudioRequestV1(request)) {
      return knowledgeV1His001QuestionStudioAdapterV1.generate(request);
    }
    if (isWhi001QuestionStudioRequestV1(request)) {
      return knowledgeV1Whi001QuestionStudioAdapterV1.generate(request);
    }
    if (isPol001QuestionStudioRequestV1(request)) {
      return knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
    }
    if (isCom004QuestionStudioRequestV1(request)) {
      return knowledgeV1Com004QuestionStudioAdapterV1.generate(request);
    }
    if (isCom003WordTabsQuestionStudioRequest(request)) {
      return knowledgeV1Com003WordTabsQuestionStudioAdapterV1.generate(request);
    }
    if (isCom003OfficeTabsQuestionStudioRequest(request)) {
      return knowledgeV1Com003OfficeTabsQuestionStudioAdapterV1.generate(request);
    }
    if (isCom003QuestionStudioRequestV2(request)) {
      return knowledgeV1Com003QuestionStudioAdapterV2.generate(request);
    }
    if (isCom005QuestionStudioRequestV1(request)) {
      return knowledgeV1Com005QuestionStudioAdapterV1.generate(request);
    }
    if (isCom006QuestionStudioRequestV1(request)) {
      return knowledgeV1Com006QuestionStudioAdapterV1.generate(request);
    }
    if (isCom007QuestionStudioRequestV1(request)) {
      return knowledgeV1Com007QuestionStudioAdapterV1.generate(request);
    }
    if (isCom008QuestionStudioRequestV1(request)) {
      return knowledgeV1Com008QuestionStudioAdapterV1.generate(request);
    }
    if (request.packageId === "COM-002") {
      return knowledgeV1Com002QuestionStudioAdapterV3.generate(request);
    }

    // Preserve the established knowledge-v1 default: requests that explicitly
    // target COM-001 or omit packageId continue through COM-001. Unknown package
    // IDs still fail closed in the owning adapter.
    return knowledgeV1Com001QuestionStudioAdapter.generate(request);
  },
};
