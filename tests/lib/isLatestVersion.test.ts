import canGit from "../../src/lib/canGit";
import isWorkingDirClean from "../../src/lib/isWorkingDirClean";
import {getPackageJson} from "../../src/lib/packageJson";
import cp from "node:child_process";

import {expect, describe, it, vi, afterEach} from "vitest";
import isLatestVersion from "../../src/lib/isLatestVersion";
import {execSync} from "child_process";

describe("lib/isLatestVersion", () => {
  vi.mock("../../src/lib/canGit", () => ({
    default: vi.fn(() => true)
  }));
  vi.mock("../../src/lib/isWorkingDirClean", () => ({
    default: vi.fn(() => true)
  }));
  vi.mock("../../src/lib/packageJson", { spy: true });
  vi.mock("node:child_process", {spy: true});

  afterEach(() => vi.resetAllMocks());

  it("Returns true when the git working directory is clean and the tag is the same as the latest version", () => {
    vi.mocked(getPackageJson).mockReturnValue({ name: "mock", version: "1.2.3" });
    vi.mocked(cp.execSync).mockReturnValue(new Buffer("1.2.3", "utf-8"));

    expect(isLatestVersion("some/path")).toBe(true);

    expect(canGit).toHaveBeenCalledTimes(1);
    expect(isWorkingDirClean).toHaveBeenCalledTimes(1);
    expect(getPackageJson).toHaveBeenCalledExactlyOnceWith("some/path");
  });

  it("Returns false when the git working directory is dirty", () => {
    vi.mocked(isWorkingDirClean).mockReturnValue(false);

    expect(isLatestVersion("some/path")).toBe(false);

    expect(canGit).toHaveBeenCalledTimes(1);
    expect(isWorkingDirClean).toHaveBeenCalledTimes(1);
    expect(getPackageJson).not.toHaveBeenCalled();
    expect(execSync).not.toHaveBeenCalled();
  });

  it("Returns false when the version in the tag does not match package.json", () => {
    vi.mocked(getPackageJson).mockReturnValue({ name: "mock", version: "1.2.3" });
    vi.mocked(cp.execSync).mockReturnValue(new Buffer("1.2.2", "utf-8"));

    expect(isLatestVersion("some/path")).toBe(false);

    expect(canGit).toHaveBeenCalledTimes(1);
    expect(isWorkingDirClean).toHaveBeenCalledTimes(1);
    expect(getPackageJson).toHaveBeenCalledExactlyOnceWith("some/path");
  });

  it("Returns false when there is no version in the tag", () => {
    vi.mocked(getPackageJson).mockReturnValue({ name: "mock", version: "1.2.3" });
    vi.mocked(cp.execSync).mockReturnValue(new Buffer("", "utf-8"));

    expect(isLatestVersion("some/path")).toBe(false);

    expect(canGit).toHaveBeenCalledTimes(1);
    expect(isWorkingDirClean).toHaveBeenCalledTimes(1);
    expect(getPackageJson).toHaveBeenCalledExactlyOnceWith("some/path");
  });
});
