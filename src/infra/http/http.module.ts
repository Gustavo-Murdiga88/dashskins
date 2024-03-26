import { Module } from "@nestjs/common";

import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account-usecase";
import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";
import { UpdateUserUseCase } from "@/domain/register/application/use-cases/edit-user-usecase";
import { ListUserUseCase } from "@/domain/register/application/use-cases/list-users-usecase";
import { SaveUserUseCase } from "@/domain/register/application/use-cases/save-user-usecase";
import { SigninUsecase } from "@/domain/register/application/use-cases/singin-usecase";

import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateUserController } from "./controllers/create-user.controller";
import { DeleteUserController } from "./controllers/delete-user.controller";
import { ListUserController } from "./controllers/list-user.controller";
import { SigInController } from "./controllers/sigin.controller";
import { UpdateUserController } from "./controllers/update-user.controller";

@Module({
	imports: [DatabaseModule, AuthModule, CryptographyModule],
	controllers: [
		CreateUserController,
		DeleteUserController,
		UpdateUserController,
		ListUserController,
		CreateAccountController,
		SigInController,
	],
	providers: [
		SaveUserUseCase,
		UpdateUserUseCase,
		ListUserUseCase,
		DeleteUserUseCase,
		CreateAccountUseCase,
		SigninUsecase,
	],
})
export class HttpModule {}
