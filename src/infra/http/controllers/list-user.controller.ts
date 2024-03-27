import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";

import { ListUserUseCase } from "@/domain/register/application/use-cases/list-users-usecase";

import { UserMapper } from "../presenter/user-to-http";

@Controller()
export class ListUserController {
	private usecase: ListUserUseCase;

	constructor(usecase: ListUserUseCase) {
		this.usecase = usecase;
	}

	@ApiTags("Dashskins")
	@ApiQuery({
		name: "name",
		required: false,
	})
	@ApiQuery({
		name: "page",
		type: "number",
		required: false,
	})
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
	@Get("/users")
	async execute(@Query() query: { name: string; page: string }) {
		const listOfUsers = await this.usecase.execute({
			name: query.name,
			page: Number(query.page || 0),
		});

		if (listOfUsers.isLeft()) {
			throw new BadRequestException();
		}

		const data = listOfUsers.value.data.map(UserMapper.userAvatarToHTTP);
		return {
			totalElements: listOfUsers.value.totalElements,
			totalPages: listOfUsers.value.totalPages,
			data,
		};
	}
}
