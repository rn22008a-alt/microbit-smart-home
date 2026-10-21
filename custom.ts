enum TMP36Type {
    //% block="(℃)" enumval=0
    TMP36_temperature_C,

    //% block="(℉)" enumval=1
    TMP36_temperature_F,
}

//% weight=10 color=#0fbc11 icon="\uf015" block="スマートホーム"
namespace smarthome {
    let Reference_VOLTAGE = 3100
    let crashSensorPin: DigitalPin
    export enum DHT11_state {
        //% block="温度(℃)" enumval=0
        DHT11_temperature_C,

        //% block="しつ度(0〜100)" enumval=1
        DHT11_humidity,
    }
    export enum RelayStateList {
        //% block="NC|閉 NO|開"
        On,

        //% block="NC|開 NO|閉"
        Off
    }
    export enum Distance_Unit_List {
        //% block="cm" 
        Distance_Unit_cm,

        //% block="インチ"
        Distance_Unit_inch,
    }
    /**
    * TODO: Crash Sensor Setup
    */
    //% blockId=octopus_crashsetup  blockGap=10
    //% block="スイッチのピンを %crashpin にする"
    export function crashSensorSetup(crashpin: DigitalPin): void {
        crashSensorPin = crashpin;
        pins.setPull(crashpin, PinPullMode.PullUp)
    }

    /**
    * TODO: Checks whether the crash sensor is currently pressed.
    */
    //% blockId=octopus_crash  blockGap=30
    //% block="スイッチがおされた"
    export function crashSensor(): boolean {
        let a: number = pins.digitalReadPin(crashSensorPin);
        if (a == 0) {
            return true;
        } else return false;
    }

