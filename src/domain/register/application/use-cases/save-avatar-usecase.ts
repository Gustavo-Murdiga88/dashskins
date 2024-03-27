import { ForbiddenException, Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Avatar } from "../../enterprise/entities/avatar";
import { AvatarRepository } from "../repositories/avatar-repository";
import { Uploader } from "../storage/upload";

type SaveUserRegisterUsecaseResponse = Promise<Either<Error, Avatar>>;
type SaveAvatar = {
	body: Buffer;
	name: string;
	type: string;
	userId: string;
};
@Injectable()
export class SaveAvatarUseCase {
	private repository: AvatarRepository;

	private uploader: Uploader;

	constructor(repository: AvatarRepository, uploader: Uploader) {
		this.repository = repository;
		this.uploader = uploader;
	}

	async execute({
		body,
		name,
		type,
		userId,
	}: SaveAvatar): SaveUserRegisterUsecaseResponse {
		const userAlreadyAnAvatar = await this.repository.findByUserId(userId);

		if (userAlreadyAnAvatar) {
			return left(new ForbiddenException("User already has an avatar"));
		}

		const url = await this.uploader.upload({
			body,
			name,
			type,
		});

		const user = await this.repository.save({
			userId,
			url,
		});

		return right(user);
	}
}
