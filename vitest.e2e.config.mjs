import swc from "unplugin-swc";
import configPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		swc.vite({
			module: {
				type: "es6",
			},
		}),
		configPaths(),
	],
	test: {
		include: ["**/*.e2e-{spec,test}.ts"],
		globals: true,
	},
});
