import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Response } from "@/core/response";

import { Avatar } from "../../enterprise/entities/avatar";
import { IAvatarRepository } from "../repositories/avatar-repository";

type EditAvatarUsecaseResponse = Promise<Either<Error, Avatar>>;
type EditAvatar = {
	buffer: Buffer;
	userId: string;
	type: string;
};
@Injectable()
export class EditAvatarUseCase {
	private repository: IAvatarRepository;

	constructor(repository: IAvatarRepository) {
		this.repository = repository;
	}

	async execute({
		buffer,
		type,
		userId,
	}: EditAvatar): EditAvatarUsecaseResponse {
		const avatar = await this.repository.edit({
			buffer,
			userId,
			type,
		});

		if (avatar instanceof Error) {
			return left(avatar);
		}

		return right(avatar);
	}
}
