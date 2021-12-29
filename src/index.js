#!/usr/bin/env node
import fse from "fs-extra";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  clone,
  confirmOverwrite,
  isDirEmpty,
  obtainDirectory,
} from "./util.js";
import { blue, bold, cyan, gray, yellow, red } from "kleur/colors";

const argv = yargs(hideBin(process.argv))
  .usage(
    `\n${yellow("Usage:")}
  $0 [dir] [-f -v]`
  )
  .positional("dir", {
    describe: "directory to clone app to",
    type: "string",
  })
  .option("react", {
    describe: "use React.js",
    type: "boolean",
  })
  .option("svelte", {
    describe: "use svelte",
    type: "boolean",
  })
  .option("force", {
    alias: "f",
    type: "boolean",
    description: "Overwrite existing files",
    default: false,
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Verbose output",
    default: false,
  })
  .conflicts("react", "svelte")
  .parse();

const [dir = "./"] = argv._;
const { verbose, force: isForce, svelte, react = true } = argv;
function decideFramework({ svelte, react }) {
  switch (true) {
    case svelte:
      return "svelte";
    case react:
      return "react";
  }
  return null;
}
const framework = decideFramework({ svelte, react });
if (!framework) {
  console.error(red(`# Error: No framework specified.`));
  process.exit(1);
}

const { version } = JSON.parse(
  fse.readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

const REPO = "git@github.com:npup/dask-app.git";

export async function main(repo, { dir: targetName, framework, verbose }) {
  console.log(`\n${bold("Welcome to DASK!")} ${gray(`(dask v${version})`)}`);
  console.log(
    `If you encounter a problem, visit ${cyan(
      "https://github.com/npup/dask-app/issues"
    )} to search or file a new issue.\n`
  );

  const target = await obtainDirectory(targetName);
  const okToWrite =
    isForce || !(await isDirEmpty(target)) || (await confirmOverwrite(target));
  if (!okToWrite) {
    console.log("Not overwriting - exiting");
    process.exit(0);
  }

  // time to degit
  console.info(blue(`cloning to ${target}`));
  clone({ repo: `${repo}#version/${framework}`, target, targetName, verbose });
}

main(REPO, { dir, framework, verbose });
