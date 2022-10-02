import {checkAvailability, checkForCheckmate} from "../script.js"

let X_Coords = ''
let Y_Coords = ''

export function determineBishopMoves(i, l, purpose) {
    let c = i.dataset.colour
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])
    let leftUp = Y_Coords
    let rightDown = Y_Coords
    let leftDown = X_Coords
    let rightUp = X_Coords
    for (let i = X_Coords + 1; i <= 8; i++) {
        rightDown--
        if (rightDown == 0 || rightDown == 9) break
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, i, rightDown)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(i, rightDown)
        if (isOccupied) break
    }
    for (let i = X_Coords - 1; i > 0; i--) {
        leftUp++
        if (leftUp == 0 || leftUp == 9) break
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, i, leftUp)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(i, leftUp)
        if (isOccupied) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        rightUp++
        if (rightUp == 0 || rightUp == 9) break
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, rightUp, i)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(rightUp, i)
        if (isOccupied) break

    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        leftDown--
        if (leftDown == 0 || leftDown == 9) break
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, leftDown, i)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(leftDown, i)
        if (isOccupied) break

    }

}
