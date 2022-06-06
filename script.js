import pieces from "./pieces.json" assert {type: 'json'};


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

let piece = Array.from(document.getElementsByClassName('piece'))
let tile = Array.from(document.getElementsByClassName('tile'))

piece.forEach(p => {
    p.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id)
    })

})

tile.forEach(t => {

    t.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    t.addEventListener("drop", (e) => {
        e.preventDefault()

        let droppedPiece = e.dataTransfer.getData('text/plain')
        let droppedPieceId = document.getElementById(droppedPiece)
        t.appendChild(droppedPieceId);

        (t.children.length > 1)? t.removeChild(t.firstChild):""
    })
})

reverseBtn.addEventListener('click', () => {
    board.classList.toggle('reverse')
})
