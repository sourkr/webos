## 💻 Instruction Details: `DROP` (Drop from Stack)

**Opcode:** `0x0a` (Decimal: 10)

The `DROP` instruction discards a specified number of bytes from the stack by incrementing the stack pointer.

### Multi-Byte Instruction Format

The `DROP` instruction is a 2-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x0a`.
*   **Byte 2: Size:** The second byte is an 8-bit immediate value specifying the number of bytes to drop from the stack.

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|1|0|1|0|  (0x0a)
+-+-+-+-+-+-+-+-+
```

**Byte 2: Size**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  Size         |
+-+-+-+-+-+-+-+-+
```