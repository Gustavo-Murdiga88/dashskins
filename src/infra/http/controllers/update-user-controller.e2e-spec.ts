import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-user-repository";
import { MakeAuth } from "@/test/factories/make-auth";
import { MakeUser } from "@/test/factories/make-user";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("UPDATE user E2E", () => {
	let app: INestApplication;
	let prismaRepository: PrismaUserRepository;
	let accessToken: string;

	afterAll(async () => {
		await deleteCurrentSchema();
		await app.close();
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PrismaUserRepository, PrismaService],
		})
			.compile()
			.then((module) => module);

		app = moduleRef.createNestApplication();
		await app.init();

		prismaRepository =
			moduleRef.get<PrismaUserRepository>(PrismaUserRepository);

		const signIn = await new MakeAuth(prismaRepository).signIn(app);
		accessToken = signIn.accessToken;
	});

	it(`[PUT] /user update an user that already exists`, async () => {
		const user = await new MakeUser(prismaRepository).createUser({
			age: faker.number.int({
				min: 10,
				max: 100,
			}),
			email: faker.internet.email(),
			name: faker.person.fullName(),
			password: faker.internet.password(),
			role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
		});

		const responseDeleteUser = await request(app.getHttpServer())
			.put(`/user`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				id: user.id,
				name: faker.person.fullName(),
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
				password: user.password,
			});

		expect(responseDeleteUser.status).toBe(200);
		expect(responseDeleteUser.body.message).toBe(
			"User was updated successfully",
		);
	});

	it(`[PUT] /user trying to update an user that not exists (should be not able)`, async () => {
		const responseDeleteUser = await request(app.getHttpServer())
			.put(`/user`)
			.set({ Authorization: `Bearer ${accessToken}` })
			.send({
				id: randomUUID(),
				name: faker.person.fullName(),
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
				password: faker.internet.password(),
			});

		expect(responseDeleteUser.status).toBe(400);
		expect(responseDeleteUser.body.message).toBe("User does not exists");
	});
});