    /**
    * TODO: get soil moisture(0~100%)
    * @param soilmoisturepin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readsoilmoisture" block="ピン %soilhumiditypin の土の水分(0〜100)"
    export function ReadSoilHumidity(soilmoisturepin: AnalogPin): number {
        let voltage = 0;
        let soilmoisture = 0;
        voltage = pins.map(
            pins.analogReadPin(soilmoisturepin),
            0,
            1023,
            0,
            100
        );
        soilmoisture = voltage;
        return Math.round(soilmoisture);
    }

    /**
    * TODO: get light intensity(0~100%)
    * @param lightintensitypin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readlightintensity" block="ピン %lightintensitypin の明るさ(0〜100)"
    export function ReadLightIntensity(lightintensitypin: AnalogPin): number {
        let voltage = 0;
        let lightintensity = 0;
        voltage = pins.map(
            pins.analogReadPin(lightintensitypin),
            0,
            1023,
            0,
            100
        );
        lightintensity = voltage;
        return Math.round(lightintensity);
    }

    /**
    * TODO: get TMP36 Temperature(℃ or ℉)
    * @param temppin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readtemp" block="ピン %temppin の温度 %tmp36type"
    export function ReadTemperature(tmp36type: TMP36Type, temppin: AnalogPin): number {
        let voltage = 0;
        let Temperature = 0;
        pins.digitalWritePin(DigitalPin.P0, 0)
        voltage = pins.map(
            pins.analogReadPin(temppin),
            0,
            1023,
            0,
            Reference_VOLTAGE
        );
        Temperature = (voltage - 500) / 10;

        switch (tmp36type) {
            case 0:
                return Math.round(Temperature)
                break;
            case 1:
                return Math.round(Temperature * 9 / 5 + 32)
                break;
            default:
                return 0
        }
    }

    /** 
    * TODO: get noise(dB)
    * @param noisepin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readnoise" block="ピン %noisepin の音の大きさ(dB)"
    export function ReadNoise(noisepin: AnalogPin): number {
        let level = 0
        let voltage = 0
        let noise = 0
        let h = 0
        let l = 0
        let sumh = 0
        let suml = 0
        pins.digitalWritePin(DigitalPin.P0, 0)
        for (let i = 0; i < 1000; i++) {
            level = level + pins.analogReadPin(noisepin)
        }
        level = level / 1000
        for (let i = 0; i < 1000; i++) {
            voltage = pins.analogReadPin(noisepin)
            if (voltage >= level) {
                h += 1
                sumh = sumh + voltage
            } else {
                l += 1
                suml = suml + voltage
            }
        }
        if (h == 0) {
            sumh = level
        } else {
            sumh = sumh / h
        }
        if (l == 0) {
            suml = level
        } else {
            suml = suml / l
        }
        noise = sumh - suml
        if (noise <= 4) {
            noise = pins.map(
                noise,
                0,
                4,
                30,
                50
            )
        } else if (noise <= 8) {
            noise = pins.map(
                noise,
                4,
                8,
                50,
                55
            )
        } else if (noise <= 14) {
            noise = pins.map(
                noise,
                9,
                14,
                55,
                60
            )
        } else if (noise <= 32) {
            noise = pins.map(
                noise,
                15,
                32,
                60,
                70
            )
        } else if (noise <= 60) {
            noise = pins.map(
                noise,
                33,
                60,
                70,
                75
            )
        } else if (noise <= 100) {
            noise = pins.map(
                noise,
                61,
                100,
                75,
                80
            )
        } else if (noise <= 150) {
            noise = pins.map(
                noise,
                101,
                150,
                80,
                85
            )
        } else if (noise <= 231) {
            noise = pins.map(
                noise,
                151,
                231,
                85,
                90
            )
        } else {
            noise = pins.map(
                noise,
                231,
                1023,
                90,
                120
            )
        }
        noise = Math.round(noise)
        return Math.round(noise)
    }
    /**
    * get dht11 temperature and humidity Value
    * @param dht11pin describe parameter here, eg: DigitalPin.P15     
    */
    //% blockId="readdht11" block="DHT11 sensor %pin %dht11state value"
    //% dht11state.fieldEditor="gridpicker" dht11state.fieldOptions.columns=1
    /*export function dht11Sensor(pin: DigitalPin, dht11state: DHT11_state): number {
        basic.pause(2000)  //两次请求之间必须间隔2000ms以上
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
        pins.setPull(pin, PinPullMode.PullUp);
        switch (dht11state) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(pin) == 1);
                while (pins.digitalReadPin(pin) == 0);
                while (pins.digitalReadPin(pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(pin) == 0);
                    dhtcounter1 = 0
                    while (pins.digitalReadPin(pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;
            case 1:
                while (pins.digitalReadPin(pin) == 1);
                while (pins.digitalReadPin(pin) == 0);
                while (pins.digitalReadPin(pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(pin) == 0);
                    counter = 0
                    while (pins.digitalReadPin(pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
    }*/
    /**
    * toggle fans
    */
    //% blockId=fans block="ファン %pin を $fanstate にする || 速さ %speed \\%"
    //% fanstate.shadow="toggleOnOff"
    //% speed.min=0 speed.max=100
    //% expandableArgumentMode="toggle"
    export function motorFan(pin: AnalogPin, fanstate: boolean, speed: number = 100): void {
        if (fanstate) {
            pins.analogSetPeriod(pin, 100)
            pins.analogWritePin(pin, Math.map(speed, 0, 100, 0, 1023))
        }
        else {
            pins.analogWritePin(pin, 0)
            speed = 0
        }
    }
    /**
    * toggle Relay
    */
    //% blockId=Relay block="リレー %pin を %Relaystate にする"
    //% Relaystate.fieldEditor="gridpicker"
    //% Relaystate.fieldOptions.columns=1
    export function Relay(pin: DigitalPin, Relaystate: RelayStateList): void {
        switch (Relaystate) {
            case RelayStateList.On:
                pins.digitalWritePin(pin, 0)
                break;
            case RelayStateList.Off:
                pins.digitalWritePin(pin, 1)
                break;
        }
    }
    /**
* get Ultrasonic distance
*/
    //% blockId=sonarbit block="ちょう音波センサー ピン %pinT のきょり %distance_unit"
    //% distance_unit.fieldEditor="gridpicker"
    //% distance_unit.fieldOptions.columns=2
    export function ultrasoundSensor(pinT: DigitalPin, distance_unit: Distance_Unit_List): number {
        pins.setPull(pinT, PinPullMode.PullNone)
        pins.digitalWritePin(pinT, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pinT, 1)
        control.waitMicros(10)
        pins.digitalWritePin(pinT, 0)

        // read pulse
        let d = pins.pulseIn(pinT, PulseValue.High, 25000)
        let distance = d * 9 / 6 / 58

        if (distance > 400) {
            distance = 0
        }
        switch (distance_unit) {
            case Distance_Unit_List.Distance_Unit_cm:
                return Math.floor(distance)  //cm
                break
            case Distance_Unit_List.Distance_Unit_inch:
                return Math.floor(distance / 254)   //inch
                break
            default:
                return 0
        }
    }
        /**
    * TODO: Detect soil moisture value(0~100%)
    * @param soilmoisturepin describe parameter here, eg: DigitalRJPin.J1
    */
    //% blockId="PIR" block="人感センサー %pin が動きを見つけた"
    export function PIR(pin: DigitalPin): boolean {
        if (pins.digitalReadPin(pin) == 1) {
            return true
        }
        else {
            return false
        }
    }
    /**
    * toggle led
    */
    //% blockId=LED block="LED %pin を $ledstate にする || 明るさ %brightness \\%"
    //% brightness.min=0 brightness.max=100
    //% ledstate.shadow="toggleOnOff"
    //% expandableArgumentMode="toggle"
    export function ledBrightness(pin: AnalogPin, ledstate: boolean, brightness: number = 100): void {
        if (ledstate) {
            pins.analogSetPeriod(pin, 100)
            pins.analogWritePin(pin, Math.map(brightness, 0, 100, 0, 1023))
        }
        else {
            pins.analogWritePin(pin, 0)
            brightness = 0
        }
    }

