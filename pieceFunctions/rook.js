import {checkAvailability, checkForCheckmate} from "../script.js"

export function determineRookMoves(i, l, purpose) {
    let c = i.dataset.colour
    let X_Coords = l.charCodeAt(0) - 96
    let Y_Coords = parseFloat(l[1])

    for (let i = X_Coords + 1; i <= 8; i++) {
        if(purpose == 'checkmate'){
            checkForCheckmate(c)
            continue
        }
        let isEmpty = checkAvailability(i, Y_Coords)
        if (isEmpty) break
    }

    for (let i = X_Coords - 1; i > 0; i--) {
        if(purpose == 'checkmate'){
            checkForCheckmate(c)
            continue
        }
        let isEmpty = checkAvailability(i, Y_Coords)
        if (isEmpty) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        if(purpose == 'checkmate'){
            checkForCheckmate(c)
            continue
        }
        let isEmpty = checkAvailability(X_Coords, i)
        if (isEmpty) break
    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        if(purpose == 'checkmate'){
            checkForCheckmate(c)
            continue
        }
        let isEmpty = checkAvailability(X_Coords, i)
        if (isEmpty) break
    }
    
}

