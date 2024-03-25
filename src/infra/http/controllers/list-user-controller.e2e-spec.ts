import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { deleteCurrentSchema } from "@/test/test-setup.e2e";

describe("GET list users E2E", () => {
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

	it(`[GET] /users`, async () => {
		const promises = Array.from({ length: 22 }).map(() =>
			request(app.getHttpServer())
				.post("/user")
				.send({
					name: faker.person.fullName(),
					role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
					email: faker.internet.email(),
					age: faker.number.int({ min: 1, max: 100 }),
				}),
		);

		await Promise.all(promises);

		const responseUsers = await request(app.getHttpServer()).get(
			`/users?page=2`,
		);

		expect(responseUsers.status).toBe(200);
		expect(responseUsers.body.data).toHaveLength(2);
		expect(responseUsers.body.totalPages).toBe(3);
		expect(responseUsers.body.totalElements).toBe(22);
		expect(responseUsers.body).toEqual(
			expect.objectContaining({
				totalPages: expect.any(Number),
				totalElements: expect.any(Number),
				data: expect.any(Array),
			}),
		);
	});

	it(`[GET] /users?name="zac"`, async () => {
		await request(app.getHttpServer())
			.post("/user")
			.send({
				name: "zac",
				role: faker.helpers.arrayElement(["ALL", "EDIT", "DELETE"]),
				email: faker.internet.email(),
				age: faker.number.int({ min: 1, max: 100 }),
			});

		const responseUserZac = await request(app.getHttpServer()).get(
			`/users?name=zac`,
		);

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
