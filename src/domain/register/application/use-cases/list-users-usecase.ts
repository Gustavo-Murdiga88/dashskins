import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { IPagination } from "@/core/pagination";

import { UserAvatar } from "../../enterprise/value-objects/user-with-avatar";
import { IUserRepository } from "../repositories/user-repository";

type ListUserUsecaseResponse = Promise<Either<Error, IPagination<UserAvatar>>>;
type ListUser = {
	name?: string;
	page?: number;
};
@Injectable()
export class ListUserUseCase {
	private repository: IUserRepository;

	constructor(repository: IUserRepository) {
		this.repository = repository;
	}

	async execute({ name, page }: ListUser): ListUserUsecaseResponse {
		const listUsers = await this.repository.list({
			name,
			page,
		});

		if (listUsers instanceof Error) {
			return left(listUsers);
		}

		return right(listUsers);
	}
}