    //% blockId="readUVLevel" block="UVセンサー %pin の強さ(0〜15)"
    export function UVLevel(pin: AnalogPin): number {
        let UVlevel = pins.analogReadPin(pin);
        if (UVlevel > 625) {
            UVlevel = 625
        }
        UVlevel = pins.map(
            UVlevel,
            0,
            625,
            0,
            15
        );
        return Math.round(UVlevel)
    }

    //% blockId="readmq3" block="アルコールセンサー %pin の値(0〜100)"
    export function mq3(pin:AnalogPin): number {
        let mq3_value = pins.analogReadPin(pin);
        if (mq3_value > 1000){
            mq3_value = 1000
        }
        let mq3_value_map = pins.map(mq3_value,0,1000,0,100)
        return Math.round(mq3_value_map);
    }

    function waitPinState(pin: DigitalPin, state: number, timeout_us: number) : boolean{
        let timeout =  input.runningTimeMicros() + timeout_us
        while(pins.digitalReadPin(pin) != state) {
            if(input.runningTimeMicros() > timeout) return false
        }
        return true
    }
    
    let _dht11_temp = -999.0
    let _dht11_humi = -999.0
    //% blockId="readdht11" block="DHT11センサー %Rjpin の %dht11state"
    //% Rjpin.fieldEditor="gridpicker" dht11state.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2 dht11state.fieldOptions.columns=1
    export function dht11Sensor(pin: DigitalPin, dht11state: DHT11_state): number {
        //initialize
        let checksum: number = 0
        let checksumTmp: number = 0
        let dataArray: boolean[] = []
        let resultArray: number[] = []

        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)
        //request data
        pins.digitalWritePin(pin, 0) //begin protocol, pull down pin
        basic.pause(20)
        pins.setPull(pin, PinPullMode.PullUp) //pull up data pin if needed
        pins.digitalReadPin(pin) //pull up pin
        control.waitMicros(40)
        if(!waitPinState(pin, 1, 500)) return dht11state == DHT11_state.DHT11_humidity ? _dht11_humi : _dht11_temp
        if(!waitPinState(pin, 0, 500)) return dht11state == DHT11_state.DHT11_humidity ? _dht11_humi : _dht11_temp

