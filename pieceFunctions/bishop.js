import {checkAvailability, checkForCheckmate, simulateMove, w_being_checked, b_being_checked} from "../script.js"

export function determineBishopMoves(piece, l, purpose) {
    let c = piece.dataset.colour
    let X_Coords = l.charCodeAt(0) - 96
    let Y_Coords = parseFloat(l[1])
    let leftUp = Y_Coords
    let rightDown = Y_Coords
    let leftDown = X_Coords
    let rightUp = X_Coords
    let isOccupied = false
    if (purpose == 'move' && ((c == 'white' && w_being_checked == true) || (c == 'black' && b_being_checked == true))) purpose = 'checked';

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
            case 'checkMoves':
                isOccupied = simulateMove(i, rightDown, piece, 'checkMoves')
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
            case 'checkMoves':
                isOccupied = simulateMove(i, leftUp, piece, 'checkMoves')
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
            case 'checkMoves':
                isOccupied = simulateMove(rightUp, i, piece, 'checkMoves')
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
            case 'checkMoves':
                isOccupied = simulateMove(leftDown, i, piece, 'checkMoves')
                break;
            default:
                break;
        }
        if (isOccupied) break

    }

}
