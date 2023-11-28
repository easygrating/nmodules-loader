# nmodules-loader

Loads all node modules of a given path.

## Overview

This project provides a utility for loading all modules from a specified directory in Node.js. It includes the ability to load modules recursively from subdirectories.

## Installation

Using npm:

```bash
npm i @easygrating/nmodules-loader
```

## Usage

The main function `loadModules(dir, opts)` takes two parameters:

- `dir`: A string representing the directory path.
- `opts`: An optional object that can contain a `recursive` property. If `recursive` is set to `true`, the function will load modules from subdirectories as well.

## Functions

- `loadModules(dir, opts)`: This function loads all modules from the specified directory. If `opts.recursive` is `true`, it will load modules from subdirectories as well.
- `getAllFilesRecursive(dir)`: This function returns all files in the specified directory and its subdirectories.
- `getAllFiles(dir)`: This function returns all files in the specified directory.

## Error Handling

If an invalid path is provided, the `loadModules` function will throw an error with the message _“INVALID PATH”_.

## Importing

You can import the functions in your project as follows:

```javascript
const { loadModules, getAllFiles, getAllFilesRecursive } = require('nmodules-loader');
```

## Example

Here is an example of how to use the loadModules function:

```javascript
const { loadModules } = require('nmodules-loader');

try {
  const modules = loadModules('./myDir', { recursive: true });
  // Use the loaded modules...
} catch (error) {
  console.error(error);
}
```

In this example, all modules in the myDir directory and its subdirectories will be loaded.

## Note

This utility uses synchronous file system operations, which can block the event loop and impact performance. It’s recommended to use this utility during the startup phase of your application, not during request handling.

## Dependencies

This utility requires the `fs` and `path` modules, which are built-in modules in Node.js. No additional installation is required.

## License

This project is open source and available under the MIT License.

## Keywords

`loader`, `node-modules`, `modules`
