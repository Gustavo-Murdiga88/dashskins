import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Injectable } from "@nestjs/common";

import {
	Deleter,
	IDeleter,
} from "@/domain/register/application/storage/delete";
import {
	IUpload,
	Uploader,
} from "@/domain/register/application/storage/upload";

import { EnvService } from "../env/env-service";

@Injectable()
export class StorageService implements Deleter, Uploader {
	private envService: EnvService;

	constructor(envService: EnvService) {
		this.envService = envService;
	}

	async upload(upload: IUpload): Promise<string> {
		const url = `${randomUUID()}-${upload.name}`;

		const path = resolve(this.envService.get("STORAGE"), url);
		await writeFile(path, upload.body);

		return url;
	}

	async delete({ url }: IDeleter): Promise<void> {
		const path = resolve(this.envService.get("STORAGE"), url);

		if (!existsSync(path)) {
			throw new Error(
				"Does not able find this file. Please check your file id",
			);
		}

		await unlink(path);
	}
}
