import { writeFile } from "fs/promises";
import { resolve } from "path";

import {
	IUpload,
	Uploader,
} from "@/domain/register/application/storage/upload";

export class StorageUploader implements Uploader {
	async upload(upload: IUpload): Promise<string> {
		const mainPath = resolve(__dirname, "..", "..");

		const path = `${mainPath}/${process.env.STORAGE}/${upload.name}.${upload.type}`;

		await writeFile(path, upload.body);

		return `${upload.name}.${upload.type}`;
	}
}
