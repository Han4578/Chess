import jsonPieces from "./pieces.json" assert {type: 'json'};
import {determineRookMoves} from "./pieceFunctions/rook.js" ;
import {determineBishopMoves} from "./pieceFunctions/bishop.js" ;
import {determineQueenMoves} from "./pieceFunctions/queen.js" ;
import {determineKnightMoves} from "./pieceFunctions/knight.js" ;
import {determineKingMoves, castle} from "./pieceFunctions/king.js" ;
import {determinePawnMoves} from "./pieceFunctions/pawn.js" ;

let board = document.getElementById('board');
let reverseBtn = document.getElementById('reverse')
let whiteContainer = document.querySelector('.white')
let blackContainer = document.querySelector('.black')
let containers = [whiteContainer, blackContainer]

const setupBoard = {
    setup() {
        for (let i = 1; i <= 4; ++i) {
            this.whiteFirst(2 * i - 1)
            this.blackFirst(2 * i)
        }
        startGame()
    },
    whiteFirst(n) {
        for (let i = 1; i <= 8; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.dataset.number = String.fromCharCode(i + 96) + Math.abs(n - 9);
            tile.dataset.firstMove = false;
            (i % 2 == 0) ? tile.style.backgroundColor = 'black': '';
            board.appendChild(tile);
        }
    },

    blackFirst(n) {
        for (let i = 1; i <= 8; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.dataset.number = String.fromCharCode(i + 96) + Math.abs(n - 9);
            tile.dataset.firstMove = false;
            (i % 2 == 1) ? tile.style.backgroundColor = 'black': '';
            board.appendChild(tile);
        }
    }

}

function startGame() {
    for (const p of jsonPieces) {
        for (const l of p.location) {
            var piece = document.createElement('img')
            piece.src = p.src
            piece.dataset.type = p.type
            piece.dataset.colour = p.colour
            piece.id = l
            piece.setAttribute("draggable", true)
            piece.classList.add('piece')
            if (p.type == "rook" || p.type == "king") piece.dataset.canCastle = true

            for (const tile of Array.from(board.children)) {
                if (tile.dataset.number == l) {
                    tile.appendChild(piece)
                }
            }
        }

    }
}

for (const c of containers) {
    for (const img of c.children) {
        img.addEventListener('click', (e) => {
            promote(e.target.id)
        })
    }
}

setupBoard.setup()
//------------------------------------------------------------------------------------------------------------------------------

export let pieces = Array.from(document.getElementsByClassName('piece'))
let tile = Array.from(document.getElementsByClassName('tile'))
let possibleMoves = Array.from(document.getElementsByClassName('possible'))
let turn = 'white'
let currentPiece = ''
let selectedPieceId = ''
let colour
let hasTurns = true
export let w_being_checked = false //w checks b
export let b_being_checked = false //b checks w
let gameEnded = false
let isPromoting = false

changeTurn()

for (const p of pieces) {

    p.addEventListener("dragstart", selectPiece)
    p.addEventListener("click", selectPiece)

    function selectPiece(e) {
        possibleMoves = Array.from(document.getElementsByClassName('possible'))
        for (const t of possibleMoves) {
            t.classList.remove('possible')
        } //removes previous possible moves

        if (selectedPieceId == e.target.id) {
            selectedPieceId = ''
            p.parentElement.classList.remove('selected') //cancels selection when same piece is selected
            for (const t of tile) {
                t.dataset.firstMove = false
                t.dataset.castle = false
                t.classList.remove('special')
            }
            for (const p of pieces) {
                p.classList.remove('en-passanted')
            }
            return
        }

        let selectedClass = Array.from(document.getElementsByClassName('selected'))
        if (selectedClass.length > 0) {
            for (const piece of selectedClass) {
                piece.classList.remove('selected') //removes previous selection
            }
        }

        p.parentElement.classList.add('selected') //selects current piece
        selectedPieceId = e.target.id
        currentPiece = e.target
        colour = e.target.dataset.colour
        let isMovable = checkMovablity(currentPiece)
        if (!isMovable) return

        determinePieceType(currentPiece, currentPiece.parentElement.dataset.number)
        e.stopPropagation()

    }

}

