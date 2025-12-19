## 💻 Instruction Details: `CALL` (Call Subroutine)

**Opcode:** `0x06` (Decimal: 6)

The `CALL` instruction calls a subroutine. It pushes the address of the next instruction (the return address) onto the stack and then jumps to the specified address.

### Multi-Byte Instruction Format

The `CALL` instruction is a 3-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x06`.
*   **Bytes 2-3: Address:** The next two bytes are the 16-bit address of the subroutine to call.

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|0|1|1|0|  (0x06)
+-+-+-+-+-+-+-+-+
```

**Bytes 2-3: Address**
```text
 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Address (16 bits)            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```