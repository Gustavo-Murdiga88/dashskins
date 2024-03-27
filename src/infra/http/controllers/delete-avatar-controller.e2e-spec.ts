import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaAvatarRepository } from "@/infra/database/prisma/repositories/prisma-avatar-repository";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";
import { MakeAuth } from "@/test/factories/make-auth";
import { MakeAvatar } from "@/test/factories/make-avatar";
import { MakeUser } from "@/test/factories/make-user";
import { StorageUploader } from "@/test/storage/uploader";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("DELETE avatar", () => {
	let app: INestApplication;
	let accessToken: string;
	let makeAuth: MakeAuth;
	let makeUser: MakeUser;
	let makeAvatar: MakeAvatar;
	let uploader: StorageUploader;
	const imagePath = resolve(
		__dirname,
		"..",
		"..",
		"..",
		"..",
		"test",
		"unit-test-image.jpg",
	);

	afterAll(async () => {
		await deleteCurrentSchema();
		await app.close();
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			providers: [
				PrismaUserRepository,
				PrismaService,
				PrismaAvatarRepository,
				MakeAuth,
				MakeUser,
				MakeAvatar,
			],
		})
			.compile()
			.then((module) => module);

		makeAuth = moduleRef.get<MakeAuth>(MakeAuth);
		makeUser = moduleRef.get<MakeUser>(MakeUser);
		makeAvatar = moduleRef.get<MakeAvatar>(MakeAvatar);

		uploader = new StorageUploader();
		app = moduleRef.createNestApplication();
		await app.init();

		const signIn = await makeAuth.signIn();
		accessToken = signIn.accessToken;
	});

	it("[DELETE] /user/avatar/:id", async () => {
		const user = await makeUser.createUser({
			age: faker.number.int({
				max: 30,
				min: 10,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			password: faker.internet.password(),
			role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
		});

		const url = await uploader.upload({
			body: Buffer.from("teste"),
			name: faker.person.fullName(),
			type: "jpg",
		});

		const avatar = await makeAvatar.createAvatar({
			url,
			userId: user.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/user/avatar/${avatar.id}`)
			.attach("file", imagePath)
			.set({ Authorization: `Bearer ${accessToken}` });

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				message: expect.any(String),
			}),
		);
	});

	it("[DELETE] /user/avatar/:avatarId  should be not able to delete avatar if user don't have", async () => {
		const response = await request(app.getHttpServer())
			.delete(`/user/avatar/${randomUUID()}`)
			.attach("file", imagePath)
			.set({ Authorization: `Bearer ${accessToken}` });

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(
			expect.objectContaining({
				message: expect.any(String),
			}),
		);
	});
});
