import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { SaveUserUseCase } from "./save-user-usecase";

describe("Save user usecase", async () => {
	let sut: SaveUserUseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		sut = new SaveUserUseCase(repository);
	});

	it("should be able register an new user", async () => {
		await sut.execute({
			age: 20,
			email: "john@john.com.br",
			name: "John Doe",
		});

		expect(repository.users).toHaveLength(1);
		expect(repository.users).toEqual(expect.any(Array));
		expect(repository.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "John Doe",
				}),
			]),
		);
	});
});
