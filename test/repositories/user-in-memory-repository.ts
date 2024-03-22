import { randomUUID } from "crypto";

import { IPagination } from "@/core/pagination";
import {
	EditUserProps,
	IUserRepository,
} from "@/domain/register/application/repositories/user-repository";
import { Avatar } from "@/domain/register/enterprise/entities/avatar";
import { User } from "@/domain/register/enterprise/entities/user";
import { UserAvatar } from "@/domain/register/enterprise/value-objects/user-with-avatar";

export class UserInMemoryRepository implements IUserRepository {
	users: User[] = [];

	avatars: Avatar[] = [];

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find(({ props }) => props.email === email);

		if (!user) {
			return null;
		}

		return user;
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
		},
	): Promise<User> {
		const userCreated = User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role,
			id: randomUUID(),
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
		const totalPages = Math.ceil(this.users.length / 10);

		const users = this.users
			.filter(({ props: user }) => {
				if (user.name.includes(name) || name === "") {
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
					avatar: avatar || Avatar.create({ url: "" }),
					email: user.email,
					id: user.id,
					name: user.name,
					role: user.role,
				});
			})
			.slice(skip, take);

		return {
			totalElements: users.length,
			totalPages,
			data: users,
		};
	}

	async edit(user: EditUserProps): Promise<void> {
		const userIndex = this.users.findIndex(
			({ props: currentUser }) => currentUser.id === user.id,
		);

		if (userIndex === -1) {
			throw new Error("user does not exists");
		}

		this.users[userIndex] = User.create({
			age: user.age,
			email: user.email,
			name: user.name,
			role: user.role ?? "ALL",
			id: user.id,
		});
	}

	async delete(id: string): Promise<void> {
		const userIndex = this.users.findIndex(({ props: user }) => user.id === id);

		this.users.splice(userIndex, 1);
	}
}
