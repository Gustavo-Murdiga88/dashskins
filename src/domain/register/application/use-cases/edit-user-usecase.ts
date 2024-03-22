import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { Response } from "@/core/response";

import { IUserRepository } from "../repositories/user-repository";

type EditUserUsecaseResponse = Promise<Either<Error, Response>>;
type EditUser = {
	name: string;
	id: string;
	age: number;
	email: string;
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
		const user = await this.repository.findById(id);

		if (!user) {
			return left(new Error("User not found"));
		}

		await this.repository.edit({
			age,
			email,
			name,
			id,
			role,
		});

		return right({
			message: "User is edited successfully",
		} satisfies Response);
	}
}
