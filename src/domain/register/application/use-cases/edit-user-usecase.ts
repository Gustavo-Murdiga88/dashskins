import { BadRequestException, Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { User } from "../../enterprise/entities/user";
import { UserRepository } from "../repositories/user-repository";

type UpdateUserUseCaseResponse = Promise<Either<Error, User>>;
type EditUser = {
	name?: string;
	id: string;
	age?: number;
	email?: string;
	role?: "EDIT" | "DELETE" | "ALL";
};

@Injectable()
export class UpdateUserUseCase {
	private repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute({
		age,
		email,
		name,
		role,
		id,
	}: EditUser): UpdateUserUseCaseResponse {
		const userAlreadyExists = await this.repository.findById(id);

		if (!userAlreadyExists) {
			return left(new BadRequestException("User does not exists"));
		}

		const user = await this.repository.update({
			age,
			email,
			name,
			id,
			role,
		});

		return right(user);
	}
}