        //read data (5 bytes)
        for (let index = 0; index < 40; index++) {
            if(!waitPinState(pin, 0, 500)) return dht11state == DHT11_state.DHT11_humidity ? _dht11_humi : _dht11_temp
            if(!waitPinState(pin, 1, 500)) return dht11state == DHT11_state.DHT11_humidity ? _dht11_humi : _dht11_temp
            control.waitMicros(28)
            //if sensor still pull up data pin after 28 us it means 1, otherwise 0
            if (pins.digitalReadPin(pin) == 1) dataArray[index] = true
        }

        //convert byte number array to integer
        for (let index = 0; index < 5; index++)
            for (let index2 = 0; index2 < 8; index2++)
                if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

        //verify checksum
        checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        checksum = resultArray[4]
        //read data if checksum ok
        if (checksum == (checksumTmp & 0xFF)) {
            _dht11_temp = resultArray[2] + resultArray[3] / 10
            _dht11_humi = resultArray[0] + resultArray[1] / 10
        }
        
        return dht11state == DHT11_state.DHT11_humidity ? _dht11_humi : _dht11_temp

    }
}

// =====================================================================
// ここから下は、プリントの言葉に合わせて作った自作ブロック
//   レインボーLED / ディスプレイ / ドア / ファン / センサー
// 「〇〇の設定」ブロック（各カテゴリの「その他」の中）で、
//  ピン・角度・速さ・基準の値をあとから変えられます。
//  ここに書いてある数（初期値）を書きかえてもOKです。
// =====================================================================

enum HomeLEDColor {
    //% block="赤"
    Red = 0xFF0000,
    //% block="オレンジ"
    Orange = 0xFF8000,
    //% block="黄色"
    Yellow = 0xFFFF00,
    //% block="緑"
    Green = 0x00FF00,
    //% block="水色"
    Cyan = 0x00FFFF,
    //% block="青"
    Blue = 0x0000FF,
    //% block="むらさき"
    Purple = 0xA000FF,
    //% block="ピンク"
    Pink = 0xFF50A0,
    //% block="白"
    White = 0xFFFFFF
}

enum HomeFanSpeed {
    //% block="弱"
    Low,
    //% block="中"
    Middle,
    //% block="強"
    High
}

// ---------------------------------------------------------------------
// レインボーLED
// ---------------------------------------------------------------------
//% weight=9 color=#2699BF icon="\uf0eb" block="レインボーLED"
namespace rainbowled {
    let ledPin = DigitalPin.P4      // 初期値：ピン P4
    let brightness = 50             // 初期値：明るさ 50（0〜100）
    let current = 0

    function send(rgb: number): void {
        led.enable(false)   // P4 は本体の画面と共用なので、画面をオフにしておく
        const r = ((rgb >> 16) & 0xFF) * brightness / 100
        const g = ((rgb >> 8) & 0xFF) * brightness / 100
        const b = (rgb & 0xFF) * brightness / 100
        const buf = pins.createBuffer(3)
        buf[0] = Math.round(g)   // レインボーLED は 緑・赤・青 の順番でデータを受け取る
        buf[1] = Math.round(r)
        buf[2] = Math.round(b)
        ws2812b.sendBuffer(buf, ledPin)
    }

    //% blockId=rainbowled_colors block="%c"
    //% blockHidden=true shim=TD_ID
    //% c.fieldEditor="gridpicker" c.fieldOptions.columns=3
    export function colors(c: HomeLEDColor): number {
        return c
    }

    //% blockId=rainbowled_show block="レインボーLEDを %c にする"
    //% c.shadow="rainbowled_colors"
    //% weight=100
    export function showColor(c: number): void {
        current = c
        send(c)
    }

