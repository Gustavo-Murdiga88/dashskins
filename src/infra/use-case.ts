import { Injectable } from "@nestjs/common";

@Injectable()
export class Usecase {
	getHello(): string {
		return "Hello World!";
	}

	teste(): string {
		return "Hello World!";
	}
}
