import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

import { Encrypter } from "@/domain/register/application/cryptography/encrypter";
import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account-usecase";

import { Public } from "../../auth/auth-metadata";
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

	@ApiTags("Dashskins")
	@ApiCreatedResponse({
		description: "Response when account is created",
		status: 201,
	})
	@ApiBody({
		description: "Create an new user",
		schema: {
			format: "object",
			properties: {
				name: {
					type: "string",
				},
				age: {
					type: "number",
					default: 25,
				},
				email: {
					type: "string",
				},
				role: {
					type: "string",
					enum: ["ALL", "EDIT", "DELETE"],
				},
				password: {
					type: "string",
				},
			},
		},
	})
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
			throw new UnauthorizedException(account.value.message);
		}
	}
}
