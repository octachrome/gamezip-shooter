GAME_ZIP64.onButtonPress(GAME_ZIP64.ZIP64ButtonPins.Fire1, GAME_ZIP64.ZIP64ButtonEvents.Down, function () {
    bullet_y = 7
    bullet_x = player_x
})
GAME_ZIP64.onButtonPress(GAME_ZIP64.ZIP64ButtonPins.Fire2, GAME_ZIP64.ZIP64ButtonEvents.Down, function () {
    mine = 1
    mine_x = player_x
})
GAME_ZIP64.onButtonPress(GAME_ZIP64.ZIP64ButtonPins.Left, GAME_ZIP64.ZIP64ButtonEvents.Down, function () {
    player_x += -1
    if (player_x < 0) {
        player_x = 0
    }
})
function setUpLevel () {
    level_speed = 0.06 + level * 0.02
    alien_speed = level_speed
    aliens_x = 0
    aliens_y = 0
    player_x = 2
    bullet_y = -5
    aliens = [1, 1, 1, 1, 1, 1]
}
GAME_ZIP64.onButtonPress(GAME_ZIP64.ZIP64ButtonPins.Right, GAME_ZIP64.ZIP64ButtonEvents.Down, function () {
    player_x += 1
    if (player_x > 7) {
        player_x = 7
    }
})
let alive_count = 0
let hit = 0
let alien_y = 0
let alien_x = 0
let aliens: number[] = []
let aliens_y = 0
let aliens_x = 0
let alien_speed = 0
let level_speed = 0
let mine_x = 0
let mine = 0
let player_x = 0
let bullet_x = 0
let bullet_y = 0
let level = 0
let display = GAME_ZIP64.createZIP64Display()
display.setBrightness(20)
GAME_ZIP64.setBuzzerPin()
let dead = 0
level = 1
setUpLevel()
basic.forever(function () {
    if (dead == 0) {
        aliens_x += alien_speed
        if (aliens_x > 4) {
            alien_speed = level_speed * -1
            aliens_x = 3
        }
        if (aliens_x < 0) {
            alien_speed = level_speed
            aliens_x = 0
            aliens_y += 1
        }
        bullet_y += -0.5
        display.clear()
        for (let index = 0; index <= aliens.length - 1; index++) {
            if (aliens[index] == 1) {
                alien_x = Math.round(aliens_x - 0.5) + index % 3 * 2
                alien_y = aliens_y + index / 3
                display.setMatrixColor(alien_x, alien_y, GAME_ZIP64.colors(ZipLedColors.Green))
            }
        }
        display.setMatrixColor(bullet_x, bullet_y, GAME_ZIP64.colors(ZipLedColors.Red))
        display.setMatrixColor(player_x, 7, GAME_ZIP64.colors(ZipLedColors.Blue))
        if (mine == 1) {
            display.setMatrixColor(mine_x, 6, GAME_ZIP64.colors(ZipLedColors.Orange))
        }
        display.show()
        hit = 0
        alive_count = 0
        for (let index = 0; index <= aliens.length - 1; index++) {
            if (aliens[index] == 1) {
                alien_x = Math.round(aliens_x - 0.5) + index % 3 * 2
                alien_y = aliens_y + index / 3
                if (Math.abs(bullet_x - alien_x) < 1 && Math.abs(bullet_y - alien_y) < 1) {
                    hit = 1
                    bullet_y = -5
                    aliens[index] = 0
                } else if (mine == 1 && (Math.abs(mine_x - alien_x) < 1 && Math.abs(alien_y - 6) < 1)) {
                    hit = 1
                    mine = 0
                    aliens[index] = 0
                } else {
                    alive_count += 1
                    if (alien_y >= 7) {
                        dead = 1
                    }
                }
            }
        }
        if (dead == 1) {
            music.startMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once)
        } else if (hit == 1) {
            GAME_ZIP64.runMotor(100)
            if (alive_count == 0) {
                music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
                level += 1
                setUpLevel()
            }
        }
    }
})
basic.forever(function () {
    basic.showNumber(level)
})
