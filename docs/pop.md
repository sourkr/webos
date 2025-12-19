## 💻 Instruction Details: `POP` (Pop from Stack to Register)

**Opcode:** `0x09` (Decimal: 9)

The `POP` instruction pops a value from the stack and stores it in a specified register.

### Multi-Byte Instruction Format

The `POP` instruction is a 2-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x09`.
*   **Byte 2: Register:** The second byte is the index of the register where the popped value will be stored.

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|1|0|0|1|  (0x09)
+-+-+-+-+-+-+-+-+
```

**Byte 2: Register Index**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
| Register Index|
+-+-+-+-+-+-+-+-+
```