import { randomUUID } from "crypto";

import { AvatarRepository } from "@/domain/register/application/repositories/avatar-repository";
import { Avatar } from "@/domain/register/enterprise/entities/avatar";

export class AvatarInMemoryRepository implements AvatarRepository {
	avatars: Avatar[] = [];

	async findByUserId(userId: string): Promise<Avatar | null> {
		const avatarByUserId = this.avatars.find(
			({ props }) => props.userId === userId,
		);

		if (!avatarByUserId) {
			return null;
		}

		return avatarByUserId;
	}

	async findById(id: string): Promise<Avatar | undefined> {
		const avatar = this.avatars.find(({ props }) => props.id === id);
		return avatar;
	}

	async save({
		url,
		userId,
	}: {
		url: string;
		userId: string;
	}): Promise<Avatar> {
		const avatarCreated = Avatar.create({
			url,
			id: randomUUID(),
			userId,
		});

		this.avatars.push(avatarCreated);

		return avatarCreated;
	}

	async delete(id: string): Promise<void> {
		const avatarIndex = this.avatars.findIndex(({ props }) => props.id === id);

		if (avatarIndex === -1) {
			throw new Error("Avatar not found");
		}

		this.avatars.splice(avatarIndex, 1);
	}

	async edit({ id, url }: { id: string; url: string }): Promise<Avatar> {
		const avatarIndex = this.avatars.findIndex(({ props }) => props.id === id);

		this.avatars[avatarIndex] = Avatar.create({
			url,
			userId: this.avatars[avatarIndex].props.userId,
			id,
		});

		return this.avatars[avatarIndex];
	}
}
