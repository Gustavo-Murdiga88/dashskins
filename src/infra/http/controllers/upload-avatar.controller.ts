import {
	Controller,
	ForbiddenException,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
	UsePipes,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import {
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiProperty,
	ApiTags,
} from "@nestjs/swagger";

import { SaveAvatarUseCase } from "@/domain/register/application/use-cases/save-avatar-usecase";

import { FileSizeValidationPipe } from "../pipe/storage.pipe";

const MAX_SIZE = 8 * 1024 * 1024 * 5; // 5Mb

class FileUpload {
	@ApiProperty({ type: "string", format: "binary" })
	file: any;
}

@Controller()
export class UploadAvatarController {
	private usecase: SaveAvatarUseCase;

	constructor(usecase: SaveAvatarUseCase) {
		this.usecase = usecase;
	}

	@ApiTags("Dashskins")
	@ApiConsumes("multipart/form-data")
	@ApiProperty({ type: "string", format: "binary" })
	@ApiCreatedResponse({
		description: "Response when user try create a session",
		status: 201,
		schema: {
			properties: {
				url: {
					type: "string",
				},
				id: {
					type: "string",
				},
			},
		},
	})
	@ApiBody({
		description: "Upload avatar",
		type: FileUpload,
	})
	@Post("/user/avatar/:userId")
	@UseInterceptors(FileInterceptor("file"))
	@UsePipes(new FileSizeValidationPipe(MAX_SIZE))
	async upload(
		@UploadedFile("file") file: Express.Multer.File,
		@Param("userId") id: string,
	) {
		const type = file.mimetype.split("/")[1];

		const avatar = await this.usecase.execute({
			body: file.buffer,
			name: file.originalname,
			type,
			userId: id,
		});

		if (avatar.isLeft()) {
			throw new ForbiddenException(avatar.value.message);
		}

		return {
			url: avatar.value.url,
			id: avatar.value.id,
		};
	}
}
