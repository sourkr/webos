## 💻 Instruction Details: `MOV` (Move)

The `MOV` instruction moves a value into a register. It has several forms, distinguished by different opcodes, for moving immediate values or values from other registers, with support for 8-bit and 16-bit data.

---

### Opcodes `0x20`, `0x21`: Move Immediate to Register

**Mnemonic:** `mov <immediate>, <reg_dest>`

This instruction moves an immediate value into a specified destination register.

#### Opcode `0x20`: 8-bit Immediate
**Opcode:** `0x20` (Decimal: 32)
This is a 3-byte instruction.

**Bytecode Format:** `0x20, reg_dest_idx, immediate_value`

| Field Name      | Description                                          |
|:----------------|:-----------------------------------------------------|
| **Opcode**      | `0x20`                                               |
| **Operand 1**   | Index of the 8-bit destination register.             |
| **Operand 2**   | 8-bit immediate value to move.                       |

#### Opcode `0x21`: 16-bit Immediate
**Opcode:** `0x21` (Decimal: 33)
This is a 4-byte instruction.

**Bytecode Format:** `0x21, reg_dest_idx, immediate_value_low, immediate_value_high`

| Field Name      | Description                                          |
|:----------------|:-----------------------------------------------------|
| **Opcode**      | `0x21`                                               |
| **Operand 1**   | Index of the 16-bit destination register.            |
| **Operand 2**   | 16-bit immediate value to move.                      |

---

### Opcodes `0x24`, `0x25`: Move Register to Register

**Mnemonic:** `mov <reg_src>, <reg_dest>`

This instruction moves the value of a source register to a destination register.

#### Opcode `0x24`: 8-bit Register to Register
**Opcode:** `0x24` (Decimal: 36)
This is a 2-byte instruction.

**Bytecode Format:** `0x24, (reg_src_idx << 3) | reg_dest_idx`

| Field Name      | Description                                                              |
|:----------------|:-------------------------------------------------------------------------|
| **Opcode**      | `0x24`                                                                   |
| **Operand 1**   | A single byte containing the packed indices of the destination and source registers. The source register index is in bits 3-5, and the destination register index is in bits 0-2. |

#### Opcode `0x25`: 16-bit Register to Register
**Opcode:** `0x25` (Decimal: 37)
This is a 2-byte instruction.

**Bytecode Format:** `0x25, (reg_src_idx << 3) | reg_dest_idx`

| Field Name      | Description                                                              |
|:----------------|:-------------------------------------------------------------------------|
| **Opcode**      | `0x25`                                                                   |
| **Operand 1**   | A single byte containing the packed indices of the destination and source registers. The source register index is in bits 3-5, and the destination register index is in bits 0-2. |