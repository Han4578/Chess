import {checkAvailability, checkForCheckmate, simulateMove, w_being_checked, b_being_checked} from "../script.js"

let X_Coords = ''
let Y_Coords = ''

export function determineKnightMoves(piece, l, purpose) {
    let c = piece.dataset.colour
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])
    if (purpose == 'move' && ((c == 'white' && w_being_checked == true) || (c == 'black' && b_being_checked == true))) purpose = 'checked';


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

    for (const loc of locations) {
        if (loc.x > 8 || loc.x < 1 || loc.y > 8 || loc.y < 1) continue

        switch (purpose) {
            case 'checkmate':
                checkForCheckmate(c, loc.x, loc.y)
                break;
            case 'move':
                checkAvailability(loc.x, loc.y)
                break;
            case 'checked':
                simulateMove(loc.x, loc.y, piece)
                break;
            case 'checkMoves':
                simulateMove(loc.x, loc.y, piece, 'checkMoves')
                break;
            default:
                break;
        }
    }

}