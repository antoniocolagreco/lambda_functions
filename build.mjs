import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { build } from "esbuild"

const functions = readdirSync("src/functions").filter((file) =>
	statSync(join("src/functions", file)).isDirectory(),
)
const jobs = []

for (const fn of functions) {
	if (fn === "template") continue
	const job = build({
		entryPoints: [`src/functions/${fn}/index.ts`],
		minify: true,
		bundle: true,
		platform: "node",
		format: "esm",
		target: "node26",
		outfile: `dist/${fn}/index.mjs`,
		external: ["@aws-sdk/*"],
		treeShaking: true,
	})
		.then(() => {
			console.info(`Built ${fn}.`)
		})
		.catch(() => {
			console.error(`Failed to build ${fn}`)
		})

	jobs.push(job)
}

await Promise.all(jobs)
