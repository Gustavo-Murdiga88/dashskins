import { faker } from "@faker-js/faker";

import { Left } from "@/core/either";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { UpdateUserUseCase } from "./edit-user-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Edit user usecase", async () => {
	let sut: UpdateUserUseCase;
	let usecase: SaveUserUseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(repository);
		sut = new UpdateUserUseCase(repository);
	});

	it("should be able edit an user", async () => {
		const user1 = await usecase.execute({
			age: 20,
			email: "john@john.com.br",
			name: "John Doe",
			password: faker.internet.password(),
		});

		const user2 = await usecase.execute({
			age: 30,
			email: "dud@dud.com.br",
			name: "Dudu",
			password: faker.internet.password(),
		});

		if (user1.isLeft()) {
			throw new Error("User not found");
		}

		if (user2.isLeft()) {
			throw new Error("User not found");
		}

		const user = user1.value;

		const userEdited = await sut.execute({
			age: 32,
			email: "hawaii@hawaii.com.br",
			id: user.id,
			name: "Paris",
		});

		if (userEdited.isLeft()) {
			throw new Error("User not found");
		}

		expect(userEdited.value).toEqual(
			expect.objectContaining({
				age: 32,
				email: "hawaii@hawaii.com.br",
				id: user.id,
				name: "Paris",
			}),
		);
	});

	it("should be not able edit an user that not exist", async () => {
		await usecase.execute({
			age: 20,
			email: "john@john.com.br",
			name: "John Doe",
			password: faker.internet.password(),
		});

		await usecase.execute({
			age: 30,
			email: "dud@dud.com.br",
			name: "Dudu",
			password: faker.internet.password(),
		});

		expect(
			await sut.execute({
				age: 10,
				id: "as.xdljhdasjkldas",
				email: "hawaii@hawaii.com.br",
				name: "Paris",
			}),
		).toBeInstanceOf(Left);
	});
});
