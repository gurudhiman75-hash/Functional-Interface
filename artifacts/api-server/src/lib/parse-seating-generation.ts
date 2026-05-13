import type {
  GeneratorOptions,
} from "./core/generator-engine";

/**
 * Accepts optional `seatingGeneration` from JSON request bodies.
 */
export function parseSeatingGenerationBody(
  body: unknown,
): GeneratorOptions["seatingGeneration"] | undefined {
  if (
    !body ||
    typeof body !== "object"
  ) {
    return undefined;
  }

  const raw = (
    body as Record<
      string,
      unknown
    >
  )[
    "seatingGeneration"
  ];

  if (
    !raw ||
    typeof raw !== "object"
  ) {
    return undefined;
  }

  const record =
    raw as Record<
      string,
      unknown
    >;
  const quality =
    record[
      "quality"
    ];
  const normalizedQuality =
    quality === "draft" ||
    quality === "standard" ||
    quality === "production"
      ? quality
      : undefined;

  const extraRaw =
    record[
      "extraAttempts"
    ];
  const extraAttempts =
    typeof extraRaw ===
      "number" &&
    Number.isFinite(
      extraRaw,
    )
      ? extraRaw
      : undefined;

  if (
    !normalizedQuality &&
    extraAttempts ===
      undefined
  ) {
    return undefined;
  }

  return {
    ...(normalizedQuality
      ? {
          quality:
            normalizedQuality,
        }
      : {}),
    ...(extraAttempts !==
      undefined
      ? {
          extraAttempts,
        }
      : {}),
  };
}
