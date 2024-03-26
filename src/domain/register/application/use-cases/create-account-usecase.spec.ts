import { faker } from "@faker-js/faker";

import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { CreateAccountUseCase } from "./create-account-usecase";

describe("Create account usecase", async () => {
	let repository: UserInMemoryRepository;
	let sut: CreateAccountUseCase;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		sut = new CreateAccountUseCase(repository);
	});

	it("should be able create a new account", async () => {
		await sut.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});

		expect(repository.users).toHaveLength(1);
	});
});
