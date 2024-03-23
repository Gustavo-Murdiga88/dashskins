import { faker } from "@faker-js/faker";

import { Left } from "@/core/either";
import { AvatarInMemoryRepository } from "@/test/repositories/avatar-in-memory-repository";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { DeleteAvatarUseCase } from "./delete-avatar-usecase";
import { SaveAvatarUseCase } from "./save-avatar-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Delete avatar usecase", async () => {
	let sut: DeleteAvatarUseCase;
	let userRepository: UserInMemoryRepository;
	let usecase: SaveUserUseCase;
	let saveAvatar: SaveAvatarUseCase;
	let repository: AvatarInMemoryRepository;

	beforeEach(() => {
		userRepository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(userRepository);
		repository = new AvatarInMemoryRepository();
		saveAvatar = new SaveAvatarUseCase(repository);
		sut = new DeleteAvatarUseCase(repository);
	});

	it("should be able delete an avatar", async () => {
		const user = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
		});

		const user2 = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
		});

		if (user.isLeft()) {
			throw new Error("User not found");
		}

		if (user2.isLeft()) {
			throw new Error("User not found");
		}

		const avatar1 = await saveAvatar.execute({
			url: faker.image.url(),
			userId: user.value.id,
		});

		const avatar2 = await saveAvatar.execute({
			url: faker.image.url(),
			userId: user2.value.id,
		});

		if (avatar1.isLeft()) {
			throw new Error("User not found");
		}

		if (avatar2.isLeft()) {
			throw new Error("User not found");
		}

		user.value.avatar = avatar1.value;
		user2.value.avatar = avatar2.value;

		const { avatar } = user.value;
		await sut.execute({
			id: avatar.id,
		});

		expect(repository.avatars).toHaveLength(1);
		expect(repository.avatars).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: user2.value.avatar.id,
				}),
			]),
		);
	});

	it("should be not able try exclude twice a some avatar", async () => {
		const user = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
		});

		if (user.isLeft()) {
			throw new Error("User not found");
		}

		const avatar1 = await saveAvatar.execute({
			url: faker.image.url(),
			userId: user.value.id,
		});

		if (avatar1.isLeft()) {
			throw new Error("User not found");
		}

		user.value.avatar = avatar1.value;

		const { avatar } = user.value;
		await sut.execute({
			id: avatar.id,
		});

		expect(
			await sut.execute({
				id: avatar.id,
			}),
		).toBeInstanceOf(Left);
	});
});
