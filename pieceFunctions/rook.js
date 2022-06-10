let board = document.getElementById('board');
let colour = ''
let id = ''
let X_Coords = ''
let Y_Coords = ''

function determineRookMoves(c, i, l) {
    colour = c
    id = i
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])

    for (let i = X_Coords + 1; i <= 8; i++) {
        let isEmpty = checkAvailability(i, Y_Coords)
        let tile = locateTile(i, Y_Coords)

        if (isEmpty == true) {
            tile.classList.add('possible')
        } else if (isEmpty == 'diff colour') {
            tile.classList.add('possible')
            break
        } else break
    }
    for (let i = X_Coords - 1; i > 0; i--) {
        let isEmpty = checkAvailability(i, Y_Coords)
        let tile = locateTile(i, Y_Coords)

        if (isEmpty == true) {
            tile.classList.add('possible')
        } else if (isEmpty == 'diff colour') {
            tile.classList.add('possible')
            break
        } else break
    }
    for (let i = Y_Coords + 1; i <= 8; i++) {
        let isEmpty = checkAvailability(X_Coords, i)
        let tile = locateTile(X_Coords, i)

        if (isEmpty == true) {
            tile.classList.add('possible')
        } else if (isEmpty == 'diff colour') {
            tile.classList.add('possible')
            break
        } else break
    }
    for (let i = Y_Coords - 1; i > 0; i--) {
        let isEmpty = checkAvailability(X_Coords, i)
        let tile = locateTile(X_Coords, i)
        
        if (isEmpty == true) {
            tile.classList.add('possible')
        } else if (isEmpty == 'diff colour') {
            tile.classList.add('possible')
            break
        } else break
    }
    


}

function checkAvailability(x, y) {
    correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        return true
    } else {
        if (correspondingTile.firstElementChild.dataset.colour !== colour) {
            return 'diff colour'
        } else return 'ally'
    }


}

function locateTile(x, y) {
    let result
    Array.from(board.children).forEach(tile => {
        z = String.fromCharCode(x + 96)
        let currentTile = z + y.toString()
        if (currentTile == tile.dataset.number) result = tile
    })

    return result
}