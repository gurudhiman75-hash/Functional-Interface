import {
  generateIntCp001ClosurePrototype,
  type IntCp001ClosurePrototypeId,
} from "./final-closure";

const UNIQUE_OPTION_FAILURE = "could not construct four unique options";

export function generateIntCp001RobustClosurePrototype(
  prototypeId: IntCp001ClosurePrototypeId,
  seed: string,
): ReturnType<typeof generateIntCp001ClosurePrototype> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const sourceSeed = attempt === 0 ? seed : `${seed}:valid-option-state-${attempt}`;
    try {
      return generateIntCp001ClosurePrototype(prototypeId, sourceSeed);
    } catch (error) {
      lastError = error;
      if (!(error instanceof Error) || !error.message.includes(UNIQUE_OPTION_FAILURE)) throw error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`${prototypeId} could not find a valid four-option state.`);
}
