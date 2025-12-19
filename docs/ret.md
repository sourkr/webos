## 💻 Instruction Details: `RET` (Return from Subroutine)

**Opcode:** `0x0b` (Decimal: 11)

The `RET` instruction is used to return from a subroutine. It pops a return address from the stack and jumps to that address.

### Instruction Format

The `RET` instruction is a 1-byte instruction.

*   **Byte 1: Opcode:** The first and only byte is the instruction's opcode, `0x0b`.

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|1|0|1|1|  (0x0b)
+-+-+-+-+-+-+-+-+
```