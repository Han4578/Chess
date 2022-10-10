import { checkForCheckmate, simulateMove, refreshCheckableTiles, locateTile } from "../script.js";

export function determinePawnMoves(piece, location, purpose, w_being_checked, b_being_checked) {
    let X_Coords = location.charCodeAt(0) - 96
    let Y_Coords = parseFloat(location[1]);
    let colour = piece.dataset.colour;
    let pawn = piece;
    if (purpose == 'move' && ((colour == 'white' && w_being_checked == true) || (colour == 'black' && b_being_checked == true))) purpose = 'checked';
    (colour == 'white') ? whiteMove(): blackMove();


    function whiteMove() {
        if (Y_Coords == 8) return

        if (purpose == 'checkmate') {
            checkForEnemy(X_Coords, Y_Coords + 1)
            return
        }

        checkAvailability(X_Coords, Y_Coords + 1)
        checkForEnemy(X_Coords, Y_Coords + 1)
        checkForEnPassantW(X_Coords, Y_Coords)
        if (Y_Coords == 2) specialTile(X_Coords, Y_Coords + 2)


    }

    function blackMove() {
        if (Y_Coords == 0) return

        if (purpose == 'checkmate') {
            checkForEnemy(X_Coords, Y_Coords - 1)
            return
        }

        checkAvailability(X_Coords, Y_Coords - 1)
        checkForEnemy(X_Coords, Y_Coords - 1)
        checkForEnPassantB(X_Coords, Y_Coords)
        if (Y_Coords == 7) specialTile(X_Coords, Y_Coords - 2)

    }

    function specialTile(x, y) {
        let correspondingTile = locateTile(x, y)
        if (Array.from(correspondingTile.children).length == 0) {
            correspondingTile.dataset.firstMove = true

            if (purpose == 'move') correspondingTile.classList.add('possible')
            else if (purpose == 'checked') simulateMove(x, y, pawn)
        }
    }

    function checkAvailability(x, y) {
        let correspondingTile = locateTile(x, y)
        if (Array.from(correspondingTile.children).length == 0) {

            if (purpose == 'move') correspondingTile.classList.add('possible')
            else if (purpose == 'checked') {
                simulateMove(x, y, pawn)
            }
        }
    }


    function checkForEnemy(x, y) {
        let left = x - 1
        let right = x + 1
        let leftTile = locateTile(left, y)
        let rightTile = locateTile(right, y)
        if (left < 9 && left > 0) {
            if (purpose == 'checkmate') checkForCheckmate(colour, left, y);
            else if (Array.from(leftTile.children).length !== 0 && leftTile.firstChild.dataset.colour !== colour) {
                switch (purpose) {
                    case 'move':
                        leftTile.classList.add('possible');
                        break;
                    case 'checked':
                        simulateMove(left, y, pawn)
                        break;
                    default:
                        break;
                }
            }
        }
        if (right < 9 && right > 0) {
            if (purpose == 'checkmate') checkForCheckmate(colour, right, y)
            else if (Array.from(rightTile.children).length !== 0 && rightTile.firstChild.dataset.colour !== colour) {
                switch (purpose) {
                    case 'move':
                        rightTile.classList.add('possible');
                        break;
                    case 'checked':
                        simulateMove(right, y, pawn)
                        break;
                    default:
                        break;
                }
            }
        }
    }

    function checkForEnPassantB(x, y) {
        let left = x - 1
        let right = x + 1
        let leftTile = locateTile(left, y)
        let rightTile = locateTile(right, y)

        if (left < 9 && left > 0) {
            if (Array.from(leftTile.children).length !== 0 && leftTile.firstElementChild.dataset.firstMove == 'true') {
                let tile = locateTile(left, y - 1)
                if (purpose == 'move') {
                    tile.classList.add('possible')
                    leftTile.firstElementChild.classList.add('en-passanted')
                } else simulateMove(left, y - 1, pawn)

            }
        }

        if (right < 9 && right > 0) {
            if (Array.from(rightTile.children).length !== 0 && rightTile.firstElementChild.dataset.firstMove == 'true') {
                let tile = locateTile(right, y - 1)
                if (purpose == 'move') {
                    tile.classList.add('possible')
                    leftTile.firstElementChild.classList.add('en-passanted')
                } else simulateMove(left, y - 1, pawn)
            }
        }
    }

    function checkForEnPassantW(x, y) {
        let left = x - 1
        let right = x + 1
        let leftTile = locateTile(left, y)
        let rightTile = locateTile(right, y)

        if (left < 9 && left > 0) {
            if (Array.from(leftTile.children).length !== 0 && leftTile.firstElementChild.dataset.firstMove == 'true') {
                let tile = locateTile(left, y + 1)
                leftTile.classList.add('en-passanted')
                if (purpose == 'move') {
                    tile.classList.add('possible')
                } else simulateEnPassantMoveW(left, y + 1, pawn)
            }
        }
        if (right < 9 && right > 0) {
            if (Array.from(rightTile.children).length !== 0 && rightTile.firstElementChild.dataset.firstMove == 'true') {
                let tile = locateTile(right, y + 1)
                rightTile.classList.add('en-passanted')
                if (purpose == 'move') {
                    tile.classList.add('possible')
                } else simulateEnPassantMoveW(left, y + 1, pawn)
            }
        }
    }

    function simulateEnPassantMoveW(x, y, piece) {
        let original = [w_being_checked, b_being_checked]
        w_being_checked = false
        b_being_checked = false
        let correspondingTile = locateTile(x, y)
        let passantedTile = locateTile(x, y - 1)
            let imaginaryPiece = document.createElement('div')
            imaginaryPiece.classList.add('imaginary')
            correspondingTile.appendChild(imaginaryPiece)
            
            let enemyPiece = passantedTile.firstElementChild
            passantedTile.removeChild(enemyPiece)
            refreshCheckableTiles()
            if ((piece.dataset.colour == 'white' && !w_being_checked) || (piece.dataset.colour == 'black' && !b_being_checked)) {
                correspondingTile.classList.add('possible')
            }
            correspondingTile.removeChild(imaginaryPiece);
            passantedTile.appendChild(enemyPiece)
            w_being_checked = original[0]
            b_being_checked = original[1]
    }
}