import {execSync} from "node:child_process";
import canGit from "./canGit.js";
import EnvironmentError from "./EnvironmentError.js";

export default function isWorkingDirClean(): boolean {
  if (!canGit()) throw new EnvironmentError("Git is not installed.");

	try {
		execSync("git diff --quiet --exit-code");
    return true;
	} catch (e) {
		return false;
	}
}
