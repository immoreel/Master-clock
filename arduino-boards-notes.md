# Arduino Boards — Overzicht & Upload Settings

## Werkend: LGT8F328P (USB-C, blauw)

- **Board:** QIQIAZI Nano-Module, 3-pack van Amazon (€21,99)
- **Chip:** LGT8F QFP33 (Logic Green kloon van ATmega328P)
- **USB chip:** CH340G
- **Connector:** USB-C

### Arduino IDE instellingen

| Instelling | Waarde |
|---|---|
| Board | LGT8F328 |
| Variant | 328P-LQFP32 (MiniEVB nano-style or WAVGAT) |
| Clock Source | External 16MHz |
| Clock Divider | 1 |
| Upload speed | **115200** ← dit was de oplossing |
| Port | /dev/cu.wchusbserial10 (kan variëren) |
| Programmer | AVR ISP |

### Board package installatie

1. **File → Preferences → Additional boards manager URLs**, plak:
   ```
   https://raw.githubusercontent.com/dbuezas/lgt8fx/master/package_lgt8fx_index.json
   ```
2. **Tools → Board → Boards Manager** → zoek "LGT8fx" → installeer
3. Selecteer **LGT8F328** als board

### Libraries (via Library Manager)

- Adafruit SSD1306
- Adafruit GFX

---

## Niet werkend voor dit project: "Nano" clones (micro-USB, rood)

- **Verkocht als:** Arduino Nano ATmega328P
- **Werkelijke chip:** **ATmega168** (signature `1E 94 06`)
- **USB chip:** CH340G
- **Connector:** Micro-USB

### Waarom ze niet werkten

1. **Verkeerde chip** — ATmega168 heeft 16KB flash en 1KB RAM. De firmware is 21KB, past er niet op.
2. **Verkeerde baudrate** — De 168-bootloader draait op **19200 baud**, niet op 57600 of 115200. Dat veroorzaakte alle "not in sync" errors.
3. **CH340G driver** — Op macOS was eerst de driver niet geïnstalleerd, maar ook na installatie bleef het probleem vanwege punt 1 en 2.

### Als je ze ooit wilt gebruiken voor kleine projectjes

| Instelling | Waarde |
|---|---|
| Board | Arduino Nano |
| Processor | ATmega168 |
| Upload speed | 19200 |
| Port | /dev/cu.wchusbserial* |

### Beperkingen ATmega168

- 16KB flash (vs 32KB op 328P)
- 1KB RAM (vs 2KB op 328P)
- Alleen geschikt voor kleine sketches

---

## CH340G driver (macOS)

- **Download:** https://www.wch-ic.com/downloads/CH341SER_MAC_ZIP.html
- Na installatie: **Systeeminstellingen → Privacy en beveiliging** → driver toestaan
- Mac herstarten
- Poort verschijnt als `/dev/cu.wchusbserial*`

## CP2102 USB-TTL adapter (besteld)

- Kan gebruikt worden om Nano's te programmeren via de pinnen (TX/RX/DTR/GND/5V)
- Handig als backup of als de onboard USB-serial chip niet meewerkt
- Poort verschijnt als `/dev/cu.SLAB_USBtoUART` of `/dev/cu.usbserial-*`

### Aansluiting CP2102 → Nano

| CP2102 | Nano |
|---|---|
| TXD | RX0 |
| RXD | TX1 |
| DTR | RST |
| GND | GND |
| +5V | 5V |

Let op: TX↔RX kruisen!

---

## Troubleshooting checklist

1. **"not in sync" errors** → Probeer andere baudrate (19200, 57600, 115200)
2. **"cannot open port"** → Sluit Arduino IDE / Serial Monitor, of check met `lsof /dev/cu.*`
3. **"No such file or directory"** → Verkeerde poort geselecteerd, check met `ls /dev/cu.*usb*`
4. **"Resource busy"** → Een ander programma houdt de poort bezet, sluit Arduino IDE (⌘Q)
5. **"expected signature"** → Verkeerde chip geselecteerd, check werkelijke signature
6. **Driver niet gevonden** → Installeer CH340 driver, herstart Mac, check Systeeminstellingen

## Handige terminal commando's

```bash
# Welke USB-poorten zijn beschikbaar?
ls /dev/cu.*usb*

# Welk proces houdt een poort bezet?
lsof /dev/cu.wchusbserial1240

# Test connectie met avrdude (pas baudrate en poort aan)
avrdude -v -p atmega328p -c arduino -P /dev/cu.wchusbserial1240 -b 19200

# Check of CH340 driver geïnstalleerd is
ls /Library/Extensions/ | grep -i ch
```

---

## Project-ideeën voor de ATmega168 Nano's (eurorack)

