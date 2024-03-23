import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Put,
	Query,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { UpdateUserUseCase } from "@/domain/register/application/use-cases/edit-user-usecase";

import { ZodValidationPipe } from "../pipe/zod.pipe";

const updateUserScheme = z.object({
	name: z.string().optional(),
	age: z.number().optional(),
	email: z.string().email().optional(),
	role: z.enum(["ALL", "EDIT", "DELETE"]).optional().default("ALL"),
});

type BodyParsed = z.infer<typeof updateUserScheme>;

@Controller()
export class CreateUserController {
	private usecase: UpdateUserUseCase;

	constructor(usecase: UpdateUserUseCase) {
		this.usecase = usecase;
	}

	@Put("/users/:id")
	@UsePipes(new ZodValidationPipe(updateUserScheme))
	async execute(@Body() body: BodyParsed, @Param("id") id: string) {
		const { age, email, name, role } = body;

		const userEdited = await this.usecase.execute({
			id,
			age,
			email,
			name,
			role,
		});

		if (userEdited.isLeft()) {
			throw userEdited.value;
		}

		return {
			message: "User was deleted successfully",
		};
	}
}
