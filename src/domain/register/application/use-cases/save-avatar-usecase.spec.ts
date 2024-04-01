import { faker } from "@faker-js/faker";

import { FakerEncrypter } from "@/test/cryptography/faker-encrypter";
import { AvatarInMemoryRepository } from "@/test/repositories/avatar-in-memory-repository";
import { UserInMemoryRepository } from "@/test/repositories/user-in-memory-repository";
import { StorageDeleter } from "@/test/storage/deleter";
import { StorageUploader } from "@/test/storage/uploader";

import { AvatarRepository } from "../repositories/avatar-repository";
import { SaveAvatarUseCase } from "./save-avatar-usecase";
import { SaveUserUseCase } from "./save-user-usecase";

describe("Save avatar usecase", async () => {
	let repository: AvatarRepository;
	let userRepository: UserInMemoryRepository;
	let usecase: SaveUserUseCase;
	let sut: SaveAvatarUseCase;
	let uploader: StorageUploader;
	let deleter: StorageDeleter;
	let encrypter: FakerEncrypter;

	beforeEach(() => {
		userRepository = new UserInMemoryRepository();
		encrypter = new FakerEncrypter();
		usecase = new SaveUserUseCase(userRepository, encrypter);
		repository = new AvatarInMemoryRepository();
		uploader = new StorageUploader();
		deleter = new StorageDeleter();
		sut = new SaveAvatarUseCase(repository, uploader);
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
			body: Buffer.from("test"),
			name: faker.person.fullName(),
			type: "jpg",
		});

		if (avatar.isLeft()) {
			throw avatar.value;
		}

		expect(avatar.value.userId).toBe(id);
		expect(avatar.value.url).toEqual(expect.any(String));

		await deleter.delete({ url: avatar.value.url });
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

		const avatarCreated = await sut.execute({
			userId: id,
			body: Buffer.from("test"),
			name: faker.person.fullName(),
			type: "jpg",
		});

		const avatar = await sut.execute({
			userId: id,
			body: Buffer.from("test"),
			name: faker.person.fullName(),
			type: "jpg",
		});

		if (avatarCreated.isLeft()) {
			throw avatar.isLeft;
		}

		expect(avatar.value).toBeInstanceOf(Error);
		await deleter.delete({ url: avatarCreated.value.url });
	});
});
