//% color=#FF6B35 weight=100 icon="\uf015" block="スマートホーム"
namespace SmartHome {

    // ピン設定
    const PIN_LED   = DigitalPin.P0
    const PIN_FAN   = DigitalPin.P1
    const PIN_DOOR  = DigitalPin.P2
    const PIN_LIGHT = AnalogPin.P3

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

    // ===== ファン =====

    //% block="🌀 ファンを回す"
    //% weight=80 group="ファン"
    export function fanOn(): void {
        pins.digitalWritePin(PIN_FAN, 1)
    }

    //% block="🌀 ファンを止める"
    //% weight=79 group="ファン"
    export function fanOff(): void {
        pins.digitalWritePin(PIN_FAN, 0)
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

    // ===== センサー =====

    //% block="🌡️ あつい？"
    //% weight=60 group="センサー"
    export function isHot(): boolean {
        return input.temperature() >= 30
    }

    //% block="🌙 暗い？"
    //% weight=58 group="センサー"
    export function isDark(): boolean {
        return pins.analogReadPin(PIN_LIGHT) < 400
    }

    //% block="🚪 ドアが開いた？"
    //% weight=56 group="センサー"
    export function isDoorOpen(): boolean {
        return pins.digitalReadPin(PIN_DOOR) === 1
    }

    // ===== その他 =====

    //% block="⬛ ぜんぶ止める"
    //% weight=10 group="その他"
    export function allOff(): void {
        pins.digitalWritePin(PIN_LED, 0)
        pins.digitalWritePin(PIN_FAN, 0)
        basic.clearScreen()
    }

}