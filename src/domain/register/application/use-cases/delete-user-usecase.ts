import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { UserRepository } from "../repositories/user-repository";

type DeleteUserUsecaseResponse = Promise<Either<Error, null>>;
type DeleteUser = {
	id: string;
};

@Injectable()
export class DeleteUserUseCase {
	private repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute({ id }: DeleteUser): DeleteUserUsecaseResponse {
		const user = await this.repository.findById(id);

		if (!user) {
			return left(new Error("User not exists"));
		}

		await this.repository.delete(id);

		return right(null);
	}
}
