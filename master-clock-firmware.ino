/*
 * ═══════════════════════════════════════════════════════════
 *  MASTER CLOCK v1.1 — Arduino Nano Firmware
 *  MIDI + CV + PO Sync + Clock Outputs
 * ═══════════════════════════════════════════════════════════
 *
 *  Gear:
 *  - MC-303 (MIDI Out 1, daisy chain to Alpha Juno 1)
 *  - Yamaha RX15 (MIDI Out 2)
 *  - Eurorack + Scrooge + Elmyra 2 (Clock Outs 1-4)
 *  - Pocket Operators (PO Sync)
 *
 *  Hardware:
 *  - Arduino Nano (ATmega328P, clone)
 *  - OLED SSD1306 128x64 I2C (white, Tayda)
 *  - 6N137 optocoupler (inverted output)
 *  - EC11 rotary encoder with D-shaft
 *  - 2x momentary push buttons (green=start, red=tap)
 *
 *  Libraries (install via Arduino Library Manager):
 *  - Adafruit SSD1306
 *  - Adafruit GFX
 *
 *  Upload: Board = "Arduino Nano"
 *          Processor = "ATmega328P (Old Bootloader)"
 * ═══════════════════════════════════════════════════════════
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <EEPROM.h>

// ─── PIN DEFINITIONS ──────────────────────────────────
// MIDI (hardware serial)
#define MIDI_TX_PIN     1   // D1 → 220Ω → MIDI OUT 1 & 2

// Encoder (interrupt pins)
#define ENC_CLK_PIN     2   // D2
#define ENC_DT_PIN      3   // D3
#define ENC_SW_PIN      4   // D4 (push button)

// Buttons
#define TAP_PIN         5   // D5 — red button
#define STARTSTOP_PIN   6   // D6 — green button

// Clock outputs (via 100Ω to 3.5mm jacks)
#define CLK_OUT_1       7   // D7  — ÷1 (quarter note)
#define CLK_OUT_2       8   // D8  — ÷2 (half note)
#define CLK_OUT_3       9   // D9  — ÷4 (whole note)
#define CLK_OUT_4       10  // D10 — configurable

// Sync outputs
#define PO_SYNC_PIN     11  // D11 — PO sync (via 47k+10k divider)
#define RUN_GATE_PIN    12  // D12 — Run gate (HIGH = running)

// CV inputs (via 100k/100k divider + clamp diodes)
#define CV_BPM_PIN      A0  // 0-10V → 0-5V → 0-1023
#define CV_MOD_PIN      A1

// OLED (I2C: A4=SDA, A5=SCL)
#define SCREEN_W        128
#define SCREEN_H        64
#define OLED_ADDR       0x3C

Adafruit_SSD1306 oled(SCREEN_W, SCREEN_H, &Wire, -1);

// ─── MIDI BYTES ───────────────────────────────────────
#define MIDI_CLOCK      0xF8  // 24 per quarter note
#define MIDI_START      0xFA
#define MIDI_STOP       0xFC
#define MIDI_CONTINUE   0xFB

// ─── CLOCK ENGINE ─────────────────────────────────────
volatile int bpm = 120;
volatile int8_t encDelta = 0;  // accumulated encoder steps

bool running = false;
bool slaveMode = false;

unsigned long usPerTick = 0;   // microseconds per MIDI tick
unsigned long lastTickUs = 0;  // last tick timestamp (micros)
uint16_t tickCount = 0;        // total ticks since start

// Division counters (count MIDI ticks)
uint16_t divCnt1 = 0;  // ÷1  = 24 ticks
uint16_t divCnt2 = 0;  // ÷2  = 48 ticks
uint16_t divCnt3 = 0;  // ÷4  = 96 ticks
uint16_t divCnt4 = 0;  // configurable

// CLK4 division options (in MIDI ticks)
const uint8_t DIV4_OPTIONS[] = {6, 12, 24, 48, 96, 192};
const char*   DIV4_LABELS[]  = {"x4", "x2", "/1", "/2", "/4", "/8"};
#define DIV4_COUNT 6
uint8_t div4Idx = 2;  // default = /1

// Pulse management
#define PULSE_MS 15
unsigned long pulseOff[5] = {0};
bool pulseOn[5] = {false};
const uint8_t PULSE_PINS[] = {CLK_OUT_1, CLK_OUT_2, CLK_OUT_3, CLK_OUT_4, PO_SYNC_PIN};

// ─── SWING ────────────────────────────────────────────
uint8_t swingPct = 0;     // 0-50%
bool swingBeat = false;    // alternates every quarter note

// ─── TAP TEMPO ────────────────────────────────────────
#define TAP_MAX       4
#define TAP_TIMEOUT   2000  // ms
unsigned long tapTimes[TAP_MAX];
uint8_t tapIdx = 0;
uint8_t tapCnt = 0;
unsigned long lastTapMs = 0;

// ─── BUTTON DEBOUNCE ──────────────────────────────────
#define DEBOUNCE 50
struct Button {
  uint8_t pin;
  bool lastState;
  unsigned long lastMs;
};
Button btnTap   = {TAP_PIN, HIGH, 0};
Button btnStart = {STARTSTOP_PIN, HIGH, 0};
Button btnEnc   = {ENC_SW_PIN, HIGH, 0};

// ─── CV INPUT ─────────────────────────────────────────
#define CV_SAMPLES    8
#define CV_DEADZONE   15  // ADC counts below this = no cable
int16_t cvBpmBuf[CV_SAMPLES];
int16_t cvModBuf[CV_SAMPLES];
uint8_t cvIdx = 0;
bool cvBpmActive = false;

// ─── MIDI IN (slave) ──────────────────────────────────
unsigned long slaveLastMs = 0;
unsigned long slaveBeatStartUs = 0;
uint8_t slaveTickCnt = 0;
#define SLAVE_TIMEOUT 1000  // ms

// ─── DISPLAY ──────────────────────────────────────────
unsigned long lastDisplayMs = 0;
#define DISPLAY_MS 80  // ~12 fps

// ─── MENU ─────────────────────────────────────────────
enum Menu { M_MAIN, M_DIV4, M_SWING, M_CVMOD, M_COUNT };
Menu menu = M_MAIN;
unsigned long menuTimeoutMs = 0;
#define MENU_TIMEOUT 3000

// CV mod targets
enum CvMod { CV_SWING, CV_DIV4, CV_PULSE_LEN };
CvMod cvMod = CV_SWING;
const char* CVMOD_LABELS[] = {"Swing", "Div4", "PulseW"};

// ─── EEPROM ───────────────────────────────────────────
#define EE_MAGIC_ADDR  0
#define EE_BPM_ADDR    1  // 2 bytes
#define EE_DIV4_ADDR   3
#define EE_SWING_ADDR  4
#define EE_CVMOD_ADDR  5
#define EE_MAGIC_VAL   0x42
unsigned long lastSaveMs = 0;
bool needsSave = false;
#define SAVE_DELAY 5000  // save 5s after last change

// ═══════════════════════════════════════════════════════
//  SETUP
// ═══════════════════════════════════════════════════════
void setup() {
  Serial.begin(31250);  // MIDI baud rate

  // Outputs
  for (uint8_t i = 0; i < 5; i++) {
    pinMode(PULSE_PINS[i], OUTPUT);
    digitalWrite(PULSE_PINS[i], LOW);
  }
  pinMode(RUN_GATE_PIN, OUTPUT);
  digitalWrite(RUN_GATE_PIN, LOW);

  // Inputs (all with internal pullup)
  pinMode(ENC_CLK_PIN, INPUT_PULLUP);
  pinMode(ENC_DT_PIN, INPUT_PULLUP);
  pinMode(ENC_SW_PIN, INPUT_PULLUP);
  pinMode(TAP_PIN, INPUT_PULLUP);
  pinMode(STARTSTOP_PIN, INPUT_PULLUP);

  // Encoder interrupt
  attachInterrupt(digitalPinToInterrupt(ENC_CLK_PIN), encoderISR, FALLING);

  // Load settings from EEPROM
  loadSettings();
  recalcTiming();

  // Init CV buffers
  memset(cvBpmBuf, 0, sizeof(cvBpmBuf));
  memset(cvModBuf, 0, sizeof(cvModBuf));

  // Init OLED
  if (!oled.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    // OLED failed — flash onboard LED as error
    pinMode(13, OUTPUT);
    while (1) {
      digitalWrite(13, !digitalRead(13));
      delay(200);
    }
  }

  // Splash screen
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);
  oled.setTextSize(2);
  oled.setCursor(16, 4);
  oled.print(F("MASTER"));
  oled.setCursor(22, 24);
  oled.print(F("CLOCK"));
  oled.setTextSize(1);
  oled.setCursor(28, 52);
  oled.print(F("v1.1 — ready"));
  oled.display();
  delay(1200);
}

// ═══════════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════════
void loop() {
  unsigned long nowUs = micros();
  unsigned long nowMs = millis();

  // ── MIDI In ─────────────────────────────────────────
  handleMidiIn(nowMs, nowUs);

  // ── Encoder rotation ────────────────────────────────
  if (encDelta != 0) {
    handleEncoder();
  }

  // ── Buttons ─────────────────────────────────────────
  handleButtons(nowMs);

  // ── CV Inputs (every ~2ms) ──────────────────────────
  static unsigned long lastCvMs = 0;
  if (nowMs - lastCvMs >= 2) {
    lastCvMs = nowMs;
    handleCV();
  }

  // ── Internal Clock Tick ─────────────────────────────
  if (running && !slaveMode) {
    if (nowUs - lastTickUs >= usPerTick) {
      lastTickUs += usPerTick;  // accumulate, don't assign — prevents drift
      onTick(nowMs);
    }
  }

  // ── Slave timeout → revert to master ────────────────
  if (slaveMode && (nowMs - slaveLastMs > SLAVE_TIMEOUT)) {
    slaveMode = false;
  }

  // ── Pulse off ───────────────────────────────────────
  for (uint8_t i = 0; i < 5; i++) {
    if (pulseOn[i] && nowMs >= pulseOff[i]) {
      digitalWrite(PULSE_PINS[i], LOW);
      pulseOn[i] = false;
    }
  }

  // ── Display ─────────────────────────────────────────
  if (nowMs - lastDisplayMs >= DISPLAY_MS) {
    lastDisplayMs = nowMs;
    drawDisplay();
  }

  // ── Menu timeout ────────────────────────────────────
  if (menu != M_MAIN && nowMs > menuTimeoutMs) {
    menu = M_MAIN;
  }

  // ── Deferred EEPROM save ────────────────────────────
  if (needsSave && (nowMs - lastSaveMs > SAVE_DELAY)) {
    saveSettings();
    needsSave = false;
  }
}

// ═══════════════════════════════════════════════════════
//  ENCODER ISR — called on falling edge of CLK
// ═══════════════════════════════════════════════════════
void encoderISR() {
  encDelta += (digitalRead(ENC_DT_PIN) == LOW) ? 1 : -1;
}

// ═══════════════════════════════════════════════════════
//  HANDLE ENCODER ROTATION
// ═══════════════════════════════════════════════════════
void handleEncoder() {
  int8_t d = encDelta;
  encDelta = 0;

  switch (menu) {
    case M_MAIN:
      bpm = constrain(bpm + d, 20, 300);
      recalcTiming();
      markDirty();
      break;

    case M_DIV4:
      div4Idx = constrain((int8_t)div4Idx + d, 0, DIV4_COUNT - 1);
      menuTimeoutMs = millis() + MENU_TIMEOUT;
      markDirty();
      break;

    case M_SWING:
      swingPct = constrain((int8_t)swingPct + d * 5, 0, 50);
      menuTimeoutMs = millis() + MENU_TIMEOUT;
      markDirty();
      break;

    case M_CVMOD:
      cvMod = (CvMod)constrain((int8_t)cvMod + d, 0, 2);
      menuTimeoutMs = millis() + MENU_TIMEOUT;
      markDirty();
      break;

    default: break;
  }
}

// ═══════════════════════════════════════════════════════
//  HANDLE BUTTONS
// ═══════════════════════════════════════════════════════
bool pressed(Button &b, unsigned long nowMs) {
  bool state = digitalRead(b.pin);
  if (state == LOW && b.lastState == HIGH && (nowMs - b.lastMs > DEBOUNCE)) {
    b.lastMs = nowMs;
    b.lastState = state;
    return true;
  }
  b.lastState = state;
  return false;
}

void handleButtons(unsigned long nowMs) {
  // ── Tap Tempo ──
  if (pressed(btnTap, nowMs)) {
    if (nowMs - lastTapMs > TAP_TIMEOUT) tapCnt = 0;

    tapTimes[tapCnt % TAP_MAX] = nowMs;
    tapCnt++;
    lastTapMs = nowMs;

    if (tapCnt >= 2) {
      uint8_t n = min(tapCnt, (uint8_t)TAP_MAX);
      unsigned long total = 0;
      for (uint8_t i = 1; i < n; i++) {
        total += tapTimes[i % TAP_MAX] - tapTimes[(i - 1) % TAP_MAX];
      }
      unsigned long avg = total / (n - 1);
      if (avg > 0) {
        bpm = constrain((int)(60000UL / avg), 20, 300);
        recalcTiming();
        markDirty();
      }
    }
  }

  // ── Start / Stop ──
  if (pressed(btnStart, nowMs)) {
    toggleRun(nowMs);
  }

  // ── Encoder push = cycle menu ──
  if (pressed(btnEnc, nowMs)) {
    menu = (Menu)((menu + 1) % M_COUNT);
    menuTimeoutMs = millis() + MENU_TIMEOUT;
  }
}

// ═══════════════════════════════════════════════════════
//  START / STOP
// ═══════════════════════════════════════════════════════
void toggleRun(unsigned long nowMs) {
  running = !running;

  if (running) {
    // Reset all counters
    tickCount = 0;
    divCnt1 = divCnt2 = divCnt3 = divCnt4 = 0;
    swingBeat = false;
    lastTickUs = micros();

    Serial.write(MIDI_START);
    digitalWrite(RUN_GATE_PIN, HIGH);

    // Fire first beat immediately
    onTick(nowMs);
  } else {
    Serial.write(MIDI_STOP);

    // All outputs off
    for (uint8_t i = 0; i < 5; i++) {
      digitalWrite(PULSE_PINS[i], LOW);
      pulseOn[i] = false;
    }
    digitalWrite(RUN_GATE_PIN, LOW);
  }
}

// ═══════════════════════════════════════════════════════
//  ON TICK — called 24× per quarter note
// ═══════════════════════════════════════════════════════
void onTick(unsigned long nowMs) {
  // Forward MIDI clock to outputs
  Serial.write(MIDI_CLOCK);
  tickCount++;

  // ── CLK 1: ÷1 (every 24 ticks = quarter note) ──────
  divCnt1++;
  if (divCnt1 >= 24) {
    divCnt1 = 0;
    swingBeat = !swingBeat;

    // Apply swing: delay even beats
    if (swingPct > 0 && swingBeat) {
      // Swing shifts the even pulse forward in time
      // 50% swing = full triplet feel
      unsigned long swingDelayMs = ((unsigned long)usPerTick * 12 * swingPct / 50) / 1000;
      pulseOff[0] = nowMs + PULSE_MS + swingDelayMs;
      pulseOff[4] = nowMs + PULSE_MS + swingDelayMs;
    }

    fire(0, nowMs);  // CLK_OUT_1
    fire(4, nowMs);  // PO_SYNC
  }

  // ── CLK 2: ÷2 (every 48 ticks = half note) ─────────
  divCnt2++;
  if (divCnt2 >= 48) {
    divCnt2 = 0;
    fire(1, nowMs);
  }

  // ── CLK 3: ÷4 (every 96 ticks = whole note) ────────
  divCnt3++;
  if (divCnt3 >= 96) {
    divCnt3 = 0;
    fire(2, nowMs);
  }

  // ── CLK 4: configurable ─────────────────────────────
  divCnt4++;
  if (divCnt4 >= DIV4_OPTIONS[div4Idx]) {
    divCnt4 = 0;
    fire(3, nowMs);
  }
}

// ═══════════════════════════════════════════════════════
//  FIRE PULSE
// ═══════════════════════════════════════════════════════
void fire(uint8_t ch, unsigned long nowMs) {
  digitalWrite(PULSE_PINS[ch], HIGH);
  pulseOn[ch] = true;
  if (pulseOff[ch] <= nowMs) {  // don't overwrite swing-adjusted time
    pulseOff[ch] = nowMs + PULSE_MS;
  }
}

// ═══════════════════════════════════════════════════════
//  HANDLE MIDI IN (slave mode)
// ═══════════════════════════════════════════════════════
void handleMidiIn(unsigned long nowMs, unsigned long nowUs) {
  while (Serial.available()) {
    uint8_t b = Serial.read();

    /*
     * ══════════════════════════════════════════════════
     *  6N137 INVERTED OUTPUT — IMPORTANT!
     * ══════════════════════════════════════════════════
     *  The 6N137 inverts its output. The Arduino UART
     *  expects idle=HIGH, but 6N137 gives idle=LOW.
     *  All bytes arrive bit-inverted.
     *
     *  FIX OPTIONS (pick one):
     *
     *  1. HARDWARE (recommended): Add a 2N3904 inverter
     *     between 6N137 pin 6 and Arduino RX:
     *     - 6N137 pin 6 → 10kΩ → 2N3904 base
     *     - 2N3904 collector → Arduino D0 (RX)
     *     - 2N3904 collector → 10kΩ → 5V (pull-up)
     *     - 2N3904 emitter → GND
     *     (You have 2N3904's in your parts stash!)
     *
     *  2. SOFTWARE: Uncomment the line below.
     *     Works but may have timing issues at 31250 baud.
     *
     *  Start with option 1. If you get garbage, try
     *  swapping DIN pin 4/5 wires first.
     * ══════════════════════════════════════════════════
     */

    // Uncomment ONLY if not using hardware inverter:
    // b = ~b;

    switch (b) {
      case MIDI_CLOCK:
        slaveLastMs = nowMs;
        if (!slaveMode) slaveMode = true;

        if (running) {
          onTick(nowMs);

          // Calculate BPM from incoming clock
          slaveTickCnt++;
          if (slaveTickCnt >= 24) {
            // One full beat (24 ticks) received
            if (slaveBeatStartUs > 0) {
              unsigned long beatUs = nowUs - slaveBeatStartUs;
              if (beatUs > 0) {
                int newBpm = (int)(60000000UL / beatUs);
                bpm = constrain(newBpm, 20, 300);
              }
            }
            slaveBeatStartUs = nowUs;
            slaveTickCnt = 0;
          }
        }
        break;

      case MIDI_START:
        slaveLastMs = nowMs;
        slaveMode = true;
        slaveBeatStartUs = 0;
        slaveTickCnt = 0;
        if (!running) {
          running = true;
          tickCount = 0;
          divCnt1 = divCnt2 = divCnt3 = divCnt4 = 0;
          swingBeat = false;
          digitalWrite(RUN_GATE_PIN, HIGH);
        }
        break;

      case MIDI_CONTINUE:
        slaveLastMs = nowMs;
        slaveMode = true;
        if (!running) {
          running = true;
          digitalWrite(RUN_GATE_PIN, HIGH);
        }
        break;

      case MIDI_STOP:
        slaveLastMs = nowMs;
        running = false;
        for (uint8_t i = 0; i < 5; i++) {
          digitalWrite(PULSE_PINS[i], LOW);
          pulseOn[i] = false;
        }
        digitalWrite(RUN_GATE_PIN, LOW);
        break;
    }
  }
}

