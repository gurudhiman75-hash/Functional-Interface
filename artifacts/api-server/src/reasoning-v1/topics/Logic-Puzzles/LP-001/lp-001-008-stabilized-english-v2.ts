import type { Caselet, ChildQuestion, PersonId } from "./index.ts";
import type { Lp002Caselet, Lp002Child } from "./lp-002.ts";
import type { Lp003Caselet } from "./lp-003.ts";
import type { Lp004Caselet } from "./lp-004.ts";
import type { GridDuty, GridPerson, GridPlace, Lp005Caselet, Lp005Child } from "./lp-005.ts";
import type { Lp006Caselet, Lp006Child, SynthCity, SynthDay, SynthPerson, SynthSubject } from "./lp-006.ts";
import type { Lp007Caselet } from "./lp-007.ts";
import type { Lp008Caselet } from "./lp-008.ts";
import {
  generateLp001BatchRetrofitV1,
  generateLp002BatchRetrofitV1,
  generateLp003BatchRetrofitV1,
  generateLp004BatchRetrofitV1,
  generateLp005BatchRetrofitV1,
  generateLp006BatchRetrofitV1,
  generateLp007BatchRetrofitV1,
  generateLp008BatchRetrofitV1,
} from "./lp-001-008-explanation-retrofit-v1.ts";

export const LP_001_008_STABILIZED_ENGLISH_V2 = Object.freeze({
  authorityId: "LP_001_008_STABILIZED_ENGLISH_V2" as const,
  status: "HUMAN_REVIEW_CANDIDATE" as const,
  packages: ["LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008"] as const,
  explanationAuthority: "LP_001_008_EXPLANATION_RETROFIT_V1" as const,
  optionRepairs: Object.freeze({
    "LP-QL-002": "same-group distractors are guaranteed to be different-group pairs",
    "LP-QL-004": "different-group distractors are guaranteed to be same-group pairs",
    "LP-QL-008": "generic person-day-location distractors are guaranteed false complete matches",
    "LP-QL-020": "all distractors retain the target person and alter duty/location",
    "LP-QL-024": "all distractors retain the target person and alter day/study-area/city",
  }),
  preserved: ["assignment", "scenario", "clues", "QL", "difficulty", "answer", "correctIndex"] as const,
});

function withAnswerAtIndex(answer: string, distractors: readonly string[], correctIndex: number): string[] {
  const uniqueDistractors = [...new Set(distractors.filter((option) => option !== answer))];
  if (uniqueDistractors.length < 3) throw new Error(`Need three distinct distractors for ${answer}.`);
  const result: string[] = [];
  let distractorIndex = 0;
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    result.push(optionIndex === correctIndex ? answer : uniqueDistractors[distractorIndex++]!);
  }
  return result;
}

function pairs<T>(items: readonly T[]): Array<[T, T]> {
  const result: Array<[T, T]> = [];
  for (let left = 0; left < items.length; left += 1) {
    for (let right = left + 1; right < items.length; right += 1) result.push([items[left]!, items[right]!]);
  }
  return result;
}

function pairLabel(pair: readonly [string, string]): string {
  return `${pair[0]} and ${pair[1]}`;
}

function stabilizeLp001(caselet: Caselet): Caselet {
  const allPairs = pairs(caselet.people);
  const samePairs = allPairs.filter(([left, right]) => caselet.assignment[left] === caselet.assignment[right]);
  const differentPairs = allPairs.filter(([left, right]) => caselet.assignment[left] !== caselet.assignment[right]);
  const children = caselet.children.map((child): ChildQuestion => {
    if (child.qlId === "LP-QL-002") {
      return { ...child, options: withAnswerAtIndex(child.answer, differentPairs.map(pairLabel), child.correctIndex) };
    }
    if (child.qlId === "LP-QL-004") {
      return { ...child, options: withAnswerAtIndex(child.answer, samePairs.map(pairLabel), child.correctIndex) };
    }
    return child;
  });
  return { ...caselet, children };
}

function lp002TrueTriple(caselet: Lp002Caselet, person: PersonId): string {
  return `${person} — ${caselet.assignment.dayByPerson[person]} — ${caselet.locationLabels[caselet.assignment.locationByPerson[person]!]}`;
}

function stabilizeLp002(caselet: Lp002Caselet): Lp002Caselet {
  const falseTriples: string[] = [];
  for (let index = 0; index < caselet.people.length; index += 1) {
    const person = caselet.people[index]!;
    const next = caselet.people[(index + 1) % caselet.people.length]!;
    falseTriples.push(
      `${person} — ${caselet.assignment.dayByPerson[person]} — ${caselet.locationLabels[caselet.assignment.locationByPerson[next]!]}`,
      `${person} — ${caselet.assignment.dayByPerson[next]} — ${caselet.locationLabels[caselet.assignment.locationByPerson[person]!]}`,
    );
  }
  const trueTriples = new Set(caselet.people.map((person) => lp002TrueTriple(caselet, person)));
  const safeDistractors = falseTriples.filter((option) => !trueTriples.has(option));
  const children = caselet.children.map((child): Lp002Child => child.qlId === "LP-QL-008"
    ? { ...child, options: withAnswerAtIndex(child.answer, safeDistractors, child.correctIndex) }
    : child);
  return { ...caselet, children };
}

