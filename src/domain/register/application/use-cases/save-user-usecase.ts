import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { User } from "../../enterprise/entities/user";
import { IUserRepository } from "../repositories/user-repository";

type SaveUserRegisterUsecaseResponse = Promise<Either<Error, User>>;
type SaveUser = {
	name: string;
	age: number;
	email: string;
	role?: "EDIT" | "DELETE" | "ALL";
};

@Injectable()
export class SaveUserUseCase {
	private repository: IUserRepository = {} as any;

	constructor(repository: IUserRepository) {
		this.repository = repository;
	}

	async execute({
		age,
		email,
		name,
		role,
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
		});

		return right(user);
	}
}
