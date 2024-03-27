import { faker } from "@faker-js/faker";

import { AvatarInMemoryRepository } from "@/test/repositories/avatar-in-memory-repository";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";
import { StorageDeleter } from "@/test/storage/deleter";
import { StorageUploader } from "@/test/storage/uploader";

import { AvatarRepository } from "../repositories/avatar-repository";
import { EditAvatarUseCase } from "./edit-avatar-usecase";
import { SaveAvatarUseCase } from "./save-avatar-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Save avatar usecase", async () => {
	let repository: AvatarRepository;
	let userRepository: UserInMemoryRepository;
	let usecase: SaveUserUseCase;
	let createAvatar: SaveAvatarUseCase;
	let sut: EditAvatarUseCase;
	let uploader: StorageUploader;
	let deleter: StorageDeleter;

	beforeEach(() => {
		userRepository = new UserInMemoryRepository();
		usecase = new SaveUserUseCase(userRepository);
		repository = new AvatarInMemoryRepository();
		uploader = new StorageUploader();
		createAvatar = new SaveAvatarUseCase(repository, uploader);
		deleter = new StorageDeleter();
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
			password: faker.internet.password(),
		});

		if (user.isLeft()) {
			throw user.value;
		}

		const { id } = user.value;

		const avatarCreated = await createAvatar.execute({
			body: Buffer.from("teste"),
			name: faker.person.fullName(),
			type: "jpg",
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

		await deleter.delete({ url: avatarCreated.value.url });
	});
});