function findLp005Target(caselet: Lp005Caselet, answer: string): GridPerson {
  const targetName = answer.split(" — ")[0]!;
  const target = caselet.people.find((person) => caselet.labels.people[person] === targetName);
  if (!target) throw new Error(`Unable to recover LP-005 target from ${answer}.`);
  return target;
}

function stabilizeLp005(caselet: Lp005Caselet): Lp005Caselet {
  const children = caselet.children.map((child): Lp005Child => {
    if (child.qlId !== "LP-QL-020") return child;
    const target = findLp005Target(caselet, child.answer);
    const duty = caselet.assignment.dutyByPerson[target];
    const place = caselet.assignment.placeByPerson[target];
    const targetName = caselet.labels.people[target];
    const wrongDuties = caselet.duties.filter((candidate) => candidate !== duty);
    const wrongPlaces = caselet.places.filter((candidate) => candidate !== place);
    const distractors = [
      ...wrongPlaces.map((wrongPlace) => `${targetName} — ${caselet.labels.duties[duty]} — ${caselet.labels.places[wrongPlace]}`),
      ...wrongDuties.map((wrongDuty) => `${targetName} — ${caselet.labels.duties[wrongDuty]} — ${caselet.labels.places[place]}`),
      ...wrongDuties.flatMap((wrongDuty, index) => {
        const wrongPlace = wrongPlaces[index % wrongPlaces.length]!;
        return [`${targetName} — ${caselet.labels.duties[wrongDuty]} — ${caselet.labels.places[wrongPlace]}`];
      }),
    ];
    return { ...child, options: withAnswerAtIndex(child.answer, distractors, child.correctIndex) };
  });
  return { ...caselet, children };
}

function findLp006Target(caselet: Lp006Caselet, answer: string): SynthPerson {
  const targetName = answer.split(" — ")[0]!;
  const target = caselet.people.find((person) => caselet.labels.people[person] === targetName);
  if (!target) throw new Error(`Unable to recover LP-006 target from ${answer}.`);
  return target;
}

function stabilizeLp006(caselet: Lp006Caselet): Lp006Caselet {
  const children = caselet.children.map((child): Lp006Child => {
    if (child.qlId !== "LP-QL-024") return child;
    const target = findLp006Target(caselet, child.answer);
    const day = caselet.assignment.dayByPerson[target];
    const subject = caselet.assignment.subjectByPerson[target];
    const city = caselet.assignment.cityByPerson[target];
    const targetName = caselet.labels.people[target];
    const wrongDays = caselet.days.filter((candidate) => candidate !== day);
    const wrongSubjects = caselet.subjects.filter((candidate) => candidate !== subject);
    const wrongCities = caselet.cities.filter((candidate) => candidate !== city);
    const format = (optionDay: SynthDay, optionSubject: SynthSubject, optionCity: SynthCity) => `${targetName} — ${optionDay} — ${caselet.labels.subjects[optionSubject]} — ${caselet.labels.cities[optionCity]}`;
    const distractors = [
      ...wrongDays.map((wrongDay) => format(wrongDay, subject, city)),
      ...wrongSubjects.map((wrongSubject) => format(day, wrongSubject, city)),
      ...wrongCities.map((wrongCity) => format(day, subject, wrongCity)),
      ...wrongDays.map((wrongDay, index) => format(wrongDay, wrongSubjects[index % wrongSubjects.length]!, wrongCities[index % wrongCities.length]!)),
    ];
    return { ...child, options: withAnswerAtIndex(child.answer, distractors, child.correctIndex) };
  });
  return { ...caselet, children };
}

export function generateLp001BatchStabilizedV2(seed = "lp-001-stabilized-v2", count = 8): Caselet[] {
  return generateLp001BatchRetrofitV1(seed, count).map(stabilizeLp001);
}
export function generateLp002BatchStabilizedV2(seed = "lp-002-stabilized-v2", count = 8): Lp002Caselet[] {
  return generateLp002BatchRetrofitV1(seed, count).map(stabilizeLp002);
}
export function generateLp003BatchStabilizedV2(seed = "lp-003-stabilized-v2", count = 8): Lp003Caselet[] {
  return generateLp003BatchRetrofitV1(seed, count);
}
export function generateLp004BatchStabilizedV2(seed = "lp-004-stabilized-v2", count = 8): Lp004Caselet[] {
  return generateLp004BatchRetrofitV1(seed, count);
}
export function generateLp005BatchStabilizedV2(seed = "lp-005-stabilized-v2", count = 8): Lp005Caselet[] {
  return generateLp005BatchRetrofitV1(seed, count).map(stabilizeLp005);
}
export function generateLp006BatchStabilizedV2(seed = "lp-006-stabilized-v2", count = 8): Lp006Caselet[] {
  return generateLp006BatchRetrofitV1(seed, count).map(stabilizeLp006);
}
export function generateLp007BatchStabilizedV2(seed = "lp-007-stabilized-v2", count = 8): Lp007Caselet[] {
  return generateLp007BatchRetrofitV1(seed, count);
}
export function generateLp008BatchStabilizedV2(seed = "lp-008-stabilized-v2", count = 8): Lp008Caselet[] {
  return generateLp008BatchRetrofitV1(seed, count);
}
