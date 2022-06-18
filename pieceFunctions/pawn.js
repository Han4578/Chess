let X_Coords = ''
let Y_Coords = ''
let colour

export function determinePawnMoves(piece, l, purpose) {
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1]);
    colour = piece.dataset.colour;

    (c == 'white') ? whiteMove(): blackMove();
}

function whiteMove() {
    if (Y_Coords == 8) return

    checkAvailability(X_Coords, Y_Coords + 1)
    checkForEnemy(X_Coords, Y_Coords + 1)
    checkForEnPassantW(X_Coords, Y_Coords)
    if (Y_Coords == 2) specialTile(X_Coords, Y_Coords + 2)
}

function blackMove() {
    if (Y_Coords == 0) return

    checkAvailability(X_Coords, Y_Coords - 1)
    checkForEnemy(X_Coords, Y_Coords - 1)
    checkForEnPassantB(X_Coords, Y_Coords)
    if (Y_Coords == 7) specialTile(X_Coords, Y_Coords - 2)

}

function specialTile(x, y) {
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        correspondingTile.classList.add('possible')
        correspondingTile.dataset.firstMove = true
    }
}

function checkAvailability(x, y) {
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        correspondingTile.classList.add('possible')
    }
}

function locateTile(x, y) {
    let result
    Array.from(board.children).forEach(tile => {
        let z = String.fromCharCode(x + 96)
        let currentTile = z + y.toString()
        if (currentTile == tile.dataset.number) result = tile
    })

    return result
}

function checkForEnemy(x, y) {
    let left = x - 1
    let right = x + 1
    let leftTile = locateTile(left, y)
    let rightTile = locateTile(right, y)

    if (left < 9 && left > 0) {
        if (Array.from(leftTile.children).length !== 0 && leftTile.firstElementChild.dataset.colour !== colour) leftTile.classList.add('possible');
    }
    if (right < 9 && right > 0) {
        if (Array.from(rightTile.children).length !== 0 && rightTile.firstElementChild.dataset.colour !== colour) rightTile.classList.add('possible');
    }
}

function checkForEnPassantB(x,y) {
    let left = x - 1
    let right = x + 1
    let leftTile = locateTile(left, y)
    let rightTile = locateTile(right, y)

    if (left < 9 && left > 0) {
        if (Array.from(leftTile.children).length !== 0 && leftTile.firstElementChild.dataset.firstMove == 'true') {
            let tile = locateTile(left, y - 1)
            tile.classList.add('possible')
            leftTile.firstElementChild.classList.add('en-passanted')
        }
    }
    if (right < 9 && right > 0) {
        if (Array.from(rightTile.children).length !== 0 && rightTile.firstElementChild.dataset.firstMove == 'true') {
            let tile = locateTile(right, y - 1)
            tile.classList.add('possible')
            rightTile.firstElementChild.classList.add('en-passanted')
        }
    }
}

function checkForEnPassantW(x,y) {
    let left = x - 1
    let right = x + 1
    let leftTile = locateTile(left, y)
    let rightTile = locateTile(right, y)

    if (left < 9 && left > 0) {
        if (Array.from(leftTile.children).length !== 0 && leftTile.firstElementChild.dataset.firstMove == 'true') {
            let tile = locateTile(left, y + 1)
            tile.classList.add('possible')
            leftTile.firstElementChild.classList.add('en-passanted')
        }
    }
    if (right < 9 && right > 0) {
        if (Array.from(rightTile.children).length !== 0 && rightTile.firstElementChild.dataset.firstMove == 'true') {
            let tile = locateTile(right, y + 1)
            tile.classList.add('possible')
            rightTile.classList.add('en-passanted')
        }
    }
}