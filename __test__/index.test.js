const path = require("path");
const loader = require("../src/index");

describe("Test all global functions", () => {
  test("Should load all file names inside a folder", async () => {
    const fileNames = await loader.getAllFiles(path.resolve("./sample"));
    expect(fileNames).toHaveLength(5);
  });

  test("Should load all file names inside a folder recursive", async () => {
    const fileNames = await loader.getAllFilesRecursive(
      path.resolve("./sample")
    );
    expect(fileNames).toHaveLength(8);
  });

  test("Should load all modules inside a folder", async () => {
    const fileNames = await loader.loadModules("./sample");
    expect(fileNames).toHaveLength(3);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder c", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
    });
    expect(fileNames).toHaveLength(6);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should throw an error if an invalid directory is given", async () => {
    await expect(loader.loadModules("invalid dir")).rejects.toThrow(
      "INVALID PATH"
    );
  });

  test("Should load all modules inside a folder with prefix", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: false,
      prefix: ["c-", "i"],
    });
    expect(fileNames).toHaveLength(2);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with postfix", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
      postfix: ["service.js", "ex.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with exclude", async () => {
    const fileNames = await loader.loadModules("./sample", {
      recursive: true,
      exclude: ["index.js"],
    });
    expect(fileNames).toHaveLength(4);
    fileNames.forEach((item) => {
      expect(item).toHaveProperty("data");
    });
  });

  test("Should load all modules inside a folder recursive with prefix, postfix, exclude", async () => {
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
