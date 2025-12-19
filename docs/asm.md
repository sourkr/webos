# 👨‍💻 Assembler Guide

This document provides a guide to the assembly language used for the sarc32 virtual machine. The assembler (`public/i/asm.js`) converts assembly code into the bytecode that the VM executes.

## Syntax

### Comments

The assembler supports two types of comments:

*   **Single-line comments:** Start with a semicolon (`;`). Everything after the semicolon on that line is ignored.
*   **Multi-line comments:** Enclosed in `/*` and `*/`.

```assembly
; This is a single-line comment
mov 10, r0 /* This is a
              multi-line comment */
```

### Instructions

Instructions are written with the mnemonic followed by one or more operands. Operands are separated by commas.

```assembly
mov 10, r0      ; Move immediate value 10 into register r0
add r0, r1      ; Add r0 to r1 and store in r1
```

### Labels

Labels are used to mark positions in the code for jumps and calls. They are defined using the `lable()` directive.

**Note:** The directive is spelled `lable`, not `label`. This is a known typo in the assembler.

```assembly
lable(my_label)
    mov 10, r0
    jmp my_label
```

### Variables

The assembler supports defining 8-bit unsigned integer variables and string buffers in the data section of the memory.

*   `u8(name, value)`: Defines an 8-bit unsigned integer.
*   `buf(name, "string")`: Defines a string buffer.

```assembly
u8(my_var, 10)
buf(my_string, "hello")
```

## Instructions

For a full list of instructions and their opcodes, see the [Opcode Reference](./opcode.md).

## Registers

For a full list of registers, see the [Register Architecture](./reg.md).
