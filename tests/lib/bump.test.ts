import {afterEach, describe, expect, it, vi} from "vitest";
import bump from "../../src/lib/bump";
import {getPackageJson, mergePackageJson} from "../../src/lib/packageJson";
import {join} from "node:path";

const sampleDir = join(import.meta.dirname, "sample");

describe("lib/bump", () => {
  vi.mock("../../src/lib/packageJson.js", () => ({
    getPackageJson: vi.fn().mockReturnValue({name: "mock", version: "1.2.3"}),
    mergePackageJson: vi.fn().mockImplementation((rootDir: string, merge: Record<string, any>) => ( {name: "mock", version: "2.3.4"})),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  for (const testSetup of [
    [[sampleDir], "1.2.4"],
    [[sampleDir, "patch"], "1.2.4"],
    [[sampleDir, "minor"], "1.3.0"],
    [[sampleDir, "major"], "2.0.0"],
  ] as [string[], string][]) {
    it(`Increments the value from 1.2.3 to ${testSetup[1]} with bump type ${testSetup[0][1] ?? '(omitted)'}`, () => {
      bump(testSetup[0]);
      expect(getPackageJson).toHaveBeenCalledExactlyOnceWith(sampleDir);
      expect(mergePackageJson).toHaveBeenCalledExactlyOnceWith(sampleDir, {version: testSetup[1]});
    });
  }
});
