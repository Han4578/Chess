import {determineBishopMoves} from './bishop.js'
import {determineRookMoves} from './rook.js'

export function determineQueenMoves(piece, l, purpose) {
    determineBishopMoves(piece, l, purpose)
    determineRookMoves(piece, l, purpose)
    
}

