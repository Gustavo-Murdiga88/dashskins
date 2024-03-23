import { Module } from "@nestjs/common";

import { SaveUserUseCase } from "@/domain/register/application/use-cases/save-user-usecase";

import { DatabaseModule } from "../database/database.module";
import { CreateUserController } from "./controllers/create-user.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [CreateUserController],
	providers: [SaveUserUseCase],
})
export class HttpModule {}
