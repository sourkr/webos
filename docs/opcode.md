# ⚙️ sarc32 Instruction Set Architecture (ISA)

This document outlines the core operational codes (opcodes) for the **sarc32** processor. It includes numerical representations, mnemonics, and functional descriptions for the instruction set, based on the reference implementation in `vm.js`.

## Core Opcode Reference

| Opcode (Hex) | Opcode (Dec) | Mnemonic | Description |
| :---: | :---: | :--- | :--- |
| `0x01` | 1 | **STR** | Store a value from a register to a memory address. |
| `0x02` | 2 | **LDR** | Load a value from a memory address into a register. |
| `0x03` | 3 | **SYSCALL** | Trigger a system call (e.g., for I/O operations). |
| `0x04` | 4 | **JMP** | Unconditionally jump to a new program counter address. |
| `0x05` | 5 | **ADD** | Adds the value of a source register to a destination register. |
| `0x06` | 6 | **CALL** | Call a subroutine by pushing the return address and jumping. |
| `0x07` | 7 | **SUB** | Subtracts the value of a source register from a destination register. |
| `0x09` | 9 | **POP** | Pop a value from the stack into a register. |
| `0x0a` | 10 | **DROP** | Discard a number of bytes from the stack. |
| `0x0b` | 11 | **RET** | Return from a subroutine by popping the return address. |
| `0x10` | 16 | **PUSH** | Push an 8-bit register's value onto the stack. |
| `0x11` | 17 | **PUSH** | Push a 16-bit register's value onto the stack. |
| `0x20` | 32 | **MOV** | Move an 8-bit immediate value into a register. |
| `0x21` | 33 | **MOV** | Move a 16-bit immediate value into a register. |
| `0x24` | 36 | **MOV** | Move an 8-bit value from a source register to a destination register. |
| `0x25` | 37 | **MOV** | Move a 16-bit value from a source register to a destination register. |