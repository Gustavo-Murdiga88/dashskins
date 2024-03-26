import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { UserRepository } from "../repositories/user-repository";

type CreateAccountUsecaseResponse = Promise<Either<Error, null>>;
type CreateAccount = {
	name: string;
	age: number;
	email: string;
	role?: "EDIT" | "DELETE" | "ALL";
	password: string;
};

@Injectable()
export class CreateAccountUseCase {
	private repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute({
		age,
		email,
		name,
		role,
		password,
	}: CreateAccount): CreateAccountUsecaseResponse {
		const userWithThisEmailAlreadyExists =
			await this.repository.findByEmail(email);

		if (userWithThisEmailAlreadyExists) {
			return left(new Error("User with this email already exists"));
		}

		await this.repository.create({
			age,
			email,
			name,
			role: role || "ALL",
			password,
		});

		return right(null);
	}
}
