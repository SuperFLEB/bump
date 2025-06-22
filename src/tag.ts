import isLatestVersion from "./lib/isLatestVersion.js";
import EnvironmentError from "./lib/EnvironmentError.js";
import canGit from "./lib/canGit.js";
import isWorkingDirClean from "./lib/isWorkingDirClean.js";
import tag from "./lib/tag.js";

if (!canGit()) throw new EnvironmentError("Git is not installed.");
if (!process.argv[2]) {
  console.error('No package.json directory provided. Use "." for the current working directory.');
  process.exit(1);
}

if (!isWorkingDirClean()) {
  console.warn("Working directory is dirty. Commit or stash before running tag");
  process.exit(1);
}

if (isLatestVersion(process.argv[2])) {
  console.warn("Not tagging because the current commit is already tagged with the current version. If you want to tag a new version, bump before tagging.");
  process.exit(0);
}

tag(process.argv[2], process.argv[3] || undefined);
