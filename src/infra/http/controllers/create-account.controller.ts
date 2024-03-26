import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

import { Encrypter } from "@/domain/register/application/cryptography/encrypter";
import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account-usecase";

import { Public } from "../../auth/auth-metada";
import { ZodValidationPipe } from "../pipe/zod.pipe";

const userSchemaValidation = z.object({
	name: z.string(),
	age: z.number(),
	email: z.string().email(),
	role: z.enum(["ALL", "EDIT", "DELETE"]).default("ALL"),
	password: z.string(),
});

type BodyParsed = z.infer<typeof userSchemaValidation>;

@Controller()
export class CreateAccountController {
	private usecase: CreateAccountUseCase;

	private encrypter: Encrypter;

	constructor(usecase: CreateAccountUseCase, encrypter: Encrypter) {
		this.usecase = usecase;
		this.encrypter = encrypter;
	}

	@Post("/account")
	@UsePipes(new ZodValidationPipe(userSchemaValidation))
	@Public()
	async execute(@Body() body: BodyParsed) {
		const { age, email, name, role, password } = body;

		const encryptedPassword = await this.encrypter.encrypt(password);

		const account = await this.usecase.execute({
			age,
			email,
			name,
			role,
			password: encryptedPassword,
		});

		if (account.isLeft()) {
			throw account.value;
		}
	}
}
