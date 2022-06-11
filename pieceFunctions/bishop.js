import {checkAvailability} from "../script.js"

let id = ''
let X_Coords = ''
let Y_Coords = ''

export function determineBishopMoves(i, l) {
    id = i
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])
    let leftUp = Y_Coords
    let rightDown = Y_Coords
    let leftDown = X_Coords
    let rightUp = X_Coords
    for (let i = X_Coords + 1; i <= 8; i++) {
        rightDown--
        if (rightDown == 0 || rightDown == 9) break
        let isEmpty = checkAvailability(i, rightDown)
        if (isEmpty) break
    }
    for (let i = X_Coords - 1; i > 0; i--) {
        leftUp++
        if (leftUp == 0 || leftUp == 9) break

        let isEmpty = checkAvailability(i, leftUp)
        if (isEmpty) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        rightUp++
        if (rightUp == 0 || rightUp == 9) break

        let isEmpty = checkAvailability(rightUp, i)
        if (isEmpty) break

    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        leftDown--
        if (leftDown == 0 || leftDown == 9) break

        let isEmpty = checkAvailability(leftDown, i)
        if (isEmpty) break

    }

}
