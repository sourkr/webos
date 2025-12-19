# 🛠️ System Call (Syscall) Register

This document describes the system call (syscall) mechanism in the sarc32 VM. The `syscall` instruction (opcode `0x03`) triggers a system call. The syscall number is read from the `r0` register.

The VM handles syscalls in two ways:
- **External Syscalls (numbers < 0x20):** These are passed to the host environment (e.g., the browser's main thread) via `postMessage`. The host is responsible for handling them. These are defined in `main.js`.
- **Internal Syscalls (numbers >= 0x20):** These are handled directly within the VM. These are defined in `vm.js`.

## Syscall Table

| No. (Dec) | No. (Hex) | Name      | Handler  | Description |
| -: | :------: | :---------------- | :--- | :--- |
| 0 | 0x00 | `exit` | External | Terminates a process. |
| 10 | 0x0a | `window_create` | External | Creates a new window. |
| 11 | 0x0b | `window_set_title` | External | (Not implemented) Sets a window's title. |
| 12 | 0x0c | `window_set_child` | External | Sets a child element for a window. |
| 13 | 0x0d | `window_show` | External | Makes a window visible. |
| 16 | 0x10 | `term_view_new` | External | Creates a new terminal view. |
| 17 | 0x11 | `term_view_insert` | External | Inserts text into a terminal view. |
| 32 | 0x20 | `sleep` | VM | Pauses execution for a given time. |