    //% blockId=rainbowled_off block="レインボーLEDを消す"
    //% weight=95
    export function off(): void {
        current = 0
        send(0)
    }

    //% blockId=rainbowled_brightness block="レインボーLEDの明るさを %value にする"
    //% value.min=0 value.max=100 value.defl=50
    //% weight=90
    export function setBrightness(value: number): void {
        brightness = Math.constrain(value, 0, 100)
        send(current)
    }

    //% blockId=rainbowled_blink block="レインボーLEDを %c で %times 回 点めつ"
    //% c.shadow="rainbowled_colors"
    //% times.min=1 times.max=20 times.defl=3
    //% weight=85
    export function blink(c: number, times: number): void {
        for (let i = 0; i < times; i++) {
            send(c)
            basic.pause(300)
            send(0)
            basic.pause(300)
        }
        current = 0
    }

    //% blockId=rainbowled_rainbow block="レインボーLEDをにじ色に変えていく"
    //% weight=80
    export function rainbow(): void {
        for (let h = 0; h < 360; h += 6) {
            send(hue(h))
            basic.pause(30)
        }
        current = hue(0)
        send(current)
    }

    //% blockId=rainbowled_rgb block="赤 %r 緑 %g 青 %b の色"
    //% r.min=0 r.max=100 r.defl=100
    //% g.min=0 g.max=100 g.defl=0
    //% b.min=0 b.max=100 b.defl=0
    //% weight=75
    export function rgb(r: number, g: number, b: number): number {
        const rr = Math.constrain(r, 0, 100) * 255 / 100
        const gg = Math.constrain(g, 0, 100) * 255 / 100
        const bb = Math.constrain(b, 0, 100) * 255 / 100
        return ((rr & 0xFF) << 16) | ((gg & 0xFF) << 8) | (bb & 0xFF)
    }

    function hue(h: number): number {
        h = h % 360
        const x = (h % 60) * 255 / 60
        if (h < 60) return (255 << 16) | (x << 8)
        if (h < 120) return ((255 - x) << 16) | (255 << 8)
        if (h < 180) return (255 << 8) | x
        if (h < 240) return ((255 - x) << 8) | 255
        if (h < 300) return (x << 16) | 255
        return (255 << 16) | (255 - x)
    }

    //% blockId=rainbowled_setup block="レインボーLEDの設定 ピン %pin"
    //% pin.defl=DigitalPin.P4
    //% advanced=true
    export function setup(pin: DigitalPin): void {
        ledPin = pin
    }
}

// ---------------------------------------------------------------------
// ディスプレイ（OLED）
// ---------------------------------------------------------------------
//% weight=8 color=#1c8f99 icon="\uf108" block="ディスプレイ"
namespace homedisplay {
    const LINES = 8
    let ready = false
    let lines: string[] = ["", "", "", "", "", "", "", ""]
    let cursor = 0

    // はじめて使うときに自動で準備する（「初期化」のブロックはいらない）
    function prepare(): void {
        if (!ready) {
            OLED.init(128, 64)
            ready = true
        }
    }

    function redraw(): void {
        prepare()
        OLED.clear()
        for (let i = 0; i < LINES; i++) {
            OLED.writeStringNewLine(lines[i])
        }
    }

    function addLine(text: string): void {
        if (cursor >= LINES) {
            lines.shift()
            lines.push("")
            cursor = LINES - 1
        }
        lines[cursor] = text
        cursor++
        redraw()
    }

    //% blockId=homedisplay_text block="ディスプレイに文字 %text を表示"
    //% text.defl="HELLO"
    //% weight=100
    export function showText(text: string): void {
        addLine(text)
    }

    //% blockId=homedisplay_num block="ディスプレイに数 %num を表示"
    //% weight=95
    export function showNumber(num: number): void {
        addLine("" + num)
    }

    //% blockId=homedisplay_label block="ディスプレイに %label と %num をならべて表示"
    //% label.defl="TEMP"
    //% weight=90
    export function showLabelNumber(label: string, num: number): void {
        addLine(label + " " + num)
    }

