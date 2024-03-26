import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { JWT } from "@/domain/register/application/cryptography/jwt";

@Injectable()
export class JWTSign implements JWT {
	private jwtService: JwtService;

	constructor(jwtService: JwtService) {
		this.jwtService = jwtService;
	}

	async sign(
		payload: Record<string, any>,
		options?: JwtSignOptions,
	): Promise<string> {
		return this.jwtService.signAsync(payload, options);
	}
}
