import { hash } from "bcrypt";

import { Encrypter } from "@/domain/register/application/cryptography/encrypter";

export class FakerEncrypter implements Encrypter {
	private SALT_ROUNDS = 8;

	async encrypt(text: string): Promise<string> {
		return hash(text, this.SALT_ROUNDS);
	}
}
