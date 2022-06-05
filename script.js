let board = document.getElementById('board');

const setupBoard = {
    setup() {
        for (let i = 1; i <= 4; ++i) {
            this.whiteFirst(2 * i - 1)
            this.blackFirst(2 * i)
        }
        startGame()
    },
    whiteFirst(n) {
        for (i = 1; i <= 8; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.dataset.number = n.toString() + i;
            (i % 2 == 0) ? tile.style.backgroundColor = 'black': '';
            board.appendChild(tile);
        }
    },

    blackFirst(n) {
        for (i = 1; i <= 8; i++) {
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.dataset.number = n.toString() + i;
            (i % 2 == 1) ? tile.style.backgroundColor = 'black': '';
            board.appendChild(tile);
        }
    }

}

function startGame() {
    black.forEach(p => {
        let piece = document.createElement('img')
        piece.src = p.src
        piece.setAttribute("draggable",true)
        piece.classList.add('piece')
        let locations = document.getElementsByClassName('tile')

        
        Array.from(locations).forEach(l =>{
            console.log(p.position.indexOf(13))
            if(p.position.indexOf(13)){
                l.appendChild(piece)
            }
        })
    })
}

const black = [
    bishop = {
        src: 'images/b_bishop.png',
        position: [13,16]
    },
    king = {
        src: '',
        position: [14]
    },
]

setupBoard.setup()