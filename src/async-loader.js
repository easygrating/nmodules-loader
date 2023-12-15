"use strict";

const { access, constants, readdir } = require("fs").promises;
const path = require("path");
const { tryRequire, ERROR_MESSAGE } = require("./utils");

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
  const fullPath = path.resolve(dir);

  try {
    await access(fullPath, constants.F_OK && constants.R_OK);

    let fileNames = await getAllFiles(fullPath, opts);

    return fileNames
      .map((item) => tryRequire(item))
      .filter((item) => item !== null);
  } catch (err) {
    throw new Error(`${ERROR_MESSAGE}: ${fullPath}`);
  }
}

/**
 * Retrieves all files in a directory, and its subdirectories if recursive is true,
 * that match specified criteria.
 *
 * @param {string} dir - The directory path to start the search from.
 * @param {Object} opts - An optional object containing search criteria.
 * @param {Array<string>} opts.prefix - An array of file name prefixes to match.
 * @param {Array<string>} opts.postfix - An array of file name postfixes to match.
 * @param {Array<string>} opts.exclude - An array of file names to exclude from the search.
 * @return {Promise<Array<string>>} - A promise that resolves to an array of file paths.
 */
async function getAllFiles(dir, opts = {}) {
  const prefix = (opts?.prefix || []).map((item) => item.toLowerCase());
  const postfix = (opts?.postfix || []).map((item) => item.toLowerCase());
  const exclude = (opts?.exclude || []).map((item) => item.toLowerCase());
  const recursive = !!opts.recursive;

  const result = [];

  async function proccessDirectory(directory) {
    const children = await readdir(directory, { withFileTypes: true });

    for (const child of children) {
      if (child.isDirectory() && recursive) {
        await proccessDirectory(path.join(directory, child.name));
      } else if (!child.isDirectory()) {
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

module.exports = {
  loadModules,
  getAllFiles,
};
