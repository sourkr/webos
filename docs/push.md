## 💻 Instruction Details: `PUSH` (Push Register onto Stack)

The `PUSH` instruction pushes a register's value onto the stack. It has two forms, for 8-bit and 16-bit values.

---

### Opcode `0x10`: Push 8-bit Register

**Mnemonic:** `push <reg8>`
**Opcode:** `0x10` (Decimal: 16)

This instruction pushes the 8-bit value of a specified register onto the stack. This is a 2-byte instruction.

**Bytecode Format:** `0x10, reg_idx`

| Field Name      | Description                                          |
|:----------------|:-----------------------------------------------------|
| **Opcode**      | `0x10`                                               |
| **Operand 1**   | Index of the 8-bit register to push.                 |

---

### Opcode `0x11`: Push 16-bit Register

**Mnemonic:** `push <reg16>`
**Opcode:** `0x11` (Decimal: 17)

This instruction pushes the 16-bit value of a specified register onto the stack. This is a 2-byte instruction.

**Bytecode Format:** `0x11, reg_idx`

| Field Name      | Description                                          |
|:----------------|:-----------------------------------------------------|
| **Opcode**      | `0x11`                                               |
| **Operand 1**   | Index of the 16-bit register to push.                |