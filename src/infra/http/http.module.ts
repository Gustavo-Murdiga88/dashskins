import { Module } from "@nestjs/common";

import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";
import { UpdateUserUseCase } from "@/domain/register/application/use-cases/edit-user-usecase";
import { ListUserUseCase } from "@/domain/register/application/use-cases/list-users-usecase";
import { SaveUserUseCase } from "@/domain/register/application/use-cases/save-user-usecase";

import { DatabaseModule } from "../database/database.module";
import { CreateUserController } from "./controllers/create-user.controller";
import { DeleteUserController } from "./controllers/delete-user.controller";
import { ListUserController } from "./controllers/list-user.controller";
import { UpdateUserController } from "./controllers/update-user.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [
		CreateUserController,
		DeleteUserController,
		UpdateUserController,
		ListUserController,
	],
	providers: [
		SaveUserUseCase,
		UpdateUserUseCase,
		ListUserUseCase,
		DeleteUserUseCase,
	],
})
export class HttpModule {}
