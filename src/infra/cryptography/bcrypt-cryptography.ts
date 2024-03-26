import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";

import { Comparer } from "@/domain/register/application/cryptography/comparer";
import { Encrypter } from "@/domain/register/application/cryptography/encrypter";

@Injectable()
export class BcryptCryptography implements Encrypter, Comparer {
	private SALT_ROUNDS = 8;

	async compare(text: string, pass: string): Promise<boolean> {
		return compare(text, pass);
	}

	async encrypt(text: string): Promise<string> {
		return hash(text, this.SALT_ROUNDS);
	}
}