    //% blockId=homedisplay_line block="ディスプレイの %line 行目に %text を表示"
    //% line.min=1 line.max=8 line.defl=1
    //% text.defl="HELLO"
    //% weight=85
    export function showOnLine(line: number, text: string): void {
        const i = Math.constrain(line, 1, LINES) - 1
        lines[i] = text
        redraw()
    }

    //% blockId=homedisplay_clear block="ディスプレイを消す"
    //% weight=80
    export function clear(): void {
        for (let i = 0; i < LINES; i++) lines[i] = ""
        cursor = 0
        redraw()
    }
}

// ---------------------------------------------------------------------
// ドア（サーボ）
// ---------------------------------------------------------------------
//% weight=7 color=#a4161a icon="\uf52b" block="ドア"
namespace homedoor {
    let doorPin = AnalogPin.P8      // 初期値：ピン P8
    let openAngle = 90              // 初期値：開いたときの角度
    let closeAngle = 30             // 初期値：閉じたときの角度（ここで閉める強さを調整）
    let angle = -1                  // 今の角度（-1 はまだ動かしていない）

    function write(a: number): void {
        angle = Math.constrain(a, 0, 180)
        pins.servoWritePin(doorPin, angle)
    }

    function slowly(target: number): void {
        if (angle < 0) angle = closeAngle
        const step = target > angle ? 2 : -2
        while (Math.abs(target - angle) > 2) {
            write(angle + step)
            basic.pause(20)
        }
        write(target)
    }

    //% blockId=door_open block="ドアを開ける"
    //% weight=100
    export function open(): void {
        write(openAngle)
    }

    //% blockId=door_close block="ドアを閉める"
    //% weight=95
    export function close(): void {
        write(closeAngle)
    }

    //% blockId=door_open_slow block="ドアをゆっくり開ける"
    //% weight=90
    export function openSlowly(): void {
        slowly(openAngle)
    }

    //% blockId=door_close_slow block="ドアをゆっくり閉める"
    //% weight=85
    export function closeSlowly(): void {
        slowly(closeAngle)
    }

    //% blockId=door_angle block="ドアを %value 度にする"
    //% value.min=0 value.max=180 value.defl=90
    //% weight=80
    export function setAngle(value: number): void {
        write(value)
    }

    //% blockId=door_setup block="ドアの設定 ピン %pin 開く角度 %openA 閉じる角度 %closeA"
    //% pin.defl=AnalogPin.P8
    //% openA.min=0 openA.max=180 openA.defl=90
    //% closeA.min=0 closeA.max=180 closeA.defl=30
    //% advanced=true
    export function setup(pin: AnalogPin, openA: number, closeA: number): void {
        doorPin = pin
        openAngle = openA
        closeAngle = closeA
    }
}

// ---------------------------------------------------------------------
// ファン
// ---------------------------------------------------------------------
//% weight=6 color=#e8590c icon="\uf863" block="ファン"
namespace homefan {
    let fanPin = AnalogPin.P9       // 初期値：ピン P9
    let lowValue = 200              // 初期値：弱（0〜1023）
    let middleValue = 500           // 初期値：中
    let highValue = 1023            // 初期値：強

    //% blockId=fan_run block="ファンを %speed で回す"
    //% weight=100
    export function run(speed: HomeFanSpeed): void {
        let v = highValue
        if (speed == HomeFanSpeed.Low) v = lowValue
        else if (speed == HomeFanSpeed.Middle) v = middleValue
        pins.analogWritePin(fanPin, v)
    }

    //% blockId=fan_stop block="ファンを止める"
    //% weight=95
    export function stop(): void {
        pins.analogWritePin(fanPin, 0)
    }

    //% blockId=fan_setup block="ファンの設定 ピン %pin 弱 %low 中 %middle 強 %high"
    //% pin.defl=AnalogPin.P9
    //% low.min=0 low.max=1023 low.defl=200
    //% middle.min=0 middle.max=1023 middle.defl=500
    //% high.min=0 high.max=1023 high.defl=1023
    //% advanced=true
    export function setup(pin: AnalogPin, low: number, middle: number, high: number): void {
        fanPin = pin
        lowValue = low
        middleValue = middle
        highValue = high
    }
}

