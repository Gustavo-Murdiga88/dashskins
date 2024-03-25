import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("DELETE user E2E", () => {
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

	it(`[DELETE] /user/:id delete an user that already exists`, async () => {
		const response = await request(app.getHttpServer())
			.post("/user")
			.send({
				name: faker.person.fullName(),
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
			});

		const { user } = response.body;

		const responseDeleteUser = await request(app.getHttpServer()).delete(
			`/user/${user.id}`,
		);

		expect(responseDeleteUser.status).toBe(200);
		expect(responseDeleteUser.body.message).toBe(
			"User was deleted successfully",
		);
	});

	it(`[DELETE] /user/:id delete an user that not exists (this should not be able)`, async () => {
		const responseDeleteUser = await request(app.getHttpServer()).delete(
			`/user/${randomUUID()}`,
		);

		expect(responseDeleteUser.status).toBe(400);
		expect(responseDeleteUser.body.message).toBe("User not exists");
	});
});
