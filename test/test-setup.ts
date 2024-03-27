import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const mainPath = resolve(__dirname, "..", process.env.STORAGE);

if (!existsSync(mainPath)) {
	mkdirSync(mainPath, { recursive: true });
}
