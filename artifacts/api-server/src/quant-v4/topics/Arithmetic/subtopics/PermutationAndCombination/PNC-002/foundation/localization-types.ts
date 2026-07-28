import type {
  PncStudentExplanationSection,
  PncStudentPresentation,
} from "./student-presentation";

export type PncStudentLocale = "hi-IN" | "pa-IN";

export type PncLocalizationEditorialStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PncLocalizedStudentPresentation extends Omit<
  PncStudentPresentation,
  "stem" | "optionUnit" | "displayOptions" | "answerLabel" | "explanationSections"
> {
  locale: PncStudentLocale;
  sourceLocale: "en-GB";
  stem: string;
  optionUnit: string;
  displayOptions: string[];
  answerLabel: string;
  explanationSections: PncStudentExplanationSection[];
  editorialStatus: PncLocalizationEditorialStatus;
  publiclyPublishable: false;
}
