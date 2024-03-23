import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Response } from "@/core/response";

import { Avatar } from "../../enterprise/entities/avatar";
import { IAvatarRepository } from "../repositories/avatar-repository";

type SaveUserRegisterUsecaseResponse = Promise<Either<Error, Avatar>>;
type SaveAvatar = {
	url: string;
	userId: string;
};
@Injectable()
export class SaveAvatarUseCase {
	private repository: IAvatarRepository;

	constructor(repository: IAvatarRepository) {
		this.repository = repository;
	}

	async execute({ userId, url }: SaveAvatar): SaveUserRegisterUsecaseResponse {
		const userAlreadyAnAvatar = await this.repository.findByUserId(userId);

		if (userAlreadyAnAvatar) {
			return left(new Error("User already has an avatar"));
		}

		const user = await this.repository.save({
			userId,
			url,
		});

		return right(user);
	}
}
