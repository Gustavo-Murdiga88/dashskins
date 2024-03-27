import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";
import { MakeAuth } from "@/test/factories/make-auth";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("Create user E2E", () => {
	let app: INestApplication;
	let accessToken: string;
	let makeAuth: MakeAuth;

	afterAll(async () => {
		await deleteCurrentSchema();
		await app.close();
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PrismaUserRepository, PrismaService, MakeAuth],
		})
			.compile()
			.then((module) => module);

		app = moduleRef.createNestApplication();
		await app.init();

		makeAuth = moduleRef.get<MakeAuth>(MakeAuth);

		const signin = await makeAuth.signIn();

		accessToken = signin.accessToken;
	});

	it(`[POST] /user`, async () => {
		await request(app.getHttpServer())
			.post("/user")
			.send({
				name: faker.person.fullName(),
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
				password: faker.internet.password(),
			})
			.set({
				Authorization: `Bearer ${accessToken}`,
			})
			.expect(201);
	});
});
