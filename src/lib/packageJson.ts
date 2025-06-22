import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {join} from "node:path";

export type MinimalPackageJson = {
  name: string;
  version: string;
}

function getPackageJsonAndPath(packageJsonDirectory: string): [MinimalPackageJson, string] {
  if (!packageJsonDirectory) throw new Error("Root directory not specified. Use \".\" to specify the current directory.");
  const pjPath = join(packageJsonDirectory, "package.json");
  if (!existsSync(pjPath)) throw new Error("Root directory missing or does not contain a package.json file.");
  let contentsText: string;
  let contents: Record<string, any>;

  contentsText = readFileSync(pjPath, { encoding: "utf-8" });
  contents = JSON.parse(contentsText);

  if (!contents || !contents.name || !contents.version) throw new Error("package.json is invalid or missing vital fields");
  return [contents as MinimalPackageJson, pjPath];
}

export function getPackageJson(packageJsonDirectory: string): MinimalPackageJson {
  return getPackageJsonAndPath(packageJsonDirectory)[0];
}

export function mergePackageJson(packageJsonDirectory: string, merge: Record<string, any>): MinimalPackageJson {
  const [contents, pjPath] = getPackageJsonAndPath(packageJsonDirectory);
  const updatedContents = {...contents, ...merge};
  writeFileSync(pjPath, JSON.stringify(updatedContents, null, 2), "utf-8");
  return updatedContents;
}
