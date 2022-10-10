import jsonPieces from "./pieces.json" assert {type: 'json'};
import {determineRookMoves} from "./pieceFunctions/rook.js" ;
import {determineBishopMoves} from "./pieceFunctions/bishop.js" ;
import {determineQueenMoves} from "./pieceFunctions/queen.js" ;
import {determineKnightMoves} from "./pieceFunctions/knight.js" ;
import {determineKingMoves, castle} from "./pieceFunctions/king.js" ;
import {determinePawnMoves} from "./pieceFunctions/pawn.js" ;

export let doc = document
let board = document.getElementById('board');
let reverseBtn = document.getElementById('reverse')

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
    jsonPieces.forEach(p => {
        p.location.forEach(l => {
            var piece = document.createElement('img')
            piece.src = p.src
            piece.dataset.type = p.type
            piece.dataset.colour = p.colour
            piece.id = l
            piece.setAttribute("draggable", true)
            piece.classList.add('piece')
            if (p.type == "rook" || p.type == "king") piece.dataset.canCastle = true
            
            Array.from(board.children).forEach(tile => {
                if (tile.dataset.number == l) {
                    tile.appendChild(piece)
                }
            })
        })

    })
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

changeTurn()

pieces.forEach(p => {

    p.addEventListener("dragstart", selectPiece)
    p.addEventListener("click", selectPiece)

    function selectPiece(e) {
        possibleMoves = Array.from(document.getElementsByClassName('possible'))
        possibleMoves.forEach(t => {
            t.classList.remove('possible')
        }) //removes previous possible moves

        if (selectedPieceId == e.target.id) {
            selectedPieceId = ''
            p.parentElement.classList.remove('selected') //cancels selection when same piece is selected
            tile.forEach(t => {
                t.dataset.firstMove = false
                t.dataset.castle = false
            })
            pieces.forEach(p => {
                p.classList.remove('en-passanted')
            })
            return
        }

        let selectedClass = Array.from(document.getElementsByClassName('selected'))
        if (selectedClass.length > 0) {
            selectedClass.forEach(piece => {
                piece.classList.remove('selected') //removes previous selection
            })
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

})

tile.forEach(t => {
    t.addEventListener("drop", dropPiece)
    t.addEventListener("click", dropPiece)

    t.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    function dropPiece(e) {
        let target = e.target
        if (selectedPieceId == '' || !(target.classList.contains('possible'))) return

        let droppedPiece = document.getElementById(selectedPieceId)
        pieces.forEach(p => {
            p.dataset.firstMove = false
            if (p.classList.contains('en-passanted')) {
                p.remove()
                let index = pieces.indexOf(p)
                pieces.splice(index, 1)
            }
        })
        target.appendChild(droppedPiece);

        if (target.dataset.firstMove == 'true') {
            droppedPiece.dataset.firstMove = true
            target.dataset.firstMove = false
        }

        if (droppedPiece.dataset.canCastle == 'true' && target.dataset.castle !== 'true') droppedPiece.dataset.canCastle = false

        selectedPieceId = '';
        if (target.children.length > 1) {
            let index = pieces.indexOf(target.firstChild)
            pieces.splice(index, 1)
            target.removeChild(target.firstChild)
        }
        if (target.dataset.castle == 'true') castle(target.dataset.number, droppedPiece)
        if (droppedPiece.dataset.checked == 'true') droppedPiece.dataset.checked = false

        tile.forEach(t => {
            t.classList.remove('possible')
            t.classList.remove('selected')
            t.dataset.firstMove = false
        })


        refreshCheckableTiles()
        if (w_being_checked) checkPossibleMoves('white') 
        else if (b_being_checked) checkPossibleMoves('black')
        changeTurn()
    }
})


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
    Array.from(board.children).forEach(tile => {
        let z = String.fromCharCode(x + 96)
        let currentTile = z + y.toString()
        if (currentTile == tile.dataset.number) result = tile
    })
    return result
}

export function checkForCheckmate(c, x, y) {

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

export function simulateMove(x, y, piece, purpose = 'move') {
    let original = [w_being_checked,b_being_checked]
    w_being_checked = false
    b_being_checked = false
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        let imaginaryPiece = document.createElement('div')
        imaginaryPiece.classList.add('imaginary')
        correspondingTile.appendChild(imaginaryPiece)
        refreshCheckableTiles()
        if((piece.dataset.colour == 'white' && !w_being_checked) || (piece.dataset.colour == 'black' && !b_being_checked)) {
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
        if((piece.dataset.colour == 'white' && !w_being_checked) || (piece.dataset.colour == 'black' && !b_being_checked)) {
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

export function refreshCheckableTiles(){
    tile.forEach(t => {
        t.dataset.w_checkable = false
        t.dataset.b_checkable = false
    })
    w_being_checked = false
    b_being_checked = false
    pieces = Array.from(document.getElementsByClassName('piece'))
    pieces.forEach(p => {
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
    })
}

function checkMovablity(piece) {
    if ((piece.dataset.colour == 'white' && w_being_checked) || (piece.dataset.colour == 'black' && b_being_checked)) return true
    let correspondingTile = piece.parentElement
    let result

    correspondingTile.removeChild(piece)
    refreshCheckableTiles()
    
    result = ((colour == 'white' && w_being_checked) || (colour == 'black' && b_being_checked))? false: true;
    
    correspondingTile.appendChild(piece)
    return result
}

function checkPossibleMoves(c) {
    gameEnded = true
    let kingMovability

    pieces = Array.from(document.getElementsByClassName('piece'))
    pieces.forEach(p => {
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
    })

    if (gameEnded && !kingMovability) endGame(c)
}

function changeTurn() {
    if (!hasTurns) return;

    for (const p of pieces) {
        (p.dataset.colour !== turn)? p.style.pointerEvents = 'none': p.style.pointerEvents = 'auto';
    }
    
    (turn == 'white')? turn = 'black' : turn = 'white';
}

reverseBtn.addEventListener('click', () => {
    board.classList.toggle('reverse')
})

function endGame(c) {
    let winner = (c == 'white')? 'black' : 'white';
    let winnerBoard = doc.querySelector('.winner')
    winnerBoard.innerHTML = 'Winner: ' + winner
    winnerBoard.style.display = 'flex'
    pieces.forEach(p => {
        p.style.pointerEvents = 'none'
    })
}