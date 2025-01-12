// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'

import {mocked} from 'jest-mock'
import {Provider as ReduxProvider} from 'react-redux'

import Mutator, {mutator} from '../../mutator'
import {Utils} from '../../utils'

import {TestBlockFactory} from '../../test/testBlockFactory'
import {BoardGroup, IPropertyTemplate} from '../../blocks/board'
import {mockDOM, mockStateStore, wrapDNDIntl} from '../../testUtils'

import Tree from './tree'

const changeBlockParent = jest.spyOn(mutator, 'changeBlockParent')
const swapBlockParent = jest.spyOn(mutator, 'swapBlockParent')
const swapBlockChild = jest.spyOn(mutator, 'swapBlockChild')

jest.mock('../../mutator')
jest.mock('../../utils')
jest.mock('../../telemetry/telemetryClient')
const mockedUtils = mocked(Utils, true)
const mockedMutator = mocked(Mutator, true)

describe('src/components/tree/tree', () => {
    const board = TestBlockFactory.createBoard()
    board.id = 'board'
    const activeView = TestBlockFactory.createBoardView(board)
    activeView.fields.viewType = 'tree'

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
    const boardGroup: BoardGroup = {
        option: {
            color: 'propColorOrange',
            id: 'property_value_id_1',
            value: 'Q1',
        },
        cards: [card],
    }

    const state = {
        users: {
            me: {
                id: 'user_id_1',
                props: {},
            },
        },
        cards: {
            cards: [card1, card2],
            templates: [],
        },
        teams: {
            current: {id: 'team-id'},
        },
        boards: {
            current: 'board_id_1',
            boards: {
                board_id_1: {id: 'board_id_1'},
            },
            myBoardMemberships: {
                board_id_1: {userId: 'user_id_1', schemeAdmin: true},
            },
        },
        views: {
            views: {
                boardView: activeView,
            },
            current: 'boardView',
        },
        contents: {},
        comments: {
            comments: {},
        },
    }

    const store = mockStateStore([], state)
    beforeAll(() => {
        console.error = jest.fn()
        mockDOM()
    })
    beforeEach(jest.resetAllMocks)
    test('should generate treeList of one  card', () => {
        const cards = [card]
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={cards}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of no cards', () => {
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={[]}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of two nested cards', () => {
        const cards = [card1, card2]
        const boardGroup2: BoardGroup = {
            option: {
                color: 'propColorOrange',
                id: 'property_value_id_1',
                value: 'Q1',
            },
            cards: [card1, card2],
        }
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={cards}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup2]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})

        expect(container).toMatchSnapshot()
    })

    test('should generate treeList of two cards with drag', async () => {
        const cards = [card, card1]
        const boardGroup2: BoardGroup = {
            option: {
                color: 'propColorOrange',
                id: 'property_value_id_1',
                value: 'Q1',
            },
            cards: [card, card1],
        }
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={cards}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup2]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})
        const cardElement = screen.getByTestId('treecard-' + card.id)
        const card1Element = screen.getByTestId('treecard-' + card1.id)

        fireEvent.dragStart(cardElement)
        fireEvent.dragEnter(card1Element)
        fireEvent.dragOver(card1Element)
        fireEvent.drop(card1Element)
        await waitFor(async () => {
            expect(changeBlockParent).toBeCalledTimes(1)
        })
    })

    test('should generate treeList of two cards with parent swap drag', async () => {
        const cards = [card1, card2]
        const boardGroup2: BoardGroup = {
            option: {
                color: 'propColorOrange',
                id: 'property_value_id_1',
                value: 'Q1',
            },
            cards: [card1, card2],
        }
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={cards}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup2]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})
        const card1Element = screen.getByTestId('treecard-' + card1.id)
        const card2Element = screen.getByTestId('treecard-' + card2.id)

        fireEvent.dragStart(card2Element)
        fireEvent.dragEnter(card1Element)
        fireEvent.dragOver(card1Element)
        fireEvent.drop(card1Element)
        await waitFor(async () => {
            expect(swapBlockParent).toBeCalledTimes(1)
        })
    })

    test('should generate treeList of two cards with parent swap drag', async () => {
        const cards = [card1, card2]
        const boardGroup2: BoardGroup = {
            option: {
                color: 'propColorOrange',
                id: 'property_value_id_1',
                value: 'Q1',
            },
            cards: [card1, card2],
        }
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <Tree
                    board={board}
                    cards={cards}
                    readonly={false}
                    activeView={activeView}
                    addCard={jest.fn()}
                    showCard={jest.fn()}
                    hiddenCardsCount={0}
                    cardIdToFocusOnRender={''}
                    onCardClicked={jest.fn()}
                    selectedCardIds={[]}
                    showHiddenCardCountNotification={jest.fn()}
                    views={[activeView]}
                    visibleGroups={[boardGroup2]}
                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})
        const card1Element = screen.getByTestId('treecard-' + card1.id)
        const card2Element = screen.getByTestId('treecard-' + card2.id)

        fireEvent.dragStart(card1Element)
        fireEvent.dragEnter(card2Element)
        fireEvent.dragOver(card2Element)
        fireEvent.drop(card2Element)
        await waitFor(async () => {
            expect(swapBlockChild).toBeCalledTimes(1)
        })
    })
})
