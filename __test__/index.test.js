const path = require("path");
const loader = require("../src/index");

describe("Test all global functions", () => {
  test("Should load all file names inside a folder", () => {
    const fileNames = loader.getAllFiles(path.resolve("./sample"));
    expect(fileNames).toHaveLength(3);
  });
  test("Should load all file names inside a folder recursive", () => {
    const fileNames = loader.getAllFilesRecursive(path.resolve("./sample"));
    expect(fileNames).toHaveLength(5);
  });
  test("Should load all modules inside a folder", () => {
    const fileNames = loader.loadModules("./sample");
    expect(fileNames).toHaveLength(3);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });
  test("Should load all modules inside a folder recursive", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: true,
    });
    expect(fileNames).toHaveLength(5);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });
  test("Should throw an error if an invalid directory is given", () => {
    expect(() => loader.loadModules("invalid dir")).toThrow();
  });
});
