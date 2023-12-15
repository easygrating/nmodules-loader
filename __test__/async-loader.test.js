const path = require("path");
const loader = require("../src/index");

describe("Test all async global functions", () => {
  test("Should load all file names inside a folder (asynchronous)", async () => {
    const fileNames = await loader.getAllFiles(path.resolve("./sample"));
    expect(fileNames).toHaveLength(5);
  });

  test("Should load all file names inside a folder recursive (asynchronous)", async () => {
    const fileNames = await loader.getAllFiles(path.resolve("./sample"), {
      recursive: true,
    });
    expect(fileNames).toHaveLength(8);
  });

  test("Should load all modules inside a folder (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample");
    expect(fileNames).toHaveLength(3);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
    });
    expect(fileNames).toHaveLength(6);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should throw an error if an invalid directory is given (asynchronous)", async () => {
    await expect(loader.loadModules("invalid dir")).rejects.toThrow(
      /INVALID PATH/
    );
  });

  test("Should load all modules inside a folder with prefix (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: false,
      prefix: ["c-", "i"],
    });
    expect(fileNames).toHaveLength(2);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with postfix (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
      postfix: ["service.js", "ex.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with exclude (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
      exclude: ["index.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with prefix, postfix, exclude (asynchronous)", async () => {
    const fileNames = await loader.loadModules("./sample", {
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
