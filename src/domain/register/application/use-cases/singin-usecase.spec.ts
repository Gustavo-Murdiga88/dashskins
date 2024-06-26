import { faker } from "@faker-js/faker";

import { FakerComparer } from "@/test/cryptography/faker-comparer";
import { FakerEncrypter } from "@/test/cryptography/faker-encrypter";
import { FakerSign } from "@/test/cryptography/faker-sign";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { Comparer } from "../cryptography/comparer";
import { Encrypter } from "../cryptography/encrypter";
import { JWT } from "../cryptography/jwt";
import { SaveUserUseCase } from "./save-user-usecase";
import { SigninUsecase } from "./singin-usecase";

describe("signin user", async () => {
	let jwt: JWT;
	let saveUser: SaveUserUseCase;
	let repository: UserInMemoryRepository;
	let comparer: Comparer;
	let encrypter: Encrypter;
	let sut: SigninUsecase;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		encrypter = new FakerEncrypter();
		saveUser = new SaveUserUseCase(repository, encrypter);
		comparer = new FakerComparer();
		jwt = new FakerSign();

		sut = new SigninUsecase(repository, jwt, comparer);
	});

	it("should be able signin with correct credentials", async () => {
		const password = faker.internet.password();

		await saveUser.execute({
			age: 20,
			email: "john@john.com.br",
			name: "John Doe",
			password,
		});

		const auth = await sut.execute({
			email: "john@john.com.br",
			password,
		});

		if (auth.isLeft()) {
			throw auth.value;
		}

		expect(auth.value.token).toEqual(expect.any(String));
		expect(auth.value.refreshToken).toEqual(expect.any(String));
	});
});
