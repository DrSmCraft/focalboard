// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {TestBlockFactory} from '../test/testBlockFactory'

import {createPatchesFromBlocks, createBlock} from './block'
import CardsAdjacencyList from './cardsAdjacencyList'

describe('cardsAdjacencyList tests', () => {
    // const board = TestBlockFactory.createBoard()
    // const card = TestBlockFactory.createCard(board)

    describe('return empty list for no cards', () => {
        it('return empty list for no cards', () => {
            const mat: CardsAdjacencyList = new CardsAdjacencyList([])
            const result = mat.getCardIds()
            const result2 = mat.getChildren('id')
            expect(result).toStrictEqual([])
            expect(result2).toStrictEqual([])
        })
    })
})
