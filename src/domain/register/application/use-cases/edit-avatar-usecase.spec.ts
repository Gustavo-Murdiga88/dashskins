import { faker } from "@faker-js/faker";

import { AvatarInMemoryRepository } from "@/test/repositories/avatar-in-memory-repository";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";

import { IAvatarRepository } from "../repositories/avatar-repository";
import { EditAvatarUseCase } from "./edit-avatar-usecase";
import { SaveAvatarUseCase } from "./save-avatar-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Save avatar usecase", async () => {
	let repository: IAvatarRepository;
	let userRepository: UserInMemoryRepository;
	let usecase: SaveUserUseCase;
	let createAvatar: SaveAvatarUseCase;
	let sut: EditAvatarUseCase;

	beforeEach(() => {
		userRepository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(userRepository);
		repository = new AvatarInMemoryRepository();
		createAvatar = new SaveAvatarUseCase(repository);
		sut = new EditAvatarUseCase(repository);
	});

	it("should be able edit an avatar for any users", async () => {
		const user = await usecase.execute({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			role: faker.helpers.arrayElement(["ALL", "DELETE", "EDIT"]),
		});

		if (user.isLeft()) {
			throw user.value;
		}

		const { id } = user.value;

		const avatarCreated = await createAvatar.execute({
			url: faker.internet.url(),
			userId: id,
		});

		if (avatarCreated.isLeft()) {
			throw avatarCreated.value;
		}

		const url = faker.image.url();
		const avatar = await sut.execute({
			id: avatarCreated.value.id,
			url,
		});

		if (avatar.isLeft()) {
			throw avatar.value;
		}

		expect(avatar.value.url).toEqual(url);
	});
});
