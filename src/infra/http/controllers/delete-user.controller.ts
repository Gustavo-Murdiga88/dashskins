import { BadRequestException, Controller, Delete, Param } from "@nestjs/common";

import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";

@Controller()
export class DeleteUserController {
	private usecase: DeleteUserUseCase;

	constructor(usecase: DeleteUserUseCase) {
		this.usecase = usecase;
	}

	@Delete("/user/:id")
	async execute(@Param("id") id: string) {
		const userDeleted = await this.usecase.execute({
			id,
		});

		if (userDeleted.isLeft()) {
			throw new BadRequestException(userDeleted.value.message);
		}

		return {
			message: "User was deleted successfully",
		};
	}
}
