import { compare } from "bcrypt";

import { Comparer } from "@/domain/register/application/cryptography/comparer";

export class FakerComparer implements Comparer {
	compare(text: string, hash: string): Promise<boolean> {
		return compare(text, hash);
	}
}
