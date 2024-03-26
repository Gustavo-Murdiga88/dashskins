import { INestApplication } from "@nestjs/common";
import { hash } from "bcrypt";
import request from "supertest";

import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";

export class MakeAuth {
	private prisma: PrismaUserRepository;

	constructor(prisma: PrismaUserRepository) {
		this.prisma = prisma;
	}

	async signIn(app: INestApplication): Promise<{
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

		const session = await request(app.getHttpServer()).post("/session").send({
			email: "gustavo@me.com",
			password: "12345678",
		});

		await this.prisma.delete(user.id);

		return {
			accessToken: session.body.token,
			refreshToken: session.body.refreshToken,
		};
	}
}
