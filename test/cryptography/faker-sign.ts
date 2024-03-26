import { randomUUID } from "crypto";

import { JWT } from "@/domain/register/application/cryptography/jwt";

export class FakerSign implements JWT {
	async sign(): Promise<string> {
		return randomUUID();
	}
}
