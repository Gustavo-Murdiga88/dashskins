import { Module } from "@nestjs/common";

import { Deleter } from "@/domain/register/application/storage/delete";
import { Uploader } from "@/domain/register/application/storage/upload";

import { EnvModule } from "../env/env.module";
import { StorageService } from "./storage-service";

@Module({
	imports: [EnvModule],
	providers: [
		StorageService,
		{
			provide: Deleter,
			useClass: StorageService,
		},
		{
			provide: Uploader,
			useClass: StorageService,
		},
	],
	exports: [Uploader, Deleter],
})
export class StorageModule {}
