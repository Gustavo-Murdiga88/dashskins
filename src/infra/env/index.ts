import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3000),
	STORAGE: z.string(),
});

export function env() {
	const parseEnv = envSchema.safeParse(process.env);

	if (!parseEnv.success) {
		throw new Error(parseEnv.error.message);
	}

	return parseEnv.data;
}
export type Env = z.infer<typeof envSchema>;
