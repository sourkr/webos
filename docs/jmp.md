## 💻 Instruction Details: `JMP` (Jump)

**Opcode:** `0x04` (Decimal: 4)

The `JMP` instruction unconditionally jumps to the specified address. It sets the program counter (`PC`) to the given address.

### Multi-Byte Instruction Format

The `JMP` instruction is a 2-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x04`.
*   **Byte 2: Address:** The second byte is the 8-bit address to jump to.

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|0|1|0|0|  (0x04)
+-+-+-+-+-+-+-+-+
```

**Byte 2: Address**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  Address (8 bits)             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```
