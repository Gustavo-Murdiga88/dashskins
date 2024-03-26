import { JwtSignOptions } from "@nestjs/jwt";

export abstract class JWT {
	abstract sign(
		payload: Record<string, any>,
		options?: JwtSignOptions,
	): Promise<string>;
}