for (const t of tile) {
    t.addEventListener("drop", dropPiece)
    t.addEventListener("click", dropPiece)

    t.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    function dropPiece(e) {
        let target = e.target
        if (selectedPieceId == '' || !(target.classList.contains('possible'))) return //return if can't drop

        let droppedPiece = document.getElementById(selectedPieceId)
        if (droppedPiece.dataset.type == 'pawn' && target.classList.contains('special')) {      
            for (const p of pieces) {
                p.dataset.firstMove = false
                if (p.classList.contains('en-passanted')) { //remove en passanted piece
                    p.remove()
                    let index = pieces.indexOf(p)
                    pieces.splice(index, 1)
                }
            }
        }
        target.appendChild(droppedPiece); //move

        for (const p of pieces) {
            p.dataset.firstMove = false
        }

        if (target.dataset.firstMove == 'true') { //allow en passant if pawn first move
            droppedPiece.dataset.firstMove = true
            target.dataset.firstMove = false
        }

        if (droppedPiece.dataset.canCastle == 'true' && target.dataset.castle !== 'true') droppedPiece.dataset.canCastle = false //can't castle once moved

        selectedPieceId = '';
        if (target.children.length > 1) { //take piece
            let index = pieces.indexOf(target.firstChild)
            pieces.splice(index, 1)
            target.removeChild(target.firstChild)
        }
        if (droppedPiece.dataset.type == 'pawn' && (target.dataset.number[1] == '8' || target.dataset.number[1] == '1')) displayPromotion(droppedPiece.dataset.colour);
        if (target.dataset.castle == 'true') castle(target.dataset.number, droppedPiece) //castle
        if (droppedPiece.dataset.checked == 'true') droppedPiece.dataset.checked = false //no longer checked for king

        for (const t of tile) { //reset possible tiles
            t.classList.remove('possible')
            t.classList.remove('selected')
            t.dataset.firstMove = false
        }




        refreshCheckableTiles()
        if (w_being_checked) checkPossibleMoves('white')
        else if (b_being_checked) checkPossibleMoves('black')
        changeTurn()
    }
}


function determinePieceType(piece, location) {

    switch (piece.dataset.type) {
        case "rook":
            determineRookMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;
        case "bishop":
            determineBishopMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;
        case "queen":
            determineQueenMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;
        case "knight":
            determineKnightMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;
        case "king":
            determineKingMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;
        case "pawn":
            determinePawnMoves(piece, location, 'move', w_being_checked, b_being_checked);
            break;

        default:
            return
    }
}


export function checkAvailability(x, y) {
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        correspondingTile.classList.add('possible')
        return false //no piece on tile

    } else if (correspondingTile.firstElementChild.dataset.colour !== colour) {
        correspondingTile.classList.add('possible')
        return true //enemy on tile

    } else return true //ally on tile

}

export function locateTile(x, y) {
    let result
    for (const tile of Array.from(board.children)) {
        let z = String.fromCharCode(x + 96)
        let currentTile = z + y.toString()
        if (currentTile == tile.dataset.number) result = tile
    }
    return result
}

export function checkForCheckmate(c, x, y) { //the king cannot move onto these tiles

    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        (c == 'white') ? correspondingTile.dataset.w_checkable = true: correspondingTile.dataset.b_checkable = true;
        return false //no pieces on tile

    } else if (correspondingTile.firstChild.dataset.type == 'king' && correspondingTile.firstChild.dataset.colour !== c) {
        correspondingTile.firstChild.dataset.checked = true;
        w_being_checked = false;
        b_being_checked = false;
        (c == 'white') ? b_being_checked = true: w_being_checked = true;
        return false //enemy king found

    } else {
        (c == 'white') ? correspondingTile.dataset.w_checkable = true: correspondingTile.dataset.b_checkable = true;
        return true //piece on tile

    }
}

export function simulateMove(x, y, piece, purpose = 'move') { //if i move here can i stop the check
    let original = [w_being_checked, b_being_checked]
    w_being_checked = false
    b_being_checked = false
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        let imaginaryPiece = document.createElement('div')
        imaginaryPiece.classList.add('imaginary')
        correspondingTile.appendChild(imaginaryPiece)
        refreshCheckableTiles()
        if ((piece.dataset.colour == 'white' && !w_being_checked) || (piece.dataset.colour == 'black' && !b_being_checked)) {
            if (purpose != 'checkMoves') correspondingTile.classList.add('possible')
            else gameEnded = false
        }
        correspondingTile.removeChild(imaginaryPiece);
        w_being_checked = original[0];
        b_being_checked = original[1];
        return false //no piece on tile

    } else if (correspondingTile.firstElementChild.dataset.colour !== piece.dataset.colour) {
        let enemyPiece = correspondingTile.firstElementChild
        correspondingTile.removeChild(enemyPiece)
        refreshCheckableTiles()
        if ((piece.dataset.colour == 'white' && !w_being_checked) || (piece.dataset.colour == 'black' && !b_being_checked)) {
            if (purpose != 'checkMoves') correspondingTile.classList.add('possible')
            else gameEnded = false
        }
        correspondingTile.appendChild(enemyPiece)
        w_being_checked = original[0]
        b_being_checked = original[1]
        return true //enemy on tile

    } else {
        w_being_checked = original[0]
        b_being_checked = original[1]
        return true
    } //ally on tile
}

