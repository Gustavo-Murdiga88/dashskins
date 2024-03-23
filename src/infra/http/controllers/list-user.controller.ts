import { BadRequestException, Controller, Get, Query } from "@nestjs/common";

import { ListUserUseCase } from "@/domain/register/application/use-cases/list-users-usecase";

@Controller()
export class CreateUserController {
	private usecase: ListUserUseCase;

	constructor(usecase: ListUserUseCase) {
		this.usecase = usecase;
	}

	@Get("/users")
	async execute(@Query("page") page: number, @Query("name") name: string) {
		const listOfUsers = await this.usecase.execute({
			name,
			page,
		});

		if (listOfUsers.isLeft()) {
			throw new BadRequestException();
		}

		return {
			message: "User was deleted successfully",
		};
	}
}
