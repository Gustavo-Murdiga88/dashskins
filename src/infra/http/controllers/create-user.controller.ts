import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

import { SaveUserUseCase } from "@/domain/register/application/use-cases/save-user-usecase";

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
export class CreateUserController {
	private usecase: SaveUserUseCase;

	constructor(usecase: SaveUserUseCase) {
		this.usecase = usecase;
	}

	@Post("/user")
	@UsePipes(new ZodValidationPipe(userSchemaValidation))
	async execute(@Body() body: BodyParsed) {
		const { age, email, name, role, password } = body;
		const user = await this.usecase.execute({
			age,
			email,
			name,
			role,
			password,
		});

		if (user.isLeft()) {
			throw user.value;
		}

		return {
			user: {
				id: user.value.id,
				name: user.value.name,
				age: user.value.age,
				email: user.value.email,
				role: user.value.role,
			},
		};
	}
}
