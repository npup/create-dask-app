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
import { blue, bold, cyan, gray, yellow } from "kleur/colors";

const argv = yargs(hideBin(process.argv))
  .usage(
    `\n${yellow("Usage:")}
  $0 [dir] [-f -v]`
  )
  .positional("dir", {
    describe: "directory to clone app to",
    type: "string",
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
  .parse();
const [dir = "./"] = argv._;
const { force: isForce } = argv;
console.log({ dir, isForce });

const { version } = JSON.parse(
  fse.readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

const REPO = "git@github.com:npup/dask-app.git";

export async function main(repo, targetName, verbose) {
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
  clone({ repo, target, targetName, verbose });
}

main(REPO, dir, argv.verbose);
