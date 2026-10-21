// 動作確認用のプログラム（拡張機能として読み込んだときは使われません）
homedisplay.showText("TEST")
homesensors.onSwitchPressed(function () {
    homedoor.openSlowly()
    basic.pause(3000)
    homedoor.closeSlowly()
})
basic.forever(function () {
    homedisplay.showOnLine(1, "LIGHT " + homesensors.light())
    homedisplay.showOnLine(2, "TEMP " + homesensors.temperature())
    if (homesensors.isDark()) {
        rainbowled.showColor(rainbowled.colors(HomeLEDColor.White))
    } else {
        rainbowled.off()
    }
    if (homesensors.isHot()) {
        homefan.run(HomeFanSpeed.High)
    } else {
        homefan.stop()
    }
    basic.pause(500)
})
