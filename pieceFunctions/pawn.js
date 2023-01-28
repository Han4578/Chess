import { checkForCheckmate, simulateMove, simulateEnPassantMove, locateTile, checkForTakes, w_being_checked, b_being_checked } from "../script.js";

export function determinePawnMoves(piece, location, purpose) {
    let X_Coords = location.charCodeAt(0) - 96
    let Y_Coords = parseFloat(location[1]);
    let colour = piece.dataset.colour;
    let pawn = piece;
    if (purpose == 'move' && ((colour == 'white' && w_being_checked == true) || (colour == 'black' && b_being_checked == true))) purpose = 'checked';
    move()

    function move() {
        if ((colour == 'black' && Y_Coords == 1) || (colour == 'white' && Y_Coords == 8)) return

        let Y2 = (colour == 'white')? Y_Coords + 1: Y_Coords - 1;
        let Y3 = (colour == 'white')? Y_Coords + 2: Y_Coords - 2;

        if (purpose == 'checkmate' || purpose == 'checkTakes') {
            checkForEnemy(X_Coords, Y2)
            return
        }

        let isPossible = checkAvailability(X_Coords, Y2)
        checkForEnemy(X_Coords, Y2)
        checkForEnPassant(X_Coords, Y_Coords)
        if ((Y_Coords == (colour == 'white')? 2 : 7) && isPossible) specialTile(X_Coords, Y3)

    }

    function specialTile(x, y) {
        let correspondingTile = locateTile(x, y)
        if (Array.from(correspondingTile.children).length == 0) {
            correspondingTile.dataset.firstMove = true

            if (purpose == 'move') correspondingTile.classList.add('possible')
            else if (purpose == 'checked' || purpose == 'checkMoves') simulateMove(x, y, pawn, purpose)
        }
    }

    function checkAvailability(x, y) {
        let correspondingTile = locateTile(x, y)
        if (Array.from(correspondingTile.children).length == 0) {

            if (purpose == 'move') correspondingTile.classList.add('possible')
            else if (purpose == 'checked' || purpose == 'checkMoves') simulateMove(x, y, pawn, purpose)

            return true
        } else return false
    }


    function checkForEnemy(x, y) {
        let left = x - 1
        let right = x + 1
        let leftTile = locateTile(left, y)
        let rightTile = locateTile(right, y)
        let enemyTiles = []

        if (left < 9 && left > 0) enemyTiles.push(leftTile)
        if (right < 9 && right > 0) enemyTiles.push(rightTile)

        for (const t of enemyTiles) {
            let horizontal = (t == leftTile)? left: right;
            if (purpose == 'checkmate') checkForCheckmate(colour, horizontal, y)
            else if (Array.from(t.children).length !== 0 && t.firstChild.dataset.colour !== colour) {
                switch (purpose) {
                    case 'move':
                        t.classList.add('possible');
                        break;
                    case 'checked':
                        simulateMove(horizontal, y, pawn)
                        break;
                    case 'checkMoves':
                        simulateMove(horizontal, y, pawn, 'checkMoves')
                        break;
                    case 'checkTakes':
                        checkForTakes(horizontal, y, pawn)
                        break;
                    default:
                        break;
                }
            }
        }

    }

    function checkForEnPassant(x, y) {
        let left = x - 1
        let right = x + 1
        let leftTile = locateTile(left, y)
        let rightTile = locateTile(right, y)
        let capturedTiles = []

        if (left < 9 && left > 0) capturedTiles.push(leftTile)
        if (right < 9 && right > 0) capturedTiles.push(rightTile)

        for (const t of capturedTiles) {
            let horizontal = (t == leftTile)? left: right;
            let vertical = (pawn.dataset.colour == 'white')? y + 1: y - 1
            if (Array.from(t.children).length !== 0 && t.firstElementChild.dataset.firstMove == 'true' && t.firstElementChild.dataset.colour !== colour) {
                if (purpose == 'move') {
                    let tile = locateTile(horizontal, vertical)
                    t.firstElementChild.classList.add('en-passanted')
                    tile.classList.add('special')
                    tile.classList.add('possible')
                } else simulateEnPassantMove(horizontal, vertical, pawn, purpose) // checkmoves or checked
            }
        }
    }


}