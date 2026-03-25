# Master Clock

A DIY hardware master clock that synchronizes MIDI gear, eurorack modular synths, and Pocket Operators from a single source.

Built on an Arduino Nano (LGT8F328P) with a stripboard layout in a 1590DD aluminum enclosure.

## Features

- **BPM control** — 20-300 BPM via rotary encoder, tap tempo, or CV input
- **MIDI Out ×2** — Independent outputs for daisy-chaining gear (24 ppqn clock, start/stop)
- **MIDI In** — Slave mode with automatic detection and timeout fallback
- **Clock Out ×4** — 0-5V pulses with configurable divisions (×4, ×2, ÷1, ÷2, ÷4, ÷8)
- **Pocket Operator Sync** — Audio-level sync pulse on stereo 3.5mm jack
- **CV In ×2** — 0-10V eurorack safe inputs for BPM control and modulation (swing, division, pulse width)
- **Run/Reset gate** — 0-5V gate output, HIGH while running
- **Swing** — 0-50% adjustable shuffle on clock outputs
- **OLED display** — 128×64 SSD1306 showing BPM, source, play/stop status, beat indicator, and menu
- **EEPROM storage** — Settings persist across power cycles
- **9V DC powered** — With reverse polarity protection

## Hardware

### Gear It Drives

| Output | Connected To |
|---|---|
| MIDI Out 1 | Roland MC-303 → Alpha Juno 1 (via MIDI Thru) |
| MIDI Out 2 | Yamaha RX15 |
| Clock Out 1-4 | Eurorack, Neutral Labs Scrooge, Neutral Labs Elmyra 2 |
| PO Sync | Teenage Engineering Pocket Operators |

### Key Components

| Component | Part |
|---|---|
| Microcontroller | LGT8F328P Nano (or Arduino Nano ATmega328P) |
| Display | SSD1306 128×64 OLED, I2C, 4-pin |
| Optocoupler | 6N137 high-speed (with 2N3904 inverter) |
| Enclosure | 1590DD diecast aluminum (188×120×37mm) |
| Jacks | Thonkiconn PJ301M-12 (mono), WQP419GR (stereo) |

### Circuit Design

- **MIDI Out**: Current-loop via 220Ω resistors to 5-pin DIN connectors
- **MIDI In**: 6N137 optocoupler for galvanic isolation → 2N3904 NPN transistor to invert the output back to correct polarity for UART
- **Clock outputs**: Buffered via 100Ω series resistors
- **PO Sync**: Voltage divider (47kΩ / 10kΩ) to reduce 5V to ~0.9V audio level
- **CV inputs**: 100kΩ / 100kΩ voltage divider (halves 0-10V to 0-5V) with 1N4148 clamp diodes for over/under voltage protection
- **Power**: 9V DC barrel jack → 1N4001 reverse polarity protection → 100µF + 100nF filtering → Arduino VIN

## Repository Contents

```
├── README.md                    # This file
├── master-clock-firmware.ino    # Arduino firmware (v1.1)
├── master-clock.jsx             # Interactive reference (schema, BOM, stripboard, pinout)
├── master-clock-build.pdf       # Printable build guide (stripboard + BOM + wiring)
└── arduino-boards-notes.md      # Board setup notes and troubleshooting
```

## Building

### 1. Order Parts

See the BOM in `master-clock-build.pdf` or the interactive STUKLIJST tab in `master-clock.jsx`. Estimated cost: €42-75 depending on supplier.

### 2. Stripboard Assembly

The build PDF contains a full grid layout with component placement, strip cuts, and wire jumper positions. Recommended build order:

1. Solder female pin headers for Arduino
2. Make all strip cuts
3. Solder power circuit (1N4001 + capacitors)
4. Solder resistors (smallest values first)
5. Solder signal diodes and capacitors
6. Solder IC socket for 6N137
7. Wire jumpers on the underside
8. Test power: 9V adapter → 5V on Arduino pins
9. Place Arduino and 6N137
10. Connect panel-mount components (jacks, buttons, encoder, OLED, LED)