export function refreshCheckableTiles() { //refresh where the king can't move
    for (const t of tile) {
        t.dataset.w_checkable = false
        t.dataset.b_checkable = false
    }
    w_being_checked = false
    b_being_checked = false
    pieces = Array.from(document.getElementsByClassName('piece'))
    for (const p of pieces) {
        switch (p.dataset.type) {
            case "rook":
                determineRookMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            case "bishop":
                determineBishopMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            case "queen":
                determineQueenMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            case "knight":
                determineKnightMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            case "pawn":
                determinePawnMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            case "king":
                determineKingMoves(p, p.parentElement.dataset.number, 'checkmate');
                break
            default:
                break
        }
    }
}

function checkMovablity(piece) { //if i move here will i be checked
    if ((piece.dataset.colour == 'white' && w_being_checked) || (piece.dataset.colour == 'black' && b_being_checked)) return true
    let correspondingTile = piece.parentElement
    let result

    correspondingTile.removeChild(piece)
    refreshCheckableTiles()

    result = ((colour == 'white' && w_being_checked) || (colour == 'black' && b_being_checked)) ? false : true;

    correspondingTile.appendChild(piece)
    refreshCheckableTiles()
    return result
}

function checkPossibleMoves(c) { //when checked, can i still move
    gameEnded = true
    let kingMovability

    pieces = Array.from(document.getElementsByClassName('piece'))
    for (const p of pieces) {
        if (p.dataset.colour !== c) return
        switch (p.dataset.type) {
            case "rook":
                determineRookMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            case "bishop":
                determineBishopMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            case "queen":
                determineQueenMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            case "knight":
                determineKnightMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            case "pawn":
                determinePawnMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            case "king":
                kingMovability = determineKingMoves(p, p.parentElement.dataset.number, 'checkMoves');
                break
            default:
                break
        }
    }

    if (gameEnded && !kingMovability) endGame(c)
}


function displayPromotion(c) {
    (c == 'white') ? whiteContainer.style.display = 'grid': blackContainer.style.display = 'grid';
    for (const p of pieces) {
        p.style.pointerEvents = 'none'
    }
    isPromoting = true
}

function promote(piece) {
    isPromoting = false
    let pawn = pieces.filter(p => {
        return p.dataset.type == 'pawn' && (p.parentElement.dataset.number[1] == '1' || p.parentElement.dataset.number[1] == '8')
    })[0]
    pawn.dataset.type = piece
    if (pawn.dataset.colour == 'white') {
        switch (piece) {
            case 'queen':
                pawn.src = './images/w_queen.png'
                break;
            case 'rook':
                pawn.src = './images/w_rook.png'
                break;
            case 'bishop':
                pawn.src = './images/w_bishop.png'
                break;
            case 'knight':
                pawn.src = './images/w_knight.png'
                break;
            default:
                break;
        }
        whiteContainer.style.display = 'none'
    } else {
        switch (piece) {
            case 'queen':
                pawn.src = './images/b_queen.png'
                break;
            case 'rook':
                pawn.src = './images/b_rook.png'
                break;
            case 'bishop':
                pawn.src = './images/b_bishop.png'
                break;
            case 'knight':
                pawn.src = './images/b_knight.png'
                break;
            default:
                break;
        }
        blackContainer.style.display = 'none'
    }

    refreshCheckableTiles()
    if (w_being_checked) checkPossibleMoves('white')
    else if (b_being_checked) checkPossibleMoves('black')
    changeTurn()
}


function changeTurn() {
    if (!hasTurns || isPromoting) return;
    
    for (const p of pieces) {
        (p.dataset.colour !== turn) ? p.style.pointerEvents = 'none': p.style.pointerEvents = 'auto';
    }

    (turn == 'white') ? turn = 'black': turn = 'white';
}

reverseBtn.addEventListener('click', () => {
    board.classList.toggle('reverse')
})

function endGame(c) {
    let winner = (c == 'white') ? 'black' : 'white';
    let winnerBoard = document.querySelector('.winner')
    winnerBoard.innerHTML = 'Winner: ' + winner
    winnerBoard.style.display = 'flex'
    for (const p of pieces) {
        p.style.pointerEvents = 'none'
    }
}