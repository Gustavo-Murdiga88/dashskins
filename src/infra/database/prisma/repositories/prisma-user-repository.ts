import { Injectable } from "@nestjs/common";

import { IPagination } from "@/core/pagination";
import {
	EditUserProps,
	IUserRepository,
	ListUserFilter,
	SaveUserProps,
} from "@/domain/register/application/repositories/user-repository";
import { User } from "@/domain/register/enterprise/entities/user";
import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

import { PrismaUserMapper } from "../mappers/user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
	private prisma: PrismaService;

	constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			return null;
		}

		return User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role,
		});
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: {
				id,
			},
		});

		if (!user) {
			return null;
		}

		return User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role,
		});
	}

	async save(user: SaveUserProps): Promise<User> {
		const userCreated = await this.prisma.user.create({
			data: {
				age: user.age,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});

		return User.create({
			age: userCreated.age,
			id: userCreated.id,
			email: userCreated.email,
			name: userCreated.name,
			role: userCreated.role,
		});
	}

	async list({
		name,
		page = 0,
	}: ListUserFilter): Promise<IPagination<UserAvatar>> {
		const take = 10;
		const skip = page * take;

		const { _count } = await this.prisma.user.aggregate({
			_count: true,
			where: {
				name: {
					contains: name,
				},
			},
		});

		const prismaUserAndAvatar = await this.prisma.user.findMany({
			where: {
				name: {
					contains: name,
				},
			},
			include: {
				avatar: true,
			},
			skip,
			take,
		});

		const userAndAvatar = prismaUserAndAvatar.map(({ avatar, ...user }) =>
			PrismaUserMapper.userAvatarToDomain({ avatar, user }),
		);

		return {
			data: userAndAvatar,
			totalElements: _count,
			totalPages: Math.ceil(_count / take),
		};
	}

	async update(user: EditUserProps): Promise<User> {
		const userCreated = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				age: user.age,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});

		return User.create({
			age: userCreated.age,
			email: userCreated.email,
			name: userCreated.name,
			role: userCreated.role,
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.user.delete({
			where: {
				id,
			},
		});
	}
}
