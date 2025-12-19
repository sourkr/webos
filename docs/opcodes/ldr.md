## 💻 Instruction Details: `LDR` (Load Register from Memory)

**Opcode:** `0x02` (Decimal: 2)

The `LDR` instruction loads an 8-bit value from a memory address, which is specified by the source register (`R0`), into a destination register (`R1`).

### Multi-Byte Instruction Format

The `LDR` instruction is a 2-byte instruction.

*   **Byte 1: Opcode:** The first byte is the instruction's opcode, `0x02`.
*   **Byte 2: Operands:** The second byte encodes the source and destination registers.
    *   **Bits 0-2:** Specify the destination register (`R1`).
    *   **Bits 3-5:** Specify the source register (`R0`).

### Visual Representation

**Byte 1: Opcode**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|0|0|0|0|0|0|1|0|  (0x02)
+-+-+-+-+-+-+-+-+
```

**Byte 2: Register Operands**
```text
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  R0 |  R1 | 0 0 |
+-+-+-+-+-+-+-+-+
  (3 bits)
       (3 bits)
```
