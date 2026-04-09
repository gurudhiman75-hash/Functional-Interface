export type HealthCheckResponse = {
  status: "ok";
};

export const HealthCheckResponse = {
  parse(value: unknown): HealthCheckResponse {
    if (
      typeof value === "object" &&
      value !== null &&
      "status" in value &&
      value.status === "ok"
    ) {
      return { status: "ok" };
    }

    throw new Error("Invalid health check response");
  },
};
