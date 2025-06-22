import {afterEach, describe, expect, it, vi} from "vitest";
import cp from "node:child_process";
import canGit from "../../src/lib/canGit";

describe("lib/canGit", () => {
  vi.mock("node:child_process", {spy: true});

  afterEach(() => vi.clearAllMocks());

  it("Returns true when \"git version\" succeeds", () => {
    const mockExecSync = vi.mocked(cp.execSync).mockReturnValue(new Buffer("fake success", "utf8"));
    expect(canGit()).toBe(true);
    expect(mockExecSync).toHaveBeenCalledTimes(1);
  });

  it("Returns false when \"git version\" fails", () => {
    const mockExecSync = vi.mocked(cp.execSync).mockImplementation(() => {
      throw new Error("Oh no!");
    });
    expect(canGit()).toBe(false);
    expect(mockExecSync).toHaveBeenCalledTimes(1);
  });
});
