// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react'
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'

import {mocked} from 'jest-mock'

import Mutator from '../../mutator'
import {Utils} from '../../utils'

import {TestBlockFactory} from '../../test/testBlockFactory'
import {IPropertyTemplate} from '../../blocks/board'
import {wrapDNDIntl} from '../../testUtils'

import TreeList from './treeList'
import CardsAdjacencyList from './cardsAdjacencyList'

jest.mock('../../mutator')
jest.mock('../../utils')
jest.mock('../../telemetry/telemetryClient')
const mockedUtils = mocked(Utils, true)
const mockedMutator = mocked(Mutator, true)

describe('src/components/tree/treeList', () => {
    const board = TestBlockFactory.createBoard()
    board.id = 'board'
    const card = TestBlockFactory.createCard(board)
    card.id = 'id'
    card.parentId = board.id

    const card1 = TestBlockFactory.createCard(board)
    card1.id = 'id1'
    card1.parentId = board.id
    const card2 = TestBlockFactory.createCard(board)
    card2.id = 'id2'
    card2.parentId = card1.id

    const propertyTemplate: IPropertyTemplate = {
        id: 'id',
        name: 'name',
        type: 'text',
        options: [
            {
                color: 'propColorOrange',
                id: 'property_value_id_1',
                value: 'Q1',
            },
            {
                color: 'propColorBlue',
                id: 'property_value_id_2',
                value: 'Q2',
            },
        ],
    }

    test('should generate treeList of one  card', () => {
        const cards = [card]
        const matrix = new CardsAdjacencyList(cards)
        const {container} = render(wrapDNDIntl(
            <TreeList
                card={card}
                board={board}
                cards={cards}
                visiblePropertyTemplates={[propertyTemplate]}
                visibleBadges={false}
                readonly={false}
                visited={[]}
                matrix={matrix}
                root={true}
            />,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of no cards', () => {
        const cards = [card]
        const matrix = new CardsAdjacencyList(cards)
        const {container} = render(wrapDNDIntl(
            <TreeList
                card={card}
                board={board}
                cards={cards}
                visiblePropertyTemplates={[propertyTemplate]}
                visibleBadges={false}
                readonly={false}
                visited={[card.id]}
                matrix={matrix}
                root={true}
            />,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of two nested cards', () => {
        const cards = [card1, card2]
        const matrix = new CardsAdjacencyList(cards)
        const {container} = render(wrapDNDIntl(

            <TreeList
                card={card1}
                board={board}
                cards={cards}
                visiblePropertyTemplates={[propertyTemplate]}
                visibleBadges={false}
                readonly={false}
                visited={[]}
                matrix={matrix}
                root={true}
            />,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of one card card', () => {
        const cards = [card, card1, card2]
        const matrix = new CardsAdjacencyList(cards)
        const {container} = render(wrapDNDIntl(

            <TreeList
                card={card}
                board={board}
                cards={cards}
                visiblePropertyTemplates={[propertyTemplate]}
                visibleBadges={false}
                readonly={false}
                visited={[]}
                matrix={matrix}
                root={true}
            />,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })
})
