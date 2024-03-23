/* eslint-disable @typescript-eslint/naming-convention */

type EnvProps = {
	DATABASE_URL: string;
};
declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvProps {}
	}
}
