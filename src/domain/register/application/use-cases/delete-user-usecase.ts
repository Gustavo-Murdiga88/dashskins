import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { IUserRepository } from "../repositories/user-repository";

type DeleteUserUsecaseResponse = Promise<Either<Error, null>>;
type DeleteUser = {
	id: string;
};
@Injectable()
export class DeleteUserUseCase {
	private repository: IUserRepository;

	constructor(repository: IUserRepository) {
		this.repository = repository;
	}

	async execute({ id }: DeleteUser): DeleteUserUsecaseResponse {
		const user = await this.repository.findById(id);

		if (!user) {
			return left(new Error("User not found"));
		}

		await this.repository.delete(id);

		return right(null);
	}
}