### 3. Flash Firmware

#### LGT8F328P boards

1. Install [Arduino IDE](https://www.arduino.cc/en/software)
2. Add board URL in **File → Preferences → Additional boards manager URLs**:
   ```
   https://raw.githubusercontent.com/dbuezas/lgt8fx/master/package_lgt8fx_index.json
   ```
3. Install "LGT8fx Boards" via **Tools → Board → Boards Manager**
4. Install libraries via **Sketch → Include Library → Manage Libraries**:
   - Adafruit SSD1306
   - Adafruit GFX
5. Settings:
   - Board: **LGT8F328**
   - Variant: **328P-LQFP32**
   - Clock Source: **External 16MHz**
   - Upload Speed: **115200**
6. Select port and upload

#### Arduino Nano (ATmega328P)

1. Board: **Arduino Nano**
2. Processor: **ATmega328P (Old Bootloader)**
3. Upload Speed: **57600**

### 4. Usage

- **Rotary encoder**: Adjust BPM (main screen) or parameter value (in menu)
- **Encoder push**: Cycle through menu (CLK4 division → Swing → CV2 target → back to main)
- **Green button**: Start / Stop
- **Red button**: Tap tempo (average of 4 taps)
- **MIDI In**: Automatically switches to slave mode when external clock is detected; reverts to master after 1 second of silence

## MIDI In: 6N137 Inverter Circuit

The 6N137 optocoupler inverts its output (idle = LOW), but the Arduino UART expects idle = HIGH. A 2N3904 NPN transistor is used as an inverter between the 6N137 output and Arduino RX:

```
6N137 pin 6 → R18 10kΩ → 2N3904 base
                          2N3904 collector → R19 10kΩ → 5V (pull-up)
                          2N3904 collector → Arduino D0 (RX)
                          2N3904 emitter → GND
```

Without this inverter, MIDI In will receive garbage data.

## Pinout

| Pin | Function | Detail |
|---|---|---|
| D0 / RX | MIDI In | Via 6N137 → 2N3904 inverter |
| D1 / TX | MIDI Out ×2 | Via 220Ω to DIN connectors |
| D2 | Encoder CLK | Interrupt pin, INPUT_PULLUP |
| D3 | Encoder DT | Interrupt pin, INPUT_PULLUP |
| D4 | Encoder SW | Push button, INPUT_PULLUP |
| D5 | Tap Tempo | Momentary button to GND |
| D6 | Start / Stop | Momentary button to GND |
| D7 | Clock Out 1 | ÷1 (quarter note) via 100Ω |
| D8 | Clock Out 2 | ÷2 (half note) via 100Ω |
| D9 | Clock Out 3 | ÷4 (whole note) via 100Ω |
| D10 | Clock Out 4 | Configurable via 100Ω |
| D11 | PO Sync | Via 47kΩ + 10kΩ divider |
| D12 | Run Gate | HIGH = running, via 100Ω |
| A0 | CV In 1 | BPM control (0-10V safe) |
| A1 | CV In 2 | Modulation target (0-10V safe) |
| A4 | OLED SDA | I2C data |
| A5 | OLED SCL | I2C clock |

## Interactive Reference

The `master-clock.jsx` file is a React artifact that can be opened in [Claude.ai](https://claude.ai). It contains interactive tabs for:

- **Overview** — Block diagram with signal flow
- **Schematic** — Per-section circuit diagrams (MIDI Out, MIDI In, CV In, Clock Outputs, PO Sync, Encoder, Display, Power)
- **BOM** — Full bill of materials with checkboxes and persistent progress tracking
- **Stripboard** — Detailed grid layout with toggleable layers (components, Arduino, cuts, wires) and a placement reference table
- **Pinout** — Complete Arduino pin assignment table

## License

This project is open source. Do whatever you want with it. If you build one, I'd love to see it.

## Acknowledgments

Built with help from Claude (Anthropic). Designed for a specific setup but easily adaptable to other gear.
