import { hash } from "bcrypt";

import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";

export class MakeUser {
	private prisma: PrismaUserRepository;

	constructor(prisma: PrismaUserRepository) {
		this.prisma = prisma;
	}

	async createUser(data: {
		age: number;
		email: string;
		name: string;
		role: "ALL" | "EDIT" | "DELETE";
		password: string;
	}) {
		const passwordHash = await hash(data.password, 8);
		const user = await this.prisma.save({
			age: data.age,
			email: data.email,
			name: data.name,
			role: data.role,
			password: passwordHash,
		});

		return user;
	}
}
