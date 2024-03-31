import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { UserRepository } from "../repositories/user-repository";
import { Deleter } from "../storage/delete";

type DeleteUserUsecaseResponse = Promise<Either<Error, null>>;
type DeleteUser = {
	id: string;
};

@Injectable()
export class DeleteUserUseCase {
	private repository: UserRepository;

	private deleter: Deleter;

	constructor(repository: UserRepository, deleter: Deleter) {
		this.repository = repository;
		this.deleter = deleter;
	}

	async execute({ id }: DeleteUser): DeleteUserUsecaseResponse {
		const user = await this.repository.findById(id);

		if (!user) {
			return left(new Error("User not exists"));
		}

		await this.repository.delete(id);

		if (user.avatar.url !== "") {
			await this.deleter.delete({ url: user.avatar.url });
		}

		return right(null);
	}
}
