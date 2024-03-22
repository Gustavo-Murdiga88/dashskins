import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Response } from "@/core/response";

import { IAvatarRepository } from "../repositories/avatar-repository";

type SaveUserRegisterUsecaseResponse = Promise<
	Either<Error, Response<{ url: string }>>
>;
type SaveAvatar = {
	buffer: Buffer;
	type: string;
	userId: string;
};
@Injectable()
export class SaveAvatarUseCase {
	private repository: IAvatarRepository;

	constructor(repository: IAvatarRepository) {
		this.repository = repository;
	}

	async execute({
		buffer,
		userId,
		type,
	}: SaveAvatar): SaveUserRegisterUsecaseResponse {
		const user = await this.repository.save({
			buffer,
			userId,
			type,
		});

		if (user instanceof Error) {
			return left(user);
		}

		return right(user);
	}
}
