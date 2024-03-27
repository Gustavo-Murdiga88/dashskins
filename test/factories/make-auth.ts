import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash } from "bcrypt";

import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";

@Injectable()
export class MakeAuth {
	private prisma: PrismaUserRepository;

	private jwt: JwtService;

	constructor(prisma: PrismaUserRepository, jwt: JwtService) {
		this.prisma = prisma;
		this.jwt = jwt;
	}

	async signIn(): Promise<{
		accessToken: string;
		refreshToken: string;
	}> {
		const passwordHash = await hash("12345678", 8);
		const user = await this.prisma.save({
			age: 26,
			email: "gustavo@me.com",
			name: "Gustavo",
			role: "ALL",
			password: passwordHash,
		});

		const token = await this.jwt.signAsync({
			email: user.email,
			id: user.id,
		});
		const refreshToken = await this.jwt.signAsync(
			{
				email: user.email,
				id: user.id,
			},
			{
				expiresIn: "7d",
			},
		);

		await this.prisma.delete(user.id);

		return {
			accessToken: token,
			refreshToken,
		};
	}
}
