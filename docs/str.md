## 💻 Instruction Details: `STR` (Store Register to Memory)

**Opcode:** `0x01` (Decimal: 1)

The `STR` instruction stores the 8-bit value from a source register into the memory location pointed to by a destination register.

### Multi-Byte Instruction Format

The `STR` instruction is a 2-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x01`.
*   **Byte 2: Operands:** The second byte encodes the source and destination registers.
    *   **Bits 0-2:** Specify the destination register (which holds the memory address).
    *   **Bits 3-5:** Specify the source register (which holds the value).

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|0|0|0|1|  (0x01)
+-+-+-+-+-+-+-+-+
```

**Byte 2: Register Operands**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  Src |  Dest |
+-+-+-+-+-+-+-+-+
  (3 bits)
       (3 bits)
```
