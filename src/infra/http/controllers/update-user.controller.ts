import {
	BadRequestException,
	Body,
	Controller,
	Put,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { UpdateUserUseCase } from "@/domain/register/application/use-cases/edit-user-usecase";

import { ZodValidationPipe } from "../pipe/zod.pipe";

const updateUserScheme = z.object({
	id: z.string().uuid(),
	name: z.string().optional(),
	age: z.number().optional(),
	email: z.string().email().optional(),
	role: z.enum(["ALL", "EDIT", "DELETE"]).optional().default("ALL"),
});

type BodyParsed = z.infer<typeof updateUserScheme>;

@Controller()
export class UpdateUserController {
	private usecase: UpdateUserUseCase;

	constructor(usecase: UpdateUserUseCase) {
		this.usecase = usecase;
	}

	@Put("/user")
	@UsePipes(new ZodValidationPipe(updateUserScheme))
	async execute(@Body() body: BodyParsed) {
		const { age, email, name, role, id } = body;

		const userEdited = await this.usecase.execute({
			id,
			age,
			email,
			name,
			role,
		});

		if (userEdited.isLeft()) {
			throw new BadRequestException(userEdited.value.message);
		}

		return {
			message: "User was updated successfully",
		};
	}
}
