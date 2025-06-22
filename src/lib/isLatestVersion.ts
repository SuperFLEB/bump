import {execSync} from "node:child_process";
import isWorkingDirClean from "./isWorkingDirClean.js";
import {getPackageJson} from "./packageJson.js";
import EnvironmentError from "./EnvironmentError.js";
import canGit from "./canGit.js";

export default function isLatestVersion(packageJsonDirectory: string): boolean {
  if (!canGit()) throw new EnvironmentError("Git is not installed.");
  if (!isWorkingDirClean()) return false;
  const packageJson = getPackageJson(packageJsonDirectory);
  const jsonVersion = packageJson.version;

  try {
    const tags = execSync(`git describe --exact-match --tags HEAD`).toString().split("\n");
    return tags.includes(jsonVersion);
  } catch (e) {
    return false;
  }
}
