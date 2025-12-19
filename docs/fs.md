# 🗄️ Virtual Filesystem

The webOS uses a virtual filesystem stored in the browser's `localStorage`. This document explains how this filesystem is structured and how to build it from the source files.

## Filesystem Structure

The source for the virtual filesystem is located in the `public/fs` directory. This directory is recursively traversed to build the `localStorage` database.

The structure of the filesystem is defined by `paths.txt` files within each directory. Each line in a `paths.txt` file represents a file or a subdirectory. The format of a line is:

`<type> <options> <source> <destination>`

*   **type:** Defines the type of the entry.
    *   `d`: A directory.
    *   `-`: A regular file.
*   **options:**
    *   `c`: For files, this indicates that the file should be compiled before being added to the filesystem.
    *   `-`: For files, this means the file is copied as-is.
*   **source:** The name of the file or directory in the source tree.
*   **destination:** The name of the file or directory in the virtual filesystem.

### Example

Here's an example from `public/fs/bin/paths.txt`:

```
- c term.c term
```

This line defines a file that should be compiled (`c`). The source file is `term.c`, and it will be available as `term` in the virtual filesystem under the `/bin` directory.

## Build Process

The virtual filesystem is built by a script located at `public/i/script.js`. This script is executed when you open `public/i/index.html` and click the "Install" button.

The script performs the following actions:

1.  **Clears `localStorage`:** It removes all existing data from `localStorage` to ensure a clean installation.
2.  **Traverses `public/fs`:** It starts from the `public/fs` directory and recursively reads all `paths.txt` files.
3.  **Populates `localStorage`:** For each entry in the `paths.txt` files, it creates corresponding entries in `localStorage`.
    *   An entry is added to the parent directory's `localStorage` item, creating a directory listing. The format of this entry is `<type> <name>`.
    *   The key for the file or directory itself is its full path in the virtual filesystem (e.g., `/bin/term`).
    *   For directories, the value of this key is an empty string.
    *   For files, the value is the content of the file. If the file is marked for compilation, it is first compiled by the script.

After the installation is complete, the webOS can be loaded by opening the main `index.html` file.
