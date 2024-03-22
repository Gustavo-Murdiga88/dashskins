import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { DeleteUserUseCase } from "./delete-user-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Delete user usecase", async () => {
	let sut: DeleteUserUseCase;
	let saveUserUseCase: SaveUserUseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		saveUserUseCase = new SaveUserUseCase(repository);
		sut = new DeleteUserUseCase(repository);
	});

	it("should be able delete an user", async () => {
		const user1 = await saveUserUseCase.execute({
			age: 20,
			email: "john@john.com.br",
			name: "John Doe",
		});

		const user2 = await saveUserUseCase.execute({
			age: 30,
			email: "dud@dud.com.br",
			name: "Dudu",
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
});
