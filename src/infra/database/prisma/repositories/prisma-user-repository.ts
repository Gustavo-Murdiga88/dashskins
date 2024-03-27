import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { IPagination } from "@/core/pagination";
import {
	EditUserProps,
	ListUserFilter,
	SaveUserProps,
	UserRepository,
} from "@/domain/register/application/repositories/user-repository";
import { User } from "@/domain/register/enterprise/entities/user";
import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

import { PrismaUserMapper } from "../mappers/user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
	private prisma: PrismaService;

	constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	async create(user: SaveUserProps): Promise<void> {
		await this.prisma.user.create({
			data: {
				age: user.age,
				email: user.email,
				name: user.name,
				role: user.role,
				password: user.password,
			},
		});
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
			password: user.password,
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
			password: faker.internet.password(),
		});
	}

	async save(user: SaveUserProps): Promise<User> {
		const userCreated = await this.prisma.user.create({
			data: {
				age: user.age,
				email: user.email,
				name: user.name,
				role: user.role,
				password: user.password,
			},
		});

		return User.create({
			age: userCreated.age,
			id: userCreated.id,
			email: userCreated.email,
			name: userCreated.name,
			role: userCreated.role,
			password: user.password,
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
		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				age: user.age,
				email: user.email,
				name: user.name,
				role: user.role,
				password: user.password,
			},
		});

		return User.create({
			id: updatedUser.id,
			age: updatedUser.age,
			email: updatedUser.email,
			name: updatedUser.name,
			role: updatedUser.role,
			password: updatedUser.password,
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
