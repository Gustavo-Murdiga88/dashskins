import { Module } from "@nestjs/common";

import { Comparer } from "@/domain/register/application/cryptography/comparer";
import { Encrypter } from "@/domain/register/application/cryptography/encrypter";
import { JWT } from "@/domain/register/application/cryptography/jwt";

import { AuthModule } from "../auth/auth.module";
import { BcryptCryptography } from "./bcrypt-cryptography";
import { JWTSign } from "./jwt-sign";

@Module({
	imports: [AuthModule],
	providers: [
		{
			provide: Encrypter,
			useClass: BcryptCryptography,
		},
		{
			provide: Comparer,
			useClass: BcryptCryptography,
		},
		{
			provide: JWT,
			useClass: JWTSign,
		},
		BcryptCryptography,
	],
	exports: [BcryptCryptography, Encrypter, Comparer, JWT],
})
export class CryptographyModule {}
