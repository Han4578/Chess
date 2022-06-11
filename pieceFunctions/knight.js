import {locateTile,checkAvailability} from "../script.js"

let id = ''
let X_Coords = ''
let Y_Coords = ''

export function determineKnightMoves(i, l) {
    id = i
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])

    let L1 = {
        x: X_Coords - 1,
        y: Y_Coords + 2
    }
    let L2 = {
        x: X_Coords + 1,
        y: Y_Coords + 2
    }
    let L3 = {
        x: X_Coords + 2,
        y: Y_Coords + 1
    }
    let L4 = {
        x: X_Coords + 2,
        y: Y_Coords - 1
    }
    let L5 = {
        x: X_Coords + 1,
        y: Y_Coords - 2
    }
    let L6 = {
        x: X_Coords - 1,
        y: Y_Coords - 2
    }
    let L7 = {
        x: X_Coords - 2,
        y: Y_Coords - 1
    }
    let L8 = {
        x: X_Coords - 2,
        y: Y_Coords + 1
    }
    let locations = [L1,L2,L3,L4,L5,L6,L7,L8]

    locations.forEach(loc => {
        if (loc.x > 8 || loc.x < 1 || loc.y > 8 || loc.y < 1) return
        checkAvailability(loc.x, loc.y)
    })

}