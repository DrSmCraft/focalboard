// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback, useMemo} from 'react'

import {Board, BoardGroup, IPropertyOption, IPropertyTemplate} from '../../blocks/board'
import {BoardView} from '../../blocks/boardView'
import {Card} from '../../blocks/card'
import {Constants, Permission} from '../../constants'
import mutator from '../../mutator'
import {IDType, Utils} from '../../utils'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {useHasCurrentBoardPermissions} from '../../hooks/permissions'

import './tree.scss'
import TreeList from './treeList'
import CardsAdjacencyList from './cardsAdjacencyList'

import {useDrop} from 'react-dnd'

type Props = {
    selectedCardIds: string[]
    board: Board
    cards: Card[]
    activeView: BoardView
    views: BoardView[]
    visibleGroups: BoardGroup[]
    groupByProperty?: IPropertyTemplate
    readonly: boolean
    cardIdToFocusOnRender: string
    showCard: (cardId?: string) => void
    addCard: (groupByOptionId?: string) => Promise<void>
    onCardClicked: (e: React.MouseEvent, card: Card) => void
    hiddenCardsCount: number
    showHiddenCardCountNotification: (show: boolean) => void
}

const Tree = (props: Props): JSX.Element => {
    const {board, cards, activeView, visibleGroups, groupByProperty, views, hiddenCardsCount} = props
    const isManualSort = activeView.fields.sortOptions?.length === 0
    const canEditBoardProperties = useHasCurrentBoardPermissions([Permission.ManageBoardProperties])
    const canEditCards = useHasCurrentBoardPermissions([Permission.ManageBoardCards])
    const dispatch = useAppDispatch()
    const visibleBadges = activeView.fields.visiblePropertyIds.includes(Constants.badgesColumnId)
    const visiblePropertyTemplates = useMemo(() => {
        return board.cardProperties.filter(
            (template: IPropertyTemplate) => activeView.fields.visiblePropertyIds.includes(template.id),
        )
    }, [board.cardProperties, activeView.fields.visiblePropertyIds])

    const onDropToCard = useCallback(async (srcCard: Card, dstCard: Card) => {
        if (srcCard === dstCard) {
            return
        }

        // Utils.log(`before srcCard.parentId=${srcCard.parentId} src.id=${srcCard.id} dstCard.parentId=${dstCard.parentId} dstCard.id=${dstCard.id}`);
        Utils.log(`onDropToCard: ${dstCard.title}`)

        if (srcCard.parentId == dstCard.id) {
            Utils.log('Immediate parent swap!!!!!')

            // await mutator.changeBlockParent(board.id, srcCard.id, srcCard.parentId, dstCard.parentId);
            // await mutator.changeBlockParent(board.id, dstCard.id, dstCard.parentId, srcCard.id);
            await mutator.swapBlockParent(board.id, srcCard, dstCard)
            return
        }
        if (srcCard.id == dstCard.parentId) {
            Utils.log('Immediate child swap!!!!!')
            await mutator.swapBlockChild(board.id, srcCard, dstCard)
            return
        }

        await mutator.changeBlockParent(board.id, srcCard.id, srcCard.parentId, dstCard.id)

        // Utils.log(`after srcCard.parentId=${srcCard.parentId} src.id=${srcCard.id} dstCard.parentId=${dstCard.parentId} dstCard.id=${dstCard.id}`);

        // onDropToGroup(srcCard, dstCard.fields.properties[activeView.fields.groupById!] as string, dstCard.id);
    }, [activeView.fields.groupById, cards])

    const [{isOver}, onDropToBoard] = useDrop(() => ({
        accept: 'card',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop: (item: Card, monitor) => {
            if (monitor.isOver({shallow: true})) {
                // Set block's parent id to the board id
                mutator.changeBlockParent(board.id, item.id, item.parentId, board.id)
            }
        },
    }), [props])

    const propertyNameChanged = useCallback(async (option: IPropertyOption, text: string): Promise<void> => {
        await mutator.changePropertyOptionValue(board.id, board.cardProperties, groupByProperty!, option, text)
    }, [board, groupByProperty])

    const adjList = new CardsAdjacencyList(cards)

    const visited: string[] = []
    const visibleCards: string[] = []

    const rootChildren: Card[] = adjList.getChildren(board.id)
    visibleGroups.forEach((g) => g.cards.forEach((c) => visibleCards.push(c.id)))

    return (
        <div
            className='Tree'
            ref={onDropToBoard}
        >
            {rootChildren.filter((c) => visibleCards.includes(c.id)).map((card) =>
                (<TreeList
                    key={Utils.createGuid(IDType.None)}
                    board={board}
                    cards={cards}
                    matrix={adjList}
                    card={card}
                    visited={visited}
                    root={true}
                    onDrop={onDropToCard}
                    onClick={props.onCardClicked}
                    showCard={props.showCard}
                    visibleBadges={visibleBadges}
                    visiblePropertyTemplates={visiblePropertyTemplates}
                    readonly={!canEditCards}
                />))
            }

        </div>

    )
}

export default Tree
