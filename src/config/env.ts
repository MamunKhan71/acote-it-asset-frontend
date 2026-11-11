import { z } from "zod";

const schema = z.object({
    VITE_API_URL: z.url(),
    VITE_API_MOCK: z
        .enum(["true", "false"])
        .default("false")
        .transform((value) => value === "true"),
});

export const env = schema.parse(import.meta.env);
