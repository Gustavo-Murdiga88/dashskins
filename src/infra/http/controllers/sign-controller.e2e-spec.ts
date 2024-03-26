import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("SigIn a new user", () => {
	let app: INestApplication;

	afterAll(async () => {
		await deleteCurrentSchema();
		await app.close();
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		})
			.compile()
			.then((module) => module);

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it("[POST] /session", async () => {
		const user = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			age: faker.number.int({ min: 1, max: 100 }),
			role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
		};

		await request(app.getHttpServer()).post("/account").send(user);

		const session = await request(app.getHttpServer()).post("/session").send({
			email: user.email,
			password: user.password,
		});

		expect(session.body).toEqual(
			expect.objectContaining({
				token: expect.any(String),
				refreshToken: expect.any(String),
			}),
		);
	});
});
