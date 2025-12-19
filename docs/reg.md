# 📝 Register Architecture

This document provides a detailed overview of the register architecture for the sarc32 virtual machine. It includes mappings for both assembly (`asm.js`) and the VM's internal `DataView` (`vm.js`), along with descriptions of each register's purpose.

### Register Mapping and Details

| Name | `asm.js` Index | `vm.js` Offset | Description |
| :--- | :---: | :---: | :--- |
| **r0** | 0 | 3 | General-purpose register 0. |
| **r1** | 1 | 7 | General-purpose register 1. |
| **r2** | 2 | 11 | General-purpose register 2. |
| **r3** | 3 | 15 | General-purpose register 3. |
| **fp** | 4 | 19 | **Frame Pointer**: Points to the base of the current stack frame (8-bit). |
| **sp** | 5 | 22 | **Stack Pointer**: Points to the top of the stack (16-bit). |

**Note**: The `pc` (Program Counter) is not part of the `reg` DataView. It is a standard variable within the VM that holds the address of the next instruction to be executed, and is not directly accessible through assembly instructions.