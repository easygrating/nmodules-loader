"use strict";

const { access, constants, readdir } = require("fs").promises;
const path = require("path");
const ERROR_MESSAGE = "INVALID PATH";

/**
 * Load all modules of a directory.
 *
 * @param {string} dir - The directory path to load the modules from.
 * @param {Object} opts - Optional options object.
 * @param {boolean} opts.recursive - If true, loads modules recursively from the directory. Default is false.
 * @return {Promise<Array>} - A promise that resolves to an array of loaded modules.
 * @throws {Error} - Throws an error if the directory cannot be accessed or if loading modules fails.
 */
async function loadModules(dir, opts) {
  const recursive = opts?.recursive;
  const fullPath = path.resolve(dir);

  try {
    await access(fullPath, constants.F_OK && constants.R_OK);

    const fileNames = !!recursive
      ? await getAllFilesRecursive(fullPath)
      : await getAllFiles(fullPath);

    return fileNames
      .map((item) => tryRequire(item))
      .filter((item) => item !== null);
  } catch (err) {
    throw new Error(ERROR_MESSAGE);
  }
}

/**
 * Tries to require a module at the specified path.
 *
 * @param {string} path - The path to the module.
 * @return {object} The required module if successful, null otherwise.
 */
function tryRequire(path) {
  try {
    return require(path);
  } catch (err) {
    console.error('Error loading module "%s": %s', path, err);
    return null;
  }
}

/**
 * Recursively retrieves all files in a directory and its subdirectories.
 *
 * @param {string} dir - The directory path to start the search from.
 * @return {Array<string>} An array of file paths.
 */
async function getAllFilesRecursive(dir) {
  const children = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const child of children) {
    if (child.isDirectory()) {
      result.push(...(await getAllFiles(path.join(dir, child.name))));
    } else {
      result.push(path.join(dir, child.name));
    }
  }

  return result;
}

/**
 * Loads all file of a directory.
 *
 * @param {string} dir - The directory path.
 * @return {Array} - An array containing the paths of all the files in the directory.
 */
async function getAllFiles(dir) {
  return (await readdir(dir, { withFileTypes: true }))
    .filter((item) => !item.isDirectory())
    .map((item) => path.join(dir, item.name));
}

module.exports = {
  loadModules,
  getAllFiles,
  getAllFilesRecursive,
};
