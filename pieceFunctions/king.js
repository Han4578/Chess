import {checkAvailability, piece, locateTile} from "../script.js"

let p = ''
let X_Coords = ''
let Y_Coords = ''
let colour = ''

export function determineKingMoves(piece, l, purpose) {
    p = piece
    X_Coords = l.charCodeAt(0) - 96
    Y_Coords = parseFloat(l[1])
    colour = piece.dataset.colour

    let L1 = {
        x: X_Coords,
        y: Y_Coords + 1
    }
    let L2 = {
        x: X_Coords + 1,
        y: Y_Coords + 1
    }
    let L3 = {
        x: X_Coords + 1,
        y: Y_Coords
    }
    let L4 = {
        x: X_Coords + 1,
        y: Y_Coords - 1
    }
    let L5 = {
        x: X_Coords,
        y: Y_Coords - 1
    }
    let L6 = {
        x: X_Coords - 1,
        y: Y_Coords - 1
    }
    let L7 = {
        x: X_Coords - 1,
        y: Y_Coords
    }
    let L8 = {
        x: X_Coords - 1,
        y: Y_Coords + 1
    }
    let locations = [L1, L2, L3, L4, L5, L6, L7, L8]

    locations.forEach(loc => {
        if (loc.x > 8 || loc.x < 1 || loc.y > 8 || loc.y < 1) return
        if(locateTile(loc.x, loc.y).dataset.checkable == 'true') return
        checkAvailability(loc.x, loc.y)
    })

    checkForCastle()
}

function checkForCastle() {
    let currentPiece = p
    if (currentPiece.dataset.canCastle !== 'true') return

    let rooks = []
    piece.forEach(p => {
        if (p.dataset.colour == colour && p.dataset.canCastle == 'true' && p.dataset.type == 'rook') rooks.push(p)
    })

    if (rooks.length == 0) return
    
    let castleLeft
    let castleRight
    
    rooks.forEach(r => {
        if (r.id == 'a1' || r.id == 'a8') {
            for (let i = X_Coords - 1; i > 1; i--) {
                let correspondingTile = locateTile(i, Y_Coords)
                if (Array.from(correspondingTile.children).length !== 0) break
                castleLeft = true
            }
        }
        
        if (r.id == 'h1' || r.id == 'h8') {
            for (let i = X_Coords + 1; i < 7; i++) {
                let correspondingTile = locateTile(i, Y_Coords)
                if (Array.from(correspondingTile.children).length !== 0) break
                castleRight = true
            }
        }
    })

    if (castleLeft == true){
        let correspondingTile = locateTile(X_Coords - 2, Y_Coords)
        correspondingTile.classList.add('possible')
        correspondingTile.dataset.castle = true
    }
    if (castleRight == true){
        let correspondingTile = locateTile(X_Coords + 2, Y_Coords)
        correspondingTile.classList.add('possible')
        correspondingTile.dataset.castle = true
    }
}

export function castle(tileNum, king){
    let y = king.id[1]
    let rookTile
    let rook
    if (tileNum.includes('c')){
        rook = locateTile(1, y).firstElementChild
        rookTile = locateTile(4, y)
    }
    if (tileNum.includes('g')){
        rook = locateTile(8, y).firstElementChild
        rookTile = locateTile(6, y)
    }
    rookTile.appendChild(rook)
    king.dataset.canCastle = false
}