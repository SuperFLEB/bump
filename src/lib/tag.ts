import {execSync} from "child_process";
import {getPackageJson, mergePackageJson} from "./packageJson.js";
import canGit from "./canGit.js";
import EnvironmentError from "./EnvironmentError";

function verifyVersionOrThrow(version?: string): string {
  if (version && !/^(\d+\.){2}\d+$/.test(version)) throw new Error("Update version must be in n.n.n Semver format");
  return version as string;
}

function setVersion(packageJsonPath: string, updateVersion: string): string {
  mergePackageJson(packageJsonPath, { version: verifyVersionOrThrow(updateVersion) });
  return updateVersion;
}

function getVersion(packageJsonPath: string): string {
  return verifyVersionOrThrow(getPackageJson(packageJsonPath).version);
}

export default function tag(packageJsonPath: string, updateVersion?: string): void {
  if (!canGit()) throw new EnvironmentError("Git is not installed");
  const version = updateVersion ? setVersion(packageJsonPath, updateVersion) : getVersion(packageJsonPath);
  execSync(`git tag ${version}`);
}
