import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("Create account E2E", () => {
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

	it(`[POST] /account`, async () => {
		await request(app.getHttpServer())
			.post("/account")
			.send({
				name: faker.person.fullName(),
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
				password: faker.internet.password(),
			})
			.expect(201);
	});
});
