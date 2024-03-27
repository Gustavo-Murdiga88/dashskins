import { Module } from "@nestjs/common";

import { EnvModule } from "./env/env.module";
import { HttpModule } from "./http/http.module";
import { StorageModule } from "./storage/storage.module";

@Module({
	imports: [HttpModule, EnvModule, StorageModule],
})
export class AppModule {}
