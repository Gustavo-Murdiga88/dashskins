import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const mainPath = resolve(__dirname, "..", process.env.STORAGE);

try {
	await stat(mainPath);
} catch {
	await mkdir(mainPath);
}
