import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
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

	@ApiTags("Dashskins")
	@ApiCreatedResponse({
		description: "Response when account is created",
		status: 201,
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
			},
		},
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
			throw new UnauthorizedException(user.value.message);
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
