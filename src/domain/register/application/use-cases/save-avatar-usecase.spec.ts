import { faker } from "@faker-js/faker";

import { AvatarInMemoryRepository } from "@/test/repositories/avatar-in-memory-repository";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { AvatarRepository } from "../repositories/avatar-repository";
import { SaveAvatarUseCase } from "./save-avatar-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Save avatar usecase", async () => {
	let repository: AvatarRepository;
	let userRepository: UserInMemoryRepository;
	let usecase: SaveUserUseCase;
	let sut: SaveAvatarUseCase;

	beforeEach(() => {
		userRepository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(userRepository);
		repository = new AvatarInMemoryRepository();
		sut = new SaveAvatarUseCase(repository);
	});

	it("should be able sabe a new avatar for an user", async () => {
		const user = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});

		if (user.isLeft()) {
			throw user.value;
		}

		const { id } = user.value;

		const avatar = await sut.execute({
			userId: id,
			url: faker.internet.url(),
		});

		if (avatar.isLeft()) {
			throw avatar.value;
		}

		expect(avatar.value.userId).toBe(id);
		expect(avatar.value.url).toEqual(expect.any(String));
	});

	it("should be not able twice register avatar for some user", async () => {
		const user = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
			password: faker.internet.password(),
		});

		if (user.isLeft()) {
			throw user.value;
		}

		const { id } = user.value;

		await sut.execute({
			userId: id,
			url: faker.internet.url(),
		});

		const avatar = await sut.execute({
			userId: id,
			url: faker.internet.url(),
		});

		expect(avatar.value).toBeInstanceOf(Error);
	});
});
