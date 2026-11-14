import { QuestionRichText } from "@/components/QuestionRichText";

type MathTextProps = {
  content: string;
  className?: string;
  inline?: boolean;
  lang?: string;
};

/**
 * Lightweight wrapper for question stems/options/explanations that may contain
 * inline MathJax delimiters such as `$...$` or `$$...$$`.
 */
export default function MathText({
  content,
  className,
  inline = false,
  lang,
}: MathTextProps) {
  return (
    <QuestionRichText
      content={content}
      className={className}
      inline={inline}
      lang={lang}
    />
  );
}
