import { exec } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { config } from "dotenv";

const execAsync = promisify(exec);

config({
	override: true,
});
const prisma = new PrismaClient();
const schemaName = randomUUID();

function generateScheme(schemeName: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("please provide an environment variable DATABASE_URL");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schemeName);

	process.env.DATABASE_URL = url.toString();
}

async function deleteSchema(name: string) {
	const query = `DROP SCHEMA IF EXISTS "${name}" CASCADE`;
	await prisma.$executeRawUnsafe(query);
}

export async function deleteCurrentSchema() {
	await deleteSchema(schemaName);
}

beforeAll(async () => {
	const mainPath = resolve(__dirname, "..", process.env.STORAGE);

	if (!existsSync(mainPath)) {
		mkdirSync(mainPath, { recursive: true });
	}

	generateScheme(schemaName);
	await execAsync("prisma migrate deploy");
});
