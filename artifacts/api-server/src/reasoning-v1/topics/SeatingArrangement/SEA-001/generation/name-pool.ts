import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";

/**
 * Broad, neutral participant pool for English seating caselets.
 * Names are presentation variables only; mathematical structure must never depend on them.
 */
export const SEA_001_ENGLISH_NAME_POOL = [
  "Aditi", "Aman", "Ananya", "Arjun", "Bhavna", "Bharat", "Charan", "Deepak",
  "Diya", "Farah", "Gauri", "Gurleen", "Harjit", "Harleen", "Hema", "Ishaan",
  "Jaspreet", "Jaya", "Karan", "Kavita", "Kavya", "Kriti", "Lakshya", "Manav",
  "Manvi", "Meena", "Mehak", "Navdeep", "Neha", "Nikhil", "Pooja", "Rahul",
  "Riya", "Ritu", "Rohit", "Sahil", "Sana", "Shruti", "Simran", "Tanya",
  "Tanvi", "Uday", "Varun", "Vikas", "Yash", "Zoya", "Aarav", "Naina",
] as const;

export function selectSea001Names(seed: string, count: number, context: string): string[] {
  if (!Number.isInteger(count) || count < 1 || count > SEA_001_ENGLISH_NAME_POOL.length) {
    throw new Error(`Invalid SEA-001 participant count: ${count}`);
  }
  const random = new DeterministicRandom(`${seed}:${context}:names`);
  return random.shuffle(SEA_001_ENGLISH_NAME_POOL).slice(0, count);
}
