import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";

import { Comparer } from "../cryptography/comparer";
import { JWT } from "../cryptography/jwt";
import { UserRepository } from "../repositories/user-repository";

type SingInUseCaseResponse = Promise<
	Either<
		Error,
		{
			token: string;
			refreshToken: string;
		}
	>
>;

@Injectable()
export class SigninUsecase {
	private repository: UserRepository;

	private jwt: JWT;

	private comparer: Comparer;

	constructor(repository: UserRepository, jwt: JWT, comparer: Comparer) {
		this.repository = repository;
		this.jwt = jwt;
		this.comparer = comparer;
	}

	async execute({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): SingInUseCaseResponse {
		const user = await this.repository.findByEmail(email);

		if (!user) {
			return left(new Error("email or password invalid"));
		}

		const passwordAreEqual = await this.comparer.compare(
			password,
			user.password,
		);

		if (!passwordAreEqual) {
			return left(new Error("email or password invalid"));
		}

		const token = await this.jwt.sign({
			email: user.email,
			id: user.id,
		});

		const refreshToken = await this.jwt.sign(
			{
				email: user.email,
				id: user.id,
			},
			{ expiresIn: "7d" },
		);

		return right({
			token,
			refreshToken,
		});
	}
}
