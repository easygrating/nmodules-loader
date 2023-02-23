"use strict";

const fs = require("fs");
const path = require("path");
const ERROR_MESSAGE = "INVALID PATH";

/**
 * Load all modules of a directory
 * @param {string} dir
 * @param {*} opts
 * @returns
 */
function loadModules(dir, opts) {
  const recursive = opts?.recursive;
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    throw new Error(ERROR_MESSAGE);
  }

  const fileNames = !!recursive
    ? getAllFilesRecursive(fullPath)
    : getAllFiles(fullPath);

    return fileNames.map((item) => require(item));
}

/**
 * Loads all file tree
 * @param {string} dir absolute dir path
 * @returns
 */
function getAllFilesRecursive(dir) {
  const children = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const child of children) {
    if (child.isDirectory()) {
      result.push(...getAllFiles(path.join(dir, child.name)));
    } else {
      result.push(path.join(dir, child.name));
    }
  }
  return result;
}

/**
 * Loads all file of a directory
 * @param {string} dir absolute dir path
 * @returns
 */
function getAllFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => path.join(dir, item.name));
}

module.exports = {
  loadModules,
  getAllFiles,
  getAllFilesRecursive,
};
