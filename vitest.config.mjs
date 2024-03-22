import configPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [configPaths()],
	test: {
		include: ["**/*.{spec,test}.ts"],
		globals: true,
	},
});
