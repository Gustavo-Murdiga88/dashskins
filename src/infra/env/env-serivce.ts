import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Env } from ".";

@Injectable()
export class EnvService {
	private configService: ConfigService<Env, true>;

	constructor(configService: ConfigService<Env, true>) {
		this.configService = configService;
	}

	get(key: keyof Env) {
		return this.configService.get(key);
	}
}
