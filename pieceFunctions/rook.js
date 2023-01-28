import {checkAvailability, checkForCheckmate, simulateMove, checkForTakes, w_being_checked, b_being_checked} from "../script.js"

export function determineRookMoves(piece, location, purpose) {
    let c = piece.dataset.colour
    let X_Coords = location.charCodeAt(0) - 96
    let Y_Coords = parseFloat(location[1])
    let isOccupied = false
    if (purpose == 'move' && ((c == 'white' && w_being_checked == true) || (c == 'black' && b_being_checked == true))) purpose = 'checked';
    for (let i = X_Coords + 1; i <= 8; i++) {

        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, i, Y_Coords)
                break;
            case 'move':
                isOccupied = checkAvailability(i, Y_Coords)
                break;
            case 'checked':
                isOccupied = simulateMove(i, Y_Coords, piece) 
                break;
            case 'checkMoves':
                isOccupied = simulateMove(i, Y_Coords, piece, 'checkMoves') 
                break;
            case 'checkTakes':
                isOccupied = checkForTakes(i, Y_Coords, piece) 
                break;
            case 'checkTakes':
                isOccupied = checkForTakes(i, Y_Coords, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }

    for (let i = X_Coords - 1; i > 0; i--) {

        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, i, Y_Coords)
                break;
            case 'move':
                isOccupied = checkAvailability(i, Y_Coords)
                break;
            case 'checked':
                isOccupied = simulateMove(i, Y_Coords, piece)
                break;
            case 'checkMoves':
                isOccupied = simulateMove(i, Y_Coords, piece, 'checkMoves')
                break;
            case 'checkTakes':
                isOccupied = checkForTakes(i, Y_Coords, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }
    for (let i = Y_Coords + 1; i < 9; i++) {

        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, X_Coords, i)
                break;
            case 'move':
                isOccupied = checkAvailability(X_Coords, i)
                break;
            case 'checked':
                isOccupied = simulateMove(X_Coords, i, piece)
                break;
            case 'checkMoves':
                isOccupied = simulateMove(X_Coords, i, piece, 'checkMoves')
                break;
            case 'checkTakes':
                isOccupied = checkForTakes(X_Coords, i, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }
    for (let i = Y_Coords - 1; i > 0; i--) {

        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, X_Coords, i)
                break;
            case 'move':
                isOccupied = checkAvailability(X_Coords, i)
                break;
            case 'checked':
                isOccupied = simulateMove(X_Coords, i, piece)
                break;
            case 'checkMoves':
                isOccupied = simulateMove(X_Coords, i, piece, 'checkMoves')
                break;
            case 'checkTakes':
                isOccupied = checkForTakes(X_Coords, i, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }
    
}

