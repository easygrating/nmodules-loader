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

const ERROR_MESSAGE = "INVALID PATH";

module.exports = {
  tryRequire,
  ERROR_MESSAGE,
};
