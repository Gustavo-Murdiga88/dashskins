import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { User } from "../../enterprise/entities/user";
import { UserRepository } from "../repositories/user-repository";

type SaveUserRegisterUsecaseResponse = Promise<Either<Error, User>>;
type SaveUser = {
	name: string;
	age: number;
	email: string;
	role?: "EDIT" | "DELETE" | "ALL";
	password: string;
};

@Injectable()
export class SaveUserUseCase {
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
	}: SaveUser): SaveUserRegisterUsecaseResponse {
		const userWithThisEmailAlreadyExists =
			await this.repository.findByEmail(email);

		if (userWithThisEmailAlreadyExists) {
			return left(new Error("User with this email already exists"));
		}

		const user = await this.repository.save({
			age,
			email,
			name,
			role: role || "ALL",
			password,
		});

		return right(user);
	}
}
