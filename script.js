import pieces from "./pieces.json" assert {type: 'json'};
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
    pieces.forEach(p => {
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
                    tile.dataset.hasPiece = true
                }
            })
        })
    })
}
setupBoard.setup()
//------------------------------------------------------------------------------------------------------------------------------

export let piece = Array.from(document.getElementsByClassName('piece'))
let tile = Array.from(document.getElementsByClassName('tile'))
let possibleMoves = Array.from(document.getElementsByClassName('possible'))
let turn = 'white'
let currentPiece = ''
let selectedPiece = ''
let colour
let hasTurns = true

changeTurn()

piece.forEach(p => {

    p.addEventListener("dragstart", selectPiece)
    p.addEventListener("click",selectPiece)

    function selectPiece(e) {
        possibleMoves = Array.from(document.getElementsByClassName('possible'))
        possibleMoves.forEach(t => {
            t.classList.remove('possible')
        }) //removes previous possible moves

        if (selectedPiece == e.target.id) {
            selectedPiece = ''
            p.parentElement.classList.remove('selected') //cancels selection when same piece is selected
            tile.forEach(t => {t.dataset.firstMove = false})
            return
        }

        let selectedClass = Array.from(document.getElementsByClassName('selected'))
        if (selectedClass.length > 0) {
            selectedClass.forEach(piece => {
                piece.classList.remove('selected') //removes previous selection
            })
        }

        p.parentElement.classList.add('selected') //selects current piece
        selectedPiece = e.target.id
        currentPiece = e.target
        determinePieceType(currentPiece, currentPiece.parentElement.dataset.number,'move')
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
            let t = e.target
            if (selectedPiece == '' || !(t.classList.contains('possible'))) return
            
            let droppedPiece = document.getElementById(selectedPiece)
            piece.forEach(p => {p.dataset.firstMove = false})
            t.appendChild(droppedPiece);
            
            if(t.dataset.firstMove == 'true') {
                droppedPiece.dataset.firstMove = true
                t.dataset.firstMove = false
            }
            
            if (droppedPiece.dataset.canCastle == 'true' && t.dataset.castle !== 'true') droppedPiece.dataset.canCastle = false
            
            selectedPiece = '';
            (t.children.length > 1) ? t.removeChild(t.firstChild): ""
            
            if (t.dataset.castle == 'true') castle(t.dataset.number, droppedPiece)
            
            tile.forEach(t => {
                t.classList.remove('possible')
                t.classList.remove('selected')
                t.dataset.firstMove = false
                t.dataset.castle = false
                if (t.classList.contains('en-passanted')) {
                    t.removeChild(t.firstChild)
                    t.classList.remove('en-passanted')
                }
                (Array.from(t.children).length == 1)? t.dataset.hasPiece = true : t.dataset.hasPiece = false
                t.dataset.checkable = false
            })

            
            determinePieceType(currentPiece, currentPiece.parentElement.dataset.number,'checkmate')
            changeTurn()
        }
    })
    

function determinePieceType(piece, purpose) {
    
    switch (piece.dataset.type) {
        case "rook":
            determineRookMoves(piece, location, purpose);
            break
        case "bishop":
            determineBishopMoves(piece, location, purpose);
            break
        case "queen":
            determineQueenMoves(piece, location, purpose);
            break
        case "knight":
            determineKnightMoves(piece, location, purpose);
            break
        case "king":
            determineKingMoves(piece, location, purpose);
            break
        case "pawn":
            determinePawnMoves(piece, location, purpose);
            break

        default:
            return
    }
}


export function checkAvailability(x, y) {
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        correspondingTile.classList.add('possible')
        return false
    } else {
        if (correspondingTile.firstElementChild.dataset.colour !== colour) {
            correspondingTile.classList.add('possible')
            return true
        } else return false
    }
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

export function checkForCheckmate(c){
    
    let correspondingTile = locateTile(x, y)
    if (Array.from(correspondingTile.children).length == 0) {
        correspondingTile.dataset.checkable = true
    } else if (correspondingTile.firstChildElement.dataset.type == 'king' && correspondingTile.firstChildElement.dataset.colour !== c){
        tile.forEach(t => {
            //find the king and set it as checked
        })
    }
}

function changeTurn(){
    piece.forEach(p => {
        (p.dataset.colour !== turn)?p.style.pointerEvents = 'none':p.style.pointerEvents = 'auto';
    })
    if (!hasTurns) return
    (turn == 'white')?turn = 'black':turn = 'white';
}

reverseBtn.addEventListener('click', () => {
    board.classList.toggle('reverse')
})