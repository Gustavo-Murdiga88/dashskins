import {
	BadRequestException,
	Controller,
	Delete,
	InternalServerErrorException,
	Param,
} from "@nestjs/common";

import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";

@Controller()
export class CreateUserController {
	private usecase: DeleteUserUseCase;

	constructor(usecase: DeleteUserUseCase) {
		this.usecase = usecase;
	}

	@Delete("/user:id")
	async execute(@Param() id: string) {
		const userDeleted = await this.usecase.execute({
			id,
		});

		if (userDeleted.isLeft()) {
			throw userDeleted.value;
		}

		return {
			message: "User was deleted successfully",
		};
	}
}
