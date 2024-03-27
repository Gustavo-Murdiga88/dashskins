import { Injectable } from "@nestjs/common";

import { PrismaAvatarRepository } from "@/infra/database/prisma/repositories/prisma-avatar-repository";

@Injectable()
export class MakeAvatar {
	private prisma: PrismaAvatarRepository;

	constructor(prisma: PrismaAvatarRepository) {
		this.prisma = prisma;
	}

	async createAvatar(data: { userId: string; url: string }) {
		const avatar = await this.prisma.save({
			url: data.url,
			userId: data.userId,
		});

		return avatar;
	}
}
