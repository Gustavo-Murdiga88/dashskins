import { resolve } from "node:path";

import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";
import { MakeAuth } from "@/test/factories/make-auth";
import { MakeUser } from "@/test/factories/make-user";
import { StorageDeleter } from "@/test/storage/deleter";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("POST save avatar", () => {
	let app: INestApplication;
	let accessToken: string;
	let makeAuth: MakeAuth;
	let makeUser: MakeUser;
	let deleter: StorageDeleter;
	const imagePath = resolve("test", "unit-test-image.jpg");

	afterAll(async () => {
		await deleteCurrentSchema();
		await app.close();
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PrismaUserRepository, PrismaService, MakeAuth, MakeUser],
		})
			.compile()
			.then((module) => module);

		makeAuth = moduleRef.get<MakeAuth>(MakeAuth);
		makeUser = moduleRef.get<MakeUser>(MakeUser);
		deleter = new StorageDeleter();
		app = moduleRef.createNestApplication();
		await app.init();

		const signIn = await makeAuth.signIn();
		accessToken = signIn.accessToken;
	});

	it("[POST] /user/avatar/:id", async () => {
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

		const response = await request(app.getHttpServer())
			.post(`/user/avatar/${user.id}`)
			.attach("file", imagePath)
			.set({ Authorization: `Bearer ${accessToken}` });

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual(
			expect.objectContaining({
				url: expect.any(String),
				id: expect.any(String),
			}),
		);

		await deleter.delete({ url: response.body.url });
	});

	it("[POST] /user/avatar/:id - should not be able to upload avatar if user already has one avatar", async () => {
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

		const response = await request(app.getHttpServer())
			.post(`/user/avatar/${user.id}`)
			.attach("file", imagePath)
			.set({ Authorization: `Bearer ${accessToken}` });

		await request(app.getHttpServer())
			.post(`/user/avatar/${user.id}`)
			.attach("file", imagePath)
			.set({ Authorization: `Bearer ${accessToken}` })
			.expect(403);

		await deleter.delete({ url: response.body.url });
	});
});
