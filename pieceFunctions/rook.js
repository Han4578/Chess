import {checkAvailability, checkForCheckmate, simulateMove} from "../script.js"

export function determineRookMoves(piece, location, purpose, w_checked, b_checked) {
    let c = piece.dataset.colour
    let X_Coords = location.charCodeAt(0) - 96
    let Y_Coords = parseFloat(location[1])
    if ((c == 'white' && w_checked == true) || (c == 'black' && b_checked == true)) purpose = 'checked';

    for (let i = X_Coords + 1; i <= 8; i++) {
        let isOccupied = false
        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, i, Y_Coords)
                break;
            case 'move':
                isOccupied = checkAvailability(i, Y_Coords)
                break;
            case 'checked':
                isOccupied = simulateMove(i, Y_Coords, piece);
                break;
            default:
                break;
        }
        if (isOccupied) break
    }

    for (let i = X_Coords - 1; i > 0; i--) {
        if(purpose == 'checkmate'){
            checkForCheckmate(c, i, Y_Coords)
            continue
        }
        let isOccupied = checkAvailability(i, Y_Coords)
        if (isOccupied) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, X_Coords, i)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(X_Coords, i)
        if (isOccupied) break
    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        if(purpose == 'checkmate'){
            let isOccupied = checkForCheckmate(c, X_Coords, i)
            if (isOccupied) break;
            continue
        }
        let isOccupied = checkAvailability(X_Coords, i)
        if (isOccupied) break
    }
    
}

