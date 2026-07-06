import * as fs from "fs";
import * as path from "path";
import { EntityCategory } from "./entity-types";
import { EntityLibrary } from "./entity-library";
import { EntityResolver } from "./entity-resolver";
import { EntityPicker } from "./entity-picker";

export const ENTITY_CONTEXT_MAP: Record<string, EntityCategory> = {
  personA: "person",
  personB: "person",
  personC: "person",
  personD: "person",
  targetPerson: "person",
  personAId: "person",
  personBId: "person",
  personCId: "person",
  personDId: "person",
  targetPersonId: "person",

  groupA: "group",
  groupB: "group",
  groupAId: "group",
  groupBId: "group",
  groupName: "place",
  groupNameId: "place",
  contextName: "place",
  contextNameId: "place",

  liquid1: "liquid",
  liquid2: "liquid",
  liquid3: "liquid",
  liquidA: "liquid",
  liquidB: "liquid",
  mixtureType: "container",
  liquid1Id: "liquid",
  liquid2Id: "liquid",
  liquid3Id: "liquid",
  liquidAId: "liquid",
  liquidBId: "liquid",
  mixtureTypeId: "container",

  metal1: "metal",
  metal2: "metal",
  metal1Id: "metal",
  metal2Id: "metal",

  subject1: "subject",
  subject2: "subject",
  subject3: "subject",
  sub1: "subject",
  sub2: "subject",
  sub3: "subject",
  subject1Id: "subject",
  subject2Id: "subject",
  subject3Id: "subject",
  sub1Id: "subject",
  sub2Id: "subject",
  sub3Id: "subject",

  cityId: "city",
  objectId: "object",
  occupationId: "occupation",
  containerId: "container",

  itemA: "object",
  itemB: "object",
  itemC: "object",
  itemAId: "object",
  itemBId: "object",
  itemCId: "object",

};

let sharedLibrary: EntityLibrary | undefined;
let sharedResolver: EntityResolver | undefined;
let sharedPicker: EntityPicker | undefined;

function entityLibraryPath() {
  const candidates = [
    path.join(process.cwd(), "src/quant-v4/common/entity-libraries"),
    path.join(process.cwd(), "artifacts/api-server/src/quant-v4/common/entity-libraries"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0]!;
}

export function getEntityCategoryForVariable(variableName: string): EntityCategory | undefined {
  return ENTITY_CONTEXT_MAP[variableName] ?? ENTITY_CONTEXT_MAP[variableName.replace(/Id$/, "")];
}

export function getQuantV4EntityLibrary() {
  if (!sharedLibrary) {
    sharedLibrary = new EntityLibrary(entityLibraryPath());
    sharedLibrary.load();
  }
  return sharedLibrary;
}

export function getQuantV4EntityResolver() {
  if (!sharedResolver) sharedResolver = new EntityResolver(getQuantV4EntityLibrary());
  return sharedResolver;
}

export function getQuantV4EntityPicker() {
  if (!sharedPicker) sharedPicker = new EntityPicker(getQuantV4EntityLibrary());
  return sharedPicker;
}
