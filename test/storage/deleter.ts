import { rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

import {
	Deleter,
	IDeleter,
} from "@/domain/register/application/storage/delete";

export class StorageDeleter implements Deleter {
	async delete({ url }: IDeleter): Promise<void> {
		const mainPath = resolve(__dirname, "..", "..");

		const path = `${mainPath}/${process.env.STORAGE}/${url}`;

		const statFile = await stat(path);

		if (!statFile.isFile()) {
			throw new Error(
				"Does not able find this file. Please check your file id",
			);
		}

		await rm(path);
	}
}
