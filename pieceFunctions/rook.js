import {checkAvailability} from "../script.js"

let id = ''
let X_Coords = ''
let Y_Coords = ''

export function determineRookMoves(i, l) {
    id = i
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])

    for (let i = X_Coords + 1; i <= 8; i++) {
        let isEmpty = checkAvailability(i, Y_Coords)
        if (isEmpty) break
    }

    for (let i = X_Coords - 1; i > 0; i--) {
        let isEmpty = checkAvailability(i, Y_Coords)
        if (isEmpty) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        let isEmpty = checkAvailability(X_Coords, i)
        if (isEmpty) break
    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        let isEmpty = checkAvailability(X_Coords, i)
        if (isEmpty) break
    }
    
}

