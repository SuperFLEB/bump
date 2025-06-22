import {expect, describe, it, vi, beforeAll, beforeEach} from "vitest";
import canGit from "../../src/lib/canGit";
import cp from "node:child_process";
import isWorkingDirClean from "../../src/lib/isWorkingDirClean";

describe("lib/isWorkingDirClean", () => {
  vi.mock("../../src/lib/canGit", () => ({
    default: vi.fn(() => true)
  }));
  vi.mock("node:child_process", {spy: true});

  beforeEach(() => vi.clearAllMocks());

	it("Returns true if git diff returns successfully", () => {
    vi.mocked(canGit).mockReturnValue(true);
    vi.mocked(cp.execSync).mockReturnValue(new Buffer("yeah whatever", "utf-8"));
    expect(isWorkingDirClean()).toBe(true);
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(cp.execSync).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(/^git /));
	});

	it("Returns false if git diff throws", () => {
    vi.mocked(canGit).mockReturnValue(true);
    vi.mocked(cp.execSync).mockImplementation(() => { throw new Error("No way, pal")});
    expect(isWorkingDirClean()).toBe(false);
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(cp.execSync).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(/^git /));
	});

	it("Throws if canGit returns false", () => {
    vi.mocked(canGit).mockReturnValue(false);
    expect(() => isWorkingDirClean()).toThrow("Git is not installed");
    expect(canGit).toHaveBeenCalledTimes(1);
    expect(cp.execSync).not.toHaveBeenCalled();
	});
})
