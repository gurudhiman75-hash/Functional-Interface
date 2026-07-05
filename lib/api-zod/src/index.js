export const HealthCheckResponse = {
    parse(value) {
        if (typeof value === "object" &&
            value !== null &&
            "status" in value &&
            value.status === "ok") {
            return { status: "ok" };
        }
        throw new Error("Invalid health check response");
    },
};
function normalizeTimestamp(value) {
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    if (typeof value === "string") {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? null : parsed;
    }
    if (value instanceof Date)
        return value.getTime();
    return null;
}
export const User = {
    parse(value) {
        if (typeof value === "object" &&
            value !== null &&
            "id" in value &&
            typeof value.id === "string" &&
            "email" in value &&
            typeof value.email === "string" &&
            "name" in value &&
            typeof value.name === "string" &&
            "role" in value &&
            (value.role === "admin" || value.role === "student") &&
            "createdAt" in value &&
            normalizeTimestamp(value.createdAt) !== null &&
            "updatedAt" in value &&
            normalizeTimestamp(value.updatedAt) !== null) {
            return {
                ...value,
                createdAt: normalizeTimestamp(value.createdAt),
                updatedAt: normalizeTimestamp(value.updatedAt),
            };
        }
        throw new Error("Invalid user");
    },
};
export const Category = {
    parse(value) {
        if (typeof value === "object" &&
            value !== null &&
            "id" in value &&
            typeof value.id === "string" &&
            "name" in value &&
            typeof value.name === "string" &&
            "description" in value &&
            typeof value.description === "string" &&
            "icon" in value &&
            typeof value.icon === "string" &&
            "color" in value &&
            typeof value.color === "string" &&
            "testsCount" in value &&
            typeof value.testsCount === "number") {
            return value;
        }
        throw new Error("Invalid category");
    },
};
export const Test = {
    parse(value) {
        // Simplified validation
        if (typeof value === "object" && value !== null && "id" in value) {
            return value;
        }
        throw new Error("Invalid test");
    },
};
export const TestAttempt = {
    parse(value) {
        // Simplified
        if (typeof value === "object" && value !== null && "id" in value) {
            return value;
        }
        throw new Error("Invalid attempt");
    },
};
