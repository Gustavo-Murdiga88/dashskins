import { faker } from "@faker-js/faker";

import { Left } from "@/core/either";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { DeleteUserUseCase } from "./delete-user-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Delete user usecase", async () => {
	let sut: DeleteUserUseCase;
	let usecase: SaveUserUseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(repository);
		sut = new DeleteUserUseCase(repository);
	});

	it("should be able delete an user", async () => {
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
		await sut.execute({ id: user.id });

		expect(repository.users).toHaveLength(1);
		expect(repository.users).toEqual(expect.any(Array));
		expect(repository.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Dudu",
				}),
			]),
		);
	});

	it("should be not able delete an user that not exist", async () => {
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
				id: "askdjhasljkdhsa",
			}),
		).toBeInstanceOf(Left);
	});
});
