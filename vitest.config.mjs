import configPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [configPaths()],
	test: {
		setupFiles: ["./test/test-setup.ts"],
		env: {
			STORAGE: "temp",
		},
		include: ["**/*.{spec,test}.ts"],
		globals: true,
	},
});