// ---------------------------------------------------------------------
// センサー（「もし」といっしょに使うブロック）とスイッチ
// ---------------------------------------------------------------------
//% weight=5 color=#2b8a3e icon="\uf2c9" block="センサー"
namespace homesensors {
    let lightPin = AnalogPin.P1     // 初期値：明るさセンサ P1
    let noisePin = AnalogPin.P2     // 初期値：音センサ P2
    let tempPin = AnalogPin.P3      // 初期値：温度センサ P3
    let switchPin = DigitalPin.P16  // 初期値：スイッチ P16
    let darkLevel = 30              // 初期値：明るさがこれより小さいと「暗い」
    let hotLevel = 28               // 初期値：温度がこれより高いと「暑い」
    let noisyLevel = 70             // 初期値：音がこれより大きいと「うるさい」
    let switchStarted = false

    //% blockId=sensors_light block="明るさ"
    //% weight=100
    export function light(): number {
        return smarthome.ReadLightIntensity(lightPin)
    }

    //% blockId=sensors_temp block="温度"
    //% weight=99
    export function temperature(): number {
        led.enable(false)   // P3 は本体の画面と共用なので、画面をオフにしておく
        return smarthome.ReadTemperature(TMP36Type.TMP36_temperature_C, tempPin)
    }

    //% blockId=sensors_noise block="音の大きさ"
    //% weight=98
    export function noise(): number {
        return smarthome.ReadNoise(noisePin)
    }

    //% blockId=sensors_dark block="暗い？"
    //% weight=90
    export function isDark(): boolean {
        return light() < darkLevel
    }

    //% blockId=sensors_hot block="暑い？"
    //% weight=89
    export function isHot(): boolean {
        return temperature() > hotLevel
    }

    //% blockId=sensors_noisy block="うるさい？"
    //% weight=88
    export function isNoisy(): boolean {
        return noise() > noisyLevel
    }

    //% blockId=sensors_switch_is block="スイッチがおされている？"
    //% weight=80
    export function isSwitchPressed(): boolean {
        pins.setPull(switchPin, PinPullMode.PullUp)
        return pins.digitalReadPin(switchPin) == 0
    }

    //% blockId=sensors_switch_on block="スイッチがおされたとき"
    //% weight=79
    export function onSwitchPressed(handler: () => void): void {
        if (switchStarted) return
        switchStarted = true
        control.inBackground(function () {
            let last = 1
            while (true) {
                pins.setPull(switchPin, PinPullMode.PullUp)
                const v = pins.digitalReadPin(switchPin)
                if (v == 0 && last == 1) handler()
                last = v
                basic.pause(20)
            }
        })
    }

    //% blockId=sensors_level block="センサーの基準 暗い %dark より小さい 暑い %hot ℃より高い うるさい %noisy より大きい"
    //% dark.min=0 dark.max=100 dark.defl=30
    //% hot.min=0 hot.max=50 hot.defl=28
    //% noisy.min=30 noisy.max=120 noisy.defl=70
    //% advanced=true
    export function setLevels(dark: number, hot: number, noisy: number): void {
        darkLevel = dark
        hotLevel = hot
        noisyLevel = noisy
    }

    //% blockId=sensors_pins block="センサーの設定 明るさ %lp 音 %np 温度 %tp スイッチ %sp"
    //% lp.defl=AnalogPin.P1 np.defl=AnalogPin.P2 tp.defl=AnalogPin.P3 sp.defl=DigitalPin.P16
    //% advanced=true
    export function setup(lp: AnalogPin, np: AnalogPin, tp: AnalogPin, sp: DigitalPin): void {
        lightPin = lp
        noisePin = np
        tempPin = tp
        switchPin = sp
    }
}