Die "foute" Nano's met ATmega168 (16KB flash, 1KB RAM) zijn prima voor kleine eurorack modules. Hier zijn ideeën die allemaal ruim binnen de beperkingen passen:

### Clock Divider / Multiplier
Clock in op één pin, meerdere outputs met /2, /4, /8, /16. Voeg een reset-input toe en je hebt een bruikbare module. Past makkelijk in 4KB.

### Euclidische Ritme Generator
Clock in, rotary encoder voor aantal stappen en pulsen, gate output. Het Euclidische algoritme is maar een paar regels code. Geeft instant polyritmes vanuit de master clock.

### Bernoulli Gate
Clock in, potmeter voor probability (0-100%), twee outputs: elke puls gaat willekeurig naar output A of B. Simpel maar muzikaal enorm bruikbaar. Past in 2KB.

### Trigger Delay
Gate/trigger in, potmeter voor delay time (0-1000ms), trigger out. Handig om drums net iets te laten slepen voor groove. Minimale code.

### Random Voltage (Sample & Hold)
Clock in, bij elke tick een random waarde naar een R2R DAC ladder (8 weerstanden op 8 output pins). Geeft een getrapte random CV. Leuk voor de Scrooge of Elmyra.

### Tap LFO
Twee taps op een button bepalen de snelheid, output is een zaagtand/blok/driehoek via PWM + filter. Simpeler dan een volledige LFO module maar wel syncbaar.

### Gate Sequencer
8-staps gate sequencer met DIP-switches of buttons voor aan/uit per stap. Clock in van de master clock, gate out. Compact en direct.

### Swing Processor
Clock in, potmeter voor swing amount, clock out met swing. Standalone versie van de swing-functie in de master clock.

### CV Recorder / Looper
Neem een CV-signaal op (via ADC) en speel het in een loop terug via PWM. 1KB RAM = ~500 samples = bij 100Hz samplerate een loop van 5 seconden. Overdub-functie: mix nieuwe input met de bestaande loop. Instant gestural sequencer.

### Chaos Module (Lorenz/Rössler attractor)
Bereken een chaotisch systeem in real-time, output X en Y als CV via PWM. Klinkt als een dronken LFO die nooit herhaalt. Potmeter stuurt de chaos-parameter: van rustig swingende golven naar volledige chaos. Heel weinig code, heel veel karakter.

### Audio-rate Clock Divider (Sub-oscillator)
Dezelfde clock divider maar op audio-frequenties. Audio in op een comparator-pin, digitale /2 /4 /8 divisie = instant sub-octaven. Klinkt vet op de Elmyra.

### Turing Machine kloon
Schuifregister met random bits die bij elke klokpuls opschuiven. Potmeter bepaalt de kans dat een bit flipt: links = vaste sequentie, rechts = puur random, midden = langzaam evoluerende patronen. Output via R2R DAC. De klassieker van Music Thing Modular.

### Pulse Shaper / Gate-to-Envelope
Gate in, twee potmeters (attack/decay) maken er een simpele envelope van via PWM. Geen ADSR maar voor percussieve stuff is AD genoeg. Meerdere outputs met verschillende tijden = instant drum voice shaping.

### Bytebeat Generator
Eén-regel formules die audio genereren: `t * ((t>>12|t>>8)&63&t>>4)`. Output via PWM naar een filter. Potmeters veranderen parameters in de formule. Klinkt als glitchy 8-bit chaos. Absurd weinig code, absurd veel geluid.

### Probability Gate Processor
Meerdere inputs, elke gate heeft een instelbare kans om door te komen. Hi-hat patroon erin, elke hit heeft 70% kans = instant humanize. Of 30% voor sparse texturen.

### Clockable Slew Limiter
CV in, clock in, potmeter voor slew amount. Bij elke klokpuls beweegt de output een stapje richting de input-spanning. Maakt getrapte glides synchroon aan je tempo.

### Trigger Burst Generator
Eén trigger in, spuugt een instelbaar aantal snelle triggers uit (2-16). Potmeter voor aantal, tweede potmeter voor snelheid. Drum rolls, ratchets, machine gun effects.

### Physical Modeling (Karplus-Strong)
Ringbuffer met lowpass filter. Vul met ruis, loop rond = plucked string geluid. 1KB RAM = snaar op ~200Hz. Trigger in = nieuwe pluck, CV in = pitch. Echte synthese uit een ATmega168.

### Comparator / Window Detector
CV in, twee potmeters voor upper/lower threshold. Gate out wanneer CV binnen (of buiten) het window valt. LFO omzetten naar ritmische gates met instelbare duty cycle.

### Shift Register CV Sequencer
Analoge input wordt gesampled en door een digitaal schuifregister geduwd. 4-8 outputs geven elk een vertraagde versie van de input. Eén melodie erin = canon/round effect.

---

*Laatst bijgewerkt: maart 2026 — Master Clock project*
