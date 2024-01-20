import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist/",
	minify: true,
	sourcemap: "external",
	plugins: [dts()],
});
