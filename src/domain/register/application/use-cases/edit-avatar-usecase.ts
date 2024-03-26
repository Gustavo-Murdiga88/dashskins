import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Avatar } from "../../enterprise/entities/avatar";
import { AvatarRepository } from "../repositories/avatar-repository";

type EditAvatarUsecaseResponse = Promise<Either<Error, Avatar>>;
type EditAvatar = {
	id: string;
	url: string;
};
@Injectable()
export class EditAvatarUseCase {
	private repository: AvatarRepository;

	constructor(repository: AvatarRepository) {
		this.repository = repository;
	}

	async execute({ id, url }: EditAvatar): EditAvatarUsecaseResponse {
		const avatarAlreadyExists = await this.repository.findById(id);

		if (!avatarAlreadyExists) {
			return left(new Error("Avatar not found"));
		}

		const avatar = await this.repository.edit({
			id,
			url,
		});

		return right(avatar);
	}
}
