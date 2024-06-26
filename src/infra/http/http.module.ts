import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account-usecase";
import { DeleteAvatarUseCase } from "@/domain/register/application/use-cases/delete-avatar-usecase";
import { DeleteUserUseCase } from "@/domain/register/application/use-cases/delete-user-usecase";
import { UpdateUserUseCase } from "@/domain/register/application/use-cases/edit-user-usecase";
import { ListUserUseCase } from "@/domain/register/application/use-cases/list-users-usecase";
import { SaveAvatarUseCase } from "@/domain/register/application/use-cases/save-avatar-usecase";
import { SaveUserUseCase } from "@/domain/register/application/use-cases/save-user-usecase";
import { SigninUsecase } from "@/domain/register/application/use-cases/singin-usecase";

import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env-service";
import { StorageModule } from "../storage/storage.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateUserController } from "./controllers/create-user.controller";
import { DeleteAvatarController } from "./controllers/delete-avatar.controller";
import { DeleteUserController } from "./controllers/delete-user.controller";
import { ListUserController } from "./controllers/list-user.controller";
import { SigInController } from "./controllers/singin.controller";
import { UpdateUserController } from "./controllers/update-user.controller";
import { UploadAvatarController } from "./controllers/upload-avatar.controller";

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		CryptographyModule,
		StorageModule,
		ServeStaticModule.forRootAsync({
			isGlobal: true,
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: (envService: EnvService) => {
				const path = join(
					__dirname,
					"..",
					"..",
					"..",
					envService.get("STORAGE"),
				);

				return [
					{
						rootPath: path,
					},
				];
			},
		}),
	],
	controllers: [
		CreateUserController,
		DeleteUserController,
		UpdateUserController,
		ListUserController,
		CreateAccountController,
		SigInController,
		UploadAvatarController,
		DeleteAvatarController,
	],
	providers: [
		SaveUserUseCase,
		UpdateUserUseCase,
		ListUserUseCase,
		DeleteUserUseCase,
		CreateAccountUseCase,
		SigninUsecase,
		SaveAvatarUseCase,
		DeleteAvatarUseCase,
	],
})
export class HttpModule {}
