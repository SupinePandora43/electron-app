const { task, series } = require("gulp")
const shell = require("gulp-shell")
const fs = require("fs")
const sp = require('synchronized-promise')

scripts = sp(async () => new Promise((resolve) => {
	fs.readFile("./package.json", async (_err, data) => {
		resolve(JSON.parse(data)["scripts"])
	})
}))();

for (const script_name in (scripts||{})) {
	task(script_name, shell.task(`npm run-script ${script_name}`))
}

task("travis",
	series(
		"build",
		"test",
		//"coverage"
	)
)
