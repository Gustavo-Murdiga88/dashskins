import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { User } from "../../enterprise/entities/user";
import { Encrypter } from "../cryptography/encrypter";
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

	private encrypter: Encrypter;

	constructor(repository: UserRepository, encrypter: Encrypter) {
		this.repository = repository;
		this.encrypter = encrypter;
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

		const passwordEncrypted = await this.encrypter.encrypt(password);

		const user = await this.repository.save({
			age,
			email,
			name,
			role: role || "ALL",
			password: passwordEncrypted,
		});

		return right(user);
	}
}
