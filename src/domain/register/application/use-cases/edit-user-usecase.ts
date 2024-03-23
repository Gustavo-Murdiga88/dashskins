import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { User } from "../../enterprise/entities/user";
import { IUserRepository } from "../repositories/user-repository";

type EditUserUsecaseResponse = Promise<Either<Error, User>>;
type EditUser = {
	name?: string;
	id: string;
	age?: number;
	email?: string;
	role?: "EDIT" | "DELETE" | "ALL";
};

@Injectable()
export class EditUserUseCase {
	private repository: IUserRepository;

	constructor(repository: IUserRepository) {
		this.repository = repository;
	}

	async execute({
		age,
		email,
		name,
		role,
		id,
	}: EditUser): EditUserUsecaseResponse {
		const userAlreadyExists = await this.repository.findById(id);

		if (!userAlreadyExists) {
			return left(new Error("User not found"));
		}

		const user = await this.repository.edit({
			age,
			email,
			name,
			id,
			role,
		});

		return right(user);
	}
}