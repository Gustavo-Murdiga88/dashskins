import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

import { IPagination } from "@/core/pagination";
import {
	EditUserProps,
	SaveUserProps,
	UserRepository,
} from "@/domain/register/application/repositories/user-repository";
import { Avatar } from "@/domain/register/enterprise/entities/avatar";
import { User } from "@/domain/register/enterprise/entities/user";
import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

export class UserInMemoryRepository implements UserRepository {
	users: User[] = [];

	avatars: Avatar[] = [];

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find(({ props }) => props.email === email);

		if (!user) {
			return null;
		}

		return user;
	}

	async create(user: SaveUserProps): Promise<void> {
		const userCreated = User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role,
			id: randomUUID(),
			password: user.password,
		});

		this.users.push(userCreated);
	}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find(({ props }) => props.id === id);
		if (!user) {
			return null;
		}

		return user;
	}

	async save(
		user: { id?: string | undefined; avatar?: Avatar | undefined } & {
			name: string;
			age: number;
			email: string;
			role: "EDIT" | "DELETE" | "ALL";
			password: string;
		},
	): Promise<User> {
		const userCreated = User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role,
			id: randomUUID(),
			password: user.password,
		});

		this.users.push(userCreated);

		return userCreated;
	}

	async list({
		name = "",
		page = 0,
	}: {
		name?: string | undefined;
		page?: number | undefined;
	}): Promise<IPagination<UserAvatar>> {
		const skip = page * 10;
		const take = skip + 10;

		const users = this.users
			.filter(({ props: user }) => {
				if (user.name.includes(name) || !name) {
					return true;
				}

				return false;
			})
			.map(({ props: user }) => {
				const avatar = this.avatars.find(
					({ props: currentAvatar }) => user.id === currentAvatar.id,
				);

				return UserAvatar.create({
					age: user.age,
					avatar:
						avatar ||
						Avatar.create({ userId: user.id, url: faker.image.url() }),
					email: user.email,
					id: user.id,
					name: user.name,
					role: user.role,
				});
			});

		return {
			totalElements: users.length,
			totalPages: Math.ceil(users.length / 10),
			data: users.slice(skip, take),
		};
	}

	async update(user: EditUserProps): Promise<User> {
		const userIndex = this.users.findIndex(
			({ props: currentUser }) => currentUser.id === user.id,
		);

		this.users[userIndex] = User.create({
			age: user.age ?? this.users[userIndex].props.age,
			email: user.email ?? this.users[userIndex].props.email,
			name: user.name ?? this.users[userIndex].props.name,
			role: user.role ?? this.users[userIndex].props.role,
			id: user.id,
			password: user.password ?? this.users[userIndex].props.password,
		});

		return this.users[userIndex];
	}

	async delete(id: string): Promise<void> {
		const userIndex = this.users.findIndex(({ props: user }) => user.id === id);

		this.users.splice(userIndex, 1);
	}
}
