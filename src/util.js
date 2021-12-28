import path from "path";
import fse from "fs-extra";
import degit from "degit";
import prompts from "prompts";
import { printInfo } from "./info.js";
import { blue } from "kleur/colors";

export async function obtainDirectory(dirName) {
  const cwd = process.cwd();
  const dir = path.resolve(cwd, dirName);
  try {
    await fse.ensureDir(dir);
  } catch (er) {
    console.error("ERR", er);
    process.exit(1);
  }
  return dir;
}

export async function confirmOverwrite(dir) {
  const response = await prompts({
    type: "confirm",
    name: "forceOverwrite",
    message: `Directory ${blue(dir)} is not empty.\nContinue anyway?`,
    initial: false,
  });
  if (!response.forceOverwrite) {
    process.exit(0);
  }
  return true;
}

export async function isDirEmpty(dir) {
  return fse.readdirSync(dir).length > 0;
}

export function clone({ repo, target, targetName, verbose }) {
  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: verbose,
  });

  emitter.on("info", (info) => {
    console.log(info.message);
  });

  emitter.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  emitter.clone(targetName).then(() => {
    printInfo({ repo, targetName });
  });
}
