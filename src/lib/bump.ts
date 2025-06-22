import {getPackageJson, mergePackageJson} from "./packageJson.js";

export default function bump(args: string[]): void {
  args = [...args];
  const packageJsonPath = args.shift() as string;
  const packageJson = getPackageJson(packageJsonPath);

  let version = /^\d+\.\d+\.\d+$/.test(packageJson.version) ? packageJson.version.split(".").map((v: string) => Number(v)) : [0, 0, 0];
  let bumpPart = ["major", "minor", "patch"].findIndex(p => args.includes(p));
  if (bumpPart === -1) bumpPart = 2;
  const newVersion = [...version.slice(0, bumpPart), version[bumpPart] + 1, 0, 0, 0].slice(0, 3);
  const newVersionString = newVersion.join(".");

  console.log(packageJson.version, "-->", newVersionString);

  mergePackageJson(packageJsonPath, {version: newVersionString});
}
