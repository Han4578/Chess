import {checkAvailability, checkForCheckmate, simulateMove} from "../script.js"

let X_Coords = ''
let Y_Coords = ''

export function determineQueenMoves(piece, l, purpose, w_being_checked, b_being_checked) {
    let c = piece.dataset.colour
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])
    let leftUp = Y_Coords
    let rightDown = Y_Coords
    let leftDown = X_Coords
    let rightUp = X_Coords
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
            default:
                break;
        }
        if (isOccupied) break
    }
    for (let i = X_Coords + 1; i <= 8; i++) {
        rightDown--
        if (rightDown == 0 || rightDown == 9) break
        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, i, rightDown)
                break;
            case 'move':
                isOccupied = checkAvailability(i, rightDown)
                break;
            case 'checked':
                isOccupied = simulateMove(i, rightDown, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }
    for (let i = X_Coords - 1; i > 0; i--) {
        leftUp++
        if (leftUp == 0 || leftUp == 9) break
        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, i, leftUp)
                break;
            case 'move':
                isOccupied = checkAvailability(i, leftUp)
                break;
            case 'checked':
                isOccupied = simulateMove(i, leftUp, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        rightUp++
        if (rightUp == 0 || rightUp == 9) break
        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, rightUp, i)
                break;
            case 'move':
                isOccupied = checkAvailability(rightUp, i)
                break;
            case 'checked':
                isOccupied = simulateMove(rightUp, i, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break

    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        leftDown--
        if (leftDown == 0 || leftDown == 9) break
        switch (purpose) {
            case 'checkmate':
                isOccupied = checkForCheckmate(c, leftDown, i)
                break;
            case 'move':
                isOccupied = checkAvailability(leftDown, i)
                break;
            case 'checked':
                isOccupied = simulateMove(leftDown, i, piece)
                break;
            default:
                break;
        }
        if (isOccupied) break

    }
    
}

