// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react'
import {render, screen, within} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MemoryRouter} from 'react-router-dom'

import {Provider as ReduxProvider} from 'react-redux'

import userEvent from '@testing-library/user-event'

import {mocked} from 'jest-mock'

import Mutator from '../../mutator'
import {Utils} from '../../utils'

import {TestBlockFactory} from '../../test/testBlockFactory'
import {IPropertyTemplate} from '../../blocks/board'
import {mockStateStore, wrapDNDIntl} from '../../testUtils'

import TreeCard from './treeCard'

jest.mock('../../mutator')
jest.mock('../../utils')
jest.mock('../../telemetry/telemetryClient')
const mockedUtils = mocked(Utils, true)
const mockedMutator = mocked(Mutator, true)

describe('src/components/tree/treeList', () => {
    const board = TestBlockFactory.createBoard()
    const card = TestBlockFactory.createCard(board)
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
    const state = {
        cards: {
            cards: [card],
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
        contents: {},
        comments: {
            comments: {},
        },
        users: {
            me: {
                id: 'user_id_1',
                props: {},
            },
        },
    }
    const store = mockStateStore([], state)
    beforeEach(jest.clearAllMocks)

    test('return treeCard and click on copy link menu ', () => {
        const {container} = render(wrapDNDIntl(
            <ReduxProvider store={store}>
                <TreeCard
                    card={card}
                    board={board}
                    visiblePropertyTemplates={[propertyTemplate]}
                    visibleBadges={false}
                    isSelected={false}
                    readonly={false}
                    onDrop={jest.fn()}
                    showCard={jest.fn()}
                    isManualSort={false}
                    visited={[]}

                />
            </ReduxProvider>,
        ), {wrapper: MemoryRouter})
        const elementMenuWrapper = screen.getByRole('button', {name: 'menuwrapper'})
        expect(elementMenuWrapper).not.toBeNull()
        userEvent.click(elementMenuWrapper)
        expect(container).toMatchSnapshot()
        const elementButtonCopyLink = within(elementMenuWrapper).getByRole('button', {name: 'Copy link'})
        expect(elementButtonCopyLink).not.toBeNull()
        userEvent.click(elementButtonCopyLink)
        expect(mockedUtils.copyTextToClipboard).toBeCalledTimes(1)
    })
})