// ═══════════════════════════════════════════════════════
//  HANDLE CV INPUTS
// ═══════════════════════════════════════════════════════
void handleCV() {
  cvBpmBuf[cvIdx] = analogRead(CV_BPM_PIN);
  cvModBuf[cvIdx] = analogRead(CV_MOD_PIN);
  cvIdx = (cvIdx + 1) % CV_SAMPLES;

  // Average
  int32_t bpmSum = 0, modSum = 0;
  for (uint8_t i = 0; i < CV_SAMPLES; i++) {
    bpmSum += cvBpmBuf[i];
    modSum += cvModBuf[i];
  }
  int16_t cvBpm = bpmSum / CV_SAMPLES;
  int16_t cvModVal = modSum / CV_SAMPLES;

  // CV1 → BPM (only when voltage present)
  if (cvBpm > CV_DEADZONE) {
    cvBpmActive = true;
    bpm = map(cvBpm, 0, 1023, 20, 300);
    recalcTiming();
  } else {
    cvBpmActive = false;
  }

  // CV2 → modulation target
  if (cvModVal > CV_DEADZONE) {
    switch (cvMod) {
      case CV_SWING:
        swingPct = map(cvModVal, 0, 1023, 0, 50);
        break;
      case CV_DIV4:
        div4Idx = constrain(map(cvModVal, 0, 1023, 0, DIV4_COUNT - 1), 0, DIV4_COUNT - 1);
        break;
      case CV_PULSE_LEN:
        // Future: modulate PULSE_MS (5-100ms)
        break;
    }
  }
}

