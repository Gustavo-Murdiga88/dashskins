import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { AvatarRepository } from "../repositories/avatar-repository";
import { Deleter } from "../storage/delete";

type DeleteAvatarUsecaseResponse = Promise<Either<Error, null>>;
type DeleteAvatar = {
	id: string;
};
@Injectable()
export class DeleteAvatarUseCase {
	private repository: AvatarRepository;

	private deleter: Deleter;

	constructor(repository: AvatarRepository, deleter: Deleter) {
		this.repository = repository;
		this.deleter = deleter;
	}

	async execute({ id }: DeleteAvatar): DeleteAvatarUsecaseResponse {
		const avatarExists = await this.repository.findById(id);

		if (!avatarExists) {
			return left(new Error("Avatar not found"));
		}

		await this.repository.delete(id);

		await this.deleter.delete({ url: avatarExists.url });

		return right(null);
	}
}
