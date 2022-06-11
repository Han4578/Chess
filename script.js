import pieces from "./pieces.json" assert {type: 'json'};
import {determineRookMoves} from "./pieceFunctions/rook.js" ;
import {determineBishopMoves} from "./pieceFunctions/bishop.js" ;
import {determineQueenMoves} from "./pieceFunctions/queen.js" ;
import {determineKnightMoves} from "./pieceFunctions/knight.js" ;
import {determineKingMoves} from "./pieceFunctions/king.js" ;
import {determinePawnMoves} from "./pieceFunctions/pawn.js" ;

export let board = document.getElementById('board');
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
            (i % 2 == 0) ? tile.style.backgroundColor = 'black': '';
            board.appendChild(tile);
        }
    },

    blackFirst(n) {
        for (let i = 1; i <= 8; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.dataset.number = String.fromCharCode(i + 96) + Math.abs(n - 9);
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

            Array.from(board.children).forEach(tile => {
                (tile.dataset.number == l) ? tile.appendChild(piece): ''
            })
        })
    })
}
setupBoard.setup()
//------------------------------------------------------------------------------------------------------------------------------

let piece = Array.from(document.getElementsByClassName('piece'))
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
        determinePieceType(e.target.dataset.colour, e.target.dataset.type, e.target.id, e.target.parentElement.dataset.number)
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
            t.appendChild(droppedPiece);
            piece.forEach(p => {p.dataset.firstMove = false})
            //Y U NO WORKKKKKKKKKKKKKKKKKK
            if(t.dataset.firstMove == true){
                console.log(droppedPiece)
                droppedPiece.dataset.firstMove = true
                t.dataset.firstMove = false
            }
            selectedPiece = '';
        
            (t.children.length > 1) ? t.removeChild(t.firstChild): ""

            tile.forEach(t => {
                t.classList.remove('possible')
                t.classList.remove('selected')
                t.dataset.firstMove = false
            })

            changeTurn()
        }
    })
    

function determinePieceType(c, type, id, location) {
    colour = c
    switch (type) {
        case "rook":
            determineRookMoves(id, location);
            break
        case "bishop":
            determineBishopMoves(id, location);
            break
        case "queen":
            determineQueenMoves(id, location);
            break
        case "knight":
            determineKnightMoves(id, location);
            break
        case "king":
            determineKingMoves(id, location);
            break
        case "pawn":
            determinePawnMoves(id, location, c);
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