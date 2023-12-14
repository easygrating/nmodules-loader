const path = require("path");
const loader = require("../src/index").sync;

describe("Test all sync global functions", () => {
  test("Should load all file names inside a folder (synchronous)", () => {
    const fileNames = loader.getAllFiles(path.resolve("./sample"));
    expect(fileNames).toHaveLength(5);
  });

  test("Should load all file names inside a folder recursive (synchronous)", () => {
    const fileNames = loader.getAllFiles(path.resolve("./sample"), {
      recursive: true,
    });
    expect(fileNames).toHaveLength(8);
  });

  test("Should load all modules inside a folder (synchronous)", () => {
    const fileNames = loader.loadModules("./sample");
    expect(fileNames).toHaveLength(3);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive (synchronous)", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: true,
    });
    expect(fileNames).toHaveLength(6);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should throw an error if an invalid directory is given (synchronous)", () => {
    const invalidDir = "invalid dir";
    expect(() => loader.loadModules(invalidDir)).toThrow(/INVALID PATH/);
  });

  test("Should load all modules inside a folder with prefix (synchronous)", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: false,
      prefix: ["c-", "i"],
    });
    expect(fileNames).toHaveLength(2);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with postfix (synchronous)", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: true,
      postfix: ["service.js", "ex.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with exclude (synchronous)", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: true,
      exclude: ["index.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with prefix, postfix, exclude (synchronous)", () => {
    const fileNames = loader.loadModules("./sample", {
      recursive: true,
      postfix: ["service.js"],
      prefix: ["c"],
      exclude: ["child-2.service.js"],
    });
    expect(fileNames).toHaveLength(1);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });
});
