import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";
import { MakeAuth } from "@/test/factories/make-auth";
import { MakeUser } from "@/test/factories/make-user";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("GET list users E2E", () => {
	let app: INestApplication;
	let accessToken: string;
	let makeAuth: MakeAuth;
	let makeUser: MakeUser;

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

		app = moduleRef.createNestApplication();
		await app.init();

		makeUser = moduleRef.get<MakeUser>(MakeUser);
		makeAuth = moduleRef.get<MakeAuth>(MakeAuth);

		const signIn = await makeAuth.signIn();

		accessToken = signIn.accessToken;
	});

	it(`[GET] /users`, async () => {
		const promises = Array.from({ length: 12 }).map(() =>
			request(app.getHttpServer())
				.post("/user")
				.set({ Authorization: `Bearer ${accessToken}` })
				.send({
					name: faker.person.fullName(),
					role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
					email: faker.internet.email(),
					age: faker.number.int({ min: 1, max: 100 }),
					password: faker.internet.password(),
				}),
		);

		await Promise.all(promises);

		const responseUsers = await request(app.getHttpServer())
			.get(`/users?page=1`)
			.set({
				Authorization: `Bearer ${accessToken}`,
			});

		expect(responseUsers.status).toBe(200);
		expect(responseUsers.body.data).toHaveLength(2);
		expect(responseUsers.body.totalPages).toBe(2);
		expect(responseUsers.body.totalElements).toBe(12);
		expect(responseUsers.body).toEqual(
			expect.objectContaining({
				totalPages: expect.any(Number),
				totalElements: expect.any(Number),
				data: expect.any(Array),
			}),
		);
	});

	it(`[GET] /users?name="zac"`, async () => {
		const user = await makeUser.createUser({
			age: faker.number.int({
				min: 10,
				max: 100,
			}),
			email: faker.internet.email(),
			name: "zac",
			password: faker.internet.password(),
			role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
		});

		const responseUserZac = await request(app.getHttpServer())
			.get(`/users?name=${user.name}`)
			.set({
				Authorization: `Bearer ${accessToken}`,
			});

		expect(responseUserZac.status).toBe(200);
		expect(responseUserZac.body.data).toHaveLength(1);
		expect(responseUserZac.body.totalPages).toBe(1);
		expect(responseUserZac.body.totalElements).toBe(1);
		expect(responseUserZac.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "zac",
				}),
			]),
		);
	});
});
