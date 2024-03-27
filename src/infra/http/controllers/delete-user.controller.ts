import { BadRequestException, Controller, Delete, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";

@Controller()
export class DeleteUserController {
	private usecase: DeleteUserUseCase;

	constructor(usecase: DeleteUserUseCase) {
		this.usecase = usecase;
	}

	@ApiTags("Dashskins")
	@ApiOkResponse({
		description: "Response when user try delete an user",
		status: 200,
		schema: {
			format: "object",
			properties: {
				message: {
					type: "string",
				},
			},
		},
	})
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
