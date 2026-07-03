//% color=#FF6B35 weight=100 icon="\uf015" block="スマートホーム"
namespace SmartHome {

    // ピン設定（実機の配線に合わせて修正済み）
    const PIN_LED      = DigitalPin.P0   // LED
    const PIN_FAN      = AnalogPin.P9    // ファン（アナログ、値0〜100）
    const PIN_DOOR_SW  = DigitalPin.P2   // ドアスイッチ（リミットスイッチ）
    const PIN_TEMP     = AnalogPin.P3    // 温度センサー（外付け）
    const PIN_LIGHT    = AnalogPin.P1    // 明るさセンサー

    // ===== ライト =====

    //% block="💡 ライトをつける"
    //% weight=90 group="ライト"
    export function lightOn(): void {
        pins.digitalWritePin(PIN_LED, 1)
    }

    //% block="💡 ライトを消す"
    //% weight=89 group="ライト"
    export function lightOff(): void {
        pins.digitalWritePin(PIN_LED, 0)
    }

    // ===== ファン（アナログP9、値100で回転）=====

    //% block="🌀 ファンを回す"
    //% weight=80 group="ファン"
    export function fanOn(): void {
        pins.analogWritePin(PIN_FAN, 100)
    }

    //% block="🌀 ファンを止める"
    //% weight=79 group="ファン"
    export function fanOff(): void {
        pins.analogWritePin(PIN_FAN, 0)
    }

    // ===== ドア（サーボモーターP8）=====

    //% block="🚪 ドアを開ける"
    //% weight=76 group="ドア"
    export function doorOpen(): void {
        pins.servoWritePin(AnalogPin.P8, 90)
    }

    //% block="🚪 ドアを閉める"
    //% weight=75 group="ドア"
    export function doorClose(): void {
        pins.servoWritePin(AnalogPin.P8, 30)
    }

    //% block="🚪 ドアスイッチが押された？"
    //% weight=74 group="ドア"
    export function isDoorSwitchOn(): boolean {
        return pins.digitalReadPin(PIN_DOOR_SW) === 1
    }

    // ===== メッセージ =====

    //% block="📺 おやすみ を表示"
    //% weight=70 group="メッセージ"
    export function showOyasumi(): void {
        basic.showString("OYASUMI")
    }

    //% block="📺 おかえり を表示"
    //% weight=69 group="メッセージ"
    export function showOkaeri(): void {
        basic.showString("OKAERI")
    }

    //% block="📺 %message を表示"
    //% weight=68 group="メッセージ"
    export function showMessage(message: string): void {
        basic.showString(message)
    }

    // ===== センサー =====

    //% block="🌡️ あつい？"
    //% weight=60 group="センサー"
    export function isHot(): boolean {
        const raw = pins.analogReadPin(PIN_TEMP)
        const temp = (raw / 1023.0) * 330
        return temp >= 30
    }

    //% block="🌡️ 今の気温"
    //% weight=59 group="センサー"
    export function getTemperature(): number {
        const raw = pins.analogReadPin(PIN_TEMP)
        return Math.round((raw / 1023.0) * 330)
    }

    //% block="🌙 暗い？"
    //% weight=58 group="センサー"
    export function isDark(): boolean {
        return pins.analogReadPin(PIN_LIGHT) < 400
    }

    //% block="🌙 今の明るさ"
    //% weight=57 group="センサー"
    export function getLightLevel(): number {
        return pins.analogReadPin(PIN_LIGHT)
    }

    // ===== その他 =====

    //% block="⬛ ぜんぶ止める"
    //% weight=10 group="その他"
    export function allOff(): void {
        pins.analogWritePin(PIN_FAN, 0)
        pins.digitalWritePin(PIN_LED, 0)
        pins.servoWritePin(AnalogPin.P8, 30)
        basic.clearScreen()
    }

}