import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { IPagination } from "@/core/pagination";

import { UserAvatar } from "../../enterprise/value-objects/user-with-avatar";
import { UserRepository } from "../repositories/user-repository";

type ListUserUsecaseResponse = Promise<Either<Error, IPagination<UserAvatar>>>;
type ListUser = {
	name?: string;
	page?: number;
};

@Injectable()
export class ListUserUseCase {
	private repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async execute({ name, page }: ListUser): ListUserUsecaseResponse {
		const listUsers = await this.repository.list({
			name,
			page,
		});

		if (listUsers instanceof Error) {
			return left(new Error("Error to list users"));
		}

		return right(listUsers);
	}
}
