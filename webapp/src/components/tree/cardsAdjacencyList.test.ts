// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {TestBlockFactory} from '../../test/testBlockFactory'

import {Card} from '../../blocks/card'

import CardsAdjacencyList from './cardsAdjacencyList'

describe('cardsAdjacencyList tests', () => {
    const board = TestBlockFactory.createBoard()
    board.id = 'board'
    const card1 = TestBlockFactory.createCard(board)
    card1.id = 'card1'
    card1.parentId = board.id
    const card2 = TestBlockFactory.createCard(board)
    card2.id = 'card2'
    card2.parentId = board.id

    const card3 = TestBlockFactory.createCard(board)
    card3.id = 'card3'
    card3.parentId = 'card2'

    describe('empty list', () => {
        it('should return empty list for no cards', () => {
            const mat: CardsAdjacencyList = new CardsAdjacencyList([])
            const result = mat.getCardIds()
            const result2 = mat.getChildren('id')
            expect(result).toStrictEqual([])
            expect(result2).toStrictEqual([])
        })
    })

    describe('single card', () => {
        it('should return two ids for single card', () => {
            const cards: Card[] = [card1]
            const mat: CardsAdjacencyList = new CardsAdjacencyList(cards)
            const result = mat.getCardIds()
            expect(result).toHaveLength(2)
            expect(result).toContain('board')
            expect(result).toContain('card1')
        })
    })

    describe('board with two card children', () => {
        it('should return two children for board', () => {
            const cards: Card[] = [card1, card2]
            const mat: CardsAdjacencyList = new CardsAdjacencyList(cards)
            const result = mat.getCardIds()
            const result1 = mat.getChildren('board').map((c) => c.id)
            const result2 = mat.getChildren('card1').map((c) => c.id)
            const result3 = mat.getChildren('card2').map((c) => c.id)

            expect(result).toHaveLength(3)
            expect(result).toContain('card1')
            expect(result).toContain('card2')
            expect(result).toContain('board')

            expect(result1).toHaveLength(2)

            expect(result1).toContain('card1')
            expect(result1).toContain('card2')

            expect(result2).toStrictEqual([])
            expect(result3).toStrictEqual([])
        })
    })

    describe('board with two card nested children', () => {
        it('should return two children for board', () => {
            const cards: Card[] = [card1, card2, card3]
            const mat: CardsAdjacencyList = new CardsAdjacencyList(cards)
            const result = mat.getCardIds()
            const result1 = mat.getChildren('board').map((c) => c.id)
            const result2 = mat.getChildren('card1').map((c) => c.id)
            const result3 = mat.getChildren('card2').map((c) => c.id)
            const result4 = mat.getChildren('card3').map((c) => c.id)

            expect(result).toHaveLength(4)
            expect(result).toContain('card1')
            expect(result).toContain('card2')
            expect(result).toContain('card3')
            expect(result).toContain('board')

            expect(result1).toHaveLength(2)

            expect(result1).toContain('card1')
            expect(result1).toContain('card2')

            expect(result2).toStrictEqual([])
            expect(result3).toHaveLength(1)
            expect(result3).toContain('card3')

            expect(result4).toStrictEqual([])
        })
    })
})
