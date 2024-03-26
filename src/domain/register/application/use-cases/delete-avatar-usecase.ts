import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { AvatarRepository } from "../repositories/avatar-repository";

type DeleteAvatarUsecaseResponse = Promise<Either<Error, null>>;
type DeleteAvatar = {
	id: string;
};
@Injectable()
export class DeleteAvatarUseCase {
	private repository: AvatarRepository;

	constructor(repository: AvatarRepository) {
		this.repository = repository;
	}

	async execute({ id }: DeleteAvatar): DeleteAvatarUsecaseResponse {
		const avatarExists = await this.repository.findById(id);

		if (!avatarExists) {
			return left(new Error("Avatar not found"));
		}

		await this.repository.delete(id);

		return right(null);
	}
}
