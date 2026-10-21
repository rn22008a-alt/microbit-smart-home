// 動作確認用のプログラム（拡張機能として読み込んだときは使われません）
homedisplay.showText("TEST")
homesensors.onSwitchPressed(DigitalPin.P16, function () {
    homedoor.openSlowly(AnalogPin.P8)
    basic.pause(3000)
    homedoor.closeSlowly(AnalogPin.P8)
})
basic.forever(function () {
    homedisplay.showOnLine(1, "LIGHT " + homesensors.light(AnalogPin.P1))
    homedisplay.showOnLine(2, "TEMP " + homesensors.temperature(AnalogPin.P3))
    if (homesensors.isDark(AnalogPin.P1)) {
        rainbowled.showColor(DigitalPin.P4, rainbowled.colors(HomeLEDColor.White))
    } else {
        rainbowled.off(DigitalPin.P4)
    }
    if (homesensors.isHot(AnalogPin.P3)) {
        homefan.run(AnalogPin.P9, HomeFanSpeed.High)
    } else {
        homefan.stop(AnalogPin.P9)
    }
    basic.pause(500)
})
