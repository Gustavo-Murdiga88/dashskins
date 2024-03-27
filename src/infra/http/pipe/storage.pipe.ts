import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
	private MAX_SIZE: number;

	constructor(size: number) {
		this.MAX_SIZE = size;
	}

	transform(file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException(
				"File not found, please check your payload",
			);
		}

		if (this.MAX_SIZE < file.size) {
			throw new BadRequestException(
				"File is too large, please sure your file size is less than 5Mb",
			);
		}

		return file;
	}
}
