import {
	Body,
	Controller,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { SigninUsecase } from "@/domain/register/application/use-cases/singin-usecase";

import { Public } from "../../auth/auth-metadata";
import { ZodValidationPipe } from "../pipe/zod.pipe";

const sessionSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type BodyParsed = z.infer<typeof sessionSchema>;

@Controller()
export class SigInController {
	private usecase: SigninUsecase;

	constructor(usecase: SigninUsecase) {
		this.usecase = usecase;
	}

	@Public()
	@Post("/session")
	@UsePipes(new ZodValidationPipe(sessionSchema))
	async execute(@Body() body: BodyParsed) {
		const { email, password } = body;

		const session = await this.usecase.execute({
			email,
			password,
		});

		if (session.isLeft()) {
			throw new UnauthorizedException(session.value.message);
		}

		return {
			token: session.value.token,
			refreshToken: session.value.refreshToken,
		};
	}
}
