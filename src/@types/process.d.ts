/* eslint-disable @typescript-eslint/naming-convention */

import { Env } from "@/infra/env";

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
