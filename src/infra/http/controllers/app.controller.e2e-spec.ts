import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { AppService } from "@/infra/app.service";

describe("App", () => {
	let app: INestApplication;

	afterAll(async () => {
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

	it(`[GET] /`, async () => {
		await request(app.getHttpServer()).get("/").expect(200);
	});
});
