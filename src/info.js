import { green, yellow, bold } from "kleur/colors";

function isCurrentDir(dir) {
  return [".", "./"].includes(dir);
}
export function printInfo({ repo, targetName }) {
  const needCd = !isCurrentDir(targetName);
  const steps = [
    needCd ? green(`cd ${targetName}`) : "",
    green(`npm install`),
    green(`npm start`),
  ].filter(Boolean);

  console.info(`
${bold(yellow("Skeleton app set up successfully!"))}

Next steps:

  ${steps.join("\n  ")}

Then direct browser to http://localhost:3000/

`);
}
