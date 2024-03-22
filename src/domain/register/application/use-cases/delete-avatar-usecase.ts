import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Response } from "@/core/response";

import { IAvatarRepository } from "../repositories/avatar-repository";

type DeleteAvatarUsecaseResponse = Promise<Either<Error, Response>>;
type DeleteAvatar = {
	id: string;
};
@Injectable()
export class DeleteAvatarUseCase {
	private repository: IAvatarRepository;

	constructor(repository: IAvatarRepository) {
		this.repository = repository;
	}

	async execute({ id }: DeleteAvatar): DeleteAvatarUsecaseResponse {
		const avatar = await this.repository.delete(id);

		if (avatar instanceof Error) {
			return left(avatar);
		}

		return right({
			message: "avatar is deleted successfully",
		} satisfies Response);
	}
}
