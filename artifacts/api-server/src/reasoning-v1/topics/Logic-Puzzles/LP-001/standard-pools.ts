/**
 * Standard, widely recognised city names for exam-style matching questions.
 * Keep city objects neutral and familiar; avoid small localities and abbreviations.
 */
export const STANDARD_EXAM_CITY_POOL = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Lucknow",
  "Pune",
  "Ahmedabad",
  "Bhopal",
  "Chandigarh",
  "Dehradun",
  "Guwahati",
  "Indore",
  "Kanpur",
  "Kochi",
  "Nagpur",
  "Patna",
  "Ranchi",
  "Surat",
  "Bhubaneswar",
  "Visakhapatnam",
  "Thiruvananthapuram",
  "Coimbatore",
] as const;

export type StandardExamCity = (typeof STANDARD_EXAM_CITY_POOL)[number];

export function examCityPlace(city: StandardExamCity, placeType: "Branch" | "Centre"): string {
  return `${city} ${placeType}`;
}
