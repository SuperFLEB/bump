import {expect, describe, it, vi, afterEach} from "vitest";
import fs from "node:fs";
import {getPackageJson, mergePackageJson} from "../../src/lib/packageJson";
import {join} from "node:path";

describe("lib/packageJson", () => {
  vi.mock("node:fs", {spy: true});

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getPackageJson", () => {
    it("Imports a package.json file from the specified path", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockReturnValue(`{ "name": "mock", "version": "1.2.3" }`);
      const result = getPackageJson("some/root/directory");
      const pjPath = join("some/root/directory", "package.json");
      expect(result).toEqual({name: "mock", version: "1.2.3"});
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
    });

    it("Throws when the path does not contain a package.json", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(false);
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow();
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it("Throws when the package.json cannot be read", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error("Something went terribly wrong");
      });
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow("Something went terribly wrong");
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
    });

    it("Throws when the package.json is invalid", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockReturnValue("I think you wanted Javascript Object Notation. I'm just some guy named Jason.");
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow();
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
    });
  });
  describe("mergePackageJson", () => {
    it("Merges a package.json with new and existing properties", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockReturnValue(`{ "name": "mock", "version": "1.2.3", "files": ["a", "b", "c"], "dependencies": { "@superfleb/mock": "^1.0.0" }}`);
      const mockWriteFileSync = vi.mocked(fs.writeFileSync).mockImplementation(() => {
      });
      const pjPath = join("some/root/directory", "package.json");
      const expected = {
        name: "mock",
        version: "1.2.3",
        description: "Additional information added",
        files: ["c", "d", "e"],
        dependencies: {"@superfleb/othermock": "^2.0.0"},
        devDependencies: {"@superfleb/devmock": "^2.0.0"},
      };
      const result = mergePackageJson("some/root/directory", {
        description: "Additional information added",
        files: ["c","d","e"],
        dependencies: {"@superfleb/othermock": "^2.0.0"},
        devDependencies: {"@superfleb/devmock": "^2.0.0"},
      });
      expect(result).toEqual(expected);
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
      expect(mockWriteFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, expect.any(String), "utf-8");
      expect(JSON.parse(mockWriteFileSync.mock.calls[0][1].toString())).toEqual(expected);
    });

    it("Throws when the path does not contain a package.json", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(false);
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow();
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(fs.readFileSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it("Throws when the package.json cannot be read", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error("Something went terribly wrong");
      });
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow("Something went terribly wrong");
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it("Throws when the package.json cannot be written", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockReturnValue(`{ "name": "mock", "version": "1.2.3" }`);
      const mockWriteFileSync = vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error("Something went terribly wrong");
      });
      const pjPath = join("some/root/directory", "package.json");
      const expectedWrite = {name: "mock", version: "2.3.4"};
      expect(() => mergePackageJson("some/root/directory", {version: "2.3.4"})).toThrow("Something went terribly wrong");
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
      expect(mockWriteFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, expect.any(String), "utf-8");
      expect(JSON.parse(mockWriteFileSync.mock.calls[0][1].toString())).toEqual(expectedWrite);
    });

    it("Throws when the package.json is invalid", () => {
      const mockExistsSync = vi.mocked(fs.existsSync).mockReturnValue(true);
      const mockReadFileSync = vi.mocked(fs.readFileSync).mockReturnValue("I think you wanted Javascript Object Notation. I'm just some guy named Jason.");
      const pjPath = join("some/root/directory", "package.json");
      expect(() => getPackageJson("some/root/directory")).toThrow();
      expect(mockExistsSync).toHaveBeenCalledExactlyOnceWith(pjPath);
      expect(mockReadFileSync).toHaveBeenCalledExactlyOnceWith(pjPath, {encoding: "utf-8"});
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