// ═══════════════════════════════════════════════════════
//  TIMING
// ═══════════════════════════════════════════════════════
void recalcTiming() {
  usPerTick = 60000000UL / ((unsigned long)bpm * 24UL);
}

// ═══════════════════════════════════════════════════════
//  EEPROM — settings persist across power cycles
// ═══════════════════════════════════════════════════════
void markDirty() {
  needsSave = true;
  lastSaveMs = millis();
}

void saveSettings() {
  EEPROM.update(EE_MAGIC_ADDR, EE_MAGIC_VAL);
  EEPROM.update(EE_BPM_ADDR, bpm & 0xFF);
  EEPROM.update(EE_BPM_ADDR + 1, (bpm >> 8) & 0xFF);
  EEPROM.update(EE_DIV4_ADDR, div4Idx);
  EEPROM.update(EE_SWING_ADDR, swingPct);
  EEPROM.update(EE_CVMOD_ADDR, (uint8_t)cvMod);
}

void loadSettings() {
  if (EEPROM.read(EE_MAGIC_ADDR) == EE_MAGIC_VAL) {
    bpm = EEPROM.read(EE_BPM_ADDR) | (EEPROM.read(EE_BPM_ADDR + 1) << 8);
    bpm = constrain(bpm, 20, 300);
    div4Idx = constrain(EEPROM.read(EE_DIV4_ADDR), 0, DIV4_COUNT - 1);
    swingPct = constrain(EEPROM.read(EE_SWING_ADDR), 0, 50);
    cvMod = (CvMod)constrain(EEPROM.read(EE_CVMOD_ADDR), 0, 2);
  }
  // else: keep defaults (120 BPM, div /1, no swing)
}

