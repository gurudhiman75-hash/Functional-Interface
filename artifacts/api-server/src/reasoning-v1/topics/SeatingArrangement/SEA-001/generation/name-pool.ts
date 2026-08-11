import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

/**
 * Broad, neutral participant pool for English seating caselets.
 * Names are presentation variables only; mathematical structure must never depend on them.
 */
export const SEA_001_ENGLISH_NAME_POOL = [
  "Aarav", "Aditi", "Aman", "Amrit", "Ananya", "Arjun", "Bhavna", "Bharat",
  "Charan", "Deepak", "Dev", "Diya", "Farah", "Gauri", "Gurleen", "Harjit",
  "Harleen", "Hema", "Ishaan", "Jasleen", "Jaspreet", "Jaya", "Kabir", "Karan",
  "Kavita", "Kavya", "Kiran", "Kriti", "Lakshya", "Manav", "Manvi", "Meena",
  "Mehak", "Mohit", "Navdeep", "Neha", "Nikhil", "Naina", "Pooja", "Pranav",
  "Rahul", "Ravinder", "Riya", "Ritu", "Rohan", "Rohit", "Sahil", "Sana",
  "Sandeep", "Shruti", "Simran", "Tanya", "Tanvi", "Uday", "Varun", "Vikas",
  "Yash", "Zoya", "Akash", "Anmol", "Balraj", "Ekta", "Gagandeep", "Harman",
  "Isha", "Jatin", "Komal", "Mandeep", "Muskan", "Naveen", "Palak", "Param",
  "Preet", "Raj", "Raman", "Rupinder", "Sakshi", "Sonam", "Taran", "Vandana",
] as const;

export function selectSea001Names(seed: string, count: number, context: string): string[] {
  if (!Number.isInteger(count) || count < 1 || count > SEA_001_ENGLISH_NAME_POOL.length) {
    throw new Error(`Invalid SEA-001 participant count: ${count}`);
  }
  // Keep presentation randomness deliberately separate from the structural generator seed.
  // The extra namespace prevents a stable internal person ID from becoming visually associated
  // with the same display name or seat across a corpus.
  const random = new DeterministicRandom(`SEA-001:DISPLAY-NAMES:${context}:${seed}`);
  return random.shuffle(SEA_001_ENGLISH_NAME_POOL).slice(0, count);
}
