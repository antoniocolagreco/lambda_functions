import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { build } from "esbuild"

const functions = readdirSync("src").filter((file) =>
	statSync(join("src", file)).isDirectory(),
)
const jobs = []

for (const fn of functions) {
	const job = build({
		entryPoints: [`src/${fn}/index.ts`],
		bundle: false,
		platform: "node",
		format: "esm",
		target: "node26",
		outfile: `dist/${fn}/index.mjs`,
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