// ═══════════════════════════════════════════════════════
//  DISPLAY
// ═══════════════════════════════════════════════════════
void drawDisplay() {
  oled.clearDisplay();
  oled.setTextColor(SSD1306_WHITE);

  // ── TOP: BPM big ────────────────────────────────────
  oled.setTextSize(3);
  char buf[5];
  sprintf(buf, "%d", bpm);
  uint8_t bpmW = strlen(buf) * 18;
  oled.setCursor((96 - bpmW) / 2, 2);
  oled.print(buf);

  oled.setTextSize(1);
  oled.setCursor(oled.getCursorX() + 3, 10);
  oled.print(F("BPM"));

  // Source indicator (top right)
  oled.setCursor(104, 2);
  if (slaveMode)        oled.print(F("MIDI"));
  else if (cvBpmActive) oled.print(F("CV"));
  else                  oled.print(F("INT"));

  // ── MIDDLE: status ──────────────────────────────────
  oled.drawFastHLine(0, 27, 128, SSD1306_WHITE);

  if (running) {
    // Play triangle
    oled.fillTriangle(3, 31, 3, 41, 11, 36, SSD1306_WHITE);
    oled.setCursor(16, 33);
    oled.print(F("RUNNING"));

    // Beat indicator (current beat filled)
    uint8_t beat = (tickCount / 24) % 4;
    for (uint8_t i = 0; i < 4; i++) {
      uint8_t x = 90 + i * 10;
      if (i == beat)
        oled.fillRect(x, 32, 7, 7, SSD1306_WHITE);
      else
        oled.drawRect(x, 32, 7, 7, SSD1306_WHITE);
    }
  } else {
    // Stop square
    oled.fillRect(3, 32, 9, 9, SSD1306_WHITE);
    oled.setCursor(16, 33);
    oled.print(F("STOPPED"));
  }

  // ── BOTTOM: menu / info ─────────────────────────────
  oled.drawFastHLine(0, 44, 128, SSD1306_WHITE);
  oled.setTextSize(1);

  switch (menu) {
    case M_MAIN:
      oled.setCursor(0, 48);
      oled.print(F("CLK4:"));
      oled.print(DIV4_LABELS[div4Idx]);
      oled.setCursor(55, 48);
      oled.print(F("SW:"));
      oled.print(swingPct);
      oled.print('%');
      oled.setCursor(0, 57);
      oled.print(F("CV2>"));
      oled.print(CVMOD_LABELS[cvMod]);
      if (needsSave) {
        oled.setCursor(116, 57);
        oled.print(F("*"));
      }
      break;

    case M_DIV4: {
      oled.setCursor(0, 48);
      oled.print(F("> CLK4 divisie:"));
      oled.setCursor(0, 57);
      for (uint8_t i = 0; i < DIV4_COUNT; i++) {
        if (i == div4Idx) oled.print('[');
        oled.print(DIV4_LABELS[i]);
        if (i == div4Idx) oled.print(']');
        oled.print(' ');
      }
      break;
    }

    case M_SWING: {
      oled.setCursor(0, 48);
      oled.print(F("> Swing: "));
      oled.print(swingPct);
      oled.print('%');
      oled.setCursor(0, 57);
      uint8_t barW = map(swingPct, 0, 50, 0, 100);
      oled.fillRect(0, 57, barW, 6, SSD1306_WHITE);
      oled.drawRect(0, 57, 100, 6, SSD1306_WHITE);
      break;
    }

    case M_CVMOD: {
      oled.setCursor(0, 48);
      oled.print(F("> CV2 stuurt:"));
      oled.setCursor(0, 57);
      for (uint8_t i = 0; i < 3; i++) {
        if (i == (uint8_t)cvMod) oled.print('[');
        oled.print(CVMOD_LABELS[i]);
        if (i == (uint8_t)cvMod) oled.print(']');
        oled.print(' ');
      }
      break;
    }

    default: break;
  }

  oled.display();
}
