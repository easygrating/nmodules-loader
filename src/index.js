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
 * @param {Array<string>} opts.prefix - An array of file name prefixes to match.
 * @param {Array<string>} opts.postfix - An array of file name postfixes to match.
 * @param {Array<string>} opts.exclude - An array of file names to exclude from the search.
 * @return {Promise<Array>} - A promise that resolves to an array of loaded modules.
 * @throws {Error} - Throws an error if the directory cannot be accessed or if loading modules fails.
 */
async function loadModules(dir, opts = {}) {
  const recursive = opts?.recursive;
  const fullPath = path.resolve(dir);

  try {
    await access(fullPath, constants.F_OK && constants.R_OK);

    let fileNames = !!recursive
      ? await getAllFilesRecursive(fullPath, opts)
      : await getAllFiles(fullPath, opts);

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
 * Recursively retrieves all files in a directory and its subdirectories
 * that match specified criteria.
 *
 * @param {string} dir - The directory path to start the search from.
 * @param {Object} opts - An optional object containing search criteria.
 * @param {Array<string>} opts.prefix - An array of file name prefixes to match.
 * @param {Array<string>} opts.postfix - An array of file name postfixes to match.
 * @param {Array<string>} opts.exclude - An array of file names to exclude from the search.
 * @return {Promise<Array<string>>} - A promise that resolves to an array of file paths.
 */
async function getAllFilesRecursive(dir, opts = {}) {
  const prefix = (opts?.prefix || []).map((item) => item.toLowerCase());
  const postfix = (opts?.postfix || []).map((item) => item.toLowerCase());
  const exclude = (opts?.exclude || []).map((item) => item.toLowerCase());

  const result = [];

  async function proccessDirectory(directory) {
    const children = await readdir(directory, { withFileTypes: true });

    for (const child of children) {
      if (child.isDirectory()) {
        await proccessDirectory(path.join(directory, child.name));
      } else {
        const fileName = child.name.toLowerCase();
        if (
          (!prefix.length || prefix.some((val) => fileName.startsWith(val))) &&
          (!postfix.length || postfix.some((val) => fileName.endsWith(val))) &&
          !exclude.includes(fileName)
        ) {
          result.push(path.join(directory, child.name));
        }
      }
    }
  }

  await proccessDirectory(dir);
  return result;
}

/**
 * Loads all file of a directory.
 *
 * @param {string} dir - The directory path to search in.
 * @param {object} opts - Optional options object.
 * @param {string[]} opts.prefix - An array of prefixes that file names should start with.
 * @param {string[]} opts.postfix - An array of postfixes that file names should end with.
 * @param {string[]} opts.exclude - An array of file names to exclude from the search.
 * @return {Promise<string[]>} A promise that resolves to an array of file paths.
 */
async function getAllFiles(dir, opts = {}) {
  const prefix = (opts?.prefix || []).map((item) => item.toLowerCase());
  const postfix = (opts?.postfix || []).map((item) => item.toLowerCase());
  const exclude = (opts?.exclude || []).map((item) => item.toLowerCase());

  return (await readdir(dir, { withFileTypes: true }))
    .filter((item) => {
      const fileName = item.name.toLowerCase();
      return (
        !item.isDirectory() &&
        (!prefix.length || prefix.some((val) => fileName.startsWith(val))) &&
        (!postfix.length || postfix.some((val) => fileName.endsWith(val))) &&
        !exclude.includes(fileName)
      );
    })
    .map((item) => path.join(dir, item.name));
}

module.exports = {
  loadModules,
  getAllFiles,
  getAllFilesRecursive,
};
