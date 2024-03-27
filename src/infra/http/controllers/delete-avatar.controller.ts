import { BadRequestException, Controller, Delete, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { DeleteAvatarUseCase } from "@/domain/register/application/use-cases/delete-avatar-usecase";

@Controller()
export class DeleteAvatarController {
	private usecase: DeleteAvatarUseCase;

	constructor(usecase: DeleteAvatarUseCase) {
		this.usecase = usecase;
	}

	@ApiTags("Dashskins")
	@ApiOkResponse({
		description: "Response when user try to delete an avatar",
		schema: {
			properties: {
				message: {
					type: "string",
				},
			},
		},
	})
	@Delete("/user/avatar/:id")
	async deleter(@Param("id") id: string) {
		const avatarDeleted = await this.usecase.execute({
			id,
		});

		if (avatarDeleted.isLeft()) {
			throw new BadRequestException(avatarDeleted.value.message);
		}

		return {
			message: "Avatar was deleted successfully",
		};
	}
}
