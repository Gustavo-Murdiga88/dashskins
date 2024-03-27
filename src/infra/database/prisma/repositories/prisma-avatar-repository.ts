import { Injectable } from "@nestjs/common";

import { AvatarRepository } from "@/domain/register/application/repositories/avatar-repository";
import { Avatar } from "@/domain/register/enterprise/entities/avatar";

import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAvatarRepository implements AvatarRepository {
	private prisma: PrismaService;

	constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	async findByUserId(userId: string): Promise<Avatar | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId,
			},
			include: {
				avatar: true,
			},
		});

		if (!user?.avatar) {
			return null;
		}

		return Avatar.create({
			userId: user.id,
			url: user.avatar?.url,
			id: user.avatar?.id,
		});
	}

	async findById(id: string): Promise<Avatar | null> {
		const avatar = await this.prisma.avatar.findUnique({
			where: {
				id,
			},
		});

		if (!avatar) {
			return null;
		}

		return Avatar.create({
			userId: avatar.id,
			url: avatar.url,
			id: avatar.id,
		});
	}

	async save({
		url,
		userId,
	}: {
		url: string;
		userId: string;
	}): Promise<Avatar> {
		const avatar = await this.prisma.avatar.create({
			data: {
				url,
				user_id: userId,
			},
		});

		return Avatar.create({
			userId: avatar.id,
			url: avatar.url,
			id: avatar.id,
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.avatar.delete({
			where: {
				id,
			},
		});
	}

	async edit(avatar: { url: string; id: string }): Promise<Avatar> {
		const avatarEdited = await this.prisma.avatar.update({
			where: {
				id: avatar.id,
			},
			data: {
				url: avatar.url,
			},
		});

		return Avatar.create({
			userId: avatarEdited.id,
			id: avatarEdited.id,
			url: avatarEdited.url,
		});
	}
}
