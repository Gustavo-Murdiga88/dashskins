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

import { SaveAvatarUseCase } from "@/domain/register/application/use-cases/save-avatar-usecase";

import { FileSizeValidationPipe } from "../pipe/storage.pipe";

const MAX_SIZE = 8 * 1024 * 1024 * 5; // 5Mb

@Controller()
export class UploadAvatarController {
	private usecase: SaveAvatarUseCase;

	constructor(usecase: SaveAvatarUseCase) {
		this.usecase = usecase;
	}

	@Post("/user/avatar/:id")
	@UseInterceptors(FileInterceptor("file"))
	@UsePipes(new FileSizeValidationPipe(MAX_SIZE))
	async upload(
		@UploadedFile("file") file: Express.Multer.File,
		@Param("id") id: string,
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
