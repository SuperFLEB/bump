import isLatestVersion from "./lib/isLatestVersion.js";
import bump from "./lib/bump.js";

if (!process.argv[2]) {
  console.error("No package.json directory provided. Use \".\" for the current working directory.");
}
if (!isLatestVersion(process.argv[2])) bump(process.argv.slice(2));
