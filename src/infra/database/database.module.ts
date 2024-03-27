import { Module } from "@nestjs/common";

import { AvatarRepository } from "@/domain/register/application/repositories/avatar-repository";
import { UserRepository } from "@/domain/register/application/repositories/user-repository";

import { PrismaService } from "./prisma/prisma.service";
import { PrismaAvatarRepository } from "./prisma/repositories/prisma-avatar-repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user-repository";

@Module({
	providers: [
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
		{
			provide: AvatarRepository,
			useClass: PrismaAvatarRepository,
		},
		PrismaService,
	],
	exports: [PrismaService, UserRepository, AvatarRepository],
})
export class DatabaseModule {}
