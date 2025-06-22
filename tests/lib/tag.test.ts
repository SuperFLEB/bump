import {expect, describe, it, vi, beforeEach} from "vitest";
import * as cp from "node:child_process";
import canGit from "../../src/lib/canGit";
import {getPackageJson, mergePackageJson} from "../../src/lib/packageJson";
import tag from "../../src/lib/tag";

describe("/lib/tag", () => {
  vi.mock("../../src/lib/canGit", () => ({
    default: vi.fn(() => true)
  }));
  vi.mock("../../src/lib/packageJson", () => ({
    getPackageJson: vi.fn(() => ({name: "mock", version: "2.2.2"})),
    mergePackageJson: vi.fn(() => {
    }),
  }));
  vi.mock("node:child_process", {spy: true});

  beforeEach(() => vi.clearAllMocks());

  it("Sets the tag to the update version if one is given", () => {
    const execSyncMock = vi.mocked(cp.execSync).mockReturnValue(new Buffer("", "utf-8"));
    tag("some/path", "9.0.0");
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(mergePackageJson).toHaveBeenCalledExactlyOnceWith("some/path", {version: "9.0.0"});
    expect(getPackageJson).not.toHaveBeenCalled();
    expect(execSyncMock).toHaveBeenCalledExactlyOnceWith("git tag 9.0.0");
  });

  it("Sets the tag to the package.json version if no update version is given", () => {
    const execSyncMock = vi.mocked(cp.execSync).mockReturnValue(new Buffer("", "utf-8"));
    tag("some/path");
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(mergePackageJson).not.toHaveBeenCalled();
    expect(getPackageJson).toHaveBeenCalledExactlyOnceWith("some/path");
    expect(execSyncMock).toHaveBeenCalledExactlyOnceWith("git tag 2.2.2");
  });

  it("Throws if the update version given is not semver", () => {
    const execSyncMock = vi.mocked(cp.execSync).mockReturnValue(new Buffer("", "utf-8"));
    expect(() => tag("some/path", "3.0 Gold")).toThrow();
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(mergePackageJson).not.toHaveBeenCalled();
    expect(execSyncMock).not.toHaveBeenCalled();
    expect(getPackageJson).not.toHaveBeenCalled();
  });

  it("Throws if the package.json version is not semver and no update version is given", () => {
    const execSyncMock = vi.mocked(cp.execSync).mockReturnValue(new Buffer("", "utf-8"));
    const getPackageJsonMock = vi.mocked(getPackageJson).mockReturnValue({name: "mock", version: "3.0 Gold"});
    expect(() => tag("some/path")).toThrow();
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(getPackageJson).toHaveBeenCalledExactlyOnceWith("some/path");
    expect(execSyncMock).not.toHaveBeenCalled();
    expect(mergePackageJson).not.toHaveBeenCalled();
  });
});
